// The Love Island pack's MANIFEST — the genre taxonomy. This is what makes the
// villa game the villa game: its stats, resources, Summits, Final gates, and
// HUD metadata. The engine reads whichever manifest is injected; numbers are
// balance-tuned at Phase D, the SHAPE is the genre.
// Vocabulary: docs/games/love-island/CONTEXT.md. Decisions: the adr/ folder.

import type { PackManifest, PathDef, StatMeta, FailStateRule } from '../../types.js';

// The four core stats, split on the two tension-axes: romance (Rizz vs.
// Loyalty) and profile (Savvy vs. Charisma). Order is load-bearing — it fixes
// the seeded stat-roll order the goldens pin.
export const STATS: string[] = ['rizz', 'loyalty', 'savvy', 'charisma'];

// Public anchors Win the Villa and doubles as the finale momentum clutch (the
// late-season vote surge). Followers anchors The Brand. Bond anchors The Real
// Thing and is owned by the Coupling plugin (its clamps, its resets). Graft is
// the cost resource — social capital banked from good villa moments, spent on
// the daybed for Angles.
export const RESOURCES: string[] = ['public', 'followers', 'bond', 'graft'];

// #region paths
export const PATHS: Record<string, PathDef> = {
  winvilla: {
    id: 'winvilla',
    name: 'Win the Villa',
    blurb: 'The public crowns you and whoever you’re holding hands with by then. Fifty grand, split with feeling.',
    gateLabel: 'Public 76 · Bond 44',
    icon: '👑',
  },
  realthing: {
    id: 'realthing',
    name: 'The Real Thing',
    blurb: 'Leave with an actual person who actually knows your middle name. The prize is optional. Allegedly.',
    gateLabel: 'Bond 78 · Loyalty 72',
    icon: '💘',
  },
  brand: {
    id: 'brand',
    name: 'The Brand',
    blurb: 'Win or lose, hero or villain — walk out with a following and a discount code. The villa is a launchpad.',
    gateLabel: 'Followers 62 · Charisma 62',
    icon: '📱',
  },
};
// #endregion paths

// Gates sit above the comfortable ceiling so a cruisy Season books a Partial,
// not an automatic win; the Public clutch (momentumResource) can still carry a
// near-miss over the line — the late vote surge, on-format. Tuned for the v2
// Season length (the encounter arcs stretch the acts, so the ceilings rose).
export const WIN_GATES: Record<string, Record<string, number>> = {
  winvilla: { public: 76, bond: 44 },
  realthing: { bond: 78, loyalty: 72 },
  brand: { followers: 62, charisma: 62 },
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
  bond: { name: 'Bond', icon: '💘' },
  graft: { name: 'Graft', icon: '💪' },
};

// Fail states beyond the engine's universal In-Your-Head Walk:
//  · dumped-by-vote — the public craters (live from Act 2; Act 1 is grace)
//  · dumped-single — left standing at a Recoupling; the Coupling plugin sets
//    the flag, this rule (bond ≥ 0 is always true) turns it into the ending.
export const FAIL_STATES: FailStateRule[] = [
  { key: 'public', cmp: '<=', value: 0, fromAct: 2, ending: 'dumped' },
  { key: 'bond', cmp: '>=', value: 0, flag: 'li_dumped_single', ending: 'dumped' },
];

export const loveIslandManifest: PackManifest = {
  stats: STATS,
  resources: RESOURCES,
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
