---
title: Cookbook
description: Short, copy-shaped recipes for the things you'll do most often.
---

Task-shaped answers to "how do I…". Each recipe links to the chapter with the
full story.

## Add a stat

1. Add its id to `manifest.stats` (**at the end** — order is pinned).
2. Give it a `statMeta` entry (`name` + `icon`).
3. Add it to your pack's `Effect` `declare module` block so cards can move it.
4. Use it in card outcomes and, if it should gate a summit, in `winGates`.

→ [The manifest](/big-break/docs/authoring/manifest/) ·
[Effects](/big-break/docs/authoring/effects/)

## Add a resource

1. Add its id to `manifest.resources` (at the end) and give it a `resourceMeta`
   entry.
2. Add the key to your `Effect` augmentation.
3. If it needs bespoke arithmetic, own it in a plugin's `applyResource`;
   otherwise the engine applies a generic additive default.

→ [The manifest](/big-break/docs/authoring/manifest/) ·
[Owning a resource](/big-break/docs/authoring/plugins/#owning-a-resource)

## Add a subsystem

1. Write a `Plugin` (copy `js/packs/plugins/clues.ts` as the template).
2. Declare the verbs it owns in `effectVerbs` and handle them in `onEffect`.
3. Keep its state on `state`; push `deltas` and `notes` for the UI.
4. Register it in your pack's `plugins` array with a deliberate `priority`.

→ [Subsystems (plugins)](/big-break/docs/authoring/plugins/)

## Add an effect verb

1. Add the key to your pack's `Effect` `declare module` block (compile-time).
2. Declare it in the owning plugin's `effectVerbs` and handle it in `onEffect`
   (the "no unknown verb" invariant will otherwise fail).
3. Use it in a card outcome.

→ [Effects & the open vocabulary](/big-break/docs/authoring/effects/)

## Give a genre its own perks

1. Add a `perks: Record<string, PerkDef>` to your pack.
2. Each perk supplies only the hooks/knobs it needs (`hustleMult`, `pityPerBonus`,
   `onRunStart`, …) — the engine applies them generically.
3. Pass the unlocked perk ids into `newRun(pack, persona, unlocked, rng, perks)`.

→ [Progression](/big-break/docs/authoring/progression/)

## Gate a card behind an earlier choice

1. Have the earlier outcome set a flag: `effects: { addFlag: 'signed' }`.
2. Gate the later card: `requires: { flagsAll: ['signed'] }`.
3. For a scripted follow-up, use `chainEventId` on the outcome and mark the target
   card `chainOnly`.

→ [The deck](/big-break/docs/authoring/deck/)

## Run a pack headlessly

```js
import { tracePackRun } from '../tools/pack-core.mjs';
import { yourPack } from '../dist/js/packs/yourpack.js';
import { useContentPack } from '../dist/js/engine.js';

useContentPack(yourPack);
console.log(tracePackRun(yourPack, 12345)); // deterministic from the seed
```

→ [Quickstart](/big-break/docs/quickstart/) ·
[Balance & the safety net](/big-break/docs/shipping/balance/)

## Give a new pack a golden corpus

1. The genre-agnostic driver (`tools/pack-core.mjs`) already traces any pack from
   its manifest.
2. Pin a seed corpus and a golden file the way `gen-probe-golden.mjs` does.
3. Wire the golden test into `node --test` and the `--check` gate into CI.

→ [Balance & the safety net](/big-break/docs/shipping/balance/)

## Re-baseline a golden (on purpose)

You changed seeded behavior deliberately and the golden test now fails. Confirm
the change is intended, then regenerate and **eyeball the one-line-per-run diff**:

```bash
npm run build
node tools/gen-golden.mjs          # music
node tools/gen-mystery-golden.mjs  # mystery
node tools/gen-probe-golden.mjs    # probe
```

A golden diff you didn't intend is a bug. A golden diff you did intend is a
reviewable, minimal record of exactly what your change moved.

→ [Balance & the safety net](/big-break/docs/shipping/balance/)

## Ship a new game entry

1. Add the pack to `GAME_PACKS` in the registry.
2. Add `js/yourgame-main.ts` → `boot(yourgamePack)`.
3. Add `yourgame.html` (copy `mystery.html`); the build emits `/yourgame/`.

→ [Building & shipping](/big-break/docs/shipping/build/)
