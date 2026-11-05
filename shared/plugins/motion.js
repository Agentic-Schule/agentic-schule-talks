// Reduzierte Bewegung: folgt der Systemeinstellung „Bewegung reduzieren“ (prefers-reduced-motion).
// ?motion=full erzwingt alle Animationen (etwa auf dem Vortragsrechner), ?motion=reduced schaltet sie ab,
// ?check (plugins/layout-check.js) ebenfalls.
// Bei reduzierter Bewegung wechseln die Folien ohne Slide-Animation und ohne View Transitions,
// Fragmente blenden nur noch ein. Das CSS hängt an der Klasse html.reduced-motion.
export function reducedMotion() {
  const param = new URLSearchParams(location.search).get('motion');
  if (param === 'full') return false;
  if (param === 'reduced') return true;
  // Der Layout-Check (?check) misst Endzustände und springt dafür ohne Animation durch die Folien
  if (new URLSearchParams(location.search).has('check')) return true;
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

export function applyMotionPreference() {
  const reduced = reducedMotion();
  document.documentElement.classList.toggle('reduced-motion', reduced);
  return reduced;
}
