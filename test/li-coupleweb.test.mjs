// The couple-web drama manager (ADR-0013) unit tests, organised around the
// four interactive-drama QA axes the charter demands:
//   PACING     — threads light on schedule, at most two foregrounded, and
//                nothing dangles past its window (offscreen resolution);
//   COHERENCE  — thread cards exist in the deck only at their exact stage of
//                a lit thread; resolved threads' cards leave the bag for
//                good; a thread whose cast the player couples with goes dark;
//   AUTONOMY   — the player's influence flags select resolution variants
//                (witness, don't steer);
//   DRAMATIC ARC — beats precede resolutions; resolutions pay factional
//                consequences; the story ledger (the WtV gate) only moves for
//                the player couple's own arc, with a legible why.
// Plus the seeded-sim guarantee: the whole schedule is a pure function of
// play state (no RNG in the manager). Runs against dist/.
//
// Run: node --test test/li-coupleweb.test.mjs

import test from 'node:test';
import assert from 'node:assert/strict';
import * as engine from '../dist/js/engine.js';
import { loveIslandPack } from '../dist/js/packs/love-island/pack.js';
import {
  COUPLEWEB, THREADS, threadState, threadBroken, litThreads, addStory,
} from '../dist/js/packs/love-island/plugins/coupleweb.js';
import { simulatePackRun } from '../tools/pack-core.mjs';

const web = loveIslandPack.plugins.find((p) => p.id === 'coupleweb');

import { fresh as baseFresh, apply } from './li-harness.mjs';
function fresh(seed = 7) {
  const state = baseFresh(seed);
  state.partner = 'kai'; // a fixed couple so the guard logic is deterministic
  return state;
}
const week = (state, n) => { state.act = n; web.onActBreak(state, n, []); };

// ---------- PACING ----------

test('pacing: the scheduler lights threads in-window, capped at two', () => {
  const s = fresh();
  week(s, 2);
  const lit = litThreads(s);
  assert.equal(lit.length, 2, 'two foreground threads, no more');
  assert.ok(lit.includes('slowburn'), 'priority order honoured');
  // kai is the partner → lovebomb is dark; triangle takes the other slot.
  assert.ok(lit.includes('triangle'));
});

test('pacing: an overdue thread resolves OFFSCREEN at the week turn', () => {
  const s = fresh();
  week(s, 2);
  week(s, 5); // triangle window ends W4; nothing advanced it
  const t = threadState(s, 'triangle');
  assert.equal(t.resolved, 'off_quiet', 'the world moved whether you watched or not');
  assert.ok(!t.lit);
});

test('pacing: a freed slot is refilled at the next week turn', () => {
  const s = fresh();
  week(s, 2);
  apply(s, { threadBeat: 'triangle' });
  // The authored showdown card carries both verbs — resolve + arm the cascade.
  apply(s, { threadResolve: 'triangle:showdown', threadLight: 'scorched' });
  week(s, 4);
  assert.ok(litThreads(s).length >= 1, 'the foreground never sits empty mid-season');
  assert.ok(litThreads(s).includes('scorched'), 'the armed cascade takes priority');
});

// ---------- COHERENCE ----------

test('coherence: threadStageIs admits a card only at its exact lit stage', () => {
  const s = fresh();
  const pred = web.requires.threadStageIs;
  assert.equal(pred(s, 'triangle:0'), false, 'dormant thread: no cards');
  week(s, 2);
  assert.equal(pred(s, 'triangle:0'), true, 'lit at stage 0');
  assert.equal(pred(s, 'triangle:1'), false, 'resolution stage not yet');
  apply(s, { threadBeat: 'triangle' });
  assert.equal(pred(s, 'triangle:0'), false, 'beat played: stage 0 cards leave the bag');
  assert.equal(pred(s, 'triangle:1'), true, 'resolution stage open');
  apply(s, { threadResolve: 'triangle:quiet' });
  assert.equal(pred(s, 'triangle:1'), false, 'resolved: removed from the bag for good');
});

test('coherence: you cannot watch a triangle you are a corner of', () => {
  const s = fresh();
  s.partner = 'marco';
  assert.ok(threadBroken(s, 'triangle'), 'partner in the fixed cast → thread dark');
  week(s, 2);
  assert.ok(!litThreads(s).includes('triangle'));
  assert.equal(web.requires.threadStageIs(s, 'triangle:0'), false);
  // Exes are fine — they moved on; so does the plot.
  s.partner = 'kai';
  s.exes = ['marco'];
  assert.ok(!threadBroken(s, 'triangle'));
});

test('coherence: resolution flags are the callbacks\' gate, offscreen endings are not', () => {
  const s = fresh();
  week(s, 2);
  apply(s, { threadBeat: 'triangle' });
  apply(s, { threadResolve: 'triangle:showdown' });
  assert.ok(s.flags.includes('li_web_triangle_showdown'));
  const pred = web.requires.threadOutcomeIs;
  assert.equal(pred(s, 'triangle:showdown'), true);
  assert.equal(pred(s, 'triangle:*'), true, 'wildcard matches any on-screen ending');
  const s2 = fresh(9);
  week(s2, 2);
  week(s2, 5); // offscreen
  assert.equal(pred(s2, 'triangle:*'), false, 'nobody saw it — no callbacks');
});

