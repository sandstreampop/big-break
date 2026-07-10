# Incident log

The standing record of escaped defects — bugs that reached a build or the
deployed app instead of being caught by a gate. Per rule 7 of the
[working agreement](./WORKING-AGREEMENT.md), every escaped defect closes out
here, with a rule and (where possible) a test that would have caught it. Newest
first.

Each entry: what broke, the 5-whys root cause, the **rule** it produced, and the
**guard** (test/hook/type) that now makes it non-recurring.

---

## #2 · Love Island Angles announced but never equipped — 2026-07-09

**Severity:** feature-dead (not a soft-lock). Shipped to the deployed Love
Island build: the whole Angle/Edit progression layer was inert in the browser.

**Symptom:** winning an Angle at the daybed showed the "🧰 it's yours" notice,
but the Angle never appeared in the Edit slots — no roll bonuses, no per-week
compounding, no villain-edit flavor. Every gate stayed green.

**Root cause (5 whys):**

1. The Angle never took effect → it was never pushed onto `run.accessories`.
2. Nothing pushed it → the shell's only equip path is `PRES.equipItem?.(…)`
   (optional presenter hook), and the Love Island presenter never implemented
   `equipItem` — the optional chain made the miss silent.
3. The sims didn't catch the dead layer → the "genre-neutral" sim driver
   (`tools/pack-core.mjs`) had a leak: it imported **music's** `equipAccessory`
   and hand-equipped pending gear for *every* pack — so the balance gates and
   goldens simulated a game where Angles worked, while the browser played one
   where they didn't.
4. The leak existed because the driver predated the presenter's `equipItem`
   seam and was never rewired when the seam landed.
5. No gate compared the sim's equip path with the shell's — the two paths were
   allowed to diverge silently.

**Class:** sim/browser divergence — a tool simulating a *different game* than
the shell plays; a genre import inside a genre-neutral tool; an optional hook
whose absence is silent.

**Rules produced:**
- A genre-neutral driver must exercise the SAME pack seam the shell uses
  (`presenter.*`), never a pack's internals by import — otherwise the gates
  certify a game nobody is playing.
- A pack whose plugins emit a shell channel (here `pendingGear`/
  `pendingGearChoices`) must implement the hook the shell answers it with
  (`equipItem`) — enforced, not assumed.

**Guard (now in place):**
- Fix: `js/packs/love-island/presenter.ts` implements `equipItem` (drop →
  slot-cap → push, music-equivalent semantics); `tools/pack-core.mjs` equips
  through `pack.presenter.equipItem` and imports nothing from any pack.
- Test: `test/invariants.test.mjs` — for every registered pack, if any seeded
  run grants gear, `presenter.equipItem` must exist **and** the granted item
  must actually land in `state.accessories` (counted end-to-end by the
  driver's `gearGrants`/`gearEquipped`).

---

## #1 · Portrait-lightbox soft-lock — 2026-07-07

**Severity:** gamebreaking (soft-lock). Shipped to the deployed Love Island
build; no data loss.

**Symptom:** opening a contestant portrait from a **result** overlay and tapping
to close it dead-ended the run — no press advanced the game.

**Root cause (5 whys):**

1. Closing the lightbox closed the screen under it → it rendered into the single
   shared `#overlay` node.
2. That destroyed the overlay beneath it → the overlay engine (`openOverlay`) is
   a strict singleton per node: on open it wipes the node and drops the previous
   overlay's listeners.
3. It became a *soft-lock*, not a closed panel → the result overlay's `onClose`
   is what calls `routeAdvance(engine.advance(run))`; it never ran, so the run
   had no next card and no live overlay.
4. Nobody caught the invariant → "one overlay at a time; never nest on
   `#overlay`" lived only in a code comment.
5. Tests missed it → verification exercised the *benign* path (the stage
   inspector, which isn't progression-gated) and asserted *the image renders*,
   never the *gated* path: result → lightbox → continue.

**Class:** verifying *presence* instead of *behaviour*; testing the benign
surface instead of the gated one; an invariant that lived in a comment.

**Rules produced:**
- Rule 1 — verify behaviour, not presence; drive new controls on gated surfaces
  first (also in `CLAUDE.md`, "Ship UI the way it's played").
- Rule 2 — invariants are executable, not commentary.

**Guard (now in place):**
- Fix: the lightbox renders on a dedicated top layer (`#overlay-top`) via
  `openOverlay(..., { host })`; closing it can't tear down the overlay beneath.
- Test: `test/ui/smoke.mjs` opens the lightbox off **live result overlays**,
  asserts it stacks on `#overlay-top` while the parent survives, closes it,
  confirms the parent is still up — then the existing "must reach the finale"
  assertion catches any soft-lock. Runs for both games in CI.

---

## #3 · The Cyclops could be lost to a late temptation — 2026-07-10

**Severity:** shipped defect (main auto-deploys), low frequency (~0.2% of
runs), high narrative cost: the run's defining landmark never occurs and the
crossroads poses the name-question before the cave that raises it.
**Symptom:** in 2 of 1,000 seeded runs, the telling reached Act II without
ever meeting the Cyclops. Found by the Pass 6 strategy-telemetry sweep
(2026-07 odyssey review), not by any existing gate.
**Root cause (5 whys):**
1. The Cyclops window ('end' of Act I) sometimes dealt the lotus instead →
   both beats were *due* at the last slot and the itinerary picked the FIRST
   due beat in chronological declaration order (lotus, at slot 4, precedes
   cyclops).
2. Why was the lotus due that late? Its `requires` (burnout ≥ 18) can first
   become true at the act's final slot — a window that OPENS at slot 4 stays
   open all act.
3. Why wasn't the Cyclops recovered? Roll-forward re-deals an unfired beat at
   the next act's first slot — but the landmark card is act-scoped
   (`act: 1`), so Act II's eligible pool never contained it. "A landmark is
   never lost" was a comment, not an invariant.
4. Why did every gate miss it? The landmark tests drive seeds/policies that
   never produce late-flipping lotus requires; the golden corpus (24 seeds)
   contained no colliding seed; the balance gate counts outcomes, not beats.
5. Why did the collision class exist at all? Beat priority conflated
   *chronology* (when windows open) with *precedence* (who owns a contested
   slot).
**Class:** an invariant living in a comment; a rare-path collision no
existing oracle sampled densely enough to hit.
**Rules produced:**
- A scheduling invariant ("X always occurs") must be asserted over a sample
  DENSE enough to catch its rare-path collisions (the entropy suite runs
  1,000 seeded careers), not just a handful of happy seeds.
- When two scheduled beats contest one slot, precedence is an explicit rule,
  never list order.
**Guard (now in place):** fix — `js/packs/odyssey/itinerary.ts` deals the
LATEST-due beat (the landmark's 'end' slot is the act's maximum, so it can
never be displaced; the late temptation expires with its act, as an
unaccepted offer should). Test — `test/odyssey-entropy.test.mjs` asserts
landmark occurrence ≥ runs-that-reach-the-window across 1,000 seeded runs,
plus the variant-entropy floors.

<!-- Template for the next entry — copy above this line.

## #N · <title> — YYYY-MM-DD

**Severity:** …
**Symptom:** …
**Root cause (5 whys):** 1… 2… 3… 4… 5…
**Class:** …
**Rules produced:** …
**Guard (now in place):** fix … / test … / hook or type …
-->
