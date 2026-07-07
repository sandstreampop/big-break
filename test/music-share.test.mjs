// Music's end-of-run share string (parity with Love Island's li-share test).
// The share text is the growth surface — the exact string a player copies —
// and goldens don't cover it. This snapshots the genre-neutral composer
// (js/share-text.ts) as the music game drives it, resolving the loadout and
// genre-prefixed path label from the real music pack.
//
// Run: node --test test/music-share.test.mjs

import test from 'node:test';
import assert from 'node:assert/strict';
import { buildDefaultShareText, SHARE_TIER_EMOJI, DEFAULT_FAIL_LABELS } from '../dist/js/packs/music/share-text.js';
import { musicPack } from '../dist/js/packs/music/pack.js';
import { genreById } from '../dist/js/packs/music/data/genres.js';

const URL = 'https://sandstreampop.github.io/big-break/';

// Resolve the pieces exactly as ui.ts's shareTextFor does for the music pack.
function musicShare(summary, lp) {
  const inst = musicPack.loadoutById(summary.loadout);
  const genre = summary.genre ? genreById(summary.genre) : null;
  const pathName = (genre ? genre.name + ' ' : '') + (summary.path ? musicPack.manifest.paths[summary.path].name : 'the void');
  return buildDefaultShareText(summary, lp, {
    loadoutName: inst ? inst.name : null,
    pathName,
    failLabels: musicPack.presenter.failLabels,
    url: URL,
  });
}

const INST = musicPack.loadouts.find((i) => i.unlockedByDefault) || musicPack.loadouts[0];
const PATH = Object.keys(musicPack.manifest.winGates)[0];

test('a won music career: five-line share, tier strip, chart peak', () => {
  const summary = {
    loadout: INST.id, path: PATH, result: 'success',
    tierLog: ['good', 'good', 'bad', 'incredible'], fame: 88, chartPeak: 3,
  };
  const s = musicShare(summary, 120);
  const lines = s.split('\n');
  assert.equal(lines.length, 5, 'head / verdict / tier strip / stats / url');
  assert.equal(lines[0], 'BIG BREAK');
  assert.equal(lines[1], `${INST.name} → ${musicPack.manifest.paths[PATH].name} → SUCCESS`);
  assert.equal(lines[2], '🟩🟩🟥🟪');
  assert.equal(lines[3], '★88 · Hot 10 #3 · +120 LP');
  assert.equal(lines[4], URL);
});

test('a failed run uses the pack fail label, no chart peak', () => {
  const summary = { loadout: INST.id, path: PATH, result: null, endingKey: 'burnout', tierLog: ['bad', 'bad'], fame: 12 };
  const s = musicShare(summary, 5);
  const labels = musicPack.presenter.failLabels || DEFAULT_FAIL_LABELS;
  assert.ok(s.includes(`→ ${labels.burnout}`), 'the burnout fail label shows');
  assert.ok(!s.includes('Hot 10'), 'no chart peak line when unset');
  assert.ok(s.endsWith(`★12 · +5 LP\n${URL}`));
});

test('a Daily run tags the head; an unknown loadout falls back to "?"', () => {
  const summary = { loadout: '__nope__', path: PATH, result: 'partial', daily: '2026-07-06', tierLog: ['good'], fame: 40 };
  const s = musicShare(summary, 10);
  assert.ok(s.startsWith('BIG BREAK Daily 2026-07-06\n'));
  assert.ok(s.split('\n')[1].startsWith('? → '), 'missing loadout renders as ?');
});

test('tier emoji map covers every tier and declined', () => {
  assert.deepEqual(Object.keys(SHARE_TIER_EMOJI).sort(), ['bad', 'declined', 'good', 'incredible']);
});
