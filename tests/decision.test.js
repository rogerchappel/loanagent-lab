import test from 'node:test';
import assert from 'node:assert/strict';
import { decideApplication, inspect } from '../src/index.js';

function applicationAtDebtToIncome(debtToIncome) {
  return {
    id: `dti-${debtToIncome}`,
    synthetic: true,
    applicant: { name: 'Test Applicant' },
    loan: { product: 'demo', amount: 100000 },
    financials: {
      annualIncome: 120000,
      monthlyDebt: debtToIncome * 10000,
      creditScore: 800,
      incomeStabilityMonths: 48
    }
  };
}

test('approves low-risk synthetic application', async () => { const report = await inspect('fixtures/sample-good'); assert.equal(report.trace.decision, 'approve'); assert.equal(report.trace.schemaVersion, '1.0.0'); });
test('routes borderline application to review', async () => { const report = await inspect('fixtures/sample-review'); assert.equal(report.trace.decision, 'review'); });
test('declines below-floor application with hard flags', async () => { const report = await inspect('fixtures/sample-thin'); assert.equal(report.trace.decision, 'decline'); assert.ok(report.trace.hardFlags.includes('debt_to_income_above_review_ceiling')); });
test('allows review at the debt-to-income review ceiling', () => {
  const trace = decideApplication(applicationAtDebtToIncome(0.55));

  assert.equal(trace.metrics.debtToIncome, 0.55);
  assert.equal(trace.decision, 'review');
  assert.deepEqual(trace.hardFlags, []);
});

test('declines a high-scoring application above the debt-to-income review ceiling', () => {
  const trace = decideApplication(applicationAtDebtToIncome(0.56));

  assert.equal(trace.metrics.debtToIncome, 0.56);
  assert.ok(trace.score >= 50);
  assert.equal(trace.decision, 'decline');
  assert.deepEqual(trace.hardFlags, ['debt_to_income_above_review_ceiling']);
});
