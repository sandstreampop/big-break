// The daily rhythm (v4 S2, ADR-0011) — the quiet days between the tentpoles.
// Hillevi's garden layer: iced coffees, 4 a.m. kitchens, borrowed hoodies —
// the small repeated tending that makes a Connection read as GROWN rather
// than bought. All ambient (no beat tags, no chains): these are the texture
// the week structure stretches out, so the peaks have something to peak over.
// Authored against the show-phase (1 Arrival · 2 The Turn · 3 Final Week);
// events.ts remaps phases to weeks. Voice: VOICE.md, dialogue-first.

import type { GameEvent } from '../../types.js';

export const DAY_EVENTS: GameEvent[] = [
  // ---------- Arrival — the tending starts ----------
  {
    id: 'li_iced_coffee', act: 1, tags: ['chat', 'loyal'],
    art: 'li_kitchen',
    context: 'Morning · the kitchen · day four',
    prompt: '{partner} slides an iced coffee across the counter before you’ve said a word. “Oat, no sugar. I listen.” Four days in, and somebody has learned your order.',
    choices: {
      left: {
        label: 'Take it. Let it land',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 0.7, savvy: 0.3 },
        outcomes: {
          bad: { text: 'You’re so busy playing it cool the coffee sweats a full ring into the counter. “It’s fine,” says {partner}, in the voice of someone filing that away.', effects: { loyalty: 2, burnout: 3 } },
          good: { text: 'You say nothing and drink it slowly, and {partner} pretends not to watch you drink it. The villa’s quietest transaction, and its realest one so far.', effects: { loyalty: 5, bond: 4 } },
          incredible: { text: 'Next morning there are two glasses out before either of you is awake enough to claim credit. A routine. The nation clocks it before you do.', effects: { loyalty: 8, bond: 6, public: 4 } },
        },
      },
      right: {
        label: '“Careful. I could get used to this”',
        tags: ['flirt', 'banter'],
        governingStats: { rizz: 0.6, charisma: 0.4 },
        outcomes: {
          bad: { text: '“Then get used to it,” {partner} says, too fast, and the kitchen goes quiet enough to hear the ice. You both laugh one beat late. The beat airs.', effects: { rizz: 2, burnout: 3 } },
          good: { text: '“Don’t threaten me with a good time,” says {partner}, and the whole counter suddenly needs wiping. Flirting before nine. Strong scenes.', effects: { rizz: 5, bond: 3, followers: 2 } },
          incredible: { text: 'The back-and-forth runs four rounds and ends with {partner} bowing out holding the blender for protection. The clip does numbers before lunch.', effects: { rizz: 8, bond: 4, followers: 5, public: 3 } },
        },
      },
    },
  },
  {
    id: 'li_sunrise_shift', act: 1, tags: ['rest', 'chat'],
    art: 'li_terrace',
    context: 'Six a.m. · the roof terrace · nobody else up',
    prompt: 'You’re awake first, which never happens. On the terrace, {mate} is already sitting with two teas, one of them yours. “Couldn’t sleep either. Don’t tell anyone I do sincerity.”',
    choices: {
      left: {
        label: 'Stay till the sun’s up',
        tags: ['rest', 'chat'],
        governingStats: { loyalty: 0.5, savvy: 0.5 },
        outcomes: {
          bad: { text: 'You’re mid-sentence about something true when the garden mics crackle on. “Save it,” {mate} says gently. You bank it instead. Even the quiet here has a schedule.', effects: { loyalty: 2, burnout: -2 } },
          good: { text: 'Twenty minutes, no cameras worth performing for, one conversation you’d have had in the real world. Your head files a complaint, then quietly drops it.', effects: { loyalty: 4, burnout: -6, graft: 2 } },
          incredible: { text: '“You’re alright, you know,” {mate} says at the exact moment the sun clears the wall, and the show can’t use any of it because nothing happened. Perfect.', effects: { loyalty: 6, burnout: -9, graft: 3 } },
        },
      },
      right: {
        label: 'Do the debrief instead',
        tags: ['strategy', 'chat'],
        governingStats: { savvy: 0.8, charisma: 0.2 },
        outcomes: {
          bad: { text: 'Your six a.m. read of the villa is forensic, ruthless — and delivered directly over a live mic pack. “Morning!” says a producer’s voice from nowhere.', effects: { savvy: 2, burnout: 4 } },
          good: { text: 'You map every couple in the villa over one tea. {mate} adds footnotes. By the time the others wake up, you two are the only people here with a plan.', effects: { savvy: 5, graft: 3 } },
          incredible: { text: '“Watch the new boy at breakfast,” {mate} says. You watch. It’s exactly as predicted, twice. The two of you clink mugs like analysts at full time.', effects: { savvy: 8, graft: 4, public: 3 } },
        },
      },
    },
  },
  {
    id: 'li_lounger_row', act: 1, tags: ['banter', 'drama'],
    art: 'li_lawn',
    context: 'Two p.m. · the lawn · the wobbly lounger',
    prompt: 'There is one wobbly sun lounger, and a rota for avoiding it that nobody wrote down but everybody knows. {rival} has just moved your towel onto it. “Oh — was that yours?”',
    choices: {
      left: {
        label: 'Laugh it off, loudly',
        tags: ['banter', 'camera'],
        governingStats: { charisma: 0.7, savvy: 0.3 },
        outcomes: {
          bad: { text: 'Your bit about the lounger’s tragic backstory runs long. The lawn drifts off to the pool mid-punchline, which is somehow worse than booing.', effects: { charisma: 2, burnout: 3 } },
          good: { text: 'You give the lounger a eulogy. “It wobbles because it has seen things.” The lawn cackles; {rival} has to laugh along at their own move. Point taken, no blood.', effects: { charisma: 5, public: 3, followers: 2 } },
          incredible: { text: 'By dinner the wobbly lounger has a name, a backstory, and a small cult. {rival}’s towel move is now the setup to YOUR running joke. Daylight robbery.', effects: { charisma: 8, public: 5, followers: 4, graft: 2 } },
        },
      },
      right: {
        label: 'Move the towel back. Hold eye contact',
        tags: ['drama', 'strategy'],
        governingStats: { savvy: 0.6, rizz: 0.4 },
        outcomes: {
          bad: { text: 'The towel goes back. So does theirs. Back. Theirs. Back. Fourteen seconds of silent laundry chess, and the villa watches all of it through sunglasses.', effects: { savvy: 2, burnout: 4 } },
          good: { text: '“All yours,” you say, placing their towel on the wobbler with hospital corners. {rival} sits on it out of pure stubbornness. It wobbles. Justice, at 2 p.m.', effects: { savvy: 5, public: 3 } },
          incredible: { text: 'You don’t say a word. You just straighten your towel and lie back, and the lawn quietly reclassifies you as someone not to try that on. {rival} recalculates.', effects: { savvy: 8, rizz: 3, public: 4 } },
        },
      },
    },
  },
  {
    id: 'li_hoodie_diplomacy', act: 1, tags: ['flirt', 'chat'],
    art: 'li_bedroom',
    context: 'Evening · the dressing room · exhibit A',
    prompt: 'It got cold on the terrace last night and now you own {partner}’s hoodie, in the sense that it is on your body and you have no plans. “Looks better on you,” they said. A trap, or a fact. Or both.',
    choices: {
      left: {
        label: 'Give it back washed, folded',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 0.8, savvy: 0.2 },
        outcomes: {
          bad: { text: 'You return it so promptly it reads as a verdict. “Right,” says {partner}, taking the world’s most politely rejected hoodie. You meant it nicely. It didn’t land nicely.', effects: { loyalty: 2, bond: -2, burnout: 3 } },
          good: { text: '“You washed it?” {partner} says, holding it like evidence of something. “Nobody washes it.” You have accidentally set a precedent and a standard.', effects: { loyalty: 5, bond: 4 } },
          incredible: { text: 'It comes back washed with a note in the pocket — one line, private, not for the cameras. {partner} reads it twice and doesn’t tell anyone. The villa hates a secret it can’t see.', effects: { loyalty: 8, bond: 7, graft: 2 } },
        },
      },
      right: {
        label: 'Wear it to breakfast',
        tags: ['flirt', 'camera'],
        governingStats: { rizz: 0.6, charisma: 0.4 },
        outcomes: {
          bad: { text: 'You wear it to breakfast the same morning {rival} decides breakfast needs commentary. “Cute. Whose is it again?” The table already knows. That’s the point of the question.', effects: { rizz: 2, burnout: 4 } },
          good: { text: 'You say nothing about it, which says everything about it. {partner} clocks it across the table and misses their mouth with the spoon. Breakfast television.', effects: { rizz: 5, bond: 4, followers: 3 } },
          incredible: { text: 'The hoodie becomes a headline. The nation screenshots the sleeve. Somewhere a merch intern opens a spreadsheet. {partner} has never looked so pleased to be robbed.', effects: { rizz: 8, bond: 5, followers: 6, public: 3 } },
        },
      },
    },
  },

  // ---------- The Turn — tending under pressure ----------
  {
    id: 'li_kitchen_4am', act: 2, tags: ['chat', 'rest'],
    art: 'li_kitchen',
    context: 'Four a.m. · the kitchen · one lamp on',
    prompt: 'You come down for water and {partner} is already there, sitting on the counter in the dark. “Couldn’t switch it off,” they say, tapping their temple. “Don’t make it a thing.”',
    choices: {
      left: {
        label: 'Make it a thing. Gently',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 0.6, rizz: 0.4 },
        outcomes: {
          bad: { text: 'You open with “talk to me” and {partner} closes like a shop. “I said don’t make it a thing.” You made it a thing. The fridge hums judgment until you both give up.', effects: { loyalty: 2, burnout: 4 } },
          good: { text: 'You don’t ask. You just get up on the counter next to them and wait. Third minute in, they start talking. Turns out the counter was the therapy all along.', effects: { loyalty: 5, bond: 5, burnout: -3 } },
          incredible: { text: 'At some point they stop mid-sentence and go, “why is this easy with you?” — and that, at 4 a.m., unmiked and unplanned, is the whole show. Nobody else will ever see it.', effects: { loyalty: 8, bond: 8, burnout: -4 } },
        },
      },
      right: {
        label: 'Make a toastie instead',
        tags: ['banter', 'rest'],
        governingStats: { charisma: 0.5, savvy: 0.5 },
        outcomes: {
          bad: { text: 'The smoke alarm has opinions about your toastie. Lights on, villa up, {mate} downstairs in a towel demanding names. The moment, whatever it was, is now a fire drill.', effects: { charisma: 2, burnout: 4 } },
          good: { text: 'You make two, cut them wrong on purpose, and argue about the cutting instead of the thing. By the last bite {partner}’s shoulders have come down an inch. Cheese, doing therapy’s job.', effects: { charisma: 5, bond: 4, burnout: -4 } },
          incredible: { text: '“You’re the only person here who’d feed me instead of interviewing me,” {partner} says, mouth full. The bar is on the floor and you have still, somehow, won the night.', effects: { charisma: 7, bond: 6, burnout: -6, graft: 2 } },
        },
      },
    },
  },
  {
    id: 'li_you_good', act: 2, tags: ['chat', 'code'],
    art: 'li_firepit',
    context: 'After the ceremony · the firepit · everyone performing fine-ness',
    prompt: 'The fire pit is doing its post-ceremony theatre — everyone laughing one notch too loud. Across the flames, {mate} catches your eye and mouths, “you good?” The first person all night to ask.',
    choices: {
      left: {
        label: 'Tell the truth. Quietly',
        tags: ['chat', 'rest'],
        governingStats: { loyalty: 0.6, savvy: 0.4 },
        outcomes: {
          bad: { text: 'You get one honest sentence out before the group descends mid-word, and you convert the feeling into a joke on the fly. {mate} clocks the swerve. “Later,” they mouth. Later never quite comes.', effects: { loyalty: 2, burnout: 2 } },
          good: { text: '“Honestly? No.” Two minutes by the fire, no performance, one person listening. It fixes nothing and helps enormously — the villa’s only genuine currency exchange.', effects: { loyalty: 5, burnout: -6, graft: 2 } },
          incredible: { text: '{mate} hears you out, nods once, and starts running interference — steering the loud ones away all night without being asked. Somewhere in here you acquired actual backup.', effects: { loyalty: 7, burnout: -8, graft: 3, public: 2 } },
        },
      },
      right: {
        label: '“All good.” Keep the mask on',
        tags: ['strategy', 'camera'],
        governingStats: { savvy: 0.7, charisma: 0.3 },
        outcomes: {
          bad: { text: '“All good,” you say, to the one person in the villa who can tell it isn’t. {mate} lets it go, visibly. The mask holds. The head, underneath it, does not.', effects: { savvy: 2, burnout: 5 } },
          good: { text: 'You keep it together and keep the group’s energy up, and the edit reads you as unbothered — which, at this stage of the season, is a currency of its own.', effects: { savvy: 5, public: 4, burnout: 2 } },
          incredible: { text: 'Your fine-ness is so convincing that two separate Islanders come to YOU for reassurance. You dispense wisdom you do not currently possess. The camera loves a rock.', effects: { savvy: 8, public: 5, followers: 3, burnout: 2 } },
        },
      },
    },
  },
  {
    id: 'li_washing_line', act: 2, tags: ['chat', 'strategy'],
    art: 'li_lawn',
    context: 'Mid-morning · the washing line · pegs and intelligence',
    prompt: 'You’re pegging out swimwear with {mate} when two voices drift over the hedge, discussing a couple that is not theirs. Yours, possibly. The pegging slows to surveillance speed.',
    choices: {
      left: {
        label: 'Keep pegging. Keep it',
        tags: ['strategy', 'code'],
        governingStats: { savvy: 0.8, loyalty: 0.2 },
        outcomes: {
          bad: { text: 'You lean so far into the hedge for the ending that you wear it. Two heads pop round the other side. “Alright?” Nothing to do now but compliment their laundry.', effects: { savvy: 2, burnout: 3 } },
          good: { text: 'You hear the whole thing, file it, and peg on like the hedge said nothing. {mate} raises an eyebrow; you raise one back. A full conversation, zero words, one asset.', effects: { savvy: 5, graft: 3 } },
          incredible: { text: 'Not only do you keep it — three days later it pays out, when someone tries a story on you that you already know ends differently. Your face doesn’t move. Theirs does.', effects: { savvy: 8, graft: 4, public: 3 } },
        },
      },
      right: {
        label: 'Report it to the daybeds',
        tags: ['drama', 'chat'],
        governingStats: { charisma: 0.6, savvy: 0.4 },
        outcomes: {
          bad: { text: 'Your retelling grows a detail in transit, the detail grows legs, and by dinner the story has your name on it as the source. The hedge, notably, stays anonymous.', effects: { charisma: 2, public: -2, burnout: 4 } },
          good: { text: 'You deliver the hedge report to the daybeds with full dramatic staging. The villa redistributes its attention accordingly. You are, briefly, the six o’clock news.', effects: { charisma: 5, followers: 4, public: 2 } },
          incredible: { text: 'Your performance of “the hedge, verbatim” — two voices, one peg as a prop — becomes the villa’s clip of the day. Journalism is dead; this is better.', effects: { charisma: 8, followers: 7, public: 4, burnout: 2 } },
        },
      },
    },
  },
  {
    id: 'li_inside_joke', act: 2, tags: ['date', 'loyal'],
    art: 'li_lawn',
    context: 'Dinner · the big table · callback incoming',
    prompt: 'Somebody at dinner says the word “allegedly” and {partner} catches your eye across the table, already fighting a grin — it’s the thing, from the thing, that only you two were there for.',
    choices: {
      left: {
        label: 'Keep it between you',
        tags: ['loyal', 'date'],
        governingStats: { loyalty: 0.6, rizz: 0.4 },
        outcomes: {
          bad: { text: 'You both lose it simultaneously into your drinks, and the table demands the joke. It doesn’t survive translation. “You had to be there” lands like a court summons.', effects: { loyalty: 2, bond: 2, burnout: 3 } },
          good: { text: 'One look, one bitten lip each, nothing said. The table moves on. Under it, {partner}’s foot finds yours — the joke continuing by other means.', effects: { loyalty: 5, bond: 6 } },
          incredible: { text: 'You don’t even smile. Neither do they. The restraint is so total it becomes its own inside joke, layered on the first. You are now two jokes deep in a private language.', effects: { loyalty: 8, bond: 8, graft: 2 } },
        },
      },
      right: {
        label: 'Play it for the table',
        tags: ['banter', 'camera'],
        governingStats: { charisma: 0.7, rizz: 0.3 },
        outcomes: {
          bad: { text: 'You tell the story. {partner} smiles with the front of their face. Some things are load-bearing precisely because they’re private, and you can hear this one crack.', effects: { charisma: 2, bond: -3, followers: 2 } },
          good: { text: 'You tell it well, {partner} jumps in for the ending, and the double act is so smooth the table starts a rumour you rehearsed it. A couple with BITS. Dangerous.', effects: { charisma: 5, bond: 3, followers: 4, public: 3 } },
          incredible: { text: 'The story kills, the callback kills harder, and “allegedly” enters the villa dictionary with you two credited as authors. The nation adopts it within the hour.', effects: { charisma: 8, bond: 3, followers: 7, public: 5 } },
        },
      },
    },
  },

  // ---------- Final Week — the tending, at altitude ----------
  {
    id: 'li_last_sunrise', act: 3, tags: ['rest', 'chat'],
    art: 'li_terrace',
    context: 'Dawn · the roof terrace · the last quiet one',
    prompt: '“Get up,” {partner} whispers, at an hour that is technically a crime. “It’s the last one where nobody knows anything yet.” The terrace, two blankets, a sky going from grey to gold over a villa that ends this week.',
    choices: {
      left: {
        label: 'Say nothing. Watch it',
        tags: ['rest', 'loyal'],
        governingStats: { loyalty: 0.7, savvy: 0.3 },
        outcomes: {
          bad: { text: 'You try to hold the silence and your brain holds a recoupling instead. {partner} watches the sunrise; you watch the maths. They notice. Of course they notice.', effects: { loyalty: 2, burnout: 3 } },
          good: { text: 'Neither of you says a word for twenty minutes, and it’s the best conversation you’ve had all week. Your head goes quiet on its own — no Beach Hut required.', effects: { loyalty: 5, bond: 5, burnout: -7 } },
          incredible: { text: 'Somewhere mid-sunrise their hand finds yours without either of you deciding it. Whatever the envelope says on Friday, this bit already happened. The nation never gets it.', effects: { loyalty: 8, bond: 8, burnout: -9 } },
        },
      },
      right: {
        label: '“So. Us. Out there.”',
        tags: ['chat', 'date'],
        governingStats: { rizz: 0.4, loyalty: 0.6 },
        outcomes: {
          bad: { text: 'You open the out-there conversation at dawn with no exits. Trains, distances, whose city. By full daylight you’ve invented four problems you didn’t have at sunrise.', effects: { loyalty: 2, burnout: 5 } },
          good: { text: '“I’m an hour on the train,” {partner} says, like they’ve checked. They’ve checked. You talk about the real world like it’s a place you’re actually going. Together, apparently.', effects: { loyalty: 5, bond: 6, burnout: -3 } },
          incredible: { text: 'They’ve already thought about the dog. Not a hypothetical dog — a breed, a name, a custody schedule for weekends. You laugh, then you don’t, because you’d also thought about the dog.', effects: { loyalty: 8, bond: 9, burnout: -4 } },
        },
      },
    },
  },
  {
    id: 'li_suitcase_tetris', act: 3, tags: ['chat', 'loyal'],
    art: 'li_bedroom',
    context: 'Final Week · the dressing room · suitcases out',
    prompt: 'The suitcases are out on the beds, which makes it real in a way no ceremony has. {mate} holds up a single orphaned flip-flop. “Whose IS this? It’s been here since week one. It has seniority.”',
    choices: {
      left: {
        label: 'Pack properly. Talk properly',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 0.6, savvy: 0.4 },
        outcomes: {
          bad: { text: 'Folding gets philosophical, philosophical gets teary, and you lose an hour to “remember week one” while your case sits empty. The flip-flop watches, unclaimed.', effects: { loyalty: 2, burnout: 3 } },
          good: { text: 'You fold, {mate} narrates, and the villa’s whole season gets sorted into keep, bin, and “burn before customs.” It’s an ending, done the manageable size.', effects: { loyalty: 5, burnout: -4, graft: 2 } },
          incredible: { text: 'At the bottom of your case: the note, the bracelet from the challenge, a Mini Milk wrapper you kept on purpose. {mate} looks over. “Don’t,” you say. You both do.', effects: { loyalty: 8, bond: 4, burnout: -5 } },
        },
      },
      right: {
        label: 'Stage a farewell fashion show',
        tags: ['banter', 'camera'],
        governingStats: { charisma: 0.7, rizz: 0.3 },
        outcomes: {
          bad: { text: 'The farewell runway peaks early when you go over on a heel that isn’t yours. The fall airs in slow motion. Twice. The physio has opinions about Final Week.', effects: { charisma: 2, burnout: 4, followers: 2 } },
          good: { text: 'Everyone models the season’s worst purchases. {mate} commentates in a towel turban. It’s the hardest the villa has laughed since the wobbly lounger, and it needed it.', effects: { charisma: 5, followers: 4, public: 3 } },
          incredible: { text: 'The finale look is the orphaned flip-flop, worn as a hat. The villa gives it a standing ovation and a name. Production quietly adds it to the tour of the villa.', effects: { charisma: 8, followers: 7, public: 4, graft: 2 } },
        },
      },
    },
  },
];
