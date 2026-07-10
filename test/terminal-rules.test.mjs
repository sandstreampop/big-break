// The terminal-rule contract (2026-07 odyssey review, Required #1).
//
// TerminalRule replaces the failStates misuse where a flag-triggered ending
// had to be smuggled through an always-true numeric comparison
// (`poseidon >= -999`, `bond >= 0`). These tests pin:
//   1. BEHAVIOR — flag rules, threshold rules, conjunctions, fromAct arming,
//      and declared-order precedence, on an isolated engine instance.
//   2. EQUIVALENCE — a legacy failStates rule (flag + dummy comparison) and
//      its terminalRules translation end the same runs with the same ending,
//      so the migration of odyssey/love-island cannot have moved a golden.
//   3. CONTRACT — validatePack speaks the new shape: authors get repairable
//      errors for malformed rules, unresolvable keys, and the legacy
//      dummy-comparison pattern draws the warning that points here.
//
// Run: npm run build && node --test test/terminal-rules.test.mjs

import test from 'node:test';
import assert from 'node:assert/strict';
import { createEngine, mulberry32 } from '../dist/js/engine.js';
import { validatePack } from '../dist/js/validate.js';

// ── The smallest pack that can exercise a terminal rule. ──
function card(id, act) {
  const choice = (label) => ({
    label,
    tags: ['effort'],
    governingStats: { focus: 1 },
    outcomes: {
      bad: { text: 'It slips.', effects: { focus: -2, burnout: 4 } },
      good: { text: 'It holds.', effects: { focus: 5, points: 6 } },
      incredible: { text: 'It soars.', effects: { focus: 9, points: 12 } },
    },
  });
  return { id, act, choices: { left: choice('Push'), right: choice('Coast') } };
}

function makePack(overrides = {}) {
  const loadouts = [{ id: 'runner', name: 'The Runner', unlockedByDefault: true }];
  return {
    id: 'trial',
    manifest: {
      stats: ['focus'],
      resources: ['points'],
      segments: [{ length: 4, crossroads: true }, { length: 4 }],
      paths: { finish: { id: 'finish', name: 'The Finish', blurb: '', gateLabel: '', icon: '▣' } },
      winGates: { finish: { focus: 60, points: 40 } },
      statMeta: { focus: { name: 'Focus', icon: '◎' }, burnout: { name: 'Strain', icon: '△' } },
      resourceMeta: { points: { name: 'Points', icon: '◆' } },
      ...overrides,
    },
    events: [card('c1', 1), card('c2', 1), card('c3', 2), card('c4', [1, 2])],
    tutorialEvents: [],
    loadouts,
    loadoutById: (id) => loadouts.find((l) => l.id === id) ?? null,
  };
}

function freshState(pack) {
  const engine = createEngine(pack);
  const state = engine.newRun('runner', [], mulberry32(7), []);
  return { engine, state };
}

// ── 1. Behavior ──

test('a flag rule ends the run with its ending the moment the flag is set', () => {
  const { engine, state } = freshState(makePack({
    terminalRules: [{ when: { flag: 'banked' }, ending: 'meadow' }],
  }));
  assert.equal(engine.checkFailStates(state), null, 'no flag, no ending');
  state.flags.push('banked');
  assert.equal(engine.checkFailStates(state), 'meadow');
});

test('a threshold rule reads any manifest key through gateValue', () => {
  const { engine, state } = freshState(makePack({
    terminalRules: [{ when: { key: 'points', cmp: '<=', value: -10 }, ending: 'broke' }],
  }));
  state.points = -9;
  assert.equal(engine.checkFailStates(state), null);
  state.points = -10;
  assert.equal(engine.checkFailStates(state), 'broke');
});

test('an all-conjunction requires every condition', () => {
  const { engine, state } = freshState(makePack({
    terminalRules: [{
      when: { all: [{ flag: 'in_debt' }, { key: 'points', cmp: '<=', value: 0 }] },
      ending: 'called_in',
    }],
  }));
  state.points = -5;
  assert.equal(engine.checkFailStates(state), null, 'threshold alone is not enough');
  state.flags.push('in_debt');
  assert.equal(engine.checkFailStates(state), 'called_in');
  state.points = 5;
  assert.equal(engine.checkFailStates(state), null, 'flag alone is not enough');
});

test('fromAct arms a rule from that act onward', () => {
  const { engine, state } = freshState(makePack({
    terminalRules: [{ when: { flag: 'walked' }, fromAct: 2, ending: 'gone' }],
  }));
  state.flags.push('walked');
  state.act = 1;
  assert.equal(engine.checkFailStates(state), null, 'inert before its act');
  state.act = 2;
  assert.equal(engine.checkFailStates(state), 'gone');
});

test('declared order is precedence: failStates first, then terminalRules, each in order', () => {
  const { engine, state } = freshState(makePack({
    failStates: [{ key: 'points', cmp: '<=', value: 0, ending: 'legacy_first' }],
    terminalRules: [
      { when: { key: 'points', cmp: '<=', value: 0 }, ending: 'new_first' },
      { when: { key: 'points', cmp: '<=', value: 0 }, ending: 'new_second' },
    ],
  }));
  state.points = 0;
  assert.equal(engine.checkFailStates(state), 'legacy_first');
});

