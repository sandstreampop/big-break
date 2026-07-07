// Contract subsystem, as a music pack plugin. A signed contract (The Deadline,
// Overnight Success, Analog Only…) bends the run through a bag of mods: shorter
// acts, tag-matched roll bonuses, a jitter override, gain/heal multipliers, a
// Legacy Points multiplier, a disabled Encore, a release deadline. The core
// names no contract — every clause folds in through a neutral hook.

import { contractById } from '../data/contracts.js';
import { tagsIntersect } from '../../../engine.js';
import type { Plugin } from '../../../types.js';

const mods = (state: any): Record<string, any> => contractById(state.contract)?.mods || {};

// Sign a contract at run setup: record it, apply its walk-in money and any
// armed flag (The Handshake Loan's debt). Exported for the UI driver.
export function signContract(state: any, contractId: string) {
  state.contract = contractId;
  const m = mods(state);
  if (m.startMoney !== undefined) state.money = m.startMoney;
  if (m.startFlag && !state.flags.includes(m.startFlag)) state.flags.push(m.startFlag);
}

export const contractPlugin: Plugin = {
  id: 'contract',
  stateDefaults: { contract: null }, // signed contract id

  // Tag-matched roll bonuses (Stage Fright, Analog Only…), summed into the roll.
  modifyRoll(state, choice, _ctx) {
    let b = 0;
    for (const tb of mods(state).rollTagBonus || []) {
      if (tagsIntersect(tb.tags, choice.tags)) b += tb.bonus;
    }
    return b;
  },

  // A contract can OVERRIDE the jitter band outright — it takes precedence over
  // the loadout's.
  modifyJitter(state, jitter, _ctx) {
    return mods(state).jitter || jitter;
  },

  // Overnight Success shortens an act.
  modifyActLength(state, act, base) {
    return mods(state).actLengths?.[act] ?? base;
  },

  // The label deal's Legacy Points multiplier.
  scoreMult(state) {
    return contractById(state.contract)?.lpMult || 1;
  },

  // Stat-gain and burnout multipliers, applied by the engine's effect loops
  // right after the loadout's own.
  gainHooks(state) {
    const m = mods(state);
    return { statGainMult: m.statGainMult, burnoutGainMult: m.burnoutGainMult, burnoutHealMult: m.burnoutHealMult };
  },

  // Some contracts forbid the Encore.
  blocksEncore(state) {
    return !!mods(state).disableEncore;
  },
};
