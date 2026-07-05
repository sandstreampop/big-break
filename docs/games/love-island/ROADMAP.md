# To the moon — the Love Island advisory report & AI-executable roadmap

**Status:** advisory report, not a spec and not built code — the same class of
document as [`grill.md`](./grill.md) and [`V2-DESIGN.md`](./V2-DESIGN.md), one
layer up: it surveys the *whole* design space after v2 shipped and sequences
what an AI advisor/builder can do about it. Produced by a senior-game-dev-advisor
session on **2026-07-05**, from four evidence streams gathered that day:

1. a full code audit of the shipped pack (`js/packs/love-island/*`, tests, goldens);
2. the live beta telemetry (`telemetry/latest.json`, 2026-07-02 → 07-05);
3. fresh balance simulations (10,000 seeded seasons via `tools/simulate-pack.mjs`);
4. a market sweep of the 2025–26 narrative/romance/reality-TV game landscape.

A jargon-free companion walkthrough of this report ships alongside it:
[`public/roadmap.html`](./public/roadmap.html) (deployed at
`/love-island/roadmap.html` on the Pages site).

Vocabulary per [`CONTEXT.md`](./CONTEXT.md). Decisions that graduate out of this
report should land as ADRs; nothing here re-litigates ADR-0001…0008.

> **v3 shipping status (2026-07-05, the v3 build session).** Horizon 1 + 2
> shipped: **R1 ✅ R2 ✅ R3 ✅ R4 ✅ R6 ✅ R7 ✅ R8 ✅ R9 ✅ R11 ✅**, plus the
> **Clarity Layer** (the v3 centrepiece — see
> [`V3-NOTES.md`](./V3-NOTES.md)) and C2a's gauntlet flag from R5. Still
> open: R5 (front door/cross-promo), R10 (the rename — staged, human pick),
> R13 (standing routines), Horizon 3. Prepared-not-decided items for Viktor:
> [`FOR-VIKTOR.md`](./FOR-VIKTOR.md).
>
> **v3.1 (same day):** beta feedback — *too much information at once on
> every screen* — answered with the progressive-disclosure screen contract
> ([ADR-0009](./adr/0009-progressive-disclosure-screen-contract.md)):
> compact HUD + status drawer, set-pieces as sequenced beats, the recap's
> flavour folded, and a CI layout gate (`test/ui-crowding.mjs`) that fails
> the build if any card's prompt ever clips again.
>
> **Verdicts overturned in execution, with evidence:**
> 1. **A1(b) loyalty gate "modest raise to ~76" → shipped 80.** Under the
>    narrative policy the realthing cohort self-selects loyalty-rich, so at
>    76 the gate stayed decorative (misses in ~5% of non-success finales).
>    At 80 it misses in 42% — a real second axis — and conditional success
>    landed at 43% (band 36–44).
> 2. **A2 "a third interstitial tier where a bad choice is the Walk" →
>    shipped that PLUS a Final Week wall** (pack fail state: In Your Head
>    79+ in act 3 ends the Season). Burnout peaks concentrate almost
>    entirely in act 3; the interstitial alone produced 0.5% walks against
>    the 3–5% target because its own relief branches rescued everyone. The
>    ladder (50 → 75 → the break at 76 → the wall at 79) hit 3.8–3.9% at
>    10k, fully telegraphed (wobble copy, act-3 recap warning, Stirling,
>    stat/help text).
> 3. **Season length: The Turn runs 15 days (was 13).** The Bestie arc
>    (R7/D2) without the stretch ate act 2's ambient tissue and broke The
>    Brand's band (34→26.5%); with it, ambient share matches v2 and avg
>    season is 33.2 cards — inside the ≤36 tripwire. Finale gates re-trued
>    for the longer Season: public 79, followers 60, charisma 62.
> 4. **B2's gate-distance reads** landed inside the Clarity recap's YOUR
>    INTENTION block rather than as Stirling act-intro lines — same honest
>    read, a better surface (it sits beside the couple/threat blocks).

---

## 1. Executive summary

**Where we are.** The villa pack is *done* in the v2 sense: every phase of
[`IMPLEMENTATION-PLAN.md`](./IMPLEMENTATION-PLAN.md) (A–D and V1–V4) is complete
in code, with no stubs or TODOs left. Shipped mass: **104 events, 5 branching
encounter arcs (17 encounter cards), 78 Stirling bark lines across 8 pools, a
16-member Cast, 8 playable personas, 6 Angles, 11 secrets, 12 trophies, 11
authored endings**, 24 golden traces, and 6 LI-specific test files. The engine
spine held: no engine line names a villa concept.

**What the beta says.** The game has ~20 real visitors (SE, overwhelmingly
mobile Safari), of whom 5 became players and 4 finished a run — plus one
42-run whale. Love Island is **18% of all swipes** (282/1,559) and roughly
8 finished Seasons. The two loudest signals: **the funnel leaks at the top**
(20 visitors → 5 players), and **the villa is buried** (a sibling URL off a
music-game front door, no cross-promotion, no LI onboarding — `tutorialEvents`
is literally `[]`).

**What the simulator says.** Overall success is **32.1%** — comfortably inside
the 25–40% band. But the three Summits are lopsided: The Real Thing converts at
**49.2%** (Loyalty is over-supplied — it caps at 100 in *half of all finales*),
The Brand at **31.6%** with the highest failure rate (Charisma income is mostly
a consolation prize on bad rolls), and the only mortality that exists is being
dumped single at a recoupling (**21.6%** of seasons; burnout kills 0.02%).

