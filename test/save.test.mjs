// Unit tests for js/save.ts — the one subsystem where a silent bug corrupts
// real player data (localStorage progression + in-progress run resume), and
// which had zero coverage. DOM-free: we shim a minimal in-memory localStorage
// (the module reads the global lazily, at call time), so these run under plain
// `node --test` against the built dist/.
//
// Run: node --test test/save.test.mjs   (swept up by node --test test/*.test.mjs)

import test from 'node:test';
import assert from 'node:assert/strict';

// A controllable localStorage stand-in. `throwOnSet` simulates a full quota /
// private-mode tab (Safari throws on setItem); `seed` pre-loads raw strings so
// we can inject corrupt or legacy payloads the module must survive.
function makeStorage({ throwOnSet = false, seed = {} } = {}) {
  const map = new Map(Object.entries(seed));
  return {
    _map: map,
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => { if (throwOnSet) throw new Error('QuotaExceeded'); map.set(k, String(v)); },
    removeItem: (k) => { map.delete(k); },
    clear: () => map.clear(),
  };
}
function useStorage(opts) {
  const s = makeStorage(opts);
  globalThis.localStorage = s;
  return s;
}

const save = await import('../dist/js/save.js');
// Music's unlock pools moved out of the (now genre-neutral) save layer into the
// music pack; the gating rule they enforce is still worth pinning here.
const { musicUnlockedContractIds } = await import('../dist/js/packs/music/save.js');
const META_KEY = 'bigbreak_meta_v1';
const RUN_KEY = 'bigbreak_run_v1';

test('loadMeta returns defaults on empty storage', () => {
  useStorage();
  save.setSaveNamespace('');
  const meta = save.loadMeta();
  assert.equal(meta.lp, 0);
  assert.equal(meta.runs, 0);
  assert.deepEqual(meta.unlockedWall, []);
  assert.ok(meta.settings && typeof meta.settings.sound === 'boolean');
  assert.ok(meta.best && meta.best.lp === 0); // neutral score record (packs add their own, e.g. music best.fame)
});

test('loadMeta schema-migrates: old partial save gets new default keys', () => {
  // A save written by an older build lacks fields added since (settings/best).
  useStorage({ seed: { [META_KEY]: JSON.stringify({ lp: 42, runs: 3, unlockedWall: ['perk_x'] }) } });
  save.setSaveNamespace('');
  const meta = save.loadMeta();
  assert.equal(meta.lp, 42);            // preserved
  assert.equal(meta.runs, 3);           // preserved
  assert.deepEqual(meta.unlockedWall, ['perk_x']);
  assert.ok(meta.settings, 'missing settings backfilled from defaults');
  assert.ok(meta.best, 'missing best backfilled from defaults');
});

test('loadMeta migrates the legacy per-loadout mastery key (byInstrument → byLoadout)', () => {
  // A career saved before the genre-neutral rename keyed the mastery aggregate
  // `lifetime.byInstrument`. It must survive as `byLoadout` so players keep the
  // mastery stars the setup screen and trophies read off it.
  useStorage({ seed: { [META_KEY]: JSON.stringify({
    lp: 5, lifetime: { swipes: 10, byInstrument: { melodica: { runs: 4, wins: 2 } }, byPath: {} },
  }) } });
  save.setSaveNamespace('');
  const meta = save.loadMeta();
  assert.deepEqual(meta.lifetime.byLoadout, { melodica: { runs: 4, wins: 2 } }, 'renamed in place');
  assert.equal(meta.lifetime.byInstrument, undefined, 'legacy key removed');
  assert.equal(meta.lifetime.swipes, 10, 'sibling lifetime fields untouched');
});

test('loadMeta does not clobber byLoadout when both keys are present', () => {
  // Belt-and-suspenders: a save already migrated (byLoadout present) must keep
  // it even if a stale byInstrument lingers.
  useStorage({ seed: { [META_KEY]: JSON.stringify({
    lifetime: { byInstrument: { melodica: { runs: 9, wins: 9 } }, byLoadout: { guitar: { runs: 1, wins: 1 } } },
  }) } });
  save.setSaveNamespace('');
  const meta = save.loadMeta();
  assert.deepEqual(meta.lifetime.byLoadout, { guitar: { runs: 1, wins: 1 } }, 'existing byLoadout wins');
});

test('loadMeta survives corrupt JSON, falling back to defaults', () => {
  useStorage({ seed: { [META_KEY]: '{not valid json' } });
  save.setSaveNamespace('');
  const meta = save.loadMeta();
  assert.equal(meta.lp, 0);
  assert.ok(meta.settings);
});

