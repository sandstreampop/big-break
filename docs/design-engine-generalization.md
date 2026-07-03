# Plan: Generalize Big Break into a genre-agnostic core + swappable packs

## Context

Big Break is a polished single-genre prototype (a music-career roguelike). The
owner wants a **second game on the same engine** — a "paradise hotel × murder
mystery" (reality-show survival with amateur-detective flavor) — with different
stats, events, perks, contracts, etc. The engine is genuinely good and ~70%
genre-neutral already, but the genre is welded in at specific seams, so today a
second genre isn't possible without forking.

This plan turns the prototype into a **stable core + content/theme packs**: the
music game becomes pack #1, and "mystery" becomes pack #2, sharing one engine in
one codebase. This is a foundation refactor, not the mystery game's content
design — content authoring is the final phase, after the core is genre-agnostic
and defended by a regression net.

### Locked decisions (from strategy discussion)
1. **Codebase model:** shared engine, two content packs in one repo (not a fork).
2. **Subsystems:** full plugin/hook framework. The songs/charts subsystem (~175
   lines, welded into the engine, load-bearing for the `hitfactory` win-path),
   plus venues/band/rival, all become plugins registered against engine
   lifecycle hooks — **but the hook interface is validated against the mystery
   pack's real needs before it locks**, to avoid designing hooks against only
   one example.
3. **Safety net first:** build the full regression net (golden-master + a
   gating simulator + CI) *before* any engine edit.
4. **Types:** **full TypeScript with a build step** (`.ts` source → emitted
   `.js`), for the strongest type ergonomics — real generics/mapped types on the
   plugin interface and the pack manifest (`Pack<S extends StatSchema>`,
   `Record<StatId, number>`), where the boundary types are most load-bearing.
   Type the boundaries first (pack manifest, event/effect schema, plugin
   interface, stat/resource taxonomy), lighter on internal engine plumbing. `tsc`
   is a CI gate beside `lint-content.mjs`. Rationale: this codebase is mostly
   hand-authored, string-keyed, agent-authored data — the bug class the refactor
   is most exposed to (renamed-key drift, `undefined→NaN`, hallucinated effect
   keys) is exactly what static checks catch and tests catch only indirectly.
   Types and golden-master tests are complements.
   - **Cost this imposes (must be mitigated, see Phase 0):** a build step puts a
     compiler in two safety-critical paths — the Pages deploy (which today ships
     source verbatim) and the golden-master oracle (which today imports engine
     source directly in Node). During a refactor whose correctness proof is
     "byte-identical seeded output," a silent compiler-config change (target,
     downleveling, helper injection) could shift output and masquerade as a
     regression.
   - **Mitigations, baked into the plan:** (a) **Lock the regression net on
     today's pure-`.js` code *first* (Phase 0), before the compiler exists.** The
     golden master measures *runtime behavior*, not file bytes, so introducing
     the build later is itself a **byte-green step the net polices** — proving the
     compiler changed nothing, instead of baselining on top of it. (b) **Pin the
     toolchain** — exact `typescript` version + frozen `tsconfig` (fixed
     `target`/`module`/`lib`); any change is a **re-baseline event** (like 4.5).
     (c) **Once the build lands, the oracle runs the emitted `dist/`** so
     what's tested === what deploys === what runs. (d) Use **plain `tsc` emit
     with `outDir`** mirroring the source tree (ESM, 1:1 layout — no bundler
     magic), so import paths and the PWA/`sw.js` cache list stay structurally
     identical, just rooted at `dist/`.

### The finding that reframes Phase 0
`tools/simulate.mjs` runs on `Math.random`, **not** the seeded RNG. It never
sets `state.seed` and passes `Math.random` into `resolveSwipe` (sim lines
~86–150). The `mulberry32`/`rngUses` machinery (engine.js 44–74) is a
browser/resume feature only; the sim is pure Monte Carlo. **You cannot snapshot
today's sim as a golden master — identical inputs diverge.** So the very first
task is a *deterministic sim driver*; only then is a snapshot meaningful.

## The refactor guardrail (applies to every step)
Because the core carries a seeded RNG, a clean refactor step must be
**byte-identical** on the golden corpus. Every step below is tagged:
- **[byte-green]** — must reproduce identical seeded output. A golden diff is a
  bug, not a re-baseline. This is the proof the step changed nothing.
- **[re-baseline-risk]** — legitimately may change seeded output; isolate in its
  own PR, guard with a semantic `--check` invariant, re-baseline deliberately.

## Phased plan

### Phase 0 — Safety net, on today's pure-`.js` code (no build, no TS yet)
*Lock the net against the codebase exactly as it is, so it reflects real current
behavior with zero confounding variables. engine.js rules untouched; each lands
on main.*
- **0.1 Deterministic sim driver.** *Prereq for any snapshot; independent of TS.*
  Seed loadout / policy / minigame choices from a seeded meta-RNG; set
  `state.seed` per run; thread a seeded generator into `resolveSwipe` instead of
  `Math.random`. Touches `tools/simulate.mjs` (+ possibly a small seed hook in
  `newRun`), **not** engine rules.
