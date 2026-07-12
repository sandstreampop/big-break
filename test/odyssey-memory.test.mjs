// The fire remembers (I8; the Memory Law): the telling-ledger accumulates
// across runs, the crowd's callbacks key off it with cross-run
// no-repeat-until-exhausted, and the dead are named purely (the same seed
// always mourns the same men, so the amphora can find them again).
// Runs against dist/ (build first).

import test from 'node:test';
import assert from 'node:assert';

const { CREW, lostMan, crewAtLaunch } = await import('../dist/js/packs/odyssey/crew.js');
const { CHATTER, eligibleMemory, cycleHeard, bardPlugin } = await import('../dist/js/packs/odyssey/bard-chatter.js');
const { odysseyPresenter } = await import('../dist/js/packs/odyssey/presenter.js');
const { summarizeTelling } = await import('../dist/js/packs/odyssey/prophecy.js');

test('names in the sand are pure and never repeat within a telling', () => {
  assert.ok(CREW.length >= 14, 'the pool must outlast any plausible telling');
  // Purity: the k-th man of a seed is always the same man.
  assert.deepEqual(lostMan(7, 3), lostMan(7, 3));
  // Different seeds mourn in a different order; one telling never repeats a
  // man inside the pool's span.
  const names = new Set(Array.from({ length: CREW.length }, (_, k) => lostMan(7, k).name));
  assert.equal(names.size, CREW.length, 'a telling repeated a man before the pool was spent');
  assert.notEqual(lostMan(7, 0).name, lostMan(8, 0).name, 'two seeds mourned identically from the first loss');
  assert.equal(crewAtLaunch('kings_hall'), 12);
  assert.equal(crewAtLaunch('fishermans_hearth'), 14);
});

test('the loss line names exactly the men the band lost', () => {
  const state = { loadout: 'kings_hall', flavorSeed: 7, expedition: 10, stats: {}, flags: [] };
  const extras = odysseyPresenter.resultExtras(
    { event: { id: 'ody_a1_squall' }, deltas: [{ key: 'expedition', amount: -2 }] }, state);
  assert.ok(extras?.notices?.length, 'a crew loss must be named');
  const line = extras.notices[0].html;
  assert.ok(line.includes('two short'), line);
  // exp 10 of 12 → losses #0 and #1 for this seed, exactly.
  assert.ok(line.includes(lostMan(7, 0).name) && line.includes(lostMan(7, 1).name), line);
  // No loss, no line (and no fret on an ordinary card).
  assert.equal(odysseyPresenter.resultExtras(
    { event: { id: 'ody_a1_squall' }, deltas: [{ key: 'renown', amount: 1 }] }, state), null);
});

test('the telling-ledger accumulates and the setup stamps it onto the run', () => {
  const meta = {};
  odysseyPresenter.recordMeta(meta, {
    fragment: 'bow', endingKey: 'wrath', endingResult: null,
    named: true, nobody: false, crewLost: 5, heardCallbacks: ['bcm_one_eye'],
  });
  odysseyPresenter.recordMeta(meta, {
    fragment: null, endingKey: 'nostos', endingResult: 'success',
    named: false, nobody: true, crewLost: 2, heardCallbacks: ['bcm_drowned'],
  });
  const t = meta.odyssey.tellings;
  assert.equal(t.count, 2);
  assert.deepEqual(t.byEnding, { wrath: 1, nostos: 1 });
  assert.equal(t.lastEnding, 'nostos');
  assert.equal(t.named, 1);
  assert.equal(t.nobody, 1);
  assert.equal(t.crewLostTotal, 7);
  assert.equal(t.crewLostLast, 2);
  assert.deepEqual([...meta.odyssey.heardCallbacks].sort(), ['bcm_drowned', 'bcm_one_eye']);

  const run = { flags: [], stats: {} };
  odysseyPresenter.applySetup(run, {}, meta, false);
  assert.equal(run.tellingLedger.count, 2);
  assert.deepEqual(run.tellingLedger.heard.sort(), ['bcm_drowned', 'bcm_one_eye']);
  // Never on a daily (the shared-seed law).
  const daily = { flags: [], stats: {} };
  odysseyPresenter.applySetup(daily, {}, meta, true);
  assert.equal(daily.tellingLedger, undefined);
});

test('the crowd’s callbacks key to the ledger and never repeat until the pool is spent', () => {
  const memory = CHATTER.filter((c) => c.kind === 'memory');
  assert.ok(memory.length >= 5, 'the callback pool is too thin to compound');
  // No ledger, no memory (a first fire knows nothing).
  assert.equal(eligibleMemory({ flags: [], bardShown: [] }).length, 0);
  // A second night at the fire unlocks the base callbacks.
  const led = (extra = {}) => ({
    flags: [], bardShown: [],
    tellingLedger: { count: 2, byEnding: {}, named: 0, nobody: 0, crewLostTotal: 0, heard: [], ...extra },
  });
  const fresh = eligibleMemory(led());
  assert.ok(fresh.some((c) => c.id === 'bcm_one_eye'));
  assert.ok(fresh.some((c) => c.id === 'bcm_again'));
  // Ending-keyed callbacks appear only after that ending.
  assert.ok(!fresh.some((c) => c.id === 'bcm_drowned'));
  assert.ok(eligibleMemory(led({ lastEnding: 'wrath' })).some((c) => c.id === 'bcm_drowned'));
  assert.ok(eligibleMemory(led({ lastEnding: 'lotus' })).some((c) => c.id === 'bcm_meadow'));
  assert.ok(eligibleMemory(led({ named: 2 })).some((c) => c.id === 'bcm_named_habit'));
  assert.ok(eligibleMemory(led({ count: 5 })).some((c) => c.id === 'bcm_fee_nights'));
  // Heard callbacks stay quiet…
  const heardSome = eligibleMemory(led({ heard: ['bcm_one_eye'] }));
  assert.ok(!heardSome.some((c) => c.id === 'bcm_one_eye'));
  // …until the whole eligible pool is spent — then it resets, not starves.
  const allIds = eligibleMemory(led()).map((c) => c.id);
  const exhausted = eligibleMemory(led({ heard: allIds }));
  assert.ok(exhausted.length > 0, 'an exhausted pool must reset, never starve the fire');
});

