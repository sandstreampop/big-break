// ADR-0002 (docs/games/odyssey/adr/0002-progress-registers.md), the
// executable half. Per INCIDENTS #7 ("the design law lived in a doc, so the
// shell broke it twenty ways"), a design law that only lives as prose in an
// ADR/NORTH-STAR/STYLE doc gets broken the next time someone touches nearby
// code — so ADR-0002's narrow license (cross-run persistent progress may
// register as a distinct, LOUD, non-prose beat in the Odyssey's own idiom)
// is pinned here as a gate, not a comment.
//
// This test MUST fail if the shell or the pack ever:
//   - routes the fragment-banked progress beat through the siblings' win
//     grammar (`resultExtras.celebrate` / `resultExtras.cash`, which the
//     shell reads to fire `spawnConfetti`/`sfx.win()` — see js/ui/card.ts);
//   - drops the distinct, idiom-classed progress notice (the `ody-fret`
//     channel) in favour of a bare prose sentence on the default channel;
//   - stops rationing the beat (an ordinary result must NOT carry a
//     progress marker — the beat is scarce, not wallpaper);
//   - or re-enables the shell's generic result juice for the pack
//     (`feel.resultJuice` must stay `false` — belt-and-braces with the
//     motion-law probe in test/ui/smoke.mjs).
//
// Runs against dist/ (build first) — same import style as
// test/odyssey-memory.test.mjs.

import test from 'node:test';
import assert from 'node:assert';

const { odysseyPresenter } = await import('../dist/js/packs/odyssey/presenter.js');

test('ANTI-GOAL — a fragment-banked progress beat never routes through the confetti/win-sound channel', () => {
  const state = {
    loadout: 'kings_hall', flavorSeed: 1, expedition: 12, stats: {},
    flags: ['ody_fore_sea'],
  };
  const extras = odysseyPresenter.resultExtras(
    { event: { id: 'ody_tiresias' }, deltas: [] }, state);
  assert.ok(extras, 'a fragment-banked result must produce resultExtras at all');
  assert.strictEqual(extras.celebrate, undefined,
    'the progress beat must NOT set resultExtras.celebrate — that is the siblings’ spawnConfetti/sfx.win() channel (INCIDENTS #7’s flagship anti-goal, "no confetti with a Greek accent")');
  assert.strictEqual(extras.cash, undefined,
    'the progress beat must NOT set resultExtras.cash — that is the siblings’ win-sound channel');
});

test('DISTINCT — the fragment-banked beat carries a non-prose, idiom-classed progress marker', () => {
  const state = {
    loadout: 'kings_hall', flavorSeed: 1, expedition: 12, stats: {},
    flags: ['ody_fore_sea'],
  };
  const extras = odysseyPresenter.resultExtras(
    { event: { id: 'ody_tiresias' }, deltas: [] }, state);
  assert.ok(extras?.notices?.length, 'a fragment-banked result must carry at least one notice');
  assert.ok(
    extras.notices.some((n) => typeof n.cls === 'string' && n.cls.includes('ody-fret')),
    `expected a notice classed into the Odyssey progress-beat idiom (cls containing "ody-fret"); got: ${JSON.stringify(extras.notices)}`,
  );
});

test('RATIONED — an ordinary result with no turning carries no progress marker at all', () => {
  const state = {
    loadout: 'kings_hall', flavorSeed: 1, expedition: 12, stats: {},
    flags: [],
  };
  const extras = odysseyPresenter.resultExtras(
    { event: { id: 'ody_a1_squall' }, deltas: [{ key: 'renown', amount: 1 }] }, state);
  assert.strictEqual(extras, null,
    'an ordinary result must not produce a progress beat — the beat is scarce (rationed), never wallpaper');
});

test('SHELL JUICE RETIRED — the pack opts out of the shell’s generic result juice wholesale', () => {
  assert.strictEqual(odysseyPresenter.feel.resultJuice, false,
    'odysseyPresenter.feel.resultJuice must stay false — the pack retires the shell’s generic confetti/shake/flash wholesale (belt-and-braces with the motion-law probe in test/ui/smoke.mjs)');
});
