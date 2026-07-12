# Incident log

The standing record of escaped defects — bugs that reached a build or the
deployed app instead of being caught by a gate. Per rule 7 of the
[working agreement](./WORKING-AGREEMENT.md), every escaped defect closes out
here, with a rule and (where possible) a test that would have caught it. Newest
first.

Each entry: what broke, the 5-whys root cause, the **rule** it produced, and the
**guard** (test/hook/type) that now makes it non-recurring.

---

## #7 · The design law lived in a doc, so the shell broke it twenty ways — 2026-07-12

**Severity:** shipped defects (main auto-deploys), all on the odyssey, none
gamebreaking singly, identity-breaking together: every `incredible` result
fired the siblings' confetti; every bad result shook the card and flashed the
scrim red; results, ceremony beats, act cards and screen transitions eased in
with overshoot bounce; the Despair vignette pulsed; the encore bar shipped
music copy and an infinite shimmer — all directly against the NORTH-STAR's
flagship anti-goal ("no confetti with a Greek accent") and the Motion Law
(ADR-0001). Plus behavioural strays the gates were blind to: a bard beat
Escaped mid-reveal left a capture listener squatting `#overlay` that swallowed
taps on later overlays; the tableau was keyboard-operable behind a result
overlay and would have destroyed its pending `advance()` (the #1 lightbox
class); a resumed boot never counted as kindled, so the title re-veiled after
that run ended; the crowd's cross-run no-repeat quietly died after one full
cycle; a landmark deal spent a bard line it never spoke.

**Symptom:** none reported — found by this cleanup sprint's adversarial
review (six lenses + refutation verify), all while every gate was green.

**Root cause (5 whys):**
1. Why did the shell's juice run on the odyssey → the shell applies its
   result/transition juice universally; the pack never opted out because no
   opt-out seam existed.
2. Why did no gate catch it → the Motion Law's anti-goals were prose in
   NORTH-STAR.md/ADR-0001; every executable check pinned what the pack ADDED
   (stroke, stills, frames), none pinned what the shell must NOT do.
3. Why were the behavioural strays invisible → the suites drive happy paths
   to endings; none Escaped a beat mid-reveal, pressed Enter on the tableau
   under a modal, returned to the title after a resumed run, or played enough
   meta-runs to exhaust the memory pool.
4. Why did the sprint find them at once → fresh-context adversarial review
   reads the LAW first and the code against it — the writer had read the code
   first and the law as a checklist of features to add.
