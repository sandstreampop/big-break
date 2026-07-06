// The Second Screen (ADR-0014): the nation gets feeds.
//
// The contestants can't read any of this — their phones are in a drawer in the
// Beach Hut. The PLAYER can. At every pivotal villa moment the shell asks this
// module for the outside world's reaction, and we hand back five community
// feeds, each a parody of a real platform's REGISTER (never a demographic —
// ADR-0012's settlement holds): the bird app, the forum, the mums' group, the
// grid, and the clock app. Reading them is how the player gauges public
// standing, because each channel WEARS a wing of the factional public
// (ADR-0012) or a resource — the numbers show up as mood, volume, and which
// posts surface. A channel whose wing is lost sours before the vote card says
// so; the feeds are an honest instrument.
//
// Voice: VOICE.md's v4-S4 addendum. Every post body is a SINCERE quoted mouth
// (Islander-argot rule, one platform over): the community's real dialect turned
// up a notch, true to life, never the Narrator's wit. The Narrator only speaks
// in the teaser line. Post bodies are therefore cliché-exempt and bang-exempt
// (loud platforms shout); the chrome (teasers, handles) keeps the house rules.
//
// PURITY (the presenter contract, like clarity.ts): a pure read of state. We
// derive our own RNG from flavorSeed + the run's own ledger — NEVER the play
// RNG — so sims never touch this, sims never render, and the golden corpus does
// not move. Same moment → same feed, every render.

import type { RunState, GameEvent, FeedBundle, FeedChannel, FeedPost, FeedMoment, Tier, Side } from '../../types.js';
import { FACTION_KEYS, factionTier, type FactionTier } from './plugins/factions.js';
import { mulberry32 } from '../../engine.js';

// ---------- Seeded, play-RNG-free entropy ----------

// A deterministic generator keyed to the run's identity, the moment, and how
// far the season has run — stable across re-renders, independent of the play
// seed. `salt` separates channels/pools so they don't move in lockstep.
function feedRng(state: RunState, salt: number): () => number {
  const flavor = (state.flavorSeed || 1) >>> 0;
  const played = (state.cardLog?.length || 0) >>> 0;
  const seed = (((flavor * 2654435761) ^ (salt * 40503) ^ (played * 2246822519)) >>> 0) || 1;
  return mulberry32(seed);
}
function pick<T>(rng: () => number, arr: T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}
function sample<T>(rng: () => number, arr: T[], n: number): T[] {
  const bag = arr.slice();
  const out: T[] = [];
  for (let i = 0; i < n && bag.length; i++) out.push(bag.splice(Math.floor(rng() * bag.length), 1)[0]);
  return out;
}
// A believable engagement tally, deterministic, scaled by reach.
function tally(rng: () => number, base: number): string {
  const n = Math.max(1, Math.floor(base * (0.6 + rng() * 1.1)));
  if (n >= 1000) return (n / 1000).toFixed(n >= 10000 ? 0 : 1).replace(/\.0$/, '') + 'k';
  return String(n);
}

// ---------- The player, as each community imagines them ----------

// The Type the player is running (retriever / gameplayer / influencer /
// heartthrob / bombshell), stripped of gender — the public reads a vibe, not a
// persona id.
function playerType(state: RunState): string {
  const id = String(state.loadout || '');
  return id.split('_')[0] || 'retriever';
}
// Every community coins its OWN nickname for you off your Type and keeps the
// bill running (VOICE.md: coin once per channel, call back). The disagreement
// about who you are IS the instrument.
const NICKNAMES: Record<string, Record<string, string>> = {
  bird: {
    retriever: 'the golden retriever',
    gameplayer: 'the operator',
    influencer: 'the ring light',
    heartthrob: 'the terms and conditions',
    bombshell: 'the incident',
  },
  forum: {
    retriever: 'OP’s cinnamon roll',
    gameplayer: 'the strategist (derogatory)',
    influencer: 'the brand ambassador',
    heartthrob: 'the walking red flag',
    bombshell: 'the plot device',
  },
  mums: {
    retriever: 'that lovely one',
    gameplayer: 'the clever one bless them',
    influencer: 'the glamorous one',
    heartthrob: 'the handsome trouble',
    bombshell: 'the newcomer (ooh)',
  },
  grid: {
    retriever: 'our sweetheart',
    gameplayer: 'the mastermind 🧠',
    influencer: 'mother',
    heartthrob: 'the CEO of eye contact',
    bombshell: 'the main event',
  },
  clock: {
    retriever: 'the puppy',
    gameplayer: 'the chess player',
    influencer: 'the vlog',
    heartthrob: 'the situationship starter pack',
    bombshell: 'the reason i’m awake',
  },
};
function nick(state: RunState, channel: string): string {
  return NICKNAMES[channel]?.[playerType(state)] || 'them';
}

// ---------- Which wing each channel wears ----------

// A community's temperature is read from a wing of the nation (ADR-0012) or a
// resource, so the feed IS the meter. The grid reads reach; the clock app reads
// the whole nation's aggregate.
type Mood = 'devoted' | 'onside' | 'unconvinced' | 'lost';
function factionMood(state: RunState, key: string): Mood {
  return factionTier(state[key] ?? 0) as FactionTier as Mood;
}
function reachMood(state: RunState): Mood {
  const f = state.followers ?? 0;
  return f >= 75 ? 'devoted' : f >= 45 ? 'onside' : f >= 20 ? 'unconvinced' : 'lost';
}
function nationMood(state: RunState): Mood {
  return (state.public ?? 0) >= 60 ? 'devoted' : (state.public ?? 0) >= 42 ? 'onside'
    : (state.public ?? 0) >= 25 ? 'unconvinced' : 'lost';
}
const CHANNEL_MOOD: Record<string, (s: RunState) => Mood> = {
  bird: (s) => factionMood(s, 'drama'),
  forum: (s) => factionMood(s, 'selfrespect'),
  mums: (s) => factionMood(s, 'romantics'),
  grid: reachMood,
  clock: nationMood,
};

// ---------- Moment classification ----------

// The pivotal-moment grammar, mirroring the set-piece families (ADR-0009 v3.2)
// so the outside world reacts to exactly the moments the villa stops for.
// Ambient cards return null → no feeds, and the contrast is load-bearing.
type Family =
  | 'arrival' | 'bombshell' | 'date' | 'challenge' | 'rival' | 'temptation'
  | 'casa' | 'postcard' | 'movienight' | 'recoupling' | 'dumping' | 'vote'
  | 'hut' | 'parents' | 'ick' | 'repair' | 'final' | 'recap' | 'ending';

function familyOfCard(ev: GameEvent): Family | null {
  const id = ev.id || '';
  const tags = ev.tags || [];
  if (id === 'li_arrival' || id === 'li_arrival_bomb' || id === 'li_return_clocked') return 'arrival';
  if (id.startsWith('li_bomb') || id === 'li_second_wave' || id === 'li_ex_arrives') return 'bombshell';
  if (id === 'li_recoup_dumped' || id === 'li_casa_betrayed') return 'dumping';
  if (id.startsWith('li_recoup')) return 'recoupling';
  if (id.startsWith('li_casa_postcard')) return 'postcard';
  if (id.startsWith('li_casa')) return 'casa';
  if (id.startsWith('li_movienight')) return 'movienight';
  if (id.startsWith('li_ick_')) return 'ick';
  if (id.startsWith('li_repair_')) return 'repair';
  if (id.startsWith('li_tempt')) return 'temptation';
  if (id.startsWith('li_enc_rival') || id.startsWith('li_enc_rmove') || id === 'li_web_tri_showdown') return 'rival';
  if (id === 'li_parents' || id === 'li_parents_messy') return 'parents';
  if (id.startsWith('li_hut') || id.startsWith('li_wobble')) return 'hut';
  if (id === 'li_code_vote_honour' || id === 'li_code_vote_broke' || id === 'li_nation_poll') return 'vote';
  if (ev.finaleCard || id.startsWith('li_final')) return 'final';
  if (id === 'li_first_date' || id === 'li_beach_date' || id === 'li_hideaway_key' || id.startsWith('li_enc_partner')) return 'date';
  if (tags.includes('challenge')) return 'challenge';
  // The nation cards and couple-web showdowns are always worth a feed.
  if (id.startsWith('li_nation_') || id.startsWith('li_web_')) return 'rival';
  return null;
}

// Good / bad / mixed — the base valence from the outcome tier. Families that
// are intrinsically a disaster or a triumph override in the generator.
type Valence = 'good' | 'bad' | 'mid';
function valenceOf(tier: Tier | 'declined'): Valence {
  if (tier === 'incredible' || tier === 'good') return 'good';
  if (tier === 'bad' || tier === 'declined') return 'bad';
  return 'mid';
}

