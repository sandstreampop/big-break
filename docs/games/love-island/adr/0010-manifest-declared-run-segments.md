# Manifest-declared run segments: the engine stops counting to three (v4 S1)

Session 1 of the v4 build (`../V4-BUILD-CHARTER.md`). The v4 plan turns a
love-island run into a longer season built from short "weeks" — but the run
structure was the last genre assumption baked into the generic core:
`advance()` hardcoded a 3-act ladder (act 1 → crossroads, act 2 → act 3,
act 3 → finale), `commitPath()` hardcoded `startAct(2)`, and the act lengths
lived in the shared `CONFIG.actLengths` table. Before the villa can declare
"N weeks", the engine has to stop knowing what an act is.

## Decision

The run's macro shape is **data, declared per pack**: the manifest gains a
required `segments: SegmentDef[]` — an ordered, **linear** list the engine
walks front to back (no branching graph; YAGNI, per the charter).

```ts
export interface SegmentDef {
  length: number;       // cards this segment runs (before twists/plugin overrides)
  crossroads?: boolean; // ends at the commit slot (phase 'crossroads')
}
```

- `state.act` stays the 1-indexed position in the list — saves, card logs,
  per-act CONFIG tables, `fromAct` fail-state gates, and plugin `onActBreak`
  hooks all keep their meaning unchanged.
- A segment flagged `crossroads` ends at the commit slot; `commitPath()` now
  starts `state.act + 1` instead of a hardcoded 2.
- The **last segment is always terminal**: it queues the committed path's
  climax card (so chains/interstitials can never displace it), then ends in
  the finale. No flag needed — terminality is position, not data.
- `actLength()` reads `segments[act - 1].length` (then plugin
  `modifyActLength` and the act twist, exactly as before);
  `CONFIG.actLengths` is deleted. Lengths are the genre's SHAPE, so they
  moved from the shared config to the manifests.
- The act-twist draw generalizes to `randInt(rng, 2, segments.length)` — for
  a 3-segment pack that is bit-for-bit the old `randInt(rng, 2, 3)`.
- `pathEligible`'s pre-commit guard changes from `act === 1` to
  `!state.path` — the honest generic meaning of "pre-commit" (identical
  behavior today, since a path only exists after the crossroads).
- The shared content linter iterates the manifest's segments instead of a
  literal `[1, 2, 3]`; the UI's post-commit interstitial reads `run.act`
  instead of a literal 2.

All three packs (music, love-island, probe) re-express their current shape
verbatim — `[{ length: 8, crossroads: true }, { length: 12 }, { length: 8 }]`
— so the refactor ships **nothing player-visible**.

## What stays per-act CONFIG (deliberately)

`shopSlot`, `jitterByAct`, `actWear`, and `seedSetupSlot` remain numeric
tuning tables keyed by act index. They are feel, not shape, and every lookup
degrades safely for a hypothetical act 4+ (no forced shop, base jitter, zero
wear). Session 2 decides whether the week structure needs them per-segment;
plugins already have the hooks (`modifyJitter`, `modifyBurnout`,
`refineDeck`) if it does.

## The proof it's pure

The charter's tripwire: if any pack's goldens move, the refactor is a bug.
Verified two ways — the full golden suites pass unchanged, and regenerating
all three corpora (`gen-golden`, `gen-li-golden`, `gen-probe-golden`)
produces **byte-identical files** (`git status` clean). RNG draw order,
delta order, and every trace are untouched. The full gate (build,
lint-content, simulate --check, node --test, ui-smoke, ui-crowding,
ui-mobile-matrix, docs-site build) is green, plus a live headless drive of
both games through commit → segment transitions → finale.

## Consequences

- Session 2 declares the villa season as N weeks **in the manifest only** —
  a love-island data change plus its own deliberate golden re-baseline; the
  engine is done.
- The docs' honest boundary shifts: "three acts with one crossroads" was
  baked in; now the baked-in part is "a linear segment list" (docs-site
  lifecycle/manifest pages updated).
- The engine names no act count anywhere; the probe/invariants suite guards
  that this stays true.
