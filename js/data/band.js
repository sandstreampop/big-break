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

export const BANDMATES_WAVE3 = [
  {
    id: 'ox', storyCard: 'bs_ox_amps', name: 'Ox', role: 'drums, gentle giant', icon: '🐂',
    flavor: 'Carries the full backline in one trip and apologizes for taking up room. The kick drum obeys.',
    bonus: { tags: ['live', 'tour'], bonus: 5 },
    actQuirk: { burnout: -2 },
    quirkDesc: 'Live/Tour +5 · −2 Burnout at each act break (Ox carries everything)',
  },
  {
    id: 'wren', name: 'Wren', role: 'fiddle, feral optimist', icon: '🎻',
    flavor: 'Learned by ear, plays by dare. Has never once checked what key the song is in. Has never once been wrong.',
    bonus: { tags: ['roots', 'busk'], bonus: 5 },
    quirkDesc: 'Roots/Busk +5 · the ear never lies',
  },
  {
    id: 'cassette', storyCard: 'bs_cassette_wall', name: 'Cassette', role: 'DJ / archivist of the uncool', icon: '📼',
    flavor: 'Owns every flop of the last forty years and knows which four seconds of each one was genius.',
    bonus: { tags: ['electronic', 'social'], bonus: 5 },
    quirkDesc: 'Electronic/Social +5 · the crates go deep',
  },
  {
    id: 'marisol', name: 'Marisol', role: 'trumpet, mariachi-trained', icon: '🎺',
    flavor: 'Grew up playing weddings, funerals, and everything either could turn into. Reads a room like sheet music.',
    bonus: { tags: ['live', 'family'], bonus: 5 },
    actQuirk: { fame: 1 },
    quirkDesc: 'Live/Family +5 · +1 Fame at each act break (people remember the trumpet)',
  },
  {
    id: 'dot', storyCard: 'bs_dot_ledger', name: 'Dot', role: 'keys, accountant by day', icon: '🧮',
    flavor: 'Plays like the piano owes her money. It does. She has the paperwork.',
    bonus: { tags: ['deal', 'work'], bonus: 5 },
    actQuirk: { money: 50 },
    quirkDesc: 'Deal/Work +5 · +$50 at each act break (Dot finds the deductions)',
  },
  {
    id: 'reverend', name: 'The Reverend', role: 'organ, denomination unclear', icon: '⛪',
    flavor: 'Appeared at load-in with his own Leslie speaker and a look of forgiveness. Nobody booked him. Nobody would dare unbook him.',
    bonus: { tags: ['tone', 'studio'], bonus: 5 },
    quirkDesc: 'Tone/Studio +5 · the organ swells and so does the room',
  },
  {
    id: 'kiki', name: 'Kiki', role: 'content, unpaid (her words)', icon: '📱',
    flavor: 'Films everything from the one angle that makes the crowd look double. The comments fear her.',
    bonus: { tags: ['social', 'fame'], bonus: 5 },
    actQuirk: { fame: 2 },
    quirkDesc: 'Social/Fame +5 · +2 Fame at each act break (the clips keep landing)',
  },
  {
    id: 'gus', storyCard: 'bs_gus_board', name: 'Gus', role: 'sound engineer, finally said yes', icon: '🎚️',
    flavor: 'Mixed every band in town for a decade and joined yours. The scene is still processing the endorsement.',
    bonus: { tags: ['live', 'tone'], bonus: 6 },
    quirkDesc: 'Live/Tone +6 · the mix is finally on your side',
  },
  {
    id: 'paloma', name: 'Paloma', role: 'harmonies, ex-choir director', icon: '🕊️',
    flavor: 'Can make eleven strangers sound like one voice. You are, on your best night, four strangers.',
    bonus: { tags: ['vocal', 'mainstream'], bonus: 5 },
    quirkDesc: 'Vocal/Mainstream +5 · the blend forgives everything',
  },
  {
    id: 'zed', name: 'Zed', role: 'bass, communicates in nods', icon: '🧷',
    flavor: 'Has said nine words since joining. Three were “turn me down slightly.” The pocket speaks for him.',
    bonus: { tags: ['studio', 'safe'], bonus: 5 },
    quirkDesc: 'Studio/Safe +5 · the nod means yes',
  },
];
BANDMATES.push(...BANDMATES_WAVE3);

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
