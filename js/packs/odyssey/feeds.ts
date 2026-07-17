// The Odyssey — the second screen (ADR-0014): word travels.
//
// No phones at this fire. The surface reads as the WORD moving, the way word
// actually moved: what the harbors say (pilots, traders, the salt-fish
// stalls — rumor of the voyage, garbled in transit), what Olympus notes in
// its ledger (the powers, watching, dry), and what tonight's listeners
// mutter around THIS very fire (the roster's ensemble: the woman by the
// woodpile, the potter's boy, the man who wants the horse — and Phemios,
// heckling from Smyrna, because word reached him too). Three channels, not
// five: a bronze-age rumor network has exactly these registers.
//
// Voice: post bodies are SINCERE quoted mouths (VOICE.md § the second
// screen) — the harbor's dialect, the gods' dry minutes, the fire's heckle —
// so they carry the quoted-speech cliché/bang exemption. The chrome (teasers,
// headlines) is the bard-adjacent narrator and keeps the house rules.
//
// PURITY (the presenter contract): a pure read of state. RNG derives from
// flavorSeed + the run's own ledger — NEVER the play RNG — so sims never
// touch this and the golden corpus does not move. Same moment → same feed.
//
// HONESTY: each channel's mood is read from a real meter — the harbor reads
// Renown (with Poseidon's weather shouting over it), Olympus reads the
// Athena/Poseidon ledger, the fire reads Despair — so the feed IS an
// instrument, not wallpaper. And the moment grammar keeps the contrast
// load-bearing: landmarks, temptations, act breaks, and the ending speak;
// ambient seas stay quiet.

import type { RunState, FeedBundle, FeedChannel, FeedPost, FeedMoment } from '../../types.js';
import { mulberry32 } from '../../engine.js';

// ---------- Seeded, play-RNG-free entropy (the LI pattern) ----------

function feedRng(state: RunState, salt: number): () => number {
  const flavor = (state.flavorSeed || 1) >>> 0;
  const played = (state.cardLog?.length || 0) >>> 0;
  const seed = (((flavor * 2654435761) ^ (salt * 40503) ^ (played * 2246822519)) >>> 0) || 1;
  return mulberry32(seed);
}
function sample<T>(rng: () => number, arr: T[], n: number): T[] {
  const bag = arr.slice();
  const out: T[] = [];
  for (let i = 0; i < n && bag.length; i++) out.push(bag.splice(Math.floor(rng() * bag.length), 1)[0]);
  return out;
}
function pick<T>(rng: () => number, arr: T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}

// ---------- The three rooms word moves through ----------

type Mood = 'up' | 'split' | 'down' | 'feral' | 'soft';
type Ch = 'harbor' | 'olympus' | 'fire';

const CHANNEL_CHROME: Record<Ch, Omit<FeedChannel, 'posts' | 'more' | 'mood'>> = {
  harbor: {
    id: 'harbor', name: 'the harbor wall', icon: '⚓', skin: 'feed-harbor',
    handle: 'pilots · traders · the fish stalls',
    header: 'What the quays are saying, three ports downwind of the truth.',
  },
  olympus: {
    id: 'olympus', name: 'Olympus', icon: '⚡', skin: 'feed-olympus',
    handle: 'the ledger of the powers',
    header: 'Minutes of the mountain. The powers watch everything and file most of it.',
  },
  fire: {
    id: 'fire', name: 'round this fire', icon: '🔥', skin: 'feed-ember',
    handle: 'tonight’s listeners',
    header: 'The back row of your own telling. They can hear you. They don’t care.',
  },
};

// The mood each room wears is read from a REAL meter, so the tabs are honest
// instruments: a red dot on Olympus means the sea-ledger really is winning.
function harborMood(s: RunState): Mood {
  if ((s.poseidon ?? 0) >= 8) return 'feral';
  const r = s.renown ?? 0;
  return r >= 8 ? 'up' : r >= 4 ? 'split' : 'down';
}
function olympusMood(s: RunState): Mood {
  if ((s.poseidon ?? 0) >= 9) return 'feral';
  const d = (s.athena ?? 0) - (s.poseidon ?? 0);
  return d >= 4 ? 'soft' : d <= -4 ? 'down' : 'split';
}
function fireMood(s: RunState): Mood {
  const b = s.stats?.burnout ?? 0;
  return b <= 35 ? 'up' : b <= 60 ? 'split' : b <= 80 ? 'down' : 'feral';
}
const MOOD_OF: Record<Ch, (s: RunState) => Mood> = {
  harbor: harborMood, olympus: olympusMood, fire: fireMood,
};

