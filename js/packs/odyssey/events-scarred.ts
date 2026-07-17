// The Odyssey — the Scarred Telling remembers (pass 48). The comeback mode
// (modes.ts: nine hulls, the sea's grudge at two, the crew pre-hardened)
// changed the NUMBERS of a retold voyage but dealt the same seas as a first
// telling. These three deal only to a scarred fleet — the wreck the mode is
// ABOUT, met once per act: the fleet's own oars adrift, the sea recognizing
// a debtor, and the headland where it went wrong last time.
//
// Gated `requires: { flagsAll: ['comeback'] }` — the transform stamps the
// flag (modes.ts odysseyComeback), and the generic sim driver never applies
// a comeback, so like the memory cards these are INVISIBLE to sims and
// goldens by construction. The itinerary deals eligible scarred cards at 4x
// (the memory-card law): a scarred telling usually meets its scars.

import type { GameEvent } from '../../types.js';
import { sea } from './events.js';

export const SCARRED_EVENTS: GameEvent[] = [
  sea('ody_scar_wake', 1, {
    tags: ['blood'],
    requires: { flagsAll: ['comeback'] },
    prompt: 'Second morning out, the fleet crosses water it has crossed before: a drift of oars, bleached, riding the swell in a line — your own oars, from the telling that drowned. The new men do not know. The old men know exactly.',
    recap: 'They rowed past their own oars.',
    left: {
      label: 'Take one aboard — a keel remembers', approach: 'lore',
      bad: 'You ship the bleached oar and it rides amidships like a passenger nobody greets. The old hands will not touch it; the new hands cannot understand why; and between those two silences the fleet loses a day’s easy talk. Some cargo is heavier empty, friends.',
      good: 'One oar comes aboard, lashed under the rail plain as a ledger line: this happened; we row anyway. The old men each touch it once, passing — not grief, friends: procedure. The dead are crewed on at their own bench rate, and the stroke that afternoon is the steadiest of the young voyage.',
      incredible: 'One oar comes aboard — and at dusk you name it, friends: the man whose bench it pulled, said once, whole, over the rail, with the wine going down after it. The new men learn the custom in one silence. There is a bench in every scarred fleet that rows without a rower. Feed it names, and it pulls FOR you.',
    },
    right: {
      label: 'Row through the drift, eyes forward', approach: 'might',
      bad: 'Eyes forward — but an oar knocks the second hull’s strake, once, hollow, a knuckle on a door, and every man aboard hears which door. You lose nothing you can count, friends. The men row the rest of the day like something is following, and rowing scared is expensive rowing.',
      good: 'You call the stroke and hold it, and the fleet threads its own wreckage without a word — the hardest quiet order you have given, friends, and the crews answer it. Past the last oar the bosun spits the grief-salt over the side, and the new men learn this fleet has a past and does not stop for it.',
      incredible: 'Eyes forward — and you do the captain’s arithmetic OUT LOUD as the drift goes by: “Nine hulls. Nine that learned. The water that taught us is the water we row.” No rite, no wake — a course, friends, laid straight through the lesson. The old men pull easier for hearing it named. The scar is in the fleet’s grain now, and grained timber is the strong kind.',
    },
  }),
  sea('ody_scar_grudge', 2, {
    tags: ['omen'],
    requires: { flagsAll: ['comeback'] },
    prompt: 'Mid-channel the water goes glass-still around the fleet — only around the fleet — and holds. The old hands stop rowing without an order. The sea is looking at a hull it has met before, the way a merchant looks at a debtor come back into the shop.',
    recap: 'The sea recognized the fleet.',
    left: {
      label: 'Pour for the ledger, not for love', approach: 'lore',
      bad: 'You pour, and the words come out owed rather than offered — the sea can hear a debtor’s tone, friends, the same as any creditor. The glass calm keeps you a full watch, being LOOKED at, before the wind consents to return with its opinion of you unimproved.',
      good: 'You pour the honest pour: not sorry — paid. “What was taken, was taken. What is owed, is rowing.” The still water holds one breath more, then wrinkles: a creditor closing his book for the moment, friends. Not forgiving. Filing.',
      incredible: 'You pour — and then say the thing no drowned-fleet captain has the stomach to say over the rail: “Thank you for the lesson. It is aboard. Come see.” And the calm breaks, friends, all at once, into a following chop like a shop door slammed by a merchant who did not get the argument he came for. The old men grin at their oars. You cannot hold a debt against a sea that admits it was a teacher.',
    },
    right: {
      label: 'Row the glass — it is only water', approach: 'might', risky: true,
      bad: 'You row the stillness like a drill — and the sea lets you, friends, all afternoon, an insolence it writes down. The wind that finds the fleet at dusk has an edge that stays for days, and the old men watch you the way men watch a debtor jaywalk in front of the creditor’s shop.',
      good: 'You row it, plain strokes through the staring water — because the fleet is watching the captain more than the sea, friends, and the captain rows. The calm gives up its theater by mid-afternoon. Grudges need an audience. You declined the seat.',
      incredible: 'You row — and you set the stroke SLOW, friends, parade-slow, the beat of a fleet with nothing to prove and nowhere better to be, straight across the middle of the sea’s held breath. It is the most insolent seamanship of the ten years, and it lands the way true insolence lands: the water gives first. The old men will tell this one without you. The sea, they say at the fire, blinked.',
    },
  }),
  sea('ody_scar_lesson', 3, {
    tags: ['deep'],
    requires: { flagsAll: ['comeback'] },
    prompt: 'The last water again — and here is the headland where, last telling, it went wrong. The fleet’s old hands go quiet as the shape of it comes up over the bow. The sea keeps its classrooms exactly where it left them.',
    recap: 'The headland from last time.',
    left: {
      label: 'Run the passage that beat you', approach: 'might', risky: true,
      bad: 'You run the old line — to prove it, friends, which is the one reason the sea always accepts — and the headland does not bother to be original: the same set, the same cross-chop, the same cold arithmetic, and the fleet pays a smaller instalment of the same bill. The old bosun pays it the way he paid it last time — counting strokes out loud until the water lets go.',
      good: 'The old line — but two lengths wider, one glass earlier, the sail already reefed: the same door, entered like a man who has read the room’s one trick. The headland gives its worst on schedule, and its worst finds the fleet braced for exactly that. Passing your own wreck-water clean, friends, is a wine the shore never sells.',
      incredible: 'You run it — and as the cross-set hits you call the moves BEFORE the water makes them, loud, by name, like a man reading the sea its own ledger: “Now the shove. Now the back-chop. Now the lull that lies.” The new men think it is magic. The old men know it is scar tissue, out loud. The headland, out-sung at its own game, runs out of verses first.',
    },
    right: {
      label: 'Take the long way you paid for', approach: 'lore',
      bad: 'The long way is long, friends — that is its whole price — and out in the safe deep the fleet meets the other lesson: weather keeps more classrooms than coastline does. Nothing is lost but a day and the pleasant fiction that any road home is free. The headland watches you go around, unpaid.',
      good: 'You take the wide road, the one drawn on your hide last telling, and the fleet slides past the headland’s whole argument at the price of a long day’s rowing. The old men do not call it caution, friends. They call it the paid-for road, and men row a paid-for road with a certain ownership.',
      incredible: 'The long way — and halfway round it you gather the new men at the stern rail and TEACH the headland from a safe distance, friends: where the set runs, why the lull lies, what it cost to learn. A fleet that inherits its scars without re-earning them is the rarest ship afloat. Somewhere behind you a classroom stands empty, and the tuition, for once, stayed in the purse.',
    },
  }),
];
