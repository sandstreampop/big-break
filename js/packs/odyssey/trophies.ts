// The Odyssey — the trophy shelf (pass 2 of the player-experience series).
// The shell's Trophy Room rendered "0/0 collected" for this pack; these fill
// it. Grammar is the shell's generic loop (js/ui/endings.ts): a trophy fires
// on a pure `check(summary)` — the engine's runSummary + summarizeTelling
// (prophecy.ts) — or a `special` predicate reading the pack's meta ledger
// (presenter.trophySpecials). Voice: the bard pricing his own repertoire —
// every description is something the fire could say out loud.
//
// Ids are permanent once shipped (they live in player meta saves) — retire
// by removal, never by rename.

interface OdysseyTrophy {
  id: string;
  cat: 'endings' | 'feats' | 'career';
  name: string;
  icon: string;
  desc: string;
  secret?: boolean;
  check?: (s: any) => boolean;
  special?: string;
}

export const ODYSSEY_TROPHIES: OdysseyTrophy[] = [
  // ── Ways It Ends ──
  { id: 'ody_win_nostos', cat: 'endings', name: 'The Living Oak', icon: '🛏',
    desc: 'Bring the homecoming in whole. The bed does not move. Neither, tonight, does the hall.',
    check: (s) => s.path === 'nostos' && s.result === 'success' },
  { id: 'ody_win_kleos', cat: 'endings', name: 'The Song That Outlives', icon: '🌟',
    desc: 'Win the Glory. In halls you will never see, they are getting the details wrong and the name right.',
    check: (s) => s.path === 'kleos' && s.result === 'success' },
  { id: 'ody_oar_road', cat: 'endings', secret: true, name: 'The Whole Prophecy', icon: '🌾',
    desc: 'Sing the Oar Road end to end. Some tellings you do not follow with another.',
    check: (s) => !!s.trueVictory },
  { id: 'ody_wrath', cat: 'endings', name: 'The Sea Answered', icon: '🌊',
    desc: 'Fill the sea’s ledger to ten. Far down, where the light gives up, the debt was called in whole.',
    check: (s) => s.endingKey === 'wrath' },
  { id: 'ody_banked', cat: 'endings', name: 'A Lamp in the Window', icon: '🕯',
    desc: 'Bank a telling at a temptation — the meadow, the soft year, or the island. The fire has never quite learned to condemn it.',
    check: (s) => ['lotus', 'circe', 'calypso'].includes(s.endingKey) },
  { id: 'ody_beach', cat: 'endings', name: 'The Back to the Rock', icon: '🌫',
    desc: 'Let the Despair fill. The tide files his footprints under quiet, and the telling waits for another night.',
    check: (s) => s.endingKey === 'burnout' },
  { id: 'ody_harbor_light', cat: 'endings', secret: true, name: 'The Light, Seen Once', icon: '🔦',
    desc: 'Lose the homecoming with Ithaca in sight. The bard does not soften it. The fire does not ask him to.',
    check: (s) => s.path === 'nostos' && s.result === 'failure' },

  // ── Feats ──
  { id: 'ody_paid_bard', cat: 'feats', name: 'Paid the Bard', icon: '🪙',
    desc: 'Finish a telling, any telling. The fire got its story. The bard is checking the cup.',
    check: () => true },
  { id: 'ody_all_hands', cat: 'feats', name: 'Every Man, Every Hull', icon: '⛵',
    desc: 'Win a telling without losing a single man. The benches are loud the whole way home, and the bard lets them be.',
    check: (s) => s.result === 'success' && (s.crewLost ?? 99) === 0 },
  { id: 'ody_unprovoked', cat: 'feats', name: 'The Sea Left Unprovoked', icon: '🔱',
    desc: 'Bring a telling all the way to the Hall with the sea’s grudge at nothing. Poseidon looked for your name in his ledger and found a clean page.',
    check: (s) => s.result != null && (s.poseidon ?? 99) <= 0 },
  { id: 'ody_named_win', cat: 'feats', name: 'Say It Whole', icon: '🗣',
    desc: 'Shout the name at the water — father, city and all — and still win the telling. Expensive, friends. Worth it. Possibly.',
    check: (s) => !!s.named && s.result === 'success' },
  { id: 'ody_nobody_glory', cat: 'feats', secret: true, name: 'Nobody Did This', icon: '◌',
    desc: 'Win the Glory as Nobody. The song keeps an empty space where the name goes, and every listener knows whose shape it is.',
    check: (s) => !!s.nobody && s.path === 'kleos' && s.result === 'success' },
  { id: 'ody_kind_sea', cat: 'feats', name: 'The Kind Sea', icon: '🫒',
    desc: 'Reach an ending without one bad landing. The sea’s oldest trick, played back on the sea.',
    check: (s) => s.result != null && Array.isArray(s.tierLog) && s.tierLog.length > 0 && !s.tierLog.includes('bad') },
  { id: 'ody_renown_ten', cat: 'feats', name: 'Sung in Smyrna', icon: '🏛',
    desc: 'End a telling with Renown at ten or more. Rival bards are already doing it with a drum, and doing it worse.',
    check: (s) => (s.renown ?? 0) >= 10 },
  { id: 'ody_owl_shoulder', cat: 'feats', name: 'The Owl at Your Shoulder', icon: '🦉',
    desc: 'End a telling with Athena at eight or more. Not loved — watched. At sea that is the better coin.',
    check: (s) => (s.athena ?? 0) >= 8 },
  { id: 'ody_stood_up', cat: 'feats', name: 'Stood Up From the Rock', icon: '🌅',
    desc: 'Win a telling with Despair past seventy. Some men are not outlasted.',
    check: (s) => s.result === 'success' && (s.stats?.burnout ?? 0) >= 70 },
  { id: 'ody_same_sea', cat: 'feats', name: 'Same Sea as Everyone', icon: '📅',
    desc: 'Finish a shared telling — any told ending counts, even a banked one. Every fire tonight fought the same water.',
    check: (s) => !!s.daily && s.endingKey != null },
  { id: 'ody_long_watch', cat: 'feats', name: 'The Long Watch', icon: '⚔️',
    desc: 'Finish the week’s Gauntlet — one fire, drawn by fate, the same for every bard alive. No substitutions were available.',
    check: (s) => !!s.gauntlet && s.endingKey != null },
  { id: 'ody_three_tides', cat: 'feats', name: 'Three Tides Running', icon: '🔥',
    desc: 'Three nights of The Same Sea in a row. The water starts to expect you.',
    check: (s) => !!s.daily && (s.dailyStreak || 0) >= 3 },
  { id: 'ody_week_water', cat: 'feats', name: 'A Week on One Water', icon: '🌊',
    desc: 'Seven straight nights of the shared sea. The other bards have started timing their fires to yours.',
    check: (s) => !!s.daily && (s.dailyStreak || 0) >= 7 },
  { id: 'ody_sent_sailed', cat: 'feats', name: 'The Water, Answered', icon: '📨',
    desc: 'Finish a sent water — somebody’s exact sea, sailed back at them. Any told ending counts; the answering is the feat.',
    check: (s) => !!s.challenge && s.endingKey != null },
  { id: 'ody_thread_held', cat: 'feats', name: 'The Thread Held', icon: '🧵',
    desc: 'Carry word of the boy from the grain-ship all the way to the last water. A question asked in act one, answered in act three.',
    check: (s) => Array.isArray(s.cardLog) &&
      s.cardLog.some((r: any) => r.e === 'ody_tel_strait_word' || r.e === 'ody_tel_swineherd_door') },
  { id: 'ody_owls_own', cat: 'feats', name: 'The Owl’s Own', icon: '🪶',
    desc: 'Win a telling with Athena at twelve or more. Her hand is on every roll by then; the fire calls it luck. The fire is wrong.',
    check: (s) => s.result === 'success' && (s.athena ?? 0) >= 12 },
  { id: 'ody_last_watch', cat: 'feats', secret: true, name: 'The Last Watch', icon: '🐕',
    desc: 'Meet the old hound at the gate. However you chose, he saw you home — the first on the island to know.',
    check: (s) => Array.isArray(s.cardLog) && s.cardLog.some((r: any) => r.e === 'ody_a3_argos') },
  { id: 'ody_thumbs_knew', cat: 'feats', secret: true, name: 'The Thumbs Knew', icon: '🧺',
    desc: 'Be found by the foot-washing. Some disguises have exactly one hole, and it is shaped like childhood.',
    // ody_scar_scene is the one-voice sentinel ("the scene was told"), NOT
    // "you were caught" — the queen card's clean hide stamps it too (the
    // second audit's finding #1). Being FOUND is read from the cardLog: the
    // nurse card is a recognition on either side; the queen card's
    // keep-it-hidden side only fails on its bad (her cry half-out) and
    // incredible (you let her know, by choice) tiers.
    check: (s) => Array.isArray(s.cardLog) && s.cardLog.some((r: any) =>
      r.e === 'ody_a3_nurse_scar' ||
      (r.e === 'ody_a3_penelope' && r.s === 'right' && (r.t === 'bad' || r.t === 'incredible'))) },

  // ── The Long Game (the fire's ledger, across nights) ──
  { id: 'ody_third_question', cat: 'career', name: 'The Third Question', icon: '🏺',
    desc: 'Carry all three turnings of the prophecy. The dead answer only a bard who already knows the shape of the asking.',
    special: 'threeTurnings' },
  { id: 'ody_regular', cat: 'career', name: 'A Regular at This Fire', icon: '🔥',
    desc: 'Five nights of the long way home. The woman by the woodpile has opinions about your counting now.',
    special: 'fiveTellings' },
  { id: 'ody_repertoire', cat: 'career', name: 'The Whole Repertoire', icon: '📜',
    desc: 'Hear five different endings. Every telling is true — that is what a sea story is.',
    special: 'fiveEndings' },
  { id: 'ody_sand_count', cat: 'career', secret: true, name: 'Names in the Sand', icon: '🪦',
    desc: 'Lose forty men across your tellings. The bard names them one at a time. The sand keeps the count.',
    special: 'fortyLost' },
];

// The ledger-reading predicates (presenter.trophySpecials). Pure reads of the
// pack's meta namespace; every guard tolerates a fresh or pre-trophy save.
export const ODYSSEY_TROPHY_SPECIALS: Record<string, (meta: any) => boolean> = {
  threeTurnings: (meta) => (meta?.odyssey?.fragments || []).length >= 3,
  fiveTellings: (meta) => (meta?.odyssey?.tellings?.count || 0) >= 5,
  fiveEndings: (meta) => Object.keys(meta?.odyssey?.tellings?.byEnding || {}).length >= 5,
  fortyLost: (meta) => (meta?.odyssey?.tellings?.crewLostTotal || 0) >= 40,
};