// ---------- The voices ----------
// Recurring named mouths, so a player who reads three feeds starts to KNOW
// the Same pilot and dread the woman by the woodpile. Fire voices mirror
// roster.ts (the fire's canon ensemble) exactly.

type Frag = { author: string; avatar?: string; body: string; meta?: string; pinned?: boolean; replies?: { author: string; avatar?: string; body: string }[] };

// ---------- Layer 1: the room's temperature (per channel, per mood) ----------

const MOOD_POOL: Record<Ch, Record<Mood, Frag[]>> = {
  harbor: {
    up: [
      { author: 'the Same pilot', avatar: '⚓', body: 'Odds at the pilots’ bench have shifted toward the fleet. I do not set the odds. I only report that fools are now betting both ways.', meta: 'heard at three quays' },
      { author: 'a Cretan wine trader', avatar: '🍇', body: 'His name moves cargo now. I have sold the same “genuine oar of the twelve” eleven times, and I am not sorry.' },
      { author: 'the salt-fish wife', avatar: '🐟', body: 'The buyers ask for the story before they ask the price. Good for business. Suspicious for truth.' },
    ],
    split: [
      { author: 'the Same pilot', avatar: '⚓', body: 'Half this quay swears the fleet is doomed, half swears it is charmed. Both halves buy me wine, so I nod a great deal.' },
      { author: 'the ferry oarsman', avatar: '🛶', body: 'Some days the word says twelve ships, some days three. The channel does not care. Neither, professionally, do I.' },
      { author: 'a sponge diver', avatar: '🌊', body: 'The water has opinions about that fleet. It has not decided which one either.' },
    ],
    down: [
      { author: 'the salt-fish wife', avatar: '🐟', body: 'Nobody asks about the fleet at market anymore. That is how the sea buries men — first the asking stops.' },
      { author: 'the Same pilot', avatar: '⚓', body: 'The odds-board has him gone. Old pilots keep a private ledger, though, and mine is still open.' },
      { author: 'a Cretan wine trader', avatar: '🍇', body: 'I stopped stocking the story. No buyers. A port forgets faster than a wife does.' },
    ],
    feral: [
      { author: 'a sponge diver', avatar: '🌊', body: 'The sea has been WRONG for days — swells against the wind, the nets coming up cold. Whatever the powers are arguing about, it is happening over our heads.' },
      { author: 'the Same pilot', avatar: '⚓', body: 'Small craft stay in. This is not weather. This is a MOOD, and it has a name I will not say on open water.', pinned: true },
      { author: 'the ferry oarsman', avatar: '🛶', body: 'Even the gulls have gone inland. Row your own conclusions.' },
    ],
    soft: [
      { author: 'the salt-fish wife', avatar: '🐟', body: 'The harbor is kind about the fleet these days — the way you get about men you no longer expect back.' },
      { author: 'the Same pilot', avatar: '⚓', body: 'An old story is a light kind of cargo. The boats carry it gladly now it weighs nothing.' },
    ],
  },
  olympus: {
    up: [
      { author: 'Hermes', avatar: '🪽', body: 'Mood on the mountain: favorable. Poseidon is at the far end of the table and the wine is holding out.' },
      { author: 'Athena', avatar: '🦉', body: 'My petitions are being granted lately. I have stopped asking why and started asking faster.' },
    ],
    split: [
      { author: 'Zeus', avatar: '⚡', body: 'The table is divided over one mortal again. I have moved the nectar out of throwing range.' },
      { author: 'Hermes', avatar: '🪽', body: 'Athena and the Sea-lord are not speaking. So — a normal dinner.' },
    ],
    down: [
      { author: 'Poseidon', avatar: '🔱', body: 'The mountain grows tired of the little captain. GOOD.' },
      { author: 'Zeus', avatar: '⚡', body: 'The petitions for that man now outnumber the ones against by less than they did. Noted without comment.' },
    ],
    feral: [
      { author: 'Poseidon', avatar: '🔱', body: 'I HAVE FOUND MY THUNDER TONIGHT AND IT IS WET.', meta: 'somewhere, a coastline is being rearranged' },
      { author: 'Hermes', avatar: '🪽', body: 'The Sea-lord is rearranging a coastline. All flights grounded. Do not pray loudly.' },
    ],
    soft: [
      { author: 'Athena', avatar: '🦉', body: 'Even the sea sleeps sometimes. Tonight the mountain watches him kindly, and I say nothing, in case the saying breaks it.' },
      { author: 'the Fates', avatar: '🧵', body: 'The thread runs smooth this length. Enjoy the spinning. It is not usual.' },
    ],
  },
  fire: {
    up: [
      { author: 'the innkeeper', avatar: '🍯', body: 'The cups are moving, the fire is fed, and nobody has fallen asleep against the fish racks. Carry on, bard.' },
      { author: 'the potter’s boy', avatar: '🏺', body: 'It is good tonight. I am still watching the counts. But it is good.' },
      { author: 'Phemios (from Smyrna)', avatar: '🥁', body: 'Heard your little fire is enjoying itself. Smyrna’s hall seats four hundred. With a DRUM.', replies: [{ author: 'the woman by the woodpile', avatar: '🪵', body: 'Four hundred people who have never heard the count done right.' }] },
    ],
    split: [
      { author: 'the woman by the woodpile', avatar: '🪵', body: 'Some of us believe him tonight. Some of us knew his uncle. The fire hears both.' },
      { author: 'the innkeeper', avatar: '🍯', body: 'Half the room weeping, half arguing the geography. A good night’s trade either way.' },
    ],
    down: [
      { author: 'an old rower’s widow', avatar: '🕯️', body: 'The fire is low and the bard keeps singing past the names. Feed one or the other.' },
      { author: 'the potter’s boy', avatar: '🏺', body: 'You are rushing. The dead parts deserve the slow voice.' },
      { author: 'Phemios (from Smyrna)', avatar: '🥁', body: 'I do the storm passage with a drum, you know. Standing offer.' },
    ],
    feral: [
      { author: 'the man who wants the horse', avatar: '🐴', body: 'THE HORSE. THE HORSE. THE HORSE.', replies: [{ author: 'the potter’s boy', avatar: '🏺', body: 'He has been at the barley wine.' }] },
      { author: 'the innkeeper', avatar: '🍯', body: 'Two fights about seating and one about the geography of Crete. A great night. Someone mind the woodpile.' },
    ],
    soft: [
      { author: 'an old rower’s widow', avatar: '🕯️', body: 'Quiet fire tonight. The kind where the sad verses can breathe. Leave it be.' },
      { author: 'the woman by the woodpile', avatar: '🪵', body: 'Nobody counting tonight. Even I let a number pass. It seemed the hour for it.' },
    ],
  },
};

