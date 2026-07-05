// Coupling — the Love Island pack's heart, as a plugin (ADR-0001/0002/0003).
// Owns everything the engine must never name: the single Partner, the Bond
// resource and its clamps/resets, Recoupling survival (`Bond ≥ floor OR
// Public ≥ floor`), the alternating chooser, Casa Amor's gut-punch, the latent
// loyalty/betrayal flags and their Reveals (postcard / Movie Night), the
// Exclusivity state, the Rival's Bond penalty, and the rare immediate-recouple
// Bombshell steal. The Golden Retriever's Bond-build quirk is read off
// pctx.hooks (`bondGainMult`) — a pack-custom key the engine never sees.

import { castById, couplePool, sameGenderPool } from '../cast.js';
import { opinionTier, setCharMood } from './characters.js';
import { movePublicFactional } from './factions.js';
import type { Plugin, RunState } from '../../../types.js';

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

// ---------- Balance knobs (the Coupling subsystem's own numbers) ----------
export const COUPLING = {
  bondBase: 12,        // a fresh couple's Bond — every switch starts over here
  // Survival floors, tuned for the v4 six-week season (ADR-0011): the
  // ceremonies land in weeks 5–6 of a ~47-card run, so both meters arrive
  // much higher than they did at the v2 acts' checks — the floors rose to
  // keep a recoupling a real question instead of a formality.
  bondFloor: 42,       // chosen-Recoupling survival: Bond ≥ this holds your Partner
  publicFloor: 60,     // …OR Public ≥ this and somebody picks you anyway
                       // (raised for ADR-0012: the factional reactions inject
                       // net vote mid-season, so the S2 floor stopped biting)
  rivalPenalty: 8,    // active Rival poaches: effective Bond at the check drops
  // ADR-0006: the Rival's OPINION of you feeds the poach — a rival who rates
  // you pulls their punches; one who despises you goes in harder. Added to
  // rivalPenalty by tier (net poach floors at 0).
  rivalTierMod: { cold: 4, cool: 0, warm: -4, smitten: -8 } as Record<string, number>,
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
  const bondEff = (state.partner ? state.bond : 0) - rivalPoach(state);
  return {
    floor, publicFloor: COUPLING.publicFloor,
    bondEff, publicEff: state.public,
    bondSafe: !!state.partner && bondEff >= floor,
    publicSafe: state.public >= COUPLING.publicFloor,
  };
}

// The poach an active Rival lands at a ceremony: the base penalty, bent by
// how they rate you (ADR-0006 — opinion feeds recoupling survival) and by
// the Head-Turner's magnetism. Never negative: a smitten rival stands down,
// they don't campaign for you.
export function rivalPoach(state: RunState): number {
  if (!state.flags.includes('li_rival_active')) return 0;
  const tier = opinionTier(state.charOpinion?.rival ?? 0);
  let p = COUPLING.rivalPenalty + (COUPLING.rivalTierMod[tier] ?? 0);
  if (state.rivalMagnet) p += COUPLING.rivalMagnetExtra;
  return Math.max(0, p);
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
  // Public is the factions' derived aggregate (ADR-0012): the coupling
  // plugin's own vote moves route through the factional writer (uniform —
  // no choice tags here), so the aggregate can't drift from its parts.
  const d = movePublicFactional(state, v);
  pushDelta(pctx, 'public', d);
  return d;
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
  if (p) note(pctx, 'notice-gear', `💘 Coupled up: <b>${p.name}</b> — ${p.vibe}. The Connection starts where all Connections start.`);
}

