# Sim findings — strategy telemetry + landmark entropy (2026-07)

Source: `node tools/strategy-telemetry.mjs odyssey 4000` (seed 3548, the
deterministic pack-core driver, tapped by a zero-RNG observer) — the Pass 6 /
P-B-half-1 deliverable of the 2026-07 staff-review action plan. Every number
below is reproducible from that command. **Sim caveat up front:** the driver
plays a "decent whim" policy (60% coin-flip, 40% odds-scoring, compass-with-
noise at the crossroads). Numbers describe what the SYSTEM does under broad
play, not what a motivated human would do.

## What the sweep caught first: a shipped bug (now INCIDENTS #3)

In 2 of 1,000 runs the telling reached Act II without ever meeting the
Cyclops: the lotus (requires burnout ≥ 18, sometimes first true at the act's
last slot) contested the landmark's protected end slot, won by declaration
order, and the act-scoped landmark could never roll forward. Fixed in
`itinerary.ts` (latest-due beat wins; the landmark's 'end' slot is the act
maximum, so it is now undisplaceable) and pinned by
`test/odyssey-entropy.test.mjs` over 1,000 seeded careers. The measurement
tooling paid for itself before producing a single intended number.

## The questions the sims CAN answer

**Are Might / Guile / Lore statistically distinct strategies?** Partially.
All three dominant-stat cohorts win at comparable rates (might 61.6%, guile
63.1%, lore 69.5% of finales) — no dead stat, and lore's ~7-point edge is
real but not degenerate. Distribution of dominance skews might (43% of
finales) over guile (31%) and lore (25%). Verdict: three viable colors, one
mildly stronger, none mandatory. What the sims cannot say is whether they
FEEL different to play — the option texts differ, the deltas rhyme.

**Does one Fire dominate?** No. Win rates span soldiers_camp 44.2% →
kings_hall 36.9%; all four inside the declared 35–50 band. Two texture
findings worth watching: (a) temple_steps banks at Circe ~2.4× more often
than soldiers_camp (14.0% vs 5.9% of runs) — its omen-lean surfaces the soft
year more; (b) the camp is offered the fewest temptations (654 vs 780–785).
The Fires shape *how the run ends*, which is the design intent.

**Do the Fires shape strategic identity (Fire → path)?** No — and this is
the sharpest strategy finding. Path commits are flat across every Fire
(77.7–80.3% nostos). The King's Hall, whose whole flavor is glory, converts
to Kleos at 20.3% — indistinguishable from the Fisherman's Hearth at 20.7%.
Under the compass policy the Fires change survival odds but not identity.
If the human playtest confirms Fires feel interchangeable, the lever is
run-start resource geometry (e.g. the Hall's Renown 2 is not enough to make
Kleos's gate feel *closer* at the crossroads).

**Are Nostos and Kleos genuine strategies or end-of-run checks?** Kleos
behaves like a self-selected near-lock: committed in ~20% of runs, it
succeeds in 93.8% of its finales (Nostos: 56.5%). The compass only points at
Kleos when Renown is already banked, and Renown ≥ threshold is the entire
gate — so the commit IS the win in most tellings. That is closer to
"end-of-run check" than "strategy". Watch in playtest: does anyone commit
Kleos as a *plan* (early renown-chasing) rather than a *ratification*?

**Does Poseidon pressure actually alter outcomes?** Yes, strongly and
monotonically: runs whose wrath peaks ≤ 3 win 54.5% (game over 25.1%); peaks
4–5 win 36.9%; peaks > 5 win 20.8% (game over 54.1%). The pressure is
mechanically real. Whether it is LEGIBLE — whether players see the trident
number and change behavior — is a human question (Pass 8).

**Athena and Renown read as the run's true engines.** Athena max ≤ 3 →
8.9% wins; > 8 → 63.6%. Renown ≤ 5 → 18.3%; > 8 → 61.6%. Expedition's max
barely moves outcomes (39.7% vs 41.0%) — consistent with its design as a
door-closer rather than a win engine, but worth knowing: the fleet number
players will stare at is the least predictive of the four.

**Temptation acceptance by build?** Offer rates differ by Fire (598–785 per
~1,000 runs); acceptance under the whim policy is 37–49% and the at-choice
state of acceptors vs refusers is nearly identical (burnout 52.9 vs 54.9) —
i.e. the SIM accepts on whim, as designed, so acceptance ratios here carry
no signal about temptation *pull*. The real content finding is an offer-rate
outlier: **the lotus fires in under 1% of runs** (burnout ≥ 18 is almost
never true by Act I slot 4+). The "weak offer" is currently a no-offer.
Ticketed for the balance backlog rather than tuned blind — the right
threshold depends on how heavy early Despair should feel, which is a taste
call.

## The landmark-entropy measurement (P-B half 1 — the review's risk #2, as numbers)

What a player actually sees at each scheduled beat, 4,000 fresh-bard runs:

| Beat | Occurrence | Distinct readings | H (bits) | Top share |
|---|---|---|---|---|
| Cyclops | 100% of surviving runs | 2 (`ody_cyclops` / `_strong`) | 0.64 | 83.6% |
| Underworld | 100% of surviving runs | 1 (`→ ody_tiresias`) | 0 | 100% |
| Circe | ~22% of runs | 1 | 0 | 100% |
| Calypso | ~49% of runs | 1 | 0 | 100% |
| Lotus | < 1% of runs | 1 | 0 | 100% |

For the knowing bard (both fragments carried), the Underworld flips wholesale
to `→ ody_tiresias_oar` — real knowledge-gated variation, but deterministic:
H = 0 within each knowledge state.

Reading it honestly: **the review's "predetermined runs" worry is confirmed
at the scene level.** Four of five beats have exactly one reading; the fifth
shows its alternate face in 1 run of 6. The variation the game DOES have
lives in (a) whether a temptation is offered at all (state-gated occurrence
is genuine roguelike texture), (b) chosen side and rolled tier within the
one reading (up to 6 outcome texts per card), and (c) cross-run knowledge
(the Underworld's second face). Within-run scene variety is minimal.

These numbers are now enforceable floors (`test/odyssey-entropy.test.mjs`):
landmark occurrence, cyclops H ≥ 0.4 with both variants ≥ measurable share,
the flat beats pinned AS flat (so adding variants forces a deliberate floor
raise), and the knowledge-gated Underworld flip. **Half 2 — writing variants
into the measured gaps — is deliberately deferred until the playtest says
where predetermination actually hurts** (per the review's own restraint
rule). The entropy table above says the gaps are: Circe, Calypso, and the
Underworld's within-state reading.

## What telemetry cannot answer (and who can)

Named per the plan, so nobody mistakes green numbers for verdicts:

- **Comprehension** — can a player say what Might, Guile, Lore, Athena,
  Poseidon, Expedition, Nostos, Kleos mean after one run? → Pass 8 kit.
- **Story-vs-numbers** — do players choose on prose or optimize visible
  deltas? The sim has no eyes. → Pass 8 observation checklist.
- **Whether the fifth Cyclops stays interesting** — entropy counts readings;
  it cannot rate them. A 0.64-bit Cyclops could be plenty if the writing
  carries; a 3-bit one could bore. → humans.
- **Replay motivation** — does the prophecy cause a voluntary second run?
  → Pass 8's primary question.
- **Poseidon legibility** — the gradient is real; whether players SEE it is
  not measurable here.
