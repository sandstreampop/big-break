// Love Island — the gossip beats (ADR-0007): the Beach Hut confessional (the
// gather channel that echoes a distorted version back out — it cuts both
// ways) and the deploy beat where held intel gets spent. The ceremony
// cash-out lives on the climax encounter cards (events-beats).
// Voice per VOICE.md; dialogue-first.

import type { GameEvent } from '../../types.js';

export const GOSSIP_EVENTS: GameEvent[] = [
  {
    id: 'li_hut_confess_1', act: [1, 2], weight: 4, tags: ['camera', 'chat'],
    art: 'li_beachhut',
    context: 'The Beach Hut · a leading question',
    prompt: '“So,” says the producer voice, light as anything. “Tell us about {rival}.” The chair creaks. The Hut knows exactly what it’s doing — it trades. You give it a headline, it gives you tomorrow’s.',
    recap: 'The Beach Hut asks you, all innocent, to tell them about {rival}.',
    choices: {
      left: {
        label: 'Name names',
        tags: ['drama', 'camera'],
        governingStats: { charisma: 0.6, savvy: 0.4 },
        outcomes: {
          bad: { text: 'You go loud, and the edit goes louder. What comes back out has your voice and somebody else’s sentences. {rival} hears the remix by dinner.', effects: { charisma: 2, followers: 3, rivalOpinion: -4, rivalMood: 'fuming', burnout: 3, gainIntel: { about: 'rival', label: 'they’re rattled about the vote' } } },
          good: { text: 'You give the Hut a tidy little headline and the Hut, fair’s fair, gives one back: {rival} has been asking about your couple. Noted. Filed.', effects: { charisma: 5, followers: 5, rivalOpinion: -2, gainIntel: { about: 'rival', label: 'they’ve been asking about your couple' } } },
          incredible: { text: 'Your confessional is so quotable production practically curtsies — and lets slip the thing they’ve been sitting on about {rival}. The Hut trades. You traded up.', effects: { charisma: 8, followers: 8, public: 3, surfaceSecret: 'rival' } },
        },
      },
      right: {
        label: 'Keep it vague',
        tags: ['strategy', 'rest'],
        governingStats: { savvy: 1 },
        outcomes: {
          bad: { text: 'You give the Hut nothing, and it airs the nothing: ninety seconds of “yeah, no, all good” becomes a meme about hiding something.', effects: { savvy: 2, followers: 2, burnout: 2 } },
          good: { text: 'Pleasant, warm, empty. The producer voice tries three angles and collects three compliments. The edit moves on to louder chairs.', effects: { savvy: 5, burnout: -2 } },
          incredible: { text: '“Everyone’s lovely.” Four takes, zero cracks. Somewhere in the gallery they mark you down as unbaitable — which, in the vote, quietly reads as class.', effects: { savvy: 8, public: 4, burnout: -3 } },
        },
      },
    },
  },
  {
    id: 'li_hut_confess_2', act: 3, tags: ['camera', 'chat'],
    art: 'li_beachhut',
    context: 'The Beach Hut · Final Week · the pointed question',
    prompt: '“Final Week,” says the voice. “Is it real?” Straight for the ribs. And then, conversationally: “Because {partner} sat in that exact chair yesterday, said your name, and then said ‘I’m terrified, if I’m honest.’” The chair holds its breath. So, annoyingly, do you.',
    recap: 'The Hut asks if it’s real — and says {partner} sat there terrified.',
    choices: {
      left: {
        label: 'Ask what they said',
        tags: ['drama', 'chat'],
        governingStats: { savvy: 0.5, loyalty: 0.5 },
        outcomes: {
          bad: { text: 'The Hut plays you four seconds: a laugh, your name, then “…I don’t know, do I.” Out of context it could mean anything. In your head, all night, it means everything.', effects: { savvy: 2, burnout: 5, gainIntel: { about: 'partner', label: 'the clip: your name, then “I don’t know, do I”' } } },
          good: { text: 'The voice tells you: asked if you’d last on the outside, {partner} said “I hope so” — not “yes.” Useful. Heavy, but useful.', effects: { savvy: 5, burnout: 2, gainIntel: { about: 'partner', label: 'asked if you’ll last outside, they said “I hope so”' } } },
          incredible: { text: 'You get the whole quote: “They’re the first one I’ve not had to be ‘on’ for.” It’s lovely, actually. You walk out lighter, and armed.', effects: { savvy: 6, bond: 3, burnout: -2, gainIntel: { about: 'partner', label: '“the first one I’ve not had to be ‘on’ for”' } } },
        },
      },
      right: {
        label: '“It’s real. Next question.”',
        tags: ['loyal', 'camera'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: 'Right words, wrong beat — flat delivery airs like a hostage clip. The nation squints at its sofa.', effects: { loyalty: 2, public: -1, burnout: 3 } },
          good: { text: 'Four words, no blink. The Hut loves conviction it can’t dent. So does the vote.', effects: { loyalty: 5, public: 4 } },
          incredible: { text: 'The clip runs uncut under the episode’s title card. Conviction that clean is a campaign ad.', effects: { loyalty: 8, public: 6, followers: 3 } },
        },
      },
    },
  },
  // The two-step to a SECRET: held intel about the Rival can be assembled
  // into the real thing (ADR-0006's surfacing, on a deliberate player path —
  // the encounter-climax surfaces are the lucky shortcut, this is the graft).
  {
    id: 'li_connect_dots', act: [1, 2, 3], weight: 9, tags: ['strategy', 'graft'],
    art: 'li_bedroom',
    requires: { intelAboutIs: 'rival:true', secretHeldIs: 'rival:false' },
    context: 'The dressing room · your notes, assembling themselves',
    prompt: 'Alone with what you’ve gathered on {rival}: the whisper, the timeline, the one thing they said that never fit. It assembles the way these things do — suddenly, and all at once. There’s a shape here. One more pull and it has a name.',
    recap: 'Alone with everything you’ve gathered on {rival} — nearly a full picture.',
    choices: {
      left: {
        label: 'Pull the thread',
        tags: ['strategy'],
        governingStats: { savvy: 1 },
        outcomes: {
          bad: { text: 'You pull, and it comes apart in your hand — close, but the last piece lives in somebody else’s head. What you’ve got stays a hunch with good posture.', effects: { savvy: 2, burnout: 3 } },
          good: { text: 'It clicks in the mirror light, whole and obvious in hindsight. You sit with {rival}’s actual secret for a long minute, deciding what kind of person you’re going to be about it.', effects: { savvy: 5, surfaceSecret: 'rival' } },
          incredible: { text: 'The whole picture, assembled from crumbs, timestamped, airtight. Somewhere across the villa {rival} laughs at someone’s joke, unaware their season now has a co-author.', effects: { savvy: 8, surfaceSecret: 'rival', followers: 3 } },
        },
      },
      right: {
        label: 'Run it past {mate}',
        tags: ['chat', 'code'],
        governingStats: { loyalty: 0.5, charisma: 0.5 },
        outcomes: {
          bad: { text: '{mate} confirms nothing, denies nothing, and immediately develops the face of someone carrying two secrets instead of one. The dig is now a rumour about you digging.', effects: { loyalty: 2, rivalMood: 'scheming', burnout: 3 } },
          good: { text: '“Oh, THAT,” says {mate}, folding towels. “Everyone half-knows. Nobody’s said it.” Half-known plus your half: whole. Now you know it entire.', effects: { loyalty: 5, surfaceSecret: 'rival' } },
          incredible: { text: '“I’ll do you one better,” says {mate}, and produces receipts you didn’t ask for. The dressing room falls quiet in respect. The alliance is real; so is the ammunition.', effects: { loyalty: 6, charisma: 2, surfaceSecret: 'rival', public: 2 } },
        },
      },
    },
  },
  {
    id: 'li_kitchen_drop', act: [2, 3], tags: ['strategy', 'drama'],
    art: 'li_kitchen',
    requires: { intelMin: 1, singleIs: false },
    context: 'The kitchen · low voices · what you know, itching',
    prompt: 'What you know has been doing laps of your head all day. {partner} is on the daybed; {rival} is making a smoothie with meaningful eye contact. Information is only power while it’s moving. Or is it while it’s still? One of those.',
    recap: 'You’re sitting on what you know — {partner}’s near, {rival}’s watching.',
    choices: {
      left: {
        label: 'Tell {partner} everything',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: 'You brief {partner} in a whisper that carries to the pool. The couple gets tighter; the delivery becomes a meme.', effects: { deployIntel: 'partner', loyalty: 2, burnout: 3, followers: 2 } },
          good: { text: 'Quietly, completely, kettle on. What you know becomes what you two know. Different weight class entirely.', effects: { deployIntel: 'partner', loyalty: 5 } },
          incredible: { text: 'You tell it so straight that {partner} just looks at you and says, “you’re the only one in here I’d believe.” Vault sealed. Alliance upgraded.', effects: { deployIntel: 'partner', loyalty: 8, public: 3 } },
        },
      },
      right: {
        label: 'Trade it to {rival}',
        tags: ['strategy', 'drama'],
        governingStats: { savvy: 1 },
        outcomes: {
          bad: { text: 'You trade the whisper and receive a smile-shaped IOU. {rival} banks it. The daybed notices the huddle.', effects: { deployIntel: 'rival', savvy: 2, burnout: 3 } },
          good: { text: 'A clean trade at the smoothie counter: your whisper for their good graces. The villa’s markets are open.', effects: { deployIntel: 'rival', savvy: 5, followers: 2 } },
          incredible: { text: 'You broker it like a professional — terms, timing, deniability. {rival} looks at you with new eyes: <i>colleague</i>.', effects: { deployIntel: 'rival', savvy: 8, followers: 4, graft: 3 } },
        },
      },
    },
  },
  // A gather that isn’t the Beach Hut: the villa leaks through its own walls.
  {
    id: 'li_shower_partition', act: [1, 2], tags: ['strategy', 'gossip'],
    art: 'li_lawn',
    context: 'The outdoor shower · thin partition · unfortunate acoustics',
    prompt: '{rival} is on the other side of the shower partition, debriefing {mate} at full volume, entirely unaware the acoustics carry. “—so the whole plan is—” The water’s running. So, now, is your memory.',
    recap: 'The outdoor shower’s thin wall hands you {rival}’s whole plan by accident.',
    choices: {
      left: {
        label: 'Memorise every word',
        tags: ['strategy', 'code'],
        governingStats: { savvy: 1 },
        outcomes: {
          bad: { text: 'You lean in for the crucial detail and your elbow squeaks the partition. The water stops. “...hello?” You compliment the water pressure and retreat with half a plan.', effects: { savvy: 2, burnout: 3, gainIntel: { about: 'rival', label: 'half a plan, cut off at the good bit' } } },
          good: { text: 'You stay dead still and collect the lot: the plan, the timing, the name they said twice. The water runs cold and you don’t even flinch. Best shower you never took.', effects: { savvy: 5, gainIntel: { about: 'rival', label: 'their whole plan, said out loud' } } },
          incredible: { text: '{rival} monologues their entire strategy to the tiles, and you step out with the season in your back pocket. They wave at you, damp and doomed, on your way past.', effects: { savvy: 8, followers: 3, gainIntel: { about: 'rival', label: 'the full plan, timings and names' } } },
        },
      },
      right: {
        label: 'Cough. Let them know',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 0.7, charisma: 0.3 },
        outcomes: {
          bad: { text: 'You cough loudly and {rival} clocks exactly how long you’ve been there. Now they know you know, and worse, they know you’re the type who’d warn them. Filed under threat.', effects: { loyalty: 2, burnout: 3, rivalMood: 'scheming' } },
          good: { text: 'You make your presence obvious and {rival} shuts up, rattled, wondering what you caught. Nothing usable — but the doubt you planted does its own quiet work.', effects: { loyalty: 4, savvy: 2, rivalOpinion: -1 } },
          incredible: { text: 'You warn them they’re carrying, kindly, and {rival} is so disarmed by the decency they tell you the plan anyway, over the shower wall. Honesty: the long con nobody sees coming.', effects: { loyalty: 6, public: 2, gainIntel: { about: 'rival', label: 'they told you the plan themselves' } } },
        },
      },
    },
  },
  // A new intel vector: the bombshell arrives fresh from the outside world.
  {
    id: 'li_bombshell_outside', act: [1, 2], tags: ['strategy', 'gossip'],
    art: 'li_kitchen',
    context: 'The kitchen · the new arrival · fresh from the outside',
    prompt: '{bombshell} has been in four hours and already knows things — the outside talks, and they were just in it. “Shouldn’t say,” they murmur, clearly about to. “But there’s a lot online about {rival}. Stuff from before.”',
    recap: '{bombshell} arrives with outside gossip about {rival}’s life before the villa.',
    choices: {
      left: {
        label: 'Get the whole story',
        tags: ['strategy', 'gossip'],
        governingStats: { savvy: 0.6, charisma: 0.4 },
        outcomes: {
          bad: { text: 'You push and {bombshell} gives you a headline with no body — “just, look it up,” which you can’t, in here. You’re left holding a rumour with no receipt. Worse than nothing.', effects: { savvy: 2, burnout: 3, gainIntel: { about: 'rival', label: 'an outside headline about {rival}, no detail' } } },
          good: { text: '{bombshell} tells you the lot over the counter, quiet and specific. Names, dates, the version {rival} isn’t telling in here. Fresh off the internet and straight into your pocket.', effects: { savvy: 5, gainIntel: { about: 'rival', label: 'what the outside knows about {rival}’s past' } } },
          incredible: { text: 'The full outside story, corroborated with a detail only someone who’d seen it would know. {bombshell} shrugs. “You seem like you’d use it well.” You will. You absolutely will.', effects: { savvy: 8, followers: 2, gainIntel: { about: 'rival', label: 'the outside story on {rival}, corroborated' } } },
        },
      },
      right: {
        label: 'Shut it down. Not like this',
        tags: ['loyal', 'code'],
        governingStats: { loyalty: 0.8, savvy: 0.2 },
        outcomes: {
          bad: { text: 'You refuse to hear it and {bombshell} tells the daybeds instead, framing you as the one who “went weird about it.” The intel spreads anyway, minus your say in the shape of it.', effects: { loyalty: 2, drama: 2, burnout: 3 } },
          good: { text: '“Not off the internet, not in here.” {bombshell} respects the line, and the villa clocks you as someone who won’t knife a person with a search result. Rare stock.', effects: { loyalty: 5, selfrespect: 3 } },
          incredible: { text: 'You shut it down so cleanly {bombshell} apologises, and {rival} — who was dreading this exact arrival — later hears you buried it. An enemy who owes you one. The best kind.', effects: { loyalty: 8, public: 3, rivalOpinion: 3 } },
        },
      },
    },
  },
  // A deploy at maximum altitude: the firepit, the full villa, live intel.
  {
    id: 'li_firepit_reveal', act: [2, 3], tags: ['strategy', 'drama'],
    art: 'li_firepit',
    requires: { intelMin: 1, singleIs: false },
    context: 'The firepit · the whole villa assembled · what you know, loaded',
    prompt: 'The firepit’s gone quiet in the way it does before something. You’re holding what you know about {rival}, and there will never be a bigger audience for it. {partner} is beside you. {rival} is across the flames, laughing, unaware you could end the laugh.',
    recap: 'The firepit’s full and you’re holding live intel on {rival}.',
    choices: {
      left: {
        label: 'Drop it. Here. Now',
        tags: ['drama', 'camera'],
        governingStats: { savvy: 0.5, charisma: 0.5 },
        outcomes: {
          bad: { text: 'You go public and fumble the landing — the reveal comes out tangled, {rival} pokes one hole in it, and the firepit turns on the messenger. The truth was real. The delivery was homework.', effects: { deployIntel: 'rival', savvy: 2, drama: 3, burnout: 4 } },
          good: { text: 'You lay it out, calm and complete, and the firepit goes silent as it lands on {rival}. No shouting. Just the facts, the flames, and a villa recalculating in real time.', effects: { deployIntel: 'rival', savvy: 5, drama: 5, followers: 3 } },
          incredible: { text: 'You detonate it with one flat sentence and a sip of your drink. {rival} has no version that survives it. The firepit erupts; the clip is the season. You didn’t even raise your voice.', effects: { deployIntel: 'rival', savvy: 8, drama: 7, followers: 6, public: 3 } },
        },
      },
      right: {
        label: 'Bury it. For good',
        tags: ['loyal', 'code'],
        governingStats: { loyalty: 0.6, savvy: 0.4 },
        outcomes: {
          bad: { text: 'You sit on it and someone else fumbles it out an hour later, badly, and now it’s in the villa without your fingerprints OR your control. The worst outcome: aired, and not by you.', effects: { loyalty: 2, drama: 2, burnout: 3 } },
          good: { text: 'You let the firepit stay a nice firepit. {partner} catches the decision on your face and squeezes your hand — they know what you were holding and what you chose. That’s the whole thing.', effects: { loyalty: 5, bond: 4, selfrespect: 3 } },
          incredible: { text: 'You bury it so completely it dies with you, and later {rival}, who suspected you had it, quietly clocks you never used it. In a villa full of knives, being the one who didn’t is its own power.', effects: { loyalty: 8, selfrespect: 4, rivalOpinion: 4, public: 2 } },
        },
      },
    },
  },
  // Intel about your OWN couple, offered by a friend: the loyalty-vs-knowing fork.
  {
    id: 'li_mate_tipoff', act: [1, 2], tags: ['strategy', 'gossip'],
    art: 'li_bedroom',
    context: 'The dressing room · {mate}, low-voiced, loyal',
    prompt: '{mate} corners you by the beds, checking over their shoulder. “Right, I wasn’t gonna say, ’cause it’s not my drama. But I heard something about {partner} and I’d want to know, if it was me. So.” They wait. You could stop them here.',
    recap: '{mate} has heard something about {partner} and offers to tell you.',
    choices: {
      left: {
        label: 'Hear it out',
        tags: ['strategy', 'gossip'],
        governingStats: { savvy: 0.6, loyalty: 0.4 },
        outcomes: {
          bad: { text: 'You take the intel and can’t un-know it, and now every normal thing {partner} does gets run through a filter you can’t switch off. {mate} meant well. The gift keeps taking.', effects: { savvy: 2, burnout: 4, gainIntel: { about: 'partner', label: 'the thing {mate} heard about {partner}' } } },
          good: { text: '{mate} lays it out, fair and unspun. Not damning — a fuller picture. You know your own couple a bit better now, and you know {mate} has your back. Two assets, one chat.', effects: { savvy: 5, loyalty: 2, gainIntel: { about: 'partner', label: '{mate}’s fuller picture of {partner}' } } },
          incredible: { text: 'The tip is real, useful, and — crucially — {mate} tells you so you hear it from a friend before you hear it from an enemy. You file it, and you file the friendship deeper.', effects: { savvy: 6, loyalty: 4, graft: 2, gainIntel: { about: 'partner', label: 'a heads-up on {partner}, from a friend first' } } },
        },
      },
      right: {
        label: 'Ask {partner} yourself',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 0.8, rizz: 0.2 },
        outcomes: {
          bad: { text: 'You go straight to {partner} and it comes out as an accusation missing its evidence. “Where’s this even from?” Nowhere you can name. The chat you wanted becomes the row you didn’t.', effects: { loyalty: 2, bond: -2, burnout: 3 } },
          good: { text: '“I’d rather hear it from you.” {partner} blinks, then tells you the whole thing unprompted, relieved to be asked instead of investigated. Trust, chosen out loud over information.', effects: { loyalty: 5, bond: 5 } },
          incredible: { text: '{partner} tells you everything, and it’s smaller than the rumour would’ve been, and the fact you came to them first instead of building a case is the thing they don’t stop mentioning.', effects: { loyalty: 8, bond: 7, public: 2 } },
        },
      },
    },
  },
  // Two more open gather vectors (same mechanic — gainIntel about the Rival):
  // dirt offered by your Ex from the outside world, and a scheme overheard
  // while playing dead on the wobbly lounger.
  {
    id: 'li_gossip_ex_dirt', act: [1, 2], tags: ['strategy', 'gossip'],
    art: 'li_kitchen',
    context: 'The sink · a confidential offer · from an unlikely source',
    prompt: '{ex} sidles up at the sink, all confidential. “Look — I know we’re not each other’s favourite. But I follow the same people you do, out there, and there’s chat about {rival}. Proper chat. The kind that’d change how you play them.” A pause, watching you want it. “Say the word and it’s yours.”',
    recap: 'Your {ex} offers you outside dirt on {rival} — for reasons of their own.',
    choices: {
      left: {
        label: 'Take everything they’ve got',
        tags: ['strategy', 'gossip'],
        governingStats: { savvy: 0.6, charisma: 0.4 },
        outcomes: {
          bad: { text: 'You take it and it’s mostly {ex} settling an old score dressed up as a favour — half rumour, half spite, no receipt. Now you owe your ex, for vapour. Poor trade.', effects: { savvy: 2, burnout: 3, gainIntel: { about: 'rival', label: 'outside chat about {rival} — half of it {ex}’s own spite' } } },
          good: { text: '{ex} hands you the outside version of {rival}: what people are actually saying, dates and all. It’s real, it’s useful, and it cost you nothing but a chat with your past.', effects: { savvy: 5, gainIntel: { about: 'rival', label: 'what the outside is really saying about {rival}' } } },
          incredible: { text: 'You get the lot, corroborated, and clock exactly why {ex} wants you to have it — which makes it twice as useful. Their agenda and {rival}’s secret, both in your pocket. Tidy.', effects: { savvy: 8, followers: 2, gainIntel: { about: 'rival', label: 'the outside story on {rival}, plus why {ex} wanted you armed' } } },
        },
      },
      right: {
        label: 'Not from you. Not like this',
        tags: ['loyal', 'code'],
        governingStats: { loyalty: 0.8, savvy: 0.2 },
        outcomes: {
          bad: { text: 'You refuse, and {ex} takes it as a snub, then tells someone louder and messier instead. The intel’s in the villa now anyway, minus any say of yours in its shape. Principled, costly.', effects: { loyalty: 2, drama: 2, burnout: 3 } },
          good: { text: '“I’m not doing my {rival} business through my {ex}. No offence.” Clean line, held in daylight. {ex} shrugs. The villa never clocks you turned down free ammunition. You clock it. It sits well.', effects: { loyalty: 5, selfrespect: 3 } },
          incredible: { text: 'You shut it down so cleanly {ex} almost respects it, and later {rival} hears you buried free dirt rather than use it. Two people recalibrate you at once. Your past stays your past. Rare air.', effects: { loyalty: 8, selfrespect: 3, public: 2 } },
        },
      },
    },
  },
  {
    id: 'li_gossip_fake_nap', act: [1, 2], tags: ['strategy', 'gossip'],
    art: 'li_lawn',
    context: 'The wobbly lounger · eyes shut · ears very much open',
    prompt: 'You’re half-asleep on the wobbly lounger when {rival} and two others settle on the grass beside you, assuming you’re out cold. “—they don’t suspect a thing, that’s the beauty of it,” {rival} is murmuring. Your eyes stay shut. Your ears clock in for overtime. One twitch and the whole thing stops.',
    recap: 'Playing dead on the lounger, you overhear {rival} laying out a scheme.',
    choices: {
      left: {
        label: 'Stay under. Collect it all',
        tags: ['strategy', 'code'],
        governingStats: { savvy: 1 },
        outcomes: {
          bad: { text: 'You hold dead still for the crucial line and the lounger picks that moment to wobble. {rival} freezes. “You awake?” You fake a snore. You’re left with half a plan and a racing heart.', effects: { savvy: 2, burnout: 3, gainIntel: { about: 'rival', label: 'half {rival}’s plan, cut off by a wobble' } } },
          good: { text: 'You stay boneless and collect the lot — the plan, the timing, the name they say twice. The lounger holds its wobble for once. You get up from that nap considerably better informed.', effects: { savvy: 5, gainIntel: { about: 'rival', label: '{rival}’s whole plan, overheard playing dead' } } },
          incredible: { text: '{rival} lays the whole scheme out to a body they think is asleep. You rise off the lounger knowing every move before they make it, thank them for the lovely sun, and stroll off. They wave, none the wiser.', effects: { savvy: 8, followers: 3, gainIntel: { about: 'rival', label: '{rival}’s entire scheme, timings and names' } } },
        },
      },
      right: {
        label: 'Sit up. Refuse to lurk',
        tags: ['loyal', 'code'],
        governingStats: { loyalty: 0.7, savvy: 0.3 },
        outcomes: {
          bad: { text: 'You sit up too sharply and it’s obvious you heard something — now {rival} knows you know, and knows you’re the sort who won’t use it. Worst of both: no intel, full suspicion.', effects: { loyalty: 2, burnout: 3 } },
          good: { text: 'You yawn, sit up, and join the circle before you can hear the damning bit. {rival} pivots to the weather. You’ve no ammunition and a clear conscience — which in here is its own luxury.', effects: { loyalty: 5, selfrespect: 3 } },
          incredible: { text: 'You break up the huddle by “waking up” and offering everyone a drink, killing the plot mid-sentence without a soul clocking why. You heard nothing usable. You stopped something anyway. Quietly ace.', effects: { loyalty: 6, selfrespect: 3, public: 2 } },
        },
      },
    },
  },
];
