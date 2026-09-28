import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ArtifactsPlugin } from '../.opencode/plugins/artifacts.js';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const expectedSkillsDir = path.join(repoRoot, 'skills');

test('config hook registers the skills directory', async () => {
  const plugin = await ArtifactsPlugin({ client: {}, directory: '' });
  const config = { skills: {} };
  await plugin.config(config);
  assert.ok(Array.isArray(config.skills.paths), 'skills.paths is an array');
  assert.ok(
    config.skills.paths.some((p) => path.resolve(p) === expectedSkillsDir),
    'skills path points at the repo skills dir'
  );
});

test('config hook is idempotent', async () => {
  const plugin = await ArtifactsPlugin({ client: {}, directory: '' });
  const config = {};
  await plugin.config(config);
  const before = config.skills.paths.length;
  await plugin.config(config);
  assert.equal(config.skills.paths.length, before);
});