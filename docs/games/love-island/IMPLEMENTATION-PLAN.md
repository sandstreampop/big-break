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
