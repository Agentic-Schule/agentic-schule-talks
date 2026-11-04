import { defineConfig } from 'vite';
import { readdirSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

// Jeder Ordner mit einer index.html ist ein Deck und wird als eigene Seite gebaut.
const root = import.meta.dirname;
const skip = new Set(['node_modules', 'dist', 'shared']);
const decks = Object.fromEntries(
  readdirSync(root, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith('.') && !skip.has(d.name))
    .filter((d) => existsSync(resolve(root, d.name, 'index.html')))
    .map((d) => [d.name, resolve(root, d.name, 'index.html')]),
);
// Unterseiten eines Talks (Materialseite, Spickzettel): <talk>/<seite>/index.html
const subpages = Object.fromEntries(
  Object.keys(decks).flatMap((deck) =>
    readdirSync(resolve(root, deck), { withFileTypes: true })
      .filter((d) => d.isDirectory() && existsSync(resolve(root, deck, d.name, 'index.html')))
      .map((d) => [`${deck}-${d.name}`, resolve(root, deck, d.name, 'index.html')]),
  ),
);

export default defineConfig({
  base: './',
  server: { host: '127.0.0.1', port: 8000, open: false },
  build: {
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      input: { index: resolve(root, 'index.html'), ...decks, ...subpages },
    },
  },
});
