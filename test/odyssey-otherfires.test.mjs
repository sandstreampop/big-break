// The other fires (pass 33) — executable invariants. The fleet panel's
// whole claim is honesty: the SAME water, sailed deterministically, the
// same hundred endings for every player on the same day. So the hard rules
// are: the fleet is a pure function of (seed, n); the seed strings match
// the shell's shared-water starters; every telling lands in exactly one
// bucket; and the player's own fire is always marked, even when no bot
// shared their ending.

import test from 'node:test';
import assert from 'node:assert';
import { odysseyPack } from '../dist/js/packs/odyssey/pack.js';
import * as engine from '../dist/js/engine.js';
import {
  sailOne, sailFleet, fleetSeedFor, fleetPersona, bucketOfSummary, fleetRows,
  BUCKET_ORDER, BUCKET_COPY, FLEET_SIZE,
} from '../dist/js/packs/odyssey/otherfires.js';
import { dailySeed, gauntletSeed } from '../dist/js/ui/dom.js';

test('the fleet is deterministic: same water, same hundred endings', () => {
  const a = sailFleet(odysseyPack, 123456, 30);
  const b = sailFleet(odysseyPack, 123456, 30);
  assert.deepStrictEqual(a, b, 'the same seed must sail the same fleet');
  assert.strictEqual(a.total, 30);
  const sum = BUCKET_ORDER.reduce((n, k) => n + a.counts[k], 0);
  assert.strictEqual(sum, 30, 'every telling lands in exactly one bucket');
});

test('one bot, one telling: sailOne is pure in (seed, whim)', () => {
  assert.strictEqual(sailOne(odysseyPack, 777, 42), sailOne(odysseyPack, 777, 42));
  assert.ok(BUCKET_ORDER.includes(sailOne(odysseyPack, 777, 42)));
});

test('different water sails differently', () => {
  const a = sailFleet(odysseyPack, 111, 25);
  const b = sailFleet(odysseyPack, 999999, 25);
  assert.notDeepStrictEqual(a.counts, b.counts, 'two far-apart seeds should not tally identically');
});

test('the fleet seed is the shell’s own derivation, not a re-typed string', () => {
  // dailySeed/gauntletSeed live in js/ui/dom.ts and are the SAME functions
  // startNewRun/startGauntletGeneric call — the contract is the import.
  const daily = fleetSeedFor({ daily: '2026-07-17' });
  assert.strictEqual(daily.seed, dailySeed('2026-07-17'));
  assert.strictEqual(daily.mode, 'daily');
  assert.match(daily.label, /The Same Sea — 2026-07-17/);
  const week = fleetSeedFor({ gauntlet: '2026-W29' });
  assert.strictEqual(week.seed, gauntletSeed('2026-W29'));
  assert.strictEqual(week.mode, 'gauntlet');
  assert.match(week.label, /The Gauntlet — week 2026-W29/);
  assert.strictEqual(fleetSeedFor({}), null, 'a personal telling has no fleet');
  assert.strictEqual(fleetSeedFor({ daily: null, gauntlet: null }), null);
});

test('a gauntlet fleet all rows the week’s one fate-drawn build', () => {
  const seed = gauntletSeed('2026-W29');
  // The exact draw startGauntletGeneric makes: mulberry32(seed)'s first
  // roll over the default-unlocked pool.
  const pool = odysseyPack.loadouts.filter((l) => l.unlockedByDefault);
  const expected = pool[Math.floor(engine.mulberry32(seed)() * pool.length)].id;
  for (const whimSeed of [1, 7, 99, 12345]) {
    const whim = engine.mulberry32(whimSeed);
    assert.strictEqual(fleetPersona(odysseyPack, seed, 'gauntlet', whim), expected,
      'every bot must sail the build every human is locked into');
  }
});

test('a daily fleet picks among the seeded offer a fresh player sees', () => {
  const seed = dailySeed('2026-07-17');
  const pool = odysseyPack.loadouts.filter((l) => l.unlockedByDefault).map((l) => l.id);
  engine.useContentPack(odysseyPack);
  const offered = engine.offerLoadouts(pool, engine.mulberry32(seed)).map((l) => l.id);
  for (const whimSeed of [1, 7, 99, 12345]) {
    const whim = engine.mulberry32(whimSeed);
    assert.ok(offered.includes(fleetPersona(odysseyPack, seed, 'daily', whim)),
      'a bot must sail one of the day\'s offered builds');
  }
});

test('the player’s telling lands in the same bucket space', () => {
  assert.strictEqual(bucketOfSummary({ endingKey: 'nostos', result: 'success' }), 'home');
  assert.strictEqual(bucketOfSummary({ endingKey: 'kleos', result: 'success' }), 'glory');
  assert.strictEqual(bucketOfSummary({ endingKey: 'nostos', result: 'failure' }), 'short');
  assert.strictEqual(bucketOfSummary({ endingKey: 'kleos', result: 'partial' }), 'short');
  for (const k of ['lotus', 'circe', 'calypso']) assert.strictEqual(bucketOfSummary({ endingKey: k }), 'banked');
  assert.strictEqual(bucketOfSummary({ endingKey: 'wrath' }), 'sea');
  assert.strictEqual(bucketOfSummary({ endingKey: 'burnout' }), 'despair');
  assert.strictEqual(bucketOfSummary({}), 'short', 'a hostile summary still lands somewhere honest');
});

test('the rows mark exactly one fire as yours — even a bucket no bot reached', () => {
  const tally = { total: 10, counts: { home: 6, glory: 4, short: 0, banked: 0, sea: 0, despair: 0 } };
  const html = fleetRows(tally, 'despair');
  assert.strictEqual((html.match(/ody-fire-you/g) || []).length, 1);
  assert.ok(html.includes(`${BUCKET_COPY.despair} — your fire`), 'the empty bucket still shows because it is yours');
  assert.ok(html.includes('>6<') && html.includes('>4<'), 'the counts ride the rows');
  assert.ok(!html.includes(BUCKET_COPY.sea), 'an empty bucket that is not yours stays silent');
});

test('the fleet size is the copy’s hundred', () => {
  assert.strictEqual(FLEET_SIZE, 100);
});
