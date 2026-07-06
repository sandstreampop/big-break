# Sprint handoff — remaining work

Companion to [`SPRINT-TECH-DEBT.md`](./SPRINT-TECH-DEBT.md). That doc is the
10-epic plan; each epic there now carries a **Status** block. This doc is the
pick-up sheet for a **new session**: the operational playbook for working in
this repo safely, then every deferred follow-up with enough context to execute
one without re-deriving the ground.

First pass of each epic is on `main`. What's left is either (a) a larger,
byte-fragile chunk deliberately not rushed onto the deploy branch, or (b) a
clean extension of what shipped. Nothing below is blocked; pick any item.

---

## Working in this repo safely (read once)

**The spine.** *Clean generic engine, specific implementations* (`CLAUDE.md`).
`js/engine.ts` names no genre's stats/resources/verbs/flags; a game is a `Pack`;
shared tools import each game's specifics. Three gates now enforce it — don't
regress them.

**Build before you test.** Tools and tests import the **built `dist/`**, not the
`.ts` source. Always `npm run build` after editing `js/**` before running any
gate. (`npm run check` and `npm run test` build first; raw `node --test` /
`node tools/*.mjs` do not.)

**The gates and what they cost locally** (measured):

| gate | command | ~time | notes |
|---|---|---|---|
| build | `npm run build` | 7s | tsc → `dist/` + static copy + version stamp |
| strict typecheck | `npm run typecheck` | 3s | `tsc --noEmit -p tsconfig.strict.json` (core only) |
| engine neutrality | `npm run neutrality` (or `node tools/check-engine-neutrality.mjs`) | <1s | manifest-derived blocklist vs `engine.ts` |
| content lint | `node tools/lint-content.mjs` | <1s | tokens, dup ids, taste, arc refs |
| balance/reach | `node tools/simulate.mjs --check` | 33s | 4000 music runs, 6 gates |
| goldens + invariants + engine units | `node --test test/*.test.mjs` | 2s | 238 tests; DOM-free |
| UI smoke | `node test/ui-smoke.mjs` | **~3 min** | headless Chromium, both games to finale |
| screen contract | `node test/ui-crowding.mjs` | ~1 min | ADR-0009 phone crowding |
| mobile matrix | `node test/ui-mobile-matrix.mjs` | ~2 min | every phone class × legacy CSS × stale-CSS heal |
| docs build | `cd docs-site && npm ci && npm run build` | — | **CI gate**; needs network (TypeDoc + Twoslash) |

`npm run check` runs build + typecheck + neutrality + lint + simulate + all
three browser suites (~12 min end to end). It does **not** run `node --test` —
run that separately. CI (`.github/workflows/pages.yml`) runs both plus the docs
build.

**The browser suites take minutes and a 2-minute foreground `Bash` cap will
kill `ui-smoke` mid-run.** Run them with `run_in_background: true` and poll the
log with an `until grep -q EXIT= …` loop. Chromium/WebKit are pre-installed at
`/opt/pw-browsers` (`PLAYWRIGHT_BROWSERS_PATH`) — never `playwright install`.

**Golden safety.** Seeded behavior is pinned by 72 music traces + a probe + the
LI corpus (`node --test`). Type annotations and comments **erase at emit** → any
purely-typed change is golden-safe; prove it with a zero-diff `node --test`.
A *behavior* change that moves a golden is a bug **unless intended** — then
re-baseline deliberately (`tools/gen-golden.mjs`, `gen-li-golden.mjs`,
`gen-probe-golden.mjs`) and eyeball the one-line-per-run diff. For refactors
meant to be behavior-identical (Epics 2/3 pattern), the goldens ARE your proof.

**The strict frontier.** `tsconfig.strict.json` `include`s only the genre-neutral
core today. Widening it file-by-file is how strictness spreads (see Epic 1
below). The build `tsconfig.json` is **frozen** — never add `strict` there
(it would break the build while the shell still has implicit `any`, and it's
toolchain-pinned for golden-stable emit).

