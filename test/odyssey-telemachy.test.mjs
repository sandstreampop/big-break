// The Telemachy (pass 34) — executable invariants for the deck's first
// within-run story arc. The thread's grammar is what matters: the act-1
// question stamps the CHOICE on every tier (an arc must not hinge on
// luck); the act-2 continuation accepts either answer and stamps the
// watch; the two act-3 payoffs are mutually exclusive on the act-1 answer,
// so the thread's ending always remembers its beginning; and eligible
// continuations deal at 4x so a thread that starts usually finishes.

import test from 'node:test';
import assert from 'node:assert';
import * as engine from '../dist/js/engine.js';
import { odysseyPack } from '../dist/js/packs/odyssey/pack.js';
import { TELEMACHY_EVENTS } from '../dist/js/packs/odyssey/events-telemachy.js';
import { itineraryPlugin } from '../dist/js/packs/odyssey/itinerary.js';

const byId = (id) => TELEMACHY_EVENTS.find((e) => e.id === id);
const TIERS = ['bad', 'good', 'incredible'];

test('the act-1 question stamps the choice on every tier — never the luck', () => {
  const ev = byId('ody_tel_grain_ship');
  assert.strictEqual(ev.act, 1);
  assert.ok(!ev.requires, 'the opener is ungated — any telling may start the thread');
  for (const t of TIERS) {
    assert.strictEqual(ev.choices.left.outcomes[t].effects.addFlag, 'ody_tel_word', `left/${t}`);
    assert.strictEqual(ev.choices.right.outcomes[t].effects.addFlag, 'ody_tel_silence', `right/${t}`);
  }
});

test('the act-2 continuation accepts either answer and stamps the watch', () => {
  const ev = byId('ody_tel_traders_return');
  assert.strictEqual(ev.act, 2);
  assert.deepStrictEqual(ev.requires, {
    anyOf: [{ flagsAll: ['ody_tel_word'] }, { flagsAll: ['ody_tel_silence'] }],
  });
  for (const side of ['left', 'right']) {
    for (const t of TIERS) {
      assert.strictEqual(ev.choices[side].outcomes[t].effects.addFlag, 'ody_tel_watched', `${side}/${t}`);
    }
  }
});

test('the two payoffs are mutually exclusive on the act-1 answer', () => {
  const word = byId('ody_tel_strait_word');
  const silence = byId('ody_tel_swineherd_door');
  assert.strictEqual(word.act, 3);
  assert.strictEqual(silence.act, 3);
  assert.deepStrictEqual(word.requires, { flagsAll: ['ody_tel_watched', 'ody_tel_word'] });
  assert.deepStrictEqual(silence.requires, { flagsAll: ['ody_tel_watched', 'ody_tel_silence'] });
  // The engine agrees: a run that sent word can only ever meet the strait
  // payoff; a run that sent silence only the swineherd's door.
  engine.useContentPack(odysseyPack);
  const wordRun = { flags: ['ody_tel_word', 'ody_tel_watched'], stats: {} };
  const silenceRun = { flags: ['ody_tel_silence', 'ody_tel_watched'], stats: {} };
  assert.ok(engine.requiresOk(word.requires, wordRun));
  assert.ok(!engine.requiresOk(silence.requires, wordRun));
  assert.ok(engine.requiresOk(silence.requires, silenceRun));
  assert.ok(!engine.requiresOk(word.requires, silenceRun));
});

test('a thread that starts usually finishes: continuations deal at 4x, the opener does not', () => {
  const opener = byId('ody_tel_grain_ship');
  const cont = byId('ody_tel_traders_return');
  const payoff = byId('ody_tel_strait_word');
  assert.strictEqual(itineraryPlugin.weightDeck({}, opener, 1), 1, 'the ungated opener draws at deck weight');
  assert.strictEqual(itineraryPlugin.weightDeck({}, cont, 1), 4);
  assert.strictEqual(itineraryPlugin.weightDeck({}, payoff, 1), 4);
});

test('the arc never names the boy', () => {
  for (const ev of TELEMACHY_EVENTS) {
    const text = JSON.stringify(ev);
    assert.ok(!/Telemach/i.test(text), `${ev.id}: this fire calls him the boy`);
    assert.ok(!/Odysseus/i.test(text), `${ev.id}: nor the father`);
  }
});
