# Incident log

The standing record of escaped defects — bugs that reached a build or the
deployed app instead of being caught by a gate. Per rule 7 of the
[working agreement](./WORKING-AGREEMENT.md), every escaped defect closes out
here, with a rule and (where possible) a test that would have caught it. Newest
first.

Each entry: what broke, the 5-whys root cause, the **rule** it produced, and the
**guard** (test/hook/type) that now makes it non-recurring.

---

## #3 · Odyssey "THE UNDERWORLD" set-piece title clipped on every phone — 2026-07-11

**Severity:** cosmetic but flagship-surface (no soft-lock). Shipped to the
deployed Odyssey build: a landmark's full-screen title card — the loudest
framing surface the game has — rendered as "THE UNDERWO" with the rest cut off.

**Symptom:** the Underworld landmark's full-screen beat clipped its banner
horizontally at every phone width (390px of text in a ~236px card interior at
320px; still clipped at 412px). Every gate stayed green.

**Root cause (5 whys):**

1. The title clipped → the beat banner rendered at 30px in Odyssey's
   `Press Start 2P` face (~1em per glyph) plus the deep's `.3em` tracking —
   "UNDERWORLD" alone is 10 unbreakable glyphs ≈ 390px.
2. Why 30px → `css/odyssey.css` re-sized `.set-piece-banner` (the slim ribbon,
   12px) for the wide face but never the full-screen variant; `style.css`'s
   higher-specificity `.sp-beat .sp-beat-banner { font-size: 30px }` won there.
3. Why did no gate see it → `test/ui/mobile-matrix.mjs` audited the overlay
   card's *bounding rect* only. The card's `overflow-y: auto` computes
   `overflow-x` to `auto`, so oversize content clips *inside* the card —
   the rect and the document scrollWidth never move.
4. Why was the invariant rect-based → "overlays fit the viewport" was written
   when overlay text was prose that wraps; a fixed-advance display face with a
   long single word is a new content class it never anticipated.
5. Nothing measured intra-container overflow → clipping inside a scrollable
   box is invisible to every rect check by construction.

**Class:** re-skinning a shared component per-pack without covering every
variant of it; content clipped inside a scroll container is invisible to
rect-based layout audits.

**Rules produced:**
- A pack that re-themes a shared component with a wider or fixed-advance
  display face must size **every variant** of that component (slim ribbon AND
  full-screen beat), and the longest unbreakable word must fit the smallest
  supported phone — in every text-size mode (big-text zoom shrinks the
  effective interior).
- Layout audits measure `scrollWidth` vs `clientWidth` inside overlays, not
  just bounding rects — a card can "fit the viewport" while eating its content.

**Guard (now in place):**
- Fix: `css/odyssey.css` sizes `.sp-beat .sp-beat-banner` for the pixel face
  (17px; 14px under `body.big-text`), verified by driving a real season to the
  Underworld beat at 320×568 in both modes.
- Test: `test/ui/mobile-matrix.mjs` — any active overlay whose box
  `scrollWidth > clientWidth + 1` is a violation. Verified red on the old CSS
  (all odyssey cells, every viewport) and green on the fix, with music and
  love-island unaffected. A dedicated big-text pass toggles the 1.18× zoom at
  every set-piece beat of an odyssey season at 320px and requires the box
  unclipped — so the text-size half of the rule is executable too. (A whole
  big-text *season* is not gated: the mode has pre-existing vertical-layout
  debt at 320px — buttons below the fold under zoom — its own remediation.)

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

## #4 · Offline was silently dead for every game — 2026-07-10

**Severity:** shipped defect, all three games, duration months (since the
`js/data/*` refactor). The README promised "works offline as a PWA"; no game
delivered it.
**Symptom:** no offline support anywhere — the service worker never
installed. Found by the review-mandated device pass (Required #4), the first
time anyone actually cut the network and reloaded.
**Root cause (5 whys):**
1. Offline reload failed → the service worker was not controlling any page.
2. The worker never installed → `cache.addAll(CORE)` rejects if ANY entry
   404s, and install aborts.
3. 20 of 32 CORE paths were stale → the list froze the pre-refactor layout
   (`js/data/events.js`, `js/charts.js`, …) and nothing updated it when the
   pack split moved every file.
4. Nothing surfaced the failure → SW install errors are silent by design
   (`.catch(() => {})` at registration; install rejection just leaves the
   old/no worker), and no gate ever loaded the site offline.
5. Two of three games ALSO never registered the worker at all (love-island
   deliberately "online-first for now", odyssey by omission via createGame) —
   so even a correct CORE would only have covered music.
**Class:** a hard-coded manifest of another subsystem's file layout, with a
failure mode that ships silent; a README claim no gate verified.
**Rules produced:**
- A precache list is a CONTRACT with the build output: it gets an executable
  existence check, not hope.
- Install must degrade per-entry, never abort-on-one (`Promise.allSettled`,
  not bare `addAll`).
- A capability the README claims (offline, resume, daily isolation) gets a
  scenario in the device pass (`tools/device-pass.mjs`).
**Guard (now in place):** fix — `sw.js` CORE rewritten to real files + per-
entry resilient install + per-game navigation fallback; all three entries
register the shared root worker. Test — `test/sw-core.test.mjs` (every CORE
path exists in dist/, no bare addAll, every entry registers). Evidence —
`tools/device-pass.mjs` scenario C cuts the network in real Chromium and
plays a run offline.

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
