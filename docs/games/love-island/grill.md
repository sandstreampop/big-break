# Grilling doc — Love Island, a second Pack for the engine

Output of an ongoing `grill-with-docs` process. This is a **design record, not a
spec and not built code** — it captures the shared understanding reached by
interviewing, so a later `to-prd` pass can synthesise a PRD without re-interviewing.

Canonical vocabulary lives in [`CONTEXT.md`](./CONTEXT.md) (this folder). Hard
decisions live in [`adr/`](./adr/) (this folder). This doc is the map that ties
them together.

## The idea

A reality-dating-show game built as a second genre `Pack` on the genre-neutral
career-climb engine. You steer one Islander (whose **gender you choose**) through
one Season in the villa, making the show's binary choices, and try to reach one of
three ways to "win" before the Final — proving the core carries no music shape.

## Design → engine mapping

Every decision lands on an existing engine mechanic; adding the genre should edit
new files only, no engine line.

| Design | Engine mechanic |
|---|---|
| **Season** across Arrival / The Turn / Final Week | run · 3 acts |
| **Islander** you steer, chosen as a **Type** + **gender** | player + loadout + gender flag |
| 4 playable **Types** (Golden Retriever / Game-Player / Influencer / Heartthrob) | loadouts (stat modifiers + quirk hooks) |
| Type quirks touching plugin-owned state (Bond, Followers) | plugin reads a custom key off the loadout's `quirk.hooks` via `pctx.hooks` — engine names no key |
| Stats **Rizz / Loyalty / Savvy / Charisma** | manifest stats |
| **In Your Head** → Walk | burnout slot + universal fail |
| **Public / Followers** (drama feeds Followers) | resources; Public = momentumResource |
| **Bond** | resource owned by the **Coupling** subsystem (plugin) |
| **Graft** → **Edit** of **Angles** | costResource + gear (no shop money) |
| single **Partner** + **Temptation**, named **Cast**, **Rival**, **Bombshell** | Coupling/rival plugins + forced-slot arrivals — see ADR-0001, ADR-0002 |
| **Recoupling** survival + **alternating-chooser** | Coupling plugin gate; gender sets chooser/chosen — see ADR-0002, ADR-0003 |
| **Casa Amor** + **The Reveal** (postcard / Movie Night) | bounded forced chain + latent `addFlag` exposure — see ADR-0002 |
| **Bombshell** (incl. rare immediate-recouple) | `refineDeck` scheduled window; forced category |
| **The Crossroads** → declared **Intention** | crossroads + commitPath + pathAffinity (single-path Final) |
| **Exclusivity** ("closing off") | Bond-threshold choice beat (Coupling) |
| **Meet the Parents** | scheduled Act 3 Text choice beat; Real Thing gate/boost |
| **Girl code / Bro code** | flags + Public + villain/loyal **Angles** (no faction subsystem) |
| **Dumped** (single at a chooser-Recoupling / Public craters) | pack fail state, live from Act 2 |
| **"I've got a text!"** ritual + **The Host** + **The Narrator** | presenter, three-tier authority |

## The three Summits (ways to win)

The Final is **single-path**: the engine checks only your committed Intention's gate
(`winGates[state.path]`), and `commitPath` is a one-time setter. You cannot back into
a different Summit; "the temptation to break it" is stat-pull flavour that risks your
*own* gate.

- **Win the Villa** — public crowns you & your partner (£50k). Leans Rizz+Charisma.
- **The Real Thing** — leave in a genuine, lasting couple. Leans Loyalty+Rizz.
- **The Brand** — convert notoriety into a following, win or lose. Leans Charisma+Savvy.

## Settled decisions

### From earlier sessions
Domain, three Summits, four stats + In Your Head, three resources, the Graft/Edit
economy (no shop money), single-partner coupling with temptation (ADR-0001), a named
Cast of stereotype Types with a recurring Rival, the 3-act arc with Casa Amor as a
first-class set-piece, two fail states (Walk + Dumped), four playable Types, the
Crossroads/Intention commit, and the Narrator + text-message framing.

### This session

- **Minigames — deferred entirely from launch** (ADR-0004). The registry is
  app-level and music-coupled; shipping the second pack without it is the cleaner
  genre-neutral proof. "Make minigames a pack capability" is a later project.
