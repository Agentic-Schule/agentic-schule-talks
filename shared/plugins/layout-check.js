// Layout-Check: geht mit ?check alle Folien durch (alle Fragmente sichtbar) und meldet
//   overflow  Element ragt über die 1280×720-Folie hinaus
//   clipped   Inhalt wird in einem Kasten mit overflow abgeschnitten (etwa ein zu langer Codeblock)
//   overlap   zwei Geschwister-Elemente überdecken sich. Eine Prüfung über scrollHeight sieht das nicht,
//             etwa wenn sich Karten in einem Grid gegenseitig verdecken
//   small     Text kleiner als 22 px (Code: 20 px), gemessen in Folienkoordinaten
//   logo      Text oder Kasten liegt unter dem Logo unten links
// Ergebnis: Panel unten rechts (Klick springt zur Folie und markiert die Elemente),
// console.table und window.layoutCheck. Neu starten mit window.runLayoutCheck(). Absolut positionierte Elemente (Logo, Hervorhebungs-Klone
// im Code, QR-Codes) und SVG-Innereien werden nicht gegeneinander geprüft.
const MIN_TEXT = 21.5;
const MIN_CODE = 19.5;
const TOLERANCE = 2;

const frame = () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

function isRendered(el) {
  const style = getComputedStyle(el);
  if (style.display === 'none' || style.visibility === 'hidden') return false;
  const rect = el.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
}

function skip(el) {
  return el.closest('aside.notes, svg *, pre *, .brand-logo, [data-qr] *, .layout-check-panel');
}

function label(el) {
  const cls = [...el.classList].filter((c) => !c.startsWith('layout-check')).slice(0, 2).join('.');
  const text = (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40);
  return `${el.tagName.toLowerCase()}${cls ? '.' + cls : ''}${text ? ` „${text}“` : ''}`;
}

function intersection(a, b) {
  const w = Math.min(a.right, b.right) - Math.max(a.left, b.left);
  const h = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
  return w > 0 && h > 0 ? { w, h } : null;
}

function checkSlide(slide, stage, scale) {
  const findings = [];
  const add = (kind, els, detail) => findings.push({ kind, els, detail });
  const elements = [...slide.querySelectorAll('*')].filter((el) => !skip(el) && isRendered(el));

  for (const el of elements) {
    const r = el.getBoundingClientRect();
    const style = getComputedStyle(el);

    if (style.position !== 'fixed') {
      const out = Math.max(stage.left - r.left, r.right - stage.right, stage.top - r.top, r.bottom - stage.bottom) / scale;
      if (out > TOLERANCE) add('overflow', [el], `${Math.round(out)} px über den Folienrand`);
    }

    const clips = /(hidden|auto|scroll|clip)/.test(style.overflowX + style.overflowY);
    if (clips && el.tagName !== 'svg') {
      const dx = el.scrollWidth - el.clientWidth;
      const dy = el.scrollHeight - el.clientHeight;
      if (dx > TOLERANCE || dy > TOLERANCE) add('clipped', [el], `Inhalt abgeschnitten (${dx} × ${dy} px)`);
    }

    const ownText = [...el.childNodes].some((n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim());
    if (ownText && !el.closest('svg')) {
      const size = parseFloat(style.fontSize);
      const min = el.closest('pre, code') ? MIN_CODE : MIN_TEXT;
      if (size < min) add('small', [el], `${size.toFixed(1)} px`);
    }

    const kids = [...el.children].filter((k) => {
      if (skip(k) || !isRendered(k)) return false;
      const s = getComputedStyle(k);
      return s.position !== 'absolute' && s.position !== 'fixed' && s.display !== 'inline';
    });
    for (let i = 0; i < kids.length; i++) {
      for (let j = i + 1; j < kids.length; j++) {
        const hit = intersection(kids[i].getBoundingClientRect(), kids[j].getBoundingClientRect());
        if (hit && hit.w / scale > TOLERANCE && hit.h / scale > TOLERANCE) {
          add('overlap', [kids[i], kids[j]], `${Math.round(hit.w / scale)} × ${Math.round(hit.h / scale)} px überdeckt`);
        }
      }
    }
  }

  const logo = document.querySelector('.brand-logo');
  // Auf Titel-, Kapitel- und Schlussfolien ist das Logo ausgeblendet
  const logoHidden = document.querySelector('.reveal-viewport')?.matches('.title, .chapter, .end');
  if (logo && isRendered(logo) && !logoHidden) {
    const lr = logo.getBoundingClientRect();
    for (const el of elements) {
      if (el.children.length && !el.matches('pre, li, p, h1, h2, h3, img, table')) continue;
      const hit = intersection(el.getBoundingClientRect(), lr);
      if (hit && hit.w / scale > TOLERANCE && hit.h / scale > TOLERANCE) add('logo', [el], 'liegt unter dem Logo');
    }
  }

  // Ein überlaufendes Kind lässt auch alle Eltern überlaufen: nur das innerste Element melden
  return findings.filter((f) => f.kind !== 'overflow' || !findings.some((o) => o !== f && o.kind === 'overflow' && f.els[0].contains(o.els[0])));
}

function showPanel(deck, results) {
  document.querySelector('.layout-check-panel')?.remove();
  const panel = document.createElement('div');
  panel.className = 'layout-check-panel';
  const count = results.reduce((n, r) => n + r.findings.length, 0);
  panel.innerHTML = `<strong>Layout-Check: ${count ? `${count} Befunde` : 'keine Befunde'}</strong>`;
  for (const r of results) {
    for (const f of r.findings) {
      const row = document.createElement('div');
      const link = document.createElement('a');
      link.textContent = `${r.number} ${f.kind}`;
      link.onclick = () => {
        document.querySelectorAll('.layout-check-mark').forEach((m) => m.classList.remove('layout-check-mark'));
        deck.slide(r.indices.h, r.indices.v, Number.MAX_SAFE_INTEGER);
        f.els.forEach((el) => el.classList.add('layout-check-mark'));
      };
      row.append(link, ` ${f.detail}: ${f.els.map(label).join(' ↔ ')}`);
      panel.append(row);
    }
  }
  document.body.append(panel);
}

export const LayoutCheck = {
  id: 'agentic-layout-check',
  init(deck) {
    this.run = async () => {
      await document.fonts.ready;
      const results = [];
      const slides = deck.getSlides();
      for (const [i, slide] of slides.entries()) {
        const indices = deck.getIndices(slide);
        deck.slide(indices.h, indices.v);
        const added = [...slide.querySelectorAll('.fragment:not(.visible)')];
        added.forEach((f) => f.classList.add('visible'));
        await frame();
        const stage = deck.getSlidesElement().getBoundingClientRect();
        const findings = checkSlide(slide, stage, deck.getScale());
        added.forEach((f) => f.classList.remove('visible'));
        const title = slide.querySelector('h1, h2, h3')?.textContent.trim() ?? '';
        if (findings.length) results.push({ number: `${i + 1}/${slides.length}`, indices, title, findings });
      }
      deck.slide(0, 0);
      window.layoutCheck = results;
      console.table(results.flatMap((r) => r.findings.map((f) => ({ slide: r.number, title: r.title, kind: f.kind, detail: f.detail, elements: f.els.map(label).join(' ↔ ') }))));
      showPanel(deck, results);
      return results;
    };

    if (new URLSearchParams(location.search).has('check')) {
      window.runLayoutCheck = this.run;
      deck.on('ready', () => this.run());
    }
  },
};