// ---------- Layer 2: the moment's news (per family, per channel, per valence) ----------

type Family = 'cyclops' | 'underworld' | 'calypso' | 'landmark' | 'temptation' | 'recap' | 'ending';
type Valence = 'good' | 'bad';

const FAMILY_POOL: Record<Family, Record<Ch, Record<Valence, Frag[]>>> = {
  cyclops: {
    harbor: {
      good: [
        { author: 'the Same pilot', avatar: '⚓', body: 'A crew out of Troy blinded the shepherd of the goat islands and sailed out UNDER his hands. I have this from two boats that do not know each other.', meta: 'heard at three quays' },
        { author: 'the salt-fish wife', avatar: '🐟', body: 'They say he told the giant his name was Nobody. My husband laughs every time he tells it. It gets longer every market day.' },
      ],
      bad: [
        { author: 'the Same pilot', avatar: '⚓', body: 'Whatever happened at the goat islands, the survivors are not talking about it. Sailors who will not talk are worse news than any wreck.' },
        { author: 'a sponge diver', avatar: '🌊', body: 'The swell off that coast has been wrong for a week. Something in that water is angry, and it is not the weather.' },
      ],
    },
    olympus: {
      good: [
        { author: 'Athena', avatar: '🦉', body: 'He put out the eye with a plan and a false name. I have backed worse with less. Noting it.' },
        { author: 'Hermes', avatar: '🪽', body: 'For the record: I did not help. He thought of the sheep himself. I am delighted.' },
      ],
      bad: [
        { author: 'Zeus', avatar: '⚡', body: 'Hospitality was violated in both directions at that cave. I decline to rule. Let the water sort it.' },
        { author: 'the Fates', avatar: '🧵', body: 'The thread frays here. It does not cut.' },
      ],
    },
    fire: {
      good: [
        { author: 'the woman by the woodpile', avatar: '🪵', body: 'Twelve ships to the goat islands and twelve out. I counted. For ONCE the arithmetic holds.' },
        { author: 'the man who wants the horse', avatar: '🐴', body: 'Fine. The giant is good. The horse is still better. Do the horse.', replies: [{ author: 'the potter’s boy', avatar: '🏺', body: 'It is the wrong poem. They told you.' }] },
      ],
      bad: [
        { author: 'the woman by the woodpile', avatar: '🪵', body: 'He shouted his own name at a blind giant across open water. My grandfather rowed thirty years and never once introduced himself to a thing that eats sailors.' },
        { author: 'an old rower’s widow', avatar: '🕯️', body: 'The bench-count changed at the cave and he sang past it quick. I notice. We all notice.' },
      ],
    },
  },
  underworld: {
    harbor: {
      good: [
        { author: 'the salt-fish wife', avatar: '🐟', body: 'They are saying the fleet found the mouth of the dead and came back OUT. I sell fish. I will be over here. Selling fish.' },
        { author: 'the Same pilot', avatar: '⚓', body: 'So the trench at the world’s edge is real. Every chart in this harbor just became a first draft.' },
      ],
      bad: [
        { author: 'the ferry oarsman', avatar: '🛶', body: 'Rowed a man once who had seen the trench. He paid double to sit in the middle of the boat, away from the water on both sides.' },
        { author: 'a sponge diver', avatar: '🌊', body: 'A fleet that visits the dead brings some of the grey back up in the men’s faces. You pour for those crews. You do not ask.' },
      ],
    },
    olympus: {
      good: [
        { author: 'Athena', avatar: '🦉', body: 'He asked the dead the right question and left before the dark could finish its sentence. Craft.' },
        { author: 'Hermes', avatar: '🪽', body: 'I do the escort work down there. He came out with more of himself than most. Professional respect.' },
      ],
      bad: [
        { author: 'the Fates', avatar: '🧵', body: 'He was told the shape of his own ending, and rowed on anyway. We respect that. It changes nothing.' },
        { author: 'Poseidon', avatar: '🔱', body: 'Even the dead tell him to fear me. GOOD.' },
      ],
    },
    fire: {
      good: [
        { author: 'the potter’s boy', avatar: '🏺', body: 'So the man on the beach in the grey — does he ever stand up? You said the dead wait in rowing order. Which bench.' },
        { author: 'the woman by the woodpile', avatar: '🪵', body: 'My grandfather said the dead drink first and answer after. He got THAT much right, then.' },
      ],
      bad: [
        { author: 'an old rower’s widow', avatar: '🕯️', body: 'If my man is in that grey water I want to know if he had his oar with him. Ask it next telling. I will wait.' },
        { author: 'the man who wants the horse', avatar: '🐴', body: 'No horse in the underworld either? The one place where everyone you need is standing around.' },
      ],
    },
  },
  calypso: {
    harbor: {
      good: [
        { author: 'the Same pilot', avatar: '⚓', body: 'Seven years nobody sees a sail, then a RAFT crosses the worst water on the chart. A raft. I have stopped explaining the sea to anyone.' },
        { author: 'the ferry oarsman', avatar: '🛶', body: 'A one-man raft, out of the west, riding weather that sinks freighters. Either the story is true or the sea has started making exceptions. Neither is comfortable.' },
      ],
      bad: [
        { author: 'a Cretan wine trader', avatar: '🍇', body: 'The wine goes where the stories are, and no stories come out of the west anymore. Whole harbors gone quiet on the name.' },
        { author: 'the salt-fish wife', avatar: '🐟', body: 'An island that asks nothing. Men talk about it the way they talk about a debt they are glad someone else is paying.' },
      ],
    },
    olympus: {
      good: [
        { author: 'Athena', avatar: '🦉', body: 'He turned down deathless. For a rock, a loom, and a woman who tests strangers. I picked correctly.' },
        { author: 'Hermes', avatar: '🪽', body: 'I delivered the release order myself. Longest flight I do, and worth it for her face. And his.' },
      ],
      bad: [
        { author: 'Zeus', avatar: '⚡', body: 'A goddess petitions to keep one mortal, and the mortal is ASKED. This is what my house has come to. Granted, obviously.' },
        { author: 'the Fates', avatar: '🧵', body: 'A thread held still is not a thread cut. We wait. We are good at it.' },
      ],
    },
    fire: {
      good: [
        { author: 'the woman by the woodpile', avatar: '🪵', body: 'Deathless, and he says no thank you. If that is not true it SHOULD be, which is the best kind of true at this hour.' },
        { author: 'the innkeeper', avatar: '🍯', body: 'A man who can leave a warm island is a man who settles his bill. Rare in both cases. Sing on.' },
      ],
      bad: [
        { author: 'an old rower’s widow', avatar: '🕯️', body: 'Warm island, no oars, nobody drowning. I would have stayed. Say it honest — most of us would have stayed.' },
        { author: 'the man who wants the horse', avatar: '🐴', body: 'If he stays on the island we never get to the horse. Think it through, man. ROW.' },
      ],
    },
  },
  landmark: {
    harbor: {
      good: [
        { author: 'the Same pilot', avatar: '⚓', body: 'Another impossible passage with his name on it. The guild now charges double to any captain who has HEARD the stories. Morale reasons.' },
        { author: 'the salt-fish wife', avatar: '🐟', body: 'Every boat in this market has a cousin who saw the fleet last month. The fleet must be nine hundred ships by now.' },
      ],
      bad: [
        { author: 'the Same pilot', avatar: '⚓', body: 'Chart note, all captains: whatever that fleet did there, do the opposite.' },
        { author: 'a sponge diver', avatar: '🌊', body: 'Wreck-wood with fresh tool-marks coming up in the nets again. Somebody out there is paying the sea’s prices.' },
      ],
    },
    olympus: {
      good: [
        { author: 'Hermes', avatar: '🪽', body: 'Status: still alive. Method: unclear. Entertainment value: considerable.' },
        { author: 'Athena', avatar: '🦉', body: 'Noted. Filed. Quietly pleased. Next.' },
      ],
      bad: [
        { author: 'Poseidon', avatar: '🔱', body: 'The ledger grows. I am patient the way the tide is patient.' },
        { author: 'Zeus', avatar: '⚡', body: 'My daughter petitions for him again. I now charge her a favor per rescue. She pays it every time, which tells you something.' },
      ],
    },
    fire: {
      good: [
        { author: 'the woman by the woodpile', avatar: '🪵', body: 'That one held together. I checked the counts twice and the ships came out even. Continue.' },
        { author: 'the innkeeper', avatar: '🍯', body: 'The room went so quiet at the good part I could hear the wine breathe. That is a paying quiet. Sing on.' },
      ],
      bad: [
        { author: 'the potter’s boy', avatar: '🏺', body: 'You changed the number of men between the beach and the boat. Which is it.' },
        { author: 'an old rower’s widow', avatar: '🕯️', body: 'Sing the hard parts slower. Some of us are listening for names.' },
      ],
    },
  },
  temptation: {
    harbor: {
      good: [
        { author: 'the Same pilot', avatar: '⚓', body: 'Word is the fleet touched the sweet coast and LEFT. First crew in my lifetime. Mark the log.' },
        { author: 'a Cretan wine trader', avatar: '🍇', body: 'A witch turns your crew to pigs and you leave her table with charts and provisions? Some men negotiate better drunk on strangeness than I do sober.' },
      ],
      bad: [
        { author: 'the salt-fish wife', avatar: '🐟', body: 'Three crews I have known went in at that green shore. The boats come back. It is the men that stay.' },
        { author: 'the ferry oarsman', avatar: '🛶', body: 'The sweet coasts do not wreck you. That is the trick of them. A wreck at least sends wood ashore to say what happened.' },
      ],
    },
    olympus: {
      good: [
        { author: 'Athena', avatar: '🦉', body: 'Offered the easy harbor. Chose the oar. This is why I keep petitioning for him.' },
        { author: 'Hermes', avatar: '🪽', body: 'I handed him the herb against the cup. He did the rest himself — and the rest was the hard part.' },
      ],
      bad: [
        { author: 'the Fates', avatar: '🧵', body: 'Threads that stop moving are the quietest work we do.' },
        { author: 'Poseidon', avatar: '🔱', body: 'Let the sweet coasts keep him. It spares my weather.' },
      ],
    },
    fire: {
      good: [
        { author: 'the innkeeper', avatar: '🍯', body: 'He looked at forever and asked for the bill instead. My kind of customer. Sing on.' },
        { author: 'the potter’s boy', avatar: '🏺', body: 'He left. Good. I had a question saved up in case he stayed and it was not a kind one.' },
      ],
      bad: [
        { author: 'the man who wants the horse', avatar: '🐴', body: 'A YEAR at the witch’s table? We could have done the horse TWICE.' },
        { author: 'the woman by the woodpile', avatar: '🪵', body: 'A year in one verse. I counted the seasons on my fingers and he was done before my thumb.' },
      ],
    },
  },
  recap: {
    harbor: {
      good: [
        { author: 'the Same pilot', avatar: '⚓', body: 'The word runs ahead of that fleet like gulls ahead of weather. Half of it is even true.' },
        { author: 'a Cretan wine trader', avatar: '🍇', body: 'I have started paying rowers for news of the fleet by the jar. The price of the story is up in every port.' },
      ],
      bad: [
        { author: 'the Same pilot', avatar: '⚓', body: 'Fewer masts every time the story is told. The arithmetic of rumor is bad, and the real one is usually worse.' },
        { author: 'the salt-fish wife', avatar: '🐟', body: 'The widows have started coming to the quay on the good-wind days. Nobody told them anything. That is the point.' },
      ],
    },
    olympus: {
      good: [
        { author: 'Athena', avatar: '🦉', body: 'Interim report: alive, clever, mostly deserving it. Continuing.' },
        { author: 'Hermes', avatar: '🪽', body: 'Between acts I run the numbers to the mountain. The mountain is, and I quote, “watching with interest.” That is warm, for us.' },
      ],
      bad: [
        { author: 'Poseidon', avatar: '🔱', body: 'Interim report: the sea is winning. As the sea does.' },
        { author: 'the Fates', avatar: '🧵', body: 'The middle of a thread tells you nothing. We measure at the end. Everyone measures at the end.' },
      ],
    },
    fire: {
      good: [
        { author: 'the innkeeper', avatar: '🍯', body: 'Good act. The cups are up, the fire is fed, and nobody has asked for their coin back.' },
        { author: 'the potter’s boy', avatar: '🏺', body: 'Act’s done. The counts mostly held. I wrote down the ones that did not.' },
      ],
      bad: [
        { author: 'an old rower’s widow', avatar: '🕯️', body: 'Act’s over. He tallied the benches too fast again. Slower, bard.' },
        { author: 'Phemios (from Smyrna)', avatar: '🥁', body: 'Heard the act break went quiet. In Smyrna we fill those with a drum solo. Just saying it travels.' },
      ],
    },
  },
  ending: {
    harbor: {
      good: [
        { author: 'the Same pilot', avatar: '⚓', body: 'It ends the way the pilots always said it could not: the man came HOME. Redraw the charts. Reprice the odds.' },
        { author: 'the salt-fish wife', avatar: '🐟', body: 'Twenty years, and the smoke goes up on Ithaca again. I sold fish to that house before the war. I will again.' },
      ],
      bad: [
        { author: 'the Same pilot', avatar: '⚓', body: 'Take the name off the odds-board. The sea has settled the account.' },
        { author: 'a Cretan wine trader', avatar: '🍇', body: 'A story keeps a port warm for a while. Then it is just weather again.' },
      ],
    },
    olympus: {
      good: [
        { author: 'Athena', avatar: '🦉', body: 'Closed as petitioned. My favorite case. Do not tell the others.' },
        { author: 'Zeus', avatar: '⚡', body: 'She has been insufferable all evening. Justified, but insufferable.' },
      ],
      bad: [
        { author: 'Poseidon', avatar: '🔱', body: 'The ledger is settled. The sea keeps what it is owed. It was never personal. No — it was ENTIRELY personal.' },
        { author: 'the Fates', avatar: '🧵', body: 'Cut clean. Measured true. Filed.' },
      ],
    },
    fire: {
      good: [
        { author: 'the woman by the woodpile', avatar: '🪵', body: 'The counts held to the end. I have no notes. First time in years I have no notes.' },
        { author: 'the man who wants the horse', avatar: '🐴', body: 'Fine. FINE. It was better than the horse. Tell nobody I said it.' },
      ],
      bad: [
        { author: 'an old rower’s widow', avatar: '🕯️', body: 'It ended the way the sea ends things. Sing it again tomorrow anyway. That is what the fire is FOR.' },
        { author: 'the potter’s boy', avatar: '🏺', body: 'So the man on the beach never stood up, then.' },
      ],
    },
  },
};

