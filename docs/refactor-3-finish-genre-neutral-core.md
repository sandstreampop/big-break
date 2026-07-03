# Refactor #3 — finishing the genre-neutral core

*The completion pass. Sequel to
[`design-engine-generalization.md`](./design-engine-generalization.md) (shipped
Phases 0–5: safety net → TS build → IoC → generic taxonomy → plugin framework →
the mystery pack) and
[`refactor-2-genre-neutral-core.md`](./refactor-2-genre-neutral-core.md) (planned
Phases A–H; most landed). This doc is the honest accounting of what **stalled
partway**, plus three leaks the earlier reviews **missed entirely**, and the
sequenced plan to close all of it.*

Design taste this serves, unchanged from #2: **Open for Extension, Closed for
Modification; deep modules behind thin interfaces; composable subsystems;
pragmatic DDD; cut real seams, not speculative ones.**

---

## 0. The contract (non-negotiable — read this first)

This refactor is deemed successful **only if every one of these holds when it
lands**. A future session must not mark any work package done until it can show
all of the below green.

### 0.1 The green baseline (verified 2026-07-03, this is what you must preserve)

```
npm install                     # pins TypeScript 5.7.3 — the golden oracle is toolchain-sensitive
npm run build                   # -> dist/ ; build BEFORE you test (tools/tests import dist/)
npm run check                   # build + lint-content + simulate --check + mystery-sim --check + ui-smoke
node --test test/*.test.mjs     # -> 150 pass / 0 fail  (goldens + cross-pack invariants)
```

At the time of writing: `npm run check` exits **0** (music + mystery sims match
their goldens; both games pass the headless-Chromium UI smoke to the finale);
`node --test` is **150 pass / 0 fail / 0 skipped**. Also gated in CI and required
before Pages deploys: `cd docs-site && npm ci && npm run build` (the docs site;
TypeDoc regenerates the `Pack`/`Effect` reference from `js/types.ts`, so a type
change there **will** change the published reference — that is the whole point of
this refactor).

### 0.2 The three rules

1. **All visible implementations still work.** Music and mystery both boot, play
   to a finale, and pass their goldens and the UI smoke — every step of the way,
   not just at the end. The probe pack still constructs and plays with zero
   stubs. No screen regresses.
2. **Interfaces change only when they MUST change to reach the vision — and then
   minimally.** The vision *requires* removing music-named fields from shared
   types (`Pack`, `Effect`, `Requires`, `StatId`/`ResourceId`, `RunState`). That
   is a sanctioned interface change. When you make one, change the **fewest**
   implementation sites needed to keep behavior identical — do not opportunistically
   rewrite call sites that aren't in the way. Prefer the patterns already proven
   in this repo (declaration merging for vocabulary; plugin hooks for logic) over
   inventing new ones.
3. **Everything stays green.** Tests, lints, sims, the UI smoke, the docs-site
   build. A golden diff is a **bug** unless the work package is explicitly tagged
   `[re-baseline]` in §5 — then, and only then, you regenerate deliberately per
   §4.3.

### 0.3 Definition of done (the whole refactor)

- **`Requires` names no genre's subsystems** — a mystery card can gate on its own
  resource (`clues`) with no shared-type edit; the core `Requires` carries only
  neutral predicates (§5, WP1).
- **`engine.ts` contains no genre content and names no genre's stats, resources,
  effect verbs, or ids** — grep the compiled/source engine for `lucky_pick`,
  `cred`, `nerve`, `venue`, `hustle`, `songs`, `weather` and find nothing
  load-bearing (§5, WP2–WP7).
- **`Pack` is the irreducible surface**: `id, manifest, events, tutorialEvents,
  instruments(+ById)` required; `plugins, presenter, perks, interstitials,
  tutorialStart` optional. The dozen music-subsystem providers are **gone from the
  type** (WP7).
- **`Effect` declares only the genre-neutral core**; the six music structural
  verbs and the resource residue are owned by plugins via declaration merging
  (WP4).
- **The songs subsystem lives entirely in its plugin** — no song machinery in
  `engine.ts`, `Song`/`hits`/`songs` off the shared boundary where feasible,
  `state.hits` incremented in exactly one place (WP6).
