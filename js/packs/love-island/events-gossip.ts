// Love Island — the gossip beats (ADR-0007): the Beach Hut confessional (the
// gather channel that echoes a distorted version back out — it cuts both
// ways) and the deploy beat where held intel gets spent. The ceremony
// cash-out lives on the climax encounter cards (events-beats).
// Voice per VOICE.md; dialogue-first.

import type { GameEvent } from '../../types.js';

export const GOSSIP_EVENTS: GameEvent[] = [
  {
    id: 'li_hut_confess_1', act: 2, tags: ['camera', 'chat'],
    art: 'li_beachhut',
    context: 'The Beach Hut · a leading question',
    prompt: '“So,” says the producer voice, light as anything. “Tell us about {rival}.” The chair creaks. The Hut knows exactly what it’s doing — it trades. You give it a headline, it gives you tomorrow’s.',
    choices: {
      left: {
        label: 'Name names',
        tags: ['drama', 'camera'],
        governingStats: { charisma: 0.6, savvy: 0.4 },
        outcomes: {
          bad: { text: 'You go loud, and the edit goes louder. What comes back out has your voice and somebody else’s sentences. {rival} hears the remix by dinner.', effects: { charisma: 2, followers: 3, rivalOpinion: -4, rivalMood: 'fuming', burnout: 3, gainIntel: { about: 'rival', label: 'they’re rattled about the vote' } } },
          good: { text: 'You give the Hut a tidy little headline and the Hut, fair’s fair, gives one back: {rival} has been asking about your couple. Noted. Filed.', effects: { charisma: 5, followers: 5, rivalOpinion: -2, gainIntel: { about: 'rival', label: 'they’ve been asking about your couple' } } },
          incredible: { text: 'Your confessional is so quotable production practically curtsies — and lets slip more than they meant to about {rival}’s week. The Hut trades. You traded up.', effects: { charisma: 8, followers: 8, public: 3, gainIntel: { about: 'rival', label: 'their game plan for the week' } } },
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
    prompt: '“Final Week,” says the voice. “Is it real?” Straight for the ribs. And then, conversationally: “Because {partner} said something interesting in here yesterday.” The chair holds its breath. So, annoyingly, do you.',
    choices: {
      left: {
        label: 'Ask what they said',
        tags: ['drama', 'chat'],
        governingStats: { savvy: 0.5, loyalty: 0.5 },
        outcomes: {
          bad: { text: 'The Hut plays you four seconds — a laugh, half a sentence, your name. Out of context it could mean anything. In your head, all night, it means everything.', effects: { savvy: 2, burnout: 5, gainIntel: { about: 'partner', label: 'the clip of the half-sentence' } } },
          good: { text: 'The voice gives you the shape of it: {partner}, asked about the outside, went quiet first. Useful. Heavy, but useful.', effects: { savvy: 5, burnout: 2, gainIntel: { about: 'partner', label: 'they went quiet about the outside' } } },
          incredible: { text: 'You get the whole quote, and it’s… lovely, actually. They said the thing you’d hoped. You walk out lighter, and armed.', effects: { savvy: 6, bond: 3, burnout: -2, gainIntel: { about: 'partner', label: 'what they said about you in here' } } },
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
  {
    id: 'li_kitchen_drop', act: [2, 3], tags: ['strategy', 'drama'],
    art: 'li_kitchen',
    requires: { intelMin: 1 },
    context: 'The kitchen · low voices · what you know, itching',
    prompt: 'What you know has been doing laps of your head all day. {partner} is on the daybed; {rival} is making a smoothie with meaningful eye contact. Information is only power while it’s moving. Or is it while it’s still? One of those.',
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
];