test('coherence: the bag weighting targets exactly the lit thread, and heats', () => {
  const s = fresh();
  const ev = { id: 'x', act: 2, tags: ['web:triangle'] };
  assert.equal(web.weightDeck(s, ev, 1), 1, 'dormant: no bloat');
  week(s, 2);
  assert.equal(web.weightDeck(s, ev, 1), COUPLEWEB.threadMult, 'lit: the bag bloats');
  s.act = 4; // two weeks of heat
  assert.equal(web.weightDeck(s, ev, 1),
    Math.min(COUPLEWEB.heatCap, COUPLEWEB.threadMult * 4), 'a heating thread bloats harder, capped');
  assert.equal(web.weightDeck(s, { id: 'y', act: 2, tags: ['chat'] }, 1), 1, 'bystander cards untouched');
});

// ---------- AUTONOMY ----------

test('autonomy: influence flags select the resolution variant (witness, don\'t steer)', () => {
  // The deck itself encodes it: for each thread, the resolution variants'
  // requires split on flags only the beat cards set.
  const byId = Object.fromEntries(loveIslandPack.events.map((e) => [e.id, e]));
  const show = byId['li_web_tri_showdown'];
  const fizz = byId['li_web_tri_fizzle'];
  assert.ok(show.requires.anyOf.some((a) => a.flagsAll.includes('li_web_tri_told')));
  assert.ok(fizz.requires.flagsNone.includes('li_web_tri_told'), 'variants partition on the flag');
  // And mechanically: the player's flag decides which card is eligible.
  const s = fresh();
  week(s, 2);
  apply(s, { threadBeat: 'triangle', addFlag: 'li_web_tri_told' });
  assert.ok(engine.requiresOk(show.requires, s), 'told → the showdown is live');
  assert.ok(!engine.requiresOk(fizz.requires, s), 'told → the fizzle is not');
});

test('autonomy bound: thread verbs never touch the player couple', () => {
  const s = fresh();
  week(s, 2);
  const partner = s.partner, bond = s.bond;
  apply(s, { threadBeat: 'triangle' });
  apply(s, { threadResolve: 'triangle:showdown' });
  assert.equal(s.partner, partner, 'no god-control leakage');
  assert.equal(s.bond, bond);
});

// ---------- DRAMATIC ARC ----------

test('arc: a resolution pays factional consequences — the nation watches the B-plot', () => {
  const s = fresh();
  week(s, 2);
  apply(s, { threadBeat: 'triangle' });
  const drama = s.drama;
  apply(s, { threadResolve: 'triangle:showdown' });
  assert.ok(s.drama > drama, 'the showdown feeds the Drama-lovers');
});

test('arc: the cascade lights only off the loud ending', () => {
  const s = fresh();
  week(s, 2);
  apply(s, { threadBeat: 'triangle' });
  apply(s, { threadResolve: 'triangle:quiet' });
  week(s, 3);
  assert.ok(!litThreads(s).includes('scorched'), 'a quiet ending cascades nothing');
  const s2 = fresh(9);
  week(s2, 2);
  apply(s2, { threadBeat: 'triangle' });
  apply(s2, { threadResolve: 'triangle:showdown', threadLight: 'scorched' });
  assert.ok(
    litThreads(s2).includes('scorched') || threadState(s2, 'scorched').pending,
    'the showdown arms the domino');
});

test('arc: the story ledger moves only with a legible why', () => {
  const s = fresh();
  const d = apply(s, { storyBeat: 'You caught the ick and survived the saying.' });
  assert.equal(s.story, 1);
  assert.ok((d.notices || []).some((n) => n.html.includes('storyline')), 'announced, never silent');
});

test('arc: the automatic redemption milestone fires once, on unmistakable state', () => {
  const s = fresh();
  s.flags.push('li_betrayed');
  s.partner = null;
  apply(s, { couple: true });
  assert.equal(s.story, 1, 'jilted, then coupled again — the redemption arc');
  apply(s, { switchPartner: true });
  assert.equal(s.story, 1, 'never double-counted');
});

// ---------- The seeded-sim guarantee ----------

test('the drama manager is deterministic: same seed, same thread history', () => {
  const a = simulatePackRun(loveIslandPack, 12345);
  const b = simulatePackRun(loveIslandPack, 12345);
  assert.deepEqual(a.state.threads, b.state.threads);
  assert.equal(a.state.story, b.state.story);
});

test('threads state is re-minted per run (no cross-run leakage)', () => {
  const a = simulatePackRun(loveIslandPack, 111);
  const b = simulatePackRun(loveIslandPack, 222);
  // If the stateDefaults object leaked, run B would begin with run A's
  // resolutions and its threads could never light again.
  const litOrResolved = Object.values(b.state.threads || {})
    .filter((t) => t.litWeek || t.resolved).length;
  assert.ok(litOrResolved > 0, 'run B lived its own season');
});

test('every authored thread card belongs to a defined thread and stage', () => {
  const ids = new Set(THREADS.map((t) => t.id));
  for (const ev of loveIslandPack.events) {
    const tag = (ev.tags || []).find((t) => t.startsWith('web:'));
    if (!tag) continue;
    assert.ok(ids.has(tag.slice(4)), `${ev.id}: unknown thread '${tag}'`);
    const stage = ev.requires?.threadStageIs;
    assert.ok(stage, `${ev.id}: thread card without a stage gate`);
    const [id, n] = String(stage).split(':');
    const def = THREADS.find((t) => t.id === id);
    assert.ok(Number(n) <= def.stages, `${ev.id}: stage beyond the thread's arc`);
  }
});
