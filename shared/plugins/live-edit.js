// Live-Bearbeitung während des Vortrags: jede Folie ist immer bearbeitbar.
// - Hineinklicken und tippen. Esc oder ein Klick neben die Folie beendet die Bearbeitung,
//   danach steuert die Tastatur wieder die Folien (reveal.js ignoriert Tasten, solange
//   ein bearbeitbares Element den Fokus hat).
// - Geänderte Codeblöcke werden beim Verlassen der Folie neu eingefärbt.
//   Blöcke mit Zeilen-Highlights ([1-3|5]) bleiben gesperrt, weil ihre Tabellenstruktur
//   beim Tippen zerbricht.
// - Änderungen sind flüchtig, ein Neuladen stellt die Folie wieder her. Ausnahme:
//   Elemente mit data-sticky="name" merken sich ihren Inhalt (localStorage, je Deck),
//   gedacht für Eventname und Datum auf der Titelfolie. ?reset-edits löscht alles Gemerkte.
const prefix = () => `agentic-talks:${location.pathname}:`;

function storage() {
  try {
    return localStorage;
  } catch {
    return null;
  }
}

function restoreSticky(root) {
  const store = storage();
  if (!store) return;
  if (new URLSearchParams(location.search).has('reset-edits')) {
    Object.keys(store)
      .filter((key) => key.startsWith(prefix()))
      .forEach((key) => store.removeItem(key));
  }
  root.querySelectorAll('[data-sticky]').forEach((el) => {
    const key = prefix() + el.dataset.sticky;
    const saved = store.getItem(key);
    if (saved !== null) el.innerHTML = saved;
    el.addEventListener('input', () => store.setItem(key, el.innerHTML));
  });
}

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
    const dirty = new Set();

    deck.on('ready', () => {
      const root = deck.getRevealElement();
      makeEditable(root);
      restoreSticky(root);
      root.addEventListener('input', () => {
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
        dirty.forEach((code) => rehighlight(deck, code));
        dirty.clear();
      });
    });

    // Beim Folienwechsel per Klick (Übersicht, Fortschrittsbalken) den Fokus abgeben
    deck.on('slidechanged', () => {
      const active = document.activeElement;
      if (active && active.isContentEditable) active.blur();
    });

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
