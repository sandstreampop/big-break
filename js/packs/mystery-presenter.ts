// The mystery pack's Presenter (Phase G): the reality-show × murder-mystery
// genre's UI flavor, authored against the same Presenter contract the music
// pack fills. Before this existed the mystery game CRASHED at its finale — the
// UI indexed music's ENDINGS by a mystery path key (sleuth/darling/fixer) and
// called music's epilogue, which does music-data lookups. Now the UI reads
// THIS, and a mystery run reaches a real, in-genre ending.

import { mulberry32 } from '../engine.js';
import type { Presenter, RunState } from '../types.js';

// #region endings
// Ending copy: path id → { success, partial, failure }, plus the engine's
// fail-state keys (burnout→"unmasked", cancelled→"voted off", debt→"broke").
const ENDINGS: Record<string, any> = {
  sleuth: {
    success: { title: 'THE SLEUTH', text: 'You name the killer on live television, and the room goes very quiet. The producers hate it — it was not the twist they wrote — but forty million people just watched an amateur out-detect the show. The confetti is for someone else. The truth is yours.' },
    partial: { title: 'Reasonable Doubt', text: 'You had it — motive, timeline, the missing keycard. You just could not make the last piece click before the finale bell. The internet finishes your case for you by morning. You were right. You were also one clue short.' },
    failure: { title: 'The Wrong Guy', text: 'You pointed. Confidently. At the one person who could prove they were in the hot tub the whole time. The edit makes you look unhinged. Somewhere the real killer mouths “thank you” at a confessional camera. Next season.' },
  },
  darling: {
    success: { title: 'AMERICA’S DARLING', text: 'America votes, and America adores you. You outlast every schemer on charm alone — a montage, a tearful confession, a redemption arc the producers did not have to fake. The check is enormous. The DMs are worse. You won the whole thing by being impossible to root against.' },
    partial: { title: 'Fan Favorite (Runner-Up)', text: 'The audience loved you — the WINNER got the votes, but you got the spin-off offer. Second place on the show, first place in the group chat. The brand deals do not care who took the final immunity.' },
    failure: { title: 'The Villain Edit', text: 'They cut you into the villain, and the audience believed it, because that is what edits are for. You leave to a chorus of boos you did not earn. The reunion special will be brutal. Your therapist will be booked solid.' },
  },
  fixer: {
    success: { title: 'THE FIXER', text: 'You never won a single popular vote and never needed to. You ran the house — favors, leverage, a little cash, a lot of nerve — until the only person left standing was the one holding everyone else’s secrets. That’s you. The prize money is almost an afterthought.' },
    partial: { title: 'Power Behind the Throne', text: 'Your alliance took the crown; you took the real spoils. The winner thanks you in their speech without quite knowing why they had to. You leave richer, quieter, and owed by half the cast.' },
    failure: { title: 'Out-Maneuvered', text: 'You played everyone, and then someone played you — quietly, patiently, with your own moves. Blindsided at the last vote. The house you built voted you out of it. Respect, at least, in the betrayal.' },
  },
  // Fail states (the engine's burnout / cancelled / debt keys, reskinned).
  burnout: { title: 'Medically Withdrawn', text: 'The suspicion ate you alive — you stopped sleeping, started narrating the ceiling, and the on-call producer pulled you before the doctor had to. “Exhaustion,” the press release says. You know it was the not-knowing. The house keeps its secret. You go home to silence.' },
  cancelled: { title: 'Voted Off', text: 'The house turned on you all at once — a unanimous, almost tender vote, the kind reserved for someone who saw too much. You walk the plank of the dock at sunrise. The confessional booth keeps your best theory forever. Nobody will hear it.' },
  debt: { title: 'Bought Out', text: 'You took the production’s buyout — the quiet envelope they offer the ones who become a liability. You sign, you smile, you leave. The NDA is longer than the contract. Somewhere in a vault, footage of what you almost proved gathers dust.' },
};
// #endregion endings

