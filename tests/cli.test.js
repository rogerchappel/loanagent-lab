import test from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/cli.js';
function sink(){ let text=''; return { stream: { write: (chunk) => { text += chunk; } }, get text(){ return text; } }; }
test('cli help returns usage', async () => { const out = sink(); const code = await run(['--help'], { stdout: out.stream, stderr: sink().stream }); assert.equal(code, 0); assert.match(out.text, /loanagent-lab/); });
test('cli inspect prints json', async () => { const out = sink(); const code = await run(['inspect', 'fixtures/sample-good'], { stdout: out.stream, stderr: sink().stream }); assert.equal(code, 0); assert.match(out.text, /"decision": "approve"/); });

for (const argv of [
  ['inspect', 'fixtures/sample-good', '--format', 'xml'],
  ['inspect', 'fixtures/sample-good', '--format'],
  ['inspect', 'fixtures/sample-good', '--unknown'],
  ['fixtures', '--format', 'json'],
  ['--help', '--unknown']
]) {
  test(`cli rejects unsupported arguments: ${argv.join(' ')}`, async () => {
    const out = sink();
    const err = sink();
    const code = await run(argv, { stdout: out.stream, stderr: err.stream });
    assert.equal(code, 2);
    assert.equal(out.text, '');
    assert.match(err.text, /Error:/);
  });
}
