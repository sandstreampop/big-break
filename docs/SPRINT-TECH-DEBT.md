# Tech-debt & polish sprint — 10 epics

*A two-week, no-feature-work sprint. Staff-engineer's pick of the work worth
doing when the roadmap goes quiet: sharpen the engine API, pay down the debt
we deferred, make the harness fast and honest, and finally make the games
**feel** as good as they read. Drawn from a full codebase + design review
(July 2026).*

---

## How this was drawn up

A fan-out review of every major surface — engine core, the typed pack
boundary, the UI shell, both games' packs, the content decks, the test
harness, and CI — plus the live telemetry summary and the Love Island design
record (ADRs 0001–0014, the V4 docs). Every finding below is cited to
`file:line` against the tree at the time of writing. Nothing here is on fire:
this is a genuinely mature, unusually well-documented codebase. The debt is
concentrated, refactor-shaped, and — because of the golden-master safety net —
**auditable rather than scary**.

### The spine these epics defend

The repo has one governing idea, stated in `CLAUDE.md` and enforced almost
everywhere:

> **Clean generic engine, specific implementations.** `engine.ts` names no
> genre's stats, resources, effect verbs, or perk ids. A game is a `Pack`.
> Shared tools stay genre-neutral and *import* each game's specifics.

`engine.ts`, `types.ts`, `lint-content.mjs`, `taste-core.mjs`, `pack-core.mjs`
and the Presenter hook surface all honour it rigorously. But the review found
the seams where the principle **leaks** — a hardcoded `'comeback'` bonus in the
core, gear rules baked into resolution, music's telemetry schema wired into the
"genre-agnostic" shell — and those leaks are the throughline of Epics 3, 4 and
5. A recurring theme of this sprint is: *make the codebase's own best idea true
everywhere, and self-enforcing so the next leak fails CI.*

### Reading the estimates

Effort is **S** (≤1 day), **M** (2–4 days), **L** (most of a week). Risk is
judged against the golden masters: a **golden-safe** change proves itself with
a zero-diff `node --test`; a **re-baseline** change deliberately moves seeded
output and needs a reviewed regeneration.

### Suggested sequencing

```
Week 1   ┌─ Epic 1  type-safety foundation ─┐      ┌─ Epic 8  faster CI ─┐
         │  (de-risks 2, 4, 5)              │      │  (unblocks fast loop)│
         └──────────────┬──────────────────┘      └─────────┬───────────┘
                        ▼                                    ▼
Week 1–2  Epic 2 plugin dispatch     Epic 3 purify core     Epic 9 test suite
                        │                    │                    │
Week 2    Epic 4 neutral shell ──▶ Epic 5 pack-owned telemetry
                        │
                        ├──▶ Epic 6 gorgeous transitions
                        └──▶ Epic 7 accessibility
          Epic 10 content de-bloat (independent; golden-safe; any time)
```

Epics 1, 8 and 10 are the safest starts (high leverage, low coupling). Epic 4
(decompose the shell) unlocks 5, 6 and 7, which all touch the same file.

---

## Epic 1 — The type-safety foundation

**Theme:** engine API · **Effort:** M→L · **Risk:** golden-safe (pure types)

The `tsconfig.json` runs with **no `strict`, no `noImplicitAny`, no
`strictNullChecks`** (`tsconfig.json:13-29`). The blast radius:

- **~75 implicit-`any` params across ~44 functions in `engine.ts`.** Almost
  every function takes `state` untyped even though `RunState` is imported
  (`engine.ts:5`). The worst offender is the most important function:
  `applyEffects(state, effects, ev, choice, rng, tier?, …)` (`engine.ts:733`)
  has six implicit-any params.
- **`RunState`'s `[key: string]: any` index signature (`types.ts:588`) is the
  single biggest erosion.** It sits on the hottest object in the codebase and
  launders every subsystem field (`state.fame`, `state.songs`, `state.bond`,
  `state.public`, …) through `any`, turning typos into silent `any` reads.
- This is **inconsistent with the codebase's own best idea**: `Effect`
  (`types.ts:53`) and `Requires` (`types.ts:76`) are *open via
  declaration-merging* and carry **no** index signature precisely so a
  hallucinated key is a compile error. `RunState` should follow the same
  pattern and doesn't.

**The work.** Ship in two waves. (a) A `noImplicitAny` pass — annotate the
engine params (`state: RunState`, `ev: GameEvent`, `choice: Choice`), a clean
mechanical win worth landing first and independently. (b) Narrow `RunState`
onto the declaration-merging pattern its siblings already use: each pack
augments `RunState` with its own fields in its own file, and the index
signature goes away. The honest hard part is the generic engine loops that do
`state[res] = …` in manifest order (`newRun:156`, `applyEffects:791`) — they
need a typed resource accessor (`getRes`/`setRes`) rather than raw index
writes. `strictNullChecks` then falls out almost for free (the code is already
littered with defensive `?? 0` / `|| []`).

**Why it's satisfying.** It turns a 973-line untyped core into something the
compiler defends, and it makes the marquee architectural claim — "a typo'd key
is a compile error" — *true for the run state too*, not just the authored
content. It de-risks Epics 2, 4 and 5.

