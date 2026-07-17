// The bard's-note (P-C, pass 13) — executable invariants. One note at a
// time, always the latest telling's judged mistake, spoken as the NEXT
// telling's cold open, cleared by a clean night. Golden-safe by
// construction: the stamp happens in applySetup (UI-side, after newRun),
// and kind 'note' lines sit outside every seeded pool.

import test from 'node:test';
import assert from 'node:assert';
import { noteOf, bardBeat, CHATTER } from '../dist/js/packs/odyssey/bard-chatter.js';
import { odysseyPresenter } from '../dist/js/packs/odyssey/presenter.js';

test('noteOf judges the mistakes it claims to judge — and only those', () => {
  assert.strictEqual(noteOf({ endingKey: 'wrath', named: true }), 'bn_shout');
  assert.strictEqual(noteOf({ endingKey: 'wrath', named: false }), null, 'an unshouted wrath is the sea’s doing, not a note');
  assert.strictEqual(noteOf({ endingKey: 'nostos', endingResult: 'failure', expedition: 7, athena: 1 }), 'bn_owl');
  assert.strictEqual(noteOf({ endingKey: 'nostos', endingResult: 'partial', expedition: 7, athena: 2 }), 'bn_owl', 'the thin homecoming is the owl’s case too');
  assert.strictEqual(noteOf({ endingKey: 'nostos', endingResult: 'failure', expedition: 4, athena: 2 }), null, 'a bled fleet is not the owl’s fault');
  assert.strictEqual(noteOf({ endingKey: 'nostos', endingResult: 'partial', expedition: 7, athena: 5 }), null, 'a thin homecoming with the goddess aboard is some other story');
  assert.strictEqual(noteOf({ endingKey: 'burnout', cardLog: [{ a: 1 }, { a: 2 }, { a: 3 }] }), 'bn_beach_late');
  assert.strictEqual(noteOf({ endingKey: 'burnout', cardLog: [{ a: 1 }] }), null, 'an early beach is exhaustion, not a late collapse');
  assert.strictEqual(noteOf({ endingKey: 'calypso', expedition: 8 }), 'bn_bank_strong');
  assert.strictEqual(noteOf({ endingKey: 'calypso', expedition: 3 }), null, 'banking a wreck is prudence');
  assert.strictEqual(noteOf({ endingKey: 'circe', expedition: 6 }), 'bn_bank_strong');
  assert.strictEqual(noteOf({ endingKey: 'lotus' }), 'bn_hungry');
  assert.strictEqual(noteOf({ endingKey: 'nostos', endingResult: 'success', expedition: 9, athena: 6 }), null, 'a clean night carries no note');
  assert.strictEqual(noteOf(undefined), null);
});

test('recordMeta writes the note, a clean night clears it, a daily touches nothing', () => {
  const meta = {};
  odysseyPresenter.recordMeta(meta, { endingKey: 'wrath', named: true, heardCallbacks: [] });
  assert.strictEqual(meta.odyssey.note, 'bn_shout');
  // A daily's ending neither writes nor clears — the shared sea is nobody's confession.
  odysseyPresenter.recordMeta(meta, { endingKey: 'lotus', daily: '2026-07-17', heardCallbacks: [] });
  assert.strictEqual(meta.odyssey.note, 'bn_shout');
  odysseyPresenter.recordMeta(meta, { endingKey: 'nostos', endingResult: 'success', expedition: 9, athena: 6, heardCallbacks: [] });
  assert.strictEqual(meta.odyssey.note, null);
});

test('applySetup stamps the note as tonight’s cold open — and the beat speaks it', () => {
  const state = { flags: [], bardLine: 'bc_open_room', bardShown: ['bc_open_room'] };
  odysseyPresenter.applySetup(state, {}, { odyssey: { note: 'bn_shout' } }, false);
  assert.strictEqual(state.bardLine, 'bn_shout');
  assert.deepStrictEqual(state.bardShown, ['bn_shout']);
  const beat = bardBeat(state, { tags: [] });
  assert.ok(beat && beat.blocks.some((b) => /the shout/i.test(b.text)), 'the beat must speak the note');
});

test('a daily telling never carries the note (the shared sea is nobody’s confession)', () => {
  const state = { flags: [], bardLine: 'bc_open_room', bardShown: ['bc_open_room'] };
  odysseyPresenter.applySetup(state, {}, { odyssey: { note: 'bn_shout' } }, true);
  assert.strictEqual(state.bardLine, 'bc_open_room');
});

test('note lines sit outside every seeded pool (golden safety by shape)', () => {
  for (const c of CHATTER.filter((c) => c.kind === 'note')) {
    assert.ok(!c.when, `${c.id}: a note line must have no when() — it is stamped, never drawn`);
  }
  // And a hostile/unknown note id never breaks the stamp.
  const state = { flags: [], bardLine: 'bc_open_room', bardShown: ['bc_open_room'] };
  odysseyPresenter.applySetup(state, {}, { odyssey: { note: 'bn_nonsense' } }, false);
  assert.strictEqual(state.bardLine, 'bc_open_room', 'an unknown note must leave the cold open alone');
});
