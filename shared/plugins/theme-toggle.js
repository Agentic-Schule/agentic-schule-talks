// Hell und Dunkel: dezenter Schalter oben rechts, dazu Taste D.
// Reihenfolge der Quellen: URL-Parameter ?theme=light|dark, dann die letzte Wahl (localStorage), sonst dunkel.
// Hell ist das angular.schule-Design mit agentic.schule-Logo, dunkel ist agentic.schule.
import { broadcast, onBroadcast } from './sync.js';

const STORAGE_KEY = 'agentic-talks-theme';

const ICON_SUN = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"/></svg>';
const ICON_MOON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11z"/></svg>';

function readStored() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function store(theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // ohne Speicher gilt die Wahl nur für diese Seite
  }
}

let button = null;

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  if (button) {
    // Das Symbol zeigt, wohin der Klick schaltet
    button.innerHTML = theme === 'light' ? ICON_MOON : ICON_SUN;
    const label = theme === 'light' ? 'Dunkel' : 'Hell';
    button.title = `${label} (Taste D)`;
    button.setAttribute('aria-label', `Auf ${label} umschalten`);
  }
}

function toggle() {
  const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
  setTheme(next);
  store(next);
  broadcast('theme', { theme: next });
}

export function applyInitialTheme() {
  const fromUrl = new URLSearchParams(location.search).get('theme');
  const theme = fromUrl === 'light' || fromUrl === 'dark' ? fromUrl : readStored() || 'dark';
  setTheme(theme);
}

export const ThemeToggle = {
  id: 'agentic-theme-toggle',
  init(deck) {
    button = document.createElement('button');
    button.type = 'button';
    button.className = 'theme-switch';
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      toggle();
      button.blur();
    });
    deck.getRevealElement().append(button);
    setTheme(document.documentElement.dataset.theme || 'dark');

    onBroadcast('theme', ({ theme }) => setTheme(theme));
    deck.addKeyBinding({ keyCode: 68, key: 'D', description: 'Hell/Dunkel umschalten' }, toggle);
  },
};
