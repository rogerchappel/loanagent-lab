# loanagent-lab

A tiny local-first lab for synthetic loan-application agent traces. It is deliberately boring in the best way: deterministic fixtures in, reviewer-ready JSON/Markdown out, no network calls.

## Install

The CLI is distributed through GitHub Releases; it is not currently published
to the npm registry. Install the v0.1.0 release artifact into an isolated npm
prefix:

```sh
mkdir loanagent-lab-cli && cd loanagent-lab-cli
npm install --global --prefix ./install \
  https://github.com/rogerchappel/loanagent-lab/releases/download/v0.1.0/loanagent-lab-0.1.0.tgz
./install/bin/loanagent-lab --help
./install/bin/loanagent-lab inspect \
  ./install/lib/node_modules/loanagent-lab/fixtures/sample-good \
  --format markdown --output ./out/sample-good
```

The fixture path above is rooted in the installed package, so inspection does
not depend on a source checkout or its working directory.

To work from a source checkout instead:

```sh
git clone https://github.com/rogerchappel/loanagent-lab.git
cd loanagent-lab
npm install
npm test
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

Application JSON must include a nonempty ID, applicant name, loan product,
loan amount, annual income, monthly debt, credit score, and income-stability
months. See [the documented input bounds](docs/trace-schema.md#application-input).
The CLI rejects unknown options, missing option values, and formats other than
`json` or `markdown` before inspecting an application.

## CLI Help Smoke

Confirm the packaged command starts and prints its help text before relying on a release tarball or downstream automation:

```bash
node bin/loanagent-lab.js --help
```

The command should exit successfully, print the available options, and avoid reading project files or contacting external services.

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
npm run install:smoke
npm pack --dry-run
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

## Package contents

The npm package allowlist includes the runtime files, fixtures, docs, examples,
and the public support documents needed for release review: `README.md`,
`LICENSE`, `SECURITY.md`, `CHANGELOG.md`, `CONTRIBUTING.md`, and
`CODE_OF_CONDUCT.md`.
Run `npm run package:smoke` or `npm pack --dry-run` before publishing to
confirm those files are still present in the tarball.

## Contributing

Small, reviewable PRs are welcome. Prefer synthetic fixtures, deterministic tests, and explicit safety boundaries. See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT

## Release readiness

Before opening a release PR, run the same checks that CI runs:

```sh
npm run release:check
npm pack --dry-run
```

The package smoke keeps the published tarball contents visible before tagging or publishing.