**Status — landed (this sprint).** The genre-neutral core (`js/engine.ts` +
`js/types.ts` + `js/config.ts`) now passes **full `strict`** (incl.
`noImplicitAny` + `strictNullChecks`). Rather than flip the frozen build
tsconfig — which would break `npm run build`/the deploy while the shell still
carries implicit `any`, and risks shifting the golden-policed emit — strictness
runs as its own `noEmit` gate: `tsconfig.strict.json` extends the build config,
turns on `strict`, and `include`s only the core. `npm run typecheck` runs it;
it's wired into `npm run check` and is a CI gate in `pages.yml`. All ~105
core errors are fixed (annotated params, a typed resource-lookup at three
`CONFIG` sites, and the null-safety at the finale/climax paths). Emit is
**code-identical** (only added comments differ; `config.js` byte-identical),
proven by a diff against the pre-change build and 228/228 goldens green — so
this closed **Wave (a)** and most of the `strictNullChecks` payoff *without*
needing the risky `RunState` index-signature narrowing. That narrowing (Wave
(b)) remains the follow-up: the `tsconfig.strict.json` `include` glob is the
migration frontier — widen it file-by-file (`save.ts`, `platform.ts`, then the
packs, then `ui.ts`) as each module is brought up to strict.

---

## Epic 2 — Typed, combinator-based plugin dispatch

**Theme:** engine API · **Effort:** M · **Risk:** golden-safe (pure refactor)

The engine folds each plugin's contribution to a core mechanic through **nine
hand-rolled loops that are the same loop**: `sumRollBonus` (`engine.ts:418`),
`foldJitter` (`:424`), `gainBags` (`:430`), `encoreDisabled` (`:436`),
`foldBurnout` (`:442`), `foldDeckWeight` (`:447`), `foldDeckPool` (`:452`),
`scoreMult` (`:458`), `foldActLength` (`:464`). Each is
`for (const p of orderedPlugins()) …` with a different reducer. Alongside this:

- Two different untyped context shapes. `modifyEffects`/`onEffect`/
  `applyResource` get the typed `PluginContext`, but `modifyRoll`/
  `modifyJitter`/`modifyBurnout`/`refineDeck` get `ctx: any` (`types.ts:244-271`)
  — a *different* object (`rollCtx = { applied, tags }`, `engine.ts:515`).
- `afterResolve(result: any)` (`types.ts:228`) hands plugins the richest object
  in the engine (tier, roll, deltas, `encoreEarned`, `promisesKept`,
  `gearLost`…) fully untyped.
- `gainHooks` returns a stringly-typed bag `{ statGainMult?, burnoutGainMult?,
  burnoutHealMult? }` the engine reads on faith (`engine.ts:750-766`), never
  declared as a type.
- Five naming conventions for one hook family (`modifyRoll` vs `weightDeck` vs
  `scoreMult` vs `blocksEncore` vs `applyResource`).

**The work.** Replace the nine loops with five typed combinators —
`sum(hook)`, `product(hook)`, `foldChain(hook, seed)`, `some(hook)`,
`collect(hook)` — over a `PluginHooks` map (~50 lines → ~15). Introduce real
`RollCtx`, `SwipeResult`, and `GainBag` types and unify the two context shapes.
Optionally rename the deck hooks for consistency (golden-safe; comment-only to
plugins).

**Why it's satisfying.** Highest ratio of *lines-deleted + safety-gained* in
the repo. "How does the engine combine plugin X?" becomes answerable in one
place, and typing the combinators forces the payloads to be typed as a side
effect.

---

## Epic 3 — Purify the engine core + a genre-neutrality guard

**Theme:** the spine · **Effort:** M · **Risk:** golden-safe if moves preserve draw order

`CLAUDE.md` says the engine "names no genre's stats, resources, effect verbs,
or perk ids." Three real leaks survive:

- **`'comeback'` is hardcoded in the core.** `legacyPoints` does
  `if (state.flags.includes('comeback')) mult *= 1.2` (`engine.ts:946`). Only
  the *music* pack sets this flag (`music.ts`). A second pack using `'comeback'`
  for anything else gets a surprise ×1.2. Move it to a pack `scoreMult` plugin
  or a manifest knob.
- **Gear lose-on-bad is hardwired in resolution.** `resolveSwipe`
  (`engine.ts:686-695`) directly names `state.accessories`, `acc.loseOnBad`,
  `acc.id`, `result.gearLost` — all gear-subsystem concepts. It's only safe
  because `appliedAccessories` is empty when no gear plugin runs, i.e. **safe by
  accident, not design.** It belongs in the gear plugin's `afterResolve`.
- **`PluginContext` carries music-specific fields in the *shared* type.**
  `chartTitleHandled` (songs), `venueThisCard`/`hostedThisCard` (venue) with
  comments literally reading `// songs:` / `// venue:` (`types.ts:190-192`). A
  third pack would grow the shared type. Replace with an opaque
  `scratch: Record<string, unknown>`.

There's also a latent correctness smell to fix while here: `gateValue` can't
distinguish "legitimately 0" from "typo/unset" (`engine.ts:92-94`), so a
mistyped `winGates`/`failStates` key reads 0 — passing the "resolves via
gateValue" invariant while silently making a gate unreachable.