// ---------- The content corpus ----------
//
// A post fragment: everything but the deterministic tally is authored. The
// generator fills {tokens} at render (via the presenter's fillTokens) and coins
// the per-channel nickname with {me}.
interface Frag { author: string; avatar?: string; body: string; meta?: string; pinned?: boolean; replies?: { author: string; avatar?: string; body: string }[]; }

// Channel chrome: the tab, the skin, the header line pools.
const CHANNELS: { id: string; name: string; icon: string; skin: string; handle: string; headers: string[] }[] = [
  {
    id: 'bird', name: 'the bird app', icon: '🐦', skin: 'feed-bird', handle: '#TheVilla · trending',
    headers: ['#TheVilla is trending · 1 hr', '#TheVilla · 44.2k posts', 'Trending in Television · #TheVilla'],
  },
  {
    id: 'forum', name: 'the forum', icon: '👽', skin: 'feed-forum', handle: 'v/TheVilla · 2.1M members',
    headers: ['v/TheVilla · Posted by a mod', 'v/TheVilla · 🔥 Hot', 'v/TheVilla · Rising'],
  },
  {
    id: 'mums', name: 'Villa Mums & More ❤️', icon: '☕', skin: 'feed-mums', handle: 'Private group · 214k members',
    headers: ['Villa Mums & More ❤️ · No spoilers before 10pm please ❤️ Admin', 'Villa Mums & More ❤️ · Be kind we are all mums here', 'Villa Mums & More ❤️ · Sandra has turned OFF notifications again'],
  },
  {
    id: 'grid', name: 'the grid', icon: '📸', skin: 'feed-grid', handle: '@thevilla · official',
    headers: ['@thevilla · official account', '@thevilla · posted 12m ago', '@thevilla · tap to view comments'],
  },
  {
    id: 'clock', name: 'the clock app', icon: '⏰', skin: 'feed-clock', handle: 'comments · 3:47 AM',
    headers: ['comments · sorted by: unhinged', 'comments · 3:47 AM · why am i awake', 'comments · liked by creator'],
  },
];

// Wing-mood pools: the STANDING colour, applied on every moment regardless of
// family, so a lost wing reads hostile even at a triumph (the honest
// instrument). Keyed [channel][mood].
const WING_MOOD: Record<string, Record<Mood, Frag[]>> = {
  bird: {
    devoted: [
      { author: 'chaos gremlin 🍿', avatar: '😈', body: 'i would die for {me} and i have known them for one (1) week. this is normal. everyone calm down', replies: [{ author: 'reply guy', avatar: '💬', body: 'week and a half actually. get it right' }] },
      { author: 'ratio enthusiast', avatar: '🔥', body: 'the way {me} runs this villa without a security deposit. drama landlord. paying rent to watch this' },
      { author: 'the main account', avatar: '🐦', body: '{me} could commit a crime on live television and i would say “ok but the LIGHTING.” i am not a serious person and neither are they' },
      { author: 'quote-tweet queen', avatar: '🐦', body: 'putting {me} in my bio. blocking anyone who disagrees. this is a {me} account now. unfollow if you must' },
    ],
    onside: [
      { author: 'sofa correspondent', avatar: '📺', body: 'ok {me} is actually giving me something to post about. keep it up. my engagement thanks you' },
      { author: 'the timeline', avatar: '🐦', body: 'not the best telly of the night but {me} is doing numbers. i respect a worker' },
      { author: 'mildly invested', avatar: '🐦', body: 'said i wasn’t watching this season. it is 9pm. i am watching this season. this is {me}’s fault specifically' },
    ],
    unconvinced: [
      { author: 'bored in HD', avatar: '🥱', body: 'if {me} doesn’t cause a SCENE soon i’m switching to the other channel. i pay my licence fee for CHAOS' },
      { author: 'take merchant', avatar: '🐦', body: 'controversial but {me} is a bit of a beige flag rn. bring back the villain edit' },
      { author: 'the group chat leak', avatar: '🐦', body: '{me} is nice. NICE. do you know what nice does on this show. nothing. nice does NOTHING. i’m begging for a flaw' },
    ],
    lost: [
      { author: 'unbothered', avatar: '💤', body: '{me} is who exactly. i genuinely could not pick them out of a lineup. NEXT' },
      { author: 'the algorithm', avatar: '🐦', body: 'the fact that {me} thinks they’re a main character. babe you’re a b-plot at BEST' },
      { author: 'ex-fan', avatar: '🐦', body: 'i used to defend {me}. i will not be doing that anymore. the receipts are in the quote tweets. i’m tired' },
    ],
  },
  forum: {
    devoted: [
      { author: 'u/methodical_viewer', avatar: '👽', body: '[ANALYSIS] {me} is playing this with a spine and it shows. Made a spreadsheet. They’re the only one being honest with themselves.', meta: '↑ 4.1k · 320 comments', replies: [{ author: 'u/lurker_no_more', avatar: '👽', body: 'commenting so I can find this thread later. the spreadsheet is real, folks' }] },
      { author: 'u/receipts_folder', avatar: '📁', body: 'Unpopular opinion (it is not unpopular): {me} is the only person in that villa I would trust to hold my coat.', meta: '↑ 2.9k' },
      { author: 'u/longtime_lurker', avatar: '👽', body: '[APPRECIATION] Been watching this show for eleven seasons. {me} is doing something genuinely rare: being consistent. That’s it. That’s the post. EDIT: RIP my inbox.', meta: '↑ 3.4k · 190 comments' },
    ],
    onside: [
      { author: 'u/cautiously_optimistic', avatar: '👽', body: 'Rewatched the clip three times. {me} is doing fine, actually. I’ll allow it. EDIT: to the person in my DMs — no.', meta: '↑ 1.2k · 88 comments' },
      { author: 'u/devils_advocate_pro', avatar: '👽', body: 'Hot take that will get me downvoted: {me} is fine. Not a saint, not a villain. A person. On a dating show. Revolutionary, I know.', meta: '↑ 640 · 220 comments' },
    ],
    unconvinced: [
      { author: 'u/where_is_the_backbone', avatar: '🧍', body: '[DISCUSSION] Timeline of {me}’s decisions, sourced. I am not saying they have no spine. I am saying show me the spine.', meta: '↑ 890 · 210 comments' },
      { author: 'u/second_opinion', avatar: '👽', body: 'Genuine question, no hate: what is {me} actually doing in there. Like the strategy. I’ve made a flowchart and it just loops.', meta: '↑ 720 · 140 comments' },
    ],
    lost: [
      { author: 'u/mod_TheVilla', avatar: '🛡️', body: 'Locking the {me} megathread. We have discussed the doormat behaviour extensively and civilly and I need to sleep. EDIT: spelling.', meta: '📌 pinned by moderators' },
      { author: 'u/no_more_excuses', avatar: '👽', body: 'At what point do we admit {me} has no self-respect. Genuine question. With sources.', meta: '↑ 3.3k · 540 comments', replies: [{ author: 'u/mod_TheVilla', avatar: '🛡️', body: 'Keep it civil. This is a warning. (I agree but keep it civil.)' }] },
      { author: 'u/i_called_it', avatar: '👽', body: 'Reposting my week-2 thread where I predicted {me} would fold. Nobody upvoted it then. Where is everybody NOW.', meta: '↑ 1.5k · 300 comments' },
    ],
  },
  mums: {
    devoted: [
      { author: 'Sandra', avatar: '👩', body: 'I don’t care what the young ones on the other apps say {me} is a GOOD EGG and reminds me of our Gemma ❤️❤️ leave them ALONE' },
      { author: 'Denise (Admin)', avatar: '🧑‍🦱', body: 'Just want to say {me} has lovely manners and that is a REFLECTION OF THE PARENTS. Well done to the mum 👏👏' },
      { author: 'Jacqui 🌸', avatar: '👩', body: 'Ooh I do like {me}. Reminds me of my Craig at that age, before the divorce obviously. GOOD LUCK to them ❤️❤️❤️' },
      { author: 'Sandra', avatar: '👩', body: 'Have just voted for {me} on the app. Took me forty minutes. My grandson showed me. Lovely boy. Anyway VOTE for {me} ❤️📱' },
    ],
    onside: [
      { author: 'Pam', avatar: '👵', body: 'Aww {me} is doing their best bless them. We were all young once. Ish. 🙏' },
      { author: 'Denise (Admin)', avatar: '🧑‍🦱', body: 'Whoever is doing the subtitles is doing a smashing job. Oh and {me} was lovely tonight too ❤️ Right, bed. Night girls x' },
    ],
    unconvinced: [
      { author: 'Carol xx', avatar: '👩', body: 'Now I like {me} BUT and I say this with love… I don’t know what they’re playing at. Someone tell them. Gently. ❤️' },
      { author: 'Pam', avatar: '👵', body: 'I’m worried about {me}. Not angry. Worried. It’s different. My daughter says I do this with the telly. She’s not wrong 😔❤️' },
    ],
    lost: [
      { author: 'Sandra', avatar: '👩', body: 'Sorry but {me} needs to have a WORD with themselves. I have muted this season TWICE. This is my final warning to a person who cannot hear me 😤' },
      { author: 'Denise (Admin)', avatar: '🧑‍🦱', body: 'REMINDER we are KIND in this group even about {me}. That said. No. ❤️' },
      { author: 'Carol xx', avatar: '👩', body: 'I have UNFOLLOWED {me} on the Instagram. It won’t do anything they’ll never know but I feel BETTER. Who’s having a wine 🍷😤' },
    ],
  },
  grid: {
    devoted: [
      { author: '@villa.edits.daily', avatar: '🎬', body: 'the way {me} carried this ENTIRE episode on their back 😭😭 edit dropping at midnight, do NOT let this flop', meta: '💬 view all 4,102 comments', replies: [{ author: '@notif.gang', avatar: '🔔', body: 'first 🫶 obsessed w this account' }] },
      { author: '@brightsmile.official', avatar: '🦷', body: 'obsessed with {me} 😍 (dm us babe we sell teeth)', meta: '💬 view all 2,204 comments' },
      { author: '@thevillafancam', avatar: '🎥', body: '{me} 🩷 that’s it that’s the comment. 4k slow-mo in the highlights. protect at all costs 😤🫶', meta: '💬 view all 3,050 comments' },
      { author: '@glowdrink_energy', avatar: '🥤', body: 'the ALGORITHM brought us here and we’re staying 😍 {me} we’d love to send you something (link in bio) 💌', meta: '💬 view all 1,410 comments' },
    ],
    onside: [
      { author: '@casualfan_22', avatar: '💗', body: 'not me getting invested in {me} 🫠 anyway who else is watching', meta: '💬 view all 900 comments' },
      { author: '@sofasunday', avatar: '🛋️', body: 'ok {me} is growing on me 🌱 like a fungus but the cute kind. following for the arc', meta: '💬 view all 540 comments' },
    ],
    unconvinced: [
      { author: '@justhereforthedrama', avatar: '🍸', body: 'is {me} gonna do something this episode or 🧍‍♀️ asking for the group chat', meta: '💬 view all 611 comments' },
      { author: '@petty.betty', avatar: '💅', body: 'the caption said “iconic” about {me} and i had to sit down. we are NOT watching the same show 😭', meta: '💬 view all 480 comments' },
    ],
    lost: [
      { author: '@scrolling.past', avatar: '📱', body: 'who is {me}. why are they on my feed. the algorithm is WRONG today', meta: '💬 view all 120 comments' },
      { author: '@unfollowing.rn', avatar: '👋', body: 'muting the {me} tag until further notice 🧘‍♀️ my peace is worth more than this arc', meta: '💬 view all 96 comments' },
    ],
  },
  clock: {
    devoted: [
      { author: 'pinned by creator', avatar: '📌', body: 'part 47 of me explaining {me}’s whole arc to my nan like it’s the six o’clock news. she’s invested now. we both are', pinned: true, replies: [{ author: 'nan (probably)', avatar: '👵', body: 'she showed me. i have opinions now. team {me}.' }] },
      { author: 'up all night', avatar: '🌙', body: 'no bc {me} lives in my head rent-paid. they pay ON TIME. model tenant' },
      { author: 'delulu defender', avatar: '💫', body: 'people saying {me} isn’t that deep. it’s 3am and to ME they are the deepest thing that has ever happened. respectfully log off' },
    ],
    onside: [
      { author: '3am thoughts', avatar: '🌙', body: 'ok but {me} kind of ate. lowercase. i’m tired. goodnight to {me} specifically' },
      { author: 'fyp resident', avatar: '📲', body: 'the {me} edits are getting better than the actual show. anyway. one more. then bed. (this is a lie)' },
    ],
    unconvinced: [
      { author: 'doomscroller', avatar: '🌀', body: '{me} i am BEGGING you to give me a reason to stay up. it is late. i have work. do something' },
      { author: 'sleepy but here', avatar: '🥱', body: 'not {me} being the reason i’m still awake AND not even doing anything. the disrespect. the loyalty. i contain multitudes' },
    ],
    lost: [
      { author: 'closing the app', avatar: '💤', body: 'watching {me} do absolutely nothing is not the serve they think it is. logging off. (i will not log off)' },
      { author: 'former stan', avatar: '🥀', body: 'took {me} off my fyp with my own two thumbs. it’s what growth looks like. i’m so brave. anyway what are they doing rn' },
    ],
  },
};

