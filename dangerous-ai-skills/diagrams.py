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
    open(os.path.join(OUT, name + '.svg'), 'w').write(s)

def esc(t):
    return t.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')

def text(x, y, t, cls='', size=26, anchor='start', extra=''):
    return f'<text x="{x}" y="{y}" class="{cls}" font-size="{size}" text-anchor="{anchor}" {extra}>{esc(t)}</text>'

# ---------- 1. Skill anatomy ----------
p = 'an'
b = []
b.append('<rect x="40" y="20" width="520" height="500" rx="10" class="box"/>')
b.append(text(64, 58, 'SKILL.md', 't-head t-code', 26))
# frontmatter
b.append('<rect x="64" y="80" width="472" height="118" rx="6" class="box-2"/>')
b.append(text(84, 112, '---', 't-muted t-code', 26))
b.append(text(84, 140, 'name: brand-landingpage', 't-code', 26))
b.append(text(84, 166, 'description: Design a landing page …', 't-code', 26))
b.append(text(84, 190, '---', 't-muted t-code', 26))
# body
b.append('<rect x="64" y="214" width="472" height="186" rx="6" class="box-2"/>')
b.append(text(84, 248, '## Phase 0: Prerequisites', 't-code t-bold', 26))
for i, wdt in enumerate([400, 360, 420, 300, 380]):
    b.append(f'<rect x="84" y="{266 + i * 24}" width="{wdt}" height="10" rx="5" class="fill-muted"/>')
