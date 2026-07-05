// Love Island — the assembled deck. Families live in their own files
// (structural beats · Arrival · The Turn · Final Week + Summit-affinity ·
// the daily rhythm); this is the single list the Pack ships.
//
// v4 S2: cards are AUTHORED against the show-phase (1 Arrival · 2 The Turn ·
// 3 Final Week — the vocabulary the card files have always spoken), and this
// module remaps each card's phase to its WEEKS (manifest PHASE_WEEKS) at
// assembly, so `GameEvent.act` is in week space by the time the engine and
// the linter read it. Beat-tagged cards get one trailing week of slack: they
// only ever enter a deck through their producers window, and the window rolls
// forward a week when a chain interjection eats a tentpole's last slot — the
// slack keeps the rolled-over card act-eligible.

import { BEAT_EVENTS } from './events-beats.js';
import { ARRIVAL_EVENTS } from './events-arrival.js';
import { TURN_EVENTS } from './events-turn.js';
import { FINAL_EVENTS } from './events-final.js';
import { ENCOUNTER_EVENTS } from './events-encounters.js';
import { GOSSIP_EVENTS } from './events-gossip.js';
import { DAY_EVENTS } from './events-days.js';
import { PHASE_WEEKS, SEGMENTS } from './manifest.js';
import type { GameEvent } from '../../types.js';

const isBeat = (ev: GameEvent) => (ev.tags || []).some((t) => t.startsWith('beat:'));

// Phase(s) → weeks, sorted and deduped; beat cards gain one week of slack.
function weeksFor(phase: number | number[], slack: boolean): number[] {
  const phases = Array.isArray(phase) ? phase : [phase];
  const weeks = new Set<number>(phases.flatMap((p) => PHASE_WEEKS[p] || []));
  if (slack) {
    const last = Math.max(...weeks);
    if (last < SEGMENTS.length) weeks.add(last + 1);
  }
  return [...weeks].sort((a, b) => a - b);
}

const remap = (ev: GameEvent): GameEvent => ({ ...ev, act: weeksFor(ev.act, isBeat(ev)) });

export const LOVE_ISLAND_EVENTS: GameEvent[] = [
  ...BEAT_EVENTS,
  ...ARRIVAL_EVENTS,
  ...TURN_EVENTS,
  ...FINAL_EVENTS,
  ...ENCOUNTER_EVENTS,
  ...GOSSIP_EVENTS,
  ...DAY_EVENTS,
].map(remap);
