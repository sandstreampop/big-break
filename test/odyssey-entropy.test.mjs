// Landmark variant-entropy floor (2026-07 odyssey review, product risk #2 —
// P-B half 1). The review's sharpest sentence: the tests prove the Cyclops
// OCCURS, not that the fifth Cyclops is interesting. This suite makes the
// measured variation an executable invariant: 1,000 seeded runs, the same
// deterministic driver the goldens pin, and floors on what a player actually
// sees at each scheduled beat.
//
// The floors pin TODAY'S measured reality (see docs/games/odyssey/
// SIM-FINDINGS.md): they catch REGRESSION (losing a variant, a gate rotting
// shut), not aspiration. When P-B half 2 authors more variants post-playtest,
// raise the floors deliberately in the same commit.
//
// Run: npm run build && node --test test/odyssey-entropy.test.mjs

import test from 'node:test';
import assert from 'node:assert/strict';
import * as engine from '../dist/js/engine.js';
import { odysseyPack } from '../dist/js/packs/odyssey/pack.js';
import { simulatePackRun, entropyOf } from './../tools/pack-core.mjs';

const RUNS = 1000;
const SEED = 0xE47;

const beatOf = (ev) => (ev.tags || []).find((t) => t.startsWith('beat:'))?.slice(5) || null;
const eventById = new Map(odysseyPack.events.map((e) => [e.id, e]));

// One sweep, fresh bard: which variant each beat dealt, per run.
function sweep() {
  const seedGen = engine.mulberry32(SEED);
  const nextSeed = () => Math.floor(seedGen() * 1e9) + 1;
  const beatSeen = {};        // beat → { variantId: count }
  const beatRuns = {};        // beat → runs in which it occurred
  const reachedAct = { 2: 0, 3: 0 };   // runs that survived into act N
  let missedCyclopsUnexplained = 0;   // runs with no cyclops AND no act-1 terminal ending
  for (let i = 0; i < RUNS; i++) {
    const run = simulatePackRun(odysseyPack, nextSeed());
    const seen = new Set();
    for (const c of run.cards) {
      const ev = eventById.get(c.id);
      const b = ev && beatOf(ev);
      if (b) {
        (beatSeen[b] ??= {})[c.id] = ((beatSeen[b] ??= {})[c.id] || 0) + 1;
        seen.add(b);
      }
    }
    const maxAct = Math.max(...run.cards.map((c) => c.act), 1);
    if (maxAct >= 2) reachedAct[2]++;
    if (maxAct >= 3) reachedAct[3]++;
    for (const b of seen) beatRuns[b] = (beatRuns[b] || 0) + 1;
    // The itinerary contract, made exact: a run may miss the Cyclops ONLY by
    // ENDING first — the meadow accepted, the despair filled, the sea's
    // answer — never by slipping past an open window. (The old absolute
    // ≥99% floor encoded the era when the lotus offer fired in <1% of runs;
    // pass 10's rebalance made the meadow a real offer, so banked-in-act-1
    // tellings are now a legitimate, sizable class.)
    if (!seen.has('cyclops') && maxAct <= 1) {
      const key = run.state?.ending?.key;
      if (!['lotus', 'burnout', 'wrath'].includes(key)) missedCyclopsUnexplained++;
    } else if (!seen.has('cyclops') && maxAct > 1) {
      missedCyclopsUnexplained++;
    }
  }
  return { beatSeen, beatRuns, reachedAct, missedCyclopsUnexplained };
}

const { beatSeen, beatRuns, reachedAct, missedCyclopsUnexplained } = sweep();

