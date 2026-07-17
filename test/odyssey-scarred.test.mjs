// The Scarred Telling remembers (pass 48) — executable invariants. The
// three scars deal ONLY to a comeback fleet (the transform's flag), one per
// act, at the memory-card 4x weight — and, like the memory cards, they are
// invisible to seeded sims by construction (the generic driver never
// applies a comeback), which is what keeps the goldens byte-identical.

import test from 'node:test';
import assert from 'node:assert';
import * as engine from '../dist/js/engine.js';
import { odysseyPack } from '../dist/js/packs/odyssey/pack.js';
import { odysseyComeback } from '../dist/js/packs/odyssey/modes.js';
import { SCARRED_EVENTS } from '../dist/js/packs/odyssey/events-scarred.js';
import { itineraryPlugin } from '../dist/js/packs/odyssey/itinerary.js';

engine.useContentPack(odysseyPack);

test('one scar per act, all gated on the transform’s flag', () => {
  assert.strictEqual(SCARRED_EVENTS.length, 3);
  assert.deepStrictEqual(SCARRED_EVENTS.map((e) => e.act), [1, 2, 3]);
  for (const ev of SCARRED_EVENTS) {
    assert.deepStrictEqual(ev.requires, { flagsAll: ['comeback'] }, ev.id);
    assert.ok(ev.id.startsWith('ody_scar_'), ev.id);
  }
});

test('a scarred fleet meets its scars; a first telling never does', () => {
  const scarred = engine.newRun(odysseyPack, odysseyPack.loadouts[0].id, [], engine.mulberry32(5), []);
  odysseyComeback(scarred);
  const fresh = engine.newRun(odysseyPack, odysseyPack.loadouts[0].id, [], engine.mulberry32(5), []);
  for (const ev of SCARRED_EVENTS) {
    assert.ok(engine.requiresOk(ev.requires, scarred), `${ev.id} must deal to the scarred fleet`);
    assert.ok(!engine.requiresOk(ev.requires, fresh), `${ev.id} must never deal to a first telling`);
  }
});

test('eligible scars deal at the memory-card weight', () => {
  for (const ev of SCARRED_EVENTS) {
    assert.strictEqual(itineraryPlugin.weightDeck({}, ev, 1), 4, ev.id);
  }
  // The one-voice FLAG namespace does not collide with the scar EVENT
  // prefix: the nurse card is not a scar card.
  const nurse = odysseyPack.events.find((e) => e.id === 'ody_a3_nurse_scar');
  assert.strictEqual(itineraryPlugin.weightDeck({}, nurse, 1), 1);
});
