// Character-state layer (ADR-0006) unit tests: opinion tiers, mood decay,
// secrets (surfacing, partner re-draw), and the bombshell seat — the schema
// the v2 presenter and gossip layers read. Runs against dist/ (build first).
//
// Run: node --test test/li-characters.test.mjs

import test from 'node:test';
import assert from 'node:assert/strict';
import * as engine from '../dist/js/engine.js';
import {
  charactersPlugin, opinionTier, opinionOf, moodOf, secretOf, characterRead,
  CHARACTERS, RIVAL_SECRETS, PARTNER_SECRETS,
} from '../dist/js/packs/love-island/plugins/characters.js';

import { fresh, apply } from './li-harness.mjs';

test('opinion tiers map the whole 0–100 range', () => {
  assert.equal(opinionTier(0), 'cold');
  assert.equal(opinionTier(24), 'cold');
  assert.equal(opinionTier(25), 'cool');
  assert.equal(opinionTier(49), 'cool');
  assert.equal(opinionTier(50), 'warm');
  assert.equal(opinionTier(74), 'warm');
  assert.equal(opinionTier(75), 'smitten');
  assert.equal(opinionTier(100), 'smitten');
});

test('a fresh Season seeds the Rival with opinion and a hidden secret', () => {
  const s = fresh();
  assert.ok(s.rival, 'rival drawn');
  assert.equal(s.charOpinion.rival, CHARACTERS.rivalOpinionStart);
  assert.ok(RIVAL_SECRETS.some((x) => x.id === s.charSecret.rival), 'rival secret from the pool');
  const sec = secretOf(s, 'rival');
  assert.ok(sec.def && !sec.known && !sec.spent, 'secret hidden at start');
  const read = characterRead(s, 'rival');
  assert.equal(read.cast.id, s.rival);
  assert.equal(read.tier, opinionTier(CHARACTERS.rivalOpinionStart));
  assert.equal(read.mood, null);
});

test('rivalOpinion deltas move and clamp the number', () => {
  const s = fresh();
  apply(s, { rivalOpinion: 10 });
  assert.equal(opinionOf(s, 'rival'), CHARACTERS.rivalOpinionStart + 10);
  apply(s, { rivalOpinion: 500 });
  assert.equal(opinionOf(s, 'rival'), 100);
  apply(s, { rivalOpinion: -500 });
  assert.equal(opinionOf(s, 'rival'), 0);
});

test('the partner opinion IS Bond (numeric backing preserved)', () => {
  const s = fresh();
  apply(s, { couple: true });
  assert.ok(s.partner, 'coupled');
  s.bond = 80;
  assert.equal(opinionOf(s, 'partner'), 80);
  assert.equal(characterRead(s, 'partner').tier, 'smitten');
});

test('moods set, colour the read, and decay after their TTL', () => {
  const s = fresh();
  apply(s, { rivalMood: 'fuming' });
  assert.equal(moodOf(s, 'rival'), 'fuming');
  assert.ok(characterRead(s, 'rival').moodFace, 'mood has a face');
  for (let i = 0; i < CHARACTERS.moodTtl; i++) {
    charactersPlugin.afterResolve(s, {}, { rng: engine.mulberry32(1) });
  }
  assert.equal(moodOf(s, 'rival'), null, 'mood decays back to neutral');
});

test('an unknown mood id is ignored (bounded mood set)', () => {
  const s = fresh();
  apply(s, { rivalMood: 'ecstatic_nonsense' });
  assert.equal(moodOf(s, 'rival'), null);
});

test('surfaceSecret turns a latent secret into held intel, once', () => {
  const s = fresh();
  const d1 = apply(s, { surfaceSecret: 'rival' });
  assert.ok(s.secretKnown.includes('rival'));
  assert.ok((d1.notices || []).length, 'surfacing announces itself');
  const d2 = apply(s, { surfaceSecret: 'rival' });
  assert.equal((d2.notices || []).length, 0, 'no double-surface');
  assert.equal(s.secretKnown.filter((r) => r === 'rival').length, 1);
});

test('a new Partner re-draws their secret and clears held partner intel', () => {
  const s = fresh();
  apply(s, { couple: true });
  charactersPlugin.afterResolve(s, {}, { rng: engine.mulberry32(3) });
  const first = s.charSecret.partner;
  assert.ok(PARTNER_SECRETS.some((x) => x.id === first), 'partner secret drawn on coupling');
  s.secretKnown.push('partner');
  apply(s, { switchPartner: true });
  charactersPlugin.afterResolve(s, {}, { rng: engine.mulberry32(4) });
  assert.ok(!s.secretKnown.includes('partner'), 'old partner intel is history');
  assert.ok(PARTNER_SECRETS.some((x) => x.id === s.charSecret.partner), 'new secret drawn');
});

test('bombshellEnters seats an opposite-gender bombshell with fresh state', () => {
  const s = fresh();
  apply(s, { bombshellEnters: true });
  assert.ok(s.bombshellId, 'seat filled');
  const read = characterRead(s, 'bombshell');
  assert.equal(read.cast.gender, 'boy', 'girl persona → boy bombshell');
  assert.ok(read.cast.bombshell, 'from the bombshell pool');
  assert.equal(s.charOpinion.bombshell, CHARACTERS.bombshellOpinionStart);
  assert.ok(s.charSecret.bombshell, 'bombshell secret drawn');
  assert.ok(s.flags.includes(`li_arrived_${s.bombshellId}`), 'arrival flag set');
});

test('a same-gender bombshell can step up as the second-wave Rival', () => {
  const s = fresh();
  const oldRival = s.rival;
  apply(s, { bombshellEnters: 'same' });
  assert.equal(characterRead(s, 'bombshell').cast.gender, 'girl');
  const bombId = s.bombshellId;
  s.secretKnown.push('bombshell');
  apply(s, { rivalFromBombshell: true });
  assert.equal(s.rival, bombId, 'the bombshell takes the Rival seat');
  assert.notEqual(s.rival, oldRival);
  assert.equal(s.bombshellId, null, 'the bombshell seat empties');
  assert.ok(s.secretKnown.includes('rival') && !s.secretKnown.includes('bombshell'),
    'held intel follows the character into the new role');
  assert.ok(s.flags.includes('li_rival_active'));
});

test('rivalFromBombshell refuses an opposite-gender bombshell', () => {
  const s = fresh();
  apply(s, { bombshellEnters: true }); // opposite gender
  const rivalBefore = s.rival;
  apply(s, { rivalFromBombshell: true });
  assert.equal(s.rival, rivalBefore, 'a rival competes from your own gender');
  assert.ok(s.bombshellId, 'the bombshell stays seated');
});

test('opinion-tier requires gate encounter branches', () => {
  const s = fresh();
  s.charOpinion.rival = 60; // warm
  const at = charactersPlugin.requires.opinionAtLeast;
  const below = charactersPlugin.requires.opinionBelow;
  assert.equal(at(s, 'rival:warm'), true);
  assert.equal(at(s, 'rival:smitten'), false);
  assert.equal(below(s, 'rival:smitten'), true);
  assert.equal(below(s, 'rival:cool'), false);
  s.secretKnown.push('rival');
  assert.equal(charactersPlugin.requires.secretHeldIs(s, 'rival:true'), true);
  s.secretSpent.push('rival');
  assert.equal(charactersPlugin.requires.secretHeldIs(s, 'rival:true'), false);
});
