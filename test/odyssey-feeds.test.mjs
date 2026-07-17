// The second screen for the odyssey (ADR-0014, pass 15) — executable
// invariants. Word travels at landmarks, temptations, act breaks, and the
// ending; ambient seas stay silent (the contrast is load-bearing). The feed
// is PURE (flavorSeed-keyed, never the play RNG) and HONEST (each channel's
// mood reads a real meter).

import test from 'node:test';
import assert from 'node:assert';
import { odysseyFeeds, ODYSSEY_FEED_CHROME, feedBodyCorpus, feedChromeCorpus } from '../dist/js/packs/odyssey/feeds.js';

const state = (over = {}) => ({
  flags: [], flavorSeed: 7, cardLog: [{ id: 'x' }],
  expedition: 9, athena: 3, poseidon: 2, renown: 5,
  stats: { burnout: 30 }, ending: null,
  ...over,
});
const landmark = { kind: 'result', ev: { id: 'ody_cyclops', tags: ['landmark', 'beat:cyclops'] }, tier: 'good', side: 'left' };

test('ambient seas are silent; landmarks, temptations, recaps, endings speak', () => {
  assert.strictEqual(odysseyFeeds(state(), { kind: 'result', ev: { id: 'ody_a1_squall', tags: ['sea', 'might'] }, tier: 'good', side: 'left' }), null, 'an ambient sea must not trend');
  assert.strictEqual(odysseyFeeds(state(), { kind: 'result', ev: { id: 'ody_tut_troy', tags: [] }, tier: 'good', side: 'left' }), null, 'the tutorial must not trend');
  assert.ok(odysseyFeeds(state(), landmark), 'a landmark speaks');
  assert.ok(odysseyFeeds(state(), { kind: 'result', ev: { id: 'ody_tempt_lotus', tags: ['temptation', 'beat:lotus'] }, tier: 'bad', side: 'left' }), 'a temptation speaks');
  assert.strictEqual(odysseyFeeds(state(), { kind: 'recap', act: 1 }), null, 'act 1 has no recap feed — the word needs a deed first');
  assert.ok(odysseyFeeds(state(), { kind: 'recap', act: 2 }), 'the act-2 break speaks');
  assert.ok(odysseyFeeds(state({ ending: { key: 'nostos', result: 'success' } }), { kind: 'ending', endingKey: 'nostos' }), 'the ending speaks');
});

test('the bundle is complete and clean — three rooms, every string real', () => {
  const b = odysseyFeeds(state(), landmark);
  assert.strictEqual(b.channels.length, 3);
  assert.deepStrictEqual(b.channels.map((c) => c.id), ['harbor', 'olympus', 'fire']);
  assert.ok(b.teaser && !b.teaser.includes('undefined'));
  assert.ok(b.headline && !b.headline.includes('undefined'));
  for (const ch of b.channels) {
    assert.ok(ch.posts.length >= 2, `${ch.id}: a speaking beat carries posts`);
    for (const p of [...ch.posts, ...(ch.more || [])]) {
      assert.ok(p.author && p.body, `${ch.id}: every post has a mouth and words`);
      assert.ok(!`${p.author}${p.body}${p.meta || ''}`.includes('undefined'), `${ch.id}: no undefined leaks`);
    }
  }
});

test('purity: same state + same moment → the same feed, every render', () => {
  const a = JSON.stringify(odysseyFeeds(state(), landmark));
  const b = JSON.stringify(odysseyFeeds(state(), landmark));
  assert.strictEqual(a, b);
  // And a different flavorSeed genuinely varies the deal.
  const c = JSON.stringify(odysseyFeeds(state({ flavorSeed: 99 }), landmark));
  assert.notStrictEqual(a, c);
});

