// Quellen als Fußzeile: Jede Folie schreibt ihre Belege als <p class="source"> in den Inhalt.
// Auf dem Bildschirm zeigt dieses Plugin sie klein am unteren Rand, zwischen Logo und rechtem Rand,
// immer an derselben Stelle. Im Folieninhalt sind sie dann ausgeblendet (html.source-footer).
// Im PDF (?print-pdf) bleiben sie im Inhalt der jeweiligen Seite, dort gibt es keine Fußzeile.
export const SourceFooter = {
  id: 'agentic-source-footer',
  init(deck) {
    if (deck.isPrintView?.() || /print-pdf/.test(location.search)) return;
    document.documentElement.classList.add('source-footer');

    const footer = document.createElement('div');
    footer.className = 'slide-sources';
    footer.setAttribute('aria-live', 'polite');
    deck.getRevealElement().append(footer);

    const update = () => {
      const slide = deck.getCurrentSlide();
      const sources = slide ? [...slide.querySelectorAll('.source')] : [];
      footer.replaceChildren(...sources.map((el) => {
        const line = document.createElement('div');
        line.innerHTML = el.innerHTML;
        return line;
      }));
      footer.hidden = sources.length === 0;
    };

    // Die Fußzeile skaliert mit der Folie, damit sie auf jedem Bildschirm gleich groß wirkt
    const layout = () => {
      const scale = deck.getScale();
      footer.style.setProperty('--footer-scale', String(scale));
    };

    deck.on('ready', () => { layout(); update(); });
    deck.on('slidechanged', update);
    deck.on('resize', layout);
  },
};
