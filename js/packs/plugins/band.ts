// Band subsystem — act-break quirks, extracted as a plugin (Phase 4.4). Each
// bandmate's per-act effect (merch money, morale burnout, word-of-mouth fame,
// or a fresh demo) runs in onActBreak, dispatched at the exact point the old
// inline loop occupied. The "notebook" bandmate (Nadia) DRAWS the seeded RNG
// to name and grade its demo, so its position in the act-break sequence — band
// quirks BEFORE the deadline audit and chart tick — is load-bearing; the
// golden pins it. (The passive roll-time band bonus and grant/remove effects
// stay engine-side for now; this is the act-break-quirk extraction.)

import { bandmateById } from '../../data/band.js';
import { genreById } from '../../data/genres.js';
import { songName } from '../../charts.js';
import { addSong, stateRng } from '../../engine.js';
import type { Plugin } from '../../types.js';

export const bandPlugin: Plugin = {
  id: 'band',
  onActBreak(state, _act, notes) {
    for (const bid of state.band || []) {
      const bm = bandmateById(bid);
      if (bm?.actQuirk?.money) {
        state.money += bm.actQuirk.money;
        notes.push(`${bm.icon} ${bm.name}: +$${bm.actQuirk.money} merch`);
      }
      if (bm?.actQuirk?.burnout) {
        const before = state.stats.burnout;
        state.stats.burnout = Math.max(0, before + bm.actQuirk.burnout);
        if (state.stats.burnout !== before) notes.push(`${bm.icon} ${bm.name}: ${bm.actQuirk.burnout} Burnout`);
      }
      if (bm?.actQuirk?.fame) {
        state.fame += bm.actQuirk.fame;
        notes.push(`${bm.icon} ${bm.name}: +${bm.actQuirk.fame} Fame (word travels)`);
      }
      if (bm?.actQuirk?.demo) {
        // Nadia's notebook: a fresh "spare" appears every act break (draws RNG)
        const rng = stateRng(state);
        const s = addSong(state, {
          title: songName(rng, genreById(state.genre)), status: 'demo',
          quality: 42 + Math.round(rng() * 26),
        });
        notes.push(`${bm.icon} ${bm.name}: leaves a demo on your amp — “${s.title}”`);
      }
    }
  },
};
