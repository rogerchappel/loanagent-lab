import { mkdir, cp, writeFile } from 'node:fs/promises';
await mkdir('dist', { recursive: true });
await cp('src', 'dist/src', { recursive: true });
await cp('bin', 'dist/bin', { recursive: true });
await writeFile('dist/README.txt', 'loanagent-lab build artifact\n');
console.log('build ok');
