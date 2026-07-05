// The Daily Villa share card (R6): the string IS the growth surface, so it
// gets a snapshot — spoiler-safe (no cast names, no card ids), grid intact,
// streak only when it exists. Goldens don't cover share text (daily seeds
// live outside seeded traces); this does.

import test from 'node:test';
import assert from 'node:assert/strict';
import { loveIslandPack } from '../dist/js/packs/love-island/pack.js';

const share = loveIslandPack.presenter.shareText;

const BASE = {
  loadout: 'retriever_girl', path: 'realthing', result: 'success',
  tierLog: ['good', 'good', 'bad', 'incredible', 'good'],
  cardLog: [{}, {}, {}, {}, {}],
  partner: 'kai', exes: ['tyler'], exclusive: true,
  secretsKnown: ['rival'], public: 44, followers: 31,
};

test('the daily share card: exact shape, spoiler-safe, streak shown', () => {
  const s = share({ ...BASE, daily: '2026-07-05', dailyStreak: 3 }, 42);
  assert.equal(s,
    'THE VILLA Daily 2026-07-05\n' +
    'The Golden Retriever → The Real Thing → SUCCESS\n' +
    '🟩🟩🟥🟪🟩\n' +
    '💘 2 couples 🔒 · 🤫 1 · 🌴 5 days · 🔥 streak 3 · +42 LP\n' +
    'https://sandstreampop.github.io/big-break/love-island/');
  assert.ok(!s.includes('Kai') && !s.includes('kai,'), 'no cast names leak');
  assert.ok(!s.includes('li_'), 'no card ids leak');
});

test('a normal season: no daily head, no streak line', () => {
  const s = share({ ...BASE, exes: [], exclusive: false, secretsKnown: [] }, 10);
  assert.equal(s,
    'THE VILLA\n' +
    'The Golden Retriever → The Real Thing → SUCCESS\n' +
    '🟩🟩🟥🟪🟩\n' +
    '💘 1 couple · 🌴 5 days · +10 LP\n' +
    'https://sandstreampop.github.io/big-break/love-island/');
});

test('a dumped season reads DUMPED and keeps the grid', () => {
  const s = share({ ...BASE, result: null, endingKey: 'dumped', partner: null, exes: [], path: null }, 4);
  assert.ok(s.includes('→ no Intention declared → DUMPED'));
  assert.ok(s.includes('💘 0 couples'));
});

test('a day-one streak stays quiet (streak 1 is not a streak)', () => {
  const s = share({ ...BASE, daily: '2026-07-05', dailyStreak: 1 }, 42);
  assert.ok(!s.includes('🔥'), 'no streak brag on day one');
});
