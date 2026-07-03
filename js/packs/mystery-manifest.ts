// The MYSTERY pack's manifest (pack #2): "paradise hotel × murder mystery" —
// reality-show survival with an amateur-detective streak. Same engine as the
// music game; entirely different taxonomy. Proof the Phase 2–3 genericization
// holds: no engine edits, just a different manifest + content + plugins.
//
// The engine's "burnout" slot is reused as SUSPICION — draw too much of it and
// the house turns on you (burnoutFail). The generic resources map to
// reality-show currencies: fame→Notoriety, money→Cash, pathProgress→Leads,
// rivalry→the Feud with the Nemesis guest. "clues" is a pack-specific counter
// the clues plugin maintains and the sleuth summit gates on (read generically
// via engine.gateValue).

import type { PackManifest, PathDef, StatMeta } from '../types.js';

export const STATS: string[] = ['nerve', 'charm', 'insight', 'alliance'];
export const RESOURCES: string[] = ['fame', 'money', 'pathProgress', 'rivalry'];

// #region paths
export const PATHS: Record<string, PathDef> = {
  sleuth: {
    id: 'sleuth',
    name: 'The Sleuth',
    blurb: 'You did not come here to win a game show. You came to name a killer, and you will.',
    gateLabel: 'Insight 72 · Nerve 55 · 4 Clues',
    icon: '🔍',
  },
  darling: {
    id: 'darling',
    name: 'The Darling',
    blurb: 'America votes, and America adores you. Outlast them all on charm alone.',
    gateLabel: 'Charm 74 · Notoriety 100 · Alliance 55',
    icon: '💅',
  },
  fixer: {
    id: 'fixer',
    name: 'The Fixer',
    blurb: 'You do not play the house. You run it — with nerve, favors, and a little cash.',
    gateLabel: 'Nerve 70 · Charm 60 · Cash 320',
    icon: '🎩',
  },
};
// #endregion paths

// #region win-gates
// Tuned via tools/mystery-sim.mjs so Success stays losable AND no single
// summit dominates. Insight is over-produced by the deck (lots of investigate/
// observe beats), so the sleuth gate sits high; charm/nerve/fame lag, so those
// summits gate lower.
export const WIN_GATES: Record<string, Record<string, number>> = {
  sleuth:  { insight: 92, nerve: 58, clues: 7 },
  darling: { charm: 56, fame: 72, alliance: 46 },
  fixer:   { nerve: 56, charm: 48, money: 230 },
};
// #endregion win-gates

export const STAT_META: Record<string, StatMeta> = {
  nerve:    { name: 'Nerve',    icon: '🧊' },
  charm:    { name: 'Charm',    icon: '💫' },
  insight:  { name: 'Insight',  icon: '🔎' },
  alliance: { name: 'Alliance', icon: '🤝' },
  burnout:  { name: 'Suspicion', icon: '🕵️' }, // engine burnout slot, reskinned
};

// Resource display metadata (Phase G.4): the reality-show currencies the
// generic resource slots are reskinned into.
export const RESOURCE_META: Record<string, StatMeta> = {
  fame:        { name: 'Notoriety', icon: '📸' },
  money:       { name: 'Cash',      icon: '💵' },
  pathProgress:{ name: 'Leads',     icon: '🧩' },
  rivalry:     { name: 'Feud',      icon: '🔥' },
  clues:       { name: 'Clues',     icon: '🔎' },
};

export const mysteryManifest: PackManifest = {
  stats: STATS,
  resources: RESOURCES,
  paths: PATHS,
  winGates: WIN_GATES,
  statMeta: STAT_META,
  resourceMeta: RESOURCE_META,
};
