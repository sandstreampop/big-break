// Characters — first-class character state for the villa's people (ADR-0006).
// Promotes the Partner, the season-long Rival, and the active bombshell from
// flavour to run-state: each carries an OPINION of you (visible tiers, never a
// raw number on the HUD), a transient MOOD (colours portraits and dialogue,
// decays on its own), and one hidden SECRET (an extension of the ADR-0002
// latent-flag machinery — gossip and encounters can surface it for mechanical
// effect). Pack-owned: the engine names no character concept.
//
// Bond stays the numeric backing of the Partner's opinion (the survival math of
// ADR-0002 is untouched); the Rival and bombshell get their own opinion number,
// plugin-owned. All numbers live here; the presenter reads TIERS and MOODS out
// diegetically (portraits, Stirling), never the floats.

import { castById, CAST } from '../cast.js';
import type { Plugin, RunState } from '../../../types.js';

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

// ---------- Balance knobs (the character subsystem's own numbers) ----------
export const CHARACTERS = {
  rivalOpinionStart: 34,     // the Rival arrives unimpressed, not hostile
  bombshellOpinionStart: 46, // a bombshell reads you fresh, no history
  moodTtl: 4,                // cards a mood colours before it fades
  // The nation watches MOMENTS: an encounter beat that lands pulls votes (and
  // an incredible one trends). Balances the deck share encounters displaced
  // from the public/followers-paying ambient cards.
  encounterPublic: { good: 1, incredible: 3 } as Record<string, number>,
  encounterFollowersIncredible: 2,
};

// The bounded mood set (the portrait art direction's whole vocabulary — a mood
// is a face, so the set stays small on purpose).
export const MOODS: Record<string, { face: string; label: string }> = {
  buzzing: { face: '😍', label: 'buzzing' },
  smug: { face: '😏', label: 'smug' },
  fuming: { face: '😤', label: 'fuming' },
  wounded: { face: '🥺', label: 'wounded' },
  scheming: { face: '🫢', label: 'scheming' },
  torn: { face: '😶‍🌫️', label: 'torn' },
};

// Opinion tiers — the Persona lesson: a relationship lands when its level is
// legible and gates things. Thresholds are shared by every character.
export type OpinionTier = 'cold' | 'cool' | 'warm' | 'smitten';
export function opinionTier(v: number): OpinionTier {
  return v < 25 ? 'cold' : v < 50 ? 'cool' : v < 75 ? 'warm' : 'smitten';
}
export const TIER_LABEL: Record<OpinionTier, string> = {
  cold: 'ice cold', cool: 'lukewarm', warm: 'warm', smitten: 'smitten',
};

// ---------- Secrets (one hidden agenda per character, seeded per run) ----------
// A secret extends the Reveal latent-flag system: hidden until an encounter or
// gossip SURFACES it (you learn it — it becomes held intel), then a deploy can
// PLAY it (ADR-0007's ceremony cash-out). The pools are per-role because a
// Rival's secret is leverage and a Partner's is a landmine.
export interface SecretDef { id: string; label: string; }
export const RIVAL_SECRETS: SecretDef[] = [
  { id: 'sec_outside', label: 'there’s a “situation” waiting outside the villa' },
  { id: 'sec_brand', label: 'the management team was signed before the flight' },
  { id: 'sec_list', label: 'there’s a ranked list of targets in a notes app' },
  { id: 'sec_producer', label: 'production keeps pulling them in for “little chats”' },
];
export const PARTNER_SECRETS: SecretDef[] = [
  { id: 'sec_ex_dm', label: 'an ex got a “just checking in” DM the night before the villa' },
  { id: 'sec_cold_feet', label: 'they told their mate they’d walk by week three' },
  { id: 'sec_type', label: 'you are, on paper, the opposite of their type' },
  { id: 'sec_showmance', label: 'the word “showmance” appears in their audition tape' },
];
export const BOMBSHELL_SECRETS: SecretDef[] = [
  { id: 'sec_knows', label: 'they know one of the Islanders from home' },
  { id: 'sec_brief', label: 'they walked in with a target already picked' },
  { id: 'sec_second', label: 'this is their second application. The first got them to the airport' },
];
const secretById = (id: string | null) =>
  [...RIVAL_SECRETS, ...PARTNER_SECRETS, ...BOMBSHELL_SECRETS].find((s) => s.id === id) || null;

