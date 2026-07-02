// THE FIRST GIG — a scripted onboarding run (9 cards, ~3 minutes).
// One mechanic per card, taught in fiction, practiced before the next.
// Engine-specific fields beyond the normal event schema:
//   tutorial: true            never enters normal decks (also chainOnly)
//   forceTier: {left, right}  scripts the outcome so the lesson lands
//                             deterministically ('encoreUp' = incredible
//                             if the Encore was armed, good otherwise)
//   coach: '...'              coach-mark text the UI shows with the card
//
// The teaching stats are fixed in newTutorialRun (skill 40, cred 30,
// creativity 8, network 35, burnout 5) so the risk tells read exactly:
// skill ●, network ●, cred ▲, creativity ■.

export const TUTORIAL_EVENTS = [
  {
    id: 'tut_load_in', act: 1, pathAffinity: [], weight: 0, chainOnly: true, tutorial: true,
    art: 'ev_tut_loadin', context: 'YOUR FIRST GIG — THE RUBBER ROOM, 6:45 PM',
    prompt: 'Open-mic night. Dee, the host, waves you toward load-in without looking up from a clipboard that says NO REFUNDS on the back. First decision of your career: how does the gear get inside?',
    tags: ['live'],
    coach: '👆 Drag the card left or right — or tap a button below. That’s the entire input. Judgment is the rest of the game.',
    forceTier: { left: 'good', right: 'good' },
    choices: {
      left: {
        label: 'One heroic trip',
        governingStats: { skill: 1 },
        tags: ['live'],
        outcomes: {
          bad: { text: '—', effects: { chainEventId: 'tut_soundcheck' } },
          good: { text: 'Fourteen items, two arms, zero drops. A stranger holds the door and says “big night?” and you say “biggest,” and mean it.', effects: { skill: 1, chainEventId: 'tut_soundcheck' } },
          incredible: { text: '—', effects: { chainEventId: 'tut_soundcheck' } },
        },
      },
      right: {
        label: 'Two sensible trips',
        governingStats: { network: 1 },
        tags: ['safe'],
        outcomes: {
          bad: { text: '—', effects: { chainEventId: 'tut_soundcheck' } },
          good: { text: 'Two trips, zero casualties. Dee nods at you on the second pass — Dee approves of people who make two trips. This will matter later. Everything with Dee matters later.', effects: { network: 1, chainEventId: 'tut_soundcheck' } },
          incredible: { text: '—', effects: { chainEventId: 'tut_soundcheck' } },
        },
      },
    },
  },
  {
    id: 'tut_soundcheck', act: 1, pathAffinity: [], weight: 0, chainOnly: true, tutorial: true,
    art: 'ev_tut_sound', context: 'SOUNDCHECK, SUCH AS IT IS',
    prompt: 'The house melodica is “tuned,” says Dee, in air quotes you can hear. You get ninety seconds of soundcheck and exactly one favor to spend on it.',
    tags: ['live'],
    coach: 'The small icons on each button are the stats that choice rolls against — the bright one is the main one. Your bars are up top; tap any of them to learn what it does.',
    forceTier: { left: 'good', right: 'good' },
    choices: {
      left: {
        label: 'Dial your own monitor mix',
        governingStats: { skill: 1 },
        tags: ['live', 'tone'],
        outcomes: {
          bad: { text: '—', effects: { chainEventId: 'tut_setlist' } },
          good: { text: 'You chase the feedback out of the wedge yourself. Grub, the sound guy, watches with the respect of one professional recognizing another. Your hands knew what to do — that’s Skill.', effects: { skill: 2, chainEventId: 'tut_setlist' } },
          incredible: { text: '—', effects: { chainEventId: 'tut_setlist' } },
        },
      },
      right: {
        label: 'Befriend Grub, the sound guy',
        governingStats: { network: 1 },
        tags: ['network'],
        outcomes: {
          bad: { text: '—', effects: { chainEventId: 'tut_setlist' } },
          good: { text: 'You bring Grub a ginger ale, unprompted. Grub adjusts three faders and suddenly the house melodica sounds expensive. Knowing people is a stat, and you just used it.', effects: { network: 2, chainEventId: 'tut_setlist' } },
          incredible: { text: '—', effects: { chainEventId: 'tut_setlist' } },
        },
      },
    },
  },
  {
    id: 'tut_setlist', act: 1, pathAffinity: [], weight: 0, chainOnly: true, tutorial: true,
    art: 'ev_tut_setlist', context: 'THE SETLIST QUESTION',
    prompt: 'Three songs tonight. Two you can play in your sleep, and one you wrote at 4 a.m. that might be genius and might be a list of grievances. The colored shape on each button is telling you something.',
    tags: ['live'],
    coach: 'That shape is the risk tell: ● safe · ▲ dicey · ■ likely bad · ✦ big upside in reach. It reads your CURRENT stats, so it changes as you grow.',
    forceTier: { left: 'good', right: 'bad' },
    choices: {
      left: {
        label: 'Play the two you know',
        governingStats: { skill: 1 },
        tags: ['live', 'safe'],
        outcomes: {
          bad: { text: '—', effects: { chainEventId: 'tut_heckler' } },
          good: { text: 'Tight, clean, rehearsed. Nobody’s life changes, but nobody flinches either — and the room decides you’re allowed back. The ● was telling the truth.', effects: { cred: 2, chainEventId: 'tut_heckler' } },
          incredible: { text: '—', effects: { chainEventId: 'tut_heckler' } },
        },
      },
      right: {
        label: 'Open with the 4 a.m. song',
        governingStats: { creativity: 1 },
        tags: ['live', 'risky'],
        outcomes: {
          bad: { text: 'In daylight, the 4 a.m. song is three chords and a list of grievances against a former roommate. The room studies its drinks. That ■ wasn’t a decoration — but you learned something, which is what Bad outcomes are for.', effects: { creativity: 3, cred: -1, chainEventId: 'tut_heckler' } },
          good: { text: '—', effects: { creativity: 2, chainEventId: 'tut_heckler' } },
          incredible: { text: '—', effects: { creativity: 3, chainEventId: 'tut_heckler' } },
        },
      },
    },
  },
  {
    id: 'tut_heckler', act: 1, pathAffinity: [], weight: 0, chainOnly: true, tutorial: true,
    art: 'ev_tut_heckler', context: 'ROW TWO HAS OPINIONS',
    prompt: 'A man who reviews open mics “as a hobby” yells something almost supportive. The room waits. Some fights you pick, some you charm — no script this time, just the dots and your judgment.',
    tags: ['live'],
    coach: 'This one’s a real roll — check both risk tells, pick your fight, live with it. That’s the whole game in miniature.',
    choices: {
      left: {
        label: 'Roast him back',
        governingStats: { cred: 1 },
        tags: ['live', 'risky'],
        outcomes: {
          bad: { text: 'The roast lands on the wrong guy — his friend, an innocent man eating nachos. The hobbyist writes something in a tiny notebook. You’ve made your first critic.', effects: { cred: -2, burnout: 2, chainEventId: 'tut_green' } },
          good: { text: 'The comeback arrives ON time, WITH a rhyme. The hobbyist stands and applauds, alone, weeping slightly. The room is yours now.', effects: { cred: 3, fame: 1, chainEventId: 'tut_green' } },
          incredible: { text: 'The roast is so precise the hobbyist requests it in writing. Someone films it. Someone always films it — tonight that’s good news.', effects: { cred: 4, fame: 3, chainEventId: 'tut_green' } },
        },
      },
      right: {
        label: 'Win him over mid-song',
        governingStats: { network: 1 },
        tags: ['live', 'safe'],
        outcomes: {
          bad: { text: 'You improvise a verse about him and blank on a rhyme for “hobbyist.” The silence has texture. He nods like he expected this.', effects: { network: -1, burnout: 2, chainEventId: 'tut_green' } },
          good: { text: 'You work his heckle into the chorus and dedicate the bridge to “row two.” He buys a sticker afterward. You don’t have stickers — he buys the concept of a sticker.', effects: { network: 3, fame: 1, chainEventId: 'tut_green' } },
          incredible: { text: 'By the last chorus he’s singing the harmony. The whole room follows. Dee mouths “what” from the bar. Diplomacy: it scales.', effects: { network: 4, fame: 2, chainEventId: 'tut_green' } },
        },
      },
    },
  },
  {
    id: 'tut_green', act: 1, pathAffinity: [], weight: 0, chainOnly: true, tutorial: true,
    art: 'ev_tut_green', context: 'THE “GREEN ROOM” (A HALLWAY)',
    prompt: 'Twenty minutes till your set. There’s a couch with a history and an espresso machine with a sign that says FREE, twice. Watch the 🔥 bar up top — that one ends careers.',
    tags: ['rest'],
    coach: '🔥 Burnout drags EVERY roll down, and at 100 the career ends — badly. Choices that rest you are never wasted. This bar is the boss fight.',
    forceTier: { left: 'good', right: 'good' },
    choices: {
      left: {
        label: 'Ten quiet minutes on the couch',
        governingStats: { skill: 1 },
        tags: ['rest', 'safe'],
        outcomes: {
          bad: { text: '—', effects: { chainEventId: 'tut_opener' } },
          good: { text: 'You close your eyes and let the venue hum through the wall. The 🔥 bar goes DOWN. Remember this feeling; the industry will spend three acts trying to make you forget it.', effects: { burnout: -5, chainEventId: 'tut_opener' } },
          incredible: { text: '—', effects: { chainEventId: 'tut_opener' } },
        },
      },
      right: {
        label: 'Three “free” espressos',
        governingStats: { network: 1 },
        tags: ['risky'],
        outcomes: {
          bad: { text: '—', effects: { chainEventId: 'tut_opener' } },
          good: { text: 'You are now aware of your own heartbeat as a rhythm section. Ideas arrive four at a time, none of them filed. The 🔥 bar goes UP — worth it? The bar disagrees, and the bar keeps score.', effects: { burnout: 10, creativity: 1, chainEventId: 'tut_opener' } },
          incredible: { text: '—', effects: { chainEventId: 'tut_opener' } },
        },
      },
    },
  },
  {
    id: 'tut_opener', act: 1, pathAffinity: [], weight: 0, chainOnly: true, tutorial: true,
    art: 'ev_tut_opener', context: 'THE OPENER NO-SHOWS',
    prompt: '“Kid.” Dee, clipboard lowered — serious, then. “Opener quit. Via haiku. You want their slot too?” Twice the stage time, zero extra rehearsal. Sometimes the night just hands you one.',
    tags: ['live'],
    forceTier: { left: 'incredible', right: 'incredible' },
    choices: {
      left: {
        label: 'Take the double slot',
        governingStats: { skill: 0.7, network: 0.5 },
        tags: ['live', 'risky'],
        outcomes: {
          bad: { text: '—', effects: { chainEventId: 'tut_encore' } },
          good: { text: '—', effects: { fame: 3, chainEventId: 'tut_encore' } },
          incredible: { text: 'You black out (musically). Both sets land. A stranger yells the melody back at you DURING the second set, which shouldn’t be possible. Dee writes your name on the clipboard — in PEN.', effects: { fame: 4, cred: 3, chainEventId: 'tut_encore' } },
        },
      },
      right: {
        label: 'Keep your one tight set',
        governingStats: { cred: 1 },
        tags: ['safe'],
        outcomes: {
          bad: { text: '—', effects: { chainEventId: 'tut_encore' } },
          good: { text: '—', effects: { cred: 3, chainEventId: 'tut_encore' } },
          incredible: { text: 'Restraint, it turns out, is a FLEX. Your one set is so tight the missing opener becomes your opening act, conceptually. Dee tells the bartender “watch this one,” about YOU.', effects: { cred: 4, fame: 3, chainEventId: 'tut_encore' } },
        },
      },
    },
  },
  {
    id: 'tut_encore', act: 1, pathAffinity: [], weight: 0, chainOnly: true, tutorial: true,
    art: 'ev_tut_encore', context: 'DEE RAISES AN EYEBROW',
    prompt: '“Closer’s choice,” says Dee. There is, allegedly, a label scout in the back. That 🎇 Encore you just banked? Cards like this are what it’s FOR.',
    tags: ['live'],
    coach: '🎇 Tap the Encore bar below the card to ARM your banked boost — watch the risk tells jump — then swipe. If you don’t arm it, it keeps for later.',
    forceTier: { left: 'encoreUp', right: 'encoreUp' },
    choices: {
      left: {
        label: 'The big singalong',
        governingStats: { cred: 1 },
        tags: ['live'],
        outcomes: {
          bad: { text: '—', effects: { fame: 1, chainEventId: 'tut_tipjar' } },
          good: { text: 'It goes fine. Genuinely fine. But you left the firework in your pocket, and “fine” doesn’t reach the back of the room where scouts allegedly stand.', effects: { fame: 2, chainEventId: 'tut_tipjar' } },
          incredible: { text: 'ARMED and spent. The singalong detonates — the room carries the last chorus without you while you conduct with the melodica. The alleged scout becomes, briefly, a confirmed scout.', effects: { fame: 5, cred: 3, chainEventId: 'tut_tipjar' } },
        },
      },
      right: {
        label: 'The technical showstopper',
        governingStats: { skill: 1 },
        tags: ['live'],
        outcomes: {
          bad: { text: '—', effects: { fame: 1, chainEventId: 'tut_tipjar' } },
          good: { text: 'Clean and impressive — but unboosted, it reads as homework. The firework stayed in your pocket. Next time, arm it when the room matters.', effects: { fame: 2, chainEventId: 'tut_tipjar' } },
          incredible: { text: 'ARMED. The run in the third verse causes an actual, audible “HUH?” — the good kind. Grub pushes the faders up like he’s helping land a plane. Boost spent perfectly.', effects: { skill: 3, fame: 4, chainEventId: 'tut_tipjar' } },
        },
      },
    },
  },
  {
    id: 'tut_tipjar', act: 1, pathAffinity: [], weight: 0, chainOnly: true, tutorial: true,
    art: 'ev_tut_tipjar', context: 'SETTLING UP',
    prompt: 'Dee pays out from an envelope labeled ENVELOPE. Your cut is real, foldable money. Up top: ★ Fame is the score of the game; $ is what keeps it running — debt has ended better careers than bad reviews.',
    tags: ['deal'],
    coach: '★ Fame and $ money live top-right. Fame opens doors and decides endings; money keeps the doors from closing on you.',
    forceTier: { left: 'good', right: 'good' },
    choices: {
      left: {
        label: 'Bank your cut',
        governingStats: { network: 1 },
        tags: ['safe'],
        outcomes: {
          bad: { text: '—', effects: { chainEventId: 'tut_closer' } },
          good: { text: 'Rent formally acknowledges your contribution. It isn’t glamorous, but neither is sleeping in the van — you’ll meet the van later.', effects: { money: 50, chainEventId: 'tut_closer' } },
          incredible: { text: '—', effects: { chainEventId: 'tut_closer' } },
        },
      },
      right: {
        label: 'Split it with Grub',
        governingStats: { network: 1 },
        tags: ['network'],
        outcomes: {
          bad: { text: '—', effects: { chainEventId: 'tut_closer' } },
          good: { text: 'Grub accepts with the solemnity of a knighthood. You are now, permanently, “good people” in the sound-guy network — which is realer than most record deals.', effects: { money: 20, network: 3, chainEventId: 'tut_closer' } },
          incredible: { text: '—', effects: { chainEventId: 'tut_closer' } },
        },
      },
    },
  },
  {
    id: 'tut_closer', act: 1, pathAffinity: [], weight: 0, chainOnly: true, tutorial: true,
    art: 'ev_tut_set', context: 'LAST SONG, FIRST GIG',
    prompt: 'The room has doubled and nobody left, which at an open mic is a standing ovation. One more song, and this stops being a lesson and starts being a career.',
    tags: ['live'],
    coach: 'Last one — real roll, your call. After this: full runs, three acts, a path to commit to, gates to hit. You know the moves now.',
    choices: {
      left: {
        label: 'The crowd-pleaser',
        governingStats: { skill: 1 },
        tags: ['live', 'safe'],
        outcomes: {
          bad: { text: 'A string (metaphorical — it’s a melodica) breaks. You finish anyway. Finishing anyway is 80% of this industry.', effects: { fame: 1, skill: 1 } },
          good: { text: 'You close with the one everybody almost knows, and by the second chorus they fully know it. Dee flips the clipboard over. The back says: COME BACK TUESDAY.', effects: { fame: 3, cred: 2 } },
          incredible: { text: 'The closer becomes a moment — phone lights, the works, at an OPEN MIC. Dee says “huh” out loud, which the bartender confirms has happened twice ever.', effects: { fame: 5, cred: 3 } },
        },
      },
      right: {
        label: 'The one you believe in',
        governingStats: { cred: 1 },
        tags: ['live', 'indie'],
        outcomes: {
          bad: { text: 'It wobbles. Belief alone doesn’t hold a bridge together. But three people hear what it was TRYING to be, and one of them will remember you.', effects: { cred: 1, creativity: 2 } },
          good: { text: 'It lands the way believed-in songs land: quiet room, loud after. Somebody asks if it’s “out anywhere.” It is now out HERE, you say, gesturing at everything.', effects: { cred: 3, creativity: 2, fame: 1 } },
          incredible: { text: 'The room goes church-quiet and stays there a beat after the last note — the rarest applause. Dee doesn’t say anything. Dee doesn’t have to.', effects: { cred: 4, creativity: 3, fame: 3 } },
        },
      },
    },
  },
];
