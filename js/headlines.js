// The Trades: procedural industry headlines generated from actual run
// state, shown on act interstitials and the finale. Seeded off chartSeed
// so a Daily Grind shows everyone the same press.

import { mulberry32 } from './engine.js';
import { rivalById } from './data/rivals.js';

const NICKNAMES = {
  kazoo: 'THE KAZOO KID',
  melodica: 'THE MELODICA MERCENARY',
  bucket_drums: 'THE BUCKET PROPHET',
  cigarbox_guitar: 'THREE-STRING TRUTH',
  toy_glockenspiel: 'THE GLOCK ANGEL',
  theremin: 'THE HANDS',
  electric_guitar: 'THE SIX-STRING UPSTART',
  sampler: 'THE PAD LORD',
  own_voice: 'THE VOICE (NO RELATION)',
  modular_synth: 'THE PATCH BAY ORACLE',
  triangle: 'ONE NOTE',
  hurdy_gurdy: 'THE CRANK',
  workhorse: 'ROAD HANDS',
  omnichord: 'THE SUNRISE MACHINE',
  washboard: 'THIMBLES',
};

export function nicknameFor(instrumentId) {
  return NICKNAMES[instrumentId] || 'THE ACT';
}

export function generateHeadlines(state, count = 3) {
  const you = nicknameFor(state.instrument);
  const rival = rivalById(state.rival).name.toUpperCase();
  const lastAct = state.act - 1;
  const lastTiers = (state.cardLog || []).filter((c) => c.a === lastAct);
  const bads = lastTiers.filter((c) => c.t === 'bad').length;
  const increds = lastTiers.filter((c) => c.t === 'incredible').length;

  const pool = [];
  const add = (cond, text, src) => { if (cond) pool.push({ text, src }); };

  add(state.fame >= 60, `${you} IS EVERYWHERE AND SOME PEOPLE ARE MAD ABOUT IT`, 'The Discourse, weekly');
  add(state.fame >= 25 && state.fame < 60, `“WHO IS ${you}?” ASKS BLOG, ANSWERING ITSELF POORLY`, 'Scene & Herd');
  add(state.fame < 15 && state.act >= 2, `AREA MUSICIAN STILL “BUILDING SOMETHING,” CONFIRMS AREA MUSICIAN`, 'The Local Take');
  add(increds >= 2, `${you} CAN’T MISS, SOURCES WHO WERE THERE CONFIRM`, 'Backstage Pass Quarterly');
  add(bads >= Math.max(3, lastTiers.length / 2), `${you} HAVING “A YEAR,” SAY WITNESSES`, 'Schadenfreude Digest');
  add(state.stats.burnout >= 60, `INDUSTRY ASKS: IS ${you} OKAY? (SPONSORED BY GRIND™)`, 'Wellness & Deals');
  add(state.stats.burnout <= 20 && state.act === 3, `SUSPICIOUSLY WELL-RESTED: THE ${you} STORY`, 'Sleep Trade Weekly');
  add((state.rivalry ?? 3) >= 7, `${rival} DECLINES TO COMMENT ON ${you}, AT LENGTH, FOR AN HOUR`, 'Feud Watch');
  add((state.rivalry ?? 3) <= 1, `${you} AND ${rival}: JUST FRIENDS? INVESTIGATION ONGOING`, 'Parasocial Times');
  add(state.money < 0, `EXPOSURE ECONOMY CLAIMS ANOTHER: A ${you} STORY`, 'The Invoice');
  add(state.money >= 800, `${you} REPORTEDLY “DOING FINE, MONEY-WISE,” STUNNING ECONOMISTS`, 'The Invoice');
  const flags = state.flags || [];
  add(flags.includes('home_studio'), `GARDEN SHED OUTBOOKS THREE “REAL” STUDIOS; SHEDS UNAVAILABLE FOR COMMENT`, 'Tape Op-Ed');
  add(flags.includes('docu_crew'), `EVERYTHING IS CONTENT: FILM STUDENT SHADOWS ${you}, WARTS CONFIRMED PLENTIFUL`, 'Doc Talk');
  add(flags.includes('helped_bloom'), `STATIC BLOOM CREDITS “A BORROWED AMP” FOR EVERYTHING; AMP RETAINS COUNSEL`, 'Backline Bulletin');
  add(flags.includes('constellation'), `LOCAL CAREER ACHIEVES NARRATIVE COHESION; CRITICS SUSPICIOUS`, 'The Discourse, weekly');
  add(flags.includes('mg_golden'), `WITNESSES DESCRIBE ${you}’S HANDS AS “FRANKLY UNFAIR”`, 'Technique Weekly');
  add((state.hustles || []).includes('wedding_circuit'), `${you} NOW BOOKED THROUGH WEDDING SEASON; GRANDMOTHERS CITED AS KINGMAKERS`, 'The Aisle Files');
  add(state.venueLevel >= 3, `THE ROOM THAT ${you} BUILT: A VENUE STORY`, 'Four Walls Monthly');
  add(flags.includes('band_named'), `LOCAL ACT NOW “A REAL BAND,” VOTES ON EVERYTHING, REGRETS DEMOCRACY WEEKLY`, 'Group Chat Gazette');
  add(state.hits >= 2, `EVERY SONG YOU HATE-LOVE THIS QUARTER TRACES BACK TO ONE PEN`, 'Publishing Weekly');
  add((state.hustles || []).length >= 2, `${you} NOW TECHNICALLY A SMALL BUSINESS`, 'Hustle & Flow (Trade Ed.)');
  add(state.stats.cred >= 70, `SCENE ELDERS APPROVE OF ${you}; SCENE ELDERS APPROVE OF NOTHING`, 'Cred Report');
  add(state.stats.skill >= 70, `“JUST WATCH THEIR HANDS”: ENGINEERS ON ${you}`, 'Control Room Monthly');
  add(state.path === 'megastar' && state.act === 3, `LABELS CIRCLE ${you} “LIKE POLITE SHARKS”`, 'A&R Confidential');
  add(state.path === 'studio' && state.act === 3, `WHO PLAYED THAT? INCREASINGLY, THE ANSWER IS ${you}`, 'Liner Notes Ledger');
  add(state.path === 'hitfactory' && state.act === 3, `THE HOOK SUPPLY CHAIN RUNS THROUGH ONE APARTMENT`, 'Publishing Weekly');
  add(true, `KAZOO DISCOURSE ENTERS DAY 40`, 'The Discourse, weekly');
  add(true, `VENUE RAISES FEES, BLAMES “THE ECONOMY,” BUYS BOAT`, 'Scene & Herd');
  add(true, `CRAIG (BAGPIPES) ANNOUNCES RESIDENCY, FARMERS MARKET UNEASY`, 'The Local Take');

  const rng = mulberry32((state.chartSeed || 1) * 31 + state.act * 977);
  const picks = [];
  const bag = [...pool];
  while (picks.length < count && bag.length) {
    picks.push(bag.splice(Math.floor(rng() * bag.length), 1)[0]);
  }
  return picks;
}
