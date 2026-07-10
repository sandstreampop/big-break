// The Odyssey — a bard at a campfire retells the long way home.
//
// Third genre Pack on the genre-neutral engine. Design record:
// docs/games/odyssey/grill.md (the master); vocabulary CONTEXT.md; voice law
// VOICE.md + taste.mjs + GUIDING_EXAMPLES.md; visual law STYLE.md (all in
// docs/games/odyssey/). The structural spine: THE ITINERARY IS FIXED, THE
// VOYAGE IS NOT — canonical beats (the Landmarks, the Crossroads, the
// Temptations) live in the scheduled layer and occur every Telling; the deck
// only ever holds the sea between them.
//
// This file is the v1-slice-2 GREEN SKELETON: real taxonomy (3 stats, the
// Expedition + two opposed gods + Renown, Nostos/Kleos, four Fires, both
// fail states), a connective stub deck that is playable and boring ON
// PURPOSE. Landmarks (slice 3), the authored sea (slice 4), temptations
// (slice 5), and the prophecy meta-arc (slice 6) build on it.

import type { Pack, PackManifest, GameEvent, Plugin } from '../types.js';

// ── 1. Effect vocabulary ─────────────────────────────────────────────────
// Might / Guile / Lore: the three approaches to any confrontation — fight
// it, trick it, know the rite against it. The Expedition is men and timber
// as one dwindling thing; Athena and Poseidon are the poem's opposed gods;
// Renown is deeds of legend, tallied as performed.
declare module '../types.js' {
  interface Effect {
    might?: number;
    guile?: number;
    lore?: number;
    expedition?: number;
    athena?: number;
    poseidon?: number;
    renown?: number;
  }
  interface RunState {
    expedition?: number;
    athena?: number;
    poseidon?: number;
    renown?: number;
  }
}

// ── 2. The manifest ──────────────────────────────────────────────────────
const manifest: PackManifest = {
  stats: ['might', 'guile', 'lore'],
  resources: ['expedition', 'athena', 'poseidon', 'renown'],
  // Tonight's telling: three acts + finale, ~28 cards (music-length). The
  // Crossroads sits at the Act I → II boundary — immediately after the
  // Cyclops (slice 3 lands the landmark itself in that slot), because that
  // beat poses the question in play: slip away as Nobody, or shout your name.
  segments: [
    { length: 9, crossroads: true },
    { length: 10 },
    { length: 9 },
  ],
  paths: {
    nostos: {
      id: 'nostos',
      name: 'Nostos — the Homecoming',
      blurb: 'Bring them home. Every man, every hull you can hold together, and the sea left unprovoked.',
      gateLabel: 'Expedition 6 · Athena 4',
      icon: '⛵',
    },
    kleos: {
      id: 'kleos',
      name: 'Kleos — the Glory',
      blurb: 'Let the return take ten years, so long as the songs last ten centuries.',
      gateLabel: 'Renown 5',
      icon: '🌟',
    },
  },
  // Nostos leans on the Expedition preserved and the goddess earned; Kleos
  // leans on the Renown counter. ("Poseidon contained" is enforced by the
  // wrath fail state below — winGates are minimums by contract.)
  winGates: {
    nostos: { expedition: 6, athena: 4 },
    kleos: { renown: 5 },
  },
  statMeta: {
    might: { name: 'Might', icon: '⚔️' },
    guile: { name: 'Guile', icon: '🪢' },
    lore: { name: 'Lore', icon: '📜' },
    // The engine's burnout slot, reskinned: Odysseus weeping on beaches is
    // canon. When it fills, the Telling ends on a beach, quietly.
    burnout: { name: 'Despair', icon: '🌫️' },
  },
  resourceMeta: {
    expedition: { name: 'Expedition', icon: '⛵' },
    athena: { name: 'Athena', icon: '🦉' },
    poseidon: { name: 'Poseidon', icon: '🔱' },
    renown: { name: 'Renown', icon: '🌟' },
  },
  // Twelve ships out of Troy. Low Expedition is not death — it closes doors.
  resourceStart: { expedition: 12 },
  // Athena tips the final scale in the poem itself: the finale clutch.
  momentumResource: 'athena',
  // Legendary rolls make legend.
  incredibleResources: ['renown'],
  // No shop this version: boons come from the voyage, not commerce
  // (costResource deliberately unset — the probe proves the slot optional).
  // Deeds sung tonight are the bard's repertoire tomorrow.
  lpResources: ['renown'],
  // The sea takes you: Poseidon's wrath at maximum is the second fail state
  // (Despair, the universal burnout fail, is the first).
  failStates: [
    { key: 'poseidon', cmp: '>=', value: 10, ending: 'wrath' },
  ],
  // The grill's band: 35–50% standard win for a reasonable build.
  balanceBand: { successMin: 35, successMax: 50 },
};

