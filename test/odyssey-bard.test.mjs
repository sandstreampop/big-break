// The bard-chatter contract (2026-07 review product-risk-1). The frame
// personality is content, but its SELECTOR carries invariants that keep it
// from groaning and keep it golden-safe:
//   1. VARIANCE — different flavorSeeds yield different chatter transcripts
//      (the anti-groan property; a fixed transcript would be the groan).
//   2. CAP + NO-REPEAT — a run never exceeds BARD_CAP interjections and never
//      repeats a line within itself (scarcity is the lever).
//   3. RESOLVES — every queued id is a real line; the render is a pure read.
//   4. PLAYER-CAUSED — a caused line (shouted the name) actually surfaces when
//      its cause is true, and outranks ambient crowd-work.
//   5. GOLDEN-SAFE — a full run's card trace is byte-identical with the bard
//      plugin present vs. absent (selection never touches the play RNG). This
//      is the load-bearing one; the odyssey golden depends on it.
//
// Run: npm run build && node --test test/odyssey-bard.test.mjs

import test from 'node:test';
import assert from 'node:assert/strict';
import * as engine from '../dist/js/engine.js';
import { odysseyPack } from '../dist/js/packs/odyssey/pack.js';
import { CHATTER, bardBeat } from '../dist/js/packs/odyssey/bard-chatter.js';

const BY_ID = new Map(CHATTER.map((c) => [c.id, c]));
const BARD_CAP = 4; // mirror bard-chatter.ts

// Drive a full run; collect the ordered list of chatter lines the bard would
// actually SHOW (what overlayNote returns at each deal), plus the card trace.
function runWithChatter(seed, { fragments = [], policy } = {}) {
  const meta = engine.mulberry32(seed >>> 0 || 1);
  const state = engine.newRun(odysseyPack, 'fishermans_hearth', [], engine.mulberry32(seed + 1), []);
  state.seed = seed + 2;
  if (fragments.length) odysseyPack.presenter.applySetup(state, {}, { odyssey: { fragments } }, false);
  const play = engine.stateRng(state);
  const shown = [];
  const trace = [];
  let guard = 0;
  while (state.phase !== 'ended' && guard++ < 300) {
    if (state.phase === 'crossroads') { engine.commitPath(state, 'nostos'); continue; }
    const ev = engine.drawNextCard(state, play);
    if (!ev) { state.cardsPlayedInAct = engine.actLength(state, state.act); }
    else {
      // The render read, exactly as the shell calls it at deal time.
      const beat = bardBeat(state, ev);
      if (beat) { shown.push(state.bardLine); assert.ok(beat.blocks.length >= 1, 'a beat has at least one block'); }
      const side = policy ? policy(ev) : (meta() < 0.5 ? 'left' : 'right');
      const r = engine.resolveSwipe(state, side, play, {});
      trace.push(`${ev.id}:${side}:${r.tier}`);
    }
    const step = engine.advance(state);
    if (step.kind === 'finale') engine.evaluateFinale(state);
  }
  return { shown, trace };
}

test('every queued chatter id resolves to a real line', () => {
  for (let s = 1; s <= 30; s++) {
    for (const id of runWithChatter(1000 + s).shown) {
      assert.ok(BY_ID.has(id), `queued id '${id}' is not in the pool`);
    }
  }
});

test('cap + no-repeat: a run never exceeds the cap and never repeats a line', () => {
  for (let s = 1; s <= 40; s++) {
    const { shown } = runWithChatter(2000 + s);
    assert.ok(shown.length <= BARD_CAP, `run showed ${shown.length} lines (cap ${BARD_CAP})`);
    assert.equal(new Set(shown).size, shown.length, `run repeated a line: ${shown.join(', ')}`);
  }
});

