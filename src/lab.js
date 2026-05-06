import path from 'node:path';
import { loadApplication } from './fixtures.js';
import { decideApplication } from './decision.js';
import { buildReport, renderMarkdown } from './report.js';
import { writeJson } from './utils.js';
import { mkdir, writeFile } from 'node:fs/promises';
export async function inspect(input, options = {}) {
  const app = await loadApplication(input);
  const trace = decideApplication(app, options.policy);
  const report = buildReport(app, trace);
  if (options.output) {
    await mkdir(options.output, { recursive: true });
    await writeJson(path.join(options.output, `${app.id}.trace.json`), report.trace);
    await writeFile(path.join(options.output, `${app.id}.report.md`), renderMarkdown(report));
  }
  return report;
}
