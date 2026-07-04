// The ceremony climax encounter (V2-DESIGN centrepiece): last stand → gossip
// cash-out → verdict. Asserts the ADR-0002 survival math is unchanged, the
// cash-out beat only opens on a held Rival secret, playing it defuses the
// poach, and the readings Stirling explains are recorded truthfully.
//
// Run: node --test test/li-ceremony.test.mjs

import test from 'node:test';
import assert from 'node:assert/strict';
import * as engine from '../dist/js/engine.js';
import { loveIslandPack } from '../dist/js/packs/love-island/pack.js';
import { couplingPlugin, COUPLING } from '../dist/js/packs/love-island/plugins/coupling.js';
import { moodOf } from '../dist/js/packs/love-island/plugins/characters.js';

function fresh(seed = 7) {
  const state = engine.newRun(loveIslandPack, 'retriever_girl', [], engine.mulberry32(seed), []);
  state.seed = seed + 2;
  return state;
}
const apply = (state, effects) =>
  engine.applyEffects(state, effects, null, null, engine.mulberry32(99), 'good');

// Resolve a card whose landed outcome carries the given effects, through the
// coupling plugin's afterResolve (the ceremony router).
function land(state, effects, { tags = ['loyal'], tier = 'good', evId = 'li_recoup2_exposed' } = {}) {
  const choice = { label: 'x', tags, outcomes: { [tier]: { text: 'x', effects } } };
  couplingPlugin.afterResolve(state, {}, { ev: { id: evId }, choice, tier, rng: engine.mulberry32(1) });
}

test('without a held secret, the last stand resolves straight to a verdict', () => {
  const s = fresh();
  apply(s, { couple: true });
  s.bond = COUPLING.bondFloor + 10;
  land(s, { chosenCeremony: true });
  assert.equal(s.pendingChainId, 'li_recoup_held');
  assert.equal(s.ceremonyPending, null);
  assert.equal(s.lastCeremony.verdict, 'held');
  assert.equal(s.lastCeremony.secretPlayed, false);
});

test('the survival math is unchanged ADR-0002 (lane bonus, floors, rescue)', () => {
  // Bond lane: a good tier adds 6 to the Bond side.
  const s1 = fresh();
  apply(s1, { couple: true });
  s1.bond = COUPLING.bondFloor - 6; s1.public = 0;
  land(s1, { chosenCeremony: true }, { tags: ['loyal'], tier: 'good' });
  assert.equal(s1.lastCeremony.verdict, 'held', 'bond lane tier bonus counts');
  // Public rescue when the Bond fails.
  const s2 = fresh();
  apply(s2, { couple: true });
  s2.bond = 0; s2.public = COUPLING.publicFloor;
  land(s2, { chosenCeremony: true });
  assert.equal(s2.lastCeremony.verdict, 'rescued');
  // Neither floor → dumped.
  const s3 = fresh();
  apply(s3, { couple: true });
  s3.bond = 0; s3.public = 0;
  land(s3, { chosenCeremony: true }, { tier: 'bad' });
  assert.equal(s3.lastCeremony.verdict, 'dumped');
  // An active Rival poaches at the check.
  const s4 = fresh();
  apply(s4, { couple: true });
  s4.bond = COUPLING.bondFloor + 2; s4.public = 0;
  s4.flags.push('li_rival_active');
  land(s4, { chosenCeremony: true }, { tier: 'bad' });
  assert.equal(s4.lastCeremony.verdict, 'dumped', 'the poach penalty bites');
});

test('a held Rival secret opens the cash-out beat before the verdict', () => {
  const s = fresh();
  apply(s, { couple: true });
  apply(s, { surfaceSecret: 'rival' });
  s.bond = COUPLING.bondFloor + 10;
  land(s, { chosenCeremony: true }, { tier: 'incredible' });
  assert.equal(s.pendingChainId, 'li_recoup_cashout', 'the extra beat is queued');
  assert.ok(s.ceremonyPending, 'the last stand is held, not lost');
  assert.equal(s.ceremonyPending.tierBonus, 12, 'how the stand landed carries over');
});