test('the moods are honest instruments', () => {
  const moods = (s) => Object.fromEntries(odysseyFeeds(s, landmark).channels.map((c) => [c.id, c.mood]));
  assert.strictEqual(moods(state({ poseidon: 9 })).olympus, 'feral', 'a wrathful sea makes Olympus feral');
  assert.strictEqual(moods(state({ athena: 8, poseidon: 1 })).olympus, 'soft', 'the goddess ahead of the sea softens the mountain');
  assert.strictEqual(moods(state({ athena: 0, poseidon: 5 })).olympus, 'down', 'the sea ahead of the goddess turns it');
  assert.strictEqual(moods(state({ renown: 9, poseidon: 0 })).harbor, 'up', 'renown warms the quays');
  assert.strictEqual(moods(state({ renown: 1, poseidon: 0 })).harbor, 'down', 'an unknown fleet is unasked-about');
  assert.strictEqual(moods(state({ stats: { burnout: 90 } })).fire, 'feral', 'a fraying telling makes a feral fire');
  assert.strictEqual(moods(state({ stats: { burnout: 10 } })).fire, 'up', 'a fresh telling keeps the room warm');
});

test('shout your name at the cave and Poseidon pins the receipt', () => {
  const named = odysseyFeeds(state({ flags: ['ody_named'] }), landmark);
  const oly = named.channels.find((c) => c.id === 'olympus');
  assert.ok(oly.posts[0].pinned && /MY SON/.test(oly.posts[0].body), 'the wrath ledger opens in the god’s own voice');
  const quiet = odysseyFeeds(state(), landmark);
  const oly2 = quiet.channels.find((c) => c.id === 'olympus');
  assert.ok(!oly2.posts.some((p) => /SIGNED it/.test(p.body)), 'Nobody stays nobody');
});

test('banking a temptation never reads as leaving — the stayed flag flips the valence', () => {
  // The stay/succumb door is FORCED to tier 'good' (the offer is warm by
  // design), so tier alone would surface "he LEFT" posts over a banked run.
  const bankedCalypso = odysseyFeeds(
    state({ flags: ['ody_stayed_calypso'] }),
    { kind: 'result', ev: { id: 'ody_tempt_calypso', tags: ['temptation', 'beat:calypso'] }, tier: 'good', side: 'right' },
  );
  const bankedLotus = odysseyFeeds(
    state({ flags: ['ody_stayed_lotus'] }),
    { kind: 'result', ev: { id: 'ody_tempt_lotus', tags: ['temptation', 'beat:lotus'] }, tier: 'good', side: 'right' },
  );
  for (const b of [bankedCalypso, bankedLotus]) {
    const all = b.channels.flatMap((c) => [...c.posts, ...(c.more || [])]).map((p) => p.body).join(' ');
    assert.ok(!/and LEFT|He left\. Good|turned down deathless|a RAFT crosses/.test(all),
      'no post may celebrate a departure that did not happen');
  }
  // And a REFUSED temptation (no stayed flag, good tier) still reads as leaving.
  const rowed = odysseyFeeds(state(), { kind: 'result', ev: { id: 'ody_tempt_calypso', tags: ['temptation', 'beat:calypso'] }, tier: 'good', side: 'left' });
  const rowedAll = rowed.channels.flatMap((c) => [...c.posts, ...(c.more || [])]).map((p) => p.body).join(' ');
  assert.ok(!/I would have stayed|Granted, obviously/.test(rowedAll), 'a refusal must not read the stayed pools');
});

test('the lint corpus is real: ≥90 unique bodies, chrome present, lengths sane', () => {
  const bodies = feedBodyCorpus();
  assert.ok(bodies.length >= 90, `corpus gutted: ${bodies.length}`);
  assert.strictEqual(bodies.length, new Set(bodies).size, 'no copy-pasted posts');
  for (const b of bodies) assert.ok(b.length <= 300, `body over 300: ${b.slice(0, 40)}…`);
  assert.ok(feedChromeCorpus().length >= 10);
});

test('the chrome re-voicing is whole — no phone leaks into the fire’s world', () => {
  for (const k of ['kicker', 'caughtUp', 'openLabel', 'foot', 'headline']) {
    assert.ok(ODYSSEY_FEED_CHROME[k], `feedChrome.${k} missing`);
    assert.ok(!ODYSSEY_FEED_CHROME[k].includes('📲'), 'no phone glyph in this world');
  }
  for (const m of ['up', 'split', 'down', 'feral', 'soft']) {
    assert.ok(ODYSSEY_FEED_CHROME.moodLines[m], `moodLine ${m} missing`);
  }
});
