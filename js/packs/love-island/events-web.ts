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

  // ---------- THE SITUATIONSHIP — Tyler & Meg ----------
  {
    id: 'li_web_situationship_0', act: [1, 2], tags: ['web:situationship', 'encounter', 'chat'],
    requires: { threadStageIs: 'situationship:0' },
    art: 'li_kitchen',
    context: 'The kitchen · Meg is being extremely chill about it',
    prompt: '“We’re not, like, a THING,” Meg tells you, chopping a pepper into increasingly small pieces. “It’s casual. I’m so casual. He called me ‘pal’ yesterday and I said ‘pal’ back and then cried in the pantry. But casual.” Across the garden, Tyler winks at the weather.',
    recap: 'Meg insists she and Tyler are ‘so casual’ while dicing a pepper to dust.',
    choices: {
      left: {
        label: 'Tell her she deserves a straight answer',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 0.6, charisma: 0.4 },
        outcomes: {
          bad: { text: '“Define it? God no, that’s so intense,” Meg says, then defines it four times to the pepper. You’ve started something. The pepper is a witness.', effects: { threadBeat: 'situationship', addFlag: 'li_web_situationship_in', loyalty: 2, burnout: 2 } },
          good: { text: '“You’re allowed to want a straight answer.” Meg stops chopping. “…Am I though.” “Yeah.” She sets the knife down like it’s a decision.', effects: { bond: 4, threadBeat: 'situationship', addFlag: 'li_web_situationship_in', loyalty: 5, selfrespect: 2 } },
          incredible: { text: '“He says ‘pal,’ you cry in the pantry. That’s not casual, that’s a hostage situation with snacks.” Meg laughs, then goes quiet. “I’m gonna ask him.” A spine boots up.', effects: { bond: 5, threadBeat: 'situationship', addFlag: 'li_web_situationship_in', loyalty: 8, selfrespect: 3 } },
        },
      },
      right: {
        label: 'Let her keep her cool',
        tags: ['rest', 'strategy'],
        governingStats: { savvy: 0.7, loyalty: 0.3 },
        outcomes: {
          bad: { text: 'You nod along to “so casual” so supportively that Meg doubles down and the pepper becomes paste. Nobody has helped anybody.', effects: { threadBeat: 'situationship', savvy: 2, burnout: 2 } },
          good: { text: 'Some people find the words on their own clock. You leave Meg, the pepper, and the enormous unspoken thing to marinate. Not your kitchen to run.', effects: { burnout: -4, threadBeat: 'situationship', savvy: 5 } },
          incredible: { text: 'You say nothing and quietly move the tissues within reach. Meg clocks it. “You think I’m gonna need those.” You think she’s gonna need those. She keeps them close.', effects: { burnout: -6, threadBeat: 'situationship', savvy: 8, graft: 2 } },
        },
      },
    },
  },
  {
    id: 'li_web_situationship_1', act: [1, 2], tags: ['web:situationship', 'encounter', 'gossip'],
    requires: { threadStageIs: 'situationship:0' },
    art: 'li_daybed',
    context: 'The daybed · {mate} has a theory and a timeline',
    prompt: '“Right, don’t say I said,” {mate} says, saying it. “Tyler told the lads Meg’s ‘a laugh, but not, like, THE laugh.’ Meg’s telling the girls she’s ‘lowkey obsessed.’ They’re having two different situationships. In the same one.”',
    recap: '{mate} clocks that Tyler and Meg are in two different situationships at once.',
    choices: {
      left: {
        label: 'Warn Meg what he said',
        tags: ['code', 'loyal'],
        governingStats: { loyalty: 0.6, savvy: 0.4 },
        outcomes: {
          bad: { text: 'You get to “not, like, THE laugh” and Meg’s face falls, then reassembles into “I KNEW that, obviously.” She did not know that. Now she knows you know.', effects: { threadBeat: 'situationship', addFlag: 'li_web_situationship_in', loyalty: 2, burnout: 2 } },
          good: { text: '“I’d want to know,” you say, no garnish. Meg nods slowly. “Yeah. Me too.” She stops laughing at his jokes for a full afternoon. Rehearsing something.', effects: { bond: 4, threadBeat: 'situationship', addFlag: 'li_web_situationship_in', loyalty: 5, selfrespect: 2 } },
          incredible: { text: '“You’re THE laugh,” you tell her. “He just hasn’t got the nerve to be funny back.” Meg files it somewhere load-bearing. The next move is hers, and she knows it now.', effects: { bond: 5, threadBeat: 'situationship', addFlag: 'li_web_situationship_in', loyalty: 8, selfrespect: 3 } },
        },
      },
      right: {
        label: 'Stay out of the crossfire',
        tags: ['strategy', 'rest'],
        governingStats: { savvy: 1 },
        outcomes: {
          bad: { text: 'You keep the intel and immediately look shifty every time Tyler walks past. Meg asks why your face is “doing a thing.” Your face is doing a thing.', effects: { threadBeat: 'situationship', savvy: 2, burnout: 2 } },
          good: { text: 'Two people describing the same non-relationship differently isn’t your file to open. You hand {mate} back the gossip, unspent.', effects: { threadBeat: 'situationship', savvy: 5, graft: 2 } },
          incredible: { text: 'You let it lie — and watch it resolve itself by Thursday without a single fingerprint of yours on it. The cleanest kind of clever: absent.', effects: { threadBeat: 'situationship', savvy: 8, graft: 3 } },
        },
      },
    },
  },
  {
    id: 'li_web_sit_called', act: 2, tags: ['web:situationship', 'chat'],
    requires: { threadStageIs: 'situationship:1', flagsAll: ['li_web_situationship_in'] },
    art: 'li_firepit',
    context: 'The firepit · Meg, unexpectedly, stands up',
    prompt: '“Tyler. Quick one.” Meg’s voice doesn’t wobble, which is new. “I like you. Properly. If you’re just here for a laugh, fair enough — but I’m done doing ‘pal.’” Tyler opens his mouth. The garden leans in for the winker’s first-ever sincere sentence.',
    recap: 'Meg calls it at the firepit: she’s done being Tyler’s ‘pal.’',
    choices: {
      left: {
        label: 'Have her back',
        tags: ['loyal', 'banter'],
        governingStats: { charisma: 0.5, loyalty: 0.5 },
        outcomes: {
          bad: { text: 'You whoop one beat too early and Tyler jumps. He recovers with a wink, which is the wrong tool. Meg clocks it. So does the nation. So do you.', effects: { threadResolve: 'situationship:called', romantics: 2, drama: 2, burnout: 2 } },
          good: { text: 'You hold the silence with her. Tyler, cornered into honesty, manages: “I don’t do this. I’d… like to do this.” Meg exhales a week of held breath.', effects: { bond: 4, threadResolve: 'situationship:called', selfrespect: 3, romantics: 2 } },
          incredible: { text: '“Say it without a wink,” you tell Tyler, kindly. He does. It’s clumsy and true and the worst delivery all season. Meg keeps it. So does the nation’s spine wing.', effects: { bond: 5, threadResolve: 'situationship:called', selfrespect: 4, romantics: 3, public: 2 } },
        },
      },
      right: {
        label: 'Let it be their moment',
        tags: ['rest', 'loyal'],
        governingStats: { loyalty: 0.7, savvy: 0.3 },
        outcomes: {
          bad: { text: 'You give them privacy so hard you back into a bin. The clip is you and the bin. Meg’s moment airs; so does the bin. The bin trends.', effects: { threadResolve: 'situationship:called', selfrespect: 2, burnout: 2, followers: 2 } },
          good: { text: 'You look away and let a brave sentence be someone else’s. Meg finds you later: “Thanks for not making it a bit.” From Meg, that’s a medal.', effects: { threadResolve: 'situationship:called', selfrespect: 3, romantics: 2, bond: 4 } },
          incredible: { text: 'You catch Meg’s eye once — just once — and nod. She squares her shoulders and finishes it herself. The autonomy is the gift. She never forgets who gave it.', effects: { threadResolve: 'situationship:called', selfrespect: 4, romantics: 2, graft: 3 } },
        },
      },
    },
  },
  {
    id: 'li_web_sit_strung', act: 2, tags: ['web:situationship', 'chat'],
    requires: { threadStageIs: 'situationship:1', flagsNone: ['li_web_situationship_in'] },
    art: 'li_lawn',
    context: 'The lawn · nothing gets said, expensively',
    prompt: 'It doesn’t resolve so much as continue. Tyler winks; Meg laughs; neither says the sentence. “We’re good,” Meg announces to no one who asked. The situationship rolls into another week like fog that’s developed a personality.',
    recap: 'Tyler and Meg say nothing, and the situationship fogs onward.',
    choices: {
      left: {
        label: 'Rate the non-relationship with {mate}',
        tags: ['banter', 'chat'],
        governingStats: { charisma: 0.6, savvy: 0.4 },
        outcomes: {
          bad: { text: '“It’s not a couple, it’s a group project nobody’s doing,” you say — as Meg rounds the daybed. The sentence goes into witness protection. Her face doesn’t.', effects: { threadResolve: 'situationship:strung', drama: 2, burnout: 2 } },
          good: { text: '“Longest ‘we’re good’ in villa history,” {mate} says. You clink mugs to the couples running purely on avoidance. Grim work, but someone’s got to commentate.', effects: { threadResolve: 'situationship:strung', charisma: 3, followers: 2, drama: 1 } },
          incredible: { text: 'You and {mate} do a full weather report on “Storm Casual — no landfall expected.” The Hut runs it as a segment. The fog remains, undefeated, undefined.', effects: { threadResolve: 'situationship:strung', charisma: 4, followers: 5, drama: 2 } },
        },
      },
      right: {
        label: 'Leave them to the fog',
        tags: ['rest', 'strategy'],
        governingStats: { savvy: 0.7, loyalty: 0.3 },
        outcomes: {
          bad: { text: 'You mind your business so hard you miss Meg trying to catch your eye for backup. By the time you look up, she’s laughing at another wink. Chance gone.', effects: { threadResolve: 'situationship:strung', savvy: 2, burnout: 2 } },
          good: { text: 'Not every fog needs a forecaster. You let the two of them drift and put your energy where a real answer might actually land — your own couple.', effects: { threadResolve: 'situationship:strung', savvy: 5, bond: 3 } },
          incredible: { text: 'You say nothing and simply out-couple them — visibly, boringly, honestly — until the contrast does the talking. Meg watches you two and, quietly, recalculates.', effects: { threadResolve: 'situationship:strung', savvy: 6, bond: 5, romantics: 2 } },
        },
      },
    },
  },

  // ---------- THE POLITE ONES — Reece & Priya ----------
  {
    id: 'li_web_polite_0', act: [1, 2], tags: ['web:politeones', 'encounter', 'chat'],
    requires: { threadStageIs: 'politeones:0' },
    art: 'li_daybed',
    context: 'The daybed · a couple so agreeable it’s alarming',
    prompt: 'Reece and Priya have never had a cross word, which the villa finds either beautiful or suspicious. “We just, like, GET each other,” Priya says. “Totally,” says Reece, about a film he clearly hasn’t seen. They agree on everything. Neither can name their partner’s favourite anything.',
    recap: 'Reece and Priya agree on everything and know nothing about each other.',
    choices: {
      left: {
        label: 'Ask them one real question',
        tags: ['chat', 'loyal'],
        governingStats: { loyalty: 0.5, charisma: 0.5 },
        outcomes: {
          bad: { text: '“What scares you?” you ask. Reece says “spiders?” like a question. Priya says “same.” They high-five. You have learned nothing and neither, alarmingly, have they.', effects: { threadBeat: 'politeones', addFlag: 'li_web_politeones_in', charisma: 2, burnout: 2 } },
          good: { text: '“When did you last disagree?” Silence. Reece: “…I don’t actually like the beach.” Priya turns, delighted and betrayed: “We’ve been to the beach FOUR times.” A first crack of something real.', effects: { bond: 4, threadBeat: 'politeones', addFlag: 'li_web_politeones_in', charisma: 5, romantics: 2 } },
          incredible: { text: 'One real question and the dam goes. Turns out he hates her favourite band; she thinks his laugh is “a lot.” They argue for the first time — and light up doing it. You’ve unlocked them.', effects: { bond: 5, threadBeat: 'politeones', addFlag: 'li_web_politeones_in', charisma: 6, romantics: 3, public: 2 } },
        },
      },
      right: {
        label: 'Leave the nice couple alone',
        tags: ['rest', 'strategy'],
        governingStats: { savvy: 0.7, loyalty: 0.3 },
        outcomes: {
          bad: { text: 'You decide harmony’s not a crime and wander off — into a genuine row by the pool, which you’d rather not have found. Should’ve stayed with the nice ones.', effects: { threadBeat: 'politeones', savvy: 2, burnout: 2 } },
          good: { text: 'Maybe easy is just easy. You let the agreeable ones be agreeable and take your coffee somewhere with less consensus and more content.', effects: { burnout: -4, threadBeat: 'politeones', savvy: 5 } },
          incredible: { text: 'You watch them finish each other’s bland sentences and decide the experiment can run itself. Some couples are a documentary you don’t need to narrate.', effects: { burnout: -6, threadBeat: 'politeones', savvy: 8, graft: 2 } },
        },
      },
    },
  },
  {
    id: 'li_web_polite_1', act: [1, 2], tags: ['web:politeones', 'encounter', 'chat'],
    requires: { threadStageIs: 'politeones:0' },
    art: 'li_terrace',
    context: 'The terrace · Priya, quietly, to you',
    prompt: '“Can I be honest?” Priya keeps her voice low. “Reece is lovely. Genuinely. But I don’t know if it’s a spark or if we’re both just… well-mannered. Is that mad? Everyone says we’re the safe couple like it’s a compliment.” She watches Reece agree with someone across the lawn.',
    recap: 'Priya admits she can’t tell if it’s a spark or just good manners.',
    choices: {
      left: {
        label: '“Poke it and find out”',
        tags: ['chat', 'loyal'],
        governingStats: { loyalty: 0.6, savvy: 0.4 },
        outcomes: {
          bad: { text: '“Start a fight, on purpose?” Priya looks scandalised, then intrigued, then guilty, then intrigued again. You may have taught a sweetheart chaos. Sorry, villa.', effects: { threadBeat: 'politeones', addFlag: 'li_web_politeones_in', loyalty: 2, burnout: 2 } },
          good: { text: '“Safe isn’t the same as sure,” you say. “Have one honest row and see if you miss him after.” Priya nods slowly. “…That’s terrifying advice.” It is. It’s also right.', effects: { bond: 4, threadBeat: 'politeones', addFlag: 'li_web_politeones_in', loyalty: 5, romantics: 2 } },
          incredible: { text: '“Nice is comfy,” you say. “I just don’t know if you’d pick him on a bad day.” You only name what Priya already suspects. Whether she goes and finds out is hers — but she’s stopped pretending she doesn’t know.', effects: { bond: 5, threadBeat: 'politeones', addFlag: 'li_web_politeones_in', loyalty: 8, romantics: 3 } },
        },
      },
      right: {
        label: '“Nice is underrated”',
        tags: ['loyal', 'rest'],
        governingStats: { loyalty: 0.7, savvy: 0.3 },
        outcomes: {
          bad: { text: 'You champion nice so hard Priya feels obliged to stay nice, which is the opposite of clarity. You’ve talked her back into the fog. Kindly. Uselessly.', effects: { threadBeat: 'politeones', loyalty: 2, burnout: 2 } },
          good: { text: '“Half this villa would kill for boring,” you say. Priya considers it. “Maybe I’m looking for a problem.” Maybe. You’ve at least given calm a fair hearing.', effects: { threadBeat: 'politeones', loyalty: 5, romantics: 1 } },
          incredible: { text: '“You don’t need fireworks,” you say, “you need to know if you’d pick him on a bad day.” Priya goes quiet. That’s the actual question, and now it’s hers.', effects: { threadBeat: 'politeones', loyalty: 6, romantics: 2, selfrespect: 2 } },
        },
      },
    },
  },
  {
    id: 'li_web_polite_spark', act: 2, tags: ['web:politeones', 'drama'],
    requires: { threadStageIs: 'politeones:1', flagsAll: ['li_web_politeones_in'] },
    art: 'li_firepit',
    context: 'The firepit · the polite ones have their first row',
    prompt: 'It arrives over something absurd — the correct way to load a dishwasher — and escalates into the first real thing they’ve ever said to each other. “You never actually TELL me anything,” Priya says. “Because you AGREE with everything, that’s the problem.” The villa braces. Then, mid-row, they both start laughing. Oh. There it is.',
    recap: 'Reece and Priya’s first proper row turns into their first real spark.',
    choices: {
      left: {
        label: 'Toast the breakthrough',
        tags: ['banter', 'loyal'],
        governingStats: { charisma: 0.6, loyalty: 0.4 },
        outcomes: {
          bad: { text: 'You applaud a couple’s first fight, which sounds worse out loud than in your head, as several faces inform you. Priya, at least, gets the bit. Reece is still on dishwashers.', effects: { threadResolve: 'politeones:spark', romantics: 2, drama: 2, burnout: 2 } },
          good: { text: '“That’s the most I’ve ever seen you two feel,” you say. Priya grins. “I know. It’s horrible. I love it.” A safe couple just became an interesting one.', effects: { bond: 4, threadResolve: 'politeones:spark', romantics: 3, charisma: 3 } },
          incredible: { text: '“Never trust a couple that’s never argued about a dishwasher,” you announce. The garden howls. Reece and Priya, hand in hand and still bickering, become the villa’s dark horse.', effects: { bond: 5, threadResolve: 'politeones:spark', romantics: 4, charisma: 4, public: 2 } },
        },
      },
      right: {
        label: 'Measure it against your own couple',
        tags: ['date', 'chat'],
        governingStats: { loyalty: 0.7, rizz: 0.3 },
        outcomes: {
          bad: { text: '“Do WE ever properly argue?” you ask {partner}, who panics: “We’re arguing now?” You’re not. You are now. The polite disease is catching.', effects: { threadResolve: 'politeones:spark', romantics: 2, bond: 2, burnout: 2 } },
          good: { text: 'Watching them find heat in a row makes you check your own. The audit’s reassuring: you and {partner} disagree fine, and mean it, and stay. Nice to know it’s real.', effects: { threadResolve: 'politeones:spark', romantics: 2, bond: 6 } },
          incredible: { text: '“Promise me we’ll fight about a dishwasher one day,” you tell {partner}. “We don’t have a dishwasher.” “Then we’re already winning.” The realest vow said as a joke.', effects: { threadResolve: 'politeones:spark', romantics: 3, bond: 6 } },
        },
      },
    },
  },
  {
    id: 'li_web_polite_fade', act: 2, tags: ['web:politeones', 'chat'],
    requires: { threadStageIs: 'politeones:1', flagsNone: ['li_web_politeones_in'] },
    art: 'li_lawn',
    context: 'The lawn · the nicest breakup you’ll ever see',
    prompt: 'It ends the way it ran: politely. “I think we’re better as mates,” says Priya. “Honestly, same,” says Reece, and means it, and they hug like people who were never quite anything. No tears. The villa doesn’t know whether to clap. Neither, really, do they.',
    recap: 'Reece and Priya agree, amicably, that they were only ever mates.',
    choices: {
      left: {
        label: 'Sit with Priya after',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 0.7, savvy: 0.3 },
        outcomes: {
          bad: { text: '“Are you okay?” you ask. “That’s the thing,” Priya says, “I’m completely fine, and that’s how I know.” You’ve no comfort to give a wound that never opened.', effects: { threadResolve: 'politeones:fade', loyalty: 2, romantics: 1, burnout: 2 } },
          good: { text: '“Better to find out now than in a flat in Croydon,” you say. Priya laughs, relieved. “God, yeah.” Sometimes the kindest ending is the one nobody cried at.', effects: { bond: 4, threadResolve: 'politeones:fade', loyalty: 5, romantics: 2 } },
          incredible: { text: '“You didn’t lose a spark,” you tell her, “you just stopped pretending to look for one.” Priya sits with that. “That’s… annoyingly healthy.” She leaves lighter than she arrived.', effects: { bond: 5, threadResolve: 'politeones:fade', loyalty: 8, selfrespect: 2 } },
        },
      },
      right: {
        label: 'Note the lesson for yourself',
        tags: ['date', 'strategy'],
        governingStats: { loyalty: 0.6, savvy: 0.4 },
        outcomes: {
          bad: { text: 'You get so philosophical about “comfortable isn’t the same as connected” that {partner} asks if you’re breaking up with them. You are not. Probably clarify that.', effects: { threadResolve: 'politeones:fade', bond: -2, burnout: 2 } },
          good: { text: 'Their tidy ending makes you check yours isn’t just tidy too. It isn’t — there’s heat under the calm. You go find {partner} to make sure it stays lit.', effects: { threadResolve: 'politeones:fade', bond: 5, romantics: 2 } },
          incredible: { text: '“Nice couples fade; real ones argue about dishwashers,” you tell {partner}, quoting no one. They laugh. You both quietly resolve never to be the safe couple. Noted, banked.', effects: { threadResolve: 'politeones:fade', bond: 6, romantics: 2, selfrespect: 2 } },
        },
      },
    },
  },

  // ---------- THE PODCAST — Jamal, narrating his own heart ----------
  {
    id: 'li_web_podcast_0', act: 2, tags: ['web:podcast', 'encounter', 'chat'],
    requires: { threadStageIs: 'podcast:0' },
    art: 'li_daybed',
    context: 'The daybed · Jamal is recording an episode in his head',
    prompt: '“So the way I see it,” Jamal says, to you, in his podcast voice, “this villa’s a case study in modern connection, and I’m — call it — the neutral observer.” He is not neutral. He fancies Priya so hard he narrates it. “Anyway. Big questions this week. No feelings, just analysis.”',
    recap: 'Jamal narrates his own crush like it’s a podcast segment.',
    choices: {
      left: {
        label: '“Drop the mic and just tell her”',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 0.6, charisma: 0.4 },
        outcomes: {
          bad: { text: '“It’s not a MIC, it’s a lens,” Jamal says, wounded, and does a whole segment on why he’s above having a crush. The segment is about having a crush. You let him finish.', effects: { threadBeat: 'podcast', addFlag: 'li_web_podcast_in', loyalty: 2, burnout: 2 } },
          good: { text: '“You can’t narrate your way out of fancying someone, mate.” Jamal pauses the imaginary recording. “…Off the record?” “Off the record.” “I really like her.” There it is.', effects: { bond: 4, threadBeat: 'podcast', addFlag: 'li_web_podcast_in', loyalty: 5, romantics: 2 } },
          incredible: { text: '“The bit’s a bunker,” you tell him. “You’re hiding in it.” Jamal goes quiet, then: “If I say it out loud it’s real and then it can go wrong.” “Yeah,” you say. “That’s the deal.”', effects: { bond: 5, threadBeat: 'podcast', addFlag: 'li_web_podcast_in', loyalty: 8, romantics: 3 } },
        },
      },
      right: {
        label: 'Play a guest on his podcast',
        tags: ['banter', 'strategy'],
        governingStats: { charisma: 0.7, savvy: 0.3 },
        outcomes: {
          bad: { text: 'You do a segment WITH him and it runs so long you both miss lunch. Content: made. Feelings: still buried, now with an intro and outro. You’ve enabled him.', effects: { threadBeat: 'podcast', charisma: 2, burnout: 2 } },
          good: { text: '“Welcome back to the pod,” you deadpan, and interview him about “a hypothetical listener” who fancies someone. He answers as the listener. Confession by format. Sneaky.', effects: { threadBeat: 'podcast', charisma: 5, followers: 2 } },
          incredible: { text: 'You conduct the interview so skilfully Jamal confesses everything believing it’s “analysis.” “Great guest,” he says, of himself. You’ve therapised a man who thinks he’s hosting.', effects: { threadBeat: 'podcast', charisma: 8, followers: 4, savvy: 2 } },
        },
      },
    },
  },
  {
    id: 'li_web_podcast_1', act: 2, tags: ['web:podcast', 'encounter', 'gossip'],
    requires: { threadStageIs: 'podcast:0' },
    art: 'li_kitchen',
    context: 'The kitchen · the episode has a live studio audience now',
    prompt: '{mate} pulls you aside. “Jamal’s doing the ‘neutral observer’ bit TO Priya now. To her face. He just called their chat ‘a fascinating dynamic.’ She said ‘are you alright?’ He’s one metaphor away from blowing it live on air.”',
    recap: 'Jamal starts doing his neutral-observer bit directly at Priya.',
    choices: {
      left: {
        label: 'Coach him before he airs it',
        tags: ['code', 'loyal'],
        governingStats: { loyalty: 0.6, savvy: 0.4 },
        outcomes: {
          bad: { text: '“Just say a normal sentence,” you beg. Jamal nods, approaches Priya, and opens with “statistically, we make sense.” Statistically, you tried. Statistically, he’s doomed.', effects: { threadBeat: 'podcast', addFlag: 'li_web_podcast_in', loyalty: 2, burnout: 2 } },
          good: { text: '“Ditch ‘dynamic.’ Try ‘I like talking to you.’” Jamal repeats it like a foreign phrase. “I like talking to you.” “Now say it to HER.” He’s writing it on his hand. Progress.', effects: { bond: 4, threadBeat: 'podcast', addFlag: 'li_web_podcast_in', loyalty: 5, romantics: 2 } },
          incredible: { text: '“She doesn’t want the host,” you tell him. “She wants the guy who forgets the mic exists.” Jamal actually hears it. He goes to find Priya without a single segment planned. Terrifying. Correct.', effects: { bond: 5, threadBeat: 'podcast', addFlag: 'li_web_podcast_in', loyalty: 8, romantics: 3 } },
        },
      },
      right: {
        label: 'Let the bit run its course',
        tags: ['rest', 'banter'],
        governingStats: { savvy: 0.6, charisma: 0.4 },
        outcomes: {
          bad: { text: 'You decide it’s must-watch telly and settle in — then feel a bit grubby when Priya looks genuinely confused. Ratings aren’t everything. You mute your own commentary.', effects: { threadBeat: 'podcast', savvy: 2, burnout: 2 } },
          good: { text: 'Some men have to hear their own bit out loud to notice it’s daft. You let Jamal narrate himself into a corner and trust he’ll find the door.', effects: { threadBeat: 'podcast', savvy: 5, drama: 1 } },
          incredible: { text: 'You say nothing and simply stop laughing at the segments. The silence does what advice couldn’t — Jamal hears himself, winces, and quietly retires the neutral observer.', effects: { threadBeat: 'podcast', savvy: 8, graft: 2 } },
        },
      },
    },
  },
  {
    id: 'li_web_podcast_real', act: 2, tags: ['web:podcast', 'chat'],
    requires: { threadStageIs: 'podcast:1', flagsAll: ['li_web_podcast_in'] },
    art: 'li_firepit',
    context: 'The firepit · Jamal, off the record, out loud',
    prompt: '“No bit,” Jamal says, and puts down the imaginary mic for good. “Priya. I’ve been narrating this because narrating it felt safer than being in it. I’m not the neutral observer. I really like you. That’s the whole episode.” The villa has never heard him say a sentence without a callback.',
    recap: 'Jamal drops the bit and tells Priya the plain truth.',
    choices: {
      left: {
        label: 'Let the plain sentence land',
        tags: ['loyal', 'rest'],
        governingStats: { loyalty: 0.7, charisma: 0.3 },
        outcomes: {
          bad: { text: 'You’re so ready to cheer that you cheer over Priya’s answer, and everyone has to ask her to repeat it. She does. It’s a yes. You nearly narrated over a yes.', effects: { threadResolve: 'podcast:real', romantics: 2, burnout: 2, followers: 2 } },
          good: { text: 'You keep quiet and let a nervous man land a true sentence. Priya smiles: “Finally. The pod was killing me.” Jamal laughs — no callback, just relief.', effects: { bond: 4, threadResolve: 'podcast:real', romantics: 3, selfrespect: 2 } },
          incredible: { text: 'Nobody speaks. Jamal, for once, doesn’t fill the silence with content. Priya takes his hand. The man who narrates everything gets a moment too real to describe. He lets it be.', effects: { bond: 5, threadResolve: 'podcast:real', romantics: 4, public: 2 } },
        },
      },
      right: {
        label: 'Save him if it flops',
        tags: ['loyal', 'banter'],
        governingStats: { charisma: 0.6, loyalty: 0.4 },
        outcomes: {
          bad: { text: 'You leap in with a rescue joke before Priya’s even answered. She WAS going to say yes. Now she’s laughing at your joke instead. Timing, mate. Read the room, not the mic.', effects: { threadResolve: 'podcast:real', romantics: 1, drama: 2, burnout: 2 } },
          good: { text: 'You’re braced to soften a rejection that never comes. Priya says yes; you stand down. “I had a whole bit ready,” you tell Jamal later. “Keep it,” he says. “For the wedding.”', effects: { threadResolve: 'podcast:real', romantics: 2, charisma: 3, bond: 3 } },
          incredible: { text: 'You’re ready to catch him — and don’t need to. So you just start the applause at exactly the right second. A man dropped his armour and the landing was soft. You made sure of it.', effects: { threadResolve: 'podcast:real', romantics: 3, charisma: 4, followers: 3 } },
        },
      },
    },
  },
  {
    id: 'li_web_podcast_brand', act: 2, tags: ['web:podcast', 'banter'],
    requires: { threadStageIs: 'podcast:1', flagsNone: ['li_web_podcast_in'] },
    art: 'li_daybed',
    context: 'The daybed · the bit becomes the brand',
    prompt: 'Jamal never drops it. Instead he leans all the way in: “The Villa Pod, with your host, me.” He now interviews couples on the daybed, seriously, with a rolled-up towel for a mic. He never tells Priya. But the segments are, annoyingly, must-watch. The crush becomes content. The content becomes a career plan.',
    recap: 'Jamal turns the whole crush into a daybed podcast bit instead of confessing.',
    choices: {
      left: {
        label: 'Go on the pod, gently roast him',
        tags: ['banter', 'camera'],
        governingStats: { charisma: 0.7, savvy: 0.3 },
        outcomes: {
          bad: { text: 'You ask “any guests you fancy?” live on the towel-mic. Jamal freezes, recovers, says “no comment,” and it’s the realest thing the pod’s ever aired. Priya’s watching. Awkward. Great telly.', effects: { threadResolve: 'podcast:brand', drama: 3, charisma: 3, burnout: 2 } },
          good: { text: '“Ever think of telling a guest how you feel?” you ask. “That’s not the format,” Jamal deflects, smooth as radio. The bit survives; the feelings don’t make the edit. His call.', effects: { threadResolve: 'podcast:brand', charisma: 5, followers: 3, drama: 2 } },
          incredible: { text: 'You go full guest — “tell the listeners about your type” — and Jamal answers in perfect podcast neutral while describing Priya exactly. Everyone clocks it but him. Career: launched. Crush: archived.', effects: { threadResolve: 'podcast:brand', charisma: 8, followers: 5, drama: 3 } },
        },
      },
      right: {
        label: 'Respect the hustle, keep the counsel',
        tags: ['strategy', 'rest'],
        governingStats: { savvy: 1 },
        outcomes: {
          bad: { text: 'You watch a man build a media empire to avoid one conversation and say nothing — until your face says everything, on camera, in the background of his intro. Sorry, Jamal.', effects: { threadResolve: 'podcast:brand', savvy: 2, drama: 2, burnout: 2 } },
          good: { text: 'Some people would genuinely rather have a podcast than a partner, and honestly? Fair. You let Jamal host his way through it and quietly wish him a good launch.', effects: { threadResolve: 'podcast:brand', savvy: 5, graft: 2 } },
          incredible: { text: 'You clock the whole play — the bit is the armour AND the exit strategy — and let him have it, untouched. He’ll thank the villa in episode one. You’ll be a footnote. Fine by you.', effects: { threadResolve: 'podcast:brand', savvy: 8, graft: 3 } },
        },
      },
    },
  },

  // ---------- THE OLD FLAME — Ollie & Zara ----------
  {
    id: 'li_web_oldflame_0', act: [2, 3], tags: ['web:oldflame', 'encounter', 'drama'],
    requires: { threadStageIs: 'oldflame:0' },
    art: 'li_terrace',
    context: 'The terrace · two bombshells, one suspiciously shared history',
    prompt: 'Ollie and Zara have been introducing themselves to each other with the elaborate politeness of people who’ve absolutely met. “So nice to MEET you,” Zara says, for the third time. Later, alone with you: “We dated. Two years. Nobody knows. He asked me not to say.” The terrace suddenly has a plot.',
    recap: 'Zara confides that she and bombshell Ollie secretly dated for two years.',
    choices: {
      left: {
        label: 'Tell her to get ahead of it',
        tags: ['code', 'strategy'],
        governingStats: { savvy: 0.6, loyalty: 0.4 },
        outcomes: {
          bad: { text: '“Say it first,” you urge. Zara panics and says it to the wrong person — the villa’s loudest — and the secret goes public before she’s ready. You aimed right; she fired early.', effects: { threadBeat: 'oldflame', addFlag: 'li_web_oldflame_in', savvy: 2, drama: 2, burnout: 2 } },
          good: { text: '“Secrets in here rot,” you tell her. “Own it before Movie Night owns it for you.” Zara nods, already drafting the sentence. “You’re right. God. I hate that you’re right.”', effects: { bond: 4, threadBeat: 'oldflame', addFlag: 'li_web_oldflame_in', savvy: 5, selfrespect: 2 } },
          incredible: { text: '“Two years isn’t a secret, it’s a season finale waiting for a slot,” you say. “Pick your moment or the edit picks it for you.” Zara exhales. “Okay. Okay. I’ll tell him I’m telling.” The good kind of scary.', effects: { bond: 5, threadBeat: 'oldflame', addFlag: 'li_web_oldflame_in', savvy: 8, selfrespect: 3 } },
        },
      },
      right: {
        label: 'Guard the secret with her',
        tags: ['loyal', 'rest'],
        governingStats: { loyalty: 0.7, savvy: 0.3 },
        outcomes: {
          bad: { text: 'You swear to keep it and immediately develop the guiltiest face in the villa. “What do YOU know,” asks {mate}, delighted. Nothing. You know nothing. Your eyes disagree, loudly.', effects: { threadBeat: 'oldflame', loyalty: 2, burnout: 2 } },
          good: { text: '“Your story, your timing,” you tell her. Zara relaxes an inch. Holding someone else’s two-year secret is heavy — but she trusts you with it now, and trust is villa gold.', effects: { threadBeat: 'oldflame', loyalty: 5, graft: 3 } },
          incredible: { text: 'You keep it so completely that even when Ollie fishes — “you and Zara close?” — you give him weather and small talk. Zara watches you hold the line. An alliance, minted in silence.', effects: { threadBeat: 'oldflame', loyalty: 8, graft: 4, savvy: 2 } },
        },
      },
    },
  },
  {
    id: 'li_web_oldflame_1', act: [2, 3], tags: ['web:oldflame', 'encounter', 'chat'],
    requires: { threadStageIs: 'oldflame:0' },
    art: 'li_hideaway',
    context: 'The Hideaway steps · Ollie, off guard, honest',
    prompt: 'You find Ollie on the Hideaway steps looking like a man doing long division. “Can I be straight with you? Zara and me — we’ve got history. Big history. And I told myself I was over it right up until she walked through that door in slow motion. Now my head’s all over the shop.”',
    recap: 'Ollie admits to you that seeing his ex Zara has turned his head completely.',
    choices: {
      left: {
        label: '“Then don’t bury it”',
        tags: ['code', 'loyal'],
        governingStats: { loyalty: 0.6, savvy: 0.4 },
        outcomes: {
          bad: { text: '“Talk to her,” you say. Ollie takes this as “talk to her RIGHT NOW” and marches off mid-conversation to do it badly, loudly, near a microphone. You meant later. He heard now.', effects: { threadBeat: 'oldflame', addFlag: 'li_web_oldflame_in', loyalty: 2, burnout: 2 } },
          good: { text: '“A turned head’s not a crime, mate. Pretending it isn’t turned — that’s the crime.” Ollie nods, rugby-slow. “So I just… say it.” “You just say it.” He looks terrified and relieved.', effects: { bond: 4, threadBeat: 'oldflame', addFlag: 'li_web_oldflame_in', loyalty: 5, romantics: 2 } },
          incredible: { text: '“You knew her when you were nobody,” you say. “That’s not history, that’s the good stuff.” Ollie stares at his hands. “Yeah.” He’s going to go find her. You can see the decision land.', effects: { bond: 5, threadBeat: 'oldflame', addFlag: 'li_web_oldflame_in', loyalty: 8, romantics: 3 } },
        },
      },
      right: {
        label: '“Or leave it in the past”',
        tags: ['strategy', 'chat'],
        governingStats: { savvy: 0.7, loyalty: 0.3 },
        outcomes: {
          bad: { text: '“Leave it,” you advise, and Ollie tries to, visibly, at every meal, from across the garden, with his whole face. Repression, it turns out, is not his position.', effects: { threadBeat: 'oldflame', savvy: 2, burnout: 2 } },
          good: { text: '“Old flames feel like fate ’cause they’re familiar,” you warn. “Familiar isn’t the same as right.” Ollie considers it. “So I test it before I torch anything.” Sensible. Rare.', effects: { threadBeat: 'oldflame', savvy: 5, drama: 1 } },
          incredible: { text: '“Don’t set fire to your present for a rerun,” you tell him. Ollie sits with it. “When did you get wise?” Around the third time the villa taught me the hard way. You keep that bit to yourself.', effects: { threadBeat: 'oldflame', savvy: 8, graft: 2 } },
        },
      },
    },
  },
  {
    id: 'li_web_oldflame_rekindle', act: [2, 3], tags: ['web:oldflame', 'drama'],
    requires: { threadStageIs: 'oldflame:1', flagsAll: ['li_web_oldflame_in'] },
    art: 'li_firepit',
    context: 'The firepit · the history comes out, loud',
    prompt: '“Right, everyone should hear this from us.” Ollie and Zara stand together. “We were together. Before. Two years.” The villa detonates in slow motion. “And,” Zara adds, taking his hand, “we’re gonna see where it goes. Again.” Somewhere a producer is being carried out on their colleagues’ shoulders.',
    recap: 'Ollie and Zara go public — and decide to try again.',
    choices: {
      left: {
        label: 'Back the reunion, publicly',
        tags: ['loyal', 'camera'],
        governingStats: { loyalty: 0.5, charisma: 0.5 },
        outcomes: {
          bad: { text: 'You cheer the reunion and half the villa glares — turns out two people were quietly grafting on Ollie and Zara respectively. You’ve backed a couple and made two enemies. Efficient.', effects: { threadResolve: 'oldflame:rekindle', drama: 3, burnout: 2, followers: 2 } },
          good: { text: '“Second chances that cross a whole city to find you? Rare.” You raise a glass. Ollie mouths “cheers” — he remembers who told him not to bury it. The nation loves a reunion.', effects: { bond: 4, threadResolve: 'oldflame:rekindle', romantics: 2, drama: 3, public: 2 } },
          incredible: { text: '“Two years, two villas, one slow-motion door,” you toast. “If that’s not a story, nothing is.” The garden roars. Zara points at you: “This one made me say it.” Credited in someone’s finest hour again.', effects: { bond: 5, threadResolve: 'oldflame:rekindle', romantics: 3, drama: 4, followers: 5 } },
        },
      },
      right: {
        label: 'Watch the fallout ripple',
        tags: ['strategy', 'camera'],
        governingStats: { savvy: 1 },
        outcomes: {
          bad: { text: 'You track the fallout so intently you narrate it aloud and the boom mic broadcasts your odds on the whole thing collapsing by Friday. Both halves of the couple heard “collapsing.”', effects: { threadResolve: 'oldflame:rekindle', drama: 3, burnout: 2 } },
          good: { text: 'You clock every recalibrating face around the firepit — the grafters, the mates, the sudden singles. A whole villa just reshuffled. You file the new map before anyone else finishes gasping.', effects: { threadResolve: 'oldflame:rekindle', savvy: 5, drama: 2, graft: 2 } },
          incredible: { text: 'You watch it all land and read the room three moves out: who’s free now, who’s furious, who benefits. By the time the gasps fade, you’re the only person holding the updated villa.', effects: { threadResolve: 'oldflame:rekindle', savvy: 8, drama: 2, graft: 3 } },
        },
      },
    },
  },
  {
    id: 'li_web_oldflame_closure', act: [2, 3], tags: ['web:oldflame', 'chat'],
    requires: { threadStageIs: 'oldflame:1', flagsNone: ['li_web_oldflame_in'] },
    art: 'li_beach',
    context: 'The beach · the old flame, put out kindly',
    prompt: 'They talk it out where the mics are weakest, and come back different. “We loved each other,” Zara tells the villa, calm. “And we’re not that anymore. It’s nice to actually know that now.” Ollie nods. No reunion, no row — just two people who finally closed a door they’d left ajar for two years.',
    recap: 'Ollie and Zara choose closure over a reunion, and mean it.',
    choices: {
      left: {
        label: 'Tell Zara that took guts',
        tags: ['chat', 'code'],
        governingStats: { charisma: 0.5, loyalty: 0.5 },
        outcomes: {
          bad: { text: '“So brave,” you say, a touch too reverent, and Zara snorts. “It’s a breakup, not a bloody triathlon.” It was a bit of a triathlon, actually. Two years’ worth. But point taken.', effects: { threadResolve: 'oldflame:closure', selfrespect: 3, burnout: 1 } },
          good: { text: '“Most people never close the door,” you tell her. “They just move house.” Zara laughs. “God, that’s me usually.” Not this time. The spine wing has a new favourite.', effects: { bond: 4, threadResolve: 'oldflame:closure', selfrespect: 4, romantics: 1 } },
          incredible: { text: 'You say nothing and just bump her shoulder with yours, watching the sea. “Thanks for making me say it out loud,” Zara says. “It stopped being a ghost.” Some hauntings only need a witness.', effects: { bond: 5, threadResolve: 'oldflame:closure', selfrespect: 5, graft: 2 } },
        },
      },
      right: {
        label: 'Take the lesson to {partner}',
        tags: ['date', 'loyal'],
        governingStats: { loyalty: 0.7, rizz: 0.3 },
        outcomes: {
          bad: { text: 'You bring up “doors left ajar” with {partner}, who immediately asks which door of yours is ajar. None. NONE. You’ve invented a draught out of a nice moment. Reassure, quickly.', effects: { threadResolve: 'oldflame:closure', bond: -2, burnout: 2 } },
          good: { text: 'Watching two people end it cleanly makes you grateful yours isn’t haunted. You find {partner} and say, plainly, “no ghosts here.” They didn’t know they needed to hear it. They did.', effects: { threadResolve: 'oldflame:closure', bond: 5, romantics: 2 } },
          incredible: { text: '“If we ever end,” you tell {partner}, “let’s do it like that — on a beach, no ghosts.” “We’re not ending.” “I know. That’s why I can say it.” The securest thing said as a hypothetical.', effects: { threadResolve: 'oldflame:closure', bond: 6, romantics: 3, selfrespect: 2 } },
        },
      },
    },
  },

  // ---------- THE WRECKING BALL — Bella ----------
  {
    id: 'li_web_wrecking_0', act: [2, 3], tags: ['web:wrecking', 'encounter', 'drama'],
    requires: { threadStageIs: 'wrecking:0' },
    art: 'li_lawn',
    context: 'The lawn · Bella has decided which couple she’s ending',
    prompt: 'Bella arrived mid-sentence and hasn’t stopped. She’s picked her target — a settled couple two weeks deep — and she’s not subtle. “I go after what I want,” she tells you, reapplying lipstick like war paint. “He’s not married. There’s no ring. There’s barely a text.” She’s coming for someone’s whole villa.',
    recap: 'Bombshell Bella sets her sights on ending a settled couple, and tells you so.',
    choices: {
      left: {
        label: 'Warn the settled couple',
        tags: ['code', 'loyal'],
        governingStats: { loyalty: 0.6, savvy: 0.4 },
        outcomes: {
          bad: { text: 'You tip them off and it comes out that you did, and now you’re “the one stirring,” while Bella floats above it, innocent as a hurricane. You did a good thing, badly, on camera.', effects: { threadBeat: 'wrecking', addFlag: 'li_web_wrecking_in', loyalty: 2, drama: 2, burnout: 2 } },
          good: { text: '“Heads up — Bella’s got a plan, and it’s you.” The couple close ranks, forewarned. Bella clocks the sudden solidarity and narrows her eyes at you. You’ve made an enemy and a friend.', effects: { bond: 4, threadBeat: 'wrecking', addFlag: 'li_web_wrecking_in', loyalty: 5, selfrespect: 2 } },
          incredible: { text: '“All I’ll say is: talk to each other tonight.” You leave it there. They do — all night, honestly, their idea — and by morning Bella’s wrecking ball meets a wall it can’t swing through. Their wall. You just pointed at it.', effects: { bond: 5, threadBeat: 'wrecking', addFlag: 'li_web_wrecking_in', loyalty: 8, selfrespect: 3 } },
        },
      },
      right: {
        label: 'Stay well clear of the swing',
        tags: ['rest', 'strategy'],
        governingStats: { savvy: 0.7, loyalty: 0.3 },
        outcomes: {
          bad: { text: 'You step back from the demolition zone and straight into range — Bella decides YOUR reaction is the interesting one and starts working you for intel. You wanted no part; you’re now a part.', effects: { threadBeat: 'wrecking', savvy: 2, drama: 2, burnout: 2 } },
          good: { text: 'Not your couple, not your crane. You get a safe distance and let the villa’s newest natural disaster do whatever weather it’s going to do.', effects: { burnout: -4, threadBeat: 'wrecking', savvy: 5 } },
          incredible: { text: 'You watch Bella work and simply refuse to be content for it — no reaction, no intel, no fuel. Starved of oxygen, the drama has to look elsewhere. You’re the one wall she skips.', effects: { burnout: -6, threadBeat: 'wrecking', savvy: 8, graft: 2 } },
        },
      },
    },
  },
  {
    id: 'li_web_wrecking_1', act: [2, 3], tags: ['web:wrecking', 'encounter', 'gossip'],
    requires: { threadStageIs: 'wrecking:0' },
    art: 'li_kitchen',
    context: 'The kitchen · Bella recruits you, mid-scheme',
    prompt: '“You’re smart, I like smart,” Bella says, cornering you by the kettle. “So help me out. Who’s actually solid and who’s just doing bits for the cameras? I only want the real ones. Everyone else is scenery.” She smiles. It’s a genuinely great smile. It’s also a job interview for a villain’s sidekick.',
    recap: 'Bella tries to recruit you as her intel source on who’s really solid.',
    choices: {
      left: {
        label: 'Feed her nothing true',
        tags: ['strategy', 'code'],
        governingStats: { savvy: 0.6, loyalty: 0.4 },
        outcomes: {
          bad: { text: 'You feed her duff intel and she tests it within the hour, finds it hollow, and now knows exactly one thing: you can’t be trusted. Which, fair. But now it’s her project.', effects: { threadBeat: 'wrecking', savvy: 2, drama: 2, burnout: 2 } },
          good: { text: '“Everyone in here’s real and everyone’s scenery. That’s the show.” You give her a philosophy instead of a name. Bella squints. “Annoying. Respect.” She leaves with nothing. So do you. Even trade.', effects: { threadBeat: 'wrecking', savvy: 5, selfrespect: 2 } },
          incredible: { text: 'You send her, sweetly, at the two most bulletproof couples in the villa — “them, definitely them” — knowing she’ll bounce off both. Misdirection as a public service. She never suspects the guide.', effects: { threadBeat: 'wrecking', savvy: 8, drama: 2, graft: 2 } },
        },
      },
      right: {
        label: 'Play along to keep tabs',
        tags: ['strategy', 'drama'],
        governingStats: { savvy: 0.7, charisma: 0.3 },
        outcomes: {
          bad: { text: 'You cosy up to keep tabs and the villa clocks you two whispering by the kettle. Now you’re “Bella’s ally,” a title with terrible PR and no salary. Undercover, blown, on day one.', effects: { threadBeat: 'wrecking', addFlag: 'li_web_wrecking_in', drama: 3, burnout: 2 } },
          good: { text: 'You get close enough to see the plan without joining it. Bella tells you the target, the timeline, the exit. You now know the whole wreck before it happens. Knowledge, banked, quietly.', effects: { threadBeat: 'wrecking', addFlag: 'li_web_wrecking_in', savvy: 5, graft: 2 } },
          incredible: { text: 'You become Bella’s confidante and her early-warning system for the couple she’s targeting, simultaneously, undetected. A double agent in factor-50. The villa will owe you and never know it.', effects: { threadBeat: 'wrecking', addFlag: 'li_web_wrecking_in', savvy: 8, graft: 3, drama: 2 } },
        },
      },
    },
  },
  {
    id: 'li_web_wrecking_chaos', act: [2, 3], tags: ['web:wrecking', 'drama'],
    requires: { threadStageIs: 'wrecking:1', flagsAll: ['li_web_wrecking_in'] },
    art: 'li_firepit',
    context: 'The firepit · the wrecking ball connects',
    prompt: 'Bella swings and it lands: the settled boy’s head is, on live television, turned. His partner finds out at the firepit, in front of everyone, which is the villa’s cruellest floor plan. “I didn’t DO anything,” he tries. “You didn’t stop it either,” she says, and the whole garden feels that one land.',
    recap: 'Bella’s move connects — a settled couple blows up at the firepit.',
    choices: {
      left: {
        label: 'Support the blindsided partner',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 0.7, savvy: 0.3 },
        outcomes: {
          bad: { text: 'You rush to comfort her and knock the whole thing louder — now it’s a scene with an audience and a supporting cast, and she wanted a quiet corner. Good instinct, wrong volume.', effects: { threadResolve: 'wrecking:chaos', drama: 3, loyalty: 2, burnout: 2 } },
          good: { text: 'You get her out of the firepit’s spotlight and into the kitchen with a cup of tea and no advice. “You don’t have to perform this,” you say. She cries where the wide shot can’t reach. Small mercy.', effects: { bond: 4, threadResolve: 'wrecking:chaos', loyalty: 5, drama: 2, selfrespect: 2 } },
          incredible: { text: '“Whatever he does next, you already know who you are,” you tell her. “She only found a crack that was there.” Hard, true, kind. She squares up and handles it standing. The nation stands with her.', effects: { bond: 5, threadResolve: 'wrecking:chaos', loyalty: 8, drama: 2, public: 2 } },
        },
      },
      right: {
        label: 'Call Bella’s game to her face',
        tags: ['drama', 'code'],
        governingStats: { savvy: 0.5, loyalty: 0.5 },
        outcomes: {
          bad: { text: '“That was a hit job,” you tell Bella, loudly, and she smiles because loud is her native tongue. “Jealous?” she lobs, and the crowd oohs, and now it’s you two, which is exactly her win condition.', effects: { threadResolve: 'wrecking:chaos', drama: 4, burnout: 3, rivalOpinion: -2 } },
          good: { text: '“Own the swing, at least,” you tell her, quiet enough that only she hears. Bella’s smile flickers. “I don’t do guilt.” “I know. That’s the sad bit.” You leave her holding the silence.', effects: { threadResolve: 'wrecking:chaos', savvy: 5, selfrespect: 3, drama: 2 } },
          incredible: { text: '“You didn’t break them,” you tell her, level. “You just arrived on the day they were already cracking. That’s not power, babe. That’s timing.” Bella has no bit for the truth. First time all week she’s quiet.', effects: { threadResolve: 'wrecking:chaos', savvy: 8, selfrespect: 4, drama: 3 } },
        },
      },
    },
  },
  {
    id: 'li_web_wrecking_fizzle', act: [2, 3], tags: ['web:wrecking', 'chat'],
    requires: { threadStageIs: 'wrecking:1', flagsNone: ['li_web_wrecking_in'] },
    art: 'li_lawn',
    context: 'The lawn · the wrecking ball meets a wall',
    prompt: 'Bella swings — and nothing moves. The couple she targeted just… talk to each other, boringly, honestly, in front of her, and her whole plan slides off them like rain off factor-50. “Fine,” she announces, to no one, “they’re GENUINELY happy, it’s disgusting.” She wanders off to redecorate a different couple.',
    recap: 'Bella’s target couple proves solid, and her wrecking ball bounces off.',
    choices: {
      left: {
        label: 'Salute the couple that held',
        tags: ['loyal', 'banter'],
        governingStats: { charisma: 0.6, loyalty: 0.4 },
        outcomes: {
          bad: { text: 'You congratulate them so loudly Bella hears and takes it as a challenge. You’ve pointed the hurricane at the one house that survived. Well done. Genuinely, well done, you plum.', effects: { threadResolve: 'wrecking:fizzle', romantics: 2, drama: 2, burnout: 2 } },
          good: { text: '“You just out-boring-ed a wrecking ball on live telly,” you tell them. They shrug, still holding hands, still admin-brained, still standing. The nation adores a wall it can’t knock down.', effects: { bond: 4, threadResolve: 'wrecking:fizzle', romantics: 3, public: 2 } },
          incredible: { text: '“Bella brought a wrecking ball to a couple made of admin,” you announce, delighted. “Never stood a chance.” The lawn laughs. The solid couple gets a standing ovation for the crime of being fine.', effects: { bond: 5, threadResolve: 'wrecking:fizzle', romantics: 3, charisma: 4, followers: 4 } },
        },
      },
      right: {
        label: 'Check on Bella, oddly',
        tags: ['chat', 'rest'],
        governingStats: { loyalty: 0.5, savvy: 0.5 },
        outcomes: {
          bad: { text: 'You ask if she’s alright and Bella hears pity, which she cannot abide, and immediately picks a new target out of pure spite. Your kindness has restocked the villain. Oops.', effects: { threadResolve: 'wrecking:fizzle', drama: 2, burnout: 2 } },
          good: { text: '“You alright?” you ask. Bella blinks. “Nobody asks me that.” For one unguarded second she’s just a person who arrives loud because quiet is scarier. Then the lipstick goes back on.', effects: { bond: 3, threadResolve: 'wrecking:fizzle', romantics: 2, selfrespect: 2 } },
          incredible: { text: '“The loud ones are usually the most scared of the quiet,” you say, gently. Bella looks at you like you’ve read a file she thought was sealed. “Don’t,” she says. But she sits down. Progress, of a sort.', effects: { bond: 4, threadResolve: 'wrecking:fizzle', romantics: 3, selfrespect: 2, graft: 2 } },
        },
      },
    },
  },
];