test('the heard set REALLY cycles: exhaustion keeps only tonight’s, mid-cycle unions', () => {
  const ledger = { count: 5, byEnding: {}, named: 2, nobody: 0, crewLostTotal: 0, lastEnding: 'wrath' };
  const pool = CHATTER.filter((c) => c.kind === 'memory')
    .filter((c) => !c.when || c.when({ tellingLedger: { ...ledger, heard: [] } }))
    .map((c) => c.id);
  assert.ok(pool.length >= 3, 'pool too thin to exercise the cycle');
  // Mid-cycle: the union stands untouched.
  assert.deepEqual(cycleHeard([pool[0]], ledger, [pool[0]]), [pool[0]]);
  // Exhausted: everything the NEXT telling could hear has been heard — the
  // set resets to tonight's only, so a new cycle opens without immediately
  // repeating tonight's gags. (Without this, the persistent heard set makes
  // eligibleMemory's whole-pool fallback permanent — no-repeat dies after
  // one full cycle.)
  assert.deepEqual(cycleHeard([...pool], ledger, [pool[2]]), [pool[2]]);
  // The presenter really routes through it: an exhausted meta heard set
  // collapses to tonight's after recordMeta.
  const meta = { odyssey: { heardCallbacks: pool.filter((id) => id !== 'bcm_one_eye'),
    tellings: { count: 2, byEnding: {}, named: 0, nobody: 0, crewLostTotal: 0 } } };
  odysseyPresenter.recordMeta(meta, {
    endingKey: 'nostos', endingResult: 'success', named: false, nobody: false,
    crewLost: 0, heardCallbacks: ['bcm_one_eye'],
  });
  assert.deepEqual(meta.odyssey.heardCallbacks, ['bcm_one_eye'],
    'recordMeta must reset the cycle when the pool is exhausted');
});

test('a landmark deal refunds the queued line — suppressed is not spent', () => {
  // afterResolve picked a line for the NEXT deal; that deal was a landmark,
  // so bardBeat stayed silent — the id must leave bardShown (cap + no-repeat
  // bookkeeping) and be re-pickable later.
  const state = {
    flavorSeed: 7, cardsPlayedInAct: 3, flags: [], renown: 0,
    bardLine: 'bc_woodpile', bardShown: ['bc_open_room', 'bc_woodpile'],
  };
  bardPlugin.afterResolve(state, { event: { id: 'ody_cyclops', tags: ['landmark'] } });
  assert.ok(!state.bardShown.includes('bc_woodpile') || state.bardLine === 'bc_woodpile',
    'the suppressed line must be refunded (or immediately re-picked)');
  assert.ok(state.bardShown.includes('bc_open_room'), 'heard lines stay spent');
  // A non-landmark resolve spends normally: the queued line stays in the set.
  const heard = {
    flavorSeed: 7, cardsPlayedInAct: 4, flags: [], renown: 0,
    bardLine: 'bc_woodpile', bardShown: ['bc_open_room', 'bc_woodpile'],
  };
  bardPlugin.afterResolve(heard, { event: { id: 'ody_a1_squall', tags: [] } });
  assert.ok(heard.bardShown.includes('bc_woodpile'), 'a heard line is never refunded');
});

test('summarize never ledgers a line the fire did not hear (the final queued pick)', () => {
  const s = summarizeTelling({
    flags: [], loadout: 'kings_hall', expedition: 12,
    ending: { key: 'wrath', result: null },
    // bcm_again was picked at the run's FINAL resolve (still queued in
    // bardLine) — there was no next deal; it must not enter the ledger.
    bardShown: ['bc_open_room', 'bcm_one_eye', 'bcm_again'], bardLine: 'bcm_again',
  });
  assert.deepEqual(s.heardCallbacks, ['bcm_one_eye']);
});

test('summarize carries the ledger’s raw material', () => {
  const s = summarizeTelling({
    flags: ['ody_named'], loadout: 'fishermans_hearth', expedition: 9,
    ending: { key: 'kleos', result: 'partial' },
    bardShown: ['bc_open_room', 'bcm_one_eye'], poseidon: 2,
  });
  assert.equal(s.endingKey, 'kleos');
  assert.equal(s.endingResult, 'partial');
  assert.equal(s.crewLost, 5); // 14 aboard at launch, 9 left
  assert.deepEqual(s.heardCallbacks, ['bcm_one_eye']);
  assert.equal(s.named, true);
  assert.equal(s.nobody, false);
});
