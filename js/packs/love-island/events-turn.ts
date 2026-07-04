// Love Island — Act 2 ambient deck (The Turn): bombshell weather, temptation,
// girl/bro code, the exclusivity question, the vote tightening. Everything
// costs something now. Voice per VOICE.md.

import type { GameEvent } from '../../types.js';

export const TURN_EVENTS: GameEvent[] = [
  {
    id: 'li_tempt_terrace', act: [2, 3], tags: ['temptation', 'flirt'],
    art: 'li_terrace',
    requires: { singleIs: false, exclusiveIs: false },
    context: 'Late · the terrace · just you and a bombshell',
    prompt: 'Everyone else has gone to bed, allegedly. {bombshell} is beside you on the terrace saying quiet, dangerous things: “I just think, if you weren’t coupled up…” The sentence hangs there, warming its hands over your whole situation.',
    choices: {
      left: {
        label: 'Shut it down',
        tags: ['loyal'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: 'You shut it down with a speech so long it technically counts as a chat. The terrace clock logs forty minutes. Explaining that number takes sixty.', effects: { bond: 2, burnout: 3, loyalty: 2 } },
          good: { text: '“Flattering. No.” Two sentences, one smile, exit. The Beach Hut replays it approvingly. Loyalty with good footwork.', effects: { bond: 4, loyalty: 2, burnout: -2 } },
          incredible: { text: 'You decline so warmly you turn a head-turn into an ally. {bombshell} tells the boys you’re “annoyingly solid.” The nation embroiders it on a cushion.', effects: { bond: 6, loyalty: 2, public: 3 } },
        },
      },
      right: {
        label: 'See where it goes',
        tags: ['temptation', 'flirt', 'drama'],
        governingStats: { rizz: 1 },
        outcomes: {
          bad: { text: 'It goes nowhere, slowly, for an hour, on camera. All of the risk, none of the story, and a clip that will absolutely be screened later.', effects: { burnout: 4, followers: 2, bond: -3, addFlag: 'li_head_turned' } },
          good: { text: '“I’m not being funny, my head could be turned.” It’s out of your mouth before the edit can save you. The terrace has ears. The duvets have ears.', effects: { followers: 5, rizz: 2, bond: -3, burnout: 2, addFlag: 'li_head_turned' } },
          incredible: { text: 'Nothing happens — technically. But the eye contact alone needs a watershed rating, and tomorrow’s episode is now about your couple. You knew. You stayed.', effects: { followers: 7, rizz: 3, bond: -4, public: 2, addFlag: 'li_head_turned' } },
        },
      },
    },
  },
  {
    id: 'li_tempt_official', act: [2, 3], tags: ['temptation', 'flirt'],
    art: 'li_hideaway',
    requires: { singleIs: false, exclusiveIs: true },
    context: 'Night · the kitchen · exclusive, and yet',
    prompt: 'You’re exclusive. It’s official. There was a small speech. And yet {bombshell} is leaning on the counter at 1 a.m. explaining, with troubling eye contact, that “official isn’t married, though, is it.”',
    choices: {
      left: {
        label: 'Walk away now',
        tags: ['loyal'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: 'You leave so abruptly you take their drink with you by accident. Loyal, yes. Smooth, no. The kitchen cam has the whole heist.', effects: { bond: 3, burnout: 2, loyalty: 2 } },
          good: { text: '“It’s not married. It’s better. Night.” You’re in bed before the counter’s stopped smirking. Exclusive means the exits are rehearsed.', effects: { bond: 5, loyalty: 3, burnout: -2 } },
          incredible: { text: 'You narrate the entire attempt to {partner} before breakfast, together, laughing. A couple that debriefs together is bulletproof, and the villa knows it.', effects: { bond: 7, loyalty: 3, public: 3 } },
        },
      },
      right: {
        label: 'Stay for one drink',
        tags: ['temptation', 'drama'],
        governingStats: { rizz: 0.7, savvy: 0.3 },
        outcomes: {
          bad: { text: 'One drink becomes two becomes a hand on your arm at the wrong angle for the wide shot. You did nothing. The footage disagrees on emphasis.', effects: { followers: 3, bond: -5, burnout: 5, addFlag: 'li_strayed_official' } },
          good: { text: 'You stay, you spar, you leave it at the counter — mostly. But “mostly,” while official, is a genre of footage now, and it has your face in it.', effects: { followers: 5, rizz: 2, bond: -4, burnout: 3, addFlag: 'li_strayed_official' } },
          incredible: { text: 'The chat is electric and entirely deniable, which is the most dangerous kind. You go to bed buzzing and guilty in exactly equal parts.', effects: { followers: 7, rizz: 3, bond: -4, burnout: 4, addFlag: 'li_strayed_official' } },
        },
      },
    },
  },
  {
    id: 'li_exclusive', act: [2, 3], tags: ['loyal', 'date'],
    art: 'li_terrace',
    requires: { singleIs: false, exclusiveIs: false, min: { bond: 55 } },
    context: 'Sunset · the roof terrace · a speech in your pocket',
    prompt: 'It’s going well. Suspiciously well. Well enough that the villa has started asking the question, and the question has started following you around: are you two going to make it official? Closing off means no more options — and a much longer way down.',
    choices: {
      left: {
        label: 'Ask them to be exclusive',
        tags: ['loyal', 'date'],
        governingStats: { loyalty: 0.7, rizz: 0.3 },
        outcomes: {
          bad: { text: 'You do the speech and a wasp gets involved at the worst possible clause. They say yes between swats. Officially official, with an asterisk shaped like a wasp.', effects: { exclusive: 1, bond: 4, burnout: 2 } },
          good: { text: 'You close off, out loud, on the terrace where it started. The villa toasts you with whatever was nearest. No more options. That’s the point.', effects: { exclusive: 1, bond: 6, public: 2 } },
          incredible: { text: 'The speech is short, specific, and lands so cleanly the Beach Hut cries about it in three separate confessionals. The Season has its couple.', effects: { exclusive: 1, bond: 8, public: 4 } },
        },
      },
      right: {
        label: 'Hold your options',
        tags: ['strategy'],
        governingStats: { savvy: 1 },
        outcomes: {
          bad: { text: '“What are we?” arrives at midnight, as scheduled. Your answer contains the word “journey-adjacent.” The silence afterwards has a postcode.', effects: { bond: -3, burnout: 4, savvy: 2 } },
          good: { text: 'You keep it undefined with enough warmth to sting less. Flexibility is a strategy; it just photographs like doubt.', effects: { savvy: 3, followers: 3, burnout: 2 } },
          incredible: { text: 'You name the stakes honestly — the game, the vote, the outside — and somehow leave the couple stronger and unlocked. A negotiation the reunion will study.', effects: { savvy: 4, followers: 4, bond: 2 } },
        },
      },
    },
  },
  {
    id: 'li_code_row', act: 2, tags: ['code', 'drama'],
    art: 'li_firepit_day',
    context: 'Afternoon · {mate}’s couple is on fire · not the good kind',
    prompt: '{mate}’s partner has been grafting on a bombshell all day in plain sight, and now {mate} is crying in the toilet and the villa is choosing sides with its feet. You know things. Saying them helps {mate} and torches a boy. Girl code has a clause for this. It’s just expensive.',
    choices: {
      left: {
        label: 'Back your mate',
        tags: ['code', 'loyal', 'drama'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: 'You tell {mate} everything, mid-sob, with your usual gift for timing. The confrontation happens wet, loud, and partially in a towel. You’re cited as a source.', effects: { public: 2, burnout: 4, addFlag: 'li_code_honour' } },
          good: { text: 'You say what you saw, plainly, to the person who needed it. The boy calls you a stirrer. The girls call you at every crisis from now on.', effects: { public: 3, loyalty: 3, addFlag: 'li_code_honour' } },
          incredible: { text: 'You handle it so cleanly — the truth to {mate}, one flat sentence to the boy, no theatre — that the villa quietly re-ranks you. Code isn’t a rule. It’s a reputation.', effects: { public: 4, loyalty: 4, followers: 3, addFlag: 'li_code_honour' } },
        },
      },
      right: {
        label: 'Stay out of it',
        tags: ['strategy'],
        governingStats: { savvy: 1 },
        outcomes: {
          bad: { text: 'You stay neutral and {mate} finds out later you knew. The phrase “I thought we were close” is deployed. There is no defence at this altitude.', effects: { burnout: 5, public: -2, addFlag: 'li_code_broke' } },
          good: { text: 'You keep your fingerprints off it and the drama burns through without you. Cold, effective, and noted — quietly — by everyone.', effects: { savvy: 3, burnout: 2, addFlag: 'li_code_broke' } },
          incredible: { text: 'You engineer the reveal without appearing in it: one nudge, one borrowed phone charger, one perfectly timed “ask him yourself.” Untraceable. Almost.', effects: { savvy: 5, followers: 3, addFlag: 'li_code_broke' } },
        },
      },
    },
  },
  {
    id: 'li_code_vote_honour', act: [2, 3], tags: ['code', 'text'],
    art: 'li_firepit',
    requires: { flagsAll: ['li_code_honour'] },
    context: 'Evening · “I’VE GOT A TEXT!!” · a vote among the Islanders',
    prompt: '“Islanders. Tonight, the girls and the boys will each vote for the Islander they most trust. The winners receive a dinner date on the beach. #trustissues” — A popularity contest disguised as a virtue contest, which is this show’s entire genome. You’ve kept the code. Time to collect.',
    choices: {
      left: {
        label: 'Campaign quietly',
        tags: ['strategy', 'code'],
        governingStats: { savvy: 1 },
        outcomes: {
          bad: { text: 'Your “casual” pre-vote chats are so obviously canvassing that {mate} asks if you’re running for something. You are. Everyone is. Still embarrassing.', effects: { public: 2, burnout: 3 } },
          good: { text: 'You don’t campaign. You just happen to make four teas in an hour. The vote lands your way, as votes tend to when the kettle’s on your side.', effects: { public: 4, savvy: 2 } },
          incredible: { text: 'You win the trust vote by a margin the Host declines to read out “to spare the others.” The beach dinner has your name on the good chair.', effects: { public: 5, savvy: 2, bond: 3 } },
        },
      },
      right: {
        label: 'Let the record speak',
        tags: ['loyal', 'code'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: 'You say nothing and come second by one vote to someone who campaigned in a sarong. Virtue is its own reward, which is fortunate, because tonight it’s the only one.', effects: { loyalty: 2, public: 2 } },
          good: { text: 'The girls vote for the person who backed them when it cost something. It’s you. It was always going to be you.', effects: { loyalty: 3, public: 4 } },
          incredible: { text: 'Both sides of the villa vote for you — a format first. The Host checks the card twice on air. The nation checks nothing; the nation already knew.', effects: { loyalty: 3, public: 6, followers: 3 } },
        },
      },
    },
  },
  {
    id: 'li_code_vote_broke', act: [2, 3], tags: ['code', 'text', 'drama'],
    art: 'li_firepit',
    requires: { flagsAll: ['li_code_broke'] },
    context: 'Evening · “I’VE GOT A TEXT!!” · a vote among the Islanders',
    prompt: '“Islanders. Tonight, the girls and the boys will each vote for the Islander playing the biggest game. That Islander loses their next date. #calledout” — A firing squad with fairy lights. And you, lately, have been leaving fingerprints.',
    choices: {
      left: {
        label: 'Get ahead of it',
        tags: ['chat', 'strategy'],
        governingStats: { savvy: 0.6, charisma: 0.4 },
        outcomes: {
          bad: { text: 'Your pre-emptive apology tour visits four people and generates three new grievances. The vote finds you anyway. Votes are like that.', effects: { public: -3, burnout: 4, followers: 2 } },
          good: { text: 'You own the game-playing before the vote can: “Yes, I moved chess pieces. You’ve all met me.” Honesty about dishonesty polls weirdly well.', effects: { public: 2, savvy: 3, followers: 3 } },
          incredible: { text: 'You confess with such charm that the vote swings to someone who denied everything. The villa forgives a player. It never forgives a liar.', effects: { public: 3, savvy: 4, followers: 4 } },
        },
      },
      right: {
        label: 'Take the hit',
        tags: ['drama', 'camera'],
        governingStats: { charisma: 1 },
        outcomes: {
          bad: { text: 'Your name gets read out and your face, despite six seasons of watching this show, does shock. The shock face becomes a sticker pack by morning.', effects: { public: -3, followers: 3, burnout: 4 } },
          good: { text: 'Named and shameless: you take the verdict with a bow. The villa laughs despite itself. Villains who bow get renewed.', effects: { followers: 5, public: -1, charisma: 2 } },
          incredible: { text: 'You respond to the vote with a speech about games that ends on “and yet you all keep losing to me.” Gasps. A dropped fork. Iconic behaviour, objectively.', effects: { followers: 8, public: -1, charisma: 3 } },
        },
      },
    },
  },
  {
    id: 'li_snog_marry_pie', act: 2, tags: ['challenge', 'drama'],
    art: 'li_challenge',
    context: 'The lawn · “Snog, Marry, Pie” · aprons on',
    prompt: 'The rules: snog the one you fancy, marry the one you trust, and put a custard pie in the face of the one you don’t. Everyone is smiling. Nobody is safe. Your partner is watching which way you walk.',
    choices: {
      left: {
        label: 'Play it honest',
        tags: ['loyal', 'challenge'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: 'You marry your partner and pie the bombshell. The bombshell laughs. It is not the good kind of laugh.', effects: { bond: 3, burnout: 2, addFlag: 'li_rival_active' } },
          good: { text: 'You snog your partner in front of everyone. Petty of you, and it works.', effects: { bond: 5, public: 3 } },
          incredible: { text: 'You marry your partner and mean it. Someone in the crowd says “aww.” Someone else says nothing, loudly.', effects: { bond: 7, public: 4 } },
        },
      },
      right: {
        label: 'Cause a scene',
        tags: ['drama', 'challenge', 'camera'],
        governingStats: { charisma: 1, rizz: 0.3 },
        outcomes: {
          bad: { text: 'You snog the boy who isn’t yours “for the game.” Your partner accepts this explanation the way one accepts weather.', effects: { followers: 4, bond: -4, burnout: 3 } },
          good: { text: 'You pie the loudest girl and snog the bombshell. The group chat, later, will need a whole evening.', effects: { followers: 6, public: 3, bond: -2 } },
          incredible: { text: 'You turn a party game into a cliffhanger. Three couples now have “a chat” to schedule. You did that.', effects: { followers: 9, public: 5, bond: -3, graft: 3 } },
        },
      },
    },
  },
  {
    id: 'li_rumour_mill', act: [2, 3], tags: ['drama', 'strategy'],
    art: 'li_bedroom',
    context: 'Morning · a rumour is loose · it has your name in it',
    prompt: 'Somewhere between the dressing room and the gym, a sentence about you got a haircut and new shoes. The version now circulating says you called your couple “a stepping stone.” You said “next steps.” Once. About a salad.',
    choices: {
      left: {
        label: 'Trace it to the source',
        tags: ['strategy', 'drama'],
        governingStats: { savvy: 1 },
        outcomes: {
          bad: { text: 'Your investigation interviews five witnesses and creates two new rumours, both worse, one involving the salad. The salad is now a storyline.', effects: { burnout: 4, followers: 2 } },
          good: { text: 'You follow the sentence back through three retellings to its author, who folds instantly. Corrections issued. Villa notified. Case closed by lunch.', effects: { savvy: 3, public: 2 } },
          incredible: { text: 'You expose the whole supply chain at the firepit — who said it, who spiced it, who delivered it — with the calm of a detective who’s already eaten. The villa is terrified. Respectfully.', effects: { savvy: 5, public: 3, followers: 3 } },
        },
      },
      right: {
        label: 'Kill it with your couple',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: 'You explain the salad to {partner} in such detail that the salad becomes suspicious. “Why do you remember the salad?” This is your life now.', effects: { bond: 1, burnout: 3 } },
          good: { text: 'You take it to {partner} first, before the villa can. “People will keep trying this,” you say. “Let them tire themselves out.” The couple holds; the rumour starves.', effects: { bond: 5, loyalty: 2 } },
          incredible: { text: 'You and {partner} greet the rumour by being so publicly fine that it dies of embarrassment. The author watches their work evaporate. The nation takes a screenshot anyway.', effects: { bond: 6, public: 3, loyalty: 2 } },
        },
      },
    },
  },
  {
    id: 'li_beach_date', act: [2, 3], tags: ['date', 'flirt'],
    art: 'li_beach',
    requires: { singleIs: false },
    context: '“I’VE GOT A TEXT!!” · a date off-site · an actual beach',
    prompt: '“{partner} and you are going on a date. Please get ready to leave the villa. #offgrid” — A car, a coastline, a table set for two by people you’ll never meet. Off-site dates are the show saying: convince us. Convince each other, while you’re at it.',
    choices: {
      left: {
        label: 'Go all in on them',
        tags: ['date', 'loyal'],
        governingStats: { loyalty: 0.6, rizz: 0.4 },
        outcomes: {
          bad: { text: 'You aim for depth and hit interview: “So what ARE your values?” over a prawn. {partner} answers gamely. The prawn suffers most.', effects: { bond: 2, burnout: 2 } },
          good: { text: 'Real questions, real answers, and one silence that neither of you needed to fill. On this show, a comfortable silence is a certificate.', effects: { bond: 6, loyalty: 2 } },
          incredible: { text: 'Somewhere between the starter and the sea, it stops being a date on a show and starts being a date. The drone shot gets you both mid-laugh. That’s the poster now.', effects: { bond: 8, public: 3, loyalty: 2 } },
        },
      },
      right: {
        label: 'Give the cameras a show',
        tags: ['camera', 'flirt'],
        governingStats: { charisma: 0.6, rizz: 0.4 },
        outcomes: {
          bad: { text: 'You perform romance at the sea like a perfume advert and {partner} asks, quietly, who you’re doing this for. The sea declines to comment.', effects: { followers: 3, bond: -2, burnout: 3 } },
          good: { text: 'Champagne, golden light, one rehearsed-looking kiss that wasn’t. The nation swoons on schedule. The couple banks the montage.', effects: { followers: 5, public: 3, bond: 2 } },
          incredible: { text: 'The date is so cinematic the episode uses it as the cold open. You are, officially, the couple other couples get compared to. Heavy is the crown; great is the lighting.', effects: { followers: 7, public: 4, bond: 3 } },
        },
      },
    },
  },
  {
    id: 'li_ex_arrives', act: [2, 3], tags: ['drama', 'chat'],
    art: 'li_firepit_day',
    requires: { flagsAll: ['li_rival_active'] },
    context: 'Afternoon · old business · new volume',
    prompt: 'The thing about villas is there’s nowhere to put history. Yours is currently sunbathing four metres from your couple, radiating unfinished sentences. {ex} wants “a quick word.” No word on this show has ever been quick.',
    choices: {
      left: {
        label: 'Have the conversation',
        tags: ['chat', 'loyal'],
        governingStats: { loyalty: 0.6, savvy: 0.4 },
        outcomes: {
          bad: { text: 'The quick word takes ninety minutes and relitigates the whole timeline. You return to {partner} with the face of someone back from an audit.', effects: { burnout: 4, bond: -2 } },
          good: { text: 'You give it ten honest minutes, close the loop, and walk back to your couple in full view. Endings, done properly, are just good manners.', effects: { bond: 4, loyalty: 2, public: 2 } },
          incredible: { text: 'The conversation ends with an actual handshake, which the villa finds more shocking than any row. Closure: the rarest twist in the format.', effects: { bond: 5, loyalty: 3, public: 3 } },
        },
      },
      right: {
        label: 'Refuse the summit',
        tags: ['strategy', 'drama'],
        governingStats: { savvy: 1 },
        outcomes: {
          bad: { text: 'You dodge the chat all day, visibly, athletically. By dinner your avoidance is the story, and {ex} hasn’t said a word. Masterful, from them.', effects: { burnout: 4, followers: 2 } },
          good: { text: '“We’re good. There’s no word needed.” You say it once, kindly, and hold the line. The nation respects a closed door with a smile on it.', effects: { savvy: 3, bond: 3 } },
          incredible: { text: 'Your refusal is so final and so pleasant that {ex} ends up apologising to {partner}, unprompted, on camera. You didn’t attend the drama and still won it.', effects: { savvy: 4, bond: 4, public: 3 } },
        },
      },
    },
  },
  {
    id: 'li_dressing_room_summit', act: [2, 3], tags: ['code', 'chat'],
    art: 'li_bedroom',
    context: 'Night · the dressing room · state of the nation',
    prompt: 'Full dressing-room summit: every girl, every grievance, one shared mirror. Tonight’s agenda is the boys — collectively, individually, and one in particular whose name keeps arriving with a sigh attached. The room wants your reading.',
    choices: {
      left: {
        label: 'Hold the room together',
        tags: ['code', 'loyal', 'chat'],
        governingStats: { loyalty: 0.6, charisma: 0.4 },
        outcomes: {
          bad: { text: 'Your unity speech is going beautifully until two of your examples turn out to be about the same boy. The summit fractures along entirely new lines. More sighing.', effects: { burnout: 3, public: 1 } },
          good: { text: 'You talk the room off three separate ledges and into one shared eyeliner. The girls leave stronger. The boys, downstairs, sense a change in air pressure.', effects: { loyalty: 3, public: 3, addFlag: 'li_code_honour' } },
          incredible: { text: 'By midnight the dressing room has a pact, a plan, and a name (“the coven,” affectionate). You are its unelected chair. The vote doesn’t know it yet, but it just moved.', effects: { loyalty: 4, public: 4, followers: 3, addFlag: 'li_code_honour' } },
        },
      },
      right: {
        label: 'Play the room',
        tags: ['strategy', 'drama'],
        governingStats: { savvy: 1 },
        outcomes: {
          bad: { text: 'You seed two ideas and mislabel a third, and the summit arrives at a conclusion you specifically did not order. Politics is a kitchen you can’t leave mid-soufflé.', effects: { burnout: 3, savvy: 2, addFlag: 'li_code_broke' } },
          good: { text: 'A nudge here, a “no, you said it better” there — the room reaches your conclusion believing it walked there itself. Textbook. Undetectable. Almost.', effects: { savvy: 4, followers: 2, addFlag: 'li_code_broke' } },
          incredible: { text: 'You conduct the dressing room like a small orchestra and by lights-out the villa’s whole week is arranged in your key. If anyone ever checks the tape, you’re done. Nobody checks the tape.', effects: { savvy: 5, followers: 4, addFlag: 'li_code_broke' } },
        },
      },
    },
  },
  {
    id: 'li_challenge_couples', act: 2, tags: ['challenge', 'banter'],
    art: 'li_challenge',
    context: 'The lawn · the couples’ quiz · “How well do you REALLY know each other?”',
    prompt: 'Whiteboards out. “What is your partner’s biggest fear?” The couples who’ve done the work smirk. The couples who haven’t begin, quietly, to perspire. You’re about to find out which one you are, in front of everyone.',
    choices: {
      left: {
        label: 'Trust what you know',
        tags: ['loyal', 'challenge'],
        governingStats: { loyalty: 0.6, savvy: 0.4 },
        outcomes: {
          bad: { text: 'You write “spiders.” The answer was “abandonment.” The lawn does a group “oof.” There is nowhere to put a whiteboard that says spiders.', effects: { bond: -2, burnout: 3, followers: 2 } },
          good: { text: 'Match after match — the nan’s name, the weird sandwich, the fear. The villa realises, mid-quiz, that your couple has been doing the homework.', effects: { bond: 5, public: 3 } },
          incredible: { text: 'Ten for ten, including the question {partner} got wrong about themselves. “That’s actually right,” they admit, to the lawn’s delight. You know them better than they do. It airs twice.', effects: { bond: 7, public: 4, followers: 3 } },
        },
      },
      right: {
        label: 'Play it for laughs',
        tags: ['banter', 'challenge', 'camera'],
        governingStats: { charisma: 1 },
        outcomes: {
          bad: { text: 'Your joke answers land until “what do you like most about them?” also gets a joke, and the laugh arrives one person short. The one person.', effects: { followers: 3, bond: -3, burnout: 3 } },
          good: { text: 'You lose the quiz and win the episode: every wrong answer is a bit, every bit lands, and {partner} is crying laughing at their own whiteboard. Zero points. Full marks.', effects: { followers: 5, charisma: 2, bond: 2 } },
          incredible: { text: 'Your whiteboard answers become a running gag the show brings back for three episodes. The quiz has a winner. The Season has a comedian.', effects: { followers: 8, charisma: 3, public: 2 } },
        },
      },
    },
  },
  {
    id: 'li_vote_wobble', act: [2, 3], tags: ['camera', 'strategy'],
    art: 'li_beachhut',
    context: 'The Beach Hut · a producer question with teeth',
    prompt: 'Beach Hut, routine check-in, and then the producer’s voice asks, mildly: “Some viewers say your couple is a game plan. What would you say to them?” The chair is suddenly very upright. The question is a gift, a trap, or both. It’s both.',
    choices: {
      left: {
        label: 'Answer from the heart',
        tags: ['loyal', 'camera'],
        governingStats: { loyalty: 0.6, charisma: 0.4 },
        outcomes: {
          bad: { text: 'You get genuinely emotional defending your couple, which would play beautifully if you hadn’t started with “look, I know how this looks.” The edit keeps the first half.', effects: { public: 1, burnout: 4 } },
          good: { text: 'You answer plainly, no media training, one wobble in your voice you don’t bother hiding. The clip runs uncut. The vote softens by Tuesday.', effects: { public: 4, bond: 2 } },
          incredible: { text: 'Your answer is so unguarded the show builds the episode’s emotional arc around it. Doubters keep doubting — quieter, though. Much quieter.', effects: { public: 5, bond: 3, followers: 3 } },
        },
      },
      right: {
        label: 'Handle it like media',
        tags: ['camera', 'strategy'],
        governingStats: { savvy: 0.6, charisma: 0.4 },
        outcomes: {
          bad: { text: 'You deliver a flawless non-answer, and the flawlessness is the problem. “Very polished,” says the internet, meaning something else.', effects: { followers: 2, public: -2, burnout: 2 } },
          good: { text: 'You thank the doubters for watching. Genuinely elite deflection — engagement is engagement, and you just converted the haters into metrics.', effects: { followers: 5, savvy: 2 } },
          incredible: { text: '“If I were playing a game, I’d be winning it, and if I’m not, I’m happy. Pick whichever keeps you watching.” The line escapes the show entirely and gets quoted at bus stops.', effects: { followers: 8, savvy: 3, public: 2 } },
        },
      },
    },
  },
  {
    id: 'li_new_boy_graft', act: [2, 3], tags: ['flirt', 'strategy'],
    art: 'li_lawn',
    requires: { singleIs: false },
    context: 'Midday · a bombshell is grafting · on YOUR partner',
    prompt: '{bombshell} has taken {partner} for “a chat,” which is currently entering its second bottle of water. From the daybed you have a clear view of the body language, and the body language is fluent. The villa watches you watch.',
    choices: {
      left: {
        label: 'Trust your couple',
        tags: ['loyal', 'rest'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: 'You trust so hard you nap through the debrief, and get the chat’s contents third-hand, garnished, from {rival} of all people. Trust: intact. Nerves: shredded.', effects: { bond: 2, burnout: 4 } },
          good: { text: 'You stay on the daybed, unbothered, factor 50 on, and let the chat exhaust itself. {partner} comes straight back to you. The lesson airs nationally.', effects: { bond: 5, loyalty: 2, public: 2 } },
          incredible: { text: 'You wave — one friendly, devastating wave — mid-chat. The graft dies on the spot. {partner} tells the Beach Hut “that’s why, though. That right there.”', effects: { bond: 7, loyalty: 2, public: 4 } },
        },
      },
      right: {
        label: 'Break up the chat',
        tags: ['drama', 'flirt'],
        governingStats: { rizz: 0.5, charisma: 0.5 },
        outcomes: {
          bad: { text: 'You arrive with three drinks nobody asked for and a smile with too many teeth. The chat pauses, politely, until you leave. The daybed grades your entrance a four.', effects: { bond: 1, burnout: 4, followers: 2 } },
          good: { text: 'You join the chat, disarm it in ninety seconds, and leave with {partner} and both waters. Clean extraction. The bombshell reviews their notes.', effects: { bond: 4, rizz: 2, followers: 2 } },
          incredible: { text: 'You sit down, befriend the bombshell, and matchmake them with someone else live in the same conversation. Threat converted to subplot. The producers send champagne.', effects: { bond: 5, savvy: 3, public: 3, followers: 3 } },
        },
      },
    },
  },
];
