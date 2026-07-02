// Genres: an optional sound identity picked at run start. Each tilts
// tag-matched rolls (like instrument quirks) — your genre loves some rooms
// and dies in others. Three are offered per run, seeded.

export const GENRES = [
  {
    id: 'synthwave', name: 'Synthwave Revival', icon: '🌆',
    blurb: 'Studio/Tone +6 · Roots/Blues −5',
    flavor: 'Neon nostalgia for a decade you didn’t attend.',
    bonuses: [{ tags: ['studio', 'tone', 'electronic'], bonus: 6 }, { tags: ['roots', 'blues'], bonus: -5 }],
    titleWords: { adj: ['Neon', 'Chrome', 'Midnight Drive', 'VHS', 'Analog', 'Sunset Grid'], noun: ['Skyline', 'Mainframe', 'Rendezvous', 'Horizon', 'Static', 'Motorway'] },
    sound: { scale: 'naturalMinor', root: 45, bpmRange: [96, 114], drum: 'four', lead: 'acid', bed: 'analog', parody: 0.5, tropes: ['gatedVerb'] },
  },
  {
    id: 'folk_punk', name: 'Folk Punk', icon: '🪕',
    blurb: 'Live/Busk +6 · Mainstream −5',
    flavor: 'Three chords, one train, infinite conviction.',
    bonuses: [{ tags: ['live', 'busk'], bonus: 6 }, { tags: ['mainstream'], bonus: -5 }],
    titleWords: { adj: ['Trainyard', 'Crooked', 'Porchlight', 'Dumpster', 'Wildflower', 'Borrowed Boot'], noun: ['Gospel', 'Riot', 'Harmonica', 'Overpass', 'Union', 'Bonfire'] },
    sound: { scale: 'major', root: 48, bpmRange: [140, 168], drum: 'stomp', lead: 'pluck', bed: 'strum', parody: 0.6, tropes: ['gangChorus'] },
  },
  {
    id: 'hyperpop', name: 'Hyperpop', icon: '🫧',
    blurb: 'Social/Mainstream +6 · Roots −5',
    flavor: 'A sugar rush with a distortion pedal. The teens understand.',
    bonuses: [{ tags: ['social', 'mainstream'], bonus: 6 }, { tags: ['roots'], bonus: -5 }],
    titleWords: { adj: ['Glitchcore', 'Sugarcrash', 'Bubblegum', 'Turbo', 'Cursed', 'Pixel'], noun: ['Angel', 'Meltdown', 'Heartbreak2', 'Sim', 'Cheat Code', 'Notification'] },
    sound: { scale: 'major', root: 60, bpmRange: [150, 176], drum: 'trap', lead: 'chopped', bed: 'saccharine', parody: 0.7, tropes: ['pitchLift'] },
  },
  {
    id: 'doom_jazz', name: 'Doom Jazz', icon: '🌑',
    blurb: 'Studio/Indie +6 · Social −5',
    flavor: 'Like regular jazz, but the room is always about to collapse.',
    bonuses: [{ tags: ['studio', 'indie'], bonus: 6 }, { tags: ['social'], bonus: -5 }],
    titleWords: { adj: ['Smoke-Filled', 'Last Call', 'Basement', 'Slow Collapse', 'Velvet', 'Condemned'], noun: ['Saxophone', 'Eulogy', 'Nocturne', 'Undertow', 'Speakeasy', 'Fault Line'] },
    sound: { scale: 'dorian', root: 45, bpmRange: [56, 72], drum: 'brush', lead: 'reed', bed: 'detuned', parody: 0.8, tropes: ['dirgeEnd'] },
  },
  {
    id: 'bedroom_pop', name: 'Bedroom Pop', icon: '🛏️',
    blurb: 'Home/Record +6 · Tour −5',
    flavor: 'Recorded within six feet of a duvet, by law.',
    bonuses: [{ tags: ['home', 'record', 'solo'], bonus: 6 }, { tags: ['tour'], bonus: -5 }],
    titleWords: { adj: ['Duvet', 'Lo-Fi', 'Half-Asleep', 'Window Light', 'Quiet', 'Sunday'], noun: ['Daydream', 'Pillowtalk', 'Houseplant', 'Polaroid', 'Lullaby', 'Ceiling'] },
    sound: { scale: 'major', root: 55, bpmRange: [78, 96], drum: 'soft', lead: 'bell', bed: 'duvet', parody: 0.3, tropes: [] },
  },
  {
    id: 'yacht_metal', name: 'Yacht Metal', icon: '⛵',
    blurb: 'Mainstream/Deal +6 · Indie −5',
    flavor: 'Smooth. Heavy. Financially confusing. Critics hate it; boats love it.',
    bonuses: [{ tags: ['mainstream', 'deal'], bonus: 6 }, { tags: ['indie'], bonus: -5 }],
    titleWords: { adj: ['Offshore', 'Chrome Anchor', 'Tax-Free', 'Marina', 'Golden Hour', 'Leveraged'], noun: ['Riptide', 'Regatta', 'Portfolio', 'Kraken', 'Sundeck', 'Maelstrom'] },
    sound: { scale: 'minorPentatonic', root: 40, bpmRange: [120, 150], drum: 'chug', lead: 'reed', bed: 'chug', parody: 0.9, tropes: ['keyChangeFinale'] },
  },
];

