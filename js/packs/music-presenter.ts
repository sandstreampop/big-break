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
import { rivalById } from '../data/rivals.js';
import { genreById } from '../data/genres.js';
import { venueById } from '../data/venues.js';
import { accessoryById } from '../data/accessories.js';
import { collabArtistFor } from '../charts.js';
import { flagshipSong } from '../songs.js';
import { DEFAULT_FAIL_LABELS } from '../share-text.js';
import { musicHudCounters, musicGearChips } from './music-hud.js';
import { showChart } from './music-chart.js';
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

  // Short verdict labels for music's fail-state endings (ribbon, history).
  failLabels: DEFAULT_FAIL_LABELS,

  // Per-stat inspector blurbs (the stat sheet) and the help sheet's music
  // cheat-sheet (the intro — the universal swipe mechanic — stays in the shell).
  statInfo: {
    skill: 'Raw musicianship. Feeds the <b>Studio Legend</b> gate and steadies live/studio choices.',
    cred: 'Industry respect — the floor under every path. Hits 0 in Act 2+ and you’re cancelled.',
    creativity: 'Original ideas. Feeds the <b>Hit Factory</b> gate and weird/indie choices.',
    network: 'Who owes you a favor. Feeds the <b>Megastar</b> gate and every deal.',
    burnout: 'The danger stat. Every point drags all rolls down; at 100 you quit music for a fintech. Rest cards and coping moments push it back.',
  },
  helpBlocks: [
    '🔥 <b>Burnout</b> is the danger stat: it drags every roll down and ends your career at 100. Rest is a real decision.',
    '🎇 Rolling an INCREDIBLE banks an <b>Encore</b> — arm it later to boost the swipe that matters.',
    '▲ <b>Momentum</b> from big wins can push a near-miss finale over the line. ★ Fame and $ money are score and fuel, not stats.',
  ],

  // Resolve an equipped-item id through music's accessory catalog (HUD chips,
  // gear-swap flows).
  itemById: (id) => accessoryById(id),

  // The art system's reactive-scene inputs, mapped from music's meters.
  vibe: (state: any) => ({ fame: state.fame, network: state.stats.network, burnout: state.stats.burnout }),

  // The HUD's music readout: the counter chips (fame/money/hits + encore &
  // momentum) and the gear row (instrument + kit). Both are descriptors the
  // shared HUD renders — see js/packs/music-hud.ts.
  hudCounters: musicHudCounters,
  gearChips: musicGearChips,

  // The Hot 10 button beside the act label, once the songs subsystem is live;
  // it opens music's own chart + songbook screen (js/packs/music-chart.ts).
  hudButtons: (s: any) => {
    if (s.tutorial || !s.songs) return [];
    const n = (s.songs || []).filter((x: any) => x.status === 'charting' && x.pos).length;
    return [{ icon: '📈', badge: n ? String(n) : null, onTap: showChart }];
  },

  // Fill a card's {tokens} with this run's musical identities (rival, genre,
  // the flagship/hit/faded song, the home venue).
  fillTokens: (state: any, s: string) => {
    const r = rivalById(state.rival);
    const g = genreById(state.genre);
    return s.replaceAll('{rival}', r.name).replaceAll('{rivalVibe}', r.vibe)
      .replaceAll('{genre}', g ? g.name : 'your genre')
      .replaceAll('{collabArtist}', collabArtistFor(state))
      .replaceAll('{song}', flagshipSong(state)?.title || 'the song')
      .replaceAll('{hitSong}', (state.songs || []).find((x: any) => x.crowned)?.title || 'the hit')
      .replaceAll('{fadedSong}', (state.songs || []).find((x: any) => x.status === 'faded' && x.peak)?.title || 'your old single')
      .replaceAll('{venue}', venueById(state.venue)?.name || 'the venue');
  },
  // The weekly Gauntlet builds its fixed loadout from music data (contracts,
  // genres), so the mode is this pack's to declare.
  gauntlet: true,

  // The Brammies (Pass 44): awards night before the final act, once you've made
  // enough noise to be nominated. The trigger used to be hardcoded in the shell
  // (step.act === 3 && run.fame >= 25); it's this pack's condition now.
  actStartOverlay: (s: any) => s.act === 3 && s.fame >= 25 && !s.brammy,

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
