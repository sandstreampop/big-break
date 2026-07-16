// The Love Island pack's Presenter: the genre's UI-facing flavor. Endings,
// exit interviews, the tabloids (headlines), your phone after the villa (dms),
// the epilogue, and the generic UI hooks the shell feature-detects (title,
// HUD counters, act names, the Final, token filling, the three-tier authority
// styling). All copy obeys VOICE.md; the shell renders music defaults for any
// hook a pack omits.

import { castById, islanderTypeById, ISLANDER_TYPES } from './cast.js';
import { mateFor, bombshellFor, exFor } from './roles.js';
import { angleById } from './angles.js';
import { FACTIONS, movePublicFactional } from './plugins/factions.js';
import { PATHS } from './manifest.js';
import { intelCount } from './plugins/gossip.js';
import { stirlingDealNote } from './plugins/stirling.js';
import { villaStage, villaResultStage, villaRecap, villaSetPiece, villaEndingPortraits, villaRoster } from './clarity.js';
import { villaCardCast } from './cardcast.js';
import { villaFeeds } from './feeds.js';
import { PORTRAIT_VARIANTS } from './portraits.data.js';
import { mulberry32 } from '../../engine.js';
import { CONFIG } from '../../config.js';
import type { Presenter, RunState } from '../../types.js';

// ---------- Endings ----------

const ENDINGS = {
  winvilla: {
    success: {
      title: 'WINNERS',
      art: 'li_end_win',
      text: 'The Host opens the envelope like it’s fragile. It isn’t; you are. Your names, the confetti cannons, a cheque the size of a door — and the two of you doing the thing where you look at each other instead of the camera. Fifty grand, split with feeling. The nation chose. It chose you.',
    },
    partial: {
      title: 'The People’s Runners-Up',
      art: 'li_end_win_partial',
      text: 'Second. SECOND. The winners are lovely, which makes it worse. You give the gracious clap, and the gracious clap goes mildly viral, and by the reunion everyone agrees you were robbed. “Robbed” is a lovely word to build a following on. The villa crowned someone else; the group chats crowned you.',
    },
    failure: {
      title: 'Dumped Adjacent To Glory',
      art: 'li_end_win_fail',
      text: 'The Final happened around you, like weather. You stood in the fairy lights, close enough to the cheque to read the font, while the nation texted someone else’s name. On the flight home the cabin crew recognises you — “you’re the one who—” Yes. You’re the one who. It’s a start.',
    },
  },
  realthing: {
    success: {
      title: 'THE REAL THING',
      art: 'li_end_real',
      text: 'You didn’t win. Doesn’t matter. Three months later there’s a toothbrush situation, a shared calendar, and a dog you’re “just fostering” with a name and a wardrobe. The show wanted a couple; you left with a person. At the reunion they ask the trick question and you both answer it the same way, without rehearsing. The audience makes the sound. You don’t even hear it.',
    },
    partial: {
      title: 'Long Distance, Short Notice',
      art: 'li_end_real_partial',
      text: 'It was real in there. Out here it’s trains, time zones, and a shared calendar that keeps proposing “next weekend?” to two people who mean it. You’re still trying, which is more than most seasons manage. The villa was a bubble, but the bubble taught you what you’re actually looking for. That’s not nothing. That’s nearly everything.',
    },
    failure: {
      title: 'It Was What It Was',
      art: 'li_end_real_fail',
      text: 'The statement goes out on a Tuesday: “grown apart, nothing but love, please respect.” Drafted in the notes app, screenshot slightly crooked, like the law requires. You came for the real thing and left with a tan, a catchphrase, and a very specific opinion about duvets. The heart wants what it wants. Apparently it wants to be single by September.',
    },
  },
  brand: {
    success: {
      title: 'THE BRAND',
      art: 'li_end_brand',
      text: 'You didn’t need the envelope; you were the storyline. Six figures of followers, a management team with a lanyard for you, and a launch — teeth, gym, or drink, the details are under embargo. At the reunion the Host introduces you by your catchphrase and the audience finishes it. The villa was one bedroom in a house you now own. Metaphorically. For now.',
    },
    partial: {
      title: 'Micro-Influencer (Macro Attitude)',
      art: 'li_end_brand_partial',
      text: 'The following is real, if niche. You do a solid line in sponsored content for products you mostly believe in, and one regional nightclub appearance a month where they play your entrance music and you point at people. It isn’t the empire. It’s the market stall the empire starts from, and you know exactly which aisle you’re taking next.',
    },
    failure: {
      title: 'Memoirs Of A Background Islander',
      art: 'li_end_brand_fail',
      text: 'The clout didn’t convert. The follower graph did one heroic spike — the pie thing — and then the long, gentle glide of a paper plane. Your podcast lasted four episodes, three of them about the villa, one of them about the podcast. But you’ve still got the number of everyone who mattered, and notoriety, like sunburn, fades slower than you’d think.',
    },
  },
  // Fail states
  burnout: {
    title: 'You Walked',
    art: 'li_end_walk',
    text: 'It wasn’t one thing. It was the cameras, the recouplings, the 4 a.m. spiral doing laps with a megaphone. You packed in daylight, hugged everyone twice, and told the Beach Hut, “I need to protect my energy” — and for once in this villa, somebody said the true thing. The taxi gate closes gently. Outside: your own phone, your own bed, a sky with no drones. The nation, surprising itself, mostly writes: fair play.',
  },
  dumped: {
    title: 'Dumped From The Island',
    art: 'li_end_dumped',
    text: 'The suitcase wheels on the gravel, the goodbye montage, the sting of your best moments scored to tasteful piano. Dumped — by the vote, by the ceremony, by the machinery of a show that needs a body a week. In the car they hand you your phone and it’s already warm with notifications. The villa forgets in a day. The internet, for better and worse, does not.',
  },
};