// The character roles this plugin tracks. 'partner' reads Bond for opinion;
// the other two own their number in state.charOpinion.
export type CharRole = 'partner' | 'rival' | 'bombshell';

// ---------- State reads (the presenter/Stirling surface) ----------

// Who a role currently IS (cast id), or null.
export function roleCastId(state: RunState, role: CharRole): string | null {
  if (role === 'partner') return state.partner || null;
  if (role === 'rival') return state.rival || null;
  return state.bombshellId || null;
}

// A role's opinion as the raw number this plugin owns (partner = Bond).
export function opinionOf(state: RunState, role: CharRole): number {
  if (role === 'partner') return state.bond ?? 0;
  return state.charOpinion?.[role] ?? 0;
}

// A role's current mood (or null when it has decayed back to neutral).
export function moodOf(state: RunState, role: CharRole): string | null {
  const m = state.charMood?.[role];
  return m && m.ttl > 0 ? m.id : null;
}

// A role's secret: def, whether you've surfaced it, whether it's been played.
export function secretOf(state: RunState, role: CharRole) {
  const id = state.charSecret?.[role] || null;
  return {
    def: secretById(id),
    known: (state.secretKnown || []).includes(role),
    spent: (state.secretSpent || []).includes(role),
  };
}

// The full presenter read for one role: castmember + tier + mood + the
// portrait pair (base face, mood face), or null when the seat is empty. This
// is the ONLY shape the HUD/portrait layer consumes.
export function characterRead(state: RunState, role: CharRole) {
  const cast = castById(roleCastId(state, role));
  if (!cast) return null;
  const mood = moodOf(state, role);
  return {
    role, cast,
    face: (cast as any).face || '',
    tier: opinionTier(opinionOf(state, role)),
    mood, moodFace: mood ? MOODS[mood]?.face || null : null,
  };
}

const note = (pctx: any, cls: string, html: string) => {
  const d = pctx.deltas;
  (d.notices = d.notices || []).push({ cls, html });
};

// Fill the bombshell seat with a seeded draw from the pool: fresh opinion,
// fresh secret, no history. Used by the bombshellEnters verb and by the
// bombshell beat cards resolving (afterResolve below).
function seatBombshell(state: RunState, rng: () => number, want: string) {
  const pool = CAST.filter((c) => c.bombshell && c.gender === want && c.id !== state.partner);
  const pick = pool.length ? pool[Math.floor(rng() * pool.length)] : null;
  if (!pick) return;
  state.bombshellId = pick.id;
  state.charOpinion.bombshell = CHARACTERS.bombshellOpinionStart;
  state.charMood.bombshell = null;
  state.charSecret.bombshell = BOMBSHELL_SECRETS[Math.floor(rng() * BOMBSHELL_SECRETS.length)].id;
  state.secretKnown = (state.secretKnown || []).filter((r: string) => r !== 'bombshell');
  state.secretSpent = (state.secretSpent || []).filter((r: string) => r !== 'bombshell');
  if (!state.flags.includes(`li_arrived_${pick.id}`)) state.flags.push(`li_arrived_${pick.id}`);
}

function moveOpinion(state: RunState, role: 'rival' | 'bombshell', v: number) {
  if (!roleCastId(state, role)) return 0;
  const before = state.charOpinion[role] ?? 0;
  state.charOpinion[role] = clamp(before + v, 0, 100);
  return state.charOpinion[role] - before;
}

// Set a role's transient mood — the shared face-mover every villa subsystem
// uses (cards via the mood verbs; coupling/gossip react to their own beats).
// Guarded: unknown moods and empty seats are no-ops.
export function setCharMood(state: RunState, role: CharRole, mood: string) {
  if (!MOODS[mood] || !roleCastId(state, role) || !state.charMood) return;
  state.charMood[role] = { id: mood, ttl: CHARACTERS.moodTtl };
}
const setMood = setCharMood;

