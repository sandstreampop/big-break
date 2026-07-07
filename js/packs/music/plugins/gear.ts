// Gear (accessories) subsystem, as a music pack plugin. Owns the grantGear /
// removeGear effect verbs and the random-shelf sampling (gearShelf /
// resolveGearGrant). The pools are music content (accessory ids), imported
// directly from the data module — the core keeps no gear machinery. Sampling
// draws ctx.rng, so its position in the seeded stream is load-bearing.

import { accessoryById, ACCESSORIES, gearPool, accessoryActive, equippedActive } from '../data/accessories.js';
import { applyEffects, tagsIntersect, perkFlag } from '../../../engine.js';
import { CONFIG } from '../../../config.js';
import type { Plugin } from '../../../types.js';

// Equip an accessory (after any UI slot decision). Fires onAcquire effects
// through the engine's applyEffects. Exported for the UI/sim drivers.
export function equipAccessory(state: any, accId: string, replaceId: string | null = null) {
  if (replaceId) state.accessories = state.accessories.filter((a: string) => a !== replaceId);
  if (state.accessories.length >= CONFIG.accessorySlots) return null;
  state.accessories.push(accId);
  const acc = accessoryById(accId);
  const deltas: any = [];
  if (acc?.grantsFlag && !state.flags.includes(acc.grantsFlag)) state.flags.push(acc.grantsFlag);
  if (acc?.onAcquire) {
    const d = applyEffects(state, acc.onAcquire, null, null, Math.random);
    deltas.push(...d);
  }
  return deltas;
}

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
  stateDefaults: { accessories: [] }, // equipped gear

  // Equipped, active gear adds tag-matched roll bonuses (and counter-tag
  // penalties); the accessories whose modifier fires are recorded on
  // ctx.applied for lose-on-bad and burnout side effects. Pure (no rng, no state
  // mutation) — the risk-tell calls this too.
  modifyRoll(state, choice, ctx) {
    let bonus = 0;
    for (const acc of equippedActive(state)) {
      if (acc.modifier && (acc.appliesTo?.includes('*') || tagsIntersect(acc.appliesTo, choice.tags))) {
        bonus += acc.modifier;
        ctx.applied.push(acc);
      }
      for (const ct of acc.counterTags || []) {
        if (tagsIntersect(ct.tags, choice.tags)) bonus += ct.modifier;
      }
    }
    return bonus;
  },

  // Gear's burnout adjustments: tag-matched multipliers on a positive delta,
  // plus per-match side effects from the gear that fired this card.
  modifyBurnout(state, v, ctx) {
    if (v > 0) {
      for (const acc of equippedActive(state)) {
        if (acc.burnoutTagMult && tagsIntersect(acc.burnoutTagMult.tags, ctx.tags)) v *= acc.burnoutTagMult.mult;
      }
    }
    for (const acc of ctx.appliedAccessories || []) {
      if (acc.sideEffect?.burnoutPerMatch) v += acc.sideEffect.burnoutPerMatch;
    }
    return v;
  },

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

  // Lose-on-bad: an applied item flagged loseOnBad is dropped when the card
  // goes Bad, unless a perk keeps gear bolted down. Reads the accessories whose
  // bonus fired this card off cardCtx.applied (exposed generically by the core);
  // this used to be hardwired in the engine's resolveSwipe.
  afterResolve(state, result, ctx) {
    if (ctx.tier !== 'bad' || perkFlag(state, 'keepGearOnBad')) return;
    for (const acc of ctx.applied || []) {
      if (acc.loseOnBad && state.accessories.includes(acc.id)) {
        state.accessories = state.accessories.filter((a: string) => a !== acc.id);
        result.gearLost = acc;
      }
    }
  },

  // Per-act upkeep on equipped gear. Money-only, no rng.
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
