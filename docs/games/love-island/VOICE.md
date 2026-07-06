# VOICE — how Love Island talks

The taste bible for the Love Island Pack. Written in a **calibration session** (Phase A
of the [implementation plan](./IMPLEMENTATION-PLAN.md)): candidate lines judged, verdicts
distilled into rules. Content authors (human or agent) pattern-match against this and
against [`GUIDING_EXAMPLES.md`](./GUIDING_EXAMPLES.md) before writing a single card.

Vocabulary is fixed by [`CONTEXT.md`](./CONTEXT.md); this doc governs *register and craft*.
The cliché blocklist here is mirrored by [`taste.mjs`](./taste.mjs) (the game's own machine
data, canonical) and enforced through the genre-neutral checker in
[`tools/taste-core.mjs`](../../../tools/taste-core.mjs) — see the last section.

---

## The prime directive

Love Island inherits the music pack's **unwritten taste**, retuned for the villa:

1. **Hyper-specific nouns.** Not "a snack" — a **Mini Milk**. Not "a message" — the
   **group chat**. Not "upset" — reapplying mascara **in the mirror of a decommissioned
   hot tub**. Specificity is the whole joke; generic is the enemy.
2. **A mid-beat turn.** The sentence goes one way, then pivots. Set up, then undercut.
3. **The surprise in the last clause.** Land the punch at the end, then stop. Don't
   explain it. The reader gets there.
4. **Deadpan.** Flat delivery, high stakes underneath. The funnier the situation, the
   straighter the face. We never tell you it's dramatic; the villa supplies the drama and
   we report it like weather.
5. **No hype punctuation — with two loud exceptions.** Default is ≤1 `!` per line and never
   `?!`; if a line needs an exclamation mark to be funny it isn't funny yet. Exception one
   is the **receiving-a-text ritual**: when an Islander clocks the phone they *shriek* it,
   so all caps and stacked bangs are wanted, not just tolerated — **“TEXT! I’VE GOT A
   TEXT!!”** The *body* of the text (the production voice) stays flat. Exception two is the
   **Narrator's mock outrage**: his single sanctioned `!` is spent on incredulity at the
   villa (“A jet-ski!”), never on hype — see register 1. Everywhere else the ≤1 rule holds.
   *(Enforced: ≤1 `!` per string, no `!!`/`!?` — except copy matching the text-arrival
   ritual, waived via [`taste.mjs`](./taste.mjs) `bangExempt`.)*
6. **Affectionate, quietly savage.** We are on the Islander's side even while we roast
   them. Punch across, not down. Cruelty is a seasoning, not the meal.
7. **Curly apostrophes and quotes** (`’ “ ”`), always. Straight quotes fail lint.

**Anti-taste (never do this):** hype (`amazing!!`), throat-clearing ("Well,"), stage
directions for the reader ("hilariously"), explaining the joke, sentimental swelling,
generic reality-romance cliché (see the blocklist). If it could appear in *any* dating
show's promo, cut it.

---

## The five registers

Love Island speaks in five voices. Each has a job; mixing them up is the most common
failure. Every register obeys the prime directive — they differ in **who is speaking and
with what authority**, not in whether they're allowed to be lazy.

### 1. The Narrator

The voiceover — the Iain-Stirling register, and the calibration that matters most:
**he is a stand-up doing bits over the footage, not an essayist observing it.** He
speaks to the audience, never enters the villa — but he heckles it from the booth:
mock-incredulous, pun-forward, taking the mick out of the Islanders, the format,
and occasionally himself. Deadpan is his *delivery*, not his content; under the flat
face there is an actual joke, every time. This is the pack's dominant voice: prompts
and outcome text are Narrator unless they're quoted dialogue.

**His documented mechanics** (see the research note below — write with these, not
just "dry wit"):

1. **Punchline, not murmur.** Setup → gag. If a line ends on a wry observation
   instead of a joke, it isn't finished. The turn should make someone exhale
   through their nose, not nod.
2. **The misdirect ellipsis.** Set up one expectation, break it after the beat:
   *"Time to call in a professional… ballroom dancer."* The pause is the joke's
   hinge.
