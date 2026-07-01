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
          good: { text: 'You chart it properly. Future-you will thank present-you in the liner notes.', effects: { skill: 5, creativity: 2, addFlag: 'demo_in_pocket' } },
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
          incredible: { text: 'The compost corner becomes “your” corner. Regulars. Requests. An economy.', effects: { skill: 4, money: 65, network: 3, cred: 2 } },
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
          incredible: { text: 'A sleep-podcast licenses it. Thousands of strangers now dream to your drone.', effects: { creativity: 7, cred: 5, fame: 6, money: 80 } },
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
          incredible: { text: 'The venue owner likes that you didn’t enter. “Smart. Want a monthly slot?”', effects: { network: 8, cred: 4, fame: 3, addFlag: 'monthly_residency' } },
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
          good: { text: '“Stop trying to be interesting. Be correct first.” It stings. It works.', effects: { money: -60, skill: 8, cred: 2 } },
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
          good: { text: 'Dario is, against every visible indicator, competent. Doors open. He takes his cut.', effects: { network: 7, fame: 4, grantGear: 'managers_card' } },
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
  // ---- Act 2: STUDIO LEGEND ----
  {
    id: 'a2_session_sub', act: 2, pathAffinity: ['studio'], weight: 10,
    art: 'ev_session', context: 'Unknown number, 8:12 a.m.',
    prompt: '“Our player broke a finger bowling. Session’s at ten. Charts are… let’s say charts-adjacent. You in?”',
    tags: ['studio'],
    choices: {
      left: {
        label: 'Take the session',
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
          incredible: { text: 'The jingle becomes regionally iconic. Children sing it. You are the Tri-County Mozart.', effects: { skill: 6, money: 300, cred: 5, fame: 4, pathProgress: 1 } },
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
          good: { text: 'Serviceable banger delivered. It does numbers in three Baltic states.', effects: { creativity: 5, money: 180, fame: 4, hits: 1 } },
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
          good: { text: 'Decent course, passive income, mild embarrassment. The session-player retirement plan.', effects: { money: 400, fame: 5, cred: -1 } },
          incredible: { text: 'The masterclass slaps, actually. Students improve. Money arrives monthly like weather.', effects: { money: 550, fame: 8, cred: 3 } },
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
