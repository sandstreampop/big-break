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
import { owlPlugin } from './owl.js';
import { odysseyComeback, odysseyModesPlugin } from './modes.js';
import { ACT1_EVENTS } from './events-act1.js';
import { ACT2_EVENTS } from './events-act2.js';
import { ACT3_EVENTS } from './events-act3.js';
import { LANDMARKS } from './landmarks.js';
import { ODYSSEY_TUTORIAL_EVENTS } from './events-tutorial.js';
import { MEMORY_EVENTS } from './events-memory.js';
import { TELEMACHY_EVENTS } from './events-telemachy.js';
import { SCARRED_EVENTS } from './events-scarred.js';
import { odysseyPresenter } from './presenter.js';
import { ODYSSEY_PERKS } from './gifts.js';

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
    // The one-voice law (pass 25): the ending classes tonight's stamped
    // bard's-note confesses — same-ending memory surfaces stand down.
    noteCovers?: string[];
  }
  interface Requires {
    // The Memory Law's deck gate (pass 22, owned by odyssey_bard): the
    // previous telling's endingKey (or one of several). Refuses shared water.
    lastEnding?: string | string[];
  }
}

export const odysseyPack: Pack = {
  id: 'odyssey',
  manifest: odysseyManifest,
  // odysseyModesPlugin carries no onConstruct/onRunStart/stateDefaults, so
  // appending it changes no seeded draw — goldens byte-identical.
  // owlPlugin (pass 40): Athena's favor as a roll edge — the pack's one
  // roll-bonus subsystem. It changes seeded rolls, so its landing came
  // with a deliberate golden re-baseline and the sweep's counterweights.
  plugins: [firesPlugin, itineraryPlugin, prophecyPlugin, owlPlugin, bardPlugin, odysseyModesPlugin],
  // MEMORY_EVENTS last: history-gated (the fire remembers), invisible to
  // sims/goldens by construction (history is never stamped there).
  // TELEMACHY_EVENTS: the within-run thread (pass 34) — flag-gated
  // continuations, dealt at 4x by the itinerary plugin once the thread
  // starts, so a question asked in act 1 usually gets its act-3 answer.
  // SCARRED_EVENTS: comeback-gated (pass 48) — the transform's flag never
  // exists in seeded sim runs, so these are golden-invisible like MEMORY.
  events: [...ACT1_EVENTS, ...ACT2_EVENTS, ...ACT3_EVENTS, ...TELEMACHY_EVENTS, ...SCARRED_EVENTS, ...LANDMARKS, ...MEMORY_EVENTS],
  // THE FIRST TELLING: the 3-card oar ramp (gesture → risk tell + frieze →
  // a real roll with the two ledgers). The bard's own chatter waits for the
  // first real telling (bardBeat's tutorial gate).
  tutorialEvents: ODYSSEY_TUTORIAL_EVENTS,
  // Teaching stats: all three approaches read live; the third card's real
  // roll lands good more often than not. Expedition rides the manifest's
  // twelve-ship start.
  tutorialStart: {
    loadout: 'fishermans_hearth',
    stats: { might: 32, guile: 26, lore: 30, burnout: 6 },
  },
  loadouts: FIRES,
  loadoutById: (lid) => FIRES.find((f) => f.id === lid) ?? null,
  // The Guest-Gifts (pass 17): the engine's generic perk table — purchased on
  // the wall (presenter.wallItems), applied by id at newRun.
  perks: ODYSSEY_PERKS,
  presenter: odysseyPresenter,
  // The Scarred Telling (pass 7): unlocked by any full homecoming.
  comeback: odysseyComeback,
  summarize: summarizeTelling,
};
