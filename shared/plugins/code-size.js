// Schriftgröße von Code.
// Fest pro Block über das Info-String-Wort hinter der Sprache: ```ts big
//   Stufen: tiny, small, medium, big, huge (siehe theme/code.css)
// Live im Vortrag: + und - skalieren den Code der aktuellen Folie, 0 setzt zurück.
// Die Größe gilt in allen Fenstern (Sprecheransicht, plugins/sync.js).
import { broadcast, onBroadcast } from './sync.js';

const STEP = 0.1;

function scaleCurrent(deck, delta) {
  const slide = deck.getCurrentSlide();
  const current = parseFloat(slide.style.getPropertyValue('--code-scale')) || 1;
  const next = delta === 0 ? 1 : Math.min(2.5, Math.max(0.4, current + delta));
  const value = next.toFixed(2);
  slide.style.setProperty('--code-scale', value);
  const { h, v } = deck.getIndices(slide);
  broadcast('code-scale', { h, v, value });
}

export const CodeSize = {
  id: 'agentic-code-size',
  init(deck) {
    onBroadcast('code-scale', ({ h, v, value }) => deck.getSlide(h, v)?.style.setProperty('--code-scale', value));
    // + und - liegen je nach Browser und Tastaturlayout auf verschiedenen keyCodes.
    const bind = (keyCodes, key, description, delta) =>
      keyCodes.forEach((keyCode, i) =>
        deck.addKeyBinding(i === 0 ? { keyCode, key, description } : keyCode, () => scaleCurrent(deck, delta)),
      );
    bind([187, 171, 107], '+', 'Code auf dieser Folie größer', STEP);
    bind([189, 173, 109], '-', 'Code auf dieser Folie kleiner', -STEP);
    bind([48, 96], '0', 'Code-Größe zurücksetzen', 0);
  },
};
