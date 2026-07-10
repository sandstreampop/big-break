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
// A pack whose register EARNS more (the Odyssey's bard performing the frame —
// its VOICE.md law 5) may raise the per-string cap via taste.maxBang; stacked
// bangs and interrobangs stay banned at every cap.
export function bangIssue(text, cap = 1) {
  if (!text) return null;
  if (/!!|!\?|\?!/.test(text)) return `hype punctuation: ${snippet(text)}`;
  const n = (text.match(/!/g) || []).length;
  if (n > cap) return cap === 1 ? `multiple '!': ${snippet(text)}` : `more than ${cap} '!': ${snippet(text)}`;
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

// Show-don't-tell blocklist: meta-summary phrases that GESTURE at a moment
// instead of rendering it ("you flip it", "the exact right thing", "the thing
// they fear", "learning the manual"). These are the AI-ism the villa keeps
// sliding into — the narrator pointing at content it should show. Scanned over
// the narrating voice only (an Islander MAY refer to "the thing you said" in
// dialogue; the narrator may not summarise the beat away). Whole-phrase, ci.
export function tellIssues(text, tells) {
  if (!text || !tells?.length) return [];
  const bare = stripQuoted(text).toLowerCase();
  return tells
    .filter((t) => bare.includes(t.toLowerCase()))
    .map((t) => `show-don't-tell "${t}" — render the moment, don't point at it: ${snippet(text)}`);
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

// Feed corpus floor (ADR-0014 — the second screen). A pack's social-feed
// content isn't in pack.events, so the deck checker never sees it; this runs
// the right floor over it. Post BODIES are quoted mouths (the public speaking),
// so — like Islander dialogue — they are cliché- and bang-EXEMPT (loud
// platforms shout on purpose), but keep the structural floor: curly
// apostrophes, no double spaces, a length cap, valid {tokens}, and NO
// duplicates. CHROME (teaser lines) is the Narrator's voice and keeps the house
// rules (≤1 '!', no blocklist cliché). Genre-neutral mechanism; the pack
// supplies the corpus and the taste.feeds config.
export function feedIssues({ bodies = [], chrome = [], taste = {}, knownTokens = [] } = {}) {
  const out = [];
  const cfg = taste.feeds || {};
  const cap = cfg.maxBody || 280;
  const tokens = new Set([...knownTokens, ...(cfg.extraTokens || [])]);
  const seen = new Set();
  for (const b of bodies) {
    if (!b) continue;
    if (/\w'\w/.test(b)) out.push(`feed body straight apostrophe: ${snippet(b)}`);
    if (b.includes('  ')) out.push(`feed body double space: ${snippet(b)}`);
    if (b.length > cap) out.push(`feed body too long (${b.length} > ${cap}): ${snippet(b)}`);
    for (const m of b.matchAll(/\{(\w+)\}/g)) {
      if (!tokens.has(m[1])) out.push(`feed body unknown token {${m[1]}}: ${snippet(b)}`);
    }
    const key = b.toLowerCase();
    if (seen.has(key)) out.push(`duplicate feed body: ${snippet(b)}`);
    seen.add(key);
  }
  for (const c of chrome) {
    if (!c) continue;
    const bang = bangIssue(c);
    if (bang) out.push(`feed teaser ${bang}`);
    out.push(...clicheIssues(c, taste.cliches).map((i) => `feed teaser ${i}`));
    out.push(...tellIssues(c, taste.tells).map((i) => `feed teaser ${i}`));
    if (/\w'\w/.test(c)) out.push(`feed teaser straight apostrophe: ${snippet(c)}`);
  }
  if (cfg.minBodies && bodies.length < cfg.minBodies) {
    out.push(`feed corpus thin: ${bodies.length} bodies (< ${cfg.minBodies}) — the nation went quiet`);
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
    const b = bangIssue(text, taste?.maxBang || 1);
    if (b) out.push(b);
  }
  if (taste?.cliches) out.push(...clicheIssues(text, taste.cliches));
  if (outcome && taste?.maxOutcomeLen) {
    const l = lengthIssue(text, taste.maxOutcomeLen);
    if (l) out.push(l);
  }
  return out;
}
