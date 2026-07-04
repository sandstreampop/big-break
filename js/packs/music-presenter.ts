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
};