- **The guard rails don't encode the leak**: `test/invariants.test.mjs`'s
  `CORE_VERBS` list shrinks to the genuinely neutral set (WP4).
- **All of §0.1 is green**, and adding a hypothetical third genre would edit
  **new files only** (a manifest, a deck, plugins, a presenter) plus one line in
  `js/packs/registry.ts`.

---

## 1. The vision, as an executable test

> A genre is a `Pack`: manifest + deck + plugins + presenter (+ optional
> capabilities the engine feature-detects). Adding one edits **new files only —
> no shared type, no engine line.** `engine.ts` is DOM-free and genre-free: it
> imports no `data/`, `charts`, or content module, and names no genre's stats,
> resources, effect verbs, or perk ids.
> — `CLAUDE.md`

The probe pack (`js/packs/probe.ts`) is the executable form of that test, and it
already passes at the **engine** layer. This refactor makes the same thing true
of the **type boundary** and removes the residual music logic still resident in
the core, so the promise the docs advertise stops being aspirational.

---

## 2. Current state: what landed vs. what stalled

Refactor #2's phases mostly shipped. The gap is that several stopped at "moved
the dispatch, left the substance," and #2 never inventoried three seams at all.

| #2 Phase | Intent | Status today | Gap (this doc closes it) |
|---|---|---|---|
| A (invariants, probe, lint parity) | grow the net | ✅ landed | `CORE_VERBS` in the invariant **encodes** the leak (WP4) |
| B (§2E symmetry) | first re-baseline | ✅ landed | `incredibleTargets()` reads the manifest — neutral. Done. |
| C (Effect → open vocab) | delete the god-union | ⚠️ **half** | 6 music verbs + 5 resources + `chartTitle` still on shared `Effect` (WP4) |
| D.1 (perks declarative) | kill perk-id checks | ✅ landed | `PerkDef` table is pack-declared. Done. |
| D.2 (songs owns machinery) | move ~200 lines out | ⚠️ **half** | plugin dispatches, but ~175 lines still engine-resident (WP6) |
| D.3 (coping/tutorial de-music) | pack-declare | ✅ landed | `InterstitialRule`/`TutorialStart` pack-owned. Done. |
| D.4 (`cred` stat-mult) | generic multipliers | ⚠️ **partial** | `statGainMult` is generic, but fail-state / comeback / deadline still name `cred`/`network` (WP3) |
| E (slim Pack via ISP) | delete stubs | ⚠️ **half** | stubs deleted from packs, but the **fields remain on the `Pack` type** (WP7) |
| F (harden plugins) | typed dispatch, no scratch | ✅ landed | typed `PluginHook`, per-card `cardCtx`, `priority`. Done. |
| G (Presenter/UI) | carry through UI | ✅ landed | `Presenter` + UI smoke exist; both games reach finale. Done. |
| H (tooling ring) | one driver, pack registry | ✅ mostly | `registry.ts` + `pack-core.mjs` exist. Out of scope here. |

**Never inventoried by #1 or #2 (new in this doc):**

- **`Requires` is a closed god-union of music subsystems** — the single largest
  remaining leak, and it sits in the deck hot path (WP1).
- **Hardcoded music accessory-id string arrays literally inside `engine.ts`**
  (`gearShelf`/`resolveGearGrant`) — genre *content*, not just a type, in the
  "content-free" core, and it evades the "no `data/` import" grep because the ids
  are inline literals (WP2).
- **The neutrality invariant's own `CORE_VERBS`** enshrines six music verbs as
  "core," so the guard passes *because* of the leak (folded into WP4).

---

## 3. The findings, with evidence

`file:line` against the tree at the time of writing. Grouped by the boundary that
leaks; each maps to a work package in §5.

