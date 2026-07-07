// Rival subsystem, as a plugin. Mostly pure; its one construction draw (picking
// this run's rival) runs in onConstruct at a fixed ordinal slot — the seeded
// stream depends on it, so the golden holds. (rivalChartPos and the chart-war
// logic live with the songs/charts subsystem.)

import { randomRival } from '../data/rivals.js';
import type { Plugin } from '../../../types.js';

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

export const rivalPlugin: Plugin = {
  id: 'rival',
  // The rival slot; onConstruct fills it with this run's rival.
  stateDefaults: { rival: null },
  onConstruct(state, rng) {
    state.rival = randomRival(rng).id;
  },

  // The rival eligibility predicates: a cross-run nemesis, a specific
  // rival, and the in-run rivalry heat. Registered here so the shared Requires
  // names no rival.
  requires: {
    nemesis: (s, arg) => !arg || !!s.nemesis,
    rivalIs: (s, arg) => s.rival === arg,
    rivalryMin: (s, arg) => (s.rivalry ?? 0) >= arg,
    rivalryMax: (s, arg) => (s.rivalry ?? 0) <= arg,
  },

  // Rivalry is a 0–10 feud meter off a default of 3 — a music-specific clamp.
  // A pack that reuses the generic rivalry resource without shipping a rival
  // gets the plain additive default.
  applyResource(res, effects, state) {
    if (res !== 'rivalry') return undefined;
    const v = (effects as any).rivalry || 0;
    if (!v) return 0;
    const before = state.rivalry ?? 3;
    state.rivalry = clamp(before + v, 0, 10);
    return state.rivalry - before;
  },
};
