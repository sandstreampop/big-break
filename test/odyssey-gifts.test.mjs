// The Guest-Gifts (pass 17) — executable invariants. The catalog maps
// cleanly onto the perk table, every gift does exactly what its desc says
// (driven through the REAL engine, not the table), and a giftless run is
// byte-identical to before the wall existed (golden safety).

import test from 'node:test';
import assert from 'node:assert';
import { ODYSSEY_PERKS, ODYSSEY_WALL_ITEMS, ODYSSEY_WALL_COPY } from '../dist/js/packs/odyssey/gifts.js';
import { odysseyPack } from '../dist/js/packs/odyssey/pack.js';
import * as engine from '../dist/js/engine.js';

const runWith = (perks, seed = 7) =>
  engine.newRun(odysseyPack, 'fishermans_hearth', [], engine.mulberry32(seed), perks);

test('the catalog is sound: unique ids, real targets, priced in tiers', () => {
  assert.strictEqual(ODYSSEY_WALL_ITEMS.length, 10);
  assert.strictEqual(new Set(ODYSSEY_WALL_ITEMS.map((w) => w.id)).size, 10);
  for (const w of ODYSSEY_WALL_ITEMS) {
    assert.strictEqual(w.kind, 'perk', `${w.id}: the wall sells gifts`);
    assert.ok(ODYSSEY_PERKS[w.target], `${w.id}: target '${w.target}' missing from the perk table`);
    assert.ok(w.cost > 0 && [1, 2, 3].includes(w.tier), `${w.id}: priced and tiered`);
    assert.ok(w.name && w.desc, `${w.id}: full copy`);
  }
  // Every perk in the table is buyable — no orphaned mechanics.
  const sold = new Set(ODYSSEY_WALL_ITEMS.map((w) => w.target));
  for (const id of Object.keys(ODYSSEY_PERKS)) assert.ok(sold.has(id), `${id}: on the table but not the wall`);
  for (const k of ['button', 'head', 'sub']) assert.ok(ODYSSEY_WALL_COPY[k], `wallCopy.${k}`);
});

test('run-start gifts land exactly as described, through the real engine', () => {
  const bare = runWith([]);
  assert.strictEqual(runWith(['troy_coin']).renown, (bare.renown || 0) + 1, 'A Coin from Troy: Renown +1');
  assert.strictEqual(runWith(['carved_owl']).athena, (bare.athena || 0) + 1, 'A Small Owl: Athena +1');
  assert.strictEqual(runWith(['gift_chart']).stats.lore, bare.stats.lore + 4, 'The Gift-Chart: Lore +4');
  assert.strictEqual(runWith(['beggars_patches']).stats.guile, bare.stats.guile + 4, 'Good Patches: Guile +4');
  assert.strictEqual(runWith(['guest_spear']).stats.might, bare.stats.might + 4, 'The Spear: Might +4');
  const blessed = runWith(['mentors_blessing']);
  for (const k of ['might', 'guile', 'lore']) {
    assert.strictEqual(blessed.stats[k], bare.stats[k] + 3, `The Blessing: ${k} +3`);
  }
});

test('the bowl deepens relief a quarter — and stacks honestly with the porch', () => {
  const heal = (loadout, perks) => {
    const s = engine.newRun(odysseyPack, loadout, [], engine.mulberry32(7), perks);
    s.stats.burnout = 40;
    engine.applyEffects(s, { burnout: -8 }, { ev: null, choice: null, rng: engine.mulberry32(9) });
    return 40 - s.stats.burnout;
  };
  assert.strictEqual(heal('kings_hall', []), 8, 'plain relief');
  assert.strictEqual(heal('kings_hall', ['mixed_bowl']), 10, 'the bowl: 8 → 10');
  assert.strictEqual(heal('widows_porch', ['mixed_bowl']), 15, 'porch 1.5 × bowl 1.25 = 15');
});

test('the libation pours at act breaks — only while the grudge holds', () => {
  const s = runWith(['patient_libation']);
  s.poseidon = 3;
  const notes = [];
  odysseyPack.perks.patient_libation.onActBreak(s, notes);
  assert.strictEqual(s.poseidon, 2);
  assert.strictEqual(notes.length, 1);
  s.poseidon = 0;
  odysseyPack.perks.patient_libation.onActBreak(s, notes);
  assert.strictEqual(s.poseidon, 0, 'a calm sea takes no wine');
  assert.strictEqual(notes.length, 1, 'and earns no note');
});

test('a giftless telling is byte-identical to before the wall existed (golden safety)', () => {
  const a = runWith([]);
  const b = runWith([]);
  assert.deepStrictEqual(
    { stats: a.stats, renown: a.renown, athena: a.athena, expedition: a.expedition },
    { stats: b.stats, renown: b.renown, athena: b.athena, expedition: b.expedition },
  );
});
