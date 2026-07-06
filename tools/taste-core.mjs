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

// Dialogue-first floor (a pack's v2-style register shift): does this string
// contain spoken dialogue (curly double quotes — the house standard for
// speech)? Consumed two ways by lint-content: per-card (tags a pack lists in
// taste.dialogue.requireTags MUST speak in their prompt) and corpus-wide
// (minimum share of prompts/outcomes that speak — a ratchet against sliding
// back to wall-to-wall narrator).
export function hasDialogue(text) {
  return /[“”]/.test(text || '');
}

// The inverse of stripQuoted: the concatenation of a string's quoted spans —
// i.e. only what CHARACTERS say. The positive-presence argot check scans this,
// because a genre's dialect belongs in its characters' mouths, never the
// narrator's (see a pack's VOICE.md § Islander-argot). Mirrors stripQuoted's
// curly/straight handling so the two stay consistent.
export function quotedSpans(text) {
  if (!text) return '';
  const dbl = text.match(/[“"][^”"]*[”"]/g) || [];
  const sgl = text.match(/[‘'][^’']*[’']/g) || [];
  return [...dbl, ...sgl].join(' ');
}

// Positive-presence floor — the counterpart to the cliché blocklist. A genre's
// REAL argot MUST actually appear in its characters' dialogue, or the villa has
// quietly forgotten how to talk (the exact regression this guards: clever
// narrator wit colonising every mouth while the authentic dialect vanishes).
// `required` is [{ label, patterns:[RegExp|string], min }]; counts matches
// across the supplied spoken text (quotedSpans of the whole corpus) and flags
// any requirement under its floor. Genre-neutral mechanism; the data lives with
// the game (its taste.requiredArgot, mirroring VOICE.md).
export function argotPresenceIssues(spokenText, required) {
  if (!required?.length) return [];
  const hay = spokenText || '';
  const out = [];
  for (const item of required) {
    let n = 0;
    for (const p of item.patterns || []) {
      if (typeof p === 'string') {
        n += hay.toLowerCase().split(p.toLowerCase()).length - 1;
      } else {
        const flags = p.flags.includes('g') ? p.flags : p.flags + 'g';
        n += (hay.match(new RegExp(p.source, flags)) || []).length;
      }
    }
    const min = item.min || 1;
    if (n < min) out.push(`argot under floor: "${item.label}" spoken ${n}× (needs ${min}) — the villa's dialect must live in its characters' mouths`);
  }
  return out;
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
