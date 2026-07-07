// The nation's feeds (ADR-0014) — the largest, newest Love Island subsystem
// (feeds.ts), previously with zero unit coverage. Its guarantees are testable
// and load-bearing, so pin them:
//   • the bundle always has all five channels;
//   • every channel always has ≥2 posts (the buildChannel floor);
//   • determinism — same state + moment → byte-identical bundle (feedRng is a
//     pure hash of state, it must never read the advancing run RNG);
//   • the honest-instrument invariant — a lost wing sours its channel even on a
//     triumph (the feed IS the meter, so it can't lie about a wing you tanked).
//
// Run: node --test test/li-feeds.test.mjs

import test from 'node:test';
import assert from 'node:assert/strict';
import { fresh, loveIslandPack } from './li-harness.mjs';
import { setFactions, recomputePublic } from '../dist/js/packs/love-island/plugins/factions.js';

const feeds = loveIslandPack.presenter.feeds;
assert.ok(feeds, 'LI presenter exposes a feeds hook');

// A result moment on a card that classifies to a reacting family (bombshell).
const resultMoment = (tier = 'good') => ({ kind: 'result', ev: { id: 'li_bomb1', tags: [] }, tier, side: 'right' });

function eachChannel(bundle, fn) { for (const c of bundle.channels) fn(c); }

test('a reacting moment yields all five channels', () => {
  const s = fresh();
  const b = feeds(s, resultMoment('good'));
  assert.ok(b, 'a bombshell result produces a bundle');
  assert.equal(b.channels.length, 5);
  assert.deepEqual(b.channels.map((c) => c.id).sort(), ['bird', 'clock', 'forum', 'grid', 'mums']);
  assert.ok(typeof b.teaser === 'string' && b.teaser.length > 0);
});

test('every channel carries at least two posts (the buildChannel floor)', () => {
  // Sweep several states/valences so a thin family/valence cell can't slip a
  // one-post channel through.
  for (const seed of [1, 7, 42, 100, 2024]) {
    for (const tier of ['bad', 'good', 'incredible']) {
      const s = fresh(seed);
      const b = feeds(s, resultMoment(tier));
      eachChannel(b, (c) => {
        assert.ok(c.posts.length >= 2, `channel ${c.id} @seed${seed}/${tier} has ${c.posts.length} posts (<2)`);
        for (const p of c.posts) assert.ok(p && typeof p.body === 'string' && p.body.length > 0, `${c.id} post has body text`);
      });
    }
  }
});

test('recap and ending moments also populate five channels', () => {
  const s = fresh(9);
  s.public = 55;
  const recap = feeds(s, { kind: 'recap', act: 2 });
  assert.equal(recap.channels.length, 5);
  recap.channels.forEach((c) => assert.ok(c.posts.length >= 2));

  const ending = feeds({ ...fresh(9), ending: { result: 'success' } }, { kind: 'ending', endingKey: 'won' });
  assert.equal(ending.channels.length, 5);
});

test('ambient (non-reacting) cards stay quiet — no bundle', () => {
  const s = fresh();
  // An id that maps to no family (familyOfCard returns null).
  assert.equal(feeds(s, { kind: 'result', ev: { id: 'li_quiet_morning', tags: [] }, tier: 'good', side: 'right' }), null);
});

test('the tutorial has no audience', () => {
  const s = fresh();
  s.tutorial = true;
  assert.equal(feeds(s, resultMoment('good')), null);
});

test('determinism: same state + moment → identical bundle', () => {
  const s = fresh(123);
  const a = feeds(s, resultMoment('good'));
  const b = feeds(s, resultMoment('good'));
  assert.deepEqual(a, b, 'feedRng must be a pure hash of state, not the advancing run RNG');
});

// Flatten every rendered string in a bundle (authors, bodies, metas, replies)
// into one blob so a test can assert what the nation calls the player.
function bundleText(b) {
  const out = [];
  for (const c of b.channels) {
    for (const list of [c.posts, c.more || []]) {
      for (const p of list) {
        out.push(p.author, p.body, p.meta || '');
        for (const r of p.replies || []) out.push(r.author, r.body);
      }
    }
  }
  return out.join('\n');
}

// The retriever persona's fallback nicknames — the ONLY row that can surface
// for `retriever_girl`, and each lives solely in the feeds NICKNAMES table.
const RETRIEVER_NICKS = ['the golden retriever', 'OP’s cinnamon roll', 'our sweetheart', 'the puppy'];

test('the nation chants the chosen name, not a coined nickname', () => {
  // Sweep seeds/tiers so we exercise many selected posts: with a name set, the
  // name appears and NONE of the fallback nicknames leak through {me}.
  for (const seed of [1, 7, 42, 100, 2024]) {
    for (const tier of ['bad', 'good', 'incredible']) {
      const s = fresh(seed);
      s.name = 'Priya';
      const text = bundleText(feeds(s, resultMoment(tier)));
      assert.ok(text.includes('Priya'), `@seed${seed}/${tier}: the chosen name should be chanted`);
      for (const nick of RETRIEVER_NICKS) {
        assert.ok(!text.includes(nick), `@seed${seed}/${tier}: nickname "${nick}" must not surface when a name is set`);
      }
    }
  }
});

test('a nameless run falls back to the coined nickname (sims / legacy saves)', () => {
  // Across a sweep, at least one selected post carries {me}, so the fallback
  // nickname must surface somewhere — the feed is never blank for a nameless run.
  const blob = [1, 7, 42, 100, 2024, 9, 5, 123]
    .flatMap((seed) => ['bad', 'good', 'incredible'].map((t) => bundleText(feeds(fresh(seed), resultMoment(t)))))
    .join('\n');
  assert.ok(RETRIEVER_NICKS.some((n) => blob.includes(n)), 'a nameless run must still coin a fallback nickname');
  assert.ok(!blob.includes('{me}'), 'no {me} token may reach the rendered feed');
});

test('a name with HTML is escaped before it lands in a feed body (innerHTML)', () => {
  // Feed bodies render via dom.el(innerHTML), so a free-text name must be
  // escaped — never injected as live markup.
  const s = fresh(7);
  s.name = 'Al<script>x</script> & "Bo"';
  const text = bundleText(feeds(s, resultMoment('good')));
  assert.ok(!/<script>/.test(text), 'raw <script> must not appear');
  assert.ok(text.includes('&lt;script&gt;'), 'angle brackets are escaped');
  assert.ok(text.includes('&amp;') && text.includes('&quot;'), 'ampersand and quote are escaped');
});

test('honest instrument: a lost wing shows down even on a good result', () => {
  // Drama wing tanked below coldAt (25) → the bird app (which wears the drama
  // wing) must read down, while a devoted wing reads up — on the SAME good
  // bombshell. The feed can't flatter a wing you lost.
  const s = fresh(5);
  setFactions(s, { romantics: 90, selfrespect: 90, drama: 5 });
  recomputePublic(s);
  const b = feeds(s, resultMoment('incredible')); // a triumph
  const bird = b.channels.find((c) => c.id === 'bird');   // wears drama
  const mums = b.channels.find((c) => c.id === 'mums');   // wears romantics
  assert.equal(bird.mood, 'down', 'the tanked drama wing sours its channel despite the win');
  assert.equal(mums.mood, 'up', 'the devoted romantics wing stays warm');
});
