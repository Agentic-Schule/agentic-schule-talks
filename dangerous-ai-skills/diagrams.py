# Erzeugt die SVG-Diagramme in img/. Aufruf: python3 diagrams.py. Mindestgröße für Text: 26 (Beamer).

import os, sys
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'img')
os.makedirs(OUT, exist_ok=True)

def markers(p):
    out = ['<defs>']
    for suf, cls in [('m', 'arrow-muted'), ('a', 'arrow-accent'), ('b', 'arrow-bad'), ('o', 'arrow-ok')]:
        out.append(f'<marker id="{p}-{suf}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="{cls}"/></marker>')
    out.append(f'<linearGradient id="{p}-hero" x1="0" y1="0" x2="1" y2="1"><stop offset="0" class="stop-1"/><stop offset="1" class="stop-2"/></linearGradient>')
    out.append('</defs>')
    return ''.join(out)

def svg(name, w, h, body, p):
    s = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" role="img">\n{markers(p)}\n{body}\n</svg>\n'
    open(os.path.join(OUT, name + '.svg'), 'w', encoding='utf-8').write(s)

def esc(t):
    return t.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')

def text(x, y, t, cls='', size=26, anchor='start', extra=''):
    return f'<text x="{x}" y="{y}" class="{cls}" font-size="{size}" text-anchor="{anchor}" {extra}>{esc(t)}</text>'

# ---------- 1. Skill anatomy: progressive disclosure nach agentskills.io/specification ----------
# Beispiel pdf-processing aus der Spezifikation und der Anthropic-Doku, bewusst nicht brand-landingpage:
# die Folie zeigt den allgemeinen Aufbau, keinen bestimmten Skill.
p = 'an'
b = []
b.append('<rect x="40" y="20" width="520" height="500" rx="10" class="box"/>')
b.append(text(64, 58, 'pdf-processing/', 't-head t-code', 26))
# SKILL.md: Frontmatter
b.append('<rect x="64" y="80" width="472" height="118" rx="6" class="box-2"/>')
b.append(text(84, 112, 'SKILL.md', 't-muted t-code', 26))
b.append(text(84, 140, 'name: pdf-processing', 't-code', 26))
b.append(text(84, 168, 'description: Extract PDF …', 't-code', 26))
# SKILL.md: Markdown-Body
b.append('<rect x="64" y="214" width="472" height="186" rx="6" class="box-2"/>')
b.append(text(84, 248, '# PDF Processing', 't-code t-bold', 26))
for i, wdt in enumerate([400, 360, 420, 300, 380]):
    b.append(f'<rect x="84" y="{266 + i * 24}" width="{wdt}" height="10" rx="5" class="fill-muted"/>')
# weitere Dateien
b.append('<rect x="64" y="416" width="472" height="84" rx="6" class="box-2"/>')
b.append(text(84, 448, 'references/FORMS.md', 't-code', 26))
b.append(text(84, 478, 'scripts/fill_form.py', 't-code', 26))
ann = [
    (139, 'Name and description', 'loaded at startup, always in context', 'line', 'm', ''),
    (307, 'Markdown body', 'loaded when the skill is activated', 'line', 'm', 'fragment'),
    (458, 'Files and links', 'only when the agent opens them', 'line-accent', 'a', 'fragment'),
]
for y, head, sub, lcls, mk, frag in ann:
    b.append(f'<g class="{frag}">')
    b.append(f'<path d="M548,{y} L660,{y}" class="{lcls}" marker-end="url(#{p}-{mk})"/>')
    b.append(text(680, y - 6, head, 't-head' + (' t-accent' if mk == 'a' else ''), 30))
    b.append(text(680, y + 28, sub, 't-muted', 26))
    b.append('</g>')
svg('skill-anatomy', 1200, 540, '\n'.join(b), p)

# ---------- 2. File distance (minimap of 258 lines) ----------
p = 'fd'
b = []
X, Y, W, H, N = 60, 20, 300, 500, 258
lh = H / N
import random
random.seed(7)
b.append(f'<rect x="{X - 14}" y="{Y - 10}" width="{W + 28}" height="{H + 20}" rx="10" class="box"/>')
blank = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 22, 24, 45, 57, 72, 117, 156, 215, 245, 252, 258}
for i in range(N):
    ln = i + 1
    if ln in blank or ln in (31, 248):
        continue
    w = random.randint(80, W)
    b.append(f'<rect x="{X}" y="{Y + i * lh:.1f}" width="{w}" height="{lh * 0.6:.2f}" class="fill-muted"/>')
