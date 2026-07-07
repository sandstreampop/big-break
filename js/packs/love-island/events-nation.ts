// Love Island — the NATION cards (ADR-0012): the moments where the factional
// public is the scene. Each is an explicit tradeoff between the Romantics 🌹,
// the Self-Respect crowd 💅, and the Drama-lovers 🍿 — you can never satisfy
// everyone, which is the truest thing the show teaches. Faction payloads are
// authored ON the choices, so the lean-preview telegraphs them before the
// swipe (the interesting-decisions contract: a faction tradeoff is only a
// choice if you can read which faction a card serves).

import type { GameEvent } from '../../types.js';

export const NATION_EVENTS: GameEvent[] = [
  {
    id: 'li_nation_split', act: 1, tags: ['nation', 'camera', 'chat'],
    art: 'li_beachhut',
    context: 'The Beach Hut · the producer’s favourite question',
    prompt: '“So,” says the voice behind the camera, warm as a trap, “the fans are split on you. Half think you’re here for love. Half think you’re here for the ride.” A pause you could park a jet-ski in. “Which half is right?”',
    recap: 'The Beach Hut asks whether you’re here for love or for the ride.',
    choices: {
      left: {
        label: '“For love. Watch me”',
        tags: ['loyal', 'camera'],
        governingStats: { loyalty: 0.6, charisma: 0.4 },
        outcomes: {
          bad: { text: '“For love,” you say, with the conviction of a contestant reading an autocue through sunscreen. The soft wing wants to believe you. Wants.', effects: { romantics: 3, drama: -1, loyalty: 2 } },
          good: { text: '“For love. Boring answer, I know.” The booth waits for the twist. There isn’t one. The Romantics put your face on a cushion by the weekend.', effects: { bond: 4, followers: 2, charisma: 3, romantics: 4, drama: -2, loyalty: 5 } },
          incredible: { text: '“For love — and I’ll be unbearable about it.” Sincerity with teeth. The soft wing swoons, and even the chaos wing respects a person who commits to a bit that isn’t one.', effects: { bond: 5, followers: 4, charisma: 4, romantics: 6, drama: -1, loyalty: 8, public: 2 } },
        },
      },
      right: {
        label: '“The ride. Obviously”',
        tags: ['banter', 'camera'],
        governingStats: { charisma: 0.7, savvy: 0.3 },
        outcomes: {
          bad: { text: '“The ride,” you grin, and the grin photographs as a confession. The chaos wing cheers; the soft wing starts a thread titled “knew it.”', effects: { drama: 3, romantics: -2, charisma: 2, followers: 2 } },
          good: { text: '“Have you SEEN the ride?” The booth laughs, which producers hate admitting on the mix. Honest chaos — the Drama-lovers’ favourite import.', effects: { drama: 4, romantics: -2, charisma: 5, followers: 4 } },
          incredible: { text: '“The ride. And if love happens, that’s the plot twist.” The clip opens the next episode. The chaos wing adopts you; the soft wing keeps the receipt for later.', effects: { drama: 6, romantics: -2, charisma: 8, followers: 6 } },
        },
      },
    },
  },
  {
    id: 'li_nation_pie', act: [1, 2], tags: ['nation', 'challenge', 'drama'],
    art: 'li_challenge',
    context: 'Challenge day · “Snog, Marry, Pie” · the pie is real',
    prompt: '“SNOG, MARRY, PIE!” The whiteboard says so, so it’s law. You’re up, holding a paper plate of shaving-foam justice, and the villa arranges itself into targets. The nation, famously, has never once agreed about a pie.',
    recap: 'Snog, Marry, Pie — and the foam plate is in your hand.',
    choices: {
      left: {
        label: 'Pie {rival}. Ceremonially',
        tags: ['drama', 'challenge', 'camera'],
        governingStats: { charisma: 0.5, savvy: 0.5 },
        outcomes: {
          bad: { text: 'You wind up so theatrically {rival} simply steps aside, and the pie hits Dev, the one person the nation has no notes on. The apology tour lasts two days.', effects: { drama: 3, romantics: -1, burnout: 3, rivalOpinion: -2 } },
          good: { text: 'Clean hit, full ceremony, small bow. {rival} laughs through the foam — on camera, filing it — and the chaos wing renders your face in fireworks.', effects: { charisma: 3, drama: 5, selfrespect: 1, romantics: -2, followers: 4, rivalOpinion: -3, rivalMood: 'fuming' } },
          incredible: { text: 'You dedicate the pie — “for the loungers” — then deliver it with the flat face of a nature documentary. Instant canon. The foam has a fan account by dinner.', effects: { charisma: 4, drama: 7, romantics: -2, followers: 7, public: 2, rivalOpinion: -3, rivalMood: 'fuming' } },
        },
      },
      right: {
        label: 'Pie no one. Marry {partner}',
        tags: ['loyal', 'challenge', 'date'],
        governingStats: { loyalty: 0.8, rizz: 0.2 },
        outcomes: {
          bad: { text: 'You go sincere in a foam-based format and the edit cuts to a seagull. The Romantics appreciate it. The Romantics are the only ones.', effects: { romantics: 3, drama: -2, bond: 2 } },
          good: { text: '“Marry,” you say, pointing at {partner}, “no notes.” The soft wing melts. The chaos wing boos warmly, which from them is a standing ovation.', effects: { romantics: 5, drama: -2, bond: 6 } },
          incredible: { text: 'You put the pie DOWN — the format GASPS — and do the marry speech instead. Sincerity as an act of violence against television. The Romantics declare a national holiday.', effects: { romantics: 7, drama: -3, bond: 5, public: 2 } },
        },
      },
    },
  },
  {
    id: 'li_nation_doormat', act: 2, tags: ['nation', 'encounter', 'drama'],
    art: 'li_lawn',
    context: 'The lawn · a joke lands on you · the nation watches your spine',
    prompt: 'Marco, mid-holding-court: “—and honestly, half the villa is furniture. No offence.” He gestures at your lounger. At YOU, technically. The lawn does its little “oooh.” Somewhere in a living room, a wing of the nation leans forward: what are you going to do about that?',
    recap: 'Marco calls you furniture in front of the whole lawn.',
    choices: {
      left: {
        label: 'Laugh along. Keep the peace',
        tags: ['rest', 'banter'],
        governingStats: { charisma: 0.6, loyalty: 0.4 },
        outcomes: {
          bad: { text: 'You laugh one beat too long and the laugh files itself under evidence. “Furniture,” the chaos wing captions your reaction shot. It travels.', effects: { romantics: 1, selfrespect: -3, drama: 1, burnout: 3 } },
          good: { text: 'You wave it off — magnanimous, sunlit, unbothered. The peace holds. The spine wing’s group chat, however, has opened a file with your name on it.', effects: { burnout: -4, followers: 2, romantics: 2, selfrespect: -2, drama: 1, charisma: 5 } },
          incredible: { text: 'Your unbothered is SO unbothered it becomes a flex — you thank him for the “free upholstery content” and return to your book. Half backbone, half zen. Both wings claim it.', effects: { burnout: -6, followers: 4, romantics: 2, selfrespect: 1, drama: 2, charisma: 8 } },
        },
      },
      right: {
        label: 'The measured clapback',
        tags: ['drama', 'strategy'],
        governingStats: { savvy: 0.6, charisma: 0.4 },
        outcomes: {
          bad: { text: 'The clapback arrives assembled in the wrong order, ending on “…so THERE.” Marco pats the lounger sympathetically. The spine wing looks away in pain.', effects: { selfrespect: 1, drama: 2, burnout: 3, rivalOpinion: -1 } },
          good: { text: '“Bold from a man whose skincare has its own suitcase.” One line, level voice, back to your book. The lawn HOWLS. The Self-Respect crowd frames it.', effects: { selfrespect: 4, drama: 2, romantics: -1, savvy: 5, followers: 3 } },
          incredible: { text: '“Furniture holds this villa up, babe. What do you do?” Delivered without looking up. Marco opens his mouth; nothing arrives. The clip is a national curriculum by morning.', effects: { selfrespect: 6, drama: 3, romantics: -1, savvy: 8, followers: 6 } },
        },
      },
    },
  },
  {
    id: 'li_nation_correction', act: 2, tags: ['nation', 'encounter', 'date'],
    requires: { singleIs: false, max: { romantics: 45 } },
    art: 'li_terrace',
    context: 'The terrace · a producer “mentions” something · course-correction hour',
    prompt: '“Off the record,” says the producer, on the record, “the love-story crowd has gone off you a bit. Too much game, not enough garden.” They let it sit. Tonight there’s a free evening and a spare picnic basket, if anyone were the type to be visibly, deliberately soft.',
    recap: 'A producer hints the love crowd’s cooled — there’s a spare picnic basket.',
    choices: {
      left: {
        label: 'The visible date. Full garden',
        tags: ['date', 'loyal'],
        governingStats: { loyalty: 0.6, rizz: 0.4 },
        outcomes: {
          bad: { text: 'The picnic is transparently a PR exercise and {partner} says so, into the boom mic, mid-grape. The soft wing appreciates the effort. The word is doing heavy lifting.', effects: { romantics: 3, drama: -2, bond: 1, burnout: 2 } },
          good: { text: 'Somewhere between the warm lemonade and the argument about cloud shapes, the PR exercise forgets to be one. The soft wing watches two people actually enjoy each other. Course: corrected.', effects: { romantics: 5, drama: -2, bond: 6 } },
          incredible: { text: 'The date is so genuinely good the footage needs no music. {partner}, laughing at your worst joke, mid-golden-hour: the screenshot the Romantics have been waiting for. The nation exhales.', effects: { romantics: 7, drama: -3, bond: 6, public: 2 } },
        },
      },
      right: {
        label: '“I don’t do image repair”',
        tags: ['strategy', 'camera'],
        governingStats: { savvy: 0.7, charisma: 0.3 },
        outcomes: {
          bad: { text: '“I don’t perform romance,” you tell the producer, performing composure. The soft wing’s verdict is swift. The basket goes to Dev and Tash, who make it look effortless. It IS effortless. That’s the point.', effects: { selfrespect: 2, romantics: -3, drama: 2, burnout: 2 } },
          good: { text: '“If they can’t see it in the washing-up rota, a picnic won’t fix it.” The spine wing tattoos it somewhere. The soft wing mutters — but a few of them, quietly, start watching the rota.', effects: { followers: 2, charisma: 3, selfrespect: 4, romantics: -2, drama: 2, savvy: 5 } },
          incredible: { text: '“Tell the love-story crowd the love story is Tuesdays. She hates mornings; I do the kettle. That’s the romance.” The producer blinks. The line airs uncut and converts half the sceptics on the spot.', effects: { followers: 4, charisma: 4, selfrespect: 4, romantics: 2, drama: 1, savvy: 8, public: 2 } },
        },
      },
    },
  },
  {
    id: 'li_nation_poll', act: 2, tags: ['nation', 'text', 'camera'],
    art: 'li_phone',
    context: 'Evening · “TEXT! I’VE GOT A TEXT!!” · the app has spoken',
    prompt: '“Islanders. The public have been voting in tonight’s poll. The categories: MOST GENUINE and BEST TELLY. The results will be read aloud. Immediately. #nowheretohide” — You place second in both, which the villa agrees is somehow worse than last.',
    recap: 'Got a text: you placed second in both Most Genuine and Best Telly.',
    choices: {
      left: {
        label: 'Campaign for genuine',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 0.7, charisma: 0.3 },
        outcomes: {
          bad: { text: '“I’m literally so genuine,” you tell the group, genuinely, which is the one delivery that can’t survive the word ‘literally’. Second place hardens.', effects: { romantics: 2, selfrespect: 1, drama: -2, burnout: 2 } },
          good: { text: 'You don’t campaign. You just spend the evening being the person who refills glasses and remembers names — the long game the genuine category actually measures.', effects: { bond: 4, romantics: 4, selfrespect: 2, drama: -2, loyalty: 5 } },
          incredible: { text: '“Second most genuine,” you toast, “to the villa’s FIRST most genuine—” and you hand the moment to Dev, who blushes into his tea. Giving away the spotlight: the most genuine move on the board.', effects: { bond: 5, romantics: 5, selfrespect: 3, drama: -2, public: 3 } },
        },
      },
      right: {
        label: 'Campaign for best telly',
        tags: ['camera', 'banter'],
        governingStats: { charisma: 0.8, savvy: 0.2 },
        outcomes: {
          bad: { text: 'You attempt a MOMENT and the moment requires a stepladder, a bin lid, and an apology. Best telly, technically. The category is not a compliment tonight.', effects: { drama: 3, romantics: -2, followers: 2, burnout: 3 } },
          good: { text: 'You spend the evening being quotable on purpose — three clean lines, one raised eyebrow, exit on the applause. The chaos wing’s ballot is already filled in.', effects: { drama: 5, romantics: -2, followers: 4, charisma: 5 } },
          incredible: { text: 'You commandeer the Hut for a one-minute acceptance speech for an award you haven’t won, thanking “the wobbly lounger, my rock.” It wins you next week’s poll on the spot.', effects: { drama: 7, romantics: -3, followers: 7, charisma: 8 } },
        },
      },
    },
  },
  {
    id: 'li_nation_pitch', act: 3, tags: ['nation', 'camera', 'chat'],
    art: 'li_beachhut',
    context: 'Final Week · the Beach Hut · your closing argument',
    prompt: '“Last one,” says the producer, and for once the warmth isn’t a trap. “The vote’s live all week. Thirty seconds. Why you?” The chair creaks. The little red light waits. Every wing of the nation is holding a remote.',
    recap: 'Final week — thirty seconds in the Beach Hut to make your case.',
    choices: {
      left: {
        label: 'Pitch the love story',
        tags: ['loyal', 'date', 'camera'],
        governingStats: { loyalty: 0.5, charisma: 0.5 },
        outcomes: {
          bad: { text: 'You pitch the love story and accidentally recap the plot instead of making the case. The soft wing nods along; the undecideds check the other channel.', effects: { romantics: 3, drama: -1, bond: 2 } },
          good: { text: '“We argued about clouds and I’d do it forever.” Specific beats sweeping — the soft wing knows the real thing by its smallness. The clip goes on the final’s cold open.', effects: { followers: 2, charisma: 3, romantics: 5, drama: -1, bond: 5, public: 2 } },
          incredible: { text: 'You talk for thirty seconds about the kettle rota and somehow it’s the most romantic broadcast of the season. The Romantics don’t vote; they MOBILISE.', effects: { followers: 4, charisma: 4, romantics: 7, drama: -1, bond: 6, public: 3 } },
        },
      },
      right: {
        label: 'Pitch the whole ride',
        tags: ['camera', 'drama', 'banter'],
        governingStats: { charisma: 0.7, savvy: 0.3 },
        outcomes: {
          bad: { text: 'You do the showreel pitch — the pie, the firepit, the lounger — and it plays like a clip show narrated by its own star. Fun. Votes: modest.', effects: { drama: 3, romantics: -1, followers: 3 } },
          good: { text: '“You watched me trip over every rake in this garden and get up SMILING. That’s the show.” The chaos wing files it under manifesto. The undecideds laugh, which is half a vote.', effects: { charisma: 3, drama: 5, romantics: -1, followers: 5, public: 2 } },
          incredible: { text: '“Vote for whoever you want — but you’ll TALK about me at work tomorrow either way.” The booth breaks. The producer breaks. Even the Romantics concede the point, furiously, while voting.', effects: { charisma: 4, drama: 7, selfrespect: 2, romantics: -1, followers: 7, public: 3 } },
        },
      },
    },
  },
  {
    id: 'li_nation_villain', act: 2, tags: ['nation', 'camera', 'chat'],
    art: 'li_beachhut',
    context: 'The Beach Hut · a producer, delighted · the edit has decided',
    prompt: '“Bit of feedback,” the voice says, thrilled in a way that should worry you. “You’ve become the one the nation loves to hate. Sofas SHOUT at you. It’s huge.” A pause. “Question is — lean in, or fight the edit?”',
    recap: 'A producer says the nation loves to hate you — lean in, or fight it?',
    choices: {
      left: {
        label: 'Lean into the villain',
        tags: ['drama', 'camera'],
        governingStats: { charisma: 0.6, savvy: 0.4 },
        outcomes: {
          bad: { text: 'You go full pantomime and overshoot into actually-a-bit-much, and the chaos wing’s love curdles. Being hate-watched is a tightrope. You just looked down.', effects: { drama: 3, romantics: -2, selfrespect: -2, burnout: 3 } },
          good: { text: 'You wink at the camera and own it — a smirk here, a raised brow there. The chaos wing goes feral for a villain in on the joke. Sofas shout your name, fondly, furiously.', effects: { drama: 6, romantics: -2, selfrespect: 1, followers: 5, charisma: 4 } },
          incredible: { text: 'You do a Beach Hut so knowingly wicked it loops back to iconic. “They’re not switching off while I’m in here.” The chaos wing crowns you. Even the sofas that hate you set a reminder for tomorrow.', effects: { drama: 8, romantics: -2, followers: 7, public: 3, charisma: 4 } },
        },
      },
      right: {
        label: 'Fight the edit. Be the real you',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 0.6, charisma: 0.4 },
        outcomes: {
          bad: { text: 'You spend a week being deliberately, visibly nice and it reads as a PR rehab tour, which the sofas find even more suspicious than the villainy. The soft wing stays unconvinced.', effects: { romantics: 2, drama: -2, selfrespect: 1, burnout: 3 } },
          good: { text: 'You stop performing and let a few quiet, decent days speak. The edit can only cut what happens — and lately what happens is you being kind. The soft wing starts to turn.', effects: { romantics: 5, drama: -2, selfrespect: 3, bond: 3 } },
          incredible: { text: 'You don’t address it once. You just keep doing the washing-up and checking on the newbies, and the edit, starved of villainy, has to show it. The nation revises the verdict, unprompted.', effects: { romantics: 6, drama: -2, selfrespect: 4, public: 3, bond: 3 } },
        },
      },
    },
  },
  {
    id: 'li_nation_nan', act: 2, tags: ['nation', 'chat', 'camera'],
    art: 'li_terrace',
    context: 'The terrace · a producer, gently · a note from home',
    prompt: '“Small thing,” the producer says. “Your nan’s been on the local news defending you. Bless her. Whole street’s got a WhatsApp group.” They let it land. “Just — whatever you do tonight, she’s watching it Sunday with a cup of tea.”',
    recap: 'A producer mentions your nan’s defending you on the local news every Sunday.',
    choices: {
      left: {
        label: 'Make her proud. Play it clean',
        tags: ['loyal', 'rest'],
        governingStats: { loyalty: 0.6, charisma: 0.4 },
        outcomes: {
          bad: { text: 'You get so aware of the nan-vote you go stiff and boring, and the group chat of nans, hoping for a bit of telly, quietly wishes you’d loosen up. Respectable. Also switch-off-able.', effects: { romantics: 3, drama: -2, selfrespect: 1, burnout: 2 } },
          good: { text: 'You carry yourself like someone whose nan is watching — kind, no gutter stuff, funny without being cruel. The soft wing adopts you as their grandchild. The street WhatsApp is ecstatic.', effects: { romantics: 5, selfrespect: 3, drama: -2, followers: 2 } },
          incredible: { text: 'You give one small, sincere moment to “everyone at home worrying,” no names, no ick. Half the nation’s nans decide you’re marrying in. The local news runs it as the feel-good closer.', effects: { romantics: 7, selfrespect: 3, drama: -2, public: 3, bond: 2 } },
        },
      },
      right: {
        label: 'Give the sofa a show anyway',
        tags: ['banter', 'camera'],
        governingStats: { charisma: 0.7, savvy: 0.3 },
        outcomes: {
          bad: { text: 'You decide the nan can handle a bit of chaos and push it too far, and somewhere a street WhatsApp goes very quiet. The drama lands; the guilt lands harder Sunday.', effects: { drama: 3, romantics: -2, burnout: 3 } },
          good: { text: 'You give the sofas the entertainment they tuned in for, cheeky not cruel, and the nan verdict is “ooh, she’s a live one” — which, from a nan, is a rave review. Both wings sort of win.', effects: { drama: 5, romantics: 1, followers: 4, charisma: 4 } },
          incredible: { text: 'You deliver a bit so gloriously daft it unites the chaos wing and the nans, who agree over tea that you’re “a scream.” The clip airs, the street throws a viewing party. A rare cross-wing landslide.', effects: { drama: 6, romantics: 2, followers: 6, charisma: 4, public: 3 } },
        },
      },
    },
  },
  {
    id: 'li_nation_lie_detector', act: 2, tags: ['nation', 'challenge', 'drama'],
    art: 'li_challenge',
    context: 'Challenge day · the lie detector · science, allegedly',
    prompt: '“It’s the lie detector,” the whiteboard threatens, and the villa’s collective stomach drops. A rented machine, a stern operator, and questions the public submitted specifically to end couples. Your turn in the chair. The nation wrote these.',
    recap: 'The lie detector challenge — and the questions came straight from the public.',
    choices: {
      left: {
        label: 'Answer everything honestly',
        tags: ['loyal', 'challenge'],
        governingStats: { loyalty: 0.7, rizz: 0.3 },
        outcomes: {
          bad: { text: 'You tell the truth and the machine, right about forty percent of the time, calls it a lie in front of everyone. Now you’re defending a truth that failed a science exam. The spine wing winces.', effects: { selfrespect: 2, romantics: 1, drama: 3, burnout: 4 } },
          good: { text: 'Every honest answer reads TRUE, including the terrifying one about whether your head could turn. {partner} exhales. The soft wing frames the readout. Honesty, vindicated by dubious science.', effects: { romantics: 5, selfrespect: 4, drama: -1, bond: 5 } },
          incredible: { text: 'You answer the cruellest public question — the one built to detonate you — with the plain truth, and the needle doesn’t twitch. The villa applauds a machine for once. Soft AND spine wings claim it.', effects: { romantics: 6, selfrespect: 5, drama: -1, bond: 5, public: 3 } },
        },
      },
      right: {
        label: 'Play the machine',
        tags: ['strategy', 'camera'],
        governingStats: { savvy: 0.7, charisma: 0.3 },
        outcomes: {
          bad: { text: 'You get clever, over-engineer an answer, and the machine and {partner} both catch the hedge at the same time. Beaten by a rented gadget on live-ish television. The chaos wing feasts.', effects: { savvy: 2, drama: 4, romantics: -2, burnout: 3 } },
          good: { text: 'You answer just true enough to pass and just vague enough to survive, threading questions built to hang you. The machine blinks green. The chaos wing respects a clean escape.', effects: { savvy: 5, drama: 3, followers: 3, charisma: 3 } },
          incredible: { text: 'You turn the hot seat into a stand-up set, meeting the nation’s nastiest questions with such control the operator gives up. Beat the machine, beat the writers, kept the couple. Masterclass.', effects: { savvy: 8, drama: 4, followers: 6, public: 2, charisma: 3 } },
        },
      },
    },
  },
  {
    id: 'li_nation_tears', act: 2, tags: ['nation', 'camera', 'chat'],
    art: 'li_daybed',
    context: 'The daybed · a hard day · the cameras find the wet eyes',
    prompt: 'It’s been a day, and it’s caught up with you on the daybed, and there is no private crying in this villa — a camera has already found your face. Somewhere the nation leans in. Cry, and they’ll decide in real time what it means.',
    recap: 'A hard day catches up with you on the daybed, on camera, nowhere to hide.',
    choices: {
      left: {
        label: 'Let it out. Don’t hide',
        tags: ['chat', 'camera'],
        governingStats: { loyalty: 0.5, charisma: 0.5 },
        outcomes: {
          bad: { text: 'You cry and immediately apologise for crying, then apologise for apologising, and the loop reads as performance to the cynics. The soft wing feels it; the chaos wing captions it.', effects: { romantics: 2, drama: 2, selfrespect: -1, burnout: 4 } },
          good: { text: 'You let the tears come without narrating them, and {partner} just sits close, no fixing. The soft wing goes quiet in a good way. Real, unperformed, and the edit can’t improve on it.', effects: { romantics: 5, selfrespect: 2, drama: -1, bond: 5, burnout: -3 } },
          incredible: { text: 'You cry properly, honestly, then wipe your face and carry on — no wallow, no milking. The nation’s sofas well up en masse. Vulnerability without a violin: the rarest broadcast there is.', effects: { romantics: 7, selfrespect: 3, drama: -1, bond: 4, public: 3, burnout: -4 } },
        },
      },
      right: {
        label: 'Pull it together',
        tags: ['strategy', 'rest'],
        governingStats: { savvy: 0.6, loyalty: 0.4 },
        outcomes: {
          bad: { text: 'You swallow it so hard it comes out as snappish an hour later at someone who didn’t deserve it. The feeling gets out eventually; it just picks the worst door. The spine wing frowns.', effects: { savvy: 2, drama: 2, selfrespect: 1, burnout: 5 } },
          good: { text: 'You hold it, get to the bathroom, and deal with it off the clock. The spine wing respects the composure — not everything is theirs to watch. Dignity, kept private on purpose.', effects: { selfrespect: 4, savvy: 3, drama: -1, burnout: 2 } },
          incredible: { text: 'You keep it fully together on camera, then fall apart safely with {partner} behind a door the mics don’t reach. The nation sees a rock; {partner} sees the truth. You chose who got which.', effects: { selfrespect: 5, savvy: 3, bond: 5, public: 2 } },
        },
      },
    },
  },
  {
    id: 'li_nation_baby', act: 2, tags: ['nation', 'challenge', 'date'],
    art: 'li_challenge',
    context: 'Challenge day · the baby challenge · a plastic infant, immense stakes',
    prompt: '“It’s the baby challenge,” and the villa is handed a heavy silicone infant that cries on a timer with no mercy. You and {partner} are parents now, apparently, and the nation has STRONG opinions about how you’ll do at 3 a.m. with a robot.',
    recap: 'The baby challenge — you and {partner} get a crying silicone infant, watched.',
    choices: {
      left: {
        label: 'Go full doting parent',
        tags: ['date', 'loyal'],
        governingStats: { loyalty: 0.6, rizz: 0.4 },
        outcomes: {
          bad: { text: 'You take the plastic baby deadly seriously, name it, and get so precious about “co-parenting” that {partner} laughs and it sours into a row about a doll. The soft wing looks away.', effects: { romantics: 3, drama: 1, bond: -1, burnout: 3 } },
          good: { text: 'You and {partner} split the night shifts, bicker fondly about the “right” way to hold silicone, and accidentally look exactly like a real couple doing real life. The soft wing melts.', effects: { romantics: 6, drama: -1, bond: 5, followers: 2 } },
          incredible: { text: 'You do a 3 a.m. plastic-baby feed with total tenderness, entirely unaware of the camera, and it becomes the broodiest sixty seconds the show’s ever aired. A biological clock ticks nationwide.', effects: { romantics: 8, drama: -1, bond: 6, public: 3, followers: 2 } },
        },
      },
      right: {
        label: 'Play it for laughs',
        tags: ['banter', 'camera'],
        governingStats: { charisma: 0.7, savvy: 0.3 },
        outcomes: {
          bad: { text: 'Your bit about the baby “inheriting your worst habits” dies when you can’t work the fake pram, and you spend the challenge losing a fight to a stroller. The chaos wing enjoys the wrong part.', effects: { drama: 3, romantics: -2, charisma: 2, burnout: 3 } },
          good: { text: 'You do broad, daft, committed sitcom parenting and the villa cries laughing as you push a doll around narrating its future disappointments. The chaos wing books front-row seats.', effects: { drama: 5, romantics: -2, charisma: 5, followers: 4 } },
          incredible: { text: 'You stage a full mockumentary of villa parenthood — sleepless, unhinged, a plastic baby with a backstory — and it’s the funniest thing all series. The chaos wing adopts the baby. And you.', effects: { drama: 7, romantics: -2, charisma: 4, followers: 7, public: 2 } },
        },
      },
    },
  },
  {
    id: 'li_nation_hashtag', act: 3, tags: ['nation', 'camera', 'chat'],
    art: 'li_terrace',
    context: 'Final Week · a producer, off-hand · the timelines are moving',
    prompt: '“You didn’t hear it from me,” the producer says, hearing themselves say it, “but there’s a hashtag to save you two. It’s trending above the football.” They let it sit. “The people running it are watching for a reason to keep going. Give them one.”',
    recap: 'A hashtag to save your couple is trending — the campaign needs a reason to go on.',
    choices: {
      left: {
        label: 'Give the shippers their moment',
        tags: ['loyal', 'date'],
        governingStats: { loyalty: 0.6, rizz: 0.4 },
        outcomes: {
          bad: { text: 'You stage the grand romantic gesture the hashtag wants and it reeks of stagecraft, {partner} included. The shippers clock the effort and dock points for the smell of PR. Wrong texture.', effects: { romantics: 3, drama: -1, bond: 1, burnout: 3 } },
          good: { text: 'You give them one true, small thing — {partner}, the good mirror, a slow dance to no music. The hashtag explodes. The shippers didn’t want a spectacle; they wanted proof, and you gave it.', effects: { romantics: 6, drama: -2, bond: 5, followers: 3 } },
          incredible: { text: 'You do the least performative thing possible on camera and it becomes the campaign’s banner clip. The hashtag doubles overnight. The soft wing isn’t voting for a couple now; it’s voting for a future.', effects: { romantics: 8, drama: -2, bond: 6, public: 3, followers: 3 } },
        },
      },
      right: {
        label: 'Refuse to be a campaign',
        tags: ['strategy', 'camera'],
        governingStats: { savvy: 0.6, charisma: 0.4 },
        outcomes: {
          bad: { text: 'You publicly wave off the hashtag as “not why we’re here,” and it reads as ungrateful to the very people carrying you. The campaign deflates; the spine wing’s nod doesn’t fill the gap.', effects: { selfrespect: 3, romantics: -3, drama: 1, burnout: 3 } },
          good: { text: '“We’re not a campaign, we’re two people,” you say, and mean it, and refusing to be marketed becomes its own kind of catnip. The spine wing surges; oddly, so do a few shippers.', effects: { selfrespect: 5, romantics: 1, savvy: 3, followers: 3 } },
          incredible: { text: 'You thank the fans sincerely, then keep living exactly as you were — no gesture, no pandering — and the honesty converts the campaign into something no marketing team could stage. Uncontrollable, and yours.', effects: { selfrespect: 6, romantics: 2, savvy: 4, public: 3, followers: 3 } },
        },
      },
    },
  },
];
