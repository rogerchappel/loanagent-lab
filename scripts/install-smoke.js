import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      ...options,
    });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (chunk) => { stdout += chunk; });
    child.stderr.on('data', (chunk) => { stderr += chunk; });
    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) resolve({ stdout, stderr });
      else reject(new Error(`${command} ${args.join(' ')} exited ${code}\n${stderr}`));
    });
  });
}

const pkg = JSON.parse(await readFile('package.json', 'utf8'));
const expectedUrl =
  `https://github.com/rogerchappel/loanagent-lab/releases/download/v${pkg.version}/` +
  `loanagent-lab-${pkg.version}.tgz`;
const readme = await readFile('README.md', 'utf8');
if (!readme.includes(expectedUrl)) {
  throw new Error(`README must document the current GitHub release artifact: ${expectedUrl}`);
}

const directory = await mkdtemp(join(tmpdir(), 'loanagent-lab install-'));
try {
  const pack = await run('npm', ['pack', '--json', '--pack-destination', directory]);
  const [{ filename }] = JSON.parse(pack.stdout);
  const prefix = join(directory, 'install');
  await run('npm', ['install', '--global', '--prefix', prefix, join(directory, filename)]);
  const cli = join(prefix, 'bin', 'loanagent-lab');

  const help = await run(cli, ['--help']);
  if (!help.stdout.includes('loanagent-lab')) throw new Error('installed CLI help is invalid');

  const fixtures = await run(cli, ['fixtures']);
  for (const fixture of ['sample-good', 'sample-review', 'sample-thin']) {
    if (!fixtures.stdout.includes(fixture)) throw new Error(`installed CLI fixtures omitted ${fixture}`);
  }

  const output = join(directory, 'output');
  await run(cli, ['inspect', 'fixtures/sample-good', '--format', 'markdown', '--output', output]);
  await readFile(join(output, 'synthetic-good-001.report.md'), 'utf8');
  await readFile(join(output, 'synthetic-good-001.trace.json'), 'utf8');
  console.log('install smoke ok');
} finally {
  await rm(directory, { recursive: true, force: true });
}
