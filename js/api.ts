// BIG BREAK — the public authoring surface. One import for everything an
// author (human or LLM) needs to define, validate, and run a game pack:
//
//   import { definePack, validatePack, createGame } from './js/api.js';
//
//   const pack = definePack({ … });          // typed authoring (compile time)
//   const report = validatePack(pack);       // contract check (run/tool time)
//   if (report.ok) await createGame({ pack }).start();   // playable, in a browser
//
// Headless (sims, tests, workers): createEngine(pack) gives an isolated
// engine instance with no UI and no global state.
//
// This file is a FRONT DOOR, not a module: it adds definePack and re-exports
// the small surface the docs teach — so an outside author never needs to know
// which internal file a concept lives in. Everything here is genre-neutral
// and DOM-free. The browser shell composes packs in main*.ts + the registry;
// simulation lives in the tooling ring (tools/pack-core.mjs simulatePackRun,
// tools/pack-report.mjs) because it needs a deterministic driver, not just
// the engine.

import type { Pack, PackValidation } from './types.js';
import { validatePack, formatValidation } from './validate.js';

// Typed authoring helper: an identity function whose whole job is to hand the
// compiler the Pack contract at the authoring site — hover types, property
// autocomplete, and unknown-key errors, without an explicit annotation. The
// runtime half of the contract is validatePack: definePack proves the SHAPE a
// developer writes; validatePack proves the REFERENCES of whatever actually
// shows up, generated packs included.
export function definePack(pack: Pack): Pack {
  return pack;
}

// ---------- createGame: a playable game from a pack, on a bare page ----------

export interface GameHandle {
  pack: Pack;
  // The contract check createGame ran (or a trivially-ok one when skipped).
  validation: PackValidation;
  // Boot the UI shell around the pack. Browser-only (it renders); the DOM
  // scaffold is created if the page doesn't carry one. Rejects if validation
  // failed — an invalid pack never reaches the runtime.
  start(): Promise<void>;
}

// Turn a pack into a startable game. This is the whole embedding story:
//
//   const game = createGame({ pack });
//   if (game.validation.ok) await game.start();   // or just await start()
//
// Validation runs HERE (synchronously, Node-safe) so a generated pack is
// rejected before any UI exists; start() lazily imports the browser shell, so
// this module stays importable in Node for the validate/report tooling.
// The page needs the game stylesheet (css/style.css) linked; everything else
// — screens, overlays, mobile guards — is handled.
export function createGame(opts: { pack: Pack; validate?: boolean; mobileGuards?: boolean }): GameHandle {
  const { pack } = opts;
  const validation: PackValidation = opts.validate === false
    ? { ok: true, errors: [], warnings: [] }
    : validatePack(pack);
  return {
    pack,
    validation,
    async start(): Promise<void> {
      if (!validation.ok) {
        throw new Error(`createGame: pack "${(pack as any)?.id ?? '?'}" violates the contract — fix these before booting:\n\n${formatValidation((pack as any)?.id ?? 'pack', validation)}`);
      }
      // Late-bound specifiers (a `let`, so tsc can't statically resolve them):
      // the UI shell is NOT part of the strict-typecheck program this file
      // belongs to — a static import edge here would drag the whole shell
      // graph under `strict` and break the frontier. The runtime resolves the
      // same files either way; the local annotations keep the call shapes
      // typed at this seam.
      // eslint-disable-next-line prefer-const -- `let` IS the mechanism (see comment above): const would let tsc resolve the import statically
      let uiPath = './ui.js';
      // eslint-disable-next-line prefer-const -- same late-binding trick
      let platformPath = './platform.js';
      const [ui, platform] = await Promise.all([import(uiPath), import(platformPath)]) as [
        { boot(p: Pack): void; ensureScaffold(): void },
        { installMobileGuards(): void },
      ];
      ui.ensureScaffold();
      if (opts.mobileGuards !== false) platform.installMobileGuards();
      ui.boot(pack);
    },
  };
}

// The pack contract's runtime half: schema + semantic validation with
// author-facing, LLM-repairable errors. See js/validate.ts.
export { validatePack, formatIssue, formatValidation, closestKey, PACK_CONTRACT_VERSION } from './validate.js';
export type { PackIssue, PackValidation } from './validate.js';

// The engine. `createEngine(pack)` — an isolated instance — is THE story for
// external code: no global state, safe side-by-side. `useContentPack`/
// `activePack` are the COMPAT surface (the module-level single-active-pack
// session the repo's own one-pack-per-page shell uses); they stay exported
// for that shell and old callers, but new integrations shouldn't reach for
// them first. Also here: the seeded RNG and the neutral vocabularies the
// validator checks against. See js/engine.ts.
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
