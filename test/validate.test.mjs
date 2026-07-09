// The pack-contract validator's own suite. Two halves:
//   1. Every REGISTERED pack passes with zero errors — the executable form of
//      "the shipped packs honor the contract" (the gate tools/validate-packs.mjs
//      enforces the same thing in CI; this keeps it inside `node --test` too).
//   2. A minimal valid pack fixture, broken one dimension at a time, produces
//      the right issue CODE with a message an author/LLM can repair from:
//      it must name the offending path, list the declared vocabulary, and
//      (where plausible) suggest the closest declared key.
//
// Run: npm run build && node --test test/validate.test.mjs

import test from 'node:test';
import assert from 'node:assert/strict';
import { validatePack, formatIssue, formatValidation, closestKey } from '../dist/js/validate.js';
import { PACKS } from '../dist/js/packs/registry.js';

// ── 1. The shipped packs honor the contract. ──
for (const pack of PACKS) {
  test(`[${pack.id}] registered pack passes validatePack with zero errors`, () => {
    const v = validatePack(pack);
    assert.deepEqual(v.errors.map((e) => `${e.code} @ ${e.path}`), [], 'expected no contract errors');
    assert.equal(v.ok, true);
  });
}

// ── 2. The fixture: the smallest valid pack (probe-shaped), built fresh per
// test so each mutation is isolated. ──
function card(id, act, extra = {}) {
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
  return { id, act, choices: { left: choice('Push'), right: choice('Coast') }, ...extra };
}

function fixture() {
  const loadouts = [{ id: 'runner', name: 'The Runner', unlockedByDefault: true }];
  return {
    id: 'fixture',
    manifest: {
      stats: ['focus'],
      resources: ['points'],
      segments: [{ length: 4, crossroads: true }, { length: 4 }],
      paths: { finish: { id: 'finish', name: 'The Finish', blurb: '', gateLabel: '', icon: '▣' } },
      winGates: { finish: { focus: 60, points: 40 } },
      statMeta: {
        focus: { name: 'Focus', icon: '◎' },
        burnout: { name: 'Strain', icon: '△' },
      },
    },
    events: [card('c1', 1), card('c2', 1), card('c3', 2), card('c4', [1, 2])],
    tutorialEvents: [],
    loadouts,
    loadoutById: (id) => loadouts.find((l) => l.id === id) ?? null,
  };
}

// Assert the pack yields exactly one error with `code`, and return it.
function expectError(pack, code) {
  const v = validatePack(pack);
  const hit = v.errors.filter((e) => e.code === code);
  assert.ok(hit.length >= 1,
    `expected error '${code}', got: ${v.errors.map((e) => e.code).join(', ') || '(none)'}`);
  return hit[0];
}
function expectWarning(pack, code) {
  const v = validatePack(pack);
  const hit = v.warnings.filter((w) => w.code === code);
  assert.ok(hit.length >= 1,
    `expected warning '${code}', got: ${v.warnings.map((w) => w.code).join(', ') || '(none)'}`);
  return hit[0];
}

test('the minimal fixture is valid', () => {
  const v = validatePack(fixture());
  assert.deepEqual(v.errors, []);
  assert.equal(v.ok, true);
});

test('a non-object candidate fails fast with a pointer to the smallest example', () => {
  const v = validatePack(null);
  assert.equal(v.ok, false);
  assert.equal(v.errors[0].code, 'pack-not-object');
  assert.match(v.errors[0].fix, /probe/);
});

// ── Manifest shape ──

test('a missing manifest is one clear error, not a cascade', () => {
  const p = fixture();
  delete p.manifest;
  const v = validatePack(p);
  assert.deepEqual(v.errors.map((e) => e.code), ['manifest-missing']);
});

test('empty stats and a stat/resource collision are caught', () => {
  const p = fixture();
  p.manifest.stats = [];
  expectError(p, 'manifest-stats-invalid');
  const q = fixture();
  q.manifest.resources = ['focus', 'points'];
  const iss = expectError(q, 'stat-resource-overlap');
  assert.match(iss.message, /applied .* twice|both a stat and a resource/);
});

test('declaring burnout as your own stat is rejected — the engine owns the slot', () => {
  const p = fixture();
  p.manifest.stats = ['focus', 'burnout'];
  expectError(p, 'burnout-reserved');
});

