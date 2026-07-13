# Replay legibility — make the prophecy register

Output of a HITL playtest + `grilling` interview with the maintainer
(2026-07-13). This is the **plan of record** for the Pass-8 primary-gate
failure: it names the verdict, the diagnosis (with code evidence), the
decision, and the slices. Its parent vision is
[`NORTH-STAR-PLAN.md`](./NORTH-STAR-PLAN.md) (this is I8 + I9, pulled forward
because the playtest supplied their gate); the kit that produced the verdict is
[`PLAYTEST-KIT.md`](./PLAYTEST-KIT.md); the numbers it leans on are
[`SIM-FINDINGS.md`](./SIM-FINDINGS.md).

---

## The verdict — the primary gate failed

The kit's primary question outranks everything: *does anyone come back?* The
maintainer, playing to compare against **Reigns**, reported the **museum
signal** by name: *"I didn't feel really compelled to start a new run… there's
no real pull to do it again, and definitely not a third time."* Admired, did
not crave. Per the kit, that failure is what gates whether landmark variants
(P-B half 2) and the bard's-note (P-C) get built — and it redirects the work
to *why the pull is absent* before any new content.

The maintainer localized the absence himself: **not** within-run motion, but a
missing **overarching, persistent progression** — *"what I accomplished and
what I'm closest to accomplishing next… a trophy or secret unlocked… a
character I want to meet, a location not reachable last run but reachable now
because I unlocked something."* That is staff-review **risk 3** (thin
persistent knowledge), verbatim.

## The diagnosis — it's communication first, execution second

The cross-run ladder **exists** but is invisible at the decision moment, and
where visible it is bland. Code evidence:

- **Fragment banked** — a single notice line on *one* mid-run result overlay
  (the Underworld/Tiresias beat): *"The prophecy turns…"* No `1 of 3`, no
  checkmark, no "unlocked"; it reads as prose and flies past inside the overlay
  you are tapping through. `js/packs/odyssey/presenter.ts:358`.
- **The counter** — *"The bard carries N of the prophecy's three turnings"* —
  lives **only as a small foot line on the title screen**
  (`presenter.ts:68–74`), i.e. between runs, on a screen you reach only if you
  already chose to return. It is **absent from the run-end screen** — the exact
  moment the replay decision is made.
- **The true-ending hook** is the **last sentence of a ~90-word victory
  paragraph**, and only on a Nostos success (`presenter.ts:39`). Staff-review
  risk 1 predicts players skim result prose by run 2 — so it is buried where
  skimming eats it.

There is **no run-end progression surface at all.** The "what am I closest to
next" screen the maintainer wanted does not exist.

The reverence/no-pulse identity is the cause, working as designed: the shell
*already ships* the loud unlock grammar Reigns uses — `spawnConfetti` +
`sfx.win()` on `resultExtras.celebrate` (`js/ui/card.ts:786`), a `trophy-toast`
(`js/ui/endings.ts:316`), the `⚡ FLASHPOINT` foil badge (`card.ts:313`),
first-time-milestone tracking (`endings.ts:147`) — and Odyssey deliberately
opts out of every one, substituting the faint notice above. **The pop
machinery is built; the game declines to use it.**

Sim corroboration (`SIM-FINDINGS.md`): the mechanism is real but thin — the
whole ladder is three fragments → one hidden Oar Road ending; four of five
landmarks have exactly one reading; Kleos is a ratification, not a plan. The
sims cannot see legibility or pull — only the human playtest can, and it said
*no*.

## The decision

**A first (legibility), then B (depth) only if the re-test earns it.** This is
the repo spine — small reversible batches; do not build the irreversible thing
until the cheap thing has failed. The maintainer's stance: *"sure, A first, but
I'm sure we need B after."* The counter, held here deliberately: **A exists to
test that certainty.** A is built as the *instrument that measures whether B is
needed*, not a warm-up.

Two forks were closed in the interview:

- **Ladder floor is honest, not teased** (Q5a). The run-end ledger shows the
  ladder's *bottom* — `2 of 3 · one turning remains · then the truer ending`.
  The teased-horizon option ("the prophecy runs deeper than three…") was
  rejected: it writes a check B must cash and contaminates the test — we would
  never learn whether three rungs was enough. Honest floor makes the shortness
  **measurable**: replay dying at rung 1 (legibility was never the problem → B
  urgent) reads differently from replay surviving to the floor and dying there
  (B is "depth past three," and we will know the shape).
- **Odyssey-native loud, not borrowed confetti** (Q6a). The pop is built in the
  game's own idiom (fired clay / gold-fret / the frieze / the amphora shelf),
  never the music pack's confetti — which is INCIDENTS #7's flagship anti-goal,
  *"no confetti with a Greek accent."* Loud ≠ off-genre.

