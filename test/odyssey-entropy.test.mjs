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
  }
  return { beatSeen, beatRuns, reachedAct };
}

const { beatSeen, beatRuns, reachedAct } = sweep();

test('the LANDMARKS occur in every telling that reaches them (temptations are offers, not landmarks)', () => {
  // The itinerary contract: a landmark is never lost — a run that survives
  // to a landmark's act-end window ALWAYS meets it. (A telling that ends in
  // the meadow or on a beach before the window legitimately never gets
  // there; ~0.2% of runs at this policy.)
  assert.ok(beatRuns.cyclops >= reachedAct[2],
    `cyclops fired in ${beatRuns.cyclops} runs but ${reachedAct[2]} runs survived past act 1`);
  assert.ok(beatRuns.underworld >= reachedAct[3],
    `underworld fired in ${beatRuns.underworld} runs but ${reachedAct[3]} runs survived past act 2`);
  assert.ok(beatRuns.cyclops >= RUNS * 0.99, `cyclops fired in only ${beatRuns.cyclops}/${RUNS} runs`);
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

test('the measured H=0 beats stay documented until half 2 raises them', () => {
  // Circe / calypso / lotus deal exactly one card today (their variation is
  // occurrence, side, and tier — not scene). This is the review's finding,
  // pinned as a fact: if authoring adds variants (P-B half 2), this test is
  // the one to UPDATE — move the beat to the entropy-floor test above.
  for (const beat of ['circe', 'calypso', 'lotus']) {
    if (!beatSeen[beat]) continue; // lotus fires in <1% of runs at this policy
    const e = entropyOf(beatSeen[beat]);
    assert.equal(e.variants, 1,
      `${beat} now deals ${e.variants} variants — raise its floor in the entropy test instead of leaving it documented as flat`);
  }
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
