# Refactor #2 — from a two-game engine to a genre-neutral core

*Adversarial review of the post-generalization codebase, plus the plan to close
the gap. Sequel to [`design-engine-generalization.md`](./design-engine-generalization.md),
which planned and shipped Phases 0–5 (safety net → TS build → IoC → generic
taxonomy → plugin framework → the mystery pack). This doc reviews where that
landed and plans the next refactor.*

Design taste this plan serves: **Open for Extension, Closed for Modification;
deep modules behind thin interfaces; composable subsystems; pragmatic DDD;
cut real seams, not speculative ones.**

---

## 0. TL;DR

The generalization refactor was real and the safety net is the best asset in the
repo. But the honest report undersells the remaining work on two counts, and I'm
rejecting its closing claim.

- **Rejected claim:** *"the remaining work is contract-tidying and UI
  generalization, both low-risk behind the goldens."*
- **Why it's wrong (short version):**
  1. The goldens drive the **engine headlessly** (`tools/sim-core.mjs` →
     `engine`, never the DOM). **The UI has zero automated coverage.** So UI work
     is the *least*-protected in the repo, not the most — and the mystery UI
     already **throws at the finale** (`ENDINGS['sleuth']` is `undefined`,
     `ui.ts:1798`). "Boots and plays to a finale" is true for the sim, false for
     the browser.
  2. The core-neutrality work (moving songs/perks/coping out of the engine,
     genericizing the effect system) **necessarily changes the seeded RNG draw
     order** → these are **re-baseline events**, and the current doctrine (*"a
     golden diff is a bug"*) actively resists them. The net as *operated* is a
     straitjacket for exactly the next move. It needs a new class of guard first.
  3. "Contract-tidying" undersells the sharpest problem: the **`Effect` type is a
     global, closed-for-extension union of every pack's vocabulary** — an OCP
     violation living *in the type system*, edited by every new genre. And the
     safety net has a **genre hole**: `lint-content.mjs` validates music only;
     the mystery deck is unlinted; `npm test` omits the mystery golden.
- **The accurate one-liner:** the engine's *logic* is decoupled and proven; its
  *effect vocabulary*, its *Pack contract*, its *UI/flavor layer*, and its
  *tooling ring* still carry music's shape. The hard, risky extraction is done.
  The remaining work is a genuine **boundary redraw** — moderate risk, and it
  needs the safety net evolved before it starts.

---

## 1. What the report got right (accepted, not re-litigated)

- **Content injection (IoC) is genuine.** The engine imports no content module;
  a game is a `Pack` passed to `newRun` (`engine.ts:14`, `150`). ✅
- **Taxonomy is data.** Stats/resources/paths/winGates/statMeta come from
  `PackManifest`; `gateValue` reads generically with no `fame`/`hits` branch
  (`engine.ts:44`, `89`, `1269`). ✅
- **The safety net is the crown jewel.** ~112 golden traces (music 72 + mystery
  40) pin *runtime behavior* (not source bytes), deterministic sims, per-pack
  `--check` gates, CI blocking deploy on any breach. This is what made the
  surgery safe. Keep it; **grow** it (§5.A). ✅
- **The mystery pack is a real existence proof** *at the engine layer*: a
  different manifest + deck + one domain plugin, no engine edits.

Everything in §2 is the part the report smoothed over.

---

## 2. Adversarial findings — where music is still welded in

Evidence is `file:line`. Grouped by the seam that leaks.

### A. `Effect` is Closed-for-Extension — the sharpest OCP violation
`types.ts:41–64` is one interface enumerating **every pack's** numeric keys:
music (`skill/cred/creativity/network/burnout`) **and** mystery
(`nerve/charm/insight/alliance/clues`) **and** every subsystem verb
(`adoptVenue/hypeSong/writeSong/albumDrop/releaseDemo/polishDemo/grantBandmate/…`).
The comment says the quiet part out loud: *"A third genre adds its keys here."*
Adding a genre **modifies a shared type** touched by the core and all packs. The
"thin interface" is a god-object that knows every genre. (`tone?: number` at
`:63` is dead schema — a "legacy no-op" nobody retired.)

### B. The engine is content-free but not genre-neutral
Music mechanics live *inside* the "generic" core:

- **~20 hardcoded perk-id string checks** the report never mentions:
  `newRun` (`engine.ts:234–250`: `savings/demo/calluses/couch/warmup/perfect_pitch/stage_legs/headliner/notebook`),
  `rollComponents` (`:716–717` `thick_skin`), `resolveSwipe` (`:795` `crowdwork`,
  `:873` `insurance`), `applyEffects` (`:954` `therapist`, and `golden_ears`/`promoter`
  in the songs plugin), `startAct` (`:1201` `cheap_rent`, `:1208–1224`
  `merch_table/street_team/roadie_friend/archivist`). Several read music stats by
  name (`state.stats.skill/network/creativity/cred`, `:236–240`).
- **`cred` is special-cased** inside the supposedly-generic stat loop
  (`engine.ts:929–930`, `credGainMult`).
- **`hits` is special-cased** inside the "generic resource loop" — `if (res ===
  'hits')` (`engine.ts:970`) literally *creates songs* (`:973–986`). The resource
  writer is not generic; only the reader is.
- **Latent correctness bug (see §2E):** the INCREDIBLE payload multiplier
  hardcodes the music stat list `['skill','cred','creativity','network','fame','money']`
  (`engine.ts:814`).
- **`burnout` is hardwired** (27 refs): fail state (`:1257`), per-act wear
  (`config.ts:93`), and the **coping interstitials** (`engine.ts:886–900`) which
  hardcode music event ids (`coping_50/75/song`) **and read song state**
  (`hasHit`, `:889`) — a core→songs context leak.
- **Song machinery is engine-resident** (~200 lines, `engine.ts:254–460`:
  `ensureSongs/positionSong/addSong/releaseSong/debutSong/deadlineAudit/crownCheck/chartTick/rivalChartPos/flagshipSong`).
- **The engine imports music content:** `engine.ts:5` imports `songName`,
  `collabArtistFor` **from `charts.ts`** (a music module). The genre-agnostic core
  depends on a genre file. `charts.ts:7` imports `rivalChartPos` back — a
  bidirectional cycle.
- **`newTutorialRun` hardcodes music stats** and `'melodica'` (`engine.ts:433–441`).

### C. The plugin framework is a stringly-typed shared-mutable-state event bus
Not "composable deep modules behind thin interfaces":

- **Untyped dispatch:** `firePlugins(hook, ...args)` calls `(p as any)[hook]`
  (`engine.ts:664–671`). A typo'd hook name is a silent no-op; nothing is checked
  at compile time.
- **Side-effects on shared mutable objects:** hooks receive and mutate `state`,
  `effects`, `deltas: any`, `notes: string[]`, `result: any`. No return-value
  contract (`types.ts:150–167`).
- **Order is load-bearing and implicit:** the array position in
  `plugins: [venue, rival, band, songs]` (`music.ts:30`) is pinned by the golden
  ("band before songs because notebook draws RNG", `band.ts` header). Plugins are
  advertised as composable but cannot be reordered.
- **Leaky context:** `onEffect` is handed `hooks` (instrument-quirk internals),
  `accs` (accessories), `mg` (minigame detail) (`engine.ts:998`). The songs
  plugin reaches into engine internals; it is coupled to the engine's
  representation, not to a stable façade.
- **Temporal coupling / hidden state:** `state._chartTitleHandled` is a flag
  handed between the engine resource loop and the songs plugin
  (`engine.ts:985`, `songs.ts:28,99`); the venue plugin keeps **module-level
  scratch** (`venueThisCard`, `hostedThisCard`, `venue.ts:17`) that only works
  because runs are single-threaded and the two hooks fire in order — it breaks
  the instant anything runs two runs at once.
- **Fake seam:** `songs.ts:16` and `band.ts:13` import `addSong/releaseSong/
  chartTick/deadlineAudit/stateRng` **from the engine**. The domain logic never
  left; the "plugin" is a shim calling back into engine-resident code.
- **Designed against one example:** 5 of the 7 hooks have exactly one consumer
  (music). The mystery `cluesPlugin` (26 lines) uses only `onEffect` +
  `onActBreak`. The plan's own "validate hooks against the second pack before
  locking" warning was not really met — clues is too thin to stress the interface.

### D. The Pack contract is fat and `any`-typed (ISP + boundary-typing miss)
- **~19 required fields; mystery stubs 14** (`mystery.ts:33–49`:
  `accessoryById/arcs/arcById/VENUE_TIERS/venueById/bandmateById/recruitCandidate/
  randomRival/contractById/hustleById/genreById/rollSeeds/weatherHooks/rollWeather`
  all return `null`/`[]`/no-op). A pack pays for what it doesn't use.
- **The content surface is untyped:** `instruments: any[]`, `accessoryById:
  (id) => any`, etc. (`types.ts:175–191`). "Type the boundaries first" delivered a
  typed *manifest* but an `any`-typed *Pack*. The bug class the whole TS effort
  targeted (renamed-key drift in instruments/accessories/venues) is **not caught**
  at this boundary. `RunState` has `[key: string]: any` (`types.ts:231`), so every
  subsystem field is untyped too.

### E. A latent genre-asymmetry bug that per-pack goldens structurally cannot catch
`engine.ts:814` applies the INCREDIBLE payload multiplier only to
`['skill','cred','creativity','network','fame','money']`. **A mystery INCREDIBLE
never boosts `nerve/charm/insight/alliance`.** Two same-shaped genres behave
differently on the core's own headline mechanic. Each pack's golden encodes its
*own* (asymmetric) output as "correct", so neither golden flags it. This is the
proof that **per-pack byte-goldens are blind to cross-pack invariants** — you
need property tests that must hold for *all* packs (§5.A).

### F. The UI/flavor layer was never carried through the refactor
The engine genericization stops at the engine boundary.

- **The mystery UI crashes at the finale:** `ENDINGS` is keyed
  `megastar/studio/hitfactory/burnout/cancelled/debt` (`data/meta.ts`), so
  `ENDINGS[run.path][evalr.result]` throws for a `sleuth/darling/fixer` run
  (`ui.ts:1798`, `1829`).
- **Eight flavor modules sit entirely outside the Pack abstraction** and are
  imported statically + called unconditionally by `ui.ts`: `headlines`, `dms`,
  `epilogue`, `discography`, `charts`, `minigames`, `art`, plus `sharecard`
  (the last is genre-neutral apart from the literal "BIG BREAK" title).
- **Four of them bypass the pack and import music `data/` directly**, so
  mystery's stubs never fire: `epilogue.ts:5–10` (six modules: `rivals/
  instruments/genres/contracts/venues/band`), `charts.ts:6`, `headlines.ts:6`,
  `dms.ts:6` (`data/rivals`). `art.ts:7–8` pulls `data/assets` + `data/events2`.
- **`headlines.ts` reads music stat names** (`state.stats.cred/skill`) and music
  path ids (`megastar/studio/hitfactory`) — silently `undefined` under mystery.
- **Plugin output has no generic renderer:** `showResult` is a hand-written
  switch of music nouns (`ui.ts:1104–1137`: `venueLeveled/bandmateJoined/
  songDebuts/songWritten/…`). A mystery plugin emitting `clueFound` renders
  **nothing**.
- **Minigames aren't pack-injectable:** `GAMES` is a module singleton filled by
  import-side-effect `register()` calls; there is no `pack.minigames` and no
  injection path (`minigames.ts:27–29`).
- Manifest-driven parts leak too: `STAT_INFO` hardcodes the four music stats with
  music copy (`ui.ts:905–911`); `fame`/`hits` labels are special-cased
  (`ui.ts:1214–1217`, +4 sites); `specials.all_paths` hardcodes the music paths
  (`ui.ts:1737`).

**Verdict:** the UI is *hardwired music with a thin manifest veneer* (stat rail,
Crossroads, gate readouts are pack-driven; almost nothing else is).

### G. The tooling ring is music-first; the mystery pack is second-class there
- **`lint-content.mjs` validates music only** — imports `musicPack`/`EVENTS`,
  hardcodes music tokens and a music maximal-state exerciser (`'kazoo'`,
  `'hitfactory'`, band `nadia/fish/ludo`). **The mystery deck is never linted.**
- **`sim-core.mjs` is really the music driver** despite the neutral name: it
  imports music `data/` directly and hardcodes `ALL_PACKS =
  ['pack_divebar','pack_festival','pack_wedding','pack_cruise']` (`:20–28`).
- **Duplicated harness:** the deterministic seeding contract and the
  `--check` gate-runner are copy-adapted across `sim-core`/`mystery-core` and
  `simulate`/`mystery-sim`; only policy richness and reporting diverge.
- **No pack registry:** pack choice is which HTML you loaded; `build.mjs`
  special-cases mystery by hand (`:34–35`). A third pack means editing the build.
- **Save is namespaced but not pack-tagged:** the run carries no `packId`
  (`engine.ts:159`); `importSave` writes a pasted code into whichever pack is
  active with no rejection — a latent cross-pack corruption path (`save.ts`).
- **Analytics has no pack dimension** — both games land in one PostHog stream.
- **`npm test` runs only the music golden** (`package.json`); only CI's bare
  `node --test` picks up mystery. `package.json` description still says
  *"genre-agnostic core in progress"*.

---

## 3. Target architecture

The north star, stated in the taste this repo optimizes for.

### 3.1 Bounded contexts (pragmatic DDD)
Draw the boundaries the second genre already stresses — no more.

- **Run Core** *(genre-neutral)* — run lifecycle, deck assembly & weighting,
  roll→tier resolution, stat/resource application, act/phase advancement, finale,
  seeded RNG. **Shared kernel = the manifest** (stat/resource/path taxonomy).
  Imports nothing genre-specific. This is the deep module.
- **Subsystem contexts** *(pack-owned domains)* — Charts/Songs, Venue,
  Roster/Band, Rivalry (music); Investigation/Clues (mystery). Each owns its state
  slice, its effect verbs, and its own presentation. A subsystem is a plugin +
  its data + its renderers, self-contained.
- **Progression context** *(perks/contracts)* — today welded into the core;
  becomes declarative modifiers registered against lifecycle hooks.
- **Presentation context** — UI shell + flavor generators; driven by a
  pack-provided **Presenter** + the manifest, never by static music imports.
- **Tooling/Safety context** — one pack-parameterized sim/golden/lint driver over
  N packs, plus cross-pack property invariants.

The **Pack is the composition root / anti-corruption boundary**: the one place
that wires a genre's manifest, content, plugins, and presenter to the core.

### 3.2 The five interface redraws (deep modules, thin interfaces, OCP)
1. **Effect vocabulary → an open registry, not a god-interface.** Core owns a
   tiny closed verb set (stat delta, resource delta, `addFlag/removeFlag`,
   `chainEventId`). Everything else is a verb handler a plugin **registers**:
   `registerEffect(verb, handler)`. Types via generics / module augmentation so a
   new genre adds verbs **without editing shared code**. This is the headline OCP
   win and it deletes the §2A god-object.
2. **Plugin dispatch → typed and declared.** A typed hook map (no `as any`);
   plugins declare an explicit `priority` so ordering is intentional, not
   array-position pinned by a golden; a **stable `PluginContext` façade** that
   exposes capabilities, not raw engine internals; contributions (`notes`,
   `deltas`) **returned and merged** by the core rather than mutated in place;
   **no module-level scratch** — per-resolution context object instead.
3. **Pack → capability interfaces (ISP).** `Pack = { id, manifest, content,
   plugins, presenter }`. Optional capabilities (Loadout/instruments, Accessories,
   Contracts, Arcs/Seeds, Weather, Genres, Roster) are **optional typed providers**
   the core feature-detects — or better, become plugins. Mystery declares the 3
   things it uses, not 19 stubs. Content accessors get **real types** (kill the
   `any`s).
4. **Presenter interface for the UI.** `manifest.statMeta` (exists) + delta/notice
   renderers + note-code renderers + ending/epilogue/headline/DM/art providers.
   The UI reads the presenter; zero static music imports.
5. **Engine facade → shrink the surface.** From 34 exports to a small `RunEngine`
   (`newRun/drawNextCard/choiceOdds/resolveSwipe/advance/commitPath/
   evaluateFinale/summary`). Song-machinery exports disappear (they move into the
   songs subsystem module); RNG/util go internal or to a tiny `rng`/`util` module.
   A deep module has a narrow mouth.

### 3.3 Two forcing functions (make neutrality executable)
- **A "probe pack" in CI.** A deliberately minimal pack — one stat, one resource,
  one path, a ~10-card deck, **no subsystems, no stubs** — added to the golden +
  lint + sim matrix. If the engine can't run it without a stub or throws, the core
  isn't neutral. This is the executable *definition of done* for genre-neutrality
  **and** a permanent regression guard against re-coupling. (It's the mystery
  pack's job done honestly: mystery still stubs 14 fields; the probe pack is
  allowed to stub *zero*.)
- **Cross-pack property invariants.** Tests that must hold for *every* registered
  pack, e.g.: the INCREDIBLE multiplier applies to every manifest stat
  symmetrically (catches §2E); no eligible card names an unknown effect verb;
  every resource applies through the generic path; every `winGates` key resolves
  via `gateValue`. This is the class of guard per-pack byte-goldens cannot be.

### 3.4 Explicit non-goals (pragmatism / YAGNI guard)
The report lists "3 acts, crossroads, swipe L/R, bad/good/incredible tiers,
encores, pity, hot streaks, instrument-style loadout" as baked-in limits. **Leave
them baked in.** That structure *is* the engine's identity — this is a "3-act
swipe-roguelike engine," a legitimate, cohesive product, not a universal game
kit. Abstracting act count / tier count / the swipe into config would be
speculative generality with no second consumer demanding it. Cut the seams a real
second genre already stresses (effect vocabulary, Pack stubs, UI flavor, perks,
tooling); do **not** invent seams for genres nobody is building.

---

## 4. Sequencing principle

The original doc's core lesson holds: **evolve the net before the surgery.** The
next moves change RNG order, so they cannot hide behind byte-green goldens. So:

1. **Grow the net first (Phase A)** — property invariants + the probe pack + close
   the genre holes (lint/test both packs). This is what makes the rest safe.
2. **Prove the method on a small deliberate re-baseline (Phase B)** — the §2E bug.
3. Then redraw boundaries (C–F), carry it through the UI (G), unify tooling (H).

Each phase is tagged **[byte-green]** (must reproduce identical traces — a diff is
a bug) or **[re-baseline]** (legitimately moves traces — isolate in its own PR,
guard with a property invariant, regenerate deliberately).

---

## 5. Phased plan

### Phase A — Evolve the safety net; close the genre holes *(do first)*
*No engine behavior change. Pure additions to the guard rail.*
- **A.1 Cross-pack property invariants** (`test/invariants.test.mjs`): iterate all
  registered packs and assert the §3.3 properties. This is the guard the
  re-baseline phases lean on.
- **A.2 The probe pack** (`js/packs/probe.ts` + a golden): minimal manifest, tiny
  deck, zero subsystems, **zero stubs allowed**. Today it will fail to construct
  (the engine calls `rollSeeds/rollWeather/randomRival/…`); that failure list *is*
  the Phase-E/D work-list. Land the pack now as `xfail`-style documentation, flip
  it green as the core slims.
- **A.3 Lint every pack:** parameterize `lint-content.mjs` over
  `[musicPack, mysteryPack, probePack]`; move music-specific tokens into a
  per-pack descriptor. Closes the "mystery deck is unlinted" hole.
- **A.4 Test + tooling parity:** `npm test` runs all goldens; `sim-core.mjs`
  stops importing music `data/` and takes content via the pack; fix the
  `package.json` description. **[byte-green]**

### Phase B — Fix the §2E asymmetry *(first guarded re-baseline; proves the method)*
- Read the INCREDIBLE payload target set from `manifest.stats + manifest.resources`
  instead of the hardcoded array (`engine.ts:814`). Music traces are unchanged
  (same keys) → **music stays byte-green**; **mystery re-baselines** (its stats now
  get the multiplier). Guard with the A.1 symmetry invariant, regenerate the
  mystery golden in an isolated PR. Small, contained, and it demonstrates
  "re-baseline behind a property invariant" before the big moves. **[re-baseline: mystery]**

### Phase C — Effect vocabulary → open registry *(the OCP headline)*
- Introduce `EffectHandler` + a per-pack registry; core keeps only the closed verb
  set. Port each subsystem's verbs (venue/songs/clues) to registered handlers.
- Collapse the §2A god-`Effect` into a core `Effect` + per-pack augmentation
  (generics or declaration merging). Retire the dead `tone` key.
- Behavior-preserving if handlers fire at the same point in the same order →
  **[byte-green]**; guard with A.1 ("no unknown verb") + the goldens.

### Phase D — Move music mechanics out of the core
*The bulk of the neutrality work. Each sub-step isolated + guarded.*
- **D.1 Perks → declarative modifiers.** Replace the ~20 string checks (§2B) with a
  pack-declared perk table registered against hooks (`onRunStart`,
  `onRollComponents`, `onActBreak`, `onEffectApply`). Hold arithmetic exactly →
  **[byte-green]**.
- **D.2 Songs subsystem → owns its machinery.** Move the ~200 engine-resident song
  functions (§2B) *into* the songs subsystem module; the engine stops exporting
  them; delete the `charts.ts`↔`engine.ts` cycle (`engine.ts:5`). The `hits`
  branch (`engine.ts:970`) becomes a registered resource/verb handler. Run
  old+new in parallel over the corpus, assert byte-equality, then delete old.
  **[re-baseline-risk: isolate; guard hits-distribution + hitfactory rate]**
- **D.3 Coping + tutorial de-music.** Coping thresholds/ids/`hasHit` become
  pack-declared interstitial rules (§2B, `engine.ts:886–900`); `newTutorialRun`
  reads the pack instead of hardcoding music stats/`melodica`. **[byte-green for music]**
- **D.4 `cred` special-case** folded into the generic stat-gain-multiplier path
  (`engine.ts:929`). **[byte-green]**

### Phase E — Slim the Pack via capability interfaces (ISP)
- Split `Pack` into `{ manifest, content, plugins, presenter }` with optional
  capability providers; the engine feature-detects. Delete mystery's 14 stubs.
- Type the content accessors for real; tighten `RunState`'s subsystem fields off
  the `[key:string]: any` escape hatch where cheap.
- **Definition of done: the probe pack (A.2) constructs and plays with zero
  stubs.** **[byte-green]**

### Phase F — Harden the plugin framework
- Typed hook dispatch (drop `(p as any)[hook]`, `engine.ts:664`); explicit
  `priority` replacing array-position ordering; a stable `PluginContext` façade
  (stop leaking `hooks/accs/mg`, `engine.ts:998`); return-and-merge contributions;
  **delete module-level scratch** (`venue.ts:17`) and the `_chartTitleHandled`
  flag via a per-resolution context. **[byte-green]** (mechanical; goldens hold).

### Phase G — The Presenter: carry the refactor through the UI *(least-protected — build coverage first)*
*The goldens do not touch the UI. Add a thin UI smoke harness (headless DOM: boot
each pack, play a scripted run to the finale, assert no throw) BEFORE editing —
this is where the mystery finale crash lives.*
- **G.1 UI smoke test** for `[music, mystery, probe]` to the finale. Catches the
  `ENDINGS['sleuth']` throw (§2F) and guards everything below.
- **G.2 Presenter interface:** move `ENDINGS/EXIT_INTERVIEWS/WALL_ITEMS/TROPHIES`
  and the `headlines/dms/epilogue/discography/charts-render/art` generators behind
  `pack.presenter`. The four direct `data/` imports (`epilogue/charts/headlines/dms`,
  §2F) route through the pack.
- **G.3 Generic notice rendering:** replace the music-noun switch
  (`ui.ts:1104–1137`) with presenter-provided renderers keyed by note code.
- **G.4 De-hardcode** `STAT_INFO`, `fame`/`hits` labels, `all_paths`, act names,
  taglines into the manifest/presenter.
- **G.5 Minigames become a pack capability** (`pack.minigames`), injected rather
  than a module singleton (`minigames.ts:27`).

### Phase H — Unify the tooling ring
- One pack-parameterized sim/golden driver (factor the duplicated seeding contract
  + gate-runner out of `sim-core`/`mystery-core`, `simulate`/`mystery-sim`).
- A **pack registry** so `build.mjs` maps packs→entry points data-drivenly (no
  hand-copied `mystery.html`); a third pack is data, not a build edit.
- **Pack-tag the save** (`packId` in run state + reject on mismatch in
  `loadRun`/`importSave`); add a pack dimension to analytics.

---

## 6. Risk & re-baseline register

| Phase | Byte-green? | Guard |
|---|---|---|
| A | yes (additions only) | new invariants must pass on all packs |
| B | **mystery re-baselines** | §3.3 symmetry invariant; isolated PR |
| C | byte-green if order held | "no unknown verb" invariant + goldens |
| D.1 / D.3 / D.4 | byte-green | goldens; hold arithmetic exactly |
| **D.2 (songs)** | **re-baseline-risk** | parallel old+new byte-equality; hits-dist + hitfactory-rate `--check`; isolate |
| E | byte-green | **probe pack constructs with zero stubs** |
| F | byte-green | goldens (mechanical) |
| G | **UI has no golden coverage** | build the UI smoke harness *first* (G.1) |
| H | byte-green (behavior) | goldens unchanged; tooling only |

**Only these may legitimately move seeded output:** the tsconfig/toolchain
(unchanged doctrine), **B (mystery only)**, and **D.2 (songs)**. Everything else is
byte-green; a diff there is a bug.

---

## 7. Definition of done

The core is genre-neutral — not "music-with-hooks" — when:
- **The probe pack** boots, plays to a finale, and passes its gates **with zero
  stubbed Pack fields**; both real packs' goldens stay green throughout.
- The engine imports **no** genre module (the `charts.ts` cycle is gone) and
  exports a small facade; song machinery lives in the songs subsystem.
- Adding a genre requires **new files only** — a manifest, a deck, subsystem
  plugins, a presenter — and edits **no** shared type or engine line (OCP).
- `lint-content`, the golden runner, and the sims run over **all** packs from one
  driver; the cross-pack invariants pass.
- A mystery (or probe) run **reaches its finale in the browser** without a
  music-shaped fallback or a throw.

Then it's a swipe-roguelike SDK, not a two-game engine — and the safety net that
made the first refactor safe will have grown teeth for the shape of bug
(cross-genre asymmetry, re-coupling) that the first net was blind to.
