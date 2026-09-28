---
name: html-doc
description: Generate a self-contained HTML document — dashboards, charts, reports, and landing pages. Use when the user wants a report, dashboard, chart, metrics page, or static HTML page.
---

# HTML Document Artifact

Build a self-contained HTML document and save it as a single `.html` file.

## Workflow

1. **Clarify** — if not already given, ask the user for: the document's purpose, the key data/sections it must cover, and any specific metrics to feature.
2. **Outline** — present the section list and get approval before writing the file. Suggested structure: title + subtitle, key metrics, one or more charts, a data table.
3. **Generate** — write `<topic-slug>.html` in the current working directory. Topic slug = lowercase topic with spaces replaced by hyphens.
4. **Verify** — open the file in the browser. Confirm it renders with all sections populated.
5. **Hand off** — tell the user the file path, and that editing content means changing the JS data arrays.

## Output requirements

A single `.html` file. All CSS and JS inline. No external dependencies.

- `<title>` = the document title; `<meta name="viewport" content="width=device-width, initial-scale=1">`.
- Consistent base styling: light background, white cards with subtle borders, system font stack, muted secondary text. Define colors as CSS custom properties in `:root`.
- All data lives in JS arrays near the top of the script (e.g. `metrics`, `chartData`, `rows`) — this is how the user edits content.
- Charts are rendered with inline SVG or styled `<div>` bars — no chart libraries.
- A date line under the title, generated client-side via `new Date().toLocaleDateString()`.
- `@media print` so the page prints cleanly (white background).
- End of body: the `How to edit this artifact` comment block.

Start from the Template below, then replace the demo data with the user's real content.

## Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Report Title</title>
<style>
:root { --bg: #f8fafc; --card: #ffffff; --fg: #0f172a; --muted: #64748b; --accent: #2563eb; }
* { box-sizing: border-box; }
body { margin: 0; background: var(--bg); color: var(--fg); font-family: system-ui, -apple-system, "Segoe UI", sans-serif; }
main { max-width: 900px; margin: 0 auto; padding: 40px 24px; }
h1 { font-size: 1.8rem; margin: 0 0 4px; }
.subtitle { color: var(--muted); margin: 0 0 32px; }
h2 { font-size: 1.2rem; margin: 32px 0 12px; }
.card { background: var(--card); border: 1px solid #e2e8f0; border-radius: 10px; padding: 20px; margin-bottom: 16px; }
table { width: 100%; border-collapse: collapse; font-size: .95rem; }
th, td { text-align: left; padding: 8px 10px; border-bottom: 1px solid #e2e8f0; }
th { color: var(--muted); font-weight: 600; }
.bar { background: var(--accent); height: 22px; border-radius: 4px; min-width: 2px; }
.chart { display: flex; flex-direction: column; gap: 10px; }
.chart .row { display: grid; grid-template-columns: 140px 1fr 60px; align-items: center; gap: 12px; font-size: .9rem; }
@media print { body { background: #fff; } .card { border-color: #ccc; } }
</style>
</head>
<body>
<main>
  <h1>Report Title</h1>
  <p class="subtitle">Generated <span id="date"></span></p>

  <div class="card">
    <h2>Key metrics</h2>
    <div id="metrics"></div>
  </div>

  <div class="card">
    <h2>Chart</h2>
    <div id="chart" class="chart"></div>
  </div>

  <div class="card">
    <h2>Data table</h2>
    <table id="table">
      <thead><tr id="tableHead"></tr></thead>
      <tbody id="tableBody"></tbody>
    </table>
  </div>
</main>
<script>
(function () {
  document.getElementById('date').textContent = new Date().toLocaleDateString();

  var metrics = [
    { label: 'Total users', value: 12480 },
    { label: 'Active today', value: 1240 },
    { label: 'Conversion', value: '3.4%' }
  ];
  var chartData = [
    { label: 'Jan', value: 42 },
    { label: 'Feb', value: 58 },
    { label: 'Mar', value: 71 },
    { label: 'Apr', value: 90 }
  ];
  var rows = [
    { name: 'Alpha', owner: 'Ada', status: 'done' },
    { name: 'Beta', owner: 'Grace', status: 'review' },
    { name: 'Gamma', owner: 'Alan', status: 'todo' }
  ];

  var metricsEl = document.getElementById('metrics');
  metrics.forEach(function (m) {
    var p = document.createElement('p');
    p.style.margin = '4px 0';
    var strong = document.createElement('strong');
    strong.textContent = String(m.value);
    p.appendChild(strong);
    p.appendChild(document.createTextNode(' ' + m.label));
    metricsEl.appendChild(p);
  });

  var chartEl = document.getElementById('chart');
  var max = Math.max.apply(null, chartData.map(function (d) { return d.value; })) || 1;
  chartData.forEach(function (d) {
    var row = document.createElement('div');
    row.className = 'row';
    row.innerHTML = '<span>' + d.label + '</span><span class="bar" style="width:' + (d.value / max * 100) + '%"></span><span>' + d.value + '</span>';
    chartEl.appendChild(row);
  });

  var keys = Object.keys(rows[0]);
  var head = document.getElementById('tableHead');
  keys.forEach(function (k) {
    var th = document.createElement('th');
    th.textContent = k;
    head.appendChild(th);
  });
  var body = document.getElementById('tableBody');
  rows.forEach(function (r) {
    var tr = document.createElement('tr');
    keys.forEach(function (k) {
      var td = document.createElement('td');
      td.textContent = r[k];
      tr.appendChild(td);
    });
    body.appendChild(tr);
  });
})();
</script>
<!--
How to edit this artifact
- Edit content: change the metrics / chartData / rows arrays in the script.
- Add a section: copy a <div class="card"> block and fill it in.
- Change colors: edit the CSS custom properties in :root.
-->
</body>
</html>
```