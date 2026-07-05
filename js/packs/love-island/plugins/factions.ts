// Factions — the public as three audiences that want opposite things
// (ADR-0012). Replaces the single-public READ: the nation is the Romantics
// (stick together, forgive), the Self-Respect crowd (backbone, walk away with
// your head high), and the Drama-lovers (here for chaos, will adopt a
// villain). Each is a manifest resource the cards can move directly; the
// legacy `public` verb still works and is ROUTED here — tilted toward the
// faction the choice's tags serve, mean-preserving, so the S2 vote economy
// carries over intact while the wings diverge.
//
// Two derived reads keep the engine untouched:
//  · `public` stays the manifest's aggregate meter — recomputed as the mean
//    of the three factions after every faction move, so every existing read
//    (win gates, the dumped-by-vote fail state, the HUD chip) is now a
//    values read without naming a faction.
//  · `surge` is the finale clutch (manifest.momentumResource): factions
//    onside (≥ warmAt) minus factions lost (< coldAt), floored at 0. The
//    late vote surge only carries a near-miss when the WHOLE nation is
//    onside — a chaos-villain who thrilled Drama but repelled the Romantics
//    lands mid-pack, exactly as the charter demands.
//
// Pillar 5's rule — the same action pleases one faction and angers another —
// lives in two places: the tag tilt on routed public, and the structural
// reactions below (exclusivity, betrayal, the firepit detonation), which
// observe the coupling plugin's verbs after it has resolved them.

import type { Plugin, RunState } from '../../../types.js';

export type FactionKey = 'romantics' | 'selfrespect' | 'drama';
export const FACTION_KEYS: FactionKey[] = ['romantics', 'selfrespect', 'drama'];

// ---------- Balance knobs (the faction subsystem's own numbers) ----------
export const FACTIONS = {
  warmAt: 50,   // a faction at/above this is ONSIDE (feeds the surge)
  coldAt: 25,   // a faction below this is LOST (drains the surge)
  tiltStep: 2,  // the tag tilt on a routed positive public delta (±, mean-preserving)
  // Structural reactions: the loud faction moments, keyed to story beats the
  // pack already tracks. Values are spreads, applied on top of whatever the
  // card itself pays.
  react: {
    exclusiveOn: { romantics: 4, drama: -2 },
    exclusiveOff: { romantics: -3, drama: 1 },
    switchPartner: { romantics: -3, drama: 4 },
    comeClean: { selfrespect: 4, romantics: 2, drama: -1 },
    playSecret: { drama: 5, selfrespect: 2, romantics: -2 },
    betrayed: { romantics: 3, selfrespect: 2, drama: 2 }, // the nation adopts you
    stealSurvived: { romantics: 2 },
    revealMine: { drama: 4, romantics: -3, selfrespect: -2 },
    revealTheirs: { selfrespect: 3, romantics: 2 },
    codeBroke: { selfrespect: -2, drama: 2 },
    codeHonour: { selfrespect: 3 },
    villainContent: { drama: 1 }, // a botched drama/camera play is still content
  } as Record<string, Partial<Record<FactionKey, number>>>,
};

// Which faction a choice's tags serve (first match wins), and which one is
// bored/annoyed by it. The tilt is the LEGIBLE half of Pillar 5 on ordinary
// cards; authored faction payloads on the big cards are the loud half.
const TAG_FACTION: { tags: string[]; up: FactionKey; down: FactionKey }[] = [
  { tags: ['loyal', 'date'], up: 'romantics', down: 'drama' },
  { tags: ['drama', 'camera', 'temptation', 'banter'], up: 'drama', down: 'romantics' },
  { tags: ['strategy', 'code', 'rest'], up: 'selfrespect', down: 'drama' },
];

export function factionLean(tags: string[] | undefined): { up: FactionKey; down: FactionKey } | null {
  if (!tags?.length) return null;
  for (const m of TAG_FACTION) if (m.tags.some((t) => tags.includes(t))) return { up: m.up, down: m.down };
  return null;
}

// The qualitative read (ADR-0006 discipline: tiers on screen, floats backstage).
export type FactionTier = 'lost' | 'unconvinced' | 'onside' | 'devoted';
export function factionTier(v: number): FactionTier {
  return v < FACTIONS.coldAt ? 'lost' : v < FACTIONS.warmAt ? 'unconvinced' : v < 75 ? 'onside' : 'devoted';
}
export const FACTION_META: Record<FactionKey, { name: string; icon: string; wants: string }> = {
  romantics: { name: 'The Romantics', icon: '🌹', wants: 'stick together, forgive, love conquers all' },
  selfrespect: { name: 'The Self-Respect crowd', icon: '💅', wants: 'backbone — never accept mistreatment' },
  drama: { name: 'The Drama-lovers', icon: '🍿', wants: 'chaos, scenes, a villain to adopt' },
};

// ---------- The derived reads ----------

// public = the mean of the three factions; surge = onside − lost, floored.
// Every faction write funnels through here, so the aggregate can't drift.
export function recomputePublic(state: RunState): void {
  const vals = FACTION_KEYS.map((k) => state[k] ?? 0);
  state.public = Math.round(vals.reduce((s, v) => s + v, 0) / FACTION_KEYS.length);
  const warm = vals.filter((v) => v >= FACTIONS.warmAt).length;
  const cold = vals.filter((v) => v < FACTIONS.coldAt).length;
  state.surge = Math.max(0, warm - cold);
}

