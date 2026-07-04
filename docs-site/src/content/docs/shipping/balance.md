---
title: Balance & the safety net
description: Deterministic sims, --check gates, golden masters, cross-pack invariants, the content linter, and the UI smoke test.
---

The engine's superpower is that a run is a **seed**: fully reproducible. That
turns balance and regression from vibes into machinery. This chapter is the net
the shipping games use — and the one you should build for your genre, because a
seeded engine makes it cheap.

## Build before you test

Tools and tests import the **emitted `dist/`**, not the TypeScript source — so
what's tested is what ships. Always build first:

```bash
npm ci        # pinned TypeScript 5.7.3 (the golden oracle is emit-sensitive)
npm run build # tsc → dist/
```

`npm run check` runs the whole net except the golden tests; run those with
`node --test`.

## The five layers

### 1. Deterministic simulation with `--check` gates

Each genre has a headless simulator that plays thousands of seeded runs and
asserts on the distribution — success rate in a target band, no never-drawn
cards, every summit winnable. These are hard gates: they fail the build.

```bash
node tools/simulate.mjs --check      # music balance/reach gates
```

The music gates, for example: success 25–40%, zero never-drawn ungated cards, a
story-seed funnel ≥ 65%, and a guard that the songs win-path still works. Your
pack should assert the equivalent for its own summits.

### 2. Golden masters

A golden master pins **seeded runtime behavior**: a fixed corpus of seeds, each
producing a one-line-per-run trace. A diff means seeded behavior changed — a bug
unless you meant it. The shipping corpus is 72 music traces plus the
zero-subsystem probe.

```bash
node --test test/*.test.mjs   # golden masters + invariants
```

When you *intend* a behavior change, re-baseline deliberately and eyeball the
diff:

```bash
node tools/gen-golden.mjs          # music
node tools/gen-probe-golden.mjs    # the zero-subsystem probe
```

The genre-agnostic driver in `tools/pack-core.mjs` traces *any* pack from its
manifest, so a new genre gets a golden corpus with almost no new code.

### 3. Cross-pack invariants

`test/invariants.test.mjs` guards the bug class per-pack goldens are blind to: a
core that quietly behaves differently per genre. It sweeps every registered pack
and asserts genre-neutral properties — including the **"no unknown verb"**
invariant (every card's effect keys are owned by a stat, resource, core key, or
plugin — see [Effects](/big-break/docs/authoring/effects/)).

### 4. The content linter

```bash
node tools/lint-content.mjs
```

A template/style/gating audit over the decks — it catches unsatisfiable
`requires` gates, stranded cards, and style slips before they reach players.

### 5. The headless UI smoke test

```bash
node test/ui-smoke.mjs   # drives each game to its finale in headless Chromium
```

This is the only coverage the goldens don't have: it boots the real UI shell,
swipes each game to its finale, and asserts it doesn't crash — exactly the
presenter path that a missing ending would break.

## The pre-push ritual

Before pushing a balance or content change, run the full net:

```bash
npm run build
node tools/lint-content.mjs \
  && node tools/simulate.mjs --check \
  && node --test \
  && node test/ui-smoke.mjs
```

This is exactly what CI gates the deploy on — see
[Building & shipping](/big-break/docs/shipping/build/).

## Judging feel

Gates keep a genre *correct*; they don't tell you if it's *fun*. For that, read
the Monte-Carlo narrative report — it models a human following the story:

```bash
node tools/simulate.mjs 4000 narrative
```

Tune `winGates` and `config.ts` knobs against this, then re-run the `--check`
gate and the golden test to confirm you changed only what you meant to.