### 3.1 `Requires` — closed union of one genre's subsystems  → WP1
`types.ts:64–82` and `engine.ts:503–542` (`requiresOk`). Neutral predicates:
`anyOf`, `flagsAll/None`, `moneyMin/Max`, `burnoutMin`, `stats` (generic
`{<stat>Min}` via `gateValue`). **Everything else names music:** `nemesis`,
`weatherIs`, `gear`, `rivalryMin/Max`, `genreAny`, `venueAny/None/Is/LevelMin`,
`rivalIs`, `hustleMin`, `bandMin/Max/Has`, `demoMin`, `chartingMin`, `songsMin`,
`fadedMin`. This is the same disease as the old god-`Effect`, but worse: it's a
hardwired branch ladder every card passes through, and there is **no generic
resource-min**, so a mystery card cannot gate on `clues`. The cure already exists
one field over: `stats` is the neutral, open escape hatch — generalize its shape
to the whole gate.

### 3.2 Music content strings inside the engine  → WP2
`engine.ts:1143–1183`. `gearShelf` and `resolveGearGrant` hold literal arrays of
music accessory ids (`'lucky_pick','loop_pedal','vintage_mic','cursed_8track',
'merch_cannon',…`). This violates "engine names no genre's … ids" in the most
literal way, and because they're inline literals it slips past the `no data/
import` convention. Latent bug to preserve-then-fix: `'loud_amp'`, `'loop_pedal'`,
`'in_ears'` appear in **both** the `basics` and `goods` pools of `gearShelf`.

### 3.3 Songs / charts machinery is engine-resident  → WP6
`engine.ts:280–448`: `ensureSongs, positionSong, positionAll, addSong,
releaseSong, debutSong, deadlineAudit, crownCheck, chartTick, rivalChartPos,
flagshipSong`. `songsPlugin` (`js/packs/plugins/songs.ts`) is a dispatcher that
imports these back from the engine (`songs.ts:16`). Music's flagship win-path
subsystem lives in the "genre-agnostic" core. Coupled facts: `state.hits` is
incremented in **two** places (`crownCheck` `engine.ts:370` and the plugin's
`applyResource` `songs.ts:55`); `deadlineAudit` hardcodes `state.stats.cred`
(`engine.ts:363`); `rivalChartPos` (`:435`) couples songs to the rival subsystem;
`Song` is a shared type (`types.ts:290`) and `RunState.songs?`/`hits`
(`types.ts:321,323`) are first-class.

### 3.4 Engine control flow keys off music stat names  → WP3
`checkFailStates` fails a run on `state.stats.cred <= 0` (`engine.ts:1329`), with
`CONFIG.credFailFromAct` naming a music stat in the balance file
(`config.ts:77`); `applyComeback` hardcodes `cred`/`network` (`engine.ts:471–472`);
`deadlineAudit` hardcodes `cred` (`:363`). Contradicts "names no genre's stats."
The fail-state model wants to be pack-declared like `interstitials` already are.

### 3.5 `RESOURCE_APPLY` names music resources  → WP5
`engine.ts:129–163`. Bespoke hardcoded handlers for `fame/money/pathProgress/
rivalry`; `money` reaches into `accs` (accessories) and weather hooks; `rivalry`
applies a rival 0–10 clamp. The generic additive fallback
(`applyEffects` `:1078–1081`) proves the neutral path exists; these four are the
un-migrated special cases.

### 3.6 The shared type residue  → WP4 (+ WP7)
- `Effect` (`types.ts:47–61`) claims neutrality but still carries
  `fame/money/hits/pathProgress/rivalry/chartTitle` and the six music structural
  verbs `setInstrument/grantBandmate/removeBandmate/grantHustle/removeGear/
  grantGear` — the comment confesses "Music-shaped … follow their handlers to a
  plugin in Phase D." The open-vocabulary refactor stopped ~80% in.
- `test/invariants.test.mjs:61–63` lists those six verbs + `chartTitle` in
  `CORE_VERBS`. The guard defines the leak as correct.
- `StatId` (`types.ts:15`) / `ResourceId` (`:17`) are music's lists;
  `StatId` is load-bearing via `RunState.stats: Record<StatId|'burnout', number>`
  (`:316`). `RunState.fame/money/hits` (`:321`) and `GameEvent.promptNemesis`
  (`:347`) are the same class.

### 3.7 Pack optional-capability fields  → WP7
`types.ts:270–286`. `accessories, accessoryById, arcs, arcById, contractById,
hustleById, genreById, bandmateById, recruitCandidate, rollSeeds, weatherHooks,
rollWeather`. `mystery.ts:49–51` declares **none** of them; the probe declares
none. So each is used by exactly one pack (music). These are the *downstream
symptom* — they can only leave the type once their engine consumers (WP1–WP6)
stop calling `PACK.<field>`. WP7 is the finish line, not a standalone task.

---

## 4. Golden-safety doctrine

### 4.1 Why this is delicate
The goldens pin **runtime behavior**, and the RNG is a seeded counter
(`stateRng`, `engine.ts:91`): every `rng()` call advances a shared stream, and the
**order** of draws is pinned. The delta-recording order (which `{key,amount}`
lands first) is pinned too. Therefore:

- Moving logic behind a hook is **byte-green** iff the hook fires **at the same
  point, in the same order**, and consumes RNG in the same sequence. The existing
  hook set was built for exactly this (`onConstruct` fires at the rival's ordinal
  draw slot; `applyResource` runs at the resource's ordinal in the loop). Reuse
  that discipline.
- Anything that changes **how many cards are drawn**, or **inserts/removes an
  `rng()` call**, or **reorders draws**, moves the entire downstream sequence →
  `[re-baseline]`.

### 4.2 The two tags
Every work package is tagged:
- **`[byte-green]`** — must reproduce identical goldens. A diff is a bug; find
  the reordered draw or the moved delta and fix it.
- **`[re-baseline]`** — legitimately moves traces. Do it **alone, in its own
  commit**, guarded by a cross-pack invariant, and regenerate per §4.3.

Only **WP6 (songs)** and **the `actLength` sub-step of WP4-contracts** are
`[re-baseline]`. Everything else is `[byte-green]` if done surgically.

### 4.3 Re-baseline protocol (when and only when a WP is tagged `[re-baseline]`)
1. Land the code change with the **cross-pack invariant** that proves the new
   behavior is *correct for all packs* (not just "different").
2. Confirm the diff is confined to the packs you expect (e.g. music only, or
   mystery only) and inspect a sample trace by hand.
3. Regenerate with the deliberate generators and commit the new goldens in the
   **same** commit as the code, with a message stating why the baseline moved:
   `node tools/gen-golden.mjs` (music), `node tools/gen-mystery-golden.mjs`
   (mystery), `node tools/gen-probe-golden.mjs` (probe).
4. Re-run all of §0.1 green.

### 4.4 The parallel-run safety move (for WP6)
For the risky song extraction, keep the old engine-resident functions in place,
add the new plugin-owned implementation behind a temporary flag, and assert
**byte-equality of the two over the whole golden corpus** in a scratch test
before deleting the old code. This is how #2's D.2 was specified; honor it.

---

## 5. The work packages

Ordered to bank confidence early (cheap, byte-green, high-clarity wins that also
retire whole `Requires`/`Effect` surface), and to isolate the two genuine
re-baselines last. Each WP is independently landable and independently green.

**Enabling infra used across WPs — the minimal neutral hook additions.** Add
these to the `Plugin` interface (`types.ts`) and the matching dispatch points in
`engine.ts`. They are the "small deliberate set of neutral hooks" that lets the
core stop reaching for music by name. Each is genre-neutral and something a
second genre would plausibly want:

- `modifyRoll(state, choice, acc, ctx)` — additive bonuses folded into
  `rollComponents` (`engine.ts:730`), where gear/genre/band/weather/contract
  bonuses are summed today.
- `modifyJitter(state, choice, jitter, ctx)` — jitter widening/override
  (`rollComponents` `:781–783`, weather/contract today).
- `modifyActLength(state, act, base) → number` — the one hook contracts need
  (`actLength` `:61`). **Its consumer is `[re-baseline]`; the hook itself is not.**
- `modifyScore(state, base) → number` — the `lpMult` fold in `legacyPoints`
  (`:1377–1378`, contract + weather today).
- `weightDeck(state, ev, weight) → number` and `deckPredicate` — the deck
  weighting + seeded-arc bias in `drawNextCard` (`:642–656`) and the eligibility
  gate (see WP1).

Firing all of these at the exact site of the code they replace, in registration
order, keeps every draw where it was → **`[byte-green]`**.

> **Discipline (from the "let's talk" analysis):** add the *minimal neutral* hook
> set, not one hook per music feature — or you just move the god-object from
> `Pack` to `Plugin`. Five modify-hooks + one predicate registry cover every
> subsystem below.

---

### WP1 — Open `Requires` (the headline; do first) · `[byte-green]`
**Goal.** Core `Requires` carries only neutral predicates; every music predicate
becomes a pack-registered one, exactly parallel to how `effectVerbs` opened
`Effect`.

**Target shape.**
- Core `Requires` (in `types.ts`) keeps: `anyOf`, `flagsAll/None`, `moneyMin/Max`,
  `burnoutMin`, and a **generalized generic gate** `stats?: Record<string,number>`
  extended to a `min?: Record<string,number>` / `max?: Record<string,number>`
  that resolves **any** manifest stat *or resource* key through `gateValue`
  (`engine.ts:116`). This alone makes `fameMin/Max`, `rivalryMin/Max`,
  `hustleMin`, `demoMin`, `songsMin`, … expressible generically for any pack.
- Predicates that read subsystem *shape* (not just a number) —
  `venueIs/venueLevelMin`, `rivalIs`, `nemesis`, `weatherIs`, `gear`, `genreAny`,
  `bandHas`, `chartingMin`, `fadedMin` — become **plugin-registered predicates**:
  add `requires?: Record<string,(state,arg)=>boolean>` to `Plugin`. `requiresOk`
  dispatches an unknown key to the registered predicate (else it's an authoring
  error, caught by a new invariant).
- Music adds its predicate keys to the `Requires` type via **declaration merging**
  in `music.ts` (same mechanism as its `Effect` verbs), so shared `Requires`
  names nothing musical.

**Approach.** `requiresOk` becomes: evaluate the neutral keys inline; for any
other key, look up a registered predicate and call it. Because predicate
evaluation consumes no RNG and returns the same booleans, eligibility is
identical → goldens hold.

**Interface-change budget.** `Requires` shape changes (sanctioned). Music cards'
authored `requires` keys are **unchanged** (they keep writing `venueIs`, now
backed by a music-registered predicate + music's type augmentation). No card data
edits.

**Verify.** New invariant "every `requires` key an eligible card names is neutral
or registered by exactly one plugin" (sibling of the effect-verb invariant).
Then §0.1 green, byte-for-byte goldens.

**Risk.** Low. Pure predicate refactor, no RNG. Watch `anyOf` recursion still
dispatches registered predicates.

---

### WP2 — Evict the hardcoded gear-id arrays from the engine · `[byte-green]`
**Goal.** No music content strings in `engine.ts`. The random-gear shelf becomes
a pack capability.

**Target shape.** A pack provides its own shelf pools (the gear subsystem is a
music concern; fold it into the music loadout/gear plugin from WP7, or expose a
capability `gearPool(tier) → id[]`). `gearShelf`/`resolveGearGrant` in the engine
become generic: they call the pack for candidate ids and do the
already-generic filter/sample.

**Approach.** Move the two literal arrays (`engine.ts:1145–1148, 1168–1171`) into
music's data/plugin **verbatim, same order**, then have the engine read them
through the capability. The sampling loop (`bag.splice(Math.floor(rng()*…))`)
stays in the engine, unchanged, so the RNG draw sequence is identical →
byte-green.

**Then** (separate commit, still byte-green if it doesn't change what's offered):
de-duplicate `loud_amp/loop_pedal/in_ears` across the `basics`/`goods` pools if
and only if the goldens don't move; if they do, it's a `[re-baseline]` — defer or
do it deliberately.

**Interface-change budget.** Adds one optional capability (removed again in WP7
when accessories fully leave `Pack`). No engine-resident content remains.

**Verify.** `grep -n "lucky_pick\|vintage_mic\|cursed_8track" js/engine.ts` →
empty. §0.1 green.

**Risk.** Low, provided the pools are moved in exact order and the sampling stays
engine-side.

---

### WP3 — Pack-declare fail states; de-name `cred`/`network` in the core · `[byte-green]`
**Goal.** `checkFailStates`, `applyComeback`, and `deadlineAudit` stop naming
music stats.

**Target shape.**
- `PackManifest` (or a small optional `failStates?: FailStateRule[]`) declares
  fail rules generically: `{ key: 'burnout', cmp: '>=', value: 100, ending:
  'burnout' }`, `{ key: 'cred', cmp: '<=', value: 0, fromAct: 2, ending:
  'cancelled' }`, `{ key: 'money', cmp: '<=', value: -300, flag: 'debt', ending:
  'debt' }`. `checkFailStates` iterates them via `gateValue`. The burnout rule is
  the one genuinely-core one (the engine owns the burnout slot); the `cred`/`debt`
  rules are music's, declared by music.
- `applyComeback` is a music-progression concern — move it behind a pack hook or
  the perk/progression model (it hardcodes `cred/network/burnout`, `:471–474`); if
  it has no second consumer, gate it as a music-owned capability rather than a
  core export.
- `deadlineAudit`'s `cred` write moves with the songs subsystem in WP6 (it's a
  contract×songs concern); until then, read the stat key from the contract mod
  rather than the literal `'cred'`.

**Interface-change budget.** Adds `failStates` to the manifest (sanctioned; the
manifest is *meant* to carry taxonomy). `config.credFailFromAct` migrates into the
music fail rule; keep the number identical.

**Verify.** `checkFailStates` contains no stat literal. Goldens hold (same numbers,
same order of checks — preserve the burnout-before-cred-before-debt order).

**Risk.** Low. Keep the check order and thresholds byte-identical.

---

### WP4 — Finish the open `Effect` vocabulary; unbake the invariant · `[byte-green]`
**Goal.** Shared `Effect` declares only the genre-neutral core. The six music
structural verbs and the resource residue are owned by plugins; the invariant's
`CORE_VERBS` shrinks to match.

**Target shape.**
- Core `Effect` keeps: `burnout`, `addFlag/removeFlag`, `chainEventId`,
  `addPromise`. (These are the genuinely genre-neutral control verbs.)
- `setInstrument/grantBandmate/removeBandmate/grantHustle/removeGear/grantGear`
  and `chartTitle` move to **plugin-declared** verbs (`effectVerbs` +
  `onEffect`/`applyResource` handlers), added to the `Effect` type via music's
  declaration-merge block. Their handlers already largely exist inline in
  `applyEffects` (`engine.ts:1091–1139`) — move each into the owning plugin
  (loadout for `setInstrument`; roster for `grant/removeBandmate`; hustles for
  `grantHustle`; gear for `grant/removeGear`), firing at the same ordinal so
  deltas/RNG hold.
- `fame/money/hits/pathProgress/rivalry` as *typed keys* stay only insofar as
  they're the engine-known resources in the manifest; the aim is that shared
  `Effect` no longer **enumerates** them as fixed fields — packs declare their
  resources' verbs. (Pairs with WP5.)
- **`test/invariants.test.mjs:61–63`**: delete the six verbs + `chartTitle` from
  `CORE_VERBS`; they must now be covered by the plugins' `effectVerbs` for the
  "no unknown verb" test to still pass. That the list *shrinks* is the proof.

**Interface-change budget.** `Effect` shape changes (sanctioned; it's the OCP
headline). No card data edits — cards keep authoring `grantGear` etc., now backed
by a plugin's declared verb.

**Verify.** The "no unknown effect verb" invariant passes with the shorter
`CORE_VERBS`. Goldens hold (handlers fire at the same point). `grep grantBandmate
js/engine.ts` → gone (lives in the roster plugin).

**Risk.** Medium — many small moves. Do one verb at a time, each its own commit,
goldens green after each.

---

### WP5 — Neutralize `RESOURCE_APPLY` · `[byte-green]`
**Goal.** The resource loop names no music resource.

**Target shape.** `fame/money/pathProgress/rivalry` handlers become
plugin-`applyResource` implementations (the pattern the songs `hits` handler
already uses, `songs.ts:42`), registered by the packs that own them
(fame/money/pathProgress are music-core-ish; rivalry is the rival plugin's; the
accessory-siphon on money moves with the gear plugin). The engine keeps only the
generic additive default (`engine.ts:1078–1081`) plus the manifest-ordered
dispatch.

**Approach.** Preserve the **manifest resource order** (`fame → money → hits →
pathProgress → rivalry`) so the delta order and the RNG-consuming `hits` slot
don't move. Each handler keeps its exact arithmetic (fame clamp/swing, money
siphon, rivalry 0–10 clamp).

**Interface-change budget.** None new (uses existing `applyResource`). Removes the
`RESOURCE_APPLY` table from the engine.

**Verify.** Goldens hold; `RESOURCE_APPLY` gone from `engine.ts`.

**Risk.** Medium. The money handler's accessory dependency (`accs`) must reach the
gear plugin's handler via `ctx` — keep the same values.

---

### WP6 — Fully extract the songs subsystem · `[re-baseline: music]`
**Goal.** Song machinery lives in `songsPlugin`, not the engine. `Song`/`hits`/
`songs` leave the shared boundary where feasible. `state.hits` incremented once.

**Target shape.** Move `ensureSongs/positionSong/positionAll/addSong/releaseSong/
debutSong/deadlineAudit/crownCheck/chartTick/rivalChartPos/flagshipSong`
(`engine.ts:280–448`) into the songs subsystem module. The plugin stops importing
them from the engine (`songs.ts:16`). `deadlineAudit`'s `cred` write becomes the
contract's declared stat (from WP3). `rivalChartPos` moves with songs (it's the
chart-war; the rival plugin exposes the rival's chart position through `ctx`).
Resolve the `state.hits` double-increment: one owner (the songs subsystem), one
increment site.

**Approach.** This is the delicate one. Follow §4.4: run old (engine) + new
(plugin) implementations in parallel over the golden corpus, assert byte-equality,
then delete the engine copy. If the counter/RNG ordering genuinely must shift,
that is a **sanctioned `[re-baseline: music]`** — regenerate the music (and if
touched, mystery/probe are unaffected) golden per §4.3, guarded by an invariant
asserting the hit/chart distribution is unchanged in aggregate.

**Interface-change budget.** `Song` moves to the songs subsystem's own types (or
stays exported from there); `RunState.songs?/hits` — leave the `[key:string]:any`
index to carry them rather than churning the runtime type (cheap-only rule).

**Verify.** `grep -n "songs\|chartTick\|crownCheck" js/engine.ts` → gone. Music
golden regenerated deliberately (or byte-green if parallel-run proves equality);
mystery/probe untouched. §0.1 green. The `hitfactory` win-path still reachable in
the UI smoke.

**Risk.** High. The single most golden-sensitive move in the whole refactor. Do
it **alone**, last, with the parallel-run harness.

---

### WP7 — Slim `Pack`, `StatId`/`ResourceId`, `RunState` (the finish line) · `[byte-green]`
**Goal.** With WP1–WP6 done, no engine code calls `PACK.accessoryById/arcById/
contractById/hustleById/genreById/bandmateById/recruitCandidate/rollSeeds/
weatherHooks/rollWeather`, because those subsystems now live in music's plugins.
Delete the fields from the `Pack` type and the `normalizePack` inert-default
block (`engine.ts:21–40`).

**Target shape.**
- `Pack` = `{ id, manifest, events, tutorialEvents, instruments, instrumentById }`
  required + `{ plugins?, presenter?, perks?, interstitials?, tutorialStart? }`
  optional. Nothing else.
- The contract/arc/hustle/genre/band/weather/gear providers move onto the
  **music pack's plugins** (owned by direct import, exactly as venue/rival data
  already are), not the shared type.
- `StatId`/`ResourceId`: either delete (if no longer referenced) or narrow their
  use — `RunState.stats` becomes `Record<string,number>` (the manifest is the
  source of truth for which stats exist). `GameEvent.promptNemesis` → a generic
  `promptAlt?` or moves to the rival plugin's presenter concern.

**Approach.** This WP is *mostly deletion* and only compiles once WP1–WP6 have
removed the call sites. Do it strictly last. Each field deletion is byte-green
(the code that used it is already gone).

**Verify.** The **docs-site `Pack` reference** (TypeDoc from `types.ts`) now shows
the minimal surface — the `pack.mdx` prose that "lists music's fields as the
contract" can be simplified because the generated reference no longer contains
them. `mystery.ts`/`probe.ts` are unchanged (they already declared none). §0.1
green + `cd docs-site && npm run build` green.

**Risk.** Low if ordered last; high if attempted early (the engine won't compile
without the providers until their consumers move).

---

### WP8 — Docs & prose reconciliation · `[byte-green]`
**Goal.** The docs stop advertising the wart, because the wart is gone.
- `docs-site/src/content/docs/concepts/pack.mdx:44–45`: drop the "subsystem
  providers the music game uses — `accessories`, `arcs`, `contractById`, …" bullet
  and the "~14 fields" framing; the required/optional table now *is* the whole
  surface.
- Update the `#region` transclusions only if a moved `#region` marker requires it
  (comment-only edits are golden-safe per `CLAUDE.md`).

