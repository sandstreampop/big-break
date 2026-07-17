// The Odyssey — machine-readable taste data (the game's own; lives with the game).
//
// The human source is VOICE.md (this folder); this file is the canonical
// machine mirror of its cliché blocklist, tells blocklist, and caps — keep the
// two in sync. The genre-NEUTRAL checker that consumes this lives in
// tools/taste-core.mjs; the linter (tools/lint-content.mjs) wires them
// together by attaching ODYSSEY_TASTE to the pack's descriptor, so the floor
// activates the moment the pack registers.

// Two families, one list (VOICE.md § Cliché blocklist): STOCK HOMERIC
// FORMULAS — this bard invents his own epithets (VOICE law 6), so Homer's
// inherited ones are lapses, not homage — and EPIC-NARRATOR FILLER, the
// AI-ism this genre reaches for. Scanned over narration with quoted speech
// stripped (a heckler may say “against all odds”; the bard may not).
// A seed list; the verdict loop grows it as real copy surfaces offenders.
export const ODYSSEY_CLICHES = [
  // stock Homeric formulas
  'rosy-fingered dawn',
  'rosy fingered dawn',
  'wine-dark', // the formula dodges as an adjective too ("then wine-dark") — ban the stem
  'wine dark',
  'wily odysseus',
  'much-enduring',
  'much enduring',
  'swift-footed',
  'swift footed',
  'grey-eyed goddess',
  'gray-eyed goddess',
  'the face that launched',
  // epic-narrator filler
  'epic journey',
  'against all odds',
  'little did he know',
  'little did they know',
  'the stuff of legend',
  'legends are born',
  'test of courage',
  'braved the',
  'stakes were high',
  'the rest is history',
  'would never be the same',
  'in that moment',
  'a tale as old as time',
  'tapestry of',
  'testament to',
  'the very fabric',
  'nothing could prepare',
];

// SHOW-DON'T-TELL blocklist (VOICE law 1, the law with teeth): stated
// emotions and pointers at content the line should render. "The sheep came
// out of the cave unshepherded" beats any sentence containing "grief".
// Scanned over the narrating voice only — Odysseus may say “my heart sank”
// in quoted speech; the bard's narration may not summarize a feeling away.
// Grown deliberately as new tells surface.
export const ODYSSEY_TELLS = [
  'grief washed over',
  'a wave of grief',
  'felt a surge of',
  'felt a wave of',
  'filled with dread',
  'filled with sorrow',
  'filled with rage',
  'his heart sank',
  'hearts heavy',
  'overcome with',
  'something terrible',
  'the wrong thing',
  'said the right thing',
  'what happened next',
  'you feel a chill',
];

// The pack's taste config, consumed by tools/taste-core.mjs's checker.
export const ODYSSEY_TASTE = {
  cliches: ODYSSEY_CLICHES,
  tells: ODYSSEY_TELLS,
  // The long breath is licensed in results (VOICE law 3) — the odyssey rolls
  // longest of the three games (LI 240, music 600). Recalibrated in slice 4:
  // the authored sea proved 420 too tight for the result register the law
  // itself licenses; 650 keeps a landing a landing, not a chapter.
  maxOutcomeLen: 650,
  // VOICE law 5: exclamations are performance beats, earned not rationed to
  // death — the house ≤1-'!' cap is raised to 2 for this pack. Stacked bangs
  // ('!!' / '!?' / '?!') stay banned everywhere; the deep's zero-bang law is
  // craft discipline the examples model, not a machine floor.
  maxBang: 2,
  // The second screen (ADR-0014, pass 15): word travels. Post BODIES are
  // quoted mouths — the harbor's dialect, the gods' dry minutes, the fire's
  // heckle — so they carry the quoted-speech cliché/bang exemption but keep
  // the structural floor (curly apostrophes, length, uniqueness). The CHROME
  // (teasers, headlines) is narration and keeps the house rules. `minBodies`
  // guards the corpus against being gutted — the word must keep traveling.
  feeds: {
    maxBody: 300,
    minBodies: 90,
    extraTokens: [],
  },
};
