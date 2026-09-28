---
name: presentation
description: Generate a self-contained HTML slide deck (single .html file, keyboard navigation, dark/light themes, speaker notes, print-to-PDF). Use when the user asks to create a presentation, slide deck, slideshow, or deck.
---

# Presentation Artifact

Build a self-contained HTML slide deck and save it as a single `.html` file.

## Workflow

1. **Clarify** — if not already given, ask the user for: the topic, the audience, how many slides (or rough length), and the tone (professional / casual / technical).
2. **Outline** — present a slide-by-slide outline and get approval before writing the file. Suggested structure: title slide, agenda, 3–6 content slides, closing slide.
3. **Generate** — write the deck to `<topic-slug>.html` in the current working directory. Topic slug = lowercase topic with spaces replaced by hyphens.
4. **Verify** — open the file in the browser. Confirm it renders, arrow keys navigate, the theme toggle works, and the notes toggle works.
5. **Hand off** — tell the user the file path, and that it prints to PDF via the browser's Print dialog → "Save as PDF".

## Output requirements

A single `.html` file. All CSS and JS inline in `<style>` / `<script>`. No external fonts, CDNs, or network requests.

- `<title>` = the deck title; `<meta name="viewport" content="width=device-width, initial-scale=1">`.
- Slides are `<section class="slide">` inside `<main id="deck">`.
- Keyboard navigation: ArrowRight/Down, Space, PageDown = next; ArrowLeft/Up, PageUp = prev; Home = first; End = last.
- Fixed overlay (bottom-right) with a progress bar and a `N / TOTAL` slide counter.
- Theme toggle button (top-right) switching a `data-theme` attribute on `<html>` between `light` and `dark`.
- Speaker notes: each slide may contain `<div class="notes">…</div>`; a "Notes" toggle button shows/hides all `.notes` blocks on screen. Notes are always hidden in print output.
- `@media print`: one slide per page, notes and overlay hidden.
- End of body: the `How to edit this artifact` comment block.

Start from the Deck template below, then replace the slide contents with the approved outline.

## Deck template

```html
<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Deck Title</title>
<style>
:root {
  --bg: #ffffff; --fg: #1a1a1a; --accent: #2563eb; --muted: #6b7280;
  --slide-bg: #ffffff; --slide-fg: #1a1a1a;
}
html[data-theme="dark"] {
  --bg: #111827; --fg: #f3f4f6; --accent: #60a5fa; --muted: #9ca3af;
  --slide-bg: #111827; --slide-fg: #f3f4f6;
}
* { box-sizing: border-box; }
body {
  margin: 0; background: var(--bg); color: var(--fg);
  font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
  transition: background .2s, color .2s;
}
#deck { width: 100vw; height: 100vh; overflow: hidden; position: relative; }
.slide {
  position: absolute; inset: 0; display: none; flex-direction: column;
  justify-content: center; align-items: center; text-align: center;
  padding: 8vh 12vw; background: var(--slide-bg); color: var(--slide-fg);
}
.slide.active { display: flex; }
h1 { font-size: clamp(2rem, 6vw, 4rem); margin: 0 0 .5em; }
h2 { font-size: clamp(1.5rem, 4vw, 2.5rem); margin: 0 0 .6em; }
p, li { font-size: clamp(1rem, 2.4vw, 1.5rem); line-height: 1.5; }
ul { text-align: left; }
.overlay {
  position: fixed; bottom: 12px; right: 16px; z-index: 10;
  display: flex; align-items: center; gap: 10px; font-size: .85rem;
  color: var(--muted);
}
#progress { width: 160px; height: 4px; background: var(--muted); border-radius: 2px; overflow: hidden; }
#progress > div { height: 100%; width: 0%; background: var(--accent); transition: width .2s; }
#themeBtn, #notesBtn {
  position: fixed; top: 12px; z-index: 10; border: 1px solid var(--muted);
  background: var(--slide-bg); color: var(--slide-fg); border-radius: 6px;
  padding: 6px 12px; cursor: pointer; font-size: .85rem;
}
#themeBtn { right: 12px; }
#notesBtn { right: 96px; }
.notes { display: none; font-size: .9rem; color: var(--muted); margin-top: 1.5em; }
.notes.show { display: block; }
@media print {
  .overlay, #themeBtn, #notesBtn { display: none; }
  .slide {
    position: static; display: flex; width: 100vw; height: 100vh;
    page-break-after: always; break-after: page;
  }
  .notes { display: none !important; }
}
</style>
</head>
<body>
<button id="themeBtn" type="button">Toggle theme</button>
<button id="notesBtn" type="button">Notes</button>
<main id="deck">
  <section class="slide active">
    <h1>Deck Title</h1>
    <p>Subtitle / speaker / date</p>
  </section>
  <section class="slide">
    <h2>Agenda</h2>
    <ul>
      <li>Point one</li>
      <li>Point two</li>
      <li>Point three</li>
    </ul>
  </section>
  <section class="slide">
    <h2>Closing</h2>
    <p>Thank you / next steps</p>
  </section>
</main>
<div class="overlay">
  <div id="progress"><div></div></div>
  <span id="counter">1 / 3</span>
</div>
<script>
(function () {
  var slides = Array.prototype.slice.call(document.querySelectorAll('.slide'));
  var current = 0;
  function show(i) {
    current = Math.max(0, Math.min(slides.length - 1, i));
    slides.forEach(function (s, idx) { s.classList.toggle('active', idx === current); });
    document.getElementById('counter').textContent = (current + 1) + ' / ' + slides.length;
    document.getElementById('progress').firstElementChild.style.width =
      ((current + 1) / slides.length * 100) + '%';
  }
  document.addEventListener('keydown', function (e) {
    var k = e.key;
    if (k === 'ArrowRight' || k === 'ArrowDown' || k === ' ' || k === 'PageDown') show(current + 1);
    else if (k === 'ArrowLeft' || k === 'ArrowUp' || k === 'PageUp') show(current - 1);
    else if (k === 'Home') show(0);
    else if (k === 'End') show(slides.length - 1);
  });
  document.getElementById('themeBtn').addEventListener('click', function () {
    var html = document.documentElement;
    html.setAttribute('data-theme', html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });
  document.getElementById('notesBtn').addEventListener('click', function () {
    var notes = Array.prototype.slice.call(document.querySelectorAll('.notes'));
    var show = !notes.some(function (n) { return n.classList.contains('show'); });
    notes.forEach(function (n) { n.classList.toggle('show', show); });
  });
  show(0);
})();
</script>
<!--
How to edit this artifact
- Add or remove slides: copy a <section class="slide"> block and change its text.
- Change the deck title: edit the <title> tag and the first slide's <h1>.
- Add speaker notes: inside a slide, add <div class="notes">Your notes here</div>.
- Change colors: edit the CSS custom properties under :root (light) and html[data-theme="dark"] (dark).
- Change font/size: edit the font-family / clamp() values in the CSS.
-->
</body>
</html>