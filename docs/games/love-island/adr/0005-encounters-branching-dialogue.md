# Encounters: branching dialogue chains as the villa's core verb (v2)

Love Island v2's answer to the playtest complaint that "events don't feel
impactful and the partner is an abstract entity." An **encounter** is a short,
character-scoped scene built as a *branching* chain of ordinary cards. It is
**pack-owned** and rides the engine's existing chain mechanism — adding it edits
new content/plugin/presenter files only, no engine line (the CLAUDE.md spine).

## What an encounter is

A **3–4 beat scene** with one named character (Partner, the season-long Rival, or
the active bombshell), shaped setup → complication → **pivotal choice** → moment /
verdict. Each beat is a normal left/right card; the choice you make (and the tier
it rolls) selects **which next beat you get**, so the path branches. The encounter
ends on a **moment** that moves that character's state (ADR-0006) — the thing that
makes the scene feel consequential rather than ambient.

## How it rides the existing engine, unchanged

The engine already sequences cards: an outcome's `effects.chainEventId` sets
`state.pendingChainId`, and the next `advance()` serves that card
(`engine.ts` — `resolveSwipe` sets it, the draw path consumes it). Two facts make
branching expressible **with zero engine change**:

- `chainEventId` lives on each `outcome`, so it already differs **per side and per
  tier** — a card can route to different next beats depending on the choice and how
  it landed.
- **Conditional** branching (route on character state, not just this choice) is
  done in the pack's plugin `afterResolve` by setting `state.pendingChainId`
  directly — exactly the pattern the Coupling plugin already uses to queue
  `li_recoup_held` / `_rescued` / `_dumped` (`coupling.ts`).

So an encounter is a **content + plugin + presenter pattern**, not a new engine
primitive. We rejected promoting "encounters" to a generic engine capability
(genre-neutral core must name no genre's verbs); the generic mechanism —
chaining — already exists and stays generic.

## Cadence and triggering

- **~2 character encounters per act**, interleaved with a **mostly-ambient deck**
  (~70–80% of swipes stay single-card). Rationale from the v2 research
  ([`../V2-RESEARCH.md`](../V2-RESEARCH.md)): in Reigns, *even a minority of
  reactive cards makes the whole deck feel authored*. We don't need everything to
  branch; encounters are the peaks, ambient cards the connective tissue (and get
  light character-state touches so the villa still feels populated).
- **Ceremony encounters are extra** — see ADR-0006/0007 for the climax variant
  (line-up + Stirling forecast → last-stand swipe → gossip cash-out → verdict).
  They sit *on top of* the two character encounters, accepting a longer run,
  because the recoupling is the most-watched beat and where agency felt most
  absent.
- Encounters are **state-triggered, not merely slotted**: a Rival encounter fires
  when rival-opinion crosses a line, a Partner encounter when Bond is high *or*
  cratering. Triggering off state is what makes them feel earned.

## Why this is hard to reverse

Encounters define the content-authoring model (branching beats, not flat cards),
the presenter's scene framing (a persistent character on screen across beats), and
the trigger conditions that read character state. Changing the branching model or
the ambient/encounter ratio later is a content-and-presenter rework, so the shape
is pinned here.
