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
  {
    id: 'brine', name: 'Captain Brine',
    vibe: 'plays exclusively sea shanties, insists the landlocked city is “technically coastal”',
  },
  {
    id: 'mothra', name: 'Mothra Jones',
    vibe: 'headlines every show “farewell tour,” has retired eleven times',
  },
  {
    id: 'trend', name: 'TREND()',
    vibe: 'procedurally generated act; nobody has met the members; the members may be a spreadsheet',
  },
];

// Wave 3: eleven more acts sharing your city, your venues, and your nerve.
export const RIVALS_WAVE3 = [
  {
    id: 'okays', name: 'The Okays',
    vibe: 'settle every argument by playing louder; have never lost an argument',
  },
  {
    id: 'gruel', name: 'Gruel',
    vibe: 'a noise duo who bill themselves as “a texture” and charge extra for earplugs',
  },
  {
    id: 'tilly', name: 'Tilly Fontaine',
    vibe: 'classically trained, mentions it before hello',
  },
  {
    id: 'brass_tax', name: 'Brass Tax',
    vibe: 'a ska nine-piece that keeps absorbing smaller bands like a corporation',
  },
  {
    id: 'nocturne', name: 'Baby Nocturne',
    vibe: 'only plays 3 a.m. sets, insists daylight is a label construct',
  },
  {
    id: 'crawlspace', name: 'Crawlspace Choir',
    vibe: 'records exclusively in condemned buildings, for the reverb and the menace',
  },
  {
    id: 'minivan', name: 'Minivan Sunset',
    vibe: 'four dads, zero irony, terrifying pocket',
  },
  {
    id: 'astrid', name: 'Astrid Antenna',
    vibe: 'claims to receive melodies from a satellite only she can hear',
  },
  {
    id: 'understudy', name: 'The Understudy',
    vibe: 'covers your setlist one week before you play it, somehow',
  },
  {
    id: 'ferns', name: 'Emotional Ferns',
    vibe: 'whisper-quiet twee collective with the most vicious lawyer in the tri-county',
  },
  {
    id: 'kudzu', name: 'DJ Kudzu',
    vibe: 'remixes anything left unattended; your soundcheck is already on his mixtape',
  },
];
RIVALS.push(...RIVALS_WAVE3);

export function randomRival(rng = Math.random) {
  return RIVALS[Math.floor(rng() * RIVALS.length)];
}

export function rivalById(id) {
  return RIVALS.find((r) => r.id === id) || RIVALS[0];
}
