// The Odyssey — Act III deck: The Narrow Way (slice 4, the authored sea).
// The last sea is a corridor with teeth on both walls, and beyond it — home,
// wearing a stranger's face. The voice narrows to the hush: the deep places
// are silent, and the homecoming ache does the work exclamation cannot.

import type { GameEvent } from '../../types.js';
import { sea } from './events.js';

export const ACT3_EVENTS: GameEvent[] = [
  sea('ody_a3_wax', 3, {
    tags: ['deep', 'omen'],
    prompt: 'The wax is soft, the rope is coiled, and the men are pretending not to watch you decide whether their captain hears what no man has heard and lived.',
    recap: 'Wax, rope, and a decision.',
    left: {
      label: 'Ears open, body bound', approach: 'might', risky: true,
      bad: 'The song finds the gap between the third and fourth lashing. What you promise the mast, what you offer the rowers to cut you free — the tale keeps those words, friends, and I will not lend them out. Perimedes adds two turns of rope and does not meet your eyes for a day. The ship passes. Something of you stays in that water.',
      good: 'You hear it whole: not beauty, friends — KNOWING. The song sings you yourself, every deed polished, every dead man alive again and cheering, and it is all true and all a door out of the world. The ropes hold. The rowers row deaf and steady. On the far side they unbind a man who knows exactly what he is made of, and exactly what it costs.',
      incredible: 'You hear it, and the song makes its offer — and somewhere in the middle verse you begin, against every story ever told of that water, to LISTEN like a craftsman: how it finds the seams, where it learned your dead. When the rowers unbind you, you are quiet a long time. Then you ask, hoarse, whether there is any of that wax left — “for the next time somebody sings at me.” The men laugh the careful laugh of men who heard their captain screaming an hour ago. You let them. It is cheaper than explaining.',
    },
    right: {
      label: 'Wax for every man', approach: 'lore', risky: true,
      bad: 'Wax all round, yours included — and the passage happens in a silence like being buried in wool: no song, no orders HEARD, a helm conned by hand-signals through water that wanted better attention. You are through. The men chip the wax out and look at you oddly, having crossed the famous water with nothing to remember it by but your pointing arm. Some victories, friends, feel like theft even when nothing was stolen.',
      good: 'Every ear stopped, every eye on your hands: you take the fleet through the singers’ water on signals alone, drilled the night before until the men could steer by your shoulders. The rocks slide past, garlanded with old hulls whose captains heard something worth dying for. Your crews hear wax and their own hearts. Both keep excellent time.',
      incredible: 'Wax for all — and for yourself as well, friends, which is the verse nobody expects: the captain who declines the famous temptation entirely, who looks at the one glory no man has claimed and decides his men need a HELMSMAN more than a hero. The fleet threads the water like a needle threading silence. The singers, they say, stopped mid-verse — nothing had ever ignored them before — and then started again LOUDER, like any act losing a room. I know that key change, friends. I have performed it. Pass the wine up and be glad the fleet is through.',
    },
  }),
  sea('ody_a3_strait', 3, {
    tags: ['deep', 'blood'],
    prompt: 'The strait breathes — six heads on one side, a swallowing mouth on the other, and a channel between them the width of a held breath.',
    recap: 'The breathing strait.',
    left: {
      label: 'Hug the cliff and pay', approach: 'lore', risky: true,
      bad: 'You hug the cliff as the old advice runs, and the cliff collects early — not six men, friends: seven, because the boy at the seventh bench stood up when the shadow fell. I will sing their names at the end of the night when the fire is lower. The ship goes through. The arithmetic goes with it, forever.',
      good: 'The cliff side, oars quiet, every man’s eyes ordered DOWN — and the toll is taken, six benches in one shadow of movement, faster than grief can even find its feet. You do not stop. That is the whole discipline of that water: the not stopping. The mouth on the far side would have taken everything. The cliff takes six. You will hear their mothers ask, someday, why those six. There is no answer, friends. There is only the far side, and the rest of the fleet alive on it.',
      incredible: 'You hug the cliff — armed, friends, which the advice forbids: not to fight (there is no fighting that) but to make the taking COST. When the shadow comes down it meets spear-points set in the deck like a hedge, and takes two men instead of six, and pulls back bleeding something that stains the strait for a tide. No one has ever wounded that water before. The pilots’ advice is being rewritten at this fire, tonight, in the version where somebody finally hit back.',
    },
    right: {
      label: 'Race the middle', approach: 'might', risky: true,
      bad: 'The middle course, full sprint — and the mouth on the left BREATHES IN, friends, and the sea tilts like a table lifted at one end. What swims out of that gullet-pull is saved by one oar-stroke and the grace of whichever god watches fools kindly. The ship comes through stripped of everything not lashed: casks, spars, and the fleet’s whole appetite for shortcuts.',
      good: 'You race the middle on the mouth’s exhale — timed from the cliff-top the day before, counted like a heartbeat: in, four hundred; out, four hundred — and the fleet sprints the corridor on the out-breath with the whirl spinning harmless behind. Six heads on the right watch you pass out of reach, disappointed. Nobody dies in that crossing, friends. The pilots say it cannot be done that way. The pilots are almost right.',
      incredible: 'The middle, on the exhale, at the dead sprint — and as the mouth begins to turn beneath the stern you do the thing the rowers still cannot explain drunk or sober: you SLOW the stroke, half a beat, so the last ship clears the pull on the same water-pulse as the first. Twelve hulls through the impossible middle with a loss of nothing but everyone’s fingernails. The six heads and the mouth, cheated together, howl at each other across the empty channel. Let them sort out whose supper you were, friends. You are wake and gone.',
    },
  }),
  sea('ody_a3_sun_isle', 3, {
    tags: ['deep', 'omen'],
    prompt: 'The island of the Sun is green and loud with cattle, and the wind that keeps you beached there does not smell like weather. It smells like a test.',
    recap: 'Beached with the Sun’s cattle.',
    left: {
      label: 'Oath the men: fish only', approach: 'lore', risky: true,
      bad: 'You take the oath from every mouth and the wind takes a month, and hunger, friends, is a lawyer: it finds the clause. You wake on the thirty-first dawn to smoke and the smell of roasting and men who will not look at you — and overhead, already, a light like an eye coming open. What follows the fleet off that beach follows it a long way. The oath held twenty-nine men of thirty. The sea only needed the one.',
      good: 'The oath, sworn on their own benches — and you make it KEEPABLE: fishing rotated like combat duty, seaweed dried and ground, the boat-crew running lines beyond the surf from dawn to dark, hunger managed like a siege. Thin men, honest men, and when the wind turns at last the cattle graze unbothered behind a fleet that owes the Sun nothing. The god counts his herd from the sky, twice, they say — surprised both times.',
      incredible: 'You oath them — and then you beat hunger to the punch, friends: the first fish caught goes to the Sun himself, burned whole on the beach with the words for FIRSTFRUITS, every dawn, without fail. Thirty mornings, thirty fish, thirty columns of honest smoke — until the herdsman-god, watching his cattle graze safe beside a starving fleet that TITHES to him anyway, leans on the weather out of something like respect. The wind turns nine days early. Even the tests, friends, can be passed with honors.',
    },
    right: {
      label: 'Leave in the wind’s teeth', approach: 'might', risky: true,
      bad: 'You force the departure into a wind with opinions, and the wind wins the way weather wins — no drama, just subtraction: a sprung yard, a swamped boat, and the fleet clawing back to the very beach it fled with LESS than it left with. The cattle watch you re-land. Chewing. There is no scorn, friends, like the scorn of a sacred cow.',
      good: 'You take the fleet out in the wind’s teeth because some tests are refused by LEAVING the examination hall — three brutal days, close-hauled, everything wet and nothing broken, and the island of temptation sinking astern with its cattle uncounted and its trap unsprung. The men curse you soaked and alive. That is the good kind of cursing, friends. You can sail for years on it.',
      incredible: 'Out, in weather no sane pilot would sail — but you have been TALKING to insane pilots your whole life, friends, and one of them once showed you the trick of the island’s lee: a current that runs contrary to the wind two spear-casts offshore, a road out for exactly whoever is desperate enough to look for it. The fleet rides it like a secret. Behind you the trap stands empty, the cattle safe, the test unsat — and somewhere in the sky a god who has watched a hundred crews fail marks one, at last, ABSENT.',
    },
  }),
  sea('ody_a3_raft', 3, {
    prompt: 'What the sea has left you fits on a raft you lash yourself, plank by plank, counting knots out loud because there is no one else to count to.',
    recap: 'The raft, knot by knot.',
    left: {
      label: 'Build for speed', approach: 'guile',
      bad: 'You build light and fast, and the sea, which reads intentions, sends weather to grade the work: the speed-raft comes apart at the fourth swell with a sound like a verdict read aloud. What you ride ashore, friends, is one plank of it — which is, if you squint, the FASTEST possible configuration. The sea enjoys its jokes. You are alive to not laugh at this one.',
      good: 'Light, lean, rigged to run — a raft built by a man who has decided that the sea between him and home is a distance, not a dwelling. It flies. Days of water go by in hours of wind, and when the far swell finally shoulders it apart in the shallows of somewhere new, it has already done the only job it was lashed for: LESS SEA. You wade ashore with the steering oar and your name.',
      incredible: 'Speed — but speed the way a master builds it, friends: every knot doubled where the strain lives, the mast stepped in a shoe of woven rope that gives instead of snapping, the whole raft designed to LOSE pieces in the right order, shedding itself plank by plank like a beast shedding weight to run. What grounds on the far shore is barely a raft at all. It was never meant to arrive whole. It was meant to arrive FIRST, and it did, and the sea is still puzzling over the wreckage-trail of the man who out-planned it.',
    },
    right: {
      label: 'Build to survive', approach: 'might',
      bad: 'You build heavy and sure, and the sureness is a slowness, and the slowness keeps you on the water one storm longer than a lighter build would have — which is, friends, exactly one storm too many. The raft survives it, plank for plank, magnificent. You survive it too, barely, lashed to your own good work and bailing with a boot. Somewhere in that long wet night, the raft and you agree never to discuss whose fault it was.',
      good: 'Heavy timber, deep lashings, a raft like a stubborn word — and the sea tries it properly, twice, and both times the knots you counted aloud hold the count. It is not fast. It was never going to be fast. It is the other thing, the thing that gets men home: STILL THERE, morning after morning, all the way to the last morning that matters.',
      incredible: 'You build to survive — and you build the SURVIVING in layers, friends: a raft within the raft, the core four logs lashed so that even if the sea strips every outer plank a man could still ride what remains. The sea, professionally interested, strips every outer plank. The core four logs deliver you to the river-mouth like a package the ocean failed to open. Fishermen who salvage the pieces afterward, they say, copied those lashings for a generation. The sea kept the planks. You kept the lesson, and the life.',
    },
  }),
  sea('ody_a3_nausicaa', 3, {
    prompt: 'You wake salt-flayed on a river mouth to the sound of girls at laundry, and the first face of your last kingdom before home is a princess deciding whether to run.',
    recap: 'The princess at the river.',
    left: {
      label: 'The suppliant’s words, exactly', approach: 'lore',
      bad: 'You give the suppliant’s words from your knees, exactly — and exactness from a naked salt-wrecked giant has, it turns out, its own comedy: the maids bolt like startled birds and the formal periods of your plea echo down an empty beach. The princess, to her everlasting credit, comes back first. “Say the middle part again,” she says. “Slower. You do that well.”',
      good: 'The old words, whole and unhurried, from a kneeling man who looks like the sea’s worst day: distance kept, her knees unclasped, the goddess of the place named before any request. Form, friends, is what makes a monster legible as a man. She hears the form under the wreckage and answers like the king’s daughter she is: clothes, oil, directions, and the advice that will carry you into the city better than a spear-guard could.',
      incredible: 'The suppliant’s words — but you build them, friends, around HER: you liken her to a young palm you saw once by an altar on Delos, straight and astonishing, and the compliment is so exactly measured — reverent, distant, true — that fifty years from now she will tell her grandchildren about it word for word. The songs keep the speech and drop the staging, friends: the man composing that jewel is naked as a mackerel, crusted white with brine, holding a leafy branch over the last of his dignity — and the maids, peeking from the tamarisks, are grading the branch.',
    },
    right: {
      label: 'Charm — carefully', approach: 'guile',
      bad: 'You charm, carefully — but salt-charm at close range reads, to a well-raised princess, exactly like what it is: technique. Her face closes politely, the way palace faces do, and the help you get is correct and cool and comes with an escort whose job description you are not told. You enter the city as a MANAGED problem, friends. It is better than no entry. It is much worse than her friendship.',
      good: 'Charm, at the proper distance, with the self-mockery doing the heavy lifting: a shipwrecked man who can make a princess laugh at his own ruin is halfway to rescued before the laundry is dry. She likes you the honest way — as a good story that walked out of the sea — and her practical kindness (clothes, the road, WHICH door of the palace, WHOSE knees to clasp) is worth a pilot’s fee. Wit, friends: the only currency that survives immersion.',
      incredible: 'You charm carefully — and then, mid-sentence, you STOP charming, friends, because you see her seeing through it, and you simply tell her the truth instead: the war, the sea, the men all gone, the home you cannot seem to die close enough to reach. The truth, from a man past performing it. She is silent a moment. Then she organizes your rescue like a quartermaster and walks you to the city herself, proprieties managed, and at the gate she says the thing the tale keeps: “Remember me, when you are home. I was the first thing that went right.”',
    },
  }),
  sea('ody_a3_phaeacia', 3, {
    tags: ['kleos'],
    prompt: 'The king’s hall, the harp passed round, and the court bard — blind, superb — begins, of all songs, the fall of Troy. He is singing your war to your face, and does not know you are in it.',
    recap: 'Your own war, sung to your face.',
    left: {
      label: 'Weep, and be asked', approach: 'lore',
      bad: 'You weep behind your cloak and are seen — kings’ halls see everything — and the question comes before you are ready, and the answer comes out of you crooked: name, war, wandering, all in the wrong order, grief driving the chariot. The court gets the tale, friends, but as wreckage. Even sympathy, wrongly timed, is a kind of shipwreck.',
      good: 'The tears come and you let them, and the king — a decent man in the way that matters, the NOTICING way — stops the song and asks his guest’s name with the whole hall listening. And you stand, and give it, friends, the way a man draws a sword he has not needed in years: “I am Odysseus, son of Laertes, whom men speak of.” The silence after is the best applause of the voyage. Then you tell them everything, and the fire I sing at tonight is the great-grandchild of that telling.',
      incredible: 'You weep openly, without the cloak — a man honoring his own dead at the sound of their names — and when the king asks, you do not just answer, friends: you take the harp. THE HARP. From the court’s own blind master, with a bow to him, and you sing the fall of Troy from INSIDE it — the horse’s dark, the held breath, the gates — and the professional, listening to his own song corrected by an eyewitness, weeps in his turn and calls it the greatest honor of his craft. Two bards, one war, one hall unable to breathe. That NIGHT, friends, is why this tale has never once been allowed to die.',
    },
    right: {
      label: 'Stay the stranger a while', approach: 'guile',
      bad: 'You keep the stranger’s mask through the song and the feast — and a court that lives by hospitality begins, gently, to find the mask rude: a guest who will not be known is a guest who does not trust the roof. The welcome cools by protocol degrees. You get your passage home, friends, but as freight, not as legend. The tale nearly ended anonymous, and I would be singing accountancy tonight.',
      good: 'The stranger a while longer: you listen to your own war from outside it, the one seat no man of Troy ever gets to sit in, and you learn what the world actually kept of those ten years — which deeds grew, which dead were forgotten, what YOUR name has been doing while you were at sea. Intelligence, friends, of the rarest kind. When you finally stand and claim the story, you claim it knowing exactly what it weighs.',
      incredible: 'You stay the stranger — and you QUESTION the bard, friends, courteously, expertly, from the far couch: where did he learn the Troy song, which captains does the tradition rate, what became — you keep your voice level — of Odysseus? And the blind man, warming to a listener who knows the right questions, gives you the whole harvest: your legend’s exact size, its errors, its debts, and the widows’ verdicts on every commander. No spy ever debriefed his own myth before. When you rise at last and say the name, the bard goes white, and then — bless him — LAUGHS: “I have been singing to the primary source.”',
    },
  }),
  sea('ody_a3_disguise', 3, {
    prompt: 'Ithaca at last — and Ithaca must not know. The beggar’s cloak itches, and every stone of the road to your own door asks whether you can bear to be pitied on it.',
    recap: 'A beggar on his own road.',
    left: {
      label: 'Play it to the hilt', approach: 'guile',
      bad: 'You play the beggar so well that the island’s actual beggars, a guild with standards, take offense at the competition — and their king, a mountain named Iros, decides the new man needs schooling. The brawl that follows blows more cover than it keeps: beggars, friends, do not drop a man of Iros’ tonnage with one measured hook. Eyebrows rise all down the road. The rags survive. The anonymity limps.',
      good: 'To the hilt: the stoop, the shuffle, the whine perfected on the walk — and the island teaches its lesson at every door, friends, the lesson only the disguised can take: exactly who Ithaca is when it thinks no one important is watching. The kind ones go in one ledger, the cruel in another. Both ledgers, believe me, will be consulted.',
      incredible: 'You play it past the hilt, friends — you play it INTO the truth: twenty years of salt and loss need so little acting that somewhere on that road the mask and the face agree to merge, and what knocks at doors is genuinely a ruined man asking his own island for kindness. The performance becomes a REckoning. And Ithaca — poor, suitor-bled Ithaca — feeds its unrecognized king from thin cupboards more often than not, and every crust goes into the ledger that will decide, quite soon, who lives through the day of the axes.',
    },
    right: {
      label: 'Test the old dog’s memory', approach: 'lore',
      bad: 'You go first where the heart pulls, to the kennels — and Argos, ancient on his dung-heap, knows you at ten paces and CRIES it, the full bay of homecoming, tail hammering, and every head in the yard turns to see what a dying dog has recognized in a beggar. You get out of the yard with the secret intact, friends, barely, and the sound follows you: joy, absolute joy, blowing your cover out of pure love. There are worse wounds. There are no stranger ones.',
      good: 'The dog knows you — of course the dog knows you; you trained him on these hills — and lifts his head from the dung-heap where twenty years have parked him, and finds the tail, one beat, two. You cannot kneel to him. A beggar does not weep over a lord’s old hound. So you stand, and say inside where no one hears: GOOD BOY. FINISHED WAITING. He lies back down easy, friends, the watch handed over at last. Some reunions are three seconds long and outlast marble.',
      incredible: 'You test the dog’s memory and the dog, friends, tests YOURS: at his one-beat tail you stop, and against every tradecraft in you, you go and sit an hour on the dung-heap beside him — a beggar resting with a dying dog, unremarkable, invisible — and under a hand that pretends to idle scratching you tell him everything: the war, the sea, the way home. He hears it all. He was always going to be the first one told. He dies that evening, they say, after; and of every door on Ithaca, friends, grief’s and love’s both, the first one that opened for the king was a dog’s heart, and it never once considered staying shut.',
    },
  }),
  sea('ody_a3_swineherd', 3, {
    prompt: 'The swineherd feeds a ragged stranger from his own bowl and talks, unprompted, about the master he still sets a place for. You could tell him now.',
    recap: 'The swineherd’s loyalty.',
    left: {
      label: 'Hold the disguise', approach: 'guile',
      bad: 'You hold the mask through the man’s open grief — and holding it means DOING grief’s opposite: shrugging at your own name, agreeing the master is surely fish-food, watching loyalty ache across the fire and offering it nothing. Tradecraft, friends. It keeps you safe, and it costs exactly what it looks like it costs. Eumaios refills your bowl anyway. That is the kind of man you are lying to.',
      good: 'You hold it — but you pay him in the only honest coin a false name can carry: a “rumor,” told slow across the fire, that Odysseus lives, that he was seen at Dodona not a season past, that he comes. The swineherd has been burned by twenty years of such rumors and armors up against this one, and fails, friends, visibly — hope getting into him like spring into frozen ground. It is not the truth. It is the truth’s advance messenger. It will hold him the last week.',
      incredible: 'You hold the disguise, friends, and the disguise becomes the finest gift you could give him — because you spend that night ASKING: about the master (long dead, he insists, wiping his eyes), what he was like, whether the stories are true — and Eumaios talks until dawn, twenty years of banked love paid out to the one listener on earth who can check every fact. You hear your own eulogy from the man who meant it most, friends. Kings are told what they wish to hear. Beggars are told the TRUTH. It is the best intelligence and the best hour of the homecoming, both.',
    },
    right: {
      label: 'Give him a true omen', approach: 'lore',
      bad: 'You give him an omen — the master returns before the moon fills, mark the birds tomorrow — and tomorrow’s birds, friends, being birds, do something ambiguous, and the swineherd’s hard-won hope takes the disappointment badly: one more prophet at his fire, one more nothing. You have spent his credulity a week before you need it. Prophecy is a bow, friends. You do not draw it for practice.',
      good: 'A true omen, carefully small: before the moon fills, you tell him, watching the fire, the master’s chair will be filled and the fillers of it will wish otherwise. He snorts — twenty years trains a man to snort — but he MARKS it, friends; you see the words go into him and take root beside the set place at his table. When the day of the axes comes and the prophecy stands up out of the beggar’s rags, Eumaios will remember being trusted first. That memory is worth a fighting man at the door. It will be one.',
      incredible: 'You give him the omen — sworn, friends, on Zeus of guests and the table between you, in the old full form no liar dares: THIS VERY MOON, the master under his own roof, the suitors answered. And the oath’s weight does what rumor and reason cannot: the swineherd stops arguing and starts, quietly, to sharpen things. When you rise against a hundred men in your own hall, the first spear at your shoulder will be a pig-keeper who believed one night early — and the last gift of the oath, friends: he fights that day not for wages or wonder, but because the stranger at his fire kept faith with him before keeping it was safe.',
    },
  }),
  sea('ody_a3_hall_watch', 3, {
    tags: ['blood'],
    prompt: 'From the beggar’s bench you count them: one hundred and eight suitors, eating your herds, courting your wife, and not one of them able to string your bow. Probably.',
    recap: 'Counting suitors from the bench.',
    left: {
      label: 'Mark the doors and blades', approach: 'guile',
      bad: 'You case your own hall like a thief and are caught at it — not by the suitors, friends, who see only furniture wearing rags, but by an old servant who knows the LOOK of a man measuring a room for violence and starts watching the beggar with narrowed eyes. One more watcher is one more variable. The count is made, but so is a counter-count, and you will spend a precious evening neutralizing your own side’s vigilance.',
      good: 'Sixteen paces door to door; the bronze racked on the west wall, high; two exits and one bars from inside; which suitors sit sword-armed and which trust the house’s peace — the whole killing-ground surveyed from a beggar’s bench at beggar’s leisure. They feed you scraps, friends, and you inventory their deaths politely between bites. There has never been a table so exactly the reverse of what it believed itself to be.',
      incredible: 'You mark the doors, the blades, the sixteen paces — and then the finer grain that turns slaughter into surgery: which suitors check the exits (dangerous), which drink with both hands (not), which servant girls carry warnings to whose bed. You will spare three of the loyal by that map. Meanwhile Antinoos, lord of all he eats, throws a hoof at the mapmaker’s head — and misses, and goes back to the mutton, unaware he has just made the shortest entry in the ledger: THROWS WIDE.',
    },
    right: {
      label: 'Test one with an insult', approach: 'might',
      bad: 'You pick the biggest and probe with a beggar’s insolence, and get the measure of him at the cost of a footstool across the shoulders and the hall’s laughter like gulls — data, friends, purchased retail. Worse: your eyes over the bruise are, for one heartbeat, not a beggar’s eyes, and the sharpest of them, Eurymachos, sees it and files it. You learned one man’s arm. He learned there is something in the rags worth watching. Bad trade.',
      good: 'You choose Antinoos — the loudest, the leader — and lob the beggar’s barb that tests what command he really has: and he answers with a thrown stool and a threat, friends, in front of the whole company, and the company LAUGHS. That is the finding: no discipline, no shame before witnesses, a mob with a haircut. A hundred and eight men who cannot govern one dinner will not govern the moment the bow comes off the wall. You rub your shoulder and bank the diagnosis.',
      incredible: 'One insult, precisely aimed — not at a man, friends, at the FAULT LINE: a mild beggar’s joke about how each suitor surely hopes the OTHERS fail, and you watch it go through the hall like a crack through ice. Antinoos glares at Eurymachos; three factions surface for one naked instant and submerge. Not a hundred and eight, you record: three gangs in a truce. And truces, friends, are doors. On the day of the axes, a third of the hall will hesitate one heartbeat — and heartbeats are how one man beats a hundred.',
    },
  }),
  sea('ody_a3_penelope', 3, {
    prompt: 'The queen interviews the beggar by firelight about the husband he claims to have met, and her questions are so exact that lying to her is a kind of truth.',
    recap: 'The queen’s exact questions.',
    left: {
      label: 'Give her a coded truth', approach: 'guile',
      bad: 'You code the truth into a traveler’s tale — the cloak, the brooch, the dog worked in gold — and the code is TOO good, friends: she breaks down at the exactness of it, twenty years of held grief let go at a stranger’s fire, and her weeping is so terrible that you nearly break with her, and the maid Melantho, entering on the scene, reads something in the beggar’s face that beggars’ faces should not hold. You comfort a queen and endanger a kingdom in the same hour.',
      good: 'A coded truth: you saw him, you say, twenty years past — and you describe the purple cloak, the golden brooch with its hound and struggling fawn, the words he said of home. TRUE, all of it, friends; you are describing your own wedding-gifts back to the woman who chose them. She tests, you pass; she weeps, you endure it with a beggar’s awkwardness while your own heart tears its stitches. And she believes the STORY without suspecting the STORYTELLER — which is the exact, cruel, necessary shape of the thing. Two more days, friends. The truth is two days out.',
      incredible: 'The coded truth — and into the code, friends, you smuggle MEDICINE: he lives; he is near; he comes before this very moon is out. Hope and disbelief fight in the queen’s face like weather, and you say the one thing more: “Set the contest. The bow, the axes. If he is the man the stories tell, the bow will find him.” SHE will fire the starting-signal of her own rescue, believing it her surrender — the finest indirection in the poem, aimed at the one person he cannot bear to deceive, and it saves them both. The queen sleeps that night. She had not, they say, for a long time.',
    },
    right: {
      label: 'Keep the scar hidden', approach: 'lore',
      bad: 'You angle the bad leg from the firelight all evening — and the old nurse, washing the guest’s feet by the queen’s courtesy, finds the boar-scar anyway with hands that KNEW it before Troy was a rumor. Her cry is half out of her throat before your grip and your look strangle it, friends, and the bowl rings on the floor, and the queen — the gods were merciful — is gazing into the fire and asks only if the water was too hot. The secret survives on one heartbeat’s luck. Luck, friends, is not a plan. You have spent tonight’s ration of it.',
      good: 'You keep the scar hidden the professional way: the foot-washing accepted (refusal would itself be a signature), but steered to the young maid who never knew your legs, the old nurse thanked and blessed and BODILY out-maneuvered with a guest’s humble fussing. Eurykleia goes to bed suspicious of nothing but her own aching hands. The scar stays a scar. Two days, friends. Even your childhood must wait two days.',
      incredible: 'You keep it hidden — from everyone but ONE, friends, and by choice: when the old nurse’s fingers find the boar-scar and her eyes fly up with your name filling her mouth, you are already there — hand, look, whisper: “Yes. You are the first. If you love him, the ONLY.” And Eurykleia becomes, in one silent heartbeat, the conspiracy’s first soldier: mistress of every key, mother of the servants’ loyalties. The tale pretends the scar was found by accident. At this fire we may admit: the best recruitments always look like accidents.',
    },
  }),
  sea('ody_a3_bow_night', 3, {
    prompt: 'The night before the contest, the great bow lies in its case like a question. Hands remember, or they do not. There is one way to know and no private place to know it.',
    recap: 'The bow in its case.',
    left: {
      label: 'Trust the hands', approach: 'might',
      bad: 'You let the bow lie and trust the hands — and the hands, friends, spend the whole night telling you exactly what twenty years of rope and oar have done to them: the night is one long inventory of stiffness, conducted in the dark, alone, with tomorrow leaning on the door. Doubt is also a suitor, friends, and it courts hardest the night before. You sleep an hour. The hands, at dawn, are just hands. They will have to do.',
      good: 'You trust them — they drew that bow a thousand times before Troy; the body keeps what the body loved — and you spend the night not on rehearsal but on REST, the veteran’s discipline: the mind walked deliberately away from the axes, the breathing slowed like a banked fire. At dawn the hands wake calm, and calm, friends, is nine-tenths of a bowshot. The last tenth was never in doubt. It only thought it was.',
      incredible: 'You trust the hands — and give them, in the dark, the one rehearsal no watcher could read, friends: the MOTION without the bow, empty-handed in your blanket like a man stretching in sleep — the brace, the draw, the anchor, the loose — thirty years of muscle spoken to in its own language, twenty slow repetitions of remembering. No wood, no string, no witness. The suitors sleep over your head, and under them, in a beggar’s blanket, the best archer of the age quietly tunes himself like an instrument. Tomorrow the bow will leap to him as if it had been practicing too. In a way, friends, it had: they were dreaming of each other.',
    },
    right: {
      label: 'Walk the hall instead', approach: 'guile',
      bad: 'You leave the bow its mystery and pace the sleeping hall — and a wakeful suitor, coming back from the latrines, finds the beggar standing in the dark EXACTLY where tomorrow the axes will stand, motionless, measuring. “Lost, old man?” Your shuffle and mumble buy the exit, friends, but the moment rides with him back to bed. Tomorrow, when the beggar reaches for the bow, that one suitor’s hand will already be moving for his sword. You have pre-armed your closest call.',
      good: 'The hall, walked slow in the dead hours: where the light will fall at contest-time, which flagstone rocks, the straight line from the beggar’s stool to the arrow-basket — the ARCHER’s homework, friends, which matters more than the archery. The bow will remember your hands or it will not; either way, the man holding it will know his ground like a farmer knows a field. Champions rehearse the shot. Veterans rehearse the ROOM.',
      incredible: 'You walk the hall — and you walk it, friends, as three men in one night: the archer (light, sight-lines, the wind through the west door at morning); the killer (reach of each table, the bronze rack’s height, the bar of the door); and last, slowest, the KING — the husband pacing the room where he was married, touching the pillar he built around, the living olive-trunk at the house’s heart, taking his home back inch by inch in the dark before taking it back in blood by day. At dawn the beggar on the stool contains all three, settled and agreed. The suitors see one ruined old man. The room, friends — the room knows exactly who is sitting in it.',
    },
  }),
  sea('ody_a3_signs', 3, {
    tags: ['omen'],
    prompt: 'Thunder from a clear sky, a servant’s chance words, a sneeze at the naming of vengeance — the house is thick with signs, if you are the kind of man who reads them.',
    recap: 'The house filled with signs.',
    left: {
      label: 'Read them all; act tonight', approach: 'lore',
      bad: 'You read the signs as GO and move the day up a day — and learn, friends, why the gods bother sending signs at all: half the loyal are unbriefed, the bow still cased, the doors unbarred, and only a second thunder-crack — annoyed, unmistakable — stops you at the brink of a brave shambles. The signs said READY. You heard NOW. Even at the last door, friends, the oldest fault: the strong reading over the true one.',
      good: 'You read them — the thunder for confirmation, the grinding-woman’s curse on the suitors for consent of the house, the sneeze for the gods’ own punctuation — and you take them as a commander takes a scout’s report: the ground is favorable, the hour is CLOSE, hold. One more day of patience with the omens at your back like a following wind. When it comes, friends, it will come signed and sealed. That is worth a day.',
      incredible: 'You read them all — and then, friends, you ANSWER: at the clear-sky thunder you lift your beggar’s cup a finger’s height, the smallest toast in history, one professional acknowledging another’s message across a crowded room. And the house, they say, settles around that tiny gesture like a ship coming onto her lines — the signs cease, having been RECEIVED. The gods do not need worship from a man about to do their work. They need a receipt. You are the only captain in the poem, friends, who ever thought to send one.',
    },
    right: {
      label: 'Signs are not a plan', approach: 'might',
      bad: 'Signs are not a plan, you rule, and plan on — and the house’s whole nervous system, which was TRYING to help, goes quiet around you, friends, offended the way ignored help is always offended: the servant who might have warned of the armory door says nothing; the thunder holds its breath. You will manage without them, tomorrow, at a cost the signs were offering to discount. Pride, friends, pays retail.',
      good: '“Signs are not a plan,” you tell your son in the dark, and finish the plan: the bronze moved on YOUR schedule, the doors assigned, the loyal counted twice — and then, the work done, you allow the signs their say as SEASONING: thunder noted, sneeze smiled at, the grinding-woman’s curse taken as one vote of a hundred you intend to win regardless. Omens make a fine sauce, friends. The meal is preparation. Tomorrow serves both.',
      incredible: '“Signs are not a plan” — and you prove it in the strangest way, friends: you plan the day of the axes so completely, so redundantly, that no sign could add a feather’s weight — and THEN, the last candle out, you kneel and tell the dark, plainly: “Whatever was meant by the thunder: thank you. I have done all that hands can do. What is beyond hands is yours.” The most thorough man in the poem, on his knees at the end of thoroughness. That, friends, is the whole treaty between gods and captains, spoken once, at midnight, by its best practitioner. Tomorrow both parties keep it.',
    },
  }),

  // ── new in slice 4: the last sea's texture ──
  sea('ody_a3_sirens_offer', 3, {
    tags: ['deep', 'kleos'],
    prompt: 'They do not sing beauty — that is the pilots’ error. Across the flat water, in your own mother’s cadence, they sing KNOWLEDGE: every deed of Troy sung true, and the deeds of every man who ever drowned believing he was owed one more verse.',
    recap: 'What the singers actually sell.',
    left: {
      label: 'Steer by the drowned men’s bones', approach: 'lore', risky: true,
      bad: 'You con the passage off the wreck-line — where the bones whiten, DON’T — and the method works until the method becomes the temptation, friends: the water is clear, the hulls below have names you know, and the song adjusts its offer mid-verse to include the fates of THOSE crews, sung to the one man navigating by their graves. The helm wanders a point. One point, in that channel, is a near thing. The rest of the passage is rowed with your eyes shut, which is its own seamanship.',
      good: 'The bones are the chart, friends: every white drift below marks a captain who sailed TOWARD the sound, so you sail the mirror of their courses, reading the dead men’s errors like a pilot-book written in the only honest ink. The song rages at a ship that treats it as a navigational hazard. That is all it ever was, you tell the helm. The helm, wax-deaf and steady, agrees by existing.',
      incredible: 'You steer by the bones — and you STOP, friends, once, in safe water at the channel’s far mouth, and do the thing no ship has done: put back a boat, under wax, and take up three drowned men’s skulls from the shallows, and carry them a day’s sail on to a clean headland and the full rites. Somebody’s captains. Somebody’s verse-hungry, home-sick, ordinary drowned. The singers watch you bury their larder, they say, in silence. What do you sing to a man who mourns your victims, friends? Nothing. There is nothing in that repertoire. It is the only time the water off that island has ever been quiet.',
    },
    right: {
      label: 'Let them sing you Troy', approach: 'guile', risky: true,
      bad: 'You take the famous option, lashed and listening — and the song, friends, finding Troy already sung to you by better bards, goes DEEPER for its hook: it sings the verses that do not exist yet, your homecoming as it could still be, the hall, the queen, the door — all of it conditional, all of it yours, they promise, one short swim away. Rope learns what rope is for. On the far side you cannot look at the water for a day, and you tell the men it was nothing, and the men, watching your hands, let the lie stand.',
      good: 'Lashed to the mast, you take delivery of the goods, friends: Troy entire, from above, from BOTH sides — what Priam said in the last night, where the ships burned first, the name of the man who actually thought of the horse first (I will not repeat it; there would be a brawl at this fire) — the whole war, true and complete, the way only the drowned and the divine ever hear it. It costs you a day of trembling and rope-burns to the bone. Every telling I make of the war since, friends, is the richer for it. You are welcome.',
      incredible: 'You listen — and you BARGAIN, friends, which no lashed man has had the gall to try: between verses you shout back corrections. Errors in their Troy. Gaps in their war. And the singers, whose whole hunger is knowledge, pause. And ASK. For one impossible passage the commerce runs BACKWARD: a mortal, roped to a mast, dictating history to the things that eat historians. They let the ship go. Professional courtesy. The pilots’ guild refuses to believe me, and the rope-scars on my forear— on HIS forearms, friends, say otherwise.',
    },
  }),
  sea('ody_a3_fig_tree', 3, {
    tags: ['deep'],
    prompt: 'The second time past the strait there is no ship — only you, a spar, and the mouth beneath beginning, with terrible patience, to breathe in. Over the whirl, from the cliff, leans one fig tree, old and thick as a door.',
    recap: 'The fig tree over the whirl.',
    left: {
      label: 'Leap for the tree', approach: 'might', risky: true,
      bad: 'You leap and take the branch — and hang, friends, HANG, while the mouth below drinks the sea, the spar, the afternoon: hours, arms first burning then wooden then merely distant news, the whirl exhaling and inhaling beneath your sandals like a thing that knows exactly how long shoulders last. When the spar finally spins back up and you drop to it, you cannot close either hand for a day. The tale calls it the hardest hour of the ten years. The tale is not exaggerating for once.',
      good: 'The leap, the catch, the long hold — a bat under the sky, the pilots say, and the pilots were not THERE: bark against your cheek, the mouth below working through its meal, and your whole life narrowed to the plain arithmetic of grip against time. You win it, friends, the dullest and greatest way anything is ever won: by not letting go, and then continuing to not let go, and then — this is the secret — not letting go. The sea spits the spar back at dusk. You drop, catch it, and are carried out on the ebb, a man the strait tried twice and could not keep.',
      incredible: 'You leap — and in mid-air the CAPTAIN is still on duty, friends: you take the branch one-handed and spend the swing traveling ALONG the bough to the trunk, where a man can wedge and rest instead of dangle and die. From that seat you time the whirl, counting the mouth’s slow breath against your pulse — and when the waters give back the spar you do not drop desperate: you drop CHOSEN, onto the out-breath, and ride the ebb out like a man stepping off a porch. The fig tree is climbed by pilgrims now. They leave figs. It has earned them.',
    },
    right: {
      label: 'Ride the spar and count', approach: 'lore', risky: true,
      bad: 'You stay with the spar and trust the count — in, four hundred; out, four hundred — and the count, friends, is TRUE, but your grip’s arithmetic is not: the mouth’s in-breath takes the spar down its first spiraling arm’s-length with you attached before terror teaches what the fig tree was FOR. You claw back topside on luck and salt-blind fury, and make the tree’s branch on the second pass with the whirl’s spray already cold on your calves. The count was right. Counting, friends, is not the same as being able to afford the number.',
      good: 'You ride the spar wide, kicking for the whirl’s rim where the water moves fast but FLAT, and count the mouth’s breathing like the witch taught: never fight the in-pull straight, spend it sliding SIDEWAYS, gain on the out-breath, again, again. It is an hour of mortal bookkeeping, friends, debit and credit with the sea’s own accountant, and you come out the far side overdrawn in everything but life. Life, however, is the account that matters. The strait notes a second escape and begins, one imagines, a file.',
      incredible: 'You ride it — and you USE the whirl itself, friends, the secret the drowned never live to file: the mouth is not a hole but a WHEEL, and a wheel’s rim, ridden with intent, is the fastest road in that water. Heels first, spine flat, into the outer spiral — and the monster’s own hunger slings you three-quarters round and OUT at the western lip, faster than oars could ever throw you. Poseidon, watching his pet used as a ferry, gave up something between a roar and a laugh. Even wrath respects craft, friends. It is the god’s one weakness, and the tale’s whole hope.',
    },
  }),
  sea('ody_a3_hunger_month', 3, {
    tags: ['deep', 'omen'],
    prompt: 'The pinned wind holds a month, and the island’s fish grow wise to every hook aboard. Hunger stops being an event, friends, and becomes a RESIDENT — and it begins, at the fires, to talk in the men’s voices about the fat, sacred, forbidden cattle.',
    recap: 'The month hunger moved aboard.',
    left: {
      label: 'Ration the truth as well as the food', approach: 'guile',
      bad: 'You manage morale by managing information — the wind will turn any day, scouts have seen weed drifting, all but promised — and hunger, friends, fact-checks: day follows windless day and each cheerful bulletin devalues the currency, until the men trust neither the forecasts nor, more dangerously, the forecaster. When the whisper about the cattle starts, it starts as: HE lies about the wind. What else. The larder of your credibility, friends, empties faster than the other one.',
      good: 'You ration everything, truth included, but honestly, friends: each dusk the plain accounting — what was caught, what remains, what the sky says, no gloss — and each dusk, after it, ONE good thing that is also true: the water holds, the hulls are sound, no man has died. Hunger stays a hardship and does not become a betrayal. The line between those two, friends, is captaincy, drawn nightly in a thin voice with salt on it.',
      incredible: 'You ration food and truth both — and then, friends, you spend your private reserve of the second: you gather them and name the danger ITSELF, out loud, before it ripens — “There will come a night when the cattle look like an answer. It will be the hunger talking in your voice. I am telling you NOW, while we are still men who can hear it, so that on that night you will recognize the speaker.” And on the bad night, weeks in, when the whisper finally comes — half the fire says, in one voice, LIKE HE SAID, and the whisper dies of being expected. You cannot starve prophecy, friends. It is the one ration that grows by being shared.',
    },
    right: {
      label: 'Take the boat beyond the surf', approach: 'might',
      bad: 'You take the ship’s boat out past the surf-line after deeper fish, day on day — and the sea, which had merely been withholding, now takes an interest, friends: a squall out of the pinned wind’s one open quarter, the boat swamped in sight of shore, two oars and a net lost and the fishermen swum home breathless. The catch that day is nothing, minus a boat’s gear. Hunger, dining ashore, sends its compliments.',
      good: 'Beyond the surf, where the wise fish think no hungry crew will row: you take the boat out in the grey dawns yourself, first oar, and drag home enough — never plenty, friends, but ENOUGH, the great word of sieges — and the sight of the captain wet to the waist hauling nets does for morale what no speech could. The cattle-whisper stays a whisper. Men do not eat the gods’ herd while their king is out-rowing the surf for them at dawn. Shame, friends, is a nourishment too.',
      incredible: 'You go beyond the surf — and beyond the beyond, friends: two days out, at the drop where the seabed falls to blue-black, to the grounds no island boat dares alone, and you come back on the third dusk low in the water with a catch that beggars the month — great silver amber-jacks layered like shields in the bilge. But the CATCH is not the victory. The victory is what the men see when the boat rounds the point: that their captain, offered a month of pinned helplessness, went and PICKED A FIGHT WITH THE HORIZON instead. The cattle graze on, unregarded. Nobody whispers anything at that night’s fire, friends. Their mouths are full.',
    },
  }),
  sea('ody_a3_taunts', 3, {
    tags: ['blood'],
    prompt: 'Antinoos, prince of the suitors, finds the new beggar tiresome and lets the hall know it — with wit first, then wine dregs, then the footstool, thrown flat and hard across the fire at an old man’s ribs.',
    recap: 'The footstool across the fire.',
    left: {
      label: 'Take it like a beggar', approach: 'guile',
      bad: 'You take the stool like a beggar — but a heartbeat late, friends, because the KING in you stood up first, one half-second of squared shoulders and level eyes before the cringe came down over it like a sail. The hall misses it. Penelope’s old nurse, crossing with a wine-jug, does not. Her step does not falter. Her step becoming that careful is itself the tell. Two secrets now share one kitchen.',
      good: 'You take it whole: the flinch, the whimper, the scrabble sideways, the blessing mumbled at your abuser — flawless, friends, and the hall roars, and Antinoos preens, having valiantly bested furniture and age. And the room’s DECENT hearts — there are a few, even at that table — go quiet and uncomfortable, and mark him. He is spending, on a beggar, the sympathy he will need on the day of the axes. Take the bruise, friends. It is buying at wholesale.',
      incredible: 'You take it — and you TURN it, friends, with the beggar’s one weapon: the blessing. Loud, from the floor, ribs singing: “May the gods give Antinoos his heart’s desire, for he has given a poor man his.” The hall laughs AT HIM, one degree, for the first time — deniable, unpunishable — and Antinoos cannot find the insult’s handle. His heart’s desire, friends. The hall will remember the blessing on the day it is granted: an arrow, through the throat, at his wine. The poem’s coldest and most patient joke, and it was told from the FLOOR.',
    },
    right: {
      label: 'Warn him, once, quietly', approach: 'might',
      bad: 'You warn him — quiet, level, one beat too much iron in it: “Throw nothing else, boy.” And the word BOY, friends, from a beggar, lands in the hall like a dropped shield. Silence, then the pack-laughter that covers pack-unease, and Antinoos, humiliated by his own hesitation, must now escalate to mend it. You have made the last days harder and the hall warier, and Eurymachos — always Eurymachos — is looking at your forearms. Iron, friends, does not disguise. It can only wait.',
      good: 'One warning, pitched for him alone as the hall’s noise crests: “The gods dress as strangers, prince. It is an old story. Men check, in the old story.” Deniable, proverbial, beggar’s patter — but his eyes flick to yours for one raw instant, and something in him, friends, some last unspent coin of his mother’s teaching, actually HEARS it. He throws nothing more that night. He will die anyway, at his wine, on the day. But the tale records the warning. Even a doomed man, friends, is owed his one door. He was shown it. He dined on.',
      incredible: 'You warn him with a STORY, friends — the beggar’s license: a tale of a rich young man in Crete who mocked a stranger, and how the stranger was a god walking, and what the fishermen found after. Even the suitors go quiet in the good parts. Antinoos laughs loudest at the end, because he must — and over his cup, for one instant, his eyes find the beggar by the door and are not laughing. He knows. Some floor of him knows. He sits at that table to the end anyway — the warning heard, and outvoted, by the wine and the pride and the room. You gave him the story of his own death and let him choose. The choosing is the point of the whole poem.',
    },
  }),

  // ── new in slice 5: the last mile — Ithaca before the hall ──
  sea('ody_a3_ferryman', 3, {
    prompt: 'A ferryman works the channel between the islands, alone, too old for it, and he will carry anything anywhere for a coin — a fish, a rumor, a word to whoever the stranger cares to name.',
    recap: 'The ferryman who carries words.',
    left: {
      label: 'Send one coded word', approach: 'guile', risky: true,
      bad: 'You pay for one sentence — nothing in it but half of an old joke, the half that means nothing without its answer — and watch him row it away. But a channel-man’s trade is telling, friends, not keeping: by the third harbor the sentence has grown a description of the stranger who sent it, and by the fourth it is being repeated at a table where men pay for news of strangers. The joke means nothing to them. The ASKING is what they buy. You have told the island someone is coming, and now you must be nobody twice as hard.',
      good: 'One sentence, paid for twice — once for the carrying, once for the forgetting — half of an old joke, the half that is nonsense without its answer. To anyone on the island it is a beggar’s rambling. To one woman in one hall it is a handwriting. The ferryman delivers it to the kitchen door as instructed, word for word, and the tale says the queen stood very still for the length of a breath, and then went on giving orders — a woman who has just heard a dead man clear his throat, friends, and knows better than to turn around.',
      incredible: 'One sentence — and you row the middle watch of the crossing yourself, friends, because the old man’s shoulders are done and yours are not, and somewhere in that hour he stops charging you. The word goes where it should. The description of the sender never follows it; ask him and he will swear he ferried nobody that week. Twenty years of kings and suitors have bid for that man’s memory. It went, in the end, for one turn at the oars. He waves you off at the far shore without a word, friends — and charges the next man double.',
    },
    right: {
      label: 'Buy news, send nothing', approach: 'lore',
      bad: 'You buy his news and send nothing — prudent — but you buy it, friends, a shade too hungrily: the count of the suitors checked twice, the queen’s name said with the wrong care, and the old man’s eyes come up from the coin and take one long sounding of you. He says nothing. Channel-men say nothing for a living. But when he rows away you both know he is carrying, unpaid, the one word you did not send — that a stranger on the south shore asks about the hall like a man measuring it.',
      good: 'Send nothing; ask the way a beggar asks, half-listening, catching news the way a bowl catches rain — and the ferryman, glad of an ear, empties the whole channel into it: which suitors row home to Same at feast-days, whose servants sell to the hall, where the swineherd still keeps faith. You come away with a chart of the island’s loyalties, friends, and the chart cost nothing and marks no one — the whole island talked, and nobody on it remembers being asked.',
      incredible: 'You send nothing, and you ask about everything BUT the hall, friends — the fishing, the goat-tracks, the weather of twenty winters — until the old man, unprompted, gets to the hall himself, because a channel-man cannot keep a wound to himself and the island IS the wound. What he gives you no spy could buy: not the suitors’ count but their HABITS, the hour the wine wins, the servants who cry at night, the one gate nobody watches. And he never learns your face was listening. He thinks it was the sea he told.',
    },
  }),
  sea('ody_a3_goat_hills', 3, {
    tags: ['omen'],
    prompt: 'The first of Ithaca you meet is the goat hills above the south bay — your hills — and coming down every track, driven hard, herds with your mark still on them, bound for the suitors’ table.',
    recap: 'The herds coming down the hills.',
    left: {
      label: 'Walk down as a buyer', approach: 'guile',
      bad: 'You fall in with the drovers as a buyer, feeling the beasts, asking prices — and a real drover, friends, can smell a false buyer the way a shepherd smells weather: your hands know goats too well and your questions know the hills better. Nothing is said. But the youngest of them keeps looking back at the ragged man who cited pasture by name, and that look will reach a kitchen, and kitchens reach halls. You got your count. You paid a rumor for it.',
      good: 'A buyer’s walk down with the herds — feeling flanks, tutting at prices, appraising — and the drovers, bored, talk the way workmen talk over stock: how many the hall eats in a week, which flocks are already gone, who pays and who just takes. By the bay you have the whole arithmetic of the plunder, friends, itemized, in the sellers’ own voices. A man learns what his house is worth by watching it sold. It is dear knowledge in both senses. You bank it and keep walking.',
      incredible: 'You walk down as a buyer — and you BUY, friends: one she-goat, old, lame, your own mark on her hip, for three coins you can barely spare. The drovers laugh at the beggar and his bad eye for stock. But she is the first piece of Ithaca to come back — bought at the thieves’ own market, led on a rope of plaited grass — and when you give her that evening to a crofter’s widow who once fed strangers, the island’s oldest law starts breathing again on that hillside: what is taken can be TAKEN BACK. The flock, the herds, the hall. In that order, friends, and starting small.',
    },
    right: {
      label: 'Climb by the old paths', approach: 'might',
      bad: 'You leave the tracks to the drovers and go up the old way, the boyhood way — and twenty years, friends, have edited the mountain: a slide where the shortcut was, thorn where the spring was, and one drop you knew by heart now a stranger with your handhold missing. You come down the far side bleeding and slower than the road would have been, taught the day’s flat lesson — unrecognized goes all the way down here, friends; even the stones have forgotten your weight. At the bottom you bind your shin with a strip of the cloak and thank the mountain out loud, the way a beggar thanks a bad door.',
      good: 'Up and over by the paths no drover uses, the ones your feet laid down before Troy was a word — and the feet, friends, still know: the mountain unrolls under you like a thing rehearsed, spring to saddle to the split rock with the sea suddenly in it, and you cross your island unseen by every road that would have named you. Kings walk their borders, friends, even in rags — and at the top this one stands his one breath in the wind, just one, then bends his back into the beggar again and goes down the far side.',
      incredible: 'The old paths — and on the highest of them, friends, at the split rock, you find the small cairn you built at nine years old and mended at twelve, still standing, wind-bitten, TENDED — someone has kept it, stone by stone, twenty years. You never learn who. A goatherd; the boy of a goatherd; some keeper of small faiths. You add one stone, the custom of the hill, and go down the far side lighter than any beggar has a right to walk. The island did not forget you everywhere, friends. Somewhere it kept a small stone government going in your name.',
    },
  }),
  sea('ody_a3_scout_ship', 3, {
    tags: ['blood', 'deep'],
    prompt: 'A black ship rides at anchor in the strait between Ithaca and Same — no cargo, no trade, oars kept wet. The suitors’ ambush, friends, set for a boy sailing home from Pylos with his father’s name for a shield.',
    recap: 'The black ship in the strait.',
    left: {
      label: 'Slip aboard at anchor', approach: 'might', risky: true,
      bad: 'You go in over the anchor-cable in the dark hours, knife between your teeth like a younger man’s story — and the younger man, friends, would have heard the watch changing early. You leave with a slashed forearm, a dive through black water, and the whole ambush awake behind you, lamps swinging, voices carrying to both shores. The boy’s ship is warned by the commotion, which is something. So is the ambush, friends — warned that somebody on this water is already hunting THEM. You spent surprise, the coin that does not come back.',
      good: 'Over the cable at the watch’s low hour, bare feet on wet wood — and you do quiet, thorough, unglamorous harm, friends: the spare steering-oar over the side, the halyard cut where the splice hides the cut, the water-casks started so they weep themselves empty by morning. No alarm. You are swimming home before the first man wakes to a ship that cannot chase, cannot steer far, cannot stay. The ambush limps to Same for repairs, cursing their luck. Their luck, friends. We at this fire may smile.',
      incredible: 'Aboard, silent, and you find the watchman asleep at his post — a Same man, young, someone’s second son rented out for a bad night’s work — and the knife, friends, the knife has its argument ready. You leave him breathing. You leave him, instead, with every weapon on that deck gone over the side and the anchor-cable cut to a last thread, so the morning tide walks the whole ambush gently onto the Same rocks, laughed at from two shores. Nobody dies — there are nights, friends, when mercy and craft row the same stroke — and at dawn the boy sails past unhunted while you watch from the rocks, wet through, counting his oars like heartbeats.',
    },
    right: {
      label: 'Light the false beacon', approach: 'lore', risky: true,
      bad: 'The old wreckers’ beacon on the point, lit the old way — but the pilots of Same, friends, have grown up since your day, and one of them aboard the black ship reads the flame for exactly what it is: a light where no honest light should be, meaning somebody ashore wants them moved. The ambush shifts anchorage, warier, closer in to the channel the boy must actually use. You tried to move the trap and TIGHTENED it, and now the point is watched as well. Knowledge cuts both ways, friends, and tonight it cut the wrong man.',
      good: 'There is a beacon on the south point that fishermen light when the strait runs foul — and you light it, friends, at the exact hour a returning pilot would trust it, and the black ship does what any hull does when the shore says DANGER: she weighs, stands off, feels her way south around the long shoal. The channel she leaves empty is the channel a boy’s ship threads at dawn, sail up, singing distance, never knowing. At first light you put the beacon out, friends, stone by stone, the way a man banks a fire when the child is finally home asleep.',
      incredible: 'You light the beacon — and then a second fire, friends, inland, behind the first: the paired flame that in the old strait-code means FLEET, warships, get out. Some codes outlive their wars. Aboard the black ship an old oarsman goes white and says the one word PIRATES, and no captain of that rented crew has the nerve to test it. They run for Same harbor and stay there three days telling each other larger and larger fleets. The boy comes home through an empty strait. The suitors get, for their silver, a ghost story. And the two fires burn down politely, side by side, like a job well done.',
    },
  }),
  sea('ody_a3_hearth_smoke', 3, {
    tags: ['deep', 'omen'],
    prompt: 'From the ridge you can see it at last: one thread of smoke standing off the island’s heart, from a hearth you laid the stones of. Twenty years of ocean, friends, and what is left of the distance is a walk.',
    recap: 'The smoke of his own hearth.',
    left: {
      label: 'Stand and take the whole of it', approach: 'lore',
      bad: 'You stand and let it in — and it is TOO MUCH in, friends: the smoke, the roof-line, the terraces your father walked, all of it arriving at once like water through a stove hull, and a shepherd on the ridge finds a beggar on his knees, staring at the middle of the island, weeping without sound. He is kind about it. He tells the tale that evening, though — the mad beggar who cries at smoke — and a hall full of suitors laughs, and one of them, the sharp one, does not. You have been NOTICED being moved, friends, which is the one thing a disguise cannot afford.',
      good: 'You stand and take it, friends, all of it, on purpose — the rite no one wrote down: a man looking at his own smoke until his breath comes level again. The names walk past on the inside — father, wife, the boy who is not a boy now — and you let each one stop, and be looked at, and go. It takes the time it takes. Then you pick up the stick and start down, and the man who starts down is DONE weeping, friends, done for good, because he did it all here, on the ridge, where weeping was still free.',
      incredible: 'You take the whole of it standing — and then, friends, you do the thing the tale is quietest and surest about: you kneel, and put your hand flat on the ground, on Ithaca, and say nothing at all. No vow. No god named. Twenty years of speeches in that mouth, friends — the man who talked his way past monsters and queens — and at the edge of his own island he has the sense to know that some doors only open for silence. When he stands up, the smoke has not moved. But every telling agrees: the WALK changes here. Something that was pushing him begins, from this ridge on, to carry him.',
    },
    right: {
      label: 'Make it fuel and move', approach: 'might',
      bad: 'You turn the ache into pace and take the downhill hard — too hard, friends, for a man playing seventy: a real beggar descends a mountain like a question, and you came down it like an answer, and the goat-boys watched a bent old man overtake their uncle on the scree. Small eyes, small tale, but tales travel downhill too. You arrive in the lowland with a turned ankle and a description already ahead of you: the beggar who walks like a soldier. You will limp honestly for a week, friends. Call it costume repair.',
      good: 'You give the smoke one count of ten, and then it goes in the furnace, friends, where the strong ones keep their grief: eyes down, stick working, the whole ridge descended at the beggar’s shuffle while inside you the fire has a new draught to it. By dusk you are down among the crofts with your cover whole, and when a crofter’s wife asks the beggar what drives him so, you tell her — truthfully, friends, TRUTHFULLY — that you smelled a fire you knew.',
      incredible: 'Fuel — and it burns clean, friends, that is the wonder of it: no rage in the stride, no weeping held off, just a man walking downhill into his own life with his jaw set like a keel. Shepherds remember him passing — remember, they say afterward, being oddly glad to see him go by, the way you are glad of weather that has made up its mind. He begs correctly at the first door. He sleeps in the first byre like a stone. And the smoke he walked toward all day stands over the island all night, friends, straight as a mast, as if the hearth itself were waiting up.',
    },
  }),
  sea('ody_a3_beggars_bowl', 3, {
    tags: ['blood'],
    prompt: 'Apollo’s feast, and the island keeps it the old way — the way you set, friends, in a hall you built — and this year a beggar works the crowd at his own festival with a bowl someone else carved.',
    recap: 'A bowl at his own feast.',
    left: {
      label: 'Work the feast properly', approach: 'guile',
      bad: 'You beg the feast the way the part demands — and the part, friends, weighs more at your own festival than on any road: a man you armed for Troy drops a coin in the bowl without looking at the face above it; a woman gives you bread with your mother’s weaving-pattern in her shawl. The bowl fills. Something else empties. And once, only once, your thanks come out in the hall-voice instead of the road-voice — one syllable, friends — and an old cupbearer turns around very slowly, and looks, and lets it go. You hope.',
      good: 'You work it properly, friends: the shuffle, the bowl, the blessing at each giving hand — and your own festival feeds you, door by door, and every door is a report: who gives without looking, who gives to be seen, who has nothing and gives anyway, who has everything and sets the dogs loose. By dark the bowl holds bread, three coins, and a fig — and your head holds the island’s whole heart, weighed house by house. You eat the fig on the sea-wall, friends, slowly, like a man reading.',
      incredible: 'You work the feast — and at the god’s own hour, when the song comes round and the crowd must answer it, the beggar answers LOW, friends, under the crowd’s voice, in the second part that only the feast’s founder was taught… and beside you an old, old priest stops singing. He does not look at you. He is of the generation that knows what not to look at. When the verse ends he puts his own portion in your bowl, whole, and says to the air, “The god sees his guests.” Then he walks on, friends, and tells nobody — the first ally of the homecoming recruited by a SONG, and neither man said a name.',
    },
    right: {
      label: 'Give the bowl away', approach: 'lore',
      bad: 'A beggar who gives, friends, breaks the part: you hand your crust to the widow’s boy because your body decides it before your craft can vote — and the feast NOTICES, the way crowds notice a wrong note: beggars do not give. A suitor’s man laughs and asks the fine fat beggar what else he has hidden; hands find your sleeve in the crush; the bowl is turned out on the stones for sport. You get away with bruises and a scattered supper. Kindness, friends, is a signature, and today you signed where the wrong men could read it.',
      good: 'The widow’s boy at the feast’s edge is hungrier than you — that is simply arithmetic, friends — and the bowl goes over to him whole, quietly, no lesson attached. But feasts have eyes at the edges too: the ones who keep the god’s day properly saw a starving man feed a child, and beggar or no, the old law stands up in them like a raised lamp. You do not queue again all day; the food comes TO you now, hand by hand, and an old woman who watched it happen grips your wrist and says the feast has not seen its like since the king kept it. You thank her, friends, in the road-voice, carefully.',
      incredible: 'The bowl goes to the widow’s boy — and the boy, friends, the BOY: he breaks the crust and gives half BACK, because his mother raised him to the old law even in a hungry year. The feast-crowd goes quiet around it the way a room quiets for an omen. And it is one: an island where the poorest child still splits his bread has not been conquered, friends, not in the part that decides things — the suitors hold the hall, and the hall is not the island. You eat your half slowly. You are counting, of all the things a beggar owns, ALLIES — and the number just moved.',
    },
  }),
  sea('ody_a3_maid_lamp', 3, {
    prompt: 'In the passage behind the hall a serving-woman lifts her lamp to the beggar’s face and holds it there one breath too long — she was a child of this house once, friends, and children of this house rode on your shoulders.',
    recap: 'The lamp held one breath too long.',
    left: {
      label: 'Be nobody, gently', approach: 'guile',
      bad: 'You give the lamp nothing, friends — the beggar’s slack face, the eyes gone pleasantly stupid — and it works on her the way it works on everyone, which is the trouble: she was READY to know you, some tide in her already turning, and the nothing you gave her put it out like a thumb on a wick. She serves the suitors’ wine all evening with her jaw set. One ally, unlit, walks away down the passage — and the beggar who unlit her, friends, gets to stand in the dark he asked for and call it craft.',
      good: 'You give her the beggar, gently: face slack, a mild blessing for the light, nothing under the eyes for the lamp to catch. The breath passes. She goes on down the passage, and you hear her pause once at the turn — memory knocking a second time, friends, and getting no answer — and then her steps go on into the house-noise, and the night closes over it. Correct, friends. Entirely correct. You stand a moment in the dark being entirely correct, and then you go the other way.',
      incredible: 'You give her nobody — but a WARM nobody, friends, the craftsman’s grade: the blessing an old man gives a girl of good family, with just enough of the house’s OWN courtesy in it that her memory lies back down soothed instead of hungry. She smiles at the beggar the way you smile at a door that hangs true, and moves on, and will sleep untroubled. Nothing given away; nothing put out, either — the tide in her left ready to turn on the DAY, friends, when knowing him will be safe, and loud, and hers by right. You walk on, having banked one more coal for the morning the house catches light.',
    },
    right: {
      label: 'A word only the child would know', approach: 'lore', risky: true,
      bad: 'You risk it — the pet-name the house had for her, the one from before your ships — and her lamp-hand, friends, does not tremble: it goes STILL, which is worse, still as held breath, and her eyes go over your shoulder down the passage FIRST, checking for listeners, before they come back to you with tears and terror in them in equal parts. She knows. She is loyal. She is also young, and now carries a secret that could burn her, friends, and you watch her walk away learning to hold it, step by step, and every step is your doing.',
      good: 'The pet-name, friends, half-voiced, deniable — and the lamp shakes once and steadies, and what looks out of her face for a heartbeat is the child on the shoulders, twenty years on, doing the sum. She does not say the name back. She says, “The kitchen keeps a bench for old men, grandfather,” too loudly, for the passage to hear — and from that hour the beggar is fed first and questioned never, and one pair of sharp young eyes minds his back through every room she serves. You did not recruit her, friends. You woke her. She recruited herself.',
      incredible: 'The pet-name — and she sets the lamp DOWN, friends, on the passage shelf, so that her hands are free and her shadow covers you both from the hall door, and she asks one question, a whisper with twenty years of weight trimmed off it clean: “Does the mistress know?” Not tears; LOGISTICS. The child of the house has grown into exactly the ally the house was going to need, and by lamp-out she has given you the servants’ map entire: who holds, who sold, which doors talk. On the day of the axes, three of the loyal will live because of what a girl with a lamp decided in one breath, friends. The tale keeps her name lit. So do I.',
    },
  }),

  // ── The temptation of Act III: Calypso (the strong one) ──
  // The canonical cash-out (GUIDING_EXAMPLES §7): a real ending, offered
  // warmly. Situationally optimal by design — a wrecked run is sometimes
  // genuinely better banked here.
  {
    id: 'ody_tempt_calypso',
    act: 3,
    tags: ['temptation', 'beat:calypso'],
    requires: { anyOf: [{ burnoutMin: 62 }, { max: { expedition: 4 } }] },
    context: 'Ogygia — the island that asks nothing',
    prompt: 'Seven veils of the world from Ithaca there is an island where nothing has ever gone wrong, and a goddess who asks nothing except that you stop rowing. She would make you deathless, and she means it. Here the telling can end. It has ended here before, at other fires.',
    recap: 'The island made the strong offer.',
    forceTier: { right: 'good' },
    choices: {
      left: {
        label: 'Row on',
        tags: ['temptation', 'might'],
        governingStats: { might: 1 },
        outcomes: {
          bad: { text: 'You refuse deathlessness with a raft, friends — say it aloud and hear what a sentence it is — and the sea, informed of the refusal, prices the crossing accordingly. You leave the island that asks nothing for the water that asks everything, and it collects the first installment before the shore is out of sight.', effects: { might: 3, burnout: 4, athena: 1 } },
          good: { text: 'So he lashes the raft himself, plank by plank, because no crew is left to lash it for him — and the goddess, who could hold him with a word, instead brings rope. She watches him out of sight from the shore, they say. The sea takes note of a man the immortals let go, and makes its own arrangements. Throw on a branch, friends. We row.', effects: { might: 4, athena: 1 } },
          incredible: { text: '“Her I could not fault,” he says at the raft — the line every telling keeps — “only I have a rock in the sea where the smoke goes up, and a woman on it who tests strangers exactly the way I would.” And the goddess laughs, once, the way weather breaks, and gives him the wind out of her own jar. Deathlessness lost fair, friends, to a carpenter’s bed and a clever wife. It is the only time on record.', effects: { might: 5, athena: 2, renown: 1 } },
        },
      },
      right: {
        label: 'Bank the telling here',
        tags: ['temptation', 'guile'],
        governingStats: { guile: 1 },
        outcomes: {
          bad: { text: 'Then we leave him there — old friends, warm, unwritten.', effects: { addFlag: 'ody_stayed_calypso' } },
          good: { text: 'Then we leave him there — old friends, warm, unwritten.', effects: { addFlag: 'ody_stayed_calypso' } },
          incredible: { text: 'Then we leave him there — old friends, warm, unwritten.', effects: { addFlag: 'ody_stayed_calypso' } },
        },
      },
    },
  },
];
