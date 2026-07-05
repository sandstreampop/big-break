// The Love Island pack's MANIFEST — the genre taxonomy. This is what makes the
// villa game the villa game: its stats, resources, Summits, Final gates, and
// HUD metadata. The engine reads whichever manifest is injected; numbers are
// balance-tuned at Phase D, the SHAPE is the genre.
// Vocabulary: docs/games/love-island/CONTEXT.md. Decisions: the adr/ folder.

import type { PackManifest, PathDef, StatMeta, FailStateRule, SegmentDef } from '../../types.js';

// The season's structure (v4 S2, ADR-0011 on ADR-0010's machinery): SIX WEEKS.
// A week is a run of quiet daily beats that ENDS on a tentpole (peak-end rule
// — length is a peak budget, not a minute budget), scheduled by the producers
// plugin's beat windows. The three show-phases are still the macro shape;
// they live ACROSS the weeks (PHASE_WEEKS below), and events keep authoring
// in phases. Week 2 carries the crossroads (the Crossroads closes Arrival);
// week 6 is the Final and is protected — it ends on the climax card the
// engine queues, and nothing may displace it.
//
//   W1 Arrival        (8) → ends on the first Bombshell
//   W2 The Graft      (7) → ends on the first Challenge, then the Crossroads
//   W3 Casa Amor      (5) → ends INSIDE the Casa arc (the 5-card chain
//                            overruns the nominal length by design — the week
//                            closes on the return verdict)
//   W4 Movie Night    (7) → ends on the footage
//   W5 The Recoupling (7) → ends on the girls' ceremony + its verdict
//   W6 Final Week     (9) → opens on the boys' ceremony, ends on the Final
export const SEGMENTS: SegmentDef[] = [
  { length: 8 },
  { length: 7, crossroads: true },
  { length: 5 },
  { length: 7 },
  { length: 7 },
  { length: 9 },
];

// The show-phase ↔ week mapping. Events are authored against the PHASE
// (1 Arrival · 2 The Turn · 3 Final Week — the vocabulary every card file
// already speaks); events.ts remaps a card's authored phase to its weeks at
// pack assembly, so `GameEvent.act` is in WEEK space by the time the engine
// (and the linter) reads it.
export const PHASE_WEEKS: Record<number, number[]> = { 1: [1, 2], 2: [3, 4, 5], 3: [6] };
export const PHASE_OF_WEEK: Record<number, number> = { 1: 1, 2: 1, 3: 2, 4: 2, 5: 2, 6: 3 };

// The four core stats, split on the two tension-axes: romance (Rizz vs.
// Loyalty) and profile (Savvy vs. Charisma). Order is load-bearing — it fixes
// the seeded stat-roll order the goldens pin.
export const STATS: string[] = ['rizz', 'loyalty', 'savvy', 'charisma'];

// Public anchors Win the Villa and doubles as the finale momentum clutch (the
// late-season vote surge). Followers anchors The Brand. The `bond` resource
// (displayed as "Connection" — the id never changes) anchors The Real Thing
// and is owned by the Coupling plugin (its clamps, its resets). Graft is
// the cost resource — social capital banked from good villa moments, spent on
// the daybed for Angles.
export const RESOURCES: string[] = ['public', 'followers', 'bond', 'graft'];

// #region paths
export const PATHS: Record<string, PathDef> = {
  winvilla: {
    id: 'winvilla',
    name: 'Win the Villa',
    blurb: 'The public crowns you and whoever you’re holding hands with by then. Fifty grand, split with feeling.',
    gateLabel: 'Public 106 · Connection 54',
    icon: '👑',
  },
  realthing: {
    id: 'realthing',
    name: 'The Real Thing',
    blurb: 'Leave with an actual person who actually knows your middle name. The prize is optional. Allegedly.',
    gateLabel: 'Connection 90 · Loyalty 93',
    icon: '💘',
  },
  brand: {
    id: 'brand',
    name: 'The Brand',
    blurb: 'Win or lose, hero or villain — walk out with a following and a discount code. The villa is a launchpad.',
    gateLabel: 'Followers 96 · Charisma 76',
    icon: '📱',
  },
};
// #endregion paths

// Gates sit above the comfortable ceiling so a cruisy Season books a Partial,
// not an automatic win; the Public clutch (momentumResource) can still carry a
// near-miss over the line — the late vote surge, on-format. Tuned for the v4
// six-week season (~47 cards/run vs the v2 ~33 — resources and stats
// accumulate ~40% higher, so the ceilings rose with them; ADR-0011).
export const WIN_GATES: Record<string, Record<string, number>> = {
  winvilla: { public: 106, bond: 54 },
  realthing: { bond: 90, loyalty: 93 },
  brand: { followers: 96, charisma: 76 },
};

export const STAT_META: Record<string, StatMeta> = {
  rizz: { name: 'Rizz', icon: '😏' },
  loyalty: { name: 'Loyalty', icon: '💗' },
  savvy: { name: 'Savvy', icon: '🧠' },
  charisma: { name: 'Charisma', icon: '✨' },
  burnout: { name: 'In Your Head', icon: '🌀' }, // the engine's burnout slot, reskinned
};

export const RESOURCE_META: Record<string, StatMeta> = {
  public: { name: 'Public', icon: '🗳️' },
  followers: { name: 'Followers', icon: '📱' },
  // "Connection", the villa's own word (v4 charter: the Connection rename is
  // display/copy only — the internal resource id stays `bond`, everywhere).
  bond: { name: 'Connection', icon: '💘' },
  graft: { name: 'Graft', icon: '💪' },
};

// Fail states beyond the engine's universal In-Your-Head Walk (fromAct is in
// WEEK space — the first week of the phase the rule used to name):
//  · dumped-by-vote — the public craters (live once The Turn starts, week 3;
//    Arrival is grace)
//  · dumped-single — left standing at a Recoupling; the Coupling plugin sets
//    the flag, this rule (bond ≥ 0 is always true) turns it into the ending.
//  · the Final Week wall — In Your Head at 79+ once Final Week (week 6)
//    starts and you walk (R1/A2: the pack's second real mortality).
//    Telegraphed three ways before it can fire: the wobble ladder
//    (50 → 75 → the break), the Final Week recap's warning, and Stirling.
//    Weeks 1–5 keep the engine's 100 line.
export const FAIL_STATES: FailStateRule[] = [
  { key: 'public', cmp: '<=', value: 0, fromAct: 3, ending: 'dumped' },
  { key: 'bond', cmp: '>=', value: 0, flag: 'li_dumped_single', ending: 'dumped' },
  { key: 'burnout', cmp: '>=', value: 79, fromAct: 6, ending: 'burnout' },
];

export const loveIslandManifest: PackManifest = {
  stats: STATS,
  resources: RESOURCES,
  segments: SEGMENTS,
  paths: PATHS,
  winGates: WIN_GATES,
  statMeta: STAT_META,
  resourceMeta: RESOURCE_META,
  // Walk in with a flicker of public goodwill and enough Graft for nothing.
  resourceStart: { public: 8, graft: 3 },
  lpResources: ['public', 'followers'],
  // Resource roles: Graft is the daybed currency; Public & Followers are the
  // magnitude meters an INCREDIBLE scales; Public is the finale clutch (the
  // public-vote surge that carries a near-miss).
  costResource: 'graft',
  incredibleResources: ['public', 'followers'],
  momentumResource: 'public',
  failStates: FAIL_STATES,
  declinePenalty: { public: -1 },
  declineText: 'You haven’t got the Graft for it. You announce you’re “keeping your options open.” The options heard you.',
};
