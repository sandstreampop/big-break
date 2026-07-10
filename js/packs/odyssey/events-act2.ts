// The Odyssey — Act II deck: Witches and the Dead (slice 4, the authored sea).
// The islands stop being places a chart would admit to; the dangers stop
// being weather. The voice narrows with the water — god-haunted, the crew
// fraying, the right word worth more than the strong arm.

import type { GameEvent } from '../../types.js';
import { sea } from './events.js';

export const ACT2_EVENTS: GameEvent[] = [
  sea('ody_a2_bag_winds', 2, {
    tags: ['deep'],
    prompt: 'The king of the winds has given you a gift, oxhide and silver-corded, and the men have decided among themselves that it is treasure, and that you are keeping it from them.',
    recap: 'The men eyed the oxhide bag.',
    left: {
      label: 'Show them what it is', approach: 'guile', risky: true,
      bad: 'You open the bag’s mouth a finger-width to show them wind and not gold — and a finger-width of every wind there is comes out screaming. Half a day of chaos, a sprung yard, and a crew that now believes the bag is BOTH treasure and monster. You have made it worse, friends, with the truth. It happens.',
      good: 'You gather the doubters and untie one cord of nine while they watch: the bag breathes, the hair on their arms stands, and nobody mentions gold again. A mystery shown its teeth keeps better than a mystery locked away. The bag rides home under the helmsman’s bench, feared and left alone.',
      incredible: 'You show them — and then you give the bag a WATCH, an honor guard, two men an hour like a shrine, so that guarding it becomes a boast instead of a grievance. Eurylochos takes the dawn shift himself. The wind-king’s gift crosses half a sea untouched because you made suspicion into ceremony. That, friends, is captaincy.',
    },
    right: {
      label: 'Sleep on it, literally', approach: 'might', risky: true,
      bad: 'Nine days you hold the helm with the bag beneath you, and on the tenth, with Ithaca’s smoke ON THE HORIZON, sleep takes you like a wave takes a wall. What the men do then with knives and curiosity, the tale knows too well. The wind that comes out blows a year’s sailing backward in a night.',
      good: 'You sleep on it in shifts of not-sleeping, and the fleet learns that the captain’s bench is not to be approached — a discipline of glares and one broken finger. It holds. Barely, friends, and with a cost in trust that has not finished being paid. But it holds.',
      incredible: 'You lie on the bag nine nights like a dragon on a hoard, and on the tenth, close enough to home to smell the thyme, you do the thing no hero in any song has done: you hand the helm over, name the danger OUT LOUD to the whole crew — “I am about to sleep, and this bag holds our road home” — and sleep. Named, the temptation dies. The bag is there whole at dawn. Songs are wrong about what bravery is, friends. Sometimes it is admitting you are tired.',
    },
  }),
  sea('ody_a2_harbor', 2, {
    tags: ['deep', 'blood'],
    prompt: 'A harbor like a stone purse, one narrow mouth, cliffs all round — the whole fleet could shelter in it, and the whole fleet could be trapped in it.',
    recap: 'The purse-mouthed harbor.',
    left: {
      label: 'Moor outside, alone', approach: 'lore', risky: true,
      bad: 'You keep your own ship outside on a hunch you cannot name, and the men inside the purse take it as insult — the captain too good for the fleet’s anchorage — and the night is loud with the wrong kind of singing. Nothing comes down from the cliffs. This time, friends. The hunch was a day early, that is all.',
      good: 'You moor outside the mouth with a cliff at your back and a clean run to sea, and you sleep the way only a man with an exit sleeps. In the morning the fleet ribs you for your caution. You let them. A captain collects caution-jokes the way a wall collects spears: better there than in the men.',
      incredible: 'Outside, alone, warped to a rock with the bow seaward — and in the dead of night you hear it: not a rockfall, a FOOTSTEP, one, high on the cliff over the purse, of something testing whether the fleet below was asleep. Whatever owns those cliffs found one ship awake in the mouth of its trap and thought better of the arithmetic. The fleet never knows what your hunch was worth. You do.',
    },
    right: {
      label: 'Bring them all in', approach: 'might', risky: true,
      bad: 'All twelve inside, snug as eggs in a bowl — and at dawn the bowl’s owners come to breakfast. Stones first, from the cliffs, unhurried, well-aimed. What the fleet loses getting out of that stone purse I will count at another fire; tonight I will only say the mouth of it was the width of two oars, and it felt like the width of one.',
      good: 'All in, but you moor them YOUR way: sterns to the mouth, anchors set to slip, every crew drilled at dusk on the getting-out until they grumble. Nothing comes in the night. The grumbling was the price; the drill was the point. A trap you have rehearsed leaving is only a harbor.',
      incredible: 'You bring them in and then you climb — you and two others, up the goat-track in the dark to see the purse as its owner would. From above, the trap is legible: the rock-piles, the watching-ledge, the path down. So you post YOUR watch on the watching-ledge, and whatever came at moonset found its own ambush occupied, and went away. The fleet slept through its rescue. Captains, friends, are paid in nights like that.',
    },
  }),
  sea('ody_a2_swine', 2, {
    tags: ['deep', 'omen'],
    prompt: 'Half the shore party has not come back from the house in the clearing, and the one who ran says the word “pigs” four times and will not say more.',
    recap: 'The house in the clearing.',
    left: {
      label: 'Go up with sword drawn', approach: 'might', risky: true,
      bad: 'You go up the path with bronze out and rage doing your thinking, and the house’s lady meets you at the door as if rage were a wine she had tasted before, often, and found thin. What saves you is not the sword. What saves you costs you a promise you will be years understanding.',
      good: 'Sword out, and at the door something odd: the drawn blade makes her pause — not fear, interest. A man who came up the path angry and UNDRUGGED is a novelty in her long inventory. Novelty buys negotiation. The men come out of the sty on two legs, weeping at their own hands, and you do not lower the sword until the last one is past you.',
      incredible: 'You come up the path so fast the trap has no time to be sweet — through the door, blade at silk, and the lady of the house looks down the bronze and up your arm and LAUGHS, delighted, the first honest thing in that clearing. “There you are,” she says, as if the whole island had been waiting. The men are men again by supper. What she and you say after supper, friends, belongs to a different kind of song.',
    },
    right: {
      label: 'Go up with the moly rite', approach: 'lore', risky: true,
      bad: 'You do the rite as the god on the path taught — but hurry the words, because your men are grunting in a sty while you pronounce. The herb holds; the hurry shows. She receives you as what you are, a man armored in borrowed knowledge, and deals with you correctly and coldly, like a merchant. The men come back. The island’s friendship does not.',
      good: 'The black root, the milk-white flower, the words in the old order — and her cup, when you drink it, is just wine. The look on her face, friends, is worth the whole detour: a craftswoman meeting the one guest her craft cannot touch. After that it is bargaining, and bargaining she respects. The sty stands empty by dusk.',
      incredible: 'You take her cup, drink it dry, and set it down with the one line the rite’s giver taught you — and the kitchen goes so quiet you can hear the loom upstairs stop. What follows is not a battle but a RECOGNITION: two professionals of survival, each finding the other fluent. She turns your men back herself, gently, apologizing to each. Her advice about the road ahead, friends, is about to matter more than her magic ever did.',
    },
  }),
  sea('ody_a2_year_isle', 2, {
    prompt: 'A year can pass on a kind island the way an afternoon passes at anchor. Polites says, gently, that the men have started naming the goats.',
    recap: 'The men named the goats.',
    left: {
      label: 'Sail with the next moon', approach: 'lore',
      bad: 'You name the sailing day by the moon, and the moon comes, and the weather argues, and you let it — twice. The men learn that the sailing day is a mood, not a law, and the goats get second names. Leaving, friends, is a muscle. Yours has gone soft with the rest.',
      good: 'You fix the day by the moon and hold it against all comers — the weather, the feast someone conveniently plans, the goat crisis invented that very morning. The fleet sails thin-lipped and is glad of it by the second dusk at sea, the way sleepers are glad of cold water. Home exists again. It had been getting theoretical.',
      incredible: 'You announce the moon-day and then spend the wait CONVERTING it: each man assigned one thing to finish before sailing — a mended sail, a learned splice, a letter scratched on lead for home. Leaving becomes a harvest instead of an eviction. The fleet that sails is better than the one that landed, and it sails singing. Even the goats, friends, seem to understand.',
    },
    right: {
      label: 'Sail at dawn, no debate', approach: 'might',
      bad: 'Dawn, no debate — so the debate happens at sea, where it is called sulking, and lasts a week, and costs you the small invisible things a sulking crew withholds. The island falls astern. It travels with you anyway, in forty heads, for a long time.',
      good: '“Dawn. Stow tonight.” The order lands like cold water and works like it: grumbling, scrambling, and then — under way — the old rhythm coming back stroke by stroke, and with it the men’s own surprise at how much they had missed being GOOD at something. The goats watch the fleet go. The fleet, mostly, does not watch the goats.',
      incredible: 'You give the order at dusk and by dawn something has shifted in the saying of it — because you spend that night walking the fires, telling each crew not that they must leave, but what they are FOR: benches, wives, a rock in the sea worth more than soft grass everywhere else. The fleet sails itself. Polites, pulling stroke, is grinning like the boy he was at Troy. That grin, friends, was the cargo.',
    },
  }),
  sea('ody_a2_mutiny_talk', 2, {
    tags: ['blood'],
    prompt: 'Eurylochos has been talking at the water barrel again — about captains, and choices, and how many men Troy cost against how many the sea has.',
    recap: 'Water-barrel talk.',
    left: {
      label: 'Face him down before all', approach: 'might',
      bad: 'You call him out before the mast and he stands his ground — he has counted on you doing this, has his grievances by heart and his audience pre-warmed. You win the exchange on rank and lose it on arithmetic, because his numbers are true, friends. That is the misery of Eurylochos. His numbers are always true.',
      good: 'Before everyone, plainly: “Say it to my face or stop feeding it to the barrel.” He says a third of it, which is all he ever really had, and the crew watch it shrink in the open air the way barrel-talk does. You answer the third honestly — some of it with “yes, and it grieves me” — and the matter drains. For now, friends. Eurylochos refills.',
      incredible: 'You face him down and then do the unforgivable thing: you AGREE with him, in front of all, name by name — the men Troy took, the men the sea has taken, the weight of every one on your own ledger. Then you ask what he would do differently, and wait, and the silence answers for him. A grievance honored in public dies of it. He pulls his oar all month like a man who lost an argument he needed to lose.',
    },
    right: {
      label: 'Give him the helm a day', approach: 'guile',
      bad: 'You give him the helm and the day gives him weather — the mean, shifty kind — and he does WELL, friends, that is the trouble: well enough to believe the barrel-talk himself now, with evidence. You have promoted your own opposition. The sea, which loves irony, was flat calm for his whole watch.',
      good: 'The helm, the charts, the whole day’s decisions — and by dusk he is quieter, not because he failed but because he FELT it: the weight of forty lives leaning on every small call, the way choices look different from the sternpost than from the barrel. He hands it back correctly. The talk does not stop. The tone changes.',
      incredible: 'You give him the helm on the day the fleet threads a nasty lee shore — deliberately, friends; check the weather-luck of kings — and he brings it through white-knuckled and superb, and you praise the seamanship LOUD and let him keep the credit whole. A man given real weight to carry sets down the imaginary kind. He barrel-talks no more; he has standing now, and standing, unlike grievance, is something a man protects.',
    },
  }),
  sea('ody_a2_fog', 2, {
    tags: ['omen'],
    prompt: 'Fog for three days, white as wool, and the steering is by sound: the creak of your own fleet, and under it, sometimes, a creak that is not your fleet.',
    recap: 'Three days of wool-white fog.',
    left: {
      label: 'Silence — run dark', approach: 'guile',
      bad: 'Silence, you order, and silence you get — such good silence that the fleet loses ITSELF: two ships wander out of the formation with no call allowed to fetch them back, and finding them costs a day of the very noise the silence was for. The other creak, whatever it was, heard all of it.',
      good: 'Muffled oars, no bells, low voices — the fleet becomes a rumor in the white. The other creak crosses your wake twice, patient, hunting by ear, and finds only fog where a fleet’s worth of noise should be. On the third morning the sun burns through onto empty sea. Some victories, friends, are the shape of nothing happening.',
      incredible: 'You run dark and TALK to the fleet by touch — a line passed ship to ship at dusk, tugs in code, the old blind-signal of the Ithaca fishermen — so twelve hulls move as one silence with a single will. The other creak follows for two nights, loses conviction, fades north. To this day, friends, you do not know what it was. It knows exactly what it missed. Let that be its problem.',
    },
    right: {
      label: 'Horns and torches', approach: 'might',
      bad: 'Horns, torches, the fleet a floating festival of here-we-are — and the fog gives your position to everything with ears while giving you nothing back. The creak circles closer that night, bolder, TASTING the noise. Nothing comes of it but a bad night’s watch. Nothing needed to. The men heard it too.',
      good: 'You light up and sound off, and the fog becomes yours: each horn answered down the line, each torch a station-keeping mark, the formation locked tight as a chorus. Whatever else swims in the white now knows two things — where you are, and HOW MANY you are. The creak keeps its distance. Twelve ships in step is its own kind of teeth.',
      incredible: 'Horns — but not noise: you sound the war-cadence of the fleet at Troy, the one the whole Aegean learned to be elsewhere for, rolling ship to ship through the fog in perfect order. The other creak stops. Entirely. Some things in the sea are old enough to remember that rhythm, friends, and nothing that remembers it stays to hear the second verse.',
    },
  }),
  sea('ody_a2_offering', 2, {
    tags: ['omen'],
    prompt: 'The wine for the gods is down to one amphora — the good one, the Ismaros vintage — and tonight wants a libation more than any night of the voyage.',
    recap: 'The last of the good wine.',
    left: {
      label: 'Pour it all', approach: 'lore',
      bad: 'You pour the whole amphora dark into a sea that swallows it without a ripple of acknowledgment, and forty thirsty men perform the arithmetic of piety in their heads at once. The gods, friends, keep their own books, on their own schedule. The men keep theirs nightly, at the barrel.',
      good: 'All of it, unwatered, the whole dark blessing of Ismaros poured out with the full words while the fleet stands uncovered — and whatever hears such things heard it: the night passes kind, the swell drops, and the men, who grumbled at the pouring, sleep like the well-defended. Cheap at the price, friends. The good vintage was always going to be drunk by SOMEONE tonight.',
      incredible: 'You pour it all and say — not the set words — your OWN: the names of the drowned, the names of home, the plain sailor’s asking. No thunder answers. But old Perimedes, who has poured to the sea for fifty years, is weeping into his beard, and the youngest rowers will pour their libations your way for the rest of their lives. Sometimes the offering, friends, is FOR the men watching. The gods understand this. It is why they watch too.',
    },
    right: {
      label: 'Pour half, hide half', approach: 'guile',
      bad: 'Half to the sea, half beneath the stern-bench — and the sea, friends, was watching the bench. Or a rat was: the hidden half is vinegar in a week, sour as the bargain. The gods take insult lightly at sea only in the sense that they take it EVENTUALLY.',
      good: 'Half poured with the full ceremony, half kept against the sick-bay and the bad night to come — stewardship, you call it, and mean it. The sea takes its share without complaint. When the bad night does come, a measure of good wine in a shivering man is its own kind of rite. The gods made grapes for both uses, friends.',
      incredible: 'You pour half — and dedicate the KEPT half aloud, as a vow: this remainder to be drunk on the beach of Ithaca, by whoever of us stands there. The sea gets its portion; the men get a future with a taste to it, corked and stowed where every rower can see it. That amphora becomes the fleet’s most guarded cargo. Hope, friends, does the work of two benches, and it keeps better than wine.',
    },
  }),
  sea('ody_a2_widow_ship', 2, {
    prompt: 'The seventh ship has more empty benches than manned ones now. Her rowers ask to be spread among the fleet, and her keel given to the fire.',
    recap: 'The seventh ship’s last night.',
    left: {
      label: 'Burn her with honors', approach: 'lore',
      bad: 'You burn her and the fire is right, but the speech is wrong — you praise the SHIP so well that every man hears the count of those who left their benches empty, and the honor curdles into grief on the beach. The blaze lights forty wet faces. It was meant to warm them, friends. Fires do as they please with meanings.',
      good: 'She burns at dusk, bow to the sea, her name said whole and her dead named with her, and her rowers stand closest to the heat as is right. The fleet watches its own mortality burn handsomely, which is the only way sailors can bear to look at it. In the morning six ships row better for carrying the seventh’s men. And, somehow, lighter.',
      incredible: 'You burn her — but first every man of her crew takes one piece: a thole-pin, a cleat, her steering oar for the eldest, and you take her stem-post carving and set it on your own bow beside your own. She goes to the fire already living in six other hulls. Years hence, men will touch that carving before hard water without knowing quite why. That, friends, is what a ship becomes if you burn her CORRECTLY.',
    },
    right: {
      label: 'Tow her — timber is timber', approach: 'guile',
      bad: 'You tow her for her timber, and her timber tows back: dead weight on every course change, a yawing curse in any sea, and her old crew watching their ship dragged like a debtor. When you finally cut her loose in weather, friends, you get the worst of both — no honors, no timber, and the men’s long memory of the rope.',
      good: 'Timber IS timber, and you say so plainly, and her own carpenter agrees loudest: she gives the fleet a mast, forty oars, and enough seasoned oak to mend three ships through the narrows ahead. Her stern-post goes to the fire with the words said right — the ship’s soul honored, the ship’s body USEFUL. Sailors, friends, are practical about their dead. Ships are their dead.',
      incredible: 'You strip her at anchor in one long day — a funeral that is also a harvest, her crew doing the carrying, her every plank assigned aloud to its next ship and next duty: “this strake to the fourth ship’s wound; these oars to the boys.” Then the bare bones burn. It is the strangest rite the fleet has made and the truest: nothing wasted, everything honored, the seventh ship dissolved INTO the fleet like a rower into a chorus. Her name gets said, after, when mended things hold.',
    },
  }),
  sea('ody_a2_siren_rumor', 2, {
    tags: ['omen'],
    prompt: 'A trading crew, passed at oar-length, will not speak — every man of them points at his own ears and then at the horizon you are steering for.',
    recap: 'The traders pointed at their ears.',
    left: {
      label: 'Buy their story with wine', approach: 'guile',
      bad: 'You buy the story and get a market’s worth of them — singing rocks, honeyed death, a hundred contradictions at one jar each. Somewhere in the noise is the true warning, unpurchasable, drowned by the purchased kind. You sail on knowing MORE and understanding less, which is trade’s oldest bargain, friends.',
      good: 'Wine loosens them a jar’s worth: a song, they manage, that is not heard so much as OWED — it sings what each man wants most, and steers him onto the teeth of it. Wax, says their eldest, tapping his ears. Wax, and a strong mast, and count your crew after. You note all three. Two of them, friends, you will shortly need.',
      incredible: 'You trade wine for the story and then — seeing the eldest’s hands shake on the cup — trade PATIENCE for the rest of it: he was the one who heard it, lashed and screaming, a young man then. What he gives you is not sailing directions but the SHAPE of the temptation itself, from inside. When your own narrows come, friends, you will know the song one verse before it knows you. No chart sells that.',
    },
    right: {
      label: 'Note it and hold course', approach: 'might',
      bad: 'You hold course and file the warning with the sea’s thousand others — and it costs nothing today, and nothing tomorrow, and the men take the lesson that warnings are decoration. The bill for that lesson, friends, has your name on it already. The sea is patient with its invoicing.',
      good: 'A nod to the traders, a mark on the chart, and on: the fleet has heard a hundred horrors and outlived ninety-nine, and course held steady is its own seamanship. But you note it TWICE, friends — once in the pilot-book, once in the place behind your eyes where the true warnings live. Something in the pointing was not performance.',
      incredible: 'You hold course — and read the traders as they pass: not their words (they gave none) but their RIG. New wax at every hatch-seam. Rope-galls on the mast at a lashed man’s height. Whatever they met, they met it PREPARED, and lived, and still would not speak of it. You copy every preparation you saw before the horizon swallows them. The best warnings, friends, are worn, not spoken.',
    },
  }),
  sea('ody_a2_dead_calm', 2, {
    prompt: 'No wind for six days. The men row until their hands open, and the water is so flat it shows them their own faces doing it.',
    recap: 'Six days of dead calm.',
    left: {
      label: 'Row through the nights too', approach: 'might',
      bad: 'You row the nights as well and the calm outlasts the heroics, as calms do: day eight finds a fleet of sleepwalkers with bleeding hands and short tempers, becalmed EXACTLY as far from anywhere as before, only now too spent to care. The sea did nothing, friends. That was its whole move.',
      good: 'Nights too — but shortened watches, singing kept up, the strokes long and lazy and endless, eating the flat miles the way oxen eat a field. When the wind finally remembers the fleet on the seventh day, it finds you sixty miles better placed and still, somehow, a crew. The calm was a wall. You rowed through it brick by brick.',
      incredible: 'You row the nights and make the calm into a FORGE: races between watches, the boys taught to feather, the old men’s long-stroke contest under the huge low stars — until the fleet is rowing better than it has since Troy, and knows it, and the flat sea becomes the proving ground instead of the prison. The wind returns to find it is barely needed. The men let it help anyway, magnanimously. I have never seen morale made out of NOTHING before or since, friends.',
    },
    right: {
      label: 'Rest them; whistle old prayers', approach: 'lore',
      bad: 'You rest them and whistle for wind, and get six days of rest and no wind, and rest, friends, rots faster than rope in a crew with nothing to pull against. By day five the fights start — over shade, over dice, over the SOUND of a man chewing. The calm ends eventually. Calms always do. The grudges book passage onward.',
      good: 'Oars in, awnings up, the old wind-prayers whistled soft at dawn and dusk the way the grandfathers did — and the days pass gentle: mending, sleeping, the small overdue repairs of bodies and gear both. When the wind comes on the seventh morning the fleet rises to it RESTED, which is a currency, friends, and you had banked six days of it.',
      incredible: 'You rest them — and on the third dead-flat noon, with the sea a bronze mirror to the horizon, you have every man look DOWN at his own face and tell his bench-mate one true thing the face has seen since Troy. It begins as a joke. It does not end as one. What surfaces on that glass, friends — the named dead, the confessed fears, the two feuds settled with wet eyes — no priest could have gotten at with a year of rites. The wind, when it comes, feels like absolution. Perhaps it was.',
    },
  }),
  sea('ody_a2_black_goat', 2, {
    tags: ['deep', 'omen'],
    prompt: 'The rite ahead wants a black goat and honey and barley, and the fleet has a brown goat, no honey, and a man who swears substitutions are permitted.',
    recap: 'The brown-goat question.',
    left: {
      label: 'Do it exactly or not at all', approach: 'lore', risky: true,
      bad: 'Exactness, you rule, or nothing — and exactness costs four days of searching a goatless coast while the season turns and the men eye the perfectly serviceable brown goat with mounting theology. You get your black goat at last, from a herdsman who overcharges like a man who has met desperate piety before. The rite goes right. The delay, friends, goes into the ledger.',
      good: 'You hold out for the real thing and the coast provides, on the second day: a black kid, honey from a wild comb the boys smoke out, barley traded from a hill farm. The rite, when it comes, is done with everything TRUE — and rites, friends, are one of the few crafts where the materials know the difference. What answers a true rite answers truly. You will want that, where you are going.',
      incredible: 'Exactly or not at all — and the search itself becomes the offering: three days, every man turned honest forager and trader, the whole fleet bent to the gods’ shopping list with a seriousness that would make a temple weep. By the time the black goat stands at the trench, the RITE has already worked, friends — on the men. What it works on the dead, at the world’s edge, will astonish even the prophet.',
    },
    right: {
      label: 'The gods grade intent', approach: 'guile', risky: true,
      bad: 'Intent, you rule, and the brown goat dies sincerely — and the rite comes out the way substituted rites do: MOSTLY. Doors that should open all the way open a hand’s width. Answers arrive with static in them. Nothing punishes you, friends. That is not how it works. It simply works LESS, and you will never know which missing part the honey was.',
      good: 'You soot the goat with lamp-black — the old fleet-priest’s trick, done with a wink at heaven — sweeten with figs, and say the words with double care to cover the swaps. And it HOLDS, friends: the gods, who invented wit, have always had a soft spot for a well-turned improvisation sincerely meant. Just do not make a habit of it. They also invented audits.',
      incredible: 'You substitute — and ANNOUNCE it: the goat sooted openly, the figs named as honey’s deputy, and a vow spoken over the trench that the true rite, full and exact, will be paid on Ithaca with interest. Honest debt, friends, is the one currency every god accepts. The rite lands whole. And somewhere in the dark beyond the trench, something that has heard ten thousand excuses makes a small approving note: THIS one names his shortfalls.',
    },
  }),
  sea('ody_a2_night_landing', 2, {
    prompt: 'A shore of lights at midnight — houses, harbors, help — and every pilot aboard says the same word: wreckers.',
    recap: 'The wreckers’ lights.',
    left: {
      label: 'Stand off, cold and hungry', approach: 'lore',
      bad: 'You stand off on the pilots’ word, and dawn shows the lights for what they were: a fishing town, honest as bread, now watching a foreign fleet lurk off their coast like a threat. The welcome you would have had at midnight is soured by morning. Caution, friends, is also a bet. Sometimes it loses politely.',
      good: 'Cold, hungry, offshore — and at first light the truth walks the beach: men with grapnels and staved-in casks, checking a shore where no fleet lies broken, puzzled at their luck run dry. The pilots do not say told-you-so. Pilots never need to. You feed the men double at noon and nobody mentions the cold.',
      incredible: 'You stand off — and read the lights themselves, the way your grandfather taught: honest harbors light the WATER, wreckers light the ROCKS. These lit the rocks, lovingly, like a table set for guests. At dawn you sail past close enough to see the false beacons cold on their poles, and the fleet looks at you the way men look at a captain who can read the night’s handwriting. One more coin, friends, in the only purse that matters.',
    },
    right: {
      label: 'Land where the lights are not', approach: 'guile',
      bad: 'The dark stretch of coast you choose is dark, it turns out, because the holding ground is foul and the surf eats boats — the locals could have told you; that is WHY their lights are elsewhere. You get ashore wet, minus a skiff, on a beach with nothing but its darkness to recommend it. The wreckers, a mile north, would at least have had fires.',
      good: 'You slip in at a black beach two coves north of the lights, silent, no fires, and find what dark beaches keep: fresh water, no questions, and the boot-prints of others who trusted the lights and walked back out this way with less than they landed with. The fleet waters, rests, and is gone by dawn like a rumor. The lights burn on behind you, fishing for slower fish.',
      incredible: 'You land dark — and send three men, hooded, INTO the lit town with trade-silver and country accents, and by midnight you know everything: which lights are bait, which houses fence the salvage, which headman takes the tithe. You leave before dawn with full water-casks and a map of the coast’s whole crooked economy, and the wreckers never know they were themselves wrecked — of information, friends, the only cargo that matters to a passing fleet. Nobody drowned. Everybody was robbed. It was a good night.',
    },
  }),

  // ── new in slice 4: the middle sea's texture ──
  sea('ody_a2_aiolos_hall', 2, {
    tags: ['kleos'],
    prompt: 'The bronze-walled island of the wind-king floats at anchor to nothing, and its lord feasts you a month for one payment only: the whole tale of Troy, night by night, with nothing left out.',
    recap: 'A month in the bronze hall.',
    left: {
      label: 'Sing it all — even your dead', approach: 'guile',
      bad: 'You give the whole tale, and the whole tale takes more than it gives: night after night of the horse, the fires, the beach-graves, until you are hoarse with your own history and the men, listening from the lower benches, dream badly of things they had folded away. The wind-king is delighted. Delight, friends, was his price, and he never asked what it cost the till.',
      good: 'Everything, in order, the glories and the shames both — and the hall learns what a true tale is: not a trophy but an ACCOUNTING. The wind-king, who has heard a thousand boasting captains, leans in for the failures the way connoisseurs lean in for the rare vintage. His gift, when you sail, is sized to the tale’s honesty. Remember the oxhide bag, friends? THIS is the night it was earned.',
      incredible: 'You sing it whole — and on the last night you sing the part no captain sings: the men lost to your own mistakes, named one by one, their deaths owned aloud in a king’s bright hall. The bronze walls, they say, rang soft. The wind-king stands, and his household with him, and what he gives you at parting is not treasure but every contrary wind in the world, TIED IN A BAG. Kings give gifts to flatterers, friends. To honest men they give power. Which is heavier.',
    },
    right: {
      label: 'Sing the glory; keep the grief', approach: 'lore',
      bad: 'You sing the shining half and keep the dark half home — and the wind-king, a connoisseur of weather in men as well as skies, hears the missing pressure in the tale like a sailor hears a lying glass. The feasts continue. The warmth goes out of them by degrees. His parting gift is correct, generous, and half of what it might have been. Half-tales, friends, are paid at half-rates by anyone worth singing to.',
      good: 'The glory, told properly, is a month’s honest work: the horse built beam by beam across four evenings, the night of the gates a whole performance. The grief you keep, and the keeping shows only as gravity — which a wise host reads as depth and does not press. You sail with fair gifts, fair winds, and your dead still your own. There are worse trades, friends. Most trades are worse.',
      incredible: 'You sing the glory — but you sing it CRAFTSMAN’S-EYE: not who won, but how it was DONE, every trick and joinery of the war laid open like a master showing his workshop, and the wind-king, who is himself a craftsman of impossible things (his island FLOATS, friends), recognizes his own kind. The last week is not feasting but shop-talk: two masters trading trade-secrets, winds for stratagems. What he teaches you about reading weather no rhapsode will ever get from me at any price. I need it for the storm scenes.',
    },
  }),
  sea('ody_a2_laestrygon', 2, {
    tags: ['deep', 'blood'],
    prompt: 'The scouts follow a cart-track to a well outside the tall town, and the girl drawing water there is the size of a mast. She smiles down at them, and calls, sweetly, toward the walls: guests.',
    recap: 'The girl at the giant well.',
    left: {
      label: 'Pull the scouts out now', approach: 'guile', risky: true,
      bad: 'The recall horn sounds and the scouts run — and running, friends, is a language every predator reads. What comes out of the tall gates comes out already hunting. The scouts reach the boats a breath ahead of the stones, and the fleet leaves that coast with fewer hulls than it brought. The well-water, the survivors note bitterly, was sweet.',
      good: 'You sound the recall the moment the word “guests” arrives sounding like an order for dinner — the scouts walk-don’t-run, wave cheerfully at the walls, and are aboard before the gates finish opening. The stones fall on your wake, monstrous and late. There is a species of victory, friends, that consists entirely of leaving on time. It is underrated at every fire but this one.',
      incredible: 'You pull them out — and per your standing order they go out the LONG way, downstream of the well, past the cart-track, counting: gates, watchers, the harbor’s single narrow mouth, the cliff-top perches over it. The fleet is at sea before the trap knows it was sprung EMPTY, carrying home the complete anatomy of the ambush that will eat some other fleet. You send word of it, later, by three trade routes. Some captains you save, friends, you never meet.',
    },
    right: {
      label: 'Stand ready off the harbor mouth', approach: 'might', risky: true,
      bad: 'You stand the fleet in the harbor mouth to cover the scouts, and the harbor mouth, friends, is exactly where the tall town wants visitors to stand: the cliffs above it grow throwers the way spring grows leaves. The scouts are saved. The saving is paid for in timber and worse, and the fleet that runs for open water has learned the local word for “guests.”',
      good: 'You hold the mouth with shields rigged and arrows nocked, and when the pursuit boils down to the shore it meets a fleet DRESSED for the occasion — and giants, whatever the songs claim, do their arithmetic like everyone else: forty archers, narrow water, dusk coming. The scouts splash aboard; the tall town keeps its harbor; both sides bank the insult for another century. A draw, friends. Against that town, a draw goes in the annals.',
      incredible: 'You hold the mouth — from OUTSIDE it, every ship warped seaward of the narrows before the first scout even signaled, because you looked at that beautiful sheltered harbor and asked the pilot’s question: sheltered for whom? When the boulders come they land in water your keels have already left, and the whole fleet watches, appalled and safe, what that anchorage does to its guests. In the pilot-books of three seas that harbor now bears the note you wrote for it. The note is one word, friends. The word is: DON’T.',
    },
  }),
  sea('ody_a2_moly', 2, {
    tags: ['deep', 'omen'],
    prompt: 'On the path up to the witch’s house a young man is suddenly beside you who was not beside you, holding out a flower: black root, milk-white bloom. “You will want this,” he says, and his sandals, friends, do not quite touch the pine needles.',
    recap: 'The flower on the path.',
    left: {
      label: 'Take it, and ask its price', approach: 'lore',
      bad: 'You ask the price and the shining boy laughs — and the laugh, friends, costs more than any price would have: it is the laugh of a power amused by CAUTION, and it follows you up the path, and you arrive at the witch’s door second-guessing a gift the gods gave freely. Doubt is the one poison moly does not cure. You manage anyway. Barely.',
      good: '“Its price is that you take it,” he says, pleased — the gods, friends, are shopkeepers of a strange kind; asking shows respect for the goods. He teaches you the herb’s use in nine words, names the witch, names her tricks, and is gone like a change of wind. You walk on armed with knowledge that grows nowhere a mortal can pick it. The house ahead has met heroes. It has not met PREPARED.',
      incredible: 'You ask the price and hold his eyes while you ask it — and the shining boy stops smiling and looks at you properly, the way craftsmen look at unexpected competence. “The price,” he says at last, “is that you will be asked for it onward, by others, and must give it as freely.” You take the flower and the geas both. Remember that bargain, friends. This tale is full of people on paths. Some night, at some fire, YOU will be the young man with the flower.',
    },
    right: {
      label: 'Take it, and walk faster', approach: 'might',
      bad: 'You take it with a soldier’s nod and no questions, and so arrive at the witch’s door holding a flower you cannot NAME, unsure whether to eat it, wear it, or wave it. The herb’s virtue holds regardless — the gods build their gifts foolproof, having met many fools — but you fight that whole strange evening one fact short of understanding it, which is a bad margin in a witch’s kitchen.',
      good: 'You take it, thank him properly, and are moving before his light fades — because your men are in a sty NOW, and courtesies can be paid on the move. The herb pulses cold in your fist all the way up the path like a held star. Whatever it is, it is WORKING already. The god watches you go, they say, with the particular approval powers reserve for mortals who do not waste a rescue.',
      incredible: 'You take it at a run, over your shoulder, like a baton in a relay — and the shining boy, delighted, RUNS WITH YOU, matching your pace without a footprint, briefing you on witch-craft between strides like an officer before an assault. He peels away at the tree line laughing. There are, friends, perhaps five mortals who have made a god run to keep up with a rescue. The witch, watching two blurs come up her sacred path, put the kettles away early.',
    },
  }),
  sea('ody_a2_circe_road', 2, {
    tags: ['omen'],
    prompt: 'On the last night of the soft year the witch tells you the road home, and the road home, she says, runs first through the country of the dead. She says it kindly. The kindness is the frightening part.',
    recap: 'The witch names the road.',
    left: {
      label: 'Hear the whole of it tonight', approach: 'lore',
      bad: 'You take the whole itinerary at one sitting — the dead, the singers, the strait, the sun’s cattle — and it is TOO much road for one night’s carrying: the men read your face at breakfast like a bad chart, and the fear gets a day’s head start on the sailing. Some knowledge, friends, should be issued like rations. You opened the whole store.',
      good: 'All of it, tonight, with wine and a wax tablet: the trench, the blood, the prophet who must drink first, the herb-lore and the courses. You question her like a pilot, and she answers like one — precise, unhurried, twice-repeated where it matters. When you leave that table you are the best-briefed man ever to sail for the underworld. It is not a crowded field, friends. It is still an achievement.',
      incredible: 'You hear it all — and then ask the one question no hero has asked at her table: “And you? Who told YOU the road, and what did it cost her?” The witch goes still, and answers, and the answer is a story I may sing when the children are asleep — but from that moment she instructs you not as a mortal but as an EQUAL in the guild of those who have paid for their knowledge. The margin-notes she adds for you alone, friends, are the ones that get you through the narrows alive.',
    },
    right: {
      label: 'Take the first leg only', approach: 'guile',
      bad: 'The first leg only, you say — one horror per voyage — and she shrugs, being old enough to know how mortals ration fear. But the legs, friends, do not arrive in order. When the singers’ water finds you EARLY, you meet it with the briefing you postponed, which is to say: none. What you saved that night in dread you pay later at the standard rate of interest. The sea compounds daily.',
      good: 'The underworld leg only, learned cold and complete, the rest deferred: a man can hold one abyss in his head properly or five badly, and you have men to steer past the one. She approves — witches respect economy — and promises the next briefing at your return. You sail for the world’s edge carrying exactly as much fear as needed and not a jarful more — and the men, who can smell a captain’s dread through three planks of pine, sniff, find nothing, and row easy.',
      incredible: 'The first leg only — and you have her teach it not to you but to FOUR of you: helmsman, priest-minded Perimedes, steady Polites, yourself. Four heads, one route, no single point of failure; a captain, friends, who has lost men to a bag of wind learns where knowledge should NOT be stored — in one skull, however crowned. She watches you spread the map among your officers, and says a thing that keeps me warm on cold nights: “The clever survive. The ones who make OTHERS clever get home.”',
    },
  }),
  sea('ody_a2_elpenor_roof', 2, {
    prompt: 'Sailing morning, and the muster is one short: young Elpenor, who slept on the witch’s cool roof for the wine in him, has heard the shouting and gone to the ladder the fast way. The fast way, friends, was the edge.',
    recap: 'Elpenor and the roof.',
    left: {
      label: 'Stay for the rites in full', approach: 'lore',
      bad: 'You stay, and the rites are full, and the sailing tide goes out without you — and the NEXT tide has weather on it, and the fleet pays for the piety in a hard wet crossing that the men, unfairly and humanly, lay at the dead boy’s door. He owed no one bad weather, friends. Grief keeps crooked books.',
      good: 'A day given whole: the pyre, the barley, his oar planted upright in the mound at the sea’s edge where every passing ship will read what he was. The men mourn him properly, which is to say they finish it — tears at dawn, stories at noon, and by the evening tide his name can be said without silence after. That is what rites are FOR, friends. The dead are not the only ones they bury.',
      incredible: 'Full rites — and at the mound you do the thing that makes the fleet yours forever: you take the blame OUT LOUD. The wine was rationed by your order; the roof was under your command; the boy was everyone’s and so his fall is the captain’s. No man ever loved you worse for owning a death honestly. And Elpenor, friends — remember this when the trench is dug and the dead come to drink — Elpenor will remember it too.',
    },
    right: {
      label: 'Sail — mourn him at sea', approach: 'might',
      bad: 'The tide is fair and you take it, meaning to mourn properly at sea — but sea-grief without a body, friends, is smoke without a fire: it stings and settles nothing. The men leave a shipmate UNBURNED behind them, and the wrongness of it rides the fleet like a passenger. He will be waiting, at the world’s edge, to say so. The dead keep excellent calendars.',
      good: 'You sail on the tide — the season is against waiting and the boy would have hated costing the fleet weather — and mourn him the sailor’s way: his bench garlanded, his ration poured to the wake, his best story told at every evening fire down the whole week. It is not the full rite. You vow the full rite for the return. Hold me to that vow, friends. This tale holds everyone to everything.',
      incredible: 'You sail — but first, in the one hour the tide allows, you and three men run the hill and do the SHORT rite whole: the coin, the barley, the words compressed like a message sent by signal-fire, and his oar driven deep in the witch’s own garden where nothing will ever move it. She stands at her window, they say, and lets the garden take the grave. A short rite done wholly, friends, outweighs a long one done someday. But the SOMEDAY rite is still owed. Write it on the tale’s account. It will be paid at a strange time, in a stranger place.',
    },
  }),
  sea('ody_a2_pigs_memory', 2, {
    prompt: 'The men who were pigs do not speak of it, except that they now eat slowly, and neatly, and cannot watch the salt pork come out of the cask. At the evening fire one of them finally says: the worst part was that it was RESTFUL.',
    recap: 'What the sty left behind.',
    left: {
      label: 'Let them talk it out', approach: 'guile',
      bad: 'You open the door to the talk and the talk goes where you cannot steer it: past the sty, past the witch, into the wider question of what ELSE this voyage has made of them — and the fire goes late and dark, and some things get said between benches that need a month to heal. By morning two rowers have swapped benches to be farther from each other, and the whole ship is politely pretending not to know why.',
      good: 'You let it come, and it comes crooked and half-joking, the only way sailors can carry such cargo: the mud remembered fondly TO SPITE ITSELF, the trough described until the description becomes comedy, the awful restfulness named and laughed at and thereby made small. By full dark it is a story they own instead of a thing that owns them. That is the whole craft of the fire, friends. You just kept it burning.',
      incredible: 'You let them talk — and when the crooked laughter has done its work, you ask the one question underneath: “What was it a rest FROM?” And the fire goes quiet, and then honest: from choosing, they say. From counting the dead. From being the ones who must want to get home when wanting is the heaviest work aboard. Nothing is solved, friends. But the load, once named, is carried in COMPANY thereafter — and the fleet rows out of that anchorage with something no witch can bottle: men who have admitted the weight to each other, and picked it back up anyway.',
    },
    right: {
      label: 'Work them hard and kindly', approach: 'might',
      bad: 'You prescribe work, the old cure, and work works — on the surface, friends, where work lives. Underneath, the restfulness of the sty stays sweet in the memory, unexamined and waiting, and on the bad nights ahead more than one man will find his thoughts trotting back to the mud where nothing was asked of him. You will know those men, friends, by how readily they volunteer for the pig-work at every landfall after — and how strangely long they are about it.',
      good: 'Hard days, kind evenings: you load the sty-men with honest sea-work — real tasks, visible results, the body’s old argument that being human has its uses — and double their meat ration without comment. Slowly the neat, careful eating loosens; slowly the flinch at the pork-cask fades. The body, friends, is a road back to itself. You just kept them walking it.',
      incredible: 'Work, friends — but you choose the WORK like a physician: the sty-men and no others to crew the ship’s boat, a tight team with a proud task, ferrying and piloting and first-ashore at every landfall, until “the pig crew” turns from a cruelty someone whispered into a title they answer to with straight backs. You cannot unmake what the witch made of them. You can make it the FIRST chapter of a better story. By the narrows, other men are angling to join the boat.',
    },
  }),

  // ── The temptation of Act II: Circe (the soft year, offered again) ──
  {
    id: 'ody_tempt_circe',
    act: 2,
    tags: ['temptation', 'beat:circe'],
    requires: { anyOf: [{ burnoutMin: 60 }, { max: { expedition: 5 } }] },
    context: 'The witch’s house — the offer renewed',
    prompt: 'On a bad grey morning the goddess of the island says, without looking up from her loom: stay. Not a spell this time — an offer. The baths are hot, the men are fed, and out there the sea is saving something special for you. She says that last part like a weather report.',
    recap: 'The witch said: stay.',
    forceTier: { right: 'good' },
    choices: {
      left: {
        label: 'Ask her for the way home',
        tags: ['temptation', 'lore'],
        governingStats: { lore: 1 },
        outcomes: {
          bad: { text: 'You ask for the road home and she gives it, precisely, kindly, and the kindness is the blow: the road runs first through the country of the dead, and she watches you hear it, and pours the wine you suddenly need. The men see your face at supper and stop asking about the itinerary.', effects: { lore: 3, burnout: 3, athena: 1 } },
          good: { text: '“The way home,” you say, before the warmth of the room can finish its sentence — and she nods like a physician whose patient has chosen the surgery. The route she gives is exact and terrible and YOURS, friends, which is the whole difference between a road and a residence.', effects: { lore: 4, athena: 1 } },
          incredible: { text: 'You ask for the way home, and thank her for the year, and mean both — and the witch, who has turned better men into livestock for less, sets down her shuttle and gives you more than the route: the rites, the herbs, the names to say at the trench. Gratitude, friends, is the one magic she cannot brew, and she pays well for imports of it.', effects: { lore: 5, athena: 2 } },
        },
      },
      right: {
        label: 'Let the year become years',
        tags: ['temptation', 'guile'],
        governingStats: { guile: 1 },
        outcomes: {
          bad: { text: 'You stay. The loom sings. The wine goes round. Somewhere north of everywhere, an island keeps a lamp on for a man who is warm.', effects: { addFlag: 'ody_stayed_circe' } },
          good: { text: 'You stay. The loom sings. The wine goes round. Somewhere north of everywhere, an island keeps a lamp on for a man who is warm.', effects: { addFlag: 'ody_stayed_circe' } },
          incredible: { text: 'You stay. The loom sings. The wine goes round. Somewhere north of everywhere, an island keeps a lamp on for a man who is warm.', effects: { addFlag: 'ody_stayed_circe' } },
        },
      },
    },
  },
];
