// The fires (loadouts) — pass 16 grew the roster to six rooms. Executable
// invariants: the roster's shape, each fire's one crisp edge, the deck leans,
// and the porch's soothe multiplier reaching the engine's gain-bag fold.

import test from 'node:test';
import assert from 'node:assert';
import { FIRES, firesPlugin } from '../dist/js/packs/odyssey/fires.js';
import { odysseyPack } from '../dist/js/packs/odyssey/pack.js';
import * as engine from '../dist/js/engine.js';

test('six fires, unique ids, all singable tonight', () => {
  assert.strictEqual(FIRES.length, 6);
  assert.strictEqual(new Set(FIRES.map((f) => f.id)).size, 6);
  for (const f of FIRES) {
    assert.ok(f.unlockedByDefault, `${f.id}: every fire is open`);
    assert.ok(f.name && f.flavor && f.quirk?.name && f.quirk?.desc, `${f.id}: full copy`);
  }
});

test('each fire has exactly one crisp edge', () => {
  const edge = (f) => [f.grants, f.modifiers, f.soothe].filter(Boolean).length;
  for (const f of FIRES) assert.strictEqual(edge(f), 1, `${f.id}: one edge, not ${edge(f)}`);
  assert.strictEqual(FIRES.find((f) => f.id === 'pilots_bench').modifiers.lore, 8);
  assert.strictEqual(FIRES.find((f) => f.id === 'widows_porch').soothe, 1.5);
});

test('the deck leans the crowd’s way at the new fires', () => {
  const w = (loadout, tags) => firesPlugin.weightDeck({ loadout }, { tags }, 1);
  assert.strictEqual(w('pilots_bench', ['deep']), 1.5, 'the bench respects the hard water');
  assert.strictEqual(w('pilots_bench', ['omen']), 0.8, 'the bench distrusts god-talk');
  assert.strictEqual(w('widows_porch', ['blood']), 0.5, 'the porch wants no blood');
  assert.strictEqual(w('widows_porch', ['kleos']), 0.8, 'nor brag');
  assert.strictEqual(w('widows_porch', ['sea']), 1, 'plain water passes untouched');
});

test('the porch’s soothe reaches the engine: relief lands half again as deep', () => {
  assert.deepStrictEqual(firesPlugin.gainHooks({ loadout: 'widows_porch' }), { burnoutHealMult: 1.5 });
  assert.strictEqual(firesPlugin.gainHooks({ loadout: 'kings_hall' }), null, 'other fires contribute nothing');
  // Behavioral, through the real engine: the same healing card eases Despair
  // more at the porch than at the hall.
  const runAt = (loadout) => {
    const s = engine.newRun(odysseyPack, loadout, [], engine.mulberry32(7), []);
    s.stats.burnout = 40;
    engine.applyEffects(s, { burnout: -10 }, { ev: null, choice: null, rng: engine.mulberry32(9) });
    return s.stats.burnout;
  };
  const hall = runAt('kings_hall');
  const porch = runAt('widows_porch');
  assert.strictEqual(hall, 30, 'the hall heals the plain 10');
  assert.strictEqual(porch, 25, 'the porch heals 15 — half again as deep');
});

test('a new fire never bends a seeded draw for the old ones (rng-free hooks)', () => {
  // gainHooks/weightDeck consume no rng; onRunStart grants only for the
  // selected fire. Two runs at an OLD fire, same seed, must be identical.
  const trace = () => {
    const s = engine.newRun(odysseyPack, 'kings_hall', [], engine.mulberry32(11), []);
    return JSON.stringify({ stats: s.stats, renown: s.renown, expedition: s.expedition });
  };
  assert.strictEqual(trace(), trace());
});