- **Coupling dynamics** (ADR-0002): Recoupling survives on `Bond ≥ floor OR Public ≥
  floor`; voluntary switch resets Bond to base; Rival applies a Bond penalty. Casa
  Amor is a guaranteed-survivable fork with a **regular** loyal-but-betrayed
  gut-punch paying **Public + sympathy + Graft + soft In-Your-Head** (tuned strictly
  below a held Bond). Temptation is **Bond-only** (no mid-act switches). A rare
  **immediate-recouple Bombshell** can strand you single (never instant Dumped;
  odds scale inversely with Bond+Public). **The Reveal** = latent loyalty/betrayal
  flags (plus the Partner's hidden loyalty state) exposed at the Casa **postcard**
  and **Movie Night**, with dramatic irony and come-clean mitigation. **Exclusivity**
  = a Bond-threshold choice beat, reversible-but-costly.
- **Player gender is mechanical** (ADR-0003): chosen at start; sets couple-pool,
  Casa side, and the **alternating-chooser** position that completes the Recoupling
  (chooser = agency/no risk; chosen = the `Bond OR Public` exposure). **Hetero format
  for launch**; queer/fluid formats a future Season variant.
- **Type quirks live in pack code.** Two quirks touch plugin-owned resources (Golden
  Retriever's Bond-build, Influencer's Followers-on-drama); they are implemented in
  the owning plugins reading a custom key off `pctx.hooks`. The engine never
  references `bond`, `followers`, `loyalty`, or any quirk-key name — the road most
  aligned with the generic-engine vision. The other two quirks use native hooks
  (`burnoutTagMult`, `rollTagBonus`).
- **Graft/Edit** reuses music's gear almost exactly: a slot-limited **Edit**;
  buying an Angle when full **swaps and discards** the old one (no owned inventory);
  keep `loseOnBad` reskinned as **getting exposed** (a fragile Angle falls off on a
  botched flagship moment); **drop `upkeep`** (no per-act Graft drain).
- **Bombshell scheduling**: `refineDeck` scheduled window (like the shop slot);
  cadence ~one late Act 1, the Casa cohort at the break, one in Act 2, none in Act 3;
  arrivals are single **seeding** cards (set a flag) except the rare immediate one.
- **The "I've got a text!" subsystem** = a **three-tier presenter authority model**:
  the **Narrator** (voiceover, editorial, always), **Texts** (the format's frequent
  steering voice; villa gathers at the firepit), and **The Host** (flies in seldom,
  in person, for the biggest ceremonies — an escalation treatment on top Text beats,
  not a new mechanic). Texts carry two mechanical properties ambient moments lack:
  an **anticipation lock** (never skipped by a hot-streak/auto-advance) and
  **external resolution** (may resolve on Public / the villa, not just your roll).
  Structure-changing beats *usually* arrive as Texts — a **soft convention**, not a
  hard rule. Keyed on a `text` marker authors set; zero engine cost.
- **Cornerstone additions** promoted this session: **The Reveal** (ADR-0002),
  **Meet the Parents** (Act 3 choice beat that reads your Reveal/betrayal history and
  gates/boosts The Real Thing), **Exclusivity** (ADR-0002), and **Girl/Bro code**
  folded into flags + Public + Angles with one **bloc-decided Text beat** (a
  "girls/boys vote" that routes through Public + code-flags). A real gender-faction
  standing subsystem is deferred.

## Writing taste — how we persist it (plan, not yet built)

Music's copy carries a very specific, unwritten taste (hyper-specific nouns, a
mid-beat turn, deadpan, no hype punctuation, a surprise in the last clause). We will
persist Love Island's taste in **two artifacts**, produced by a **dedicated future
calibration session** (I generate candidate lines → the user judges each with a word
of *why* → I distil the docs from those verdicts):

- **`VOICE.md`** — **five registers** (Narrator / Host / Text / Islander-argot /
  villa-copy), craft principles as good-vs-bad pairs, and a **cliché blocklist**
  (which doubles as lint data).
- **`GUIDING_EXAMPLES.md`** — **full worked texts for a spread of Love Island
  scenarios** (a complete recoupling, a Casa Amor betrayal, a challenge, a graft
  beat, a dumping, a first date…), each rendered end-to-end so agents pattern-match
  against whole scenes.

Backed by a **lint floor** in `tools/lint-content.mjs` (cliché blocklist, no
gratuitous `!`, outcome-length cap). The `Idea Grab` minigame's `IG_HOOKS` /
`IG_CLICHES` arrays are the precedent for taste-as-data.

## Deliberately deferred (tuning/content, not shape)

- **Graft economy specifics** — earn/spend rates, the Angle shelf contents, Edit
  slot count.
- **Summit gate numbers**, recoupling floors, and overall stat/resource balance
  (incl. the betrayal-payoff ordering knob).
- **Card tag taxonomy** (flirt / loyal / drama / graft / challenge …) and deck size.
- **The Cast roster** — the named NPC Types.
- **Meta-progression** — unlockable Types (e.g. The Bombshell), harder Seasons.
- **Later variants / depth** — minigames as a pack capability (ADR-0004),
  queer/fluid Season formats (ADR-0003), a real gender-faction standing subsystem,
  the lie-detector Reveal beat.

## NEXT (resume here)

The **shape** is settled. Two follow-on tracks:

1. **The writing-taste calibration session** — produce `VOICE.md` +
   `GUIDING_EXAMPLES.md` by having the user judge candidate lines across the five
   registers, then wire the `tools/lint-content.mjs` floor.
2. **A `to-prd` pass** — synthesise the PRD from this record + the ADRs, then move to
   the deferred tuning/content work (Cast roster, tag taxonomy, balance numbers).
