import { ValidationError } from './errors.js';
export function validateApplication(app) {
  const missing = [];
  for (const key of ['id', 'applicant', 'loan', 'financials']) if (!app?.[key]) missing.push(key);
  if (missing.length) throw new ValidationError('Application is missing required sections.', { missing });
  const requiredNumbers = [['loan.amount', app.loan.amount], ['financials.annualIncome', app.financials.annualIncome], ['financials.monthlyDebt', app.financials.monthlyDebt], ['financials.creditScore', app.financials.creditScore]];
  const invalid = requiredNumbers.filter(([, value]) => typeof value !== 'number' || Number.isNaN(value) || value < 0).map(([field]) => field);
  if (invalid.length) throw new ValidationError('Application has invalid numeric fields.', { invalid });
  return app;
}
export function traceSchema() {
  return { type: 'object', required: ['schemaVersion', 'applicationId', 'decision', 'score', 'factors', 'caveats', 'reviewerChecklist'] };
}
