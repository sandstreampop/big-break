// Shared bootstrap for the Love Island unit suites. `fresh` (a villa run for a
// seed/persona) and `apply` (effects through the real engine dispatch) were
// copy-pasted across six li-*.test.mjs files; this is the single source.
//
// Not a *.test.mjs file on purpose: it exports helpers, it doesn't register
// tests, so `node --test test/*.test.mjs` runs the suites, not this.

import * as engine from '../dist/js/engine.js';
import { loveIslandPack } from '../dist/js/packs/love-island/pack.js';

export { engine, loveIslandPack };

// A fresh villa run. state.seed is bumped off the bootstrap seed (the copies
// all did `seed + 2`) so a later stateRng() draw doesn't replay newRun's.
export function fresh(seed = 7, persona = 'retriever_girl') {
  const state = engine.newRun(loveIslandPack, persona, [], engine.mulberry32(seed), []);
  state.seed = seed + 2;
  return state;
}

// Apply effects through the engine's real applyEffects dispatch (default tier
// 'good', no card/choice). Callers that need a choice or tier pass them.
export function apply(state, effects, seed = 99, choice = null, tier = 'good') {
  return engine.applyEffects(state, effects, null, choice, engine.mulberry32(seed), tier);
}
