# Grilling doc — Love Island, a second Pack for the engine

Output of a `grill-with-docs` session. This is a **design record, not a spec and
not built code** — it captures the shared understanding reached by interviewing,
so a later `to-prd` pass can synthesise a PRD without re-interviewing.

Canonical vocabulary lives in [`/CONTEXT.md`](../CONTEXT.md). Hard decisions live
in [`docs/adr/`](./adr/). This doc is the map that ties them together.

## The idea

A reality-dating-show game built as a second genre `Pack` on the genre-neutral
career-climb engine. You steer one Islander through one Season in the villa,
making the show's binary choices, and try to reach one of three ways to "win"
before the Final — proving the core carries no music shape.

## Design → engine mapping

Every decision lands on an existing engine mechanic; adding the genre should edit
new files only, no engine line.

| Design | Engine mechanic |
|---|---|
| **Season** across Arrival / The Turn / Final Week | run · 3 acts |
| **Islander** you steer, chosen as a **Type** | player + loadout |
| 4 playable **Types** (Golden Retriever / Game-Player / Influencer / Heartthrob) | loadouts (stat modifiers + quirk hooks) |
| Stats **Rizz / Loyalty / Savvy / Charisma** | manifest stats |
| **In Your Head** → Walk | burnout slot + universal fail |
| **Public / Followers** (drama feeds Followers) | resources; Public = momentumResource |
| **Bond** | resource owned by the **Coupling** subsystem (plugin) |
| **Graft** → **Edit** of **Angles** | costResource + gear (no shop money) |
| single **Partner** + **Temptation**, named **Cast**, **Rival**, **Bombshell** | Coupling/rival plugins + forced-slot arrivals — see ADR-0001 |
| **Casa Amor** | bounded forced chain at the Act 1→2 break |
| **The Crossroads** → declared **Intention** | crossroads + commitPath + pathAffinity |
| **Dumped** (low Public / single at Recoupling) | pack fail state, live from Act 2 |
| **The Narrator** + **"I've got a text!"** | presenter |

## The three Summits (ways to win)

- **Win the Villa** — public crowns you & your partner (£50k). Leans Rizz+Charisma.
- **The Real Thing** — leave in a genuine, lasting couple. Leans Loyalty+Rizz.
- **The Brand** — convert notoriety into a following, win or lose. Leans Charisma+Savvy.

## Settled decisions

Domain, three Summits, four stats + In Your Head, three resources, the Graft/Edit
economy (no shop money), single-partner coupling with temptation (ADR-0001), a
named Cast of stereotype Types with a recurring Rival, the 3-act arc with Casa
Amor as a first-class set-piece, two fail states (Walk + Dumped), four playable
Types, the Crossroads/Intention commit, and the Narrator + text-message framing.

## Deliberately deferred (tuning/content, not shape)

- **Graft economy specifics** — earn/spend rates, the Angle shelf contents.
- **Summit gate numbers** and overall stat/resource balance.
- **Card tag taxonomy** (flirt / loyal / drama / graft / challenge …) and deck size.
- **Meta-progression** — unlockable Types (e.g. The Bombshell), harder Seasons.

## NEXT QUESTION (resume here) — Minigames

The engine has a **minigame** hook: one-thumb, ≤30s skill moments on flagship
choices whose performance becomes a roll bonus (`minigame: 'take'` on a choice →
score 0..1 → roll bonus; the simulator models the same hook). Music uses it for
performance moments.

**The question:** which villa moments become interactive minigames, and how many
does the launch Pack ship?

**Recommended answer (to react to next session):** villa **challenges** are the
obvious diegetic home for minigames — the show already frames them as
timed/physical/silly games (heart-rate challenge, Snog-Marry-Pill, the talent
show, raunchy dares). Ship a small set (2–3) tied to challenge cards, each a
one-thumb game whose score feeds the roll on that card and can spike Public or
drama (→ Followers). Keep them optional flavour on flagship cards, not on every
draw, mirroring how music reserves them for flagship choices.

Open sub-questions to grill: (a) do minigames also gate a Bond/Temptation beat
(e.g. a "keep your cool" game during Casa Amor), or only challenges? (b) is a
minigame ever mandatory (a finale set-piece), or always skippable to a plain
roll?
