import test from 'node:test';
import assert from 'node:assert/strict';
import { inspect, traceSchema, validateApplication } from '../src/index.js';
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

test('trace schema describes generated report traces and rejects malformed fields', async () => {
  const report = await inspect('fixtures/sample-good', { now: () => '2026-08-26T00:00:00.000Z' });
  const schema = traceSchema();
  const validate = (trace) => {
    const errors = [];
    const check = (value, definition, path) => {
      if (definition.type === 'object') {
        if (value === null || typeof value !== 'object' || Array.isArray(value)) { errors.push(path); return; }
        for (const key of definition.required ?? []) if (!(key in value)) errors.push(`${path}.${key}`);
        if (definition.additionalProperties === false) for (const key of Object.keys(value)) if (!(key in definition.properties)) errors.push(`${path}.${key}`);
        for (const [key, child] of Object.entries(definition.properties ?? {})) if (key in value) check(value[key], child, `${path}.${key}`);
      } else if (definition.type === 'array') {
        if (!Array.isArray(value)) { errors.push(path); return; }
        value.forEach((item, index) => check(item, definition.items, `${path}[${index}]`));
      } else if (definition.type === 'number') {
        if (typeof value !== 'number' || !Number.isFinite(value) || (definition.minimum !== undefined && value < definition.minimum) || (definition.maximum !== undefined && value > definition.maximum)) errors.push(path);
      } else if (definition.type === 'string') {
        if (typeof value !== 'string' || (definition.minLength && value.length < definition.minLength) || (definition.const && value !== definition.const) || (definition.enum && !definition.enum.includes(value))) errors.push(path);
      } else if (typeof value !== definition.type) errors.push(path);
    };
    check(trace, schema, '$');
    return errors;
  };
  assert.deepEqual(validate(report.trace), []);
  const invalid = structuredClone(report.trace);
  invalid.score = 'high';
  invalid.unexpected = true;
  assert.deepEqual(validate(invalid), ['$.unexpected', '$.score']);
});

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
