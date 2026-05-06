import test from 'node:test';
import assert from 'node:assert/strict';
import { inspect } from '../src/index.js';
test('approves low-risk synthetic application', async () => { const report = await inspect('fixtures/sample-good'); assert.equal(report.trace.decision, 'approve'); assert.equal(report.trace.schemaVersion, '1.0.0'); });
test('routes borderline application to review', async () => { const report = await inspect('fixtures/sample-review'); assert.equal(report.trace.decision, 'review'); });
test('declines below-floor application with hard flags', async () => { const report = await inspect('fixtures/sample-thin'); assert.equal(report.trace.decision, 'decline'); assert.ok(report.trace.hardFlags.includes('debt_to_income_above_review_ceiling')); });
