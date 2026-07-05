# v4 design record — the villa as a living web

Output of a `grill` interview session on **2026-07-05**, conducted with
**Hillevi** — a superfan and domain expert who has seen every season, follows
the meta-discussion, memes, and player behaviour, and tracks how the *format
itself* has changed across seasons. No programming background, and that is the
point: this is a **playtester and viewer's** read of where the game feels unlike
the show, gathered without leading her toward the answers.

Like [`grill.md`](./grill.md) and [`V2-DESIGN.md`](./V2-DESIGN.md), this is a
**design record, not a spec and not built code**. It captures the shared
understanding reached by interviewing, so a later pass can synthesise a PRD (and
graduate the hard calls to ADRs) without re-interviewing. Canonical vocabulary:
[`CONTEXT.md`](./CONTEXT.md). It does not re-litigate ADR-0001…0009; where it
pushes against a shipped assumption it says so.

Scope of the ask: **the next expansive content + mechanics overhaul.** v3 made
the villa *legible* (the Clarity Layer, [`V3-NOTES.md`](./V3-NOTES.md)). v4 is
about making it *true* — the relationships, the social physics, and the reasons
the nation falls for a couple.

---

## The one-sentence problem

> *"Too much focus on the rival, and too little focus on building a relationship
> with my partner."*

That was Hillevi's first, unprompted read. Everything below is what fell out
when we pulled on it. It did not stay a balance note — it opened into a
different conception of what the villa *is*.

## The core reframe: a spotlight → a web

Today the game is **player-centric**: the Rival exists to antagonise *you*, the
Partner exists as a thing *you* have (a name and a Connection number). Hillevi's villa
is the opposite geometry.

> *"Usually there's at least five or six, maybe up to seven different couples at
> the same time. So it's all about the different dynamics… if this boy has been
> interested in this girl, but she's in a couple with someone else, and they
> break up, then maybe the boy sees his chance — and that leaves his current
> partner in a vulnerable position."*

The villa is **a living web of ~5–7 couples**, and the smallest movement
anywhere makes *someone else* vulnerable. Recouplings aren't your isolated
survival check — they're a **cascade**: who one person picks decides whether a
third person gets to stay or goes home.

> *"Depending on which one she chooses, maybe that opens up for someone else to
> choose the other boy, or the other boy will go home. That entirely depends on
> the current dynamics."*

**Design consequence.** The other Islanders need their own connections,
jealousies, and drift — storylines that run *whether or not you're involved*, and
that you often watch from the side. Rebalancing "rival vs partner" is not enough;
the fix is that the room has to be alive. The Rival becomes *one thread in the
web*, not the web's whole antagonist.

> **Can a living villa be expressed on swipe cards alone?** Yes — this is the
> hardest pillar, so it has its own companion note:
> [`V4-LIVING-VILLA.md`](./V4-LIVING-VILLA.md). Short version: widen what a card
> is *for* (witness / consequence / gossip / callback / cascade cards, not only
> "choices you drive"), let the v3 Clarity Layer carry continuity while the card
> carries the moment, foreground ~2–3 threads rather than simulating all seven,
> and keep the background couple-graph *mostly scripted* so v4 stays a
> card-driven narrative and doesn't drift into a social sim.

---

## Pillar 0 — Length is the substrate: the season needs room to breathe

A later note from Hillevi, and a foundational one: **each run is too short.** The
game currently plays a whole eight-week season in **~28 villa moments**
(`actLengths` 8 / 12 / 8 across the three acts — see
[`config.ts`](../../../js/config.ts)). That's a tight, replayable *roguelike*
run. Her verdict as a viewer: it doesn't feel like a *season*. She wants a
**richer, longer experience** — more content per run — not another quick loop.

This isn't a fourth request bolted on; it's the **enabling condition for every
pillar above it**:

- You cannot build a **relationship-as-a-garden** (Pillar 1) — slow accumulation,
  inside jokes, a connection you *watch* grow — in ~28 beats. A garden needs
  days. Grafting only reads as grafting if there's time to do it repeatedly.
- The **living web** (the core reframe) needs runway for other couples'
  storylines to *set up, drift, and pay off*. Ripples need time to travel.
- The **season spine** (day one → first bombshell → Casa → Movie Night →
  families → Final) is a lot of tentpoles; at 28 cards each gets ~3–4 beats, so
  everything arrives rushed and telegraphed. The arc has no *middle*.
- The show's **duration is part of the fantasy** — eight weeks locked in together
  is *why* friendships and real connections form at all.

