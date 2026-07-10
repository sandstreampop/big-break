# Security policy

## Reporting a vulnerability

Please report vulnerabilities privately via GitHub's **private vulnerability
reporting** on this repository (Security → "Report a vulnerability"). Do not
open a public issue for a security problem. You should get an initial response
within a week.

## Scope and threat model

Big Break is a **static, client-only PWA**: there is no server, no accounts,
no secrets, and no user-generated content exchanged between players.

- **Player data** lives entirely in the player's own `localStorage`
  (progression, in-progress run, settings). Save codes (`BB1.…`) are
  base64-encoded JSON a player moves between their own devices; `importSave`
  treats them as untrusted input (parse failures and cross-pack codes are
  rejected).
- **Telemetry** is opt-out product analytics with **no PII by design**: every
  event is game state (card ids, tiers, paths, stat totals) — never player
  input or free text. See `docs/telemetry.md`. The PostHog key in
  `js/analytics.ts` is a public write-only ingest key, not a secret.
- **Content packs** are the main untrusted-input surface for anyone building
  on the engine: a generated or imported pack is treated as hostile until it
  passes `validatePack` (`js/validate.ts`, a never-throws validator) — but
  note that a pack's *plugins* are executable code; only run packs whose code
  you trust or have reviewed. Validation checks the data contract, not the
  behavior of arbitrary plugin functions.
- **Dependencies** are dev-only (build/test toolchain; nothing ships to the
  client except emitted JS and the vendored PostHog loader snippet).
  Dependabot (`.github/dependabot.yml`) and an `npm audit` CI gate watch the
  toolchain.

## Supported versions

The deployed Pages site always runs `main`, which is the only supported
version. `package.json` `version` tracks releases of the engine source; there
are no maintained release branches.