// The one flag-keyed special: shout your name at the cave and Poseidon's
// post about it is PINNED to Olympus for that beat — the feed telling you,
// in the god's own voice, exactly what the wrath clock is now counting.
const NAMED_POST: Frag = {
  author: 'Poseidon', avatar: '🔱', pinned: true,
  body: 'MY SON. A guest under his roof, and they took his one eye — and then the captain SIGNED it. Every league of salt between that man and home now reports to ME.',
  meta: 'the wrath ledger is open',
};

// ---------- Chrome: teasers + headlines (narrator register, house rules) ----------

const TEASERS: Record<Family, string[]> = {
  cyclops: [
    'A name is being repeated in harbors that have never seen your sail.',
    'The goat islands have a new story, and it is loose on the water.',
  ],
  underworld: [
    'The pilots have stopped joking about the trench.',
    'Word from the edge of the chart, where word does not usually come from.',
  ],
  calypso: [
    'No sail sighted for a season. The word fills the silence its own way.',
    'The west has gone quiet, and quiet makes the harbors talkative.',
  ],
  landmark: [
    'The story has outrun the ship again.',
    'Three ports, three versions, one fleet.',
  ],
  temptation: [
    'Every quay has an opinion about what the fleet did next.',
    'The sweet coasts are in the talk again.',
  ],
  recap: [
    'Between acts, the word walks the wharves.',
    'The act is done; the word is already three harbors ahead of it.',
  ],
  ending: [
    'The tale is loose now. Hear what the world does with it.',
    'The last word goes to everyone else. It always does.',
  ],
};
const HEADLINES: Partial<Record<Family, string>> = {
  recap: 'The word, between acts',
  ending: 'What the world will sing',
};