**Design consequence.** Fill the extra length with **arc, not filler.** The new
runtime should go to: the **daily-rhythm texture** Hillevi described (the morning
coffee, the fire-pit debriefs, "where's your head at?") and the outward-pointing
card types from [`V4-LIVING-VILLA.md`](./V4-LIVING-VILLA.md) (witness / consequence
/ gossip / callback beats) — *not* more of the same choose-left-or-right cards.
Length should read as "a season with quiet days and big nights," not "a longer
grind."

**Honest tensions to decide at the ADR stage (not here):**

1. **This trades against the roguelike identity.** Short runs bought
   replayability, tight pacing, and low commitment; the three-Summit divergence
   *rewards* replaying. Longer runs risk pacing sag, repetition, and fatigue.
   There's a genuine **positioning fork** — *"short replayable roguelike"* vs
   *"a longer narrative season"* — and it's Viktor's call, not a detail. Laid out
   as an explicit A/B/C choice in
   [`V4-POSITIONING-FORK.md`](./V4-POSITIONING-FORK.md) (recommendation: the
   hybrid — a longer season built from short "weeks").
2. **Everything numeric is tuned to ~28 cards** — `actWear`/burnout, `jitterByAct`,
   the win gates, the seeded-arc slots — and the **golden masters** pin it.
   Extending re-tunes all of it and deliberately re-baselines the goldens.
3. **Anti-repetition has to scale with length.** The novelty weighting and
   `seenCards` machinery already exist; a longer deck leans on them harder, plus
   the daily-rhythm beats must have enough variety not to feel samey.

**Levers (options, not a decision):** raise `actLengths`; add acts / a longer
middle; or — most on-theme — introduce a light **week/day structure** so the
season has a real weekly rhythm, with quiet daily beats between the tentpoles.
The right answer is likely structural (a rhythm), not just a bigger number.

---

## The design pillars

### 1. A relationship is a garden you tend daily — not a number you buy

Asked what it looks like when a couple is *believably* building something:

> *"They have real conversations and inside jokes — you notice the relationship
> develops. And in the everyday villa life it's the little favours: the boys make
> coffee in the morning (often iced coffee) for the girl or girls they're
> courting."*

Three components, none of which is a single big delta:

- **Small daily gestures** — the morning coffee. Acts of service, repeated.
- **Inside jokes** — which *require memory*: something that happened yesterday
  comes back today. A relationship that references its own past.
- **Visible development** — the viewer can *see* it grow over time.

**Design consequence.** Connection should be **accumulated and remembered**, not
purchased with one grand romantic card. This is exactly the show's word:
**grafting** — and Hillevi was clear it is *a verb you do to a person, day after
day*, not a resource you hoard. (The pack already ships a `graft` resource; v4
should make grafting the daily-gesture *action*, and let it leave a trace — a
callback the game can raise later as an "inside joke" beat.)

> **Vocabulary — say "Connection", not "Bond".** Hillevi's correction, and a
> load-bearing one for the authenticity principle: in the villa Islanders talk
> about a **connection** ("I've got a strong connection with him"), never a
> "bond". The player-facing meter should read **Connection** everywhere. The
> engine resource keeps its internal id (`bond` in
> [`manifest.ts`](../../../js/packs/love-island/manifest.ts)/`CONTEXT.md`) — this
> is a display-name and copy rename (`RESOURCE_META.bond.name` + every string
> that says "bond"), not a mechanics change. Fold it into the overhaul; keep the
> word the fans actually use.

### 2. Nothing means anything in isolation — everything means something in context

This principle surfaced twice, independently, and is possibly the single most
generative idea from the whole interview.

**Where you take someone** is a ladder of intimacy:

> *"Talking openly in the garden is neutral. To 'pull someone for a chat' is a
> little step. The terrace is charged. The Hideaway is charged for real."*

**When and where you kiss** is the same ladder:

> *"Kissing in a challenge is neutral. Kissing outside a challenge is a big deal.
> Kissing in bed — that's a huge deal."* (…and *"doing bits"* in bed, bigger
> still.)

**Design consequence.** The *same action* carries wildly different stakes
depending on the room and the moment. A kiss is not "a kiss (+X connection)"; its
effect on Connection, on the public, and on your partner's **ick** (see Pillar 6)
should scale with context. This is a clean, reusable scoring rule that can run
through the whole content set.

**A format-currency note (Pillar 0, really):** the Hideaway rules *changed across
seasons* — it went from a couple's reward to a space **only non-couples** use;
sleeping there now reads as a **statement against your current couple**, so people
only do it in a friendship couple or when it's truly over. Model the **current**
format, not a historical composite (see Principles).

### 3. Coupling has two axes: how *real* it is, and how *safe* you are

