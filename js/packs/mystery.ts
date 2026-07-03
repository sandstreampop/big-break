// The MYSTERY pack (pack #2), assembled against the same Pack interface as the
// music game. It ships DARK — nothing in the UI registers it yet (see the
// note in ui). It exists to prove the engine is genre-agnostic: a different
// manifest, a different deck, one domain plugin (clues), and stubs for the
// music-shaped subsystems this genre doesn't use. No engine edits required.

import { mysteryManifest } from './mystery-manifest.js';
import { MYSTERY_EVENTS } from '../data/mystery-events.js';
import { cluesPlugin } from './plugins/clues.js';
import { mysteryPresenter } from './mystery-presenter.js';
import type { Pack } from '../types.js';

// The mystery genre's effect vocabulary (Phase C): its four core stats and the
// clues counter the clues plugin maintains — declared here, editing no shared
// type. (fame/money/pathProgress/rivalry are engine-known resources on the
// core Effect already.)
// #region effect-augmentation
declare module '../types.js' {
  interface Effect {
    nerve?: number; charm?: number; insight?: number; alliance?: number;
    clues?: number;
  }
}
// #endregion effect-augmentation

// "Instruments" here are the reality-show personas you walk in as. The engine
// only needs id + unlockedByDefault (+ optional stat modifiers/quirk).
const PERSONAS = [
  { id: 'detective', name: 'The Off-Duty Detective', family: 'sleuth', unlockedByDefault: true,
    flavor: 'You notice things. It has never once made you popular.', modifiers: { insight: 6, nerve: 2 } },
  { id: 'influencer', name: 'The Influencer', family: 'darling', unlockedByDefault: true,
    flavor: 'The camera loves you. You have made sure of it.', modifiers: { charm: 6, alliance: 2 } },
  { id: 'operator', name: 'The Operator', family: 'fixer', unlockedByDefault: true,
    flavor: 'You do not raise your voice. You do not need to.', modifiers: { nerve: 4, charm: 2 } },
];

const byId = (list: any[]) => (id: string) => list.find((x) => x.id === id) || null;

// #region pack
export const mysteryPack: Pack = {
  id: 'mystery',
  manifest: mysteryManifest,
  plugins: [cluesPlugin],
  events: MYSTERY_EVENTS,
  tutorialEvents: [],
  presenter: mysteryPresenter,
  instruments: PERSONAS,
  instrumentById: byId(PERSONAS),
  // No accessories, arcs, venues, band, rivals, contracts, hustles, genres,
  // seeds, or weather. Those aren't Pack fields at all any more — every genre's
  // subsystems live in its own plugins — so there's nothing to omit or stub:
  // mystery ships the required core plus one clues plugin and a presenter.
};
// #endregion pack
