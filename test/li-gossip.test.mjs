// Gossip currency (ADR-0007) unit tests: gather (with the stale cap), the
// deploy cascade over the Partner ↔ You ↔ Rival network, secrets spending as
// the heavy note, and the eligibility gates. Runs against dist/.
//
// Run: node --test test/li-gossip.test.mjs

import test from 'node:test';
import assert from 'node:assert/strict';
import { gossipPlugin, heldIntel, intelCount, GOSSIP } from '../dist/js/packs/love-island/plugins/gossip.js';
import { moodOf, opinionOf } from '../dist/js/packs/love-island/plugins/characters.js';

import { fresh, apply } from './li-harness.mjs';

test('gainIntel gathers a feeling; the cap makes old news go stale', () => {
  const s = fresh();
  for (let i = 0; i < GOSSIP.intelCap; i++) {
    apply(s, { gainIntel: { about: 'rival', label: `whisper ${i}` } });
  }
  assert.equal(s.intel.length, GOSSIP.intelCap);
  const d = apply(s, { gainIntel: { about: 'rival', label: 'the fresh one' } });
  assert.equal(s.intel.length, GOSSIP.intelCap, 'cap holds');
  assert.equal(s.intel[0].label, 'whisper 1', 'oldest dropped');
  assert.ok((d.notices || []).some((n) => n.html.includes('stale')), 'staleness announced');
});

test('gainIntel about an empty seat is a no-op', () => {
  const s = fresh();
  apply(s, { gainIntel: { about: 'bombshell', label: 'x' } });
  assert.equal((s.intel || []).length, 0);
});

test('deploy to the Partner: Bond up, Rival cools, moods cascade', () => {
  const s = fresh();
  apply(s, { couple: true });
  const bond0 = s.bond, rival0 = opinionOf(s, 'rival');
  apply(s, { gainIntel: { about: 'rival', label: 'their week plan' } });
  apply(s, { deployIntel: 'partner' });
  assert.equal(s.bond, bond0 + GOSSIP.tellBond);
  assert.equal(opinionOf(s, 'rival'), rival0 + GOSSIP.tellRivalHit);
  assert.equal(moodOf(s, 'partner'), 'buzzing');
  assert.equal(moodOf(s, 'rival'), 'fuming');
  assert.equal(s.intel.length, 0, 'the item is spent');
  assert.equal(s.intelDeployed, 1);
});

test('deploy to the Rival: opinion up, leverage flag, Partner feels the huddle', () => {
  const s = fresh();
  apply(s, { couple: true });
  const bond0 = s.bond, rival0 = opinionOf(s, 'rival');
  apply(s, { gainIntel: { about: 'partner', label: 'they went quiet' } });
  apply(s, { deployIntel: 'rival' });
  assert.equal(opinionOf(s, 'rival'), rival0 + GOSSIP.dropRivalGain);
  assert.equal(s.bond, bond0 + GOSSIP.dropBondRisk);
  assert.equal(moodOf(s, 'rival'), 'scheming');
  assert.equal(moodOf(s, 'partner'), 'torn');
  assert.ok(s.flags.includes('li_fed_the_rival'));
});

test('with no feelings held, a surfaced secret spends as the heavy note', () => {
  const s = fresh();
  apply(s, { couple: true });
  apply(s, { surfaceSecret: 'rival' });
  assert.equal(heldIntel(s).secrets.length, 1);
  const bond0 = s.bond;
  apply(s, { deployIntel: 'partner' });
  assert.equal(s.bond, bond0 + GOSSIP.tellBondSecret, 'secrets land harder');
  assert.ok(s.secretSpent.includes('rival'), 'one use, then spent');
  assert.equal(intelCount(s), 0);
});

test('deploying at a missing target consumes nothing (single Islander)', () => {
  const s = fresh();
  assert.equal(s.partner, null, 'single');
  apply(s, { gainIntel: { about: 'rival', label: 'x' } });
  apply(s, { deployIntel: 'partner' });
  assert.equal(s.intel.length, 1, 'intel never burns into the void');
  assert.equal(s.intelDeployed || 0, 0);
});

test('deploying with an empty pocket is a no-op', () => {
  const s = fresh();
  apply(s, { couple: true });
  const before = JSON.stringify([s.bond, s.charOpinion, s.intelDeployed]);
  apply(s, { deployIntel: 'rival' });
  assert.equal(JSON.stringify([s.bond, s.charOpinion, s.intelDeployed]), before);
});

test('the eligibility gates read the whole held inventory', () => {
  const s = fresh();
  assert.equal(gossipPlugin.requires.intelMin(s, 1), false);
  apply(s, { gainIntel: { about: 'rival', label: 'x' } });
  assert.equal(gossipPlugin.requires.intelMin(s, 1), true);
  assert.equal(gossipPlugin.requires.intelAboutIs(s, 'rival:true'), true);
  assert.equal(gossipPlugin.requires.intelAboutIs(s, 'partner:true'), false);
  apply(s, { surfaceSecret: 'rival' });
  assert.equal(gossipPlugin.requires.intelMin(s, 2), true, 'secrets count as held intel');
});
