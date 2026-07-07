// Love Island — Act 1 ambient deck (Arrival): enter, establish your Type,
// plant the first Bond, learn who everyone is pretending to be. Soft-open
// stakes; the knives arrive in Act 2. Voice per VOICE.md.

import type { GameEvent } from '../../types.js';

export const ARRIVAL_EVENTS: GameEvent[] = [
  {
    // The redemption season's recognition scene (R8/C2b) — comeback-gated,
    // never in seeded sims.
    id: 'li_return_clocked', act: 1, weight: 3, requires: { flagsAll: ['li_comeback'] },
    art: 'li_firepit_day',
    context: 'Day 2 · the firepit · somebody finally says it',
    prompt: '“Wait. WAIT.” A girl points at you with a spatula. “You’re the one from — the season with the — you CRIED at the—” She stops. Everyone remembers the rest. The villa has been polite about it for a whole day, which for this villa is a record.',
    recap: 'Day 2, and someone clocks you — you’re the one who cried last season.',
    choices: {
      left: {
        label: 'Own every second of it',
        tags: ['drama', 'camera'],
        governingStats: { charisma: 0.7, savvy: 0.3 },
        outcomes: {
          bad: { text: 'You do the bit about your own exit and it lands wrong — too soon, apparently, for everyone except you. The clip does numbers anyway. Your numbers.', effects: { charisma: 2, followers: 4, burnout: 3 } },
          good: { text: '“Yes. That was me. The crying, the gate, all of it.” You give it one beat, then the punchline. The lawn cackles. Redemption arcs start with owning the first act.', effects: { charisma: 5, followers: 6, public: 3 } },
          incredible: { text: 'You retell your own dumping better than the show cut it — with pacing, with a moral, with an impression of the Host. The villa is yours by dessert. Again. Properly, this time.', effects: { charisma: 8, followers: 8, public: 5, graft: 3 } },
        },
      },
      right: {
        label: 'New summer. Clean slate',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: '“I’d rather not get into it.” Fair, dignified, and precisely the wrong crowd — the not-getting-into-it becomes the thing everyone gets into.', effects: { loyalty: 2, burnout: 4 } },
          good: { text: '“Different person now. Ask me anything about THIS summer.” A few of them actually do. The reset takes, mostly, which is more than most sequels manage.', effects: { loyalty: 4, public: 3, burnout: -2 } },
          incredible: { text: 'You answer the spatula girl with such unbothered warmth that the topic dies of natural causes at the table. The villa quietly re-files you: not the meme. The person.', effects: { loyalty: 6, public: 5, bond: 2 } },
        },
      },
    },
  },
  {
    id: 'li_first_date', act: 1, tags: ['date', 'flirt'],
    art: 'li_terrace',
    context: 'Day 2 · the terrace · your first date',
    prompt: 'Two chairs, two drinks the colour of a warning label. “So,” manages {partner}, looking at you like a question. “Hi.” Behind the wall, the nation is deciding whether you have a personality. So, apparently, are you.',
    recap: 'Day 2 on the terrace — your first date with {partner}.',
    choices: {
      left: {
        label: 'Keep it light',
        tags: ['chat', 'loyal'],
        governingStats: { loyalty: 0.7, savvy: 0.3 },
        outcomes: {
          bad: { text: '“So what do you actually do?” Three questions about his job; he answers all three. It is the most anyone has learned about pipe fitting on this network.', effects: { loyalty: 2, bond: 2, public: 1 } },
          good: { text: 'Easy, warm, no fireworks. “On paper you’re so my type it’s stupid — but I could actually talk to you,” they say. In here, that’s a diamond ring.', effects: { loyalty: 3, bond: 4, public: 3 } },
          incredible: { text: 'You don’t perform. They notice. “You’re not what I expected,” they say, meaning it. The Connection does the loud part for you.', effects: { loyalty: 5, bond: 6, public: 5, graft: 3 } },
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
    recap: 'By the pool, {partner} holds up the factor 50 — the villa’s oldest ritual.',
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
    recap: 'Past midnight at the kitchen counter — {mate} can’t sleep either.',
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
    // v4 S2: a beat:challenge1 variant — the first big Challenge is week 2's
    // end-of-week tentpole (delivered by the producers window, never ambient).
    id: 'li_challenge_heartrate', act: 1, tags: ['beat:challenge1', 'challenge', 'drama'],
    art: 'li_challenge',
    context: 'The lawn · challenge o’clock · “I’VE GOT A TEXT!!”',
    prompt: '“Islanders, tonight you’ll each perform for the villa — while everyone wears a heart-rate monitor. The results will be read out. #pulsecheck” — A dance-off where the scoreboard is everyone’s actual heart. Science, weaponised for chaos.',
    recap: 'Got a text — a dance-off with everyone’s heart rate read out loud.',
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
    recap: 'One inflatable swan, eleven Islanders, and {partner} holding it.',
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
    recap: 'Eggs for twelve, and nobody asked you to make them.',
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
    recap: 'The daybed summit convenes — today’s agenda is a couple that isn’t yours.',
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
    recap: 'Got a text — the villa voted your couple into the Hideaway tonight.',
    choices: {
      left: {
        label: 'Take the night',
        tags: ['date', 'flirt'],
        governingStats: { rizz: 1 },
        outcomes: {
          bad: { text: 'The Hideaway is 90% cushions and 10% performance anxiety. You spend the evening arranging both. Lovely chat, though.', effects: { rizz: 2, bond: 2, burnout: 3 } },
          good: { text: '“Don’t ask,” you both say at breakfast, wearing matching smugness. A night off from the villa’s surround-sound opinions.', effects: { bond: 5, rizz: 5 } },
          incredible: { text: '“SO? Were you two doing bits or WHAT?” demands the breakfast interrogation. “Lovely candles,” you say. Nothing else, ever. In this villa the scandal isn’t the night — it’s the discretion.', effects: { rizz: 8, bond: 7, public: 5, followers: 4 } },
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
    recap: '{rival} is suddenly laughing at every one of {partner}’s jokes.',
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
    // v4 S2: the other beat:challenge1 variant (see li_challenge_heartrate).
    id: 'li_talent_night', act: 1, tags: ['beat:challenge1', 'challenge', 'camera'],
    art: 'li_challenge',
    context: 'Night · the stage by the pool · talent show',
    prompt: 'The villa talent show: a sacred format where confidence outnumbers talent nine to one. {mate} has a whistle routine. {rival} is doing “spoken word.” The bar is on the floor and the cameras are ravenous.',
    recap: 'Talent-show night by the pool — {mate}’s got a whistle routine.',
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
    prompt: 'Emergency session in the dressing room: somebody’s caught the ick, and the ick is contagious once named. “He’s proper given me the ick, I can’t even explain it,” says {mate}. “He claps. When the food arrives. He CLAPS.” The tone is a war crimes tribunal. All eyes turn to you for a verdict.',
    recap: 'Emergency dressing-room session: {mate} has declared the ick.',
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
    recap: 'Mid-workout, and the daybed has rotated as one to watch you.',
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
    recap: 'Day six and nothing is happening. Nothing. The villa is napping.',
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
    recap: 'A 7 p.m. row over the wobbly lounger — your name’s not in it. Yet.',
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
    recap: 'Down to one Mini Milk, and {partner} just handed it to you. Eleven watched.',
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
    recap: 'Post-date debrief — the terrace convenes, no detail spared.',
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
  {
    id: 'li_villa_threshold', act: 1, tags: ['flirt', 'chat'],
    art: 'li_lawn',
    context: 'Day 1 · the villa gates · first impressions',
    prompt: '“Here she comes—” The line-up assembles on the lawn like a firing squad in linen. Eleven strangers, one entrance, and roughly four seconds to decide whether you’re a threat, a laugh, or lunch. The gate clicks shut behind you. No handle on this side.',
    recap: 'Day 1 at the gates — eleven strangers lined up to judge your entrance.',
    choices: {
      left: {
        label: 'Work the whole line',
        tags: ['flirt', 'camera'],
        governingStats: { rizz: 0.6, charisma: 0.4 },
        outcomes: {
          bad: { text: 'You go down the line like a wedding receiving line and blank the second name. It was {mate}’s. {mate} clocks it. You are now, to one person in here, the one who forgot them on sight.', effects: { rizz: 2, burnout: 2, public: -1 } },
          good: { text: 'You greet each of them like you mean it, land two jokes, and leave nobody out. The lawn thaws. Eleven strangers become eleven maybes in under a minute.', effects: { rizz: 5, charisma: 2, public: 3 } },
          incredible: { text: 'You read the line-up like a room and give each one exactly the hello they wanted. By the time you sit, three of them are already quoting you. The lawn is yours.', effects: { rizz: 8, charisma: 3, public: 5, followers: 4 } },
        },
      },
      right: {
        label: 'Find one real face',
        tags: ['chat', 'loyal'],
        governingStats: { loyalty: 0.6, charisma: 0.4 },
        outcomes: {
          bad: { text: 'You lock onto the kindest face and cling. Sweet, safe, and the other ten now think you’re shy. Shy plays badly on a show that runs on volume.', effects: { loyalty: 2, burnout: 2 } },
          good: { text: 'You skip the parade and find the one person actually holding eye contact. A real two-minute chat while everyone else performs. Substance over splash.', effects: { loyalty: 5, bond: 4 } },
          incredible: { text: 'You ignore the fireworks and clock the quiet one clocking you. One honest hello, and you’ve got an ally before you’ve got a drink — while the loud ones are still shaking hands with the wrong people.', effects: { loyalty: 8, bond: 5, public: 4 } },
        },
      },
    },
  },
  {
    id: 'li_bed_share_night_one', act: 1, tags: ['chat', 'flirt'],
    art: 'li_bedroom',
    context: 'Night 1 · the bedroom · one bed, two strangers',
    prompt: '“So… which side are you?” asks {partner}, holding the duvet like a peace treaty. One bed, two people who met at teatime, eleven others pretending to be asleep three feet away. The mics are on. The mics are always on.',
    recap: 'Night 1, sharing a bed with {partner}, who you met at teatime.',
    choices: {
      left: {
        label: 'Break the ice',
        tags: ['chat', 'banter'],
        governingStats: { charisma: 0.6, loyalty: 0.4 },
        outcomes: {
          bad: { text: '“Do you snore?” is a bold opener and the answer, it turns out, is a saga. You learn about their deviated septum until 2 a.m. Romance: pending. Sleep: cancelled.', effects: { charisma: 2, burnout: 3 } },
          good: { text: 'You whisper-chat about nothing till the room goes quiet, then keep going quieter. No moves, no pressure, just two people getting the giggles under a duvet.', effects: { charisma: 3, bond: 4 } },
          incredible: { text: '“I’ve not laughed like this in ages,” {partner} whispers, and means it. You talk till the birds start — until {mate} sits bolt upright and hisses, “will you two SHUT UP, some of us are grafting tomorrow.”', effects: { charisma: 3, bond: 6, public: 4 } },
        },
      },
      right: {
        label: 'Play it cool',
        tags: ['flirt', 'chat'],
        governingStats: { rizz: 0.6, savvy: 0.4 },
        outcomes: {
          bad: { text: 'You go for aloof and land on “asleep.” {partner} lies awake wondering if you’re keen. So does the nation. So, frankly, do you.', effects: { rizz: 2, burnout: 2, bond: -1 } },
          good: { text: 'One arm out, one easy joke, zero desperation. “Comfy?” you ask. “Getting there,” they say, and the gap in the middle quietly closes.', effects: { rizz: 5, bond: 4 } },
          incredible: { text: 'You give it one line and a lot of nothing, and the space between you does all the talking. By lights-out {partner}’s picked their side: yours.', effects: { rizz: 8, bond: 6, public: 4 } },
        },
      },
    },
  },
  {
    id: 'li_firepit_funfact', act: 1, tags: ['banter', 'camera'],
    art: 'li_firepit',
    context: 'Night 1 · the firepit · “tell us a fun fact”',
    prompt: '“Go round the circle — fun fact each,” someone decides, and the firepit braces. So far the bar is a man who once met a soap actor in a Nando’s. Your turn is coming, and the last two facts were a tattoo nobody asked about and a cousin who was “nearly on Gladiators.” The bar is on the floor.',
    recap: 'Night 1 firepit — the dreaded fun-fact round goes round the circle.',
    choices: {
      left: {
        label: 'Play the big card',
        tags: ['camera', 'banter'],
        governingStats: { charisma: 0.7, rizz: 0.3 },
        outcomes: {
          bad: { text: 'You lead with the skydiving story and the circle calls “bragging.” The soap-actor man is quietly furious you’ve raised the bar. First night, first enemy.', effects: { charisma: 2, burnout: 3, followers: 2 } },
          good: { text: 'You tell the one about the wedding you crashed by accident, and the firepit forgets to look at their own turn. Big swing, clean landing.', effects: { charisma: 5, followers: 4, public: 3 } },
          incredible: { text: 'Your fun fact has a twist ending and a callback, and the circle demands a sequel. You just turned an icebreaker into a headline act.', effects: { charisma: 8, followers: 6, public: 4 } },
        },
      },
      right: {
        label: 'Undersell it',
        tags: ['chat', 'loyal'],
        governingStats: { loyalty: 0.6, savvy: 0.4 },
        outcomes: {
          bad: { text: '“I haven’t really got one,” you say, and the circle believes you instantly. Modest, sure. Memorable, no. You get skipped in the recap.', effects: { loyalty: 2, public: -1 } },
          good: { text: 'You lowball a small odd fact — you can’t whistle — and it becomes the running joke by breakfast. Small, true, sticky. The best kind.', effects: { loyalty: 5, bond: 3, followers: 2 } },
          incredible: { text: 'You underplay so charmingly the circle spends ten minutes trying to prise the real fact out of you. Mystery, night one. They’re hooked.', effects: { loyalty: 6, savvy: 3, public: 4 } },
        },
      },
    },
  },
  {
    id: 'li_washing_line_claim', act: 1, tags: ['loyal', 'strategy'],
    art: 'li_lawn',
    context: 'Morning · the washing line · limited pegs',
    prompt: 'The washing line has eight pegs and a nation of swimwear. Somebody’s bikini has colonised the sunny end for two days. Diplomacy over drying space is, historically, how villa wars begin. Yours are still wet.',
    recap: 'A cold war over eight pegs and the sunny end of the washing line.',
    choices: {
      left: {
        label: 'Sort it fairly',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 0.6, savvy: 0.4 },
        outcomes: {
          bad: { text: 'You propose a peg rota and are informed, coldly, that pegs are “not that deep.” They are exactly that deep. You’ve just found the villa’s fault line.', effects: { loyalty: 2, burnout: 3 } },
          good: { text: 'You redistribute the pegs with the calm of a hostage negotiator and everyone’s smalls get equal sun. Nobody thanks you. Everybody remembers.', effects: { loyalty: 5, public: 3, graft: 3 } },
          incredible: { text: 'You solve the peg crisis so fairly the villa appoints you unofficial minister for logistics. Small job. Real power. It starts with laundry.', effects: { loyalty: 6, savvy: 3, graft: 4, public: 3 } },
        },
      },
      right: {
        label: 'Quietly rehang everything',
        tags: ['strategy', 'banter'],
        governingStats: { savvy: 0.7, charisma: 0.3 },
        outcomes: {
          bad: { text: 'You quietly move the squatter bikini and its owner clocks the empty peg from across the lawn. “Who touched my stuff?” You touched their stuff.', effects: { savvy: 2, burnout: 4, public: -1 } },
          good: { text: 'You rehang the whole line by sun exposure while nobody’s watching and claim the prime end for {partner}. A tiny, invisible act of love. And theft.', effects: { savvy: 5, bond: 3, graft: 3 } },
          incredible: { text: 'By the time anyone notices, the line is a masterpiece of airflow and your swimwear’s bone dry. Chaos-manager energy. Nobody suspects a thing.', effects: { savvy: 8, graft: 4, bond: 2 } },
        },
      },
    },
  },
  {
    id: 'li_bombshell_incoming', act: 1, tags: ['loyal', 'strategy'],
    art: 'li_firepit_day',
    context: 'Afternoon · the firepit · a text lands wrong',
    prompt: 'The gallery lights shift and a runner scuttles past clutching a clipboard, which in villa terms is a weather warning. Word outruns the text: a new arrival lands tonight. Eyes flick to partners; partners flick to the floor. Somewhere out there {bombshell} is doing their hair, and the villa is already recalculating.',
    recap: 'A text warns a new arrival lands tonight — the villa starts recalculating.',
    choices: {
      left: {
        label: 'Reassure {partner}',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 0.7, charisma: 0.3 },
        outcomes: {
          bad: { text: 'You promise {partner} you’re “not going anywhere” a bit too fast, and they hear the speed. Reassurance that sounds rehearsed reassures no one.', effects: { loyalty: 2, burnout: 3, bond: -1 } },
          good: { text: '“Whoever walks in, I’m still sat here with you.” You say it once, calm, and {partner} exhales for the first time all afternoon. Steady wins the jitters.', effects: { loyalty: 5, bond: 4, public: 3 } },
          incredible: { text: 'You don’t over-promise; you just stay exactly as you were, and the calm is louder than any speech. {partner} tells the girls you’re “solid.” Top praise here.', effects: { loyalty: 8, bond: 6, public: 4, addFlag: 'li_code_honour' } },
        },
      },
      right: {
        label: 'Keep your options open',
        tags: ['strategy', 'temptation'],
        governingStats: { savvy: 0.6, rizz: 0.4 },
        outcomes: {
          bad: { text: 'You mention, breezily, that you “came here single,” and {partner} goes very quiet. The bombshell hasn’t landed and you’ve done their work for them.', effects: { savvy: 2, burnout: 3, bond: -3 } },
          good: { text: 'You keep it honest — “I’ll always have a look, but I’m happy” — and somehow it works. Options open, respect intact. A rare double.', effects: { savvy: 5, rizz: 3, public: 2 } },
          incredible: { text: 'You clock the incoming threat, war-game every outcome, and say nothing yet. Whoever {bombshell} is, you’ll have read them before they’ve unpacked.', effects: { savvy: 8, graft: 4, public: 3 } },
        },
      },
    },
  },
  {
    id: 'li_pull_for_a_chat', act: 1, tags: ['flirt', 'strategy'],
    art: 'li_daybed',
    context: 'Afternoon · the daybed · “can I borrow you?”',
    prompt: '“Can I pull you for a chat?” The seven words that reorganise a villa. You’ve said them, or you’re about to. {partner} is peeling off from the group; twelve pairs of eyes track the walk to the daybed. This chat has an audience and a scoreboard.',
    recap: 'You pulled {partner} for a chat — twelve pairs of eyes tracking the walk.',
    choices: {
      left: {
        label: 'Lay your cards down',
        tags: ['flirt', 'loyal'],
        governingStats: { rizz: 0.5, loyalty: 0.5 },
        outcomes: {
          bad: { text: 'You go too strong — “I could see this being something” — on day three, and {partner} does the polite nod of the gently overwhelmed. Big graft, bad timing.', effects: { rizz: 2, burnout: 3, bond: -1 } },
          good: { text: '“I like where my head’s at with you.” Simple, warm, no games. {partner} grins at the grass. The daybed audience pretends not to cheer.', effects: { rizz: 5, bond: 4, public: 3 } },
          incredible: { text: 'You say the honest thing at the honest speed and {partner} says it back before you finish. The graft lands so clean the villa calls it official by dinner.', effects: { rizz: 8, bond: 6, public: 4, graft: 3 } },
        },
      },
      right: {
        label: 'Keep them guessing',
        tags: ['strategy', 'flirt'],
        governingStats: { savvy: 0.6, rizz: 0.4 },
        outcomes: {
          bad: { text: 'You’re so mysterious {partner} leaves the daybed unsure you even like them. Intrigue’s a knife; you held it by the blade.', effects: { savvy: 2, burnout: 2, bond: -2 } },
          good: { text: 'You give a little, hold a little, and leave {partner} wanting the next chat. The graft is a slow build, and you just laid a good brick.', effects: { savvy: 5, bond: 3, graft: 3 } },
          incredible: { text: 'You leave the daybed having said almost nothing and somehow raised the temperature. {partner} spends all evening replaying it, and pulls YOU for the next chat before you’ve had to ask.', effects: { savvy: 8, bond: 4, graft: 4, public: 3 } },
        },
      },
    },
  },
  {
    id: 'li_intentions_vetting', act: 1, tags: ['loyal', 'chat'],
    art: 'li_firepit_day',
    context: 'The firepit · the group wants a word',
    prompt: '“We just wanna know you’re genuine, that’s all,” says {mate}, in the tone of a border official. The group has pulled you for the intentions chat: a friendly interrogation about what you’re actually doing with {partner}. Wrong answer travels fast.',
    recap: 'The group pulls you for the intentions chat about you and {partner}.',
    choices: {
      left: {
        label: 'Prove you’re genuine',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 0.7, charisma: 0.3 },
        outcomes: {
          bad: { text: 'You over-explain your feelings until it sounds like a hostage statement. The group nods slowly. Sincerity, delivered at that length, reads as guilty.', effects: { loyalty: 2, burnout: 3 } },
          good: { text: 'You answer straight, no speech, and let one true thing about {partner} do the work. The group relaxes. Vetting passed, quietly.', effects: { loyalty: 5, public: 3, addFlag: 'li_code_honour' } },
          incredible: { text: 'You’re so plainly genuine the interrogation turns into a group hug. {mate} tells {partner} later: “They’re the real deal.” Word gets around by morning.', effects: { loyalty: 8, bond: 4, public: 4, addFlag: 'li_code_honour' } },
        },
      },
      right: {
        label: 'Charm the jury',
        tags: ['banter', 'camera'],
        governingStats: { charisma: 0.6, rizz: 0.4 },
        outcomes: {
          bad: { text: 'You crack jokes through the whole vetting and the group decides you’re “not taking it serious.” The one time deadpan was the wrong call.', effects: { charisma: 2, burnout: 3, public: -1 } },
          good: { text: 'You disarm the jury with charm and one self-aware laugh, and they forget they were grilling you. Case dismissed, on personality.', effects: { charisma: 5, followers: 3, public: 3 } },
          incredible: { text: 'You turn the interrogation into your best bit and the group’s doing your impressions by the end. You walked into a trial and left with fans.', effects: { charisma: 8, followers: 6, public: 4 } },
        },
      },
    },
  },
  {
    id: 'li_first_cook', act: 1, tags: ['loyal', 'banter'],
    art: 'li_kitchen',
    context: 'Night 1 · the kitchen · the first group dinner',
    prompt: 'First communal dinner, and the villa has discovered that eleven people who all “can cook, actually” have produced one raw chicken, three burnt pans and a bowl of something. The kitchen is chaos. Somebody needs to grab the wooden spoon before the smoke alarm does it for them.',
    recap: 'The villa’s first chaotic group dinner — eleven cooks, one raw chicken.',
    choices: {
      left: {
        label: 'Take charge',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 0.6, savvy: 0.4 },
        outcomes: {
          bad: { text: 'You appoint yourself head chef and lose the room in seconds — nobody takes orders from someone they met at teatime. The chicken stays raw out of pure spite. Mutiny, over a hob.', effects: { loyalty: 2, burnout: 3 } },
          good: { text: 'You quietly organise the chaos — you on the hob, {mate} on veg, someone banished to laying the table — and a real dinner appears. Nobody says thanks. Everybody eats, and clocks who fixed it.', effects: { loyalty: 5, graft: 3, public: 3 } },
          incredible: { text: 'You turn eleven panicking strangers into a working kitchen and land a dinner that tastes like a plan. Night one, and you’re already the one the villa runs to when it’s on fire. Literally, tonight.', effects: { loyalty: 6, graft: 4, bond: 2, public: 3 } },
        },
      },
      right: {
        label: 'Charm your way out',
        tags: ['banter', 'camera'],
        governingStats: { charisma: 0.7, rizz: 0.3 },
        outcomes: {
          bad: { text: 'You dodge kitchen duty with a bit and get put on washing-up as punishment, where you break a plate for a laugh nobody was after. Charm has limits, and you found the sink.', effects: { charisma: 2, burnout: 2 } },
          good: { text: 'You talk your way out of cooking and into hosting — pouring drinks, running commentary, keeping the panicking chefs laughing. You did nothing useful and everyone had the best night. A gift, that.', effects: { charisma: 5, followers: 3, public: 3 } },
          incredible: { text: 'You turn the burnt-dinner disaster into the funniest night of the week without touching a pan, narrating the chaos like a cookery show gone wrong. Zero cooking, total legend. The chicken stays raw.', effects: { charisma: 8, followers: 6, public: 4 } },
        },
      },
    },
  },
  {
    id: 'li_mirror_scramble', act: 1, tags: ['banter', 'loyal'],
    art: 'li_bedroom',
    context: 'Evening · the dressing room · one mirror, six faces',
    prompt: 'Getting-ready hour: six people, one good mirror, and a countdown to a firepit nobody wants to be late for. Elbows are out. A curling wand is being guarded like a family heirloom. The lighting in here has ruined stronger villas than this.',
    recap: 'Getting-ready hour — six faces, one good mirror, elbows out.',
    choices: {
      left: {
        label: 'Hold your spot',
        tags: ['banter', 'drama'],
        governingStats: { charisma: 0.6, savvy: 0.4 },
        outcomes: {
          bad: { text: 'You defend your mirror inch and get branded “a bit much before 8 p.m.” The curling-wand guard remembers. These things compound.', effects: { charisma: 2, burnout: 3, public: -1 } },
          good: { text: 'You hold your patch of mirror with jokes instead of elbows and somehow everyone still gets ready on time. Diplomacy, applied to eyeliner.', effects: { charisma: 5, public: 3 } },
          incredible: { text: 'You run the dressing room like air-traffic control and the whole room’s glam and grateful with two minutes to spare. Chaos, tamed with a comb.', effects: { charisma: 8, public: 4, followers: 3 } },
        },
      },
      right: {
        label: 'Do everyone’s glam',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 0.7, charisma: 0.3 },
        outcomes: {
          bad: { text: 'You offer to do everyone’s makeup and undertake a four-hour project you cannot finish. Two faces go to the firepit half-done. Ambitious. Foolish.', effects: { loyalty: 2, burnout: 4 } },
          good: { text: 'You do {mate}’s eyeliner better than {mate} ever has and bank a friend for the summer. Nothing bonds like a good wing on the first go.', effects: { loyalty: 5, bond: 4, graft: 3 } },
          incredible: { text: 'Your glam station becomes the beating heart of the villa and everyone arrives at the firepit looking incredible and owing you. Soft power, in a compact.', effects: { loyalty: 6, bond: 4, graft: 4, public: 3 } },
        },
      },
    },
  },
  {
    id: 'li_hot_tub_debut', act: 1, tags: ['flirt', 'banter'],
    art: 'li_pool',
    context: 'Night · the hot tub · built for four, holding nine',
    prompt: 'The hot tub was designed for four and currently contains nine, plus a lager and a philosophical debate about star signs. You’re on the rim, half in. There’s exactly one gap left, and it’s next to {partner}. And, on the far side, {rival}.',
    recap: 'One gap left in an overcrowded hot tub — between {partner} and {rival}.',
    choices: {
      left: {
        label: 'Slot in by {partner}',
        tags: ['flirt', 'loyal'],
        governingStats: { loyalty: 0.6, rizz: 0.4 },
        outcomes: {
          bad: { text: 'You climb over three people to reach {partner} and elbow a lager into the water. The tub mourns the lager. {rival} smirks from the good seat.', effects: { loyalty: 2, burnout: 2, public: -1 } },
          good: { text: 'You fold in next to {partner}, knees touching, and the star-sign debate fades to background noise. Nine in a tub and it’s just the two of you.', effects: { loyalty: 5, bond: 4, public: 3 } },
          incredible: { text: 'You settle by {partner} so easily that {rival}’s side of the tub quietly empties of interest. The gap you took was the only one that mattered.', effects: { loyalty: 8, bond: 6, public: 4 } },
        },
      },
      right: {
        label: 'Command the tub',
        tags: ['banter', 'camera'],
        governingStats: { charisma: 0.7, rizz: 0.3 },
        outcomes: {
          bad: { text: 'You try to host from a hot tub and knock the whole thing into a splash war. Fun, briefly. Then someone’s extensions are wet and it’s a whole thing.', effects: { charisma: 2, burnout: 3 } },
          good: { text: 'You referee the star-sign debate into actual comedy and the tub becomes the best seat in the villa. Even the person losing the argument refuses to get out and cede the floor.', effects: { charisma: 5, followers: 4, public: 3 } },
          incredible: { text: 'You turn the overcrowded tub into the episode’s centrepiece — a talk show in bubbles. Even {rival} laughs, against their own interests.', effects: { charisma: 8, followers: 6, public: 4 } },
        },
      },
    },
  },
  {
    id: 'li_wrong_name', act: 1, tags: ['banter', 'chat'],
    art: 'li_terrace',
    context: 'Day 3 · the terrace · a name goes missing',
    prompt: 'You’ve called {mate} the wrong name. Not a small slip — you called them the name of a completely different Islander, at volume, across the terrace. The pause that follows could hold weather. {mate} is deciding, right now, whether this is funny.',
    recap: 'You called {mate} by the wrong name, at volume, across the terrace.',
    choices: {
      left: {
        label: 'Own it loudly',
        tags: ['banter', 'camera'],
        governingStats: { charisma: 0.7, rizz: 0.3 },
        outcomes: {
          bad: { text: 'You try to laugh it off and accidentally do it again, worse. {mate} now has a nickname for you and it is not affectionate. The terrace enjoys this hugely.', effects: { charisma: 2, burnout: 3, public: -1 } },
          good: { text: 'You turn the blunder into a full apology tour with jazz hands and {mate} forgives you on comedic grounds. Recovery, via commitment to the bit.', effects: { charisma: 5, followers: 3, bond: 2 } },
          incredible: { text: 'You make the name mix-up the villa’s new in-joke and everyone starts “accidentally” getting names wrong. You weaponised your own gaffe. Legendary.', effects: { charisma: 8, followers: 6, public: 4 } },
        },
      },
      right: {
        label: 'Grovel sincerely',
        tags: ['chat', 'loyal'],
        governingStats: { loyalty: 0.7, charisma: 0.3 },
        outcomes: {
          bad: { text: 'You apologise so many times {mate} has to reassure YOU, which is somehow the more embarrassing outcome. Over-grovelling: a second crime.', effects: { loyalty: 2, burnout: 3 } },
          good: { text: 'You take {mate} aside, own it properly, and learn three actual things about them while you’re there. A slip, turned into a real conversation.', effects: { loyalty: 5, bond: 4 } },
          incredible: { text: 'Your sincere fix is so warm {mate} decides you’re one of the good ones on the spot. Sometimes the fastest way into a friendship is a mistake.', effects: { loyalty: 8, bond: 5, public: 3 } },
        },
      },
    },
  },
  {
    id: 'li_pool_float', act: 1, tags: ['flirt', 'drama'],
    art: 'li_firepit',
    context: 'Day 1 · the pool · one giant flamingo float',
    prompt: 'The villa contains exactly one good pool float — a giant inflatable flamingo the size of a small car — and everyone has clocked it at the same moment. Whoever claims it first owns the pool, the photo, and the day. {rival} is already eyeing it. So, frankly, are you.',
    recap: 'One giant flamingo float, one villa — and the land-grab is on.',
    choices: {
      left: {
        label: 'Claim it outright',
        tags: ['flirt', 'drama'],
        governingStats: { rizz: 0.6, charisma: 0.4 },
        outcomes: {
          bad: { text: 'You sprint for the flamingo, misjudge the leap, and go straight over the far side into the deep end while it sails off riderless. The villa will replay the belly-flop for weeks. Nerve: failed, wetly.', effects: { rizz: 2, burnout: 3, public: -1 } },
          good: { text: 'You claim the flamingo with a running dive and a pose, and hold court from its back like a throne. Everyone wants a go. You decide who gets one. Day one, and you own the pool.', effects: { rizz: 5, followers: 4, public: 3 } },
          incredible: { text: 'You take the flamingo, pull {partner} up beside you, and turn it into the season’s first proper flirt — floating, laughing, the villa watching from the shallow end. Poster shot, day one.', effects: { rizz: 8, followers: 7, public: 5, drama: 3 } },
        },
      },
      right: {
        label: 'Share it clever',
        tags: ['banter', 'strategy'],
        governingStats: { savvy: 0.5, charisma: 0.5 },
        outcomes: {
          bad: { text: 'You propose a fair flamingo rota and are told, coldly, that it’s “just a float.” It is not just a float. You’ve turned a laugh into legislation, and nobody’s laughing now.', effects: { savvy: 2, burnout: 2, public: -1 } },
          good: { text: 'You wave {rival} onto the flamingo and quietly commandeer the good lounger in the shade instead — with the spot beside you saved for {partner}. Everyone chased the bird. You took the better seat.', effects: { savvy: 5, charisma: 2, bond: 3 } },
          incredible: { text: 'You broker the flamingo into a villa-wide game — timed goes, a leaderboard, {partner} as judge — and turn one inflatable into everyone’s best afternoon. You gave it away and somehow ran the whole thing.', effects: { savvy: 8, graft: 3, public: 3 } },
        },
      },
    },
  },
  {
    id: 'li_stargaze_daybed', act: 1, tags: ['chat', 'flirt'],
    art: 'li_daybed',
    context: 'Late · the outdoor daybed · everyone else is in bed',
    prompt: 'Everyone else has gone in. It’s just you, {partner}, a shared duvet dragged outside, and a sky the production budget can’t take credit for. No cameras crowding, no audience. Which, in this villa, is the rarest kind of pressure.',
    recap: 'Just you and {partner} on the outdoor daybed after everyone else went in.',
    choices: {
      left: {
        label: 'Get real',
        tags: ['chat', 'loyal'],
        governingStats: { loyalty: 0.7, charisma: 0.3 },
        outcomes: {
          bad: { text: 'You reach for a Deep Chat and land on your ex, at length, under the stars. {partner} listens, kindly, wondering why they’re on this daybed. Timing, again.', effects: { loyalty: 2, burnout: 3, bond: -1 } },
          good: { text: 'You talk about the real stuff — home, fears, the plan — and the villa dissolves. No cameras crowding, no audience notes, just the two of you under a sky nobody’s producing. It counts double out here.', effects: { loyalty: 5, bond: 5, public: 3 } },
          incredible: { text: '“I feel like I’ve known you ages,” {partner} says to the sky. You stayed out till the stars quit. Nothing was filmed. Everything shifted.', effects: { loyalty: 8, bond: 7, public: 4 } },
        },
      },
      right: {
        label: 'Keep it playful',
        tags: ['flirt', 'banter'],
        governingStats: { rizz: 0.6, charisma: 0.4 },
        outcomes: {
          bad: { text: 'You keep it so light it never gets off the ground, and {partner} heads in unsure if you’re into them or just bored. Playful tipped into aloof.', effects: { rizz: 2, burnout: 2, bond: -1 } },
          good: { text: 'You trade daft would-you-rathers till you’re both wheezing and the stars are forgotten. Not deep. Definitely real. The giggles are the tell.', effects: { rizz: 5, bond: 4 } },
          incredible: { text: 'You keep it feather-light and somehow it turns into the most honest laugh either of you has had all week — the kind where {partner} snorts, then dies of embarrassment, then does it again.', effects: { rizz: 8, bond: 6, public: 3 } },
        },
      },
    },
  },
  {
    id: 'li_group_selfie', act: 1, tags: ['camera', 'loyal'],
    art: 'li_lawn',
    context: 'Golden hour · the lawn · “everyone in, quick”',
    prompt: '“Everyone in — quick, the light’s going,” calls {mate}, holding a phone at arm’s length that production definitely didn’t sanction. Twelve people, one frame, and a quiet war over who gets front and centre. You’re somewhere in the scrum.',
    recap: 'A golden-hour villa selfie — a quiet war over who gets front and centre.',
    choices: {
      left: {
        label: 'Claim the centre',
        tags: ['camera', 'strategy'],
        governingStats: { savvy: 0.5, charisma: 0.5 },
        outcomes: {
          bad: { text: 'You angle for the middle and end up half-cropped with your eyes shut. The one photo that gets out is that one. It gets out everywhere.', effects: { savvy: 2, burnout: 2, public: -1 } },
          good: { text: 'You find the flattering front spot without anyone clocking the manoeuvre. The photo’s a keeper and you’re the centre of it. Positioning is a skill.', effects: { savvy: 5, followers: 3, public: 3 } },
          incredible: { text: 'You land dead centre, mid-laugh, arm round {partner}, and it becomes the season’s poster shot. People will screenshot this for years. Framed, literally.', effects: { savvy: 8, followers: 6, public: 4 } },
        },
      },
      right: {
        label: 'Make it about the group',
        tags: ['loyal', 'banter'],
        governingStats: { loyalty: 0.6, charisma: 0.4 },
        outcomes: {
          bad: { text: 'You herd everyone into frame so selflessly you’re not actually in the photo. A lovely group shot of eleven people. You took it.', effects: { loyalty: 2, burnout: 2 } },
          good: { text: 'You get the shy ones front and centre and the photo’s all the better for it. Nobody remembers you organised it. The kindness is the point.', effects: { loyalty: 5, bond: 3, public: 3 } },
          incredible: { text: 'You direct the whole villa into one genuinely joyful frame and the warmth is the story, not the placement. Good-captain energy, caught on camera.', effects: { loyalty: 6, bond: 4, public: 4 } },
        },
      },
    },
  },
  {
    id: 'li_accent_divide', act: 1, tags: ['banter', 'chat'],
    art: 'li_terrace',
    context: 'Afternoon · the terrace · a translation problem',
    prompt: '“What d’you MEAN you call it a barm,” says {mate}, genuinely rattled. The villa has discovered it contains four regions and zero agreement on what to call a bread roll. It has escalated. There is now a whiteboard. Somebody’s drawn a map.',
    recap: 'A four-region war breaks out over what to call a bread roll.',
    choices: {
      left: {
        label: 'Defend your dialect',
        tags: ['banter', 'drama'],
        governingStats: { charisma: 0.7, rizz: 0.3 },
        outcomes: {
          bad: { text: 'You die on the hill of your regional bread word and the terrace unites, for once, against you. The whiteboard now has your name on it, circled.', effects: { charisma: 2, burnout: 3, public: -1 } },
          good: { text: 'You defend the barm with the passion of a war poet and the terrace splits into factions. You started this. You’re thrilled. So is the edit.', effects: { charisma: 5, followers: 4, public: 3 } },
          incredible: { text: 'Your bread-roll manifesto becomes villa lore and by nightfall everyone’s doing your accent, badly, with love. A nothing debate, turned into your bit.', effects: { charisma: 8, followers: 6, public: 4 } },
        },
      },
      right: {
        label: 'Play translator',
        tags: ['chat', 'strategy'],
        governingStats: { savvy: 0.6, charisma: 0.4 },
        outcomes: {
          bad: { text: 'You try to mediate the bread war and get accused, by all four regions, of betraying your own. Neutrality is a crime in a room this passionate.', effects: { savvy: 2, burnout: 3 } },
          good: { text: 'You translate between the factions till everyone’s laughing instead of fighting, and quietly become the person who gets everyone. Useful, that.', effects: { savvy: 5, bond: 3, public: 3 } },
          incredible: { text: 'You broker a bread-roll peace treaty and get the terrace teaching each other slang for an hour. Connector energy. The villa runs smoother with you in it.', effects: { savvy: 8, graft: 3, public: 4 } },
        },
      },
    },
  },
  {
    id: 'li_pool_lineup', act: 1, tags: ['loyal', 'strategy'],
    art: 'li_pool',
    context: 'Midday · the sun loungers · ruled by nobody, obeyed by all',
    prompt: 'The morning sunbathe has an unspoken seating chart nobody wrote down and everybody obeys. The spot beside {partner} is open today. So is the one beside {rival}, who’s patted it, once, without looking up. The lawn is watching the choice more than the sun.',
    recap: 'The sunbathe seating chart offers a spot by {partner} — and one by {rival}.',
    choices: {
      left: {
        label: 'Sit with {partner}',
        tags: ['loyal', 'flirt'],
        governingStats: { loyalty: 0.6, rizz: 0.4 },
        outcomes: {
          bad: { text: 'You cross the lawn to {partner} and misjudge the sunny gap, ending up in the shade of a parasol for two hours. Loyal, cold, faintly damp. Points for effort.', effects: { loyalty: 2, burnout: 2 } },
          good: { text: 'You take the spot by {partner} without a beat of hesitation and the lawn reads it loud. {rival}’s empty lounger says the rest.', effects: { loyalty: 5, bond: 4, public: 3 } },
          incredible: { text: 'You choose {partner} so plainly the whole seating chart reshuffles around your couple. {rival} sunbathes alone with a lot to think about.', effects: { loyalty: 8, bond: 5, public: 4 } },
        },
      },
      right: {
        label: 'Take the neutral middle',
        tags: ['strategy', 'rest'],
        governingStats: { savvy: 0.7, charisma: 0.3 },
        outcomes: {
          bad: { text: 'You take the neutral lounger to keep everyone happy and make both {partner} and {rival} think you’re playing them. Switzerland pleases no one today.', effects: { savvy: 2, burnout: 3, bond: -2 } },
          good: { text: 'You park in the middle, read the whole lawn from behind your sunglasses, and commit to nothing. Information gathered; options open. Tactical tanning.', effects: { savvy: 5, graft: 3 } },
          incredible: { text: 'From the neutral spot you clock every glance and alliance on the lawn without moving a muscle. You learned more sunbathing than most learn scheming.', effects: { savvy: 8, graft: 4, public: 3 } },
        },
      },
    },
  },
  {
    id: 'li_text_arrival_chaos', act: 1, tags: ['camera', 'strategy'],
    art: 'li_lawn',
    context: 'Afternoon · the lawn · a phone buzzes',
    prompt: 'A phone buzzes and the villa detonates. “I’VE GOT A TEXT!!” — the sacred shout, answered by a stampede of half-dressed Islanders abandoning drinks mid-sip. Nobody knows what it says yet. Everybody’s already braced for it to ruin their week.',
    recap: 'A phone buzzes and the villa stampedes for the sacred text shout.',
    choices: {
      left: {
        label: 'Read it for the room',
        tags: ['camera', 'drama'],
        governingStats: { charisma: 0.7, rizz: 0.3 },
        outcomes: {
          bad: { text: 'You grab the phone and fumble the big read, mangling the hashtag and killing the tension stone dead. The villa’s one ritual, and you dropped it.', effects: { charisma: 2, burnout: 3, public: -1 } },
          good: { text: 'You read it out with the timing of a game-show host, pausing before the twist. The lawn gasps on cue. You’re good at this. Suspiciously good.', effects: { charisma: 5, followers: 4, public: 3 } },
          incredible: { text: 'You milk the text read for every drop of drama and the villa hangs on your pause like it’s a season finale. A group announcement, elevated to theatre.', effects: { charisma: 8, followers: 6, public: 4 } },
        },
      },
      right: {
        label: 'Hang back and watch faces',
        tags: ['strategy', 'chat'],
        governingStats: { savvy: 0.7, charisma: 0.3 },
        outcomes: {
          bad: { text: 'You hang back to read the room and miss the actual text, then have to ask what it said. Now you’re the one out of the loop you tried to study.', effects: { savvy: 2, burnout: 2, public: -1 } },
          good: { text: 'While everyone reads the phone, you read the faces — who flinched, who lit up, who went pale. The text was the distraction. The reactions were the news.', effects: { savvy: 5, graft: 3 } },
          incredible: { text: 'You clock every micro-flinch during the read and walk away knowing exactly who’s scared of what’s coming. Best intel in the villa, gathered in ten seconds.', effects: { savvy: 8, graft: 4, public: 3 } },
        },
      },
    },
  },
];