// ---------- Exit interviews (one last choice inside a fail state) ----------

const EXIT_INTERVIEWS = {
  burnout: {
    context: 'The exit interview, by the taxi gate',
    prompt: 'One last producer, one last camera, one last question: “Any regrets?” Behind the wall, the villa is already loud again. Someone is laughing at a joke that used to be yours.',
    left: {
      label: '“No. It just wasn’t my place.”', exit: 'peace', lp: 8,
      text: 'You say it calmly, and mean it, and the clip airs uncut: the rare Islander who left on their own terms. Months later, people stop you in shops to say your exit made them feel better about quitting things. You never once check the vote you’d have got. Well. Once.',
    },
    right: {
      label: '“Ask me at the reunion.”', exit: 'cliffhanger', lp: 4,
      text: 'You leave a loose thread on purpose, and the internet pulls it for weeks. The reunion invite arrives with a car and a warning. You spend the wait writing the answer — the real one — and deciding, night by night, how much of it to say on air.',
    },
  },
  dumped: {
    context: 'The car, the gravel, your phone returned',
    prompt: 'The driver checks the mirror. “So — do we go quiet, or do we go loud? Airport’s got press at arrivals. Back exit’s got nobody.” Your phone buzzes against your leg like a small animal. The choice is the whole next year.',
    left: {
      label: 'Front door. Press line.', exit: 'loud', lp: 8,
      text: 'You walk the arrivals line like it’s a runway you booked. Every question gets a quote, every camera gets the good side, and by morning your exit is the story of the week. Dumped from an island; landed on your feet, in departures, trending.',
    },
    right: {
      label: 'Back exit. Go home.', exit: 'quiet', lp: 4,
      text: 'You take the quiet door, and your mum’s in the car park with the good crisps and no questions. The internet speculates for a week about your “silence.” The silence is a sofa, a duvet, and your own name slowly returning to you. You post one photo, eventually: the dog. It does numbers.',
    },
  },
};

// ---------- Trophies ----------

