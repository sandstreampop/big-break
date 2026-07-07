// The Clarity Layer (v3) — the villa's in-between screens, pack-side.
// Four pure reads the shell renders through the generic clarity slots
// (presenter.stage / resultStage / recap / setPiece — the overlay-note
// pattern, four channels wide):
//
//  · the STAGE — Partner, Rival, Bombshell as first-class faces above the
//    card, each wearing an opinion tier and a mood, spotlit when the scene
//    is theirs;
//  · the RESULT beat — after every swipe, the affected face reacting plus
//    qualitative movement lines (the ADR-0006 rule: relationships and the
//    spiral speak in tiers and weather, never raw numbers);
//  · the RECAP — the act transition as Stirling's "previously, in the
//    villa": the story, your couple, your Intention's honest distance, and
//    what production is about to do to you (the ADR-0008 truthfulness
//    contract extended to the campaign level);
//  · SET-PIECE framing — ceremonies, Casa, Movie Night, the Parents, the
//    Final as framed screens with explicit stakes-in.
//
// Everything here is a PURE function of run state (deals re-render on
// resume; the sims never render) — variety comes from flavorSeed/cardLog
// rotation, never the play RNG. Zero golden impact by construction.

import { castById, CAST, SHAPES } from './cast.js';
import { portraitSrc } from './portraits.js';
import { characterRead, opinionTier, secretOf, TIER_LABEL, MOODS } from './plugins/characters.js';
import { ceremonyOutlook } from './plugins/coupling.js';
import { FACTION_KEYS, FACTION_META, factionTier } from './plugins/factions.js';
import { THREADS, threadState, litThreads } from './plugins/coupleweb.js';
import { PATHS, WIN_GATES } from './manifest.js';
import type { RunState, GameEvent } from '../../types.js';

// Deterministic variant rotation: per-run entropy × season progress.
const rot = (state: RunState, n: number, salt = 0) =>
  (((state.flavorSeed || 1) + (state.cardLog || []).length + salt) % n + n) % n;
const pick = (state: RunState, lines: string[], salt = 0) => lines[rot(state, lines.length, salt)];

// The Partner seat speaks the same tiers with one correction: a fresh (or
// freshly demolished) couple isn't "ice cold", it's day one. Rival/bombshell
// keep the standard labels — coldness there is a fact, not a phase.
const PARTNER_TIER: Record<string, string> = {
  cold: 'early days', cool: 'lukewarm', warm: 'warm', smitten: 'smitten',
};

// ---------- The stage (persistent relationship stage) ----------

// Which seats a card spotlights — the scene's people go live on stage.
const CEREMONY_IDS = new Set([
  'li_recoup1_exposed', 'li_recoup1_exposed_single',
  'li_recoup2_exposed', 'li_recoup2_exposed_single', 'li_recoup_cashout',
  'li_recoup_held', 'li_recoup_rescued', 'li_recoup_dumped',
]);
function liveRoles(state: RunState, ev: GameEvent | null): Set<string> {
  if (!ev) return new Set();
  const id = ev.id || '';
  const tags: string[] = ev.tags || [];
  if (CEREMONY_IDS.has(id) || id === 'li_kitchen_drop') return new Set(['partner', 'rival']);
  if (id.startsWith('li_enc_rival') || id.startsWith('li_enc_rmove') || id === 'li_connect_dots' || id === 'li_second_wave') return new Set(['rival']);
  if (id.startsWith('li_enc_partner') || id.startsWith('li_enc_p3') || id === 'li_casa_held' || id.startsWith('li_parents') || id.startsWith('li_movienight')) return new Set(['partner']);
  if (tags.includes('temptation') || id.startsWith('li_bomb')) return new Set(['bombshell']);
  return new Set();
}

export function villaStage(state: RunState, ev: GameEvent | null) {
  if (state.tutorial) return null;
  const live = liveRoles(state, ev);
  const out: any[] = [];

  const p = characterRead(state, 'partner');
  if (p) {
    const sec = secretOf(state, 'partner');
    out.push({
      label: 'PARTNER', name: p.cast.name, face: p.face, moodFace: p.moodFace, portraitSrc: p.portraitSrc,
      read: `${PARTNER_TIER[p.tier]}${state.exclusive ? ' 🔒' : ''}`,
      cls: 'stage-partner mood-' + (p.mood || 'level'), live: live.has('partner'),
      sheet: {
        title: `${p.cast.name} — your Partner`,
        name: p.cast.name, face: p.face, moodFace: p.moodFace, portraitSrc: p.portraitSrc,
        faceCls: 'mood-' + (p.mood || 'level'), faceSub: p.cast.vibe,
        lines: [
          `<i>${p.cast.vibe}</i>`,
          ...((p.cast as any).shape && SHAPES[(p.cast as any).shape]
            ? [`💞 ${SHAPES[(p.cast as any).shape].label[0].toUpperCase()}${SHAPES[(p.cast as any).shape].label.slice(1)}: ${SHAPES[(p.cast as any).shape].read}`] : []),
          `💘 How it’s going: <b>${PARTNER_TIER[p.tier]}</b>${state.exclusive ? ' — and it’s official. Higher floor, longer drop.' : ''}`,
          ...(p.mood ? [`${MOODS[p.mood].face} Right now: <b>${MOODS[p.mood].label}</b>. Moods pass. Usually.`] : []),
          ...(sec.known && sec.def ? [`🤫 You know their secret: ${sec.def.label}.`] : []),
          'A recoupling checks the Connection OR the public — hold one of them and you stay.',
        ],
      },
    });
  } else {
    out.push({
      label: 'PARTNER', name: 'No one', face: '💔',
      read: 'single', cls: 'stage-partner stage-single', live: live.has('partner'),
      sheet: {
        title: 'Single',
        face: '💔',
        lines: [
          '💔 No Partner, no Connection — at a recoupling only the public can save you.',
          'Couple up at the next ceremony, or make the nation love you fast.',
        ],
      },
    });
  }

  const r = characterRead(state, 'rival');
  if (r) {
    const active = state.flags.includes('li_rival_active');
    const sec = secretOf(state, 'rival');
    out.push({
      label: 'RIVAL', name: r.cast.name, face: r.face, moodFace: r.moodFace, portraitSrc: r.portraitSrc,
      read: active ? 'on the move' : TIER_LABEL[r.tier],
      cls: 'stage-rival mood-' + (r.mood || 'level') + (active ? ' stage-threat' : ''), live: live.has('rival'),
      sheet: {
        title: `${r.cast.name} — the Rival`,
        name: r.cast.name, face: r.face, moodFace: r.moodFace, portraitSrc: r.portraitSrc,
        faceCls: 'mood-' + (r.mood || 'level') + (active ? ' stage-threat' : ''), faceSub: r.cast.vibe,
        lines: [
          `<i>${r.cast.vibe}</i>`,
          `⚔️ Rates you: <b>${TIER_LABEL[r.tier]}</b>. ${r.tier === 'warm' || r.tier === 'smitten' ? 'The knives stay in the block.' : 'Warm them up and the knives get smaller.'}`,
          active ? '⚔️ <b>Actively after your couple</b> — expect a poach at the next ceremony.' : '⚔️ Watching. Not moving. Yet.',
          ...(r.mood ? [`${MOODS[r.mood].face} Right now: <b>${MOODS[r.mood].label}</b>.`] : []),
          ...(sec.known && sec.def && !sec.spent ? [`🤫 You’re holding their secret: ${sec.def.label}. A ceremony is where it spends.`] : []),
        ],
      },
    });
  }

  const b = characterRead(state, 'bombshell');
  if (b && b.cast.id !== state.partner) {
    out.push({
      label: 'BOMBSHELL', name: b.cast.name, face: b.face, moodFace: b.moodFace, portraitSrc: b.portraitSrc,
      read: b.mood ? MOODS[b.mood].label : 'just landed',
      cls: 'stage-bombshell mood-' + (b.mood || 'level'), live: live.has('bombshell'),
      sheet: {
        title: `${b.cast.name} — the bombshell`,
        name: b.cast.name, face: b.face, moodFace: b.moodFace, portraitSrc: b.portraitSrc,
        faceCls: 'mood-' + (b.mood || 'level') + ' stage-bombshell', faceSub: b.cast.vibe,
        lines: [
          `<i>${b.cast.vibe}</i>`,
          `💣 Reads you as: <b>${TIER_LABEL[b.tier]}</b>.`,
          'A bombshell is pressure with a suitcase — it matures at the next recoupling.',
        ],
      },
    });
  }
  return out;
}

