// The Odyssey — a bard at a campfire retells the long way home.
//
// Third genre Pack on the genre-neutral engine, composed here: manifest,
// the four Fires (loadouts + the fires plugin), the itinerary plugin (the
// fixed beats), the authored sea (events-act1/2/3), the Landmarks, and the
// bard's presenter. Design record: docs/games/odyssey/grill.md (the master);
// vocabulary CONTEXT.md; voice law VOICE.md + taste.mjs + GUIDING_EXAMPLES.md;
// visual law STYLE.md. The structural spine: THE ITINERARY IS FIXED, THE
// VOYAGE IS NOT — the canonical beats live in the scheduled layer and occur
// every Telling; the deck only ever holds the sea between them.

import { actLength } from '../../engine.js';
import type { Pack, PackManifest, GameEvent, Plugin } from '../../types.js';
import { ACT1_EVENTS } from './events-act1.js';
import { ACT2_EVENTS } from './events-act2.js';
import { ACT3_EVENTS } from './events-act3.js';
import { LANDMARKS } from './landmarks.js';
import { odysseyPresenter } from './presenter.js';

// ── Effect vocabulary ────────────────────────────────────────────────────
// Might / Guile / Lore: the three approaches to any confrontation — fight
// it, trick it, know the rite against it. The Expedition is men and timber
// as one dwindling thing; Athena and Poseidon are the poem's opposed gods;
// Renown is deeds of legend, tallied as performed.
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


// ── 2. The manifest ──────────────────────────────────────────────────────
const manifest: PackManifest = {
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
      gateLabel: 'Renown 5',
      icon: '🌟',
    },
  },
  // Nostos leans on the Expedition preserved and the goddess earned; Kleos
  // leans on the Renown counter. ("Poseidon contained" is enforced by the
  // wrath fail state below — winGates are minimums by contract.)
  winGates: {
    nostos: { expedition: 6, athena: 4 },
    kleos: { renown: 5 },
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
  // The sea takes you: Poseidon's wrath at maximum is the second fail state
  // (Despair, the universal burnout fail, is the first).
  // The sea takes you (wrath at maximum) — and the three banked tellings:
  // a temptation's choice sets a flag, the rule reads it (the always-true
  // numeric is the LI li_dumped_single shape — the flag is the trigger).
  failStates: [
    { key: 'poseidon', cmp: '>=', value: 10, ending: 'wrath' },
    { key: 'poseidon', cmp: '>=', value: -999, flag: 'ody_stayed_lotus', ending: 'lotus' },
    { key: 'poseidon', cmp: '>=', value: -999, flag: 'ody_stayed_circe', ending: 'circe' },
    { key: 'poseidon', cmp: '>=', value: -999, flag: 'ody_stayed_calypso', ending: 'calypso' },
  ],
  // The grill's band: 35–50% standard win for a reasonable build.
  balanceBand: { successMin: 35, successMax: 50 },
};

// ── 3. The Fires (loadouts) ──────────────────────────────────────────────
// The run-start choice is WHERE YOU SING TONIGHT. Each fire grants one crisp
// visible starting effect (`modifiers` rolls into the stat roll; resource
// grants land via the fires plugin below) — run-long deck weights join in
// slice 4 with the authored sea.
const FIRES = [
  {
    id: 'kings_hall', name: 'The King’s Hall', family: 'fire', unlockedByDefault: true,
    flavor: 'They want glory. Sing the deeds loud and count the dead later.',
    quirk: { name: 'A name to live up to', desc: 'Begin the telling with Renown 2 — the hall has heard of this man.' },
    grants: { renown: 2 },
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
// Each fire also leans the DECK its crowd's way (grill Q10: one crisp
// starting effect + run-long deck weights): the hall wants deeds of legend,
// the hearth wants gentler seas, the camp wants blood, the steps want omens.
// Event tags carry the lean: 'kleos' (renown-y), 'deep' (the risky sea),
// 'blood' (fights), 'omen' (the gods in the weather).
const FIRE_WEIGHTS: Record<string, Partial<Record<string, number>>> = {
  kings_hall: { kleos: 1.6, deep: 1.2 },
  fishermans_hearth: { deep: 0.6 },
  soldiers_camp: { blood: 1.6 },
  temple_steps: { omen: 1.6 },
};

const firesPlugin: Plugin = {
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

// ── 3b. The itinerary (slice 3): the fixed beats of every Telling ────────
// The producers-plugin pattern (love-island), minus the shop logic: outside
// its window a Landmark never enters the pool; when the window opens, the
// pool narrows to the Landmark's eligible variants (requires-gated — which
// doors open depends on the voyage that got you there). Resolving any
// variant closes the beat. The Suitors' Hall needs no window: it is the
// finale itself (per-path finaleCard climaxes + the finalSet three doors).
// `at` is the 0-indexed card slot where the window opens ('end' = the act's
// last draw). Order is chronological = priority. The temptations (slice 5)
// are scheduled offers, requires-gated to the runs they can actually tempt —
// an unshaken run sails past the meadow without seeing it. A temptation's
// window expires with its act (its card is act-scoped, so the roll-forward
// finds no eligible variant); a LANDMARK is never lost.
const BEATS: { key: string; act: number; at: number | 'end' }[] = [
  { key: 'lotus', act: 1, at: 4 },      // the weak offer, mid-act
  { key: 'cyclops', act: 1, at: 'end' },    // the run's defining scar
  { key: 'circe', act: 2, at: 5 },      // the soft year, offered again
  { key: 'underworld', act: 2, at: 'end' }, // Tiresias
  { key: 'calypso', act: 3, at: 4 },    // the strong one
];
const beatTag = (ev: GameEvent) => (ev.tags || []).find((t) => t.startsWith('beat:'));

const itineraryPlugin: Plugin = {
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

// ── The pack ─────────────────────────────────────────────────────────────
export const odysseyPack: Pack = {
  id: 'odyssey',
  manifest,
  plugins: [firesPlugin, itineraryPlugin],
  events: [...ACT1_EVENTS, ...ACT2_EVENTS, ...ACT3_EVENTS, ...LANDMARKS],
  tutorialEvents: [],
  loadouts: FIRES,
  loadoutById: (lid) => FIRES.find((f) => f.id === lid) ?? null,
  presenter: odysseyPresenter,
};
