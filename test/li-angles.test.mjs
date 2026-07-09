// The Edit (Angles) equip contract — the presenter hook the shell's gear-slot
// flow calls (INCIDENTS #2). The seeded runs rarely fill all three slots, so
// the swap branch (`gearChooser` → equipItem(state, newId, dropId)) has no
// organic sim/smoke coverage; this exercises every branch of the hook
// directly, against the exact call shapes js/ui/card.ts uses.
//
// Run: npm run build && node --test test/li-angles.test.mjs

import test from 'node:test';
import assert from 'node:assert/strict';
import { loveIslandPack } from '../dist/js/packs/love-island/pack.js';
import { CONFIG } from '../dist/js/config.js';

const equip = loveIslandPack.presenter.equipItem;

test('a granted Angle lands in the Edit slots (the inline-pending flow)', () => {
  const state = { accessories: [] };
  const extra = equip(state, 'angle_loyal');
  assert.deepEqual(state.accessories, ['angle_loyal']);
  assert.deepEqual(extra, [], 'Angles carry no onAcquire payload — no extra deltas');
});

test('the slots-full swap: drop one, the new Angle fits (gearChooser flow)', () => {
  const state = { accessories: ['angle_loyal', 'angle_villain', 'angle_comedy'] };
  assert.equal(state.accessories.length, CONFIG.accessorySlots, 'fixture fills every slot');
  equip(state, 'angle_type', 'angle_villain'); // UI: "Drop The Villain"
  assert.deepEqual(state.accessories, ['angle_loyal', 'angle_comedy', 'angle_type'],
    'dropId leaves, the new Angle enters — same arithmetic as music equipAccessory');
});

test('the cap holds when nothing is dropped', () => {
  const state = { accessories: ['angle_loyal', 'angle_villain', 'angle_comedy'] };
  equip(state, 'angle_type'); // no dropId → full slots reject the equip
  assert.equal(state.accessories.length, CONFIG.accessorySlots);
  assert.ok(!state.accessories.includes('angle_type'));
});

test('equip is idempotent and survives a missing accessories array', () => {
  const state = {};
  equip(state, 'angle_loyal');
  equip(state, 'angle_loyal');
  assert.deepEqual(state.accessories, ['angle_loyal']);
});