- **0.2 Golden-master snapshots.** Fix a corpus of `(seed, loadout, policy)`
  tuples; snapshot full run traces (tier log, stat/resource deltas, finale
  readings, LP). Runner via Node's built-in `node:test`, importing the **current
  source `.js`** directly in Node (as the sim does today). This is the oracle
  every later step is proven against.
- **0.3 `simulate.mjs --check`.** Give the sim teeth: `exit(1)` on gate breaches
  — success band 25–40%, card-reach never-drawn-ungated = 0, story-seed funnel
  ≥65%. Keep `--check` on a fixed seed set, separate from the Monte-Carlo feel
  report (`node tools/simulate.mjs 4000 narrative` stays the human feel judge).
- **0.4 CI workflow (blocking deploy).** New workflow runs `lint-content.mjs` +
  `sim --check` + golden diff, gating the Pages deploy. **No `tsc` yet; deploy
  still ships source as today.** Today only `pages.yml` deploys and nothing
  checks — this gate must exist before *any* structural change.
- Dependency: **0.1 → 0.2 → 0.3/0.4.** The net is fully locked on current
  behavior before a single tool or type is introduced.

### Phase 0.5 — Introduce the build + TS toolchain as the FIRST policed change [byte-green]
- Add `package.json` (first in repo), pinned `typescript`, a frozen `tsconfig`
  (`allowJs` on, `target` fixed), and a `tsc` `outDir` build emitting `dist/` as
  ESM mirroring the source tree 1:1. No `.ts` yet — files pass through unchanged.
- Repoint `index.html` / `sw.js` / the golden runner / the sim at `dist/`; add the
  `tsc` build to CI; change Pages `path:` from `.` to `dist/`.
- **This transition must be byte-green against the Phase-0 net** — that is the
  proof introducing the compiler changed no behavior. If it isn't green, the
  build changed something and you catch it *here*, not three refactors deep. Pin
  the toolchain; tsconfig/version bumps are re-baseline events.

### Phase 1 — Convert to `.ts`, boundaries first (co-evolve; don't front-load) [byte-green]
- **1.1** Incrementally rename `.js → .ts` and type the *existing* event/effect
  schema and stat/resource taxonomy as they stand; flip `allowJs` off file-by-file
  and tighten `tsconfig` strictness on a ramp. Each conversion must stay
  **byte-green** against the oracle — the emitted `dist/` is the proof the rename
  changed no behavior. Do **not** author a full pack-manifest type before the
  manifest exists (Phase 2/3) — sketch it as a design artifact, implement it when
  the shape is real.

### Phase 2 — Invert content loading (IoC) [byte-green]
- **2.1 DI plumbing.** `newRun(pack, opts)` where `pack` bundles what the engine
  imports today (events, instruments, genres, venues, band, rivals, weather,
  arcs, contracts, hustles). Engine imports **no** content module.
  - ⚠️ Hazard: freeze the **construction draw order** in `newRun` (chartSeed →
    rollSeeds → flashpointAt → actTwist → rollWeather → randomRival). Reordering
    shifts every downstream draw and invalidates the whole golden corpus.
- **2.2 Split `config.js`** into balance knobs (numeric: `rollBase`,
  `jitterByAct`, thresholds…) vs **pack manifest** (taxonomy: `PATHS`,
  `winGates`, `STAT_META`, stat/resource lists).

### Phase 3 — Genericize the taxonomy
- **3.1 [byte-green]** Engine reads `manifest.stats` instead of module-level
  `const STATS = [...]` (engine.js:38); keep array content **and order** identical.
- **3.2 [re-baseline-risk]** Genericize resource handlers. `fame/money/hits/
  pathProgress/rivalry` are bespoke blocks with per-resource multipliers/clamps
  (engine.js ~902–948). Turn them into a declared resource loop **with
  per-resource config** (don't force one formula); preserve block order so
  RNG-consuming blocks don't move. Hold arithmetic exactly → stays byte-green;
  that's the proof.
- **3.3 [byte-green]** Genericize the *readers* in the same pass: `pathScore`
  (simulate.mjs:29), `evaluateFinale` (engine.js:1327), `requires` (engine.js:445)
  all special-case `key==='fame'`/`'hits'`. Genericize so a pack without "fame"
  doesn't trip a special-case. (Mistake to avoid: half-genericizing and leaving
  readers special-cased.)

### Phase 4 — Plugin framework + strangler-fig extraction
- **4.1 [byte-green]** Define hook dispatch points (`onEffect`, `onActBreak`,
  `onTick`, `onFinaleContribution`, `onConstruct` for seeded rolls). Dispatch to
  an empty registry — no plugin yet.
- **4.2 [byte-green] Extract venue** — the canary (zero RNG:
  `adoptVenue`/`venueLove`). Register old + new, assert seeded equality, then
  delete old.