**The work.** Relocate the three leaks behind existing plugin hooks; harden
`gateValue`/its invariant to catch unowned keys. Then add the piece that makes
it stick: **a CI guard that greps `engine.ts` + the shared types for
genre-specific identifiers** (a small allowlist-based lint), so the next leak
fails CI instead of surviving to review.

**Why it's satisfying.** It makes the repo's central thesis *self-defending*.
The architecture stops relying on discipline and starts relying on a gate.

**Status — first pass landed.** The enforcing centerpiece shipped:
`tools/check-engine-neutrality.mjs` derives its blocklist from every registered
pack's manifest (stats + resources) and plugins (effect verbs + requires keys)
— 101 tokens across the two packs today — and fails if any appears in
`js/engine.ts` logic (comments stripped; `PACK.<capability>` dispatches exempt,
since feature-detecting an optional pack hook is the architecture, not a leak).
It's self-maintaining: a third genre is policed the moment it's registered.
Wired into `npm run check` + `npm run neutrality` and a CI gate in `pages.yml`.
The `'comeback'` ×1.2 scoring leak (`engine.legacyPoints`) is moved into the
music `economyPlugin`'s `scoreMult` — mathematically identical (the engine
already folds every plugin `scoreMult` into the score product), verified by
228/228 goldens + the balance gate unchanged. **Residual (follow-up):** two
leaks remain — the gear lose-on-bad block in `resolveSwipe` (names
`state.accessories`/`gearLost`) and the music scratch fields in the shared
`PluginContext` (`chartTitleHandled`/`venueThisCard`/`hostedThisCard`). Both are
byte-fragile to relocate (the lose-on-bad ordering and the two-ctx
`chartTitleHandled` handshake), so they're deferred rather than rushed; neither
is a manifest token, so the guard is clean today. Widening the guard to `types.ts`
and closing these two is the remainder of the epic.

---

## Epic 4 — Decompose the UI shell into a genre-neutral kit

**Theme:** code cleanup · **Effort:** L · **Risk:** golden-safe (UI-only; UI-smoke gates it)

`js/ui.ts` is a **2923-line monolith**: ~40 free functions mutating file-scope
`let`s (`activePack, PATHS, PRES, meta, run` at `31-40`), one export (`boot`).
Two structural problems compound:

- **11 near-identical overlay open/close blocks.** Every modal repeats
  `ov.innerHTML=''; ov.classList.add('active'); … done = () => {…}; setTimeout(
  () => ov.addEventListener('click', done), 200|250|300)` (`showInspect:1210`,
  `showStatusDrawer:1229`, `showHelp:1288`, `showChart:1335`, `showResult:1700`,
  `showBrammies:1884`, `actInterstitial:2065`, `showScrapbook:2636`, …). One
  `openOverlay(build, opts)` helper deletes ~150 lines and fixes a latent
  stale-listener bug (a second `done` can attach during the 200ms arm window).
- **Music-specific code living in the "genre-agnostic" shell** — a direct spine
  violation. `showBrammies` (`ui.ts:1843-1916`, ~75 lines of hardcoded
  rivalry/genre/fame copy) fires from a hardcoded `step.act === 3 && run.fame >=
  25` (`:1771`) — *not* a pack hook. The result-notices cascade (`:1600-1644`)
  hardcodes `songDebuts/albumOut/venueLeveled/bandmate/hustle`; `renderFinalSet`
  (`:1965-2012`) hardcodes song/vault/debt closers; the `chart-week` render
  (`:2110-2144`) is a music-only if/else. A generic `result.deltas.notices`
  channel already exists (`:1599`) proving the pattern.

**The work.** Extract the `openOverlay` engine and a shared `gateReadout()`
builder (the gate-row DOM is duplicated 3× at `renderCrossroads:2224`,
`renderFinalSetScreen:2026`, `renderEndingScreen:2523`); split `ui.ts` along its
already-comment-delimited seams into `ui/{overlay,card,hud,screens/*,
overlays/*}`; move every hardcoded music surface behind Presenter hooks; and —
touching every access site anyway — give `run`/`meta` real types (kills the
file-wide implicit `any`, pairs with Epic 1). While in `renderHud`, make it
diff-update instead of throwing away and rebuilding the entire HUD + gear row +
stage on **every single card deal** (`dealCard:808` → `renderHud:548`).

**Why it's satisfying.** It enforces the repo's own stated spine on its largest
file, turns "adding a third pack" into genuinely *new files only*, and is the
prerequisite that unlocks Epics 5, 6 and 7.

**Status — overlay engine landed.** The centerpiece `openOverlay(build, {armMs,
onClose})` helper shipped (near `show()`), and the five overlays that share the
exact simple pattern — `showInspect`, `showStatusDrawer`, `showHelp`,
`showScrapbook`, `showSetPieceBeat` — now use it, deleting their duplicated
clear/activate/`done`/`setTimeout` boilerplate. The helper also fixes the
latent stale-listener bug (a prior overlay's click handler left armed on the
shared node is now torn down on open; `close()` is idempotent). Verified by
`ui-smoke` (both games to finale, no page errors). **Follow-up:** the five
overlays with bespoke internal close logic (`showResult`, `gearChooser`,
`showBrammies`, `actInterstitial`, `showExitInterview`) and the file split into
`ui/{overlay,card,hud,screens}` remain — plus the `renderHud` full-rebuild-per-
deal and moving the hardcoded music surfaces behind presenter hooks (Brammies,
chart-week, notices cascade), which dovetails with Epic 5.

