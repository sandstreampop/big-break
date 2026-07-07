// Music's unlock pools: which instruments and contracts a save has available.
// Moved out of js/save.ts so the shared persistence layer imports no music data
// — it reads the generic wall-unlock helper (context.wallUnlocks) plus music's
// own instrument catalog and its starter contracts.

import { INSTRUMENTS } from './data/instruments.js';
import { wallUnlocks } from '../../ui/context.js';

// The instruments available to pick: the default set plus any Career-Wall
// unlocks.
export function musicUnlockedInstrumentIds(meta: any): string[] {
  const fromWall = new Set(wallUnlocks(meta, 'instrument'));
  return INSTRUMENTS.filter((i) => i.unlockedByDefault || fromWall.has(i.id)).map((i) => i.id);
}

// The contracts available to sign: the two starters (after a first finished
// run) plus any Career-Wall unlocks.
export function musicUnlockedContractIds(meta: any): string[] {
  if (meta.runs < 1) return []; // contracts appear after your first finished run
  return ['nepo_baby', 'straight_edge', ...wallUnlocks(meta, 'contract')];
}
