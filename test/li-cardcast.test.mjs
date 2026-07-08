// Love Island — the card-cast strip (presenter.cardCast → villaCardCast): the
// people THIS scene is about, shown as portrait chips ON the dealt card, during
// the decision (not just on the after-swipe result beat). This pins the
// invariants the DOM-free goldens/sims can't see:
//   · WHO a card bills is read from its OWN content — role tokens + the web:
//     thread tag — plus a hand-authored set of token-less set-pieces;
//   · it's a pure read (deals re-render on resume; the sims never render);
//   · the strip is capped and every chip is well-formed;
//   · COVERAGE stays high — most people-scenes show a face — while the genuine
//     ensemble/nation/solo cards stay faceless on purpose.
//
// Run: npm run build && node --test test/li-cardcast.test.mjs

import test from 'node:test';
import assert from 'node:assert/strict';
import { LOVE_ISLAND_EVENTS } from '../dist/js/packs/love-island/events.js';
import { villaCardCast } from '../dist/js/packs/love-island/cardcast.js';

// A fully-seated mid-season state: every role token can resolve to a face.
function seated(over = {}) {
  return {
    tutorial: false, gender: 'girl', flavorSeed: 7,
    partner: 'kai', rival: 'chloe', bombshellId: 'luca', bestie: 'meg', exes: ['reece'],
    charOpinion: { rival: 40, bombshell: 46 }, charMood: {},
    bond: 55, flags: ['li_rival_active'], stats: {}, cardLog: [],
    secretKnown: [], secretSpent: [], charSecret: {}, ...over,
  };
}
const byId = (id) => LOVE_ISLAND_EVENTS.find((e) => e.id === id);
const ev = (over) => ({ id: 'synthetic', act: 1, choices: { left: { label: 'a', outcomes: {} }, right: { label: 'b', outcomes: {} } }, ...over });

test('tutorial cards show no card-cast (the shell renders the tutorial clean)', () => {
  assert.equal(villaCardCast(seated({ tutorial: true }), ev({ prompt: 'hi {partner}' })), null);
});

test('a pure read — same state + event, same result (deals re-render on resume)', () => {
  const s = seated();
  const e = byId('li_web_tri_0') || ev({ tags: ['web:triangle'], prompt: 'x' });
  assert.deepEqual(villaCardCast(s, e), villaCardCast(s, e));
});

test('token in the visible copy bills that person', () => {
  const s = seated();
  assert.deepEqual(villaCardCast(s, ev({ prompt: 'a chat with {partner}' }))?.map((c) => c.name), ['Kai']);
  assert.deepEqual(villaCardCast(s, ev({ prompt: '{rival} is circling' }))?.map((c) => c.name), ['Chloe']);
  assert.deepEqual(villaCardCast(s, ev({ prompt: 'your {ex} walks in' }))?.map((c) => c.name), ['Reece']);
  assert.deepEqual(villaCardCast(s, ev({ prompt: '{mate} whispers' }))?.map((c) => c.name), ['Meg']);
});

test('a token only in an OUTCOME (not visible before the swipe) does NOT bill', () => {
  const s = seated();
  const e = ev({ prompt: 'a quiet morning', choices: {
    left: { label: 'go', outcomes: { good: { text: '{partner} smiles', effects: {} } } },
    right: { label: 'stay', outcomes: {} },
  } });
  assert.equal(villaCardCast(s, e), null);
});

test('a web:<thread> card bills that thread’s fixed NPC couple first', () => {
  const names = villaCardCast(seated(), ev({ tags: ['web:triangle'], prompt: 'drama' }))?.map((c) => c.name);
  assert.deepEqual(names, ['Marco', 'Sophia', 'Amber']);
});

test('structural set-pieces are cast without a token', () => {
  const s = seated();
  // A recoupling frames the couple with the active Rival circling.
  assert.deepEqual(
    villaCardCast(s, ev({ tags: ['recoupling'], prompt: 'the firepit' }))?.map((c) => c.name),
    ['Kai', 'Chloe']);
  // Movie Night / the Parents / the couple quiz put the Partner on screen.
  for (const id of ['li_movienight_reveal', 'li_parents', 'li_challenge_couples']) {
    assert.deepEqual(villaCardCast(s, ev({ id, prompt: 'no token here' }))?.map((c) => c.name), ['Kai'],
      `${id} should bill the Partner`);
  }
});

test('the strip is capped and every chip is well-formed', () => {
  for (const e of LOVE_ISLAND_EVENTS) {
    const chips = villaCardCast(seated(), e);
    if (!chips) continue;
    assert.ok(chips.length <= 3, `${e.id}: ${chips.length} chips exceeds the cap`);
    const ids = new Set();
    for (const c of chips) {
      assert.ok(c.name && typeof c.name === 'string', `${e.id}: chip missing name`);
      assert.ok(c.face && typeof c.face === 'string', `${e.id}: chip missing emoji face fallback`);
      // Every villa cast member is a wired portrait, so a real image must resolve.
      assert.ok(c.portraitSrc, `${e.id}: chip ${c.name} missing portraitSrc`);
      assert.ok(!ids.has(c.name), `${e.id}: duplicate chip for ${c.name}`);
      ids.add(c.name);
    }
  }
});

test('coverage: most people-scenes show a face; ensemble/nation/solo stay faceless', () => {
  const s = seated();
  let withCast = 0;
  for (const e of LOVE_ISLAND_EVENTS) if ((villaCardCast(s, e) || []).length) withCast++;
  // Regression floor: the deck is ~330 events and ~260 feature specific people.
  assert.ok(withCast >= 255, `only ${withCast} events show a face — coverage regressed`);

  // These genuinely feature no one in particular and MUST stay faceless — if a
  // future edit tokens a person into one, this reminds us to reconsider it.
  for (const id of ['li_nation_poll', 'li_wobble_75', 'li_challenge_dance', 'li_prank_war', 'li_dry_spell']) {
    const e = byId(id);
    if (e) assert.equal(villaCardCast(s, e), null, `${id} should read faceless (ensemble/solo)`);
  }
});
