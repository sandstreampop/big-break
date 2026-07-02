// The band: people recruited mid-run (max 3). Each adds a passive roll
// bonus on matching tags, and some have an act-start quirk (income, healing).
// Recruited via grantBandmate effects; they show as HUD chips and get
// epilogue lines.

export const BANDMATES = [
  {
    id: 'fish', name: 'Fish', role: 'tour manager / owns the van', icon: '🐟',
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
    id: 'tanya', name: 'Tanya', role: 'merch & morale', icon: '🧵',
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
    id: 'pearl', name: 'Pearl', role: 'harmonies & harm reduction', icon: '🫧',
    flavor: 'Sings the third above you and tells you when to go home. Both save your life.',
    bonus: { tags: ['vocal', 'record'], bonus: 5 },
    actQuirk: { burnout: -3 },
    quirkDesc: 'Vocal/Record +5 · −3 Burnout at each act break',
  },
];

export function bandmateById(id) {
  return BANDMATES.find((b) => b.id === id) || null;
}

export function recruitCandidate(state, rng = Math.random) {
  const inBand = new Set(state.band || []);
  const pool = BANDMATES.filter((b) => !inBand.has(b.id));
  if (!pool.length) return null;
  return pool[Math.floor(rng() * pool.length)];
}