3. **Nickname coinage.** He rebrands Islanders off one trait and keeps the bill
   running: *"…or as I like to call him, the travel agent — because everyone who
   hangs around him ends up heading to the airport."* Coin it once, call it back.
4. **Mock-incredulous repetition.** Repeat the absurd noun until it becomes the
   joke: "A row about a sun lounger. Not even the good lounger. The wobbly one."
5. **The scene-stamp opener.** "Day 9. The villa. Someone is crying about hummus."
   Officialese applied to nonsense — the news-bulletin register as a gag.
6. **Rhetorical direct address.** He talks *at* Islanders who can't hear him, for
   the audience's benefit: "Mate. MATE." One word of pub-warmth ("mate," "pal,"
   a wee Scots seasoning) does more than a paragraph.
7. **Bites the hand.** Production, the ad break, the challenge budget, his own
   job — all fair targets. The show mocking itself is the show's love language.
8. **Job/trait jokes.** His writers' room mines each Islander's one known fact
   (the job, the tattoo, the catchphrase) for a season of callbacks. Our Cast
   vibes exist for exactly this.

- **Does:** everything above; frame the scene with one hyper-specific detail; stay
  affectionate while savage — he roasts because he's a fan.
- **Never:** cheerlead sincerely, speak in cliché, moralise, feel sorry for anyone
  out loud, or end a line on tasteful restraint when a punchline was available.
  Punctuation: at most one `!`, spent on mock outrage ("A jet-ski!"), never on
  genuine excitement — and never `!!`.

| ✅ good | ❌ bad |
|---|---|
| “Two hours of eye contact and a shared opinion about airports. In the villa, that’s a marriage.” | “The chemistry between them was absolutely electric!” |
| “Day 9. There’s a row about a sun lounger. Not the good lounger, either — the wobbly one. The WOBBLY one.” | “There is tension by the pool this afternoon.” *(true, dry, and joke-free — a weather report, not a bit)* |
| “She’s opened with star signs. He’s a Capricorn. He’ll mention it four more times.” | “He calls it a connection. The group chat calls it a warning.” *(fine — but it murmurs where he’d punch; see the research note)* |
| “Time to call in a professional… ballroom dancer.” | “An expert was consulted.” |

