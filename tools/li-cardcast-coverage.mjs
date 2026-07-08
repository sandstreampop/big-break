// Love Island — card-cast coverage report. Enumerates the whole deck and, for
// a fully-seated mid-season state, reports which events show ≥1 character
// portrait ON the card during the decision (presenter.cardCast → villaCardCast)
// and which read faceless. The faceless list is meant to be REVIEWED: a genuine
// ensemble/nation/solo card (a villa-wide game, a producer's Beach Hut question,
// the 4 a.m. spiral) SHOULD be faceless; anything else featuring specific people
// is a gap. Run after `npm run build`:  node tools/li-cardcast-coverage.mjs
//
// This is the human-facing companion to test/li-cardcast.test.mjs (which pins
// the invariants); it exists so "cohesive, full workthrough of all content"
// stays inspectable as the deck grows.

import { LOVE_ISLAND_EVENTS } from '../dist/js/packs/love-island/events.js';
import { villaCardCast } from '../dist/js/packs/love-island/cardcast.js';

// A fully-populated mid-season state so every role token can resolve.
const state = {
  tutorial: false, gender: 'girl', flavorSeed: 7,
  partner: 'kai', rival: 'chloe', bombshellId: 'luca', bestie: 'meg', exes: ['reece'],
  charOpinion: { rival: 40, bombshell: 46 }, charMood: {},
  bond: 55, flags: ['li_rival_active'], stats: {}, cardLog: [],
  secretKnown: [], secretSpent: [], charSecret: {},
};

const withCast = [];
const noCast = [];
for (const ev of LOVE_ISLAND_EVENTS) {
  const chips = villaCardCast(state, ev) || [];
  (chips.length ? withCast : noCast).push(ev);
}

const total = LOVE_ISLAND_EVENTS.length;
const pct = ((withCast.length / total) * 100).toFixed(0);
console.log(`Love Island card-cast coverage: ${withCast.length}/${total} events show ≥1 portrait (${pct}%)\n`);
console.log(`FACELESS (${noCast.length}) — review: each should be a genuine ensemble/nation/solo card:`);
for (const ev of noCast) {
  const ctx = (ev.context || ev.prompt || '').slice(0, 52).replace(/\s+/g, ' ');
  console.log(`  ${(ev.id || '?').padEnd(28)} [${(ev.tags || []).join(',')}]  ${ctx}`);
}
