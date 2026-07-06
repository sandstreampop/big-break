# The factional public: three audiences that want opposite things (v4 S3)

Session 3 of the v4 build ([`../V4-BUILD-CHARTER.md`](../V4-BUILD-CHARTER.md)),
on Session 2's six-week season (ADR-0011). The charter's locked call: the
public stops being one voice and becomes **exactly three factions** —

- **The Romantics** 🌹 — stick together, forgive, love conquers all.
- **The Self-Respect crowd** 💅 — backbone, never accept mistreatment, walk
  away with your head high.
- **The Drama-lovers** 🍿 — here for chaos and entertainment; will happily
  adopt a villain.

The governing rule (V4-DESIGN Pillar 5): **the same action pleases one
faction and angers another — you can never satisfy everyone.** Modelled on
Reigns' four-meter design (we use three), with Reigns' derisked bag mechanics
handled by the couple-web (ADR-0013).

## Decision

**The three factions are manifest resources; every legacy read stays intact
by making the old meters *derived*.** Zero engine edits — the roles the
engine already asks for by function (`momentumResource`, win-gate keys via
`gateValue`, resource application) carry the entire system.

- **`romantics` / `selfrespect` / `drama`** join `manifest.resources`: cards
  author them directly (`{ drama: 5, romantics: -2 }`), the engine records
  their deltas, INCREDIBLE scales them, and the generic lean-preview
  telegraphs them **before the swipe** — the v3 "stakes-in" legibility
  requirement, satisfied by the shell's existing machinery. Floors at 0,
  uncapped above (the S2 vote economy runs past 100; Reigns' bounded meters
  lost to continuity — documented tradeoff).
- **`public` becomes the derived aggregate**: the mean of the three wings,
  recomputed by the factions plugin — its single writer — after every
  faction move. Win the Villa's `public: 106` gate, the dumped-by-vote fail
  state, the HUD chip, and the vibe hook all read it unchanged, and are now
  *values reads* without naming a faction.
- **The legacy `public` verb is ROUTED**: a card authoring `public: +3` pays
  all three wings +3, tilted `±tiltStep` toward/away from the faction its
  choice tags serve (`loyal/date → Romantics`, `strategy/code/rest →
  Self-Respect`, `drama/camera/temptation/banter → Drama`, boring wing pays
  for the favoured one). **Mean-preserving**, so the S2 aggregate economy
  carries over intact while the wings diverge; negative deltas land
  uniformly — embarrassment is nonpartisan.
- **The finale clutch moves to `surge`** (`manifest.momentumResource`):
  **net approval = wings onside (≥50) − wings lost (<25), floored at 0.**
  The engine's clutch bar is `CONFIG.momentumForUpgrade = 3`, so the late
  vote surge only carries a near-miss when **the whole nation is onside** —
  a chaos-villain who thrilled Drama but repelled the Romantics holds a
  surge of ~1 and lands mid-pack, exactly the charter's example. `surge`
  is not itself a resource (no chips); it's a plugin-maintained derived
  read with `resourceMeta` display copy, and the Final Set's "speech to the
  nation" closer previews its exact movement (the honest-closer contract).

## Where the wings actually move

1. **Authored tradeoffs** — the nation cards (`events-nation.ts`) and the
   couple-web's resolutions put explicit, lean-previewed faction payloads on
   choices: the Beach Hut split question, Snog-Marry-Pie, the doormat test,
   the course-correction date, the final pitch.
2. **The tag tilt** on every routed `public` delta (gentle, continuous).
3. **Structural reactions** — the plugin observes the coupling/gossip verbs
   after their owners resolve them (registration order) and pays the loud
   Pillar-5 spreads: going exclusive (Romantics up, Drama bored), a partner
   switch (Drama up, Romantics down), coming clean (Self-Respect up), the
   firepit detonation (Drama feasts, Romantics wince), a Casa betrayal
   (whole-nation sympathy), Movie Night footage (yours vs theirs), girl-code
   kept/broken — plus the **villain adoption**: a *botched* drama/camera play
   still feeds the chaos wing a point. Being booed is engagement.

## Legibility (the interesting-decisions contract)

Pre-swipe: lean-preview chips on any authored faction payload; set-piece
stakes name the lost wing (or the landslide) at ceremonies and the Final.
Post-swipe: faction chips are hidden and the wings **speak** in the result
beat ("🌹 Somewhere, a nan approves." / "💅 The spine wing updates your
file.") — ADR-0006's tiers-and-weather discipline, never three more number
chips. Campaign level: the weekly recap gains a **THE NATION** block (three
tier reads + one interpretation line), and the help sheet teaches the split.

## Balance consequences (measured, 3000-run narrative sims)

The factional reactions inject net vote mid-season, so two S2 numbers moved
with written cause: the ceremony `publicFloor` rose 56→60 (the rescue lane
had stopped biting) and the dumped-by-vote line rose 0→4 (a mean of three
tilted wings almost never lands on exactly zero). Win the Villa's gates are
re-tuned for the story era (ADR-0013): `public 106 · bond 50 · story 2`.

## Rejected

- **A faction count other than three** — charter-locked.
- **Reigns-style hard 0–100 bounds with fail-at-extremes** — the villa
  already has its mortality (ceremonies, the vote line, the Walk); bounded
  meters would have forced a full economy rewrite mid-charter.
- **An engine-side multi-meter clutch** — the single `momentumResource` role
  plus a derived read does the job with zero shared-type changes; the
  charter's hard-stop on engine contract edits stays untouched.
