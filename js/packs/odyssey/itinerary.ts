// The itinerary (slice 3): the fixed beats of every Telling — the structural
// spine THE ITINERARY IS FIXED, THE VOYAGE IS NOT, as a plugin. The
// producers-plugin pattern (love-island), minus the shop logic: outside its
// window a Landmark never enters the pool; when the window opens, the pool
// narrows to the Landmark's eligible variants (requires-gated — which doors
// open depends on the voyage that got you there). Resolving any variant
// closes the beat. The Suitors' Hall needs no window: it is the finale itself
// (per-path finaleCard climaxes + the finalSet three doors).
// `at` is the 0-indexed card slot where the window opens ('end' = the act's
// last draw). Order is chronological = priority. The temptations (slice 5)
// are scheduled offers, requires-gated to the runs they can actually tempt —
// an unshaken run sails past the meadow without seeing it. A temptation's
// window expires with its act (its card is act-scoped, so the roll-forward
// finds no eligible variant); a LANDMARK is never lost.

import { actLength } from '../../engine.js';
import type { GameEvent, Plugin } from '../../types.js';

const BEATS: { key: string; act: number; at: number | 'end' }[] = [
  { key: 'lotus', act: 1, at: 4 },      // the weak offer, mid-act
  { key: 'cyclops', act: 1, at: 'end' },    // the run's defining scar
  { key: 'circe', act: 2, at: 5 },      // the soft year, offered again
  { key: 'underworld', act: 2, at: 'end' }, // Tiresias
  { key: 'calypso', act: 3, at: 4 },    // the strong one
];
const beatTag = (ev: GameEvent) => (ev.tags || []).find((t) => t.startsWith('beat:'));

export const itineraryPlugin: Plugin = {
  id: 'odyssey_itinerary',
  refineDeck(state, pool) {
    const beats = pool.filter((e) => beatTag(e));
    const rest = pool.filter((e) => !beatTag(e));
    const len = actLength(state, state.act);
    for (const b of BEATS) {
      if (b.act > state.act) continue;
      if (state.flags.includes(`ody_done_${b.key}`)) continue;
      // A beat takes its declared slot ('end' = the act's last); an earlier
      // act's unfired beat is due immediately (roll-forward — a landmark is
      // delayed at worst; an expired temptation simply has no eligible card).
      const at = b.act < state.act ? 0 : (b.at === 'end' ? len - 1 : b.at);
      if ((state.cardsPlayedInAct || 0) < at) continue;
      const hit = beats.filter((e) => beatTag(e) === `beat:${b.key}`);
      if (hit.length) return hit;
    }
    return rest.length ? rest : pool;
  },
  afterResolve(state, _result, cardCtx) {
    const tag = cardCtx.ev && beatTag(cardCtx.ev);
    if (tag) {
      const flag = `ody_done_${tag.slice(5)}`;
      if (!state.flags.includes(flag)) state.flags.push(flag);
    }
  },
};
