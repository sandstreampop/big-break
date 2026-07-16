// BIG BREAK — the player-facing changelog, newest first.
//
// One app-level log for the whole site (every game ships from one build, so
// they share one version). The shell renders it (menus.ts: the title screen's
// version chip and Settings → What's New); this module carries the data plus
// the two tiny readers of the stamped identity (versionLabel/notesSkewed) and
// imports only js/version.ts — it sits in the shared layer under the same
// no-pack-imports rule as the rest (tools/check-engine-neutrality.mjs).
// Prose may of course NAME a game — a changelog is product metadata, like the
// README — it just can't import one.
//
// The process contract (docs/RELEASING.md, enforced by
// test/release-notes.test.mjs): a merge to main that changes what a player
// sees bumps package.json `version` AND adds an entry here, same number,
// newest first. The gate fails the build when the top entry and package.json
// disagree, so the number on the deployed title screen always has a matching
// note behind it.

import { APP_VERSION, BUILD_SHA, BUILD_DATE } from './version.js';

export interface ReleaseNote {
  /** semver, matching package.json at the commit the entry shipped in */
  version: string;
  /** ISO date (YYYY-MM-DD) the entry was cut */
  date: string;
  /** one-line headline for the release */
  title: string;
  /** player-readable bullet points — what changed, in plain words */
  notes: string[];
}

export const RELEASE_NOTES: ReleaseNote[] = [
  {
    version: '0.6.0',
    date: '2026-07-16',
    title: 'The Odyssey explains itself',
    notes: [
      'Tap the painted band: it now also states tonight’s Odysseus — your Might, Guile, and Lore, which previously appeared nowhere on screen.',
      'The Help sheet finally speaks Odyssey: the fleet, the two gods, Renown, the two roads, the following wind, and what actually carries between tellings.',
      'The Résumé is the bard’s ledger now — nights sung, men named in the sand, turnings held, how every telling ended — and Past Lives rows show each telling’s renown and cost.',
    ],
  },
  {
    version: '0.5.0',
    date: '2026-07-16',
    title: 'The bard counts the house between acts',
    notes: [
      'The Odyssey’s act breaks now recap YOUR telling, not a script: the real count of men still rowing, what became of the name at the cave, and the gods’ actual mood — then the road ahead.',
      'The wording rotates from telling to telling, and the hearth keeps burning through it.',
    ],
  },
  {
    version: '0.4.0',
    date: '2026-07-16',
    title: 'The Odyssey grows a trophy shelf',
    notes: [
      'Twenty-one trophies for The Odyssey: every way a telling can end, the feats between (a fleet brought home whole, glory won as Nobody, a telling with no bad landing…), and long-game marks the fire keeps across nights.',
      'The Trophy Room on the Odyssey title screen — previously an honest but empty 0/0 — now has something to collect. A few only announce themselves once.',
    ],
  },
  {
    version: '0.3.0',
    date: '2026-07-16',
    title: 'The Odyssey teaches you the oar',
    notes: [
      'The Odyssey now opens with The First Telling — a three-beat playable intro that teaches the swipe, the risk tell, the painted band, and the two ledgers (Despair and Poseidon) before your first real telling.',
      'First night at the fire? The title screen offers you the seat. Old hands can skip it — or replay it any time from Settings.',
    ],
  },
  {
    version: '0.2.0',
    date: '2026-07-13',
    title: 'You can now tell which version you’re playing',
    notes: [
      'Every game’s title screen shows a version chip (number · build · date) — tap it for these notes.',
      'What’s New is also in Settings, and it tells you when a newer version is waiting behind a refresh.',
      'Releases now follow a written process (docs/RELEASING.md): every player-visible change ships with a version bump and a note here, enforced by the build gates.',
    ],
  },
  {
    version: '0.1.0',
    date: '2026-07-12',
    title: 'Everything before the changelog existed',
    notes: [
      'Three games on one engine: Big Break (music), Love Island, and The Odyssey.',
      'Runs, daily challenges, the Gauntlet, trophies, career wall, saves that survive refreshes — the era before releases had numbers.',
    ],
  },
];

// The ONE assembly of the deploy's identity string — the title chip and the
// What's-New sheet both render exactly this, so the two surfaces can never
// drift apart on the very fact they exist to state unambiguously.
export const versionLabel = (): string =>
  ['v' + APP_VERSION, BUILD_SHA, BUILD_DATE].filter(Boolean).join(' · ');

// Mixed-delivery detector: the SW caches ES modules individually, so this
// module and version.js can come from different deploys. True means the
// running build and the changelog disagree — an update is mid-delivery,
// refresh reconciles. A no-op under unstamped tsc output ('dev'), like the
// CSS contract's boot check. The parameter exists so the gate can drive BOTH
// branches (test/release-notes.test.mjs); real callers use the default.
export const notesSkewed = (appVersion: string = APP_VERSION): boolean =>
  appVersion !== 'dev' && RELEASE_NOTES[0].version !== appVersion;
