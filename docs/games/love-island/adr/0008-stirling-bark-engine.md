# Stirling: the voiceover as a bark engine (v2)

The playtest asked for the Scottish-comedian voiceover (our Iain-Stirling analog)
to be "constantly part of the experience — chiming in on his own popover, one layer
above the event." This ADR makes him a **pack-owned commentary layer** whose
content is selected the way Hades selects barks. He solves two playtest complaints
at once — the flat "dry omniscient narrator" voice, and the "outcomes felt
unearned" legibility gap.

## Rendering

A **popover / dialogue box one layer above** the current event or result — a
distinct channel from the card copy, building on the presenter's existing
`note` / notice mechanism (`presenter.ts`). This may need a **small, genre-neutral
presenter hook** for an overlay layer, feature-detected by the engine; the hook
stays generic (an "overlay note" channel), while all of Stirling's content and
selection logic stays in the pack.

## Content selection: the Hades pattern

Stirling is a **condition-filtered, priority-weighted line bucket with
no-repeat-until-exhausted selection** — the architecture (not the line count)
behind Hades' 21k-line freshness (see [`../V2-RESEARCH.md`](../V2-RESEARCH.md)).
This is the single most important cross-run finding: **no-repeat selection over a
condition-filtered pool** is what keeps a commentator alive across the
5-runs-in-a-row cadence that exposed the current repetition.

- **Guaranteed at key beats** — recoupling forecast, verdict, bombshell arrival,
  encounter climax — drawn from **authored, high-priority** lines.
- **Opportunistic reactions** on notable results (incredible / bad, streaks, big
  gossip) drawn from **templated pools keyed to tier and tags**.
- **Rate-limited** so he lands rather than nags; the mostly-ambient deck (ADR-0005)
  is where his reactions breathe.

## Two jobs: comedy *and* diegetic legibility

Stirling is both the constant comic voice **and** how the game tells you where you
stand. He teases the danger before a recoupling ("bond's looking a bit shaky
there, babes") and **explains the verdict** after. This is deliberate: it keeps
legibility **qualitative and in-character** rather than a numeric HUD readout — the
line the research draws between over-telegraphing (which subverts agency) and
leaving players blind.

**Truthfulness constraint:** because he forecasts the real `Bond OR Public` check
(ADR-0002), his qualitative read **must reflect actual state**. A forecast that
lies breaks the legibility fix. His comedy is in the *delivery*, never in
misrepresenting the odds.

## Stance toward the player

A **light stance** — rooting for you / clocking your game / delighting in your mess
— derived from recent play, selects tone-tagged line variants (the Stanley-Parable
model of a narrator whose relationship to the player shifts). It is flavour
colouring, not a mechanic.

## Golden safety

Bark selection is **seeded** (uses the run RNG) and the **no-repeat state lives on
run-state**, so seeded behaviour stays pinned and the goldens remain
deterministic. Stirling's lines are part of a trace, not free-floating.

## Why this is hard to reverse

It defines a new **presentation channel**, a **line-pool authoring format**, and
touches **golden behaviour** (seeded selection with per-run no-repeat state).
Pinned deliberately.
