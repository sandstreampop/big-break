// The MYSTERY pack (pack #2), assembled against the same Pack interface as the
// music game. It ships DARK — nothing in the UI registers it yet (see the
// note in ui). It exists to prove the engine is genre-agnostic: a different
// manifest, a different deck, one domain plugin (clues), and stubs for the
// music-shaped subsystems this genre doesn't use. No engine edits required.

import { mysteryManifest } from './mystery-manifest.js';
import { MYSTERY_EVENTS } from '../data/mystery-events.js';
import { cluesPlugin } from './plugins/clues.js';
import type { Pack } from '../types.js';

// "Instruments" here are the reality-show personas you walk in as. The engine
// only needs id + unlockedByDefault (+ optional stat modifiers/quirk).
const PERSONAS = [
  { id: 'detective', name: 'The Off-Duty Detective', family: 'sleuth', unlockedByDefault: true, modifiers: { insight: 6, nerve: 2 } },
  { id: 'influencer', name: 'The Influencer', family: 'darling', unlockedByDefault: true, modifiers: { charm: 6, alliance: 2 } },
  { id: 'operator', name: 'The Operator', family: 'fixer', unlockedByDefault: true, modifiers: { nerve: 4, charm: 2 } },
];

const byId = (list: any[]) => (id: string) => list.find((x) => x.id === id) || null;

export const mysteryPack: Pack = {
  id: 'mystery',
  manifest: mysteryManifest,
  plugins: [cluesPlugin],
  events: MYSTERY_EVENTS,
  tutorialEvents: [],
  instruments: PERSONAS,
  instrumentById: byId(PERSONAS),
  // Music-shaped subsystems this genre doesn't use — stubbed so the shared
  // engine (and the Pack type) are satisfied without any music content.
  accessories: [],
  accessoryById: () => null,
  arcs: [],
  arcById: () => null,
  VENUE_TIERS: [],
  venueById: () => null,
  bandmateById: () => null,
  recruitCandidate: () => null,
  randomRival: () => ({ id: 'the_host' }),
  contractById: () => null,
  hustleById: () => null,
  genreById: () => null,
  rollSeeds: () => [],
  weatherHooks: () => ({}),
  rollWeather: () => 'none',
};