// The shell-chrome re-voicing (Presenter.feedChrome): this pack has no
// phones, so the surface speaks in traveling word.
export const ODYSSEY_FEED_CHROME = {
  kicker: '🕊️ Word travels',
  caughtUp: '🕊️ You have heard all the word there is',
  openLabel: 'Hear the word',
  foot: 'word carries · tap ✕ to go back to the fire',
  headline: 'Word on the water',
  moodLines: {
    up: 'the word is warm on the fleet tonight',
    split: 'the word is divided — listen twice',
    down: 'the word has gone against the voyage',
    feral: 'the sea itself is in the talk tonight',
    soft: 'the word is gentle, for once',
  },
} as const;

// ---------- Moment grammar ----------

// Landmarks, temptations, act breaks, the ending. Ambient seas return null —
// the quiet between feeds is what makes a feed an event.
function familyOf(state: RunState, moment: FeedMoment): { family: Family; valence: Valence } | null {
  if (moment.kind === 'result') {
    const tags = moment.ev?.tags || [];
    const beat = tags.find((t) => t.startsWith('beat:'))?.slice(5);
    const isLandmark = tags.includes('landmark');
    const isTempt = tags.includes('temptation');
    if (!isLandmark && !isTempt) return null;
    const family: Family =
      beat === 'cyclops' ? 'cyclops'
      : beat === 'underworld' ? 'underworld'
      : beat === 'calypso' ? 'calypso'
      : isTempt ? 'temptation' : 'landmark';
    // HONESTY at the bank: every temptation forces its stay/succumb door to
    // tier 'good' (the offer is warm by design), so tier alone would have the
    // harbors toasting a departure that never happened. The stayed-flag is
    // already on the run when this renders — a banked telling reads the
    // stayed pools (which mourn, shrug, and wait), never the left ones.
    const banked = (state.flags || []).some((f) => f.startsWith('ody_stayed_'));
    const valence: Valence = banked || moment.tier === 'bad' ? 'bad' : 'good';
    return { family, valence };
  }
  if (moment.kind === 'recap') {
    // Act 1 has no recap takeover and no feed — the word needs a deed first.
    if (moment.act <= 1) return null;
    return { family: 'recap', valence: (state.expedition ?? 0) >= 7 ? 'good' : 'bad' };
  }
  // ending
  const key = moment.endingKey || '';
  const good = (key === 'nostos' || key === 'kleos') && state.ending?.result === 'success';
  return { family: 'ending', valence: good ? 'good' : 'bad' };
}