test('run-structure defects: crossroads on the terminal segment, or no crossroads at all', () => {
  const p = fixture();
  p.manifest.segments = [{ length: 4 }, { length: 4, crossroads: true }];
  expectError(p, 'crossroads-terminal');
  const q = fixture();
  q.manifest.segments = [{ length: 4 }, { length: 4 }];
  expectError(q, 'crossroads-missing');
});

test('paths and winGates must describe the same summits', () => {
  const p = fixture();
  p.manifest.winGates = { finish: { focus: 60 }, ghost: { focus: 10 } };
  expectError(p, 'paths-wingates-mismatch');
});

test('a winGates key that resolves to nothing names the gate vocabulary and the closest match', () => {
  const p = fixture();
  p.manifest.winGates.finish = { foccus: 60 };
  const iss = expectError(p, 'wingate-key-unresolved');
  assert.match(iss.message, /focus/);          // lists declared stats
  assert.match(iss.fix, /"focus"/);            // suggests the near-miss
});

test('statMeta must cover every stat plus the burnout slot', () => {
  const p = fixture();
  delete p.manifest.statMeta.burnout;
  const iss = expectError(p, 'statmeta-missing');
  assert.match(iss.path, /burnout/);
});

test('a fail state watching an undeclared key can never trip — and says so', () => {
  const p = fixture();
  p.manifest.failStates = [{ key: 'pointz', cmp: '<=', value: 0, ending: 'broke' }];
  const iss = expectError(p, 'failstate-key-unresolved');
  assert.match(iss.fix, /"points"/);
});

test('role resources must name a declared resource or plugin state slot', () => {
  const p = fixture();
  p.manifest.momentumResource = 'momentum';
  expectError(p, 'role-resource-unknown');
  // …but a plugin-owned slot is legitimate (getRes resolves it top-level).
  const q = fixture();
  q.plugins = [{ id: 'ticker', stateDefaults: { momentum: 0 } }];
  q.manifest.momentumResource = 'momentum';
  assert.equal(validatePack(q).ok, true);
});

// ── Deck semantics ──

test('a duplicate event id is an error (it silently doubles deck weight)', () => {
  const p = fixture();
  p.events.push(card('c1', 1));
  const iss = expectError(p, 'event-id-duplicate');
  assert.match(iss.message, /doubles/);
});

test('an act outside the declared segments is a card that can never be drawn', () => {
  const p = fixture();
  p.events.push(card('c9', 7));
  const iss = expectError(p, 'event-act-out-of-range');
  assert.match(iss.message, /only 2 segment/);
});

test('pathAffinity must reference a declared path', () => {
  const p = fixture();
  p.events.push(card('c9', 1, { pathAffinity: ['finsh'] }));
  const iss = expectError(p, 'path-affinity-unknown');
  assert.match(iss.fix, /"finish"/);
});

test('an unknown effect verb lists the whole owned vocabulary and the closest match', () => {
  const p = fixture();
  p.events[0].choices.left.outcomes.good.effects = { focuss: 5 };
  const iss = expectError(p, 'effect-verb-unknown');
  assert.match(iss.message, /focus/);       // declared stats
  assert.match(iss.message, /points/);      // declared resources
  assert.match(iss.message, /addFlag/);     // core verbs
  assert.match(iss.fix, /"focus"/);         // the near-miss suggestion
});

test('a plugin-declared verb is owned vocabulary', () => {
  const p = fixture();
  p.plugins = [{ id: 'chart', effectVerbs: ['chartTitle'] }];
  p.events[0].choices.left.outcomes.good.effects = { chartTitle: 'x' };
  assert.equal(validatePack(p).ok, true);
});

test('a dangling chainEventId is caught — the follow-up card would never play', () => {
  const p = fixture();
  p.events[0].choices.left.outcomes.good.effects = { chainEventId: 'c2_followup' };
  const iss = expectError(p, 'chain-target-missing');
  assert.match(iss.message, /silently drop/);
});

test('promise payloads are validated recursively', () => {
  const p = fixture();
  p.events[0].choices.left.outcomes.good.effects = {
    addPromise: { label: 'Ship it', tags: ['effort'], cards: 3, reward: { fame: 5 } },
  };
  const iss = expectError(p, 'effect-verb-unknown');
  assert.match(iss.path, /addPromise\.reward/);
});

