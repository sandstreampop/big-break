---
title: "Progression: perks, interstitials, tutorial"
description: Pack-declared run modifiers — always-on perks, burnout interstitials, and the scripted onboarding run.
---

Three optional capabilities let your genre shape a run without touching the
engine: **perks** (always-on modifiers), **interstitials** (burnout-triggered
interruptions), and a **tutorial start** (the scripted first run). All are
pack-declared — the engine bends its own dials generically instead of branching
on your ids.

## Perks

A [`PerkDef`](/big-break/docs/reference/types/interfaces/perkdef/) is an always-on
run modifier. Crucially, the *dials* it turns (pity, encore cap, gear retention,
burnout healing, income) are **engine** mechanics — so a second genre's perks
bend the same knobs; only the ids and the arithmetic are yours.

```ts twoslash
interface RunState { money: number; flags: string[]; [k: string]: any; }
interface PerkDef {
  onRunStart?(state: RunState): void;
  onActBreak?(state: RunState, notes: string[]): void;
  pityPerBonus?: number;      // adds to the per-bad pity step
  pityCapBonus?: number;      // raises the pity ceiling
  encoreCapBonus?: number;    // banks more encores
  keepGearOnBad?: boolean;    // gear survives a Bad outcome
  burnoutHealMult?: number;   // scales burnout RELIEF
  hustleMult?: number;        // scales per-act income
}
// ---cut---
const perks: Record<string, PerkDef> = {
  hustler: { hustleMult: 1.25 },                 // 25% more income per act
  resilient: { pityPerBonus: 3, pityCapBonus: 6 }, // bad luck breaks sooner
  seedMoney: { onRunStart: (s) => { s.money += 50; } },
};
```

The engine sums and applies each hook at the matching lifecycle point. A perk
supplies only the knobs it needs.

## Interstitials

An [`InterstitialRule`](/big-break/docs/reference/types/interfaces/interstitialrule/)
interrupts the deck once per run when the attrition stat crosses a bar — a forced
chain card, so your genre can stage a "you're burning out" beat. The engine knows
only the generic burnout threshold; the id and any extra condition are yours.

```ts twoslash
interface RunState { flags: string[]; [k: string]: any; }
interface InterstitialRule {
  id: string;                       // the chainOnly card to queue
  burnoutMin: number;               // fires at burnout ≥ this
  belowFail?: boolean;              // only while still below the fail threshold
  cond?: (state: RunState) => boolean; // extra pack-owned condition
}
// ---cut---
const interstitials: InterstitialRule[] = [
  { id: 'the_wall', burnoutMin: 60, belowFail: true },
  { id: 'the_spiral', burnoutMin: 85, belowFail: true,
    cond: (s) => s.flags.includes('alone') },
];
```

The card each rule names is an ordinary `chainOnly` event in your deck — see
[Chains](/big-break/docs/authoring/deck/#chains).

## The tutorial start

[`TutorialStart`](/big-break/docs/reference/types/interfaces/tutorialstart/) fixes
the scripted onboarding run's setup — the teaching persona and starting stats —
so the first run is authored, not random. Pair it with `tutorialEvents` (cards
that live outside the normal deck) and `forceTier` on those cards to guarantee a
teaching outcome.

```ts twoslash
interface TutorialStart {
  loadout: string;
  stats: Record<string, number>;
  resources?: Record<string, number>;
}
// ---cut---
const tutorialStart: TutorialStart = {
  loadout: 'detective',
  stats: { insight: 30, nerve: 20 },
  resources: { money: 40 },
};
```

## All optional

A genre can ship none of these — the probe does. Add them when your game wants
meta-progression, a burnout narrative, or a guided first run. Each is just
another field on your [`Pack`](/big-break/docs/concepts/pack/).

Next: [The presenter](/big-break/docs/authoring/presenter/) — how a genre owns
its endings and flavor.