**Verify.** `cd docs-site && npm ci && npm run build` green; the reference page
renders the slim `Pack`.

---

## 6. Risk & re-baseline register

| WP | What moves | Tag | Guard |
|---|---|---|---|
| infra hooks | dispatch points added, fire at same site | byte-green | goldens; hooks are no-ops until used |
| WP1 Requires | predicate evaluation only (no RNG) | **byte-green** | new "requires key owned" invariant + goldens |
| WP2 gear strings | content moves out, sampling stays | **byte-green** | goldens (pools moved in exact order) |
| WP3 fail states | check keys generalized | **byte-green** | goldens (same order/thresholds) |
| WP4 Effect vocab | verb handlers move to plugins | **byte-green** | "no unknown verb" invariant with shrunk CORE_VERBS |
| WP5 RESOURCE_APPLY | handlers → applyResource | **byte-green** | goldens (manifest resource order held) |
| **WP6 songs** | ~175 lines + hits counter | **`[re-baseline: music]`** | parallel-run byte-equality; hit/chart-dist invariant; isolate |
| WP7 slim types | deletions only | **byte-green** | compiles only after WP1–6; goldens; docs-site build |
| WP8 docs | prose + generated reference | byte-green | docs-site build |

**Only WP6 (and, if pursued, the `actLength`-via-`modifyActLength` contract
sub-step) may legitimately move a golden.** Everything else: a diff is a bug.