// ---------- The result beat (after every swipe) ----------

// Qualitative movement language — the legibility layer speaks villa, not
// spreadsheet. Buckets by magnitude; variants rotate per run.
function bondRead(state: RunState, d: number): string {
  const name = castById(state.partner)?.name || 'your partner';
  const abs = Math.abs(d);
  const lines = d > 0
    ? abs >= 8 ? ['💘 The Connection surges. Other couples take it personally.', '💘 A jump in the Connection you could see from the beach.']
    : abs >= 4 ? ['💘 The Connection builds, properly.', '💘 Real Connection, banked.', '💘 The Connection grows. The daybed approves.']
    : ['💘 The Connection warms a notch.', '💘 A little more Connection in the bank.', '💘 The Connection ticks up. Slow is a strategy.']
    : abs >= 8 ? ['💘 The Connection craters. The duvet has a border now.', '💘 A Connection demolition, live on air.']
    : abs >= 4 ? ['💘 The Connection takes a real hit.', '💘 That cost you Connection you’d actually built.']
    : ['💘 The Connection cools a touch.', '💘 A scuff on the Connection. Buffable.'];
  let read = pick(state, lines, 3);
  // A tier crossing is the legible moment — say it plainly.
  const before = opinionTier((state.bond ?? 0) - d);
  const after = opinionTier(state.bond ?? 0);
  if (before !== after) {
    const up = d > 0;
    const CROSS: Record<string, string> = {
      smitten: `<b>${name} is smitten.</b>`,
      warm: up ? `<b>${name} is properly warm now.</b>` : `<b>${name}’s down to warm.</b>`,
      cool: up ? `<b>${name}’s thawing — lukewarm now.</b>` : `<b>${name}’s gone lukewarm.</b>`,
      cold: `<b>You’re basically strangers again.</b>`,
    };
    read += ' ' + CROSS[after];
  }
  return read;
}

function headRead(state: RunState, d: number): string {
  if (d > 0) {
    return pick(state, d >= 5
      ? ['🌀 The 4 a.m. laps begin.', '🌀 Your head starts doing overtime. Unpaid.']
      : ['🌀 It gets in your head a bit.', '🌀 A new thought moves in upstairs.'], 5);
  }
  return pick(state, ['🌀 Your head goes quieter.', '🌀 Some peace comes back. Suspicious, but welcome.'], 5);
}

