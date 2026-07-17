// The clarity bundle — executable invariants. The Résumé/history/help hooks
// are pure reads the shell calls with whatever meta/summary a save carries,
// including fresh installs and pre-odyssey saves — so the hard rules are:
// never throw on empty shapes, never leak undefined/NaN into player-facing
// strings, and tell the ledger's truth.

import test from 'node:test';
import assert from 'node:assert';
import {
  ODYSSEY_STAT_INFO, ODYSSEY_HELP_BLOCKS,
  odysseyResume, odysseyHistoryEntry, odysseyHistoryStat, odysseyTwistNote,
} from '../dist/js/packs/odyssey/ledger.js';

test('statInfo covers every core stat + burnout; help blocks exist and name the pack’s own nouns', () => {
  for (const k of ['might', 'guile', 'lore', 'burnout']) assert.ok(ODYSSEY_STAT_INFO[k], `missing statInfo.${k}`);
  assert.ok(ODYSSEY_HELP_BLOCKS.length >= 5);
  const all = ODYSSEY_HELP_BLOCKS.join(' ');
  for (const noun of ['Expedition', 'Poseidon', 'Athena', 'Renown', 'Nostos', 'Kleos', 'prophecy']) {
    assert.ok(all.includes(noun), `help never mentions ${noun}`);
  }
});

test('resume tolerates empty, fresh, and legacy metas without leaking', () => {
  for (const meta of [
    {},
    { runs: 0, lpEarnedTotal: 0 },
    { runs: 3, lpEarnedTotal: 40, lifetime: { swipes: 90, incredibles: 2, bads: 11, byLoadout: {}, byPath: {} } },
  ]) {
    const rows = odysseyResume(meta);
    assert.ok(rows.length >= 5);
    const flat = JSON.stringify(rows);
    assert.ok(!/undefined|NaN/.test(flat), `leak in: ${flat.slice(0, 160)}`);
  }
});

test('resume tells the ledger’s truth', () => {
  const rows = odysseyResume({
    runs: 7, lpEarnedTotal: 120,
    lifetime: { swipes: 200, incredibles: 9, bads: 30, byLoadout: { kings_hall: { runs: 4, wins: 2 } }, byPath: {} },
    odyssey: {
      fragments: ['sea', 'bow'], oarRoad: false,
      tellings: { count: 7, byEnding: { nostos: 3, wrath: 2, calypso: 2 }, named: 4, nobody: 3, crewLostTotal: 23 },
    },
  });
  const flat = JSON.stringify(rows);
  assert.ok(flat.includes('"2 of 3"'), 'turnings held misread');
  assert.ok(flat.includes('23'), 'men named in the sand misread');
  assert.ok(/Shouted whole.*4 tellings/.test(flat));
  assert.ok(/The King’s Hall.*4 nights, 2 won/.test(flat));
  assert.ok(/The Homecoming.*×3/.test(flat));
  assert.ok(!flat.includes('Oar Road'), 'oar road row must not show unsung');
  const sung = JSON.stringify(odysseyResume({ runs: 1, lpEarnedTotal: 0, odyssey: { oarRoad: true } }));
  assert.ok(sung.includes('sung end to end'));
});

test('history entry/stat: real fields in, compact row out; legacy rows stay blank not broken', () => {
  // Pin updated deliberately in pass 24: the row also carries the Night's
  // Vase fields (vExp/vAth/vPos/vSt) so the gallery of nights can repaint.
  assert.deepStrictEqual(
    odysseyHistoryEntry({ renown: 7.2, crewLost: 5, expedition: 9.4, athena: 6, poseidon: 2, flags: ['ody_done_cyclops'] }),
    { renown: 7, crewLost: 5, vExp: 9, vAth: 6, vPos: 2, vSt: 'c' });
  assert.deepStrictEqual(odysseyHistoryEntry({}), { renown: 0, crewLost: 0, vExp: 0, vAth: 0, vPos: 0, vSt: '' });
  assert.strictEqual(odysseyHistoryStat({ renown: 7, crewLost: 5 }), '🌟7 · ⚰5');
  assert.strictEqual(odysseyHistoryStat({}), '', 'a pre-pass-4 history row must render no stat, not garbage');
});

test('twist note words both directions and pluralizes', () => {
  assert.match(odysseyTwistNote(-2), /2 strokes SHORT/);
  assert.match(odysseyTwistNote(2), /2 strokes LONG/);
  assert.match(odysseyTwistNote(-1), /1 stroke SHORT/);
  assert.ok(!/undefined/.test(odysseyTwistNote(3)));
});
