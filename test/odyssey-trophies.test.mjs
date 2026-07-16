// The odyssey trophy shelf — executable invariants (working agreement rule 2).
// The shell's trophy loop (js/ui/endings.ts) calls check(summary) on EVERY
// run end and special(meta) against whatever meta save exists — so the hard
// rules are: ids unique, categories legal, predicates never throw on minimal
// or legacy shapes, every special is registered, and the load-bearing
// predicates actually fire on the summaries they describe.

import test from 'node:test';
import assert from 'node:assert';
import { ODYSSEY_TROPHIES, ODYSSEY_TROPHY_SPECIALS } from '../dist/js/packs/odyssey/trophies.js';

test('trophy ids are unique and categories legal', () => {
  const ids = ODYSSEY_TROPHIES.map((t) => t.id);
  assert.strictEqual(new Set(ids).size, ids.length, 'duplicate trophy id');
  for (const t of ODYSSEY_TROPHIES) {
    assert.ok(['endings', 'feats', 'career'].includes(t.cat), `${t.id}: bad cat ${t.cat}`);
    assert.ok(t.name && t.icon && t.desc, `${t.id}: missing display fields`);
    assert.ok(!!t.check !== !!t.special, `${t.id}: must have exactly one of check/special`);
  }
});

test('checks never throw on minimal, empty, or legacy summaries', () => {
  const shapes = [
    {},
    { result: null, endingKey: null, flags: [] },
    { result: 'success', path: 'nostos', tierLog: undefined, stats: undefined },
    { result: 'partial', path: 'kleos', tierLog: [], stats: {}, flags: undefined },
  ];
  for (const t of ODYSSEY_TROPHIES) {
    if (!t.check) continue;
    for (const s of shapes) assert.doesNotThrow(() => t.check(s), `${t.id} threw on ${JSON.stringify(s)}`);
  }
});

test('every special names a registered predicate, and specials tolerate empty meta', () => {
  for (const t of ODYSSEY_TROPHIES) {
    if (!t.special) continue;
    assert.ok(ODYSSEY_TROPHY_SPECIALS[t.special], `${t.id}: special "${t.special}" unregistered`);
  }
  for (const [k, fn] of Object.entries(ODYSSEY_TROPHY_SPECIALS)) {
    assert.doesNotThrow(() => fn(undefined), `${k} threw on undefined meta`);
    assert.doesNotThrow(() => fn({}), `${k} threw on {} meta`);
    assert.strictEqual(fn({}), false, `${k} fired on an empty meta`);
  }
});

const by = (id) => ODYSSEY_TROPHIES.find((t) => t.id === id);
const fires = (id, s) => by(id).check(s);

test('the load-bearing predicates fire on the summaries they describe', () => {
  assert.ok(fires('ody_win_nostos', { path: 'nostos', result: 'success' }));
  assert.ok(!fires('ody_win_nostos', { path: 'nostos', result: 'partial' }));
  assert.ok(fires('ody_win_kleos', { path: 'kleos', result: 'success' }));
  assert.ok(fires('ody_oar_road', { trueVictory: true }));
  assert.ok(fires('ody_wrath', { endingKey: 'wrath' }));
  assert.ok(fires('ody_banked', { endingKey: 'circe' }));
  assert.ok(fires('ody_beach', { endingKey: 'burnout' }));
  assert.ok(fires('ody_harbor_light', { path: 'nostos', result: 'failure' }));
  assert.ok(fires('ody_paid_bard', {}));
  // crewLost missing must NOT award the perfect-fleet feat (legacy summaries).
  assert.ok(fires('ody_all_hands', { result: 'success', crewLost: 0 }));
  assert.ok(!fires('ody_all_hands', { result: 'success' }));
  assert.ok(fires('ody_unprovoked', { result: 'partial', poseidon: 0 }));
  assert.ok(!fires('ody_unprovoked', { result: 'partial' }));
  assert.ok(fires('ody_named_win', { named: true, result: 'success' }));
  assert.ok(fires('ody_nobody_glory', { nobody: true, path: 'kleos', result: 'success' }));
  // The kind sea needs a REAL tier log — an empty one must not award it.
  assert.ok(fires('ody_kind_sea', { result: 'success', tierLog: ['good', 'incredible'] }));
  assert.ok(!fires('ody_kind_sea', { result: 'success', tierLog: [] }));
  assert.ok(!fires('ody_kind_sea', { result: 'success', tierLog: ['good', 'bad'] }));
  assert.ok(fires('ody_stood_up', { result: 'success', stats: { burnout: 71 } }));
  // A banked daily telling (result null, endingKey set) still counts as
  // finishing the shared telling; a daily abandoned mid-run does not.
  assert.ok(fires('ody_same_sea', { daily: '2026-07-16', result: 'partial', endingKey: 'nostos' }));
  assert.ok(fires('ody_same_sea', { daily: '2026-07-16', result: null, endingKey: 'calypso' }));
  assert.ok(!fires('ody_same_sea', { daily: '2026-07-16', result: null, endingKey: null }));
  assert.ok(!fires('ody_same_sea', { daily: null, result: 'partial', endingKey: 'nostos' }));
  // The unprovoked feat is a finale feat by design — a lotus bank at
  // poseidon 0 in act 1 must not buy it.
  assert.ok(!fires('ody_unprovoked', { result: null, endingKey: 'lotus', poseidon: 0 }));
});

test('the ledger specials fire on the metas they describe', () => {
  const sp = ODYSSEY_TROPHY_SPECIALS;
  assert.ok(sp.threeTurnings({ odyssey: { fragments: ['sea', 'bow', 'oar'] } }));
  assert.ok(!sp.threeTurnings({ odyssey: { fragments: ['sea', 'bow'] } }));
  assert.ok(sp.fiveTellings({ odyssey: { tellings: { count: 5 } } }));
  assert.ok(sp.fiveEndings({ odyssey: { tellings: { byEnding: { nostos: 1, kleos: 2, wrath: 1, lotus: 1, burnout: 3 } } } }));
  assert.ok(!sp.fiveEndings({ odyssey: { tellings: { byEnding: { nostos: 9 } } } }));
  assert.ok(sp.fortyLost({ odyssey: { tellings: { crewLostTotal: 41 } } }));
});
