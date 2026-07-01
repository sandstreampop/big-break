// Rivals: one is generated per run and threaded through rival-tagged events.
// Event text uses {rival} placeholders, filled by the UI at render time.
// Rivalry is a hidden-ish 0..10 meter (surfaced via delta chips) that gates
// the Act 3 payoff: showdown (high) or supergroup (low).

export const RIVALS = [
  {
    id: 'vanta', name: 'Vanta Blake',
    vibe: 'wears sunglasses indoors, calls songs “pieces”',
  },
  {
    id: 'mickey', name: 'Mickey Volt',
    vibe: 'peaked in a battle of the bands and never stopped mentioning it',
  },
  {
    id: 'panopticon', name: 'DJ Panopticon',
    vibe: 'claims to “play the room itself”',
  },
  {
    id: 'lasagna', name: 'Sad Lasagna',
    vibe: 'a band, legally one person, spiritually a threat',
  },
  {
    id: 'petersens', name: 'the Petersen Twins',
    vibe: 'harmonize their small talk',
  },
  {
    id: 'juniper_q', name: 'Juniper Quayle',
    vibe: 'went viral once and treats it like tenure',
  },
  {
    id: 'baron', name: 'Baron Cadence',
    vibe: 'has a lore video longer than his EP',
  },
  {
    id: 'ghostnote', name: 'Ghostnote',
    vibe: 'nobody has ever seen them load in or load out',
  },
];

export function randomRival(rng = Math.random) {
  return RIVALS[Math.floor(rng() * RIVALS.length)];
}

export function rivalById(id) {
  return RIVALS.find((r) => r.id === id) || RIVALS[0];
}
