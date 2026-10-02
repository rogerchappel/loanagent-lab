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
  return {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    type: 'object',
    additionalProperties: false,
    required: ['schemaVersion', 'generatedAt', 'applicationId', 'decision', 'score', 'metrics', 'factors', 'hardFlags', 'caveats', 'attribution', 'reviewerChecklist'],
    properties: {
      schemaVersion: { type: 'string', const: '1.0.0' },
      generatedAt: { type: 'string', format: 'date-time' },
      applicationId: { type: 'string', minLength: 1 },
      decision: { type: 'string', enum: ['approve', 'review', 'decline'] },
      score: { type: 'number', minimum: 0, maximum: 100 },
      metrics: {
        type: 'object', additionalProperties: false,
        required: ['monthlyIncome', 'debtToIncome', 'loanToIncome'],
        properties: {
          monthlyIncome: { type: 'number', minimum: 0 },
          debtToIncome: { type: 'number', minimum: 0 },
          loanToIncome: { type: 'number', minimum: 0 }
        }
      },
      factors: {
        type: 'array', items: {
          type: 'object', additionalProperties: false,
          required: ['name', 'points', 'evidence'],
          properties: {
            name: { type: 'string', minLength: 1 },
            points: { type: 'number' },
            evidence: { type: 'string' }
          }
        }
      },
      hardFlags: { type: 'array', items: { type: 'string' } },
      caveats: { type: 'array', items: { type: 'string' } },
      attribution: { type: 'string', minLength: 1 },
      reviewerChecklist: {
        type: 'array', items: {
          type: 'object', additionalProperties: false,
          required: ['id', 'label', 'required'],
          properties: {
            id: { type: 'string', minLength: 1 },
            label: { type: 'string', minLength: 1 },
            required: { type: 'boolean' }
          }
        }
      }
    }
  };
}
