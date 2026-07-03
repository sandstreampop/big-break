// The PROBE pack — the executable definition of genre-neutrality (§3.3).
//
// It is deliberately the smallest thing that is still a game: ONE stat, ONE
// resource, ONE summit, a ~12-card deck, and ZERO subsystems. It exists only
// to be run by the core. If the engine can boot it, play it to a finale, and
// judge its gate WITHOUT a single music-shaped stub or a throw, the core is
// genre-neutral. If it can't, the failure list is precisely the coupling still
// to cut.
//
// Phase A lands it with the stubs the *current* fat Pack type still demands
// (marked below); the invariants/golden for it stay `todo` until Phase E makes
// those capabilities optional and the stubs delete. Flipping the probe green
// with zero stubs is Phase E's definition of done.

import type { Pack, PackManifest, GameEvent } from '../types.js';

// The probe's effect vocabulary, declared by the pack rather than bolted onto
// the shared Effect union in types.ts. This is a preview of the Phase C
// pattern: a genre adds its verbs via module augmentation, editing no shared
// code. `focus` is the probe's one stat, `points` its one resource; the engine
// reads both generically off the manifest.
declare module '../types.js' {
  interface Effect {
    focus?: number;
    points?: number;
  }
}

const manifest: PackManifest = {
  stats: ['focus'],
  resources: ['points'],
  paths: {
    finish: {
      id: 'finish',
      name: 'The Finish',
      blurb: 'Cross the line. That is the whole genre.',
      gateLabel: 'Focus 60 · 40 Points',
      icon: '▣',
    },
  },
  winGates: {
    finish: { focus: 60, points: 40 },
  },
  statMeta: {
    focus: { name: 'Focus', icon: '◎' },
    burnout: { name: 'Strain', icon: '△' }, // the engine's burnout slot, reskinned
  },
};

// A generic card: two sides, each a stat/resource swing across the three tiers.
// No pathAffinity (so every card is always eligible), no requires, no chains —
// the deck is pure, undecorated core exercise.
function card(id: string, act: number | number[], focusW: number): GameEvent {
  return {
    id,
    act,
    choices: {
      left: {
        label: 'Push',
        tags: ['effort'],
        governingStats: { focus: focusW },
        outcomes: {
          bad: { text: 'It slips.', effects: { focus: -2, burnout: 4 } },
          good: { text: 'It holds.', effects: { focus: 5, points: 6, burnout: 2 } },
          incredible: { text: 'It soars.', effects: { focus: 9, points: 12 } },
        },
      },
      right: {
        label: 'Coast',
        tags: ['rest'],
        governingStats: { focus: focusW },
        outcomes: {
          bad: { text: 'You drift.', effects: { points: -2, burnout: 2 } },
          good: { text: 'You recover.', effects: { focus: 2, burnout: -4 } },
          incredible: { text: 'You reset, sharp.', effects: { focus: 6, burnout: -8, points: 4 } },
        },
      },
    },
  };
}

const EVENTS: GameEvent[] = [
  card('p_a1_1', 1, 1), card('p_a1_2', 1, 1), card('p_a1_3', 1, 1),
  card('p_a1_4', 1, 1), card('p_a1_5', 1, 1),
  card('p_a2_1', 2, 1), card('p_a2_2', 2, 1), card('p_a2_3', 2, 1),
  card('p_a2_4', 2, 1), card('p_a2_5', 2, 1),
  card('p_a3_1', 3, 1), card('p_a3_2', 3, 1), card('p_a3_3', 3, 1),
  card('p_a3_4', 3, 1), card('p_a3_5', 3, 1),
];

export const probePack: Pack = {
  id: 'probe',
  manifest,
  plugins: [],
  events: EVENTS,
  tutorialEvents: [],
  // Personas: the engine only needs id + unlockedByDefault to offer a loadout.
  instruments: [{ id: 'runner', name: 'The Runner', family: 'plain', unlockedByDefault: true }],
  instrumentById: (id) => (id === 'runner' ? { id: 'runner', name: 'The Runner', family: 'plain', unlockedByDefault: true } : null),
  // ── Capability stubs the CURRENT fat Pack type demands. Phase E makes these
  // optional providers the engine feature-detects, and every line below
  // deletes — that deletion is the probe's definition of done. ──
  accessories: [],
  accessoryById: () => null,
  arcs: [],
  arcById: () => null,
  VENUE_TIERS: [],
  venueById: () => null,
  bandmateById: () => null,
  recruitCandidate: () => null,
  randomRival: () => null,
  contractById: () => null,
  hustleById: () => null,
  genreById: () => null,
  rollSeeds: () => [],
  weatherHooks: () => ({}),
  rollWeather: () => 'none',
};