// ── 3. The Fires (loadouts) ──────────────────────────────────────────────
// The run-start choice is WHERE YOU SING TONIGHT. Each fire grants one crisp
// visible starting effect (`modifiers` rolls into the stat roll; resource
// grants land via the fires plugin below) — run-long deck weights join in
// slice 4 with the authored sea.
const FIRES = [
  {
    id: 'kings_hall', name: 'The King’s Hall', family: 'fire', unlockedByDefault: true,
    flavor: 'They want glory. Sing the deeds loud and count the dead later.',
    quirk: { name: 'A name to live up to', desc: 'Begin the telling with Renown 2 — the hall has heard of this man.' },
    grants: { renown: 2 },
  },
  {
    id: 'fishermans_hearth', name: 'The Fisherman’s Hearth', family: 'fire', unlockedByDefault: true,
    flavor: 'They want the homecoming. Every man aboard has a wife ashore.',
    quirk: { name: 'Kind seas in the telling', desc: 'Begin with Expedition 14 — at this fire, more of them live.' },
    grants: { expedition: 2 },
  },
  {
    id: 'soldiers_camp', name: 'The Soldiers’ Camp', family: 'fire', unlockedByDefault: true,
    flavor: 'They want blood and drill and the weight of a spear told right.',
    quirk: { name: 'A soldier’s Odysseus', desc: 'Tonight he is characterized strong: Might starts 8 higher.' },
    modifiers: { might: 8 },
  },
  {
    id: 'temple_steps', name: 'The Temple Steps', family: 'fire', unlockedByDefault: true,
    flavor: 'They want the gods in every wave. Give them omens; mind your rites.',
    quirk: { name: 'The goddess attends', desc: 'Begin with Athena 2 — someone here has her ear.' },
    grants: { athena: 2 },
  },
];

// Resource grants are not loadout `modifiers` (those touch stats only), so a
// tiny pack plugin applies each fire's grant at run start. No seeded draws —
// the frozen construction order is untouched.
const firesPlugin: Plugin = {
  id: 'odyssey_fires',
  onRunStart(state) {
    const fire = FIRES.find((f) => f.id === state.loadout);
    for (const [k, v] of Object.entries(fire?.grants ?? {})) {
      (state as any)[k] = ((state as any)[k] || 0) + v;
    }
  },
};

// ── 4. The stub deck: the sea between the landmarks ──────────────────────
// Playable and boring, on purpose (slice 4 writes the real sea through the
// taste gate). Each card offers two doors; every door is one of the three
// approaches, with a shared outcome trio per approach — the three-door
// grammar in miniature, waiting for the landmarks to pay it at stakes.
type Approach = 'might' | 'guile' | 'lore';
type OutcomeTrio = GameEvent['choices']['left']['outcomes'];

