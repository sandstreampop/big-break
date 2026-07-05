# Implementation plan — Love Island Pack

How to build the Pack across sessions, once the design record ([`grill.md`](./grill.md),
[`CONTEXT.md`](./CONTEXT.md), [`adr/`](./adr/)) is on `main`. This is a sequencing
plan, not a spec — each session's *what* comes from the design record.

## Guiding principle

**Every session lands on `main` green.** The green gate, per `CLAUDE.md`:

```
npm run build
node tools/lint-content.mjs && node tools/simulate.mjs --check && node --test && node test/ui-smoke.mjs
```

(`npm run check` runs all but `node --test`.) Each session is *one coherent layer*.
Mechanics ship with a **minimal stub deck** so they're testable in isolation; the
big content mass fills that deck only once the mechanical vocabulary and the voice
both exist. Adding the genre edits **new files only** — no engine line (ADR-0004
reasoning). The chunks are sized for a capable model: fat where integration risk is
low, solo for the two subsystems that decide run-state and golden behavior.

## Phase A — taste (parallel with everything; must precede content)

**A. Taste calibration.** Produce `VOICE.md` (five registers: Narrator / Host /
Text / Islander-argot / villa-copy) + `GUIDING_EXAMPLES.md` (full worked scenes) by
having the user judge candidate lines, then wire the `tools/lint-content.mjs` floor
(cliché blocklist, no gratuitous `!`, outcome-length cap). Independent of all code;
the only hard rule is it finishes before Phase C.

## Phase B — mechanics (mostly sequential; each green with a stub deck)

**B1. Skeleton pack.** Manifest (Rizz/Loyalty/Savvy/Charisma + In Your Head;
Public/Followers/Bond; the three Summit `winGates`; Walk + Dumped; 3 acts), the 4
Types as loadouts, **gender** + couple-pool scaffolding, pack registration + select
UI, endings copy, and a *placeholder ambient deck* just large enough to play
start → Crossroads → Final.
_Milestone:_ the genre-neutral spine runs with zero LI subsystems — the "core
carries no music shape" proof in miniature. Everything else hangs off this.

**B2. Coupling** (heavy net-new plugin, solo — ADR-0002). Bond/Partner, Recoupling
survival (`Bond ≥ floor OR Public ≥ floor`), switch/reset, the alternating-chooser
(ADR-0003), Bond-only Temptation, Exclusivity, the Rival reskin (Bond penalty),
Dumped live from Act 2, and the Golden-Retriever quirk via `pctx.hooks`. Unit tests
+ `test/invariants.test.mjs`. Depends on B1.

**B3. Casa Amor + The Reveal + Bombshells** (forced-beat + latent-flag layer, solo).
The Casa chain (survivable fork, regular gut-punch, payoffs), latent
loyalty/betrayal flags + the Partner's hidden loyalty state, the postcard + Movie
Night Reveals, come-clean mitigation, the `refineDeck` bombshell window + the rare
immediate-recouple. Depends on B2 (which owns the flags/Partner state).

**B4. Economy + profile.** Graft cost resource, the Edit/Angles reskin
(swap-discards, `loseOnBad` = "exposed", no upkeep), Followers + the Influencer
quirk via `pctx.hooks`, Girl/Bro-code flags → villain/loyal Angles + one
bloc-decided beat. Only depends on B1's manifest — order-flexible around B3.

**B5. Presenter + set-piece framing.** The three-tier authority render (Text
anticipation-lock, Host escalation on top Text beats, firepit gather, Beach Hut
confessional), Meet the Parents (Act 3 choice beat reading Reveal history),
epilogue/headlines/dms equivalents.
⚠️ _Spike first:_ confirm the presenter interface can express the Text/Host ritual
as pure copy, or whether it needs a small `ui.ts` hook. If it needs a hook, that is
a deliberate app-level touch to decide (same class as minigames) — its own call.

## Phase C — content (multi-session: volume + taste)

**C1…Cn. The deck.** Pin the **tag taxonomy** (flirt / loyal / drama / graft /
challenge …) and the **Cast roster** (named NPC Types) here, then write cards. Split
by family, not act: dates/chats · challenges · drama/temptation · graft/daybed ·
recouplings/dumpings · the per-Summit finale cards. Requires A (voice) + all of B
(real effects to reference).

## Phase D — ship

**D. Balance + goldens.** Tune with `node tools/simulate.mjs 4000 narrative`,
baseline the LI golden masters deliberately (`tools/gen-golden.mjs`), add the
docs-site LI page, run the full check.

## Shape at a glance

```
A (taste) ─────────────────────────────┐ (before C)
                                        │
B1 skeleton ─┬─ B2 coupling ── B3 casa/reveal/bombshell ─┐
             ├─ B4 economy/profile ──────────────────────┤─ C deck ── D ship
             └─ B5 presenter (spike first) ──────────────┘
```