**What the market says.** Love Island USA S8 is breaking Peacock records *as of
this month* (824M minutes in 3 days). The audience is under-30, mobile-first,
second-screen native. The direct competitor's fatal flaw is gem-gated choices;
Netflix's un-gated stories are eating it. The proven retention pattern for our
shape is the roguelike-narrative loop (Hades: every failed run reveals more),
and the proven growth pattern for tiny web games is the daily-seed + emoji
share grid. LLM-driven NPCs shipped elsewhere in 2025 and underwhelmed —
hand-authored, taste-linted writing over systemic state remains the open lane.
And one structural warning: **"Love Island" is an actively licensed ITV
trademark** (Fusebox renewed through ~2027).

**The thesis.** Three compounding bets, in order:

> **Bet 1 — Finish the fun.** Fix the three sim-proven imbalances, give the
> villa a first-session welcome, and make the fail state legible-fair. A
> leaky-top funnel only matters if the bucket underneath holds water.
>
> **Bet 2 — Build the reason to return.** The Daily Villa (one shared seeded
> season/day + spoiler-safe emoji recap), cross-season memory (islanders
> remember your last season — the Hades pattern in villa clothes), and
> unlockable personas. This converts the run-based shape into a habit.
>
> **Bet 3 — Then widen the funnel.** Front-door cross-promo, a one-sentence
> screenshotable pitch ("Reigns, but you're in the villa — and every choice is
> free"), an identity of our own (rename before promoting), and distribution
> (itch.io mirror, PWA polish) — timed to the annual June–August Love Island
> broadcast window.

**Why an AI can drive this.** This repo is unusually well-built for autonomous
iteration: machine-checkable taste (`taste.mjs` + `tools/taste-core.mjs`),
seeded golden masters, a 10k-seasons-in-seconds simulator, cross-pack
invariants, a headless UI smoke test, and telemetry pulls as data files. Almost
every action below is expressible as *one session that lands green on `main`*.
The short list of things that genuinely need Viktor is in §5.

### The top 10 actions (ranked)

| # | Action | Bet | Size | Detail |
|---|---|---|---|---|
| 1 | Balance session: trim Loyalty, feed The Brand, arm In Your Head | 1 | M | R1 |
| 2 | First-Season onboarding: Stirling as the tutor | 1 | M | R2 |
| 3 | Telemetry v3: per-pack coverage + villa-specific event props | 1 | S | R3 |
| 4 | The Daily Villa + emoji recap share card | 2 | M | R6 |
| 5 | Front door, pitch line, cross-promo between the two games | 3 | S | R5 |
| 6 | Content mass 3: Partner shapes, the Bestie arc, Stirling 78→160 | 2 | L | R7 |
| 7 | Mode parity: weekly gauntlet + comeback ("the redemption season") | 2 | S–M | R8 |
| 8 | Cross-season memory (villa roguelike layer) | 2 | L | R9 |
| 9 | The rename decision (AI prepares, human decides) | 3 | S | R10 |
| 10 | Standing routines: nightly telemetry pull, weekly advisor report | ops | S | R13 |

---

## 2. Evidence base

### 2.1 What is actually shipped (code audit)

The pack is 6 plugins + manifest + presenter + ~4,200 lines of pack source,
assembled in `js/packs/love-island/pack.ts` (plugin order is golden-load-bearing:
`[coupling, profile, characters, gossip, producers, stirling]`).

| Layer | State | Where |
|---|---|---|
| Coupling / Bond / ceremonies | Full ADR-0002 model incl. 4-beat ceremony climax (forecast → last stand → gossip cash-out → verdict) | `plugins/coupling.ts` |
| Character state (opinion/mood/secret) | Full ADR-0006: 4 opinion tiers, 6 moods (ttl 4), 11 secrets across 3 pools | `plugins/characters.ts` |
| Gossip currency | Full ADR-0007: intel inventory (cap 3), gather/deploy, Partner↔You↔Rival cascade, ceremony sink | `plugins/gossip.ts` |
| Stirling bark engine | Full ADR-0008: seeded, stance-filtered, no-repeat-until-exhausted; 78 lines, deal-time + result-time channels | `plugins/stirling.ts`, `stirling-lines.ts` |
| Producers (format scheduler) | Beat windows per act, Casa at act 1→2, gendered ceremony at act 2→3, `refineDeck` anticipation lock | `plugins/producers.ts` |
| Profile (Public/Followers/Graft/Angles) | Daybed shelf economy, exposed-on-botch villain Angle, exclusive-couple clout penalty | `plugins/profile.ts` |
| Encounters | 5 arcs: Rival Act-1 (the V1 slice), Partner Act-1, Rival's-move Act-2 (state-gated entry), Partner Act-3 (tier-gated), Second Wave | `events-encounters.ts` |
| Set-pieces | Casa Amor chain, postcard/Movie Night reveals, bombshells incl. rare immediate steal, Meet the Parents, wobble interstitials | `events-*.ts` |
| Presentation | Mood-driven portrait strip, relationship-forward HUD, overlay-note channel, 11 endings, 12 trophies, headlines/DMs/epilogue | `presenter.ts`, `css/love-island.css` |

**Deliberate absences** (decided, not forgotten): minigames (ADR-0004),
non-hetero formats (ADR-0003), Angle upkeep.

**Unplanned absences** (parity gaps vs the music pack, all cheap to close
because the capability slots already exist and are feature-detected):

- **No onboarding at all** — `tutorialEvents: []`, no `tutorialStart`. Music
  ships a real First Gig tutorial.
- **No weekly gauntlet** — music sets `presenter.gauntlet: true`; LI omits it.
- **No comeback mode** — music ships `Pack.comeback`; LI doesn't.
- **No perks** — music ships `MUSIC_PERKS`; LI has none.
- Daily mode is engine-generic and LI's `shareText` already handles
  `summary.daily` — that one is shared plumbing, not a gap (but see R6 for
  making it a *loop*, not a mode).

### 2.2 What the beta telemetry says (2026-07-02 → 07-05)

Small numbers — directional, not statistical. Read them as smoke, not fire.

- **Reach:** 20 distinct installs, 19 in Sweden (the owner's network), 11/20 on
  iOS Safari, 4 Android Chrome, 4 via Facebook's in-app browser. Mobile is
  ~95% of events. **Mobile-web polish is the platform, full stop.**
- **Funnel:** 20 visitors → 7 tutorial starts → 4 completes → 5 ran a season →
  4 finished one. The biggest single loss is *before the first swipe*.
- **Depth:** one 42-run whale (4 active days), one 5-run player, two 1-runners.
  3 of 5 players returned on a later day. The whale proves the loop can hold
  someone; the funnel proves it rarely gets the chance.
- **Love Island share:** 282 of 1,559 card swipes (18%), 92 distinct LI cards
  seen, ~8 finished Seasons: realthing 3 wins, winvilla 1 win / 1 fail,
  brand 1 win / 1 partial, one Dumped exit. The pack is *played and won* but
  under-exposed relative to the music game (which owns the root URL, the
  tutorial, and the daily/gauntlet surfaces).
- **Card-level reads** (tiny n, treat as hypotheses): `li_arrival` runs 33%
  bad-tier on 12 swipes — the *first card of the game* punishes a third of
  first impressions. `li_parents` 40% bad on 5. `li_daybed_2` 89% left-skew.
- **Tooling gap:** `telemetry/coverage.md` diffs observed play against the
  *music* catalog only (`js/data/*`) — the villa has no coverage diff, no
  never-reached list, no exit/trophy catalog side. We are flying the LI beta
  on instruments built for the other aircraft.

### 2.3 What 10,000 simulated Seasons say

`node tools/simulate-pack.mjs love-island 10000` (narrative policy, seed
0x5EED), plus per-gate miss analysis via `tools/pack-core.mjs`. Music golden
gates all pass; lint is clean (3 packs, 642 events).

**Headline:** success **32.1%** / partial 31.9% / failure 14.4% / dumped
**21.6%** / burnout walk **0.02%**. Avg 31.0 cards per season; zero deck-dry
events; 103/104 cards reachable (the one exception is gated by design, but see
R1). Run lengths are bimodal: dumped seasons end at ~22–23 cards, finales at
33±1.

| Summit | Chosen | Conditional success | Conditional failure |
|---|---|---|---|
| The Real Thing (bond 78 · loyalty 72) | 32.2% | **49.2%** | 10.1% |
| Win the Villa (public 76 · bond 44) | 24.3% | 38.3% | 18.1% |
| The Brand (followers 62 · charisma 62) | 21.8% | **31.6%** | **30.9%** |

**Finding 1 — Loyalty is over-supplied.** Avg 83 at finale vs a top gate of 72;
**caps at 100 in 51% of finales**; it is the missed gate in only 91 of ~1,650
non-success finales. The "safe" branch of most social cards pays loyalty+6.
Its gate is decorative; The Real Thing is in practice gated by Bond alone.

**Finding 2 — One blade does all the killing.** Every dump in 10k seasons
traces through `li_dumped_single` (single at a recoupling); ~62% at the act-2
ceremony. Burnout — In Your Head, the pack's *named emotional core* — killed 2
players in 10,000 despite averaging 60 at finale. The wobble interstitials
fire, but nothing behind them bites.

**Finding 3 — The Brand is starved.** Charisma avg 40 vs gate 62 (never caps;
max observed 93); in transcripts its income is mostly the +2 consolation on
*bad*-tier outcomes — you cannot *choose* your way to charisma. Followers also
under-supply (41.5 avg vs 62). The influencer fantasy is the market's biggest
demographic and our weakest path.

**Minor:** Graft averages 6 at finale (fine if it's a pure spend-currency —
verify players actually buy Angles: add a telemetry prop, R3). Near-dead cards:
`li_recoup2_choose_single` 0.0%, `li_tempt_official` 0.5%,
`li_recoup_cashout` 2.1% — the gossip **ceremony cash-out, the v2 centrepiece
payoff, fires in 1 season in 50** (see R4).

### 2.4 What the 2025–26 market says

Full sweep in the session record; the load-bearing findings:

1. **Un-gated agency is the category's open wound.** Fusebox's licensed *Love
   Island: The Game* is review-bombed for gem-gated choices; Netflix Stories'
   pitch is explicitly "no gems." A player review comparing them says it in one
   line: better writing loses to un-gated choices. We are free and open-source
   — *say so, loudly*.
2. **The franchise is peaking now, in the US.** LI USA S7 was Peacock's
   most-watched original ever; S8 (airing June–July 2026) opened +74% over
   that. >50% of viewers under 30, ~30% viewing on mobile, gigantic TikTok
   second-screen culture. The seasonal window (June–August) is our natural
   annual launch cadence.
3. **Roguelike-narrative is the proven retention shape** (Hades II, Blue
   Prince): repetition must *reveal* — new dialogue, arcs, and context per
   run. Our 5-runs-in-a-row playtest cadence and Stirling's no-repeat pools
   already lean this way; cross-season memory is the missing layer.
4. **The daily-seed + emoji-grid loop still grows small web games in 2025–26**
   (Bracket City: solo dev in January, acquired by The Atlantic by April). A
   *narrative* daily is nearly unoccupied territory.
5. **LLM NPCs shipped and flopped** (inZOI's Smart Zoi: "barely makes a
   tangible difference," halves the frame rate). Hand-authored lines over
   systemic state — exactly our architecture — is the quality lane.
6. **Brevity is a feature** (Date Everything's one consistent criticism:
   dialogue bloat). Our outcome-length lint cap is a market-validated rule.
7. **Permanence is a marketing angle.** Fusebox deleted seasons 1–3 of its own
   game; Netflix deleted Bandersnatch. A static, open-source game that cannot
   be taken away resonates with this exact burned audience.
8. **One screenshotable sentence beats a feature list** (Stimulation Clicker,
   One Million Checkboxes). Ours: *"Reigns, but you're in the villa — and
   every choice is free."*
9. **Trademark reality:** ITV licenses "Love Island" commercially; Fusebox
   renewed through ~2027. Promotion under the real name invites a C&D at the
   exact moment growth starts working. (§3.F.)

---

## 3. The design space — every branch, walked

Format: each decision is a tree — options, evidence, verdict, cost,
reversibility, golden impact. **Verdict** is my recommendation as advisor;
trees marked ⚖️ end in a genuine human call.

### Axis A — Balance & fairness (make the loop honest)

#### A1. Loyalty over-supply

- **(a) Trim the faucet** — shave loyalty payouts on ambient social cards
  (+6 → +3/+4 on the most common "safe" branches).
- **(b) Raise the gate** — realthing loyalty 72 → ~80.
- **(c) Make loyalty spendable** — a tension where loyal choices *cost*
  something (screen time, Followers).
- **(d) Leave it** — The Real Thing as the deliberate gentle path for the
  casual, story-first audience.

**Evidence:** caps in 51% of finales; misses its gate in 5% of failed finales.
A stat that always maxes is not a stat, it's a constant — the swipe loses
meaning on that axis (the Reigns lesson: the gesture is only as meaningful as
the state it visibly moves).
**Verdict:** (a) primarily, plus a modest (b) to ~76. Not (c) — Followers
already punishes exclusivity (`profile.ts` ×0.6 clout penalty); a second
loyalty tax double-charges the same choice. Keep realthing the *gentlest*
summit (its audience is the genre's core) but pull conditional success from
49% toward ~42%. **Cost:** one tuning session. **Golden:** re-baseline.

#### A2. Mortality monoculture (the one blade)

- **(a) Arm In Your Head** — above ~85, wobbles escalate: a third interstitial
  tier where a bad choice *is* the Walk. Burnout becomes a real, telegraphed
  fail lane.
- **(b) Public-crater dumps** — make the existing public≤0 fail state actually
  reachable (it never fires in 10k sims).
- **(c) Accept the monoculture** — "stay coupled or die" is thematically true
  to the show.

**Evidence:** 0.02% burnout deaths vs 21.6% dumped; avg finale burnout of 60
means the meter *reads* dangerous and never is — a legibility lie, the exact
sin v2 was built to purge. Stirling forecasts a danger that cannot occur.
**Verdict:** (a), tuned to ~3–5% of seasons (music's burnout teeth are the
model); skip (b) — a second external death makes early seasons feel random,
and the show's own truth is that the *villa*, not the public, sends you home
mid-season. Keep single-at-recoupling the main blade. **Cost:** one session
(interstitial tier + tuning + Stirling wobble-verdict lines). **Golden:**
re-baseline.

#### A3. The Brand starvation

- **(a) Charisma faucet on choices** — challenges, talent night, workout
  audience, catchphrase cards pay charisma on *good* tiers, not as bad-tier
  consolation.
- **(b) Lower the gate** — followers 62 / charisma 62 → 55-ish.
- **(c) Angle synergy** — the Comedy Gold / Everyone's Type Angles grant
  charisma-per-act (a build, not a faucet).

**Evidence:** charisma avg 40 vs gate 62; you cannot choose your way to it.
Conditional failure 30.9% (worst); the influencer fantasy is the show's
largest actual demographic (18–24, companion-app natives).
**Verdict:** (a) + (c), keep gates. (b) devalues the two paths that already
work. (c) is the interesting one: it makes The Brand the *build-crafting*
summit — pick charisma Angles early, cash the compounding — which gives the
daybed economy the strategic depth telemetry suggests it lacks (89% left-skew
on `li_daybed_2`). Target ~36–38% conditional. **Cost:** one session with A1
(same tuning sweep). **Golden:** re-baseline.

#### A4. The arrival is a hazing

**Evidence:** `li_arrival` — the literal first card — lands bad-tier 33% of
the time in real play. First-time players eat a punishment before they know
the rules. Compare: act-1 grace exists for Dumped but not for tone.
**Options:** (a) soften both branches of the first three cards (floor at
good-tier, keep the *text* spiky); (b) leave it (the villa is mean, that's the
joke). **Verdict:** (a) for the first two cards only — Stirling can roast you
without the numbers doing it too. Meanness stays in the copy, generosity in
the math; day one on the show is champagne and awkward hugs, not a dumping.
**Cost:** folds into A1/A3's session.

#### A5. Dead and near-dead content

`li_recoup2_choose_single` (0.0%), `li_tempt_official` (0.5%),
`li_recoup2_exposed_single` (never drawn — gate unreachable). **Verdict:**
re-gate or fold; a card nobody can reach is either a bug wearing a gate as a
disguise, or free authoring budget. One inspection pass inside the A1–A4
session. (The cash-out card's 2.1% is a *design* problem, not a pruning
problem — R4.)

### Axis B — The first five minutes (onboarding)

#### B1. What kind of tutorial

- **(a) None** — seasons are 31 cards; the run *is* the tutorial.
- **(b) Music-style tutorial chain** — a scripted First Day mini-arc via the
  existing `tutorialEvents`/`tutorialStart` capability slots.
- **(c) Stirling as the tutor** — first-season-only bark pool: he explains the
  format diegetically, beat by beat ("that meter's your head, babes — watch
  it"), driven off `meta.runs === 0`, riding the existing overlay channel.
- **(d) (b)+(c)** — a 3-card arrival ramp *and* the coaching voice.

**Evidence:** the funnel's biggest leak is before/at the first run; 7 of 20
visitors even started the music tutorial. LI currently throws you into
`li_arrival` cold — which also rolls bad 33% of the time (A4). The market
sweep's brevity warning cuts against a long scripted tutorial.
**Verdict:** **(d), weighted toward (c).** Stirling-as-tutor is the creative
differentiator: the show itself onboards new viewers through the voiceover,
so the mechanic is diegetic, it reuses a shipped engine (bark pools + stance),
and it costs ~15 authored lines, not a system build. The `tutorialStart`
chain covers only the swipe/lean gesture (3 cards max).
**Cost:** M, one session. **Golden:** tutorial events are meta-gated; verify
trace stability, likely safe with `meta`-conditioned pools kept out of seeded
sims (the no-repeat state trick in `stirling.ts` shows how).

#### B2. "How do I win" legibility

The Crossroads commits you to a Summit; nothing afterwards restates what that
Summit *needs* qualitatively. **Options:** stat-info popover (exists, passive)
/ a Stirling act-intro read on your gate distance ("two acts left and the
nation barely knows your name") / a mid-act-3 Text beat. **Verdict:** the
Stirling act-intro read — it extends the honest-forecast contract (ADR-0008's
truthfulness constraint) from ceremonies to the campaign level, zero new UI.
**Cost:** S, folds into B1's line-writing.

### Axis C — The reason to return (modes & meta)

#### C1. The Daily Villa ⚖️ (scope call, not direction)

One shared seeded Season per day for everyone, with a spoiler-safe emoji recap
card (couples formed, secrets held, days survived, Summit reached) that pastes
into a group chat.

- **(a) Minimum:** verify engine daily mode is exposed on `/love-island/`,
  make LI's `shareText` emoji-grid-shaped, add a "come back tomorrow" end
  screen.
- **(b) The loop:** (a) + streak counter in `meta` + a daily leaderboard-less
  "today's villa" framing (same seed = same bombshells, same secrets — "did
  YOUR partner stray?" is inherently conversational).
- **(c) The event:** (b) + a weekly "Casa Amor Thursday" heavy-twist seed.

**Evidence:** the dle pattern still grows solo web games in 2025–26; a
narrative daily is nearly unoccupied; LI's `shareText` already handles
`summary.daily`; the engine's daily plumbing is genre-neutral and already
built. The music game's daily had 4 players try it — the surface exists, the
*loop* doesn't.
**Verdict:** (b) now, (c) when weekly actives justify it. This is the single
highest-leverage growth feature because it converts our structural weakness
(short runs) into the habit shape. **Cost:** M. **Golden:** none (daily seeds
are outside golden traces); share-string snapshot test instead.

#### C2. Weekly gauntlet + comeback parity

Both are shipped engine surfaces the pack simply doesn't switch on. Gauntlet:
set the presenter flag, inherit the weekly seed ritual. Comeback: LI flavor is
*the redemption season* — return as a previously-dumped Islander with a
notoriety Angle pre-slotted and the villa's memory against you.
**Verdict:** do gauntlet immediately (S); do comeback as flavor-first (M) —
it's also the natural home for the "dumped ≠ the end" message that softens A2's
blade. **Golden:** comeback needs a deliberate trace if seeded.

#### C3. Meta-progression: unlockable personas & trophies

- **(a) The Bombshell** — a 5th playable Type, unlocked by finishing a Season:
  you *arrive at the act-1 break* into a villa already coupled (producers
  plugin already knows how to seed mid-season arrivals). Structurally spicy,
  mechanically cheap, and the single most requested fantasy in the format.
- **(b) Harder Seasons** — a "producers' twist" modifier deck (shorter grace,
  hungrier Rival, louder public).
- **(c) Trophy mass** — 12 → ~30, leaning on state the pack already tracks
  (intelDeployed, exes, secretsKnown, stance history).

**Verdict:** all three, ordered (c) → (a) → (b): (c) is a content-only
afternoon; (a) is the flagship unlock that gives finishing a Season a *prize*;
(b) rides on whatever A1–A4 learns about knob ranges. **Cost:** S / M / S.
**Golden:** (a) adds traces; (b) is mode-gated.

#### C4. Cross-season memory — the villa roguelike layer

The Hades finding: repetition must reveal. Today every Season is amnesiac.

- **(a) Stirling remembers** — a `meta`-keyed bark pool: "back again? The
  nation remembers the hot-tub incident." Pure flavor, ~20 lines.
- **(b) Islanders remember** — your ex-Partners and past Rivals, when re-drawn
  from the Cast, open with history-aware encounter variants (state-gated entry
  cards — the exact mechanism `li_enc_rmove_*` already uses, keyed off `meta`
  instead of run-state).
- **(c) A persistent villa-verse** — season numbering, returning champions,
  an "all-stars season" unlock.

**Evidence:** the market's strongest retention pattern; our own whale played 42
runs — repetition is already happening, it's just not being *rewarded*.
**Verdict:** (a) then (b); (c) is H3 glitter, only after (b) proves the
authoring cost is worth it. (b) is the deepest bet in this axis: it converts
the 16-member Cast from a name pool into a returning ensemble — the thing
that makes a *show* a show is that you know these people. **Cost:** (a) S,
(b) L. **Golden:** meta-gated content must stay out of seeded traces —
established pattern exists.

### Axis D — Content mass & cast depth

#### D1. Partner personalities

Today the Partner is any of 6 opposite-gender Cast members sharing one
dialogue set; the token filler swaps names. Options: **(a)** full per-member
dialogue (16 × everything — the Date Everything trap: breadth over depth);
**(b) three Partner *shapes*** — sweetheart / game-player / slow-burner — each
with its own encounter-beat dialogue variants and secret pool, assigned per
Cast member; **(c)** leave generic.
**Verdict:** (b). It's the Persona lesson at bounded cost: relationships need
a *shape*, not just a magnitude. Three shapes × existing beats ≈ one content
session, and secrets finally differ by who you coupled with — replay variety
that compounds with C4(b).
**Cost:** L (writing-heavy, taste-gated). **Golden:** re-baseline.

#### D2. The missing arcs

Shipped: Rival×2, Partner×2, Second Wave. The format beats with no arc yet:

- **The Bestie** — your same-gender ride-or-die. The show's secret spine
  (girl/bro code currently exists only as flags + one bloc vote). A Bestie arc
  gives the gossip economy a *third* trusted channel, gives Dumped seasons an
  emotional witness, and is the most under-served relationship in the genre
  (every competitor is romance-only).
- **A Bombshell arc** — the active bombshell has state (ADR-0006) but no
  dedicated encounter chain; temptation is ambient-only.
- **A Challenge set-piece arc** — the talent-night/heart-rate cluster as a
  branching scene with public payoff (also A3's charisma faucet, same cards).

**Verdict:** Bestie first — it's the creatively differentiating one and it
feeds three shipped systems (gossip, code flags, ceremonies) instead of adding
one. **Cost:** each arc ≈ the V1 slice's shape: M–L, taste-gated.

#### D3. Stirling mass & the "previously on" opener

78 lines is one season of freshness; the whale has heard them all. Grow to
~160 across existing pools (S, pure authoring), add **dynamic act intros** —
the actIntro slot already exists; make it read run state and deliver a
"previously, in the villa" recap in Stirling's register. Recaps are the
show's own memory ritual, they're free legibility (B2), and they make every
run's *middle* feel authored. **Golden:** re-baseline (deal-time notes are in
traces).

#### D4. Endings & epilogue depth

11 endings is healthy; the epilogue/headlines/DMs generators already read
run-state. Cheap wins: epilogue variants keyed on Bestie/Rival/exclusivity
state, a "where are they now" beat for your season's bombshells, and exit
interviews beyond the 2 shipped (burnout/dumped) — one per Summit outcome.
**Cost:** S–M, content-only.

### Axis E — Presentation, feel, and the phone

- **E1. Verdict reaction shots.** The art map has ~50 slots; ceremonies
  resolve on portrait mood tints. One art session for held/rescued/dumped
  reaction crops turns the verdict into the screenshot moment (market: the
  15-second clip payoff). ⚖️ needs Viktor's art pipeline call.
- **E2. Sound & haptics.** Options: stay silent / tiny SFX pack (text shriek,
  firepit low drone, verdict sting) / full audio. Verdict: `navigator.vibrate`
  haptic on "I'VE GOT A TEXT!" + verdicts now (S, CSS/JS only, off by
  default on desktop), defer SFX until there's an audio identity decision —
  audio assets are the one thing this repo has zero pipeline for.
- **E3. Juice.** Card-settle physics, a one-shot confetti on Held, screen
  shake on the steal. Pure CSS, golden-safe, an afternoon each. The lean
  preview (engine-generic) already carries the tactile load.
- **E4. PWA polish.** `manifest.webmanifest` + `sw.js` exist at root scoped to
  the music game. Give `/love-island/` its own manifest + icon so "Add to
  Home Screen" installs *the villa*, not Big Break. (S; build.mjs copies
  per-pack statics already.)

### Axis F — Identity, growth & distribution

#### F1. The name ⚖️ (the one true fork in the road)

- **(a) Keep "Love Island"** while tiny — parody/homage posture, zero
  promotion under the mark.
- **(b) Soft rename** — a name that *reads* as the format without the mark
  ("The Villa", "Coupled", "Grafted", "Text From the Villa", "Second Wave").
  Keep the format beats (they're genre conventions, not marks).
- **(c) Full rebrand** — new fiction (an island dating *show* of our own
  invention, own host name, own rituals).

**Evidence:** ITV actively licenses the mark; Fusebox renewed through ~2027;
growth work (F2–F4) is pointless if its success triggers a C&D; meanwhile
*every format beat we rely on — recoupling, bombshell, the text ritual — is
unprotectable convention* (Casa Amor is the one name worth swapping).
**Verdict:** (b), executed *before* Bet 3's promotion push, cheap by
construction: title/manifest strings + `<id>.html` + a URL alias (the pack id
can stay internal). Stirling, crucially, is already our own character. I can
prepare the candidate list, collision-check names, and stage the rename as
one PR; **the pick is Viktor's.** *(This report keeps "Love Island" as the
internal working title throughout — docs and pack id don't face players.)*

#### F2. The pitch & the front door

One sentence, everywhere (README, `og:` tags, the root page): *"Reigns, but
you're in the villa — and every choice is free."* Cross-promo: the music
game's finale/epilogue screen and start bar get a "tonight, in the villa"
card; LI's gets the reverse. (S; app-level copy, no engine names a genre.)
Root README currently leads with the music game — add the two-game framing.

#### F3. Distribution channels

itch.io mirror (zip `dist/`, free, browser-playable — their browser-game
audience is exactly ours; also the permanence story), plus the docs-site case
study already live. Defer app stores entirely (wrapper cost, review risk,
monetization pressure — anti-goals). **Cost:** S, one workflow addition
(`release.yml` already exists as the pattern).

#### F4. The seasonal window

The franchise's cultural peak is June–August, annually. Treat it as launch
season: content drops, the daily villa event weeks (C1c), and the rename
reveal all target the window. 2026's window is *now* — which argues for Bet 1
+ C1 this month, and saving the big public push for the 2027 window with a
year of polish behind it. ⚖️ (appetite call).

#### F5. Localization

19/20 players are Swedish — an artifact of the owner's network, not a signal.
The voice *is* the product (VOICE.md's five registers don't survive
translation), and the show's own audience watches in English. **Verdict: no.**
Revisit only if organic non-EN traffic ever appears.

### Axis G — Telemetry & experimentation

- **G1. Per-pack coverage.** Extend `tools/posthog-pull.mjs` to diff LI
  observed-vs-catalog (cards, endings, trophies, encounters, Stirling
  exposure). Today's coverage.md is music-only. (S)
- **G2. Villa-specific props on existing events.** Ceremony outcome + lane
  trusted, gossip deploys, secret cash-outs, encounter branch taken, Angle
  purchases, wobble tier — all already in `summarize`'s vocabulary; emit them
  on `run_end`/`swipe` props. Without G2 we cannot evaluate anything Bet 2
  ships. (S)
- **G3. First-session cohort cut.** The funnel table exists; add a
  first-run-only slice (which card killed the first run? did they meet
  Stirling's tutor?) — the measurement for B1/A4. (S)
- **G4. Targets** (so future sessions have a scoreboard): visitor→player
  ≥40% (now 25%), first-season completion ≥70%, LI share of runs ≥40% (now
  ~15–18%), any-D1-return ≥30%, daily-villa shares: any (now impossible).

### Axis H — Engine-level projects (the expensive doors)

- **H1. Minigames as a pack capability** (re-opens ADR-0004). Evidence *for*:
  music minigame skip rates are near-zero (players like them); challenges are
  the show's set-piece language. Evidence *against*: it's the one item that
  touches the app layer; LI's loop is proven without it. **Verdict:** H3 —
  behind everything above; when done, do it as the ADR-0004-imagined
  generic registry lift, and LI's first three are heart-rate / snog-marry-pie
  / the lie-detector (which also un-defers the lie-detector Reveal beat from
  grill.md).
- **H2. Queer/fluid Season formats** (re-opens ADR-0003's deferral). The
  couple-pool and chooser logic are cleanly factored (`cast.ts couplePool`,
  gendered ceremony in `producers.ts`) — the *mechanical* lift is a
  preference-driven pool + chooser rule, medium; the *content* lift (dialogue
  assumptions, Casa framing) is the real cost. **Verdict:** genuine H2/H3
  candidate — it's the single most-asked-for feature in the genre's own
  audience discourse and Netflix's Secrets leads with it. Do it as its own
  grill session first (it deserves the ADR-0003 successor, not a bolt-on). ⚖️
- **H3. NPC↔NPC systemic villa.** Today all state radiates from the player;
  NPC couples don't exist off-screen. A minimal version: the producers plugin
  tracks 2–3 NPC couples as flags; recouplings re-deal them; gossip items can
  be *about them*; one ambient card family reacts. This is the "systems
  author stories" moonshot — and the inZOI lesson says do it *authored*, not
  simulated: the state machine is tiny, all text stays hand-written and
  taste-linted. **Verdict:** prototype behind a sim probe first (does it
  generate legible variety, or noise?); H3.
- **H4. Third pack vs deepen.** The engine thesis ("adding a genre edits new
  files only") is already proven twice. A third pack is *engineering* proof
  with no *player* payoff while LI retention is unproven. **Verdict:** deepen
  LI through Bets 1–2 first; the third pack is 2027-window material — and by
  then, C1/C4's genre-neutral spillover (daily loops, meta-memory) makes
  every future pack better.

### Axis I — How the AI works this repo (the ops layer)

- **I1. The session contract.** Every roadmap item below is scoped to land
  green in one session: `npm run build` → `node tools/lint-content.mjs` →
  `node tools/simulate.mjs --check` → `node --test` → `node
  test/ui-smoke.mjs`; goldens re-baselined *deliberately* when seeded
  behavior changes, never incidentally.
- **I2. The tuning loop is closable end-to-end.** Propose knob deltas → 10k
  sims → compare per-summit bands → adversarial self-review → golden
  re-baseline → PR. No human taste involved in *numbers*; the sim is the
  judge. (This is how R1 executes.)
- **I3. Content sessions are taste-gated, not taste-blind.** Pattern-match
  against GUIDING_EXAMPLES → write → `taste-core` lint → self-review against
  VOICE.md's anti-taste list → land; flag ~10% of new lines for Viktor's
  spot-verdict, which *also* refreshes the calibration data. Taste drift is
  the biggest content-mass risk; the spot-verdict loop is its control rod.
- **I4. Standing routines.** Nightly: `tools/posthog-pull.mjs` refresh +
  commit. Weekly: an advisor digest (funnel/coverage/balance drift vs G4
  targets, three recommended next sessions). Monthly: telemetry-driven
  dead-content pruning pass. All three are schedulable from this environment
  today.
- **I5. Adversarial review as a habit.** The v2 close-out commit
  ("close every adversarial-review gap") proved the pattern; run it on every
  L-sized item: independent review agents on correctness / taste / spine
  (genre-neutrality), findings verified before fixes.

---

## 4. The roadmap — sessions, sequenced

Each item is sized (S ≈ afternoon, M ≈ one full session, L ≈ multi-session),
gated per I1, and written to be executable by a future AI session with this
report + the design record as context. Order within a horizon is the
recommended order; dependencies are noted.

### Horizon 1 — Sharpen the beta (this month; goal: the bucket holds water)

- **R1. The honesty balance pass** *(M; A1+A2+A3+A4+A5)* — one sweep:
  loyalty faucet trim + gate 72→76, charisma choice-income + Angle synergy,
  In-Your-Head teeth (~3–5% walk rate), arrival generosity floor (first two
  cards), dead-card re-gating. Success = per-summit conditionals in
  36–44% / 36–40% / 34–38% with overall in-band; sims are the judge; goldens
  re-baselined once, deliberately, at the end.
- **R2. Stirling teaches the villa** *(M; B1+B2)* — first-season tutor pool
  (~15 lines), 3-card `tutorialStart` gesture ramp, act-intro gate-distance
  reads. Depends: R1 (don't teach numbers that are about to change).
- **R3. Instruments for this aircraft** *(S; G1+G2+G3)* — per-pack coverage,
  villa event props, first-session cohort cut. Do this *before* R6 ships so
  the daily loop is measured from day one.
- **R4. The cash-out rescue** *(S)* — the v2 centrepiece (gossip → ceremony
  cash-out) fires in 2.1% of seasons: raise Rival-secret availability ahead of
  ceremonies (encounter branch odds, Beach Hut weighting) and have Stirling
  telegraph the held card ("she's sitting on dynamite, folks"). Success:
  cash-out ≥ 10% of seasons with a held secret ≥ 25%.
- **R5. The front door** *(S; F2)* — pitch line, `og:` tags, README two-game
  framing, mutual cross-promo cards, gauntlet flag on (C2a).

### Horizon 2 — The reason to return (next 4–8 sessions)

- **R6. The Daily Villa** *(M; C1b)* — shared daily seed surfaced on the LI
  page, emoji recap share card, streak in meta, "come back tomorrow" end
  screen. Measured by R3.
- **R7. Content mass 3** *(L; D1+D2+D3, split across sessions)* — Partner
  shapes (3), the Bestie arc, Stirling 78→160 + "previously on" act intros.
  Taste-gated per I3; each sub-item lands green separately.
- **R8. Modes & meta** *(M; C2b+C3)* — comeback "redemption season", trophy
  mass 12→30, then The Bombshell unlockable persona.
- **R9. The villa remembers** *(L; C4a→b)* — Stirling memory pool, then
  history-aware encounter entries for returning Cast. Depends: R7 (Partner
  shapes define what's remembered).
- **R10. The rename, staged** *(S execution + ⚖️ human pick; F1)* — candidate
  list with collision checks, one staged PR (strings, manifest, URL alias,
  redirect), merged on Viktor's word. Blocks the public push, nothing else.
- **R11. Feel pass** *(S×3; E2 haptics, E3 juice, E4 PWA manifest)* —
  independent afternoons, all golden-safe.

### Horizon 3 — Moonshots (evidence-gated)

- **R12. Verdict art & audio identity** *(⚖️ + L; E1/E2full)* — needs an art
  pipeline decision first.
- **R13. Standing routines live** *(S; I4)* — nightly pull, weekly digest,
  monthly pruning. (Can start in H1 — listed here because value compounds
  with traffic.)
- **R14. Queer Season formats** *(grill session → ADR → L build; H2).*
- **R15. NPC↔NPC villa** *(sim-probe spike → go/no-go → L; H3).*
- **R16. Minigames as pack capability** *(engine project; H1)* — heart-rate /
  snog-marry-pie / lie-detector.
- **R17. itch.io mirror + 2027 window campaign** *(S + ⚖️; F3+F4)* — after
  R10.

### Dependency sketch

```
R1 balance ─→ R2 onboarding ─→ (funnel measured by R3)
R3 telemetry ─→ R6 daily ─→ R13 routines (digest reads daily metrics)
R7 content ─→ R9 memory      R10 rename ─→ R17 distribution/campaign
R4, R5, R8, R11: independent    R14/R15/R16: gated on H2 evidence
```

---

## 5. Division of labour — what needs a human

Everything in §4 is AI-executable under the I1 contract **except**:

1. **Taste verdicts** (I3's ~10% spot-checks; any new register — e.g. the
   Bestie's voice — gets a mini-calibration like Phase A).
2. **The name** (F1/R10 pick) and any public-push timing (F4).
3. **Art direction** (E1/R12: portrait pipeline, style calls).
4. **Recruiting playtesters / sharing links** — telemetry only counts what
   arrives; the SE cluster is Viktor's network by construction.
5. **The queer-formats grill** (R14) — it's a design-values session, not a
   backlog item.

Suggested cadence: I run R-items and the standing routines autonomously,
each landing green on `main`; Viktor spends his attention only on the five
slots above — a weekly 15-minute taste-verdict + decision batch would keep
every horizon unblocked.

---

## 6. Risks & anti-goals

- **Trademark exposure** (F1): mitigated by renaming before promotion; until
  then, no paid/press push under the mark.
- **Taste drift under content mass**: the repo's #1 asset is that the villa
  *sounds like something*; mitigated by I3's lint + spot-verdict loop. If a
  session can't pass taste review, it ships nothing — volume is never worth
  the voice.
- **Complexity creep vs the 31-card season**: every added system must pay off
  inside one season *or* be meta-layer. The sim's run-length distribution is
  the tripwire (median 33 should not grow past ~36).
- **Golden discipline**: re-baselines are deliberate, one per session, never
  bundled with unrelated diffs — a golden diff is a bug unless intended.
- **Engine spine**: no engine line names a villa concept; every R-item above
  is expressible as pack files + (rarely) a new *generic* capability slot —
  the overlay-note channel is the precedent for how to do it right.
- **Anti-goals, restated**: no monetization of choices ever (it's the entire
  positioning), no LLM-runtime NPCs (authored text over systemic state), no
  app-store wrappers this year, no localization on spec.

## 7. Scoreboard (what "working" means)

| Metric | Now | Bet 1 done | Bet 2 done |
|---|---|---|---|
| Visitor → first swipe | ~25% | ≥40% | ≥50% |
| First Season completed | ~unknown (n≈5) | ≥70% | ≥70% |
| LI share of runs | ~15–18% | ≥30% | ≥40% |
| Later-day return (any) | 3/5 players | ≥30% | ≥40% + daily streaks exist |
| Per-summit conditional success | 49/38/32% | 36–44/36–40/34–38% | stable |
| Seasons per returning player | 1–42 (bimodal) | — | median ≥3 |
| Share cards sent | impossible | — | >0, growing |

Telemetry (R3) makes every cell measurable; the weekly digest (R13) reports
against this table.

## 8. Appendix — method

Four parallel research streams (code audit; telemetry cuts from
`telemetry/latest.json`; 10k-season simulation with per-gate miss analysis;
web market sweep with per-claim verification flags) synthesized by the
advisor session that authored this report. Sim commands and raw tables are
reproducible: `node tools/simulate-pack.mjs love-island 10000`, cuts via
`tools/pack-core.mjs`'s exported driver. Market claims and sources live in
the session record; the load-bearing ones are restated with their evidence in
§2.4. Telemetry percentages use the 2026-07-05 pull; with n≈20 players they
are directional only — G4's targets, not this snapshot, are the yardstick.
