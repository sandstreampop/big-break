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
  {
    id: 'li_meet_the_parents', act: 3, tags: ['chat', 'loyal', 'encounter'],
    art: 'li_lawn',
    context: 'Final Week · families in the villa · everyone on best behaviour',
    prompt: '“So YOU’RE the one that’s had them up all night,” says {partner}’s mum, arms folded, the kettle already on. Family day: the people who raised your Islander have come to inspect whoever’s been sharing their bed on national television. No notes, no running.',
    recap: 'Family day — {partner}’s mum has arrived to inspect you over the kettle.',
    choices: {
      left: {
        label: 'Win the family over',
        tags: ['chat', 'loyal'],
        governingStats: { loyalty: 0.6, charisma: 0.4 },
        outcomes: {
          bad: { text: '“Lovely. Bit much,” the mum tells {partner} after. You overcorrected into a job interview and answered “what are your intentions” with a whole slide deck of feelings.', effects: { loyalty: 2, public: 1, burnout: 3 } },
          good: { text: '“You’ll do,” the mum decides, over the second cuppa. You skip the sales pitch, ask about {partner} aged seven, laugh at the baby photos properly. Approved, on the record.', effects: { loyalty: 5, bond: 4, public: 3 } },
          incredible: { text: 'By the time the families go, {partner}’s mum has your number, a hug, and a warning — “don’t you dare hurt them.” You won the room that built the person. Best endorsement going.', effects: { loyalty: 8, bond: 6, public: 5 } },
        },
      },
      right: {
        label: 'Let them lead',
        tags: ['loyal', 'rest'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: 'You go so deferential the mum reads it as hiding something. “They’re shy,” {partner} covers. The kettle boils twice into the silence.', effects: { loyalty: 2, bond: 1, burnout: 2 } },
          good: { text: 'You step back and let {partner} beam about you to their own mum. Watching them be proud of you, out loud, to family, beats any speech you’d have fumbled.', effects: { bond: 5, loyalty: 4 } },
          incredible: { text: 'You barely speak — just watch {partner} light up in front of the people who know them best. The mum turns to {partner}: “You’ve never looked at anyone like that. Not even the dog.” Highest praise that family gives.', effects: { bond: 8, loyalty: 6, public: 4 } },
        },
      },
    },
  },
  {
    id: 'li_final_letter', act: 3, tags: ['chat', 'loyal'],
    art: 'li_bedroom',
    context: 'Night before the Final · a pen · a shaking hand',
    prompt: 'Production has left everyone paper for the final firepit declaration, and yours is still blank at midnight. {partner} is asleep four feet away. Everything you want to say is either too big for the paper or too small for the moment. The pen waits.',
    recap: 'Midnight before the Final — the declaration paper is still blank.',
    choices: {
      left: {
        label: 'Write it raw',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: 'You write four pages, cross out three, and read the survivor back in a whisper. It’s honest and it’s a mess. Rather like the whole thing it’s describing.', effects: { loyalty: 2, bond: 2, burnout: 3 } },
          good: { text: 'You stop trying to be poetic and write the true small stuff — the tea order, the snore, the way they say your name. Specific beats grand. The page fills itself.', effects: { bond: 6, loyalty: 5 } },
          incredible: { text: 'You write one line — “You made the loudest place I’ve ever been feel quiet” — and put the pen down. Reading it back, you already know the firepit won’t survive it dry-eyed.', effects: { bond: 8, loyalty: 8, public: 4 } },
        },
      },
      right: {
        label: 'Keep it light',
        tags: ['banter', 'camera'],
        governingStats: { charisma: 0.6, loyalty: 0.4 },
        outcomes: {
          bad: { text: 'You aim for charming and land on a best-man speech for a wedding that hasn’t happened. Three jokes, no heart. You’ll rewrite it at 4 a.m., you already know.', effects: { charisma: 2, followers: 2, burnout: 3 } },
          good: { text: 'You thread the jokes through the feeling so neatly nobody sees the sincerity coming till it’s landed. Funny, then floored. The firepit’s favourite one-two.', effects: { charisma: 5, public: 4 } },
          incredible: { text: 'Your declaration makes {partner} laugh twice and then completely go — the exact demolition you engineered on paper the night before. Craft, disguised as candour.', effects: { charisma: 8, public: 6, followers: 4 } },
        },
      },
    },
  },
  {
    id: 'li_final_date_boat', act: 3, tags: ['date', 'flirt'],
    art: 'li_beach',
    context: 'Final Week · the last date · off-site · actual sky',
    prompt: 'The last date is a real one: a boat, a bottle, a horizon with no fairy lights on it. First time you’ve been properly alone with {partner} in weeks. “Feels illegal,” they say, kicking off their shoes. The date has one job — remind you both this is real off-set too.',
    recap: 'The last date — a boat, {partner}, and a horizon with no fairy lights.',
    choices: {
      left: {
        label: 'Say where your head’s at',
        tags: ['loyal', 'flirt'],
        governingStats: { loyalty: 0.5, rizz: 0.5 },
        outcomes: {
          bad: { text: 'You get halfway to the big declaration and the boat lurches, so it comes out mid-stumble, gripping a rail. Romantic. Nautical. Slightly green.', effects: { rizz: 2, bond: 2, burnout: 2 } },
          good: { text: '“I keep waiting for the ick and it’s just not coming.” You say the plainest true thing you’ve got. {partner} takes your hand off the rail and holds it. Course set.', effects: { bond: 6, loyalty: 4 } },
          incredible: { text: 'Out on the water you say the thing you’d only ever say off the set — and mean it enough that the crew, filming anyway, quietly stop pretending to work.', effects: { bond: 8, loyalty: 6, public: 4 } },
        },
      },
      right: {
        label: 'Just be here for it',
        tags: ['rest', 'date'],
        governingStats: { rizz: 0.5, loyalty: 0.5 },
        outcomes: {
          bad: { text: 'You’re so determined to stay present you narrate it — “this is so nice, isn’t it, this” — until {partner} laughs and tells you to stop hosting the date.', effects: { rizz: 2, bond: 1, burnout: 2 } },
          good: { text: 'No speeches, no strategy — just a boat, a sunset, and no producer in your ear for once. Some of the best hours your couple’s had contain no plot at all.', effects: { bond: 5, loyalty: 4, burnout: -3 } },
          incredible: { text: 'You give the day nothing but your full attention, and it pays out: {partner} says this was the best day, meaning of the Season, meaning maybe more. The boat agrees.', effects: { bond: 8, loyalty: 6, burnout: -4 } },
        },
      },
    },
  },
  {
    id: 'li_envelope_wait', act: 3, tags: ['rest', 'chat'],
    art: 'li_firepit',
    context: 'Final Week · no text all day · the villa is jumpy',
    prompt: 'The text that names the finalists hasn’t come, and the not-knowing is doing more damage than any dumping. Every phone is face-up on the daybed like it might bite. {partner} keeps checking one that hasn’t buzzed. The villa is one notification from euphoria or the coach home.',
    recap: 'The finalist text won’t come — the villa jumpy over silent phones.',
    choices: {
      left: {
        label: 'Steady the room',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 0.6, charisma: 0.4 },
        outcomes: {
          bad: { text: 'You try to calm everyone and accidentally start a sweepstake on the coach departure time. The mood does not improve. The odds are grim.', effects: { loyalty: 2, burnout: 3, public: 1 } },
          good: { text: 'You get people off their phones and into a daft card game, and the afternoon passes without a single spiral. When the text lands, the villa’s laughing, not shaking.', effects: { loyalty: 5, public: 4, bond: 2 } },
          incredible: { text: 'You turn a day of dread into the villa’s best hangout of the Season — no phones, one water fight, zero talk of votes. Whatever the text says, you gave everyone a good last day.', effects: { loyalty: 8, public: 6, followers: 3 } },
        },
      },
      right: {
        label: 'Sit in the dread with them',
        tags: ['loyal', 'rest'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: 'You and {partner} catastrophise in tandem until you’ve both planned your dumping outfits. Shared anxiety is still anxiety, just with better company.', effects: { loyalty: 2, bond: 2, burnout: 3 } },
          good: { text: '“Whatever it says, this bit was real.” You name the fear out loud instead of refreshing a dead phone, and it shrinks. The waiting gets easier with two.', effects: { bond: 5, loyalty: 4 } },
          incredible: { text: 'You and {partner} make a quiet pact — win, lose, coach home — that the number on the screen changes nothing you’ve decided. By the time it buzzes, you’ve already won the vote that counted.', effects: { bond: 8, loyalty: 8 } },
        },
      },
    },
  },
  {
    id: 'li_first_love_you', act: 3, tags: ['flirt', 'loyal'],
    art: 'li_terrace',
    context: 'Late · the terrace · a word neither of you has used',
    prompt: 'It’s the last stretch and a specific three-word phrase has been sitting unspoken between you and {partner} for a week. Tonight it’s close to the surface — you can feel it queuing behind your teeth. Say it too soon and it’s a strategy. Too late and it’s a regret.',
    recap: 'Three unspoken words have been queuing behind your teeth all week.',
    choices: {
      left: {
        label: 'Say it first',
        tags: ['loyal', 'flirt'],
        governingStats: { loyalty: 0.6, rizz: 0.4 },
        outcomes: {
          bad: { text: 'It falls out sideways — “I sort of, like, love, you know” — a sentence with a puncture. {partner} gets it. Grammar was never the point. Still, ouch.', effects: { rizz: 2, bond: 2, burnout: 2 } },
          good: { text: 'You say it plainly, no run-up, no camera-glance. A beat of terror, then {partner} says it back like they’d been holding it too. The terrace exhales.', effects: { bond: 6, loyalty: 5 } },
          incredible: { text: 'You say it and mean it and don’t need it returned to be true — which is exactly why it comes straight back, doubled. Some things are only safe to say once you’ve stopped needing the answer.', effects: { bond: 9, loyalty: 8 } },
        },
      },
      right: {
        label: 'Show it, don’t say it',
        tags: ['loyal', 'date'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: 'You do the grand gesture instead of the small sentence, and {partner} spends the night wondering why you can plan a picnic but not finish a sentence. Actions, mistranslated.', effects: { loyalty: 2, bond: 1, burnout: 2 } },
          good: { text: 'You let the week’s hundred small proofs stand in for the words — the tea, the coat, the standing-between-them-and-it. {partner} reads every one. The phrase can wait.', effects: { bond: 5, loyalty: 5 } },
          incredible: { text: 'You never say it and never need to: by the Final, {partner} tells the Beach Hut they’ve never felt more loved by someone who hasn’t used the word. A language with no vocabulary.', effects: { bond: 8, loyalty: 7, public: 4 } },
        },
      },
    },
  },
  {
    id: 'li_first_follow', act: 3, tags: ['banter', 'chat'],
    art: 'li_daybed',
    context: 'Afternoon · the group chat that doesn’t exist yet',
    prompt: 'Someone raises the thing nobody’s said: the outside world has phones in it. Numbers are being swapped, a group chat drafted in principle, and “who’s following who back” has become a delicate diplomatic matter on the daybed. Friendships are about to become URLs.',
    recap: 'The daybed drafts the post-villa group chat — who follows who back.',
    choices: {
      left: {
        label: 'Keep the real ones',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 0.6, charisma: 0.4 },
        outcomes: {
          bad: { text: 'You promise everyone a lifelong friendship and realise, mid-promise, you’ve pledged eleven weekly catch-ups you cannot possibly attend. The maths of loyalty is unforgiving.', effects: { loyalty: 2, bond: 1, burnout: 2 } },
          good: { text: 'You quietly tell the two people who actually mattered that you mean it — no group-chat theatre, just a real plan to meet once the cameras are gone. Friendship, filtered for keeps.', effects: { loyalty: 5, bond: 4 } },
          incredible: { text: 'You’re the one who keeps the villa together after — the chat that stays alive, the reunions that actually happen. Years later they’ll credit you as the glue. It started on this daybed.', effects: { loyalty: 8, bond: 5, public: 4 } },
        },
      },
      right: {
        label: 'Play the room',
        tags: ['strategy', 'camera'],
        governingStats: { savvy: 0.6, charisma: 0.4 },
        outcomes: {
          bad: { text: 'You network the daybed like a conference and someone clocks the LinkedIn energy. “You collecting us?” asks {mate}. A little. It’s going great, apart from that.', effects: { savvy: 2, followers: 3, public: -2, burnout: 2 } },
          good: { text: 'You lock in the useful connections with warmth genuine enough to pass — the ones with reach, the ones with brands, the ones with staying power. Portfolio, diversified.', effects: { savvy: 5, followers: 4 } },
          incredible: { text: 'You leave the villa with every number worth having and not one person feeling farmed. The rare operator who can build a network that likes being built. Enviable, faintly sinister.', effects: { savvy: 8, followers: 6, public: 3 } },
        },
      },
    },
  },
  {
    id: 'li_compatibility_quiz', act: 3, tags: ['challenge', 'banter'],
    art: 'li_challenge',
    context: 'Final Week · “I’VE GOT A TEXT!!” · how well do you know them',
    prompt: '“Islanders, today you’ll be tested on how well you REALLY know your other half. Get it wrong and everyone finds out. #knowyourpartner” — Buzzers, boards, and a quiz where the wrong answer to “their worst habit” starts an actual conversation later.',
    recap: 'Got a text — a couples’ quiz on how well you know {partner}.',
    choices: {
      left: {
        label: 'Play it honest',
        tags: ['loyal', 'banter'],
        governingStats: { loyalty: 0.6, charisma: 0.4 },
        outcomes: {
          bad: { text: 'You answer “their worst habit” truthfully and the lawn gasps. Accurate, unfortunately. You’ll be unpacking that particular buzz on the daybed for a while.', effects: { loyalty: 2, bond: -1, burnout: 3 } },
          good: { text: 'You nail the small stuff — the coffee order, the fear, the middle name they hate — and {partner} realises, board by board, exactly how closely you’ve been paying attention.', effects: { loyalty: 5, bond: 5 } },
          incredible: { text: 'You get the impossible one right — the thing they’ve never told anyone in the villa — and the game stops being a game. {partner} looks at you like you read a diary. You just listened.', effects: { loyalty: 8, bond: 7, public: 4 } },
        },
      },
      right: {
        label: 'Play it for laughs',
        tags: ['banter', 'camera'],
        governingStats: { charisma: 1 },
        outcomes: {
          bad: { text: 'You clown the answers for the cameras and get the easy one wrong for real. “You don’t know my STARSIGN?” The bit curdles into a genuine dig.', effects: { charisma: 2, followers: 2, bond: -2, burnout: 2 } },
          good: { text: 'You turn the quiz into the funniest segment of the week — absurd answers that somehow reveal you know the real ones perfectly. Comedy as flex.', effects: { charisma: 5, followers: 4 } },
          incredible: { text: 'Your wrong-on-purpose answers land so well the clip out-rates the winners’ round, and you STILL sweep the real questions. Funny and devoted: the finalist double.', effects: { charisma: 8, followers: 6, public: 4 } },
        },
      },
    },
  },
  {
    id: 'li_ex_amends', act: 3, tags: ['chat', 'drama', 'encounter'],
    art: 'li_firepit_day',
    context: 'Final Week · unfinished business · one last chat with {ex}',
    prompt: '“Can we not leave it like this,” says {ex}, catching you by the kitchen before the Final. Weeks of frost, and now there’s a coach coming and no time left to be cold in. Whatever happened between you happened on camera. This part doesn’t have to.',
    recap: '{ex} catches you before the Final: ‘Can we not leave it like this.’',
    choices: {
      left: {
        label: 'Make peace',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 0.6, charisma: 0.4 },
        outcomes: {
          bad: { text: 'The apology tour reopens the wound instead of closing it — you relitigate the recoupling, name dates, cite footage. Closure was the goal. Discovery was the result.', effects: { loyalty: 2, drama: 3, burnout: 3 } },
          good: { text: '“I’m sorry for how I did it, not that I did it.” Honest, no grovelling, no rewriting. {ex} takes it. The frost breaks clean, with nobody watching for once.', effects: { loyalty: 5, public: 4, selfrespect: 3 } },
          incredible: { text: 'You two say the real things at last and walk out mates — the Season’s bitterest fallout, resolved off-camera, for its own sake. The kind of ending the edit never gets to use. Good.', effects: { loyalty: 8, public: 6, selfrespect: 4 } },
        },
      },
      right: {
        label: 'Keep the distance',
        tags: ['strategy', 'loyal'],
        governingStats: { savvy: 0.5, loyalty: 0.5 },
        outcomes: {
          bad: { text: 'You keep it civil and cold, and {ex} reads the wall as arrogance. “Typical,” they mutter to {mate}. The story you leave behind writes itself, unkindly.', effects: { savvy: 2, public: -2, burnout: 2 } },
          good: { text: 'You’re polite, brief, and unmovable — no drama, no false hug, no material. Some bridges don’t need rebuilding, just leaving standing. You leave it standing.', effects: { savvy: 5, selfrespect: 4 } },
          incredible: { text: 'You decline the reconciliation without a single sharp word, and somehow that dignity reads louder than any hug would have. Grace isn’t always a handshake. Sometimes it’s a clean exit.', effects: { savvy: 8, public: 4, selfrespect: 5 } },
        },
      },
    },
  },
  {
    id: 'li_last_laundry', act: 3, tags: ['rest', 'chat'],
    art: 'li_pool',
    context: 'Morning · the washing line · swimwear coming down for the last time',
    prompt: 'The washing line is where the villa does its thinking, and this morning it’s emptying — everyone quietly unpegging the swimwear they arrived in, folding a summer into a suitcase. {mate} is at the other end, holding one sock and a bit of a wobble. The line’s never been this honest.',
    recap: 'The washing line empties — the villa folding a summer into suitcases.',
    choices: {
      left: {
        label: 'Have the wobble with them',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: 'You both go at once and now there are two of you crying into shared laundry, unable to tell whose bikini is whose. Cathartic. Damp. Logistically confusing.', effects: { loyalty: 2, bond: 2, burnout: 2 } },
          good: { text: 'You put the sock down and let {mate} say the thing they’ve been holding since Casa. The line hears it all, keeps it, and you fold the rest in comfortable silence.', effects: { loyalty: 5, bond: 4 } },
          incredible: { text: 'A quiet ten minutes at the line does what six weeks of firepits couldn’t — {mate} tells you what this place actually gave them. The realest exit interview, conducted over pegs.', effects: { loyalty: 8, bond: 5, public: 4 } },
        },
      },
      right: {
        label: 'Keep it light',
        tags: ['banter', 'rest'],
        governingStats: { charisma: 0.6, loyalty: 0.4 },
        outcomes: {
          bad: { text: 'You crack a joke to dodge the feeling and {mate}’s face falls — they needed the moment, not the bit. Wrong tool, tender job. You course-correct, slowly.', effects: { charisma: 2, bond: -1, burnout: 2 } },
          good: { text: 'You get {mate} laughing about the state of the communal laundry basket, and the wobble passes without a spiral. Sometimes the kindest thing is refusing to make it a scene.', effects: { charisma: 5, bond: 3, burnout: -2 } },
          incredible: { text: 'You turn the sad little laundry ritual into the villa’s last great laugh — a fashion parade of six weeks’ worth of ruined swimwear. They needed a giggle, not a grief. You read it right.', effects: { charisma: 8, bond: 4, followers: 4, burnout: -3 } },
        },
      },
    },
  },
  {
    id: 'li_final_morning', act: 3, tags: ['rest', 'loyal'],
    art: 'li_kitchen',
    context: 'The Final · dawn · the villa has been sabotaged overnight',
    prompt: 'Final day, and you wake to carnage: someone’s cling-filmed every mug, googly-eyed every photo, and hung a banner reading GOOD LUCK LOSERS over the kitchen. The villa’s farewell prank has landed squarely on you and {partner}. Somewhere, muffled, people are pretending very hard to be asleep.',
    recap: 'Final-day dawn — the villa has pranked the kitchen to bits overnight.',
    choices: {
      left: {
        label: 'Take it gracefully',
        tags: ['loyal', 'rest'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: 'You try to be the bigger person and clean it all up before anyone’s awake, which reads as no fun at all. The gigglers, watching from the dorm, are quietly gutted you didn’t rise to it.', effects: { loyalty: 2, bond: 1, burnout: 2 } },
          good: { text: 'You laugh it off, wear the googly eyes to breakfast, and thank the villa sincerely for the send-off. Everyone piles into the kitchen grinning. The last morning starts on a high, not a schedule.', effects: { loyalty: 5, bond: 5, burnout: -3 } },
          incredible: { text: 'You take the prank as the love letter it is — leave the banner up, do breakfast in a cling-filmed kitchen, thank each culprit by name. The villa’s last morning becomes its warmest. No nerves survive it.', effects: { loyalty: 8, bond: 7, burnout: -4 } },
        },
      },
      right: {
        label: 'Prank them back',
        tags: ['banter', 'loyal'],
        governingStats: { charisma: 0.6, loyalty: 0.4 },
        outcomes: {
          bad: { text: 'You escalate with a revenge prank and misjudge it — the flour bomb goes off in the wrong face and someone’s final-day glam is ruined an hour before the cars. Too far, too early.', effects: { charisma: 2, burnout: 3, public: 1 } },
          good: { text: 'You launch an all-out counter-prank and the kitchen becomes a warzone of foam and stolen shoes. The finalists’ nerves vanish under the chaos. Best send-off the villa could’ve staged.', effects: { charisma: 5, public: 4, bond: 2 } },
          incredible: { text: 'You turn the prank war into the villa’s finest hour — an everyone-soaked, banner-versus-banner spectacular that ends in a group heap on the lawn. The Final’s terror routed by a water fight. Iconic exit.', effects: { charisma: 8, public: 6, followers: 4 } },
        },
      },
    },
  },
  {
    id: 'li_coach_blessing', act: 3, tags: ['chat', 'loyal', 'encounter'],
    art: 'li_firepit',
    context: 'Final Week · a text · someone’s going before the Final',
    prompt: '“Listen — it’s you, yeah? For us, it’s you.” {mate} is packed, the car’s idling, and the couple who just missed the Final are spending their last thirty seconds handing you their blessing instead of sulking. The villa gets smaller. The stakes get realer.',
    recap: '{mate} is off before the Final and hands you their blessing: ‘It’s you.’',
    choices: {
      left: {
        label: 'Send them off right',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: 'You get so emotional at the goodbye that {mate} ends up consoling YOU from inside the departing car. The window goes up on you mid-sob. Iconic. Backwards.', effects: { loyalty: 2, bond: 1, burnout: 2 } },
          good: { text: 'You walk them to the car, say the true thing about what they brought to the place, and mean every word. {mate} leaves knowing they mattered here. They did.', effects: { loyalty: 5, bond: 4, public: 3 } },
          incredible: { text: 'Your send-off is so warm the whole villa joins it — a proper guard of honour down the drive. {mate} leaves grinning, not grieving. You turned a dumping into a graduation.', effects: { loyalty: 8, bond: 5, public: 5 } },
        },
      },
      right: {
        label: 'Take the torch',
        tags: ['strategy', 'loyal'],
        governingStats: { savvy: 0.5, loyalty: 0.5 },
        outcomes: {
          bad: { text: 'You accept the endorsement a touch too readily and someone clocks the finalist already measuring the curtains. “Bit keen,” murmurs {rival}. Humility, mislaid.', effects: { savvy: 2, public: -2, burnout: 2 } },
          good: { text: 'You take {mate}’s blessing as a responsibility, not a trophy — “then I’ll do it for both of us.” It lands. You leave them feeling part of whatever happens next.', effects: { savvy: 5, loyalty: 3, public: 3 } },
          incredible: { text: 'You carry the dumped couple’s hopes into the Final and say so, on live TV, by name. Nobody who left this Season gets forgotten on your watch. The nation notes the loyalty, and votes it.', effects: { savvy: 6, loyalty: 5, public: 7 } },
        },
      },
    },
  },
  {
    id: 'li_final_reassure', act: 3, tags: ['loyal', 'flirt'],
    art: 'li_daybed',
    context: 'Final Week · {partner} has gone quiet · doubt at the finish line',
    prompt: '“Be honest,” says {partner}, not looking at you. “Is this only working because we’re in here?” The oldest villa fear, arriving at the worst possible moment — days from the outside, where it either survives daylight or it doesn’t. They need an answer that isn’t just a nice noise.',
    recap: '{partner}, days from the outside: ‘Is this only working because we’re in here?’',
    choices: {
      left: {
        label: 'Answer it straight',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: 'You over-reassure — too fast, too smooth, too many words — and the smoothness itself sounds rehearsed. “Right,” says {partner}, unconvinced by a correct answer, badly delivered.', effects: { loyalty: 2, bond: 1, burnout: 3 } },
          good: { text: '“I don’t know. But I want to find out with you, out there.” No guarantees, no salesmanship — just honest uncertainty, chosen out loud. It lands harder than a promise would.', effects: { bond: 6, loyalty: 5 } },
          incredible: { text: 'You don’t argue them out of it — you say the fear out loud for them: that out there you’ll shrink back into a summer thing. Then you choose them inside it anyway. {partner} stops doubting mid-sentence.', effects: { bond: 8, loyalty: 8 } },
        },
      },
      right: {
        label: 'Show them the plan',
        tags: ['loyal', 'strategy'],
        governingStats: { loyalty: 0.5, savvy: 0.5 },
        outcomes: {
          bad: { text: 'You answer the emotional question with a logistics answer — postcodes, weekends, whose flat. Practical. Also somehow the least reassuring thing you could have reached for.', effects: { savvy: 2, bond: 1, burnout: 2 } },
          good: { text: 'You lay out the actual outside — the dates, the drive, the first normal Tuesday — until the abstract fear has a train timetable through it. Concrete beats comfort. {partner} breathes.', effects: { bond: 5, savvy: 3, loyalty: 3 } },
          incredible: { text: 'You turn the wobble into a shared blueprint for month one, so specific and certain that {partner} stops asking if it’s real and starts asking what to pack. Doubt, engineered out.', effects: { bond: 8, loyalty: 6, savvy: 3 } },
        },
      },
    },
  },
  {
    id: 'li_kitchen_slow_dance', act: 3, tags: ['flirt', 'date'],
    art: 'li_kitchen',
    context: 'Late night · the kitchen · a song neither of you chose',
    prompt: 'A track comes on the villa speakers that means nothing to anyone except, apparently, you and {partner} — the one that was playing the night it all clicked. The kitchen’s empty. Everyone else is asleep. {partner} holds out a hand without a word. The washing-up can wait.',
    recap: 'The song from the night it clicked comes on — {partner} holds out a hand.',
    choices: {
      left: {
        label: 'Dance it out',
        tags: ['flirt', 'date'],
        governingStats: { rizz: 0.6, loyalty: 0.4 },
        outcomes: {
          bad: { text: 'You go for the cinematic dip and clip the open dishwasher door. The dance survives on a technicality. So does the ankle. Barely a slow number after that.', effects: { rizz: 2, bond: 2, burnout: 2 } },
          good: { text: 'No choreography, no audience, just a slow shuffle round the kitchen island to a song that’s quietly become yours. The best three minutes the villa didn’t schedule.', effects: { rizz: 5, bond: 5 } },
          incredible: { text: 'You dance in an empty kitchen at 2 a.m. like the cameras aren’t there, and it becomes the clip the whole Season is remembered by. Unstaged, unrepeatable, undeniable.', effects: { rizz: 8, bond: 6, public: 5, followers: 4 } },
        },
      },
      right: {
        label: 'Just hold on',
        tags: ['loyal', 'rest'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: 'You sway in place a bit too solemnly and {partner} giggles — “we’re not at a funeral, babe.” The mood recovers. It was very nearly a candlelit vigil.', effects: { loyalty: 2, bond: 2, burnout: 1 } },
          good: { text: 'You skip the dancing and just hold {partner} while the song plays out, foreheads together, saying nothing. Some songs don’t want moves. They want stillness.', effects: { bond: 6, loyalty: 4, burnout: -2 } },
          incredible: { text: 'You hold each other through the whole track and past it, into the silence after, and neither of you moves to fill it. The song ends. Whatever it started doesn’t.', effects: { bond: 9, loyalty: 6, burnout: -3 } },
        },
      },
    },
  },
  {
    id: 'li_beachhut_confession', act: 3, tags: ['camera', 'chat'],
    art: 'li_beachhut',
    context: 'The Beach Hut · the honest question about winning',
    prompt: 'The Beach Hut asks the one you’ve been avoiding: “Do you want to win?” Simple question, dangerous answer. Say yes and you’re a game-player. Say no and you’re lying to the nation. The chair creaks. The little red light waits for whichever version of you shows up.',
    recap: 'Beach Hut asks the dangerous one: ‘Do you want to win?’',
    choices: {
      left: {
        label: 'Tell the truth',
        tags: ['chat', 'loyal'],
        governingStats: { loyalty: 0.6, charisma: 0.4 },
        outcomes: {
          bad: { text: 'You get so tangled trying to want-it-but-humbly that you contradict yourself twice in one breath. The edit keeps every u-turn. Sincerity, buffering.', effects: { loyalty: 2, public: 1, burnout: 2 } },
          good: { text: '“Honestly? I’d love it. But I already got the bit I came for.” You nod at the door {partner}’s behind. Wanting to win and not needing to — the answer the vote respects most.', effects: { loyalty: 5, public: 5, bond: 2 } },
          incredible: { text: 'You give an answer so honest about ambition and so unbothered about losing that it reframes the whole finale. The Hut confession the show closes the episode on. That’s the win, pre-loaded.', effects: { loyalty: 8, public: 7, followers: 4 } },
        },
      },
      right: {
        label: 'Deflect it charming',
        tags: ['camera', 'banter'],
        governingStats: { charisma: 1 },
        outcomes: {
          bad: { text: 'You do a bit to duck the question and it reads as slippery on the sofa at home. “Just answer it,” the nation mutters, unamused, at the fixed grin.', effects: { charisma: 2, followers: 2, public: -2, burnout: 2 } },
          good: { text: '“I’d be lying if I said I didn’t want it. I’m just not gonna perform wanting it.” No bit, no dodge, and the plainness is what lands. Honesty reads better on the sofa than any wisecrack.', effects: { charisma: 5, followers: 4, public: 3 } },
          incredible: { text: 'Your non-answer is quoted more than anyone else’s answer — funny, humble, and secretly the most confident thing said all week. You dodged the question into a headline.', effects: { charisma: 8, followers: 6, public: 4 } },
        },
      },
    },
  },
  {
    id: 'li_hidden_notes', act: 3, tags: ['loyal', 'banter'],
    art: 'li_bedroom',
    context: 'Final Week · packing · a pen and a secret',
    prompt: 'While everyone’s at the pool, you’ve got the dorm to yourself and a stack of Post-its. The villa tradition nobody admits to: hiding little notes in your mates’ luggage for them to find weeks later, back in the real world, when they need it most. {mate}’s case is open. The pen is loaded.',
    recap: 'Alone in the dorm with Post-its — the secret-note-in-the-luggage tradition.',
    choices: {
      left: {
        label: 'Write them the real thing',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: 'You get so heartfelt you fill {mate}’s wash bag with confessional Post-its, one of which they’ll find, mortifyingly, at airport security. The sentiment survives the strip-search.', effects: { loyalty: 2, bond: 2, burnout: 2 } },
          good: { text: 'You leave three small true notes in three cases — the specific thing each mate won’t believe about themselves till they read it in your handwriting on a bad Tuesday. Kindness, time-released.', effects: { loyalty: 5, bond: 4 } },
          incredible: { text: 'Weeks later the group chat lights up: everyone’s found their note, on the exact rough day they needed it, and nobody can work out how you knew. You didn’t. You just paid attention here.', effects: { loyalty: 8, bond: 5, public: 4 } },
        },
      },
      right: {
        label: 'Leave them a bit',
        tags: ['banter', 'camera'],
        governingStats: { charisma: 0.6, loyalty: 0.4 },
        outcomes: {
          bad: { text: 'Your prank notes land while a mate’s unpacking on their own live stream, and one joke reads a lot worse without your face attached. Context: left in the villa. Note: viral.', effects: { charisma: 2, followers: 3, public: -2, burnout: 2 } },
          good: { text: 'You hide daft in-jokes in every case — the running gags, the callbacks, the nicknames — so six weeks of villa nonsense keeps ambushing them for months. Comedy, smuggled home.', effects: { charisma: 5, bond: 3, followers: 3 } },
          incredible: { text: 'Your hidden bits become a legend the whole cast keeps finding for a year — a note in a ski boot, one in a wedding suit. You turned goodbyes into a slow-release joke nobody sees coming.', effects: { charisma: 8, followers: 5, bond: 4 } },
        },
      },
    },
  },
  {
    id: 'li_villa_awards', act: 3, tags: ['banter', 'camera'],
    art: 'li_lawn',
    context: 'Final Week · the lawn · trophies made of pool noodles',
    prompt: 'With nothing left to win from production, the villa invents its own awards: Best Snorer, Most Dramatic Exit From A Chat, Most Likely To Text Their Ex By Friday. The trophies are pool noodles with names biroed on. You’ve been nominated in three categories, two of them unkind.',
    recap: 'The villa invents its own end-of-season awards — you’re up in three categories.',
    choices: {
      left: {
        label: 'Host the whole thing',
        tags: ['banter', 'camera'],
        governingStats: { charisma: 1 },
        outcomes: {
          bad: { text: 'You host, overrun, and hand Most Dramatic to someone mid-actual-drama, so the bit becomes the thing it was mocking. The pool noodle gets thrown. Not in jest.', effects: { charisma: 2, followers: 3, burnout: 3 } },
          good: { text: 'You run the ceremony like a national treasure — a roast here, a genuine tribute there — and the lawn cries laughing. Best telly of a quiet week, hosted for free.', effects: { charisma: 5, public: 4, followers: 3 } },
          incredible: { text: 'Your awards show is so good production reruns it as a segment, categories and all. You wrote it, hosted it, and won the room with a pool noodle for a mic. A star does admin.', effects: { charisma: 8, followers: 8, public: 5 } },
        },
      },
      right: {
        label: 'Win your categories gracefully',
        tags: ['loyal', 'banter'],
        governingStats: { charisma: 0.5, loyalty: 0.5 },
        outcomes: {
          bad: { text: 'You accept Best Snorer with a speech that somehow gets defensive about your sinuses. The lawn wanted a bow. You brought a medical history.', effects: { charisma: 2, bond: 1, burnout: 2 } },
          good: { text: 'You take the unkind nominations on the chin, do a lap of honour with a pool noodle, and the villa loves you harder for not being precious. Grace, with foam.', effects: { charisma: 4, bond: 4, public: 3 } },
          incredible: { text: 'You turn even the cruel category into a love letter to the villa — thanking each nominator by name — and the whole thing becomes the week’s warmest moment. You won by not minding losing.', effects: { charisma: 6, bond: 6, public: 5, followers: 3 } },
        },
      },
    },
  },
  {
    id: 'li_dumpee_returns', act: 3, tags: ['drama', 'chat', 'encounter'],
    art: 'li_firepit_day',
    context: 'Final Week · the firepit · a familiar face, back from the outside',
    prompt: '“Can I be honest with you, babe? Out there, they’re not buying your couple,” says {rival}, back for the day from the outside world and armed with a phone’s worth of opinions. Dumped Islanders return before the Final to stir, and this one’s aiming straight at your standing.',
    recap: '{rival} returns from the outside claiming the nation isn’t buying your couple.',
    choices: {
      left: {
        label: 'Take the intel seriously',
        tags: ['chat', 'strategy'],
        governingStats: { savvy: 0.6, loyalty: 0.4 },
        outcomes: {
          bad: { text: 'You believe every word and spiral, interrogating {partner} about a public that can’t hear you. The returnee did their damage in one sentence and left with a tan.', effects: { savvy: 2, bond: -3, burnout: 4 } },
          good: { text: 'You listen, weigh it, and bin the parts that are just {rival} stirring. Some intel from the outside is real; some is a grudge with a suntan. You can tell the difference.', effects: { savvy: 5, loyalty: 2 } },
          incredible: { text: 'You extract the one true thing from the mischief, adjust nothing you shouldn’t, and thank {rival} so sincerely they forget they came to wind you up. Turned a hit job into a briefing.', effects: { savvy: 8, public: 4, bond: 2 } },
        },
      },
      right: {
        label: 'Trust your couple over the gossip',
        tags: ['loyal', 'rest'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: 'You wave it off out loud but it lodges, and by evening you’re performing a confidence you don’t feel. The returnee’s sentence outlives their visit. Cheap and effective.', effects: { loyalty: 2, bond: -2, burnout: 3 } },
          good: { text: '“You don’t know us from a two-minute clip,” you tell {rival}, kindly, and go back to {partner}. What you two have doesn’t need an outside review. It holds.', effects: { loyalty: 5, bond: 4 } },
          incredible: { text: 'You thank {rival} for the concern, refuse the poison entirely, and let your couple be the rebuttal all evening. The nation, watching, decides the returnee undersold you. Vote climbs.', effects: { loyalty: 7, bond: 5, public: 6 } },
        },
      },
    },
  },
  {
    id: 'li_public_promise', act: 3, tags: ['flirt', 'camera'],
    art: 'li_firepit',
    context: 'Final Week · the firepit · a gesture with no undo button',
    prompt: 'You’ve decided to do a Thing at the firepit tonight — a promise, in front of everyone, that you two carry on out there: a ring you made from a bottle-top, a speech, the works. It’s either the most romantic moment of the Season or a swing you’ll never live down. There is no small version of this.',
    recap: 'You plan a public promise at the firepit — bottle-top ring, speech, no undo.',
    choices: {
      left: {
        label: 'Go through with it',
        tags: ['flirt', 'camera'],
        governingStats: { rizz: 0.5, charisma: 0.5 },
        outcomes: {
          bad: { text: 'You drop to one knee and the villa gasps “oh my—” before clocking it’s a promise, not a proposal, and the recovery takes longer than the speech. {partner} says yes to a question you didn’t ask.', effects: { rizz: 2, bond: 1, burnout: 4, followers: 2 } },
          good: { text: 'You keep it a promise, not a proposal, say the true thing, and slide the daft bottle-top ring on. The firepit loses it. A gesture that could’ve flopped, stuck the landing.', effects: { rizz: 5, bond: 6, public: 4 } },
          incredible: { text: 'The bottle-top promise becomes the image the Season ends on — no proposal, no pressure, two people choosing each other on purpose. Even the fixed cams seem moved. Poster secured.', effects: { rizz: 6, bond: 8, public: 7, followers: 4 } },
        },
      },
      right: {
        label: 'Pull them aside instead',
        tags: ['loyal', 'date'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: 'You bottle the big version and do a mumbled private one that comes out as “so, like, us, yeah, out there — cool?” {partner} agrees to whatever that was. The moment survives on goodwill.', effects: { loyalty: 2, bond: 2, burnout: 2 } },
          good: { text: 'You skip the audience and make the promise to {partner} alone on the terrace. No flop risk, no cameras — just the two of you and a bottle-top ring that means more off-air.', effects: { loyalty: 5, bond: 6 } },
          incredible: { text: 'You give {partner} the whole speech privately, and they’re the one who drags you to the firepit to say it again for everyone. The gesture lands twice, and the second time it’s their idea.', effects: { loyalty: 6, bond: 8, public: 5 } },
        },
      },
    },
  },
  {
    id: 'li_final_fallout', act: 3, tags: ['drama', 'loyal', 'encounter'],
    art: 'li_terrace',
    context: 'Final Week · the terrace · the crack you can’t afford right now',
    prompt: '“I’m not being funny, but you’ve been weird with me for two days,” {partner} says, and they’re right, and the timing is catastrophic. Days from the Final, the couple everyone’s voting for is quietly coming apart on the terrace, and the cameras have found the good angle.',
    recap: 'Days from the Final, {partner} calls out a two-day distance that’s real.',
    choices: {
      left: {
        label: 'Get it all out now',
        tags: ['drama', 'chat'],
        governingStats: { charisma: 0.5, loyalty: 0.5 },
        outcomes: {
          bad: { text: 'You finally say the real thing and it’s bigger than either of you expected, and now the whole villa knows the frontrunners are wobbling days from the Final. Honesty with terrible scheduling.', effects: { charisma: 2, bond: -4, burnout: 4, drama: 2 } },
          good: { text: 'You lay out what’s been eating you before it rots, and {partner} does the same, and the row turns into the most honest hour you’ve had. Better cracked open now than sealed shut wrong.', effects: { loyalty: 4, bond: 5, charisma: 2 } },
          incredible: { text: 'You have the hard conversation completely, and come out the far side more solid than the couples who never row. The Beach Hut calls it the moment your couple became unbeatable. Cracks, welded.', effects: { loyalty: 6, bond: 8, public: 5 } },
        },
      },
      right: {
        label: 'Hold it together till after',
        tags: ['strategy', 'loyal'],
        governingStats: { savvy: 0.6, loyalty: 0.4 },
        outcomes: {
          bad: { text: 'You paper it over “till after the Final” and the paper tears on camera by teatime. Deferred rows accrue interest, and the villa collects in public.', effects: { savvy: 2, bond: -3, burnout: 4, drama: 1 } },
          good: { text: 'You call a truce for the last stretch — “us first, this chat later, properly” — and mean the later bit. Sometimes timing is the kindest thing you can offer a hard talk.', effects: { savvy: 5, loyalty: 3, bond: 2 } },
          incredible: { text: 'You park the row with such honesty about WHY you’re parking it that {partner} feels closer than if you’d had it out. You didn’t bury it. You scheduled it, together, on purpose.', effects: { savvy: 6, loyalty: 5, bond: 5, public: 3 } },
        },
      },
    },
  },
  {
    id: 'li_family_arrives', act: 3, tags: ['banter', 'chat', 'encounter'],
    art: 'li_lawn',
    context: 'Final Week · the lawn · your lot have arrived',
    prompt: '“She was exactly like this at her cousin’s wedding,” your mum announces to {partner}, four minutes in, photos already out. Family day, and where {partner}’s people came to inspect, yours have come to expose. There is a story about a paddling pool. It is being told.',
    recap: 'Your family arrives on family day and immediately starts exposing you to {partner}.',
    choices: {
      left: {
        label: 'Let them cook you',
        tags: ['banter', 'loyal'],
        governingStats: { charisma: 0.6, loyalty: 0.4 },
        outcomes: {
          bad: { text: 'You try to steer your mum off the paddling-pool story and steer her straight into a worse one involving a talent-show leotard. The villa won’t be forgetting this. Neither will the edit.', effects: { charisma: 2, bond: 1, burnout: 2 } },
          good: { text: 'You let your family roast you rotten and just take it, and {partner} watching you be a whole person with a past — leotards and all — is the fondest they’ve looked all Season.', effects: { charisma: 4, bond: 5, public: 3 } },
          incredible: { text: 'Your lot embarrass you completely and {partner} laughs so hard they cry, then tells your mum “I get it now, I properly get them.” The exposé became the endorsement. Family: undefeated.', effects: { charisma: 6, bond: 7, public: 5, followers: 3 } },
        },
      },
      right: {
        label: 'Get the real read from them',
        tags: ['chat', 'loyal'],
        governingStats: { loyalty: 0.6, savvy: 0.4 },
        outcomes: {
          bad: { text: 'You corner your mum for the verdict on {partner} and get “seem nice, love, bit soon to say,” which you then overanalyse for the entire remaining visit. You asked. She answered. You suffered.', effects: { loyalty: 2, burnout: 3, bond: 1 } },
          good: { text: 'You pull your family aside for the honest read on {partner}, and get it — warm, blunt, the way only your people can. Their approval means more than the nation’s. You needed to hear it.', effects: { loyalty: 5, bond: 4 } },
          incredible: { text: 'Your family clock what {partner} means to you before you’ve said a word, and give you the blessing you didn’t know you were nervous about. Walking back to {partner}, you already know. Home approved.', effects: { loyalty: 6, bond: 7, public: 4 } },
        },
      },
    },
  },
  {
    id: 'li_reunion_predictions', act: 3, tags: ['banter', 'gossip'],
    art: 'li_daybed',
    context: 'Final Week · the daybed · fast-forwarding to the reunion',
    prompt: 'Somebody starts a game the whole daybed can’t resist: reunion predictions. Who’ll still be together at the reunion, who’ll have quietly unfollowed who, which couple’s going to have The Chat live on stage. Then they turn to you: “Go on then — you and {partner}, honest odds?”',
    recap: 'The daybed plays reunion predictions, then asks your honest odds with {partner}.',
    choices: {
      left: {
        label: 'Give your honest odds',
        tags: ['chat', 'loyal'],
        governingStats: { loyalty: 0.6, charisma: 0.4 },
        outcomes: {
          bad: { text: 'You put a specific percentage on your own couple, out loud, and {partner} — walking past at that exact second — hears a number lower than they’d have liked. Maths, mistimed.', effects: { loyalty: 2, bond: -2, burnout: 2 } },
          good: { text: '“Us? We’re boring, we’ll just be together.” You say it plainly and the daybed groans at how unshakeable you sound. Confidence that doesn’t perform is the most convincing kind.', effects: { loyalty: 5, bond: 4, public: 3 } },
          incredible: { text: 'You answer so warmly and so surely about {partner} that the game stops being a joke and the daybed goes soft. You just told the nation your odds without naming a number. The vote hears it.', effects: { loyalty: 6, bond: 6, public: 6 } },
        },
      },
      right: {
        label: 'Predict everyone else’s',
        tags: ['gossip', 'banter'],
        governingStats: { savvy: 0.6, charisma: 0.4 },
        outcomes: {
          bad: { text: 'Your predictions are so accurate and so savage that two couples overhear their own forecast and take it personally. You called it. They’re just not ready to hear it on the daybed.', effects: { savvy: 2, drama: 2, burnout: 2 } },
          good: { text: 'You read the whole villa’s reunion in one go — the fizzlers, the unfollowers, the live-stage chat — and you’re funny enough that even the doomed couples laugh. Fortune-telling as a bit.', effects: { savvy: 5, followers: 3 } },
          incredible: { text: 'Your reunion forecast is so sharp the group makes you swear to keep the receipts, and months later every call lands. You didn’t predict the reunion. You scheduled its group chat.', effects: { savvy: 8, followers: 5, public: 3 } },
        },
      },
    },
  },
];
