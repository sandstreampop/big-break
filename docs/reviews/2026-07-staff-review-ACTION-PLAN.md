# Action plan — Staff Engineer review, 2026-07

Source: `docs/reviews/2026-07-staff-review.md` (external deep-research review of
the whole repo). This plan ingests it **in spirit**: every recommendation is
triaged below into one of three dispositions — *already shipped* (the review
predates recent work; verified against current source, not assumed), *this
branch* (actionable now, in small reversible passes), or *deferred* (with the
reason, so the deferral is a decision rather than an omission).

The review's own bottom line: the engine and its quality net are strong; the
gaps are in the productization layer — correctness of the save guard, standard
ecosystem hygiene, machine-readable contract artifacts, strictness coverage,
and surface discipline on the public API. That is what this plan executes.

---

## Triage: review claim → disposition

| # | Review recommendation | Disposition | Where |
|---|---|---|---|
| 1 | Fix save/load cross-pack guard (comment promises a `packId` check the code doesn't do) | **This branch — Pass 1** | `js/save.ts` `loadRun()` |
| 2 | Make instance-first (`createEngine`/`createGame`) the primary public story | **Already shipped** (verify + polish) | `js/api.ts`, README, docs quickstart teach instances first; `useContentPack` remains but is not taught first. Pass 5 marks it compat-only explicitly. |
| 3 | Publish a real external quickstart / five-minute path | **Already shipped** | `docs-site` `three-commands.mdx`, `quickstart.mdx`, `new-pack` scaffolder, `createGame` embed test |
| 4 | Dependency/security automation: Dependabot, audit gate, SECURITY.md | **This branch — Pass 3** | `.github/dependabot.yml`, `SECURITY.md`, `npm audit` step in `pages.yml` |
| 5 | ESLint + formatting policy | **This branch — Pass 3** (frontier-style, like the strict gate; timeboxed — if the ecosystem cost outweighs the catch-rate, document and defer) | flat config + CI step |
| 6 | Schema-at-the-edge (Zod / JSON Schema) | **Adapted — Pass 4.** No Zod: `validatePack` already IS the hostile-input parse layer (never-throws, total over malformed shapes), so a Zod pre-pass adds a dependency without adding a check. The *real* gap the review names is **portability**: external tools can't consume the contract. Fix that directly with a generated machine-readable contract artifact. | `tools/gen-contract-artifact.mjs` → `docs/pack-contract.json` |
| 7 | Stable machine-readable error-code catalog | **This branch — Pass 4** (codes already exist on every issue; catalog is extracted from source, drift-proofed by a test, published in the artifact) | same tool |
| 8 | Explicit contract versions: `packContractVersion`, `saveSchemaVersion` + migration policy | **This branch — Pass 4** | exported constants in `js/validate.ts` / `js/save.ts`, docs page |
| 9 | Expand `strict` to save, analytics, presenters, packs | **This branch — Pass 2 (partial):** `save.ts`, `analytics.ts`, `version.ts` join the frontier; `loadMeta(): any` gets a real `MetaState` type. Packs/presenter surfaces stay on the ramp (each pack is a big migration; the frontier idiom exists precisely so this widens file-by-file). |
| 10 | Type the loose escape hatches (`SwipeResult [key: string]: any`, `loadMeta(): any`) | **Partial — Pass 2.** `loadMeta` typed. `SwipeResult`'s index signature is load-bearing for plugin-added resolution annotations (documented in `types.ts`); narrowing it is a pack-migration project, deferred with #9's remainder. |
| 11 | `GameRuntime` object owning engine+save+analytics+UI | **Deferred.** `createGame()` already is the composition boundary (validate → start), and there is one shell; adding `dispose()`/adapters now would be speculative API. Revisit when a second host embeds the shell. |
| 12 | Split package into `@big-break/core` / `browser` / `cli`, publish to npm | **Deferred.** Publishing is a product decision (`"private": true` is deliberate while the contract still moves). `js/api.ts` already models the core/browser seam (DOM-free front door, lazy shell import), so the split has a paved path when the decision lands. |
| 13 | De-globalize save/analytics module state | **Adapted.** The namespace/active-pack globals match the one-pack-per-page reality and the shipped PWA; a refactor now buys generality nothing uses. Pass 2 types them; the compat surface is documented in Pass 5. Revisit alongside #11. |
| 14 | Docs reorganized around adopter jobs-to-be-done | **Already shipped** (quickstart / concepts / authoring / shipping IA exists). Pass 4 adds the missing operations page (versioning & migration). |
| 15 | Official LLM co-authoring loop as a documented product feature | **Already shipped** — `docs-site/.../authoring/llm.mdx` ships the generation prompt + repair loop. |
| 16 | Accessibility: keyboard-nav / focus-order coverage beyond axe | **Deferred** — real but its own sprint; logged in `docs/SPRINT-TECH-DEBT.md`. |
| 17 | Child-safe / content-safety mode | **Deferred** — a future requirement tied to external authorship actually landing; needs design, not a patch. Logged. |
| 18 | Dev observability panel (seed, card id, plugin trace, replay-from-seed) | **Deferred** — the diagnostics blob (`exportEvents`) + seeded goldens cover today's debugging; a panel is UI scope. Logged. |
| 19 | Bundle/performance budget policy | **Deferred** — the no-bundler `tsc`→`dist/` build is a deliberate simplicity stance; a budget gate would measure a thing we don't optimize. Logged. |
| 20 | Changelog automation / release body | **Deferred** — release cadence is manual by design at v0.1; revisit at publish time with #12. |

---

## Passes (small, reversible; gates named per pass)

### Pass 0 — this plan
Commit the review + this triage so the work is auditable.

### Pass 1 — correctness: the save cross-pack guard
- `loadRun(expectedPackId?)` rejects a run whose `packId` is present and ≠
  expected (legacy runs without `packId` still resume — back-compat, per the
  original comment's intent).
- Call site (`js/ui/menus.ts`) passes the active pack's id.
- Tests: matching id resumes · mismatched id refuses · legacy untagged run
  resumes · namespaced packs unaffected.
- Gates: `npm run build`, `node --test test/save.test.mjs`, full `node --test`.

### Pass 2 — strictness frontier: persistence + telemetry
- `js/save.ts`: typed `read`/`write`, `MetaState` (known core fields + open
  extension for pack/subsystem fields — honest about the dynamic reality),
  `loadMeta(): MetaState`, typed settings.
- `js/analytics.ts`: typed public surface (`initAnalytics`, `track`,
  `setAnalyticsEnabled`), `window.posthog` declared.
- `js/version.ts` (already trivially strict) + both files join
  `tsconfig.strict.json` include.
- Behavior-identical: annotations erase at emit; golden + save tests pin it.
- Gates: `npm run typecheck`, `npm run build`, `node --test`.

### Pass 3 — ecosystem hygiene
- `.github/dependabot.yml`: npm (root + `docs-site`) + github-actions, weekly.
- `SECURITY.md`: private-vulnerability-reporting policy, scope (static PWA, no
  server, telemetry is non-PII by design), supported versions.
- `pages.yml`: `npm audit --audit-level=high` gate after install (dev-only
  dep tree; the gate is cheap and blocks known-vuln toolchain drift).
- ESLint as a **lint frontier** (mirroring the strict frontier): flat config,
  correctness-focused rules, applied to the files that pass today; CI step.
  Timebox — if recommended rules demand mass churn, ship the narrow config and
  log the widening in SPRINT-TECH-DEBT.
- Gates: workflow YAML sanity, `npx eslint` green, full `npm run check` still green.

### Pass 4 — contract portability + versioning
- `PACK_CONTRACT_VERSION` exported from `js/validate.ts`;
  `SAVE_SCHEMA_VERSION` / `EXPORT_CODE_VERSION` exported and *used* in
  `js/save.ts` (replacing the magic `1`s).
- `tools/gen-contract-artifact.mjs` emits `docs/pack-contract.json`: contract
  version, effect-verb + requires vocabularies (from the engine's real
  exports — runtime truth, not a copy), tiers/sides, and the full issue-code
  catalog extracted from `js/validate.ts` source. Committed like a golden; a
  test regenerates and diffs, so drift fails CI.
- Docs: `shipping/versioning.md` (what bumps which version; how saves
  migrate; what an external tool may rely on).
- Gates: new test green under `node --test`, docs-site build green.

### Pass 5 — public-surface discipline
- `js/api.ts`: `useContentPack`/`activePack` explicitly marked compat/legacy
  in the doc comment (instances are the story; these remain for the shell).
- README: add the "why this instead of a from-scratch LLM app" positioning
  line the review asked for (short — the moat is the authoring/safety stack),
  link SECURITY.md.
- `docs/SPRINT-TECH-DEBT.md`: log every deferral above with its trigger
  condition.

### Final — adversarial review + merge
- Fresh-context `verifier` pass over the full diff (writer ≠ grader), plus a
  `/code-review`-style skeptic pass; fix what survives verification.
- Full suite: `npm run ci` (build, typecheck, neutrality, contract, lint,
  sim gates, goldens, all four browser suites) + docs-site build.
- Push branch, then land on `main` (explicitly authorized for this task);
  Pages CI re-gates everything on main before deploy.

Hand-off will close with the working agreement's three lines
(verified ✓ / not verified ⚠ / watch-out).
