# Release Candidate Checklist

Use this checklist before publishing a LoanAgent Lab package or tagging a release.

## Verification

- Run `npm run release:check`.
- Confirm `npm run smoke` still creates the expected lab artifacts from bundled fixtures.
- Inspect `npm pack --dry-run` output and confirm it includes `bin`, `src`, `fixtures`, `docs`, `README.md`, `LICENSE`, and `SECURITY.md`.

## Evidence

- Record which fixture scenario was used for the smoke output.
- Include trace schema changes in release notes.
- Note any scoring, checklist, or compliance wording changes.

## Support Notes

- Fixtures must remain synthetic and non-financially actionable.
- Do not publish user loan data, lender policies, or private model traces.
