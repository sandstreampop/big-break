// Coupling — the Love Island pack's heart, as a plugin (ADR-0001/0002/0003).
// Owns everything the engine must never name: the single Partner, the Bond
// resource and its clamps/resets, Recoupling survival (`Bond ≥ floor OR
// Public ≥ floor`), the alternating chooser, Casa Amor's gut-punch, the latent
// loyalty/betrayal flags and their Reveals (postcard / Movie Night), the
// Exclusivity state, the Rival's Bond penalty, and the rare immediate-recouple
// Bombshell steal. The Golden Retriever's Bond-build quirk is read off
// pctx.hooks (`bondGainMult`) — a pack-custom key the engine never sees.

import { castById, couplePool, sameGenderPool } from '../cast.js';
import type { Plugin, RunState } from '../../../types.js';

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

// ---------- Balance knobs (the Coupling subsystem's own numbers) ----------
export const COUPLING = {
  bondBase: 12,        // a fresh couple's Bond — every switch starts over here
  bondFloor: 30,       // chosen-Recoupling survival: Bond ≥ this holds your Partner
  publicFloor: 28,     // …OR Public ≥ this and somebody picks you anyway
  rivalPenalty: 8,    // active Rival poaches: effective Bond at the check drops
  rivalMagnetExtra: 5, // Head-Turner types attract worse poaching
  exclusiveEase: 15,   // official couples: Partner re-picks at a friendlier floor
  // Casa Amor: the Partner's hidden loyalty draw (regular, not rare — ADR-0002)
  casaOdds: { gone: 0.22, kissed: 0.34 },            // rest = loyal
  casaOddsExclusive: { gone: 0.10, kissed: 0.25 },
  // Immediate-recouple Bombshell: odds scale inversely with Bond + Public
  stealBase: 0.55, stealScale: 160, stealMin: 0.10,
};

// The qualitative read of the chosen-side survival check, BEFORE the roll —
// the same math afterResolve runs, minus the unknowable tier bonus. This is
// what Stirling's ceremony forecast speaks (ADR-0008's truthfulness
// constraint: his read must reflect the actual state, so it reads this
// plugin's own arithmetic rather than paraphrasing it).
export function ceremonyOutlook(state: RunState) {
  const floor = state.exclusive ? COUPLING.bondFloor - COUPLING.exclusiveEase : COUPLING.bondFloor;
  let bondEff = state.partner ? state.bond : 0;
  if (state.flags.includes('li_rival_active')) {
    bondEff -= COUPLING.rivalPenalty;
    if (state.rivalMagnet) bondEff -= COUPLING.rivalMagnetExtra;
  }
  return {
    floor, publicFloor: COUPLING.publicFloor,
    bondEff, publicEff: state.public,
    bondSafe: !!state.partner && bondEff >= floor,
    publicSafe: state.public >= COUPLING.publicFloor,
  };
}

// The latent betrayal flags this plugin owns (yours; the Partner's hidden
// state lives in state.partnerLoyal). The Reveal detonates them.
const MY_DIRT = ['li_casa_kiss', 'li_head_turned', 'li_strayed_official'];

const hasDirt = (s: RunState) => MY_DIRT.some((f) => s.flags.includes(f));
const clearDirt = (s: RunState) => { s.flags = s.flags.filter((f) => !MY_DIRT.includes(f)); };

const note = (pctx: any, cls: string, html: string) => {
  const d = pctx.deltas;
  (d.notices = d.notices || []).push({ cls, html });
};
const pushDelta = (pctx: any, key: string, amount: number) => {
  if (amount) pctx.deltas.push({ key, amount });
};

// Apply a bond change through the plugin's own arithmetic (clamp, no-partner
// rule) and record the display delta.
function moveBond(state: RunState, v: number, pctx: any) {
  if (!v) return 0;
  if (v > 0 && !state.partner) return 0; // no Partner, nothing to bond WITH
  const before = state.bond;
  state.bond = clamp(before + v, 0, 100);
  const d = state.bond - before;
  pushDelta(pctx, 'bond', d);
  return d;
}
function movePublic(state: RunState, v: number, pctx: any) {
  if (!v) return 0;
  const before = state.public;
  state.public = Math.max(0, before + v);
  pushDelta(pctx, 'public', before === state.public ? 0 : state.public - before);
  return state.public - before;
}

// Draw a new Partner from the couple pool (never your exes while anyone fresh
// remains, never your current Partner).
function drawPartner(state: RunState, rng: () => number): string | null {
  const pool = couplePool(state, { bombshells: true })
    .filter((c) => c.id !== state.partner);
  const fresh = pool.filter((c) => !(state.exes || []).includes(c.id));
  const from = fresh.length ? fresh : pool;
  if (!from.length) return null;
  return from[Math.floor(rng() * from.length)].id;
}

