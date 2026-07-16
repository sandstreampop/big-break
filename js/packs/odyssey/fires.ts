// The Fires (loadouts) — the run-start choice is WHERE YOU SING TONIGHT.
// Each fire grants one crisp visible starting effect (`modifiers` rolls into
// the stat roll; resource grants land via the fires plugin below) plus a
// run-long deck lean its crowd's way (grill Q10).

import type { Plugin } from '../../types.js';

export const FIRES = [
  {
    id: 'kings_hall', name: 'The King’s Hall', family: 'fire', unlockedByDefault: true,
    flavor: 'They want glory. Sing the deeds loud and count the dead later.',
    // Renown 2 → 3 (pass 10; SIM-FINDINGS 'Fire → path'): the Hall's whole
    // flavor is glory, yet its kleos commit rate matched the Fisherman's
    // Hearth — 2 of the gate's 5 wasn't enough to make the Glory road feel
    // closer at the crossroads. Three of five is a visible head start.
    quirk: { name: 'A name to live up to', desc: 'Begin the telling with Renown 3 — the hall has heard of this man.' },
    grants: { renown: 3 },
  },
  {
    id: 'fishermans_hearth', name: 'The Fisherman’s Hearth', family: 'fire', unlockedByDefault: true,
    flavor: 'They want the homecoming. Every man aboard has a wife ashore.',
    quirk: { name: 'Kind seas in the telling', desc: 'Begin with Expedition 14 — at this fire, more of them live.' },
    grants: { expedition: 2 },
  },
  {
    id: 'soldiers_camp', name: 'The Soldiers’ Camp', family: 'fire', unlockedByDefault: true,
    flavor: 'They want blood and drill and the weight of a spear told right.',
    quirk: { name: 'A soldier’s Odysseus', desc: 'Tonight he is characterized strong: Might starts 8 higher.' },
    modifiers: { might: 8 },
  },
  {
    id: 'temple_steps', name: 'The Temple Steps', family: 'fire', unlockedByDefault: true,
    flavor: 'They want the gods in every wave. Give them omens; mind your rites.',
    quirk: { name: 'The goddess attends', desc: 'Begin with Athena 2 — someone here has her ear.' },
    grants: { athena: 2 },
  },
];

// Resource grants are not loadout `modifiers` (those touch stats only), so a
// tiny pack plugin applies each fire's grant at run start. No seeded draws —
// the frozen construction order is untouched.
// Each fire also leans the DECK its crowd's way: the hall wants deeds of
// legend, the hearth wants gentler seas, the camp wants blood, the steps want
// omens. Event tags carry the lean: 'kleos' (renown-y), 'deep' (the risky
// sea), 'blood' (fights), 'omen' (the gods in the weather).
const FIRE_WEIGHTS: Record<string, Partial<Record<string, number>>> = {
  kings_hall: { kleos: 1.6, deep: 1.2 },
  fishermans_hearth: { deep: 0.6 },
  soldiers_camp: { blood: 1.6 },
  temple_steps: { omen: 1.6 },
};

export const firesPlugin: Plugin = {
  id: 'odyssey_fires',
  onRunStart(state) {
    const fire = FIRES.find((f) => f.id === state.loadout);
    for (const [k, v] of Object.entries(fire?.grants ?? {})) {
      (state as any)[k] = ((state as any)[k] || 0) + v;
    }
  },
  weightDeck(state, ev, weight) {
    const lean = FIRE_WEIGHTS[state.loadout || ''];
    if (!lean) return weight;
    let w = weight;
    for (const t of ev.tags || []) {
      const m = lean[t];
      if (m) w *= m;
    }
    return w;
  },
};
