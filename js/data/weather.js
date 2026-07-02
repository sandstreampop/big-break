// Scene Weather (Reach & Rush §3 M2): one visible run mutator, rolled at
// run start. A mutator recolors EVERY card it touches — 12 of these
// multiply run identity without authoring 12 decks. Dailies and Gauntlets
// roll from the same table (seeded), so the whole world shares the metagame.
//
// Hooks the engine honors:
//   rollTagBonus: [{tags, bonus}]   — flat roll shift on matching choices
//   weightTagMult: [{tags, mult}]   — deck recolor: matching cards draw hot/cold
//   statGainMult: {stat: mult}      — positive stat gains scale (cred, network…)
//   moneyGainMult / fameGainMult    — positive money/fame gains scale
//   burnoutGainMult                 — burnout gains scale (>1 = harsher era)
//   hustleMult                      — act-break hustle income scales
//   releaseHype                     — extra hype on every song release
//   jitterWiden                     — jitter range stretches both ways
//   startMoney                      — walk-in cash adjustment
//   lpMult                          — end-of-run Legacy Points scale

export const WEATHER = [
  {
    id: 'festival_season', name: 'Festival Season', icon: '🎪',
    blurb: 'Live shows draw hot and play +3. The whole scene smells like funnel cake.',
    flavor: 'Every field within 200 miles is legally a venue until September.',
    hooks: {
      rollTagBonus: [{ tags: ['live', 'tour'], bonus: 3 }],
      weightTagMult: [{ tags: ['live', 'tour'], mult: 1.5 }],
    },
  },
  {
    id: 'vinyl_revival', name: 'Vinyl Revival', icon: '💿',
    blurb: 'Physical is back: releases ship with +12 hype and money runs +25%.',
    flavor: 'Everyone suddenly owns a turntable and opinions about “warmth.”',
    hooks: { releaseHype: 12, moneyGainMult: 1.25 },
  },
  {
    id: 'streaming_crash', name: 'The Streaming Crash', icon: '📉',
    blurb: 'Money gains −30%. Cred gains +30% — nobody’s getting paid, so everyone’s honest.',
    flavor: 'The platform’s new payout model is a coupon. The coupon is expired.',
    hooks: { moneyGainMult: 0.7, statGainMult: { cred: 1.3 } },
  },
  {
    id: 'label_merger', name: 'The Label Merger', icon: '🏷️',
    blurb: 'Consolidation panic: deal cards play +4 and the run pays ×1.15 Legacy.',
    flavor: 'Three majors became one entity overnight. It has a new logo and no memory.',
    hooks: {
      rollTagBonus: [{ tags: ['deal', 'network'], bonus: 4 }],
      lpMult: 1.15,
    },
  },
  {
    id: 'monsoon_tour', name: 'Monsoon Season', icon: '🌧️',
    blurb: 'Everything is harder to predict: jitter +4 both ways, burnout runs +20%.',
    flavor: 'The van has a leak. The venue has a leak. The industry has a leak.',
    hooks: { jitterWiden: 4, burnoutGainMult: 1.2 },
  },
  {
    id: 'algorithm_flu', name: 'The Algorithm Flu', icon: '🦠',
    blurb: 'The feeds are down bad: social cards fade, live/roots draw hot, cred +20%.',
    flavor: 'The recommendation engine recommends nothing. People go OUTSIDE. To shows.',
    hooks: {
      weightTagMult: [{ tags: ['social'], mult: 0.5 }, { tags: ['live', 'roots', 'busk'], mult: 1.4 }],
      statGainMult: { cred: 1.2 },
    },
  },
  {
    id: 'full_moon', name: 'Full Moon Fever', icon: '🌕',
    blurb: 'The weird stuff works: creativity gains +25%, jitter +6 both ways.',
    flavor: 'Every soundcheck tonight has reported “a presence.” The presence has notes.',
    hooks: { statGainMult: { creativity: 1.25 }, jitterWiden: 6 },
  },
  {
    id: 'grant_year', name: 'The Grant Year', icon: '🏛️',
    blurb: 'Arts funding exists, briefly: +$150 walk-in, hustles pay +50%.',
    flavor: 'A council somewhere approved a budget line called “culture (misc).” You are misc.',
    hooks: { startMoney: 150, hustleMult: 1.5 },
  },
  {
    id: 'venue_crackdown', name: 'The Venue Crackdown', icon: '🧯',
    blurb: 'Fire codes bite: live plays −3, but home/studio work plays +3.',
    flavor: 'The fire marshal has a clipboard and a quota. The basements go quiet.',
    hooks: {
      rollTagBonus: [{ tags: ['live'], bonus: -3 }, { tags: ['home', 'studio', 'record', 'write'], bonus: 3 }],
      weightTagMult: [{ tags: ['home', 'studio', 'record'], mult: 1.3 }],
    },
  },
  {
    id: 'nostalgia_wave', name: 'The Nostalgia Wave', icon: '👻',
    blurb: 'The past is charting: roots/retro plays +4, releases ship with +8 hype.',
    flavor: 'A decade you barely survived is back as an aesthetic. Invoice it.',
    hooks: {
      rollTagBonus: [{ tags: ['roots', 'blues', 'family'], bonus: 4 }],
      releaseHype: 8,
    },
  },
  {
    id: 'ai_flood', name: 'The Slop Flood', icon: '🤖',
    blurb: 'Generated music floods the feeds: human writing plays +3, cred gains +30%, money −10%.',
    flavor: 'Forty thousand new “artists” uploaded today. None of them sweat. You sweat. It shows.',
    hooks: {
      rollTagBonus: [{ tags: ['write', 'indie'], bonus: 3 }],
      statGainMult: { cred: 1.3 },
      moneyGainMult: 0.9,
    },
  },
  {
    id: 'open_mic_boom', name: 'The Open Mic Renaissance', icon: '🎙️',
    blurb: 'Every café grows a stage: busk/home plays +3, network gains +25%.',
    flavor: 'A generation discovered that attention is free if you bring your own chair.',
    hooks: {
      rollTagBonus: [{ tags: ['busk', 'home', 'practice'], bonus: 3 }],
      statGainMult: { network: 1.25 },
    },
  },
];

export function weatherById(id) {
  return WEATHER.find((w) => w.id === id) || null;
}

export function weatherHooks(state) {
  return weatherById(state?.weather)?.hooks || {};
}

export function rollWeather(rng) {
  return WEATHER[Math.floor(rng() * WEATHER.length)].id;
}