# references
b.append('<rect x="64" y="416" width="472" height="84" rx="6" class="box-2"/>')
b.append(text(84, 448, '## Documentation', 't-code t-bold', 26))
b.append(text(84, 478, '- https://…/docs/sdk', 't-code t-accent', 26))
# annotations
ann = [
    (139, 'Name and description', 'always in the agent’s context', 'line', 'm', ''),
    (307, 'Instructions', 'loaded when the task matches', 'line', 'm', 'fragment'),
    (458, 'Links', 'fetched while the agent works', 'line-accent', 'a', 'fragment'),
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

# ---------- 3./4. Redirect: resting and armed ----------
def redirect(name, armed):
    p = 'rd' + ('a' if armed else 'r')
    b = []
    # agent
    b.append('<rect x="20" y="170" width="250" height="150" rx="12" class="box-2"/>')
    b.append(text(145, 232, 'Your agent', 't-head', 30, 'middle'))
    b.append(text(145, 270, 'reads the skill', 't-muted', 26, 'middle'))
    # attacker domain
    b.append('<rect x="400" y="170" width="380" height="150" rx="12" class="box-accent"/>')
    b.append(text(590, 232, 'stitch-design[.]ai', 't-head t-code', 30, 'middle'))
    b.append(text(590, 270, 'owned by the attacker', 't-muted', 26, 'middle'))
    b.append(f'<path d="M275,245 L390,245" class="line" marker-end="url(#{p}-m)"/>')
    if not armed:
        b.append('<rect x="900" y="170" width="290" height="150" rx="12" class="box-ok"/>')
        b.append(text(1045, 232, 'stitch.withgoogle', 't-head t-code', 26, 'middle'))
        b.append(text(1045, 270, 'Google’s real docs', 't-ok', 26, 'middle'))
        b.append(f'<path d="M785,245 L890,245" class="line-ok" marker-end="url(#{p}-o)"/>')
        b.append(text(838, 230, '302', 't-ok t-code t-bold', 26, 'middle'))
        b.append(text(600, 420, 'Resting state: every check lands on the original.', 't-muted', 26, 'middle'))
    else:
        b.append('<rect x="900" y="170" width="290" height="150" rx="12" class="box-bad"/>')
        b.append(text(1045, 232, 'install script', 't-head', 28, 'middle'))
        b.append(text(1045, 270, 'download and run', 't-bad', 26, 'middle'))
        b.append(f'<path d="M785,245 L890,245" class="line-bad" marker-end="url(#{p}-b)"/>')
        b.append(text(838, 230, '200', 't-bad t-code t-bold', 26, 'middle'))
        b.append(text(600, 420, 'Armed: same link, new content. The skill did not change.', 't-bad', 26, 'middle'))
    svg(name, 1200, 460, '\n'.join(b), p)
redirect('redirect-rest', False)
redirect('redirect-armed', True)

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

# ---------- 6. Perceived risk vs permissions ----------
p = 'pr'
b = []
rows = [('Landing page skill', 0.12, '“It just has to look good.”'), ('Database migration skill', 0.8, '“Let me read this carefully.”')]
for i, (lab, risk, quote) in enumerate(rows):
    y = 60 + i * 230
    b.append(text(40, y, lab, 't-head', 32))
    b.append(text(40, y + 44, 'Perceived risk', 't-muted', 26))
    b.append(f'<rect x="300" y="{y + 24}" width="800" height="30" rx="15" class="box-2"/>')
    b.append(f'<rect x="300" y="{y + 24}" width="{800 * risk:.0f}" height="30" rx="15" class="fill-accent"/>')
    b.append(text(300, y + 92, quote, 't-muted', 26))
    b.append(f'<g class="fragment" data-fragment-index="1">')
    b.append(text(40, y + 140, 'Agent permissions', 't-muted', 26))
    b.append(f'<rect x="300" y="{y + 120}" width="800" height="30" rx="15" class="fill-bad"/>')
    b.append(text(1090, y + 143, 'all of yours', 't-head', 26, 'end', 'style="fill:#fff"'))
    b.append('</g>')
svg('perceived-risk', 1200, 500, '\n'.join(b), p)

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
b.append('<rect x="20" y="200" width="250" height="110" rx="12" class="box-accent"/>')
b.append(text(145, 248, 'wshobson/agents', 't-head t-code', 26, 'middle'))
b.append(text(145, 282, '42,000 stars', 't-muted', 26, 'middle'))
cats = ['claudemarketplaces.com', 'skills.sh (install counter)', 'aiskillstore/marketplace', 'bachsh/supermarket', 'claude-skill-registry', '“awesome-skills” mirrors']
for i, c in enumerate(cats):
    y = 30 + i * 78
    b.append('<g class="fragment" data-fragment-index="1">')
    b.append(f'<path d="M275,255 C340,255 340,{y + 28} 400,{y + 28}" class="line" marker-end="url(#{p}-m)"/>')
    b.append(f'<rect x="405" y="{y}" width="370" height="56" rx="8" class="box"/>')
    b.append(text(425, y + 36, c, 't-code', 26))
    b.append('</g>')
b.append('<g class="fragment" data-fragment-index="2">')
b.append(f'<path d="M780,263 L870,170" class="line" marker-end="url(#{p}-m)"/>')
b.append(f'<path d="M780,263 L870,350" class="line dash" marker-end="url(#{p}-m)"/>')
b.append('<rect x="875" y="120" width="305" height="96" rx="8" class="box"/>')
b.append(text(895, 158, 'Checked into projects', 't-head', 26))
b.append(text(895, 192, 'visible on GitHub', 't-muted', 26))
b.append('<rect x="875" y="300" width="305" height="96" rx="8" class="box dash"/>')
b.append(text(895, 338, 'Installed in ~/.claude', 't-head', 26))
b.append(text(895, 372, 'invisible, uncountable', 't-muted', 26))
b.append('</g>')
b.append('<g class="fragment" data-fragment-index="3">')
b.append('<rect x="405" y="500" width="775" height="60" rx="10" class="box-bad"/>')
b.append(text(792, 540, 'Every copy still points to the same attacker domain', 't-bad t-bold', 26, 'middle'))
b.append('</g>')
svg('spread', 1200, 580, '\n'.join(b), p)

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

# ---------- 10. Scanner Venn ----------
p = 've'
b = []
for cx, cy, lab, lx, ly in [(470, 210, 'Scanner A', 300, 90), (730, 210, 'Scanner B', 900, 90), (600, 400, 'Scanner C', 600, 590)]:
    b.append(f'<circle cx="{cx}" cy="{cy}" r="190" class="box-accent" style="fill-opacity:0.6"/>')
    b.append(text(lx, ly, lab, 't-head', 26, 'middle'))
b.append(text(600, 300, '0.69 %', 't-head', 30, 'middle', 'style="fill:var(--heading)"'))
b.append(text(600, 330, 'all three', 't-muted', 26, 'middle'))
b.append('<g class="fragment">')
b.append(text(1180, 300, '81.9 %', 't-head t-bad', 64, 'end'))
b.append(text(1180, 346, 'of all findings come', 't-muted', 26, 'end'))
b.append(text(1180, 378, 'from one scanner only', 't-muted', 26, 'end'))
b.append('</g>')
svg('venn', 1200, 610, '\n'.join(b), p)

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

# ---------- 12. Trust chain ----------
p = 'tc'
b = []
chain = [('A stranger', 'account 6 days old'), ('A catalog', 'stars, install counts'), ('Your project', 'skills folder'), ('Your agent', 'your permissions')]
for i, (h, s2) in enumerate(chain):
    x = 20 + i * 295
    cls = 'box-bad' if i == 3 else 'box'
    b.append(f'<rect x="{x}" y="40" width="250" height="120" rx="12" class="{cls}"/>')
    b.append(text(x + 125, 92, h, 't-head', 28, 'middle'))
    b.append(text(x + 125, 128, s2, 't-muted', 26, 'middle'))
    if i < 3:
        b.append(f'<path d="M{x + 254},100 L{x + 290},100" class="line" marker-end="url(#{p}-m)"/>')
b.append('<g class="fragment">')
b.append('<rect x="290" y="190" width="320" height="70" rx="12" class="box-accent dash"/>')
b.append(text(450, 234, '+ one more marketplace', 't-accent', 26, 'middle'))
b.append(text(600, 310, 'A longer chain does not become more trustworthy.', 't-muted', 26, 'middle'))
b.append('</g>')
b.append('<g class="fragment">')
b.append('<rect x="20" y="350" width="250" height="100" rx="12" class="box-ok"/>')
b.append(text(145, 410, 'You', 't-head', 30, 'middle'))
b.append(f'<path d="M274,400 L310,400" class="line-ok" marker-end="url(#{p}-o)"/>')
b.append('<rect x="315" y="350" width="250" height="100" rx="12" class="box-ok"/>')
b.append(text(440, 410, 'Your skill', 't-head', 30, 'middle'))
b.append(f'<path d="M569,400 L605,400" class="line-ok" marker-end="url(#{p}-o)"/>')
b.append('<rect x="610" y="350" width="250" height="100" rx="12" class="box-ok"/>')
b.append(text(735, 410, 'Your agent', 't-head', 30, 'middle'))
b.append(text(900, 410, 'nothing to transfer', 't-ok', 26))
b.append('</g>')
svg('trust-chain', 1200, 470, '\n'.join(b), p)

# ---------- 13. Agent identity ----------
p = 'id'
b = []
cx, cy = 600, 260
b.append(f'<circle cx="{cx}" cy="{cy}" r="95" class="box-bad"/>')
b.append(text(cx, cy - 4, 'Your agent', 't-head', 28, 'middle'))
b.append(text(cx, cy + 30, 'signed in as you', 't-muted', 26, 'middle'))
import math
spokes = ['GitHub', 'Cloud console', 'npm token', 'Slack and mail', 'Production DB', 'Your files']
for i, s2 in enumerate(spokes):
    a = -math.pi / 2 + i * 2 * math.pi / len(spokes)
    x1, y1 = cx + 100 * math.cos(a), cy + 100 * math.sin(a)
    x2, y2 = cx + 330 * math.cos(a), cy + 215 * math.sin(a)
    b.append('<g class="fragment" data-fragment-index="1">')
    b.append(f'<path d="M{x1:.0f},{y1:.0f} L{cx + 250 * math.cos(a):.0f},{cy + 160 * math.sin(a):.0f}" class="line-bad"/>')
    b.append(f'<rect x="{x2 - 110:.0f}" y="{y2 - 28:.0f}" width="220" height="56" rx="28" class="box"/>')
    b.append(text(round(x2), round(y2 + 9), s2, 't-head', 26, 'middle'))
    b.append('</g>')
svg('identity', 1200, 520, '\n'.join(b), p)
print(sorted(os.listdir(OUT)))
