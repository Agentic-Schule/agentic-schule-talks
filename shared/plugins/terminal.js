// Terminal-Look für Shell-Blöcke (```bash, ```sh, ```shell, ```console, ```zsh).
// Das Aussehen und der blinkende Cursor stehen in theme/code.css.
// Hier wird nur der Prompt am Zeilenanfang ($, %, ❯ oder >) als eigenes Element markiert,
// damit er farbig und beim Kopieren nicht markierbar ist. Läuft als highlight.js-Plugin,
// also auch nach dem Neu-Einfärben, wenn jemand den Block live bearbeitet hat.
export const TERMINAL_LANGUAGES = ['bash', 'sh', 'shell', 'console', 'zsh'];

// innerHTML ist bereits escaped, deshalb steht > hier als &gt;
const PROMPT = /^(\s*)(\$|%|❯|&gt;)(\s)/gm;

export function terminalPrompts(hljs) {
  hljs.addPlugin({
    'after:highlightElement': ({ el }) => {
      if (!TERMINAL_LANGUAGES.some((lang) => el.classList.contains(lang))) return;
      el.innerHTML = el.innerHTML.replace(PROMPT, '$1<span class="term-prompt">$2</span>$3');
    },
  });
}