test('the LANDMARKS occur in every telling that reaches them (temptations are offers, not landmarks)', () => {
  // The itinerary contract: a landmark is never lost — a run that survives
  // to a landmark's act-end window ALWAYS meets it. (A telling that ends in
  // the meadow or on a beach before the window legitimately never gets
  // there; ~0.2% of runs at this policy.)
  assert.ok(beatRuns.cyclops >= reachedAct[2],
    `cyclops fired in ${beatRuns.cyclops} runs but ${reachedAct[2]} runs survived past act 1`);
  assert.ok(beatRuns.underworld >= reachedAct[3],
    `underworld fired in ${beatRuns.underworld} runs but ${reachedAct[3]} runs survived past act 2`);
  // Every miss is EXPLAINED: the run ended in act 1 at a told/terminal
  // ending (meadow, beach, wave). Zero unexplained misses = the window can
  // never be slipped, whatever the offer rates are tuned to.
  assert.strictEqual(missedCyclopsUnexplained, 0,
    `${missedCyclopsUnexplained} runs missed the Cyclops without an act-1 terminal ending — the window leaked (INCIDENTS #3 class)`);
  // And the miss class stays a minority: the meadow is a real offer now
  // (pass 10), but if most tellings bank before the cave, the itinerary's
  // first landmark has stopped being 'every telling's defining scar'.
  assert.ok(beatRuns.cyclops >= RUNS * 0.8, `cyclops fired in only ${beatRuns.cyclops}/${RUNS} runs — the meadow is eating the itinerary`);
});

test('cyclops variation floor: both variants live, entropy ≥ 0.4 bits', () => {
  const e = entropyOf(beatSeen.cyclops);
  assert.ok(e.variants >= 2, `cyclops variants seen: ${e.variants} (expected ≥2)`);
  assert.ok(e.h >= 0.4, `cyclops entropy ${e.h} bits < 0.4 — a variant gate rotted shut`);
  assert.ok(e.topShare <= 0.92, `one cyclops reading covers ${(e.topShare * 100).toFixed(1)}% of runs`);
});

test('underworld variation floor: the grieving reading lives (P-B half 2, raised deliberately)', () => {
  // Pass 5 of the player-experience series: the most-seen flat beat gains a
  // second reading, keyed to player-caused losses (expedition ≤ 6 at the
  // trench). Measured at authoring: H=0.567 bits, grieving 13.4% of visits.
  // Floors sit under the measurement (the cyclops precedent) to catch a
  // gate rotting shut, not to pin the policy's exact mix.
  const e = entropyOf(beatSeen.underworld);
  assert.ok(e.variants >= 2, `underworld variants seen: ${e.variants} (expected ≥2 — the grieving gate rotted shut)`);
  assert.ok(e.h >= 0.25, `underworld entropy ${e.h} bits < 0.25`);
  assert.ok(e.topShare <= 0.95, `one underworld reading covers ${(e.topShare * 100).toFixed(1)}% of runs`);
});

test('circe variation floor: the island meets every fleet now (pass 20)', () => {
  // Pass 20: the temptation is gated to the weary (burnout ≥ 60 / hulls ≤ 5),
  // which skipped the beat for ~86% of runs — so the strong fleet gets the
  // professional reading (ody_circe_pilot, min expedition 6) instead.
  // Measured at authoring (RUNS=1000, seed 0xE47): 874 runs met the island,
  // pilot 795 / temptation 79, H=0.438 bits, top share 91%. Floors sit
  // under the measurement (the cyclops precedent) to catch a gate rotting
  // shut, not to pin the policy's exact mix.
  const e = entropyOf(beatSeen.circe);
  assert.ok(e.variants >= 2, `circe variants seen: ${e.variants} (expected ≥2 — a reading's gate rotted shut)`);
  assert.ok(e.h >= 0.2, `circe entropy ${e.h} bits < 0.2`);
  assert.ok(e.topShare <= 0.96, `one circe reading covers ${(e.topShare * 100).toFixed(1)}% of visits`);
  assert.ok(beatRuns.circe >= RUNS * 0.7, `circe fired in only ${beatRuns.circe}/${RUNS} runs — the island went back to being skipped`);
});

