import { inspect, listFixtureDirs } from './index.js';
import { renderMarkdown } from './report.js';
function help() { return `loanagent-lab\n\nUsage:\n  loanagent-lab inspect <fixture-or-application.json> [--output <dir>] [--format json|markdown]\n  loanagent-lab fixtures\n  loanagent-lab --help\n\nLocal-first synthetic loan application agent lab. No network calls.`; }

function usageError(io, message) {
  io.stderr.write(`Error: ${message}\n\n${help()}\n`);
  return 2;
}

function parseInspectOptions(args) {
  const options = { format: 'json', output: undefined };
  const seen = new Set();
  for (let index = 0; index < args.length; index += 2) {
    const option = args[index];
    const value = args[index + 1];
    if (!['--format', '--output'].includes(option)) return { error: `unknown option ${option}` };
    if (seen.has(option)) return { error: `duplicate option ${option}` };
    if (value === undefined || value.startsWith('--')) return { error: `missing value for ${option}` };
    seen.add(option);
    if (option === '--format') options.format = value;
    else options.output = value;
  }
  if (!['json', 'markdown'].includes(options.format)) return { error: `unsupported format ${options.format}` };
  return { options };
}

export async function run(argv = process.argv.slice(2), io = { stdout: process.stdout, stderr: process.stderr }) {
  if (argv.length === 0) { io.stdout.write(`${help()}\n`); return 0; }
  if (argv.length === 1 && ['--help', '-h'].includes(argv[0])) { io.stdout.write(`${help()}\n`); return 0; }
  const [command, input] = argv;
  if (command === 'fixtures') {
    if (argv.length !== 1) return usageError(io, 'fixtures does not accept options');
    const dirs = await listFixtureDirs(); io.stdout.write(`${dirs.join('\n')}\n`); return 0;
  }
  if (command !== 'inspect') return usageError(io, `unknown command ${command}`);
  if (!input || input.startsWith('--')) return usageError(io, 'inspect requires an input path');
  const parsed = parseInspectOptions(argv.slice(2));
  if (parsed.error) return usageError(io, parsed.error);
  const { output, format } = parsed.options;
  const report = await inspect(input, { output });
  io.stdout.write(format === 'markdown' ? `${renderMarkdown(report)}\n` : `${JSON.stringify(report, null, 2)}\n`);
  return 0;
}
