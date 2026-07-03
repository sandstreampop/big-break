# Refactor #4 — the last genre words, and comment hygiene

*Sequel to [`refactor-3-finish-genre-neutral-core.md`](./refactor-3-finish-genre-neutral-core.md)
(shipped: `Requires`/`Effect` opened, `RESOURCE_APPLY` neutralized, every subsystem
— contract, weather, genre, band, gear, hustle, seeds, songs — moved to plugins,
`Pack` collapsed to its irreducible surface, and `newRun` stripped of every
genre-bound state default). The engine's **construction and logic now name no
genre.** This doc closes the last two gaps: the handful of genre **words** still
spoken by the core, and the **comment rot** that makes these files a chore to read.*

Design taste, unchanged: **Open for Extension, Closed for Modification; deep
modules behind thin interfaces; cut real seams, not speculative ones.** Plus one
addition this round makes explicit: **the code is the truth. Comments are for
gotchas and intent, not narration.**

---

## 0. Where we are

`engine.ts` carries no genre *logic* and no genre *content*. What remains are a
few genre **names** used as core primitives, and one music-shaped serializer.
Grep the engine and you'll still find these load-bearing:

| Site | What it names | Class |
|---|---|---|
| `offerInstruments`, `instrumentById`, `state.instrument`, `Pack.instruments` | `instrument` — the loadout primitive | music word for a core concept |
| `resolveSwipe` shop check (`state.money < choice.cost`) | `money` — the cost currency | engine-known resource, hardcoded |
| `Requires.moneyMin`/`moneyMax` (core neutral keys) | `money` | should be a pack predicate like `fameMin` |
| `incredibleTargets()` → `[...stats, 'fame', 'money']` | `fame`, `money` | magnitude resources, hardcoded |
| `evaluateFinale` momentum clutch (`state.pathProgress`) | `pathProgress` | engine-known resource, hardcoded |
| `newTutorialRun` (`t.money`, `t.fame`) | `money`, `fame` | `TutorialStart` names two resources |
| `runSummary` | `venue`, `band`, `genre`, `weather`, `hustles`, `songs`, `rival`, `contract`, `fame`, `money`, `hits`, `pathProgress`, `rivalry` | a music-shaped serializer |
| `state.stats.burnout` + `effects.burnout` + config/hooks/`statMeta` | `burnout` — the universal exhaustion slot | genre-*neutral* concept, music-flavored name |

The green baseline you must preserve (verified on `main`):

```
npm install
npm run build
npm run check          # -> exit 0
node --test test/*.test.mjs   # -> 153 pass / 0 fail
cd docs-site && npm ci && npm run build   # -> green (CI gate before Pages)
```