const EXIT_INTERVIEWS: Record<string, any> = {
  burnout: {
    context: 'The medic’s tent, 4 a.m.',
    prompt: 'The producer crouches by the cot. “Off the record — before you go. The thing you figured out. You want to tell someone, or you want to take it with you?”',
    left: { label: 'Tell them everything.', exit: 'confessed', lp: 8,
      text: 'You lay it out — the timeline, the lie, the name. The producer’s face does something complicated. They can’t use it; you were withdrawn; it’s inadmissible in the only court that matters here. But someone finally heard it. You sleep, at last.' },
    right: { label: 'Take it home.', exit: 'withheld', lp: 4,
      text: 'You shake your head and close your eyes. Some things you keep. The van takes you past the house on the way out; a light is still on in the room where it happened. You do not look. You already know.' },
  },
  cancelled: {
    context: 'The dock, at the walk-off',
    prompt: 'The host waits with the microphone and the practiced sad smile. “Any last words for the house that voted you out?”',
    left: { label: 'Name a name on live TV.', exit: 'accused', lp: 8,
      text: 'You say it into the mic before anyone can cut you off, one clean sentence, and the dock goes dead silent. The clip outlives the season. Whether you were right becomes a genre of video essay. You leave having changed the show.' },
    right: { label: 'Smile and wave.', exit: 'gracious', lp: 4,
      text: 'You thank them. You mean about a third of it. The gracious-exit edit ages beautifully; you get invited back as a fan-favorite guest judge two seasons later, seated one chair away from the person you suspect. You smile again.' },
  },
  debt: {
    context: 'The signing room, envelope on the table',
    prompt: 'The lawyer slides the pen over. “Standard buyout. Sign and it’s finished.” Beside it, unmentioned, sits the little recorder you smuggled in.',
    left: { label: 'Keep the recording.', exit: 'kept_tape', lp: 8,
      text: 'You sign the buyout — and palm the recorder on the way out. They own your silence, not your memory, and not the little file backed up to three places. You’ll never air it. But on hard nights you play it back, just to know you weren’t crazy.' },
    right: { label: 'Hand it over. Walk clean.', exit: 'clean', lp: 4,
      text: 'You set the recorder on the envelope. The lawyer blinks, then nods with something like respect. Clean slate, both ways. You leave with the money and none of the weight. Whatever you build next, you build without the house in your head.' },
  },
};

// #region epilogue
// A vivid, genre-correct epilogue built from the run's own state — no music
// data lookups (which is exactly what crashed the shared epilogue on mystery).
function buildEpilogue(state: RunState): string {
  const rng = mulberry32((state.seed || 1) + (state.clues || 0) * 7 + 13);
  const path = state.path;
  const clues = state.clues || 0;
  const bits: string[] = [];
  if (path === 'sleuth') {
    bits.push(clues >= 7
      ? `You left with ${clues} clues and a theory that holds up under a rewatch.`
      : `You left with ${clues} clue${clues === 1 ? '' : 's'} — enough to be sure, not enough to prove.`);
    bits.push('The subreddit still argues about your board. You stopped reading it. Mostly.');
  } else if (path === 'darling') {
    bits.push(state.fame >= 80
      ? 'The follower count did not survive contact with real life, but the memory of being adored did.'
      : 'You were beloved for exactly as long as the edit allowed, which is its own kind of forever.');
    bits.push('Somewhere a teenager quotes your confessional back to you in an airport. You sign the boarding pass.');
  } else {
    bits.push((state.money || 0) >= 200
      ? 'You left richer than the winner and quieter than the runner-up, which was always the plan.'
      : 'The favors outlasted the cash; three former guests still owe you, and they know it.');
    bits.push('You do not do reality TV anymore. You produce it now. The house is yours.');
  }
  const rem = ['Nobody ever proved the thing about the pool house.',
    'The host still won’t say your name at reunions.',
    'The nemesis sends a card every year. You never open it.',
    'You kept the keycard. You’re not sure why.'];
  bits.push(rem[Math.floor(rng() * rem.length)]);
  return bits.join(' ');
}
// #endregion epilogue

