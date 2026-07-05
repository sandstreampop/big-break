# v4 theory review — hardening the plan against game-design research

**Purpose.** Pressure-test the whole v4 plan ([`V4-DESIGN.md`](./V4-DESIGN.md),
[`V4-LIVING-VILLA.md`](./V4-LIVING-VILLA.md),
[`V4-POSITIONING-FORK.md`](./V4-POSITIONING-FORK.md)) against established,
real-world game-design and cognitive-science research that *actually applies to
our use case* — a phone-first, swipe-card, relationship-driven narrative game.
For each pillar and each open decision: **what theory supports it, what theory
challenges or refines it, and the concrete hardening action.** Web-researched
July 2026; sources listed at the end. This is a readiness artifact — nothing here
overturns a decision, it de-risks the ones we've made and flags what we'd
otherwise have learned the hard way in playtest.

## What the game is *for* (MDA target aesthetics)

The MDA framework (Hunicke, LeBlanc & Zubek, 2004) splits a game into
**M**echanics → **D**ynamics → **A**esthetics, and notes the crucial asymmetry:
designers build left-to-right, but **players experience right-to-left** — they
feel the aesthetic first, and the mechanics only exist to produce it. So the plan
should name its target aesthetics and check every mechanic against them. Of the
"eight kinds of fun," this game's targets are, in order:

1. **Narrative** (game as drama) — the season arc.
2. **Fellowship** (game as social framework) — the villa's relationships.
3. **Fantasy** (game as make-believe) — *being* an Islander.
4. **Expression** (game as self-discovery) — who you choose to be, how you play it.

Explicitly **not** targeting Challenge-as-mastery or Competition as primaries.
This matters: it means "is this decision hard to optimise?" is the wrong question
for most cards — "does this decision express who I am and move the drama?" is the
right one. Keep this list at the top of the design mind; when a proposed mechanic
serves none of the four, cut it.

---

## Pillar-by-pillar

### Core reframe — the living web of couples

- **Supports.** Self-Determination Theory (Ryan, Rigby & Przybylski) finds that
  **relatedness** — feeling connected to and significant to others —
  independently predicts enjoyment, retention, and well-being alongside autonomy
  and competence. A villa that is *alive with other people's relationships* is a
  relatedness engine; the current player-centric spotlight leaves that need
  under-fed. The reframe is motivationally well-founded, not just thematically
  nice.
- **Challenges / refines.** Interactive-drama research (Mateas & Stern's
  *Façade* architecture) splits a living story into a **drama manager + user
  model + agent model**, and evaluates it on four axes: **pacing, coherence,
  player autonomy, dramatic arc.** Our "mostly-scripted background couple-graph"
  *is* a lightweight drama manager — so we should adopt those four as its QA
  rubric, not invent our own. And the hard-won lesson of that whole research
  line is that **fully emergent social simulation rarely reads as coherent
  story** — which is exactly why our "scripted-first" instinct in
  `V4-LIVING-VILLA.md` is the right one.
- **Hardening action.** (a) Adopt pacing / coherence / autonomy / dramatic-arc as
  the explicit acceptance tests for the couple-graph. (b) Cap tracked threads by
  **cognitive load**: working memory is ~7±2 items (Miller), and that's *total*
  load, shared with your own couple, the factions, your stats. Foregrounding 2–3
  NPC storylines at once is not a taste preference — it's the ceiling. The v3
  Clarity Layer earns its keep here by **chunking** the cast so it doesn't all
  sit in working memory at once.

### Pillar 0 — length is the substrate

- **Supports.** SDT again (a longer arc lets relatedness and competence actually
  develop) and the affection-meter critique (below): depth needs time.
- **Challenges / refines — this is the most important finding in the review.**
  The **peak-end rule** (Kahneman): the memory of an experience is dominated by
  its **emotional peak** and its **ending**; the *duration* is almost ignored
  ("duration neglect"). **A longer run is not remembered as better — a run with
  bigger peaks and a stronger ending is.** So "extend the content" must not be
  read as "add minutes." It must be read as "buy more and bigger *peaks*, and
  protect the *end*." A longer season with a flat middle would score *worse* in
  memory than today's short one. This reframes Pillar 0 from "make it longer" to
  "make it a season with real peaks and a real finale."
