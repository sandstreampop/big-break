// The Odyssey — Act I deck: The Sack and the Sea (slice 4, the authored sea).
// Full expedition, hubris available: Cicones, Lotus Eaters, storms, omens.
// Telling weather — the epic roll, bright side up; the sea's oldest trick is
// how kind it looks. Voice law: docs/games/odyssey/VOICE.md; canon seeds:
// GUIDING_EXAMPLES.md. Effect budgets are shared (events.ts) so tuning
// lives in one place; the words are each card's own.

import type { GameEvent } from '../../types.js';
import { sea } from './events.js';

export const ACT1_EVENTS: GameEvent[] = [
  sea('ody_a1_cicones', 1, {
    tags: ['deep', 'blood'],
    prompt: 'Ismaros burns behind you, and the men want one more day of it — the wine is found, the cattle are fat, and the hill tribes are, they insist, far away.',
    recap: 'The men lingered at Ismaros.',
    left: {
      label: 'Drag them to the ships', approach: 'might', risky: true,
      bad: 'You get half of them aboard before the argument becomes a brawl on the beach — and then the hill tribes are not far away at all, and the last two boats load under spears. The benches are quieter that night, and not from shame.',
      good: '“Up. Now. All of you.” The captain’s voice from Troy still works one more time; they grumble to the oars with their arms full of cheeses, and from the swell you watch horsemen come down to a beach with no one on it.',
      incredible: 'You do not shout. You walk the tide line kicking each man’s feet and naming his wife, and the whole expedition is afloat and laughing before the wine is even corked. From the ridge the hill tribes watch the wake, and one of them, they say, began the first song about you.',
    },
    right: {
      label: 'One day — posted watches', approach: 'guile', risky: true,
      bad: 'The watches watch the feast instead of the hills. What comes down at dusk comes down riding, and the beach becomes the kind of arithmetic the songs skip. You get the ships off. You do not get everyone to the ships.',
      good: 'One day, watches doubled, wine rationed by your own hand at the jar. When the horsemen crest the ridge at dawn you are already a sail’s width out, close enough to hear them curse, far enough to make it music.',
      incredible: 'You feast them in armor — meat in one hand, spear in the other, sentries swapped by the hourglass. The hill tribes come, look down at a beach that looks back, and go home. The men talk about it for weeks: the party that was also a phalanx.',
    },
  }),
  sea('ody_a1_squall', 1, {
    tags: ['deep', 'omen'],
    prompt: 'The wind backs at dusk — one cold breath out of the north, and the sea goes the colour of a bruise. Old Perimedes is lashing the jars without being told.',
    recap: 'A squall came down at dusk.',
    left: {
      label: 'Run before it', approach: 'might', risky: true,
      bad: 'The following sea takes the steering oar out of Eurylochos’ hands and swats it flat, like a door slammed in a great house. Dawn finds you bailing with helmets, and the morning count comes up two benches short. No one says the names loudly.',
      good: 'You run all night with the storm grumbling behind you like a cheated innkeeper, and at first light the lookout laughs out loud — twelve sails, all twelve, strung out and whole on a flat grey sea.',
      incredible: 'The ship finds the storm’s own stride and holds it. Men who were praying at midnight are singing by the middle watch, and years from now there will be rowers who claim they pulled an oar that night who were never there.',
    },
    right: {
      label: 'Give the sea its due', approach: 'lore', risky: true,
      bad: 'The libation goes into the water and the water does not care. A long night, hove-to, the hull working under you like a beast in a bad dream; by morning the seed-grain jars are brine, and the hungry months are laid down like a keel.',
      good: 'You pour the old wine — the good jar — and say the sailor’s words your father used. The storm walks past in the dark two miles to leeward. You hear it all night, like a war you were not invited to.',
      incredible: 'The wine goes into a black sea and the sea goes quiet the way a hall goes quiet when a king stands. In the morning a following wind sets in from the south-west and stays three days, and not a man aboard will speak of it above a whisper.',
    },
  }),
  sea('ody_a1_lotus_shore', 1, {
    prompt: 'A soft country, and three men sent for water come back slow-eyed and smiling, with flowers in their fists and no memory of the ships.',
    recap: 'Three men tasted the lotus.',
    left: {
      label: 'Carry them back bound', approach: 'might',
      bad: 'They fight you, friends — gently, the way sleepers fight waking, which is worse. One slips the rope at the shallows and has to be run down in front of the flower-people, who watch with mild, sorry eyes. He weeps the whole first day at sea, at nothing, at everything.',
      good: 'You bind them to their own benches, kindly, and they weep as the shore goes — then eat like wolves at dusk and cannot say why. By the second day the smiles are their own again. Nobody asks what the flowers tasted like. Everybody wants to.',
      incredible: 'You carry them aboard yourself, one over each shoulder and one walked like a bride, talking the whole time about their mothers, their debts, the roofs they meant to mend. By nightfall one of them is laughing at you. It is the best sound the fleet has made since Troy.',
    },
    right: {
      label: 'Trade for safe passage', approach: 'guile',
      bad: 'The flower-people trade generously — of course they do; the meadow does their bargaining. Two more men sample the goods while you haggle, and now there are five to carry, and the price of the water was a day and a little of everyone’s certainty.',
      good: 'You trade bronze for water and never let a man ashore without a chewed bitter root of your own choosing in his cheek. The flower-people wave from the meadow as you go, content, unhurried — the most frightening hosts of the whole voyage, and the politest.',
      incredible: 'You sit with their old ones in the meadow and decline the dish so gracefully they adopt you for an afternoon. Water, figs, a sea-chart scratched in a flat stone — all for the story of a burning city they will forget by dusk. Both sides part certain they got the better bargain.',
    },
  }),
  sea('ody_a1_omen', 1, {
    tags: ['omen'],
    prompt: 'At first light, birds cross the fleet right to left — nine of them, then one, and the one is an owl, which does not fly by day.',
    recap: 'An owl crossed the fleet by day.',
    left: {
      label: 'Read it for the men', approach: 'lore',
      bad: 'You read it aloud and read it wrong — nine years, you say, nine islands, who knows — and the men hear only that their captain saw an omen and blinked. The owl does not come back to correct you. Owls never do.',
      good: 'Nine birds for the nine years behind you, you tell them, and the tenth flying alone for the road ahead — hard, but watched. The men pull better all morning. Whether the reading was true, friends, the rowing was.',
      incredible: 'You read it silent first, then aloud, and this time the words come from somewhere steadier than you: watched, you tell them. Not loved — watched. That is worth more at sea. Even Eurylochos rows like a man someone is keeping score for.',
    },
    right: {
      label: 'Call it a bird', approach: 'guile',
      bad: '“It is a bird,” you say, and the fleet’s three unofficial priests take offense on the sky’s behalf, and by evening the story is that the captain mocked an omen, which is a worse omen than the omen. The oars drag with borrowed dread.',
      good: '“It is a bird,” you say, “and this is an oar,” and you hand the nearest worrier his. Work is the cure for prophecy. By noon the owl is a joke, and the joke rows.',
      incredible: '“A bird,” you say — and then, quietly, to the helmsman only: “steer where it flew anyway.” The men get the comfort of a captain above superstition, and the ship gets the heading. Both were needed. Only you know both happened.',
    },
  }),
  sea('ody_a1_ration', 1, {
    prompt: 'The seed-grain jars stand between the men and short rations, and Eurylochos is doing the arithmetic aloud, which never helps.',
    recap: 'The ration argument.',
    left: {
      label: 'Set the ration yourself', approach: 'might',
      bad: 'You set the measure and hold it, and it holds — but Eurylochos recalculates nightly at the water barrel, louder each time, and hunger does his arguing for him. The measure survives. The mood does not.',
      good: 'You set the measure, eat it yourself first, visibly, from the same scoop. Complaints starve faster than men do. The seed-grain sleeps whole in its jars, dreaming of a farm on Ithaca.',
      incredible: 'You set the measure and then out-eat nobody: the captain’s bowl is the smallest on the ship, every meal, where everyone can count it. Within a week the men are policing each other’s portions out of shame. Eurylochos does the arithmetic silently now.',
    },
    right: {
      label: 'Recount the stores at night', approach: 'guile',
      bad: 'Counting jars by lamplight looks, to a man coming off watch, exactly like a captain skimming. The rumor is aboard all twelve ships by noon and rows faster than you can. Nothing was taken. Everything was.',
      good: 'You count at night and find what night-counting finds: a cracked jar weeping grain, a rat’s dynasty, a false bottom of somebody’s private hoard. Fixed, drowned, and shared out, in that order. The arithmetic improves overnight.',
      incredible: 'You count at night with Eurylochos himself holding the lamp — let the loudest auditor audit. By morning he is the ration’s fiercest defender, because now it is his arithmetic. A man will guard a number he was allowed to check.',
    },
  }),
  sea('ody_a1_wake_dead', 1, {
    tags: ['omen'],
    prompt: 'A man from Ismaros dies of his wound in the night, the first since Troy, and the crew watch how their captain buries him.',
    recap: 'The first burial of the voyage.',
    left: {
      label: 'Full rites, half a day', approach: 'lore',
      bad: 'The rites are right and long, and the wind that was fair for Ithaca spends itself on a beach where you stand singing. You buy the dead man his crossing at the fair price. The living do the paying, later, in oar-strokes.',
      good: 'Half a day, the cairn, the barley, the wine, his name said whole three times over water. The men row away quiet and easier, every one of them now certain of the fare he’ll be paid himself if it comes to it. That certainty pulls like a fifth bench.',
      incredible: 'You give him the rites of a captain, though he pulled the ninth oar — and every rower aboard understands the message wrapped in the honor: there are no ninth oars on this fleet. Men have followed kings for less. Yours already do.',
    },
    right: {
      label: 'A soldier’s cairn, then oars', approach: 'might',
      bad: 'Quick stones, a fast word, wet eyes on dry duty — soldierly, and it lands wrong at sea, where the dead have so much more water to cross. The men row hard and say little, and the little they say is not about the weather.',
      good: 'A soldier’s cairn, built by soldiers, fast and square, and his oar set upright in it — the mark of a rower, seen a mile off. Then away on the tide he would not have wanted wasted. It is a grave a man from Troy reads correctly.',
      incredible: 'You build it fast and right, and then, pulling out, you have the whole fleet ship oars for one stroke — twelve crews, one silence, one splashless glide past the point. No rite in the books does that. The books, friends, are missing one.',
    },
  }),
  sea('ody_a1_race', 1, {
    tags: ['kleos'],
    prompt: 'Nestor’s son races you for the honor of first wake out of the roads, his rowers grinning across the water at yours.',
    recap: 'A race out of the roads.',
    left: {
      label: 'Row them down', approach: 'might',
      bad: 'You row them down and past — and a bench catches a crab at full sprint, and the whole beautiful surge dissolves into oar-clatter and swearing while Nestor’s boy sails by, saluting. He will dine on that salute for a season.',
      good: 'Stroke for stroke and then not: your crews find the extra that Troy put in them, and the roads open ahead of your prow first. The grins cross the water in the other direction now. Cheap glory, friends — the good kind. It buys a whole day’s morale.',
      incredible: 'You win it going away, and then — this is the part the rowers still tell — you swing wide, come back, and take his ship’s line to tow through the crosscurrent, victor hauling vanquished, both crews roaring. Nestor’s son tells it best himself, which is how you know it was done right.',
    },
    right: {
      label: 'Cut inside the shoal line', approach: 'guile',
      bad: 'The shoal has moved since the chart was young. You win the race and lose a strake, and the carpenter’s look as the water comes up through the boards is a verse of its own. Pumps, all the way to the next beach. Nestor’s son offers help. That is the worst part.',
      good: 'The old pilot’s trick: inside the shoal at half-tide, where a keel your draft can just slip. His deeper ship must go around; yours is anchored and smug when he arrives. “That is cheating,” he calls across. “That is seamanship,” you call back. Both true.',
      incredible: 'You cut inside so clean the shoal never knows you passed, and the watching harbor takes up the story by nightfall: the captain who sails where water only rumors it goes. Nestor’s son asks, privately and properly, to be shown the line. You show him. Legends who teach make more legend.',
    },
  }),
  sea('ody_a1_stranger', 1, {
    tags: ['omen'],
    prompt: 'A castaway on a spar, half-dead, salt-white — and wearing, when you look twice, a guest-gift armband from a house that owes yours.',
    recap: 'A castaway with a guest-debt.',
    left: {
      label: 'Honor the old bond', approach: 'lore',
      bad: 'You feed him, clothe him, name the bond — and he honors it with a story so long and so freighted with his family’s feuds that by the third night the men are drawing lots for whose watch has to sit with him. Some debts, friends, collect interest in words.',
      good: 'Water, wine, dry wool, and the words said properly: the guest-right given before the questions. He turns out to be a pilot of these very waters, and pays his passage in reefs and anchorages you would have found the hard way. The old law works, when worked.',
      incredible: 'You honor the bond in full — and at the next island, where his kin turn out to hold the harbor, the armband on his wrist and the story in his mouth open doors that bronze could not. Guest-law is a net, friends, knotted wide across the whole sea. Tonight you fished with it.',
    },
    right: {
      label: 'Question him first', approach: 'guile',
      bad: 'You question him like a spy while the salt still cracks on his lips, and he answers like an offended man, which he is. The men watching learn something about their captain’s hospitality they file away for their own bad days. He earns his keep, and never once looks at you.',
      good: 'Questions first, kindness a breath behind — enough order to be safe, enough warmth to be right. His story checks true from three directions, and only then does the wine come out. Careful is not cruel, friends. The sea makes liars; a captain must make sure.',
      incredible: 'You question him so gently he never feels the search: an hour of easy talk that maps his whole life, checks every seam of it, and ends with him certain he has made a friend — which, the test being passed, he has. The men call it hospitality. It was also an interrogation. The best of both usually is.',
    },
  }),
  sea('ody_a1_wind_gate', 1, {
    tags: ['deep'],
    prompt: 'The cape the pilots call the Gate stands white-fanged at the tide’s turn. Beyond it, the short way. Around it, three days.',
    recap: 'The Gate at the tide’s turn.',
    left: {
      label: 'Take the Gate at slack', approach: 'lore', risky: true,
      bad: 'You read the tide a half-glass wrong, and the Gate reads you perfectly. The passage is eleven minutes of standing waves and one long grinding kiss against the fang rock; you are through, and lighter by a spare mast and everyone’s stomach.',
      good: 'You wait for slack the way the old pilots teach: watching the weed, not the water. When it hangs straight down you go, and the Gate is a millpond for exactly as long as you need it, and the men come through it converted to the church of paying attention.',
      incredible: 'You take twelve ships through on one slack, line astern, each helmsman steering the wake ahead — and the fishermen on the cape stand up in their boats to watch it done. Their grandchildren will claim it took a god. It took the weed hanging straight, and nerve.',
    },
    right: {
      label: 'Pull the long way round', approach: 'might', risky: true,
      bad: 'Three days becomes five when the headwind hears your plan. The men pull until their hands leave prints on the looms, and the Gate, when you finally clear its far side, sits flat and silvery in the calm — smug, if a rock can be smug. Rocks, friends, can be smug.',
      good: 'Three honest days of rowing, spelled and sung, and around the point you come with dry keels and every man aboard. The short way is only shorter, the pilots say, if you arrive. Perimedes says nothing, and mends a net he did not need to mend, contentedly.',
      incredible: 'You make the long way pay: a beach the first night with sweet water, a shoal of tunny the second the men still describe with their hands wide apart, and on the third a following wind as if the sea were apologizing for the detour. Prudence is rarely this photogenic. Enjoy it.',
    },
  }),
  sea('ody_a1_feast', 1, {
    prompt: 'Landfall on a kind island, goats on the hills, and the men look at you with one question in forty faces: tonight, may they be men and not oars?',
    recap: 'A feast asked for, and answered.',
    left: {
      label: 'Feast them properly', approach: 'guile',
      bad: 'You feast them properly and they feast improperly, and the morning tide is missed by a fleet holding its head with both hands. Worth it, the men insist, at half-volume. The lost tide does not answer. Tides never do.',
      good: 'Nine goats to the fleet, a tenth to your own ship — captain’s honor — and wine in the good measure. Songs happen. Wrestling happens. A man weeps about his dog. By morning the whole expedition is younger. That was the cargo you actually took on, friends: a day of being men.',
      incredible: 'You feast them and you feast them CLEVERLY: the games have prizes, the prizes are tomorrow’s chores gambled away, and the night’s last song is started by you and finished by forty voices that forgot they were tired. Troy took years off these men. Tonight put one back.',
    },
    right: {
      label: 'Feast — but pour to the gods first', approach: 'lore',
      bad: 'The libation is poured first, and generously — too generously, mutters the quartermaster, watching the good vintage soak the sand while the men drink the sour. Piety with someone else’s wine, friends, is a sermon nobody claps for.',
      good: 'First portion to the fire, first wine to the sand, the words said before the appetite. It costs five minutes and a cupful, and it buys the feast a shape: men who began with grace end with singing instead of brawling. Mostly. The exception is wrestling-related and forgiven by dawn.',
      incredible: 'You pour to the gods and name each one’s portion aloud — and a wind-shift at that exact moment flattens the fire and stands every hair on forty arms. Coincidence, probably. But the feast that follows is the most orderly bacchanal in naval history, and the story of the wind arrives home before you do.',
    },
  }),
  sea('ody_a1_gear', 1, {
    prompt: 'The third ship’s mast is sprung — it will hold in fair weather, and the fair weather is ending, and the carpenter wants a day you do not have.',
    recap: 'The sprung mast.',
    left: {
      label: 'Fish it with spare oars', approach: 'guile',
      bad: 'The fished mast holds beautifully until it matters, which is the way of clever repairs. It lets go in the first real blow — slowly, warningly, no one hurt — and now the fix costs two days on a worse beach, plus the oars it ate on the way.',
      good: 'Two spare oars, wet rawhide served tight, and the carpenter’s grudging nod — the fleet sails on the tide with a mast wearing splints like a soldier who refuses to be left. It holds. Clever, friends, is a material, same as oak. It just needs re-checking more often.',
      incredible: 'The lashing you improvise is one the carpenter has never seen, and he is a hard man to show a knot. He copies it onto a shingle with charcoal before you have finished tying it. Years on, riggers two seas away will call it by a name that is almost yours.',
    },
    right: {
      label: 'Give the carpenter his day', approach: 'might',
      bad: 'The day becomes two, as carpenter days do, and the fair weather spends itself on your idleness. You sail at last with a perfect mast into a falling glass, and take in the first reef of the season wondering which choice the storm would have preferred. Storms do not say.',
      good: 'You give him the day and stand it out of the way: timber found, scarfed, seated, and the ship stronger at that station than the day she was launched. The weather turns as you clear the bay — turns, and finds nothing aboard for it to break. That is what the day bought.',
      incredible: 'You give him the day and the whole fleet’s idle hands with it, and the carpenter — a man of few words and fewer compliments — runs the beach like a warlord. Every ship gets touched. The fleet that leaves that bay is better found than the one Troy launched. He never says thank you. He builds it instead.',
    },
  }),
  sea('ody_a1_lookout', 1, {
    prompt: 'Smoke on the horizon at dusk: one thread of it, tended, deliberate. The charts say the island is empty. The smoke says the charts are wrong.',
    recap: 'Smoke where the chart said empty.',
    left: {
      label: 'Stand in and see', approach: 'might',
      bad: 'You stand in, and the beach fills as you close — not a village, a muster. Whoever tends that fire counts hulls the way you count spears. You put about with arrows dropping short of the sternpost, owning a new fact and a hole in the sail to remember it by.',
      good: 'You stand in with shields shipped but visible, the old grammar of armed politeness — and the smoke turns out to be charcoal burners, delighted at company, richer in gossip than goods. The charts get a correction and the men get fresh pork. Boldness, priced right, is just efficiency.',
      incredible: 'You come in at dusk with torches answering their fire — light for light, the courtesy of strangers — and are ashore drinking with them before full dark. They are wreck-survivors, seven years marooned, and the chart-correction they carry in their heads is worth more than a hold of bronze. You take three home as crew. They row like men reborn, because they are.',
    },
    right: {
      label: 'Stand off till morning', approach: 'lore',
      bad: 'You stand off the night, and the current stands you further off than you meant — morning finds the island hull-down behind you and the answer forever unlearned. It is probably nothing, friends. Unlearned answers are always probably nothing. That is what makes them itch.',
      good: 'You stand off and watch the fire through the dark: it burns all night, untended after moonset, banked like a signal and not a hearth. Whatever wanted you ashore wanted you ashore at night. Morning shows the beach empty and the itch of a trap unentered. Some knowledge, friends, you buy by NOT going.',
      incredible: 'You stand off, and in the last of the light you read the smoke itself — green wood on the updraft, the puffs too regular, a rhythm in it like a man working bellows. Wreckers’ code, or close kin to it. You note the island’s true name in the pilot-book with a black mark, and somewhere a crew that waited hungry curses a horizon that kept its distance.',
    },
  }),

  // ── new in slice 4: the texture of the first sea ──
  sea('ody_a1_maron', 1, {
    tags: ['kleos', 'omen'],
    prompt: 'A priest of Apollo stands in the ruins of Ismaros with his family behind him and his life in your gift — and every man of your landing party watching what mercy costs.',
    recap: 'The priest in the ruins.',
    left: {
      label: 'Spare him, and his house', approach: 'lore',
      bad: 'You spare him and the men mutter: half the town got no such mercy, and who set the measure of it, and why a priest of the god who sided with Troy. The wine he gifts you in thanks is extraordinary. The grumbling, friends, is ordinary, and lasts longer than wine.',
      good: 'You spare the house for the god’s sake and the priest, in thanks, brings out wine like nothing in the fleet: dark, undiluted, honey-heavy, a vintage to make a strong man sit down. Twelve jars. Remember the wine, friends. The wine has work to do later in this story.',
      incredible: 'You spare him with the full words — the suppliant raised by the hand, the household named safe — and the priest weeps and empties his cellar into your hold: the great wine, the sweet oil, silver mixing-bowls. But hear me: it is the wine. In a cave not far ahead, that wine will be worth more than every spear aboard.',
    },
    right: {
      label: 'Take the ransom he offers', approach: 'guile',
      bad: 'You set a price on mercy and he pays it, and something goes out of the moment that the silver does not replace. The men take the transaction’s lesson: everything is negotiable, including their captain. That lesson, friends, will be quoted back to you at a bad time.',
      good: 'A ransom, honestly named and honestly paid — the old usage of war, no shame on either side. He adds two jars of his great wine unasked, which is how a priest says thank you for being asked at all. Fair dealing travels. So does the story of it.',
      incredible: 'You name a ransom and then, with the silver on the sand, hand half of it back — “for the god’s roof, when you rebuild it.” The priest stands very still, then gives you the whole cellar of the great vintage and a blessing that raises the hair on your arms. Twelve dark jars, friends. One of them has a giant’s name on it, though no one can read it yet.',
    },
  }),
  sea('ody_a1_spoils', 1, {
    prompt: 'Troy’s spoils sit amidships in twelve unequal heaps, and forty veterans who counted every wound they took are counting each other’s shares.',
    recap: 'The division of the spoils.',
    left: {
      label: 'Divide it by your own hand', approach: 'might',
      bad: 'You divide it and every man does his own arithmetic against yours, and three of the answers come out bitter. Nothing is said to your face. Everything is said to Eurylochos, who keeps the accounts of grievance the way priests keep feast days.',
      good: 'You make the division in the open, heap by heap, your reasons said aloud — this man boarded first, that man lost a brother — and the shares land like verdicts from a respected court. Not loved. Respected. At sea that is the better coin.',
      incredible: 'You divide it and take the captain’s share LAST, from what remains, visibly smaller than the best — and the grumbling dies in forty throats at once. A king who serves himself last has bought something no spoil-heap holds. It pulls at the oars for months, friends. It may pull at them yet.',
    },
    right: {
      label: 'Let them draw lots', approach: 'guile',
      bad: 'The lots fall as lots do — the coward draws the golden cup, the hero draws the cracked cauldron — and now the complaint is against fortune, who has no face to shout at, so they shout at the man who chose the lots. That is you, friends. Fortune has excellent lawyers.',
      good: 'Lots, drawn from a helmet in front of everyone, and no man can carry a grudge against a pebble. A few trades settle the worst mismatches by dusk, and the fleet sleeps owning what it owns. The helmet trick is old because it works.',
      incredible: 'You rig nothing and fix everything: the lots are honest, but you have quietly seeded the heaps so every heap is worth the same to the man likeliest to draw it — the archer’s lot heavy in arrowheads, the cook’s in copper. It takes them a week to notice the fairness was engineered. The engineering, once noticed, is worth more than the spoils.',
    },
  }),
  sea('ody_a1_first_watch', 1, {
    tags: ['omen'],
    prompt: 'The new men — the ones who were boys when the fleet sailed for Troy — stand their first night watch of the long way home, and none of them knows the stars for this sea.',
    recap: 'The boys’ first night watch.',
    left: {
      label: 'Teach them the sky yourself', approach: 'lore',
      bad: 'You teach until the middle watch, and fall asleep on deck like a common rower, and the fleet gets a day of jokes about the snoring of kings. The boys learned three stars. The fleet learned the captain is mortal around midnight. Both lessons keep.',
      good: 'An hour at the sternpost, your arm along theirs, naming the fixed lights and the wandering ones: steer with her on your left shoulder till the middle watch, then trade her to the right. They repeat it back like a rite. In a sense, friends, it is one.',
      incredible: 'You teach them the stars and then the thing under the stars — how the helm feels when the current lies, how a sail complains before it tears. At dawn the oldest boy asks a question so good the helmsman turns around. Somewhere in that watch, friends, the fleet grew its next generation of officers.',
    },
    right: {
      label: 'Pair each boy with an old hand', approach: 'guile',
      bad: 'You pair them and the old hands teach what old hands teach: the stars, yes, and also the gambling, the grudges, and the seventeen ways to look awake. One boy loses his cloak at dice before moonset. Education, friends, is never only the syllabus.',
      good: 'Each boy to a veteran, watch on watch, and the knowledge goes across the way it always has at sea — half in instruction, half in insult, all of it sticking. By the third night the boys steer and the old men doze, one eye open, satisfied. The fleet teaches itself, if you rig it to.',
      incredible: 'You make the pairing an honor on both sides — the boy carries the veteran’s name to the log, the veteran answers for the boy’s course — and both take fire from it. One pair, prickly Perimedes and the smith’s quiet son, becomes the stuff of fleet legend by journey’s end. Ask any rower, friends. They steered the strait together. But that is ahead of us.',
    },
  }),
  sea('ody_a1_cape_maleia', 1, {
    tags: ['deep', 'omen'],
    prompt: 'Cape Maleia, the last corner of the known world — round it and you are three days from home. The wind comes out of the north as you make the turn, and it does not feel like weather. It feels like a hand.',
    recap: 'The wind at Maleia.',
    left: {
      label: 'Fight the wind for the corner', approach: 'might', risky: true,
      bad: 'Nine days, friends. Nine days of oars against a wind with opinions, and on the ninth the sea wins the argument the way the sea always wins — by not being tired. The corner is gone. The charts are gone. What lies ahead of the fleet now is not on any of them.',
      good: 'You fight it — every bench, double-manned, three tides running — and lose slowly, gloriously, without a man giving up before you call it. When you finally run off before the wind, the fleet has learned exactly what it can do at its utmost. That knowledge is about to be needed. All of it.',
      incredible: 'You hold the fleet on the corner for two impossible days, close enough to see the home-water past the cape, and the men row like the sons of gods — and then you, YOU, call it off, because a captain who cannot spend men will not spend them on geography. They fall off the wind cheering their own defeat. The sea takes you west, into the tale.',
    },
    right: {
      label: 'Run off before it', approach: 'lore', risky: true,
      bad: 'You run before it because the omens said bend, and the men watch home fall behind the horizon with their oars shipped and their hands empty. Nothing broke. No one drowned. But something went out of forty faces that took years to come back, and the sea carried you into waters with no names.',
      good: 'You read the wind for what it is — not weather, a verdict — and run off square before it with everything lashed and everyone rested. If the sea insists on taking you somewhere, arrive fresh. The fleet crosses the edge of the chart in good order, which is the only good way to cross it.',
      incredible: 'You run before it and USE it — the terrible wind become a gift the moment you stop refusing it, the fleet logging in one day what oars make in four. The men, expecting despair, get speed instead, and speed is half a mood. Where the wind is taking you no chart says. But you arrive there, friends, with the sails full and the crews singing, which is more than the wind intended.',
    },
  }),
  sea('ody_a1_goat_island', 1, {
    prompt: 'A low green island loud with wild goats, and across a mile of water its tall neighbor: terraced, smoked, inhabited by something that builds big. The goats are supper. The neighbor is a question.',
    recap: 'The goat island, and its neighbor.',
    left: {
      label: 'Hunt, feast, and study the far shore', approach: 'guile',
      bad: 'The feast is glorious and the study is idle — full men make poor spies, and the far shore gives your watchers nothing but smoke and the far-off knock of something heavy being moved. You will meet the mover soon enough, knowing exactly as much as the goats do.',
      good: 'Nine goats a ship, and between the roasting and the wine you keep two sober men on the point with orders to count fires on the far shore. They count three, well apart — herders, not a town; big herds, big herders. The fleet eats well and learns something. Both matter, where you are going.',
      incredible: 'You feast the fleet and run the point-watch in relays all night, and by dawn you know the far shore’s fires, its goat-paths, the cove where a ship could lie unseen — everything, friends, except the one fact the smoke will not say: the size of what tends it. Still: no fleet ever went into that strait better fed or better briefed. It will need to have been both.',
    },
    right: {
      label: 'Cross to the far shore now', approach: 'might',
      bad: 'You cross hungry and curious, which is the wrong order, and the tall shore shows you terraces built for strides twice a man’s and a flock whose lambs stand shoulder-high. The landing party comes back at a pace just short of running. Supper is late. Nobody minds.',
      good: 'One ship across, yours, the rest held at the goat island — a captain’s reconnaissance done right. You walk a shore built to the wrong scale, note it, and are back across the strait by dusk with the fleet’s questions answered except the largest one. That one is in a cave, friends. It can wait for its chapter.',
      incredible: 'You cross, look, and — this is the part the men argue about for years — turn around. The terraces, the doorways, the milking-pens all say the same enormous thing, and you read it and choose the goat island’s safe supper first. “We will visit the giants fed,” you say, as if that were a normal sentence. The fleet laughs. The fleet, friends, does not know it is a plan.',
    },
  }),
  sea('ody_a1_elpenor', 1, {
    prompt: 'The youngest rower is called Elpenor: brave at the wrong times, clumsy at the worst ones, and so easily delighted that the whole ship has quietly adopted him.',
    recap: 'Elpenor, the fleet’s youngest.',
    left: {
      label: 'Keep him close to the helm', approach: 'guile',
      bad: 'You keep him at the helm-bench where you can watch him, and he watches YOU instead — copies your stance, your squint, your way of tasting the wind — and drops the sounding-lead on the pilot’s foot while doing it. The pilot’s remarks, friends, I will not sing at any fire.',
      good: 'You keep him close and give him small true jobs: the lead-line, the hourglass, the tally of the watch. He does them like a boy trusted with the moon, and slowly the clumsiness burns off — most of it. Some men, friends, are simply made of enthusiasm. You can only aim it.',
      incredible: 'You keep him close and one night, becalmed, he asks how you ALWAYS know what to do — and you tell him the truth: you never do; you only look like it on purpose, because forty men row better behind a man who looks like it. He keeps that secret like treasure all his short life. Remember Elpenor, friends. The tale is not done with him.',
    },
    right: {
      label: 'Toughen him at the hard stations', approach: 'might',
      bad: 'You rotate him through the hard benches to make a sailor of him, and make a bruise of him instead — rope-burned, oar-thumped, and once, memorably, catapulted by his own enthusiasm clean over the side in harbor. He surfaces laughing. The fleet cheers. Your training program, friends, becomes a comedy with one performer.',
      good: 'The hard stations, in order, with an old hand at each: he suffers, learns, breaks nothing important, and comes out of it able to hand, reef and steer — still clumsy, but clumsy at a higher grade. He wears the rope-burns like medals. In a way they are.',
      incredible: 'You work him hard and he takes it, and at the month’s end, in a squall’s dirty edge, it is Elpenor — Elpenor! — whose quick hands clear the fouled halyard while wiser men are still shouting. One deed, friends. Every young sailor gets one, if he lives. The ship drinks his health, and he glows like a lamp all night, and cannot sleep for happiness, and climbs to the cool of the cabin roof to try. Remember that, too.',
    },
  }),

  // ── The temptation of Act I: the Lotus (the weak offer) ──
  // A scheduled beat (pack.ts BEATS), gated to the runs it can actually
  // tempt: the flower speaks to the weary. Banking is a CHOICE, not a roll
  // (forceTier), and the ending it buys is told, never a game-over screen.
  {
    id: 'ody_tempt_lotus',
    act: 1,
    tags: ['temptation', 'beat:lotus'],
    requires: { burnoutMin: 18 },
    context: 'The meadow — a place to stop',
    prompt: 'The flower does not argue. It only asks, in a voice like warm shallow water, why the trying. Three of your men already sit in the shade with their eyes full of nothing, happier than you have seen any man since Troy. There is room in the shade. There is always room.',
    recap: 'The meadow made its offer.',
    forceTier: { right: 'good' },
    choices: {
      left: {
        label: 'Burn the flowers; drag them aboard',
        tags: ['temptation', 'might'],
        governingStats: { might: 1 },
        outcomes: {
          bad: { text: 'You burn the meadow’s edge and carry your men down bound and weeping, and the smoke follows the fleet out on the wind like a mild, sorry question that takes days to stop being asked. They forgive you slowly. The flower forgives everyone instantly. That is what is wrong with it.', effects: { might: 3, burnout: 3 } },
          good: { text: 'Fire for the flowers, rope for the dreamers, oars for everyone else — the whole rescue done loud and fast, because soft things must be fought rudely. By the second dusk at sea the three are eating like wolves and cannot say why they wept. Nobody asks. Everybody knows.', effects: { might: 4, burnout: 2 } },
          incredible: { text: 'You carry them aboard yourself, one over each shoulder, talking the whole time about their mothers and their debts and the roofs they meant to mend — and by nightfall one of them is laughing at you. The meadow keeps no grudge. The meadow keeps nothing. That is the whole horror of the meadow, and you have rowed clear of it.', effects: { might: 5, renown: 1 } },
        },
      },
      right: {
        label: 'Sit down in the shade',
        tags: ['temptation', 'guile'],
        governingStats: { guile: 1 },
        outcomes: {
          bad: { text: 'You sit down in the shade, and the trying stops.', effects: { addFlag: 'ody_stayed_lotus' } },
          good: { text: 'You sit down in the shade, and the trying stops.', effects: { addFlag: 'ody_stayed_lotus' } },
          incredible: { text: 'You sit down in the shade, and the trying stops.', effects: { addFlag: 'ody_stayed_lotus' } },
        },
      },
    },
  },
];
