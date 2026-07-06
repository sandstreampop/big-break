# Music — VOICE

The writing-taste layer for the music pack: what the deck's voice *is*, and the
craft floor the linter enforces. The machine mirror of the rules here lives in
[`taste.mjs`](./taste.mjs) (cliché blocklist + caps); keep the two in sync. The
genre-neutral checker is `tools/taste-core.mjs`, wired in by
`tools/lint-content.mjs`.

## The voice

Big Break's music game is **dry, specific, and a little rueful** — the comedy of
a real career, not the montage version of one. It renders the *particular*
moment (the sign-up sheet, the merch you can't shift, the sound guy who left) and
lets the player feel the cost. It never reaches for the inspirational-poster
register a biopic trailer would.

- **Show the moment, don't narrate the arc.** "The room holds four people, two
  of them the openers, and you play the set you rehearsed for two hundred." Not
  "you chase your dream against all odds."
- **Specific beats generic.** A named venue, a real number, one concrete detail.
- **Understate the win.** Triumphs land harder deadpan. Save the exclamation
  point — the house rule is ≤1 `!` per line, and none of `!!`/`!?`.
- **Dry, not mean.** The joke is with the artist, not at them.

## The prime directives (enforced)

1. **No hype punctuation.** ≤1 `!` per line; never `!!` or `!?`. (House rule,
   every pack.)
2. **No music-biopic clichés** in the narrating voice. The blocklist in
   `taste.mjs` is the machine list — the montage-voiceover filler ("chase your
   dreams", "the sky is the limit", "blood sweat and tears", "born to do this").
   Quoted dialogue is exempt (a character *may* say the corny thing); the
   narrator may not.
3. **An outcome-length ceiling.** Outcome texts cap at 600 chars — music's prose
   runs longer than Love Island's, so the ceiling sits above today's longest as a
   ratchet against runaway text, not a target.

## Growing the floor

The cliché list is a **conservative seed**, calibrated so today's corpus lints
clean (a strict list flags real copy). Add offenders as they surface, and
re-verify `node tools/lint-content.mjs` prints `LINT CLEAN` after each addition —
introduce rules incrementally, never a big red wall.
