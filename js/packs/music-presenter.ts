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
import { equipAccessory } from './plugins/gear.js';
import { MUSIC_ART } from './music-art.js';
import { rivalById } from '../data/rivals.js';
import { genreById } from '../data/genres.js';
import { venueById } from '../data/venues.js';
import { accessoryById } from '../data/accessories.js';
import { collabArtistFor } from '../charts.js';
import { flagshipSong } from '../songs.js';
import { DEFAULT_FAIL_LABELS } from '../share-text.js';
import { musicHudCounters, musicGearChips } from './music-hud.js';
import { showChart } from './music-chart.js';
import {
  musicDeltaChip, musicResultExtras, musicChoiceMinigame, musicRecordPerf,
  musicHideRisk, musicEncoreDisabled, musicChoiceHasMinigame,
} from './music-result.js';
import { showBrammies } from './music-brammies.js';
import { musicFinalSet } from './music-finalset.js';
import { musicActBreakChart } from './music-chart.js';
import { musicShareText, musicShareImage } from './music-share.js';
import { musicRecordMeta, musicTrophySpecials, musicEndingExtras } from './music-meta.js';
import {
  musicLoadoutPool, musicSetupSummary, musicRenderSetupExtras, musicApplySetup, musicStartGauntlet,
} from './music-setup.js';
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
  // gear-swap flows), and equip one into the run's slots.
  itemById: (id) => accessoryById(id),
  equipItem: (state: any, id: string, dropId?: string) => equipAccessory(state, id, dropId),

  // The art system's reactive-scene inputs, mapped from music's meters, plus
  // music's slot -> {emoji, scene} table (registered with the scene painter).
  vibe: (state: any) => ({ fame: state.fame, network: state.stats.network, burnout: state.stats.burnout }),
  art: MUSIC_ART,

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

  // The result overlay + card-choice voice (js/packs/music-result.ts): the
  // subsystem notices, the rivalry/money/hit chip flourishes, the on-swipe
  // minigame, and the contract-driven risk/encore gates.
  deltaChip: musicDeltaChip,
  resultExtras: musicResultExtras,

  // Share (default text + poster), pack meta bookkeeping, the special trophy
  // predicates, and the ending-screen extras (chart legacy + contract mult).
  shareText: musicShareText,
  shareImage: musicShareImage,
  recordMeta: musicRecordMeta,
  trophySpecials: musicTrophySpecials,
  endingExtras: musicEndingExtras,
  choiceMinigame: musicChoiceMinigame,
  recordPerf: musicRecordPerf,
  hideRisk: musicHideRisk,
  encoreDisabled: musicEncoreDisabled,
  choiceHasMinigame: musicChoiceHasMinigame,

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
  // genres), so the mode — and its build screen — are this pack's to declare.
  gauntlet: true,
  startGauntlet: musicStartGauntlet,

  // The title screen: logo, attract-mode glyphs, the day's rotating tagline,
  // the flavor-news line, and the footer stat line. (Music's; the shell only
  // lays them out.)
  title: {
    logo: 'BIG<br>BREAK',
    glyphs: ['♪', '♫', '♩', '♬'],
    taglines: [
      'Swipe your way from a damp garage to the top of the music industry — before the industry breaks you first.',
      'The kingdom is your career. The courtiers are A&R reps, algorithms, and your own burnout.',
      'Exposure is not legal tender. Swipe accordingly.',
      'Somewhere between the open mic and the stadium, there is a man named Curtis.',
      'Every swipe is a career decision. Most careers are twelve bad ones in a row.',
      'The nachos are load-bearing. The dream is real. The pay is exposure.',
      'Craig has the corner. Todd has the shifts. You have four chords and a feeling.',
    ],
    foot: (m: any) => `Runs: ${m.runs} · Best fame: ${m.best.fame} · Legacy: ${m.lpEarnedTotal} LP`,
    news: (dayNum: number) => {
      // The evergreen headline pool, exercised with a music-shaped fake state.
      const fake: any = {
        flavorSeed: dayNum, act: 1, cardLog: [], fame: 0, money: 50, hits: 0,
        stats: { burnout: 0, cred: 50, skill: 0 }, rival: 'vanta', loadout: 'kazoo', hustles: [], rivalry: 3,
      };
      return (generateHeadlines(fake, 1) || [])[0] || null;
    },
  },

  // The Settings "about" line (the flagship's tagline footer).
  aboutLine: 'BIG BREAK v5 — a satirical music-career roguelike. All characters are archetypes; any resemblance to real A&R reps is statistically inevitable.',

  // The First Gig tutorial copy (the mechanism — deck, coach marks — is
  // engine/shell-generic; only the words are music's).
  tutorial: {
    offer: '▶ Play — Your First Gig',
    skip: 'Skip the gig — I know the drill',
    replay: '🎓 Replay the first gig',
    hud: 'FIRST GIG · The Rubber Room',
    end: {
      verdict: 'SOUNDCHECK COMPLETE', title: 'The First Gig', art: 'ev_tut_set',
      text: 'Nineteen people, four of them on purpose, and nobody left. Dee flips the clipboard shut: “Tuesday’s yours if you want it.” That’s the whole tutorial — the career ahead is longer, meaner, and much funnier.',
      lessons: [
        { cls: 'notice-gear', html: '👆 <b>Swipe or tap</b> — every card is one decision, left or right.' },
        { cls: 'notice-gear', html: '🎸 <b>Stat icons</b> on a choice show what it rolls against. Build what your path needs.' },
        { cls: 'notice-gear', html: '<b>The risk tell</b> — ● safe · ▲ dicey · ■ likely bad · ✦ big upside. Read it before you leap.' },
        { cls: 'notice-bad', html: '🔥 <b>Burnout</b> drags every roll and ends careers at 100. Rest is a real move.' },
        { cls: 'notice-encore', html: '🎇 <b>Encores</b> — an INCREDIBLE banks one; arm it on the card that matters.' },
      ],
      next: '▶ Start your real career',
    },
  },

  // The loadout screen: music's copy, its instrument pool, and its optional
  // venue/genre/contract pickers + the run-init those drive (music-setup.ts).
  loadoutPicker: { head: 'Choose your weapon', sub: 'Each one is almost useless. That’s the point.' },
  loadoutPool: musicLoadoutPool,
  setupExtras: musicRenderSetupExtras,
  setupSummary: musicSetupSummary,
  applySetup: musicApplySetup,

  // The Brammies (Pass 44): awards night before the final act, once you've made
  // enough noise to be nominated. Both the trigger condition and the screen
  // itself are this pack's (the shell just asks and renders what it's given).
  actStartOverlay: (s: any) => s.act === 3 && s.fame >= 25 && !s.brammy,
  actStartScreen: showBrammies,
  actBreakChart: musicActBreakChart,

  // The pre-finale Final Set (js/packs/music-finalset.ts) and the act names /
  // intro copy the shell used to default to for pack #1.
  finalSet: musicFinalSet,
  actNames: ['', 'The Garage', 'The Grind', 'The Reckoning'],
  actIntro: {
    2: { name: 'THE GRIND', text: 'The garage is behind you. Everything now costs something.' },
    3: { name: 'THE RECKONING', text: 'Higher stakes, fewer excuses. The summit is visible. So is the drop.' },
  },

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
