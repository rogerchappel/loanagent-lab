import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
export async function readJson(filePath) { return JSON.parse(await readFile(filePath, 'utf8')); }
export async function writeJson(filePath, value) { await mkdir(path.dirname(filePath), { recursive: true }); await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`); }
export function round(value, digits = 2) { const factor = 10 ** digits; return Math.round(value * factor) / factor; }
export function asArray(value) { return Array.isArray(value) ? value : value == null ? [] : [value]; }
