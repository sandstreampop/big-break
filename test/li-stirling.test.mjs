// Stirling bark engine (ADR-0008) unit tests: every authored line passes the
// pack's taste floor; selection is seeded, condition-filtered, priority-
// weighted, and no-repeat-until-exhausted; the ceremony forecast is TRUTHFUL
// (it must agree with the coupling plugin's real survival math).
//
// Run: node --test test/li-stirling.test.mjs (build first)

import test from 'node:test';
import assert from 'node:assert/strict';
import * as engine from '../dist/js/engine.js';
import { loveIslandPack } from '../dist/js/packs/love-island/pack.js';
import { stirlingPlugin, stirlingDealNote, stirlingStance } from '../dist/js/packs/love-island/plugins/stirling.js';
import { COUPLING, ceremonyOutlook } from '../dist/js/packs/love-island/plugins/coupling.js';
import {
  REACT_INCREDIBLE, REACT_BAD, REACT_TAGGED, BEAT_VERDICT, BEAT_REACT, FORECAST, SCENE_STAMP,
  TUTOR, MEMORY,
} from '../dist/js/packs/love-island/stirling-lines.js';
import { LOVE_ISLAND_TASTE } from '../docs/games/love-island/taste.mjs';
import { tasteIssues } from '../tools/taste-core.mjs';

const ALL_LINES = [
  ...REACT_INCREDIBLE, ...REACT_BAD,
  ...Object.values(REACT_TAGGED).flatMap((t) => [...t.incredible, ...t.bad]),
  ...Object.values(BEAT_VERDICT).flat(),
  ...Object.values(BEAT_REACT).flat(),
  ...Object.values(FORECAST).flat(),
  ...Object.values(SCENE_STAMP).flat(),
  ...Object.values(TUTOR).flat(),
  ...Object.values(MEMORY).flat(),
];

function fresh(seed = 7, persona = 'retriever_girl') {
  const state = engine.newRun(loveIslandPack, persona, [], engine.mulberry32(seed), []);
  state.seed = seed + 2;
  return state;
}
const findEv = (id) => loveIslandPack.events.find((e) => e.id === id);

