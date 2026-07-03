// Hustle subsystem, as a music pack plugin. Hustles are persistent side-income
// sources (dog-walking, session work…) that pay out at every act break and
// once more at the finale. Extracted from the engine so the core names no
// hustle: the plugin pays the income at act break and owns the grantHustle verb.

import { hustleById } from '../../data/hustles.js';
import type { Plugin } from '../../types.js';

export const hustlePlugin: Plugin = {
  id: 'hustle',
  effectVerbs: ['grantHustle'],

  // The hustle eligibility predicate (WP1): a card can gate on how many income
  // sources the run has picked up.
  requires: {
    hustleMin: (s, arg) => (s.hustles || []).length >= arg,
  },

  // Pick up a persistent income source (WP4). Moved from the engine's inline
  // block; no rng.
  onEffect(state, effects, ctx) {
    if (!effects.grantHustle) return;
    state.hustles = state.hustles || [];
    if (!state.hustles.includes(effects.grantHustle)) {
      state.hustles.push(effects.grantHustle);
      (ctx as any).deltas.hustleGained = hustleById(effects.grantHustle);
    }
  },
};
