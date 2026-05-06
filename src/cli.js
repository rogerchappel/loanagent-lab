import { inspect, listFixtureDirs } from './index.js';
import { renderMarkdown } from './report.js';
function help() { return `loanagent-lab\n\nUsage:\n  loanagent-lab inspect <fixture-or-application.json> [--output <dir>] [--format json|markdown]\n  loanagent-lab fixtures\n  loanagent-lab --help\n\nLocal-first synthetic loan application agent lab. No network calls.`; }
export async function run(argv = process.argv.slice(2), io = { stdout: process.stdout, stderr: process.stderr }) {
  if (argv.length === 0 || argv.includes('--help') || argv.includes('-h')) { io.stdout.write(`${help()}\n`); return 0; }
  const [command, input] = argv;
  if (command === 'fixtures') { const dirs = await listFixtureDirs(); io.stdout.write(`${dirs.join('\n')}\n`); return 0; }
  if (command !== 'inspect' || !input) { io.stderr.write(`${help()}\n`); return 2; }
  const outputIndex = argv.indexOf('--output');
  const formatIndex = argv.indexOf('--format');
  const output = outputIndex >= 0 ? argv[outputIndex + 1] : undefined;
  const format = formatIndex >= 0 ? argv[formatIndex + 1] : 'json';
  const report = await inspect(input, { output });
  io.stdout.write(format === 'markdown' ? `${renderMarkdown(report)}\n` : `${JSON.stringify(report, null, 2)}\n`);
  return 0;
}