// Family pools: the SPECIFIC reactions, the funniest content, keyed
// [family][channel][valence]. Not every family fills every cell — the wing-mood
// and nickname layers keep any thin moment full, and the generator always
// yields five populated channels.
const FAMILY: Partial<Record<Family, Partial<Record<string, Partial<Record<Valence, Frag[]>>>>>> = {
  arrival: {
    bird: {
      good: [{ author: 'day one truther', avatar: '🐦', body: 'they’ve been on screen 90 seconds and i’ve already picked a side, built a fancam in my head, and pre-ordered the breakup' }],
      mid: [{ author: 'first impressions inc', avatar: '🐦', body: 'new cast dropped. i have decided their entire personalities based on how they walked down the stairs. this is journalism' }],
      bad: [{ author: 'harsh but fair', avatar: '🐦', body: 'the intro VT told us their job, their star sign, and their ick and STILL i felt nothing. rough start for {me}' }],
    },
    forum: {
      good: [{ author: 'u/season_opener', avatar: '👽', body: '[DISCUSSION] Day One casting breakdown (long). Early read: {me} is the one with an actual personality. Cautiously bookmarking.', meta: '↑ 1.4k · 260 comments' }],
      mid: [{ author: 'u/pattern_noticer', avatar: '👽', body: 'Every season opens the same way and every season I make this thread anyway. Ranking the launch coupling by likely half-life.', meta: '↑ 980' }],
      bad: [{ author: 'u/first_impressions', avatar: '👽', body: 'Nobody panic but I have already written {me} off and it is day one. I will screenshot this and eat it later if I’m wrong. I am rarely wrong.', meta: '↑ 410 · 180 comments' }],
    },
    mums: {
      good: [{ author: 'Sandra', avatar: '👩', body: 'Oh they all look LOVELY this year. That {me} has a kind face. I’ve made a brew and cleared my evenings ❤️ GOODLUCK to them all' }],
      mid: [{ author: 'Pam', avatar: '👵', body: 'Which one is which. There’s too many. I’ve written the names on a bit of paper. Kyle? Is there a Kyle 🙏' }],
    },
    grid: {
      good: [{ author: '@thevilla', avatar: '🌴', body: 'they’re HERE. meet your Islanders 🌴☀️ who are we obsessed with already 👇', meta: '💬 view all 8,900 comments', replies: [{ author: '@front.row.fan', avatar: '💗', body: 'CLAIMING {me} in the comments. they’re mine now. sorry everyone' }] }],
      mid: [{ author: '@justhereforthedrama', avatar: '🍸', body: 'day one and the comments are already at WAR over {me} 🍿 we don’t even know them. never change', meta: '💬 view all 1,020 comments' }],
    },
    clock: {
      mid: [{ author: 'first night crew', avatar: '🌙', body: 'starting a new season is a commitment i did NOT consent to and yet here i am, 3am, learning {me}’s entire backstory' }],
      good: [{ author: 'day one delulu', avatar: '💫', body: 'called it on day one: {me} is my winner. screenshotting this. if i’m wrong i’ll delete it and we never speak of it again' }],
    },
  },
  bombshell: {
    bird: {
      good: [{ author: 'chaos gremlin 🍿', avatar: '😈', body: 'A BOMBSHELL. they’ve walked in holding a date card like it’s a WEAPON. six settled couples just felt a cold breeze. i am UP' }],
      mid: [{ author: 'the timeline', avatar: '🐦', body: 'new arrival detected. everyone’s partner is suddenly “just being friendly.” the villa smells like SPF and fear' }],
      bad: [{ author: 'take merchant', avatar: '🐦', body: 'they sent in a bombshell to save the season and the bombshell has the charisma of a car park. try again production' }],
    },
    forum: {
      good: [{ author: 'u/threat_assessment', avatar: '👽', body: '[DISCUSSION] Bombshell entry. Modelling the recoupling risk to {me}’s couple. Spoiler: it is non-zero and I am spiralling.', meta: '↑ 2.2k · 410 comments' }],
      mid: [{ author: 'u/here_we_go', avatar: '👽', body: 'Production noticed things were calm and did what production does. Predictable. Effective. I hate that it worked on me.', meta: '↑ 760' }],
    },
    mums: {
      good: [{ author: 'Carol xx', avatar: '👩', body: 'A NEW ONE?? at this hour?? {partner} you had BETTER hold onto {me}. I mean it. I have a bad feeling and my feelings are NEVER wrong ask my Kevin ❤️' }],
      bad: [{ author: 'Sandra', avatar: '👩', body: 'Who is this now. We were all settled. I don’t like change and I don’t like them. Sorry. Not sorry. 😤' }],
    },
    grid: {
      good: [{ author: '@villa.edits.daily', avatar: '🎬', body: 'BOMBSHELL WALK. slow-mo edit incoming. the way the whole lawn turned around 💀 rip to everyone’s coupling', meta: '💬 view all 3,301 comments' }],
      mid: [{ author: '@justhereforthedrama', avatar: '🍸', body: 'new bombshell just walked in and the comments have already drafted three love triangles and a spinoff 🍿 we are NOT normal', meta: '💬 view all 2,140 comments' }],
    },
    clock: {
      good: [{ author: 'up all night', avatar: '🌙', body: 'a bombshell entering while i’m half asleep is a personal attack on my sleep schedule and my emotional stability. thank you. more' }],
      bad: [{ author: 'doomscroller', avatar: '🌀', body: 'they sent in a bombshell to shake up {me}’s couple and the bombshell has done NOTHING. we were promised chaos. i want a refund and it’s 3am' }],
    },
  },
  date: {
    bird: {
      good: [{ author: 'soft launch police', avatar: '🐦', body: '{me} and {partner} on a date actually being NORMAL and cute?? in THIS villa?? suspicious. i give it till thursday but i’m smiling' }],
      bad: [{ author: 'awkward archive', avatar: '🐦', body: 'the SILENCE on {me}’s date. i have never heard a fountain so clearly. two people, one personality between them, and it was the fountain’s' }],
    },
    forum: {
      good: [{ author: 'u/body_language_dept', avatar: '👽', body: 'The mirrored posture on {me}’s date is textbook. As a person who has watched a lot of telly, that is real. I’ll die on this hill.', meta: '↑ 1.1k · 150 comments' }],
      bad: [{ author: 'u/second_opinion', avatar: '👽', body: 'The {me} date was two people describing their jobs at each other for eleven minutes. I timed it. I have the timestamps. Send help.', meta: '↑ 560 · 120 comments' }],
    },
    mums: {
      good: [{ author: 'Denise (Admin)', avatar: '🧑‍🦱', body: 'A LOVELY date. He made her a drink and pulled her chair out. THAT is how you were raised or you weren’t. {me} deserves this ❤️❤️🙏' }],
      bad: [{ author: 'Pam', avatar: '👵', body: 'Oh dear. That was hard to watch. My tea went cold. Someone give {me} a script bless them 😬' }],
    },
    grid: {
      good: [{ author: '@casualfan_22', avatar: '💗', body: 'the DATE 🥹 they’re actually so cute i can’t. protecting {me} and {partner} at all costs 🫶', meta: '💬 view all 1,808 comments' }],
      bad: [{ author: '@petty.betty', avatar: '💅', body: 'the second-hand embarrassment from {me}’s date 💀 i had to put my phone in another room. anyway swipe for the fit pics', meta: '💬 view all 720 comments' }],
    },
    clock: {
      good: [{ author: '3am thoughts', avatar: '🌙', body: 'rewatching the date. pausing on the bit where {partner} laughed. that’s it that’s the video. goodnight' }],
      bad: [{ author: 'doomscroller', avatar: '🌀', body: 'the {me} date gave me the ick THROUGH the screen and i wasn’t even on it. how is that possible. i need a lie down' }],
    },
  },
  challenge: {
    bird: {
      good: [{ author: 'ratio enthusiast', avatar: '🔥', body: 'the CHALLENGE. {me} understood the assignment and then some. someone’s partner is fuming in the background and i am ZOOMING IN' }],
      bad: [{ author: 'chaos gremlin 🍿', avatar: '😈', body: '{me} in that challenge. custard everywhere. dignity nowhere. THIS is what i pay for. frame it' }],
      mid: [{ author: 'the timeline', avatar: '🐦', body: 'challenge day = the one day the producers admit it’s a game show with feelings attached. love it here' }],
    },
    forum: {
      mid: [{ author: 'u/challenge_lore', avatar: '👽', body: '[EFFORTPOST] A history of this challenge across seasons, and what {me}’s answer reveals under game-theory. Yes I’m fun at parties.', meta: '↑ 1.3k · 90 comments' }],
      bad: [{ author: 'u/where_is_the_backbone', avatar: '🧍', body: 'The challenge literally hands you a microphone to say the thing and {me} said “no comment.” The one time. THE ONE TIME.', meta: '↑ 980 · 240 comments' }],
    },
    mums: {
      good: [
        { author: 'Sandra', avatar: '👩', body: 'That challenge had me CACKLING. {me} is a scream. Sent it to the WhatsApp. Barbara’s not watching this year and she is MISSING OUT 😂😂' },
        { author: 'Jacqui 🌸', avatar: '👩', body: 'The custard one 😂😂 I’ve not laughed like that since Denise fell in the paddling pool at the barbecue. {me} take a BOW ❤️' },
      ],
    },
    grid: {
      good: [{ author: '@villa.edits.daily', avatar: '🎬', body: 'the challenge clip is going VIRAL and rightly so 😭 {me} said the quiet part with their WHOLE chest. saving this forever', meta: '💬 view all 5,540 comments' }],
    },
    clock: {
      good: [{ author: 'creator', avatar: '⏰', body: 'the challenge did what the last three recouplings couldn’t: gave me a reason to live. {me} we are so back', pinned: true }],
      bad: [{ author: 'sleepy but here', avatar: '🥱', body: 'the challenge was RIGHT there and {me} played it safe. babe the point of the game is the game. i’m going to bed disappointed' }],
    },
  },
  rival: {
    bird: {
      good: [{ author: 'take merchant', avatar: '🐦', body: '{me} vs {rival} is the rivalry the season needed. one of them is lying and honestly? both. i’m team chaos, always' }],
      bad: [{ author: 'ratio enthusiast', avatar: '🔥', body: '{rival} just DISMANTLED {me} on the daybed and {me} said “it is what it is.” IT IS NOT WHAT IT IS. STAND UP' }],
    },
    forum: {
      good: [{ author: 'u/receipts_folder', avatar: '📁', body: '[TIMELINE] The {me} vs {rival} beef, sourced and timestamped. {rival} started it. I have screenshots I will not be sharing but trust me.', meta: '↑ 2.6k · 480 comments' }],
      bad: [{ author: 'u/where_is_the_backbone', avatar: '🧍', body: '{rival} is running circles around {me} and it’s painful. Assert yourself. This is a formal request from the forum.', meta: '↑ 1.4k' }],
    },
    mums: {
      bad: [{ author: 'Carol xx', avatar: '👩', body: 'That {rival} is a NASTY piece of work and I have said so from DAY ONE. You leave {me} ALONE. I know people. ❤️😤' }],
      good: [{ author: 'Sandra', avatar: '👩', body: 'Well {me} handled {rival} like a GROWN UP and that’s all I’ll say. Kill them with kindness. Or a nice casserole. Proud ❤️👏' }],
    },
    grid: {
      good: [{ author: '@justhereforthedrama', avatar: '🍸', body: 'the {me} x {rival} standoff had me GASPING 😮 not a single frame wasted. put them both on the reunion FRONT ROW', meta: '💬 view all 2,900 comments' }],
    },
    clock: {
      good: [{ author: 'doomscroller', avatar: '🌀', body: 'the villain arc between {me} and {rival} is writing itself and i’m taking notes for absolutely no reason. 4am. fine' }],
      bad: [{ author: 'sleepy but here', avatar: '🥱', body: 'not {rival} reading {me} for filth and {me} just… taking it. blink twice if you need help babe. i’m awake. i’ll help' }],
    },
  },
  temptation: {
    bird: {
      good: [{ author: 'chaos gremlin 🍿', avatar: '😈', body: '“can i steal you for a chat” THE VERB IS DOING WORK. {me} the whole nation is watching where your feet point. choose violence' }],
      bad: [{ author: 'the timeline', avatar: '🐦', body: '{me} said “i’m just being friendly” with the body language of someone being extremely un-friendly. we have EYES' }],
    },
    forum: {
      bad: [{ author: 'u/no_more_excuses', avatar: '👽', body: 'The “nothing happened” defence from {me}. Sir. Ma’am. There is footage. There is ALWAYS footage. EDIT 2: yes I’m being dramatic, it’s a dating show.', meta: '↑ 1.8k · 300 comments' }],
      good: [{ author: 'u/where_is_the_backbone', avatar: '🧍', body: 'Genuinely did not expect {me} to shut the temptation down that cleanly. Screenshotting for the day I inevitably eat my words. Today is not that day. Respect.', meta: '↑ 1.3k · 90 comments' }],
    },
    mums: {
      bad: [{ author: 'Sandra', avatar: '👩', body: 'I don’t LIKE where this is going. {me} think of {partner}. THINK OF THE NAN AT HOME. Do not do it. I am watching through my fingers 🙈🙏' }],
      good: [{ author: 'Pam', avatar: '👵', body: 'And {me} said NO THANK YOU to that temptation and my HEART. THAT is a keeper. {partner} you don’t know how lucky you are ❤️❤️' }],
    },
    grid: {
      good: [{ author: '@justhereforthedrama', avatar: '🍸', body: 'not the “stealing you for a chat” 💀💀 someone’s couple is OVER and they don’t know yet. comments are a warzone', meta: '💬 view all 3,100 comments' }],
    },
    clock: {
      mid: [{ author: 'up all night', avatar: '🌙', body: 'the tension. the whispering. the ONE candle. i am unwell about {me} and it is a school night' }],
    },
  },
  casa: {
    bird: {
      mid: [
        { author: 'the timeline', avatar: '🐦', body: 'CASA AMOR. the one week that ends careers. six new ones per villa and a postcode between {me} and {partner}. buckle UP everybody' },
        { author: 'ratio enthusiast', avatar: '🔥', body: 'casa amor is the only time production admits it’s a sociology experiment. {me} is the variable. {partner} is the control group. SCIENCE' },
      ],
      good: [{ author: 'ratio enthusiast', avatar: '🔥', body: '{me} at casa being solid and boring and LOYAL. boring? in THIS economy? i’m weirdly moved. keep it up you absolute rock' }],
      bad: [{ author: 'chaos gremlin 🍿', avatar: '😈', body: 'casa is testing {me} and {me} is FAILING upward into my heart. the audacity. the FOOTAGE. i’m screaming into a pillow' }],
    },
    forum: {
      good: [{ author: 'u/methodical_viewer', avatar: '👽', body: '[CASA WATCH] Loyalty tracker, updated hourly. {me} currently in the green. If this holds it’s a redemption-of-the-format moment.', meta: '↑ 3.7k · 620 comments' }],
      bad: [{ author: 'u/mod_TheVilla', avatar: '🛡️', body: 'Pinning the Casa megathread. Please keep the {me} discourse in ONE place. My inbox cannot survive another split like last year.', meta: '📌 pinned' }],
    },
    mums: {
      good: [{ author: 'Denise (Admin)', avatar: '🧑‍🦱', body: 'Casa Amor is the DEVIL’S work and I won’t hear otherwise. But our {me} is being GOOD. I could cry. Faith in the young ones RESTORED 🙏❤️' }],
      bad: [{ author: 'Sandra', avatar: '👩', body: 'CASA. I hate this week. I hate it. I have said a prayer for {partner} who does not know yet. The mums are NOT ok 😭😭' }],
    },
    grid: {
      mid: [{ author: '@thevilla', avatar: '🌴', body: 'the villa is splitting… 🧳 six new bombshells per side. whose head is turning? 👀 #CasaAmor', meta: '💬 view all 12,400 comments' }],
    },
    clock: {
      bad: [{ author: 'doomscroller', avatar: '🌀', body: 'casa amor is a psychological experiment and i am the lab rat. cannot sleep until i know if {me} held. it’s 4:12. send help' }],
    },
  },
  postcard: {
    bird: {
      bad: [{ author: 'chaos gremlin 🍿', avatar: '😈', body: 'THE POSTCARD. one photo, zero context, cropped by a producer who deserves a RAISE. {partner}’s face just did a thing. i rewound it nine times' }],
      good: [{ author: 'the timeline', avatar: '🐦', body: 'the postcard tried to frame {me} and the edit could NOT find anything. loyal king/queen behaviour. production is SEETHING' }],
    },
    forum: {
      bad: [{ author: 'u/receipts_folder', avatar: '📁', body: '[POSTCARD ANALYSIS] Frame-by-frame. What the crop is HIDING about {me}. I have thoughts and a zoom tool and no life.', meta: '↑ 2.1k · 380 comments', replies: [{ author: 'u/lurker_no_more', avatar: '👽', body: 'the enhance meme is real but so is the analysis. bookmarking' }] }],
      good: [{ author: 'u/methodical_viewer', avatar: '👽', body: 'The postcard tried to frame {me} and there was NOTHING to work with. Production is malding. A loyal frame in this economy. Rare footage.', meta: '↑ 1.8k · 210 comments' }],
    },
    mums: {
      bad: [{ author: 'Carol xx', avatar: '👩', body: 'That postcard is EDITED. It’s not what it looks like. My {me} would NEVER. I refuse. Sandra back me up. ❤️😤' }],
    },
    grid: {
      bad: [{ author: '@justhereforthedrama', avatar: '🍸', body: 'the POSTCARD 📮💀 the way {partner} clocked it across the pool. i felt that in my SPINE. comments are feral', meta: '💬 view all 4,020 comments' }],
    },
    clock: {
      bad: [{ author: '3am thoughts', avatar: '🌙', body: 'a postcard did more emotional damage than my last three relationships combined. {me} what did you DO. i need part two' }],
    },
  },
  movienight: {
    bird: {
      bad: [
        { author: 'ratio enthusiast', avatar: '🔥', body: 'MOVIE NIGHT. the reel is rolling. {me}’s casa footage is playing to the WHOLE villa in HD with SOUND. i have not blinked. this is cinema', replies: [{ author: 'popcorn account', avatar: '🍿', body: 'i paused. i rewound. i am a scientist now' }] },
        { author: 'the timeline', avatar: '🐦', body: 'the SILENCE after {me}’s clip. you could hear a spray tan dry. {partner}’s face has left the building. sending this to my ex for no reason' },
      ],
      good: [{ author: 'chaos gremlin 🍿', avatar: '😈', body: 'movie night and {me}’s reel is CLEAN. boring. NOTHING. and yet {partner}’s reel… oh we are eating tonight. couldn’t be {me}' }],
    },
    forum: {
      bad: [
        { author: 'u/methodical_viewer', avatar: '👽', body: '[MOVIE NIGHT LIVE] Reaction shots, ranked by devastation. {me}’s footage lands at a solid 9/10 on the wince scale. Nobody wins Movie Night. Nobody ever has.', meta: '↑ 5.2k · 900 comments', replies: [{ author: 'u/liveblog_hero', avatar: '👽', body: 'updating the sheet in real time. we are at DEFCON 2. send snacks' }] },
      ],
      good: [{ author: 'u/cautiously_optimistic', avatar: '👽', body: 'For once the clean reel belongs to {me} and the mess belongs to the OTHER side. I have screenshots. I have peace. I have a bowl of cereal at midnight.', meta: '↑ 2.7k · 310 comments' }],
    },
    mums: {
      bad: [{ author: 'Sandra', avatar: '👩', body: 'MOVIE NIGHT is CRUEL. Why do they DO this. My nerves. {me} sit DOWN. Denise put the kettle on we are going to be here a WHILE 😭😭🙏' }],
      good: [{ author: 'Denise (Admin)', avatar: '🧑‍🦱', body: 'Well {me}’s bit was CLEAN as a whistle and I am VINDICATED. I said it. I said they were a good one. Screenshot this ❤️👏' }],
    },
    grid: {
      bad: [{ author: '@villa.edits.daily', avatar: '🎬', body: 'MOVIE NIGHT REACTIONS 🎬🍿 slowing down every single face. {me} at 00:14 is a WHOLE meme now. you’re welcome', meta: '💬 view all 9,800 comments', replies: [{ author: '@meme.mill', avatar: '😹', body: 'already made the format. link in bio. we move FAST' }] }],
    },
    clock: {
      bad: [{ author: 'creator', avatar: '⏰', body: 'movie night is the villa’s roman colosseum and we are the emperors doing the thumbs down. {me} i’m so sorry i cannot look away', pinned: true }],
      good: [{ author: 'up all night', avatar: '🌙', body: 'the way {me}’s reel had NOTHING and everyone else’s was a whole true crime docuseries. sleeping so well tonight. lowercase justice' }],
    },
  },
  recoupling: {
    bird: {
      good: [{ author: 'the timeline', avatar: '🐦', body: 'RECOUPLING. everyone stands. {me} survives. the exhale in this house. i don’t even know these people why am i sweating' }],
      bad: [{ author: 'take merchant', avatar: '🐦', body: 'the recoupling did {me} DIRTY and the edit KNEW. hand held too long, chosen too late. i have questions and a comments section' }],
      mid: [{ author: 'chaos gremlin 🍿', avatar: '😈', body: 'a recoupling is just musical chairs where the music is someone crying and the chair is a relationship. {me} sit down carefully' }],
    },
    forum: {
      good: [{ author: 'u/cautiously_optimistic', avatar: '👽', body: '[RECOUPLING] {me} held on the strength of the actual connection, not the edit. Rare. Noted. Screenshotting for the doubters.', meta: '↑ 2.0k · 210 comments' }],
      bad: [{ author: 'u/where_is_the_backbone', avatar: '🧍', body: 'The recoupling exposed {me} and the numbers were NOT there. Discussed this would happen in my week-2 thread. Nobody listens to me.', meta: '↑ 1.7k · 340 comments' }],
    },
    mums: {
      good: [{ author: 'Denise (Admin)', avatar: '🧑‍🦱', body: 'THEY’RE SAFE. {me} is SAFE. I stood up in my LIVING ROOM. Barry thought something happened. Something DID happen. ❤️❤️❤️' }],
      bad: [{ author: 'Pam', avatar: '👵', body: 'Oh no. Oh {me}. Come here love. That firepit is a cruel place. I’ve turned it off. No I haven’t. But I said I would 😢' }],
    },
    grid: {
      good: [{ author: '@casualfan_22', avatar: '💗', body: 'the recoupling had me on the FLOOR 😭 {me} and {partner} standing there holding hands like it’s a wedding. i’m INVESTED invested', meta: '💬 view all 3,600 comments' }],
      bad: [{ author: '@justhereforthedrama', avatar: '🍸', body: 'the recoupling did {me} so dirty i gasped into my cereal 😮 the EDITORS knew. framing them last on PURPOSE. we riot', meta: '💬 view all 2,780 comments' }],
    },
    clock: {
      good: [{ author: 'up all night', avatar: '🌙', body: 'recoupling nights take a YEAR off my life and i keep coming back. {me} you don’t even know i exist and i almost fainted for you' }],
      bad: [{ author: 'creator', avatar: '⏰', body: 'the pause before they said the name. i have watched it 40 times. {me} i felt your whole heart drop and mine went with it. 3am agony', pinned: true }],
    },
  },
  dumping: {
    bird: {
      bad: [
        { author: 'the timeline', avatar: '🐦', body: 'and just like that {me} is DUMPED. the suitcase. the gravel. the tasteful piano. gone but the clip will outlive us all. pour one out 🕯️' },
        { author: 'take merchant', avatar: '🐦', body: 'they dumped {me} and kept the ones doing NOTHING. this is why we can’t have nice votes. i am NORMAL about this (i am not)' },
      ],
      good: [{ author: 'chaos gremlin 🍿', avatar: '😈', body: '{me} got dumped and gave a goodbye speech so GRACIOUS the nation immediately regretted the vote. villain-to-victim pipeline. iconic exit tbh' }],
    },
    forum: {
      bad: [{ author: 'u/methodical_viewer', avatar: '👽', body: '[DUMPING] {me} out. Post-mortem thread. Honestly a better edit than half the ones staying. The vote is not a meritocracy and I have a graph proving it.', meta: '↑ 3.9k · 700 comments', replies: [{ author: 'u/i_called_it', avatar: '👽', body: 'the graph checks out. the villa does not deserve the graph.' }] }],
    },
    mums: {
      bad: [
        { author: 'Sandra', avatar: '👩', body: 'THEY DUMPED {me}?? THE PUBLIC?? I VOTED FORTY TIMES. I am WRITING IN. This is a DISGRACE. Denise start the petition 😭😭😤' },
        { author: 'Pam', avatar: '👵', body: 'I’m ever so sad about {me}. Made myself a Horlicks. It’s not the same in there now. Come home safe love ❤️😢' },
      ],
    },
    grid: {
      bad: [{ author: '@villa.edits.daily', avatar: '🎬', body: 'not {me} being dumped 😭 doing a tribute edit rn to their best moments. link in bio. we were ROBBED. justice for {me}', meta: '💬 view all 6,700 comments' }],
    },
    clock: {
      bad: [{ author: 'creator', avatar: '⏰', body: '{me} leaving the villa broke something in me. it’s 3am and i’m watching their entrance VT again. grief is not linear', pinned: true, replies: [{ author: 'also crying', avatar: '😭', body: 'we mourn as a community. the fyp is a funeral tonight' }] }],
    },
  },
  vote: {
    bird: {
      mid: [{ author: 'the timeline', avatar: '🐦', body: 'PUBLIC VOTE OPEN. this is the one week our opinions actually load-bear. use your power responsibly (i will be voting for chaos)' }],
      good: [{ author: 'ratio enthusiast', avatar: '🔥', body: 'voting {me} because they’re the only one giving me a reason to keep my phone charged. that’s the criteria. that’s always been the criteria' }],
      bad: [{ author: 'take merchant', avatar: '🐦', body: 'not voting {me} and i want that on the record. build a personality and call me. the polls are OPEN and my thumb is IDLE' }],
    },
    forum: {
      good: [{ author: 'u/methodical_viewer', avatar: '👽', body: '[VOTE THREAD] Strategic voting guide, updated. {me} needs the numbers. Yes, this is a spreadsheet about a dating show. No, I will not be taking questions.', meta: '↑ 2.4k · 280 comments' }],
      mid: [{ author: 'u/devils_advocate_pro', avatar: '👽', body: 'PSA: vote-splitting is how good couples go home. If you like {me}, vote {me}, not the safe pick. This is the only civic duty I take seriously.', meta: '↑ 1.1k · 160 comments' }],
    },
    mums: {
      good: [{ author: 'Denise (Admin)', avatar: '🧑‍🦱', body: 'GIRLS the vote is OPEN. I have voted for {me} on all THREE of my phones AND the tablet. This is a group EFFORT. Rally the aunties ❤️📱' }],
    },
    grid: {
      mid: [{ author: '@thevilla', avatar: '🌴', body: 'the vote is OPEN 🗳️ who’s your favourite? save your Islanders 👇 #TheVilla', meta: '💬 view all 15,200 comments', replies: [{ author: '@front.row.fan', avatar: '💗', body: 'voted for {me} then voted again then remembered you can’t but i FELT it 🫶' }] }],
    },
    clock: {
      good: [{ author: 'doomscroller', avatar: '🌀', body: 'setting FIVE alarms to vote for {me}. i don’t set alarms for work. priorities are priorities' }],
    },
  },
  hut: {
    bird: {
      mid: [{ author: 'take merchant', avatar: '🐦', body: 'beach hut confessional from {me}. one chair, one mic, one perfectly framed breakdown. this is the realest they’ve been all season and it’s to a CAMERA' }],
      good: [{ author: 'the timeline', avatar: '🐦', body: 'the beach hut got more honesty out of {me} in 30 seconds than the whole villa managed in a week. put a camera in there PERMANENTLY' }],
    },
    forum: {
      good: [{ author: 'u/cautiously_optimistic', avatar: '👽', body: 'The Beach Hut clip of {me} was actually vulnerable and self-aware. I take back one (1) of my criticisms. The others stand.', meta: '↑ 900 · 60 comments' }],
    },
    mums: {
      good: [{ author: 'Pam', avatar: '👵', body: 'The Beach Hut bit made me well up. {me} just needs a good sleep and a proper meal. I’d have them round for a Sunday dinner in a HEARTBEAT ❤️' }],
    },
    grid: {
      mid: [{ author: '@casualfan_22', avatar: '💗', body: 'beach hut {me} said what we were all thinking 🥲 protect them', meta: '💬 view all 700 comments' }],
    },
    clock: {
      mid: [{ author: '3am thoughts', avatar: '🌙', body: 'the beach hut is where they take the mask off and mine is off too. it’s just me and {me} being honest at 4am. parasocial but healing' }],
    },
  },
  parents: {
    bird: {
      good: [{ author: 'the timeline', avatar: '🐦', body: 'MEET THE PARENTS. the mum walked in with the FACE. the assessing. the polite terror. {me} and {partner} sweating through the linen. peak telly' }],
      bad: [{ author: 'take merchant', avatar: '🐦', body: 'the mum asked {me} ONE question and {me} folded like a deckchair. mums are the real lie detector on this show and i love them for it' }],
    },
    forum: {
      mid: [{ author: 'u/methodical_viewer', avatar: '👽', body: '[FAMILY WEEK] The parent read on {me} is the closest thing to an unbiased audit this format has. Watch the mum’s eyebrows. That’s the real verdict.', meta: '↑ 1.5k · 130 comments' }],
    },
    mums: {
      good: [{ author: 'Sandra', avatar: '👩', body: 'THE MUMS ARE IN. This is MY superbowl. Finally someone in that villa asking the RIGHT questions. {me} sit up STRAIGHT for her 👏❤️' }],
      bad: [{ author: 'Carol xx', avatar: '👩', body: 'That mum has {me}’s number and so do I. You can’t fool a mother. We SEE things. Anyway lovely to see the families ❤️😤' }],
    },
    grid: {
      good: [{ author: '@villa.edits.daily', avatar: '🎬', body: 'the parents meeting {partner} 🥹 the mum’s reaction is the edit of the SEASON. clipping {me}’s face at 00:22 immediately', meta: '💬 view all 2,100 comments' }],
    },
    clock: {
      good: [{ author: 'up all night', avatar: '🌙', body: 'watching {me}’s family come in and sobbing like it’s MY family. i have never met these people. this is my family now. goodnight' }],
    },
  },
  ick: {
    bird: {
      bad: [{ author: 'ick correspondent', avatar: '🐦', body: 'the ICK just visited {me} live on air. you could see the exact frame love left the body. i felt it too. we all felt it. rip' }],
      mid: [{ author: 'chaos gremlin 🍿', avatar: '😈', body: 'nothing HAPPENED but {me}’s face said everything. the ick is a silent killer and it has entered the villa. no survivors' }],
    },
    forum: {
      mid: [{ author: 'u/receipts_folder', avatar: '📁', body: '[DISCUSSION] Cataloguing the exact moment {me} caught the ick. Timestamped. It was the way they said it. We’ve all been there. Solidarity thread.', meta: '↑ 1.2k · 190 comments' }],
      good: [{ author: 'u/cautiously_optimistic', avatar: '👽', body: 'Respect to {me} for NAMING the ick out loud instead of ghosting for three days like the rest of the villa. Emotional literacy on a dating show. Sit down, I need a minute.', meta: '↑ 1.4k · 120 comments' }],
    },
    mums: {
      mid: [{ author: 'Carol xx', avatar: '👩', body: 'Now don’t throw it ALL away over a little ick {me}. My Kevin chews with his mouth open and we’ve been married 31 years. Push THROUGH ❤️' }],
    },
    grid: {
      mid: [{ author: '@justhereforthedrama', avatar: '🍸', body: 'the ICK arc 😭 {me}’s face did NOT recover. respectfully this is the most relatable they’ve ever been', meta: '💬 view all 1,400 comments' }],
    },
    clock: {
      mid: [{ author: 'doomscroller', avatar: '🌀', body: 'not {me} catching the ick in real time. i have watched this transition 30 times. the little inspector behind their ribs put down a clipboard. we know' }],
    },
  },
  repair: {
    bird: {
      good: [{ author: 'the timeline', avatar: '🐦', body: '{me} out here doing the GROVEL properly. coffees, towels, the public apology. redemption arc unlocked. i’m a sucker and i’m clapping' }],
      bad: [{ author: 'take merchant', avatar: '🐦', body: 'the “i’m focusing only on you” speech from {me}. mate we have the RECEIPTS. the grovel needs to be LONGER and the coffee HOTTER' }],
    },
    forum: {
      good: [{ author: 'u/cautiously_optimistic', avatar: '👽', body: '[REPAIR WATCH] {me} is doing the actual work: consistent, small, unglamorous. This is what a real apology looks like. Noting it before I forget to be nice.', meta: '↑ 1.6k · 140 comments' }],
      bad: [{ author: 'u/no_more_excuses', avatar: '👽', body: 'The forgiveness is coming too easy from the other side. Self-respect check. Make {me} EARN it. Sources: every season ever.', meta: '↑ 1.9k · 260 comments' }],
    },
    mums: {
      good: [
        { author: 'Sandra', avatar: '👩', body: 'He’s SERVING HER COFFEE. THAT’S how you say sorry. Take NOTES lads. {me} you’re doing it RIGHT for once ❤️❤️👏' },
        { author: 'Denise (Admin)', avatar: '🧑‍🦱', body: 'A proper apology is COFFEE and CONSISTENCY not a big speech. {me} has clearly been raised right after all. I’m BIG enough to say I was wrong ❤️' },
      ],
    },
    grid: {
      good: [{ author: '@casualfan_22', avatar: '💗', body: 'the repair era 🥹 {me} making it right the slow way. i’m rooting for them SO hard now. character growth we love to see', meta: '💬 view all 1,100 comments' }],
    },
    clock: {
      good: [{ author: '3am thoughts', avatar: '🌙', body: 'the little acts of service redemption arc {me} is on is healing something in me personally. it’s 4am. i forgive them. i forgive everyone' }],
    },
  },
  final: {
    bird: {
      good: [{ author: 'ratio enthusiast', avatar: '🔥', body: 'THE FINAL. {me} made it. from beige-flag allegations to the FINAL. character development is real. voting till my thumb cramps' }],
      mid: [{ author: 'the timeline', avatar: '🐦', body: 'final night. the vote is LIVE. every wing of this nation is holding a remote and a grudge. may the best story win (it won’t, but may it)' }],
      bad: [{ author: 'take merchant', avatar: '🐦', body: '{me} in the final on vibes ALONE. no story, no scandal, just a nice couple. the drama wing is asleep. bold strategy. we’ll see' }],
    },
    forum: {
      good: [{ author: 'u/methodical_viewer', avatar: '👽', body: '[FINALE] Full-season arc breakdown for {me}. Jilted → tested → back on the horse. This is the story the crown rewards. Data attached. Good luck OP’s fave.', meta: '↑ 6.1k · 1.1k comments' }],
      mid: [{ author: 'u/where_is_the_backbone', avatar: '🧍', body: 'Respect where due: {me} kept the spine AND made the final. I criticised early and I stand corrected, in writing, timestamped.', meta: '↑ 2.2k' }],
    },
    mums: {
      good: [
        { author: 'Denise (Admin)', avatar: '🧑‍🦱', body: 'THE FINAL. Our {me}. I have known them since the STAIRS. I’ve got the good wine out. GIRLS we RAISED this one (we didn’t but we FELT it) ❤️❤️❤️🥂' },
        { author: 'Sandra', avatar: '👩', body: 'I have voted for {me} so many times my thumb has a cramp and Barbara is BACK for the final after saying she wasn’t watching. WELCOME BACK BARBARA. VOTE {me} ❤️📱' },
      ],
    },
    grid: {
      good: [{ author: '@villa.edits.daily', avatar: '🎬', body: 'FINALE EDIT IS UP 🏆 the {me} journey from day one to now had me SOBBING. link in bio. whatever happens they won US', meta: '💬 view all 11,900 comments', replies: [{ author: '@notif.gang', avatar: '🔔', body: 'not me watching this 6 times before the vote closes 😭🏆' }] }],
    },
    clock: {
      good: [{ author: 'creator', avatar: '⏰', body: 'we started this season as strangers and now i’m crying over {me} at the finale like they’re my child leaving for uni. worth every sleepless night', pinned: true }],
    },
  },
};

