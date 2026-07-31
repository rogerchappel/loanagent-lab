import test from 'node:test';
import assert from 'node:assert/strict';
import { validateApplication } from '../src/index.js';
import { ValidationError } from '../src/errors.js';

const validApplication = {
  id: 'boundary-case',
  applicant: { name: 'Test Applicant' },
  loan: { product: 'personal', amount: 1 },
  financials: { annualIncome: 1, monthlyDebt: 0, creditScore: 300, incomeStabilityMonths: 0 }
};

function fieldsFor(application) {
  let thrown;
  try {
    validateApplication(application);
  } catch (error) {
    thrown = error;
  }
  assert.ok(thrown instanceof ValidationError);
  return thrown.details.invalid.map(({ field }) => field);
}

test('rejects missing required application sections', () => {
  assert.throws(() => validateApplication({ id: 'x' }), /missing required/);
});

test('rejects empty required identity fields with field-specific details', () => {
  const invalid = structuredClone(validApplication);
  invalid.id = ' ';
  invalid.applicant.name = '';
  invalid.loan.product = null;
  assert.deepEqual(fieldsFor(invalid), ['id', 'applicant.name', 'loan.product']);
});

test('accepts documented numeric boundaries', () => {
  assert.equal(validateApplication(validApplication), validApplication);
  assert.doesNotThrow(() => validateApplication({
    ...structuredClone(validApplication),
    loan: { product: 'personal', amount: 10_000_000 },
    financials: { annualIncome: 10_000_000, monthlyDebt: 1_000_000, creditScore: 850, incomeStabilityMonths: 600 }
  }));
});

test('rejects non-finite and out-of-range numeric values', () => {
  const invalid = structuredClone(validApplication);
  invalid.loan.amount = 0;
  invalid.financials.annualIncome = Infinity;
  invalid.financials.monthlyDebt = 1_000_001;
  invalid.financials.creditScore = 851;
  invalid.financials.incomeStabilityMonths = -1;
  assert.deepEqual(fieldsFor(invalid), [
    'loan.amount',
    'financials.annualIncome',
    'financials.monthlyDebt',
    'financials.creditScore',
    'financials.incomeStabilityMonths'
  ]);
});
