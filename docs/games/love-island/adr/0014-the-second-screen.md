# The Second Screen: the nation gets feeds (v4 S4)

Session 4 of the v4 build, on Session 3's factional public (ADR-0012). The
brief (Viktor, 2026-07-06, building on Hillevi's Pillar-5 interview): the
player should be able to **gauge how they're doing in the eyes of the public**
by reading the public's own words — different social-media communities,
each with its own feed, its own dialect, and its own opinion of you, surfaced
at every pivotal moment. The contestants can't read any of it (their phones
are in a drawer in the Beach Hut); the player can. Dramatic irony is the
feature.

Hillevi's original observation was *literal*: the real audience split is "a
more feminist Twitter/Reddit crowd vs. the 'Facebook mums'." ADR-0012
abstracted that into three **values**-factions at her own recommendation,
because the demographic politics of the split are too fraught for game
mechanics. This ADR keeps that settlement intact and adds the presentation
layer the abstraction cost us: **the platforms return as skins, not as
meters.** The wings still hold the numbers; the feeds are how the wings talk.

## Decision

**A new feature-detected presenter capability — `Presenter.feeds` — plus a
generic second-screen browser in the shell. Zero engine edits, zero plugins,
zero golden movement.**

- **Mechanism (generic, shell):** `types.ts` gains `FeedPost` / `FeedChannel`
  / `FeedBundle` / `FeedMoment` and the optional hook
  `Presenter.feeds?(state, moment) → FeedBundle | null`. The shell calls it at
  three moment kinds — a card's **result** (`{kind:'result', ev, tier, side}`),
  the **act interstitial** (`{kind:'recap', act}`), and the **ending**
  (`{kind:'ending', endingKey}`) — and, when a bundle comes back, renders a
  one-line **teaser** with a button. Tapping it opens the feed browser: a
  phone-shaped overlay layer with one tab per channel, platform-skinned posts,
  and a per-channel "show more" fold. A pack that omits the hook renders the
  original shell byte-for-byte (music is untouched).
- **Progressive disclosure (ADR-0009 applied to the outside world):** tier 0
  is the teaser line (zero taps, one glance — unread counts per channel);
  tier 1 is the browser (one tap); tier 2 is per-channel tabs; tier 3 is the
  "show more" fold inside a channel. The scene always takes space first — the
  feeds never open themselves.
- **Content and logic (pack):** `js/packs/love-island/feeds.ts` derives the
  villa's five communities **purely from state** — the same purity contract as
  `recap`/`setPiece`/`headlines` (pure reads; seeded off `flavorSeed` + the
  card log, never the play RNG — so sims never render it and the golden corpus
  does not move). Pivotal-moment detection **reuses the set-piece grammar**
  (ADR-0009 v3.2): a card that plays a set-piece beat is exactly a card the
  outside world reacts to; weekly recaps and the ending are the other two
  windows.
- **The five channels, and whose meter each one wears** (the ADR-0012 wiring —
  each community's mood, volume, and pool selection derive from a wing or
  resource, so reading the feeds IS reading the nation):

  | channel | skin | parody of | reads |
  |---|---|---|---|
  | **the bird app** | dark, reposts, ratios | X/Twitter | 🍿 Drama-lovers |
  | **the forum** (v/TheVilla) | upvotes, flairs, mods | Reddit | 💅 Self-Respect |
  | **Villa Mums & More ❤️** | light mode, ellipses | Facebook group | 🌹 Romantics |
  | **the grid** | official post + comments | Instagram | 📱 Followers |
  | **the clock app** | comment section, 3 a.m. | TikTok | the blend (surge) |

  Real platform names never appear — the channels wear the fandom's own
  colloquial epithets ("the bird app," "the clock app"), which is both truer
  to how the audience actually talks and keeps ADR-0012's deferral honoured:
  the parody targets each platform's **register**, never a demographic's
  identity.
- **Voice:** the feeds are a new register — "the second screen" — documented
  in VOICE.md. Every poster is an Islander-argot-style *sincere mouth*: the
  community's dialect turned up a notch but true to life, never the
  Narrator's wit. Post bodies are diegetic quotes, so the cliché blocklist
  does not apply inside them (same exemption as Islander dialogue) — but the
  structural floor (curly quotes, lengths, token validity) does, plus new
  feed-specific floors (per-pool coverage minimums, no duplicate bodies),
  enforced by `tools/lint-content.mjs` through the generic corpus checker in
  `tools/taste-core.mjs`.

## Where the feeds appear (the moment map)

Every set-piece family from the clarity layer gets a reaction window: arrival
/ day one, the first bombshell, dates, challenges, the rival, Casa Amor (the
split, the postcard, the return), Movie Night, both ceremonies, dumpings, and
the Final — plus each weekly recap ("the week outside") and the ending ("your
phone, returned" — the one moment the fiction has always promised: the dumped
ending's text already hands you a phone "warm with notifications"). Ambient
villa cards produce no feeds; the contrast is load-bearing, exactly as with
the set-piece beats themselves.

## What the player is actually reading (legibility)

The generator selects each channel's posts by: the **moment family** (a
ceremony reads differently from a pie), the **outcome tier** (a botched
challenge is content; a triumphant one is a fancam), the channel's **wing
value and its delta against the mean** (a community whose wing trails the
aggregate sours first — the split is visible before it's fatal), the
**follower count** (engagement numbers scale with your reach), and the
**run's flags** (a Casa kiss, a broken code, an exclusive — each has feed
consequences). Numbers on posts (likes, upvotes) are deterministic flavour
scaled by the same reads. The feeds are therefore an honest instrument: a
player who reads them can predict a dumping before the vote card says it.

## Rejected

- **A feeds plugin with its own state** — nothing the feeds say needs state
  the run doesn't already carry (`cardLog`, flags, wings, followers); a
  plugin would re-order the seeded construction draws and force a golden
  re-baseline for a presentation feature.
- **Real platform names / logos** — trademark kitsch, and it re-opens the
  demographic-politics door ADR-0012 deliberately closed. Epithets + skins
  read instantly and stay affectionate.
- **Feeds as cards in the deck** — the deck is the villa; the second screen
  is the *outside*. Cards cost run pacing (ADR-0011's peak budget); a
  presenter surface costs nothing and can appear at every pivotal moment
  without displacing a tentpole.
- **Auto-opening the browser at big moments** — violates the screen contract
  (ADR-0009: the scene takes space first) and would stall the UI test
  drivers' state machine. The teaser is the loud part; the tap is consent.
