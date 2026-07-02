// The Discography: collects every song a run produced (chart titles, arc
// songs, plus generated names for uncounted hits) and reviews each one in
// a single seeded line of criticism.

import { mulberry32 } from './engine.js';

const ADJ = ['Conditional', 'Parking Lot', 'Emotional', 'Lowercase', 'Infinite', 'Discount',
  'Golden Hour', 'Feral', 'Corporate', 'Midnight', 'Artisanal', 'Unskippable',
  'Borrowed', 'Glitter', 'Basement', 'Terminal', 'Soft Launch', 'Rent-Controlled'];
const NOUN = ['Halo', 'Arithmetic', 'Layover', 'Apology', 'Mercury', 'Cowboy',
  'Situationship', 'Voicemail', 'Summer', 'Blackout', 'Merch Table',
  'Heartbeat', 'Landlord', 'Renaissance', 'Group Chat', 'Encore', 'Sequel'];

const REVIEWS = [
  'four chords and, against all odds, the truth',
  'a door, opened',
  'derivative of themselves, somehow, in a good way',
  'the bridge alone justifies the streaming era',
  'plays at every wedding now; the couples don’t know why they cry',
  'sounds like rent being due and paying it anyway',
  'the rare banger with footnotes',
  'critics called it “a grower.” It grew.',
  'skips nothing; earns everything',
  'the chorus arrives like a friend with a truck',
  'built from one voice memo and pure spite',
  'the kazoo solo should not work. next question.',
  'sounds expensive; cost a Tuesday',
  'the algorithm feared it, then fed it to everyone',
  'their “sellout single,” per people who stream it daily',
  'a slow burn with the structural integrity of a barn',
  'you can hear the exact moment the burnout lifted',
  'the deep cut the heads were right about',
];

export function buildDiscography(state) {
  const rng = mulberry32((state.chartSeed || 1) * 211 + 9);
  const titles = [...new Set(state.chartTitles || [])];
  // uncounted hits get names too
  let extra = Math.max(0, (state.hits || 0) - titles.length);
  while (extra-- > 0) {
    titles.push(ADJ[Math.floor(rng() * ADJ.length)] + ' ' + NOUN[Math.floor(rng() * NOUN.length)]);
  }
  // even a hitless run cut SOMETHING
  if (!titles.length && (state.fame > 10 || (state.cardLog || []).length > 5)) {
    titles.push(ADJ[Math.floor(rng() * ADJ.length)] + ' ' + NOUN[Math.floor(rng() * NOUN.length)] + ' (Demo)');
  }
  const reviewBag = [...REVIEWS];
  return titles.slice(0, 6).map((title) => {
    const i = Math.floor(rng() * reviewBag.length);
    const review = reviewBag.splice(i, 1)[0] || REVIEWS[0];
    return { title, review };
  });
}
