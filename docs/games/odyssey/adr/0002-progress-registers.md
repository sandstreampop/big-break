# Progress registers: cross-run progress is allowed to be loud

Status: accepted (2026-07-13). Renegotiates the Motion Law's clause 2
("Earned ceremony") and NORTH-STAR's "Ceremony, rationed" fixed list — for
ONE new licensed case only. Source of authority:
[`REPLAY-LEGIBILITY-PLAN.md`](../REPLAY-LEGIBILITY-PLAN.md) ("Relationship to
existing law — and why the law must change first"), output of the 2026-07-13
HITL playtest + `grilling` interview on why replay pull was absent.

## Context

The playtest's primary gate failed on the museum signal: *"I didn't feel
really compelled to start a new run… there's no real pull to do it again."*
The maintainer localized the cause himself — not within-run motion, but a
missing, **invisible** persistent progression: the fragment-banked notice
(`presenter.ts`, the `notice-ody-fret` line) is one sentence inside an
overlay you are already tapping through, and there is no run-end surface at
all where the cross-run ladder is shown. The shell's loud unlock grammar
(`spawnConfetti`, `sfx.win()`, `mood: 'triumph'`, `resultExtras.celebrate`/
`cash`) already exists and Odyssey deliberately opts out of every bit of it
— correctly, per ADR-0001 and NORTH-STAR's flagship anti-goal. But taken at
face value, "ceremony, rationed" and the Motion Law's fixed list have no slot
for *this specific pull* — cross-run persistent state registering as
something worth returning for — and the reverence/no-pulse identity is the
game's moat, not a bug to route around (the staff review praised Odyssey for
**not** being "a music game skin"). The law needs a sharper edge, not
deletion — the same move ADR-0001 itself made for the Motion Law's original
"nothing pulses."

INCIDENTS #7 is why this can't just be a paragraph. Its root cause was *"the
design law lived in a doc, so the shell broke it twenty ways"* — anti-goals
that were prose, with every executable check pinning what the pack ADDED and
none pinning what the shell must NOT do. An amendment that only updates
NORTH-STAR/STYLE prose repeats that exact failure mode: it licenses a beat
but leaves the fence unenforced, and the next unrelated change could route
this exact progress beat through `spawnConfetti` with nothing to catch it.

## Decision

**Cross-run persistent progress MUST register as a distinct, loud, non-prose
beat, in the Odyssey's own idiom — fired clay, gold-fret, the amphora shelf
— never generic celebration juice.** Loud ≠ off-genre.

This is a narrow, licensed exception to Motion Law clause 2 and to
"ceremony, rationed," scoped to exactly one category of event: **state that
persists across runs** (a prophecy fragment banked, a rung reached on the
run-end ladder). It does not extend to any within-run result, however good —
an `incredible` card, a landmark cleared, a full Nostos success without the
Oar Road all stay under the existing law, silent and reverent, exactly as
ADR-0001 requires.

Two surfaces are added to the Motion Law's clause-2 fixed list (alongside
the three landmarks, every ending, and the prophecy fragment — the
fragment-banked surface below is the same fixed-list entry, sharpened from
"a notice" to "a registered beat"):

1. **The fragment banked** (mid-run result overlay) — the turning must land
   as a categorically distinct component, not a sentence inside the result
   prose: a filled slot on the amphora/gold-fret idiom, not a `<b>` tag in a
   notice string.
