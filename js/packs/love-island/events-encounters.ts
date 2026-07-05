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
          good: { text: '“I’m here for something real. Laugh if you want.” {rival} doesn’t laugh. “Huh,” they say, and you can hear you being recalibrated upward.', effects: { loyalty: 3, rivalOpinion: 6, chainEventId: 'li_enc_rival_2_open' } },
          incredible: { text: '“Same plan as yours. I’m just not lying about it.” A beat. Then {rival} grins — the first true face of the night. “Okay. You, I’ll watch.”', effects: { loyalty: 5, rivalOpinion: 8, public: 3, chainEventId: 'li_enc_rival_2_open' } },
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
          good: { text: '“Me too, honestly. Different plan, same wobble.” {rival} nods slowly, promoting you from obstacle to person.', effects: { loyalty: 3, rivalOpinion: 6, chainEventId: 'li_enc_rival_3_pact' } },
          incredible: { text: 'You say the true thing you haven’t even told {partner} yet. {rival} holds it carefully, visibly surprised to be trusted. Day two, and the villa’s realest chat has no couple in it.', effects: { loyalty: 5, rivalOpinion: 9, public: 3, chainEventId: 'li_enc_rival_3_pact' } },
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
          good: { text: '“Stay out of my couple, I stay out of your edit.” — “Deal.” The most honest contract this villa will see all Season, and no lawyer within a hundred miles.', effects: { savvy: 4, loyalty: 3, rivalOpinion: 8, rivalMood: 'smug', gainIntel: { about: 'rival', label: 'the game they told you they’re running' } } },
          incredible: { text: '“One thing, since you’re decent—” and {rival}, guard fully down for four seconds, tells you something they absolutely should not have. The handshake becomes a vault.', effects: { savvy: 5, loyalty: 3, rivalOpinion: 10, rivalMood: 'buzzing', surfaceSecret: 'rival', public: 3 } },
        },
      },
      right: {
        label: 'No deals',
        tags: ['loyal', 'drama'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: '“I don’t do arrangements.” {rival}’s eyebrows say <i>noted</i>. Cold air moves in off the pool and decides to stay the week.', effects: { loyalty: 2, rivalOpinion: -6, rivalMood: 'scheming', addFlag: 'li_rival_active', burnout: 3 } },
          good: { text: '“Play whoever you want. Not me, and not {partner}.” A clean line, drawn in daylight, witnessed. {rival} nods: war, then — but a polite one.', effects: { loyalty: 3, rivalOpinion: -4, rivalMood: 'scheming', addFlag: 'li_rival_active', public: 3 } },
          incredible: { text: 'You decline the pact so cleanly the terrace briefly feels like a season finale. “Respect,” says {rival}, meaning <i>reloading</i>.', effects: { loyalty: 5, rivalOpinion: -5, rivalMood: 'fuming', addFlag: 'li_rival_active', public: 4, followers: 3 } },
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
          good: { text: '“We don’t have to like each other. Just don’t make it ugly.” — “Define ugly,” says {rival}, but they’re smiling, and half of it is real.', effects: { loyalty: 3, rivalOpinion: 5, public: 2 } },
          incredible: { text: '“Everyone in here is exhausting,” you both say, nearly in sync. The truce writes itself — and {rival}, warm for exactly four seconds, lets one true thing slip.', effects: { loyalty: 4, savvy: 3, rivalOpinion: 9, rivalMood: 'smug', surfaceSecret: 'rival' } },
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

  // ---------- Act 1 · the Partner, actually met (3 beats, ambient-triggered) ----------
  // ---------- Cross-season memory entries (R9/C4b) ----------
  // Returning faces open differently. History-gated (run.history — never in
  // seeded sims); weight outranks the standard openers in the beat window.
  {
    id: 'li_enc_partner_1_again', act: 1, weight: 60, tags: ['beat:partnerenc1', 'encounter', 'chat', 'date'],
    art: 'li_pool',
    requires: { singleIs: false, partnerAgainIs: true },
    context: 'Mid-morning · the swing seat · you’ve sat here before',
    prompt: '“So.” {partner} hands you a tea — your order, unasked, remembered from a different summer. “Take two. Same swing, same us. Are we smarter now, or just tanner?” Somewhere in the gallery, an editor reaches for the flashback reel.',
    choices: {
      left: {
        label: 'Smarter. Prove it',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 0.6, rizz: 0.4 },
        outcomes: {
          bad: { text: '“Smarter,” you say — as the exact same argument you had last Season pulls up a chair. Rerun energy. At least you both know your lines.', effects: { loyalty: 2, bond: 4, burnout: 2, chainEventId: 'li_enc_partner_2_real' } },
          good: { text: '“We know where the potholes are this time.” {partner} clinks your mug. Same road. Better driving.', effects: { loyalty: 3, bond: 6, chainEventId: 'li_enc_partner_2_real' } },
          incredible: { text: 'Somewhere in minute ten you both stop performing the reunion and just have it. Two summers of history compress into one very quiet, very solid thing.', effects: { loyalty: 5, bond: 8, public: 3, chainEventId: 'li_enc_partner_2_real' } },
        },
      },
      right: {
        label: 'Just tanner',
        tags: ['flirt', 'banter'],
        governingStats: { rizz: 0.6, charisma: 0.4 },
        outcomes: {
          bad: { text: '“Tanner. Definitely tanner.” The joke holds for one drink, and then the history shows up anyway — uninvited, with opinions.', effects: { rizz: 2, bond: 2, partnerMood: 'torn', burnout: 2, chainEventId: 'li_enc_partner_2_show' } },
          good: { text: 'You keep it light and let the past sit in the sun with you, unbothered. Some sequels don’t need a recap. The nation does one anyway.', effects: { rizz: 5, followers: 3, bond: 3, chainEventId: 'li_enc_partner_2_show' } },
          incredible: { text: '“New rule: no lore.” — “No lore,” {partner} agrees, delighted. You spend the day inventing brand-new mistakes instead. The fan account changes its bio to SEASON TWO.', effects: { rizz: 8, followers: 5, bond: 3, public: 3, chainEventId: 'li_enc_partner_2_show' } },
        },
      },
    },
  },
  {
    id: 'li_enc_rival_1_again', act: 1, weight: 60, tags: ['beat:rivalenc', 'encounter', 'chat'],
    art: 'li_kitchen',
    requires: { rivalAgainIs: true },
    context: 'Dusk · the kitchen · an old opponent pours two coffees',
    prompt: '“Well, well.” {rival} slides a coffee across like a rematch contract. “The band’s back together. I still owe you for last Season, and I genuinely can’t remember which kind of owe.” Neither can you. That’s the fun bit.',
    choices: {
      left: {
        label: 'Old wars stay buried',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: '“Clean slate?” — “Clean-ish,” says {rival}, which from them is a peace treaty with a footnote. You drink to the footnote.', effects: { loyalty: 2, rivalOpinion: 4, burnout: 2, chainEventId: 'li_enc_rival_2_test' } },
          good: { text: '“Whatever it was — we’re even.” {rival} considers the ledger, then closes it. “Even,” they agree. Two veterans, one kitchen, zero appetite for reruns.', effects: { loyalty: 3, rivalOpinion: 7, chainEventId: 'li_enc_rival_2_open' } },
          incredible: { text: 'You toast to last Season’s casualties — both your dignities — and something in the old rivalry quietly retires. What replaces it is almost, appallingly, respect.', effects: { loyalty: 5, rivalOpinion: 9, public: 3, chainEventId: 'li_enc_rival_2_open' } },
        },
      },
      right: {
        label: 'Settle the score',
        tags: ['strategy', 'drama'],
        governingStats: { savvy: 0.7, charisma: 0.3 },
        outcomes: {
          bad: { text: '“Oh, I remember which kind of owe.” The coffee goes cold between you. Rematch: on, and this time the villa has archive footage.', effects: { savvy: 2, rivalOpinion: -5, rivalMood: 'scheming', addFlag: 'li_rival_active', burnout: 3, chainEventId: 'li_enc_rival_2_test' } },
          good: { text: '“Best of three, then.” {rival} actually laughs. The feud renews itself on friendlier terms — a derby now, not a war.', effects: { savvy: 4, rivalOpinion: -2, followers: 3, chainEventId: 'li_enc_rival_2_test' } },
          incredible: { text: 'You lay out exactly what you’ll do differently this time, to their face, over coffee. {rival} listens like a scout. “Finally,” they say. “A worthy season.”', effects: { savvy: 6, rivalOpinion: -3, followers: 5, public: 3, addFlag: 'li_rival_active', chainEventId: 'li_enc_rival_2_test' } },
        },
      },
    },
  },

  // ---------- The Bestie arc (R7/D2): the show's secret spine ----------
  // Same-gender ride-or-die, formed post-Casa. Two lanes: the friendship
  // (loyalty, relief, a witness) or the alliance (savvy, the third intel
  // channel). Both end seated — the villa is survivable with a mate.
  {
    id: 'li_enc_bestie_1', act: 2, weight: 1, tags: ['beat:bestieenc', 'encounter', 'chat', 'code'],
    art: 'li_kitchen',
    context: 'The kitchen · 1 a.m. · two spoons, one tub',
    prompt: '“Right.” {mate} appears with a tub of ice cream and two spoons, which in villa law is a summons. “Everyone in here is performing except possibly you. Don’t make me regret this tub. What’s actually going on with you?”',
    choices: {
      left: {
        label: 'Actually tell them',
        tags: ['loyal', 'chat', 'code'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: 'You get four sentences in before the tears arrive — yours, embarrassingly. {mate} doesn’t flinch, just hands you the tub. “Keep going.” You do. It airs. You don’t care.', effects: { loyalty: 3, burnout: -4, addFlag: 'li_code_honour', chainEventId: 'li_enc_bestie_2_ride' } },
          good: { text: '“Finally,” says {mate}, around a spoon. You talk until the spoons stand up on their own. Somewhere in there it stops being telly and starts being a friendship.', effects: { loyalty: 3, burnout: -5, addFlag: 'li_code_honour', chainEventId: 'li_enc_bestie_2_ride' } },
          incredible: { text: 'You tell them the whole unedited thing — and get the whole unedited thing back. By 2 a.m. you have what nobody else in here has: a witness.', effects: { loyalty: 5, burnout: -6, public: 2, addFlag: 'li_code_honour', chainEventId: 'li_enc_bestie_2_ride' } },
        },
      },
      right: {
        label: 'Keep it tactical',
        tags: ['strategy', 'chat'],
        governingStats: { savvy: 1 },
        outcomes: {
          bad: { text: 'You give them the media-trained version and {mate} clocks it instantly. “Okay,” they say, in the tone of a door not quite closing. The tub goes back half-full.', effects: { savvy: 2, burnout: 2, chainEventId: 'li_enc_bestie_2_pact' } },
          good: { text: '“Fine — trade.” You swap reads on the villa instead of feelings, which is its own intimacy. {mate}’s reads are excellent. Noted. Filed.', effects: { savvy: 4, chainEventId: 'li_enc_bestie_2_pact' } },
          incredible: { text: 'Ten minutes in, you two have mapped the entire villa: who’s wobbling, who’s performing, who’s next. It isn’t a friendship yet. It’s better-informed than one.', effects: { savvy: 6, public: 2, chainEventId: 'li_enc_bestie_2_pact' } },
        },
      },
    },
  },
  {
    id: 'li_enc_bestie_2_ride', act: 2, chainOnly: true, tags: ['encounter', 'chat', 'code'],
    art: 'li_daybed',
    context: 'Next morning · the daybed · a two-person institution',
    prompt: '“Ground rules.” {mate} holds out a croissant like a gavel. “Whatever happens — recouplings, bombshells, all of it — we don’t let this place make us strangers. Deal?” Behind them, the villa glitters with people who will absolutely test that.',
    choices: {
      left: {
        label: 'Deal. No strangers',
        tags: ['loyal', 'code'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: 'You shake on it with croissant grease, which {mate} declares “binding.” Within the hour the villa tests the treaty with a rumour. It holds. Barely — but it holds.', effects: { loyalty: 3, addFlag: 'li_bestie', gainIntel: { about: 'rival', label: 'what the daybed heard this morning' } } },
          good: { text: '“Deal.” The least dramatic pact in villa history, and the only one that will survive the Season. {mate} proves it immediately: what {rival} said at breakfast, verbatim.', effects: { loyalty: 4, addFlag: 'li_bestie', gainIntel: { about: 'rival', label: 'what they said at breakfast' } } },
          incredible: { text: 'The pact upgrades on the spot: {mate} has been keeping receipts all week — on everyone — and you are now the second person to see the ledger. Beautiful. Terrifying. Yours.', effects: { loyalty: 5, public: 2, addFlag: 'li_bestie', gainIntel: { about: 'rival', label: 'the ledger: everything, dated' } } },
        },
      },
      right: {
        label: 'Add a clause for the vote',
        tags: ['strategy', 'code'],
        governingStats: { savvy: 1 },
        outcomes: {
          bad: { text: '“…and if it comes to a vote?” {mate} looks at you like you’ve brought a spreadsheet to a christening. The pact survives. The romance of it doesn’t, entirely.', effects: { savvy: 2, burnout: 2, addFlag: 'li_bestie' } },
          good: { text: '“If it’s ever us two on the block, we campaign together.” {mate} grins: “Obviously.” A friendship with a manifesto. Very this show.', effects: { savvy: 4, public: 2, addFlag: 'li_bestie' } },
          incredible: { text: 'By noon you’ve quietly counted the villa’s votes twice over, together, as a hobby. The firepit doesn’t know it yet, but a bloc was just born.', effects: { savvy: 6, public: 3, addFlag: 'li_bestie' } },
        },
      },
    },
  },
  {
    id: 'li_enc_bestie_2_pact', act: 2, chainOnly: true, tags: ['encounter', 'strategy'],
    art: 'li_daybed',
    context: 'Next morning · the sun loungers · the debrief',
    prompt: '“Item one.” {mate} doesn’t look up from cleaning their sunglasses. “{rival} did a lap of the boys before breakfast. Item two: somebody cried in the Hut before nine. Item three—” A pause. “You get all this free. First month.”',
    choices: {
      left: {
        label: 'Make it official — allies',
        tags: ['strategy'],
        governingStats: { savvy: 1 },
        outcomes: {
          bad: { text: '“Allies, then.” {mate} nods — and immediately tests you with a small secret. You hold it for a whole day. Just. The probation period continues.', effects: { savvy: 2, burnout: 2, addFlag: 'li_bestie' } },
          good: { text: 'You shake on the least romantic and most durable arrangement in the villa. The first dividend arrives by lunch: what {rival} is planning for the recoupling.', effects: { savvy: 4, addFlag: 'li_bestie', gainIntel: { about: 'rival', label: 'their recoupling plan' } } },
          incredible: { text: 'The alliance is so efficient it frightens you both. Within a day you know everything that moves in this villa — and, better, what’s about to.', effects: { savvy: 6, public: 2, addFlag: 'li_bestie', gainIntel: { about: 'rival', label: 'what moves next, before it moves' } } },
        },
      },
      right: {
        label: 'Keep it warm instead',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: '“Or we could just… be mates?” {mate} blinks. Recalculates. “Huh. Yeah, okay.” The intel flow stops. Something better starts — slowly, like all their things.', effects: { loyalty: 3, burnout: -2, addFlag: 'li_bestie' } },
          good: { text: 'You steer it from tactics to actual talk, and {mate} lets you. The debrief becomes a breakfast. The breakfast becomes a standing thing.', effects: { loyalty: 4, burnout: -3, addFlag: 'li_bestie' } },
          incredible: { text: '“You’re the only one in here I’m not tired of.” From {mate}, that’s a wedding toast. The villa now contains one couple nobody can dump: you two.', effects: { loyalty: 5, burnout: -4, public: 3, addFlag: 'li_bestie' } },
        },
      },
    },
  },

  // The partner arc opener, in three SHAPES (R7/D1): the same beat window,
  // three different people to be coupled with. Effects and chains match the
  // v2 opener per branch/tier — the shape changes the scene, not the math.
  {
    id: 'li_enc_partner_1_sweet', act: 1, weight: 1, tags: ['beat:partnerenc1', 'encounter', 'chat', 'date'],
    art: 'li_pool',
    requires: { singleIs: false, partnerShapeIs: 'sweetheart' },
    context: 'Mid-morning · the swing seat · the announcement',
    prompt: '“Right, I’m just going to say it—” {partner} has brought you a tea and a speech, in that order. “I like you. Properly. That’s it. That’s the announcement.” The swing creaks. Somewhere in the gallery a producer whispers <i>stay on them</i>.',
    choices: {
      left: {
        label: 'Say it back',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 0.6, rizz: 0.4 },
        outcomes: {
          bad: { text: 'You say it back one beat too slow — long enough for {partner} to hear the maths. “You had to THINK,” they say, delighted and wounded in exactly equal parts.', effects: { loyalty: 2, bond: 3, burnout: 2, chainEventId: 'li_enc_partner_2_real' } },
          good: { text: '“Same,” you say, and mean it, and {partner} does a small lap of honour around the swing seat. Subtlety left the villa an hour ago. Nobody misses it.', effects: { loyalty: 3, bond: 5, chainEventId: 'li_enc_partner_2_real' } },
          incredible: { text: 'You say it back plainly — no bit, no hedge. {partner} goes still, the rare kind. “Okay,” they say, mostly to themselves. “Okay.” The nation has a fan account up by lunch.', effects: { loyalty: 5, bond: 7, public: 3, chainEventId: 'li_enc_partner_2_real' } },
        },
      },
      right: {
        label: 'Pump the brakes, kindly',
        tags: ['flirt', 'banter'],
        governingStats: { rizz: 0.6, charisma: 0.4 },
        outcomes: {
          bad: { text: '“Let’s not label it,” you say, to a person holding a tea with your initials drawn in the foam. The foam survives. Something else doesn’t, quite.', effects: { rizz: 2, bond: 1, partnerMood: 'torn', burnout: 2, chainEventId: 'li_enc_partner_2_show' } },
          good: { text: '“We’ve got weeks,” you say, gently. {partner} nods like a good sport and quietly weather-proofs their heart. Sensible. Filmed.', effects: { rizz: 5, followers: 3, bond: 2, chainEventId: 'li_enc_partner_2_show' } },
          incredible: { text: 'You turn the brakes into a bit — “I’m a slow cooker, babe” — and {partner} laughs for real and eases off without a bruise. The kindest not-yet ever aired.', effects: { rizz: 8, followers: 5, public: 3, bond: 2, chainEventId: 'li_enc_partner_2_show' } },
        },
      },
    },
  },
  {
    id: 'li_enc_partner_1_game', act: 1, weight: 1, tags: ['beat:partnerenc1', 'encounter', 'chat', 'date'],
    art: 'li_pool',
    requires: { singleIs: false, partnerShapeIs: 'gameplayer' },
    context: 'Mid-morning · the swing seat · the interview',
    prompt: '“Honest question.” {partner} deals it like a card, eyes on the pool. “What are you actually here for? I’ve seen every season of this show. I know a strategy when I couple up with one.” A beat. “No offence.”',
    choices: {
      left: {
        label: 'Answer it straight',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 0.6, rizz: 0.4 },
        outcomes: {
          bad: { text: 'You answer honestly and watch it get received as a MOVE. “Good line,” says {partner}, approving. Sincerity, filed under tactics. In fairness — their filing system.', effects: { loyalty: 2, bond: 3, burnout: 2, chainEventId: 'li_enc_partner_2_real' } },
          good: { text: '“I’m here for whatever this is.” {partner} studies you for a long second, then deals the next card face up. Progress, by their rules.', effects: { loyalty: 3, bond: 5, chainEventId: 'li_enc_partner_2_real' } },
          incredible: { text: 'Your answer is so plainly unstrategic that {partner}’s whole game stalls on it. “Huh,” they say — the exact sound of a spreadsheet catching feelings.', effects: { loyalty: 5, bond: 7, public: 3, chainEventId: 'li_enc_partner_2_real' } },
        },
      },
      right: {
        label: 'Answer with a question',
        tags: ['flirt', 'banter'],
        governingStats: { rizz: 0.6, charisma: 0.4 },
        outcomes: {
          bad: { text: '“What are YOU here for?” — “Asked first.” The stalemate runs to lunch and airs as chemistry. It was poker.', effects: { rizz: 2, bond: 1, partnerMood: 'torn', burnout: 2, chainEventId: 'li_enc_partner_2_show' } },
          good: { text: 'You volley for ten minutes, neither of you conceding one fact. {partner} is delighted. The Beach Hut files it as “the chess episode.”', effects: { rizz: 5, followers: 3, bond: 2, chainEventId: 'li_enc_partner_2_show' } },
          incredible: { text: 'You bluff so well {partner} stands up and applauds, then re-ranks you two brackets. “Finally,” they say. “An opponent.” From them, it’s a love letter.', effects: { rizz: 8, followers: 5, public: 3, bond: 2, chainEventId: 'li_enc_partner_2_show' } },
        },
      },
    },
  },
  {
    id: 'li_enc_partner_1_slow', act: 1, weight: 1, tags: ['beat:partnerenc1', 'encounter', 'chat', 'date'],
    art: 'li_pool',
    requires: { singleIs: false, partnerShapeIs: 'slowburner' },
    context: 'Mid-morning · the swing seat · the almost-sentence',
    prompt: 'Twenty minutes of comfortable pool noise. Then, quietly, not looking over: “I don’t really do the talking thing on telly,” says {partner}. “But if you wanted to sit here a while. That’d be. Yeah.” The sentence never lands. The invitation does.',
    choices: {
      left: {
        label: 'Sit in it with them',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 0.6, rizz: 0.4 },
        outcomes: {
          bad: { text: 'You sit so long, so respectfully silent, that {partner} eventually checks you’re awake. You were. Mostly. The intent airs, at least.', effects: { loyalty: 2, bond: 3, burnout: 2, chainEventId: 'li_enc_partner_2_real' } },
          good: { text: 'You match their pace — one question, lots of pool noise. Somewhere in minute forty {partner}’s shoulder arrives against yours. Enormous, by their scale.', effects: { loyalty: 3, bond: 5, chainEventId: 'li_enc_partner_2_real' } },
          incredible: { text: 'You say nothing until they do — and then it all comes out in one unrehearsed run: home, the fear, the reason they came. The pool noise covers it for everyone but you.', effects: { loyalty: 5, bond: 7, public: 3, chainEventId: 'li_enc_partner_2_real' } },
        },
      },
      right: {
        label: 'Coax them out',
        tags: ['flirt', 'banter'],
        governingStats: { rizz: 0.6, charisma: 0.4 },
        outcomes: {
          bad: { text: 'You fill the silence with charm and watch {partner} retreat into it, politely, like a tide. Lovely performance. Empty beach.', effects: { rizz: 2, bond: 1, partnerMood: 'torn', burnout: 2, chainEventId: 'li_enc_partner_2_show' } },
          good: { text: 'You tease exactly one story out of them — the dog, obviously — and quit while you’re ahead. {partner} notices the quitting-while-ahead. Points for that.', effects: { rizz: 5, followers: 3, bond: 2, chainEventId: 'li_enc_partner_2_show' } },
          incredible: { text: 'You do the talking for two, and by sundown it’s a double act — them on dry one-liners, you on everything else. The edit cannot believe its luck.', effects: { rizz: 8, followers: 5, public: 3, bond: 2, chainEventId: 'li_enc_partner_2_show' } },
        },
      },
    },
  },
  {
    id: 'li_enc_partner_2_real', act: 1, chainOnly: true, tags: ['encounter', 'chat'],
    art: 'li_kitchen',
    context: 'That night · two teas · the follow-up questions',
    prompt: '“Right, follow-up round.” {partner} slides you a tea made exactly wrong, first attempt, noted for correction. “The thing you said earlier. Does anyone out there know that about you?” Out there. The words do a little weather.',
    choices: {
      left: {
        label: 'Let them all the way in',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: 'You answer honestly for six unbroken minutes. {partner} holds the eye contact like a champion. The tea goes cold in service of the cause.', effects: { loyalty: 2, bond: 4, burnout: 2, chainEventId: 'li_enc_partner_3close' } },
          good: { text: '“No,” you say. “You’re the first.” {partner} looks at the tea, then at you, and reorganises their whole game around that sentence.', effects: { loyalty: 3, bond: 6, partnerMood: 'buzzing', chainEventId: 'li_enc_partner_3close' } },
          incredible: { text: 'A follow-up question becomes the villa’s first 2 a.m. kitchen conversation with no agenda at all. The night camera films two people forgetting it exists.', effects: { loyalty: 5, bond: 8, partnerMood: 'buzzing', public: 3, chainEventId: 'li_enc_partner_3close' } },
        },
      },
      right: {
        label: 'Trade a question back',
        tags: ['strategy', 'chat'],
        governingStats: { savvy: 0.6, rizz: 0.4 },
        outcomes: {
          bad: { text: '“What about you, then?” lands more deposition than curiosity. {partner} answers carefully, both of you now negotiators in swimwear.', effects: { savvy: 2, bond: 2, burnout: 2, chainEventId: 'li_enc_partner_3close' } },
          good: { text: 'You flip it, and {partner} takes the invitation at a run — the story about the nan, the fear about the outside. You’re learning the manual. Lovely, and useful.', effects: { savvy: 5, bond: 4, gainIntel: { about: 'partner', label: 'the thing they fear about the outside' }, chainEventId: 'li_enc_partner_3close' } },
          incredible: { text: 'The question you ask is so exactly right that {partner} stops mid-sip. “Nobody’s asked me that. Ever.” The answer runs long. You remember all of it.', effects: { savvy: 8, bond: 6, gainIntel: { about: 'partner', label: 'the answer nobody else has heard' }, chainEventId: 'li_enc_partner_3close' } },
        },
      },
    },
  },
  {
    id: 'li_enc_partner_2_show', act: 1, chainOnly: true, tags: ['encounter', 'camera'],
    art: 'li_lawn',
    context: 'Afternoon · the lawn · your couple, performing well',
    prompt: '“We’re good at this,” {partner} murmurs mid-photogenic-laugh, eyes bright and unreadable. “The couple thing. Everyone thinks so.” A beat. “Is it a thing, though? For you?” Delivered smiling, straight down the middle of the bit.',
    choices: {
      left: {
        label: 'Drop the act, live',
        tags: ['loyal', 'drama'],
        governingStats: { loyalty: 0.7, charisma: 0.3 },
        outcomes: {
          bad: { text: '“It’s a thing. For me. Is that— it’s a thing.” Eloquence: gone. Sincerity: unmissable. {partner} blinks at the sudden weather change and takes your hand anyway.', effects: { loyalty: 2, bond: 4, burnout: 3, chainEventId: 'li_enc_partner_3close' } },
          good: { text: 'You answer the real question under the smiling one, plainly, mid-lawn. The performance stops. Something unperformed starts.', effects: { loyalty: 3, bond: 6, partnerMood: 'buzzing', chainEventId: 'li_enc_partner_3close' } },
          incredible: { text: 'You say it so simply the boom operator forgets to breathe. {partner}’s stage face comes off like sunglasses. The villa watches your couple become a couple.', effects: { loyalty: 5, bond: 8, public: 4, partnerMood: 'buzzing', chainEventId: 'li_enc_partner_3close' } },
        },
      },
      right: {
        label: 'Keep the show running',
        tags: ['camera', 'strategy'],
        governingStats: { charisma: 0.6, savvy: 0.4 },
        outcomes: {
          bad: { text: '“Course it’s a thing. We’re the thing.” The line’s fine. The pause before it wasn’t. {partner} nods at the show going on, and does some quiet arithmetic.', effects: { charisma: 2, followers: 3, bond: -2, partnerMood: 'torn', burnout: 2, chainEventId: 'li_enc_partner_3close' } },
          good: { text: 'You keep it light and let the couple stay a very good show. {partner} matches you beat for beat. Two professionals. The nation loves professionals. Loves. Doesn’t vote for.', effects: { charisma: 5, followers: 5, public: 2, chainEventId: 'li_enc_partner_3close' } },
          incredible: { text: 'You perform the couple so well that even you briefly believe it — and there, mid-bit, is a flicker of the actual thing, unscripted, alarming, filed by both of you.', effects: { charisma: 8, followers: 7, bond: 3, public: 3, chainEventId: 'li_enc_partner_3close' } },
        },
      },
    },
  },
  {
    id: 'li_enc_partner_3close', act: 1, chainOnly: true, tags: ['encounter', 'date'],
    art: 'li_bedroom',
    context: 'Lights out · the whispered inventory',
    prompt: 'The room breathes around you. “Honest answer,” whispers {partner}, one duvet-width away. “Day one, would you have picked me? Off the line-up, no context.” The moment arrives quietly, at whisper volume, the way the real ones do.',
    choices: {
      left: {
        label: 'The honest answer',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: 'The honest answer is “no,” and you say it, and then you explain it beautifully — a beat too late. The dark holds two people recalculating. Honesty banks slow interest.', effects: { loyalty: 3, bond: 2, partnerMood: 'torn', burnout: 3 } },
          good: { text: '“No. And thank god, because I’d have picked wrong.” The silence after is warm, not cold. {partner} exhales a laugh into the pillow. Vault: opened, jointly.', effects: { loyalty: 3, bond: 7, partnerMood: 'buzzing' } },
          incredible: { text: 'Your answer is true, specific, and better than a yes. {partner} is quiet a long moment, then: “Right. You’re a problem.” Said like a promotion. The couple is now load-bearing.', effects: { loyalty: 5, bond: 9, partnerMood: 'buzzing', public: 3 } },
        },
      },
      right: {
        label: 'The charming answer',
        tags: ['flirt', 'banter'],
        governingStats: { rizz: 1 },
        outcomes: {
          bad: { text: '“Obviously. Look at you.” The compliment lands; the dodge underneath it lands harder. “Mm,” says {partner}, a full sentence, and turns over.', effects: { rizz: 2, bond: 1, partnerMood: 'torn', burnout: 2 } },
          good: { text: 'You answer with a line so good it gets a real laugh at midnight volume. Not the truth, exactly — but the delivery says enough of it.', effects: { rizz: 5, bond: 4, followers: 2 } },
          incredible: { text: 'The line is perfect, and then — fatal — you ruin it with the true bit, quietly, right after. “Knew it,” whispers {partner}, delighted, holding the evidence.', effects: { rizz: 8, bond: 7, partnerMood: 'buzzing', followers: 3 } },
        },
      },
    },
  },

  // ---------- Act 2 · the Rival makes their move (beat window, two variants) ----------
  // War footing (or a cold read): the poach, in the open.
  {
    id: 'li_enc_rmove_poach', act: 2, weight: 1, tags: ['beat:rivalmove', 'encounter', 'drama'],
    art: 'li_lawn',
    requires: { singleIs: false, anyOf: [{ flagsAll: ['li_rival_active'] }, { opinionBelow: 'rival:cool' }] },
    context: 'Midday · the poach · in broad, deliberate daylight',
    prompt: '“Borrowing this one!” {rival} announces, already steering {partner} towards the daybed by the elbow, sunniest voice on the island. To the villa: banter. To you, over the shoulder, one look: <i>your move</i>.',
    choices: {
      left: {
        label: 'Walk over, smiling',
        tags: ['drama', 'flirt'],
        governingStats: { rizz: 0.5, charisma: 0.5 },
        outcomes: {
          bad: { text: 'You arrive with a grin that needs recasting and a “room for one more?” that dies on the grass. {rival} makes space with theatrical delight. Round one: theirs.', effects: { rizz: 2, bond: -2, burnout: 4, rivalMood: 'smug', chainEventId: 'li_enc_rmove_show' } },
          good: { text: 'You stroll over, sit down mid-anecdote, and quietly become its best audience. The poach dies of an oxygen shortage. {partner}’s hand finds yours on the way up.', effects: { rizz: 5, bond: 4, rivalOpinion: -3, chainEventId: 'li_enc_rmove_show' } },
          incredible: { text: 'You join the chat so warmly you hijack it — in two minutes {rival} is somehow third wheel at their own poach. The daybed applauds internally. The clip runs for days.', effects: { rizz: 8, bond: 5, public: 4, followers: 4, rivalMood: 'fuming', chainEventId: 'li_enc_rmove_show' } },
        },
      },
      right: {
        label: 'Let it play out',
        tags: ['strategy', 'rest'],
        governingStats: { savvy: 0.7, loyalty: 0.3 },
        outcomes: {
          bad: { text: 'You give it space, and space is what a graft runs on. Forty minutes of it airs in real time while you assassinate a smoothie. {partner} comes back. Eventually.', effects: { savvy: 2, bond: -3, burnout: 5, rivalMood: 'smug', chainEventId: 'li_enc_rmove_show' } },
          good: { text: 'You clock it, rate it — decent technique, rushed timing — and let {partner} handle their own daybed. They do. The trust airs better than any intervention could.', effects: { savvy: 5, bond: 3, loyalty: 3, chainEventId: 'li_enc_rmove_show' } },
          incredible: { text: 'You watch the whole attempt like a scout at a trial match, visibly unbothered. {partner} extracts themselves inside five minutes and reports the entire script back to you. Verbatim.', effects: { savvy: 8, bond: 5, gainIntel: { about: 'rival', label: 'their whole poaching script, reported back' }, chainEventId: 'li_enc_rmove_show' } },
        },
      },
    },
  },
  // Pact footing: the rumour with familiar fingerprints.
  {
    id: 'li_enc_rmove_rumour', act: 2, weight: 1, tags: ['beat:rivalmove', 'encounter', 'strategy'],
    art: 'li_bedroom',
    requires: { opinionAtLeast: 'rival:cool', flagsNone: ['li_rival_active'] },
    context: 'Morning · a rumour in circulation · familiar fingerprints',
    prompt: 'By breakfast it’s everywhere: your couple is “tactical.” The word is too clean, too placed — a professional’s rumour. And there’s exactly one professional in here who knows your game well enough to price it. The pact, it seems, has small print.',
    choices: {
      left: {
        label: 'Trace it quietly',
        tags: ['strategy'],
        governingStats: { savvy: 1 },
        outcomes: {
          bad: { text: 'You interview the villa one tea at a time and the rumour hears you coming. By noon there’s a rumour about you investigating the rumour. It does better numbers.', effects: { savvy: 2, burnout: 4, followers: 2, chainEventId: 'li_enc_rmove_confront' } },
          good: { text: 'Three retellings, one common source, familiar phrasing. You don’t confront anyone — you just collect. Evidence is a currency that appreciates.', effects: { savvy: 5, gainIntel: { about: 'rival', label: 'the rumour traces back to them' }, chainEventId: 'li_enc_rmove_confront' } },
          incredible: { text: 'You map the rumour’s whole supply chain by lunch — courier, embellisher, author. The author is who you thought. You file it, smile at them at dinner, and say nothing. Yet.', effects: { savvy: 8, public: 3, gainIntel: { about: 'rival', label: 'proof they authored the rumour' }, chainEventId: 'li_enc_rmove_confront' } },
        },
      },
      right: {
        label: 'Go straight to {rival}',
        tags: ['drama', 'chat'],
        governingStats: { charisma: 0.5, loyalty: 0.5 },
        outcomes: {
          bad: { text: '“Did you start it?” — “Did you just accuse me?” In four sentences the pact is on fire and you’re holding the matches in front of witnesses.', effects: { charisma: 2, rivalOpinion: -6, rivalMood: 'fuming', burnout: 4, chainEventId: 'li_enc_rmove_confront' } },
          good: { text: '“Heard a rumour. Sounded like your handwriting.” {rival} doesn’t confirm, doesn’t deny — offers you a grape. That’s a confession, in their dialect.', effects: { charisma: 5, rivalOpinion: -2, chainEventId: 'li_enc_rmove_confront' } },
          incredible: { text: 'You raise it so lightly — admiring the craft, critiquing one word choice — that {rival} cracks up and owns it. “Had to test the fence,” they shrug. Fence: tested. Noted.', effects: { charisma: 8, rivalOpinion: 3, gainIntel: { about: 'rival', label: 'they admit to testing your fence' }, chainEventId: 'li_enc_rmove_confront' } },
        },
      },
    },
  },
  // The move, answered (war footing's payoff — the MOMENT of the Act-2 arc).
  {
    id: 'li_enc_rmove_show', act: 2, chainOnly: true, tags: ['encounter', 'drama'],
    art: 'li_firepit_day',
    context: 'That evening · the follow-up · {rival} finds you first',
    prompt: '“That, earlier?” {rival} materialises beside you with two drinks and gives you one, which is how aggression works here. “Nothing personal. Final Week seats are Final Week seats.” A pause. “You’d do the same.” Would you? They’re watching you decide.',
    choices: {
      left: {
        label: '“Try it again. See.”',
        tags: ['drama', 'loyal'],
        governingStats: { loyalty: 0.5, charisma: 0.5 },
        outcomes: {
          bad: { text: 'The line comes out two sizes too big for the patio. {rival} toasts you with your own drink, delighted. “There they are,” they say, like you’ve finally arrived at their party.', effects: { loyalty: 2, rivalOpinion: -4, rivalMood: 'smug', addFlag: 'li_rival_active', burnout: 3 } },
          good: { text: 'You say it level, no theatre, and hold their eye until they nod. Terms understood. The Season now has two players who respect each other and a lawn between them.', effects: { loyalty: 3, rivalOpinion: -2, addFlag: 'li_rival_active', public: 3 } },
          incredible: { text: '“You’d do the same.” — “No,” you say, and mean it, and {rival} sees you mean it — the one answer their model didn’t price. For a second the game blinks off their face.', effects: { loyalty: 5, rivalOpinion: 4, rivalMood: 'torn', public: 4, followers: 3 } },
        },
      },
      right: {
        label: 'Talk terms instead',
        tags: ['strategy', 'chat'],
        governingStats: { savvy: 1 },
        outcomes: {
          bad: { text: 'You open negotiations and immediately reveal your whole hand, including cards you didn’t know you held. {rival} thanks you for the audit and pays in compliments.', effects: { savvy: 2, rivalOpinion: 2, rivalMood: 'scheming', burnout: 3 } },
          good: { text: 'Two strategists, one sunset, terms agreed without a single term said aloud. You leave with your couple ringfenced and a professional courtesy neither of you will admit to.', effects: { savvy: 5, rivalOpinion: 4, bond: 2 } },
          incredible: { text: 'The negotiation is so enjoyable it becomes a friendship-shaped problem. “Ugh,” says {rival}, meaning it. “I liked you better as furniture.” The villa’s two sharpest, allied. Terrifying.', effects: { savvy: 8, rivalOpinion: 8, rivalMood: 'smug', followers: 3, graft: 3, gainIntel: { about: 'rival', label: 'what they’ll trade for a Final seat' } } },
        },
      },
    },
  },
  // The rumour, priced (pact footing's payoff).
  {
    id: 'li_enc_rmove_confront', act: 2, chainOnly: true, tags: ['encounter', 'strategy'],
    art: 'li_terrace',
    context: 'Dusk · the terrace · the rumour, priced',
    prompt: '“So.” {rival} leans on the rail beside you, watching the villa metabolise their rumour below. “Everyone believes what they already believed. That’s all a rumour is — a mirror.” They turn. “Question is what you do with yours.”',
    choices: {
      left: {
        label: 'Kill it with the couple',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: 'You and {partner} present a united front so rehearsed it briefly proves the rumour’s point. The villa applauds the production values. {rival} mouths “tactical” at you, beaming.', effects: { loyalty: 2, bond: 2, burnout: 3, rivalMood: 'smug' } },
          good: { text: 'You take it to {partner} first and let your couple be boringly, visibly fine. The rumour starves on schedule. {rival} watches its funeral with professional respect.', effects: { loyalty: 3, bond: 5, rivalOpinion: 2 } },
          incredible: { text: 'Your couple answers the rumour by having, publicly, the least tactical afternoon in villa history. It airs as pure sunshine. “Fine,” says {rival} at dinner, beaten. “That was good.”', effects: { loyalty: 5, bond: 6, public: 4, rivalOpinion: 4 } },
        },
      },
      right: {
        label: 'Send one back',
        tags: ['strategy', 'drama'],
        governingStats: { savvy: 1 },
        outcomes: {
          bad: { text: 'Your counter-rumour leaves the workshop with a wobble and your fingerprints still on it. The villa traces it in an hour. Now there are two rumours, and one culprit: you.', effects: { savvy: 2, public: -2, followers: 3, burnout: 4, addFlag: 'li_code_broke' } },
          good: { text: 'You place one small, true, inconvenient fact about {rival}’s game into the right ear at the right time. No embellishment — the truth freelances. They feel it by dinner.', effects: { savvy: 5, rivalOpinion: -4, rivalMood: 'fuming', followers: 3 } },
          incredible: { text: 'Your reply is a masterclass: accurate, deniable, and funny, which makes it travel. By nightfall their rumour is forgotten and yours is a catchphrase. {rival} starts a slow clap. Alone.', effects: { savvy: 8, rivalOpinion: -3, followers: 5, public: 3, rivalMood: 'wounded' } },
        },
      },
    },
  },

  // ---------- Act 3 · the Partner, at altitude (beat window, two triggers) ----------
  // The Bond is real: the outside gets discussed.
  {
    id: 'li_enc_p3_high', act: 3, weight: 1, tags: ['beat:partnerenc', 'encounter', 'date'],
    art: 'li_terrace',
    requires: { singleIs: false, opinionAtLeast: 'partner:warm' },
    context: 'Final Week · the terrace · the outside, discussed',
    prompt: '“Real talk.” {partner} pulls a blanket over both your knees like a treaty. “A week from now this is a flat, a commute, and my mum’s opinions. No producers arranging our dates.” They look at you. “What does Tuesday look like? Actual Tuesday.”',
    choices: {
      left: {
        label: 'Build Tuesday, out loud',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: 'Your Tuesday features two cities, one dog of disputed custody, and a commute that needs an airline. {partner} laughs at the logistics and holds the intent. The intent is what airs.', effects: { loyalty: 2, bond: 4, burnout: 2, chainEventId: 'li_enc_p3_moment' } },
          good: { text: 'You build it detail by detail — whose kettle, which sofa, the gym schedule truce. Boring, specific, real. {partner} adds the dog. The dog stays in the plan.', effects: { loyalty: 3, bond: 6, partnerMood: 'buzzing', chainEventId: 'li_enc_p3_moment' } },
          incredible: { text: 'Somewhere between the kettle and the dog, you both realise you’re not hypothesising — you’re planning. The blanket treaty is ratified. The drone films two people who’ve already left the show.', effects: { loyalty: 5, bond: 8, public: 4, partnerMood: 'buzzing', chainEventId: 'li_enc_p3_moment' } },
        },
      },
      right: {
        label: 'Be honest about the fear',
        tags: ['chat', 'drama'],
        governingStats: { loyalty: 0.5, savvy: 0.5 },
        outcomes: {
          bad: { text: 'You lead with the fear and it arrives bigger than you meant — a list, with subsections. {partner} listens all the way through, which is its own answer, and takes your cold hands at the end.', effects: { savvy: 2, bond: 3, burnout: 4, chainEventId: 'li_enc_p3_moment' } },
          good: { text: '“I’m scared it’s a bubble.” Said out loud, at last. {partner} nods slowly: “So we test it. Tuesdays are the test.” Fear, met with a protocol. Weirdly, deeply romantic.', effects: { savvy: 4, loyalty: 3, bond: 5, chainEventId: 'li_enc_p3_moment' } },
          incredible: { text: 'You name the fear so precisely that {partner} goes still — it’s theirs too, word for word. Two people admit the bubble together, which is the only known way to leave one intact.', effects: { loyalty: 4, bond: 8, savvy: 3, partnerMood: 'torn', chainEventId: 'li_enc_p3_moment' } },
        },
      },
    },
  },
  // The Bond is cratering: the wobble talk.
  {
    id: 'li_enc_p3_low', act: 3, weight: 1, tags: ['beat:partnerenc', 'encounter', 'drama'],
    art: 'li_daybed',
    requires: { singleIs: false, opinionBelow: 'partner:warm' },
    context: 'Final Week · the daybed · the couple, buffering',
    prompt: '“Are we okay?” {partner} asks it at the worst possible time, which is how you know it’s real. “Because from the outside we look great. And from in here—” they gesture at the six inches between you, “—there’s this.” The six inches say nothing.',
    choices: {
      left: {
        label: 'Fight for it, now',
        tags: ['loyal', 'drama'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: 'You go all in with a speech that’s 80% right and lands on the 20%. {partner} takes your hand mid-crash anyway. “Okay,” they say. “Effort noted.” It airs as a start. It is one.', effects: { loyalty: 3, bond: 3, burnout: 4, chainEventId: 'li_enc_p3_moment' } },
          good: { text: '“No, we’re not okay. Yet.” And then you do the unglamorous thing: you ask what’s wrong and you listen to all of it. The six inches close by half. Half is a lot at this altitude.', effects: { loyalty: 3, bond: 6, partnerMood: 'torn', chainEventId: 'li_enc_p3_moment' } },
          incredible: { text: 'You fight for it the right way — specifics, apologies with line items, one true declaration at the end. {partner} watches you rebuild it in real time. “Right,” they say, unsteady. “Us, then.”', effects: { loyalty: 5, bond: 9, partnerMood: 'buzzing', public: 3, chainEventId: 'li_enc_p3_moment' } },
        },
      },
      right: {
        label: 'Read the room honestly',
        tags: ['strategy', 'chat'],
        governingStats: { savvy: 1 },
        outcomes: {
          bad: { text: 'You reach for measured and land on clinical: “satisfaction-wise, trajectory-wise—” {partner}’s eyebrows leave to get help. The chat ends with a handshake neither of you ordered.', effects: { savvy: 2, bond: -2, partnerMood: 'torn', burnout: 3, chainEventId: 'li_enc_p3_moment' } },
          good: { text: 'You name it plainly: the villa forced the pace, Final Week is the invoice. No blame, no theatre. {partner} exhales like someone let out of a costume. Honesty buys a real conversation.', effects: { savvy: 5, bond: 4, chainEventId: 'li_enc_p3_moment' } },
          incredible: { text: 'Your read is so clean — what’s real, what’s scaffolding, what needs a week outside to know — that {partner} asks you to say it again, slower. The couple downgrades to honest. Honest can climb.', effects: { savvy: 8, bond: 5, loyalty: 3, chainEventId: 'li_enc_p3_moment' } },
        },
      },
    },
  },
  {
    id: 'li_enc_p3_moment', act: 3, chainOnly: true, tags: ['encounter', 'date'],
    art: 'li_hideaway',
    context: 'Later · the roof terrace · the Season, weighed',
    prompt: 'The villa sleeps. {partner} finds you on the roof terrace with two mugs and the face of someone who has decided something. “Whatever happens Friday — the envelope, the vote, all of it.” They hand you a mug. “I need you to know where I land.” And they tell you.',
    choices: {
      left: {
        label: 'Land in the same place',
        tags: ['loyal', 'date'],
        governingStats: { loyalty: 0.7, rizz: 0.3 },
        outcomes: {
          bad: { text: 'You say it back a heartbeat late and spend ten minutes proving the delay meant nothing. It mostly did mean nothing. The mugs go cold in a warm silence.', effects: { loyalty: 3, bond: 4, burnout: 2 } },
          good: { text: 'You land in the same place, out loud, no envelope-shaped caveats. The mugs clink. Somewhere below, a camera operator quietly punches the air.', effects: { loyalty: 3, bond: 7, partnerMood: 'buzzing', public: 3 } },
          incredible: { text: 'You answer with the sentence you’ve been drafting since the swing seat, and it turns out you both drafted the same one. The Final is Friday. It stopped mattering just now, on a roof.', effects: { loyalty: 5, bond: 9, partnerMood: 'buzzing', public: 5 } },
        },
      },
      right: {
        label: 'Ask for the truth, both ways',
        tags: ['chat', 'strategy'],
        governingStats: { savvy: 0.5, loyalty: 0.5 },
        outcomes: {
          bad: { text: 'You ask the follow-up with lawyer energy and the moment files for a recess. {partner} answers everything, patiently, holding the mug like a witness exhibit. The truth survives the tone.', effects: { savvy: 2, bond: 3, burnout: 3 } },
          good: { text: '“Same question back. No show answer.” The two of you audit the whole Season on a roof — the wobble, the postcard, the pact — and the couple comes out the other side itemised and intact.', effects: { savvy: 5, bond: 5, loyalty: 3 } },
          incredible: { text: 'The mutual debrief runs till the sky goes grey, and ends with the rarest artefact this show produces: two people who know exactly what they have. The vote can do what it likes.', effects: { savvy: 6, loyalty: 3, bond: 7, public: 4 } },
        },
      },
    },
  },

  // ---------- Act 3 · the second wave (a bombshell steps up, the villa churns) ----------
  {
    id: 'li_second_wave', act: 3, weight: 1, tags: ['beat:wave', 'encounter', 'drama', 'text'],
    art: 'li_bombshell',
    // The villa churns when the first Rival is NEUTRALISED — their secret
    // detonated, or won all the way over (a warm rival isn't gunning for
    // anyone; production ships a replacement).
    requires: { singleIs: false, anyOf: [{ flagsAll: ['li_secret_detonated'] }, { opinionAtLeast: 'rival:warm' }] },
    context: 'Final Week · “I’VE GOT A TEXT!!” · nature abhors a vacuum',
    prompt: '“Islanders, please welcome a late arrival. #neverover” — With {rival} out of the villain business, the villa had a vacancy, and production fills vacancies. The newcomer surveys the lawn, finds the strongest couple, and smiles at it. It’s yours. Congratulations.',
    choices: {
      left: {
        label: 'Meet the threat head on',
        tags: ['strategy', 'chat'],
        governingStats: { savvy: 0.6, charisma: 0.4 },
        outcomes: {
          bad: { text: 'You introduce yourself with the energy of a border official. The newcomer clocks the fear instantly, and moves in — not on {partner}. On your Final Week seat.', effects: { savvy: 2, bombshellEnters: 'same', rivalFromBombshell: true, burnout: 4 } },
          good: { text: 'You give them the tour, the warnings, and precisely nothing to work with. They respect it — and pick a lane anyway. Yours. At least it’s official.', effects: { savvy: 5, bombshellEnters: 'same', rivalFromBombshell: true, public: 3 } },
          incredible: { text: 'You read their entrance like a scout report and greet them by strategy rather than name. “Word travels,” they grin, hostilities opening on friendly terms. A worthy second act.', effects: { savvy: 8, bombshellEnters: 'same', rivalFromBombshell: true, public: 4, followers: 3 } },
        },
      },
      right: {
        label: 'Stay wrapped in your couple',
        tags: ['loyal', 'rest'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: 'You perform serene indifference from the daybed and grip {partner}’s hand like hand luggage. The newcomer reads the lawn, and the grip, and smiles wider.', effects: { loyalty: 2, bombshellEnters: 'same', rivalFromBombshell: true, bond: 2, burnout: 3 } },
          good: { text: 'Your couple absorbs the arrival the way good couples do: politely, jointly, with no visible seams to work a crowbar into. The newcomer files you under <i>later</i>.', effects: { loyalty: 3, bombshellEnters: 'same', rivalFromBombshell: true, bond: 4 } },
          incredible: { text: 'You’re so untroubled the newcomer double-checks with production that your couple is real. It is. They pivot to public-vote warfare instead — a cleaner fight, and you’re winning it.', effects: { loyalty: 5, bombshellEnters: 'same', rivalFromBombshell: true, bond: 5, public: 5 } },
        },
      },
    },
  },
];
