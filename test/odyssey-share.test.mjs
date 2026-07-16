// The telling travels — executable invariants. The share string is the one
// piece of this pack that leaves the app, so the hard rules are: every
// ending class produces a complete, truthful record; nothing undefined/NaN
// ever ships; the weather strip is the run's actual tierLog; and the news
// slot answers every day number.

import test from 'node:test';
import assert from 'node:assert';
import { odysseyShareText, odysseyNews, HARBOR_NEWS } from '../dist/js/packs/odyssey/share.js';

const base = {
  loadout: 'kings_hall', path: 'nostos', result: 'success', endingKey: 'nostos',
  tierLog: ['good', 'bad', 'incredible', 'good'], flags: ['ody_fore_sea'],
  expedition: 8, renown: 6, poseidon: 1, daily: null,
};

test('a finale telling shares its full record', () => {
  const t = odysseyShareText(base, 41);
  assert.match(t, /^THE ODYSSEY\n/);
  assert.match(t, /The King’s Hall → Nostos — the Homecoming → SUCCESS/);
  assert.match(t, /🟩🟥🟪🟩/);
  assert.match(t, /⛵ 8 hulls · 🌟 6 renown · 🔱 sea at 1 · 🏺 1 of 3 turnings · \+41 LP/);
  assert.match(t, /big-break\/odyssey\/$/);
  assert.ok(!/undefined|NaN/.test(t));
});

test('every early ending shares a verdict, never a blank', () => {
  for (const key of ['wrath', 'lotus', 'circe', 'calypso', 'burnout']) {
    const t = odysseyShareText({ ...base, result: null, endingKey: key }, 12);
    assert.ok(/THE SEA ANSWERED|BANKED AT|THE ROWING ENDED/.test(t), `${key}: no verdict in "${t.split('\n')[1]}"`);
    assert.ok(!/undefined|NaN/.test(t), key);
  }
});

test('the modes mark the share head', () => {
  assert.match(odysseyShareText({ ...base, daily: '2026-07-16', dailyStreak: 3 }, 20),
    /THE ODYSSEY · The Same Sea 2026-07-16[\s\S]*🔥 night 3/);
  assert.match(odysseyShareText({ ...base, flags: ['comeback'] }, 20), /· The Scarred Telling/);
});

test('hostile summaries never leak', () => {
  const t = odysseyShareText({}, 0);
  assert.ok(!/undefined|NaN/.test(t), t);
  assert.match(t, /THE TELLING ENDED|no road chosen/);
});

test('the harbor has a rumor every day, and the same one for everyone', () => {
  for (let d = 0; d < 25; d++) {
    const n = odysseyNews(d);
    assert.ok(n?.text && n?.src, `day ${d}`);
    assert.deepStrictEqual(odysseyNews(d), odysseyNews(d));
  }
  assert.strictEqual(new Set(HARBOR_NEWS.map((n) => n.text)).size, HARBOR_NEWS.length, 'duplicate rumors');
});
