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

// Exported for the frieze's horizon (I4): geography is fate — the band shows
// a landmark LOOMING two-three cards before its window opens, because the
// distance is knowable from this table. (The gods stay surprises.)
export const BEATS: { key: string; act: number; at: number | 'end'; landmark?: boolean }[] = [
  { key: 'lotus', act: 1, at: 4 },      // the weak offer, mid-act
  { key: 'cyclops', act: 1, at: 'end', landmark: true },    // the run's defining scar
  { key: 'circe', act: 2, at: 5 },      // the soft year, offered again
  { key: 'underworld', act: 2, at: 'end', landmark: true }, // Tiresias
  { key: 'calypso', act: 3, at: 4 },    // the strong one
];
const beatTag = (ev: GameEvent) => (ev.tags || []).find((t) => t.startsWith('beat:'));

export const itineraryPlugin: Plugin = {
  id: 'odyssey_itinerary',
  // The Memory Law's deck gate (pass 22): a card may require that the
  // PREVIOUS telling ended a certain way (run.history, newest last). Lives
  // HERE, not on the bard plugin — the bard is removable flavor (its test
  // pins trace-identity without it), while the itinerary already shapes the
  // deck. The predicate refuses shared water (daily/Gauntlet — the P18 law:
  // a shared seed forks on nothing personal), and accepts either a bare
  // endingKey ('wrath'), several ('circe'/'calypso' as an array), or a
  // key:result compound ('nostos:success' — the homecoming card must not
  // congratulate a shortfall).
  requires: {
    lastEnding: (state, arg) => {
      if (state.daily || state.gauntlet) return false;
      const rows = state.history || [];
      const last = rows[rows.length - 1];
      if (!last?.endingKey) return false;
      // The one-voice law (pass 25): when the bard's-note cold open already
      // confessed this ending, the fire's question stands down — one
      // surface owns last night.
      if ((state.noteCovers || []).includes(last.endingKey)) return false;
      const hit = (want: string) => {
        const [key, res] = String(want).split(':');
        return last.endingKey === key && (!res || last.result === res);
      };
      return Array.isArray(arg) ? arg.some(hit) : hit(arg);
    },
  },
  // The fire does not mumble: while a memory card is eligible it draws at
  // four times deck weight, so "the fire brings it up" is usually true
  // within the act. Never eligible in sims/goldens, so seeded runs are
  // untouched.
  weightDeck(state, ev, weight) {
    return ev.id.startsWith('ody_mem_') ? weight * 4 : weight;
  },
  refineDeck(state, pool) {
    const beats = pool.filter((e) => beatTag(e));
    const rest = pool.filter((e) => !beatTag(e));
    const len = actLength(state, state.act);
    // Collect every due beat, then deal the LATEST-due one. (Chronological
    // first-due priority shipped a real defect the Pass 6 telemetry sweep
    // caught at 2-in-1,000 runs: a temptation whose `requires` flip late —
    // lotus needs burnout ≥ 18, sometimes first true at the act's last slot —
    // was due in the Landmark's protected end slot and displaced it; the
    // act-scoped landmark card then couldn't roll forward, so the Cyclops
    // was LOST and the crossroads posed its name-question before the cave.
    // Latest-due wins: the landmark keeps its slot ('end' is always the
    // act's maximum), and the late temptation expires with its act, exactly
    // as an unaccepted offer should. Pinned by test/odyssey-entropy.test.mjs
    // (occurrence ≥ runs-that-reach-the-window) and INCIDENTS #3.
    const due: { at: number; landmark: boolean; hit: GameEvent[] }[] = [];
    for (const b of BEATS) {
      if (b.act > state.act) continue;
      if (state.flags.includes(`ody_done_${b.key}`)) continue;
      // A beat takes its declared slot ('end' = the act's last); an earlier
      // act's unfired beat is due immediately (roll-forward — a landmark is
      // delayed at worst; an expired temptation simply has no eligible card).
      const at = b.act < state.act ? 0 : (b.at === 'end' ? len - 1 : b.at);
      if ((state.cardsPlayedInAct || 0) < at) continue;
      const hit = beats.filter((e) => beatTag(e) === `beat:${b.key}`);
      if (hit.length) due.push({ at, landmark: !!b.landmark, hit });
    }
    if (due.length) {
      // Latest-due first; a LANDMARK outranks a temptation on a tied slot
      // (structural, not numeric — under today's act lengths 'end' always
      // strictly exceeds every temptation slot, but that must not be the
      // only thing keeping the itinerary contract true). Stable sort: full
      // ties keep chronological order.
      due.sort((a, b) => (b.at - a.at) || (Number(b.landmark) - Number(a.landmark)));
      return due[0].hit;
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