const OUTCOMES: Record<Approach, OutcomeTrio> = {
  might: {
    bad: {
      text: 'Strength answers before sense. The count that evening is lighter, and the rowing is quieter.',
      effects: { might: -2, expedition: -1, burnout: 3 },
    },
    good: {
      text: 'It is done the hard way, and it holds. The men roll their shoulders and look at the next thing.',
      effects: { might: 4, burnout: 1 },
    },
    incredible: {
      text: 'It is done the way the songs will claim it was done. For once the songs will not have to lie.',
      effects: { might: 6, renown: 1 },
    },
  },
  guile: {
    bad: {
      text: 'The trick is seen through — not all the way, but far enough to cost you the evening and a jar of the good wine.',
      effects: { guile: -1, expedition: -1, burnout: 2 },
    },
    good: {
      text: 'The knot does what a sword would have, without the widows. Nobody even notices it was tied.',
      effects: { guile: 4, burnout: -1 },
    },
    incredible: {
      text: 'Years on, men will argue about how it was managed. The answer is: like that, exactly like that.',
      effects: { guile: 7, renown: 1, burnout: -2 },
    },
  },
  lore: {
    bad: {
      text: 'The rite is said wrong, or late, or to the wrong power. Far down, something takes note of the debt.',
      effects: { lore: -1, poseidon: 1, burnout: 3 },
    },
    good: {
      text: 'The old words in the old order. The sea keeps its face, and the men sleep without dreams.',
      effects: { lore: 4, athena: 1, burnout: -2 },
    },
    incredible: {
      text: 'The offering goes down and the water goes quiet the way a hall goes quiet when a king stands.',
      effects: { lore: 6, athena: 2, burnout: -3 },
    },
  },
};

// A riskier read of the same approaches for the cards that court the deep:
// worse bads (the sea notices), renown on the highs.
const OUTCOMES_RISKY: Record<Approach, OutcomeTrio> = {
  might: {
    bad: {
      text: 'The sea does not wrestle. Two benches are empty at the next count, and no one says the names loudly.',
      effects: { might: -2, expedition: -2, poseidon: 1, burnout: 4 },
    },
    good: {
      text: 'You hold it by main strength until it stops needing to be held. The men start breathing again.',
      effects: { might: 5, renown: 1, burnout: 1 },
    },
    incredible: {
      text: 'Men who were praying at midnight are singing by the middle watch. Rowers not yet born will claim they were there.',
      effects: { might: 6, renown: 2 },
    },
  },
  guile: {
    bad: {
      text: 'Too clever by half, and the half is billed at once — in stores, in trust, in a night nobody sleeps.',
      effects: { guile: -2, expedition: -2, burnout: 4 },
    },
    good: {
      text: 'The gamble lands soft. What it cost stays between you and the man who carried the rope.',
      effects: { guile: 5, renown: 1 },
    },
    incredible: {
      text: 'It should not have worked. That is the whole of why it will be sung.',
      effects: { guile: 6, renown: 2 },
    },
  },
  lore: {
    bad: {
      text: 'You read the omen the way you wanted it to read. The gulls knew better and left at noon.',
      effects: { lore: -2, poseidon: 1, expedition: -1, burnout: 3 },
    },
    good: {
      text: 'The warning is heeded an hour before it would have been a lesson. The men never learn what they missed.',
      effects: { lore: 5, athena: 1, renown: 1 },
    },
    incredible: {
      text: 'The gods speak once, sideways, through a wine cup and a wind shift — and tonight, you catch it whole.',
      effects: { lore: 6, athena: 2, renown: 1 },
    },
  },
};

function seaCard(id: string, act: number | number[], opts: {
  prompt: string; recap: string;
  left: { label: string; approach: Approach };
  right: { label: string; approach: Approach };
  risky?: boolean;
}): GameEvent {
  const pool = opts.risky ? OUTCOMES_RISKY : OUTCOMES;
  return {
    id,
    act,
    prompt: opts.prompt,
    recap: opts.recap,
    choices: {
      left: {
        label: opts.left.label,
        tags: ['sea', opts.left.approach],
        governingStats: { [opts.left.approach]: 1 },
        outcomes: pool[opts.left.approach],
      },
      right: {
        label: opts.right.label,
        tags: ['sea', opts.right.approach],
        governingStats: { [opts.right.approach]: 1 },
        outcomes: pool[opts.right.approach],
      },
    },
  };
}