export const GENRES_WAVE2 = [
  {
    id: 'chipfolk', name: 'Chipfolk', icon: '👾',
    blurb: 'Electronic/Home +6 · Live −4 (the cartridge overheats)',
    flavor: 'Campfire songs for consoles that no longer exist. The Game Boy is load-bearing.',
    bonuses: [{ tags: ['electronic', 'home', 'indie'], bonus: 6 }, { tags: ['live'], bonus: -4 }],
    titleWords: { adj: ['8-Bit', 'Overworld', 'Pixelated', 'Continue Screen', 'Low Battery', 'Save Point'], noun: ['Ballad', 'Campfire', 'Side Quest', 'Cartridge', 'Homestead', 'Password'] },
    sound: { scale: 'major', root: 57, bpmRange: [104, 126], drum: 'blip', lead: 'chip', bed: 'chip', parody: 0.7, tropes: ['arpRun'] },
  },
  {
    id: 'gothgrass', name: 'Gothgrass', icon: '🕸️',
    blurb: 'Roots/Write +6 · Mainstream −5',
    flavor: 'Bluegrass, but everyone is dressed for a funeral and the banjo knows why.',
    bonuses: [{ tags: ['roots', 'write'], bonus: 6 }, { tags: ['mainstream'], bonus: -5 }],
    titleWords: { adj: ['Graveyard', 'Moonshine', 'Black Lace', 'Holler', 'Widow’s', 'Candlelit'], noun: ['Banjo', 'Séance', 'Hollow', 'Revival', 'Shroud', 'Crossroads'] },
    sound: { scale: 'naturalMinor', root: 50, bpmRange: [96, 122], drum: 'brush', lead: 'twang', bed: 'drone', parody: 0.6, tropes: ['graveyardThird'] },
  },
  {
    id: 'stadium_shanty', name: 'Stadium Shanty', icon: '⚓',
    blurb: 'Live/Mainstream +6 · Studio −5 (it needs a crowd, not a booth)',
    flavor: 'Sea shanties engineered for forty thousand voices. Heave. Ho. Encore.',
    bonuses: [{ tags: ['live', 'mainstream'], bonus: 6 }, { tags: ['studio'], bonus: -5 }],
    titleWords: { adj: ['Fifty Thousand', 'Portside', 'Anthemic', 'Heave-Ho', 'Encore Deck', 'Salt-Soaked'], noun: ['Chorus', 'Harbor', 'Wave', 'Crew', 'Lighthouse', 'Farewell'] },
    sound: { scale: 'major', root: 48, bpmRange: [80, 96], drum: 'stomp', lead: 'gang', bed: 'heave', parody: 0.8, tropes: ['heaveHo'] },
  },
];
GENRES.push(...GENRES_WAVE2);

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
