// The Odyssey — the three Landmarks (slice 3): the itinerary's fixed beats.
// Cyclops (end of Act I, chaining into the name-brag the Crossroads reads),
// the Underworld (end of Act II — Tiresias), and the Suitors' Hall (the
// finale's per-path climax cards; the finalSet three doors live on the
// presenter). Variants are requires-gated: which doors open depends on the
// voyage that got you there.

import type { GameEvent } from '../../types.js';

// Guaranteed act-boundary set-pieces, never in the deck's random flow. The
// three-door grammar at real stakes; the variants are requires-gated, so
// which doors open depends on the voyage that got you there. Chains overrun
// the act length by design (advance() honors pendingChainId first) — the
// Crossroads lands immediately after the Cyclops chain, as the grill demands.
export const LANDMARKS: GameEvent[] = [
  // ── LANDMARK I: THE CYCLOPS ──
  {
    id: 'ody_cyclops',
    act: 1,
    tags: ['landmark', 'beat:cyclops'],
    context: 'The cave — Landmark',
    prompt: 'The cave smells of curds, and under that of something older and worse. Then the light at the cave mouth goes out all at once — not a cloud. A stone, the size of your ship, set in the doorway the way you would set a cup on a table. Whatever shepherds here has just shut you in with it.',
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
    prompt: 'Smoke you know, from a hearth you built, and at the long tables a hundred strangers eating your herds to the bone while your wife weaves upstairs and unweaves at night. The beggar’s rags itch. One door left, friends — the one with your name on it.',
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
    prompt: 'They know the songs in this hall — that is the bitter joke of it. A hundred suitors trade verses about the man who tricked Troy, never once looking at the beggar by the door. The name you bought with the sea’s hatred sits in their mouths. Time to collect it.',
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

  // The third question (slice 6): exists only for the bard who has carried
  // both other fragments home across earlier Tellings. The itinerary plugin
  // reroutes the Underworld's chain here when the run carries ody_frag_bow
  // AND ody_frag_sea (stamped from the pack meta-save at setup). Knowledge-
  // only, exactly as the grill demands: the door it opens is the Oar Road.
  {
    id: 'ody_tiresias_oar',
    act: 2,
    chainOnly: true,
    tags: ['landmark'],
    context: 'The prophet at the trench — the whole of it',
    prompt: 'The blind man drinks, and straightens, and knows you — and this time, friends, you know HIM: two tellings’ worth of his answers are already in your keeping. “The bow. The sea’s price. You have both,” he says slowly. “Then there is only the road after the hall. No one asks me for the road after. Ask.”',
    recap: 'The prophet offered the road after.',
    forceTier: { left: 'good', right: 'good' },
    choices: {
      left: {
        label: '“Speak the road after the hall.”',
        tags: ['landmark', 'lore'],
        governingStats: { lore: 1 },
        outcomes: {
          bad: { text: '“When the hall is washed,” he says, “take a well-cut oar and walk inland — inland, sailor — until someone asks why you carry a winnowing fan. Plant it there. Pay the sea its bull, its boar, its ram. Then home, and an ease of years, and death will come to you OFF the water, mild as evening. That is the whole of it. No man has ever walked it.” He waits. “Yet.”', effects: { athena: 1, addFlag: 'ody_oar_road' } },
          good: { text: '“When the hall is washed,” he says, “take a well-cut oar and walk inland — inland, sailor — until someone asks why you carry a winnowing fan. Plant it there. Pay the sea its bull, its boar, its ram. Then home, and an ease of years, and death will come to you OFF the water, mild as evening. That is the whole of it. No man has ever walked it.” He waits. “Yet.”', effects: { athena: 1, addFlag: 'ody_oar_road' } },
          incredible: { text: '“When the hall is washed,” he says, “take a well-cut oar and walk inland — inland, sailor — until someone asks why you carry a winnowing fan. Plant it there. Pay the sea its bull, its boar, its ram. Then home, and an ease of years, and death will come to you OFF the water, mild as evening. That is the whole of it. No man has ever walked it.” He waits. “Yet.”', effects: { athena: 1, addFlag: 'ody_oar_road' } },
        },
      },
      right: {
        label: '“The hall first. The bow.”',
        tags: ['landmark', 'might'],
        governingStats: { might: 1 },
        outcomes: {
          bad: { text: '“The bow,” he agrees, and gives the fighting answer whole — the axes, the slow stringing, the barred doors — and something in the dead man’s face closes like a ledger. The road after the hall goes unasked one more telling. He turns away. The dead, friends, do not sigh. It only sounds exactly like it.', effects: { addFlag: 'ody_fore_bow' } },
          good: { text: '“The bow,” he agrees, and gives the fighting answer whole — the axes, the slow stringing, the barred doors — and something in the dead man’s face closes like a ledger. The road after the hall goes unasked one more telling. He turns away. The dead, friends, do not sigh. It only sounds exactly like it.', effects: { addFlag: 'ody_fore_bow' } },
          incredible: { text: '“The bow,” he agrees, and gives the fighting answer whole — the axes, the slow stringing, the barred doors — and something in the dead man’s face closes like a ledger. The road after the hall goes unasked one more telling. He turns away. The dead, friends, do not sigh. It only sounds exactly like it.', effects: { addFlag: 'ody_fore_bow' } },
        },
      },
    },
  },
];
