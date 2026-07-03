// The music pack's magnitude resources — fame, money, pathProgress — as a
// plugin. These are the "how big" meters (the summits gate on fame; money buys
// gear; pathProgress is momentum toward the finale clutch). Their bespoke apply
// arithmetic — fame clamps at 0 and honors the loadout's fame-swing; money
// multiplies by the loadout/weather/contract and siphons through gear;
// pathProgress is a raw add. The core resource loop names no resource: it
// dispatches to applyResource, else applies a plain additive default. Music
// opts into these semantics here; a pack that just wants an additive counter
// (the probe's 'points') declares nothing and gets the default.

import { contractById } from '../../data/contracts.js';
import { weatherHooks } from '../../data/weather.js';
import { equippedActive } from '../../data/accessories.js';
import type { Plugin } from '../../types.js';

export const economyPlugin: Plugin = {
  id: 'economy',

  // The economy eligibility predicates: fame and money are music resources, so
  // their gates live with the pack, not the shared Requires. (Cards author
  // `fameMin`/`moneyMin`; a generic pack would use the neutral `min: { fame: n }`
  // instead.)
  requires: {
    fameMin: (s, arg) => (s.fame ?? 0) >= arg,
    fameMax: (s, arg) => (s.fame ?? 0) <= arg,
    moneyMin: (s, arg) => (s.money ?? 0) >= arg,
    moneyMax: (s, arg) => (s.money ?? 0) <= arg,
  },

  // Applied at each resource's ordinal slot in the engine's manifest-ordered
  // loop; the delta order is load-bearing (the golden pins it). Multiplier
  // sources are read straight from the data modules (loadout quirk via
  // ctx.hooks, contract/weather here), exactly as the venue plugin reads its
  // own data — no PACK indirection.
  applyResource(res, effects, state, ctx) {
    const hooks = (ctx as any).hooks || {};
    const cMods: Record<string, any> = contractById(state.contract)?.mods || {};
    const wHooks = weatherHooks(state);
    if (res === 'fame') {
      let v = (effects as any).fame || 0;
      if (v && hooks.fameSwingMult) v = Math.round(v * hooks.fameSwingMult);
      if (v > 0 && cMods.fameGainMult) v = Math.round(v * cMods.fameGainMult);
      if (v > 0 && wHooks.fameGainMult) v = Math.round(v * wHooks.fameGainMult);
      if (!v) return 0;
      const before = state.fame;
      state.fame = Math.max(0, state.fame + v);
      return state.fame - before;
    }
    if (res === 'money') {
      let v = (effects as any).money || 0;
      if (v > 0) {
        if (hooks.moneyGainMult) v = Math.round(v * hooks.moneyGainMult);
        if (wHooks.moneyGainMult) v = Math.round(v * wHooks.moneyGainMult);
        if (cMods.moneyGainMult) v = Math.round(v * cMods.moneyGainMult);
        for (const acc of equippedActive(state)) {
          if (acc.moneySiphon) v = Math.round(v * (1 - acc.moneySiphon));
        }
      }
      if (!v) return 0;
      state.money += v;
      return v;
    }
    if (res === 'pathProgress') {
      const v = (effects as any).pathProgress || 0;
      if (!v) return 0;
      state.pathProgress += v;
      return v;
    }
    return undefined; // not ours — decline
  },
};
