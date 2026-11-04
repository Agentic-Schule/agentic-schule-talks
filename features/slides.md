<!-- .slide: data-state="title" class="title" -->

<span class="title-logo"></span>

# Funktionen und Bausteine

## Das Vorführ-Deck für alle agentic.schule-Talks

<p class="speaker">Johannes Hoppe</p>
<p class="event" data-sticky="event">Hier klicken und den Eventnamen eintippen</p>

Note:
Die Eventzeile merkt sich, was du eintippst. Mit ?reset-edits in der URL ist alles Gemerkte wieder weg.

---

<span class="kicker">Steuerung</span>

## Tasten im Vortrag

| Taste | Wirkung |
| --- | --- |
| Klick in die Folie | Text und Code direkt bearbeiten, <kbd>Esc</kbd> beendet |
| <kbd>D</kbd> oder ☀︎ oben rechts | Hell und Dunkel umschalten |
| <kbd>+</kbd> <kbd>-</kbd> <kbd>0</kbd> | Code auf der Folie größer, kleiner, zurück |
| <kbd>S</kbd> | Speaker View mit Notizen und Timer |
| <kbd>O</kbd> | Übersicht aller Folien |
| <kbd>B</kbd> | Bildschirm schwarz |
| <kbd>G</kbd> | zu Folie springen |
| <kbd>?</kbd> | alle Tasten |

---

<span class="kicker">Hell und Dunkel</span>

## Ein Beamer, zwei Modi

- Dunkel ist agentic.schule
- Hell ist angular.schule, nur das Logo wechselt
- Der Schalter oben rechts oder <kbd>D</kbd> wechselt, die Wahl bleibt gespeichert
- `?theme=light` in der URL erzwingt einen Modus

**Tipp:** Vor dem Talk auf dem echten Beamer beide Modi ansehen.

---

<span class="kicker">Code</span>

## Jede Folie ist live editierbar

```ts
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-counter',
  template: `<button (click)="inc()">{{ count() }}</button>`,
})
export class Counter {
  // Hier hineinklicken und den Code ändern
  count = signal(0);
  inc = () => this.count.update((n) => n + 1);
}
```

Anklicken und tippen, Esc beendet.

---

<span class="kicker">Code</span>

## Größe pro Block

```ts big
const answer = 42;
```

```ts small
// ```ts small, ```ts medium, ```ts big, ```ts huge, ```ts tiny
export const sizes = ['tiny', 'small', 'medium', 'big', 'huge'] as const;
```

---

<span class="kicker">Code</span>

## Zeilen nacheinander hervorheben

```ts [1|3-6|8]
const agent = createAgent({ model: 'gemini-3-pro' });

agent.tool('querySales', {
  description: 'Umsätze nach Region und Jahr',
  schema: salesQuerySchema,
});

await agent.run('Wie lief 2025 in Europa?');
```

Syntax: ```` ```ts [1|3-6|8] ````

---

<!-- .slide: data-auto-animate -->

<span class="kicker">Auto-Animate</span>

## Code wächst von Folie zu Folie

```ts
const agent = createAgent({ model });
```
<!-- .element: data-id="morph" -->

---

<!-- .slide: data-auto-animate -->

<span class="kicker">Auto-Animate</span>

## Code wächst von Folie zu Folie

```ts
const agent = createAgent({ model });

agent.tool('querySales', { schema });
agent.tool('pinToDashboard', { schema });

await agent.run('Wie lief 2025 in Europa?');
```
<!-- .element: data-id="morph" -->

Zwei Folien mit `data-auto-animate` und demselben `data-id` am Codeblock.

---

<span class="kicker">Terminal</span>

## Shell-Blöcke sehen aus wie ein Terminal

```bash
$ npm create vite@latest my-talk
$ cd my-talk && npm install
# Kommentare sind gedimmt
$ npm run dev
```

Gilt für `bash`, `sh`, `shell`, `console` und `zsh`.

---

<span class="kicker">Aufbau</span>

## Schritt für Schritt

- Erster Punkt <!-- .element: class="fragment" -->
- Zweiter Punkt <!-- .element: class="fragment" -->
- Dritter Punkt, **mit Betonung** <!-- .element: class="fragment" -->

--

<span class="kicker">Vertikal</span>

## Unterfolie

Zwei Bindestriche auf einer eigenen Zeile öffnen eine Folie darunter, drei Bindestriche die nächste Folie daneben.

---

<span class="kicker">Layout</span>

## Zwei Spalten und Karten

<div class="columns">
<div class="card">

### Vorher ❌

Der Agent lädt jeden Skill aus dem Netz ungeprüft.

</div>
<div class="card">

### Nachher ✅

Skills kommen aus einer festen Quelle mit gepinnter Version.

</div>
</div>

---

<span class="kicker">Zitat</span>

> Die beste Folie ist die, die man nicht vorlesen muss.

---

<!-- .slide: data-view-transition data-transition="none" -->

<span class="kicker">View Transitions</span>

## Elemente wandern zwischen Folien

<div class="vt-demo">
<div class="card" data-vt="box-a"><strong>Skill</strong></div>
<div class="card" data-vt="box-b"><strong>Link</strong></div>
</div>

---

<!-- .slide: data-view-transition data-transition="none" -->

<span class="kicker">View Transitions</span>

## Elemente wandern zwischen Folien

<div class="vt-demo flipped">
<div class="card bad-card" data-vt="box-b"><strong>Link → Angreifer</strong></div>
<div class="card" data-vt="box-a"><strong>Skill</strong></div>
</div>

Beide Folien: `data-view-transition data-transition="none"`, gleiche Elemente: `data-vt="name"`.

---

<!-- .slide: data-state="chapter" class="chapter" -->

<span class="kicker">Kapitel 2</span>

## Kapitelfolie

---

<span class="kicker">Kernaussage</span>

<p class="statement">Eine Zahl. <span class="gradient-text">Groß.</span></p>

---

<h2 class="r-fit-text">So groß wie möglich</h2>

`r-fit-text` füllt die Folienbreite.

---

<!-- .slide: data-state="end" class="end" -->

## Danke!

Johannes Hoppe · agentic.schule

Note:
Sprechernotizen stehen nach `Note:` am Ende einer Folie und erscheinen nur in der Speaker View (Taste S).
