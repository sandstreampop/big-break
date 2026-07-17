// The crossroads reads the telling (pass 36) — executable invariants.
// Same grammar as the finale variants: priority-ordered, rarest-first,
// a default floor every run can fall back to. Pure functions of state.

import test from 'node:test';
import assert from 'node:assert';
import { crossroadsReading, crossroadsVoice } from '../dist/js/packs/odyssey/crossroads.js';

const at = (over = {}) => ({
  flags: [], expedition: 7, poseidon: 2, athena: 2, renown: 2,
  stats: { burnout: 20 }, ...over,
});

test('every run gets a line at both doors — never blank, never undefined', () => {
  const shapes = [
    at(), at({ flags: ['ody_named'], poseidon: 8 }), at({ flags: ['ody_nobody'] }),
    at({ expedition: 12 }), at({ expedition: 2 }), at({ athena: 7 }),
    at({ renown: 9 }), at({ stats: { burnout: 60 } }),
    { flags: null, stats: null }, // hostile
  ];
  for (const s of shapes) {
    for (const path of ['nostos', 'kleos']) {
      const line = crossroadsReading(s, path);
      assert.ok(typeof line === 'string' && line.length > 10, `${path}: ${line}`);
      assert.ok(!/undefined|NaN/.test(line), `${path}: "${line}"`);
    }
    const v = crossroadsVoice(s);
    assert.ok(typeof v === 'string' && v.length > 10, `voice: ${v}`);
  }
});

test('the doors read the run, rarest first', () => {
  // Nostos: a near-whole fleet outranks everything (the rarest state).
  assert.match(crossroadsReading(at({ expedition: 11, flags: ['ody_named'], poseidon: 8 }), 'nostos'), /11 hulls/);
  assert.match(crossroadsReading(at({ flags: ['ody_named'], poseidon: 6 }), 'nostos'), /knows your name/);
  assert.match(crossroadsReading(at({ expedition: 3 }), 'nostos'), /Few benches/);
  assert.match(crossroadsReading(at(), 'nostos'), /bed that does not move/, 'the floor');
  // Kleos: Nobody outranks the shout; the shout outranks mere renown.
  assert.match(crossroadsReading(at({ flags: ['ody_nobody'], renown: 9 }), 'kleos'), /Nobody blinded/);
  assert.match(crossroadsReading(at({ flags: ['ody_named'], renown: 9 }), 'kleos'), /shouted the name/);
  assert.match(crossroadsReading(at({ renown: 6 }), 'kleos'), /singing it wrong/);
  assert.match(crossroadsReading(at(), 'kleos'), /short life, the long name/, 'the floor');
});

test('the crowd leans in by what it saw', () => {
  assert.match(crossroadsVoice(at({ flags: ['ody_nobody'] })), /name goes missing/);
  assert.match(crossroadsVoice(at({ flags: ['ody_named'], poseidon: 6 })), /Neither, friends, has the water/);
  assert.match(crossroadsVoice(at({ expedition: 4 })), /empty benches/);
  assert.match(crossroadsVoice(at()), /paid either way/, 'the floor');
});

test('an unknown door stays silent (a future path cannot inherit a wrong line)', () => {
  assert.strictEqual(crossroadsReading(at(), 'someday'), null);
});
