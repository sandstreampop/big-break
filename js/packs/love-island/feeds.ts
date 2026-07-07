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
  // v5 player arcs: the falling (a love declaration reads like a date beat to
  // the nation) and the fame friction (a couple pulled at by the spotlight —
  // the rival here is the audience itself).
  if (id.startsWith('li_fall_')) return 'date';
  if (id.startsWith('li_fame_')) return 'rival';
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
      { author: 'posting through it', avatar: '🐦', body: 'i have a spreadsheet, a group chat, and a burner account all dedicated to {me} and i would do it AGAIN. this is a hobby now. i have a hobby. i am WELL' },
      { author: 'the FYP mayor', avatar: '🐦', body: 'genuinely believe {me} is the last honest person on television. yes it is a dating show. yes i mean it fully. no i will not be softening that for anyone' },
    ],
    onside: [
      { author: 'sofa correspondent', avatar: '📺', body: 'ok {me} is actually giving me something to post about. keep it up. my engagement thanks you' },
      { author: 'the timeline', avatar: '🐦', body: 'not the best telly of the night but {me} is doing numbers. i respect a worker' },
      { author: 'mildly invested', avatar: '🐦', body: 'said i wasn’t watching this season. it is 9pm. i am watching this season. this is {me}’s fault specifically' },
      { author: 'live-tweet larry', avatar: '🐦', body: 'wasn’t going to live-tweet tonight and then {me} did a Thing and now my thumbs won’t stop. this is your fault specifically. keep doing Things and i keep typing' },
    ],
    unconvinced: [
      { author: 'bored in HD', avatar: '🥱', body: 'if {me} doesn’t cause a SCENE soon i’m switching to the other channel. i pay my licence fee for CHAOS' },
      { author: 'take merchant', avatar: '🐦', body: 'controversial but {me} is a bit of a beige flag rn. bring back the villain edit' },
      { author: 'the group chat leak', avatar: '🐦', body: '{me} is nice. NICE. do you know what nice does on this show. nothing. nice does NOTHING. i’m begging for a flaw' },
      { author: 'the arm-chair expert', avatar: '🐦', body: 'as a body language expert (i have seen every season twice) {me} is giving “nice on paper.” paper is not a personality. hand me ONE flaw to grab. i’m begging' },
    ],
    lost: [
      { author: 'unbothered', avatar: '💤', body: '{me} is who exactly. i genuinely could not pick them out of a lineup. NEXT' },
      { author: 'the algorithm', avatar: '🐦', body: 'the fact that {me} thinks they’re a main character. babe you’re a b-plot at BEST' },
      { author: 'ex-fan', avatar: '🐦', body: 'i used to defend {me}. i will not be doing that anymore. the receipts are in the quote tweets. i’m tired' },
      { author: 'the block button', avatar: '🐦', body: 'muting the {me} tag. muting the fancams. muting the word villa entirely. i pay a licence fee to be ENTERTAINED, not to watch beige dry on a sun lounger' },
    ],
  },
  forum: {
    devoted: [
      { author: 'u/methodical_viewer', avatar: '👽', body: '[ANALYSIS] {me} is playing this with a spine and it shows. Made a spreadsheet. They’re the only one being honest with themselves.', meta: '↑ 4.1k · 320 comments', replies: [{ author: 'u/lurker_no_more', avatar: '👽', body: 'commenting so I can find this thread later. the spreadsheet is real, folks' }] },
      { author: 'u/receipts_folder', avatar: '📁', body: 'Unpopular opinion (it is not unpopular): {me} is the only person in that villa I would trust to hold my coat.', meta: '↑ 2.9k' },
      { author: 'u/longtime_lurker', avatar: '👽', body: '[APPRECIATION] Been watching this show for eleven seasons. {me} is doing something genuinely rare: being consistent. That’s it. That’s the post. EDIT: RIP my inbox.', meta: '↑ 3.4k · 190 comments' },
      { author: 'u/data_over_vibes', avatar: '👽', body: '[APPRECIATION] Ran the numbers on every {me} decision. Their consistency score is genuinely the highest in the cast. The vibes are backed by data for once. That is the post.', meta: '↑ 2.7k · 140 comments' },
    ],
    onside: [
      { author: 'u/cautiously_optimistic', avatar: '👽', body: 'Rewatched the clip three times. {me} is doing fine, actually. I’ll allow it. EDIT: to the person in my DMs — no.', meta: '↑ 1.2k · 88 comments' },
      { author: 'u/devils_advocate_pro', avatar: '👽', body: 'Hot take that will get me downvoted: {me} is fine. Not a saint, not a villain. A person. On a dating show. Revolutionary, I know.', meta: '↑ 640 · 220 comments' },
      { author: 'u/first_time_poster', avatar: '👽', body: 'Lurked eight seasons, made an account for this: {me} is quietly the most watchable one in there. Not the loudest, the most watchable. Be gentle, it is my first post.', meta: '↑ 810 · 95 comments' },
    ],
    unconvinced: [
      { author: 'u/where_is_the_backbone', avatar: '🧍', body: '[DISCUSSION] Timeline of {me}’s decisions, sourced. I am not saying they have no spine. I am saying show me the spine.', meta: '↑ 890 · 210 comments' },
      { author: 'u/second_opinion', avatar: '👽', body: 'Genuine question, no hate: what is {me} actually doing in there. Like the strategy. I’ve made a flowchart and it just loops.', meta: '↑ 720 · 140 comments' },
      { author: 'u/reading_comprehension', avatar: '👽', body: '[DISCUSSION] Asking in good faith, not baiting: what is the {me} endgame. I have mapped it twice and both maps end in a shrug. Convince me with sources and I will update happily.', meta: '↑ 660 · 175 comments' },
    ],
    lost: [
      { author: 'u/mod_TheVilla', avatar: '🛡️', body: 'Locking the {me} megathread. We have discussed the doormat behaviour extensively and civilly and I need to sleep. EDIT: spelling.', meta: '📌 pinned by moderators' },
      { author: 'u/no_more_excuses', avatar: '👽', body: 'At what point do we admit {me} has no self-respect. Genuine question. With sources.', meta: '↑ 3.3k · 540 comments', replies: [{ author: 'u/mod_TheVilla', avatar: '🛡️', body: 'Keep it civil. This is a warning. (I agree but keep it civil.)' }] },
      { author: 'u/i_called_it', avatar: '👽', body: 'Reposting my week-2 thread where I predicted {me} would fold. Nobody upvoted it then. Where is everybody NOW.', meta: '↑ 1.5k · 300 comments' },
      { author: 'u/former_defender', avatar: '👽', body: 'I moderated the {me} appreciation thread for six weeks. I am stepping down, effective immediately. The doormat evidence is simply too strong to keep pinning. EDIT: no, I will not elaborate.', meta: '↑ 1.9k · 410 comments' },
    ],
  },
  mums: {
    devoted: [
      { author: 'Sandra', avatar: '👩', body: 'I don’t care what the young ones on the other apps say {me} is a GOOD EGG and reminds me of our Gemma ❤️❤️ leave them ALONE' },
      { author: 'Denise (Admin)', avatar: '🧑‍🦱', body: 'Just want to say {me} has lovely manners and that is a REFLECTION OF THE PARENTS. Well done to the mum 👏👏' },
      { author: 'Jacqui 🌸', avatar: '👩', body: 'Ooh I do like {me}. Reminds me of my Craig at that age, before the divorce obviously. GOOD LUCK to them ❤️❤️❤️' },
      { author: 'Sandra', avatar: '👩', body: 'Have just voted for {me} on the app. Took me forty minutes. My grandson showed me. Lovely boy. Anyway VOTE for {me} ❤️📱' },
      { author: 'Marie', avatar: '👩', body: 'Well I think {me} is an ABSOLUTE credit and reminds me of my granddaughter Chloe who’s doing ever so well at college ❤️ Leave the lovely one be. Bless their heart ❤️' },
    ],
    onside: [
      { author: 'Pam', avatar: '👵', body: 'Aww {me} is doing their best bless them. We were all young once. Ish. 🙏' },
      { author: 'Denise (Admin)', avatar: '🧑‍🦱', body: 'Whoever is doing the subtitles is doing a smashing job. Oh and {me} was lovely tonight too ❤️ Right, bed. Night girls x' },
      { author: 'Sue', avatar: '👵', body: 'Aww {me} tries so hard don’t they. My Malcolm says I get too attached to the telly. Malcolm the telly is all I’ve HAD since you took up the golf 🙏❤️' },
    ],
    unconvinced: [
      { author: 'Carol xx', avatar: '👩', body: 'Now I like {me} BUT and I say this with love… I don’t know what they’re playing at. Someone tell them. Gently. ❤️' },
      { author: 'Pam', avatar: '👵', body: 'I’m worried about {me}. Not angry. Worried. It’s different. My daughter says I do this with the telly. She’s not wrong 😔❤️' },
      { author: 'Lorraine 🌻', avatar: '👩', body: 'I do worry about {me}. Not being funny but they want to have a proper think. My Bernadette said the same and she’s a district NURSE so she’d KNOW ❤️😔' },
    ],
    lost: [
      { author: 'Sandra', avatar: '👩', body: 'Sorry but {me} needs to have a WORD with themselves. I have muted this season TWICE. This is my final warning to a person who cannot hear me 😤' },
      { author: 'Denise (Admin)', avatar: '🧑‍🦱', body: 'REMINDER we are KIND in this group even about {me}. That said. No. ❤️' },
      { author: 'Carol xx', avatar: '👩', body: 'I have UNFOLLOWED {me} on the Instagram. It won’t do anything they’ll never know but I feel BETTER. Who’s having a wine 🍷😤' },
      { author: 'Denise (Admin)', avatar: '🧑‍🦱', body: 'RIGHT. I have BITTEN my tongue about {me} for THREE WEEKS as your Admin. Tongue officially un-bitten. No. Just no. And that’s all I’ll say (it is not all I’ll say) 😤❤️' },
    ],
  },
  grid: {
    devoted: [
      { author: '@villa.edits.daily', avatar: '🎬', body: 'the way {me} carried this ENTIRE episode on their back 😭😭 edit dropping at midnight, do NOT let this flop', meta: '💬 view all 4,102 comments', replies: [{ author: '@notif.gang', avatar: '🔔', body: 'first 🫶 obsessed w this account' }] },
      { author: '@brightsmile.official', avatar: '🦷', body: 'obsessed with {me} 😍 (dm us babe we sell teeth)', meta: '💬 view all 2,204 comments' },
      { author: '@thevillafancam', avatar: '🎥', body: '{me} 🩷 that’s it that’s the comment. 4k slow-mo in the highlights. protect at all costs 😤🫶', meta: '💬 view all 3,050 comments' },
      { author: '@glowdrink_energy', avatar: '🥤', body: 'the ALGORITHM brought us here and we’re staying 😍 {me} we’d love to send you something (link in bio) 💌', meta: '💬 view all 1,410 comments' },
      { author: '@lashqueen.studio', avatar: '💅', body: 'not us CRYING over {me} in the salon 😭😍 the way they carry a whole scene 🫶 (dm for a lash appt babe, you’d suit a hybrid set) 💌', meta: '💬 view all 1,890 comments' },
    ],
    onside: [
      { author: '@casualfan_22', avatar: '💗', body: 'not me getting invested in {me} 🫠 anyway who else is watching', meta: '💬 view all 900 comments' },
      { author: '@sofasunday', avatar: '🛋️', body: 'ok {me} is growing on me 🌱 like a fungus but the cute kind. following for the arc', meta: '💬 view all 540 comments' },
      { author: '@villa.updates247', avatar: '📲', body: '{me} slowly becoming a fan fave in real time 📈🌱 we called this arc in our stories weeks ago. follow the page for daily {me} content 🫶', meta: '💬 view all 470 comments' },
    ],
    unconvinced: [
      { author: '@justhereforthedrama', avatar: '🍸', body: 'is {me} gonna do something this episode or 🧍‍♀️ asking for the group chat', meta: '💬 view all 611 comments' },
      { author: '@petty.betty', avatar: '💅', body: 'the caption said “iconic” about {me} and i had to sit down. we are NOT watching the same show 😭', meta: '💬 view all 480 comments' },
      { author: '@tan.by.tanya', avatar: '🧴', body: 'ok but WHEN is {me} going to give us something to clip 🧍‍♀️ we’re waiting babe. (the tan’s looking unreal this ep tho, code VILLA20) 😍', meta: '💬 view all 510 comments' },
    ],
    lost: [
      { author: '@scrolling.past', avatar: '📱', body: 'who is {me}. why are they on my feed. the algorithm is WRONG today', meta: '💬 view all 120 comments' },
      { author: '@unfollowing.rn', avatar: '👋', body: 'muting the {me} tag until further notice 🧘‍♀️ my peace is worth more than this arc', meta: '💬 view all 96 comments' },
      { author: '@nextbig.edits', avatar: '📱', body: 'pausing {me} content, the numbers just aren’t numbering 🙏 pivoting the page to whoever pops off next 🫶 (lash code still VILLA20 though, mama’s gotta eat) 💅', meta: '💬 view all 88 comments' },
    ],
  },
  clock: {
    devoted: [
      { author: 'pinned by creator', avatar: '📌', body: 'part 47 of me explaining {me}’s whole arc to my nan like it’s the six o’clock news. she’s invested now. we both are', pinned: true, replies: [{ author: 'nan (probably)', avatar: '👵', body: 'she showed me. i have opinions now. team {me}.' }] },
      { author: 'up all night', avatar: '🌙', body: 'no bc {me} lives in my head rent-paid. they pay ON TIME. model tenant' },
      { author: 'delulu defender', avatar: '💫', body: 'people saying {me} isn’t that deep. it’s 3am and to ME they are the deepest thing that has ever happened. respectfully log off' },
      { author: 'the rewatch account', avatar: '🌙', body: 'this is my sixth time through {me}’s season. i know their coffee order. i know their walk. i do not know my own neighbours’ names. we all have priorities and these are mine' },
    ],
    onside: [
      { author: '3am thoughts', avatar: '🌙', body: 'ok but {me} kind of ate. lowercase. i’m tired. goodnight to {me} specifically' },
      { author: 'fyp resident', avatar: '📲', body: 'the {me} edits are getting better than the actual show. anyway. one more. then bed. (this is a lie)' },
      { author: 'one more video', avatar: '📲', body: 'told myself one {me} edit then bed. it is now tomorrow. the sun is a rumour. no regrets. {me} ate quietly this episode and i, a stranger, noticed. goodnight' },
    ],
    unconvinced: [
      { author: 'doomscroller', avatar: '🌀', body: '{me} i am BEGGING you to give me a reason to stay up. it is late. i have work. do something' },
      { author: 'sleepy but here', avatar: '🥱', body: 'not {me} being the reason i’m still awake AND not even doing anything. the disrespect. the loyalty. i contain multitudes' },
      { author: '4am philosopher', avatar: '🌀', body: 'staring at {me} on my screen at 4am like: do something. anything. i have handed you my entire night and my phone is at 12 percent. move a single muscle. i dare you' },
    ],
    lost: [
      { author: 'closing the app', avatar: '💤', body: 'watching {me} do absolutely nothing is not the serve they think it is. logging off. (i will not log off)' },
      { author: 'former stan', avatar: '🥀', body: 'took {me} off my fyp with my own two thumbs. it’s what growth looks like. i’m so brave. anyway what are they doing rn' },
      { author: 'should be asleep', avatar: '💤', body: 'unfollowed the {me} fancam page and felt absolutely nothing. that is how i KNOW i’m healed. anyway rewatching their entrance for closure. one final time. this is a lie' },
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
      good: [{ author: 'day one truther', avatar: '🐦', body: 'they’ve been on screen 90 seconds and i’ve already picked a side, built a fancam in my head, and pre-ordered the breakup' }, { author: 'the cold open', avatar: '🐦', body: 'the VT gave {me} a saxophone entrance and a fun fact and i still leaned over and said “which one’s that.” it is DAY one and i’ve already lost track. rough start' }],
      mid: [{ author: 'first impressions inc', avatar: '🐦', body: 'new cast dropped. i have decided their entire personalities based on how they walked down the stairs. this is journalism' }, { author: 'casting critic', avatar: '🐦', body: 'the launch lineup is here and i’ve assigned everyone a tragic backstory based on nothing. {me} is the “secretly the most normal one,” which on this show is the kiss of death' }],
      bad: [{ author: 'harsh but fair', avatar: '🐦', body: 'the intro VT told us their job, their star sign, and their ick and STILL i felt nothing. rough start for {me}' }, { author: 'the intro skeptic', avatar: '🐦', body: 'they gave {me} a job title, a star sign, and a signature dance and my pulse did not shift once. the VT budget was WASTED on me tonight. i’ll need a whole week' }],
    },
    forum: {
      good: [{ author: 'u/season_opener', avatar: '👽', body: '[DISCUSSION] Day One casting breakdown (long). Early read: {me} is the one with an actual personality. Cautiously bookmarking.', meta: '↑ 1.4k · 260 comments' }, { author: 'u/casual_observer_99', avatar: '👽', body: '[DISCUSSION] First-night notes, unranked. {me} is the only one who answered a question like a person and not a headshot. Cautiously moving them to the watch column.', meta: '↑ 980 · 130 comments' }],
      mid: [{ author: 'u/pattern_noticer', avatar: '👽', body: 'Every season opens the same way and every season I make this thread anyway. Ranking the launch coupling by likely half-life.', meta: '↑ 980' }, { author: 'u/the_archivist', avatar: '👽', body: 'Annual reminder that I rank every launch coupling on night one and I am wrong by week two every single year. Here it is anyway. {me} is a provisional mid. No hate, it is night one.', meta: '↑ 720' }],
      bad: [{ author: 'u/first_impressions', avatar: '👽', body: 'Nobody panic but I have already written {me} off and it is day one. I will screenshot this and eat it later if I’m wrong. I am rarely wrong.', meta: '↑ 410 · 180 comments' }, { author: 'u/day_one_skeptic', avatar: '👽', body: 'Screenshotting my own take for accountability: {me} does nothing for me. Zero read on the personality. I have been wrong once and I still think about it. EDIT: it was season four, leave me be.', meta: '↑ 380 · 160 comments' }],
    },
    mums: {
      good: [{ author: 'Sandra', avatar: '👩', body: 'Oh they all look LOVELY this year. That {me} has a kind face. I’ve made a brew and cleared my evenings ❤️ GOODLUCK to them all' }, { author: 'Jacqui 🌸', avatar: '👩', body: 'Ooh what a lovely bunch this year. {me} has a smashing smile. I’ve got the good biscuits in and I’ve told our Dean NOT to ring during the launch ❤️ Best of luck to them all x' }],
      mid: [{ author: 'Pam', avatar: '👵', body: 'Which one is which. There’s too many. I’ve written the names on a bit of paper. Kyle? Is there a Kyle 🙏' }, { author: 'Tracey (new phone)', avatar: '👩', body: 'How do you all remember the NAMES. I’ve got {me} down as “the tall one” on a Post-it on the fridge. Is that not easier. Sorry. New to the group, still learning ❤️' }],
    },
    grid: {
      good: [{ author: '@thevilla', avatar: '🌴', body: 'they’re HERE. meet your Islanders 🌴☀️ who are we obsessed with already 👇', meta: '💬 view all 8,900 comments', replies: [{ author: '@front.row.fan', avatar: '💗', body: 'CLAIMING {me} in the comments. they’re mine now. sorry everyone' }] }, { author: '@dailydose.ofvilla', avatar: '🌴', body: 'DAY ONE and we’re already OBSESSED 🌴✨ {me} walked in like they OWN the place 💅 claiming them for the page 🫶 who’s yours 👇', meta: '💬 view all 6,200 comments' }],
      mid: [{ author: '@justhereforthedrama', avatar: '🍸', body: 'day one and the comments are already at WAR over {me} 🍿 we don’t even know them. never change', meta: '💬 view all 1,020 comments' }, { author: '@sofasunday', avatar: '🛋️', body: 'day one and i’ve picked {me} purely off the walk down the stairs 🚶 no notes, no reason. this is how i pick everything actually. following for the whole ride 🫶', meta: '💬 view all 830 comments' }],
    },
    clock: {
      mid: [{ author: 'first night crew', avatar: '🌙', body: 'starting a new season is a commitment i did NOT consent to and yet here i am, 3am, learning {me}’s entire backstory' }, { author: 'night shift', avatar: '🌙', body: 'new season, new sleep schedule ruined. learning {me}’s star sign and job and hometown at 2am like there’s an exam in the morning. there is not. i just care too much' }],
      good: [{ author: 'day one delulu', avatar: '💫', body: 'called it on day one: {me} is my winner. screenshotting this. if i’m wrong i’ll delete it and we never speak of it again' }, { author: 'parasocial & proud', avatar: '💫', body: 'called {me} as my winner off the ENTRANCE alone. writing it here so future me can gloat or grieve. either way we’re committed now. it’s day one and i’ve chosen a whole person' }],
    },
  },
  bombshell: {
    bird: {
      good: [{ author: 'chaos gremlin 🍿', avatar: '😈', body: 'A BOMBSHELL. they’ve walked in holding a date card like it’s a WEAPON. six settled couples just felt a cold breeze. i am UP' }, { author: 'screaming crying', avatar: '🐦', body: 'a bombshell walked in holding a DATE CARD and every coupled-up person suddenly discovered the phrase “open conversations.” {me} the air just changed and so did the stakes. feral' }],
      mid: [{ author: 'the timeline', avatar: '🐦', body: 'new arrival detected. everyone’s partner is suddenly “just being friendly.” the villa smells like SPF and fear' }, { author: 'friendzone forecaster', avatar: '🐦', body: 'new bombshell walks in and suddenly everyone’s partner is “keeping it friendly.” friendly. the busiest word in this villa. we have EYES and a rewind button and we will be USING both' }],
      bad: [{ author: 'take merchant', avatar: '🐦', body: 'they sent in a bombshell to save the season and the bombshell has the charisma of a car park. try again production' }, { author: 'the trailer liar', avatar: '🐦', body: 'a whole week of “THE BOMBSHELL TO END ALL BOMBSHELLS” trailers and they walked in, said “i’m a Gemini,” and sat down. production i want my anticipation REFUNDED in full' }],
    },
    forum: {
      good: [{ author: 'u/threat_assessment', avatar: '👽', body: '[DISCUSSION] Bombshell entry. Modelling the recoupling risk to {me}’s couple. Spoiler: it is non-zero and I am spiralling.', meta: '↑ 2.2k · 410 comments' }, { author: 'u/contingency_planner', avatar: '👽', body: '[ANALYSIS] Modelled three scenarios for {me} post-bombshell. Best case: nothing. Worst case: everything. Median case: a fire pit chat that ages someone five years. Bracing accordingly.', meta: '↑ 1.3k · 200 comments' }],
      mid: [{ author: 'u/here_we_go', avatar: '👽', body: 'Production noticed things were calm and did what production does. Predictable. Effective. I hate that it worked on me.', meta: '↑ 760' }, { author: 'u/predictable_beats', avatar: '👽', body: 'The villa went calm for 36 hours so of course a bombshell arrives on cue. It is transparent, it is manipulative, and it worked on me instantly. I have watched since the paddling-pool era.', meta: '↑ 700' }],
    },
    mums: {
      good: [{ author: 'Carol xx', avatar: '👩', body: 'A NEW ONE?? at this hour?? {partner} you had BETTER hold onto {me}. I mean it. I have a bad feeling and my feelings are NEVER wrong ask my Kevin ❤️' }, { author: 'Bernadette', avatar: '👵', body: 'Ooh a newcomer. I don’t trust it. I said the same when our Sharon brought a new fella to Christmas and I was RIGHT wasn’t I. {partner} you guard {me} with your LIFE ❤️😤' }],
      bad: [{ author: 'Sandra', avatar: '👩', body: 'Who is this now. We were all settled. I don’t like change and I don’t like them. Sorry. Not sorry. 😤' }, { author: 'Carol xx', avatar: '👩', body: 'Who ARE these people they keep sending in. We’d all just settled down nice. I don’t want new. I want the ones I’ve LEARNED the names of. Take it back please 😤' }],
    },
    grid: {
      good: [{ author: '@villa.edits.daily', avatar: '🎬', body: 'BOMBSHELL WALK. slow-mo edit incoming. the way the whole lawn turned around 💀 rip to everyone’s coupling', meta: '💬 view all 3,301 comments' }, { author: '@slowmo.central', avatar: '🎥', body: 'BOMBSHELL ENTRANCE in 0.5 speed 🎥💣 watch the whole lawn’s faces at 00:08 💀 {me}’s reaction is the one to screenshot. saving this forever. you’re welcome 🫶', meta: '💬 view all 2,700 comments' }],
      mid: [{ author: '@justhereforthedrama', avatar: '🍸', body: 'new bombshell just walked in and the comments have already drafted three love triangles and a spinoff 🍿 we are NOT normal', meta: '💬 view all 2,140 comments' }, { author: '@front.row.fan', avatar: '💗', body: 'new bombshell dropped and the comments have already coupled them with three people and started a feud 🍿 we do NOT know this person. never change babe 🫶', meta: '💬 view all 1,600 comments' }],
    },
    clock: {
      good: [{ author: 'up all night', avatar: '🌙', body: 'a bombshell entering while i’m half asleep is a personal attack on my sleep schedule and my emotional stability. thank you. more' }, { author: 'should be asleep', avatar: '🌙', body: 'a bombshell entering at midnight is a direct assault on my rest and i have never felt more alive. {me} your couple is in DANGER and i am SEATED. do more of exactly this' }],
      bad: [{ author: 'doomscroller', avatar: '🌀', body: 'they sent in a bombshell to shake up {me}’s couple and the bombshell has done NOTHING. we were promised chaos. i want a refund and it’s 3am' }, { author: 'one more video', avatar: '🌀', body: 'they promised me a season-ending bombshell and gave me someone whose entire personality is a fun fact about their dog. i love the dog. i wanted CARNAGE. it’s 3am and i got a dog fact' }],
    },
  },
  date: {
    bird: {
      good: [{ author: 'soft launch police', avatar: '🐦', body: '{me} and {partner} on a date actually being NORMAL and cute?? in THIS villa?? suspicious. i give it till thursday but i’m smiling' }, { author: 'the swoon desk', avatar: '🐦', body: '{me} and {partner} on a date being genuinely lovely with zero agenda?? i don’t know how to report on this. no ratio, no notes. just two people and a cheese board. i’m unwell in a nice way' }],
      bad: [{ author: 'awkward archive', avatar: '🐦', body: 'the SILENCE on {me}’s date. i have never heard a fountain so clearly. two people, one personality between them, and it was the fountain’s' }, { author: 'cringe correspondent', avatar: '🐦', body: 'the {me} date. two people, one shared fact, and eleven seconds of a wind chime doing all the emotional labour. i have watched paint form deeper attachments than this' }],
    },
    forum: {
      good: [{ author: 'u/body_language_dept', avatar: '👽', body: 'The mirrored posture on {me}’s date is textbook. As a person who has watched a lot of telly, that is real. I’ll die on this hill.', meta: '↑ 1.1k · 150 comments' }, { author: 'u/mirror_neurons', avatar: '👽', body: 'The {me} date: synchronised laughing, open posture, feet pointed inward. As a person with a psychology podcast (unlisted, three listeners) I confirm this is the real thing. Filing under green.', meta: '↑ 940 · 110 comments' }],
      bad: [{ author: 'u/second_opinion', avatar: '👽', body: 'The {me} date was two people describing their jobs at each other for eleven minutes. I timed it. I have the timestamps. Send help.', meta: '↑ 560 · 120 comments' }, { author: 'u/awkward_studies', avatar: '👽', body: '[DISCUSSION] Timestamped every silence on the {me} date. Total dead air: two minutes forty. On a date. With a sunset provided. I have a graph and a mild headache.', meta: '↑ 620 · 130 comments' }],
    },
    mums: {
      good: [{ author: 'Denise (Admin)', avatar: '🧑‍🦱', body: 'A LOVELY date. He made her a drink and pulled her chair out. THAT is how you were raised or you weren’t. {me} deserves this ❤️❤️🙏' }, { author: 'Pam', avatar: '👵', body: 'Oh that was a LOVELY date. He topped up her water without being asked. That’s the sign of a good one. My Derek never once in thirty years. {me} deserves the world ❤️❤️' }],
      bad: [{ author: 'Pam', avatar: '👵', body: 'Oh dear. That was hard to watch. My tea went cold. Someone give {me} a script bless them 😬' }, { author: 'Carol xx', avatar: '👩', body: 'Oh dear me. That date was like pulling teeth wasn’t it. I wanted to reach into the telly and start the conversation MYSELF. Chin up {me}, not everyone’s a talker ❤️😬' }],
    },
    grid: {
      good: [{ author: '@casualfan_22', avatar: '💗', body: 'the DATE 🥹 they’re actually so cute i can’t. protecting {me} and {partner} at all costs 🫶', meta: '💬 view all 1,808 comments' }, { author: '@softlaunch.central', avatar: '💗', body: 'the DATE 🥹🫶 the little laugh {me} did when {partner} spoke?? saving that clip forever. protecting this with my whole LIFE 😭', meta: '💬 view all 1,500 comments' }],
      bad: [{ author: '@petty.betty', avatar: '💅', body: 'the second-hand embarrassment from {me}’s date 💀 i had to put my phone in another room. anyway swipe for the fit pics', meta: '💬 view all 720 comments' }, { author: '@cringe.compilation', avatar: '😬', body: 'the {me} date is going straight in the second-hand embarrassment reel 💀 no shade, we’ve all been there. sound ON for the silence. link in bio 🫶', meta: '💬 view all 640 comments' }],
    },
    clock: {
      good: [{ author: '3am thoughts', avatar: '🌙', body: 'rewatching the date. pausing on the bit where {partner} laughed. that’s it that’s the video. goodnight' }, { author: 'crying in the club', avatar: '🌙', body: 'the bit on the {me} date where {partner} looked away to smile. i rewound it. i live there now. this is my home address. it’s 4am and i’ve fully moved in. goodnight' }],
      bad: [{ author: 'doomscroller', avatar: '🌀', body: 'the {me} date gave me the ick THROUGH the screen and i wasn’t even on it. how is that possible. i need a lie down' }, { author: 'ick from afar', avatar: '🌀', body: 'caught the ick off the {me} date through a SCREEN at 3am. i wasn’t there. i wasn’t involved. and yet. the human body is capable of terrible remote things' }],
    },
  },
  challenge: {
    bird: {
      good: [{ author: 'ratio enthusiast', avatar: '🔥', body: 'the CHALLENGE. {me} understood the assignment and then some. someone’s partner is fuming in the background and i am ZOOMING IN' }, { author: 'zoom and enhance', avatar: '🐦', body: 'the CHALLENGE and {me} took a whipped-cream pie to the FACE and kept going while someone’s partner went grey in the background. cropping that reaction. framing it. printing it' }],
      bad: [{ author: 'chaos gremlin 🍿', avatar: '😈', body: '{me} in that challenge. custard everywhere. dignity nowhere. THIS is what i pay for. frame it' }, { author: 'pie enthusiast', avatar: '😈', body: '{me} pied the WRONG one in the challenge and now there’s a Chat brewing on the daybed and squirty cream on the decking. this is why i renew my subscription to being awake. glorious' }],
      mid: [{ author: 'the timeline', avatar: '🐦', body: 'challenge day = the one day the producers admit it’s a game show with feelings attached. love it here' }, { author: 'sports commentator', avatar: '🐦', body: 'challenge day is the one day production admits this is a competition with a leaderboard made of feelings. {me} is currently top of a table nobody can see. commentating anyway' }],
    },
    forum: {
      mid: [{ author: 'u/challenge_lore', avatar: '👽', body: '[EFFORTPOST] A history of this challenge across seasons, and what {me}’s answer reveals under game-theory. Yes I’m fun at parties.', meta: '↑ 1.3k · 90 comments' }, { author: 'u/format_historian', avatar: '👽', body: '[EFFORTPOST] The “raunchy relay” has appeared fourteen times across the franchise. {me}’s time-on-lap ranks mid-tier historically. Yes I have the dataset. No I will not be seeking help.', meta: '↑ 1.1k · 70 comments' }],
      bad: [{ author: 'u/where_is_the_backbone', avatar: '🧍', body: 'The challenge literally hands you a microphone to say the thing and {me} said “no comment.” The one time. THE ONE TIME.', meta: '↑ 980 · 240 comments' }, { author: 'u/missed_the_shot', avatar: '👽', body: 'The challenge literally scripts the confrontation FOR them and {me} chose the safe answer AGAIN. This is the third open goal skied. I am keeping a tally out of pure spite.', meta: '↑ 840 · 190 comments' }],
    },
    mums: {
      good: [
        { author: 'Sandra', avatar: '👩', body: 'That challenge had me CACKLING. {me} is a scream. Sent it to the WhatsApp. Barbara’s not watching this year and she is MISSING OUT 😂😂' },
        { author: 'Jacqui 🌸', avatar: '👩', body: 'The custard one 😂😂 I’ve not laughed like that since Denise fell in the paddling pool at the barbecue. {me} take a BOW ❤️' },
        { author: 'Denise (Admin)', avatar: '🧑‍🦱', body: 'That challenge had me in STITCHES. I’ve not laughed so hard since the hen do in Tenerife. {me} you are a TONIC. Sending it to the whole family WhatsApp ❤️😂' },
      ],
    },
    grid: {
      good: [{ author: '@villa.edits.daily', avatar: '🎬', body: 'the challenge clip is going VIRAL and rightly so 😭 {me} said the quiet part with their WHOLE chest. saving this forever', meta: '💬 view all 5,540 comments' }, { author: '@challenge.clips', avatar: '🎬', body: 'the challenge leaderboard has {me} at NUMBER ONE 🏆 and the slow-mo of them crossing the line covered in foam is going in the highlight reel forever 😭 saving on three devices', meta: '💬 view all 4,900 comments' }],
    },
    clock: {
      good: [{ author: 'creator', avatar: '⏰', body: 'the challenge did what the last three recouplings couldn’t: gave me a reason to live. {me} we are so back', pinned: true }, { author: 'up all night', avatar: '⏰', body: 'the challenge gave me more will to live than my actual life. {me} in the relay, foam everywhere, zero dignity and MAXIMUM commitment. we are so unbelievably back tonight' }],
      bad: [{ author: 'sleepy but here', avatar: '🥱', body: 'the challenge was RIGHT there and {me} played it safe. babe the point of the game is the game. i’m going to bed disappointed' }, { author: 'doomscroller', avatar: '🥱', body: 'the challenge hands you a microphone and a dare and {me} played it SAFE. babe. the whole point is the mess. i stayed up for mess. going to sleep annoyed and covered in crisps' }],
    },
  },
  rival: {
    bird: {
      good: [{ author: 'take merchant', avatar: '🐦', body: '{me} vs {rival} is the rivalry the season needed. one of them is lying and honestly? both. i’m team chaos, always' }, { author: 'ringside seat', avatar: '🐦', body: '{me} vs {rival} is the only storyline holding this season’s spine together. someone’s lying, someone’s crying, and i’ve got snacks. front row. no notes. do continue' }],
      bad: [{ author: 'ratio enthusiast', avatar: '🔥', body: '{rival} just DISMANTLED {me} on the daybed and {me} said “it is what it is.” IT IS NOT WHAT IT IS. STAND UP' }, { author: 'defend your name dot com', avatar: '🐦', body: '{rival} said three untrue things about {me} on the daybed and {me} said “i don’t want any drama.” babe the drama has MOVED IN. it has a key. defend your NAME' }],
    },
    forum: {
      good: [{ author: 'u/receipts_folder', avatar: '📁', body: '[TIMELINE] The {me} vs {rival} beef, sourced and timestamped. {rival} started it. I have screenshots I will not be sharing but trust me.', meta: '↑ 2.6k · 480 comments' }, { author: 'u/timeline_keeper', avatar: '👽', body: '[TIMELINE] The {me}/{rival} conflict cross-referenced against three episodes. {rival}’s version does not hold up on a rewatch. I did the rewatch. Somebody had to and it was me.', meta: '↑ 2.1k · 390 comments' }],
      bad: [{ author: 'u/where_is_the_backbone', avatar: '🧍', body: '{rival} is running circles around {me} and it’s painful. Assert yourself. This is a formal request from the forum.', meta: '↑ 1.4k' }, { author: 'u/spine_check', avatar: '🧍', body: '{rival} is out-manoeuvring {me} in every single conversation and it is genuinely uncomfortable viewing. Please locate a backbone. This is now a community-wide request. Sources on file.', meta: '↑ 1.3k' }],
    },
    mums: {
      bad: [{ author: 'Carol xx', avatar: '👩', body: 'That {rival} is a NASTY piece of work and I have said so from DAY ONE. You leave {me} ALONE. I know people. ❤️😤' }, { author: 'Sandra', avatar: '👩', body: 'That {rival} has a NASTY streak and I clocked it WEEKS ago. You do NOT speak to my {me} like that. I’ve half a mind to find their mother on Facebook. I won’t. But half a MIND 😤❤️' }],
      good: [{ author: 'Sandra', avatar: '👩', body: 'Well {me} handled {rival} like a GROWN UP and that’s all I’ll say. Kill them with kindness. Or a nice casserole. Proud ❤️👏' }, { author: 'Denise (Admin)', avatar: '🧑‍🦱', body: 'Well {me} rose ABOVE it with {rival} and that is BREEDING. You don’t sink to their level, you send a polite text and block them. Proud as PUNCH of that one ❤️👏' }],
    },
    grid: {
      good: [{ author: '@justhereforthedrama', avatar: '🍸', body: 'the {me} x {rival} standoff had me GASPING 😮 not a single frame wasted. put them both on the reunion FRONT ROW', meta: '💬 view all 2,900 comments' }, { author: '@rivalry.watch', avatar: '🍸', body: 'the {me} x {rival} standoff 😮 not one wasted glance. the tension could power a small town for a week. reunion producers TAKE NOTES 🍿', meta: '💬 view all 2,400 comments' }],
    },
    clock: {
      good: [{ author: 'doomscroller', avatar: '🌀', body: 'the villain arc between {me} and {rival} is writing itself and i’m taking notes for absolutely no reason. 4am. fine' }, { author: 'night shift', avatar: '🌀', body: 'the slow-burn beef between {me} and {rival} is better written than most shows with actual writers. taking notes at 4am for a screenplay i will never start. worth it' }],
      bad: [{ author: 'sleepy but here', avatar: '🥱', body: 'not {rival} reading {me} for filth and {me} just… taking it. blink twice if you need help babe. i’m awake. i’ll help' }, { author: 'should be asleep', avatar: '🥱', body: 'watching {rival} run rings around {me} and {me} just nodding along. blink twice if you need extraction babe. i’m awake. i’ve got a car. it’s a bike. i’m coming regardless' }],
    },
  },
  temptation: {
    bird: {
      good: [{ author: 'chaos gremlin 🍿', avatar: '😈', body: '“can i steal you for a chat” THE VERB IS DOING WORK. {me} the whole nation is watching where your feet point. choose violence' }, { author: 'the loyalty desk', avatar: '🐦', body: '“can i borrow you for a sec” and {me} said actually no i’m good. the RESTRAINT. the spine. i didn’t know i could respect a stranger this much. framing that answer' }],
      bad: [{ author: 'the timeline', avatar: '🐦', body: '{me} said “i’m just being friendly” with the body language of someone being extremely un-friendly. we have EYES' }, { author: 'unlicensed body reader', avatar: '🐦', body: '{me} keeps saying “nothing’s going on” while doing the fully-turned-towards-them knee thing. as a professional telly-watcher: the knee NEVER lies. the knee is TESTIFYING as we speak' }],
    },
    forum: {
      bad: [{ author: 'u/no_more_excuses', avatar: '👽', body: 'The “nothing happened” defence from {me}. Sir. Ma’am. There is footage. There is ALWAYS footage. EDIT 2: yes I’m being dramatic, it’s a dating show.', meta: '↑ 1.8k · 300 comments' }, { author: 'u/footage_exists', avatar: '👽', body: 'The “we were just talking” line from {me}. Sir. Madam. There are eleven cameras and a night-vision one. There is always a night-vision one. EDIT: yes I know it is a show. Let me have this.', meta: '↑ 1.5k · 260 comments' }],
      good: [{ author: 'u/where_is_the_backbone', avatar: '🧍', body: 'Genuinely did not expect {me} to shut the temptation down that cleanly. Screenshotting for the day I inevitably eat my words. Today is not that day. Respect.', meta: '↑ 1.3k · 90 comments' }, { author: 'u/pleasantly_surprised', avatar: '👽', body: 'Did not have “{me} shuts the temptation down cleanly” on my card. Consider me wrong-footed, in writing. I will now go and be quietly astonished for a while. Screenshots attached.', meta: '↑ 1.1k · 80 comments' }],
    },
    mums: {
      bad: [{ author: 'Sandra', avatar: '👩', body: 'I don’t LIKE where this is going. {me} think of {partner}. THINK OF THE NAN AT HOME. Do not do it. I am watching through my fingers 🙈🙏' }, { author: 'Carol xx', avatar: '👩', body: 'Oh {me} DON’T. Think of {partner}. Think of their NAN watching this at home with a cuppa. Put the candle DOWN and walk AWAY. I can’t watch. I’m watching. 🙈❤️' }],
      good: [{ author: 'Pam', avatar: '👵', body: 'And {me} said NO THANK YOU to that temptation and my HEART. THAT is a keeper. {partner} you don’t know how lucky you are ❤️❤️' }, { author: 'Marie', avatar: '👩', body: 'And {me} said “no thank you I’m happy” and I actually CLAPPED in my kitchen. THAT is a good egg. {partner} you’d best appreciate it. Loyalty like that is RARE these days ❤️👏' }],
    },
    grid: {
      good: [{ author: '@justhereforthedrama', avatar: '🍸', body: 'not the “stealing you for a chat” 💀💀 someone’s couple is OVER and they don’t know yet. comments are a warzone', meta: '💬 view all 3,100 comments' }, { author: '@temptation.tea', avatar: '🍸', body: 'not the “can i pull you for a chat” 💀 someone’s coupling is on LIFE SUPPORT and the comments are performing surgery without a licence. sound on 🍿', meta: '💬 view all 2,600 comments' }],
    },
    clock: {
      mid: [{ author: 'up all night', avatar: '🌙', body: 'the tension. the whispering. the ONE candle. i am unwell about {me} and it is a school night' }, { author: 'the rewatch account', avatar: '🌙', body: 'the whispering. the single flickering candle. the way {me}’s eyes did the thing. i am NOT okay and it is a Tuesday and i have a 9am. worth every minute of lost sleep' }],
    },
  },
  casa: {
    bird: {
      mid: [
        { author: 'the timeline', avatar: '🐦', body: 'CASA AMOR. the one week that ends careers. six new ones per villa and a postcode between {me} and {partner}. buckle UP everybody' },
        { author: 'ratio enthusiast', avatar: '🔥', body: 'casa amor is the only time production admits it’s a sociology experiment. {me} is the variable. {partner} is the control group. SCIENCE' },
        { author: 'sociology dropout', avatar: '🐦', body: 'CASA AMOR. two villas, one postcode of betrayal, and twelve new people whose only job is to test {me}’s memory of {partner}’s face. the cruellest maths on telly. i’m invested' },
      ],
      good: [{ author: 'ratio enthusiast', avatar: '🔥', body: '{me} at casa being solid and boring and LOYAL. boring? in THIS economy? i’m weirdly moved. keep it up you absolute rock' }, { author: 'the loyalty desk', avatar: '🐦', body: '{me} at casa being devastatingly boring and LOYAL while the other villa becomes a soap opera. boring has genuinely never been this hot. protect this behaviour at all costs' }],
      bad: [{ author: 'chaos gremlin 🍿', avatar: '😈', body: 'casa is testing {me} and {me} is FAILING upward into my heart. the audacity. the FOOTAGE. i’m screaming into a pillow' }, { author: 'popcorn account', avatar: '😈', body: 'casa is doing NUMBERS on {me}’s resolve and the resolve is losing by a landslide. i should feel bad. i feel ALIVE. the split-screen edit is going to be the end of me' }],
    },
    forum: {
      good: [{ author: 'u/methodical_viewer', avatar: '👽', body: '[CASA WATCH] Loyalty tracker, updated hourly. {me} currently in the green. If this holds it’s a redemption-of-the-format moment.', meta: '↑ 3.7k · 620 comments' }, { author: 'u/loyalty_ledger', avatar: '👽', body: '[CASA WATCH] Cross-villa loyalty tracker, hour 40. {me} still fully in the green while the graph elsewhere looks like a heart monitor flatlining. Rare. Screenshotting for posterity.', meta: '↑ 2.9k · 480 comments' }],
      bad: [{ author: 'u/mod_TheVilla', avatar: '🛡️', body: 'Pinning the Casa megathread. Please keep the {me} discourse in ONE place. My inbox cannot survive another split like last year.', meta: '📌 pinned' }, { author: 'u/megathread_survivor', avatar: '👽', body: 'Requesting we consolidate the {me} Casa discourse before the server melts like last year. My notifications have not stopped since the postcode reveal. Please. I have a job. I think.', meta: '↑ 1.2k · 210 comments' }],
    },
    mums: {
      good: [{ author: 'Denise (Admin)', avatar: '🧑‍🦱', body: 'Casa Amor is the DEVIL’S work and I won’t hear otherwise. But our {me} is being GOOD. I could cry. Faith in the young ones RESTORED 🙏❤️' }, { author: 'Sandra', avatar: '👩', body: 'Casa Amor. The DEVIL’S fortnight. But our {me} is being SO good and I am nearly in TEARS at the kitchen table. There’s hope for this generation after all ❤️🙏' }],
      bad: [{ author: 'Sandra', avatar: '👩', body: 'CASA. I hate this week. I hate it. I have said a prayer for {partner} who does not know yet. The mums are NOT ok 😭😭' }, { author: 'Pam', avatar: '👵', body: 'I can’t cope with Casa I really can’t. I’ve said a little prayer for {partner} sat there not KNOWING. My nerves are SHOT. Denise fetch the emergency Baileys 😭🙏' }],
    },
    grid: {
      mid: [{ author: '@thevilla', avatar: '🌴', body: 'the villa is splitting… 🧳 six new bombshells per side. whose head is turning? 👀 #CasaAmor', meta: '💬 view all 12,400 comments' }, { author: '@casa.watch', avatar: '🧳', body: 'THE VILLA HAS SPLIT 🧳💔 twelve new bombshells, one loyalty test, zero context. whose head turns? 👀 tag someone who won’t survive the week #CasaAmor', meta: '💬 view all 9,300 comments' }],
    },
    clock: {
      bad: [{ author: 'doomscroller', avatar: '🌀', body: 'casa amor is a psychological experiment and i am the lab rat. cannot sleep until i know if {me} held. it’s 4:12. send help' }, { author: 'should be asleep', avatar: '🌀', body: 'casa amor is a controlled experiment on the human heart and i am both the scientist and the crying test subject. cannot sleep till i know if {me} held. it’s 4:32. this is my life now' }],
    },
  },
  postcard: {
    bird: {
      bad: [{ author: 'chaos gremlin 🍿', avatar: '😈', body: 'THE POSTCARD. one photo, zero context, cropped by a producer who deserves a RAISE. {partner}’s face just did a thing. i rewound it nine times' }, { author: 'the crop conspiracy', avatar: '🐦', body: 'THE POSTCARD. one photo, no sound, cropped by a producer who deserves a BAFTA for cruelty. {partner}’s jaw hit the DECKING. i’ve rewound it until my thumb ached' }],
      good: [{ author: 'the timeline', avatar: '🐦', body: 'the postcard tried to frame {me} and the edit could NOT find anything. loyal king/queen behaviour. production is SEETHING' }, { author: 'nothing to see here', avatar: '🐦', body: 'the postcard tried to catch {me} slipping and the ONLY photo they had was {me} making tea alone looking sad. loyal AND tragic. production is FUMING. i am delighted' }],
    },
    forum: {
      bad: [{ author: 'u/receipts_folder', avatar: '📁', body: '[POSTCARD ANALYSIS] Frame-by-frame. What the crop is HIDING about {me}. I have thoughts and a zoom tool and no life.', meta: '↑ 2.1k · 380 comments', replies: [{ author: 'u/lurker_no_more', avatar: '👽', body: 'the enhance meme is real but so is the analysis. bookmarking' }] }, { author: 'u/frame_forensics', avatar: '👽', body: '[POSTCARD ANALYSIS] Enhanced the background. The angle implies proximity but the shadows say a metre apart, minimum. {me} is being STITCHED. I have a shadow diagram. Ask me anything.', meta: '↑ 1.9k · 340 comments' }],
      good: [{ author: 'u/methodical_viewer', avatar: '👽', body: 'The postcard tried to frame {me} and there was NOTHING to work with. Production is malding. A loyal frame in this economy. Rare footage.', meta: '↑ 1.8k · 210 comments' }, { author: 'u/nothing_burger', avatar: '👽', body: 'The postcard reveal: they had NOTHING on {me}. The worst frame was them mid-yawn. Production scraped the barrel and the barrel came back loyal. A rare W. Logging it in the spreadsheet.', meta: '↑ 1.6k · 190 comments' }],
    },
    mums: {
      bad: [{ author: 'Carol xx', avatar: '👩', body: 'That postcard is EDITED. It’s not what it looks like. My {me} would NEVER. I refuse. Sandra back me up. ❤️😤' }, { author: 'Denise (Admin)', avatar: '🧑‍🦱', body: 'That postcard is EDITED to look bad and I will not be told otherwise. They ANGLE it on purpose. My {me} would NEVER. Have a word with yourselves, producers 😤❤️' }],
    },
    grid: {
      bad: [{ author: '@justhereforthedrama', avatar: '🍸', body: 'the POSTCARD 📮💀 the way {partner} clocked it across the pool. i felt that in my SPINE. comments are feral', meta: '💬 view all 4,020 comments' }, { author: '@postcard.panic', avatar: '📮', body: 'the POSTCARD reveal 💀 the way {partner} clocked it from across the lawn and went STILL. i felt that in my ribs. comments are an actual crime scene 🫣', meta: '💬 view all 3,600 comments' }],
    },
    clock: {
      bad: [{ author: '3am thoughts', avatar: '🌙', body: 'a postcard did more emotional damage than my last three relationships combined. {me} what did you DO. i need part two' }, { author: 'crying in the club', avatar: '🌙', body: 'a single postcard did more damage than my entire dating history combined. one photo. no words. {me} what did you DO. i need the full unedited tape and it’s 3am and i’ll never get it' }],
    },
  },
  movienight: {
    bird: {
      bad: [
        { author: 'ratio enthusiast', avatar: '🔥', body: 'MOVIE NIGHT. the reel is rolling. {me}’s casa footage is playing to the WHOLE villa in HD with SOUND. i have not blinked. this is cinema', replies: [{ author: 'popcorn account', avatar: '🍿', body: 'i paused. i rewound. i am a scientist now' }] },
        { author: 'the timeline', avatar: '🐦', body: 'the SILENCE after {me}’s clip. you could hear a spray tan dry. {partner}’s face has left the building. sending this to my ex for no reason' },
        { author: 'the reel deal', avatar: '🐦', body: 'MOVIE NIGHT. {me}’s casa clip is playing at FULL VOLUME to a silent villa and {partner}’s soul just left through the top of their head. i have not blinked since the popcorn came out' },
      ],
      good: [{ author: 'chaos gremlin 🍿', avatar: '😈', body: 'movie night and {me}’s reel is CLEAN. boring. NOTHING. and yet {partner}’s reel… oh we are eating tonight. couldn’t be {me}' }, { author: 'popcorn account', avatar: '😈', body: 'movie night and {me}’s reel is spotless and {partner}’s reel is a whole four-part docuseries. the tables have TURNED and i am dining out tonight. couldn’t be {me} for once' }],
    },
    forum: {
      bad: [
        { author: 'u/methodical_viewer', avatar: '👽', body: '[MOVIE NIGHT LIVE] Reaction shots, ranked by devastation. {me}’s footage lands at a solid 9/10 on the wince scale. Nobody wins Movie Night. Nobody ever has.', meta: '↑ 5.2k · 900 comments', replies: [{ author: 'u/liveblog_hero', avatar: '👽', body: 'updating the sheet in real time. we are at DEFCON 2. send snacks' }] },
        { author: 'u/wince_index', avatar: '👽', body: '[MOVIE NIGHT LIVE] Live-scoring every reaction on the flinch scale. {me}’s clip triggered a collective villa inhale I have logged at 8.5. Nobody survives Movie Night. Updating in the comments.', meta: '↑ 4.1k · 720 comments' },
      ],
      good: [{ author: 'u/cautiously_optimistic', avatar: '👽', body: 'For once the clean reel belongs to {me} and the mess belongs to the OTHER side. I have screenshots. I have peace. I have a bowl of cereal at midnight.', meta: '↑ 2.7k · 310 comments' }, { author: 'u/vindicated_at_last', avatar: '👽', body: 'For ONCE the damning footage belongs to the other side and {me} sat there clean. I have waited eleven seasons for a night like this. Eating cereal. At peace. Timestamped for the doubters.', meta: '↑ 2.4k · 280 comments' }],
    },
    mums: {
      bad: [{ author: 'Sandra', avatar: '👩', body: 'MOVIE NIGHT is CRUEL. Why do they DO this. My nerves. {me} sit DOWN. Denise put the kettle on we are going to be here a WHILE 😭😭🙏' }, { author: 'Carol xx', avatar: '👩', body: 'MOVIE NIGHT is BARBARIC. Showing them all the clips like that. My HEART. {me} love just breathe. Pam pass the Quality Street we’re in for a long one 😭❤️' }],
      good: [{ author: 'Denise (Admin)', avatar: '🧑‍🦱', body: 'Well {me}’s bit was CLEAN as a whistle and I am VINDICATED. I said it. I said they were a good one. Screenshot this ❤️👏' }, { author: 'Sandra', avatar: '👩', body: 'Well {me}’s clip was CLEAN and I feel VINDICATED to my CORE. Barbara said they’d be trouble and Barbara is WRONG again. Screenshot it for the group ❤️👏' }],
    },
    grid: {
      bad: [{ author: '@villa.edits.daily', avatar: '🎬', body: 'MOVIE NIGHT REACTIONS 🎬🍿 slowing down every single face. {me} at 00:14 is a WHOLE meme now. you’re welcome', meta: '💬 view all 9,800 comments', replies: [{ author: '@meme.mill', avatar: '😹', body: 'already made the format. link in bio. we move FAST' }] }, { author: '@reaction.reels', avatar: '🍿', body: 'MOVIE NIGHT FACE CAM 🍿🎬 slowing down every reaction frame by frame. {me} at 00:19 is a whole meme template now. you’re SO welcome 💀', meta: '💬 view all 8,100 comments' }],
    },
    clock: {
      bad: [{ author: 'creator', avatar: '⏰', body: 'movie night is the villa’s roman colosseum and we are the emperors doing the thumbs down. {me} i’m so sorry i cannot look away', pinned: true }, { author: 'up all night', avatar: '⏰', body: 'movie night is the colosseum and we’re all up in the stands doing the thumbs. {me} i’m so sorry. i cannot look away. i’ve tried. the reel is RIGHT there' }],
      good: [{ author: 'up all night', avatar: '🌙', body: 'the way {me}’s reel had NOTHING and everyone else’s was a whole true crime docuseries. sleeping so well tonight. lowercase justice' }, { author: 'the rewatch account', avatar: '🌙', body: 'the way {me}’s reel was NOTHING and everyone else’s was a true-crime boxset. sleeping like a BABY tonight. lowercase justice has been served and it tastes like Ovaltine' }],
    },
  },
  recoupling: {
    bird: {
      good: [{ author: 'the timeline', avatar: '🐦', body: 'RECOUPLING. everyone stands. {me} survives. the exhale in this house. i don’t even know these people why am i sweating' }, { author: 'edge of the sofa', avatar: '🐦', body: 'RECOUPLING and {me} survived and i physically exhaled so hard the cat left the room. why do i care this much about people who will never know my name. anyway. sweet relief' }],
      bad: [{ author: 'take merchant', avatar: '🐦', body: 'the recoupling did {me} DIRTY and the edit KNEW. hand held too long, chosen too late. i have questions and a comments section' }, { author: 'the edit knew', avatar: '🐦', body: 'the recoupling framed {me} LAST, held the pause a beat too long, and cut to a seagull. the edit is doing a HIT JOB and i’m filing a complaint with a channel that cannot hear me' }],
      mid: [{ author: 'chaos gremlin 🍿', avatar: '😈', body: 'a recoupling is just musical chairs where the music is someone crying and the chair is a relationship. {me} sit down carefully' }, { author: 'musical chairs analyst', avatar: '🐦', body: 'a recoupling is just musical chairs except losing means a taxi to the airport and a “journey” speech. {me} for the love of everything please get a chair. any chair. sit' }],
    },
    forum: {
      good: [{ author: 'u/cautiously_optimistic', avatar: '👽', body: '[RECOUPLING] {me} held on the strength of the actual connection, not the edit. Rare. Noted. Screenshotting for the doubters.', meta: '↑ 2.0k · 210 comments' }, { author: 'u/held_the_line', avatar: '👽', body: '[RECOUPLING] {me} chose on the connection, not the numbers, and it held. In this format that is nearly a miracle. Filing under rare footage. Doubters, the screenshot is attached below.', meta: '↑ 1.8k · 190 comments' }],
      bad: [{ author: 'u/where_is_the_backbone', avatar: '🧍', body: 'The recoupling exposed {me} and the numbers were NOT there. Discussed this would happen in my week-2 thread. Nobody listens to me.', meta: '↑ 1.7k · 340 comments' }, { author: 'u/i_called_it', avatar: '👽', body: 'The recoupling went exactly as my week-two thread predicted for {me}. The numbers were never there. I would love to be gracious about this but I have been RIGHT for weeks. In writing.', meta: '↑ 1.5k · 300 comments' }],
    },
    mums: {
      good: [{ author: 'Denise (Admin)', avatar: '🧑‍🦱', body: 'THEY’RE SAFE. {me} is SAFE. I stood up in my LIVING ROOM. Barry thought something happened. Something DID happen. ❤️❤️❤️' }, { author: 'Pam', avatar: '👵', body: 'THEY’RE SAFE. Oh {me}. I clutched my CHEST. My Derek came running thinking I’d had a fall. I HAD not. I’d had a MOMENT. What an absolute relief ❤️❤️' }],
      bad: [{ author: 'Pam', avatar: '👵', body: 'Oh no. Oh {me}. Come here love. That firepit is a cruel place. I’ve turned it off. No I haven’t. But I said I would 😢' }, { author: 'Sandra', avatar: '👩', body: 'Oh {me}. Oh love. Come away from that fire pit it’s a WICKED place. I’ve a spare room made up and everything. The public don’t KNOW you like we do 😢❤️' }],
    },
    grid: {
      good: [{ author: '@casualfan_22', avatar: '💗', body: 'the recoupling had me on the FLOOR 😭 {me} and {partner} standing there holding hands like it’s a wedding. i’m INVESTED invested', meta: '💬 view all 3,600 comments' }, { author: '@ship.it.daily', avatar: '💗', body: 'the RECOUPLING 😭 {me} and {partner} holding hands like it’s a WEDDING and i am fully SOBBING into a cushion. invested doesn’t even cover it. saving this forever 🫶', meta: '💬 view all 3,200 comments' }],
      bad: [{ author: '@justhereforthedrama', avatar: '🍸', body: 'the recoupling did {me} so dirty i gasped into my cereal 😮 the EDITORS knew. framing them last on PURPOSE. we riot', meta: '💬 view all 2,780 comments' }, { author: '@editors.are.evil', avatar: '🍸', body: 'the recoupling did {me} SO dirty 😮 framed last on PURPOSE, cut to a sad seagull, the WORKS. we ride at dawn for {me}. justice 🫶', meta: '💬 view all 2,500 comments' }],
    },
    clock: {
      good: [{ author: 'up all night', avatar: '🌙', body: 'recoupling nights take a YEAR off my life and i keep coming back. {me} you don’t even know i exist and i almost fainted for you' }, { author: 'crying in the club', avatar: '🌙', body: 'recoupling nights genuinely shave time off my life and i keep RSVPing. {me} you have no idea i exist and i nearly passed out when they said your name. worth it. lowercase forever' }],
      bad: [{ author: 'creator', avatar: '⏰', body: 'the pause before they said the name. i have watched it 40 times. {me} i felt your whole heart drop and mine went with it. 3am agony', pinned: true }, { author: 'should be asleep', avatar: '🌙', body: 'the pause before the name. the little breath {me} took. i’ve watched it thirty times and it destroys me thirty times. it’s 3am and i am not okay and i chose this life' }],
    },
  },
  dumping: {
    bird: {
      bad: [
        { author: 'the timeline', avatar: '🐦', body: 'and just like that {me} is DUMPED. the suitcase. the gravel. the tasteful piano. gone but the clip will outlive us all. pour one out 🕯️' },
        { author: 'take merchant', avatar: '🐦', body: 'they dumped {me} and kept the ones doing NOTHING. this is why we can’t have nice votes. i am NORMAL about this (i am not)' },
        { author: 'the send-off desk', avatar: '🐦', body: '{me} DUMPED. the suitcase on the gravel. the slow walk. the piano that only plays when a heart breaks. gone from the villa, immortal on the timeline. 🕯️ pour one out' },
      ],
      good: [{ author: 'chaos gremlin 🍿', avatar: '😈', body: '{me} got dumped and gave a goodbye speech so GRACIOUS the nation immediately regretted the vote. villain-to-victim pipeline. iconic exit tbh' }, { author: 'exit interview', avatar: '😈', body: '{me} got dumped and delivered a goodbye speech so classy the entire nation did a collective “wait no bring them BACK.” too late. iconic exit. villain-to-saint in one taxi ride' }],
    },
    forum: {
      bad: [{ author: 'u/methodical_viewer', avatar: '👽', body: '[DUMPING] {me} out. Post-mortem thread. Honestly a better edit than half the ones staying. The vote is not a meritocracy and I have a graph proving it.', meta: '↑ 3.9k · 700 comments', replies: [{ author: 'u/i_called_it', avatar: '👽', body: 'the graph checks out. the villa does not deserve the graph.' }] }, { author: 'u/post_mortem_dept', avatar: '👽', body: '[DUMPING] {me} eliminated. Season-arc autopsy inside. Better edit, better lines, better everything than three people still in there. The public vote is not a meritocracy. I have the regression to prove it.', meta: '↑ 3.1k · 620 comments' }],
    },
    mums: {
      bad: [
        { author: 'Sandra', avatar: '👩', body: 'THEY DUMPED {me}?? THE PUBLIC?? I VOTED FORTY TIMES. I am WRITING IN. This is a DISGRACE. Denise start the petition 😭😭😤' },
        { author: 'Pam', avatar: '👵', body: 'I’m ever so sad about {me}. Made myself a Horlicks. It’s not the same in there now. Come home safe love ❤️😢' },
        { author: 'Carol xx', avatar: '👩', body: 'They’ve DUMPED {me}?? After all that?? I am writing a STRONGLY worded review of this entire programme. My {me}. GONE. I’ve gone right off my tea. DISGUSTING 😤😢' },
      ],
    },
    grid: {
      bad: [{ author: '@villa.edits.daily', avatar: '🎬', body: 'not {me} being dumped 😭 doing a tribute edit rn to their best moments. link in bio. we were ROBBED. justice for {me}', meta: '💬 view all 6,700 comments' }, { author: '@tribute.edits', avatar: '🎬', body: 'not {me} being DUMPED 😭😭 doing a full tribute edit to every iconic moment. link in bio. we were ROBBED in broad daylight. justice for {me} forever 🕯️', meta: '💬 view all 5,800 comments' }],
    },
    clock: {
      bad: [{ author: 'creator', avatar: '⏰', body: '{me} leaving the villa broke something in me. it’s 3am and i’m watching their entrance VT again. grief is not linear', pinned: true, replies: [{ author: 'also crying', avatar: '😭', body: 'we mourn as a community. the fyp is a funeral tonight' }] }, { author: 'up all night', avatar: '🌙', body: '{me} leaving snapped something in my chest at 3am. rewatching their day-one entrance VT on loop like a widow with a locket. grief has no bedtime. the fyp is in mourning tonight' }],
    },
  },
  vote: {
    bird: {
      mid: [{ author: 'the timeline', avatar: '🐦', body: 'PUBLIC VOTE OPEN. this is the one week our opinions actually load-bear. use your power responsibly (i will be voting for chaos)' }, { author: 'civic duty (villa)', avatar: '🐦', body: 'PUBLIC VOTE IS OPEN. the one week a year my opinion has structural integrity. using it wisely (voting entirely for whoever gives me the most content). this is democracy' }],
      good: [{ author: 'ratio enthusiast', avatar: '🔥', body: 'voting {me} because they’re the only one giving me a reason to keep my phone charged. that’s the criteria. that’s always been the criteria' }, { author: 'the campaign trail', avatar: '🐦', body: 'voting {me} because they are the only reason my phone is at 4 percent by 10pm. that is the metric. that has ALWAYS been the metric. everyone get your thumbs OUT' }],
      bad: [{ author: 'take merchant', avatar: '🐦', body: 'not voting {me} and i want that on the record. build a personality and call me. the polls are OPEN and my thumb is IDLE' }],
    },
    forum: {
      good: [{ author: 'u/methodical_viewer', avatar: '👽', body: '[VOTE THREAD] Strategic voting guide, updated. {me} needs the numbers. Yes, this is a spreadsheet about a dating show. No, I will not be taking questions.', meta: '↑ 2.4k · 280 comments' }, { author: 'u/tactical_voter', avatar: '👽', body: '[VOTE THREAD] Bloc-voting guide, revised. {me} is vulnerable on the split. If you rate them, do NOT hedge across two names. This is the one civic act I perform without cynicism. Mobilise now.', meta: '↑ 2.0k · 240 comments' }],
      mid: [{ author: 'u/devils_advocate_pro', avatar: '👽', body: 'PSA: vote-splitting is how good couples go home. If you like {me}, vote {me}, not the safe pick. This is the only civic duty I take seriously.', meta: '↑ 1.1k · 160 comments' }, { author: 'u/vote_math', avatar: '👽', body: 'PSA with actual arithmetic: vote-splitting is how the good couples go home in fourth. If {me} is your pick, commit the whole vote. I made a diagram. The diagram is begging you.', meta: '↑ 1.0k · 150 comments' }],
    },
    mums: {
      good: [{ author: 'Denise (Admin)', avatar: '🧑‍🦱', body: 'GIRLS the vote is OPEN. I have voted for {me} on all THREE of my phones AND the tablet. This is a group EFFORT. Rally the aunties ❤️📱' }, { author: 'Sandra', avatar: '👩', body: 'VOTE for {me} girls I MEAN it. I’ve done it on my phone, Barry’s phone AND the iPad. My thumb is KNACKERED but it’s worth it. Rally the WhatsApp. This is WAR ❤️📱' }],
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
      mid: [{ author: 'take merchant', avatar: '🐦', body: 'beach hut confessional from {me}. one chair, one mic, one perfectly framed breakdown. this is the realest they’ve been all season and it’s to a CAMERA' }, { author: 'the confession booth', avatar: '🐦', body: 'the beach hut is the only place {me} tells the truth and it’s to a wall with a lens in it. we are all the wall. we are all the lens. anyway. crying' }],
      good: [{ author: 'the timeline', avatar: '🐦', body: 'the beach hut got more honesty out of {me} in 30 seconds than the whole villa managed in a week. put a camera in there PERMANENTLY' }, { author: 'the honesty account', avatar: '🐦', body: '{me} said more real things to a beanbag in the beach hut than most people manage in therapy. give the beanbag a producer credit' }],
    },
    forum: {
      good: [{ author: 'u/cautiously_optimistic', avatar: '👽', body: 'The Beach Hut clip of {me} was actually vulnerable and self-aware. I take back one (1) of my criticisms. The others stand.', meta: '↑ 900 · 60 comments' }, { author: 'u/first_time_poster', avatar: '👽', body: 'The {me} Beach Hut clip is the first genuine self-awareness I have seen on this programme. Framing it. EDIT: yes I know it is a dating show, let me have this one.', meta: '↑ 740 · 55 comments' }],
    },
    mums: {
      good: [{ author: 'Pam', avatar: '👵', body: 'The Beach Hut bit made me well up. {me} just needs a good sleep and a proper meal. I’d have them round for a Sunday dinner in a HEARTBEAT ❤️' }, { author: 'Denise (Admin)', avatar: '🧑‍🦱', body: 'Aww that Beach Hut. {me} just needs a cuddle and a roast. I’ve half a mind to drive down there myself. Barry says I can’t. Barry is wrong ❤️' }],
    },
    grid: {
      mid: [{ author: '@casualfan_22', avatar: '💗', body: 'beach hut {me} said what we were all thinking 🥲 protect them', meta: '💬 view all 700 comments' }, { author: '@softlaunch.edits', avatar: '🎬', body: 'the beach hut monologue 🥲 {me} being SO honest to a camera. clipping it, subtitles incoming. protect the beanbag confessor at all costs 🫶', meta: '💬 view all 640 comments' }],
    },
    clock: {
      mid: [{ author: '3am thoughts', avatar: '🌙', body: 'the beach hut is where they take the mask off and mine is off too. it’s just me and {me} being honest at 4am. parasocial but healing' }, { author: 'up too late', avatar: '🌙', body: 'the beach hut is just {me}, a lens, and the truth at 2am. same energy as my notes app. we are the same, actually. goodnight to the beanbag specifically' }],
    },
  },
  parents: {
    bird: {
      good: [{ author: 'the timeline', avatar: '🐦', body: 'MEET THE PARENTS. the mum walked in with the FACE. the assessing. the polite terror. {me} and {partner} sweating through the linen. peak telly' }, { author: 'the in-law watch', avatar: '🐦', body: 'the mum did the handshake-into-hug-into-interrogation combo on {partner} and i have never respected a stranger more. {me} sat up so STRAIGHT. family week is unbeaten telly' }],
      bad: [{ author: 'take merchant', avatar: '🐦', body: 'the mum asked {me} ONE question and {me} folded like a deckchair. mums are the real lie detector on this show and i love them for it' }, { author: 'the flop detector', avatar: '🐦', body: 'the dad asked {me} “so what are your intentions” and {me} said “i’m a Pisces.” sir. SIR. that was not the question. the linen is sweating on their behalf' }],
    },
    forum: {
      mid: [{ author: 'u/methodical_viewer', avatar: '👽', body: '[FAMILY WEEK] The parent read on {me} is the closest thing to an unbiased audit this format has. Watch the mum’s eyebrows. That’s the real verdict.', meta: '↑ 1.5k · 130 comments' }, { author: 'u/body_language_dept', avatar: '👽', body: '[FAMILY WEEK] The parent’s micro-expressions during the {me} chat are the only honest data we get all season. I have annotated the eyebrows frame by frame. Thread below.', meta: '↑ 1.1k · 90 comments' }],
    },
    mums: {
      good: [{ author: 'Sandra', avatar: '👩', body: 'THE MUMS ARE IN. This is MY superbowl. Finally someone in that villa asking the RIGHT questions. {me} sit up STRAIGHT for her 👏❤️' }, { author: 'Jacqui 🌸', avatar: '👩', body: 'The MUM. Finally one of us in the building. She clocked {me} in three seconds flat, same as I did in week one. Mums KNOW. Lovely to see the families ❤️❤️' }],
      bad: [{ author: 'Carol xx', avatar: '👩', body: 'That mum has {me}’s number and so do I. You can’t fool a mother. We SEE things. Anyway lovely to see the families ❤️😤' }, { author: 'Pam', avatar: '👵', body: 'Ooh that mother is not convinced about {me}, and if I’m honest neither am I. But she was ever so polite about it. That’s how it’s done. Take notes 🙏' }],
    },
    grid: {
      good: [{ author: '@villa.edits.daily', avatar: '🎬', body: 'the parents meeting {partner} 🥹 the mum’s reaction is the edit of the SEASON. clipping {me}’s face at 00:22 immediately', meta: '💬 view all 2,100 comments' }, { author: '@villa.family.era', avatar: '🎬', body: 'the parents arriving 😭🥹 {me}’s mum hugging {partner} is the edit of the WEEK. clipping the exact second the dad approved. link in bio 🫶', meta: '💬 view all 1,700 comments' }],
    },
    clock: {
      good: [{ author: 'up all night', avatar: '🌙', body: 'watching {me}’s family come in and sobbing like it’s MY family. i have never met these people. this is my family now. goodnight' }, { author: 'sobbing again', avatar: '🌙', body: 'not me watching {me}’s dad tear up over them and fully weeping into a pillow at 3am. i do not know this family. the parasocial went PARENTAL tonight' }],
    },
  },
  ick: {
    bird: {
      bad: [{ author: 'ick correspondent', avatar: '🐦', body: 'the ICK just visited {me} live on air. you could see the exact frame love left the body. i felt it too. we all felt it. rip' }, { author: 'the frame-by-frame', avatar: '🐦', body: 'you can PINPOINT the frame {me} caught the ick. paused it. it’s the little inhale. love packed a bag mid-sentence. we all saw the bag. rip to that couple' }],
      mid: [{ author: 'chaos gremlin 🍿', avatar: '😈', body: 'nothing HAPPENED but {me}’s face said everything. the ick is a silent killer and it has entered the villa. no survivors' }, { author: 'ick forecaster', avatar: '🐦', body: '{me} said nothing but the FACE did a full press conference. the ick doesn’t knock, it just moves in. no notice, no deposit. brutal tenant' }],
    },
    forum: {
      mid: [{ author: 'u/receipts_folder', avatar: '📁', body: '[DISCUSSION] Cataloguing the exact moment {me} caught the ick. Timestamped. It was the way they said it. We’ve all been there. Solidarity thread.', meta: '↑ 1.2k · 190 comments' }, { author: 'u/second_opinion', avatar: '👽', body: '[DISCUSSION] Timestamping the precise ick onset in the {me} scene. It was the chewing. It is ALWAYS the chewing. Compiling a supercut for science. Solidarity to the afflicted.', meta: '↑ 980 · 160 comments' }],
      good: [{ author: 'u/cautiously_optimistic', avatar: '👽', body: 'Respect to {me} for NAMING the ick out loud instead of ghosting for three days like the rest of the villa. Emotional literacy on a dating show. Sit down, I need a minute.', meta: '↑ 1.4k · 120 comments' }, { author: 'u/methodical_viewer', avatar: '👽', body: 'Genuinely rare: {me} felt the ick and SAID SO instead of going cold for a week. On a dating show. Updating my ranking accordingly. Emotional literacy noted, with sources.', meta: '↑ 1.3k · 110 comments' }],
    },
    mums: {
      mid: [{ author: 'Carol xx', avatar: '👩', body: 'Now don’t throw it ALL away over a little ick {me}. My Kevin chews with his mouth open and we’ve been married 31 years. Push THROUGH ❤️' }, { author: 'Sandra', avatar: '👩', body: 'A little ick never hurt anyone {me}. My Terry breathes funny and I’ve loved him 40 years. You WORK at it. Don’t you dare bin a good one over a chewing noise ❤️😤' }],
    },
    grid: {
      mid: [{ author: '@justhereforthedrama', avatar: '🍸', body: 'the ICK arc 😭 {me}’s face did NOT recover. respectfully this is the most relatable they’ve ever been', meta: '💬 view all 1,400 comments' }, { author: '@relatable.villa', avatar: '💗', body: 'the ick arc 😭 {me}’s face said everything we’ve all felt on a third date. clipping it for the girls’ group chat immediately. too real 🫠', meta: '💬 view all 1,200 comments' }],
    },
    clock: {
      mid: [{ author: 'doomscroller', avatar: '🌀', body: 'not {me} catching the ick in real time. i’ve scrubbed this frame 30 times. you can see the EXACT second their face changed. we all clocked it. rip' }, { author: '3am diagnosis', avatar: '🌀', body: 'watched {me} get the ick in real time and felt it in my OWN body at 3am. the little exhale. the polite nod. the eyes going somewhere else. we’ve all been there. rip. anyway rewatching' }],
    },
  },
  repair: {
    bird: {
      good: [{ author: 'the timeline', avatar: '🐦', body: '{me} out here doing the GROVEL properly. coffees, towels, the public apology. redemption arc unlocked. i’m a sucker and i’m clapping' }, { author: 'the redemption desk', avatar: '🐦', body: 'okay {me} is doing the grovel RIGHT. coffee, towel, no big speech, just showing up. i came to hate and i’m clapping. character development on MY dating show?' }],
      bad: [{ author: 'take merchant', avatar: '🐦', body: 'the “i’m focusing only on you” speech from {me}. mate we have the RECEIPTS. the grovel needs to be LONGER and the coffee HOTTER' }, { author: 'the parole board', avatar: '🐦', body: 'the {me} apology tour is on day two and i’m not sold. one oat latte does not undo the FOOTAGE. serve the coffee for a WEEK then we’ll talk. probation denied' }],
    },
    forum: {
      good: [{ author: 'u/cautiously_optimistic', avatar: '👽', body: '[REPAIR WATCH] {me} is doing the actual work: consistent, small, unglamorous. This is what a real apology looks like. Noting it before I forget to be nice.', meta: '↑ 1.6k · 140 comments' }, { author: 'u/receipts_folder', avatar: '📁', body: '[REPAIR LOG] Documenting {me}’s repair day by day, with timestamps. Consistency score climbing. This is what earning it actually looks like. Noting it while I still can.', meta: '↑ 1.2k · 95 comments' }],
      bad: [{ author: 'u/no_more_excuses', avatar: '👽', body: 'The forgiveness is coming too easy from the other side. Self-respect check. Make {me} EARN it. Sources: every season ever.', meta: '↑ 1.9k · 260 comments' }, { author: 'u/where_is_the_backbone', avatar: '🧍', body: '[DISCUSSION] The other half is forgiving {me} too fast, sourced. Three coffees is not a repair, it is a Tuesday. Make them run the full lap. Formal request.', meta: '↑ 1.5k · 230 comments' }],
    },
    mums: {
      good: [
        { author: 'Sandra', avatar: '👩', body: 'He’s SERVING HER COFFEE. THAT’S how you say sorry. Take NOTES lads. {me} you’re doing it RIGHT for once ❤️❤️👏' },
        { author: 'Denise (Admin)', avatar: '🧑‍🦱', body: 'A proper apology is COFFEE and CONSISTENCY not a big speech. {me} has clearly been raised right after all. I’m BIG enough to say I was wrong ❤️' },
      ],
    },
    grid: {
      good: [{ author: '@casualfan_22', avatar: '💗', body: 'the repair era 🥹 {me} making it right the slow way. i’m rooting for them SO hard now. character growth we love to see', meta: '💬 view all 1,100 comments' }, { author: '@growth.era.edits', avatar: '🎬', body: 'the {me} redemption arc 🥹 coffees, towels, the public apology. slow-mo edit of the firepit speech incoming. we love an accountable one 🫶', meta: '💬 view all 980 comments' }],
    },
    clock: {
      good: [{ author: '3am thoughts', avatar: '🌙', body: 'the little acts of service redemption arc {me} is on is healing something in me personally. it’s 4am. i forgive them. i forgive everyone' }, { author: 'soft launch', avatar: '🌙', body: 'the {me} acts-of-service apology is healing something in me at 4am. no grand gesture, just tea made right every morning. THAT’S the bar. THAT’S the romance. crying' }],
    },
  },
  final: {
    bird: {
      good: [{ author: 'ratio enthusiast', avatar: '🔥', body: 'THE FINAL. {me} made it. from beige-flag allegations to the FINAL. character development is real. voting till my thumb cramps' }, { author: 'the finale crier', avatar: '🐦', body: 'they made {me} a FINALIST and i’ve known them six weeks and i’ll be inconsolable regardless of the envelope. this is what the show DOES to you. voting till my thumb dies' }],
      mid: [{ author: 'the timeline', avatar: '🐦', body: 'final night. the vote is LIVE. every wing of this nation is holding a remote and a grudge. may the best story win (it won’t, but may it)' }, { author: 'the vote whip', avatar: '🐦', body: 'FINAL NIGHT. every wing of this nation is holding a remote and a grievance. {me} needs the numbers. i have three phones charged. this is my olympics. do NOT let me down' }],
      bad: [{ author: 'take merchant', avatar: '🐦', body: '{me} in the final on vibes ALONE. no story, no scandal, just a nice couple. the drama wing is asleep. bold strategy. we’ll see' }, { author: 'the story critic', avatar: '🐦', body: '{me} coasting into the final on being nice. no arc, no scandal, no THREAD. i respect the peace but the crown likes a story and yours is a lovely screensaver. we’ll see' }],
    },
    forum: {
      good: [{ author: 'u/methodical_viewer', avatar: '👽', body: '[FINALE] Full-season arc breakdown for {me}. Jilted → tested → back on the horse. This is the story the crown rewards. Data attached. Good luck OP’s fave.', meta: '↑ 6.1k · 1.1k comments' }, { author: 'u/cautiously_optimistic', avatar: '👽', body: '[FINALE] Compiling the {me} season-long arc, with sources. Questioned it, cracked, came back. That is the exact story the envelope rewards. Data attached. Voting accordingly.', meta: '↑ 3.2k · 380 comments' }],
      mid: [{ author: 'u/where_is_the_backbone', avatar: '🧍', body: 'Respect where due: {me} kept the spine AND made the final. I criticised early and I stand corrected, in writing, timestamped.', meta: '↑ 2.2k' }, { author: 'u/the_archivist', avatar: '👽', body: '[FINALE] Ranking finalists by narrative completeness. {me} lands mid — solid couple, thin drama. History says the story beats the vibe. Prepared to be wrong, timestamped.', meta: '↑ 1.4k · 170 comments' }],
    },
    mums: {
      good: [
        { author: 'Denise (Admin)', avatar: '🧑‍🦱', body: 'THE FINAL. Our {me}. I have known them since the STAIRS. I’ve got the good wine out. GIRLS we RAISED this one (we didn’t but we FELT it) ❤️❤️❤️🥂' },
        { author: 'Sandra', avatar: '👩', body: 'I have voted for {me} so many times my thumb has a cramp and Barbara is BACK for the final after saying she wasn’t watching. WELCOME BACK BARBARA. VOTE {me} ❤️📱' },
      ],
    },
    grid: {
      good: [{ author: '@villa.edits.daily', avatar: '🎬', body: 'FINALE EDIT IS UP 🏆 the {me} journey from day one to now had me SOBBING. link in bio. whatever happens they won US', meta: '💬 view all 11,900 comments', replies: [{ author: '@notif.gang', avatar: '🔔', body: 'not me watching this 6 times before the vote closes 😭🏆' }] }, { author: '@finale.fancam.hub', avatar: '🎬', body: 'THE FINALE 🏆😭 {me}’s day-one-to-now edit is UP and i am DECEASED. link in bio. whatever the envelope says they won the whole internet 🫶🏆', meta: '💬 view all 9,400 comments' }],
    },
    clock: {
      good: [{ author: 'creator', avatar: '⏰', body: 'we started this season as strangers and now i’m crying over {me} at the finale like they’re my child leaving for uni. worth every sleepless night', pinned: true }, { author: 'the whole journey', avatar: '🌙', body: 'started this season not knowing {me}’s name and now i’m ugly-crying at their finale like a proud parent at graduation. six weeks. worth every ruined sleep schedule. go win 🏆' }],
    },
  },
};

