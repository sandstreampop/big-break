// Hustle subsystem, as a music pack plugin. Hustles are persistent side-income
// sources (dog-walking, session work…) that pay out at every act break and
// once more at the finale. The core names no hustle: the plugin pays the income
// at act break and owns the grantHustle verb.

import { hustleById } from '../../data/hustles.js';
import { weatherHooks } from '../../data/weather.js';
import { MUSIC_PERKS } from '../music-perks.js';
import type { Plugin } from '../../types.js';

// Pay every hustle once (an act break, or the finale). Income scales by the
// era's hustleMult and the cheap_rent perk's hustleMult — sources this plugin
// reads directly (weather data + the music perk table). No rng.
function payHustles(state: any, notes: string[]) {
  const perkMult = (state.perks || []).reduce((m: number, id: string) => m * (MUSIC_PERKS[id]?.hustleMult ?? 1), 1);
  const weatherMult = weatherHooks(state).hustleMult || 1;
  for (const id of state.hustles || []) {
    const h = hustleById(id);
    if (h) {
      const pay = Math.round(h.moneyPerAct * weatherMult * perkMult);
      state.money += pay;
      notes.push(`${h.icon} ${h.name}: +$${pay}`);
    }
  }
}

export const hustlePlugin: Plugin = {
  id: 'hustle',
  effectVerbs: ['grantHustle'],
  stateDefaults: { hustles: [] }, // persistent income sources

  // The hustle eligibility predicate: a card can gate on how many income
  // sources the run has picked up.
  requires: {
    hustleMin: (s, arg) => (s.hustles || []).length >= arg,
  },

  // Pick up a persistent income source. No rng.
  onEffect(state, effects, ctx) {
    if (!effects.grantHustle) return;
    state.hustles = state.hustles || [];
    if (!state.hustles.includes(effects.grantHustle)) {
      state.hustles.push(effects.grantHustle);
      (ctx as any).deltas.hustleGained = hustleById(effects.grantHustle);
    }
  },

  // Income at every act break, and one last time at the finale. Money-only and
  // rng-free, so its position among the act-break/finale plugins doesn't matter.
  onActBreak(state, _act, notes) {
    payHustles(state, notes);
  },
  onFinale(state) {
    payHustles(state, []);
  },
};
