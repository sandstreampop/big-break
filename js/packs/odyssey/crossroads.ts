// The Odyssey — the crossroads reads the telling (pass 36).
//
// The hinge of the run: after the cave, the bard asks which telling this
// is — home, or the song. The shell's crossroads screen shows the gates'
// arithmetic (bars, closest-fit); what it could not show is the STORY
// arriving at the fork. These two pure readers give each door one line in
// the light of the run that reached it, and the crowd one interjection —
// same grammar as the finale variants (pass 19): priority-ordered,
// rarest-first, a default floor every run can fall back to.
//
// PURE: functions of the state alone — no rng, no clock, no module state —
// so the same run always reads the same, and nothing here can touch a
// seeded stream (the crossroads renders between draws).

import type { RunState } from '../../types.js';

const n = (v: unknown): number => Math.max(0, Math.round(Number(v) || 0));

export function crossroadsReading(state: RunState, pathId: string): string | null {
  const flags = state.flags || [];
  const named = flags.includes('ody_named');
  const nobody = flags.includes('ody_nobody');
  const hulls = n(state.expedition);
  const poseidon = n(state.poseidon);
  const athena = n(state.athena);
  const renown = n(state.renown);
  const despair = n(state.stats?.burnout);

  if (pathId === 'nostos') {
    if (hulls >= 9) return `${hulls} hulls still answer the oar-call. Rowing a fleet like this home whole would be a story in itself.`;
    if (named && poseidon >= 5) return 'The road home runs through a sea that knows your name. You made sure of that yourself, friends.';
    if (hulls <= 4) return 'Few benches left — but every man on them rows toward a door with his own name behind it.';
    if (athena >= 5) return 'The owl has walked with you this far. She walks best, the old wives say, on the road home.';
    if (despair >= 50) return 'Some mornings the rock looks closer than the harbor. Home is the cure the sea sells dearest.';
    return 'The long way, counted in hulls. The bed that does not move.';
  }
  if (pathId === 'kleos') {
    if (nobody) return 'Nobody blinded the giant. A song with an empty space where the name goes — no bard has landed one that bold.';
    if (named) return 'You shouted the name; the song started itself that day. It only lacks an ending now.';
    if (renown >= 5) return 'Two harbors are already singing it wrong. Half the song exists, friends — finish it before they do.';
    if (poseidon >= 7) return 'The sea hates you properly now. Hatred like that, sung right, makes a very good verse.';
    if (athena >= 5) return 'The owl backs clever men, and the Glory is the cleverest bet on the board. Also the dearest.';
    return 'The short life, the long name. Ask the fire which one it remembers.';
  }
  return null;
}

export function crossroadsVoice(state: RunState): string | null {
  const flags = state.flags || [];
  if (flags.includes('ody_nobody')) {
    return 'The boys want the giant again — the part where the name goes missing. The woman by the woodpile watches the harbor road and says nothing.';
  }
  if (flags.includes('ody_named') && n(state.poseidon) >= 5) {
    return 'No one at this fire has forgotten that you shouted the name. Neither, friends, has the water.';
  }
  if (n(state.expedition) <= 5) {
    return 'The fire counts the empty benches before it votes. Fewer hulls make quieter arguments.';
  }
  return 'The fire splits even: half the benches call for the bed, half for the verse. The bard, as usual, is paid either way.';
}
