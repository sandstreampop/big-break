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
};