- **Hardening action.** Every added stretch of runtime must earn a peak or feed
  one. Tie the tentpoles (Casa, Movie Night, the Final) to deliberate emotional
  spikes with strong feedback/celebration (the peak-end literature is explicit
  that a great moment followed by a flat screen *loses* the memory). Protect the
  ending — the Final is the single most memory-weighted beat in the whole run.

### Pillar 1 — a relationship is a garden, not a number

- **Supports.** Directly matches the documented **critique of affection meters**:
  relationship "values" that tick up mechanically produce perverse dynamics
  ("more friends, more benefits") and read as gamified, not felt. Our "grafting =
  daily gesture with memory / inside jokes" is the researched *alternative* to a
  bar you fill.
- **Challenges / refines.** The renamed **Connection** meter must not quietly
  become the very affection-bar the critique warns about. The defense is that
  Connection should be **legible as history, not as a number to optimise** — its
  movements are *qualitative* (v3 already hides raw relationship numbers, per the
  Clarity Layer), and it should be *earned through remembered acts*, not purchased.
- **Hardening action.** Keep the no-raw-relationship-numbers rule from v3; make
  Connection changes narratable ("she hasn't forgotten the coffee") rather than
  "+7". Guard against a dominant grafting strategy (see Pillar-authenticity).

### Pillars 4 & 5 — authenticity-as-consistency, and the factional public

- **Supports.** **Reigns** (Nerial/Devolver, 2016) is a near-exact,
  commercially-proven blueprint for the factional public *in our exact medium*:
  four faction meters, and a card **"bag" recompiled against global state every
  swipe** — faction imbalance raises the odds of crisis cards; event chains
  weight follow-ups into the bag; resolved threads are removed. That is precisely
  our "factional public + state-gated cards + foreground-a-few-threads" design.
  We are not inventing an unproven system; we're applying a shipped one.
- **Challenges / refines.** Sid Meier's **"interesting decisions"** (GDC 2012):
  a choice is interesting only when **no option dominates**, options aren't
  equally attractive, and the player can make an **informed** choice with
  **visible consequences.** The factions are the mechanism that *guarantees* no
  dominant option (pleasing Romantics angers the Self-Respect crowd) — good. But
  it imposes a requirement: the player must be able to *read* which faction a
  choice serves, or the tradeoff is invisible and the decision collapses to
  guesswork (Reigns is criticised in exactly this way — "the game is quite
  unclear"). Authenticity-as-consistency has the same risk: if the "receipts"
  accrue invisibly and only surface at Movie Night, players may feel ambushed
  rather than caught-out.
- **Hardening action.** (a) Telegraph faction leanings on cards the way v3's
  set-piece "stakes-in" rows telegraph survival math — enough signal that the
  tradeoff is *informed*, without a spreadsheet. (b) For the consistency system,
  give a soft tell that a choice is *inconsistent with a stance you've taken*
  ("this isn't what you told Liv…") so Movie Night is a *dreaded, foreseen*
  reckoning, not a random gotcha. Foreseeable consequence = interesting decision;
  invisible consequence = feels unfair.

### Pillar 6 — the ick; Pillar 7 — betrayal & repair

- **Supports.** These are **narrative uncertainty** and **dramatic-arc** devices
  (the ick = a sharp reversal; repair = a rising arc), both core to the
  Narrative/Fellowship aesthetics we're targeting. Drama-management's "dramatic
  arc" axis explicitly values reversals and recoveries.
- **Challenges / refines.** Interesting-decisions again: an ick that fires from
  *pure* randomness violates "the player must understand the scope of their
  choices." The plan already ties the ick to inauthenticity/over-pursuit — keep
  it **legible-cause**, not a dice roll, or it reads as arbitrary punishment.
- **Hardening action.** The ick must always have a readable trigger the player
  can trace to a choice; same for a repair failing. Randomness can *gate timing*,
  not *invent cause*.

### Pillar 8 — winning is the earned story

- **Supports.** Peak-end (the Final is the memory-dominant ending; a *storied*
  couple makes it a peak) and drama-management's **dramatic-arc** criterion (a
  win with no rising conflict scores as poor story). Rewarding the arc over the
  frictionless couple is exactly what the research says makes an ending land.
