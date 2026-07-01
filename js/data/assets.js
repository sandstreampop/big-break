// Art slot manifest (spec §11). Illustrator: drop files under assets/art/
// and set `path` on the matching slot — no other code changes needed.
// Target spec: 1080×1080 (2x retina), full-bleed, keep the top 20% low-detail
// (the context label overlays there). See assets/assets.json for the full
// per-slot art-direction notes.

export const ASSET_MANIFEST = {
  // Every slot currently ships as a placeholder:
  // e.g. ev_open_mic: { path: 'assets/art/ev_open_mic.webp' },
};