export const couplingPlugin: Plugin = {
  id: 'coupling',
  effectVerbs: [
    'couple', 'switchPartner', 'bondReset', 'exclusive',
    'stealRoll', 'casaLoyaltyDraw', 'casaReturn', 'chosenCeremony',
    'reveal', 'comeClean', 'playSecret',
  ],
  stateDefaults: {
    partner: null,       // the one Islander you're coupled with (cast id)
    gender: 'girl',      // mechanical (ADR-0003); onConstruct reads the persona
    exclusive: false,    // "closed off" — made it official
    exes: [],            // former Partners (re-pick pool of last resort, Rival fuel)
    partnerLoyal: null,  // hidden: null | 'loyal' | 'kissed' | 'gone' (seeded at Casa)
    rival: null,         // same-gender Cast member gunning for your spot
    ceremonyPending: null, // the last stand, held while the cash-out beat plays
    lastCeremony: null,    // the resolved check's readings (Stirling's explain)
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
      setCharMood(state, 'partner', 'torn');
    }

    // Making it official — or un-making it, expensively. Faces react.
    if (e.exclusive === 1) {
      state.exclusive = true;
      setCharMood(state, 'partner', 'buzzing');
      note(pctx, 'notice-encore', '🔒 <b>Exclusive.</b> Closed off, on the record. The fall-height just doubled.');
    } else if (e.exclusive === -1 && state.exclusive) {
      state.exclusive = false;
      setCharMood(state, 'partner', 'wounded');
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
        setCharMood(state, 'rival', 'smug');
        note(pctx, 'notice-bad', `💔 <b>${partner?.name || 'Your partner'} recouples on the spot.</b> You are single, live, at a ceremony. The next recoupling has your name on the list either way.`);
      } else {
        moveBond(state, 2, pctx);
        setCharMood(state, 'partner', 'buzzing');
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
    // Queues the verdict card; the payoffs live on those cards' effects. The
    // faces react — and a Partner who kissed comes back reading TORN, the
    // mood system quietly foreshadowing Movie Night.
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
        setCharMood(state, 'rival', 'smug');
        state.pendingChainId = 'li_casa_betrayed';
      } else {
        setCharMood(state, 'partner', state.partnerLoyal === 'kissed' ? 'torn' : 'buzzing');
        state.pendingChainId = 'li_casa_held';
      }
    }

    // Come clean at the firepit: a smaller certain hit (authored on the card)
    // buys off the bigger detonation later.
    if (e.comeClean) {
      clearDirt(state);
      state.flags.push('li_came_clean');
    }

    // The ceremony cash-out (ADR-0007's sink): the Rival's secret, said out
    // loud at the firepit. One use — it spends the secret, defuses the poach
    // at tonight's check, and breaks the Rival's standing.
    if (e.playSecret === 'rival' && state.rival &&
        (state.secretKnown || []).includes('rival') && !(state.secretSpent || []).includes('rival')) {
      (state.secretSpent = state.secretSpent || []).push('rival');
      if (state.ceremonyPending) state.ceremonyPending.secretPlayed = true;
      state.flags = state.flags.filter((f: string) => f !== 'li_rival_active');
      if (!state.flags.includes('li_secret_detonated')) state.flags.push('li_secret_detonated');
      if (state.charOpinion) state.charOpinion.rival = Math.max(0, (state.charOpinion.rival ?? 0) - 20);
      if (state.charMood) state.charMood.rival = { id: 'wounded', ttl: 4 };
      const r = castById(state.rival);
      note(pctx, 'notice-viral', `💥 <b>${r ? r.name : 'The rival'}’s secret hits the firepit.</b> Said sentences don’t come back. The poach is off; so are the gloves.`);
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
        setCharMood(state, 'partner', official ? 'fuming' : 'wounded');
        note(pctx, 'notice-bad', `📼 <b>Your footage plays.</b> In HD. With sound. ${partner ? partner.name : 'The villa'} watches it twice.`);
        clearDirt(state);
        state.flags.push('li_revealed');
      }
      if (state.partnerLoyal === 'kissed' && state.partner) {
        moveBond(state, -10, pctx);
        movePublic(state, 4, pctx);
        if (!mineOut) setCharMood(state, 'partner', 'torn'); // caught, not cross
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

  // The chosen-side Recoupling as the v2 climax encounter (four beats):
  // line-up (the forecast rides the deal) → LAST STAND (this card's swipe —
  // the tier buffs whichever lane you chose to trust) → the gossip CASH-OUT
  // (a held Rival secret opens one extra beat before the names are read) →
  // the verdict, explained. The survival check itself is unchanged ADR-0002:
  // `Bond ≥ floor OR Public ≥ floor`, an active Rival poaching at the check.
  afterResolve(state, _result, cardCtx) {
    const tier = cardCtx.tier as 'bad' | 'good' | 'incredible' | undefined;
    const e = tier && cardCtx.choice ? (cardCtx.choice.outcomes?.[tier]?.effects as any) : null;
    if (!e?.chosenCeremony) return;
    if (!state.ceremonyPending) {
      // First pass — the last stand. Hold HOW it landed (lane + tier), so the
      // cash-out beat can sit between the stand and the verdict.
      const bondLane = (cardCtx.choice.tags || []).some((t: string) => t === 'loyal' || t === 'chat');
      const tierBonus = tier === 'incredible' ? 12 : tier === 'good' ? 6 : 0;
      state.ceremonyPending = { bondLane, tierBonus, secretPlayed: false };
      // Holding the Rival's surfaced, unspent secret opens the cash-out beat
      // (ADR-0007's natural sink) — one more card before the names.
      const holdsRivalSecret = state.rival &&
        (state.secretKnown || []).includes('rival') && !(state.secretSpent || []).includes('rival');
      if (holdsRivalSecret) {
        state.pendingChainId = 'li_recoup_cashout';
        return;
      }
    }
    resolveCeremony(state);
  },
};

// Run the ADR-0002 survival check from the held last-stand, record the
// readings (state.lastCeremony — what Stirling's verdict explain speaks),
// and queue the verdict card.
function resolveCeremony(state: RunState) {
  const { bondLane, tierBonus, secretPlayed } = state.ceremonyPending;
  state.ceremonyPending = null;
  let bondEff = state.partner ? state.bond : 0;
  let publicEff = state.public;
  if (bondLane) bondEff += tierBonus; else publicEff += tierBonus;
  // An active Rival poaches at the check — bent by their opinion of you
  // (rivalPoach) — unless their secret just went off at the firepit (the
  // cash-out defuses the poach).
  if (!secretPlayed) bondEff -= rivalPoach(state);
  const floor = state.exclusive ? COUPLING.bondFloor - COUPLING.exclusiveEase : COUPLING.bondFloor;
  const verdict = state.partner && bondEff >= floor ? 'held'
    : publicEff >= COUPLING.publicFloor ? 'rescued' : 'dumped';
  state.lastCeremony = {
    bondEff, publicEff, floor, publicFloor: COUPLING.publicFloor,
    bondLane, secretPlayed, verdict,
  };
  // Portraits react (V2-DESIGN beat 4): the verdict moves faces, not just
  // chains. Rescued's NEW partner's face moves when the rescue card couples.
  if (verdict === 'held') {
    setCharMood(state, 'partner', 'buzzing');
    setCharMood(state, 'rival', 'fuming');
  } else if (verdict === 'rescued') {
    setCharMood(state, 'rival', 'scheming');
  } else {
    setCharMood(state, 'rival', 'smug');
  }
  state.pendingChainId = `li_recoup_${verdict}`;
}
