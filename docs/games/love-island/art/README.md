# Contestant portraits — runbook

The workflow is built so your entire job is: **set a key, run one command, glance
at a contact sheet.** Prompt writing, identity locking, retries, cost estimates,
and wiring the images into the game are all automated.

## The one-time human steps

1. **Get a key** — https://aistudio.google.com/apikey, then:
   ```bash
   export GEMINI_API_KEY=...
   ```

2. **(Free) See the plan.** No key, no cost — writes the prompts + a contact sheet:
   ```bash
   npm run art:li                 # full cast plan (~$15 to render)
   npm run art:li -- --pilot      # just Marco + Priya (~$1.88 to render)
   ```
   Open `docs/games/love-island/art/contact-sheet.html` to read every prompt.

3. **Render the pilot** (recommended first — a couple of dollars):
   ```bash
   npm run art:li -- --generate --pilot
   ```
   This renders 2 contestants + their 6 moods on Nano Banana Pro, locks identity
   via reference images, **auto-wires** them into the game, and rewrites the
   contact sheet with the real images.

4. **Look.** Open `contact-sheet.html`. Happy? Build and play:
   ```bash
   npm run build   # then open the Love Island game — portraits replace the emoji faces
   ```
   Unhappy with one? Reroll just that slot:
   ```bash
   npm run art:li -- --reroll=marco_fuming
   npm run art:li -- --wire        # re-wire, then npm run build
   ```

5. **Go wide** once the look is right:
   ```bash
   npm run art:li -- --generate    # all 16 contestants × 7 (~$15)
   ```

## Batch mode (`--batch`) — cheaper and crash-proof

Add `--batch` to any `--generate` run to use Google's Batch API instead of
rendering inline:

```bash
npm run art:li -- --generate --batch            # full cast, ~$7.50 (50% off)
npm run art:li -- --generate --batch --pilot     # pilot, under a dollar
```

Why it's the default in the GitHub Action:
- **50% cheaper** — batch pricing is half the synchronous rate.
- **Crash-proof** — results are retained server-side (~24h). If your side dies
  after an image is generated+billed, it is **not lost**: the batch handle is
  saved to `batch-state.json`, and re-running resumes the *same* batch (no
  re-submission, no double charge).
- Identity lock preserved: heroes render as one batch, then moods render as a
  second batch referencing the finished hero portraits.

Trade-off: it's asynchronous — the tool submits, then polls until Google
finishes (usually minutes; up to 24h). Fine for a one-time cast render.

## Notes

- **Nothing is destructive.** With no images generated, every face falls back to
  its emoji glyph exactly as before — the runtime, goldens, and UI tests are
  unaffected until you wire real portraits.
- **Flags:** `--batch` (async, 50% off, crash-proof), `--only=marco,priya,amber`
  (specific cast), `--candidates=3` (sync only: N hero variants to `drafts/`),
  `--tier=pro4k` (4K, ~$0.24/img — overkill for the small face chips),
  `--tier=draft` (cheap full pass on plain Nano Banana), `--no-wire` (render
  without touching the game).
- **Cost** printed before every run. Full cast ≈ **$15** sync / **$7.50** batch;
  pilot ≈ **$1.88** sync / **~$0.94** batch. See `STYLE.md` for art direction and
  the representation guidance to keep an eye on while curating.
