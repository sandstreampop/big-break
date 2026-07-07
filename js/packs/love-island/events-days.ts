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
          incredible: { text: 'You feed them the last bite off the stick and neither of you breathes. The freezer door swings shut on its own, quietly appalled. The clip is trending before it clicks.', effects: { rizz: 8, bond: 4, followers: 5, public: 3 } },
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
          incredible: { text: 'Matching wings, matching smug, and a video of the steady-handed operation set to slow music. By lunch three other couples are attempting it and one has drawn a wing halfway up a forehead.', effects: { rizz: 8, bond: 5, followers: 5, public: 3 } },
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
          incredible: { text: 'You wake to find you’ve drifted into the exact same shape without planning it, {partner}’s hand loose in yours, both dead to the world. Someone’s drawn a moustache on you in eyeliner. Worth it.', effects: { loyalty: 8, bond: 6, burnout: -7, public: 3 } },
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
          good: { text: 'It’s freezing and stupid and you tread water talking rubbish until your teeth chatter. No camera worth the angle at this hour. Weeks sat beside this pool, and you finally get in the night before you leave.', effects: { loyalty: 5, bond: 5, burnout: -5 } },
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

  // ---------- v5: more daily texture (novel villa micro-moments) ----------
  {
    id: 'li_shared_wardrobe', act: 1, tags: ['flirt', 'banter'],
    art: 'li_bedroom',
    context: 'Morning · the dressing room · the communal clothing economy',
    prompt: 'Nobody in this villa owns their own clothes anymore. Your shorts are on {rival}, {mate}’s in your shirt, and {partner} is wearing something of yours with the tags of ownership long surrendered. “It’s giving me,” {partner} says, doing a twirl. It is, in fairness, giving them.',
    recap: 'The villa’s clothes have gone communal and {partner}’s in yours.',
    choices: {
      left: {
        label: 'Let them keep it',
        tags: ['loyal', 'flirt'],
        governingStats: { loyalty: 0.5, rizz: 0.5 },
        outcomes: {
          bad: { text: 'You gift the shirt with a flourish and it becomes {partner}’s favourite thing, worn constantly, meaning you never see it again. Generosity has a cost and the cost is laundry.', effects: { loyalty: 2, bond: 2, burnout: 2 } },
          good: { text: '“Keep it. Looks better on you anyway.” {partner} beams and doesn’t take it off for two days. Your wardrobe is a love language now, and you’re not getting it back.', effects: { loyalty: 5, bond: 4, rizz: 2 } },
          incredible: { text: 'You start a proper swap — their hoodie for your shirt, terms and all. By dinner the whole villa’s wearing each other and the group photo looks like a very confused family reunion.', effects: { loyalty: 6, bond: 5, rizz: 3, followers: 2 } },
        },
      },
      right: {
        label: 'Reclaim your wardrobe',
        tags: ['banter', 'camera'],
        governingStats: { charisma: 0.6, savvy: 0.4 },
        outcomes: {
          bad: { text: 'You mount a recovery operation and get caught mid-drawer by {rival}, who christens you “the villa laundry police.” The nickname sticks harder than the shirt ever did.', effects: { charisma: 2, burnout: 3 } },
          good: { text: 'You stage a full inventory audit, reading out garments like a court clerk. The villa surrenders your things one guilty item at a time. Order, briefly, restored.', effects: { charisma: 5, savvy: 2, followers: 2 } },
          incredible: { text: 'Your wardrobe audit — “and WHOSE is this” held aloft like evidence — becomes the morning’s clip. You get your clothes back AND the segment. Rare double.', effects: { charisma: 8, followers: 5, public: 3 } },
        },
      },
    },
  },
  {
    id: 'li_food_shop', act: 2, tags: ['banter', 'strategy'],
    art: 'li_kitchen',
    context: 'Morning · the kitchen · the food order is due',
    prompt: 'The weekly shop order is a democracy and, like all democracies, a disaster. The shared list already reads: “12 avocados (WHO), protein only, one (1) grape, chilli con carne but make it healthy.” {mate} hands you the pen. “You’re sensible. Sort it before {rival} adds more oat milk than the villa can physically drink.”',
    recap: 'The villa’s food order is chaos and {mate} hands you the pen.',
    choices: {
      left: {
        label: 'Impose order',
        tags: ['strategy', 'code'],
        governingStats: { savvy: 0.7, charisma: 0.3 },
        outcomes: {
          bad: { text: 'You draft a rational, balanced order and the villa mutinies over the removal of the twelve avocados. “Those are ASPIRATIONAL,” says someone. Democracy defeats sense, as ever.', effects: { savvy: 2, burnout: 3 } },
          good: { text: 'You wrangle the list into something a human could cook, quietly leaving one absurd item in as a peace offering. The villa eats properly all week and never knows who saved them.', effects: { savvy: 5, graft: 3 } },
          incredible: { text: 'You run the shop like a hostage negotiation and come out with a balanced order, a fed villa, and everyone thinking it was their idea. Nobody thanks the person who does the admin. You do it anyway.', effects: { savvy: 8, graft: 4, public: 2 } },
        },
      },
      right: {
        label: 'Add the most chaotic thing possible',
        tags: ['banter', 'camera'],
        governingStats: { charisma: 0.7, rizz: 0.3 },
        outcomes: {
          bad: { text: 'Your novelty order — a catering tub of squirty cream, nothing else useful — is funny for exactly one meal, after which the hungry villa remembers you did this. Comedy has a shelf life. So does cream.', effects: { charisma: 2, burnout: 3, followers: 2 } },
          good: { text: 'You slip in one gloriously stupid item — a two-metre inflatable, a wheel of the wrong cheese — and it becomes the week’s best running joke. The villa eats badly and laughs well.', effects: { charisma: 5, followers: 4 } },
          incredible: { text: 'Your chaos order arrives and the mystery item — a piñata, a kazoo, forty limes — kicks off the best unplanned afternoon of the season. Production films all of it. Malnutrition, but make it content.', effects: { charisma: 8, followers: 6, public: 3 } },
        },
      },
    },
  },
  {
    id: 'li_aux_wars', act: 1, tags: ['banter', 'camera'],
    art: 'li_kitchen',
    context: 'Afternoon · the kitchen · one speaker, one aux, one throne',
    prompt: 'There is one Bluetooth speaker in this villa and it is, functionally, a throne. Whoever holds the aux holds the kitchen. Right now it’s {rival}, playing something with no chorus and a lot of opinions about itself, and the room is quietly dying. Your phone is in your pocket. Your playlist is a weapon.',
    recap: '{rival} has seized the villa speaker and the kitchen is dying of it.',
    choices: {
      left: {
        label: 'Stage a coup',
        tags: ['banter', 'camera'],
        governingStats: { charisma: 0.6, savvy: 0.4 },
        outcomes: {
          bad: { text: 'You seize the aux and open with a song so divisive the kitchen empties in twelve seconds. Turns out the throne comes with a mob. {rival} reclaims it, smug, to silence.', effects: { charisma: 2, burnout: 3 } },
          good: { text: 'You wait for {rival}’s track to end and drop one everyone knows. The kitchen fills, the washing-up speeds up, and the aux is yours by public demand. Bloodless coup.', effects: { charisma: 5, public: 3, followers: 2 } },
          incredible: { text: 'You build a set that has the whole villa cooking and dancing, and by the second song nobody remembers {rival} ever held the aux. That’s not music taste. That’s governance.', effects: { charisma: 8, public: 5, followers: 4 } },
        },
      },
      right: {
        label: 'Let them have the throne',
        tags: ['rest', 'strategy'],
        governingStats: { savvy: 0.6, charisma: 0.4 },
        outcomes: {
          bad: { text: 'You cede the aux for peace and spend the afternoon hostage to {rival}’s chorus-free deep cuts. Peace has a soundtrack and the soundtrack is punishing you specifically.', effects: { savvy: 2, burnout: 3 } },
          good: { text: 'You let {rival} DJ into an empty kitchen and take your actual friends to the good loungers with a portable speaker and a better vibe. The party follows the host, not the throne.', effects: { savvy: 5, followers: 2, burnout: -2 } },
          incredible: { text: 'You do nothing, and one by one the villa drifts from {rival}’s dead kitchen to wherever you are. By dusk you’re holding court with no speaker at all. The aux was never the power. You were.', effects: { savvy: 8, public: 3, followers: 3 } },
        },
      },
    },
  },
  {
    id: 'li_sunburn_aid', act: 1, tags: ['loyal', 'chat'],
    art: 'li_bedroom',
    context: 'Evening · the bedroom · {mate} is the colour of the firepit',
    prompt: '{mate} fell asleep by the pool at midday and is now, medically, a tomato. “I’m FINE,” they insist, wincing as the aloe touches a shoulder that has clearly filed a formal complaint. “I tan, I don’t burn.” They are burning. They have always been burning.',
    recap: '{mate} has caught a catastrophic sunburn and won’t admit it.',
    choices: {
      left: {
        label: 'Do the aftercare properly',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 0.7, savvy: 0.3 },
        outcomes: {
          bad: { text: 'You slather on so much aloe {mate} slides off the daybed. Care delivered; dignity not. They squeak away, greased, to reconsider the friendship.', effects: { loyalty: 2, burnout: 2 } },
          good: { text: 'You do the shoulders, the neck, the bit they can’t reach, no fuss. {mate} goes quiet. “Nobody’s done that since my mum.” In here, that’s the whole speech.', effects: { loyalty: 5, bond: 3, graft: 2 } },
          incredible: { text: 'You run full triage — aloe, water, shade, the good after-sun you were saving — and {mate} recovers by morning genuinely moved. A favour and a friend, for the price of some lotion.', effects: { loyalty: 8, graft: 4, public: 2 } },
        },
      },
      right: {
        label: 'Roast them mercilessly',
        tags: ['banter', 'camera'],
        governingStats: { charisma: 0.7, rizz: 0.3 },
        outcomes: {
          bad: { text: 'Your tomato material runs long and {mate}, peeling and raw, stops finding it funny somewhere around the fourth tan-line joke. Read the burn, and the room.', effects: { charisma: 2, burnout: 2 } },
          good: { text: 'You christen them “Lobster” and it takes instantly. {mate} wears it well, mostly because turning to protest hurts too much. The kindest cruelty in the villa.', effects: { charisma: 5, followers: 3 } },
          incredible: { text: 'You do five minutes on the tan lines — “you’ve got a watch you’re not wearing” — and {mate} laughs so hard they hurt themselves further. The clip is a public-health advert by morning.', effects: { charisma: 8, followers: 5, public: 2 } },
        },
      },
    },
  },
  {
    id: 'li_lost_ring', act: 2, tags: ['chat', 'loyal'],
    art: 'li_lawn',
    context: 'Afternoon · the whole lawn on its knees · a search party',
    prompt: '{partner} has lost the ring — not THE ring, a ring, their nan’s, the one thing from home they weren’t meant to bring and did. The whole villa is now crawling the lawn in a grid. “It’s fine,” {partner} says, in the voice of someone for whom it is very much not fine.',
    recap: '{partner} has lost their nan’s ring and the villa mounts a search.',
    choices: {
      left: {
        label: 'Lead the search, calmly',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 0.7, savvy: 0.3 },
        outcomes: {
          bad: { text: 'You organise a grid search so thoroughly it becomes about the system, not the ring. Two hours later: no ring, one excellent map of the lawn. {partner} appreciates the effort more than the result.', effects: { loyalty: 3, burnout: 3 } },
          good: { text: 'You keep {partner} calm and the search methodical, and it’s you who spots it — in the plughole of the outdoor shower, saved by a hair. {partner} nearly takes your arm off hugging you.', effects: { loyalty: 6, bond: 5 } },
          incredible: { text: 'You find the ring, clean it, and slide it back onto {partner}’s finger yourself, no words. They look at you like you’ve just done something you can’t take back. Maybe you have.', effects: { loyalty: 8, bond: 7, romantics: 2 } },
        },
      },
      right: {
        label: 'Comfort them, forget the ring',
        tags: ['loyal', 'rest'],
        governingStats: { loyalty: 0.6, rizz: 0.4 },
        outcomes: {
          bad: { text: 'You tell {partner} “it’s just a ring” and watch the exact moment that was the wrong sentence land on their face. It was not just a ring. Recover, fast.', effects: { loyalty: 2, bond: -2, burnout: 3 } },
          good: { text: '“The ring matters ’cause she matters,” you say, “so we’ll find it — but you’re not in trouble.” {partner} exhales. They needed permission to be upset more than they needed the ring.', effects: { loyalty: 5, bond: 5 } },
          incredible: { text: 'You sit {partner} down while the others search and get them talking about their nan — the real stuff — till the panic passes. The ring turns up in a trainer. The conversation was what got found.', effects: { loyalty: 8, bond: 6, romantics: 2 } },
        },
      },
    },
  },
  {
    id: 'li_firepit_wish', act: 3, tags: ['rest', 'loyal'],
    art: 'li_firepit',
    context: 'Final Week · the firepit · the last-night ritual',
    prompt: 'The villa’s invented a ritual for the last quiet night: everyone writes one thing on a scrap of paper — a wish, a regret, a thank-you — and reads it, or doesn’t, before it goes in the fire. {partner} is folding theirs very small. {mate} is pretending they’ve got something in their eye. Your turn is coming round the circle.',
    recap: 'The villa’s last-night firepit ritual reaches you: read it, or burn it.',
    choices: {
      left: {
        label: 'Read yours out',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 0.6, rizz: 0.4 },
        outcomes: {
          bad: { text: 'You reach for a joke to cut the tension and it lands wrong in a circle that came to be sincere. The paper goes in the fire; so does the moment. You misread the one night that asked for honesty.', effects: { loyalty: 2, burnout: 2 } },
          good: { text: 'You read the true thing — short, unshowy, meant — and the firepit goes quiet in the good way. {partner} finds your hand. Some sentences only work said out loud once, then burned.', effects: { loyalty: 5, bond: 5, romantics: 1 } },
          incredible: { text: 'You read a line so plainly true the whole circle feels it, then feed it to the fire without waiting for a reaction. {partner} unfolds their tiny paper and reads theirs back. It’s about you. The fire gets the rest.', effects: { loyalty: 8, bond: 7, romantics: 2 } },
        },
      },
      right: {
        label: 'Burn it unread',
        tags: ['rest', 'loyal'],
        governingStats: { loyalty: 0.7, savvy: 0.3 },
        outcomes: {
          bad: { text: 'You bottle it and toss the paper in fast, and {partner} clocks the flinch. “You could’ve said it,” they murmur. The fire ate a sentence they’d have liked to hear. Missed, narrowly.', effects: { loyalty: 2, bond: -2, burnout: 2 } },
          good: { text: 'You keep yours private and let the fire have it unread — some things are for you, not the circle. {partner} respects it, and says theirs was “basically your name anyway.” You didn’t need the paper.', effects: { loyalty: 5, bond: 5 } },
          incredible: { text: 'You burn yours unread, then lean over and say the actual thing to {partner} alone, off to the side, no circle, no cameras worth it. The ritual was public. This wasn’t. This was the real one.', effects: { loyalty: 8, bond: 7, romantics: 2, burnout: -2 } },
        },
      },
    },
  },
  {
    id: 'li_dawn_bootcamp', act: 1, tags: ['rest', 'banter'],
    art: 'li_lawn',
    context: 'Seven a.m. · the lawn · {rival} has whistled',
    prompt: '{rival} has appointed themselves the villa’s personal trainer and whistled everyone onto the lawn for “bootcamp,” which is squats and shouting. A hierarchy forms instantly: the keen, the hungover, and you, holding a coffee like a shield. “No cups on my lawn,” barks {rival}.',
    recap: '{rival} has whistled the villa into a 7 a.m. bootcamp.',
    choices: {
      left: {
        label: 'Out-drill the drill sergeant',
        tags: ['banter', 'camera'],
        governingStats: { charisma: 0.6, rizz: 0.4 },
        outcomes: {
          bad: { text: 'You go too hard to show off and pull something in front of everyone. Now {rival}’s bootcamp has a casualty and a cautionary tale, and it’s you. On the floor. Groaning.', effects: { charisma: 2, burnout: 4 } },
          good: { text: 'You match {rival} rep for rep with a commentary that has the hungover crowd howling. Bootcamp becomes your show. {rival} blows the whistle harder, which only helps.', effects: { charisma: 5, followers: 3, rizz: 2 } },
          incredible: { text: 'You stage a mutiny mid-squat, lead a breakaway “gentle stretching and gossip” faction, and by half seven you’ve got the bigger class. A fitness coup. Nobody did a push-up. Everyone won.', effects: { charisma: 8, followers: 5, public: 3 } },
        },
      },
      right: {
        label: 'Protect the coffee, opt out',
        tags: ['rest', 'strategy'],
        governingStats: { savvy: 0.6, charisma: 0.4 },
        outcomes: {
          bad: { text: 'You refuse so visibly that {rival} makes an example of you, and you spend bootcamp doing burpees as punishment while the coffee, abandoned, goes cold. Both battles: lost.', effects: { savvy: 2, burnout: 3 } },
          good: { text: 'You sit the whole thing out with your coffee and your dignity, narrating {rival}’s form to {mate} under your breath. Some mornings the strong move is the deckchair.', effects: { savvy: 5, burnout: -2, followers: 2 } },
          incredible: { text: 'You do nothing, beautifully, and the class defects to your deckchair one gasping recruit at a time. {rival} finishes bootcamp alone. You finish your coffee. The lawn has spoken.', effects: { savvy: 8, burnout: -2, followers: 4, public: 2 } },
        },
      },
    },
  },
  {
    id: 'li_letter_home', act: 2, tags: ['chat', 'rest'],
    art: 'li_daybed',
    context: 'Afternoon · the daybed · a rare envelope',
    prompt: 'Production doesn’t do letters from home often — it’s a nuclear option, saved for when the villa needs a cry. Today there’s one, and it’s for you. {partner} watches you turn it over, not opening it. “You don’t have to read it out,” they say. Everyone, very obviously, wants you to read it out.',
    recap: 'A rare letter from home arrives — and the villa wants it read aloud.',
    choices: {
      left: {
        label: 'Read it to the villa',
        tags: ['chat', 'camera'],
        governingStats: { charisma: 0.5, loyalty: 0.5 },
        outcomes: {
          bad: { text: 'You read it aloud and your voice goes at “your nan says,” and now the whole villa’s gone, and so have you, on camera, in HD. Cathartic. Also entirely un-editable. Production is thrilled.', effects: { charisma: 2, public: 3, burnout: 3 } },
          good: { text: 'You read it out and let the villa cry with you — the nan, the dog, the “we’re so proud.” Shared, it’s lighter. The nation clips the good bit and captions it kindly, for once.', effects: { charisma: 5, public: 4, bond: 2 } },
          incredible: { text: 'You read it beautifully, land the funny line your dad snuck in, and turn a private letter into the villa’s best communal cry of the season. Everyone needed it. You gave it to them.', effects: { charisma: 8, public: 6, followers: 3 } },
        },
      },
      right: {
        label: 'Read it alone with {partner}',
        tags: ['loyal', 'rest'],
        governingStats: { loyalty: 0.7, rizz: 0.3 },
        outcomes: {
          bad: { text: 'You take it somewhere private and {partner} hovers, unsure whether to stay, and the moment goes logistical. “Do you want me here or not?” Fair question. You should’ve answered it first.', effects: { loyalty: 2, burnout: 2 } },
          good: { text: 'You read it just to {partner}, and letting them hear your nan’s handwriting is its own kind of introduction. “She sounds ace,” they say. “She’d love you,” you say, before you clock what you said.', effects: { loyalty: 5, bond: 5, romantics: 1 } },
          incredible: { text: 'You read it to {partner} alone and, at the end, they’re crying harder than you are — for people they’ve never met, because they’re yours. Home came to the villa, and {partner} was already part of it.', effects: { loyalty: 8, bond: 7, romantics: 2 } },
        },
      },
    },
  },

  // ---------- Final doubling pass · more fresh ambient texture (open cards) ----------
  // Novel villa micro-rhythms across the phases, occupying situations the rest
  // of the deck doesn’t: an accidental matching-outfit day, the 3 a.m. fire-drill,
  // a food-portion injustice, the breakfast wasp, a power cut, and signing the
  // villa beam for whoever’s here next summer.
  {
    id: 'li_matching_outfits', act: 1, tags: ['flirt', 'camera'],
    art: 'li_kitchen',
    context: 'Morning · the kitchen · a coincidence in colour',
    prompt: 'You come down for breakfast in the exact same colour as {partner}. Neither of you planned it. “We look like we did a briefing,” {partner} says, delighted and faintly appalled. Across the kitchen {rival} mouths “matching” and mimes being sick. The villa has clocked it.',
    recap: 'You and {partner} turn up to breakfast in accidentally matching colours.',
    choices: {
      left: {
        label: 'Lean all the way in',
        tags: ['flirt', 'camera'],
        governingStats: { rizz: 0.6, charisma: 0.4 },
        outcomes: {
          bad: { text: 'You commit to the matching bit and it curdles into a couples’-costume energy nobody asked for. By lunch even {partner} looks a bit embarrassed. “Maybe we retire the theme.” Maybe you do.', effects: { rizz: 2, burnout: 2 } },
          good: { text: 'You own it — matching all day, straight-faced, like it’s policy. The villa can’t decide if it’s sweet or a threat. {partner} keeps catching your eye across rooms, grinning like a fool.', effects: { rizz: 5, bond: 4, followers: 2 } },
          incredible: { text: 'You go so all-in on coordinating that by evening three other couples have accidentally colour-matched too. You’ve started a villa-wide uniform. {partner} calls it “our finest work.”', effects: { rizz: 8, bond: 5, followers: 5, public: 3 } },
        },
      },
      right: {
        label: 'One of you change',
        tags: ['banter', 'chat'],
        governingStats: { charisma: 0.5, savvy: 0.5 },
        outcomes: {
          bad: { text: 'You go to change and take so long the moment’s gone, then come back in a colour that clashes with {partner}’s. Now you look like a statement. You are not a statement.', effects: { charisma: 2, burnout: 2 } },
          good: { text: '“One of us has to have dignity,” you say, changing. {partner} refuses, wears the colour proudly all day, alone. Somehow they win the bit by losing it. Respect.', effects: { charisma: 5, bond: 3 } },
          incredible: { text: 'You change three times and somehow keep landing on {partner}’s exact colour each go, like the villa’s laundry is conspiring. You give up, matching, defeated and delighted. The breakfast everyone screenshots.', effects: { charisma: 8, bond: 4, followers: 4, public: 2 } },
        },
      },
    },
  },
  {
    id: 'li_night_fire_drill', act: 2, tags: ['banter', 'chat'],
    art: 'li_lawn',
    context: 'Three a.m. · the lawn · a drill nobody warned about',
    prompt: 'Three a.m. A siren nobody’s heard before, then a producer’s voice, flat as ever: “Islanders, evacuate to the lawn. This is a drill.” Nine people on the grass in mismatched pyjamas and eye masks, blinking. “A DRILL,” someone repeats, betrayed. {partner} finds your hand in the dark. “If this were real I’d have grabbed the wrong shoes,” they whisper.',
    recap: 'A 3 a.m. fire-drill turns the whole villa out onto the lawn in their pyjamas.',
    choices: {
      left: {
        label: 'Turn it into a laugh',
        tags: ['banter', 'camera'],
        governingStats: { charisma: 0.6, rizz: 0.4 },
        outcomes: {
          bad: { text: 'You do a bit about the villa’s fire-safety budget, but it’s three a.m. and nobody’s laughing and you’re asked to “return to your marks.” Even your material needs a lie-down.', effects: { charisma: 2, burnout: 3 } },
          good: { text: 'You get the shivering lawn giggling — a roll-call of who grabbed what, the eye masks, the one person who brought a drink out. The drill becomes the funniest ten minutes of the week.', effects: { charisma: 5, followers: 3, public: 2 } },
          incredible: { text: 'By the time they let you back in, the fire-drill’s a full villa legend with catchphrases and a re-enactment planned. You made a 3 a.m. inconvenience the thing everyone quotes for days.', effects: { charisma: 8, followers: 5, public: 3 } },
        },
      },
      right: {
        label: 'Clock who you grabbed for',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 0.6, savvy: 0.4 },
        outcomes: {
          bad: { text: 'In the scramble you grabbed for {partner} on instinct, and now you spend the whole shivering drill overthinking what that means. They noticed. You noticed them noticing. Long lawn.', effects: { loyalty: 2, burnout: 3 } },
          good: { text: 'You clock it the second the siren went: you reached for {partner} before you were even properly awake. So did they. Neither says it out on the lawn. Both bank it, hard.', effects: { loyalty: 5, bond: 5 } },
          incredible: { text: 'Half-asleep, you’d checked {partner} was up before yourself — reflex, not decision. On the dark lawn they quietly admit they did the exact same. The drill turned up something real by accident.', effects: { loyalty: 8, bond: 7, public: 2 } },
        },
      },
    },
  },
  {
    id: 'li_portion_justice', act: 2, tags: ['banter', 'chat'],
    art: 'li_kitchen',
    context: 'Dinner · the big table · an uneven plate',
    prompt: 'Dinner’s served and the injustice is immediate: the portions are not equal and everyone can see it. {mate} stares at their plate, then yours, then back. “How’ve you got two sausages? I’ve got one sausage and a look of betrayal.” Around the table, quiet audits begin. This is how villa wars actually start. Over a sausage.',
    recap: 'Uneven dinner portions threaten to start a villa war at the big table.',
    choices: {
      left: {
        label: 'Redistribute, keep the peace',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 0.6, charisma: 0.4 },
        outcomes: {
          bad: { text: 'You start reallocating sausages and open a negotiation that outlasts the meal. By the time it’s fair, everything’s cold and three people are quietly furious. Diplomacy: expensive.', effects: { loyalty: 2, burnout: 2 } },
          good: { text: 'You halve your extra sausage onto {mate}’s plate without ceremony, and the table exhales. Tiny gesture, big read: the villa clocks who shares when nobody’s making them.', effects: { loyalty: 5, public: 2 } },
          incredible: { text: 'You quietly sort the whole table into fair shares before it can boil over, and the sausage crisis dies unborn. {mate} toasts you with a fork. “This is why you’ll win, you know.”', effects: { loyalty: 8, public: 3, graft: 2 } },
        },
      },
      right: {
        label: 'Defend your plate',
        tags: ['banter', 'drama'],
        governingStats: { charisma: 0.5, savvy: 0.5 },
        outcomes: {
          bad: { text: '“Finders keepers, mate.” You defend the second sausage and it becomes a whole thing — a running grievance with your name on it. Over a sausage. This place does that to people.', effects: { charisma: 2, drama: 2, burnout: 3 } },
          good: { text: '“I earned this sausage. I did the washing-up.” The table can’t argue with the ledger. {mate} concedes, laughing. You keep the sausage and the moral high ground. Rare double.', effects: { charisma: 5, followers: 2 } },
          incredible: { text: 'You mount such a ludicrous legal defence of your extra sausage that the table’s in bits and {mate} forgets to be aggrieved. Injustice, defused by sheer commitment to the bit.', effects: { charisma: 8, followers: 4, public: 2 } },
        },
      },
    },
  },
  {
    id: 'li_wasp_breakfast', act: 1, tags: ['banter', 'camera'],
    art: 'li_kitchen',
    context: 'Morning · the big table · one uninvited guest',
    prompt: 'A single wasp has discovered the breakfast table and the villa’s hard-won cool evaporates in about four seconds. {mate} is up on a chair. Someone’s weaponised a magazine. “Do NOT antagonise it,” hisses {mate}, antagonising it. The wasp, drunk on jam, weighs its options. Nine adults, one insect, no dignity left.',
    recap: 'A single wasp reduces the whole breakfast table to chaos.',
    choices: {
      left: {
        label: 'Calmly deal with it',
        tags: ['loyal', 'banter'],
        governingStats: { charisma: 0.5, savvy: 0.5 },
        outcomes: {
          bad: { text: 'You go full calm-hero with a glass and a bit of card, and the wasp, sensing a professional, brings friends. Now there are three. The table relocates to the pool. You stay, outnumbered.', effects: { charisma: 2, burnout: 3 } },
          good: { text: 'You cup the wasp under a glass, walk it to the lawn, and release it like a tiny convict. The table erupts in relief. {mate} climbs down off the chair, restoring what’s left of their dignity.', effects: { charisma: 5, public: 2 } },
          incredible: { text: 'You handle the whole wasp crisis so calmly the villa treats you like you defused a bomb. {mate} demands you go “on wasp duty permanently.” A tiny hero, over breakfast, for no reward but jam.', effects: { charisma: 6, public: 3, followers: 2 } },
        },
      },
      right: {
        label: 'Join the chaos',
        tags: ['banter', 'camera'],
        governingStats: { charisma: 0.6, rizz: 0.4 },
        outcomes: {
          bad: { text: 'You grab the magazine and miss spectacularly, taking out a jug of orange juice instead. The wasp survives. The tablecloth does not. {mate}, still on the chair, awards you zero points.', effects: { charisma: 2, burnout: 3 } },
          good: { text: 'You lean all the way into the panic — a running commentary, a mock evacuation plan — and the terror becomes the funniest breakfast of the week. The wasp leaves of its own accord, unbothered.', effects: { charisma: 5, followers: 3, public: 2 } },
          incredible: { text: 'You choreograph the villa into a wasp-based farce — assigned lookouts, a code word, {mate} as the one who screams — and it’s the best ten minutes of telly nobody planned. The wasp exits to applause.', effects: { charisma: 8, followers: 5, public: 3 } },
        },
      },
    },
  },
  {
    id: 'li_blackout', act: 2, tags: ['rest', 'loyal'],
    art: 'li_terrace',
    context: 'Night · the terrace · the power trips',
    prompt: 'The villa’s power trips all at once — the AC dies, the pool lights go black, and for a minute it’s properly dark and properly quiet, which never happens in here. A producer’s voice, somewhere, promises a fix. {partner} finds your hand in the dark. “Mad, isn’t it. First time I can actually hear the sea.” You can. It’s been there the whole time.',
    recap: 'A power cut leaves the villa dark, quiet, and unexpectedly real.',
    choices: {
      left: {
        label: 'Sit in the dark with them',
        tags: ['rest', 'loyal'],
        governingStats: { loyalty: 0.6, savvy: 0.4 },
        outcomes: {
          bad: { text: 'You try to hold the quiet and your brain fills the dark with tomorrow’s recoupling instead — who’s safe, who isn’t, the maths. {partner} hears you thinking. “You’re somewhere else.” You are. The lights beat you back.', effects: { loyalty: 2, burnout: 3 } },
          good: { text: 'You sit in the black with {partner} and the sea, saying almost nothing, for as long as the power stays off. No camera worth the angle. Just the dark and the two of you in it. Rare, that.', effects: { loyalty: 5, bond: 5, burnout: -4 } },
          incredible: { text: 'In the dark, unmiked and unlit, {partner} says the thing they’d never say to a camera — quiet, plain, true. The generators kick back in mid-sentence. You’re the only one who’ll ever have heard it.', effects: { loyalty: 8, bond: 8, burnout: -5 } },
        },
      },
      right: {
        label: 'Turn the dark into a party',
        tags: ['banter', 'camera'],
        governingStats: { charisma: 0.6, rizz: 0.4 },
        outcomes: {
          bad: { text: 'You try to start a blackout singalong and it curdles — someone brings up the last recoupling, and now there’s a row in the dark where nobody can read a face. You lit that, in a manner of speaking.', effects: { charisma: 2, drama: 2, burnout: 3 } },
          good: { text: 'You get the villa singing in the dark, no music, just voices and the sea, and it’s better than anything the speaker ever managed. The lights come back to a room that doesn’t really want them.', effects: { charisma: 5, followers: 3, public: 2 } },
          incredible: { text: 'You turn the blackout into the villa’s quietest triumph — a singalong, then stories, then just the sound of the sea, everyone letting the dark do the talking. When the power returns, the room groans.', effects: { charisma: 8, followers: 5, public: 3 } },
        },
      },
    },
  },
  {
    id: 'li_villa_signature', act: 3, tags: ['loyal', 'date'],
    art: 'li_daybed',
    context: 'Final Week · under the daybed · a beam full of names',
    prompt: 'There’s a beam under the daybed where every series has signed their name, tiny and hidden, and it’s tradition to add yours before you leave. {partner} hands you the pen. “Go on. Proof we were here. Whoever’s on this daybed next summer won’t know us, but they’ll know we existed.” They’ve already signed. Yours is meant to go next to it.',
    recap: '{partner} hands you the pen to sign the villa’s hidden beam of past names.',
    choices: {
      left: {
        label: 'Sign it as one mark',
        tags: ['loyal', 'date'],
        governingStats: { loyalty: 0.6, rizz: 0.4 },
        outcomes: {
          bad: { text: 'You go to draw a joint little symbol and overthink it into a smudge. {partner} laughs. “Future series’ll think a pigeon signed it.” You leave the smudge. Honest, at least.', effects: { loyalty: 2, bond: 2, burnout: 2 } },
          good: { text: 'You add your names side by side with a small daft symbol only you two get. Nobody next summer will know what it means. That’s exactly why it’s yours. The pen goes back warm.', effects: { loyalty: 5, bond: 5 } },
          incredible: { text: 'You sign it as one mark — two names, joined — and {partner} goes quiet looking at it. “That’s staying there for years,” they say. “After us. Whatever Friday does.” Ink, outlasting the edit.', effects: { loyalty: 8, bond: 8, public: 2 } },
        },
      },
      right: {
        label: 'Sign your own name, plainly',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 0.7, savvy: 0.3 },
        outcomes: {
          bad: { text: 'You sign just your own name and {partner} clocks the solo signature. “Not next to mine?” You fix it, but the pause is on the beam now too, invisibly. You’ll both remember it.', effects: { loyalty: 2, bond: 1, burnout: 2 } },
          good: { text: 'You add your name to the years of others, plain and clear, right beside {partner}’s. Two names among hundreds, but yours. “We were here,” you say. “We were here,” they agree.', effects: { loyalty: 5, bond: 4 } },
          incredible: { text: 'You sign, then read out the oldest name up there — someone from years back — and wonder aloud if they made it. {partner} takes your hand. “We’ll be the ones someone else wonders about.” Chilling. Lovely.', effects: { loyalty: 6, bond: 6, romantics: 2 } },
        },
      },
    },
  },
];
