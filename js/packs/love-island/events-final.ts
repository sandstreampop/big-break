// Love Island — Act 3 ambient deck (Final Week) + the Summit-affinity cards
// (Acts 2–3, weighted toward your declared Intention). The vote surges, the
// couples calcify, and everyone starts practising their reunion face.

import type { GameEvent } from '../../types.js';

export const FINAL_EVENTS: GameEvent[] = [
  {
    // Retheme (Hillevi: the baby challenge is retired — "they don't really do
    // it anymore, scrap that"). Replaced with a current Final-Week staple: the
    // villa Prom. Same shape and effects — a couple gesture, sincere vs content.
    id: 'li_final_prom', act: 3, tags: ['challenge', 'loyal'],
    art: 'li_challenge',
    context: 'Final Week · “I’VE GOT A TEXT!!” · the villa Prom',
    prompt: '“Islanders, tonight is the villa Prom. Suits, gowns, corsages — and each of you will make a gesture for the person you’re coupled up with. #promnight” — The last big set-piece before the Final. Fairy lights, a slow song, and a lawn full of people about to say things they’ll be quoted on forever.',
    recap: 'Got a text — the villa Prom, and a gesture owed to {partner}.',
    choices: {
      left: {
        label: 'Make it about them',
        tags: ['loyal', 'challenge'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: '“Right, I wrote something down—” Your speech is all heart and no order, and you land it on “…anyway, you know what I mean.” {partner} does know. Just about.', effects: { loyalty: 2, bond: 1, burnout: 4 } },
          good: { text: '“I’m not being funny, I’ve never felt like this about anyone. On paper, off paper, all of it — it’s you.” No notes, all nerve. {partner} goes properly quiet. The lawn “awws” as one.', effects: { loyalty: 5, bond: 6, public: 4 } },
          incredible: { text: 'You do the whole thing — the corsage, the line you practised (“you’re the first person I’ve not tried to impress”), the slow dance nobody choreographed. “That’s my person, that is,” {partner} tells the villa, wet-eyed.', effects: { bond: 8, public: 6, loyalty: 8 } },
        },
      },
      right: {
        label: 'Make it a moment for the cameras',
        tags: ['banter', 'camera'],
        governingStats: { charisma: 1 },
        outcomes: {
          bad: { text: 'You go big — confetti cannon, a bit, a wink at the fixed cam — and the confetti jams on the one word that mattered. Funny. {partner}’s face, less so.', effects: { charisma: 2, followers: 3, bond: -2, burnout: 3 } },
          good: { text: 'You turn the promposal into a full production and the lawn eats it up. Somewhere a producer prints “PROM ROYALTY” on a card. Content: banked.', effects: { followers: 6, charisma: 5 } },
          incredible: { text: 'Your prom bit escalates into a villa-wide musical number with you at the centre of it. Best telly of the week, and everyone in it knows.', effects: { followers: 10, public: 5, charisma: 8 } },
        },
      },
    },
  },
  {
    id: 'li_vote_surge', act: 3, tags: ['camera', 'strategy'],
    art: 'li_phone',
    context: 'Evening · the outside world leaks in',
    prompt: 'A dumped Islander’s exit interview has aired, and with it, a rumour of the standings: your couple is “in the conversation.” The villa pretends not to care about the vote the way cats pretend not to care about the fridge.',
    recap: 'Word leaks in: your couple is ‘in the conversation’ for the vote.',
    choices: {
      left: {
        label: 'Keep doing what works',
        tags: ['loyal', 'rest'],
        governingStats: { loyalty: 0.6, savvy: 0.4 },
        outcomes: {
          bad: { text: '“Is that joke still touring?” asks {mate}. You changed absolutely nothing, which unfortunately includes the sat-nav joke. The conversation, wherever it is, moves on slightly.', effects: { loyalty: 2, bond: 2, burnout: 2 } },
          good: { text: 'No campaign, no pivot — just your couple doing its quiet thing while the favourites have a scream-up about a jet-ski. A jet-ski, mate. The vote likes a constant. You’re the constant.', effects: { loyalty: 5, bond: 4, public: 4 } },
          incredible: { text: 'Your total indifference to the standings becomes its own storyline: “they don’t even know they’re winning.” The most electable sentence on television.', effects: { loyalty: 8, bond: 5, public: 7 } },
        },
      },
      right: {
        label: 'Court the vote',
        tags: ['camera', 'strategy'],
        governingStats: { charisma: 0.6, savvy: 0.4 },
        outcomes: {
          bad: { text: 'You start playing to the fixed cameras like a weather presenter. The villa notices in one afternoon. The nation noticed before lunch.', effects: { charisma: 2, public: -2, followers: 3, burnout: 3 } },
          good: { text: 'A little more Beach Hut, a little more banter at the fixed cams, one strategic heart-to-heart on the good sofa. Subtle. Effective. Deniable.', effects: { charisma: 5, public: 5, followers: 3 } },
          incredible: { text: 'You engineer a week of perfect television without one visible seam. If this is a campaign, it’s the best-run one the villa has ever hosted.', effects: { charisma: 6, public: 8, followers: 5, savvy: 2 } },
        },
      },
    },
  },
  {
    id: 'li_last_supper', act: 3, tags: ['chat', 'loyal'],
    art: 'li_kitchen',
    context: 'Night · the villa cooks for itself · last proper dinner',
    prompt: 'One long table, everyone still standing, and a lasagne with structural issues. It’s the last dinner before the Final and the villa knows it: the banter keeps snagging on sincerity. Somebody clinks a glass. Speeches are coming.',
    recap: 'The last dinner before the Final — someone clinks a glass for speeches.',
    choices: {
      left: {
        label: 'Give the speech',
        tags: ['chat', 'camera'],
        governingStats: { charisma: 0.6, loyalty: 0.4 },
        outcomes: {
          bad: { text: 'Your toast starts strong, tours the whole Season, and gets lost around Casa. Somebody coughs “speeeech” at your speech. The lasagne cools in solidarity.', effects: { charisma: 2, burnout: 3, public: 1 } },
          good: { text: '“We were strangers with matching water bottles, and now I’d take a bullet for the lot of you—” You land the whole daft, sunburnt truth of it before the tears do. Glasses up. Even {rival} drinks to it.', effects: { charisma: 3, public: 5, loyalty: 2, bond: 2 } },
          incredible: { text: 'Your toast makes the villa cry, laugh, and toast the LASAGNE, in that order. The clip becomes how the Season is remembered. No pressure on the Final at all.', effects: { charisma: 8, public: 7, followers: 5, bond: 2 } },
        },
      },
      right: {
        label: 'Stay off the mic',
        tags: ['loyal', 'rest'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: 'You dodge the toast and get voluntold anyway — “what about YOU?” — with a mouth full of garlic bread. You gesture with it. The gesture trends, mildly.', effects: { loyalty: 2, followers: 2, burnout: 2 } },
          good: { text: 'You skip the speeches and do the washing-up with {partner}, hip to hip, while the table gets misty. The wide shot finds you anyway. Wide shots always do.', effects: { loyalty: 5, bond: 5, public: 3, burnout: -2 } },
          incredible: { text: 'No speech — just you, quietly topping up every glass at the exact right moments. The villa only realises at the end who hosted the whole night. The nation realised first.', effects: { bond: 5, public: 6, loyalty: 8 } },
        },
      },
    },
  },
  {
    id: 'li_packing_wobble', act: 3, tags: ['chat', 'rest'],
    art: 'li_bedroom',
    context: 'Afternoon · suitcases have appeared · everyone is weird about it',
    prompt: 'Production has quietly delivered everyone’s suitcases “for the Final,” and the sight of them has made the villa mortal. Out there: rent, exes, daylight that isn’t graded. “Weird, isn’t it,” says {partner}, looking at their case like a verdict, not laughing.',
    recap: 'The suitcases arrived ‘for the Final,’ and the villa’s gone mortal.',
    choices: {
      left: {
        label: 'Talk about the outside',
        tags: ['chat', 'loyal'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: 'The outside chat gets real so fast you end up comparing commutes. Ninety minutes on trains. The romance survives, but it now knows about Zone 4.', effects: { loyalty: 2, bond: 3, burnout: 3 } },
          good: { text: '“Okay. Whose mates first?” The scary conversation — cities, jobs, logistics — with the suitcases right there. It holds. Out loud, with dates in it. The realest thing in this villa.', effects: { bond: 6, loyalty: 5 } },
          incredible: { text: 'By the end there’s a plan with dates in it. Actual dates. Calendar ones. The Beach Hut cries about it later, and so, quietly, does the nation.', effects: { bond: 8, loyalty: 8, public: 5 } },
        },
      },
      right: {
        label: 'Keep the bubble sealed',
        tags: ['rest', 'flirt'],
        governingStats: { rizz: 0.5, savvy: 0.5 },
        outcomes: {
          bad: { text: 'You hide the suitcases behind the daybed. Production returns them by dinner, with a note. The bubble has a landlord and it isn’t you.', effects: { rizz: 2, burnout: 3, bond: 1 } },
          good: { text: '“Outside doesn’t exist till Friday.” You declare a bubble amnesty and spend the day at the pool like it’s week one. Sometimes denial is self-care with sunglasses.', effects: { rizz: 5, bond: 4, burnout: -4 } },
          incredible: { text: 'You turn suitcase day into a fashion show of everyone’s arrival outfits — who they were, versus who they are. Nostalgia, laughter, one meaningful look. Television.', effects: { rizz: 8, bond: 4, followers: 5, public: 5, burnout: -3 } },
        },
      },
    },
  },
  {
    id: 'li_final_dressup', act: 3, tags: ['camera', 'banter'],
    art: 'li_bedroom',
    context: 'The last day · outfits · war paint',
    prompt: 'Final prep. The dressing room is a Formula 1 pit lane of steamers and setting spray. Your outfit for tonight is either “timeless” or “a lot,” depending which mirror you ask. The mirrors are split. The nation will not be.',
    recap: 'Final prep — your outfit for tonight is ‘timeless’ or ‘a lot.’',
    choices: {
      left: {
        label: 'Timeless',
        tags: ['strategy', 'camera'],
        governingStats: { savvy: 0.6, charisma: 0.4 },
        outcomes: {
          bad: { text: 'You go classic and vanish slightly into the fairy lights. Elegant, said nobody’s group chat, is a synonym for beige.', effects: { savvy: 2, public: 1, burnout: 2 } },
          good: { text: 'Clean lines, no gimmicks, nothing for the memes to grab. Tonight the story is your face and what it does when the votes are read. Correct.', effects: { public: 4, savvy: 5 } },
          incredible: { text: 'The understatement is so complete it becomes the statement. “Everyone else dressed for the party,” writes a fashion desk at midnight. “They dressed for the win.”', effects: { savvy: 8, public: 6, followers: 5 } },
        },
      },
      right: {
        label: 'A lot',
        tags: ['camera', 'drama'],
        governingStats: { charisma: 1 },
        outcomes: {
          bad: { text: 'The sequins have opinions and the opinions catch on the daybed at the worst moment. You enter the Final with a hem situation and a story to tell.', effects: { charisma: 2, followers: 3, burnout: 3 } },
          good: { text: 'You commit to the full spectacle and the spectacle commits back. Three gasps at the top of the stairs. Tonight’s screenshots are pre-sold.', effects: { followers: 5, public: 3, charisma: 5 } },
          incredible: { text: 'The outfit gets its own trending topic before you’ve reached the lawn. Win or lose, the reunion invite is now a formality.', effects: { followers: 9, public: 5, charisma: 8 } },
        },
      },
    },
  },
  {
    id: 'li_morning_after_drama', act: 3, tags: ['drama', 'code'],
    art: 'li_lawn',
    context: 'Morning · Final Week nerves · a spark near the petrol',
    prompt: 'Final Week pressure does strange chemistry: two Islanders who’ve been fine for weeks are suddenly not fine, loudly, over toast. Toast, mate. It’s the wobbly lounger all over again. Alliances are being audited in real time — yours included — and neutrality has three days left to live.',
    recap: 'Final Week — two Islanders who were fine are suddenly not, over toast.',
    choices: {
      left: {
        label: 'Defuse it',
        tags: ['chat', 'loyal'],
        governingStats: { loyalty: 0.5, savvy: 0.5 },
        outcomes: {
          bad: { text: 'You mediate so evenly that both sides briefly unite against the mediation. There’s a lesson in there and you learn it holding the toast.', effects: { loyalty: 2, burnout: 3, public: 1 } },
          good: { text: '“Sit. Eat. Both of you.” Ten minutes, two separate benches, one shared plate of eggs at the end. The villa’s last row dies quietly, and the Final keeps its shine.', effects: { public: 4, loyalty: 5 } },
          incredible: { text: 'You settle it so completely the two of them walk into the Final arm in arm, crediting you by name on live TV. Peacemaker: confirmed, broadcast, banked.', effects: { public: 7, loyalty: 8, followers: 4 } },
        },
      },
      right: {
        label: 'Let it burn',
        tags: ['strategy', 'drama'],
        governingStats: { savvy: 1 },
        outcomes: {
          bad: { text: 'You watch from the kitchen and someone clocks you enjoying it. “You could’ve said something.” You could have. The toast was excellent, though.', effects: { savvy: 2, burnout: 3, public: -2, followers: 2 } },
          good: { text: 'You stay out of the blast radius and let Final Week do its own pruning. Cold? The word is “strategic.” The vote can’t punish what it finds relatable.', effects: { savvy: 5, followers: 3 } },
          incredible: { text: 'The row eliminates two rivals’ goodwill in one morning while you were visibly elsewhere, doing yoga. Impeccable alibi. Immaculate timing. Suspiciously immaculate.', effects: { savvy: 8, followers: 5, public: 4 } },
        },
      },
    },
  },
  {
    id: 'li_legacy_chat', act: 3, tags: ['chat', 'camera'],
    art: 'li_beachhut',
    context: 'The Beach Hut · the retrospective question',
    prompt: 'The Beach Hut wants the retrospective: “Looking back at your Season — the coupling, the drama, all of it — what would you tell the person who walked in on Day 1?” The chair creaks. Somewhere in the question is the version of you the nation will keep.',
    recap: 'Beach Hut wants the retrospective — a message back to Day 1 you.',
    choices: {
      left: {
        label: 'Be honest about it',
        tags: ['chat', 'loyal'],
        governingStats: { loyalty: 0.6, charisma: 0.4 },
        outcomes: {
          bad: { text: 'You’re so honest you fact-check your own arc, twice, out loud. The edit keeps the corrections. Authenticity: confirmed. Elegance: pending.', effects: { loyalty: 2, public: 2, burnout: 2 } },
          good: { text: '“I’d tell her she’s going to embarrass herself, and it’s going to be worth it.” The Hut gets the sentence the whole Season was building to.', effects: { public: 5, loyalty: 5, followers: 2 } },
          incredible: { text: 'Your retrospective is so generous — to your exes, your rivals, your own worst week — that the show closes an episode on it. That’s the edit deciding you’re the heart of the Season.', effects: { loyalty: 8, public: 7, followers: 5, bond: 2 } },
        },
      },
      right: {
        label: 'Write the legend',
        tags: ['camera', 'strategy'],
        governingStats: { charisma: 0.6, savvy: 0.4 },
        outcomes: {
          bad: { text: 'You attempt mythology — “the villa doesn’t change you, it reveals you” — and the Hut camera holds the silence one beat too long. Even the chair is unconvinced.', effects: { charisma: 2, followers: 2, burnout: 2 } },
          good: { text: 'You deliver a tight, quotable arc of yourself: the entrance, the wobble, the comeback. Podcast-ready. The clips desk cuts it before you’ve left the Hut.', effects: { charisma: 3, followers: 5, savvy: 2 } },
          incredible: { text: 'You narrate your Season so well the actual edit adopts your framing. From tonight, the show tells your story in your words. That’s not screen time. That’s authorship.', effects: { charisma: 6, followers: 8, public: 5, savvy: 2 } },
        },
      },
    },
  },
  {
    id: 'li_odd_couple', act: 3, tags: ['banter', 'chat'],
    art: 'li_lawn',
    context: 'Afternoon · an unlikely friendship files its paperwork',
    prompt: 'Somewhere along the Season, you and {rival} stopped circling, and today it tips over. “You’re alright, you know,” they say, one genuinely nice poolside hour deep, to their designated antagonist. The villa doesn’t know what to do with it. Neither does the edit.',
    recap: 'You and {rival} stopped circling — today the friendship tips over.',
    choices: {
      left: {
        label: 'Make peace official',
        tags: ['chat', 'loyal'],
        governingStats: { loyalty: 0.5, charisma: 0.5 },
        outcomes: {
          bad: { text: 'You announce the truce at dinner like a press release and the villa, starved of conflict, immediately investigates it for cracks. Peace has never been so stressful.', effects: { loyalty: 2, public: 2, burnout: 3 } },
          good: { text: '“I did hate you,” {rival} clarifies, mid-hug. “Massively.” Specifics named, apologies exchanged. The Season’s longest cold war ends on a Tuesday.', effects: { public: 5, loyalty: 5, removeFlag: 'li_rival_active' } },
          incredible: { text: 'The reconciliation is so real it becomes the episode’s emotional peak — two enemies laughing about the exact moments the nation used to scream at. Growth: televised.', effects: { public: 7, followers: 5, loyalty: 8, removeFlag: 'li_rival_active' } },
        },
      },
      right: {
        label: 'Keep the storyline',
        tags: ['strategy', 'camera'],
        governingStats: { savvy: 1 },
        outcomes: {
          bad: { text: 'You keep the feud alive for the cameras and {rival}, hurt, makes it real again. Careful what you perform; the villa has no rehearsal space.', effects: { savvy: 2, followers: 3, public: -2, burnout: 3 } },
          good: { text: 'You two agree, privately, to stay “rivals” on camera — the villa’s first scripted enemies-to-frenemies deal. The content flows; the friendship stays off-books.', effects: { followers: 5, savvy: 5 } },
          incredible: { text: 'Your fake feud is so entertaining it carries the pre-Final episode, and only you two know it’s a bit. A double act the reunion will eventually expose, to universal delight.', effects: { followers: 9, savvy: 8, public: 4 } },
        },
      },
    },
  },

  // ---------- Summit-affinity cards (Acts 2–3, weighted to your Intention) ----------
  {
    id: 'li_wv_publicity', act: [2, 3], pathAffinity: ['winvilla'], tags: ['camera', 'loyal'],
    art: 'li_lawn',
    context: 'The couple audit · the nation is grading',
    prompt: 'A challenge leaks the couples’ approval rankings, and yours is close enough to the top to taste it. Winning the villa is not a montage, mate — it’s three straight weeks of being the couple the sofa points at and says “them.” Consistency is the campaign.',
    recap: 'The couples’ approval rankings leaked, and yours is near the top.',
    choices: {
      left: {
        label: 'Be the steady couple',
        tags: ['loyal', 'date'],
        governingStats: { loyalty: 0.6, rizz: 0.4 },
        outcomes: {
          bad: { text: 'Steady tips into sensible, and sensible gets four minutes of screen time. Reliability, the edit reminds you, is not a genre.', effects: { loyalty: 2, bond: 3, public: 1 } },
          good: { text: '“Them,” says every sofa in the country, pointing. While the top couple wobbles in public, yours quietly makes dinner together. The rankings breathe.', effects: { loyalty: 5, bond: 4, public: 5 } },
          incredible: { text: 'A week without a single crack, on a show engineered to make them. The nation starts using your names as one word. That’s the whole election, won.', effects: { loyalty: 8, bond: 5, public: 8 } },
        },
      },
      right: {
        label: 'Give them a moment',
        tags: ['camera', 'flirt'],
        governingStats: { charisma: 0.5, rizz: 0.5 },
        outcomes: {
          bad: { text: 'The staged “spontaneous” slow dance hits the exact wrong song and the wrong sprinkler. Romance: damp. Clip: viral, for the sprinkler.', effects: { charisma: 2, followers: 3, public: 1, burnout: 2 } },
          good: { text: 'One unscripted-looking gesture — the jacket, the rain, the run across the lawn — lands on the night’s promo. The vote loves a poster.', effects: { charisma: 5, public: 6, followers: 3 } },
          incredible: { text: 'You produce a moment so cinematic the show rebuilds the episode around it. Other couples have storylines. Yours has a trailer.', effects: { charisma: 8, public: 8, followers: 5, bond: 2 } },
        },
      },
    },
  },
  {
    id: 'li_wv_nation_darling', act: [2, 3], pathAffinity: ['winvilla'], tags: ['camera', 'chat'],
    art: 'li_phone',
    context: 'A twist · questions from the public',
    prompt: '“Islanders, tonight the public have sent in questions. You will answer them at the firepit. #askthemanything” — The envelope with your name is thick. The public asks what it actually wants to know, which is never what you rehearsed.',
    recap: 'Got a text — the public sent questions to answer at the firepit.',
    choices: {
      left: {
        label: 'Answer everything straight',
        tags: ['chat', 'loyal'],
        governingStats: { loyalty: 0.6, charisma: 0.4 },
        outcomes: {
          bad: { text: 'You answer the hard one honestly and gift the villa a fresh 48 hours of discourse. Honesty scores with the vote and bills the couple.', effects: { loyalty: 2, public: 3, bond: -2, burnout: 3 } },
          good: { text: '“Honestly? Week two, I was a shambles—” No dodging, no lawyer answers, one genuinely funny admission. The firepit warms to you. So does the scoreboard.', effects: { loyalty: 5, public: 6, followers: 2 } },
          incredible: { text: 'Your answers are so disarming the public’s questions turn into compliments by the third envelope. A hostile format, converted live. Vote-winning behaviour.', effects: { loyalty: 8, public: 9, followers: 4 } },
        },
      },
      right: {
        label: 'Charm the envelope',
        tags: ['camera', 'banter'],
        governingStats: { charisma: 1 },
        outcomes: {
          bad: { text: 'You do bits over the hard questions, and the firepit lets you, and the sofa at home does not. “Evasive,” says the nation, in unison, at 9:47 p.m.', effects: { charisma: 2, followers: 3, public: -2, burnout: 2 } },
          good: { text: '“Great question. Next one?” You take the spikiest envelope of the night and return it with topspin. Laughter buys you the room; the room buys you votes.', effects: { charisma: 5, public: 5, followers: 4 } },
          incredible: { text: 'Your envelope segment out-rates the argument segment — a first. The public asked for blood and left chanting your name. That’s a finalist.', effects: { charisma: 8, public: 8, followers: 6 } },
        },
      },
    },
  },
  {
    id: 'li_wv_underdogs', act: 3, pathAffinity: ['winvilla'], tags: ['loyal', 'camera'],
    art: 'li_firepit_day',
    context: 'Final stretch · the favourites stumble',
    prompt: 'The bookies’ favourite couple just had a firepit row about, of all things, a jet-ski. A JET-SKI. The lane to the front is suddenly open. The nation loves a late surge almost as much as it loves the couple that doesn’t chase one.',
    recap: 'The favourites just rowed over a jet-ski — the lane to the front’s open.',
    choices: {
      left: {
        label: 'Stay above it',
        tags: ['loyal', 'rest'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: 'You stay so far above it you float out of the episode entirely. Grace, unwitnessed, is a tree falling in a forest of jet-skis.', effects: { loyalty: 2, bond: 3, public: 1 } },
          good: { text: '“Snacks?” you offer the rowing couple, taking no sides whatsoever. The contrast does your campaigning for you, in HD, all evening.', effects: { loyalty: 5, public: 6, bond: 3 } },
          incredible: { text: 'While the favourites feud, your couple has the quiet, ordinary, devastatingly likeable night that ends up closing the episode. The surge finds you. You never chased it.', effects: { loyalty: 8, public: 9, bond: 3 } },
        },
      },
      right: {
        label: 'Seize the lane',
        tags: ['strategy', 'camera'],
        governingStats: { savvy: 0.6, charisma: 0.4 },
        outcomes: {
          bad: { text: 'Your surge is visible from space: suddenly you’re everywhere, agreeing with everyone, holding a guitar at one point. The nation smells campaign. Deductions applied.', effects: { savvy: 2, public: -2, followers: 3, burnout: 3 } },
          good: { text: 'You spend the evening being exactly where the cameras needed someone likeable. Opportunism, executed warmly, is indistinguishable from charisma.', effects: { public: 5, followers: 3, savvy: 5 } },
          incredible: { text: 'You read the villa’s mood, the edit’s needs, and the vote’s appetite in one glance, and serve all three in one night. The bookies quietly reprice you by morning.', effects: { public: 8, followers: 5, savvy: 8 } },
        },
      },
    },
  },
  {
    id: 'li_rt_deep_end', act: [2, 3], pathAffinity: ['realthing'], tags: ['chat', 'loyal'],
    art: 'li_terrace',
    context: 'Night · the terrace · past the small talk',
    prompt: 'Somewhere past midnight the conversation with {partner} runs out of shallow water. “Okay,” they say, quieter. “Actual question.” Family. The thing with the dad. The reason for the wall. This is the chat that decides whether you’re a couple or a coupling.',
    recap: 'Past midnight, {partner} goes quiet: ‘Actual question.’ Family. The wall.',
    choices: {
      left: {
        label: 'Go first',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: 'You open the vault and it all comes out in the wrong order, ending on the hamster. {partner} holds your hand through the whole inventory. That’s data too.', effects: { loyalty: 2, bond: 4, burnout: 3 } },
          good: { text: '“Okay. Me first, then.” You say the real thing, and it costs you, and they meet it with theirs. Two walls down in one night. The mics get none of it. The Connection gets all of it.', effects: { bond: 7, loyalty: 5 } },
          incredible: { text: 'What you tell them, you’ve never told anyone with a pulse. They don’t flinch. Around 2 a.m. the villa stops being a set and becomes, briefly, a place where you live.', effects: { bond: 9, loyalty: 8 } },
        },
      },
      right: {
        label: 'Draw them out',
        tags: ['chat', 'strategy'],
        governingStats: { loyalty: 0.5, savvy: 0.5 },
        outcomes: {
          bad: { text: 'Your gentle questions land like a podcast interview, and {partner} notices the format. “Are you doing a technique on me?” You were. It was working.', effects: { loyalty: 2, bond: 2, burnout: 3 } },
          good: { text: 'You ask the one question nobody else has bothered to, and then just wait. The answer takes ten minutes and changes the couple’s temperature permanently.', effects: { loyalty: 3, bond: 6, savvy: 2 } },
          incredible: { text: 'They talk until sunrise. At the end they look at you like you found a door in a house they’d lived in for years. You didn’t say fifty words. You didn’t need to.', effects: { bond: 8, loyalty: 6, savvy: 2 } },
        },
      },
    },
  },
  {
    id: 'li_rt_bad_day', act: [2, 3], pathAffinity: ['realthing'], tags: ['loyal', 'chat'],
    art: 'li_bedroom',
    requires: { singleIs: false },
    context: 'A grey day · {partner} is off · properly off',
    prompt: '{partner} has been quiet since breakfast — not sulking, just somewhere else, behind their own eyes. The villa’s official toolkit for this is “a chat on the swing seat.” The real test is whether you can be useful to someone at their worst on a show that only films bests.',
    recap: '{partner}’s been somewhere else behind their eyes since breakfast.',
    choices: {
      left: {
        label: 'Sit with it',
        tags: ['loyal', 'rest'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: 'You hover so supportively that {partner} ends up comforting you about how worried you are. A classic reversal. The swing seat has seen it all before.', effects: { loyalty: 2, bond: 2, burnout: 3 } },
          good: { text: 'No fixing, no fetching people, no speech. Just you, next to them, for as long as it takes. When they finally talk, it’s because the silence was safe. You built that.', effects: { bond: 6, loyalty: 5 } },
          incredible: { text: 'You spend a whole unfilmable afternoon being quietly essential, and the show, with nothing to cut to, airs four minutes of two people on a swing seat. It’s the realest thing this format has shown all year.', effects: { bond: 8, loyalty: 8, public: 5 } },
        },
      },
      right: {
        label: 'Lift the mood',
        tags: ['banter', 'date'],
        governingStats: { charisma: 0.6, rizz: 0.4 },
        outcomes: {
          bad: { text: 'You deploy the full entertainment package at someone who needed a blanket. The juggling was technically proficient. The room was not a juggling room.', effects: { charisma: 2, bond: 1, burnout: 3, followers: 2 } },
          good: { text: '“Absolutely not,” they say, already laughing. One stupid bit, exactly their humour, at exactly the right minute. The laugh cracks something open. The chat follows on its own.', effects: { bond: 5, charisma: 5 } },
          incredible: { text: 'You resurrect their whole day with a bit so specifically THEIRS — the impression, the callback, the thing with the spatula — that they realise, visibly, mid-laugh, that you’ve been paying attention since Day 1.', effects: { bond: 7, charisma: 8, public: 4 } },
        },
      },
    },
  },
  {
    id: 'li_rt_no_cameras', act: 3, pathAffinity: ['realthing'], tags: ['loyal', 'date'],
    art: 'li_lawn',
    context: 'Dawn · a camera blind spot · allegedly',
    prompt: 'There’s a corner of the garden the Islanders swear the cameras can’t see. It can’t possibly be true. But at 5 a.m., with {partner} and two mugs of tea, you’re both willing to believe in it — one conversation with no audience, real or imagined.',
    recap: '5 a.m. in the villa’s alleged blind spot — you, {partner}, no audience.',
    choices: {
      left: {
        label: 'Say the thing you’ve been swallowing',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: 'You say it, and a bird lands on the wall, and you both jump like it’s a boom mic with feathers. The moment survives. Your dignity negotiates.', effects: { loyalty: 2, bond: 4, burnout: 2 } },
          good: { text: '“I’ve stopped rehearsing what to say around you — that’s never once happened to me.” You say it where there might be no camera. “Say it again,” they ask, quietly, and whether it airs stops mattering halfway through.', effects: { bond: 7, loyalty: 5 } },
          incredible: { text: 'Whatever was said at 5 a.m. in the blind spot, neither of you will ever repeat it, on the show or after it. The nation never finds out. The Connection never forgets.', effects: { bond: 10, loyalty: 8 } },
        },
      },
      right: {
        label: 'Just watch the sunrise',
        tags: ['rest', 'date'],
        governingStats: { loyalty: 0.5, rizz: 0.5 },
        outcomes: {
          bad: { text: 'You share a horizon in silence until the sprinklers, on their 5:15 schedule, editorialise. Romance on this lawn has always been on a timer.', effects: { loyalty: 2, bond: 3, burnout: -2 } },
          good: { text: 'No chat, no game, two teas going cold at the exact same rate. The best conversation your couple has had contains zero words.', effects: { loyalty: 5, bond: 6, burnout: -4 } },
          incredible: { text: 'The sun comes up on two people who don’t need the villa anymore, sitting in it anyway. If the cameras did see it, even the gallery kept quiet.', effects: { loyalty: 8, bond: 8, burnout: -5, public: 4 } },
        },
      },
    },
  },
  {
    id: 'li_br_sponsor_bait', act: [2, 3], pathAffinity: ['brand'], tags: ['camera', 'graft'],
    art: 'li_phone',
    context: 'A challenge with a logo on it',
    prompt: 'Today’s challenge is transparently sponsored — a smoothie brand has bought the morning, and the winner gets “a year’s supply.” Nobody needs a year of smoothies. Everybody needs what you can do with a branded segment and thirty seconds of camera.',
    recap: 'A smoothie brand bought the morning challenge — a year’s supply on the line.',
    choices: {
      left: {
        label: 'Win it properly',
        tags: ['challenge', 'graft'],
        governingStats: { savvy: 0.5, charisma: 0.5 },
        outcomes: {
          bad: { text: 'You want it too visibly and take out {mate}’s knee rounding the blender station. The smoothies are secured. The apology tour takes longer.', effects: { savvy: 2, graft: 3, public: -2, burnout: 3 } },
          good: { text: 'You win the branded gauntlet with a competence that borders on concerning. The brand’s social team clips you before the villa’s finished clapping.', effects: { savvy: 5, graft: 5, followers: 5 } },
          incredible: { text: 'You win it, name-check the product with a wink so precise it can’t be cut, and mime a sponsorship handshake at the fixed cam. The brand reposts you within the hour. Invoice energy.', effects: { savvy: 8, graft: 6, followers: 9, public: 4 } },
        },
      },
      right: {
        label: 'Steal it anyway',
        tags: ['banter', 'camera'],
        governingStats: { charisma: 1 },
        outcomes: {
          bad: { text: 'You lose the challenge AND the bit: your smoothie “review” offends the brand, the villa, and one specific banana. Legal watches the tape twice.', effects: { charisma: 2, followers: 3, public: -2, burnout: 3 } },
          good: { text: '“And the smoothie’s fine too,” you concede, dead last, mid-commentary. The segment is functionally yours. The winner holds the smoothies. You hold the audience.', effects: { followers: 6, charisma: 5 } },
          incredible: { text: 'Your loser’s acceptance speech for a smoothie challenge becomes the episode’s most-clipped moment. Brands take notes. Plural. You can hear the pens.', effects: { followers: 10, charisma: 8, graft: 4 } },
        },
      },
    },
  },
  {
    id: 'li_br_catchphrase', act: [2, 3], pathAffinity: ['brand'], tags: ['banter', 'camera'],
    art: 'li_lawn',
    context: 'An ordinary Tuesday · a star is workshopping',
    prompt: 'Every Islander who ever built an empire left this place with a catchphrase, and you don’t have one yet. You’ve got a shortlist. The villa is your focus group, whether it knows it or not. (It must never know it.)',
    recap: 'Every villa legend leaves with a catchphrase. You’re still auditioning yours.',
    choices: {
      left: {
        label: 'Seed it naturally',
        tags: ['banter', 'strategy'],
        governingStats: { savvy: 0.6, charisma: 0.4 },
        outcomes: {
          bad: { text: '“Why do you keep SAYING that?” asks {mate}, four deployments before lunch. A catchphrase that gets noticed being planted is a crime scene.', effects: { savvy: 2, followers: 2, burnout: 3 } },
          good: { text: 'You drop it once, perfectly, at the height of a group laugh. By dinner two people have repeated it. Organic reach, farmed by hand.', effects: { followers: 5, savvy: 5 } },
          incredible: { text: 'The phrase escapes the villa on the same night’s episode and by morning it has fan art. You built a meme with your bare hands and everyone thinks it was an accident. Correct.', effects: { followers: 9, savvy: 8, public: 4 } },
        },
      },
      right: {
        label: 'Go big at the firepit',
        tags: ['camera', 'drama'],
        governingStats: { charisma: 1 },
        outcomes: {
          bad: { text: 'You engineer a firepit moment for the line and the line arrives DOA — too rehearsed, wrong crowd, someone sneezes in the pause. The sneeze gets the clip.', effects: { charisma: 2, followers: 2, public: -1, burnout: 3 } },
          good: { text: 'The moment comes, you say the thing, the firepit erupts. Cameras don’t catch lightning; they catch people who scheduled it.', effects: { followers: 6, charisma: 5 } },
          incredible: { text: 'The line lands so hard the Host quotes it back at the next ceremony. When the format starts doing your marketing, the brand isn’t coming — it’s here.', effects: { followers: 10, public: 5, charisma: 8 } },
        },
      },
    },
  },
  {
    id: 'li_br_villain_turn', act: [2, 3], pathAffinity: ['brand'], tags: ['drama', 'camera'],
    art: 'li_firepit_day',
    context: 'The edit is knocking · villain hours',
    prompt: 'The show has started cutting to you whenever anything spicy happens — the edit is auditioning you for villain, and villains, historically, out-earn winners. The role is right there. It just costs the thing roles always cost.',
    recap: 'The edit keeps cutting to you for the spicy bits — villain casting, basically.',
    choices: {
      left: {
        label: 'Take the role',
        tags: ['drama', 'camera'],
        governingStats: { charisma: 0.6, savvy: 0.4 },
        outcomes: {
          bad: { text: 'You lean in and pick the wrong scene: your “villain moment” lands on the villa’s most beloved Islander, mid-wobble. Boos you can hear through the walls. Even the edit winces.', effects: { charisma: 2, followers: 4, public: -4, burnout: 4 } },
          good: { text: '“Well, someone had to say it.” The sharp thing everyone was circling, delivered with a raised eyebrow and perfect posture. The villa gasps; the internet crowns you. Villainy is just honesty with styling.', effects: { followers: 7, public: -2, charisma: 5 } },
          incredible: { text: 'One firepit monologue and you’re the villain of the Season — quotable, gif-able, unbothered. The nation boos with its whole chest and keeps watching with its whole schedule.', effects: { followers: 11, public: -2, charisma: 8, graft: 4 } },
        },
      },
      right: {
        label: 'Refuse the edit',
        tags: ['loyal', 'strategy'],
        governingStats: { loyalty: 0.5, savvy: 0.5 },
        outcomes: {
          bad: { text: 'You dodge the villain edit by being aggressively pleasant for a week, and vanish from three consecutive episodes. The moral high ground has terrible reception.', effects: { loyalty: 2, public: 2, followers: -2, burnout: 2 } },
          good: { text: 'You sidestep every trap the edit lays and stay stubbornly, watchably decent. The slower brand. The one with a longer shelf life.', effects: { public: 4, loyalty: 5, followers: 2 } },
          incredible: { text: 'You call the edit out IN the Beach Hut — “I know what you’re doing, and I’m boring, deal with it” — and the show, delighted, airs it. Anti-villain: somehow the freshest brand of all.', effects: { loyalty: 6, public: 6, followers: 7, savvy: 2 } },
        },
      },
    },
  },
];
