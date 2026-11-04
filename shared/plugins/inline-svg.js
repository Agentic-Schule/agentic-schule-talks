// Bindet SVG-Grafiken des Talks direkt ins Markdown ein, damit sie die Theme-Farben
// (CSS-Variablen) übernehmen und Fragmente darin funktionieren.
// Markdown: <div class="svg" data-svg="timeline"></div> setzt img/timeline.svg des Talks ein.
// Die Dateien kommen per import.meta.glob aus der index.html des Talks (siehe createDeck).
// Leerzeilen werden entfernt, weil sie den HTML-Block im Markdown beenden würden.
const PLACEHOLDER = /<div([^>]*?)data-svg="([^"]+)"([^>]*)><\/div>/g;

export function inlineSvgs(markdown, svgs = {}) {
  return markdown.replace(PLACEHOLDER, (match, before, name, after) => {
    const svg = svgs[name];
    if (!svg) return `<div${before}${after}>SVG „${name}“ fehlt</div>`;
    const compact = svg
      .replace(/<\?xml[^>]*>/, '')
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .join('\n');
    return `<div${before}data-svg="${name}"${after}>\n${compact}\n</div>`;
  });
}

// Für index.html eines Talks: { name: svgText } aus import.meta.glob('./img/*.svg', …)
export function svgMap(globResult) {
  return Object.fromEntries(
    Object.entries(globResult).map(([path, content]) => [path.split('/').pop().replace(/\.svg$/, ''), content]),
  );
}
