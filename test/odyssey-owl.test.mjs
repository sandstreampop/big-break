// The owl's edge (pass 40) — executable invariants. The odyssey's one
// roll-bonus subsystem: Athena's favor past a devotion floor rides every
// roll, +1 per point past 4, capped at +8. Pure (the risk tell calls it),
// hostile-safe, and actually wired into the engine's roll.

import test from 'node:test';
import assert from 'node:assert';
import * as engine from '../dist/js/engine.js';
import { odysseyPack } from '../dist/js/packs/odyssey/pack.js';
import { owlEdge, owlPlugin } from '../dist/js/packs/odyssey/owl.js';

test('the edge curve: silent to four, +1 per point past, capped at eight', () => {
  assert.strictEqual(owlEdge({ athena: 0 }), 0);
  assert.strictEqual(owlEdge({ athena: 4 }), 0, 'the floor is devotion, not presence');
  assert.strictEqual(owlEdge({ athena: 5 }), 1);
  assert.strictEqual(owlEdge({ athena: 9 }), 5);
  assert.strictEqual(owlEdge({ athena: 12 }), 8, 'the cap');
  assert.strictEqual(owlEdge({ athena: 40 }), 8);
  assert.strictEqual(owlEdge({}), 0, 'hostile: absent');
  assert.strictEqual(owlEdge({ athena: NaN }), 0, 'hostile: NaN');
  assert.strictEqual(owlEdge({ athena: -3 }), 0, 'hostile: negative');
});

test('the plugin is registered and the engine folds the edge into real rolls', () => {
  const p = odysseyPack.plugins.find((x) => x.id === 'odyssey_owl');
  assert.ok(p, 'the owl rides the pack');
  assert.strictEqual(p, owlPlugin);
  const state = engine.newRun(odysseyPack, odysseyPack.loadouts[0].id, [], engine.mulberry32(7), []);
  const ev = odysseyPack.events.find((e) => e.id === 'ody_a1_squall');
  state.athena = 0;
  const cold = engine.rollComponents(state, ev.choices.left, {}).base;
  state.athena = 9;
  const warm = engine.rollComponents(state, ev.choices.left, {}).base;
  assert.strictEqual(warm - cold, 5, 'athena 9 adds exactly +5 to the roll');
});