export function villaResultStage(state: RunState, result: any) {
  if (state.tutorial || !result?.event) return null;
  const effects = result.tier !== 'declined' && result.side
    ? result.event.choices?.[result.side]?.outcomes?.[result.tier]?.effects || {} : {};
  const reads: { html: string; cls?: string }[] = [];
  const hideChipKeys: string[] = [];

  // Relationship movement, spoken (never charted). A couple forming/breaking
  // already gets its own plugin notice — skip the read to avoid double-speak.
  const structural = effects.couple || effects.switchPartner || effects.bondReset ||
    effects.stealRoll || effects.casaReturn || effects.chosenCeremony;
  const bondDelta = (result.deltas || []).find((d: any) => d.key === 'bond')?.amount || 0;
  if (bondDelta && !structural && state.partner) {
    reads.push({ html: bondRead(state, bondDelta), cls: bondDelta > 0 ? 'read-good' : 'read-bad' });
  }
  if (bondDelta || structural) hideChipKeys.push('bond');

  const rival = castById(state.rival)?.name;
  if (effects.rivalOpinion && rival) {
    reads.push(effects.rivalOpinion > 0
      ? { html: `⚔️ ${rival} rates that. The knives relax a little.`, cls: 'read-good' }
      : { html: `⚔️ ${rival} clocks it and files it under later.`, cls: 'read-bad' });
  }
  const bomb = castById(state.bombshellId)?.name;
  if (effects.bombshellOpinion && bomb) {
    reads.push(effects.bombshellOpinion > 0
      ? { html: `💣 ${bomb} likes what they see.`, cls: 'read-warn' }
      : { html: `💣 ${bomb} moves you down the list.`, cls: '' });
  }

  // The nation's wings, spoken (ADR-0012): faction movement reads as living
  // rooms reacting, never as three more number chips. Chips hide; the loudest
  // wing gets the line (one, at most two — phones are the platform).
  const FACTION_READS: Record<string, { up: string[]; down: string[] }> = {
    romantics: {
      up: ['🌹 The Romantics melt, nationally.', '🌹 Somewhere, a nan approves.', '🌹 The soft wing adds you to the good cushion.'],
      down: ['🌹 The Romantics go quiet in group chats.', '🌹 The soft wing files a complaint.', '🌹 A nation of nans narrows its eyes.'],
    },
    selfrespect: {
      up: ['💅 The spine-havers salute.', '💅 The Self-Respect crowd frames the clip.', '💅 Backbone, clocked and logged.'],
      down: ['💅 The Self-Respect crowd winces.', '💅 “Doormat,” types someone, regretfully.', '💅 The spine wing updates your file.'],
    },
    drama: {
      up: ['🍿 The Drama-lovers are FED.', '🍿 The chaos wing stands and applauds.', '🍿 Popcorn sales, reportedly, up.'],
      down: ['🍿 The Drama-lovers check the other channel.', '🍿 Too wholesome; the chaos wing yawns.', '🍿 The popcorn goes back in the cupboard.'],
    },
  };
  const factionDeltas = (result.deltas || []).filter((d: any) =>
    (d.key === 'romantics' || d.key === 'selfrespect' || d.key === 'drama') && d.amount);
  if (factionDeltas.length) {
    hideChipKeys.push('romantics', 'selfrespect', 'drama');
    const loudest = [...factionDeltas].sort((a: any, b: any) => Math.abs(b.amount) - Math.abs(a.amount)).slice(0, 2);
    for (const d of loudest) {
      if (Math.abs(d.amount) < 2) continue;
      const pool = FACTION_READS[d.key][d.amount > 0 ? 'up' : 'down'];
      reads.push({ html: pick(state, pool, d.key.length), cls: d.amount > 0 ? 'read-good' : 'read-bad' });
    }
  }

  // Moods this card set: weather, reported as weather.
  const moodBits: [string, string][] = [
    ['partnerMood', state.partner], ['rivalMood', state.rival], ['bombshellMood', state.bombshellId],
  ].filter(([k, id]) => (effects as any)[k] && id)
    .map(([k, id]) => [(effects as any)[k], castById(id as string)?.name || ''] as [string, string]);
  for (const [mood, name] of moodBits) {
    if (MOODS[mood] && name) reads.push({ html: `${MOODS[mood].face} ${name} is ${MOODS[mood].label}.`, cls: 'read-mood' });
  }

  // The spiral, spoken.
  const headDelta = (result.deltas || []).find((d: any) => d.key === 'burnout')?.amount || 0;
  if (headDelta) {
    reads.push({ html: headRead(state, headDelta), cls: headDelta > 0 ? 'read-bad' : 'read-good' });
    hideChipKeys.push('burnout');
  }

  // The reacting face, front and centre: whoever this card was about, wearing
  // whatever it did to them.
  const role = (effects as any).partnerMood || (bondDelta && state.partner) ? 'partner'
    : (effects as any).rivalMood || (effects as any).rivalOpinion ? 'rival'
    : (effects as any).bombshellMood || (effects as any).bombshellOpinion ? 'bombshell'
    : [...liveRoles(state, result.event)][0] || null;
  const c = role ? characterRead(state, role as any) : null;
  const portrait = c ? {
    face: c.face, moodFace: c.moodFace, portraitSrc: c.portraitSrc, name: c.cast.name,
    sub: c.mood ? MOODS[c.mood].label : role === 'partner' ? PARTNER_TIER[c.tier] : null,
    cls: 'mood-' + (c.mood || 'level'),
  } : null;

  if (!portrait && !reads.length) return null;
  return { portrait, reads, hideChipKeys };
}

// ---------- The recap (previously, in the villa) ----------

// The honest gate-distance vocabulary (B2): one phrase per ratio band. The
// numbers stay backstage; the distance is real.
function distanceWord(ratio: number): string {
  return ratio >= 1 ? 'there already' : ratio >= 0.72 ? 'nearly there'
    : ratio >= 0.42 ? 'getting somewhere' : 'barely off the sun lounger';
}
function gateRatio(state: RunState, key: string): number {
  const target = WIN_GATES[state.path || '']?.[key] || 1;
  const v = state.stats?.[key] ?? (state as any)[key] ?? 0;
  return v / target;
}
// The Intention block: what you declared, and how far each half actually is.
function intentionRead(state: RunState): string {
  const path = PATHS[state.path || ''];
  if (!path) return 'You haven’t declared an Intention yet. The Crossroads is waiting with a clipboard.';
  const gates = WIN_GATES[state.path!];
  const NAMES: Record<string, string> = {
    public: 'The nation', bond: 'The couple', loyalty: 'The being-genuine part',
    followers: 'The following', charisma: 'The main-character energy',
    story: 'The storyline',
  };
  const parts = Object.keys(gates).map((k) => `${NAMES[k] || k}: <b>${distanceWord(gateRatio(state, k))}</b>.`);
  return `You declared <b>${path.name}</b>. ${parts.join(' ')}`;
}

function coupleRead(state: RunState): string {
  const p = characterRead(state, 'partner');
  if (!p) return '💔 There isn’t one. At a recoupling, that’s not a lifestyle — that’s a countdown.';
  const mood = p.mood ? ` Currently ${MOODS[p.mood].label}.` : '';
  const lock = state.exclusive ? ' It’s official, which the villa treats as a dare.' : '';
  return `💘 <b>${p.cast.name}</b> — ${PARTNER_TIER[p.tier]}.${lock}${mood}`;
}

// v4 S2 (ADR-0011): the recap fires at every WEEK turn (weeks 2–6). Each
// week's story covers the week just played; THIS WEEK is the honest forecast
// of the tentpole the producers schedule actually delivers (the ADR-0008
// truthfulness contract at campaign level).
const WEEK_TITLE: Record<number, string> = {
  2: 'THE GRAFT', 3: 'CASA AMOR', 4: 'MOVIE NIGHT', 5: 'THE RECOUPLING', 6: 'FINAL WEEK',
};