// The Narrator's teaser line — one layer up, his register (VOICE.md): dry,
// pun-forward, ≤1 bang. Rotated by family so the tap-prompt never reads twice
// the same in a season.
const TEASERS: Partial<Record<Family, string[]>> = {
  arrival: ['Behind the wall, the nation is deciding whether you have a personality.', 'Somewhere, five apps just clocked your walk down the stairs.', 'Sandra has already picked her favourite. Sandra is two hundred thousand people.', 'The intro VT ran once. The screenshots are already forever.'],
  bombshell: ['The internet has already picked a side. Both sides, actually.', 'Five group chats just lit up at once. None of them are yours.', 'A new arrival, and the timeline skipped its own tea to watch.', 'The wall can’t hear the gasp. You’re lucky. It’s loud out here.'],
  date: ['The nation watched. The nation has notes.', 'Two chairs, one drone, and a country with opinions about the fountain.', 'The date lasted an hour. The commentary’s going long.', 'Somewhere, someone paused it to analyse where your feet were pointing.'],
  challenge: ['The clip went home before you did.', 'The feeds are up. Someone made a sticker pack already.', 'One challenge, five recaps, and a nation of armchair judges.', 'The scoreboard says one thing. The comments have a different tally.'],
  rival: ['The forum has opened a timeline. It has sources.', 'Two of you had a chat. Two million had a thread about it.', 'The bird app has appointed itself referee. Badly.', 'Somewhere, a spreadsheet of who-started-it is being colour-coded.'],
  temptation: ['The verb was doing work, and the nation noticed.', 'Somewhere, a mum is watching through her fingers.', 'The whole country is watching where your feet point. So are we.', 'Nothing happened, allegedly. The feeds are reviewing the footage.'],
  casa: ['Casa Amor: the one week the feeds do not sleep.', 'A postcode away, the whole internet is holding its breath.', 'Five feeds, one loyalty test, no context.', 'The nation has cleared its schedule. The nation regrets nothing.'],
  postcard: ['One photo. Zero context. Several thousand opinions.', 'The crop did numbers. So did the reactions.', 'A producer cropped it. The internet un-cropped it in nine minutes.', 'One postcard, and five feeds became forensic labs.'],
  movienight: ['The reel rolled. The feeds are feasting.', 'Nobody wins Movie Night. The internet does, though.', 'Someone made a meme of your face before the credits.', 'Someone slowed your reaction to 0.25x. They found three new things. They will tell you all of them.'],
  recoupling: ['Everyone stood up. So did the like counts.', 'The firepit went quiet. The feeds did not.', 'The names got read. The threads got long.', 'A pause before a name, dissected in five dialects.'],
  dumping: ['The suitcase is on the gravel. The phone is already warm.', 'The villa forgets in a day. The internet does not.', 'Somewhere, a petition is being started on your behalf.', 'The tribute edit is already rendering, sad piano and all.'],
  vote: ['This is the week your opinions load-bear. The feeds know it.', 'The app has spoken. Loudly. In five dialects.', 'Five communities, one ballot, zero agreement.', 'The nation charged three phones for this. Use its power wisely.'],
  hut: ['You told the Beach Hut. The Beach Hut told everyone.', 'One chair, one mic, a nation of armchairs.', 'The realest thing you said all week, and it was to furniture.', 'The mask came off in the Hut. The screenshots put it online.'],
  parents: ['The mums are in. So are the mums online.', 'A family read the room. So did the timeline.', 'One parent’s eyebrow moved. Five feeds transcribed it.', 'The families landed, and so did every armchair in-law watching.'],
  ick: ['The whole nation felt that exact frame.', 'Love’s lie-detector pinged, live, on five platforms.', 'The feeds paused on the flinch. Everyone paused on the flinch.', 'A silent thing happened, loudly, on five screens.'],
  repair: ['The grovel is logistics. The nation is grading the logistics.', 'Coffees, towels, a public apology. The feeds are tallying.', 'The apology tour is being marked out of ten. Show your working.', 'One good deed a day, and a nation keeping the ledger.'],
  final: ['Every sofa in the country is holding a remote.', 'The nation is voting. It has been rehearsing all season.', 'Whatever the envelope says, the feeds have already decided.', 'Six weeks of feeds, one last ballot, zero calm.'],
  recap: ['A week happened. The outside world had a week too.', 'While you were in there, the nation was very much out here.', 'You missed a week of the country having opinions. Here they are.', 'The villa moved. So did five feeds, faster.'],
  ending: ['They hand you your phone. It is warm.', 'The villa is behind you. The feeds are forever.', 'Forty thousand unread messages. Start with the ones from your nan.', 'You leave the villa. The villa does not leave the timeline.'],
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

  // v5 doubling (ADR-0014 follow-up): the nation is LOUDER now. Each occasion
  // surfaces roughly double the posts it used to — up to four family reactions
  // and two standing-mood posts above the fold — so a pivotal moment reads like
  // a feed mid-scroll, not a headline. The corpus doubled to feed it (VOICE.md
  // § the second screen); the ≥2 floor and the pure-hash determinism are
  // untouched, so the honest-instrument invariant and the goldens still hold.
  const chosen: Frag[] = [];
  chosen.push(...sample(rng, famFrags, Math.min(4, famFrags.length)));
  chosen.push(...sample(rng, moodFrags, Math.min(2, moodFrags.length)));
  // Guarantee at least two posts even on the thinnest family.
  if (chosen.length < 2) chosen.push(...sample(rng, WING_MOOD[chMeta.id][mood === 'lost' ? 'unconvinced' : 'onside'], 1));

  const posts = chosen.map((f) => fragToPost(rng, state, chMeta.id, f, baseTally));
  // Pinned posts float up.
  posts.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  // The fold: extra family + mood colour for readers who want more — doubled to
  // match, so the "show more" tap pays out a second screenful, not a scrap.
  const moreFrags = [
    ...sample(rng, famFrags.filter((f) => !chosen.includes(f)), 4),
    ...sample(rng, WING_MOOD[chMeta.id][mood].filter((f) => !chosen.includes(f)), 2),
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
