// THE FIRST TELLING — the odyssey's scripted onboarding (3 cards, ~90
// seconds). One mechanic per card, taught in fiction: the bard seats a new
// listener at the fire and puts the captain's oar in their hands. Same engine
// grammar as the villa's First Morning: tutorial+chainOnly cards, forceTier
// scripts the lesson, `coach` is the UI's coach-mark text.
//
// The teaching stats are fixed in Pack.tutorialStart (might 32, guile 26,
// lore 30, burnout 6) so the three approaches all read as live options and
// the third card's real roll lands good more often than not.
//
// Voice law: the CARDS are the telling (grave abundance, the turn in the
// last clause); the COACH marks are the shell speaking (plain instruction,
// no costume). docs/games/odyssey/VOICE.md governs the former only.

import type { GameEvent } from '../../types.js';

export const ODYSSEY_TUTORIAL_EVENTS: GameEvent[] = [
  {
    id: 'ody_tut_troy', act: 1, pathAffinity: [], weight: 0, chainOnly: true, tutorial: true,
    context: 'THE FIRST TELLING · THE BARD FINDS YOUR FACE',
    prompt: 'Sit, friend — the seat nearest the fire, the one that rows. Tonight you pull the captain’s oar: twelve ships loaded at Troy, ash behind, ten years of water ahead. The men look at the sky, and then at you. Every telling begins with a choice, and this one is yours now.',
    recap: 'The fleet stood loaded at Troy.',
    tags: ['omen'],
    coach: '👆 Drag the card left or right — or tap a button below. That’s the whole oar. The telling does the rest.',
    forceTier: { left: 'good', right: 'good' },
    choices: {
      left: {
        label: 'Out on the morning tide',
        governingStats: { might: 1 },
        tags: ['might'],
        outcomes: {
          bad: { text: '—', effects: { chainEventId: 'ody_tut_tell' } },
          good: { text: 'The captain’s voice goes down the beach once, and twelve crews move like one animal. Past the mole the oars find a shared stride, and the last smoke of Troy slides under the horizon astern. Whatever the sea intends, friends, it will have to catch a fleet already rowing.', effects: { might: 2, chainEventId: 'ody_tut_tell' } },
          incredible: { text: '—', effects: { chainEventId: 'ody_tut_tell' } },
        },
      },
      right: {
        label: 'Pour to the gods first',
        governingStats: { lore: 1 },
        tags: ['lore'],
        outcomes: {
          bad: { text: '—', effects: { chainEventId: 'ody_tut_tell' } },
          good: { text: 'The wine goes into the sand and the words are said whole, the men bare-headed and fidgeting — five minutes, one cupful, and the fleet leaves Troy the way a guest leaves a house: thanked, and watched kindly out of sight. A wind from the south fills in before noon. Some bookkeeping, friends, the sky reads.', effects: { lore: 2, athena: 1, chainEventId: 'ody_tut_tell' } },
          incredible: { text: '—', effects: { chainEventId: 'ody_tut_tell' } },
        },
      },
    },
  },
  {
    id: 'ody_tut_tell', act: 1, pathAffinity: [], weight: 0, chainOnly: true, tutorial: true,
    context: 'THE SECOND BEAT · TWO WATERS',
    prompt: 'A headland, and past it two waters: the inside passage, narrow and white where the rocks comb it, and the long pull around — three days of honest shoulder. Old Perimedes says nothing. He points once at the white water, once at your benches, and waits to see what kind of telling this is.',
    recap: 'Two waters at the headland.',
    tags: ['deep'],
    coach: 'The icons on a button are the stats it leans on — ⚔️ Might, 🪢 Guile, 📜 Lore. The coloured shape is the <b>risk tell</b>: ● safe · ▲ dicey · ■ likely bad · ✦ big upside. And the painted band up top is the voyage itself — <b>tap the band</b> any time for the plain numbers.',
    forceTier: { left: 'good', right: 'bad' },
    choices: {
      left: {
        label: 'The long pull around',
        governingStats: { lore: 1 },
        tags: ['lore'],
        outcomes: {
          bad: { text: '—', effects: { chainEventId: 'ody_tut_watch' } },
          good: { text: 'Three days of shoulder, spelled at the benches and sung through the worst of it, and the fleet rounds the point with dry keels and its full count of men. Slow, friends, is a speed. It is the one that always arrives.', effects: { lore: 2, burnout: -1, chainEventId: 'ody_tut_watch' } },
          incredible: { text: '—', effects: { chainEventId: 'ody_tut_watch' } },
        },
      },
      right: {
        label: 'Shoot the inside passage',
        governingStats: { might: 1 },
        tags: ['might'],
        outcomes: {
          bad: { text: 'The rocks comb the third ship the way a hand combs wool — one strake peeled back, no men lost, and the whole fleet suddenly very interested in seamanship. That ■ on the button warned you, friends: a bad card stings, it does not sink the telling. The carpenter is already reaching for his tools.', effects: { might: 1, burnout: 2, chainEventId: 'ody_tut_watch' } },
          good: { text: '—', effects: { might: 1, chainEventId: 'ody_tut_watch' } },
          incredible: { text: '—', effects: { might: 1, chainEventId: 'ody_tut_watch' } },
        },
      },
    },
  },
  {
    id: 'ody_tut_watch', act: 1, pathAffinity: [], weight: 0, chainOnly: true, tutorial: true,
    context: 'THE THIRD BEAT · NO SCRIPT NOW',
    prompt: 'Dusk, and a light shows on the water where no island is charted — low, red, patient. The men pretend not to see it, which is how sailors point. Perimedes looks a question at you: stand in and learn what burns out there, or run dark past it and let the night keep its own books?',
    recap: 'A light on the water at dusk.',
    tags: ['omen'],
    coach: '🌫️ No script this time — a real roll against your stats. Two ledgers to watch: <b>Despair</b> climbs on hard nights and ends the telling at the top — rest brings it down. And 🔱 <b>Poseidon</b> is the sea’s grudge: fill it to ten and the wave comes. The band knows both.',
    choices: {
      left: {
        label: 'Stand in and learn it',
        governingStats: { might: 1 },
        tags: ['might'],
        outcomes: {
          bad: { text: 'The light is a wreckers’ fire, and the reef it sits on is the hook — the lookout calls it with a boat-length to spare, and the fleet claws off with every man hauling and nobody breathing. You learned what burns out there, friends. It cost a night’s sleep in forty chests to learn it.', effects: { might: 1, burnout: 3 } },
          good: { text: 'You stand in slow, shields shipped but showing, and the light turns out to be a beached crew boiling pitch — wreck-menders, glad of company, generous with what they know. The chart gains a reef it did not have at sunset. The men gain an evening of someone else’s stories.', effects: { might: 3, renown: 1 } },
          incredible: { text: 'You come in with a torch answering their fire — light for light, the courtesy of strangers — and are ashore before full dark. Wreck-menders, and their pilot knows these waters the way a man knows his own scars. He draws you the next three landfalls in the sand, and the men memorize it by firelight like scripture.', effects: { might: 4, renown: 1, athena: 1 } },
        },
      },
      right: {
        label: 'Run dark past it',
        governingStats: { guile: 1 },
        tags: ['guile'],
        outcomes: {
          bad: { text: 'Dark ships on a dark sea, and the dark takes its fee: two hulls touch oars in the blind and the swearing carries a mile over the water, which is not what running dark is for. Whatever tended that light knows something passed. You know nothing at all. That trade will itch for days.', effects: { guile: 1, burnout: 3 } },
          good: { text: 'Lamps doused, oars muffled, voices swallowed — the fleet goes by like a rumour of a fleet, and the red light never wavers. Whatever it was, it is behind you, unmet and unpaid. Some answers, friends, you buy by not asking.', effects: { guile: 3, burnout: -1 } },
          incredible: { text: 'You run dark and READ the light as you go — its colour, its steadiness, the way it sits low to the water: a tended fire on a reef, a lure, and now a black mark on your chart that will save some other captain’s fleet a generation on. The men never learn how close the hook came. That is what a captain is for.', effects: { guile: 4, athena: 1 } },
        },
      },
    },
  },
];
