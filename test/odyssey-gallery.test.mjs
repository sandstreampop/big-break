// The gallery of nights (pass 24) — executable invariants. A Past-Lives row
// stores the vase's needs (historyEntry); vaseFromHistory re-hydrates them
// through the LIVE vase's exact rules; rows from before the vase existed
// stay unpainted; the gallery caps at five and captions honestly.

import test from 'node:test';
import assert from 'node:assert';
import { nightVase, vaseFromHistory, encodeStations } from '../dist/js/packs/odyssey/vase.js';
import { odysseyHistoryEntry } from '../dist/js/packs/odyssey/ledger.js';
import { odysseyPresenter } from '../dist/js/packs/odyssey/presenter.js';

const summary = {
  loadout: 'kings_hall', path: 'nostos', result: 'success', endingKey: 'nostos',
  expedition: 9, athena: 6, poseidon: 2, renown: 7, crewLost: 3,
  flags: ['ody_done_cyclops', 'ody_done_underworld', 'ody_done_circe'],
};

test('a stored row repaints EXACTLY the live vase (same rules, same band)', () => {
  const row = { endingKey: summary.endingKey, result: summary.result, path: summary.path, ...odysseyHistoryEntry(summary) };
  const remembered = vaseFromHistory(row);
  const live = nightVase({
    flags: summary.flags, expedition: 9, athena: 6, poseidon: 2,
    ending: { key: 'nostos', result: 'success' }, path: 'nostos',
  });
  assert.deepStrictEqual(remembered.motifs, live.motifs, 'the memory must not redraw the night');
});

test('stations round-trip through the packed string, stayed beats done', () => {
  assert.strictEqual(encodeStations(['ody_done_cyclops', 'ody_stayed_calypso', 'ody_done_calypso']), 'cKk');
  const v = vaseFromHistory({ endingKey: 'calypso', result: null, vExp: 5, vAth: 0, vPos: 3, vSt: 'cKk' });
  assert.ok(v.motifs.includes('the warm island, near'), 'a banked island paints close even from memory');
});

test('rows from before the vase stay unpainted', () => {
  assert.strictEqual(vaseFromHistory({ endingKey: 'wrath', renown: 3, crewLost: 12 }), null);
  assert.strictEqual(vaseFromHistory(undefined), null);
});

test('the gallery caps at five, skips unpainted rows, and captions honestly', () => {
  const painted = { endingKey: 'nostos', result: 'success', path: 'nostos', vExp: 9, vAth: 2, vPos: 1, vSt: 'c' };
  const old = { endingKey: 'wrath', renown: 3 };
  const html = odysseyPresenter.historyGallery([old, painted, painted, painted, painted, painted, painted]);
  assert.strictEqual((html.match(/ody-gallery-night/g) || []).length, 5, 'five nights, no more');
  assert.ok(html.includes('<figcaption>Home</figcaption>'));
  const banked = odysseyPresenter.historyGallery([{ endingKey: 'calypso', result: null, vExp: 5, vAth: 0, vPos: 2, vSt: 'K' }]);
  assert.ok(banked.includes('<figcaption>The island</figcaption>'));
  assert.strictEqual(odysseyPresenter.historyGallery([old]), null, 'all-old history renders nothing');
  assert.strictEqual(odysseyPresenter.historyGallery([]), null);
});
