// Clues subsystem — the mystery pack's domain plugin, the structural sibling
// of the music pack's songs plugin. It proves a second genre can add its OWN
// state and lifecycle against the same hook set: onEffect applies a
// pack-specific effect key (clues), onActBreak narrates the investigation, and
// the sleuth summit gates on state.clues via the engine's generic gateValue
// reader — no engine changes.

import type { Plugin } from '../../types.js';

export const cluesPlugin: Plugin = {
  id: 'clues',
  effectVerbs: ['clues'],

  onEffect(state, effects, ctx) {
    const gained = effects.clues || 0;
    if (gained) {
      state.clues = (state.clues || 0) + gained;
      // record the delta so the trace/UI shows it (same shape as resources)
      ctx.deltas?.push({ key: 'clues', amount: gained });
    }
  },

  onActBreak(state, _act, notes) {
    const n = state.clues || 0;
    if (n > 0) notes.push(`🔎 Your notebook holds ${n} clue${n === 1 ? '' : 's'}. The pattern is starting to show.`);
  },
};
