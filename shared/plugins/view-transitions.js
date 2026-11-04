// View Transitions zwischen zwei Folien (Browser-API document.startViewTransition).
// Markdown: beide Folien bekommen <!-- .slide: data-view-transition data-transition="none" -->,
// Elemente, die sich verwandeln sollen, tragen auf beiden Folien dasselbe data-vt="name".
// Der Name gilt nur auf der aktuellen Folie, weil ein view-transition-name auf der ganzen
// Seite eindeutig sein muss und reveal.js die Nachbarfolien unsichtbar im DOM hält.
// Ohne Browser-Unterstützung (oder im PDF) wechseln die Folien ganz normal.
function setNames(slide, on) {
  slide?.querySelectorAll('[data-vt]').forEach((el) => {
    el.style.viewTransitionName = on ? `vt-${el.dataset.vt}` : '';
  });
}

export const ViewTransitions = {
  id: 'agentic-view-transitions',
  init(deck) {
    if (!document.startViewTransition) return;
    let running = false;

    deck.on('beforeslidechange', (event) => {
      if (running || deck.isPrintView?.()) return;
      const current = deck.getCurrentSlide();
      const { indexh, indexv } = event.data ?? event;
      const target = deck.getSlide(indexh, indexv ?? 0);
      if (!target || target === current) return;
      if (!current?.hasAttribute('data-view-transition') || !target.hasAttribute('data-view-transition')) return;

      event.preventDefault();
      running = true;
      setNames(current, true);
      const transition = document.startViewTransition(() => {
        setNames(current, false);
        deck.slide(indexh, indexv ?? 0);
        setNames(target, true);
      });
      transition.finished.finally(() => {
        setNames(target, false);
        running = false;
      });
    });
  },
};