---

## Epic 5 — Pack-owned telemetry

**Theme:** the spine · **Effort:** M · **Risk:** golden-safe (telemetry-only)

*Flagged independently in review as the clearest remaining spine violation.*

The whole repo is "clean generic engine, specific implementations" — packs
carry their own content, their own taste rules, their own coverage catalogs.
**Telemetry is the one place that ignores it.** The shared shell's
`track('run_start', …)` bakes music's entire taxonomy straight in:

```
ui.ts:354   track('run_start', {
              instrument: inst.id, contract: chosenContract || 'none',
              genre: chosenGenre || 'none', venue: chosenVenue || 'none',
              mode: …, mastery: lv, career_runs: meta.runs || 0,
            });
```

The same coupling recurs in `run_end` (`ui.ts:2392,2413` — hardcodes `fame`,
`hits`, `instrument`) and the gauntlet start (`ui.ts:531`). The consequence is
concrete and visible in `telemetry/summary.md`: a **Love Island** run emits
`genre:'none'`, `venue:'none'` noise and `fame:undefined` / `hits:undefined`
(those resources don't exist for it), while capturing **none** of its own
concepts — partner shape, cast, faction standing, Casa outcome. `analytics.ts`
itself is already correctly genre-neutral (it just tags every event with
`pack`, `analytics.ts:118`); the leak is entirely in the shell's *call sites*.

**The work.** Add a Presenter telemetry hook — `PRES.runProps?(state, moment)`
— exactly like the shell already does for `hudCounters`, `feeds`, `shareText`.
The shell owns only the **neutral spine** of each event (name, `mode`, `cards`,
`outcome`, `path`, `tier`, `act`, `burnout` — all engine concepts); the pack
contributes its own props. Music returns `{instrument, contract, genre, venue,
mastery}`; Love Island returns `{shape, cast, faction, casa}`. Update the
telemetry docs (`docs/telemetry.md`) and the HogQL insights so both games'
streams are legible.

**Why it's satisfying.** It closes the *last* place the architecture's own
principle is silently broken, and it immediately makes Love Island's playtest
data actually measure Love Island — turning a stream of `none`s into signal.

**Status — landed.** `Presenter.runProps(state, moment)` shipped. The shell's
`run_start`/`run_end` now emit only the genre-neutral spine (mode, outcome,
path, cause, cards, burnout, lp, career_runs, last_card) plus the pack's
`summarize` fields (already generic) plus `...PRES.runProps`. Music's presenter
returns its exact former keys (`instrument/contract/genre/venue/mastery` at
start; `instrument/fame/hits/chart_peak/gear` at end) so every existing PostHog
insight keeps working — verified key-by-key for parity, with 228 goldens and
`ui-smoke` green. Love Island now reports `persona/gender/followers/public_vote`
+ its own `summarize` taxonomy instead of music's `genre:'none'`/`fame:undefined`
noise. `docs/telemetry.md` updated to the neutral-spine + pack-props schema.
**Follow-up:** the gauntlet `run_start` (music-only mode) still inlines its
props; routing it through the hook is a small consistency tidy.

---

## Epic 6 — Gorgeous transitions & choreography

**Theme:** make it beautiful · **Effort:** M · **Risk:** golden-safe (UI-only)

The feel toolkit is already rich (confetti, shake, foil frame, heat vignette,
crown pulse, deal-in) and `prefers-reduced-motion` is handled conscientiously
everywhere (`ui.ts:72`, `@media` blocks throughout). What's missing is
**choreography** — the beats are disconnected:

- **No shared-element transition between card and result — the flagship win.**
  On commit the card flies off screen (`finishSwipe:1191`, inline translateX
  ±110vw + rotate 24°, 240ms), then the result overlay *independently* rises
  from +26px (`@keyframes rise`, `style.css:593`). The two moments never touch.
  A shared-element morph — the flying card *becoming* the result card — is the
  single highest-impact change on game feel.
- **Staggered reveal is CSS-`nth-child`-capped and mostly dead.** Chips stagger
  only to `:nth-child(5)`, notices to `:nth-child(3)` (`style.css:749-760`), but
  result screens routinely render more than that, so most items animate at
  delay 0. Drive `animationDelay` from JS at spawn time for a real, unbounded
  cascade.
- **Deltas aren't tied to the loop.** The result chip, the HUD stat bar
  (`width .5s`, `style.css:299`), and the floater (`spawnStatFloaters:747`) all
  move separately. A delta chip that **flies from the result into the HUD stat
  it changed** unifies swipe → resolve → HUD.
- **Screen transitions are a flat cross-fade** (`show:79`, one `screenIn`
  keyframe for every screen), and swipe release relies on a plain CSS
  `transition` (`style.css:395`) instead of a velocity-carried spring — the
  flick velocity is already computed at `attachDrag:1096` and thrown away.

**The work.** Build one small transition primitive — a FLIP/spring helper (the
only rAF physics in the codebase) — and use it four ways: card→result morph,
JS-driven unbounded stagger, HUD delta flights, and a real spring on
release-snap. Direction-aware screen transitions are a stretch goal. Everything
stays behind the existing `reducedMotion()` guard.

**Why it's satisfying.** This is the "SUPER PRETTY" epic. The foundation
(reduced-motion discipline, easing vocabulary, existing juice) is already
strong, so the polish lands cleanly and the game *feels* like a different tier.

**Status — first polish landed.** Two safe, behaviorally-inert wins shipped:
(1) the result reveal now uses an **unbounded** staggered cascade — the CSS
`--ri` custom property drives `animation-delay`, set per element from JS in
`showResult`, replacing the dead `nth-child(3/5)` ladder that silently stopped
the stagger after a few rows; (2) a **springier card snap-back** — the release
transition gains a touch more overshoot and time (`cubic-bezier(.34,1.45,.45,1)`
over `.34s`). `ui-smoke` green on both games. **Follow-up:** the flagship
shared-element card→result morph, the HUD delta-flights, and direction-aware
screen transitions remain the big-ticket items (they need the `showResult`
overlay migrated to `openOverlay` and a FLIP/spring primitive).

---

## Epic 7 — Accessibility pass

**Theme:** code cleanup / reach · **Effort:** M · **Risk:** golden-safe

The shell is tap-first and locks out keyboard/AT users:

- **Interactive non-buttons everywhere.** Pick-cards (`div`, `ui.ts:461`), stat
  rail items (`:624`), gear chips (`span`, `:643`), stage slots (`:803`), path
  cards (`:2054,2237`), chart/songbook rows (`:1349,1377`) are click-only
  `div`/`span` with no `role`, `tabindex`, or key handling.
- **No overlay focus management** across the 11 modals: focus is never moved in,
  trapped, or restored; no `role="dialog"`/`aria-modal`; **Escape doesn't
  close** (the keydown handler at `:133` only reads arrows, and only when no
  overlay is active).
- **No `aria-live` for outcomes** — result tier, deltas and notices
  (`showResult:1523`) are never announced. (Risk dots *do* carry `aria-label` at
  `:1048` — the good exception to copy.)

**The work.** Real `<button>`s/roles for the click-`div`s; focus trap + restore
+ Escape via the new `openOverlay` helper from Epic 4; an `aria-live` region for
swipe outcomes. Add an axe-core pass to the existing headless-Chromium UI-smoke
run so a11y regressions gate like everything else.

**Why it's satisfying.** It pairs naturally with Epic 4's overlay work (one
place to fix focus), and it widens who can actually play a phone-first game.

**Status — overlay a11y + result announce landed.** `openOverlay` (Epic 4) now
sets `role="dialog"` + `aria-modal`, moves focus into the modal, closes on
**Escape**, and restores focus to whatever opened it — so all five migrated
overlays are keyboard-dismissable and screen-reader-announced in one place. The
result card gains `role="status"`, making the swipe outcome (tier + text +
deltas) a polite live region instead of silent. `ui-smoke` green.
**Follow-up:** real `<button>`/`role`/`tabindex` + key handlers for the
click-`div` interactive elements (pick-cards, stat rows, path cards, chart
rows), and an axe-core pass wired into the smoke run.

---

## Epic 8 — Faster, sturdier CI

**Theme:** CI performance + stability · **Effort:** M · **Risk:** low

Measured locally: `npm run build` ≈ 7s, the full DOM-free suite (228 tests) ≈
1.6s, `simulate.mjs --check` (4000 runs) ≈ 33s. The suites are cheap; **CI cost
is dominated by uncached installs and redundant rebuilds.**

- **The engine `tsc` build runs 4× per push, docs build 2×**, across four
  workflows (`pages.yml` check + deploy, `android.yml`, `ios.yml`). **No
  dependency caching anywhere** — every `setup-node` (`pages.yml:45`,
  `android.yml:34`, `ios.yml:35`, `posthog-pull.yml:33`) omits `cache: 'npm'`.
- **No Playwright browser cache** — `npx playwright install --with-deps`
  (`pages.yml:66`, `android.yml:40`, `ios.yml:47`) re-downloads from scratch 3×
  per push; the single largest wall-clock item.
- **`deploy` fully re-does `check`'s build** (`pages.yml:97-113`) — a
  byte-identical rebuild of what its `needs:` dependency just produced. Hand it
  off as an artifact instead.
- **Silent-skip traps.** `ui-smoke.mjs`, `ui-crowding.mjs`, `ui-mobile-matrix
  .mjs` all `process.exit(0)` when no browser is present — CI installs one so it
  gates *there*, but `npm run check` on any browserless dev/agent box **passes
  green while testing nothing** (the code comments admit it).
- **Fixed-sleep browser drivers** (`waitForTimeout(300)` for overlay-listener
  arming, throughout the three UI suites) are the classic CI flake source.
- The `node --test test/*.test.mjs` glob (`pages.yml:56`, `package.json:12`)
  works only because browser suites are named `*.mjs` not `*.test.mjs` — load-
  bearing tribal knowledge with no enforcement. No `timeout-minutes` on any job.

**The work.** Add `cache: 'npm'` to all four `setup-node` steps; cache
`~/.cache/ms-playwright` keyed on the Playwright version; make `deploy` consume
`check`'s `dist/` + `docs-site/dist/` via `upload/download-artifact`; add
`timeout-minutes`. Turn the browserless skip into a hard fail under a
`REQUIRE_BROWSER=1` CI flag; replace fixed sleeps with `waitForFunction` on real
state; move browser suites into `test/ui/` with an explicit runner path,
retiring the naming-convention hack; add a combined `npm run ci` that runs both
`check` and `node --test`.

**Why it's satisfying.** The highest wall-clock ROI in the repo (several
minutes per push) for almost no risk, and it closes the "green while testing
nothing" footgun that undermines trust in the gate.