function storySoFar(state: RunState, week: number): string {
  const p = castById(state.partner)?.name;
  const r = castById(state.rival)?.name || 'someone';
  const bomb = castById(state.bombshellId)?.name;
  const acted = (state.cardLog || []).filter((c: any) => c.a === week - 1);
  const rough = acted.filter((c: any) => c.t === 'bad').length >= Math.max(3, acted.length * 0.4);
  const wobble = rough ? ' It has, frankly, been a bumpy week. The nation respects a comeback arc.' : '';
  const bits: string[] = [];

  if (week === 2) {
    bits.push(pick(state, [
      'Week one: sun cream, first dates, and eye contact with consequences.',
      'One week down. Everyone said “vibes” a minimum of forty times.',
      'Week one is over. The airport tans have faded; the agendas haven’t.',
      'One week down. Feelings have been caught. Some were even meant.',
    ], 7));
    bits.push(p
      ? `You coupled up with <b>${p}</b>, and the nation started having opinions in group chats. ${r} started having them out loud.`
      : `You are, at time of broadcast, single — which in here is a weather warning. ${r} noticed first.`);
    if (bomb) bits.push(`And last night the doors opened: <b>${bomb}</b> unpacked a suitcase and a plan.`);
  } else if (week === 3) {
    bits.push(pick(state, [
      'Week two was the graft: iced coffees, terrace debriefs, and a challenge with a scoreboard nobody asked for.',
      'Week two: the couples stopped auditioning and started existing. Production made a note to fix that.',
      'The grafting week is done — favours banked, orders memorised, a challenge survived on camera.',
    ], 11));
    bits.push('At the Crossroads you said the quiet part into a microphone.');
  } else if (week === 4) {
    if (state.flags.includes('li_betrayed')) bits.push(`Casa Amor happened, and it happened <i>to you</i>: your head stayed loyal, your other half didn’t.`);
    else if (state.flags.includes('li_casa_recouple')) bits.push('You went to Casa Amor and came back with a different person. Bold television.');
    else if (state.flags.includes('li_casa_kiss')) bits.push('Casa Amor happened. So did a kiss. The footage is filed under “pending.”');
    else if (state.flags.includes('li_loyal_casa')) bits.push('You did Casa Amor the boring way: loyal, asleep by eleven. The nation quietly loved it.');
    else bits.push('Casa Amor came and went — new faces, old feelings, a postcard nobody framed.');
  } else if (week === 5) {
    if (state.flags.includes('li_partner_revealed')) bits.push('Movie Night rolled the tape, and the tape had a co-star.');
    else if (state.flags.includes('li_revealed')) bits.push('Movie Night rolled your tape. The villa watched it twice.');
    else bits.push('Movie Night came for everyone’s receipts and left yours, remarkably, alone.');
    if (state.flags.includes('li_bestie')) bits.push('Somewhere in the wreckage you acquired a ride-or-die — two spoons, one tub, terms binding.');
    if (state.flags.includes('li_done_rivalmove')) bits.push(`${r} stopped watching and made their move. You noticed. So did the nation.`);
  } else {
    const verdict = state.lastCeremony?.verdict;
    if (verdict === 'held') bits.push('At the firepit, the couple held.');
    else if (verdict === 'rescued') bits.push('At the firepit the Connection blinked — the public didn’t. Rescued.');
    else if (verdict === 'dumped') bits.push('The firepit took a body. It nearly took yours.');
    else bits.push('The recoupling came and went, and you’re still holding a drink on the lawn.');
    bits.push('Which brings us here: the last week there is.');
  }
  return `🎙️ ${bits.join(' ')}${wobble}`;
}

function whatsComing(state: RunState, week: number): string {
  if (week === 2) {
    return '⚠️ The graft gets graded: a <b>challenge</b> at the end of the week, played for laughs and scored for keeps. And after it, the <b>Crossroads</b> — you declare why you’re really here, out loud, on the record.';
  }
  if (week === 3) {
    return '⚠️ <b>Casa Amor.</b> At the end of this week the villa splits, strangers unpack, and loyalty gets a camera pointed at it. Whatever happens over there comes home on a postcard.';
  }
  if (week === 4) {
    return '⚠️ <b>Movie Night.</b> The footage exists, and this week production presses play — footage outranks feelings, every time. New allies help. So does a clean reel, if yours is one.';
  }
  if (week === 5) {
    const chooser = state.gender === 'girl'; // recoup1: the girls choose
    const recoup = chooser
      ? 'This week ends at the firepit: a recoupling where <b>the girls choose</b> — that’s you, holding the pen.'
      : 'This week ends at the firepit: a recoupling where <b>the girls choose</b> — and you find out what your season is worth.';
    return `⚠️ ${recoup} Before that: one more bombshell, and everyone recalculating.`;
  }
  const chooser = state.gender === 'boy'; // recoup2: the boys choose
  const recoup = chooser
    ? 'First: a recoupling. <b>The boys choose.</b> You are the boys.'
    : 'First: a recoupling. <b>The boys choose.</b> You are not the boys — you survive on the Connection or the nation, and nothing else.';
  const hot = (state.stats?.burnout ?? 0) >= 62
    ? ' And you’re carrying a loud head into a week that eats loud heads — <b>get it quiet or you’ll walk</b>. The Beach Hut counts as a move.'
    : '';
  return `⚠️ ${recoup} After that: families with opinions, final dates, and a public vote climbing like a fever. The envelope is already printed.${hot}`;
}

// The nation, read out by wing (ADR-0012 — tiers on screen, floats
// backstage). One line of state plus one line of interpretation, patterned
// on where the three wings actually sit.
function nationRead(state: RunState): string {
  const tiers = FACTION_KEYS.map((k) => ({ k, meta: FACTION_META[k], tier: factionTier(state[k] ?? 0) }));
  // Early season, nothing banked anywhere: the nation hasn't DECIDED yet —
  // "gone off you" is a story about a fall, and there's been nowhere to fall
  // from. One undecided line instead of three cold chips.
  if ((state.act || 1) <= 2 && tiers.every((t) => t.tier === 'lost' || t.tier === 'unconvinced')) {
    return 'Still deciding what you are. Week one is the audition; the wings — 🌹 the soft hearts, 💅 the spines, 🍿 the popcorn — pick their favourites from here.';
  }
  const chips = tiers.map((t) => `${t.meta.icon} ${t.meta.name.replace('The ', '')}: <b>${t.tier}</b>`).join(' · ');
  const lost = tiers.filter((t) => t.tier === 'lost');
  const warm = tiers.filter((t) => t.tier === 'onside' || t.tier === 'devoted');
  const verdictLine = lost.length
    ? `${lost[0].meta.icon} ${lost[0].meta.name} have gone off you — ${lost[0].meta.wants}, and they’re not seeing it.`
    : warm.length === 3 ? 'All three wings onside. At a vote, that’s a landslide waiting.'
    : warm.length === 0 ? 'Nobody’s sold yet. The vote is a coin with three sides.'
    : 'You can’t please a nation. You’re pleasing most of one.';
  return `${chips}<br>${verdictLine}`;
}