- **4.3 Extract rival** — mostly pure; its one construction draw stays in
  `onConstruct` at the same ordinal position.
- **4.4 Extract band** act-break quirks — watch the RNG-drawing "notebook"
  bandmate (engine.js ~1276–1279).
- **4.5 [re-baseline-risk] Extract songs — LAST, highest risk.** Interleaved RNG
  across `applyEffects`/`startAct`/`evaluateFinale`; `hits` is incremented in
  **two** places (`crownCheck` engine.js:281 and the "instant classic"
  `effects.hits` block ~937) — **both must move into the plugin** or you
  double-count. Feeds `onFinaleContribution` (the `hitfactory` gate). De-risk:
  run old+new in parallel over the corpus, assert byte-equality, delete old only
  after green; add a `--check` invariant on hits-distribution and `hitfactory`
  success rate so even a forced re-baseline can't silently move the win-path.
- **Extract themed prose** (deadlineAudit, act-break notes, chart copy,
  declined-card gag) into structured **note codes** the pack renders — folds into
  4.2–4.5 as each subsystem moves. Make hardcoded perk ids data-driven with typed
  hooks in the same spirit.
- **Interface-lock checkpoint:** before calling the hook set final, sanity-check
  it against the mystery pack's intended subsystems (per decision #2). Adjust
  hooks while music is the only consumer is cheap; after mystery ships is not.

### Phase 5 — Second pack (mystery)
- **5.1** Author the mystery pack against the typed manifest + plugin interface:
  own stats/resources/paths/winGates/STAT_META, own event/effect corpus, own
  domain plugins (whatever replaces songs/charts — e.g. a suspicion/clue track),
  own note-code renderers, CSS/art/title.
- **5.2** Ships **dark** (registered in no surfaced pack registry) until
  `sim --check` passes *its own* gates on *its own* golden corpus. The music
  pack's golden masters stay green throughout.

## Branch / shipping strategy
Once Phase 0's blocking CI gate exists, land each step directly on `main` (repo
convention) — the golden masters protect the live music game on every push. No
long-lived branch needed for behavior-preserving steps. Re-baseline steps (3.2,
4.5) land as isolated PRs that regenerate the snapshot *and* carry the semantic
`--check` invariant. The mystery pack stays dark until playable.

## Re-baseline register (only these may change seeded output)
- **tsconfig/compiler change** — any `target`/`module`/`lib`/`typescript`-version
  bump can shift emit → re-baseline event; pin the toolchain and treat bumps
  deliberately.
- **2.1** — only if construction draw order changes → freeze it, stay byte-green.
- **3.2** — hold arithmetic exactly to stay byte-green; re-baseline only if forced.
- **4.5** — the one place a deliberate re-baseline is most likely; isolate + guard.
- Everything else must be **byte-identical**; a diff there is a bug.

## Critical files
- `js/engine.js` — taxonomy const (38), resource handlers (~902–948), songs
  subsystem (185–360), finale (1321+), newRun construction order (91–183).
- `js/config.js` — split balance vs manifest (`winGates` 92, `PATHS` 110,
  `STAT_META` 134).
- `tools/simulate.mjs` — deterministic driver (0.1), `--check` (0.3), `pathScore`
  genericization (3.3).
- `tools/lint-content.mjs` — extend for pack-schema; already an `exit(1)` gate.
- `.github/workflows/pages.yml` — add `tsc` build job; deploy `dist/` not `.` (0.5).
- **New:** `package.json` (first in repo), pinned `typescript` + frozen
  `tsconfig.json`; `dist/` emit target (0.5).
- `index.html` / `sw.js` — repoint at `dist/` and update the PWA cache list (0.5).
- `js/data/*` — content that becomes the music pack; mystery pack authored here.

## Verification
- **Per step:** `tsc` build (types + emit `dist/`); `node tools/simulate.mjs <N>
  narrative` for feel; `sim --check` and the golden-master `node:test` runner
  (both against `dist/`) for regressions; `lint-content.mjs` for schema.
  Byte-green steps must show a clean golden diff.
- **Phase 0 done when:** a seeded run is reproducible and CI blocks deploy on any
  gate breach.
- **Core done when:** the music pack is fully injected (engine imports no
  content), taxonomy/readers are schema-driven, all four subsystems are plugins,
  and the golden corpus is still green.
- **Mystery done when:** the mystery pack passes its own `--check` gates and is
  playable end-to-end (drive it in the browser via the run flow), with the music
  pack's golden masters still green.

## Deferred / open (parked, not blocking this plan)
- Creative mapping of mystery stats/paths/resources (framing: reality-show
  survival + amateur detective) — a content-design task for Phase 5.
- Exact `tsconfig` strictness ramp (how fast `allowJs` goes off, which strict
  flags land when) — decide at 0.5/1.1. TS-vs-JSDoc is settled: **full `.ts` +
  build**.