**Status — caching landed.** `cache: 'npm'` added to every `setup-node`
(pages check, android, ios, posthog-pull), a Playwright-browser cache
(`~/.cache/ms-playwright`, keyed on the lockfile) added before each browser
install (chromium in pages + android, webkit in ios), and `timeout-minutes`
added to the check/android/ios jobs. (The redundant deploy rebuild was already
removed upstream — `check` now produces the Pages artifact and `deploy` only
publishes it.) All five workflow files re-validated as parseable YAML.
**Follow-up:** the loud-skip `REQUIRE_BROWSER` flag, replacing fixed
`waitForTimeout` sleeps with `waitForFunction`, and retiring the `*.test.mjs`
glob convention remain.

---

## Epic 9 — The test suite we never wrote

**Theme:** finally write the tests · **Effort:** L · **Risk:** additive

The engine's **flagship game has only black-box coverage.** `engine.ts` (973
lines, ~28 exported functions) is exercised entirely through golden masters
(which pin *that behavior didn't change*, never *that it's correct*) and generic
invariants. **Zero `*.test.mjs` imports `musicPack` for a unit assertion.** The
gaps:

- **No direct unit tests for the resolution math.** `rollComponents`/
  `choiceOdds` (the good/bad/incredible probability engine), `resolveSwipe` tier
  + delta application, `evaluateFinale` gate + momentum-clutch logic
  (`engine.ts:898`), `checkFailStates`, `gateValue`, and the `requiresOk`
  predicate matrix are asserted nowhere directly.
