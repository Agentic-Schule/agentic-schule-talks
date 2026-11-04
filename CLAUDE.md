# agentic.schule Talks

Hier liegen die Konferenz-Talks von Johannes Hoppe für die agentic.schule. Jeder Talk hat einen eigenen Ordner mit Folien in Markdown. Die Technik ist [reveal.js](https://revealjs.com/) 6 als npm-Paket mit Vite als Dev-Server. Theme und Erweiterungen liegen gemeinsam in `shared/` und gelten für alle Talks.

Abstracts, Bio, Einreichungen und Fristen gehören nicht hierher. Sie liegen im privaten Repo `haushoppe-headquarter` unter `talks/` (Regeln für Talk-Texte dort in `talks/CLAUDE.md`).

## Befehle

```bash
npm ci          # Abhängigkeiten aus dem Lockfile
npm start       # Dev-Server mit Live-Reload: http://127.0.0.1:8000/
npm run build   # statischer Build nach dist/
npm run preview # Build ansehen: http://127.0.0.1:8001/
```

Keine neuen Pakete ohne Johannes' Zustimmung (siehe globale Regeln). Abhängigkeiten sind exakt gepinnt.

## Aufbau

```
index.html                 Übersicht aller Talks (Link pro Talk von Hand eintragen)
shared/deck.js             gemeinsamer Einstieg: createDeck(markdown, options)
shared/theme/agentic.css   Theme, Hell und Dunkel
shared/theme/code.css      Code, Größenstufen, Terminal, Syntaxfarben
shared/plugins/            eigene reveal.js-Plugins
shared/img/                Logos (hell, dunkel, weiß, Icon)
features/                  Vorführ-Deck mit allen Funktionen und Bausteinen
<talk>/index.html          Seite des Talks, lädt slides.md
<talk>/slides.md           die Folien
<talk>/img/                Bilder des Talks
```

Ein neuer Talk: Ordner `features/` kopieren, `slides.md` leeren, Titel in `index.html` anpassen, Link in der Übersicht `index.html` ergänzen. Vite findet jeden Ordner mit `index.html` von selbst (`vite.config.js`). Der Ordnername ist der Kurzname des Talks, etwa `dangerous-ai-skills`. Unterschiede pro Event (Länge, Eventname) regeln wir im selben Deck, nicht mit Kopien.

## Folien schreiben

- `---` auf einer eigenen Zeile: nächste Folie daneben. `--`: Folie darunter (vertikal).
- `Note:` am Ende einer Folie: Sprechernotizen, nur in der Speaker View (Taste S).
- Folien-Attribute: `<!-- .slide: class="..." data-state="..." -->` direkt am Folienanfang.
- Element-Attribute: `<!-- .element: class="fragment" -->` hinter dem Element, bei Codeblöcken in der Zeile nach der schließenden Fence.
- HTML ist im Markdown erlaubt, etwa für Spalten und Karten. Markdown innerhalb von HTML braucht eine Leerzeile davor und danach.

### Folientypen

| Typ | Kopf der Folie |
| --- | --- |
| Titel | `<!-- .slide: data-state="title" class="title" -->`, dazu `<span class="title-logo"></span>`, `# Titel`, `## Untertitel`, `<p class="speaker">`, `<p class="event" data-sticky="event">` |
| Kapitel | `<!-- .slide: data-state="chapter" class="chapter" -->` |
| Schluss | `<!-- .slide: data-state="end" class="end" -->` |

`data-state` färbt den ganzen Hintergrund mit dem Hero-Verlauf und blendet das kleine Logo aus, `class` steuert die Typografie. Beides gehört zusammen.

### Bausteine

- `<span class="kicker">Thema</span>` über einer Überschrift: Kicker wie auf der Website.
- `<div class="columns">` mit zwei `<div>`: zwei Spalten. `<div class="card">`: Karte.
- `<p class="statement">`: große Kernaussage. `<span class="gradient-text">`: Verlauf im Text.
- `class="r-fit-text"`: Überschrift so groß wie die Folie erlaubt (reveal.js).
- `<kbd>`: Taste. `.muted`, `.accent`, `.left`: Hilfsklassen.

### Code

- Größe pro Block hinter der Sprache: ```` ```ts big ````. Stufen `tiny`, `small`, `medium`, `big`, `huge`.
- Zeilen schrittweise hervorheben: ```` ```ts [1|3-6|8] ````, auch kombiniert mit einer Größe: ```` ```ts small [1|3] ````.
- Code wachsen lassen: zwei aufeinanderfolgende Folien mit `<!-- .slide: data-auto-animate -->`, beide Codeblöcke mit `<!-- .element: data-id="name" -->`.
- `bash`, `sh`, `shell`, `console`, `zsh` erscheinen als Terminal mit Fensterleiste und blinkendem Cursor. Ein `$`, `%`, `❯` oder `>` am Zeilenanfang wird als Prompt eingefärbt.
- Codeblöcke ohne Zeilen-Highlights sind im Vortrag direkt editierbar.

## Im Vortrag

| Taste | Wirkung |
| --- | --- |
| D | Hell/Dunkel umschalten (Wahl bleibt gespeichert, `?theme=light` erzwingt) |
| E | aktuelle Folie bearbeiten, Esc beendet |
| + / - / 0 | Code der aktuellen Folie größer, kleiner, zurück |
| S | Speaker View | 
| O oder Esc | Übersicht |
| B | Bildschirm schwarz |
| G | zu Folie springen |
| ? | alle Tasten |

`data-sticky="name"` merkt sich bearbeiteten Inhalt im Browser (localStorage, je Deck). `?reset-edits` in der URL löscht alles Gemerkte.

PDF: Deck mit `?print-pdf` in Chrome öffnen und drucken (Hintergrundgrafiken an). Für den Beamer im Zweifel `?theme=light`.

## Theme

- Dunkel (Standard) ist agentic.schule, Hell ist angular.schule. Im hellen Modus wechselt im Kern nur das Logo.
- Die Farbwerte stammen aus `src/scss/_variables.scss` der Website-Repos (`haushoppe-headquarter/agentic.schule` und `angular-schule-website`). Ändert sich dort etwas, hier nachziehen.
- Alle Farben sind CSS-Variablen unter `:root[data-theme=…]`. Neue Bausteine verwenden nur diese Variablen, damit beide Modi funktionieren.
- Schriften: Inter und Inter Tight über `@fontsource`, Code im System-Monospace.
- Terminal-Blöcke sind in beiden Modi dunkel.

## Eigene Plugins

| Datei | Zweck |
| --- | --- |
| `theme-toggle.js` | Taste D, URL-Parameter, gespeicherte Wahl |
| `live-edit.js` | editierbare Codeblöcke, Taste E, `data-sticky` |
| `code-size.js` | Tasten + / - / 0 |
| `terminal.js` | Prompt-Markierung als highlight.js-Plugin |

Plugins folgen der reveal.js-API `{ id, init(deck) }` und werden in `shared/deck.js` registriert. reveal.js selbst wird nie verändert. Eine Erweiterung, die sich nicht als Plugin oder CSS lösen lässt, vorher mit Johannes besprechen.

## Texte auf Folien

- Die Sprache des Talks entscheidet: englische Talks haben englische Folien. Echte Umlaute in deutschen Folien.
- „ich“ für alles, was Johannes vorstellt, „wir“ nur für das, was er mit dem Publikum gemeinsam tut.
- Keine Füllfolien und keine Fließtexte: ein Gedanke pro Folie, Details in die `Note:`.
- Nie „nachgemessen“, „gemessen“, „bewiesen“, „belegt“ oder „geprüft“ über eigene Aussagen.
- Werkzeug-Beispiele: Claude Code, Codex oder Antigravity.
