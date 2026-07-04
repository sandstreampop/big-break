// The pack registry: the single list of every game pack registered against
// the shared engine. This is the composition-root index the cross-pack
// property invariants (test/invariants.test.mjs), the tooling ring, and the
// build map all read, so "which genres exist" is declared in exactly one
// place instead of being implied by which HTML you loaded.
//
// A new genre is a new entry here plus its own files (manifest, deck, plugins,
// presenter) — and NO edit to the engine or a shared type. That is the OCP
// win the refactor is chasing, made literal: adding a line to this array is
// the whole registration.

import type { Pack } from '../types.js';
import { musicPack } from './music.js';
import { probePack } from './probe.js';

// The shipping genre plus the probe. The probe is a deliberately minimal pack
// (one stat, one resource, one path, a tiny deck, zero subsystems) whose only
// job is to be the executable definition of genre-neutrality: if the engine can
// run it, the core carries no music shape. It is registered here so the
// invariants sweep it alongside the real pack.
export const PACKS: Pack[] = [musicPack, probePack];

// The player-facing packs (the probe is a test fixture, never surfaced).
export const GAME_PACKS: Pack[] = [musicPack];

export function packById(id: string): Pack | undefined {
  return PACKS.find((p) => p.id === id);
}
