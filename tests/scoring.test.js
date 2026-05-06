import test from 'node:test';
import assert from 'node:assert/strict';
import { loadApplication, scoreApplication } from '../src/index.js';
test('scores strong fixture above approval threshold', async () => { const app = await loadApplication('fixtures/sample-good'); const scored = scoreApplication(app); assert.equal(scored.score, 100); assert.ok(scored.metrics.debtToIncome < 0.3); });
test('scores thin file below review floor', async () => { const app = await loadApplication('fixtures/sample-thin'); const scored = scoreApplication(app); assert.ok(scored.score < 50); });
