// The Odyssey — the fire's last word (pass 6 of the player-experience
// series): the exit interviews and the finale epilogues.
//
// EXIT INTERVIEWS ride the shell's generic one-last-question overlay
// (js/ui/endings.ts renderGameOver → showExitInterview): after a telling
// ends early — banked, drowned, or beached — someone at THIS fire asks the
// bard one question, and the answer is which bard you are tonight. The
// canon hecklers ask in character (the ensemble is the same across every
// telling — hearth.ts seats them). LP asymmetry follows the villa's 8/4.
//
// EPILOGUES are the fire after a FINALE telling's last word (the epilogue
// slot on the ending screen). Gameover endings return '' — their interview
// answer (run.exitText) already owns that slot. Pure read; variants rotate
// on flavorSeed, never the play RNG.

import type { Presenter, RunState } from '../../types.js';
import { mulberry32 } from '../../engine.js';

export const ODYSSEY_EXIT_INTERVIEWS: Record<string, any> = {
  wrath: {
    context: 'The fire, after the wave',
    prompt: 'No one moves for a long moment. Then the woman by the woodpile sets her spindle down — which she has never once done — and says, not unkindly: “You put the whole fleet under, singer. My grandfather’s version got them past that headland. Why sing it your way at all?”',
    left: {
      label: '“Because the sea is in this poem.”', exit: 'unflinching', lp: 8,
      text: 'You say it plainly: a telling where the water cannot win is a lullaby, and the fire did not gather for lullabies. She looks at you a long moment, then picks the spindle back up — which is as close as she comes to applause. Tomorrow this fire will be fuller, friends. Drowned fleets are terrible news and excellent advertising.',
    },
    right: {
      label: '“Tonight it got away from me.”', exit: 'honest', lp: 4,
      text: 'The fire likes an honest tradesman. The potter’s boy nods slowly, the way his father nods at a pot that sagged in the kiln — no shame in it, so long as tomorrow’s holds. The coins in the bowl are fewer tonight, but every listener leaves already arguing about what they would have poured, and to whom, and when. That argument is the poem, working.',
    },
  },
  lotus: {
    context: 'The fire, the meadow still in the air',
    prompt: 'The quiet after this ending is a different quiet — no one wants to be first to speak over a man who chose the flowers. Finally the potter’s boy: “Did they never leave? Truly never?”',
    left: {
      label: '“Some tellings stay in the meadow.”', exit: 'kept', lp: 8,
      text: 'You let the ending stand whole, and the boy looks into the dark past the fire for a while. When he gets up to go, he walks the long way round — the road that does not pass the meadow-side, friends — and that small detour is the truest review this telling has ever received.',
    },
    right: {
      label: '“Ask me tomorrow night.”', exit: 'tomorrow', lp: 4,
      text: 'The oldest trick in the trade, and the boy knows it, and grins. “That costs a coin, doesn’t it. Coming back.” It does, friend. It does. The meadow keeps whichever man you leave in it; the fire keeps whichever listener you leave wanting.',
    },
  },
  circe: {
    context: 'The fire, a loom singing somewhere behind the dark',
    prompt: 'The woman by the woodpile has opinions about this ending and has been visibly rationing them. At last: “You left him WARM, singer. My grandfather always said he rowed home. Somebody’s version is wrong.”',
    left: {
      label: '“Warm is also an ending.”', exit: 'warm', lp: 8,
      text: 'You say it and let it sit: the cupboard, the sea-cloak, the salt still in the weave. Not every drowning is wet, friends. She frowns at her spindle a long time, and then — this is true — she pours a little of her cup into the sand, for a man who is not dead. There is no rite for that. She invents one anyway.',
    },
    right: {
      label: '“Your grandfather heard a different night.”', exit: 'variance', lp: 4,
      text: 'Every telling is true, friend — that is what a sea story is. Her grandfather sat at a fire where the wind held; tonight you sat at one where the loom won. She takes this the way she takes all doctrine: provisionally, and while spinning. Somewhere between her night and yours, the real man is still rowing.',
    },
  },
  calypso: {
    context: 'The fire, low, and the island behind every eyelid',
    prompt: 'It is the man who wants the horse who breaks this silence, and for once he is not asking about the horse. He turns his cup in his hands and says, quietly: “Would you have stayed?”',
    left: {
      label: '“Every night I don’t finish it, I stay a little.”', exit: 'confession', lp: 8,
      text: 'It is more honest than the fire expected, and more honest than you planned. The bard who sings the island too well has usually been ashore on it, friends, one way or another. Nobody speaks for a while. The man who wants the horse refills your cup without being asked — the first fee he has ever paid gladly at this fire.',
    },
    right: {
      label: '“The horse never asked me that.”', exit: 'deflect', lp: 4,
      text: 'The laugh comes as a mercy and everyone takes it, gratefully, the way sailors take a harbor. But walking home in the dark, more than one listener stops at their own gate a moment before going in — checking, quietly, that they still want to. That is the island’s arithmetic, friends. It always collects on a delay.',
    },
  },
  burnout: {
    context: 'The fire, and a man still sitting on a beach somewhere',
    prompt: 'The potter’s boy waits until the others have drifted off, then asks it the way children ask the load-bearing questions: “Does he ever stand up? The man on the beach.”',
    left: {
      label: '“Tomorrow, if you bring wood.”', exit: 'kindle', lp: 8,
      text: 'The boy takes the commission with enormous seriousness and is gone into the dark before you finish the sentence. Somewhere a woodpile is about to be lighter by an armful. That is how the man on the beach stands up, friends — never in the telling where he sat down. In the next one. It is the whole reason there is a next one.',
    },
    right: {
      label: '“Not tonight, boy.”', exit: 'low', lp: 4,
      text: 'He nods, and does not push, which is a kind of manners rarer than coin. The fire burns down to its keeping-embers. Some nights the truest thing a bard can do for the man on the beach is let him sit — and bank the fire carefully, so that whoever comes to hear him stand has a warm seat while it happens.',
    },
  },
};

