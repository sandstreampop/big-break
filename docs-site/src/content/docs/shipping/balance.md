---
title: Balance & the safety net
description: How to know your game is winnable, losable, and fun — and the tests that keep it that way while you keep editing.
---

Every run in Big Break is driven by a seed: the same seed always produces the
same run. That one property turns balancing from vibes into measurement — you
can play your game thousands of times in a second, get the same numbers twice,
and know that a change in the numbers means *your content* changed.

## Build first

Every tool below reads the built output, so always:

```bash
npm run build
```

## Is it balanced? Simulate it

The simulator plays thousands of seeded runs of your game and reports the
distribution — how often players win, how long runs last, which endings come
up, which cards never get seen:

```bash
node tools/simulate-pack.mjs my-game 3000
```

Declare the win rate you're aiming for in your manifest and the same tool
becomes a pass/fail check:

```ts
balanceBand: { successMin: 25, successMax: 40 },
```

```bash
node tools/simulate-pack.mjs my-game --check
```

`--check` fails if your success rate leaves the band, if any act's deck runs
dry, or if an ungated card is never drawn across thousands of runs. (A *gated*
card that can never appear — an unsatisfiable gate, a flag nothing sets — is
the content linter's job; see below.) These aren't warnings: they fail the
build, so a balance regression can't quietly ship.

For the richer, human-readable picture, the one-page report combines contract
issues, deck counts, vocabulary usage, and the simulation:

```bash
node tools/pack-report.mjs my-game
```

## Is the writing clean? Lint it

```bash
node tools/lint-content.mjs
```

The content linter audits the deck itself: stranded cards, impossible
`requires` gates, style slips, duplicate ids. It's the fastest of the checks —
run it early and often.

## Does it actually play? Smoke it

```bash
node test/ui/smoke.mjs
```

This boots your real game in a headless browser and swipes it all the way to
an ending. It's the one check the simulators can't replace: it catches the
bug where everything computes correctly but the game can't be *finished* on a
real screen — a broken ending, an overlay that won't dismiss.

## Locking in behavior while you refactor

Once your game feels right, you can pin its behavior: record what a fixed set
of seeds produces today, and let the test suite flag any future change to
those runs. The repo does this for its shipping games, and your pack can opt
in with a few lines (the seeded driver already works for any pack — see the
generator scripts in `tools/`).

The payoff is confidence in *unrelated* edits: rewrite a card's prose, retune
a gate, restructure your files — if the pinned runs still match, you provably
changed only what you meant to. If the check fails after a change you *meant*
to make (a rebalance), you regenerate the recorded runs and review the diff:
it reads as a one-line-per-run summary of exactly what your change moved.

## The pre-ship ritual

Before publishing a balance or content change:

```bash
npm run build
node tools/lint-content.mjs
node tools/simulate-pack.mjs my-game --check
node --test test/*.test.mjs
node test/ui/smoke.mjs
```

Publishing runs the same checks again automatically — a red check blocks the
deploy — so this ritual is about *your* feedback loop, not about protecting
production. See [Building & shipping](/big-break/docs/shipping/build/).

## Judging feel

Checks keep a game *correct*; they can't tell you it's *fun*. For that, read
the simulator's narrative report — it plays like a human following the story,
not like an optimizer:

```bash
node tools/simulate-pack.mjs my-game 4000
```

Watch run length, the ending mix, and how often each path gets picked. Tune
your `winGates` and card numbers against it, re-run `--check`, and play a run
yourself before you call it done.
