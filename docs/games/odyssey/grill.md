# Grilling doc — The Odyssey, a third Pack for the engine

Output of a `grilling` interview (2026-07-10). This is a **design record, not a
spec and not built code** — it captures every decision tree walked and the shared
understanding reached, so implementation works *from* it instead of re-deciding.
This is the master doc for the implementation phase: when a slice is in doubt,
this file wins; when this file is wrong, it gets amended first.

Canonical vocabulary will live in `CONTEXT.md` (this folder, slice 1). Hard
decisions that need deeper rationale get `adr/` entries as they harden. Voice
law lives in `VOICE.md` + `taste.mjs` + `GUIDING_EXAMPLES.md`; visual law in
`STYLE.md` (all slice 1).

## The idea

**The Odyssey** (pack id `odyssey`, display title "The Odyssey" + a bard's
subtitle, wording TBD in voice work). A bard at a campfire retells the long way
home. Every run is *tonight's telling* — the itinerary is fixed, the voyage is
not. The homecoming you win is hollow; the true ending can only be sung by a
bard who has learned the whole prophecy, across many fires.

Third `Pack` on the genre-neutral engine: new files + registry entry + HTML
page, zero engine edits.

## The decision tree, as walked

Every question asked, the options weighed, and why the decision fell where it
did. Numbered in interview order.

### Q1 — Who are you; what is a run?
Options: (a) literal Homeric voyage; (b) generic mythic-wanderer reskin;
(c) modern metaphor. **Decision: (a).** Public domain, built-in act structure,
natural stats/resources/endings, and a *journey home* is a genuinely different
fantasy from the two career-shaped packs — it stress-tests the engine's
genre-neutrality claim instead of reskinning it.

