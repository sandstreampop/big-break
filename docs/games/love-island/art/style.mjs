// Love Island — contestant portrait art direction (machine-readable).
// Per-game data lives with the game (CLAUDE.md). The generic art engine
// (tools/art-core.mjs) holds no genre words; the LI driver (tools/gen-li-art.mjs)
// composes these strings with cast.ts data into the prompts it sends.
//
// DIRECTION: an OFFICIAL reality-dating-show cast promo portrait — highly
// produced, studio-lit, retouched, and colour-graded for pop-TV branding. This
// is ANTI-candid: no selfie, no phone-camera look. Centered, symmetrical,
// bright, glossy; every contestant readable as an archetype in one second.
// Nano Banana rewards explicit subject/lighting/retouch/pose/colour/framing over
// vague labels — so every clause is concrete. Fictional contestants only: no
// real-person likeness, no show branding, no rendered name/border text (the game
// composites the contestant-card name/flag itself).

export const STYLE_PREAMBLE = [
  'Official reality-dating-show cast promo portrait of a FICTIONAL contestant (an invented person — no real-celebrity likeness). A highly produced, studio-lit cast headshot — NOT a candid photo and NOT an iPhone selfie.',
  'Composition: chest-up / shoulders-up crop, front-facing and centered, face filling most of the frame, slightly low or eye-level angle, long-lens portrait-lens look (no wide-angle selfie distortion), very sharp facial detail, subject cleanly separated from a controlled background; square 1:1 contestant-card framing.',
  'Lighting: bright, even, commercial beauty lighting — soft frontal key light, minimal harsh shadows, strong catchlights in the eyes, glossy highlights on cheekbones, forehead, lips and shoulders; warm "sun-kissed" skin from studio light (not natural sunlight).',
  'Retouching: heavy but reality-TV believable — smooth clean skin with reduced blemishes, brightened eyes and teeth, enhanced contrast around the features, very polished hair, makeup that reads clearly even at thumbnail size; aspirational but not fashion-editorial surreal, and NOT over-airbrushed plastic.',
  'Colour: pop-TV promo grade — extremely saturated, high contrast, warm orange/gold skin tones against a turquoise/aqua tropical villa-and-pool background (skin pushed warm, background pushed cyan). Glossy summer dating-show branding.',
  'CRUCIAL — this is a BRITISH ITV2-style villa cast, UK high-street reality-TV glam, NOT American: attractive but not Hollywood-surgically-perfect, with strong individual facial features and slight natural asymmetry (no ultra-symmetrical faces, no perfect veneers, no glass skin). Think "night out in Manchester / Essex / Liverpool / Newcastle / London" — funny, warm, sharp, approachable — rather than serene LA-model calm.',
].join(' ');

// Pose + expression — controlled and "castable", personality-tuned.
export const HERO_EXPRESSION =
  'Pose: direct eye contact with the camera, chin slightly down or neutral, shoulders squared or subtly angled — controlled and castable, no candid chaos. Expression is confident, playful and a little cheeky (a knowing half-smile or a sharp smoulder), warm and approachable rather than serene model-calm. Let their personality and vibe (above) decide smile vs. smoulder';

// Styling baseline (villa-summer glam). Gender + vibe + any cast.ts `appearance`
// differentiate the person.
export const STYLING =
  'British high-street reality-TV glam (NOT LA influencer): warm bronzed fake tan, full lashes, laminated/shaped brows, bronzer and contour, glossy lips with a visible nude lip liner, straightened hair or extensions / a slick bun with slightly darker roots, gold hoops; villa SWIMWEAR only — a bikini top for women, bare-chested for men — bare shoulders framed in a chest-up crop, tasteful and PG-13; strong individual features, groomed and camera-ready, not Hollywood-perfect';

// Never-wants — the anti-candid guards (mirrors the direction's negative prompt).
export const NEGATIVE = [
  'candid selfie', 'iPhone selfie', 'phone-camera or wide-angle distortion', 'messy or off-centre crop',
  'motion blur', 'documentary lighting', 'natural harsh shadows', 'editorial or high-fashion runway pose',
  'low saturation', 'gritty realism', 'over-airbrushed plastic skin', 'exaggerated body proportions',
  'doll-like face', 'official Love Island logos or branding', 'recognisable real contestants or celebrity likeness',
  'text', 'watermark', 'captions',
  'LA influencer', 'American pageant or Bachelor-style contestant', 'Hollywood blowout', 'perfect veneers',
  'glass skin', 'ultra-symmetrical face', 'luxury fashion editorial', 'serene model expression',
  'Kardashian-style face', 'generic Instagram model', 'California beach girl', 'professional fashion campaign',
].join(', ');

// Mood → expression, still within the controlled promo look (keys MUST match
// MOODS in js/packs/love-island/plugins/characters.ts). A mood render references
// the hero so the FACE stays the same person — only the expression shifts.
export const MOOD_EXPRESSIONS = {
  buzzing: 'a bright beaming camera-ready grin, eyes lit, radiant and buzzing',
  smug: 'a knowing closed-mouth smirk, chin slightly raised, self-satisfied and smug',
  fuming: 'a cool hard stare, jaw set, unimpressed and simmering (still composed)',
  wounded: 'softer glassy eyes, a small brave half-smile, quietly wounded',
  scheming: 'a sly narrow-eyed almost-smile, plotting and playing it close',
  torn: 'a conflicted, ambivalent look, faint furrow, caught between two feelings',
};

// Partner-SHAPE flavour (cast.ts `shape`) — an energy nudge, not a face change.
export const SHAPE_HINTS = {
  sweetheart: 'sweet girl-/boy-next-door energy — softer, warmer makeup with less contour, freckles showing through the tan, a warm approachable smile',
  gameplayer: 'sharp, fiery, competitive energy — full high glam, arched brow, sharp direct eye contact, a cheeky or knowing look',
  slowburner: 'cooler, guarded, mysterious energy — understated glam and a slow smoulder',
};

// mid-20s villa contestants.
export const genderNote = (g) => (g === 'girl' ? 'woman in her mid-20s' : 'man in his mid-20s');
