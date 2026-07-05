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

import { castById, SHAPES } from './cast.js';
import { characterRead, opinionTier, secretOf, TIER_LABEL, MOODS } from './plugins/characters.js';
import { ceremonyOutlook } from './plugins/coupling.js';
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
      label: 'PARTNER', name: p.cast.name, face: p.face, moodFace: p.moodFace,
      read: `${PARTNER_TIER[p.tier]}${state.exclusive ? ' 🔒' : ''}`,
      cls: 'stage-partner mood-' + (p.mood || 'level'), live: live.has('partner'),
      sheet: {
        title: `${p.cast.name} — your Partner`,
        lines: [
          `<i>${p.cast.vibe}</i>`,
          ...((p.cast as any).shape && SHAPES[(p.cast as any).shape]
            ? [`💞 ${SHAPES[(p.cast as any).shape].label[0].toUpperCase()}${SHAPES[(p.cast as any).shape].label.slice(1)}: ${SHAPES[(p.cast as any).shape].read}`] : []),
          `💘 How it’s going: <b>${PARTNER_TIER[p.tier]}</b>${state.exclusive ? ' — and it’s official. Higher floor, longer drop.' : ''}`,
          ...(p.mood ? [`${MOODS[p.mood].face} Right now: <b>${MOODS[p.mood].label}</b>. Moods pass. Usually.`] : []),
          ...(sec.known && sec.def ? [`🤫 You know their secret: ${sec.def.label}.`] : []),
          'A recoupling checks the Bond OR the public — hold one of them and you stay.',
        ],
      },
    });
  } else {
    out.push({
      label: 'PARTNER', name: 'No one', face: '💔',
      read: 'single', cls: 'stage-partner stage-single', live: live.has('partner'),
      sheet: {
        title: 'Single',
        lines: [
          '💔 No Partner, no Bond — at a recoupling only the public can save you.',
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
      label: 'RIVAL', name: r.cast.name, face: r.face, moodFace: r.moodFace,
      read: active ? 'on the move' : TIER_LABEL[r.tier],
      cls: 'stage-rival mood-' + (r.mood || 'level') + (active ? ' stage-threat' : ''), live: live.has('rival'),
      sheet: {
        title: `${r.cast.name} — the Rival`,
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
      label: 'BOMBSHELL', name: b.cast.name, face: b.face, moodFace: b.moodFace,
      read: b.mood ? MOODS[b.mood].label : 'just landed',
      cls: 'stage-bombshell mood-' + (b.mood || 'level'), live: live.has('bombshell'),
      sheet: {
        title: `${b.cast.name} — the bombshell`,
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
    ? abs >= 8 ? ['💘 The Bond surges. Other couples take it personally.', '💘 A jump in the Bond you could see from the beach.']
    : abs >= 4 ? ['💘 The Bond builds, properly.', '💘 Real Bond, banked.', '💘 The Bond climbs. The daybed approves.']
    : ['💘 The Bond warms a notch.', '💘 A little more Bond in the bank.', '💘 The Bond ticks up. Slow is a strategy.']
    : abs >= 8 ? ['💘 The Bond craters. The duvet has a border now.', '💘 A Bond demolition, live on air.']
    : abs >= 4 ? ['💘 The Bond takes a real hit.', '💘 That cost you Bond you’d actually built.']
    : ['💘 The Bond cools a touch.', '💘 A scuff on the Bond. Buffable.'];
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
    face: c.face, moodFace: c.moodFace, name: c.cast.name,
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

function storySoFar(state: RunState, act: number): string {
  const p = castById(state.partner)?.name;
  const r = castById(state.rival)?.name || 'someone';
  const acted = (state.cardLog || []).filter((c: any) => c.a === act - 1);
  const rough = acted.filter((c: any) => c.t === 'bad').length >= Math.max(3, acted.length * 0.4);
  if (act === 2) {
    const open = pick(state, [
      'Week one: sun cream, first dates, and eye contact with consequences.',
      'One week down. Everyone said “vibes” a minimum of forty times.',
      'Arrival week is over. The airport tans have faded; the agendas haven’t.',
      'Half-time in paradise. The couples think they’re settled. Production disagrees, and production has a budget.',
      'One week down. Feelings have been caught. Some were even meant.',
    ], 7);
    const couple = p
      ? ` You coupled up with <b>${p}</b>, and the nation started having opinions in group chats. ${r} started having them out loud.`
      : ` You are, at time of broadcast, single — which in here is a weather warning. ${r} noticed first.`;
    const wobble = rough ? ' It has, frankly, been a bumpy start. The nation respects a comeback arc.' : '';
    return `🎙️ ${open}${couple}${wobble}`;
  }
  // Act 3: the Turn just happened — Casa, the footage, the ceremony.
  const bits: string[] = [];
  if (state.flags.includes('li_betrayed')) bits.push(`Casa Amor happened, and it happened <i>to you</i>: your head stayed loyal, your other half didn’t.`);
  else if (state.flags.includes('li_casa_recouple')) bits.push('You went to Casa Amor and came back with a different person. Bold television.');
  else if (state.flags.includes('li_casa_kiss')) bits.push('Casa Amor happened. So did a kiss. The footage is filed under “pending.”');
  else if (state.flags.includes('li_loyal_casa')) bits.push('You did Casa Amor the boring way: loyal, asleep by eleven. The nation quietly loved it.');
  else bits.push('The Turn did what the Turn does — new faces, old feelings, a postcard nobody framed.');
  if (state.flags.includes('li_partner_revealed')) bits.push('Movie Night rolled the tape, and the tape had a co-star.');
  else if (state.flags.includes('li_revealed')) bits.push('Movie Night rolled your tape. The villa watched it twice.');
  const verdict = state.lastCeremony?.verdict;
  if (verdict === 'held') bits.push('At the firepit, the couple held.');
  else if (verdict === 'rescued') bits.push('At the firepit the Bond blinked — the public didn’t. Rescued.');
  return `🎙️ ${bits.join(' ')}`;
}

function whatsComing(state: RunState, act: number): string {
  if (act === 2) {
    const chooser = state.gender === 'girl'; // recoup1: the girls choose
    const recoup = chooser
      ? 'Then a recoupling where <b>the girls choose</b> — that’s you, holding the pen.'
      : 'Then a recoupling where <b>the girls choose</b> — and you find out what your week was worth.';
    return `⚠️ <b>Casa Amor.</b> The villa splits, strangers unpack, and loyalty gets a camera pointed at it. Movie Night follows — footage outranks feelings. ${recoup}`;
  }
  const chooser = state.gender === 'boy'; // recoup2: the boys choose
  const recoup = chooser
    ? 'First: a recoupling. <b>The boys choose.</b> You are the boys.'
    : 'First: a recoupling. <b>The boys choose.</b> You are not the boys — you survive on the Bond or the nation, and nothing else.';
  const hot = (state.stats?.burnout ?? 0) >= 62
    ? ' And you’re carrying a loud head into a week that eats loud heads — <b>get it quiet or you’ll walk</b>. The Beach Hut counts as a move.'
    : '';
  return `⚠️ ${recoup} After that: families with opinions, final dates, and a public vote climbing like a fever. The envelope is already printed.${hot}`;
}

export function villaRecap(state: RunState, act: number, _seed: number) {
  if (state.tutorial || (act !== 2 && act !== 3)) return null;
  return {
    kicker: 'PREVIOUSLY, IN THE VILLA',
    title: act === 2 ? 'THE TURN' : 'FINAL WEEK',
    blocks: [
      { html: storySoFar(state, act), cls: 'recap-story' },
      { label: 'YOUR COUPLE', html: coupleRead(state), cls: 'recap-couple' },
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
    ? (o.bondSafe ? stake(`💘 The Bond: enough to hold ${partner}`, 'sp-safe')
      : stake('💘 The Bond: not enough on its own tonight', 'sp-risk'))
    : stake('💘 No Partner, no Bond — the public is the whole plan', 'sp-risk'));
  out.push(o.publicSafe ? stake('🗳️ The public: they’d keep you', 'sp-safe')
    : stake('🗳️ The public: undecided at best', 'sp-risk'));
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
        stake('💘 The Bond grows when you feed it — this is the feeding'),
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
            ? `💘 A poach tests the Bond — yours reads ${PARTNER_TIER[opinionTier(state.bond ?? 0)]}`
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
        stake(`💘 Keep ${partner}: the Bond carries over`, 'sp-safe'),
        stake('🔁 Switch: a new face, and the Bond starts from scratch', 'sp-risk'),
      ],
    };
  }
  if (id === 'li_recoup1_choose_single' || id === 'li_recoup2_choose_single') {
    return {
      banner: 'THE RECOUPLING', cls: 'sp-ceremony',
      sub: 'You’re single, and tonight that’s power: you choose.',
      stakes: [stake('💘 Whoever you pick, the Bond starts where all Bonds start', '')],
    };
  }
  // The verdicts: out the other side, framed.
  if (id === 'li_recoup_held') return { banner: 'THE VERDICT', cls: 'sp-ceremony sp-held', sub: 'The couple holds.', mood: 'triumph' as const };
  if (id === 'li_recoup_rescued') return { banner: 'THE VERDICT', cls: 'sp-ceremony sp-rescued', sub: 'The Bond blinked. The public didn’t.' };
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

  // The Final's authored cards.
  if (ev.finaleCard || id.startsWith('li_final_')) {
    return {
      banner: 'THE FINAL', cls: 'sp-final',
      sub: 'Last night in the villa. The nation is voting right now.',
    };
  }
  return null;
}
