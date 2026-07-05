// Love Island — Act 1 ambient deck (Arrival): enter, establish your Type,
// plant the first Bond, learn who everyone is pretending to be. Soft-open
// stakes; the knives arrive in Act 2. Voice per VOICE.md.

import type { GameEvent } from '../../types.js';

export const ARRIVAL_EVENTS: GameEvent[] = [
  {
    id: 'li_first_date', act: 1, tags: ['date', 'flirt'],
    art: 'li_terrace',
    context: 'Day 2 · the terrace · your first date',
    prompt: 'Two chairs, two drinks the colour of a warning label. “So,” manages {partner}, looking at you like a question. “Hi.” Behind the wall, the nation is deciding whether you have a personality. So, apparently, are you.',
    choices: {
      left: {
        label: 'Keep it light',
        tags: ['chat', 'loyal'],
        governingStats: { loyalty: 0.7, savvy: 0.3 },
        outcomes: {
          bad: { text: '“So what do you actually do?” Three questions about his job; he answers all three. It is the most anyone has learned about pipe fitting on this network.', effects: { loyalty: 2, bond: 2, public: 1 } },
          good: { text: 'Easy, warm, no fireworks. “I could actually talk to you,” they say. In here, that’s a diamond ring.', effects: { loyalty: 3, bond: 4, public: 3 } },
          incredible: { text: 'You don’t perform. They notice. “You’re not what I expected,” they say, meaning it. The Bond does the loud part for you.', effects: { loyalty: 5, bond: 6, public: 5, graft: 3 } },
        },
      },
      right: {
        label: 'Turn it on',
        tags: ['flirt'],
        governingStats: { rizz: 1 },
        outcomes: {
          bad: { text: '“Capricorn,” he says, when you open with star signs. Star signs, mate. And then, over the longest four minutes of your life, it emerges that he’s also a critic.', effects: { rizz: 2, public: 1 } },
          good: { text: '“No. NO. It did not end like that—” The airport story lands. They lean in; the camera leans in with them.', effects: { rizz: 5, public: 3, graft: 3 } },
          incredible: { text: '“You’re trouble,” they decide, delighted, somewhere in the second drink, nerves forgotten. The nation, live on air, agrees.', effects: { rizz: 8, public: 5, followers: 4, bond: 2 } },
        },
      },
    },
  },
  {
    id: 'li_factor50', act: 1, tags: ['flirt', 'banter'],
    art: 'li_pool',
    context: 'Midday · the pool · thirty-one degrees',
    prompt: '{partner} holds up the factor 50 and turns around. It’s the villa’s oldest ritual: part sunscreen, part territory, all broadcast. Four people are pretending not to watch. One of them is holding her breath.',
    choices: {
      left: {
        label: 'Do it properly',
        tags: ['flirt', 'date'],
        governingStats: { rizz: 1 },
        outcomes: {
          bad: { text: '“Is that… a face?” You got ambitious with the sunscreen and it doesn’t rub in. They spend the day with a faint grin between their shoulder blades, and not the good kind.', effects: { rizz: 2, burnout: 2 } },
          good: { text: 'Slow, unhurried, professional. The pool goes so quiet a boom operator gets emotional. Textbook. TEXTBOOK.', effects: { bond: 3, rizz: 5 } },
          incredible: { text: 'A masterclass. Someone across the pool says “oh my days” into a cushion. Production marks the clip before you’ve finished a shoulder.', effects: { bond: 4, rizz: 8, followers: 4 } },
        },
      },
      right: {
        label: 'Make it a bit',
        tags: ['banter', 'camera'],
        governingStats: { charisma: 1 },
        outcomes: {
          bad: { text: 'You announce yourself “a trained professional” and immediately get sunscreen in their eye. The lifeguard bit dies mid-scene, in front of everyone.', effects: { burnout: 3, charisma: 2 } },
          good: { text: 'You do the full spa-receptionist voice, towel over one arm. The pool cackles. {partner} rates the service “three stars, would book again.”', effects: { charisma: 5, followers: 3, bond: 2 } },
          incredible: { text: 'The bit escalates until half the villa is queueing with imaginary appointment slips. You accidentally invented today’s entire episode.', effects: { charisma: 8, followers: 6, public: 4 } },
        },
      },
    },
  },
  {
    id: 'li_kitchen_counter', act: 1, tags: ['chat', 'loyal'],
    art: 'li_kitchen',
    context: 'Late · the kitchen counter · two mugs',
    prompt: 'Past midnight, the villa’s one honest location: the kitchen counter. {mate} can’t sleep either. What starts as “do you want a tea” is turning into the kind of conversation the day never allows.',
    choices: {
      left: {
        label: 'Open up first',
        tags: ['chat', 'loyal'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: '“That got deep quick,” says {mate}, patting your arm the way people pat unfamiliar dogs. One confession too far, one tea too early.', effects: { loyalty: 2, burnout: 3 } },
          good: { text: '“Okay — your turn.” You swap one true thing for another, like conkers. No angles, no cameras played-to; genuinely the strangest thing to happen in this villa all week.', effects: { loyalty: 3, public: 3, addFlag: 'li_code_honour' } },
          incredible: { text: '“I’ve not told anyone that,” says {mate}, twice before 2 a.m. — the ex, the mum, the plan. In a game of angles you just acquired the villa’s rarest asset: an actual friend.', effects: { loyalty: 5, public: 5, graft: 3, addFlag: 'li_code_honour' } },
        },
      },
      right: {
        label: 'Collect the intel',
        tags: ['strategy', 'chat'],
        governingStats: { savvy: 1 },
        outcomes: {
          bad: { text: '“You’re very interested in other couples tonight,” says {mate}, finishing the tea and filing you under <i>games</i>.', effects: { savvy: 2, burnout: 2 } },
          good: { text: 'You listen like a friend and remember like an analyst. Both things are true. This show runs on both things being true.', effects: { savvy: 5, graft: 3 } },
          incredible: { text: 'One tea, forty minutes, and you now hold the villa’s full emotional map: who’s wobbling, who’s pretending, who cried in the toilet at four. Knowledge is Graft.', effects: { savvy: 8, graft: 5 } },
        },
      },
    },
  },
  {
    id: 'li_challenge_heartrate', act: 1, tags: ['challenge', 'drama'],
    art: 'li_challenge',
    context: 'The lawn · challenge o’clock · “I’VE GOT A TEXT!!”',
    prompt: '“Islanders, tonight you’ll each perform for the villa — while everyone wears a heart-rate monitor. The results will be read out. #pulsecheck” — A dance-off where the scoreboard is everyone’s actual heart. Science, weaponised for chaos.',
    choices: {
      left: {
        label: 'Perform for your partner',
        tags: ['loyal', 'challenge'],
        governingStats: { loyalty: 0.5, rizz: 0.5 },
        outcomes: {
          bad: { text: 'You keep it strictly for {partner}, which is sweet, and their heart rate comes back “resting.” The villa says “awww” in the wrong tone.', effects: { loyalty: 2, bond: 2, burnout: 3 } },
          good: { text: '“I hate this game,” announces {partner}, betrayed beautifully by their own monitor. You danced for one person in a room of twelve. Loyalty, with receipts.', effects: { charisma: 2, loyalty: 3, bond: 5, public: 3 } },
          incredible: { text: '“Can we see that again?” Their heart rate spiked so hard the reading gets a replay. You have never looked smugger. You have earned every pixel of it.', effects: { charisma: 2, loyalty: 5, bond: 6, public: 5, followers: 4 } },
        },
      },
      right: {
        label: 'Raise the whole room',
        tags: ['challenge', 'drama', 'camera'],
        governingStats: { charisma: 0.6, rizz: 0.4 },
        outcomes: {
          bad: { text: '“We’re having a chat later,” says {partner}, whose monitor you spiked with precisely the wrong emotion. The debrief is scheduled for immediately.', effects: { charisma: 2, followers: 3, bond: -3, burnout: 3 } },
          good: { text: 'Three spikes, two gasps, one “I’m actually shook.” Your partner’s face is doing diplomacy. The group chat at home is doing none.', effects: { charisma: 5, followers: 5, public: 3, bond: -1 } },
          incredible: { text: 'You spike every monitor on the lawn including, faintly, the medic’s. Tomorrow’s headlines are already typing themselves.', effects: { charisma: 8, followers: 9, public: 6, bond: -2, graft: 3 } },
        },
      },
    },
  },
  {
    id: 'li_swanfloat', act: 1, tags: ['date', 'banter'],
    art: 'li_pool',
    context: 'Afternoon · the pool · one (1) inflatable swan',
    prompt: 'There is one swan float and eleven Islanders. {partner} is holding it and looking at you. This is not about the swan. Nothing in this villa is ever about the swan.',
    choices: {
      left: {
        label: 'Claim the swan together',
        tags: ['date', 'loyal'],
        governingStats: { loyalty: 0.6, rizz: 0.4 },
        outcomes: {
          bad: { text: 'Two adults, one swan, zero core strength. You both go in. The swan sails on, alone, vindicated.', effects: { loyalty: 2, bond: 2, burnout: 2 } },
          good: { text: '“This is us now,” {partner} declares from the swan, mid-drift, and you talk about nothing for an hour. The nation coos. The swan, historically neutral, approves.', effects: { loyalty: 3, bond: 4, burnout: -2 } },
          incredible: { text: 'Golden hour finds your couple mid-pool on a swan, laughing at a joke no mic caught. That shot opens the episode. That shot IS the episode.', effects: { loyalty: 5, bond: 6, public: 5, burnout: -3 } },
        },
      },
      right: {
        label: 'Start a swan economy',
        tags: ['banter', 'strategy'],
        governingStats: { savvy: 0.6, charisma: 0.4 },
        outcomes: {
          bad: { text: 'You institute a booking system for the swan. The villa, a lawless nation, ignores it by lunch. The clipboard was laminated. You made a clipboard.', effects: { savvy: 2, burnout: 2 } },
          good: { text: '“Two kitchen shifts an hour, or one decent secret.” Swan slots are now a currency and you take a broker’s cut of both. The daybed respects a hustler.', effects: { charisma: 2, savvy: 5, graft: 4 } },
          incredible: { text: 'By sunset the swan has a waiting list, a dress code, and you at the centre of villa logistics. Power looks like many things. Today it’s inflatable.', effects: { charisma: 2, savvy: 8, graft: 5, followers: 4 } },
        },
      },
    },
  },
  {
    id: 'li_breakfast_duty', act: 1, tags: ['loyal', 'chat'],
    art: 'li_kitchen',
    context: 'Morning · the kitchen · someone has to',
    prompt: 'Eggs for twelve. Nobody asked you to, which is exactly why it counts. In the villa, breakfast is never breakfast: it’s a campaign stop with toast.',
    choices: {
      left: {
        label: 'Feed the villa',
        tags: ['loyal', 'graft'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: 'You burn the halloumi and set off the alarm, and eleven people in eye masks learn your name for the wrong reason.', effects: { loyalty: 2, burnout: 3, public: -1 } },
          good: { text: 'Eggs land, tea flows, and two separate people call you “an actual angel” with their mouths full. Cheap goodwill is still goodwill.', effects: { loyalty: 3, public: 3, graft: 3 } },
          incredible: { text: '“How did you know about the eggs thing?” The villa goes silent doing the maths. You plated the exact order everyone mentioned once, days ago. You listened. Nobody listens.', effects: { loyalty: 5, public: 5, graft: 4, bond: 2 } },
        },
      },
      right: {
        label: 'Breakfast for two',
        tags: ['date', 'flirt'],
        governingStats: { rizz: 0.6, loyalty: 0.4 },
        outcomes: {
          bad: { text: '“Are we not getting any?” asks the terrace, tenfold, unfed, as you deliver {partner} breakfast in bed. Romantic, yes. Politically? A scandal with orange juice.', effects: { rizz: 2, bond: 3, public: -2 } },
          good: { text: 'Two plates, the good spot on the terrace, phones-down eye contact. The villa fake-gags with envy, which is the highest compliment it has.', effects: { bond: 4, rizz: 5 } },
          incredible: { text: '“You remembered this?” {partner} goes quiet over their perfect breakfast, rebuilt from one throwaway comment on night one. The nation does not go quiet at all.', effects: { bond: 6, public: 5, rizz: 8 } },
        },
      },
    },
  },
  {
    id: 'li_gossip_daybed', act: 1, tags: ['strategy', 'code'],
    art: 'li_daybed',
    context: 'The daybed · four girls · lowered voices',
    prompt: '“Right — honest read,” says {mate}, patting the daybed. The summit is in session and today’s agenda is a couple that isn’t yours. Yet. Whatever you say next will be quoted, misquoted, and eventually read back to you at a firepit, with sources.',
    choices: {
      left: {
        label: 'Keep it kind',
        tags: ['loyal', 'code', 'chat'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: '“No fun,” rules the summit, moving on without you. Diplomacy has a price and it’s screen time.', effects: { loyalty: 2, followers: -1 } },
          good: { text: 'You defend the absent couple with one kind, fair read. It gets back to them by dinner, word-for-word. Kindness travels faster than shade here, twice as far.', effects: { loyalty: 3, public: 3, addFlag: 'li_code_honour' } },
          incredible: { text: 'You shut the pile-on down so gently nobody notices being shut down. The villa recalibrates around you. The nation files you under “keeper.”', effects: { loyalty: 5, public: 5, addFlag: 'li_code_honour' } },
        },
      },
      right: {
        label: 'Serve the tea',
        tags: ['drama', 'strategy'],
        governingStats: { savvy: 0.6, charisma: 0.4 },
        outcomes: {
          bad: { text: '“Say it to our faces, then.” Your hottest take did one lap of the villa and came home wearing your name. The couple in question is at the door. Both of them.', effects: { savvy: 2, followers: 3, public: -2, burnout: 4, addFlag: 'li_code_broke' } },
          good: { text: 'You serve one immaculate observation and the summit, honouring the exchange rate, serves back: {rival} has been rehearsing a speech. Plausible deniability with a garnish.', effects: { followers: 4, savvy: 5, gainIntel: { about: 'rival', label: 'they’ve been rehearsing a speech' } } },
          incredible: { text: 'Your read is so precise the summit goes quiet, then feral — and pays you in kind: everything the daybed knows about {rival}, itemised. Tonight’s episode is subtitled with your sentence.', effects: { followers: 7, savvy: 8, graft: 3, gainIntel: { about: 'rival', label: 'everything the daybed knows, itemised' } } },
        },
      },
    },
  },
  {
    id: 'li_hideaway_key', act: 1, tags: ['date', 'flirt'],
    art: 'li_hideaway',
    context: 'Evening · “I’VE GOT A TEXT!!” · the Hideaway is open',
    prompt: '“Tonight, one couple will spend the night in the Hideaway. The villa must decide who. #privacyplease” — The villa, a democracy of stirrers, votes for your couple with indecent speed. The door is red. The candles are lit. The mics — and this is the bit everyone forgets — stay on.',
    choices: {
      left: {
        label: 'Take the night',
        tags: ['date', 'flirt'],
        governingStats: { rizz: 1 },
        outcomes: {
          bad: { text: 'The Hideaway is 90% cushions and 10% performance anxiety. You spend the evening arranging both. Lovely chat, though.', effects: { rizz: 2, bond: 2, burnout: 3 } },
          good: { text: '“Don’t ask,” you both say at breakfast, wearing matching smugness. A night off from the villa’s surround-sound opinions.', effects: { bond: 5, rizz: 5 } },
          incredible: { text: '“SO?” demands the breakfast interrogation. “Lovely candles,” you say. Nothing else, ever. In this villa the scandal isn’t the night — it’s the discretion.', effects: { rizz: 8, bond: 7, public: 5, followers: 4 } },
        },
      },
      right: {
        label: 'Gift it to another couple',
        tags: ['strategy', 'loyal'],
        governingStats: { savvy: 0.6, loyalty: 0.4 },
        outcomes: {
          bad: { text: 'You nobly hand the key away and {partner}’s face does a thing it has never done before. The word “we” is used at you, pointedly, for days.', effects: { savvy: 2, bond: -2, public: 2, burnout: 2 } },
          good: { text: 'You pass the key to the couple who needed it. Two allies, banked. The villa calls you classy, and means it, mostly.', effects: { savvy: 5, public: 4, graft: 3 } },
          incredible: { text: '“We owe you one,” says the gifted couple, back from the Hideaway engaged-adjacent, at volume, at breakfast. You now hold favours in three duvets. Kingmaker behaviour.', effects: { savvy: 8, public: 6, graft: 4 } },
        },
      },
    },
  },
  {
    id: 'li_snakewatch', act: 1, tags: ['strategy', 'drama'],
    art: 'li_terrace',
    context: 'The terrace · {rival} is being friendly',
    prompt: '{rival} has started laughing at {partner}’s jokes. All of them. Including the sat-nav joke — the sat-nav joke, mate, currently nil-for-eleven this season and still touring. You know grafting when you see it. You invented half these moves.',
    choices: {
      left: {
        label: 'Mark your territory',
        tags: ['flirt', 'drama'],
        governingStats: { rizz: 0.7, charisma: 0.3 },
        outcomes: {
          bad: { text: 'Your counter-charm offensive is so visible it gets its own camera. {rival} watches you perform with the serenity of someone winning.', effects: { rizz: 2, burnout: 4, followers: 2, addFlag: 'li_rival_active' } },
          good: { text: 'You drift over, join the chat, and re-centre the gravity without one hostile syllable. {rival} smiles. You smile. Somewhere, a producer smiles widest.', effects: { rizz: 5, bond: 3 } },
          incredible: { text: 'You’re so effortlessly magnetic that {rival}’s campaign dissolves mid-laugh. The sat-nav joke returns to its natural state: unfunny.', effects: { rizz: 8, bond: 4, public: 4 } },
        },
      },
      right: {
        label: 'Let it play out',
        tags: ['strategy', 'rest'],
        governingStats: { savvy: 1 },
        outcomes: {
          bad: { text: '“Inside joke,” says {rival}, when you ask what’s funny. You gave it space and the space got furnished. By evening you have a knot in your stomach.', effects: { savvy: 2, burnout: 4, bond: -2, addFlag: 'li_rival_active' } },
          good: { text: 'You watch, log every move, and say nothing. If it’s real it’ll survive a rival; if it isn’t, better to know in week one.', effects: { savvy: 5, graft: 3 } },
          incredible: { text: 'Your total non-reaction unnerves {rival} into overplaying it, publicly, badly. You didn’t lift a finger. You never had to.', effects: { savvy: 8, public: 5, bond: 2 } },
        },
      },
    },
  },
  {
    id: 'li_talent_night', act: 1, tags: ['challenge', 'camera'],
    art: 'li_challenge',
    context: 'Night · the stage by the pool · talent show',
    prompt: 'The villa talent show: a sacred format where confidence outnumbers talent nine to one. {mate} has a whistle routine. {rival} is doing “spoken word.” The bar is on the floor and the cameras are ravenous.',
    choices: {
      left: {
        label: 'Do the sincere thing',
        tags: ['loyal', 'camera'],
        governingStats: { loyalty: 0.5, charisma: 0.5 },
        outcomes: {
          bad: { text: 'Your heartfelt acoustic moment is undermined by a moth with main-character energy. The moth trends. You do not.', effects: { loyalty: 2, burnout: 3, followers: 1 } },
          good: { text: 'You do the one true thing you’re actually good at, unironically, and the villa forgets to heckle. Sincerity: the rarest act on the bill.', effects: { loyalty: 3, public: 4, bond: 2, charisma: 2 } },
          incredible: { text: '“Oh,” says the villa, collectively — it wanted comedy and got feelings. {partner} looks at you like furniture just sang.', effects: { charisma: 2, loyalty: 5, public: 6, bond: 4, followers: 4 } },
        },
      },
      right: {
        label: 'Commit to the bit',
        tags: ['banter', 'camera', 'challenge'],
        governingStats: { charisma: 1 },
        outcomes: {
          bad: { text: 'Your bit requires audience participation and the audience declines to participate. You die on stage six metres from where you sleep.', effects: { burnout: 4, charisma: 2 } },
          good: { text: 'Fully committed, zero dignity retained, standing ovation from people in dressing gowns. The villa loves a casualty of comedy.', effects: { charisma: 5, followers: 4, public: 3 } },
          incredible: { text: 'The bit lands so hard it becomes villa canon. From tomorrow, nobody can say the word “artisanal” without the whole lawn corpsing.', effects: { charisma: 8, followers: 7, public: 5, graft: 3 } },
        },
      },
    },
  },
  {
    id: 'li_ick_watch', act: 1, tags: ['chat', 'drama'],
    art: 'li_bedroom',
    context: 'The dressing room · an ick has been declared',
    prompt: 'Emergency session in the dressing room: somebody’s caught the ick, and the ick is contagious once named. “He claps when the food arrives,” says {mate}, in the tone of a war crimes tribunal. All eyes turn to you for a verdict.',
    choices: {
      left: {
        label: 'Talk her down',
        tags: ['chat', 'loyal', 'code'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: '“Do YOU clap when food arrives?” The tribunal turns on you mid-defence. You do now, apparently.', effects: { loyalty: 2, burnout: 3, followers: 1 } },
          good: { text: '“It’s not an ick, it’s enthusiasm.” The tribunal considers this. The couple survives the night. You did that, quietly.', effects: { loyalty: 3, public: 3, addFlag: 'li_code_honour' } },
          incredible: { text: 'You reverse a fully-declared ick with one two-minute speech about joy. The dressing room applauds. The ick, clinically dead, is buried at sea.', effects: { loyalty: 5, public: 5, graft: 3 } },
        },
      },
      right: {
        label: 'Feed the ick',
        tags: ['drama', 'banter'],
        governingStats: { charisma: 0.7, savvy: 0.3 },
        outcomes: {
          bad: { text: 'You add three examples and one impression. It’s devastating. It’s also, everyone suddenly remembers, YOUR partner’s best mate you’re describing.', effects: { charisma: 2, followers: 3, public: -2, burnout: 3, addFlag: 'li_code_broke' } },
          good: { text: 'Your impression of the food clap is anatomically perfect. The dressing room goes down like bowling pins. The ick is now permanent and so is the clip.', effects: { followers: 5, charisma: 5 } },
          incredible: { text: 'You name the sub-icks. You establish taxonomy. Scientists of the ick will cite this dressing room for seasons to come.', effects: { followers: 8, charisma: 8, graft: 3 } },
        },
      },
    },
  },
  {
    id: 'li_workout_audience', act: 1, tags: ['flirt', 'camera'],
    art: 'li_lawn',
    context: 'Morning · the outdoor gym · an audience assembles',
    prompt: 'You’re mid-workout when you notice the daybed has rotated, as one, to watch. In the villa, exercising is never exercising: it’s a press conference with dumbbells.',
    choices: {
      left: {
        label: 'Put on a show',
        tags: ['flirt', 'camera'],
        governingStats: { rizz: 0.6, charisma: 0.4 },
        outcomes: {
          bad: { text: 'You add ten kilos for the audience and your face does something private in public. “Do the face,” the daybed requests, all afternoon.', effects: { rizz: 2, burnout: 3, followers: 2 } },
          good: { text: 'You find a rhythm that says effortless and hold it for exactly as long as anyone’s watching. Cardio, but make it PR.', effects: { charisma: 2, rizz: 5, followers: 3 } },
          incredible: { text: '“What was I saying?” Somebody drops a smoothie; somebody else loses a whole sentence. Your workout has casualties. The nation logs the timestamp.', effects: { charisma: 2, rizz: 8, followers: 6, public: 4 } },
        },
      },
      right: {
        label: 'Invite {partner} to train',
        tags: ['date', 'banter'],
        governingStats: { loyalty: 0.5, rizz: 0.5 },
        outcomes: {
          bad: { text: 'Couples’ workout: you demonstrate a partner squat, misjudge the physics, and become a cautionary tale with a lovely view of the sky.', effects: { loyalty: 2, bond: 2, burnout: 2 } },
          good: { text: 'You spot each other, badly, laughing, for forty minutes. Fitness outcome: zero. Couple outcome: significant.', effects: { charisma: 2, loyalty: 3, bond: 4, rizz: 2 } },
          incredible: { text: '“Get a room,” calls the daybed, starting a slow clap for your couple’s gym bit. Even {rival} joins in, with the face of someone chewing a wasp.', effects: { charisma: 2, loyalty: 5, bond: 5, public: 5, followers: 4 } },
        },
      },
    },
  },
  {
    id: 'li_dry_spell', act: 1, tags: ['rest', 'chat'],
    art: 'li_lawn',
    context: 'A slow day · nothing is happening · NOTHING',
    prompt: 'Day six. Nothing is happening. NOTHING. People are napping competitively. Somebody has organised the condiments by emotional significance. Days like this are when the nation drifts — or when the smart money quietly reloads.',
    choices: {
      left: {
        label: 'Manufacture a moment',
        tags: ['camera', 'drama'],
        governingStats: { charisma: 0.6, savvy: 0.4 },
        outcomes: {
          bad: { text: '“Has anyone seen Reece?” Your villa-wide hide and seek loses the tallest man on the island for two hours. Production is not amused. Production counts as amused on TV, though.', effects: { charisma: 2, followers: 2, burnout: 3 } },
          good: { text: '“Order. ORDER.” Terrace court is in session and the sat-nav joke stands trial. The verdict takes an hour; the whole villa testifies. Content from thin air.', effects: { charisma: 5, followers: 4 } },
          incredible: { text: 'Your dead-day bit is so good the episode needs no drama at all — a first in format history. The producers send down a cheese board, which is how they say thank you.', effects: { charisma: 8, followers: 7, public: 5 } },
        },
      },
      right: {
        label: 'Actually rest',
        tags: ['rest'],
        governingStats: { savvy: 1 },
        outcomes: {
          bad: { text: 'You nap so hard you miss the one thing that did happen. You will be hearing the phrase “you had to be there” until Friday.', effects: { savvy: 2, burnout: -4, public: -1 } },
          good: { text: 'Sun, water, silence. Your head empties out for the first time since the gate. Whatever’s coming — and something’s always coming — you’ll meet it level.', effects: { savvy: 5, burnout: -6 } },
          incredible: { text: 'You spend the day so visibly at peace that the villa starts treating you as senior management. Calm is a currency and you just printed some.', effects: { burnout: -8, public: 4, savvy: 8 } },
        },
      },
    },
  },
  {
    id: 'li_first_row', act: 1, tags: ['drama', 'chat'],
    art: 'li_firepit_day',
    context: 'Evening · raised voices by the pool · it’s 7 p.m.',
    prompt: '“It’s not about the LOUNGER, it’s about RESPECT—” It is about the lounger. Not even the good one — the wobbly one, the WOBBLY one — then “energy,” then, somehow, night two. Your name hasn’t come up. Yet. That “yet” is load-bearing.',
    choices: {
      left: {
        label: 'Step in and settle it',
        tags: ['chat', 'loyal'],
        governingStats: { loyalty: 0.5, charisma: 0.5 },
        outcomes: {
          bad: { text: 'You go in as a peacekeeper and come out as a combatant. Nobody remembers the lounger. Everyone remembers you were there.', effects: { loyalty: 2, burnout: 4, public: -1 } },
          good: { text: '“Ten seconds each. Go.” You separate, hydrate, translate. Both sides end up apologising to you, somehow. Fine. It airs as maturity.', effects: { loyalty: 3, public: 4 } },
          incredible: { text: 'You resolve the row with one question so precise both parties stop mid-shout to think. The villa now brings you disputes like a small-claims court.', effects: { loyalty: 4, public: 6, savvy: 2 } },
        },
      },
      right: {
        label: 'Grab a front-row seat',
        tags: ['banter', 'strategy'],
        governingStats: { savvy: 0.6, charisma: 0.4 },
        outcomes: {
          bad: { text: 'You’re caught mid-popcorn-face by the exact person shouting. Congratulations: you are now “and ANOTHER thing.”', effects: { savvy: 2, burnout: 4, followers: 2 } },
          good: { text: 'You watch from the kitchen with a beverage and perfect neutrality. Report drama like weather; never be weather.', effects: { charisma: 2, savvy: 5, followers: 3 } },
          incredible: { text: 'Your reaction shots are so good the edit intercuts you like a Greek chorus. You said nothing all night and got the most screen time.', effects: { charisma: 2, savvy: 8, followers: 7, public: 4 } },
        },
      },
    },
  },
  {
    id: 'li_minimilk', act: 1, tags: ['date', 'loyal'],
    art: 'li_lawn',
    context: 'Hottest day yet · the freezer has been raided',
    prompt: 'The ice-lolly supply is down to one Mini Milk, and {partner} just handed it to you without a word. Eleven people watched it happen. In this villa, that’s not a lolly — that’s a declaration with a wrapper.',
    choices: {
      left: {
        label: 'Split it, obviously',
        tags: ['date', 'loyal'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: 'You attempt a romantic 50/50 split and the whole thing sheers off into the grass. Two people, zero lolly, one metaphor nobody requests.', effects: { loyalty: 2, bond: 2, burnout: 2 } },
          good: { text: '“Last one,” he says, like a vow. Half each, elbows on knees, comfortable silence. In this villa, that’s a diamond ring.', effects: { loyalty: 3, bond: 5, public: 3 } },
          incredible: { text: 'The Mini Milk moment airs uncut, forty seconds, no music. The nation, feral for drama all week, votes it the best scene of the Season so far.', effects: { loyalty: 5, bond: 6, public: 6 } },
        },
      },
      right: {
        label: 'Auction it to the villa',
        tags: ['banter', 'strategy'],
        governingStats: { savvy: 0.5, charisma: 0.5 },
        outcomes: {
          bad: { text: 'The auction gets competitive, then personal, then somehow about night two again. The lolly melts mid-bidding. Everyone loses. Mostly you.', effects: { savvy: 2, burnout: 3, bond: -2 } },
          good: { text: 'Bidding reaches two kitchen shifts and a foot rub. You split the proceeds with {partner} like a tiny crime family. The villa applauds the grift.', effects: { charisma: 2, savvy: 5, graft: 5, followers: 3 } },
          incredible: { text: 'The Mini Milk sells for three favours and a secret, and the secret is genuinely useful. Never has dairy moved a season’s plot so far.', effects: { charisma: 2, graft: 6, savvy: 8, followers: 4 } },
        },
      },
    },
  },
  {
    id: 'li_terrace_debrief', act: 1, tags: ['chat', 'code'],
    art: 'li_terrace',
    context: 'The terrace · post-date debrief · mandatory',
    prompt: '“Sit. Talk. EVERYTHING.” You’re barely through the door before the terrace convenes: full debrief, no detail spared, the girls arranged like a panel show. Refusal is not on the menu. It never has been.',
    choices: {
      left: {
        label: 'Give them everything',
        tags: ['chat', 'code', 'banter'],
        governingStats: { charisma: 0.6, loyalty: 0.4 },
        outcomes: {
          bad: { text: 'You re-enact the date so thoroughly you include the bit you swore to keep private. It’s out. It’s got legs. It’s doing laps.', effects: { charisma: 2, followers: 3, bond: -2, burnout: 2 } },
          good: { text: 'Full debrief, excellent pacing, one strategic omission. The terrace is fed; the couple is protected. Broadcasting with editorial standards.', effects: { charisma: 5, public: 3, addFlag: 'li_code_honour' } },
          incredible: { text: 'Your debrief is better than the date. The terrace howls. Somewhere a producer requests the raw footage and finds your version was tighter.', effects: { charisma: 8, followers: 5, public: 4 } },
        },
      },
      right: {
        label: 'Keep it vague',
        tags: ['strategy', 'loyal'],
        governingStats: { savvy: 0.7, loyalty: 0.3 },
        outcomes: {
          bad: { text: '“It was nice,” you say. NICE. The terrace treats this as obstruction of justice and opens an independent inquiry.', effects: { savvy: 2, burnout: 3, followers: -1 } },
          good: { text: 'You give them just enough: a smile, one detail, a drawbridge. Mystery keeps a couple interesting, and the terrace guessing.', effects: { savvy: 5, bond: 2 } },
          incredible: { text: 'Your non-answers are so elegant they become the story. “She said NOTHING,” the terrace reports, thrilled, to everyone. Intrigue: manufactured.', effects: { savvy: 8, bond: 3, followers: 4 } },
        },
      },
    },
  },
];
