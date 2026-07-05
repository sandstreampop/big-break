# The screen contract: three tiers, one beat at a time (v3.1)

Beta feedback after v3: **too much information at once on every screen** — on
a real phone the Casa Amor set-piece stacked thirteen bands (act strip,
streak banner, stat rail, persona chip, three stage cards, banner, scene
line, three stakes, a four-line Stirling note, card art, context) and the
one load-bearing element — the card's prompt, the decision — was clipped to
a single line at the bottom. The hierarchy was inverted: meta owned the
screen, the scene rented a corner.

This ADR pins the fix as a **contract**, not a cleanup, so it survives
future content mass. Grounded in the game-UX canon: progressive disclosure
(essentials upfront, everything else on demand), contextual minimalism (a
HUD element earns permanence only if it informs the *current* decision;
otherwise it appears when it changes or matters), and the genre benchmark —
Reigns shows four resource icons and one card, full stop.

## The three tiers

Every play-loop screen allocates space in this order, and the allocation is
machine-enforced (see below):

1. **Tier 1 — the scene (takes space first).** Card art, context, the
   PROMPT, and the two choices with their risk/stat reads. **The prompt is
   never clipped and never internally scrolled** on phone viewports; the
   choice buttons are always fully on screen. Per-choice governing icons +
   the risk tell already say which stats matter *for this decision* — which
   is exactly why the always-on stat rail is redundant bombardment.
2. **Tier 2 — the ambient strip (glanceable, one read).** One compact HUD
   row (act, scoreboard counters, conditional salience chips) and one
   compact people row (the stage). Salience over permanence: the In-Your-
   Head pip **appears only once the meter matters** (≥45, warn/danger
   coloured); the hot-streak banner is a small 🔥×n chip. Everything in
   Tier 2 is tappable and leads to Tier 3.
3. **Tier 3 — the drawer (on demand, one tap, never lost).** The full
   picture the old screen force-fed: stats with bars and inspectors,
   resources with names, persona + quirk, the equipped Edit. Meta info is
   *reachable*, not *resident*.

## One beat at a time (set-pieces)

A set-piece is a **sequence, not a stack**: the framed moment (banner,
scene line, stakes, feel cues) plays first as its own full-screen beat —
tap to continue — and then the card deals with the whole screen to itself,
wearing only a slim ribbon for continuity. The deal-time Stirling note
rides the card screen, never side-by-side with the stakes. The same
principle applies to the act recap: the four story blocks are the moment;
the press/inbox flavour folds behind a tap-to-expand.

## Mechanism (generic), content (pack's)

The shell gains one feature-detected flag — `presenter.compactHud` — plus
the generic status drawer and the set-piece pre-beat. A pack that doesn't
opt in renders the original shell byte-for-byte (the music game is
untouched). No shared line names a villa concept.

## Enforcement (what makes this maintainable)

`test/ui-crowding.mjs` drives real seasons in headless Chromium at phone
viewports (390×844 and 375×667) and fails the build if, on any dealt card —
ambient or set-piece:

- the prompt is internally scrollable (clipped text), or
- a choice button sits below the viewport, or
- the ambient tiers exceed their height budget (HUD + stage ≤ ~190px).

A future card, pool, or feature that re-crowds the screen turns the gate
red. The contract is the test.

## Why this is hard to reverse

It defines the play screen's information hierarchy, the HUD's opt-in
compact mode, and a layout gate in CI. Reverting means re-accepting
unbounded vertical stacking — the exact failure the beta reported.