- **`js/save.ts` is untested** — the one subsystem where a silent bug corrupts
  real player data (localStorage schema migration). Highest-value gap.
- **No `test/li-feeds.test.mjs`** — the largest, newest Love Island subsystem
  (`feeds.ts`, 853 lines) has zero unit coverage. Its guarantees are testable:
  five populated channels always, ≥2 posts each (`buildChannel:754`),
  determinism (same state+moment → identical bundle), and the honest-instrument
  invariant (a lost wing sours even a triumph).
- **No Love Island balance gate.** `simulate.mjs --check` has hard thresholds
  for music only; the generic `simulate-pack.mjs` has no `--check` mode, so an
  LI success-band or dead-card regression wouldn't block a deploy.
- **Duplicated harness.** The `fresh(seed)` bootstrap is copy-pasted in 6
  `li-*.test.mjs` files, the `apply` wrapper in 5 — a shared `test/li-harness.mjs`
  deletes ~11 helper blocks.
- Music's `sharecard.ts` has no snapshot test (LI's does, `li-share.test.mjs`);
  load-bearing plugin registration order (`music.ts:107`, `pack.ts:132`) is
  commented, not asserted.

**The work.** Stand up `test/engine.test.mjs` asserting the *arithmetic* (not
just no-drift); a real `test/save.test.mjs` (load / migrate / corrupt-input);
`test/li-feeds.test.mjs` for the feed guarantees; a `simulate-pack.mjs --check`
mode wired into CI so Love Island gets a balance gate; the shared
`test/li-harness.mjs`; a music `sharecard` snapshot; and invariants that assert
plugin registration order per pack.

**Why it's satisfying.** It converts the goldens from "something changed" into
"and here's *why* the new value is correct," and closes the unnerving gap where
the flagship game's resolution engine is verified only by proxy.

**Status — engine unit suite landed.** New `test/engine.test.mjs` (10 tests,
swept into `node --test test/*.test.mjs` and the CI golden step) asserts the
core *arithmetic* against the music pack: `mulberry32` determinism + range,
`gateValue` stat/resource/unknown resolution, `applyEffects` clamp + reporting,
`choiceOdds` as a valid distribution *and* monotone in the governing stat,
`evaluateFinale` gate success/failure **and** the momentum-clutch (isolated so
only momentum differs), `legacyPoints` finiteness + the comeback ×1.2 (guarding
the Epic 3 move), `checkFailStates` burnout, and `incredibleTargets` coverage.
Expectations derive from the manifest, so they survive balance tuning and only
break if a mechanic does — 238/238 green. **Follow-up:** `save.ts` load/migrate
tests, a music `sharecard` snapshot, `test/li-feeds.test.mjs`, a
`simulate-pack.mjs --check` balance gate for Love Island, and the shared
`test/li-harness.mjs` extraction.

---

## Epic 10 — De-bloat & unify the content layer