const TROPHIES = [
  { id: 'li_first_season', cat: 'career', name: 'Cast', icon: '🌴',
    desc: 'Finish a Season. The villa keeps a towel with your name on it. It does not.',
    check: () => true },
  { id: 'li_win_winvilla', cat: 'endings', name: 'The Envelope', icon: '👑',
    desc: 'Win the Villa. Fifty grand, split with feeling.',
    check: (s: any) => s.path === 'winvilla' && s.result === 'success' },
  { id: 'li_win_realthing', cat: 'endings', name: 'A Toothbrush Situation', icon: '💘',
    desc: 'Leave with the Real Thing. The prize was optional. Allegedly.',
    check: (s: any) => s.path === 'realthing' && s.result === 'success' },
  { id: 'li_win_brand', cat: 'endings', name: 'Link In Bio', icon: '📱',
    desc: 'Build the Brand. The villa was one bedroom in a house you now own.',
    check: (s: any) => s.path === 'brand' && s.result === 'success' },
  { id: 'li_walked', cat: 'endings', name: 'Protected Your Energy', icon: '🚕',
    desc: 'Walk from the villa. The rare exit on your own terms.',
    check: (s: any) => s.endingKey === 'burnout' },
  { id: 'li_dumped', cat: 'endings', name: 'A Body A Week', icon: '🧳',
    desc: 'Get dumped from the Island. The machinery needed feeding.',
    check: (s: any) => s.endingKey === 'dumped' },
  { id: 'li_exclusive_win', cat: 'feats', name: 'Closed Off', icon: '🔒',
    desc: 'Win any Summit while exclusive. The fall-height was worth it.',
    check: (s: any) => s.result === 'success' && s.exclusive },
  { id: 'li_loyal_casa', cat: 'feats', name: 'Annoyingly Solid', icon: '🧱',
    desc: 'Stay loyal through Casa Amor. Boring is underrated. Boring survives.',
    check: (s: any) => (s.flags || []).includes('li_loyal_casa') },
  { id: 'li_betrayed_survivor', cat: 'feats', name: 'Prime Time', icon: '📺',
    desc: 'Get betrayed at Casa Amor and still reach the Final. Being wronged is content.',
    check: (s: any) => (s.flags || []).includes('li_betrayed') && s.result != null },
  { id: 'li_villain_win', cat: 'feats', secret: true, name: 'Booing Is Engagement', icon: '😈',
    desc: 'Win any Summit wearing The Villain angle. They kept watching, didn’t they.',
    check: (s: any) => s.result === 'success' && (s.angles || []).includes('angle_villain') },
  { id: 'li_followers_60', cat: 'feats', name: 'Ring Light Ready', icon: '💡',
    desc: 'End a Season with 60+ Followers. The brands can hear your pen from here.',
    check: (s: any) => (s.followers || 0) >= 60 },
  { id: 'li_bond_80', cat: 'feats', name: 'Disgustingly Happy', icon: '🥂',
    desc: 'End a Season with a Connection of 80+. The other couples are pretending to be pleased.',
    check: (s: any) => (s.bond || 0) >= 80 },
  // ---- R8/C3c: trophy mass — the state was already tracked; now it pays ----
  { id: 'li_bestie_pact', cat: 'feats', name: 'The Two-Person Institution', icon: '🍦',
    desc: 'Form the ride-or-die. The tub was binding.',
    check: (s: any) => (s.flags || []).includes('li_bestie') },
  { id: 'li_cashout', cat: 'feats', name: 'Exact Change', icon: '💥',
    desc: 'Detonate a secret at a ceremony. Said sentences don’t come back.',
    check: (s: any) => (s.flags || []).includes('li_secret_detonated') },
  { id: 'li_dealer', cat: 'feats', name: 'The Lending Library', icon: '📚',
    desc: 'Deploy intel twice in one Season. Words, becoming results.',
    check: (s: any) => (s.intelDeployed || 0) >= 2 },
  { id: 'li_serial', cat: 'feats', name: 'A Type, Apparently', icon: '🔁',
    desc: 'Three different Partners in one Season. The villa updates its spreadsheets.',
    check: (s: any) => (s.exes || []).length >= 2 && s.partner },
  { id: 'li_clean_reel', cat: 'feats', name: 'Nothing To Screen', icon: '🧼',
    desc: 'Reach the Final with a clean reel — no kisses, no confessions, no footage. Movie Night hates you.',
    check: (s: any) => s.result != null && !['li_casa_kiss', 'li_head_turned', 'li_strayed_official', 'li_came_clean', 'li_revealed'].some((f: string) => (s.flags || []).includes(f)) },
  { id: 'li_squeaky', cat: 'feats', name: 'Squeaky Bum Season', icon: '🌀',
    desc: 'Touch a 75+ wobble and still reach the Final. The Hut remembers.',
    check: (s: any) => s.result != null && (s.wobbles || []).some((w: string) => w === 'li_wobble_75' || w === 'li_wobble_break') },
  { id: 'li_dynamite_hold', cat: 'feats', secret: true, name: 'Sat On Dynamite', icon: '🧨',
    desc: 'Reach the Final still holding an unspent secret. Granite nerves or a soft heart — the booth can’t tell.',
    check: (s: any) => s.result != null && (s.secretsKnown || []).length > 0 && !s.secretDetonated },
  { id: 'li_coven', cat: 'feats', name: 'The Coven', icon: '🕯️',
    desc: 'Honour the code all Season and break it never. Blocs form quietly.',
    check: (s: any) => s.result != null && (s.flags || []).includes('li_code_honour') && !(s.flags || []).includes('li_code_broke') },
  { id: 'li_open_water', cat: 'feats', name: 'Options Open', icon: '🌊',
    desc: 'Reach the Final never having gone exclusive. The options heard you.',
    check: (s: any) => s.result != null && !s.exclusive },
  { id: 'li_casa_stray', cat: 'feats', name: 'What Happens At Casa', icon: '🧳',
    desc: 'Come back from Casa Amor with someone new. Bold television.',
    check: (s: any) => s.casaOutcome === 'recoupled' },
  { id: 'li_gauntlet_done', cat: 'career', name: 'Format Veteran', icon: '📆',
    desc: 'Finish a Gauntlet Season. Same seed, same chaos, all skill. Mostly.',
    check: (s: any) => s.gauntlet != null },
  { id: 'li_daily_done', cat: 'career', name: 'Appointment Viewing', icon: '📅',
    desc: 'Finish a Daily Villa. Same Season as everyone — the swipes were yours.',
    check: (s: any) => s.daily != null },
  { id: 'li_streak_3', cat: 'career', name: 'The Habit', icon: '🔥',
    desc: 'A three-day Daily Villa streak. The villa opens at midnight; so, apparently, do you.',
    check: (s: any) => (s.dailyStreak || 0) >= 3 },
  { id: 'li_nation_darling', cat: 'feats', name: 'The Nation’s Sweetheart', icon: '🗳️',
    desc: 'End a Season with 85+ Public. The mugs are being printed.',
    check: (s: any) => (s.public || 0) >= 85 },
  { id: 'li_booth_25', cat: 'feats', name: 'The Booth’s Favourite', icon: '🎙️',
    desc: 'Hear 25 different lines from the booth in one Season. He’s allowed favourites; sue him.',
    check: (s: any) => (s.stirling || []).length >= 25 },
  { id: 'li_second_wave_final', cat: 'feats', secret: true, name: 'The Sequel Villain', icon: '🌊',
    desc: 'Watch a second-wave Rival step up — and reach the Final anyway.',
    check: (s: any) => s.result != null && (s.flags || []).includes('li_done_wave') },
  { id: 'li_redemption', cat: 'endings', secret: true, name: 'The Redemption Arc', icon: '🦅',
    desc: 'Win any Summit on a redemption Season. The nation loves a sequel.',
    check: (s: any) => s.result === 'success' && (s.flags || []).includes('li_comeback') },
  { id: 'li_bombshell_win', cat: 'endings', secret: true, name: 'The Scheduled Explosion', icon: '💣',
    desc: 'Win any Summit as The Bombshell. You happened to a whole villa.',
    check: (s: any) => s.result === 'success' && String(s.loadout || '').startsWith('bombshell_') },
];

// ---------- Token filling ----------

function fillTokens(state: RunState, s: string): string {
  if (!s) return s;
  const partner = castById(state.partner);
  const rival = castById(state.rival);
  const ex = exFor(state);
  return s
    .replaceAll('{partner}', partner?.name || 'your partner')
    .replaceAll('{rival}', rival?.name || 'your rival')
    .replaceAll('{ex}', ex?.name || 'your ex')
    .replaceAll('{mate}', mateFor(state)?.name || 'your best mate in here')
    .replaceAll('{bombshell}', bombshellFor(state)?.name || 'the bombshell');
}

// ---------- The tabloids (headlines) ----------

