// Genres: an optional sound identity picked at run start. Each tilts
// tag-matched rolls (like instrument quirks) — your genre loves some rooms
// and dies in others. Three are offered per run, seeded.

export const GENRES = [
  {
    id: 'synthwave', name: 'Synthwave Revival', icon: '🌆',
    blurb: 'Studio/Tone +6 · Roots/Blues −5',
    flavor: 'Neon nostalgia for a decade you didn’t attend.',
    bonuses: [{ tags: ['studio', 'tone', 'electronic'], bonus: 6 }, { tags: ['roots', 'blues'], bonus: -5 }],
  },
  {
    id: 'folk_punk', name: 'Folk Punk', icon: '🪕',
    blurb: 'Live/Busk +6 · Mainstream −5',
    flavor: 'Three chords, one train, infinite conviction.',
    bonuses: [{ tags: ['live', 'busk'], bonus: 6 }, { tags: ['mainstream'], bonus: -5 }],
  },
  {
    id: 'hyperpop', name: 'Hyperpop', icon: '🫧',
    blurb: 'Social/Mainstream +6 · Roots −5',
    flavor: 'A sugar rush with a distortion pedal. The teens understand.',
    bonuses: [{ tags: ['social', 'mainstream'], bonus: 6 }, { tags: ['roots'], bonus: -5 }],
  },
  {
    id: 'doom_jazz', name: 'Doom Jazz', icon: '🌑',
    blurb: 'Studio/Indie +6 · Social −5',
    flavor: 'Like regular jazz, but the room is always about to collapse.',
    bonuses: [{ tags: ['studio', 'indie'], bonus: 6 }, { tags: ['social'], bonus: -5 }],
  },
  {
    id: 'bedroom_pop', name: 'Bedroom Pop', icon: '🛏️',
    blurb: 'Home/Record +6 · Tour −5',
    flavor: 'Recorded within six feet of a duvet, by law.',
    bonuses: [{ tags: ['home', 'record', 'solo'], bonus: 6 }, { tags: ['tour'], bonus: -5 }],
  },
  {
    id: 'yacht_metal', name: 'Yacht Metal', icon: '⛵',
    blurb: 'Mainstream/Deal +6 · Indie −5',
    flavor: 'Smooth. Heavy. Financially confusing. Critics hate it; boats love it.',
    bonuses: [{ tags: ['mainstream', 'deal'], bonus: 6 }, { tags: ['indie'], bonus: -5 }],
  },
];

export function genreById(id) {
  return GENRES.find((g) => g.id === id) || null;
}

export function offerGenres(rng = Math.random) {
  const bag = [...GENRES];
  const picks = [];
  while (picks.length < 3 && bag.length) {
    picks.push(bag.splice(Math.floor(rng() * bag.length), 1)[0]);
  }
  return picks;
}