### Creative brief for the pop

Whimsical, loud, remarkable, eye-dazzling, feel-good — a cross-run
microinteraction the player is **drawn to and happy to see**, that makes them
feel good — *and* unmistakably Odyssey. Reigns' lesson: the unlock is a
component **categorically distinct from the story text**, so the brain flags
*event*, not *prose*. Ours must clear that bar in fired clay.

## Relationship to existing law — and why the law must change first

The reverence/no-pulse identity is not a bug to route around; it is the game's
moat (the staff review praised Odyssey for **not** being "a music game skin").
But two laws currently forbid the exact beat replay needs — the **Motion Law**
(ADR-0001, *"nothing pulses"*) and NORTH-STAR's *"ceremony, rationed."*
Precedent to renegotiate exists: NORTH-STAR already renegotiated ADR-0001's
motion clause for whimsy.

**INCIDENTS #7 is the binding constraint on *how* we amend.** Its root cause
was *"the design law lived in a doc, so the shell broke it twenty ways"* —
prose anti-goals no gate could enforce. Therefore the amendment (slice 1) must
land as an **executable check**, not a paragraph: a narrow, *licensed*
exception — *cross-run progress MUST register as a distinct, loud, non-prose
beat, in the pack's own idiom* — carved so it cannot be read as permission for
generic confetti, and pinned by a test/lint the shell cannot silently violate.

## Slices — small, reversible, named

### Slice 1 — the law amendment (ADR-0002), executable

- **Covers:** an ADR under `adr/0002-*.md` + a STYLE.md / NORTH-STAR pointer
  renegotiating "ceremony, rationed / nothing pulses" **for persistent progress
  only**; and — per INCIDENTS #7 — an executable guard so the license is a
  gate, not prose. Names the anti-goal it must not become (generic confetti).
- **Does not cover:** any player-facing behaviour. This slice licenses the pop
  and makes the license enforceable; it ships no pop.

### Slice 2 — the fragment-banked pop

- **Covers:** turning the faint `fragmentChime` notice (`presenter.ts:358`)
  into a real Odyssey-native beat — the turning visibly lands on a fired-clay
  shelf with a **filled slot** (the checkmark equivalent), motion + the
  god-pulse haptic that already exists in `alive.ts`. "Something happened"
  registers mid-run.
- **Does not cover:** the run-end summary (slice 3); any new fragment content.

### Slice 3 — the run-end ledger (the "what's next" screen)

- **Covers:** at run end, the shelf with **honest empty slots** — *"you carried
  home the sea turning · 1 of 3 · the third only reveals itself to a bard who
  already holds the other two."* The floor is visible (Q5a). This is the
  surface whose absence caused the verdict.
- **Does not cover:** content past three rungs. That is **B**, and it is built
  only if the re-test (below) earns it.

## Verification — the flow, not the feature (INCIDENT #1 law)

The new controls sit on/after **result and finale overlays** — progression-
gated surfaces — so they are driven **first**, not last. Required assertions in
`test/ui/smoke.mjs`: fire the fragment pop off a **live result overlay**,
dismiss it, and assert the run **still reaches the finale** (the portrait-
lightbox class of bug); then a knowing-bard run reaches the **ledger** and
still terminates. Goldens/sims are DOM-free and blind to all of this — the
Chromium finale-reached assertion is load-bearing, not a formality. The
slice-1 guard must be a real gate (INCIDENTS #7). Ship each slice only with the
full gate suite green and named.

## The re-test — what decides B

After A ships, **re-run the two-stranger kit** against the legible build (not
the maintainer's own reaction — maintainer bias: a legible ledger may pull
someone who already knows what fragments mean without pulling a naive player).
Watch specifically where replay dies:

- **dies at rung 1** → legibility was never the problem; B is real and urgent.
- **survives to the floor, dies there** → B is "depth past three," and the
  re-test names the shape.

Only then is B scoped. Until then it stays in the backlog, honest-floored.

---

- **verified ✓** — the museum-signal verdict and its cause (an invisible +
  bland cross-run ladder); that the loud-pop machinery and the I8/I9 ledger
  design already exist in-repo and are unused.
- **not verified ⚠** — that a *legible* three-rung ladder actually creates
  replay pull; the re-test measures exactly this and may still send us to B.
- **watch-out** — maintainer bias: a legible ledger may pull the maintainer
  (who knows the fragments' meaning) without pulling a naive player — trust the
  two-stranger re-test, not the author's own reaction; and INCIDENTS #7 — keep
  the pop Odyssey-native, never confetti with a Greek accent.
