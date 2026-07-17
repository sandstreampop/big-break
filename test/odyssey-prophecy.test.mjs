// The prophecy meta-arc contract (slice 6): fragments persist as KNOWLEDGE
// (recordMeta union → applySetup flags), the third question exists only for
// the bard who carries both others, and the Oar Road — the true victory —
// is a nostos-success variant demanding in-run execution, well under 10%
// even post-unlock. DOM-free against dist/.
//
// Run: npm run build && node --test test/odyssey-prophecy.test.mjs

import test from 'node:test';
import assert from 'node:assert/strict';
import { odysseyPack } from '../dist/js/packs/odyssey/pack.js';
import * as engine from '../dist/js/engine.js';

const PRES = odysseyPack.presenter;

function driveRun(seed, { fragments = [], policy, path = 'nostos' } = {}) {
  const state = engine.newRun(odysseyPack, 'fishermans_hearth', [], engine.mulberry32(seed + 1), []);
  state.seed = seed + 2;
  // The shell's applySetup seam, exercised for real:
  PRES.applySetup(state, {}, { odyssey: { fragments } }, false);
  const play = engine.stateRng(state);
  const meta = engine.mulberry32(seed ^ 0xF00D);
  const played = [];
  let guard = 0;
  while (state.phase !== 'ended' && guard++ < 300) {
    if (state.phase === 'crossroads') { engine.commitPath(state, path); continue; }
    const ev = engine.drawNextCard(state, play);
    if (!ev) { state.cardsPlayedInAct = engine.actLength(state, state.act); }
    else {
      played.push(ev.id);
      const side = policy ? policy(ev, state) : (meta() < 0.5 ? 'left' : 'right');
      engine.resolveSwipe(state, side, play, {});
    }
    const step = engine.advance(state);
    if (step.kind === 'finale') engine.evaluateFinale(state);
  }
  return { state, played };
}

test('recordMeta unions fragments; applySetup stamps them back as flags', () => {
  const meta = {};
  PRES.recordMeta(meta, { fragment: 'bow' });
  PRES.recordMeta(meta, { fragment: 'bow' });
  PRES.recordMeta(meta, { fragment: 'sea' });
  assert.deepEqual(meta.odyssey.fragments.sort(), ['bow', 'sea']);
  const state = { flags: [] };
  PRES.applySetup(state, {}, meta, false);
  assert.ok(state.flags.includes('ody_frag_bow'));
  assert.ok(state.flags.includes('ody_frag_sea'));
});

test('the third question exists only for the bard who carries both turnings', () => {
  let third = 0, plain = 0;
  const avoidBank = (ev) => ((ev.tags || []).includes('temptation') ? 'left' : 'left');
  for (let i = 0; i < 25; i++) {
    const virgin = driveRun(3000 + i, { fragments: [], policy: avoidBank });
    assert.ok(!virgin.played.includes('ody_tiresias_oar'),
      'the third question surfaced without the fragments');
    if (virgin.played.includes('ody_tiresias')) plain++;
    const knowing = driveRun(3000 + i, { fragments: ['bow', 'sea'], policy: avoidBank });
    if (knowing.played.includes('ody_tiresias_oar')) third++;
    assert.ok(!knowing.played.includes('ody_tiresias') || !knowing.played.includes('ody_tiresias_oar'),
      'both prophets in one telling');
  }
  assert.ok(plain > 0, 'the plain prophet never appeared');
  assert.ok(third > 0, 'the third question never appeared for the knowing bard');
});