export const charactersPlugin: Plugin = {
  id: 'characters',
  effectVerbs: [
    'rivalOpinion', 'bombshellOpinion',
    'partnerMood', 'rivalMood', 'bombshellMood',
    'surfaceSecret', 'bombshellEnters', 'rivalFromBombshell',
  ],
  stateDefaults: {
    charOpinion: {},     // rival/bombshell opinion numbers (partner = Bond)
    charMood: {},        // role → { id, ttl } transient mood
    charSecret: {},      // role → secret id (hidden until surfaced)
    secretKnown: [],     // roles whose secret you HOLD (surfaced intel)
    secretSpent: [],     // roles whose secret has been PLAYED (one use)
    secretSurfacedCount: 0, // monotonic: total surfaces this run (bark trigger)
    bombshellId: null,   // the active bombshell (set by bombshellEnters)
    charPartnerWas: null, // change detector: a new Partner re-draws their secret
  },

  // Construction draw, frozen order (after coupling's Rival draw): the
  // season-long Rival's secret. The Partner's is drawn when a couple forms
  // (afterResolve below) and the bombshell's when one enters — both play-RNG
  // draws, mid-run.
  onConstruct(state, rng) {
    state.charOpinion = { rival: CHARACTERS.rivalOpinionStart, bombshell: 0 };
    state.charSecret = {
      rival: RIVAL_SECRETS[Math.floor(rng() * RIVAL_SECRETS.length)].id,
      partner: null,
      bombshell: null,
    };
  },

  requires: {
    // Gate an encounter branch on a role's opinion tier (ADR-0006: tiers gate
    // things). Arg: 'rival:warm' — true when the role's tier is AT LEAST that.
    opinionAtLeast: (s, arg) => {
      const [role, tier] = String(arg).split(':');
      const order: OpinionTier[] = ['cold', 'cool', 'warm', 'smitten'];
      return order.indexOf(opinionTier(opinionOf(s, role as CharRole))) >= order.indexOf(tier as OpinionTier);
    },
    opinionBelow: (s, arg) => {
      const [role, tier] = String(arg).split(':');
      const order: OpinionTier[] = ['cold', 'cool', 'warm', 'smitten'];
      return order.indexOf(opinionTier(opinionOf(s, role as CharRole))) < order.indexOf(tier as OpinionTier);
    },
    // Do you hold a role's surfaced secret (unspent)?
    secretHeldIs: (s, arg) => {
      const [role, want] = String(arg).split(':');
      const holds = (s.secretKnown || []).includes(role) && !(s.secretSpent || []).includes(role);
      return holds === (want !== 'false');
    },
    bombshellActiveIs: (s, arg) => !!s.bombshellId === !!arg,
  },

  // The nation watches moments: encounter beats that land pull votes, and a
  // showy lane (drama/camera/flirt/banter) that lands feeds the following.
  // Folded into the payload before it applies, so the deltas read as one number.
  modifyEffects(state, effects, ctx) {
    const ev = (ctx as any).ev;
    const tier = (ctx as any).tier as string | undefined;
    if (!ev || !(ev.tags || []).includes('encounter')) return;
    if (tier !== 'good' && tier !== 'incredible') return;
    const pub = CHARACTERS.encounterPublic[tier] || 0;
    if (pub) (effects as any).public = ((effects as any).public || 0) + pub;
    const showy = ((ctx as any).choice?.tags || [])
      .some((t: string) => t === 'drama' || t === 'camera' || t === 'flirt' || t === 'banter');
    const fol = (tier === 'incredible' ? CHARACTERS.encounterFollowersIncredible : 0) + (showy ? 1 : 0);
    if (fol) (effects as any).followers = ((effects as any).followers || 0) + fol;
  },

  onEffect(state, effects, pctx) {
    const e = effects as any;

    // Opinion deltas (the Rival's and bombshell's own numbers; the Partner's
    // opinion IS Bond and moves through the coupling plugin).
    if (e.rivalOpinion) moveOpinion(state, 'rival', e.rivalOpinion);
    if (e.bombshellOpinion) moveOpinion(state, 'bombshell', e.bombshellOpinion);

    // Moods: transient, portrait-colouring, decay on their own.
    if (e.partnerMood) setMood(state, 'partner', e.partnerMood);
    if (e.rivalMood) setMood(state, 'rival', e.rivalMood);
    if (e.bombshellMood) setMood(state, 'bombshell', e.bombshellMood);

    // A bombshell takes the active seat, seeded from the bombshell pool.
    // Default is the opposite gender (a temptation aimed at you); 'same'
    // draws your own gender (a threat aimed at your couple — second-wave
    // rival material).
    if (e.bombshellEnters) {
      seatBombshell(state, pctx.rng, e.bombshellEnters === 'same' ? state.gender : state.gender === 'girl' ? 'boy' : 'girl');
    }

    // The bombshell steps up as a second-wave Rival (V2-DESIGN: the villa
    // churns rather than staying a fixed 1-v-1). Same-gender only — a Rival
    // competes for your Partner and your screen time.
    if (e.rivalFromBombshell && state.bombshellId) {
      const b = castById(state.bombshellId);
      if (b && b.gender === state.gender) {
        state.rival = b.id;
        state.charOpinion.rival = state.charOpinion.bombshell ?? CHARACTERS.rivalOpinionStart;
        state.charSecret.rival = state.charSecret.bombshell;
        state.charMood.rival = state.charMood.bombshell || null;
        state.secretKnown = (state.secretKnown || []).map((r: string) => (r === 'bombshell' ? 'rival' : r));
        state.secretSpent = (state.secretSpent || []).map((r: string) => (r === 'bombshell' ? 'rival' : r));
        state.bombshellId = null;
        state.charMood.bombshell = null;
        if (!state.flags.includes('li_rival_active')) state.flags.push('li_rival_active');
        note(pctx, 'notice-bad', `⚔️ <b>${b.name} stops circling and picks a lane.</b> Yours. The Season has a second act villain, and it’s the new arrival.`);
      }
    }

    // Surfacing a secret: it stops being latent and becomes something you
    // HOLD (the gossip plugin treats held secrets as its heaviest intel).
    if (e.surfaceSecret) {
      const role = e.surfaceSecret as CharRole;
      const sec = secretOf(state, role);
      if (sec.def && !sec.known) {
        (state.secretKnown = state.secretKnown || []).push(role);
        state.secretSurfacedCount = (state.secretSurfacedCount || 0) + 1;
        const who = castById(roleCastId(state, role));
        note(pctx, 'notice-encore', `🤫 <b>You know something now.</b> ${who ? who.name : 'Their'}’s secret: ${sec.def.label}. Yours to keep. Or not.`);
      }
    }
  },

  // Moods decay card by card — a mood is weather, not a bank balance. A new
  // Partner is a new person: their secret re-draws (seeded) and anything you
  // held on the old one is history. A bombshell BEAT resolving fills the
  // seat (the arrival happens whatever you did about it) — the steal variant
  // excepted, whose bombshell couples up on the spot.
  afterResolve(state, _result, cardCtx) {
    const beat = (cardCtx.ev?.tags || []).find((t: string) => t.startsWith('beat:'));
    const landed = cardCtx.tier && cardCtx.tier !== 'declined' && cardCtx.choice
      ? (cardCtx.choice.outcomes as any)?.[cardCtx.tier]?.effects : null;
    if ((beat === 'beat:bomb1' || beat === 'beat:bomb2') && cardCtx.ev.id !== 'li_bomb2_steal' &&
        !state.bombshellId && !landed?.couple && !landed?.switchPartner) {
      seatBombshell(state, cardCtx.rng, state.gender === 'girl' ? 'boy' : 'girl');
    }
    if (state.partner !== state.charPartnerWas) {
      state.charPartnerWas = state.partner;
      state.charMood.partner = null;
      state.secretKnown = (state.secretKnown || []).filter((r: string) => r !== 'partner');
      state.secretSpent = (state.secretSpent || []).filter((r: string) => r !== 'partner');
      if (state.partner) {
        state.charSecret.partner = PARTNER_SECRETS[Math.floor(cardCtx.rng() * PARTNER_SECRETS.length)].id;
      }
    }
    for (const role of ['partner', 'rival', 'bombshell'] as CharRole[]) {
      const m = state.charMood?.[role];
      if (m && m.ttl > 0) {
        m.ttl -= 1;
        if (m.ttl <= 0) state.charMood[role] = null;
      }
    }
  },
};
