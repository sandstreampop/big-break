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
  'A candid front-facing iPhone selfie of a FICTIONAL dating-show villa contestant (an invented person — no real-celebrity likeness).',
  'Shot on a phone front camera held at arm’s length, slightly above eye level, one shoulder closer to the lens, with mild wide-angle selfie distortion and an imperfect, casual crop.',
  'Authentic phone-camera imperfections: uneven HDR, overexposed highlights, slight motion blur, compressed social-media quality; natural skin texture with visible pores, tiny makeup creases and flyaway hairs.',
  'Setting: a white-stucco Mediterranean villa terrace beside a turquoise pool — sun loungers, palm shadows, colourful towels, a half-empty iced drink on a side table, blurred young contestants chatting behind, party lights beginning to glow.',
  'Warm golden-hour or late-night terrace light. It should read like a real phone photo taken between filming moments, NOT a professional photoshoot.',
].join(' ');

// The base (hero) micro-expression — the contradiction that reads as real.
export const HERO_EXPRESSION =
  'relaxed half-smile, squinting a little in bright sun, looking at the phone SCREEN rather than the lens, head slightly tilted, mouth barely open as if about to say something — confident but subtly tired from villa life, candid "just checked myself in the camera" energy';

// Villa-coded styling baseline. Gender + the contestant's own vibe (and any
// per-contestant `appearance` in cast.ts) differentiate the person.
export const STYLING =
  'fashionable summer reality-TV styling: sun-kissed glossy skin, faint tan lines, styled hair with a few flyaways, subtle gold jewellery, villa-appropriate swimwear or light linen; aspirational but believable, not model-perfect';

// Never-wants. These are the anti-drift guards: they push AWAY from the polished
// influencer/editorial default and toward candid phone realism.
export const NEGATIVE = [
  'professional studio lighting', 'DSLR or editorial portrait look', 'airbrushed or AI-smooth skin',
  'beauty-filter plastic sheen', 'perfect symmetry', 'fashion-editorial or red-carpet pose',
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