// The villa moved whether you watched or not: threads that ended OFFSCREEN
// when their window closed last week, plus what the cameras follow now. A
// pure read — the "since last recap" question is answered structurally
// (window[1] === the week that just ended).
const THREAD_NAMES: Record<string, string> = {
  triangle: 'Marco & Sophia', slowburn: 'Dev & Tash', lovebomb: 'Kai & Chloe',
  feud: 'the villa cold war', scorched: 'Sophia, at large',
};
const OFFSCREEN_LINES: Record<string, string> = {
  'triangle:off_quiet': 'Marco and Sophia patched it up off-camera — a peace with the shelf life of a smoothie.',
  'slowburn:off_parked': 'Dev never quite said the thing to Tash. The wall tea keeps its vigil.',
  'lovebomb:off_wobbles': 'Kai and Chloe cooled without ceremony. The gel nails point elsewhere now.',
  'feud:off_simmer': 'The cold war went dormant — unsigned, unforgotten, both kettles armed.',
  'scorched:off_exit': 'Sophia took her summer somewhere quieter. The villa pretends not to miss the danger.',
};
function meanwhileRead(state: RunState, act: number): string | null {
  const bits: string[] = [];
  for (const def of THREADS) {
    const t = threadState(state, def.id);
    if (t.resolved && String(t.resolved).startsWith('off_') && def.window[1] === act - 1) {
      bits.push(OFFSCREEN_LINES[`${def.id}:${t.resolved}`] || `${THREAD_NAMES[def.id]} resolved itself while nobody filmed it.`);
    }
  }
  const lit = litThreads(state).map((id) => THREAD_NAMES[id]).filter(Boolean);
  if (lit.length) bits.push(`The cameras are following: <b>${lit.join('</b> and <b>')}</b>.`);
  return bits.length ? `👀 ${bits.join(' ')}` : null;
}

export function villaRecap(state: RunState, act: number, _seed: number) {
  if (state.tutorial || act < 2 || act > 6) return null;
  const meanwhile = meanwhileRead(state, act);
  return {
    kicker: `PREVIOUSLY, IN THE VILLA · WEEK ${act - 1}`,
    title: WEEK_TITLE[act],
    blocks: [
      { html: storySoFar(state, act), cls: 'recap-story' },
      { label: 'YOUR COUPLE', html: coupleRead(state), cls: 'recap-couple' },
      ...(meanwhile ? [{ label: 'MEANWHILE', html: meanwhile, cls: 'recap-story' }] : []),
      { label: 'THE NATION', html: `🗳️ ${nationRead(state)}`, cls: 'recap-intention' },
      { label: 'YOUR INTENTION', html: `🎯 ${intentionRead(state)}`, cls: 'recap-intention' },
      { label: 'THIS WEEK', html: whatsComing(state, act), cls: 'recap-threat' },
    ],
  };
}

// ---------- Set-piece framing (stakes in, verdict out) ----------

const stake = (html: string, cls = '') => ({ html, cls });

// The ceremony stakes: the real check, spoken plainly (ADR-0008's honesty
// rule — the same arithmetic Stirling's forecast reads).
function ceremonyStakes(state: RunState) {
  const o = ceremonyOutlook(state);
  const partner = castById(state.partner)?.name;
  const rival = castById(state.rival)?.name;
  const out = [];
  out.push(partner
    ? (o.bondSafe ? stake(`💘 The Connection: enough to hold ${partner}`, 'sp-safe')
      : stake('💘 The Connection: not enough on its own tonight', 'sp-risk'))
    : stake('💘 No Partner, no Connection — the public is the whole plan', 'sp-risk'));
  out.push(o.publicSafe ? stake('🗳️ The public: they’d keep you', 'sp-safe')
    : stake('🗳️ The public: undecided at best', 'sp-risk'));
  // The factional texture on the vote (ADR-0012): name the wing that's gone,
  // or the landslide — one line, only when there's something to say.
  const lostWing = FACTION_KEYS.find((k) => factionTier(state[k] ?? 0) === 'lost');
  if (lostWing) out.push(stake(`${FACTION_META[lostWing].icon} ${FACTION_META[lostWing].name} won’t be voting for you tonight`, 'sp-risk'));
  else if ((state.surge ?? 0) >= 3) out.push(stake('🗳️ All three wings of the nation: onside', 'sp-safe'));
  if (state.flags.includes('li_rival_active') && rival) {
    const sec = secretOf(state, 'rival');
    out.push(sec.known && !sec.spent
      ? stake(`🤫 You’re holding ${rival}’s secret — tonight it’s currency`, 'sp-safe')
      : stake(`⚔️ ${rival} is working the line-up`, 'sp-risk'));
  }
  return out;
}

