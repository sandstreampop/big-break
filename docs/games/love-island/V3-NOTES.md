# V3 design record — what the Clarity Layer became

**Session:** 2026-07-05 (the v3 build). **Scope shipped:** the Clarity Layer,
then Horizon 1 + 2 of [`ROADMAP.md`](./ROADMAP.md) (R1–R4, R6–R9, R11).
This note records the centrepiece; per-item detail lives in the commit
messages, and overturned advisory verdicts are logged in the ROADMAP header.

## The problem

v2 shipped a deep villa that even experts found hard to *follow*: stats were
small boxes, the Partner/Rival/Bombshell were chips, and what a swipe just
did — to whom, and why it mattered — lived in one line of card text plus a
delta chip. The play loop had no in-between: no beat that says *here is what
just happened*, no transition that says *here is where the story stands*.

## The shape of the fix

Four **generic, feature-detected presenter slots** (the overlay-note channel
was the precedent; these are its siblings). The shell renders layout and
knows no villa word; a pack that omits them is byte-identical; all villa
content lives in `js/packs/love-island/clarity.ts`. Everything is a **pure
read of run state** — no rng, no writes — so deals re-render safely on
resume, the sims never see it, and the whole layer is golden-safe by
construction.

1. **`presenter.stage`** — the persistent relationship stage. Partner /
   Rival / Bombshell as first-class faces between the HUD and the card:
   name, opinion tier (the Partner's cold tier reads *early days*, because a
   fresh couple isn't "ice cold"), mood worn as the ring, threat state
   (*on the move*), 🔒 when official, a 💔 *single* alarm when the seat is
   empty. The slot the current scene is about is spotlit. Tapping a face
   opens an inspector sheet: vibe, shape (R7), how it's going, held secrets,
   and one honest rule of the game.
2. **`presenter.resultStage`** — the after-swipe RESULT beat. The affected
   character's portrait reacts front and centre (their post-resolution mood
   face); below the outcome text, qualitative movement lines: the Bond
   warms / builds / craters (tier crossings said plainly — *"you're
   basically strangers again"*), the Rival files it, the spiral gets louder
   or quieter. The keys spoken qualitatively lose their numeric chips
   (`hideChipKeys`); scoreboard resources (Public, Followers, Graft) and
   core stats keep compact chips because the HUD shows those numbers one
   inch above — hiding them in the result while showing them on the rail
   would be incoherent, and ADR-0006's rule is specifically about
   *character* state.
3. **`presenter.recap`** — "PREVIOUSLY, IN THE VILLA," the act transition
   as a full-screen episode title card in Stirling's voice. Four blocks,
   all honest reads of real state: the story so far (composed from what
   actually happened — Casa outcome, Movie Night reveals, the ceremony
   verdict, a bumpy-start read off the tier log), YOUR COUPLE (tier, lock,
   mood), YOUR INTENTION (declared Summit + per-gate distance in villa
   language — *"barely off the sun lounger"* → *"there already"* — B2's
   legibility fix, extended to the campaign level per ADR-0008), and THIS
   WEEK (what production does next, including the you-are-not-the-boys
   read and, when your head is loud entering Final Week, the wall warning).
4. **`presenter.setPiece`** — ceremonies, Casa, Movie Night, Meet the
   Parents, the Beach Hut break, and the Final as framed screens: a banner,
   a scene line, and explicit **stakes-in** rows that speak the real
   survival arithmetic (`ceremonyOutlook` — the same numbers Stirling's
   forecast reads, so the honesty contract holds), then **verdict-out**
   framings on the result cards. R11 added a content-free `mood` cue the
   shell plays generically: *triumph* (confetti, win sting) and *blow*
   (stage shake, heavy haptic).

## Taste enforcement

`test/li-clarity.test.mjs` drives seeded seasons through all four reads and
harvests **every string the layer can emit**, then gates the corpus on the
taste floor (`taste.mjs`), purity (no state mutation), the
no-raw-relationship-numbers rule, and stake/survival-math agreement. The
same harness caught two real launch bugs (the bombshell double-seat, the
"ice cold" fresh couple).

## What it displaced

The HUD's relationship chips and the on-card portrait strip (`cardCast`)
are gone from the villa — the stage supersedes both. The generic `cardCast`
hook remains in the shell for other packs.

## Verdict against the brief

Phone-size screenshots (390×844) were reviewed at every step; the final
sweep shows a season an outsider can narrate back: who you're with and how
it's going (stage), what just happened and to whom (result beat), where the
story stands vs your Intention (recap), and what tonight can cost you
(set-piece stakes). The comedy carries the clarity — Stirling explains the
verdict, the recap does the "previously on," and the stakes rows read like
production notes, not a spreadsheet.

## Postscript — v3.1, the screen contract

The v3 Clarity Layer made every state legible; the beta immediately taught
the next lesson: legible ≠ simultaneous. On a real phone the set-piece
screen stacked thirteen bands and clipped the prompt — the one load-bearing
element — to a single line. The fix is [ADR-0009](./adr/0009-progressive-disclosure-screen-contract.md):
three tiers (scene takes space first; one glanceable ambient strip;
everything else one tap away in the status drawer), set-pieces as sequenced
beats instead of stacks, salience over permanence (the In-Your-Head pip
appears only when the meter matters), and a CI layout gate that audits real
seasons at phone viewports so the contract can't silently rot. The stat
rail is gone from the permanent screen because the per-choice governing
icons and the risk tell already carry the decision-relevant stats — the
rail was redundancy dressed as information.
