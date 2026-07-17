// The Odyssey — the owl's edge (pass 40, the balance sweep's one new
// mechanism). The evidence: the odyssey shipped NO roll-bonus subsystem —
// music has gear, love-island has Angles, the odyssey's "other bonuses"
// probe read 0.00 flat — so the deck's best-written material (the
// incredible tiers) fired on ~2% of cards, against love-island's ~11%.
// The engine's bar (CONFIG.tierIncredibleAt 80) was structurally out of
// reach for this pack's stat scale.
//
// The in-genre fix is the poem's own engine: the grey-eyed one backs
// clever men. Athena's favor above a devotion floor adds to every roll —
// +1 per point past 3, capped at +8 — so a pious, well-run telling can
// actually reach the verses the fire waits for, and the risk tell (the
// odds readout folds plugin bonuses in automatically) shows her hand on
// the numbers the moment she attends.
//
// Balance: sized WITH the pass's gate counterweights and verified by the
// 6000-run sweep — see the pass 40 commit for the before/after table.

import type { Plugin, RunState } from '../../types.js';

export function owlEdge(state: RunState): number {
  return Math.min(Math.max(Math.round(Number(state.athena) || 0) - 4, 0), 8);
}

export const owlPlugin: Plugin = {
  id: 'odyssey_owl',
  modifyRoll: (state) => owlEdge(state),
};
