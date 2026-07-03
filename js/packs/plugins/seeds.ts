// Story Seeds subsystem, as a music pack plugin. Each run roots for a couple of
// hidden story arcs: an unlit arc's SETUP card is dealt on schedule and draws
// warm; once lit, its PAYOFF cards draw hot. A dud seed re-rolls at the
// Crossroads. Extracted from the engine so the core names no arc — the plugin
// draws the seeds, biases the deck (weightDeck), forces the setup slot
// (refineDeck), and refreshes at act 2 (onActBreak), all reading its arc data
// directly and evaluating arc-lit conditions through the engine's requiresOk.

import { ARCS, arcById, rollSeeds } from '../../data/arcs.js';
import { CONFIG } from '../../config.js';
import { requiresOk, findEvent, actMatches, stateRng } from '../../engine.js';
import type { Plugin } from '../../types.js';

// Is a seeded arc's lit-condition satisfied? Exported for tools/simulate.mjs's
// seeds-lit reporting (it used to call engine.arcLit).
export function arcLit(state: any, arcId: string): boolean {
  const arc = arcById(arcId);
  return !!arc && requiresOk(arc.lit, state);
}

// A dud seed re-rolls at the Crossroads: if an arc can no longer light (setups
// spent or act-1-only and gone), swap it for one that still can.
function refresh(state: any) {
  if (!(state.seeds || []).length) return;
  const rng = stateRng(state);
  const alive = (arc: any) =>
    requiresOk(arc.lit, state) ||
    arc.setup.some((id: string) => {
      const ev = findEvent(id);
      return ev && !state.usedEvents.includes(id) && actMatches(ev, 2);
    });
  const taken = new Set(state.seeds);
  state.seeds = state.seeds.map((arcId: string) => {
    const arc = arcById(arcId);
    if (arc && alive(arc)) return arcId;
    const pool = ARCS.filter((a: any) => !taken.has(a.id) && alive(a));
    if (!pool.length) return arcId;
    const pick = pool[Math.floor(rng() * pool.length)].id;
    taken.add(pick);
    return pick;
  });
}

export const seedsPlugin: Plugin = {
  id: 'seeds',

  // Draw this run's story seeds. Fired at the onConstruct slot right after the
  // rival draw — the ordinal the old inline rollSeeds sat, so the seeded stream
  // is unchanged.
  onConstruct(state, rng) {
    state.seeds = rollSeeds(rng, CONFIG.seedCount);
  },

  // Re-roll dud seeds at the Crossroads (act 2 start).
  onActBreak(state, act) {
    if (act === 2) refresh(state);
  },

  // The scheduled setup slot: an unlit arc's setup card is forced into the pool,
  // acts 1–2 only, unless a shop was already forced this draw.
  refineDeck(state, pool, ctx) {
    if (ctx.shopDue || state.tutorial || state.act > 2) return pool;
    if (state.cardsPlayedInAct < (CONFIG.seedSetupSlot[state.act] ?? 99)) return pool;
    const due: string[] = [];
    for (const arcId of state.seeds || []) {
      const arc = arcById(arcId);
      if (!arc || requiresOk(arc.lit, state)) continue; // already lit
      if (arc.setup.some((id: string) => state.usedEvents.includes(id))) continue; // setup came & went
      due.push(...arc.setup);
    }
    if (due.length) {
      const setups = pool.filter((e) => due.includes(e.id));
      if (setups.length) return setups;
    }
    return pool;
  },

  // Lit arcs' payoffs draw hot; unlit arcs' setups draw warm. Applied in the
  // same order as the old inline block (payoff mult before setup mult).
  weightDeck(state, ev, weight) {
    let lit = false, warm = false;
    for (const arcId of state.seeds || []) {
      const arc = arcById(arcId);
      if (!arc) continue;
      if (requiresOk(arc.lit, state)) { if (arc.payoffs.includes(ev.id)) lit = true; }
      else if (arc.setup.includes(ev.id)) warm = true;
    }
    let w = weight;
    if (lit) w *= CONFIG.seedPayoffMult;
    if (warm) w *= CONFIG.seedSetupMult;
    return w;
  },
};
