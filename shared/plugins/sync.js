// Abgleich zwischen Hauptfenster und Sprecheransicht (deren Vorschau-Fenster mit ?receiver).
// Theme und Code-Größe gehören nicht zum Zustand von reveal.js und werden deshalb über einen
// BroadcastChannel an alle offenen Fenster desselben Decks verteilt, gleich wo die Taste fiel.
const channel = typeof BroadcastChannel === 'function' ? new BroadcastChannel(`agentic-talks:${location.pathname}`) : null;

export function broadcast(type, data) {
  channel?.postMessage({ type, ...data });
}

export function onBroadcast(type, handler) {
  channel?.addEventListener('message', (event) => {
    if (event.data?.type === type) handler(event.data);
  });
}
