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
    prompt: 'Everyone else has gone to bed, allegedly. {bombshell} is beside you on the terrace saying quiet, dangerous things: “I just think, if you weren’t coupled up…” Oh no. Oh no no no. That sentence has never once ended well on this programme, and it knows it — look at it, hanging there, warming its hands over your whole situation.',
    recap: 'Late on the terrace, just you and {bombshell} saying dangerous things.',
    choices: {
      left: {
        label: 'Shut it down',
        tags: ['loyal'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: '“So to be clear — and there are several parts to this—” Your shutdown speech runs so long it technically counts as a chat. The clock logs forty minutes. Explaining that number takes sixty.', effects: { bond: 2, burnout: 3, loyalty: 2 } },
          good: { text: '“Flattering — but no. I’m cracking on with my person, I’m loyal, that’s just me.” One smile, exit. The Beach Hut replays it approvingly. Loyalty with good footwork.', effects: { bond: 4, loyalty: 4, burnout: -2 } },
          incredible: { text: 'You decline so warmly you turn a head-turn into an ally. {bombshell} tells the boys you’re “annoyingly solid.” The nation embroiders it on a cushion.', effects: { bond: 6, loyalty: 6, public: 5 } },
        },
      },
      right: {
        label: 'See where it goes',
        tags: ['temptation', 'flirt', 'drama'],
        governingStats: { rizz: 1 },
        outcomes: {
          bad: { text: '“Anyway,” you both keep saying, hourly, as it goes nowhere, on camera. All of the risk, none of the story — the romantic equivalent of queueing. The clip will absolutely be screened later.', effects: { rizz: 2, burnout: 4, followers: 2, bond: -3, addFlag: 'li_head_turned' } },
          good: { text: '“I’m not being funny, my head could be turned.” It’s out of your mouth before the edit can save you. The terrace has ears. The duvets have ears.', effects: { followers: 5, rizz: 5, bond: -3, burnout: 2, addFlag: 'li_head_turned' } },
          incredible: { text: 'Nothing happens — technically. But the eye contact alone needs a watershed rating, and tomorrow’s episode is now about your couple. You knew. You stayed.', effects: { followers: 8, rizz: 8, bond: -4, public: 4, addFlag: 'li_head_turned' } },
        },
      },
    },
  },
  {
    id: 'li_tempt_official', act: [2, 3], weight: 2.5, tags: ['temptation', 'flirt'],
    art: 'li_hideaway',
    requires: { singleIs: false, exclusiveIs: true },
    context: 'Night · the kitchen · exclusive, and yet',
    prompt: 'You’re exclusive. It’s official. There was a small speech. And yet {bombshell} is leaning on the counter at 1 a.m. explaining, with troubling eye contact, that “official isn’t married, though, is it.” A philosopher. At one in the morning. By the hob.',
    recap: 'You’re official — and {bombshell} is leaning on the counter at 1 a.m.',
    choices: {
      left: {
        label: 'Walk away now',
        tags: ['loyal'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: '“Night!” You leave so abruptly you take their drink with you by accident. Loyal, yes. Smooth, no. The kitchen cam has the whole heist.', effects: { bond: 3, burnout: 2, loyalty: 2 } },
          good: { text: '“It’s not married, no — but I’m not cracking on with anyone but them. Night.” You’re in bed before the counter’s stopped smirking. Exclusive means the exits are rehearsed.', effects: { bond: 5, loyalty: 4, burnout: -2 } },
          incredible: { text: '“And THEN — ‘official isn’t married, though, is it’ —” You narrate the entire attempt to {partner} before breakfast, together, crying laughing. A couple that debriefs together is bulletproof.', effects: { bond: 7, loyalty: 6, public: 5 } },
        },
      },
      right: {
        label: 'Stay for one drink',
        tags: ['temptation', 'drama'],
        governingStats: { rizz: 0.7, savvy: 0.3 },
        outcomes: {
          bad: { text: 'One drink becomes two becomes a hand on your arm at the wrong angle for the wide shot. You did nothing. The footage disagrees on emphasis.', effects: { rizz: 2, followers: 3, bond: -5, burnout: 5, addFlag: 'li_strayed_official' } },
          good: { text: 'You stay, you spar, you leave it at the counter — mostly. But “mostly,” while official, is a genre of footage now, and it has your face in it.', effects: { followers: 5, rizz: 5, bond: -4, burnout: 3, addFlag: 'li_strayed_official' } },
          incredible: { text: 'The chat is electric and entirely deniable, which is the most dangerous kind. You go to bed buzzing and guilty in exactly equal parts.', effects: { followers: 8, rizz: 8, bond: -4, burnout: 4, addFlag: 'li_strayed_official' } },
        },
      },
    },
  },
  {
    id: 'li_exclusive', act: [2, 3], tags: ['loyal', 'date'],
    art: 'li_terrace',
    weight: 2,
    requires: { singleIs: false, exclusiveIs: false, min: { bond: 45 } },
    context: 'Sunset · the roof terrace · a speech in your pocket',
    prompt: 'It’s going well. Suspiciously well. Well enough that the villa keeps asking The Question, and The Question has started following you around with a wee notebook: are you two going to make it official? Closing off means no more options — and a much longer way down.',
    recap: 'It’s going suspiciously well, and the villa keeps asking The Question.',
    choices: {
      left: {
        label: 'Ask them to be exclusive',
        tags: ['loyal', 'date'],
        governingStats: { loyalty: 0.7, rizz: 0.3 },
        outcomes: {
          bad: { text: '“Will you — GET OFF — will you be—” A wasp attends the speech at the worst possible clause. They say yes between swats. Officially official, with an asterisk shaped like a wasp.', effects: { loyalty: 2, exclusive: 1, bond: 4, burnout: 2 } },
          good: { text: '“I wanna close myself off. Just us, no one else.” You say it out loud, on the terrace where it started. The villa toasts you with whatever was nearest. No more options. That’s the point.', effects: { loyalty: 4, exclusive: 1, bond: 6, public: 3 } },
          incredible: { text: 'The speech is short, specific, and lands so cleanly the Beach Hut cries about it in three separate confessionals. The Season has its couple.', effects: { loyalty: 6, exclusive: 1, bond: 8, public: 6 } },
        },
      },
      right: {
        label: 'Hold your options',
        tags: ['strategy'],
        governingStats: { savvy: 1 },
        outcomes: {
          bad: { text: '“What are we?” arrives at midnight, as scheduled. Your answer contains the word “journey-adjacent.” The silence afterwards has a postcode.', effects: { bond: -3, burnout: 4, savvy: 2 } },
          good: { text: '“I just wanna keep my options open a bit longer, if that’s alright.” Warm enough to sting less. Flexibility is a strategy; it just photographs like doubt.', effects: { savvy: 5, followers: 3, burnout: 2 } },
          incredible: { text: 'You name the stakes honestly — the game, the vote, the outside — and somehow leave the couple stronger and unlocked. A negotiation the reunion will study.', effects: { savvy: 8, followers: 5, bond: 2 } },
        },
      },
    },
  },
  {
    id: 'li_code_row', act: 2, tags: ['code', 'drama'],
    art: 'li_firepit_day',
    context: 'Afternoon · {mate}’s couple is on fire · not the good kind',
    prompt: '{mate}’s partner has been grafting on a bombshell all day in plain sight, and now {mate} is crying in the toilet and the villa is choosing sides with its feet. You know things. Saying them helps {mate} and torches a boy. Girl code has a clause for this. It’s just expensive.',
    recap: '{mate}’s partner is grafting in plain sight, and {mate}’s crying in the loo.',
    choices: {
      left: {
        label: 'Back your mate',
        tags: ['code', 'loyal', 'drama'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: 'You tell {mate} everything, mid-sob, with your usual gift for timing. The confrontation happens wet, loud, and partially in a towel. You’re cited as a source.', effects: { loyalty: 2, public: 2, burnout: 4, addFlag: 'li_code_honour' } },
          good: { text: '“You’re a stirrer,” says the boy. The girls, from now on, call you at every crisis. You said what you saw, plainly, to the person who needed it.', effects: { public: 4, loyalty: 3, addFlag: 'li_code_honour' } },
          incredible: { text: 'You handle it so cleanly — the truth to {mate}, one flat sentence to the boy, no theatre — that the villa quietly re-ranks you. Code isn’t a rule. It’s a reputation.', effects: { public: 6, loyalty: 5, followers: 4, addFlag: 'li_code_honour' } },
        },
      },
      right: {
        label: 'Stay out of it',
        tags: ['strategy'],
        governingStats: { savvy: 1 },
        outcomes: {
          bad: { text: 'You stay neutral and {mate} finds out later you knew. The phrase “I thought we were close” is deployed. There is no defence at this altitude.', effects: { savvy: 2, burnout: 5, public: -2, addFlag: 'li_code_broke' } },
          good: { text: 'You keep your fingerprints off it and the drama burns through without you. Cold, effective, and noted — quietly — by everyone.', effects: { savvy: 5, burnout: 2, addFlag: 'li_code_broke' } },
          incredible: { text: 'You engineer the reveal without appearing in it: one nudge, one borrowed phone charger, one perfectly timed “ask him yourself.” Untraceable. Almost.', effects: { savvy: 8, followers: 4, addFlag: 'li_code_broke' } },
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
    recap: 'Got a text — the Islanders vote for who they most trust.',
    choices: {
      left: {
        label: 'Campaign quietly',
        tags: ['strategy', 'code'],
        governingStats: { savvy: 1 },
        outcomes: {
          bad: { text: '“Are you running for something?” asks {mate}, mid-way through your third “casual” pre-vote chat. You are. Everyone is. Still embarrassing.', effects: { savvy: 2, public: 2, burnout: 3 } },
          good: { text: 'You don’t campaign. You just happen to make four teas in an hour. The vote lands your way, as votes tend to when the kettle’s on your side.', effects: { public: 5, savvy: 5 } },
          incredible: { text: 'You win the trust vote by a margin the Host declines to read out “to spare the others.” The beach dinner has your name on the good chair.', effects: { public: 7, savvy: 8, bond: 3 } },
        },
      },
      right: {
        label: 'Let the record speak',
        tags: ['loyal', 'code'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: 'You say nothing and come second by one vote to someone who campaigned in a sarong. Virtue is its own reward, which is fortunate, because tonight it’s the only one.', effects: { loyalty: 2, public: 2 } },
          good: { text: 'The girls vote for the person who backed them when it cost something. It’s you. It was always going to be you.', effects: { loyalty: 3, public: 5 } },
          incredible: { text: 'Both sides of the villa vote for you — a format first. The Host checks the card twice on air. The nation checks nothing; the nation already knew.', effects: { loyalty: 5, public: 8, followers: 4 } },
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
    recap: 'Got a text — the Islanders vote for who’s playing the biggest game.',
    choices: {
      left: {
        label: 'Get ahead of it',
        tags: ['chat', 'strategy'],
        governingStats: { savvy: 0.6, charisma: 0.4 },
        outcomes: {
          bad: { text: 'Your pre-emptive apology tour visits four people and generates three new grievances. The vote finds you anyway. Votes are like that.', effects: { savvy: 2, public: -3, burnout: 4, followers: 2 } },
          good: { text: 'You own the game-playing before the vote can: “Yes, I moved chess pieces. You’ve all met me.” Honesty about dishonesty polls weirdly well.', effects: { public: 3, savvy: 5, followers: 3 } },
          incredible: { text: 'You confess with such charm that the vote swings to someone who denied everything. The villa forgives a player. It never forgives a liar.', effects: { public: 5, savvy: 8, followers: 5 } },
        },
      },
      right: {
        label: 'Take the hit',
        tags: ['drama', 'camera'],
        governingStats: { charisma: 1 },
        outcomes: {
          bad: { text: 'Your name gets read out and your face, despite six seasons of watching this show, does shock. The shock face becomes a sticker pack by morning.', effects: { charisma: 2, public: -3, followers: 3, burnout: 4 } },
          good: { text: 'Named and shameless: you take the verdict with a bow. The villa laughs despite itself. Villains who bow get renewed.', effects: { followers: 5, public: -1, charisma: 5 } },
          incredible: { text: 'You respond to the vote with a speech about games that ends on “and yet you all keep losing to me.” Gasps. A dropped fork. Iconic behaviour, objectively.', effects: { followers: 9, public: -1, charisma: 8 } },
        },
      },
    },
  },
  {
    id: 'li_snog_marry_pie', act: 2, tags: ['challenge', 'drama'],
    art: 'li_challenge',
    context: 'The lawn · “Snog, Marry, Pie” · aprons on',
    prompt: 'The rules: snog the one you fancy, marry the one you trust, and put a custard pie in the face of the one you don’t. Everyone is smiling. Nobody is safe. Your partner is watching which way you walk.',
    recap: 'Snog, Marry, Pie on the lawn — and {partner} is watching where you walk.',
    choices: {
      left: {
        label: 'Play it honest',
        tags: ['loyal', 'challenge'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: '“No — funny. Genuinely funny,” says the bombshell, wearing your pie. It is not the good kind of laugh.', effects: { loyalty: 2, bond: 3, burnout: 2, addFlag: 'li_rival_active' } },
          good: { text: 'You snog your partner in front of everyone. Petty of you, and it works.', effects: { charisma: 2, loyalty: 3, bond: 5, public: 4 } },
          incredible: { text: 'You marry your partner and mean it. Someone in the crowd says “aww.” Someone else says nothing, loudly.', effects: { charisma: 2, loyalty: 5, bond: 7, public: 6 } },
        },
      },
      right: {
        label: 'Cause a scene',
        tags: ['drama', 'challenge', 'camera'],
        governingStats: { charisma: 1, rizz: 0.3 },
        outcomes: {
          bad: { text: 'You snog the boy who isn’t yours “for the game.” Your partner accepts this explanation the way one accepts weather.', effects: { charisma: 2, followers: 4, bond: -4, burnout: 3 } },
          good: { text: 'You pie the loudest girl and snog the bombshell. The group chat, later, will need a whole evening.', effects: { charisma: 5, followers: 6, public: 4, bond: -2 } },
          incredible: { text: '“We need a chat,” say three separate couples, at once, to each other. You turned a party game into a cliffhanger. You did that.', effects: { charisma: 8, followers: 10, public: 7, bond: -3, graft: 4 } },
        },
      },
    },
  },
  {
    id: 'li_rumour_mill', act: [2, 3], tags: ['drama', 'strategy'],
    art: 'li_bedroom',
    context: 'Morning · a rumour is loose · it has your name in it',
    prompt: 'Somewhere between the dressing room and the gym, a sentence about you got a haircut and new shoes. The version now circulating says you called your couple “a stepping stone.” You said “next steps.” Once. About a salad.',
    recap: 'A rumour’s loose: it says you called your couple ‘a stepping stone.’',
    choices: {
      left: {
        label: 'Trace it to the source',
        tags: ['strategy', 'drama'],
        governingStats: { savvy: 1 },
        outcomes: {
          bad: { text: 'Your investigation interviews five witnesses and creates two new rumours, both worse, one involving the salad. The salad is now a storyline.', effects: { savvy: 2, burnout: 4, followers: 2 } },
          good: { text: '“It came from YOU?” The sentence traces back through three retellings to an author who folds instantly. Corrections issued. Villa notified. Case closed by lunch.', effects: { savvy: 5, public: 3 } },
          incredible: { text: 'You expose the whole supply chain at the firepit — who said it, who spiced it, who delivered it — with the calm of a detective who’s already eaten. The villa is terrified. Respectfully.', effects: { savvy: 8, public: 5, followers: 4 } },
        },
      },
      right: {
        label: 'Kill it with your couple',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: 'You explain the salad to {partner} in such detail that the salad becomes suspicious. “Why do you remember the salad?” This is your life now.', effects: { loyalty: 2, bond: 1, burnout: 3 } },
          good: { text: 'You take it to {partner} first, before the villa can. “People will keep trying this,” you say. “Let them tire themselves out.” The couple holds; the rumour starves.', effects: { bond: 5, loyalty: 3 } },
          incredible: { text: 'You and {partner} greet the rumour by being so publicly fine that it dies of embarrassment. The author watches their work evaporate. The nation takes a screenshot anyway.', effects: { bond: 6, public: 5, loyalty: 5 } },
        },
      },
    },
  },
  {
    id: 'li_beach_date', act: [2, 3], tags: ['date', 'flirt'],
    art: 'li_beach',
    requires: { singleIs: false },
    context: '“I’VE GOT A TEXT!!” · a date off-site · an actual beach',
    prompt: '“{partner} and you are going on a date. Please get ready to leave the villa. #offgrid” — A car, a coastline, a table set for two by people you’ll never meet. Off-site dates are the show saying: convince us. There’s even a drone, circling the bay so romantically it should have a chaperone.',
    recap: 'Got a text — an off-site beach date, just you and {partner}.',
    choices: {
      left: {
        label: 'Go all in on them',
        tags: ['date', 'loyal'],
        governingStats: { loyalty: 0.6, rizz: 0.4 },
        outcomes: {
          bad: { text: 'You aim for depth and hit interview: “So what ARE your values?” over a prawn. {partner} answers gamely. The prawn suffers most.', effects: { loyalty: 2, bond: 2, burnout: 2 } },
          good: { text: 'Real questions, real answers, and one silence that neither of you needed to fill. On this show, a comfortable silence is a certificate.', effects: { bond: 6, loyalty: 3 } },
          incredible: { text: 'Somewhere between the starter and the sea, it stops being a date on a show and starts being a date. The drone shot gets you both mid-laugh. That’s the poster now.', effects: { bond: 8, public: 5, loyalty: 5 } },
        },
      },
      right: {
        label: 'Give the cameras a show',
        tags: ['camera', 'flirt'],
        governingStats: { charisma: 0.6, rizz: 0.4 },
        outcomes: {
          bad: { text: '“Who’s this for?” asks {partner}, quietly, mid-perfume-advert. The sea declines to comment.', effects: { charisma: 2, followers: 3, bond: -2, burnout: 3 } },
          good: { text: 'Champagne, golden light, one rehearsed-looking kiss that wasn’t. The nation swoons on schedule. The couple banks the montage.', effects: { charisma: 5, followers: 5, public: 4, bond: 2 } },
          incredible: { text: 'The date is so cinematic the episode uses it as the cold open. You are, officially, the couple other couples get compared to. Heavy is the crown; great is the lighting.', effects: { charisma: 8, followers: 8, public: 6, bond: 3 } },
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
    recap: '{ex} is sunbathing near your couple and wants ‘a quick word.’',
    choices: {
      left: {
        label: 'Have the conversation',
        tags: ['chat', 'loyal'],
        governingStats: { loyalty: 0.6, savvy: 0.4 },
        outcomes: {
          bad: { text: 'The quick word takes ninety minutes and relitigates the whole timeline. You return to {partner} with the face of someone back from an audit.', effects: { loyalty: 2, burnout: 4, bond: -2 } },
          good: { text: '“Ten minutes. Then we’re done, properly.” You give it the ten, close the loop, and walk back to your couple in full view. Endings, done properly, are just good manners.', effects: { bond: 4, loyalty: 3, public: 3 } },
          incredible: { text: '“No hard feelings?” — “None left.” The conversation ends with an actual handshake, which the villa finds more shocking than any row. Closure: the rarest twist in the format.', effects: { bond: 5, loyalty: 5, public: 5 } },
        },
      },
      right: {
        label: 'Refuse the summit',
        tags: ['strategy', 'drama'],
        governingStats: { savvy: 1 },
        outcomes: {
          bad: { text: 'You dodge the chat all day, visibly, athletically. By dinner your avoidance is the story, and {ex} hasn’t said a word. Masterful, from them.', effects: { savvy: 2, burnout: 4, followers: 2 } },
          good: { text: '“We’re good. There’s no word needed.” You say it once, kindly, and hold the line. The nation respects a closed door with a smile on it.', effects: { savvy: 5, bond: 3 } },
          incredible: { text: 'Your refusal is so final and so pleasant that {ex} ends up apologising to {partner}, unprompted, on camera. You didn’t attend the drama and still won it.', effects: { savvy: 8, bond: 4, public: 5 } },
        },
      },
    },
  },
  {
    id: 'li_dressing_room_summit', act: [2, 3], tags: ['code', 'chat'],
    art: 'li_bedroom',
    context: 'Night · the dressing room · state of the nation',
    prompt: 'Full dressing-room summit: every girl, every grievance, one shared mirror. Tonight’s agenda is the boys — collectively, individually, and one in particular whose name keeps arriving with a sigh attached. The room wants your reading.',
    recap: 'A full dressing-room summit — tonight’s agenda is the boys.',
    choices: {
      left: {
        label: 'Hold the room together',
        tags: ['code', 'loyal', 'chat'],
        governingStats: { loyalty: 0.6, charisma: 0.4 },
        outcomes: {
          bad: { text: 'Your unity speech is going beautifully until two of your examples turn out to be about the same boy. The summit fractures along entirely new lines. More sighing.', effects: { loyalty: 2, burnout: 3, public: 1 } },
          good: { text: '“Right. One at a time.” You talk the room off three separate ledges and into one shared eyeliner. The girls leave stronger. The boys, downstairs, sense a change in air pressure.', effects: { loyalty: 3, public: 4, addFlag: 'li_code_honour' } },
          incredible: { text: 'By midnight the dressing room has a pact, a plan, and a name (“the coven,” affectionate). You are its unelected chair. The vote doesn’t know it yet, but it just moved.', effects: { loyalty: 5, public: 6, followers: 4, addFlag: 'li_code_honour' } },
        },
      },
      right: {
        label: 'Play the room',
        tags: ['strategy', 'drama'],
        governingStats: { savvy: 1 },
        outcomes: {
          bad: { text: 'You seed two ideas and mislabel a third, and the summit arrives at a conclusion you specifically did not order. Politics is a kitchen you can’t leave mid-soufflé.', effects: { burnout: 3, savvy: 2, addFlag: 'li_code_broke' } },
          good: { text: 'A nudge here, a “no, you said it better” there — the room reaches your conclusion believing it walked there itself. Textbook. Undetectable. Almost.', effects: { savvy: 5, followers: 2, addFlag: 'li_code_broke' } },
          incredible: { text: 'You conduct the dressing room like a small orchestra and by lights-out the villa’s whole week is arranged in your key. If anyone ever checks the tape, you’re done. Nobody checks the tape.', effects: { savvy: 8, followers: 5, addFlag: 'li_code_broke' } },
        },
      },
    },
  },
  {
    id: 'li_challenge_couples', act: 2, tags: ['challenge', 'banter'],
    art: 'li_challenge',
    context: 'The lawn · the couples’ quiz · “How well do you REALLY know each other?”',
    prompt: 'Whiteboards out. “What is your partner’s biggest fear?” The couples who’ve done the work smirk. The couples who haven’t begin, quietly, to perspire. You’re about to find out which one you are, in front of everyone.',
    recap: 'The couples’ quiz — ‘{partner}’s biggest fear?’ on a whiteboard.',
    choices: {
      left: {
        label: 'Trust what you know',
        tags: ['loyal', 'challenge'],
        governingStats: { loyalty: 0.6, savvy: 0.4 },
        outcomes: {
          bad: { text: 'You write “spiders.” The answer was “abandonment.” The lawn does a group “oof.” There is nowhere to put a whiteboard that says spiders.', effects: { loyalty: 2, bond: -2, burnout: 3, followers: 2 } },
          good: { text: '“HOW do you know about the sandwich?” Match after match — the nan’s name, the weird sandwich, the fear. The villa realises, mid-quiz, that your couple has been doing the homework.', effects: { charisma: 2, loyalty: 3, bond: 5, public: 4 } },
          incredible: { text: 'Ten for ten, including the question {partner} got wrong about themselves. “That’s actually right,” they admit, to the lawn’s delight. You know them better than they do. It airs twice.', effects: { charisma: 2, loyalty: 5, bond: 7, public: 6, followers: 4 } },
        },
      },
      right: {
        label: 'Play it for laughs',
        tags: ['banter', 'challenge', 'camera'],
        governingStats: { charisma: 1 },
        outcomes: {
          bad: { text: 'Your joke answers land until “what do you like most about them?” also gets a joke, and the laugh arrives one person short. The one person.', effects: { charisma: 2, followers: 3, bond: -3, burnout: 3 } },
          good: { text: 'You lose the quiz and win the episode: every wrong answer is a bit, every bit lands, and {partner} is crying laughing at their own whiteboard. Zero points. Full marks.', effects: { followers: 5, charisma: 5, bond: 2 } },
          incredible: { text: 'Your whiteboard answers become a running gag the show brings back for three episodes. The quiz has a winner. The Season has a comedian.', effects: { followers: 9, charisma: 8, public: 4 } },
        },
      },
    },
  },
  {
    id: 'li_vote_wobble', act: [2, 3], tags: ['camera', 'strategy'],
    art: 'li_beachhut',
    context: 'The Beach Hut · a producer question with teeth',
    prompt: 'Beach Hut, routine check-in, and then the producer’s voice asks, mildly: “Some viewers say your couple is a game plan. What would you say to them?” The chair is suddenly very upright. The question is a gift, a trap, or both. It’s both.',
    recap: 'Beach Hut — the producer asks if your couple is ‘a game plan.’',
    choices: {
      left: {
        label: 'Answer from the heart',
        tags: ['loyal', 'camera'],
        governingStats: { loyalty: 0.6, charisma: 0.4 },
        outcomes: {
          bad: { text: 'You get genuinely emotional defending your couple, which would play beautifully if you hadn’t started with “look, I know how this looks.” The edit keeps the first half.', effects: { loyalty: 2, public: 1, burnout: 4 } },
          good: { text: '“Then they don’t know us. That’s all.” No media training, one wobble in your voice you don’t bother hiding. The clip runs uncut. The vote softens by Tuesday.', effects: { charisma: 2, loyalty: 3, public: 5, bond: 2 } },
          incredible: { text: 'Your answer is so unguarded the show builds the episode’s emotional arc around it. Doubters keep doubting — quieter, though. Much quieter.', effects: { charisma: 2, loyalty: 5, public: 7, bond: 3, followers: 4 } },
        },
      },
      right: {
        label: 'Handle it like media',
        tags: ['camera', 'strategy'],
        governingStats: { savvy: 0.6, charisma: 0.4 },
        outcomes: {
          bad: { text: 'You deliver a flawless non-answer, and the flawlessness is the problem. “Very polished,” says the internet, meaning something else.', effects: { savvy: 2, followers: 2, public: -2, burnout: 2 } },
          good: { text: '“Tell them thanks for watching.” Genuinely elite deflection — engagement is engagement, and you just converted the haters into metrics.', effects: { charisma: 2, followers: 5, savvy: 5 } },
          incredible: { text: '“If I were playing a game, I’d be winning it, and if I’m not, I’m happy. Pick whichever keeps you watching.” The line escapes the show entirely and gets quoted at bus stops.', effects: { charisma: 2, followers: 9, savvy: 8, public: 4 } },
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
    recap: '{bombshell} took {partner} for ‘a chat,’ and the villa watches you watch.',
    choices: {
      left: {
        label: 'Trust your couple',
        tags: ['loyal', 'rest'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: 'You trust so hard you nap through the debrief, and get the chat’s contents third-hand, garnished, from {rival} of all people. Trust: intact. Nerves: shredded.', effects: { loyalty: 2, bond: 2, burnout: 4 } },
          good: { text: 'You stay on the daybed, unbothered, factor 50 on, and let the chat exhaust itself. {partner} comes straight back to you. The lesson airs nationally.', effects: { bond: 5, loyalty: 3, public: 3 } },
          incredible: { text: 'You wave — one friendly, devastating wave — mid-chat. The graft dies on the spot. {partner} tells the Beach Hut “that’s why, though. That right there.”', effects: { bond: 7, loyalty: 5, public: 6 } },
        },
      },
      right: {
        label: 'Break up the chat',
        tags: ['drama', 'flirt'],
        governingStats: { rizz: 0.5, charisma: 0.5 },
        outcomes: {
          bad: { text: 'You arrive with three drinks nobody asked for and a smile with too many teeth. The chat pauses, politely, until you leave. The daybed grades your entrance a four.', effects: { rizz: 2, bond: 1, burnout: 4, followers: 2 } },
          good: { text: '“Sorry, can I borrow this one?” you say — “I know grafting when I see it, babe” — and leave with {partner} and both waters, ninety seconds in. Clean extraction. The bombshell reviews their notes.', effects: { bond: 4, rizz: 5, followers: 2 } },
          incredible: { text: 'You sit down, befriend the bombshell, and matchmake them with someone else live in the same conversation. Threat converted to subplot. The producers send champagne.', effects: { rizz: 5, bond: 5, savvy: 3, public: 5, followers: 4 } },
        },
      },
    },
  },
  {
    id: 'li_snog_relay', act: 2, tags: ['challenge', 'drama'],
    art: 'li_challenge',
    context: 'The lawn · the Snog Relay · an assault course ending in a kiss',
    prompt: 'Production has built an assault course out of foam, gunge and poor decisions, and the finish line is {partner}, waiting to be snogged. Whichever couple clears the mud, the cargo net and the inflatable wall fastest and kisses cleanest, wins. The klaxon is loading.',
    recap: 'The Snog Relay — a gunge assault course ending in a kiss with {partner}.',
    choices: {
      left: {
        label: 'Race to win',
        tags: ['loyal', 'challenge'],
        governingStats: { loyalty: 0.6, charisma: 0.4 },
        outcomes: {
          bad: { text: 'You go full throttle, take the inflatable wall face-first, and arrive at {partner} caked in gunge and short of breath. The snog, when it lands, tastes of foam. Heart: in it. Dignity: elsewhere.', effects: { loyalty: 2, bond: -2, burnout: 3, followers: 2 } },
          good: { text: 'You power through the course as a team, hit the finish first, and seal it with a snog that stops the clock. Winning and meaning it at once. {partner} beams through a face full of mud.', effects: { loyalty: 3, bond: 5, public: 3 } },
          incredible: { text: 'You clear the course like it owes you money, reach {partner} a full lap ahead, and the winning snog is so unbothered by the gunge the lawn erupts. A couple who’d fight through mud for each other. Noted.', effects: { loyalty: 5, bond: 7, public: 6 } },
        },
      },
      right: {
        label: 'Milk it for the cameras',
        tags: ['strategy', 'camera'],
        governingStats: { savvy: 0.6, charisma: 0.4 },
        outcomes: {
          bad: { text: 'You slow-play the course for the cameras, posing on the cargo net, and lose the race by a mile while {partner} waits, arms folded, at a cold finish. All show, no snog worth filming.', effects: { savvy: 2, bond: -3, burnout: 4, followers: 2 } },
          good: { text: 'You forget the clock and turn the whole run into a bit — a heroic slow-mo through the gunge, a wink at the lens — and lose the race but win the edit. Last place, first clip.', effects: { savvy: 5, followers: 4, drama: 2 } },
          incredible: { text: 'You sacrifice the win entirely to milk every foam-covered second, and the finish-line snog, staged like a film poster, becomes the only moment of the challenge anyone remembers. Strategic. Shameless.', effects: { savvy: 8, followers: 8, drama: 3, public: 3 } },
        },
      },
    },
  },
  {
    id: 'li_villa_roast', act: 2, tags: ['challenge', 'camera'],
    art: 'li_lawn',
    context: 'Evening · the villa roast battle · no material off-limits',
    prompt: 'The villa has invented a roast battle, which is how you learn everyone’s been quietly taking notes on your worst habits for three weeks. The circle turns to you. One round: the mic, the room, and a decision about whose flaws end up on the barbecue.',
    recap: 'The villa roast battle — the circle turns to you, mic in hand.',
    choices: {
      left: {
        label: 'Roast yourself',
        tags: ['loyal', 'banter'],
        governingStats: { charisma: 0.6, loyalty: 0.4 },
        outcomes: {
          bad: { text: 'You go self-deprecating and overshoot into a genuinely bleak two minutes about your dating history. The room laughs, then worries. Bombing and oversharing, at once.', effects: { charisma: 2, bond: 2, burnout: 2 } },
          good: { text: 'You turn the mic on yourself — the snoring, the three-hour tan routine, the crying at the freezer — and the villa loves you harder for it. Nothing disarms a roast like beating them to it.', effects: { charisma: 4, bond: 5, public: 4 } },
          incredible: { text: 'You roast yourself so warmly and so well the whole villa’s wheezing and {partner} is wiping their eyes. You made your own flaws the best bit of the night. Untouchable, now.', effects: { charisma: 6, bond: 7, public: 6, followers: 3 } },
        },
      },
      right: {
        label: 'Go savage on {rival}',
        tags: ['camera', 'drama'],
        governingStats: { charisma: 0.5, rizz: 0.5 },
        outcomes: {
          bad: { text: 'You go savage on {rival} and land two punches too hard, and the room’s laugh curdles into a wince. A roast lives on affection. Yours forgot to pack any.', effects: { charisma: 2, followers: 2, burnout: 3 } },
          good: { text: 'You take {rival} apart with three clean, fond, ruthless lines and they have to laugh because everyone else already is. Savage, but hugging. The clip travels by morning.', effects: { charisma: 5, followers: 6, public: 3 } },
          incredible: { text: 'You roast {rival} so precisely and so lovingly the whole villa loses it and {rival} demands a rematch. A masterclass: every joke a bullseye, not one of them a wound.', effects: { charisma: 8, followers: 10, public: 5, drama: 3 } },
        },
      },
    },
  },
  {
    id: 'li_kettle_diplomacy', act: [2, 3], tags: ['chat', 'strategy'],
    art: 'li_kitchen',
    context: 'Morning · the kitchen · the kettle is power',
    prompt: 'There is one kettle and eleven moods. Whoever runs the morning tea round runs the villa’s temperature for the day, and someone has just clicked it on and called out, “Right — two sugars, yeah babe?” The room is quietly deciding whose kitchen this is.',
    recap: 'One kettle, eleven moods — and the morning tea round is up for grabs.',
    choices: {
      left: {
        label: 'Run the tea round',
        tags: ['chat', 'loyal'],
        governingStats: { charisma: 0.6, loyalty: 0.4 },
        outcomes: {
          bad: { text: 'You muddle four orders and hand {rival} the oat-milk one out of a spite the whole room clocks. A tea round is a temperature check. You’ve just come out cold.', effects: { charisma: 2, bond: -1, burnout: 3 } },
          good: { text: 'Eleven mugs, eleven correct orders, one quiet word with each person who needed one. By ten you’re everyone’s favourite for reasons they can’t quite name.', effects: { charisma: 4, public: 4, bond: 2 } },
          incredible: { text: 'You work the round like a shuttle diplomat — a sugar here, a “you alright?” there — and defuse two rows before breakfast. Nobody notices they were saved.', effects: { charisma: 6, public: 6, savvy: 3 } },
        },
      },
      right: {
        label: 'Sit this one out',
        tags: ['rest', 'strategy'],
        governingStats: { savvy: 0.6, loyalty: 0.4 },
        outcomes: {
          bad: { text: 'You stay in bed and the round goes to someone who runs it like a campaign. By lunch a small alliance exists that you are conspicuously not in. Sleep has a price.', effects: { savvy: 2, burnout: -2, public: -2 } },
          good: { text: 'You sit the round out, top up your own battery, and let the villa politick without you. Rested and unentangled — a rarer state here than it sounds.', effects: { savvy: 3, burnout: -5 } },
          incredible: { text: 'You skip the tea for a quiet swim and come back so unbothered that people start bringing YOU tea to work out your secret. The secret, disappointingly, is boundaries.', effects: { savvy: 4, burnout: -6, public: 4 } },
        },
      },
    },
  },
  {
    id: 'li_the_ick', act: [2, 3], tags: ['chat', 'drama'],
    art: 'li_daybed',
    requires: { singleIs: false },
    context: 'Afternoon · the daybed · a tiny thing you can’t unsee',
    prompt: '{partner} just chased a wasp around the daybed for a full minute, narrating the chase in a little voice, and something in you went quietly, catastrophically cold. This is an ick. Icks are not reasonable. Icks do not care that they’re lovely, actually.',
    recap: '{partner} chased a wasp narrating in a little voice, and an ick landed.',
    choices: {
      left: {
        label: 'Sit with it',
        tags: ['loyal', 'rest'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: 'You white-knuckle through dinner not looking directly at how {partner} holds a fork. The ick, ignored, invites friends. There are now three of them.', effects: { loyalty: 2, burnout: 4, bond: -2 } },
          good: { text: 'You give it a day. By morning the wasp incident is just a daft thing your person does, and the cold snap’s lifted — and you catch yourself doing the little voice back at them.', effects: { loyalty: 4, bond: 3, burnout: -2 } },
          incredible: { text: 'You realise the ick was really nerves about how much you like them, sit with that instead, and come out the far side more into {partner} than you were before.', effects: { loyalty: 6, bond: 6 } },
        },
      },
      right: {
        label: 'Say it out loud',
        tags: ['chat', 'drama'],
        governingStats: { charisma: 0.6, savvy: 0.4 },
        outcomes: {
          bad: { text: '“So — you know when you chased the wasp—” {partner}’s face falls straight through the daybed. Some things do not survive being said aloud. The wasp is lore now.', effects: { charisma: 2, bond: -4, burnout: 3 } },
          good: { text: 'You turn the ick into a bit you share, laughing, and it dissolves in the telling. Named gently, an ick is just a story with two people already in it.', effects: { charisma: 4, bond: 4, public: 2 } },
          incredible: { text: 'You’re so disarmingly honest about the daft little ick that {partner} confesses one of theirs straight back, and you both feel weirdly closer for it. Full disclosure.', effects: { charisma: 5, bond: 6, public: 3 } },
        },
      },
    },
  },
  {
    id: 'li_reassurance', act: [2, 3], tags: ['chat', 'loyal'],
    art: 'li_bedroom',
    requires: { singleIs: false },
    context: 'Night · the bedroom · {partner} is quiet in a loud way',
    prompt: '{partner} has gone quiet — the specific villa quiet that means a bombshell chat landed wrong and a spiral is now happening under the duvet. “I’m fine,” they say, which is villa for the exact opposite of fine, filed under the word fine.',
    recap: '{partner} has gone the loud kind of quiet and said, “I’m fine.”',
    choices: {
      left: {
        label: 'Reassure them',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 0.7, charisma: 0.3 },
        outcomes: {
          bad: { text: 'You reassure so thoroughly that “I’m fine” becomes a ninety-minute inquiry into whether they’re fine, which is now, ironically, the thing they’re not fine about.', effects: { loyalty: 2, burnout: 4, bond: 1 } },
          good: { text: '“I’m not going anywhere. That’s the whole speech.” Sometimes the fix is one sentence and simply staying put. {partner} exhales into your shoulder.', effects: { loyalty: 4, bond: 6 } },
          incredible: { text: 'You name the fear under the quiet — that the bombshell’s here to take their place — and just sit with it, no fixing. {partner} tells the Beach Hut it was the safest they’ve felt since walking in.', effects: { loyalty: 6, bond: 8, public: 3 } },
        },
      },
      right: {
        label: 'Lighten the mood',
        tags: ['banter', 'chat'],
        governingStats: { charisma: 1 },
        outcomes: {
          bad: { text: 'You crack a joke to snap the spiral and it lands in the one second they needed it not to. The duvet gets quieter. That’s a temperature, not a silence.', effects: { charisma: 2, bond: -2, burnout: 3 } },
          good: { text: 'You coax a laugh out of the gloom and the mood lifts on its own. Not every wobble needs a summit. Some just need someone daft and warm lying nearby.', effects: { charisma: 4, bond: 4, burnout: -2 } },
          incredible: { text: 'You turn the whole spiral into a two-person in-joke by lights-out, and {partner} falls asleep smiling. You solved it without ever once naming it. Deft work.', effects: { charisma: 6, bond: 6, followers: 3 } },
        },
      },
    },
  },
  {
    id: 'li_bench_press_summit', act: [2, 3], tags: ['banter', 'strategy', 'encounter'],
    art: 'li_lawn',
    context: 'Morning · the outdoor gym · reps as cover',
    prompt: 'The lads invite you to “spot” them, which in villa dialect means a strategy meeting conducted entirely between sets. “How you finding it, mate, honestly?” one asks, mid-curl, not making eye contact. Nothing tactical has ever once been said standing still in this garden.',
    recap: 'The lads pull you to “spot” them — a summit conducted between sets.',
    choices: {
      left: {
        label: 'Keep it real',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 0.6, charisma: 0.4 },
        outcomes: {
          bad: { text: 'You’re honest about your couple over a set of shoulder press and it travels, embroidered, before you’ve re-racked. The gym has terrible acoustics and worse discretion.', effects: { loyalty: 2, public: -1, burnout: 3 } },
          good: { text: 'You give the lads a straight read and earn a nod that means, in their dialect, respect. You leave with allies and a mild pump. An efficient morning, that.', effects: { loyalty: 4, public: 3, bond: 2 } },
          incredible: { text: 'You say one true thing about loyalty between reps and it becomes the lads’ entire moral code for the week. You didn’t lift much. You moved plenty.', effects: { loyalty: 6, public: 5, followers: 3 } },
        },
      },
      right: {
        label: 'Work the room',
        tags: ['strategy', 'banter'],
        governingStats: { savvy: 0.7, charisma: 0.3 },
        outcomes: {
          bad: { text: 'You fish for intel mid-plank and give away more than you get. It turns out you cannot interrogate and hold a plank at once. One of them fails you. The plank.', effects: { savvy: 2, burnout: 3, followers: 1 } },
          good: { text: 'You read the whole boys’ side in four questions disguised as small talk, and file it. Reps: forgettable. Recon: genuinely excellent. Nobody spotted the census.', effects: { savvy: 5, graft: 3 } },
          incredible: { text: 'You leave the gym knowing every boy’s plan, wobble, and alliance — and not one of them clocked the survey. Cardio, but for the villa map in your head.', effects: { savvy: 8, graft: 4, followers: 3 } },
        },
      },
    },
  },
  {
    id: 'li_bikini_line', act: 2, tags: ['drama', 'banter', 'encounter'],
    art: 'li_lawn',
    context: 'Midday · the washing line · a bikini has gone walkabout',
    prompt: 'Your good bikini — the one that photographs — is currently on {rival}, who’s calling it “communal,” a word that has never once correctly applied to swimwear. “I thought it was in the shared pile, babe.” It was in your drawer. Folded. Effectively signed.',
    recap: '{rival} is sunbathing in your good bikini, calling it “communal.”',
    choices: {
      left: {
        label: 'Let it slide',
        tags: ['loyal', 'rest'],
        governingStats: { loyalty: 0.6, savvy: 0.4 },
        outcomes: {
          bad: { text: 'You say “keep it” through a smile that fools nobody and stew for two days. The bikini looks better on your grudge than it ever did on you.', effects: { loyalty: 2, burnout: 3, drama: 1 } },
          good: { text: 'You genuinely let it go, buy peace for the price of Lycra, and clock that {rival} now quietly owes you one. Cheap, at that price. Filed for later.', effects: { loyalty: 4, savvy: 3, bond: 1 } },
          incredible: { text: 'You gift it outright, loudly, kindly, and turn a small theft into generosity on camera. {rival} is now oddly indebted and the villa thinks you’re a saint.', effects: { loyalty: 5, public: 5, savvy: 3 } },
        },
      },
      right: {
        label: 'Reclaim it',
        tags: ['drama', 'camera'],
        governingStats: { charisma: 0.6, rizz: 0.4 },
        outcomes: {
          bad: { text: 'You retrieve the bikini mid-sunbathe with a speech, and the speech runs longer than the bikini. You win the garment and lose the moral high ground. Net loss.', effects: { charisma: 2, drama: 2, burnout: 3, public: -1 } },
          good: { text: '“That’s mine, babe — you can borrow it, just ask.” One sentence, retrieved with a smile. A boundary set, no blood spilt. The washing line respects you now.', effects: { charisma: 4, public: 4, followers: 3 } },
          incredible: { text: 'You reclaim it so smoothly it becomes a masterclass in the polite no. Two other girls quietly repossess their own things by teatime. You’ve started a movement.', effects: { charisma: 6, public: 6, followers: 4, savvy: 2 } },
        },
      },
    },
  },
  {
    id: 'li_truth_or_dare', act: 2, tags: ['banter', 'drama'],
    art: 'li_bedroom',
    context: 'Night · the bedroom · the bottle is spinning',
    prompt: 'Lights low, drinks flat, and the game that’s ended more villa couples than any recoupling: Truth or Dare. The bottle stops on you. “Truth,” someone purrs. “Who in here would you couple up with if you were single?” The room leans in as a single organism.',
    recap: 'The bottle stops on you: “Who would you couple up with if you were single?”',
    choices: {
      left: {
        label: 'Play it safe',
        tags: ['loyal', 'strategy'],
        governingStats: { loyalty: 0.6, savvy: 0.4 },
        outcomes: {
          bad: { text: '“Honestly? No one, I’m so happy.” True, safe, and the room deflates like a punctured lilo. You survived the question and quietly murdered the game.', effects: { loyalty: 2, bond: 2, burnout: 2 } },
          good: { text: 'You give a diplomatic non-answer with a wink for {partner} and the bottle spins on. Nobody hurt, nothing on fire, couple intact. A quiet, unshowy win.', effects: { loyalty: 4, savvy: 3, bond: 2 } },
          incredible: { text: 'You fold the question into a compliment for {partner} so smoothly the whole room “awws” and forgets it wanted blood. Dodged and scored in one breath.', effects: { loyalty: 5, bond: 5, public: 3 } },
        },
      },
      right: {
        label: 'Cause chaos',
        tags: ['drama', 'camera'],
        governingStats: { charisma: 0.6, rizz: 0.4 },
        outcomes: {
          bad: { text: 'You name a name “as a joke,” and the joke does not read as one to the two people it concerns. The bottle keeps spinning. The fallout, notably, does not.', effects: { charisma: 2, drama: 2, bond: -3, burnout: 3 } },
          good: { text: 'You take the dare instead — a theatrical kiss on the cheek of whoever’s to your left — and the clip becomes the night’s headline. Harmless, viral, delicious.', effects: { charisma: 4, followers: 5, drama: 2 } },
          incredible: { text: 'You answer with a name so unexpected the bedroom erupts and three side-chats begin before the bottle’s even stopped wobbling. You lit the fuse, not the match.', effects: { charisma: 6, followers: 8, drama: 3, public: 3 } },
        },
      },
    },
  },
  {
    id: 'li_blindfold_guess', act: 2, tags: ['challenge', 'flirt'],
    art: 'li_challenge',
    context: 'The lawn · the Blindfold Challenge · a line-up and a blindfold',
    prompt: 'They blindfold you, spin you twice, and line the villa up shoulder to shoulder. The task: find {partner} by hand, by voice, by the smell of their aftershave alone. The lawn goes silent so the mics catch whatever you murmur groping down the row.',
    recap: 'Blindfolded, you have to pick {partner} out of a silent line-up by touch alone.',
    choices: {
      left: {
        label: 'Find them for real',
        tags: ['flirt', 'loyal'],
        governingStats: { rizz: 0.5, loyalty: 0.5 },
        outcomes: {
          bad: { text: 'You get overconfident, grab a jaw you’re certain is {partner}’s, and it belongs to {mate}, who yelps. You find {partner} eventually, three people down, mildly humiliated. Points for trying.', effects: { rizz: 2, bond: 1, burnout: 2 } },
          good: { text: 'You go down the line slow, and the second your hand finds {partner}’s the laugh they can’t hold in gives them away. You pull the blindfold off grinning. The lawn awws.', effects: { rizz: 4, bond: 5, public: 3 } },
          incredible: { text: 'You clock {partner} instantly — the aftershave, the way they breathe when you’re near — and skip the line-up entirely. “Knew it was you.” The lawn dissolves. Recoupling-level stuff, off a blindfold.', effects: { rizz: 6, bond: 7, public: 5, followers: 3 } },
        },
      },
      right: {
        label: 'Play it up for the crowd',
        tags: ['flirt', 'camera'],
        governingStats: { rizz: 0.6, charisma: 0.4 },
        outcomes: {
          bad: { text: 'You ham up the search for the cameras — sniffing necks, gasping, milking every second — and linger a beat too long on {rival}. {partner}, blindfold off, is not laughing. Content up, couple down.', effects: { rizz: 2, followers: 3, bond: -3, burnout: 3 } },
          good: { text: 'You turn the guess into a performance — a dramatic pause at each face, a wrong guess played for the gasp — and only then land on {partner}. The lawn howls. {partner} half-forgives the theatre.', effects: { rizz: 5, followers: 5, public: 3, bond: -1 } },
          incredible: { text: 'You make the blindfold guess the funniest three minutes of the week — a fake-out, a swoon, a reveal timed like a magician — and still end on {partner}. The clip’s trending before the blindfolds are off.', effects: { rizz: 8, followers: 9, public: 4, drama: 2 } },
        },
      },
    },
  },
  {
    id: 'li_two_truths_firepit', act: [2, 3], tags: ['gossip', 'chat'],
    art: 'li_firepit',
    context: 'Night · the firepit · a game with a sharp edge',
    prompt: 'Somebody suggests Two Truths and a Lie “to get to know each other better,” which around this firepit means “to extract confessions under cover of a party game.” It’s your go. Whatever you pick, one of your truths is going to do numbers by morning.',
    recap: 'Two Truths and a Lie at the firepit — and it’s your go.',
    choices: {
      left: {
        label: 'Keep it clean',
        tags: ['chat', 'loyal'],
        governingStats: { loyalty: 0.6, charisma: 0.4 },
        outcomes: {
          bad: { text: 'Your three statements are so wholesome the villa guesses the lie instantly and loses interest. You survived the firepit by being too nice to burn. A win, technically.', effects: { loyalty: 2, charisma: 1, burnout: 2 } },
          good: { text: 'You keep it light, land a laugh, and give absolutely nothing away. The game moves on none the wiser. Getting-to-know-you, expertly not delivered.', effects: { loyalty: 3, charisma: 3, bond: 2 } },
          incredible: { text: 'You offer one real, small, disarming truth that softens the whole firepit toward you. Vulnerability, portion-controlled. The nation clips it before you’ve sat down.', effects: { loyalty: 4, charisma: 4, public: 5, followers: 3 } },
        },
      },
      right: {
        label: 'Hide a secret in it',
        tags: ['strategy', 'camera'],
        governingStats: { savvy: 0.6, charisma: 0.4 },
        outcomes: {
          bad: { text: 'You hide your real secret as the “lie,” they guess it’s true, and now everyone knows the thing you were hiding, presented by you, gift-wrapped. An own goal.', effects: { savvy: 2, drama: 2, public: -2, burnout: 3 } },
          good: { text: 'You slip a genuine confession past the entire firepit disguised as fiction and watch them wave it off as the lie. Hidden in plain sight. Quietly masterful.', effects: { savvy: 5, followers: 3 } },
          incredible: { text: 'You feed the firepit a “lie” that reframes your whole villa arc in your favour, and they thank you for the honesty of the other two. Strategy played as a sport.', effects: { savvy: 8, followers: 5, public: 3 } },
        },
      },
    },
  },
  {
    id: 'li_bombshell_confides', act: [2, 3], tags: ['chat', 'gossip', 'encounter'],
    art: 'li_pool',
    requires: { singleIs: false },
    context: 'Afternoon · the pool steps · a bombshell needs a word',
    prompt: '{bombshell} slides down onto the pool steps beside you and drops it low: “Can I be dead honest with you? I think I fancy someone who’s taken. What would you do?” It is a test, a confession, and a request for permission, all in one wet whisper.',
    recap: '{bombshell} confides at the pool: they fancy someone who’s taken.',
    choices: {
      left: {
        label: 'Give real advice',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 0.6, charisma: 0.4 },
        outcomes: {
          bad: { text: 'You tell {bombshell} to “follow their gut,” forgetting that a bombshell’s gut is a wrecking ball. By evening a good couple is un-coupled and you’re an accessory.', effects: { loyalty: 2, drama: 2, burnout: 3 } },
          good: { text: '“Be honest with them, but don’t wreck a good thing just to test it.” Steady advice, kindly given. {bombshell} listens. The villa keeps its shape one more day.', effects: { loyalty: 4, public: 3, bond: 1 } },
          incredible: { text: 'You talk {bombshell} down so wisely they decide to graft elsewhere entirely, and thank you for it later, on camera. A bomb defused with a chat by the pool.', effects: { loyalty: 6, public: 5, savvy: 2 } },
        },
      },
      right: {
        label: 'Get the name first',
        tags: ['strategy', 'gossip'],
        governingStats: { savvy: 0.7, charisma: 0.3 },
        outcomes: {
          bad: { text: 'You dig for the name and {bombshell} clocks you digging, clams up, and now files you as the villa’s information broker. Which — fair. But out loud, now.', effects: { savvy: 2, drama: 2, public: -2, burnout: 2 } },
          good: { text: 'You get the name before you give a single word of advice, and file it before {bombshell}’s even dried off. Intel first, morality later. Standard villa order.', effects: { savvy: 5, graft: 2 } },
          incredible: { text: 'You extract the whole plan, the name, and the timeline, offer flawless-sounding advice that quietly protects your own corner, and leave the pool three moves ahead.', effects: { savvy: 8, followers: 3, graft: 3 } },
        },
      },
    },
  },
  {
    id: 'li_treats_delivery', act: [2, 3], tags: ['text', 'banter'],
    art: 'li_kitchen',
    context: '“I’VE GOT A TEXT!!” · a delivery · morale in a cool box',
    prompt: '“Islanders. A treat has arrived. You have one bottle of proper champagne and one box of Magnums between the lot of you. Distribute among yourselves. #sharenicely” — Production has, once again, sent slightly too little of something lovely to eleven competitive adults. The cool box sits there like a dare.',
    recap: 'Got a text — one bottle, one box of Magnums, eleven Islanders.',
    choices: {
      left: {
        label: 'Share it fairly',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 0.6, charisma: 0.4 },
        outcomes: {
          bad: { text: 'You appoint yourself fair-shares monitor and cut eleven identical Magnum portions with a butter knife, and somehow still get accused of favouritism. No winning a cool box.', effects: { loyalty: 2, burnout: 2, drama: 1 } },
          good: { text: 'You make sure the quiet ones get theirs first and the loud ones notice you noticing. A fairly split treat is a small, delicious act of leadership.', effects: { loyalty: 4, public: 4, bond: 2 } },
          incredible: { text: 'You turn a stingy delivery into the warmest half hour of the week — everyone served, nobody short, one toast that actually lands. That’s just hosting, really.', effects: { loyalty: 6, public: 6, followers: 3 } },
        },
      },
      right: {
        label: 'Work the moment',
        tags: ['strategy', 'camera'],
        governingStats: { savvy: 0.5, charisma: 0.5 },
        outcomes: {
          bad: { text: 'You angle for the champagne pour and the good camera spot at once and fumble both, sending fizz across the counter and your credibility along with it. Sticky.', effects: { savvy: 2, burnout: 2, public: -1 } },
          good: { text: 'You quietly make sure you and {partner} get the toast on camera, glasses up, golden hour. Romance, sponsored by production’s tiny budget. The montage thanks you.', effects: { savvy: 4, followers: 4, bond: 2, public: 2 } },
          incredible: { text: 'You orchestrate the whole treat into a couple moment so cinematic the episode leads on it. One Magnum, two people, national telly. Genuine value for money.', effects: { savvy: 6, followers: 8, public: 4, bond: 2 } },
        },
      },
    },
  },
  {
    id: 'li_safe_couple', act: [2, 3], tags: ['strategy', 'chat'],
    art: 'li_daybed',
    requires: { singleIs: false },
    context: 'Afternoon · the daybed · a dangerous kind of comfortable',
    prompt: 'You and {partner} have gone quiet in the good way — content, sorted, no drama — which is lovely and, on this show, borderline reckless. “We’re giving very… settled,” {partner} murmurs, watching a bombshell cause a delicious scene across the lawn. Settled doesn’t get screen time.',
    recap: 'You and {partner} have gone comfortably, dangerously settled.',
    choices: {
      left: {
        label: 'Stay solid',
        tags: ['loyal', 'rest'],
        governingStats: { loyalty: 0.7, charisma: 0.3 },
        outcomes: {
          bad: { text: 'You decide being solid is enough and coast for a week, and the edit agrees you’re not worth cutting to. Safe from drama, not safe from the vote. Oops.', effects: { loyalty: 2, burnout: 2, public: -2 } },
          good: { text: 'You trust that a real, calm couple is its own story and keep being precisely that. The nation, worn out by the chaos, adopts you as its palate cleanser.', effects: { loyalty: 4, public: 4, bond: 3 } },
          incredible: { text: 'You lean so fully into the quiet, honest thing that you accidentally become the couple everyone’s rooting for. Settled, done right, turns out to be the whole point.', effects: { loyalty: 6, public: 7, bond: 4, followers: 3 } },
        },
      },
      right: {
        label: 'Make a spark',
        tags: ['strategy', 'camera'],
        governingStats: { savvy: 0.5, charisma: 0.5 },
        outcomes: {
          bad: { text: 'You stage a “playful” tiff for the cameras and {partner} misses the memo, so a fake row becomes a real one by dinner. You wanted drama. You got the invoice.', effects: { savvy: 2, bond: -3, burnout: 3, drama: 1 } },
          good: { text: 'You cook up a bit of on-screen mischief together — a dare, a wind-up, a wager — and hand the edit something to work with. Manufactured, sure. But it aired.', effects: { savvy: 4, followers: 4, public: 3 } },
          incredible: { text: 'You and {partner} conspire to reinvent your own couple mid-week, storyline and all, so smoothly nobody clocks it was written by the two of you. Producers, out-produced.', effects: { savvy: 7, followers: 7, public: 4, bond: 2 } },
        },
      },
    },
  },
  {
    id: 'li_prank_war', act: 2, tags: ['banter', 'camera'],
    art: 'li_kitchen',
    context: 'Morning · the kitchen · war declared with cling film',
    prompt: 'The boys have cling-filmed every doorway, salted the sugar, and left a fake text on the side that gave two girls a genuine cardiac event. “It’s just banter,” they chorus, wearing the specific grin of men who’ve started something. The girls want a response, and they’re looking at you.',
    recap: 'The boys have declared a prank war, and the girls hand you the strategy.',
    choices: {
      left: {
        label: 'Escalate cleverly',
        tags: ['banter', 'strategy'],
        governingStats: { savvy: 0.5, charisma: 0.5 },
        outcomes: {
          bad: { text: 'Your revenge prank hits the wrong boy and floods the wrong bed, opening a second front in a war you were supposed to be winning. Cling film, now, everywhere.', effects: { savvy: 2, burnout: 3, drama: 1 } },
          good: { text: 'You mastermind a comeback — protein swapped for custard, beds short-sheeted — that lands so cleanly the boys concede over breakfast. Firmly the girls’ round.', effects: { savvy: 4, charisma: 3, followers: 4 } },
          incredible: { text: 'You engineer a prank so elaborate it needs a diagram, executes it flawlessly, and it airs as the cold open. The villa surrenders. You take footage, not prisoners.', effects: { savvy: 6, charisma: 5, followers: 8, public: 3 } },
        },
      },
      right: {
        label: 'Rise above it',
        tags: ['loyal', 'rest'],
        governingStats: { loyalty: 0.5, charisma: 0.5 },
        outcomes: {
          bad: { text: 'You refuse to retaliate and spend the day being visibly the bigger person, which reads, on camera, as faintly smug. Sainthood is a hard look at eight in the morning.', effects: { loyalty: 2, public: -1, burnout: 2 } },
          good: { text: 'You laugh it off, peel the cling film from the door, and deny the boys the reaction they were filming for. Anticlimax is its own victory. They deflate by noon.', effects: { loyalty: 3, charisma: 3, public: 3 } },
          incredible: { text: 'You turn the whole prank into a bit at the boys’ expense without lifting a finger, purely by being unbothered and very funny about it. A war won by not fighting.', effects: { loyalty: 4, charisma: 5, public: 5, followers: 3 } },
        },
      },
    },
  },
  {
    id: 'li_upping_the_graft', act: 2, tags: ['flirt', 'loyal'],
    art: 'li_terrace',
    context: 'Evening · the terrace · graft, phase two',
    prompt: 'A bombshell has started leaving {partner} little gifts — a Mini Milk here, a compliment there — and the villa has clocked it. Time to remind everyone whose person that is. You’ve got fairy lights nicked off the daybed, a bedsheet, and a plan for a surprise date built entirely from villa scraps.',
    recap: 'A bombshell’s grafting {partner} with Mini Milks — time to out-graft them.',
    choices: {
      left: {
        label: 'Build the surprise',
        tags: ['flirt', 'loyal'],
        governingStats: { rizz: 0.5, loyalty: 0.5 },
        outcomes: {
          bad: { text: 'The fairy lights blow the villa’s one dodgy fuse and you unveil your surprise date in the pitch dark, by phone torch. {partner} finds it romantic. The other nine find it inconvenient.', effects: { rizz: 2, bond: 2, burnout: 3 } },
          good: { text: '“You did all this? With a bedsheet?” {partner} clocks every borrowed detail and melts anyway. The bombshell’s Mini Milks look, suddenly, like a very small ambition.', effects: { rizz: 5, bond: 5, loyalty: 3 } },
          incredible: { text: 'You turn the terrace into a proper date night — nicked fairy lights, a playlist, their favourite snack from the freezer. {partner} tells the Beach Hut “nobody’s ever bothered like that.” Graft, aimed right.', effects: { rizz: 6, bond: 8, public: 5, loyalty: 3 } },
        },
      },
      right: {
        label: 'Just tell them plainly',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: 'You go for the big honest speech and open with “so, the Mini Milks—” which makes it sound like the snacks turned your head. {partner} is now confused about ice lollies and about you.', effects: { loyalty: 2, bond: 1, burnout: 2 } },
          good: { text: '“I’m not competing with a lolly, babe. I’m just yours, and I wanted to say it out loud.” No production, no props. {partner} kisses you before you’ve finished. Plain works.', effects: { loyalty: 5, bond: 5 } },
          incredible: { text: 'You skip the grand gesture and say the small true thing — that you’d pick them on any day, gift or no gift. {partner} repeats it to the girls verbatim for a week. Loudest quiet move of the Season.', effects: { loyalty: 8, bond: 7, public: 4 } },
        },
      },
    },
  },
  {
    id: 'li_small_lie', act: 2, tags: ['chat', 'drama', 'encounter'],
    art: 'li_kitchen',
    context: 'Afternoon · the kitchen · a small story that doesn’t add up',
    prompt: '“I was literally just making a tea, babe,” {partner} says, except you watched them come off the daybed where {bombshell} had them laughing for twenty minutes, and the kettle’s stone cold. It’s a tiny lie. Tiny lies in here don’t stay tiny.',
    recap: '{partner} said they were making tea; the kettle’s cold and you saw the daybed.',
    choices: {
      left: {
        label: 'Call it out gently',
        tags: ['chat', 'loyal'],
        governingStats: { loyalty: 0.5, savvy: 0.5 },
        outcomes: {
          bad: { text: '“The kettle’s cold, though.” You say it flat and {partner} gets defensive, and a twenty-minute daybed chat becomes a two-hour row about trust. The tea, notably, never happens.', effects: { loyalty: 2, bond: -3, burnout: 4 } },
          good: { text: '“I don’t care about the chat. I care that you dressed it up.” You name the actual problem, calmly, and {partner} folds and owns it. The lie dies smaller than it lived.', effects: { loyalty: 5, bond: 4, savvy: 2 } },
          incredible: { text: 'You raise it so fairly that {partner} not only admits it but thanks you for not making a scene. The villa’s most honest conversation happens over a cold kettle. Trust, repaired in real time.', effects: { loyalty: 6, bond: 7, public: 4 } },
        },
      },
      right: {
        label: 'Let it slide, watch closely',
        tags: ['strategy', 'rest'],
        governingStats: { savvy: 1 },
        outcomes: {
          bad: { text: 'You say nothing and file it, and the not-saying eats you through dinner until you snap over something unrelated — the garlic bread. Suppressed suspicion always picks the wrong exit.', effects: { savvy: 2, burnout: 4, bond: -2 } },
          good: { text: 'You let the small lie go but quietly recalibrate, and by keeping your powder dry you spot the pattern before it becomes a problem. Patience is a strategy nobody claps for.', effects: { savvy: 5, loyalty: 2 } },
          incredible: { text: 'You say nothing, change nothing, and simply become someone {partner} can’t get anything past — warmly. They start telling you the truth pre-emptively, just in case. Deterrence, villa-style.', effects: { savvy: 8, bond: 3, loyalty: 3 } },
        },
      },
    },
  },
  {
    id: 'li_og_divide', act: 2, tags: ['code', 'strategy'],
    art: 'li_firepit_day',
    context: 'Afternoon · the firepit · originals versus the new lot',
    prompt: 'The villa has quietly split down a seam: the OGs who’ve done the time, and the bombshells who arrived to sunshine and stole the good beds. A daft comment at lunch — “you lot act like you own the place” — has drawn the line in permanent marker. Both sides want you on their bench.',
    recap: 'The villa’s split into OGs and new arrivals, and both sides want your bench.',
    choices: {
      left: {
        label: 'Hold the line for the OGs',
        tags: ['code', 'loyal'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: 'You go full originals-only and it curdles into a clique so obvious the newbies bond over hating it. You wanted unity; you built the enemy’s recruitment drive.', effects: { loyalty: 2, drama: 2, burnout: 3, public: -1 } },
          good: { text: 'You back the people who were here through the hard weeks, plainly, and the OGs close ranks around you. Loyalty to the day-ones reads well when it isn’t cruel.', effects: { loyalty: 5, public: 3 } },
          incredible: { text: 'You defend the OGs without once punching down at the new lot, and somehow both sides respect it. You held a line and left a door open. Politics, done with grace.', effects: { loyalty: 6, public: 6, savvy: 3 } },
        },
      },
      right: {
        label: 'Broker a truce',
        tags: ['strategy', 'chat'],
        governingStats: { savvy: 0.6, charisma: 0.4 },
        outcomes: {
          bad: { text: 'Your peace summit seats both factions at the firepit and immediately relitigates the bed situation from Day 9. The marker line gets redrawn, thicker. Diplomacy is a contact sport.', effects: { savvy: 2, drama: 2, burnout: 3 } },
          good: { text: 'You get the two sides swapping actual names instead of “you lot,” and the seam heals by dinner. Nobody remembers who started it, which is the whole point.', effects: { savvy: 5, public: 4 } },
          incredible: { text: 'You dissolve the divide with one well-aimed joke and one genuine apology you engineer someone else to make. By nightfall it’s one villa again, and only you know how. Untraceable statecraft.', effects: { savvy: 8, public: 6, followers: 3 } },
        },
      },
    },
  },
  {
    id: 'li_villa_postbox', act: 2, tags: ['gossip', 'drama'],
    art: 'li_lawn',
    context: 'Evening · the lawn · a shoebox with a slot in it',
    prompt: 'Someone’s made a villa postbox — a shoebox with a slot — for anonymous notes, “just a bit of fun.” Nothing anonymous has ever been fun in this villa. The box gets opened at the firepit, and a note lands with your name on it and a sentence you’ll be dissecting till Casa.',
    recap: 'The anonymous villa postbox opens, and a note about you gets read aloud.',
    choices: {
      left: {
        label: 'Laugh it off',
        tags: ['banter', 'rest'],
        governingStats: { charisma: 0.6, loyalty: 0.4 },
        outcomes: {
          bad: { text: 'You laugh too hard, too fast, and the overcorrection tells everyone the note landed. The box wins. The box always wins.', effects: { charisma: 2, burnout: 3, drama: 1 } },
          good: { text: 'You take the anonymous dig on the chin, fire back one good line, and hand the note zero power. The author, wherever they’re sitting, deflates.', effects: { charisma: 4, public: 3 } },
          incredible: { text: 'You read your own note aloud, roast it, and thank the coward who wrote it — and the whole lawn is on your side by the second sentence. You turned a sniper’s nest into your open mic.', effects: { charisma: 6, public: 6, followers: 3 } },
        },
      },
      right: {
        label: 'Find the handwriting',
        tags: ['gossip', 'strategy'],
        governingStats: { savvy: 1 },
        outcomes: {
          bad: { text: 'Your handwriting investigation accuses the wrong person, loudly, and now you owe an apology and a rival owes you nothing. Forensics is harder than it looks by fairy light.', effects: { savvy: 2, burnout: 4, public: -2 } },
          good: { text: 'You match the loops and the spite to a source in one quiet afternoon, and have the word privately. No scene, just a name that now knows you know.', effects: { savvy: 5, public: 3 } },
          incredible: { text: 'You trace the whole postbox scheme to its author and their motive with the calm of someone who’s done this before. You don’t even out them. You just let them watch you not need to.', effects: { savvy: 8, followers: 3, public: 4 } },
        },
      },
    },
  },
  {
    id: 'li_clear_the_air', act: [2, 3], tags: ['loyal', 'chat', 'encounter'],
    art: 'li_bedroom',
    context: 'Night · the bedroom · the morning’s row still in the air',
    prompt: '“I don’t even remember what it was about,” {partner} says, which is a lie you both allow, because the row this morning was loud and the whole villa heard the good bits. Now it’s lights-out and neither of you has moved to the other side of the bed. Someone has to go first.',
    recap: 'After a loud morning row, it’s lights-out and neither of you has crossed the bed.',
    choices: {
      left: {
        label: 'Apologise first',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: 'You say sorry and can’t resist adding “but,” and the “but” reopens the whole thing at midnight. An apology with a clause is just a rematch with manners.', effects: { loyalty: 2, bond: -1, burnout: 3 } },
          good: { text: '“I hate this. Can we just be us again.” You go first, no scorekeeping, and {partner} meets you halfway across the bed. Rows end when someone decides they’re over.', effects: { loyalty: 5, bond: 5 } },
          incredible: { text: 'You own your half so cleanly that {partner} owns theirs without being asked, and you fall asleep sorted. The couple that repairs fast is the couple that lasts. The Beach Hut agrees.', effects: { loyalty: 7, bond: 8, public: 4 } },
        },
      },
      right: {
        label: 'Hold your ground',
        tags: ['drama', 'loyal'],
        governingStats: { loyalty: 0.5, savvy: 0.5 },
        outcomes: {
          bad: { text: 'You both hold your ground so firmly you sleep back-to-back on the world’s most public bed, and the wide shot catches the demilitarised zone down the middle. Stalemate, broadcast.', effects: { loyalty: 2, bond: -3, burnout: 4 } },
          good: { text: 'You don’t cave just to end it — you say what actually needs fixing, kindly, and refuse to paper over it. {partner} respects the spine. The repair, when it comes, is real.', effects: { loyalty: 5, bond: 3, savvy: 2 } },
          incredible: { text: 'You hold the line without heat, name the pattern under the row, and {partner} realises you’re not fighting them but for the couple. You didn’t win the argument. You retired it.', effects: { loyalty: 6, bond: 6, savvy: 3, public: 3 } },
        },
      },
    },
  },
  {
    id: 'li_favour_called', act: 2, tags: ['strategy', 'code'],
    art: 'li_daybed',
    context: 'Midday · the daybed · a debt comes due',
    prompt: 'Weeks ago {mate} covered for you — took a hit in a group chat, kept a secret, backed your version at the firepit. Today, on the daybed, they call it in: “I need you with me on this one, yeah?” The favour is real. So is the fact that they’re asking you to back a story you’re not sure about.',
    recap: '{mate} calls in an old favour — back their story at the firepit, right or not.',
    choices: {
      left: {
        label: 'Honour the debt',
        tags: ['loyal', 'code'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: 'You back {mate}’s version and it collapses under one follow-up question, taking your credibility down with it. Loyalty to a bad story is just two people wrong together.', effects: { loyalty: 2, public: -2, burnout: 3 } },
          good: { text: 'You stand with {mate} because they stood with you, and say so openly. It costs you a little standing and buys a bond nothing in here can. Debts, paid.', effects: { loyalty: 5, bond: 3, public: 2 } },
          incredible: { text: 'You back your mate and steer them to the true version at the same time, so the favour’s honoured and nobody gets burned. Loyalty and honesty, threaded through one needle.', effects: { loyalty: 6, savvy: 3, public: 4, bond: 2 } },
        },
      },
      right: {
        label: 'Owe them another way',
        tags: ['strategy', 'chat'],
        governingStats: { savvy: 0.6, loyalty: 0.4 },
        outcomes: {
          bad: { text: '“So it’s conditional now, our friendship?” {mate} takes your hedge as a betrayal and the debt turns into a grievance with interest. Some IOUs only accept the currency requested.', effects: { savvy: 2, bond: -3, burnout: 3 } },
          good: { text: '“I can’t back that one — but I’ve got you on anything true.” You decline the specific ask without ducking the friendship. {mate} isn’t thrilled, but they get it.', effects: { savvy: 5, loyalty: 2 } },
          incredible: { text: 'You refuse to co-sign the story yet repay the favour twice over in ways that actually help {mate}, and they end up more grateful than if you’d just lied. Debt cleared, upgraded.', effects: { savvy: 8, bond: 4, public: 3 } },
        },
      },
    },
  },
];