// ---------- Assembly ----------

function toPost(f: Frag): FeedPost {
  return { ...f } as FeedPost;
}

function buildChannel(state: RunState, ch: Ch, family: Family, valence: Valence, salt: number): FeedChannel {
  const rng = feedRng(state, salt);
  const mood = MOOD_OF[ch](state);
  const news = FAMILY_POOL[family][ch][valence] || [];
  const temp = MOOD_POOL[ch][mood] || [];
  // The beat's news leads; the room's temperature fills in behind it.
  const lead = sample(rng, news, 2);
  const fill = sample(rng, temp, 2);
  const posts = [...lead, ...fill.slice(0, 1)].map(toPost);
  const more = fill.slice(1).map(toPost);
  if (family === 'cyclops' && ch === 'olympus' && (state.flags || []).includes('ody_named')) {
    posts.unshift(toPost(NAMED_POST));
  }
  return { ...CHANNEL_CHROME[ch], mood, posts, more };
}

export function odysseyFeeds(state: RunState, moment: FeedMoment): FeedBundle | null {
  const hit = familyOf(state, moment);
  if (!hit) return null;
  const { family, valence } = hit;
  const tRng = feedRng(state, 999 + family.length);
  const teaser = pick(tRng, TEASERS[family]);
  const channels = (['harbor', 'olympus', 'fire'] as Ch[])
    .map((c, i) => buildChannel(state, c, family, valence, i * 7 + family.length));
  return { teaser, headline: HEADLINES[family] || ODYSSEY_FEED_CHROME.headline, channels };
}

