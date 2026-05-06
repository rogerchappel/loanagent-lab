import { spawnSync } from 'node:child_process';
const result = spawnSync(process.execPath, ['bin/loanagent-lab.js', 'inspect', 'fixtures/sample-good', '--format', 'markdown'], { encoding: 'utf8' });
if (result.status !== 0) throw new Error(result.stderr || 'smoke failed');
if (!result.stdout.includes('Decision: **approve**')) throw new Error('smoke output missing approve decision');
console.log('smoke ok');