---

## 7. Suggested sequencing for a future session

1. Land the **infra hooks** (no-ops until used) — one commit, byte-green.
2. **WP1** (Requires) and **WP2** (gear strings) — biggest leak + most literal
   leak, both byte-green, both retire large surface. Great confidence bank.
3. **WP3**, **WP4**, **WP5** — de-name the core, one verb/resource at a time,
   goldens green after each commit.
4. **WP6** — alone, with the parallel-run harness; the one deliberate re-baseline.
5. **WP7** — the deletions that were blocked until now; the `Pack` type collapses.
6. **WP8** — reconcile the docs; verify the generated reference is minimal.

After every commit: `npm run build && npm run check && node --test`. Never let a
commit land red. If a "byte-green" WP shows a golden diff, **stop and find the
moved draw** — do not regenerate to make it pass.

---

## 8. What this refactor is NOT (the YAGNI guard, restated)

The 3-act skeleton, the three tiers, the swipe, the single burnout slot, the
instrument-style loadout — **stay baked in.** That structure *is* the engine's
identity: a 3-act swipe-roguelike. "Generic" means *a `Pack` that names no genre's
content on that fixed skeleton*, not "any game." Do not abstract act count, tier
count, or the swipe into config — no second consumer demands it, and the probe
pack already proves the real seam. Cut the seams a second genre stresses
(vocabulary, requires, subsystem residue); invent none for genres nobody is
building.

When WP1–WP8 are green, adding a third genre is: a manifest, a deck, its plugins,
a presenter, and one line in `registry.ts`. No shared type. No engine line. That
is the promise `CLAUDE.md` makes — made true.
