# Can the villa feel alive on swipe cards alone?

A short companion note to [`V4-DESIGN.md`](./V4-DESIGN.md), capturing a design
Q&A with Viktor (2026-07-05) about the *hardest* v4 pillar: Hillevi's "the villa
is a living web of 5–7 couples." The worry: our only game-design verb is the
**swipe card** (a moment dealt to the player, choose one way or the other). Can
that narrow language express a world that feels alive *around* you — NPCs with
their own storylines, moves that ripple — without turning into a different genre
(a social sim)?

**Short answer: yes, and the swipe card is well-suited to it.** There is direct
precedent — *Reigns* makes a whole kingdom feel alive with nothing but a two-way
swipe, purely by having cards reference a world the player doesn't control and
remember what they did. "Feeling alive" is a perception you build in the player's
head, not a simulation you render. The card is a narrow window; you make the room
behind it feel large by controlling **what walks past the window**.

## Widen what a card is *for*

Today almost every card is *"a choice you drive."* To make the villa feel alive,
a meaningful fraction of the deck has to become other things:

- **Witness cards** — the world moves and you just *see* it. *"You clock Marco
  pulling Grace for a chat by the fire pit — and she's smiling."* The event
  asserts other people have lives; your choice is only your *relationship to* it.
- **Consequence cards** — a card that exists *because* of a move you never made.
  *"Marco's head turned at Casa. Now Grace is single — and she's pulling YOU."*
  The player never watched the sim tick; the card is the **evidence** it did.
  (The engine already gates card eligibility on state — this is that mechanism
  pointed at NPC state.)
- **Gossip / rumour cards** — the most swipe-native way to deliver off-screen
  life, and the pack already has a gossip plugin. *"Word reaches you: Sam and
  Ellie did bits in the Hideaway."* One card just made two other people real.
- **Callback cards** — memory is what makes a relationship feel like a
  *relationship*. *"Remember when you swore to Liv you'd never go there? She
  remembers."* Continuity read out of the `cardLog`.
- **Cascade sequences** — the interdependency Hillevi loved, expressed as
  *sequential* cards: *"Marco chooses… Grace." → "That leaves Liv single. Liv
  chooses…"* You witness the dominoes fall, one card at a time.

The point: you don't need a new verb. You need to use the verb you have to point
**outward** more often — cards that *witness* and *remember*, not only *decide*.

## The division of labour that makes it work

The card doesn't carry the living world alone — and it shouldn't. v3 already
built the other half: the **Clarity Layer** (the relationship stage with the
Partner/Rival/Bombshell faces, the *"PREVIOUSLY, IN THE VILLA"* recap — see
[`V3-NOTES.md`](./V3-NOTES.md)). So:

- **the card expresses the *moment*** — what's happening, and what you do about it;
- **the clarity / presenter layer expresses the *continuity*** — who these people
  are, how it's going, what just changed.

Cards alone would strain (the player drowns in *"who's Grace again?"*). Cards
**plus** the stage-and-recap layer carry a living villa comfortably. That
partnership is the whole answer.

## Two honest limits

1. **Bandwidth.** A deck can foreground only ~2–3 background storylines before it
   gets crowded and illegible. We will *not* make all 5–7 couples equally alive —
   and shouldn't. TV doesn't either: you follow a couple of B-plots, the rest is
   ambient. "Living web" in practice = *a few tracked threads + ambient flavour.*
2. **Witness, don't steer.** The card can't hand you god-control of other
   couples — but that's *genre-correct*. On the show you can't control them
   either; you watch, gossip, react, and get dragged in. The swipe expresses your
   *relationship to* the living world, not command over it.

## Grounding in the research

Pressure-tested in [`V4-THEORY-REVIEW.md`](./V4-THEORY-REVIEW.md); the parts that
bear directly on the swipe-card medium:

- **Reigns is the reference implementation.** It runs a whole living kingdom on a
  two-way swipe by recompiling a card **"bag" against global state** every turn:
  event chains weight follow-up cards *into* the bag, and resolved threads are
  *removed* from it. That is exactly our witness/consequence/foreground-a-few-
  threads model — proven, in our medium. (Design note: **remove a resolved
  thread's cards** so a long deck doesn't silt up.)
- **The background couple-graph is a *drama manager*** (Mateas & Stern). Hold it
  to the four interactive-drama QA axes — **pacing, coherence, autonomy,
  dramatic arc** — and heed the field's hard lesson: *fully emergent* social sim
  rarely reads as coherent story, which is why "mostly scripted" is correct.
- **The ~2–3 thread cap is a cognitive-load ceiling, not a taste call.** Working
  memory holds ~7±2 items total (Miller), shared with your own couple, the
  factions, and your stats. The v3 Clarity Layer earns its keep by **chunking**
  the cast so the whole villa isn't in working memory at once.
- **Consequence cards must feed back visibly** (Sid Meier's interesting
  decisions): a move you didn't make can *find* you via a card, but the card
  should let the player trace the "why", or it reads as arbitrary.

## Where the cost actually is

Not the medium — the medium is sufficient. The cost is **authoring**:
witness/consequence/callback cards that read off a lightweight background
couple-graph are harder to write, and keeping them legible is craft. And the sim
behind them should stay **mostly scripted**, not a full autonomous agent model —
enough state that moves ripple and stay legible, no more. Overbuild the
simulation and you've quietly changed genres. This keeps v4 firmly inside the
card-driven-narrative game we already have (see the engine-fit verdict in
[`V4-DESIGN.md` → "A note for the builder"](./V4-DESIGN.md#a-note-for-the-builder-engine-split)).

---

*Provenance: design Q&A with Viktor, 2026-07-05, following the Hillevi interview.
Companion to `V4-DESIGN.md`; not a spec — a shared understanding to carry into
the ADRs.*
