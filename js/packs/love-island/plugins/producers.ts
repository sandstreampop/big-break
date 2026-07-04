// Producers — the format's scheduler, as a plugin. The villa doesn't drift:
// production imposes the beats. This plugin queues the forced chains (the
// arrival, Casa Amor at the Act 1→2 break, the exposed Recoupling at the Act
// 2→3 break) and runs the scheduled deck windows (Bombshell arrivals, Movie
// Night, the mid-act Recoupling, Meet the Parents) through refineDeck — the
// same mechanism as the engine's shop slot, so a Text beat can never be
// skipped by a hot streak (the "anticipation lock" is delivery-by-force).
//
// A beat card carries a `beat:<key>` tag; when its window opens the pool
// narrows to that beat's eligible variants, and outside its window a beat
// card never enters the pool at all. Resolving any variant marks the beat
// done (a li_done_<key> flag).

import { islanderTypeById } from '../cast.js';
import type { Plugin } from '../../../types.js';

// The Season's scheduled windows: 0-indexed card slot within the act where
// the beat forces itself into the deal (first eligible non-shop draw at or
// after the slot). Order within an act is priority order.
const BEATS: { key: string; act: number; at: number }[] = [
  { key: 'bomb1', act: 1, at: 5 },       // late Act 1: the first Bombshell
  { key: 'bomb2', act: 2, at: 6 },       // post-Casa: the Act 2 Bombshell (rarely, the steal)
  { key: 'movienight', act: 2, at: 8 },  // the big Reveal, before anyone chooses
  { key: 'recoup1', act: 2, at: 9 },     // the girls choose (ADR-0003: R1)
  { key: 'parents', act: 3, at: 4 },     // Meet the Parents, Final Week
];

const beatTag = (ev: any) => (ev.tags || []).find((t: string) => t.startsWith('beat:'));

export const producersPlugin: Plugin = {
  id: 'producers',
  stateDefaults: { rivalMagnet: false },

  // The Season opens on the arrival Text — the first coupling is card one.
  // rivalMagnet (the Heartthrob's poaching exposure) is stamped here so the
  // coupling plugin's ceremony math stays a pure state read.
  onRunStart(state) {
    state.rivalMagnet = !!islanderTypeById(state.loadout)?.quirk?.hooks?.rivalMagnet;
    state.pendingChainId = 'li_arrival';
  },

  // Act breaks are where the structure lands (ADR-0002/0003): Casa Amor splits
  // the villa at Act 1→2; the exposed Recoupling opens Final Week. R1 is the
  // girls' ceremony, R2 the boys' — your gender decides which side of each you
  // stand on.
  onActBreak(state, act, notes) {
    if (state.tutorial) return;
    if (act === 2) {
      state.pendingChainId = 'li_casa_text';
      notes.push('🧳 Production has been quiet all morning. Production is never quiet all morning.');
    }
    if (act === 3) {
      const chooser = state.gender === 'boy'; // R2: the boys choose
      state.pendingChainId = chooser
        ? (state.partner ? 'li_recoup2_choose' : 'li_recoup2_choose_single')
        : (state.partner ? 'li_recoup2_exposed' : 'li_recoup2_exposed_single');
      notes.push(chooser
        ? '🔥 Tonight there’s a recoupling, and the boys have the power. You are the boys.'
        : '🔥 Tonight there’s a recoupling, and the boys have the power. You are not the boys.');
    }
  },

  // Beat delivery: outside its window a beat card never enters the pool; when
  // a window opens, the pool narrows to that beat's eligible variants. Shop
  // draws keep priority (the daybed already owns its slot); the beat simply
  // takes the next draw.
  refineDeck(state, pool, ctx) {
    const beats = pool.filter((e: any) => beatTag(e));
    const rest = pool.filter((e: any) => !beatTag(e));
    if (ctx.shopDue) return rest.length ? rest : pool;
    for (const b of BEATS) {
      if (b.act !== state.act) continue;
      if (state.flags.includes(`li_done_${b.key}`)) continue;
      if ((state.cardsPlayedInAct || 0) < b.at) continue;
      const hit = beats.filter((e: any) => beatTag(e) === `beat:${b.key}`);
      if (hit.length) return hit;
      break; // window open but no eligible variant — deal ambient, retry next draw
    }
    return rest.length ? rest : pool;
  },

  // Any variant resolving closes its beat's window.
  afterResolve(state, _result, cardCtx) {
    const tag = cardCtx.ev && beatTag(cardCtx.ev);
    if (tag) {
      const flag = `li_done_${tag.slice(5)}`;
      if (!state.flags.includes(flag)) state.flags.push(flag);
    }
  },
};
