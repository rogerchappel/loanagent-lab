# Changelog

All notable changes to this project will be documented in this file.

This project follows the [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
format and uses semantic versioning when versioned releases are published.

## [Unreleased]

### Fixed

- Decision traces now carry a real generation timestamp (`generatedAt`)
  instead of the epoch sentinel; `decideApplication` accepts an injectable
  `now` clock and `inspect` forwards `options.now` for deterministic tests.

### Changed

- Application validation now enforces documented identity fields and finite
  numeric bounds before scoring or report generation.
- The CLI now rejects unknown or incomplete options and unsupported formats.

### Added

- npm package allowlist includes fixtures, examples, docs, and support files
  required to review a release-candidate install.
- ReleaseBox smoke configuration now runs the full release check path before
  dry-run packaging.

## [0.1.0] - 2026-05-06

### Added

- Initial project setup for the local-first synthetic loan agent lab MVP.

[Unreleased]: https://github.com/rogerchappel/loanagent-lab/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/rogerchappel/loanagent-lab/releases/tag/v0.1.0
