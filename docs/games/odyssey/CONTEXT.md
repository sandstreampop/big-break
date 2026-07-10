# The Odyssey — a Pack for the Big Break engine

A bard at a campfire retells the long way home. The player steers Odysseus
through one voyage from fallen Troy to Ithaca — but every run is *tonight's
telling*, and the homecoming you win is hollow; the true ending can only be
sung by a bard who has learned the whole prophecy, across many fires.

Third genre `Pack` on the genre-neutral engine: new files + a registry entry +
an HTML page, zero engine edits. The design record (every decision and why) is
[`grill.md`](./grill.md) — when a slice is in doubt, that file wins. Register
and craft law is [`VOICE.md`](./VOICE.md) (machine mirror:
[`taste.mjs`](./taste.mjs), worked scenes:
[`GUIDING_EXAMPLES.md`](./GUIDING_EXAMPLES.md)); visual law is
[`STYLE.md`](./STYLE.md).

## The structural spine

**The itinerary is fixed; the voyage is not.** The canonical beats — the three
Landmarks, the Crossroads, the Temptations — live in the segment/set-piece
layer and occur every Telling. The deck only ever holds the sea between them.
The audience knows the episodes; the order of the waves is tonight's.

## Language

**The Telling**:
One playthrough — the engine's *run*. Tonight's version of the story, sung at
one Fire: three acts + finale, ~28 cards, 15–20 minutes. Across Tellings the
*Bard* grows in repertoire and reputation (meta-progression is diegetic).
_Avoid_: run, game, playthrough, season

**The Bard**:
The teller at the fire — the pack's presentation frame (cold open, act intros,
recaps, overlay notes, endings, slips) and the diegetic skin on the engine's
randomness: when the dice surprise, the bard is improvising, misremembering,
or being corrected by the audience. Presentation-only in v1; the Audience
meter (the frame's one mechanic) is post-v1.
_Avoid_: narrator, announcer, DM

**The Fire**:
The run-start choice — *where you sing tonight*, the engine's loadout. Four
Fires, each one crisp visible starting effect + run-long deck weights:
**The King's Hall** (they want glory — Renown weighs heavier, kleos-lean
deck), **The Fisherman's Hearth** (they want the homecoming — nostos-lean,
gentler seas, smaller payoffs), **The Soldiers' Camp** (they want blood —
Might-lean), **The Temple Steps** (they want the gods — Lore- and omen-heavy).
_Avoid_: loadout, class, archetype, kit

**Might / Guile / Lore**:
The three stats — the three approaches to any confrontation: fight it, trick
it, know the rite against it. Rolled at Telling-start (tonight's
characterization of Odysseus). Tight by design; there is no fourth.
_Avoid_: strength, cunning/wisdom (as stat names), charisma, command

**The Expedition**:
Men and timber as one dwindling resource — ships, crew, stores, all of it.
Low Expedition is not death (Odysseus arrives home alone); it *closes doors* —
a full company can storm a shore, a lone man on a raft can only be clever.
_Avoid_: crew, hull, health, HP

**Athena / Poseidon**:
The two opposed gods, each a resource — the poem's actual axis. **Athena** is
favor *for* you and the finale clutch (the manifest's `momentumResource`: she
tips the final scale). **Poseidon** is wrath *against* you; Poseidon at
maximum is a fail state (the sea takes you).
_Avoid_: divine favor (as one pooled meter), luck, karma

**Despair**:
The engine's universal burnout fail, reskinned — Odysseus weeping on beaches
is canon. When it fills, the Telling ends on a beach, quietly.
_Avoid_: burnout, stress, sanity

**Renown**:
Deeds of legend, tallied as performed — the Kleos path's gate counter (the
Love Island `story`-counter mechanism) and the payload of incredible rolls
(legendary rolls make legend).
_Avoid_: fame, followers, score

**Nostos / Kleos**:
The two paths — homecoming vs glory, the poem's central tension, cutting
*across* stat builds. **Nostos** gates lean on Expedition preserved and
Poseidon contained; **Kleos** gates lean on Renown. Committed at the
Crossroads.
_Avoid_: route, build, alignment

**The Crossroads**:
The path-commit beat at the Act I → II boundary, **immediately after the
Cyclops** — because that beat poses the question in play: slip away as Nobody,
or shout your name at the sea.
_Avoid_: path select, fork

