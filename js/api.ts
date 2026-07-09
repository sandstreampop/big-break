// BIG BREAK — the public authoring surface. One import for everything an
// author (human or LLM) needs to define, validate, and run a game pack:
//
//   import { definePack, validatePack, createEngine } from './js/api.js';
//
//   const pack = definePack({ … });          // typed authoring (compile time)
//   const report = validatePack(pack);       // contract check (run/tool time)
//   if (report.ok) {
//     const engine = createEngine(pack);     // isolated engine instance
//     const run = engine.newRun('runner', [], mulberry32(seed));
//   }
//
// This file is a FRONT DOOR, not a module: it adds definePack and re-exports
// the small surface the docs teach — so an outside author never needs to know
// which internal file a concept lives in. Everything here is genre-neutral
// and DOM-free. The browser shell composes packs in main*.ts + the registry;
// simulation lives in the tooling ring (tools/pack-core.mjs simulatePackRun,
// tools/pack-report.mjs) because it needs a deterministic driver, not just
// the engine.

import type { Pack } from './types.js';

// Typed authoring helper: an identity function whose whole job is to hand the
// compiler the Pack contract at the authoring site — hover types, property
// autocomplete, and unknown-key errors, without an explicit annotation. The
// runtime half of the contract is validatePack: definePack proves the SHAPE a
// developer writes; validatePack proves the REFERENCES of whatever actually
// shows up, generated packs included.
export function definePack(pack: Pack): Pack {
  return pack;
}

// The pack contract's runtime half: schema + semantic validation with
// author-facing, LLM-repairable errors. See js/validate.ts.
export { validatePack, formatIssue, formatValidation, closestKey } from './validate.js';
export type { PackIssue, PackValidation } from './validate.js';

// The engine: isolated instances (createEngine) and the classic module-level
// single-active-pack surface, plus the seeded RNG and the neutral
// vocabularies the validator checks against. See js/engine.ts.
export {
  createEngine, useContentPack, activePack,
  mulberry32, stateRng, gateValue,
  CORE_EFFECT_VERBS, REQUIRES_NEUTRAL_KEYS,
} from './engine.js';
export type { Engine } from './engine.js';

// The boundary types a pack is written against.
export type {
  Pack, PackManifest, GameEvent, Choice, Outcome, Effect, Requires,
  Plugin, Presenter, RunState, PathDef, SegmentDef, FailStateRule,
  PerkDef, TutorialStart, InterstitialRule, AdvanceStep, Tier, Side,
} from './types.js';
