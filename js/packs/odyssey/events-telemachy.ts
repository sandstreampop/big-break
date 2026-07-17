// The Odyssey — the Telemachy (pass 34): the son, threaded through the
// telling. The poem opens with the boy, and the game never mentioned him
// until the Hall; these four seas put the missing third back — as the
// deck's FIRST within-run story arc. No card here is a set-piece: the
// thread is rumor-sized on purpose (a grain-ship, a tin-trader, a fisher),
// the way news of a family actually crosses a war.
//
// The mechanism is flags, not chains: chainEventId deals the next card
// IMMEDIATELY (landmark grammar), but a thread must cross acts. The act-1
// question stamps how the father answered (word vs silence, on every tier
// — the flag records the CHOICE, not the luck); the act-2 continuation
// requires either answer and stamps the watch; each act-3 payoff requires
// the watch AND one act-1 answer, so the ending of the thread remembers
// its beginning. The itinerary plugin deals eligible continuations at 4×
// weight (the fire does not mumble — same law as the memory cards), so a
// thread that starts usually finishes.
//
// Voice: the boy is never named — this fire calls him "the boy" and "the
// son", the same way it will not say whose forearms carry the rope-scars.

import type { GameEvent } from '../../types.js';
import { sea } from './events.js';

export const TELEMACHY_EVENTS: GameEvent[] = [
  sea('ody_tel_grain_ship', 1, {
    tags: ['omen'],
    prompt: 'A grain-ship out of Pylos backs her sail at oar-length, and her master calls the fleet by name — then, quieter, across the water: the house is filling with suitors, and the boy stands at the harbor most evenings, watching for sails.',
    recap: 'The grain-ship spoke of the boy.',
    left: {
      label: 'Send word down the grain-road', approach: 'guile',
      extra: {
        bad: { addFlag: 'ody_tel_word' },
        good: { addFlag: 'ody_tel_word' },
        incredible: { addFlag: 'ody_tel_word' },
      },
      bad: 'You give the master a message and a bracelet for carriage, and the grain-road does what roads do: by Pylos the words are half his, by Ithaca they are nobody’s — a rumor of a rumor, wearing your name like a borrowed cloak. Still, friends, even mangled word is word: somewhere in the noise the boy hears that the sea has not finished with his father. He keeps standing at the harbor. Now he stands there ARGUED WITH, which for a boy that age is nearly company.',
      good: 'You keep it short, because short travels: ALIVE. COMING. LOOK TO THE HOUSE. The master says it back twice, takes no payment — some debts, he says, the war left on every doorstep — and puts the wind behind it. It is one strand of spider-silk across four hundred miles of water, friends. But a boy who has one true sentence to hold can carry a great deal of waiting on it.',
      incredible: 'You send no message at all — you send a QUESTION: “Ask the boy what he has done about the woodpile by the north wall.” The master frowns and carries it. Months on, friends, at a fire like this one, I heard the answer that came back down the road: “Tell the man the woodpile is STACKED.” Nothing a suitor could read. Everything a father needed. That is how you speak across a war, friends — in a language two people own.',
    },
    right: {
      label: 'Send nothing — silence shields him', approach: 'lore',
      extra: {
        bad: { addFlag: 'ody_tel_silence' },
        good: { addFlag: 'ody_tel_silence' },
        incredible: { addFlag: 'ody_tel_silence' },
      },
      bad: 'You send nothing, for good reasons said well: a marked boy is a target, word invites the knife. The reasons are true, friends, and the silence does what silence does anyway — it teaches the house that hope is a private habit, done alone, at the harbor, in all weathers. Some shields weigh more than the blow they stop. You will not know the weight of this one for years.',
      good: 'You send nothing. A named boy is a marked boy; the suitors read every hull that comes in. The master nods slowly — he has sons — and backs away with the secret sitting easy in him. The boy gets no word, friends. He also gets no knife in an alley with a trade-ship’s name on it. At that harbor, in these years, that is a father’s arithmetic.',
      incredible: 'You send nothing — and then you buy the ship’s WHOLE silence: wine for the crew, a coin for the master, and one sentence traded for it: “You never crossed us. You saw wreckage off Crete.” It is the first false report of your own death you have ever commissioned, friends, and it lands in Ithaca like winter: the suitors grow lazy, the ambitious grow open, and a boy who believes nothing the harbor says begins, quietly, to make his own inquiries. Grief is a hard gift. Cunning came wrapped in it.',
    },
  }),

  sea('ody_tel_traders_return', 2, {
    tags: ['omen'],
    requires: { anyOf: [{ flagsAll: ['ody_tel_word'] }, { flagsAll: ['ody_tel_silence'] }] },
    prompt: 'The trade road answers at last, in a tin-trader’s mouth: the boy has SAILED — Pylos first, then Sparta, asking the old kings after his father. And behind him, at the strait of Same, a dark ship waits with the suitors’ best spears aboard, for a young keel coming home.',
    recap: 'The boy has sailed; the strait is watched.',
    left: {
      label: 'Ask the owl to walk with him', approach: 'lore',
      extra: {
        bad: { addFlag: 'ody_tel_watched' },
        good: { addFlag: 'ody_tel_watched' },
        incredible: { addFlag: 'ody_tel_watched' },
      },
      bad: 'You make the evening offering with a father’s special clumsiness, wanting it too much, and the fire spits and the men look away kindly. No sign comes, friends. Above you the sky goes about its stars as if boys sail home safe every day of the year. Prayer is the one oar that gives you no purchase to feel. You row it anyway, every night after.',
      good: 'You pour for the grey-eyed one and say the thing plainly — not MY life, hers to spend as she likes, but the boy has done nothing except be mine. The fire draws long and quiet, friends, the way it does when something is listening. Far off, at Sparta, they say a guest rose from the king’s table that same evening and asked for his ship. Say it was coincidence. His course home, they say, missed the strait by a goat-channel nobody sane uses.',
      incredible: 'You pour, and then, friends, you do the harder thing: you stop asking. “You have walked with me ten years,” you tell the dark. “I have never once asked where you walk when you leave. If it is beside him, I withdraw the question.” The fire stands straight up, no wind. It is the only prayer of the voyage that felt ANSWERED at the saying of it — and months later, a swineherd will swear the boy stepped ashore with an owl on the byre roof and a course no one taught him.',
    },
    right: {
      label: 'Trust the boy’s own keel', approach: 'might',
      extra: {
        bad: { addFlag: 'ody_tel_watched' },
        good: { addFlag: 'ody_tel_watched' },
        incredible: { addFlag: 'ody_tel_watched' },
      },
      bad: 'You say it loud so the benches hear it: he is MY son; the strait will need more ships. It is a fine sentence, friends, and it costs you the whole night after, awake at the stern with the arithmetic a father does in the dark: his crew young, his pilot bought with what? Pride at sundown is often a loan. The interest comes due at the hour of the wolf.',
      good: 'He raised a CREW, friends — at his age, with the house against him, he raised a crew. You say so at the fire and the saying steadies you more than prayer would: whatever else the boy inherited, he inherited the raising of men, and men raised well read a watched strait the way gulls read weather. You row on. Somewhere north, on your own dark water, a young helm makes the same choice you would make.',
      incredible: 'You trust him — and you make the trust USEFUL, friends: you tell the benches every trick of the home strait you know, out loud, as a night’s tale — the goat-channel, the false lights, where the current lies about itself — and you let the tale get away from you, deliberately, at the next two harbors. A tale travels faster than a hull. It reaches home waters before any ambush closes. If the boy hears one harbor’s version of his father’s trick, friends, the strait belongs to HIM. It did. It does.',
    },
  }),

  sea('ody_tel_strait_word', 3, {
    tags: ['omen'],
    requires: { flagsAll: ['ody_tel_watched', 'ody_tel_word'] },
    prompt: 'At the last water a fisher hails you, unafraid — his brother pilots the home strait. A young ship came through in the dark of the month, he says, by the goat-side channel, past a black hull full of waiting spears — steered as if word had gone ahead of her.',
    recap: 'The boy slipped the strait; word had gone ahead.',
    left: {
      label: 'Press for the harbor tonight', approach: 'might',
      bad: 'You lean the fleet at the last water like a man leaning at a door, and the sea, which has all the time there is, makes you pay the lean: a sprung seam, a night bailing, the harbor no closer. The fisher watches with the tact of his trade. The boy did his part COLD, friends, and his father nearly spent two hulls on being proud of him. Ten years of patience, and the last mile finds the old hurry alive and well.',
      good: 'You put the news in the benches like meat: the boy is THROUGH, the word held, the road home has a light on it — now ROW. And they row, friends, the way men row toward proof that something they did in the dark years worked: the stroke long, the count unforced. The word you sent from a grain-ship a decade of grief ago rowed ahead of you the whole way. Tonight the fleet rows to catch it up.',
      incredible: 'You press — but like a pilot now, friends, not a boy: the goat-channel your son used, YOU use, on his proof that it runs clean, father steering in the son’s wake for the first time in either of their lives. The black hull at the strait mouth never sees the fleet that passes it one channel over, close enough to hear the sentries’ dice. The fisher’s brother tells it in two harbors by morning: the house’s luck has turned, and it turned FAMILY FIRST.',
    },
    right: {
      label: 'Land dark and count the spears', approach: 'guile',
      bad: 'You land dark to count the waiting spears, and the counting, friends, is fine work wasted: a goat-boy sees the fleet’s cookfire smoke and the count runs BOTH ways by dawn. The black hull knows a big fleet is in the water now, and pulls for home to warn the house. You learned their number. They learned yours. The sea calls that trade even. The sea is a poor bookkeeper of fathers’ nerves.',
      good: 'You land dark, and by midnight you have it all, friends: twenty spears, two watches, a bored helmsman who sings. And names — harbor-boys grown into ambushers, sons of men you led at Troy. You say the fathers’ names over the fire, one by one, like a rite done backward. Whatever waits at the house, you will not swing blind into it. The boy slipped these men in the dark. His father now knows them by their fathers.',
      incredible: 'You count the spears — and then, friends, you SPEND the count: a fisher’s boy, a coin, and one sentence carried to the black hull at dawn: “The old man’s fleet is in home water, and he knows your twenty names.” Nothing else. By noon the strait is empty — not fought, not fooled: DISBANDED, each spear gone home to make its separate peace before a king lands. The best ambush you ever broke, and the weapon was a headcount and a child’s errand. Troy would have taken notes.',
    },
  }),

  sea('ody_tel_swineherd_door', 3, {
    tags: ['omen'],
    requires: { flagsAll: ['ody_tel_watched', 'ody_tel_silence'] },
    prompt: 'The last water brings it in a swineherd’s cousin’s mouth, traded oar-to-oar: a young man came to the pig-keeper’s door above the harbor — by the hill path, at dusk, hooded like a beggar — and the old man wept on his neck. No harbor saw the boy land. No one taught him that door.',
    recap: 'The boy came in by the swineherd’s door.',
    left: {
      label: 'Bless the caution you never taught', approach: 'lore',
      bad: 'You hear it and the pride comes with a splinter in it, friends: nobody taught him. That is the sentence that keeps the watch with you all night. The silence you sent instead of word — it taught him, the way winter teaches: thoroughly, and without love. The boy moves like his father now. His father spent ten years learning what that costs, and was not there to say so.',
      good: 'The hill path, the dusk hour, the loyal door — it is your own homecoming, friends, planned by a boy who has never seen you make one. You bless the caution at the fire, formally, wine down for the grey-eyed one who clearly walks with him — because no one TAUGHT him that door, and cunning that arrives untaught is either blood or the owl, and either way it watches over him better than word ever could have.',
      incredible: 'You bless it, and then you READ it, friends, like a pilot reads water: the swineherd’s door means the boy trusts the old loyalties and none of the new; dusk means he numbers the suitors’ eyes; the beggar’s hood means he has already thought the thought his father took ten years to earn — that a king comes home strongest UNDER his kingliness, not in it. You know, now, exactly what shape the house’s war will take, and who planned it before you landed. It runs in the family. The family, at last, runs toward each other.',
    },
    right: {
      label: 'Make for that same door', approach: 'guile',
      bad: 'You set course for the pig-keeper’s door yourself — and nearly ruin it, friends: two hooded men on one hill path is a PATTERN, and patterns are what the suitors pay watchers for. You lie a night in the gorse above the byre, close enough to smell the fire your son sits at, unable to knock, while a paid pair of eyes takes its time losing interest in the path. The longest night of the ten years, and I include the horse.',
      good: 'The same door, friends — where else? Loyal ground, high sight-lines, and now a second cloak on the hill path at dusk. The pig-keeper opens, takes one look, and this time does not weep: he LAUGHS, once, like a man whose stores came in before the frost. Inside, by a small fire, sits the reason the door was chosen. What was said first at that fire stays at that fire. Even bards, friends, have doors they do not sing past.',
      incredible: 'The same door — but you knock as the beggar, friends, staff and stoop and ten years of salt for a costume, and you let your own son look straight through you for the length of a cup of wine. Not cruelty: ARITHMETIC. If the disguise holds against the eyes that want most in the world to see through it, it will hold against a hall of men who want him dead. It holds. And when you let it fall — that, friends, is the only part of all ten years I will not try to say. The trench, the giant, the god’s whole sea: sayable. Not that.',
    },
  }),
];
