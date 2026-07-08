// Love Island — role resolvers: the pure "who currently fills this seat" reads
// the presenter and the card-cast strip both need. The Partner/Rival/bombshell
// have live seats in run-state (resolved through the characters plugin); the
// Bestie ({mate}) and the Ex ({ex}) are lighter roles the flavour layer names —
// a seated pick when one exists, else a deterministic flavour draw so a token
// like {mate} still has a face before the seat is filled. Pure functions of
// state (flavorSeed-seeded, never the play RNG), so they re-read identically on
// resume and stay golden-neutral.

import { castById, couplePool, sameGenderPool } from './cast.js';
import type { CastMember } from './cast.js';
import type { RunState } from '../../types.js';

// The Bestie seat (R7/D2) — one person, all Season. Flavour pick only as a
// fallback for pre-bestie saves / a {mate} token seen before the pact forms.
export function mateFor(state: RunState): CastMember | null {
  const seated = castById(state.bestie);
  if (seated) return seated;
  const pool = sameGenderPool(state).filter((c) => c.id !== state.rival);
  if (!pool.length) return null;
  return pool[(state.flavorSeed || 1) % pool.length];
}

// The active bombshell (the characters plugin's seat) when one is in the villa;
// a flavour pick otherwise, so pre-arrival teasers still have a name/face.
export function bombshellFor(state: RunState): CastMember | null {
  const active = castById(state.bombshellId);
  if (active) return active;
  const want = state.gender === 'girl' ? 'boy' : 'girl';
  const pool = couplePool(state, { bombshells: true }).filter((c) => c.bombshell && c.gender === want);
  if (!pool.length) return null;
  return pool[(state.flavorSeed || 1) % pool.length];
}

// The most recent Ex — the person the {ex} token names (the last entry in the
// exes ledger), or null before you've switched partners.
export function exFor(state: RunState): CastMember | null {
  const exes = state.exes || [];
  return exes.length ? castById(exes[exes.length - 1]) : null;
}
