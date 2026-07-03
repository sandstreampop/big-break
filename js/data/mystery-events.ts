// MYSTERY pack event deck (pack #2). Compact vertical slice: enough
// path-agnostic cards to fill three acts without the deck running dry, plus
// path-affine act-2/3 beats and one finale card per summit. Same schema as the
// music deck (GameEvent) — effects/governingStats use the mystery taxonomy
// (nerve/charm/insight/alliance, burnout=Suspicion, fame=Notoriety, money=Cash,
// pathProgress=Leads, rivalry=Feud, and the clues counter via the clues plugin).

import type { GameEvent } from '../types.js';

// Small authoring helper kept inline (data file, no logic export).
const O = (text: string, effects: any) => ({ text, effects });

export const MYSTERY_EVENTS: GameEvent[] = [
  // ── Openers / social game (path-agnostic, any act) ──
  {
    id: 'm_welcome_toast', act: [1, 2, 3], pathAffinity: [], weight: 10,
    context: 'The Veranda', prompt: 'Champagne on arrival. Everyone is smiling too hard. Somebody proposes a toast "to us."',
    choices: {
      left: {
        label: 'Charm the room', tags: ['social'], governingStats: { charm: 1 },
        outcomes: {
          bad: O('You over-do it. They clock you as a player.', { charm: 2, burnout: 4 }),
          good: O('Warm, easy, memorable. The producers cut to your face twice.', { charm: 5, fame: 6 }),
          incredible: O('You own the veranda by sunset. A clip goes wide overnight.', { charm: 8, fame: 14, alliance: 3 }),
        },
      },
      right: {
        label: 'Hang back and watch', tags: ['observe'], governingStats: { insight: 1, nerve: 0.4 },
        outcomes: {
          bad: O('You look aloof. Someone whispers that the quiet one is dangerous.', { insight: 3, burnout: 3 }),
          good: O('You catch who flinched at the word "trust". Filed away.', { insight: 6, clues: 1 } ),
          incredible: O('Three tells in one toast. You already know who is lying.', { insight: 9, clues: 1, nerve: 3 }),
        },
      },
    },
  },
  {
    id: 'm_confession_cam', act: [1, 2, 3], pathAffinity: [], weight: 9,
    context: 'The Confession Booth', prompt: 'The little red light. The producer mouths: "give us something."',
    choices: {
      left: {
        label: 'Play to the audience', tags: ['social'], governingStats: { charm: 1 },
        outcomes: {
          bad: O('Try-hard. The edit will not be kind.', { charm: 1, fame: 2, burnout: 3 }),
          good: O('A quotable line. It trends by breakfast.', { fame: 12, charm: 3 }),
          incredible: O('You make the whole country root for you in ninety seconds.', { fame: 22, charm: 5 }),
        },
      },
      right: {
        label: 'Lay out your theory', tags: ['observe'], governingStats: { insight: 1 },
        outcomes: {
          bad: O('You say too much. Now the killer knows you are hunting.', { insight: 4, rivalry: 2, burnout: 4 }),
          good: O('You connect two guests to the same alibi. The board fills in.', { insight: 6, clues: 1 }),
          incredible: O('You name a lie on camera and let it breathe. Chilling television.', { insight: 8, clues: 1, fame: 8 }),
        },
      },
    },
  },
  {
    id: 'm_alliance_pact', act: [1, 2, 3], pathAffinity: [], weight: 9,
    context: 'The Pool at 2am', prompt: 'A guest floats over. "Final three. You, me, and whoever we decide. Deal?"',
    choices: {
      left: {
        label: 'Shake on it', tags: ['deal', 'social'], governingStats: { charm: 0.6, alliance: 0.6 },
        outcomes: {
          bad: O('They screenshot the handshake and sell you out at breakfast.', { alliance: 2, rivalry: 2 }),
          good: O('A real bond. You have a number now.', { alliance: 7, nerve: 2 }),
          incredible: O('You become the axis the whole house rotates around.', { alliance: 10, charm: 4 }),
        },
      },
      right: {
        label: 'Non-committal smile', tags: ['observe'], governingStats: { nerve: 1 },
        outcomes: {
          bad: O('They take it as an insult. One more enemy.', { nerve: 2, rivalry: 3, burnout: 3 }),
          good: O('You keep your options open and your read sharp.', { nerve: 5, insight: 2 }),
          incredible: O('You let them think they recruited you. Perfect leverage.', { nerve: 7, insight: 3, alliance: 3 }),
        },
      },
    },
  },
  {
    id: 'm_missing_guest', act: [1, 2, 3], pathAffinity: [], weight: 11,
    context: 'Breakfast, one chair empty', prompt: 'A guest did not come down. The staff are too calm about it. Something is wrong.',
    choices: {
      left: {
        label: 'Search their room', tags: ['investigate'], governingStats: { insight: 0.7, nerve: 0.5 },
        outcomes: {
          bad: O('You get caught mid-drawer. Now YOU look guilty.', { burnout: 8, rivalry: 2, insight: 2 }),
          good: O('A torn schedule, a hidden phone. Threads to pull.', { insight: 6, clues: 1 }),
          incredible: O('You find the thing everyone else will miss. The case cracks open.', { insight: 9, clues: 2, pathProgress: 1 }),
        },
      },
      right: {
        label: 'Comfort the house', tags: ['social'], governingStats: { charm: 1 },
        outcomes: {
          bad: O('You fumble the mood. The panic spreads.', { charm: 1, burnout: 5 }),
          good: O('You hold the room together. People remember who stayed calm.', { charm: 5, alliance: 4, fame: 5 }),
          incredible: O('You are the steady hand on national television. Beloved.', { charm: 8, alliance: 5, fame: 12 }),
        },
      },
    },
  },
  {
    id: 'm_the_dossier', act: [1, 2, 3], pathAffinity: [], weight: 8,
    context: 'The Library', prompt: 'A locked drawer, a cheap lock, and nobody around. The producers left the key in reach. A test?',
    choices: {
      left: {
        label: 'Pick the lock', tags: ['investigate'], governingStats: { insight: 0.6, nerve: 0.6 },
        outcomes: {
          bad: O('The drawer was bait. A camera whirs. Suspicion on you.', { burnout: 9, insight: 2 }),
          good: O('Guest files. Someone lied about why they are here.', { insight: 7, clues: 1 }),
          incredible: O('The whole cast list, annotated by production. You see the shape of it.', { insight: 10, clues: 2 }),
        },
      },
      right: {
        label: 'Leave it, tell no one', tags: ['observe'], governingStats: { nerve: 1 },
        outcomes: {
          bad: O('Someone saw you hesitate. Now they wonder what you wanted.', { nerve: 2, burnout: 4 }),
          good: O('Discipline. You would rather earn it clean.', { nerve: 6 }),
          incredible: O('You note who ELSE circles the drawer. That is the real clue.', { nerve: 7, insight: 4, clues: 1 }),
        },
      },
    },
  },
  {
    id: 'm_producer_favor', act: [1, 2, 3], pathAffinity: [], weight: 8, shop: true,
    context: 'A quiet word from a PA', prompt: 'Production offers a "wellness stipend" — cash now, but you owe them a scene later.',
    choices: {
      left: {
        label: 'Take the cash', tags: ['deal'], cost: 0, governingStats: { charm: 0.5, nerve: 0.5 },
        outcomes: {
          bad: O('The scene they cash in is humiliating. Worth it? Barely.', { money: 120, burnout: 6, fame: 4 }),
          good: O('Easy money, manageable scene.', { money: 160, fame: 6 }),
          incredible: O('You turn their setup into your best moment. Paid to shine.', { money: 200, fame: 12, charm: 3 }),
        },
      },
      right: {
        label: 'Keep your leverage', tags: ['observe'], governingStats: { nerve: 1 },
        outcomes: {
          bad: O('You wonder if you just left rent on the table.', { nerve: 2 }),
          good: O('You owe no one. That is worth more than the stipend.', { nerve: 5, alliance: 2 }),
          incredible: O('Refusing reads as integrity. The audience clocks it.', { nerve: 6, fame: 8 }),
        },
      },
    },
  },
  {
    id: 'm_gossip_circle', act: [1, 2, 3], pathAffinity: [], weight: 9,
    context: 'The Hot Tub Summit', prompt: 'The gossip is flowing. You can steer it — or read it.',
    choices: {
      left: {
        label: 'Plant a rumor', tags: ['social', 'deal'], governingStats: { charm: 0.7, insight: 0.4 },
        outcomes: {
          bad: O('It traces straight back to you. Ugly.', { rivalry: 3, burnout: 5, charm: 1 }),
          good: O('The house turns on someone else for a night. Breathing room.', { charm: 4, alliance: 3, rivalry: -1 }),
          incredible: O('You move the whole board with one sentence.', { charm: 7, alliance: 4, pathProgress: 1 }),
        },
      },
      right: {
        label: 'Just listen', tags: ['observe'], governingStats: { insight: 1 },
        outcomes: {
          bad: O('Nothing but noise tonight.', { insight: 2 }),
          good: O('One story does not add up. You note the teller.', { insight: 6, clues: 1 }),
          incredible: O('Every contradiction lines up into a timeline.', { insight: 9, clues: 1, nerve: 2 }),
        },
      },
    },
  },
  {
    id: 'm_the_challenge', act: [1, 2, 3], pathAffinity: [], weight: 10,
    context: 'Immunity Challenge', prompt: 'A physical-social gauntlet on the lawn. Win it and you are safe this round.',
    choices: {
      left: {
        label: 'Go all out', tags: ['physical'], governingStats: { nerve: 1 },
        outcomes: {
          bad: O('You gas out on camera. Rough edit.', { nerve: 2, burnout: 7 }),
          good: O('You take it. Safe, and it looked good.', { nerve: 6, fame: 7, pathProgress: 1 }),
          incredible: O('A highlight-reel win. The house respects it.', { nerve: 9, fame: 14, alliance: 3 }),
        },
      },
      right: {
        label: 'Throw it, watch the others', tags: ['observe'], governingStats: { insight: 0.8, nerve: 0.3 },
        outcomes: {
          bad: O('You look weak AND learn nothing. Worst of both.', { burnout: 5, insight: 2 }),
          good: O('You see who gets vicious when they want something.', { insight: 6, clues: 1 }),
          incredible: O('You read the whole cast under pressure. Gold.', { insight: 9, clues: 1, nerve: 2 }),
        },
      },
    },
  },
  {
    id: 'm_night_noise', act: [1, 2, 3], pathAffinity: [], weight: 9,
    context: '3am, a sound in the hall', prompt: 'Footsteps. A door. You could follow — or stay safely in bed and keep your name clean.',
    choices: {
      left: {
        label: 'Follow the footsteps', tags: ['investigate'], governingStats: { nerve: 0.6, insight: 0.6 },
        outcomes: {
          bad: O('You round the corner into the worst possible witness: everyone.', { burnout: 9, rivalry: 2 }),
          good: O('You see who moves at night, and where.', { insight: 6, clues: 1, nerve: 2 }),
          incredible: O('You catch the meeting nobody was supposed to see.', { insight: 8, clues: 2, pathProgress: 1 }),
        },
      },
      right: {
        label: 'Stay put, listen', tags: ['observe'], governingStats: { insight: 0.7 },
        outcomes: {
          bad: O('You drift off. Morning brings only rumor.', { insight: 1, burnout: 2 }),
          good: O('Two voices, one you know. Interesting.', { insight: 5, clues: 1 }),
          incredible: O('You map the whole route by sound alone.', { insight: 7, clues: 1, nerve: 3 }),
        },
      },
    },
  },
  {
    id: 'm_wardrobe', act: [1, 2, 3], pathAffinity: [], weight: 7, shop: true,
    context: 'The Glam Room', prompt: 'Stylist offers a bold look for tonight. Big swing, big screen time.',
    choices: {
      left: {
        label: 'Wear the statement piece', tags: ['social'], cost: 40, governingStats: { charm: 1 },
        outcomes: {
          bad: O('It reads as desperate. The comments are savage.', { money: -40, charm: 1, burnout: 4 }),
          good: O('You look incredible. The camera loves you tonight.', { money: -40, charm: 4, fame: 12 }),
          incredible: O('Iconic. The look becomes the episode.', { money: -40, charm: 6, fame: 20 }),
        },
      },
      right: {
        label: 'Keep it low-key', tags: ['observe'], governingStats: { nerve: 0.8 },
        outcomes: {
          bad: O('You blend in. Forgettable night.', { nerve: 2 }),
          good: O('Understated. You save your money and your energy.', { nerve: 4, money: 20 }),
          incredible: O('Quiet confidence reads as the realest person here.', { nerve: 5, fame: 8, alliance: 2 }),
        },
      },
    },
  },
  {
    id: 'm_the_accusation', act: [1, 2, 3], pathAffinity: [], weight: 10,
    context: 'Dinner goes sideways', prompt: 'A guest points a finger across the table — at you. The room holds its breath.',
    choices: {
      left: {
        label: 'Turn it back with facts', tags: ['observe'], governingStats: { insight: 0.7, nerve: 0.5 },
        outcomes: {
          bad: O('You over-explain. Guilt by verbosity.', { burnout: 8, insight: 2 }),
          good: O('You calmly dismantle the accusation. Their turn to sweat.', { insight: 5, nerve: 4, rivalry: 2 }),
          incredible: O('You flip the whole table onto your accuser.', { insight: 7, nerve: 5, alliance: 4, rivalry: 3 }),
        },
      },
      right: {
        label: 'Laugh it off', tags: ['social'], governingStats: { charm: 1 },
        outcomes: {
          bad: O('It looks like a dodge. Suspicion sticks.', { burnout: 7, charm: 1 }),
          good: O('You defuse it with a grin. The audience sides with you.', { charm: 5, fame: 8 }),
          incredible: O('You make your accuser look ridiculous and stay adored.', { charm: 8, fame: 14, alliance: 2 }),
        },
      },
    },
  },
  {
    id: 'm_service_stairs', act: [1, 2, 3], pathAffinity: [], weight: 8,
    context: 'Behind the kitchen', prompt: 'A staff member will trade a peek at the security logs — for a favor you may regret.',
    choices: {
      left: {
        label: 'Make the trade', tags: ['deal', 'investigate'], governingStats: { charm: 0.5, insight: 0.5 },
        outcomes: {
          bad: O('The logs are doctored and now you owe a stranger.', { money: -60, insight: 2, rivalry: 2 }),
          good: O('Timestamps that contradict two alibis.', { money: -30, insight: 5, clues: 1 }),
          incredible: O('The whole night, on tape, in order.', { insight: 8, clues: 2, pathProgress: 1 }),
        },
      },
      right: {
        label: 'Report the offer', tags: ['social'], governingStats: { alliance: 0.6, nerve: 0.5 },
        outcomes: {
          bad: O('Nobody thanks the snitch.', { rivalry: 2, burnout: 4, alliance: 1 }),
          good: O('Production owes you one. Quietly.', { alliance: 4, fame: 4 }),
          incredible: O('You bank a real favor with the people who run everything.', { alliance: 6, money: 80, fame: 6 }),
        },
      },
    },
  },
  {
    id: 'm_vote_night', act: [1, 2, 3], pathAffinity: [], weight: 11,
    context: 'Elimination Ceremony', prompt: 'Somebody goes home tonight. The whip count is close, and your vote is loud.',
    choices: {
      left: {
        label: 'Whip the votes', tags: ['social', 'deal'], governingStats: { charm: 0.6, alliance: 0.6 },
        outcomes: {
          bad: O('Your bloc collapses. You are exposed as the strategist.', { rivalry: 4, burnout: 7, alliance: 1 }),
          good: O('Your number goes home. The house learns who counts.', { alliance: 6, nerve: 3, pathProgress: 1 }),
          incredible: O('A blindside for the ages. You run this place now.', { alliance: 9, charm: 5, fame: 10, pathProgress: 1 }),
        },
      },
      right: {
        label: 'Vote your read', tags: ['observe'], governingStats: { insight: 1 },
        outcomes: {
          bad: O('You were wrong. Your ally goes home instead.', { insight: 2, alliance: -3, burnout: 5 }),
          good: O('You send the right one out and learn who agreed.', { insight: 6, clues: 1, alliance: 2 }),
          incredible: O('You called it days ago and let the house catch up.', { insight: 8, clues: 1, nerve: 4 }),
        },
      },
    },
  },
  {
    id: 'm_sponsor_ad', act: [1, 2, 3], pathAffinity: [], weight: 7, shop: true,
    context: 'A branded segment', prompt: 'The show wants you to hawk a smoothie on camera. Cash and clout, dignity optional.',
    choices: {
      left: {
        label: 'Sell it with your whole chest', tags: ['social'], governingStats: { charm: 1 },
        outcomes: {
          bad: O('Cringe compilation fuel. But it paid.', { money: 90, fame: 4, burnout: 4 }),
          good: O('You make a smoothie ad watchable. Rare gift.', { money: 130, fame: 10 }),
          incredible: O('The ad becomes a meme in your favor. Brands call.', { money: 170, fame: 18, charm: 3 }),
        },
      },
      right: {
        label: 'Do it deadpan', tags: ['observe'], governingStats: { nerve: 1 },
        outcomes: {
          bad: O('Too dry. Production is annoyed.', { money: 60, burnout: 3 }),
          good: O('Deadpan lands as iconic. Less effort, same money.', { money: 110, fame: 8, nerve: 3 }),
          incredible: O('Your flat delivery is the funniest thing all season.', { money: 130, fame: 16, nerve: 4 }),
        },
      },
    },
  },
  {
    id: 'm_the_letter', act: [1, 2, 3], pathAffinity: [], weight: 8,
    context: 'A note under your door', prompt: '"I know what you saw. Meet me at the boathouse. Come alone." No signature.',
    choices: {
      left: {
        label: 'Go to the boathouse', tags: ['investigate'], governingStats: { nerve: 0.7, insight: 0.5 },
        outcomes: {
          bad: O('An ambush of cameras and a staged fight. You look unhinged.', { burnout: 10, fame: 4 }),
          good: O('A scared guest hands you half the story.', { insight: 6, clues: 1, nerve: 3 }),
          incredible: O('The witness cracks and names a name. You have them.', { insight: 8, clues: 2, pathProgress: 1 }),
        },
      },
      right: {
        label: 'Bring an ally, quietly', tags: ['social'], governingStats: { alliance: 0.7 },
        outcomes: {
          bad: O('Your ally blabs. The trap springs anyway.', { burnout: 7, alliance: -2 }),
          good: O('Backup keeps it honest. You get the story AND a witness.', { alliance: 5, insight: 4, clues: 1 }),
          incredible: O('Two of you corner the truth. Airtight.', { alliance: 7, insight: 6, clues: 1, nerve: 3 }),
        },
      },
    },
  },
  {
    id: 'm_meltdown', act: [1, 2, 3], pathAffinity: [], weight: 8,
    requires: { burnoutMin: 45 },
    context: 'You are running on empty', prompt: 'The suspicion, the cameras, the sleeplessness. You feel the crack coming. Do you break here — or somewhere private?',
    choices: {
      left: {
        label: 'Step off camera and breathe', tags: ['rest'], governingStats: { nerve: 1 },
        outcomes: {
          bad: O('They find you anyway. "The unraveling" airs Tuesday.', { burnout: -6, fame: 3 }),
          good: O('You reset in the one blind spot on the property.', { burnout: -18, nerve: 3 }),
          incredible: O('You come back sharper than you left. Nobody saw.', { burnout: -26, nerve: 5, insight: 3 }),
        },
      },
      right: {
        label: 'Channel it into the game', tags: ['social'], governingStats: { charm: 0.5, nerve: 0.5 },
        outcomes: {
          bad: O('You explode at the wrong person. Villain edit locked in.', { burnout: 4, rivalry: 4, fame: 8 }),
          good: O('You turn the tension into a riveting scene.', { burnout: -6, fame: 12, charm: 3 }),
          incredible: O('Raw honesty on camera. The audience falls for you harder.', { burnout: -10, fame: 18, alliance: 3 }),
        },
      },
    },
  },

  // ── More path-agnostic beats (fill three acts; feed every summit) ──
  {
    id: 'm_trust_fall', act: [1, 2, 3], pathAffinity: [], weight: 9,
    context: 'A team task', prompt: 'The producers pair you with someone you do not trust. Sink or swim, together.',
    choices: {
      left: {
        label: 'Carry the task', tags: ['physical'], governingStats: { nerve: 1 },
        outcomes: {
          bad: O('You do all the work and get none of the credit.', { nerve: 4, burnout: 6 }),
          good: O('You steady the pair and win. Nerve noted.', { nerve: 7, alliance: 2 }),
          incredible: O('Grace under fire. The house sees a leader.', { nerve: 10, alliance: 4, fame: 6 }),
        },
      },
      right: {
        label: 'Feel them out', tags: ['social'], governingStats: { charm: 0.6, alliance: 0.4 },
        outcomes: {
          bad: O('They use the closeness to plant a rumor about you.', { charm: 1, rivalry: 2, burnout: 3 }),
          good: O('An unlikely ally. Worth more than the task.', { alliance: 6, charm: 3 }),
          incredible: O('You turn a rival into a lieutenant.', { alliance: 8, charm: 4, nerve: 2 }),
        },
      },
    },
  },
  {
    id: 'm_press_junket', act: [1, 2, 3], pathAffinity: [], weight: 8,
    context: 'A satellite interview', prompt: 'Morning shows want a soundbite. Say the right thing to the right camera.',
    choices: {
      left: {
        label: 'Charm the host', tags: ['social'], governingStats: { charm: 1 },
        outcomes: {
          bad: O('You freeze on live radio. Painful.', { charm: 2, burnout: 4 }),
          good: O('You give great tape. The clips travel.', { charm: 4, fame: 14 }),
          incredible: O('You become the story of the news cycle.', { charm: 6, fame: 26, alliance: 2 }),
        },
      },
      right: {
        label: 'Tease the mystery', tags: ['observe'], governingStats: { insight: 0.6, charm: 0.4 },
        outcomes: {
          bad: O('You imply too much. The killer is now watching you.', { insight: 3, rivalry: 2, fame: 6 }),
          good: O('You hint at your theory. Ratings — and pressure — climb.', { insight: 4, fame: 12 }),
          incredible: O('The nation starts playing detective alongside you.', { insight: 6, fame: 20, clues: 1 }),
        },
      },
    },
  },
  {
    id: 'm_kitchen_alibi', act: [1, 2, 3], pathAffinity: [], weight: 9,
    context: 'Reconstructing the night', prompt: 'You can quietly test one guest’s alibi by retracing their story in the kitchen.',
    choices: {
      left: {
        label: 'Retrace every step', tags: ['investigate'], governingStats: { insight: 1 },
        outcomes: {
          bad: O('You misremember the layout. Your notes are worthless.', { insight: 2, burnout: 4 }),
          good: O('The timing does not work. Their alibi is a lie.', { insight: 7, clues: 1 }),
          incredible: O('You reconstruct the whole night to the minute.', { insight: 10, clues: 2 }),
        },
      },
      right: {
        label: 'Bribe the night cook', tags: ['deal'], governingStats: { charm: 0.5, nerve: 0.5 },
        outcomes: {
          bad: O('The cook takes your cash and tells the guest.', { money: -50, rivalry: 3 }),
          good: O('The cook remembers who was NOT in the kitchen.', { money: -30, insight: 4, clues: 1 }),
          incredible: O('The cook hands you a receipt with a name and a time.', { money: -20, insight: 6, clues: 2 }),
        },
      },
    },
  },
  {
    id: 'm_charm_offensive', act: [1, 2, 3], pathAffinity: [], weight: 9,
    context: 'Sunset on the dock', prompt: 'A quiet golden hour. Perfect for a heart-to-heart that America will eat up.',
    choices: {
      left: {
        label: 'Open up (a little)', tags: ['social'], governingStats: { charm: 1 },
        outcomes: {
          bad: O('Oversharing. It reads as strategy.', { charm: 2, fame: 6, burnout: 3 }),
          good: O('Vulnerable and real. The audience leans in.', { charm: 6, fame: 12, alliance: 2 }),
          incredible: O('The most-clipped moment of the week. Beloved.', { charm: 9, fame: 22, alliance: 3 }),
        },
      },
      right: {
        label: 'Build a real bond', tags: ['social'], governingStats: { alliance: 0.7, charm: 0.4 },
        outcomes: {
          bad: O('They were only there for screen time.', { alliance: 1, burnout: 2 }),
          good: O('A genuine friendship. A vote you can count on.', { alliance: 7, charm: 2 }),
          incredible: O('An unbreakable pair. The house takes note.', { alliance: 10, charm: 3, nerve: 2 }),
        },
      },
    },
  },
  {
    id: 'm_sponsor_suite', act: [1, 2, 3], pathAffinity: [], weight: 7, shop: true,
    context: 'The luxury reward', prompt: 'You won a night in the sponsor suite. Rest, or work the room service staff for intel?',
    choices: {
      left: {
        label: 'Actually rest', tags: ['rest'], governingStats: { nerve: 1 },
        outcomes: {
          bad: O('You cannot switch your brain off.', { burnout: -6, nerve: 2 }),
          good: O('Real sleep. You wake up human again.', { burnout: -16, nerve: 4 }),
          incredible: O('A full reset. Sharp, calm, unbothered.', { burnout: -24, nerve: 6, insight: 2 }),
        },
      },
      right: {
        label: 'Work the staff', tags: ['investigate', 'deal'], governingStats: { charm: 0.6, insight: 0.5 },
        outcomes: {
          bad: O('They report you to production. Suspicion up.', { burnout: 6, insight: 2 }),
          good: O('Staff see everything. Now so do you.', { insight: 6, clues: 1, money: 40 }),
          incredible: O('The concierge basically hands you the case file.', { insight: 8, clues: 2 }),
        },
      },
    },
  },
  {
    id: 'm_the_ledger', act: [1, 2, 3], pathAffinity: [], weight: 8,
    context: 'Following the money', prompt: 'A guest keeps getting "gifts." Someone is paying them. You could trace it — or profit from it.',
    choices: {
      left: {
        label: 'Trace the payments', tags: ['investigate'], governingStats: { insight: 1 },
        outcomes: {
          bad: O('The trail is a decoy. Wasted a day.', { insight: 2, burnout: 4 }),
          good: O('The money leads somewhere it should not.', { insight: 6, clues: 1 }),
          incredible: O('You find who is funding whom. Motive, in numbers.', { insight: 9, clues: 2, pathProgress: 1 }),
        },
      },
      right: {
        label: 'Get your cut', tags: ['deal'], governingStats: { nerve: 0.6, charm: 0.5 },
        outcomes: {
          bad: O('You get greedy and get caught skimming.', { money: 60, rivalry: 3, burnout: 5 }),
          good: O('You broker a quiet finder’s fee.', { money: 130, nerve: 3 }),
          incredible: O('You insert yourself into the whole arrangement. Lucrative.', { money: 210, nerve: 5, charm: 3 }),
        },
      },
    },
  },
  {
    id: 'm_public_fight', act: [1, 2, 3], pathAffinity: [], weight: 9,
    context: 'It boils over', prompt: 'Two guests are screaming. Cameras swarm. You can step in — or step back and let it burn.',
    choices: {
      left: {
        label: 'Play peacemaker', tags: ['social'], governingStats: { charm: 0.6, alliance: 0.5 },
        outcomes: {
          bad: O('You catch a stray. Now they are both mad at you.', { rivalry: 3, burnout: 5, charm: 1 }),
          good: O('You cool it down. The house owes you calm.', { charm: 4, alliance: 5, fame: 6 }),
          incredible: O('You broker peace on camera. Statesmanlike.', { charm: 6, alliance: 7, fame: 12 }),
        },
      },
      right: {
        label: 'Watch who says what', tags: ['observe'], governingStats: { insight: 1 },
        outcomes: {
          bad: O('Too much noise to learn anything.', { insight: 2, burnout: 3 }),
          good: O('People tell the truth when they are furious. You listen.', { insight: 6, clues: 1 }),
          incredible: O('A confession hides inside the shouting. You catch it.', { insight: 9, clues: 2, nerve: 2 }),
        },
      },
    },
  },
  {
    id: 'm_fan_mail', act: [1, 2, 3], pathAffinity: [], weight: 7,
    context: 'A reward: messages from home', prompt: 'The audience has been voting. A stack of fan mail says exactly how they see you.',
    choices: {
      left: {
        label: 'Lean into your edit', tags: ['social'], governingStats: { charm: 1 },
        outcomes: {
          bad: O('You believe your own hype and get sloppy.', { fame: 8, burnout: 4 }),
          good: O('You give the people more of what they love.', { fame: 16, charm: 3 }),
          incredible: O('You become appointment television.', { fame: 28, charm: 5, alliance: 2 }),
        },
      },
      right: {
        label: 'Study what they missed', tags: ['observe'], governingStats: { insight: 0.8 },
        outcomes: {
          bad: O('You spiral over one mean letter.', { burnout: 5, insight: 2 }),
          good: O('The audience noticed a detail you had not. Useful.', { insight: 6, clues: 1 }),
          incredible: O('A viewer’s theory unlocks yours. Crowd-sourced genius.', { insight: 9, clues: 2 }),
        },
      },
    },
  },
  {
    id: 'm_the_wire', act: [1, 2, 3], pathAffinity: [], weight: 8,
    context: 'A hidden microphone', prompt: 'You found a mic taped under a table. Someone is recording the house. Do you use it — or expose it?',
    choices: {
      left: {
        label: 'Listen in', tags: ['investigate'], governingStats: { insight: 0.7, nerve: 0.5 },
        outcomes: {
          bad: O('They planted it to catch a snoop. Gotcha.', { burnout: 9, insight: 2 }),
          good: O('You hear a plan you were not meant to hear.', { insight: 7, clues: 1 }),
          incredible: O('You catch the whole conspiracy on tape.', { insight: 10, clues: 2, pathProgress: 1 }),
        },
      },
      right: {
        label: 'Expose it to the house', tags: ['social'], governingStats: { charm: 0.6, nerve: 0.5 },
        outcomes: {
          bad: O('Nobody believes you. You look paranoid.', { burnout: 6, charm: 1 }),
          good: O('The house rallies around you. Trust up.', { alliance: 5, fame: 8, nerve: 3 }),
          incredible: O('You become the honest one in a den of liars.', { alliance: 7, fame: 16, charm: 3 }),
        },
      },
    },
  },
  {
    id: 'm_double_bluff', act: [1, 2, 3], pathAffinity: [], weight: 8,
    context: 'A guest confides in you', prompt: '"I trust only you. Here is my secret." Is it a gift, a test, or a trap?',
    choices: {
      left: {
        label: 'Keep the secret, bank the trust', tags: ['social'], governingStats: { alliance: 0.7 },
        outcomes: {
          bad: O('It was a loyalty test. You passed — into their trap.', { alliance: 3, rivalry: 2 }),
          good: O('You keep it. They are yours now.', { alliance: 7, nerve: 2 }),
          incredible: O('Absolute loyalty, earned. A pillar of your game.', { alliance: 10, charm: 3 }),
        },
      },
      right: {
        label: 'Read the tell behind it', tags: ['observe'], governingStats: { insight: 1 },
        outcomes: {
          bad: O('You overthink it and insult a genuine friend.', { insight: 2, alliance: -2, burnout: 3 }),
          good: O('The "secret" reveals what they are hiding.', { insight: 7, clues: 1 }),
          incredible: O('A double bluff, seen through completely.', { insight: 10, clues: 1, nerve: 3 }),
        },
      },
    },
  },
  {
    id: 'm_final_supper', act: [2, 3], pathAffinity: [], weight: 9,
    context: 'The narrowing house', prompt: 'Fewer chairs, higher stakes. Every word at dinner is a move now.',
    choices: {
      left: {
        label: 'Make your case for staying', tags: ['social'], governingStats: { charm: 0.6, nerve: 0.5 },
        outcomes: {
          bad: O('You beg. It reads as weak.', { charm: 1, burnout: 5 }),
          good: O('Confident, undeniable. Your stock rises.', { charm: 5, fame: 10, alliance: 2 }),
          incredible: O('You reframe the whole endgame around yourself.', { charm: 8, fame: 16, pathProgress: 1 }),
        },
      },
      right: {
        label: 'Force a slip', tags: ['investigate'], governingStats: { insight: 0.8, nerve: 0.4 },
        outcomes: {
          bad: O('Your trap springs on you instead.', { burnout: 7, insight: 2 }),
          good: O('Under pressure, someone slips. You catch it.', { insight: 7, clues: 1 }),
          incredible: O('You corner the guilty into a public mistake.', { insight: 10, clues: 2, pathProgress: 1 }),
        },
      },
    },
  },
  {
    id: 'm_the_reconstruction', act: [2, 3], pathAffinity: [], weight: 8,
    context: 'Piecing it together', prompt: 'You have most of it now. One quiet hour to arrange what you know into a shape.',
    choices: {
      left: {
        label: 'Build the timeline', tags: ['investigate'], governingStats: { insight: 1 },
        outcomes: {
          bad: O('Two clues contradict. Back to the wall.', { insight: 3, burnout: 4 }),
          good: O('The sequence clicks. A suspect narrows to two.', { insight: 8, clues: 1 }),
          incredible: O('One suspect left standing. You are almost there.', { insight: 12, clues: 2, pathProgress: 1 }),
        },
      },
      right: {
        label: 'Steady your nerve for the reveal', tags: ['rest'], governingStats: { nerve: 1 },
        outcomes: {
          bad: O('The pressure gets to you.', { nerve: 3, burnout: -4 }),
          good: O('You center yourself. Whatever comes, you are ready.', { nerve: 8, burnout: -8 }),
          incredible: O('Ice-cold and certain. Nothing will rattle you now.', { nerve: 12, insight: 3 }),
        },
      },
    },
  },

  // ── Path-affine act-2/3 beats ──
  {
    id: 'm_sleuth_board', act: [2, 3], pathAffinity: ['sleuth'], weight: 12,
    context: 'Your wall of string', prompt: 'The board is almost complete. One connection is missing, and it is late.',
    choices: {
      left: {
        label: 'Push through the night', tags: ['investigate'], governingStats: { insight: 1 },
        outcomes: {
          bad: O('You force a link that is not there. Back to zero.', { insight: 2, burnout: 8 }),
          good: O('The missing thread appears. Two clues become one.', { insight: 8, clues: 1 }),
          incredible: O('The whole wall resolves into a single face.', { insight: 12, clues: 2, pathProgress: 1 }),
        },
      },
      right: {
        label: 'Sleep, look fresh at dawn', tags: ['rest'], governingStats: { nerve: 1 },
        outcomes: {
          bad: O('You oversleep. Someone photographs your board.', { burnout: -6, rivalry: 3, insight: 2 }),
          good: O('Morning eyes catch what tired ones missed.', { insight: 6, clues: 1, burnout: -8 }),
          incredible: O('Rested and ruthless, you close the gap in minutes.', { insight: 9, clues: 1, nerve: 4 }),
        },
      },
    },
  },
  {
    id: 'm_darling_moment', act: [2, 3], pathAffinity: ['darling'], weight: 12,
    context: 'The live audience vote', prompt: 'A surprise live segment. The nation is watching RIGHT NOW. This is your moment.',
    choices: {
      left: {
        label: 'Give them the speech', tags: ['social'], governingStats: { charm: 1 },
        outcomes: {
          bad: O('You choke on live TV. Brutal.', { charm: 2, fame: 4, burnout: 6 }),
          good: O('You land it. The vote surges your way.', { charm: 6, fame: 20 }),
          incredible: O('A speech they will replay for years. Untouchable.', { charm: 9, fame: 34, alliance: 3 }),
        },
      },
      right: {
        label: 'Let a tear do the talking', tags: ['social'], governingStats: { charm: 0.7, nerve: 0.4 },
        outcomes: {
          bad: O('Reads as fake. The internet is merciless.', { fame: 6, burnout: 5 }),
          good: O('Genuine, disarming. They adore you.', { charm: 4, fame: 24 }),
          incredible: O('One honest tear wins the whole country.', { charm: 6, fame: 38, alliance: 2 }),
        },
      },
    },
  },
  {
    id: 'm_fixer_leverage', act: [2, 3], pathAffinity: ['fixer'], weight: 12,
    context: 'The back-room deal', prompt: 'You hold something on everyone. Time to convert secrets into control — and cash.',
    choices: {
      left: {
        label: 'Broker the whole house', tags: ['deal'], governingStats: { nerve: 0.6, charm: 0.6 },
        outcomes: {
          bad: O('A secret leaks the wrong way. The house unites against you.', { rivalry: 4, burnout: 8, money: 40 }),
          good: O('Everyone pays a little to keep you happy.', { money: 140, nerve: 4 }),
          incredible: O('You become the bank, the whip, and the house.', { money: 220, nerve: 6, charm: 4, pathProgress: 1 }),
        },
      },
      right: {
        label: 'Cash out one big secret', tags: ['deal'], governingStats: { nerve: 1 },
        outcomes: {
          bad: O('They call your bluff. Nothing but enemies.', { rivalry: 3, burnout: 6 }),
          good: O('One clean payday, no fingerprints.', { money: 160, nerve: 3 }),
          incredible: O('The biggest secret in the house, sold to the highest bidder.', { money: 240, nerve: 5, fame: 6 }),
        },
      },
    },
  },

  // ── Finale cards (one per summit) ──
  {
    id: 'm_finale_sleuth', act: 3, pathAffinity: ['sleuth'], finaleCard: true, weight: 1,
    context: 'The Reveal', prompt: 'The whole house on the veranda. You stand up. You know who did it. Do you name them?',
    choices: {
      left: {
        label: 'Name the killer', tags: ['investigate'], governingStats: { insight: 1, nerve: 0.5 },
        outcomes: {
          bad: O('You point at the wrong person. The real one smiles.', { insight: 3, burnout: 10 }),
          good: O('You lay out the case. The room turns to the guilty.', { insight: 8, nerve: 4, clues: 1 }),
          incredible: O('Motive, means, timeline — you nail all three. Case closed.', { insight: 12, nerve: 6, clues: 1, pathProgress: 2 }),
        },
      },
      right: {
        label: 'Let them confess', tags: ['observe'], governingStats: { insight: 0.7, charm: 0.4 },
        outcomes: {
          bad: O('You wait too long. They lawyer up.', { insight: 2, burnout: 8 }),
          good: O('You corner them into their own words.', { insight: 7, charm: 3, clues: 1 }),
          incredible: O('You make the killer unmask themselves on live TV.', { insight: 10, charm: 5, fame: 20, pathProgress: 2 }),
        },
      },
    },
  },
  {
    id: 'm_finale_darling', act: 3, pathAffinity: ['darling'], finaleCard: true, weight: 1,
    context: 'The Live Finale', prompt: 'Two chairs, one crown, and a live vote. The host turns to you.',
    choices: {
      left: {
        label: 'Thank the audience', tags: ['social'], governingStats: { charm: 1 },
        outcomes: {
          bad: O('You ramble past the music cue. Awkward.', { charm: 3, fame: 10 }),
          good: O('Gracious and glowing. The votes pour in.', { charm: 6, fame: 30 }),
          incredible: O('You end the season as the most beloved person on television.', { charm: 9, fame: 48, alliance: 3 }),
        },
      },
      right: {
        label: 'Call your rival up for a bow', tags: ['social'], governingStats: { charm: 0.6, alliance: 0.6 },
        outcomes: {
          bad: O('It reads as a stunt. The moment deflates.', { charm: 2, fame: 12 }),
          good: O('Class act. The audience loves the grace.', { charm: 4, fame: 26, alliance: 4 }),
          incredible: O('The most gracious finale in show history. Iconic.', { charm: 6, fame: 42, alliance: 6 }),
        },
      },
    },
  },
  {
    id: 'm_finale_fixer', act: 3, pathAffinity: ['fixer'], finaleCard: true, weight: 1,
    context: 'The Last Vote', prompt: 'You built this outcome for weeks. Now you collect. One last move.',
    choices: {
      left: {
        label: 'Spring the final blindside', tags: ['deal'], governingStats: { nerve: 1 },
        outcomes: {
          bad: O('A number flips. Your machine seizes at the worst moment.', { nerve: 3, burnout: 9, money: 60 }),
          good: O('It lands exactly as designed. The house never saw it.', { nerve: 7, money: 180, pathProgress: 1 }),
          incredible: O('A flawless endgame. You owned every vote in the room.', { nerve: 10, money: 260, charm: 5, pathProgress: 2 }),
        },
      },
      right: {
        label: 'Cash every favor at once', tags: ['deal'], governingStats: { nerve: 0.6, charm: 0.6 },
        outcomes: {
          bad: O('Called on too many debts. Some default loudly.', { nerve: 2, rivalry: 3, money: 90 }),
          good: O('The favors come due and you walk away rich.', { nerve: 5, money: 220 }),
          incredible: O('Every secret, every debt, every vote — yours.', { nerve: 8, money: 300, fame: 10 }),
        },
      },
    },
  },
];
