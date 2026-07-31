import { ValidationError } from './errors.js';

export const APPLICATION_LIMITS = Object.freeze({
  'loan.amount': { min: 1, max: 10_000_000 },
  'financials.annualIncome': { min: 1, max: 10_000_000 },
  'financials.monthlyDebt': { min: 0, max: 1_000_000 },
  'financials.creditScore': { min: 300, max: 850 },
  'financials.incomeStabilityMonths': { min: 0, max: 600 }
});

export function validateApplication(app) {
  const missing = [];
  for (const key of ['id', 'applicant', 'loan', 'financials']) if (!app?.[key]) missing.push(key);
  if (missing.length) throw new ValidationError('Application is missing required sections.', { missing });

  const invalid = [];
  for (const [field, value] of [
    ['id', app.id],
    ['applicant.name', app.applicant.name],
    ['loan.product', app.loan.product]
  ]) {
    if (typeof value !== 'string' || value.trim().length === 0) {
      invalid.push({ field, reason: 'must be a nonempty string' });
    }
  }

  for (const [field, value] of [
    ['loan.amount', app.loan.amount],
    ['financials.annualIncome', app.financials.annualIncome],
    ['financials.monthlyDebt', app.financials.monthlyDebt],
    ['financials.creditScore', app.financials.creditScore],
    ['financials.incomeStabilityMonths', app.financials.incomeStabilityMonths]
  ]) {
    const { min, max } = APPLICATION_LIMITS[field];
    if (typeof value !== 'number' || !Number.isFinite(value) || value < min || value > max) {
      invalid.push({ field, reason: 'must be a finite number within bounds', min, max });
    }
  }

  if (invalid.length) throw new ValidationError('Application has invalid fields.', { invalid });
  return app;
}
export function traceSchema() {
  return { type: 'object', required: ['schemaVersion', 'generatedAt', 'applicationId', 'decision', 'score', 'metrics', 'factors', 'hardFlags', 'caveats', 'attribution', 'reviewerChecklist'] };
}
