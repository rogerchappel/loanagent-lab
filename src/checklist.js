export function reviewerChecklist(app, trace) {
  const items = [
    { id: 'verify_synthetic_fixture', label: 'Confirm this is synthetic test data, not a real applicant file.', required: true },
    { id: 'verify_income_documents', label: `Check stated annual income of ${app.financials.annualIncome}.`, required: true },
    { id: 'review_credit_evidence', label: `Review credit score evidence for ${app.financials.creditScore}.`, required: true },
    { id: 'assess_dti', label: `Assess debt-to-income ratio ${trace.metrics.debtToIncome}.`, required: true },
    { id: 'fair_lending_review', label: 'Confirm no protected-class fields influenced the recommendation.', required: true }
  ];
  if (trace.decision !== 'approve') items.push({ id: 'adverse_action_draft', label: 'Draft human-reviewed reasons before any adverse-action simulation.', required: true });
  if (trace.hardFlags.length) items.push({ id: 'hard_flag_review', label: `Resolve hard flags: ${trace.hardFlags.join(', ')}.`, required: true });
  return items;
}
