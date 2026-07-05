// The Love Island pack (pack #2) — the proof the core carries no music shape.
// Assembles the villa game into one injectable Pack: manifest, deck, plugins,
// presenter, playable Types. The engine imports none of this; registering the
// pack (packs/registry.ts) plus a love-island.html entry is the whole install.
// Design record: docs/games/love-island/ (grill.md, CONTEXT.md, adr/).

import { loveIslandManifest } from './manifest.js';
import { LOVE_ISLAND_EVENTS } from './events.js';
import { ISLANDER_TYPES, islanderTypeById } from './cast.js';
import { couplingPlugin } from './plugins/coupling.js';
import { profilePlugin } from './plugins/profile.js';
import { producersPlugin } from './plugins/producers.js';
import { charactersPlugin } from './plugins/characters.js';
import { gossipPlugin } from './plugins/gossip.js';
import { stirlingPlugin } from './plugins/stirling.js';
import type { Pack, RunState } from '../../types.js';
import { loveIslandPresenter } from './presenter.js';

// The pack's effect/eligibility vocabulary, added by declaration merging in
// this file only — the shared types name no villa concept (the probe/music
// pattern). Stats and resources ride the manifest; the verbs belong to the
// coupling and profile plugins that declare them in effectVerbs/requires.
// #region effect-augmentation
declare module '../../types.js' {
  interface Effect {
    // core stats
    rizz?: number; loyalty?: number; savvy?: number; charisma?: number;
    // resources
    public?: number; followers?: number; bond?: number; graft?: number;
    // coupling subsystem verbs (ADR-0001/0002/0003)
    couple?: boolean; switchPartner?: boolean; bondReset?: boolean;
    exclusive?: number; stealRoll?: boolean;
    casaLoyaltyDraw?: boolean; casaReturn?: boolean; chosenCeremony?: boolean;
    reveal?: string; comeClean?: boolean; playSecret?: string;
    // profile subsystem verbs (the Edit)
    grantAngle?: string; removeAngle?: string;
    // character-state verbs (ADR-0006): opinion deltas, transient moods, the
    // secret machinery, and the bombshell seat
    rivalOpinion?: number; bombshellOpinion?: number;
    partnerMood?: string; rivalMood?: string; bombshellMood?: string;
    surfaceSecret?: string; bombshellEnters?: boolean | string; rivalFromBombshell?: boolean;
    // gossip currency verbs (ADR-0007): gather a feeling, spend what you hold
    gainIntel?: { about: string; label: string }; deployIntel?: string;
  }
  interface Requires {
    singleIs?: boolean; exclusiveIs?: boolean; genderIs?: string;
    partnerKissedIs?: boolean; angleHas?: string;
    // character-state gates (ADR-0006): opinion tiers gate encounter branches
    opinionAtLeast?: string; opinionBelow?: string;
    secretHeldIs?: string; bombshellActiveIs?: boolean;
    // gossip gates (ADR-0007)
    intelMin?: number; intelAboutIs?: string;
  }
}
// #endregion effect-augmentation

// The villa's run-summary contribution: the coupling and profile subsystems'
// scrapbook data, merged over the engine's neutral core summary.
const summarize = (state: RunState) => ({
  partner: state.partner || null,
  bond: state.bond ?? 0,
  exclusive: !!state.exclusive,
  exes: [...(state.exes || [])],
  gender: state.gender || null,
  rival: state.rival || null,
  angles: [...(state.accessories || [])],
  intelDeployed: state.intelDeployed || 0,
  secretsKnown: [...(state.secretKnown || [])],
});

// #region pack
export const loveIslandPack: Pack = {
  id: 'love-island',
  manifest: loveIslandManifest,
  // Order is load-bearing for the seeded stream: coupling's onConstruct (the
  // Rival draw) is the pack's first construction draw, characters' (the
  // Rival's secret) the second; producers owns the run-start chain queue.
  // The goldens pin this order.
  // Stirling registers LAST: his afterResolve reads what the other plugins
  // decided this card (verdict queues, secret surfacing) before he speaks.
  plugins: [couplingPlugin, profilePlugin, charactersPlugin, gossipPlugin, producersPlugin, stirlingPlugin],
  events: LOVE_ISLAND_EVENTS,
  tutorialEvents: [],
  // The In-Your-Head ladder (R1/A2): the soft wobble at 50, the real one at
  // 75, and — if the head climbs back after that relief — the break at 76,
  // where a botched "tough it out" IS the Walk. Order is load-bearing: rules
  // are checked top-down, so 75 takes the first crossing, the break the next.
  interstitials: [
    { id: 'li_wobble_75', burnoutMin: 75, belowFail: true },
    { id: 'li_wobble_break', burnoutMin: 76, belowFail: true },
    { id: 'li_wobble_50', burnoutMin: 50 },
  ],
  presenter: loveIslandPresenter,
  summarize,
  // The playable Types (× gender — the persona pick IS the gender pick,
  // ADR-0003). All eight offered at Season start.
  loadouts: ISLANDER_TYPES,
  loadoutById: islanderTypeById,
};
// #endregion pack
