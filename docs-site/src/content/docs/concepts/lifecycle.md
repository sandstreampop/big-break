---
title: The run lifecycle
description: What the engine does between the first draw and the finale — and what's deliberately fixed.
---

Before you author anything, it helps to know the shape of a run — because that
shape is the part you **don't** control. Your pack supplies the world; the
engine supplies the arc. Everything you author (stats, cards, subsystems) plugs
into fixed points in this lifecycle.

## The arc, end to end

A run is an ordered, **linear list of segments** — your manifest's `segments`
(call them acts, weeks, legs; the word is your genre's) — with an optional
**crossroads** at a segment boundary, then a judged **finale** after the last.
Within a segment, the loop is always the same: draw a card, swipe left or
right, roll to a tier, apply the outcome, repeat until the segment is spent.

Every shipped pack currently declares the classic three-act shape:

```
newRun ──▶ ACT 1 ──▶ crossroads ──▶ ACT 2 ──▶ ACT 3 ──▶ finale
             │        (commit a       │         │         │
        draw─┤         summit)   draw─┤    draw─┤    evaluate
       swipe─┤                  swipe─┤   swipe─┤    winGates
       roll ─┤                  roll ─┤   roll ─┤    → success /
       apply─┘                  apply─┘   apply─┘      partial /
                                                       failure
```

Each segment declares its own card `length` in the manifest (the shipped packs
run **8 / 12 / 8**), though a contract or a once-per-run "act twist" can bend a
leg a couple of cards shorter or longer.

## 1. Run start

`newRun(pack, personaId, unlockedPacks, rng, perks)` seeds a fresh
[`RunState`](/big-break/docs/reference/types/interfaces/runstate/): core stats
roll in a small band, the attrition stat (`burnout`) starts at 0, and the chosen
persona's modifiers apply. Then, in order:

- each **plugin**'s `onConstruct` fires — this is where seeded draws happen
  (the music pack rolls its weather and rival here), so the pack fixes the draw
  order;
- **perks** apply their run-start bumps;
- each plugin's `onRunStart` fires (the songs plugin mints its starting demo here).

:::note[Seeded and resume-safe]
Every run carries a `seed` and a draw counter, so it replays byte-identically
after a tab death — and two players on the same daily seed get the same run.
A seed is a run: share one and someone else replays it exactly, and any trace
you print in a test today is the same trace tomorrow.
:::

## 2. Draw

`drawNextCard(state, rng)` assembles the eligible deck and weights it. A card is
eligible if its `act` matches, its `requires` gate passes against current state,
and — once a summit is committed — the deck leans toward cards whose
`pathAffinity` matches (a `pathWeightMult` boost). A few slots are *forced*: a
shop/opportunity card at a fixed slot per act, and story-seed setup cards, so
those beats reliably appear. Cards you've never seen get a novelty boost.

If the deck runs dry, the act simply ends early.

## 3. Swipe and roll

The player swipes a [`Choice`](/big-break/docs/reference/types/interfaces/choice/)
left or right. `resolveSwipe` computes a roll and buckets it into one of exactly
three tiers:

```ts twoslash
type Tier = 'bad' | 'good' | 'incredible';
```

The roll is a transparent sum (see `config.ts`):

```
roll = rollBase + aptitude·aptitudeScale + gear + quirks + pity
       − burnout·burnoutCoeff + jitter
```

- **`bad`** when `roll < 30`, **`incredible`** at `roll ≥ 80`, **`good`**
  otherwise. Incredible is an *event*, not a default — and its positive payloads
  are multiplied (`incrediblePayloadMult`).
- **Pity**: each consecutive `bad` adds a stacking roll bonus (a bad-luck brake),
  up to a cap.
- **Encore**: rolling an `incredible` banks a token; the player can arm one on a
  later card for a flat roll bonus — spend the hot streak when it counts.
- **Burnout** drags the roll down, so grinding without rest gets riskier.

The tiers, the swipe, and this roll shape are **fixed**. What each tier *does* —
the `Effect` payloads — is entirely yours.

## 4. Apply the outcome

The chosen tier's [`Outcome`](/big-break/docs/reference/types/interfaces/outcome/)
carries an [`Effect`](/big-break/docs/reference/types/interfaces/effect/), applied
in a fixed order so deltas (and any RNG a subsystem consumes) stay reproducible:

1. plugins' `modifyEffects` may adjust the payload (e.g. a home-venue bonus);
2. **stat** deltas apply in `manifest.stats` order;
3. **resource** deltas apply in `manifest.resources` order — each resource keeps
   its own arithmetic, and a plugin may *own* one via `applyResource`;
4. plugins' `onEffect` handle their own verbs (e.g. song writes);
5. flags, chains, and promises resolve;
6. passive **act wear** adds a little burnout per card in later acts.

## 5. Advance, act breaks, and the crossroads

`advance(state)` steps the run forward along the manifest's segment list. When
a segment ends it runs the **act break**: hustle/upkeep income, perks'
`onActBreak`, and plugins' `onActBreak` (the songs plugin runs a chart week
here). A segment flagged `crossroads` instead pauses the run at the
**crossroads**, where `commitPath(state, pathId)` locks in the summit you'll be
judged against and opens the next segment.

Throughout, **fail states** can end a run early: the attrition stat maxing out,
a pack-relevant stat bottoming out from act 2, or debt. These thresholds live in
`config.ts`.

## 6. The finale

`evaluateFinale(state)` judges the committed summit against its `winGates`:

- **Success** — every gate met.
- **Partial** — not every gate met, but the average satisfaction clears
  `partialRatio`.
- **Failure** — below that.
- **Momentum clutch** — a near-miss where *every* gate is close and path
  progress is high upgrades a Partial to Success.

Then `legacyPoints(state)` scores the run and `runSummary(state)` produces the
record your [presenter](/big-break/docs/authoring/presenter/) turns into an
ending screen.

## What's fixed, on purpose

Big Break is a **segmented swipe-roguelike SDK**, not a universal game kit.
These are baked in and not configurable:

- a *linear* segment list — no branching act graph;
- three outcome tiers (`bad` / `good` / `incredible`);
- the binary left/right swipe;
- the roll → tier → effect resolution model;
- a single attrition stat (the `burnout` slot).

Everything else — your segment count and lengths, stats, resources, summits,
cards, verbs, subsystems, progression, and flavor — is yours. If your game fits
this arc, you'll add it by writing new files. If it needs a branching structure
or a different core loop, this isn't the engine for it, and that's the honest
boundary.

Next: [The Pack contract](/big-break/docs/concepts/pack/) — the object that
carries all of the above.
