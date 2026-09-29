# opencode-artifacts

opencode skills that generate self-contained HTML artifacts - presentations, interactive canvas, and HTML documents. Each artifact is a single `.html` file with all CSS and JS inline: no dependencies, no network, opens in any browser.

## Skills

| Skill | Generates |
| --- | --- |
| `presentation` | HTML slide decks with keyboard navigation, dark/light themes, speaker notes, print-to-PDF |
| `canvas` | Interactive HTML canvas: drawings, animations, diagrams, data visualizations |
| `html-doc` | Dashboards, charts, reports, landing pages |

## Install

### As an opencode plugin (recommended)

Add the plugin to your opencode config. Three ways: reference the file directly:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["file:///abs/path/to/artifacts-opencode/.opencode/plugins/artifacts.js"]
}
```

…or reference the repo folder directly (opencode resolves the folder's `package.json` `main` - the same mechanism as the `superpowers` plugin):

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["/abs/path/to/artifacts-opencode"]
}
```

…or install it as a dependency of your opencode config and reference it by name:

```json
{
  "plugin": ["opencode-artifacts"]
}
```

with the package added to `~/.config/opencode/package.json`:

```json
{
  "dependencies": {
    "opencode-artifacts": "git+https://github.com/Irozuku/opencode-artifacts.git"
  }
}
```

Then run `npm install` in `~/.config/opencode` and **restart opencode**. Skills are auto-discovered from the repo's `skills/` directory via the plugin's `config` hook - no symlinks or extra config needed.

### Skills only (no plugin)

Add the skills directory directly:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "skills": { "paths": ["/abs/path/to/artifacts-opencode/skills"] }
}
```

> `skills.paths` is the same field the plugin's `config` hook sets automatically - use this section only if you want skills without the plugin.

Then restart opencode.

## Usage

Ask opencode for an artifact:

- "Create a presentation about our Q3 roadmap"
- "Build an interactive canvas showing a particle simulation"
- "Make a dashboard with these metrics"

Each skill asks for the topic/audience, produces an outline for approval, then writes a single `<topic-slug>.html` file in the current directory.

## Artifact conventions

Every generated artifact:

- Is one self-contained `.html` file (CSS + JS inline, no external fonts/CDNs/network).
- Sets `<title>` and a `<meta name="viewport">` tag.
- Ends with a `How to edit this artifact` comment block explaining how to change content, colors, and behavior.

## Development

```bash
npm test
```

Runs the plugin unit tests and the skills validation harness with Node's built-in test runner.

## License

MIT