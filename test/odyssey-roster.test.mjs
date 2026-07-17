// The Benches — executable invariants. The roster is a pure read of meta
// rendered by the shell's generic gallery: the hard rules are that every
// crew name the loss system can speak appears exactly once (the gallery and
// the sand must agree on who rows), every member has a face and a note, no
// leaks on empty/legacy metas, and the meta-reactive lines tell the ledger's
// truth.

import test from 'node:test';
import assert from 'node:assert';
import { odysseyRoster } from '../dist/js/packs/odyssey/roster.js';
import { CREW } from '../dist/js/packs/odyssey/crew.js';

test('every crew member the sand can name has a bench in the gallery', () => {
  const data = odysseyRoster({});
  const benches = data.groups.find((g) => g.label === 'The benches');
  const names = benches.members.map((m) => m.name);
  for (const m of CREW) assert.ok(names.includes(m.name), `${m.name} missing from The Benches`);
  assert.strictEqual(new Set(names).size, names.length, 'duplicate roster names');
});

test('every member has a face and a note; no leaks on hostile metas', () => {
  for (const meta of [{}, undefined, { odyssey: { tellings: { count: 7, crewLostTotal: 23 } } }]) {
    const data = odysseyRoster(meta);
    assert.ok(data.title && data.groups.length === 3);
    for (const g of data.groups) {
      for (const m of g.members) {
        assert.ok(m.face && m.face.includes('svg'), `${m.name}: face must be a pack sprite`);
        assert.ok(m.note && m.note.length > 10, `${m.name}: missing note`);
        assert.ok(!/undefined|NaN/.test(JSON.stringify(m)), `${m.name}: leak`);
      }
    }
  }
});

test('the ledger-reactive lines tell the truth', () => {
  const fresh = odysseyRoster({});
  const veteran = odysseyRoster({ odyssey: { tellings: { count: 6, crewLostTotal: 14 } } });
  const bardFresh = fresh.groups[1].members.find((m) => m.name === 'The bard').note;
  const bardVet = veteran.groups[1].members.find((m) => m.name === 'The bard').note;
  assert.ok(!/\d+ nights/.test(bardFresh));
  assert.ok(/6 nights/.test(bardVet));
  const expVet = veteran.groups[2].members.find((m) => m.name === 'The Expedition').note;
  assert.ok(/taken 14 of them/.test(expVet));
});