**Theme:** code cleanup + tooling · **Effort:** M (per workstream) · **Risk:** golden-safe if order preserved

The content layer is where humans and agents spend the most edit time, and it
carries the most avoidable friction. Independent, mostly golden-safe
workstreams:

- **Reformat + split `events2.ts` (26,211 lines).** The music deck's second
  file is bloated *by format, not content*: it's fully JSON-pretty-printed
  (~90 lines/card, `events2.ts:11-98`) while its sibling `events.ts` uses the
  compact idiom (~30 lines/card, `events.ts:16-43`) at the same content density.
  The `GENERATED:` header is stale — no generator exists; it's hand-edited. A
  formatting-only codemod drops it from ~26k to ~9k lines with a
  **byte-identical `dist/`** (verifiable by a zero-diff `gen-golden.mjs`). Then
  lift the smuggled `ART2`/`NEW_ARCS` registries into their own modules
  (`art.ts:8`, `arcs.ts:91` import them from the events file), and split
  `EVENTS2` into narrative-family files re-concatenated *in identical order* —
  mirroring Love Island's layout. The one invariant to watch: pool draw order
  (`engine.ts:372`) means order must be preserved exactly.
- **Add a duplicate-id guard.** The two decks use divergent id namespaces
  (`a1_`/`a2_` vs `n1_`/`nm_`/`np_`) with **no uniqueness check** — a collision
  would silently double a card's deck weight. A 5-line guard over the merged
  ids belongs in `lint-content.mjs`.
- **Give music a taste layer.** The full craft floor (cliché blocklist,
  show-don't-tell tells, outcome-length cap, dialogue floor) exists and is
  proven on Love Island (`taste.mjs`), but the *older, 4×-larger, more
  cliché-prone* music corpus runs almost naked — only the bang + structural
  checks (`lint-content.mjs:95` wires LI only). Author `docs/games/music/
  taste.mjs` + a `VOICE.md` and wire it in.
- **Love Island's shared-tool debt.** Three files independently pattern-match
  the same card families (`clarity.ts` `CEREMONY_IDS`/`liveRoles`, the 435-line
  `villaSetPiece` id-ladder at `:491`, and `feeds.ts` `familyOfCard` at `:145`)
  — collapse into one `cardFamily(ev)` table so stage/result-beat/set-piece/
  feeds can't silently disagree. Split `feeds.ts`'s ~470 lines of inlined corpus
  into `feeds-content.ts`. Extract the "pure render, seeded variety" idiom —
  reinvented three ways in LI *and* used by music's `headlines`/`dms`/`epilogue`
  — into a shared, testable `renderRng`/`renderPick` presenter util (unify the
  *interface*, let each site keep its seed formula, to stay golden-safe).
- **Finish the sim-driver split.** `sim-core.mjs` and `pack-core.mjs` are ~80%
  the same run loop; `sim-core` exists only for music's extra whims (packs,
  comeback, nemesis, minigame echoes). Fold those into pack-injected policy
  hooks so the neutral `pack-core` runs music too — completing the
  generic/specific pattern for the *tooling*, not just the engine.

**Why it's satisfying.** The `events2.ts` reformat alone is the biggest
quality-of-life win in the repo for both humans and agents (edit latency,
context cost, merge-conflict surface), and it's the rare high-value / low-risk
item — the golden master makes the whole thing *auditable in one command*. The
rest completes patterns the codebase already believes in.