2. **The run-end progress ledger** — a surface that does not exist yet
   (Slice 3) showing the ladder's honest floor (`2 of 3 · one turning
   remains`), itself rendered loud, in idiom, at the exact moment the
   replay decision is made.

Both are licensed to use screen-scale ceremony (or a component-scale
equivalent that reads as categorically distinct from body prose) that
Motion Law clause 2 would otherwise ration away. Clause 1 (diegetic motion
only, `steps()`, ember-slow tempo, chrome never animates) is **not**
touched — the loud beat is still built from vase-frames and figures already
in the game's vocabulary, never eased, glowed, or bounced.

## The fence — what this does NOT license

Named explicitly, because a license this narrow is exactly the kind of
thing that erodes at the next unrelated change if the anti-goal isn't
pinned:

- **No confetti with a Greek accent** — INCIDENTS #7's flagship anti-goal
  still binds, untouched by this ADR. The progress beat MUST NOT route
  through `spawnConfetti`, `sfx.win()`, `mood: 'triumph'`, or the presenter's
  `resultExtras.celebrate` / `resultExtras.cash` channel — that is the
  siblings' win grammar, and it stays exactly as forbidden here as
  everywhere else in the pack.
- **No expansion to within-run results.** This license is scoped to
  persistent, cross-run state only. An ordinary card result — however good,
  however "incredible" — is not eligible for loud treatment merely because
  it happened; it stays under clause 2's existing ration.
- **No ambient/wallpaper drift.** The beat is scarce by construction (three
  fragments per prophecy, one run-end ledger per run) — "rationed" still
  governs *how often*, only "prose vs. loud" is renegotiated.
- **Reduced-motion stays first-class.** Under the OS pref and the in-game
  toggle, the beat collapses to a still, legible **filled slot** — the same
  information (a turning is banked; the ladder reads `2 of 3`), presented
  as a static state change rather than a`steps()` sequence. Aliveness (loud
  or otherwise) is never a tax on accessibility, per ADR-0001's own
  anti-goal list, carried whole.

## Why this must land as an executable guard, not prose

Per INCIDENTS #7: a design law that lives only in a doc gets broken twenty
ways, because every existing gate pinned what the pack *added* and none
pinned what the shell must *never* do to it. This ADR licenses a new loud
beat right next to the exact channel (`resultExtras.celebrate`/`cash`) that
INCIDENTS #7 spent a whole cleanup sprint fencing off — the highest-risk
place in the codebase for this exception to blur into "oh, it's loud now,
may as well wire the confetti path too." So the license ships bound to a
negative probe, per INCIDENTS #7's own rule ("for every 'the pack never
Xes', a gate must drive the shell into the X path and assert silence"):
[`test/odyssey-progress-law.test.mjs`](../../../../test/odyssey-progress-law.test.mjs)
asserts, on a fragment-banked result, that `resultExtras` never sets
`celebrate` or `cash` (the confetti/win-sound fence, executable); that it
DOES return a notice in the distinct progress idiom (`cls` containing
`ody-fret`); that an ordinary result with no turning returns no progress
marker at all (the ration, executable); and that
`odysseyPresenter.feel.resultJuice === false` — the pack's wholesale
opt-out from the shell's generic juice stays in force, belt-and-braces with
the motion-law probe in `test/ui/smoke.mjs`.

## Anti-goals (carried whole from ADR-0001 and NORTH-STAR — the fence, restated)

- No confetti with a Greek accent: no particles, screen shake, glow, bounce
  easing, or celebration juice from the siblings' vocabulary — this
  includes the progress beat this ADR licenses. `spawnConfetti`, `sfx.win()`,
  `mood: 'triumph'`, and `resultExtras.celebrate`/`cash` are not the
  progress beat's channel, now or ever.
- No smooth motion: the beat still moves in vase-frames (`steps()`), same
  as every other diegetic thing that moves.
- No chrome animation: the loud treatment is built from the story's own
  figures (the amphora, the gold fret, the fired-clay shelf) — it does not
  license animating boxes, rules, or buttons.
- No advisory feedback: the beat reports what happened (a turning banked, a
  rung reached), never what to choose next.
- Reduced-motion is first-class, per above.
- Continuous animation stays `steps()`-based CSS, paused when the tab is
  hidden, transform/opacity only.

## Consequences

- Slice 1 (this ADR + its guard) ships no player-facing behaviour. It only
  licenses the exception and makes it a gate; the pop itself is Slice 2
  (fragment-banked) and Slice 3 (run-end ledger).
- The verifier grades Slices 2 and 3 against this ADR's fence, exactly as
  ADR-0001's fabric slices are graded against its anti-goals — a loud
  progress beat that leans on `celebrate`/`cash`/`spawnConfetti` fails
  review even if it "looks Greek," per the flagship anti-goal.
- STYLE.md law 8 and NORTH-STAR's "Ceremony, rationed" each carry a
  pointer here; this ADR supersedes nothing else — every other clause of
  ADR-0001, STYLE.md, and NORTH-STAR stands unchanged, including Motion Law
  clause 1 (diegetic motion only) in full.
- When this ADR and any older ceremony comment disagree, this ADR and
  NORTH-STAR.md win; when they are wrong, they get amended first.
