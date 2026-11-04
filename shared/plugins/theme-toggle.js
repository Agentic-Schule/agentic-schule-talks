// Hell und Dunkel: Taste D schaltet um.
// Reihenfolge der Quellen: URL-Parameter ?theme=light|dark, dann die letzte Wahl (localStorage), sonst dunkel.
// Hell ist das angular.schule-Design mit agentic.schule-Logo, dunkel ist agentic.schule.
const STORAGE_KEY = 'agentic-talks-theme';

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

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
}

export function applyInitialTheme() {
  const fromUrl = new URLSearchParams(location.search).get('theme');
  const theme = fromUrl === 'light' || fromUrl === 'dark' ? fromUrl : readStored() || 'dark';
  setTheme(theme);
}

export const ThemeToggle = {
  id: 'agentic-theme-toggle',
  init(deck) {
    deck.addKeyBinding({ keyCode: 68, key: 'D', description: 'Hell/Dunkel umschalten' }, () => {
      const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
      setTheme(next);
      store(next);
    });
  },
};
