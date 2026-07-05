// The factional public (ADR-0012) unit tests: the derived aggregate (public =
// the mean of the three wings), the tag-tilted routing of the legacy `public`
// verb (mean-preserving), the surge clutch (net approval — all three wings
// onside), the structural reactions, and the finale wiring (momentumResource,
// the story gate resolving through gateValue). Runs against dist/.
//
// Run: node --test test/li-factions.test.mjs

import test from 'node:test';
import assert from 'node:assert/strict';
import * as engine from '../dist/js/engine.js';
import { loveIslandPack } from '../dist/js/packs/love-island/pack.js';
import {
  FACTION_KEYS, FACTIONS, factionLean, factionTier,
  movePublicFactional, recomputePublic, setFactions,
} from '../dist/js/packs/love-island/plugins/factions.js';

function fresh(seed = 7) {
  const state = engine.newRun(loveIslandPack, 'retriever_girl', [], engine.mulberry32(seed), []);
  state.seed = seed + 2;
  return state;
}
const apply = (state, effects, seed = 99, choice = null) =>
  engine.applyEffects(state, effects, null, choice, engine.mulberry32(seed), 'good');

test('public starts as the mean of the three wings, and stays derived', () => {
  const s = fresh();
  assert.equal(s.romantics, 8);
  assert.equal(s.selfrespect, 8);
  assert.equal(s.drama, 8);
  assert.equal(s.public, 8, 'derived aggregate at start');
  setFactions(s, { romantics: 30, selfrespect: 18, drama: 12 });
  assert.equal(s.public, 20, 'mean recomputed on every faction write');
});

test('a routed public delta is mean-preserving under the tag tilt', () => {
  const s = fresh();
  const before = s.public;
  const d = movePublicFactional(s, 3, ['loyal']);
  assert.equal(d, 3, 'aggregate moves by exactly the authored amount');
  assert.equal(s.public, before + 3);
  // The tilt spread: the favoured wing got more, the bored wing less.
  assert.equal(s.romantics, 8 + 3 + FACTIONS.tiltStep);
  assert.equal(s.drama, 8 + 3 - FACTIONS.tiltStep);
  assert.equal(s.selfrespect, 8 + 3);
});

test('negative public lands uniformly — embarrassment is nonpartisan', () => {
  const s = fresh();
  movePublicFactional(s, -3, ['drama']);
  for (const k of FACTION_KEYS) assert.equal(s[k], 5);
  assert.equal(s.public, 5);
});

test('factions floor at zero; the mean respects the floor', () => {
  const s = fresh();
  movePublicFactional(s, -20);
  for (const k of FACTION_KEYS) assert.equal(s[k], 0);
  assert.equal(s.public, 0);
});

test('faction verbs are authorable card effects with visible deltas', () => {
  const s = fresh();
  const d = apply(s, { drama: 5, romantics: -2 });
  assert.equal(s.drama, 13);
  assert.equal(s.romantics, 6);
  assert.equal(s.public, Math.round((6 + 8 + 13) / 3));
  const keys = d.map((x) => x.key);
  assert.ok(keys.includes('drama') && keys.includes('romantics'), 'chips recorded');
});

test('the surge is net approval: all three wings onside, none lost', () => {
  const s = fresh();
  setFactions(s, { romantics: 60, selfrespect: 55, drama: 52 });
  assert.equal(s.surge, 3, 'whole nation onside');
  // The chaos-villain profile lands mid-pack: thrilled Drama, repelled Romantics.
  setFactions(s, { romantics: 10, selfrespect: 40, drama: 90 });
  assert.equal(s.surge, 0, 'one wing lost cancels one wing won (floored at 0)');
  setFactions(s, { romantics: 30, selfrespect: 55, drama: 90 });
  assert.equal(s.surge, 2, 'two onside, none lost');
});

test('the finale clutch reads surge through the manifest momentumResource', () => {
  assert.equal(loveIslandPack.manifest.momentumResource, 'surge');
  const s = fresh();
  s.path = 'winvilla';
  s.phase = 'finale';
  // A near-miss on every gate + the whole nation onside → the surge carries it.
  s.story = 2;
  s.bond = 46;                       // ≥ 83% of the 50 gate, below it
  setFactions(s, { romantics: 100, selfrespect: 100, drama: 100 }); // public 100 ≥ 83% of 106
  assert.equal(s.surge, 3);
  const r = engine.evaluateFinale(s);
  assert.equal(r.result, 'success', 'partial upgraded by the factional surge');
  // Same meters with a repelled wing: no surge, no upgrade.
  const s2 = fresh(9);
  s2.path = 'winvilla';
  s2.phase = 'finale';
  s2.story = 2;
  s2.bond = 46;
  setFactions(s2, { romantics: 20, selfrespect: 140, drama: 140 }); // public 100, one wing lost
  assert.ok(s2.surge < 3);
  const r2 = engine.evaluateFinale(s2);
  assert.equal(r2.result, 'partial', 'a chaos-villain lands mid-pack');
});

test('the story gate resolves through gateValue and blocks the crown', () => {
  const s = fresh();
  assert.equal(engine.gateValue(s, 'story'), 0, 'fresh run, no storylines');
  s.path = 'winvilla';
  s.phase = 'finale';
  s.bond = 80;
  setFactions(s, { romantics: 120, selfrespect: 120, drama: 120 });
  s.story = 0;
  // Meters maxed, no arc: the crown refuses (and the surge cannot buy story).
  assert.notEqual(engine.evaluateFinale(s).result, 'success');
  const s2 = fresh(11);
  s2.path = 'winvilla';
  s2.phase = 'finale';
  s2.bond = 80;
  setFactions(s2, { romantics: 120, selfrespect: 120, drama: 120 });
  s2.story = 2;
  assert.equal(engine.evaluateFinale(s2).result, 'success', 'same season with an arc takes it');
});

test('structural reactions: exclusivity pleases the Romantics, bores the Drama wing', () => {
  const s = fresh();
  apply(s, { exclusive: 1 });
  assert.equal(s.romantics, 8 + FACTIONS.react.exclusiveOn.romantics);
  assert.equal(s.drama, 8 + FACTIONS.react.exclusiveOn.drama);
});

test('structural reactions: switching partners feeds the Drama wing', () => {
  const s = fresh();
  apply(s, { switchPartner: true });
  assert.equal(s.drama, 8 + FACTIONS.react.switchPartner.drama);
  assert.equal(s.romantics, 8 + FACTIONS.react.switchPartner.romantics);
});

test('tag → faction lean map covers the three wings and stays readable', () => {
  assert.deepEqual(factionLean(['loyal']), { up: 'romantics', down: 'drama' });
  assert.deepEqual(factionLean(['camera']), { up: 'drama', down: 'romantics' });
  assert.deepEqual(factionLean(['strategy']), { up: 'selfrespect', down: 'drama' });
  assert.equal(factionLean(['chat']), null, 'neutral tags carry no tilt');
});

test('faction tiers speak the ADR-0006 discipline', () => {
  assert.equal(factionTier(10), 'lost');
  assert.equal(factionTier(30), 'unconvinced');
  assert.equal(factionTier(60), 'onside');
  assert.equal(factionTier(90), 'devoted');
});

test('the comeback season arrives factionally notorious (mean 20, drama-leaning)', () => {
  const s = fresh();
  loveIslandPack.comeback(s);
  assert.equal(s.public, 20, 'the old comeback public, derived');
  assert.ok(s.drama > s.romantics, 'the Drama-lovers remember you fondly');
});
