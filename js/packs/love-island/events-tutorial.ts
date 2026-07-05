// THE FIRST MORNING — the villa's scripted onboarding (3 cards, ~90 seconds).
// One mechanic per card, taught in fiction (R2/B1: the gesture ramp; Stirling
// carries the format teaching in-season via his first-season tutor pool).
// Same engine grammar as music's First Gig: tutorial+chainOnly cards,
// forceTier scripts the lesson, `coach` is the UI's coach-mark text.
//
// The teaching stats are fixed in Pack.tutorialStart (rizz 38, loyalty 46,
// savvy 18, charisma 34, burnout 8) so the risk tells read exactly:
// loyalty ●, rizz ●, charisma ▲, savvy ■.

import type { GameEvent } from '../../types.js';

export const LI_TUTORIAL_EVENTS: GameEvent[] = [
  {
    id: 'li_tut_wakeup', act: 1, pathAffinity: [], weight: 0, chainOnly: true, tutorial: true,
    art: 'li_kitchen', context: 'YOUR FIRST MORNING · 7 A.M. · THE CAMERAS ARE ALREADY ON',
    prompt: 'Day one, minute one. Eleven strangers, one kitchen, forty-three cameras. Someone hands you a mug that says VILLA VIBES and waits to see what you do with it. Everything in here is a decision. Including this.',
    tags: ['chat'],
    coach: '👆 Drag the card left or right — or tap a button below. That’s the entire input. The villa does the rest.',
    forceTier: { left: 'good', right: 'good' },
    choices: {
      left: {
        label: 'Make the coffees',
        governingStats: { loyalty: 1 },
        tags: ['chat', 'loyal'],
        outcomes: {
          bad: { text: '—', effects: { chainEventId: 'li_tut_text' } },
          good: { text: '“Two sugars, angel,” says a girl whose name you’ll learn by lunch. Eleven coffees later you know four names, two allergies, and who already fancies who. Day-one intel, free.', effects: { loyalty: 2, graft: 1, chainEventId: 'li_tut_text' } },
          incredible: { text: '—', effects: { chainEventId: 'li_tut_text' } },
        },
      },
      right: {
        label: 'Do a lap of the garden',
        governingStats: { rizz: 1 },
        tags: ['flirt'],
        outcomes: {
          bad: { text: '—', effects: { chainEventId: 'li_tut_text' } },
          good: { text: 'You walk the lawn like you’ve lived here a week. Three heads turn; one belongs to the boy you clocked in the entrance line-up. Noted. By you, and by camera six.', effects: { rizz: 2, chainEventId: 'li_tut_text' } },
          incredible: { text: '—', effects: { chainEventId: 'li_tut_text' } },
        },
      },
    },
  },
  {
    id: 'li_tut_text', act: 1, pathAffinity: [], weight: 0, chainOnly: true, tutorial: true,
    art: 'li_phone', context: 'THE LAWN · A PHONE GOES OFF',
    prompt: '“TEXT! I’VE GOT A TEXT!!” The villa converges at a sprint, dripping pool water. “Islanders: tonight, the welcome party. One of you will give the toast. #speechspeech” Eleven faces turn. The phone is in your hand.',
    tags: ['text'],
    coach: 'The icons on each button are the stats a choice rolls on — bright is the main one. The coloured shape is the <b>risk tell</b>: ● safe · ▲ dicey · ■ likely bad · ✦ big upside. The full picture — stats, your Edit — lives under <b>☰</b> up top.',
    forceTier: { left: 'good', right: 'bad' },
    choices: {
      left: {
        label: 'Give the toast yourself',
        governingStats: { charisma: 1 },
        tags: ['camera', 'banter'],
        outcomes: {
          bad: { text: '—', effects: { charisma: 2, public: 2, chainEventId: 'li_tut_firstnight' } },
          good: { text: '“To bad decisions we haven’t met yet.” Short, silly, quotable. The villa drinks to it; the edit keeps it. That ▲ said it could go either way — tonight it went yours.', effects: { charisma: 2, public: 2, chainEventId: 'li_tut_firstnight' } },
          incredible: { text: '—', effects: { charisma: 2, public: 2, chainEventId: 'li_tut_firstnight' } },
        },
      },
      right: {
        label: 'Volunteer the loudest boy',
        governingStats: { savvy: 1 },
        tags: ['strategy'],
        outcomes: {
          bad: { text: 'You volunteer Tyler. Tyler gives a nine-minute toast with three separate references to his gym. The villa knows exactly whose idea this was. That ■ warned you — but look: a bad card stings, it doesn’t end you.', effects: { savvy: 2, burnout: 2, chainEventId: 'li_tut_firstnight' } },
          good: { text: '—', effects: { savvy: 2, chainEventId: 'li_tut_firstnight' } },
          incredible: { text: '—', effects: { savvy: 2, chainEventId: 'li_tut_firstnight' } },
        },
      },
    },
  },
  {
    id: 'li_tut_firstnight', act: 1, pathAffinity: [], weight: 0, chainOnly: true, tutorial: true,
    art: 'li_firepit', context: 'THE FIREPIT · FIRST NIGHT · SOMEONE’S ALREADY CRYING',
    prompt: 'Midnight. A girl you met nine hours ago is crying about a boy she met eight hours ago, and the group has gone quiet in that specific way. You’re new here. So is everyone. What kind of Islander are you, then?',
    tags: ['chat'],
    coach: 'No script this time — a real roll against your stats. One more thing: <b>In Your Head</b> (🌀) climbs on drama and ends your Season at the top. When it runs hot, you’ll see it glowing up top — rest brings it down.',
    choices: {
      left: {
        label: 'Sit with her',
        governingStats: { loyalty: 1 },
        tags: ['chat', 'loyal'],
        outcomes: {
          bad: { text: '“I’m FINE,” she says — to you, the person she summoned. You hold the tissue anyway. It counts. Somewhere in the gallery, a producer sighs at the lack of fireworks.', effects: { loyalty: 2, burnout: 2 } },
          good: { text: '“You’re the only normal one here,” she sniffs, which after nine hours is both a compliment and a warning. You’ve made your first friend. Friends are load-bearing in here.', effects: { loyalty: 3, public: 2 } },
          incredible: { text: 'You say the exact right thing, once, quietly — and she laughs mid-sob, ugly and real. The whole firepit exhales. The edit has found its first keeper.', effects: { loyalty: 4, public: 3, graft: 2 } },
        },
      },
      right: {
        label: 'Lighten the mood',
        governingStats: { charisma: 1 },
        tags: ['banter', 'camera'],
        outcomes: {
          bad: { text: 'Your joke lands mid-sob. It wasn’t about her. It is now, apparently, about her. You spend twenty minutes explaining comedy to a circle of damp faces. 🌀 That’s the head-noise starting.', effects: { charisma: 2, burnout: 4 } },
          good: { text: 'You commit to the bit — a full dramatic reading of the welcome text, hashtag included. The crying stops. The laughing starts. Every first night needs a clown; congratulations.', effects: { charisma: 3, followers: 2 } },
          incredible: { text: 'By the end of your bit even the crying girl is doing the harmony on “#speechspeech.” The night turns. The show has found a main character. Check the mirror.', effects: { charisma: 4, followers: 3, public: 2 } },
        },
      },
    },
  },
];