// The Narrator's teaser line — one layer up, his register (VOICE.md): dry,
// pun-forward, ≤1 bang. Rotated by family so the tap-prompt never reads twice
// the same in a season.
const TEASERS: Partial<Record<Family, string[]>> = {
  arrival: ['Behind the wall, the nation is deciding whether you have a personality.', 'Somewhere, five apps just clocked your walk down the stairs.'],
  bombshell: ['The internet has already picked a side. Both sides, actually.', 'Five group chats just lit up at once. None of them are yours.'],
  date: ['The nation watched. The nation has notes.', 'Two chairs, one drone, and a country with opinions about the fountain.'],
  challenge: ['The clip went home before you did.', 'The feeds are up. Someone made a sticker pack already.'],
  rival: ['The forum has opened a timeline. It has sources.', 'Two of you had a chat. Two million had a thread about it.'],
  temptation: ['The verb was doing work, and the nation noticed.', 'Somewhere, a mum is watching through her fingers.'],
  casa: ['Casa Amor: the one week the feeds do not sleep.', 'A postcode away, the whole internet is holding its breath.', 'Five feeds, one loyalty test, no context.'],
  postcard: ['One photo. Zero context. Several thousand opinions.', 'The crop did numbers. So did the reactions.', 'A producer cropped it. The internet un-cropped it in nine minutes.'],
  movienight: ['The reel rolled. The feeds are feasting.', 'Nobody wins Movie Night. The internet does, though.', 'Someone made a meme of your face before the credits.'],
  recoupling: ['Everyone stood up. So did the like counts.', 'The firepit went quiet. The feeds did not.', 'The names got read. The threads got long.'],
  dumping: ['The suitcase is on the gravel. The phone is already warm.', 'The villa forgets in a day. The internet does not.', 'Somewhere, a petition is being started on your behalf.'],
  vote: ['This is the week your opinions load-bear. The feeds know it.', 'The app has spoken. Loudly. In five dialects.', 'Five communities, one ballot, zero agreement.'],
  hut: ['You told the Beach Hut. The Beach Hut told everyone.', 'One chair, one mic, a nation of armchairs.'],
  parents: ['The mums are in. So are the mums online.', 'A family read the room. So did the timeline.'],
  ick: ['The whole nation felt that exact frame.', 'Love’s lie-detector pinged, live, on five platforms.'],
  repair: ['The grovel is logistics. The nation is grading the logistics.', 'Coffees, towels, a public apology. The feeds are tallying.'],
  final: ['Every sofa in the country is holding a remote.', 'The nation is voting. It has been rehearsing all season.', 'Whatever the envelope says, the feeds have already decided.'],
  recap: ['A week happened. The outside world had a week too.', 'While you were in there, the nation was very much out here.'],
  ending: ['They hand you your phone. It is warm.', 'The villa is behind you. The feeds are forever.'],
};

