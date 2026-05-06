# ORCHESTRATION

LoanAgent Lab is intentionally single-process and local-first.

1. Load a fixture directory or `application.json` file.
2. Validate the synthetic application shape.
3. Score deterministic risk factors.
4. Emit a versioned agent decision trace.
5. Render reviewer handoff artifacts as JSON and Markdown.

No network calls, hidden telemetry, credential access, model calls, or real underwriting integrations are part of V1.
