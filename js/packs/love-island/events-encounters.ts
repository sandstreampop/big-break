// Love Island — encounters (ADR-0005): short, character-scoped scenes built as
// branching chains of ordinary cards. Each beat is a normal left/right card;
// chainEventId differs per side and per tier, so the path you take through a
// scene depends on what you chose AND how it landed. Every encounter ends on a
// MOMENT that moves that character's state (ADR-0006) — opinion, mood, and
// sometimes a surfaced secret.
//
// Voice: dialogue-first (V2-DESIGN) — the beat leads with what characters SAY;
// the Narrator drops to stage directions. Taste per VOICE.md / taste.mjs.
//
// This file opens with the Act-1 Rival-established encounter — the v2 vertical
// slice (IMPLEMENTATION-PLAN V1). The wider encounter mass (Partner scenes,
// the Rival's Act-2 move, the bombshell second wave) joins it in Phase V3b.

import type { GameEvent } from '../../types.js';

export const ENCOUNTER_EVENTS: GameEvent[] = [

  // ---------- Act 1 · the Rival, established (the vertical slice) ----------
  // Beat 1 — delivered by the producers' beat window early in Arrival. The
  // season-long Rival (drawn at Season start) stops being a name and starts
  // being a person with an agenda.
  {
    id: 'li_enc_rival_1', act: 1, weight: 1, tags: ['beat:rivalenc', 'encounter', 'chat'],
    art: 'li_kitchen',
    context: 'Dusk · the kitchen counter · two glasses, one agenda',
    prompt: '“Right. You and me. Wee chat.” {rival} pours you a drink like it’s a contract signing. “Everyone’s being fake nice and it’s day two. I don’t do fake. So — what’s your actual plan here?” Behind the smile, an audit is running.',
    choices: {
      left: {
        label: 'Answer straight',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: '“Honestly? I just like {partner}.” — “Honestly,” {rival} repeats, tasting the word for cracks. Your glass gets topped up, which in this kitchen is a caution, not a kindness.', effects: { loyalty: 2, rivalOpinion: 3, burnout: 2, chainEventId: 'li_enc_rival_2_test' } },
          good: { text: '“I’m here for something real. Laugh if you want.” {rival} doesn’t laugh. “Huh,” they say, and you can hear you being recalibrated upward.', effects: { loyalty: 5, rivalOpinion: 6, chainEventId: 'li_enc_rival_2_open' } },
          incredible: { text: '“Same plan as yours. I’m just not lying about it.” A beat. Then {rival} grins — the first true face of the night. “Okay. You, I’ll watch.”', effects: { loyalty: 8, rivalOpinion: 8, public: 3, chainEventId: 'li_enc_rival_2_open' } },
        },
      },
      right: {
        label: 'Read them back',
        tags: ['strategy', 'banter'],
        governingStats: { savvy: 0.6, charisma: 0.4 },
        outcomes: {
          bad: { text: '“My plan? Watching yours.” It sounded cooler in your head. {rival} smiles at the counter and files you under <i>threat, small</i>.', effects: { savvy: 2, rivalOpinion: -3, burnout: 3, chainEventId: 'li_enc_rival_2_test' } },
          good: { text: '“You didn’t pour that for the chat. You poured it for the tell.” {rival} laughs once, on purpose. “Sharp. Annoying, but sharp.”', effects: { savvy: 5, rivalOpinion: 4, followers: 2, chainEventId: 'li_enc_rival_2_test' } },
          incredible: { text: '“Two glasses, one agenda. Ask the real question.” The kitchen goes quiet the way rooms do when a script gets skipped. Respect, at knifepoint.', effects: { savvy: 8, rivalOpinion: 6, public: 3, chainEventId: 'li_enc_rival_2_open' } },
        },
      },
    },
  },
  // Beat 2a — the guard drops a crack (reached by landing the chat).
  {
    id: 'li_enc_rival_2_open', act: 1, chainOnly: true, tags: ['encounter', 'chat'],
    art: 'li_terrace',
    context: 'Later · the swing seat · guard half down',
    prompt: '“Between us?” {rival} checks the garden for boom mics and misses two. “I didn’t come in here for a fairy tale. I came in with a plan, and it’s already going wrong.” A true thing, said out loud, sitting between you like a dropped key.',
    choices: {
      left: {
        label: 'Trade something real',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 0.7, charisma: 0.3 },
        outcomes: {
          bad: { text: 'You match their confession and overshoot by one childhood story. “Wow,” says {rival}, meaning <i>stop</i>. Still — a trade’s a trade, and they started it.', effects: { loyalty: 2, rivalOpinion: 3, burnout: 2, chainEventId: 'li_enc_rival_3_pact' } },
          good: { text: '“Me too, honestly. Different plan, same wobble.” {rival} nods slowly, promoting you from obstacle to person.', effects: { loyalty: 5, rivalOpinion: 6, chainEventId: 'li_enc_rival_3_pact' } },
          incredible: { text: 'You say the true thing you haven’t even told {partner} yet. {rival} holds it carefully, visibly surprised to be trusted. Day two, and the villa’s realest chat has no couple in it.', effects: { loyalty: 8, rivalOpinion: 9, public: 3, chainEventId: 'li_enc_rival_3_pact' } },
        },
      },
      right: {
        label: 'Keep your cards',
        tags: ['strategy'],
        governingStats: { savvy: 1 },
        outcomes: {
          bad: { text: '“Mm,” you say. “Mad.” The shutters come down on both sides at once. {rival} collects the glasses like evidence.', effects: { savvy: 2, rivalOpinion: -4, rivalMood: 'scheming', burnout: 2, chainEventId: 'li_enc_rival_3_war' } },
          good: { text: 'You hand back sympathy with no data in it. Textbook. {rival} clocks the technique and almost admires it. Almost.', effects: { savvy: 5, rivalOpinion: -2, chainEventId: 'li_enc_rival_3_war' } },
          incredible: { text: '“I hear you. I’m not your diary, though.” Brutal, clean, weirdly kind. {rival} respects it and resents it in the same face.', effects: { savvy: 8, rivalOpinion: 2, followers: 3, chainEventId: 'li_enc_rival_3_war' } },
        },
      },
    },
  },
  // Beat 2b — the public test (reached by fumbling, or by fencing well).
  {
    id: 'li_enc_rival_2_test', act: 1, chainOnly: true, tags: ['encounter', 'drama'],
    art: 'li_lawn',
    context: 'Next morning · the lawn · a test, disguised as banter',
    prompt: 'At breakfast, loudly: “Go on then — tell everyone the plan. The one you told me last night.” {rival} beams at you across the granola. The lawn turns. That’s not banter; that’s a live demonstration, and you’re the exhibit.',
    choices: {
      left: {
        label: 'Own it, louder',
        tags: ['camera', 'banter'],
        governingStats: { charisma: 1 },
        outcomes: {
          bad: { text: 'You attempt a bit. The bit dies on the grass in front of everyone. {rival} pats your shoulder like a coffin. “No, it was good.”', effects: { charisma: 2, rivalOpinion: -3, burnout: 3, chainEventId: 'li_enc_rival_3_war' } },
          good: { text: '“My plan is to outlast everyone who keeps talking about plans.” The lawn laughs. {rival} toasts you with somebody else’s juice.', effects: { charisma: 5, rivalOpinion: 4, public: 3, chainEventId: 'li_enc_rival_3_pact' } },
          incredible: { text: 'You stand up, take the invisible mic, and roast your own game so well the villa applauds. {rival} claps last and longest, doing arithmetic.', effects: { charisma: 8, public: 5, followers: 4, rivalOpinion: 5, chainEventId: 'li_enc_rival_3_pact' } },
        },
      },
      right: {
        label: 'Flip it back',
        tags: ['strategy', 'drama'],
        governingStats: { savvy: 1 },
        outcomes: {
          bad: { text: '“At least I’ve got one.” Too sharp, too early, too breakfast. The lawn does the group “ooh” and {rival} banks the clip.', effects: { savvy: 2, rivalOpinion: -5, rivalMood: 'fuming', burnout: 3, chainEventId: 'li_enc_rival_3_war' } },
          good: { text: '“Funny — you talk about my game a lot more than I play it.” {rival} touches their nose, once. First blood, yours.', effects: { savvy: 5, rivalOpinion: -2, followers: 3, chainEventId: 'li_enc_rival_3_war' } },
          incredible: { text: '“You’re auditioning me for villain. Get in line.” The lawn howls. {rival} laughs too — the only available exit — and files the whole scene under <i>later</i>.', effects: { savvy: 8, followers: 5, public: 3, rivalOpinion: -3, rivalMood: 'scheming', chainEventId: 'li_enc_rival_3_war' } },
        },
      },
    },
  },
  // Beat 3a — the pact (the MOMENT, warm branch).
  {
    id: 'li_enc_rival_3_pact', act: 1, chainOnly: true, tags: ['encounter', 'chat', 'strategy'],
    art: 'li_terrace',
    context: 'Sunset · the terrace · the terms',
    prompt: '“Look.” {rival} leans on the rail, an actual truce on the table. “I’m going to play this place like a fruit machine, and you’re going to be annoyingly sincere at it. We can stay out of each other’s way. Or not. Your call.”',
    choices: {
      left: {
        label: 'Shake on it',
        tags: ['chat', 'strategy'],
        governingStats: { savvy: 0.5, loyalty: 0.5 },
        outcomes: {
          bad: { text: 'You shake. {rival} holds the grip one beat too long, so the cameras get the frame. The deal is real; the photo op was the interest on it.', effects: { savvy: 2, rivalOpinion: 4, rivalMood: 'smug', burnout: 2 } },
          good: { text: '“Stay out of my couple, I stay out of your edit.” — “Deal.” The most honest contract this villa will see all Season, and no lawyer within a hundred miles.', effects: { savvy: 4, loyalty: 3, rivalOpinion: 8, rivalMood: 'smug' } },
          incredible: { text: '“One thing, since you’re decent—” and {rival}, guard fully down for four seconds, tells you something they absolutely should not have. The handshake becomes a vault.', effects: { savvy: 5, loyalty: 3, rivalOpinion: 10, rivalMood: 'buzzing', surfaceSecret: 'rival', public: 3 } },
        },
      },
      right: {
        label: 'No deals',
        tags: ['loyal', 'drama'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: '“I don’t do arrangements.” {rival}’s eyebrows say <i>noted</i>. Cold air moves in off the pool and decides to stay the week.', effects: { loyalty: 2, rivalOpinion: -6, rivalMood: 'scheming', addFlag: 'li_rival_active', burnout: 3 } },
          good: { text: '“Play whoever you want. Not me, and not {partner}.” A clean line, drawn in daylight, witnessed. {rival} nods: war, then — but a polite one.', effects: { loyalty: 5, rivalOpinion: -4, rivalMood: 'scheming', addFlag: 'li_rival_active', public: 3 } },
          incredible: { text: 'You decline the pact so cleanly the terrace briefly feels like a season finale. “Respect,” says {rival}, meaning <i>reloading</i>.', effects: { loyalty: 8, rivalOpinion: -5, rivalMood: 'fuming', addFlag: 'li_rival_active', public: 4, followers: 3 } },
        },
      },
    },
  },
  // Beat 3b — the line (the MOMENT, cold branch).
  {
    id: 'li_enc_rival_3_war', act: 1, chainOnly: true, tags: ['encounter', 'drama'],
    art: 'li_firepit_day',
    context: 'Night · the firepit, after hours · just you two and the embers',
    prompt: '“Let’s not pretend.” {rival} sits down uninvited, holding two marshmallows like a peace offering they intend to eat alone. “You don’t rate me. I don’t rate you. But there’s one {partner}-shaped thing we both rate. So.”',
    choices: {
      left: {
        label: 'De-escalate',
        tags: ['chat', 'loyal'],
        governingStats: { loyalty: 0.6, savvy: 0.4 },
        outcomes: {
          bad: { text: 'You offer peace and receive a smile with no signature on it. “Course,” says {rival}, already redrafting you in their head.', effects: { loyalty: 2, rivalOpinion: 2, rivalMood: 'scheming', burnout: 2 } },
          good: { text: '“We don’t have to like each other. Just don’t make it ugly.” — “Define ugly,” says {rival}, but they’re smiling, and half of it is real.', effects: { loyalty: 5, rivalOpinion: 5, public: 2 } },
          incredible: { text: '“Everyone in here is exhausting,” you both say, nearly in sync. The truce writes itself — and {rival}, warm for exactly four seconds, lets one true thing slip.', effects: { loyalty: 6, savvy: 3, rivalOpinion: 9, rivalMood: 'smug', surfaceSecret: 'rival' } },
        },
      },
      right: {
        label: 'Let them know you see them',
        tags: ['drama', 'strategy'],
        governingStats: { savvy: 0.7, charisma: 0.3 },
        outcomes: {
          bad: { text: '“I know exactly what you’re doing.” — “Good,” says {rival}, standing up. “Saves time.” The embers pop. That’s the starting gun.', effects: { savvy: 2, rivalOpinion: -7, rivalMood: 'fuming', addFlag: 'li_rival_active', burnout: 4 } },
          good: { text: '“Come near my couple and I go loud.” {rival} studies your face for a bluff, finds none, and files the threat under <i>credible</i>.', effects: { savvy: 5, rivalOpinion: -5, rivalMood: 'scheming', addFlag: 'li_rival_active', followers: 2 } },
          incredible: { text: 'You lay out their game, move by move, quietly, like a weather forecast. {rival} listens all the way through. “Well,” they say. “Someone watches the show.”', effects: { savvy: 8, rivalOpinion: -4, rivalMood: 'fuming', addFlag: 'li_rival_active', public: 3, followers: 3 } },
        },
      },
    },
  },
];