**Status — duplicate-id guard landed.** `lint-content.mjs` now fails on any
repeated event id within a pack — the deck draws in declaration order
subtracting weights, so a dup silently doubles a card's presence and weight, a
bug the per-pack goldens are blind to and the one invariant a two-file,
two-namespace deck (music's `a1_`/`n1_`/`nm_`/`np_`) most needed. Music passes
clean today (711 events, 0 dups); the guard logic was verified to fire on a
synthetic dup. **Follow-up (the headline):** the `events2.ts` JSON-pretty →
compact reformat (~26k → ~9k lines, byte-identical `dist/`, verifiable by a
zero-diff `gen-golden.mjs`) needs a real formatter/codemod and is too large to
guarantee byte-safe in a single pass; likewise a *calibrated* music
`taste.mjs`/`VOICE.md` (a strict cliché checker over 34k unaudited lines would
turn the green lint red until tuned), the shared `cardFamily`/`feeds-core`
refactors, and the `sim-core`→`pack-core` convergence.

---

## Appendix — findings that didn't make the cut

Small, worth doing opportunistically inside a nearby epic:

- `softCap`'s magic `0.5` lives outside `CONFIG` (`engine.ts:543`) while every
  sibling knob is centralized. (→ Epic 2)
- `advance()` has no return type — a stale doc-comment union that already omits
  the `{kind:'tutorialEnd'}` it returns (`engine.ts:808,823`). (→ Epic 1/2)
- `stateRng` replays the whole RNG history on a cold cache-miss
  (`engine.ts:72`) — bounded and correct, but worth a comment. (→ Epic 1)
- Dead import `islanderTypeById` in `feeds.ts:26`; the `note` helper is
  copy-pasted verbatim into 5 LI plugins. (→ Epic 10)
- Stale docs: `ROADMAP.md:22` lists the R10 rename as open though the
  `bond → "Connection"` display rename shipped; `IMPLEMENTATION-PLAN.md` is a
  superseded stratum with no "superseded by ROADMAP" banner.
- `run_start`/`swipe` seedless-run trap: `newRun` defaults `seed:null` and
  `stateRng` silently falls back to `Math.random` (`engine.ts:69,132`) — a tool
  author who forgets `state.seed` gets non-deterministic runs with no warning.
  (→ Epic 9, as an assertion)

---

## Addendum — deferrals from the 2026-07 external staff review

The external review (`docs/reviews/2026-07-staff-review.md`; triage + what
shipped: `docs/reviews/2026-07-staff-review-ACTION-PLAN.md`) surfaced items
deliberately **deferred**, each with the trigger that should revive it:

- **npm publish + `core`/`browser`/`cli` package split.** `"private": true`
  is a decision, not an oversight — the contract still moves weekly.
  *Trigger:* the first real external adopter, or PACK_CONTRACT_VERSION
  stabilizing across a whole release cycle. `js/api.ts` already models the
  core/browser seam (DOM-free front door, lazy shell import), so the split
  has a paved path.
- **`GameRuntime`/`createRuntime` object (engine+save+analytics+UI, with
  `dispose()`).** `createGame()` is today's composition boundary and there is
  one shell and one host page. *Trigger:* a second embedder that needs
  teardown or adapter injection (side-by-side previews, host apps).
- **De-globalizing save/analytics module state.** Matches the one-pack-per-
  page PWA reality; now typed (strict frontier) and documented as the compat
  surface in `js/api.ts`. *Trigger:* same as `GameRuntime`.
- **Strictness for packs + presenter surfaces; narrowing `SwipeResult`'s
  index signature.** The frontier idiom (tsconfig.strict.json + the lint
  frontier in eslint.config.mjs) widens file-by-file; packs are the next
  big migration. *Trigger:* opportunistic, per-file, whenever a pack file is
  being edited anyway.
- **Keyboard-nav / focus-order a11y coverage beyond the axe gate.** Real
  gap, own sprint. *Trigger:* next UI-focused sprint.
- **Child-safe / content-safety mode.** A design problem (what does "safe"
  mean per pack?), not a patch. *Trigger:* external LLM authorship actually
  landing in front of kids — revisit alongside pack metadata.
- **Dev observability panel (visible seed, card id, plugin trace,
  replay-from-seed UI).** The diagnostics blob (`exportEvents`) + seeded
  goldens cover today's debugging. *Trigger:* the first balancing session
  that needs in-browser state inspection.
- **Bundle/performance budgets, changelog automation.** The no-bundler build
  is a deliberate simplicity stance; releases are manual at v0.1. *Trigger:*
  publish time (with the package split).

### From the 2026-07 Odyssey staff review (Pass 11 — tickets only, build none now)

- **The JSON-only external-pack experiment** — the review's product-defining
  recommendation, with its constraint list intact: JSON data only; **no
  module augmentation; no executable plugin code; no bespoke CSS beyond
  declared theme tokens; loaded at runtime by an unchanged host.** It need
  not support every Odyssey feature — the goal is discovering what
  *percentage* of a compelling game survives as pure data, which answers the
  product-identity fork below. *Trigger:* first external-author demand, or
  the next strategy discussion — whichever comes first.
- **The product-identity fork, decided by evidence:** (1) an SDK/framework
  for TypeScript developers and coding agents, or (2) a content-pack runtime
  for non-developers and LLM generation. Today it is (1) despite some
  language suggesting (2) — README now says so (Pass 9). The JSON experiment
  is the deciding instrument; ADR-0001's remedies follow the verdict.
  *Trigger:* the experiment's outcome.
- **Replay-depth layers beyond the single three-fragment secret** (the
  review's list: alternative landmark knowledge, contradictory bardic
  variants, hidden causal relationships, Fire-specific repertoires,
  route-specific lines, unlockable narrative lenses, failures that teach).
  The cheap first instance (bard's-note) is sketched in the odyssey
  IMPLEMENTATION-PLAN; everything further is gated on the playtest proving
  the appetite. *Trigger:* playtest verdict sheet.
- **Odyssey key art** — already in the odyssey backlog (black-figure pixel
  silhouettes); the review confirms shipping text-forward was a legitimate
  bet to test, not an oversight. *Trigger:* after the playtest reads on the
  text-forward first impression.
- **A generalized narrative DSL** — the review says don't ("do not build a
  large expression language"); recorded here so nobody rediscovers the idea
  as new. terminalRules deliberately models exactly the two supported
  condition shapes and stops. *Trigger:* none; this is a tombstone.
- **Perfect type-level pack isolation** — ADR-0001 carries the analysis and
  the tripwires. *Trigger:* ADR-0001's tripwires.
- **`PerkDef.keepGearOnBad` placement** (Pass 4 seam-audit residue): music's
  gear vocabulary sits on the shared perk contract instead of being merged
  in by the pack. Runtime is clean (generic `perkFlag` service); the type
  placement moves when perk definitions are next touched. *Trigger:*
  opportunistic, with Epic-1-style strictness work on packs.
