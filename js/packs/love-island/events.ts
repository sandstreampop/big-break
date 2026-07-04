// Love Island — the assembled deck. Families live in their own files
// (structural beats · Arrival · The Turn · Final Week + Summit-affinity);
// this is the single list the Pack ships.

import { BEAT_EVENTS } from './events-beats.js';
import { ARRIVAL_EVENTS } from './events-arrival.js';
import { TURN_EVENTS } from './events-turn.js';
import { FINAL_EVENTS } from './events-final.js';
import type { GameEvent } from '../../types.js';

export const LOVE_ISLAND_EVENTS: GameEvent[] = [
  ...BEAT_EVENTS,
  ...ARRIVAL_EVENTS,
  ...TURN_EVENTS,
  ...FINAL_EVENTS,
];
