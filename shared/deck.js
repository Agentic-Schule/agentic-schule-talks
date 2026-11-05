// Gemeinsamer Einstieg für alle Decks: lädt reveal.js, die Plugins, das agentic.schule-Theme
// und baut die Folien aus der Markdown-Datei des Talks.
import Reveal from 'reveal.js';
import Markdown from 'reveal.js/plugin/markdown';
import Highlight from 'reveal.js/plugin/highlight';
import Notes from 'reveal.js/plugin/notes';
import Zoom from 'reveal.js/plugin/zoom';
import Search from 'reveal.js/plugin/search';

import 'reveal.js/reset.css';
import 'reveal.js/reveal.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/400-italic.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/700.css';
import '@fontsource/inter-tight/500.css';
import '@fontsource/inter-tight/700.css';
import './theme/agentic.css';
import './theme/code.css';

import { ThemeToggle, applyInitialTheme } from './plugins/theme-toggle.js';
import { LiveEdit } from './plugins/live-edit.js';
import { CodeSize } from './plugins/code-size.js';
import { terminalPrompts } from './plugins/terminal.js';
import { inlineSvgs, resolveAssets } from './plugins/inline-svg.js';
import { QrCodes } from './plugins/qr.js';
import { ViewTransitions } from './plugins/view-transitions.js';
import { applyMotionPreference } from './plugins/motion.js';
import { LayoutCheck } from './plugins/layout-check.js';

export { svgMap, assetMap } from './plugins/inline-svg.js';

/**
 * @param {string} markdown  Inhalt der slides.md (per `import md from './slides.md?raw'`)
 * @param {object} [options] zusätzliche reveal.js-Optionen, überschreiben die Vorgaben;
 *   options.svgs: { name: svgText } für <div data-svg="name"></div> (siehe plugins/inline-svg.js)
 *   options.assets: { 'datei.webp': url } für src="img/datei.webp" im Markdown
 */
export function createDeck(markdown, { svgs, assets, ...options } = {}) {
  applyInitialTheme();
  const reduced = applyMotionPreference();

  const slides = document.querySelector('.reveal .slides');
  const section = document.createElement('section');
  section.setAttribute('data-markdown', '');
  const template = document.createElement('textarea');
  template.setAttribute('data-template', '');
  template.textContent = resolveAssets(inlineSvgs(markdown, svgs), assets);
  section.append(template);
  slides.append(section);

  const logo = document.createElement('div');
  logo.className = 'brand-logo';
  logo.setAttribute('aria-hidden', 'true');
  document.querySelector('.reveal').append(logo);

  const deck = new Reveal({
    width: 1280,
    height: 720,
    margin: 0.06,
    hash: true,
    controls: false,
    progress: true,
    slideNumber: 'c/t',
    showSlideNumber: 'speaker',
    center: true,
    transition: reduced ? 'none' : 'slide',
    backgroundTransition: reduced ? 'none' : 'fade',
    markdown: {
      separator: '\\r?\\n---\\r?\\n',
      verticalSeparator: '\\r?\\n--\\r?\\n',
      notesSeparator: '^Note:',
    },
    highlight: {
      beforeHighlight: terminalPrompts,
    },
    // PDF: eine Seite pro Folie mit allen Fragmenten, Seitenzahlen unten rechts
    pdfSeparateFragments: false,
    pdfMaxPagesPerSlide: 1,
    plugins: [Markdown, Highlight, Notes, Zoom, Search, ThemeToggle, LiveEdit, CodeSize, QrCodes, ViewTransitions, LayoutCheck],
    ...options,
  });

  deck.initialize();
  return deck;
}
