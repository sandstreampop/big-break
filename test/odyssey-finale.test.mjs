// The run-keyed finale variants (pass 19) — executable invariants. Each
// variant fires on exactly the run that earned it, precedence runs
// rarest-first, and every other run falls through to the static table.

import test from 'node:test';
import assert from 'node:assert';
import { odysseyPresenter } from '../dist/js/packs/odyssey/presenter.js';

const finale = (run, ending, result) =>
  odysseyPresenter.presentFinale({ run: { flags: [], ...run }, ending, result, meta: {} });

test('the Oar Road still outranks everything on a whole prophecy', () => {
  const v = finale({ ending: { result: 'success' }, flags: ['ody_oar_road'], loadout: 'kings_hall', expedition: 12, poseidon: 0 }, 'nostos', 'success');
  assert.strictEqual(v.title, 'The Oar Road');
});

test('every bench answered: a fleet brought home whole gets its own verse', () => {
  const v = finale({ ending: { result: 'success' }, loadout: 'kings_hall', expedition: 12, poseidon: 2 }, 'nostos', 'success');
  assert.strictEqual(v.title, 'Every Bench Answered');
  // The fisherman's hearth launches fourteen — twelve home is two men short.
  assert.strictEqual(finale({ ending: { result: 'success' }, loadout: 'fishermans_hearth', expedition: 12 }, 'nostos', 'success'), null, 'a bled fleet reads the static homecoming');
  // A scarred telling launches nine: nine home is every bench IT had.
  const scarred = finale({ ending: { result: 'success' }, flags: ['comeback'], loadout: 'kings_hall', expedition: 9 }, 'nostos', 'success');
  assert.strictEqual(scarred.title, 'Every Bench Answered');
});

test('glory under no name, and glory the sea will collect on', () => {
  const nobody = finale({ ending: { result: 'success' }, flags: ['ody_nobody'], poseidon: 8 }, 'kleos', 'success');
  assert.strictEqual(nobody.title, 'The Song With No Name In It', 'nobody outranks the bill');
  const owed = finale({ ending: { result: 'success' }, poseidon: 7 }, 'kleos', 'success');
  assert.strictEqual(owed.title, 'The Song, and the Bill');
  assert.strictEqual(finale({ ending: { result: 'success' }, poseidon: 3 }, 'kleos', 'success'), null, 'a clean loud win reads the static song');
});

test('an unshouted wrath gets the colder verse; the shouted one keeps the shout', () => {
  const cold = finale({ ending: {}, poseidon: 10 }, 'wrath', null);
  assert.strictEqual(cold.title, 'The Sea Needs No Name');
  assert.strictEqual(finale({ ending: {}, flags: ['ody_named'], poseidon: 10 }, 'wrath', null), null,
    'a named wrath falls through to the static text, which already sings the shout');
});

test('no variant leaks onto partials, failures, or the other endings', () => {
  for (const [ending, result] of [['nostos', 'partial'], ['nostos', 'failure'], ['kleos', 'partial'], ['lotus', null], ['burnout', null], ['calypso', null]]) {
    assert.strictEqual(finale({ ending: { result }, loadout: 'kings_hall', expedition: 12, poseidon: 9 }, ending, result), null, `${ending}/${result}`);
  }
});

test('every variant speaks: non-empty title and text, no undefined', () => {
  const mocks = [
    [{ ending: { result: 'success' }, flags: ['ody_oar_road'] }, 'nostos', 'success'],
    [{ ending: { result: 'success' }, loadout: 'kings_hall', expedition: 12 }, 'nostos', 'success'],
    [{ ending: { result: 'success' }, flags: ['ody_nobody'] }, 'kleos', 'success'],
    [{ ending: { result: 'success' }, poseidon: 8 }, 'kleos', 'success'],
    [{ ending: {}, poseidon: 10 }, 'wrath', null],
  ];
  for (const [run, e, r] of mocks) {
    const v = finale(run, e, r);
    assert.ok(v && v.title && v.text && !`${v.title}${v.text}`.includes('undefined'));
  }
});
