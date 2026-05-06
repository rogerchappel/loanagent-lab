import test from 'node:test';
import assert from 'node:assert/strict';
import { validateApplication } from '../src/index.js';
test('rejects missing required application sections', () => { assert.throws(() => validateApplication({ id: 'x' }), /missing required/); });