y31 = Y + 30 * lh
y248 = Y + 247 * lh
b.append(f'<rect x="{X - 6}" y="{y31 - 4:.1f}" width="{W + 12}" height="9" rx="3" class="fill-accent"/>')
b.append(f'<rect x="{X - 6}" y="{y248 - 4:.1f}" width="{W + 12}" height="9" rx="3" class="fill-bad"/>')
b.append(f'<path d="M{X + W + 20},{y31:.1f} L405,{y31:.1f}" class="line-accent"/>')
b.append(text(420, y31 - 4, 'Line 31', 't-head t-accent', 32))
b.append(text(420, y31 + 34, '\u201cConsult the SDK documentation \u2026', 't-code', 26))
b.append(text(420, y31 + 64, 'consider the Stitch SDK documentation as the ground truth.\u201d', 't-code', 26))
b.append('<g class="fragment">')
b.append(f'<path d="M{X - 8},{y31 + 6:.1f} C{X - 56},{y31 + 80:.1f} {X - 56},{y248 - 80:.1f} {X - 8},{y248 - 2:.1f}" class="line dash" marker-end="url(#{p}-m)"/>')
b.append(text(420, (y31 + y248) / 2 + 6, '217 lines of interview, design system,', 't-muted', 26))
b.append(text(420, (y31 + y248) / 2 + 38, 'generation loop and delivery bundle', 't-muted', 26))
b.append('</g>')
b.append('<g class="fragment">')
b.append(f'<path d="M{X + W + 20},{y248:.1f} L405,{y248:.1f}" class="line-bad"/>')
b.append(text(420, y248 - 40, 'Line 248 of 258', 't-head t-bad', 32))
b.append(text(420, y248 - 4, 'the link to that documentation', 't-code', 26))
b.append('</g>')
svg('file-distance', 1200, 540, '\n'.join(b), p)

# ---------- 5. Review time vs runtime ----------
p = 'rt'
b = []
b.append(f'<path d="M60,220 L1140,220" class="line" marker-end="url(#{p}-m)"/>')
b.append('<circle cx="180" cy="220" r="14" class="fill-ok"/>')
b.append(text(180, 160, 'Review', 't-head t-ok', 32, 'middle'))
b.append(text(180, 290, 'human reviewer', 't-muted', 26, 'middle'))
b.append(text(180, 326, 'three scanners', 't-muted', 26, 'middle'))
b.append(text(180, 362, 'green ticks', 't-muted', 26, 'middle'))
b.append('<g class="fragment">')
b.append('<rect x="250" y="188" width="720" height="64" rx="32" class="fill-surface"/>')
b.append('<rect x="250" y="188" width="720" height="64" rx="32" class="box-bad"/>')
b.append(text(610, 229, 'weeks: the link\u2019s content belongs to the attacker', 't-bad t-bold', 26, 'middle'))
b.append('</g>')
b.append('<g class="fragment">')
b.append('<circle cx="1040" cy="220" r="14" class="fill-bad"/>')
b.append(text(1040, 160, 'Execution', 't-head t-bad', 32, 'middle'))
b.append(text(1040, 290, 'whatever the link', 't-muted', 26, 'middle'))
b.append(text(1040, 326, 'serves right now', 't-muted', 26, 'middle'))
b.append('</g>')
svg('review-runtime', 1200, 390, '\n'.join(b), p)

# ---------- 7. Attack timeline ----------
p = 'tl'
b = []
events = [
    ('20 Apr', 'Attacker domain registered', 'muted'),
    ('29 Apr', 'Pull request #509 opened', 'muted'),
    ('2 May', 'Merged after a praising review', 'muted'),
    ('', 'Ads on Instagram, scanners say “safe”', 'muted'),
    ('22 Jun', 'Report “The Story of Skills”', 'accent'),
    ('Today', 'Still in the catalog, link unchanged', 'bad'),
]
x0, y0 = 160, 40
b.append(f'<path d="M{x0},{y0} L{x0},{y0 + 5 * 80 + 10}" class="line"/>')
for i, (d, t, c) in enumerate(events):
    y = y0 + i * 80
    frag = 'fragment' if i else ''
    b.append(f'<g class="{frag}">')
    dot = {'muted': 'fill-text', 'accent': 'fill-accent', 'bad': 'fill-bad'}[c]
    b.append(f'<circle cx="{x0}" cy="{y}" r="11" class="{dot}"/>')
    b.append(text(x0 - 30, y + 9, d, 't-head' + (' t-bad' if c == 'bad' else ''), 26, 'end'))
    tcls = {'muted': '', 'accent': 't-accent', 'bad': 't-bad t-bold'}[c]
    b.append(text(x0 + 36, y + 9, t, tcls, 28))
    b.append('</g>')
svg('attack-timeline', 1000, 470, '\n'.join(b), p)

# ---------- 8. Spread ----------
p = 'sp'
b = []
b.append('<rect x="0" y="200" width="290" height="110" rx="12" class="box-accent"/>')
b.append(text(145, 248, 'wshobson/agents', 't-head t-code', 24, 'middle'))
b.append(text(145, 282, '42,000 stars', 't-muted', 24, 'middle'))
cats = ['claudemarketplaces.com', 'skills.sh (install counter)', 'aiskillstore/marketplace', 'bachsh/supermarket', 'claude-skill-registry', '“awesome-skills” mirrors']
for i, c in enumerate(cats):
    y = 30 + i * 78
    b.append('<g class="fragment" data-fragment-index="1">')
    b.append(f'<path d="M295,255 C350,255 350,{y + 28} 400,{y + 28}" class="line" marker-end="url(#{p}-m)"/>')
    b.append(f'<rect x="405" y="{y}" width="470" height="56" rx="8" class="box"/>')
    b.append(text(425, y + 36, c, 't-code', 22))
    b.append('</g>')
