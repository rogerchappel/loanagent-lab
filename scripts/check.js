import { access, readFile } from 'node:fs/promises';
const required = ['README.md', 'docs/PRD.md', 'docs/TASKS.md', 'docs/ORCHESTRATION.md', 'docs/orchestration.json', 'bin/loanagent-lab.js', 'fixtures/sample-good/application.json'];
for (const file of required) await access(file);
const pkg = JSON.parse(await readFile('package.json', 'utf8'));
if (!pkg.bin?.['loanagent-lab']) throw new Error('missing cli bin');
console.log('check ok');