// #region deck
const EVENTS: GameEvent[] = [
  // ── Act I — The Sack and the Sea ──
  seaCard('ody_a1_cicones', 1, {
    prompt: 'Ismaros burns behind you, and the men want one more day of it — the wine is found, the cattle are fat, and the hill tribes are, they insist, far away.',
    recap: 'The men lingered at Ismaros.',
    left: { label: 'Drag them to the ships', approach: 'might' },
    right: { label: 'One day — posted watches', approach: 'guile' },
    risky: true,
  }),
  seaCard('ody_a1_squall', 1, {
    prompt: 'The wind backs at dusk — one cold breath out of the north, and the sea goes the colour of a bruise. Old Perimedes is lashing the jars without being told.',
    recap: 'A squall came down at dusk.',
    left: { label: 'Run before it', approach: 'might' },
    right: { label: 'Give the sea its due', approach: 'lore' },
    risky: true,
  }),
  seaCard('ody_a1_lotus_shore', 1, {
    prompt: 'A soft country, and three men sent for water come back slow-eyed and smiling, with flowers in their fists and no memory of the ships.',
    recap: 'Three men tasted the lotus.',
    left: { label: 'Carry them back bound', approach: 'might' },
    right: { label: 'Trade for safe passage', approach: 'guile' },
  }),
  seaCard('ody_a1_omen', 1, {
    prompt: 'At first light, birds cross the fleet right to left — nine of them, then one, and the one is an owl, which does not fly by day.',
    recap: 'An owl crossed the fleet by day.',
    left: { label: 'Read it for the men', approach: 'lore' },
    right: { label: 'Call it a bird', approach: 'guile' },
  }),
  seaCard('ody_a1_ration', 1, {
    prompt: 'The seed-grain jars stand between the men and short rations, and Eurylochos is doing the arithmetic aloud, which never helps.',
    recap: 'The ration argument.',
    left: { label: 'Set the ration yourself', approach: 'might' },
    right: { label: 'Recount the stores at night', approach: 'guile' },
  }),
  seaCard('ody_a1_wake_dead', 1, {
    prompt: 'A man from Ismaros dies of his wound in the night, the first since Troy, and the crew watch how their captain buries him.',
    recap: 'The first burial of the voyage.',
    left: { label: 'Full rites, half a day', approach: 'lore' },
    right: { label: 'A soldier’s cairn, then oars', approach: 'might' },
  }),
  seaCard('ody_a1_race', 1, {
    prompt: 'Nestor’s son races you for the honor of first wake out of the roads, his rowers grinning across the water at yours.',
    recap: 'A race out of the roads.',
    left: { label: 'Row them down', approach: 'might' },
    right: { label: 'Cut inside the shoal line', approach: 'guile' },
  }),
  seaCard('ody_a1_stranger', 1, {
    prompt: 'A castaway on a spar, half-dead, salt-white — and wearing, when you look twice, a guest-gift armband from a house that owes yours.',
    recap: 'A castaway with a guest-debt.',
    left: { label: 'Honor the old bond', approach: 'lore' },
    right: { label: 'Question him first', approach: 'guile' },
  }),
  seaCard('ody_a1_wind_gate', 1, {
    prompt: 'The cape the pilots call the Gate stands white-fanged at the tide’s turn. Beyond it, the short way. Around it, three days.',
    recap: 'The Gate at the tide’s turn.',
    left: { label: 'Take the Gate at slack', approach: 'lore' },
    right: { label: 'Pull the long way round', approach: 'might' },
    risky: true,
  }),
  seaCard('ody_a1_feast', 1, {
    prompt: 'Landfall on a kind island, goats on the hills, and the men look at you with one question in forty faces: tonight, may they be men and not oars?',
    recap: 'A feast asked for, and answered.',
    left: { label: 'Feast them properly', approach: 'guile' },
    right: { label: 'Feast — but pour to the gods first', approach: 'lore' },
  }),
  seaCard('ody_a1_gear', 1, {
    prompt: 'The third ship’s mast is sprung — it will hold in fair weather, and the fair weather is ending, and the carpenter wants a day you do not have.',
    recap: 'The sprung mast.',
    left: { label: 'Fish it with spare oars', approach: 'guile' },
    right: { label: 'Give the carpenter his day', approach: 'might' },
  }),
  seaCard('ody_a1_lookout', 1, {
    prompt: 'Smoke on the horizon at dusk: one thread of it, tended, deliberate. The charts say the island is empty. The smoke says the charts are wrong.',
    recap: 'Smoke where the chart said empty.',
    left: { label: 'Stand in and see', approach: 'might' },
    right: { label: 'Stand off till morning', approach: 'lore' },
  }),

  // ── Act II — Witches and the Dead ──
  seaCard('ody_a2_bag_winds', 2, {
    prompt: 'The king of the winds has given you a gift, oxhide and silver-corded, and the men have decided among themselves that it is treasure, and that you are keeping it from them.',
    recap: 'The men eyed the oxhide bag.',
    left: { label: 'Show them what it is', approach: 'guile' },
    right: { label: 'Sleep on it, literally', approach: 'might' },
    risky: true,
  }),
  seaCard('ody_a2_harbor', 2, {
    prompt: 'A harbor like a stone purse, one narrow mouth, cliffs all round — the whole fleet could shelter in it, and the whole fleet could be trapped in it.',
    recap: 'The purse-mouthed harbor.',
    left: { label: 'Moor outside, alone', approach: 'lore' },
    right: { label: 'Bring them all in', approach: 'might' },
    risky: true,
  }),
  seaCard('ody_a2_swine', 2, {
    prompt: 'Half the shore party has not come back from the house in the clearing, and the one who ran says the word “pigs” four times and will not say more.',
    recap: 'The house in the clearing.',
    left: { label: 'Go up with sword drawn', approach: 'might' },
    right: { label: 'Go up with the moly rite', approach: 'lore' },
    risky: true,
  }),
  seaCard('ody_a2_year_isle', 2, {
    prompt: 'A year can pass on a kind island the way an afternoon passes at anchor. Polites says, gently, that the men have started naming the goats.',
    recap: 'The men named the goats.',
    left: { label: 'Sail with the next moon', approach: 'lore' },
    right: { label: 'Sail at dawn, no debate', approach: 'might' },
  }),
  seaCard('ody_a2_mutiny_talk', 2, {
    prompt: 'Eurylochos has been talking at the water barrel again — about captains, and choices, and how many men Troy cost against how many the sea has.',
    recap: 'Water-barrel talk.',
    left: { label: 'Face him down before all', approach: 'might' },
    right: { label: 'Give him the helm a day', approach: 'guile' },
  }),
  seaCard('ody_a2_fog', 2, {
    prompt: 'Fog for three days, white as wool, and the steering is by sound: the creak of your own fleet, and under it, sometimes, a creak that is not your fleet.',
    recap: 'Three days of wool-white fog.',
    left: { label: 'Silence — run dark', approach: 'guile' },
    right: { label: 'Horns and torches', approach: 'might' },
  }),
  seaCard('ody_a2_offering', 2, {
    prompt: 'The wine for the gods is down to one amphora — the good one, the Ismaros vintage — and tonight wants a libation more than any night of the voyage.',
    recap: 'The last of the good wine.',
    left: { label: 'Pour it all', approach: 'lore' },
    right: { label: 'Pour half, hide half', approach: 'guile' },
  }),
  seaCard('ody_a2_widow_ship', 2, {
    prompt: 'The seventh ship has more empty benches than manned ones now. Her rowers ask to be spread among the fleet, and her keel given to the fire.',
    recap: 'The seventh ship’s last night.',
    left: { label: 'Burn her with honors', approach: 'lore' },
    right: { label: 'Tow her — timber is timber', approach: 'guile' },
  }),
  seaCard('ody_a2_siren_rumor', 2, {
    prompt: 'A trading crew, passed at oar-length, will not speak — every man of them points at his own ears and then at the horizon you are steering for.',
    recap: 'The traders pointed at their ears.',
    left: { label: 'Buy their story with wine', approach: 'guile' },
    right: { label: 'Note it and hold course', approach: 'might' },
  }),
  seaCard('ody_a2_dead_calm', 2, {
    prompt: 'No wind for six days. The men row until their hands open, and the water is so flat it shows them their own faces doing it.',
    recap: 'Six days of dead calm.',
    left: { label: 'Row through the nights too', approach: 'might' },
    right: { label: 'Rest them; whistle old prayers', approach: 'lore' },
  }),
  seaCard('ody_a2_black_goat', 2, {
    prompt: 'The rite ahead wants a black goat and honey and barley, and the fleet has a brown goat, no honey, and a man who swears substitutions are permitted.',
    recap: 'The brown-goat question.',
    left: { label: 'Do it exactly or not at all', approach: 'lore' },
    right: { label: 'The gods grade intent', approach: 'guile' },
    risky: true,
  }),
  seaCard('ody_a2_night_landing', 2, {
    prompt: 'A shore of lights at midnight — houses, harbors, help — and every pilot aboard says the same word: wreckers.',
    recap: 'The wreckers’ lights.',
    left: { label: 'Stand off, cold and hungry', approach: 'lore' },
    right: { label: 'Land where the lights are not', approach: 'guile' },
  }),

  // ── Act III — The Narrow Way ──
  seaCard('ody_a3_wax', 3, {
    prompt: 'The wax is soft, the rope is coiled, and the men are pretending not to watch you decide whether their captain hears what no man has heard and lived.',
    recap: 'Wax, rope, and a decision.',
    left: { label: 'Ears open, body bound', approach: 'might' },
    right: { label: 'Wax for every man', approach: 'lore' },
    risky: true,
  }),
  seaCard('ody_a3_strait', 3, {
    prompt: 'The strait breathes — six heads on one side, a swallowing mouth on the other, and a channel between them the width of a held breath.',
    recap: 'The breathing strait.',
    left: { label: 'Hug the cliff and pay', approach: 'lore' },
    right: { label: 'Race the middle', approach: 'might' },
    risky: true,
  }),
  seaCard('ody_a3_sun_isle', 3, {
    prompt: 'The island of the Sun is green and loud with cattle, and the wind that keeps you beached there does not smell like weather. It smells like a test.',
    recap: 'Beached with the Sun’s cattle.',
    left: { label: 'Oath the men: fish only', approach: 'lore' },
    right: { label: 'Leave in the wind’s teeth', approach: 'might' },
    risky: true,
  }),
  seaCard('ody_a3_raft', 3, {
    prompt: 'What the sea has left you fits on a raft you lash yourself, plank by plank, counting knots out loud because there is no one else to count to.',
    recap: 'The raft, knot by knot.',
    left: { label: 'Build for speed', approach: 'guile' },
    right: { label: 'Build to survive', approach: 'might' },
  }),
  seaCard('ody_a3_nausicaa', 3, {
    prompt: 'You wake salt-flayed on a river mouth to the sound of girls at laundry, and the first face of your last kingdom before home is a princess deciding whether to run.',
    recap: 'The princess at the river.',
    left: { label: 'The suppliant’s words, exactly', approach: 'lore' },
    right: { label: 'Charm — carefully', approach: 'guile' },
  }),
  seaCard('ody_a3_disguise', 3, {
    prompt: 'Ithaca at last — and Ithaca must not know. The beggar’s cloak itches, and every stone of the road to your own door asks whether you can bear to be pitied on it.',
    recap: 'A beggar on his own road.',
    left: { label: 'Play it to the hilt', approach: 'guile' },
    right: { label: 'Test the old dog’s memory', approach: 'lore' },
  }),
  seaCard('ody_a3_swineherd', 3, {
    prompt: 'The swineherd feeds a ragged stranger from his own bowl and talks, unprompted, about the master he still sets a place for. You could tell him now.',
    recap: 'The swineherd’s loyalty.',
    left: { label: 'Hold the disguise', approach: 'guile' },
    right: { label: 'Give him a true omen', approach: 'lore' },
  }),
  seaCard('ody_a3_hall_watch', 3, {
    prompt: 'From the beggar’s bench you count them: one hundred and eight suitors, eating your herds, courting your wife, and not one of them able to string your bow. Probably.',
    recap: 'Counting suitors from the bench.',
    left: { label: 'Mark the doors and blades', approach: 'guile' },
    right: { label: 'Test one with an insult', approach: 'might' },
  }),
  seaCard('ody_a3_penelope', 3, {
    prompt: 'The queen interviews the beggar by firelight about the husband he claims to have met, and her questions are so exact that lying to her is a kind of truth.',
    recap: 'The queen’s exact questions.',
    left: { label: 'Give her a coded truth', approach: 'guile' },
    right: { label: 'Keep the scar hidden', approach: 'lore' },
  }),
  seaCard('ody_a3_bow_night', 3, {
    prompt: 'The night before the contest, the great bow lies in its case like a question. Hands remember, or they do not. There is one way to know and no private place to know it.',
    recap: 'The bow in its case.',
    left: { label: 'Trust the hands', approach: 'might' },
    right: { label: 'Walk the hall instead', approach: 'guile' },
  }),
  seaCard('ody_a3_old_dog', 3, {
    prompt: 'On a dung heap by the gate, a dog too old to stand lifts his head at your step — Argos, who you trained, who knows you through the rags, whose tail is the only welcome that cannot be faked.',
    recap: 'Argos knew you first.',
    left: { label: 'Walk past — the disguise holds', approach: 'guile' },
    right: { label: 'One word, for him alone', approach: 'lore' },
  }),
  seaCard('ody_a3_signs', 3, {
    prompt: 'Thunder from a clear sky, a servant’s chance words, a sneeze at the naming of vengeance — the house is thick with signs, if you are the kind of man who reads them.',
    recap: 'The house filled with signs.',
    left: { label: 'Read them all; act tonight', approach: 'lore' },
    right: { label: 'Signs are not a plan', approach: 'might' },
  }),
];
// #endregion deck

