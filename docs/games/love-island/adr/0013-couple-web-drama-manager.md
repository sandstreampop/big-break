# The couple-web: a scripted-first drama manager (v4 S3)

Session 3 of the v4 build ([`../V4-BUILD-CHARTER.md`](../V4-BUILD-CHARTER.md)),
alongside the factional public (ADR-0012). The charter's locked call: the
villa's other couples get lives — **scripted-first, NOT autonomous agents** —
with NPC moves as **authored beats surfaced by state + deck-weighting**
(the Reigns "bag": a heating thread bloats the deck; a resolved thread's
cards are removed), foregrounding at most **two** threads at a time, QA'd on
the four interactive-drama axes: **pacing, coherence, autonomy, dramatic
arc** (Mateas & Stern's rubric, per V4-THEORY-REVIEW).

## Decision

**A thread IS one NPC couple's storyline, and the authored threads ARE the
tracked cast.** Three fixed NPC couples — **Marco+Sophia, with Amber as the third corner** (the
showmance with a wandering eye), **Dev+Tash** (the achingly slow real one),
**Kai+Chloe** (a sweetheart lovebombing a game-player who is banking it) —
plus the dynamic **{rival} vs {mate}** feud and the **Sophia cascade**
("scorched": lights only off the triangle's loud ending — the domino).
Six fixed islanders + the dynamic seats + bombshells ≈ the charter's
6–8 tracked cast; the rest of the villa stays ambient wallpaper, chunked by
the Clarity Layer. Fixed casting keeps every beat AUTHORED (the coherence
axis: emergent social sim rarely reads as story) and the copy hyper-specific
— Marco's skincare, the wall tea, Marbella Sunset.

### The machinery (`plugins/coupleweb.ts` — all pack-side, zero engine edits)

- **Lifecycle**: dormant → **lit** (foreground) → **resolved** (an outcome
  key). The scheduler runs at week turns, RNG-free — a pure function of play
  state, so the seeded goldens pin the whole drama. Cap: `maxLit = 2` (the
  7±2 working-memory ceiling, shared with your couple, the Rival, the
  factions — a hard rule, not a taste).
- **The bag**: a thread card is deck-eligible ONLY at its exact stage of a
  lit thread (`threadStageIs: '<id>:<n>'` — dormant and resolved threads'
  cards are simply not in the pool, so the deck never silts up), and a lit
  thread's current-stage cards draw at `threadMult ×2^(weeks lit)` (capped)
  — **a heating thread literally bloats the deck** until it pays off. The
  player's own arcs (the ick, a live repair) ride the same bag: your rupture
  is a foreground thread too.
- **Shape**: one on-screen BEAT (drawn from 2 authored variants — different
  runs meet a different scene: witness or gossip) then the RESOLUTION
  (2 authored variants selected by influence flags). Measured, not guessed:
  at 2 beats + resolution only ~10% of threads ended on camera in the
  six-week season's ~10 free draws; at 1+1, **2.0 on-screen resolutions per
  run and 97% of seasons see a thread end on camera.**
- **Offscreen resolution**: a lit thread past its window resolves quietly at
  the week turn (`off_<outcome>`) and the next recap's **MEANWHILE** block
  reports it — the world moves whether you watched or not (pacing axis: no
  storyline dangles into the Final). Offscreen endings pay no factions and
  gate no callbacks — nobody filmed them.
- **Guards**: a thread whose fixed cast the player couples with goes dark
  (`threadBroken`) — you can't witness a triangle you're a corner of. Exes
  don't break threads; they moved on, so does the plot.
- **Witness, don't steer** (autonomy axis): the player's choices set
  influence flags that select resolution VARIANTS (Sophia gets the receipts
  → the showdown; you kept the quote → the fizzle) and never command the
  couple; thread verbs cannot touch `partner`/`bond` (tested).
- **Consequences**: resolutions pay authored faction spreads (the nation
  watches the B-plots) and open **callback** cards (`threadOutcomeIs`) —
  the reenactment challenge, Big Tea, Kai's advice era. **Cascade**:
  the showdown arms `scorched` via `threadLight`, which takes lighting
  priority at the next turn.

### The story gate (Pillar 8: Win the Villa demands a narrative)

This plugin also owns **`story`** — the ledger of the player couple's OWN
arc — and `winGates.winvilla` gains `story: 2`, read generically through
`gateValue`. A drama-free cruise books the People's Runners-Up; the crown
wants an arc it can retell. Beats are **authored** (`storyBeat: '<why>'` on
the exact card that earns them — the rescued verdict, the 3 a.m. wobble
survived, the come-clean, the firepit detonation, a named-and-survived ick,
a finished repair, the scorched cascade weathered), each announced with its
why (the legible-cause contract); the only two automatic milestones fire on
unmistakable structural state (jilted-then-recoupled; a bombshell steal that
held). The crossroads bars, recap Intention block, and the Final's
set-piece stakes all read the ledger honestly.

### The player-couple arcs shipped with it (`events-arcs.ts`)

- **The ick** — love's internal lie-detector: fires per partner SHAPE
  (the sweetheart's intensity, the game-player's rehearsal, the
  slow-burner's whiplash — cause always traceable to who they are), then
  **name it** (a repairable conversation, chained follow-up) or **bury it**
  (it compounds and resurfaces worse). The partner's own radar fires back
  on survival-coupling (`li_ick_theirs`, gated on the player's actual
  strategic flags). Randomness gates timing, never cause.
- **Betrayal-repair** — the same currency as love, sustained: coffees +
  a public re-commitment over days, in both directions (your footage →
  you run the lap; theirs → forgive fast (Romantics cheer, Self-Respect
  calls it early) or make them finish the lap (the arithmetic reverses)).
  Pillar 5's factional split on forgiveness, authored on the choices.

## QA on the four axes

`test/li-coupleweb.test.mjs` is organised by axis (pacing: scheduling, the
cap, offscreen closure, slot refill; coherence: stage eligibility, removal
on resolve, the broken-thread guard, callback gating, bag targeting;
autonomy: variant selection, the no-god-control bound; arc: consequences,
cascade, the story ledger's legibility) plus the seeded-determinism and
per-run-state guarantees. Pacing/reach were additionally tuned against
3000-run sims (see the balance notes in ADR-0012).

## Rejected

- **Autonomous agent simulation** — charter-forbidden; emergent social sim
  rarely reads as coherent story, and overbuilding it changes genres.
- **Run-time drawn thread casting** (couples formed from the leftover pool)
  — kills authored specificity, demands token machinery and templated
  dialogue; fixed casting + the broken-thread guard gets coherence for free.
- **Story credit for spectating** — witnessing Dev's firepit speech is his
  storyline; the WtV gate counts only the player couple's own arc.
- **A third+ foreground slot** — the ceiling is the ceiling.