**Delivering to `main`.** Develop on `claude/sprint-tech-debt-polish-h1msk1`.
Commit per logical unit; end messages with the `Co-Authored-By` + `Claude-Session`
footers. To ship: push the branch, then fast-forward main —
`git push origin claude/sprint-tech-debt-polish-h1msk1:main`. `main` deploys via
Pages (gated by the full check + docs build), so **land it green**. `main` can
move under you mid-session (it did several times) — `git fetch origin main` and
rebase the branch onto it before the final push; it's been clean fast-forwards.

**Don't rush byte-fragile work onto `main`.** The reformat/relocation items
flagged "byte-fragile" below can silently shift emit or ordering; do them on the
branch with golden + `ui-smoke` proof before touching main, and never under time
pressure.

---

## Recommended order (quick wins first)

1. **Epic 8 loud-skip + de-flake** — small, safe, high-trust CI wins.
2. **Epic 9 `save.ts` tests + LI balance gate** — additive, `node --test`-verified.
3. **Epic 5 gauntlet `runProps`** — one-site consistency tidy.
4. **Epic 3 `PluginContext` scratch** — typed, contained; then widen the guard.
5. **Epic 1 Wave (b)** — the marquee `RunState` narrowing (larger).
6. **Epic 4 overlay migration + `renderHud` diff** — enables Epic 6's morph.
7. **Epic 6 shared-element morph** — the big feel win (needs #6).
8. **Epic 10 `events2.ts` reformat** — highest QoL, byte-fragile; do carefully.

---

## Remaining work, by epic

### Epic 1 — type-safety Wave (b) *(larger; golden-safe)*
- **Narrow `RunState`**: kill the `[key: string]: any` index signature
  (`js/types.ts`) — the single biggest safety erosion. Move each pack's
  subsystem fields onto `RunState` via **declaration merging in the pack's own
  file** (the pattern `Effect`/`Requires` already use). The hard part: the
  generic engine loops write `state[res] = …` in manifest order
  (`newRun`, `applyEffects`, `evaluateFinale`) — introduce a typed
  `getRes`/`setRes` accessor so those keep compiling. `strictNullChecks` payoff
  then falls out.
- **Widen the strict frontier**: add files to `tsconfig.strict.json` `include`
  one at a time (`js/save.ts`, `js/platform.ts` → packs → `js/ui.ts`), fixing
  each to pass. `ui.ts` is last and largest (it carries the untyped `run`/`meta`
  module state — pairs with Epic 4).
- Verify: `npm run typecheck` clean + `node --test` zero-diff.

### Epic 2 — plugin dispatch *(residual; golden-safe)*
- Type `RollCtx` (`{ applied, tags }`, built in `rollComponents`) and
  `SwipeResult` (the rich object `afterResolve` receives as `result: any`), and
  unify the two context shapes plugins get. Optional: rename the deck hooks
  (`weightDeck`/`refineDeck` → `modifyDeckWeight`/`modifyDeckPool`) for one
  naming convention — comment-only to plugins, golden-safe.

### Epic 3 — purify the core *(two residuals; behavior-sensitive)*
- **Gear lose-on-bad** (`resolveSwipe`, `engine.ts` ~714–722) names
  `state.accessories`/`acc.loseOnBad`/`result.gearLost` — gear concepts in the
  core. Move to the gear plugin's `afterResolve`. It runs *after* the
  `firePlugins('afterResolve')` fire today; to relocate, expose
  `c.appliedAccessories` on `cardCtx` (generic name, e.g. `applied`) so the
  plugin can read the items whose bonus fired, and have the plugin re-check the
  `keepGearOnBad` perk. **Byte-fragile** on ordering — prove with goldens.
- **`PluginContext` scratch fields** (`types.ts` ~190) — `chartTitleHandled`
  (songs), `venueThisCard`/`hostedThisCard` (venue) are music-named on the
  shared type. Replace with `scratch?: Record<string, unknown>`; update
  `songs.ts` (3 sites) + `venue.ts` (4 sites) + the `pctx` init in `engine.ts`.
  Keep `pctx` and `cardCtx` as **separate** scratch objects (the
  `chartTitleHandled` reset in songs' `afterResolve` writes a *different* ctx
  than `applyResource` reads — a vestigial no-op that must stay a no-op).
- Then **widen `check-engine-neutrality.mjs` to `js/types.ts`** (with an
  allowlist for the intentionally-enumerated `Effect` resources) and harden
  `gateValue` so a typo'd gate key can't read as a legit `0`.

### Epic 4 — decompose the shell *(UI; verify with ui-smoke)*
- Migrate the 5 complex overlays to `openOverlay`: `showResult`, `gearChooser`,
  `showBrammies`, `actInterstitial`, `showExitInterview` (they have bespoke
  internal close/`ov.classList.remove('active')` buttons — route those to the
  returned `close()`). Migrating `showResult` also unlocks Epic 6.
- Move hardcoded **music surfaces out of the "genre-agnostic" shell** behind
  presenter hooks: `showBrammies` (fires on `step.act===3 && run.fame>=25`, not
  a hook), the `chart-week` render, the result-notices cascade, `STAT_INFO`,
  `TAGLINES`. A generic `result.deltas.notices` channel already proves the
  pattern.
- Make `renderHud` diff-update instead of `hud.innerHTML=''` + full rebuild on
  every deal; extract a `gateReadout()` builder (gate-row DOM duplicated 3×:
  `renderCrossroads`, `renderFinalSetScreen`, `renderEndingScreen`).
- Split `ui.ts` (2900+ lines) along its comment seams into
  `ui/{overlay,card,hud,screens/*,overlays/*}`.

### Epic 5 — pack-owned telemetry *(one-site tidy)*
- Route the **gauntlet** `run_start` (music-only mode, `ui.ts` ~531) through
  `PRES.runProps(run,'start')` like the normal path, instead of inlining
  `instrument/contract/genre/venue/mastery`. Confirm the gauntlet run carries
  those on `run` state; verify emitted keys unchanged.

### Epic 6 — gorgeous transitions *(the big feel win; needs Epic 4 first)*
- **Shared-element card→result morph**: the flying swiped card should *become*
  the result card. Needs `showResult` on `openOverlay` (Epic 4) + one FLIP/spring
  primitive (the only rAF physics in the file — reuse the flick velocity already
  computed in `attachDrag`, thrown away today).
- **HUD delta-flights**: a delta chip flies from the result into the HUD stat it
  changed, unifying swipe→resolve→HUD.
- **Direction-aware screen transitions** (title→instruments→game), replacing the
  single flat `screenIn` cross-fade.
- All behind the existing `reducedMotion()` guard.

### Epic 7 — accessibility *(UI; verify with ui-smoke)*
- Real `<button>`/`role`/`tabindex`/keydown for the click-`div` interactive
  elements: pick-cards, stat-rail rows, gear chips, stage slots, path cards,
  chart/songbook rows (all click-only today). Copy the risk-dot `aria-label`
  pattern that already exists.
- Wire an **axe-core** pass into the headless-Chromium `ui-smoke` run so a11y
  regressions gate.

### Epic 8 — CI *(small, safe first tasks)*
- **Loud skips**: the three UI suites `process.exit(0)` when no browser is
  present — green while testing nothing. Add a `REQUIRE_BROWSER=1` env flag that
  turns the skip into a hard failure; set it in CI.
- Replace fixed `waitForTimeout(300)` sleeps in the UI drivers with
  `waitForFunction` on real state (the classic flake source).
- Retire the `*.test.mjs` glob convention: move browser suites into `test/ui/`
  with an explicit runner path so the golden glob can't accidentally sweep a
  browser test (or miss a new engine test).
- Add a combined `npm run ci` = `check` + `node --test`.

### Epic 9 — the test suite *(additive; node --test-verified)*
- `test/save.test.mjs` — `js/save.ts` load / schema-migrate / corrupt-input
  (the one subsystem where a silent bug corrupts real player data; untested).
- Music `sharecard` snapshot (LI has `li-share.test.mjs`; music has none).
- `test/li-feeds.test.mjs` — `feeds.ts` (853 lines, newest subsystem, zero unit
  coverage): assert 5 populated channels always, ≥2 posts each, determinism
  (same state+moment → identical bundle), and the honest-instrument invariant.
- **LI balance gate**: give `tools/simulate-pack.mjs` a `--check` mode
  (success band, dead cards) and wire it into CI, so an LI regression blocks the
  deploy like music's does.
- Extract a shared `test/li-harness.mjs` (`fresh`/`apply` are copy-pasted across
  6 `li-*.test.mjs` files) and add a plugin-registration-order invariant.

### Epic 10 — content de-bloat *(the headline; byte-fragile)*
- **Reformat `events2.ts`** (26k → ~9k lines): it's JSON-pretty-printed
  (~90 lines/card) while `events.ts` is compact (~30). Formatting-only, so the
  emitted `dist/` is byte-identical and a **zero-diff `gen-golden.mjs`** proves
  it — but it needs a real formatter/codemod (no Prettier in the toolchain;
  write a careful one and verify). Then lift `ART2`/`NEW_ARCS` out into their own
  modules (imported by `art.ts`/`arcs.ts`), and split `EVENTS2` into
  narrative-family files **re-concatenated in identical order** (order drives the
  seeded draw — the one thing to watch).
- **Music taste layer**: author `docs/games/music/taste.mjs` + `VOICE.md` and
  wire into `lint-content.mjs` (music currently runs with only the bang +
  structural checks). **Calibrate against the existing 34k lines** — a strict
  cliché checker will flag real content and turn the green lint red until tuned;
  introduce rules incrementally, each verified `LINT CLEAN`.
- **Shared `cardFamily(ev)`**: collapse the three hand-maintained card
  classifiers (`clarity.ts` `CEREMONY_IDS`/`liveRoles`, the 435-line
  `villaSetPiece` id-ladder, `feeds.ts` `familyOfCard`) into one table; turn
  `villaSetPiece` into a data lookup. Split `feeds.ts`'s ~470 lines of corpus
  into `feeds-content.ts` and extract a testable `feeds-core`.
- Extract a shared `renderRng`/`renderPick` presenter util (the "pure render,
  seeded variety" idiom is reinvented 3× in LI and used by music's
  headlines/dms/epilogue) — unify the *interface*, let each site keep its seed
  formula, to stay golden-safe.
- Converge `tools/sim-core.mjs` onto `tools/pack-core.mjs` (~80% duplicated run
  loop; fold music's extras into pack-injected policy hooks).

---

## Loose ends (opportunistic, inside a nearby pass)

- `softCap`'s magic `0.5` lives outside `CONFIG` (`engine.ts`) — move it in. (→2)
- `advance()` has no return type; its doc-comment union already omits the
  `{kind:'tutorialEnd'}` it returns. Add a discriminated-union return. (→1/2)
- `stateRng` replays the whole RNG history on a cold cache-miss — add a comment
  / assert when a non-legacy run plays seedless (`seed:null` → silent
  `Math.random`). (→1/9)
- Dead import `islanderTypeById` in `feeds.ts`; the `note` helper is copy-pasted
  into 5 LI plugins — hoist onto `pctx`. (→10)
- Stale docs: `ROADMAP.md` lists the R10 rename as open though `bond →
  "Connection"` shipped; `IMPLEMENTATION-PLAN.md` needs a "superseded by
  ROADMAP" banner.