test('variance: different seeds produce different chatter transcripts', () => {
  const transcripts = new Set();
  for (let s = 1; s <= 40; s++) transcripts.add(runWithChatter(3000 + s).shown.join('|'));
  // Not a fixed script: many distinct transcripts across 40 runs. (A groaning
  // layer would collapse to one or two.)
  assert.ok(transcripts.size >= 8, `only ${transcripts.size} distinct transcripts in 40 runs — too repetitive`);
});

test('the bard actually speaks: most runs land at least one interjection', () => {
  let spoke = 0;
  for (let s = 1; s <= 40; s++) if (runWithChatter(4000 + s).shown.length) spoke++;
  assert.ok(spoke >= 38, `bard was silent in ${40 - spoke}/40 runs — the cold open should always fire`);
});

test('player-caused: shouting the name surfaces the reactive potter’s-boy line', () => {
  // Force the name-brag branch (ody_named) and confirm bc_named can surface.
  // The name-brag is the Kleos-lean side of the post-cyclops beat.
  let sawNamed = 0, tried = 0;
  const alwaysRight = (ev) => 'right';
  for (let s = 0; s < 60 && sawNamed < 1; s++) {
    tried++;
    const { shown } = runWithChatter(6000 + s, { policy: alwaysRight });
    if (shown.includes('bc_named')) sawNamed++;
  }
  assert.ok(sawNamed >= 1, `the caused line bc_named never surfaced across ${tried} name-shouting runs`);
});

test('bardBeat hushes on a landmark set-piece, and returns a dialogue script otherwise', () => {
  const state = { bardLine: 'bc_woodpile' };
  assert.equal(bardBeat(state, { tags: ['landmark'] }), null, 'the bard hushes at a landmark');
  const beat = bardBeat(state, { tags: [] });
  assert.ok(beat && Array.isArray(beat.blocks) && beat.blocks.length >= 1, 'returns dialogue blocks');
  // The woodpile script is real dialogue: the bard, then an attributed heckler.
  assert.ok(beat.blocks.some((b) => !b.who), 'has a bard block (no attribution)');
  assert.ok(beat.blocks.some((b) => b.who), 'has an attributed heckler block');
  for (const b of beat.blocks) assert.equal(typeof b.text, 'string');
});

test('GOLDEN-SAFE: the card trace is identical with the bard plugin and without it', () => {
  // Rebuild an odyssey-shaped pack with the bard plugin stripped, and confirm
  // the seeded card trace is byte-identical — proof selection never perturbs
  // the play RNG. (The odyssey golden relies on exactly this.)
  const noBard = { ...odysseyPack, plugins: odysseyPack.plugins.filter((p) => p.id !== 'odyssey_bard') };
  const runTrace = (pack, seed) => {
    const meta = engine.mulberry32(seed >>> 0 || 1);
    const state = engine.newRun(pack, 'fishermans_hearth', [], engine.mulberry32(seed + 1), []);
    state.seed = seed + 2;
    const play = engine.stateRng(state);
    const trace = [];
    let guard = 0;
    while (state.phase !== 'ended' && guard++ < 300) {
      if (state.phase === 'crossroads') { engine.commitPath(state, 'nostos'); continue; }
      const ev = engine.drawNextCard(state, play);
      if (!ev) { state.cardsPlayedInAct = engine.actLength(state, state.act); }
      else {
        const side = meta() < 0.5 ? 'left' : 'right';
        const r = engine.resolveSwipe(state, side, play, {});
        trace.push(`${ev.id}:${side}:${r.tier}:${r.deltas.map((d) => d.key + d.amount).join(',')}`);
      }
      const step = engine.advance(state);
      if (step.kind === 'finale') { const res = engine.evaluateFinale(state); trace.push(`F:${res.result}`); }
      else if (step.kind === 'gameover') trace.push(`G:${step.endingKey}`);
    }
    return trace.join(' | ');
  };
  for (let s = 0; s < 20; s++) {
    const seed = 7000 + s;
    assert.equal(runTrace(odysseyPack, seed), runTrace(noBard, seed), `trace diverged at seed ${seed}`);
  }
});
