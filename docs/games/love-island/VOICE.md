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
5. **No hype punctuation.** One `!` is allowed for the **"I've got a text!"** ritual and
   for genuine Islander excitement — never two, never `?!`. The Narrator earns zero. If a
   line needs an exclamation mark to be funny, it isn't funny yet. *(Enforced: ≤1 `!` per
   string, no `!!`/`!?`.)*
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

The dry voiceover — the Iain-Stirling register. Speaks **to the audience, never to the
Islanders**, and never enters the villa. Editorialises, sets scenes, twists the knife
gently. This is the pack's dominant voice: prompts and outcome text are Narrator unless
they're quoted dialogue.

- **Does:** frame the scene with one specific detail; report drama deadpan; land a turn.
- **Never:** cheerlead, use `!`, speak in cliché, address the player as "you the viewer,"
  moralise, or feel sorry for anyone out loud.

| ✅ good | ❌ bad |
|---|---|
| “Two hours of eye contact and a shared opinion about airports. In the villa, that’s a marriage.” | “The chemistry between them was absolutely electric!” |
| “He calls it a connection. The group chat calls it a warning.” | “Little did he know, drama was on the way…” |
| “She reapplies her lip gloss. It is a coping mechanism and a weapon.” | “She was feeling really emotional and upset about it.” |

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

> The *"I've got a text!"* line is spoken by the Islander who holds the phone — that's the
> one `!` this register is built around. The body of the text is the flat production voice.

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
this journey                 sparks fly
my journey                   whirlwind romance
incredible journey           follow your heart
when you know you know       follow my heart
```

---

## The lint floor

Enforced by [`tools/lint-content.mjs`](../../../tools/lint-content.mjs) over every
authored card, activating the moment the pack registers (Phase B1). Logic and tests:
[`tools/taste-core.mjs`](../../../tools/taste-core.mjs) +
[`test/taste-core.test.mjs`](../../../test/taste-core.test.mjs).

- **No hype punctuation** (house rule, every pack): ≤1 `!` per string, no `!!` / `!?` / `?!`.
- **Cliché blocklist** (Love Island): the phrases above, scanned over the narrating voice
  with quoted dialogue stripped out.
- **Outcome-length cap** (Love Island): outcome text ≤ 240 characters — villa outcomes
  land the turn and get out.
- (Inherited structural checks: curly apostrophes only, no double spaces, known tokens.)

The floor is a *floor*, not the ceiling. It catches lapses; it can't make a line good.
That's what this document and the worked examples are for.
