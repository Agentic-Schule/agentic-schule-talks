// QR-Codes im Browser erzeugen, offline und ohne Paket.
// Markdown: <div class="qr" data-qr="https://agentic.schule/skills-talk"></div>
// Generator: shared/vendor/qrjs2.js (qr.js von Kang Seonghoon, Public Domain,
// übernommen aus github.com/JohannesHoppe/qr-code). Schwarz auf Weiß mit Ruhezone,
// damit jede Kamera den Code auch vom Beamer liest.
import '../vendor/qrjs2.js';

export function renderQrCodes(root) {
  root.querySelectorAll('[data-qr]').forEach((el) => {
    const svg = window.QRCode.generateSVG(el.dataset.qr, {
      ecclevel: 'M',
      fillcolor: '#ffffff',
      textcolor: '#000000',
      margin: 4,
      modulesize: 8,
    });
    svg.removeAttribute('width');
    svg.removeAttribute('height');
    el.replaceChildren(svg);
  });
}

export const QrCodes = {
  id: 'agentic-qr',
  init(deck) {
    deck.on('ready', () => renderQrCodes(deck.getRevealElement()));
  },
};
