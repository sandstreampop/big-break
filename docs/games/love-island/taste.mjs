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
  // v4 S3 growth: the internet-speak the factional/couple-web writing kept
  // reaching for — meme-adjacent filler that dates faster than the villa.
  // (In quoted Islander mouths it would be exempt anyway; the Narrator and
  // villa-copy don't get it.)
  'understood the assignment',
  'living rent free',
  'rent free',
  'said no one ever',
];

// SHOW-DON'T-TELL blocklist: meta-summary phrases that point at a moment
// instead of rendering it — the villa's recurring AI-ism (a screenshot of
// "the thing they fear about the outside. Filed." and "you flip it" is what
// prompted this). The rule, and the through-line of all villa writing: SHOW
// the line said, the gesture made, the actual fear NAMED — never gesture at
// content the outcome should render. Scanned over the NARRATING voice only
// (an Islander may say "that thing you said" in dialogue; the narrator may not
// summarise the beat away). Grown deliberately as new tells surface.
export const LOVE_ISLAND_TELLS = [
  'you flip it',
  'the exact right thing',
  'the thing they fear',
  'the thing you fear',
  'learning the manual',
  'the unbroadcastable thing',
  'said something interesting',
  'the answer nobody',
];

// The pack's taste config, consumed by tools/taste-core.mjs's checker.
export const LOVE_ISLAND_TASTE = {
  cliches: LOVE_ISLAND_CLICHES,
  tells: LOVE_ISLAND_TELLS,
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
  // POSITIVE-PRESENCE floor (the counterpart to the cliché blocklist above).
  // Hillevi's load-bearing note (docs V4-DESIGN §"slang that must be present"
  // + §"the idiom of the head"): the villa's REAL dialect must actually live in
  // its characters' mouths, or the deck slides back into clever-narrator wit
  // with no authentic Islander voice. Scanned over QUOTED spans only (character
  // dialogue) — the narrator/Stirling/Host never get this argot; the Islanders
  // must. The head idiom is the one Hillevi flagged as central and "THE Casa
  // Amor question", so it carries the highest floor. Regexes match the pack's
  // curly apostrophe (’). Grown deliberately, like the blocklist.
  requiredArgot: [
    { label: 'the “head” idiom (where’s your head at / head turned)', min: 4, patterns: [
      /where[’']s your head/i, /head[’']s (been |proper been |not been |already been )?turn/i,
      /turn my head/i, /turned my head/i, /head[’']s gone/i, /head could be turned/i,
      /my head[’']s (all over|been|not)/i, /head might (get )?turn/i, /it[’']d take a lot to turn/i ] },
    { label: 'pull [someone] for a chat', min: 2, patterns: [
      /pull (you|him|her|them|me|us)?\s*(in |aside )?for a (little |quick |proper )?chat/i,
      /pull (you|him|her|them|me) aside/i, /pull you for a/i ] },
    { label: 'cracking on / crack on', min: 2, patterns: [ /crack(ing)? on/i ] },
    { label: 'closed off / keeping open (coupling state)', min: 2, patterns: [
      /closed off/i, /close myself off/i, /keeping (myself |my options )?open/i, /keep my options open/i ] },
    { label: 'doing bits', min: 1, patterns: [ /doing bits/i ] },
    { label: 'on paper', min: 3, patterns: [ /on paper/i ] },
    { label: 'the ick (in Islander mouths)', min: 3, patterns: [ /\bick\b/i ] },
    { label: 'grafting / graft on someone', min: 2, patterns: [ /graft(ing)?( on| for)?/i ] },
    { label: 'all my eggs in one basket', min: 1, patterns: [ /eggs in one basket/i ] },
    { label: 'mugged off / mug / muggy', min: 2, patterns: [ /mugged off/i, /mugged me off/i, /\bmug\b/i, /\bmuggy\b/i ] },
    { label: 'over-affirmation (100% / a hundred percent)', min: 3, patterns: [ /100\s?%/i, /hundred percent/i, /1000\s?%/i ] },
    { label: 'I’m not being funny', min: 2, patterns: [ /not being funny/i ] },
    { label: 'my type (on paper)', min: 2, patterns: [ /my type/i ] },
    { label: 'loyal (in Islander mouths)', min: 4, patterns: [ /loyal/i ] },
  ],
  // The second screen (ADR-0014 / VOICE.md v4-S4 addendum). Feed POST BODIES
  // are quoted mouths — the public speaking — so they carry the same cliché-
  // and bang-exemption as Islander dialogue (loud platforms shout on purpose).
  // They still obey the structural floor (curly apostrophes, no double spaces,
  // a generous length cap) and must be unique — no copy-pasted posts. The feed
  // CHROME (the Narrator's teaser lines) is narration and keeps the house
  // rules (≤1 '!', no blocklist cliché). `minBodies` guards against the corpus
  // being gutted — the nation must stay loud.
  feeds: {
    maxBody: 300,
    minBodies: 120,
    // Feed-internal token the browser fills with the player's CHOSEN name (or a
    // per-channel nickname when a run is nameless); legal only inside feed copy.
    extraTokens: ['me'],
  },
};