// ---------- Assembling one channel ----------

function fragToPost(rng: () => number, state: RunState, ch: string, f: Frag, baseTally: number): FeedPost {
  const me = nick(state, ch);
  const sub = (s: string) => s.replaceAll('{me}', me);
  const post: FeedPost = { author: sub(f.author), body: sub(f.body) };
  if (f.avatar) post.avatar = f.avatar;
  if (f.meta) post.meta = sub(f.meta); else {
    // Synthesize a believable engagement line per skin when none authored.
    if (ch === 'bird') post.meta = `${tally(rng, baseTally)} reposts · ${tally(rng, baseTally / 3)} quotes`;
    else if (ch === 'forum') post.meta = `↑ ${tally(rng, baseTally / 2)} · ${tally(rng, baseTally / 8)} comments`;
    else if (ch === 'grid') post.meta = `💬 view all ${tally(rng, baseTally)} comments`;
    else if (ch === 'clock') post.meta = `♥ ${tally(rng, baseTally * 2)} · ${tally(rng, baseTally / 5)} replies`;
    else post.meta = `👍 ${tally(rng, baseTally / 6)} · ${tally(rng, baseTally / 20)} comments`;
  }
  if (f.pinned) post.pinned = true;
  if (f.replies) post.replies = f.replies.map((r) => ({ author: sub(r.author), body: sub(r.body), ...(r.avatar ? { avatar: r.avatar } : {}) }));
  return post;
}

