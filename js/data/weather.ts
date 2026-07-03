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

  // Wave 2: twelve more eras to be alive in.
  {
    id: 'awards_season', name: 'Awards Season', icon: '🏅',
    blurb: 'The industry is watching itself: fame/mainstream plays +3, fame gains +20%.',
    flavor: 'Every lobby has a step-and-repeat. Every conversation is a campaign.',
    hooks: {
      rollTagBonus: [{ tags: ['fame', 'mainstream'], bonus: 3 }],
      fameGainMult: 1.2,
    },
  },
  {
    id: 'heatwave', name: 'The Heatwave', icon: '🥵',
    blurb: 'Nobody moves before dark: burnout runs +25%, live/tour fade, home/studio draw hot.',
    flavor: 'The asphalt is technically a griddle. The van’s AC is a rumor.',
    hooks: {
      burnoutGainMult: 1.25,
      weightTagMult: [{ tags: ['live', 'tour'], mult: 0.7 }, { tags: ['home', 'studio'], mult: 1.3 }],
    },
  },
  {
    id: 'wedding_season', name: 'Wedding Season', icon: '💍',
    blurb: 'Everyone you have ever met is getting married: money +30%, mainstream plays +3.',
    flavor: 'Four venues, three open bars, two chicken options, one song they all want.',
    hooks: {
      moneyGainMult: 1.3,
      rollTagBonus: [{ tags: ['mainstream', 'family'], bonus: 3 }],
    },
  },
  {
    id: 'rush_week', name: 'Rush Week', icon: '🎓',
    blurb: 'The colleges empty into the venues: network gains +25%, live draws hot.',
    flavor: 'Forty thousand new adults just discovered live music and $4 pitchers, in that order.',
    hooks: {
      statGainMult: { network: 1.25 },
      weightTagMult: [{ tags: ['live'], mult: 1.4 }],
    },
  },
  {
    id: 'doc_fever', name: 'Documentary Fever', icon: '🎥',
    blurb: 'Every scene wants its own film: cred gains +25%, social/fame plays +2.',
    flavor: 'Three streaming services are bidding on “the untold story” of things that happened recently, to you.',
    hooks: {
      statGainMult: { cred: 1.25 },
      rollTagBonus: [{ tags: ['social', 'fame'], bonus: 2 }],
    },
  },
  {
    id: 'transit_strike', name: 'The Transit Strike', icon: '🚧',
    blurb: 'Nobody can get anywhere: tour plays −3, home/busk draw hot, burnout +10%.',
    flavor: 'The scene walks now. The scene is developing calves and opinions.',
    hooks: {
      rollTagBonus: [{ tags: ['tour'], bonus: -3 }],
      weightTagMult: [{ tags: ['home', 'busk'], mult: 1.4 }],
      burnoutGainMult: 1.1,
    },
  },
  {
    id: 'zine_revival', name: 'The Zine Revival', icon: '📮',
    blurb: 'Print is back, staples and all: write/indie plays +3, cred gains +20%.',
    flavor: 'A review in “GLUE STICK QUARTERLY” moves more tickets than the algorithm now. Circulation: 90.',
    hooks: {
      rollTagBonus: [{ tags: ['write', 'indie'], bonus: 3 }],
      statGainMult: { cred: 1.2 },
    },
  },
  {
    id: 'reunion_glut', name: 'The Reunion-Tour Glut', icon: '🦖',
    blurb: 'Legacy acts hog every shed: mainstream plays −3, indie/busk draw hot.',
    flavor: 'Five bands your parents loved un-broke-up this quarter. The arenas are full of the past.',
    hooks: {
      rollTagBonus: [{ tags: ['mainstream'], bonus: -3 }],
      weightTagMult: [{ tags: ['indie', 'busk'], mult: 1.4 }],
    },
  },
  {
    id: 'payola_probe', name: 'The Payola Probe', icon: '🕵️',
    blurb: 'Subpoenas in the mailroom: deal plays −3, cred gains +25%, run pays ×1.1 Legacy.',
    flavor: 'Every playlist editor is suddenly “on sabbatical.” Honest work is briefly fashionable.',
    hooks: {
      rollTagBonus: [{ tags: ['deal'], bonus: -3 }],
      statGainMult: { cred: 1.25 },
      lpMult: 1.1,
    },
  },
  {
    id: 'dance_craze', name: 'The Dance Craze', icon: '🕺',
    blurb: 'Fifteen seconds of choreography rule the earth: social plays +4, releases +8 hype.',
    flavor: 'It has a name. It has a hand thing. Your song either fits it or doesn’t exist.',
    hooks: {
      rollTagBonus: [{ tags: ['social', 'mainstream'], bonus: 4 }],
      releaseHype: 8,
    },
  },
  {
    id: 'off_season', name: 'The Off Season', icon: '🧣',
    blurb: 'The circuit hibernates: live fades, rest/practice draw hot, hustles pay +30%.',
    flavor: 'Nothing books until spring. The scene sharpens its knives and its choruses indoors.',
    hooks: {
      weightTagMult: [{ tags: ['live', 'tour'], mult: 0.7 }, { tags: ['rest', 'practice', 'write'], mult: 1.4 }],
      hustleMult: 1.3,
    },
  },
  {
    id: 'lost_masters', name: 'The Masters Fire', icon: '🚒',
    blurb: 'A vault burned upstate: record/studio plays +3, releases +10 hype (scarcity is real).',
    flavor: 'Decades of tape went up in one night. Suddenly everyone wants everything preserved, twice.',
    hooks: {
      rollTagBonus: [{ tags: ['record', 'studio'], bonus: 3 }],
      releaseHype: 10,
    },
  },
];

export function weatherById(id) {
  return WEATHER.find((w) => w.id === id) || null;
}

export function weatherHooks(state): Record<string, any> {
  return weatherById(state?.weather)?.hooks || {};
}

export function rollWeather(rng) {
  return WEATHER[Math.floor(rng() * WEATHER.length)].id;
}
