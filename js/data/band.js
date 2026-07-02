// The band: people recruited mid-run (max 3). Each adds a passive roll
// bonus on matching tags, and some have an act-start quirk (income, healing).
// Recruited via grantBandmate effects; they show as HUD chips and get
// epilogue lines.

export const BANDMATES = [
  {
    id: 'fish', storyCard: 'bs_fish_van', name: 'Fish', role: 'tour manager / owns the van', icon: '🐟',
    flavor: 'Comes with the van. The van comes with Fish. It’s a package deal.',
    bonus: { tags: ['tour', 'live'], bonus: 5 },
    actQuirk: { burnout: -4 },
    quirkDesc: 'Tour/Live +5 · −4 Burnout at each act break (Fish handles logistics)',
  },
  {
    id: 'birdie', name: 'Birdie', role: 'bass, unshakeable', icon: '🐦',
    flavor: 'Has never rushed a note or a decision. The pocket incarnate.',
    bonus: { tags: ['studio', 'live'], bonus: 4 },
    quirkDesc: 'Studio/Live +4 · the pocket never lies',
  },
  {
    id: 'moss', name: 'Moss', role: 'synths, feral', icon: '🌿',
    flavor: 'Sleeps in the practice space. Legally, this is fine. Probably.',
    bonus: { tags: ['electronic', 'write', 'indie'], bonus: 5 },
    quirkDesc: 'Electronic/Write/Indie +5',
  },
  {
    id: 'tanya', storyCard: 'bs_tanya_empire', name: 'Tanya', role: 'merch & morale', icon: '🧵',
    flavor: 'Screen-prints in the van. Remembers every fan’s name. Terrifyingly effective.',
    bonus: { tags: ['network', 'fame'], bonus: 4 },
    actQuirk: { money: 60 },
    quirkDesc: 'Network/Fame +4 · +$60 merch money at each act break',
  },
  {
    id: 'deacon', name: 'Deacon', role: 'drums, ex-jazz', icon: '🥁',
    flavor: 'Quit a conservatory “on principle.” The principle was fun.',
    bonus: { tags: ['live', 'roots'], bonus: 5 },
    quirkDesc: 'Live/Roots +5',
  },
  {
    id: 'pearl', storyCard: 'bs_pearl_checkin', name: 'Pearl', role: 'harmonies & harm reduction', icon: '🫧',
    flavor: 'Sings the third above you and tells you when to go home. Both save your life.',
    bonus: { tags: ['vocal', 'record'], bonus: 5 },
    actQuirk: { burnout: -3 },
    quirkDesc: 'Vocal/Record +5 · −3 Burnout at each act break',
  },
];

export const BANDMATES_WAVE2 = [
  {
    id: 'ludo', storyCard: 'bs_ludo_parade', name: 'Ludo', role: 'horns & hype', icon: '🎺',
    flavor: 'One man, three horns, zero indoor voice. Every room is a stadium to Ludo.',
    bonus: { tags: ['live', 'mainstream', 'fame'], bonus: 5 },
    actQuirk: { fame: 2 },
    quirkDesc: 'Live/Mainstream/Fame +5 · +2 Fame at each act break (Ludo tells everyone)',
  },
  {
    id: 'greta', storyCard: 'bs_greta_archive', name: 'Greta', role: 'engineer, owns mics', icon: '🎙️',
    flavor: 'Carries a suitcase of microphones with names. Records everything “for the archive.” There is an archive.',
    bonus: { tags: ['studio', 'record', 'tone'], bonus: 6 },
    quirkDesc: 'Studio/Record/Tone +6 · the archive remembers',
  },
  {
    id: 'saul', storyCard: 'bs_saul_clause', name: 'Saul', role: 'keys, ex-lawyer', icon: '⚖️',
    flavor: 'Passed the bar, chose the piano bar. Reads every contract at the merch table, for fun.',
    bonus: { tags: ['deal', 'network'], bonus: 5 },
    actQuirk: { money: 40 },
    quirkDesc: 'Deal/Network +5 · +$40 at each act break (Saul finds the clause)',
  },
  {
    id: 'nadia', storyCard: 'a3_nadia_spotlight', name: 'Nadia', role: 'topline machine', icon: '✒️',
    flavor: 'Hums hooks in her sleep. Keeps a notebook of “spares.” There are no spares.',
    bonus: { tags: ['write', 'mainstream'], bonus: 5 },
    actQuirk: { demo: true },
    quirkDesc: 'Write/Mainstream +5 · leaves a fresh demo on your amp at each act break',
  },
];
BANDMATES.push(...BANDMATES_WAVE2);

export function bandmateById(id) {
  return BANDMATES.find((b) => b.id === id) || null;
}

export function recruitCandidate(state, rng = Math.random) {
  const inBand = new Set(state.band || []);
  let pool = BANDMATES.filter((b) => !inBand.has(b.id));
  if (!pool.length) return null;
  // Novelty steering (R3/R2): if any candidate has a story card this
  // player has never seen, recruit from those — the bandmate-specific
  // cards (bandHas gates) only exist if their person shows up.
  const seen = new Set([...(state.seenCards || []), ...(state.usedEvents || [])]);
  const fresh = pool.filter((b) => b.storyCard && !seen.has(b.storyCard));
  if (fresh.length && state.seenCards) pool = fresh;
  return pool[Math.floor(rng() * pool.length)];
}
