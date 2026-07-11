// The frieze never lies (I3): the sprite half of the invariant. The smoke
// suite pins the DOM↔RunState mapping on live surfaces; THIS pins the sprite
// functions themselves — ship(n) really seats n rowers, the sea strips are
// distinct states, the notch math walks the manifest. Runs against dist/
// (build first, like every suite here).

import test from 'node:test';
import assert from 'node:assert';

const { ship, seaStrip, sternFigures, SHIP_MAX_ROWERS } =
  await import('../dist/js/packs/odyssey/art/figures.js');
const { seaStateOf, notchOf, friezeTableau } =
  await import('../dist/js/packs/odyssey/frieze.js');
const { odysseyManifest } = await import('../dist/js/packs/odyssey/manifest.js');

const rectCount = (svg) => (svg.match(/<rect /g) || []).length;

test('ship(n) seats exactly n rowers (rect fidelity per bench)', () => {
  const empty = rectCount(ship(0));
  let prev = empty;
  for (let n = 1; n <= SHIP_MAX_ROWERS; n++) {
    const now = rectCount(ship(n));
    // Every man is at least a head, a torso run, and an oar-arm run of his
    // own (neighbouring rowers may share a torso run — a packed bench — but
    // no bench may ever be free). Benches sit clear of the mast and bow, so
    // a rower can never fuse into the HULL and vanish.
    assert.ok(now >= prev + 3, `bench ${n} added ${now - prev} rect(s) — a man must be visible`);
    prev = now;
  }
  // Out-of-range clamps, never throws.
  assert.equal(rectCount(ship(99)), rectCount(ship(SHIP_MAX_ROWERS)));
  assert.equal(rectCount(ship(-3)), empty);
});

test('the three sea states are three different waters', () => {
  const calm = seaStrip('calm'), mid = seaStrip('mid'), wrath = seaStrip('wrath');
  assert.notEqual(calm, mid);
  assert.notEqual(mid, wrath);
  assert.ok(wrath.includes('#722f37'), 'wrath must speak oxblood');
  assert.ok(!calm.includes('#722f37'), 'calm must not');
});

test('seaStateOf maps Poseidon to the water', () => {
  assert.equal(seaStateOf(0), 'calm');
  assert.equal(seaStateOf(3), 'calm');
  assert.equal(seaStateOf(4), 'mid');
  assert.equal(seaStateOf(7), 'mid');
  assert.equal(seaStateOf(8), 'wrath');
  assert.equal(seaStateOf(10), 'wrath');
});

test('sternFigures honors its count and cap', () => {
  const none = rectCount(sternFigures(0));
  const one = rectCount(sternFigures(1)) - none;
  assert.ok(one > 0);
  assert.equal(rectCount(sternFigures(4)) - none, one * 4);
  assert.equal(rectCount(sternFigures(99)), rectCount(sternFigures(6)), 'cap at 6');
});

test('notchOf walks the manifest segments', () => {
  const total = odysseyManifest.segments.reduce((n, s) => n + s.length, 0);
  assert.deepEqual(notchOf({ act: 1, cardsPlayedInAct: 0 }), { played: 0, total });
  assert.deepEqual(notchOf({ act: 2, cardsPlayedInAct: 3 }),
    { played: odysseyManifest.segments[0].length + 3, total });
  assert.equal(notchOf({ act: 3, cardsPlayedInAct: 999 }).played, total, 'clamps at Ithaca');
});

test('friezeTableau: data attributes state the run, inspect states the numbers', () => {
  const state = {
    act: 2, cardsPlayedInAct: 4, stats: { burnout: 37 },
    expedition: 9, poseidon: 5, athena: 3, renown: 4, flags: [],
  };
  const spec = friezeTableau(state, null);
  assert.ok(spec, 'frieze must render for a live run');
  for (const [attr, want] of [
    ['data-rowers="9"', 'rowers'], ['data-sea="mid"', 'sea'],
    ['data-owl="1"', 'owl'], ['data-deeds="2"', 'deeds'], ['data-notch="13"', 'notch'],
  ]) assert.ok(spec.html.includes(attr), `missing ${want}: ${attr}`);
  const flat = spec.inspect.map((b) => b.title).join(' | ');
  for (const needle of ['9', '5 of 10', 'Athena — 3', 'Renown — 4', '37 of 100', 'stroke 13 of 28']) {
    assert.ok(flat.includes(needle), `inspect panel missing "${needle}" in: ${flat}`);
  }
  // The owl leaves the mast below 3; the sea calms at 3.
  const low = friezeTableau({ ...state, athena: 2, poseidon: 3 }, null);
  assert.ok(low.html.includes('data-owl="0"'));
  assert.ok(low.html.includes('data-sea="calm"'));
});
