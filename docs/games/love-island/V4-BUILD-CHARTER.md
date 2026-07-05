# v4 build charter — READ THIS FIRST

The pre-flight decisions for the v4 build, settled with Viktor in a grilling
session (2026-07-05). This is the **operating spec for an autonomous builder**:
every call here is *decided*, not open. Design rationale lives in
[`V4-DESIGN.md`](./V4-DESIGN.md), the medium analysis in
[`V4-LIVING-VILLA.md`](./V4-LIVING-VILLA.md), the research grounding in
[`V4-THEORY-REVIEW.md`](./V4-THEORY-REVIEW.md), and the resolved positioning call
in [`V4-POSITIONING-FORK.md`](./V4-POSITIONING-FORK.md). If any of those conflict
with this charter, **this charter wins** (it's the newest and the decided one).

---

## The core decision: C-engine, sequenced

**Run structure becomes data-driven, and love-island becomes a longer season
built from short "weeks."** But the engine change lands *first, on its own*, as a
behavior-preserving refactor — because the current 3-act ladder is hardcoded in
`engine.ts` (`advance()`), and that baked-in "3" is the last genre assumption in
the generic core. Generalizing it makes the engine serve arbitrary future
genres, which is the whole point of the neutral-engine vision.

## Session plan (three sessions minimum, each on a green base)

**Session 1 — Engine generalization only.**
- Replace the hardcoded 3-act ladder in `advance()`/`startAct()` with a
  **data-driven ordered list of N segments** declared in the manifest, each with
  a length, optional crossroads/commit slot(s), and a terminal finale. Keep it a
  *linear* list (no branching graph — YAGNI).
- **Behavior-preserving:** music + probe re-express their current 3-segment shape
  and consume RNG in the same order → **their goldens stay byte-identical.** That
  identity is the proof the refactor is pure.
- **Tripwire:** if *any* pack's goldens move in Session 1, that's a bug — stop and
  fix, never re-baseline.
- Ships nothing player-visible; unblocks everything. Becomes **ADR-0010**.

**Session 2 — love-island adopts the week structure (Option C).**
- Declare love-island's season as **N weeks** in the manifest (weeks = segments).
  The three show-phases (Arrival / The Turn / Final Week) still exist as the
  macro shape; weeks live inside/across them. A "week" = a run of quiet daily
  beats ending on a **tentpole** (bombshell / challenge / recoupling / Casa /
  Movie Night), placed with the existing set-piece + chain + forced-slot
  machinery and framed by the v3.2 beat grammar.
- **Length = a peak budget, not a minute budget** (peak-end rule): each week ends
  on a manufactured peak; protect the Final above all.
- Fold in the **Connection rename** here (display/copy only; internal `bond`
  resource id stays — `RESOURCE_META.bond.name` → "Connection" + strings).
- Re-baseline **love-island** goldens (deliberate — its own isolated commit +
  written justification). Ships the playable "it feels like a season now" slice.

**Session 3 — the hard new mechanics.**
- **Factional public**, **couple-web**, and the new content built on the weeks.
- Becomes **ADR-0011** (factional public) and **ADR-0012** (couple-graph drama
  manager). Re-baselines love-island goldens again (isolated + justified).

## Locked mechanics decisions

- **Factional public (Session 3):** exactly **three factions** — *Romantics*
  (stick together, forgive), *Self-Respect* (backbone, don't accept mistreatment),
  *Drama-lovers* (here for chaos, will adopt a villain). The finale clutch =
  **net approval across the three factions** (a chaos-villain who thrilled Drama
  but repelled Romantics lands mid-pack). A derived aggregate feeds the engine's
  existing single `momentumResource`, minimizing engine disruption. Modelled on
  Reigns' four-meter design (we use three). **Telegraph** which faction a card
  serves (reuse v3 "stakes-in" legibility) — an unreadable tradeoff isn't a
  choice.
- **Couple-web (Session 3):** cast **~6–8** (open ~6 = three couples, bombshells
  push toward 8); **2 foregrounded threads** at a time (plus your couple + the
  Rival — inside the 7±2 working-memory ceiling; Clarity Layer chunks the rest);
  **scripted-first drama manager**, NOT autonomous agents. NPC moves are authored
  beats surfaced by state + deck-weighting (Reigns "bag": a heating thread bloats
  the deck, then its cards are **removed** when it resolves). QA the graph on the
  four interactive-drama axes: **pacing, coherence, autonomy, dramatic arc.**
- **Connection, not Bond** (Session 2): the villa word, player-facing everywhere;
  engine id unchanged.
- **Deferred / out of scope for v4:** heterosexual villa format only (gender stays
  mechanical; queer/fluid = a future season variant); **four** playable Types
  (no fifth). Do not build into these.

## Autonomy & the merge gate

- **Self-merge on green — including golden re-baselines. No human merge gate.**
  The builder drives itself all the way to merged, per session.
- **"Green" (required before ANY self-merge):** `npm run build` → `lint-content`
  → `simulate --check` → `node --test` (goldens + invariants) → `ui-smoke` +
  `ui-crowding` + `ui-mobile-matrix`; **plus actually driving the game** to see
  the feature work (not just tests); **plus new tests** for any new system.
- **Golden discipline (the compensating controls, since no human reviews):**
  1. Never regenerate to force green. Make the change → run goldens → *expect
     specific failures* → confirm the diff is **only** those → then regenerate.
  2. Every re-baseline is its **own isolated commit** with a written
     justification of exactly what moved and why (auditable after the fact).
  3. **Non-regenerable gates are sacrosanct** — never weaken to pass:
     `simulate --check` (balance/reach), the **probe golden + `invariants.test.mjs`**
     (genre-neutral core — red here = real engine bug, full stop), and the UI
     drive-to-finale suites. These are the safety net now.
- **Mid-build forks:** *proceed-and-document* by default (pick the option most
  consistent with these docs + `VOICE.md`/`taste.mjs`, note it in an ADR/commit).
  **Hard-stop** (ship a guarded no-op stub + a loud open-ADR, don't fake it) only
  for: (1) a change to the **genre-neutral engine contract** (new shared type, an
  engine line naming a villa concept); (2) **overturning a decision locked in
  this charter**; (3) a **new player-facing identity element** the docs never
  sanctioned (new Summit / stat / win condition).

## The taste gate (blocking in Session 2, optional/post-hoc in Session 3)

Mechanics self-merge, but the **taste ceiling** is gated by a swipe review, since
no test grades wit:

1. Builder emits candidate writing as `public/taste-queue.json` (or `?queue=<file>`;
   schema in the app header) and points Viktor at
   **`/love-island/taste-review.html`**.
2. Viktor swipes: right = keep 👍, left = cut 👎, up = ⭐ love (exemplar), + notes.
3. Verdicts return with **no backend** — copy→paste into chat, one-tap prefilled
   GitHub commit (owner-authenticated; the page holds no credentials), or download.
4. Builder ingests: keep 👍, cut/revise 👎 (use notes), promote ⭐ into
   `GUIDING_EXAMPLES.md`, fold recurring 👎 clichés into `taste.mjs` so the floor
   rises each batch. In **Session 2** this is *blocking* (writing waits for the
   pass); in **Session 3** it is *optional and post-hoc* (see below).

Also grow `VOICE.md` for the new card types, and self-critique a full sample
season via `simulate-pack.mjs` before merge.

### When Viktor comes in (checkpoints)

- **Session 1 — never.** Pure engine refactor, no new writing. Fully hands-off.
- **Session 2 — once, blocking**, after the week's new writing (daily beats,
  tentpole framing, week transitions, Connection copy) is drafted. The builder
  pauses here and waits for Viktor.
- **Session 3 — OPTIONAL, post-hoc. No checkpoint, no pause.** Session 3 builds
  to **total completion and self-merges everything, including content** — it does
  NOT wait for Viktor. It still *emits* the `public/taste-queue.json` batch(es)
  (per system, so a later reviewer gets short sets) and leaves the review URL in
  its wrap-up, but the queue is a **standing invitation, not a gate**. Viktor's
  taste feedback **might** come afterward as a **separate new session** that reads
  the returned verdicts and revises (cut/revise 👎, promote ⭐, grow `taste.mjs`)
  in a follow-up pass. Because there's no human gate on Session 3 content, the
  builder must lean harder on its own defenses: obey the `taste.mjs`/`lint-content`
  floor, grow `taste.mjs` + `VOICE.md`, and self-critique a full sample season via
  `simulate-pack.mjs` before merging.

**At a Session 2 checkpoint (blocking):** draft the batch → write
`public/taste-queue.json` → **notify Viktor with the review URL and BLOCK** — do
not finalize or merge that content until his verdicts return (async: pasted into
chat, committed to `taste-feedback/`, or downloaded). Then ingest and merge.
**Session 3 skips the block entirely** — emit the queue, merge on green, move on.

## Definition of done, per session

Green (full gate above) + self-merged + goldens either byte-identical (S1) or
re-baselined-with-justification (S2/S3) + the ADR written. Taste: **S2** content
has cleared its blocking review pass; **S3** is built to total completion and
self-merged with `taste-queue.json` batch(es) emitted for an *optional* later
review session (no pass required to call S3 done).

---

*Provenance: pre-flight grilling with Viktor, 2026-07-05. This charter is the
authoritative build spec; the other v4 docs are its rationale.*
