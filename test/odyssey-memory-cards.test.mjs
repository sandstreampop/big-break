// The fire remembers (pass 22) — executable invariants for the
// history-gated DECK layer (distinct from odyssey-memory.test.mjs, which
// pins the I8 telling-ledger/callbacks). History-gated cards fire ONLY on a
// normal telling whose previous telling ended the gated way; shared water
// (daily/gauntlet) refuses them wholesale (the P18 law); a fresh bard (no
// history) never sees them — which is also the golden-safety proof, since
// sims never stamp history.

import test from 'node:test';
import assert from 'node:assert';
import { odysseyPack } from '../dist/js/packs/odyssey/pack.js';
import { MEMORY_EVENTS } from '../dist/js/packs/odyssey/events-memory.js';
import * as engine from '../dist/js/engine.js';

const MEM_IDS = MEMORY_EVENTS.map((e) => e.id);

const runWith = (over = {}) => {
  engine.useContentPack(odysseyPack);
  const s = engine.newRun(odysseyPack, 'kings_hall', [], engine.mulberry32(7), []);
  Object.assign(s, over);
  return s;
};
const eligibleMem = (s) => engine.eligibleEvents(s).filter((e) => MEM_IDS.includes(e.id)).map((e) => e.id);

test('five memory cards, one per ending class, all gated', () => {
  assert.strictEqual(MEMORY_EVENTS.length, 5);
  for (const e of MEMORY_EVENTS) assert.ok(e.requires?.lastEnding, `${e.id}: ungated memory card`);
});

test('a fresh bard sees none of them (and neither do sims/goldens)', () => {
  assert.deepStrictEqual(eligibleMem(runWith()), []);
  assert.deepStrictEqual(eligibleMem(runWith({ history: [] })), []);
});

test('the fire remembers exactly the last telling', () => {
  const s = runWith({ history: [{ endingKey: 'nostos' }, { endingKey: 'wrath' }] });
  const ids = eligibleMem(s);
  assert.ok(ids.includes('ody_mem_wrath'), 'last night was the wrath — the widow asks');
  assert.ok(!ids.includes('ody_mem_home'), 'the nostos was two nights ago — the fire has moved on');
});

test('the banked-island card hears either warm island', () => {
  assert.ok(eligibleMem(runWith({ history: [{ endingKey: 'circe' }] })).includes('ody_mem_bank'));
  assert.ok(eligibleMem(runWith({ history: [{ endingKey: 'calypso' }] })).includes('ody_mem_bank'));
  assert.ok(!eligibleMem(runWith({ history: [{ endingKey: 'lotus' }] })).includes('ody_mem_bank'), 'the meadow has its own card');
});

test('shared water refuses the fire’s memory wholesale (the P18 law)', () => {
  const history = [{ endingKey: 'wrath' }];
  assert.deepStrictEqual(eligibleMem(runWith({ history, daily: '2026-07-18' })), [], 'the daily forks on nothing personal');
  assert.deepStrictEqual(eligibleMem(runWith({ history, gauntlet: '2026-W29' })), [], 'the Gauntlet forks on nothing personal');
});

test('every memory card resolves through the real engine and leaves the run playable', () => {
  for (const ev of MEMORY_EVENTS) {
    const gate = ev.requires.lastEnding;
    const s = runWith({ history: [{ endingKey: Array.isArray(gate) ? gate[0] : gate }] });
    const before = s.cardLog.length;
    s.currentEventId = ev.id;
    const result = engine.resolveSwipe(s, 'left', engine.mulberry32(11));
    assert.ok(result?.tier, `${ev.id}: no tier resolved`);
    assert.strictEqual(s.cardLog.length, before + 1, `${ev.id}: the card never logged`);
    assert.ok(s.phase !== 'ended', `${ev.id}: a memory card must never end the run`);
  }
});
