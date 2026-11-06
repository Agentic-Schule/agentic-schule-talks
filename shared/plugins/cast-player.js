// Terminal-Aufnahmen abspielen: <div class="cast" data-cast="casts/name.cast"></div>
// Das Format ist asciicast v2 (eine JSON-Zeile Kopf, dann [Sekunden, "o", Text]).
// Gespielt wird, sobald die Folie erscheint; ein Klick auf das Terminal startet neu.
// Längere Pausen werden auf IDLE_LIMIT gekürzt. Im PDF steht der Endzustand.
// Verstanden werden Farben und Schriftstile (SGR); Cursor-Steuerung wird ignoriert,
// ein einzelnes \r beginnt die Zeile neu (Fortschrittsanzeigen).
const IDLE_LIMIT = 1.2;

const COLORS = { 30: '#6e6a86', 31: 'var(--danger, #ff5c7a)', 32: 'var(--ok, #3ddc97)', 33: '#f6c177', 34: '#7aa2f7', 35: '#c4a7e7', 36: '#9ccfd8', 37: 'inherit', 90: '#908caa' };
const XTERM_172 = '#d78700';

function parseCast(text) {
  const [head, ...rest] = text.trim().split('\n');
  const events = rest.map((line) => JSON.parse(line)).filter((e) => e[1] === 'o');
  let shift = 0;
  let last = 0;
  return {
    header: JSON.parse(head),
    events: events.map(([t, , data]) => {
      const gap = t - last;
      if (gap > IDLE_LIMIT) shift += gap - IDLE_LIMIT;
      last = t;
      return [t - shift, data];
    }),
  };
}

// Baut aus dem bisherigen Ausgabestrom die Zeilen als HTML
function render(stream) {
  const lines = [[]];
  let style = {};
  let i = 0;
  const push = (ch) => lines[lines.length - 1].push({ ch, style: { ...style } });
  while (i < stream.length) {
    const c = stream[i];
    if (c === '\x1b') {
      const m = /^\x1b\[([0-9;?]*)([A-Za-z])/.exec(stream.slice(i));
      if (m) {
        if (m[2] === 'm') style = applySgr(style, m[1]);
        if (m[2] === 'K' || m[2] === 'G') lines[lines.length - 1] = [];
        i += m[0].length;
        continue;
      }
      i += 1;
      continue;
    }
    if (c === '\r' && stream[i + 1] === '\n') { lines.push([]); i += 2; continue; }
    if (c === '\n') { lines.push([]); i += 1; continue; }
    if (c === '\r') { lines[lines.length - 1] = []; i += 1; continue; }
    if (/[⠀-⣿]/.test(c)) { i += 1; continue; } // Spinner-Zeichen
    push(c);
    i += 1;
  }
  return lines.map((cells) => cells.map(({ ch, style: s }) => span(ch, s)).join('')).join('\n');
}

function applySgr(style, params) {
  const codes = (params || '0').split(';').map(Number);
  const next = { ...style };
  for (let k = 0; k < codes.length; k++) {
    const n = codes[k];
    if (n === 0) Object.keys(next).forEach((key) => delete next[key]);
    else if (n === 1) next.bold = true;
    else if (n === 2) next.dim = true;
    else if (n === 4) next.underline = true;
    else if (COLORS[n]) next.color = COLORS[n];
    else if (n === 38 && codes[k + 1] === 5) { next.color = codes[k + 2] === 172 ? XTERM_172 : 'inherit'; k += 2; }
  }
  return next;
}

function span(ch, s) {
  const text = ch.replace(/[&<>]/g, (x) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[x]);
  if (!Object.keys(s).length) return text;
  const css = [
    s.color ? `color:${s.color}` : '',
    s.bold ? 'font-weight:700' : '',
    s.dim ? 'opacity:.65' : '',
    s.underline ? 'text-decoration:underline' : '',
  ].filter(Boolean).join(';');
  return `<span style="${css}">${text}</span>`;
}

function setup(el, deck) {
  const screen = document.createElement('code');
  screen.className = 'bash cast-screen';
  const pre = document.createElement('pre');
  pre.className = 'cast-term';
  pre.append(screen);
  el.append(pre);
  let cast = null;
  let timer = null;

  const show = (upto, tailOnly = false) => {
    let html = render(cast.events.slice(0, upto).map((e) => e[1]).join(''));
    // Im Druck gilt keine Scroll-Position: nur die letzten Zeilen, die ins Terminal passen
    if (tailOnly) {
      // Vor dem Layout der Druckansicht ist clientHeight noch 0, dann gilt die Höhe aus code.css
      const style = getComputedStyle(screen);
      const lineHeight = parseFloat(style.lineHeight) || 26;
      const height = screen.clientHeight || parseFloat(style.height) || 348;
      const fit = Math.max(1, Math.floor((height - 24) / lineHeight));
      html = html.split('\n').slice(-fit).join('\n');
    }
    screen.innerHTML = html;
    screen.scrollTop = screen.scrollHeight;
  };
  const stop = () => { clearTimeout(timer); timer = null; };
  const play = () => {
    if (!cast) return;
    stop();
    let k = 0;
    const start = performance.now();
    const tick = () => {
      const elapsed = (performance.now() - start) / 1000;
      while (k < cast.events.length && cast.events[k][0] <= elapsed) k++;
      show(k);
      if (k < cast.events.length) timer = setTimeout(tick, 30);
    };
    tick();
  };

  fetch(el.dataset.cast)
    .then((r) => r.text())
    .then((text) => {
      cast = parseCast(text);
      const printing = /print-pdf/.test(location.search);
      if (printing) show(cast.events.length, true);
      else if (!el.closest('section')?.classList.contains('present')) show(0);
      if (!printing && el.closest('section')?.classList.contains('present')) play();
    });

  pre.addEventListener('click', play);
  deck.on('slidechanged', (event) => {
    if (event.currentSlide === el.closest('section')) play();
    else stop();
  });
}

export const CastPlayer = {
  id: 'agentic-cast-player',
  init(deck) {
    deck.on('ready', () => {
      deck.getRevealElement().querySelectorAll('.cast[data-cast]').forEach((el) => setup(el, deck));
    });
  },
};
