// The prophecy meta-arc (slice 6): what crosses tellings, and what it earns.
// Knowledge, not power — a bard who has carried both other fragments home
// (stamped as run flags from the pack meta-save at setup; see
// presenter.applySetup/recordMeta) is offered the THIRD question: the
// Underworld's chain reroutes to the gated Tiresias variant. No stat, no
// number, a door. The Oar Road itself is judged at the finale and rendered
// through the presenter's pure presentFinale hook.

import type { Pack, Plugin } from '../../types.js';
import { crewAtLaunch } from './crew.js';

export const prophecyPlugin: Plugin = {
  id: 'odyssey_prophecy',
  modifyEffects(state, effects) {
    if (effects.chainEventId === 'ody_tiresias'
      && state.flags.includes('ody_frag_bow') && state.flags.includes('ody_frag_sea')) {
      effects.chainEventId = 'ody_tiresias_oar';
    }
  },
};

// The genre-neutral run summary (rides run_end + recordMeta): which turning
// of the prophecy tonight's telling carried home, and whether the truer
// ending was sung.
export const summarizeTelling: NonNullable<Pack['summarize']> = (state) => ({
  fragment: state.flags.includes('ody_oar_road') ? 'oar'
    : state.flags.includes('ody_fore_bow') ? 'bow'
      : state.flags.includes('ody_fore_sea') ? 'sea' : null,
  // The truer ending: the whole prophecy carried, the sea kept unprovoked,
  // the homecoming judged whole. Same predicate the ending variant reads.
  trueVictory: state.ending?.result === 'success' && state.path === 'nostos'
    && state.flags.includes('ody_oar_road') && (state.poseidon || 0) <= 3,
  named: state.flags.includes('ody_named'),
  // The telling-ledger's raw material (I8, the Memory Law): how tonight
  // ended, who was lost, whether the name went down with the anchor-stone,
  // and which cross-run callbacks the crowd spent (no-repeat bookkeeping).
  endingKey: state.ending?.key ?? null,
  endingResult: state.ending?.result ?? null,
  nobody: state.flags.includes('ody_nobody'),
  crewLost: Math.max(0, crewAtLaunch(state.loadout) - Math.round(state.expedition ?? 0)),
  // A line still queued in bardLine was picked at the run's FINAL resolve —
  // there was no next deal, so the fire never heard it; don't ledger it.
  heardCallbacks: (state.bardShown || [])
    .filter((id) => id.startsWith('bcm_') && id !== state.bardLine),
});
