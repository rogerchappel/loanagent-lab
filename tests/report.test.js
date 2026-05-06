import test from 'node:test';
import assert from 'node:assert/strict';
import { inspect, renderMarkdown } from '../src/index.js';
test('report contains reviewer checklist and caveats', async () => { const report = await inspect('fixtures/sample-review'); assert.ok(report.trace.reviewerChecklist.length >= 5); assert.match(renderMarkdown(report), /Fair lending|protected-class|Synthetic lab/); });
