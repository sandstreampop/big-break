// Loadout subsystem, as a music pack plugin. Owns the setInstrument effect verb
// — a card that swaps your persona mid-run (the Kazoo bit). The loadout roster
// itself is core (Pack.loadouts), but the swap VERB is music's, so it lives
// here; the plugin looks the new loadout up in the data module.

import { instrumentById } from '../../data/instruments.js';
import type { Plugin } from '../../types.js';

export const loadoutPlugin: Plugin = {
  id: 'loadout',
  effectVerbs: ['setInstrument'],

  onEffect(state, effects, ctx) {
    if (!effects.setInstrument) return;
    const next = instrumentById(effects.setInstrument);
    if (next && state.loadout !== next.id) {
      state.loadout = next.id;
      state.swappedLoadout = true;
      (ctx as any).deltas.loadoutSet = next;
    }
  },
};