// ── 5. The pack ──────────────────────────────────────────────────────────
export const odysseyPack: Pack = {
  id: 'odyssey',
  manifest,
  plugins: [firesPlugin],
  events: EVENTS,
  tutorialEvents: [],
  loadouts: FIRES,
  loadoutById: (lid) => FIRES.find((f) => f.id === lid) ?? null,
  presenter: {
    aboutLine: 'The Odyssey — the long way home, sung at your fire.',
    title: {
      logo: 'THE<br>ODYSSEY',
      taglines: [
        'The itinerary is fixed. The voyage is not.',
        'Every telling is true. That is what a sea story is.',
        'You know where it ends. You do not know how.',
        'The sea does not forget.',
      ],
      glyphs: ['⛵', '🔱', '🦉', '🏺'],
    },
    actWord: 'ACT',
    actNames: ['', 'The Sack and the Sea', 'Witches and the Dead', 'The Narrow Way'],
    actIntro: {
      1: {
        name: 'The Sack and the Sea',
        text: 'Twelve ships out of Troy, friends — riding low, heavy with bronze and with men who had lived, every rower pulling for a wife who had learned to run a farm without him. And listen how the water was, that first week: easy, foam like combed wool, the kind of sea that makes a captain generous at supper. That is the sea’s oldest trick. It shows you your harbour in your mind’s eye. Then it asks your name.',
      },
      2: {
        name: 'Witches and the Dead',
        text: 'Throw on a branch; the tale goes narrow here. The islands stop being places a chart would admit to, and the dangers stop being weather. What is left of the fleet sails into waters where the right word matters more than the strong arm — and where the wrong word is very, very easy to say.',
      },
      3: {
        name: 'The Narrow Way',
        text: 'Now the fire burns low, friends, and I will sing softer, because the last sea is a corridor with teeth on both walls, and beyond it — home, wearing a stranger’s face. Everything he still has fits in one hull. Everything he wants is one island further than the sea would like.',
      },
    },
    crossroads: {
      head: 'The name in your mouth',
      sub: 'The prow is out of stone-throw, and the bard leans in: does this telling row for home, or for the song? Homecoming counts hulls and keeps the sea unprovoked; glory is bought in deeds and paid for in wrath.',
    },
    endings: {
      nostos: {
        success: {
          title: 'The Bed of Living Oak',
          text: 'So the bow speaks, the hall is washed, and the queen tests him with the bed no man could move — and he answers like a carpenter, which is how she knows her husband. Ships came home. Men came home. That is the ending everyone pays for, friends. And still, some nights, he wakes before first light and goes down to stand on the shingle, and does not go into the water. The sea does not forget. There is a truer ending than this one. I do not have all of it. Yet.',
        },
        partial: {
          title: 'Home, and Unrecognized',
          text: 'He reaches Ithaca — hear me, he does reach it — but thinner than the prophecy promised: hulls short, men short, the goddess looking elsewhere. The dog knows him. The swineherd knows him. The house takes longer, and some of it never quite believes, and at feasts for years there is an empty-chair silence where a name used to sit. A homecoming, friends. Not the homecoming.',
        },
        failure: {
          title: 'The Harbor Light, Seen Once',
          text: 'They saw the home-fires, friends — I will not soften it — saw the smoke of Ithaca rise over the water, close enough to name the hilltops. What happened then belongs to the sea that did it. The telling ends with the light on the water going out, and the long way home becoming, quietly, the way.',
        },
      },
      kleos: {
        success: {
          title: 'The Song That Outlives the Sea',
          text: 'He comes home with less than he sailed with and more than any king alive: the name. Shouted at giants, carved into the war’s ending, carried by every crew that passes a certain cave and rows a little faster. At the feast they ask him to tell it himself, and he stands, and the hall goes quiet the way the sea never did for him. That quiet is the prize, friends. Ask him at the shingle, some mornings, what it cost.',
        },
        partial: {
          title: 'Famous to Strangers',
          text: 'The song arrives home before the man, and does better there than he does. In halls he will never see, his deeds are sung with the details wrong and the name right. On Ithaca, where it matters, they know the name and squint at the face. Glory, friends, is a coin that spends best far from where it was minted.',
        },
        failure: {
          title: 'A Verse in Someone Else’s Song',
          text: 'The deeds were done — some of them, nearly — but a song needs a shape, and the voyage broke apart before it took one. What survives is a verse here, a boast there, a name in a list of captains. The bards of Smyrna sing it flat, friends, and there is no one left with standing to correct them.',
        },
      },
      wrath: {
        title: 'The Sea Takes Its Answer',
        text: 'The name was shouted at the water once too often, friends, and the sea is patient the way stone is patient. Far down, where the light gives up, the debt is called in whole. The fire is low. That is on purpose. We do not sing the last wave. We sing that the gulls were the only mourners, and that they mourned in their fashion — which is to say, they wheeled once, and went to look at other water.',
      },
      burnout: {
        title: 'The Beach at the End of Rowing',
        text: 'There is a beach — on Ogygia, on Aeaea, on any of them — where a man can sit down with his back to a rock and stop. Not die. Stop. The tide fills his footprints and he does not make new ones. Some men are not lost at sea, friends. The sea just outlasts them. We leave him there tonight, looking at the water. If you want him to stand up, come back tomorrow, and pay the bard, and we will see what can be done.',
      },
    },
    loadoutPicker: {
      head: 'Where do you sing tonight?',
      sub: 'Four fires want the same story told four ways. The crowd shapes the telling.',
    },
  },
};
