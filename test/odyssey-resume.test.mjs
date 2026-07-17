// The fire re-lights (pass 37) — executable invariants for the resume
// recap. Pure read of (state, seed): same telling, same reorientation;
// works in EVERY act (the act recap skips act 1 — a resumed act 1 must
// not); the last stretch retells the cardLog's own recap lines.

import test from 'node:test';
import assert from 'node:assert';
import * as engine from '../dist/js/engine.js';
import { odysseyPack } from '../dist/js/packs/odyssey/pack.js';
import { odysseyResumeRecap } from '../dist/js/packs/odyssey/recap.js';

engine.useContentPack(odysseyPack);

const mid = (over = {}) => ({
  act: 2, loadout: 'kings_hall', expedition: 8, poseidon: 3, athena: 4,
  flags: ['ody_named'], stats: { burnout: 25 },
  cardLog: [
    { e: 'ody_a1_squall', t: 'good', a: 1, s: 'left' },
    { e: 'ody_a2_siren_rumor', t: 'good', a: 2, s: 'left' },
    { e: 'ody_a2_dead_calm', t: 'bad', a: 2, s: 'right' },
  ],
  ...over,
});

test('every act reorients — including act 1, which the act recap skips', () => {
  for (const act of [1, 2, 3]) {
    const spec = odysseyResumeRecap(mid({ act }), 7);
    assert.ok(spec, `act ${act}`);
    assert.ok(spec.kicker && /FIRE|EMBERS|CUP/.test(spec.kicker), spec.kicker);
    assert.ok(spec.title.length > 3);
    const labels = spec.blocks.map((b) => b.label).filter(Boolean);
    assert.ok(labels.includes('The count'), `act ${act}: ${labels}`);
    assert.ok(labels.includes('The gods'), `act ${act}: ${labels}`);
    for (const b of spec.blocks) assert.ok(!/undefined|NaN/.test(b.html), b.html);
  }
});

test('the last stretch retells the cardLog in the deck’s own recap lines', () => {
  const spec = odysseyResumeRecap(mid(), 7);
  const last = spec.blocks.find((b) => b.label === 'The last stretch');
  assert.ok(last, 'a telling three cards in has a last stretch');
  assert.match(last.html, /The traders pointed at their ears\./, 'the siren rumor’s recap line');
  assert.match(last.html, /Six days of dead calm\./);
});

test('pure: same telling, same reorientation; the name block follows the flag', () => {
  assert.deepStrictEqual(odysseyResumeRecap(mid(), 7), odysseyResumeRecap(mid(), 7));
  const named = odysseyResumeRecap(mid(), 7);
  assert.ok(named.blocks.some((b) => b.label === 'The name'));
  const unnamed = odysseyResumeRecap(mid({ flags: [] }), 7);
  assert.ok(!unnamed.blocks.some((b) => b.label === 'The name'));
});

test('a hostile or thin state still reorients without lying', () => {
  const spec = odysseyResumeRecap({ act: 9, flags: null, cardLog: null, stats: null }, 1);
  assert.ok(spec.title.length > 3, 'an out-of-range act falls to the last title');
  assert.ok(!spec.blocks.some((b) => b.label === 'The last stretch'), 'no cardLog, no stretch');
  for (const b of spec.blocks) assert.ok(!/undefined|NaN/.test(b.html), b.html);
});
