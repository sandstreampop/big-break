// Home venues: a place you adopt in Act 1 and build across the run.
// Playing venue-tagged shows raises its level (0→3); higher levels grant a
// per-show fame/cred bump and unlock a hometown-hero finale beat.

export const VENUES = [
  {
    id: 'ricochet', name: 'The Ricochet Room', icon: '🎳',
    flavor: 'Smells of nachos and surrender. The sound guy has seen things.',
    tags: ['live', 'roots'],
  },
  {
    id: 'basement', name: 'The Sweatbox (a basement)', icon: '🏚️',
    flavor: 'Ceiling exactly your height. Nineteen-person capacity, spiritually infinite.',
    tags: ['live', 'indie'],
  },
  {
    id: 'compost', name: 'The Compost Corner', icon: '🥬',
    flavor: 'A farmers-market corner you fought a bagpiper for. Slight smell. Total loyalty.',
    tags: ['busk', 'live'],
  },
  {
    id: 'wkrz', name: 'WKRZ 89.1', icon: '📻',
    flavor: 'The sound of the basement. Nine listeners who would die for you.',
    tags: ['record', 'indie'],
  },
  {
    id: 'allnight', name: 'The All-Nite Diner', icon: '🍳',
    flavor: 'Corner booth, permanent reservation. The 3 a.m. crowd is the most honest audience alive.',
    tags: ['live', 'home'],
  },
  {
    id: 'laundro', name: 'Spin Cycle Laundromat', icon: '🌀',
    flavor: 'Acoustic sets between rinse and spin. The dryers keep better time than most drummers.',
    tags: ['busk', 'indie'],
  },
  {
    id: 'planetarium', name: 'The Decommissioned Planetarium', icon: '🪐',
    flavor: 'The projector still works. Every show ends under a sky nobody funded. Reverb measured in light-years.',
    tags: ['record', 'electronic', 'tone'],
  },
];

// Level tiers: index = level (0..3)
export const VENUE_TIERS = [
  { name: 'a room you play', showBonus: 0 },
  { name: 'your regular spot', showBonus: 2 },
  { name: 'basically yours', showBonus: 4 },
  { name: 'a local institution', showBonus: 6 },
];

export function venueById(id) {
  return VENUES.find((v) => v.id === id) || null;
}

export function offerVenues(rng = Math.random) {
  const bag = [...VENUES];
  const picks = [];
  while (picks.length < 2 && bag.length) {
    picks.push(bag.splice(Math.floor(rng() * bag.length), 1)[0]);
  }
  return picks;
}