// Tabloid trades + houseguest DMs for the act interstitial. Seeded, short,
// state-aware — the mystery analogue of the music headlines/inbox.
function headlines(state: RunState, seed: number) {
  const rng = mulberry32((state.seed || 1) + seed * 101);
  const pool = [
    { text: 'PRODUCERS DENY “SCRIPTED” CLAIMS AS RATINGS SOAR', src: 'Reality Weekly' },
    { text: 'WHO IS THE MYSTERY GUEST? THE HOUSE DIVIDES', src: 'The Confessional' },
    { text: 'ALLIANCE COLLAPSES ON LIVE FEED, FANS FEAST', src: 'Streaming Tea' },
    { text: 'HOST’S EYEBROW “DID MORE ACTING THAN THE CAST”', src: 'Screen Snark' },
    { text: `SUSPICION AT AN ALL-TIME HIGH IN THE VILLA`, src: 'The Daily Vote' },
  ];
  const n = 1 + Math.floor(rng() * 2);
  const out = [];
  const bag = [...pool];
  for (let i = 0; i < n && bag.length; i++) out.push(bag.splice(Math.floor(rng() * bag.length), 1)[0]);
  return out;
}

function dms(state: RunState, seed: number) {
  const rng = mulberry32((state.seed || 1) + seed * 57 + 9);
  const pool = [
    { from: 'A Houseguest', text: 'we need to talk before the next vote. NOT on camera.' },
    { from: 'Production', text: 'reminder: confessional at 6. wear the blue. it reads “trustworthy.”' },
    { from: 'The Nemesis', text: 'cute little theory. wrong, but cute.' },
    { from: 'Your Ally', text: 'i covered for you. you owe me and you know it.' },
    { from: 'Unknown', text: 'stop looking into the pool house.' },
  ];
  const n = 1 + Math.floor(rng() * 2);
  const out = [];
  const bag = [...pool];
  for (let i = 0; i < n && bag.length; i++) out.push(bag.splice(Math.floor(rng() * bag.length), 1)[0]);
  return out;
}

// The mystery genre has no discography (no songs subsystem).
function discography(_state: RunState) { return []; }

// A modest, in-genre trophy set (checked against the run summary, same contract
// as the music trophies). Enough to make the trophy room feel like this game.
const TROPHIES: any[] = [
  { id: 'm_first', cat: 'career', name: 'Cast Member', icon: '🎬',
    desc: 'Finish a season. The reunion special awaits.', check: () => true },
  { id: 'm_sleuth', cat: 'endings', name: 'Named the Killer', icon: '🔍',
    desc: 'Win as The Sleuth. You solved it on live TV.',
    check: (s: any) => s.path === 'sleuth' && s.result === 'success' },
  { id: 'm_darling', cat: 'endings', name: 'America’s Darling', icon: '💅',
    desc: 'Win as The Darling. Impossible to root against.',
    check: (s: any) => s.path === 'darling' && s.result === 'success' },
  { id: 'm_fixer', cat: 'endings', name: 'Ran the House', icon: '🎩',
    desc: 'Win as The Fixer. You never needed a single vote.',
    check: (s: any) => s.path === 'fixer' && s.result === 'success' },
  { id: 'm_unmasked', cat: 'endings', name: 'Medically Withdrawn', icon: '🕵️',
    desc: 'Let suspicion consume you completely.',
    check: (s: any) => s.endingKey === 'burnout' },
  { id: 'm_voted', cat: 'endings', name: 'Voted Off', icon: '🚪',
    desc: 'Get walked to the dock at sunrise.',
    check: (s: any) => s.endingKey === 'cancelled' },
  { id: 'm_partial', cat: 'endings', name: 'So Close', icon: '🥈',
    desc: 'Reach a Partial ending. One clue, one vote, one beat short.',
    check: (s: any) => s.result === 'partial' },
  { id: 'm_zen', cat: 'feats', name: 'Ice Cold', icon: '🧊',
    desc: 'Reach the finale with Suspicion under 20. Unnervingly calm.',
    check: (s: any) => s.result !== null && s.burnout < 20 },
];

export const mysteryPresenter: Presenter = {
  endings: ENDINGS,
  exitInterviews: EXIT_INTERVIEWS,
  wallItems: [],
  trophies: TROPHIES,
  epilogue: buildEpilogue,
  headlines,
  dms,
  discography,
};
