export const PRODUCT_NAME = 'loanagent-lab';
export const TRACE_SCHEMA_VERSION = '1.0.0';
export const DEFAULT_DECISION_POLICY = {
  minApproveScore: 72,
  minReviewScore: 50,
  maxDebtToIncomeApprove: 0.43,
  maxDebtToIncomeReview: 0.55,
  minCreditScoreApprove: 680,
  minCreditScoreReview: 600,
  minIncomeStabilityMonths: 12
};
export const DECISIONS = Object.freeze({ APPROVE: 'approve', REVIEW: 'review', DECLINE: 'decline' });
