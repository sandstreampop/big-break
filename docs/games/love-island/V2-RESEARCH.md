# v2 research brief — what makes the villa *fun*

**Status:** design record, not a spec and not built code. Gathered during the
grilling session for Love Island v2 (the "make it feel like LOVE ISLAND" pass),
to position the design doc on state-of-the-art patterns for our genre and
audience. Findings are mapped onto the eight decisions already locked in that
session (see the running grill notes / [`grill.md`](./grill.md)).

## Audience & genre framing

Our reference audience is the Episode / *Choices* / *Love Island: The Game*
crowd — a **large, adult-skewing, heavily female** interactive-fiction audience
that shows up for characters, relationships, drama and serialized story, not for
systems mastery. Episode alone has 10B+ episode views across 150k+ stories and
built its success by "pursuing a predominantly young female user base"
([Game Developer](https://www.gamedeveloper.com/business/how-i-episode-i-became-the-world-s-biggest-interactive-fiction-platform)).
The takeaway that governs everything below: **characters and relationships are
the product; systems exist to generate character moments.** That is exactly the
playtest complaint ("the partner is an abstract entity, just a name and a bond")
restated as a market fact.

## Reference teardowns

### 1. Reigns — the swipe, done right (and its failure modes)

Our core verb comes from here, so its lessons are load-bearing.

- **Why the swipe carries meaning:** the designer's own account — *"As soon as
  we weighted the decisions of the player with consequences on the 4 dimensions
  of power, we gave a lot of meaning to very simple swiping gestures."* A binary
  gesture is only as meaningful as the state it visibly moves.
- **Authored chains hidden among random cards make the *whole* game feel
  authored:** *"Even with a minority of cards taking into account previous
  choices, the whole game becomes authored in weird and unexpected ways."*
  → validates our **encounters-among-ambient-cards** mix. We don't need every
  card to branch; a minority of reactive, character-scoped encounters will make
  the ambient deck *read* as reactive too.
- **The lean/tilt preview already exists — and it's exactly your HUD-arrow
  idea, refined:** in Reigns, *"if you drag but don't finish a swipe, you'll see
  a preview of how things will be affected — depicted by small dots that appear
  next to each category… sometimes a little dot, sometimes a big one"*
  ([Gamezebo](https://www.gamezebo.com/walkthroughs/reigns-tips-cheats-and-strategies/)).
  So the state-of-the-art encodes **which** stat moves *and* **how much** (dot
  size), previewed on partial drag. Our "pulse + mark" decision should adopt the
  **magnitude** channel (small/large) and add our **volatility mark** for
  mixed-sign outcomes — a strict superset of the genre standard.
- **The failure modes to design against** (all from Reigns criticism): RNG that
  reads as unfair, being *"forced to choose between two bad choices multiple
  times,"* and *"arcane"* quest lines you can't see coming
  ([GameGrin](https://www.gamegrin.com/reviews/reigns-review/),
  [Steam discussion](https://steamcommunity.com/app/474750/discussions/0/3428846977645765423/)).
  → this is *our* "outcomes felt unearned" complaint in another game. Our
  **forecast + explain** recouplings and **lean-preview** are the direct
  antidotes; the research says they are the difference between the genre's fans
  and its detractors.

Sources: [GDC — The Casual (but Regal) Swipe](https://www.gdcvault.com/play/1024278/The-Casual-(but-Regal)-Swipe),
[GamesRadar](https://www.gamesradar.com/how-reigns-convinced-two-million-people-to-swipe-right-to-rule-their-kingdom-and-captured-the-game-of-thrones-license/).

### 2. Love Island: The Game (Fusebox) — the direct competitor's own reviews are our design spec

This is the closest existing product to ours, and **players criticize it for
precisely the things our locked decisions fix.** From App Store / Metacritic /
JustUseApp reviews:

- *"You literally do not make a single choice that matters"*; *"no matter what
  route you chose you'd end up the same."*
- *"There's absolutely no branching… all the routes are the same and the
  'different' love interests all say the same thing… word for word."*
- *"Everything costs an arm and a leg… constant pressure to buy gems"*; the
  *"good" choices and "cool" outfits are locked behind premium currency.*
- The game *"doesn't give you the opportunity to friend-zone people or tell them
  you aren't interested."*

Sources: [App Store reviews](https://apps.apple.com/us/app/love-island-the-game/id1522699215),
[Metacritic](https://www.metacritic.com/game/love-island-the-game/),
[JustUseApp](https://justuseapp.com/en/app/1522699215/love-island-the-game/reviews).

**Our differentiators fall straight out of this list:**

| Fusebox failure | Our v2 answer (already decided) |
|---|---|
| Choices don't matter; routes converge | Branching dialogue **encounters** + real **character state** (opinion/mood/secret) that outcomes read from |
| Love interests are interchangeable, same lines | **First-class Partner/Rival**, mood-driven **portraits**, dialogue-first voice per character |
| Gem-gated "good" choices | We're a free Pages build — **agency is the product, nothing is paywalled** |
| Can't reject / friend-zone | Our loyalty↔temptation choices already carry consequences; **gossip currency** makes rejection a *move*, not a dead end |

This table belongs in the design doc as the "why v2 wins" framing.

### 3. Persona social links — how to make a relationship first-class

The genre-defining model for "a person, not a number":

- A relationship is **~10 ranks**, raised by spending time and by **"replying in
  ways the character likes"** for bonus progress
  ([RPG Site](https://www.rpgsite.net/feature/13722-persona-3-portable-social-link-guide-full-s-link-walkthroughs-dialogue-options)).
  → directly models our **encounter** loop: choices tagged to a character's
  preferences move their **opinion** faster; the branching dialogue *is* the
  "spending time."
- **Relationship progress gates power elsewhere** (arcana fusion). Half the game
  is leveling links; it *matters* because it feeds the other half
  ([Medium — Michelle Kwan](https://mchllshell.medium.com/the-brilliance-that-is-the-social-link-system-of-the-persona-series-4bf5eadd3567)).
  → our version: **Bond/opinion should gate recoupling survival and unlock
  encounter branches** (it partly does via `bondFloor`; v2 makes the link
  legible and dramatized, not just a hidden floor).
- Routes can go **friendship / temporary-lovers (bad end) / true romance** —
  relationships have *shapes*, not just magnitudes.
  → supports **mood + a secret** on top of a raw opinion score.

### 4. Hades — the architecture for "Stirling, constantly present, never stale"

Our Stirling decision (guaranteed at beats + opportunistic templated reactions,
rate-limited) is exactly the **bark system** pattern, and Hades is its apex:

- **21,020 voiced lines**, and the system **avoids repeats until every unused
  option is exhausted** — freshness for tens of hours
  ([christi-kerr.com](https://www.christi-kerr.com/post/how-the-dialogue-system-in-hades-rewards-failure),
  [Game Developer / GDC 2021](https://www.gamedeveloper.com/audio/dive-into-the-dialogue-of-i-hades-i-at-gdc-2021)).
- Architecturally it's *"a bucket of possible conversations, filtered by gameplay
  conditions and weighted by importance and immediacy."*

→ **Adopt the architecture, not the line count.** Stirling should be a
condition-filtered, priority-weighted line bucket with **no-repeat-until-pool-
exhausted** selection. Authored beat lines get top priority/immediacy; templated
reaction lines fill the gaps. This is the single most important cross-run
finding: the reason a commentator feels alive is *no-repeat selection over a
condition-filtered pool*, and it's what will save us across the **5-runs-in-a-
row** playtest cadence that exposed the current repetition.

### 5. Stanley Parable — the Stirling character model

A **dry, sarcastic British narrator** whose *relationship to the player shifts
based on their choices* (guide → antagonist → friend), delivering *"play-by-play
commentary and critique of the player's own choices"*
([Stanley Parable Wiki](https://thestanleyparable.fandom.com/wiki/The_Narrator)).
This is almost literally Iain-Stirling-as-system: British, wry, *reactive to what
you did*, and — crucially — **more compelling when adaptive than when static
flavor.** → Stirling should track a light stance toward the player (rooting for
you / clocking your game / delighting in your mess) that colors his lines, not
just fire neutral quips.

### 6. Gossip & emergent "moments" — the source of shareable drama

- Gossip-as-mechanic precedent: *Sol Trader* uses **information as currency** —
  you gather intel and spend it to advance; *GossipMaster*'s rumor-spreading is
  its core currency; social-sim event triggers **propagate along a social
  network**, and *"gossip alters evaluations and drives community-wide opinion
  shifts"*
  ([Game Developer — social simulation](https://www.gamedeveloper.com/design/thinking-about-people-designing-games-for-social-simulation),
  [Grokipedia](https://grokipedia.com/page/Social_simulation_game)).
  → validates **gossip as a held currency you gather and deploy**, with deployment
  shifting moods/secrets and cascading into recoupling danger. Even a light
  network (Partner / Rival / active bombshell) produces the cascade.
- Why this yields "MOMENTS": emergent-narrative research is consistent — memorable,
  shareable moments come from **relinquishing control *within* authored systems**;
  *"improvised narrative fosters ownership and agency… deeply personal and
  memorable moments"*
  ([Game Developer — emergent storytelling](https://www.gamedeveloper.com/design/the-unique-power-of-emergent-storytelling)).
  → the playtest cry for "MOMENTS" is not answered by *more scripting*; it's
  answered by **a small set of interacting systems (opinion × mood × secret ×
  gossip) that the player drives.** Encounters author the *situations*; the
  systems author the *stories*.

## The tension we must hold: legibility vs. immersion

One genuine caution from the choice-design literature: over-telegraphing can
*subvert* agency — *"by overtly validating a player's choice as mattering,
designers unintentionally subvert player agency,"* whereas games like Heavy Rain
keep players inside the character's head by **not** flagging consequences
([Game Developer — when choice becomes a metric](https://www.gamedeveloper.com/design/opinion-when-choice-becomes-a-metric-narrative-design-suffers)).

Reconciliation for our doc: keep the legibility **diegetic and qualitative**,
never a spreadsheet. The lean-preview shows *direction/volatility*, not numbers;
**Stirling** delivers forecasts and verdicts *in character* ("bond's looking a
bit shaky there, babes") rather than a UI readout. That satisfies the "outcomes
felt unearned" complaint without turning the player into a min-maxer — the exact
line Reigns' defenders vs. detractors sit on.

## Refinements to fold into the v2 design doc

1. **Lean-preview = dots with magnitude + volatility mark.** Adopt Reigns' small/
   big dot magnitude encoding on partial drag; add our own volatility marker for
   mixed-sign outcomes. (Refines the "pulse + mark" decision with a proven form.)
2. **Stirling = a Hades-style bark bucket.** Condition-filtered, priority-weighted,
   **no-repeat-until-exhausted**. Authored beats at top priority; templated
   reactions fill gaps; a light **stance toward the player** colors tone
   (Stanley-Parable-style). This is the mechanism that survives 5 back-to-back runs.
3. **Character = Persona-style link, dramatized.** Opinion in visible ranks/tiers
   (not a raw hidden float), gating encounter branches and recoupling survival;
   mood + a secret give the link a *shape*. "Reply in ways they like" = choices
   tagged to the character's preferences roll better / move opinion faster.
4. **Gossip = information currency over a small network.** Gather in encounters +
   Beach Hut; deploy to shift moods / reveal secrets; deployment cascades along
   Partner↔Rival↔bombshell into recoupling stakes. Keep the network small so
   consequences stay legible.
5. **"MOMENTS" come from systems interacting, not more script.** The design doc
   should frame the vertical slice as proving *one encounter where opinion, mood,
   a secret, and gossip visibly collide* — that collision is the moment.
6. **Anti-monetization stance is a feature.** Where Fusebox gates the good choices
   behind gems, our pitch is "every choice is yours." Worth stating explicitly in
   the doc's positioning.

## Open threads still to grill (when you're back)

- **Encounter frequency & length** — how many encounters per act, how many beats
  each, and how they interleave with the ambient deck (the Reigns "minority of
  reactive cards" ratio suggests we don't need many).
- **Recoupling as the encounter climax** — should the ceremony itself become a
  full encounter (Partner + Rival on screen, gossip cashing out), rather than a
  card + queued verdict?
- **Rival arc** — is the Rival a single recurring antagonist for the whole Season,
  or does the "active rival" rotate? (Affects how much character state to author.)
- **Doc + ADR outputs** — which decisions here become ADRs (e.g. "Stirling bark
  architecture", "character-state model", "gossip currency") vs. prose in the
  design record; and how the vertical-slice phase is scoped in
  [`IMPLEMENTATION-PLAN.md`](./IMPLEMENTATION-PLAN.md).