test('every Stirling line passes the taste floor (VOICE.md register 1)', () => {
  const issues = [];
  const ids = new Set();
  for (const l of ALL_LINES) {
    assert.ok(!ids.has(l.id), `duplicate bark id '${l.id}'`);
    ids.add(l.id);
    for (const iss of tasteIssues(l.text, LOVE_ISLAND_TASTE)) issues.push(`${l.id}: ${iss}`);
    if (/\w'\w/.test(l.text)) issues.push(`${l.id}: straight apostrophe`);
    if (l.text.includes('  ')) issues.push(`${l.id}: double space`);
  }
  assert.deepEqual(issues, []);
});

test('reaction barks are seeded, rate-limited, and set the no-repeat state', () => {
  const s = fresh();
  const ev = findEv('li_pool_flirt') || loveIslandPack.events.find((e) => !e.chainOnly && !(e.tags || []).some((t) => t.startsWith('beat:')));
  const choice = ev.choices.left;
  const bark = (state, seed) => {
    const result = {};
    stirlingPlugin.afterResolve(state, result, { ev, choice, tier: 'incredible', rng: engine.mulberry32(seed) });
    return result.overlayNote || null;
  };
  const n1 = bark(s, 11);
  assert.ok(n1 && n1.cls === 'note-stirling', 'an INCREDIBLE lands a bark');
  assert.equal(s.stirlingSeen.length, 1, 'the line is remembered');
  const n2 = bark(s, 11);
  assert.equal(n2, null, 'cooldown holds — he lands rather than nags');
  // Same state, same seed → same line (determinism).
  const t1 = fresh(21), t2 = fresh(21);
  assert.deepEqual(bark(t1, 5), bark(t2, 5));
});

test('no-repeat-until-exhausted: a pool cycles without repeats, then resets', () => {
  const s = fresh();
  const ev = loveIslandPack.events.find((e) => !e.chainOnly);
  // Choice with no tag pool → generic INCREDIBLE pool only.
  const choice = { label: 'x', tags: ['rest'], outcomes: { incredible: { text: 'x', effects: {} } } };
  const stance = stirlingStance(s);
  const poolSize = REACT_INCREDIBLE.filter((l) => !l.stance || l.stance === stance).length;
  const heard = [];
  const rng = engine.mulberry32(42);
  for (let i = 0; i < poolSize; i++) {
    s.stirlingCool = 0;
    const result = {};
    stirlingPlugin.afterResolve(s, result, { ev, choice, tier: 'incredible', rng });
    heard.push(result.overlayNote.html);
  }
  assert.equal(new Set(heard).size, poolSize, 'no repeats until the pool is dry');
  s.stirlingCool = 0;
  const result = {};
  stirlingPlugin.afterResolve(s, result, { ev, choice, tier: 'incredible', rng });
  assert.ok(result.overlayNote, 'the pool resets once exhausted');
});

test('guaranteed beats bypass the cooldown (bombshell arrival)', () => {
  const s = fresh();
  s.stirlingCool = 99;
  const ev = findEv('li_bomb1');
  const result = {};
  stirlingPlugin.afterResolve(s, result, { ev, choice: ev.choices.left, tier: 'good', rng: engine.mulberry32(3) });
  assert.ok(result.overlayNote, 'the bombshell beat always gets a line');
});

test('a surfaced secret gets its authored reaction, once per surface', () => {
  const s = fresh();
  const ev = loveIslandPack.events.find((e) => !e.chainOnly);
  const choice = { label: 'x', tags: [], outcomes: { good: { text: 'x', effects: {} } } };
  s.secretKnown = ['rival'];
  s.secretSurfacedCount = 1;
  const r1 = {};
  stirlingPlugin.afterResolve(s, r1, { ev, choice, tier: 'good', rng: engine.mulberry32(4) });
  assert.ok(r1.overlayNote && BEAT_REACT.secret.some((l) => r1.overlayNote.html.includes(l.text)),
    'reacts to new intel with a secret-pool line');
  const r2 = {};
  stirlingPlugin.afterResolve(s, r2, { ev, choice, tier: 'good', rng: engine.mulberry32(4) });
  assert.equal(r2.overlayNote, undefined, 'no re-react to old intel');
  // The held list SHRINKING (partner switch) must not eat a later surface's
  // bark — the trigger is the monotonic counter, not the list length.
  s.secretKnown = [];
  s.secretKnown.push('partner');
  s.secretSurfacedCount = 2;
  const r3 = {};
  stirlingPlugin.afterResolve(s, r3, { ev, choice, tier: 'good', rng: engine.mulberry32(5) });
  assert.ok(r3.overlayNote, 'a fresh surface after churn still gets its line');
});

test('the ceremony forecast is truthful (family follows the real check)', () => {
  const s = fresh();
  const lineup = findEv('li_recoup2_exposed');
  // Solid Bond → the bond-safe family.
  s.partner = 'kai';
  s.bond = COUPLING.bondFloor + 20; s.public = 0;
  let note = stirlingDealNote(s, lineup);
  let o = ceremonyOutlook(s);
  assert.ok(o.bondSafe && FORECAST.bondSafe.some((l) => note.html.includes(l.text)), 'bond-safe family');
  // Cratered Bond, loud public → the public-rescue family.
  s.bond = 0; s.public = COUPLING.publicFloor + 10;
  note = stirlingDealNote(s, lineup);
  assert.ok(FORECAST.publicSafe.some((l) => note.html.includes(l.text)), 'public-safe family');
  // Nothing to stand on → danger.
  s.public = 0;
  note = stirlingDealNote(s, lineup);
  assert.ok(FORECAST.danger.some((l) => note.html.includes(l.text)), 'danger family');
  // An active Rival can flip a marginal Bond read — the forecast must track it.
  s.bond = COUPLING.bondFloor + 2; s.public = 0;
  assert.ok(ceremonyOutlook(s).bondSafe);
  s.flags.push('li_rival_active');
  assert.ok(!ceremonyOutlook(s).bondSafe, 'the poach penalty is in the read');
  note = stirlingDealNote(s, lineup);
  assert.ok(FORECAST.danger.some((l) => note.html.includes(l.text)), 'forecast tracks the Rival');
});

test('verdict cards get the explain line; deal notes are pure', () => {
  const s = fresh();
  for (const [id, family] of [['li_recoup_held', 'held'], ['li_recoup_rescued', 'rescued'], ['li_recoup_dumped', 'dumped']]) {
    const note = stirlingDealNote(s, findEv(id));
    assert.ok(note && BEAT_VERDICT[family].some((l) => note.html.includes(l.text)), `${id} explained`);
  }
  const before = JSON.stringify({ seen: s.stirlingSeen, uses: s.rngUses });
  stirlingDealNote(s, findEv('li_recoup_held'));
  stirlingDealNote(s, findEv('li_recoup_held'));
  assert.equal(JSON.stringify({ seen: s.stirlingSeen, uses: s.rngUses }), before, 'no state writes, no rng');
});

test('deal-time lines no-repeat until the pool is dry, recorded at resolve', () => {
  const s = fresh();
  const ev = findEv('li_recoup_rescued');
  // Simulate deal → resolve cycles: the deal reads at cardLog length N, the
  // resolve-side record (modifyEffects) runs after the log grew to N+1.
  const cycle = () => {
    const note = stirlingDealNote(s, ev);
    s.cardLog.push({ e: ev.id, t: 'good', a: 2, s: 'left' });
    stirlingPlugin.modifyEffects(s, {}, { ev, tier: 'good' });
    return note.html;
  };
  const heard = [];
  for (let i = 0; i < BEAT_VERDICT.rescued.length; i++) heard.push(cycle());
  assert.equal(new Set(heard).size, BEAT_VERDICT.rescued.length, 'every line before any repeat');
  assert.ok(!BEAT_VERDICT.rescued.some((l) => s.stirlingSeen.includes(l.id)), 'dry pool resets');
  assert.ok(cycle(), 'and the family keeps speaking after the reset');
});

test('stance colouring derives from play and filters stanced lines', () => {
  const s = fresh();
  assert.equal(stirlingStance(s), 'rooting');
  s.stats.savvy = 60;
  assert.equal(stirlingStance(s), 'clocking');
  s.flags.push('li_casa_kiss', 'li_code_broke');
  assert.equal(stirlingStance(s), 'mess');
});

test('ambient cards get no deal note (he breathes on the ambient deck)', () => {
  const s = fresh();
  const ambient = loveIslandPack.events.find((e) =>
    !e.chainOnly && !e.finaleCard && !(e.tags || []).some((t) => t.startsWith('beat:')));
  assert.equal(stirlingDealNote(s, ambient), null);
});
