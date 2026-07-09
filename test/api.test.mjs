// The public authoring surface (js/api.ts): the documented loop an outside
// author (or an LLM harness) runs — define → validate → run — must work
// end-to-end through THIS one import, with no reach into internal modules.
//
// Run: npm run build && node --test test/api.test.mjs

import test from 'node:test';
import assert from 'node:assert/strict';
import { definePack, validatePack, createEngine, mulberry32, stateRng } from '../dist/js/api.js';

test('define → validate → run: the whole authoring loop through the front door', () => {
  const choice = (label) => ({
    label,
    governingStats: { grit: 1 },
    outcomes: {
      bad: { text: 'It breaks.', effects: { grit: -2, burnout: 4 } },
      good: { text: 'It holds.', effects: { grit: 4, score: 5 } },
      incredible: { text: 'It sings.', effects: { grit: 7, score: 10 } },
    },
  });
  const events = Array.from({ length: 9 }, (_, i) => ({
    id: `card_${i}`,
    act: (i % 3) + 1,
    choices: { left: choice('Push'), right: choice('Rest') },
  }));
  const loadouts = [{ id: 'author', name: 'The Author', unlockedByDefault: true }];
  const pack = definePack({
    id: 'api-fixture',
    manifest: {
      stats: ['grit'],
      resources: ['score'],
      segments: [{ length: 3, crossroads: true }, { length: 3 }, { length: 3 }],
      paths: { publish: { id: 'publish', name: 'Publish', blurb: '', gateLabel: '', icon: '▲' } },
      winGates: { publish: { grit: 50, score: 20 } },
      statMeta: { grit: { name: 'Grit', icon: '◆' }, burnout: { name: 'Doubt', icon: '△' } },
    },
    events,
    tutorialEvents: [],
    loadouts,
    loadoutById: (id) => loadouts.find((l) => l.id === id) ?? null,
  });

  const report = validatePack(pack);
  assert.deepEqual(report.errors, []);
  assert.equal(report.ok, true);

  // Run it on an ISOLATED instance — no useContentPack, no global setup.
  const engine = createEngine(pack);
  const state = engine.newRun('author', [], mulberry32(41), []);
  state.seed = 42;
  const play = stateRng(state);
  let guard = 0;
  while (state.phase !== 'ended' && guard++ < 60) {
    if (state.phase === 'crossroads') { engine.commitPath(state, 'publish'); continue; }
    const ev = engine.drawNextCard(state, play);
    if (!ev) { state.cardsPlayedInAct = engine.actLength(state, state.act); }
    else engine.resolveSwipe(state, guard % 2 ? 'left' : 'right', play, {});
    const step = engine.advance(state);
    if (step.kind === 'finale') engine.evaluateFinale(state);
  }
  assert.equal(state.phase, 'ended', 'the authored pack plays to a terminal state');
  assert.ok(engine.legacyPoints(state) >= 1);
});

test('validatePack through the front door still reports repairable issues', () => {
  const v = validatePack({ id: 'broken' });
  assert.equal(v.ok, false);
  assert.ok(v.errors.some((e) => e.code === 'manifest-missing'));
  assert.ok(v.errors[0].fix, 'issues carry a suggested fix');
});
