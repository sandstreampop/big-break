// One meaning, one sound (I6; the Sound Law, ADR-0001): the lexicon is a
// closed canon — every event name maps to its OWN recipe (no two meanings
// share a sound), the shell-cue routing voices only the stroke, and the
// pure cue mappings pick at most one lexicon event per moment, by the
// declared priority. Runs against dist/ (build first).

import test from 'node:test';
import assert from 'node:assert';

const { LEXICON, EVENTS, resultCue, endingCue, odysseySoundscape } =
  await import('../dist/js/packs/odyssey/soundscape.js');

test('the lexicon is the canon: sacred few, one recipe each, never reused', () => {
  const names = Object.keys(LEXICON);
  assert.deepEqual(names.sort(), [
    'bowString', 'dawnBirds', 'fragmentChime', 'gutter', 'owlNote', 'stroke', 'wave',
  ], 'the canon changed — amend NORTH-STAR/the ADR first, then this pin');
  // No two meanings share a recipe (function identity — an alias would be
  // one sound with two meanings, the exact thing the law bans).
  const fns = Object.values(LEXICON);
  assert.equal(new Set(fns).size, fns.length, 'two lexicon meanings share one recipe');
  // On the order of a dozen, forever: the lexicon grows one earned entry at
  // a time, never past the law's ceiling.
  assert.ok(names.length <= 12, 'the lexicon has outgrown the sacred few');
});

test('the shell cues stay silent except the stroke', () => {
  // The SILENCE is the assertion, not the absence of a throw: the routing
  // table voices exactly one shell cue — the swipe — and it speaks the
  // stroke recipe itself (any second entry is a new sound the law must
  // license first).
  assert.deepEqual(Object.keys(EVENTS), ['swipe'], 'a shell cue beyond the stroke has been voiced');
  assert.equal(EVENTS.swipe, LEXICON.stroke, 'the swipe must speak the canon stroke, not a copy');
  // event() must not throw for any shell cue, voiced or not.
  for (const cue of ['swipe', 'ui', 'good', 'bad', 'incredible', 'win', 'winPath', 'gameover', 'flashpoint', 'cash', 'hush', 'nonsense']) {
    odysseySoundscape.event(cue);
  }
  // The haptic re-voicing answers every shell moment it knows and silences
  // by null (never undefined, which would fall back to the shell default).
  for (const name of ['result-bad', 'result-incredible', 'set-piece', 'flashpoint']) {
    assert.equal(odysseySoundscape.haptic(name), null, `${name} must be explicitly silenced`);
  }
  assert.deepEqual(odysseySoundscape.haptic('swipe'), [10]);
  assert.deepEqual(odysseySoundscape.haptic('set-piece-blow'), [60, 40, 90]);
});

test('resultCue: one sound at most, by the declared priority', () => {
  const r = (id, deltas = []) => ({ event: { id }, deltas });
  assert.equal(resultCue(r('ody_hall_nostos')), 'bowString');
  assert.equal(resultCue(r('ody_hall_kleos', [{ key: 'renown', amount: 2 }])), 'bowString');
  assert.equal(resultCue(r('ody_tiresias', [{ key: 'athena', amount: 1 }, { key: 'poseidon', amount: -2 }])), 'fragmentChime');
  assert.equal(resultCue(r('ody_tiresias_oar', [{ key: 'athena', amount: 1 }])), 'fragmentChime');
  assert.equal(resultCue(r('ody_a1_squall', [{ key: 'poseidon', amount: 2 }])), 'wave');
  assert.equal(resultCue(r('ody_a2_offering', [{ key: 'athena', amount: 1 }])), 'owlNote');
  // Both gods move: Poseidon outranks (his sea, his say) — never two sounds.
  assert.equal(resultCue(r('ody_a1_omen', [{ key: 'poseidon', amount: 1 }, { key: 'athena', amount: 2 }])), 'wave');
  // A god easing is not a god moving.
  assert.equal(resultCue(r('ody_a1_ration', [{ key: 'poseidon', amount: -1 }])), null);
  assert.equal(resultCue(r('ody_a1_feast', [{ key: 'renown', amount: 2 }])), null);
  assert.equal(resultCue({ event: null, deltas: [] }), null);
});

test('endingCue: dawn birds for Ithaca, the gutter for the sea and the beach, quiet for the banked', () => {
  assert.equal(endingCue('nostos', 'success'), 'dawnBirds');
  assert.equal(endingCue('nostos', 'partial'), 'dawnBirds');
  assert.equal(endingCue('nostos', 'failure'), 'gutter');
  assert.equal(endingCue('wrath', null), 'gutter');
  assert.equal(endingCue('burnout', null), 'gutter');
  for (const banked of ['lotus', 'circe', 'calypso']) assert.equal(endingCue(banked, null), null);
  assert.equal(endingCue('kleos', 'success'), null, 'the bow already sang at the Hall');
  assert.equal(endingCue(null, null), null);
});

test('every cue a mapping can pick exists in the lexicon', () => {
  for (const name of ['bowString', 'fragmentChime', 'wave', 'owlNote', 'dawnBirds', 'gutter']) {
    assert.equal(typeof LEXICON[name], 'function', `${name} named by a mapping but missing from the canon`);
  }
});
