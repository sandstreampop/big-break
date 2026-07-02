// Procedural epilogue: a "where are they now" paragraph composed from what
// actually happened in the run. Appended to every ending.

import { mulberry32 } from './engine.js';
import { rivalById } from './data/rivals.js';
import { instrumentById } from './data/instruments.js';
import { genreById } from './data/genres.js';
import { contractById } from './data/contracts.js';

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
  add(state.money >= 800,
    'You bought the pawn shop. The owner still works Saturdays, by choice, telling kids the wall of gear has songs left in it.');
  add(state.fame >= 90,
    'Airports are complicated now. You wear the disguise. The disguise has its own fan account.');
  add(state.hits >= 4,
    'Four songs of the summer. Four different summers. The almanacs will need a footnote.');
  add((state.copingSeen || []).includes('coping_75'),
    'The bathroom floor is someone else’s problem now. Your new place has carpet, houseplants, and a rule about phones after midnight.');
  add(flags.includes('grounded'),
    'The person who drove out that night still gets thanked from every stage, by a nickname nobody in the crowd understands.');
  add(state.daily != null,
    'The whole thing happened in one impossible day, which is how everyone tells it anyway.');
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