5. Why does the class recur (see #1, #5, #6) → a rule that matters was
   commentary, not a test — the repo's own second law, unapplied to the
   design-law layer.

**Class:** design law without an executable negative — invariants that name
what must NOT happen, left as prose while the gates only pinned what must.

**Rules produced:**
- **A design law gets a NEGATIVE probe**: for every "the pack never Xes",
  a gate must drive the shell into the X path and assert silence/stillness —
  the law is identity, not an accessibility mode, so it is asserted under
  full motion, not only under reduced-motion prefs.
- **The shell's juice is a seam, not a constant** (`feel.resultJuice`): a
  pack retires it in one declared place, and its stylesheet retires the same
  moves (belt and braces — neither the work nor the paint happens).
- A listener added to a PERSISTENT node (`#overlay`) dies with its overlay
  (AbortController in `onClose`) — `openOverlay` tears down only its own.
- Content behind an `aria-modal` overlay is inert in fact, not just in
  markup: interactive tableau/stage controls no-op while any overlay is up.

**Guard (now in place):** the motion-law probe in `test/ui/smoke.mjs`
(computed styles on the shell's juice classes: confetti `display:none`,
rise/shake/morph/chip/notice/screenIn `animation: none`, the released card's
`steps()` snap-back — under full motion); the escaped-beat pin (Escape a
paced beat, then the next overlay must hear its first tap); the tableau-inert
pin (activate the tableau behind a live result overlay, the overlay must
survive); the stays-lit pin (ending → 🏠 Title after a resumed boot);
`test/odyssey-sound.test.mjs` pins the EVENTS routing TABLE (exactly one
voiced shell cue); `test/odyssey-memory.test.mjs` pins the heard-cycle reset,
the landmark refund, and the final-queued-line exclusion; the worst-cards
guard already priced the (re-voiced) encore bar into the 320px budget; and
`test/ui/mobile-matrix.mjs` gained the ADR-0009 ambient budget with a tableau
present, a tableau-visibility assertion, and the incident-#6 pairing pass
(stale pack sheet beside an agreeing style.css must heal via the per-sheet
stamp — key derivation now single-sourced in `js/css-key.ts`, pinned by
`test/css-stamp-key.test.mjs`).

## #6 · The fire went blank: dialogue hidden by CSS, revealed only by JS, on a client running mixed deploys — 2026-07-11

**Severity:** shipped defect (main auto-deploys), gamebreaking-adjacent on the
flagship surface: the odyssey bard beat rendered its scene and kicker but ZERO
dialogue on a real iPhone; a tap skipped to the next screen, so the player
lost every fireside line.

**Symptom:** player report with screenshot — "No text at all at fires now.
I've waited for 10 seconds. And if I tap I just go to next screen." All local
gates and CI were green; the deployed pairing worked in every Chromium pass.

**Root cause (5 whys):**
1. No dialogue → the lines sat at the stylesheet's BASE `opacity: 0`,
   waiting for a `revealed` class that never came.
2. Why no reveal → the device paired the NEW `odyssey.css` (reveal keyed on
   `revealed`) with an OLD cached `js/` bundle (which staggers via
   `--beat-i` animation delays and never adds `revealed`). Old JS also has
   no jump-tap handler, so the tap hit the overlay's dismiss — "tap → next
   screen".
3. Why could the deploys mix → HTML, CSS and JS cache and evict
   independently on phones (Pages' max-age 600 HTML + iOS's aggressive
   eviction): a cached HTML re-fetched an evicted `odyssey.css?v=old` — the
   server ignores the query and returns the NEWEST sheet — while the still-
   cached old JS was served locally.
4. Why didn't the boot probe heal it → `healStaleStylesheets` verified ONE
   stamp, `--bb-css-v` in `style.css`; the client's `style.css` agreed with
   its JS, so the probe passed while the PACK sheet was from another deploy.
   (And in this skew direction — old JS, new CSS — refetching CSS cannot
   converge anyway; only degrading gracefully can.)
5. Why was the failure total rather than graceful → the reveal design made
   HIDDEN the stylesheet default and VISIBLE conditional on same-deploy JS —
   an implicit cross-file, cross-deploy coupling nothing checked.

**Class:** cross-deploy coupling between independently-cached files — CSS
whose base state hides content that only matching-deploy JS can show. (Kin of
the `:has()` and stale-stylesheet rules: the delivery, not the code, is the
platform.)

**Rules produced:**
- **A stylesheet may only HIDE content under a class that the same deploy's
  script adds** (here: `pending`). The default, scriptless rendering of any
  text surface is VISIBLE — any deploy skew degrades to "everything shows at
  once", never to an empty screen.
- A reveal clears its hiding mark with an inline style (`opacity: 1`), so no
  cached class-rule pairing can strand a revealed line.
- Paced interaction feature-detects its stylesheet (does `pending` actually
  hide?) before spending the player's taps on invisible steps.
- Every shipped sheet carries its own per-file stamp (`--bb-css-v-<name>`),
  and the boot probe verifies each loaded sheet individually — a pack sheet
  can go stale independently of `style.css`.

**Guard (now in place):** fix — `.bard-line`/`.tap-hint` hidden only via
`.pending` (shell-added), reveal via pending-clear + `revealed` (one-generation
compat with the transition-era sheet) + inline opacity, pacing gated on a
computed-style probe; `tools/build.mjs` stamps every sheet, and
`healStaleStylesheets` checks per-sheet stamps. Tests — the SKEW-LAW probe in
`test/ui/smoke.mjs` (an un-marked bard line must compute `opacity: 1`; the
pending mark must be doing the hiding on the live beat), and
`test/ui/mobile-matrix.mjs`'s static delivery gate now requires the per-sheet
stamps to exist and agree with `CSS_CONTRACT`.

## #5 · Odyssey finale card's prompt clipped at 320px — and the gate only sometimes saw it — 2026-07-11

**Severity:** shipped defect (main auto-deploys), cosmetic-but-flagship: the
Suitors' Hall card — the run's climax — internally scrolled its prompt on the
smallest phones, under late-run chrome.

**Symptom:** `test/ui/mobile-matrix.mjs` failed on odyssey @ 320×568 with
`card "Your own hall — the last door": prompt clipped (203 > 179)` — but only
on SOME runs of the suite. The defect had been reaching `main` green.

**Root cause (5 whys):**
1. The prompt clipped → `ody_hall_nostos` carried a 323-char prompt on a card
   that also wears the set-piece ribbon, the hot-streak banner, the encore
   bar, and two carried chips — the tallest chrome any odyssey card gets.
2. Why so long → the epic breath leaked from narration into a PROMPT;
   VOICE.md law 3 ("prompts and labels stay middle-length so 320px never
   chokes") was a named bet with no executable check.
3. Why did the gate only sometimes fail → the matrix drives seasons off
   RANDOM seeds; whether the hall card is audited under its worst chrome
   (streak banner up, encore banked) varies run to run.
4. Why was the coverage probabilistic → the suite equated "a full season
   drove through" with "the worst case was seen"; the worst case is a
   *specific* card × *specific* run state, which random seasons only sample.
5. Nothing enumerated the worst case → no pass ever asked "which cards are
   the tallest, and do they fit under maximum chrome?"

**Class:** a probabilistic gate certifying a deterministic invariant; a
voice-law length rule ("middle-length prompts") that lived as prose.

**Rules produced:**
- A layout invariant over authored content is checked against the WORST
  authored instance deterministically, not against whatever a random season
  happens to deal.
- When a gate's failure depends on run state (banked encore, streak, carried
  chips), the guard pins that state explicitly.

**Guard (now in place):** fix — the two Suitors' Hall prompts trimmed to
middle-length (VOICE law 3's own remedy; golden-safe, prompts are not
serialized). Test — `test/ui/mobile-matrix.mjs` Pass 1c force-deals each
pack's five longest-prompt cards through the app's own resume path
(`currentEventId`, the smoke bard-check precedent) at 320×568 with worst-case
run state patched in (hot streak, banked encore, the pack's carried flags)
and runs the full generic audit on each. Verified red on the old prompt,
green on the trim — and on its first red run the guard surfaced two MORE
shipping instances of the same class that no random season had caught
(`ody_cyclops`, 357 chars, and music's `nr_nemesis_toast`, 434 chars), both
trimmed in the same fix. Dev loop: `BB_MATRIX_ONLY=worst` runs just this
pass.

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
