# v2 design record — the villa that feels like *Love Island*

Output of a `grill-with-docs` session, prompted by feedback from 5 playtest runs
of the shipped villa pack. Like [`grill.md`](./grill.md) this is a **design
record, not a spec and not built code** — it captures the shared understanding
reached by interviewing, so a later pass can synthesise a PRD without
re-interviewing.

Canonical vocabulary: [`CONTEXT.md`](./CONTEXT.md). Hard decisions:
[`adr/`](./adr/) — v2 adds **ADR-0005…0008**. The evidence base for the direction:
[`V2-RESEARCH.md`](./V2-RESEARCH.md). Build order:
[`IMPLEMENTATION-PLAN.md`](./IMPLEMENTATION-PLAN.md) (v2 phases).

## The problem v2 solves

The shipped pack is mechanically sound (tuned floors, golden-pinned, three
winnable Summits) but the playtest found it **hollow as an experience**:

- Outcomes felt **unearned** — you couldn't tell what the real difference between
  left and right was, or how a choice connected to the event; recoupling survival
  felt like a coin flip.
- The **partner is an abstract entity** — a name and a Bond number at the top of
  the screen. The Rival, the gossip, the interactions are afterthoughts.
- Events don't feel impactful on the emergent story. **"We want MOMENTS."**
- The voice is too much **dry omniscient narrator**; the Brit villa personality and
  the Scottish-comedian voiceover are barely there.
- Artwork reads as nonsense and the UI doesn't look like Love Island.

The competitor's own reviews confirm this is *the* genre trap: players trash
Fusebox's *Love Island: The Game* for "choices don't matter," "all routes are the
same, the love interests say the same thing word for word," gem-gating, and "no
way to reject anyone." Our v2 differentiators fall straight out of that list — see
[`V2-RESEARCH.md`](./V2-RESEARCH.md) for the full teardown.

## The shape of v2

Six moves. All **pack-owned**, riding the existing genre-neutral engine — the music
pack is untouched and no engine line names a villa concept (the CLAUDE.md spine).

| Move | What it is | ADR / doc |
|---|---|---|
| **Encounters** | The core verb grows: swipes steer a **branching 3–4 beat dialogue scene** with one named character, ~2/act on a mostly-ambient deck, state-triggered. | [ADR-0005](./adr/0005-encounters-branching-dialogue.md) |
| **First-class characters** | Partner, a named **season-long Rival**, and bombshells carry **opinion (visible tiers) + mood + a secret**. | [ADR-0006](./adr/0006-first-class-character-state.md) |
| **Gossip currency** | Held intel you **gather** (encounters + Beach Hut) and **deploy** (tell partner / drop to rival / keep); cascades along a small network; **cashes out at ceremonies**. | [ADR-0007](./adr/0007-gossip-currency.md) |
| **Stirling** | The voiceover as a **bark engine** — condition-filtered, no-repeat line bucket; comedy **and** diegetic legibility; a popover one layer above the action. | [ADR-0008](./adr/0008-stirling-bark-engine.md) |
| **Dialogue-first voice** | Outcome/beat text leads with **what characters say** (Brit villa cadence); the narrator drops to brief stage directions; Stirling carries the outside wit. | prose (this doc) · VOICE.md/taste.mjs evolution |
| **Presentation** | **Mood-driven character portraits first**; a **relationship-forward HUD** (Partner promoted to a persistent presence, stats secondary); a villa visual identity. | prose (this doc) |

## How the ceremony becomes the centrepiece

The recoupling is the most-watched beat and the one that felt most like a coin
flip. In v2 it is promoted to a **full climax encounter, extra** on top of the two
character encounters in an act (we accept a longer run for it):

1. **The line-up (forecast).** Partner and Rival on screen, portraits and moods.
   **Stirling reads the danger in character** — turning the hidden
   `Bond ≥ floor OR Public ≥ floor` check (ADR-0002) into a qualitative, honest
   forecast. This is the legibility fix landing exactly where it was missing.
2. **Your last stand.** You choose which lane to trust — plead the **Bond** or work
   the **room/public** — which already buffs the chosen lane by tier
   (`coupling.ts` `bondLane`). Now it's dramatized, and the **lean-preview**
   (below) shows the stakes as you tilt the card.
3. **Cash out gossip.** Holding a Rival's secret? Deploying it here swings the
   check — the natural sink for the gossip currency (ADR-0007).
4. **The verdict (the moment).** Held / rescued-by-public / dumped — and **Stirling
   explains why**, so it reads as earned. Portraits react.

Four systems collide in one set-piece (character state, Stirling forecast+explain,
gossip cash-out, lean-preview). That collision *is* the MOMENT — the research's
thesis that memorable moments come from **systems interacting, not more script**,
applied to the single most important beat.

## The Rival, made real

Today the Rival is a flag and a Bond penalty (`coupling.ts`). v2 makes it a
**single named antagonist for the whole Season**, drawn from your same-gender pool
in Act 1, who **escalates**: established in an Act-1 encounter → makes a move in
Act 2 (poach, plant a rumour) → **secret-vs-bond cash-out at a ceremony**. Their
primary threat is **poaching your partner** (so the coupling is what's at stake),
with public-competition as secondary pressure. **Bombshells can become optional
second-wave rivals**, so the villa still churns rather than being a fixed 1-v-1. A
different rival each playthrough is replay variety across the 5-run cadence.

## Legibility, held qualitative

The one genuine caution from the research: over-telegraphing *subverts* agency
(the player becomes a min-maxer). v2 keeps every legibility signal **diegetic and
qualitative**:

- **Lean-preview** on the card — adopting Reigns' proven form: **magnitude dots**
  per affected stat on the HUD as you start to tilt (small dot / big dot for how
  much), plus our own **volatility mark** for outcomes whose sign isn't fixed.
  Direction and volatility, never numbers.
- **Stirling** speaks the forecasts and verdicts in character (ADR-0008), so the
  "why" is a voice, not a readout.

## What stays as prose vs. ADR

ADRs 0005–0008 pin the **architecturally load-bearing** decisions (the ones that
set run-state schema, the choice grammar, a new presentation channel, or the
engine boundary). The rest is **direction/taste**, recorded here: the dialogue-first
voice shift (a VOICE.md / taste.mjs evolution, to be recalibrated with the user
like Phase A was), the lean-preview visual form, the portrait-first art direction,
and the relationship-forward HUD. These are golden-affecting content/presentation
work, not new architecture.

## Build strategy: vertical slice first

We prove the whole stack on **one encounter** before scaling — the Act-1
Rival-established scene — so if it feels like Love Island the thesis holds, and if
it doesn't we've spent minimal effort learning that. Scope and sequencing live in
[`IMPLEMENTATION-PLAN.md`](./IMPLEMENTATION-PLAN.md) (v2 phases).

## Open threads (resolved this session)

All four grill threads reached shared understanding: encounter frequency/length
(~2/act × 3–4 beats on a mostly-ambient deck); the ceremony as an extra climax
encounter; the Rival arc (named, season-long, poach-the-partner, bombshells as
second wave); and the output shape (this record + ADRs 0005–0008 + vertical-slice
Phase 1).
