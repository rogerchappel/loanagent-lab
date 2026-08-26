import { DECISIONS, DEFAULT_DECISION_POLICY, TRACE_SCHEMA_VERSION } from './constants.js';
import { scoreApplication } from './scoring.js';
import { complianceCaveats, sourceAttribution } from './compliance.js';
export function decideApplication(app, policy = DEFAULT_DECISION_POLICY, now = () => new Date().toISOString()) {
  const scored = scoreApplication(app, policy);
  const hardFlags = [];
  if (scored.metrics.debtToIncome > policy.maxDebtToIncomeReview) hardFlags.push('debt_to_income_above_review_ceiling');
  if (app.financials.creditScore < policy.minCreditScoreReview) hardFlags.push('credit_score_below_review_floor');
  let decision = DECISIONS.DECLINE;
  if (!hardFlags.length && scored.score >= policy.minApproveScore && scored.metrics.debtToIncome <= policy.maxDebtToIncomeApprove && app.financials.creditScore >= policy.minCreditScoreApprove) decision = DECISIONS.APPROVE;
  else if (!hardFlags.length && scored.score >= policy.minReviewScore && app.financials.creditScore >= policy.minCreditScoreReview) decision = DECISIONS.REVIEW;
  return { schemaVersion: TRACE_SCHEMA_VERSION, generatedAt: now(), applicationId: app.id, decision, score: scored.score, metrics: scored.metrics, factors: scored.factors, hardFlags, caveats: complianceCaveats(app), attribution: sourceAttribution() };
}
