// Live-Bearbeitung während des Vortrags.
// - Codeblöcke sind immer bearbeitbar: hineinklicken und tippen. Beim Verlassen färbt
//   das Highlight-Plugin den Code neu ein (focusout). Blöcke mit Zeilen-Highlights
//   ([1-3|5]) bleiben gesperrt, weil ihre Tabellenstruktur beim Tippen zerbricht.
// - Taste E macht die ganze aktuelle Folie bearbeitbar, Esc beendet die Bearbeitung.
// - Elemente mit data-sticky="name" merken sich ihren Inhalt (localStorage, je Deck).
//   Gedacht für Eventname und Datum auf der Titelfolie. ?reset-edits löscht alles Gemerkte.
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
    el.contentEditable = 'true';
    el.spellcheck = false;
    const key = prefix() + el.dataset.sticky;
    const saved = store.getItem(key);
    if (saved !== null) el.innerHTML = saved;
    el.addEventListener('input', () => store.setItem(key, el.innerHTML));
  });
}

function makeCodeEditable(root) {
  root.querySelectorAll('pre code').forEach((code) => {
    if (code.hasAttribute('data-line-numbers')) return;
    code.contentEditable = 'true';
    code.spellcheck = false;
  });
}

export const LiveEdit = {
  id: 'agentic-live-edit',
  init(deck) {
    let editing = null;

    const stopEditing = () => {
      if (!editing) return;
      editing.removeAttribute('contenteditable');
      editing.classList.remove('is-editing');
      editing = null;
    };

    deck.on('ready', () => {
      const root = deck.getRevealElement();
      makeCodeEditable(root);
      restoreSticky(root);
    });

    deck.on('slidechanged', stopEditing);

    deck.addKeyBinding({ keyCode: 69, key: 'E', description: 'Aktuelle Folie bearbeiten (Esc beendet)' }, () => {
      const slide = deck.getCurrentSlide();
      stopEditing();
      editing = slide;
      slide.contentEditable = 'true';
      slide.spellcheck = false;
      slide.classList.add('is-editing');
      slide.focus();
    });

    // reveal.js ignoriert Tasten, solange ein bearbeitbares Element den Fokus hat.
    // Esc verlässt deshalb hier die Bearbeitung, danach steuert die Tastatur wieder die Folien.
    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      const active = document.activeElement;
      if (active && active.isContentEditable) {
        active.blur();
        stopEditing();
        event.preventDefault();
      }
    });
  },
};
