// The modes — executable invariants. The Scarred Telling transform runs on
// a freshly minted run (after the fires plugin's grants), so the hard rules
// are: the scars are SET (same scarred fleet from any fire), the veteran
// bumps clamp, the comeback flag both marks the run and pays ×1.2, and —
// load-bearing — adding the modes plugin moved no seeded draw (the golden
// suite pins that separately; here we pin the plugin's shape).

import test from 'node:test';
import assert from 'node:assert';
import * as engine from '../dist/js/engine.js';
import { odysseyPack } from '../dist/js/packs/odyssey/pack.js';
import { odysseyComeback, odysseyModesPlugin, ODYSSEY_DAILY_COPY } from '../dist/js/packs/odyssey/modes.js';

test('the transform sets the scars regardless of fire, and flags the run', () => {
  for (const fire of ['kings_hall', 'fishermans_hearth', 'soldiers_camp', 'temple_steps']) {
    const s = engine.newRun(odysseyPack, fire, [], engine.mulberry32(7), []);
    odysseyComeback(s);
    assert.strictEqual(s.expedition, 9, `${fire}: expedition`);
    assert.strictEqual(s.poseidon, 2, `${fire}: poseidon`);
    assert.strictEqual(s.stats.burnout, 22, `${fire}: despair`);
    assert.ok(s.renown >= 1, `${fire}: renown`);
    assert.ok(s.flags.includes('comeback'), `${fire}: flag`);
    for (const k of ['might', 'guile', 'lore']) assert.ok(s.stats[k] <= 100 && s.stats[k] >= 1, `${fire}: ${k} clamped`);
  }
});

test('the veteran bump is +6 per approach over the same seed’s fresh roll', () => {
  const fresh = engine.newRun(odysseyPack, 'kings_hall', [], engine.mulberry32(42), []);
  const scarred = engine.newRun(odysseyPack, 'kings_hall', [], engine.mulberry32(42), []);
  odysseyComeback(scarred);
  for (const k of ['might', 'guile', 'lore']) {
    assert.strictEqual(scarred.stats[k], Math.min(100, fresh.stats[k] + 6), k);
  }
});

test('the fire pays half again for a hard story — and only then', () => {
  assert.strictEqual(odysseyModesPlugin.scoreMult({ flags: ['comeback'] }), 1.2);
  assert.strictEqual(odysseyModesPlugin.scoreMult({ flags: [] }), 1);
  assert.strictEqual(odysseyModesPlugin.scoreMult({}), 1);
});

test('the modes plugin owns no seeded draw (golden safety by shape)', () => {
  assert.ok(!odysseyModesPlugin.onConstruct && !odysseyModesPlugin.onRunStart && !odysseyModesPlugin.stateDefaults,
    'the modes plugin must never touch run construction — that would shift every golden');
});

test('the crew ledger measures tonight’s losses against tonight’s launch', async () => {
  const { summarizeTelling } = await import('../dist/js/packs/odyssey/prophecy.js');
  // A scarred run that lost nobody TONIGHT reports zero — last telling's
  // scars are not re-counted (and ody_all_hands stays earnable in the mode).
  const scarred = { loadout: 'kings_hall', flags: ['comeback'], expedition: 9, ending: { key: 'nostos', result: 'success' }, stats: {} };
  assert.strictEqual(summarizeTelling(scarred).crewLost, 0);
  const scarredBled = { ...scarred, expedition: 5 };
  assert.strictEqual(summarizeTelling(scarredBled).crewLost, 4);
  // Fresh runs still measure against the fire's real launch (hearth = 14).
  const hearth = { loadout: 'fishermans_hearth', flags: [], expedition: 11, ending: { key: 'nostos', result: 'success' }, stats: {} };
  assert.strictEqual(summarizeTelling(hearth).crewLost, 3);
});

test('the Same Sea’s end note carries the streak honestly', () => {
  assert.match(ODYSSEY_DAILY_COPY.endNote({ dailyStreak: 1 }), /night one/i);
  assert.match(ODYSSEY_DAILY_COPY.endNote({ dailyStreak: 4 }), /Night 4/);
  assert.match(ODYSSEY_DAILY_COPY.endNote({}), /night one/i);
  assert.ok(!/undefined/.test(ODYSSEY_DAILY_COPY.endNote(undefined)));
});
