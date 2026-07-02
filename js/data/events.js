// BIG BREAK — event deck (spec §8.1).
// `act` may be a number or array. `pathAffinity: []` = path-agnostic.
// `requires` supports: flagsAll, flagsNone, stats:{<stat>Min}, moneyMin,
//   moneyMax, burnoutMin, fameMin, gear:[accessoryIds].
// `shop: true` marks opportunity/shop cards (one guaranteed per act).
// `chainOnly: true` = only reachable via chainEventId.
// `pack` = Career Wall event-pack id gating this card.
// Choice extras: `cost: N` — if money < cost the buy fails comedically
//   (declined-card outcome) instead of rolling.

export const EVENTS = [
  // ═══════════════════════ ACT 1 — THE GARAGE ═══════════════════════
  {
    id: 'a1_open_mic', act: 1, pathAffinity: [], weight: 12,
    art: 'ev_open_mic', context: 'The Ricochet Room',
    prompt: 'Open mic night. The sign-up sheet smells like nachos and the sound guy has already given up.',
    tags: ['live'],
    choices: {
      left: {
        label: 'Play it straight',
        governingStats: { skill: 1.0 },
        tags: ['live', 'safe'],
        outcomes: {
          bad: { text: 'You forget your own song halfway through. The nachos watch.', effects: { skill: 2, burnout: 4 } },
          good: { text: 'Solid set. A stranger nods, which here counts as an encore.', effects: { skill: 4, cred: 3, fame: 2 } },
          incredible: { text: 'The sound guy sits up. He hasn’t sat up since 2019.', effects: { skill: 6, cred: 6, network: 3, fame: 4 } },
        },
      },
      right: {
        label: 'Do something weird',
        governingStats: { creativity: 1.0, skill: 0.3 },
        tags: ['live', 'risky', 'indie'],
        outcomes: {
          bad: { text: 'You call it “sound art.” The room calls it “long.”', effects: { creativity: 3, cred: -2, burnout: 5 } },
          good: { text: 'Half the room leaves. The other half follows you online. Trade accepted.', effects: { creativity: 5, fame: 4, network: 3 } },
          incredible: { text: 'Someone films it. The caption: “what is happening (in a good way).”', effects: { creativity: 7, fame: 8, cred: 4, network: 4 } },
        },
      },
    },
  },
  {
    id: 'a1_roommate', act: 1, pathAffinity: [], weight: 10,
    art: 'ev_roommate', context: 'Your roommate, at 2 a.m.',
    prompt: '“Hey. Love the passion. It’s just that it’s 2 a.m. and the song has been the same four notes since Tuesday.”',
    tags: ['home'],
    choices: {
      left: {
        label: 'Headphones & humility',
        governingStats: { skill: 1.0 },
        tags: ['practice', 'safe'],
        outcomes: {
          bad: { text: 'The headphone mix lies to you. You now play everything slightly wrong, confidently.', effects: { skill: 2, burnout: 3 } },
          good: { text: 'Quiet hours, loud progress. The four notes become six.', effects: { skill: 5, burnout: -2 } },
          incredible: { text: 'You woodshed a whole set. Your roommate leaves a supportive Post-it.', effects: { skill: 8, cred: 2, burnout: -4 } },
        },
      },
      right: {
        label: 'Recruit them as manager',
        governingStats: { network: 1.0 },
        tags: ['network', 'risky'],
        outcomes: {
          bad: { text: 'They agree, then immediately schedule you a gig on their own birthday. It’s a trap.', effects: { network: 2, burnout: 5 } },
          good: { text: 'They know a guy. The guy knows a girl. The girl books a real venue.', effects: { network: 6, fame: 2 } },
          incredible: { text: 'Turns out they’re terrifyingly organized. You have a spreadsheet now. A career spreadsheet.', effects: { network: 9, cred: 3, money: 40 } },
        },
      },
    },
  },
  {
    id: 'a1_wedding', act: 1, pathAffinity: [], weight: 10,
    art: 'ev_wedding', context: 'Your cousin',
    prompt: '“You’re a musician, right? Play my wedding. Budget is exposure plus an open bar.” The bar is cash-only.',
    tags: ['live', 'family'],
    choices: {
      left: {
        label: 'Play the hits',
        governingStats: { skill: 1.0, network: 0.3 },
        tags: ['live', 'mainstream', 'safe'],
        outcomes: {
          bad: { text: 'You learn that “Sweet Caroline” has verses. The hard way. In front of everyone.', effects: { skill: 3, burnout: 5, money: 20 } },
          good: { text: 'The dance floor fills. An uncle tips you $50 to play it again. You play it again.', effects: { skill: 4, network: 4, money: 60 } },
          incredible: { text: 'You ARE the wedding. Three guests take your number. One of them books events for a living.', effects: { skill: 5, network: 8, money: 120, fame: 3 } },
        },
      },
      right: {
        label: 'Debut your originals',
        governingStats: { creativity: 1.0 },
        tags: ['live', 'risky', 'indie'],
        outcomes: {
          bad: { text: 'Your ballad about late capitalism clears the dance floor. The DJ is summoned like an exorcist.', effects: { creativity: 3, cred: -2, burnout: 6 } },
          good: { text: 'The weird song lands during dinner. Someone cries, allegedly about the song.', effects: { creativity: 6, cred: 3, fame: 3 } },
          incredible: { text: 'The couple asks for your song as their first dance. You have a fanbase of two, legally bound.', effects: { creativity: 8, cred: 5, fame: 6, network: 3 } },
        },
      },
    },
  },
  {
    id: 'a1_craigslist', act: 1, pathAffinity: [], weight: 10,
    art: 'ev_craigslist', context: 'Online ad',
    prompt: '“BAND SEEKS MEMBER. Influences: everything. No flakes. Practice space is my mom’s garage but she’s cool.”',
    tags: ['network'],
    choices: {
      left: {
        label: 'Join the band',
        governingStats: { network: 1.0, skill: 0.3 },
        tags: ['network', 'band'],
        outcomes: {
          bad: { text: 'The band’s “everything” influence turns out to mean ska. Exclusively ska.', effects: { network: 3, burnout: 5 } },
          good: { text: 'The mom IS cool. The band is fine. The scene notices you exist.', effects: { network: 6, skill: 3, cred: 2 } },
          incredible: { text: 'The guitarist’s day job is booking a venue. You’re suddenly on every flyer in town.', effects: { network: 10, cred: 4, fame: 3 } },
        },
      },
      right: {
        label: 'Stay solo',
        governingStats: { creativity: 1.0 },
        tags: ['solo', 'indie'],
        outcomes: {
          bad: { text: 'Creative freedom achieved. Also: nobody to help carry the amp. Freedom is heavy.', effects: { creativity: 3, burnout: 4 } },
          good: { text: 'No compromises, no ska. Your sound gets sharper and stranger.', effects: { creativity: 6, skill: 2 } },
          incredible: { text: 'A local zine calls you “a scene of one.” You screenshot it 40 times.', effects: { creativity: 8, cred: 5, fame: 3 } },
        },
      },
    },
  },
  {
    id: 'a1_phone_demo', act: 1, pathAffinity: [], weight: 10,
    art: 'ev_phone_demo', context: 'Voice memos, 3:47 a.m.',
    prompt: 'You wrote something good. It exists only as a phone recording with a smoke detector chirping in the background.',
    tags: ['record'],
    choices: {
      left: {
        label: 'Post it raw',
        governingStats: { creativity: 0.7, network: 0.7 },
        tags: ['social', 'record', 'indie'],
        outcomes: {
          bad: { text: 'Four likes. One is your mom. One is a bot selling mixing services. They may be right.', effects: { creativity: 2, fame: 1 } },
          good: { text: 'The chirp is on the one. People think it’s intentional. You say “yes. intentional.”', effects: { creativity: 4, fame: 6, network: 3 } },
          incredible: { text: 'A tastemaker account reposts it: “demo of the year, smoke detector included.”', effects: { creativity: 5, fame: 12, network: 6, cred: 3 } },
        },
      },
      right: {
        label: 'Save it for a real studio',
        governingStats: { skill: 1.0 },
        tags: ['studio', 'safe'],
        outcomes: {
          bad: { text: 'You demo it to death. Version 14 has lost whatever version 1 had.', effects: { skill: 3, creativity: -2, burnout: 4 } },
          good: { text: 'You chart it properly. Future-you will thank present-you in the liner notes.', effects: { skill: 5, creativity: 2, writeSong: true, addFlag: 'demo_in_pocket', addPromise: { label: 'Book real studio time', tags: ['studio', 'record'], cards: 4, reward: { skill: 3, cred: 2 }, penalty: { cred: -2 } } } },
          incredible: { text: 'The arrangement blooms. This isn’t a demo anymore. It’s a plan.', effects: { skill: 7, creativity: 4, cred: 2, writeSong: true, addFlag: 'demo_in_pocket' } },
        },
      },
    },
  },
  {
    id: 'a1_busk', act: 1, pathAffinity: [], weight: 9,
    art: 'ev_busk', context: 'Farmers market',
    prompt: 'Saturday. Foot traffic. The prime corner is “owned” by a bagpiper named Craig. Everyone fears Craig.',
    tags: ['busk', 'live'],
    choices: {
      left: {
        label: 'Challenge Craig for the corner',
        minigame: 'hat',
        governingStats: { cred: 0.8, skill: 0.6 },
        tags: ['busk', 'live', 'risky'],
        outcomes: {
          bad: { text: 'You cannot out-loud a bagpipe. Nobody can. Craig plays “Amazing Grace” at you, pointedly.', effects: { cred: -2, burnout: 6, money: 8 } },
          good: { text: 'Craig grants you 11 a.m. to noon. The busker accords hold. Good haul.', effects: { cred: 4, money: 45, network: 2 } },
          incredible: { text: 'You and Craig duet. It should not work. It works. A crowd forms. Craig weeps.', effects: { cred: 7, money: 90, fame: 6, network: 4 } },
        },
      },
      right: {
        label: 'Take the spot by the compost',
        governingStats: { skill: 1.0 },
        tags: ['busk', 'safe'],
        outcomes: {
          bad: { text: 'Your audience is flies and one very supportive toddler with no money.', effects: { skill: 2, money: 6 } },
          good: { text: 'Steady tips from people pretending not to hurry past the compost.', effects: { skill: 3, money: 30 } },
          incredible: { text: 'The compost corner becomes “your” corner. Regulars. Requests. An economy.', effects: { skill: 4, money: 65, network: 3, cred: 2, grantHustle: 'compost_corner' } },
        },
      },
    },
  },
  {
    id: 'a1_pawn_shop', act: 1, pathAffinity: [], weight: 9, shop: true,
    art: 'ev_pawn_shop', context: 'Second Chances Pawn & Loan',
    prompt: 'A wall of gear, each piece radiating someone else’s abandoned dream. The owner watches you like you’re a chord he can’t place.',
    tags: ['shop'],
    choices: {
      left: {
        label: 'Buy something ($45)',
        governingStats: { network: 0.6, cred: 0.6 },
        tags: ['shop', 'deal'],
        cost: 45,
        outcomes: {
          bad: { text: 'It hums when plugged in. Not musically. Existentially. Still yours now.', effects: { money: -45, grantGear: 'random_basic' } },
          good: { text: 'Solid piece, fair price. The owner nods: “that one’s got songs left in it.”', effects: { money: -45, grantGear: 'random_basic', cred: 2 } },
          incredible: { text: 'He undercharges you on purpose. “Bring it back famous.” You won’t. You’ll frame it.', effects: { money: -30, grantGear: 'random_basic', cred: 4, network: 2 } },
        },
      },
      right: {
        label: 'Just browse',
        governingStats: { creativity: 1.0 },
        tags: ['safe'],
        outcomes: {
          bad: { text: 'You covet a synth you cannot afford. It costs one rent. It knows.', effects: { creativity: 2, burnout: 2 } },
          good: { text: 'You leave inspired and solvent. A rare combination.', effects: { creativity: 4 } },
          incredible: { text: 'You overhear two roadies gossiping. You now know which venues actually pay.', effects: { creativity: 4, network: 4, cred: 2 } },
        },
      },
    },
  },
  {
    id: 'a1_clips', act: 1, pathAffinity: [], weight: 9,
    art: 'ev_clips', context: 'The algorithm',
    prompt: 'Everyone says post practice clips. The trending format this week: play your instrument while an unrelated man makes soup.',
    tags: ['social'],
    choices: {
      left: {
        label: 'Do the soup format',
        governingStats: { network: 1.0 },
        tags: ['social', 'mainstream'],
        outcomes: {
          bad: { text: 'The algorithm shows it to eleven people in Belgium. The soup gets the comments.', effects: { fame: 2, cred: -2, burnout: 3 } },
          good: { text: 'Modest numbers, but the right people. A booker follows you.', effects: { fame: 6, network: 5 } },
          incredible: { text: 'Soup Man himself duets it. You are, briefly, the entire internet’s house band.', effects: { fame: 14, network: 7, cred: -1 } },
        },
      },
      right: {
        label: 'Post the 9-minute ambient piece',
        governingStats: { creativity: 1.0 },
        tags: ['social', 'indie'],
        outcomes: {
          bad: { text: 'Watch time: 41 seconds average. Your mom made it to minute two. Respect.', effects: { creativity: 3, fame: 1 } },
          good: { text: 'A small, intense audience emerges. They use words like “liminal.” They mean it.', effects: { creativity: 5, cred: 4, fame: 3 } },
          incredible: { text: 'A sleep-podcast licenses it. Thousands of strangers now dream to your drone.', effects: { creativity: 7, cred: 5, fame: 6, money: 80, grantHustle: 'sleep_podcast' } },
        },
      },
    },
  },
  {
    id: 'a1_battle', act: 1, pathAffinity: [], weight: 8,
    art: 'ev_battle', context: 'Battle of the Bands ($20 entry)',
    prompt: 'First prize: $500 and “studio time.” The judges are the venue owner’s three adult sons, who all play in the house band.',
    tags: ['live'],
    choices: {
      left: {
        label: 'Enter anyway',
        minigame: 'crowd',
        governingStats: { skill: 0.7, creativity: 0.7 },
        tags: ['live', 'risky'],
        outcomes: {
          bad: { text: 'You lose to the sons’ friends’ band, who performed one long drum solo. The fix was in.', effects: { money: -20, cred: 2, burnout: 6 } },
          good: { text: 'Second place: a bar tab and grudging respect from son number three.', effects: { money: 10, cred: 4, fame: 3, skill: 3 } },
          incredible: { text: 'You win so hard the sons can’t rig it. $500 and the crowd chanting a name you’ll keep.', effects: { money: 480, cred: 7, fame: 8, skill: 3 } },
        },
      },
      right: {
        label: 'Network from the bar instead',
        governingStats: { network: 1.0 },
        tags: ['network', 'safe'],
        outcomes: {
          bad: { text: 'You spend $20 on one (1) cocktail and talk to a man who claims he “discovered” three bands. He didn’t.', effects: { money: -20, network: 1 } },
          good: { text: 'You befriend the losing bands. Losers stick together. Losers become a scene.', effects: { network: 6, cred: 2, money: -10 } },
          incredible: { text: 'The venue owner likes that you didn’t enter. “Smart. Want a monthly slot?”', effects: { network: 8, cred: 4, fame: 3, grantHustle: 'residency' } },
        },
      },
    },
  },
  {
    id: 'a1_lessons', act: 1, pathAffinity: [], weight: 9,
    art: 'ev_lessons', context: 'Above the vape shop',
    prompt: 'A retired session ace teaches lessons upstairs. Her wall has gold records and a signed photo she refuses to explain.',
    tags: ['practice'],
    choices: {
      left: {
        label: 'Pay for lessons ($60)',
        governingStats: { skill: 1.0 },
        tags: ['practice', 'safe'],
        cost: 60,
        outcomes: {
          bad: { text: 'She watches you play, sighs, and starts you on whole notes. Whole. Notes.', effects: { money: -60, skill: 5, cred: 1, burnout: 3 } },
          good: { text: '“Stop trying to be interesting. Be correct first.” It stings. It works.', effects: { money: -60, skill: 8, cred: 2, addPromise: { label: 'Practice what she taught you', tags: ['practice', 'studio'], cards: 4, reward: { skill: 4 }, penalty: { skill: -1 } } } },
          incredible: { text: 'She hears something in you. Lesson runs three hours. She refuses half the money.', effects: { money: -30, skill: 11, cred: 4, network: 3 } },
        },
      },
      right: {
        label: 'YouTube tutorials at 1.5x',
        governingStats: { creativity: 0.6, skill: 0.6 },
        tags: ['practice'],
        outcomes: {
          bad: { text: 'You learn a technique that three comments say will injure you. You learn it anyway.', effects: { skill: 2, burnout: 4 } },
          good: { text: 'Free, fast, and only slightly wrong. Progress with an asterisk.', effects: { skill: 4, creativity: 2 } },
          incredible: { text: 'You fall down a music-theory rabbit hole and emerge speaking in Roman numerals.', effects: { skill: 6, creativity: 4 } },
        },
      },
    },
  },
  {
    id: 'a1_dayjob', act: 1, pathAffinity: [], weight: 8,
    art: 'ev_dayjob', context: 'Your shift manager, Todd',
    prompt: '“Big weekend, need you Saturday.” Saturday is also the only studio slot you can afford this month.',
    tags: ['work'],
    choices: {
      left: {
        label: 'Take the shift',
        governingStats: { network: 0.5, skill: 0.5 },
        tags: ['work', 'safe'],
        outcomes: {
          bad: { text: 'Double shift. You write zero songs but memorize the smoothie menu forever.', effects: { money: 70, burnout: 8 } },
          good: { text: 'Money in the bank. You hum new melodies into the walk-in freezer.', effects: { money: 90, burnout: 5, creativity: 2 } },
          incredible: { text: 'Todd promotes you to keyholder. You use the empty store as a reverb chamber after close.', effects: { money: 110, burnout: 4, creativity: 4, addFlag: 'keyholder' } },
        },
      },
      right: {
        label: 'Call in “sick” to make music',
        governingStats: { creativity: 1.0 },
        tags: ['risky', 'record'],
        outcomes: {
          bad: { text: 'Todd sees your studio story. You keep the job, barely. He mentions it weekly, forever.', effects: { creativity: 3, cred: -2, burnout: 5 } },
          good: { text: 'Best session of your life. Worth every fake cough.', effects: { creativity: 7, skill: 3 } },
          incredible: { text: 'You cut the track AND Todd never checks his feed. A perfect crime. A perfect take.', effects: { creativity: 9, skill: 4, cred: 2, addFlag: 'demo_in_pocket' } },
        },
      },
    },
  },
  {
    id: 'a1_house_show', act: 1, pathAffinity: [], weight: 9,
    art: 'ev_house_show', context: 'A basement in the good part of the bad part of town',
    prompt: 'House show. Four bands, one bathroom, a ceiling exactly your height. The scene is here. All nineteen of them.',
    tags: ['live', 'network'],
    choices: {
      left: {
        label: 'Play the basement',
        governingStats: { creativity: 0.6, network: 0.6 },
        tags: ['live', 'indie'],
        outcomes: {
          bad: { text: 'You hit your head on the ceiling mid-song. Twice. The second time is somehow on beat.', effects: { network: 3, burnout: 5, fame: 1 } },
          good: { text: 'Sweaty, loud, perfect. Nineteen people is a movement if they’re the right nineteen.', effects: { network: 6, cred: 4, fame: 3 } },
          incredible: { text: 'The basement loses its mind. Someone crowd-surfs in a room with no crowd. Physics bends for you.', effects: { network: 8, cred: 6, fame: 6, burnout: 4 } },
        },
      },
      right: {
        label: 'Run sound for the other bands',
        governingStats: { skill: 0.7, network: 0.7 },
        tags: ['network', 'safe'],
        outcomes: {
          bad: { text: 'The PA dies. Everyone blames you. The PA was older than the house.', effects: { network: 2, cred: -1, burnout: 4 } },
          good: { text: 'You make four bands sound better than they are. Four bands owe you.', effects: { network: 6, skill: 3, cred: 3 } },
          incredible: { text: 'Word spreads: you have Ears. Bands start asking for you by name.', effects: { network: 8, skill: 4, cred: 5, money: 30 } },
        },
      },
    },
  },

  {
    id: 'a1_rival_intro', act: 1, pathAffinity: [], weight: 14,
    art: 'ev_rival_intro', context: 'The act after yours',
    prompt: 'You finish your set. Then {rival} — {rivalVibe} — walks up and plays the best thing you’ve heard all year. On YOUR stage. To YOUR nineteen fans.',
    tags: ['live', 'rival'],
    choices: {
      left: {
        label: 'Befriend them, learn everything',
        governingStats: { network: 1.0 },
        tags: ['network'],
        outcomes: {
          bad: { text: 'You compliment {rival} so hard it sounds sarcastic. They now think you’re a hater with a strategy.', effects: { network: 2, rivalry: 1 } },
          good: { text: 'You buy {rival} a drink. They tell you exactly which venues pay and which “pay.” Priceless intel.', effects: { network: 6, cred: 2, rivalry: -2 } },
          incredible: { text: 'Closing time jam session. You and {rival} — instant, unfair chemistry. The bartender films it, weeping.', effects: { network: 8, creativity: 4, fame: 3, rivalry: -3 } },
        },
      },
      right: {
        label: 'Swear silent, eternal rivalry',
        governingStats: { creativity: 1.0 },
        tags: ['risky'],
        outcomes: {
          bad: { text: 'You glare at {rival} from the merch table. They wave warmly. Somehow this makes it worse.', effects: { creativity: 3, burnout: 3, rivalry: 2 } },
          good: { text: 'Spite is a renewable resource. You go home and write until 4 a.m. Best thing you’ve made in months.', effects: { creativity: 6, skill: 2, rivalry: 2 } },
          incredible: { text: 'You channel it into a song so good even {rival} shares it, captioned “ok. heard.” The feud is ON and it is PRODUCTIVE.', effects: { creativity: 9, fame: 5, cred: 3, rivalry: 3 } },
        },
      },
    },
  },
  {
    id: 'a1_algorithm_oracle', act: 1, pathAffinity: [], weight: 9,
    art: 'ev_oracle', context: 'Your friend Dex, who “understands the algorithm”',
    prompt: '“Post at 7:43 p.m. on Thursdays. Third hashtag must be misspelled. Trust me.” Dex has 41 followers. Dex speaks with total confidence.',
    tags: ['social'],
    choices: {
      left: {
        label: 'Follow the Dex method',
        governingStats: { network: 1.0 },
        tags: ['social', 'risky'],
        outcomes: {
          bad: { text: 'The Dex method delivers Dex-level numbers. He blames Mercury. Mercury is unavailable for comment.', effects: { fame: 1, burnout: 3 } },
          good: { text: 'Somehow, 7:43 on Thursday works. Correlation, causation, whatever — you’ll take it.', effects: { fame: 6, network: 3 } },
          incredible: { text: 'The misspelled hashtag becomes a thing. Dex updates his bio to “strategist.” You update yours to “viral.”', effects: { fame: 11, network: 5, creativity: 2 } },
        },
      },
      right: {
        label: 'Post whenever, like an animal',
        governingStats: { creativity: 0.8, cred: 0.5 },
        tags: ['social', 'indie'],
        outcomes: {
          bad: { text: 'You post at 3 a.m. The only engagement is a bot and, of course, Dex: “told you.”', effects: { creativity: 2 } },
          good: { text: 'Chaotic posting builds a chaotic little audience. They match your energy alarmingly well.', effects: { creativity: 4, fame: 4, cred: 2 } },
          incredible: { text: 'Your unscheduled, unhinged post is your first real hit. Dex claims it proves his system. Let him.', effects: { creativity: 6, fame: 9, cred: 3 } },
        },
      },
    },
  },
  {
    id: 'a1_karaoke', act: 1, pathAffinity: [], weight: 9,
    art: 'ev_karaoke', context: 'Karaoke night (you came to observe)',
    prompt: 'Someone signs you up without asking. The book is open to a power ballad. In the corner booth, a woman in a blazer watches everything and writes things down.',
    tags: ['live', 'vocal'],
    choices: {
      left: {
        label: 'Commit to the ballad',
        minigame: 'note',
        governingStats: { creativity: 0.6, network: 0.6 },
        tags: ['live', 'vocal', 'risky'],
        outcomes: {
          bad: { text: 'You take the key change like a speed bump. The blazer woman writes one (1) word and underlines it.', effects: { creativity: 2, burnout: 4, fame: 1 } },
          good: { text: 'You perform it like it’s yours. The bar sings the last chorus for you. The blazer woman circles something.', effects: { creativity: 4, network: 4, fame: 4 } },
          incredible: { text: 'Standing ovation at KARAOKE. The blazer woman hands you a card: she books three venues and one festival.', effects: { creativity: 5, network: 8, fame: 6, cred: 2 } },
        },
      },
      right: {
        label: 'Trade slots, play your own song',
        governingStats: { cred: 0.8, skill: 0.5 },
        tags: ['live', 'indie', 'risky'],
        outcomes: {
          bad: { text: 'The karaoke crowd wanted the ballad. Your original lands like a tax seminar. The host “can’t find” your next slot.', effects: { cred: 2, burnout: 4 } },
          good: { text: 'An original at karaoke is illegal in spirit, but it WORKS. Two people ask where to stream it. It isn’t streamable. It will be by Friday.', effects: { cred: 5, creativity: 3, fame: 3 } },
          incredible: { text: 'The bar goes quiet in the good way. The host breaks the rules and gives you a second song. The blazer woman stays past her babysitter’s deadline.', effects: { cred: 7, creativity: 4, network: 5, fame: 4 } },
        },
      },
    },
  },
  {
    id: 'a1_music_store', act: 1, pathAffinity: [], weight: 9,
    art: 'ev_music_store', context: 'Strings & Things (help wanted)',
    prompt: 'The music store needs weekend help. Pay is bad. But you’d touch every instrument in the building, and gearheads gossip like nobody else alive.',
    tags: ['work'],
    choices: {
      left: {
        label: 'Take the weekend job',
        governingStats: { skill: 0.7, network: 0.5 },
        tags: ['work', 'safe'],
        outcomes: {
          bad: { text: 'You spend both days restringing ukuleles for a school order. Your fingertips file a formal complaint.', effects: { money: 60, skill: 2, burnout: 4 } },
          good: { text: 'Between customers you play everything on the wall. The good wall. Your hands learn six new arguments.', effects: { money: 80, skill: 5, network: 2 } },
          incredible: { text: 'A touring bassist shreds the floor model, buys nothing, and offers you a warm-up slot because you “handed him the right amp without asking.”', effects: { money: 80, skill: 5, network: 6, cred: 3 } },
        },
      },
      right: {
        label: 'Busk outside it instead',
        governingStats: { creativity: 0.7, cred: 0.5 },
        tags: ['busk', 'risky'],
        outcomes: {
          bad: { text: 'The owner turns the store speakers outward. You cannot compete with a Marshall stack playing Steely Dan. Nobody can.', effects: { creativity: 2, money: 8, burnout: 3 } },
          good: { text: 'Customers walking out with new gear are feeling generous. Your case fills with sympathy and fives.', effects: { creativity: 3, money: 45, cred: 2 } },
          incredible: { text: 'The owner comes out furious, listens for one song, and hires you to play IN the store on Saturdays. Salary: actual money.', effects: { creativity: 4, money: 70, network: 4, grantHustle: 'residency' } },
        },
      },
    },
  },
  {
    id: 'a1_college_radio', act: 1, pathAffinity: [], weight: 8,
    art: 'ev_radio', context: 'WKRZ 89.1, “the sound of the basement”',
    prompt: 'College radio wants you for the 2 a.m. slot. The host, Bea, has nine listeners and treats the show like it’s the BBC. Honestly? Respect.',
    tags: ['record', 'network'],
    choices: {
      left: {
        label: 'Do the interview + live session',
        governingStats: { network: 0.7, skill: 0.5 },
        tags: ['record', 'live'],
        outcomes: {
          bad: { text: 'The board shorts mid-song and Bea conducts the rest of the interview through a megaphone. All nine listeners stay. Legends, all of them.', effects: { network: 3, skill: 2, burnout: 3 } },
          good: { text: 'The 2 a.m. session is loose and honest, and Bea’s archive clip travels further than the broadcast ever did.', effects: { network: 4, fame: 4, cred: 3 } },
          incredible: { text: 'Bea’s rip of your session becomes a scene bootleg. “WKRZ version” becomes the version. Bea gets promoted to 11 p.m. You did that.', effects: { network: 6, fame: 8, cred: 4, addFlag: 'demo_in_pocket' } },
        },
      },
      right: {
        label: 'Counter-offer: you’ll guest-host',
        governingStats: { creativity: 0.8 },
        tags: ['risky', 'indie'],
        outcomes: {
          bad: { text: 'You play deep cuts nobody requested for two hours. The phone rings once. Wrong number. You take the request anyway.', effects: { creativity: 3, network: 1 } },
          good: { text: 'Your guest slot becomes a bit — “the musician who won’t play their own music.” Word spreads. Mystique accrues.', effects: { creativity: 5, cred: 3, fame: 3 } },
          incredible: { text: 'Your radio voice is, apparently, a gift. Bea offers you a monthly slot. The nine listeners become ninety. The scene listens at 2 a.m. now.', effects: { creativity: 6, network: 5, fame: 5, cred: 3 } },
        },
      },
    },
  },
  {
    id: 'a1_subway_clip', act: 1, pathAffinity: [], weight: 8,
    art: 'ev_subway', context: 'A stranger’s phone, unbeknownst to you',
    prompt: 'You practiced on the empty late-night platform because the reverb is perfect. It wasn’t empty. A stranger filmed the whole thing. It’s already posted: “who IS this??”',
    tags: ['social', 'busk'],
    choices: {
      left: {
        label: 'Claim it — “that’s me”',
        governingStats: { network: 1.0 },
        tags: ['social'],
        outcomes: {
          bad: { text: 'You comment “that’s me” from an account with 40 followers and a kazoo avatar. The internet demands proof. You provide it. Poorly. From a bathroom.', effects: { network: 2, fame: 3 } },
          good: { text: 'You duet the clip with the same song, same tiles, same reverb. The internet does the math. New followers arrive by the hundred.', effects: { network: 4, fame: 8 } },
          incredible: { text: 'The original poster becomes your biggest advocate — “I FOUND them, I have taste” — and their whole following adopts you as a group project.', effects: { network: 7, fame: 12, cred: 2 } },
        },
      },
      right: {
        label: 'Stay anonymous. Feed the mystery.',
        governingStats: { creativity: 0.8, cred: 0.5 },
        tags: ['indie', 'risky'],
        outcomes: {
          bad: { text: 'The mystery dies in a day when your cousin comments “that’s my cousin lol.” The wedding gig haunts you again.', effects: { cred: 2, fame: 2 } },
          good: { text: 'You post another platform clip from a different station, unlabeled. The hunt becomes a scene pastime. Mystique compounds nightly.', effects: { creativity: 5, cred: 4, fame: 5 } },
          incredible: { text: '“The Platform Phantom” gets a fan account, a subreddit, and a theory board. You confirm nothing. Attendance at your (unrelated, wink) shows doubles.', effects: { creativity: 6, cred: 6, fame: 9 } },
        },
      },
    },
  },
  {
    id: 'a1_noise_cop', act: 1, pathAffinity: [], weight: 8,
    art: 'ev_noise_cop', context: 'A knock at the garage door, 10:47 p.m.',
    prompt: 'Noise complaint. The responding officer stands in the doorway, listens to the unfinished bridge you were looping, and says: “...it wants a minor fourth there. Anyway. Keep it down.”',
    tags: ['home'],
    choices: {
      left: {
        label: 'Try the minor fourth',
        minigame: 'ideas',
        governingStats: { creativity: 1.0 },
        tags: ['write'],
        outcomes: {
          bad: { text: 'The minor fourth is wrong. Deeply. But being wrong THAT way shows you what was right. You owe the officer an apology and half a credit.', effects: { creativity: 4, burnout: 2 } },
          good: { text: 'It works. It absolutely works. You play it loud enough for the retreating patrol car to hear. The lights flash once. Approval? Approval.', effects: { creativity: 6, skill: 2, writeSong: true } },
          incredible: { text: 'The bridge clicks like a lock opening. Officer Reyes, it turns out, gigged for a decade before the academy. You have a standing invitation to Sunday jazz brunch. You will attend.', effects: { creativity: 8, network: 4, cred: 2, writeSong: true } },
        },
      },
      right: {
        label: 'Defend your bridge as written',
        governingStats: { cred: 0.9 },
        tags: ['risky', 'indie'],
        outcomes: {
          bad: { text: 'You explain your artistic choices to a noise-complaint cop at 11 p.m. The citation includes the word “hubris,” hand-written.', effects: { money: -40, cred: 3 } },
          good: { text: '“Respect,” says the officer, leaving. The neighbor calls again at midnight. The officer, reportedly, drives slowly.', effects: { cred: 5, creativity: 2 } },
          incredible: { text: 'You play both versions through the doorway. A crowd of neighbors gathers IN PAJAMAS to vote. Yours wins. Democracy. The complaint is withdrawn by referendum.', effects: { cred: 7, network: 4, fame: 3 } },
        },
      },
    },
  },
  // ═══════════════ SOMEONE (the person at home — 3-card arc) ═══════════════
  {
    id: 'sm_meet', act: 1, pathAffinity: [], weight: 9,
    art: 'ev_sm_meet', context: 'After the show, by the door',
    prompt: 'You meet someone at the merch table who didn’t see the set — they were in the kitchen the whole time, and they’re asking about you, not the music. It’s disorienting. It’s wonderful. It’s a Tuesday.',
    tags: ['home'],
    choices: {
      left: {
        label: 'Let them in',
        governingStats: { cred: 0.5, creativity: 0.5 },
        tags: ['home', 'safe'],
        outcomes: {
          bad: { text: 'The first date is the night of a last-minute gig. You reschedule. So do they. The calendar becomes a duet neither of you can quite play — but neither of you stops trying.', effects: { addFlag: 'someone', burnout: -4, network: -2 } },
          good: { text: 'They never ask when you’ll be famous. They ask what the bridge is doing, and whether you’ve eaten. Nobody has asked either question in a year.', effects: { addFlag: 'someone', burnout: -8, creativity: 2 } },
          incredible: { text: 'Weeks in, you realize you’ve been writing in a different key. Warmer. They still haven’t heard the songs. The songs are increasingly about that.', effects: { addFlag: 'someone', burnout: -10, creativity: 4 } },
        },
      },
      right: {
        label: 'Career first. Clean and honest.',
        governingStats: { cred: 0.8 },
        tags: ['risky', 'work'],
        outcomes: {
          bad: { text: '“That’s fair,” they say, meaning it, leaving. The song you write that night is your best in months. You’d trade it back. You keep it anyway.', effects: { creativity: 5, burnout: 3 } },
          good: { text: 'You’re honest about the shape of the next two years. They shake your hand — actually shake it — and wish you the summit. Clean exits are also love, technically.', effects: { cred: 4, creativity: 2 } },
          incredible: { text: 'They laugh: “Call me from the top, then.” You keep the napkin with the number. It moves apartments with you. Some doors you leave propped, quietly, for years.', effects: { cred: 4, creativity: 4, addFlag: 'propped_door' } },
        },
      },
    },
  },
  {
    id: 'sm_birthday', act: 2, pathAffinity: [], weight: 12,
    requires: { flagsAll: ['someone'] },
    art: 'ev_sm_birthday', context: 'Two calendar notifications, same night',
    prompt: 'Their birthday dinner is Thursday. The make-up date for the canceled radio session is also Thursday. Both were promises. Your phone shows them stacked, one pixel apart, like a chord it refuses to play.',
    tags: ['home', 'work'],
    choices: {
      left: {
        label: 'The dinner. Obviously. Somehow.',
        governingStats: { cred: 0.6, network: 0.5 },
        tags: ['home', 'safe'],
        outcomes: {
          bad: { text: 'You make the dinner. The station quietly stops calling. Under the table, they squeeze your hand at the exact moment you decide not to check your phone. Worth it. Expensive, and worth it.', effects: { burnout: -8, network: -4, cred: 2 } },
          good: { text: 'You make the dinner AND the station reschedules — turns out honesty (“family thing”) is a professional strategy nobody tries. The cake has a kazoo on it. You are dating a comedian.', effects: { burnout: -10, cred: 3 } },
          incredible: { text: 'At dinner they hand you a gift: studio hours, booked in your name, “for the album you keep almost making.” You do the radio thing the next week. You do everything the next week. Rested.', effects: { burnout: -12, creativity: 4, addFlag: 'studio_gift' } },
        },
      },
      right: {
        label: 'The session. You’ll make it up.',
        governingStats: { network: 0.8 },
        tags: ['work', 'risky'],
        outcomes: {
          bad: { text: 'The session goes fine. The texts get shorter for a while — then stop being about anything. Some songs cost more than studio time. You learn the exchange rate slowly.', effects: { fame: 5, network: 3, removeFlag: 'someone', addFlag: 'someone_lost', burnout: 4 } },
          good: { text: 'The session lands and you show up at the tail of the dinner with the rough mix and an apology shaped like dessert. “You’re lucky it’s good,” they say, about both.', effects: { fame: 6, network: 3, burnout: 3, addPromise: { label: 'Make real time for them', tags: ['home', 'rest'], cards: 4, reward: { burnout: -8 }, penalty: { burnout: 4 } } } },
          incredible: { text: 'You dedicate the on-air performance to them, by name, on their birthday, live. The clip outlives the argument. The argument was already small. You still bring dessert.', effects: { fame: 9, network: 4, cred: 2 } },
        },
      },
    },
  },
  {
    id: 'sm_question', act: 3, pathAffinity: [], weight: 12,
    requires: { flagsAll: ['someone'] },
    art: 'ev_sm_question', context: 'The kitchen, late. The good silence.',
    prompt: 'They ask it the way they ask everything — plainly, hands around a mug: “The first verse was the garage. This act you’re in now, whatever it is — is there room for me in the second verse of it?”',
    tags: ['home'],
    choices: {
      left: {
        label: '“You’re the second verse.”',
        governingStats: { cred: 0.6, creativity: 0.6 },
        tags: ['home', 'safe'],
        outcomes: {
          bad: { text: 'You mean it, and then a tour offer tests it within the week. You take the shorter routing. The agent is baffled. The kitchen is not.', effects: { burnout: -8, fame: -2, cred: 3, addFlag: 'second_verse' } },
          good: { text: 'Something in your chest unclenches that had been holding a note since Act 1. The next song writes itself in an evening. It’s the one people will slow-dance to.', effects: { burnout: -12, creativity: 5, cred: 3, addFlag: 'second_verse' } },
          incredible: { text: 'You play them everything, that night, unreleased, in the kitchen — the audience of one you were always writing for. Whatever the industry decides now, the verse is already sung.', effects: { burnout: -14, creativity: 7, cred: 4, addFlag: 'second_verse', pathProgress: 1 } },
        },
      },
      right: {
        label: '“Ask me after the finale.”',
        governingStats: { network: 0.7 },
        tags: ['risky', 'work'],
        outcomes: {
          bad: { text: 'They nod slowly, translating it correctly. The mug goes in the sink. Some questions expire when deferred — that’s what makes them questions and not lyrics.', effects: { fame: 3, removeFlag: 'someone', addFlag: 'someone_lost', burnout: 5 } },
          good: { text: '“Okay,” they say. “But I’m asking with a different tone next time.” They stay. The clock starts. You play the next weeks like someone who can hear it.', effects: { fame: 4, burnout: 2, creativity: 2 } },
          incredible: { text: 'They laugh — the real one, the one from the merch table. “Fine. But I want it in writing.” You write it that night. Four chords. You know the ones.', effects: { fame: 4, creativity: 5, cred: 3 } },
        },
      },
    },
  },
  // ═══════════════ COMEBACK MODE (requires 'comeback') ═══════════════
  {
    id: 'cb_remembered', act: 1, pathAffinity: [], weight: 14,
    requires: { flagsAll: ['comeback'] },
    art: 'ev_cb_remembered', context: 'The grocery store, aisle 6',
    prompt: '“Oh my god. You’re— you WERE— hold on, don’t tell me—” The stranger snaps their fingers at you like you’re a song title on the tip of their tongue. You were their whole 11th grade. You are currently holding discount pasta.',
    tags: ['fame', 'social'],
    choices: {
      left: {
        label: 'Help them remember. Warmly.',
        governingStats: { network: 0.8, cred: 0.5 },
        tags: ['social', 'safe'],
        outcomes: {
          bad: { text: 'You say your own name into the fluorescent hum. “No, that’s not it,” they decide, walking off. You buy the pasta. You buy two.', effects: { cred: 2, burnout: 3 } },
          good: { text: 'Recognition floods their face and they play you their favorite deep cut RIGHT THERE, phone speaker, aisle 6. It holds up. You both know it holds up.', effects: { fame: 4, cred: 4, creativity: 2 } },
          incredible: { text: 'They post the encounter — “found my hero buying pasta, still radiates it” — and the internet remembers you all at once, fondly, at scale.', effects: { fame: 10, cred: 5, network: 4 } },
        },
      },
      right: {
        label: '“People say I look like them.”',
        governingStats: { creativity: 0.8 },
        tags: ['risky', 'indie'],
        outcomes: {
          bad: { text: 'They squint. “No. It’s you. Why would you—” The denial becomes the story their group chat gets. Faded AND weird now. Great.', effects: { cred: -2, burnout: 3 } },
          good: { text: 'The bit works. You leave as a mystery instead of a memory, which is a better costume for what you’re about to do.', effects: { creativity: 4, cred: 3 } },
          incredible: { text: '“Huh. The resemblance is unreal.” They walk away. You stand in aisle 6, gloriously unwitnessed, already writing the first song of the second act in your head.', effects: { creativity: 7, cred: 4, burnout: -4 } },
        },
      },
    },
  },
  {
    id: 'cb_nostalgia_fest', act: 2, pathAffinity: [], weight: 12,
    requires: { flagsAll: ['comeback'] },
    art: 'ev_cb_fest', context: 'REWIND FEST (they used the old logo)',
    prompt: 'The nostalgia festival wants you — 4:30 p.m. slot, “Legends Stage,” between a band that had one summer and a band that had one song. The check is genuinely good. The font on the poster is genuinely cruel.',
    tags: ['live', 'deal'],
    choices: {
      left: {
        label: 'Take the legends slot',
        minigame: 'prompter',
        governingStats: { network: 0.7, skill: 0.6 },
        tags: ['live', 'mainstream'],
        outcomes: {
          bad: { text: 'The crowd sings the old hit and checks their phones through the new material. You cash the check in a parking lot that smells like 2014.', effects: { money: 350, fame: 6, cred: -3, burnout: 6 } },
          good: { text: 'You play the old hit LAST instead of first — and the new stuff earns its place in the set on merit. A few thousand people update their memory of you in real time.', effects: { money: 400, fame: 10, cred: 3, burnout: 5 } },
          incredible: { text: 'Your 4:30 slot outdraws the headliner. The festival trends with your name attached to the word “still.” STILL. The most underrated word in music.', effects: { money: 450, fame: 18, cred: 5, network: 4, burnout: 5, pathProgress: 1 } },
        },
      },
      right: {
        label: 'Decline. No museums.',
        governingStats: { cred: 0.9 },
        tags: ['indie', 'risky'],
        outcomes: {
          bad: { text: 'You skip the check and play a new-material set to forty people the same night. Six of them get it. Six is a start. Six is also six.', effects: { cred: 5, creativity: 3, money: -40 } },
          good: { text: '“Not a nostalgia act” becomes your whole positioning, and positioning is half of a comeback. The other half is the songs, which — conveniently — you’re writing.', effects: { cred: 7, creativity: 4, fame: 3 } },
          incredible: { text: 'The refusal quote gets picked up: “I’m not done, so I can’t look back yet.” REWIND FEST offers double next year. You’ll be too busy. You can feel it.', effects: { cred: 9, creativity: 4, fame: 7, pathProgress: 1 } },
        },
      },
    },
  },
  {
    id: 'cb_fan_exec', act: 2, pathAffinity: [], weight: 12,
    requires: { flagsAll: ['comeback'] },
    art: 'ev_cb_exec', context: 'A label office. The gold record on the wall is YOURS.',
    prompt: 'The exec across the desk was front row at your third-ever show — they can prove it, they have the ticket stub laminated. Now they run A&R. “I signed this job because of you. So. What do you want to do with the second act?”',
    tags: ['deal', 'network'],
    choices: {
      left: {
        label: 'Everything. Full relaunch.',
        governingStats: { network: 0.9 },
        tags: ['deal', 'mainstream', 'risky'],
        outcomes: {
          bad: { text: 'The relaunch plan has fourteen slides and your old font. Committees form. The stub stays laminated; the momentum doesn’t.', effects: { network: 4, fame: 4, burnout: 6 } },
          good: { text: 'They build you a real runway — budget, band, patience. “I’ve waited years to do this right,” they say, and mean it.', effects: { network: 7, fame: 8, money: 250, pathProgress: 1 } },
          incredible: { text: 'The relaunch works because it isn’t one — it’s a debut with better scars. The exec cries at the release show, holding the stub. You sign it.', effects: { network: 9, fame: 14, money: 350, cred: 4, pathProgress: 2 } },
        },
      },
      right: {
        label: '“Just studio time. No announcements.”',
        governingStats: { creativity: 0.8, cred: 0.5 },
        tags: ['studio', 'indie'],
        outcomes: {
          bad: { text: 'Quiet studio time produces quiet demos. Good ones. But the exec’s boss asks what the line item is FOR, monthly, in bold.', effects: { creativity: 5, cred: 2, burnout: 3 } },
          good: { text: 'Six weeks of unannounced work. No expectations, no font, no slides. Just the sound of you finding out what you’re like now. Turns out: better.', effects: { creativity: 7, skill: 3, cred: 4 } },
          incredible: { text: 'What comes out of the quiet room needs no relaunch — it leaks itself into the world on quality alone. The exec frames a NEW stub. Release show, front row.', effects: { creativity: 10, cred: 6, fame: 8, pathProgress: 1 } },
        },
      },
    },
  },
  // ═══════════ THE MONTAGE (3-city world tour chain) ═══════════
  {
    id: 'wt_offer', act: 3, pathAffinity: [], weight: 10,
    requires: { fameMin: 40 },
    art: 'ev_wt_offer', context: 'A routing sheet with three impossible cities',
    prompt: 'The offer: three cities, three nights, three flights. Tokyo, Berlin, São Paulo. No days off, no soundchecks longer than an hour, no promises about your circadian rhythm ever recovering.',
    tags: ['tour', 'live'],
    choices: {
      left: {
        label: 'Three cities. Three nights. Go.',
        governingStats: { network: 0.7, skill: 0.5 },
        tags: ['tour', 'risky'],
        outcomes: {
          bad: { text: 'The visas clear at the last possible hour. Your bag does not make the first flight. Tokyo will be played in yesterday’s shirt.', effects: { burnout: 4, money: 100, chainEventId: 'wt_tokyo' } },
          good: { text: 'Everything books clean. Somewhere over the Pacific you realize you’re grinning at a spreadsheet. The spreadsheet says TOKYO in bold.', effects: { burnout: 3, money: 150, chainEventId: 'wt_tokyo' } },
          incredible: { text: 'The promoter upgrades the whole run sight unseen — “the numbers say you’re about to be worth it.” The numbers have never been romantic before.', effects: { burnout: 3, money: 250, fame: 3, chainEventId: 'wt_tokyo' } },
        },
      },
      right: {
        label: 'Decline. Protect the finale.',
        governingStats: { cred: 0.8 },
        tags: ['safe', 'rest'],
        outcomes: {
          bad: { text: 'You pass, and spend the week watching other artists’ tour clips at 1 a.m., which is not resting, technically.', effects: { burnout: -4, fame: -2 } },
          good: { text: 'You stay, sleep, and finish what needed finishing. The cities will still be there. That’s the thing about cities.', effects: { burnout: -10, creativity: 3 } },
          incredible: { text: 'The week at home produces the thing you’d have missed at 30,000 feet. The promoter reschedules for next year — headline size.', effects: { burnout: -10, creativity: 5, network: 3 } },
        },
      },
    },
  },
  {
    id: 'wt_tokyo', act: 3, pathAffinity: [], weight: 0, chainOnly: true,
    art: 'ev_wt_tokyo', context: 'NIGHT ONE — Tokyo, 400-cap, sold out',
    prompt: 'The Tokyo crowd listens like a studio: total silence in the verses, detonation between songs. Someone holds up a hand-painted sign with a lyric you almost cut from the second album.',
    tags: ['tour', 'live'],
    choices: {
      left: {
        label: 'Play the almost-cut song for the sign',
        governingStats: { creativity: 0.7, cred: 0.5 },
        tags: ['live', 'indie'],
        outcomes: {
          bad: { text: 'You half-remember the bridge — it’s been years — and the sign-holder sings the half you drop. The room decides this was the best possible version. Rooms are kind here.', effects: { fame: 5, cred: 3, burnout: 6, chainEventId: 'wt_berlin' } },
          good: { text: 'The deep cut lands like a single. The sign-holder cries. You cry slightly, professionally, into the stage lights. Night one: perfect.', effects: { fame: 8, cred: 5, burnout: 5, chainEventId: 'wt_berlin' } },
          incredible: { text: 'The whole room knows the almost-cut song. ALL the words. A song you nearly deleted has a second life on the other side of the planet. You board the next flight changed.', effects: { fame: 12, cred: 6, creativity: 3, burnout: 5, chainEventId: 'wt_berlin' } },
        },
      },
      right: {
        label: 'Stick to the setlist. Discipline.',
        governingStats: { skill: 0.9 },
        tags: ['live', 'safe'],
        outcomes: {
          bad: { text: 'Tight set, jet-lagged hands. You play well and remember little. The sign goes home unplayed, which follows you onto the flight.', effects: { skill: 3, fame: 5, burnout: 7, chainEventId: 'wt_berlin' } },
          good: { text: 'The set is a machine and Tokyo loves machines with feelings. After the show you sign the sign. Compromise: elegant.', effects: { skill: 4, fame: 8, burnout: 5, chainEventId: 'wt_berlin' } },
          incredible: { text: 'Flawless night one — the kind that makes the crew walk taller at load-out. The promoter texts Berlin: “tape every night.”', effects: { skill: 5, fame: 10, cred: 3, burnout: 5, chainEventId: 'wt_berlin' } },
        },
      },
    },
  },
  {
    id: 'wt_berlin', act: 3, pathAffinity: [], weight: 0, chainOnly: true,
    art: 'ev_wt_berlin', context: 'NIGHT TWO — Berlin, converted power station, 2 a.m. slot',
    prompt: 'Berlin does not clap between songs; Berlin nods. The room is concrete and fog and one thousand people conserving their approval. Your body believes it is four different times of day, all of them wrong.',
    tags: ['tour', 'live'],
    choices: {
      left: {
        label: 'Go long. Give them the 2 a.m. set.',
        minigame: 'crowd',
        governingStats: { creativity: 0.7, skill: 0.5 },
        tags: ['live', 'electronic', 'risky'],
        outcomes: {
          bad: { text: 'You stretch the songs into the fog until one of them stops being a song. The nodding continues, unreadable. Later you learn the nodding meant it was the best night of the run. Berlin.', effects: { fame: 6, cred: 5, burnout: 9, chainEventId: 'wt_saopaulo' } },
          good: { text: 'The ten-minute version finds a groove the three-minute version never knew it had. The fog machine operator — a legend, apparently — salutes you.', effects: { fame: 8, creativity: 5, cred: 4, burnout: 8, chainEventId: 'wt_saopaulo' } },
          incredible: { text: 'At 3:40 a.m. the room stops nodding and starts MOVING, which the promoter says happens twice a year. A techno label asks about remix stems before you’re offstage.', effects: { fame: 12, creativity: 6, cred: 5, money: 150, burnout: 8, chainEventId: 'wt_saopaulo' } },
        },
      },
      right: {
        label: 'Tight set, then actually sleep',
        governingStats: { cred: 0.7 },
        tags: ['live', 'safe', 'rest'],
        outcomes: {
          bad: { text: 'You play the hour and leave. The hotel pillow is a miracle of German engineering. You dream in soundcheck tones. It counts as rest. Barely.', effects: { fame: 5, burnout: 2, chainEventId: 'wt_saopaulo' } },
          good: { text: 'The discipline holds: great hour, real sleep, and dawn over the Spree from the right side of a window for once. São Paulo will get a functioning human.', effects: { fame: 7, cred: 3, burnout: -2, chainEventId: 'wt_saopaulo' } },
          incredible: { text: 'The short set reads as confidence and Berlin respects nothing more. “No encore,” writes the city’s hardest critic, “because none was needed.” You sleep nine hours. NINE.', effects: { fame: 9, cred: 5, burnout: -4, chainEventId: 'wt_saopaulo' } },
        },
      },
    },
  },
  {
    id: 'wt_saopaulo', act: 3, pathAffinity: [], weight: 0, chainOnly: true,
    art: 'ev_wt_sp', context: 'NIGHT THREE — São Paulo, outdoor, rain arriving',
    prompt: 'São Paulo sings everything — the words, the guitar lines, the drum fills. The rain starts during your third song and not one person leaves. This is the night the montage was building to. Your hands know it.',
    tags: ['tour', 'live'],
    choices: {
      left: {
        label: 'Play THROUGH the rain. All of it.',
        governingStats: { skill: 0.6, cred: 0.6 },
        tags: ['live', 'risky'],
        outcomes: {
          bad: { text: 'The rain wins the sound war by the last song, so the crowd sings the finale FOR you, five thousand voices to your dead monitors. You conduct it, soaked, laughing. A failure indistinguishable from triumph.', effects: { fame: 10, cred: 6, burnout: 8, pathProgress: 1 } },
          good: { text: 'Soaked strings, slipping picks, and the best show of the year. The photo — you, arms out, rain lit gold by the rig — is everywhere by morning.', effects: { fame: 15, cred: 7, burnout: 7, pathProgress: 1, chartTitle: 'Night Three (Rain Version)' } },
          incredible: { text: 'The storm peaks at the bridge and the entire crowd sings INTO it, and for one minute the weather is your backing choir. People will lie about having been here. Thousands will be telling the truth.', effects: { fame: 22, cred: 8, creativity: 4, burnout: 7, pathProgress: 2, chartTitle: 'Night Three (Rain Version)' } },
        },
      },
      right: {
        label: 'Cut it short, save the gear, promise a return',
        governingStats: { network: 0.8 },
        tags: ['deal', 'safe'],
        outcomes: {
          bad: { text: 'The crowd boos the rain, not you — but the difference is academic from the stage. The promise of a return show is met with the skepticism of a city that has heard promises.', effects: { fame: 5, network: 2, burnout: 4 } },
          good: { text: 'You call it at the right moment, protect the crew, and announce the return date FROM the stage — already booked, already real. Professional weather management. The city forgives.', effects: { fame: 8, network: 5, money: 100, burnout: 3 } },
          incredible: { text: 'The shortened set becomes a legend of restraint — and the announced return show sells out in an hour, in the rain, from phones held under jackets. You owe São Paulo a night. São Paulo intends to collect.', effects: { fame: 12, network: 7, money: 200, burnout: 3, pathProgress: 1 } },
        },
      },
    },
  },
  // ═══════════ THE COLLAB (a Hot 10 artist steps out of the chart) ═══════════
  {
    id: 'cl_dm', act: 2, pathAffinity: [], weight: 11,
    requires: { fameMin: 25, flagsNone: ['collab', 'collab_declined'] },
    art: 'ev_cl_dm', context: 'A verified account has entered your DMs',
    prompt: '{collabArtist} — currently ON the Hot 10, you have checked twice — wants you on a track. The demo attached is 40 seconds long and one of those seconds is unmistakably a gap labeled YOU.',
    tags: ['deal', 'network'],
    choices: {
      left: {
        label: 'Politely decline. Do your own thing.',
        governingStats: { cred: 0.8 },
        tags: ['indie', 'safe'],
        outcomes: {
          bad: { text: 'You type four drafts of “no thanks” and send the worst one. They reply “all good 🙏” which will haunt you at 3 a.m. for the rest of the act.', effects: { cred: 3, fame: -2, addFlag: 'collab_declined' } },
          good: { text: 'You pass, cleanly and kindly. Your group chat calls it integrity. Your bank account calls it something else.', effects: { cred: 5, creativity: 2, addFlag: 'collab_declined' } },
          incredible: { text: 'Your polite no becomes a screenshot, and the screenshot becomes a personality. “The one who said no to {collabArtist}” is, somehow, a brand.', effects: { cred: 7, fame: 3, addFlag: 'collab_declined' } },
        },
      },
      right: {
        label: 'Take the session. Fill the gap.',
        governingStats: { network: 0.7, creativity: 0.5 },
        tags: ['deal', 'mainstream'],
        outcomes: {
          bad: { text: 'The label sends a rider, an NDA, and a mood board that is just the word WET in nine fonts. You sign everything. The session is Thursday.', effects: { network: 3, burnout: 3, chainEventId: 'cl_session' } },
          good: { text: 'Their manager calls your manager. You do not have a manager, so they call you, and you lower your voice an octave and say “circle back.” The session is Thursday.', effects: { network: 5, fame: 2, chainEventId: 'cl_session' } },
          incredible: { text: 'They post a photo of the empty vocal booth captioned “waiting on somebody 👀” and your name trends regionally before you have sung a note.', effects: { network: 6, fame: 5, chainEventId: 'cl_session' } },
        },
      },
    },
  },
  {
    id: 'cl_session', act: 2, pathAffinity: [], weight: 0, chainOnly: true,
    art: 'ev_cl_session', context: 'THE SESSION — a studio with a snack wall',
    prompt: 'The studio has a snack wall and an engineer who says “vibes” as a complete sentence. {collabArtist} plays the gap again and looks at you. The gap is eight bars wide and shaped exactly like your whole career.',
    tags: ['studio', 'record'],
    choices: {
      left: {
        label: 'Sneak your weird into their hit',
        minigame: 'take',
        governingStats: { creativity: 0.8, cred: 0.4 },
        tags: ['studio', 'risky', 'indie'],
        outcomes: {
          bad: { text: 'Your weird take dies in the label listen-back — “love it, scary, no” — but {collabArtist} keeps a voice memo of it. “For the deluxe,” they say, and weirdly, they mean it.', effects: { creativity: 4, cred: 3, burnout: 3, addFlag: 'collab' } },
          good: { text: 'You do the strange harmony. The engineer says “vibes” twice, which is apparently a rave. It stays in the song. Your fingerprint, at chart scale.', effects: { creativity: 5, cred: 5, fame: 4, addFlag: 'collab', chartTitle: 'The Gap (feat. {collabArtist})' } },
          incredible: { text: 'Your eight bars bend the whole song sideways and everyone in the control room goes quiet the good way. {collabArtist} scraps the old hook to chase yours. It is your song now. Legally it is not. Spiritually it is.', effects: { creativity: 7, cred: 6, fame: 7, hits: 1, addFlag: 'collab', chartTitle: 'The Gap (feat. {collabArtist})' } },
        },
      },
      right: {
        label: 'Deliver exactly what they ordered',
        minigame: 'take',
        governingStats: { skill: 0.8, network: 0.4 },
        tags: ['studio', 'safe', 'mainstream'],
        outcomes: {
          bad: { text: 'You nail the part in two takes, which turns out to be a problem — the day was booked for six hours and now everyone has to hang out. You learn a lot about {collabArtist}’s juicer.', effects: { skill: 3, network: 3, money: 100, addFlag: 'collab' } },
          good: { text: 'Clean, professional, on the beat, off the clock. The check clears the same week, which you did not know checks could do.', effects: { skill: 4, network: 4, money: 200, fame: 3, addFlag: 'collab', chartTitle: 'Circle Back (feat. {collabArtist})' } },
          incredible: { text: 'You give them radio-perfect and then one extra take “for fun” — the fun take makes the single. The credits say featuring. The group chat says CARRIED.', effects: { skill: 5, network: 5, money: 300, fame: 6, hits: 1, addFlag: 'collab', chartTitle: 'Circle Back (feat. {collabArtist})' } },
        },
      },
    },
  },
  {
    id: 'cl_reprise', act: 3, pathAffinity: [], weight: 12,
    requires: { flagsAll: ['collab'] },
    art: 'ev_cl_reprise', context: 'A familiar verified account, again',
    prompt: '{collabArtist} is in town the night of your show and their DM is just “👀🎤?”. Surprise guests are either the best 90 seconds of a set or a soundcheck horror story. There is no third outcome.',
    tags: ['live', 'network'],
    choices: {
      left: {
        label: 'Bring them out. No rehearsal. Chaos.',
        governingStats: { network: 0.6, creativity: 0.6 },
        tags: ['live', 'risky'],
        outcomes: {
          bad: { text: 'They come out to a wall of phones, forget which verse is theirs, and sing yours WITH you, in a different key. The clip is a disaster. The clip is also everywhere.', effects: { fame: 6, cred: -2, burnout: 4 } },
          good: { text: 'The room figures out who it is one gasp at a time. You do the song, trade the bridge, and hug like it’s rehearsed. It is not rehearsed. That’s the whole magic.', effects: { fame: 9, network: 4, burnout: 3 } },
          incredible: { text: 'Ninety perfect seconds. The crowd sings the featured part louder than either of you, and {collabArtist} points at you on the way off like a wrestler passing a title. The venue posts it before you reach the greenroom.', effects: { fame: 13, network: 6, cred: 3, burnout: 3 } },
        },
      },
      right: {
        label: 'Keep the set yours. Dinner instead.',
        governingStats: { cred: 0.7 },
        tags: ['safe', 'network'],
        outcomes: {
          bad: { text: 'Dinner is nice until their entourage arrives and the table becomes a content shoot. You are background in four stories, tagged in none.', effects: { network: 2, burnout: -2 } },
          good: { text: 'You skip the stunt and eat noodles with someone who is on the chart you are climbing. They tell you which numbers are fake. Most of them. It is the most useful meal of your career.', effects: { network: 5, cred: 3, burnout: -4 } },
          incredible: { text: 'Over dinner they slide you a producer’s number and say “tell them I sent you — that sentence is worth more than the feature was.” They are correct.', effects: { network: 7, cred: 4, burnout: -4, pathProgress: 1 } },
        },
      },
    },
  },
  {
    id: 'cl_regret', act: 3, pathAffinity: [], weight: 12,
    requires: { flagsAll: ['collab_declined'] },
    art: 'ev_cl_regret', context: 'Every speaker in every store, apparently',
    prompt: 'The track you turned down is out. The gap you were supposed to fill? {rival} filled it. It is inescapable, it is fine — objectively it is just fine — and it is currently outcharting you from inside a pharmacy sound system.',
    tags: ['fame', 'rival'],
    choices: {
      left: {
        label: 'Say nothing. Let the work talk.',
        governingStats: { cred: 0.8 },
        tags: ['safe', 'indie'],
        outcomes: {
          bad: { text: 'You say nothing so hard that an interviewer asks about it, and your face does the talking. The freeze-frame becomes a reaction meme. The meme outcharts you too.', effects: { cred: 2, fame: 2, rivalry: 1 } },
          good: { text: 'You keep quiet and keep working. Weeks later {collabArtist} likes an old post of yours at 2 a.m. — the industry equivalent of a formal apology.', effects: { cred: 5, creativity: 3 } },
          incredible: { text: 'Your silence reads as mystique. A profile calls you “the feature that got away,” and suddenly your no is worth more than {rival}’s yes. Scarcity: it works.', effects: { cred: 7, fame: 5, network: 3 } },
        },
      },
      right: {
        label: 'Post the original demo. Receipts.',
        governingStats: { network: 0.7, creativity: 0.6 },
        tags: ['social', 'risky', 'rival'],
        outcomes: {
          bad: { text: 'You post the demo with the caption “v1 🙂” and the internet does not find it as devastating as you did. {rival} replies with one (1) trophy emoji. You have been out-petied.', effects: { fame: 3, cred: -3, rivalry: 2, burnout: 3 } },
          good: { text: 'The demo splits the comments into civil war — team Original versus team Radio. Both teams stream both versions to argue better. Everybody wins, especially the label.', effects: { fame: 7, network: 3, rivalry: 1 } },
          incredible: { text: 'Your 40-second demo goes viral as “the version they were scared of.” {collabArtist} reposts it. {rival} posts a lengthy statement, which is how you know you won.', effects: { fame: 11, cred: 4, rivalry: 2, chartTitle: 'V1 (Demo)' } },
        },
      },
    },
  },

  // ═══════════ BANDMATE SPOTLIGHTS (require specific members) ═══════════
  {
    id: 'bs_ludo_parade', act: [2, 3], pathAffinity: [], weight: 9,
    requires: { bandHas: 'ludo' },
    art: 'ev_bs_parade', context: 'Ludo, holding a flyer he clearly designed',
    prompt: '“Great news. We’re in the harvest parade Saturday. I told them we have a float. We do not have a float. We have a van and BELIEF.” Ludo has already ordered streamers. Non-refundable streamers.',
    tags: ['live', 'band'],
    choices: {
      left: {
        label: 'Build the float. March.',
        governingStats: { network: 0.6, creativity: 0.6 },
        tags: ['live', 'mainstream', 'risky'],
        outcomes: {
          bad: { text: 'The “float” is the van with streamers and Ludo on the roof, which is illegal in this county. The band plays a moving set while you negotiate with a parade marshal at walking speed. The kids love it. The marshal does not.', effects: { fame: 5, network: 2, money: -40, burnout: 4 } },
          good: { text: 'Somewhere between the marching band and the tractor club, your van-float finds its audience: everyone. Ludo’s horn bounces off Main Street brick like the town was built for it. Three hundred people hear you by accident and stay on purpose.', effects: { fame: 9, network: 4, cred: 2, burnout: 3 } },
          incredible: { text: 'The local news leads with your float. LEADS with it. Ludo, shirtless in a harvest crown, becomes a regional meme, and the clip drags your streaming numbers up with it. The parade committee sends a thank-you card and next year’s contract.', effects: { fame: 15, network: 5, money: 100, burnout: 3 } },
        },
      },
      right: {
        label: 'No float. Ludo goes alone.',
        governingStats: { cred: 0.8 },
        tags: ['safe', 'band'],
        outcomes: {
          bad: { text: 'Ludo marches alone with three horns and plays your whole set solo, introducing every song with “this one’s by my band, who are RESTING.” The town now believes you are gravely ill. Flowers arrive.', effects: { fame: 3, cred: -1, burnout: -3 } },
          good: { text: 'Ludo solos the parade and returns at dusk, hoarse and triumphant, with forty new mailing-list signups written on a pizza box. You rested. The brand marched on.', effects: { fame: 5, network: 3, burnout: -5 } },
          incredible: { text: 'Ludo, alone, wins “Best Float.” There was no float. The judges cite “irrepressible spirit.” The trophy lives in the van now, buckled into its own seat, and morale is up 40% indefinitely.', effects: { fame: 7, network: 4, cred: 3, burnout: -5 } },
        },
      },
    },
  },
  {
    id: 'bs_greta_archive', act: [2, 3], pathAffinity: [], weight: 9,
    requires: { bandHas: 'greta' },
    art: 'ev_bs_archive', context: 'Greta, reverent, holding a labeled reel',
    prompt: '“Night 14. The power cut out, you all kept playing in the dark, and I had the ribbon mic open.” Greta presses play. It’s the best your band has ever sounded, and nobody was trying. “So. What do we do with it?”',
    tags: ['record', 'band'],
    choices: {
      left: {
        label: 'Release the blackout tape, raw',
        governingStats: { cred: 0.8, creativity: 0.4 },
        tags: ['record', 'indie', 'risky'],
        outcomes: {
          bad: { text: 'The internet’s verdict: “sounds like it was recorded in the dark.” Correct. Sixty people understand it completely, and they are now your sixty favorite people.', effects: { cred: 4, fame: 1, hits: 0 } },
          good: { text: '“The Blackout Tape” becomes the thing fans hand each other like contraband. No single, no video, no daylight — just a room breathing in the dark. Cred compounds nightly.', effects: { cred: 7, fame: 3, creativity: 2 } },
          incredible: { text: 'A taste-making radio host plays the whole tape uninterrupted and says nothing after — dead air as review. It charts on word of mouth alone. Greta labels the next reel “Night 15?” with a smile you can hear.', effects: { cred: 9, fame: 6, creativity: 3, chartTitle: 'The Blackout Tape' } },
        },
      },
      right: {
        label: 'Keep it. Some tapes are for the band.',
        governingStats: { cred: 0.6, network: 0.5 },
        tags: ['band', 'safe'],
        outcomes: {
          bad: { text: 'You listen once, together, in the van. Moss cries into a burrito. It never leaves the archive, and some Tuesdays that feels like a mistake. Most Tuesdays it feels like a vow.', effects: { cred: 3, burnout: -3 } },
          good: { text: 'The tape becomes band-only canon — played once a tour, lights off, engine ticking. Whatever glues bands together, you just bottled some. It shows up onstage as trust.', effects: { cred: 4, network: 4, burnout: -4 } },
          incredible: { text: 'Years of bands break up over less than what’s on that reel. Keeping it private becomes the band’s founding myth — the show you’ll never sell. Every future negotiation is easier, because everyone knows there’s a thing you won’t.', effects: { cred: 6, network: 5, burnout: -4, pathProgress: 1 } },
        },
      },
    },
  },
  {
    id: 'bs_saul_clause', act: [2, 3], pathAffinity: [], weight: 9,
    requires: { bandHas: 'saul' },
    art: 'ev_bs_clause', context: 'Saul, at the merch table, wearing reading glasses like a weapon',
    prompt: '“Fun fact.” Saul slides over the venue contract you signed months ago. “Clause 9(c): they owe you a percentage of BAR SALES on sellouts. You’ve sold out twice. They’re hoping nobody reads.” Saul read.',
    tags: ['deal', 'band'],
    choices: {
      left: {
        label: 'Enforce it. Every cent.',
        governingStats: { network: 0.7, cred: 0.4 },
        tags: ['deal', 'risky'],
        outcomes: {
          bad: { text: 'The venue pays — in singles, out of spite, delivered in a bucket. You are now “the bucket band” to every promoter in a forty-mile radius. The money spends fine. The nickname sticks worse.', effects: { money: 220, network: -2, cred: 1 } },
          good: { text: 'Saul sends one email with the phrase “per our agreement” and the money appears like magic. The venue treats you with the wary respect owed to a band with representation. You do not correct them.', effects: { money: 300, cred: 3, network: 2 } },
          incredible: { text: 'Saul negotiates back-pay PLUS a rider upgrade PLUS the clause staying in future contracts, all while eating a complimentary sandwich the venue suddenly provides. Other bands start asking who “your guy” is. Your guy plays keys.', effects: { money: 450, cred: 4, network: 4, pathProgress: 1 } },
        },
      },
      right: {
        label: 'Trade it for future favors',
        governingStats: { network: 1.0 },
        tags: ['network', 'safe'],
        outcomes: {
          bad: { text: 'You waive the money for “a good relationship.” The venue’s definition of a good relationship turns out to be remembering your name at load-in. Saul writes “LESSON” on a napkin and files it.', effects: { network: 2, cred: 1 } },
          good: { text: 'You trade the back-pay for first pick of weekend dates and the good greenroom — the one with a door. Saul calls it “consideration.” The calendar calls it three prime Saturdays.', effects: { network: 5, fame: 3, burnout: -3 } },
          incredible: { text: 'The venue owner, disarmed by mercy with paperwork attached, becomes your loudest advocate — booking you forward a full season and telling every promoter friend “these people are PROFESSIONALS.” Saul frames the waived invoice as art.', effects: { network: 8, fame: 4, cred: 3, burnout: -3 } },
        },
      },
    },
  },
  {
    id: 'bs_fish_van', act: [2, 3], pathAffinity: [], weight: 9,
    requires: { bandHas: 'fish' },
    art: 'ev_bs_van', context: 'Mile 40,012. A new sound from the engine.',
    prompt: 'The van makes a sound vans do not recover from. Fish pulls over, listens with a mechanic’s grief, and says the sentence you’ve been dreading for two acts: “It’s her transmission or our next month of gigs.”',
    tags: ['tour', 'band'],
    choices: {
      left: {
        label: 'Save the van. It’s family.',
        governingStats: { cred: 0.7, network: 0.5 },
        tags: ['band', 'safe'],
        cost: 200,
        outcomes: {
          bad: { text: 'The transmission costs the $200 and then finds friends: belts, bearings, a mystery hose. Fish does half the labor himself, cursing tenderly. The van lives. Barely. Like all of you.', effects: { money: -200, burnout: 4, cred: 3 } },
          good: { text: 'The shop fixes her right. First highway mile after, Fish pats the dash without a word, and the whole van pretends not to see it. Morale: unmeasurable. Also measurable: +every show you don’t cancel.', effects: { money: -200, cred: 5, network: 3, burnout: -4 } },
          incredible: { text: 'The mechanic turns out to be a fan — of FISH, from his roadie decades. “You carried half this scene’s gear.” Parts at cost, labor free, one signed setlist. The van purrs like the year she was born.', effects: { money: -80, cred: 6, network: 5, burnout: -5 } },
        },
      },
      right: {
        label: 'Let her go. Rent a box truck.',
        governingStats: { network: 0.8 },
        tags: ['deal', 'risky'],
        outcomes: {
          bad: { text: 'Fish agrees with the math and hates every digit of it. He keeps the gearshift knob. The rental smells like nothing, which is somehow worse than smelling like Fish’s van.', effects: { money: 60, network: 2, burnout: 5 } },
          good: { text: 'You sell her to a young band for cheap, on the condition they keep the name painted on the side. Fish inspects their drummer’s attitude first. The lineage continues.', effects: { money: 150, network: 4, cred: 3 } },
          incredible: { text: 'The young band’s first tour in her goes viral — “THE van” becomes scene shorthand — and Fish becomes godfather to a second generation of vans. He allows exactly one (1) documentary interview about it.', effects: { money: 150, network: 6, cred: 5, fame: 4 } },
        },
      },
    },
  },
  {
    id: 'bs_tanya_empire', act: [2, 3], pathAffinity: [], weight: 9,
    requires: { bandHas: 'tanya' },
    art: 'ev_bs_merch', context: 'The trunk no longer closes.',
    prompt: 'Tanya’s merch operation has outgrown the trunk, the backseat, and plausibly the law. “I need a decision,” she says, holding spreadsheets. “We go legit — LLC, webstore, fulfillment — or I keep doing crimes of scale out of a Honda.”',
    tags: ['deal', 'band'],
    choices: {
      left: {
        label: 'Go legit. Tanya gets a title.',
        governingStats: { network: 0.8 },
        tags: ['deal', 'safe'],
        cost: 120,
        outcomes: {
          bad: { text: 'The paperwork takes a month and the webstore crashes on launch night. Tanya fixes it by 2 a.m., adds a “crash survivor” tee to the store by 3, and sells forty of them by dawn.', effects: { money: -120, network: 3, grantHustle: 'merch_line' } },
          good: { text: 'MERCH DIRECTOR, says her new email signature, and the numbers agree: legit Tanya moves triple the units. The Honda is retired with honors and one final full trunk.', effects: { money: -120, network: 4, grantHustle: 'merch_line', cred: 2 } },
          incredible: { text: 'Tanya’s designs start selling to people who’ve never heard the music — the shirts are simply GOOD now. A boutique asks to stock them. You are, income-wise, briefly a fashion label with a band attached.', effects: { money: -120, fame: 6, network: 5, grantHustle: 'merch_line', cred: 3 } },
        },
      },
      right: {
        label: 'Stay Honda-core. It’s the brand.',
        governingStats: { cred: 0.8 },
        tags: ['indie', 'risky'],
        outcomes: {
          bad: { text: 'The trunk economy hits its ceiling the night two hundred people want shirts and Tanya has sixty. She invents the “merch IOU,” which is illegal-adjacent and beloved.', effects: { cred: 4, money: 60, burnout: 3 } },
          good: { text: '“Trunk exclusive” becomes a thing people line up for. Scarcity, authenticity, and a hatchback: the whole indie economy in one parking lot.', effects: { cred: 6, money: 100, network: 3 } },
          incredible: { text: 'A business podcast does an episode on “the Honda model.” Tanya declines the interview, which makes it legend. The trunk stays. The line grows. The mystery compounds.', effects: { cred: 8, money: 140, fame: 5, network: 3 } },
        },
      },
    },
  },
  {
    id: 'bs_pearl_checkin', act: [2, 3], pathAffinity: [], weight: 9,
    requires: { bandHas: 'pearl' },
    art: 'ev_bs_pearl', context: 'Pearl, in the doorway, arms crossed. Kindly.',
    prompt: 'You’ve rewritten the same eight bars for three hours. Pearl has been watching from the doorway for the last ten minutes. “Two options,” she says. “We take a walk right now, or I start singing your part until you cry. I know which note does it.”',
    tags: ['band', 'rest'],
    choices: {
      left: {
        label: 'Take the walk',
        governingStats: { cred: 0.6 },
        tags: ['rest', 'safe'],
        outcomes: {
          bad: { text: 'You walk four blocks arguing that you’re FINE, which Pearl allows, nodding, until you run out of fine around block five and just talk. She buys the coffees. She always buys the coffees.', effects: { burnout: -8, cred: 2 } },
          good: { text: 'Forty minutes, no music talk allowed — Pearl’s rule. On the way back the eight bars solve themselves in your head, the way they always do the second you stop gripping them.', effects: { burnout: -12, creativity: 4 } },
          incredible: { text: 'The walk ends on a bridge at golden hour, and Pearl hums the harmony she’s been hearing for your broken eight bars this whole time. It was never a rewrite problem. It was a duet.', effects: { burnout: -14, creativity: 6, skill: 2 } },
        },
      },
      right: {
        label: '“Sing it, then. Do your worst.”',
        governingStats: { creativity: 0.8 },
        tags: ['vocal', 'risky'],
        outcomes: {
          bad: { text: 'She sings it. She finds the note — THE note — by bar two. You cry in front of your whole band, who politely study the ceiling. The eight bars, for the record: fixed.', effects: { creativity: 5, burnout: -6, cred: -1 } },
          good: { text: 'She sings your part better than you wrote it and worse than you’ll now rewrite it — which was, obviously, the entire plan. Pearl winks and returns to her book.', effects: { creativity: 7, skill: 2, burnout: -5 } },
          incredible: { text: 'The take of Pearl singing your unfinished part — captured by Moss, allegedly by accident — becomes the album’s hidden track. Nobody speaks during it at shows. Nobody ever will.', effects: { creativity: 9, cred: 4, burnout: -6, chartTitle: 'Eight Bars (Pearl’s Version)' } },
        },
      },
    },
  },
  // ═══════════ THE LAST DOOR (guaranteed path climaxes) ═══════════
  {
    id: 'finale_label_meeting', act: 3, pathAffinity: ['megastar'], weight: 10, finaleCard: true,
    art: 'ev_last_meeting', context: 'The 40th floor. The good conference room.',
    prompt: 'The deal is on the table: global push, stadium routing, your face on things you haven’t imagined yet. Clause 14 is about your masters. The pen is heavier than it looks. Everyone is smiling.',
    tags: ['deal', 'fame'],
    choices: {
      left: {
        label: 'Sign everything. Go supernova.',
        governingStats: { network: 0.9 },
        tags: ['deal', 'mainstream', 'risky'],
        outcomes: {
          bad: { text: 'You sign. The machine turns on. It is enormous and impersonal and it works — for the label. Your song plays everywhere; clause 14 hums beneath it like a fridge.', effects: { fame: 14, money: 400, cred: -6, burnout: 6 } },
          good: { text: 'You sign, eyes open. The rocket takes off with you strapped to the outside. It’s everything you wanted, at the price you agreed to, which is the best deal anyone gets up here.', effects: { fame: 22, money: 600, cred: -3, network: 5, pathProgress: 1 } },
          incredible: { text: 'You sign — after your lawyer rewrites clause 14 at the table while the room pretends not to sweat. The push is global AND the masters revert. They frame the pen. So do you.', effects: { fame: 30, money: 700, network: 7, cred: 3, pathProgress: 2 } },
        },
      },
      right: {
        label: 'Own your masters. Walk.',
        governingStats: { cred: 0.9 },
        tags: ['deal', 'indie', 'risky'],
        outcomes: {
          bad: { text: 'You walk. The elevator ride down is very long and very quiet. Independence is real, and so is the marketing budget you just declined.', effects: { cred: 7, fame: -3, burnout: 4 } },
          good: { text: 'You walk, and the story of the walk travels further than the deal would have. “The one who kept everything” is a durable brand. You own every note of it.', effects: { cred: 9, fame: 8, network: 3, pathProgress: 1 } },
          incredible: { text: 'You walk — into a distribution deal on YOUR terms by Friday. The 40th floor calls back with clause 14 deleted. You let it ring once. Just once.', effects: { cred: 10, fame: 14, money: 300, network: 5, pathProgress: 2 } },
        },
      },
    },
  },
  {
    id: 'finale_the_call', act: 3, pathAffinity: ['studio'], weight: 10, finaleCard: true,
    art: 'ev_last_call', context: '3:11 a.m. Unknown number. You know exactly who it is.',
    prompt: '“One take. Tonight. The record ships Friday and the part doesn’t exist yet. Everyone says you’re the call.” Behind the voice: the biggest artist alive, humming the hole in their song.',
    tags: ['studio'],
    choices: {
      left: {
        label: 'Go. Be the call.',
        minigame: 'take',
        governingStats: { skill: 1.0 },
        tags: ['studio', 'risky'],
        outcomes: {
          bad: { text: 'You get there and the part fights you for two hours before it gives in. What ships is good — honest, road-worn good — and the room remembers you were there at 3 a.m. That counts. It all counts.', effects: { skill: 5, cred: 5, money: 250, burnout: 8 } },
          good: { text: 'Take one lands. The artist stops humming. The engineer looks up like something walked through the room. “THAT,” says the voice. That is yours.', effects: { skill: 8, cred: 9, money: 350, pathProgress: 1 } },
          incredible: { text: 'The take becomes the moment the record is remembered for. Liner notes, first name, no asterisk. Somewhere a kid slows it down to learn it, the way you once did. The circle closes with you inside it.', effects: { skill: 10, cred: 12, money: 450, fame: 6, pathProgress: 2 } },
        },
      },
      right: {
        label: 'Send Wren. Pass the call on.',
        governingStats: { cred: 0.7, network: 0.7 },
        tags: ['network', 'risky'],
        outcomes: {
          bad: { text: 'Wren freezes for one take, then finds it on the second. The record ships. Your phone learns a new silence — the sound of a torch changing hands slightly before you meant it to.', effects: { cred: 4, network: 3, burnout: -4 } },
          good: { text: 'Wren nails it, and tells the room who taught them the voicing. The industry hears both names in the story forever after. First-call players get old; first-call judgment doesn’t.', effects: { cred: 8, network: 6, burnout: -6, pathProgress: 1 } },
          incredible: { text: 'Wren delivers a take you couldn’t have — and says so, publicly, wrongly, beautifully. The legend that you KNEW, at 3 a.m., outlives every session you ever played. Kingmaker is also a chair.', effects: { cred: 11, network: 9, fame: 5, burnout: -6, pathProgress: 2 } },
        },
      },
    },
  },
  {
    id: 'finale_credits', act: 3, pathAffinity: ['hitfactory'], weight: 10, finaleCard: true,
    art: 'ev_last_credits', context: 'The label president’s office. There’s a view.',
    prompt: '“VP of A&R. Your taste, our machine. You’d never chase a placement again — you’d BE the placement.” On the desk: a contract, a nameplate they already printed, and the exact pen from every deal that ever shelved you.',
    tags: ['deal', 'write'],
    choices: {
      left: {
        label: 'Take the desk. Run the machine.',
        governingStats: { network: 0.9 },
        tags: ['deal', 'mainstream'],
        outcomes: {
          bad: { text: 'You take it. The meetings metastasize. You greenlight other people’s doors all day and drive home humming fragments you’ll never finish. The money is superb. The silence is specific.', effects: { money: 700, network: 8, creativity: -6, burnout: 6 } },
          good: { text: 'You take the desk and use it like a crowbar: every writer you ever shared a shelf with gets a real shot. The machine runs warmer with your hand on it. Some doors you open for others.', effects: { money: 800, network: 10, cred: 4, creativity: -3, pathProgress: 1 } },
          incredible: { text: 'You take the desk AND keep Thursday nights for the vault. Two years later a song escapes it, uncredited, and outcharts your whole roster. Only you know. It’s enough. It’s somehow exactly enough.', effects: { money: 900, network: 10, cred: 6, hits: 1, pathProgress: 2 } },
        },
      },
      right: {
        label: 'Stay a writer. Forever. On purpose.',
        governingStats: { creativity: 0.9 },
        tags: ['write', 'indie', 'risky'],
        outcomes: {
          bad: { text: 'You decline, and the industry hears “difficult.” The rooms cool for a season. You write through it, because that was always the deal you actually signed — the one with yourself.', effects: { creativity: 7, cred: 4, burnout: 4 } },
          good: { text: '“I’m a writer.” The president nods like they lost a bet with themselves. The nameplate goes in a drawer; your next three placements go on the wall. The pen stays on their desk, unused.', effects: { creativity: 9, cred: 7, hits: 1, pathProgress: 1 } },
          incredible: { text: 'You decline in one sentence they later quote in a keynote. The vault opens like a second act: your best year starts at an age the trades call “improbable.” Improbable charts anyway.', effects: { creativity: 12, cred: 9, hits: 2, fame: 6, pathProgress: 2 } },
        },
      },
    },
  },
  // ═══════════════════ THE BAND (recruit & drama) ═══════════════════
  {
    id: 'a1_first_bandmate', act: 1, pathAffinity: [], weight: 9,
    art: 'ev_first_bandmate', context: 'After your set, by the amps',
    prompt: 'A musician you half-know waits by your gear. “I’ve seen you play four times. I know how to fix what’s missing. Let me in.” They are, annoyingly, right about what’s missing.',
    tags: ['network', 'band'],
    choices: {
      left: {
        label: 'Start the band',
        minigame: 'tighten',
        governingStats: { network: 1.0 },
        tags: ['band', 'network'],
        outcomes: {
          bad: { text: 'Your first rehearsal is 10% music, 90% negotiating whose songs count. Still — the 10% has something.', effects: { grantBandmate: 'random', network: 2, burnout: 3 } },
          good: { text: 'The first full run-through locks in halfway through song two. You catch each other grinning. Oh no. It’s a band now.', effects: { grantBandmate: 'random', network: 4, creativity: 2 } },
          incredible: { text: 'By the end of the night you have a shared setlist, a rehearsal schedule, and an inside joke. The sound is twice its old size.', effects: { grantBandmate: 'random', network: 6, creativity: 3, cred: 2 } },
        },
      },
      right: {
        label: 'Stay a solo act',
        governingStats: { creativity: 0.9 },
        tags: ['solo', 'indie'],
        outcomes: {
          bad: { text: 'They join someone else’s band by Friday. That band is suddenly, measurably better. You practice alone, loudly.', effects: { creativity: 3, rivalry: 1 } },
          good: { text: '“It’s a solo project,” you explain. The vision stays whole. The amp stays heavy. Both facts are true.', effects: { creativity: 5, cred: 2 } },
          incredible: { text: 'You channel the almost-band into an arrangement that sounds like four people. The one-person wall of sound gets its own mythology.', effects: { creativity: 7, skill: 3, cred: 3 } },
        },
      },
    },
  },
  {
    id: 'a2_auditions', act: 2, pathAffinity: [], weight: 8,
    art: 'ev_auditions', context: 'Open auditions (you made a flyer)',
    prompt: 'You hold auditions. Eleven people show up: nine are wrong in fascinating ways, one brought a theremin “as a joke,” and one — one is the real thing.',
    tags: ['band', 'network'],
    choices: {
      left: {
        label: 'Hire the real thing',
        governingStats: { network: 0.8, cred: 0.5 },
        tags: ['band'],
        outcomes: {
          bad: { text: 'The real thing has real opinions. Your arrangements are now “conversations.” Growth is loud.', effects: { grantBandmate: 'random', burnout: 4, skill: 2 } },
          good: { text: 'They learn the whole set in two days and improve a third of it. You pretend the changes were your idea. They allow this.', effects: { grantBandmate: 'random', skill: 3, creativity: 2 } },
          incredible: { text: 'First gig together, three people ask if you’ve “always been this good.” You have not. That’s the point.', effects: { grantBandmate: 'random', skill: 3, fame: 5, cred: 3 } },
        },
      },
      right: {
        label: 'Hire the theremin joke person',
        governingStats: { creativity: 1.0 },
        tags: ['band', 'risky', 'indie'],
        outcomes: {
          bad: { text: 'The joke stops being funny at rehearsal three and starts being ART at rehearsal four. In between: chaos.', effects: { grantBandmate: 'random', creativity: 4, cred: -2, burnout: 3 } },
          good: { text: 'The “joke” hands wave and the sound gets 30% stranger and 60% more yours. Correct hire.', effects: { grantBandmate: 'random', creativity: 6, cred: 2 } },
          incredible: { text: 'The theremin bit becomes your live show’s signature moment. Critics call it “committed.” The joke was a door.', effects: { grantBandmate: 'random', creativity: 8, fame: 5, cred: 3 } },
        },
      },
    },
  },
  {
    id: 'a2_stranded_player', act: [2, 3], pathAffinity: [], weight: 7,
    art: 'ev_stranded', context: 'A gas station, 2 a.m.',
    prompt: 'A touring act imploded three exits back. Their best player sits on a flight case with a thousand-yard stare and nowhere to be. Your van has one seat left.',
    tags: ['band', 'tour'],
    choices: {
      left: {
        label: 'Take them in',
        governingStats: { cred: 0.7, network: 0.6 },
        tags: ['band', 'network'],
        outcomes: {
          bad: { text: 'They’re grateful, brilliant, and processing a breakup with an entire band. Rehearsals double as therapy. You’re bad at therapy.', effects: { grantBandmate: 'random', cred: 3, burnout: 4 } },
          good: { text: 'They repay the seat with a decade of road wisdom and the tightest playing you’ve shared a stage with.', effects: { grantBandmate: 'random', cred: 4, skill: 3 } },
          incredible: { text: 'Turns out you rescued a low-key legend. Their old fans follow them to you. The gas station becomes lore.', effects: { grantBandmate: 'random', cred: 6, fame: 6, network: 4 } },
        },
      },
      right: {
        label: 'Buy their band’s gear instead',
        governingStats: { network: 0.8 },
        tags: ['deal', 'shop'],
        outcomes: {
          bad: { text: 'You lowball a heartbroken stranger at 2 a.m. The gear works. Your reflection in the van window doesn’t.', effects: { money: -60, grantGear: 'random_good', cred: -3 } },
          good: { text: 'Fair price, quick deal, everyone eats. The flight case sticker collection alone is worth it.', effects: { money: -80, grantGear: 'random_good' } },
          incredible: { text: 'In the case: the gear, plus a notebook of unused riffs signed “whoever needs them.” You need them.', effects: { money: -80, grantGear: 'random_good', creativity: 4 } },
        },
      },
    },
  },
  {
    id: 'a3_band_ultimatum', act: 3, pathAffinity: [], weight: 11,
    requires: { bandMin: 2 },
    art: 'ev_ultimatum', context: 'A band meeting you didn’t call',
    prompt: 'The band sits you down. “We’re not your backing act anymore. Equal billing, band name, band votes. Or —” They don’t finish the sentence. The drummer finishes it with a cymbal tap.',
    tags: ['band'],
    choices: {
      left: {
        label: 'Become a real band',
        minigame: 'tighten',
        governingStats: { network: 0.7, cred: 0.6 },
        tags: ['band', 'safe'],
        outcomes: {
          bad: { text: 'Democracy arrives. The first vote is about the name. The vote takes nine days. The name is somehow worse.', effects: { cred: 3, network: 3, burnout: 4, addFlag: 'band_named' } },
          good: { text: 'Equal billing, shared load, better shows. The van rides lighter with nobody keeping score.', effects: { cred: 5, network: 5, burnout: -4, addFlag: 'band_named' } },
          incredible: { text: 'The renamed band plays like a fist. Nobody’s hired help; everybody’s all in. The next contract has four signatures and better terms.', effects: { cred: 7, network: 6, fame: 5, burnout: -4, addFlag: 'band_named', pathProgress: 1 } },
        },
      },
      right: {
        label: 'It stays YOUR name on the poster',
        governingStats: { cred: 0.9 },
        tags: ['risky'],
        outcomes: {
          bad: { text: 'The cymbal tap was, in fact, a resignation letter. The room is quieter now. In every sense.', effects: { removeBandmate: 'first', cred: 2, burnout: 5 } },
          good: { text: 'You explain the vision with enough honesty that most of them stay. The one who leaves, leaves kindly.', effects: { removeBandmate: 'first', cred: 5, creativity: 2 } },
          incredible: { text: 'You raise everyone’s cut instead of their billing. Capitalism, deployed for once with precision. Everybody stays. Nobody forgets.', effects: { money: -150, cred: 6, network: 4, fame: 3 } },
        },
      },
    },
  },
  // ═══════════ THE UNFINISHED SONG (run-spanning arc) ═══════════
  {
    id: 'a1_fragment', act: 1, pathAffinity: [], weight: 10,
    art: 'ev_fragment', context: '3:12 a.m., unable to sleep',
    prompt: 'Four chords arrive out of nowhere and land like a door opening. You don’t know what’s on the other side yet. You know it’s a real door.',
    tags: ['write', 'home'],
    choices: {
      left: {
        label: 'Chase it all night',
        minigame: 'ideas',
        governingStats: { creativity: 1.0 },
        tags: ['write', 'risky'],
        outcomes: {
          bad: { text: 'By dawn you have forty voice memos and no song. But the door is still there. You marked where it stands.', effects: { creativity: 4, burnout: 6, addFlag: 'song_fragment' } },
          good: { text: 'By sunrise there’s a verse and half a chorus that scares you a little. It goes in the vault. It glows in there.', effects: { creativity: 6, burnout: 5, addFlag: 'song_fragment' } },
          incredible: { text: 'The whole shape arrives at 5 a.m. — everything but the ending. Some songs you write. This one you FOUND.', effects: { creativity: 9, burnout: 5, skill: 2, addFlag: 'song_fragment' } },
        },
      },
      right: {
        label: 'Sleep. If it’s real, it stays.',
        governingStats: { cred: 0.6, skill: 0.6 },
        tags: ['rest', 'safe'],
        outcomes: {
          bad: { text: 'Morning: three of the four chords are gone. You spend a week knocking on walls, looking for the door.', effects: { creativity: 2, burnout: -4 } },
          good: { text: 'It survives the night — smaller, but real. You hum it into your phone over breakfast.', effects: { creativity: 4, burnout: -6, addFlag: 'song_fragment' } },
          incredible: { text: 'It’s STILL THERE at noon, fully formed, patient. The real ones wait for you. Rested AND haunted: ideal.', effects: { creativity: 6, burnout: -6, addFlag: 'song_fragment' } },
        },
      },
    },
  },
  {
    id: 'a2_song_grows', act: 2, pathAffinity: [], weight: 13,
    requires: { flagsAll: ['song_fragment'] },
    art: 'ev_song_grows', context: 'Soundcheck. You thought no one was listening.',
    prompt: 'You play the unfinished song to an empty room, except the room isn’t empty: a producer stands in the doorway. “What IS that? I have an artist who needs exactly that.”',
    tags: ['write', 'deal'],
    choices: {
      left: {
        label: 'Sell the unfinished song',
        governingStats: { network: 0.9 },
        tags: ['deal', 'risky'],
        outcomes: {
          bad: { text: 'The check is real. The hollow feeling is also real. Someone else walks through your door now.', effects: { money: 350, hits: 1, creativity: -3, removeFlag: 'song_fragment', addFlag: 'song_sold' } },
          good: { text: 'Good money, proper credit, and the door… well. Doors can be rebuilt. Probably.', effects: { money: 500, hits: 1, cred: 2, removeFlag: 'song_fragment', addFlag: 'song_sold' } },
          incredible: { text: 'A bidding war erupts over four chords and a feeling. You keep “writer” in bold. The door is theirs now — at a doorman’s price.', effects: { money: 700, hits: 1, network: 5, removeFlag: 'song_fragment', addFlag: 'song_sold' } },
        },
      },
      right: {
        label: '“It’s not for sale. It’s not done.”',
        minigame: 'ideas',
        governingStats: { creativity: 0.8, cred: 0.5 },
        tags: ['write', 'indie'],
        outcomes: {
          bad: { text: 'The producer shrugs: “songs rot in vaults.” The sentence follows you home and sits on your chest at night. You keep writing.', effects: { creativity: 4, burnout: 4, removeFlag: 'song_fragment', addFlag: 'song_growing' } },
          good: { text: 'You work on it in every green room, every van, every night off. The bridge arrives in a parking lot in the rain. Of course it does.', effects: { creativity: 7, skill: 2, removeFlag: 'song_fragment', addFlag: 'song_growing' } },
          incredible: { text: 'The producer nods slowly: “good answer.” He leaves his card “for when it’s done.” The song grows teeth.', effects: { creativity: 9, cred: 4, network: 3, removeFlag: 'song_fragment', addFlag: 'song_growing' } },
        },
      },
    },
  },
  {
    id: 'a3_song_finale', act: 3, pathAffinity: [], weight: 16,
    requires: { flagsAll: ['song_growing'] },
    art: 'ev_song_finale', context: 'The song is finished. It’s time.',
    prompt: 'Last night, alone, you played the ending for the first time. The unfinished song is finished. Now there’s only the question every finished song asks: where does the door open?',
    tags: ['write', 'live'],
    choices: {
      left: {
        label: 'Debut it at the biggest show',
        governingStats: { skill: 0.6, creativity: 0.7 },
        tags: ['live', 'risky'],
        outcomes: {
          bad: { text: 'You debut it and your voice cracks on the ending — the ending you waited a year for. The bootleg circulates anyway. People love it, crack and all. You don’t. Yet.', effects: { fame: 6, cred: 3, creativity: 3, burnout: 5, addFlag: 'song_finished', chartTitle: 'The Door (Live, Cracked)' } },
          good: { text: 'The room goes quiet in the middle — the good quiet, the church quiet. When it ends, one full second of silence before the noise. That second is why you started.', effects: { fame: 12, cred: 6, creativity: 4, pathProgress: 1, addFlag: 'song_finished', chartTitle: 'The Door' } },
          incredible: { text: 'You play the door open. Phones drop. A stranger sobs into a bucket hat. Every setlist you write for the rest of your life ends the same way — with this.', effects: { fame: 20, cred: 8, creativity: 5, pathProgress: 2, addFlag: 'song_finished', chartTitle: 'The Door' } },
        },
      },
      right: {
        label: 'Release it alone, at midnight, no promo',
        governingStats: { creativity: 0.7, cred: 0.6 },
        tags: ['record', 'indie'],
        outcomes: {
          bad: { text: 'It drops into the void at 12:00 and the void takes a while to notice. Slow burn, they call it later. VERY slow, you call it now.', effects: { cred: 4, creativity: 3, fame: 3, addFlag: 'song_finished', chartTitle: 'The Door' } },
          good: { text: 'No promo, no premiere, just the song. It travels the old way: one person telling another person “sit down for this.”', effects: { cred: 7, fame: 8, creativity: 4, pathProgress: 1, addFlag: 'song_finished', chartTitle: 'The Door' } },
          incredible: { text: 'By morning it’s everywhere with zero marketing, which drives the marketing industry quietly insane. The mystery IS the promo. The song IS the door.', effects: { cred: 9, fame: 16, creativity: 5, pathProgress: 1, addFlag: 'song_finished', chartTitle: 'The Door' } },
        },
      },
    },
  },
  {
    id: 'a3_song_regret', act: 3, pathAffinity: [], weight: 13,
    requires: { flagsAll: ['song_sold'] },
    art: 'ev_song_regret', context: 'Live television, someone else’s stage',
    prompt: 'The artist who bought your unfinished song performs it on TV. They finished it. Differently. Wrongly? Beautifully? The crowd sings along to the door you found at 3 a.m.',
    tags: ['write', 'fame'],
    choices: {
      left: {
        label: 'Watch. Then write something better.',
        governingStats: { creativity: 1.0 },
        tags: ['write'],
        outcomes: {
          bad: { text: 'You write six spite-songs. All six are about the same door. Therapy would be cheaper than this studio time. You book more studio time.', effects: { creativity: 5, burnout: 6 } },
          good: { text: 'The anger composts into something honest: a song about selling songs. It’s better than the one you sold. It had to be.', effects: { creativity: 8, cred: 4, hits: 1 } },
          incredible: { text: 'You write THE answer song. Everyone knows what it’s about; nobody can prove it; both songs chart at once. The feud nobody can confirm becomes the story of the year.', effects: { creativity: 10, cred: 6, fame: 10, hits: 1, chartTitle: 'The Other Side (Of Your Door)' } },
        },
      },
      right: {
        label: 'Tell the internet the truth',
        governingStats: { cred: 0.7, network: 0.5 },
        tags: ['social', 'risky'],
        outcomes: {
          bad: { text: 'The receipts are real but the timeline is messy. Half the internet calls you brave; the other half calls you bitter. Both halves stream the song. Their version.', effects: { cred: 2, fame: 4, burnout: 5 } },
          good: { text: 'You post the 3 a.m. voice memo. The timestamp does all the talking. Quietly, the credit gets corrected everywhere it matters.', effects: { cred: 7, fame: 6, network: 2 } },
          incredible: { text: 'The original memo — hiss, chair creak, four chords, your sleepy hum — outstreams the polished version. People wanted the door, not the doorway staging. They wanted YOU.', effects: { cred: 9, fame: 14, creativity: 4, chartTitle: 'voicememo_312am.m4a' } },
        },
      },
    },
  },
  // ═══════════════════════ ACT 2 — THE GRIND ═══════════════════════
  // ---- Path-agnostic ----
  {
    id: 'a2_shop_gearhead', act: 2, pathAffinity: [], weight: 9, shop: true,
    art: 'ev_gear_shop', context: 'Tone Temple (boutique gear)',
    prompt: 'A gear shop where everything is “vibey” and priced accordingly. A clerk materializes: “Looking for anything… specific?”',
    tags: ['shop'],
    choices: {
      left: {
        label: 'Invest in gear ($120)',
        governingStats: { cred: 0.7, skill: 0.5 },
        tags: ['shop', 'deal', 'tone'],
        cost: 120,
        outcomes: {
          bad: { text: 'You buy the vibey one. “Vibey” turns out to mean “broken in a warm way.”', effects: { money: -120, grantGear: 'random_good' } },
          good: { text: 'A real workhorse. The clerk approves, which shouldn’t matter, but oh, it does.', effects: { money: -120, grantGear: 'random_good', cred: 2 } },
          incredible: { text: 'Floor model discount plus the clerk’s personal blessing. You are Tone-Approved.', effects: { money: -85, grantGear: 'random_good', cred: 4 } },
        },
      },
      right: {
        label: 'Window-shop & talk shop',
        governingStats: { network: 1.0 },
        tags: ['network', 'safe'],
        outcomes: {
          bad: { text: 'You nod along to a 20-minute monologue about capacitors. You retain nothing.', effects: { network: 2, burnout: 2 } },
          good: { text: 'The clerk introduces you to a producer who “hangs out here to feel something.”', effects: { network: 5, cred: 2 } },
          incredible: { text: 'The shop starts recommending YOU when clients need a player. Free marketing, great reverb.', effects: { network: 8, cred: 3, fame: 2 } },
        },
      },
    },
  },
  {
    id: 'a2_manager', act: 2, pathAffinity: [], weight: 9,
    art: 'ev_manager', context: 'A man named Dario',
    prompt: '“I can take you to the next level.” His business card is just a QR code. The QR code is a Venmo.',
    tags: ['deal', 'network'],
    choices: {
      left: {
        label: 'Sign with Dario',
        governingStats: { network: 1.0 },
        tags: ['deal', 'risky'],
        outcomes: {
          bad: { text: 'Dario’s “next level” is a casino lounge in another state. You play it. Twice.', effects: { network: 3, burnout: 6, grantGear: 'managers_card', money: 40 } },
          good: { text: 'Dario is, against every visible indicator, competent. Doors open. He takes his cut.', effects: { network: 7, fame: 4, grantGear: 'managers_card', addPromise: { label: 'Answer Dario’s calls', tags: ['deal', 'network'], cards: 3, reward: { money: 100, network: 2 }, penalty: { network: -3 } } } },
          incredible: { text: 'Dario knows EVERYONE. It’s unsettling. A booking agent hugs him and pales.', effects: { network: 10, fame: 6, cred: 2, grantGear: 'managers_card' } },
        },
      },
      right: {
        label: 'Self-manage',
        governingStats: { cred: 0.8, creativity: 0.5 },
        tags: ['safe'],
        outcomes: {
          bad: { text: 'You are now your own worst employee. Your inbox files a grievance.', effects: { cred: 2, burnout: 7 } },
          good: { text: 'DIY respect. The scene notices you answer your own emails. Promptly, even.', effects: { cred: 5, network: 3, burnout: 4 } },
          incredible: { text: 'You negotiate a fee like a person who has read one (1) book about negotiating. It works.', effects: { cred: 7, money: 150, network: 3 } },
        },
      },
    },
  },
  {
    id: 'a2_playlist', act: 2, pathAffinity: [], weight: 8,
    art: 'ev_playlist', context: 'PlaylistPushr.biz',
    prompt: '“$50 gets your track CONSIDERED by up to 40 curators.” The testimonials all have the same profile photo.',
    tags: ['social', 'deal'],
    choices: {
      left: {
        label: 'Pay the $50',
        governingStats: { network: 0.6 },
        tags: ['deal', 'risky', 'mainstream'],
        cost: 50,
        outcomes: {
          bad: { text: 'You land on “Focus Beats for Chinchillas.” Eleven streams. Chinchillas, presumably.', effects: { money: -50, fame: 1 } },
          good: { text: 'Two mid-size playlists bite. Streams tick upward. The chinchillas remain loyal.', effects: { money: -50, fame: 7, network: 2 } },
          incredible: { text: 'An editorial playlist picks it up by accident. You don’t correct the accident.', effects: { money: -50, fame: 15, network: 4, cred: 2 } },
        },
      },
      right: {
        label: 'Email curators yourself',
        governingStats: { network: 1.0, cred: 0.4 },
        tags: ['network'],
        outcomes: {
          bad: { text: 'Forty personalized emails. Three bounce. One reply: “unsubscribe.” You weren’t a newsletter.', effects: { network: 2, burnout: 6 } },
          good: { text: 'A human curator writes back like a human. Placement, plus an actual conversation.', effects: { network: 5, fame: 5, cred: 3, burnout: 3 } },
          incredible: { text: 'One curator becomes a genuine fan and quietly seeds you everywhere. A patron saint with a laptop.', effects: { network: 8, fame: 10, cred: 4 } },
        },
      },
    },
  },
  {
    id: 'a2_woodshed', act: 2, pathAffinity: [], weight: 10,
    requires: { bandMin: 1 },
    art: 'ev_woodshed', context: 'A borrowed barn, a weekend, a padlock',
    prompt: 'Two days, no phones, one rule: the set gets tight or nobody leaves. Somebody brought a whiteboard. Somebody else brought forty eggs. Both will matter.',
    tags: ['band', 'practice'],
    choices: {
      left: {
        label: 'Drill the set until it locks',
        minigame: 'tighten',
        governingStats: { skill: 0.8, network: 0.4 },
        tags: ['band', 'practice', 'safe'],
        outcomes: {
          bad: { text: 'Hour six: the bridge still fights back. Hour nine: the drummer discovers the eggs were not for eating. The set is tighter. The barn is not cleaner.', effects: { skill: 4, network: 2, burnout: 6 } },
          good: { text: 'Sunday night the set runs start to finish without a single trainwreck — twice. You celebrate the way tight bands do: playing it a third time.', effects: { skill: 6, network: 4, cred: 2, burnout: 4 } },
          incredible: { text: 'Somewhere past midnight the band stops playing songs and starts playing MUSIC — the arrangement breathing, everyone early to every hit. The whiteboard just says YES by Sunday. Nobody remembers writing it.', effects: { skill: 8, network: 5, cred: 4, creativity: 3, burnout: 4, pathProgress: 1 } },
        },
      },
      right: {
        label: 'Jam instead. See what the barn wants.',
        governingStats: { creativity: 1.0 },
        tags: ['band', 'write', 'risky'],
        outcomes: {
          bad: { text: 'Eleven hours of jams yield one riff, four arguments, and a 22-minute recording labeled BARN THING that nobody will ever explain. The set, notably, remains loose.', effects: { creativity: 4, burnout: 5 } },
          good: { text: 'The jams cough up two new songs and a version of your closer nobody planned — slower, meaner, better. The barn had opinions. The barn was right.', effects: { creativity: 7, skill: 2, burnout: 4, writeSong: true } },
          incredible: { text: 'Sunday, 2 a.m., the jam finds a groove so deep the eggs guy puts down the eggs. You record it on one phone in a hat. It becomes the intro tape for every show you play from now on.', effects: { creativity: 9, cred: 4, fame: 2, burnout: 4, writeSong: true } },
        },
      },
    },
  },
  {
    id: 'a2_band_drama', act: 2, pathAffinity: [], weight: 8,
    art: 'ev_band_drama', context: 'Group chat, 47 unread',
    prompt: 'The drummer quits over “creative differences,” which screenshots reveal to be a dispute about parking.',
    tags: ['band'],
    choices: {
      left: {
        label: 'Beg them back',
        governingStats: { network: 1.0 },
        tags: ['network'],
        outcomes: {
          bad: { text: 'They return with conditions. Condition one: the parking spot. Condition two: an apology song.', effects: { network: 2, cred: -2, burnout: 5 } },
          good: { text: 'A diner summit heals the band. You split the check and the setlist.', effects: { network: 5, cred: 2 } },
          incredible: { text: 'The reunion show is billed as a reunion show. Drama, it turns out, is marketing.', effects: { network: 6, fame: 8, cred: 3 } },
        },
      },
      right: {
        label: 'Replace them with a drum machine',
        governingStats: { creativity: 1.0 },
        tags: ['electronic', 'studio', 'indie'],
        outcomes: {
          bad: { text: 'The machine never misses. The audience misses the missing. Uncanny valley, but for groove.', effects: { creativity: 3, cred: -2 } },
          good: { text: 'New sound unlocked. The machine doesn’t drink your beer or fight about parking.', effects: { creativity: 6, skill: 2 } },
          incredible: { text: 'The pivot defines you. Reviewers say “post-genre.” You do not know what that means. Neither do they.', effects: { creativity: 9, cred: 4, fame: 4 } },
        },
      },
    },
  },
  {
    id: 'a2_sync_ad', act: 2, pathAffinity: [], weight: 8,
    art: 'ev_sync', context: 'Licensing inquiry',
    prompt: 'A yogurt brand wants your saddest song for a commercial where a woman eats yogurt at dawn, victoriously.',
    tags: ['deal'],
    choices: {
      left: {
        label: 'Take the check',
        governingStats: { network: 0.7 },
        tags: ['deal', 'mainstream'],
        outcomes: {
          bad: { text: 'They re-edit your song into a jingle. The word “probiotic” is now in the chorus. You cash it anyway.', effects: { money: 250, cred: -6, fame: 3 } },
          good: { text: 'National spot. Strangers hum your sad song at breakfast, victoriously.', effects: { money: 400, fame: 8, cred: -3 } },
          incredible: { text: 'The ad becomes a meme. Streams spike. Purists mourn you; the mourning is also streams.', effects: { money: 550, fame: 15, cred: -4, network: 3 } },
        },
      },
      right: {
        label: 'Decline. Publicly.',
        governingStats: { cred: 1.0 },
        tags: ['indie', 'risky'],
        outcomes: {
          bad: { text: 'Your refusal post reads as smug. The yogurt brand’s reply is funnier than your song.', effects: { cred: 2, fame: -2, burnout: 3 } },
          good: { text: 'The scene salutes your integrity. Integrity, sadly, is not legal tender.', effects: { cred: 7, network: 2 } },
          incredible: { text: 'Your refusal goes viral. A cooler brand calls, offering more money to be refused. You negotiate.', effects: { cred: 8, fame: 6, money: 150 } },
        },
      },
    },
  },
  {
    id: 'a2_tour_offer', act: 2, pathAffinity: [], weight: 9,
    art: 'ev_tour', context: 'A borrowed van, 12 dates',
    prompt: 'Twelve cities in fourteen days. The van belongs to a guy named Fish. Fish comes with the van.',
    tags: ['tour', 'live'],
    choices: {
      left: {
        label: 'Go on tour',
        governingStats: { network: 0.7, skill: 0.5 },
        tags: ['tour', 'live', 'risky'],
        outcomes: {
          bad: { text: 'The van dies in a town whose only venue is a Arby’s. You play the Arby’s.', effects: { fame: 4, network: 3, burnout: 14, money: -40 } },
          good: { text: 'Twelve nights of small rooms getting less small. Fish, it turns out, is a great tour manager.', effects: { fame: 9, network: 6, skill: 3, burnout: 10, money: 60 } },
          incredible: { text: 'The last three shows sell out. Fish frames the door tally. You frame Fish.', effects: { fame: 16, network: 9, cred: 4, burnout: 9, money: 180 } },
        },
      },
      right: {
        label: 'Stay home and record',
        governingStats: { creativity: 0.7, skill: 0.7 },
        tags: ['studio', 'record', 'safe'],
        outcomes: {
          bad: { text: 'You spend two weeks on a kick drum sound. It sounds like a kick drum.', effects: { skill: 3, burnout: 5 } },
          good: { text: 'An EP takes shape. Quiet weeks, loud results.', effects: { creativity: 5, skill: 4, addFlag: 'demo_in_pocket' } },
          incredible: { text: 'You finish something you’re actually proud of. It scares you a little. Good sign.', effects: { creativity: 8, skill: 5, cred: 3, addFlag: 'demo_in_pocket' } },
        },
      },
    },
  },
  {
    id: 'a2_energy_drink', act: 2, pathAffinity: [], weight: 7,
    art: 'ev_energy', context: 'GRIND™ Brand Partnerships',
    prompt: '“We sponsor hustlers. Free product, small stipend. You’d wear the hat.” The hat is enormous.',
    tags: ['deal'],
    choices: {
      left: {
        label: 'Sign. Wear the hat.',
        governingStats: { network: 0.8 },
        tags: ['deal', 'mainstream'],
        outcomes: {
          bad: { text: 'The stipend is store credit. The hat enters every photo of you for a year.', effects: { money: 60, grantGear: 'energy_drink' } },
          good: { text: 'Real money, real caffeine, real hat. Your heart races. Sponsorship, probably.', effects: { money: 150, grantGear: 'energy_drink' } },
          incredible: { text: 'You become GRIND™’s flagship musician. It’s embarrassing AND lucrative — the industry special.', effects: { money: 300, fame: 6, grantGear: 'energy_drink' } },
        },
      },
      right: {
        label: 'Decline the hat',
        governingStats: { cred: 1.0 },
        tags: ['safe', 'indie'],
        outcomes: {
          bad: { text: 'You decline politely. They add you to a “future hustlers” mailing list you cannot leave.', effects: { cred: 2, burnout: 2 } },
          good: { text: 'Dignity retained. The hat haunts someone else’s photos now.', effects: { cred: 5 } },
          incredible: { text: 'Your “no thanks” screenshot circulates. Anti-marketing. The scene loves you for it.', effects: { cred: 7, fame: 3, network: 2 } },
        },
      },
    },
  },
  {
    id: 'a2_rest', act: 2, pathAffinity: [], weight: 8,
    art: 'ev_rest', context: 'A free weekend',
    prompt: 'Nothing is scheduled. Nothing. The silence is deafening and slightly suspicious.',
    tags: ['home'],
    choices: {
      left: {
        label: 'Actually rest',
        governingStats: { cred: 0.5, network: 0.5 },
        tags: ['safe', 'rest'],
        outcomes: {
          bad: { text: 'You “rest” by lying down and mentally re-sequencing your unreleased album. Twice.', effects: { burnout: -8 } },
          good: { text: 'You sleep, you walk, you eat a vegetable. Revolutionary.', effects: { burnout: -18 } },
          incredible: { text: 'A full reset. You return to music like it’s a person you missed.', effects: { burnout: -26, creativity: 3 } },
        },
      },
      right: {
        label: '“Rest” by reorganizing samples',
        governingStats: { creativity: 1.0 },
        tags: ['studio'],
        outcomes: {
          bad: { text: 'Six hours in, you have 14 folders named “drums_final” and a headache.', effects: { creativity: 2, burnout: 2 } },
          good: { text: 'The archive yields a forgotten gem. Past-you had ideas. Past-you was onto something.', effects: { creativity: 5, burnout: -6 } },
          incredible: { text: 'You find THE loop. The one. It was in “drums_final(3)” the whole time.', effects: { creativity: 8, burnout: -6, addFlag: 'demo_in_pocket' } },
        },
      },
    },
  },
  {
    id: 'a2_one_person_band', act: 2, pathAffinity: [], weight: 12,
    requires: { flagsAll: ['has_loop_pedal'] },
    art: 'ev_loop_show', context: 'The loop pedal, glowing',
    prompt: 'A festival slot opens for a “solo act with a big sound.” You own a loop pedal. You ARE a band, legally speaking.',
    tags: ['live', 'solo'],
    choices: {
      left: {
        label: 'One-person-band the festival',
        governingStats: { skill: 0.7, creativity: 0.7 },
        tags: ['live', 'solo', 'risky'],
        outcomes: {
          bad: { text: 'You loop a mistake. It repeats every four bars, forever, like a haunting.', effects: { skill: 3, burnout: 6, fame: 2 } },
          good: { text: 'You build a wall of sound alone. The crowd checks behind the curtain for the rest of you.', effects: { skill: 5, fame: 8, cred: 4 } },
          incredible: { text: 'Layer twelve drops and the field ERUPTS. One person. One pedal. One very good day.', effects: { skill: 6, fame: 15, cred: 6, network: 5, pathProgress: 1 } },
        },
      },
      right: {
        label: 'Offer the slot to a friend’s band',
        governingStats: { network: 1.0 },
        tags: ['network', 'safe'],
        outcomes: {
          bad: { text: 'The friend’s band bombs and somehow this is your fault. Scene logic.', effects: { network: 2, cred: -1 } },
          good: { text: 'The favor is banked. Favors are the real currency. Everything else is merch.', effects: { network: 7, cred: 3 } },
          incredible: { text: 'The band kills it and thanks you from the stage, by name, twice.', effects: { network: 9, cred: 5, fame: 4 } },
        },
      },
    },
  },
  {
    id: 'debt_collector', act: [2, 3], pathAffinity: [], weight: 40,
    requires: { moneyMax: -1 },
    art: 'ev_debt', context: 'A man named Curtis',
    prompt: 'Curtis represents “interested parties” regarding your balance. Curtis is polite. Curtis has a clipboard.',
    tags: ['deal'],
    choices: {
      left: {
        label: 'Work it off (gigs for Curtis)',
        governingStats: { skill: 0.6, network: 0.6 },
        tags: ['live', 'work'],
        outcomes: {
          bad: { text: 'You play three corporate parties. One is for a company that repossesses instruments. Foreshadowing?', effects: { money: 120, burnout: 10, cred: -2 } },
          good: { text: 'Honest work, weird rooms. Curtis nods approvingly and updates the clipboard.', effects: { money: 180, burnout: 7 } },
          incredible: { text: 'Curtis, moved by your work ethic, forgives the interest AND books you a paying residency.', effects: { money: 260, network: 4, removeFlag: 'debt' } },
        },
      },
      right: {
        label: 'Dodge Curtis',
        governingStats: { creativity: 0.8 },
        tags: ['risky'],
        outcomes: {
          bad: { text: 'Curtis finds you. Curtis always finds you. The clipboard has your setlist on it.', effects: { money: -80, cred: -4, burnout: 8, addFlag: 'debt' } },
          good: { text: 'You lay low for a month. Curtis leaves a card that just says “soon.”', effects: { burnout: 5 } },
          incredible: { text: 'You write a song about dodging Curtis. It slaps. Even Curtis streams it. Royalties cover the debt.', effects: { money: 200, fame: 6, creativity: 4 } },
        },
      },
    },
  },
  {
    id: 'a2_rival_collab', act: 2, pathAffinity: [], weight: 9,
    art: 'ev_rival_collab', context: '{rival}, sliding into your DMs',
    prompt: '“Collab? One track. Your sound, my sound. The scene keeps comparing us anyway — might as well profit.” {rival} attaches a demo. It’s annoyingly good.',
    tags: ['rival', 'write'],
    choices: {
      left: {
        label: 'Collab. Bury the hatchet in a hit.',
        governingStats: { network: 0.7, creativity: 0.6 },
        tags: ['write', 'network'],
        outcomes: {
          bad: { text: 'Creative differences from minute one. The track dies in the group chat. The screenshots live forever.', effects: { network: 2, burnout: 5, rivalry: 2 } },
          good: { text: 'The track works. Both fanbases claim victory. You split the streams and the compliments evenly-ish.', effects: { fame: 8, network: 5, creativity: 3, rivalry: -2 } },
          incredible: { text: 'The collab outperforms everything either of you has done alone. Uncomfortable. Lucrative. Repeatable?', effects: { fame: 14, network: 7, creativity: 4, money: 150, rivalry: -3, pathProgress: 1 } },
        },
      },
      right: {
        label: 'Decline. Drop a diss track instead.',
        governingStats: { creativity: 1.0 },
        tags: ['write', 'risky'],
        outcomes: {
          bad: { text: 'Your diss track has a typo in the title. {rival}’s response diss corrects your grammar. In harmony.', effects: { creativity: 3, fame: 2, cred: -2, rivalry: 3 } },
          good: { text: 'The diss is surgical. {rival} responds within a week. The scene eats. Everyone streams both.', effects: { creativity: 5, fame: 9, cred: 3, rivalry: 3 } },
          incredible: { text: 'Your diss is SO good it transcends beef and becomes simply a great song. Even {rival} performs it live once, bitterly.', effects: { creativity: 8, fame: 15, cred: 5, rivalry: 2, pathProgress: 1 } },
        },
      },
    },
  },
  {
    id: 'a2_rival_leapfrog', act: 2, pathAffinity: [], weight: 8,
    art: 'ev_rival_leap', context: 'The algorithm, twisting the knife',
    prompt: '{rival} just got the playlist slot you’ve been chasing for months. Their announcement post uses the word “blessed” and, somehow, a yacht.',
    tags: ['rival', 'social'],
    choices: {
      left: {
        label: 'Congratulate them publicly',
        governingStats: { cred: 0.8, network: 0.5 },
        tags: ['social', 'safe'],
        outcomes: {
          bad: { text: 'Your gracious comment gets more likes than your last single. The internet is a comedy of cruelty.', effects: { cred: 3, burnout: 3, rivalry: -1 } },
          good: { text: 'Class recognized. The playlist curator notices the classiest comment and clicks your profile.', effects: { cred: 5, network: 4, rivalry: -2 } },
          incredible: { text: '{rival} DMs you: “that meant a lot. i told the curator about you.” The feud economy pays dividends.', effects: { cred: 6, network: 7, fame: 6, rivalry: -3 } },
        },
      },
      right: {
        label: 'Train harder. Montage mode.',
        governingStats: { skill: 1.0 },
        tags: ['practice'],
        outcomes: {
          bad: { text: 'You practice until your hands ache, fueled entirely by one yacht photo. Unsustainable. Effective. Unsustainable.', effects: { skill: 4, burnout: 7, rivalry: 1 } },
          good: { text: 'Six focused weeks. Your live set gets measurably sharper than {rival}’s. You have receipts. Graphs, even.', effects: { skill: 7, cred: 2, burnout: 4, rivalry: 1 } },
          incredible: { text: 'You emerge from the woodshed a different musician. The next promoter books you FIRST and {rival} as support. Balance restored.', effects: { skill: 10, cred: 4, fame: 4, burnout: 4, rivalry: 2 } },
        },
      },
    },
  },
  {
    id: 'a2_fan_gift', act: 2, pathAffinity: [], weight: 7,
    art: 'ev_fan_gift', context: 'A superfan, holding a guitar case',
    prompt: 'After the show, a fan opens a case: a real electric guitar. “My dad’s. He’d want someone GOING somewhere to have it.” The fan is not asking. The fan is giving.',
    tags: ['live', 'network'],
    choices: {
      left: {
        label: 'Accept the guitar',
        governingStats: { cred: 0.7, network: 0.5 },
        tags: ['roots'],
        outcomes: {
          bad: { text: 'You accept — and spend a week terrified it’s stolen. It’s not. It’s just heavy with expectations. You learn to carry both.', effects: { setInstrument: 'electric_guitar', cred: 2, burnout: 3 } },
          good: { text: 'It hums like it missed being played. You retire the old junk with honors — framed, not forgotten.', effects: { setInstrument: 'electric_guitar', cred: 4, skill: 3 } },
          incredible: { text: 'First show with it, the fan is front row, crying. You dedicate the set to their dad. The room learns the story. The story never leaves your shows.', effects: { setInstrument: 'electric_guitar', cred: 7, skill: 3, fame: 8, network: 3 } },
        },
      },
      right: {
        label: 'Decline. The junk IS the sound.',
        governingStats: { creativity: 1.0 },
        tags: ['indie'],
        outcomes: {
          bad: { text: 'You explain your “artistic commitment” to the janky instrument for slightly too long. The fan nods slowly, case closing.', effects: { creativity: 3, network: -2 } },
          good: { text: 'You play the fan one song on the old junk to show why. They get it. Everyone eventually gets it.', effects: { creativity: 5, cred: 4 } },
          incredible: { text: '“Keep it,” you say, “but bring it to every show — you’re my guitar tech now.” The fan becomes crew. The legend grows sideways.', effects: { creativity: 6, cred: 5, network: 6, fame: 3 } },
        },
      },
    },
  },
  {
    id: 'a2_pawn_upgrade', act: 2, pathAffinity: [], weight: 6,
    requires: { moneyMin: 150 },
    art: 'ev_pawn_upgrade', context: 'Second Chances Pawn & Loan, again',
    prompt: 'The owner slides a sampler across the counter. “Trade-in deal: your instrument plus $150. It’s got somebody’s whole career in its pads. Could be yours.”',
    tags: ['shop', 'deal'],
    choices: {
      left: {
        label: 'Trade up ($150)',
        governingStats: { creativity: 0.7 },
        tags: ['deal', 'electronic'],
        cost: 150,
        outcomes: {
          bad: { text: 'The pads stick and pad 7 triggers a stranger’s voicemail. You keep the voicemail in a song. Obviously.', effects: { money: -150, setInstrument: 'sampler', creativity: 3 } },
          good: { text: 'The sampler reroutes your whole brain. You stop writing songs and start building them.', effects: { money: -150, setInstrument: 'sampler', creativity: 5, skill: 2 } },
          incredible: { text: 'Inside: a flash card of unreleased loops signed “for whoever’s next.” The previous owner, it turns out, made three hits you know. You inherit a lineage.', effects: { money: -150, setInstrument: 'sampler', creativity: 8, cred: 4, addFlag: 'demo_in_pocket' } },
        },
      },
      right: {
        label: 'Loyalty. Walk out together.',
        governingStats: { cred: 1.0 },
        tags: ['roots', 'safe'],
        outcomes: {
          bad: { text: 'You pat your instrument protectively. The owner shrugs: “the offer dies at close.” It dies. You think about it weekly.', effects: { cred: 3 } },
          good: { text: '“Couldn’t do it.” The owner nods like you passed a test. Maybe you did.', effects: { cred: 5, creativity: 2 } },
          incredible: { text: 'The owner leans in: “good. the sampler’s cursed. here—” and hands you a discount on something actually useful.', effects: { cred: 6, money: -60, grantGear: 'random_good' } },
        },
      },
    },
  },
  // ---- Act 2: MEGASTAR ----
  {
    id: 'a2_label_showcase', act: 2, pathAffinity: ['megastar'], weight: 10,
    art: 'ev_showcase', context: 'Your manager',
    prompt: 'A label wants you to headline their “emerging artist” showcase. Unpaid. “Great exposure.”',
    tags: ['live', 'network'],
    choices: {
      left: {
        label: 'Do it for exposure',
        minigame: 'setlist',
        governingStats: { network: 1.0, creativity: 0.5 },
        tags: ['live', 'risky'],
        outcomes: {
          bad: { text: 'Twelve people. Four are the other bands.', effects: { burnout: 8, fame: 2 } },
          good: { text: 'A blogger films it. Modest buzz.', effects: { fame: 10, network: 5, burnout: 6 } },
          incredible: { text: 'It goes viral. Your inbox explodes.', effects: { fame: 25, network: 10, burnout: 6, pathProgress: 1 } },
        },
      },
      right: {
        label: 'Demand a fee',
        governingStats: { cred: 1.0, network: 0.5 },
        tags: ['deal'],
        outcomes: {
          bad: { text: 'They ghost you and book a nepo act.', effects: { cred: -4, network: -4 } },
          good: { text: 'They pay scale. Respect noted.', effects: { money: 200, cred: 5 } },
          incredible: { text: 'You negotiate a residency.', effects: { money: 500, cred: 10, network: 8, pathProgress: 1 } },
        },
      },
    },
  },
  {
    id: 'a2_loadout_race', act: [1, 2], pathAffinity: [], weight: 9,
    art: 'ev_loadout', context: '11:47 p.m. The venue “closes” at midnight.',
    prompt: 'The house lights snap on mid-goodbye. A man with keys materializes: “Thirteen minutes. Then the alarm sets itself and your gear lives here till Monday.” The stage is a yard sale. The van is a geometry problem.',
    tags: ['live', 'tour'],
    choices: {
      left: {
        label: 'Pack it yourself. Perfectly.',
        minigame: 'pack',
        governingStats: { skill: 0.8 },
        tags: ['tour', 'risky'],
        outcomes: {
          bad: { text: 'The Tetris gods reject your offering — the last amp requires re-doing everything, twice, while Keys Man narrates the time remaining. You clear the door at 11:59:40 with a cymbal in your lap.', effects: { skill: 2, burnout: 5 } },
          good: { text: 'Drums, cabs, keys, strings — the sacred order holds and everything slots like it was measured. Keys Man, watching, says “you’ve done this,” which is the bouncer version of a five-star review.', effects: { skill: 4, cred: 2, burnout: 2 } },
          incredible: { text: 'You pack the van so fast and so RIGHT that Keys Man walks over with his phone out: his brother-in-law runs backline for the amphitheater and “they lose gear WEEKLY.” A number is exchanged. Load-out becomes a job offer.', effects: { skill: 5, cred: 3, network: 4, money: 60, burnout: 2 } },
        },
      },
      right: {
        label: 'Deputize the drunk volunteers',
        governingStats: { network: 0.9 },
        tags: ['network', 'risky'],
        outcomes: {
          bad: { text: 'Five enthusiastic fans carry one item each in five directions. A tom goes missing, recovered Tuesday from someone’s roommate’s “drum corner.” The thought counted. The tom barely survived.', effects: { network: 2, burnout: 4, money: -30 } },
          good: { text: 'You run it like a fire brigade — point, pass, repeat — and the crowd load-out becomes a closing ceremony. Everyone touches the amp. The amp is blessed now.', effects: { network: 4, fame: 2, burnout: 1 } },
          incredible: { text: 'The volunteer chain moves the whole stage in nine minutes flat, chanting. Keys Man holds the door like an usher at a coronation. Three volunteers ask when the next show is SO THEY CAN DO THIS AGAIN. Your load-out has fans.', effects: { network: 6, fame: 3, cred: 2 } },
        },
      },
    },
  },
  {
    id: 'a2_merch_line', act: [1, 2], pathAffinity: [], weight: 9,
    art: 'ev_merchline', context: 'Post-show. The line reaches the door.',
    prompt: 'Best set in weeks, and now forty people want a piece of it — shirts, tapes, the pin somebody’s girlfriend designed. The card reader has 12% battery. You ARE the point of sale.',
    tags: ['live', 'fame'],
    choices: {
      left: {
        label: 'Run the table yourself',
        minigame: 'merch',
        governingStats: { network: 0.6, skill: 0.5 },
        tags: ['fame', 'risky'],
        outcomes: {
          bad: { text: 'You hand a medium to a large, a tape to a vinyl person, and someone’s change to someone else entirely. The line forgives; the spreadsheet does not.', effects: { money: 60, fame: 2, burnout: 5 } },
          good: { text: 'You move product like a deli counter veteran — name, size, tap, next — and every sale comes with eight seconds of eye contact that fans will describe as “a moment.”', effects: { money: 140, fame: 4, network: 3, burnout: 3 } },
          incredible: { text: 'The table SELLS OUT. Every shirt, every tape, the display pin off the board. The last customer buys the tablecloth. You sign it. That tablecloth will outlive everyone here.', effects: { money: 240, fame: 6, network: 4, burnout: 3 } },
        },
      },
      right: {
        label: 'Sign things, let the superfan run cash',
        governingStats: { network: 0.9 },
        tags: ['network', 'safe'],
        outcomes: {
          bad: { text: 'The superfan’s till math is enthusiastic rather than accurate. You break even on the night and gain one extremely loyal accountant of chaos.', effects: { money: 20, network: 3, fame: 2 } },
          good: { text: 'You shake every hand while the superfan runs the drawer like a casino pit boss. Slower money, deeper roots — half this line will come to the NEXT three shows.', effects: { money: 80, network: 5, fame: 3 } },
          incredible: { text: 'The superfan turns out to run inventory at a warehouse club and reorganizes your entire merch operation between customers. You leave with money, a mailing list, and a volunteer COO.', effects: { money: 120, network: 7, fame: 3, cred: 2 } },
        },
      },
    },
  },
  {
    id: 'a2_soundcheck_hell', act: [1, 2], pathAffinity: [], weight: 9,
    art: 'ev_checkhell', context: 'Soundcheck. The board is “vintage.” The sound guy is “at lunch.”',
    prompt: 'Every channel on this desk has a personality disorder and the monitors squeal if you look at them with intent. Doors in forty minutes. The room is yours to tame — or to flee.',
    tags: ['live', 'tone'],
    choices: {
      left: {
        label: 'Ride the board yourself',
        minigame: 'feedback',
        governingStats: { skill: 0.9 },
        tags: ['tone', 'risky'],
        outcomes: {
          bad: { text: 'You chase the squeal through six channels like a rat through drywall. Doors open to a hum you’ve decided is “ambience.” Two people ask if it’s part of the set. You say yes. It is now.', effects: { skill: 3, burnout: 5, cred: 1 } },
          good: { text: 'Channel by channel, you strangle every squeal. By doors, the vintage desk purrs like it’s 1974 and proud of it. The returning sound guy inspects your gain staging and says “huh” — the highest honor.', effects: { skill: 5, cred: 4, network: 2 } },
          incredible: { text: 'You don’t just tame the board, you FIX the room — a folded beer mat under the monitor, a mystery cable retired, the squeal gone at the source. Tonight the venue sounds better than it has in years, and everyone who works here knows exactly why.', effects: { skill: 7, cred: 6, network: 4, fame: 2 } },
        },
      },
      right: {
        label: 'Play the room acoustic, no board',
        governingStats: { cred: 0.8, creativity: 0.5 },
        tags: ['live', 'indie', 'safe'],
        outcomes: {
          bad: { text: 'Unplugged in a room built for volume: the fridge behind the bar wins the low end. Intimate, yes. Audible, in places.', effects: { cred: 3, fame: 1, burnout: 3 } },
          good: { text: 'You pull the crowd into a half-circle and play into the silence the dead PA left behind. No squeal. No net. It works the old way — the oldest way.', effects: { cred: 6, creativity: 3, fame: 2 } },
          incredible: { text: 'The unplugged set becomes the story: forty people leaning in, the bartender killing the fridge for the quiet song. Someone posts it captioned “no mic no fear.” The venue books you back for MORE money, no PA required.', effects: { cred: 8, creativity: 4, fame: 4, money: 80 } },
        },
      },
    },
  },
  {
    id: 'a2_shed_offer', act: 2, pathAffinity: [], weight: 10,
    requires: { moneyMin: 250, flagsNone: ['home_studio'] },
    art: 'ev_shed', context: 'Your landlord, holding a padlock key like a dare',
    prompt: '“The garden shed. Wiring’s new-ish, neighbors are deaf-ish, and it’s yours for $250 if you stop asking questions about the wiring.” It smells like potting soil and possibility. Mostly soil.',
    tags: ['deal', 'home'],
    choices: {
      left: {
        label: 'Take the shed. Build the lab.',
        governingStats: { creativity: 0.7, network: 0.4 },
        tags: ['home', 'risky'],
        outcomes: {
          bad: { text: 'Week one: you learn which outlet is “the spicy one.” Week two: egg cartons on every wall. It’s not a studio yet. It’s a promise with a padlock — and it’s YOURS.', effects: { money: -250, creativity: 4, addFlag: 'home_studio' } },
          good: { text: 'Two weekends of foam, borrowed cables, and one heroic extension cord later: a room where ideas can be loud at 3 a.m. The commute is eleven steps. The rent is paid in songs.', effects: { money: -250, creativity: 6, skill: 2, addFlag: 'home_studio' } },
          incredible: { text: 'The shed, treated and wired, turns out to have THE sound — dead in the middle, alive in the corners, a room that flatters everything. Engineers will someday ask what plugin this is. It’s a shed.', effects: { money: -250, creativity: 8, skill: 3, cred: 2, addFlag: 'home_studio' } },
        },
      },
      right: {
        label: 'Keep the cash. Rent rooms like a normal person.',
        governingStats: { network: 0.8 },
        tags: ['safe', 'deal'],
        outcomes: {
          bad: { text: 'Sensible. Liquid. The landlord rents the shed to a man who restores pinball machines, and every clank through the fence sounds like a song you didn’t write.', effects: { cred: 1 } },
          good: { text: 'You stay flexible and book real rooms when it matters. Discipline over romance — the accountant’s path to art, walked with dignity.', effects: { network: 3, cred: 2 } },
          incredible: { text: 'The money you didn’t bury in drywall buys a session at the good studio across town — where the engineer likes your stuff and starts cutting you the friend rate. Access beats ownership. This week, anyway.', effects: { network: 5, cred: 3, skill: 2 } },
        },
      },
    },
  },
  {
    id: 'a2_shed_nights', act: 2, pathAffinity: [], weight: 13,
    requires: { flagsAll: ['home_studio'] },
    art: 'ev_shed_night', context: 'The shed. 2:58 a.m. The good hours.',
    prompt: 'The lab is open all night and nobody can tell you no. The question every night asks: make something in it, or make something OF it?',
    tags: ['record', 'home'],
    choices: {
      left: {
        label: 'Record the 3 a.m. demos',
        minigame: 'take',
        governingStats: { creativity: 0.7, skill: 0.5 },
        tags: ['record', 'write', 'indie'],
        outcomes: {
          bad: { text: 'The takes fight you till dawn, and at 6 a.m. the neighbor’s rooster joins uninvited — on beat, somehow. You keep the rooster take. Shed rules: everything is an instrument.', effects: { creativity: 4, skill: 2, burnout: 4, writeSong: true } },
          good: { text: 'Three demos by sunrise, raw in the way money can’t buy. The shed’s weird midnight warmth is all over them — a sound that’s now officially yours.', effects: { creativity: 6, skill: 3, cred: 2, burnout: 3, writeSong: true } },
          incredible: { text: 'One of the demos refuses to be a demo. By 5 a.m. it’s DONE — mixed, sequenced, undeniable, born entirely eleven steps from your bed. The shed has paid for itself in one night.', effects: { creativity: 8, skill: 3, cred: 3, hits: 1, burnout: 3 } },
        },
      },
      right: {
        label: 'Rent the night hours to other broke musicians',
        governingStats: { network: 1.0 },
        tags: ['deal', 'network'],
        outcomes: {
          bad: { text: 'Your first client is a noise duo whose whole thing is feedback. The neighbors write a letter. The letter has SIGNATURES. Shed diplomacy begins.', effects: { money: 90, network: 2, burnout: 3 } },
          good: { text: 'Word spreads through the scene: cheap hours, weird warmth, no clock-watching. The shed calendar fills, the jar fills with it, and every renter owes you one.', effects: { money: 190, network: 5, cred: 2 } },
          incredible: { text: 'A renter cuts something great in your shed and tells EVERYONE where. “Recorded at The Shed” starts appearing in liner notes like a badge. You now run the scene’s favorite room and its cheapest favor economy.', effects: { money: 240, network: 7, cred: 4, grantHustle: 'shed_rental' } },
        },
      },
    },
  },
  {
    id: 'a3_shed_album', act: 3, pathAffinity: [], weight: 13,
    requires: { flagsAll: ['home_studio'] },
    art: 'ev_shed_album', context: 'The shed, holding a finished thing',
    prompt: 'It exists: a whole record, made start-to-finish in a garden shed, rooster cameo and all. A label hears it and offers to “give it a real mix, real mastering, a real release.” The word “real” is doing crimes in that sentence.',
    tags: ['record', 'deal'],
    choices: {
      left: {
        label: 'Release it exactly as the shed made it',
        minigame: 'mixdown',
        governingStats: { cred: 0.9, creativity: 0.4 },
        tags: ['indie', 'risky'],
        outcomes: {
          bad: { text: 'The shed album comes out sounding like a shed, which reviewers note with varying kindness. But the people who get it GET it — and they show up at shows knowing every word of the rooster song.', effects: { cred: 5, fame: 3, creativity: 2 } },
          good: { text: 'Unpolished, unashamed, and somehow warmer than everything else out this month. “Recorded in a garden shed” stops being an apology and becomes the press angle.', effects: { cred: 8, fame: 5, creativity: 3 } },
          incredible: { text: 'The shed album becomes the reference other artists bring to expensive studios: “make it sound like THIS.” They can’t. It’s a shed. You know which outlet is the spicy one. Legacy: secured.', effects: { cred: 11, fame: 7, creativity: 4, pathProgress: 1 } },
        },
      },
      right: {
        label: 'Take the deal. Let them polish it.',
        governingStats: { network: 0.9 },
        tags: ['deal', 'mainstream'],
        outcomes: {
          bad: { text: 'The remaster sands off every splinter that made it yours. It sounds expensive and anonymous, like a hotel lobby with your name on it. It sells… fine. The shed files a silent protest.', effects: { money: 300, fame: 4, cred: -3 } },
          good: { text: 'The label polish keeps most of the weird and adds reach you couldn’t buy. The shed original circulates among fans as “the real one” — you get both audiences and one uneasy conscience.', effects: { money: 450, fame: 7, cred: 1 } },
          incredible: { text: 'You negotiate the polish YOUR way: their mastering, your mixes, the rooster stays. It ships wide without losing the shed. The credits read “Recorded at The Shed” above the label’s logo, in that order, forever.', effects: { money: 600, fame: 9, cred: 4, pathProgress: 1 } },
        },
      },
    },
  },
  {
    id: 'cb_poster_wall', act: 2, pathAffinity: [], weight: 13,
    requires: { flagsAll: ['comeback'], venueNone: true },
    art: 'ev_cb_poster', context: 'A bar you used to own (spiritually)',
    prompt: 'You walk in for a quiet drink and stop dead: your poster. Still up. Laminated, at some point, against time itself. The owner follows your eyes: “Took it down for a week in the lean years. Regulars revolted. You playing again, or just visiting the shrine?”',
    tags: ['home', 'live'],
    choices: {
      left: {
        label: '“Again. Starting here. Tonight.”',
        governingStats: { cred: 0.7, network: 0.4 },
        tags: ['live', 'roots', 'risky'],
        outcomes: {
          bad: { text: 'Word-of-mouth on four hours’ notice draws nineteen people — but they’re the RIGHT nineteen, the laminators, the ones who revolted. You play the old songs to the people who kept them alive. Even rusty, it counts double here.', effects: { cred: 5, fame: 2, burnout: 3, adoptVenue: 'ricochet', venueLoveStart: 2 } },
          good: { text: 'The owner makes one call and the room fills the old way — by phone tree. You play under your own laminated face and the years fold shut like a map. This room never stopped being yours. Now it’s official again.', effects: { cred: 7, fame: 4, network: 3, adoptVenue: 'ricochet', venueLoveStart: 2 } },
          incredible: { text: 'Someone films the return show on a phone held with BOTH hands, reverently. The clip’s caption — “they came BACK” — does what press releases can’t. The comeback has a home now, and the home has a story, and the story has receipts: one poster, laminated, never down for more than a week.', effects: { cred: 9, fame: 7, network: 4, adoptVenue: 'ricochet', venueLoveStart: 3 } },
        },
      },
      right: {
        label: 'Just visiting. Buy the wall a drink.',
        governingStats: { cred: 0.8 },
        tags: ['safe', 'rest'],
        outcomes: {
          bad: { text: 'You drink quietly under your own younger face. The owner doesn’t push. On the way out you leave enough for a round for the house “when I earn the poster back.” The owner writes it on the mirror. Debts like that are fuel.', effects: { cred: 3, money: -40, burnout: -4 } },
          good: { text: 'One drink becomes a slow evening of the old stories, told back to you better than you remember living them. No set, no pressure — just proof the roots survived the drought. You leave lighter than you came.', effects: { cred: 5, network: 2, burnout: -6 } },
          incredible: { text: 'At close, the owner unlocks the back room: every flyer, setlist, and broken string from the old days, archived in shoeboxes labeled by year. “Figured you’d want it someday. Someday looks like today.” You leave with your own history in a box and a fire you forgot you had.', effects: { cred: 7, creativity: 4, burnout: -6 } },
        },
      },
    },
  },
  {
    id: 'cb_old_flame_band', act: 2, pathAffinity: [], weight: 12,
    requires: { flagsAll: ['comeback'], bandMax: 0 },
    art: 'ev_cb_band', context: 'A voice from the old lineup, in a grocery store',
    prompt: 'Aisle five: your old rhythm section, holding oat milk, staring at you. The last time you spoke was a stage, an argument, and eleven years. “Heard you’re back,” they say, in a tone that is somehow both accusation and application.',
    tags: ['band', 'network'],
    choices: {
      left: {
        label: '“I need a rhythm section.”',
        governingStats: { network: 0.7, cred: 0.5 },
        tags: ['band', 'risky'],
        outcomes: {
          bad: { text: 'The first rehearsal reopens the old argument mid-song — same bar, same disagreement, eleven years of interest. But you finish the song this time. That’s the whole difference, it turns out.', effects: { grantBandmate: 'random', network: 3, burnout: 4 } },
          good: { text: 'The chemistry survived the years better than either of you did. Two rehearsals in, you’re finishing each other’s fills. The oat milk, forgotten in the practice space, becomes the reunion’s official monument.', effects: { grantBandmate: 'random', network: 4, cred: 3 } },
          incredible: { text: 'It’s better now — the old telepathy plus grown-up ears. The reunion becomes the comeback’s spine: not a solo return, a RESURRECTION, witnesses included. The old argument comes up once, at dinner, and you both laugh until it’s finally, permanently small.', effects: { grantBandmate: 'random', network: 5, cred: 5, fame: 3, burnout: -3 } },
        },
      },
      right: {
        label: '“I owe you an apology first.”',
        governingStats: { cred: 0.9 },
        tags: ['safe', 'network'],
        outcomes: {
          bad: { text: 'The apology comes out in the wrong order in a grocery store, which is where the big ones apparently happen. They accept it the way people accept weather. It’s not a band. It is, finally, not a wound.', effects: { cred: 4, burnout: -3 } },
          good: { text: 'You say the thing, eleven years late, next to the oat milk. They nod for a long time. “Okay,” they say. “Okay.” No band reunion — but next week they send you their kid, who plays BETTER, with a note: “teach them the good parts only.”', effects: { cred: 6, network: 4, burnout: -4 } },
          incredible: { text: 'The apology unlocks the whole frozen decade — you close the grocery store talking, then the diner, then the parking lot. No reunion; something better: a friend restored to the timeline. At your next show they stand at the back, arms crossed, nodding. The nod carries eleven years of weight, set down.', effects: { cred: 8, network: 5, burnout: -6 } },
        },
      },
    },
  },
  {
    id: 'a2_tv_scout', act: 2, pathAffinity: [], weight: 10,
    requires: { fameMin: 30, flagsNone: ['tv_booked'] },
    art: 'ev_tv_scout', context: 'After the show. A card that just says a network logo.',
    prompt: '“I book music for the late show. The couch show. THE couch.” She watched your whole set from the back with the stillness of someone doing math. “We have a cancellation in a few weeks. Do you have a television song?” Nobody has ever asked you this.',
    tags: ['fame', 'deal'],
    choices: {
      left: {
        label: '“Yes.” (You’ll figure out which one.)',
        governingStats: { network: 0.8 },
        tags: ['fame', 'risky'],
        outcomes: {
          bad: { text: 'You say yes so fast she laughs. The booking is real; the panic is realer. You now own three weeks of deciding which four minutes of your life four million people will see.', effects: { network: 3, fame: 2, burnout: 4, addFlag: 'tv_booked' } },
          good: { text: 'You say yes like you’ve been expecting the question since childhood, which — privately — you have. She emails the segment producer from the parking lot. It’s happening. THE couch.', effects: { network: 5, fame: 3, burnout: 2, addFlag: 'tv_booked' } },
          incredible: { text: 'Your yes comes with a pitch — THE song, THE arrangement, a horn idea that makes her put her phone away. “That’s the segment,” she says. She’s already blocking it in her head. Television has a shape and you just fit it.', effects: { network: 6, fame: 4, creativity: 2, addFlag: 'tv_booked' } },
        },
      },
      right: {
        label: '“Not yet. Come back when I do.”',
        governingStats: { cred: 0.9 },
        tags: ['indie', 'risky'],
        outcomes: {
          bad: { text: 'She blinks — nobody says not-yet to the couch. The card stays in your pocket, slowly becoming either a story of integrity or a story of an idiot, depending on how the year goes.', effects: { cred: 4, burnout: -2 } },
          good: { text: '“Honest,” she says, and means it as currency. The not-yet becomes industry lore in miniature — the booker herself retells it. When you ARE ready, you won’t need the card. She’ll call you.', effects: { cred: 6, network: 3 } },
          incredible: { text: 'Your not-yet impresses her so thoroughly she books you for the SEASON FINALE instead — “when the song is ready, that’s the slot.” Bigger stage, later date, your terms. Patience, televised.', effects: { cred: 7, network: 4, fame: 3, addFlag: 'tv_booked' } },
        },
      },
    },
  },
  {
    id: 'a3_tv_taping', act: 3, pathAffinity: [], weight: 15,
    requires: { flagsAll: ['tv_booked'] },
    art: 'ev_tv_taping', context: 'Studio 6H-adjacent. The couch is RIGHT THERE.',
    prompt: 'Taping day. Four minutes, one take, four million people, a floor manager counting down with fingers. The host mispronounced your name in rehearsal and apologized with his whole body. This is the four minutes.',
    tags: ['live', 'fame'],
    choices: {
      left: {
        label: 'Play it. The four minutes.',
        minigame: 'crowd',
        governingStats: { skill: 0.7, network: 0.5 },
        tags: ['live', 'mainstream', 'risky'],
        outcomes: {
          bad: { text: 'Take one is fine. Television-fine, which is to say: forgettable. The clip does modest numbers, your mom’s comment does better. But you played the couch show, and the couch show plays you forever after in bios: “as seen on.”', effects: { fame: 8, network: 3, burnout: 5 } },
          good: { text: 'The four minutes LAND — tight, warm, television-shaped without losing your shape. The host waves you to the couch, unplanned, and mispronounces your name with such affection it becomes a bit. The clip travels all week.', effects: { fame: 15, network: 5, cred: 3, burnout: 4 } },
          incredible: { text: 'Something happens in minute three — the room forgets it’s a taping, the host stands up, a camera operator is visibly weeping into her viewfinder. The clip is the number-one video in the country by morning. Your name (pronounced correctly, now, by everyone) means something it didn’t yesterday.', effects: { fame: 25, network: 7, cred: 4, burnout: 4, pathProgress: 1 } },
        },
      },
      right: {
        label: 'Swap the single for the risky one, live',
        governingStats: { creativity: 0.8, cred: 0.4 },
        tags: ['live', 'indie', 'risky'],
        outcomes: {
          bad: { text: 'The segment producer’s headset audibly crackles when you start the WRONG song. It half-lands — too strange for the couch, too televised for the fans. Both audiences file confused reports. The booker sends one raised-eyebrow emoji.', effects: { fame: 5, cred: 3, creativity: 2, burnout: 5 } },
          good: { text: 'You bet four minutes of national television on the weird one — and it holds. Not a smash: a MARK. The people who get it will never un-get it, and they’re exactly the people you wanted. The booker’s email: “not what I booked. better.”', effects: { fame: 10, cred: 6, creativity: 4, burnout: 4 } },
          incredible: { text: 'The risky song, live, uncut, becomes one of those performances — the kind that gets written about as a moment TV “doesn’t make anymore.” It made one. It was you. The booker frames the setlist you ignored.', effects: { fame: 18, cred: 8, creativity: 5, burnout: 4, pathProgress: 1 } },
        },
      },
    },
  },
  {
    id: 'a2_genre_summit', act: 2, pathAffinity: [], weight: 9,
    requires: { genreAny: true },
    art: 'ev_summit', context: 'The back room of the record store. Neutral ground.',
    prompt: 'Every micro-scene in town sends a delegate to divide the calendar: who gets First Fridays, who gets the good Saturday slot at the Sweatbox, who has to stop calling themselves “the city’s sound.” You’re here representing {genre}. There are pastries. It’s tense.',
    tags: ['network'],
    choices: {
      left: {
        label: 'Broker the grand alliance',
        governingStats: { network: 0.9 },
        tags: ['network', 'safe'],
        outcomes: {
          bad: { text: 'Your proposed calendar dies over a dispute about whether 9 p.m. means 9 p.m. (it has never meant 9 p.m.). But you took notes, learned names, and the doom jazz delegate respects your pen.', effects: { network: 3, cred: 1, burnout: 3 } },
          good: { text: 'You draft the Treaty of First Fridays: rotating slots, shared backline, one unified complaint letter to the city about parking. Every scene leaves mildly dissatisfied — the definition of a fair deal.', effects: { network: 6, cred: 3 } },
          incredible: { text: 'The summit ends with a co-billed festival: every genre, one night, YOUR name on the poster as “convener.” The city’s scene stops being a knife fight and starts being a buffet. History will call it the Pastry Accords.', effects: { network: 8, cred: 5, fame: 4 } },
        },
      },
      right: {
        label: 'Declare {genre} supremacy. Walk out.',
        governingStats: { cred: 0.7, creativity: 0.5 },
        tags: ['risky', 'indie'],
        outcomes: {
          bad: { text: 'Your walkout speech lands flat because you trip on a chair mid-exit. The scenes unite — against you, briefly, which technically makes you the alliance’s founder.', effects: { cred: 2, fame: 2, rivalry: 1, burnout: 3 } },
          good: { text: '“We didn’t come to share a calendar. We came to own it.” The walkout is theater and everyone knows it — but {genre} bookings spike, because nothing sells like conviction with pastries still in hand.', effects: { cred: 5, fame: 4, network: -1 } },
          incredible: { text: 'The walkout clip goes scene-viral. {genre} becomes the city’s villain sound — leather-jacket popular, us-against-them popular. Your shows sell out on spite alone. The other delegates quietly ask to defect.', effects: { cred: 7, fame: 6, network: 2 } },
        },
      },
    },
  },
  {
    id: 'dc_offer', act: 2, pathAffinity: [], weight: 10,
    requires: { fameMax: 25 },
    art: 'ev_dc_offer', context: 'A promoter named Gary. Just Gary.',
    prompt: '“Three nights, three towns you’ve never heard of, gas money guaranteed*.” The asterisk is load-bearing. It’s not a good tour. It is, however, A tour, and the calendar is very empty.',
    tags: ['tour'],
    choices: {
      left: {
        label: 'Take the Dirt Circuit',
        governingStats: { cred: 0.6, network: 0.5 },
        tags: ['tour', 'risky'],
        outcomes: {
          bad: { text: 'Gary’s “advance” is a gas station gift card with $11 on it. You leave anyway. Musicians have gone to war with less.', effects: { money: -20, cred: 1, chainEventId: 'dc_blizzard' } },
          good: { text: 'You shake Gary’s hand, which feels like signing something. The van points toward towns that don’t appear on weather maps. Especially, it will turn out, weather maps.', effects: { cred: 2, chainEventId: 'dc_blizzard' } },
          incredible: { text: 'Gary, moved by your immediate yes, throws in “merch table priority” — a phrase that means nothing but sounds professional. You roll out at dawn feeling, incorrectly, prepared.', effects: { cred: 3, network: 1, chainEventId: 'dc_blizzard' } },
        },
      },
      right: {
        label: 'Pass. Even the desperate have standards.',
        governingStats: { cred: 0.8 },
        tags: ['safe'],
        outcomes: {
          bad: { text: 'You pass, and the empty week eats at you exactly as much as the tour would have. Gary books Sad Lasagna instead. They get a Wikipedia paragraph out of it.', effects: { burnout: -3, cred: 1 } },
          good: { text: 'You spend the week woodshedding instead. Gary calls twice more, asterisk intact. Your standards hold. Your calluses improve.', effects: { skill: 3, burnout: -4 } },
          incredible: { text: 'You use the free week to book your OWN weekend run — two towns, no Gary, no asterisks. It pays honestly and the van thanks you. Sometimes the best tour is the one you route yourself.', effects: { skill: 2, money: 120, network: 3, burnout: -3 } },
        },
      },
    },
  },
  {
    id: 'dc_blizzard', act: 2, pathAffinity: [], weight: 0, chainOnly: true,
    art: 'ev_dc_blizzard', context: 'NIGHT ONE — a town called Flint Hollow, allegedly',
    prompt: 'The blizzard arrives with you. The venue is a bar attached to a bait shop, the crowd is nine snowplow drivers on break, and the heating is a wood stove named (per the plaque) “Big Susan.”',
    tags: ['tour', 'live'],
    choices: {
      left: {
        label: 'Play the storm set of your life',
        governingStats: { cred: 0.7, creativity: 0.5 },
        tags: ['live', 'risky'],
        outcomes: {
          bad: { text: 'The power flickers out mid-set, so you finish acoustic by stove-light while the wind auditions for backup vocals. The plow drivers nod slowly, which here constitutes an ovation.', effects: { cred: 4, burnout: 4, chainEventId: 'dc_birthday' } },
          good: { text: 'Something about Big Susan’s crackle and nine exhausted plow drivers makes the sad songs land like scripture. One driver requests “that one again.” You play it again. Nobody has ever meant applause more.', effects: { cred: 6, creativity: 2, burnout: 3, chainEventId: 'dc_birthday' } },
          incredible: { text: 'The blizzard strands everyone till 3 a.m., so you play EVERYTHING — the set, the b-sides, the covers, the song you’ve never played anyone. The bait shop owner comps your room and calls you “the storm band” with visible reverence. Legends start in places like this.', effects: { cred: 8, creativity: 3, network: 2, burnout: 3, chainEventId: 'dc_birthday' } },
        },
      },
      right: {
        label: 'Cut it short, hug the stove',
        governingStats: { network: 0.7 },
        tags: ['safe', 'rest'],
        outcomes: {
          bad: { text: 'Four songs and done. The plow drivers understand — they too are hourly. You spend the night learning bait-shop economics, which are shockingly robust.', effects: { burnout: -2, network: 2, chainEventId: 'dc_birthday' } },
          good: { text: 'Short set, long hang. By midnight you know every driver’s route, kid, and opinion on rock salt. When your van won’t start at dawn, three plows arrive before you finish the distress call.', effects: { network: 4, burnout: -3, chainEventId: 'dc_birthday' } },
          incredible: { text: 'The stove-side hang turns into the plow drivers teaching you a work song their granddads sang — modal, mournful, PERFECT. You record it on your phone with permission and a promise. Night one’s real payment was a song.', effects: { creativity: 6, network: 3, burnout: -3, chainEventId: 'dc_birthday' } },
        },
      },
    },
  },
  {
    id: 'dc_birthday', act: 2, pathAffinity: [], weight: 0, chainOnly: true,
    art: 'ev_dc_birthday', context: 'NIGHT TWO — the double booking',
    prompt: 'The “venue” is a community hall booked for both your show AND Braydenn’s 7th birthday party (the extra N is silent). The parents look at you. The children look at you. Braydenn, birthday-drunk on juice, points at your instrument and yells “DO IT.”',
    tags: ['tour', 'live'],
    choices: {
      left: {
        label: 'Play the birthday. Full show. No irony.',
        governingStats: { creativity: 0.6, network: 0.6 },
        tags: ['live', 'mainstream'],
        outcomes: {
          bad: { text: 'Your catalog is not seven-year-old compatible. You improvise a song about dinosaurs that collapses under scrutiny — Braydenn has QUESTIONS about the fossil record. You escape during cake.', effects: { fame: 2, burnout: 4, chainEventId: 'dc_lastnight' } },
          good: { text: 'You turn the set into a rock show FOR children — call and response, drum solos on cake tins, Braydenn on tambourine. Twenty kids scream like it’s a stadium. Because to them it is.', effects: { fame: 4, network: 3, cred: 2, chainEventId: 'dc_lastnight' } },
          incredible: { text: 'The birthday set transcends. Parents film everything; one mom’s post — “hired a real band?? for BRAYDENN??” — does numbers regionally. Braydenn, interviewed for the local paper, calls you “the best band of my life.” He is seven. It still counts.', effects: { fame: 8, network: 4, cred: 3, money: 80, chainEventId: 'dc_lastnight' } },
        },
      },
      right: {
        label: 'Split the hall. Two shows, one wall of chairs.',
        governingStats: { network: 0.9 },
        tags: ['safe'],
        outcomes: {
          bad: { text: 'The chair wall fails immediately — children treat it as siege equipment. Your set gains a seven-year-old heckler with a juice mustache and unlimited confidence. You lose the exchange.', effects: { fame: 2, burnout: 5, chainEventId: 'dc_lastnight' } },
          good: { text: 'Diplomatic triumph: you negotiate set times with a room mom like it’s Yalta. Your half of the hall gets eleven real listeners. The birthday side gets your bass player for “Happy Birthday.” Everyone wins.', effects: { network: 4, cred: 2, burnout: 2, chainEventId: 'dc_lastnight' } },
          incredible: { text: 'The two events merge organically at cake time — your encore is “Happy Birthday” in three keys with twenty kids and eleven adults singing. A grandmother books you for a wedding ON THE SPOT. Cash deposit. The Dirt Circuit provides.', effects: { network: 5, money: 150, fame: 3, grantHustle: 'wedding_circuit', chainEventId: 'dc_lastnight' } },
        },
      },
    },
  },
  {
    id: 'dc_lastnight', act: 2, pathAffinity: [], weight: 0, chainOnly: true,
    art: 'ev_dc_last', context: 'NIGHT THREE — the room Gary was weirdly sincere about',
    prompt: 'Last stop: a hundred-year-old opera house in a town of six hundred, kept alive by one furious volunteer committee. It seats 300. It is FULL. Nobody told you towns like this save it up all year for whoever survives the circuit to reach them.',
    tags: ['tour', 'live'],
    choices: {
      left: {
        label: 'Give them everything left',
        governingStats: { skill: 0.6, cred: 0.6 },
        tags: ['live', 'risky'],
        outcomes: {
          bad: { text: 'You’re running on fumes and gas-station coffee, and the set is held together with tape — but rooms like this forgive everything except not trying. You try. They stand anyway. You cry a little in the van.', effects: { fame: 5, cred: 4, burnout: 6 } },
          good: { text: 'The opera house acoustics turn your road-worn set into something bigger than you brought. Three hundred people who chose you over television give you everything back doubled. THIS is why the asterisk was worth it.', effects: { fame: 8, cred: 6, creativity: 2, burnout: 4 } },
          incredible: { text: 'Whatever the blizzard, the birthday, and Big Susan built in you comes out tonight — the best show of your life, witnessed by a town that will now claim you forever. The committee inducts you into a hall of fame that is, physically, a hallway. You have never been prouder of anything.', effects: { fame: 12, cred: 8, creativity: 3, network: 3, burnout: 4, pathProgress: 1 } },
        },
      },
      right: {
        label: 'Pace it. End the tour standing.',
        governingStats: { skill: 0.8 },
        tags: ['live', 'safe'],
        outcomes: {
          bad: { text: 'You play it smart and safe, and the room deserved slightly more madness. Still: three nights, three towns, zero deaths. Gary calls it “a flawless run,” asterisk finally silent.', effects: { fame: 4, cred: 3, burnout: 2 } },
          good: { text: 'A measured, professional set — and the discipline reads as class in a room this old. The committee approves. The tour ends with your voice intact and the van pointed home.', effects: { fame: 6, cred: 4, skill: 2, burnout: 1 } },
          incredible: { text: 'You pace the set like a veteran and land the finale with fuel to spare — then play two encores BECAUSE you saved something. The committee’s president shakes your hand slowly. “Most acts arrive empty. You arrived smart.” Booked for next year before load-out.', effects: { fame: 8, cred: 5, skill: 3, network: 3 } },
        },
      },
    },
  },
  {
    id: 'a2_venue_trouble', act: [2, 3], pathAffinity: [], weight: 11,
    requires: { venueAny: true, moneyMin: 150 },
    art: 'ev_venue_trouble', context: 'Your home venue. A notice on the door.',
    prompt: 'The room that made you — YOUR room — has sixty days before the landlord “explores mixed-use retail.” The owner won’t ask for help. The regulars already started a jar. The jar has $34 and a guitar pick in it.',
    tags: ['network', 'home'],
    choices: {
      left: {
        label: 'Headline the rent-party benefit',
        governingStats: { network: 0.7, cred: 0.5 },
        tags: ['live', 'network', 'risky'],
        outcomes: {
          bad: { text: 'The benefit draws the faithful — all thirty of them — and clears enough for one month. Not a save. A stay. But the owner cries in the walk-in, and the room limps on with your name on the effort.', effects: { money: -150, cred: 4, network: 3, venueLove: 1 } },
          good: { text: 'You headline, everyone you’ve ever gigged with plays for free, and the “SAVE THE ROOM” shirts sell three print runs. Rent secured through the year. The chalkboard now reads: EST. WHENEVER — SAVED [this year].', effects: { money: -150, cred: 6, network: 5, fame: 3, venueLove: 2 } },
          incredible: { text: 'The benefit outgrows the room and spills into the street, which becomes A STORY, which becomes city council attention, which becomes a heritage designation. The landlord’s mixed-use dreams die in committee. The room is SAFE — and its stage now has a plaque with your name misspelled, permanently, beloved.', effects: { money: -150, cred: 8, network: 7, fame: 5, venueLove: 3 } },
        },
      },
      right: {
        label: 'Quietly cover a month yourself',
        governingStats: { cred: 0.9 },
        tags: ['safe', 'home'],
        outcomes: {
          bad: { text: 'You slip the owner an envelope “from a fan.” They know. Of course they know — nobody else has envelope money. The month buys time; the secret buys something warmer.', effects: { money: -200, cred: 3, venueLove: 1 } },
          good: { text: 'The anonymous month becomes an anonymous quarter as two other “fans” — inspired by rumors of the first envelope — do the same. The owner posts a sign: “TO THE ENVELOPES: the coffee is free forever.” Yours always was.', effects: { money: -200, cred: 5, network: 2, venueLove: 2 } },
          incredible: { text: 'Years from now, the story will surface — the broke musician who covered the room’s rent the month everything almost ended — and it will be told wrong in your favor forever. Tonight it’s simpler: the lights stay on, and the owner nods at you across the bar for one full second. That’s the whole ceremony. It’s enough.', effects: { money: -200, cred: 7, venueLove: 3 } },
        },
      },
    },
  },
  {
    id: 'a2_truce_tour', act: 2, pathAffinity: [], weight: 10,
    requires: { rivalryMax: 1 },
    art: 'ev_truce', context: '{rival}, holding two coffees, one for you',
    prompt: 'Somewhere along the way the feud became a friendship, and now {rival} has a proposal: a joint tour. Two names, one van, split everything. “We draw better together. You know it. I know it. My accountant knows it.”',
    tags: ['tour', 'rival'],
    choices: {
      left: {
        label: 'The Truce Tour. Book it.',
        governingStats: { network: 0.8 },
        tags: ['tour', 'live', 'safe'],
        outcomes: {
          bad: { text: 'Two bands in one van is a chemistry experiment. Night four, the argument about the thermostat lasts longer than either set. But the shows — the shows are undeniable, and you finish the run still friends. Mostly.', effects: { fame: 6, network: 3, burnout: 7, money: 150 } },
          good: { text: 'The double bill outdraws both solo acts combined. Every night ends with one shared encore that neither crowd expects and both demand. The poster — two names, one lightning bolt — becomes a shirt. The shirt sells OUT.', effects: { fame: 10, network: 5, money: 250, burnout: 5 } },
          incredible: { text: 'The Truce Tour becomes a scene legend — the feud that ended in a co-headline so good promoters now engineer rivalries hoping for the sequel. The final night, you play each other’s songs. Nobody tells the crowd. Everybody knows.', effects: { fame: 15, network: 7, cred: 5, money: 350, burnout: 5, pathProgress: 1 } },
        },
      },
      right: {
        label: 'Stay solo. Protect the mystery.',
        governingStats: { cred: 0.8 },
        tags: ['indie', 'safe'],
        outcomes: {
          bad: { text: 'You pass, kindly. {rival} tours with someone else and it goes fine, which is somehow worse than it going badly. The coffee was good though.', effects: { cred: 3, burnout: -3 } },
          good: { text: '“Some things work BECAUSE they never happen,” you say, and {rival} quotes it in their next interview, credited. The almost-tour becomes better mythology than the tour.', effects: { cred: 5, fame: 3, burnout: -3 } },
          incredible: { text: 'You counter-propose: one show a year, unannounced, different city each time. {rival} extends a hand. The annual secret show becomes the scene’s favorite rumor — and it’s TRUE, which no one believes.', effects: { cred: 7, fame: 5, network: 3, burnout: -3 } },
        },
      },
    },
  },
  {
    id: 'a2_diss_track', act: 2, pathAffinity: [], weight: 10,
    requires: { rivalryMin: 8 },
    art: 'ev_diss', context: 'The feud has a soundtrack now',
    prompt: '{rival} released a song. It’s about you. It’s NOT subtle — your haircut is mentioned by name. It’s also, insultingly, kind of good. The scene refreshes its feeds and waits.',
    tags: ['rival', 'write'],
    choices: {
      left: {
        label: 'Answer in kind. Write the diss.',
        minigame: 'ideas',
        governingStats: { creativity: 0.8, cred: 0.4 },
        tags: ['write', 'risky', 'rival'],
        outcomes: {
          bad: { text: 'Your diss track rhymes “poser” with “composer,” which even your fans rate as “a reach.” {rival} responds by simply reposting it. Cold. Effective. The feud ledger tilts their way this round.', effects: { creativity: 3, fame: 3, cred: -2, rivalry: 1, burnout: 3 } },
          good: { text: 'Your answer track lands clean: specific, funny, no haircuts harmed. The scene declares this the best feud since the Petersen Twins stopped speaking (to each other, in harmony). Streams up on BOTH sides.', effects: { creativity: 5, fame: 7, cred: 3, rivalry: 1 } },
          incredible: { text: 'The diss is so good it transcends the feud — people who’ve never heard of either of you quote the bridge. {rival} concedes in the most public way possible: covering it live. The war is over. You won the war AND the publishing.', effects: { creativity: 7, fame: 12, cred: 5, hits: 1, rivalry: -2 } },
        },
      },
      right: {
        label: 'Respond with 15 seconds of silence',
        governingStats: { cred: 0.9 },
        tags: ['indie', 'risky'],
        outcomes: {
          bad: { text: 'You post a video: you, listening to their track, expressionless, then 15 seconds of silence. The internet decides you’re “processing.” {rival} posts a timer emoji. You’ve been out-postured, briefly.', effects: { cred: 2, fame: 2, rivalry: 1 } },
          good: { text: 'The silence video lands as devastating restraint. “The loudest thing anyone posted this week,” says the scene blog. {rival}’s track now sounds like shouting at a monastery.', effects: { cred: 6, fame: 5 } },
          incredible: { text: 'Your silence becomes a FORMAT — artists start replying to drama with 15 seconds of quiet, credited “after you.” {rival}’s diss is now remembered mainly as the prompt for your response. Checkmate by whisper.', effects: { cred: 9, fame: 7, rivalry: -1 } },
        },
      },
    },
  },
  {
    id: 'a2_hf_camp48', act: 2, pathAffinity: ['hitfactory'], weight: 11,
    art: 'ev_camp48', context: 'A rented mansion. Fourteen writers. One weekend.',
    prompt: 'The writing camp brief, taped to every door: “48 HOURS. THE ARTIST NEEDS A SUMMER SONG. THE ARTIST HAS NOT BEEN TOLD WHICH SUMMER.” Every room has a keyboard, a candle, and someone more famous than you.',
    tags: ['write', 'studio'],
    choices: {
      left: {
        label: 'Chase the brief. Win the camp.',
        minigame: 'ideas',
        governingStats: { creativity: 0.8, network: 0.4 },
        tags: ['write', 'mainstream', 'risky'],
        outcomes: {
          bad: { text: 'Your summer song comes out autumnal — great bones, wrong season. It loses the camp but a producer pockets the bridge “for later.” In this economy, bridges are currency.', effects: { creativity: 4, network: 3, burnout: 5 } },
          good: { text: 'Hour 46: your hook survives the writers’ room gauntlet — the highest honor fourteen sharks can bestow. The demo goes “to the artist,” which is camp-speak for purgatory, but YOUR name is on it twice.', effects: { creativity: 6, network: 4, money: 200, burnout: 4 } },
          incredible: { text: 'Your song WINS the camp — cut live on the last night with the artist singing YOUR melody line unchanged, which the room informs you has happened three times in camp history. The splits meeting has eleven writers. The hook is undilutably yours.', effects: { creativity: 8, network: 5, money: 350, hits: 1, burnout: 4, pathProgress: 1 } },
        },
      },
      right: {
        label: 'Ignore the brief. Write the weird one.',
        governingStats: { creativity: 1.0 },
        tags: ['write', 'indie', 'risky'],
        outcomes: {
          bad: { text: 'Your off-brief song clears the room in the bad way — “interesting” (death), “brave” (double death). You drive home with a b-side and your dignity, split evenly.', effects: { creativity: 5, cred: 2, burnout: 4, writeSong: true } },
          good: { text: 'The weird one doesn’t win the camp; it wins the CAMPERS. Three writers ask for sessions. The artist’s A&R quietly requests “whatever that was” for a different, stranger project.', effects: { creativity: 7, network: 4, cred: 3, burnout: 3, writeSong: true } },
          incredible: { text: 'The brief song wins the weekend; your weird one wins the year. It leaks from the camp, gets passed producer-to-producer like contraband, and lands on a critical darling’s album AS IS. The camp invites you back “to ignore the brief again.”', effects: { creativity: 9, cred: 5, hits: 1, money: 250, pathProgress: 1 } },
        },
      },
    },
  },
  {
    id: 'a3_hf_placement', act: 3, pathAffinity: ['hitfactory'], weight: 11,
    art: 'ev_placement', context: 'A music supervisor with 90 seconds and a salad',
    prompt: '“Prestige streaming drama. Season finale. The scene: a wedding AND a funeral. Same scene. Don’t ask. I need the song by Friday and I need it to hurt.” She has heard 200 pitches this week. Yours is number 201.',
    tags: ['write', 'deal'],
    choices: {
      left: {
        label: 'Pitch the vault’s saddest banger',
        governingStats: { creativity: 0.7, network: 0.5 },
        tags: ['deal', 'mainstream'],
        outcomes: {
          bad: { text: 'She listens to eleven seconds. “Too sad.” Eleven more. “Now too banger.” The salad ends; the meeting ends with it. But she keeps the file, and supervisors NEVER keep files.', effects: { network: 3, cred: 2 } },
          good: { text: 'She stops chewing at the pre-chorus — the supervisor tell. “This could work for the vows-into-eulogy pivot.” A sentence that will pay your rent for a year. Friday delivery, confirmed.', effects: { money: 400, network: 4, fame: 3 } },
          incredible: { text: 'The song scores the scene, the scene breaks the internet, and for one week your pre-chorus IS television. Licensing calls arrive from three continents. The vault is now a bank.', effects: { money: 650, network: 6, fame: 7, hits: 1, pathProgress: 1 } },
        },
      },
      right: {
        label: 'Write it fresh, to picture, by Friday',
        minigame: 'take',
        governingStats: { skill: 0.6, creativity: 0.6 },
        tags: ['write', 'studio', 'risky'],
        outcomes: {
          bad: { text: 'Writing to a scene you’ve only heard described is composing a portrait over the phone. Friday’s song fits a DIFFERENT scene — which she buys for episode four, at episode-four money. Lesson logged.', effects: { creativity: 4, money: 150, burnout: 5 } },
          good: { text: 'You score the wedding-funeral like you’ve attended both simultaneously. “It hurts correctly,” she says — the five-star review of her species. The check clears before the episode airs.', effects: { creativity: 6, money: 450, network: 4, burnout: 4 } },
          incredible: { text: 'The custom cue becomes the show’s musical identity — they re-license it for the title sequence, the trailer, and a car ad that makes everyone involved slightly rich and slightly embarrassed. “Number 201,” she toasts at the wrap party. “Two hundred people pitched me songs. One person asked what the scene needed.”', effects: { creativity: 8, money: 700, network: 6, fame: 5, hits: 1, pathProgress: 1 } },
        },
      },
    },
  },
  {
    id: 'a3_hf_heir', act: 3, pathAffinity: ['hitfactory'], weight: 10,
    art: 'ev_heir', context: 'A 19-year-old with your exact old haircut',
    prompt: 'The kid corners you at a session: they’ve studied your writing credits like scripture, can name your uncredited hooks BY EAR, and just got signed to write for the same machine that’s grinding you. “Teach me the vault trick,” they say. You never told anyone about the vault trick.',
    tags: ['write', 'network'],
    choices: {
      left: {
        label: 'Teach them everything. Build an heir.',
        governingStats: { cred: 0.7, network: 0.5 },
        tags: ['network', 'safe'],
        outcomes: {
          bad: { text: 'You teach; they learn TOO fast. Within a month the kid out-pitches you for a placement using your own trick, then credits you in the trades, which softens exactly none of it. Mentorship: a beautiful way to fund your competition.', effects: { cred: 4, network: 3, money: -50 } },
          good: { text: 'You split a session a week with the kid. Their hunger sharpens your craft; your scars save them years. The first co-write sells immediately — the machine loves a lineage story almost as much as a hook.', effects: { cred: 6, network: 5, creativity: 3, money: 200 } },
          incredible: { text: 'The kid becomes your co-writer, then your secret weapon, then — in the trades, without warning — “the protégé of the best uncredited writer alive.” The industry finally looks up your credits, ALL of them. The heir crowned the parent. Neither of you writes uncredited again.', effects: { cred: 9, network: 6, fame: 6, money: 300, pathProgress: 1 } },
        },
      },
      right: {
        label: '“The vault trick dies with me.”',
        governingStats: { creativity: 0.8 },
        tags: ['indie', 'risky'],
        outcomes: {
          bad: { text: 'You decline, kindly. The kid reverse-engineers the trick in six weeks anyway — talent is rude like that — and does it slightly BETTER. You sleep fine. Mostly fine.', effects: { creativity: 3, cred: 1, burnout: 3 } },
          good: { text: '“Some tricks you have to find yourself, or they don’t work.” The kid glares, goes away, and comes back a year later having found a DIFFERENT trick. You trade, one for one, like spies. Fair.', effects: { creativity: 5, cred: 4, network: 2 } },
          incredible: { text: 'Your refusal becomes the kid’s villain origin story — they build a whole style AGAINST yours, and the machine feeds on the tension for years. Two schools of hooks now duel across the charts, and interviewers ask you both about it. You never confirm. The mystery compounds like interest.', effects: { creativity: 7, cred: 6, fame: 5 } },
        },
      },
    },
  },
  {
    id: 'a2_afterparty', act: 2, pathAffinity: [], weight: 11,
    art: 'ev_afterparty', context: 'Somebody’s loft. Everybody’s business cards.',
    prompt: 'The showcase afterparty. Dario is here. Grub is here. A blogger who spells your name three ways is here. A&R Kim — the actual reason anyone came — is here. Everyone is one drifting conversation away from forgetting you exist.',
    tags: ['network'],
    choices: {
      left: {
        label: 'Work the entire room',
        minigame: 'room',
        governingStats: { network: 1.0 },
        tags: ['network', 'risky'],
        outcomes: {
          bad: { text: 'You spread yourself across four conversations like too little butter. Dario now believes your band is called “anyway, so.” The blogger prints it.', effects: { network: 2, burnout: 5, fame: 1 } },
          good: { text: 'You keep every plate spinning — a nod here, a callback joke there, one genuinely useful sentence to Kim. Four people leave thinking they had your full attention. Four people are wrong. All four will take your call.', effects: { network: 7, cred: 2, fame: 2, burnout: 3 } },
          incredible: { text: 'By midnight you’ve introduced the blogger to Dario, gotten Grub a mixing credit, and heard Kim say “send me the record” — a sentence with a dollar value. The room worked YOU into its plans.', effects: { network: 10, cred: 3, money: 100, fame: 3, pathProgress: 1 } },
        },
      },
      right: {
        label: 'Guard the snack table with Grub',
        governingStats: { cred: 0.8 },
        tags: ['safe', 'rest'],
        outcomes: {
          bad: { text: 'You and Grub discuss compressors for two hours. Kim leaves without meeting you. The nachos, at least, were load-bearing.', effects: { burnout: -4, network: -1, cred: 2 } },
          good: { text: 'One real conversation beats ten drifting ones. Grub tells you which studios pad their invoices. This information is worth more than the party.', effects: { burnout: -5, cred: 4, network: 2 } },
          incredible: { text: 'Turns out Kim ALSO hates these things. She finds the snack table, and the three of you close the party talking about records that matter. “Send me yours,” she says. Sincerity: the rarest networking strategy.', effects: { burnout: -5, cred: 5, network: 6 } },
        },
      },
    },
  },
  {
    id: 'a3_gala_circuit', act: 3, pathAffinity: ['megastar'], weight: 10,
    requires: { fameMin: 30 },
    art: 'ev_gala', context: 'A charity gala. You’re the entertainment AND the guest.',
    prompt: 'Post-set, tuxedo-adjacent, you’re released into a room of people who could fund your next three albums by mistake. Your manager’s text: “TALK TO EVERYONE. BE NORMAL. DO NOT RANK THEIR WATCHES.”',
    tags: ['network', 'fame'],
    choices: {
      left: {
        label: 'Circulate like a professional',
        minigame: 'room',
        governingStats: { network: 0.8, cred: 0.4 },
        tags: ['network', 'mainstream'],
        outcomes: {
          bad: { text: 'You call a hedge fund manager “chief” twice and a duchess “dude” once. The donations continue, but pointedly not toward you.', effects: { network: 2, fame: 2, burnout: 6 } },
          good: { text: 'You navigate the room like a set list: openers, deep cuts, big closer with the museum board. Two “people will call people” promises — the gala currency.', effects: { network: 7, fame: 4, money: 150, burnout: 4 } },
          incredible: { text: 'You leave with a patron. An actual patron, like it’s 1780. She says the word “residency” and a number with a comma in it. Your manager frames the napkin she wrote it on.', effects: { network: 9, fame: 5, money: 400, burnout: 4, pathProgress: 1 } },
        },
      },
      right: {
        label: 'Find the kitchen, thank the staff',
        governingStats: { cred: 1.0 },
        tags: ['indie', 'safe'],
        outcomes: {
          bad: { text: 'The caterers are lovely and also extremely busy, and you are extremely in the way. A tray nearly dies. You retreat with six crab puffs and no contacts.', effects: { cred: 2, burnout: -3 } },
          good: { text: 'The kitchen loves you. The bartender knows every promoter in town — the REAL directory. You leave with three numbers the gala floor doesn’t have.', effects: { cred: 5, network: 4, burnout: -4 } },
          incredible: { text: 'The head caterer’s kid runs sound at the amphitheater. The bartender’s cousin books the festival. By the dishwasher station you assemble a better rolodex than the ballroom holds — and the staff meal beats the canapés.', effects: { cred: 7, network: 7, burnout: -5 } },
        },
      },
    },
  },
  {
    id: 'a2_tiktok_trend', act: 2, pathAffinity: ['megastar'], weight: 10,
    art: 'ev_trend', context: 'Your phone, vibrating ominously',
    prompt: 'Three seconds of your bridge is becoming A Sound. 40,000 teens are using it to reveal their haircuts.',
    tags: ['social', 'fame'],
    choices: {
      left: {
        label: 'Feed the trend',
        governingStats: { network: 1.0 },
        tags: ['social', 'mainstream'],
        outcomes: {
          bad: { text: 'You post a tutorial of your own sound. The teens find this “kind of desperate.” The teens are correct.', effects: { fame: 4, cred: -3, burnout: 4 } },
          good: { text: 'You ride it cleanly. The haircut teens follow you. Some even listen to the whole song.', effects: { fame: 14, network: 4, burnout: 4 } },
          incredible: { text: 'The sound escapes containment. A morning show explains it badly. You chart.', effects: { fame: 26, network: 6, burnout: 5, pathProgress: 1, chainEventId: 'a2c_trend_part2' } },
        },
      },
      right: {
        label: 'Ignore it. Art is forever.',
        governingStats: { cred: 1.0, creativity: 0.5 },
        tags: ['indie'],
        outcomes: {
          bad: { text: 'The trend dies without you. A sea shanty account absorbs your teens.', effects: { cred: 3, fame: -2 } },
          good: { text: 'Your aloofness reads as mystique. Mystique trends slower but ages better.', effects: { cred: 6, creativity: 3, fame: 3 } },
          incredible: { text: '“The one artist who didn’t chase it” becomes the story. Journalists love a refusal arc.', effects: { cred: 9, fame: 8, creativity: 3 } },
        },
      },
    },
  },
  {
    id: 'a2c_trend_part2', act: 2, pathAffinity: ['megastar'], weight: 0, chainOnly: true,
    art: 'ev_trend2', context: 'Brand emails: 47',
    prompt: 'The sound is everywhere. A haircare conglomerate wants a “Part 2” — same bridge, but about conditioner.',
    tags: ['deal', 'fame'],
    choices: {
      left: {
        label: 'Write the conditioner remix',
        governingStats: { network: 0.8, creativity: 0.5 },
        tags: ['deal', 'mainstream'],
        outcomes: {
          bad: { text: 'The remix is cursed. It follows you. DJs play it AT you.', effects: { money: 300, cred: -6, fame: 4 } },
          good: { text: 'It’s shameless and catchy. The check clears. Your shower thoughts are sponsored now.', effects: { money: 450, fame: 10, cred: -3 } },
          incredible: { text: 'The remix outcharts the original. You are a franchise. Franchises don’t apologize.', effects: { money: 700, fame: 18, cred: -4, pathProgress: 1 } },
        },
      },
      right: {
        label: 'Drop a real single instead',
        governingStats: { creativity: 1.0 },
        tags: ['record', 'risky'],
        outcomes: {
          bad: { text: 'The single lands mid. The teens wanted conditioner. The critics wanted more. You wanted a nap.', effects: { creativity: 3, fame: 2, burnout: 5 } },
          good: { text: 'You convert a chunk of the trend into actual fans. The rare algorithm-to-human pipeline.', effects: { creativity: 5, fame: 12, cred: 4 } },
          incredible: { text: 'The single proves the moment wasn’t a fluke. “Not just a sound,” writes the blog that matters.', effects: { creativity: 7, fame: 20, cred: 6, pathProgress: 1 } },
        },
      },
    },
  },
  {
    id: 'a2_reality_show', act: 2, pathAffinity: ['megastar'], weight: 8,
    art: 'ev_reality', context: 'Casting call',
    prompt: '“BAND CAMP: a reality series where musicians live in one house and are slowly driven insane for content.” They want you.',
    tags: ['fame'],
    choices: {
      left: {
        label: 'Audition',
        governingStats: { network: 0.8, creativity: 0.4 },
        tags: ['fame', 'risky', 'mainstream'],
        outcomes: {
          bad: { text: 'You’re cast as “the difficult one” via editing. You said “no thank you” ONCE.', effects: { fame: 8, cred: -6, burnout: 8 } },
          good: { text: 'You survive four episodes with your dignity mostly intact. Rare. Marketable.', effects: { fame: 14, network: 4, burnout: 6 } },
          incredible: { text: 'You become the fan favorite by simply being normal. The bar was on the floor. You stepped over it.', effects: { fame: 24, network: 7, burnout: 6, pathProgress: 1 } },
        },
      },
      right: {
        label: 'Pass. Hard.',
        governingStats: { cred: 1.0 },
        tags: ['safe', 'indie'],
        outcomes: {
          bad: { text: 'The person they cast instead becomes briefly, annoyingly famous. You mute nine accounts.', effects: { cred: 3, burnout: 3 } },
          good: { text: 'You keep your mystery. Mystery compounds like interest.', effects: { cred: 6, creativity: 2 } },
          incredible: { text: 'The show implodes in scandal. Your “pass” becomes legend. You seem psychic. You were just tired.', effects: { cred: 9, fame: 5, network: 3 } },
        },
      },
    },
  },
  {
    id: 'a2_image_consultant', act: 2, pathAffinity: ['megastar'], weight: 8,
    art: 'ev_image', context: 'Brandi, Image Architect™',
    prompt: '“Your look says open mic. We want it to say arena. For $150 I can find your Silhouette.”',
    tags: ['fame', 'deal'],
    choices: {
      left: {
        label: 'Pay for the Silhouette ($150)',
        governingStats: { network: 0.8 },
        tags: ['fame', 'mainstream'],
        cost: 150,
        outcomes: {
          bad: { text: 'The Silhouette involves a cape. You commit to the cape. The cape commits to nothing.', effects: { money: -150, fame: 4, cred: -3 } },
          good: { text: 'New look lands. Photos of you now look like Photos Of You.', effects: { money: -150, fame: 10, network: 3 } },
          incredible: { text: 'Brandi finds it: one jacket, one stance, instantly iconic. Thumbnails obey you now.', effects: { money: -150, fame: 18, network: 4, cred: 2, pathProgress: 1 } },
        },
      },
      right: {
        label: 'Keep the cargo shorts',
        governingStats: { cred: 1.0 },
        tags: ['indie', 'safe'],
        outcomes: {
          bad: { text: 'A fashion account posts your outfit with the caption “no notes (derogatory).”', effects: { cred: 2, fame: -1 } },
          good: { text: 'The shorts become a bit. Authenticity: it’s free and machine-washable.', effects: { cred: 5, fame: 3 } },
          incredible: { text: 'The shorts trend. Brandi calls YOU for a consult. You invoice her. The circle completes.', effects: { cred: 7, fame: 8, money: 100 } },
        },
      },
    },
  },
  {
    id: 'a2_opening_slot', act: 2, pathAffinity: ['megastar'], weight: 9,
    art: 'ev_opener', context: 'Tour manager, mid-crisis',
    prompt: 'A mid-tier star’s opener just quit. You’re offered the slot tonight — to a crowd famous for hating openers.',
    tags: ['live', 'fame'],
    choices: {
      left: {
        label: 'Win the hostile crowd',
        minigame: 'crowd',
        governingStats: { network: 0.5, skill: 0.8 },
        tags: ['live', 'risky', 'mainstream'],
        outcomes: {
          bad: { text: 'They chant the headliner’s name during your ballad. Character-building. Characters everywhere.', effects: { fame: 5, burnout: 9, skill: 3 } },
          good: { text: 'You win over the front third. The front third is where the phones are.', effects: { fame: 12, network: 4, burnout: 6, skill: 3 } },
          incredible: { text: 'By song four they’re chanting YOUR name. The headliner watches from side-stage, doing math.', effects: { fame: 22, network: 7, cred: 5, burnout: 6, pathProgress: 1 } },
        },
      },
      right: {
        label: 'Play it safe for the bartender',
        governingStats: { skill: 1.0 },
        tags: ['live', 'safe'],
        outcomes: {
          bad: { text: 'You play a tight set to a room that is, emotionally, a hallway.', effects: { skill: 3, fame: 2, burnout: 4 } },
          good: { text: 'The bartender says you’re the best opener this tour. The bartender has seen things.', effects: { skill: 4, cred: 4, fame: 5 } },
          incredible: { text: 'The bartender is the promoter’s sibling. Your name enters The Spreadsheet of who gets calls.', effects: { skill: 4, cred: 5, network: 8, fame: 6 } },
        },
      },
    },
  },
  {
    id: 'a2_ms_stan_army', act: 2, pathAffinity: ['megastar'], weight: 9,
    art: 'ev_stans', context: 'Your fans, self-organizing',
    prompt: 'Your fans have named themselves the “Breakers,” built a wiki, and are currently feuding with another fandom over a poll you’ve never seen.',
    tags: ['fame', 'social'],
    choices: {
      left: {
        label: 'Embrace the army',
        governingStats: { network: 1.0 },
        tags: ['social', 'mainstream'],
        outcomes: {
          bad: { text: 'You reply to one Breaker and 4,000 others develop theories about what it Means. The wiki gains a “Lore” tab.', effects: { fame: 5, burnout: 6 } },
          good: { text: 'You feed them one in-joke per week. Engagement soars. The wiki is now better organized than your label.', effects: { fame: 11, network: 4, burnout: 4 } },
          incredible: { text: 'The Breakers mobilize and stream your single to a chart record. Terrifying. Useful. Terrifying.', effects: { fame: 20, network: 5, burnout: 5, pathProgress: 1 } },
        },
      },
      right: {
        label: 'Set gentle boundaries',
        governingStats: { cred: 1.0 },
        tags: ['social', 'safe'],
        outcomes: {
          bad: { text: 'Your boundaries post is screenshot into seventeen different discourse threads. The poll feud intensifies.', effects: { cred: 2, fame: -2, burnout: 4 } },
          good: { text: '“Please be normal” lands, somehow. The fandom polices itself now. Mostly.', effects: { cred: 5, fame: 3 } },
          incredible: { text: 'Your boundaries become the fandom’s constitution. Other artists ask how you did it. Nobody knows. Not even you.', effects: { cred: 8, fame: 7, network: 3 } },
        },
      },
    },
  },
  {
    id: 'a2_ms_feature', act: 2, pathAffinity: ['megastar'], weight: 9,
    art: 'ev_feature', context: 'A superstar’s manager, all smiles',
    prompt: '“She loves your song. She wants on it. Sixty percent, top billing, and we choose the single art. This is a gift.”',
    tags: ['deal', 'fame'],
    choices: {
      left: {
        label: 'Take the feature',
        governingStats: { network: 1.0 },
        tags: ['deal', 'mainstream'],
        outcomes: {
          bad: { text: 'The remix drops. Radio says “featuring YOU” so fast it sounds like a sneeze. Sixty percent of a lot is still... hm.', effects: { fame: 8, money: 200, cred: -3 } },
          good: { text: 'Her verse elevates it. Her audience finds you. The math was insulting; the exposure is real.', effects: { fame: 16, money: 300, network: 4 } },
          incredible: { text: 'The song becomes HER biggest single in years — and everyone knows whose song it was first. Leverage: banked.', effects: { fame: 24, money: 450, network: 6, pathProgress: 1 } },
        },
      },
      right: {
        label: 'Keep the song yours',
        governingStats: { cred: 0.8, creativity: 0.5 },
        tags: ['risky', 'indie'],
        outcomes: {
          bad: { text: 'Your version does fine. Her team cuts a suspiciously similar song with someone hungrier. It does better.', effects: { cred: 4, fame: 3, burnout: 3 } },
          good: { text: 'The song grows at your speed, on your name. Slower. Yours. The offer, notably, comes back later — at 50/50.', effects: { cred: 6, fame: 8, creativity: 2 } },
          incredible: { text: 'Your version explodes on its own. The superstar posts it with a crown emoji. You owe nobody sixty percent of anything.', effects: { cred: 8, fame: 18, creativity: 3, pathProgress: 1 } },
        },
      },
    },
  },
  {
    id: 'a2_ms_junket', act: 2, pathAffinity: ['megastar'], weight: 8,
    art: 'ev_junket', context: 'Press junket, hour six',
    prompt: 'Forty interviews. The same five questions. A publicist mouths your own answers along with you from behind the camera, like a stage mom.',
    tags: ['fame', 'social'],
    choices: {
      left: {
        label: 'Stay on message',
        minigame: 'interview',
        governingStats: { network: 1.0 },
        tags: ['safe', 'mainstream'],
        outcomes: {
          bad: { text: 'Your answers are so polished one outlet runs the headline “ROBOT OR RISING STAR?” with a poll. The poll is close.', effects: { fame: 4, burnout: 6 } },
          good: { text: 'Clean quotes, zero scandals, forty checkmarks. The publicist cries a single professional tear.', effects: { fame: 9, network: 4, burnout: 5 } },
          incredible: { text: 'One perfectly-crafted soundbite gets picked up everywhere. Media training: weaponized.', effects: { fame: 16, network: 5, burnout: 4, pathProgress: 1 } },
        },
      },
      right: {
        label: 'Go rogue. Answer honestly.',
        governingStats: { cred: 0.7, creativity: 0.6 },
        tags: ['risky'],
        outcomes: {
          bad: { text: 'You describe the industry as “a haunted mall.” The quote follows you to every interview forever. The publicist resigns via text.', effects: { cred: 3, fame: 4, network: -3 } },
          good: { text: 'The honest interview is the only one anyone remembers. Journalists start requesting you specifically.', effects: { cred: 6, fame: 8, network: 2 } },
          incredible: { text: 'Your unfiltered hour becomes a masterclass in charisma. Late shows call. The publicist un-resigns.', effects: { cred: 7, fame: 14, network: 5, chainEventId: 'a2c_ms_quote' } },
        },
      },
    },
  },
  {
    id: 'a2c_ms_quote', act: 2, pathAffinity: ['megastar'], weight: 0, chainOnly: true,
    art: 'ev_quote', context: 'The haunted mall follows you home',
    prompt: 'One line from your interview — “fame is a haunted mall” — is now a meme, a mural downtown, and, as of this morning, an unlicensed T-shirt.',
    tags: ['fame', 'deal'],
    choices: {
      left: {
        label: 'Sell the official shirt',
        governingStats: { network: 0.8 },
        tags: ['deal', 'mainstream'],
        outcomes: {
          bad: { text: 'Your official shirt ships late and slightly haunted (the ink smells). The bootleg remains superior. Respect.', effects: { money: 120, fame: 3, cred: -2 } },
          good: { text: 'The drop sells out in a day. You are now a phrase people wear. Surreal. Profitable. Surreal.', effects: { money: 300, fame: 8, grantHustle: 'merch_line' } },
          incredible: { text: 'The shirt funds the next tour. The mural artist collabs on the album cover. The mall metaphor completes itself.', effects: { money: 500, fame: 12, network: 4, pathProgress: 1, grantHustle: 'merch_line' } },
        },
      },
      right: {
        label: 'Let the meme run free',
        governingStats: { cred: 1.0 },
        tags: ['indie', 'safe'],
        outcomes: {
          bad: { text: 'A fast-fashion brand trademarks YOUR quote. Their lawyers send YOU a cease and desist. The mall was haunted after all.', effects: { cred: 3, fame: 3, burnout: 4 } },
          good: { text: 'Unmonetized, the quote stays cool forever. “They never sold out the mall thing” becomes part of your legend.', effects: { cred: 7, fame: 5 } },
          incredible: { text: 'The meme becomes shorthand for the whole industry. Your name is cited in a dictionary of slang. Immortality, lowercase.', effects: { cred: 9, fame: 9, creativity: 3 } },
        },
      },
    },
  },
  // ---- Act 2: STUDIO LEGEND ----
  {
    id: 'a2_session_sub', act: 2, pathAffinity: ['studio'], weight: 10,
    art: 'ev_session', context: 'Unknown number, 8:12 a.m.',
    prompt: '“Our player broke a finger bowling. Session’s at ten. Charts are… let’s say charts-adjacent. You in?”',
    tags: ['studio'],
    choices: {
      left: {
        label: 'Take the session',
        minigame: 'take',
        governingStats: { skill: 1.0 },
        tags: ['studio', 'risky'],
        outcomes: {
          bad: { text: 'You sight-read like someone describing music over the phone. They’re polite about it. Devastating.', effects: { skill: 4, cred: -2, burnout: 6, money: 80 } },
          good: { text: 'You hold it down. The engineer gives you the nod. The nod is everything here.', effects: { skill: 6, cred: 5, money: 150, network: 3 } },
          incredible: { text: 'One take. ONE. The producer writes your number on the studio wall. That wall is sacred.', effects: { skill: 8, cred: 8, money: 220, network: 5, pathProgress: 1 } },
        },
      },
      right: {
        label: 'Recommend a friend',
        governingStats: { network: 1.0 },
        tags: ['network', 'safe'],
        outcomes: {
          bad: { text: 'The friend flakes. Your recommendation now has an asterisk in this town.', effects: { network: -2, cred: -2 } },
          good: { text: 'The friend nails it and owes you one. The debt economy grows.', effects: { network: 6, cred: 3 } },
          incredible: { text: 'The friend credits you by name to the producer. Class act. Your phone starts warming up.', effects: { network: 8, cred: 5, pathProgress: 1 } },
        },
      },
    },
  },
  {
    id: 'a2_jingle', act: 2, pathAffinity: ['studio'], weight: 9,
    art: 'ev_jingle', context: 'Mattress Emporium of the Tri-County Area',
    prompt: 'They need a 30-second jingle. The brief: “make people feel like sleep is possible again.” Budget: real.',
    tags: ['studio', 'work'],
    choices: {
      left: {
        label: 'Deliver flawless product',
        governingStats: { skill: 1.0 },
        tags: ['studio', 'safe'],
        outcomes: {
          bad: { text: 'Seven rounds of revisions. The final note is the client’s nephew humming. You mix the hum.', effects: { skill: 3, money: 120, burnout: 6 } },
          good: { text: 'Clean, catchy, done in a day. The client cries a little. Mattress people feel deeply.', effects: { skill: 5, money: 200, cred: 3 } },
          incredible: { text: 'The jingle becomes regionally iconic. Children sing it. You are the Tri-County Mozart.', effects: { skill: 6, money: 300, cred: 5, fame: 4, pathProgress: 1, grantHustle: 'jingle_residuals' } },
        },
      },
      right: {
        label: 'Sneak art into the jingle',
        governingStats: { creativity: 1.0 },
        tags: ['studio', 'risky', 'indie'],
        outcomes: {
          bad: { text: 'The client asks why the mattress jingle is “in a sad key.” There is no meeting after this meeting.', effects: { creativity: 4, money: 40, cred: -1 } },
          good: { text: 'You hide a gorgeous chord change at second 22. Musicians text you about it for years.', effects: { creativity: 6, money: 150, cred: 5 } },
          incredible: { text: 'The “jingle” gets written up as outsider art. The mattress sells out. Everyone misunderstands beautifully.', effects: { creativity: 8, money: 200, cred: 7, fame: 5 } },
        },
      },
    },
  },
  {
    id: 'a2_click_track', act: 2, pathAffinity: ['studio'], weight: 9,
    art: 'ev_click', context: 'A producer, not unkindly',
    prompt: '“You’re rushing.” Two words that end careers or start them.',
    tags: ['studio', 'practice'],
    choices: {
      left: {
        label: 'Woodshed with the metronome',
        governingStats: { skill: 1.0 },
        tags: ['practice', 'safe'],
        outcomes: {
          bad: { text: 'The click invades your dreams. You now nod to crosswalk signals. In time.', effects: { skill: 5, burnout: 7 } },
          good: { text: 'Two humbling weeks. Your time becomes A Thing People Mention.', effects: { skill: 9, cred: 3, burnout: 4 } },
          incredible: { text: 'You come back a different player. The producer notices in one bar. ONE bar.', effects: { skill: 13, cred: 5, burnout: 3, pathProgress: 1 } },
        },
      },
      right: {
        label: 'Argue feel over grid',
        governingStats: { cred: 1.0, creativity: 0.4 },
        tags: ['risky', 'roots'],
        outcomes: {
          bad: { text: '“Feel is what we call it when we can’t do it twice,” says the producer, ending you.', effects: { cred: -4, burnout: 5 } },
          good: { text: 'You cite three classic records cut without a click. Détente. Mutual respect. Coffee.', effects: { cred: 5, skill: 2 } },
          incredible: { text: 'You play it “wrong” so convincingly the producer keeps YOUR take and mutes the click. Legend behavior.', effects: { cred: 8, skill: 4, creativity: 4, pathProgress: 1 } },
        },
      },
    },
  },
  {
    id: 'a2_union', act: 2, pathAffinity: ['studio'], weight: 8,
    art: 'ev_union', context: 'Local 47-adjacent',
    prompt: 'The union rep slides a form across the table. “Scale, pension, protection. Also meetings. So many meetings.”',
    tags: ['deal', 'work'],
    choices: {
      left: {
        label: 'Pay dues, join up ($100)',
        governingStats: { cred: 1.0 },
        tags: ['deal', 'safe'],
        cost: 100,
        outcomes: {
          bad: { text: 'Your first union meeting is four hours about parking validation. Solidarity is tested. Solidarity holds.', effects: { money: -100, cred: 4, addFlag: 'union_card' } },
          good: { text: 'Card in wallet, scale rates unlocked. Older players start calling you “kid” approvingly.', effects: { money: -100, cred: 6, network: 4, addFlag: 'union_card' } },
          incredible: { text: 'The rep flags you to a contractor who staffs the big rooms. THE big rooms.', effects: { money: -100, cred: 7, network: 7, addFlag: 'union_card', pathProgress: 1 } },
        },
      },
      right: {
        label: 'Stay freelance',
        governingStats: { network: 0.8 },
        tags: ['work'],
        outcomes: {
          bad: { text: 'A session pays you in “exposure and pizza.” The pizza is exposure too: it’s cold.', effects: { money: 40, burnout: 4 } },
          good: { text: 'You undercut scale and stay busy. The hustle economy embraces its child.', effects: { money: 130, network: 3, burnout: 3 } },
          incredible: { text: 'Off-book sessions stack up. Cash-rich, meeting-free, slightly hunted.', effects: { money: 220, network: 4, skill: 3 } },
        },
      },
    },
  },
  {
    id: 'a2_producer_call', act: 2, pathAffinity: ['studio'], weight: 9,
    art: 'ev_producer', context: 'A producer whose name you’ve seen on vinyl',
    prompt: '“I need that thing you do. You know the thing.” You do not know the thing. The session is Thursday.',
    tags: ['studio'],
    choices: {
      left: {
        label: 'Deliver the thing, whatever it is',
        governingStats: { skill: 0.8, creativity: 0.6 },
        tags: ['studio'],
        outcomes: {
          bad: { text: 'You try six things. None are the thing. The thing remains at large.', effects: { skill: 3, burnout: 6, money: 60 } },
          good: { text: 'Thing number four IS the thing. Everyone pretends you knew all along. So do you.', effects: { skill: 5, cred: 5, money: 180, network: 3 } },
          incredible: { text: 'You do the thing instantly. The producer points at you like you solved music.', effects: { skill: 7, cred: 8, money: 250, network: 5, pathProgress: 1 } },
        },
      },
      right: {
        label: 'Forty takes of overdelivery',
        governingStats: { skill: 1.0 },
        tags: ['studio', 'risky'],
        outcomes: {
          bad: { text: 'Take 40 sounds like take 1 with despair on it. The producer comps take 2. Of course.', effects: { skill: 4, burnout: 11, money: 100 } },
          good: { text: 'Somewhere around take 25 you find gold. Expensive gold. Worth-it gold.', effects: { skill: 7, cred: 4, money: 160, burnout: 8 } },
          incredible: { text: 'Take 33 becomes a reference take other producers play to other players. “Like THIS.”', effects: { skill: 10, cred: 8, money: 200, burnout: 7, pathProgress: 1 } },
        },
      },
    },
  },
  {
    id: 'a2_st_ghost_solo', act: 2, pathAffinity: ['studio'], weight: 9,
    art: 'ev_ghost_solo', context: 'An NDA and a very famous band',
    prompt: 'That solo everyone’s calling “the guitar moment of the year”? You played it. Anonymously. At 2 a.m. In one take. The band’s guitarist is doing interviews about his “process.”',
    tags: ['studio', 'deal'],
    choices: {
      left: {
        label: 'Cash the check, keep the secret',
        governingStats: { cred: 0.8 },
        tags: ['studio', 'safe'],
        outcomes: {
          bad: { text: 'You watch him mime YOUR solo on TV, slightly wrong. Your eye twitches in time. The check clears. It helps. Some.', effects: { money: 250, burnout: 5, skill: 2 } },
          good: { text: 'Word travels in the only circle that matters: producers. “That was you?” Yes. It was.', effects: { money: 300, cred: 6, network: 4 } },
          incredible: { text: 'The band quietly books you for the ENTIRE next album. The guitarist thanks you at the door. Growth.', effects: { money: 400, cred: 8, network: 6, pathProgress: 1 } },
        },
      },
      right: {
        label: 'Let the truth leak, deniably',
        governingStats: { network: 0.8 },
        tags: ['risky', 'social'],
        outcomes: {
          bad: { text: 'The leak traces straight back to you. NDA lawyers write letters with your name spelled very correctly.', effects: { money: -100, cred: -3, burnout: 6 } },
          good: { text: 'A gear forum figures it out from the amp hum. You confirm nothing. Your rate doubles anyway.', effects: { cred: 6, fame: 4, network: 4 } },
          incredible: { text: 'The story becomes industry legend — “the 2 a.m. take.” You never confirm it. You never have to.', effects: { cred: 9, fame: 7, network: 5, pathProgress: 1 } },
        },
      },
    },
  },
  {
    id: 'a2_st_gear_lord', act: 2, pathAffinity: ['studio'], weight: 8,
    art: 'ev_gearlord', context: 'A producer with a museum, not a studio',
    prompt: '“We only track through gear older than your parents. That compressor? It has war stories. Touch nothing without gloves.”',
    tags: ['studio', 'tone'],
    choices: {
      left: {
        label: 'Master the museum pieces',
        governingStats: { skill: 1.0 },
        tags: ['studio', 'tone', 'safe'],
        outcomes: {
          bad: { text: 'You spend four hours learning a tape machine and eleven seconds erasing the wrong reel with it. The silence has war stories now.', effects: { skill: 4, cred: -2, burnout: 6 } },
          good: { text: 'The old gear rewards patience. Your takes come back warmer, slower, better. Fine. FINE. The producer was right.', effects: { skill: 7, cred: 4, money: 150 } },
          incredible: { text: 'You coax a sound out of the haunted compressor that makes the producer sit down. “It’s never done that for anyone.”', effects: { skill: 9, cred: 7, money: 200, pathProgress: 1 } },
        },
      },
      right: {
        label: 'Propose a blind A/B test',
        governingStats: { cred: 0.7, creativity: 0.5 },
        tags: ['risky'],
        outcomes: {
          bad: { text: 'The producer fails his own test, picks the $40 plugin, and bans A/B testing from the studio forever. You are also banned. Briefly.', effects: { cred: -2, creativity: 3, burnout: 4 } },
          good: { text: 'The test ends in a draw and a two-hour conversation about what “warmth” even means. Mutual respect: achieved.', effects: { cred: 5, creativity: 3, skill: 2 } },
          incredible: { text: 'The blind test becomes a monthly ritual and YOU become its referee. The museum now has a scientist in residence.', effects: { cred: 8, creativity: 4, network: 4, money: 100 } },
        },
      },
    },
  },
  {
    id: 'a2_st_pit', act: 2, pathAffinity: ['studio'], weight: 8,
    art: 'ev_pit', context: 'A jukebox musical, eight shows a week',
    prompt: '“MAMMA MIA! but for nu-metal” needs a pit musician. Steady money, same 22 songs, a conductor who cries during the ballad. Every night.',
    tags: ['live', 'work'],
    choices: {
      left: {
        label: 'Take the pit',
        governingStats: { skill: 1.0 },
        tags: ['live', 'work', 'safe'],
        outcomes: {
          bad: { text: 'By week three you can play the show unconscious, and some nights, spiritually, you do.', effects: { money: 250, skill: 4, burnout: 9, creativity: -2 } },
          good: { text: 'Eight shows a week forges you into a machine with perfect time. The conductor cries; your click never does.', effects: { money: 300, skill: 7, burnout: 7 } },
          incredible: { text: 'A Broadway contractor hears the pit and asks who the ringer is. It’s you. You’re the ringer.', effects: { money: 350, skill: 9, cred: 5, network: 5, burnout: 6, pathProgress: 1 } },
        },
      },
      right: {
        label: 'Decline. Protect the ears and soul.',
        governingStats: { creativity: 0.8 },
        tags: ['safe', 'indie'],
        outcomes: {
          bad: { text: 'You skip the money and spend the month “developing your sound,” which mostly develops your napping.', effects: { creativity: 3, burnout: -4 } },
          good: { text: 'Freed from nu-metal ABBA, you take better sessions and sleep like a person.', effects: { creativity: 4, skill: 3, burnout: -6 } },
          incredible: { text: 'The session you took instead becomes a cult record. The pit, you hear, is still crying. Nightly.', effects: { creativity: 6, cred: 5, skill: 3, burnout: -5 } },
        },
      },
    },
  },
  // ---- Act 2: HIT FACTORY ----
  {
    id: 'a2_writing_camp', act: 2, pathAffinity: ['hitfactory'], weight: 10,
    art: 'ev_camp', context: 'A rented mansion with 14 writers',
    prompt: 'Pop writing camp. Every room has a beatmaker, a topliner, and a bowl of almonds. Hooks are currency here.',
    tags: ['write'],
    choices: {
      left: {
        label: 'Fight for your hook',
        governingStats: { creativity: 1.0 },
        tags: ['write', 'risky'],
        outcomes: {
          bad: { text: 'A senior writer “improves” your hook into a different, worse hook. It ships. Your almonds taste of ash.', effects: { creativity: 3, cred: -2, burnout: 6 } },
          good: { text: 'Your hook survives the room. Writers nod slowly, the highest honor available before lunch.', effects: { creativity: 6, cred: 4, hits: 1 } },
          incredible: { text: 'Your hook makes a superstar’s A&R stand up and leave the room to make calls. THE calls.', effects: { creativity: 8, cred: 6, hits: 1, network: 4, pathProgress: 1 } },
        },
      },
      right: {
        label: 'Be the vibes person',
        governingStats: { network: 1.0 },
        tags: ['network', 'safe'],
        outcomes: {
          bad: { text: 'You curate playlists and refill almonds. Your credit reads “additional atmosphere.”', effects: { network: 3, burnout: 3 } },
          good: { text: 'Everyone wants you in their room. Rooms are where splits happen.', effects: { network: 7, cred: 2, money: 80 } },
          incredible: { text: 'Your vibe unlocks the whole camp’s best week. Three writers put you on retainer.', effects: { network: 9, money: 150, cred: 3, hits: 1 } },
        },
      },
    },
  },
  {
    id: 'a2_topline_dj', act: 2, pathAffinity: ['hitfactory'], weight: 9,
    art: 'ev_topline', context: 'DJ Probability (via voice note)',
    prompt: '“Need a topline by Friday. The drop is already famous in Estonia. Don’t overthink it. Or do. I don’t know your process.”',
    tags: ['write'],
    choices: {
      left: {
        label: 'Write it by Friday',
        governingStats: { creativity: 1.0 },
        tags: ['write', 'risky'],
        outcomes: {
          bad: { text: 'You rhyme “tonight” with “tonight.” Estonia notices. Estonia is rigorous.', effects: { creativity: 3, burnout: 7, money: 60 } },
          good: { text: 'Serviceable banger delivered. It does numbers in three Baltic states.', effects: { creativity: 5, money: 180, fame: 4, hits: 1, addPromise: { label: 'Deliver the stems by Friday', tags: ['write', 'studio'], cards: 3, reward: { money: 120 }, penalty: { cred: -2 } } } },
          incredible: { text: 'The topline transcends the drop. Radio picks it up continent-wide. DJ Probability sends a jet ski photo captioned “us.”', effects: { creativity: 7, money: 300, fame: 8, hits: 1, pathProgress: 1 } },
        },
      },
      right: {
        label: 'Pass. Protect the muse.',
        governingStats: { cred: 0.8, creativity: 0.5 },
        tags: ['safe', 'indie'],
        outcomes: {
          bad: { text: 'The muse, protected, produces nothing this week. The muse is on her phone.', effects: { creativity: 2, burnout: 2 } },
          good: { text: 'You write for yourself instead. Slower, truer, yours.', effects: { creativity: 6, cred: 3 } },
          incredible: { text: 'The song you wrote instead is the best thing you’ve ever made. The muse was cooking.', effects: { creativity: 9, cred: 5, writeSong: true, addFlag: 'demo_in_pocket' } },
        },
      },
    },
  },
  {
    id: 'a2_ghostwrite', act: 2, pathAffinity: ['hitfactory'], weight: 9,
    art: 'ev_ghost', context: 'An NDA thick enough to stop a door',
    prompt: 'A superstar needs a hit. Your name appears nowhere. The check has a comma in it.',
    tags: ['write', 'deal'],
    choices: {
      left: {
        label: 'Take the ghost money',
        governingStats: { creativity: 1.0 },
        tags: ['write', 'mainstream'],
        outcomes: {
          bad: { text: 'The star “rewrites” one word and takes half. The word was “oh.”', effects: { money: 250, hits: 1, cred: -2, burnout: 4 } },
          good: { text: 'The song is everywhere. At parties, people say “this slaps” directly into your unknown face.', effects: { money: 400, hits: 1, fame: 2 } },
          incredible: { text: 'It’s the biggest song of the quarter. Insiders know. Insiders are who you need.', effects: { money: 600, hits: 1, network: 6, cred: 3, pathProgress: 1 } },
        },
      },
      right: {
        label: 'Demand a credit',
        governingStats: { cred: 1.0, network: 0.4 },
        tags: ['deal', 'risky'],
        outcomes: {
          bad: { text: 'The NDA people laugh in unison, which is somehow scarier than anger. Deal’s off.', effects: { cred: 2, burnout: 4 } },
          good: { text: 'Small print, but YOUR small print. The credit compounds forever.', effects: { money: 200, hits: 1, cred: 6 } },
          incredible: { text: 'Full credit AND points. Your name rides the hit up the chart like a barnacle on a rocket.', effects: { money: 350, hits: 1, cred: 8, fame: 6, pathProgress: 1 } },
        },
      },
    },
  },
  {
    id: 'a2_splits', act: 2, pathAffinity: ['hitfactory'], weight: 8,
    art: 'ev_splits', context: 'A conference call with 11 writers',
    prompt: 'Splits meeting. Eleven writers on one song. One of them contributed, quote, “the energy.”',
    tags: ['deal', 'write'],
    choices: {
      left: {
        label: 'Fight for your 12%',
        governingStats: { cred: 0.7, network: 0.7 },
        tags: ['deal', 'risky'],
        outcomes: {
          bad: { text: 'The energy guy’s lawyer is better than your no lawyer. You get 3% and a lesson.', effects: { cred: 2, money: 60, burnout: 6 } },
          good: { text: 'You defend your verse line by line. 12% held. The energy guy respects you now, energetically.', effects: { cred: 5, money: 200, network: 2 } },
          incredible: { text: 'You audit the session files live on the call. Silence. Then 15%. Never again questioned.', effects: { cred: 8, money: 320, network: 4, pathProgress: 1 } },
        },
      },
      right: {
        label: 'Take 4% quietly',
        governingStats: { network: 1.0 },
        tags: ['safe'],
        outcomes: {
          bad: { text: 'The song flops. 4% of nothing is a very manageable amount of nothing.', effects: { network: 2, money: 10 } },
          good: { text: 'The song does fine and everyone remembers you were easy to work with. Booked again.', effects: { network: 6, money: 90, hits: 1 } },
          incredible: { text: 'The song is a sleeper smash. 4% of enormous is plenty. And every room wants the low-drama writer.', effects: { network: 8, money: 280, hits: 1, cred: 2 } },
        },
      },
    },
  },
  {
    id: 'a2_beat_leak', act: 2, pathAffinity: ['hitfactory'], weight: 8,
    art: 'ev_leak', context: '3 a.m. notifications',
    prompt: 'Your unreleased beat leaked. A very famous rapper just freestyled over it. The freestyle is… good?',
    tags: ['write', 'social'],
    choices: {
      left: {
        label: 'Lawyer up',
        governingStats: { cred: 0.8 },
        tags: ['deal', 'risky'],
        outcomes: {
          bad: { text: 'Legal fees eat the settlement. The lawyers freestyle over your invoice.', effects: { money: -80, cred: 3, burnout: 7 } },
          good: { text: 'Quiet settlement, proper credit, retroactive respect.', effects: { money: 300, cred: 5, hits: 1 } },
          incredible: { text: 'The rapper’s team clears it properly AND cuts two more of your beats. Trojan horse complete.', effects: { money: 450, cred: 6, hits: 1, network: 6, pathProgress: 1 } },
        },
      },
      right: {
        label: 'Ride the wave',
        governingStats: { network: 1.0 },
        tags: ['social', 'mainstream'],
        outcomes: {
          bad: { text: 'You quote-post “fire 🔥” on your own stolen beat. Historians will judge you.', effects: { fame: 4, cred: -3 } },
          good: { text: 'You claim it gracefully in public. The internet does your PR for free.', effects: { fame: 10, network: 5, hits: 1 } },
          incredible: { text: 'The rapper follows you and posts “the source.” Every A&R in America opens your page at once.', effects: { fame: 16, network: 9, hits: 1, pathProgress: 1 } },
        },
      },
    },
  },

  {
    id: 'a2_open_for_hero', act: 2, pathAffinity: [], weight: 8,
    art: 'ev_hero', context: 'A promoter, checking a list twice',
    prompt: 'Your teenage hero is touring tiny rooms again. The support slot pays $50 and one (1) conversation at load-in.',
    tags: ['live', 'network'],
    choices: {
      left: {
        label: 'Take the slot',
        minigame: 'setlist',
        governingStats: { skill: 0.7, cred: 0.6 },
        tags: ['live', 'roots'],
        outcomes: {
          bad: { text: 'You’re so nervous you tune for six minutes. Your hero watches. Time is a flat circle of tuning.', effects: { skill: 3, burnout: 6, money: 50 } },
          good: { text: 'Solid set, and the load-in conversation happens. They call you “the kid with the sound.”', effects: { skill: 4, cred: 6, network: 4, money: 50 } },
          incredible: { text: 'Your hero watches your whole set from the wings, then covers YOUR song at soundcheck the next night. It gets filmed.', effects: { cred: 10, fame: 9, network: 5, money: 50, pathProgress: 1 } },
        },
      },
      right: {
        label: 'Too sacred. Just attend.',
        governingStats: { creativity: 0.8 },
        tags: ['safe', 'rest'],
        outcomes: {
          bad: { text: 'You watch from the back, taking notes on a napkin you will lose forever.', effects: { creativity: 3, burnout: -4 } },
          good: { text: 'The show refills something in you the industry had been siphoning.', effects: { creativity: 6, burnout: -8 } },
          incredible: { text: 'After the show, your hero is at the merch table. You talk for an hour. No agenda. Just music. Remember this feeling.', effects: { creativity: 8, cred: 4, burnout: -8, network: 3 } },
        },
      },
    },
  },
  {
    id: 'a2_press_piece', act: 2, pathAffinity: [], weight: 8,
    art: 'ev_press', context: 'A music blog with strong opinions and no budget',
    prompt: '“We’re doing a feature: ‘10 Artists Who Deserve Better.’ You’re number 7. Want to comment, or does the ranking speak for itself?”',
    tags: ['social', 'fame'],
    choices: {
      left: {
        label: 'Give a real interview',
        governingStats: { cred: 0.7, creativity: 0.5 },
        tags: ['social'],
        outcomes: {
          bad: { text: 'Your most vulnerable quote becomes the headline, out of context, next to a bad photo. Number 7 indeed.', effects: { fame: 3, cred: 2, burnout: 4 } },
          good: { text: 'The piece is thoughtful. Three bookers and one A&R read it on the same afternoon.', effects: { fame: 6, cred: 5, network: 4 } },
          incredible: { text: 'Your interview is so quotable the feature gets retitled around you. Numbers 1–6 seethe.', effects: { fame: 12, cred: 7, network: 4 } },
        },
      },
      right: {
        label: '“The ranking speaks for itself”',
        governingStats: { network: 0.8 },
        tags: ['social', 'risky', 'indie'],
        outcomes: {
          bad: { text: 'Your one-liner reads as bitter instead of wry. Number 8 gives a gracious interview and leapfrogs you culturally.', effects: { cred: -2, fame: 2 } },
          good: { text: 'The deadpan lands. You seem unbothered, which on the internet is indistinguishable from power.', effects: { cred: 4, fame: 5 } },
          incredible: { text: 'The quote becomes a T-shirt. Not yours — the blog’s. But everyone knows who said it. Mythology accrues.', effects: { cred: 6, fame: 10, network: 3 } },
        },
      },
    },
  },
  {
    id: 'a2_hf_ai_demo', act: 2, pathAffinity: ['hitfactory'], weight: 9,
    art: 'ev_ai_demo', context: 'An A&R, avoiding eye contact',
    prompt: '“So the label generated this demo with, um, software. It just needs a human to... make it good. Also legal says a human has to have touched it. For reasons.”',
    tags: ['write', 'deal'],
    choices: {
      left: {
        label: 'Refuse. Loudly. On principle.',
        governingStats: { cred: 1.0 },
        tags: ['risky', 'indie'],
        outcomes: {
          bad: { text: 'Your principled post gets quote-tweeted by the software company. Their reply does numbers. The machine is better at discourse too.', effects: { cred: 4, fame: 2, burnout: 4 } },
          good: { text: 'Twelve other writers follow your refusal. The label shelves the demo “for strategic reasons.” The drawer wins again — but righteously.', effects: { cred: 7, network: 4 } },
          incredible: { text: 'Your refusal becomes an open letter, the letter becomes a movement, and your next session is booked out of pure solidarity.', effects: { cred: 10, network: 6, fame: 5, pathProgress: 1 } },
        },
      },
      right: {
        label: 'Rewrite it so completely it becomes yours',
        governingStats: { creativity: 1.0 },
        tags: ['write'],
        outcomes: {
          bad: { text: 'You keep one chord and replace everything else. The A&R says “great, the AI really nailed it.” You age a year.', effects: { creativity: 4, money: 150, cred: -2, burnout: 5 } },
          good: { text: 'What ships shares zero DNA with the demo. A quiet victory for humans, invoiced at your full rate.', effects: { creativity: 6, money: 250, hits: 1 } },
          incredible: { text: 'Your “polish” is a total rewrite that becomes a smash. The software gets a gold plaque. You get the publishing. Fair trade.', effects: { creativity: 8, money: 400, hits: 1, cred: 3, pathProgress: 1 } },
        },
      },
    },
  },
  {
    id: 'a2_hf_hook_vault', act: 2, pathAffinity: ['hitfactory'], weight: 8,
    art: 'ev_vault', context: 'A publisher who has heard about The Vault',
    prompt: 'You keep a folder of 114 unused hooks. A publisher offers to buy it. All of it. Sight unseen. “Name a number,” he says, naming a number first.',
    tags: ['write', 'deal'],
    choices: {
      left: {
        label: 'Sell the vault',
        governingStats: { network: 0.8 },
        tags: ['deal', 'risky'],
        outcomes: {
          bad: { text: 'He flips hook #38 into a hit within a month. You do the math on what you left on the table. Don’t do the math. You do the math.', effects: { money: 500, creativity: -4, burnout: 5 } },
          good: { text: 'A life-changing check for melodies you’d forgotten. Weirdly light feeling. New folder starts tonight.', effects: { money: 700, creativity: -2, cred: 2 } },
          incredible: { text: 'The vault sale funds a home studio AND he cuts you in on placements. Hooks: liquid. You: liquid-adjacent.', effects: { money: 900, network: 5, hits: 1 } },
        },
      },
      right: {
        label: 'License one hook. Keep the vault.',
        governingStats: { cred: 0.7, creativity: 0.5 },
        tags: ['deal', 'safe'],
        outcomes: {
          bad: { text: 'You license hook #7. It gets attached to a crypto ad without your knowledge. #7 was your mother’s favorite.', effects: { money: 150, cred: -2 } },
          good: { text: 'One hook out, at a fair rate, with approval rights. The vault appreciates in mystery.', effects: { money: 250, cred: 3, hits: 1 } },
          incredible: { text: 'The licensed hook becomes a hit and triples the vault’s market value. Publishers now bid on RUMORS of folder names.', effects: { money: 350, cred: 5, hits: 1, network: 4, pathProgress: 1, grantHustle: 'hook_licenses' } },
        },
      },
    },
  },
  {
    id: 'a2_hf_forecaster', act: 2, pathAffinity: ['hitfactory'], weight: 8,
    art: 'ev_forecast', context: 'A “trend forecaster” with a deck of slides',
    prompt: '“Next summer is minor-key sea shanties with 808s. I’m never wrong. I predicted yacht rock’s third comeback.” The consultation costs $200.',
    tags: ['write', 'deal'],
    choices: {
      left: {
        label: 'Buy the forecast ($200)',
        governingStats: { network: 0.7 },
        tags: ['deal', 'risky', 'mainstream'],
        cost: 200,
        outcomes: {
          bad: { text: 'You write three shanty-trap hybrids. Next summer turns out to be ambient polka. He is never wrong except always.', effects: { money: -200, creativity: -2, burnout: 5 } },
          good: { text: 'The shanties land in a pirate-themed prestige drama. Not the chart, but the checks are chart-adjacent.', effects: { money: 100, hits: 1, creativity: 2 } },
          incredible: { text: 'He was RIGHT. Your shanty-808 single owns the summer. You book him annually and tell no one.', effects: { money: 250, hits: 1, fame: 8, pathProgress: 1 } },
        },
      },
      right: {
        label: 'Trust your own ears',
        governingStats: { creativity: 1.0 },
        tags: ['write', 'indie'],
        outcomes: {
          bad: { text: 'Your ears vote for a sound the market table-flips. Early. You were early. That’s the expensive kind of right.', effects: { creativity: 4, cred: 2 } },
          good: { text: 'You write what moves you and it moves enough other people. The old-fashioned supply chain.', effects: { creativity: 6, hits: 1, cred: 3 } },
          incredible: { text: 'You SET next summer’s trend. The forecaster adds your song to his slides. You invoice him for the slide.', effects: { creativity: 9, hits: 1, fame: 6, cred: 4, pathProgress: 1 } },
        },
      },
    },
  },
  // ═══════════════════════ ACT 3 — THE RECKONING ═══════════════════════
  // ---- Path-agnostic ----
  {
    id: 'a3_crash', act: 3, pathAffinity: [], weight: 14,
    requires: { burnoutMin: 35 },
    art: 'ev_crash', context: 'Your body, submitting an invoice',
    prompt: 'You fall asleep standing up, mid-conversation, at your own show. The conversation was about you.',
    tags: ['rest'],
    choices: {
      left: {
        label: 'Cancel a week. Actually stop.',
        governingStats: { cred: 0.6, network: 0.6 },
        tags: ['rest', 'safe'],
        outcomes: {
          bad: { text: 'You rest, but spend the week doomscrolling other people’s tour photos. Partial credit.', effects: { burnout: -14, fame: -2 } },
          good: { text: 'A week of sleep and soup. Your hands remember why they liked music.', effects: { burnout: -25, fame: -2, creativity: 2 } },
          incredible: { text: 'The break becomes a reset. You return sharper, and the myth of your “disappearance” only helps.', effects: { burnout: -32, cred: 3, creativity: 3 } },
        },
      },
      right: {
        label: 'Push through',
        governingStats: { skill: 0.8 },
        tags: ['risky', 'work'],
        outcomes: {
          bad: { text: 'You play a show on autopilot and cry in a Wendy’s parking lot after. The fries help. Slightly.', effects: { burnout: 12, skill: 2, fame: 3 } },
          good: { text: 'You gut it out. Professionals finish the run. Professionals also grind their teeth at night.', effects: { burnout: 8, fame: 6, cred: 3 } },
          incredible: { text: 'Running on fumes, you play the rawest set of your life. Concerning. Transcendent. Concerning.', effects: { burnout: 8, fame: 12, cred: 5 } },
        },
      },
    },
  },
  {
    id: 'a3_documentary', act: 3, pathAffinity: [], weight: 9,
    requires: { flagsNone: ['docu_crew'] },
    art: 'ev_docu', context: 'A film student named Juniper',
    prompt: '“I’m documenting your journey. Warts and all. Mostly warts. Warts are what festivals want.”',
    tags: ['fame'],
    choices: {
      left: {
        label: 'Full access',
        governingStats: { cred: 0.7, creativity: 0.5 },
        tags: ['fame', 'risky'],
        outcomes: {
          bad: { text: 'The final cut is 90 minutes of you looking tired near instruments. It’s called “Almost.” It’s accurate.', effects: { fame: 4, cred: 2, burnout: 5 } },
          good: { text: 'The doc is honest and kind of beautiful. People root for you now. On purpose.', effects: { fame: 9, cred: 5 } },
          incredible: { text: '“Almost” wins a festival prize. Your lowest moments are now cinema. Weirdly healing. Great for ticket sales.', effects: { fame: 16, cred: 7, network: 4 } },
        },
      },
      right: {
        label: 'Curated access only',
        governingStats: { network: 1.0 },
        tags: ['safe', 'fame'],
        outcomes: {
          bad: { text: 'The sanitized cut is so boring Juniper recuts it as satire. Of you. It’s good satire.', effects: { fame: 3, cred: -3 } },
          good: { text: 'Polished, professional, safe. A fine EPK. Juniper sighs in art.', effects: { fame: 6, network: 3 } },
          incredible: { text: 'Your curation instincts are elite. The “controlled” doc still feels raw. Executives take note of the control.', effects: { fame: 10, network: 6, cred: 3 } },
        },
      },
    },
  },
  {
    id: 'a1_cover_band', act: 1, pathAffinity: [], weight: 9,
    art: 'ev_coverband', context: 'A man in a Hawaiian shirt with a binder',
    prompt: '“FleetwoodMacaroni needs a fourth, weekends only, $150 a night, strictly covers.” He taps the binder. The binder has TABS. Rent, meanwhile, has opinions.',
    tags: ['deal', 'live'],
    choices: {
      left: {
        label: 'Join FleetwoodMacaroni',
        governingStats: { skill: 0.8 },
        tags: ['live', 'safe'],
        outcomes: {
          bad: { text: 'Weekend three: a bachelorette party requests “Dreams” four times. You play it four times. Something inside you files for hazard pay. The money, though, is real and green.', effects: { money: 150, skill: 2, cred: -2, burnout: 4 } },
          good: { text: 'Turns out playing other people’s songs perfectly is a masterclass with a paycheck. Your ears sharpen, your pocket steadies, and the Hawaiian shirt guy — Terry — knows every soundman in the county.', effects: { money: 150, skill: 4, network: 3, cred: -1 } },
          incredible: { text: 'You sneak one original into the third set, introduced as “a deep cut.” The dance floor doesn’t notice it isn’t Fleetwood Mac. Terry notices. “That yours? It should be somebody’s.” He starts telling bookers about you — the ORIGINAL you.', effects: { money: 150, skill: 4, network: 5, creativity: 2 } },
        },
      },
      right: {
        label: 'Starve with integrity',
        governingStats: { cred: 0.9 },
        tags: ['indie', 'risky'],
        outcomes: {
          bad: { text: 'You decline the binder. The week you eat rice you think about the binder. The binder haunts you tastefully, in tabs.', effects: { cred: 3, money: -40 } },
          good: { text: '“Covers are a costume,” you tell Terry, who nods like he’s heard it before (he has, from everyone he’s ever hired). Your originals-only stance costs money and buys identity at the going rate.', effects: { cred: 5, creativity: 2, money: -20 } },
          incredible: { text: 'Terry, impressed by the refusal, books your ORIGINAL act as FleetwoodMacaroni’s “special guest” — a covers crowd, a captive audience, your songs. Two of them go home humming something that didn’t exist last year.', effects: { cred: 6, fame: 4, network: 3 } },
        },
      },
    },
  },
  {
    id: 'a1_flyer_war', act: 1, pathAffinity: [], weight: 9,
    art: 'ev_flyerwar', context: 'The sacred telephone pole on Main',
    prompt: 'Someone is stapling their flyers OVER yours. Same pole, same week, dead center. The scene has laws about this. The laws are unwritten, which makes them absolute.',
    tags: ['fame'],
    choices: {
      left: {
        label: 'Escalate. Beautifully.',
        governingStats: { creativity: 0.9 },
        tags: ['risky', 'indie'],
        outcomes: {
          bad: { text: 'Your revenge flyer — hand-illustrated, gorgeous, twice the size — is stapled over within the hour by a flyer that just says “NO.” You’ve been out-minimalismed. The pole remains contested territory.', effects: { creativity: 3, fame: 1, burnout: 2 } },
          good: { text: 'You design a flyer so beautiful people steal it to frame — which is a distribution strategy, it turns out. The over-stapler surrenders the pole. Their drummer asks who did your art. You did. Everyone knows now.', effects: { creativity: 5, fame: 3, cred: 2 } },
          incredible: { text: 'Your flyer series becomes a collectible — numbered, hidden around town, hunted. The local paper does a piece on “the poster war on Main.” Both bands sell out the same weekend. The pole gets a plaque. Unofficial. You made it official.', effects: { creativity: 7, fame: 6, network: 3 } },
        },
      },
      right: {
        label: 'Find them. Talk it out.',
        governingStats: { network: 0.9 },
        tags: ['network', 'safe'],
        outcomes: {
          bad: { text: 'The over-stapler turns out to be sixteen and terrifyingly sincere. You can’t even be mad. You end up giving them stapler advice. You may have created a monster with better technique.', effects: { network: 2, cred: 1 } },
          good: { text: 'Over coffee, the flyer treaty is signed: alternating weeks, top half/bottom half, mutual show attendance. Their crowd meets your crowd. Both get bigger. Diplomacy: cheaper than staples.', effects: { network: 4, fame: 2, cred: 2 } },
          incredible: { text: 'The talk becomes a co-bill, the co-bill becomes a monthly, the monthly becomes THE night in town for new bands — and you two run it, door split, from a shoebox. The pole now advertises your joint empire. In staples.', effects: { network: 6, fame: 3, money: 80, cred: 2 } },
        },
      },
    },
  },
  {
    id: 'a1_opendeck', act: 1, pathAffinity: [], weight: 9,
    art: 'ev_opendeck', context: 'Open decks night. Bring your own everything.',
    prompt: 'The DJ bar’s “open decks” night has a 15-minute slot and a strict rule: keep the floor moving or the resident cuts you off, live, with a airhorn. The current selector is losing the room to the pool table.',
    tags: ['live', 'electronic'],
    choices: {
      left: {
        label: 'Take the slot. Read the floor.',
        minigame: 'crowd',
        governingStats: { creativity: 0.6, network: 0.5 },
        tags: ['live', 'electronic', 'risky'],
        outcomes: {
          bad: { text: 'You lose the floor to the pool table twice, win it back once, and eat the airhorn at minute thirteen — a respectable run by open decks standards. The resident nods: “decent instincts. bad transitions.”', effects: { creativity: 3, network: 2, burnout: 3 } },
          good: { text: 'Fifteen clean minutes — the floor holds, the pool game pauses, one person does the point-at-the-DJ thing. The resident extends you to twenty. In this room, that’s a knighthood.', effects: { creativity: 4, network: 4, fame: 3 } },
          incredible: { text: 'You read the room like sheet music — the floor SURGES, the resident kills the airhorn ceremonially by removing its batteries, and the bar offers you a monthly slot on the spot. Selector status: earned.', effects: { creativity: 6, network: 5, fame: 5, money: 60 } },
        },
      },
      right: {
        label: 'Study the resident instead',
        governingStats: { skill: 0.8 },
        tags: ['safe', 'practice'],
        outcomes: {
          bad: { text: 'You watch the resident’s hands all night and learn mostly that watching isn’t doing. Still: three transitions you’ll steal forever. Tuition: two overpriced sodas.', effects: { skill: 3 } },
          good: { text: 'You post up by the booth and the resident, flattered, starts narrating — “watch the crowd’s FEET, not their faces.” A free masterclass in floorcraft. The feet thing changes everything.', effects: { skill: 4, creativity: 2, network: 2 } },
          incredible: { text: 'At close, the resident hands you a USB with their unreleased edits. “You watch like someone who’ll do something with it.” The edits are a syllabus. The trust is a debt you’ll repay in kind, years from now, to somebody else.', effects: { skill: 5, creativity: 3, network: 3, cred: 2 } },
        },
      },
    },
  },
  {
    id: 'a1_practice_wall', act: 1, pathAffinity: [], weight: 9,
    art: 'ev_practicewall', context: 'The rehearsal space hallway, 1 a.m.',
    prompt: 'Through the wall of practice room B: someone working the SAME four bars you’ve been fighting for a week — and failing at exactly your spot. You’ve never met. You know their struggle intimately.',
    tags: ['practice', 'home'],
    choices: {
      left: {
        label: 'Knock. Compare failures.',
        governingStats: { network: 0.7, skill: 0.4 },
        tags: ['network', 'practice'],
        outcomes: {
          bad: { text: 'The knock startles them into knocking over a cymbal stand, which wakes the space’s cat, which triggers a chain of events ending with both of you banned from after-midnight sessions for a month. Worth it: their fingering fix works.', effects: { skill: 3, network: 2, burnout: 2 } },
          good: { text: 'Two strangers, one whiteboard, ninety minutes of trading failures. Their fix for your bar, your fix for theirs. You never exchange names — just the nod, forever after, in the hallway. The scene’s realest friendship format.', effects: { skill: 4, network: 3, creativity: 2 } },
          incredible: { text: 'The 1 a.m. session becomes a standing thing: Room B Wednesdays, no talking about anything but the work. Word spreads; other players start “happening to practice” Wednesdays. You’ve accidentally founded an institution with no name, no dues, and perfect attendance.', effects: { skill: 6, network: 5, creativity: 2, cred: 2 } },
        },
      },
      right: {
        label: 'Race them to it. Through the wall.',
        governingStats: { skill: 0.9 },
        tags: ['practice', 'risky'],
        outcomes: {
          bad: { text: 'The wall-race lasts two hours. They land it first — you HEAR the landing, then the silence of them knowing you heard. You finish yours at 3:40 a.m. out of pure spite. Spite, it turns out, is a practice method.', effects: { skill: 4, burnout: 4 } },
          good: { text: 'You get it first and play it a third time, slowly, like a lesson through the drywall. A pause. Then they play it BACK, corrected. The wall has become a teacher. Neither of you will ever admit this happened.', effects: { skill: 5, creativity: 2, burnout: 2 } },
          incredible: { text: 'The race ends in a dead heat — both rooms landing the passage at once, a stereo victory neither planned. Applause erupts from practice room C, which you didn’t know was occupied. All three rooms play together till dawn, through two walls, in time. Nobody meets. It’s perfect.', effects: { skill: 7, creativity: 3, cred: 2, burnout: 3 } },
        },
      },
    },
  },
  {
    id: 'a1_bloom_amp', act: 1, pathAffinity: [], weight: 10,
    art: 'ev_bloom_amp', context: 'Twenty minutes before doors',
    prompt: 'The opener — a nervous duo called Static Bloom — just watched their amp die with a smell like burnt toast and futures. They look at your amp. They look at you. Their whole set is on that look.',
    tags: ['live', 'network'],
    choices: {
      left: {
        label: 'Lend them your amp',
        governingStats: { cred: 0.8 },
        tags: ['safe', 'network'],
        outcomes: {
          bad: { text: 'They blow your fuse mid-set. YOUR set runs on a borrowed practice amp that distorts when you breathe near it. Static Bloom apologizes eleven times and buys you a beer with change. You remember the beer. So will they.', effects: { cred: 3, skill: 2, addFlag: 'helped_bloom' } },
          good: { text: 'Their set soars on your tubes, and they tell the crowd — mid-show, unprompted — whose amp it is. The room claps for an AMP. You go on warm and play warmer.', effects: { cred: 5, network: 3, addFlag: 'helped_bloom' } },
          incredible: { text: 'Static Bloom plays the set of their lives on your amp and dedicates the closer to “the kindest rig in the city.” Both bands merch out. The scene tells the story for you from here.', effects: { cred: 6, network: 4, fame: 2, addFlag: 'helped_bloom' } },
        },
      },
      right: {
        label: 'Protect the rig. Yours first.',
        governingStats: { skill: 0.6, cred: 0.4 },
        tags: ['safe'],
        outcomes: {
          bad: { text: 'Reasonable. Professional. Static Bloom plays through a bass practice combo, and every note sounds like an apology. They don’t look at you at load-out. The scene has eyes.', effects: { skill: 2, cred: -1, addFlag: 'snubbed_bloom' } },
          good: { text: 'You guard the rig and play a flawless set through it. Static Bloom borrows from the HEADLINER instead, who makes a small show of the kindness. Noted, by everyone, in a small ledger nobody admits keeping.', effects: { skill: 3, cred: 1, addFlag: 'snubbed_bloom' } },
          incredible: { text: 'Your set is immaculate — the amp never sounded better — and Static Bloom, wounded, plays angry through a rental and finds a NEW sound in the anger. Everyone wins tonight. The ledger still updates.', effects: { skill: 4, fame: 2, addFlag: 'snubbed_bloom' } },
        },
      },
    },
  },
  {
    id: 'a3_bloom_return', act: 3, pathAffinity: [], weight: 13,
    requires: { flagsAll: ['helped_bloom'] },
    art: 'ev_bloom_big', context: 'Static Bloom. Yes, THAT Static Bloom.',
    prompt: 'The nervous duo you lent an amp to is now the biggest band in the country. Their tour manager calls: “They have a list of people who were kind before it mattered. It’s a short list. You’re on it.”',
    tags: ['network', 'fame'],
    choices: {
      left: {
        label: 'Open their arena run',
        governingStats: { network: 0.6, skill: 0.6 },
        tags: ['live', 'mainstream', 'risky'],
        outcomes: {
          bad: { text: 'Arena crowds arrive late and leave patient. You play to filling seats and phone glow. But every night, Static Bloom tells the amp story to eleven thousand people, and eleven thousand people look you up.', effects: { fame: 8, network: 4, burnout: 6 } },
          good: { text: 'Twelve arenas. Your merch table needs a SECOND table. Static Bloom brings you out during their encore to play the old song from the old bar, and the roar hits like weather.', effects: { fame: 14, network: 6, money: 300, burnout: 5 } },
          incredible: { text: 'By the last city, the crowd sings YOUR closer back at you — an opener, hearing an arena carry their song. Static Bloom’s singer watches from side-stage, crying, holding a photo of the amp. The story completes itself.', effects: { fame: 22, network: 8, money: 450, burnout: 5, pathProgress: 1 } },
        },
      },
      right: {
        label: 'Decline — ask for a co-write instead',
        governingStats: { creativity: 0.7, cred: 0.5 },
        tags: ['write', 'indie'],
        outcomes: {
          bad: { text: 'The writing room is awkward at first — they’re stadium-sized now, you’re you-sized. But the old shorthand comes back by hour two, and the song is honest even if it never charts.', effects: { creativity: 5, cred: 3 } },
          good: { text: 'One weekend, one song, no managers allowed. It’s the best thing either of you has written all year, and both names go on it at equal size. Their lawyer objects. They overrule the lawyer.', effects: { creativity: 7, cred: 6, hits: 1, money: 200 } },
          incredible: { text: 'The co-write becomes their next single — and your biggest check — with a music video recreating the night of the amp, starring the actual amp. It wins an award. The AMP wins an award.', effects: { creativity: 8, cred: 7, hits: 1, money: 400, fame: 6 } },
        },
      },
    },
  },
  {
    id: 'a3_bloom_cold', act: 3, pathAffinity: [], weight: 13,
    requires: { flagsAll: ['snubbed_bloom'] },
    art: 'ev_bloom_big', context: 'Static Bloom. Yes, THAT Static Bloom.',
    prompt: 'The duo whose amp died next to yours is now the biggest band in the country — and their origin-story interview is out. They don’t name you. They describe you. The internet does the naming.',
    tags: ['fame', 'rival'],
    choices: {
      left: {
        label: 'Own it. Send the amp, with a note.',
        governingStats: { cred: 0.8, creativity: 0.4 },
        tags: ['risky', 'indie'],
        outcomes: {
          bad: { text: 'You ship your actual amp to their management with a note: “Better late.” Silence for three weeks. Then a photo: the amp, on their arena stage, with a tiny plaque. The internet debates whether you’re redeemed. Split decision.', effects: { cred: 4, fame: 3 } },
          good: { text: 'The note says “You sounded great through the practice combo, and I’ve regretted it since.” They post it. “All is forgiven, the amp plays Saturdays now.” The story gets a better ending than it deserved. So do you.', effects: { cred: 7, fame: 5, network: 3 } },
          incredible: { text: 'They fly you out, sit you in the front row, and mid-set plug into YOUR amp — “this one’s for the guy who taught us self-reliance.” The roast is affectionate, public, and total. You’re in the mythology now. The good part, somehow.', effects: { cred: 9, fame: 8, network: 4 } },
        },
      },
      right: {
        label: 'Say nothing. Outplay the story.',
        governingStats: { skill: 0.9 },
        tags: ['safe'],
        outcomes: {
          bad: { text: 'You put your head down and play. The story follows anyway — a heckler yells “nice amp” at three consecutive shows. It becomes a bit. You don’t choose your bits.', effects: { skill: 3, burnout: 4, fame: 2 } },
          good: { text: 'No statement, no subtweet — just a run of shows so strong the story runs out of oxygen. The scene’s verdict softens to “tough but correct.” You can live there.', effects: { skill: 5, cred: 4, fame: 3 } },
          incredible: { text: 'Your silence plus an undeniable year forces the interviewers to ask Static Bloom about YOU. “Honestly? They were right to protect the rig. We learned that later.” Vindication, from the source, unprompted. The rarest ending.', effects: { skill: 6, cred: 7, fame: 5 } },
        },
      },
    },
  },
  {
    id: 'a1_docu_pitch', act: 1, pathAffinity: [], weight: 9,
    art: 'ev_docu_pitch', context: 'Juniper. Film student. Already filming.',
    prompt: '“Origin stories only work if the camera is there BEFORE the origin. I want everything — load-ins, meltdowns, the van. Especially the van.” The lens cap is already off.',
    tags: ['fame'],
    choices: {
      left: {
        label: 'Full access, from day one',
        governingStats: { cred: 0.7, creativity: 0.5 },
        tags: ['fame', 'risky'],
        outcomes: {
          bad: { text: 'Day one of filming captures you losing an argument with a parking meter. “PERFECT,” whispers Juniper. You have concerns. The camera captures the concerns.', effects: { cred: 2, fame: 1, addFlag: 'docu_crew' } },
          good: { text: 'Juniper starts shadowing you with the discipline of a war photographer and the budget of a birthday card. Something about the red light makes you stand straighter.', effects: { cred: 3, fame: 2, addFlag: 'docu_crew' } },
          incredible: { text: 'The first week of footage already looks like a movie — Juniper shoots your soundcheck like a heist. You catch yourself performing for a documentary that doesn’t exist yet. It will.', effects: { cred: 4, fame: 3, creativity: 2, addFlag: 'docu_crew' } },
        },
      },
      right: {
        label: '“No cameras. Not yet.”',
        governingStats: { cred: 1.0 },
        tags: ['safe', 'indie'],
        outcomes: {
          bad: { text: 'Juniper nods, unoffended, and starts filming {rival} instead. You will think about this at 3 a.m. for the rest of the act.', effects: { cred: 2, rivalry: 1 } },
          good: { text: '“Respect. Call me when there’s a story.” Juniper leaves a card. The card is a QR code to a portfolio that is, annoyingly, excellent.', effects: { cred: 4 } },
          incredible: { text: 'Your no is so considered that Juniper writes it down. “THAT’s the opening line of the doc I make about you someday.” Someday is a real place; you’ve now both been there.', effects: { cred: 5, creativity: 2 } },
        },
      },
    },
  },
  {
    id: 'a2_docu_moment', act: 2, pathAffinity: [], weight: 14,
    requires: { flagsAll: ['docu_crew'] },
    art: 'ev_docu_moment', context: 'The red light is on. It’s always on.',
    prompt: 'Backstage, mid-crisis: the promoter is shorting the fee, the opener took your gaff tape, and someone is crying near the rider. Juniper’s camera swings toward you. This is the scene. What kind of scene is it?',
    tags: ['fame', 'live'],
    choices: {
      left: {
        label: 'Let it roll. Warts and all.',
        governingStats: { cred: 0.8 },
        tags: ['risky', 'indie'],
        outcomes: {
          bad: { text: 'What the camera catches: you, mid-tantrum, using the phrase “do you know who I’m TRYING to be?” Juniper lowers the camera respectfully. The footage does not lower itself.', effects: { cred: 1, burnout: 5, fame: 1, addFlag: 'docu_dirt' } },
          good: { text: 'You handle the promoter, replace the tape, sit with the crier. The camera gets all of it — competence, unglamorous and total. “That’s the film,” Juniper says quietly.', effects: { cred: 5, network: 3, addFlag: 'docu_gold' } },
          incredible: { text: 'You defuse the whole backstage like a bomb tech with a setlist, then play the show of the month. Juniper films the promoter APOLOGIZING. Cinema. Actual cinema.', effects: { cred: 7, network: 4, fame: 3, addFlag: 'docu_gold' } },
        },
      },
      right: {
        label: 'Wave the camera off. Fix it in private.',
        governingStats: { network: 0.9 },
        tags: ['safe'],
        outcomes: {
          bad: { text: 'The hallway audio still catches everything. A closed door is not a mute button. Juniper looks apologetic and keeps the tape — “it’s the truth, though.”', effects: { network: 2, burnout: 4, addFlag: 'docu_dirt' } },
          good: { text: 'You sort the mess off-camera and return with a joke. The doc gets a mystery instead of a meltdown. Mysteries edit better than tantrums.', effects: { network: 5, cred: 2, addFlag: 'docu_gold' } },
          incredible: { text: 'You fix it so smoothly the crisis never visibly happens. Juniper, reviewing footage, finds only a before and an after and calls the missing middle “the most professional thing I’ve ever not filmed.”', effects: { network: 6, cred: 4, addFlag: 'docu_gold' } },
        },
      },
    },
  },
  {
    id: 'a3_docu_gold', act: 3, pathAffinity: [], weight: 14,
    requires: { flagsAll: ['docu_gold'] },
    art: 'ev_docu_premiere', context: 'A rep theater. Your face on the marquee, slightly crooked.',
    prompt: 'Juniper’s doc — “ALMOST” — premieres tonight. It’s good. It’s honest. It ends on the backstage scene where you quietly fix everything, and early viewers keep using the word “rootable.” Juniper saved you a seat.',
    tags: ['fame'],
    choices: {
      left: {
        label: 'Take the seat. Do the Q&A.',
        governingStats: { network: 0.6, cred: 0.6 },
        tags: ['fame', 'mainstream'],
        outcomes: {
          bad: { text: 'Watching yourself for 90 minutes is a medical event. At the Q&A someone asks what the van smelled like and you answer honestly, and THAT clip outperforms the trailer.', effects: { fame: 6, cred: 2, burnout: 4 } },
          good: { text: 'The room laughs where it should and goes silent where it must. The Q&A runs long. Juniper introduces you as “the subject” and you both grin like it means more, because it does.', effects: { fame: 10, cred: 5, network: 3 } },
          incredible: { text: '“ALMOST” takes the festival’s audience award, and the clip of you both accepting — Juniper mid-sob, you holding the tiny trophy like a grenade — travels far past the music press. You’re a STORY now. Stories sell out rooms.', effects: { fame: 16, cred: 7, network: 5, pathProgress: 1 } },
        },
      },
      right: {
        label: 'Skip it. Send flowers, play a show.',
        governingStats: { cred: 1.0 },
        tags: ['indie', 'live'],
        outcomes: {
          bad: { text: 'The mystique play half-works: the premiere buzzes, your absence is noted, your show that night draws eleven people and one of them is reviewing the DOC.', effects: { cred: 3, fame: 2 } },
          good: { text: 'You play a bar show while your movie premieres across town — which is, everyone agrees, the most on-brand thing you’ve ever done. Juniper texts a photo of your empty seat with a heart.', effects: { cred: 6, fame: 4 } },
          incredible: { text: 'The doc ends, the lights come up, and the audience learns you’re playing RIGHT NOW two blocks away. Half the theater walks over, tickets in hand. The night becomes local legend before it’s over.', effects: { cred: 8, fame: 7, network: 3 } },
        },
      },
    },
  },
  {
    id: 'a3_docu_dirt', act: 3, pathAffinity: [], weight: 14,
    requires: { flagsAll: ['docu_dirt'] },
    art: 'ev_docu_premiere', context: 'A festival programmer calls it “unflinching.” Uh oh.',
    prompt: 'Juniper’s doc premieres, and the centerpiece is your worst backstage moment, uncut. It’s honest. That’s the problem. The internet is already choosing a freeze-frame. Juniper, to their credit, calls you first.',
    tags: ['fame'],
    choices: {
      left: {
        label: 'Own it. Show up. Take the hit.',
        governingStats: { cred: 0.9 },
        tags: ['risky', 'indie'],
        outcomes: {
          bad: { text: 'You attend. You laugh at yourself one beat too late in the wrong scene. The audience notices. Growth is apparently also cinema, but so is flinching.', effects: { cred: 3, fame: 3, burnout: 5 } },
          good: { text: 'At the Q&A you say “that person was drowning and didn’t know how to say so,” and the room goes very quiet, and Juniper nods like the film finally makes sense. The take that saves you isn’t in the movie.', effects: { cred: 7, fame: 4, burnout: 3 } },
          incredible: { text: 'Your Q&A answer about the meltdown gets clipped, and THE CLIP redeems the film’s worst scene in 40 seconds. “The doc shows the wound, the Q&A shows the healing,” writes the one critic who matters. Both go viral together.', effects: { cred: 10, fame: 8, network: 3, burnout: 3 } },
        },
      },
      right: {
        label: 'Lawyer up. Kill the cut.',
        governingStats: { network: 0.8 },
        tags: ['deal', 'risky'],
        outcomes: {
          bad: { text: 'The cease-and-desist leaks the same hour as the trailer. Nothing markets a documentary like a musician trying to bury it. Juniper’s film sells out. Your name trends with a gavel emoji.', effects: { network: -2, cred: -4, fame: 4, rivalry: 1 } },
          good: { text: 'The lawyers trade the meltdown scene for extended interview access. The recut is fairer, duller, and screens twice. Juniper never quite meets your eye again. The problem is solved. A door is also closed.', effects: { network: 3, cred: -2, fame: 2 } },
          incredible: { text: 'Your lawyer discovers Juniper never cleared the venue’s music rights — checkmate delivered gently, over coffee, with an offer: recut it together, co-sign the story. The new ending is better. Even Juniper says so.', effects: { network: 5, cred: 3, fame: 4 } },
        },
      },
    },
  },
  {
    id: 'a3_shed_someone', act: 3, pathAffinity: [], weight: 16,
    requires: { flagsAll: ['home_studio', 'someone'] },
    art: 'ev_shed_someone', context: 'The shed, late. A light you didn’t leave on.',
    prompt: 'You find them in the shed with headphones on, listening to your roughs with their eyes closed — they’ve clearly done this before. On the whiteboard, in their handwriting, one line: “the second verse is braver than you think.” They don’t know you’re in the doorway yet.',
    tags: ['home'],
    choices: {
      left: {
        label: 'Stay in the doorway. Let them finish.',
        governingStats: { cred: 0.8 },
        tags: ['safe', 'home'],
        outcomes: {
          bad: { text: 'You stand there too long and the floor creaks — they startle, embarrassed, and the moment gets shy. But the whiteboard line stays up, and later you re-cut the second verse the brave way. They were right. They’re always right in the shed.', effects: { creativity: 4, burnout: -4, addFlag: 'constellation' } },
          good: { text: 'You watch someone love the unfinished version of the thing — and of you. When the song ends they open their eyes, unsurprised: “the door creaks, you know.” They knew the whole time. Everything after this is easier.', effects: { creativity: 5, cred: 3, burnout: -6, addFlag: 'constellation' } },
          incredible: { text: 'You let the whole rough play out, watching them hear it. Then, quietly, you play the second verse the brave way, live, from the doorway. The shed does its shed thing. Some rooms exist so two people can be exactly this honest in them. You finish the record that week — THEIR cut order.', effects: { creativity: 7, cred: 4, burnout: -8, pathProgress: 1, addFlag: 'constellation' } },
        },
      },
      right: {
        label: '“Braver how? Show me.”',
        governingStats: { creativity: 0.7, network: 0.4 },
        tags: ['write', 'home'],
        outcomes: {
          bad: { text: 'They can’t explain it in music words — they don’t have music words — so they explain it in regular ones, badly, for an hour. Somewhere in the bad explaining is the exact right note. You find it at 2 a.m. They’re asleep on the amp couch, victorious.', effects: { creativity: 5, burnout: 2, addFlag: 'constellation' } },
          good: { text: 'They hum it. THEY HUM IT — the braver second verse, the one you’d been circling for weeks, hummed by someone who “doesn’t do music.” You record the hum on your phone. The hum makes the album. The credit reads their name.', effects: { creativity: 7, cred: 3, addFlag: 'constellation' } },
          incredible: { text: 'The show-me session runs till dawn — them talking, you translating, the whiteboard filling with a language only two people speak. The song that comes out of it is the best thing on the record and you both know whose it really is. The liner notes say: “verse two: them.”', effects: { creativity: 9, cred: 4, burnout: -4, pathProgress: 1, addFlag: 'constellation' } },
        },
      },
    },
  },
  {
    id: 'a3_shed_doc', act: 3, pathAffinity: [], weight: 16,
    requires: { flagsAll: ['home_studio', 'docu_gold'] },
    art: 'ev_shed_doc', context: 'Juniper, standing in the shed, arms wide',
    prompt: '“THIS. This is the final scene of the doc — you, in the room you built, playing the thing the whole film has been walking toward.” Juniper has already lit it. The shed has never looked so much like a cathedral with a rooster problem.',
    tags: ['record', 'fame'],
    choices: {
      left: {
        label: 'One take, in the shed, cameras rolling',
        minigame: 'take',
        governingStats: { skill: 0.6, creativity: 0.6 },
        tags: ['record', 'risky'],
        outcomes: {
          bad: { text: 'The take is human — a flub in the bridge, a laugh you can hear, the rooster exactly on cue. Juniper keeps ALL of it. “Perfect was never the assignment.” The scene is honest, which is better.', effects: { creativity: 4, cred: 4, fame: 3, addFlag: 'constellation' } },
          good: { text: 'The take lands whole, and the shed does its shed thing — warm, close, true. On screen it will look like the entire career happened so this room could exist. It sort of did.', effects: { creativity: 6, cred: 6, fame: 5, addFlag: 'constellation' } },
          incredible: { text: 'The take Juniper captures in the shed becomes the doc’s final three minutes, unbroken, one shot. Festival audiences will sit silent through the credits. The shed — a SHED — gets its own applause break at the premiere.', effects: { creativity: 8, cred: 8, fame: 8, pathProgress: 1, addFlag: 'constellation' } },
        },
      },
      right: {
        label: '“The shed stays off camera.”',
        governingStats: { cred: 1.0 },
        tags: ['indie', 'safe'],
        outcomes: {
          bad: { text: 'Juniper argues, loses, and shoots the finale at the venue instead. It’s fine. You keep one room that belongs to no narrative. Some Tuesdays that feels like the wrong call. Most Tuesdays it doesn’t.', effects: { cred: 4, addFlag: 'constellation' } },
          good: { text: '“Some rooms are for making things, not filming them.” Juniper, to their credit, puts THAT line in the doc instead — over a shot of the shed’s closed door. It plays better than any interior could have.', effects: { cred: 7, creativity: 2, addFlag: 'constellation' } },
          incredible: { text: 'The closed shed door becomes the doc’s most discussed image — the room the film never enters. Critics call it “the last private place in a public life.” You read that in the shed, laughing, with the door shut.', effects: { cred: 9, fame: 4, addFlag: 'constellation' } },
        },
      },
    },
  },
  {
    id: 'a3_bloom_festival', act: 3, pathAffinity: [], weight: 16,
    requires: { flagsAll: ['helped_bloom'], rivalryMin: 6 },
    art: 'ev_bloom_fest', context: 'Static Bloom’s festival. One slot left. Two names on the shortlist.',
    prompt: 'Static Bloom curates a festival now, and the last slot is between you and {rival} — who has already texted you a single knife emoji. Bloom calls: “We owe you the amp debt. But they drew better numbers last quarter. Help us out: settle it yourselves.”',
    tags: ['live', 'rival'],
    choices: {
      left: {
        label: 'Soundclash. Winner takes the slot.',
        minigame: 'crowd',
        governingStats: { skill: 0.7, cred: 0.5 },
        tags: ['live', 'risky', 'rival'],
        outcomes: {
          bad: { text: 'The clash is close — closer than your pride wanted. {rival} takes it on crowd noise, then, at the mic: “Give the slot to them anyway. The amp story is better than my numbers.” Losing has never been this complicated.', effects: { fame: 5, cred: 4, rivalry: -1, addFlag: 'constellation' } },
          good: { text: 'You win the clash clean, and {rival} concedes with a bow so theatrical it loops back to sincere. Bloom posts the whole thing. The festival slot is yours, and the feud gains a chapter everyone enjoyed.', effects: { fame: 9, cred: 5, network: 3, rivalry: 1, addFlag: 'constellation' } },
          incredible: { text: 'The soundclash becomes the festival’s origin myth — two rivals emptying the tank while Static Bloom watches like proud parents. You win, barely, and the crowd demands BOTH of you play the slot. So you do. Together. The knife emoji becomes a tattoo you both get. Allegedly.', effects: { fame: 14, cred: 7, network: 4, rivalry: -2, pathProgress: 1, addFlag: 'constellation' } },
        },
      },
      right: {
        label: 'Cede the slot. Call in the debt LATER.',
        governingStats: { network: 0.9 },
        tags: ['deal', 'safe'],
        outcomes: {
          bad: { text: 'You cede gracefully. {rival} plays the slot and kills. The debt sits in Bloom’s ledger accruing… something. Interest, hopefully. Patience, definitely.', effects: { network: 3, cred: 3, addFlag: 'constellation' } },
          good: { text: '“Give them the slot. I’ll take the favor.” Bloom’s manager writes it down — an IOU from the biggest band in the country, on paper, witnessed. {rival} plays great and knows exactly what you bought. It costs them the win a little.', effects: { network: 6, cred: 4, addFlag: 'constellation' } },
          incredible: { text: 'The favor you bank instead turns out to be Bloom producing your next record — announced casually in an interview before they told YOU. {rival} got one festival evening. You got a co-sign that reroutes a career. The ledger closes; the amp debt is finally, absurdly, repaid.', effects: { network: 8, cred: 6, fame: 5, pathProgress: 1, addFlag: 'constellation' } },
        },
      },
    },
  },
  {
    id: 'a3_shed_collab', act: 3, pathAffinity: [], weight: 16,
    requires: { flagsAll: ['home_studio', 'collab'] },
    art: 'ev_shed_collab', context: 'A very nice car, parked very badly, outside a shed',
    prompt: '{collabArtist} heard about the room. “Every studio I book sounds like a bank. Yours sounds like a SECRET.” They’re standing in your garden holding their own mic like an offering. The neighbors are at their windows.',
    tags: ['record', 'fame'],
    choices: {
      left: {
        label: 'Run the session. Shed rules apply.',
        minigame: 'take',
        governingStats: { creativity: 0.7, network: 0.4 },
        tags: ['record', 'indie'],
        outcomes: {
          bad: { text: 'A chart artist in a shed is a physics problem — their entourage waits outside in shifts. The session is awkward till the rooster interrupts a take and {collabArtist} laughs so hard they keep the laugh in the song.', effects: { creativity: 4, network: 3, fame: 3, addFlag: 'constellation' } },
          good: { text: 'Shed rules: no entourage, no clock, warm mics. {collabArtist} sings looser than they have in years — “this is what I sounded like BEFORE.” The track needs nothing. The shed strikes again.', effects: { creativity: 6, network: 5, fame: 5, money: 200, addFlag: 'constellation' } },
          incredible: { text: 'The shed session leaks — one phone photo of a superstar’s very nice car outside a very humble shed — and becomes the myth that eats the industry: THE room. {collabArtist} credits it by name. Your garden has a waiting list now. The rooster has a rider.', effects: { creativity: 8, network: 7, fame: 8, money: 350, pathProgress: 1, addFlag: 'constellation' } },
        },
      },
      right: {
        label: 'Protect the secret. Offer the venue instead.',
        governingStats: { cred: 0.8 },
        tags: ['safe', 'indie'],
        outcomes: {
          bad: { text: 'You redirect them to the good studio across town. They go, mildly wounded. The shed stays a secret, which was the point, and costs a story, which was the price.', effects: { cred: 4, addFlag: 'constellation' } },
          good: { text: '“The shed doesn’t take bookings. But I’ll produce you AT a place that does.” The session works, your fee is real, and the shed’s legend grows precisely because the door stayed shut.', effects: { cred: 6, money: 250, network: 3, addFlag: 'constellation' } },
          incredible: { text: '{collabArtist} respects the no so much they write a song called “The Shed” about a room they never entered. It charts. Your unlisted garden building now has fan theories. You mow the lawn around a legend.', effects: { cred: 8, fame: 6, money: 150, addFlag: 'constellation' } },
        },
      },
    },
  },
  {
    id: 'a3_music_video', act: 3, pathAffinity: [], weight: 10,
    requires: { moneyMin: 400 },
    art: 'ev_musicvideo', context: 'A director with a treatment and a dream',
    prompt: 'The treatment is nine pages. Page one: “WE OPEN ON: THE OCEAN, BUT WRONG.” The budget is $400 of your actual money, one rented cherry-picker, and a fog machine you may already own. It could be a masterpiece. It could be a cherry-picker invoice.',
    tags: ['fame', 'deal'],
    choices: {
      left: {
        label: 'Fund the wrong ocean',
        governingStats: { creativity: 0.8 },
        tags: ['risky', 'indie'],
        outcomes: {
          bad: { text: 'Day one: the cherry-picker sinks into the beach. Day two: the fog machine unionizes with the weather. The video that emerges is 40% apology, 60% seagull — and becomes a cult object for exactly those reasons. Art finds a way. The invoice finds you.', effects: { money: -400, fame: 4, cred: 3, creativity: 2 } },
          good: { text: 'The wrong ocean turns out to be RIGHT — the director’s eye was real, the cherry-picker shot is the thumbnail, and the video gives the song a second life it earns twice over. Money became a moving image became momentum.', effects: { money: -400, fame: 9, cred: 4, creativity: 3 } },
          incredible: { text: 'The video is better than the song, then MAKES the song better — inseparable now, quoted, parodied, homaged. Film schools request the treatment. The director thanks you at a festival “for believing in the wrong ocean.” Best $400 the career ever spent.', effects: { money: -400, fame: 16, cred: 6, creativity: 4, pathProgress: 1 } },
        },
      },
      right: {
        label: 'One take, one phone, golden hour',
        governingStats: { cred: 0.7, creativity: 0.5 },
        tags: ['safe', 'indie'],
        outcomes: {
          bad: { text: 'Golden hour lasts nine minutes and your battery lasts seven. The video is honest, vertical, and slightly cursed. It does fine. The director sends the nine pages to someone else, wistfully.', effects: { fame: 3, cred: 2 } },
          good: { text: 'One take, no cuts, you and the song and a parking structure at sunset. The restraint reads as confidence because it is. Costs nothing, says everything.', effects: { fame: 6, cred: 5, creativity: 2 } },
          incredible: { text: 'The one-take video becomes the format’s reference point — “the golden hour one” — imitated into cliché within a year. Yours stays first. Simplicity, correctly timed, is unbeatable and free.', effects: { fame: 11, cred: 7, creativity: 3 } },
        },
      },
    },
  },
  {
    id: 'a3_masters_buyback', act: 3, pathAffinity: [], weight: 11,
    requires: { moneyMin: 600 },
    art: 'ev_masters', context: 'A conference room. A folder. Your name on tapes you don’t own.',
    prompt: 'Somewhere along the way, a deal you barely read took your early masters. The label’s new owner will sell them back: $600, today, no negotiation, mild contempt included free. The songs are worth less than that. The OWNERSHIP is worth everything. Allegedly.',
    tags: ['deal'],
    choices: {
      left: {
        label: 'Buy your ghosts back',
        governingStats: { cred: 0.8 },
        tags: ['deal', 'indie'],
        outcomes: {
          bad: { text: 'You pay. The tapes arrive in a box that smells like a storage unit. The early songs are ROUGHER than memory allowed — but they’re YOURS rough now. You reissue nothing. Owning them quietly turns out to be the entire point.', effects: { money: -600, cred: 6, burnout: -3 } },
          good: { text: 'The buy-back becomes a small legend when word gets out — artists DM asking how. The reissued early EP, remastered in the shed of your soul, sells modestly to people who want the receipt: proof that catching your past is possible.', effects: { money: -600, cred: 9, fame: 4, creativity: 2 } },
          incredible: { text: 'Two years of quiet licensing later, the masters have paid for themselves twice — a sync here, an anniversary pressing there, every check clearing into YOUR account with no asterisks. The mild contempt in that conference room converts, at maturity, into the sweetest interest rate of the career.', effects: { money: -600, cred: 11, fame: 5, network: 3, pathProgress: 1 } },
        },
      },
      right: {
        label: '“Keep them. I’ll out-write them.”',
        governingStats: { creativity: 0.9 },
        tags: ['write', 'risky'],
        outcomes: {
          bad: { text: 'The vow is cinematic; the followthrough is Tuesday-shaped. The new songs come slow, haunted by the old ones you don’t own. Some ghosts you buy back. Some you race. This one’s winning, for now.', effects: { creativity: 4, burnout: 4, cred: 2 } },
          good: { text: 'You walk out with the $600 and a grudge that writes like a co-author. The next batch of songs arrives ANGRY and better for it. The label owns your past; the fury owns your present; you own the fury.', effects: { creativity: 7, cred: 4, burnout: 3 } },
          incredible: { text: 'The out-writing works so thoroughly that the old masters become a curiosity — “the demos before the good stuff.” Their value collapses; the label calls, offering them back at HALF. You let it go to voicemail. Twice. Then buy them for a dollar-adjacent sum, as a trophy.', effects: { creativity: 9, cred: 7, fame: 4, pathProgress: 1 } },
        },
      },
    },
  },
  {
    id: 'a3_golden_hands', act: 3, pathAffinity: [], weight: 12,
    requires: { flagsAll: ['mg_golden'] },
    art: 'ev_goldhands', context: 'A stranger at load-in, holding coffee like an offering',
    prompt: '“I was THERE.” They describe, in detail, the moment this act you did something perfectly — the take, the set, the save. “People talk about it, you know. What are your hands doing Thursday?”',
    tags: ['network', 'fame'],
    choices: {
      left: {
        label: 'Thursday. Whatever it is. Yes.',
        governingStats: { skill: 0.7, network: 0.5 },
        tags: ['risky', 'live'],
        outcomes: {
          bad: { text: 'Thursday is a mystery gig that turns out to be a retirement party for a regional cheese executive. You play it perfectly, because that’s the reputation now, to eleven people and a commemorative gouda.', effects: { money: 150, cred: 2, burnout: 4 } },
          good: { text: 'Thursday is a session for someone whose name you sign an NDA about. The reputation preceded you; your hands confirmed it. Word keeps traveling.', effects: { money: 250, cred: 5, network: 4 } },
          incredible: { text: 'Thursday becomes a standing Thursday. The stranger, it turns out, books talent for people whose names are logos. “The hands,” they tell clients, is the whole pitch. It keeps being enough.', effects: { money: 350, cred: 6, network: 6, fame: 3, pathProgress: 1 } },
        },
      },
      right: {
        label: '“The moment wasn’t the point.”',
        governingStats: { cred: 1.0 },
        tags: ['indie', 'safe'],
        outcomes: {
          bad: { text: 'You deflect the legend politely. The stranger nods, disappointed, and the story shrinks a little in the retelling — legends need feeding, apparently.', effects: { cred: 3 } },
          good: { text: '“It was just the work,” you say, and the stranger repeats THAT instead. The humble version of the story travels further than the flashy one would have.', effects: { cred: 6, network: 2 } },
          incredible: { text: 'Your shrug becomes the legend’s ending: did the thing, called it Tuesday, walked off. Musicians start doing bad impressions of your indifference. The mystique is now self-sustaining and requires no maintenance.', effects: { cred: 8, fame: 4 } },
        },
      },
    },
  },
  {
    id: 'a3_blooper', act: 3, pathAffinity: [], weight: 12,
    requires: { flagsAll: ['mg_botched'] },
    art: 'ev_blooper', context: 'Your phone. A compilation. Your face in the thumbnail.',
    prompt: 'Someone cut your worst on-the-spot moment this act into a blooper edit with air-horn sound effects. It has more views than your last release. The comments are, against all odds, affectionate.',
    tags: ['fame', 'social'],
    choices: {
      left: {
        label: 'Duet it. Air-horn yourself.',
        governingStats: { network: 0.6, creativity: 0.5 },
        tags: ['social', 'mainstream'],
        outcomes: {
          bad: { text: 'Your self-aware response video is somehow LESS funny than the original, which the comments note with scientific precision. The bit ends here. The views do not.', effects: { fame: 4, cred: -2 } },
          good: { text: 'You duet the blooper deadpan, holding the exact wrong note again on purpose. The internet declares you “unbothered royalty.” The algorithm agrees for 72 straight hours.', effects: { fame: 9, network: 3, cred: 2 } },
          incredible: { text: 'Your response ends with three seconds of you playing the botched part PERFECTLY, then shrugging. The cut becomes a template other musicians use. You are now the patron saint of recovering gracefully.', effects: { fame: 14, cred: 5, network: 3 } },
        },
      },
      right: {
        label: 'Say nothing. Ship the real thing.',
        governingStats: { cred: 0.8, creativity: 0.4 },
        tags: ['indie', 'safe'],
        outcomes: {
          bad: { text: 'You counter-program the blooper with actual music. The internet, faced with a choice between art and air-horns, chooses air-horns. It was never a fair fight.', effects: { cred: 3, fame: 1 } },
          good: { text: 'You drop a single the same week and let the blooper be your marketing department. “Came for the fail, stayed for the song” becomes a real comment with real numbers under it.', effects: { cred: 5, fame: 5, creativity: 2 } },
          incredible: { text: 'The song is good enough that the blooper becomes its origin story — the “before” in a redemption arc you never agreed to star in. Both go up together, permanently linked. You stop fighting it. It stops mattering.', effects: { cred: 7, fame: 8, creativity: 3 } },
        },
      },
    },
  },
  {
    id: 'a3_old_friend', act: 3, pathAffinity: [], weight: 9,
    art: 'ev_friend', context: 'A familiar voice',
    prompt: 'The first person who ever believed in you calls. They now run something important. “Been watching. Need anything?”',
    tags: ['network'],
    choices: {
      left: {
        label: 'Call in the big favor',
        governingStats: { network: 1.0 },
        tags: ['network', 'deal'],
        outcomes: {
          bad: { text: 'The favor works but the friendship becomes a transaction. The invoice is invisible and permanent.', effects: { network: 4, fame: 5, cred: -2 } },
          good: { text: 'One phone call from them moves more than a year of your grinding. That’s the whole industry, really.', effects: { network: 7, fame: 8, pathProgress: 1 } },
          incredible: { text: 'They go all-in on you, publicly. “I’ve believed in this one since the garage.” Doors don’t open — they evaporate.', effects: { network: 10, fame: 12, cred: 4, pathProgress: 2 } },
        },
      },
      right: {
        label: 'Just catch up, no ask',
        governingStats: { cred: 1.0 },
        tags: ['safe', 'rest'],
        outcomes: {
          bad: { text: 'Nice call. You hang up and briefly grieve every favor you didn’t ask for.', effects: { burnout: -5, cred: 2 } },
          good: { text: 'Two hours of laughing about the garage days. Cheaper than therapy, warmer too.', effects: { burnout: -12, cred: 4, creativity: 2 } },
          incredible: { text: 'Because you didn’t ask, they offer. Bigger than you’d have dared request. Kindness compounds.', effects: { burnout: -10, cred: 5, network: 8, fame: 6 } },
        },
      },
    },
  },
  {
    id: 'a3_shop_last', act: 3, pathAffinity: [], weight: 8, shop: true,
    art: 'ev_last_shop', context: 'The Last Gear Shop Before Fame',
    prompt: 'A legendary shop. The walls are signed by everyone who mattered. There’s one blank spot, exactly marker-sized.',
    tags: ['shop'],
    choices: {
      left: {
        label: 'Buy the serious piece ($200)',
        governingStats: { cred: 0.8, skill: 0.5 },
        tags: ['shop', 'deal', 'tone'],
        cost: 200,
        outcomes: {
          bad: { text: 'It’s beautiful, it’s temperamental, it’s yours. Like everything else in your life.', effects: { money: -200, grantGear: 'random_good' } },
          good: { text: 'Professional gear for a professional. The clerk shakes your hand like a colleague.', effects: { money: -200, grantGear: 'random_good', cred: 3 } },
          incredible: { text: 'The owner emerges from the back. “This one’s been waiting for the right hands.” Discount. Destiny.', effects: { money: -140, grantGear: 'random_good', cred: 5, fame: 2 } },
        },
      },
      right: {
        label: 'Ask about the blank spot',
        governingStats: { network: 0.8, cred: 0.6 },
        tags: ['network'],
        outcomes: {
          bad: { text: '“That spot’s reserved.” For whom? “Someone who doesn’t ask.” Cold. Fair. Cold.', effects: { cred: 1 } },
          good: { text: 'The owner tells you an hour of stories about everyone on that wall. Free masterclass in how careers actually happen.', effects: { network: 5, cred: 4, creativity: 3 } },
          incredible: { text: 'The owner hands you the marker. “Sign it now. Pay me by making it true.” No pressure. All pressure.', effects: { cred: 7, network: 5, fame: 4, pathProgress: 1 } },
        },
      },
    },
  },
  {
    id: 'a3_rival_showdown', act: 3, pathAffinity: [], weight: 14,
    requires: { rivalryMin: 6 },
    art: 'ev_rival_showdown', context: 'Festival main stage — the beef, televised',
    prompt: 'The festival books you and {rival} back to back and calls it “THE RECKONING” on the poster. Neither of you approved this. Both of you are absolutely doing it.',
    tags: ['rival', 'live', 'fame'],
    choices: {
      left: {
        label: 'Play the set of your life',
        minigame: 'duel',
        governingStats: { skill: 0.8, creativity: 0.6 },
        tags: ['live', 'risky'],
        outcomes: {
          bad: { text: '{rival} takes the night. They bow to you from the stage — respectful, devastating, extremely shareable.', effects: { skill: 3, fame: 5, burnout: 8, rivalry: 1 } },
          good: { text: 'You edge it. Not a knockout — a decision. The crowd chants both names but yours slightly louder. You counted.', effects: { skill: 4, fame: 12, cred: 5, burnout: 6, pathProgress: 1 } },
          incredible: { text: 'You leave nothing. The set becomes legend by morning. {rival} posts one word — “gg” — and the internet weeps. THE moment of your career.', effects: { skill: 5, fame: 22, cred: 8, network: 5, burnout: 6, rivalry: -4, pathProgress: 2 } },
        },
      },
      right: {
        label: 'Invite them out mid-set (twist)',
        governingStats: { network: 0.8, cred: 0.5 },
        tags: ['live', 'network', 'risky'],
        outcomes: {
          bad: { text: '{rival} declines. On mic. From side-stage. The awkwardness is measurable on seismographs.', effects: { fame: 4, cred: -2, burnout: 6, rivalry: 2 } },
          good: { text: 'They walk out. The crowd loses it. The feud dies onstage and something better replaces it.', effects: { fame: 12, network: 6, cred: 4, rivalry: -4 } },
          incredible: { text: 'The surprise duet headlines every recap. “THE RECKONING becomes THE REUNION.” Promoters bid for the sequel.', effects: { fame: 18, network: 8, cred: 6, money: 200, rivalry: -5, pathProgress: 1 } },
        },
      },
    },
  },
  {
    id: 'a3_rival_supergroup', act: 3, pathAffinity: [], weight: 14,
    requires: { rivalryMax: 2 },
    art: 'ev_rival_super', context: '{rival}, with a whiteboard',
    prompt: '“Hear me out: supergroup. You, me, one album, we split everything, we tell no one until it drops.” {rival} has clearly rehearsed this. There are diagrams.',
    tags: ['rival', 'write'],
    choices: {
      left: {
        label: 'Join the supergroup',
        governingStats: { network: 0.7, creativity: 0.7 },
        tags: ['write', 'studio'],
        outcomes: {
          bad: { text: 'Two lead singers, zero rhythm sections. The supergroup dissolves over a track listing. The friendship survives, barely.', effects: { creativity: 3, network: 2, burnout: 6, rivalry: 1 } },
          good: { text: 'The album is good — better together than apart, which stings and delights in equal measure.', effects: { creativity: 6, fame: 10, network: 5, money: 150, pathProgress: 1 } },
          incredible: { text: 'The surprise drop detonates. Critics call it “the collaboration of the year.” The diagrams were right. {rival} was right.', effects: { creativity: 8, fame: 18, network: 7, cred: 5, money: 300, pathProgress: 2 } },
        },
      },
      right: {
        label: 'Stay solo — but produce their album',
        governingStats: { cred: 0.7, creativity: 0.6 },
        tags: ['studio', 'deal'],
        outcomes: {
          bad: { text: 'Producing your friend is a minefield of feelings. Track 7 nearly ends everything. You keep the receipts and the friendship.', effects: { cred: 3, creativity: 2, burnout: 5, money: 80 } },
          good: { text: 'Their album, your fingerprints. It does numbers and your name rides the credits into new rooms.', effects: { cred: 6, creativity: 4, network: 4, money: 200, hits: 1 } },
          incredible: { text: '{rival}’s album becomes their breakthrough — and the industry learns who shaped it. Your phone changes weight class.', effects: { cred: 8, creativity: 5, network: 7, money: 300, hits: 1, pathProgress: 1 } },
        },
      },
    },
  },
  {
    id: 'a3_hometown', act: 3, pathAffinity: [], weight: 9,
    art: 'ev_hometown', context: 'The Ricochet Room (yes, that one)',
    prompt: 'The open-mic bar from the beginning asks you to play a hometown show. The nacho smell is unchanged. The sound guy remembers you.',
    tags: ['live', 'roots'],
    choices: {
      left: {
        label: 'Play it like a coronation',
        minigame: 'crowd',
        governingStats: { network: 0.7, skill: 0.6 },
        tags: ['live', 'fame'],
        outcomes: {
          bad: { text: 'You big-time the room by accident. The sound guy’s face does something you’ll think about for years.', effects: { fame: 4, cred: -3, burnout: 4 } },
          good: { text: 'Packed room, local press, a line out the door of people claiming they “knew you when.” Some did.', effects: { fame: 9, network: 5, cred: 3 } },
          incredible: { text: 'The town declares an unofficial holiday. The nachos are renamed after you. Immortality, locally sourced.', effects: { fame: 15, network: 6, cred: 5, pathProgress: 1 } },
        },
      },
      right: {
        label: 'Play it like an open mic',
        governingStats: { cred: 1.0 },
        tags: ['live', 'indie', 'roots'],
        outcomes: {
          bad: { text: 'You’re so humble the new kids don’t realize who you are and critique your stage presence to your face. It’s useful feedback.', effects: { cred: 3, creativity: 2, burnout: 2 } },
          good: { text: 'No production, no setlist, all heart. The sound guy nods. He hasn’t nodded since the incident.', effects: { cred: 7, creativity: 3, burnout: -5 } },
          incredible: { text: 'You sign the wall next to the stage. The sound guy reveals he taped your first set. It’s… actually good?', effects: { cred: 9, creativity: 4, fame: 6, burnout: -5, pathProgress: 1 } },
        },
      },
    },
  },
  {
    id: 'a3_biopic_rumor', act: 3, pathAffinity: [], weight: 8,
    art: 'ev_biopic', context: 'An entertainment lawyer, unprompted',
    prompt: '“Someone is shopping a biopic of you. Unauthorized. The casting shortlist is, frankly, insulting. We can sue, or we can lean in.”',
    tags: ['fame', 'deal'],
    choices: {
      left: {
        label: 'Lean in, sell the rights',
        governingStats: { network: 0.9 },
        tags: ['deal', 'mainstream'],
        outcomes: {
          bad: { text: 'The movie gets made. Your character is a composite. Of you and a fictional saxophonist named “Rex.”', effects: { money: 300, fame: 6, cred: -4 } },
          good: { text: 'Decent check, decent film, and the actor studies your posture for months. Flattering. Unsettling. Flattering.', effects: { money: 450, fame: 10 } },
          incredible: { text: 'The biopic is a hit and the soundtrack — your catalog — charts twice in one decade. The rerun economy is real.', effects: { money: 650, fame: 16, network: 4, pathProgress: 1 } },
        },
      },
      right: {
        label: 'Kill it with fire (and lawyers)',
        governingStats: { cred: 0.8 },
        tags: ['deal', 'risky'],
        outcomes: {
          bad: { text: 'Legal fees mount. The producers rename it “UNBREAKABLE: A Musician’s Story” and make it anyway, worse.', effects: { money: -120, cred: 3, burnout: 6 } },
          good: { text: 'Cease and desist lands. Your story stays yours, which is the entire point of having one.', effects: { money: -60, cred: 6 } },
          incredible: { text: 'The suit settles in your favor AND you keep the script. It’s so bad it becomes beloved at parties. Priceless.', effects: { money: 200, cred: 7, fame: 4 } },
        },
      },
    },
  },
  {
    id: 'a3_voice_coach', act: 3, pathAffinity: [], weight: 6,
    art: 'ev_voice_coach', context: 'A vocal coach with unsettling eye contact',
    prompt: '“You’ve been hiding behind that thing.” She points at your instrument. “Your real instrument has been inside you the whole time. Sing.” The room waits.',
    tags: ['vocal', 'practice'],
    choices: {
      left: {
        label: 'Sing. Actually sing.',
        governingStats: { creativity: 0.7, cred: 0.5 },
        tags: ['vocal', 'risky'],
        outcomes: {
          bad: { text: 'What comes out is a sound previously heard only in nature documentaries. “Interesting,” she says, taking notes. So many notes.', effects: { creativity: 3, burnout: 4, skill: 2 } },
          good: { text: 'Rough, cracked, undeniably yours. She nods once. You leave carrying an instrument you can never put down.', effects: { setInstrument: 'own_voice', creativity: 4, cred: 3 } },
          incredible: { text: 'The note lands and the room goes quiet in the way rooms only go quiet for the real thing. Everything before this was the opening act.', effects: { setInstrument: 'own_voice', creativity: 6, cred: 5, fame: 6, pathProgress: 1 } },
        },
      },
      right: {
        label: 'Double down on your instrument',
        governingStats: { skill: 1.0 },
        tags: ['practice', 'safe'],
        outcomes: {
          bad: { text: '“Suit yourself,” she shrugs, and charges you for the full hour of not singing.', effects: { money: -40, skill: 3 } },
          good: { text: 'You play her your answer instead of singing it. She listens all the way through. “Fine. THAT’S your voice.”', effects: { skill: 6, cred: 3, creativity: 2 } },
          incredible: { text: 'You play the thing you could never sing. She stands up. “Never sing. Do THAT forever.” Best lesson you never took.', effects: { skill: 9, creativity: 4, cred: 4 } },
        },
      },
    },
  },
  // ---- Act 3: MEGASTAR ----
  {
    id: 'a3_arena_support', act: 3, pathAffinity: ['megastar'], weight: 10,
    art: 'ev_arena', context: 'The label, with lawyers',
    prompt: 'Arena tour support slot. The catch: they choose your setlist, your outfit, and — this is in writing — your “vibe.”',
    tags: ['live', 'deal', 'fame'],
    choices: {
      left: {
        label: 'Take the deal, eat the vibe',
        minigame: 'setlist',
        governingStats: { network: 1.0 },
        tags: ['live', 'mainstream'],
        outcomes: {
          bad: { text: 'The mandated vibe is “approachable lightning.” You perform it nightly, dying slightly.', effects: { fame: 10, cred: -5, burnout: 9, creativity: -3 } },
          good: { text: 'Arenas every night. The vibe committee wins, but 15,000 people learn your name each show.', effects: { fame: 18, network: 5, burnout: 8, cred: -2 } },
          incredible: { text: 'You smuggle yourself into the approved vibe. Crowds notice the real thing underneath. Stars are made of this.', effects: { fame: 28, network: 7, burnout: 7, pathProgress: 1 } },
        },
      },
      right: {
        label: 'Counter: your show, smaller rooms',
        governingStats: { cred: 1.0, network: 0.5 },
        tags: ['deal', 'risky', 'indie'],
        outcomes: {
          bad: { text: 'The label passes. The arena slot goes to a duo called Vibe Committee. The irony sustains you, barely.', effects: { cred: 4, fame: -3, burnout: 4 } },
          good: { text: 'A theater tour, your rules. Smaller rooms, bigger devotion. The right trade this year.', effects: { cred: 7, fame: 8, network: 3 } },
          incredible: { text: 'Your counter-tour sells out and the LABEL calls YOU about doing arenas “your way.” Leverage: acquired.', effects: { cred: 9, fame: 16, network: 6, pathProgress: 1 } },
        },
      },
    },
  },
  {
    id: 'a3_award_perf', act: 3, pathAffinity: ['megastar'], weight: 9,
    art: 'ev_awards', context: 'Awards show producer, headset, no patience',
    prompt: '“Ninety seconds. National broadcast. No pyro — the last act used our pyro budget. And our pyro.”',
    tags: ['live', 'fame'],
    choices: {
      left: {
        label: 'Safe medley, hit the marks',
        minigame: 'prompter',
        governingStats: { skill: 1.0 },
        tags: ['live', 'mainstream', 'safe'],
        outcomes: {
          bad: { text: 'Flawless and forgettable. The broadcast cuts to a celebrity yawning. The GIF outlives your set.', effects: { fame: 5, skill: 2 } },
          good: { text: 'Clean, tight, professional. America nods. America’s nod is worth millions of streams.', effects: { fame: 12, skill: 3, network: 3 } },
          incredible: { text: 'Ninety perfect seconds. The internet clips it into eternity. “Who IS this” trends. It’s you. You’re this.', effects: { fame: 22, network: 5, cred: 3, pathProgress: 1 } },
        },
      },
      right: {
        label: 'The stunt (unsanctioned)',
        governingStats: { creativity: 0.8, network: 0.5 },
        tags: ['live', 'risky'],
        outcomes: {
          bad: { text: 'The stunt malfunctions on live TV. You’re a meme by the commercial break. The bad kind. Mostly.', effects: { fame: 4, cred: -7, burnout: 9 } },
          good: { text: 'The stunt half-works, which reads as charmingly unhinged. Morning shows debate you. Debate = fame.', effects: { fame: 15, cred: 2, burnout: 5 } },
          incredible: { text: 'The stunt LANDS. Producers scream, censors sweat, culture shifts one degree. Iconic in 90 seconds.', effects: { fame: 30, cred: 4, burnout: 6, pathProgress: 1 } },
        },
      },
    },
  },
  {
    id: 'a3_scandal', act: 3, pathAffinity: ['megastar'], weight: 8,
    art: 'ev_scandal', context: 'A tabloid, loosely attached to reality',
    prompt: 'A tabloid claims you said “real musicians don’t use kazoos.” You may or may not have. There is audio. It’s ambiguous.',
    tags: ['fame', 'social'],
    choices: {
      left: {
        label: 'Apology tour',
        governingStats: { network: 1.0 },
        tags: ['social', 'safe', 'mainstream'],
        outcomes: {
          bad: { text: 'Your apology video’s lighting is too good. “Staged,” declares the internet, correctly.', effects: { fame: 2, cred: -3, burnout: 5 } },
          good: { text: 'A sincere podcast appearance defuses it. You even play a kazoo, penitently.', effects: { fame: 6, network: 4, burnout: 4 } },
          incredible: { text: 'The apology is so charming it becomes bigger than the scandal. Crisis: monetized.', effects: { fame: 14, network: 6, cred: 2 } },
        },
      },
      right: {
        label: 'Double down',
        governingStats: { cred: 0.8, creativity: 0.5 },
        tags: ['social', 'risky'],
        outcomes: {
          bad: { text: 'The Kazoo Community mobilizes. They are organized. They are LOUD. They are, technically, musicians.', effects: { fame: 4, cred: -6, burnout: 7 } },
          good: { text: 'Your unbothered follow-up post does numbers. Half the internet adopts you as their honest fave.', effects: { fame: 10, cred: 4 } },
          incredible: { text: 'You release a diss track played ENTIRELY on kazoo. All parties satisfied. Chart history made.', effects: { fame: 20, cred: 7, creativity: 5, pathProgress: 1 } },
        },
      },
    },
  },
  {
    id: 'a3_stadium_call', act: 3, pathAffinity: ['megastar'], weight: 10,
    requires: { fameMin: 45 },
    art: 'ev_stadium', context: 'THE call',
    prompt: 'A stadium headliner cancels. Sixty thousand tickets, Saturday, your name proposed in a panicked conference room. The call is happening.',
    tags: ['live', 'fame'],
    choices: {
      left: {
        label: 'Take the stadium',
        governingStats: { network: 0.8, skill: 0.8 },
        tags: ['live', 'risky', 'mainstream'],
        outcomes: {
          bad: { text: 'You’re not ready and the venue is honest about it: 60,000 people politely checking their phones.', effects: { fame: 10, cred: -4, burnout: 12 } },
          good: { text: 'You hold the room. Sixty thousand people. Held. Your legs stop shaking by song six.', effects: { fame: 20, network: 5, burnout: 9, cred: 3 } },
          incredible: { text: 'A career happens in one night. The aerial drone shot of the crowd singing YOUR bridge becomes the poster.', effects: { fame: 32, network: 8, cred: 5, burnout: 8, pathProgress: 2 } },
        },
      },
      right: {
        label: '“We need production time”',
        governingStats: { cred: 1.0 },
        tags: ['deal', 'safe'],
        outcomes: {
          bad: { text: 'They book someone hungrier. The someone is very good. You watch the drone shot from your couch.', effects: { cred: 2, fame: -2, burnout: -4 } },
          good: { text: 'Your restraint reads as professionalism. “Next one’s yours,” says the promoter, meaning it.', effects: { cred: 6, network: 5, burnout: -4 } },
          incredible: { text: 'The delay lets you build the show YOU wanted. When it lands next quarter, it’s not a fluke — it’s a debut.', effects: { cred: 8, network: 6, fame: 10, pathProgress: 1 } },
        },
      },
    },
  },
  {
    id: 'a3_ms_worldtour', act: 3, pathAffinity: ['megastar'], weight: 9,
    art: 'ev_worldtour', context: 'A routing map with too many pins',
    prompt: 'The agency presents two tours: “EVEREST” (40 cities, 5 continents, a jet with your face on it) or “CAMPFIRE” (12 rooms, no production, faces you can see).',
    tags: ['tour', 'live', 'fame'],
    choices: {
      left: {
        label: 'EVEREST. All of it.',
        governingStats: { network: 0.8, skill: 0.5 },
        tags: ['tour', 'live', 'mainstream', 'risky'],
        outcomes: {
          bad: { text: 'City 23 breaks you. You call the crowd by the wrong city’s name and the wrong city never forgets.', effects: { fame: 12, money: 300, burnout: 16, cred: -2 } },
          good: { text: 'Forty cities, one blur, your name in fonts you’ve never licensed. The jet photo alone is a career.', effects: { fame: 20, money: 450, network: 5, burnout: 13 } },
          incredible: { text: 'EVEREST sells out. All of it. The tour documentary practically films itself. You are, verifiably, everywhere.', effects: { fame: 30, money: 600, network: 7, burnout: 12, pathProgress: 2 } },
        },
      },
      right: {
        label: 'CAMPFIRE. Twelve perfect rooms.',
        governingStats: { cred: 0.9, creativity: 0.5 },
        tags: ['tour', 'live', 'indie'],
        outcomes: {
          bad: { text: 'The intimate tour is SO intimate a fan hands you soup mid-song. The soup is good. The boundary is gone.', effects: { cred: 4, fame: 4, burnout: 5 } },
          good: { text: 'Twelve nights people will describe to their grandchildren, inaccurately, with tears. The recordings become a live album.', effects: { cred: 8, fame: 8, creativity: 3, money: 150, burnout: 4 } },
          incredible: { text: 'Scarcity detonates demand. Scalpers weep at the door of a 200-cap room. The mythology is worth ten Everests.', effects: { cred: 10, fame: 14, creativity: 4, burnout: 3, pathProgress: 1 } },
        },
      },
    },
  },
  {
    id: 'a3_ms_persona', act: 3, pathAffinity: ['megastar'], weight: 8,
    art: 'ev_persona', context: 'A mirror, backstage',
    prompt: 'You catch your own reflection doing the Interview Smile. Unprompted. Off-camera. The persona has started wearing YOU.',
    tags: ['fame'],
    choices: {
      left: {
        label: 'Kill the persona',
        governingStats: { cred: 0.7, creativity: 0.6 },
        tags: ['indie', 'risky'],
        outcomes: {
          bad: { text: 'You “rebrand as yourself.” Three publications call it a rebrand. The persona sends a postcard: “you’ll be back.”', effects: { cred: 4, fame: -3, creativity: 3, burnout: 3 } },
          good: { text: 'You retire the Smile. Interviews get weirder and realer. The right fans lean in closer.', effects: { cred: 7, creativity: 5, fame: 3 } },
          incredible: { text: 'The unmasking becomes the most compelling era of your career. Critics call it “a debut, again.”', effects: { cred: 9, creativity: 7, fame: 10, pathProgress: 1 } },
        },
      },
      right: {
        label: 'Become it. Fully. On purpose.',
        governingStats: { network: 0.9 },
        tags: ['fame', 'mainstream', 'risky'],
        outcomes: {
          bad: { text: 'You commit to the bit so hard you answer your mother’s call with the Interview Voice. She hangs up. Fair.', effects: { fame: 8, cred: -4, burnout: 8 } },
          good: { text: 'The persona is bulletproof, bookable, and never tired. You clock out of it at 6 p.m. like a job. Healthy? Unclear. Effective? Very.', effects: { fame: 14, network: 4, burnout: 5, cred: -2 } },
          incredible: { text: 'The persona becomes iconic — a character the culture agrees to love. Somewhere inside it, you take notes for the memoir.', effects: { fame: 24, network: 6, burnout: 6, pathProgress: 1 } },
        },
      },
    },
  },
  // ---- Act 3: STUDIO LEGEND ----
  {
    id: 'a3_legend_album', act: 3, pathAffinity: ['studio'], weight: 10,
    art: 'ev_legend', context: 'A comeback album, hallowed studio',
    prompt: 'A living legend’s comeback record. You’re in the chair. The legend says “make it feel like 1974, but, you know. Now.”',
    tags: ['studio'],
    choices: {
      left: {
        label: 'Serve the song',
        governingStats: { skill: 1.0 },
        tags: ['studio', 'safe', 'roots'],
        outcomes: {
          bad: { text: 'You play it too reverently. “I already made THAT record,” sighs the legend, kindly, devastatingly.', effects: { skill: 4, cred: 2, burnout: 5 } },
          good: { text: 'You disappear into the music. The legend forgets you’re hired help. Highest compliment in the room.', effects: { skill: 7, cred: 7, money: 200, pathProgress: 1 } },
          incredible: { text: 'The legend stops a take to ask your name. Then uses it in the liner notes. Sainthood, session-musician division.', effects: { skill: 9, cred: 10, money: 280, network: 5, pathProgress: 1 } },
        },
      },
      right: {
        label: 'Pitch a rewrite of the bridge',
        governingStats: { creativity: 1.0, cred: 0.4 },
        tags: ['studio', 'risky'],
        outcomes: {
          bad: { text: 'The room temperature drops 40 degrees. The legend’s bassist walks you out. Gently. Permanently.', effects: { creativity: 3, cred: -5, burnout: 6 } },
          good: { text: 'The legend hums your bridge, changes one note, calls it theirs. You witnessed the process. The process is theft. Beautiful theft.', effects: { creativity: 6, cred: 5, money: 150 } },
          incredible: { text: '“Kid’s right.” Three syllables that reorder your entire career. The bridge is yours. Forever. On THEIR record.', effects: { creativity: 9, cred: 9, money: 220, fame: 5, pathProgress: 1 } },
        },
      },
    },
  },
  {
    id: 'a3_tv_band', act: 3, pathAffinity: ['studio'], weight: 9,
    art: 'ev_tv_band', context: 'Late-night TV, house band audition',
    prompt: 'The house band has an opening. Five nights a week, national TV, and the bandleader is famously allergic to “almost.”',
    tags: ['live', 'studio'],
    choices: {
      left: {
        label: 'Audition',
        governingStats: { skill: 1.0 },
        tags: ['live', 'risky', 'mainstream'],
        outcomes: {
          bad: { text: 'You crack ONE note in the sight-reading. The bandleader says “thank you” — the two worst words in music.', effects: { skill: 4, burnout: 6, cred: 1 } },
          good: { text: 'You make the shortlist of two. The other one’s uncle is the drummer, but you made the SHORTLIST.', effects: { skill: 6, cred: 6, network: 5, fame: 4 } },
          incredible: { text: 'The chair is yours. Five nights a week, your face is furniture in a million living rooms. Prestige furniture.', effects: { skill: 8, cred: 8, fame: 10, money: 300, pathProgress: 2 } },
        },
      },
      right: {
        label: 'Keep the session grind steady',
        governingStats: { cred: 0.8, network: 0.6 },
        tags: ['studio', 'safe'],
        outcomes: {
          bad: { text: 'A steady month of forgettable sessions. The money’s fine. The music evaporates on contact.', effects: { money: 150, skill: 2, burnout: 5 } },
          good: { text: 'Reliable, excellent, booked solid. Your calendar is the résumé.', effects: { money: 220, cred: 5, skill: 3 } },
          incredible: { text: 'Word of your consistency reaches the top rooms. First-call status: quietly achieved.', effects: { money: 280, cred: 8, network: 6, pathProgress: 1 } },
        },
      },
    },
  },
  {
    id: 'a3_one_take', act: 3, pathAffinity: ['studio'], weight: 9,
    art: 'ev_one_take', context: 'Tape is rolling. Actual tape.',
    prompt: '“We track to 2-inch tape here. One take, maybe two. Tape costs more than you do.” The engineer isn’t joking. Engineers never joke.',
    tags: ['studio'],
    choices: {
      left: {
        label: 'One take. Send it.',
        governingStats: { skill: 1.0 },
        tags: ['studio', 'risky'],
        outcomes: {
          bad: { text: 'You clam the ending. The tape keeps your mistake forever, in analog warmth.', effects: { skill: 4, cred: -2, burnout: 5, money: 100 } },
          good: { text: 'One take, honest and alive. The engineer almost smiles. Structural damage to his face.', effects: { skill: 7, cred: 6, money: 180 } },
          incredible: { text: 'THE take. The engineer marks the box with a star. That box outlives everyone in the room.', effects: { skill: 10, cred: 9, money: 220, fame: 3, pathProgress: 1 } },
        },
      },
      right: {
        label: 'Ask for a safety pass',
        governingStats: { skill: 0.7, cred: 0.5 },
        tags: ['studio', 'safe'],
        outcomes: {
          bad: { text: 'The safety pass is worse than the first take. Now there are two mediocre takes and one annoyed engineer.', effects: { skill: 3, burnout: 4, money: 100 } },
          good: { text: 'Smart, professional, unsexy. The comp takes the best of both. Nobody writes songs about comps.', effects: { skill: 5, cred: 3, money: 160 } },
          incredible: { text: 'Your “safety” pass catches fire and beats take one. Preparation, meet luck. You’re keeping both.', effects: { skill: 8, cred: 6, money: 200, pathProgress: 1 } },
        },
      },
    },
  },
  {
    id: 'a3_masterclass', act: 3, pathAffinity: ['studio'], weight: 8,
    art: 'ev_masterclass', context: 'An online education startup, aggressively cheerful',
    prompt: '“Film a masterclass! ‘YOUR NAME Teaches Being Good At Music.’ We handle everything. You handle being a brand.”',
    tags: ['deal', 'work'],
    choices: {
      left: {
        label: 'Film it, take the bag',
        governingStats: { network: 0.8 },
        tags: ['deal', 'mainstream'],
        outcomes: {
          bad: { text: 'The edit makes you say “unlock your flow-state” 14 times. You said it once. Ironically.', effects: { money: 250, cred: -4, fame: 4 } },
          good: { text: 'Decent course, passive income, mild embarrassment. The session-player retirement plan.', effects: { money: 400, fame: 5, cred: -1, grantHustle: 'masterclass_income' } },
          incredible: { text: 'The masterclass slaps, actually. Students improve. Money arrives monthly like weather.', effects: { money: 550, fame: 8, cred: 3, grantHustle: 'masterclass_income' } },
        },
      },
      right: {
        label: 'Teach one kid for free instead',
        governingStats: { cred: 1.0 },
        tags: ['safe', 'roots'],
        outcomes: {
          bad: { text: 'The kid quits after two lessons to become a streamer. You keep the folding chair angled toward the door.', effects: { cred: 3, burnout: -3 } },
          good: { text: 'The kid is good. The kid gets better. You remember why any of this matters.', effects: { cred: 6, creativity: 3, burnout: -6 } },
          incredible: { text: 'The kid is a prodigy and tells everyone who made them. Your legacy walks around town playing better than you.', effects: { cred: 10, network: 4, burnout: -5, pathProgress: 1 } },
        },
      },
    },
  },
  {
    id: 'a3_st_supersession', act: 3, pathAffinity: ['studio'], weight: 9,
    art: 'ev_supersession', context: 'Three legends, one night, no charts',
    prompt: 'A late-night “supersession”: three legends jamming for an album nobody has approved. The drummer points at you: “Bring your thing. You have one, right?”',
    tags: ['studio'],
    choices: {
      left: {
        label: 'Bring your thing',
        governingStats: { creativity: 0.7, skill: 0.7 },
        tags: ['studio', 'risky'],
        outcomes: {
          bad: { text: 'Your thing collides with a legend’s thing. His thing has seniority. You spend the night comping his thing.', effects: { skill: 4, cred: 2, burnout: 6 } },
          good: { text: 'At 3 a.m. your thing locks with their things and becomes, briefly, THE thing. The engineer marks the take with a heart.', effects: { skill: 6, creativity: 5, cred: 6, chainEventId: 'a3c_st_credits' } },
          incredible: { text: 'The jam becomes side B of the album. Your thing is now canon. Music historians will footnote you. FOOTNOTE you.', effects: { skill: 7, creativity: 6, cred: 9, money: 200, pathProgress: 1, chainEventId: 'a3c_st_credits' } },
        },
      },
      right: {
        label: 'Be the glue, not the star',
        governingStats: { skill: 1.0 },
        tags: ['studio', 'safe'],
        outcomes: {
          bad: { text: 'You hold it down so invisibly that at dawn a legend asks if you “just got here.” You’ve been here nine hours.', effects: { skill: 5, burnout: 5 } },
          good: { text: 'You are the reason the chaos lands anywhere. Legends notice glue. Glue gets called back.', effects: { skill: 7, cred: 6, network: 4 } },
          incredible: { text: 'The bassist — THE bassist — takes your number and says four words that reroute your life: “every session. you. always.”', effects: { skill: 8, cred: 9, network: 7, pathProgress: 2 } },
        },
      },
    },
  },
  {
    id: 'a3c_st_credits', act: 3, pathAffinity: ['studio'], weight: 0, chainOnly: true,
    art: 'ev_credits', context: 'The liner notes, six weeks later',
    prompt: 'The supersession album ships. The credits list you as “additional musician: STEVE.” You are not, and have never been, Steve.',
    tags: ['deal'],
    choices: {
      left: {
        label: 'Demand a correction',
        governingStats: { cred: 0.9 },
        tags: ['deal'],
        outcomes: {
          bad: { text: 'The label “fixes” it in the streaming metadata to “Steve (feat. you).” Somehow worse. Steve is winning.', effects: { cred: 2, burnout: 4 } },
          good: { text: 'Corrected in the repress. Your actual name, on an actual classic. Worth every email. All forty of them.', effects: { cred: 7, network: 3 } },
          incredible: { text: 'The correction comes with an apology call from the legend himself, who then hires you — by name — for the next record.', effects: { cred: 9, network: 6, money: 200, pathProgress: 1 } },
        },
      },
      right: {
        label: 'Become Steve',
        governingStats: { creativity: 0.8 },
        tags: ['risky', 'indie'],
        outcomes: {
          bad: { text: 'You lean in and register STEVE as a side project. Steve’s demo gets rejected. You are now failing as two people.', effects: { creativity: 3, fame: 1, burnout: 4 } },
          good: { text: '“Who is Steve?” becomes a forum mystery. Steve develops a cult following. Steve does not exist. Steve is thriving.', effects: { creativity: 6, fame: 6, cred: 3 } },
          incredible: { text: 'Steve releases one perfect single and retires. The myth outearns the session. You attend Steve’s farewell in sunglasses.', effects: { creativity: 8, fame: 10, money: 250, cred: 4 } },
        },
      },
    },
  },
  {
    id: 'a3_st_loyalty', act: 3, pathAffinity: ['studio'], weight: 8,
    art: 'ev_loyalty', context: 'Two calls, one Tuesday',
    prompt: 'A legend’s comeback session and your best friend’s debut album land on the same day. Both say the same sentence: “It has to be you.”',
    tags: ['studio', 'network'],
    choices: {
      left: {
        label: 'The legend. Career logic.',
        governingStats: { skill: 0.9 },
        tags: ['studio', 'mainstream'],
        outcomes: {
          bad: { text: 'The legend cancels last minute — “creative rest.” Your friend’s album tracks without you. Both chairs, empty. The Tuesday haunts.', effects: { skill: 2, network: -3, burnout: 6 } },
          good: { text: 'The session is flawless; the credit is gold. Your friend forgives you in a text with one period too many.', effects: { skill: 6, cred: 6, money: 250, network: -1 } },
          incredible: { text: 'The legend’s record wins everything and your name rides it. Your friend’s toast at the afterparty: “Tuesday traitor” — said with love. Mostly love.', effects: { skill: 7, cred: 9, money: 300, fame: 5, pathProgress: 1 } },
        },
      },
      right: {
        label: 'The friend. Loyalty logic.',
        governingStats: { cred: 0.8, network: 0.6 },
        tags: ['studio', 'indie'],
        outcomes: {
          bad: { text: 'The debut stalls at 4,000 streams. The legend’s record — with someone else in your chair — wins a statue. You reread your choice at 3 a.m., then reread the text where your friend calls you family. It balances. Barely.', effects: { cred: 4, network: 3, burnout: 4 } },
          good: { text: 'You give the debut everything the big rooms never would. It becomes a slow-burn classic in your city.', effects: { cred: 7, network: 5, creativity: 4 } },
          incredible: { text: 'The debut breaks out — and its liner notes tell everyone who showed up on the Tuesday that mattered. Your loyalty becomes your legend.', effects: { cred: 10, network: 7, fame: 6, pathProgress: 1 } },
        },
      },
    },
  },
  // ---- Act 3: HIT FACTORY ----
  {
    id: 'a3_song_of_summer', act: 3, pathAffinity: ['hitfactory'], weight: 10,
    art: 'ev_summer', context: 'Label brief, due Monday',
    prompt: '“We need THE song of summer. Beach, heartbreak, but fun heartbreak. Chorus by second 40. It’s Thursday.”',
    tags: ['write'],
    choices: {
      left: {
        label: 'Chase the formula',
        governingStats: { creativity: 0.7, skill: 0.6 },
        tags: ['write', 'mainstream'],
        outcomes: {
          bad: { text: 'You deliver competent summer product. It becomes the song of one (1) car dealership.', effects: { money: 150, creativity: -2, burnout: 6 } },
          good: { text: 'It’s catchy, it’s sunny, it’s everywhere by July. Fun heartbreak: achieved.', effects: { money: 300, fame: 8, hits: 1, burnout: 5 } },
          incredible: { text: 'THE song of summer. Grocery stores. Weddings. A president’s playlist, controversially. Summer is yours.', effects: { money: 500, fame: 16, hits: 2, pathProgress: 1 } },
        },
      },
      right: {
        label: 'Write the weird one instead',
        governingStats: { creativity: 1.0 },
        tags: ['write', 'risky', 'indie'],
        outcomes: {
          bad: { text: 'The label says “this is a song of autumn, at best.” It is shelved with honors.', effects: { creativity: 5, cred: 2, burnout: 4 } },
          good: { text: 'The weird one gets cut by a left-field artist and becomes a critics’ darling. Slow money, fast respect.', effects: { creativity: 7, cred: 6, hits: 1 } },
          incredible: { text: 'The weird one IS the song of summer. Nobody saw it coming, which is why it worked. You broke the formula publicly.', effects: { creativity: 10, cred: 8, fame: 12, hits: 2, pathProgress: 1 } },
        },
      },
    },
  },
  {
    id: 'a3_exec_notes', act: 3, pathAffinity: ['hitfactory'], weight: 9,
    art: 'ev_exec', context: 'An exec with opinions and a standing desk',
    prompt: '“Love it. One note: make it more like everything else. That’s the note. That’s the whole note.”',
    tags: ['write', 'deal'],
    choices: {
      left: {
        label: 'Take the note',
        governingStats: { network: 0.8 },
        tags: ['write', 'mainstream', 'safe'],
        outcomes: {
          bad: { text: 'Sanded to a perfect smoothness, the song slides off every playlist it touches.', effects: { money: 120, creativity: -3, cred: -2 } },
          good: { text: 'The compromise version ships and performs. The exec claims the “vision.” You claim the check.', effects: { money: 250, hits: 1, fame: 4, cred: -1 } },
          incredible: { text: 'Somehow, sanded down, the hook shines HARDER. A hit. The exec frames the standing desk.', effects: { money: 400, hits: 1, fame: 10, pathProgress: 1 } },
        },
      },
      right: {
        label: 'Play them the original. Louder.',
        governingStats: { cred: 0.7, creativity: 0.7 },
        tags: ['write', 'risky'],
        outcomes: {
          bad: { text: 'The exec listens, nods, and shelves it “for strategic reasons.” Strategy is a drawer.', effects: { creativity: 3, cred: 3, burnout: 5 } },
          good: { text: 'At full volume, the exec’s foot betrays them: it taps. Original version approved, grudgingly.', effects: { creativity: 6, cred: 6, hits: 1 } },
          incredible: { text: 'The exec goes silent, then: “don’t change anything.” Executives fear one thing — being wrong about a smash. It’s a smash.', effects: { creativity: 8, cred: 9, hits: 1, fame: 8, pathProgress: 1 } },
        },
      },
    },
  },
  {
    id: 'a3_three_peat', act: 3, pathAffinity: ['hitfactory'], weight: 9,
    requires: { stats: { hitsMin: 1 } },
    art: 'ev_machine', context: 'A trade magazine cover, allegedly you',
    prompt: 'Three of your songs chart in the same month. The headline: “THE MACHINE.” Everyone wants the machine. Nobody asks if the machine sleeps.',
    tags: ['write', 'fame'],
    choices: {
      left: {
        label: 'Lean in. Factory mode.',
        governingStats: { creativity: 0.6, network: 0.8 },
        tags: ['write', 'mainstream'],
        outcomes: {
          bad: { text: 'You take every session. Song 9 this month rhymes “dance” with “dance.” The machine needs oil.', effects: { money: 300, hits: 1, burnout: 14, creativity: -3 } },
          good: { text: 'A punishing schedule, a growing catalog. The machine hums. The human inside it also hums, tiredly.', effects: { money: 450, hits: 1, fame: 6, burnout: 11 } },
          incredible: { text: 'Peak output, peak quality. An impossible month. They’ll teach this run in music-business classes, wrongly.', effects: { money: 600, hits: 2, fame: 10, burnout: 10, pathProgress: 1 } },
        },
      },
      right: {
        label: 'Protect the process',
        governingStats: { creativity: 1.0 },
        tags: ['write', 'safe', 'indie'],
        outcomes: {
          bad: { text: 'You turn down eight sessions to “recharge.” The trades downgrade you to “THE APPLIANCE.”', effects: { creativity: 3, fame: -2, burnout: -8 } },
          good: { text: 'Fewer songs, better songs. The catalog thanks you. Future-you thanks you.', effects: { creativity: 7, cred: 4, burnout: -10, hits: 1 } },
          incredible: { text: 'Scarcity does its magic: your rate triples. The machine, it turns out, was a boutique all along.', effects: { creativity: 8, cred: 6, money: 350, burnout: -8, hits: 1, pathProgress: 1 } },
        },
      },
    },
  },
  {
    id: 'a3_secret_album', act: 3, pathAffinity: ['hitfactory'], weight: 9,
    art: 'ev_secret', context: 'A superstar, via burner phone',
    prompt: '“Surprise album. Two weeks. Total secrecy. You’d run the whole thing. If you tell anyone, we never spoke. We are not speaking now.”',
    tags: ['write', 'studio'],
    choices: {
      left: {
        label: 'Lock in. Two weeks of madness.',
        governingStats: { creativity: 0.8, skill: 0.6 },
        tags: ['write', 'studio', 'risky'],
        outcomes: {
          bad: { text: 'The album leaks on day 11, ruining the surprise. The internet blames an intern. You suspect the burner phone.', effects: { creativity: 4, money: 200, burnout: 13, hits: 1 } },
          good: { text: 'It drops at midnight and detonates. Your fingerprints are on every track. The right people dust for prints.', effects: { creativity: 6, money: 400, fame: 8, hits: 1, burnout: 11, pathProgress: 1 } },
          incredible: { text: 'Album of the year conversations. Your name in the credits 14 times. The burner phone becomes a museum piece.', effects: { creativity: 8, money: 600, fame: 14, hits: 2, burnout: 10, pathProgress: 2 } },
        },
      },
      right: {
        label: 'Send your best folder instead',
        governingStats: { network: 1.0 },
        tags: ['write', 'safe'],
        outcomes: {
          bad: { text: 'The folder vanishes into the superstar’s camp. Two years later a hook of yours surfaces, uncredited, in a soda ad.', effects: { network: 2, burnout: 2 } },
          good: { text: 'Three songs make the album. You sleep normal hours AND chart. The dream, quietly achieved.', effects: { network: 5, money: 250, hits: 1, fame: 4 } },
          incredible: { text: 'The lead single is yours, untouched. The superstar posts the demo with your name. The folder was enough.', effects: { network: 8, money: 400, hits: 1, fame: 10, cred: 4, pathProgress: 1 } },
        },
      },
    },
  },

  {
    id: 'a3_hf_diane', act: 3, pathAffinity: ['hitfactory'], weight: 9,
    art: 'ev_diane', context: 'Diane’s people (Diane herself never calls)',
    prompt: 'Diane — THE Diane — wants “Cousin’s Wedding,” the song you wrote about the night everything almost fell apart. The most personal thing in the vault. Her people call it “a smash template.”',
    tags: ['write', 'deal'],
    choices: {
      left: {
        label: 'Let Diane have it',
        governingStats: { network: 0.9 },
        tags: ['deal', 'mainstream'],
        outcomes: {
          bad: { text: 'Diane’s version swaps your bridge for a drop. It’s enormous. At weddings, people scream the drop. Your therapist raises her rate.', effects: { money: 400, hits: 1, creativity: -3, fame: 4 } },
          good: { text: 'Diane sings it almost straight. Millions hear your night. They think it’s hers, but the publishing knows the truth.', effects: { money: 550, hits: 1, fame: 6, cred: 3 } },
          incredible: { text: 'Diane performs it at the awards show and dedicates it, on live TV, “to the writer.” The entire industry googles you at once.', effects: { money: 700, hits: 1, fame: 12, cred: 6, network: 6, pathProgress: 1 } },
        },
      },
      right: {
        label: 'Keep it. Sing it yourself.',
        governingStats: { creativity: 0.8, cred: 0.5 },
        tags: ['record', 'risky', 'indie'],
        outcomes: {
          bad: { text: 'Your version reaches the people it was about, and almost no one else. Diane cuts something similar. It goes to #2. You check the math on your integrity weekly.', effects: { creativity: 4, cred: 4, fame: 2 } },
          good: { text: 'The writer-sings-it version becomes a critics’ favorite. Smaller. Truer. The vault stays yours.', effects: { creativity: 6, cred: 7, fame: 6, hits: 1 } },
          incredible: { text: 'Your own voice on your own night connects like nothing you’ve ghostwritten ever has. The industry re-files you: not just a factory. An artist.', effects: { creativity: 9, cred: 9, fame: 12, hits: 1, pathProgress: 2 } },
        },
      },
    },
  },
  {
    id: 'a3_hf_prodigy', act: 3, pathAffinity: ['hitfactory'], weight: 8,
    art: 'ev_prodigy', context: 'A 17-year-old with terrifying instincts',
    prompt: 'The label asks you to mentor Wren: seventeen, self-taught, writes hooks in the time it takes you to open your laptop. The kid is the asteroid. You are, possibly, the dinosaur.',
    tags: ['write', 'network'],
    choices: {
      left: {
        label: 'Mentor the asteroid',
        governingStats: { cred: 0.7, network: 0.6 },
        tags: ['network', 'safe'],
        outcomes: {
          bad: { text: 'Wren absorbs your entire toolkit in three sessions and outgrows you by the fourth. “Thanks,” they say, meaning it, leaving.', effects: { cred: 4, network: 2, burnout: 4 } },
          good: { text: 'You teach craft; Wren teaches you what phones hear. The co-writes split the difference and the royalties.', effects: { cred: 6, network: 5, creativity: 4, hits: 1 } },
          incredible: { text: 'Wren’s debut thanks you by name in the first line of the notes. Half the industry now wants your “development instincts.” The dinosaur, it turns out, taught the asteroid to aim.', effects: { cred: 9, network: 7, hits: 1, money: 200, pathProgress: 1 } },
        },
      },
      right: {
        label: 'Compete. Quietly. Pettily.',
        governingStats: { creativity: 1.0 },
        tags: ['write', 'risky'],
        outcomes: {
          bad: { text: 'You pull three all-nighters to out-write a teenager. The teenager slept. The teenager won. The teenager doesn’t know there was a contest.', effects: { creativity: 4, burnout: 9 } },
          good: { text: 'The private rivalry sharpens you. Your next three songs are your best in years. Wren remains unaware. Wren must never know.', effects: { creativity: 7, hits: 1, burnout: 5 } },
          incredible: { text: 'Fear of obsolescence produces your masterpiece. Wren posts about it: “this is the one that made me want to write.” You close the laptop. You needed that.', effects: { creativity: 10, hits: 1, cred: 5, fame: 6, pathProgress: 1 } },
        },
      },
    },
  },
  // ═══════════ SCENE POLITICS (react to genre/hustle systems) ═══════════
  {
    id: 'a2_genre_purists', act: 2, pathAffinity: [], weight: 9,
    requires: { genreAny: true },
    art: 'ev_purists', context: 'The {genre} forum, thread #4,118',
    prompt: 'The {genre} purists have ruled: you are “killing the scene.” The scene, notably, has 312 members, and 280 of them found it through you.',
    tags: ['social'],
    choices: {
      left: {
        label: 'Engage. Respectfully. Once.',
        governingStats: { cred: 0.8, network: 0.5 },
        tags: ['social', 'risky'],
        outcomes: {
          bad: { text: 'Your measured reply spawns four new threads, two manifestos, and a diss remix of your own song. In {genre}. Which they said you killed.', effects: { cred: 2, fame: 3, burnout: 5 } },
          good: { text: 'You cite the founding records, correctly. The forum elders emerge from dormancy to vouch. The thread locks itself out of respect.', effects: { cred: 6, network: 3, fame: 3 } },
          incredible: { text: 'Your reply becomes the pinned history of the genre. Purists now cite YOU. The scene grows. Nobody killed anything.', effects: { cred: 9, fame: 6, network: 4 } },
        },
      },
      right: {
        label: 'Post nothing. Drop a better record.',
        governingStats: { creativity: 1.0 },
        tags: ['record', 'indie'],
        outcomes: {
          bad: { text: 'The record is good but drops the same day as a scandal in an adjacent scene. The purists claim victory over the silence.', effects: { creativity: 4, fame: 2 } },
          good: { text: 'The album answers every thread without naming one. Purism, it turns out, cannot survive contact with a great bridge.', effects: { creativity: 7, cred: 4, fame: 4 } },
          incredible: { text: 'The record redefines what {genre} even is. Thread #4,118 quietly retitles itself “early press.”', effects: { creativity: 9, cred: 6, fame: 8 } },
        },
      },
    },
  },
  {
    id: 'a3_genre_face', act: 3, pathAffinity: [], weight: 10,
    requires: { genreAny: true },
    art: 'ev_genre_face', context: 'A trend piece, going to print either way',
    prompt: 'A culture magazine is declaring the {genre} wave, and they want you as the face of it. Cover shoot Thursday. Waves, historically, crash.',
    tags: ['fame', 'social'],
    choices: {
      left: {
        label: 'Be the face. Ride the wave.',
        governingStats: { network: 0.9 },
        tags: ['fame', 'mainstream'],
        outcomes: {
          bad: { text: 'The wave crests early. By the time the issue prints, the trend piece reads like an obituary with your face on it.', effects: { fame: 6, cred: -3, burnout: 4 } },
          good: { text: 'The cover mints you as shorthand for a sound. Bookings triple. The wave holds long enough to matter.', effects: { fame: 14, network: 5, cred: 2, pathProgress: 1 } },
          incredible: { text: 'The wave becomes an era, and eras need a face. Museums will one day caption this photo. You wore the good jacket. Thank god.', effects: { fame: 22, network: 6, cred: 4, pathProgress: 1 } },
        },
      },
      right: {
        label: '“Genres are marketing. Next question.”',
        governingStats: { cred: 1.0 },
        tags: ['indie', 'risky'],
        outcomes: {
          bad: { text: 'They run the piece anyway with a photo of your rival, captioned as you. Everyone involved apologizes except the wave.', effects: { cred: 3, fame: -2, rivalry: 1 } },
          good: { text: 'The refusal quote runs as the headline and ages beautifully. When the wave crashes, you are standing on the beach, dry.', effects: { cred: 7, creativity: 3, fame: 4 } },
          incredible: { text: '“Genres are marketing” becomes the epigraph of the scene’s definitive book. You outlived the wave by refusing to surf it.', effects: { cred: 10, creativity: 4, fame: 7 } },
        },
      },
    },
  },
  {
    id: 'a2_hustle_audit', act: [2, 3], pathAffinity: [], weight: 9,
    requires: { hustleMin: 1 },
    art: 'ev_audit', context: 'The Bureau of Supplemental Income (est. Tuesday)',
    prompt: 'A person with a lanyard and a tote bag audits your side income. “Merch, royalties, a… compost corner? We’re going to need receipts. Or a really good story.”',
    tags: ['deal', 'work'],
    choices: {
      left: {
        label: 'Produce the receipts',
        governingStats: { skill: 0.5, cred: 0.7 },
        tags: ['work', 'safe'],
        outcomes: {
          bad: { text: 'Your receipts are setlists with numbers on them. The auditor sighs a fine into existence.', effects: { money: -80, burnout: 4 } },
          good: { text: 'The shoebox holds. The auditor stamps everything and mutters “most organized musician this quarter,” which is damning and delightful.', effects: { cred: 4, money: -20 } },
          incredible: { text: 'Your paperwork is so clean the Bureau asks who does your books. It’s you. They offer you a job. You decline via song.', effects: { cred: 6, money: 60, network: 3 } },
        },
      },
      right: {
        label: 'Tell the really good story',
        governingStats: { creativity: 0.9 },
        tags: ['risky'],
        outcomes: {
          bad: { text: 'The story is excellent. Fiction, but excellent. The fine includes a small surcharge for wasting the auditor’s afternoon beautifully.', effects: { money: -120, creativity: 3, fame: 2 } },
          good: { text: 'Halfway through the saga of Craig and the corner, the auditor closes the folder. “I don’t get paid enough for lore.” Case dismissed.', effects: { creativity: 5, cred: 3 } },
          incredible: { text: 'The auditor becomes a fan mid-audit, buys merch AT the audit, and files your case under “cultural contribution.” The tote bag has your logo now.', effects: { creativity: 7, fame: 5, money: 40, network: 3 } },
        },
      },
    },
  },
  {
    id: 'a3_hustle_profile', act: 3, pathAffinity: [], weight: 9,
    requires: { hustleMin: 2 },
    art: 'ev_profile', context: 'HUSTLE Quarterly (a business magazine)',
    prompt: '“Musician? Sure. But our readers want the PORTFOLIO. The residency, the royalties, the corner. We’re calling it: ‘The Artist As Small Business.’”',
    tags: ['fame', 'deal'],
    choices: {
      left: {
        label: 'Do the business profile',
        governingStats: { network: 0.9 },
        tags: ['mainstream', 'deal'],
        outcomes: {
          bad: { text: 'The photo shoot involves a blazer over a band tee and the caption “founder.” Musicians text you the cover with no message. None needed.', effects: { money: 150, fame: 5, cred: -4 } },
          good: { text: 'The profile is embarrassing and lucrative — the industry special. Three venues raise your fee because “the market spoke.”', effects: { money: 300, fame: 8, cred: -2, network: 4 } },
          incredible: { text: 'The piece coins “portfolio artist” and credits you. Business school syllabi now contain your compost corner. Unstoppable. Absurd. Unstoppable.', effects: { money: 450, fame: 12, network: 6 } },
        },
      },
      right: {
        label: '“The business is a side effect.”',
        governingStats: { cred: 0.9 },
        tags: ['indie'],
        outcomes: {
          bad: { text: 'They print the refusal as a pull quote next to your merch revenue. The juxtaposition does numbers. Against you.', effects: { cred: 3, fame: 2 } },
          good: { text: 'The quote reframes the piece into something almost true. The art stays the headline; the hustles stay the footnote.', effects: { cred: 6, fame: 4 } },
          incredible: { text: '“The business is a side effect” gets embroidered, bootlegged, and tattooed. Your accountant frames the original invoice.', effects: { cred: 9, fame: 7, money: 100 } },
        },
      },
    },
  },
  // ═══════════ THE DIVE BAR CIRCUIT (Career Wall pack #2) ═══════════
  {
    id: 'db_chicken_wire', act: [1, 2], pathAffinity: [], weight: 9, pack: 'pack_divebar',
    art: 'ev_db_wire', context: 'The Rusty Spur (est. long ago, cleaned never)',
    prompt: 'There is chicken wire in front of the stage. You ask what it’s for. The booker says “Thursdays.” Today is Thursday. “You’ll be fine. They like both kinds of music.”',
    tags: ['live', 'roots'],
    choices: {
      left: {
        label: 'Play YOUR set behind the wire',
        governingStats: { cred: 0.7, skill: 0.6 },
        tags: ['live', 'risky', 'indie'],
        outcomes: {
          bad: { text: 'The first bottle arrives during song two. The wire earns its keep. You finish the set out of pure spite, which the crowd — to your horror — respects deeply.', effects: { cred: 5, burnout: 7, money: 40 } },
          good: { text: 'By the third song the bottles stop and the boots start tapping. You have converted a room that has never once been converted. The wire stands down.', effects: { cred: 7, skill: 3, money: 60, fame: 3 } },
          incredible: { text: 'The Spur goes QUIET for the slow one. The booker says nobody’s done that since ’09. There’s a photo of the ’09 guy over the bar. There’s room for a second photo.', effects: { cred: 10, skill: 3, fame: 6, money: 80, network: 3 } },
        },
      },
      right: {
        label: 'Learn “both kinds” on the spot',
        governingStats: { skill: 0.9 },
        tags: ['live', 'mainstream', 'safe'],
        outcomes: {
          bad: { text: 'Your country is 40% wrong and your western is worse, but the effort reads. A man named Hoss buys you a consolation beer and one (1) fact about trucks.', effects: { skill: 3, network: 2, money: 30 } },
          good: { text: 'You fake the genre convincingly enough that requests start coming. You honor three of them. The tip jar develops a paper layer.', effects: { skill: 5, money: 90, network: 3 } },
          incredible: { text: 'Turns out the twang was IN you. The Spur offers you a standing slot and Hoss names a pool cue after you. Highest honor available in this building.', effects: { skill: 6, money: 120, cred: 4, network: 4 } },
        },
      },
    },
  },
  {
    id: 'db_tuesday_residency', act: 2, pathAffinity: [], weight: 8, pack: 'pack_divebar',
    art: 'ev_db_tuesday', context: 'The Anchor (worst bar, best regulars)',
    prompt: 'The Anchor offers you Tuesdays. Forever. Pay is the door, the door is $5, and the regulars — nine of them, immortal — have watched every band in this town be born or die.',
    tags: ['live', 'deal'],
    choices: {
      left: {
        label: 'Take the Tuesdays',
        governingStats: { cred: 0.8 },
        tags: ['live', 'roots', 'safe'],
        outcomes: {
          bad: { text: 'Week one: four people. Week two: six. The regulars grade you silently from the corner like a panel of tenured owls. You are, apparently, “coming along.”', effects: { cred: 4, money: 25, skill: 2, grantHustle: 'residency' } },
          good: { text: 'By week five the nine regulars have become forty, and the forty know the words. The Anchor’s Tuesday becomes a thing people say with a capital T.', effects: { cred: 6, network: 4, money: 40, grantHustle: 'residency' } },
          incredible: { text: 'The owls approve. One of them, it emerges, produced two records you own. “Been waiting to see if you’d keep showing up,” he says. “Most don’t.” His card has no name, just an address.', effects: { cred: 8, network: 7, skill: 3, grantHustle: 'residency', pathProgress: 1 } },
        },
      },
      right: {
        label: 'Too small. Aim bigger.',
        governingStats: { network: 0.8 },
        tags: ['risky', 'mainstream'],
        outcomes: {
          bad: { text: 'The bigger room you chase falls through twice. Tuesdays at the Anchor go to someone hungrier. Their capital-T Thing is very annoying to watch happen.', effects: { network: 2, burnout: 4, rivalry: 1 } },
          good: { text: 'You book the mid-size room instead and fill half of it, which beats all of the Anchor. The math works. The owls send no regards. Owls never do.', effects: { network: 4, fame: 5, money: 60 } },
          incredible: { text: 'The gamble lands: a support-slot tour takes the Anchor’s Tuesday out of your calendar. On your last free Tuesday you play the Anchor once, unannounced, for nine people. Perfect show.', effects: { network: 6, fame: 8, cred: 4, burnout: 3 } },
        },
      },
    },
  },
  {
    id: 'db_jukebox', act: 2, pathAffinity: [], weight: 8, pack: 'pack_divebar',
    art: 'ev_db_jukebox', context: 'The jukebox at Sal’s (slot D7)',
    prompt: 'Your single is on Sal’s jukebox now — D7, between two eternal classics. A regular named Marguerite plays D6 and D8 pointedly, skipping you, every single night. It’s become a bit. The whole bar watches.',
    tags: ['social', 'roots'],
    choices: {
      left: {
        label: 'Win Marguerite over',
        governingStats: { network: 0.8 },
        tags: ['network', 'safe'],
        outcomes: {
          bad: { text: 'You buy her a drink. She accepts the drink and plays D6. “Nothing personal, sugar. You’re just not Patsy.” Nobody is Patsy. You accept the ruling.', effects: { network: 3, cred: 2 } },
          good: { text: 'You ask what D7 is missing. “A bridge that means it.” You play her the new bridge, acoustic, at the bar. She plays D7 the next night. Once. It counts.', effects: { network: 4, creativity: 4, cred: 3 } },
          incredible: { text: 'Marguerite, won, becomes your fiercest evangelist. She now plays D7 twice nightly and glares at anyone who talks over it. You cannot buy security like this.', effects: { network: 6, cred: 5, fame: 5 } },
        },
      },
      right: {
        label: 'Earn D7. Write something worthy of Sal’s.',
        governingStats: { creativity: 1.0 },
        tags: ['write', 'roots', 'risky'],
        outcomes: {
          bad: { text: 'You write “Marguerite” and it’s TOO on the nose. She skips it with extra ceremony. The bar loves the drama more than either song. Sal adds a D9 just to expand the feud.', effects: { creativity: 4, fame: 3, burnout: 3 } },
          good: { text: 'You write the kind of song that belongs between D6 and D8 — no tricks, no drop, just a story that lands. It earns its slot. Even the skeptics let it finish.', effects: { creativity: 7, cred: 5, hits: 1 } },
          incredible: { text: 'The new one becomes the closing-time song at Sal’s — the one the whole bar sings at 1:55 a.m., arms around strangers. There is no chart for this. It’s better than the charts.', effects: { creativity: 9, cred: 7, fame: 5, hits: 1, chartTitle: 'Last Call At Sal’s' } },
        },
      },
    },
  },
  {
    id: 'db_inspector', act: [2, 3], pathAffinity: [], weight: 8, pack: 'pack_divebar',
    art: 'ev_db_inspector', context: 'Mid-set. A clipboard that is not Curtis.',
    prompt: 'Four songs in, the health inspector shuts the venue down — something about the ice machine “having opinions.” The crowd spills into the parking lot, unwilling to go home. Your amp is inside. The moon is out.',
    tags: ['live'],
    choices: {
      left: {
        label: 'Finish the set acoustic, on the curb',
        governingStats: { cred: 0.7, creativity: 0.6 },
        tags: ['live', 'busk', 'indie'],
        outcomes: {
          bad: { text: 'Cars keep pulling out mid-song with apologetic waves. You finish for eleven diehards and one confused valet. The eleven will retell this forever, embellished.', effects: { cred: 4, burnout: 4, fame: 2 } },
          good: { text: 'The parking lot show becomes the better show — unamplified, huddled, hymn-like. The inspector stays for two songs. Off the record.', effects: { cred: 6, fame: 5, creativity: 3 } },
          incredible: { text: 'Someone films the curb set under the one working streetlight. “The Parking Lot Tapes” outperform your actual releases. The venue reopens and hangs a plaque on the curb. THE CURB.', effects: { cred: 8, fame: 10, creativity: 4, network: 3, chartTitle: 'The Parking Lot Tapes' } },
        },
      },
      right: {
        label: 'Reschedule. Protect the production.',
        governingStats: { network: 0.8 },
        tags: ['deal', 'safe'],
        outcomes: {
          bad: { text: 'The make-up date lands on the night of the big game. Attendance: relatives. The ice machine, repaired, hums smugly.', effects: { network: 2, money: 20 } },
          good: { text: 'The rescheduled show sells better — shutdown drama is, it turns out, marketing. You open with a song dedicated to the ice machine. It kills.', effects: { network: 4, fame: 5, money: 60 } },
          incredible: { text: 'You negotiate damages INTO the new deal: better cut, better slot, and the venue’s eternal gratitude for not posting about the ice. Professionalism: weaponized.', effects: { network: 6, money: 150, cred: 4 } },
        },
      },
    },
  },
  {
    id: 'db_last_call', act: 3, pathAffinity: [], weight: 9, pack: 'pack_divebar',
    art: 'ev_db_lastcall', context: 'After close. Chairs on tables. One light on.',
    prompt: 'The bartender — twenty years behind this bar, seen every band you’ve ever feared or loved — slides a cassette across the wood. “My stuff. From before.” He doesn’t look at you while you take it. “Just tell me if I was right to stop.”',
    tags: ['roots', 'home'],
    choices: {
      left: {
        label: 'Listen. Tell him the truth.',
        governingStats: { cred: 0.9 },
        tags: ['safe', 'roots'],
        outcomes: {
          bad: { text: 'The tape is… fine. You say so, gently, with specifics. He nods for a long time. “Fine’s what I thought.” He pours two. Some verdicts are a relief on both sides of the bar.', effects: { cred: 5, burnout: -4 } },
          good: { text: 'Track four is genuinely good and you tell him exactly why — the turnaround, the second verse. He writes it down. Sixty years old and he writes it down. You both pretend his eyes are fine.', effects: { cred: 7, creativity: 3, burnout: -5 } },
          incredible: { text: 'Track four is better than good, and you prove it: you record it — his song, your take, his blessing, both names. It doesn’t chart. It does something better: it exists. He keeps a copy behind the register.', effects: { cred: 10, creativity: 5, network: 3, burnout: -5, chartTitle: 'Track Four (After Close)' } },
        },
      },
      right: {
        label: '“Play it for me instead. Right now.”',
        governingStats: { network: 0.6, creativity: 0.6 },
        tags: ['live', 'risky'],
        outcomes: {
          bad: { text: 'His hands remember about 60% of it. The missing 40% is where the night gets quiet. “Well,” he says, putting the guitar down, “now you know why I pour.” You stay till three anyway.', effects: { cred: 4, burnout: -3 } },
          good: { text: 'He plays it through once, rusty and true, and for three minutes the empty bar is the biggest room either of you has ever been in. Nobody applauds. It would’ve broken it.', effects: { cred: 6, creativity: 4, burnout: -6 } },
          incredible: { text: 'Halfway through, you pick up the harmony without being asked. He doesn’t stop. When it ends he flips two chairs down off a table. “Encore’s for sitting,” he says. You play till the light comes up.', effects: { cred: 8, creativity: 6, burnout: -8, network: 2 } },
        },
      },
    },
  },
  // ═══════════════ BURNOUT COPING (forced interstitials) ═══════════════
  {
    id: 'coping_50', act: [1, 2, 3], pathAffinity: [], weight: 0, chainOnly: true,
    art: 'ev_coping_wall', context: 'Your body, filing a complaint',
    prompt: 'You snap at a soundcheck. Over a cable. A cable that was, on reflection, fine. Something needs to give, and it’s trying to be you.',
    tags: ['rest'],
    choices: {
      left: {
        label: 'Take one real day off',
        governingStats: { cred: 0.6, network: 0.6 },
        tags: ['rest', 'safe'],
        outcomes: {
          bad: { text: 'You take the day off but spend it composing apology texts in your head. Rest: technically achieved.', effects: { burnout: -10 } },
          good: { text: 'Phone in a drawer. A long walk. Food that required cooking. You return human-adjacent.', effects: { burnout: -18, creativity: 2 } },
          incredible: { text: 'The day off becomes a ritual. Your calendar now has a recurring block labeled “NO.” Revolutionary technology.', effects: { burnout: -24, creativity: 3, cred: 2 } },
        },
      },
      right: {
        label: 'Monetize the breakdown (post about it)',
        governingStats: { network: 1.0 },
        tags: ['social', 'risky'],
        outcomes: {
          bad: { text: 'Your burnout post reads as a humblebrag. “So blessed to be this tired.” The ratio is swift and educational.', effects: { burnout: -3, cred: -3, fame: 2 } },
          good: { text: 'The honest post resonates. Burnout content does numbers — the industry’s darkest little joke.', effects: { burnout: -6, fame: 7, network: 3 } },
          incredible: { text: 'Your exhaustion goes viral. A wellness brand offers a sponsorship. You are now professionally tired.', effects: { burnout: -8, fame: 12, money: 150, cred: -2 } },
        },
      },
    },
  },
  {
    id: 'coping_75', act: [1, 2, 3], pathAffinity: [], weight: 0, chainOnly: true,
    art: 'ev_coping_floor', context: '3:40 a.m., bathroom floor, venue unknown',
    prompt: 'You’re sitting on a bathroom floor listening to your own song through the wall, unable to remember why you started doing this. The tile is cold. The question isn’t.',
    tags: ['rest'],
    choices: {
      left: {
        label: 'Call someone who loves you',
        governingStats: { cred: 0.5, network: 0.5 },
        tags: ['rest', 'safe'],
        outcomes: {
          bad: { text: 'Voicemail. But you leave a message so honest you feel lighter anyway. They call back at 7 a.m. It helps.', effects: { burnout: -14, cred: 2 } },
          good: { text: 'They pick up on the second ring. They don’t ask about the career once. You remember you’re a person who plays music, not a music product.', effects: { burnout: -24, cred: 3, creativity: 3 } },
          incredible: { text: 'They drive out. They bring food. You play them the unfinished song at sunrise and remember exactly why you started.', effects: { burnout: -32, creativity: 5, cred: 3, addFlag: 'grounded' } },
        },
      },
      right: {
        label: 'Buy the cold plunge course ($80)',
        governingStats: { creativity: 0.6 },
        tags: ['risky'],
        cost: 80,
        outcomes: {
          bad: { text: 'The course is 40 videos of a man named Brayden yelling “DISCOMFORT IS A DOOR.” The only door you use is the refund page. It doesn’t work.', effects: { money: -80, burnout: -2, cred: -2 } },
          good: { text: 'It’s pseudoscience wrapped in a hoodie, but the morning routine accidentally contains actual sleep hygiene. Annoyingly, you feel better.', effects: { money: -80, burnout: -15 } },
          incredible: { text: 'You become insufferable about cold water AND genuinely rested. Brayden features your testimonial. Cursed. Effective. Cursed.', effects: { money: -80, burnout: -26, fame: 4 } },
        },
      },
    },
  },
  // ═══════════════ FESTIVAL CIRCUIT (Career Wall event pack) ═══════════════
  {
    id: 'f_mud_fest', act: 2, pathAffinity: [], weight: 9, pack: 'pack_festival',
    art: 'ev_mudfest', context: 'Mudslide Festival (day 2 of rain)',
    prompt: 'The festival is 60% mud by volume. Your set time coincides with the storm’s “main pulse.” The show, allegedly, must go on.',
    tags: ['live', 'tour'],
    choices: {
      left: {
        label: 'Play through the storm',
        governingStats: { skill: 0.6, network: 0.6 },
        tags: ['live', 'risky'],
        outcomes: {
          bad: { text: 'The PA shorts out. You finish acoustic, unheard, soaked, weirdly at peace.', effects: { cred: 3, burnout: 9, fame: 2 } },
          good: { text: 'The diehards stay. Forty mud people, bonded to you for life. Mud people never forget.', effects: { cred: 5, fame: 7, network: 4, burnout: 7 } },
          incredible: { text: 'Lightning frames your finale. The photo wins awards. “The storm set” enters festival folklore.', effects: { cred: 7, fame: 16, network: 5, burnout: 7, pathProgress: 1 } },
        },
      },
      right: {
        label: 'Negotiate a better slot tomorrow',
        governingStats: { network: 1.0 },
        tags: ['deal', 'safe'],
        outcomes: {
          bad: { text: 'Tomorrow’s slot is 11 a.m., opposite the silent disco. You play to the disco’s overflow. They can’t hear you. They wave.', effects: { network: 2, fame: 2 } },
          good: { text: 'Dry stage, decent crowd, zero electrocution. Professional outcomes all around.', effects: { network: 5, fame: 6, cred: 2 } },
          incredible: { text: 'You land the sunset slot after a dropout. Golden hour, golden set, golden year.', effects: { network: 7, fame: 12, cred: 4, pathProgress: 1 } },
        },
      },
    },
  },
  {
    id: 'f_lineup_font', act: 2, pathAffinity: [], weight: 8, pack: 'pack_festival',
    art: 'ev_lineup', context: 'The festival poster drops',
    prompt: 'You’re on the lineup! In the font size reserved for food vendors. Your name is directly below “ARTISANAL PICKLE TENT.”',
    tags: ['fame', 'social'],
    choices: {
      left: {
        label: 'Post it proudly anyway',
        governingStats: { network: 1.0 },
        tags: ['social', 'safe'],
        outcomes: {
          bad: { text: 'A meme account crops the poster to just you and the pickles. It does numbers. The pickles gain followers.', effects: { fame: 3, cred: 1 } },
          good: { text: 'Your gracious post reads as confidence. Confidence in 8-point font is still confidence.', effects: { fame: 6, network: 4, cred: 3 } },
          incredible: { text: 'The pickle tent sponsors you on the spot. Free pickles for life, plus actual money. The best deal in music.', effects: { fame: 8, network: 5, money: 200, cred: 3 } },
        },
      },
      right: {
        label: 'Joke about the font publicly',
        governingStats: { creativity: 1.0 },
        tags: ['social', 'risky', 'indie'],
        outcomes: {
          bad: { text: 'The festival’s social team replies with a bigger joke. You lose a public exchange with a lawn event.', effects: { fame: 2, cred: -2 } },
          good: { text: 'Your font bit goes mildly viral. Next year’s poster bumps you two sizes. Growth, measured in points.', effects: { fame: 8, creativity: 3, network: 3 } },
          incredible: { text: 'You sell a shirt of your name in tiny font. It outsells the festival’s merch. The font was the brand all along.', effects: { fame: 12, money: 250, creativity: 5, cred: 4 } },
        },
      },
    },
  },
  {
    id: 'f_secret_set', act: 3, pathAffinity: [], weight: 9, pack: 'pack_festival',
    art: 'ev_secret_set', context: 'A text from an unknown number',
    prompt: '“Secret set. Tiny tent. Midnight. No promo — the mystery IS the promo. You in?”',
    tags: ['live'],
    choices: {
      left: {
        label: 'Play the secret set',
        governingStats: { creativity: 0.7, cred: 0.7 },
        tags: ['live', 'indie', 'risky'],
        outcomes: {
          bad: { text: 'The secret holds TOO well. Nine attendees, of whom two are lost and one is asleep.', effects: { cred: 3, burnout: 5 } },
          good: { text: 'The tent fills by word of mouth alone. Sweat, mystery, converts.', effects: { cred: 6, fame: 8, network: 4 } },
          incredible: { text: 'The line wraps the campground. The set becomes myth by sunrise. “Were you there” is the new currency.', effects: { cred: 9, fame: 15, network: 6, pathProgress: 1 } },
        },
      },
      right: {
        label: 'Counter: main stage or nothing',
        governingStats: { network: 0.9 },
        tags: ['deal', 'risky'],
        outcomes: {
          bad: { text: '“Nothing it is,” says the unknown number, going dark forever. The tent becomes myth without you.', effects: { cred: -2, burnout: 3 } },
          good: { text: 'They laugh, then offer a real slot next season. Boldness, occasionally, is a strategy.', effects: { network: 5, cred: 3, fame: 4 } },
          incredible: { text: 'The mystery texter was the festival director. “Finally, someone who negotiates.” Main stage. Next year. Contract real.', effects: { network: 8, cred: 5, fame: 10, pathProgress: 1 } },
        },
      },
    },
  },
  {
    id: 'f_headline_clash', act: 3, pathAffinity: [], weight: 8, pack: 'pack_festival',
    art: 'ev_clash', context: 'Scheduling disaster',
    prompt: 'Your festival set now overlaps with a surprise reunion of a band so beloved that attendance at your stage may be a rounding error.',
    tags: ['live', 'fame'],
    choices: {
      left: {
        label: 'Play YOUR set, for whoever comes',
        governingStats: { cred: 0.8, skill: 0.6 },
        tags: ['live', 'indie'],
        outcomes: {
          bad: { text: 'Eleven people. You play like it’s eleven thousand. The eleven notice. It matters later, you tell yourself.', effects: { cred: 5, burnout: 6, fame: 1 } },
          good: { text: 'A small crowd of true believers. The reunion is history; you are news. Slightly smaller news.', effects: { cred: 7, fame: 6, network: 3 } },
          incredible: { text: 'The reunion’s sound cuts out mid-set. Half the field migrates to you. You inherit a legend’s audience mid-song.', effects: { cred: 8, fame: 18, network: 6, pathProgress: 1 } },
        },
      },
      right: {
        label: 'Crash the reunion (guest spot gambit)',
        governingStats: { network: 1.0 },
        tags: ['network', 'risky'],
        outcomes: {
          bad: { text: 'Security is unmoved by your “vision.” You watch the reunion from the pickle tent, eating your feelings. The pickles are excellent.', effects: { network: 1, burnout: 4 } },
          good: { text: 'You reach the band’s manager, who books you as tour support instead. The side door was the door.', effects: { network: 7, fame: 6, cred: 2 } },
          incredible: { text: 'The band’s singer knows your stuff. You’re onstage for the encore in front of a full field. History borrows you for one song.', effects: { network: 9, fame: 20, cred: 5, pathProgress: 1 } },
        },
      },
    },
  },

  // ═══════════ RELEASE DAY (the demos in your notebook want out) ═══════════
  {
    id: 'a1_first_drop', act: 1, pathAffinity: [], weight: 12,
    requires: { demoMin: 1 },
    art: 'ev_first_drop', context: '11:58 p.m. The upload screen.',
    prompt: 'The demo is done. The internet is free. Your finger hovers over POST. Nobody is waiting for this song, which is either the problem or the entire point.',
    tags: ['record', 'social'],
    choices: {
      left: {
        label: 'Midnight drop. No warning.',
        governingStats: { creativity: 0.6, network: 0.6 },
        tags: ['social', 'indie', 'risky'],
        outcomes: {
          bad: { text: 'You post it and immediately find a typo in the title. The song ships anyway, limping slightly, into a world that mostly doesn’t notice. Mostly.', effects: { releaseDemo: 22, fame: 1 } },
          good: { text: 'It lands the way midnight drops land: three group chats, one “who IS this?”, a slow warm spread. No machine behind it. Just the song, walking.', effects: { releaseDemo: 48, fame: 4, cred: 2 } },
          incredible: { text: 'By 2 a.m. a playlist curator with insomnia has found it. By 9 a.m. it isn’t yours anymore — it belongs to everyone’s commute.', effects: { releaseDemo: 72, fame: 8, network: 3 } },
        },
      },
      right: {
        label: 'Not yet. It can be better.',
        minigame: 'mixdown',
        governingStats: { skill: 0.8 },
        tags: ['studio', 'safe'],
        outcomes: {
          bad: { text: 'You open the session to “fix one thing” and unmix it for three hours. You put it back. Version 1 was fine. Version 1 is now version 9.', effects: { polishDemo: 3, burnout: 4, skill: 2 } },
          good: { text: 'You live with it for a week and the week tells you what’s wrong: eight bars, one mud frequency, gone. The song thanks you.', effects: { polishDemo: 8, skill: 3 } },
          incredible: { text: 'You strip it back to the first take and THERE it is — the thing the demo was hiding. Restraint, it turns out, is a producer.', effects: { polishDemo: 14, skill: 3, creativity: 3 } },
        },
      },
    },
  },
  {
    id: 'a2_ar_listen', act: 2, pathAffinity: [], weight: 12,
    requires: { demoMin: 1 },
    art: 'ev_ar_listen', context: 'A label office with a famous couch',
    prompt: 'An A&R agreed to hear “the one.” She listens with her eyes closed, which is either reverence or a nap. Her assistant mouths: “this is huge.” The assistant mouths that to everyone.',
    tags: ['deal', 'record'],
    choices: {
      left: {
        label: 'Give them the song',
        governingStats: { network: 0.9 },
        tags: ['deal', 'mainstream'],
        outcomes: {
          bad: { text: 'They pass — “love the energy, don’t hear a single.” On the elevator down you realize the single is the B-side they didn’t play. The song comes home with you, slightly bruised, and ships anyway.', effects: { releaseDemo: 30, network: 2, burnout: 3 } },
          good: { text: 'A one-song deal with real distribution. Their machine puts your song places you couldn’t reach with a ladder.', effects: { releaseDemo: 62, money: 200, network: 3 } },
          incredible: { text: 'She opens her eyes before the chorus hits and says “stop the meeting.” The rollout gets a BUDGET. Billboards. Your song, wearing a suit.', effects: { releaseDemo: 85, money: 380, network: 5, pathProgress: 1 } },
        },
      },
      right: {
        label: 'Walk. Release it yourself.',
        governingStats: { cred: 0.8, creativity: 0.4 },
        tags: ['indie', 'risky'],
        outcomes: {
          bad: { text: 'Your self-release strategy is a post that says “new song :)”. The song deserves a publicist. The song gets a shrug and a slow burn.', effects: { releaseDemo: 28, cred: 3 } },
          good: { text: 'You ship it on your own terms — masters yours, splits clean, art by a friend. The scene notices WHO didn’t sign. That’s marketing too.', effects: { releaseDemo: 52, cred: 5, fame: 2 } },
          incredible: { text: 'The self-release does numbers the label quoted you for. The A&R’s assistant DMs: “between us — she still plays it.” You own every note.', effects: { releaseDemo: 70, cred: 7, money: 160, fame: 4 } },
        },
      },
    },
  },
  {
    id: 'a3_last_single', act: 3, pathAffinity: [], weight: 13,
    requires: { demoMin: 1 },
    art: 'ev_last_single', context: 'The vault. One song left in it.',
    prompt: 'There’s one more song in the notebook and one act left in the career. Every artist gets a finite number of releases. You can hear this one ticking.',
    tags: ['record'],
    choices: {
      left: {
        label: 'Ship it now. Full send.',
        governingStats: { network: 0.6, creativity: 0.6 },
        tags: ['record', 'mainstream', 'risky'],
        outcomes: {
          bad: { text: 'The rollout hits a news cycle that eats everything. The song ships into the noise, elbows out a little space, survives on merit alone.', effects: { releaseDemo: 40, fame: 3, burnout: 3 } },
          good: { text: 'Full send: premiere, visualizer, the good mastering. The song arrives like it has somewhere to be.', effects: { releaseDemo: 66, fame: 6 } },
          incredible: { text: 'Everything you’ve built this whole run shows up for one song — every contact, every favor, every room you played. THIS is what a career is FOR.', effects: { releaseDemo: 90, fame: 10, pathProgress: 1 } },
        },
      },
      right: {
        label: 'Hold it. Legacies need a vault.',
        governingStats: { cred: 0.9 },
        tags: ['indie', 'safe'],
        outcomes: {
          bad: { text: 'You hold it so long it starts holding YOU. The unreleased song becomes a superstition. You knock on the vault twice before bed.', effects: { polishDemo: 4, creativity: 2, burnout: 3 } },
          good: { text: 'You master it, sleeve it, and file it with instructions. Some songs are for the estate. The mystique compounds daily.', effects: { polishDemo: 10, cred: 5 } },
          incredible: { text: 'Word leaks that a finished, unreleased masterpiece exists. The MYTH of the song does more for you than most releases do. The vault glows.', effects: { polishDemo: 16, cred: 7, fame: 4 } },
        },
      },
    },
  },

  // ═══════════ THE PROMO CYCLE (a charting song must be fed) ═══════════
  {
    id: 'a2_morning_zoo', act: 2, pathAffinity: [], weight: 11,
    requires: { chartingMin: 1 },
    art: 'ev_morning_zoo', context: 'Drive-time radio, 6:40 a.m.',
    prompt: 'The Morning Zoo wants you at 6 a.m. to talk about “{song}” between a traffic sponsor and a man who eats things for money. Radio still moves numbers. Nobody knows why. It just does.',
    tags: ['social', 'work'],
    choices: {
      left: {
        label: 'Do the Zoo. Sell the song.',
        minigame: 'interview',
        governingStats: { network: 0.7, cred: 0.3 },
        tags: ['mainstream', 'work'],
        outcomes: {
          bad: { text: 'You say the album title wrong. YOUR album title. The hosts replay it with a slide whistle. The clip travels further than the interview — which, horribly, still helps.', effects: { hypeSong: 14, fame: 3, burnout: 5, cred: -2 } },
          good: { text: 'You survive the sound-effect gauntlet, plug the song twice, and laugh at the airhorn like it’s new. The phones, as they say in radio, LIGHT UP.', effects: { hypeSong: 26, fame: 5, burnout: 3 } },
          incredible: { text: 'You get the man who eats things to eat a CD of the single, live. Morning radio LEGEND. The clip does a week of promo on its own.', effects: { hypeSong: 40, fame: 9, network: 3, burnout: 3 } },
        },
      },
      right: {
        label: '6 a.m. is not a musician’s hour. Decline.',
        governingStats: { cred: 0.8 },
        tags: ['indie', 'rest'],
        outcomes: {
          bad: { text: 'The Zoo roasts your absence on air, affectionately, for eleven minutes. The song wobbles. Your sleep was excellent.', effects: { hypeSong: -6, cred: 3, burnout: -4 } },
          good: { text: 'You sleep. The song holds its own without you shouting over an airhorn. Some numbers are worth less than a morning.', effects: { cred: 4, burnout: -6 } },
          incredible: { text: '“The artist declined” becomes its own little mystique. The Zoo plays the song anyway — twice, out of spite. Spite is airplay.', effects: { hypeSong: 12, cred: 6, burnout: -6 } },
        },
      },
    },
  },
  {
    id: 'a2_dance_challenge', act: [2, 3], pathAffinity: [], weight: 11,
    requires: { chartingMin: 1 },
    art: 'ev_dance_challenge', context: 'Your notifications, exploding',
    prompt: 'A teenager you will never meet invented a dance to the bridge of “{song}.” Four hundred thousand people are doing it. The dance has nothing to do with the song’s meaning. The dance is now the song’s meaning.',
    tags: ['social'],
    choices: {
      left: {
        label: 'Learn the dance. Post yours.',
        governingStats: { network: 0.6, creativity: 0.4 },
        tags: ['mainstream', 'social', 'risky'],
        outcomes: {
          bad: { text: 'Your attempt is stiff in a way the internet finds ELDERLY. The quote-posts are merciless. The song, cruelly, keeps growing anyway.', effects: { hypeSong: 16, fame: 3, cred: -3 } },
          good: { text: 'You do it badly ON PURPOSE, captioned “I wrote this in a shed.” Self-awareness is currency. The teens approve. The number climbs.', effects: { hypeSong: 28, fame: 6 } },
          incredible: { text: 'You post yours WITH the teenager who invented it, in the shed where the song was born. The wholesome arc completes. Morning shows call. The bridge charts on its own somehow.', effects: { hypeSong: 42, fame: 10, network: 4 } },
        },
      },
      right: {
        label: 'Say nothing. Let the internet cook.',
        governingStats: { cred: 0.9 },
        tags: ['indie', 'safe'],
        outcomes: {
          bad: { text: 'A brand does the dance before you acknowledge it. The moment curdles instantly. The song survives; your silence reads as asleep, not aloof.', effects: { hypeSong: 6, cred: 2 } },
          good: { text: 'You never acknowledge it. The mystery becomes part of the lore: “the one artist who didn’t do their own dance.” The song spreads regardless.', effects: { hypeSong: 18, cred: 5 } },
          incredible: { text: 'Your silence becomes a bit: fans do the dance AT you in public and you maintain perfect eye contact. A late-night host tries to break you. The song goes everywhere. You never moved.', effects: { hypeSong: 30, cred: 8, fame: 5 } },
        },
      },
    },
  },
  {
    id: 'a3_playlist_guy', act: 3, pathAffinity: [], weight: 11,
    requires: { chartingMin: 1 },
    art: 'ev_playlist_guy', context: 'A hotel bar. A man with two phones.',
    prompt: '“I don’t do payola,” says the man with two phones, doing payola. “I do PLACEMENT.” For a fee, “{song}” lands on playlists with names like Main Character Energy and Gym Rage. He shows you a chart. The chart only goes up.',
    tags: ['deal'],
    choices: {
      left: {
        label: 'Pay the man', cost: 150,
        governingStats: { network: 0.8 },
        tags: ['deal', 'mainstream', 'risky'],
        outcomes: {
          bad: { text: 'The playlists turn out to be bot farms with mood lighting. The streams evaporate on audit. The man’s two phones are both off. Both of them.', effects: { hypeSong: 4, money: -60, cred: -3 } },
          good: { text: 'Gross, but functional: the song lands on nine mid-size playlists and metabolizes into real listeners. You shower twice. The number is the number.', effects: { hypeSong: 30, fame: 5 } },
          incredible: { text: 'One of the placements hits an algorithm artery and the machine takes over — playlist to playlist to radio. Even the man with two phones is impressed, and he has seen the inside of the machine.', effects: { hypeSong: 45, fame: 9, network: 3 } },
        },
      },
      right: {
        label: 'The song finds its own rooms',
        governingStats: { cred: 0.7, creativity: 0.4 },
        tags: ['indie', 'safe'],
        outcomes: {
          bad: { text: 'Organic reach, it turns out, is a hill. The song climbs it slowly, respectably, in sensible shoes. The man with two phones waves from a passing car.', effects: { hypeSong: 8, cred: 3 } },
          good: { text: 'A real DJ with one phone and taste picks it up because they LIKE it. Slower burn, cleaner flame — the listeners it finds actually stay.', effects: { hypeSong: 20, cred: 5, fame: 3 } },
          incredible: { text: 'The song walks into rooms money can’t book: a film scene, a stadium PA between innings, someone’s wedding. Placement bought that reach for others. Yours was EARNED, and everyone can tell.', effects: { hypeSong: 34, cred: 8, fame: 6 } },
        },
      },
    },
  },

  // ═══════════ THE CHART WAR (you, the rival, ten slots) ═══════════
  {
    id: 'a3_chart_war', act: 3, pathAffinity: [], weight: 13,
    requires: { chartingMin: 1, rivalryMin: 4 },
    art: 'ev_chart_war', context: 'Two songs. Ten slots. One Tuesday.',
    prompt: 'This week’s Hot 10 has “{song}” and {rival}’s single trading places nightly. Their fans have made it a holy war. Your fans have made it worse. A chart blogger is calling it “the pettiest thing to happen to music since music.”',
    tags: ['rival', 'social'],
    choices: {
      left: {
        label: 'Go to war. Feed the feud.',
        minigame: 'duel',
        governingStats: { network: 0.5, creativity: 0.5 },
        tags: ['rival', 'risky', 'social'],
        outcomes: {
          bad: { text: 'You post something at 1 a.m. that scans as desperate by 8. {rival}’s fans clip it, score it, choreograph it. The feud feeds THEIR song this week.', effects: { hypeSong: -8, rivalry: 2, fame: 2, burnout: 4 } },
          good: { text: 'You keep it exactly one degree above the belt — vicious, quotable, deniable. Both songs surge. Yours surges HARDER. The blogger declares you “the winner, morally, whatever that means here.”', effects: { hypeSong: 26, rivalry: 1, fame: 5 } },
          incredible: { text: 'You drop a live one-take cover OF THEIR SONG, played better than they play it, captioned only “good tune.” It is the most devastating act of kindness the chart has ever seen.', effects: { hypeSong: 42, rivalry: 2, fame: 8, cred: 4 } },
        },
      },
      right: {
        label: 'Call them. Kill the war.',
        governingStats: { network: 0.8 },
        tags: ['rival', 'network', 'safe'],
        outcomes: {
          bad: { text: 'They let it ring out and post a screenshot of your name on their lock screen, no caption. The war continues without your consent. Wars do that.', effects: { rivalry: 2, cred: 2, hypeSong: 4 } },
          good: { text: 'Forty minutes on the phone. You agree the war is stupid and agree to keep it going for TWO more weeks, professionally, because it is moving BOTH your numbers. Show business.', effects: { hypeSong: 22, rivalry: -1, network: 4 } },
          incredible: { text: 'The call ends with a joint statement, a shared playlist, and a photo of two coffees. The shippers take it from there. Both songs go UP — peace, it turns out, is also content.', effects: { hypeSong: 34, rivalry: -3, network: 6, fame: 5 } },
        },
      },
    },
  },

  // ═══════════ WRITING HAPPENS EVERYWHERE (generic song supply) ═══════════
  {
    id: 'a1_shower_hook', act: 1, pathAffinity: [], weight: 10,
    art: 'ev_shower_hook', context: 'Shampoo in your eyes, a melody in your head',
    prompt: 'It arrives in the shower, fully formed, the way the good ones do — a hook so obvious you assume someone already wrote it. Nobody wrote it. It’s yours, if you can get to a recorder before the towel.',
    tags: ['home', 'write'],
    choices: {
      left: {
        label: 'Run. Dripping. Record it.',
        minigame: 'ideas',
        governingStats: { creativity: 0.9 },
        tags: ['write', 'risky'],
        outcomes: {
          bad: { text: 'By the time the phone unlocks, the hook has become a different, worse hook. You record that one out of spite. Even the spite take has SOMETHING.', effects: { creativity: 3, writeSong: true } },
          good: { text: 'You catch it — soaking, shivering, triumphant. The voice memo has drips in it. The drips are, honestly, part of it now.', effects: { creativity: 6, writeSong: true } },
          incredible: { text: 'You catch the hook AND the second verse follows it out like it was waiting in the pipes. Best shower of your career. You will chase this high through every bathroom you ever rent.', effects: { creativity: 8, skill: 2, writeSong: true } },
        },
      },
      right: {
        label: 'If it’s real, it’ll survive the conditioner',
        governingStats: { cred: 0.5, skill: 0.5 },
        tags: ['rest', 'safe'],
        outcomes: {
          bad: { text: 'It did not survive the conditioner. You spend the evening humming adjacent melodies like a search party that lost the dog.', effects: { creativity: 2, burnout: -2 } },
          good: { text: 'Most of it survives. The part that didn’t gets replaced by something more honest at the kitchen table. Fair trade.', effects: { creativity: 5, burnout: -3, writeSong: true } },
          incredible: { text: 'It survives WHOLE — and arrives with a bridge you didn’t write in the shower. The subconscious bills nothing. The subconscious is the best collaborator you have.', effects: { creativity: 7, burnout: -3, writeSong: true } },
        },
      },
    },
  },
  {
    id: 'a2_soundcheck_song', act: 2, pathAffinity: [], weight: 12,
    art: 'ev_soundcheck', context: 'Soundcheck. “Play anything,” says the desk.',
    prompt: '“Play anything,” says the sound engineer, and your hands — bored, unsupervised — play something that has never existed before. The engineer looks up. “What’s that one called?” It isn’t. Yet.',
    tags: ['live', 'write'],
    choices: {
      left: {
        label: 'Chase it right now, mid-soundcheck',
        minigame: 'ideas',
        governingStats: { creativity: 0.8, skill: 0.4 },
        tags: ['write', 'risky'],
        outcomes: {
          bad: { text: 'You chase it for forty minutes while the opener waits, arms folded. What you catch is half a song and a reputation for being “a lot” at soundcheck. Both are keepers.', effects: { creativity: 4, network: -2, writeSong: true } },
          good: { text: 'The engineer rolls tape without being asked — desk mix, room sound, born live. Some songs choose their own studio.', effects: { creativity: 6, skill: 2, writeSong: true } },
          incredible: { text: 'The venue staff stop stacking chairs to listen, which has never happened in the history of venue staff. The engineer hands you the tape: “That’s the single.” The engineer is never wrong.', effects: { creativity: 8, cred: 3, skill: 2, writeSong: true } },
        },
      },
      right: {
        label: 'Note the chords. Tonight is for the SET.',
        governingStats: { skill: 0.8 },
        tags: ['live', 'safe'],
        outcomes: {
          bad: { text: 'You write “Em - C - ??? - the weird one” on a napkin. Post-show, the napkin has absorbed a beverage. The weird one is gone. The legend of the weird one begins.', effects: { skill: 3, burnout: 2 } },
          good: { text: 'Professional restraint: chords noted, set played, and the idea is still warm when you get to it after load-out. Discipline is a studio too.', effects: { skill: 5, writeSong: true } },
          incredible: { text: 'The set is tight AND the idea survives — improved, somehow, by waiting through ninety minutes of you being good at your job. Confidence is a co-writer.', effects: { skill: 7, cred: 2, writeSong: true } },
        },
      },
    },
  },
  {
    id: 'a3_hotel_ballad', act: 3, pathAffinity: [], weight: 10,
    art: 'ev_hotel_ballad', context: 'A hotel piano, 4 a.m., a lobby with no witnesses',
    prompt: 'The tour hotel has a piano in the lobby and a night clerk who doesn’t care. At 4 a.m., careers this deep in, the only songs left to write are the true ones. Your hands find the first chord uninvited.',
    tags: ['write', 'home'],
    choices: {
      left: {
        label: 'Write the true one',
        governingStats: { creativity: 1.0 },
        tags: ['write', 'risky'],
        outcomes: {
          bad: { text: 'It comes out TOO true — unperformable, unreleasable, the kind of song you write to find out what you think. You fold it into your pocket. Some songs are letters.', effects: { creativity: 5, burnout: -3, writeSong: true } },
          good: { text: 'The night clerk stops filing. “That about somebody?” Yes. “Thought so.” The clerk is the first audience and the best review you will ever get.', effects: { creativity: 7, cred: 3, burnout: -3, writeSong: true } },
          incredible: { text: 'At the last chord, the elevator opens and a stranger in a robe applauds alone. The truest song of your life has an audience of two and a witness protection program. Perfect.', effects: { creativity: 9, cred: 4, burnout: -4, writeSong: true } },
        },
      },
      right: {
        label: 'Go to bed. You have a career to run.',
        governingStats: { skill: 0.5, network: 0.5 },
        tags: ['rest', 'safe'],
        outcomes: {
          bad: { text: 'You lie awake hearing the chord anyway. At 5:30 you give up and sleep through the alarm. The career runs fine without you for one morning. Rude.', effects: { burnout: -4 } },
          good: { text: 'Sleep. Actual sleep. The chord waits politely in your head and is still there at soundcheck, matured overnight like it knew.', effects: { burnout: -7, creativity: 3, writeSong: true } },
          incredible: { text: 'Best sleep of the tour, and the chord kept working the night shift: it wakes you at 9 with the whole chorus attached. Delegation. That’s what the piano was for.', effects: { burnout: -8, creativity: 5, writeSong: true } },
        },
      },
    },
  },

  // ═══════════ THE ALBUM (act-3 side quest: your catalog becomes an LP) ═══════════
  {
    id: 'a3_album_offer', act: 3, pathAffinity: [], weight: 14,
    requires: { songsMin: 3 },
    art: 'ev_album_offer', context: 'A whiteboard with your songs on it',
    prompt: 'Someone writes every song you’ve made this career on a whiteboard, steps back, and says the dangerous sentence: “You know this is an album, right?” The songs look back at you. They knew.',
    tags: ['record'],
    choices: {
      left: {
        label: 'Cut it live in one weekend',
        minigame: 'take',
        governingStats: { skill: 0.7, creativity: 0.4 },
        tags: ['record', 'indie', 'risky'],
        outcomes: {
          bad: { text: 'The weekend produces chaos: blown takes, one fistfight about a tambourine, and — undeniably, underneath — a RECORD. Rough. Alive. Yours.', effects: { skill: 3, burnout: 6, chainEventId: 'a3c_album_drop' } },
          good: { text: 'Two days, no punch-ins, the room sound doing half the production. Between takes nobody speaks. Everyone knows what this is.', effects: { skill: 5, cred: 4, burnout: 4, chainEventId: 'a3c_album_drop' } },
          incredible: { text: 'The last take of the last song ends and the engineer just lets the tape run — thirty seconds of the room refusing to exhale. Track twelve is that silence. Critics will write about the silence.', effects: { skill: 7, cred: 6, creativity: 4, burnout: 4, pathProgress: 1, chainEventId: 'a3c_album_drop' } },
        },
      },
      right: {
        label: 'Produce it properly. Every song deserves its best self.',
        cost: 140,
        minigame: 'mixdown',
        governingStats: { skill: 0.5, network: 0.5 },
        tags: ['record', 'studio', 'safe'],
        outcomes: {
          bad: { text: 'The budget buys polish and the polish buys arguments. Version 9 of track three sounds expensive and lost. You ship version 2 and tell no one.', effects: { skill: 3, money: -40, burnout: 5, chainEventId: 'a3c_album_drop' } },
          good: { text: 'Real strings on the ballad. The engineer who eats standing up. Every song arrives at the mix wearing its best jacket.', effects: { skill: 5, network: 3, polishDemo: 10, chainEventId: 'a3c_album_drop' } },
          incredible: { text: 'The sessions attract visitors — players who “happened to be in the building” and leave their parts on your record like tips. The credits read like a scene.', effects: { skill: 6, network: 6, cred: 3, polishDemo: 16, pathProgress: 1, chainEventId: 'a3c_album_drop' } },
        },
      },
    },
  },
  {
    id: 'a3c_album_drop', act: 3, pathAffinity: [], weight: 0, chainOnly: true,
    art: 'ev_album_drop', context: 'Release day. The whole notebook, at once.',
    prompt: 'The album is mastered, sleeved, and staring at you. One decision left — the one every sequencing argument was secretly about: what is this record FOR?',
    tags: ['record'],
    choices: {
      left: {
        label: 'Lead with the hit. Feed the machine.',
        governingStats: { network: 0.8 },
        tags: ['mainstream', 'record'],
        outcomes: {
          bad: { text: 'The single leads, the algorithm shrugs — wrong Tuesday. The album takes the stairs instead of the elevator. It gets there. Stairs build character.', effects: { albumDrop: 40, fame: 4, addFlag: 'album_out' } },
          good: { text: 'The rollout lands: single first, album Friday, everything everywhere at once. Your whole catalog surfaces like a pod of whales.', effects: { albumDrop: 62, fame: 8, money: 150, addFlag: 'album_out' } },
          incredible: { text: 'The single drags the album up the chart and the album returns the favor — every track feeding every other track. The machine, for one week, works for YOU.', effects: { albumDrop: 82, fame: 12, money: 250, pathProgress: 1, addFlag: 'album_out' } },
        },
      },
      right: {
        label: 'Sequence for the heads. No singles. A JOURNEY.',
        governingStats: { cred: 0.9 },
        tags: ['indie', 'record'],
        outcomes: {
          bad: { text: 'The no-singles stance meets the skip button and loses, mostly. But the ones who listen straight through KEEP listening straight through. Forty minutes at a time, forever.', effects: { albumDrop: 34, cred: 5, addFlag: 'album_out' } },
          good: { text: 'It gets reviewed as a WHOLE — “an album that remembers what albums are for.” People post photos of speakers. Speakers!', effects: { albumDrop: 52, cred: 8, fame: 4, addFlag: 'album_out' } },
          incredible: { text: 'A generation of bedroom listeners adopts it as furniture — the record that plays while life happens. Nobody can name the third track. Nobody skips it either.', effects: { albumDrop: 70, cred: 11, fame: 7, pathProgress: 1, addFlag: 'album_out' } },
        },
      },
    },
  },

  // ═══════════ NADIA (the topline machine — recruit + spotlight) ═══════════
  {
    id: 'a2_nadia_meet', act: 2, pathAffinity: [], weight: 9,
    requires: { bandMax: 2 },
    art: 'ev_nadia', context: 'A writing room, after everyone else left',
    prompt: 'The session ended an hour ago but the topliner is still there, humming into a notebook. “Spares,” she says, not looking up. You hear four seconds of one. It is nobody’s spare. Her name is Nadia.',
    tags: ['write', 'network'],
    choices: {
      left: {
        label: 'Ask her to join the band',
        governingStats: { network: 0.7, cred: 0.4 },
        tags: ['band', 'network'],
        outcomes: {
          bad: { text: 'She says yes so fast you suspect the notebook told her to. First rehearsal: she rewrites your bridge without asking. It’s better. This will take adjusting.', effects: { grantBandmate: 'nadia', creativity: 2, burnout: 3 } },
          good: { text: '“I keep the notebook. You keep the name on the door.” Deal. She joins, and the hooks start arriving like weather.', effects: { grantBandmate: 'nadia', creativity: 4, network: 2 } },
          incredible: { text: 'She auditions YOU — hums half a hook and waits. You finish it without thinking. She closes the notebook: “okay then.” The best hire is the one who was testing you.', effects: { grantBandmate: 'nadia', creativity: 6, cred: 3, network: 2 } },
        },
      },
      right: {
        label: 'Just buy a spare off her',
        cost: 100,
        governingStats: { network: 0.8 },
        tags: ['deal', 'write'],
        outcomes: {
          bad: { text: 'She sells you the WEAKEST spare, on principle, and you both know it. It’s still better than your Tuesday output. This stings in several directions.', effects: { writeSong: true, creativity: 2 } },
          good: { text: 'One clean transaction: a hook for cash, a handshake, a receipt she writes on notebook paper. The hook works immediately. The receipt you keep for reasons unclear.', effects: { writeSong: true, creativity: 4 } },
          incredible: { text: 'She watches you react to the hook and sells you a DIFFERENT one instead — “that one wasn’t yours.” She was right. The one she picks fits like it was written in your handwriting.', effects: { writeSong: true, creativity: 6, network: 3 } },
        },
      },
    },
  },
  {
    id: 'a3_nadia_spotlight', act: 3, pathAffinity: [], weight: 14,
    requires: { bandHas: 'nadia' },
    art: 'ev_nadia_spot', context: 'Nadia’s notebook, open to the last page',
    prompt: 'Nadia slides the notebook across the table, open to the last page: the one hook she’s never let anyone hear. “It needs a career like yours. Or,” she pauses, “I need to finally cut it myself. You pick. That’s the deal we never made.”',
    tags: ['band', 'write'],
    choices: {
      left: {
        label: 'Take the last-page hook',
        governingStats: { creativity: 0.6, network: 0.6 },
        tags: ['write', 'mainstream'],
        outcomes: {
          bad: { text: 'You cut it, and it’s great, and every time you play it you can feel her hearing her own song from the wrong side of the stage. The credit reads both names. The silence reads more.', effects: { writeSong: true, creativity: 4, burnout: 4, addFlag: 'nadia_hook' } },
          good: { text: 'You cut it TOGETHER — her topline, your everything else. The song is the sound of the deal being fair. She hums the harmony at the merch table for a week.', effects: { writeSong: true, creativity: 6, network: 3, addFlag: 'nadia_hook' } },
          incredible: { text: 'The last page becomes the best thing either of you has touched — so obviously right that neither of you mentions it again. Some collaborations don’t need a debrief. The notebook starts a new page that night.', effects: { writeSong: true, creativity: 9, cred: 4, network: 3, addFlag: 'nadia_hook' } },
        },
      },
      right: {
        label: '“Cut it yourself. I’ll play on it.”',
        governingStats: { cred: 0.9 },
        tags: ['band', 'indie', 'safe'],
        outcomes: {
          bad: { text: 'Her session runs long, collides with your show, and for one night the band is a scheduling spreadsheet with feelings. Worth it. Probably. Ask again when her song is out.', effects: { cred: 4, burnout: 4, addFlag: 'nadia_solo' } },
          good: { text: 'You play the second verse on her record and nobody knows it’s you, which is exactly how she wanted it and exactly how you played it. The scene notices whose band lets people GROW.', effects: { cred: 6, network: 4, addFlag: 'nadia_solo' } },
          incredible: { text: 'Her single comes out and the first comment is “the band behind this must be led by someone secure.” You screenshot it. She frames it. It hangs in the rehearsal space next to the receipt.', effects: { cred: 9, network: 5, fame: 4, addFlag: 'nadia_solo' } },
        },
      },
    },
  },

  // ═══════════ THE FIRST FAN (3-beat arc: someone knew the words first) ═══════════
  {
    id: 'a1_first_fan', act: 1, pathAffinity: [], weight: 10,
    art: 'ev_first_fan', context: 'After the set. Row zero.',
    prompt: 'Someone in the front row sang along tonight. Not hummed — SANG, every word, including the verse you almost cut. You have, apparently, one (1) fan. They are waiting by the door with a sharpie and tremendous courage.',
    tags: ['live', 'network'],
    choices: {
      left: {
        label: 'Talk. Ask how they found you.',
        governingStats: { network: 0.7, cred: 0.3 },
        tags: ['network', 'safe'],
        outcomes: {
          bad: { text: 'The conversation is 90% you apologizing for the sound mix. They don’t care about the mix. “The words,” they say, tapping their chest, leaving. You think about that tap all week.', effects: { network: 3, addFlag: 'superfan' } },
          good: { text: 'They found you through a friend of a friend’s playlist, three layers deep, like a secret. You sign the sharpie itself as a bit. They laugh like it’s the best thing that ever happened. Keep them.', effects: { network: 5, creativity: 2, addFlag: 'superfan' } },
          incredible: { text: 'They quote your own lyric back to you to explain their year, and for one vertiginous second you understand what the job actually is. You will chase this feeling through every arena you never fill.', effects: { network: 5, creativity: 4, cred: 2, addFlag: 'superfan' } },
        },
      },
      right: {
        label: 'Nod from the stage. Stay a poster.',
        governingStats: { cred: 0.8 },
        tags: ['indie', 'safe'],
        outcomes: {
          bad: { text: 'The nod comes out as a wince. They wave the sharpie anyway, undeterred. Some fans choose you harder than you choose yourself.', effects: { cred: 2, addFlag: 'superfan' } },
          good: { text: 'One nod, held one second. In the mythology this fan is already writing, that nod is chapter one. Mystery is a gift you give them.', effects: { cred: 4, addFlag: 'superfan' } },
          incredible: { text: 'You close with the song they came for and look at row zero on the last line. That’s it. That’s the whole transaction. It is somehow enormous.', effects: { cred: 5, fame: 2, addFlag: 'superfan' } },
        },
      },
    },
  },
  {
    id: 'a2_fan_account', act: 2, pathAffinity: [], weight: 12,
    requires: { flagsAll: ['superfan'] },
    art: 'ev_fan_account', context: 'A fan account you did not authorize',
    prompt: 'There is now a fan account. It posts your set times before venues do, corrects journalists’ facts with citations, and has a banner image of you mid-blink. It is run — of course — by row zero. It has more followers than you.',
    tags: ['social'],
    choices: {
      left: {
        label: 'Follow it back. Bless the archive.',
        governingStats: { network: 0.6, creativity: 0.4 },
        tags: ['social', 'mainstream'],
        outcomes: {
          bad: { text: 'You follow back and the account posts ONLY a screenshot of the notification with seventeen exclamation points. The mid-blink banner stays. You have blessed the blink. The blink is canon now.', effects: { fame: 3, network: 2, hypeSong: 8 } },
          good: { text: 'The account becomes your unofficial press office, faster and more accurate than the real one. Journalists start citing IT. Your song stats climb wherever it aims.', effects: { fame: 6, network: 4, hypeSong: 16 } },
          incredible: { text: 'You send the account ONE unreleased voice memo, no caption. The resulting archaeological thread is better music writing than any review you’ve gotten. The scene reads it. The numbers move.', effects: { fame: 8, network: 5, cred: 3, hypeSong: 26 } },
        },
      },
      right: {
        label: 'Never acknowledge it. Sacred distance.',
        governingStats: { cred: 0.9 },
        tags: ['indie'],
        outcomes: {
          bad: { text: 'Your silence gets its own conspiracy thread. The account handles it with more grace than your actual label would. The archive grows either way.', effects: { cred: 3, hypeSong: 4 } },
          good: { text: 'The distance keeps the account HUNGRY — it documents you like a wildlife photographer, and the mythology compounds. Unbothered. Documented. Perfect.', effects: { cred: 6, fame: 2, hypeSong: 10 } },
          incredible: { text: 'Years of silence, then the account posts “they know we exist. that’s enough.” and the post does numbers that embarrass the industry. Restraint, archived, is legend.', effects: { cred: 8, fame: 4, hypeSong: 14 } },
        },
      },
    },
  },
  {
    id: 'a3_fan_tattoo', act: 3, pathAffinity: [], weight: 14,
    requires: { flagsAll: ['superfan'] },
    art: 'ev_fan_tattoo', context: 'Load-in. A rolled-up sleeve.',
    prompt: 'Row zero is at load-in with a rolled-up sleeve: a line from “{song}” tattooed in typewriter font, slightly crooked, absolutely permanent. “The artist did it for free,” they say. “Fan of yours too.” Your words live on a stranger’s arm now. They were never only yours.',
    tags: ['network', 'home'],
    choices: {
      left: {
        label: 'Sign under it. Make it a set.',
        governingStats: { network: 0.6, creativity: 0.4 },
        tags: ['network', 'risky'],
        outcomes: {
          bad: { text: 'Your handwriting betrays you under pressure and the signature comes out like a ransom note. They get THAT tattooed too, verbatim. You are now permanently, legally illegible on a human being.', effects: { fame: 4, network: 3, addFlag: 'fan_family' } },
          good: { text: 'You sign small, under the line, like a footnote — which is what you are to this tattoo, and you know it. The tattoo artist inks it that week. The photo does gentle, permanent numbers.', effects: { fame: 6, network: 4, cred: 2, addFlag: 'fan_family' } },
          incredible: { text: 'You write the NEXT line of the song — the unreleased one — under the tattooed one. Now their arm contains something no stream can serve. The account posts one photo, cropped tight, captioned “patience.” The internet loses its mind.', effects: { fame: 9, network: 5, cred: 4, addFlag: 'fan_family' } },
        },
      },
      right: {
        label: 'Put them on the permanent guest list',
        governingStats: { cred: 0.7, network: 0.4 },
        tags: ['home', 'safe'],
        outcomes: {
          bad: { text: 'The venue’s guest list system rejects “FOREVER” as a date. You argue with a dropdown menu for ten minutes and lose. Row zero buys a ticket anyway, like always. The gesture counted. The dropdown did not.', effects: { cred: 3, network: 2, addFlag: 'fan_family' } },
          good: { text: 'Name, plus one, every show, forever. They cry exactly once, briefly, professionally — then ask if the plus one can be their mom. It can. It is ALWAYS their mom.', effects: { cred: 5, network: 3, addFlag: 'fan_family' } },
          incredible: { text: 'You put it in writing on a setlist: “row zero — permanent.” The venue frames a copy by the door. Other bands’ fans start pointing at it like a landmark. It is one.', effects: { cred: 7, network: 4, fame: 3, addFlag: 'fan_family' } },
        },
      },
    },
  },

  // ═══ CONSTELLATION: THE FAN WARS (First Fan × the chart war) ═══
  {
    id: 'a3_fan_wars', act: 3, pathAffinity: [], weight: 16,
    requires: { flagsAll: ['superfan', 'chart_passed_rival'] },
    art: 'ev_fan_wars', context: 'Two fan armies. One chart. Row zero in the middle.',
    prompt: 'Since your song passed {rival}’s on the Hot 10, their stan army has declared war — and your entire defense force is one fan account run by row zero, posting citations against a battalion of memes. They are LOSING. They are not backing down. This is somehow the most loyal thing anyone has ever done for you.',
    tags: ['rival', 'social'],
    choices: {
      left: {
        label: 'Enter the war for one single post',
        governingStats: { creativity: 0.6, network: 0.6 },
        tags: ['social', 'risky'],
        outcomes: {
          bad: { text: 'Your one post is screenshotted, misread, reposted by {rival} with a single eyebrow emoji, and becomes the war’s new front. Row zero DMs you: “I’ll handle it. Log off.” You log off. They handle it. The chart wobbles but holds.', effects: { fame: 3, rivalry: 2, hypeSong: 8, addFlag: 'constellation' } },
          good: { text: 'You post one photo: you and {rival}, years ago, small, sharing a bill nobody came to — captioned “we were fans first.” Both armies stand down in confusion. Both songs climb. Row zero pins it forever.', effects: { fame: 6, rivalry: -1, hypeSong: 20, cred: 3, addFlag: 'constellation' } },
          incredible: { text: 'You comment ONCE, on row zero’s most-ratioed post: “this account was right about me before anyone.” The war ends instantly — there is no meme against loyalty. {rival}’s stans defect by the hundreds. The archive gains a wing.', effects: { fame: 9, hypeSong: 30, network: 4, cred: 4, addFlag: 'constellation' } },
        },
      },
      right: {
        label: 'Send row zero backstage passes and stay out of it',
        governingStats: { cred: 0.8 },
        tags: ['home', 'safe'],
        outcomes: {
          bad: { text: 'Row zero, mid-war, posts a photo of the passes with “can’t talk. working.” and goes back to citing chart positions at strangers. The war rages on. The loyalty, though — the loyalty is archival now.', effects: { cred: 3, hypeSong: 6, addFlag: 'constellation' } },
          good: { text: 'They take one night off the front lines to stand in the wings, and you play the passed-the-rival song looking at exactly one person. The fan account posts nothing that night. Some victories are private.', effects: { cred: 6, network: 3, hypeSong: 12, addFlag: 'constellation' } },
          incredible: { text: 'From the wings, row zero watches {rival}’s own first fan — there’s always one — typing furiously in the front row. After the show, the two of them get pancakes. The accounts announce a ceasefire co-written at 2 a.m. The war ends the way wars should: over syrup, between the only two people who were ever really in it.', effects: { cred: 8, rivalry: -2, fame: 5, hypeSong: 16, addFlag: 'constellation' } },
        },
      },
    },
  },

  // ═══ CONSTELLATION: THE DEEP CUT (Nadia × the album) ═══
  {
    id: 'a3_nadia_deepcut', act: 3, pathAffinity: [], weight: 16,
    requires: { flagsAll: ['album_out'], bandHas: 'nadia' },
    art: 'ev_nadia_deepcut', context: 'The album, track 7. The internet, detective mode.',
    prompt: 'A listener with perfect ears posts a thread: track 7 of the album isn’t written like your other songs — the melody moves like a NOTEBOOK song. The thread is right. It’s one of Nadia’s act-break demos, and the internet is one reply away from figuring out whose handwriting is all over your record.',
    tags: ['band', 'social'],
    choices: {
      left: {
        label: 'Confirm it. Credit her loudly.',
        governingStats: { cred: 0.7, network: 0.4 },
        tags: ['band', 'safe'],
        outcomes: {
          bad: { text: 'Your credit post reads as damage control because it arrives four minutes after the thread peaks. Nadia reposts it anyway with “took him long enough” and a heart. The scene decides the heart settles it. The heart settles it.', effects: { cred: 4, network: 2, addFlag: 'constellation' } },
          good: { text: 'You post the actual notebook page — her handwriting, your chord scribbles in the margin, coffee ring included. The thread author frames the screenshot. Track 7 streams triple. The band feels like a band.', effects: { cred: 6, network: 3, fame: 4, hypeSong: 14, addFlag: 'constellation' } },
          incredible: { text: 'You bring Nadia out at the next show to play track 7 ALONE — one voice, one notebook, four thousand phones. The clip becomes how strangers find your album forever. In the credits of everything she does after, you are “the one who said it was mine.”', effects: { cred: 9, fame: 6, network: 4, hypeSong: 22, addFlag: 'constellation' } },
        },
      },
      right: {
        label: 'Let the mystery ride. Bands are one organism.',
        governingStats: { creativity: 0.5, cred: 0.5 },
        tags: ['band', 'indie', 'risky'],
        outcomes: {
          bad: { text: 'The thread gets its final reply from Nadia herself: just a photo of the notebook, no caption. The internet detonates politely. She wasn’t hiding — YOU were, and now everyone can tell the difference. Lunch is quiet this week.', effects: { cred: -2, creativity: 2, burnout: 3, addFlag: 'constellation' } },
          good: { text: 'Nadia loves the mystery — “songs don’t have parents, they have witnesses” — and starts leaving fake clues in interviews. The thread hits 400 replies of beautiful wrongness. The album gains a lore layer money can’t buy.', effects: { creativity: 5, cred: 4, hypeSong: 12, addFlag: 'constellation' } },
          incredible: { text: 'The two of you write track 7’s ANSWER SONG in secret and slip it into the next pressing, unannounced, in the same handwriting. The detective thread finds it in six hours and simply posts “oh, it’s like that.” It is exactly like that.', effects: { creativity: 8, cred: 6, fame: 4, hypeSong: 18, addFlag: 'constellation' } },
        },
      },
    },
  },

  // ═══════════ THE SYNC (a faded song gets a second job) ═══════════
  {
    id: 'a2_the_sync', act: [2, 3], pathAffinity: [], weight: 12,
    requires: { fadedMin: 1 },
    art: 'ev_the_sync', context: 'An email with the subject line “OPPORTUNITY (yogurt)”',
    prompt: 'A music supervisor wants “{fadedSong}” — yes, the one that fell off the chart — for a national yogurt campaign. “It tested incredibly with the 25–40 probiotic demographic.” The song you mourned is worth more dead than it ever was alive.',
    tags: ['deal'],
    choices: {
      left: {
        label: 'License it. Songs need jobs.',
        governingStats: { network: 0.8 },
        tags: ['deal', 'mainstream'],
        outcomes: {
          bad: { text: 'The edit they use cuts your favorite line for a spoon sound. The check clears anyway. Every time the ad plays, someone somewhere Shazams your dead song. It twitches.', effects: { money: 220, fame: 3, grantHustle: 'sync_royalties' } },
          good: { text: 'The campaign runs everywhere. Strangers hum your faded single in supermarket dairy aisles, on purpose, nationally. The corpse does numbers.', effects: { money: 320, fame: 6, grantHustle: 'sync_royalties' } },
          incredible: { text: 'The ad becomes bigger than the yogurt — people post “what IS this song” until the full version re-enters conversation, then playlists, then bars. Resurrection by dairy. The supervisor sends a fruit basket labeled “to the catalog.”', effects: { money: 420, fame: 9, cred: 2, grantHustle: 'sync_royalties' } },
        },
      },
      right: {
        label: '“That song meant something.” Decline.',
        governingStats: { cred: 0.9 },
        tags: ['indie', 'safe'],
        outcomes: {
          bad: { text: 'You decline with a speech about artistic integrity that the supervisor reads while eating the exact yogurt. They license your rival’s b-side instead. It follows you through every grocery store for a year.', effects: { cred: 4, rivalry: 1 } },
          good: { text: 'You say no, kindly. The supervisor, unexpectedly, gets it: “most people don’t even ask what the song’s about.” The refusal circulates in publishing circles as a curiosity. Curiosity is cred.', effects: { cred: 6, network: 2 } },
          incredible: { text: 'Your “no” email — three sentences about what the song meant — leaks and becomes the rare viral post about INTEGRITY. The song re-enters the conversation anyway, unsold, entirely yours. The yogurt people frame the email. Marketing is broken. You broke it.', effects: { cred: 9, fame: 5, creativity: 3 } },
        },
      },
    },
  },

  // ═══════════ SAVE THE ROOM (venue side quest: the home room is for sale) ═══════════
  {
    id: 'a3_venue_sale', act: 3, pathAffinity: [], weight: 15,
    requires: { venueLevelMin: 2 },
    art: 'ev_venue_sale', context: 'A laminated notice on the door of {venue}',
    prompt: 'The notice on the door of {venue} is laminated, which means it’s serious: SOLD PENDING — future site of a climbing gym. Thirty days. The sound guy is standing under it with the face of a man reading his own obituary. Your name is on this room in ways no deed records.',
    tags: ['home', 'network'],
    choices: {
      left: {
        label: 'Throw the benefit. Save the room.',
        governingStats: { network: 0.7, cred: 0.4 },
        tags: ['live', 'network', 'risky'],
        outcomes: {
          bad: { text: 'You announce the benefit before asking anyone. The scene says yes anyway — badly, chaotically, in seventeen conflicting group chats. There is a show now. There has to be.', effects: { network: 3, burnout: 4, chainEventId: 'a3c_venue_benefit' } },
          good: { text: 'Every band that ever loaded in through the kitchen says yes in an hour. The poster is just the room’s floor plan with the word NO. It’s perfect.', effects: { network: 5, cred: 3, chainEventId: 'a3c_venue_benefit' } },
          incredible: { text: 'The lineup fills so fast there’s a WAITLIST to play a benefit. The climbing gym’s investors reportedly ask what a “Ricochet” is and why it has better presale than their whole chain.', effects: { network: 7, cred: 4, fame: 3, chainEventId: 'a3c_venue_benefit' } },
        },
      },
      right: {
        label: 'Rooms end. Let it end loved.',
        governingStats: { cred: 0.8 },
        tags: ['home', 'safe'],
        outcomes: {
          bad: { text: 'The last night sells out in minutes and you can’t get everyone in. People listen from the sidewalk with the doors propped. The room ends at capacity, which is how it lived.', effects: { cred: 4, addFlag: 'room_lost', venueLove: 1 } },
          good: { text: 'You play the final set and unscrew the stage’s center floorboard afterward, with permission and a multitool. It hangs above your desk now. The room ends on YOUR amp’s hum.', effects: { cred: 6, creativity: 3, addFlag: 'room_lost' } },
          incredible: { text: 'The last night becomes a wake, a reunion, and a recording — every band plays one song, the sound guy mixes it perfectly through actual tears, and the tape becomes a beloved compilation titled the room’s street address. Nothing this loved is ever really gone.', effects: { cred: 8, creativity: 4, fame: 4, addFlag: 'room_lost' } },
        },
      },
    },
  },
  {
    id: 'a3c_venue_benefit', act: 3, pathAffinity: [], weight: 0, chainOnly: true,
    art: 'ev_venue_benefit', context: 'The benefit. {venue}, at capacity, holding its breath.',
    prompt: 'Benefit night. The room is packed past the fire code it’s trying to save itself from. The landlord is in the back with the buyer, arms crossed, “just watching.” The sound guy gives you the nod. Whatever this room is worth, you have one set to prove it.',
    tags: ['live', 'home'],
    choices: {
      left: {
        label: 'Play the set of your life',
        minigame: 'crowd',
        governingStats: { skill: 0.6, cred: 0.5 },
        tags: ['live', 'risky'],
        outcomes: {
          bad: { text: 'The set is ragged and the room doesn’t care — they sing the guitar parts, they pass the bucket, they buy the wall clock off the wall. The total lands $400 short. The sound guy covers it from a coffee can labeled RAINY. It was always going to be him.', effects: { money: -50, cred: 5, fame: 3, addFlag: 'room_saved', venueLove: 1 } },
          good: { text: 'The set lands, the bucket fills, and mid-encore the landlord — arms still crossed — mouths the chorus. The buyer leaves early. The lease gets signed at the merch table on a cymbal case.', effects: { cred: 7, fame: 5, network: 3, addFlag: 'room_saved', venueLove: 1 } },
          incredible: { text: 'The night goes so hard the story arrives before the news does: the buyer OUTBIDS themselves to fund the room instead, on the condition the plaque says “saved by the scene.” The sound guy finally cries at work. Everyone pretends not to see. Everyone sees.', effects: { cred: 9, fame: 7, network: 4, pathProgress: 1, addFlag: 'room_saved', venueLove: 1 } },
        },
      },
      right: {
        label: 'Give the mic to the room',
        governingStats: { network: 0.8 },
        tags: ['home', 'network', 'safe'],
        outcomes: {
          bad: { text: 'The open-mic format produces forty-one acts, two feuds, and a bagpipe cameo by Craig that violates several noise ordinances IN DEFENSE of a venue. The money comes in crumpled. All of it counts.', effects: { network: 4, cred: 3, addFlag: 'room_saved', venueLove: 1 } },
          good: { text: 'You emcee instead of headline, and the room saves itself — every act tells one story about the place before playing. By hour three the buyer has heard the room’s entire biography, out loud, in front of witnesses. Some purchases become impossible.', effects: { network: 6, cred: 5, addFlag: 'room_saved', venueLove: 1 } },
          incredible: { text: 'The night ends with the deed’s history read aloud like liner notes and a community land trust formed at the bar, on napkins, notarized by a regular who — of course — is a notary. The room now legally belongs to everyone it ever deafened.', effects: { network: 8, cred: 7, fame: 4, pathProgress: 1, addFlag: 'room_saved', venueLove: 1 } },
        },
      },
    },
  },

  // ═══ CONSTELLATION: THE DEDICATION (Someone × your certified hit) ═══
  {
    id: 'a3_dedication', act: 3, pathAffinity: [], weight: 16,
    requires: { flagsAll: ['someone'], stats: { hitsMin: 1 } },
    art: 'ev_dedication', context: 'Live TV. A host leaning in.',
    prompt: 'The host waits for the applause to die, then leans in with the practiced softness of a professional surgeon: “So. ‘{hitSong}.’ Everyone’s asking — who is it about?” The studio goes quiet. Somewhere across town, someone is watching this from the kitchen, and you both already know the answer.',
    tags: ['social', 'home'],
    choices: {
      left: {
        label: 'Say their name.',
        governingStats: { network: 0.5, creativity: 0.5 },
        tags: ['social', 'risky'],
        outcomes: {
          bad: { text: 'You say it, and the internet does what the internet does: finds their high-school yearbook by morning. The apology takes place in the kitchen and lasts a week. The song plays through the whole thing, from someone’s phone, because it’s everywhere now. Including here. Especially here.', effects: { fame: 6, burnout: 5, creativity: 2, hypeSong: 10, addFlag: 'dedication_public' } },
          good: { text: 'You say it plainly — first name only, no story, no setup. The host waits for more. There is no more. The clip travels because of what you DIDN’T say. At home, they text you one word: “heard.”', effects: { fame: 8, cred: 3, hypeSong: 18, addFlag: 'dedication_public' } },
          incredible: { text: 'You look into the camera — the wrong camera, the crew notes — and say the name like a fact of nature. The host, a professional, lets the silence do the segment. It becomes the year’s most-replayed twelve seconds of someone saying almost nothing. The kitchen watches it live. The kitchen already knew.', effects: { fame: 12, cred: 4, hypeSong: 28, addFlag: 'dedication_public' } },
        },
      },
      right: {
        label: '“It’s about Thursday.”',
        governingStats: { cred: 0.9 },
        tags: ['indie', 'home', 'safe'],
        outcomes: {
          bad: { text: 'The non-answer plays as coy and the panel spends four minutes theorizing about celebrities you have never met. One theory trends. At home: “apparently it’s about a yacht heiress?? do I know her??” — followed, mercifully, by “(the bit is fine. the bit is ours.)”', effects: { cred: 4, fame: 3, addFlag: 'dedication_private' } },
          good: { text: '“It’s about Thursday.” You say it like a complete answer, because it is one. The host blinks. The fans mint it instantly — THURSDAY becomes shorthand, a hashtag, a tattoo you will someday sign. The one person who knows which Thursday says nothing, forever, perfectly.', effects: { cred: 7, fame: 4, hypeSong: 12, addFlag: 'dedication_private' } },
          incredible: { text: 'Years from now, biographers will devote chapters to Thursday. Documentaries will end on it. And every week, one unremarkable evening at a time, you and the answer make dinner while the question stays famous. The song got the world. The kitchen got the truth. Correct split.', effects: { cred: 10, fame: 5, hypeSong: 16, addFlag: 'dedication_private' } },
        },
      },
    },
  },

  // ═══════════ RIVAL TEXTURE (the middle of the rivalry, and its ghost) ═══════════
  {
    id: 'a2_rival_opener', act: 2, pathAffinity: [], weight: 11,
    requires: { rivalryMin: 3, rivalryMax: 6 },
    art: 'ev_opening_slot', context: 'A text from {rival}, read four times',
    prompt: '“My opener dropped out. Friday. You’d be perfect.” It sits there, radiating strategy. Opening for {rival} is either a hand extended or a flex disguised as one — and the worst part is the room WILL be full, and the room WILL be theirs.',
    tags: ['rival', 'live'],
    choices: {
      left: {
        label: 'Take the slot. Rooms are rooms.',
        minigame: 'crowd',
        governingStats: { skill: 0.6, network: 0.5 },
        tags: ['live', 'network', 'risky'],
        outcomes: {
          bad: { text: 'Their crowd files in mid-set, talking. You play the whole thing to the backs of heads and one (1) nodding bartender. {rival} says “great set” with the sincerity of a receipt. You bank the fee and the lesson.', effects: { money: 90, fame: 2, burnout: 4, rivalry: 1 } },
          good: { text: 'You win the room the honest way: one song at a time, front row first. By the closer, {rival}’s own fans are asking for your name. {rival} watches from the wings doing rival math.', effects: { money: 120, fame: 6, network: 4, rivalry: 1 } },
          incredible: { text: 'You detonate the room so thoroughly that {rival} opens THEIR set with “so, that happened.” The clip of the crowd chanting your name — at their show — becomes both of your press cycles. The text next morning: “never again. same time next tour?”', effects: { money: 150, fame: 10, cred: 4, rivalry: 2 } },
        },
      },
      right: {
        label: '“Can’t. Washing my hair.” (Principle.)',
        governingStats: { cred: 0.8 },
        tags: ['indie', 'safe'],
        outcomes: {
          bad: { text: 'The opener they find instead is BRILLIANT and now touring with them. You wash your hair. It looks fine. It looks absolutely fine.', effects: { cred: 3, rivalry: 1, burnout: -2 } },
          good: { text: 'The declined text becomes scene lore — “washing my hair” enters the local vocabulary as a verb meaning: I know what this is. {rival} respects it more than attendance. Nobody says so.', effects: { cred: 6, rivalry: 1 } },
          incredible: { text: 'You play a house show the same Friday, forty people, no stage. Someone posts both venues side by side: stadium lights vs. string lights, captioned “choose your fighter.” The string lights WIN the comments. {rival} likes the post at 2 a.m. and unlikes it at 2:01. You saw it.', effects: { cred: 9, fame: 4, network: 2, rivalry: 1 } },
        },
      },
    },
  },
  {
    id: 'a3_nemesis_soundcheck', act: 3, pathAffinity: [], weight: 15,
    requires: { nemesis: true },
    art: 'ev_nemesis_check', context: 'An empty venue, four hours before doors',
    prompt: 'Festival soundcheck. You walk in as {rival} finishes theirs — the rival who has already beaten you once, in another life, before the comeback. They see you across two hundred empty seats. Nobody else in the building knows the whole history. Both of you are the whole history.',
    tags: ['rival', 'live'],
    choices: {
      left: {
        label: 'Walk over. Say the thing.',
        governingStats: { network: 0.6, cred: 0.5 },
        tags: ['rival', 'network', 'risky'],
        outcomes: {
          bad: { text: 'The thing comes out wrong — “you look well” to a person you once vowed to destroy. They laugh so hard the sound guy mutes the room out of respect. It breaks something. The useful something. You’re just two musicians now, which is terrifying.', effects: { rivalry: -2, cred: 3, burnout: -3 } },
          good: { text: '“You were better than me back then,” you say, because it’s true and because carrying it was heavy. They look at the empty seats. “Yeah. And?” — and that AND is the kindest thing they’ve ever said to you. The war is over. The tour rumor starts an hour later.', effects: { rivalry: -3, cred: 5, network: 4 } },
          incredible: { text: 'You don’t say anything. You plug in and play THEIR old song — the one that beat you — note for note, alone, to empty seats. They listen to the whole thing. Then, quietly: “you added a seventh.” “It wanted one.” Some wars end in duets. Tonight’s finale will be discussed for years.', effects: { rivalry: -4, cred: 7, fame: 6, pathProgress: 1 } },
        },
      },
      right: {
        label: 'Nod. Keep the war. It’s load-bearing.',
        governingStats: { creativity: 0.7 },
        tags: ['rival', 'indie'],
        outcomes: {
          bad: { text: 'The nod misfires into a half-wave, which they screenshot from memory and describe on a podcast. The war survives on new fuel. Honestly? Relief. Peace was going to require a personality change.', effects: { rivalry: 1, creativity: 3, fame: 2 } },
          good: { text: 'One nod, correctly calibrated: acknowledged, unresolved, continued. You both play better tonight than you have all tour. The sound guy, who HAS seen everything, calls it “the good poison.”', effects: { rivalry: 1, creativity: 5, cred: 3 } },
          incredible: { text: 'The nod becomes the festival’s whole story — two headliners, one history, zero words. Your sets that night are a conversation everyone hears and nobody can transcribe. The best song you write this year starts in the van after. About the seats. The empty ones.', effects: { rivalry: 1, creativity: 8, fame: 5, writeSong: true } },
        },
      },
    },
  },

  // ═══════════ ACT 1 PACK (the early days deserve more days) ═══════════
  {
    id: 'a1_first_review', act: 1, pathAffinity: [], weight: 11,
    requires: { chartingMin: 1 },
    art: 'ev_first_review', context: 'A blog with eleven readers. You know all eleven now.',
    prompt: 'Someone REVIEWED it. An actual review of “{song}”, 800 words, on a blog called Ears First. There is a paragraph about your bridge. There is a numerical score. It is a 6.8. Your entire nervous system wants to know what got docked.',
    tags: ['social', 'home'],
    choices: {
      left: {
        label: 'Read it. Then read it again. Then the comments.',
        governingStats: { creativity: 0.6, cred: 0.4 },
        tags: ['social', 'risky'],
        outcomes: {
          bad: { text: 'Comment four is your old bandmate, anonymous, being SPECIFIC. You know the typing cadence. You draft nine replies and send none, which costs a full evening and several years.', effects: { creativity: 2, burnout: 6, fame: 2 } },
          good: { text: 'The docked points were for the fade-out, which — fine. FINE. He’s right. You fix it in the live set and the reviewer comes to the next show and nods at you during the new ending like a co-writer.', effects: { creativity: 5, skill: 2, fame: 3, hypeSong: 8 } },
          incredible: { text: 'Buried in paragraph six: a sentence about your bridge so precise it teaches you what you were doing. You print it. Some strangers understand you before you do — that’s what reviews are FOR, once a decade.', effects: { creativity: 8, cred: 3, fame: 3, hypeSong: 12 } },
        },
      },
      right: {
        label: 'Screenshot the headline. Never read it.',
        governingStats: { cred: 0.8 },
        tags: ['safe', 'indie'],
        outcomes: {
          bad: { text: 'Your resolve lasts 41 hours, and you read it at 3 a.m. on your worst night, which is the exact wrong dosage. The 6.8 gets tattooed somewhere internal. Unread reviews wait. That’s their whole trick.', effects: { cred: 2, burnout: 4 } },
          good: { text: '“6.8” goes in the bio, no context. The mystique of an artist who visibly does not care is worth more than the review. The reviewer follows you back. Nobody mentions it. Perfect.', effects: { cred: 5, fame: 2, burnout: -2 } },
          incredible: { text: 'Years later an interviewer quotes the review’s best line at you and you hear it for the FIRST TIME, on camera, and your genuine delighted surprise becomes the clip of the press cycle. Not reading it was a long game you didn’t know you were playing.', effects: { cred: 7, fame: 4, burnout: -3 } },
        },
      },
    },
  },
  {
    id: 'a1_borrowed_van', act: 1, pathAffinity: [], weight: 10,
    art: 'ev_borrowed_van', context: 'Your cousin’s van. Your cousin’s ONE condition.',
    prompt: 'Your cousin will lend you the van for the out-of-town gig — the first REAL out-of-town gig — on one condition: their band’s demo plays the whole drive. Both ways. “It’s a concept album,” they say, holding the keys just out of reach. “About soup.”',
    tags: ['tour', 'home'],
    choices: {
      left: {
        label: 'Deal. The gig matters more than your ears.',
        governingStats: { network: 0.5, skill: 0.5 },
        tags: ['tour', 'safe'],
        outcomes: {
          bad: { text: 'The soup album is 74 minutes long and the drive is 68, so you sit in the venue lot for the final track, “Broth (Reprise),” out of contractual respect. The gig is fine. The soup is in your head for a month.', effects: { fame: 3, network: 2, burnout: 4 } },
          good: { text: 'Track seven — “Minestrone Girl” — is, horrifyingly, GOOD. You tell your cousin. Your cousin cries a little at a red light. The gig goes well and the drive home is the happiest 68 minutes of the month.', effects: { fame: 4, network: 3, creativity: 2 } },
          incredible: { text: 'You open the gig with a cover of “Minestrone Girl,” announced as “a song by the person who got us here.” Someone films it. Your cousin’s band gets a booking off the clip. The van is yours whenever, forever, gas included. Family is a label too.', effects: { fame: 5, network: 5, cred: 3 } },
        },
      },
      right: {
        label: 'Counter-offer: you produce ONE soup song properly.',
        governingStats: { skill: 0.8 },
        tags: ['studio', 'deal'],
        outcomes: {
          bad: { text: 'Producing “Gazpacho (Cold Open)” takes three sessions, two arguments about ladle foley, and one apology dinner. The van arrives late. The gig is rescheduled. The ladle foley, though: crisp.', effects: { skill: 4, burnout: 4, network: 2 } },
          good: { text: 'One evening, one mic, one honest mix — and the soup song becomes an actual song. Your cousin plays it for everyone at every family event forever, introducing you as “my producer.” The van is a retainer now.', effects: { skill: 6, network: 3, cred: 2 } },
          incredible: { text: 'The produced track is so much better than the rest that the soup album gets remastered around it, re-released, and — this is real — reviewed. 7.1. Your cousin beats your 6.8 and brings it up EVERY THANKSGIVING. Worth it. The van has your name on the visor.', effects: { skill: 8, network: 4, creativity: 3 } },
        },
      },
    },
  },

  // ═══════════ GENRE POLITICS (you claimed a sound; the sound has bylaws) ═══════════
  {
    id: 'a3_genre_obituary', act: 3, pathAffinity: [], weight: 11,
    requires: { genreAny: true },
    art: 'ev_genre_obit', context: 'A thinkpiece, already trending',
    prompt: '“{genre} IS DEAD,” declares the year’s laziest thinkpiece, 2,400 words, no interviews, illustrated with a stock photo of a different genre entirely. You are cited as “the last gasp.” Your phone is a casserole of condolences and gleeful rivals.',
    tags: ['social'],
    choices: {
      left: {
        label: 'Write the rebuttal. 2,401 words.',
        governingStats: { creativity: 0.6, network: 0.5 },
        tags: ['social', 'risky'],
        outcomes: {
          bad: { text: 'Your rebuttal is passionate, correct, and contains one (1) typo in the headline, which becomes the discourse. “LAST GAPS” trends. The genre survives; your proofreading does not.', effects: { fame: 4, cred: 2, burnout: 4 } },
          good: { text: 'You publish “THE GENRE IS AT MY HOUSE, ACTUALLY” with photos from last Tuesday’s packed show. The thinkpiece author replies “fair.” FAIR. The scene frames the exchange like a title belt.', effects: { fame: 6, cred: 5 } },
          incredible: { text: 'Your rebuttal is one sentence — “come to the show” — plus a ticket link. The show sells out on obituary traffic. The encore is a funeral march played at 180 bpm while the crowd screams. The thinkpiece author is spotted in row four, alive, converted.', effects: { fame: 9, cred: 7, hypeSong: 14 } },
        },
      },
      right: {
        label: 'Let it die, publicly. Keep it alive, privately.',
        governingStats: { cred: 0.9 },
        tags: ['indie', 'safe'],
        outcomes: {
          bad: { text: 'Your silence gets quoted — “declined to comment” — which the piece frames as surrender. For one bad week, bookers believe it. The Tuesday shows stay packed. Bookers don’t go to shows.', effects: { cred: 3, money: -40, fame: -2 } },
          good: { text: 'Declared dead, the genre goes underground, which is where it was born and where the rent is cheaper. The shows get better immediately — no tourists, all lifers. Death, it turns out, was a rebrand.', effects: { cred: 6, creativity: 4 } },
          incredible: { text: 'You press a run of unmarked black shirts reading only “R.I.P.” in the genre’s founding font. Lifers recognize it instantly; everyone else asks who died. “You wouldn’t know them.” The shirt outsells your records. The genre has never been more alive or better dressed.', effects: { cred: 8, money: 160, fame: 4, creativity: 3 } },
        },
      },
    },
  },

  // ═══════════ COPING: THE SONG YOU CAN'T HEAR (burnout × your own hit) ═══════════
  {
    id: 'coping_song', act: [1, 2, 3], pathAffinity: [], weight: 0, chainOnly: true,
    art: 'ev_coping_song', context: 'A grocery store. The ceiling speakers.',
    prompt: 'It happens in a grocery store: “{song}” comes on the ceiling speakers, and you feel NOTHING. Your own song — the one that used to make your chest lift on the first chord — and it might as well be an ad for the yogurt aisle. You stand there holding a basket, listening to your life’s work the way strangers do. Something has gone quiet in you, and it isn’t the store.',
    tags: ['rest'],
    choices: {
      left: {
        label: 'Go home. Play it the OLD way — badly, on the first instrument.',
        governingStats: { creativity: 0.7 },
        tags: ['rest', 'home', 'safe'],
        outcomes: {
          bad: { text: 'You fumble through it and it sounds wrong in a new way — smaller, but not warmer. You put the instrument down gently, which is the important part. Some nights the door is just closed. It’s a door, though. Not a wall.', effects: { burnout: -8, creativity: 2 } },
          good: { text: 'Verse two, wrong key, kitchen acoustics — and somewhere in the third bad chorus your chest does the OLD THING, the lift, small but unmistakable, like a pilot light catching. You play it four more times. Badly. Yours again.', effects: { burnout: -16, creativity: 4 } },
          incredible: { text: 'You play it wrong until you find a slower, sadder version hiding inside it — the version it maybe always wanted to be, before the chart got hold of it. You record thirty seconds on your phone at 1 a.m. and sleep like a stone. Some songs need to be broken back in, like boots.', effects: { burnout: -22, creativity: 7, cred: 2 } },
        },
      },
      right: {
        label: 'Keep the basket moving. Feelings are for the off-season.',
        governingStats: { skill: 0.6, network: 0.4 },
        tags: ['work', 'risky'],
        outcomes: {
          bad: { text: 'You finish the shopping, book two more sessions, and don’t mention the grocery store to anyone. The numbness politely spreads — first the song, then the encore, then the sound of your own name. The machine runs. You are somewhere inside it.', effects: { burnout: 6, money: 60, fame: 2 } },
          good: { text: 'You shelve it like a professional — and then, three days later, a fan at a signing says the song got them through a hospital stay, and the feeling comes back THROUGH them, borrowed, secondhand, real. Sometimes the audience holds it for you until you can hold it again.', effects: { burnout: -8, fame: 3, network: 3 } },
          incredible: { text: 'You work through it — but you also start a quiet rule: every soundcheck ends with sixty seconds of playing something that will never be released, for nobody. The crew learns not to ask. The numbness never fully leaves, but it never gets the last sixty seconds. That turns out to be enough.', effects: { burnout: -14, skill: 3, cred: 3, creativity: 3 } },
        },
      },
    },
  },
];