function buildChannel(state: RunState, chMeta: typeof CHANNELS[number], family: Family, valence: Valence, saltBase: number): FeedChannel {
  const rng = feedRng(state, saltBase);
  const mood = CHANNEL_MOOD[chMeta.id](state);
  // Engagement scales with reach — followers push the tallies up.
  const baseTally = 40 + (state.followers ?? 0) * 4 + (chMeta.id === 'grid' ? (state.followers ?? 0) * 6 : 0);

  // Family-specific fragments for this valence, falling back to a neighbouring
  // valence so a cell is never empty.
  const famCh = FAMILY[family]?.[chMeta.id] || {};
  const famFrags = famCh[valence] || famCh.mid || famCh.good || famCh.bad || [];
  const moodFrags = WING_MOOD[chMeta.id][mood];

  const chosen: Frag[] = [];
  chosen.push(...sample(rng, famFrags, Math.min(2, famFrags.length)));
  chosen.push(...sample(rng, moodFrags, 1));
  // Guarantee at least two posts even on the thinnest family.
  if (chosen.length < 2) chosen.push(...sample(rng, WING_MOOD[chMeta.id][mood === 'lost' ? 'unconvinced' : 'onside'], 1));

  const posts = chosen.map((f) => fragToPost(rng, state, chMeta.id, f, baseTally));
  // Pinned posts float up.
  posts.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  // The fold: extra family + mood colour for readers who want more.
  const moreFrags = [
    ...sample(rng, famFrags.filter((f) => !chosen.includes(f)), 2),
    ...sample(rng, WING_MOOD[chMeta.id][mood], 1),
  ];
  const more = moreFrags.map((f) => fragToPost(rng, state, chMeta.id, f, baseTally * 0.7));

  return {
    id: chMeta.id, name: chMeta.name, icon: chMeta.icon, skin: chMeta.skin,
    handle: pick(rng, chMeta.headers), header: pick(rng, chMeta.headers),
    mood: ({ devoted: 'up', onside: 'up', unconvinced: 'split', lost: 'down' } as const)[mood],
    posts, more: more.length ? more : undefined,
  };
}

