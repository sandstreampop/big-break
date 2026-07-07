# Love Island — contestant portrait art direction

The Love Island cast is a **fixed roster of 16** (`js/packs/love-island/cast.ts`),
so their portraits are the single highest-value art in the game: generated
**once**, reused across every run and player, zero per-play cost. This folder
holds the workflow that turns that roster into a coherent portrait set.

## Why Nano Banana Pro

The hard problem with a cast is **identity consistency** — the same Marco across
six moods, the same Priya every season. Nano Banana Pro (Gemini 3 Pro Image) is
picked specifically for its identity preservation across a set. The workflow
locks identity by generating one **hero** portrait per contestant, then feeding
that image back as a **reference** when rendering each of the six mood variants —
so only the expression moves, never the person.

Model ids are env-overridable (`GEMINI_IMAGE_MODEL`, `GEMINI_DRAFT_MODEL` in
`tools/art-core.mjs`) because preview ids churn.

## The style lock

The shared treatment lives in `style.mjs` (machine-readable; the driver composes
it with each contestant's `vibe`/`shape` from `cast.ts`). The intent:

- **Semi-stylised, not photoreal.** The game's UI is flat, moody, emoji-badged.
  Photorealistic faces would clash and raise the uncanny bar. Polished-illustrated
  with a touch of caricature fits the tone and hides model tells.
- **One shoot.** Head-and-shoulders, centered, warm villa golden-hour light,
  square 1:1 (the faces render into circular chips — see `.face-portrait`).
- **The mood axis** (`buzzing / smug / fuming / wounded / scheming / torn`) is an
  expression change only, keyed to `MOODS` in `plugins/characters.ts`.

## Representation — read before generating

The cast is written as a deliberately diverse British-reality-TV ensemble (Priya,
Jamal, Dev, Chloe, Kai, …). Image models skew toward homogenising. The negative
prompt pins "do not change apparent age, ethnicity, or core features," but that is
not a substitute for **looking at the contact sheet** and rerolling anything that
flattens a contestant's intended identity. This is the one part of the workflow
that genuinely needs a human eye — everything else is automated.

## Files

| File | What |
|---|---|
| `style.mjs` | The style lock + mood/shape direction (per-game data). |
| `../../../tools/gen-li-art.mjs` | The workflow driver (LI-specific). |
| `../../../tools/art-core.mjs` | Genre-neutral engine (API, manifest, contact sheet, cost). |
| `manifest.json` | The deterministic plan (regenerated each dry run). |
| `contact-sheet.html` | The curation surface — open it in a browser. |
| `final/` | Approved portraits (source of truth, committed). |
| `drafts/` | Throwaway candidate renders (gitignored). |
| `../public/art/cast/` | Deploy copies (build → `dist/love-island/art/cast/`). |

See `README.md` in this folder for the run steps.
