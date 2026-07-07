// Story Seeds (Reach & Rush §2 R1): the arc registry.
//
// Every run secretly roots for CONFIG.seedCount of these arcs. A seeded
// arc's setup card gets a guaranteed draw window (like the shop slot);
// once the arc is "lit" (its flag/condition holds), its payoff cards draw
// at CONFIG.seedPayoffMult weight. Compound odds without seeds were ~2%
// per arc per run — whole authored storylines effectively didn't exist.
//
// Authoring rule (M3): every new multi-card arc MUST register here, or
// the content lint fails. `lit` uses the same schema as event `requires`
// (flagsAll / anyOf / hustleMin / bandMin / ...), evaluated by the engine.

export const ARCS = [
  {
    id: 'shed', name: 'The Shed',
    setup: ['a2_shed_offer'],
    lit: { flagsAll: ['home_studio'] },
    payoffs: ['a2_shed_nights', 'a3_shed_album', 'a3_shed_doc', 'a3_shed_collab', 'a3_shed_someone'],
  },
  {
    id: 'docu', name: 'The Documentary',
    setup: ['a1_docu_pitch', 'a1_camcorder'],
    lit: { flagsAll: ['docu_crew'] },
    payoffs: ['a2_docu_moment', 'a3_docu_gold', 'a3_docu_dirt'],
  },
  {
    id: 'bloom', name: 'Static Bloom',
    setup: ['a1_bloom_amp'],
    lit: { anyOf: [{ flagsAll: ['helped_bloom'] }, { flagsAll: ['snubbed_bloom'] }] },
    payoffs: ['a3_bloom_return', 'a3_bloom_cold', 'a3_bloom_festival'],
  },
  {
    id: 'someone', name: 'Someone',
    setup: ['sm_meet'],
    lit: { flagsAll: ['someone'] },
    payoffs: ['sm_birthday', 'sm_question', 'a3_dedication', 'a3_shed_someone'],
  },
  {
    id: 'superfan', name: 'Row Zero',
    setup: ['a1_first_fan'],
    lit: { flagsAll: ['superfan'] },
    payoffs: ['a2_fan_account', 'a3_fan_tattoo', 'a3_fan_wars'],
  },
  {
    id: 'collab', name: 'The Collab',
    setup: ['cl_dm'],
    lit: { anyOf: [{ flagsAll: ['collab'] }, { flagsAll: ['collab_declined'] }] },
    payoffs: ['cl_reprise', 'cl_regret'],
  },
  {
    id: 'tv', name: 'The Couch',
    setup: ['a2_tv_scout'],
    lit: { flagsAll: ['tv_booked'] },
    payoffs: ['a3_tv_taping'],
  },
  {
    id: 'door', name: 'The Unfinished Song',
    setup: ['a1_fragment', 'a1_laundromat'],
    lit: { flagsAll: ['song_fragment'] },
    payoffs: ['a2_song_grows', 'a3_song_finale', 'a3_song_regret'],
  },
  {
    id: 'prodigy', name: 'The Prodigy',
    setup: ['a1_prodigy_kid'],
    lit: { anyOf: [{ flagsAll: ['prodigy_boost'] }, { flagsAll: ['prodigy_snub'] }] },
    payoffs: ['a2_prodigy_blowup', 'a2_prodigy_ghost', 'a3_prodigy_stage', 'a3_prodigy_mirror'],
  },
  {
    id: 'heirloom', name: 'The Heirloom',
    setup: ['a1_heirloom'],
    lit: { anyOf: [{ flagsAll: ['pawned_heirloom'] }, { flagsAll: ['kept_heirloom'] }, { flagsAll: ['heirloom_back'] }, { flagsAll: ['heirloom_gone'] }] },
    payoffs: ['a2_heirloom_call', 'a3_heirloom_home', 'a3_heirloom_glass'],
  },
  {
    id: 'hustle', name: 'The Portfolio',
    setup: ['a1_busk', 'a1_clips', 'a1_music_store', 'a1_battle', 'a2_jingle'],
    lit: { hustleMin: 1 },
    payoffs: ['a2_hustle_audit', 'a3_hustle_profile'],
  },
  {
    id: 'band', name: 'The Band',
    setup: ['a1_first_bandmate', 'a2_auditions', 'a2_stranded_player', 'a2_nadia_meet'],
    lit: { bandMin: 1 },
    payoffs: ['a2_woodshed', 'a3_band_ultimatum', 'bs_ludo_parade', 'bs_greta_archive',
      'bs_saul_clause', 'bs_fish_van', 'bs_tanya_empire', 'bs_pearl_checkin',
      'a3_nadia_spotlight', 'a3_nadia_deepcut'],
  },
];

// Wave 3 (the doubling): twelve more arcs, authored in events2.js.
import { NEW_ARCS } from './events2.js';
ARCS.push(...NEW_ARCS);

export function arcById(id) {
  return ARCS.find((a) => a.id === id) || null;
}

// Roll the run's hidden seeds (distinct arcs, uniform over the table)
export function rollSeeds(rng, count = 2) {
  const bag = [...ARCS];
  const picks = [];
  while (picks.length < count && bag.length) {
    picks.push(bag.splice(Math.floor(rng() * bag.length), 1)[0].id);
  }
  return picks;
}
