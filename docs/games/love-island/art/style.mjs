// Love Island — contestant portrait art direction (machine-readable).
// Per-game data lives with the game (CLAUDE.md). The generic art engine
// (tools/art-core.mjs) holds no genre words; the LI driver (tools/gen-li-art.mjs)
// composes these strings with cast.ts data into the prompts it sends.
//
// DIRECTION: a candid, believable reality-TV "phone-camera micro-moment" — a
// FICTIONAL dating-show contestant's front-facing iPhone selfie grabbed between
// filming moments. Per art review, the three realism levers that matter MOST are
// (1) phone-camera flaws, (2) a contradictory micro-expression, and (3) real
// villa/social background context. Without those it drifts into a generic
// influencer portrait. Nano Banana rewards explicit subject/setting/style/mood/
// composition/detail over vague aesthetic labels — so every clause below is
// concrete. Fictional contestants only: no real-person likeness, no show branding.

// The shared treatment every portrait opens with — the selfie realism + villa
// setting. This is the style lock; keep edits small and deliberate.
export const STYLE_PREAMBLE = [
  'A candid front-facing phone SELFIE that the contestant is taking of THEMSELVES — their own hand holds the phone at arm’s length and the phone’s front camera IS the camera (first-person selfie POV; NOT a photo taken by anyone else). A vertical phone photo; their forearm or hand may reach toward the lens; natural arm’s-length selfie framing. A fictional dating-show villa contestant (an invented person — no real-celebrity likeness).',
  'It should look like a real, modern 2026 Instagram selfie: clean, aspirational, natural flattering light, true-to-life — subtle authentic phone-camera character, but NO tacky Instagram filters, NO heavy beauty-app smoothing, and NOT a DSLR or editorial portrait.',
  'Healthy, well-groomed, glowing skin — they clearly take care of themselves — with natural real texture, neither plastic/airbrushed nor gritty.',
  'Setting: a white-stucco Mediterranean villa terrace beside a turquoise pool — sun loungers, palm shadows, colourful towels, a half-empty iced drink on a side table, blurred young contestants chatting behind, party lights beginning to glow.',
  'Warm golden-hour or soft late-night terrace light. A real casual selfie taken between filming moments, not a professional photoshoot.',
].join(' ');

// The base (hero) micro-expression — the contradiction that reads as real.
export const HERO_EXPRESSION =
  'a natural, unposed expression that lets their personality show (per the subject and vibe above) as they take their own selfie — relaxed, self-assured Instagram energy; eyes open and engaged with at most the faintest hint of a sun-squint; a characterful knowing look or easy half-smile rather than a posed grin';

// Villa-coded styling baseline. Gender + the contestant's own vibe (and any
// per-contestant `appearance` in cast.ts) differentiate the person.
export const STYLING =
  'fashionable summer reality-TV styling: sun-kissed glossy skin, faint tan lines, styled hair with a few flyaways, subtle gold jewellery, villa-appropriate swimwear or light linen; aspirational but believable, not model-perfect';

// Never-wants. These are the anti-drift guards: they push AWAY from the polished
// influencer/editorial default and toward candid phone realism.
export const NEGATIVE = [
  'photo taken by another person', 'third-person or photographer-shot portrait', 'professional headshot',
  'professional studio lighting', 'DSLR or editorial portrait look',
  'airbrushed or AI-smooth skin', 'beauty-filter plastic sheen', 'tacky Instagram filter', 'heavy face-tuning',
  'heavily squinting or scrunched-up face', 'fashion-editorial or red-carpet pose',
  'doll-like face', 'unrealistic body proportions', 'over-sexualised posing',
  'official Love Island logos or branding', 'recognisable real contestants or celebrity likeness',
  'text', 'watermark', 'captions', 'fake influencer backdrop',
].join(', ');

// Mood → candid micro-expression. Keys MUST match MOODS in
// js/packs/love-island/plugins/characters.ts. Phrased as fleeting selfie
// micro-moments (not posed emotions); a mood render references the hero so the
// FACE stays the same person — only the expression moves.
export const MOOD_EXPRESSIONS = {
  buzzing: 'giddy grin at the screen, eyes bright, leaning in, buzzing in-love energy',
  smug: 'knowing half-smirk, chin slightly raised, camera-aware and self-satisfied',
  fuming: 'tight jaw, flat unimpressed stare at the screen, barely holding it in',
  wounded: 'glassy eyes, small downturned mouth, looking slightly away, quietly hurt',
  scheming: 'sly sidelong glance, faint plotting smirk, playing it close',
  torn: 'conflicted, brow faintly furrowed, gaze drifting to the middle distance, caught between two feelings',
};

// Partner-SHAPE flavour (cast.ts `shape`) — an energy nudge, not a face change.
export const SHAPE_HINTS = {
  sweetheart: 'warm, open, approachable energy',
  gameplayer: 'sharp, camera-aware, self-assured energy',
  slowburner: 'cooler, more guarded, reserved energy',
};

// mid-20s villa contestants.
export const genderNote = (g) => (g === 'girl' ? 'woman in her mid-20s' : 'man in his mid-20s');