test('saveMeta round-trips through loadMeta', () => {
  useStorage();
  save.setSaveNamespace('');
  const m = save.loadMeta();
  m.lp = 17; m.runs = 5;
  save.saveMeta(m);
  const back = save.loadMeta();
  assert.equal(back.lp, 17);
  assert.equal(back.runs, 5);
});

test('saveMeta swallows a quota/private-mode failure instead of throwing', () => {
  useStorage({ throwOnSet: true });
  save.setSaveNamespace('');
  assert.doesNotThrow(() => save.saveMeta(save.loadMeta()), 'a full store must not crash the game');
});

test('loadRun resumes only a live v1 run', () => {
  const s = useStorage();
  save.setSaveNamespace('');
  assert.equal(save.loadRun(), null, 'nothing saved -> no resume');

  save.saveRun({ version: 1, phase: 'playing', foo: 1 });
  assert.ok(save.loadRun(), 'a live v1 run resumes');

  save.saveRun({ version: 1, phase: 'ended' });
  assert.equal(save.loadRun(), null, 'an ended run does not resume');

  save.saveRun({ version: 2, phase: 'playing' });
  assert.equal(save.loadRun(), null, 'a foreign version does not resume');

  s._map.set(RUN_KEY, '{corrupt');
  assert.equal(save.loadRun(), null, 'a corrupt run payload does not resume');
});

test('clearRun / resetAll remove keys', () => {
  const s = useStorage();
  save.setSaveNamespace('');
  save.saveMeta(save.loadMeta());
  save.saveRun({ version: 1, phase: 'playing' });
  save.clearRun();
  assert.equal(s._map.has(RUN_KEY), false);
  assert.equal(s._map.has(META_KEY), true, 'clearRun leaves meta alone');
  save.resetAll();
  assert.equal(s._map.has(META_KEY), false);
});

test('namespaces keep two packs from clobbering each other', () => {
  const s = useStorage();
  save.setSaveNamespace('');
  const m = save.loadMeta(); m.lp = 100; save.saveMeta(m);
  save.setSaveNamespace('love-island');
  const li = save.loadMeta(); li.lp = 7; save.saveMeta(li);
  assert.ok(s._map.has(META_KEY), 'music keeps the unsuffixed key');
  assert.ok(s._map.has(`${META_KEY}_love-island`), 'LI gets its own suffixed key');
  save.setSaveNamespace('');
  assert.equal(save.loadMeta().lp, 100, 'music meta untouched by the LI write');
});

test('export/import round-trips a career', () => {
  useStorage();
  save.setSaveNamespace('');
  const m = save.loadMeta(); m.lp = 55; save.saveMeta(m);
  save.saveRun({ version: 1, phase: 'playing' });
  const code = save.exportSave();
  assert.ok(code.startsWith('BB1.'));

  useStorage(); // wipe, then import into a clean store
  save.setSaveNamespace('');
  assert.equal(save.importSave(code), true);
  assert.equal(save.loadMeta().lp, 55);
  assert.ok(save.loadRun(), 'the in-progress run imported too');
});

test('importSave rejects a code from another game (cross-pack corruption guard)', () => {
  useStorage();
  save.setSaveNamespace('');
  const m = save.loadMeta(); m.lp = 9; save.saveMeta(m);
  const musicCode = save.exportSave();

  useStorage();
  save.setSaveNamespace('love-island');
  assert.equal(save.importSave(musicCode), false, 'a music code must not write into LI keys');
  assert.equal(save.loadMeta().lp, 0, 'LI meta untouched by the rejected import');
});

test('importSave rejects malformed / wrong-version codes', () => {
  useStorage();
  save.setSaveNamespace('');
  assert.equal(save.importSave('not a code'), false);
  assert.equal(save.importSave('BB1.@@@notbase64@@@'), false);
  const badVersion = 'BB1.' + Buffer.from(JSON.stringify({ v: 2, ns: '', meta: {} })).toString('base64');
  assert.equal(save.importSave(badVersion), false);
});

test('unlockedContractIds gate on a finished run', () => {
  useStorage();
  save.setSaveNamespace('');
  const meta = save.loadMeta();
  assert.deepEqual(musicUnlockedContractIds(meta), [], 'no contracts before the first finished run');
  meta.runs = 1;
  const ids = musicUnlockedContractIds(meta);
  assert.ok(ids.includes('nepo_baby') && ids.includes('straight_edge'), 'starter contracts appear after run 1');
});
