// Procedural epilogue: a "where are they now" paragraph composed from what
// actually happened in the run. Appended to every ending.

import { mulberry32 } from './engine.js';
import { rivalById } from './data/rivals.js';
import { instrumentById } from './data/instruments.js';
import { genreById } from './data/genres.js';
import { contractById } from './data/contracts.js';
import { venueById, VENUE_TIERS } from './data/venues.js';
import { bandmateById } from './data/band.js';

export function buildEpilogue(state) {
  const rival = rivalById(state.rival);
  const flags = state.flags || [];
  const firstInst = instrumentById(state.firstInstrument || state.instrument);
  const pool = [];
  const add = (cond, text) => { if (cond) pool.push(text); };

  add(flags.includes('song_finished'),
    '“The Door” still closes every set. Some nights you play it slow, just to stay inside it a little longer.');
  add(flags.includes('song_sold'),
    'You never mention the song you sold. The radio mentions it constantly. You’ve learned to change stations without looking.');
  add((state.rivalry ?? 3) <= 1,
    `Every winter, you and ${rival.name} play the diner unannounced. No poster, no setlist, no feud. The waitress keeps your booth.`);
  add((state.rivalry ?? 3) >= 8,
    `You and ${rival.name} never spoke again. You check their numbers weekly. Reliable sources say they check yours hourly.`);
  add(state.swappedInstrument && firstInst,
    `The ${firstInst.name.toLowerCase()} hangs framed above your desk — the one that couldn’t, next to all the things it started anyway.`);
  add((state.hustles || []).length >= 2,
    'In Q3, the side hustles quietly out-earned the art. You told no one. The spreadsheet knows.');
  add(state.stats.burnout >= 70,
    'You sleep now. Mostly. Some nights your hands still practice against your chest, four bars of something, and you let them finish.');
  add(state.stats.burnout <= 18,
    'You still take Sundays. Entirely. The industry called it a phase, then a boundary, then a masterclass.');
  add(state.contract === 'kazoo_clause',
    'The Kazoo Clause hangs framed in your lawyer’s office, as a warning to others.');
  add(!!state.genre,
    `Historians call it the ${genreById(state.genre)?.name || ''} wave. You call it Tuesday nights in a room that smelled like nachos.`);
  add(state.money < 0,
    'Curtis, at least, always answers your calls. Some relationships outlast the balance.');
  add(flags.includes('home_studio'),
    'The shed is still there. Musicians you’ve never met call it “the room.” The rooster, now elderly, has a windowsill and opinions.');
  add(flags.includes('docu_gold'),
    '“ALMOST” screens at a film class every semester. Students write essays about the backstage scene. You’ve read two. You only cried at one.');
  add(flags.includes('docu_dirt'),
    'The blooper reel resurfaces every few years like a comet. You’ve learned to add the air-horn yourself before anyone else can.');
  add(flags.includes('helped_bloom'),
    'Static Bloom thanks the amp in every award speech. It has become a bit. The amp has a better publicist than you do.');
  add(flags.includes('constellation'),
    'The strangest thing about the whole career: the way the stories found each other, like they’d been written to meet.');
  add((state.hustles || []).includes('wedding_circuit'),
    'You still play four weddings a year. You know every venue’s power situation by heart. You cry at exactly the right moment, every time, on purpose.');
  add(flags.includes('album_out'),
    'The album aged the way rooms do — slowly, and then all at once into something people miss on purpose. Anniversary reissue pending. You keep saying no. That’s part of it now.');
  add(flags.includes('nadia_hook'),
    'The last-page song still opens the reissues. Nadia’s notebook is on volume nine. She lets you read exactly one page per year.');
  add(flags.includes('nadia_solo'),
    'Nadia’s solo record went where records go when they’re that good. She still plays your stuff live. “Warm-up,” she says. It’s love. You both know.');
  add(flags.includes('fan_family'),
    'Row zero is at every hometown show, same spot, plus their mom. The tattoo has aged into the skin like liner notes. Neither of you has ever once said the word “parasocial.” Why would you. It was social the whole time.');
  add(flags.includes('superfan') && !flags.includes('fan_family'),
    'You never learned the fan account admin’s last name. They never needed you to. The archive is still up — complete, accurate, and kinder than the press ever was.');
  add(flags.includes('room_saved'),
    'The plaque by the door of the room says “saved by the scene,” and under it, smaller, the sound guy added: “and one benefit that ran long.” It still runs long. That’s the point of rooms.');
  add(flags.includes('room_lost'),
    'The climbing gym kept the stage as a “feature wall.” Climbers touch it for luck without knowing why. The room got out. The room is everywhere now.');
  add(flags.includes('mg_steady'),
    'People who were in the room that night still describe your hands: steady, when nothing else was.');
  add(state.money >= 800,
    'You bought the pawn shop. The owner still works Saturdays, by choice, telling kids the wall of gear has songs left in it.');
  add(state.fame >= 90,
    'Airports are complicated now. You wear the disguise. The disguise has its own fan account.');
  add(state.hits >= 4,
    'Four songs of the summer. Four different summers. The almanacs will need a footnote.');
  // the songs themselves get last words
  const songs = state.songs || [];
  const numberOne = songs.find((s) => s.peak === 1);
  const bigHit = !numberOne && songs.find((s) => s.crowned);
  const vaultDemo = songs.filter((s) => s.status === 'demo').sort((a, b) => b.quality - a.quality)[0];
  const oneWeek = songs.find((s) => s.status === 'faded' && s.weeks <= 2 && s.peak);
  add(!!numberOne,
    `“${numberOne?.title}” still gets played at closing time in bars that don’t know you wrote it. #1 is forever, even when nobody remembers the year.`);
  add(!!bigHit,
    `Covers of “${bigHit?.title}” keep arriving — wedding bands, film students, one unforgivable EDM remix. The song left home and did fine.`);
  add(!!vaultDemo && vaultDemo.quality >= 60,
    `“${vaultDemo?.title}” never came out. Collectors claim they’ve heard it. They haven’t. Some nights you play it once, alone, and put it back.`);
  add(!!oneWeek,
    `“${oneWeek?.title}” charted for a moment and vanished — a one-week wonder. The people who caught it that week bring it up like a secret handshake.`);
  add((state.copingSeen || []).includes('coping_75'),
    'The bathroom floor is someone else’s problem now. Your new place has carpet, houseplants, and a rule about phones after midnight.');
  add(flags.includes('grounded'),
    'The person who drove out that night still gets thanked from every stage, by a nickname nobody in the crowd understands.');
  add(state.brammy === 'won',
    'The Brammy lives on the amp, slightly crooked, holding down a stack of unpaid parking tickets. Correct use of an award.');
  add(state.brammy === 'lost',
    `You never got the Brammy. The gracious-loss face, however, became load-bearing at every industry function since. Some trophies are muscles.`);
  add(flags.includes('second_verse'),
    'The kitchen is still the best venue you ever played. Audience of one, standing ovation nightly, no door money. The second verse got longer than the first. It’s still going.');
  add(flags.includes('someone_lost'),
    'You still have the napkin, or they still have the hoodie — accounts differ. The song about Thursday finally came out. They texted one word: “heard.” You framed the text. Don’t tell anyone.');
  add(flags.includes('someone') && !flags.includes('second_verse'),
    'They were in the kitchen for every version of you. Still are. The industry never found out, which was the whole idea.');
  add(!!state.nemesis,
    `You and ${rival.name}, again. Biographers will assume you planned it. Neither of you did. Both of you needed it.`);
  add(flags.includes('comeback'),
    'The second act outgrew the first, which never happens, which is why they’ll teach it. The grocery store in aisle 6 has a plaque now. Unofficial. Laminated.');
  add(state.daily != null,
    'The whole thing happened in one impossible day, which is how everyone tells it anyway.');
  const band = (state.band || []).map(bandmateById).filter(Boolean);
  add(band.length >= 3,
    `The band stayed the band — ${band.map((b) => b.name).join(', ')} — through every reunion rumor they started themselves, for fun.`);
  add(band.length === 1,
    `${band[0] ? band[0].name : 'Your bandmate'} still plays every show with you. Some hires are family with a start date.`);
  add((state.flags || []).includes('band_named'),
    'Nobody remembers whose name was on the first flyer. That’s the whole point. That was always the whole point.');
  const venue = venueById(state.venue);
  if (venue) {
    add(state.venueLevel >= 3,
      `${venue.name} is a local institution now — there’s a plaque, a house cocktail named after you, and a permanent spot on the wall. You still play it every time you’re home.`);
    add(state.venueLevel === 2,
      `They keep a booth for you at ${venue.name}. Not reserved, exactly. Just understood.`);
    add(state.venueLevel <= 1,
      `You still mean to go back to ${venue.name} more often. The sound guy still asks about you. You should call the sound guy.`);
  }
  add(true,
    'The sound guy at the Ricochet Room claims he always knew. For once, nobody argues with the sound guy.');

  const rng = mulberry32((state.chartSeed || 1) * 101 + 7);
  const picks = [];
  const bag = [...pool];
  while (picks.length < Math.min(4, pool.length) && bag.length) {
    picks.push(bag.splice(Math.floor(rng() * bag.length), 1)[0]);
  }
  return picks.join(' ');
}