### Q2 — Does a random-event engine fit a story with expected beats?
The load-bearing question, raised from Love Island feedback ("a season is these
things in this order" — and the game feels like random events instead).
Diagnosis: the engine is *not* bad at expected storylines — segments, act
boundaries, set-pieces, interstitials, forced cards, and LI's producers plugin
are all machinery for scheduled, deterministic beats. The LI lesson is that too
much of the season's identity sat in the random deck.
**Decision — the structural spine: "the itinerary is fixed, the voyage is not."**
Canonical beats live in the segment/set-piece layer and occur every run; the
deck only ever holds the sea between them. The Odyssey fits this *better* than
LI: audiences know the episodes but not the order; oral epic has built-in
license for variance (every run is a bard's retelling); and the famous beats
are confrontations with variable outcomes, not plot points.

### Q3 — The campfire frame: how deep does the bard go?
Options: (a) presentation-only; (b) you play the bard (stats about the telling);
(c) hybrid — play Odysseus inside the tale, plus ONE mechanical hook from the
frame. **Decision: (c), built as (a) first.** Bard presentation layer (act
intros, recaps, overlay notes, endings, interruptions) is core from day one; the
one mechanical hook is an **Audience meter**, deferred to a post-v1 slice so the
voyage proves fun before the frame grows mechanics. Meta-progression is
diegetic: across runs the *bard* grows in repertoire and reputation.

### Q4/Q5 — Stats: how many, which?
Four proposed (Might/Guile/Lore/Command); user constraint: **three — tight,
focused, deep** (feedback from previous games: too broad and busy).
**Decision: Might / Guile / Lore.** The three approaches to a confrontation —
fight it, trick it, know the rite against it. This yields the design grammar:
**every landmark offers a Might door, a Guile door, and a Lore door** — which
ones open depends on the voyage that got you there. Command cut: crew loyalty
belongs in the resource layer (mutiny hinges on what you *did*, not a stat).
The run-start stat roll is diegetic: tonight's characterization of Odysseus.

### Q5/Q6 — Resources
Proposed Crew + Hull + divine favor. **Decision: crew and hull merge into one
resource — the Expedition** (men and timber as one dwindling thing), and divine
favor is **two opposed gods: Athena (for you) and Poseidon (against you)** —
the poem's actual axis. Expedition low ≠ death (Odysseus arrives home alone);
it *closes doors* — a full company can storm a shore, a lone man on a raft can
only be clever. Whether a floor of it is a fail state is a tuning question.

### Q6 — Act skeleton
**Decision: 3 acts + finale, ~28-card runs (music-length, 15–20 min).**
- **Act I — The Sack and the Sea.** Full expedition, hubris available. Deck:
  Cicones, Lotus Eaters, storms, omens. **Landmark: the Cyclops** — the run's
  defining scar; the name-brag is an explicit, tempting, terrible choice.
- **Act II — Witches and the Dead.** Deck: bag of winds, Laestrygonians, crew
  fraying, Circe. **Landmark: the Underworld** — Tiresias, the prophecy
  dispenser (foreknowledge boons feeding Act III).
- **Act III — The Narrow Way.** Deck: Sirens, Scylla/Charybdis, Cattle of the
  Sun, Calypso. **Landmark → finale: Ithaca and the hall of suitors**, where the
  three-door grammar pays at maximum stakes: the bow (Might), the beggar's
  disguise (Guile), Athena at your shoulder (Lore).
Sirens deliberately NOT a landmark — a scene, not a turning point.

### Q7 — Crossroads and paths
Rejected: three stat-aligned paths (redundant — stats already are your
approach). **Decision: two paths, Nostos vs Kleos** — homecoming vs glory, the
poem's central tension, cutting *across* stat builds. Crossroads sits at the
Act I → II boundary, **immediately after the Cyclops**, because that beat poses
the question in play (slip away as Nobody vs shout your name).
- **Nostos** — gates lean on Expedition preserved, Poseidon contained.
- **Kleos** — gates lean on a **Renown** counter (deeds of legend tallied as
  performed; same mechanism as LI's `story` counter).
Flagged trade-off, accepted: two paths = less path-variety than music; per-run
variety comes from stat builds and boons instead.

### Q8 — Endings spectrum
Three classes. **(1) Ithaca endings** — standard finale evaluation vs path
gates (Success/Partial; the partials are the interesting writing: home but
unrecognizable; famous but to strangers). **(2) Lost at sea** — exactly two
fail states: **Despair** (the engine-owned burnout fail, reskinned) and
**Poseidon's wrath at maximum** (the sea takes you). **(3) The temptations —
cash-out endings**: Lotus (Act I, weak offer), Circe (Act II), Calypso (Act
III, the strong one). End the telling now, bank a real lesser ending with
partial legacy points, vs sail on and risk worse. **Situationally optimal by
design** — a wrecked run is sometimes genuinely better banked at Calypso.
Always *told* endings, never game-over screens. Mechanically: choice sets a
flag, a declared fail-state rule reads it — pack-side only.

### Q9 — The Slay-the-Spire hook (user-requested by name)
Standard win is hollow; true victory only across runs. The poem supplies this
*textually*: Tiresias says the homecoming is not the end — carry an oar inland
until it's mistaken for a winnowing fan, sacrifice to Poseidon, only then peace
and a mild death "off the water."
- **The hollow win:** every standard Ithaca success ends unreconciled —
  "the sea does not forget." Visible from the player's first win.
- **The key:** the Underworld landmark yields **one fragment of Tiresias'
  prophecy per run; three fragments total**, persisted in the pack meta-save.
  In-fiction: only across tellings does the bard assemble the whole prophecy.
- **The true victory — the Oar Road:** with all fragments known, new
  foreknowledge-gated doors exist. Demands in-run execution: keep Poseidon's
  wrath below threshold (refuse the name-brag, honor the sea), carry the
  oar-boon through the gauntlet. Renders as a **finale variant** in v1; a
  playable oar-road epilogue is v2 material.
- **Decision: knowledge-only.** Fragments unlock doors; no meta-power, no
  grind ladder. Legacy points stay cosmetic/repertoire (new fires, deck
  variety). The replay motor is "now I *know* — can I *do* it?"
Retro-effect noted: Calypso's cash-out gets harder to dismiss once you know
the true ending's cost.

### Q10 — Run-start choice (loadouts)
Options: (a) archetype Odysseus kits (redundant with the stat roll); (b) choose
the **fire you sing at**; (c) pick a war-prize boon (dilutes the boon economy).
**Decision: (b) — four fires:**
- **The King's Hall** — they want glory; Renown weighs heavier, kleos-lean deck.
- **The Fisherman's Hearth** — they want the homecoming; nostos-lean, gentler
  seas, smaller payoffs.
- **The Soldiers' Camp** — they want blood; Might-lean.
- **The Temple Steps** — they want the gods; Lore- and omen-heavy.
Each fire grants **one crisp visible starting effect** plus run-long deck
weights (mitigates "deck-weight loadouts feel subtle"). Pre-wires the Audience
meter slice: each fire is a different crowd to win.

### Q11 — Manifest role slots
- `momentumResource` (finale clutch): **Athena** — she tips the final scale in
  the poem itself.
- Burnout reskin: **Despair** (Odysseus weeping on beaches is canon).
- `incredibleResources`: **Renown** — legendary rolls make legend.
- `costResource`: **none — no shop this version.** Boons come from the voyage
  (choices, landmarks, prophecy), not commerce. "Spoils of Troy" is the obvious
  later addition if trading is missed.

### Q12 — Tonal register
Options: (a) tale straight, fun lives in the frame; (b) full comic; (c)
melancholy-first. **Decision: (a), firmly.** The unreliability is mechanical,
not decorative — the bard's slips and improvisations are the diegetic skin on
the engine's randomness. Standing law: **the bard never mocks the tale, only
himself and his audience.** (See Voice, below, for the register's later
evolution — (a) was then re-calibrated from deadpan-dry to epic-alive.)

### Q13 — Name
**Decision: (c)** — id `odyssey`; display "The Odyssey" big, bard's subtitle
underneath (manifest `title` / `aboutLine` split; subtitle wording found during
voice work).

### Q14 — Slice order
Docs-first, skeleton-second, landmarks-third (the heart), then deck, then
temptations, then prophecy. **Temptations before prophecy** — cash-outs make
mid-run stakes real before the meta-arc exists. Confirmed; see "v1 slices."

### Q15 — Scope (the v1 cut line)
**Prophecy IN** (it's the soul; without it this is a demo). **Portraits OUT** —
and noted as a constraint: *the Odyssey's key art will want its own visual
identity, not the LI pipeline's aesthetics.* Full in/out list below.

### Q16 — Constraints (user-set, beyond the inherited repo law)
- **Show, don't tell** — even with no gore. Concrete sensory detail or
  aftermath, never stated emotion or summarized violence. A `VOICE.md` law with
  `taste.mjs` teeth.
- **Adversarial review after EVERY pass** — not just pre-merge. Fresh-context
  verifier between each implementation pass.
- Balance band accepted: **35–50% standard-win** for a reasonable build; **true
  victory well under 10%** of runs even post-unlock.
- **Same taste feedback loop as love-island** — verdict queues, human verdicts.
- Violence line: **the bard's discretion** — offscreen-in-language ("what the
  Cyclops did then, I will not sing at this fire"). No explicit gore in strings.

### Q17/Q18 — Visual design
Root complaint: music and LI look "so damn alike," and LI's look doesn't fit
its genre. Diagnosis (verified in code): the sameness is *structural* —
`css/style.css` hardcodes a cool blue-black nightclub (dozens of raw hexes not
behind variables); LI's whole identity is a 265-line accent-swap overlay.
- **Pre-slice decision: tokenize `css/style.css`** — every surface/border/
  shadow/radius/type value behind CSS custom properties; music's look stays
  pixel-identical as the default values. Genre-neutral mechanism change
  (allowed under the repo spine); makes a pack skin a real theme; guarded by
  smoke/crowding/mobile-matrix + eyeball pass.
- **Direction: "black-figure, bitmap"** — Undertale's UI *grammar* fused with
  Greek *vocabulary* (user-supplied reference: Undertale UI sheets; we take the
  language, never the assets). See Visual law, below.

## Design → engine mapping

Every decision lands on an existing engine mechanic; adding the genre edits new
files only, no engine line.

| Design | Engine mechanic |
|---|---|
| **Tonight's telling** | one run · 3 acts + finale · ~28 cards |
| **The fire you sing at** (King's Hall / Fisherman's Hearth / Soldiers' Camp / Temple Steps) | loadouts — one visible starting effect + deck weights |
| **Might / Guile / Lore** | manifest stats (3) |
| **The Expedition** (men + ships, one dwindling thing) | resource; low ≠ death, low = doors close |
| **Athena / Poseidon** (two opposed gods) | resources; Athena = `momentumResource` (tips the finale); Poseidon-at-max = pack fail state |
| **Despair** | burnout slot + universal fail, reskinned |
| **Renown** (deeds of legend) | Kleos-path gate counter (LI `story`-counter mechanism) + `incredibleResources` payload |
| **Nostos vs Kleos** | paths + `winGates`; crossroads after Act I (post-Cyclops) |
| **Landmarks** — Cyclops / Underworld / Suitors' Hall | guaranteed act-boundary beats (segment/set-piece layer, never deck) |
| **Three-door grammar** at every landmark | choice `requires` gates on stats |
| **Boons & foreknowledge** (moly, wax, warnings, the oar) | gear/perk/counter + `requires`; unlock doors stats can't |
| **Temptation cash-outs** (Lotus / Circe / Calypso) | choice sets flag → declared fail-state rule → bespoke *told* ending + partial legacy |
| **The hollow win** | standard finale Success, ending copy unreconciled with the sea |
| **Tiresias' prophecy, three fragments** | pack meta-save; one per Underworld visit; knowledge-only unlock |
| **The Oar Road** (true victory) | finale variant: all fragments + oar boon + Poseidon under threshold |
| **No shop** | `costResource` unset (probe pack proves the slot optional) |
| **The bard** (cold open, act intros, recaps, slips, endings) | presenter hooks (`actIntro`, `recap`, `overlayNote`, endings; Stirling bark engine as precedent) |
| **Audience meter + bard interruptions** | deferred post-v1 hook (Q3's one mechanic) |

## Voice law (→ VOICE.md, taste.mjs, GUIDING_EXAMPLES.md)

Register, one line: **Lewis's warmth at the fire, Homer's roll in the telling,
Le Guin's hush in the deep places.** Calibrated across three taste passes:

1. First samples rejected: *"too dry, too close to AI writing"* — clipped short
   sentences, no wasted space, tidy conclusions. The correction: the bard is a
   performer with charisma; rousing epic abundance — long rolling sentences,
   epithets (invented fresh, never stock), direct address, the bard SPEAKING
   aloud in quotes. Inside the tale stays serious; the frame is alive.
2. Second correction: **allow questions and exclamations** — they are
   performance beats, used freely in the frame to work the crowd, sparingly
   inside the tale where gravity rules. (The house ≤1-`!` cap is rewritten for
   this pack: earned, not rationed to death.)
3. Third correction: the meta-frame needs **humor, smart wit, winks to the
   audience** — see the comic engine below.

The laws:
- **Show, don't tell.** Concrete sensory detail or aftermath; stated emotions
  and summarized violence are `taste.mjs` violations. ("The sheep came out of
  the cave unshepherded" beats any sentence containing "grief.")
- **The bard never mocks the tale** — only himself, his rivals, his audience,
  and his fee. The moment the frame sneers at the Odyssey, the stakes die.
- **The long breath lives where the screen can hold it** — narration boxes,
  results, act intros. Card prompts and choice labels stay middle-length so
  320px never chokes.
- **The deep places are silent.** No exclamation nine fathoms down; dread is
  quiet. The frame crackles, the deep does not — that contrast is the voice's
  engine.
- **Frame comedy is wit, never slapstick**, from three engines: the bard's
  vanity and professional economics (wine, figs, payment, rival bards); the
  audience's memory; and **the retelling wink** — jokes about tellings varying
  are the roguelike winking at the player, fully in-fiction, landing twice.
- **The heckler ensemble is canon** across all tellings, so gags accumulate
  across runs like the prophecy does: **the woman by the woodpile** (the
  fact-checker; her grandfather knew a rower), **the potter's boy** (deadpan
  devastation: "Why didn't he just SAY sorry to Poseidon?"), **the man who
  wants the horse** (running gag; "wrong poem, friend — that one costs extra"),
  **Phemios of Smyrna** (the unseen rival who "sings flat, but that is between
  him and whatever god he has offended").
- Violence line: the bard's discretion — offscreen-in-language, no gore.

The ten approved samples (cold open; Act I intro; the Squall card; three result
tiers; the bard slips; Cyclops doors; a god notices; the Calypso cash-out; the
hollow win; the Despair fail) plus the humor-layer samples (retelling wink,
prophecy wink, the child, the bard's vanity, the horse) are canon seeds for
`GUIDING_EXAMPLES.md` — carry them there verbatim in slice 1 from this
interview's transcript.

## Visual law (→ STYLE.md)

**"Black-figure, bitmap."** Undertale's UI grammar × Greek vase vocabulary.
The screen is the campfire, not a phone app.

- **Field:** lamp-black, faintly warm (the night around the fire). Cards are
  hard-ruled boxes on black, Undertale-style; terracotta lives inside them.
- **Boxes:** everything a hard-ruled rectangle — radius 0, no shadows, no
  gradients. Plain rules for humble boxes; **meander-key friezes** for
  landmarks; a thin **gold fret** for the gods. (That substitution — plain
  double-rule → meander — is the whole thesis: same grammar, different
  civilization.)
- **Type: full pixel commitment** — bitmap fonts throughout, body text
  included (OFL-licensed, self-hosted, tiny; `big-text` mode is the
  accessibility escape hatch). Display face: blocky lapidary caps.
- **Palette:** bone-white rules/text on black; **terracotta** panels and
  figures; **gold** as selection/emphasis (Undertale's yellow, aged);
  **wine-dark oxblood** only when the sea itself speaks. Flat fills only.
- **The narrator line:** the bard speaks in asterisk-cadence boxes
  (`* The sheep came out of the cave unshepherded.`).
- **The ember:** our soul-cursor — a small pixel flame as cursor/selection
  marker, the fire of the telling following your finger. When a run dies, the
  ember gutters.
- **Figures:** flat black-figure pixel silhouettes (ship, oar, owl, trident,
  one-eyed giant) as chunky SVGs, `image-rendering: pixelated`.
- **Authority = band, not neon.** No glow shadows, no gradient-clipped logo
  text (the siblings' two loudest tics, banned). Motion is ember-slow; nothing
  pulses.
- **The line we must not cross:** we take Undertale's *grammar* (black field,
  ruled boxes, bitmap type, flat accents, narration cadence, meaningful
  cursor) and **none of its vocabulary** — no hearts, no FIGHT/ACT/ITEM/MERCY,
  no SAVE stars, no character references, no copied assets ever. Homage reads
  as taste; cloning reads as theft.
- **Prerequisite:** the `css/style.css` tokenization pre-slice (music
  pixel-identical as defaults). Portraits/key art are out of v1 and will need
  their own identity consistent with this direction — not the LI pipeline look.

## Constraints

Inherited, treated as law: zero engine/shared-type edits (a needed engine
change is a stop-and-discuss, never a quiet edit) · phones are the platform
(320px, mobile-matrix green) · full gate suite + pinned goldens + sim `--check`
per merge · taste machine-enforced before any content merges · small slices,
each green on main · writer ≠ grader.

Set in this interview: **show-don't-tell** (law with teeth) · **adversarial
review after every pass** · balance band **35–50% standard win / <10% true
victory post-unlock** · **LI-style taste verdict loop** with the human ·
legacy points stay cosmetic · violence at the bard's discretion, no gore.

## v1 scope

**IN:** the full voyage (3 acts, ~28-card runs, three landmarks with the
three-door grammar, boons) · Nostos/Kleos crossroads · four fires · two fail
states · temptation cash-outs · **the prophecy meta-arc + hollow win + true
victory** · bard voice in every string · black-figure-bitmap theme · deck
target **~60–80 authored cards** (fewer, denser; variance from gates/boons
making the same card read differently).

**OUT (with reasons):** Audience meter + bard interruptions (frame mechanics
wait until the voyage proves fun) · portraits/key art (needs its own art
identity) · minigames, feeds, share cards (luxuries, not core) ·
daily/comeback/gauntlet (meta modes come after the loop earns them) · shop ·
playable Oar-Road epilogue (true victory is a finale variant in v1).

## v1 slices (each green on main; in/out declared per slice; adversarial review between passes)

1. **Design record + taste layer** — this doc finalized; `CONTEXT.md`;
   `VOICE.md` + `taste.mjs` + `GUIDING_EXAMPLES.md` (seeded from the approved
   samples); `STYLE.md`. No content before the taste gate exists.
2. **CSS tokenization pre-slice**, then **green skeleton** — `npm run new-pack
   -- odyssey`, reshape manifest to the real taxonomy (3 stats, 3 resources,
   segments, crossroads, paths + gates, fail states, four fires, stub deck);
   golden pinned, sim band set, validated, deployed. Playable and boring, on
   purpose.
3. **The three landmarks** — Cyclops, Underworld, Suitors with full three-door
   grammar + first boons + smoke assertions driving every door on every gated
   surface, asserting the run still reaches an ending.
4. **The sea** — the connective deck, act by act, in voice, through the taste
   gate. Biggest writing slice.
5. **Temptations** — Lotus / Circe / Calypso cash-outs.
6. **The prophecy** — fragment meta-save, foreknowledge gates, hollow-win
   framing, true victory.

Post-v1 backlog, in rough order: Audience meter + bard interruptions (the
deferred Q3 hook) · key art with its own identity · playable Oar Road ·
"Spoils of Troy" trading if its absence is felt · daily/comeback modes.

## Watch-outs (named bets to re-check against reality)

- **Full-pixel body text at 320px** — the identity bet most likely to need
  renegotiating once real prose hits real screens. Escape hatch: big-text
  mode; fallback position: pixel display + clean body.
- **Epic breath on a phone card** — the voice wants long sentences, the card
  wants economy. The "long breath lives where the screen can hold it" law is
  the treaty; watch it under crowding/mobile-matrix.
- **Two paths** = less path-variety than music; the bet is that builds + boons
  carry replay variety. Judge with `simulate-pack` narratives and real play.
- **Cash-outs being situationally optimal** risks "the game nudged me out of
  the true ending" resentment — mitigated by every stop being a *told* ending
  with real closing copy, never a failure screen.
- **Balance numbers and the subtitle wording are placeholders** until play
  and voice work prove them.
