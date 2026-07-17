// The Night's Vase (pass 23) — executable invariants. The vase is a PURE
// read of the ended run: same state → same band; the figures depict only
// what tonight actually faced; the ending's motif closes it honestly.

import test from 'node:test';
import assert from 'node:assert';
import { nightVase, vaseGlyphs } from '../dist/js/packs/odyssey/vase.js';

const ended = (over = {}) => ({
  flags: [], expedition: 9, athena: 3, poseidon: 2,
  ending: { key: 'nostos', result: 'success' }, path: 'nostos',
  ...over,
});

test('the vase does not flatter: the fleet paints at its final count', () => {
  const v = nightVase(ended({ expedition: 4 }));
  assert.ok(v.motifs.includes('the ship, 4 rowing'));
  assert.ok(v.html.includes('ody-vase'));
});

test('only the stations actually faced appear', () => {
  const bare = nightVase(ended());
  assert.ok(!bare.motifs.includes('the cave island'));
  assert.ok(!bare.motifs.includes('the trench'));
  const full = nightVase(ended({ flags: ['ody_done_cyclops', 'ody_done_underworld', 'ody_done_circe'] }));
  assert.ok(full.motifs.includes('the cave island'));
  assert.ok(full.motifs.includes('the trench'));
  assert.ok(full.motifs.includes('the island passed'));
  const banked = nightVase(ended({ flags: ['ody_done_calypso', 'ody_stayed_calypso'], ending: { key: 'calypso', result: null } }));
  assert.ok(banked.motifs.includes('the warm island, near'), 'a banked telling paints the island close');
});

test('the ending motif closes the band honestly', () => {
  assert.ok(nightVase(ended()).motifs.includes('the star'), 'the homecoming gets the star');
  assert.ok(nightVase(ended()).motifs.includes('the gulls of the home shore'));
  assert.ok(nightVase(ended({ ending: { key: 'kleos', result: 'success' }, path: 'kleos' })).motifs.includes('the raised cup'));
  assert.ok(nightVase(ended({ ending: { key: 'lotus', result: null } })).motifs.includes('the cup, set down'));
  assert.ok(nightVase(ended({ ending: { key: 'burnout', result: null } })).motifs.includes('the last ember'));
  const wrath = nightVase(ended({ ending: { key: 'wrath', result: null }, poseidon: 10 }));
  assert.ok(wrath.motifs.includes('the trident'), 'the wrath band carries the trident');
  assert.ok(wrath.motifs.includes('the sea, wrath'), 'and the sea it earned');
});

test('the powers attend only when they truly did', () => {
  assert.ok(nightVase(ended({ athena: 6 })).motifs.includes('the owl'));
  assert.ok(!nightVase(ended({ athena: 5 })).motifs.includes('the owl'));
  assert.ok(nightVase(ended({ poseidon: 7 })).motifs.includes('the trident'));
  assert.ok(!nightVase(ended({ poseidon: 6 })).motifs.includes('the trident'));
});

test('the red-figure glaze is a class swap, never a different band (pass 44)', () => {
  const black = nightVase(ended());
  const red = nightVase(ended(), false, true);
  assert.ok(!black.html.includes('ody-vase-red'));
  assert.ok(red.html.includes('ody-vase ody-vase-red'));
  assert.deepStrictEqual(red.motifs, black.motifs, 'the glaze changes nothing but the firing');
});

test('pure: same telling, same vase; reduced motion stills every figure', () => {
  assert.strictEqual(nightVase(ended()).html, nightVase(ended()).html);
  assert.ok(nightVase(ended(), true).html.includes('px-still'), 'reduced motion carries into the band');
  assert.ok(!nightVase(ended(), false).html.includes('px-still'), 'a moving band carries no stills');
});

// The vase travels (pass 32): the glyph band the share text carries is
// chosen by the SAME reader as the painted vase — one glyph per figure, in
// paint order, the sea's mood trailing. If these drift, a player's paste
// lies about their ending screen.
test('the glyph band agrees with the painted vase, figure for figure', () => {
  const cases = [
    ended(),
    ended({ flags: ['ody_done_cyclops', 'ody_done_underworld', 'ody_done_circe'], athena: 6 }),
    ended({ flags: ['ody_stayed_calypso'], ending: { key: 'calypso', result: null } }),
    ended({ ending: { key: 'wrath', result: null }, poseidon: 10 }),
    ended({ ending: { key: 'burnout', result: null } }),
    ended({ ending: { key: 'kleos', result: 'success' }, path: 'kleos' }),
  ];
  for (const s of cases) {
    const figures = nightVase(s).motifs.length - 1; // minus the sea line
    const band = vaseGlyphs(s).split(' ')[0]; // minus the sea suffix
    assert.strictEqual([...band].length, figures,
      `band "${vaseGlyphs(s)}" ≠ ${figures} figures for ${JSON.stringify(s.ending)} ${s.flags}`);
  }
});

test('the glyph band closes honestly, ending by ending', () => {
  assert.strictEqual(vaseGlyphs(ended()), '⛵⭐🕊', 'the homecoming: ship, star, gulls');
  assert.strictEqual(vaseGlyphs(ended({ ending: { key: 'kleos', result: 'success' }, path: 'kleos' })), '⛵🍷');
  assert.strictEqual(vaseGlyphs(ended({ ending: { key: 'lotus', result: null } })), '⛵🫗', 'a banked telling sets the cup down');
  assert.strictEqual(vaseGlyphs(ended({ ending: { key: 'burnout', result: null } })), '⛵🌫');
  assert.strictEqual(vaseGlyphs(ended({ ending: { key: 'wrath', result: null }, poseidon: 10 })), '⛵🔱 🌊🌊',
    'the wrath carries the trident and the sea it earned');
  assert.strictEqual(vaseGlyphs(ended({ poseidon: 5 })), '⛵⭐🕊 🌊', 'a middling sea shows one wave');
});

test('the aria label reads the whole band', () => {
  const v = nightVase(ended({ flags: ['ody_done_cyclops'] }));
  assert.ok(v.html.includes('aria-label="tonight’s vase:'));
  const label = v.html.match(/aria-label="([^"]+)"/)[1];
  for (const m of v.motifs) assert.ok(label.includes(m), `label missing motif: ${m}`);
});