const SOURCES = ['The Daily Blush', 'GossipHive', 'VillaVine', 'The Morning Sofa', 'OK Then! Magazine'];

function headlines(state: RunState, seed: number) {
  const rng = mulberry32(((state.flavorSeed || 1) * 31 + seed * 7) >>> 0 || 1);
  const partner = castById(state.partner)?.name;
  const rival = castById(state.rival)?.name || 'a co-star';
  const pool: string[] = [];
  if (partner) {
    pool.push(
      `Body-language expert reviews ${partner} and the newcomer: “someone is lying, possibly me”`,
      `“They argue about the duvet like a married couple” — villa source on the season’s quiet favourites`,
      `${partner}’s nan “not having any of it,” reports the nan’s neighbour`,
    );
  } else {
    pool.push(
      'The single one is “doing great actually,” says the single one',
      'Villa insiders report a suspicious amount of daybed brooding',
    );
  }
  pool.push(
    `${rival} “knows things,” hints ${rival}, knowing one thing`,
    'Public vote “volatile,” says pollster who also does elections and prefers this',
    'ANALYSIS: what the Mini Milk really meant',
    'Challenge injury update: dignity still in intensive care',
    'Producers deny villa is “just a very slow Hunger Games” for fourth consecutive year',
  );
  if ((state.flags || []).includes('li_casa_kiss')) pool.push('LEAKED: Casa footage exists and it is “spicy, at minimum” — a producer, gleeful');
  if ((state.flags || []).includes('li_betrayed')) pool.push('The nation adopts betrayed Islander; paperwork pending');
  if ((state.flags || []).includes('li_code_broke')) pool.push('“Girl code is dead,” declares girl who killed it');
  if (state.exclusive) pool.push('EXCLUSIVE on the exclusive: they’re exclusive');
  const out: { text: string; src: string }[] = [];
  const bag = [...pool];
  const n = Math.min(2, bag.length);
  for (let i = 0; i < n; i++) {
    const t = bag.splice(Math.floor(rng() * bag.length), 1)[0];
    out.push({ text: t, src: SOURCES[Math.floor(rng() * SOURCES.length)] });
  }
  return out;
}

// ---------- Your phone, meanwhile (dms) ----------

function dms(state: RunState, seed: number) {
  const rng = mulberry32(((state.flavorSeed || 1) * 17 + seed * 13) >>> 0 || 1);
  const partner = castById(state.partner)?.name || 'them';
  const pool: { from: string; text: string }[] = [
    { from: 'Mum', text: 'Everyone at work is watching you. Sandra says hello. WHY were you on the daybed with that one, we raised you better. Proud of you. Eat something green.' },
    { from: 'The Group Chat (muted)', text: '847 unread. The last visible message is just your name and eleven crying-laughing faces.' },
    { from: 'Gym Marco', text: 'bro. BRO. you’re on the telly in the gym. everyone stopped lifting. legs day is cancelled in your honour' },
    { from: 'Landlord', text: 'Saw you on TV. Rent is still due on the 1st. Congrats though.' },
    { from: 'Blocked Number', text: 'so you’ll do all THAT on television but you couldn’t text me back in March?' },
  ];
  if ((state.followers || 0) >= 30) pool.push({ from: 'BrightSmile Whitening', text: 'Hi babe!! LOVE your energy this season. Quick one — how would you feel about teeth?' });
  if (state.exclusive) pool.push({ from: 'Auntie Carol', text: `EXCLUSIVE?! I’ve told the whole street. If ${partner} hurts you I know a woman in Wrexham.` });
  if ((state.flags || []).includes('li_betrayed')) pool.push({ from: 'Mum', text: 'I never liked them. I said it from day one. Sandra has it in writing.' });
  const out: { from: string; text: string }[] = [];
  const bag = [...pool];
  const n = Math.min(2, bag.length);
  for (let i = 0; i < n; i++) out.push(bag.splice(Math.floor(rng() * bag.length), 1)[0]);
  return out;
}

// ---------- Epilogue ----------

function epilogue(state: RunState): string {
  const partner = castById(state.partner)?.name;
  const ending = state.ending || {};
  const bits: string[] = [];
  if (ending.key === 'realthing' && ending.result === 'success' && partner) {
    bits.push(`Three months on: you and ${partner} have a flat viewing, a shared Spotify account with one ongoing dispute, and a rule about never watching the show back. You broke the rule once. Together. It was fine, actually.`);
  } else if (ending.result === 'success') {
    bits.push('Three months on: the airport still recognises you, the reunion went two drinks past wise, and your Season is the one the next cast gets shown as a warning. As legacies go, you’ll take it.');
  } else if (ending.key === 'burnout') {
    bits.push('Three months on: your phone stays on silent, your mornings are your own, and when the new Season starts you watch one episode, feel nothing but relief, and go outside.');
  } else if (ending.key === 'dumped') {
    bits.push('Three months on: the exit interview follow-up did better numbers than your entrance ever did. The villa needed a body; you made it a launchpad. Ish.');
  } else {
    bits.push('Three months on: the tan faded, the group chat renamed itself twice, and somewhere in a drawer there’s a water bottle with your name on it. You did a Season. Not every story needs an envelope.');
  }
  if ((state.flags || []).includes('li_bestie') && (ending.key === 'dumped' || ending.key === 'burnout')) {
    const mate = castById(state.bestie)?.name || 'your best mate in there';
    bits.push(`${mate} texts you every episode night: “it’s worse without you.” It is, slightly. You watch anyway — together, apart.`);
  }
  if ((state.exes || []).length >= 2) bits.push(`Your exes have a group chat. You are its subject and its glue.`);
  if ((state.accessories || []).includes('angle_villain')) bits.push('The villain edit follows you into brand meetings. You’ve stopped correcting it. It negotiates better rates.');
  return bits.join(' ');
}

