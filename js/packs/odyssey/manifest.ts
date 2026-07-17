// The Odyssey pack's MANIFEST — the genre taxonomy. This is what makes the
// telling the telling: its stats, resources, run shape, paths, gates, and HUD
// metadata. The engine reads whichever manifest is injected; the SHAPE is the
// genre. Vocabulary: docs/games/odyssey/CONTEXT.md; design record grill.md.

import type { PackManifest } from '../../types.js';

export const odysseyManifest: PackManifest = {
  stats: ['might', 'guile', 'lore'],
  resources: ['expedition', 'athena', 'poseidon', 'renown'],
  // Tonight's telling: three acts + finale, ~28 cards (music-length). The
  // Crossroads sits at the Act I → II boundary — immediately after the
  // Cyclops (slice 3 lands the landmark itself in that slot), because that
  // beat poses the question in play: slip away as Nobody, or shout your name.
  segments: [
    { length: 9, crossroads: true },
    { length: 10 },
    { length: 9 },
  ],
  paths: {
    nostos: {
      id: 'nostos',
      name: 'Nostos — the Homecoming',
      blurb: 'Bring them home. Every man, every hull you can hold together, and the sea left unprovoked.',
      gateLabel: 'Expedition 6 · Athena 4',
      icon: '⛵',
    },
    kleos: {
      id: 'kleos',
      name: 'Kleos — the Glory',
      blurb: 'Let the return take ten years, so long as the songs last ten centuries.',
      gateLabel: 'Renown 8',
      icon: '🌟',
    },
  },
  // Nostos leans on the Expedition preserved and the goddess earned; Kleos
  // leans on the Renown counter. ("Poseidon contained" is enforced by the
  // wrath terminal rule below — winGates are minimums by contract.)
  // Kleos raised 5 → 8 (pass 21, the P9–P20 evidence sweep): at 5, committed
  // glory runs summited 66.6% with partial+failure at 0.6% — the finale was
  // ratifying the commit, and two authored endings almost never rendered.
  // Renown must now be EARNED past the commit, not just carried over it.
  // Kleos raised again 8 → 9 (pass 40 sweep): committed glory runs were
  // summiting at 71.5% against the homecoming's 54.8% — the short life
  // was the SAFER bet, which inverts the fiction. And nostos athena 4 → 5
  // (same sweep): the owl's edge (owl.ts) makes her favor mechanically
  // valuable every card, so the homecoming's devotion gate keeps pace.
  winGates: {
    nostos: { expedition: 6, athena: 5 },
    kleos: { renown: 9 },
  },
  statMeta: {
    might: { name: 'Might', icon: '⚔️' },
    guile: { name: 'Guile', icon: '🪢' },
    lore: { name: 'Lore', icon: '📜' },
    // The engine's burnout slot, reskinned: Odysseus weeping on beaches is
    // canon. When it fills, the Telling ends on a beach, quietly.
    burnout: { name: 'Despair', icon: '🌫️' },
  },
  resourceMeta: {
    expedition: { name: 'Expedition', icon: '⛵' },
    athena: { name: 'Athena', icon: '🦉' },
    poseidon: { name: 'Poseidon', icon: '🔱' },
    renown: { name: 'Renown', icon: '🌟' },
  },
  // Twelve ships out of Troy. Low Expedition is not death — it closes doors.
  resourceStart: { expedition: 12 },
  // Athena tips the final scale in the poem itself: the finale clutch.
  momentumResource: 'athena',
  // Legendary rolls make legend.
  incredibleResources: ['renown'],
  // No shop this version: boons come from the voyage, not commerce
  // (costResource deliberately unset — the probe proves the slot optional).
  // Deeds sung tonight are the bard's repertoire tomorrow.
  lpResources: ['renown'],
  // The ways a telling ends early (after Despair, the universal burnout
  // fail): the sea takes you at maximum wrath, and the three banked tellings
  // — a temptation accepted sets its flag, and the flag IS the rule. (These
  // were failStates with an always-true `poseidon >= -999` comparison until
  // the 2026-07 review called the encoding what it was; terminalRules is the
  // honest shape.)
  terminalRules: [
    { when: { key: 'poseidon', cmp: '>=', value: 10 }, ending: 'wrath' },
    { when: { flag: 'ody_stayed_lotus' }, ending: 'lotus' },
    { when: { flag: 'ody_stayed_circe' }, ending: 'circe' },
    { when: { flag: 'ody_stayed_calypso' }, ending: 'calypso' },
  ],
  // The grill's band: 35–50% standard win for a reasonable build.
  balanceBand: { successMin: 35, successMax: 50 },
};
