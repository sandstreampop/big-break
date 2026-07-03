// Scene Weather subsystem, as a music pack plugin. Weather is a run-start era
// (Vinyl Revival, Streaming Gold Rush…) that recolors the deck, bends rolls and
// jitter, tilts gains, and pays a walk-in bonus. The core names no weather: the
// plugin draws the era at run start and folds its hooks in through the neutral
// modify-hooks.
//
// The draw is in onRunStart, not onConstruct, so the era lands at a fixed
// ordinal in the seeded stream (the golden pins it).

import { rollWeather, weatherHooks } from '../../data/weather.js';
import { tagsIntersect } from '../../engine.js';
import type { Plugin } from '../../types.js';

const hooks = (state: any): Record<string, any> => weatherHooks(state);

export const weatherPlugin: Plugin = {
  id: 'weather',
  // The era slot; onRunStart draws the actual era.
  stateDefaults: { weather: null },

  // The weather eligibility predicate: a card can gate on the current era.
  requires: {
    weatherIs: (s, arg) => s.weather === arg,
  },

  // Draw the era and pay its walk-in bonus. startMoney must apply AFTER the era
  // is drawn, so both live here.
  onRunStart(state, rng) {
    state.weather = rollWeather(rng);
    state.money += hooks(state).startMoney || 0;
  },

  // Tag-matched roll bonuses for the era.
  modifyRoll(state, choice, _ctx) {
    let b = 0;
    for (const tb of hooks(state).rollTagBonus || []) {
      if (tagsIntersect(tb.tags, choice.tags)) b += tb.bonus;
    }
    return b;
  },

  // Some eras widen the roll's jitter band (applied after any contract override).
  modifyJitter(state, jitter, _ctx) {
    const w = hooks(state).jitterWiden;
    return w ? [jitter[0] - w, jitter[1] + w] : jitter;
  },

  // Stat-gain and burnout multipliers (fame/money mults live with the economy
  // plugin, which owns those resources).
  gainHooks(state) {
    const h = hooks(state);
    return { statGainMult: h.statGainMult, burnoutGainMult: h.burnoutGainMult };
  },

  // The era recolors the deck by tag.
  weightDeck(state, ev, weight) {
    let w = weight;
    for (const wm of hooks(state).weightTagMult || []) {
      if (tagsIntersect(wm.tags, ev.tags || [])) w *= wm.mult;
    }
    return w;
  },

  // The era's Legacy Points multiplier.
  scoreMult(state) {
    return hooks(state).lpMult || 1;
  },
};
