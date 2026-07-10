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

import { actLength } from '../engine.js';
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

// ── 3b. The itinerary (slice 3): the fixed beats of every Telling ────────
// The producers-plugin pattern (love-island), minus the shop logic: outside
// its window a Landmark never enters the pool; when the window opens, the
// pool narrows to the Landmark's eligible variants (requires-gated — which
// doors open depends on the voyage that got you there). Resolving any
// variant closes the beat. The Suitors' Hall needs no window: it is the
// finale itself (per-path finaleCard climaxes + the finalSet three doors).
const BEATS: { key: string; act: number }[] = [
  { key: 'cyclops', act: 1 },    // the run's defining scar, at the act's end
  { key: 'underworld', act: 2 }, // Tiresias, at the act's end
];
const beatTag = (ev: GameEvent) => (ev.tags || []).find((t) => t.startsWith('beat:'));

const itineraryPlugin: Plugin = {
  id: 'odyssey_itinerary',
  refineDeck(state, pool) {
    const beats = pool.filter((e) => beatTag(e));
    const rest = pool.filter((e) => !beatTag(e));
    const len = actLength(state, state.act);
    for (const b of BEATS) {
      if (b.act > state.act) continue;
      if (state.flags.includes(`ody_done_${b.key}`)) continue;
      // The Landmark takes the act's LAST slot; an earlier act's unfired
      // Landmark is due immediately (roll-forward — delayed, never lost).
      const at = b.act < state.act ? 0 : len - 1;
      if ((state.cardsPlayedInAct || 0) < at) continue;
      const hit = beats.filter((e) => beatTag(e) === `beat:${b.key}`);
      if (hit.length) return hit;
    }
    return rest.length ? rest : pool;
  },
  afterResolve(state, _result, cardCtx) {
    const tag = cardCtx.ev && beatTag(cardCtx.ev);
    if (tag) {
      const flag = `ody_done_${tag.slice(5)}`;
      if (!state.flags.includes(flag)) state.flags.push(flag);
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


// ── 4b. The Landmarks (slice 3): the itinerary's fixed beats ─────────────
// Guaranteed act-boundary set-pieces, never in the deck's random flow. The
// three-door grammar at real stakes; the variants are requires-gated, so
// which doors open depends on the voyage that got you there. Chains overrun
// the act length by design (advance() honors pendingChainId first) — the
// Crossroads lands immediately after the Cyclops chain, as the grill demands.
const LANDMARKS: GameEvent[] = [
  // ── LANDMARK I: THE CYCLOPS ──
  {
    id: 'ody_cyclops',
    act: 1,
    tags: ['landmark', 'beat:cyclops'],
    context: 'The cave — Landmark',
    prompt: 'The cave smells of curds, and under that of something older and worse. The sheep come home at dusk by themselves, sure of the path, and then the light at the cave mouth goes out all at once — not a cloud. A stone. A stone the size of your ship, set in the doorway the way you would set a cup on a table. Whatever shepherds here has just shut you in with it.',
    recap: 'The stone closed the cave.',
    choices: {
      left: {
        label: 'Be Nobody',
        tags: ['landmark', 'guile'],
        governingStats: { guile: 1 },
        outcomes: {
          bad: { text: '“Nobody,” you say — but Polites, loyal to the last fault, says your true name in his sleep, half of it, before a hand finds his mouth. The eye opens. The eye searches. The wine does its work at last, but the night costs you men before it does.', effects: { guile: 2, expedition: -2, burnout: 4, chainEventId: 'ody_cyclops_escape' } },
          good: { text: '“Nobody is my name — my father called me Nobody; my mother; all my friends.” And the eye, wet and huge as a shield-boss, believes you, and the wine does the rest. Later, howling in the dark, he tells his brothers that Nobody is hurting him — and his brothers go back to bed, grumbling about the noise.', effects: { guile: 6, renown: 1, chainEventId: 'ody_cyclops_escape' } },
          incredible: { text: 'You fill the bowl a third time and the third time is the one that counts. He sleeps with the bowl in his fist. The stake is olive-wood, fire-hard, and six men lift what one man should not; what happened then, I will not sing at this fire. In the morning the sheep went out unshepherded.', effects: { guile: 8, renown: 2, chainEventId: 'ody_cyclops_escape' } },
        },
      },
      right: {
        label: 'Claim the guest-right',
        tags: ['landmark', 'lore'],
        governingStats: { lore: 1 },
        outcomes: {
          bad: { text: 'You name the gods and the law of the guest, and the laugh comes down like rocks going down a hill: the Cyclopes were old, he says, before the gods learned their own names. What he did then, I will not sing at this fire. The count that night was two short, and no one said the names loudly.', effects: { lore: -1, expedition: -2, burnout: 5, chainEventId: 'ody_cyclops_escape' } },
          good: { text: 'The old words buy time, if not mercy — he wants to hear the rest of the rite before he decides what you are, the way a man lets a fly walk his arm out of curiosity. Time is what the wine needs. Time is what the stake needs. You keep talking.', effects: { lore: 5, chainEventId: 'ody_cyclops_escape' } },
          incredible: { text: 'You speak the guest-law like a man laying tiles, one word set against the next, and something older than the giant listens through him: he pens you living, for later. And “later” is a door with a whole night behind it. The rite did not save you, friends. It sold you the night, and you spent it well.', effects: { lore: 7, athena: 1, chainEventId: 'ody_cyclops_escape' } },
        },
      },
    },
  },
  {
    id: 'ody_cyclops_strong',
    act: 1,
    tags: ['landmark', 'beat:cyclops'],
    // The Might door favors the voyage that kept its strength: high Might,
    // or an Expedition still at full sail by the act's end (it starts at 12
    // and the first sea usually takes a bite — holding 12 IS the feat).
    requires: { anyOf: [{ min: { might: 55 } }, { min: { expedition: 12 } }] },
    context: 'The cave — Landmark',
    prompt: 'The stone closes the cave like a cup set over a fly, and your men — you still have men, a full company of them, spears and all — look from the sleeping bulk by the fire to you. Full strength changes the arithmetic. It does not change the stone.',
    recap: 'The stone closed the cave.',
    choices: {
      left: {
        label: 'Put spears to him in his sleep',
        tags: ['landmark', 'might'],
        governingStats: { might: 1 },
        outcomes: {
          bad: { text: 'Six of you drive the point — and it is Polites, hands still on the shaft, who says the thing that stops yours: the stone. The stone only he can lift. Kill him and the cave keeps you all. You stop. Above you, the eye opens.', effects: { might: -2, expedition: -2, burnout: 5, chainEventId: 'ody_cyclops_escape' } },
          good: { text: 'The spears go in far enough to teach, not far enough to orphan you all behind the stone — a soldier’s answer, measured to a hair, and the roar brings half the mountain awake. He knows now that the little things bite. It buys the wine its welcome.', effects: { might: 5, renown: 1, chainEventId: 'ody_cyclops_escape' } },
          incredible: { text: 'It is not the wound that does it; it is the drill. Forty men moving as one thing in the dark, at a whisper, in order — he has never seen order, friends. He backs to his own wall and watches you the way men watch weather. By the small hours he is glad to bargain: the stone, for silence.', effects: { might: 7, renown: 2, chainEventId: 'ody_cyclops_escape' } },
        },
      },
      right: {
        label: 'Be Nobody',
        tags: ['landmark', 'guile'],
        governingStats: { guile: 1 },
        outcomes: {
          bad: { text: '“Nobody,” you say — but a full company is a loud instrument, and someone’s bronze rings on stone at the wrong moment. The eye opens. The eye searches. The wine works at last, but the night costs you before it does.', effects: { guile: 2, expedition: -2, burnout: 4, chainEventId: 'ody_cyclops_escape' } },
          good: { text: '“Nobody is my name.” The eye believes you. The wine does the rest, and the stake does what the stake does; his brothers, brought by the howling, are told that Nobody is to blame — and go home grumbling about the noise.', effects: { guile: 6, renown: 1, chainEventId: 'ody_cyclops_escape' } },
          incredible: { text: 'The name is the trap and the wine is the spring, and a full company makes the work quick and quiet both. Three bowls, one stake, no second guesses. In the morning the sheep went out unshepherded, and under three of them went something the sheep did not remark on.', effects: { guile: 8, renown: 2, chainEventId: 'ody_cyclops_escape' } },
        },
      },
    },
  },
  {
    id: 'ody_cyclops_escape',
    act: 1,
    chainOnly: true,
    tags: ['landmark'],
    context: 'The cave mouth — dawn',
    prompt: 'Dawn, and the stone rolls back for the flock — and for whatever leaves with the flock. He sits in the doorway now, hands out, reading everything that passes. The rams are heavy-fleeced and walk slow. The choice is under them, or through him.',
    recap: 'Out with the flock, or through the door.',
    choices: {
      left: {
        label: 'Under the rams',
        tags: ['landmark', 'guile'],
        governingStats: { guile: 1 },
        outcomes: {
          bad: { text: 'The biggest ram — your ram — stops in the doorway, and the great hands come down and hold it, and he talks to it, friends. Gently. About the noise in the night. The fleece over your knuckles is all the world. Then the ram walks on, and you learn what your own breath tastes like, held that long.', effects: { guile: 2, burnout: 3, chainEventId: 'ody_cyclops_name' } },
          good: { text: 'Wool in both fists, a beam of morning under a beast’s belly, and the hands passing over the fleece a palm above your spine. Man by man the flock walks your company out into the light. Count them on the shingle: all that the cave left you. All of them out.', effects: { guile: 5, chainEventId: 'ody_cyclops_name' } },
          incredible: { text: 'He talks to the last ram — the one carrying you. Asks it why it leaves last, that always led. And you hang there in the wool while the answer he wants does not come, and the answer he does not want breathes under his hands, and holds. When the ram walks on, it carries the whole telling out on its back.', effects: { guile: 7, renown: 1, chainEventId: 'ody_cyclops_name' } },
        },
      },
      right: {
        label: 'Rush the gap',
        tags: ['landmark', 'might'],
        governingStats: { might: 1 },
        outcomes: {
          bad: { text: 'Speed against reach, and reach is older. The hands find the rearguard — I will not sing what the hands do — and the shingle takes the rest of you at a dead sprint, and the sea has never looked so much like mercy.', effects: { might: 2, expedition: -2, burnout: 5, chainEventId: 'ody_cyclops_name' } },
          good: { text: 'You go on the flock’s heels, in the beasts’ own dust, forty men running low and silent through a blind giant’s legs — and the morning is suddenly enormous around you, and the ships are where ships should be, and the men are laughing before they are done being afraid.', effects: { might: 5, chainEventId: 'ody_cyclops_name' } },
          incredible: { text: 'You go last, friends — captain at the rear, walking backward, watching the hands the whole way out. The men will tell it for years as the coolest thing they ever saw a frightened man do. The prow takes you all; the sea takes the prow; behind you the doorway howls at its own emptiness.', effects: { might: 7, renown: 1, chainEventId: 'ody_cyclops_name' } },
        },
      },
    },
  },
  {
    id: 'ody_cyclops_name',
    act: 1,
    chainOnly: true,
    tags: ['landmark'],
    context: 'The prow — out of stone-throw',
    prompt: 'The prow is out of stone-throw. Behind you the blind giant wades to his waist, feeling for you across the water. Eurylochos has your cloak in his fist and his voice is very low. The name is in your mouth like a coal.',
    recap: 'The name, swallowed or shouted.',
    // The name-brag is a CHOICE, not a roll — the tier is scripted so the
    // consequence is the player's own, every time. The Crossroads reads it.
    forceTier: { left: 'good', right: 'good' },
    choices: {
      left: {
        label: 'Swallow it',
        tags: ['landmark', 'guile'],
        governingStats: { guile: 1 },
        outcomes: {
          bad: { text: 'You say nothing. The men row. The name goes down with the anchor-stone, somewhere it can never be shouted from, and the giant is still calling Nobody, Nobody to the gulls when the island drops under the rim of the sea.', effects: { addFlag: 'ody_nobody' } },
          good: { text: 'You say nothing. The men row. The name goes down with the anchor-stone, somewhere it can never be shouted from, and the giant is still calling Nobody, Nobody to the gulls when the island drops under the rim of the sea.', effects: { addFlag: 'ody_nobody' } },
          incredible: { text: 'You say nothing. The men row. The name goes down with the anchor-stone, somewhere it can never be shouted from, and the giant is still calling Nobody, Nobody to the gulls when the island drops under the rim of the sea.', effects: { addFlag: 'ody_nobody' } },
        },
      },
      right: {
        label: 'Shout it at the sea',
        tags: ['landmark', 'might'],
        governingStats: { might: 1 },
        outcomes: {
          bad: { text: 'You cup your hands and give him the name — whole, father and city and all, so the world will know who did this. The men stop rowing. Far under the keel, something that was not listening before begins to listen.', effects: { renown: 2, poseidon: 3, addFlag: 'ody_named' } },
          good: { text: 'You cup your hands and give him the name — whole, father and city and all, so the world will know who did this. The men stop rowing. Far under the keel, something that was not listening before begins to listen.', effects: { renown: 2, poseidon: 3, addFlag: 'ody_named' } },
          incredible: { text: 'You cup your hands and give him the name — whole, father and city and all, so the world will know who did this. The men stop rowing. Far under the keel, something that was not listening before begins to listen.', effects: { renown: 2, poseidon: 3, addFlag: 'ody_named' } },
        },
      },
    },
  },

  // ── LANDMARK II: THE UNDERWORLD ──
  {
    id: 'ody_underworld',
    act: 2,
    tags: ['landmark', 'beat:underworld'],
    context: 'The edge of the world — Landmark',
    prompt: 'There is a shore where the sun does not so much set as give up. You beach the ship on grey sand that holds no footprints, dig the trench as the witch taught, and pour the honey, the milk, the wine, the barley, the blood. The dead come quietly, in no hurry, the way the poor come to a door they know will open.',
    recap: 'The trench, the blood, the dead.',
    choices: {
      left: {
        label: 'The rite, exactly',
        tags: ['landmark', 'lore'],
        governingStats: { lore: 1 },
        outcomes: {
          bad: { text: 'The words are right and the order is right, and still a shade you know steps out of the crowd — a rower, one of yours, unburied on a witch’s roof and salt-eyed about it. The prophet must wait while you promise a dead man his fire and his oar. You mean it. The meaning costs.', effects: { lore: 3, burnout: 4, chainEventId: 'ody_tiresias' } },
          good: { text: 'Exact, friends — the trench a cubit square, the blood black in the grey light, the sword out to keep the crowding dead from drinking before the prophet does. They mass at the edge like starlings before weather. And through them, leaning on a golden staff, comes the blind man who sees.', effects: { lore: 5, athena: 1, chainEventId: 'ody_tiresias' } },
          incredible: { text: 'So exact that the dead grow respectful — they saw rites done living, and know good work when it feeds them. His own mother is in that crowd, friends. I will not sing that meeting, except to say the sword stays steady over the trench until the prophet has drunk — which is the hardest thing in the whole poem.', effects: { lore: 7, athena: 2, chainEventId: 'ody_tiresias' } },
        },
      },
      right: {
        label: 'Hold the dead from the blood',
        tags: ['landmark', 'might'],
        governingStats: { might: 1 },
        outcomes: {
          bad: { text: 'A sword is a poor argument with the bodiless. They part around the blade like smoke around a post, and by the time the prophet comes the trench is half-drunk, and his voice is thin — some of tonight’s answers stayed in the shades that got there first.', effects: { might: 2, burnout: 4, chainEventId: 'ody_tiresias' } },
          good: { text: 'You stand over the trench the way you stood over wounded men at Troy, and the dead respect the stance if not the steel. They wait. Down the grey shore comes the staff-tap of the prophet, unhurried. The blood is whole for him, and whole blood buys whole answers.', effects: { might: 5, chainEventId: 'ody_tiresias' } },
          incredible: { text: 'The dead of Troy know that stance, friends. Some of them made it, standing beside you. The crowd at the trench parts on its own — old soldiers keeping order in the oldest queue there is — and one shade you fought beside holds the line with you, spear of smoke at the ready, until the prophet has drunk his fill.', effects: { might: 6, renown: 1, chainEventId: 'ody_tiresias' } },
        },
      },
    },
  },
  {
    id: 'ody_tiresias',
    act: 2,
    chainOnly: true,
    tags: ['landmark'],
    context: 'The prophet at the trench',
    prompt: 'The blind man drinks, and straightens, and sees you — sees through the years of you, both ways. “Ask,” he says, “but ask small. A living man carries one answer well, two badly, and I will not waste a third on you.” The dead lean in to listen. So, friends, does the bard.',
    recap: 'One question for the prophet.',
    // Foreknowledge is chosen, not rolled: press the prophet on ONE question.
    forceTier: { left: 'good', right: 'good' },
    choices: {
      left: {
        label: '“How do I take back my hall?”',
        tags: ['landmark', 'might'],
        governingStats: { might: 1 },
        outcomes: {
          bad: { text: '“The bow,” he says. “They will be many and you will be one, and the doors will be shut, and none of it will matter — the bow remembers your hands, and their hands it refuses. Wait for the day of the axes. String it slow. The rest is rowing.” He turns away; a shade may only say so much.', effects: { addFlag: 'ody_fore_bow' } },
          good: { text: '“The bow,” he says. “They will be many and you will be one, and the doors will be shut, and none of it will matter — the bow remembers your hands, and their hands it refuses. Wait for the day of the axes. String it slow. The rest is rowing.” He turns away; a shade may only say so much.', effects: { addFlag: 'ody_fore_bow' } },
          incredible: { text: '“The bow,” he says. “They will be many and you will be one, and the doors will be shut, and none of it will matter — the bow remembers your hands, and their hands it refuses. Wait for the day of the axes. String it slow. The rest is rowing.” He turns away; a shade may only say so much.', effects: { addFlag: 'ody_fore_bow' } },
        },
      },
      right: {
        label: '“What does the sea want of me?”',
        tags: ['landmark', 'lore'],
        governingStats: { lore: 1 },
        outcomes: {
          bad: { text: '“Less than you owe and more than you will pay,” he says. “Touch nothing of the Sun’s. Pour to the god you wronged at every landfall, though your jaw creaks with it. The sea does not forgive, sailor — but it can be bored into looking elsewhere.” He smiles the way the dead smile: at something over your shoulder.', effects: { poseidon: -2, athena: 1, addFlag: 'ody_fore_sea' } },
          good: { text: '“Less than you owe and more than you will pay,” he says. “Touch nothing of the Sun’s. Pour to the god you wronged at every landfall, though your jaw creaks with it. The sea does not forgive, sailor — but it can be bored into looking elsewhere.” He smiles the way the dead smile: at something over your shoulder.', effects: { poseidon: -2, athena: 1, addFlag: 'ody_fore_sea' } },
          incredible: { text: '“Less than you owe and more than you will pay,” he says. “Touch nothing of the Sun’s. Pour to the god you wronged at every landfall, though your jaw creaks with it. The sea does not forgive, sailor — but it can be bored into looking elsewhere.” He smiles the way the dead smile: at something over your shoulder.', effects: { poseidon: -2, athena: 1, addFlag: 'ody_fore_sea' } },
        },
      },
    },
  },

  // ── LANDMARK III: THE SUITORS' HALL (the finale's climax cards) ──
  {
    id: 'ody_hall_nostos',
    act: 3,
    finaleCard: true,
    pathAffinity: ['nostos'],
    tags: ['landmark'],
    context: 'Your own hall — the last door',
    prompt: 'Smoke you know, from a hearth you built, and at the long tables a hundred strangers eating your herds to the bone while your wife weaves upstairs and unweaves at night. You came home for this room. The beggar’s rags itch. The old dog by the gate has spent his welcome. One door left, friends — the one with your name on it.',
    recap: 'The hall, at last.',
    choices: {
      left: {
        label: 'The slow way — servant by servant',
        tags: ['landmark', 'guile'],
        governingStats: { guile: 1 },
        outcomes: {
          bad: { text: 'The swineherd weeps at the scar and cannot stop, and a maid sees, and the hall’s hundred heads begin to turn — the plan now runs on a burning fuse, and some of the loyal pay for the shortening of it before the doors are even barred.', effects: { guile: 2, expedition: -1, burnout: 3 } },
          good: { text: 'The swineherd first, by the scar. The cowherd next, by the oath. The doors barred by hands you fed as boys; the armory emptied by a son grown taller than the rumor of you. Room by room the house comes back to its master, before the masters-of-nothing at the tables notice the weather change.', effects: { guile: 6 } },
          incredible: { text: 'By the time the doors close, the hall is yours again in every way but loudly: the loyal armed, the bronze gone from the walls, the wine watered, and the hundred at the tables eating their last comfortable meal in a trap with tapestries. The queen, who has not been told, sets out the bow anyway. She knows her weather too.', effects: { guile: 8, athena: 1 } },
        },
      },
      right: {
        label: 'Stand and be known',
        tags: ['landmark', 'might'],
        governingStats: { might: 1 },
        outcomes: {
          bad: { text: 'The rags come off too soon, friends — one heartbeat of legend, then a hundred chairs scrape at once, and the doors are not yet barred, and the night becomes a long ugly arithmetic that the songs will round up and the widows will not.', effects: { might: 3, expedition: -2, burnout: 4 } },
          good: { text: 'You choose the moment the way an archer chooses the lull between winds: the rags drop, the name lands on the hall like the stone on the cave mouth, and half of them are still reaching for swords that went missing in the night. The rest learn what Troy learned.', effects: { might: 6, renown: 1 } },
          incredible: { text: 'The telling slows here, friends, because he stood in his own doorway at last with his own name on — and the hall knew. Knew before the bow spoke. A hundred brave-at-dinner men understood in one held breath why the war took ten years and why the sea took ten more. The door behind them was already barred.', effects: { might: 8, renown: 2 } },
        },
      },
    },
  },
  {
    id: 'ody_hall_kleos',
    act: 3,
    finaleCard: true,
    pathAffinity: ['kleos'],
    tags: ['landmark'],
    context: 'Your own hall — the last verse',
    prompt: 'They know the songs in this hall — that is the bitter joke of it. At your own tables a hundred suitors trade verses about the man who tricked Troy and shouted his name at a giant, never once looking at the beggar by the door. The name you bought with the sea’s hatred sits in their mouths. Time to collect it.',
    recap: 'The hall that sang your song.',
    choices: {
      left: {
        label: 'Let the song walk in first',
        tags: ['landmark', 'guile'],
        governingStats: { guile: 1 },
        outcomes: {
          bad: { text: 'You feed the hall one verse too many — a detail only the man himself could know — and the sharpest of the suitors goes still, and starts counting scars on the beggar. The trap closes early and crooked, and it costs loyal blood to close it at all.', effects: { guile: 2, expedition: -1, burnout: 3 } },
          good: { text: 'A beggar who knows the full song — the true verses, the count of ships right — is worth wine and a seat by the fire. You sing them your own legend with your face in shadow, friends, and watch a hundred men toast the man they are robbing.', effects: { guile: 6, renown: 1 } },
          incredible: { text: 'You correct their verses. One a night. The bag held twelve days’ wind, not ten; the flock was heavy-fleeced, not white — and the hall laughs and asks the ragged stranger how he knows. The answer stands up on the day of the axes with a strung bow in its hands. He built that door out of their own singing.', effects: { guile: 8, renown: 2 } },
        },
      },
      right: {
        label: 'The bow answers the ballads',
        tags: ['landmark', 'might'],
        governingStats: { might: 1 },
        outcomes: {
          bad: { text: 'The contest of the axes begins before the doors are yours, and glory pulls the moment early: the string sings, the first arrow flies true — and the hall is up and armed and pouring at you while the song is still one verse long.', effects: { might: 3, expedition: -2, burnout: 4 } },
          good: { text: 'They lift the bow one by one, the singers of your deeds, and it refuses them one by one — the politest scorn in Ithaca. Then the beggar asks his turn, and the hall grants it as a joke. The joke strings the bow sitting down. The joke puts an arrow through twelve axes. The hall stops singing.', effects: { might: 6, renown: 2 } },
          incredible: { text: 'One arrow through twelve axes, and then he stands, and the rags fall, and he says the line the fire waits for in every telling: “There are other marks, friends, that no man has hit yet.” The bards of three coasts have tried to better that line for four hundred years. They sing it as he said it.', effects: { might: 8, renown: 3 } },
        },
      },
    },
  },
];

// ── 5. The pack ──────────────────────────────────────────────────────────
export const odysseyPack: Pack = {
  id: 'odyssey',
  manifest,
  plugins: [firesPlugin, itineraryPlugin],
  events: [...EVENTS, ...LANDMARKS],
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
    // ── slice 3: the landmark surfaces ──
    // The boons on the HUD: the carried things (flags → chips → inspect).
    gearChips(state) {
      const chips: { cls: string; html: string; sheet: any }[] = [];
      const flag = (f: string) => (state.flags || []).includes(f);
      if (flag('ody_named')) chips.push({ cls: 'gear-chip', html: '🗣 The Name, spent', sheet: {
        emoji: '🗣', title: 'The Name, spent',
        lines: ['You shouted it at the sea, whole — father and city and all.', '<b>Renown rose. Poseidon listened.</b> The sea does not forget.'],
      } });
      if (flag('ody_nobody')) chips.push({ cls: 'gear-chip', html: '◌ Nobody', sheet: {
        emoji: '◌', title: 'Nobody',
        lines: ['The name went down with the anchor-stone, where it can never be shouted from.', '<b>The sea was left unprovoked.</b> Glory was left on the water.'],
      } });
      if (flag('ody_fore_bow')) chips.push({ cls: 'gear-chip inst-chip', html: '🏹 The prophet’s word: the bow', sheet: {
        emoji: '🏹', title: 'The prophet’s word: the bow',
        lines: ['“The bow remembers your hands, and their hands it refuses. Wait for the day of the axes. String it slow.”', '<b>The bow door in the Hall pays double.</b>'],
      } });
      if (flag('ody_fore_sea')) chips.push({ cls: 'gear-chip hustle-chip', html: '🌊 The prophet’s word: the sea', sheet: {
        emoji: '🌊', title: 'The prophet’s word: the sea',
        lines: ['“Pour to the god you wronged at every landfall, though your jaw creaks with it.”', '<b>Poseidon eased; Athena’s door in the Hall opens wider.</b>'],
      } });
      return chips;
    },
    // Landmark framing: the ceremonial banner above the dealt card. The gold
    // fret is the gods’ border (odyssey.css styles .sp-ody); the deep gets
    // its hush (.sp-ody-deep). One full-screen beat per landmark (key).
    setPiece(state, ev) {
      if (!(ev.tags || []).includes('landmark')) return null;
      if (ev.id.startsWith('ody_cyclops')) {
        return { banner: 'THE CYCLOPS', sub: 'The bard sets down his cup. The fire leans in.', cls: 'sp-ody', key: 'cyclops' };
      }
      if (ev.id === 'ody_underworld' || ev.id === 'ody_tiresias') {
        return { banner: 'THE UNDERWORLD', sub: 'The fire burns low here. That is on purpose.', cls: 'sp-ody sp-ody-deep', key: 'underworld' };
      }
      if (ev.id.startsWith('ody_hall')) {
        return { banner: 'THE HALL OF SUITORS', sub: 'One door left — the one with your name on it.', cls: 'sp-ody', key: 'hall' };
      }
      return null;
    },
    // The three-door grammar at maximum stakes: the pre-finale set. Every
    // door is always offered; the prophecy boons make theirs pay better —
    // knowledge-only, exactly as the grill demands.
    finalSet(run) {
      const flags = run.flags || [];
      const bowFore = flags.includes('ody_fore_bow');
      const seaFore = flags.includes('ody_fore_sea');
      const options = [
        {
          title: 'String the bow',
          blurb: bowFore
            ? 'The prophet said it plain: the bow remembers your hands. String it slow.'
            : 'Not one of them can string it. One of you can.',
          stat: 'might', amount: bowFore ? 8 : 4,
          label: bowFore ? '+8 Might · the foretold door' : '+4 Might',
          apply: () => { run.stats.might = Math.min(100, run.stats.might + (bowFore ? 8 : 4)); },
        },
        {
          title: 'The beggar’s patience',
          blurb: 'Hold the disguise one hour longer than a king can bear to. Doors bar quietly. Blades go missing.',
          stat: 'guile', amount: 4, label: '+4 Guile',
          apply: () => { run.stats.guile = Math.min(100, run.stats.guile + 4); },
        },
        {
          title: 'Athena at your shoulder',
          blurb: seaFore
            ? 'You paid the sea its due at every landfall. The goddess noticed the bookkeeping.'
            : 'The owl has watched the whole voyage. Ask, at last, out loud.',
          stat: 'athena', amount: seaFore ? 3 : 2,
          label: seaFore ? '+3 Athena · she tips the scale' : '+2 Athena',
          apply: () => { run.athena = (run.athena || 0) + (seaFore ? 3 : 2); },
        },
      ];
      return {
        head: 'The Hall of Suitors',
        sub: 'The last door of the telling — the bow, the rags, or the goddess. Your path’s gates are judged after.',
        options,
      };
    },
    loadoutPicker: {
      head: 'Where do you sing tonight?',
      sub: 'Four fires want the same story told four ways. The crowd shapes the telling.',
    },
  },
};