**Landmark**:
A guaranteed act-boundary set-piece — never in the deck. Three of them:
**the Cyclops** (Act I — the run's defining scar; the name-brag is an
explicit, tempting, terrible choice), **the Underworld** (Act II — Tiresias,
the prophecy dispenser; foreknowledge boons feeding Act III), **Ithaca and
the hall of suitors** (Act III → finale — the three-door grammar at maximum
stakes: the bow, the beggar's disguise, Athena at your shoulder). The Sirens
are deliberately NOT a Landmark — a scene, not a turning point.
_Avoid_: boss, event, milestone

**The three doors**:
The design grammar at every Landmark: a **Might door**, a **Guile door**, and
a **Lore door** — which ones open depends on the voyage that got you there
(stats, Boons, the Expedition you still have).
_Avoid_: options, solutions

**Boon**:
A carried thing that opens doors stats can't — moly, wax, a warning, the oar.
Boons come from the voyage (choices, Landmarks, the Prophecy), never from
commerce: there is no shop this version (`costResource` unset).
_Avoid_: item, perk (in copy), power-up

**The Acts**:
**Act I — The Sack and the Sea** (full expedition, hubris available; Cicones,
Lotus Eaters, storms, omens → the Cyclops). **Act II — Witches and the Dead**
(the bag of winds, Laestrygonians, crew fraying, Circe → the Underworld).
**Act III — The Narrow Way** (Sirens, Scylla and Charybdis, the Cattle of the
Sun, Calypso → Ithaca).

**Temptation**:
A cash-out ending — end the Telling now, bank a real lesser ending with
partial legacy, or sail on and risk worse. Three, escalating by act:
**Lotus** (Act I, the weak offer), **Circe** (Act II), **Calypso** (Act III,
the strong one). Situationally optimal *by design* — a wrecked run is
sometimes genuinely better banked at Calypso. Always *told* endings with real
closing copy, never game-over screens. Mechanically: the choice sets a flag; a
declared fail-state rule reads it — pack-side only.
_Avoid_: early exit, surrender, game over

**The Prophecy**:
Tiresias' foretelling, learned **one fragment per Underworld visit, three
fragments total**, persisted in the pack meta-save. In-fiction: only across
Tellings does the Bard assemble the whole prophecy. Knowledge-only — fragments
unlock doors; no meta-power, no grind ladder. The replay motor is "now I
*know* — can I *do* it?"
_Avoid_: unlock, achievement, quest

**The Hollow Win**:
Every standard Ithaca success ends unreconciled — "the sea does not forget."
Visible from the player's first win: the bow speaks, the hall is washed, and
the ending is not the end.
_Avoid_: bad ending (it's a Success — that's the point)

**The Oar Road**:
The true victory. With all three fragments known, foreknowledge-gated doors
exist; it demands in-run execution — keep Poseidon's wrath below threshold
(refuse the name-brag, honor the sea) and carry the oar-Boon through the
gauntlet. Renders as a finale variant in v1; a playable oar-road epilogue is
v2 material. Well under 10% of runs even post-unlock.
_Avoid_: true ending (in copy — the bard says "the truer ending")

**The Hecklers**:
The canonical audience ensemble at every Fire, so gags accumulate across
Tellings like the Prophecy does: **the woman by the woodpile** (the
fact-checker; her grandfather knew a rower), **the potter's boy** (deadpan
devastation: "Why didn't he just SAY sorry to Poseidon?"), **the man who
wants the horse** (running gag — wrong poem, friend; that one costs extra),
**Phemios of Smyrna** (the unseen rival who "sings flat, but that is between
him and whatever god he has offended").
_Avoid_: audience members (generic), NPCs

**Legacy**:
Cross-Telling points, cosmetic/repertoire only (new fires, deck variety) —
never power. Temptation cash-outs bank partial Legacy.
_Avoid_: XP, currency, meta-progression (in copy)

## The balance band

35–50% standard-win for a reasonable build; true victory well under 10% of
runs even post-unlock. Checked by the sim band (`tools/simulate-pack.mjs`),
tuned in `js/config.ts`, judged with narrative sims and real play.

## Scope (v1)

**IN:** the full voyage (3 acts, ~28-card Tellings, three Landmarks with the
three-door grammar, Boons) · the Nostos/Kleos Crossroads · four Fires · two
fail states (Despair; Poseidon at maximum) · Temptation cash-outs · the
Prophecy meta-arc + Hollow Win + true victory · bard voice in every string ·
the black-figure-bitmap theme · ~60–80 authored cards (fewer, denser).

**OUT (with reasons):** the Audience meter + bard interruptions (frame
mechanics wait until the voyage proves fun) · portraits/key art (needs its own
art identity, not the LI pipeline look) · minigames, feeds, share cards
(luxuries) · daily/comeback/gauntlet modes (after the loop earns them) · any
shop · a playable Oar-Road epilogue (finale variant in v1).
