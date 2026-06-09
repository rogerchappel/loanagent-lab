# loanagent-lab

A tiny local-first lab for synthetic loan-application agent traces. It is deliberately boring in the best way: deterministic fixtures in, reviewer-ready JSON/Markdown out, no network calls.

## Install

```sh
npm install
```

## Quickstart

```sh
node bin/loanagent-lab.js inspect fixtures/sample-good --format markdown --output out/sample-good
npm run smoke
```

Use it as a library:

```js
import { inspect } from 'loanagent-lab';
const report = await inspect('fixtures/sample-review');
console.log(report.trace.decision);
```

## What it does

- Loads synthetic loan application fixtures.
- Scores credit, DTI, income stability, and loan-to-income factors deterministically.
- Emits a versioned agent decision trace.
- Produces reviewer checklist handoffs.
- Includes compliance and fair-lending caveats by default.

## Safety

This project is for synthetic testing and developer workflow experiments only. It is not credit advice, underwriting software, legal advice, or a compliance approval system. Do not put real applicant data into fixtures.

## Attribution

Inspired by public loan-application agent demos, including `oxf-loanapplication_agent-grpfull4`, but this repo uses an original implementation, name, scope, fixtures, and docs.

## Verify

```sh
npm test
npm run check
npm run build
npm run smoke
npm run package:smoke
npm run release:check
bash scripts/validate.sh
```

## Development

Use the same local checks that back release readiness:

```sh
npm run check
npm test
npm run build
npm run smoke
npm run package:smoke
npm run release:check
```

Run the narrower commands while iterating, then finish with the broadest available check before opening a PR.

## Contributing

Small, reviewable PRs are welcome. Prefer synthetic fixtures, deterministic tests, and explicit safety boundaries. See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT
