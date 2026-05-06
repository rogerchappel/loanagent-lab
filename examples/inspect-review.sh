#!/usr/bin/env bash
set -euo pipefail
node bin/loanagent-lab.js inspect fixtures/sample-review --format json --output out/sample-review