test('a governing key that is not a stat is the silent-aptitude-zero bug', () => {
  const p = fixture();
  p.events[0].choices.right.governingStats = { points: 1 };
  const iss = expectError(p, 'governing-stat-unknown');
  assert.match(iss.message, /aptitude 0/);
  assert.match(iss.fix, /resource/); // explains WHY points can't govern
});

test('an unknown requires key names both neutral and plugin-registered vocabularies', () => {
  const p = fixture();
  p.events[0].requires = { venueIs: 'basement' };
  const iss = expectError(p, 'requires-key-unknown');
  assert.match(iss.message, /flagsAll/);
  // …and registering the predicate in a plugin makes it owned.
  const q = fixture();
  q.plugins = [{ id: 'venue', requires: { venueIs: () => true } }];
  q.events[0].requires = { venueIs: 'basement' };
  assert.equal(validatePack(q).ok, true);
});

test('requires min/max/stats inner keys must resolve through gateValue', () => {
  const p = fixture();
  p.events[0].requires = { min: { fame: 10 } };
  expectError(p, 'requires-gate-key-unresolved');
  const q = fixture();
  q.events[0].requires = { stats: { focusMin: 10 } }; // legacy <key>Min shape resolves
  assert.equal(validatePack(q).ok, true);
});

test('anyOf alternatives are validated recursively', () => {
  const p = fixture();
  p.events[0].requires = { anyOf: [{ flagsAll: ['ok'] }, { min: { nope: 1 } }] };
  const iss = expectError(p, 'requires-gate-key-unresolved');
  assert.match(iss.path, /anyOf\[1\]/);
});

test('a requires predicate registered by two plugins has no single owner', () => {
  const p = fixture();
  p.plugins = [
    { id: 'a', requires: { venueIs: () => true } },
    { id: 'b', requires: { venueIs: () => true } },
  ];
  expectError(p, 'requires-key-conflict');
});

test('a missing outcome tier is a crash waiting for that roll', () => {
  const p = fixture();
  delete p.events[0].choices.left.outcomes.incredible;
  const iss = expectError(p, 'outcome-missing');
  assert.match(iss.message, /incredible/);
});

test('forceTier values are checked against the scriptable set', () => {
  const p = fixture();
  p.events[0].forceTier = { left: 'amazing' };
  const iss = expectError(p, 'forcetier-value-invalid');
  assert.match(iss.message, /encoreUp/);
});

test('a priced choice without a manifest costResource is silently free — warned', () => {
  const p = fixture();
  p.events[0].choices.left.cost = 50;
  expectWarning(p, 'cost-without-cost-resource');
});

test('weight-0 cards nothing can deal are warned about', () => {
  const p = fixture();
  p.events.push(card('c9', 1, { weight: 0 }));
  expectWarning(p, 'event-weight-zero');
});

// ── Optional capabilities ──

test('an interstitial pointing at a missing card would deal nothing', () => {
  const p = fixture();
  p.interstitials = [{ id: 'coping_1', burnoutMin: 60 }];
  expectError(p, 'interstitial-target-missing');
  // Pointing at a normal (non-chainOnly) deck card is a warning.
  const q = fixture();
  q.interstitials = [{ id: 'c1', burnoutMin: 60 }];
  expectWarning(q, 'interstitial-not-chainonly');
});

test('tutorialStart must resolve its loadout and name declared stats', () => {
  const p = fixture();
  p.tutorialEvents = [card('t1', 1)];
  p.tutorialStart = { loadout: 'ghost', stats: { focus: 30 } };
  expectError(p, 'tutorialstart-loadout-unknown');
  const q = fixture();
  q.tutorialEvents = [card('t1', 1)];
  q.tutorialStart = { loadout: 'runner', stats: { fame: 30 } };
  expectError(q, 'tutorialstart-stat-unknown');
});

test('loadoutById must cover every declared loadout', () => {
  const p = fixture();
  p.loadoutById = () => null;
  expectError(p, 'loadoutbyid-incomplete');
});

// ── Reporting / repair-loop ergonomics ──