> *"You always have to be in a couple to stay in the villa… sometimes a boy and a
> girl who don't have a connection just end up together at a recoupling. If no
> one's interested in the other, that's a **friendship couple**. But the goal is
> to get *out* of a friendship couple and into one with someone you actually want."*

So a couple is two orthogonal things at once:

- **How real is it?** — friendship-of-convenience ↔ genuine romance.
- **How safe am I?** — the survival constraint: *you must be coupled to stay.*

A **friendship couple** is a safe parking space you actively want to leave. And
the couple's *state* is a social contract with rules: **open** vs **exclusive /
closed off** governs what behaviour is acceptable (see Pillar 4's bombshell test).

**Design consequence.** Model these as two axes, not one Connection bar. A "secure but
hollow" couple and a "precarious but real" couple are different stories the game
currently can't tell apart — and the *tension between safety and truth* is a
core engine of villa decisions.

### 4. Authenticity is the master key — and it means *consistency*

Every branch of the interview eventually landed here. Hillevi returned to it
unprompted, repeatedly, and asked us to treat it as load-bearing.

> *"People appreciate when someone feels real and authentic. Viewers don't like
> when they feel someone is playing up for the cameras or playing a role — those
> Islanders tend to be disliked."*

Crucially, "authenticity" is not a vibe the game can't reach — she made it
**concrete and mechanical**:

> *"An authentic Islander acts more or less the same with their partner as they do
> with a bombshell, or with their friends. If you say one thing to one person and
> something else to someone else, viewers see you as a player. Fake crying, or
> playing up to gain sympathy — that's game-playing, and it's not appreciated."*

**Design consequence.** Authenticity = **consistency across contexts.** Track
what the player says/does in different rooms — private with the partner, gossiping
with friends, tempted by a bombshell, in an aside to camera — and let
**inconsistency accumulate as hidden "receipts."** Consistency reads as real
(public love + genuine Connection); contradiction is a debt that comes due.

This is also where the shipped **The Brand** summit gets a spine it was missing:

> *"You don't succeed in Love Island if you aren't a character people want to
> follow… but they don't appreciate someone playing up for the cameras."*

Chasing clout must be **dangerous**: the more you perform for the cameras, the
more the nation can turn on you. The Brand path should carry that built-in risk,
not be a safe grind of Followers.

**The public's verdict leaks back into the villa.** A second, separate mechanic
Hillevi flagged:

> *"If someone's partner is voted least favourite, that can change the couple —
> you can see the partner become a bit less interested in them."*

Your standing with the nation changes how the *room* treats you. Popularity is
contagious and unpopularity is repellent — a feedback loop between the public
layer and the private web.

### 5. The public is not one voice — it's factions that want opposite things

The most sophisticated idea of the session. On whether forgiving a betrayal wins
the audience:

> *"Sometimes the public enjoys it — 'lovely couple, good for them.' But if they
> think you forgave too easily, or that he behaved so badly you shouldn't have
> forgiven him at all, then you're seen as a pushover with no backbone — and
> that's damaging. It really depends on the viewer group."*

She described the real split (a more feminist Twitter/Reddit crowd vs. the
"Facebook mums" who root for a couple to stick together no matter what), then
wisely flagged that the *literal* gender/ethnicity politics of that split would be
too fraught and clumsy for a game.

**Design consequence — agreed in the room.** Replace the single `public` scalar
with **audience factions defined by *values*, not demographics**:

- **The Romantics** — stick together, forgive, love conquers all.
- **The Self-Respect crowd** — have a backbone, don't accept mistreatment, walk
  away with your head high.
- **The Drama-lovers** — here for chaos and entertainment; will happily adopt a
  villain.

The same action pleases one faction and angers another. **You can never satisfy
everyone** — which is the truest thing the show teaches, and on its own could
carry the whole overhaul. (This tasteful abstraction was Hillevi's explicit
preference over modelling the real-world split directly.)

### 6. The ick — love's internal lie-detector

> *"You've been getting to know someone, but then something gives you the ick —
> and then it's over."*

Two things make it gameable. First, it's **sudden and (usually) terminal**.
Second — and this is the part that binds it to everything else — its Love-Island
trigger is **inauthenticity felt from the inside**:

> *"If someone comes on too strong, or you get the feeling they're playing you —
> that they're only acting interested because they need to stay in the villa —
> that's an ick."*

**Design consequence.** The ick is the private twin of the public's authenticity
verdict. The nation judges your consistency from **outside** (factions, Movie
Night); your *partner* has an **inside** radar that fires on desperation,
over-pursuit, and **survival-coupling** (Pillar 3's safe-parking read as fake).
The same sin — playing a game — is punished on **both** fronts at once: the
nation cools, and the person beside you gets the ick.

### 7. Betrayal & forgiveness are rebuilt with the *same currency as love*

> *"You grovel a bit. If you're the boy who betrayed the girl, you make sure you
> serve her coffee in the morning, you publicly say 'I'm not getting to know this
> other girl, I'm focusing only on you.' After a few days of that, sometimes she
> forgives him — or vice versa."*

The morning coffee comes back. **Repair uses the exact tools that built the connection:**
a stream of small visible daily gestures *plus a public re-commitment*, sustained
over days. Connection is not a button you press with one grand apology — it is the
garden of Pillar 1, and after a betrayal you water it twice as hard.

The **factional** read applies here too: the public sides with the *betrayed*
(sympathy), and the *forgiver* risks the pushover verdict from the Self-Respect
faction even as the Romantics cheer.

### 8. Winning is about the *story*, not the smoothest couple

The three shipped summits (**Win the Villa / The Real Thing / The Brand**) were
validated — but Hillevi reframed what "Win the Villa" actually rewards:

> *"The couple that wins is usually properly in love and a believable love story —
> but **not** the uncomplicated day-one happy couple. Usually there's been a
> storyline: someone who was jilted and then found true love, or a couple who
> questioned their love, cracked, and got back together."*

**Design consequence.** The public crowns the **earned arc**, not the frictionless
one. A drama-free run should *not* be able to take the crown (v2 already books a
cruisy season as a Partial — v4 should sharpen it so **Win the Villa demands a
narrative**: a survived rupture, a redemption from being dumped, a tested-and-came-
back). Friction isn't punished on this path — it's the entry fee.

---

## The reckoning engine: Casa Amor ↔ Movie Night

Hillevi laid out the season spine and, in doing so, revealed a **paired
set-piece** the game should treat as one machine:

- **Casa Amor** (~week 3–4) is the **temptation and the action**, taken in
  secret / at a distance from your couple, resolved by the recoupling: stay loyal,
  or bring someone back. The fallout days are their own intense arc (your partner
  brought a Casa girl back; or regrets it and wants you back; or you're now
  scrambling for a new partner).
- **Movie Night** (a few days later, once the dust settles) is the **reckoning**:
  the edit comes back on a screen in front of everyone — your partner talking about
  you unkindly, or you seen flirting elsewhere. It is literally the **consistency
  check** of Pillar 4 made into an event: the receipts you accrued in other rooms
  are played back to the whole villa.

Casa is where the **web** moves; Movie Night is where the **edit** collides with
it. Together they are the emotional climax the season is built around.

---

## Content inventory for the overhaul

### Season spine (the appointment-TV order)

1. **Day one** — 5 boys + 5 girls (the **OGs**) enter; coupled either by choosing
   among themselves or by the public (varies by season).
2. **First bombshell** (day 1–2) — usually very attractive; a big deal. Bombshells
   then trickle in through the early weeks.
3. **Early challenges.**
4. **Casa Amor** + the post-Casa recoupling → the fallout arc.
5. **Movie Night.**
6. More bombshells and challenges.
7. **Final week** — families enter (family day / a call home), a big romantic date.
8. **The Final.**

### Set-pieces & traditions (with a currency flag)

- **The kissing challenge** (early) — one gender blindfolded + noise-cancelled;
  the others kiss them and **rate 1–10**. Drama when a love triangle exists and the
  rating ranks one over another. A public **ranking** that exposes hidden feeling.
- **Snog, Marry, Pie** (post-Casa) — each person **kisses** someone they fancy,
  **pies** (cream-pie-in-the-face = rejects / has beef with) someone, and
  **proposes** to someone they value as a person. This maps *exactly* onto the
  three social ties v4 should track: **romance / rivalry / friendship.** A forced
  public declaration across all three axes at once.
- **The heart-rate challenge** — everyone dances provocatively; the result shows
  **whose heart you raised most.** Drama when it isn't your partner (an ex).
  The *body* revealing hidden attraction.
- **The talent show** — late-season, mostly light fun.
- **DROP: the baby challenge** — Hillevi: *"they don't really do it anymore, you
  can scrap that."* A format-currency correction.

### Dumping formats (three distinct exits)

- **Recoupling dump** — you're the odd one out when the music stops.
- **Direct public dump** — the least-favourite couple / boy / girl goes straight
  home on a public vote.
- **Islanders choose** — the public narrows to a **bottom three**, and the
  Islanders vote who stays. *This* is where genuine friendships suddenly become
  survival capital (see Principles — friendship is not strategy, until this moment).

### The narrator (Stirling)

Include him — he's a big part of the **viewing** experience — but frame him
correctly: he speaks **to the viewer only**; the **Islanders never see or hear
him.** Dry, omniscient commentary *about* the player, not a character in the room.
(Consistent with the shipped `stirling` plugin; this is a framing confirmation.)

### Slang that must be present

*pull [someone] for a chat* · *open* / *closed off* · *bombshell* · *cracking on*
(to crack on with someone) · *grafting* (putting the work in on someone — coffee,
acts of service, showing interest) · *doing bits* · *the ick* · *OG* · *Casa* /
*Casa girl* / *Casa boy* · *the Hideaway*.

**The idiom of "the head"** — a whole vocabulary Hillevi flagged, and one the
pack should lean into because it already half-speaks it (the burnout meter is
reskinned as **In Your Head**, see [`manifest.ts`](../../../js/packs/love-island/manifest.ts)):

- ***"Where's your head at?"*** — the check-in question Islanders ask each other.
  The honest answer is how you're reading your couple *right now*, or who you're
  actually interested in. A natural verb for a **relationship-state confessional**
  (to a friend, to camera) — and a prime place to accrue an authenticity receipt
  if your head-at answer contradicts what you say to your partner (Pillar 4).
- ***"turning heads" / "my head's been turned" / "it'll take a lot to turn my
  head"*** — the language of temptation and loyalty. *"Will my head turn at Casa
  or not?"* is **the** Casa Amor question. A head that won't turn is loyalty
  demonstrated (Pillar 4's "choosing your partner when tempted"); a head that
  turns is the pivot that moves the web. This is the natural surface verb for the
  loyalty/temptation test — and it rhymes with the existing In-Your-Head meter, so
  the villa's talk of *the head* (where's your head at → head turned → in your
  head) can read as one coherent idiom rather than three unrelated systems.

### Playable Types

Held at **four** for v4 (Golden Retriever / Game-Player / Influencer / Heartthrob).
Hillevi validated them and — tellingly — kept pulling the conversation back to
texture, language, and authenticity rather than new archetypes. That's the signal
for where the soul is: **fewer new personas, more truthful villa.**

---

## Principles that govern the whole overhaul

1. **Model the *current* format, not a historical composite.** The Hideaway's
   rules changed; the baby challenge is retired. When the show evolves, the game
   should track the live version.
2. **This is NOT a strategy game.** No Survivor/Big Brother alliances or pacts.
   *"This is more focused on actually building relationships."* Friendships are
   **genuine**; they only turn decisive at the islanders-choose dumping. If the
   game makes the villa a cold strategic optimiser, it has missed the soul.
3. **Context is everything.** Nothing means anything on its own; the room and the
   moment set the stakes. This runs through kisses, chats, the Hideaway, gestures.
4. **Authenticity above all.** Every other mechanic hangs under it. Consistency is
   rewarded; performing for the cameras is punished — twice (the nation and the ick).

---

## Deferred / explicitly out of scope

- **The literal demographic politics** of the audience split (feminist-Twitter vs.
  Facebook-mums, and its gender/ethnicity dimension) — deliberately abstracted to
  **values-based factions** at Hillevi's own recommendation.
- **New playable Types** — parked at four.
- **Queer / fluid villa formats** — remain a future Season variant per
  [`CONTEXT.md`](./CONTEXT.md); not opened in this interview.

---

## A note for the builder (engine split)

Per [`CLAUDE.md`](../../../CLAUDE.md), `engine.ts` stays genre-neutral; villa
concepts live in `js/packs/love-island/*`. Most pillars land as pack content and
plugins. Two are the engine-adjacent stretch and deserve early ADRs:

- **The web of ~5–7 NPC couples** with their own drift and cascading recouplings
  (today the cast orbits the player) — the biggest structural change.
- **Factional public** replacing the single momentum/`public` scalar — touches the
  manifest's resources, the win gates (a values read, not a number), and the
  presenter. The single-`public` momentum-clutch assumption in
  [`manifest.ts`](../../../js/packs/love-island/manifest.ts) is what this
  overturns; sequence it deliberately against the goldens.

Everything else (grafting-as-daily-gesture with memory, the context-scaled
intimacy ladder, the two coupling axes, the ick, betrayal-repair, story-gated
Win the Villa, the Casa↔Movie-Night reckoning, the content set) is pack-local and
golden-managed.

---

*Provenance: interview conducted 2026-07-05 with Hillevi (domain expert, superfan,
playtester). Recorded verbatim-in-spirit; her framings — the web, the garden,
context-is-everything, authenticity-as-consistency, the factions, the ick — are
the load-bearing ideas and are attributed to her throughout.*
