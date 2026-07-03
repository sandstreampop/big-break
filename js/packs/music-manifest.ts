// The music pack's MANIFEST: the genre taxonomy, split out of config's
// balance knobs (Phase 2.2). This is what makes the music game "the music
// game" — its stats, resources, summits, finale gates, and HUD metadata.
// A second genre ships its own manifest; the engine reads whichever is
// injected. (Numbers stay balance-tuned; the SHAPE is the genre.)

import type { PackManifest, PathDef, StatMeta, FailStateRule } from '../types.js';

// The four core stats the engine iterates (burnout is tracked alongside but
// handled by its own block). Phase 3.1 rewires the engine to read this list.
export const STATS: string[] = ['skill', 'cred', 'creativity', 'network'];

// Resources with bespoke handlers in the engine (Phase 3.2 genericizes them).
export const RESOURCES: string[] = ['fame', 'money', 'hits', 'pathProgress', 'rivalry'];

export const PATHS: Record<string, PathDef> = {
  megastar: {
    id: 'megastar',
    name: 'Megastar',
    blurb: 'Worldwide famous frontperson. Stadiums chant a name your mother didn’t give you.',
    gateLabel: 'Fame 105 · Network 78 · Cred 38',
    icon: '★',
  },
  studio: {
    id: 'studio',
    name: 'Studio Legend',
    blurb: 'The most-called session musician alive. Nobody knows your face. Everybody knows your take.',
    gateLabel: 'Skill 74 · Cred 65 · Network 50',
    icon: '♫',
  },
  hitfactory: {
    id: 'hitfactory',
    name: 'Hit Factory',
    blurb: 'The producer-songwriter behind everyone’s hits. Your name is in small print on big money.',
    gateLabel: 'Creativity 92 · Cred 64 · 4 Hits',
    icon: '✎',
  },
};

// R4 (can-lose pass) + wave-3 re-tune: gates sit above the comfortable ceiling
// so a cruisy run books a Partial, not an automatic Success — re-centered to
// keep Success in the 25–40% band with the doubled deck in play.
export const WIN_GATES: Record<string, Record<string, number>> = {
  megastar:   { fame: 112, network: 83, cred: 46 },
  studio:     { skill: 76, cred: 68, network: 55 },
  hitfactory: { creativity: 95, cred: 70, hits: 4 },
};

export const STAT_META: Record<string, StatMeta> = {
  skill:      { name: 'Skill',      icon: '🎸' },
  cred:       { name: 'Cred',       icon: '🤟' },
  creativity: { name: 'Creativity', icon: '💡' },
  network:    { name: 'Network',    icon: '📱' },
  burnout:    { name: 'Burnout',    icon: '🔥' },
};

// Resource display metadata (Phase G.4): matches the labels/icons the UI used
// to hardcode (fame ★, hits ♪, pathProgress ▲ "Momentum"), now data.
export const RESOURCE_META: Record<string, StatMeta> = {
  fame:        { name: 'Fame',     icon: '★' },
  money:       { name: 'Money',    icon: '$' },
  hits:        { name: 'Hits',     icon: '♪' },
  pathProgress:{ name: 'Momentum', icon: '▲' },
  rivalry:     { name: 'Rivalry',  icon: '⚔️' },
};

// Fail states beyond the engine's universal burnout fail (WP3). Order matters:
// evaluated after burnout, so the old burnout → cancelled → debt precedence
// holds. The cancelled rule carries the act-2 gate that was CONFIG.credFailFromAct;
// the debt rule carries CONFIG.debtFailMoney — same numbers, now the pack's.
export const FAIL_STATES: FailStateRule[] = [
  { key: 'cred', cmp: '<=', value: 0, fromAct: 2, ending: 'cancelled' },
  { key: 'money', cmp: '<=', value: -300, flag: 'debt', ending: 'debt' },
];

export const musicManifest: PackManifest = {
  stats: STATS,
  resources: RESOURCES,
  paths: PATHS,
  winGates: WIN_GATES,
  statMeta: STAT_META,
  resourceMeta: RESOURCE_META,
  // Non-zero resource starts: walk in broke ($25), rivalry idles at 3.
  resourceStart: { money: 25, rivalry: 3 },
  lpResources: ['fame'], // fame counts toward Legacy Points alongside the stats

  failStates: FAIL_STATES,
  declinePenalty: { cred: -2 }, // the walk-of-shame when your card declines
};
