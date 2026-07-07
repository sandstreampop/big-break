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
    recap: 'Day four and {partner} already knows your coffee order by heart.',
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
    recap: 'Six a.m. on the roof — {mate}’s got your tea and a rare sincere streak.',
    choices: {
      left: {
        label: 'Stay till the sun’s up',
        tags: ['rest', 'chat'],
        governingStats: { loyalty: 0.5, savvy: 0.5 },
        outcomes: {
          bad: { text: 'You’re mid-sentence — something about your mum, the real version, not the audition one — when the garden mics crackle on. “Save it,” {mate} says gently. You bank it. Even the quiet here has a schedule.', effects: { loyalty: 2, burnout: -2 } },
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
    recap: '{rival} has ‘accidentally’ moved your towel onto the wobbly lounger.',
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
    recap: 'You’ve ended up with {partner}’s hoodie and no plans to give it back.',
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
    recap: '4 a.m., one lamp — {partner}’s up in the dark, can’t switch their head off.',
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
    prompt: 'The fire pit is doing its post-ceremony theatre — everyone laughing one notch too loud. Across the flames, {mate} catches your eye and mouths, “oi — where’s your head at?” The first person all night to actually ask.',
    recap: 'Post-ceremony firepit, everyone too loud — {mate} mouths ‘where’s your head?’',
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
    recap: 'Pegging out swimwear with {mate} when the hedge starts gossiping about you.',
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
    recap: 'Someone says ‘allegedly’ at dinner and {partner} clocks the inside joke.',
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
    recap: 'Dawn on the roof — {partner} wakes you for the villa’s last quiet sunrise.',
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
    recap: 'Final week — the suitcases come out and leaving suddenly feels real.',
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

  // ---------- Arrival — more small tending ----------
  {
    id: 'li_freezer_raid', act: 1, tags: ['chat', 'loyal'],
    art: 'li_kitchen',
    context: 'Midnight · the kitchen · the freezer light',
    prompt: 'The freezer light catches {partner} mid-crime, the season’s last Mini Milk halfway to their mouth. “There were two. I’m a giver,” they whisper, and break it in half on the counter edge, holding out the bigger piece.',
    recap: 'Midnight freezer raid — {partner} splits the villa’s last Mini Milk with you.',
    choices: {
      left: {
        label: 'Take the big half',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 0.6, rizz: 0.4 },
        outcomes: {
          bad: { text: 'You take it, feel weird about the size difference, swap them back, they swap back, and the Mini Milk melts to a stalemate on the counter while you both hold your ground.', effects: { loyalty: 2, burnout: 3 } },
          good: { text: 'You take the big half without ceremony, which is its own kind of trust. {partner} watches you eat it like they’ve learned something. Nobody splits the last one with an enemy.', effects: { loyalty: 5, bond: 4 } },
          incredible: { text: 'Next night there are two behind the ice tray with a Post-it: “ours.” A supply chain, established in secret. The villa’s smallest treaty, and its most binding one so far.', effects: { loyalty: 8, bond: 6, graft: 2 } },
        },
      },
      right: {
        label: 'Refuse. Watch them have it',
        tags: ['flirt', 'banter'],
        governingStats: { rizz: 0.6, charisma: 0.4 },
        outcomes: {
          bad: { text: '“I’m sweet enough,” you say, which is a line, and they know it’s a line, and it drips down their wrist through the pause you left a beat too long. You both pretend that was smooth.', effects: { rizz: 2, burnout: 3 } },
          good: { text: '“All yours.” {partner} eats the whole thing holding eye contact like a threat. The kitchen has never been this loud at zero decibels. Flirting via frozen dairy, a villa first.', effects: { rizz: 5, bond: 3, followers: 2 } },
          incredible: { text: 'You feed them the last bite off the stick and neither of you breathes. Somewhere a night-vision camera earns its budget. The clip is trending before the freezer door shuts.', effects: { rizz: 8, bond: 4, followers: 5, public: 3 } },
        },
      },
    },
  },
  {
    id: 'li_suncream_shoulders', act: 1, tags: ['chat', 'loyal'],
    art: 'li_pool',
    context: 'Noon · the pool · factor thirty diplomacy',
    prompt: '{partner} holds out the factor thirty without turning round. “You missed a bit yesterday and I peeled like a Twiglet. I’m trusting you with my shoulders.” The whole lawn is suddenly very interested in this administrative task.',
    recap: '{partner} trusts you with the factor thirty and their unreachable shoulders.',
    choices: {
      left: {
        label: 'Do it properly. No shortcuts',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 0.7, savvy: 0.3 },
        outcomes: {
          bad: { text: 'You go so thorough it becomes a massage it wasn’t billed as, {partner} makes a noise, and the lawn makes a noise about the noise. Factor thirty, factor drama.', effects: { loyalty: 2, burnout: 3 } },
          good: { text: 'You get every bit, including the shoulder blade they always miss. “Oh, you’re GOOD at this,” {partner} says, surprised, and files it under reasons. Sunscreen as a love language.', effects: { loyalty: 5, bond: 4 } },
          incredible: { text: 'You do it unasked all week after that. By Friday {partner} just presents their back to you, wordless, mid-conversation with someone else entirely. A whole routine, built from SPF.', effects: { loyalty: 8, bond: 6, public: 3 } },
        },
      },
      right: {
        label: 'Make a whole bit of it',
        tags: ['banter', 'camera'],
        governingStats: { charisma: 0.7, rizz: 0.3 },
        outcomes: {
          bad: { text: 'Your sunscreen commentary in a nature-documentary voice runs long, the lawn drifts, and you rub factor thirty into the same shoulder for a full minute. Over-basted.', effects: { charisma: 2, burnout: 3 } },
          good: { text: '“Here we observe the islander, protecting its mate.” The lawn cackles, {partner} corpses, and the bit lands better than the coverage does. A patch of shoulder burns anyway.', effects: { charisma: 5, followers: 3, public: 2 } },
          incredible: { text: 'The nature-doc bit gets its own segment by evening, everyone requesting narration. You become the villa’s official basting correspondent. {partner}’s shoulders remain, tragically, uneven.', effects: { charisma: 8, followers: 6, public: 4 } },
        },
      },
    },
  },
  {
    id: 'li_dish_duty', act: 1, tags: ['loyal', 'rest'],
    art: 'li_kitchen',
    context: 'After dinner · the sink · everyone else has scattered',
    prompt: 'Dinner’s done and the villa evaporates, leaving a mountain of plates and you. Then {partner} appears at the sink with a tea towel, unasked. “I wash, you dry. We don’t talk about who cooked.” Four days in, and someone’s volunteering for chores to stand next to you.',
    recap: 'Everyone scatters after dinner; {partner} volunteers for the washing-up beside you.',
    choices: {
      left: {
        label: 'Fall into the rhythm',
        tags: ['loyal', 'rest'],
        governingStats: { loyalty: 0.7, savvy: 0.3 },
        outcomes: {
          bad: { text: 'You get competitive about drying technique and a plate goes down in the friendly crossfire. It survives; the rhythm doesn’t. You finish the pile in slightly frosty silence.', effects: { loyalty: 2, burnout: 3 } },
          good: { text: 'Wash, pass, dry, stack — a two-person machine running on instinct, four days in. Twenty minutes of the most married you’ve felt over a chore. A date, cleverly disguised as cutlery.', effects: { loyalty: 5, bond: 5, burnout: -3 } },
          incredible: { text: 'You realise, elbow-deep in suds, that this is the bit you’d miss most — not the dates, the dishes. You say so. {partner} flicks water at you and, tellingly, doesn’t disagree.', effects: { loyalty: 8, bond: 7, burnout: -3 } },
        },
      },
      right: {
        label: 'Turn it into the after-party',
        tags: ['banter', 'camera'],
        governingStats: { charisma: 0.6, rizz: 0.4 },
        outcomes: {
          bad: { text: 'You crank the kitchen speaker and the washing-up disco peaks with a soap-sud incident and a lightly flooded floor. Production sends someone with a mop and a look.', effects: { charisma: 2, burnout: 3 } },
          good: { text: 'You two run the sink like a nightclub — bubbles, a sponge for a microphone, {partner} on backing vocals. The stragglers drift back in. The best room in the villa is the kitchen.', effects: { charisma: 5, bond: 3, followers: 3 } },
          incredible: { text: 'The sink disco becomes a villa institution, everyone queuing to dry just to be in it. You’ve made the worst chore the hottest ticket. Even the mop guy stays for a song.', effects: { charisma: 8, bond: 3, followers: 6, public: 2 } },
        },
      },
    },
  },
  {
    id: 'li_good_mirror', act: 1, tags: ['flirt', 'chat'],
    art: 'li_bedroom',
    context: 'Evening · the dressing room · the one mirror with good light',
    prompt: 'There is one mirror in the villa with forgiving light and everyone knows it. {partner} shuffles over to make room unasked. “Two-person mirror. We’re basically married.” You share the good light like a utility bill.',
    recap: 'You and {partner} share the villa’s one flattering mirror like a married couple.',
    choices: {
      left: {
        label: 'Get ready together, properly',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 0.6, rizz: 0.4 },
        outcomes: {
          bad: { text: 'You keep bumping elbows and apologising, apologising and bumping elbows, until getting ready takes twice as long and you both go out slightly damp and out of sync.', effects: { loyalty: 2, burnout: 3 } },
          good: { text: 'You fall into a rhythm — you do teeth while they do hair, swap, repeat. Domestic as anything. The good mirror has seen a lot of villa; it hasn’t seen this.', effects: { loyalty: 5, bond: 5 } },
          incredible: { text: '{partner} fixes the bit of your collar you can’t see, absent-mindedly, mid-sentence about someone else. The gesture of a person who’s stopped performing being with you.', effects: { loyalty: 8, bond: 7, graft: 2 } },
        },
      },
      right: {
        label: 'Do their eyeliner for them',
        tags: ['flirt', 'banter'],
        governingStats: { rizz: 0.6, charisma: 0.4 },
        outcomes: {
          bad: { text: 'You go in with the eyeliner and immediately understand why this is a licensed profession. {partner} ends up with one confident wing and one apology. They wear both out proudly.', effects: { rizz: 2, burnout: 3 } },
          good: { text: '“Look up. Don’t blink. Don’t — okay, breathe.” The concentration is its own flirtation, faces this close this long. You nail the wings. They nail the exit line: “do mine forever.”', effects: { rizz: 5, bond: 4, followers: 2 } },
          incredible: { text: 'Matching wings, matching smug, and a video of the steady-handed operation set to slow music. The nation decides you’re the couple who does each other’s makeup now. A brand is born.', effects: { rizz: 8, bond: 5, followers: 5, public: 3 } },
        },
      },
    },
  },
  {
    id: 'li_daybed_nap', act: 1, tags: ['rest', 'loyal'],
    art: 'li_daybed',
    context: 'Afternoon · the daybed · the heat wins',
    prompt: 'The afternoon heat has done what the producers couldn’t and shut everyone up. You’re half-asleep on the daybed when {partner} lands next to you, wordless, and shuts their eyes. “Not talking. Just here,” they mumble. The sun does the rest.',
    recap: 'The afternoon heat lands {partner} next to you on the daybed for a wordless nap.',
    choices: {
      left: {
        label: 'Let them sleep. Stay put',
        tags: ['rest', 'loyal'],
        governingStats: { loyalty: 0.7, savvy: 0.3 },
        outcomes: {
          bad: { text: 'You lie rigid being the perfect nap partner, don’t move a muscle for forty minutes, and wake with a dead arm and the exact posture of someone guarding a nap. Restful for one of you.', effects: { loyalty: 2, burnout: -2 } },
          good: { text: 'You both actually sleep, properly, in the daytime, which the villa makes near impossible. You wake first and just let the afternoon sit there. No agenda. Rare as anything.', effects: { loyalty: 5, bond: 4, burnout: -6 } },
          incredible: { text: 'You wake to find you’ve drifted into the exact same shape without planning it, {partner}’s hand loose in yours, both dead to the world. The nation captions the photo. You never saw it happen.', effects: { loyalty: 8, bond: 6, burnout: -7, public: 3 } },
        },
      },
      right: {
        label: 'Wake them for the pool',
        tags: ['banter', 'rest'],
        governingStats: { charisma: 0.5, rizz: 0.5 },
        outcomes: {
          bad: { text: 'You rouse them for a swim and get the full betrayed-cat face, and the mood you interrupted does not return. The daybed, once a sanctuary, is now a scene of your crime.', effects: { charisma: 2, burnout: 3 } },
          good: { text: '“Up. The pool’s better than the dream,” you promise, wrong but persuasive. {partner} groans, gets up, and admits the water was in fact better. Credit for a nap ruined well.', effects: { charisma: 5, bond: 3 } },
          incredible: { text: 'You bribe them awake with the promise of shade and a cold drink, and the lazy afternoon that follows — pool, ice, zero drama — becomes the edit’s idea of the dream couple. Effortless.', effects: { charisma: 8, bond: 4, followers: 3, public: 2 } },
        },
      },
    },
  },

  // ---------- The Turn — tending under pressure ----------
  {
    id: 'li_herb_planter', act: 2, tags: ['rest', 'loyal'],
    art: 'li_lawn',
    context: 'Afternoon · the herb planter nobody else waters',
    prompt: 'There’s a sad basil plant by the kitchen door that would be dead if you didn’t sneak it water. {partner} catches you at it with a stolen glass. “You’ve been keeping that alive? Better survival rate than half our couples.”',
    recap: '{partner} catches you secretly keeping the villa’s dying basil alive.',
    choices: {
      left: {
        label: 'Adopt the plant together',
        tags: ['loyal', 'rest'],
        governingStats: { loyalty: 0.5, savvy: 0.5 },
        outcomes: {
          bad: { text: 'You overwater it in a joint act of enthusiasm and the basil, having survived weeks of neglect, drowns in a weekend of love. A metaphor nobody asked the garden to provide.', effects: { loyalty: 2, burnout: 2 } },
          good: { text: 'You name it, agree a watering rota, and check on it together each morning like a shared pet. The basil thrives. So, quietly and off-camera, does the thing you’re not naming.', effects: { loyalty: 5, bond: 4, burnout: -3 } },
          incredible: { text: 'The basil ends the season the healthiest thing in the villa, and you tape care instructions to the planter for whoever’s next. {partner} reads them and goes quiet. It’s just a plant. It isn’t just a plant.', effects: { loyalty: 8, bond: 6, burnout: -4 } },
        },
      },
      right: {
        label: 'Turn it into a running bit',
        tags: ['banter', 'camera'],
        governingStats: { charisma: 0.6, rizz: 0.4 },
        outcomes: {
          bad: { text: 'You give the basil a backstory and a name, and the bit works until you forget to actually water it because you were doing the bit. The basil, unimpressed, wilts on schedule.', effects: { charisma: 2, burnout: 3 } },
          good: { text: 'The basil becomes “Kevin,” gets a birthday, and features in three separate Beach Huts. The villa rallies round a herb. Content from soil — the challenge budget weeps with relief.', effects: { charisma: 5, followers: 4, public: 2 } },
          incredible: { text: 'Kevin the basil gets a fan account, a storyline, and more airtime than Dev. You give a tearful update on his growth to camera. Somewhere a producer greenlights a spin-off nobody needs.', effects: { charisma: 8, followers: 7, public: 4 } },
        },
      },
    },
  },
  {
    id: 'li_villa_barber', act: 2, tags: ['loyal', 'chat'],
    art: 'li_terrace',
    context: 'Golden hour · the terrace · the villa’s unlicensed barber',
    prompt: 'You’ve become the villa’s de facto barber, and the terrace queue is three deep. {mate} sits down last, quietly. “Don’t make it weird, but you’re the only one I trust near my head. That’s a lot of trust to hand someone with clippers and no diploma.”',
    recap: '{mate} joins the queue for a haircut from the villa’s unlicensed barber.',
    choices: {
      left: {
        label: 'Do a careful, honest job',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 0.7, savvy: 0.3 },
        outcomes: {
          bad: { text: 'You take it slow and get it dead level, then {mate} moves at the crucial second and now there’s a notch. You style around it heroically. They’ll notice in a photo in about a week.', effects: { loyalty: 2, burnout: 3 } },
          good: { text: 'Twenty minutes, no phone, actual conversation while your hands are busy — the kind that only happens when nobody has to make eye contact. The haircut’s good. The chat’s better.', effects: { loyalty: 5, bond: 4, burnout: -2 } },
          incredible: { text: '{mate} looks in the mirror and goes quiet, and it isn’t about the fade. “First time someone’s looked after me in here,” they say, to the clippers, not to you. You just tidy the neckline.', effects: { loyalty: 8, bond: 6, graft: 2 } },
        },
      },
      right: {
        label: 'Run it as a proper salon',
        tags: ['banter', 'camera'],
        governingStats: { charisma: 0.6, savvy: 0.4 },
        outcomes: {
          bad: { text: 'You commit to the salon bit — robes, a fake receptionist, a tip jar — and the admin takes longer than the haircuts. The queue mutinies. The tip jar contains one grape.', effects: { charisma: 2, burnout: 3 } },
          good: { text: 'You do the full salon patter, gossip and all, and the terrace turns into the villa’s most honest room, because everyone talks in a barber’s chair. You leave knowing everything.', effects: { charisma: 5, savvy: 3, followers: 2 } },
          incredible: { text: 'The villa salon becomes appointment television — a waitlist, confessions mid-trim that make the edit. You’re a barber, a therapist, and an intelligence service. The clippers pay for themselves.', effects: { charisma: 8, savvy: 3, followers: 6, public: 3 } },
        },
      },
    },
  },
  {
    id: 'li_duvet_treaty', act: 2, tags: ['loyal', 'rest'],
    art: 'li_bedroom',
    context: 'Two a.m. · the shared bed · the nightly border dispute',
    prompt: 'You wake at two a.m. with no duvet and full evidence of who has it. {partner} is a cocoon. You tug; the cocoon tugs back, then sleepily mutters, “there’s a whole other side of the bed, you know.” You are already on the whole other side.',
    recap: 'Two a.m. and {partner} has stolen the entire duvet again.',
    choices: {
      left: {
        label: 'Negotiate the border. Whisper',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 0.6, rizz: 0.4 },
        outcomes: {
          bad: { text: 'You wake them properly to redraw the treaty and now you’re both up at two a.m. relitigating a duvet like a select committee. Nobody wins. It ends up on the floor, neutral territory.', effects: { loyalty: 2, burnout: 3 } },
          good: { text: 'You tug, they roll, and somewhere in the negotiation you end up sharing the middle instead of the sides. Border dispute resolved by merger. You both sleep better annexed.', effects: { loyalty: 5, bond: 5, burnout: -3 } },
          incredible: { text: 'They wake just enough to tuck the duvet back around YOU before taking any themselves, eyes shut the whole time. A reflex. You lie awake a while, quietly wrecked by a sleeping person.', effects: { loyalty: 8, bond: 7, burnout: -3 } },
        },
      },
      right: {
        label: 'Steal it all back. Petty',
        tags: ['banter', 'rest'],
        governingStats: { charisma: 0.5, savvy: 0.5 },
        outcomes: {
          bad: { text: 'You execute a full duvet coup and {partner}, dethroned, retaliates with cold feet applied directly to your spine. The bed becomes a demilitarised zone. Neither superpower sleeps.', effects: { charisma: 2, burnout: 4 } },
          good: { text: 'You reclaim the duvet with slow, criminal precision and {partner} wakes freezing and impressed. “Respect,” they mutter, and burrow into you instead of the duvet. Tactical warmth.', effects: { charisma: 5, bond: 4, burnout: -2 } },
          incredible: { text: 'The morning debrief of the Great Duvet War becomes the breakfast table’s favourite bit, told with military maps drawn in ketchup. A shared nemesis: the duvet. A shared bed: still shared.', effects: { charisma: 8, bond: 4, followers: 4 } },
        },
      },
    },
  },

  // ---------- Final Week — the tending, at altitude ----------
  {
    id: 'li_last_breakfast', act: 3, tags: ['rest', 'loyal'],
    art: 'li_kitchen',
    context: 'Final Week · the kitchen · the last big breakfast',
    prompt: '{partner} is doing the eggs the way they’ve done them every morning, and this morning that ordinary fact has weight. “Same as always. Don’t get emotional about eggs,” they say, plating up. You are, a bit, getting emotional about eggs.',
    recap: 'Final week — {partner} makes the same breakfast eggs, and it suddenly matters.',
    choices: {
      left: {
        label: 'Eat it like any morning',
        tags: ['rest', 'loyal'],
        governingStats: { loyalty: 0.7, savvy: 0.3 },
        outcomes: {
          bad: { text: 'You try to keep it a normal breakfast and your throat has other plans around the second bite. {partner} pretends not to see. The eggs, for the record, are perfect. That’s the problem.', effects: { loyalty: 2, burnout: 2 } },
          good: { text: 'You do the crossword you can’t finish, argue about a clue, let the toast go cold. One last ordinary morning, protected on purpose. Nothing happens. The best breakfast of the season.', effects: { loyalty: 5, bond: 5, burnout: -4 } },
          incredible: { text: 'You ask them to make the eggs the same way on the outside, first Sunday, and mean it as a plan not a line. {partner} says “deal” without looking up from the pan. A Sunday, booked in advance.', effects: { loyalty: 8, bond: 8, burnout: -3 } },
        },
      },
      right: {
        label: 'Say the soft thing out loud',
        tags: ['chat', 'date'],
        governingStats: { loyalty: 0.6, rizz: 0.4 },
        outcomes: {
          bad: { text: 'You reach for the big feeling over breakfast and it comes out as logistics — trains, postcodes, whose eggs. The romance gets buried under a timetable before the toast even pops.', effects: { loyalty: 2, burnout: 4 } },
          good: { text: '“I’m going to miss the eggs,” you say, meaning something enormous, and {partner} says “I know,” meaning it back. Two people saying it via breakfast. Villa dialect at its finest.', effects: { loyalty: 5, bond: 6, burnout: -2 } },
          incredible: { text: 'You say the actual sentence, no code, no eggs metaphor, and {partner} puts the spatula down to hear it properly. Some things you only get to say once in here, and you said it.', effects: { loyalty: 8, bond: 9, burnout: -3 } },
        },
      },
    },
  },
  {
    id: 'li_last_swim', act: 3, tags: ['rest', 'loyal'],
    art: 'li_pool',
    context: 'Final Week · midnight · the pool, lit blue, everyone else asleep',
    prompt: '“One last swim,” {partner} says, already climbing over the pool edge fully aware it’s freezing. “We never actually used this thing. Weeks of villa, and we sat NEXT to a pool.” They hold a hand out from the shallow end, shivering and grinning.',
    recap: 'Final week — {partner} coaxes you into the pool for one last midnight swim.',
    choices: {
      left: {
        label: 'Get in. Freeze together',
        tags: ['rest', 'loyal'],
        governingStats: { loyalty: 0.6, rizz: 0.4 },
        outcomes: {
          bad: { text: 'You get in and immediately regret it audibly, and the audible regret wakes the terrace, and now there’s an audience for what was supposed to be a private goodbye to a pool.', effects: { loyalty: 2, burnout: 3 } },
          good: { text: 'It’s freezing and stupid and you tread water talking rubbish until your teeth chatter. No camera worth the angle at this hour. Just two idiots and a pool they finally used.', effects: { loyalty: 5, bond: 5, burnout: -5 } },
          incredible: { text: 'You float on your backs looking at the one bit of sky the villa doesn’t light, not talking, and the whole loud season goes quiet a minute. You’ll remember the cold. You’ll mostly remember this.', effects: { loyalty: 8, bond: 8, burnout: -6 } },
        },
      },
      right: {
        label: 'Push them in first. Then jump',
        tags: ['banter', 'camera'],
        governingStats: { charisma: 0.6, rizz: 0.4 },
        outcomes: {
          bad: { text: 'You go for the cinematic push and slip on the wet tile, taking yourself into the deep end and {partner} into a laughing fit that definitely woke somebody. The dismount scored low.', effects: { charisma: 2, burnout: 3 } },
          good: { text: 'You bomb in beside them sending a wave over the loungers, and the splash and the shriek and the laughing is the least strategic thing you’ve done all season. Overdue.', effects: { charisma: 5, bond: 4, followers: 2 } },
          incredible: { text: 'The midnight bomb, the wave, the two of you surfacing laughing — a night camera catches all of it, unplanned and unbeatable. The season’s realest clip, filmed by accident at 1 a.m.', effects: { charisma: 8, bond: 5, followers: 5, public: 3 } },
        },
      },
    },
  },
];
