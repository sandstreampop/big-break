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

<!-- Template for the next entry — copy above this line.

## #N · <title> — YYYY-MM-DD

**Severity:** …
**Symptom:** …
**Root cause (5 whys):** 1… 2… 3… 4… 5…
**Class:** …
**Rules produced:** …
**Guard (now in place):** fix … / test … / hook or type …
-->
