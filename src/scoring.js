import { DEFAULT_DECISION_POLICY } from './constants.js';
import { round } from './utils.js';
export function calculateMetrics(app) {
  const monthlyIncome = app.financials.annualIncome / 12;
  const dti = monthlyIncome > 0 ? app.financials.monthlyDebt / monthlyIncome : 1;
  const loanToIncome = app.loan.amount / Math.max(app.financials.annualIncome, 1);
  return { monthlyIncome: round(monthlyIncome), debtToIncome: round(dti, 4), loanToIncome: round(loanToIncome, 4) };
}
export function scoreApplication(app, policy = DEFAULT_DECISION_POLICY) {
  const metrics = calculateMetrics(app);
  let score = 50;
  const factors = [];
  const add = (name, points, evidence) => { score += points; factors.push({ name, points, evidence }); };
  const credit = app.financials.creditScore;
  if (credit >= 740) add('strong_credit_history', 22, `credit score ${credit}`); else if (credit >= policy.minCreditScoreApprove) add('acceptable_credit_history', 14, `credit score ${credit}`); else if (credit >= policy.minCreditScoreReview) add('thin_or_mixed_credit_history', 0, `credit score ${credit}`); else add('credit_below_review_floor', -25, `credit score ${credit}`);
  if (metrics.debtToIncome <= 0.30) add('low_debt_to_income', 18, `DTI ${metrics.debtToIncome}`); else if (metrics.debtToIncome <= policy.maxDebtToIncomeApprove) add('manageable_debt_to_income', 9, `DTI ${metrics.debtToIncome}`); else if (metrics.debtToIncome <= policy.maxDebtToIncomeReview) add('elevated_debt_to_income', -10, `DTI ${metrics.debtToIncome}`); else add('high_debt_to_income', -24, `DTI ${metrics.debtToIncome}`);
  const months = app.financials.incomeStabilityMonths ?? 0;
  if (months >= 36) add('stable_income', 10, `${months} months`); else if (months >= policy.minIncomeStabilityMonths) add('adequate_income_stability', 4, `${months} months`); else add('short_income_history', -12, `${months} months`);
  if (metrics.loanToIncome <= 1.5) add('modest_loan_size', 8, `LTI ${metrics.loanToIncome}`); else if (metrics.loanToIncome <= 3) add('moderate_loan_size', 0, `LTI ${metrics.loanToIncome}`); else add('large_loan_relative_to_income', -8, `LTI ${metrics.loanToIncome}`);
  return { score: Math.max(0, Math.min(100, Math.round(score))), factors, metrics };
}
