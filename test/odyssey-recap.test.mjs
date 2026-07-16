// The act recap — executable invariants (working agreement rule 2). The
// recap is a presenter hook the shell calls on the act-break interstitial:
// it must be PURE (deals re-render on resume), act-1-silent (the opening
// overture is fixed), truthful to the run that earned it, and must never
// leak an undefined into player-facing markup.

import test from 'node:test';
import assert from 'node:assert';
import { odysseyRecap } from '../dist/js/packs/odyssey/recap.js';

const run = (over = {}) => ({
  act: 2, loadout: 'kings_hall', flags: [], stats: { burnout: 20 },
  expedition: 9, athena: 4, poseidon: 2, renown: 3, flavorSeed: 1234,
  cardsPlayedInAct: 0,
  ...over,
});

test('act 1 keeps its fixed overture (recap null); acts 2–3 recap', () => {
  assert.strictEqual(odysseyRecap(run(), 1, 1234), null);
  assert.ok(odysseyRecap(run(), 2, 1234));
  assert.ok(odysseyRecap(run({ act: 3 }), 3, 1234));
});

test('pure: same state + seed → byte-identical recap', () => {
  const a = JSON.stringify(odysseyRecap(run(), 2, 777));
  const b = JSON.stringify(odysseyRecap(run(), 2, 777));
  assert.strictEqual(a, b);
});

test('seed rotates the wording, state fixes the facts', () => {
  const a = JSON.stringify(odysseyRecap(run(), 2, 1));
  let varied = false;
  for (let s = 2; s < 12; s++) {
    if (JSON.stringify(odysseyRecap(run({ flavorSeed: s }), 2, s)) !== a) { varied = true; break; }
  }
  assert.ok(varied, 'ten different seeds never changed a single word');
});

test('the count block tells the truth about the fleet', () => {
  const whole = odysseyRecap(run({ expedition: 12 }), 2, 5);
  assert.ok(JSON.stringify(whole.blocks).match(/whole|every man/i), 'a full fleet must be told as whole');
  const bled = odysseyRecap(run({ expedition: 7 }), 2, 5);
  assert.ok(JSON.stringify(bled.blocks).includes('>7<'), 'a bled fleet must state its count');
  const desperate = odysseyRecap(run({ expedition: 3 }), 2, 5);
  const txt = JSON.stringify(desperate.blocks);
  assert.ok(txt.includes('>3<') || txt.includes('3 remain'), 'a desperate fleet must state its count');
});

test('the name block follows the cyclops choice — and is absent before it', () => {
  const named = JSON.stringify(odysseyRecap(run({ flags: ['ody_named'] }), 2, 5).blocks);
  assert.ok(/name|sea has it|Renown/i.test(named));
  const nobody = JSON.stringify(odysseyRecap(run({ flags: ['ody_nobody'] }), 2, 5).blocks);
  assert.ok(/Nobody|anchor-stone|unprovoked/i.test(nobody));
  const neither = odysseyRecap(run({ flags: [] }), 2, 5);
  assert.ok(!neither.blocks.some((b) => b.label === 'The name'), 'no name block before the cave has posed the question');
});

test('the gods block reads the actual sea state', () => {
  const calm = JSON.stringify(odysseyRecap(run({ poseidon: 0 }), 2, 5).blocks);
  assert.ok(/calm/i.test(calm));
  const wrath = JSON.stringify(odysseyRecap(run({ poseidon: 9 }), 2, 5).blocks);
  assert.ok(/oxblood/i.test(wrath));
});

test('no undefined/NaN ever reaches the markup, even on hostile state', () => {
  for (const hostile of [
    run({ expedition: undefined, athena: undefined, poseidon: undefined, flags: undefined, loadout: 'nonsense' }),
    run({ expedition: -5, poseidon: 99, athena: 99 }),
    run({ flavorSeed: undefined }),
  ]) {
    for (const act of [2, 3]) {
      const r = odysseyRecap(hostile, act, hostile.flavorSeed || 1);
      const txt = JSON.stringify(r);
      assert.ok(!/undefined|NaN/.test(txt), `hostile state leaked into act ${act} recap: ${txt.slice(0, 200)}`);
    }
  }
});

test('every block carries the scene or a label + body, and the road ahead closes it', () => {
  for (const act of [2, 3]) {
    const r = odysseyRecap(run({ act }), act, 42);
    assert.ok(r.kicker && r.title);
    assert.strictEqual(r.blocks[0].cls, 'recap-scene');
    const last = r.blocks[r.blocks.length - 1];
    assert.strictEqual(last.label, 'The road ahead');
    assert.ok(last.html.length > 100, 'the road ahead must carry the overture whole');
  }
});
