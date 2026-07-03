// Gear (accessories) subsystem, as a music pack plugin. Owns the grantGear /
// removeGear effect verbs and the random-shelf sampling that used to live in
// the engine (gearShelf / resolveGearGrant). The pools are music content
// (accessory ids), imported directly from the data module — the core keeps no
// gear machinery. Sampling draws ctx.rng at the same ordinal the old inline
// block did, so the seeded stream is unchanged.

import { accessoryById, ACCESSORIES, gearPool } from '../../data/accessories.js';
import type { Plugin } from '../../types.js';

// Up to three fresh candidates for a shop shelf (the player picks one).
function gearShelf(state: any, grant: string, rng: () => number) {
  const owned = new Set(state.accessories);
  const ids = gearPool(grant, true);
  let pool = ids.filter((id) => !owned.has(id)).map(accessoryById).filter(Boolean);
  if (!pool.length) {
    pool = ACCESSORIES.filter((a: any) => a.unlockedByDefault && !owned.has(a.id));
  }
  const shelf: any[] = [];
  const bag = [...pool];
  while (shelf.length < 3 && bag.length) {
    shelf.push(bag.splice(Math.floor(rng() * bag.length), 1)[0]);
  }
  return shelf;
}

// Resolves 'random_basic'/'random_good' or a concrete accessory id to one the
// player doesn't already own.
function resolveGearGrant(state: any, grant: string, rng: () => number) {
  const owned = new Set(state.accessories);
  let candidates: any[];
  if (grant === 'random_basic' || grant === 'random_good') {
    const ids = gearPool(grant, false);
    candidates = ids.filter((id) => !owned.has(id)).map(accessoryById).filter(Boolean);
    if (!candidates.length) {
      candidates = ACCESSORIES.filter((a: any) => a.unlockedByDefault && !owned.has(a.id));
    }
  } else {
    const acc = accessoryById(grant);
    candidates = acc && !owned.has(acc.id) ? [acc] : [];
  }
  if (!candidates.length) return null;
  return candidates[Math.floor(rng() * candidates.length)];
}

export const gearPlugin: Plugin = {
  id: 'gear',
  effectVerbs: ['removeGear', 'grantGear'],

  onEffect(state, effects, ctx) {
    const { deltas, rng } = ctx as any;
    if (effects.removeGear) state.accessories = state.accessories.filter((a: string) => a !== effects.removeGear);
    if (effects.grantGear) {
      if (effects.grantGear === 'random_basic' || effects.grantGear === 'random_good') {
        // Shops have shelves: offer up to 3 candidates, the player chooses.
        const opts = gearShelf(state, effects.grantGear, rng);
        if (opts.length > 1) deltas.pendingGearChoices = opts;
        else if (opts.length === 1) deltas.pendingGear = opts[0];
      } else {
        const acc = resolveGearGrant(state, effects.grantGear, rng);
        if (acc) deltas.pendingGear = acc; // UI equips (or swaps) it; sim auto-equips
      }
    }
  },

  // Per-act upkeep on equipped gear (moved from the engine's startAct). Money-
  // only, no rng.
  onActBreak(state, _act, notes) {
    for (const id of state.accessories || []) {
      const acc = accessoryById(id);
      if (acc?.upkeep) {
        state.money -= acc.upkeep;
        notes.push(`${acc.name}: −$${acc.upkeep} upkeep`);
      }
    }
  },
};
