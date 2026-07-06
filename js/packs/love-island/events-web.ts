// Love Island — the couple-web's cards (ADR-0013): the villa's OTHER couples,
// alive. Witness cards (the world moves and you see it), gossip cards (it
// reaches you second-hand), consequence cards (a move you never made finds
// you), resolution cards (the thread ends, on camera), and callbacks (the
// villa remembers). Threads: Marco+Sophia (the showmance with a wandering
// eye) · Dev+Tash (the achingly slow real one) · Kai+Chloe (a sweetheart
// lovebombing a game-player who is banking it) · {rival} vs {mate} (the
// cross-couple cold war) · Sophia scorched (the cascade). Eligibility rides
// `threadStageIs` (the Reigns bag — see plugins/coupleweb.ts); influence
// flags select resolution variants: you witness, nudge, and get dragged in —
// you never steer. Voice per VOICE.md; acts are authored in PHASE space and
// remapped to weeks at assembly (events.ts).

import type { GameEvent } from '../../types.js';

export const WEB_EVENTS: GameEvent[] = [

  // ---------- THE TRIANGLE — Marco & Sophia, plus Amber (the third corner) ----------
  {
    id: 'li_web_tri_0', act: [1, 2], tags: ['web:triangle', 'encounter', 'chat'],
    requires: { threadStageIs: 'triangle:0' },
    art: 'li_firepit_day',
    context: 'Golden hour · the firepit · a chat that isn’t about protein',
    prompt: 'Marco has pulled Amber — main character, self-cast — for a chat, angled so the cameras get his good side and Sophia gets the back of his head. From the kitchen, Sophia watches over a smoothie she has stopped drinking. “Interesting,” she says, to nobody. To you, actually.',
    recap: 'Marco pulls Amber at the firepit while Sophia watches from the kitchen.',
    choices: {
      left: {
        label: 'Join Sophia at the counter',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 0.7, savvy: 0.3 },
        outcomes: {
          bad: { text: '“I’m FINE,” says Sophia, machine-gun cheerful, and hands you the smoothie like a subpoena. You are now holding her feelings and a mango situation.', effects: { threadBeat: 'triangle', addFlag: 'li_web_tri_close', loyalty: 2, burnout: 2 } },
          good: { text: '“He does this,” she says, calm as an invoice. “Watch.” You watch. He does this. You and Sophia are allies now, which she decides without asking.', effects: { bond: 4, threadBeat: 'triangle', addFlag: 'li_web_tri_close', loyalty: 5, romantics: 2 } },
          incredible: { text: 'You say nothing and slice a lime like it’s support. “You’re the only one in here who’s actually loyal, you know that?” Sophia says. In this villa, that’s a friendship contract.', effects: { bond: 5, threadBeat: 'triangle', addFlag: 'li_web_tri_close', loyalty: 8, romantics: 3, graft: 2 } },
        },
      },
      right: {
        label: 'Watch from the daybed',
        tags: ['strategy', 'camera'],
        governingStats: { savvy: 0.8, charisma: 0.2 },
        outcomes: {
          bad: { text: 'You narrate the whole chat to {mate} in a whisper the boom mic treats as a broadcast. Marco looks over mid-sentence. Noted, says the look.', effects: { threadBeat: 'triangle', addFlag: 'li_web_tri_watch', savvy: 2, burnout: 2 } },
          good: { text: 'You clock the hand on the knee, the laugh at nothing, the glance to camera. A full itinerary. “He’s on a schedule,” you tell {mate}. He is.', effects: { followers: 2, charisma: 3, threadBeat: 'triangle', addFlag: 'li_web_tri_watch', savvy: 5, drama: 2 } },
          incredible: { text: 'You call the next four beats of Marco’s chat before he does them, quietly, like snooker commentary. {mate} has to leave the daybed to laugh.', effects: { followers: 4, charisma: 4, threadBeat: 'triangle', addFlag: 'li_web_tri_watch', savvy: 8, drama: 3, graft: 2 } },
        },
      },
    },
  },
  {
    id: 'li_web_tri_1', act: [1, 2], tags: ['web:triangle', 'encounter', 'gossip'],
    requires: { threadStageIs: 'triangle:0' },
    art: 'li_terrace',
    context: 'The terrace · word travels · it travelled to you',
    prompt: '“Right, don’t say I said,” says {mate}, saying it, “but Marco told the Beach Hut that Sophia is — quote — ‘a great business decision.’” A sentence like that doesn’t stay in a booth. It’s currently in your hands, ticking.',
    recap: '{mate} leaks that Marco called Sophia ‘a great business decision.’',
    choices: {
      left: {
        label: 'Tell Sophia what he said',
        tags: ['code', 'loyal'],
        governingStats: { loyalty: 0.6, savvy: 0.4 },
        outcomes: {
          bad: { text: 'You get as far as “business” before Sophia finishes the quote herself. “Heard it this morning.” Now she’s wondering why you took until sunset.', effects: { threadBeat: 'triangle', addFlag: 'li_web_tri_told', selfrespect: 2, burnout: 2 } },
          good: { text: 'You say it plain, no garnish. Sophia nods slowly, the way accountants nod. “Appreciated,” she says, and starts building something behind her eyes.', effects: { bond: 4, threadBeat: 'triangle', addFlag: 'li_web_tri_told', selfrespect: 3, romantics: 1, loyalty: 5 } },
          incredible: { text: '“I’d want to know,” you say, “so — you should know.” Sophia looks at you for a long second. “You’re good people.” The nation’s spine-havers agree, loudly, online.', effects: { bond: 5, threadBeat: 'triangle', addFlag: 'li_web_tri_told', selfrespect: 5, romantics: 2, loyalty: 8 } },
        },
      },
      right: {
        label: 'Keep it. Currency',
        tags: ['strategy'],
        governingStats: { savvy: 1 },
        outcomes: {
          bad: { text: 'You bank the quote so carefully you tell nobody — and then talk in your sleep, per {mate}, per breakfast, per everyone. The vault has a snore-shaped hole.', effects: { threadBeat: 'triangle', addFlag: 'li_web_tri_held', savvy: 2, drama: 2, burnout: 2 } },
          good: { text: 'You file it where you keep the good stuff. Knowledge you haven’t spent yet is the only quiet power this villa sells.', effects: { threadBeat: 'triangle', addFlag: 'li_web_tri_held', savvy: 5, drama: 1, graft: 3 } },
          incredible: { text: 'You hold the sentence so well that Marco starts being nice to you on instinct, the way people are polite to weather they can’t read.', effects: { threadBeat: 'triangle', addFlag: 'li_web_tri_held', savvy: 8, drama: 2, graft: 4 } },
        },
      },
    },
  },
  {
    id: 'li_web_tri_showdown', act: 2, tags: ['web:triangle', 'drama'],
    requires: { threadStageIs: 'triangle:1', anyOf: [{ flagsAll: ['li_web_tri_told'] }, { flagsAll: ['li_web_tri_close'] }] },
    art: 'li_firepit',
    context: 'The firepit · receipts hour · Sophia has the floor',
    prompt: '“Quick chat, everyone.” Sophia has assembled the villa the way you assemble a jury. “Marco. The Beach Hut. ‘A great business decision.’ Ring a bell?” Marco’s skincare has never looked so alone. Someone drops a fork; nobody picks it up.',
    recap: 'Sophia gathers the villa to confront Marco over his ‘business decision’ line.',
    choices: {
      left: {
        label: 'Stand where she can see you',
        tags: ['code', 'loyal'],
        governingStats: { loyalty: 0.6, charisma: 0.4 },
        outcomes: {
          bad: { text: '“And YOU knew,” Marco tries, pointing at you. It doesn’t land — but now you’re in the credits of a row you only produced. The clip tags you anyway.', effects: { threadResolve: 'triangle:showdown', threadLight: 'scorched', drama: 2, burnout: 3, rivalOpinion: -2 } },
          good: { text: 'You don’t say a word; you just don’t leave. Sophia lands every syllable, hands him the smoothie straw like a receipt, and sits down. The nation stands up.', effects: { bond: 4, threadResolve: 'triangle:showdown', threadLight: 'scorched', selfrespect: 3, drama: 2, public: 2 } },
          incredible: { text: 'Sophia finishes, turns, and says “thank you” to you, on camera, by name. Being thanked in someone else’s finest hour — that’s the good kind of famous.', effects: { bond: 5, threadResolve: 'triangle:showdown', threadLight: 'scorched', selfrespect: 4, drama: 3, public: 3, followers: 5 } },
        },
      },
      right: {
        label: 'Stay out of frame',
        tags: ['rest', 'strategy'],
        governingStats: { savvy: 1 },
        outcomes: {
          bad: { text: 'You retreat so visibly the camera finds you anyway: crouched behind the daybed holding a burger you don’t remember picking up. The nation makes it a sticker.', effects: { threadResolve: 'triangle:showdown', threadLight: 'scorched', drama: 2, burnout: 2, followers: 2 } },
          good: { text: 'You watch from the kitchen with the popcorn energy of a person who did their bit yesterday. History will show you were merely present. History, and the wide shot.', effects: { burnout: -4, threadResolve: 'triangle:showdown', threadLight: 'scorched', savvy: 5, drama: 2 } },
          incredible: { text: 'You time your exit so cleanly that both sides later assume you were with them. Switzerland, in swimwear.', effects: { burnout: -6, threadResolve: 'triangle:showdown', threadLight: 'scorched', savvy: 8, drama: 2, graft: 3 } },
        },
      },
    },
  },
  {
    id: 'li_web_tri_fizzle', act: 2, tags: ['web:triangle', 'chat'],
    requires: { threadStageIs: 'triangle:1', flagsNone: ['li_web_tri_told', 'li_web_tri_close'] },
    art: 'li_lawn',
    context: 'The lawn · the row that didn’t happen',
    prompt: 'It resolves the way villa storms sometimes do: no thunder, just pressure. Marco brings Sophia a smoothie with an apology’s posture; she takes it without warmth. “We’re good,” she announces to the garden. The garden does not believe her.',
    recap: 'Marco and Sophia call a truce nobody in the garden quite believes.',
    choices: {
      left: {
        label: 'Debrief with {mate}',
        tags: ['chat', 'banter'],
        governingStats: { charisma: 0.6, savvy: 0.4 },
        outcomes: {
          bad: { text: '“We’re good,” you mimic, at the exact moment Sophia rounds the pool. The smoothie pauses. Your sentence dies in witness protection.', effects: { threadResolve: 'triangle:quiet', drama: 2, burnout: 3 } },
          good: { text: '“That’s not peace,” {mate} says, “that’s a ceasefire with a skincare clause.” You clink mugs to the couples who survive on paperwork.', effects: { followers: 2, charisma: 3, threadResolve: 'triangle:quiet', savvy: 5, drama: 1 } },
          incredible: { text: 'You and {mate} rate the apology out of ten like judges at the regionals. “Six. No rotation.” The Hut asks you both back for a second segment.', effects: { threadResolve: 'triangle:quiet', charisma: 8, followers: 5, drama: 2 } },
        },
      },
      right: {
        label: 'Let the villa have its peace',
        tags: ['rest', 'loyal'],
        governingStats: { loyalty: 0.7, savvy: 0.3 },
        outcomes: {
          bad: { text: 'You give the couple their privacy so respectfully you end up alone at the big table, guarding fourteen empty chairs and a citronella candle.', effects: { threadResolve: 'triangle:quiet', romantics: 1, burnout: 2 } },
          good: { text: 'Some couples run on maintenance, not magic. You water your own garden instead and let theirs do whatever a smoothie-based ecosystem does.', effects: { burnout: -4, threadResolve: 'triangle:quiet', romantics: 2, bond: 5 } },
          incredible: { text: 'Your restraint is so complete the Beach Hut asks what you think. “Not my chapter,” you say. It becomes the week’s most screenshotted sentence.', effects: { burnout: -6, bond: 5, threadResolve: 'triangle:quiet', romantics: 3, public: 3, graft: 2 } },
        },
      },
    },
  },

  // ---------- THE SLOW BURN — Dev & Tash ----------
  {
    id: 'li_web_slow_0', act: [1, 2], tags: ['web:slowburn', 'encounter', 'chat'],
    requires: { threadStageIs: 'slowburn:0' },
    art: 'li_kitchen',
    context: 'Six-fifty a.m. · the kitchen · two teas, one theory',
    prompt: 'Dev is up first again, making two teas. One is his. The other sits on the wall by the roof stairs until it goes cold, because Tash might come up, and has, twice, ever. “It’s just tea,” Dev tells you, in the voice of a man holding a ring box.',
    recap: 'Dev makes Tash a tea every morning and leaves it on the wall to go cold.',
    choices: {
      left: {
        label: '“Just say it to her”',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 0.6, charisma: 0.4 },
        outcomes: {
          bad: { text: '“Say WHAT,” Dev panics, over-stirring. The tea develops a vortex. You have moved his timeline up by nothing and his heart rate by plenty.', effects: { threadBeat: 'slowburn', addFlag: 'li_web_slow_push', loyalty: 2, burnout: 2 } },
          good: { text: '“Mate. The tea has a reserved seat.” Dev looks at the wall, then at you, like you’ve read his diary. “…It’s good tea,” he manages. Progress: located.', effects: { bond: 4, threadBeat: 'slowburn', addFlag: 'li_web_slow_push', loyalty: 5, romantics: 2 } },
          incredible: { text: '“She counts your laps in the pool,” you say. Dev puts the spoon down with enormous care, like the counter might be dreaming. “Does she.” DOES SHE, agrees the nation.', effects: { bond: 5, threadBeat: 'slowburn', addFlag: 'li_web_slow_push', loyalty: 8, romantics: 4 } },
        },
      },
      right: {
        label: 'Let it cook',
        tags: ['rest', 'strategy'],
        governingStats: { savvy: 0.7, loyalty: 0.3 },
        outcomes: {
          bad: { text: 'You say nothing so pointedly that Dev asks what’s wrong. Now you’re having a feelings chat about YOUR face at seven a.m.', effects: { threadBeat: 'slowburn', addFlag: 'li_web_slow_wait', savvy: 2, burnout: 2 } },
          good: { text: 'Slow is a strategy. You leave the tea, the wall, and the man alone. Some things ripen; some things just need nobody breathing on them.', effects: { burnout: -4, threadBeat: 'slowburn', addFlag: 'li_web_slow_wait', savvy: 5, romantics: 1 } },
          incredible: { text: 'You move the sugar an inch closer to the wall tea and say nothing for the rest of your life. Tash takes two sugars. Dev never finds out he had help.', effects: { burnout: -6, threadBeat: 'slowburn', addFlag: 'li_web_slow_wait', savvy: 8, romantics: 2, graft: 2 } },
        },
      },
    },
  },
  {
    id: 'li_web_slow_1', act: [1, 2], tags: ['web:slowburn', 'encounter', 'chat'],
    requires: { threadStageIs: 'slowburn:0' },
    art: 'li_daybed',
    context: 'The daybed · Dev has a question · it has been loading all week',
    prompt: '“Honest answer.” Dev sits down with the gravity of a man about to discuss mortgages. “Tash. Do I… embarrass her? She went quiet when I did the thing with the melon.” He means the fruit-ninja bit. Everyone laughed. One person didn’t, and he noticed the one.',
    recap: 'Dev asks whether his fruit-ninja melon bit embarrasses Tash.',
    choices: {
      left: {
        label: '“Quiet isn’t no. Ask her”',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 0.5, charisma: 0.5 },
        outcomes: {
          bad: { text: '“ASK her,” Dev repeats, like you’ve suggested skydiving indoors. He then rehearses asking her, on you, four times. You are now a Tash understudy.', effects: { threadBeat: 'slowburn', addFlag: 'li_web_slow_go', loyalty: 2, burnout: 3 } },
          good: { text: '“She reads everyone in here,” you say. “Let her read something true.” Dev nods slowly, twice — once for the sentence, once for the nerve.', effects: { bond: 4, threadBeat: 'slowburn', addFlag: 'li_web_slow_go', loyalty: 5, romantics: 2 } },
          incredible: { text: '“The melon thing is why she watches you,” you say. “Nobody performs for a room they don’t care about.” Dev stares. Somewhere, a producer frames your face for the trailer.', effects: { bond: 5, threadBeat: 'slowburn', addFlag: 'li_web_slow_go', loyalty: 8, romantics: 3, public: 2 } },
        },
      },
      right: {
        label: '“Guard it a bit longer”',
        tags: ['strategy', 'chat'],
        governingStats: { savvy: 1 },
        outcomes: {
          bad: { text: '“Right. Guard it. Cool.” Dev goes off to guard it by staring at Tash across the pool like a lifeguard with a secret. Subtlety has left the villa.', effects: { threadBeat: 'slowburn', addFlag: 'li_web_slow_slow', savvy: 2, burnout: 2 } },
          good: { text: '“A dumping’s coming,” you point out. “Feelings said at knifepoint don’t count.” Dev files it. The wall tea continues its cold vigil.', effects: { threadBeat: 'slowburn', addFlag: 'li_web_slow_slow', savvy: 5, drama: 1 } },
          incredible: { text: 'You give him the full read: her guard, his volume, the maths of waiting. “You’re annoyingly good at this,” Dev says. You are. Your own love life declines to comment.', effects: { threadBeat: 'slowburn', addFlag: 'li_web_slow_slow', savvy: 8, graft: 2 } },
        },
      },
    },
  },
  {
    id: 'li_web_slow_together', act: 2, tags: ['web:slowburn', 'chat'],
    requires: { threadStageIs: 'slowburn:1', anyOf: [{ flagsAll: ['li_web_slow_go'] }, { flagsAll: ['li_web_slow_push'] }] },
    art: 'li_firepit',
    context: 'The firepit · Dev stands up · the villa stops breathing',
    prompt: '“Tash.” Dev’s voice does a thing it’s never done: it stays level. “I’m not good at speeches. I make you tea you don’t drink. I’d like to keep making it. That’s the whole speech.” Silence. Then Tash, quietly: “I drink them on the stairs, you muppet.”',
    recap: 'Dev stands up at the firepit to finally say it to Tash.',
    choices: {
      left: {
        label: 'Lead the applause',
        tags: ['loyal', 'banter'],
        governingStats: { charisma: 0.6, loyalty: 0.4 },
        outcomes: {
          bad: { text: 'You clap alone for one full acoustic second before the villa joins. The clip has you as the overeager aunt at a school play. Worth it. Mostly.', effects: { threadResolve: 'slowburn:together', romantics: 2, burnout: 2, followers: 2 } },
          good: { text: 'The garden erupts. Dev does not know what to do with his arms; Tash solves it. You started the noise, and the nation is making the rest at home.', effects: { bond: 4, followers: 2, charisma: 3, threadResolve: 'slowburn:together', romantics: 3, public: 2 } },
          incredible: { text: '“THE STAIRS,” you bellow, delighted, and the whole villa takes up the chant. The stairs trend. An actual staircase. Television is magnificent.', effects: { bond: 5, charisma: 4, threadResolve: 'slowburn:together', romantics: 4, public: 3, followers: 5 } },
        },
      },
      right: {
        label: 'Catch {partner}’s eye instead',
        tags: ['date', 'loyal'],
        governingStats: { loyalty: 0.8, rizz: 0.2 },
        outcomes: {
          bad: { text: 'You go for the meaningful look and find {partner} mid-sneeze. The moment passes. The sneeze, tragically, airs.', effects: { threadResolve: 'slowburn:together', romantics: 1, burnout: 2 } },
          good: { text: 'Across the firepit, {partner} is already looking at you. Other people’s milestones do this — they audit yours. Tonight the books balance.', effects: { threadResolve: 'slowburn:together', romantics: 2, bond: 6 } },
          incredible: { text: 'No words. Just a look that says the same thing the tea said, and a hand finding yours in the dark like it knew the address. The camera, mercifully, misses it. Yours alone.', effects: { threadResolve: 'slowburn:together', romantics: 3, bond: 6 } },
        },
      },
    },
  },
  {
    id: 'li_web_slow_parked', act: 2, tags: ['web:slowburn', 'chat'],
    requires: { threadStageIs: 'slowburn:1', flagsNone: ['li_web_slow_go', 'li_web_slow_push'] },
    art: 'li_lawn',
    context: 'The lawn · the almost · filed under later',
    prompt: 'It happens at the gate after the challenge: Dev opens his mouth, Tash tilts her head — and a producer calls her name for the Beach Hut. By the time she’s back, the sentence has lost its nerve. “Another time,” Dev says. The villa’s saddest two words.',
    recap: 'A producer pulls Tash for the Beach Hut before Dev can finish.',
    choices: {
      left: {
        label: 'Tell him it’s not over',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 0.7, charisma: 0.3 },
        outcomes: {
          bad: { text: '“It’s not over,” you say, and Dev nods the nod of a man agreeing with a horoscope. Comfort delivered; belief pending.', effects: { threadResolve: 'slowburn:parked', loyalty: 2, burnout: 2 } },
          good: { text: '“Slow isn’t stopped,” you tell him. Dev looks at the roof stairs. “No,” he agrees, eventually. “It isn’t.” The kettle goes on. The vigil continues.', effects: { bond: 4, threadResolve: 'slowburn:parked', loyalty: 5, romantics: 2 } },
          incredible: { text: '“She kept the mug,” you say. Dev blinks. “What?” “The wall mug. It’s on her side of the bed.” You shouldn’t know that. You do. He walks taller for days.', effects: { bond: 5, threadResolve: 'slowburn:parked', loyalty: 8, romantics: 3, graft: 2 } },
        },
      },
      right: {
        label: 'Note it for the group chat',
        tags: ['camera', 'banter'],
        governingStats: { charisma: 0.7, savvy: 0.3 },
        outcomes: {
          bad: { text: 'You do the almost-kiss reenactment for the girls and Tash walks in on the tilt. “That’s my head,” she says, flat. It was. It’s also now your problem.', effects: { threadResolve: 'slowburn:parked', drama: 2, burnout: 3 } },
          good: { text: '“The slowest burn on record,” you tell the Hut. “Carbon dating involved.” The booth laughs. The nation adopts the couple that isn’t one yet.', effects: { charisma: 3, threadResolve: 'slowburn:parked', drama: 2, followers: 4 } },
          incredible: { text: 'Your Hut segment on The Tea Vigil runs ninety uncut seconds and ends with you toasting the cold mug. It becomes the season’s tenderest running joke.', effects: { charisma: 4, threadResolve: 'slowburn:parked', drama: 2, followers: 6, public: 2 } },
        },
      },
    },
  },

  // ---------- THE LOVEBOMB — Kai & Chloe ----------
  {
    id: 'li_web_love_0', act: 2, tags: ['web:lovebomb', 'encounter', 'chat'],
    requires: { threadStageIs: 'lovebomb:0' },
    art: 'li_pool',
    context: 'The pool · day six of the Kai & Chloe show',
    prompt: 'Kai has learned Chloe’s coffee order, her nan’s birthday, and the exact name of the gel shade (“Marbella Sunset, not CORAL”). Chloe, to the Beach Hut, glowing: “He’s SO sweet.” Then, softer, to herself, doing the maths: “…he’s so sweet.”',
    recap: 'Kai’s learned Chloe’s whole life while she quietly does the maths.',
    choices: {
      left: {
        label: 'Flag it to Kai, gently',
        tags: ['code', 'loyal'],
        governingStats: { loyalty: 0.5, savvy: 0.5 },
        outcomes: {
          bad: { text: '“Pace yourself how?” Kai asks, sincerely, holding a smoothie he made her from memory. Explaining weather to sunshine. You leave the forecast unfinished.', effects: { threadBeat: 'lovebomb', addFlag: 'li_web_love_warn', loyalty: 2, burnout: 2 } },
          good: { text: '“You’re putting all your eggs in one basket, mate. Keep one thing back — just one.” Kai thinks hard. “…I do like my scaffolding stories.” Keep the scaffolding stories, Kai.', effects: { bond: 4, threadBeat: 'lovebomb', addFlag: 'li_web_love_warn', loyalty: 5, selfrespect: 2 } },
          incredible: { text: '“She’s worth the full deck,” you say, “but deal it slower — people bank what arrives free.” Kai absorbs it like a man reading his first terms and conditions.', effects: { bond: 5, threadBeat: 'lovebomb', addFlag: 'li_web_love_warn', loyalty: 8, selfrespect: 3, savvy: 2 } },
        },
      },
      right: {
        label: 'Not your circus',
        tags: ['rest', 'strategy'],
        governingStats: { savvy: 0.8, charisma: 0.2 },
        outcomes: {
          bad: { text: 'You mind your business so hard you walk into the outdoor gym. The clip of you apologising to a kettlebell does modest numbers.', effects: { threadBeat: 'lovebomb', addFlag: 'li_web_love_watch', savvy: 2, burnout: 2, followers: 2 } },
          good: { text: 'Every villa needs one couple you just… observe. Like weather. Like the stock market. You take your coffee to a safe distance.', effects: { burnout: -4, threadBeat: 'lovebomb', addFlag: 'li_web_love_watch', savvy: 5, drama: 2 } },
          incredible: { text: 'You watch Chloe watch Kai watch Chloe, and say nothing, and understand everything. The Hut asks for your read; you decline it into legend.', effects: { burnout: -6, threadBeat: 'lovebomb', addFlag: 'li_web_love_watch', savvy: 8, drama: 2, graft: 2 } },
        },
      },
    },
  },
  {
    id: 'li_web_love_1', act: 2, tags: ['web:lovebomb', 'encounter', 'gossip'],
    requires: { threadStageIs: 'lovebomb:0' },
    art: 'li_daybed',
    context: 'The daybed · {mate} has brought a spreadsheet · a verbal one',
    prompt: '“Okay, hear me out.” {mate} lowers their voice. “Chloe mentions Kai in the Hut on vote days. ONLY vote days. I’ve been counting.” The maths sits between you on the daybed, sunning itself, undeniable.',
    recap: '{mate} clocks that Chloe only praises Kai on vote days.',
    choices: {
      left: {
        label: 'Show Kai the pattern',
        tags: ['code', 'strategy'],
        governingStats: { savvy: 0.6, loyalty: 0.4 },
        outcomes: {
          bad: { text: 'Kai listens to the whole theory, nods, and says, “So she talks about me on the important days.” The boy has a firewall made of golden retriever.', effects: { threadBeat: 'lovebomb', addFlag: 'li_web_love_warned', savvy: 2, burnout: 2 } },
          good: { text: 'You lay it out, dates and all. Kai goes quiet — the real kind. “My nan says nobody’s ever accidentally strategic,” he says finally. His nan is correct.', effects: { threadBeat: 'lovebomb', addFlag: 'li_web_love_warned', savvy: 5, selfrespect: 3 } },
          incredible: { text: 'You don’t editorialise; you just hand him the pattern and let it be his. “I’ll ask her straight,” Kai decides, straightening. Somewhere a spine section unlocks.', effects: { threadBeat: 'lovebomb', addFlag: 'li_web_love_warned', savvy: 8, selfrespect: 4, romantics: 1 } },
        },
      },
      right: {
        label: '“Honestly? She plays it well”',
        tags: ['banter', 'strategy'],
        governingStats: { savvy: 0.7, charisma: 0.3 },
        outcomes: {
          bad: { text: '“You ADMIRE it?” {mate} stares. You do, a bit. The mics catch the bit. Chloe finds out she has a fan and winks at you across the pool. Complicated.', effects: { threadBeat: 'lovebomb', drama: 2, burnout: 2 } },
          good: { text: '“She’s playing an absolute blinder, I’m not gonna lie,” you admit. “Bang out of order — but a blinder.” {mate} snorts. The daybed becomes a commentary box for the rest of the afternoon.', effects: { followers: 2, charisma: 3, threadBeat: 'lovebomb', drama: 3, savvy: 5 } },
          incredible: { text: 'You break the game down like a pundit — the vote-day cadence, the nan’s birthday, the shade name. “She should coach,” you conclude. The Hut runs it as analysis.', effects: { charisma: 4, threadBeat: 'lovebomb', drama: 4, savvy: 8, followers: 5 } },
        },
      },
    },
  },
  {
    id: 'li_web_love_wakes', act: 2, tags: ['web:lovebomb', 'chat'],
    requires: { threadStageIs: 'lovebomb:1', anyOf: [{ flagsAll: ['li_web_love_warned'] }, { flagsAll: ['li_web_love_warn'] }] },
    art: 'li_kitchen',
    context: 'Breakfast · Kai asks the question · with the good spine',
    prompt: '“Chloe.” Kai puts the spatula down, which for Kai is a gavel. “Do you like me, or do you like Tuesdays?” The kitchen goes still. Chloe opens her mouth for the usual — and nothing arrives. For once the gel nails drum no answer.',
    recap: 'Kai asks Chloe outright: does she like him, or like the votes?',
    choices: {
      left: {
        label: 'Give Kai the nod',
        tags: ['code', 'loyal'],
        governingStats: { loyalty: 0.6, charisma: 0.4 },
        outcomes: {
          bad: { text: 'You nod so supportively Chloe clocks the whole supply chain. “This has NOTES,” she says, pointing at you. It did have notes. Yours.', effects: { threadResolve: 'lovebomb:wakes', selfrespect: 2, drama: 2, burnout: 2 } },
          good: { text: 'Kai holds the silence like a pro. “That’s what I thought,” he says — kindly, which is the brutal part — and plates up. The villa exhales. The nation salutes.', effects: { bond: 4, threadResolve: 'lovebomb:wakes', selfrespect: 3, romantics: 1, public: 2 } },
          incredible: { text: '“I’d have waited forever, you know,” Kai says, no heat in it. “Shame.” He hands her breakfast anyway, because he’s Kai. The clip retires the word ‘mugged’.', effects: { bond: 5, threadResolve: 'lovebomb:wakes', selfrespect: 5, public: 3, followers: 4 } },
        },
      },
      right: {
        label: 'Watch the gel nails',
        tags: ['camera', 'strategy'],
        governingStats: { savvy: 1 },
        outcomes: {
          bad: { text: 'You watch so intently you miss your toast burning. Two dramas, one kitchen. The smoke alarm sides with neither of you.', effects: { threadResolve: 'lovebomb:wakes', drama: 2, burnout: 3 } },
          good: { text: 'The nails stop drumming. That’s the tell. Whatever Chloe says next, the hands already answered. You file the read; the Hut buys it later at full price.', effects: { followers: 2, charisma: 3, threadResolve: 'lovebomb:wakes', drama: 3, savvy: 5 } },
          incredible: { text: '“Marbella Sunset just went pale,” you murmur, and {mate} has to leave the room. The commentary track is now canon. Even Chloe laughs, eventually. Days later.', effects: { charisma: 4, threadResolve: 'lovebomb:wakes', drama: 4, savvy: 8, followers: 5 } },
        },
      },
    },
  },
  {
    id: 'li_web_love_doubles', act: 2, tags: ['web:lovebomb', 'drama'],
    requires: { threadStageIs: 'lovebomb:1', flagsNone: ['li_web_love_warned', 'li_web_love_warn'] },
    art: 'li_firepit',
    context: 'The firepit · Chloe makes an announcement · check the calendar',
    prompt: '“Everyone? Quick thing.” Chloe stands, takes Kai’s hand, and goes exclusive AT him, publicly, radiantly — the night before a vote. Kai beams like a lighthouse. Behind her smile, you can see the spreadsheet updating in real time.',
    recap: 'Chloe makes it exclusive with Kai — the night before a vote.',
    choices: {
      left: {
        label: 'Toast the happy couple',
        tags: ['banter', 'camera'],
        governingStats: { charisma: 0.8, savvy: 0.2 },
        outcomes: {
          bad: { text: 'Your toast comes out with one raised eyebrow too many. Chloe’s smile tightens a single micron. You’re on a list now. It’s laminated.', effects: { threadResolve: 'lovebomb:doubles', drama: 3, burnout: 2 } },
          good: { text: '“To Kai and Chloe,” you say, and only the boom operator hears the font you said it in. Glasses up. The vote, presumably, also up.', effects: { followers: 2, threadResolve: 'lovebomb:doubles', drama: 3, charisma: 5 } },
          incredible: { text: '“To timing,” you toast, beatifically. Half the garden sips in innocence, the other half chokes. Chloe raises her glass right at you: game recognises game.', effects: { threadResolve: 'lovebomb:doubles', drama: 5, charisma: 8, followers: 5 } },
        },
      },
      right: {
        label: 'Clock it, keep your counsel',
        tags: ['strategy', 'rest'],
        governingStats: { savvy: 1 },
        outcomes: {
          bad: { text: 'Your poker face slips for one frame. One. It becomes the reaction image of the week. Chloe reposts it herself, which is somehow checkmate.', effects: { threadResolve: 'lovebomb:doubles', drama: 3, burnout: 2, followers: 2 } },
          good: { text: 'Maybe it’s real now. That’s the thing about playing a part on camera — sometimes the part sets. You give it forty–sixty and keep the receipt.', effects: { burnout: -4, threadResolve: 'lovebomb:doubles', drama: 2, savvy: 5 } },
          incredible: { text: 'You catch the one unguarded look Chloe gives Kai when the cameras swing away — and revise your odds on the spot. Real. Accidentally, furiously real.', effects: { burnout: -6, threadResolve: 'lovebomb:doubles', drama: 2, romantics: 3, savvy: 8 } },
        },
      },
    },
  },

  // ---------- THE FEUD — {rival} vs {mate} ----------
  {
    id: 'li_web_feud_0', act: 2, tags: ['web:feud', 'encounter', 'drama'],
    requires: { threadStageIs: 'feud:0' },
    art: 'li_lawn',
    context: 'The lawn · the sunglasses incident · day three of the cold front',
    prompt: 'It started with borrowed sunglasses returned with a thumbprint. It is now a war. {rival} has moved sun loungers to establish a border; {mate} has annexed the good corner of the kitchen. Both of them, separately, today, said to you: “You’ve seen how they are.”',
    recap: 'The sunglasses feud splits the villa and both sides want you onside.',
    choices: {
      left: {
        label: 'Back {mate}, openly',
        tags: ['code', 'loyal'],
        governingStats: { loyalty: 0.7, charisma: 0.3 },
        outcomes: {
          bad: { text: 'You back {mate} with a speech that peaks too early and ends at “…anyway.” {rival} slow-claps once. The border moves two loungers in their favour.', effects: { threadBeat: 'feud', addFlag: 'li_web_feud_side', loyalty: 2, rivalOpinion: -3, burnout: 2 } },
          good: { text: '“I’m with {mate} on this one.” Public, clean, done. {rival} recalculates you from ‘furniture’ to ‘combatant’. The group chat redraws its map.', effects: { bond: 4, threadBeat: 'feud', addFlag: 'li_web_feud_side', loyalty: 5, selfrespect: 2, rivalOpinion: -2 } },
          incredible: { text: 'You back {mate} AND return the sunglasses, polished, with a cleaning cloth. Loyalty plus logistics. The lawn applauds the audacity of an actual solution.', effects: { bond: 5, threadBeat: 'feud', addFlag: 'li_web_feud_side', loyalty: 8, selfrespect: 3, drama: 2 } },
        },
      },
      right: {
        label: 'Broker the peace',
        tags: ['strategy', 'chat'],
        governingStats: { savvy: 0.8, charisma: 0.2 },
        outcomes: {
          bad: { text: 'You convene talks at the big table. Both parties arrive, look at each other, and leave in opposite directions. You chair an empty summit, on camera, holding agenda toasties.', effects: { threadBeat: 'feud', addFlag: 'li_web_feud_broker', savvy: 2, burnout: 3 } },
          good: { text: 'Shuttle diplomacy: you carry three messages, soften two adjectives, and lose only one joke in translation. The border holds. Talks continue.', effects: { threadBeat: 'feud', addFlag: 'li_web_feud_broker', savvy: 5, graft: 2 } },
          incredible: { text: 'You identify the actual grievance in four minutes — it was never the sunglasses; it was the Hut segment about the sunglasses. Both parties go quiet. Progress, of the expensive kind.', effects: { threadBeat: 'feud', addFlag: 'li_web_feud_broker', savvy: 8, selfrespect: 2, graft: 2 } },
        },
      },
    },
  },
  {
    id: 'li_web_feud_peace', act: 2, tags: ['web:feud', 'chat'],
    requires: { threadStageIs: 'feud:1', flagsAll: ['li_web_feud_broker'] },
    art: 'li_kitchen',
    context: 'The kitchen · the toastie summit · a treaty is signed',
    prompt: 'It ends at midnight over toasties, because everything in this villa ends over toasties. {rival} concedes the thumbprint; {mate} concedes the Hut segment. They shake on it like heads of state, then immediately gang up on how YOU chaired the talks.',
    recap: '{rival} and {mate} sign a midnight toastie truce, then turn on you.',
    choices: {
      left: {
        label: 'Take the roasting',
        tags: ['banter', 'rest'],
        governingStats: { charisma: 0.7, loyalty: 0.3 },
        outcomes: {
          bad: { text: 'The united front workshops your “agenda toasties” for twenty minutes. Peace has a price and the price is you. You eat the price. It’s cheese.', effects: { threadResolve: 'feud:peace', charisma: 2, burnout: 2 } },
          good: { text: 'You take the roast with grace, which disarms it. Former enemies bond over your diplomacy voice. Fine. FINE. The villa is healed and you’re the joke. A fair exchange.', effects: { burnout: -4, followers: 2, threadResolve: 'feud:peace', charisma: 5, romantics: 2, rivalOpinion: 3 } },
          incredible: { text: 'You do your diplomacy voice ON REQUEST, at yourself, better than they did. {rival} laughs — actually laughs. A demilitarised zone, with melted cheese.', effects: { burnout: -6, followers: 4, threadResolve: 'feud:peace', charisma: 8, romantics: 2, selfrespect: 2, rivalOpinion: 5 } },
        },
      },
      right: {
        label: 'Invoice them both',
        tags: ['banter', 'strategy'],
        governingStats: { savvy: 0.6, charisma: 0.4 },
        outcomes: {
          bad: { text: '“You both owe me,” you say, and both immediately dispute the invoice. The feud reignites, briefly, about YOU, before collapsing into toastie logistics.', effects: { threadResolve: 'feud:peace', savvy: 2, drama: 2, burnout: 2 } },
          good: { text: '“Two favours. Banked. Non-transferable.” They grumble; they agree. You leave the summit with a full stomach and a small empire of owed goodwill.', effects: { followers: 2, charisma: 3, threadResolve: 'feud:peace', savvy: 5, graft: 4 } },
          incredible: { text: 'You extract terms like a professional: a favour each, plus naming rights to the treaty (“The Toastie Accords”). Historians — the Hut — record it verbatim.', effects: { charisma: 4, threadResolve: 'feud:peace', savvy: 8, graft: 5, followers: 4 } },
        },
      },
    },
  },
  {
    id: 'li_web_feud_coldwar', act: 2, tags: ['web:feud', 'drama'],
    requires: { threadStageIs: 'feud:1', flagsNone: ['li_web_feud_broker'] },
    art: 'li_lawn',
    context: 'The lawn · the villa formalises its borders',
    prompt: 'No explosion. Worse: paperwork. The villa quietly reorganises itself into two zones — {rival}’s end has the good loungers, {mate}’s has the kettle. Traffic between them requires a reason and, ideally, a chaperone. You hold dual citizenship, which is exhausting.',
    recap: 'The villa quietly splits into two zones and you belong to both.',
    choices: {
      left: {
        label: 'Run the corridor',
        tags: ['chat', 'strategy'],
        governingStats: { savvy: 0.6, charisma: 0.4 },
        outcomes: {
          bad: { text: 'You ferry gossip across the border and get searched at both ends. “Whose side are you ON?” they ask, simultaneously, from opposite ends of the pool. The acoustics are humiliating.', effects: { threadResolve: 'feud:coldwar', drama: 3, burnout: 3 } },
          good: { text: 'You become the only neutral channel: teas northbound, sunscreen south. Both sides trust you exactly as far as their errands. It’s something. It’s logistics.', effects: { threadResolve: 'feud:coldwar', drama: 3, savvy: 5, graft: 2 } },
          incredible: { text: 'You broker nothing, fix nothing — but you keep both kettles running and both parties fed, and the villa functions out of sheer administrative respect for you.', effects: { threadResolve: 'feud:coldwar', drama: 3, savvy: 8, graft: 3 } },
        },
      },
      right: {
        label: 'Build a third zone',
        tags: ['banter', 'camera'],
        governingStats: { charisma: 0.8, savvy: 0.2 },
        outcomes: {
          bad: { text: 'You declare the daybed a neutral republic. Population: you. Both blocs boycott it on principle, and you govern a cushion, alone, in the wide shot.', effects: { threadResolve: 'feud:coldwar', drama: 3, burnout: 2, followers: 2 } },
          good: { text: '“The daybed is Switzerland,” you announce. “No flags, no debriefs, snacks amnesty.” Defectors trickle in by sunset. Your republic has a census.', effects: { threadResolve: 'feud:coldwar', drama: 4, charisma: 5, followers: 4 } },
          incredible: { text: 'By day two your neutral zone has better attendance than either bloc. The feud dies of low ratings — the one death this villa respects. You did that. With cushions.', effects: { followers: 4, threadResolve: 'feud:coldwar', drama: 5, charisma: 8, public: 3 } },
        },
      },
    },
  },

  // ---------- SCORCHED — Sophia, after the triangle ----------
  {
    id: 'li_web_sco_0', act: 2, tags: ['web:scorched', 'temptation', 'drama'],
    requires: { threadStageIs: 'scorched:0' },
    art: 'li_terrace',
    context: 'Golden hour · the terrace · Sophia wears the good perfume',
    prompt: 'Sophia — newly single, freshly furious, immaculately composed — has chosen a seat. It is next to {partner}. “I just think,” she says, at a volume calibrated for exactly you, “some people in here actually LISTEN.” {partner} nods along, oblivious as a labrador.',
    recap: 'Newly single Sophia parks next to {partner}, aiming her volume at you.',
    choices: {
      left: {
        label: 'Trust them. Watch anyway',
        tags: ['loyal', 'rest'],
        governingStats: { loyalty: 0.7, savvy: 0.3 },
        outcomes: {
          bad: { text: 'You trust from a distance of four metres with the stillness of a heron. “You okay?” asks {mate}. You are a fully operational surveillance state, thank you.', effects: { threadBeat: 'scorched', addFlag: 'li_web_sco_cool', loyalty: 2, burnout: 3 } },
          good: { text: 'You let it play. {partner} tells Sophia about your worst habit, fondly, at length — and the flirtation dies of natural causes. Trust: the boring superpower.', effects: { burnout: -4, threadBeat: 'scorched', addFlag: 'li_web_sco_cool', loyalty: 5, bond: 5, romantics: 2 } },
          incredible: { text: '“You two are ANNOYING,” Sophia announces after ten minutes, standing up — the highest compliment a scorched person can pay a couple. The nation stitches it over your montage.', effects: { burnout: -6, threadBeat: 'scorched', addFlag: 'li_web_sco_cool', loyalty: 8, bond: 6, romantics: 3 } },
        },
      },
      right: {
        label: 'Arrive with three drinks',
        tags: ['strategy', 'banter'],
        governingStats: { savvy: 0.5, charisma: 0.5 },
        outcomes: {
          bad: { text: 'You arrive so fast one drink is just ice. Sophia clocks the interception, smiles like a knife shop, and toasts “to SECURE couples.” The terrace enjoys that enormously.', effects: { threadBeat: 'scorched', addFlag: 'li_web_sco_guard', drama: 3, burnout: 3 } },
          good: { text: 'Three drinks, one raised eyebrow, seamless entry. Sophia respects craft when she sees it. The seating chart quietly reverts. Nothing happened; everything was said.', effects: { followers: 2, charisma: 3, threadBeat: 'scorched', addFlag: 'li_web_sco_guard', savvy: 5, drama: 2, bond: 4 } },
          incredible: { text: '“Room for a third?” you ask, already sitting. Twenty minutes later you and Sophia are laughing at the same story and {partner} is getting the drinks. Threat: recruited.', effects: { followers: 4, threadBeat: 'scorched', addFlag: 'li_web_sco_guard', savvy: 4, charisma: 8, drama: 2 } },
        },
      },
    },
  },
  {
    id: 'li_web_sco_loud', act: 2, tags: ['web:scorched', 'drama'],
    requires: { threadStageIs: 'scorched:1', flagsAll: ['li_web_sco_guard'] },
    art: 'li_firepit',
    context: 'Drinks on the lawn · Sophia has an announcement voice on',
    prompt: '“Can I say something?” Sophia doesn’t wait. “Marco wasted my time — I won’t waste mine.” She crosses the lawn and pulls the tallest available singleton for a chat, holding eye contact with the entire villa on the way. It’s not a chat. It’s a press conference.',
    recap: 'Sophia pulls the tallest singleton like a full press conference.',
    choices: {
      left: {
        label: 'Front row, drink up',
        tags: ['camera', 'banter'],
        governingStats: { charisma: 0.6, savvy: 0.4 },
        outcomes: {
          bad: { text: 'You watch so openly Sophia dedicates a line to you: “At least SOMEONE appreciates theatre.” You raise your glass on reflex. You’re in the piece now.', effects: { threadResolve: 'scorched:loud', drama: 3, burnout: 2, followers: 2, storyBeat: 'The scorched bombshell came for your couple first — and left empty-handed.' } },
          good: { text: 'It is, objectively, spectacular television. You commentate quietly for {mate}: “She’s taken the long route past Marco. Twice.” Three times. A victory lap.', effects: { charisma: 3, threadResolve: 'scorched:loud', drama: 4, savvy: 5, followers: 3, storyBeat: 'The scorched bombshell came for your couple first — and left empty-handed.' } },
          incredible: { text: '“Grief does a rebrand,” you murmur, and the boom mic hands the line straight to the nation. Sophia hears it played back at the reunion and toasts you. Iconic behaviour, all round.', effects: { threadResolve: 'scorched:loud', drama: 5, charisma: 8, followers: 6, storyBeat: 'The scorched bombshell came for your couple first — and left empty-handed.' } },
        },
      },
      right: {
        label: 'Check on Marco, of all people',
        tags: ['chat', 'loyal'],
        governingStats: { loyalty: 0.6, savvy: 0.4 },
        outcomes: {
          bad: { text: 'Marco takes your sympathy as recruitment and starts drafting a response bit. You wanted to be kind; you’re now a campaign office.', effects: { threadResolve: 'scorched:loud', drama: 2, burnout: 3, rivalOpinion: 2, storyBeat: 'The scorched bombshell came for your couple first — and left empty-handed.' } },
          good: { text: '“You good?” you ask. Marco watches the press conference over your shoulder. “She’s brilliant, isn’t she,” he says, mostly to himself. Growth, possibly. Skincare, definitely.', effects: { bond: 4, threadResolve: 'scorched:loud', loyalty: 5, drama: 2, romantics: 1, storyBeat: 'The scorched bombshell came for your couple first — and left empty-handed.' } },
          incredible: { text: 'You sit with the villain during his own cancellation, saying nothing useful, which is exactly what he needed. The nation notices who noticed. Quiet numbers, good ones.', effects: { bond: 5, threadResolve: 'scorched:loud', loyalty: 8, public: 3, romantics: 2, storyBeat: 'The scorched bombshell came for your couple first — and left empty-handed.' } },
        },
      },
    },
  },
  {
    id: 'li_web_sco_grace', act: 2, tags: ['web:scorched', 'chat'],
    requires: { threadStageIs: 'scorched:1', flagsNone: ['li_web_sco_guard'] },
    art: 'li_firepit_day',
    context: 'Morning · the firepit · Sophia, unbothered, moisturised',
    prompt: '“I’m gonna say this once.” Sophia, morning light, no notes. “I came here for something real. That wasn’t it. And I’m not jumping straight into the next thing to prove a point — I’m just gonna enjoy my summer, me.” She sits down and eats a peach like punctuation.',
    recap: 'Sophia says her piece: no rebound, just enjoying her summer.',
    choices: {
      left: {
        label: 'Tell her that was elite',
        tags: ['chat', 'code'],
        governingStats: { charisma: 0.5, loyalty: 0.5 },
        outcomes: {
          bad: { text: '“Elite,” you say, slightly too reverently, and Sophia laughs at you, not with you. “It’s a peach, babe, not a manifesto.” It was both. Everyone knows it was both.', effects: { threadResolve: 'scorched:grace', selfrespect: 3, burnout: 1, storyBeat: 'Your couple was the rebound target and never blinked. Tested, publicly, and held.' } },
          good: { text: '“That,” you tell her, “was the most dignified thing this lawn has ever hosted.” Sophia shrugs: “Low bar.” True. Still. The nation’s spine-havers have a new president.', effects: { threadResolve: 'scorched:grace', selfrespect: 4, romantics: 2, storyBeat: 'Your couple was the rebound target and never blinked. Tested, publicly, and held.' } },
          incredible: { text: 'You say nothing; you just bring her a second peach. Sophia looks at it, then at you, and files you under ‘keeps’. Alliances have been founded on less. Most are.', effects: { threadResolve: 'scorched:grace', selfrespect: 5, romantics: 2, graft: 3, storyBeat: 'Your couple was the rebound target and never blinked. Tested, publicly, and held.' } },
        },
      },
      right: {
        label: 'Measure your couple against it',
        tags: ['date', 'chat'],
        governingStats: { loyalty: 0.8, savvy: 0.2 },
        outcomes: {
          bad: { text: '“Would you do a peach speech about me?” you ask {partner}, who panics and says “I’d do a whole fruit bowl?” The recovery is worse than the crime. Somehow also sweeter.', effects: { threadResolve: 'scorched:grace', selfrespect: 2, bond: 2, burnout: 2, storyBeat: 'Your couple was the rebound target and never blinked. Tested, publicly, and held.' } },
          good: { text: 'Watching someone choose themselves makes you audit what you chose. The audit comes back clean: {partner}, mid-laugh, holding your suncream unasked. Fine. Good, even.', effects: { threadResolve: 'scorched:grace', selfrespect: 2, bond: 6, romantics: 2, storyBeat: 'Your couple was the rebound target and never blinked. Tested, publicly, and held.' } },
          incredible: { text: '“If you ever waste my time,” you tell {partner}, peach-solemn, “I’m stealing her speech.” “If I ever waste your time,” they say, “help her write it.” Right answer. Alarmingly right.', effects: { threadResolve: 'scorched:grace', selfrespect: 3, bond: 6, romantics: 3, storyBeat: 'Your couple was the rebound target and never blinked. Tested, publicly, and held.' } },
        },
      },
    },
  },

  // ---------- CALLBACKS — the villa remembers ----------
  {
    id: 'li_web_cb_showdown', act: [2, 3], weight: 1, tags: ['web-callback', 'challenge', 'camera'],
    requires: { threadOutcomeIs: 'triangle:showdown' },
    art: 'li_challenge',
    context: 'Challenge day · the reenactment round',
    prompt: '“Islanders! Today’s challenge: REENACT THE SEASON’S BIGGEST MOMENTS.” The first card out of the box is the firepit showdown. Everyone turns to you — you were IN frame. Casting has opinions, and casting is six people in swimwear holding a smoothie prop.',
    recap: 'Challenge day: the villa must reenact the firepit showdown you were in.',
    choices: {
      left: {
        label: 'Play Sophia. Fully',
        tags: ['camera', 'banter', 'challenge'],
        governingStats: { charisma: 1 },
        outcomes: {
          bad: { text: 'Your Sophia is two octaves off and one adjective over. The real Sophia grades it from a lounger: “Defamation.” The scores agree.', effects: { charisma: 2, drama: 2, burnout: 2 } },
          good: { text: 'You nail the straw hand-off. The garden howls; Sophia awards you a grudging “fine, THAT bit.” Points on the board, receipts in the archive.', effects: { charisma: 5, drama: 3, followers: 3 } },
          incredible: { text: 'You do the pause before ‘business decision’ so perfectly Sophia breaks first, cackling into her hat. The reenactment out-rates the original. Give back the smoothie. Keep the crown.', effects: { charisma: 8, drama: 4, followers: 6, public: 2 } },
        },
      },
      right: {
        label: 'Direct it instead',
        tags: ['strategy', 'challenge'],
        governingStats: { savvy: 1 },
        outcomes: {
          bad: { text: 'Your blocking notes exceed the challenge’s runtime. “It’s a BIT,” says the cast, mutinying. Art is dead; the scores kill it again.', effects: { savvy: 2, burnout: 2, drama: 1 } },
          good: { text: 'You cast Marco as HIMSELF, which he accepts with alarming enthusiasm. The meta-layer lands; the judges (a whiteboard) approve.', effects: { savvy: 5, drama: 3, graft: 2 } },
          incredible: { text: 'Your production wins the round and Marco’s self-portrayal earns a genuine ovation. “I contain layers,” he says. Today, briefly, he does.', effects: { savvy: 8, drama: 4, public: 3 } },
        },
      },
    },
  },
  {
    id: 'li_web_cb_together', act: [2, 3], weight: 1, tags: ['web-callback', 'chat'],
    requires: { threadOutcomeIs: 'slowburn:together' },
    art: 'li_kitchen',
    context: 'Morning · the institution formerly known as the wall tea',
    prompt: 'Dev and Tash now make tea for the WHOLE villa every morning, a two-person institution with a rota and, rumour has it, a stairs-based origin story they refuse to confirm. “Yours,” says Tash, handing you a mug that is somehow exactly right. The bar in here keeps rising.',
    recap: 'Dev and Tash now run the villa’s morning tea rota for everyone.',
    choices: {
      left: {
        label: 'Raise your own bar',
        tags: ['date', 'loyal'],
        governingStats: { loyalty: 0.7, rizz: 0.3 },
        outcomes: {
          bad: { text: 'Inspired, you attempt {partner}’s coffee order from memory and produce something legally distinct from coffee. “It’s the thought,” they say, not drinking the thought.', effects: { bond: 2, romantics: 1, burnout: 2 } },
          good: { text: 'You start learning the small things on purpose — the order, the side of the bed, the one song. Institutions are built one memorised detail at a time.', effects: { bond: 6, romantics: 2 } },
          incredible: { text: 'A week later {partner} finds their preferred mug pre-warmed and narrows their eyes. “Who taught you that?” The stairs taught you. The whole villa went to the same school.', effects: { bond: 6, romantics: 3, public: 2 } },
        },
      },
      right: {
        label: 'Audit the rota for content',
        tags: ['camera', 'banter'],
        governingStats: { charisma: 0.6, savvy: 0.4 },
        outcomes: {
          bad: { text: 'Your Hut segment on Big Tea runs long and lands short. “It’s… nice?” offers the booth, which is how comedy dies. The rota outlives your bit.', effects: { followers: 2, burnout: 2 } },
          good: { text: '“The most stable relationship in here is between that kettle and the nation,” you tell the Hut. The line does numbers. The kettle is unavailable for comment.', effects: { followers: 4, drama: 2, charisma: 5 } },
          incredible: { text: 'You produce a full mock documentary — THE BREW: A LOVE STORY — narrated over Dev’s rota whiteboard. The show cuts it in as an actual segment. Broadcast history.', effects: { followers: 7, drama: 3, charisma: 8 } },
        },
      },
    },
  },
  {
    id: 'li_web_cb_wakes', act: [2, 3], weight: 1, tags: ['web-callback', 'banter'],
    requires: { threadOutcomeIs: 'lovebomb:wakes' },
    art: 'li_daybed',
    context: 'The daybed · Kai, reborn, has advice now',
    prompt: 'Kai — post-spine, insufferably serene — has taken up dispensing relationship wisdom from the daybed like a lifeguard of the heart. “The thing about boundaries,” he begins, to YOU, the person who taught him the word. {mate} is already recording it on an invisible phone.',
    recap: 'Kai dispenses boundary advice from the daybed — to you, who taught him.',
    choices: {
      left: {
        label: 'Let him have it',
        tags: ['rest', 'banter'],
        governingStats: { charisma: 0.5, loyalty: 0.5 },
        outcomes: {
          bad: { text: 'You endure the full seminar, including a section titled “knowing your worth” with hand gestures. Your worth, currently: one daybed hostage.', effects: { charisma: 2, burnout: 2, romantics: 1 } },
          good: { text: 'You nod along while Kai reinvents, from scratch, advice you gave him verbatim. Teachers don’t need credit. Teachers need this clip saved, which the nation handles.', effects: { burnout: -4, charisma: 5, romantics: 2, followers: 3 } },
          incredible: { text: '“That’s so wise, Kai,” you say, perfectly level, and he BEAMS. {mate} makes a sound like a kettle. The nation crowns you the villa’s most patient person. Sainthood, basically.', effects: { burnout: -6, charisma: 8, romantics: 2, followers: 5, public: 2 } },
        },
      },
      right: {
        label: '“Say the shade name”',
        tags: ['banter', 'drama'],
        governingStats: { charisma: 0.7, savvy: 0.3 },
        outcomes: {
          bad: { text: '“Marbella Sunset,” Kai says instantly, wistful, and the seminar collapses into a support group. You broke the sage. Put the sage back.', effects: { drama: 2, burnout: 2 } },
          good: { text: 'Kai pauses mid-wisdom. “…Not coral,” he concedes, and grins. Growth with a sense of humour about itself — the rarest villa export.', effects: { followers: 2, drama: 3, charisma: 5 } },
          incredible: { text: 'The whole daybed chants “NOT CORAL” like a terrace. Kai conducts. Somewhere, Chloe hears it and — sources say — laughs into her iced coffee. Healing, at scale.', effects: { drama: 4, charisma: 8, followers: 5 } },
        },
      },
    },
  },
];
