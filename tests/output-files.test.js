import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { inspect } from '../src/index.js';
test('inspect writes trace and markdown report', async () => { const dir = await mkdtemp(path.join(tmpdir(), 'loanagent-lab-')); await inspect('fixtures/sample-good', { output: dir }); const trace = await readFile(path.join(dir, 'synthetic-good-001.trace.json'), 'utf8'); const md = await readFile(path.join(dir, 'synthetic-good-001.report.md'), 'utf8'); assert.match(trace, /reviewerChecklist/); assert.match(md, /LoanAgent Lab Report/); await rm(dir, { recursive: true, force: true }); });