// ---------- The Final (the last-night choice screen) ----------

function finalSet(state: RunState) {
  const partner = castById(state.partner)?.name || 'your partner';
  // The speech works the WHOLE nation (ADR-0012): +4 to every faction, which
  // is +4 Public — and, if a wing was wavering at a threshold, real Surge.
  // The Surge preview is computed exactly (the closer readout must be honest).
  const SPEECH = 4;
  const after = (['romantics', 'selfrespect', 'drama'] as const)
    .map((k) => Math.max(0, (state[k] ?? 0) + SPEECH));
  const surgeAfter = Math.max(0, after.filter((v) => v >= FACTIONS.warmAt).length -
    after.filter((v) => v < FACTIONS.coldAt).length);
  const surgeDelta = surgeAfter - (state.surge ?? 0);
  const options: any[] = [
    {
      title: 'The declaration',
      blurb: `Stand up at the fire and say what ${partner} actually is to you. No hashtag. No net.`,
      stat: 'bond', amount: 6, label: '+6 Connection',
      apply: (s: RunState) => { if (s.partner) s.bond = Math.min(100, (s.bond || 0) + 6); },
    },
    {
      title: 'The speech to the nation',
      blurb: 'Thirty seconds, straight down the lens, to every sofa in the country — the soft hearts, the spines, and the popcorn.',
      stat: 'surge', amount: surgeDelta, label: `+${SPEECH} across the nation`,
      apply: (s: RunState) => { movePublicFactional(s, SPEECH); },
    },
    {
      title: 'The reunion tease',
      blurb: 'One perfectly cut soundbite for the after-show. The Season ends; the brand begins.',
      stat: 'followers', amount: 6, label: '+6 Followers',
      apply: (s: RunState) => { s.followers = (s.followers || 0) + 6; },
    },
  ];
  return {
    head: 'The Final',
    sub: 'Last night in the villa — the public vote peaks and your Intention gets judged after this. One last move before the envelope.',
    options,
  };
}

// ---------- HUD counters ----------

// The scoreboard row. The PEOPLE moved off these chips and onto the stage
// (the Clarity Layer's persistent relationship stage — clarity.ts); what's
// left up here is the show's actual scoreboard: vote, following, capital,
// held intel, and a banked moment.
function hudCounters(state: RunState) {
  const out: { html: string; cls?: string }[] = [];
  if ((state.encore || 0) > 0) out.push({ html: `🌟${state.encore > 1 ? '×' + state.encore : ''}`, cls: 'hud-encore' });
  const held = intelCount(state);
  if (held) out.push({ html: `🤫 ${held}`, cls: 'hud-rel' });
  out.push({ html: `🗳️ ${state.public ?? 0}`, cls: 'hud-fame' });
  out.push({ html: `📱 ${state.followers ?? 0}`, cls: 'hud-fame' });
  out.push({ html: `💪 ${state.graft ?? 0}`, cls: 'hud-money' });
  return out;
}

// ---------- Assembled presenter ----------

