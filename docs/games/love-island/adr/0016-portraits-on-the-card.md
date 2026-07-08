# Portraits on the card, not just the result (v4)

Viktor, 2026-07-08. The cast portraits (ADR-0015) landed on three surfaces: the
persistent relationship **stage** above the card (Partner/Rival/Bombshell, the
three tracked seats), the **result beat** after a swipe (the reacting face), and
the **roster**/**ending** galleries. But the *dealt card itself* — the scene you
read while you decide — stayed faceless: abstract scene art, then text. A card
that says "says Ollie", drags in your Rival, or watches Marco and Sophia go up in
flames showed none of those faces at the moment of the choice. The people the
villa is *about* only appeared after you'd already chosen, or as a persistent
tracker that isn't tied to the scene in front of you.

The brief: for **every** event where it makes sense, show the people in the
scene ON the card, during the decision — a cohesive pass over all ~330 events.

## Decision

Wire the shell's existing, unused `presenter.cardCast` hook (a portrait strip on
the dealt card, `js/ui/card.ts`) with `villaCardCast` (`cardcast.ts`). WHO a card
bills is read from the card's **own content** wherever possible, so the strip
stays in sync with the writing by construction — add a token, get a face:

1. **Role tokens in the VISIBLE copy** — context / prompt / promptAlt / the two
   choice labels — `{partner} {rival} {ex} {mate} {bombshell}`. The seats resolve
   through the characters plugin (`characterRead`), so a real portrait and the
   live mood win; `{ex}`/`{mate}` resolve through the shared role resolvers
   (`roles.ts`, extracted from the presenter so `fillTokens` and the strip agree).
   Outcome-only tokens are deliberately excluded — a person who appears only in
   one branch's *result* isn't in the scene you're looking at.
2. **A `web:<thread>` tag** → that thread's fixed NPC couple (coupleweb `THREADS`),
   billed first — a triangle card is *about* Marco/Sophia/Amber.
3. **A small hand-authored structural layer** for the set-pieces whose copy frames
   your couple without ever needing a token — recouplings (couple + circling
   Rival), Casa (the Partner left behind, bar the night of new faces → a
   bombshell teaser), Movie Night, the Parents, the Final, and a short
   `PARTNER_SCENES` id set (the couple-knowledge quizzes, the Hideaway, going
   exclusive, the firepit promise). Mirrors the scenes `villaSetPiece` already
   frames.

Capped at three chips, deduped by cast id, and a **pure** read of state
(flavorSeed-seeded flavour draws, never the play RNG) — so it re-renders
identically on resume, stays DOM-free, and has zero golden impact.

Coverage lands at **267/330 (81%)**. The faceless remainder is deliberate: the
villa-wide games and challenges, the nation's Beach Hut / producer questions, the
4 a.m. spiral, and the opening mixer feature *no one in particular* — "where it
makes sense" means they stay faceless. `tools/li-cardcast-coverage.mjs` prints
the faceless list for review as the deck grows; `test/li-cardcast.test.mjs` pins
the inference, purity, cap, and a coverage floor.

## The crowding trade-off (ADR-0009)

The strip lives inside `.card`, above the prompt, so it competes for the card's
height budget. On the roomy phones it fits everywhere. On **short phones**
(≤700px tall), a *set-piece* card is already at its limit — banner + stakes + the
live stage all naming the couple — so an in-card strip pushed the prompt into a
clip at 320×568 / 360×640. Per ADR-0009's tier-yield rule (ambient tiers yield
before the prompt clips, and the set-piece framing already shows the couple), the
strip is hidden on `.card.in-set-piece` under `@media (max-height: 700px)`.
Ordinary cards keep it at every width; roomy phones keep it everywhere. Pinned by
`test/ui/mobile-matrix.mjs` (320×568, 360×640) and `test/ui/smoke.mjs` (the
card-cast lightbox opens on `#overlay-top` and the run still reaches the finale).
