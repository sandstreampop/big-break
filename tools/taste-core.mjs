// Taste floor — the genre-NEUTRAL checker that enforces a pack's VOICE craft
// rules. Pure (no deps, no dist import) so lint-content.mjs can enforce it and
// test/taste-core.test.mjs can unit-test it, following the tools/*-core.mjs
// extraction idiom (pack-core, sim-core, golden-corpus).
//
// This file holds only the MECHANISM. Each pack's taste DATA (its cliché
// blocklist + caps) lives with the game — e.g. docs/games/love-island/taste.mjs,
// the machine mirror of that game's VOICE.md. lint-content.mjs wires the two
// together per pack.
//
// Scope: these check AUTHORED narration / UI copy — the game's own voice.
// Quoted spans (character dialogue in “curly” or 'straight' quotes) are exempt
// from the cliché scan: a genre's argot spoken by its characters is a register,
// not a lapse (see a pack's VOICE.md, e.g. § Islander-argot).

const snippet = (t) => t.slice(0, 60);

// Remove quoted spans so the cliché scan sees only the narrating voice, not the
// argot inside Islander dialogue. Handles curly and straight quotes.
export function stripQuoted(t) {
  return t
    .replace(/[“"][^”"]*[”"]/g, ' ')
    .replace(/[‘'][^’']*[’']/g, ' ');
}

// House rule, every pack: no hype punctuation. One '!' is fine — genuine
// excitement, the "I've got a text!" ritual. Two, or an interrobang, is hype.
export function bangIssue(text) {
  if (!text) return null;
  if (/!!|!\?|\?!/.test(text)) return `hype punctuation: ${snippet(text)}`;
  if ((text.match(/!/g) || []).length > 1) return `multiple '!': ${snippet(text)}`;
  return null;
}

// Per-pack cliché blocklist, scanned over the narrating voice only (quoted
// Islander dialogue stripped first). Whole-phrase, case-insensitive.
export function clicheIssues(text, cliches) {
  if (!text || !cliches?.length) return [];
  const bare = stripQuoted(text).toLowerCase();
  return cliches
    .filter((c) => bare.includes(c.toLowerCase()))
    .map((c) => `cliché "${c}": ${snippet(text)}`);
}

// Outcome-length cap — villa outcomes land the turn and get out. (Prompts set a
// scene and may run longer; this caps outcome text only.)
export function lengthIssue(text, cap) {
  if (!text || !cap) return null;
  return text.length > cap ? `outcome too long (${text.length} > ${cap}): ${snippet(text)}` : null;
}

// Run the whole floor over one authored string. `outcome` = apply the length
// cap (outcomes only). Returns a flat list of issue strings.
export function tasteIssues(text, taste, { outcome = false } = {}) {
  if (!text) return [];
  const out = [];
  // A pack may waive the bang rule for its ritual copy via taste.bangExempt
  // (e.g. Love Island's "I've got a text!" shout, meant to be shrieked). The
  // waiver is the whole point of a ritual, so it beats the ≤1-'!' house rule.
  const bangWaived = (taste?.bangExempt || []).some((re) => re.test(text));
  if (!bangWaived) {
    const b = bangIssue(text);
    if (b) out.push(b);
  }
  if (taste?.cliches) out.push(...clicheIssues(text, taste.cliches));
  if (outcome && taste?.maxOutcomeLen) {
    const l = lengthIssue(text, taste.maxOutcomeLen);
    if (l) out.push(l);
  }
  return out;
}