test('lotus variation floor: the meadow meets every fleet now (pass 28)', () => {
  // The temptation is gated to the weary; the strong fleet gets the
  // petition (ody_lotus_watch, min expedition 10) — the trilogy's last
  // graduation. Measured at authoring (RUNS=1000, seed 0xE47): 1000 runs
  // met the meadow, watch 882 / temptation 118, H=0.524, top share 88.2%.
  // Floors under measurement, same discipline as cyclops/underworld/circe.
  const e = entropyOf(beatSeen.lotus);
  assert.ok(e.variants >= 2, `lotus variants seen: ${e.variants} (a reading's gate rotted shut)`);
  assert.ok(e.h >= 0.25, `lotus entropy ${e.h} bits < 0.25`);
  assert.ok(e.topShare <= 0.94, `one lotus reading covers ${(e.topShare * 100).toFixed(1)}% of visits`);
  assert.ok(beatRuns.lotus >= RUNS * 0.85, `lotus fired in only ${beatRuns.lotus}/${RUNS} runs — the meadow went back to being skipped`);
});

test('calypso variation floor: the island reads the man (pass 29)', () => {
  // The last graduation: the H=0 documented list is EMPTY — every beat now
  // deals ≥2 scene readings. The temptation stays gated to the wrecked and
  // weary; the strong fleet gets the landfall (min expedition 5). Measured
  // at authoring (RUNS=1000, seed 0xE47): 880 runs met the island, landfall
  // 744 / temptation 136, H=0.621, top share 84.5%. Floors under
  // measurement, same discipline as the other three beats.
  const e = entropyOf(beatSeen.calypso);
  assert.ok(e.variants >= 2, `calypso variants seen: ${e.variants} (a reading's gate rotted shut)`);
  assert.ok(e.h >= 0.3, `calypso entropy ${e.h} bits < 0.3`);
  assert.ok(e.topShare <= 0.92, `one calypso reading covers ${(e.topShare * 100).toFixed(1)}% of visits`);
  assert.ok(beatRuns.calypso >= RUNS * 0.7, `calypso fired in only ${beatRuns.calypso}/${RUNS} runs — the island went back to being skipped`);
});

test('the underworld reads differently for the knowing bard (knowledge-gated variation)', () => {
  // Fresh bard: the chain runs underworld → tiresias. A bard carrying the
  // other two turnings: → tiresias_oar. The variation is cross-run knowledge,
  // invisible inside one telling — exactly the replay layer the review asked
  // to see proven, so it is proven here, at the chain level.
  const runChain = (fragments, seed) => {
    const meta = engine.mulberry32(seed >>> 0 || 1);
    const state = engine.newRun(odysseyPack, 'fishermans_hearth', [], engine.mulberry32(seed + 1), []);
    state.seed = seed + 2;
    odysseyPack.presenter.applySetup(state, {}, { odyssey: { fragments } }, false);
    const play = engine.stateRng(state);
    const played = [];
    let guard = 0;
    while (state.phase !== 'ended' && guard++ < 300) {
      if (state.phase === 'crossroads') { engine.commitPath(state, 'nostos'); continue; }
      const ev = engine.drawNextCard(state, play);
      if (!ev) { state.cardsPlayedInAct = engine.actLength(state, state.act); }
      else { engine.resolveSwipe(state, meta() < 0.5 ? 'left' : 'right', play, {}); played.push(ev.id); }
      const step = engine.advance(state);
      if (step.kind === 'finale') engine.evaluateFinale(state);
    }
    return played;
  };
  let freshTiresias = 0, knowingOar = 0, tried = 0;
  for (let s = 5000; s < 5040; s++) {
    tried++;
    if (runChain([], s).includes('ody_tiresias')) freshTiresias++;
    if (runChain(['bow', 'sea'], s).includes('ody_tiresias_oar')) knowingOar++;
  }
  assert.ok(freshTiresias > 0, `fresh bard never reached the plain prophet in ${tried} seeds`);
  assert.ok(knowingOar > 0, `knowing bard never reached the third question in ${tried} seeds`);
});