b.append('<g class="fragment" data-fragment-index="2">')
b.append('<rect x="0" y="500" width="875" height="60" rx="10" class="box-bad"/>')
b.append(text(437, 540, 'Every copy still points to the same attacker domain', 't-bad t-bold', 24, 'middle'))
b.append('</g>')
svg('spread', 880, 580, '\n'.join(b), p)

# ---------- 9. Koi numbers ----------
p = 'ko'
b = []
rows = [('Early February', 2857, 341), ('Two weeks later', 10700, 824)]
maxv = 10700
for i, (lab, total, bad) in enumerate(rows):
    y = 50 + i * 170
    g = 'fragment' if i else ''
    b.append(f'<g class="{g}">')
    b.append(text(40, y, lab, 't-head', 30))
    tw = 1100 * total / maxv
    bw = 1100 * bad / maxv
    b.append(f'<rect x="40" y="{y + 24}" width="{tw:.0f}" height="44" rx="6" class="box-2"/>')
    b.append(f'<rect x="40" y="{y + 24}" width="{bw:.0f}" height="44" rx="6" class="fill-bad"/>')
    b.append(text(40 + max(bw, 0) + 16, y + 56, f'{bad:,} malicious', 't-bad t-bold', 26))
    b.append(text(40 + tw - 16, y + 104, f'{total:,}{"+" if i else ""} skills', 't-muted', 26, 'end'))
    b.append('</g>')
svg('koi', 1200, 400, '\n'.join(b), p)

# ---------- 11. Permissions: API vs Claude Code ----------
p = 'pm'
b = []
b.append('<rect x="20" y="20" width="540" height="420" rx="14" class="box-ok"/>')
b.append(text(290, 80, 'Claude API', 't-head', 34, 'middle'))
b.append(text(290, 118, 'Skill runs in a container', 't-muted', 26, 'middle'))
for i in range(7):
    b.append(f'<path d="M{120 + i * 57},160 L{120 + i * 57},330" class="line-ok"/>')
b.append('<rect x="110" y="155" width="360" height="180" rx="10" class="line-ok"/>')
b.append(text(290, 258, 'skill', 't-head t-code', 30, 'middle'))
b.append(text(290, 395, '“No network access”', 't-ok t-bold', 26, 'middle'))
b.append('<g class="fragment">')
b.append('<rect x="640" y="20" width="540" height="420" rx="14" class="box-bad"/>')
b.append(text(910, 80, 'Claude Code', 't-head', 34, 'middle'))
b.append(text(910, 118, 'Skill runs on your machine', 't-muted', 26, 'middle'))
items = ['your files', '~/.ssh, .env', 'git push', 'cloud CLIs', 'the internet']
for i, it in enumerate(items):
    y = 170 + i * 40
    b.append(f'<circle cx="760" cy="{y - 8}" r="6" class="fill-bad"/>')
    b.append(text(780, y, it, 't-code', 26))
b.append(text(910, 395, '“Full network access”', 't-bad t-bold', 26, 'middle'))
b.append('</g>')
svg('permissions', 1200, 460, '\n'.join(b), p)

# ---------- 13. Agent identity ----------
p = 'id'
b = []
cx, cy = 600, 260
b.append(f'<circle cx="{cx}" cy="{cy}" r="120" class="box-bad"/>')
b.append(text(cx, cy - 4, 'Your agent', 't-head', 28, 'middle'))
b.append(text(cx, cy + 28, 'signed in as you', 't-muted', 22, 'middle'))
import math
spokes = ['GitHub', 'Cloud console', 'npm token', 'Slack and mail', 'Production DB', 'Your files']
for i, s2 in enumerate(spokes):
    a = -math.pi / 2 + i * 2 * math.pi / len(spokes)
    x1, y1 = cx + 125 * math.cos(a), cy + 125 * math.sin(a)
    x2, y2 = cx + 330 * math.cos(a), cy + 215 * math.sin(a)
    b.append('<g class="fragment" data-fragment-index="1">')
    b.append(f'<path d="M{x1:.0f},{y1:.0f} L{cx + 250 * math.cos(a):.0f},{cy + 160 * math.sin(a):.0f}" class="line-bad"/>')
    b.append(f'<rect x="{x2 - 125:.0f}" y="{y2 - 28:.0f}" width="250" height="56" rx="28" class="box"/>')
    b.append(text(round(x2), round(y2 + 8), s2, 't-head', 24, 'middle'))
    b.append('</g>')
svg('identity', 1200, 520, '\n'.join(b), p)
print(sorted(os.listdir(OUT)))
