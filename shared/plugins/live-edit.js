// Live-Bearbeitung während des Vortrags: jede Folie ist immer bearbeitbar.
// - Hineinklicken und tippen. Esc oder ein Klick neben die Folie beendet die Bearbeitung,
//   danach steuert die Tastatur wieder die Folien (reveal.js ignoriert Tasten, solange
//   ein bearbeitbares Element den Fokus hat).
// - Clicker und Pfeiltasten bleiben trotzdem bedienbar: PageUp/PageDown blättern immer,
//   die Pfeiltasten, solange seit dem Hineinklicken nichts getippt wurde. Dafür gibt das
//   Plugin den Fokus ab, bevor reveal.js die Taste sieht.
// - Geänderte Codeblöcke werden beim Verlassen der Folie neu eingefärbt.
//   Blöcke mit Zeilen-Highlights ([1-3|5]) bleiben gesperrt, weil ihre Tabellenstruktur
//   beim Tippen zerbricht.
// - Änderungen sind flüchtig, ein Neuladen stellt die Folie wieder her.
// - Aus in der Sprecheransicht (Vorschau-Fenster mit ?receiver) und auf Touch-Geräten,
//   dort würde ein Tippen auf die Folie die Bildschirmtastatur öffnen.
const ALWAYS_NAVIGATE = new Set(['PageDown', 'PageUp']);
const NAVIGATE_UNTIL_TYPED = new Set(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown']);

function makeEditable(root) {
  root.querySelectorAll('.slides section').forEach((section) => {
    if (section.querySelector('section')) return; // nur Folien, keine vertikalen Stapel
    section.contentEditable = 'true';
    section.spellcheck = false;
  });
  root.querySelectorAll('pre code[data-line-numbers]').forEach((code) => {
    code.contentEditable = 'false';
  });
}

// highlight.js überspringt bereits eingefärbte Elemente, deshalb vorher zurücksetzen
function rehighlight(deck, code) {
  const hljs = deck.getPlugin('highlight')?.hljs;
  if (!hljs) return;
  code.textContent = code.textContent;
  delete code.dataset.highlighted;
  hljs.highlightElement(code);
}

function codeAtCaret() {
  const node = window.getSelection()?.anchorNode;
  const el = node && (node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement);
  return el?.closest('pre code') ?? null;
}

export const LiveEdit = {
  id: 'agentic-live-edit',
  init(deck) {
    if (/receiver/i.test(location.search) || window.matchMedia?.('(pointer: coarse)').matches) return;
    const dirty = new Set();
    let typed = false;

    deck.on('ready', () => {
      const root = deck.getRevealElement();
      makeEditable(root);
      root.addEventListener('focusin', () => {
        typed = false;
      });
      root.addEventListener('input', () => {
        typed = true;
        const code = codeAtCaret();
        if (code) dirty.add(code);
      });
      // Enter im Code fügt einen echten Zeilenumbruch ein statt <div>/<br>,
      // sonst verschwinden neue Zeilen beim Neu-Einfärben
      root.addEventListener('keydown', (event) => {
        const code = event.key === 'Enter' && codeAtCaret();
        if (!code) return;
        event.preventDefault();
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        range.deleteContents();
        const newline = document.createTextNode('\n');
        range.insertNode(newline);
        // Ein Umbruch ganz am Ende wird nicht dargestellt: dann einen zweiten anhängen
        const rest = document.createRange();
        rest.setStartAfter(newline);
        rest.setEnd(code, code.childNodes.length);
        if (rest.toString() === '') newline.after(document.createTextNode('\n'));
        range.setStartAfter(newline);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
        dirty.add(code);
      });
      root.addEventListener('focusout', () => {
        // Fenster verliert nur den Fokus (etwa zur Sprecheransicht): weiter bearbeiten können
        if (!document.hasFocus()) return;
        dirty.forEach((code) => rehighlight(deck, code));
        dirty.clear();
      });
    });

    // Beim Folienwechsel per Klick (Übersicht, Fortschrittsbalken) den Fokus abgeben
    deck.on('slidechanged', () => {
      const active = document.activeElement;
      if (active && active.isContentEditable) active.blur();
    });

    // Läuft vor reveal.js (Capture): Fokus abgeben, dann verarbeitet reveal.js die Taste normal
    document.addEventListener('keydown', (event) => {
      const active = document.activeElement;
      if (!active?.isContentEditable) return;
      if (ALWAYS_NAVIGATE.has(event.key) || (!typed && NAVIGATE_UNTIL_TYPED.has(event.key))) {
        active.blur();
        window.getSelection()?.removeAllRanges();
      }
    }, true);

    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      const active = document.activeElement;
      if (active && active.isContentEditable) {
        active.blur();
        window.getSelection()?.removeAllRanges();
        event.preventDefault();
        event.stopPropagation();
      }
    }, true);
  },
};