export const loveIslandPresenter: Presenter = {
  endings: ENDINGS,
  exitInterviews: EXIT_INTERVIEWS,
  trophies: TROPHIES,
  epilogue,
  headlines,
  dms,
  failLabels: { burnout: 'WALKED', dumped: 'DUMPED' },
  offerAllLoadouts: true,
  // Gender is mechanical here (ADR-0003): it sets the pool you couple from and
  // your side of every recoupling. The shell asks for it between the name and
  // the personality pick, and loadoutPool narrows the Types to that gender — so
  // the persona pick IS the Type, gender already chosen.
  genderOptions: [
    { id: 'girl', label: 'Girl', icon: '♀' },
    { id: 'boy', label: 'Boy', icon: '♂' },
  ],
  // The personalities available for the chosen gender (empty until it's picked,
  // which keeps the order name → gender → personality). Each id is a Type×gender
  // persona; coupling.onConstruct reads the gender back off the suffix.
  loadoutPool: (m: any, sel: any) => sel?.gender
    ? ISLANDER_TYPES.filter((t) => t.gender === sel.gender && (t.unlockedByDefault || t.unlockedBy?.(m))).map((t) => t.id)
    : [],
  // ADR-0009: the villa runs the compact HUD — one ambient strip, the full
  // picture one tap away. The scene takes space first.
  compactHud: true,

  title: {
    logo: 'THE<br>VILLA',
    taglines: [
      'One Season. Three ways to win. A nation with its thumb on the button.',
      'Couple up, crack on, and try to leave with more than a personalised water bottle.',
      'The prize is £50k, love, or a following. Pick one at the Crossroads. Survive the rest.',
      'Somewhere between the firepit and the daybed, there is a boy named Kai.',
      'It’s not a game. It’s three games, and everyone is losing at least one.',
      'The cameras are always on. Especially the ones you forgot about.',
      'Day one: everyone’s here for the right reasons. Day nine: a row about the wobbly lounger.',
    ],
    glyphs: ['💘', '🌴', '☀️', '💋', '🍸'],
    foot: (meta: any) => `Seasons: ${meta.runs} · Best: ${meta.best?.lp || 0} LP · Legacy: ${meta.lpEarnedTotal} LP`,
    news: (dayNum: number) => {
      const pool = [
        { text: 'Villa refurbished “for legal reasons,” says show', src: 'The Morning Sofa' },
        { text: 'Nation urged to hydrate ahead of tonight’s recoupling', src: 'GossipHive' },
        { text: 'Study: 9 in 10 Islanders “here for the right reasons,” 10 in 10 lying', src: 'VillaVine' },
        { text: 'The firepit has been lit since March. Nobody knows how to turn it off', src: 'The Daily Blush' },
      ];
      return pool[dayNum % pool.length];
    },
  },

  // v4 S2 (ADR-0011): the season is SIX WEEKS; the HUD counts them in the
  // villa's own word. Each week is named for the tentpole it builds to.
  actWord: 'WEEK',
  actNames: ['', 'Arrival', 'The Graft', 'Casa Amor', 'Movie Night', 'The Recoupling', 'Final Week'],
  // Fallback week intros (the recap — clarity.ts villaRecap — normally
  // replaces these; they render only if it ever returns null).
  actIntro: {
    2: { name: 'THE GRAFT', text: 'Week two. The couples stop auditioning and start existing — coffees get memorised, favours get banked. At the end of the week: a challenge, and then the Crossroads.' },
    3: { name: 'CASA AMOR', text: 'Week three. It’s quiet. It’s lovely. It ends with a text, a suitcase, and six strangers unpacking aftershave. Nothing survives this week unchanged.' },
    4: { name: 'MOVIE NIGHT', text: 'Week four. The fallout settles, new alliances form — and at the end of it, production presses play on everything the cameras saw. Footage outranks feelings.' },
    5: { name: 'THE RECOUPLING', text: 'Week five. One more bombshell, one more recalculation, and a firepit ceremony where the girls hold the pen. The week ends with everyone standing up.' },
    6: { name: 'FINAL WEEK', text: 'Families, final dates, and a public vote climbing like a fever. The envelope is printed. Your name is on it, or it isn’t.' },
  },
  crossroads: {
    head: 'The Crossroads',
    sub: 'Arrival is over. Time to declare your Intention — why you’re really here. The Season leans toward your Summit from now on, and the Final judges you against it. No refunds. The bars show how your Season lines up right now.',
  },
  twistNote: (delta: number) => delta < 0
    ? `✂️ Production is trimming the schedule — this stretch runs ${-delta} days SHORT. Make them count.`
    : `➕ The villa’s doing numbers — this stretch runs ${delta} days LONG. Pace yourself.`,

  hudCounters,
  itemById: angleById,
  // Equip an Angle into the run's Edit slots. The shell's gear-slot result
  // flow calls THIS (never a pack import), so a pack without it renders the
  // "🧰 it's yours" notice while equipping nothing — the sim/browser
  // divergence of INCIDENTS #2. Same semantics as music's equipAccessory:
  // drop first, respect the slot cap, push. Angles carry no onAcquire
  // payload, so there are no extra deltas to return.
  equipItem: (state: any, id: string, dropId?: string) => {
    if (dropId) state.accessories = (state.accessories || []).filter((a: string) => a !== dropId);
    state.accessories = state.accessories || [];
    if (state.accessories.length >= CONFIG.accessorySlots) return [];
    if (!state.accessories.includes(id)) state.accessories.push(id);
    return [];
  },
  fillTokens,
  cardClass: (ev: any) => (ev.tags || []).includes('host') ? 'card-host'
    : (ev.tags || []).includes('text') ? 'card-text'
    : (ev.tags || []).includes('encounter') ? 'card-encounter' : null,
  // Stirling's deal-time channel: the ceremony forecast, the verdict explain,
  // the scene stamps (ADR-0008). Pure — see stirlingDealNote.
  overlayNote: stirlingDealNote,
  // The Clarity Layer (v3): the persistent relationship stage, the after-swipe
  // result beat, the "previously, in the villa" act recap, and set-piece
  // framing for ceremonies/Casa/Movie Night. All pure reads — clarity.ts.
  stage: villaStage,
  // The people in this scene, on the dealt card (presenter.cardCast): portraits
  // during the decision, read from the card's own tokens + web-thread tag.
  cardCast: villaCardCast,
  resultStage: villaResultStage,
  recap: villaRecap,
  // The act-break flavour fold's label (the shell's default is neutral —
  // this line was hard-coded in the shell until the odyssey recap shipped).
  recapFold: '📰 Meanwhile, outside the villa…',
  setPiece: villaSetPiece,
  // The finale's reacting faces (who you leave beside / behind) and the
  // browsable "Meet the Cast" roster off the title screen — both pure reads.
  endingPortraits: villaEndingPortraits,
  roster: villaRoster,
  // ADR-0014 — the second screen: the nation's five feeds at every pivotal
  // moment. Pure read of state; the shell renders the teaser + browser.
  feeds: villaFeeds,
  vibe: (state: RunState) => ({ scale: state.public ?? 0, glow: state.stats?.charisma ?? 0, heat: state.stats?.burnout ?? 0 }),

  tutorial: {
    offer: '▶ Play — Your First Morning',
    skip: 'Skip it — I know the format',
    replay: '🎓 Replay the first morning',
    hud: 'THE FIRST MORNING · day one',
    end: {
      verdict: 'FIRST NIGHT SURVIVED',
      title: 'Welcome to the Villa',
      art: 'li_arrival',
      text: 'One morning, one text, one firepit — and nobody’s gone home yet. That was the rehearsal. Six weeks start tomorrow, and the villa will explain the rest as it happens: recouplings, a bombshell or two, a cinema screen with your name on it, a nation holding the remote. Sleep while you can.',
      // Teach-by-doing (FTUE): recap only the three things the morning actually
      // taught — the gesture, the tell, the head — then hand over the ONE hook
      // that gives the Season a shape (the three summits). Everything else
      // (recouplings, Casa, Movie Night, texts) the player meets in fiction,
      // with Stirling narrating it live on the first Season (his tutor pool).
      lessons: [
        { cls: 'notice-gear', html: '👆 <b>One swipe, one decision.</b> Drag left or right, or tap a button. That’s the whole villa.' },
        { cls: 'notice-gear', html: '😏 <b>Read the tell before you commit.</b> The icons are the stats a choice leans on; the shape is the risk — ● safe · ▲ dicey · ■ likely bad · ✦ big upside. And a bad card stings; it doesn’t send you home.' },
        { cls: 'notice-bad', html: '🌀 <b>In Your Head</b> climbs on drama and ends your Season at the top — Final Week’s line is lower still. A quiet day is a move, not a wasted turn.' },
        { cls: 'notice-good', html: '🏆 <b>Three ways to leave a winner:</b> the £50k envelope, the real thing, or a following. You pick which one at the Crossroads — and the nation votes the whole way there.' },
      ],
      next: '▶ Start your Season',
      lpNote: '+15 Legacy Points — banked for the Career Wall, where LP widens who and what the villa deals you.',
    },
  },

  encore: {
    ready: '🌟 Main-character moment banked — spend it for a boosted roll',
    armed: '🌟 MOMENT ARMED — this one’s going in the promo',
  },

  statInfo: {
    rizz: 'One-on-one romantic pull. Feeds <b>Win the Villa</b> and every flirt, date, and head-turn.',
    loyalty: 'Being genuine — the anti-game stat. Feeds <b>The Real Thing</b> and holds your Connection together.',
    savvy: 'Villa game-sense: strategy, recouplings, reading the lawn. Keeps you alive when you’re the chosen, not the chooser.',
    charisma: 'On-camera magnetism. Feeds <b>The Brand</b> and turns villa moments into screen time.',
    burnout: 'The spiral meter. Drama, betrayal, and grafting too hard push it up; at 100 you walk out of the villa in tears — and once Final Week starts, 79 is the line. Rest is a real move.',
  },
  helpBlocks: [
    '<b>Swipe</b> left or right on every villa moment. The stats on each choice tilt the roll.',
    '🗳️ <b>Public</b> is the nation’s vote — and the nation is THREE audiences that want opposite things: 🌹 <b>Romantics</b> (stick together, forgive), 💅 <b>Self-Respect</b> (backbone, never be a doormat), 🍿 <b>Drama-lovers</b> (chaos, scenes, a villain to adopt). The same move pleases one wing and annoys another; Public is their average, and at the Final a vote <b>surge</b> only comes when ALL THREE are onside.',
    '📱 <b>Followers</b> build <b>The Brand</b>. 💘 <b>Connection</b> is your couple’s strength — <b>The Real Thing</b> runs on it, and it RESETS when you switch partners. 📖 <b>Win the Villa</b> also wants a STORY: survive an ick, repair a betrayal, get rescued at a firepit — the nation crowns an arc, never a cruise.',
    '💪 <b>Graft</b> is banked social capital — spend it on the daybed to buy an <b>Angle</b> (the reputation you’re building). Angles boost matching choices; fragile ones fall off on a botched scene.',
    '🌀 <b>In Your Head</b> drags every roll down and ends your Season at 100 — you walk. In <b>Final Week</b> the line drops to 79: arrive loud and you’re gone. Beach Hut time and rest bring it back.',
    '📜 <b>Recouplings</b>: when your gender chooses, you have the power. When the other gender chooses, you survive on Connection OR Public — fail both and you’re dumped.',
    '🌟 An INCREDIBLE moment banks a <b>main-character moment</b> — arm it later to boost the swipe that matters.',
  ],

  finalSet,

  // The share card (R6): a spoiler-safe season in one paste — the swipe
  // grid, couples formed, secrets held, days survived, and (daily) the
  // streak. Names and cards stay out of it; "did YOUR partner stray?" is
  // the group chat's job.
  shareText: (summary: any, lp: number) => {
    const t = islanderTypeById(summary.loadout);
    const head = summary.gauntlet ? `THE VILLA Gauntlet ${summary.gauntlet}`
      : summary.daily ? `THE VILLA Daily ${summary.daily}` : 'THE VILLA';
    const pathName = summary.path ? PATHS[summary.path].name : 'no Intention declared';
    const res = summary.result ? summary.result.toUpperCase()
      : summary.endingKey === 'burnout' ? 'WALKED' : summary.endingKey === 'dumped' ? 'DUMPED' : 'GAME OVER';
    const TIER_EMOJI: Record<string, string> = { bad: '🟥', good: '🟩', incredible: '🟪', declined: '🟨' };
    const line = (summary.tierLog || []).map((x: string) => TIER_EMOJI[x] || '⬜').join('');
    const couples = (summary.exes?.length || 0) + (summary.partner ? 1 : 0);
    const bits = [
      `💘 ${couples} couple${couples === 1 ? '' : 's'}${summary.exclusive ? ' 🔒' : ''}`,
      ...(summary.secretsKnown?.length ? [`🤫 ${summary.secretsKnown.length}`] : []),
      `🌴 ${(summary.cardLog || []).length} days`,
      ...(summary.dailyStreak > 1 ? [`🔥 streak ${summary.dailyStreak}`] : []),
    ];
    return `${head}\n${t ? t.name : '?'} → ${pathName} → ${res}\n${line}\n${bits.join(' · ')} · +${lp} LP\nhttps://sandstreampop.github.io/big-break/love-island/`;
  },

  // The redemption season (R8/C2b): comeback mode in villa clothes.
  loadoutPicker: { head: 'Choose your player', sub: 'Who are you, when the cameras are always on?', empty: 'Pick your player to start' },

  comeback: {
    label: '🧳 The Redemption Season (×1.2 LP)',
    head: 'The Redemption Season',
    sub: 'You’ve been here before. It ended badly, publicly, and with a suitcase. Come back notorious: the nation remembers you, the Villain edit is pre-installed, and your Rival has receipts. Sequels hit harder.',
  },

  // The Daily Villa (R6): one shared seeded Season a day — same bombshells,
  // same secrets, everyone. The end note closes the loop.
  daily: {
    name: 'The Daily Villa',
    endNote: (summary: any) => {
      const n = summary.dailyStreak || 1;
      const streak = n > 1 ? `Day ${n} of your streak.` : 'Streak: day one.';
      return `🌴 That was today’s villa — everyone on Earth got the same Season: same bombshells, same secrets, same wobbly lounger. ${streak} Tomorrow’s villa opens at midnight. Compare notes; the share button keeps the spoilers out.`;
    },
  },
  // The weekly gauntlet (C2a): the shared-seed ritual, switched on.
  gauntlet: true,

  // Art slots: emoji badge + which generated scene each villa moment paints.
  // Registered generically at boot (art.registerArt) — art.ts stays genre-free.
  art: {
    li_arrival: { e: '🌴', s: 'festival' },
    li_terrace: { e: '🍸', s: 'home' },
    li_pool: { e: '🏊', s: 'festival' },
    li_kitchen: { e: '🫖', s: 'home' },
    li_lawn: { e: '☀️', s: 'festival' },
    li_bedroom: { e: '🛏️', s: 'home' },
    li_daybed: { e: '🕶️', s: 'home' },
    li_hideaway: { e: '🕯️', s: 'home' },
    li_beach: { e: '🌊', s: 'festival' },
    li_beachhut: { e: '🎥', s: 'office' },
    li_challenge: { e: '🎪', s: 'festival' },
    li_firepit: { e: '🔥', s: 'stage' },
    li_firepit_day: { e: '🪵', s: 'stage' },
    li_phone: { e: '📱', s: 'phone' },
    li_casa_text: { e: '🧳', s: 'phone' },
    li_casa_night: { e: '🌙', s: 'home' },
    li_casa_postcard: { e: '📮', s: 'phone' },
    li_casa_return: { e: '🚪', s: 'stage' },
    li_casa_held: { e: '🤝', s: 'stage' },
    li_casa_betrayed: { e: '💔', s: 'crisis' },
    li_movienight: { e: '🎬', s: 'arena' },
    li_bombshell: { e: '💣', s: 'festival' },
    li_bombshell_steal: { e: '⚡', s: 'stage' },
    li_dumped: { e: '🧳', s: 'crisis' },
    li_parents: { e: '👵', s: 'home' },
    li_final: { e: '👑', s: 'arena' },
    li_type_retriever: { e: '🐶', s: 'pedestal' },
    li_type_gameplayer: { e: '♟️', s: 'pedestal' },
    li_type_influencer: { e: '💍', s: 'pedestal' },
    li_type_heartthrob: { e: '😏', s: 'pedestal' },
    li_type_bombshell: { e: '💣', s: 'pedestal' },
    li_angle_loyal: { e: '🧱', s: 'pedestal' },
    li_angle_villain: { e: '😈', s: 'pedestal' },
    li_angle_comedy: { e: '🃏', s: 'pedestal' },
    li_angle_type: { e: '💘', s: 'pedestal' },
    li_angle_camera: { e: '📸', s: 'pedestal' },
    li_angle_strategist: { e: '🗺️', s: 'pedestal' },
    li_end_win: { e: '👑', s: 'arena' },
    li_end_win_partial: { e: '🥈', s: 'arena' },
    li_end_win_fail: { e: '✈️', s: 'crisis' },
    li_end_real: { e: '🐕', s: 'home' },
    li_end_real_partial: { e: '🚆', s: 'street' },
    li_end_real_fail: { e: '📝', s: 'phone' },
    li_end_brand: { e: '💼', s: 'arena' },
    li_end_brand_partial: { e: '🛍️', s: 'shop' },
    li_end_brand_fail: { e: '🎙️', s: 'phone' },
    li_end_walk: { e: '🚕', s: 'street' },
    li_end_dumped: { e: '🧳', s: 'crisis' },
  },

  // Responsive variant sets for the cast portraits, joined to the shell's
  // <picture> layer at boot (js/ui.ts). Generated by tools/gen-li-art.mjs --wire
  // via the preprocessing engine; a face chip fetches a tiny AVIF instead of the
  // 1024² master. Empty when no portraits are wired (emoji-only fallback).
  imageVariants: PORTRAIT_VARIANTS,

  // The villa's own telemetry taxonomy (Epic 5). The shell owns the neutral
  // spine and flattens `summarize` (partner/bond/gender/rival/casaOutcome…); this
  // adds the props NOT in summarize — the persona at start, and the public-facing
  // meters at end. The villa no longer reports music's instrument/genre/venue.
  runProps: (state, moment) => {
    if (moment === 'start') {
      return { persona: state.loadout, gender: state.gender || 'none' };
    }
    return {
      persona: state.loadout,
      followers: state.followers ?? 0,
      public_vote: state.public ?? 0,
    };
  },
};