export function villaSetPiece(state: RunState, ev: GameEvent) {
  if (state.tutorial) return null;
  const id = ev.id || '';
  const tags: string[] = ev.tags || [];
  const partner = castById(state.partner)?.name || 'your partner';

  // ---- The couple-web's framed moments (ADR-0013): a thread resolving is a
  // set-piece — the villa stops for it. Beats wear the slim ribbon after. ----
  if (id === 'li_web_tri_showdown') {
    return {
      key: 'web-tri', banner: 'THE SHOWDOWN', cls: 'sp-rival',
      sub: 'Sophia has assembled the villa. Marco has assembled a defence. One of these will hold.',
      stakes: [
        stake('🍿 The Drama-lovers have waited all season for this', 'sp-risk'),
        stake('📺 You’re in frame. Pick a distance', 'sp-risk'),
      ],
    };
  }
  if (id === 'li_web_slow_together') {
    return {
      key: 'web-slow', banner: 'THE SLOW BURN', cls: 'sp-date',
      sub: 'Dev is standing up at the firepit, and for once the villa shuts up on its own.',
      stakes: [stake('🌹 If he lands it, the whole nation softens', 'sp-safe')],
      mood: 'triumph' as const,
    };
  }
  if (id === 'li_web_love_wakes' || id === 'li_web_love_doubles') {
    return {
      key: 'web-love', banner: 'THE QUESTION', cls: 'sp-ceremony',
      sub: id === 'li_web_love_wakes'
        ? 'Kai puts the spatula down. In Kai terms, a gavel.'
        : 'Chloe has an announcement voice on. Check the calendar.',
      stakes: [stake('💅 Somebody’s game gets graded this morning', 'sp-risk')],
    };
  }
  if (id === 'li_web_sco_0') {
    return {
      key: 'web-sco', banner: 'SCORCHED EARTH', cls: 'sp-bomb',
      sub: 'Sophia — single, furious, immaculate — has chosen a seat. It’s next to your other half.',
      stakes: [
        stake(`💘 ${partner} is the target tonight`, 'sp-risk'),
        stake('🌹 How you handle it IS the storyline', 'sp-risk'),
      ],
    };
  }

  // ---- The player couple's own arcs (ADR-0013), framed. ----
  if (id.startsWith('li_ick_') && id !== 'li_ick_talk' && id !== 'li_ick_theirs' && id !== 'li_ick_watch') {
    return {
      key: 'ick', banner: 'THE ICK', cls: 'sp-hut',
      sub: 'Love’s internal lie-detector just pinged. It does not offer a snooze button.',
      stakes: [
        stake('💘 Named early, an ick is a conversation. Buried, it compounds', 'sp-risk'),
        stake('📖 Surviving one is exactly the storyline the nation crowns'),
      ],
    };
  }
  if (id === 'li_repair_mine_1') {
    return {
      banner: 'THE RE-COMMITMENT', cls: 'sp-ceremony',
      sub: 'Three days of coffee and shutting up. Now the sentence, at the firepit, on the record.',
      stakes: [
        stake('💘 Land it plainly and the ledger reopens', 'sp-safe'),
        stake('🌹 The Romantics are watching. So is the wing that thinks you got off easy', 'sp-risk'),
      ],
    };
  }
  if (id === 'li_repair_theirs_0' || id === 'li_repair_theirs_1') {
    return {
      key: 'repair-theirs', banner: 'THE FORGIVENESS QUESTION', cls: 'sp-ceremony',
      sub: 'The coffee has been arriving. The sentence got said. The queue number being called is yours.',
      stakes: [
        stake('🌹 Forgive, and the soft wing crowns you — the spine wing calls it early', 'sp-risk'),
        stake('💅 Make them earn it, and the arithmetic reverses', 'sp-risk'),
      ],
    };
  }

  // ---- Day One (v3.2: the season opens framed, not dealt cold) ----
  if (id === 'li_arrival') {
    return {
      banner: 'DAY ONE', cls: 'sp-arrival',
      sub: 'Suitcases on the lawn. A firepit with opinions. The nation presses record.',
      stakes: [
        stake('💘 The first coupling happens before the sun cream dries'),
        stake('📺 Whatever you do next is your personality now', 'sp-risk'),
      ],
    };
  }
  if (id === 'li_arrival_bomb') {
    return {
      banner: 'DAY ONE', cls: 'sp-bomb',
      sub: 'Their day nine. Your day one. You’re not joining this villa — you’re happening to it.',
      stakes: [
        stake('💣 Six settled couples, zero vacancies. Make one', 'sp-risk'),
        stake('📺 The entrance is the audition'),
      ],
    };
  }
  if (id === 'li_return_clocked') {
    return {
      banner: 'BACK AGAIN', cls: 'sp-arrival',
      sub: 'Same lawn, same firepit. It remembers you. So does everyone on it.',
      stakes: [
        stake('📺 The nation knows how it ended last time', 'sp-risk'),
        stake('💘 A second chance pays double — if you land it'),
      ],
    };
  }

  // ---- The character arcs, framed at the door (key: beat once, ribbon after) ----
  if (id.startsWith('li_enc_rival')) {
    const rival = castById(state.rival)?.name || 'Someone';
    return {
      key: 'arc-rival', banner: 'THE RIVAL', cls: 'sp-rival',
      sub: `${rival} has started saying your name with a face on. Time to hear the audit in person.`,
      stakes: [
        stake('⚔️ Warm them up, or hand them a reason', 'sp-risk'),
        stake('🤫 Rivals keep receipts. So can you'),
      ],
    };
  }
  if (id.startsWith('li_enc_partner')) {
    return {
      key: 'arc-graft', banner: 'THE GRAFT', cls: 'sp-date',
      sub: `Time to find out whether ${partner} is a person or a plotline.`,
      stakes: [
        stake('💘 The Connection grows when you feed it — this is the feeding'),
        stake('📺 Half the villa is pretending not to listen', 'sp-risk'),
      ],
    };
  }
  if (id.startsWith('li_enc_bestie')) {
    return {
      key: 'arc-bestie', banner: 'THE BESTIE', cls: 'sp-hut',
      sub: 'Two spoons, one tub, 1 a.m. Somebody in here wants a teammate, not a target.',
      stakes: [
        stake('🤝 The villa pairs up twice — hearts, then corners. This is corners'),
        stake('🎙️ Honest at 1 a.m. is still on mic', 'sp-risk'),
      ],
    };
  }
  if (id.startsWith('li_enc_rmove')) {
    const rival = castById(state.rival)?.name || 'Your rival';
    const sec = secretOf(state, 'rival');
    return {
      key: 'arc-rmove', banner: 'THE RIVAL MOVES', cls: 'sp-rival',
      sub: `${rival} has stopped watching and started walking. Guess where.`,
      stakes: [
        stake('⚔️ Your couple is the target', 'sp-risk'),
        sec.known && !sec.spent
          ? stake('🤫 You’re holding their secret — remember that', 'sp-safe')
          : stake(state.partner
            ? `💘 A poach tests the Connection — yours reads ${PARTNER_TIER[opinionTier(state.bond ?? 0)]}`
            : '💘 Nothing to poach. That’s its own problem'),
      ],
    };
  }
  if (id.startsWith('li_enc_p3')) {
    return {
      key: 'arc-p3', banner: 'WHERE’S YOUR HEAD AT?', cls: 'sp-final',
      sub: 'Final Week asks the only question it knows. Tonight it’s asking you.',
      stakes: [stake(`💘 What you and ${partner} actually are gets said out loud`)],
    };
  }
  if (id === 'li_second_wave') {
    return {
      banner: 'THE SECOND WAVE', cls: 'sp-rival',
      sub: 'The villain seat never stays empty. Production fills vacancies.',
      stakes: [stake('⚔️ A new rival — fresh notes, and none of your history to spend', 'sp-risk')],
    };
  }

  // ---- Bombshells and old business ----
  if (id === 'li_bomb1') {
    return {
      banner: 'A BOMBSHELL', cls: 'sp-bomb',
      sub: 'Golden hour, and the doors open again. First bombshell of the season.',
      stakes: [
        stake('💣 They arrive holding a date card — anyone’s name fits', 'sp-risk'),
        state.partner
          ? stake(`💘 ${partner} gets to watch how you watch`)
          : stake('💘 You’re single. This might be a door', 'sp-safe'),
      ],
    };
  }
  if (id === 'li_bomb2' || id === 'li_bomb2_single') {
    return {
      key: 'bomb2', banner: 'ANOTHER BOMBSHELL', cls: 'sp-bomb',
      sub: 'Production looked at the calm and ordered against it.',
      stakes: [
        id === 'li_bomb2_single'
          ? stake('💘 You’re the only single one at the welcome drinks. That’s a plot', 'sp-safe')
          : stake('💣 A private date, and they pick who from the whole lawn', 'sp-risk'),
      ],
    };
  }
  if (id === 'li_ex_arrives') {
    return {
      banner: 'YOUR EX IS HERE', cls: 'sp-bomb',
      sub: 'A villa has nowhere to put history. Yours is on a sun lounger, four metres from your couple.',
      stakes: [stake('💣 “A quick word.” No word on this show has ever been quick', 'sp-risk')],
    };
  }
  if (id.startsWith('li_tempt')) {
    return {
      key: 'temptation', banner: 'TEMPTATION', cls: 'sp-bomb',
      sub: 'Late, quiet, and exactly as innocent as it looks.',
      stakes: [
        stake('💣 “Can I steal you for a chat?” The verb is doing work', 'sp-risk'),
        ...(state.partner ? [stake(`💘 ${partner} hears about this by breakfast`, 'sp-risk')] : []),
      ],
    };
  }

  // ---- The produced moments: texts, dates, challenges, the Hut ----
  if (id === 'li_first_date') {
    return {
      banner: 'THE FIRST DATE', cls: 'sp-date',
      sub: 'Two chairs, two drinks, one wall with a nation behind it.',
      stakes: [stake(`💘 ${partner}, minus the audience. Mostly`)],
    };
  }
  if (id === 'li_beach_date') {
    return {
      banner: 'A DATE OFF-SITE', cls: 'sp-date',
      sub: 'A car, a coastline, and a drone circling the bay on company money.',
      stakes: [stake('💘 Off-site dates are the show saying: convince us', 'sp-risk')],
    };
  }
  if (id === 'li_hideaway_key') {
    return {
      banner: 'THE HIDEAWAY', cls: 'sp-date',
      sub: 'The red door opens tonight, and the villa has voted you through it.',
      stakes: [
        stake('💘 Big for the couple'),
        stake('🎙️ The mics stay on. Everyone forgets the mics stay on', 'sp-risk'),
      ],
    };
  }
  if (tags.includes('challenge')) {
    return {
      key: 'challenge', banner: 'TONIGHT’S CHALLENGE', cls: 'sp-challenge',
      sub: 'Aprons, whiteboards, heart-rate monitors — the format doesn’t care what it costs you.',
      stakes: [
        stake('🏆 Played for laughs, scored for keeps', 'sp-risk'),
        stake('📺 The clip goes home even if you don’t'),
      ],
    };
  }
  if (id === 'li_hut_confess_1' || id === 'li_hut_confess_2') {
    return {
      key: 'hut', banner: 'THE BEACH HUT', cls: 'sp-hut',
      sub: 'Door shut, mic hot, one chair. The Hut trades in headlines.',
      stakes: [stake('🎙️ Give it a line and it gives you tomorrow’s', 'sp-risk')],
    };
  }
  if (id === 'li_code_vote_honour' || id === 'li_code_vote_broke') {
    return {
      key: 'vote', banner: 'THE VOTE', cls: 'sp-ceremony',
      sub: 'The Islanders vote tonight. Fairy lights on, knives out.',
      stakes: [
        id === 'li_code_vote_broke'
          ? stake('🗳️ “Biggest game-player.” You’ve been leaving fingerprints', 'sp-risk')
          : stake('🗳️ “Most trusted.” Kept codes pay out tonight', 'sp-safe'),
      ],
    };
  }
  if (id === 'li_casa_postcard_loyal' || id === 'li_casa_postcard_stray') {
    return {
      key: 'postcard', banner: 'THE POSTCARD', cls: 'sp-casa',
      sub: 'Morning. One envelope, both villas, no context.',
      stakes: [
        stake('📮 One photo each, cropped by a professional', 'sp-risk'),
        id === 'li_casa_postcard_stray'
          ? stake(`💌 Across the island, ${partner} is holding your night`, 'sp-risk')
          : stake(`💌 ${partner}, mid-laugh, somebody’s hand in shot`, 'sp-risk'),
      ],
    };
  }

  // The recoupling, exposed side — the stakes screen proper.
  if (id === 'li_recoup1_exposed' || id === 'li_recoup2_exposed' ||
      id === 'li_recoup1_exposed_single' || id === 'li_recoup2_exposed_single') {
    return {
      banner: 'THE RECOUPLING', cls: 'sp-ceremony',
      sub: 'The firepit. Everyone stands. Someone doesn’t sit back down.',
      stakes: ceremonyStakes(state),
    };
  }
  if (id === 'li_recoup_cashout') {
    return {
      banner: 'THE RECOUPLING', cls: 'sp-ceremony',
      sub: 'Before the names are read — you’re holding dynamite.',
      stakes: ceremonyStakes(state),
    };
  }
  // The chooser side: power, priced.
  if (id === 'li_recoup1_choose' || id === 'li_recoup2_choose') {
    return {
      banner: 'THE RECOUPLING', cls: 'sp-ceremony',
      sub: 'Tonight, you hold the pen.',
      stakes: [
        stake(`💘 Keep ${partner}: the Connection carries over`, 'sp-safe'),
        stake('🔁 Switch: a new face, and the Connection starts from scratch', 'sp-risk'),
      ],
    };
  }
  if (id === 'li_recoup1_choose_single' || id === 'li_recoup2_choose_single') {
    return {
      banner: 'THE RECOUPLING', cls: 'sp-ceremony',
      sub: 'You’re single, and tonight that’s power: you choose.',
      stakes: [stake('💘 Whoever you pick, the Connection starts where all Connections start', '')],
    };
  }
  // The verdicts: out the other side, framed.
  if (id === 'li_recoup_held') return { banner: 'THE VERDICT', cls: 'sp-ceremony sp-held', sub: 'The couple holds.', mood: 'triumph' as const };
  if (id === 'li_recoup_rescued') return { banner: 'THE VERDICT', cls: 'sp-ceremony sp-rescued', sub: 'The Connection blinked. The public didn’t.' };
  if (id === 'li_recoup_dumped') return { banner: 'THE VERDICT', cls: 'sp-ceremony sp-dumped', sub: 'Nobody said your name.', mood: 'blow' as const };

  // Casa Amor, framed end to end.
  if (id === 'li_casa_text') {
    return {
      banner: 'CASA AMOR', cls: 'sp-casa',
      sub: 'The villa splits tonight.',
      stakes: [
        stake('🧳 Your half packs a bag. Six strangers unpack theirs.'),
        ...(state.partner ? [stake(`💘 ${partner} stays behind — with company arriving`, 'sp-risk')] : []),
        stake('📮 Everything here ends up on a postcard', 'sp-risk'),
      ],
    };
  }
  if (id === 'li_casa_night') {
    return {
      banner: 'CASA AMOR', cls: 'sp-casa', sub: 'Night three. The cameras don’t sleep either.',
      stakes: state.partner ? [stake(`💘 ${partner} is forty minutes and one postcode away`)] : [],
    };
  }
  if (id === 'li_casa_return') {
    return {
      banner: 'THE RETURN', cls: 'sp-casa',
      sub: 'Two lines of Islanders. One door.',
      stakes: [
        stake(`💘 ${partner}’s week: unknown`, 'sp-risk'),
        stake('🚪 Someone may be standing next to someone', 'sp-risk'),
      ],
    };
  }
  if (id === 'li_casa_held') return { banner: 'THE RETURN', cls: 'sp-casa sp-held', sub: 'They walked out alone.', mood: 'triumph' as const };
  if (id === 'li_casa_betrayed') return { banner: 'THE RETURN', cls: 'sp-casa sp-dumped', sub: 'They didn’t.', mood: 'blow' as const };

  // Movie Night: the footage outranks the feelings.
  if (id === 'li_movienight_reveal' || id === 'li_movienight_clean') {
    const mine = ['li_casa_kiss', 'li_head_turned', 'li_strayed_official'].some((f) => state.flags.includes(f));
    return {
      banner: 'MOVIE NIGHT', cls: 'sp-movienight',
      sub: 'Grab a drink. Tonight’s film is about all of you.',
      stakes: [
        mine ? stake('🎬 There is footage of you. You know exactly which bit.', 'sp-risk')
          : stake('🎬 Your reel is clean. That has never once stopped Movie Night.', ''),
        ...(state.partner ? [stake(`🎬 ${partner}’s reel: contents unknown`, 'sp-risk')] : []),
        stake('🍿 The Drama-lovers have been fed all week. Tonight they feast', 'sp-risk'),
      ],
    };
  }

  // Meet the Parents: the authenticity checkpoint.
  if (id === 'li_parents' || id === 'li_parents_messy') {
    return {
      banner: 'MEET THE PARENTS', cls: 'sp-parents',
      sub: 'Families in the villa. Sunglasses off.',
      stakes: [
        stake('👵 They’ve seen every episode'),
        ...(state.flags.includes('li_revealed') ? [stake('👵 Including that one', 'sp-risk')] : []),
      ],
    };
  }

  // The steal: a bombshell with the Host's microphone.
  if (id === 'li_bomb2_steal') {
    const solid = (state.bond ?? 0) + (state.public ?? 0) >= 90;
    return {
      banner: 'A BOMBSHELL DECIDES', cls: 'sp-ceremony',
      sub: 'They get first pick. Of anyone.',
      stakes: [solid
        ? stake('💘 What you two have is solid — and it shows', 'sp-safe')
        : stake('💘 Your couple reads… available', 'sp-risk')],
    };
  }

  // The wobbles: the spiral, framed as the place it happens.
  if (id === 'li_wobble_break') {
    return {
      banner: 'THE GATE', cls: 'sp-hut',
      sub: 'Dawn. A packed suitcase. Your call.',
      stakes: [
        stake('🌀 Tough it out and botch it, and you’re done — you walk', 'sp-risk'),
        stake('🚪 Asking for help costs screen time. It is always worth it', 'sp-safe'),
      ],
    };
  }
  if (id === 'li_wobble_50' || id === 'li_wobble_75') {
    return {
      banner: 'THE BEACH HUT', cls: 'sp-hut',
      sub: id === 'li_wobble_75' ? 'Late. Too late, really.' : 'The camera with no one behind it.',
      stakes: [id === 'li_wobble_75'
        ? stake('🌀 Your head is winning. One more bad night and you’re packing', 'sp-risk')
        : stake('🌀 Your head is loud tonight', 'sp-risk')],
    };
  }

  // The Final's authored cards — the vote is live, so the nation's wings get
  // read out (ADR-0012), and a Win-the-Villa run hears its story ledger.
  if (ev.finaleCard || id.startsWith('li_final_')) {
    const lost = FACTION_KEYS.filter((k) => factionTier(state[k] ?? 0) === 'lost');
    const stakes = [
      (state.surge ?? 0) >= 3
        ? stake('🗳️ All three wings of the nation are onside — a surge is building', 'sp-safe')
        : lost.length
          ? stake(`${FACTION_META[lost[0]].icon} ${FACTION_META[lost[0]].name} never came back to you`, 'sp-risk')
          : stake('🗳️ The nation is split. Every wing votes its own show', ''),
      ...(state.path === 'winvilla'
        ? [(state.story || 0) >= 2
          ? stake(`📖 Your season had a story — ${state.story} storylines the nation can retell`, 'sp-safe')
          : stake('📖 A smooth season. The crown wants a story it can retell', 'sp-risk')]
        : []),
    ];
    return {
      banner: 'THE FINAL', cls: 'sp-final',
      sub: 'Last night in the villa. The nation is voting right now.',
      stakes,
    };
  }
  return null;
}

