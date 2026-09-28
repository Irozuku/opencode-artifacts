---
name: canvas
description: Generate a self-contained interactive HTML canvas artifact — drawings, animations, diagrams, and data visualizations. Use when the user wants a canvas, animation, interactive graphic, diagram, or visual demo.
---

# Canvas Artifact

Build a self-contained interactive HTML canvas and save it as a single `.html` file.

## Workflow

1. **Clarify** — if not already given, ask the user for: what to draw or visualize, whether it should animate and/or respond to pointer/touch input, and the desired aspect ratio (default 16:9).
2. **Generate** — write `<topic-slug>.html` in the current working directory. Topic slug = lowercase topic with spaces replaced by hyphens.
3. **Verify** — open the file in the browser. Confirm it renders, animates (if applicable), and responds to pointer/touch.
4. **Hand off** — tell the user the file path and what to change (drawing code, colors, canvas size).

## Output requirements

A single `.html` file. All CSS and JS inline. No external dependencies.

- `<title>` = the canvas title; `<meta name="viewport" content="width=device-width, initial-scale=1">`.
- One `<canvas id="c">` sized to the chosen aspect ratio, responsive: on resize it rescales to fit the window while keeping aspect, and the backing store matches `devicePixelRatio` (capped at 2).
- Animation loop via `requestAnimationFrame`; a `t` time-in-seconds variable is advanced each frame.
- Pointer/touch handlers (`pointerdown`, `pointermove`, `window pointerup`) update a `pointer` object with logical canvas coordinates and a `down` flag. Set `touch-action: none` on the canvas so touch input isn't hijacked by scrolling.
- Drawing helpers used by the generated code: `clear()`, `circle(x, y, r, fill, stroke)`, `rect(x, y, w, h, fill)`, `line(x1, y1, x2, y2, color, width)`, `text(str, x, y, size, color)`.
- End of body: the `How to edit this artifact` comment block.

Start from the Template below, then replace the demo drawing in `draw()` with the user's concept.

## Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Canvas Title</title>
<style>
* { box-sizing: border-box; }
body {
  margin: 0; background: #0f172a; color: #e2e8f0;
  font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
  display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 16px;
}
canvas { background: #0b1220; border-radius: 8px; box-shadow: 0 4px 24px rgba(0,0,0,.4); touch-action: none; }
h1 { font-size: 1.1rem; font-weight: 500; margin: 0; }
</style>
</head>
<body>
<h1>Canvas Title</h1>
<canvas id="c"></canvas>
<script>
(function () {
  var canvas = document.getElementById('c');
  var ctx = canvas.getContext('2d');
  var W = 960, H = 540;
  var ratio = Math.min(window.devicePixelRatio || 1, 2);
  function resize() {
    var s = Math.max(0, Math.min((window.innerWidth - 32) / W, (window.innerHeight - 64) / H));
    canvas.style.width = (W * s) + 'px';
    canvas.style.height = (H * s) + 'px';
    canvas.width = W * ratio;
    canvas.height = H * ratio;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }
  function clear() { ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0b1220'; ctx.fillRect(0, 0, W, H); }
  function circle(x, y, r, fill, stroke) {
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.stroke(); }
  }
  function rect(x, y, w, h, fill) { ctx.fillStyle = fill; ctx.fillRect(x, y, w, h); }
  function line(x1, y1, x2, y2, color, width) {
    ctx.strokeStyle = color; ctx.lineWidth = width || 1;
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  }
  function text(str, x, y, size, color) {
    ctx.fillStyle = color || '#e2e8f0';
    ctx.font = (size || 16) + 'px system-ui, sans-serif';
    ctx.textAlign = 'center'; ctx.fillText(str, x, y);
  }
  var pointer = { x: W / 2, y: H / 2, down: false };
  canvas.addEventListener('pointerdown', function (e) { pointer.down = true; updatePointer(e); });
  window.addEventListener('pointerup', function () { pointer.down = false; });
  canvas.addEventListener('pointermove', function (e) { updatePointer(e); });
  function updatePointer(e) {
    var r = canvas.getBoundingClientRect();
    pointer.x = (e.clientX - r.left) / r.width * W;
    pointer.y = (e.clientY - r.top) / r.height * H;
  }
  var t = 0, last = null;
  function frame(ts) {
    if (last === null) last = ts;
    t += (ts - last) / 1000;
    last = ts;
    clear();
    draw();
    requestAnimationFrame(frame);
  }
  function draw() {
    for (var i = 0; i < 12; i++) {
      var a = t + (i / 12) * Math.PI * 2;
      var r = 60 + Math.sin(t * 2 + i) * 20;
      circle(pointer.x + Math.cos(a) * r, pointer.y + Math.sin(a) * r, 6, 'rgba(96,165,250,.8)');
    }
    text('Move your pointer / touch', pointer.x, pointer.y - 120, 18, '#94a3b8');
  }
  window.addEventListener('resize', resize);
  resize();
  frame();
})();
</script>
<!--
How to edit this artifact
- Change the canvas size: edit W and H in the script.
- Change the drawing: replace the body of draw() with your own code, using the helpers
  clear(), circle(), rect(), line(), text(). `t` is time in seconds, `pointer` tracks input.
- Change colors / background: edit the CSS and the clear() fill color.
-->
</body>
</html>
```