# Decision brief: short roguelike, or a longer narrative season?

**Status: open — awaiting Viktor's call.** This is a *decision brief*, not a
landed decision; once chosen it graduates to an ADR (next free number: 0010).
Companion to [`V4-DESIGN.md` → Pillar 0](./V4-DESIGN.md#pillar-0--length-is-the-substrate-the-season-needs-room-to-breathe).

## The fork

Hillevi's feedback — *each run is too short; make it a richer, longer
experience* — collides with the game's current identity. Today a season is
**~28 villa moments** (`actLengths` 8 / 12 / 8), which is a tight, replayable
**roguelike** run. Extending it is not a knob turn; it's a positioning choice
about *what kind of game this is*. Everything downstream (balance, goldens,
authoring load, store framing) follows from it. So decide this first.

## Option A — Stay a short replayable roguelike (extend modestly)

Keep runs short-ish; add richness through *variety and depth per beat*, not
duration. Maybe nudge `actLengths` up a little, but the pitch stays "a 15-minute
season you replay for different Summits and different casts."

- **Keeps:** replayability (the three-Summit divergence *rewards* replaying);
  tight pacing with no sag; low commitment; the current balance and goldens
  mostly survive; modest authoring load.
- **Costs:** does **not** satisfy Hillevi. A garden connection, the living web,
  and the full season spine stay cramped — the very thinness she flagged. The
  "it doesn't feel like a *season*" problem remains.

## Option B — Become a longer narrative season (commit to duration)

Reframe the game as *one season you live through*, closer to the show's eight
weeks. Length carries the emotional arc; replay value shifts from "many quick
runs" to "a big, varied journey you might replay occasionally."

- **Keeps:** this is what *unlocks* the v4 pillars — slow-burn connection, the
  living web with room to ripple, a season spine with a real middle. Directly
  answers the feedback.
- **Costs:** re-tunes everything numeric (burnout/`actWear`, `jitterByAct`, win
  gates, seeded-arc slots) and **re-baselines the golden masters** deliberately;
  the biggest **authoring** lift (much more content, and the outward-pointing
  card types from [`V4-LIVING-VILLA.md`](./V4-LIVING-VILLA.md)); real **pacing /
  anti-repetition** risk that has to be engineered against (novelty weighting +
  `seenCards` already exist, but lean harder now).

## Option C — Hybrid (recommended): a longer season built from short "weeks"

Keep the *tight-loop feel* Option A is good at, but stack the loops into a longer
whole. Introduce a light **week/day rhythm**: each "week" is a compact run of
beats (quiet daily texture — morning coffee, fire-pit debriefs, "where's your
head at?" — punctuated by one tentpole: a bombshell, a challenge, a recoupling).
A season is several weeks; the arc lives across them.

- **Why recommended:** it dissolves the fork instead of picking a loser. You get
  Hillevi's *duration and richness* (Option B's win) while preserving *tight,
  legible, well-paced units* (Option A's strength) — length reads as "a season
  with quiet days and big nights," not "a longer grind." It's also the most
  **on-theme**: it mirrors how the show actually feels week to week.
- **Costs:** still a real balance re-tune + golden re-baseline and a meaningful
  authoring lift — but the week is a natural **content unit** to author and
  tune against, which makes both tractable and incremental.

## What each option implies for the build (for the eventual ADR)

- **Run-length levers:** A = small `actLengths` bump; B = large bump / more acts;
  C = a new week/day structure wrapping the existing act/card machinery.
- **Balance:** B and C re-tune `actWear`, `jitterByAct`, win gates, seed slots
  and re-baseline goldens; A stays close to current.
- **Authoring:** A ≈ today; C = per-week content packs (daily texture + one
  tentpole); B = the largest, least-structured lift.
- **Pacing guards:** B and C must scale novelty weighting and daily-beat variety;
  C's week boundary is a natural place to vary tone and reset attention.

## Theory check (why C is the researched pick)

Pressure-tested in [`V4-THEORY-REVIEW.md`](./V4-THEORY-REVIEW.md):

- **Peak-end rule (Kahneman)** is the sharpest warning against a naïve Option B:
  memory is dominated by the emotional *peak* and the *ending*, and *duration is
  nearly ignored*. A longer run with a flat middle is remembered as **worse**
  than today's short one. Option C's weekly rhythm is a built-in **peak cadence**
  (each week ends on a tentpole), which is exactly what turns length into memory.
- **Slay the Spire** is the roguelike proof-point: it paces a long climb as a
  *rhythm* (encounters → rest → elite → boss) with full-information decisions and
  "doesn't waste a single mechanic." Option C is that rhythm in our fiction
  (quiet days → one weekly tentpole).
- **FTUE / retention:** ~80% of retention is set in the first five minutes, so a
  *longer* run makes a strong opening **more** critical, not less — a hard
  constraint on any option that adds length.

None of this *decides* the fork — that's Viktor's call — but it says: if we go
long, go long as a **rhythm of peaks**, not as raw runtime.

## The ask

Pick A / B / C (or reshape). My recommendation is **C** — it's the only one that
satisfies the feedback *without* throwing away what made the roguelike good. On
your call I'll turn the choice into ADR-0010 and a build order, and only then
start on engine-adjacent code and the golden re-baseline.

---

*Provenance: follows Hillevi's "runs are too short" feedback and the Pillar 0
write-up, 2026-07-05. Decision belongs to Viktor.*