function newCouple(state: RunState, rng: () => number, pctx: any) {
  if (state.partner) (state.exes = state.exes || []).push(state.partner);
  state.partner = drawPartner(state, rng);
  state.exclusive = false;
  state.partnerLoyal = null;
  const before = state.bond;
  state.bond = COUPLING.bondBase;
  pushDelta(pctx, 'bond', state.bond - before);
  const p = castById(state.partner);
  if (p) note(pctx, 'notice-gear', `💘 Coupled up: <b>${p.name}</b> — ${p.vibe}. The Bond starts where all Bonds start.`);
}

export const couplingPlugin: Plugin = {
  id: 'coupling',
  effectVerbs: [
    'couple', 'switchPartner', 'bondReset', 'exclusive',
    'stealRoll', 'casaLoyaltyDraw', 'casaReturn', 'chosenCeremony',
    'reveal', 'comeClean',
  ],
  stateDefaults: {
    partner: null,       // the one Islander you're coupled with (cast id)
    gender: 'girl',      // mechanical (ADR-0003); onConstruct reads the persona
    exclusive: false,    // "closed off" — made it official
    exes: [],            // former Partners (re-pick pool of last resort, Rival fuel)
    partnerLoyal: null,  // hidden: null | 'loyal' | 'kissed' | 'gone' (seeded at Casa)
    rival: null,         // same-gender Cast member gunning for your spot
  },

  // Construction draws, frozen order: gender is derived (no rng), the Rival is
  // this run's one coupling construction draw — same discipline as music's.
  onConstruct(state, rng) {
    const persona = String(state.loadout || '');
    state.gender = persona.endsWith('_boy') ? 'boy' : 'girl';
    const pool = sameGenderPool(state);
    state.rival = pool.length ? pool[Math.floor(rng() * pool.length)].id : null;
  },

  requires: {
    singleIs: (s, arg) => !s.partner === !!arg,
    exclusiveIs: (s, arg) => !!s.exclusive === !!arg,
    genderIs: (s, arg) => s.gender === arg,
    // Does the Partner have hidden Casa footage waiting for Movie Night?
    partnerKissedIs: (s, arg) => (s.partnerLoyal === 'kissed') === !!arg,
  },

  // Bond is plugin-owned: clamp 0–100, no gains while single, the Golden
  // Retriever's build multiplier via the loadout's custom hook key.
  applyResource(res, effects, state, ctx) {
    if (res !== 'bond') return undefined;
    let v = (effects as any).bond || 0;
    if (!v) return 0;
    if (v > 0 && (ctx as any).hooks?.bondGainMult) v = Math.round(v * (ctx as any).hooks.bondGainMult);
    if (v > 0 && !state.partner) return 0;
    const before = state.bond;
    state.bond = clamp(before + v, 0, 100);
    return state.bond - before;
  },

  onEffect(state, effects, pctx) {
    const e = effects as any;
    const rng = pctx.rng;

    // First coupling / re-coupling from single.
    if (e.couple) newCouple(state, rng, pctx);

    // A voluntary switch: starting over is starting over (ADR-0002).
    if (e.switchPartner) {
      const hadPartner = !!state.partner;
      newCouple(state, rng, pctx);
      // A discarded ex is Rival fuel.
      if (hadPartner && !state.flags.includes('li_rival_active')) state.flags.push('li_rival_active');
      // Walking in with someone new is not loyal-through-Casa, whatever the
      // nights before said.
      if (e.addFlag === 'li_casa_recouple') state.flags = state.flags.filter((f: string) => f !== 'li_loyal_casa');
    }

    // External betrayal: the Bond resets, the couple technically survives.
    if (e.bondReset && state.partner) {
      const before = state.bond;
      state.bond = COUPLING.bondBase;
      pushDelta(pctx, 'bond', state.bond - before);
    }

    // Making it official — or un-making it, expensively.
    if (e.exclusive === 1) {
      state.exclusive = true;
      note(pctx, 'notice-encore', '🔒 <b>Exclusive.</b> Closed off, on the record. The fall-height just doubled.');
    } else if (e.exclusive === -1 && state.exclusive) {
      state.exclusive = false;
      note(pctx, 'notice-bad', '🔓 No longer exclusive. The villa updates its spreadsheets.');
    }

    // The rare immediate-recouple Bombshell (ADR-0002): odds scale inversely
    // with Bond + Public; a solid, well-loved couple usually resists.
    if (e.stealRoll && state.partner) {
      const p = clamp(COUPLING.stealBase - (state.bond + state.public) / COUPLING.stealScale, COUPLING.stealMin, COUPLING.stealBase);
      const partner = castById(state.partner);
      if (rng() < p) {
        (state.exes = state.exes || []).push(state.partner);
        state.partner = null;
        state.exclusive = false;
        state.partnerLoyal = null;
        const before = state.bond;
        state.bond = 0;
        pushDelta(pctx, 'bond', -before);
        for (const f of ['li_stranded', 'li_rival_active']) if (!state.flags.includes(f)) state.flags.push(f);
        note(pctx, 'notice-bad', `💔 <b>${partner?.name || 'Your partner'} recouples on the spot.</b> You are single, live, at a ceremony. The next recoupling has your name on the list either way.`);
      } else {
        moveBond(state, 2, pctx);
        note(pctx, 'notice-good', `💘 The bombshell looks your couple up and down — and moves on. What you two have held, publicly.`);
      }
    }

    // Casa Amor: seed the Partner's hidden loyalty (dramatic irony — you won't
    // know until the return, or Movie Night).
    if (e.casaLoyaltyDraw && state.partner && !state.partnerLoyal) {
      const odds = state.exclusive ? COUPLING.casaOddsExclusive : COUPLING.casaOdds;
      const r = rng();
      state.partnerLoyal = r < odds.gone ? 'gone' : r < odds.gone + odds.kissed ? 'kissed' : 'loyal';
    }

    // The Casa return, faithful branch: the gut-punch fires here or doesn't.
    // Queues the verdict card; the payoffs live on those cards' effects.
    if (e.casaReturn) {
      if (state.partnerLoyal === 'gone') {
        (state.exes = state.exes || []).push(state.partner);
        state.partner = null;
        state.exclusive = false;
        state.partnerLoyal = null;
        const before = state.bond;
        state.bond = 0;
        pushDelta(pctx, 'bond', -before);
        for (const f of ['li_betrayed', 'li_sympathy', 'li_rival_active']) if (!state.flags.includes(f)) state.flags.push(f);
        state.pendingChainId = 'li_casa_betrayed';
      } else {
        state.pendingChainId = 'li_casa_held';
      }
    }

    // Come clean at the firepit: a smaller certain hit (authored on the card)
    // buys off the bigger detonation later.
    if (e.comeClean) {
      clearDirt(state);
      state.flags.push('li_came_clean');
    }

    // The Reveal (postcard teaser / Movie Night full footage): read the latent
    // flags — yours and the Partner's hidden state — and detonate.
    if (e.reveal === 'movienight') {
      const partner = castById(state.partner);
      const mineOut = hasDirt(state);
      const official = state.flags.includes('li_strayed_official');
      if (mineOut) {
        let dmg = state.flags.includes('li_casa_kiss') ? -12 : -6;
        if (official) dmg = Math.round(dmg * 1.5);
        moveBond(state, dmg, pctx);
        movePublic(state, official ? -4 : -2, pctx);
        note(pctx, 'notice-bad', `📼 <b>Your footage plays.</b> In HD. With sound. ${partner ? partner.name : 'The villa'} watches it twice.`);
        clearDirt(state);
        state.flags.push('li_revealed');
      }
      if (state.partnerLoyal === 'kissed' && state.partner) {
        moveBond(state, -10, pctx);
        movePublic(state, 4, pctx);
        note(pctx, 'notice-bad', `📼 <b>${partner?.name}’s Casa footage plays.</b> You never knew. Everyone watches you find out.`);
        state.partnerLoyal = 'loyal'; // spent
        state.flags.push('li_partner_revealed', 'li_sympathy');
      }
      if (mineOut && state.flags.includes('li_partner_revealed')) {
        const before = state.followers;
        state.followers += 6;
        pushDelta(pctx, 'followers', state.followers - before);
        note(pctx, 'notice-viral', '🎬 Two betrayals, one sofa. Nobody wins Movie Night. The clip, however, does numbers.');
      }
    }
  },

  // The chosen-side Recoupling (the other gender picks): the survival check is
  // `Bond ≥ floor OR Public ≥ floor` (ADR-0002); an active Rival poaches. The
  // ceremony card resolves normally, then this queues the verdict card.
  afterResolve(state, _result, cardCtx) {
    const tier = cardCtx.tier as 'bad' | 'good' | 'incredible' | undefined;
    const e = tier && cardCtx.choice ? (cardCtx.choice.outcomes?.[tier]?.effects as any) : null;
    if (!e?.chosenCeremony) return;
    // How your last stand LANDS matters: the tier buffs whichever lane you
    // chose to trust (a loyal/chat choice pleads the Bond; a strategy/camera
    // choice works the room).
    const bondLane = (cardCtx.choice.tags || []).some((t: string) => t === 'loyal' || t === 'chat');
    const tierBonus = tier === 'incredible' ? 12 : tier === 'good' ? 6 : 0;
    let bondEff = state.partner ? state.bond : 0;
    let publicEff = state.public;
    if (bondLane) bondEff += tierBonus; else publicEff += tierBonus;
    // An active Rival poaches at the check; Head-Turner types (rivalMagnet,
    // stamped on state at run start by the producers plugin) attract worse.
    if (state.flags.includes('li_rival_active')) {
      bondEff -= COUPLING.rivalPenalty;
      if (state.rivalMagnet) bondEff -= COUPLING.rivalMagnetExtra;
    }
    const floor = state.exclusive ? COUPLING.bondFloor - COUPLING.exclusiveEase : COUPLING.bondFloor;
    if (state.partner && bondEff >= floor) {
      state.pendingChainId = 'li_recoup_held';
    } else if (publicEff >= COUPLING.publicFloor) {
      state.pendingChainId = 'li_recoup_rescued';
    } else {
      state.pendingChainId = 'li_recoup_dumped';
    }
  },
};
