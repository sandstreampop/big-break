// The fire remembers (pass 22) — the Memory Law's deck layer. Five cards
// gated on how the PREVIOUS telling ended (run.history, stamped at run
// start from the meta ledger): the crowd carries last night into tonight,
// and for once the bard must answer for it in play, not just in the cold
// open. Five cards covering the confession-worthy endings (a kleos return
// gets no question — the fire is still humming it); each deals at most
// once per run (usedEvents), at 4× weight while eligible.
//
// The gate is the ITINERARY plugin's `lastEnding` predicate (itinerary.ts —
// the bard plugin is removable flavor and may not gate the deck), which
// REFUSES shared water (daily/gauntlet) — the P18 law: a shared seed forks
// on nothing personal. Sims and goldens never stamp history, so these
// cards are invisible to the seeded corpus by construction: the eligible
// pool a fresh run draws from is unchanged.
//
// Register: the FRAME, not the sea — the fire talking back. Quieter effects
// than the deck's waters; the stakes are the room, not the hull count.

import type { GameEvent } from '../../types.js';

export const MEMORY_EVENTS: GameEvent[] = [
  {
    id: 'ody_mem_wrath',
    act: 1,
    tags: ['omen'],
    requires: { lastEnding: 'wrath' },
    context: 'The fire, before the ships launch',
    prompt: 'Before you can begin, the old rower’s widow speaks from her place: “Last night the sea took them all. I heard it from here.” She is not accusing. She is asking — the whole fire is — whether tonight’s captain also shouts at the water.',
    recap: 'The widow asked about last night’s sea.',
    choices: {
      left: {
        label: 'Promise her a quieter sea',
        tags: ['lore'],
        governingStats: { lore: 1 },
        outcomes: {
          bad: { text: 'You promise it gently — tonight the water is kinder, mother — and the fire hears the gentleness and mistrusts it, friends, the way harbors mistrust a flat calm. A promised sea is a watched sea: every wave of tonight’s telling will be audited from the woodpile. You have made the room careful, and careful rooms clap late.', effects: { lore: 3, burnout: 3 } },
          good: { text: '“Tonight,” you tell her, “the captain has learned what shouting costs.” She holds your eye the length of a wave, and nods, and the nod is a lease, friends, not a gift. The fire settles. Somewhere in the dark a man who was going to heckle decides against it — a promise witnessed by a widow has weight even the back row respects.', effects: { lore: 4, athena: 1 } },
          incredible: { text: 'You do not promise the sea — no honest bard can. You promise HER: that if the water rises tonight, the telling will stop, and her man’s name will be said before any wave gets sung. The whole fire exhales. That is the contract this porch has been waiting for since the war, friends, and tonight the bard finally offered its terms out loud.', effects: { lore: 5, athena: 1, burnout: -2 } },
        },
      },
      right: {
        label: 'Tell it exactly as it happened',
        tags: ['might'],
        governingStats: { might: 1 },
        outcomes: {
          bad: { text: '“He shouted. The sea answered. Everyone drowned.” True, flat, and too fast, friends — grief takes its facts slowly or not at all. The widow’s face closes like a door in weather. You have the room’s respect and none of its warmth, and a telling rows on warmth.', effects: { might: 3, burnout: 3 } },
          good: { text: 'You give her last night whole: the shout, the wave, the arithmetic. No softening. And the fire — hear this, friends — leans IN, because a bard who will not flinch from his own bad endings can be trusted with tonight’s. The widow says nothing. She stays. Staying is her verdict.', effects: { might: 4, renown: 1 } },
          incredible: { text: 'Exactly as it happened — and then you say the thing no bard says: “I sang it wrong last night. The shout was not the brave part. Tonight I know better.” A telling that can admit its yesterday, friends, owns its tomorrow: the fire is yours to the last ember, and the widow, on her way out at dawn, touches the bard’s shoulder once — the fee no coin matches.', effects: { might: 5, renown: 1, athena: 1 } },
        },
      },
    },
  },
  {
    id: 'ody_mem_lotus',
    act: 1,
    tags: ['omen'],
    requires: { lastEnding: 'lotus' },
    context: 'The fire, uneasy',
    prompt: 'The potter’s boy asks it plainly, the way boys do: “Will he sit down in the flowers again tonight?” The fire pretends not to listen. The fire is listening with both ears.',
    recap: 'The boy asked about the flowers.',
    choices: {
      left: {
        label: 'Joke it away',
        tags: ['guile'],
        governingStats: { guile: 1 },
        outcomes: {
          bad: { text: '“Only if the flowers buy a round.” The laugh comes, friends, and dies early — a joke on the meadow is a joke on the men still in it, and half this fire has a cousin who never came back from some soft coast or other. The boy does not laugh at all. He wanted an answer, and he files the not-getting-one.', effects: { guile: 3, burnout: 2 } },
          good: { text: '“Tonight he is hungrier for home than for flowers — ask me again at the meadow.” The room takes the deal: a joke that leaves the door open is a promise wearing a grin, friends. The boy accepts it the way boys accept weather, and the telling starts with the fire on your side and one question banked instead of buried.', effects: { guile: 4, burnout: -1 } },
          incredible: { text: '“He will SEE the flowers,” you say, “and you will watch him see them, and that is the game tonight.” You have turned last night’s surrender into tonight’s wager, friends — the whole fire is now betting on one man’s appetite, and a room with a stake in the meadow rows through every verse to reach it. The boy grins like a conspirator. He is one.', effects: { guile: 5, renown: 1, burnout: -2 } },
        },
      },
      right: {
        label: 'Answer him honestly',
        tags: ['lore'],
        governingStats: { lore: 1 },
        outcomes: {
          bad: { text: 'You explain the meadow honestly — the not-wanting, the peace of it, why a tired man sits — and honesty this early is a stone in the boat, friends: the fire came for a voyage and got a lesson, and lessons before the first oar-stroke make a room feel schooled. True, every word. Heavy, every word.', effects: { lore: 3, burnout: 3 } },
          good: { text: '“Last night the meadow won because the man was empty. Tonight we will watch what fills him first.” The boy nods slowly — a real answer, sized for a boy and true for the grown — and the fire quietly resets its bets, friends. A telling that names its own danger before launch rows honester for it.', effects: { lore: 4, athena: 1 } },
          incredible: { text: 'You answer him with the question under his question: “Are you afraid the sitting down looked like rest?” — and the boy says, small, “It looked like my father.” The fire goes still, friends, and then you make tonight’s telling FOR that stillness: every verse of wanting-to-stop sung at a boy who needed to hear that stopping is a thing the strong fight too. He listens like a man tonight. He will row like one someday.', effects: { lore: 5, athena: 2, burnout: -2 } },
        },
      },
    },
  },
  {
    id: 'ody_mem_bank',
    act: 1,
    tags: ['omen'],
    requires: { lastEnding: ['circe', 'calypso'] },
    context: 'The fire, wry',
    prompt: 'The innkeeper says it while pouring, not quite to anyone: “Funny how the tale keeps ending on warm islands.” The cups pause halfway. The fire waits to see whether the bard laughs.',
    recap: 'The innkeeper mentioned the warm islands.',
    choices: {
      left: {
        label: 'Own it, grinning',
        tags: ['guile'],
        governingStats: { guile: 1 },
        outcomes: {
          bad: { text: 'You grin and toast the warm islands, friends, and the grin buys the laugh and spends the tension — but a fire that has laughed at the ending stops fearing it, and a temptation nobody fears is a temptation half-taken already. Tonight’s islands will look VERY comfortable from the benches. You have disarmed your own villain.', effects: { guile: 3, burnout: 2 } },
          good: { text: '“Warm islands are excellent places,” you allow, “for OTHER men’s tellings.” The innkeeper snorts into the wine. The fire relaxes — the bard has seen the shape of his own habit and named it first, friends, which is the only known cure for a running joke. The islands will still be warm tonight. But the room is watching WITH you now, not AT you.', effects: { guile: 4, renown: 1 } },
          incredible: { text: 'You raise your cup to the innkeeper: “Keep pouring like that and tonight’s island will be YOUR house, friend, and none of us will leave it either.” The fire ROARS, the innkeeper bows like royalty, and somewhere in the laughter the telling quietly takes back the power the warm islands had over it, friends — a habit named at full volume in front of witnesses has nowhere left to hide.', effects: { guile: 5, renown: 1, burnout: -2 } },
        },
      },
      right: {
        label: 'Answer it straight',
        tags: ['might'],
        governingStats: { might: 1 },
        outcomes: {
          bad: { text: '“Because the sea is worse.” True, friends, and truly said, and the room hears the tiredness under it — a bard defending the banked endings is a bard who has been defending them to himself. The innkeeper pours the next cup a little gentler. Gentleness from an innkeeper is a diagnosis.', effects: { might: 3, burnout: 3 } },
          good: { text: '“The warm islands are real offers,” you say, “made to real men, and I will not sing them as traps to make the fire feel brave.” The room chews it. Swallows it. Respects it, friends — a telling whose exits are honest makes its rowing-on mean something. The innkeeper tops your cup unasked. That is the porch’s highest review.', effects: { might: 4, athena: 1 } },
          incredible: { text: '“Tonight,” you say, “when the island comes — and it will — I will sing the staying FAIRLY, and then we will see what this captain does.” You have promised the fire a real fight instead of a rigged one, friends, and the fire pays for real fights: men send word to their brothers, the benches fill, and the innkeeper stops charging you for the second cup — he wants a seat for the island verse himself, and he has never once left the till for a song.', effects: { might: 5, renown: 2 } },
        },
      },
    },
  },
  {
    id: 'ody_mem_home',
    act: 2,
    tags: ['kleos'],
    requires: { lastEnding: 'nostos:success' },
    context: 'The fire, greedy',
    prompt: 'A man near the front says what the whole fire is thinking: “Last night he got home. Do it again.” They know the ending now, friends — and a room that knows the ending listens differently: for the seams, for the changes, for the price.',
    recap: 'They asked for the homecoming again.',
    choices: {
      left: {
        label: 'Promise nothing',
        tags: ['guile'],
        governingStats: { guile: 1 },
        outcomes: {
          bad: { text: '“The sea decides,” you say, and the shrug is professional, friends, but the front row paid for a homecoming and heard a disclaimer. The man who asked settles back with his arms folded, friends, and keeps them folded through the whole first water — you will spend three verses earning those arms open again.', effects: { guile: 3, burnout: 2 } },
          good: { text: '“Tonight’s sea has not met tonight’s captain,” you say, and the room grins — the right answer, friends: not a promise, a CHALLENGE, and a fire that has been challenged leans forward instead of back. The man in front settles in like a judge at a contest. Good. Judges pay attention.', effects: { guile: 4, renown: 1 } },
          incredible: { text: '“You know how it CAN end now,” you tell them. “Tonight you learn what it costs when it does — or why it doesn’t when it doesn’t.” And the fire discovers, friends, the second hunger: not what happens, but what it weighs. That is the night a room stops being an audience and becomes a fire that KEEPS a bard. They will take any ending you row to now, so long as it is paid for in front of them.', effects: { guile: 5, athena: 1, renown: 1 } },
        },
      },
      right: {
        label: 'Raise the stakes yourself',
        tags: ['might'],
        governingStats: { might: 1 },
        outcomes: {
          bad: { text: '“Again? Tonight he brings every man home whole.” Brave, friends — and now the fire holds the note like a debt, and every bench lost tonight will be counted against the boast by the woman at the woodpile, who has never once lost a tally. You have signed the telling to its hardest ending in front of witnesses.', effects: { might: 3, burnout: 3, renown: 1 } },
          good: { text: '“Last night he reached the shore,” you say. “Tonight, watch what the shore asks.” You have promised them not the same ending but a DEEPER one, friends, and the room re-tunes: the ones who came for comfort get intrigue instead, which is better for them, whatever they think. The front row stops predicting and starts listening.', effects: { might: 4, athena: 1 } },
          incredible: { text: 'You stand, friends — for this you stand — and say: “Homecomings are not endings. Ask any man who has had one. Tonight the telling goes PAST the shore.” And the fire, which thought it wanted repetition, discovers it wanted permission: half this porch got home from the war years ago and has been waiting since for a song that admits the war does not stop at the door. Tonight they get it. Tonight the fire is FULL.', effects: { might: 5, renown: 2, burnout: -1 } },
        },
      },
    },
  },
  {
    id: 'ody_mem_beach',
    act: 1,
    tags: ['deep'],
    requires: { lastEnding: 'burnout' },
    context: 'The fire, built high',
    prompt: 'The fire is built higher than usual tonight, and nobody says why. The woman by the woodpile has counted extra logs onto it, and she does not look at you as she does it. Last night the telling stopped on a beach, friends, and stayed there.',
    recap: 'They built the fire higher and said nothing.',
    choices: {
      left: {
        label: 'Say nothing back — begin',
        tags: ['guile'],
        governingStats: { guile: 1 },
        outcomes: {
          bad: { text: 'You begin as if last night were any night, and the room lets you, friends, which is its own kind of weight: everyone carrying the unsaid together makes the boat heavy from the first stroke. The extra logs burn. The kindness sits on you like wet wool.', effects: { guile: 3, burnout: 3 } },
          good: { text: 'You begin, and let the higher fire say what the room will not, and take the warmth for what it is — a porch’s way of putting a blanket on a man without embarrassing him. By the third verse the weight is lifting, friends: a telling can carry what a talk cannot. That is what tellings are FOR.', effects: { guile: 4, burnout: -2 } },
          incredible: { text: 'You begin — but first you move your seat closer to the woodpile, wordless, and sing the opening verses from THERE, inside the warmth they built you. Nobody comments. Everybody notices. The whole night rows easier for it, friends, and when the woman adds another log mid-verse you do not stop singing and she does not stop stacking, and that, at this fire, is a whole conversation.', effects: { guile: 5, athena: 1, burnout: -3 } },
        },
      },
      right: {
        label: 'Thank them for the logs',
        tags: ['lore'],
        governingStats: { lore: 1 },
        outcomes: {
          bad: { text: '“Thank you for the fire,” you say, and the words land wrong, friends — named kindness embarrasses this porch, and the woman by the woodpile becomes VERY interested in the wood. The room recovers, but its ease has to be rebuilt log by log, and you are down a verse doing it.', effects: { lore: 3, burnout: 2 } },
          good: { text: '“A high fire for a long way home,” you say — thanks aimed at the ROAD, not the pity — and the woodpile woman permits herself a nod, friends, which from her is a proclamation. The room warms twice: once from the logs, once from watching a man accept help without bleeding on it. The telling launches well-lit.', effects: { lore: 4, athena: 1, burnout: -1 } },
          incredible: { text: 'You thank them the bard’s way: the opening verse tonight is about a crew, far from home, who built their captain’s fire high on a bad night and never once said why — and you watch the porch recognize itself, friends, one face at a time, the innkeeper last. It is the shortest verse you have ever sung and it buys the deepest quiet. Then, into that quiet, you begin the sea.', effects: { lore: 5, athena: 2, burnout: -3 } },
        },
      },
    },
  },
];
