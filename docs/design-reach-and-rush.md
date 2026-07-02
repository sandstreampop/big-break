# BIG BREAK — Reach & Rush

*Design doc, 2026-07-02. Source data: `telemetry/coverage.md` +
`telemetry/latest.json` (pull `d7629fd`, 23 human runs) and a 4,000-run
reachability simulation through the real engine (permissive narrative
policy: random genre/venue picks, 15% comeback runs).*

The felt problem, in the owner's words: *"runs feel samey; there is not
enough variance, novelty, dopamine-spiking RNG moments — and I feel like
there are scenarios I never get to experience."* The data says that
feeling is accurate, and it says why. This doc turns it into three
workstreams: **Reach** (make the content that exists fire), **More**
(grow the pool where repetition actually happens), and **Rush** (make
randomness spike instead of hum).

---

## 1. What the data says

### The invisible third of the game

- Humans have seen **166/209 cards**; all **43 never-reached cards are
  gated** (flags, thresholds, picks). No dead ungated cards exist — the
  authoring is fine, the *scheduling* is not.
- The 4,000-run sim confirms it's structural, not player skill:
  **13 cards never appear even once in 4,000 runs**, 29 appear in <1%
  of runs, and **64 of 209 cards (31%) appear in <5% of runs**. At the
  observed human pace (~19 runs so far), "<5% of runs" means *most of
  this content will never be seen by anyone, ever*.
- Whole authored arcs are dark: the shed sessions
  (`a2_shed_nights → a3_shed_album/doc/collab/someone`), the documentary
  arc (`docu_crew → docu_gold/dirt`), the Bloom arc, collab reprises,
  truce/diss rivalry extremes, superfan chains, `sm_birthday`,
  `a3_dedication`. These are the game's best "my run was different"
  material — and they effectively don't exist.

### The samey skeleton

- Three cards appear in **every** run, human and sim alike: the act
  shops (`a1_pawn_shop`, `a2_shop_gearhead`, `a3_shop_last` — 100% of
  human runs, ≥80% of sim runs). Add the fixed finale trio, `coping_50`,
  and the identical act rhythm (8/12/8 with the shop forced at the same
  slot) and every run shares the same spine.
- Act 1 has only **34 cards** (vs ~90 each for acts 2/3). Eight draws
  from ~25 eligible means act 1 — the first thing every player
  re-experiences — has the highest repeat rate in the game.
- Run length is locked: every human run ended at 29–32 cards. Nothing
  ever shortens, lengthens, or interrupts a career.

### The flatline (why there's no rush)

Swipe-tier distribution by act (human data):

| act | bad | good | incredible |
|---|---|---|---|
| 1 | 10% | 82% | 8% |
| 2 | 4% | 76% | 19% |
| 3 | 4% | 53% | **43%** |

By act 3, **the jackpot tier fires almost every other card** and the
punish tier has vanished. Incredible can't spike when it's the second
most common outcome; Bad can't scare when it's a 1-in-25 event. The
roll math explains it: late-game stats push `rollBase 14 + aptitude×0.8`
far past `tierIncredibleAt 75`, jitter (±15) can't reach the Bad band,
and the pity brake removes losing streaks. We built a smoothness machine
and are surprised it feels smooth.

### Nobody can lose (12+ content pieces behind a locked door)

0 failures, 0 gameovers in 23 runs — so the **3 gameover endings, 6 exit
interviews, 3 finale-failure endings, `debt_collector` (+ its 5-card
`db_*` chain), `coping_song`, and every fail-adjacent trophy** are
unreachable in practice. Difficulty is a *content* problem: the fear
content is authored and dark.

### Threshold gates the balance never produces

Every threshold-gated card waits for a state the current tuning avoids:
`moneyMax:-1` (nobody goes broke), `rivalryMin:8` / `rivalryMax:1`
(rivalry sits mid-band), `burnout`-driven `coping_song` (burnout stays
low), `venueLevelMin:2`, `hustleMin:2`, `chartingMin:1` **in act 1**
(`a1_first_review` — near-impossible timing), `nemesis` (needs 3
meta-run meetings), `bandHas:<specific>` with no recruit steering.

