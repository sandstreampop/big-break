// Rival subsystem, extracted as a plugin (Phase 4.3). Mostly pure; its one
// construction draw (picking this run's rival) moves into onConstruct, fired
// by the engine at the exact ordinal slot the old inline draw occupied — so
// the seeded stream is unchanged and the golden holds. (rivalChartPos and the
// chart-war logic stay engine-side with the songs/charts subsystem, extracted
// in Phase 4.5.)

import { randomRival } from '../../data/rivals.js';
import type { Plugin } from '../../types.js';

export const rivalPlugin: Plugin = {
  id: 'rival',
  onConstruct(state, rng) {
    state.rival = randomRival(rng).id;
  },

  // The rival eligibility predicates (WP1): a cross-run nemesis, a specific
  // rival, and the in-run rivalry heat. Registered here so the shared Requires
  // names no rival.
  requires: {
    nemesis: (s, arg) => !arg || !!s.nemesis,
    rivalIs: (s, arg) => s.rival === arg,
    rivalryMin: (s, arg) => (s.rivalry ?? 0) >= arg,
    rivalryMax: (s, arg) => (s.rivalry ?? 0) <= arg,
  },
};