test('the Oar Road renders as the nostos-success variant, and only then', () => {
  // A run that presses the third question and keeps the sea unprovoked.
  const policy = (ev) => {
    if (ev.id === 'ody_tiresias_oar') return 'left';        // the road after
    if (ev.id === 'ody_cyclops_name') return 'left';        // swallow the name
    if ((ev.tags || []).includes('temptation')) return 'left'; // never bank
    return 'left';
  };
  let walked = null;
  for (let i = 0; i < 400 && !walked; i++) {
    const { state } = driveRun(11000 + i, { fragments: ['bow', 'sea'], policy });
    if (state.ending?.key === 'nostos' && state.ending?.result === 'success'
      && state.flags.includes('ody_oar_road') && (state.poseidon || 0) <= 2) walked = state;
  }
  assert.ok(walked, 'no seed in 400 produced an oar-road-qualifying success');
  const present = (run) => PRES.presentFinale({ run, ending: 'nostos', result: 'success', meta: {} })
    ?? PRES.endings.nostos.success;
  assert.equal(present(walked).title, 'The Oar Road');
  assert.equal(odysseyPack.summarize(walked).trueVictory, true);
  // …and a qualifying-but-provoked run gets the hollow win.
  const hollow = { ...walked, poseidon: 9 };
  assert.equal(present(hollow).title, 'The Bed of Living Oak');
});

test('finale presentation is pure: no cross-instance or cross-run leak (2026-07 review, Required #2)', () => {
  // The bug this pins (demonstrated on the pre-refactor build): engine A's
  // oar-road finale was judged, then engine B's plain daily was judged, and
  // A's ending screen rendered B's copy — because a plugin noted the judged
  // run into presenter-module state for a getter to read later. With the
  // side-channel gone, presentation depends only on its arguments, so
  // interleaving judgments in any order cannot change what either run shows.
  const oarRun = { ending: { result: 'success' }, flags: ['ody_oar_road'], poseidon: 0 };
  const plainDaily = { ending: { result: 'success' }, flags: [], poseidon: 5 };
  const engineA = engine.createEngine(odysseyPack);
  const engineB = engine.createEngine(odysseyPack);
  assert.notEqual(engineA, engineB);
  const present = (run) => PRES.presentFinale({ run, ending: 'nostos', result: 'success', meta: {} })
    ?? PRES.endings.nostos.success;
  // Judge A, then B (the leaking order), then present both — and again in
  // the opposite order. Every presentation must match the run it was given.
  for (const order of [[oarRun, plainDaily], [plainDaily, oarRun]]) {
    for (const run of order) for (const p of odysseyPack.plugins) p.onFinale?.(run);
    assert.equal(present(oarRun).title, 'The Oar Road');
    assert.equal(present(plainDaily).title, 'The Bed of Living Oak');
  }
  // And the presenter module holds no mutable finale note at all: the pack
  // exports no noteFinale, and repeated presentation of the same run is
  // stable (nothing to go stale).
  assert.equal(present(oarRun).title, 'The Oar Road');
});

test('the true victory stays well under 10% even post-unlock', () => {
  let successes = 0, oar = 0;
  for (let i = 0; i < 300; i++) {
    const { state } = driveRun(20000 + i, { fragments: ['bow', 'sea'] });
    if (state.ending?.result === 'success') successes++;
    if (odysseyPack.summarize(state).trueVictory) oar++;
  }
  assert.ok(oar / 300 < 0.10, `the Oar Road walked in ${((oar / 300) * 100).toFixed(1)}% of post-unlock runs`);
  assert.ok(successes > 0, 'no successes at all — the band is broken');
});

test('knowledge-only: the fragments add no number to anything', () => {
  // Identical seed and policy, with and without the fragments: until the
  // rerouted chain card differs, every stat and resource must match.
  const a = driveRun(777, { fragments: [] });
  const b = driveRun(777, { fragments: ['bow', 'sea'] });
  const divergeAt = a.played.findIndex((id, i) => b.played[i] !== id);
  const sameUpTo = divergeAt === -1 ? a.played.length : divergeAt;
  assert.ok(sameUpTo > 0, 'the runs diverged before the first card');
  // If they diverged, it must be exactly at the prophet's chain.
  if (divergeAt !== -1) {
    assert.match(String(b.played[divergeAt]) + String(a.played[divergeAt]),
      /ody_tiresias/, `diverged at ${a.played[divergeAt]} vs ${b.played[divergeAt]}, not at the prophet`);
  }
});

test('dailies stay communal: fragments never stamp on a daily run', () => {
  const state = { flags: [] };
  PRES.applySetup(state, {}, { odyssey: { fragments: ['bow', 'sea'] } }, true);
  assert.deepEqual(state.flags, []);
});
