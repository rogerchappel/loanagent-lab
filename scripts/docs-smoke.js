import { spawnSync } from 'node:child_process';
import { readFileSync, rmSync } from 'node:fs';

const prd = readFileSync('docs/PRD.md', 'utf8');
const match = prd.match(/^loanagent-lab inspect (\S+) --output (\S+)$/m);
if (!match) throw new Error('docs/PRD.md must contain the documented inspect example');

const [, fixture, output] = match;

function inspect(input, destination) {
  return spawnSync(
    process.execPath,
    ['bin/loanagent-lab.js', 'inspect', input, '--output', destination],
    { encoding: 'utf8' },
  );
}

rmSync(output, { recursive: true, force: true });
try {
  const documented = inspect(fixture, output);
  if (documented.status !== 0) {
    throw new Error(`documented PRD command failed:\n${documented.stderr}`);
  }

  const missing = inspect('fixtures/does-not-exist', `${output}-missing`);
  if (missing.status === 0) {
    throw new Error('nonexistent fixture path unexpectedly succeeded');
  }

  console.log('docs smoke ok');
} finally {
  rmSync(output, { recursive: true, force: true });
  rmSync(`${output}-missing`, { recursive: true, force: true });
}