- **Hardening action.** Encode "earned" as a readable arc condition (survived a
  rupture / redemption from a dumping), and make the Final's framing celebrate the
  *story*, not just the score — the ending is where the whole run is judged.

---

## Cross-cutting: the positioning fork (A/B/C)

The theory strengthens the [`V4-POSITIONING-FORK.md`](./V4-POSITIONING-FORK.md)
recommendation of **Option C (a longer season built from short "weeks")**:

- **Peak-end** warns Option B (raw longer runs) hardest: length without extra
  peaks is *forgotten*, and a sagging middle can score below today's short run.
  Option C's weekly rhythm is a **peak cadence** — each week ends on a tentpole,
  manufacturing regular peaks and a strong pre-Final build.
- **Slay the Spire** is the roguelike proof-point: its act structure paces a long
  run as a *rhythm of encounters → rest → elite → boss*, "doesn't waste a single
  mechanic," and gives the player **complete information** (the "intent" system)
  so decisions stay interesting across a long climb. Option C's "quiet daily
  beats → one weekly tentpole" is the same rhythm in our fiction.
- **FTUE / retention:** "the first 5 minutes determine ~80% of retention." A
  *longer* run makes the **front** more critical, not less — if week 1 sags, the
  extra length is never seen. Whatever the fork's outcome, an engineered
  first-session hook is mandatory (v3's 3-card gesture ramp + Stirling tutor is
  the seed to build on, narrative-integrated per FTUE best practice).

---

## Net-new items the plan was missing (add to the build backlog)

1. **State target aesthetics up front** (done — added to `V4-DESIGN.md`): every
   mechanic is checked against Narrative / Fellowship / Fantasy / Expression.
2. **Peak budget, not a minute budget.** Reframe Pillar 0 around *engineered
   peaks + a protected ending* (peak-end), not runtime. Instrument the run for
   "where are the peaks?" before shipping length.
3. **A first-session (FTUE) contract** as an explicit principle — the front of a
   (longer) run must hook in ~5 minutes, tutorialised through the fiction.
4. **A legibility/telegraphing contract for tradeoffs** — faction leanings and
   consistency risks must be *foreseeable* (interesting-decisions), reusing v3's
   "stakes-in" pattern; otherwise Movie Night and the factions feel like gotchas.
5. **Drama-manager QA rubric for the couple-graph** — pacing / coherence /
   autonomy / dramatic arc as acceptance tests.
6. **Reigns as the reference implementation** for the factional public + the
   weighted-bag mechanic for foregrounding threads (and *removing* resolved
   threads' cards so the deck doesn't silt up).
7. **Cognitive-load cap** (~2–3 foregrounded threads) as a hard rule, with the
   Clarity Layer doing the chunking.

## The taste gate (human-in-the-loop, no backend)

The taste *ceiling* can't be machine-graded, so it gets the one human gate in an
otherwise self-merging build — made frictionless via a swipe miniapp:
[`/love-island/taste-review.html`](https://sandstreampop.github.io/big-break/love-island/taste-review.html)
(source: `docs/games/love-island/public/taste-review.html`).

**The loop (no server needed — the repo and the chat are the courier):**

1. The builder emits a batch of candidate writing as **`taste-queue.json`** (or a
   named file, served via `?queue=<file>`) committed to `public/` — the schema is
   documented in the app header (per-item `id` / `type` / `context` /
   `prompt` / `left` / `right` / `voice` / `text`).
2. Viktor opens the app (auto-loads the queue over HTTPS) and swipes:
   **right = keep (👍), left = cut (👎), up = ⭐ love (voice exemplar)**, with an
   optional note per card.
3. He returns the verdicts by any of three no-backend paths: **① Copy → paste
   into the Claude chat** (easiest, size-independent); **② one-tap "Commit to
   repo"** (a prefilled GitHub new-file URL drops `verdicts-<batch>.json` under
   `docs/games/love-island/taste-feedback/` — builder reads it from git); **③
   Download** the JSON and upload it. (② is size-capped ~7.5k chars; ①/③ handle
   any size.)