test('playing the secret defuses the poach and swings the check', () => {
  const s = fresh();
  apply(s, { couple: true });
  apply(s, { surfaceSecret: 'rival' });
  s.flags.push('li_rival_active');
  // Marginal Bond: dies to the poach, survives without it.
  s.bond = COUPLING.bondFloor + 2; s.public = 0;
  land(s, { chosenCeremony: true }, { tier: 'bad' });
  assert.equal(s.pendingChainId, 'li_recoup_cashout');
  // The cash-out card, left side: playSecret + chosenCeremony.
  apply(s, { playSecret: 'rival', public: 5 });
  assert.ok(s.secretSpent.includes('rival'), 'one use');
  assert.ok(!s.flags.includes('li_rival_active'), 'poach off');
  assert.ok(s.flags.includes('li_secret_detonated'));
  land(s, { chosenCeremony: true }, { tags: ['drama'], tier: 'good', evId: 'li_recoup_cashout' });
  assert.equal(s.lastCeremony.verdict, 'held', 'the defused check passes');
  assert.equal(s.lastCeremony.secretPlayed, true, 'recorded for the explain');
});

test('keeping the secret resolves the held stand with the poach applied', () => {
  const s = fresh();
  apply(s, { couple: true });
  apply(s, { surfaceSecret: 'rival' });
  s.flags.push('li_rival_active');
  s.bond = COUPLING.bondFloor + 2; s.public = 0;
  land(s, { chosenCeremony: true }, { tier: 'bad' });
  assert.equal(s.pendingChainId, 'li_recoup_cashout');
  // Mercy: no playSecret — the cash-out card still resolves the ceremony.
  land(s, { chosenCeremony: true }, { tags: ['strategy'], tier: 'good', evId: 'li_recoup_cashout' });
  assert.equal(s.lastCeremony.verdict, 'dumped', 'the poach still bites');
  assert.ok(s.secretKnown.includes('rival') && !s.secretSpent.includes('rival'),
    'the secret is still yours');
});

test('portraits react at the verdict (V2-DESIGN beat 4)', () => {
  const held = fresh();
  apply(held, { couple: true });
  held.bond = COUPLING.bondFloor + 10;
  land(held, { chosenCeremony: true });
  assert.equal(moodOf(held, 'partner'), 'buzzing', 'held: the Partner beams');
  assert.equal(moodOf(held, 'rival'), 'fuming', 'held: the Rival missed');
  const dumped = fresh();
  apply(dumped, { couple: true });
  dumped.bond = 0; dumped.public = 0;
  land(dumped, { chosenCeremony: true }, { tier: 'bad' });
  assert.equal(moodOf(dumped, 'rival'), 'smug', 'dumped: the Rival savours it');
});

test('Casa faces foreshadow: a kissed Partner comes back TORN', () => {
  const s = fresh();
  apply(s, { couple: true });
  s.partnerLoyal = 'kissed';
  apply(s, { casaReturn: true });
  assert.equal(moodOf(s, 'partner'), 'torn', 'the mood system telegraphs Movie Night');
  const loyal = fresh();
  apply(loyal, { couple: true });
  loyal.partnerLoyal = 'loyal';
  apply(loyal, { casaReturn: true });
  assert.equal(moodOf(loyal, 'partner'), 'buzzing');
});

test('a spent secret does not reopen the cash-out at the next ceremony', () => {
  const s = fresh();
  apply(s, { couple: true });
  apply(s, { surfaceSecret: 'rival' });
  s.secretSpent.push('rival');
  s.bond = COUPLING.bondFloor + 10;
  land(s, { chosenCeremony: true });
  assert.notEqual(s.pendingChainId, 'li_recoup_cashout');
  assert.equal(s.lastCeremony.verdict, 'held');
});
