# Action plan — Odyssey staff review, 2026-07

Source: `docs/reviews/2026-07-odyssey-staff-review.md` (external staff-engineer
review of the Odyssey build). Ingested 2026-07-10.

**Standing correction of frame:** the reviewed branch
(`claude/odyssey-game-build-qtjgz6`) merged to `main` at `cb6c447` before this
plan was written. The review's "required before merge" items therefore become
**required before Odyssey is declared done** — every finding is fixed forward
on `main` in small reversible passes, per the working agreement.

**The review's own guardrail governs this plan:** *"Avoid turning review
findings into another seven-slice Claude campaign before getting human
evidence."* Accordingly, only two passes below are substantive code changes
(2 and 3); the product-critique work is split into a cheap pre-playtest slice
and an evidence-gated post-playtest slice; and everything the review marks
"not required" lands as tickets, not builds.

---

## The passes

Ordered by dependency. Each names its size, its deliverable, and the review
concern it closes. Gates per the pre-push contract in `CLAUDE.md`; goldens are
byte-identical unless a pass says otherwise, deliberately.

### Phase A — Ground truth (read-only)

**Pass 0 — Claim audit.** Verify every factual assertion in the review
against `main`: the `poseidon >= -999` encoding and its comments, the
`noteFinale` side-channel shape, `pack.ts`'s 275 lines and responsibilities,
the declaration-merging usage, the burnout-for-Despair and
equipment-for-Fires reuse, and whether the checks the commits claim are
actually present in CI (`pages.yml`), not only in commit messages.
Deliverable: a memo mapping each claim to `file:line`, marked
confirmed/corrected. An adversarial review deserves an adversarial fact-check
back — if a finding is wrong, later passes change shape.
*(Closes: Required #3, CI half. Size: small, no code.)*

**Pass 1 — Full gate run on `main`.** `npm install`, `npm run build`, then
the complete named suite: `validate-packs`, `lint-content`,
`simulate --check`, `node --test`, smoke, crowding, mobile-matrix, plus the
docs-site build. Confirm all four goldens (music, love-island, probe,
odyssey) pass. Deliverable: every gate named with its result — the baseline
all later passes diff against.
*(Closes: Required #3, execution half. Size: small, no code.)*

### Phase B — The two substantive code changes

**Pass 2 — Terminal-rule contract.** Replace the `failStates` misuse with an
honest data model: a small discriminated union
(`{when: resource-threshold} | {when: flag} | {when: all}` → `ending`) named
`terminalRules` (or similar) — exactly the conditions actually supported, no
expression language. Migrate the lotus/siren encodings off the fake `-999`
comparison; keep `failStates` working (or cleanly aliased) so music and
love-island are untouched; extend `validatePack` with author-facing errors
for the new shape; add tests. This is a **deliberate engine edit**, which is
also the answer to the "zero engine edits as a goal" P1: the metric flips
from diagnostic to dogma the moment we route around a bad public seam to
preserve it. Goldens stay byte-identical — any diff is a bug.
*(Closes: Required #1; P1 failStates-semantics; principle half of P1
engine-edits. Size: medium.)*

**Pass 3 — Finale data-flow refactor.** First inspect: write a test that
instantiates two engines, runs back-to-back runs, and mixes daily and
personal meta — either proving `noteFinale` state cannot leak or
demonstrating the leak. Then remove the side-channel regardless: the finale
presenter receives explicit input — `{run, result, ending, meta}` — derived
purely at the call site, instead of a plugin noting mutable state for a
getter to read later. The six-step temporal choreography
(meta→setup→flags→itinerary→noteFinale→presenter) collapses to explicit data
flow at its riskiest link. The isolation invariant is pinned by tests
("invariants are executable, not commentary").
*(Closes: Required #2; P1 temporal-coupling. Size: medium; touches the
presenter seam in `js/types.ts`.)*

### Phase C — Smaller code and structure work

**Pass 4 — Seam audit: Despair-on-burnout, Fires-on-equipment.** For each
reuse, decide from the actual code: genuinely generic channel with a
music-flavored *name* → rename to a neutral term (mechanical, golden-safe);
genuinely generic with a generic name → document that the mapping is
legitimate, no change; a real misfit → ticket, don't rebuild now.
Deliverable: one small rename commit and/or a written verdict per seam.
*(Closes: remaining concrete examples in P1 engine-edits. Size: small.)*

**Pass 5 — `pack.ts` decomposition.** Split into `manifest.ts`, `fires.ts`,
`prophecy.ts` (meta + fragments), with `pack.ts` as assembly only — purely
mechanical, no behavior change, goldens identical. Justified because the
third pack is the template future authors and LLM sessions will copy.
*(Closes: P2 pack-module-responsibilities. Size: small.)*

**Pass 6 — Strategy telemetry in the sims.** Extend the DOM-free sim tooling
to log what the balance gate can't currently see: option-selection ratios,
resource state at choice time, Fire-to-path (Nostos/Kleos) conversion, path
switching, temptation acceptance by build. Run 3–4k seeded sims and produce a
findings memo answering the questions sims *can* answer — are
Might/Guile/Lore statistically distinct strategies, does one Fire dominate,
does Poseidon pressure actually alter outcomes. The memo explicitly names
which of the reviewer's questions (comprehension, story-vs-numbers choice,
replay motivation) telemetry cannot answer and only humans can.
*(Closes: P2 balance-gate-measures-survivability. Size: medium, tooling
only, no game code.)*

### Phase P — The product critique (upgraded from tickets, scoped by the review's own restraint rule)

**Pass P-A — Irreverence pass (risk #1: too reverent).** Copy-only, no
systems. Runs **before** the human playtest — the two no-explanation players
are a scarce resource, and putting the museum-piece version in front of them
burns the first impression on a known defect.

1. **Audit the taste layer first, because it may be the culprit.**
   `docs/games/odyssey/taste.mjs`, `VOICE.md`, and `GUIDING_EXAMPLES.md` were
   written before any content; if the blocklist and caps enforce solemnity,
   every future generation session regresses to museum tone regardless of
   what gets fixed now. The taste layer must *permit and exemplify* comedy,
   or the linter is manufacturing the problem the review flagged.
2. **Add a counter-register to the guiding examples** — earned irreverence
   sourced from Homer, not pasted on: the "Nobody" pun is a dumb joke that
   works; Elpenor dies falling off Circe's roof drunk; the Cretan lies make
   Odysseus a fraud with a straight face; Irus gets punched in a beggars'
   boxing match; men become pigs. The documented bar: *surprise, cruelty,
   stupidity, reversal — from the text.*
3. **Rewrite the worst offenders in the deck.** Rank existing cards by
   self-seriousness, rewrite the most precious ones, and deliver the rewrites
   as a **before/after table for human review** — taste is precisely where
   writer ≠ grader applies and a green lint proves nothing. Odyssey golden
   re-baseline is deliberate; music/love-island goldens untouched.

*(Closes: product risk #1. Size: medium, content + taste-layer only.)*

**Pass P-B — Landmark variation depth (risk #2: predetermined runs).** The
review's sharpest sentence: the tests prove the Cyclops *occurs*, not that
the fifth Cyclops is *interesting*. Two halves:

1. **Measure before writing** *(pre-playtest)*. Inventory actual variation
   per landmark on `main`: how many variants each has, what conditions select
   them, whether sea-event context and Fire choice alter landmark *text* or
   only outcomes. Extend the Pass 6 telemetry with a **variant-entropy
   metric**: across ~1k seeded runs, what does a player actually see at each
   landmark on runs 1–5? "80% of runs get the same Cyclops presentation" is a
   number, not a vibe — and it becomes an executable invariant (a floor on
   per-landmark variant distribution).
2. **Fill only the measured gaps** *(post-playtest, human-sized)*. Write
   variants where entropy is worst, driven by state the player *caused*
   (their Fire, a prior sea event, fragments held) rather than a random
   roll — "meaningfully different approaches," not cosmetic reshuffles. Same
   before/after review gate as P-A.

*(Closes: product risk #2. Size: half 1 small; half 2 sized by the data,
gated on human sign-off.)*

**Pass P-C — Persistent knowledge: observe, don't build (risk #3).** Follows
the review's own advice — "do not immediately build a giant meta-system":

1. **The playtest kit (Pass 8) makes replay motivation its primary
   question**: does anyone voluntarily start run two and three, what do they
   say when they stop, does the prophecy read as a reason to return or as
   homework.
2. **One candidate cheap win, ticketed with a design sketch but NOT built:**
   "failures that reveal useful knowledge" — a run-ending mistake writes a
   single bard's-note into the existing meta machinery that changes one line
   next run. Smallest possible instance of the reviewer's list, reusing the
   fragment plumbing; shelf-ready for the day the playtest says replay
   motivation collapses.

*(Closes: product risk #3 as instrumented observation + shelf-ready sketch.
Size: small, docs only.)*

### Phase D — Verification the review demanded

**Pass 7 — Manual-equivalent mobile/device pass.** Drive real Chromium
through the Required-#4 scenarios: save mid-run → reload → resume;
completed-run progression persisting across reload; offline behavior
(network cut, font loading offline); daily mode confirmed isolated from
personal meta through an actually-played run, not only the unit test.
Screenshots at 320/390/430px of the pixel font at its smallest rendered
sizes, long outcome paragraphs, and the known fi/fl-ligature and capital-C
trouble spots. Deliverable: pass/fail per scenario + screenshots, plus an
honest list of what headless Chromium *cannot* verify (non-Retina Android,
sustained readability, real touch) handed over as the physical-device
checklist.
*(Closes: Required #4; P2 visual-theme/pixel-font. Size: medium,
test-and-evidence only.)*

**Pass 8 — Human playtest kit.** Required #5 needs humans, but the kit makes
it costless to run: a one-page protocol — two players, no explanation, the
exact comprehension questions (each of Might, Guile, Lore, Athena, Poseidon,
Expedition, Nostos, Kleos: "what do you think this does?"), an observation
checklist drawn from the review's replay-risk section (does the fifth
Cyclops stay interesting; does anyone voluntarily start run two; does the
reverence read as atmosphere or homework), and a place to record verdicts —
filed under `docs/games/odyssey/`.
*(Closes: Required #5 — kit half; observational halves of product risks
1–3. Size: small, docs only. Execution is human work.)*

### Phase E — Honesty, records, and tickets

**Pass 9 — Docs honesty pass.** Three written corrections where the review
says the project's self-description outruns reality: **(a)** state explicitly
(README / docs-site) that Odyssey proves *internal* extensibility — a
compiled first-party pack — not external runtime pack portability, with the
JSON-only experiment named as the open question; **(b)** a note in the
working-agreement / taste layer that the taste gate is hygiene, not editorial
approval — a green taste lint never substitutes for a human verdict;
**(c)** record the revised stance that engine edits are welcome when they
simplify the pack contract for the fourth game.
*(Closes: P1 static-compilation framing; P2 taste-theatre; P1 engine-edits
doctrine. Size: small.)*

**Pass 10 — Scaling-ceiling ADR.** An ADR documenting the
declaration-merging concern: why global `RunState`/`Effect` augmentation
works at three packs, the failure modes at five-plus (cross-pack access
type-checks, doc pollution, collisions, runtime-only isolation), and the
candidate remedies (vocabulary-parameterized types,
`run.packState['odyssey']` namespacing) — decision deferred, deliberately,
per the review's own "I would not block this merge solely on that."
*(Closes: P2 declaration-merging. Size: small.)*

**Pass 11 — Ticket-only backlog.** File (in
`docs/games/odyssey/IMPLEMENTATION-PLAN.md` / `docs/SPRINT-TECH-DEBT.md`)
everything the review raises but explicitly defers, so nothing silently
drops: the external JSON-only pack experiment with its constraint list (no
module augmentation, no executable plugin code, no bespoke CSS beyond theme
tokens, loaded at runtime by an unchanged host); replay-depth layers beyond
the single three-fragment secret; P-C's bard's-note sketch; landmark-depth
half 2 if not yet triggered; key art; the product-identity fork (SDK for
TypeScript developers vs content-pack runtime for LLM generation). Build
none of it.
*(Closes: P1 external-portability recommendation; the review's
"not required" list. Size: small.)*

### Phase F — Close per the working agreement

**Pass 12 — Fresh-context verification and hand-off.** Writer ≠ grader: run
the `verifier` subagent (or `/code-review`) over the accumulated diff with no
access to the authoring reasoning; re-run the full named gate suite; drive
all three games to a terminal state in Chromium *after interacting with the
changed surfaces* — the terminal-rule and finale changes are
progression-gated, exactly the surface class INCIDENTS says to hit first;
then the three-line `verified ✓ / not verified ⚠ / watch-out` hand-off.
*(Closes: working-agreement obligations; makes Required #3 true of this
plan's own work. Size: small.)*

---

## Sequencing

**Slice 1 — before the human playtest:** Passes 0–5, P-A (full), P-B half 1
(measurement only), 6, 7, 8, 12. Rationale: fix the voice and know the
variation numbers before spending the two no-explanation players.

**Slice 2 — after the playtest, evidence-gated:** P-B half 2 (variant
writing, sized by the entropy data), P-C's bard's-note if replay motivation
proves weak, and anything promoted out of the Pass 11 backlog.

**Human-only items (cannot be automated):** running the Pass 8 playtest;
physical-device checks from Pass 7's handover list; the editorial taste
verdict on P-A's before/after table.

---

## Coverage: every review concern → a pass

| Review concern | Pass |
|---|---|
| Required 1: fake `poseidon >= -999` encoding | 2 |
| Required 2: `noteFinale` leak inspection | 3 |
| Required 3: suite + CI actually present | 0, 1, 12 |
| Required 4: manual mobile / resume / offline / daily | 7 |
| Required 5: two-human comprehension test | 8 (kit; execution is human) |
| P1: `failStates` semantic drift | 2 |
| P1: zero-engine-edits as a goal | 2, 4, 9c |
| P1: prophecy temporal coupling | 3 |
| P1: internal vs external portability | 9a, 11 |
| P2: `pack.ts` responsibilities | 5 |
| P2: declaration merging | 10 |
| P2: taste compliance theatre | 9b, 8 |
| P2: balance gate vs strategic quality | 6 |
| P2: visual theme / pixel font | 7 |
| Product 1: too reverent | **P-A**; observed in 8 |
| Product 2: predetermined landmarks | **P-B** + entropy invariant; observed in 8 |
| Product 3: thin persistent knowledge | **P-C**; sketch shelved in 11 |
| "Not required" list (cards, key art, DSL, meta, rewrite, type isolation) | 11 (tickets only) |
