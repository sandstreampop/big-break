// Band subsystem — act-break quirks. Each bandmate's per-act effect (merch
// money, morale burnout, word-of-mouth fame, or a fresh demo) runs in
// onActBreak. The "notebook" bandmate (Nadia) DRAWS the seeded RNG to name and
// grade its demo, so its position in the act-break sequence — band quirks
// BEFORE the deadline audit and chart tick — is load-bearing; the golden pins
// it.

import { bandmateById, recruitCandidate } from '../data/band.js';
import { genreById } from '../data/genres.js';
import { songName } from '../charts.js';
import { addSong } from '../songs.js';
import { stateRng, tagsIntersect } from '../../../engine.js';
import type { Plugin } from '../../../types.js';

export const bandPlugin: Plugin = {
  id: 'band',
  effectVerbs: ['grantBandmate', 'removeBandmate'],
  stateDefaults: { band: [] }, // recruited bandmates, max 3

  // The band eligibility predicates: roster size and a specific member.
  requires: {
    bandMin: (s, arg) => (s.band || []).length >= arg,
    bandMax: (s, arg) => (s.band || []).length <= arg,
    bandHas: (s, arg) => (s.band || []).includes(arg),
  },

  // Each bandmate carries a tag-matched roll bonus, folded into the roll.
  modifyRoll(state, choice, _ctx) {
    let b = 0;
    for (const bid of state.band || []) {
      const bm = bandmateById(bid);
      if (bm && tagsIntersect(bm.bonus.tags, choice.tags)) b += bm.bonus.bonus;
    }
    return b;
  },

  // Roster changes: recruit (a named bandmate or a seeded 'random' draw) and
  // depart ('first' or a named id). The 'random' recruit draws ctx.rng.
  onEffect(state, effects, ctx) {
    if (effects.grantBandmate) {
      state.band = state.band || [];
      if (state.band.length < 3) {
        const bm = effects.grantBandmate === 'random'
          ? recruitCandidate(state, (ctx as any).rng)
          : (!state.band.includes(effects.grantBandmate) ? bandmateById(effects.grantBandmate) : null);
        if (bm) {
          state.band.push(bm.id);
          (ctx as any).deltas.bandmateJoined = bm;
        }
      }
    }
    if (effects.removeBandmate) {
      state.band = state.band || [];
      if (effects.removeBandmate === 'first') {
        const gone = bandmateById(state.band[0]);
        state.band = state.band.slice(1);
        if (gone) (ctx as any).deltas.bandmateLeft = gone;
      } else {
        state.band = state.band.filter((b: string) => b !== effects.removeBandmate);
      }
    }
  },

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
