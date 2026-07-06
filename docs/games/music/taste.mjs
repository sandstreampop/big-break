// Music — machine-readable taste data (the game's own; lives with the game).
//
// The human source is VOICE.md (this folder); this file is the canonical
// machine mirror of its cliché blocklist and caps. The genre-NEUTRAL checker
// that consumes this lives in tools/taste-core.mjs; the linter
// (tools/lint-content.mjs) wires them together by attaching MUSIC_TASTE to the
// pack's descriptor. Music previously ran with only the bang + structural
// checks; this adds its cliché floor + an outcome-length ceiling.
//
// CALIBRATION NOTE: this is a SEED list, deliberately conservative. Every
// entry was verified absent from the current corpus (523 events, ~3.1k
// outcomes) so the linter stays green — a strict list would flag real copy.
// Grow it incrementally as new offenders surface, each addition re-verified
// `LINT CLEAN`. Music-industry argot that IS the good stuff (a "hook", a
// "banger", "the charts", "selling out the room") is NOT here, and quoted
// dialogue is exempt anyway (taste-core strips quoted spans before matching).

// The GENERIC music-biopic clichés the narrating voice must never fall into —
// the inspirational-poster phrases and montage-voiceover filler that read as
// AI-generated rather than as this game's dry, specific voice.
export const MUSIC_CLICHES = [
  'at the end of the day',
  'it is what it is',
  'living my best life',
  'this journey',
  'my journey',
  'incredible journey',
  'when you know you know',
  'follow your heart',
  'follow my heart',
  'good vibes only',
  '110%',
  '110 percent',
  'dream come true',
  'the sky is the limit',
  'sky is the limit',
  'give it your all',
  'music is life',
  'chase your dreams',
  'chase the dream',
  'chasing the dream',
  'never give up',
  'light up the room',
  'take it to the next level',
  'bigger and better',
  'blood sweat and tears',
  'pour your heart out',
  'heart and soul',
  'shoot for the stars',
  'reach for the stars',
  'born to do this',
  'live your truth',
  'trust the process',
];

export const MUSIC_TASTE = {
  cliches: MUSIC_CLICHES,
  // Music's voice runs longer than Love Island's (richer scene prose), so the
  // ceiling sits well above today's longest outcome (~545 chars) — a ratchet
  // against runaway text, not a target. Applied to outcome texts only.
  maxOutcomeLen: 600,
};
