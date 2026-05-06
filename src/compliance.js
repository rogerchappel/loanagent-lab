export function complianceCaveats(app) {
  const caveats = ['Synthetic lab output only; not credit, legal, compliance, or underwriting advice.', 'Do not use protected-class attributes to approve, decline, price, or prioritize real applicants.', 'Review adverse-action reasons with qualified compliance counsel before any real-world adaptation.'];
  if (app.synthetic !== true) caveats.unshift('Input is not marked synthetic=true; treat this as unsafe for the lab until confirmed.');
  if (app.applicant?.demographics) caveats.push('Demographic fields are present for fairness testing only and are excluded from scoring.');
  return caveats;
}
export function sourceAttribution() { return 'Inspired by public loan-application agent demos; implementation, fixtures, and policy are original and synthetic.'; }