Music **and** probe goldens are byte-for-byte pinned; mystery's golden already
absorbed the one sanctioned re-baseline (WP5's unclamped Feud). Golden-safety
doctrine is unchanged — see refactor-3 §4. A golden diff is a bug unless a WP is
explicitly tagged `[re-baseline]`.

---

## 1. Work packages

Ordered by value-per-churn. WP-A and WP-B are the clear wins (mostly byte-green).
WP-C and WP-D are judgment calls flagged with their real cost.

### WP-A — `instrument` → `loadout` · `[re-baseline: music summary only]`
`instrument` is a purely-music word for the engine's **loadout primitive**: the
roster of starting identities you pick one of, each with modifiers and a quirk
(mystery reuses it for reality-show personas; the probe for "The Runner"). Rename
the *primitive*, not music's content:

- Engine: `offerInstruments`→`offerLoadouts`, `Pack.instruments`→`loadouts`,
  `instrumentById`→`loadoutById`, `state.instrument`→`state.loadout`,
  `firstInstrument`→`firstLoadout`, `swappedInstrument`→`swappedLoadout`.
- `types.ts`: rename on `Pack` (still required) and `RunState`.
- Packs: music provides `loadouts: INSTRUMENTS, loadoutById` (its data module can
  keep calling them instruments internally); mystery/probe rename their fields.
- UI/tools: `ui.ts`, `sim-core.mjs`, `pack-core.mjs`, `mystery-core.mjs` follow.
- Music's `setInstrument` effect verb stays music's (it's declaration-merged onto
  `Effect` by the pack; the loadout plugin reads `state.loadout`).

**Cost.** Mechanical. Byte-green everywhere **except** the music run-summary key
`instrument` → `loadout`, which is one deliberate music-golden re-baseline (a key
rename, identical values). Confirm the diff is exactly that key, regenerate
`tools/gen-golden.mjs`, commit in the same commit.

### WP-B — generalize `money`/`fame`/`pathProgress` to resource *roles* · `[byte-green]`
The engine shouldn't name a resource; it should ask the manifest which resource
plays which role. Money is just a `resource` a pack designates.

- `PackManifest.costResource?: string` (music: `'money'`). `resolveSwipe` reads
  `state[PACK.manifest.costResource]` for shop affordability.
- `PackManifest.incredibleResources?: string[]` (music: `['fame','money']`).
  `incredibleTargets()` returns `[...manifest.stats, ...incredibleResources]`.
- `Requires.moneyMin`/`moneyMax` leave the core `Requires` and become
  economy-plugin predicates (declaration-merged by music, exactly like `fameMin`
  already is). Cards keep authoring `moneyMin` — no data edit.
- `TutorialStart`: replace `money?`/`fame?` with a generic `resources?:
  Record<string,number>`; `newTutorialRun` applies it generically.
- The `evaluateFinale` momentum clutch reading `state.pathProgress`: either a
  `momentumResource?: string` manifest role, or fold it into the same "resource
  roles" idea. (Lowest-priority of the set; `pathProgress` is engine-known.)

**Cost.** Byte-green — every value is identical, only the addressing changes
(`state.money` → `state[costResource]` where `costResource === 'money'`, etc.).
No card edits, no golden movement. This is the satisfying one.

### WP-C — pack-provide the run summary · `[re-baseline: music summary]`
`runSummary` in `engine.ts` is the last music-shaped thing in the core: it
enumerates `venue/band/genre/weather/hustles/songs/rival/contract` and the
resources by name. It's consumed by the music UI and pinned by the music golden.

Make it neutral: the engine emits only the pack-agnostic core (ending, path,
stats, the manifest's resources, tier/card logs), and the **presenter** (or a
new `Pack.summarize?(state)` capability) contributes the genre-specific fields a
pack wants in its summary/scrapbook. Mystery/probe don't call `runSummary`, so
this is music-only.

**Cost.** Medium. A deliberate music-golden re-baseline (the summary's shape
changes) — do it alone, per the re-baseline protocol, and eyeball the diff.

### WP-D — `burnout` → `strain`? · **measure before you commit**
Tempting, but priced honestly before you start:

- **`burnout` is not a music word.** A detective, an athlete, a chef all burn
  out. It's the engine's *universal* exhaustion slot, already reskinned per genre
  via `statMeta` (mystery renders it as "Suspicion"). Unlike `instrument`, there
  is no genre leak here — only a flavor preference.
- **723** authored `burnout:` values across the card decks (it's an `Effect` key
  cards write, not just an engine field).
- **~3,000** pinned `burnout` keys across all three golden corpora → a full
  re-baseline of *every* golden.
- Plus config knobs, `Requires.burnoutMin`, `InterstitialRule.burnoutMin`, perk
  `burnoutHealMult`, weather/contract `burnoutGainMult`/`HealMult`, UI.

Recommendation: **leave it**, or do it only as a deliberate, isolated all-corpus
re-baseline if the flavor win is judged worth a total content rewrite. This is a
product call, not a correctness one.

---

## 2. WP-E — comment hygiene (do this everywhere, relentlessly)

The core files have accreted comments across three refactors. Many are now
**stale** (referring to code that moved), **redundant** (restating the line
below), **archaeological** (Phase/WP tags that mean nothing to a fresh reader),
or **genre-bound** (naming music in an otherwise-neutral file). They make the
engine a chore to read. **The code is the truth. A comment earns its place only
by explaining a gotcha or sharing intent the code can't.**

**Scope:** `engine.ts`, `songs.ts`, `types.ts`, `config.ts`, `js/packs/plugins/*`,
`tools/pack-core.mjs`, `tools/sim-core.mjs`. Comment-only edits are **golden-safe**
per `CLAUDE.md`; verify with a clean golden run after.

**Delete or rewrite:**
- **Archaeology.** "Phase 2 / Phase 4.5 / WP1 / (D.3) / §2E" back-references and
  "extracted in Phase D", "the old inline block", "byte-green so…" narration.
  Nobody reading the code today needs the migration history; that's what git and
  these design docs are for. Keep a pointer only where the *ordering* is a live
  gotcha (e.g. "onConstruct draws must stay in this order — the golden pins it").
- **Restatement.** Comments that paraphrase the next line (`// clamp to 0-100`
  above a `clamp(x,0,100)`) go.
- **Stale.** Anything describing behavior that has since moved to a plugin, or
  naming a function/field that was renamed or deleted. Grep after WP-A/B for
  `instrument`/`money`/`chartSeed`/`normalizePack` in comments and fix.
- **Genre-bound narration in neutral files.** `engine.ts` comments that name
  `venue`/`songs`/`cred`/`fame` to *explain* neutral code — reword to the neutral
  concept, or cut. (State-field comments like `venue: null` are already gone;
  this is about the prose.)

**Keep (and value):**
- Real gotchas: RNG draw-order constraints, float-grouping/byte-green invariants,
  the frozen construction sequence, the single-`crown`/`state.hits` rule, why a
  hook fires at a specific ordinal.
- Intent that isn't obvious from the code: *why* a seam exists, what a subsystem
  is for, the one-sentence "what is this module."

Aim: every surviving comment is one a competent reader would thank you for. If
you're unsure, delete it — the code is right there.

---

## 3. Definition of done

- `grep -nE "\binstrument" js/engine.ts` → empty (WP-A).
- `grep -nE "'money'|\.money\b|moneyMin|moneyMax" js/engine.ts` → empty; the
  engine addresses resources only by manifest-declared role (WP-B).
- `runSummary` names no subsystem; a genre supplies its own summary fields (WP-C).
- The core files read *clean*: no Phase/WP archaeology, no restatement, no stale
  or genre-bound prose — only gotchas and intent (WP-E).
- Adding a third genre still edits **new files only** + one `registry.ts` line.
- All of §0 green; goldens byte-green except the deliberate, isolated
  re-baselines called out above.

When this lands, `engine.ts` speaks exactly one vocabulary — the engine's own —
and says only what a reader needs to hear.