### Suspected dead wiring (verify before designing around it)

`a3_blooper` (`mg_botched`), `a3_golden_hands`, and
`a3_nemesis_soundcheck` are at **0 in both** human data and 4,000 sim
runs — check the flags are actually set anywhere before trusting the
gate design. Conversely `f_*`/`db_*` cards were seen by humans but never
by the sim — the simulator doesn't model their trigger, which means
`tools/simulate.mjs` currently can't validate parts of this doc
(fix in §5).

---

## 2. Workstream REACH — make existing content fire

**R1 — Story Seeds (the arc scheduler).** At `newRun`, roll **2 hidden
seeds** from the arc-setup table (docu, shed, bloom, collab, someone,
superfan, tv, hustle, band). A seeded arc's *setup* card gets a
guaranteed slot in act 1/2 (same mechanism as `CONFIG.shopSlot`); once
its flag is set, its *payoff* cards get a weight multiplier (reuse
`pathWeightMult`-style boost, ~×3). Compound math today:
setup draw (~25%) × flag side (~50%) × payoff draw (~15%) ≈ **2% per
arc per run**. With seeds: ~**65–80%** that a seeded arc completes ⇒
every run develops 1–2 arcs, different ones each time. This single
mechanic attacks *reach*, *samey*, and *novelty* at once.

**R2 — Personal novelty weighting.** Track seen-card ids per player
(`meta.seenCards`, capped set). Unseen cards draw at **×1.75 weight**.
First runs are untouched (everything is unseen); by run 10 the deck
actively steers toward what *this player* hasn't experienced.