4. The builder ingests the verdicts: **keep** the 👍, **cut/revise** the 👎
   (using notes), promote **⭐** to positive exemplars in `GUIDING_EXAMPLES.md`,
   and fold recurring 👎 clichés into `taste.mjs` so the *floor rises* with each
   batch. Content isn't "done" until it has cleared a review pass.

## Readiness checklist for next session

- [ ] Viktor picks the positioning fork (A/B/**C**) → graduate to ADR-0010.
- [ ] Draft ADR-0011: factional public (N factions; win-gate reads; the
      `momentumResource` question), citing Reigns' four-meter model.
- [ ] Draft ADR-0012: the couple-graph as a scripted drama manager (thread cap,
      the four QA axes, weighted-bag surfacing).
- [ ] Add the FTUE + telegraphing contracts to the design principles.
- [ ] Plan the golden re-baseline that any length/balance change forces.

---

## Sources

- Hunicke, LeBlanc & Zubek, *MDA: A Formal Approach to Game Design* — [PDF](https://users.cs.northwestern.edu/~hunicke/MDA.pdf) · [8 kinds of fun overview](https://en.wikipedia.org/wiki/MDA_framework)
- Ryan, Rigby & Przybylski, *The Motivational Pull of Video Games: A Self-Determination Theory Approach* (2006) — [Springer](https://link.springer.com/article/10.1007/s11031-006-9051-8); Przybylski, Rigby & Ryan, *A Motivational Model of Video Game Engagement* (2010) — [PDF](https://selfdeterminationtheory.org/SDT/documents/2010_PrzybylskiRigbyRyan_ROGP.pdf)
- Kahneman, the **peak-end rule** / duration neglect, applied to experience design — [Peak-End Rule (Yu-kai Chou)](https://yukaichou.com/behavioral-analysis/peak-end-rule-kahneman-experience-design/) · [UX Bulletin](https://www.ux-bulletin.com/peak-end-rule-ux-designing-memorable-experiences/)
- Mateas & Stern, *Interaction and Narrative* (Façade; drama manager / user model / agent model) — [PDF](https://users.soe.ucsc.edu/~michaelm/publications/mateas-game-design-reader-2005.pdf); drama-management evaluation axes (pacing, coherence, autonomy, dramatic arc) — [paper](https://www.academia.edu/152613/Drama_Management_Evaluation_for_Interactive_Fiction_Games)
- Sid Meier, *Interesting Decisions* (GDC 2012) — [Game Developer](https://www.gamedeveloper.com/design/gdc-2012-sid-meier-on-how-to-see-games-as-sets-of-interesting-decisions)
- *Game Design Deep Dive: Creating an adaptive narrative in Reigns* (the card-"bag" recompiled against state) — [Game Developer](https://www.gamedeveloper.com/design/game-design-deep-dive-creating-an-adaptive-narrative-in-i-reigns-i-) · [Reigns (Wikipedia)](https://en.wikipedia.org/wiki/Reigns_(video_game))
- *Slay the Spire* act structure & "intent" full-information pacing — [Wikipedia](https://en.wikipedia.org/wiki/Slay_the_Spire) · [Rogueliker review](https://rogueliker.com/slay-the-spire-review/)
- Miller's Law (7±2 working-memory span) & cognitive load — [Miller's Law (Weave)](https://medium.com/weavedesign/millers-law-designing-for-memory-span-9a38cee41384) · [Cognitive Load Theory (ScienceDirect)](https://www.sciencedirect.com/topics/psychology/cognitive-load-theory)
- Affection-meter / relationship-value critique — [Relationship Values (TV Tropes)](https://tvtropes.org/pmwiki/pmwiki.php/Main/RelationshipValues)
- First-Time User Experience / onboarding & retention — [What is the FTUE? (Design the Game)](https://www.designthegame.com/learning/tutorial/what-first-time-user-experience-ftue)
- Henry Jenkins, *Game Design as Narrative Architecture* (embedded / enacted / emergent narrative; "evocative spaces") — foundational to the witness-card approach in `V4-LIVING-VILLA.md`.

---

*Provenance: theory review conducted 2026-07-05 while Viktor was away, to harden
the v4 plan before build. Companion to the three v4 design docs; feeds ADRs
0010–0012.*