// ---------- Lint corpus (ADR-0014) ----------
// Feed copy lives here, not in pack.events, so the deck linter can't see it.
// Flat exports let tools/lint-content.mjs run the taste floor over it: post
// bodies as quoted mouths (cliché/bang exempt), chrome as narration (house
// rules). Mirrors love-island/feeds.ts exactly.

export function feedBodyCorpus(): string[] {
  const out: string[] = [];
  const eat = (f: Frag) => { out.push(f.body); (f.replies || []).forEach((r) => out.push(r.body)); };
  for (const ch of Object.keys(MOOD_POOL) as Ch[]) {
    for (const m of Object.keys(MOOD_POOL[ch]) as Mood[]) MOOD_POOL[ch][m].forEach(eat);
  }
  for (const fam of Object.keys(FAMILY_POOL) as Family[]) {
    for (const ch of Object.keys(FAMILY_POOL[fam]) as Ch[]) {
      for (const v of Object.keys(FAMILY_POOL[fam][ch]) as Valence[]) FAMILY_POOL[fam][ch][v].forEach(eat);
    }
  }
  eat(NAMED_POST);
  return out;
}
export function feedChromeCorpus(): string[] {
  const out: string[] = [];
  for (const fam of Object.keys(TEASERS) as Family[]) out.push(...TEASERS[fam]);
  out.push(...Object.values(HEADLINES).filter((h): h is string => !!h));
  return out;
}
