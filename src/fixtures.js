import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readJson } from './utils.js';
import { validateApplication } from './schema.js';
export async function loadApplication(inputPath) {
  const statPath = inputPath.endsWith('.json') ? inputPath : path.join(inputPath, 'application.json');
  return validateApplication(await readJson(statPath));
}
export async function listFixtureDirs(fixturesRoot = fileURLToPath(new URL('../fixtures', import.meta.url))) {
  const entries = await readdir(fixturesRoot, { withFileTypes: true });
  return entries.filter((entry) => entry.isDirectory()).map((entry) => path.join(fixturesRoot, entry.name)).sort();
}
