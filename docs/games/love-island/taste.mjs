// Love Island — machine-readable taste data (the game's own; lives with the game).
//
// The human source is VOICE.md (this folder); this file is the canonical
// machine mirror of its cliché blocklist and caps — keep the two in sync. The
// genre-NEUTRAL checker that consumes this lives in tools/taste-core.mjs; the
// linter (tools/lint-content.mjs) wires them together by attaching LOVE_ISLAND_TASTE
// to the pack's descriptor, so the floor activates the moment the pack registers (B1).
//
// The Idea-Grab minigame's IG_CLICHES array is the precedent for taste-as-data.

// The GENERIC reality-romance phrases the Narrator/villa-copy must never fall
// into. Deliberately NOT the villa's own argot ("my head's been turned",
// "grafting", "the ick", "loyal", "all my eggs in one basket") — that is the
// good stuff, spoken by Islanders and exempt via the quote-strip in taste-core.
// A seed list; Phase C grows it as real copy surfaces new offenders.
export const LOVE_ISLAND_CLICHES = [
  'at the end of the day',
  'it is what it is',
  'living my best life',
  'here to make friends',
  'not here to make friends',
  'this journey',
  'my journey',
  'incredible journey',
  'when you know you know',
  'meant to be',
  'perfect match',
  'head over heels',
  'love at first sight',
  'sparks flying',
  'sparks fly',
  'whirlwind romance',
  'follow your heart',
  'follow my heart',
  '110%',
  '110 percent',
  'ride or die',
  'good vibes only',
  'live laugh love',
];

// The pack's taste config, consumed by tools/taste-core.mjs's checker.
export const LOVE_ISLAND_TASTE = {
  cliches: LOVE_ISLAND_CLICHES,
  maxOutcomeLen: 240,
  // The one place exuberance is encouraged: the receiving-a-text shout.
  // Islanders scream it — all caps and stacked "!" are on-brand HERE (and only
  // here: the body of the text stays flat). Copy matching this is waived from
  // the ≤1-"!" house rule. See VOICE.md § The prime directive (rule 5).
  bangExempt: [/got a text/i],
  // The v2 dialogue-first floor (VOICE.md v2 addendum): encounter beats are
  // conversations with a person, so their prompts MUST speak; corpus-wide, at
  // least these shares of prompts/outcomes carry actual dialogue. Measured at
  // the v2 conversion: prompts 66%, outcomes 40% — the floors sit just under,
  // as a ratchet against sliding back to wall-to-wall narrator, not a target.
  dialogue: {
    requireTags: ['encounter'],
    promptMinShare: 0.6,
    outcomeMinShare: 0.35,
  },
};
