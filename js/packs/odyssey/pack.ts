// The Odyssey — a bard at a campfire retells the long way home.
//
// Third genre Pack on the genre-neutral engine. This file is ASSEMBLY ONLY
// (post-review Pass 5: the third pack is the template future authors copy, so
// the composition root knows as little as possible): the taxonomy lives in
// manifest.ts, the run-start choice in fires.ts, the fixed beats in
// itinerary.ts, the cross-telling arc in prophecy.ts, the authored sea in
// events-act1/2/3.ts + landmarks.ts, and the bard's frame in presenter.ts.
// Design record: docs/games/odyssey/grill.md (the master); vocabulary
// CONTEXT.md; voice law VOICE.md + taste.mjs + GUIDING_EXAMPLES.md; visual
// law STYLE.md. The structural spine: THE ITINERARY IS FIXED, THE VOYAGE IS
// NOT — the canonical beats live in the scheduled layer and occur every
// Telling; the deck only ever holds the sea between them.

import type { Pack } from '../../types.js';
import { odysseyManifest } from './manifest.js';
import { FIRES, firesPlugin } from './fires.js';
import { itineraryPlugin } from './itinerary.js';
import { prophecyPlugin, summarizeTelling } from './prophecy.js';
import { bardPlugin } from './bard-chatter.js';
import { ACT1_EVENTS } from './events-act1.js';
import { ACT2_EVENTS } from './events-act2.js';
import { ACT3_EVENTS } from './events-act3.js';
import { LANDMARKS } from './landmarks.js';
import { odysseyPresenter } from './presenter.js';

// ── Effect vocabulary ────────────────────────────────────────────────────
// Might / Guile / Lore: the three approaches to any confrontation — fight
// it, trick it, know the rite against it. The Expedition is men and timber
// as one dwindling thing; Athena and Poseidon are the poem's opposed gods;
// Renown is deeds of legend, tallied as performed. Declared here (the pack's
// composition root) via declaration merging, so adding the genre edits no
// shared type.
declare module '../../types.js' {
  interface Effect {
    might?: number;
    guile?: number;
    lore?: number;
    expedition?: number;
    athena?: number;
    poseidon?: number;
    renown?: number;
  }
  interface RunState {
    expedition?: number;
    athena?: number;
    poseidon?: number;
    renown?: number;
  }
}

export const odysseyPack: Pack = {
  id: 'odyssey',
  manifest: odysseyManifest,
  plugins: [firesPlugin, itineraryPlugin, prophecyPlugin, bardPlugin],
  events: [...ACT1_EVENTS, ...ACT2_EVENTS, ...ACT3_EVENTS, ...LANDMARKS],
  tutorialEvents: [],
  loadouts: FIRES,
  loadoutById: (lid) => FIRES.find((f) => f.id === lid) ?? null,
  presenter: odysseyPresenter,
  summarize: summarizeTelling,
};
