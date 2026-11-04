#!/usr/bin/env bash
# skill-check.sh: a quick look at an agent skill folder before you install it.
#
# Read this script before you run it. That is the whole point of the talk.
# It only reads files and prints what it finds. It never opens a link,
# installs anything or sends data anywhere.
#
# Usage:   bash skill-check.sh path/to/skill-folder
# Needs:   bash, grep, find, perl (preinstalled on macOS and most Linux systems)
#
# No output in a section does not mean "safe". It means "nothing obvious".
# From the talk "Dangerous AI Skills" by Johannes Hoppe, agentic.schule

set -u
dir="${1:-}"
if [ -z "$dir" ] || [ ! -d "$dir" ]; then
  echo "Usage: bash $0 <skill-folder>" >&2
  exit 2
fi

section() { printf '\n\033[1m== %s\033[0m\n' "$1"; }

section "1. Files in the skill"
find "$dir" -type f | sort

section "2. Addresses: does every domain really belong to the vendor?"
grep -rhoE "https?://[^/[:space:]\"'\`)<>]+" "$dir" \
  | sed -E 's#^https?://##' | sort | uniq -c | sort -rn
echo "--- every URL with file and line:"
grep -rnoE "https?://[^[:space:]\"'\`)<>]+" "$dir"

section "3. Authority: phrases that turn foreign text into commands"
grep -rniE "ground truth|source of truth|authoritative|always follow|follow the (official |vendor'?s? )?(guide|instructions|docs|documentation)|treat .* as (binding|truth)|without (asking|bothering|involving)|don'?t (ask|bother)|silently|quietly|never (display|show|echo|print)" "$dir"

section "4. Install and execute"
grep -rniE "curl |wget |\| *(ba|z)?sh\b|npm (i|install)\b|npx |pnpm (add|dlx)|yarn (add|dlx)|pip3? install|uv (pip|tool)|brew install|go install|cargo install|chmod \+x|eval[ (]|base64 (-d|--decode)|global install|-g " "$dir"

section "5. Hidden Unicode: zero-width, bidi controls, tag characters"
find "$dir" -type f -print0 | xargs -0 perl -CSD -ne '
  my $re = qr/[\x{200B}-\x{200F}\x{202A}-\x{202E}\x{2060}-\x{2064}\x{2066}-\x{2069}\x{FEFF}\x{E0000}-\x{E007F}]/;
  if (/$re/) {
    (my $shown = $_) =~ s/($re)/sprintf("<U+%04X>", ord $1)/ge;
    print "$ARGV:$.: $shown";
  }
  close ARGV if eof;
' 2>/dev/null

section "6. Scripts and executables"
find "$dir" -type f \( -name "*.sh" -o -name "*.bash" -o -name "*.zsh" -o -name "*.py" -o -name "*.js" -o -name "*.mjs" -o -name "*.ts" -o -name "*.rb" -o -name "*.ps1" -o -perm -u+x \) | sort

printf '\nDone. Now read the SKILL.md yourself, every line.\n'
