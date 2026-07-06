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
];
