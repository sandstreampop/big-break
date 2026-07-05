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
    prompt: 'Last night {partner} told you the real stuff — the sister, the fear, the reason for the guard. This morning: “anyway, mad one last night, weren’t it,” and the shutters are DOWN, trading closed, do not reply to this email. The inspector behind your ribs circles a word: whiplash.',
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
    prompt: '“So.” {partner} sits down with two drinks and the face of someone who has been thinking since yesterday. “The thing you said. I hated it. And you’re right.” Both can be true. In here, both usually are. The daybed waits to see what you build with it.',
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
];
