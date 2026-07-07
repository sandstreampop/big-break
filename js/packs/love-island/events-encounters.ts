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
    prompt: '“Come here — let me pull you for a chat.” {rival} pours you a drink like it matters. “I’m not being funny, but everyone in here’s been fake nice since we walked in, and it’s day two. I can’t be doing with it. So be honest with me — where’s your head really at?” Behind the smile, they’re clocking every word.',
    recap: '{rival} pours you a drink and asks where your head’s really at.',
    choices: {
      left: {
        label: 'Answer straight',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: '“Honestly? I just like {partner}.” — “Honestly,” {rival} repeats, tasting the word for cracks. Your glass gets topped up, which in this kitchen is a caution, not a kindness.', effects: { loyalty: 2, rivalOpinion: 3, burnout: 2, chainEventId: 'li_enc_rival_2_test' } },
          good: { text: '“I’m here for something real. 100%. Laugh if you want.” {rival} doesn’t laugh. “Huh,” they say, and you can hear yourself being recalibrated upward.', effects: { loyalty: 3, rivalOpinion: 6, chainEventId: 'li_enc_rival_2_open' } },
          incredible: { text: '“Same as you, if I’m honest — I’m just not gonna lie about it.” A beat. Then {rival} grins, the first real one all night. “See, now I’ve got a lot of time for you. I’ll be watching.”', effects: { loyalty: 5, rivalOpinion: 8, public: 3, chainEventId: 'li_enc_rival_2_open' } },
        },
      },
      right: {
        label: 'Read them back',
        tags: ['strategy', 'banter'],
        governingStats: { savvy: 0.6, charisma: 0.4 },
        outcomes: {
          bad: { text: '“My plan? Watching yours.” It sounded cooler in your head. {rival} smiles at the counter and files you under <i>threat, small</i>.', effects: { savvy: 2, rivalOpinion: -3, burnout: 3, chainEventId: 'li_enc_rival_2_test' } },
          good: { text: '“You didn’t pour that for the chat. You poured it for the tell.” {rival} laughs once, on purpose. “Sharp. Annoying, but sharp.”', effects: { savvy: 5, rivalOpinion: 4, followers: 2, chainEventId: 'li_enc_rival_2_test' } },
          incredible: { text: '“Two drinks and all these questions — just ask me what you actually wanna know, babe.” The kitchen goes quiet the way rooms do when someone skips the small talk. Respect, at knifepoint.', effects: { savvy: 8, rivalOpinion: 6, public: 3, chainEventId: 'li_enc_rival_2_open' } },
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
    recap: '{rival} admits on the swing seat they came in with a plan — and it’s slipping.',
    choices: {
      left: {
        label: 'Trade something real',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 0.7, charisma: 0.3 },
        outcomes: {
          bad: { text: 'You match their confession and overshoot by one childhood story. “Wow,” says {rival}, meaning <i>stop</i>. Still — a trade’s a trade, and they started it.', effects: { loyalty: 2, rivalOpinion: 3, burnout: 2, chainEventId: 'li_enc_rival_3_pact' } },
          good: { text: '“Me too, honestly. Different plan, same wobble.” {rival} nods slowly, promoting you from obstacle to person.', effects: { loyalty: 3, rivalOpinion: 6, chainEventId: 'li_enc_rival_3_pact' } },
          incredible: { text: '“I nearly didn’t get on the plane, if I’m honest — bottled it in the airport bogs for twenty minutes.” You haven’t told {partner} that. {rival} holds it carefully. Day two, and the realest chat in here has no couple in it.', effects: { loyalty: 5, rivalOpinion: 9, public: 3, chainEventId: 'li_enc_rival_3_pact' } },
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
    recap: 'At breakfast {rival} dares you, loudly, to tell the lawn last night’s plan.',
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
          incredible: { text: '“You’re trying to make me the bad guy, babe. Get in the queue.” The lawn howls. {rival} laughs too — the only available exit — and files the whole scene under <i>later</i>.', effects: { savvy: 8, followers: 5, public: 3, rivalOpinion: -3, rivalMood: 'scheming', chainEventId: 'li_enc_rival_3_war' } },
        },
      },
    },
  },
  // Beat 3a — the pact (the MOMENT, warm branch).
  {
    id: 'li_enc_rival_3_pact', act: 1, chainOnly: true, tags: ['encounter', 'chat', 'strategy'],
    art: 'li_terrace',
    context: 'Sunset · the terrace · the terms',
    prompt: '“Listen, right.” {rival} leans on the rail, a proper truce on the table. “I’m gonna graft, I’m gonna play my game, that’s just me. And you’re gonna be all loved-up and sincere — fair play to you, honestly. We can stay out of each other’s lane. Or not. Up to you, babe.”',
    recap: 'On the terrace {rival} offers a truce: separate lanes, no interference.',
    choices: {
      left: {
        label: 'Shake on it',
        tags: ['chat', 'strategy'],
        governingStats: { savvy: 0.5, loyalty: 0.5 },
        outcomes: {
          bad: { text: 'You shake. {rival} holds the grip one beat too long, so the cameras get the frame. The deal is real; the photo op was the interest on it.', effects: { savvy: 2, rivalOpinion: 4, rivalMood: 'smug', burnout: 2 } },
          good: { text: '“Stay away from my couple, I’ll stay out your way.” — “Deal, babe.” The most honest chat this villa will see all Season, and not a script in sight.', effects: { savvy: 4, loyalty: 3, rivalOpinion: 8, rivalMood: 'smug', gainIntel: { about: 'rival', label: 'they’re here to win the show, not fall in love — their words' } } },
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
    recap: 'Firepit embers — {rival} names the {partner}-shaped thing you both want.',
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
    recap: 'Same swing, different summer — {partner} asks if you’re smarter this time.',
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
    recap: 'An old rival from last Season slides you a coffee and a rematch.',
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
    recap: '{mate} brings ice cream and two spoons and asks what’s really going on.',
    choices: {
      left: {
        label: 'Actually tell them',
        tags: ['loyal', 'chat', 'code'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: 'You get four sentences in before the tears arrive — yours, embarrassingly. {mate} doesn’t flinch, just hands you the tub. “Keep going.” You do. It airs. You don’t care.', effects: { loyalty: 3, burnout: -4, addFlag: 'li_code_honour', chainEventId: 'li_enc_bestie_2_ride' } },
          good: { text: '“Finally,” says {mate}, around a spoon. You talk until the spoons stand up on their own. Somewhere in there it stops being telly and starts being a friendship.', effects: { loyalty: 3, burnout: -5, addFlag: 'li_code_honour', chainEventId: 'li_enc_bestie_2_ride' } },
          incredible: { text: 'You tell them the lot — the ex who still “just checks in,” the reason you nearly said no to this whole thing — and get theirs back, all of it. By 2 a.m. you have what nobody else in here has: a witness.', effects: { loyalty: 5, burnout: -6, public: 2, addFlag: 'li_code_honour', chainEventId: 'li_enc_bestie_2_ride' } },
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
    recap: '{mate} wants a pact: whatever the villa throws, you two stay close.',
    choices: {
      left: {
        label: 'Deal. No strangers',
        tags: ['loyal', 'code'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: 'You shake on it with croissant grease, which {mate} declares “binding.” Within the hour the villa tests the treaty with a rumour. It holds. Barely — but it holds.', effects: { loyalty: 3, addFlag: 'li_bestie', gainIntel: { about: 'rival', label: 'the girls have been calling your couple “convenient”' } } },
          good: { text: '“Deal.” The least dramatic pact in villa history, and the only one that will survive the Season. {mate} proves it immediately: what {rival} said at breakfast, verbatim.', effects: { loyalty: 4, addFlag: 'li_bestie', gainIntel: { about: 'rival', label: 'they called your couple “a strategy” over the eggs' } } },
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
    recap: '{mate} delivers the morning gossip and floats making the alliance official.',
    choices: {
      left: {
        label: 'Make it official — allies',
        tags: ['strategy'],
        governingStats: { savvy: 1 },
        outcomes: {
          bad: { text: '“Allies, then.” {mate} nods — and immediately tests you with a small secret. You hold it for a whole day. Just. The probation period continues.', effects: { savvy: 2, burnout: 2, addFlag: 'li_bestie' } },
          good: { text: 'You shake on the least romantic and most durable arrangement in the villa. The first dividend arrives by lunch: what {rival} is planning for the recoupling.', effects: { savvy: 4, addFlag: 'li_bestie', gainIntel: { about: 'rival', label: 'they’re planning to pull your partner at the recoupling' } } },
          incredible: { text: 'The alliance is so efficient it frightens you both. Within a day you know everything that moves in this villa — and, better, what’s about to.', effects: { savvy: 6, public: 2, addFlag: 'li_bestie', gainIntel: { about: 'rival', label: 'who they’re pulling next — before they do it' } } },
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
    prompt: '“Right, I’m just gonna say it—” {partner} has brought you a tea and a speech, in that order. “I like you. Properly. I’ve got a lot of time for you, genuinely. That’s it, that’s the announcement.” The swing creaks. Somewhere in the gallery a producer whispers <i>stay on them</i>.',
    recap: '{partner} brings a tea and a speech: they like you, properly.',
    choices: {
      left: {
        label: 'Say it back',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 0.6, rizz: 0.4 },
        outcomes: {
          bad: { text: 'You say it back one beat too slow — long enough for {partner} to hear the maths. “You had to THINK,” they say, delighted and wounded in exactly equal parts.', effects: { loyalty: 2, bond: 3, burnout: 2, chainEventId: 'li_enc_partner_2_real' } },
          good: { text: '“Same, babe. 100%,” you say, and mean it, and {partner} does a small lap of honour around the swing seat. Subtlety left the villa an hour ago. Nobody misses it.', effects: { loyalty: 3, bond: 5, chainEventId: 'li_enc_partner_2_real' } },
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
    prompt: '“Can I ask you something, and don’t take this the wrong way.” {partner} deals it like a card, eyes on the pool. “What are you actually here for? ’Cause I’ve watched every series, and I clock a game-player a mile off. On paper you’re my type. I just need to know your head’s in it.” A beat. “No offence.”',
    recap: '{partner} asks, dead calm, whether you’re a game-player or the real thing.',
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
    recap: '{partner} can’t do telly talk, but wants you to just sit a while.',
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
    recap: '{partner} asks if anyone out there knows the thing you told them earlier.',
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
          good: { text: 'You turn it round: “Nah — what about you, though?” And {partner} goes at a run: the nan who raised them, gone this March; the fear that out there, off the telly, they go back to being no one. “Never said that bit out loud,” they add.', effects: { savvy: 5, bond: 4, gainIntel: { about: 'partner', label: 'off the telly, they’re scared they’re no one' }, chainEventId: 'li_enc_partner_3close' } },
          incredible: { text: '“When were you last properly happy — before all this?” {partner} stops mid-sip. “Nobody’s ever asked me that.” Ten minutes: a nan’s caravan, a dog called Biscuit, one summer that ended and never quite started again. You keep all of it.', effects: { savvy: 8, bond: 6, gainIntel: { about: 'partner', label: 'the caravan, the dog called Biscuit, the summer that ended' }, chainEventId: 'li_enc_partner_3close' } },
        },
      },
    },
  },
  {
    id: 'li_enc_partner_2_show', act: 1, chainOnly: true, tags: ['encounter', 'camera'],
    art: 'li_lawn',
    context: 'Afternoon · the lawn · your couple, performing well',
    prompt: '“We’re good at this,” {partner} murmurs mid-photogenic-laugh, eyes bright and unreadable. “The couple thing. Everyone thinks so.” A beat. “Is it a thing, though? For you?” Delivered smiling, straight down the middle of the bit.',
    recap: 'Mid-photo-laugh, {partner} asks quietly if the couple thing is real for you.',
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
    prompt: 'The room breathes around you. “Honest answer, yeah?” whispers {partner}, one duvet-width away. “Day one — was I your type on paper? Off the line-up, hand on heart, no messing.” The moment arrives quietly, at whisper volume, the way the real ones do.',
    recap: 'Lights out — {partner} whispers: were they your type on paper, day one?',
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
    recap: '{rival} steers {partner} off to the daybed with a look that says your move.',
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
    recap: 'A too-clean rumour says your couple’s ‘tactical’ — a pro planted it.',
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
    recap: '{rival} hands you a drink and calls the poach nothing personal.',
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
          incredible: { text: 'The negotiation is so enjoyable it becomes a friendship-shaped problem. “Ugh,” says {rival}, meaning it. “I liked you better as furniture.” The villa’s two sharpest, allied. Terrifying.', effects: { savvy: 8, rivalOpinion: 8, rivalMood: 'smug', followers: 3, graft: 3, gainIntel: { about: 'rival', label: 'they’d bin their own couple for a Final seat' } } },
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
    recap: '{rival} watches the villa swallow their rumour and asks what you’ll do.',
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
    recap: 'Final Week — {partner} asks what real life, actual Tuesday, looks like.',
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
    recap: '{partner} asks ‘are we okay?’ — great outside, six inches apart in here.',
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
    recap: 'On the roof, {partner} has decided something and needs you to know it.',
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
    recap: '‘Got a text!’ — a late {bombshell} lands and eyes up your couple.',
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

  // ---------- Doubling pass · standalone one-on-one encounters (open cards) ----------
  // Fresh conversational situations across Rival, Mate, Partner, Bombshell and Ex.
  // Dialogue-first: sincere Islander argot in quotes, dry narration between.

  // Rival · the trojan-horse “as a mate” warning.
  {
    id: 'li_enc_rival_advice', act: 2, weight: 1, tags: ['encounter', 'chat', 'strategy'],
    art: 'li_kitchen',
    context: 'Afternoon · the kitchen · advice, unrequested',
    prompt: '“Can I be dead honest with you? As a mate.” {rival} lowers their voice over the washing-up. “{partner}’s been a bit off with you today. I’m not stirring, swear down — I just know what it looks like when someone’s head’s about to turn. Thought you should hear it from me.” The tap runs. So does the meter behind their eyes.',
    recap: '{rival} “as a mate” warns you {partner}’s head might be turning.',
    choices: {
      left: {
        label: 'Thank them, mean it',
        tags: ['chat', 'loyal'],
        governingStats: { loyalty: 0.6, charisma: 0.4 },
        outcomes: {
          bad: { text: 'You take it at face value and spend the afternoon reading {partner} like a bad horoscope. Nothing was off. Something is now.', effects: { loyalty: 2, bond: -2, burnout: 3 } },
          good: { text: '“Appreciate you looking out.” You clock the gift and the fishing hook inside it, and thank them for exactly one of the two.', effects: { loyalty: 3, savvy: 3 } },
          incredible: { text: 'You thank {rival} so warmly they can’t tell if it landed, then go ask {partner} straight. It was nothing. The seed dies in daylight, unwatered.', effects: { loyalty: 5, bond: 4, savvy: 3 } },
        },
      },
      right: {
        label: 'Ask what they saw',
        tags: ['strategy', 'chat'],
        governingStats: { savvy: 1 },
        outcomes: {
          bad: { text: 'You press for specifics and get vapour — “just a vibe, babe.” Now you’ve shown you’ll chase it, and {rival} has learned exactly which string to pull next time.', effects: { savvy: 2, rivalOpinion: 2, burnout: 3 } },
          good: { text: '“Go on — what exactly did you see?” The story shrinks with every question until there’s nothing left in it but its author.', effects: { savvy: 5, gainIntel: { about: 'rival', label: 'the “off” story was theirs, not {partner}’s' } } },
          incredible: { text: '“What did you see, word for word?” {rival} can’t produce it. You smile, thank them for the heads-up, and hand the seed back unplanted.', effects: { savvy: 8, rivalOpinion: -2, public: 3 } },
        },
      },
    },
  },
  // Rival · the challenge scoreboard, cashed in.
  {
    id: 'li_enc_rival_ranking', act: 2, weight: 1, tags: ['encounter', 'banter', 'drama'],
    art: 'li_lawn',
    context: 'After a challenge · the loungers · a name, named',
    prompt: '“So I’m your snog, yeah?” {rival} catches you by the loungers, grinning, holding the challenge scoreboard like a receipt. “In front of everyone, you picked me. I’m not being funny, I just wanna know — was that game, or was that you?” They’re not really asking about the challenge.',
    recap: '{rival} corners you about picking them in the challenge — game or real?',
    choices: {
      left: {
        label: 'Call it a bit',
        tags: ['camera', 'banter'],
        governingStats: { charisma: 0.6, savvy: 0.4 },
        outcomes: {
          bad: { text: '“It was the challenge, babe, chill.” Too quick, too flat. {rival} raises an eyebrow and decides you protest a lot for someone this chill.', effects: { charisma: 2, rivalOpinion: 2, burnout: 2 } },
          good: { text: '“It was the game — you were the funniest answer, simple as.” True, deniable, disarming. {rival} laughs and lets it go, mostly.', effects: { charisma: 5, followers: 3 } },
          incredible: { text: 'You turn the whole scoreboard into a bit at your own expense, and the lounger crowd howls. {rival} can’t find the thread to pull. Well played.', effects: { charisma: 8, public: 4, followers: 3 } },
        },
      },
      right: {
        label: 'Hold the honest line',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: 'You over-explain your loyalty until it sounds like an alibi. {rival} nods along, collecting the wobble in it for later.', effects: { loyalty: 2, bond: -2, burnout: 3 } },
          good: { text: '“Game. I’m with {partner} and that’s not moving.” Said plain, no heat. {rival} shrugs — worth a try — and moves along.', effects: { loyalty: 5, bond: 3 } },
          incredible: { text: '“You’re a laugh. {partner}’s my person. Both true, neither’s changing.” Clean as anything. {rival} respects it, visibly annoyed to have to.', effects: { loyalty: 6, bond: 3, public: 3 } },
        },
      },
    },
  },
  // Rival · the disarming favour at the mirror.
  {
    id: 'li_enc_rival_borrow', act: 1, weight: 1, tags: ['encounter', 'chat', 'banter'],
    art: 'li_bedroom',
    context: 'Morning · the dressing room · a small ask',
    prompt: '“Babe, lifesaver — can I borrow your factor 50? Mine’s gone walkabout.” {rival} is already halfway into your washbag, all sunshine. “While I’m here — how you finding it, honestly? First few days do your head in a bit, don’t they.” The suncream was never the point.',
    recap: '{rival} borrows your suncream and slips in a how-are-you-really.',
    choices: {
      left: {
        label: 'Keep it breezy',
        tags: ['banter', 'chat'],
        governingStats: { charisma: 0.6, loyalty: 0.4 },
        outcomes: {
          bad: { text: 'You give a chirpy nothing-answer and it comes out brittle. {rival} hands the bottle back and keeps the crack they heard in it.', effects: { charisma: 2, rivalOpinion: 2, burnout: 2 } },
          good: { text: '“Yeah, all good — bit surreal, but good.” Warm, closed, no handle on it. {rival} smiles and moves along, empty-handed on the real errand.', effects: { charisma: 5, savvy: 2 } },
          incredible: { text: 'You match their sunshine watt for watt and give away precisely nothing but factor 50. {rival} leaves impressed and none the wiser. Best trade of the morning.', effects: { charisma: 6, savvy: 3, public: 3 } },
        },
      },
      right: {
        label: 'Give them something small',
        tags: ['chat', 'loyal'],
        governingStats: { loyalty: 0.5, rizz: 0.5 },
        outcomes: {
          bad: { text: 'You overshare one nervy thing and watch it get pocketed. Kindness, taxed. {rival} says “aw, bless” in the tone of a receipt.', effects: { loyalty: 2, bond: -1, burnout: 3 } },
          good: { text: '“Bit homesick, if I’m honest.” One true, harmless thing. {rival} softens a degree — even they can’t weaponise missing your nan.', effects: { loyalty: 4, rivalOpinion: 3 } },
          incredible: { text: 'You trade one small truth for one of theirs, and for a minute it’s just two people in a mirror being human. Then the sunshine comes back down. Nice while it lasted.', effects: { loyalty: 4, rivalOpinion: 5, gainIntel: { about: 'rival', label: 'a small, real thing they let slip at the mirror' } } },
        },
      },
    },
  },
  // Mate · the pre-date pep talk.
  {
    id: 'li_enc_mate_pep', act: 2, weight: 1, tags: ['encounter', 'chat', 'rest'],
    art: 'li_bedroom',
    context: 'Golden hour · the dressing room · pre-date nerves',
    prompt: '{mate} is redoing the same eyeliner flick for the fourth time. “I’m bricking it, I’m not gonna lie. What if I’ve got nothing to say and it’s just… silence, on telly, forever.” They turn to you, wobbling. “Tell me something. Anything. Make me believe it.”',
    recap: '{mate} is spiralling before a date and needs you to steady them.',
    choices: {
      left: {
        label: 'Big them up, specifically',
        tags: ['chat', 'loyal'],
        governingStats: { charisma: 0.5, loyalty: 0.5 },
        outcomes: {
          bad: { text: 'You reach for a pep talk and land on “you’ll smash it, babe” three times. {mate} nods, unconvinced, and does the eyeliner a fifth time.', effects: { charisma: 2, burnout: 2 } },
          good: { text: 'You list three actual things they’re brilliant at, by name. {mate} stops fidgeting. “Say the middle one again.” You do.', effects: { charisma: 4, loyalty: 4 } },
          incredible: { text: 'You hand them one story to open with — the goat, the wedding, the fire alarm — and watch the panic turn into a plan. They walk out grinning. It goes great.', effects: { charisma: 6, loyalty: 4, public: 3 } },
        },
      },
      right: {
        label: 'Steady the nerves, not the date',
        tags: ['rest', 'chat'],
        governingStats: { loyalty: 0.6, savvy: 0.4 },
        outcomes: {
          bad: { text: 'You go full breathing-exercise and {mate} laughs — “are you my therapist now?” — but there’s still a wobble under the laugh.', effects: { loyalty: 2, burnout: 2 } },
          good: { text: '“You don’t have to perform, just turn up.” The pressure leaks out of them. Simplest thing anyone’s said to them all week.', effects: { loyalty: 4, burnout: -3 } },
          incredible: { text: 'You take the outcome off the table — win, lose, silence, whatever — and just remind them who they are. {mate} exhales like it’s the first time today.', effects: { loyalty: 5, burnout: -4, selfrespect: 2 } },
        },
      },
    },
  },
  // Mate · the complicated crush, sworn to secrecy.
  {
    id: 'li_enc_mate_crush', act: 2, weight: 1, tags: ['encounter', 'chat', 'code'],
    art: 'li_terrace',
    context: 'Dusk · the swing seat · a secret, offered',
    prompt: '“Right, you can’t say anything. Swear down.” {mate} checks over both shoulders. “I think I’ve caught feelings for someone in here and it’s a proper problem, because it’s… complicated. Like, coupled-up complicated.” They wince. “I had to tell someone or I’d explode.”',
    recap: '{mate} confesses a complicated crush and swears you to secrecy.',
    choices: {
      left: {
        label: 'Keep it in the vault',
        tags: ['loyal', 'code'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: 'You promise to keep it and immediately look like you’re keeping something. Villa radar pings. You say nothing — but your face has already leaked it.', effects: { loyalty: 3, burnout: 3 } },
          good: { text: '“It stays with me. 100%.” And it does. {mate} sags with relief — one person in here they don’t have to manage.', effects: { loyalty: 5 } },
          incredible: { text: 'You take the secret, ask the one question that helps — “does it make you happy or just wired?” — and lock the rest away. {mate} looks at you like you’ve saved their week.', effects: { loyalty: 6, selfrespect: 2 } },
        },
      },
      right: {
        label: 'Gently reality-check it',
        tags: ['chat', 'strategy'],
        governingStats: { savvy: 0.6, loyalty: 0.4 },
        outcomes: {
          bad: { text: 'You go straight to logistics — who, when, the fallout — and {mate} deflates. “I wanted a mate, not a risk assessment.” Fair.', effects: { savvy: 2, burnout: 2 } },
          good: { text: 'You ask the awkward questions kindly, and {mate} actually thinks. “Yeah. Maybe I sit on it.” Sometimes the friend is the brake.', effects: { savvy: 4, loyalty: 3 } },
          incredible: { text: 'You walk them through it without once telling them what to do, and they arrive at their own answer, steadier. “You’re good at this,” they say, a bit spooked.', effects: { savvy: 6, loyalty: 3 } },
        },
      },
    },
  },
  // Mate · the kind call-out about disappearing into your couple.
  {
    id: 'li_enc_mate_callout', act: 2, weight: 1, tags: ['encounter', 'chat', 'loyal'],
    art: 'li_daybed',
    context: 'Afternoon · the daybed · a mate, straight up',
    prompt: '“Can I say something and you not take it bad?” {mate} keeps it low. “You’ve gone a bit… gone, since you coupled up. We used to have a laugh. Now it’s all {partner}, {partner}, {partner}. I miss you, that’s all. Not being funny.” It’s the kindest telling-off you’ll get in here.',
    recap: '{mate} gently says you’ve vanished into your couple.',
    choices: {
      left: {
        label: 'Own it, make time',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: 'You apologise a beat too defensively and it turns into a small thing about a big thing. You get there — but the sorry needed a second draft.', effects: { loyalty: 2, burnout: 3 } },
          good: { text: '“You’re right. I’ve been rubbish.” No excuses. You book a proper catch-up and keep it. {mate} lights up — they weren’t sure you’d hear it.', effects: { loyalty: 5, selfrespect: 2 } },
          incredible: { text: 'You drop everything, grab two teas, and give {mate} the whole afternoon. By sundown it’s like nobody ever coupled up with anyone. The mates chat, restored.', effects: { loyalty: 6, burnout: -3 } },
        },
      },
      right: {
        label: 'Explain where you’ve been',
        tags: ['chat', 'loyal'],
        governingStats: { loyalty: 0.5, rizz: 0.5 },
        outcomes: {
          bad: { text: 'You explain, and the explaining sounds a lot like defending. {mate} nods slowly. “Okay. As long as you know.” The gap doesn’t quite close.', effects: { loyalty: 2, burnout: 2 } },
          good: { text: '“I’ve been all up in my own head about it, honestly.” You let them in on the couple stuff instead of vanishing into it. {mate} softens. Better.', effects: { loyalty: 4 } },
          incredible: { text: 'You tell {mate} the real reason you’ve been distant — the fear it’s too good to trust — and suddenly they’re not losing you, they’re in it with you.', effects: { loyalty: 4, selfrespect: 2 } },
        },
      },
    },
  },
  // Mate · the dress rehearsal for a hard conversation.
  {
    id: 'li_enc_mate_rehearsal', act: 2, weight: 1, tags: ['encounter', 'chat', 'strategy'],
    art: 'li_kitchen',
    context: 'Morning · the kitchen · a dress rehearsal',
    prompt: '“Can you be him for a sec? I need to practise.” {mate} squares up to you over the kettle, deadly serious. “I’ve got to tell {rival} to back off my girl and I keep bottling it. Just… say what he’d say. Be brutal. I need to not cry.”',
    recap: '{mate} makes you play their nemesis so they can rehearse.',
    choices: {
      left: {
        label: 'Play it straight',
        tags: ['chat', 'loyal'],
        governingStats: { loyalty: 0.5, charisma: 0.5 },
        outcomes: {
          bad: { text: 'You go too soft and {mate} sails through — then freezes the second it’s real, because you rehearsed the easy version. Whoops.', effects: { loyalty: 2, burnout: 2 } },
          good: { text: 'You give them a believable opponent and they find their words by the third go. “Right. I can do that.” They can, later. It holds.', effects: { loyalty: 4, charisma: 3 } },
          incredible: { text: 'You throw every low blow {rival} might, and {mate} stands in it without flinching by the end. When the real chat comes, they’re bulletproof. You made that.', effects: { loyalty: 5, charisma: 3, selfrespect: 2 } },
        },
      },
      right: {
        label: 'Coach them instead',
        tags: ['strategy', 'chat'],
        governingStats: { savvy: 0.6, charisma: 0.4 },
        outcomes: {
          bad: { text: 'You keep stopping to give notes until {mate} loses the thread. “I liked it better when you just shouted.” Point taken.', effects: { savvy: 2, burnout: 2 } },
          good: { text: 'You hand them one line to hold onto — “I’m not asking, I’m telling you” — and drill it till it’s theirs. Simple, portable, effective.', effects: { savvy: 4, loyalty: 3 } },
          incredible: { text: 'You reverse-engineer {rival}’s whole style and teach {mate} to disarm it. They walk into the real thing and it’s over in two sentences. Corner: yours.', effects: { savvy: 6, loyalty: 3, gainIntel: { about: 'rival', label: 'how {rival} argues — mapped in a mock run' } } },
        },
      },
    },
  },
  // Mate · the quiet existential chat over the laundry.
  {
    id: 'li_enc_mate_washingline', act: 2, weight: 1, tags: ['encounter', 'chat', 'loyal'],
    art: 'li_lawn',
    context: 'Late morning · the washing line · pegs and confessions',
    prompt: 'You’re halfway through pairing socks that aren’t yours when {mate} says, not looking up: “Do you ever get the fear in here? Like, three a.m., everyone asleep, and you think — what if none of this is real and I’m just good telly.” A peg snaps. “Sorry. Heavy, for a Tuesday.”',
    recap: '{mate} gets quietly existential over the laundry.',
    choices: {
      left: {
        label: 'Sit in it with them',
        tags: ['chat', 'loyal'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: 'You reach for reassurance and it comes out like a poster. {mate} half-smiles. “Yeah. Course.” The real thing they said sits there, unmet.', effects: { loyalty: 2, burnout: 2 } },
          good: { text: '“Every night, mate. Three a.m., without fail.” Just knowing they’re not the only one lands like a blanket. You peg the rest in comfortable quiet.', effects: { loyalty: 4, burnout: -3 } },
          incredible: { text: 'You tell them your version of the fear, plainly, and they tell you theirs, and the washing line becomes the realest room in the villa. Nobody films the socks.', effects: { loyalty: 5, burnout: -4, selfrespect: 2 } },
        },
      },
      right: {
        label: 'Lift it back up',
        tags: ['banter', 'chat'],
        governingStats: { charisma: 0.6, loyalty: 0.4 },
        outcomes: {
          bad: { text: 'You crack a joke to lighten it and it lands a shade too fast, like a dodge. {mate} laughs, but files the dodge. “Never mind.”', effects: { charisma: 2, burnout: 2 } },
          good: { text: 'You honour the heavy bit, then land one gentle joke that lets them breathe again. {mate} exhales, grateful. “That’s why I like you.”', effects: { charisma: 4, loyalty: 3 } },
          incredible: { text: 'You turn the three-a.m. fear into a bit you both now own — “the socks know” — and it’s your private code all Season. Heavy, made carriable.', effects: { charisma: 5, loyalty: 3, public: 3 } },
        },
      },
    },
  },
  // Partner · the 3 a.m. homesick kitchen.
  {
    id: 'li_enc_partner_homesick', act: 2, weight: 1, tags: ['encounter', 'chat', 'date'],
    art: 'li_kitchen',
    requires: { singleIs: false },
    context: 'Small hours · the kitchen · two insomniacs',
    prompt: 'You find {partner} at the counter at 3 a.m., staring at a cold tea. “Couldn’t sleep,” they say. “Keep thinking about my mum’s kitchen. Stupid, innit.” They don’t look stupid. They look about nine years old, and a long way from home.',
    recap: 'You find {partner} up at 3 a.m., quietly homesick.',
    choices: {
      left: {
        label: 'Sit down and stay',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: 'You say the wrong comforting thing — “only a few weeks left” — and it lands as a countdown, not a comfort. Still, you stay. Staying counts.', effects: { loyalty: 3, bond: 3, burnout: 2 } },
          good: { text: 'You make a fresh tea, sit down, and let them talk about their mum’s kitchen for an hour. By the end {partner}’s smiling. “Ta for not fixing it.”', effects: { loyalty: 4, bond: 6, partnerMood: 'buzzing' } },
          incredible: { text: 'You don’t fix it, you just get homesick alongside them — your nan’s roast, their mum’s radio — till 3 a.m. feels less like exile and more like a kitchen you both half-recognise.', effects: { loyalty: 5, bond: 8, partnerMood: 'buzzing', public: 3 } },
        },
      },
      right: {
        label: 'Distract them, gently',
        tags: ['chat', 'rest'],
        governingStats: { rizz: 0.5, loyalty: 0.5 },
        outcomes: {
          bad: { text: 'You launch a bit to cheer them and it’s the wrong hour for bits. {partner} plays along, tired. The homesick thing waits outside, patient.', effects: { rizz: 2, bond: 2, burnout: 2 } },
          good: { text: 'You coax out the funny family stories instead of the sad ones, and {partner} laughs properly for the first time all night. Homesick, rehomed a little.', effects: { rizz: 4, bond: 4, burnout: -2 } },
          incredible: { text: 'By dawn you’ve planned a whole trip to their mum’s kitchen — the roast, the dog, the terrible sofa — and homesick has quietly turned into a future. Neat trick.', effects: { rizz: 5, bond: 7, partnerMood: 'buzzing', romantics: 3 } },
        },
      },
    },
  },
  // Partner · the plate you didn’t ask for.
  {
    id: 'li_enc_partner_eat', act: 2, weight: 1, tags: ['encounter', 'chat', 'date'],
    art: 'li_daybed',
    requires: { singleIs: false },
    context: 'Lunch · the daybed · a plate, delivered',
    prompt: '{partner} puts a plate in front of you without being asked. “You’ve not eaten proper since the recoupling. I’ve clocked it.” They sit. “I’m not having a go. I just — I notice you, yeah? And you’ve gone quiet in your body. Talk to me.”',
    recap: '{partner} notices you’ve stopped eating and gently calls it.',
    choices: {
      left: {
        label: 'Let them look after you',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: 'You wave it off — “I’m fine, honest” — without touching the plate, which rather makes their point. {partner} raises an eyebrow. The toast goes cold, meaningfully.', effects: { loyalty: 2, bond: 2, burnout: 3 } },
          good: { text: 'You admit the recoupling knocked you and let them sit with you while you eat. Small thing. Feels enormous. {partner} relaxes by the last bite.', effects: { loyalty: 4, bond: 5, burnout: -3 } },
          incredible: { text: 'You let yourself be looked after, fully, for once — and say why the recoupling rattled you. {partner} listens, then steals a chip. Care, returned in the only currency that matters.', effects: { loyalty: 5, bond: 8, partnerMood: 'buzzing', burnout: -3 } },
        },
      },
      right: {
        label: 'Deflect with a joke',
        tags: ['banter', 'camera'],
        governingStats: { charisma: 0.6, rizz: 0.4 },
        outcomes: {
          bad: { text: 'You turn it into a bit about villa portion sizes and {partner} lets you, but their face does the thing. “Okay,” they say. “When you’re ready.” They notice everything.', effects: { charisma: 2, bond: -2, partnerMood: 'torn', burnout: 2 } },
          good: { text: 'You joke, then eat, then quietly let the truth out sideways between mouthfuls. {partner} catches it, doesn’t push, just nudges the plate closer.', effects: { charisma: 4, bond: 4 } },
          incredible: { text: 'You make them laugh so hard about the plate that the guard drops on its own, and the real thing spills out easy. Best medicine, badly disguised as chips.', effects: { charisma: 5, bond: 6, followers: 3 } },
        },
      },
    },
  },
  // Partner · the ex, raised before a challenge can.
  {
    id: 'li_enc_partner_ex_ask', act: 2, weight: 1, tags: ['encounter', 'chat', 'date'],
    art: 'li_terrace',
    requires: { singleIs: false },
    context: 'Evening · the terrace · the ex, raised',
    prompt: '“Can I ask about your ex? You don’t have to.” {partner} says it carefully, testing the ice. “Only, you mentioned them once and then never again, and I’d rather hear it from you than clock it in a challenge. Where’d it all go wrong?” The terrace holds still.',
    recap: '{partner} carefully asks about your ex before a challenge does.',
    choices: {
      left: {
        label: 'Tell them the true version',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: 'You tell it, but you tell it angry, and the ex takes up more terrace than {partner} does. “Right,” they say. “They still live rent-free, then.” Ouch. Fair.', effects: { loyalty: 2, bond: 1, partnerMood: 'torn', burnout: 3 } },
          good: { text: '“It just ran out of road. No villain.” Honest, unbitter, done. {partner} nods, reassured — not by the story, by how lightly you carry it.', effects: { loyalty: 4, bond: 5 } },
          incredible: { text: 'You tell it straight, own your half, and land on why you’re glad it ended. {partner} exhales. “Good answer. Not for me — for you.” The ex leaves the terrace for good.', effects: { loyalty: 5, bond: 8, partnerMood: 'buzzing', selfrespect: 2 } },
        },
      },
      right: {
        label: 'Turn it into what you learned',
        tags: ['chat', 'strategy'],
        governingStats: { savvy: 0.5, loyalty: 0.5 },
        outcomes: {
          bad: { text: 'You go analytical — “attachment styles, innit” — and {partner} glazes. “I asked about a person, babe, not a TED talk.” Retreat.', effects: { savvy: 2, bond: -1, burnout: 2 } },
          good: { text: 'You skip the blow-by-blow and tell them what it taught you to want instead. {partner} clocks that they’re describing what you just described. Nice.', effects: { savvy: 4, bond: 4, romantics: 2 } },
          incredible: { text: 'You turn the ex into a map of what you now know you need — and {partner} realises, quietly, they’re standing on the X. “Well,” they say. “That’s me sorted.”', effects: { savvy: 5, bond: 7, partnerMood: 'buzzing', romantics: 3 } },
        },
      },
    },
  },
  // Partner · making it official before the villa tests it.
  {
    id: 'li_enc_partner_exclusive', act: 2, weight: 1, tags: ['encounter', 'date', 'loyal'],
    art: 'li_firepit',
    requires: { singleIs: false },
    context: 'Night · the firepit · the word, hovering',
    prompt: '“I want to ask you something and I need you dead honest.” {partner} finds your hand in the firelight. “Are we exclusive? Like, actually? Because I’m done keeping my options open and I want to say that out loud before anything tests it.” The something-that-tests-it is coming. You both know.',
    recap: '{partner} wants to make it official before the villa tests it.',
    choices: {
      left: {
        label: 'Say yes, out loud',
        tags: ['loyal', 'date'],
        governingStats: { loyalty: 0.6, rizz: 0.4 },
        outcomes: {
          bad: { text: 'You say yes but hedge it with “I mean, obviously, yeah, like—” until the yes needs subtitles. {partner} takes it. Barely legible, but taken.', effects: { loyalty: 3, bond: 4, burnout: 2 } },
          good: { text: '“Yeah. Just us.” Two words, no asterisks. {partner} closes their eyes a second like they’d been braced for the other answer.', effects: { loyalty: 4, bond: 7, partnerMood: 'buzzing' } },
          incredible: { text: '“I closed my options the day I met you, I just hadn’t said it.” {partner} goes quiet, then grins into the fire. The villa can send whoever it likes now.', effects: { loyalty: 5, bond: 9, partnerMood: 'buzzing', public: 3 } },
        },
      },
      right: {
        label: 'Be honest you’re not there yet',
        tags: ['chat', 'drama'],
        governingStats: { savvy: 0.5, loyalty: 0.5 },
        outcomes: {
          bad: { text: 'You ask for time and it comes out like a maybe. {partner} nods, wounded, filing it. “Course. No rush.” There is, slightly, a rush.', effects: { savvy: 2, bond: -2, partnerMood: 'torn', burnout: 3 } },
          good: { text: '“I’m nearly there. I don’t want to say it till I’d bet the house on it.” {partner} respects the honesty over an easy yes. Slower, but load-bearing.', effects: { savvy: 4, bond: 3, selfrespect: 2 } },
          incredible: { text: 'You explain exactly what you need to be sure, and it turns out small and reachable. {partner} nods. “Right. Let’s go get you sure, then.” Not a no. A plan.', effects: { savvy: 5, bond: 5, romantics: 2, selfrespect: 2 } },
        },
      },
    },
  },
  // Partner · the flicker of jealousy, named out loud.
  {
    id: 'li_enc_partner_jealous', act: 2, weight: 1, tags: ['encounter', 'chat', 'drama'],
    art: 'li_pool',
    requires: { singleIs: false },
    context: 'Afternoon · poolside · a look, clocked',
    prompt: '{partner} waits till you’re alone. “You and {rival} were proper giggling by the pool earlier.” Light voice, careful eyes. “I’m not being that person. I trust you. I just — my head did a thing, and I’d rather tell you than let it fester. Where are we?”',
    recap: '{partner} admits a flicker of jealousy over you and {rival}.',
    choices: {
      left: {
        label: 'Reassure, don’t dismiss',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: '“There’s nothing there, it’s in your head.” Technically true, tactically dreadful. {partner} nods and keeps the “in your head” to think about later.', effects: { loyalty: 2, bond: -1, partnerMood: 'torn', burnout: 3 } },
          good: { text: 'You don’t laugh it off — you thank them for saying it, then make it plain: banter, nothing under it. {partner} unclenches. “Ta for not making me feel mad.”', effects: { loyalty: 4, bond: 5 } },
          incredible: { text: 'You take the worry seriously, kill the ambiguity dead, and ask what they need. {partner} watches you choose them out loud. “That,” they say. “That’s the thing.”', effects: { loyalty: 5, bond: 8, partnerMood: 'buzzing', selfrespect: 2 } },
        },
      },
      right: {
        label: 'Flip it into flirting',
        tags: ['flirt', 'banter'],
        governingStats: { rizz: 0.6, charisma: 0.4 },
        outcomes: {
          bad: { text: '“Jealous, are we?” Wrong tool. {partner} bristles — “I’m being vulnerable, babe” — and the flirt curdles on the tiles.', effects: { rizz: 2, bond: -2, partnerMood: 'torn', burnout: 2 } },
          good: { text: 'You answer the worry first, then turn the reassurance flirty enough to fix the mood. {partner} rolls their eyes and stays, which is a win.', effects: { rizz: 4, bond: 4, romantics: 2 } },
          incredible: { text: 'You reassure them so warmly it becomes flirting, and by the end {partner}’s the one grinning about {rival} being no competition. Jealousy, alchemised into a good afternoon.', effects: { rizz: 5, bond: 6, romantics: 3, followers: 2 } },
        },
      },
    },
  },
  // Partner · the first inside joke, invented on the spot.
  {
    id: 'li_enc_partner_handshake', act: 1, weight: 1, tags: ['encounter', 'banter', 'date'],
    art: 'li_daybed',
    requires: { singleIs: false },
    context: 'Lazy afternoon · the daybed · a private language, forming',
    prompt: '“Okay, that’s ours now.” {partner} points at the two of you, delighted, after you both said the same daft thing at the same time. “That’s a thing. We do that now. Nobody else gets it.” They stick a hand out for a shake that has, apparently, just been invented.',
    recap: 'You and {partner} accidentally invent your first inside joke.',
    choices: {
      left: {
        label: 'Commit to the bit',
        tags: ['flirt', 'banter'],
        governingStats: { rizz: 0.6, charisma: 0.4 },
        outcomes: {
          bad: { text: 'You overbuild the handshake into a nine-part routine and lose it halfway. {partner} laughs at the wreckage. “We’ll workshop it.” The bit survives its own ambition.', effects: { rizz: 2, bond: 3, burnout: 2 } },
          good: { text: 'You add exactly one flourish and stop, and now it’s properly yours — deployable across the villa like a private frequency. {partner} beams every time it lands.', effects: { rizz: 4, bond: 5, romantics: 2 } },
          incredible: { text: 'By evening the handshake has lore, a name, and an origin story you’ll both defend to the death. The villa’s baffled. That’s the point. First artefact of an actual couple.', effects: { rizz: 5, bond: 7, partnerMood: 'buzzing', romantics: 3 } },
        },
      },
      right: {
        label: 'Let it mean more than a joke',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 0.6, rizz: 0.4 },
        outcomes: {
          bad: { text: 'You get earnest too fast — “this is what I mean about us” — and the daft moment buckles under the weight. {partner} smiles, kindly. “Easy, tiger.”', effects: { loyalty: 2, bond: 2, burnout: 2 } },
          good: { text: 'You let the silly thing be quiet proof — you two speak a language nobody taught you. {partner} clocks the meaning under the joke and holds your eye a beat.', effects: { loyalty: 4, bond: 5, romantics: 2 } },
          incredible: { text: 'You say the true thing lightly — “this is the bit I’ll miss” — and it lands without crushing the joke. {partner} goes soft. The handshake now means something. Ridiculous. Real.', effects: { loyalty: 5, bond: 8, partnerMood: 'buzzing' } },
        },
      },
    },
  },
  // Bombshell · the day-one flattery, aimed at you.
  {
    id: 'li_enc_bomb_flatter', act: 2, weight: 1, tags: ['encounter', 'chat', 'temptation'],
    art: 'li_daybed',
    context: 'Day one · the daybed · the newcomer, aiming',
    prompt: '“I’m gonna be dead honest — you’re the one I clocked walking in.” {bombshell} sits close, all eye contact. “I know you’re coupled. I’m not here to be messy. I just believe in going after what I want, and I’d not forgive myself if I didn’t pull you for a chat. So. Here I am.”',
    recap: 'A new {bombshell} pulls you first and lays it on thick.',
    choices: {
      left: {
        label: 'Shut it down kindly',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: 'You go so stiff and formal about it that it reads as protesting too much. {bombshell} smiles. “Interesting.” Not the exit you wanted.', effects: { loyalty: 2, bond: 2, burnout: 3 } },
          good: { text: '“I’m flattered, genuinely — but I’m happy where I am.” Warm, final, no wobble. {bombshell} nods, reroutes, no hard feelings. Loyalty, on the record.', effects: { loyalty: 5, bond: 4, selfrespect: 2 } },
          incredible: { text: 'You thank them, mean it, and make your couple sound so solid that {bombshell} actually roots for it. “Fair play. He’s lucky.” Threat, converted to fan.', effects: { loyalty: 6, bond: 5, public: 4 } },
        },
      },
      right: {
        label: 'Enjoy it, harmlessly',
        tags: ['flirt', 'banter'],
        governingStats: { charisma: 0.6, rizz: 0.4 },
        outcomes: {
          bad: { text: 'You bask a beat too long and the daybed clocks it — including, later, {partner}. The compliment was free. The optics weren’t.', effects: { charisma: 2, bond: -3, partnerMood: 'torn', burnout: 3 } },
          good: { text: 'You take the compliment, volley one back, and keep the whole thing firmly in banter. {bombshell} laughs. No harm, decent telly, options noted and declined.', effects: { charisma: 4, followers: 3, bond: 1 } },
          incredible: { text: 'You out-charm the charmer so smoothly {bombshell} forgets they were pulling you. “You’re trouble,” they say, admiring, retreating. You keep the frame and the couple.', effects: { charisma: 6, followers: 4, public: 3 } },
        },
      },
    },
  },
  // Bombshell · the reconnaissance, disguised as help-me-out.
  {
    id: 'li_enc_bomb_scout', act: 2, weight: 1, tags: ['encounter', 'strategy', 'gossip'],
    art: 'li_terrace',
    context: 'Day two of the newcomer · the terrace · reconnaissance',
    prompt: '“Help me out — I’ve walked in blind.” {bombshell} leans in, conspiratorial. “Who in here’s genuine and who’s playing a game? I can’t read it yet and I don’t wanna waste my energy on the wrong people. Between us, yeah?” They’re not new to this. They’re auditioning you.',
    recap: 'A {bombshell} fishes you for reads on who’s fake.',
    choices: {
      left: {
        label: 'Give nothing away',
        tags: ['strategy'],
        governingStats: { savvy: 1 },
        outcomes: {
          bad: { text: 'You dodge so obviously it’s its own answer. “So YOU’RE a player,” {bombshell} grins. You’ve told them exactly one thing: you can’t be read. Which is a read.', effects: { savvy: 3, burnout: 2 } },
          good: { text: '“Everyone in here’s genuine, babe. Give it a week.” You hand back a smooth nothing. {bombshell} respects the wall and files you under <i>careful</i>.', effects: { savvy: 5, selfrespect: 2 } },
          incredible: { text: 'You answer at length and say precisely nothing usable, then turn it so they’re the one talking. Ten minutes later they’ve scouted themselves. Textbook.', effects: { savvy: 8, public: 3, gainIntel: { about: 'rival', label: 'the newcomer’s reads — offered up while fishing for yours' } } },
        },
      },
      right: {
        label: 'Feed them a little truth',
        tags: ['chat', 'strategy'],
        governingStats: { savvy: 0.5, charisma: 0.5 },
        outcomes: {
          bad: { text: 'You name one name to seem helpful and watch it become currency by dinner. Now you’re a source. Sources get spent.', effects: { savvy: 2, drama: 3, burnout: 3 } },
          good: { text: 'You give one harmless, true read — a warmth, not a warning — and buy some goodwill without arming anyone. {bombshell} takes it as a handshake.', effects: { savvy: 4, followers: 2 } },
          incredible: { text: 'You trade one small truth for their whole first impression of the villa, and come away knowing exactly how the newcomer sees the board. Cheap price, rich intel.', effects: { savvy: 6, public: 2, gainIntel: { about: 'rival', label: 'how the newcomer maps the whole villa' } } },
        },
      },
    },
  },
  // Bombshell · the small world of someone you half-know.
  {
    id: 'li_enc_bomb_smallworld', act: 2, weight: 1, tags: ['encounter', 'chat', 'strategy'],
    art: 'li_kitchen',
    context: 'Evening · the kitchen · a face you half-know',
    prompt: '“Wait — do we…?” {bombshell} squints, then it clicks for both of you. “We do. Your mate’s birthday, that bar in Leeds, two summers back.” A tiny world just got smaller on national telly. “This is mad. Does anyone else know we’ve met?” Nobody does. Yet.',
    recap: 'A {bombshell} turns out to be someone you half-know from outside.',
    choices: {
      left: {
        label: 'Get ahead of it',
        tags: ['strategy', 'camera'],
        governingStats: { savvy: 0.6, charisma: 0.4 },
        outcomes: {
          bad: { text: 'You announce it to the room to look clean and it lands as a bombshell of your own. Now it’s A Thing, and you built it. Great work.', effects: { savvy: 2, drama: 4, burnout: 3 } },
          good: { text: 'You flag it to {partner} first, then the room, calm and boring. No secret, no fuel. The villa loses interest in ninety seconds. Perfect.', effects: { savvy: 5, bond: 3, public: 2 } },
          incredible: { text: 'You turn the coincidence into a warm, nothing-to-see anecdote before anyone can spin it, and bring {partner} in on the telling. Rumour: starved at birth.', effects: { savvy: 6, bond: 4, public: 3, followers: 2 } },
        },
      },
      right: {
        label: 'Feel it out first',
        tags: ['chat', 'strategy'],
        governingStats: { savvy: 0.5, loyalty: 0.5 },
        outcomes: {
          bad: { text: 'You keep it quiet to “see where it goes,” and where it goes is a whisper that you two have history. You don’t. Now you’re proving a negative.', effects: { savvy: 2, drama: 3, partnerMood: 'torn', burnout: 3 } },
          good: { text: 'You pull {bombshell} aside, agree there’s nothing to it, and line up your stories before the villa can invent one. Two adults, one boring truth, kept boring.', effects: { savvy: 4, selfrespect: 2 } },
          incredible: { text: 'You quietly establish it’s ancient and harmless, learn where their head’s really at, and walk off with a low-key ally instead of a landmine. Same world, played well.', effects: { savvy: 6, followers: 2, gainIntel: { about: 'rival', label: 'the newcomer’s real game — traded on old-mates trust' } } },
        },
      },
    },
  },
  // Bombshell · the wingman request for your mate.
  {
    id: 'li_enc_bomb_wingman', act: 2, weight: 1, tags: ['encounter', 'chat', 'loyal'],
    art: 'li_pool',
    context: 'Poolside · the newcomer, recruiting',
    prompt: '“You’re close with {mate}, yeah?” {bombshell} keeps it low, almost shy for once. “I properly fancy them and I’m bricking it. Would you — I dunno — put in a word? Tell them I’m not a knobhead? I never do this, swear down. There’s just something about them.” Genuine. Possibly.',
    recap: 'A {bombshell} asks you to wingman them to {mate}.',
    choices: {
      left: {
        label: 'Do it, but honestly',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 0.6, charisma: 0.4 },
        outcomes: {
          bad: { text: 'You oversell them and {mate} smells a setup a mile off. “Since when are YOU their PR?” Now you’ve spent trust on a stranger. Hmm.', effects: { loyalty: 2, burnout: 3 } },
          good: { text: 'You tell {mate} the true bits only — “they seem sound, worth a chat” — and leave the rest to them. Honest broker. Nobody owes anybody.', effects: { loyalty: 4, followers: 2 } },
          incredible: { text: 'You give {mate} an honest read and {bombshell} an honest warning — hurt my mate and I’m involved. Both respect it. You just made a match without selling your soul.', effects: { loyalty: 5, selfrespect: 2, public: 3 } },
        },
      },
      right: {
        label: 'Vet them first',
        tags: ['strategy', 'chat'],
        governingStats: { savvy: 0.6, loyalty: 0.4 },
        outcomes: {
          bad: { text: 'You interrogate them so hard they back off entirely. Maybe they were sound. You’ll never know, and neither will {mate}. Overcooked.', effects: { savvy: 2, burnout: 3 } },
          good: { text: 'You ask the questions {mate} would want asked, and the answers hold up. “Alright,” you say. “I’ll mention you. No promises.” Due diligence, done.', effects: { savvy: 4, loyalty: 2 } },
          incredible: { text: 'You quietly test their intentions, find them real, and clock some useful intel on the way. {mate} gets a vouch they can trust, and you keep the receipts. Everyone wins, you most.', effects: { savvy: 6, loyalty: 3, gainIntel: { about: 'rival', label: 'the newcomer’s real read on the villa, given while wooing {mate}' } } },
        },
      },
    },
  },
  // Ex · the surprise arrival.
  {
    id: 'li_enc_ex_arrival', act: 2, weight: 1, tags: ['encounter', 'drama', 'chat'],
    art: 'li_bombshell',
    context: 'Day of the newcomer · the lawn · a face you know too well',
    prompt: '“Surprise,” says {ex}, walking in like they own the lawn, because for a while they owned you. “Bet you didn’t have this on your bingo card.” The villa doesn’t know yet. {ex} smiles at you — the exact smile from the last row you ever had. “We should chat. Properly.”',
    recap: 'Your {ex} strolls into the villa as a bombshell.',
    choices: {
      left: {
        label: 'Set the terms now',
        tags: ['strategy', 'chat'],
        governingStats: { savvy: 0.6, loyalty: 0.4 },
        outcomes: {
          bad: { text: 'You get defensive before they’ve done anything, and the villa clocks the temperature. “Ooh, history,” someone says. {ex} spreads their hands, innocent. Advantage: theirs.', effects: { savvy: 2, drama: 4, burnout: 4 } },
          good: { text: '“We can chat. Once. And you don’t come near mine.” Boundary set in daylight, witnessed. {ex} shrugs. “Same old you.” Line held.', effects: { savvy: 5, selfrespect: 3, public: 2 } },
          incredible: { text: 'You greet them so calmly the whole entrance deflates — no drama to mine, no wound to poke. {ex} recalibrates in real time. “You’ve grown up,” they say, annoyed. You have.', effects: { savvy: 6, selfrespect: 3, public: 4 } },
        },
      },
      right: {
        label: 'Tell your partner first',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: 'You get to {partner}, but the nerves make it sound like a confession. “Should I be worried?” they ask. “No,” you say, unconvincingly. Work to do.', effects: { loyalty: 2, bond: -1, partnerMood: 'torn', burnout: 3 } },
          good: { text: 'You reach {partner} before {ex} can — the whole history, unglamorous, no spin. “Ta for telling me first,” they say. The bombshell just lost its detonator.', effects: { loyalty: 4, bond: 5, partnerMood: 'buzzing' } },
          incredible: { text: 'You brief {partner} completely, then face {ex} together, hand in hand. {ex} came to split an atom and found a wall. “Right,” they say. “Never mind.” Immaculate.', effects: { loyalty: 5, bond: 8, partnerMood: 'buzzing', public: 3 } },
        },
      },
    },
  },
  // Ex · the apology on the beach.
  {
    id: 'li_enc_ex_closure', act: 2, weight: 1, tags: ['encounter', 'chat', 'drama'],
    art: 'li_beach',
    context: 'The beach · a chat two years late',
    prompt: '“I didn’t come in here for you, before you say it.” {ex} draws a circle in the sand with one toe. “But since we’re both here — I never said sorry for how it ended. And I’ve wanted to. So. I’m sorry. That’s it. No angle.” The sea does its thing. For once they might mean it.',
    recap: '{ex} offers a genuine-sounding apology on the beach.',
    choices: {
      left: {
        label: 'Accept it, close it',
        tags: ['chat', 'loyal'],
        governingStats: { loyalty: 0.6, savvy: 0.4 },
        outcomes: {
          bad: { text: 'You accept it, but the old grievance leaks out too — a footnote, then an appendix. {ex} takes it. “Fair,” they say. Closure, with a rider.', effects: { loyalty: 2, selfrespect: 2, burnout: 3 } },
          good: { text: '“Thank you. I mean it.” You take the apology, hand back one of your own, and let the whole thing finally set. Two years of leftover it, closed on a beach in about ninety seconds.', effects: { loyalty: 4, selfrespect: 3, bond: 2 } },
          incredible: { text: 'You accept it cleanly, wish them well, and feel the last little hook come loose. {ex} smiles, lighter too. You walk back to {partner} genuinely free of it. That’s the win.', effects: { loyalty: 5, selfrespect: 3, bond: 3, public: 3 } },
        },
      },
      right: {
        label: 'Stay guarded',
        tags: ['strategy'],
        governingStats: { savvy: 1 },
        outcomes: {
          bad: { text: 'You keep the wall so high the apology bounces off, and now you look cold on telly for no gain. {ex} shrugs. “Worth a try.” Was it, though.', effects: { savvy: 2, drama: 2, burnout: 3 } },
          good: { text: '“Appreciated. We’re still not mates.” Boundary and grace, both. {ex} nods — they didn’t expect the mates part anyway. Clean.', effects: { savvy: 4, selfrespect: 3 } },
          incredible: { text: 'You take the apology at face value, give nothing back you don’t mean, and read exactly why they’re really here while you do. {ex} leaves with less than they hoped.', effects: { savvy: 6, selfrespect: 3, public: 2, gainIntel: { about: 'rival', label: 'the real reason {ex} came in — read off the apology' } } },
        },
      },
    },
  },
  // Mate · caught in the middle of their row.
  {
    id: 'li_enc_mate_mediate', act: 2, weight: 1, tags: ['encounter', 'chat', 'drama'],
    art: 'li_kitchen',
    context: 'Morning · the kitchen · caught in the middle',
    prompt: '“You’ve got to help me, you’re the only one both of us trust.” {mate} corners you by the toaster, frantic. “Me and them have had this stupid row and now it’s the whole villa’s business and I don’t even remember how it started. Can you just — get us in a room? Be the sensible one?”',
    recap: '{mate} begs you to mediate a row that’s spiralled villa-wide.',
    choices: {
      left: {
        label: 'Broker the peace',
        tags: ['chat', 'loyal'],
        governingStats: { loyalty: 0.5, charisma: 0.5 },
        outcomes: {
          bad: { text: 'You get them in a room and it reignites in ninety seconds, with you in the crossfire. “Whose side are you on?” Both. Neither. Ow.', effects: { loyalty: 2, drama: 3, burnout: 4 } },
          good: { text: 'You get them talking, keep the temperature down, and steer them to the real grievance under the daft one. They shake on it. Peacekeeper: you.', effects: { loyalty: 4, charisma: 3 } },
          incredible: { text: 'You run the sit-down like a pro — each says their bit, you translate, nobody storms off — and they leave mates again. The villa’s stunned. Diplomatic immunity: earned.', effects: { loyalty: 5, charisma: 3, public: 4, selfrespect: 2 } },
        },
      },
      right: {
        label: 'Stay out of it, kindly',
        tags: ['strategy', 'chat'],
        governingStats: { savvy: 1 },
        outcomes: {
          bad: { text: 'You decline and it lands as not caring. {mate} deflates. “Right. No worries.” It very much sounds like worries.', effects: { savvy: 2, burnout: 2 } },
          good: { text: '“I’ll help you sort your head, but I’m not refereeing.” {mate} gets it — a mate, not a middleman. You keep the trust and the neutrality both.', effects: { savvy: 4, loyalty: 2, selfrespect: 2 } },
          incredible: { text: 'You coach {mate} to fix it themselves — one sentence to lead with, one thing not to say — and off they go, and it works. You never entered the ring and still won it.', effects: { savvy: 6, loyalty: 3 } },
        },
      },
    },
  },
  // Rival · the guard down on the Hideaway steps.
  {
    id: 'li_enc_rival_confide', act: 2, weight: 1, tags: ['encounter', 'chat', 'loyal'],
    art: 'li_hideaway',
    context: 'Late · the Hideaway landing · a guard, briefly down',
    prompt: 'You find {rival} sat alone on the Hideaway steps, no audience, no game face. “Don’t make it weird,” they say. “I’m just having a moment. My head’s all over the place tonight and everyone in there thinks I’m fine because I’m always fine.” A pause. “You’re not gonna use this, are you.”',
    recap: 'You catch {rival} off-guard and unusually human on the steps.',
    choices: {
      left: {
        label: 'Be decent about it',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: 'You’re kind, but you can’t help saying “this is a lot, coming from you,” and the shutters slam. “Forget it,” says {rival}. Moment: gone.', effects: { loyalty: 2, rivalOpinion: 2, burnout: 3 } },
          good: { text: '“I’m not gonna use it. Sit there as long as you want.” You mean it, and {rival} can tell. Something recalibrates that no vote can undo.', effects: { loyalty: 4, rivalOpinion: 6 } },
          incredible: { text: 'You sit down, say nothing clever, and just let them be a person for ten minutes. {rival} tells you the real thing under the game. “Well,” they say after. “Now I owe you.”', effects: { loyalty: 5, rivalOpinion: 9, gainIntel: { about: 'rival', label: 'what’s actually driving them — told on the steps, off-guard' } } },
        },
      },
      right: {
        label: 'Note it, stay wary',
        tags: ['strategy', 'chat'],
        governingStats: { savvy: 0.6, loyalty: 0.4 },
        outcomes: {
          bad: { text: 'You’re warm on the surface and clearly filing underneath, and {rival} clocks it. “Right. Course you are.” They stand, restored to villain. Chance missed.', effects: { savvy: 2, rivalOpinion: -3, burnout: 2 } },
          good: { text: 'You’re kind and careful both — comfort offered, guard kept. {rival} takes the comfort and respects the guard. Two players, one honest minute.', effects: { savvy: 4, rivalOpinion: 3 } },
          incredible: { text: 'You give real comfort and lose none of your read, and by the end you understand {rival} better than anyone in the villa does. Useful. Also, weirdly, sad.', effects: { savvy: 6, rivalOpinion: 4, gainIntel: { about: 'rival', label: 'the fear under the game — clocked while comforting them' } } },
        },
      },
    },
  },
  // Mate · the drunk-honest firepit after the party.
  {
    id: 'li_enc_mate_lastnight', act: 2, weight: 1, tags: ['encounter', 'chat', 'loyal'],
    art: 'li_firepit',
    context: 'After the party · the firepit · one drink past honest',
    prompt: '{mate} flops down beside you, one prosecco past sensible. “I love you, d’you know that? No, listen — LISTEN.” They grab your arm. “You’re the best thing about this whole place, and if we weren’t both mad busy grafting I’d have— anyway. You’re my person in here. Don’t tell anyone I got soppy.”',
    recap: 'A tipsy {mate} gets soppy and sincere by the firepit.',
    choices: {
      left: {
        label: 'Take it to heart',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: 'You get soppy back and it spirals into a two-person cry the night camera adores. Mortifying. Also, kind of nice. You’ll deny it tomorrow.', effects: { loyalty: 3, burnout: 2, followers: 2 } },
          good: { text: '“You’re my person too, you soft thing.” You bank it properly, water and all, and get them to bed before the tears photograph. Best mates, sealed.', effects: { loyalty: 4, selfrespect: 2 } },
          incredible: { text: 'You take the drunk truth seriously without making it heavy, tell them one true thing back, and steer them home. In the morning they half-remember. You remember all of it.', effects: { loyalty: 5, burnout: -2 } },
        },
      },
      right: {
        label: 'Keep them out of trouble',
        tags: ['rest', 'chat'],
        governingStats: { loyalty: 0.6, savvy: 0.4 },
        outcomes: {
          bad: { text: 'You go full mum-mode and {mate} rebels — “I’m FINE” — loud enough to wake the daybed. You win eventually. The lawn gets a show first.', effects: { loyalty: 2, drama: 2, burnout: 3 } },
          good: { text: 'You laugh, agree you’re both amazing, and quietly water-and-bed them before the prosecco says anything villa-wide. Guardian angel, unpaid.', effects: { loyalty: 4, burnout: -2 } },
          incredible: { text: 'You catch the soppy, save the secret, and get {mate} horizontal before they can declare anything to anyone. In the morning they just know you had their back. Which you did.', effects: { loyalty: 5, selfrespect: 2 } },
        },
      },
    },
  },
  // Bombshell · the very late arrival demanding the map.
  {
    id: 'li_enc_bomb_lastmin', act: 3, weight: 1, tags: ['encounter', 'strategy', 'chat'],
    art: 'li_lawn',
    context: 'Final Week · the lawn · a very late arrival',
    prompt: '“Right, no time to waste — talk me through it.” {bombshell} arrives with days left and the manners of someone double-parked. “Who’s solid, who’s wobbling, who’s winning the public? I’ve got about a week to make an impression and I need the map. You look like you actually pay attention.” Flattery, at speed.',
    recap: 'A last-minute {bombshell} demands the lay of the land at speed.',
    choices: {
      left: {
        label: 'Send them off-target',
        tags: ['strategy', 'drama'],
        governingStats: { savvy: 1 },
        outcomes: {
          bad: { text: 'You feed them a duff map to protect your couple and they cross-check it by dinner. Now you’re the one who lied to the new kid. Small villa. Long memory.', effects: { savvy: 2, drama: 3, burnout: 3 } },
          good: { text: 'You point them at the drama that isn’t yours — plenty of it — and leave your couple off the tour entirely. {bombshell} thanks you and bothers someone else. Ideal.', effects: { savvy: 5, bond: 2, public: 2 } },
          incredible: { text: 'You give a map so helpful and so precisely couple-free that {bombshell} never even considers you a target. By the time they realise, it’s Friday. Masterful misdirection.', effects: { savvy: 8, bond: 3, public: 4 } },
        },
      },
      right: {
        label: 'Give them the honest map',
        tags: ['chat', 'strategy'],
        governingStats: { savvy: 0.5, charisma: 0.5 },
        outcomes: {
          bad: { text: 'You tell it straight and watch them beeline for exactly the couple you should’ve protected. Honesty’s lovely. Timing’s everything. Oops.', effects: { savvy: 2, bond: -2, drama: 3, burnout: 3 } },
          good: { text: 'You give an honest read, your couple included, and trust it to hold. {bombshell} respects the straightness and picks a different fight. It held.', effects: { savvy: 4, bond: 3, selfrespect: 2 } },
          incredible: { text: 'You give the true map and, in the giving, learn everything about how {bombshell} plans to spend their week. They walk off armed. So do you, better.', effects: { savvy: 6, public: 2, gainIntel: { about: 'rival', label: 'the late arrival’s whole week-one plan' } } },
        },
      },
    },
  },

  // ---------- Final doubling pass · fresh one-on-one situations (open cards) ----------
  // Novel villa micro-situations not covered elsewhere: the sweepstake, the
  // sleep-talk, the one book, real-job-vs-persona, the recoupling rehearsal,
  // teaching a mate to swim, the adopted gecko, the un-clocked birthday.
  // Dialogue-first; sincere argot in quotes, dry narration between.
  {
    id: 'li_enc_nickname', act: 2, weight: 1, tags: ['encounter', 'banter', 'camera'],
    art: 'li_lawn',
    context: 'Afternoon · the loungers · a name being fitted',
    prompt: '“We’ve been trying to land your nickname.” {rival} says it like a gift, grinning. “Everyone gets one, it’s villa law. I put a couple of options forward for you—” a beat, delighted “—and I’m not gonna lie, the frontrunner’s not the flattering one. But it’s stuck now, babe. That’s just how these things go.”',
    recap: '{rival} reveals the villa’s coined you a nickname — an unflattering one.',
    choices: {
      left: {
        label: 'Own the bad nickname',
        tags: ['banter', 'camera'],
        governingStats: { charisma: 0.6, savvy: 0.4 },
        outcomes: {
          bad: { text: '“Love it, put it on a T-shirt.” You say it a beat too fast and {rival} clocks that it stung. The nickname sticks precisely because you flinched. Villa physics, that.', effects: { charisma: 2, burnout: 3 } },
          good: { text: 'You wear the daft name like a medal and it loses its teeth by lunch. {rival} looks faintly robbed. You can’t weaponise a nickname its owner’s already laughing at.', effects: { charisma: 5, public: 3, followers: 2 } },
          incredible: { text: 'You lean so hard into the bad nickname it becomes a catchphrase, a bit, a whole personality. By teatime it’s affectionate. {rival} has accidentally made you the villa’s favourite. Whoops.', effects: { charisma: 8, public: 5, followers: 4 } },
        },
      },
      right: {
        label: 'Rebrand yourself first',
        tags: ['strategy', 'banter'],
        governingStats: { savvy: 0.6, charisma: 0.4 },
        outcomes: {
          bad: { text: 'You try to launch a cooler nickname yourself and the villa smells the campaign instantly. Now you’re “the one who named themselves.” Worse. Objectively, measurably worse.', effects: { savvy: 2, burnout: 3 } },
          good: { text: 'You quietly seed a better name through {mate} and let it spread on its own. By evening {rival}’s version has died a natural death. Nobody clocks you did it. That’s the craft.', effects: { savvy: 5, selfrespect: 2 } },
          incredible: { text: '“Call me what you like — I’ll answer to whichever one wins the public.” {rival}’s grin falters. You’ve turned a nickname into a vote strategy in one sentence. They almost applaud.', effects: { savvy: 8, public: 3, selfrespect: 2 } },
        },
      },
    },
  },
  {
    id: 'li_enc_daft_debate', act: 2, weight: 1, tags: ['encounter', 'banter', 'date'],
    art: 'li_daybed',
    context: 'Afternoon · the daybed · a very serious silly question',
    prompt: '“No, listen — this is important.” {partner} is deadly serious about something extremely not. “If the villa flooded, right, and you could only save one person and one snack — and the snack was the good cheese — who’s the person? And don’t say me to be nice. I need to know how your head actually works.” Arms folded. This is, apparently, a test.',
    recap: '{partner} traps you in a ludicrous hypothetical and treats it as a real test.',
    choices: {
      left: {
        label: 'Play it dead straight',
        tags: ['banter', 'chat'],
        governingStats: { charisma: 0.5, rizz: 0.5 },
        outcomes: {
          bad: { text: 'You over-engineer it — flood logistics, cheese refrigeration, an evacuation plan — until {partner} regrets asking. “I wanted a laugh, not a risk assessment.” You gave them a seminar.', effects: { charisma: 2, burnout: 2 } },
          good: { text: 'You commit fully to the stupid premise and defend your pick — the cheese, obviously — so earnestly {partner} loses it. Ten minutes of nonsense, and somehow you know each other better.', effects: { charisma: 5, bond: 4 } },
          incredible: { text: 'The debate escalates into a full villa referendum with sides and a manifesto, and it’s the week’s running joke — but under it, the two of you in perfect daft sync, is the actual thing.', effects: { charisma: 8, bond: 5, followers: 3 } },
        },
      },
      right: {
        label: 'Turn it back on them',
        tags: ['flirt', 'banter'],
        governingStats: { rizz: 0.6, charisma: 0.4 },
        outcomes: {
          bad: { text: 'You flip the question back and it comes out competitive instead of playful. {partner} narrows their eyes. “Why won’t you just ANSWER.” The game curdles into a small real standoff.', effects: { rizz: 2, bond: -1, burnout: 2 } },
          good: { text: 'You lob back a worse dilemma and now you’re both deep in a hypothetical arms race, howling. The daft debate is its own date — better than half the ones production arranges.', effects: { rizz: 5, bond: 4, followers: 2 } },
          incredible: { text: 'You two build an entire absurd rulebook for the flooded villa — cheese priorities, a line of succession — and by the end you’ve accidentally mapped exactly how you’d look after each other. Under the daft, the real.', effects: { rizz: 8, bond: 6, romantics: 2 } },
        },
      },
    },
  },
  {
    id: 'li_enc_impression', act: 2, weight: 1, tags: ['encounter', 'banter', 'camera'],
    art: 'li_lawn',
    context: 'Afternoon · the lawn · a performance of you',
    prompt: '“You have NOT seen my impression of you? Everyone’s seen it.” {rival} is already up, doing the walk, the catchphrase, the way you apparently hold your drink. It is, devastatingly, accurate. The lawn is crying. “I do it with love,” they add, not entirely with love. “Don’t take it bad, babe. Means you’re memorable.”',
    recap: '{rival} performs a devastatingly accurate impression of you for the lawn.',
    choices: {
      left: {
        label: 'Do them right back',
        tags: ['banter', 'camera'],
        governingStats: { charisma: 0.6, rizz: 0.4 },
        outcomes: {
          bad: { text: 'You launch an impression of {rival} and fumble it — too mean, not sharp enough — and the lawn’s laughter curdles. {rival} takes the crown back with a bow. Out-done on your own turf.', effects: { charisma: 2, burnout: 3 } },
          good: { text: 'You fire back an impression of {rival} so fond and so accurate they have to laugh at themselves. Mutual demolition, no blood. The lawn calls it a draw and demands an encore.', effects: { charisma: 5, public: 3, followers: 2 } },
          incredible: { text: 'You top their bit with one of your own that nails a tiny true thing about {rival} nobody else clocked. They gasp, delighted and slightly exposed. You won the lawn and read them in one go.', effects: { charisma: 8, public: 5, followers: 4 } },
        },
      },
      right: {
        label: 'Ask what they actually see',
        tags: ['strategy', 'chat'],
        governingStats: { savvy: 0.6, charisma: 0.4 },
        outcomes: {
          bad: { text: 'You ask what the impression’s based on and {rival} gleefully lists your habits back to you. Now you can’t stop noticing yourself doing them. Self-consciousness, gift-wrapped.', effects: { savvy: 2, burnout: 3 } },
          good: { text: 'You ask, genuinely, and under the caricature there’s a sharp, almost fond read of exactly who you are in here. {rival} clocks more than they let on. Useful, knowing what they see.', effects: { savvy: 5, selfrespect: 2 } },
          incredible: { text: '“Do it again — I want to know what I look like to you.” {rival} obliges, and inside the joke is a whole map of how they’ve read you all season. You take the map. They didn’t mean to draw it.', effects: { savvy: 8, public: 3, selfrespect: 2 } },
        },
      },
    },
  },
  {
    id: 'li_enc_real_job', act: 2, weight: 1, tags: ['encounter', 'chat', 'strategy'],
    art: 'li_pool',
    context: 'Afternoon · the pool steps · the gloss and the truth under it',
    prompt: '“Can I trust you with something daft?” {bombshell} drops their voice by the pool. “My bio says ‘model.’ I’m a mortgage adviser. From Slough. I panicked at the casting and now I’ve got to be this—” they gesture at the whole glossy package “—for six weeks. You seem sound. Please don’t out me over the Instagram.”',
    recap: 'A {bombshell} confesses their villa persona is nothing like their real job.',
    choices: {
      left: {
        label: 'Keep their secret',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 0.7, savvy: 0.3 },
        outcomes: {
          bad: { text: 'You swear to keep it and then can’t look at their bio without smirking. {bombshell} clocks the smirk immediately. “You’re gonna be weird about this, aren’t you.” You are, a bit.', effects: { loyalty: 2, burnout: 2 } },
          good: { text: '“Safe with me. Mortgage adviser’s fitter than model anyway.” {bombshell} sags with relief. One person in here who’s met the real them. That buys a lot of goodwill.', effects: { loyalty: 5, selfrespect: 2 } },
          incredible: { text: 'You keep it so completely that when the villa tries to catch them out, you cover before they even ask. {bombshell} owes you now, quietly and permanently. Best kind of ally to bank.', effects: { loyalty: 6, public: 3, selfrespect: 2 } },
        },
      },
      right: {
        label: 'Trade a truth back',
        tags: ['strategy', 'chat'],
        governingStats: { savvy: 0.6, charisma: 0.4 },
        outcomes: {
          bad: { text: 'You swap them a secret of your own and instantly regret the exchange rate. Now you’re both holding grenades and hoping neither of you fumbles one. Tense, poolside.', effects: { savvy: 2, burnout: 3 } },
          good: { text: 'You trade one real thing for another — your dull day job for theirs — and suddenly it’s two humans by the pool, not two brands circling. Levelling, that.', effects: { savvy: 5, followers: 2 } },
          incredible: { text: 'You trade honesty for honesty and walk off knowing exactly who {bombshell} really is under the gloss. Useful. Also, annoyingly, you now quite like them.', effects: { savvy: 8, followers: 2, public: 2 } },
        },
      },
    },
  },
  {
    id: 'li_enc_recoup_rehearsal', act: 2, weight: 1, tags: ['encounter', 'chat', 'date'],
    art: 'li_bedroom',
    context: 'Evening · the dressing room · caught mid-rehearsal',
    prompt: 'You catch {partner} mouthing something at the mirror, hand on heart, then dropping it the second they clock you. “Nothing. Wasn’t doing anything.” A beat. “Fine — I was practising. For if there’s a recoupling. I wanted the words right for once, instead of bottling it. Don’t tell anyone I rehearse. Ruins the magic.”',
    recap: 'You catch {partner} secretly rehearsing a speech they won’t admit to.',
    choices: {
      left: {
        label: 'Help them get it right',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 0.6, charisma: 0.4 },
        outcomes: {
          bad: { text: 'You give notes and it balloons into a whole production — cue cards, a second draft, blocking. By the end the speech is flawless and sounds nothing like them. Back to the mirror.', effects: { loyalty: 2, burnout: 3 } },
          good: { text: 'You cut it to one true line and drill it till it’s theirs. “That’s the one,” {partner} says, steadier. Whatever the villa throws now, they’ve got their words ready.', effects: { loyalty: 5, bond: 4 } },
          incredible: { text: 'You help them find the sentence they actually mean, and hearing it out loud in rehearsal wrecks you both a little. The speech is ready. So, quietly, are you.', effects: { loyalty: 8, bond: 6, public: 3 } },
        },
      },
      right: {
        label: 'Tell them not to script it',
        tags: ['chat', 'rest'],
        governingStats: { rizz: 0.5, loyalty: 0.5 },
        outcomes: {
          bad: { text: '“Just say what you feel” — easy for you, apparently. {partner} deflates. “That’s the bit I can’t do without practising.” You’ve talked them out of their only safety net.', effects: { rizz: 2, burnout: 2 } },
          good: { text: '“You don’t need a script for me.” {partner} lets the imaginary cue cards drop. “Yeah?” “Yeah.” Simpler than they’d feared — saying it to a face, not a mirror.', effects: { loyalty: 4, bond: 5 } },
          incredible: { text: 'You get them to bin the speech and just tell you the messy real version now, no ceremony. It’s better than anything rehearsed. “Oh,” says {partner}. “That’s what I meant to say.”', effects: { loyalty: 5, bond: 8, romantics: 2 } },
        },
      },
    },
  },
  {
    id: 'li_enc_teach_swim', act: 1, weight: 1, tags: ['encounter', 'rest', 'loyal'],
    art: 'li_pool',
    context: 'Afternoon · the shallow end · a quiet confession',
    prompt: '“Right, this is mortifying, so.” {mate} pulls you to the shallow end, glancing round. “I can’t actually swim. Never learned. And there’s a water challenge coming and I’m bricking it. Can you teach us? On the quiet? If this villa finds out I’ll never hear the end of it. Please. I trust you.”',
    recap: '{mate} admits they can’t swim and asks you to teach them, quietly.',
    choices: {
      left: {
        label: 'Teach them, patiently',
        tags: ['loyal', 'rest'],
        governingStats: { loyalty: 0.6, savvy: 0.4 },
        outcomes: {
          bad: { text: 'You go full instructor and {mate} panics at waist-deep, swallows half the pool, and calls it there. “Maybe I’m a land animal.” You’ll try again tomorrow. Progress: damp.', effects: { loyalty: 2, burnout: 3 } },
          good: { text: 'An hour of floats and patience and {mate} does a whole width, wobbly and triumphant. “I swam.” Quietly said, hugely felt. Nobody saw. That was the entire point.', effects: { loyalty: 5, graft: 2 } },
          incredible: { text: 'By week’s end {mate} does the water challenge and doesn’t sink, and only you two know why. They catch your eye mid-splash. A whole secret, taught in a shallow end.', effects: { loyalty: 8, graft: 3, public: 3 } },
        },
      },
      right: {
        label: 'Make it a laugh, low-stakes',
        tags: ['banter', 'chat'],
        governingStats: { charisma: 0.6, rizz: 0.4 },
        outcomes: {
          bad: { text: 'Your “just vibe with the water” method makes more splashing than swimming and a lifeguard-shaped producer starts hovering. {mate} laughs, still can’t float. Fun, though, technically.', effects: { charisma: 2, burnout: 3 } },
          good: { text: 'You keep it daft — noodle races, breath-holding contests — and {mate} learns without noticing they’re learning. Best kind of lesson. They’re doing widths by sundown.', effects: { charisma: 5, followers: 2 } },
          incredible: { text: 'You turn the lesson into such a laugh that {mate} forgets to be scared and just swims. “When did that happen?” Between the jokes, mate. That’s where it always happens.', effects: { charisma: 8, followers: 4, public: 3 } },
        },
      },
    },
  },
  {
    id: 'li_enc_worst_habit', act: 2, weight: 1, tags: ['encounter', 'chat', 'date'],
    art: 'li_bedroom',
    context: 'Evening · the dressing room · a fond accusation',
    prompt: '“Can I tell you your worst habit? Lovingly.” {partner} has clearly been saving this. “You make a tea, drink half, abandon the mug somewhere mad, and start a NEW tea. There are six of your mugs in this villa right now. Six. I’ve been collecting them like Easter eggs.” They’re not annoyed. They’re fond, which is worse.',
    recap: '{partner} lovingly calls out your worst villa habit — the abandoned mugs.',
    choices: {
      left: {
        label: 'Take the note, sweetly',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 0.6, rizz: 0.4 },
        outcomes: {
          bad: { text: 'You get weirdly defensive about the mugs and it becomes A Thing about being “managed.” {partner} backs off, hands up. It was six mugs and a fond joke. You turned it into a summit.', effects: { loyalty: 2, bond: 1, burnout: 3 } },
          good: { text: '“You’ve been tracking my mugs?” — “Obviously.” The fact they know your daft habit and find it endearing lands bigger than any compliment. You bin the mug. You’ll do it again tomorrow.', effects: { loyalty: 5, bond: 5 } },
          incredible: { text: 'You realise being clocked this closely — mugs and all — is what being properly known feels like, and you say so, badly, out loud. {partner} goes soft. The mug graveyard is a love language now.', effects: { loyalty: 8, bond: 7, romantics: 2 } },
        },
      },
      right: {
        label: 'Turn it back on them',
        tags: ['banter', 'flirt'],
        governingStats: { charisma: 0.5, rizz: 0.5 },
        outcomes: {
          bad: { text: 'You lob back their worst habit and get the aim wrong — too true, not fond enough. {partner}’s smile tightens. “Right.” The mug bit was a gift. You handed it back as a receipt.', effects: { charisma: 2, bond: -2, burnout: 2 } },
          good: { text: '“You leave one sock on, always, all night.” {partner} gasps, caught. Turns out you’ve both been quietly cataloguing each other. That’s just what couples do. Filed, fondly.', effects: { charisma: 5, bond: 4 } },
          incredible: { text: 'You two spend an hour trading tiny observed habits — the sock, the mugs, the way they hum getting ready — and it’s plain you’ve each been paying enormous attention. The villa’s realest audit.', effects: { charisma: 8, bond: 6, followers: 2 } },
        },
      },
    },
  },
  {
    id: 'li_enc_birthday', act: 2, weight: 1, tags: ['encounter', 'chat', 'loyal'],
    art: 'li_kitchen',
    context: 'Late afternoon · the kitchen · a date nobody clocked',
    prompt: '“It’s honestly fine.” {mate} says it too fast, stirring a coffee they’re not drinking. “It’s my birthday. I wasn’t gonna say. Everyone’s got their own stuff on and I didn’t want a fuss, and now it’s four o’clock and — yeah. Fine. Ignore me, I’m being soft.” They are, quite plainly, not fine.',
    recap: 'It’s {mate}’s birthday and nobody in the villa clocked it.',
    choices: {
      left: {
        label: 'Throw something together',
        tags: ['loyal', 'banter'],
        governingStats: { charisma: 0.5, loyalty: 0.5 },
        outcomes: {
          bad: { text: 'You rally the villa in a panic and the surprise is more chaos than party — a cake of stacked Mini Milks, everyone singing in three keys. {mate} cries anyway. Right result, rough craft.', effects: { charisma: 2, burnout: 3 } },
          good: { text: 'You mobilise the villa inside an hour — a banner in eyeliner, a cake of stacked biscuits, dreadful singing. {mate} welds their face shut and fails. “You didn’t have to.” You did, though.', effects: { charisma: 5, loyalty: 3, public: 2 } },
          incredible: { text: 'By teatime the villa’s thrown {mate} the best worst party ever assembled, and they spend it insisting they’re fine while sobbing into a paper crown. Nobody was letting it slide. Least of all you.', effects: { charisma: 8, loyalty: 3, public: 4, followers: 3 } },
        },
      },
      right: {
        label: 'Just be with them',
        tags: ['loyal', 'rest'],
        governingStats: { loyalty: 0.7, savvy: 0.3 },
        outcomes: {
          bad: { text: 'You sit with them instead of making it big, and {mate} half-wishes you’d made it big. “This is nice,” they say, meaning it and not, both. Read the room again tomorrow.', effects: { loyalty: 2, burnout: 2 } },
          good: { text: 'You skip the fuss and give {mate} your whole afternoon — a proper chat, no cameras worth it, one card drawn on a napkin. Sometimes the small version is the one that lands.', effects: { loyalty: 5, graft: 2 } },
          incredible: { text: 'You clock that {mate} didn’t want a party, they wanted to not be forgotten — so you remember, out loud, in small ways, all day. By evening they’re not being brave about it. They’re just happy.', effects: { loyalty: 8, selfrespect: 2, graft: 2 } },
        },
      },
    },
  },
];
