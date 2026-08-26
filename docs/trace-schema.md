# Decision trace schema

Each trace contains `schemaVersion`, `generatedAt`, `applicationId`, `decision`,
`score`, `metrics`, `factors`, `hardFlags`, `caveats`, `attribution`, and
`reviewerChecklist`.

The schema is designed for deterministic tests and reviewer handoffs, not automated real-world credit decisions.

## generatedAt

`generatedAt` is the ISO-8601 UTC timestamp at which the decision trace was generated (for example `2026-08-26T13:00:00.000Z`). It records the real generation time for reviewer handoffs and audit trails.

`decideApplication` accepts an injectable `now` clock as its third argument, defaulting to `() => new Date().toISOString()`. `inspect` forwards `options.now` the same way, so deterministic tests can pin an exact timestamp while normal runs record the actual generation time.

## Decision policy

The default policy permits debt-to-income ratios through `0.55` for review.
A ratio above `0.55` adds the `debt_to_income_above_review_ceiling` hard flag
and forces a decline, even when the application's score and other metrics
would otherwise qualify it for review. Review and approval decisions never
carry hard flags.

## Application input

Applications must contain these sections and fields:

- `id`: nonempty string
- `applicant.name`: nonempty string
- `loan.product`: nonempty string
- `loan.amount`: finite number from 1 through 10,000,000
- `financials.annualIncome`: finite number from 1 through 10,000,000
- `financials.monthlyDebt`: finite number from 0 through 1,000,000
- `financials.creditScore`: finite number from 300 through 850
- `financials.incomeStabilityMonths`: finite number from 0 through 600

Both ends of each numeric range are accepted. Invalid input raises a
`ValidationError`; `details.invalid` identifies every invalid field and its
expected bounds. Validation happens before scoring or writing reports.