test('the universal burnout fail still outranks every pack rule', () => {
  const { engine, state } = freshState(makePack({
    terminalRules: [{ when: { flag: 'banked' }, ending: 'meadow' }],
  }));
  state.flags.push('banked');
  state.stats.burnout = 100;
  assert.equal(engine.checkFailStates(state), 'burnout');
});

// ── 2. Equivalence: the legacy encoding and its honest translation agree. ──

test('a legacy flag+dummy failStates rule and its terminalRules translation are behaviorally identical', () => {
  const legacy = freshState(makePack({
    failStates: [{ key: 'points', cmp: '>=', value: -999, flag: 'stayed', ending: 'lotus' }],
  }));
  const honest = freshState(makePack({
    terminalRules: [{ when: { flag: 'stayed' }, ending: 'lotus' }],
  }));
  for (const { engine, state } of [legacy, honest]) {
    assert.equal(engine.checkFailStates(state), null, 'no flag → no ending, both shapes');
  }
  legacy.state.flags.push('stayed');
  honest.state.flags.push('stayed');
  assert.equal(legacy.engine.checkFailStates(legacy.state), 'lotus');
  assert.equal(honest.engine.checkFailStates(honest.state), 'lotus');
});

// ── 3. The authoring contract. ──

test('a well-formed terminalRules list validates clean', () => {
  const v = validatePack(makePack({
    terminalRules: [
      { when: { key: 'points', cmp: '<=', value: -10 }, ending: 'broke' },
      { when: { flag: 'banked' }, ending: 'meadow' },
      { when: { all: [{ flag: 'in_debt' }, { key: 'points', cmp: '<=', value: 0 }] }, fromAct: 2, ending: 'called_in' },
    ],
  }));
  assert.deepEqual(v.errors, []);
  assert.equal(v.ok, true);
});

test('a malformed rule is terminalrule-invalid with the shape spelled out', () => {
  const v = validatePack(makePack({ terminalRules: [{ ending: 'broke' }] }));
  const hit = v.errors.find((e) => e.code === 'terminalrule-invalid');
  assert.ok(hit, `expected terminalrule-invalid, got: ${v.errors.map((e) => e.code).join(', ')}`);
  assert.match(hit.message, /when/);
});

test('a condition that is none of the three shapes is terminalrule-condition-invalid', () => {
  const v = validatePack(makePack({
    terminalRules: [{ when: { nonsense: true }, ending: 'x' }],
  }));
  assert.ok(v.errors.some((e) => e.code === 'terminalrule-condition-invalid'));
});

test('an empty all-conjunction is rejected (it would end the run instantly)', () => {
  const v = validatePack(makePack({
    terminalRules: [{ when: { all: [] }, ending: 'x' }],
  }));
  const hit = v.errors.find((e) => e.code === 'terminalrule-condition-invalid');
  assert.ok(hit);
  assert.match(hit.message, /vacuously true|instantly/);
});

test('an unresolvable threshold key is terminalrule-key-unresolved with the vocabulary and a suggestion', () => {
  const v = validatePack(makePack({
    terminalRules: [{ when: { key: 'poinz', cmp: '<=', value: 0 }, ending: 'broke' }],
  }));
  const hit = v.errors.find((e) => e.code === 'terminalrule-key-unresolved');
  assert.ok(hit);
  assert.match(hit.message, /poinz/);
  assert.match(hit.fix, /points/, 'suggests the closest declared key');
});

test('nested conditions are validated too', () => {
  const v = validatePack(makePack({
    terminalRules: [{ when: { all: [{ flag: 'ok' }, { key: 'nope', cmp: '>', value: 1 }] }, ending: 'x' }],
  }));
  assert.ok(v.errors.some((e) => e.code === 'terminalrule-key-unresolved'));
});

test('the legacy dummy-comparison pattern draws the pointed warning', () => {
  const v = validatePack(makePack({
    failStates: [{ key: 'points', cmp: '>=', value: -999, flag: 'stayed', ending: 'lotus' }],
  }));
  const hit = v.warnings.find((w) => w.code === 'failstate-dummy-comparison');
  assert.ok(hit, `expected failstate-dummy-comparison, got: ${v.warnings.map((w) => w.code).join(', ')}`);
  assert.match(hit.fix, /terminalRules/);
  assert.match(hit.fix, /stayed/);
});

test('a real flag+threshold failStates rule (music debt shape) draws no warning', () => {
  const v = validatePack(makePack({
    failStates: [{ key: 'points', cmp: '<=', value: -300, flag: 'in_debt', ending: 'debt' }],
  }));
  assert.deepEqual(v.warnings.filter((w) => w.code === 'failstate-dummy-comparison'), []);
  assert.deepEqual(v.errors, []);
});
