// The music pack's Presenter (Phase G): the genre's UI-facing flavor, gathered
// behind the pack so the UI shell reads pack.presenter instead of importing
// music's meta and flavor modules directly. This wraps the existing music
// content verbatim — the music UI is byte-for-byte unchanged; only the plumbing
// (static import → presenter capability) moved.

import { ENDINGS, EXIT_INTERVIEWS, WALL_ITEMS, TROPHIES } from '../data/meta.js';
import { buildEpilogue } from '../epilogue.js';
import { generateHeadlines } from '../headlines.js';
import { generateDMs } from '../dms.js';
import { buildDiscography } from '../discography.js';
import type { Presenter } from '../types.js';

export const musicPresenter: Presenter = {
  endings: ENDINGS,
  exitInterviews: EXIT_INTERVIEWS,
  wallItems: WALL_ITEMS,
  trophies: TROPHIES,
  epilogue: buildEpilogue,
  headlines: generateHeadlines,
  dms: generateDMs,
  discography: buildDiscography,
  // The weekly Gauntlet builds its fixed loadout from music data (contracts,
  // genres), so the mode is this pack's to declare.
  gauntlet: true,

  // Music's own telemetry taxonomy (Epic 5). The shell emits the neutral spine
  // (mode, outcome, cards, burnout, lp, career_runs) and the pack's summarize
  // fields; these are music's props that AREN'T in summarize — instrument,
  // genre/venue/contract picks and mastery at start; the fame/hits meters, the
  // chart peak and equipped gear at end. Emitting the same keys the shell used
  // to hardcode, so the existing PostHog insights keep working.
  runProps: (state, moment) => {
    if (moment === 'start') {
      return {
        instrument: state.loadout,
        contract: state.contract || 'none',
        genre: state.genre || 'none',
        venue: state.venue || 'none',
        mastery: state.mastery || 0,
      };
    }
    const chartPeak = (state.songs || []).reduce(
      (best: number | null, s: any) => (s.peak && (!best || s.peak < best) ? s.peak : best), null);
    return {
      instrument: state.loadout,
      fame: state.fame,
      hits: state.hits,
      chart_peak: chartPeak || null,
      gear: (state.accessories || []).slice().sort().join(','),
    };
  },
};