// ---------- The public entry point (Presenter.feeds) ----------

export function villaFeeds(state: RunState, moment: FeedMoment): FeedBundle | null {
  if (state.tutorial) return null; // the rehearsal has no audience

  let family: Family | null = null;
  let valence: Valence = 'mid';

  if (moment.kind === 'result') {
    family = familyOfCard(moment.ev);
    if (!family) return null; // ambient card — the outside world stays quiet
    valence = valenceOf(moment.tier);
    if (family === 'dumping') valence = 'bad';
  } else if (moment.kind === 'recap') {
    family = 'recap';
    valence = (state.public ?? 0) >= 50 ? 'good' : (state.public ?? 0) >= 30 ? 'mid' : 'bad';
  } else if (moment.kind === 'ending') {
    family = 'ending';
    valence = moment.endingKey === 'dumped' ? 'bad'
      : (state.ending?.result === 'success') ? 'good'
      : moment.endingKey === 'burnout' ? 'mid' : 'mid';
  }
  if (!family) return null;

  const tRng = feedRng(state, 999);
  const teaser = pick(tRng, TEASERS[family] || ['The nation has thoughts. It always has thoughts.']);

  // For recap/ending we don't have card families; reuse the closest content
  // family so the channels still read rich (the season summary borrows the
  // most recent tentpole's flavour via the wing-mood layer, which is always
  // populated).
  const contentFamily: Family = (FAMILY[family] ? family
    : (moment.kind === 'ending' && valence === 'bad') ? 'dumping'
    : (moment.kind === 'ending') ? 'final'
    : 'recoupling');

  const channels = CHANNELS.map((c, i) => buildChannel(state, c, contentFamily, valence, i * 7 + family!.length));

  const HEAD: Partial<Record<Family, string>> = {
    recap: 'The week, from the outside',
    ending: 'Your phone, returned',
  };
  return {
    teaser,
    headline: HEAD[family] || 'The nation reacts',
    channels,
  };
}

