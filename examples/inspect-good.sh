#!/usr/bin/env bash
set -euo pipefail
node bin/loanagent-lab.js inspect fixtures/sample-good --format markdown --output out/sample-good