~8–10 sessions (A, B1–B5, ~2–3 content, D). A runs parallel to B; B4 is
order-flexible. To go fatter: fold B4 into B5, and let B1 absorb the docs-site stub
— but keep **B2 and B3 solo**; they decide the run-state schema and the golden
behavior.

---

# v2 — the villa that feels like *Love Island*

Everything above ships the pack. **v2** is the experience redesign from the
5-run playtest: the design record is [`V2-DESIGN.md`](./V2-DESIGN.md), the
decisions are [`adr/0005`–`0008`](./adr/), the evidence is
[`V2-RESEARCH.md`](./V2-RESEARCH.md). Same green gate, same spine (pack-owned, no
engine line names a villa concept), same rule: each session is one coherent layer,
green on `main`, and re-baselines the LI goldens **deliberately** when it changes
seeded behaviour.

## Guiding principle for v2: prove the stack on one scene first

v2 is ambitious enough that the risk is building six interlocking systems before
knowing the core loop feels right. So the sequence is **vertical slice → scale**,
not system-by-system. The slice is the smallest thing that exercises the whole
stack on a single encounter; everything after it is widening.

## Phase V1 — the vertical slice (one encounter, whole stack)

**V1. The Act-1 Rival-established encounter.** Build *one* branching dialogue
encounter (ADR-0005) end-to-end: the Rival gets opinion/mood/secret state
(ADR-0006, minimal — just this character), a 3–4 beat branching chain, a
**mood-driven portrait**, a **Stirling popover** (one authored beat line + one
templated reaction, the bark-selection skeleton of ADR-0008), **dialogue-first**
copy for the scene, the **lean-preview** on its cards, and the
**relationship-forward HUD** showing the Rival. **No gossip economy, no ceremony
rework, no full reskin.**
_Milestone / go-no-go:_ does this one scene feel like Love Island? If yes, the
thesis holds and we scale. If no, we've spent one slice to learn it. This is the
session that decides whether v2 proceeds as designed.

## Phase V2 — the systems, widened (each green with a stub)

**V2a. Character-state layer** (ADR-0006, solo — decides run-state schema).
Opinion tiers over the existing Bond number, extended to Partner + season-long
Rival + active bombshell; mood as a transient modifier; the secret as an extension
of the ADR-0002 latent-flag system. Portrait + HUD reads. Unit tests +
`test/invariants.test.mjs`; re-baseline goldens.

**V2b. Stirling bark engine** (ADR-0008, solo — touches golden behaviour). The
condition-filtered, priority-weighted, no-repeat-until-exhausted line bucket;
seeded selection with per-run no-repeat state; the presenter overlay channel
(spike first: confirm whether the overlay needs a small genre-neutral `ui.ts`/
presenter hook — same class of app-level call as minigames, ADR-0004). Authored
beat lines + templated reaction pools; the player-stance colouring.

**V2c. Gossip currency** (ADR-0007). The intel inventory on run-state, the gather
channels (encounters + Beach Hut confessional with its distorted echo), the deploy
verb, the small Partner↔You↔Rival cascade. Depends on V2a (reads character state).

**V2d. Ceremony climax encounter** (V2-DESIGN "centrepiece"). Rebuild the
recoupling as the four-beat set-piece (line-up + Stirling forecast → last-stand →
gossip cash-out → verdict + explain). Depends on V2a/V2b/V2c — it's where they
collide.

## Phase V3 — content + taste + look

**V3a. Voice recalibration** (VOICE.md / GUIDING_EXAMPLES.md / taste.mjs). The
dialogue-first shift is a taste pass like the original Phase A: recalibrate with
the user, update the lint floor, then convert the deck. Golden-affecting.

**V3b. Encounter + Rival content.** The ~2 encounters/act across the run, the
Rival's escalation arc, bombshell second-wave rivals, gossip-bearing beats — the
volume, once the mechanical vocabulary (V2) and the voice (V3a) both exist.

**V3c. Art + reskin.** Mood-driven character portraits (the ~16 cast × moods
bounded set) first; villa visual identity and relationship-forward HUD styling
second.

## Phase V4 — ship

**V4. Balance + goldens + docs.** Re-tune with `tools/simulate-pack.mjs`, baseline
the LI goldens deliberately, update the docs-site LI page, full check.

## v2 shape at a glance

```
V1 slice (go/no-go) ─┐
                     ├─ V2a state ─┬─ V2c gossip ─┐
                     │             └─ V2d ceremony ┤─ V3b content ─┐
                     ├─ V2b stirling ──────────────┘               ├─ V4 ship
                     └─ V3a voice (parallel; before V3b) ── V3c art ┘
```

Keep **V2a and V2b solo** (schema + golden behaviour). V1 is deliberately fat —
one thin cut through every system — because its only job is the go/no-go.

---

# After v2

All phases above (A–D, V1–V4) are built and green. What comes next — the
evidence-based design-space survey and the sequenced post-v2 sessions — lives in
[`ROADMAP.md`](./ROADMAP.md) (expert record) and its plain-language companion
[`public/roadmap.html`](./public/roadmap.html), deployed at
`/love-island/roadmap.html`.

