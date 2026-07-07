// Love Island — contestant portrait art direction (machine-readable).
// Per-game data lives with the game (CLAUDE.md). The generic art engine
// (tools/art-core.mjs) holds no genre words; the LI driver (tools/gen-li-art.mjs)
// composes these strings with cast.ts data into the prompts it sends.
//
// The whole set is generated once against a FIXED roster, so the goal is a
// coherent "villa cast photo" look that survives 16 people × 6 moods without
// drifting in medium, lighting, or framing. Keep edits here small and
// deliberate — this is the style lock.

// The shared treatment every portrait opens with. Framing + medium + lighting
// are pinned so the whole cast reads as one shoot. Square: the faces render
// into circular chips (.stage-face), so a centered head-and-shoulders crop
// survives the mask.
export const STYLE_PREAMBLE = [
  'Head-and-shoulders character portrait for a stylised dating-reality-show video game.',
  'Warm golden-hour villa light, soft rim light, shallow depth of field, clean out-of-focus tropical background.',
  'Semi-stylised illustrated look — polished, glossy, confident, a touch of caricature; NOT photorealistic, NOT anime.',
  'Centered, facing camera, shoulders square, square 1:1 composition with headroom for a circular crop.',
  'Consistent single-shoot lighting and colour grade across the whole cast.',
].join(' ');

// Never-wants. Keeps the set on-model and dodges the failure modes that make a
// generated cast look broken or off-brand.
export const NEGATIVE = [
  'no text, no watermark, no logos, no captions',
  'no extra limbs or distorted hands',
  'no photorealism, no uncanny realism',
  'no nudity, no swimwear-only framing (head-and-shoulders only)',
  'no changing the person’s apparent age, ethnicity, or core features between shots',
].join('; ');

// Mood → expression/posture direction. Keys MUST match MOODS in
// js/packs/love-island/plugins/characters.ts (buzzing/smug/fuming/wounded/
// scheming/torn). A mood render references the hero portrait so the FACE stays
// the same person — only the expression moves.
export const MOOD_EXPRESSIONS = {
  buzzing: 'beaming, eyes bright, giddy in-love energy, slight lean toward camera',
  smug: 'one eyebrow up, knowing half-smile, chin slightly raised, self-satisfied',
  fuming: 'jaw set, glare, brows down, arms-crossed tension, barely holding it in',
  wounded: 'glassy eyes, downturned mouth, vulnerable, looking slightly away, hurt',
  scheming: 'sidelong glance, faint sly smirk, plotting, playing it close',
  torn: 'conflicted, brow furrowed, gaze middle-distance, caught between two feelings',
};

// Partner-SHAPE flavour (cast.ts `shape`). A light styling nudge, not a face
// change — sweethearts read soft, game-players read sharp, slow-burners read
// guarded.
export const SHAPE_HINTS = {
  sweetheart: 'open, warm, approachable styling',
  gameplayer: 'sharp, camera-aware, polished styling',
  slowburner: 'reserved, cool, guarded styling',
};

// The two-line brief the driver wraps a contestant's own `vibe` in. The vibe
// strings in cast.ts ("villain with a skincare routine", "abs with a boat
// licence") are already characterful prompt seeds — we lean on them.
export const genderNote = (g) => (g === 'girl' ? 'young woman' : 'young man');
