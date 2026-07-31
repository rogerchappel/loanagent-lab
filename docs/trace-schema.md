# Decision trace schema

Each trace contains `schemaVersion`, `generatedAt`, `applicationId`, `decision`,
`score`, `metrics`, `factors`, `hardFlags`, `caveats`, `attribution`, and
`reviewerChecklist`.

The schema is designed for deterministic tests and reviewer handoffs, not automated real-world credit decisions.

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