// ── The finale's faces (presenter.endingPortraits) ─────────────────────────
// Who you walk out beside, and who you left behind. The season ends on the
// people, not just the scene: the Partner you finished coupled with (and, if
// they were live, the Rival who spent the summer circling). Pure read of the
// finished run — mood and portrait resolve exactly as they did on the stage.
export function villaEndingPortraits(_summary: any, state: RunState) {
  if (state.tutorial) return null;
  const out: any[] = [];
  const p = characterRead(state, 'partner');
  if (p) {
    out.push({
      label: state.exclusive ? 'YOUR COUPLE' : 'COUPLED WITH',
      name: p.cast.name, face: p.face, moodFace: p.moodFace, portraitSrc: p.portraitSrc,
      sub: p.cast.vibe, cls: 'stage-partner mood-' + (p.mood || 'level'),
    });
  }
  const r = characterRead(state, 'rival');
  if (r && state.flags.includes('li_rival_active')) {
    out.push({
      label: 'THE RIVAL', name: r.cast.name, face: r.face, moodFace: r.moodFace, portraitSrc: r.portraitSrc,
      sub: r.cast.vibe, cls: 'stage-rival mood-' + (r.mood || 'level'),
    });
  }
  return out.length ? out : null;
}

// ── Meet the Cast (presenter.roster) ────────────────────────────────────────
// The whole villa, browsable from the title screen — the fixed roster of 16 as
// enlargeable profile pics, grouped the way the villa fills up (the day-one
// boys and girls, then the bombshells who arrive to blow it apart). Each read
// is their one-line vibe plus how they do a relationship (the SHAPE the player
// meets on the stage sheet). Pure data — no run needed.
export function villaRoster(_meta: any) {
  const shapeSub = (c: any) => (c.shape && SHAPES[c.shape]) ? SHAPES[c.shape].label : null;
  const toMember = (c: any) => ({
    name: c.name, face: c.face, portraitSrc: portraitSrc(c.id),
    note: c.vibe, sub: shapeSub(c),
    cls: c.gender === 'girl' ? 'roster-girl' : 'roster-boy',
  });
  const boys = CAST.filter((c) => c.gender === 'boy' && !c.bombshell).map(toMember);
  const girls = CAST.filter((c) => c.gender === 'girl' && !c.bombshell).map(toMember);
  const bombs = CAST.filter((c) => c.bombshell).map(toMember);
  return {
    title: 'Meet the Cast',
    sub: 'The villa, in full. Tap a face to see them properly.',
    groups: [
      { label: 'The Boys', members: boys },
      { label: 'The Girls', members: girls },
      { label: 'Bombshells', members: bombs },
    ].filter((g) => g.members.length),
  };
}