test('formatIssue renders defect, path, and suggested fix as a pasteable block', () => {
  const p = fixture();
  p.events[0].choices.left.outcomes.good.effects = { focuss: 5 };
  const v = validatePack(p);
  const text = formatIssue(v.errors[0]);
  assert.match(text, /✗ \[effect-verb-unknown\]/);
  assert.match(text, /events\[0\] "c1"/);
  assert.match(text, /Suggested fix:/);
});

test('formatValidation ends with a verdict line', () => {
  const ok = formatValidation('fixture', validatePack(fixture()));
  assert.match(ok, /✓ \[fixture\] pack contract OK/);
  const p = fixture();
  delete p.manifest;
  assert.match(formatValidation('fixture', validatePack(p)), /violates the contract/);
});

test('closestKey suggests near-misses but not unrelated words', () => {
  assert.equal(closestKey('foccus', ['focus', 'points']), 'focus');
  assert.equal(closestKey('zzzzz', ['focus', 'points']), null);
});

// ── Adversarial-input regressions (found by the fresh-context review): the
// never-throws contract must hold against ACTIVELY hostile values, not just
// wrong ones. ──

test('hostile payload values (BigInt, circular) are reported, not thrown', () => {
  const p = fixture();
  p.events[0].choices.left.outcomes.good.effects = { focus: 10n };
  const v = validatePack(p);
  assert.equal(v.ok, false);
  assert.ok(v.errors.some((e) => e.code === 'effect-value-invalid'));

  const q = fixture();
  const circular = {};
  circular.self = circular;
  q.events[0].choices.left.outcomes.good.effects = { focus: circular };
  assert.equal(validatePack(q).ok, false);

  const r = fixture();
  r.events[0].forceTier = { left: 123n };
  assert.equal(validatePack(r).ok, false);
});

test('a throwing loadoutById on tutorialStart is unresolved, not a crash', () => {
  const p = fixture();
  p.tutorialEvents = [card('t1', 1)];
  p.tutorialStart = { loadout: 'ghost', stats: {} };
  p.loadoutById = (id) => { if (id === 'ghost') throw new Error('boom-tut'); return p.loadouts.find((l) => l.id === id) ?? null; };
  const v = validatePack(p);
  assert.ok(v.errors.some((e) => e.code === 'tutorialstart-loadout-unknown'));
});

test('a throwing getter is caught by the crash fence and reported as an issue', () => {
  const hostile = { manifest: {}, events: [], tutorialEvents: [], loadouts: [] };
  Object.defineProperty(hostile, 'id', { get() { throw new Error('boom-id'); }, enumerable: true });
  const v = validatePack(hostile);
  assert.equal(v.ok, false);
  assert.ok(v.errors.some((e) => e.code === 'validator-crash' && /boom-id/.test(e.message)));
});

// ── Engine-fidelity regressions: the validator must accept what gateValue
// actually resolves, and only kill cards the engine would really strand. ──

test('gating on a core RunState mechanics counter (encore, hotStreak) is valid', () => {
  const p = fixture();
  p.manifest.failStates = [{ key: 'hotStreak', cmp: '>=', value: 99, ending: 'streaking' }];
  p.events[0].requires = { min: { encore: 1 } };
  const v = validatePack(p);
  assert.deepEqual(v.errors, []);
});

test('an out-of-range act on a chain/finale-delivered card warns instead of erroring', () => {
  const p = fixture();
  p.events.push(card('c_chain', 9, { chainOnly: true }));
  const v = validatePack(p);
  assert.ok(!v.errors.some((e) => e.code === 'event-act-out-of-range'), 'chainOnly act is inert — not an error');
  assert.ok(v.warnings.some((w) => w.code === 'event-act-out-of-range'));
});

test('validatePack never throws, even on adversarial shapes', () => {
  for (const hostile of [
    undefined, null, 42, 'pack', [],
    {}, { id: 1 }, { id: 'x', manifest: 'nope' },
    { id: 'x', manifest: {}, events: 'nope', loadouts: {}, loadoutById: 3 },
    { id: 'x', manifest: { stats: [1], resources: null, segments: {}, paths: [], winGates: 1, statMeta: null }, events: [{}, { id: 'a', choices: { left: null } }], tutorialEvents: null, loadouts: [{}], loadoutById: () => { throw new Error('boom'); } },
  ]) {
    const v = validatePack(hostile);
    assert.equal(v.ok, false);
    assert.ok(v.errors.length >= 1);
  }
});
