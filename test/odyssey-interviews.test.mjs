// The fire's last word — executable invariants. The exit interviews ride a
// FORCED overlay on the game-over path (the player cannot dismiss it without
// answering), so the hard rules are: every terminal ending key has an
// interview with both arms complete, the epilogue never double-speaks over
// an interview's answer, and both are pure.

import test from 'node:test';
import assert from 'node:assert';
import { ODYSSEY_EXIT_INTERVIEWS, odysseyEpilogue, epilogueSizes } from '../dist/js/packs/odyssey/interviews.js';
import { odysseyManifest } from '../dist/js/packs/odyssey/manifest.js';

test('every terminal ending key has a complete interview (both arms: label/exit/lp/text)', () => {
  const terminalKeys = [...odysseyManifest.terminalRules.map((r) => r.ending), 'burnout'];
  for (const key of terminalKeys) {
    const iv = ODYSSEY_EXIT_INTERVIEWS[key];
    assert.ok(iv, `no interview for terminal ending "${key}"`);
    assert.ok(iv.context && iv.prompt, `${key}: missing context/prompt`);
    for (const side of ['left', 'right']) {
      const arm = iv[side];
      assert.ok(arm?.label && arm?.exit && arm?.text, `${key}.${side}: incomplete arm`);
      assert.ok(Number.isFinite(arm.lp) && arm.lp >= 0, `${key}.${side}: lp must be a non-negative number`);
    }
  }
  // No orphan interviews for keys that can never fire.
  for (const key of Object.keys(ODYSSEY_EXIT_INTERVIEWS)) {
    assert.ok(terminalKeys.includes(key), `interview "${key}" has no terminal rule to fire it`);
  }
});

test('the epilogue speaks only after finale tellings — gameovers belong to the interview', () => {
  for (const key of ['wrath', 'lotus', 'circe', 'calypso', 'burnout']) {
    assert.strictEqual(odysseyEpilogue({ ending: { key, result: null }, flavorSeed: 7 }), '',
      `epilogue double-spoke over the ${key} interview`);
  }
  for (const [key, result] of [['nostos', 'success'], ['kleos', 'success'], ['nostos', 'partial'], ['kleos', 'partial'], ['nostos', 'failure'], ['kleos', 'failure']]) {
    const text = odysseyEpilogue({ ending: { key, result }, flavorSeed: 7 });
    assert.ok(text.length > 80, `${key}:${result} epilogue missing or too short`);
    assert.ok(!/undefined|NaN/.test(text));
  }
});

test('epilogue is pure and seed-rotated', () => {
  const a = odysseyEpilogue({ ending: { key: 'nostos', result: 'success' }, flavorSeed: 11 });
  const b = odysseyEpilogue({ ending: { key: 'nostos', result: 'success' }, flavorSeed: 11 });
  assert.strictEqual(a, b, 'same seed must give the same last word');
  let varied = false;
  for (let s = 1; s < 12; s++) {
    if (odysseyEpilogue({ ending: { key: 'nostos', result: 'success' }, flavorSeed: s }) !== a) { varied = true; break; }
  }
  assert.ok(varied, 'eleven seeds never varied the fire’s reaction');
});

test('hostile state never leaks', () => {
  assert.strictEqual(odysseyEpilogue({}), '');
  assert.strictEqual(odysseyEpilogue({ ending: null }), '');
  assert.ok(!/undefined/.test(odysseyEpilogue({ ending: { key: 'nostos', result: 'success' } })));
});

test('the last word stays wide (pass 47): every epilogue pool holds four', () => {
  const sizes = epilogueSizes();
  for (const k of ['nostos:success', 'kleos:success', 'partial', 'failure']) {
    assert.ok(sizes[k] >= 4, `${k} has ${sizes[k]} epilogues — the last word thinned back to a repeat`);
  }
  // And the rotation actually reaches the new variants: distinct flavor
  // seeds must produce more than two distinct closings per pool.
  const seen = new Set();
  for (let seed = 1; seed <= 24; seed++) {
    seen.add(odysseyEpilogue({ flavorSeed: seed, ending: { key: 'nostos', result: 'success' } }));
  }
  assert.ok(seen.size >= 3, `24 seeds reached only ${seen.size} homecoming closings`);
});
