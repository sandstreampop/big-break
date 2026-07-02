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
          good: { text: 'You chart it properly. Future-you will thank present-you in the liner notes.', effects: { skill: 5, creativity: 2, addFlag: 'demo_in_pocket', addPromise: { label: 'Book real studio time', tags: ['studio', 'record'], cards: 4, reward: { skill: 3, cred: 2 }, penalty: { cred: -2 } } } },
          incredible: { text: 'The arrangement blooms. This isn’t a demo anymore. It’s a plan.', effects: { skill: 7, creativity: 4, cred: 2, addFlag: 'demo_in_pocket' } },
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
          good: { text: 'It works. It absolutely works. You play it loud enough for the retreating patrol car to hear. The lights flash once. Approval? Approval.', effects: { creativity: 6, skill: 2 } },
          incredible: { text: 'The bridge clicks like a lock opening. Officer Reyes, it turns out, gigged for a decade before the academy. You have a standing invitation to Sunday jazz brunch. You will attend.', effects: { creativity: 8, network: 4, cred: 2 } },
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
        governingStats: { network: 0.6, creativity: 0.5 },
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
          incredible: { text: 'The song you wrote instead is the best thing you’ve ever made. The muse was cooking.', effects: { creativity: 9, cred: 5, addFlag: 'demo_in_pocket' } },
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
          bad: { text: 'The stunt malfunctions on live TV. You’re a meme by the commercial break. The bad kind. Mostly.', effects: { fame: 8, cred: -5, burnout: 8 } },
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
        governingStats: { network: 0.6, skill: 0.8 },
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
];
