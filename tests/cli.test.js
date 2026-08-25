import test from 'node:test';
import assert from 'node:assert/strict';
import { cp, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { run } from '../src/cli.js';
function sink(){ let text=''; return { stream: { write: (chunk) => { text += chunk; } }, get text(){ return text; } }; }
test('cli help returns usage', async () => { const out = sink(); const code = await run(['--help'], { stdout: out.stream, stderr: sink().stream }); assert.equal(code, 0); assert.match(out.text, /loanagent-lab/); });
test('cli inspect prints json', async () => { const out = sink(); const code = await run(['inspect', 'fixtures/sample-good'], { stdout: out.stream, stderr: sink().stream }); assert.equal(code, 0); assert.match(out.text, /"decision": "approve"/); });

test('fixtures command works when the installed project path contains a space', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'loanagent-lab space-'));
  try {
    await Promise.all([
      cp('bin', path.join(root, 'bin'), { recursive: true }),
      cp('src', path.join(root, 'src'), { recursive: true }),
      cp('fixtures', path.join(root, 'fixtures'), { recursive: true }),
      cp('package.json', path.join(root, 'package.json')),
    ]);
    const result = spawnSync(process.execPath, [path.join(root, 'bin/loanagent-lab.js'), 'fixtures'], {
      encoding: 'utf8',
    });
    assert.equal(result.status, 0, result.stderr);
    for (const fixture of ['sample-good', 'sample-review', 'sample-thin']) {
      assert.match(result.stdout, new RegExp(fixture));
    }
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

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