// ---------- Lint corpus (ADR-0014) ----------
//
// The feed content isn't in pack.events, so it wouldn't be linted by the deck
// checker. These flat exports let tools/lint-content.mjs run the taste floor
// over it (post bodies as quoted mouths — cliché/bang exempt; chrome as
// narration — house rules apply). Split so the checker can treat them right.

export function feedBodyCorpus(): string[] {
  const out: string[] = [];
  const eat = (f: Frag) => { out.push(f.body); (f.replies || []).forEach((r) => out.push(r.body)); };
  for (const ch of Object.keys(WING_MOOD)) for (const m of Object.keys(WING_MOOD[ch])) WING_MOOD[ch][m as Mood].forEach(eat);
  for (const fam of Object.keys(FAMILY)) {
    const byCh = FAMILY[fam as Family]!;
    for (const ch of Object.keys(byCh)) {
      const byVal = byCh[ch]!;
      for (const v of Object.keys(byVal)) (byVal[v as Valence] || []).forEach(eat);
    }
  }
  return out;
}
export function feedChromeCorpus(): string[] {
  // Narrator-register strings: teasers + headlines. These obey the house rules.
  const out: string[] = [];
  for (const fam of Object.keys(TEASERS)) out.push(...TEASERS[fam as Family]!);
  return out;
}