function moveFaction(state: RunState, key: FactionKey, v: number): number {
  if (!v) return 0;
  const before = state[key] ?? 0;
  state[key] = Math.max(0, before + v);
  return state[key] - before;
}

// Apply a spread across factions (a structural reaction), recompute, and
// record the faction chips so the movement is visible, not backstage.
export function moveFactionSpread(state: RunState, spread: Partial<Record<FactionKey, number>>, pctx?: any): void {
  for (const k of FACTION_KEYS) {
    const d = moveFaction(state, k, spread[k] || 0);
    if (d && pctx?.deltas) pctx.deltas.push({ key: k, amount: d });
  }
  recomputePublic(state);
}

// Route a legacy `public` delta through the factions: positive deltas tilt
// toward the faction the tags serve (+tilt / −tilt, mean-preserving);
// negative deltas land uniformly — embarrassment is nonpartisan. Returns the
// aggregate (public) delta, which is what the caller records.
export function movePublicFactional(state: RunState, v: number, tags?: string[]): number {
  if (!v) return 0;
  const before = state.public ?? 0;
  const lean = v > 0 ? factionLean(tags) : null;
  for (const k of FACTION_KEYS) {
    const tilt = lean ? (k === lean.up ? FACTIONS.tiltStep : k === lean.down ? -FACTIONS.tiltStep : 0) : 0;
    moveFaction(state, k, v + tilt);
  }
  recomputePublic(state);
  return (state.public ?? 0) - before;
}

// Set the nation to an absolute profile (run transforms — the redemption
// season's notorious arrival).
export function setFactions(state: RunState, values: Record<FactionKey, number>): void {
  for (const k of FACTION_KEYS) state[k] = Math.max(0, values[k] ?? 0);
  recomputePublic(state);
}

const note = (pctx: any, cls: string, html: string) => {
  const d = pctx?.deltas;
  if (d) (d.notices = d.notices || []).push({ cls, html });
};

export const factionsPlugin: Plugin = {
  id: 'factions',
  stateDefaults: { surge: 0 },

  // The factions start where the old public started (resourceStart), so the
  // derived reads need one recompute before the first card.
  onRunStart(state) {
    recomputePublic(state);
  },

  // Owns the three faction resources AND the legacy `public` verb (routed).
  // Registered after coupling/profile in pack order, but profile no longer
  // claims `public` — this is the aggregate's single writer.
  applyResource(res, effects, state, ctx) {
    const e = effects as any;
    if (res === 'public') {
      const v = e.public || 0;
      if (!v) return 0;
      return movePublicFactional(state, v, (ctx as any).choice?.tags);
    }
    if ((FACTION_KEYS as string[]).includes(res)) {
      const d = moveFaction(state, res as FactionKey, e[res] || 0);
      recomputePublic(state);
      return d;
    }
    return undefined;
  },

  // The structural reactions: observe the coupling/gossip verbs after their
  // owners resolved them (this plugin registers later, so the flags it reads
  // are already set for THIS card). Each is a loud, legible faction moment.
  onEffect(state, effects, pctx) {
    const e = effects as any;
    const R = FACTIONS.react;
    if (e.exclusive === 1) moveFactionSpread(state, R.exclusiveOn, pctx);
    else if (e.exclusive === -1) moveFactionSpread(state, R.exclusiveOff, pctx);
    if (e.switchPartner) moveFactionSpread(state, R.switchPartner, pctx);
    if (e.comeClean) moveFactionSpread(state, R.comeClean, pctx);
    if (e.playSecret === 'rival' && state.flags.includes('li_secret_detonated')) {
      moveFactionSpread(state, R.playSecret, pctx);
      note(pctx, 'notice-viral', '🍿 <b>The Drama-lovers are FED.</b> The Romantics have opinions about airing it at a firepit. You can’t please a nation.');
    }
    if (e.casaReturn && state.flags.includes('li_betrayed')) {
      moveFactionSpread(state, R.betrayed, pctx);
      note(pctx, 'notice-good', '🗳️ <b>The nation adopts you.</b> All three corners of it, for once. Sympathy polls beautifully.');
    }
    if (e.stealRoll && state.partner) moveFactionSpread(state, R.stealSurvived, pctx);
    if (e.reveal === 'movienight') {
      if (state.flags.includes('li_revealed')) moveFactionSpread(state, R.revealMine, pctx);
      if (state.flags.includes('li_partner_revealed')) moveFactionSpread(state, R.revealTheirs, pctx);
    }
    if (e.addFlag === 'li_code_broke') moveFactionSpread(state, R.codeBroke, pctx);
    if (e.addFlag === 'li_code_honour') moveFactionSpread(state, R.codeHonour, pctx);
  },

  // The Drama-lovers' one asymmetry: a botched showy play is still content.
  // Bad tier on a drama/camera choice feeds the chaos wing a point — the
  // villain-adoption mechanic, kept small enough to be a lean, not a build.
  afterResolve(state, _result, cardCtx) {
    if (state.tutorial) return;
    if (cardCtx.tier !== 'bad') return;
    const tags: string[] = cardCtx.choice?.tags || [];
    if (tags.includes('drama') || tags.includes('camera')) {
      moveFactionSpread(state, FACTIONS.react.villainContent);
    }
  },
};
