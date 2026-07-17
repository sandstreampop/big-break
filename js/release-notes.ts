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
    version: '0.15.0',
    date: '2026-07-17',
    title: 'The bard remembers what went wrong',
    notes: [
      'End a telling on a real mistake — the shout that drowned the fleet, the goddess left one owl short, a strong telling banked at a warm island, the beach two islands from home — and the NEXT telling opens with the bard owning it. One note at a time; a clean night clears the slate.',
      'The confession is knowledge, not power: it changes the opening words, never the odds.',
    ],
  },
  {
    version: '0.14.0',
    date: '2026-07-16',
    title: 'Meet The Benches',
    notes: [
      'The Odyssey’s title screen gains a cast gallery: the eighteen rowers the bard names when the sand takes them, the fire’s ensemble (the woman by the woodpile, the potter’s boy, the man who still wants the horse, and Phemios’s pointedly empty place), and the two powers keeping the ledger.',
      'Faces are the game’s own black-figure work, and a few lines remember your tellings — how many nights you’ve sung, how many men the sand has taken.',
    ],
  },
  {
    version: '0.13.0',
    date: '2026-07-16',
    title: 'Six more waters where the chart gives up',
    notes: [
      'Act II of The Odyssey grows a third deeper: stars that lie in small ways, a shepherd boy too clean for his hillside, a dead man’s kit to divide, one gift allowed from the witch’s table, the Troy song starting at the oars, and a charred figurehead that circles the fleet the way debris does not.',
      'The narrow sea now repeats itself far less across tellings.',
    ],
  },
  {
    version: '0.12.0',
    date: '2026-07-16',
    title: 'The meadow finally makes its offer',
    notes: [
      'The Lotus temptation was gated so tight it fired in fewer than 1 in 100 tellings — a no-offer. Now the flower speaks to the genuinely weary: real Despair, or a fleet already down three hulls. Sail in strong and you will still never see it.',
      'The King’s Hall now starts the telling at Renown 3 of the Glory road’s 5 — a hall that has heard of you should feel like a head start, not a rumor.',
    ],
  },
  {
    version: '0.11.0',
    date: '2026-07-16',
    title: 'Six new seas in the first water',
    notes: [
      'Act I of The Odyssey grows a third deeper: Trojan salvage flying cloth you know, dolphins on the bow wave, a fair wind at dusk that may be lying, one drifting oar with a name cut into it, a captains’ council staged on a beach, and the water casks coming up green.',
      'Repeat tellings meet noticeably fewer repeats before the cave.',
    ],
  },
  {
    version: '0.10.0',
    date: '2026-07-16',
    title: 'The telling travels',
    notes: [
      'Sharing an Odyssey run finally shares something: which fire, which road, how it ended, the night’s weather strip, the fleet’s arithmetic, and how many turnings of the prophecy you hold. (The button used to copy an empty string. We do not speak of it.)',
      'The title screen carries one harbor rumor a day — Phemios and his drum, the pilots’ bench, an oar planted inland that sailors will not walk past.',
    ],
  },
  {
    version: '0.9.0',
    date: '2026-07-16',
    title: 'The Scarred Telling, and The Same Sea',
    notes: [
      'Bring one telling home whole and the fire asks for the harder one: The Scarred Telling starts you three hulls short, the sea already muttering, Despair already aboard — but a veteran in all three ways, and it pays half again in Legacy.',
      'The Odyssey’s daily is now The Same Sea: every bard alive sings the same water tonight, streaks tracked, new telling at midnight.',
      'The crowd notices a scarred night — “Nine hulls? You sang twelve out of Troy before.”',
    ],
  },
  {
    version: '0.8.0',
    date: '2026-07-16',
    title: 'The fire gets the last word',
    notes: [
      'End a telling early — banked at a temptation, taken by the sea, or left on the beach — and someone at the fire asks the bard one question on the way out. Your answer is which bard you are tonight (and it pays Legacy accordingly).',
      'Finish a telling properly and the fire reacts: the exhale, the coins, the boy asleep on the woodpile. Different nights, different last words.',
    ],
  },
  {
    version: '0.7.0',
    date: '2026-07-16',
    title: 'The Underworld reads your voyage back to you',
    notes: [
      'The trench at the edge of the world has a second reading: sail in having lost half your fleet or more, and the first faces out of the grey are your own dead — in rowing order, waiting to be looked at.',
      'Which Underworld you meet is decided by the voyage you actually sailed. The prophecy’s doors work from either reading.',
    ],
  },
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
