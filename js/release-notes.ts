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
    version: '0.28.0',
    date: '2026-07-17',
    title: 'The fire’s memory grows',
    notes: [
      'Every bard’s-note confession now has a second voicing — same mistake, different night at the fire — so a veteran’s cold opens stop reciting. And the crowd’s memory grows four needles: the innkeeper’s wife has opinions about the warm islands, the woodpile defends her fire against the beach, the widow keeps the twenty-name count, and the man who wants the horse has heard what Smyrna does in ten nights.',
      'The one-voice law holds everywhere: a needle stands down whenever the cold open already confessed its ending.',
    ],
  },
  {
    version: '0.27.0',
    date: '2026-07-17',
    title: 'One voice owns last night, and the ending breathes',
    notes: [
      'The halfway audit: a returning bard was hearing about last night from THREE places before tonight’s first oar-stroke — the cold open, the fire’s question, and a heckle. Now the bard’s-note owns the confession: when it speaks, the same-ending card and needle stand down. No note, and the fire still asks — one voice a night, whoever holds it.',
      'The ending screen breathes: the old fire-and-cup scene stood one line above a vase closing on the same cup, so the vase is now THE keepsake (the death-rite ember still gutters). A fully-sung prophecy collapses its shelf to one quiet line instead of re-serving the solved ceremony every night.',
      'And the run-start picker finally admits there are six fires, not four.',
    ],
  },
  {
    version: '0.26.0',
    date: '2026-07-17',
    title: 'The gallery of nights',
    notes: [
      'The Night’s Vase becomes a shelf: the Trophy Room’s Past Lives now opens with your last five tellings painted small — each remembered night re-drawn by exactly the rules that painted it live, fleet count, stations, sea and all, with a one-word caption for how it ended.',
      'Nights told before the vase existed stay unpainted. The gallery does not invent pictures for the past.',
    ],
  },
  {
    version: '0.25.0',
    date: '2026-07-17',
    title: 'The night, painted',
    notes: [
      'Every Odyssey ending now closes with the Night’s Vase: a black-figure band painted from the telling you actually gave — your fleet at its final count, the cave island only if you faced the cave, the trench’s ash only if you went down, the warm island close if you stayed, the sea wearing exactly the mood you left it in, and the ending’s own motif to close the band (the star and gulls for a homecoming, the trident for the wrath, the cup set down for a banked night).',
      'The vase does not flatter. That is what makes it worth keeping.',
    ],
  },
  {
    version: '0.24.0',
    date: '2026-07-17',
    title: 'The fire remembers last night',
    notes: [
      'Come back after a telling and the fire is apt to bring it up IN PLAY: end on the wrath and the widow asks whether tonight’s captain also shouts at the water; sit down in the meadow and the potter’s boy wants to know if he’ll sit again; bank a warm island and the innkeeper mentions, while pouring, how the tale keeps ending there; bring the homecoming in whole and they demand it again; stop on the beach and they just build your fire higher and say nothing.',
      'Five cards, one per ending, each a real choice about what kind of bard faces the room. The daily and the Gauntlet never see them — shared water forks on nothing personal.',
    ],
  },
  {
    version: '0.23.0',
    date: '2026-07-17',
    title: 'The Glory road earns its finale',
    notes: [
      'The evidence pass over everything shipped this week (8,000 simulated tellings, sliced by fire and road): the Glory road’s gate rises from Renown 5 to 8 — at 5, two of its three endings almost never rendered because the finale was ratifying a choice already made. Glory must now be earned past the crossroads, not just carried over it.',
      'The Pilots’ Bench ran fourteen points hotter than the coldest fire, so its Lore gift eases 8 → 6 (the deep-water lean stays). And the meadow speaks at Despair 15 now — at 12 it had quietly become the deck’s second-most-common ending.',
    ],
  },
  {
    version: '0.22.0',
    date: '2026-07-17',
    title: 'The witch meets every fleet now',
    notes: [
      'Circe’s island was gated to the desperate — real Despair or a bled fleet — so six tellings in seven sailed straight past her. Arrive strong now and she has no lever on you, so she trades instead: sing her the war and she charts you the sea. The weary still get the soft year’s offer; a strong fleet rowed to exhaustion may meet either reading.',
      'The act-2 itinerary’s quietest beat is now its second-most-varied, and the entropy gates guard both readings from rotting shut.',
    ],
  },
  {
    version: '0.21.0',
    date: '2026-07-17',
    title: 'The finale reads the telling that earned it',
    notes: [
      'Four more endings that notice what you actually did: bring every bench home and the muster-roll becomes the song; win the Glory road as Nobody and the verse has no name to hang the deeds on; win it loud with the sea provoked and the last verse carries a bill; and lose an UNSHOUTED fleet to the wrath and the bard sings the colder truth — some water is simply owed.',
      'The Oar Road still outranks everything. The static endings remain the floor every telling can fall back to.',
    ],
  },
  {
    version: '0.20.0',
    date: '2026-07-17',
    title: 'The Gauntlet comes to the fire',
    notes: [
      'The Odyssey gets the weekly Gauntlet: one fire, drawn by fate, the same sea for every bard alive that week — one attempt, results kept, a trophy for standing The Long Watch. The share line carries the week so rival bards can compare scars.',
      'And a confession from the villa: Love Island’s Gauntlet button has been quietly doing nothing when pressed (it cleared your run and stopped there). It now actually deals the week’s Islander. We do not speak of the weeks before.',
      'Shared water stays nobody’s confession: neither the daily nor the Gauntlet touches the bard’s-note.',
    ],
  },
  {
    version: '0.19.0',
    date: '2026-07-17',
    title: 'Legacy finally buys something',
    notes: [
      'The Odyssey gets The Guest-Gifts: ten gifts on three shelves, bought with the Legacy your tellings have been quietly banking all along. A coin from Troy that starts your Renown, a carved owl the goddess notices, a libation that eases the sea’s grudge every act, a cheesecloth wind that banks a third following wind.',
      'A gift once given rides every telling after — xenia, the old law. Prices run one night’s Legacy for the small gifts to a good week at the fire for the great ones.',
    ],
  },
  {
    version: '0.18.0',
    date: '2026-07-17',
    title: 'Two more rooms to sing in',
    notes: [
      'The Odyssey gains two fires: The Pilots’ Bench, where the professionals want the courses told true (Lore starts 8 higher, and the deck leans toward the hard water), and The Widow’s Porch, where the sea has already been paid (Despair relief lands half again as deep, and the deck spares you the blood and the brag).',
      'Six rooms now, six different tellings — the crowd you sing to has always shaped the sea you get.',
    ],
  },
  {
    version: '0.17.0',
    date: '2026-07-17',
    title: 'Word travels',
    notes: [
      'The Odyssey gets its second screen — no phones, just the word moving: the harbor wall (pilots and traders, three ports downwind of the truth), Olympus (the powers’ dry minutes — Poseidon posts in weather), and the listeners round this very fire. Word moves at landmarks, temptations, act breaks, and the ending; the quiet seas stay quiet.',
      'The rooms are honest instruments: the harbor reads your Renown, Olympus reads the Athena–Poseidon ledger, the fire reads your Despair. Shout your name at the cave and the Sea-lord pins the receipt.',
    ],
  },
  {
    version: '0.16.0',
    date: '2026-07-17',
    title: 'The last mile grows six new waters',
    notes: [
      'Act III of The Odyssey grows a third deeper — the approach, not the hall: a ferryman who carries words between the islands, your own herds driven downhill to the suitors’ table, the black ambush ship waiting in the strait, the first smoke of your own hearth, a beggar’s bowl at your own festival, and a lamp held to your face one breath too long.',
      'The narrow way home now repeats itself far less across tellings.',
    ],
  },
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
