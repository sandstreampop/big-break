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

// Arc records: albums that exist because a storyline happened. Each gets
// its own review instead of a random one — the criticism remembers too.
const ARC_RECORDS = [
  { flag: 'home_studio', title: 'The Shed Sessions', review: 'recorded eleven steps from a bed; sounds like nowhere else on earth' },
  { flag: 'docu_gold', title: 'ALMOST (Original Soundtrack)', review: 'the backstage scene, in song form; festival audiences sat through the credits' },
  { flag: 'helped_bloom', title: 'The Amp Story (Live)', review: 'forty thousand people cheering for borrowed equipment' },
  { flag: 'band_named', title: 'Democracy (Vol. 1)', review: 'four writers, nine arguments, one undeniable record' },
  { flag: 'someone', title: 'Verse Two: Them', review: 'the braver version. hummed first by someone who “doesn’t do music”' },
  { flag: 'constellation', title: 'The Long Way Around', review: 'the stories found each other; the songs were waiting' },
];

export function buildDiscography(state) {
  const rng = mulberry32((state.chartSeed || 1) * 211 + 9);
  const titles = [...new Set(state.chartTitles || [])];
  const flags = state.flags || [];
  const arcCuts = ARC_RECORDS.filter((r) => flags.includes(r.flag));
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
  const regular = titles.slice(0, 6 - Math.min(3, arcCuts.length)).map((title) => {
    const i = Math.floor(rng() * reviewBag.length);
    const review = reviewBag.splice(i, 1)[0] || REVIEWS[0];
    return { title, review };
  });
  return [...arcCuts.slice(0, 3).map(({ title, review }) => ({ title, review })), ...regular];
}
