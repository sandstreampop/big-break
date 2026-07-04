// Unit tests for the taste floor (tools/taste-core.mjs). The floor is wired
// into lint-content.mjs ahead of the Love Island deck (Phase A precedes
// content), so these fixtures are what prove it works this session — before any
// LI card exists to lint. See docs/games/love-island/VOICE.md for the taste.
//
// Run: node --test test/taste-core.test.mjs

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  bangIssue, clicheIssues, lengthIssue, stripQuoted, tasteIssues,
} from '../tools/taste-core.mjs';
// Genre-neutral checker (tools/) exercised against real game taste data (the
// game's own folder) — proving the wiring end to end before any card exists.
import { LOVE_ISLAND_TASTE, LOVE_ISLAND_CLICHES } from '../docs/games/love-island/taste.mjs';

test('bangIssue: one “!” is fine, two or an interrobang is hype', () => {
  assert.equal(bangIssue('I’ve got a text!'), null);
  assert.equal(bangIssue('Babe, we’re going on a date!'), null);
  assert.equal(bangIssue('A dry, flat line.'), null);
  assert.ok(bangIssue('So much drama!!'));
  assert.ok(bangIssue('Wait, what?!'));
  assert.ok(bangIssue('Two! Whole! Bangs!'));
});

test('stripQuoted: removes curly and straight quoted spans', () => {
  assert.equal(stripQuoted('He said “my head’s been turned” at the firepit').includes('head'), false);
  assert.equal(stripQuoted("She said 'it is what it is' plainly").includes('what it is'), false);
  assert.equal(stripQuoted('nothing quoted here').includes('nothing'), true);
});

test('clicheIssues: flags generic cliché in the narrating voice', () => {
  assert.deepEqual(clicheIssues('a clean, specific villa line', LOVE_ISLAND_CLICHES), []);
  assert.equal(clicheIssues('At the end of the day, love wins', LOVE_ISLAND_CLICHES).length, 1);
  // Case-insensitive, whole-phrase.
  assert.equal(clicheIssues('They were HEAD OVER HEELS', LOVE_ISLAND_CLICHES).length, 1);
});

test('clicheIssues: quoted Islander argot is exempt (it is a register)', () => {
  // A cliché INSIDE Islander dialogue is allowed; the same phrase as narration is not.
  assert.deepEqual(clicheIssues('She shrugs. “At the end of the day, it is what it is.”', LOVE_ISLAND_CLICHES), []);
  assert.ok(clicheIssues('At the end of the day, she shrugs.', LOVE_ISLAND_CLICHES).length >= 1);
});

test('bangExempt: the receiving-a-text ritual may shriek (LI taste)', () => {
  // The shout is waived — all caps, stacked bangs, on-brand.
  assert.deepEqual(tasteIssues('TEXT! I’VE GOT A TEXT!!', LOVE_ISLAND_TASTE), []);
  assert.deepEqual(tasteIssues('I’ve got a text!', LOVE_ISLAND_TASTE), []);
  // ...but ordinary copy is still held to the ≤1 '!' house rule.
  assert.equal(tasteIssues('So much drama!!', LOVE_ISLAND_TASTE).length, 1);
});

test('lengthIssue: caps outcome length only when a cap is set', () => {
  assert.equal(lengthIssue('short', 240), null);
  assert.equal(lengthIssue('x'.repeat(300), 240)?.startsWith('outcome too long'), true);
  assert.equal(lengthIssue('x'.repeat(300), 0), null);
});

test('tasteIssues: bundles bang + cliché always, length only for outcomes', () => {
  const t = LOVE_ISLAND_TASTE;
  assert.deepEqual(tasteIssues('A crisp, specific line.', t), []);
  // Long PROMPT text: not an outcome, so no length flag (bang/cliché still run).
  assert.deepEqual(tasteIssues('x'.repeat(300), t, { outcome: false }), []);
  // Same length as an OUTCOME: flagged.
  assert.equal(tasteIssues('x'.repeat(300), t, { outcome: true }).length, 1);
  // Bang + cliché compound.
  const bad = tasteIssues('Meant to be!! at the end of the day', t);
  assert.ok(bad.length >= 2);
});
