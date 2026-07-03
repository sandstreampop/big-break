// Loadout subsystem, as a music pack plugin. Owns the setInstrument effect verb
// — a card that swaps your persona mid-run (the Kazoo bit). The instrument
// roster itself is core (Pack.instruments), but the swap VERB is music's, so it
// lives here; the plugin looks the new instrument up in the data module.

import { instrumentById } from '../../data/instruments.js';
import type { Plugin } from '../../types.js';

export const loadoutPlugin: Plugin = {
  id: 'loadout',
  effectVerbs: ['setInstrument'],

  onEffect(state, effects, ctx) {
    if (!effects.setInstrument) return;
    const newInst = instrumentById(effects.setInstrument);
    if (newInst && state.instrument !== newInst.id) {
      state.instrument = newInst.id;
      state.swappedInstrument = true;
      (ctx as any).deltas.instrumentSet = newInst;
    }
  },
};