// ── The finale epilogues: what the fire does after the last word. ──
const EPILOGUES: Record<string, string[]> = {
  'nostos:success': [
    'The fire holds its breath to the last word, and then, friends, no one claps — they exhale, all together, like a crew shipping oars at the end of a passage. The woman by the woodpile says, “That was how my grandfather told it,” which at this fire is the highest honor a telling can carry. The potter’s boy is asleep against the wood, still holding the coin he meant to pay with.',
    'Coins in the bowl, real ones — and the man who wants the horse, friends, this is sworn, says nothing about the horse. He stands at the edge of the firelight a moment and says, “My father rowed. A bench like those.” Then he goes. Some fees are paid in kind.',
  ],
  'kleos:success': [
    'They go out singing it — badly, in the wrong meter, with the names in the wrong order — and the bard lets them, friends, because that is what glory IS: your song in other mouths, getting the details wrong and the name right, all the way down the dark road home.',
    'The potter’s boy stays to help bank the fire, which means he wants something: the shout, one more time — just the shout. You give it to him at half voice, over the embers, and he mouths every word along. Somewhere in that boy a fire has been lit that no meadow will ever put out.',
  ],
  partial: [
    'The bowl comes back half-full, which is fair, friends — the telling came back half-full. The crowd goes home comparing what they would have done differently, and that is not failure. A telling argued about is a telling remembered.',
    'The woman by the woodpile pays in full, then stands over the bowl a moment. “The middle sagged,” she says. It did, friend. The middles always sag when the gods stop pushing. She knows it, the bard knows it, and tomorrow’s middle will be tighter for tonight’s sag.',
  ],
  failure: [
    'No one speaks first. The fire spits. Someone puts a branch on unasked — not for warmth, friends; for something to do with their hands. When a telling ends short of the harbor, the fire always burns a little longer after it. Nobody wants to be first into the dark toward their own unfinished things.',
    'The crowd files out quiet, and the last to go — a sailor, by his hands — stops at the bowl and pays double. You do not ask. Men who have seen the light on the water go out always pay double, friends, and never say why.',
  ],
};

export const odysseyEpilogue: NonNullable<Presenter['epilogue']> = (state: RunState) => {
  const key = state.ending?.key ?? null;
  const result = state.ending?.result ?? null;
  // Gameover endings (banked/drowned/beached) own their last word via the
  // exit interview's answer (run.exitText renders in the same slot).
  if (!result) return '';
  const pool = EPILOGUES[`${key}:${result}`] || EPILOGUES[result] || [];
  if (!pool.length) return '';
  const rng = mulberry32(((state.flavorSeed || 1) >>> 0) + 0xf17e);
  return pool[Math.floor(rng() * pool.length)];
};
