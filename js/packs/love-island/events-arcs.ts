// Love Island — the player couple's OWN arcs (ADR-0013): the ick (love's
// internal lie-detector — sudden, legible-cause, shape-specific) and
// betrayal-repair (rebuilt with the same currency as love: small visible
// gestures plus a public re-commitment, sustained over days — never one grand
// apology). These are the story gate's authored sources: a survived ick and a
// finished repair are exactly the "questioned it, cracked, came back"
// storylines the nation crowns (Pillar 8). Every trigger is traceable — the
// ick fires on WHO your partner is (their shape), repair fires on footage
// that actually aired. Randomness gates timing here, never cause.

import type { GameEvent } from '../../types.js';

export const ARC_EVENTS: GameEvent[] = [

  // ---------- THE ICK — one trigger per partner shape ----------
  {
    id: 'li_ick_sweet', act: 2, tags: ['ick', 'encounter', 'chat'],
    requires: { singleIs: false, partnerShapeIs: 'sweetheart', flagsNone: ['li_ick_named', 'li_ick_buried'] },
    art: 'li_bedroom',
    context: 'Movie night in · the ick arrives on schedule',
    prompt: '{partner} cried at the toast. Not the speech — the TOAST, the bread kind, because you made it “like a couple who make each other toast.” Day twelve. Somewhere behind your ribs, a tiny inspector puts down a clipboard and says: too much, too fast, all of it.',
    recap: '{partner} cried over the toast you made, and the ick clocks in.',
    choices: {
      left: {
        label: 'Name it, kindly',
        tags: ['chat', 'loyal'],
        governingStats: { loyalty: 0.6, savvy: 0.4 },
        outcomes: {
          bad: { text: '“It’s not the toast, it’s—” you start, and {partner}’s face does the wobble, and now you’re consoling them about a feeling you were reporting. The inspector sighs.', effects: { addFlag: 'li_ick_named', chainEventId: 'li_ick_talk', bond: -3, burnout: 3 } },
          good: { text: '“I need you to be this keen at about seventy percent volume,” you say. {partner} blinks. Then, slowly: “I can do seventy.” Honest engineering. The ick loosens its grip.', effects: { addFlag: 'li_ick_named', chainEventId: 'li_ick_talk', bond: -2, selfrespect: 2 } },
          incredible: { text: 'You say the unsayable — “you’re performing us before we exist” — and {partner} goes quiet, then nods like someone finally allowed to exhale. The realest chat the duvet has hosted.', effects: { addFlag: 'li_ick_named', chainEventId: 'li_ick_talk', bond: -1, selfrespect: 3, romantics: 1 } },
        },
      },
      right: {
        label: 'Swallow it',
        tags: ['rest', 'strategy'],
        governingStats: { savvy: 0.7, loyalty: 0.3 },
        outcomes: {
          bad: { text: 'You smile at the toast. You smile at the toast SPEECH. Your smile is load-bearing now, and the load is gaining weight nightly.', effects: { addFlag: 'li_ick_buried', burnout: 4, savvy: 2 } },
          good: { text: 'You file it under “week-two energy, will settle.” Maybe it will. The inspector leaves a card on the way out: we’ll be in touch.', effects: { burnout: -4, addFlag: 'li_ick_buried', savvy: 5 } },
          incredible: { text: 'You bury it with full honours and a small ceremony. Buried things in this villa have a documented habit of attending Movie Night. Still — gorgeous funeral.', effects: { burnout: -6, addFlag: 'li_ick_buried', savvy: 8, drama: 1 } },
        },
      },
    },
  },
  {
    id: 'li_ick_game', act: 2, tags: ['ick', 'encounter', 'chat'],
    requires: { singleIs: false, partnerShapeIs: 'gameplayer', flagsNone: ['li_ick_named', 'li_ick_buried'] },
    art: 'li_bedroom',
    context: 'The dressing room · a rehearsal you weren’t meant to see',
    prompt: 'Through the mirror you watch {partner} practise a compliment. Your compliment. Twice, with different pauses, checking the angles — “you’re not like anyone in here… no. You’re not like ANYONE in here.” The tiny inspector behind your ribs underlines one word: rehearsed.',
    recap: 'Through the mirror you catch {partner} rehearsing a compliment for you.',
    choices: {
      left: {
        label: 'Name it, straight',
        tags: ['chat', 'strategy'],
        governingStats: { savvy: 0.6, loyalty: 0.4 },
        outcomes: {
          bad: { text: '“Was that a REHEARSAL?” comes out at row volume. {partner} handles it smoothly, which is exactly the problem, which you now say, less smoothly. Loop detected.', effects: { addFlag: 'li_ick_named', chainEventId: 'li_ick_talk', bond: -4, burnout: 3, drama: 1 } },
          good: { text: '“Second take was better,” you say to the mirror. {partner} freezes — then laughs, caught. “Force of habit. Old me.” New you gets one chance at unscripted. Starting now.', effects: { addFlag: 'li_ick_named', chainEventId: 'li_ick_talk', bond: -2, selfrespect: 3 } },
          incredible: { text: '“Say it wrong,” you tell them. “Once. For me.” {partner} looks at you, abandons the script, and says something clumsy and true. Worst delivery all season. Best sentence.', effects: { addFlag: 'li_ick_named', chainEventId: 'li_ick_talk', bond: -1, selfrespect: 3, romantics: 2 } },
        },
      },
      right: {
        label: 'Swallow it',
        tags: ['rest', 'strategy'],
        governingStats: { savvy: 1 },
        outcomes: {
          bad: { text: 'You keep the receipt and hear the pause land on you at dinner, beat-perfect. It works. It absolutely works. That’s the ick, working.', effects: { addFlag: 'li_ick_buried', burnout: 4, savvy: 2 } },
          good: { text: 'Everyone in here performs a bit, you reason. Reasonable. The inspector writes “a bit” in quotation marks and files it where files go.', effects: { burnout: -4, addFlag: 'li_ick_buried', savvy: 5 } },
          incredible: { text: 'You watch the performance nightly now, a critic in your own bed. The reviews stay unpublished. For now, the run continues.', effects: { burnout: -6, addFlag: 'li_ick_buried', savvy: 8, drama: 1 } },
        },
      },
    },
  },
  {
    id: 'li_ick_slow', act: 2, tags: ['ick', 'encounter', 'chat'],
    requires: { singleIs: false, partnerShapeIs: 'slowburner', flagsNone: ['li_ick_named', 'li_ick_buried'] },
    art: 'li_bedroom',
    context: 'The terrace, late · the wall came down · then the scaffolding went up',
    prompt: 'Last night {partner} told you the real stuff — the sister who stopped speaking to them, the fear they’re only lovable on telly, why the guard never fully drops. This morning: “anyway, mad one last night, weren’t it,” and the shutters are DOWN, trading closed, do not reply to this email. The inspector behind your ribs circles a word: whiplash.',
    recap: '{partner} opened up last night, then slammed the shutters by morning.',
    choices: {
      left: {
        label: 'Name it, gently',
        tags: ['chat', 'loyal'],
        governingStats: { loyalty: 0.7, savvy: 0.3 },
        outcomes: {
          bad: { text: '“You can’t give me that and then go CUSTOMER SERVICE,” you say, too fast. The shutters add a padlock. Great. Now there’s a padlock.', effects: { addFlag: 'li_ick_named', chainEventId: 'li_ick_talk', bond: -4, burnout: 3 } },
          good: { text: '“Last night counted,” you say quietly. “You don’t have to un-say it by lunch.” A long pause. “…Noted,” says {partner}, which from them is a sonnet.', effects: { addFlag: 'li_ick_named', chainEventId: 'li_ick_talk', bond: -2, selfrespect: 2, romantics: 1 } },
          incredible: { text: '“I’ll wait,” you say, “but I won’t pretend I didn’t meet you.” The shutters open one slat. It’s not nothing. In slow-burner currency, it’s a bouquet.', effects: { addFlag: 'li_ick_named', chainEventId: 'li_ick_talk', bond: -1, selfrespect: 3, romantics: 2 } },
        },
      },
      right: {
        label: 'Swallow it',
        tags: ['rest', 'strategy'],
        governingStats: { savvy: 0.6, loyalty: 0.4 },
        outcomes: {
          bad: { text: 'You match the breeziness, badly. Two people now performing “fine” at each other across a fruit bowl. The fruit bowl is the only honest party present.', effects: { addFlag: 'li_ick_buried', burnout: 4, savvy: 2 } },
          good: { text: 'Guarded people un-guard on their own clock, you decide. Patient. Mature. The inspector notes the maturity and, next to it, the cost per night.', effects: { burnout: -4, addFlag: 'li_ick_buried', savvy: 5 } },
          incredible: { text: 'You bank last night like a photograph and ask for nothing. Either it was real and returns, or it wasn’t and won’t. The villa respects a clean experiment.', effects: { burnout: -6, addFlag: 'li_ick_buried', savvy: 8 } },
        },
      },
    },
  },
  {
    id: 'li_ick_talk', act: [1, 2, 3], chainOnly: true, tags: ['ick', 'encounter', 'chat'],
    art: 'li_daybed',
    context: 'The next afternoon · the follow-up nobody schedules',
    prompt: '“So.” {partner} sits down with two drinks and the face of someone who’s been thinking since yesterday. “That thing you said — that I was giving you the ick. I’m not gonna lie, I hated it. And you’re 100% right.” Both can be true. In here, both usually are. The daybed waits to see what you build with it.',
    recap: '{partner} sits down with two drinks to say you were right about the ick.',
    choices: {
      left: {
        label: 'Build it together',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 0.8, charisma: 0.2 },
        outcomes: {
          bad: { text: 'You both over-correct into a formal relationship summit with agenda items. Item one: why are we like this. No minutes are kept. Some progress is, barely.', effects: { bond: 2, burnout: 2, romantics: 1 } },
          good: { text: 'Twenty honest minutes, no cameras played to, one actual agreement. The ick, examined in daylight, turns out to be a fixable part. You fix it.', effects: { bond: 5, romantics: 2, storyBeat: 'You caught the ick, said it out loud, and the couple survived the saying.' } },
          incredible: { text: '“Nobody’s ever told me the true thing that early,” {partner} says, “and stayed.” You stayed. The nation watches a couple get REALER mid-season — rarer than a proposal.', effects: { bond: 7, romantics: 3, selfrespect: 2, storyBeat: 'The ick arrived, got named, and lost. Realness, on camera, by choice.' } },
        },
      },
      right: {
        label: 'Keep it light, keep it moving',
        tags: ['banter', 'rest'],
        governingStats: { charisma: 0.6, savvy: 0.4 },
        outcomes: {
          bad: { text: 'You deflect with a bit. {partner} watches the bit the way Tash watches everyone — fully. “Okay,” they say, and the okay has a basement.', effects: { bond: -2, burnout: 3 } },
          good: { text: '“We’re fine,” you grin, and mean it about 80%. {partner} takes the 80. Couples have run further on less. The remaining 20 waits politely.', effects: { burnout: -4, followers: 2, bond: 4, charisma: 5 } },
          incredible: { text: 'You turn the whole ick into a running joke — “SEVENTY percent,” you both say now, in unison, at each other. A wound converted into a catchphrase. Villa alchemy.', effects: { burnout: -6, bond: 6, charisma: 8, followers: 4 } },
        },
      },
    },
  },
  {
    id: 'li_ick_resurface', act: [2, 3], tags: ['ick', 'encounter', 'drama'],
    requires: { singleIs: false, flagsAll: ['li_ick_buried'], flagsNone: ['li_ick_named'] },
    art: 'li_bedroom',
    context: 'Weeks later · the buried thing attends dinner',
    prompt: 'The thing you buried has compounded. The toast-tears, the rehearsed pause, the shutters — whichever it was, it’s now a full personality trait wearing your patience as a lanyard. Tonight it does the thing AGAIN, at dinner. “What?” asks {partner}, catching your face. “Nothing,” you say. The word creaks under the tonnage.',
    recap: 'The ick you buried resurfaces at dinner, bigger than before.',
    choices: {
      left: {
        label: 'Say it. Finally',
        tags: ['chat', 'drama'],
        governingStats: { loyalty: 0.5, savvy: 0.5 },
        outcomes: {
          bad: { text: 'It comes out with six weeks of interest attached. “Since WHEN?” asks {partner}, and “week two” is the wrong answer said at the wrong volume. The table studies its plates.', effects: { addFlag: 'li_ick_named', bond: -7, burnout: 3, drama: 2 } },
          good: { text: 'You say it late and plainly, and own the lateness. “You sat on this to be NICE?” {partner} is furious at the kindness, which is fair, and moved by it, which is inconvenient.', effects: { addFlag: 'li_ick_named', bond: -4, selfrespect: 3, storyBeat: 'Buried it, carried it, finally said it — the hard version of honest.' } },
          incredible: { text: '“I should have said it in week two,” you finish, “I liked you too much to risk you.” The sentence lands somewhere between an apology and a confession. {partner} keeps both.', effects: { addFlag: 'li_ick_named', bond: -2, selfrespect: 3, romantics: 2, storyBeat: 'The buried ick surfaced and got handled like a grown-up. Late counts.' } },
        },
      },
      right: {
        label: 'Let it curdle',
        tags: ['rest', 'strategy'],
        governingStats: { savvy: 1 },
        outcomes: {
          bad: { text: 'You say nothing, again, and the nothing is now audible. {partner} asks what’s wrong; “nothing,” you say, in the internationally recognised tone of everything.', effects: { bond: -8, burnout: 4, partnerMood: 'wounded' } },
          good: { text: 'You swallow it professionally. The inspector behind your ribs quietly upgrades the file from “pending” to “structural.” Structures, famously, hold until they don’t.', effects: { bond: -5, burnout: 4, savvy: 5 } },
          incredible: { text: 'You curate the feeling into a small museum only you visit. Admission is free; you pay anyway, nightly. The couple looks perfect from the garden.', effects: { bond: -4, burnout: 4, savvy: 8, drama: 1 } },
        },
      },
    },
  },
  {
    id: 'li_ick_theirs', act: 2, tags: ['ick', 'camera'],
    requires: {
      singleIs: false,
      anyOf: [{ flagsAll: ['li_casa_recouple'] }, { flagsAll: ['li_head_turned'] }, { flagsAll: ['li_strayed_official'] }],
      flagsNone: ['li_ick_theirs_done'],
    },
    art: 'li_lawn',
    context: 'The lawn · {partner} watches you work the camera · the radar pings',
    prompt: 'You’re mid-anecdote — the good one, the tested one — angled twelve degrees toward the nearest lens, and you catch {partner} watching you do it. Not jealous. Worse: CALIBRATING. Everyone in here has a radar for being somebody’s strategy. Yours just got pinged.',
    recap: '{partner} catches you playing to the cameras and starts calibrating.',
    choices: {
      left: {
        label: '“Yeah. I play up for cameras”',
        tags: ['chat', 'loyal'],
        governingStats: { loyalty: 0.6, charisma: 0.4 },
        outcomes: {
          bad: { text: 'The honesty arrives with jazz hands, which rather undermines it. “Are you performing the apology for performing?” asks {partner}. …Yes. Apparently all the way down.', effects: { addFlag: 'li_ick_theirs_done', bond: -2, selfrespect: 2, burnout: 2 } },
          good: { text: '“Twelve degrees,” you admit. “Force of habit.” {partner} snorts despite themselves. “Do the anecdote at ME next time.” Deal. The radar stands down to amber.', effects: { addFlag: 'li_ick_theirs_done', bond: 5, selfrespect: 3 } },
          incredible: { text: 'You finish the anecdote facing them, back squarely to the lens, worst angle of your season. “Better,” says {partner}. The nation, robbed of your good side, approves anyway.', effects: { addFlag: 'li_ick_theirs_done', bond: 5, selfrespect: 3, romantics: 2 } },
        },
      },
      right: {
        label: 'Perform harder. It’s a SHOW',
        tags: ['camera', 'drama'],
        governingStats: { charisma: 1 },
        outcomes: {
          bad: { text: 'You go full showreel and {partner} quietly relocates to the kitchen, where the people are load-bearing. The clip is great. The wide shot — you, alone, mid-flourish — is the story.', effects: { addFlag: 'li_ick_theirs_done', bond: -6, followers: 3, drama: 2, partnerMood: 'torn', burnout: 2 } },
          good: { text: 'The anecdote kills. The lens loves you. {partner} claps with the group, one beat behind it, filing something away in the place feelings keep their receipts.', effects: { charisma: 3, addFlag: 'li_ick_theirs_done', bond: -3, followers: 5, drama: 2 } },
          incredible: { text: 'It’s the best telly you’ve made all week, and you know it, and {partner} knows you know it. Two truths settle over the lawn: you’re a star, and stars get watched — from a distance.', effects: { charisma: 4, addFlag: 'li_ick_theirs_done', bond: -3, followers: 8, drama: 3, public: 2 } },
        },
      },
    },
  },

  // ---------- BETRAYAL-REPAIR — the same currency as love, sustained ----------
  {
    id: 'li_repair_mine_0', act: [2, 3], tags: ['repair', 'encounter', 'loyal'],
    requires: { singleIs: false, flagsAll: ['li_revealed'], flagsNone: ['li_repair_going', 'li_repaired'] },
    art: 'li_kitchen',
    context: 'The morning after your footage · the kitchen, at grovel o’clock',
    prompt: 'Your footage aired. The villa watched it twice. {partner} is still here — technically, geographically here. “Toast?” they offer, in the tone of a customs officer asking if you packed this bag yourself. The repair manual for this villa is unwritten but everyone knows chapter one: you start with the coffee.',
    recap: 'Your footage aired, and {partner} offers a very cautious toast.',
    choices: {
      left: {
        label: 'Start the lap: coffee, daily, publicly',
        tags: ['loyal', 'date'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: 'You bring the coffee. Wrong order. “Oat,” says {partner}, not looking up. Day one of the lap and you’re already doing a penalty loop.', effects: { addFlag: 'li_repair_going', bond: 1, romantics: 2, selfrespect: -1, burnout: 3 } },
          good: { text: 'Right order, no speech, set down and walk away. {partner} watches you go. The villa clocks the start of a lap; the nation’s soft wing starts a chant.', effects: { addFlag: 'li_repair_going', bond: 5, romantics: 3, selfrespect: -2 } },
          incredible: { text: 'Coffee, their towel pre-claimed on the good lounger, and their washing rescued off the line before the sprinklers — all before eight. Actions, the fluent kind. {partner} says nothing. Keeps the coffee.', effects: { addFlag: 'li_repair_going', bond: 6, romantics: 4, selfrespect: -2, graft: 2 } },
        },
      },
      right: {
        label: '“We move forward, not backward”',
        tags: ['strategy', 'chat'],
        governingStats: { savvy: 1 },
        outcomes: {
          bad: { text: '“Forward,” repeats {partner}, flat as the counter. “Like the footage. Which moved forward. Frame by frame.” The kitchen finds somewhere else to be.', effects: { bond: -4, drama: 2, selfrespect: 1, burnout: 3 } },
          good: { text: 'You opt for dignity over grovel. It’s a position. The Self-Respect wing nods; the Romantics file you under ‘cold’; {partner} files you under pending.', effects: { bond: -2, drama: 1, selfrespect: 3, romantics: -2 } },
          incredible: { text: 'You deliver the no-grovel manifesto with real poise, and {partner} — to everyone’s surprise including theirs — respects it. Unresolved, but respected. The villa’s strangest truce.', effects: { bond: 3, selfrespect: 4, romantics: -2, drama: 2 } },
        },
      },
    },
  },
  {
    id: 'li_repair_mine_1', act: [2, 3], tags: ['repair', 'encounter', 'loyal'],
    requires: { singleIs: false, flagsAll: ['li_repair_going'], flagsNone: ['li_repaired'] },
    art: 'li_firepit',
    context: 'Days into the lap · the firepit · time to say it where the mics live',
    prompt: 'Three days of coffee, towels, and shutting up. The villa has watched the lap; now it wants the sentence. You stand up at the firepit — {partner}, the cast, the cameras, the country. “I need to say something,” you say, and the garden goes church-quiet.',
    recap: 'After days of grovelling, the firepit wants the sentence out loud.',
    choices: {
      left: {
        label: 'The full re-commitment, no notes',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 0.8, charisma: 0.2 },
        outcomes: {
          bad: { text: 'You mean every word and deliver them in the wrong order, ending on “and that’s why the footage isn’t the real me,” which the footage disputes. {partner} takes the intent. Barely.', effects: { bond: 2, romantics: 2, drama: 1, burnout: 3 } },
          good: { text: '“I’m not getting to know anyone else. I’m here, for this, out loud.” No hashtag, no hedge. {partner} holds your eye the whole way. The lap is complete; the ledger opens again.', effects: { addFlag: 'li_repaired', bond: 6, romantics: 4, selfrespect: -1, storyBeat: 'Betrayed the couple, ran the lap, said it at the firepit — the redemption the nation writes essays about.' } },
          incredible: { text: 'You say it plainly and then — the move — you sit down without waiting for absolution. {partner} lets the silence run a full broadcast minute before taking your hand. Television HALTS.', effects: { addFlag: 'li_repaired', bond: 8, romantics: 5, public: 3, storyBeat: 'The public re-commitment, unhedged. Cracked and mended in front of the country.' } },
        },
      },
      right: {
        label: 'Hedge it, protect the vote',
        tags: ['strategy', 'camera'],
        governingStats: { savvy: 0.7, charisma: 0.3 },
        outcomes: {
          bad: { text: 'You engineer a sentence with a get-out clause per subordinate phrase. {partner} counts the clauses on their fingers, visibly. The firepit has never felt so contractual.', effects: { bond: -3, drama: 2, burnout: 3 } },
          good: { text: 'It’s a good speech — measured, likeable, safe. The villa applauds. {partner} smiles the smile that knows the difference between a speech and a sentence. The lap continues, unfinished.', effects: { charisma: 3, bond: 4, drama: 1, followers: 3, savvy: 5 } },
          incredible: { text: 'You thread it perfectly: warm enough for the Romantics, spiked enough for the Drama wing, deniable throughout. A masterpiece of nothing. {partner} grades it accordingly: “nice speech.”', effects: { charisma: 4, bond: 3, drama: 3, followers: 6, savvy: 8 } },
        },
      },
    },
  },
  {
    id: 'li_repair_theirs_0', act: [2, 3], tags: ['repair', 'encounter', 'chat'],
    requires: { singleIs: false, flagsAll: ['li_partner_revealed'], flagsNone: ['li_repaired', 'li_repair_lap'] },
    art: 'li_kitchen',
    context: 'Three mornings after their footage · the coffee has been arriving',
    prompt: 'Since Movie Night, {partner} has served you coffee three mornings running — right order, no speeches — and last night, at the firepit, unprompted: “I’m focusing on one person in here. That’s it. That’s the announcement.” The villa looks at you. Forgiveness has a queue number, and it’s been called.',
    recap: '{partner}’s done three mornings of coffee and named you at the firepit.',
    choices: {
      left: {
        label: 'Forgive. Properly, out loud',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 0.7, charisma: 0.3 },
        outcomes: {
          bad: { text: 'You forgive them so fast and so fully the villa does the maths in real time. “Day THREE?” mouths {mate} across the garden. The Romantics cheer. The spine wing writes you off.', effects: { addFlag: 'li_repaired', bond: 5, romantics: 4, selfrespect: -4, storyBeat: 'Cracked, chose it again — fast. The nation argues about you at dinner tables.' } },
          good: { text: '“The coffee counted,” you say. “The sentence counted more. We’re good.” Clean forgiveness, dated and signed. The soft half of the country stands and applauds; the other half respects the paperwork.', effects: { addFlag: 'li_repaired', bond: 7, romantics: 4, selfrespect: -2, storyBeat: 'Questioned it, cracked, chose it again — the arc the envelope loves.' } },
          incredible: { text: '“I saw the lap. I’m keeping the person who ran it.” You say it to the group, not just to them — forgiveness with a spine in it. Even the Self-Respect wing has to admit: that’s not a doormat. That’s a decision.', effects: { addFlag: 'li_repaired', bond: 8, romantics: 5, selfrespect: 1, public: 2, storyBeat: 'Forgiveness delivered as a verdict, not a surrender. The complete storyline.' } },
        },
      },
      right: {
        label: 'Make them finish the lap',
        tags: ['strategy', 'code'],
        governingStats: { savvy: 0.6, loyalty: 0.4 },
        outcomes: {
          bad: { text: '“Keep going,” you say, and can’t quite keep the judge’s gavel out of it. {partner} nods, hurt and grafting. The villa opens a book on whether this is standards or sport.', effects: { addFlag: 'li_repair_lap', bond: 1, selfrespect: 4, romantics: -3, burnout: 2 } },
          good: { text: '“Three coffees isn’t a repair, it’s a start,” you say — kindly, clearly. {partner} takes it on the chin: “then I’ll keep starting.” The spine wing makes you their wallpaper.', effects: { addFlag: 'li_repair_lap', bond: 4, selfrespect: 4, romantics: -2 } },
          incredible: { text: '“I want the boring version,” you tell them. “Weeks of it. Prove it when nobody’s filming.” Which, in here, is the single most radical sentence available. The nation SCREAMS. Respectfully.', effects: { addFlag: 'li_repair_lap', bond: 5, selfrespect: 5, romantics: -2, followers: 4 } },
        },
      },
    },
  },
  {
    id: 'li_repair_theirs_1', act: [2, 3], tags: ['repair', 'encounter', 'chat'],
    requires: { singleIs: false, flagsAll: ['li_repair_lap'], flagsNone: ['li_repaired'] },
    art: 'li_daybed',
    context: 'A week of the boring version later · the lap, audited',
    prompt: 'They kept it up when the cameras were on the challenge. They kept it up during the Hut queue, the washing-up rota, the 1 a.m. kitchen shift. {mate}, your appointed auditor, files the report: “It’s real, babe. Annoyingly real.” The daybed is free. The verdict is yours.',
    recap: 'A week on, {mate} audits {partner}’s repair and finds it real.',
    choices: {
      left: {
        label: 'Close the ledger. Forgive',
        tags: ['loyal', 'date'],
        governingStats: { loyalty: 0.8, rizz: 0.2 },
        outcomes: {
          bad: { text: 'You forgive them mid-yawn at the wrong moment and have to redo it with eye contact. The second take is real. The first take airs. Both count, apparently.', effects: { addFlag: 'li_repaired', bond: 5, romantics: 3, selfrespect: 2, burnout: 1, storyBeat: 'Made them earn it, then meant it. The tested-and-came-back arc, complete.' } },
          good: { text: '“Ledger’s closed,” you say, and mean it, and the relief that crosses {partner}’s face is the realest thing broadcast this week. Earned forgiveness — the villa’s rarest currency, minted on the daybed.', effects: { addFlag: 'li_repaired', bond: 7, romantics: 3, selfrespect: 3, storyBeat: 'The lap ran its full distance and the forgiveness was EARNED. A storyline with receipts.' } },
          incredible: { text: '“You proved it when nobody was filming,” you say. “That’s the whole test. You passed it in the kitchen.” {partner} laughs, wet-eyed, holding the tea they made you unasked. The nation loses its collective mind.', effects: { addFlag: 'li_repaired', bond: 9, romantics: 4, selfrespect: 3, public: 3, storyBeat: 'Cracked, tested at length, chosen again with the receipts read aloud. The season’s best arc.' } },
        },
      },
      right: {
        label: '“It’s dead. It died at Movie Night”',
        tags: ['strategy', 'drama'],
        governingStats: { savvy: 0.5, loyalty: 0.5 },
        outcomes: {
          bad: { text: 'You end it on the daybed and immediately doubt it, which shows, which {partner} sees, which makes the ending crueller than the crime. The villa splits down the middle over dinner.', effects: { bond: -8, selfrespect: 3, romantics: -3, drama: 4, partnerMood: 'wounded', burnout: 3 } },
          good: { text: '“You ran a beautiful lap,” you say. “The track’s closed.” Honest, final, no cruelty in it. {partner} takes it standing. The spine wing salutes; the soft wing mourns; the villa updates its spreadsheets.', effects: { bond: -6, selfrespect: 5, romantics: -3, drama: 3, partnerMood: 'wounded' } },
          incredible: { text: 'You say it with so much grace the break-up scene plays like a graduation. “Whoever gets the fixed version of you,” you finish, “owes me a drink.” The line enters the format’s hall of fame.', effects: { bond: -6, selfrespect: 6, romantics: -2, drama: 4, followers: 5, partnerMood: 'wounded' } },
        },
      },
    },
  },

  // ---------- THE ICK — second scenario per shape (novel triggers, wider pool) ----------
  {
    id: 'li_ick_sweet2', act: 2, tags: ['ick', 'encounter', 'chat'],
    requires: { singleIs: false, partnerShapeIs: 'sweetheart', flagsNone: ['li_ick_named', 'li_ick_buried'] },
    art: 'li_daybed',
    context: 'The daybed · {partner} has planned the rest of your life · you’ve known them nine days',
    prompt: '“So I was thinking,” {partner} says, glowing, “our dog — a sausage dog — Nigel. And your mum can have the box room. And we’d do Christmases at mine ’cause of the good oven.” Day nine. There is a good oven, apparently. Behind your ribs, the tiny inspector picks up a clipboard and writes: fast. Very fast.',
    recap: '{partner} has named your future dog and allocated your mum a box room. Day nine.',
    choices: {
      left: {
        label: 'Name the pace, kindly',
        tags: ['chat', 'loyal'],
        governingStats: { loyalty: 0.6, savvy: 0.4 },
        outcomes: {
          bad: { text: '“Maybe park Nigel for now?” you try, and {partner}’s face crumples like you dumped Nigel personally. Now you’re reassuring someone about a dog that doesn’t exist. The inspector sighs.', effects: { addFlag: 'li_ick_named', chainEventId: 'li_ick_talk', bond: -3, burnout: 3 } },
          good: { text: '“I love that you see it,” you say. “Can we get to next week first?” {partner} laughs, a bit embarrassed. “I do get ahead of myself.” “A bit, babe.” The oven can wait. The ick loosens.', effects: { addFlag: 'li_ick_named', chainEventId: 'li_ick_talk', bond: -2, selfrespect: 2 } },
          incredible: { text: '“I want the sausage dog,” you say. “I just want to earn it first.” {partner} goes still, then softer than you’ve seen. “…Nobody’s ever wanted to earn me.” Slower, together. Nigel, pending.', effects: { addFlag: 'li_ick_named', chainEventId: 'li_ick_talk', bond: -1, selfrespect: 3, romantics: 1 } },
        },
      },
      right: {
        label: 'Nod along, panic inside',
        tags: ['rest', 'strategy'],
        governingStats: { savvy: 0.7, loyalty: 0.3 },
        outcomes: {
          bad: { text: 'You say “totally” to the box room, the oven, and Nigel. Your smile is doing overtime and the overtime is unpaid. Somewhere a future you is already exhausted.', effects: { addFlag: 'li_ick_buried', burnout: 4, savvy: 2 } },
          good: { text: 'You file it under “keen, will settle.” The inspector notes the keenness, then, in a smaller hand, the speed. Leaves a card: we’ll be in touch about the oven.', effects: { burnout: -4, addFlag: 'li_ick_buried', savvy: 5 } },
          incredible: { text: 'You bury it under a sausage dog’s worth of enthusiasm and change the subject to lunch. Buried keenness has a documented habit of returning at Meet the Parents. Lovely funeral, though.', effects: { burnout: -6, addFlag: 'li_ick_buried', savvy: 8, drama: 1 } },
        },
      },
    },
  },
  {
    id: 'li_ick_game2', act: 2, tags: ['ick', 'encounter', 'chat'],
    requires: { singleIs: false, partnerShapeIs: 'gameplayer', flagsNone: ['li_ick_named', 'li_ick_buried'] },
    art: 'li_lawn',
    context: 'The lawn · you hear your own story, told to someone else',
    prompt: 'The story {partner} told you last night — the dead grandad, the real one, the one that made you trust them — you just heard it again. Word for word, to the Beach Hut camera: “…and after my grandad went, I just stopped letting people in.” Same pause. Same catch in the voice. The tiny inspector behind your ribs underlines the catch: rehearsed. It was rehearsed.',
    recap: 'You catch {partner} performing their “vulnerable” grandad story to camera, verbatim.',
    choices: {
      left: {
        label: 'Ask if any of it was real',
        tags: ['chat', 'strategy'],
        governingStats: { savvy: 0.6, loyalty: 0.4 },
        outcomes: {
          bad: { text: '“Was the grandad even—” “Don’t you DARE,” {partner} snaps, and the grandad was real, and now you’ve insulted a dead man and a live one. The catch in their voice, this time, isn’t for camera.', effects: { addFlag: 'li_ick_named', chainEventId: 'li_ick_talk', bond: -4, burnout: 3, drama: 1 } },
          good: { text: '“It’s real,” you say. “I just need to know you meant it for ME, not the edit.” {partner} deflates. “…Both. I panicked and made it content.” Honest, finally. The ick eases a notch.', effects: { addFlag: 'li_ick_named', chainEventId: 'li_ick_talk', bond: -2, selfrespect: 3 } },
          incredible: { text: '“Tell me one thing you’d never say to a camera,” you ask. {partner} thinks, then says something small and unflattering and true. “That,” you say. “More of that.” The realest trade you’ve made.', effects: { addFlag: 'li_ick_named', chainEventId: 'li_ick_talk', bond: -1, selfrespect: 3, romantics: 2 } },
        },
      },
      right: {
        label: 'File it. Say nothing',
        tags: ['rest', 'strategy'],
        governingStats: { savvy: 1 },
        outcomes: {
          bad: { text: 'You keep the receipt and now hear the rehearsed catch every time they open up. Real or not, you can’t un-hear it. That’s the ick: a permanent second audio track.', effects: { addFlag: 'li_ick_buried', burnout: 4, savvy: 2 } },
          good: { text: 'Everyone performs a bit in here, you reason. The inspector writes “a bit” in quotation marks and files it under the growing folder marked their name.', effects: { burnout: -4, addFlag: 'li_ick_buried', savvy: 5 } },
          incredible: { text: 'You become a connoisseur of which of their feelings are for you and which are for the edit. You’re usually right. Being right about this, nightly, is its own small cost.', effects: { burnout: -6, addFlag: 'li_ick_buried', savvy: 8, drama: 1 } },
        },
      },
    },
  },
  {
    id: 'li_ick_slow2', act: 2, tags: ['ick', 'encounter', 'chat'],
    requires: { singleIs: false, partnerShapeIs: 'slowburner', flagsNone: ['li_ick_named', 'li_ick_buried'] },
    art: 'li_firepit',
    context: 'The firepit · warm in private · a stranger in public',
    prompt: 'In bed last night {partner} held your hand and called you “home.” Tonight, at the firepit, someone teases them about you and they go: “We’re just seeing how it goes, aren’t we.” Aren’t we. Said to the group, about home. The tiny inspector behind your ribs circles two words: in public.',
    recap: '{partner} calls you “home” in private, then downgrades you to “seeing how it goes” publicly.',
    choices: {
      left: {
        label: 'Name the two faces, gently',
        tags: ['chat', 'loyal'],
        governingStats: { loyalty: 0.7, savvy: 0.3 },
        outcomes: {
          bad: { text: '“So which one’s real — the bed or the firepit?” comes out sharper than you meant. {partner} shuts like a till. “Why does it need announcing?” Because you called me home, you don’t say.', effects: { addFlag: 'li_ick_named', chainEventId: 'li_ick_talk', bond: -4, burnout: 3 } },
          good: { text: '“I don’t need a banner,” you say quietly. “I just need the firepit version to know the bed version exists.” {partner} looks caught. “…That’s fair. I go shy out there.” The shutters lift a slat.', effects: { addFlag: 'li_ick_named', chainEventId: 'li_ick_talk', bond: -2, selfrespect: 2, romantics: 1 } },
          incredible: { text: '“You can be private,” you tell them, “you just can’t be two people.” A long pause. Then {partner}, to the whole firepit, unprompted: “Actually — they’re not a maybe to me.” From this one, that’s a fireworks display.', effects: { addFlag: 'li_ick_named', chainEventId: 'li_ick_talk', bond: -1, selfrespect: 3, romantics: 2 } },
        },
      },
      right: {
        label: 'Take the private version, ignore the public',
        tags: ['rest', 'strategy'],
        governingStats: { savvy: 0.6, loyalty: 0.4 },
        outcomes: {
          bad: { text: 'You decide the bed is the truth and the firepit is nerves. Maybe. But you start listening for “home” like proof, and needing proof nightly is the ick with a nicer name.', effects: { addFlag: 'li_ick_buried', burnout: 4, savvy: 2 } },
          good: { text: 'Guarded people guard in public, you reason. Patient. Mature. The inspector notes the maturity and, beside it, how quiet you’ve gone at firepits lately.', effects: { burnout: -4, addFlag: 'li_ick_buried', savvy: 5 } },
          incredible: { text: 'You bank the private “home” like a photo and expect nothing in daylight. Either the two faces become one, or they don’t. The villa respects a patient experiment. Your ribs keep the receipt.', effects: { burnout: -6, addFlag: 'li_ick_buried', savvy: 8 } },
        },
      },
    },
  },

  // ---------- BETRAYAL-REPAIR — alternate opening scenes (variance in the grovel) ----------
  {
    id: 'li_repair_mine_alt0', act: [2, 3], tags: ['repair', 'encounter', 'loyal'],
    requires: { singleIs: false, flagsAll: ['li_revealed'], flagsNone: ['li_repair_going', 'li_repaired'] },
    art: 'li_firepit_day',
    context: 'The morning after your footage · the sun-loungers · nobody’s saved you a seat',
    prompt: 'Your footage aired. This morning every lounger has a towel on it except the wobbly one, which is a message. {partner} is on the good lounger, sunglasses on, unreadable. “You can sit,” they say, not moving their towel an inch. “If you want.” The repair manual’s unwritten but chapter one is clear: earn the towel.',
    recap: 'The morning after your footage, {partner} won’t move their towel an inch.',
    choices: {
      left: {
        label: 'Start earning it — small, daily, no speech',
        tags: ['loyal', 'date'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: 'You launch into a speech and {partner} lifts one sunglass lens. “I said sit, not present.” You sit. The speech dies on the lounger. Day one of the lap, already a penalty loop.', effects: { addFlag: 'li_repair_going', bond: 1, romantics: 2, selfrespect: -1, burnout: 3 } },
          good: { text: 'You sit, say nothing, and top up their water when it runs low without being asked. {partner} doesn’t thank you. Doesn’t move away either. The villa clocks the start of a lap.', effects: { addFlag: 'li_repair_going', bond: 5, romantics: 3, selfrespect: -2 } },
          incredible: { text: 'You sit, hand them the good sun cream, move their towel to the shade before they burn, and shut up. All before the others wake. {partner} says nothing. Keeps the cream. The lap has begun.', effects: { addFlag: 'li_repair_going', bond: 6, romantics: 4, selfrespect: -2, graft: 2 } },
        },
      },
      right: {
        label: '“I’m not grovelling on a lounger”',
        tags: ['strategy', 'chat'],
        governingStats: { savvy: 1 },
        outcomes: {
          bad: { text: '“Grovel? Who said grovel,” you bluster, standing, and the standing IS the grovel, badly done, for the wide shot. {partner} puts the sunglasses back down. Audience over.', effects: { bond: -4, drama: 2, selfrespect: 1, burnout: 3 } },
          good: { text: 'You choose dignity over the lap. It’s a position. The Self-Respect wing nods; {partner} files you under “pending, cold.” The towel does not move.', effects: { bond: -2, drama: 1, selfrespect: 3, romantics: -2 } },
          incredible: { text: 'You state, plainly, that you’ll show them you meant it rather than say it, and sit on the WOBBLY lounger by choice. {partner} almost smiles. Unresolved — but the wobbly lounger did numbers.', effects: { bond: 3, selfrespect: 4, romantics: -2, drama: 2 } },
        },
      },
    },
  },
  {
    id: 'li_repair_theirs_alt0', act: [2, 3], tags: ['repair', 'encounter', 'chat'],
    requires: { singleIs: false, flagsAll: ['li_partner_revealed'], flagsNone: ['li_repaired', 'li_repair_lap'] },
    art: 'li_terrace',
    context: 'The terrace · {partner}’s footage aired · they’ve brought your tea up two mornings running',
    prompt: '{partner}’s clip played. Since then: your tea, on the wall by the stairs, right order, no card, two mornings. This morning they add a sentence. “I’m not gonna insult you with a big speech. I messed up, I know it aired, and I’m here till you tell me otherwise.” The queue for forgiveness has a number and it’s yours to call.',
    recap: '{partner}’s footage aired; they’ve brought your tea up two mornings, no speech.',
    choices: {
      left: {
        label: 'Forgive it, plainly, out loud',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 0.7, charisma: 0.3 },
        outcomes: {
          bad: { text: 'You forgive so fast the villa does the maths out loud. “Two teas?” mouths {mate}. The Romantics cheer; the spine wing writes you off before your tea’s even cold.', effects: { addFlag: 'li_repaired', bond: 5, romantics: 4, selfrespect: -4, storyBeat: 'Forgave the two-tea apology by day two — the villa timed it. Cracked and chose again, maybe a beat too quick.' } },
          good: { text: '“The tea counted. The no-speech counted more. We’re alright.” Clean, dated, done. Half the country stands; the other half respects the paperwork. {partner} exhales a week.', effects: { addFlag: 'li_repaired', bond: 7, romantics: 4, selfrespect: -2, storyBeat: 'Two mornings of tea on the wall, no speech, then forgiven plainly. Repair by logistics, not oratory.' } },
          incredible: { text: '“I watched you show up when you could’ve hidden,” you say, to the group, not just them. “I’m keeping the person who did that.” Forgiveness with a spine in it. Even the spine wing allows it.', effects: { addFlag: 'li_repaired', bond: 8, romantics: 5, selfrespect: 1, public: 2, storyBeat: 'Earned back one silent tea round at a time, then forgiven out loud — the no-speech redemption the nation frames.' } },
        },
      },
      right: {
        label: 'Make them run the full lap first',
        tags: ['strategy', 'code'],
        governingStats: { savvy: 0.6, loyalty: 0.4 },
        outcomes: {
          bad: { text: '“Keep going,” you say, gavel fully out, and {partner} nods, grafting and stung. The villa opens a book on whether this is standards or a power trip. Odds are unkind.', effects: { addFlag: 'li_repair_lap', bond: 1, selfrespect: 4, romantics: -3, burnout: 2 } },
          good: { text: '“Two teas is a start, not a repair,” you say — kind, clear. “Show me when the cameras are bored.” {partner} takes it on the chin. “Then I’ll keep starting.” The spine wing frames you.', effects: { addFlag: 'li_repair_lap', bond: 4, selfrespect: 4, romantics: -2 } },
          incredible: { text: '“I want the version nobody’s filming,” you tell them. “Weeks of boring. Prove it there.” The single most radical request in the villa. The nation SCREAMS. Respectfully.', effects: { addFlag: 'li_repair_lap', bond: 5, selfrespect: 5, romantics: -2, followers: 4 } },
        },
      },
    },
  },

  // ---------- THE FALLING — love’s own arc: the leap, and who takes it (ADR-0013 sibling) ----------
  {
    id: 'li_fall_start', act: [2, 3], tags: ['fall', 'encounter', 'chat'],
    requires: { singleIs: false, flagsNone: ['li_fall_said', 'li_fall_held'] },
    art: 'li_terrace',
    context: 'The terrace, late · the sentence is right there · so is the drop',
    prompt: 'You’re mid-nothing — “cheese and onion is objectively the superior crisp and I won’t hear otherwise,” {partner} is saying — when they laugh at something you said and you feel it arrive: the big word, fully formed and terrifying. They don’t know it’s in the room. You could say it first, which in here is a bungee jump with the cameras rolling, or hold it and keep it safe.',
    recap: 'The big word arrives on the terrace, and it’s yours to say first — or hold.',
    choices: {
      left: {
        label: 'Say it first',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 0.6, rizz: 0.4 },
        outcomes: {
          bad: { text: '“I think I love you,” you blurt, over a crisp fact, and {partner} freezes. “…That’s mad,” they manage — not no, but not the echo you wanted. You jumped; the bungee’s still deciding.', effects: { addFlag: 'li_fall_said', chainEventId: 'li_fall_talk', bond: 2, burnout: 3, romantics: 1 } },
          good: { text: '“I’m not saying it for a reaction,” you say. “I just love you, and holding it in felt like lying.” {partner} goes very still, then: “…say it again.” You do. This time they’re smiling.', effects: { addFlag: 'li_fall_said', chainEventId: 'li_fall_talk', bond: 5, romantics: 3, selfrespect: 2 } },
          incredible: { text: '“I love you. No hashtag, no strategy, terrible timing, all of it.” {partner} laughs, wet-eyed. “I’ve been sat on it for four days, you absolute—” and doesn’t finish, because they’re kissing you. Nobody else gets this one.', effects: { addFlag: 'li_fall_said', chainEventId: 'li_fall_talk', bond: 7, romantics: 5, selfrespect: 2, storyBeat: 'Said the big word first, on camera, no safety net — and it was met.' } },
        },
      },
      right: {
        label: 'Hold it. Keep it safe',
        tags: ['rest', 'strategy'],
        governingStats: { savvy: 0.6, loyalty: 0.4 },
        outcomes: {
          bad: { text: 'You swallow it and change the subject back to crisps. {partner} clocks the swerve. “You alright? You went weird.” “Cheese and onion,” you say, which explains nothing and buries everything.', effects: { addFlag: 'li_fall_held', burnout: 4, savvy: 2 } },
          good: { text: 'You keep it in your pocket where it’s safe and unsaid. Safe and unsaid, you’ll learn, are not the same as safe. But not tonight. Tonight you just hold the word and the hand.', effects: { addFlag: 'li_fall_held', burnout: -2, savvy: 3, romantics: 1 } },
          incredible: { text: 'You decide the word deserves a better stage than a crisp chat — and start, quietly, building one. Held on purpose, not from fear. The inspector behind your ribs, for once, approves.', effects: { addFlag: 'li_fall_held', burnout: -4, savvy: 5, selfrespect: 2 } },
        },
      },
    },
  },
  {
    id: 'li_fall_talk', act: [2, 3], chainOnly: true, tags: ['fall', 'encounter', 'chat'],
    art: 'li_daybed',
    context: 'The next day · the word is out of the box · now what',
    prompt: '“So.” {partner} sits down, holding two drinks and yesterday’s enormous sentence. “I’ve never said it back that quick to anyone. I keep people at arm’s length — ask literally anyone. But you got in. So. Yeah.” They hand you a drink like it’s a contract. “I love you too. Don’t make it weird.”',
    recap: '{partner} sits down to say it back, and asks you not to make it weird.',
    choices: {
      left: {
        label: 'Build the real thing',
        tags: ['loyal', 'date'],
        governingStats: { loyalty: 0.8, rizz: 0.2 },
        outcomes: {
          bad: { text: 'You over-plan the future on the spot — labels, dates, the lot — and {partner} laughs nervously. “Can we love each other on Tuesday before we do the mortgage?” Fair. You brought a spreadsheet to a feeling.', effects: { bond: 3, romantics: 2, burnout: 2 } },
          good: { text: '“I don’t need it to be weird,” you say. “I need it to be real when nobody’s filming.” {partner} nods, relieved. “Deal.” You clink drinks on the least dramatic, most solid thing you’ve built.', effects: { bond: 6, romantics: 3, storyBeat: 'Said it, meant it, and chose to keep it real off-camera. Love, on purpose.' } },
          incredible: { text: '“I fancied you before I had a plan,” you tell them, “and I’ve got a plan now and I still just fancy you.” {partner} goes quiet, then: “Nobody’s ever wanted the boring version with me.” You do. That’s the whole vow.', effects: { bond: 8, romantics: 4, selfrespect: 2, storyBeat: 'Two guarded people said the word and chose the un-filmed, un-dramatic, real version.' } },
        },
      },
      right: {
        label: 'Keep it light, protect it',
        tags: ['banter', 'rest'],
        governingStats: { charisma: 0.6, savvy: 0.4 },
        outcomes: {
          bad: { text: 'You deflect the big moment with a bit, and {partner}’s face does a small drop. “Right. Yeah. Bit.” The word’s out but you’ve wrapped it in cling film. It’s fine. It’s a bit muffled, is all.', effects: { bond: -2, burnout: 3, romantics: -1 } },
          good: { text: '“Weird is off the table,” you grin. “Obsessed is very much ON it.” {partner} laughs, the tension breaks, and the enormous thing settles into something you can actually carry around all day.', effects: { bond: 4, romantics: 2, charisma: 4, followers: 2 } },
          incredible: { text: 'You turn “don’t make it weird” into your whole bit — announcing your love exclusively via increasingly formal handshakes. {partner} plays along, delighted. A huge feeling, made portable. Villa alchemy.', effects: { bond: 6, romantics: 3, charisma: 6, followers: 4 } },
        },
      },
    },
  },
  {
    id: 'li_fall_resurface', act: 3, tags: ['fall', 'encounter', 'chat'],
    requires: { singleIs: false, flagsAll: ['li_fall_held'], flagsNone: ['li_fall_said'] },
    art: 'li_firepit',
    context: 'Final Week · the word you didn’t say · running out of terrace',
    prompt: 'You held it. It’s been safe in your pocket for weeks and now Final Week is here and safe is starting to feel like a coward’s word. {partner}, at the firepit, quietly: “Can I ask you something? Do you actually… or are we just really good at this?” The word presses at your teeth. Last chance to jump.',
    recap: 'Final Week — {partner} asks if it’s real, and the word you held wants out.',
    choices: {
      left: {
        label: 'Say it. Finally',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 0.7, rizz: 0.3 },
        outcomes: {
          bad: { text: '“I’ve loved you since the crisp chat,” tumbles out with weeks of interest attached. “The CRISP chat? That was AGES ago,” {partner} says, half thrilled, half furious you sat on it. Late, but out.', effects: { addFlag: 'li_fall_said', bond: 3, selfrespect: 2, burnout: 2, romantics: 2 } },
          good: { text: '“It’s real. I’ve known for ages. I was scared to say it out loud in here.” {partner} lets out a breath they’ve clearly been holding too. “Say it properly, then.” You do. Late counts.', effects: { addFlag: 'li_fall_said', bond: 6, romantics: 4, selfrespect: 2, storyBeat: 'Held the word for weeks out of fear — then jumped before the whistle. Late, and real.' } },
          incredible: { text: '“I love you. I held it because saying it made it breakable, and I was a coward, and I’m done being one.” {partner} kisses you before you finish. Final Week just got its story, and it’s yours.', effects: { addFlag: 'li_fall_said', bond: 8, romantics: 5, selfrespect: 3, public: 2, storyBeat: 'The word held all season, said at last at the final firepit. The leap, taken late and true.' } },
        },
      },
      right: {
        label: 'Deflect. Protect yourself',
        tags: ['strategy', 'rest'],
        governingStats: { savvy: 0.6, loyalty: 0.4 },
        outcomes: {
          bad: { text: '“We’re really good at this,” you say, choosing the safe half of their question. {partner}’s face closes a little. “Right. Yeah. Good at this.” The word goes back in the pocket, heavier now.', effects: { bond: -4, burnout: 4, romantics: -2, partnerMood: 'wounded' } },
          good: { text: 'You keep it guarded one more time and steer to safer ground. It works; the evening holds. But the word’s still in there, unspent, and Final Week has a way of auditing what you didn’t say.', effects: { bond: -2, burnout: 3, savvy: 4 } },
          incredible: { text: 'You deflect so gracefully {partner} doesn’t even notice the dodge. A clean escape. You’re very good at this — which was, you realise walking away, precisely their question.', effects: { bond: -1, burnout: 3, savvy: 7, drama: 1 } },
        },
      },
    },
  },

  // ---------- THE FAME FRICTION — when the nation picks a favourite between you ----------
  {
    id: 'li_fame_start', act: [2, 3], tags: ['fame', 'encounter', 'drama'],
    requires: { singleIs: false, flagsNone: ['li_fame_named', 'li_fame_buried'] },
    art: 'li_bedroom',
    context: 'The dressing room · the nation has done a rude thing · picked one of you',
    prompt: 'The producers let it slip in a challenge: you’ve got triple {partner}’s followers. Since then {partner} laughs a half-second late at your jokes, and tonight, brushing their teeth beside you: “Weird, isn’t it. Being the plus-one in your own relationship.” Foam and honesty. The tiny inspector behind your ribs notes: this is a real one.',
    recap: '{partner} clocks that the nation’s picked you as the favourite, and feels like a plus-one.',
    choices: {
      left: {
        label: 'Name it before it festers',
        tags: ['chat', 'loyal'],
        governingStats: { loyalty: 0.7, savvy: 0.3 },
        outcomes: {
          bad: { text: '“The numbers don’t mean anything,” you say, which is what the person WITH the numbers always says. {partner} spits, rinses. “Easy to say from up there.” True. You said the true wrong thing.', effects: { addFlag: 'li_fame_named', chainEventId: 'li_fame_talk', bond: -3, burnout: 3, drama: 1 } },
          good: { text: '“You’re not my plus-one, you’re the reason I’m worth watching,” you say. {partner} rolls their eyes but the shoulders drop. “…That was smooth.” “It’s also true.” Named, and defused a notch.', effects: { addFlag: 'li_fame_named', chainEventId: 'li_fame_talk', bond: -1, selfrespect: 2, romantics: 1 } },
          incredible: { text: '“Then let’s make you unmissable,” you say. “I’ll set you up, you land it, we split the fame like the washing-up.” {partner} laughs, properly. “A fame prenup.” The realest plan the sink’s ever hosted.', effects: { addFlag: 'li_fame_named', chainEventId: 'li_fame_talk', bond: -1, selfrespect: 3, romantics: 2 } },
        },
      },
      right: {
        label: 'Play it down, hope it passes',
        tags: ['rest', 'camera'],
        governingStats: { charisma: 0.5, savvy: 0.5 },
        outcomes: {
          bad: { text: 'You dim your own light at the next challenge to even the score, throw a bit deliberately — and {partner} clocks the charity and hates it more than the gap. “Don’t you DARE lose on purpose.”', effects: { addFlag: 'li_fame_buried', burnout: 4, drama: 1, followers: -2 } },
          good: { text: 'You wave the numbers off and keep the peace. It holds — for now. But followers don’t un-happen, and a gap you don’t name tends to name itself later, louder.', effects: { burnout: -2, addFlag: 'li_fame_buried', savvy: 4 } },
          incredible: { text: 'You quietly redirect every camera you can toward {partner} without telling them — feeding lines, stepping back. Generous, invisible, and a bomb with a slow fuse: kindness they didn’t agree to.', effects: { burnout: -4, addFlag: 'li_fame_buried', savvy: 6, followers: -1, drama: 1 } },
        },
      },
    },
  },
  {
    id: 'li_fame_talk', act: [2, 3], chainOnly: true, tags: ['fame', 'encounter', 'chat'],
    art: 'li_daybed',
    context: 'The daybed · the follow-up · followers on the table, feelings underneath',
    prompt: '“I’m not jealous, before you say it,” {partner} says, which is what jealous people say, and they know it, and wave it off. “Okay, a bit. Not of you. Of how easy it looks. I graft for a laugh; you breathe and the nation swoons.” It’s the most honest they’ve been. It’s also a live grenade on a daybed.',
    recap: '{partner} admits, honestly, that your effortless fame stings.',
    choices: {
      left: {
        label: 'Make it a team, not a table',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 0.8, charisma: 0.2 },
        outcomes: {
          bad: { text: 'You get defensive — “I graft too, actually” — and it becomes a follower-count row on a daybed, which airs, which does numbers, which is somehow the worst possible outcome for both of you.', effects: { bond: -3, drama: 2, burnout: 3 } },
          good: { text: '“Then we run it as a double act,” you say. “Your bits, my face, split the credit at the reunion.” {partner} considers it. “…I do have better bits.” “You do.” A couple, pooling fame instead of fighting over it.', effects: { bond: 6, romantics: 3, followers: 2, storyBeat: 'Turned a fame gap into a partnership instead of a wound. The rare grown-up move.' } },
          incredible: { text: '“I’d give you every follower to keep this,” you say, and mean it, and {partner} sees you mean it. “Don’t,” they say, thick-voiced. “Just… don’t leave me behind out there.” “Never.” The vow that actually matters.', effects: { bond: 8, romantics: 4, selfrespect: 2, storyBeat: 'Chose the couple over the clout, out loud, and were believed. The nation’s favourite couple, not favourite.' } },
        },
      },
      right: {
        label: 'Protect your own shine',
        tags: ['strategy', 'camera'],
        governingStats: { savvy: 0.7, charisma: 0.3 },
        outcomes: {
          bad: { text: '“I can’t apologise for the edit,” you say, cool, and you can’t — but the coolness is the injury. {partner} nods, filing it. “No. You can’t.” Something quietly recalibrates on the daybed.', effects: { bond: -4, selfrespect: 2, romantics: -2, burnout: 2 } },
          good: { text: 'You keep your shine and offer them the spotlight when it’s spare, not your whole light. Fair, honest, a little cold. {partner} respects the honesty and clocks the temperature. Both are true.', effects: { bond: -1, selfrespect: 3, savvy: 5, followers: 2 } },
          incredible: { text: '“I’m not dimming, and you shouldn’t want me to,” you say. “Match me.” It’s ruthless and it’s a compliment and {partner} can’t decide which — then, slowly, takes it as the compliment. Game on.', effects: { bond: 2, selfrespect: 4, savvy: 6, followers: 3, drama: 1 } },
        },
      },
    },
  },
  {
    id: 'li_fame_resurface', act: 3, tags: ['fame', 'encounter', 'drama'],
    requires: { singleIs: false, flagsAll: ['li_fame_buried'], flagsNone: ['li_fame_named'] },
    art: 'li_lawn',
    context: 'Final Week · the gap you ignored · now it has a voice',
    prompt: 'The thing you smoothed over has grown teeth. A magazine cover leaks to the villa — your face, solo, {partner} cropped to an elbow — and {partner} sees it before you can. “Elbow,” they say, flat. “Weeks of us and I made the ELBOW.” The buried thing is at the firepit now, wearing your silence as a lanyard.',
    recap: 'A magazine cover crops {partner} to an elbow, and the buried fame gap erupts.',
    choices: {
      left: {
        label: 'Own the silence, fix it late',
        tags: ['chat', 'loyal'],
        governingStats: { loyalty: 0.6, savvy: 0.4 },
        outcomes: {
          bad: { text: '“It’s just a cover,” you say, and the “just” lands like a slap. “Easy for the FACE to say,” {partner} snaps, and weeks of your polite dimming curdle into one loud row the whole lawn attends.', effects: { addFlag: 'li_fame_named', bond: -6, drama: 3, burnout: 3, partnerMood: 'wounded' } },
          good: { text: '“I should’ve named this weeks ago instead of managing it,” you admit. “That’s on me.” {partner} deflates, still hurt. “…Yeah. It is.” Owned late is worse than owned early, better than never.', effects: { addFlag: 'li_fame_named', bond: -3, selfrespect: 3, storyBeat: 'Ignored the fame gap till it split open — then owned it, late, at the last fire.' } },
          incredible: { text: '“I’d burn the cover for the elbow,” you say, “and I mean it, and I should’ve said it in week three.” You take {partner}’s hand in front of the leak, the lawn, the lot. The nation crops the wrong one this time.', effects: { addFlag: 'li_fame_named', bond: -1, selfrespect: 3, romantics: 2, public: 2, storyBeat: 'The fame gap, buried and then faced at the finish — and the couple chose each other over the cover.' } },
        },
      },
      right: {
        label: 'Let it curdle, ride the fame',
        tags: ['camera', 'strategy'],
        governingStats: { charisma: 0.5, savvy: 0.5 },
        outcomes: {
          bad: { text: 'You post-rationalise the cover as “good for both of us, really” and {partner} stops arguing, which is worse than arguing. The elbow becomes a thing you don’t discuss. There are a few of those now.', effects: { bond: -7, burnout: 4, drama: 2, partnerMood: 'wounded' } },
          good: { text: 'You take the fame and let the gap sit, professionally. Your numbers climb; the daybed gets quieter. The inspector upgrades the file from “pending” to “structural.” Structures hold. Until.', effects: { bond: -5, burnout: 3, savvy: 5, followers: 3 } },
          incredible: { text: 'You ride it all the way to the cover shoot, radiant and solo and successful, and {partner} claps last, one beat behind, filing it where feelings keep receipts. A star is born. A couple is filed.', effects: { bond: -4, savvy: 7, followers: 5, public: 2, drama: 1 } },
        },
      },
    },
  },
];