**R3 — Threshold re-tune.** Move gates into bands the balance actually
produces (validated against sim percentiles): `rivalryMin 8→6`,
`rivalryMax 1→2`, `hustleMin 2→1`, `a1_first_review`'s `chartingMin`
gate moves to acts 1–2, `a3_nemesis_soundcheck` also accepts
`rivalryMin:7` in-run (nemesis stays as a bonus text variant), venue XP
+50% so `venueLevelMin:2` is reachable by mid-act-3. Bandmate-specific
cards (`bandHas`) get their bandmate offered in the recruit pool
whenever the card is still unseen (novelty steering, R2's data).

**R4 — Difficulty repair unlocks the fear content.** Separate balance
pass (owned by `js/config.js`, validated with
`node tools/simulate.mjs 4000 narrative`): target the telemetry.md band
of **25–40% success**. Levers: `actWear` up, `winGates` up slightly,
money economy tightened so `debt` is a real state. Acceptance is
*content-based*: each gameover ending, each exit interview, and
`debt_collector` observed in telemetry within two weeks of ship.

**R5 — Fix the wiring.** Verify/repair `mg_botched`, `a3_golden_hands`,
nemesis flag paths; add the missing `f_*`/`db_*` triggers to the
simulator so structural reach is testable.

---

## 3. Workstream MORE — grow content where repetition lives

**M1 — Act 1 expansion: +14 cards (34→48).** Act 1 is both the thinnest
pool and the most-replayed real estate. Brief: low-stakes, high-flavor,
broke-musician material; ≤⅓ gated; at least 4 cards that *set* arc
flags so Story Seeds have more distinct openings.

**M2 — Scene Weather: 12 run mutators.** One visible modifier rolled at
run start ("Festival Season: venue shows +2 fame", "Label Merger:
contracts pay ×2 LP", "Vinyl Revival: physical sales boom", "Streaming
Crash"…). A mutator recolors *every* card it touches — 12 mutators
multiply run identity without writing 12 decks. Also becomes the
Daily/Gauntlet variety knob (dailies pick from the same table).

**M3 — Authoring rules (so new content stays reachable).**
Every new flag ships with ≥2 setup sources *and* ≥2 payoffs; gated share
of any act pool ≤45%; every threshold gate must sit inside the sim's
p10–p90 band for that stat; every new arc registers in the Story Seeds
table. Enforced by a lint step in `tools/content-lint` (it already
audits content; extend it).

**M4 — Targets.** Cards 209→260 (act 1 +14, flashpoints +10, arcs +2
with ~12 cards, mutator-reactive variants as needed); mutators 0→12;
every ending/exit reachable. Coverage report is the scoreboard.

---

## 4. Workstream RUSH — spikes, not noise

**U1 — Fix the tier economy.** Incredible should be a *event*, not a
default: raise `tierIncredibleAt` 75→82 and add soft diminishing
returns above roll 90 → target **≤15% Incredible in act 3** (from 43%),
with payloads buffed ~+25% so rarer × bigger ≈ same EV, higher variance.
Keep Bad reachable late (raise `jitterMax` to ±20 or scale jitter with
act) so act 3 isn't consequence-free. Validate the band with the sim's
`tiersByAct` output.

**U2 — Flashpoint cards (~10).** A new rare class: `flashpoint: true`,
max **1 per run**, ~25% of runs contain one. Huge swings both ways
(±25–35 stats, money windfalls/wipeouts, instant hit or scandal), unique
foil frame + sting sound so the moment is *legible*. These are the
stories players retell — "the séance gig", "the wire-transfer prince",
"the stadium blackout".

**U3 — Hot-streak loop.** Three non-Bad tiers in a row lights a visible
**ON A ROLL** banner: the next draw comes from a spotlight pool
(flashpoints + unseen-by-you cards) and an armed Encore that lands
Incredible *refunds its token*. Streaks become something to ride, and
they feed R2's novelty engine instead of just smoothing numbers.

**U4 — Chart jackpots.** On song release, a 1-in-20 **"overnight
viral"** roll (visible spinner beat in the charts screen): the song
multiplies its debut. Charts are the game's natural slot machine; today
they only pay small change.

**U5 — Crossroads shake-up (cheap rhythm variance).** Once per run at
~20% odds, an act plays short or long (±2 cards, telegraphed: "the tour
got cut short"). Breaks the 29–32-card metronome without touching the
5–10-minute loop.

---

## 5. Guardrails & measurement

- **Simulator gates** (extend `tools/simulate.mjs`): add (a) card-reach
  report — *0 never-drawn ungated cards, ≤10 cards under 1%* across
  4,000 narrative runs; (b) a variance index — per-run LP stddev and
  count of ±20-point swing moments (target: ≥2/run after RUSH, from ~0);
  (c) tier bands per act (act 3 Incredible 10–18%); (d) success band
  25–40%. Run `node tools/simulate.mjs 4000 narrative` before every
  pass ships (judge by `narrative`, not `smart`).
- **Telemetry acceptance** (via the scheduled `telemetry/coverage.md`):
  two weeks after each pass — cards seen ≥85% and rising, every arc flag
  fired ≥5×, each ending kind reached ≥1×, `prompter` minigame played,
  degenerate-choice skew stays <85, run length distribution widens but
  stays inside the 5–10-minute loop.
- **Don't break what works:** funnel data shows everyone who finishes
  the tutorial replays (2/2). The leak is *before* the game, not inside
  it — nothing in this doc should add friction to the first two minutes,
  and Story Seeds/novelty weighting must not distort a player's first
  ~3 runs (seeded arcs only, no difficulty spikes).

## 6. Rollout

| pass | ships | proves itself by |
|---|---|---|
| **P1 Wiring & thresholds** | R5 fixes, R3 re-tunes, sim reach-report | sim: never-drawn → ~0 ungated; coverage.md: threshold cards appear |
| **P2 Story Seeds & novelty** | R1, R2 | coverage.md: arc payoffs fire; per-player unseen% drops run-over-run |
| **P3 Can-lose balance** | R4 (config only) | win band 25–40% in sim; fail content appears in telemetry |
| **P4 Rush** | U1–U5 | sim variance index ≥2 spikes/run; act-3 Incredible ≤18%; playtest quotes |
| **P5 More** | M1 act-1 cards, M2 mutators, M3 lint | act-1 repeat rate down; 260-card target; coverage stays ≥85% |

Sequencing note: P1–P2 first because they make *existing* work visible
(zero new content, biggest felt-novelty win per line of code). P3 before
P4 so the tier re-tune lands on a game where Bad matters. P5 last —
adding cards to an unfixed scheduler would just grow the dark pile.