> **Research note — the real Stirling, on the record.** The register above is
> distilled from his actual narration and interviews, not vibes: the Danny
> “travel agent” nickname gag and the “professional… ballroom dancer” misdirect
> are reported verbatim in press compilations of his best lines
> ([Grazia](https://graziadaily.co.uk/celebrity/news/love-island-iain-stirling-best-moments/),
> [Marie Claire](https://www.marieclaire.com/culture/tv-shows/who-narrates-love-island-usa-iain-stirling/));
> his writers’ room mines contestants’ jobs and one-known-facts for running gags
> written in advance, and targets the format’s own furniture — duff chat, back
> tattoos, challenge budgets, mosquitoes
> ([Hollywood Reporter](https://www.hollywoodreporter.com/tv/tv-features/love-island-usa-narrator-iain-stirling-season-8-interview-1236622784/),
> [CNN](https://www.cnn.com/2025/08/24/entertainment/love-island-narrator-iain-stirling-cec));
> and his own summary of the job is “I get to say the thing that nobody should
> say… say it with my chest… and get a bit naughty with it”
> ([Marie Claire](https://www.marieclaire.com/culture/tv-shows/who-narrates-love-island-usa-iain-stirling/)).
> When a line could pass for any tasteful narrator, it has failed this register.

### 2. The Host

Flies in **seldom**, in person, for the biggest ceremonies only — the Final, a live
dumping, the Casa return. Warm, direct, ceremonial, addresses the Islanders **by name**.
The Host's *arrival* is the maximum-stakes signal, so the words stay clean and let the
occasion do the work. (Register: Maya Jama / Caroline Flack — poised, kind, lethal timing.)

- **Does:** address Islanders directly; deliver the verdict plainly; use ritual phrasing
  ("Tonight…", "I need to see you all by the firepit"); one measured beat of warmth.
- **Never:** narrate to the audience (that's the Narrator's job), pile on jokes, or soften
  a hard outcome into mush. The Host is kind but does not lie.

| ✅ good | ❌ bad |
|---|---|
| “Islanders. Tonight, one of you is going home. And you decide who.” | “OMG guys this is SO intense right now!!” |
| “Zara. I’m sorry. The public have been voting, and you’ve received the fewest votes.” | “Unfortunately, due to the results of the public vote, your journey ends here.” |
| “Before anyone gets comfortable — I’ve got one more text.” | “There’s a little twist coming your way, cheeky!” |

### 3. Text

The voice of production / the public / the format itself — an outside authority
**imposing a beat**. Terse, present-tense, ceremonial. Arrives as *"I've got a text!"* read
aloud to the villa. Carries mechanical weight (anticipation-lock, external resolution),
so its copy should **feel like an instruction from above**, not a character talking.

- **Does:** state the rule in the fewest words; use the format's flat imperative
  ("must now", "tonight", "immediately"); end on the twist. The `#feeling` / `#hashtag`
  sign-off is the one sanctioned flourish.
- **Never:** have a personality, apologise, explain itself, or exceed ~2 short sentences.
  The Text doesn't care about your feelings; that's the point.

| ✅ good | ❌ bad |
|---|---|
| “Islanders. Tonight there will be a recoupling. The boys will choose. #shakeitup” | “Hey islanders!! Get ready because it’s time to recouple, this is gonna be wild!!” |
| “The public have been voting for their favourite couple. The results are in. #judgementday” | “The public have decided who they like best and now you’ll find out the results.” |
| “One girl will be dumped from the Island. Immediately. #sorrynotsorry” | “Sadly, someone is going to have to leave the villa now.” |

> The *"I've got a text!"* shout belongs to whichever Islander spots the phone — and it's
> the one place the game gets loud on purpose: **“TEXT! I’VE GOT A TEXT!!”**, all caps,
> stacked bangs, encouraged. The **body** of the text (everything after the shout) snaps
> back to the flat production voice: terse, ≤1 `!`, hashtag sign-off. Two gears, one beat.

### 4. Islander-argot

How the contestants actually talk. **This is where the clichés live — on purpose.** Villa
argot is a real dialect ("my head's been turned", "I'm grafting", "putting all my eggs in
one basket", "I've got a lot of love for you", "loyal", "100%", "on paper", "the ick",
"mugged off", "coupled up", "muggy", "I'm buzzing", "it is what it is"). Rendered as
**quoted dialogue**, it is *exempt* from the cliché blocklist — because in an Islander's
mouth it's authentic, not lazy. The Narrator using the same phrase would be a failure; the
Islander using it is characterisation.

- **Does:** use the real dialect fluently; over-affirm ("literally", "genuinely", "no
  word of a lie"); hedge romance with therapy-speak ("I need to protect my energy"); one
  `!` for genuine excitement.
- **Never:** be witty in the Narrator's way. Islanders are sincere, self-serious, and
  funniest when they don't know they're being funny. Don't write them jokes; write them
  earnestness.

| ✅ good | ❌ bad |
|---|---|
| “I’m not being funny, but my head has been turned. And I feel like that’s growth.” | “I have developed romantic feelings for another contestant.” |
| “On paper, we make sense. But my heart’s doing bits for someone else, if I’m honest.” | *(a self-aware quip — Islanders don’t know they’re on a show)* |
| “I came in here to be loyal. 100%. That’s just me as a person.” | “At the end of the day it is what it is,” *the Narrator observed.* ← cliché in the WRONG mouth |

### 5. Villa-copy

The functional layer: choice labels, button text, stat/resource names in the UI, screen
titles, the Edit shelf. Terse, concrete, on-voice. A label is a **verb the player commits
to**, not a description. Two–four words. It should read like a decision, and ideally carry
a wink.

- **Does:** lead with a verb; be specific; imply the risk. "Test the water." "Pull him for
  a chat." "Play it cool." "Bring her back."
- **Never:** use sentence case with a period, hedge ("Maybe try to…"), get cute enough to
  obscure what the choice *does*, or use `!`.

| ✅ good | ❌ bad |
|---|---|
| “Pull her for a chat” | “Attempt to initiate a conversation” |
| “Stay loyal” · “Crack on” | “Choose the faithful option” · “Be unfaithful” |
| “Come clean” · “Bury it” | “Confess everything!” · “Say nothing (safe)” |

---

## Craft principles (good-vs-bad pairs)

These cut across registers. When a line feels off, it's almost always one of these.

**Specificity beats scale.**
✅ “He brought her a Mini Milk. In this villa, that’s a diamond ring.”
❌ “He did something really romantic for her.”

**Undercut, don't underline.**
✅ “They said ‘I love you.’ It had been four days. Two of them were an argument.”
❌ “They said ‘I love you’ after only four days, which was very fast and dramatic!”

**End on the turn, then stop.**
✅ “You won the challenge. Your partner clapped last.”
❌ “You won the challenge, but your partner seemed a bit slow to clap, which maybe meant something was wrong between you.”

**Report drama like weather.**
✅ “There is shouting by the pool. It is 2 p.m. This is normal now.”
❌ “Tensions EXPLODED as a massive row kicked off by the pool!”

**Let dialogue be sincere; let narration be dry.** (The two-mouths rule.)
✅ Islander: “I’m buzzing, genuinely.” → Narrator: “He is, genuinely, buzzing. It will last until Tuesday.”
❌ Narrator: “He was, at the end of the day, absolutely buzzing.”

**Spice — frank, not explicit.** Adult and candid about sex and the mess of it. We don't
blush, and we don't reach for a coy cutaway every time; the villa runs on this and the copy
can say so plainly. The only line we don't cross is *describing the act itself* — deadpan
about the fact, never a play-by-play.
✅ “They had sex in the Hideaway and told no one. In this villa the scandal isn’t the sex, it’s the discretion.”
✅ “He’s slept with two of them and seems genuinely puzzled by the atmosphere.”
❌ “They spent the night together, if you know what I mean.” *(coy, winking, PG — too soft)*
❌ *(a play-by-play of the Hideaway)* *(too far — we state, we don’t narrate the act)*

---

## Cliché blocklist

The **generic reality-romance phrases** the Narrator and villa-copy must never fall into.
This list is deliberately *not* the villa argot (that's the good stuff — see register 4);
it's the tired filler that would fit any dating show's voiceover. Quoted Islander dialogue
is exempt.

Canonical copy lives in [`taste.mjs`](./taste.mjs) (`LOVE_ISLAND_CLICHES`, this folder) —
**keep this list and that array in sync.** Phase C grows it as real copy surfaces new
offenders.

```
at the end of the day        meant to be              110%
it is what it is             perfect match            110 percent
living my best life          head over heels          ride or die
here to make friends         love at first sight      good vibes only
not here to make friends     sparks flying            live laugh love
this journey                 sparks fly               understood the assignment
my journey                   whirlwind romance        living rent free
incredible journey           follow your heart        rent free
when you know you know       follow my heart          said no one ever
```

*(v4 S3 growth: the right-hand column's tail — meme-speak the factional and
couple-web writing kept reaching for. It dates faster than the villa; quoted
Islander mouths are exempt as ever.)*

---

## The lint floor

Enforced by [`tools/lint-content.mjs`](../../../tools/lint-content.mjs) over every
authored card, activating the moment the pack registers (Phase B1). Logic and tests:
[`tools/taste-core.mjs`](../../../tools/taste-core.mjs) +
[`test/taste-core.test.mjs`](../../../test/taste-core.test.mjs).

- **No hype punctuation** (house rule, every pack): ≤1 `!` per string, no `!!` / `!?` / `?!`
  — with the text-arrival ritual waived (`taste.mjs` `bangExempt`), because
  “I’VE GOT A TEXT!!” is supposed to be loud.
- **Cliché blocklist** (Love Island): the phrases above, scanned over the narrating voice
  with quoted dialogue stripped out.
- **Outcome-length cap** (Love Island): outcome text ≤ 240 characters — villa outcomes
  land the turn and get out.
- (Inherited structural checks: curly apostrophes only, no double spaces, known tokens.)

The floor is a *floor*, not the ceiling. It catches lapses; it can't make a line good.
That's what this document and the worked examples are for.

---

## v2 addendum — dialogue-first (the playtest correction)

The 5-run playtest verdict on v1's dominant register: **too much dry omniscient
narrator**. The v2 shift ([`V2-DESIGN.md`](./V2-DESIGN.md), "dialogue-first voice"):

1. **Beat and outcome text leads with what characters SAY.** Open on a quoted
   line wherever the scene has a mouth in it; the Narrator drops to brief stage
   directions between the quotes. The two-mouths rule still governs — Islander
   dialogue is sincere argot, narration stays deadpan — but the *ratio* flips:
   dialogue carries the scene, narration frames it.
   - ✅ `“Right. You and me. Wee chat.” {rival} pours you a drink like it’s a contract signing.`
   - ❌ `Your rival corners you in the kitchen for a probing conversation about your intentions.`
2. **Stirling carries the outside wit.** With the bark engine (ADR-0008) as a
   dedicated channel, card text no longer needs to smuggle the voiceover's
   commentary into every outcome — his jokes live in the popover, one layer up.
   Card copy that reads like a Stirling bit is usually copy that belongs to him.
3. **Encounters are the flagship register** ([ADR-0005](./adr/0005-encounters-branching-dialogue.md)):
   a beat is a *conversation with a person*, so its prompt should contain that
   person's actual voice, and its outcome should show their reaction — a face, a
   reply, a recalibration — not just a scoreboard movement described politely.
4. **The floor enforces it** (`taste.mjs` `dialogue`, checked by
   `lint-content.mjs` via `taste-core.mjs` `hasDialogue`): every
   `encounter`-tagged card's prompt must speak, and corpus-wide at least 60% of
   prompts / 35% of outcomes must carry actual dialogue. The floors sit just
   under the converted deck's measured level (prompts 66%, outcomes 40%) — a
   ratchet against register drift, not a target. Whether a *specific* narrator
   outcome should convert stays a craft judgement: montage and observational
   beats keep the booth voice on purpose.

The whole deck was converted to this addendum (the v2 voice pass): every card
reviewed, ~100 prompts/outcomes rewritten to lead with speech wherever the
scene has a mouth. The encounter files (`events-encounters.ts`,
`events-gossip.ts`, the ceremony cash-out) are the fullest worked examples.

---

## v4 S3 addendum — the wings and the web

Session 3 adds two card families with their own register hazards. The rules:

1. **The nation speaks as living rooms, never as demographics.** A faction is
   sofas, group chats, and nans — "🌹 Somewhere, a nan approves", "💅 the
   spine wing updates your file" — never polling language, never real-world
   political vocabulary (the audience split is values-based by charter). The
   wings get NICKNAMES in running copy (the soft wing, the spine-havers, the
   chaos wing, the popcorn) — coin once, call back, Stirling-style.
2. **Witness cards are someone else's scene.** The thread cast carry their
   OWN dialogue (Sophia gets the good lines in Sophia's showdown); the player
   is a camera with opinions, and the CHOICE is only their relationship to
   the moment. If the player's option could steer the couple, it's mis-written
   — witness, don't steer. Thread people stay hyper-specific: Marco's
   skincare has a suitcase, Dev's tea has a reserved seat, the shade is
   Marbella Sunset, NOT CORAL.
3. **The ick is reported by the tiny inspector, deadpan.** Interior dread
   gets the Narrator's flat face ("a tiny inspector behind your ribs puts
   down a clipboard"), never sentimental swelling. The partner's dialogue in
   an ick scene stays SINCERE argot — the two-mouths rule under stress is
   still the two-mouths rule.
4. **Repair is logistics, not poetry.** The grovel is coffees, towels, a
   rescued washing line — small nouns, sustained; the re-commitment is one
   plain sentence at the firepit. If a repair line reaches for a metaphor
   before it has named a beverage, cut the metaphor.
5. **Story beats announce their why.** Every `storyBeat` string is a
   one-sentence receipt ("Jilted on national television — and back on the
   horse.") — the ledger is diegetic, so the line must read like the show
   summarising you, not a quest log.
