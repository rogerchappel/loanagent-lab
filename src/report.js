import { reviewerChecklist } from './checklist.js';
export function buildReport(app, trace) { return { application: { id: app.id, applicantName: app.applicant.name, product: app.loan.product, amount: app.loan.amount }, trace: { ...trace, reviewerChecklist: reviewerChecklist(app, trace) } }; }
export function renderMarkdown(report) {
  const { application, trace } = report;
  const factors = trace.factors.map((f) => `- ${f.name}: ${f.points >= 0 ? '+' : ''}${f.points} (${f.evidence})`).join('\n');
  const checklist = trace.reviewerChecklist.map((item) => `- [ ] ${item.label}`).join('\n');
  const caveats = trace.caveats.map((c) => `- ${c}`).join('\n');
  return `# LoanAgent Lab Report\n\nApplication: ${application.id} (${application.applicantName})\nProduct: ${application.product}\nAmount: ${application.amount}\n\n## Recommendation\n\nDecision: **${trace.decision}**\nScore: **${trace.score}/100**\n\n## Metrics\n\n- Debt-to-income: ${trace.metrics.debtToIncome}\n- Loan-to-income: ${trace.metrics.loanToIncome}\n\n## Factors\n\n${factors}\n\n## Reviewer checklist\n\n${checklist}\n\n## Caveats\n\n${caveats}\n\nAttribution: ${trace.attribution}\n`;
}
