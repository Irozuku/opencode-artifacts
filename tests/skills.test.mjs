import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const skillsDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../skills');

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) return {};
  const fm = {};
  for (const line of match[1].split('\n')) {
    const idx = line.indexOf(':');
    if (idx > 0) fm[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  }
  return fm;
}

const skillDirs = readdirSync(skillsDir, { withFileTypes: true }).filter((d) => d.isDirectory());

for (const dir of skillDirs) {
  test(`skill "${dir.name}" is valid`, () => {
    const content = readFileSync(path.join(skillsDir, dir.name, 'SKILL.md'), 'utf8');
    const fm = parseFrontmatter(content);
    assert.ok(content.length > 100, 'SKILL.md has a real body');
    assert.equal(fm.name, dir.name, 'frontmatter name matches folder name');
    assert.ok(fm.description && fm.description.length > 20, 'description is present and descriptive');
    assert.ok(content.includes('How to edit this artifact'), 'template ends with the edit-guide comment');
    assert.ok(content.includes('name="viewport"'), 'template sets a viewport meta tag');
    assert.ok(content.includes('<title>'), 'template sets a title');
  });
}