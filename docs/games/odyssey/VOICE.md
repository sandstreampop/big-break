# VOICE — how The Odyssey talks

The taste bible for the Odyssey Pack. Distilled from the grilling interview
(2026-07-10, [`grill.md`](./grill.md) Q12 + "Voice law") and calibrated across
three taste passes there — the first samples were rejected as *"too dry, too
close to AI writing"*, and the register below is what survived. Content
authors (human or agent) pattern-match against this and against
[`GUIDING_EXAMPLES.md`](./GUIDING_EXAMPLES.md) before writing a single card.

Vocabulary is fixed by [`CONTEXT.md`](./CONTEXT.md); this doc governs
*register and craft*. The blocklists here are mirrored by
[`taste.mjs`](./taste.mjs) (the game's own machine data, canonical) and
enforced through the genre-neutral checker in
[`tools/taste-core.mjs`](../../../tools/taste-core.mjs) — see the lint floor,
below.

---

## The register, in one line

**Lewis's warmth at the fire, Homer's roll in the telling, Le Guin's hush in
the deep places.**

One voice — the Bard's — in three weathers. He is a performer with charisma,
not an essayist: rousing epic abundance, long rolling sentences, epithets
invented fresh, direct address to the fire, and he SPEAKS aloud in quotes.
Inside the tale he is serious; around it he is alive. The failure mode this
pack was calibrated *against* is the tasteful murmur: clipped short sentences,
no wasted space, tidy conclusions — the AI voice wearing a laurel. When a line
could be cut in half without losing anything, check whether the half you'd cut
was the performance.

---

## The three weathers

### 1. The Frame — the bard at the fire

Cold opens, act intros, recaps, slips, endings' last words, the hecklers, the
overlay notes. The frame **works the crowd**: direct address ("friends", "you
by the woodpile"), questions flung at the audience, exclamations spent as
performance beats, the bard's vanity and his fee, wine and figs and rival
bards. Warmth is the ground note — Lewis reading aloud, delighted to have you.

- **Does:** address the fire directly; take requests and refuse them; count
  ships wrong and be corrected; bill the audience for the good parts; wink at
  the fact that tellings vary (the roguelike winking at the player, fully
  in-fiction — the joke lands twice).
- **Never:** mock the tale. The bard mocks **himself, his rivals, his
  audience, and his fee** — the moment the frame sneers at the Odyssey, the
  stakes die. And never slapstick: frame comedy is wit.

| ✅ good | ❌ bad |
|---|---|
| “You want the horse. I can see you wanting the horse. Wrong poem, friend — that one costs extra.” | “Get ready for an EPIC adventure!” |
| “Did I say nine ships? Six. The woman by the woodpile is holding up fingers at me. Six, and I will thank the fire to remember I said so from the start.” | “(The bard rolls his eyes at how silly this old story is.)” |
| “Phemios of Smyrna does the storm with a drum. A drum! The sea does not need a drum; the sea needs a man who has looked at it.” | “This part is boring, so I’ll skip ahead.” |

### 2. The Telling — the tale under way

Card prompts, results, the landmarks: the voyage itself. Homer's roll —
abundance, but *grave* abundance: the long sentence earns its length by
carrying freight (the sea's weather, the crew's hands, the specific smell of
the cave). Odysseus and his men speak in quotes, plainly and to the point.
The bard does not joke inside the tale; his wit waits at the fire.

- **Does:** concrete sensory detail; invented epithets (fresh every time — a
  sea "the color of a bruise", never a stock formula); named crew doing
  specific work; the turn landed in the last clause.
- **Never:** stated emotion, summarized violence, stock Homeric formulas
  (they're on the blocklist — this bard makes his own), or the frame's
  crowd-work leaking in.
- **But the tale is allowed to be funny the way HOMER is funny** (the
  counter-register — 2026-07 review, risk #1): surprise, cruelty, stupidity,
  bodily comedy, abrupt reversal, *sourced from the text*. The Nobody pun is
  a dumb joke that works; Elpenor dies falling drunk off a roof; the Cretan
  lies make Odysseus a fraud with a straight face; Irus is punched once in a
  beggars' boxing match; men become pigs. What stays banned is comedy
  *imported* from outside the poem's own registers — and the bard sneering
  at the tale, which is a different thing from the tale being ridiculous.

| ✅ good | ❌ bad |
|---|---|
| “The sheep came out of the cave unshepherded.” | “A wave of grief washed over the men.” |
| “Old Perimedes is lashing the jars without being told. The mast complains in a voice you have not heard it use before.” | “A terrifying storm was brewing and everyone was scared.” |
| “What the Cyclops did then, I will not sing at this fire. The count in the morning was two short, and no one said the names loudly.” | *(a blow-by-blow of the cave)* |

### 3. The Deep — the hush

The Underworld, the god-noticing beats, the drowned, Despair. **The deep
places are silent.** No exclamation nine fathoms down; no questions worked at
the crowd; dread is quiet and sentences shorten of their own weight. The frame
crackles, the deep does not — **that contrast is the voice's engine.** When
the fire goes quiet, the audience leans in; spend the hush only where the tale
earns it.

| ✅ good | ❌ bad |
|---|---|
| “Far down, where the light gives up, something turns its attention. Nothing has happened yet. The sea does not get rougher. It gets interested.” | “Suddenly, POSEIDON HIMSELF was watching!” |
| “The dead came to the blood quietly, in no hurry, the way the poor come to a door they know will open.” | “The ghosts were super creepy and the crew freaked out.” |

### 4. Tale-copy — the functional layer

Choice labels, buttons, stat and resource names, screen titles. Middle-length
by law: **the long breath lives where the screen can hold it** — narration
boxes, results, act intros — and card prompts and choice labels stay
middle-length so 320px never chokes. A label is a verb the player commits to,
with the door's flavor in it.

| ✅ good | ❌ bad |
|---|---|
| “Put spears to him now” · “Be Nobody” · “Claim the guest-right” | “Attack” · “Use trickery to deceive the Cyclops” |
| “Bank the telling here” | “Quit run (partial rewards)” |

---

## The laws

1. **Show, don't tell — the law with teeth.** Concrete sensory detail or
   aftermath, never stated emotion or summarized violence. "The sheep came out
   of the cave unshepherded" beats any sentence containing "grief". If a line
   points at content ("something terrible happened", "he said the wrong
   thing"), replace the pointer with the content. Enforced: the `tells`
   blocklist in [`taste.mjs`](./taste.mjs), grown as new offenders surface.
2. **The bard never mocks the tale** — only himself, his rivals, his audience,
   and his fee. Irony lives in the frame; the tale is told straight. Told
   straight is not told solemn: Homer's own comedy — the dumb pun that
   works, the drunk boy and the roof, the hero lying like a rug — is IN the
   tale, and telling it straight means letting it be funny where the text
   is funny.
3. **The long breath lives where the screen can hold it.** Narration boxes,
   results, act intros roll; prompts and labels stay middle-length. (Watch-out
   from the grill: epic breath on a phone card is a named bet — judge it under
   crowding/mobile-matrix, renegotiate there, not by flattening the voice.)
4. **The deep places are silent.** Zero `!` in deep copy; dread is quiet.
5. **Questions and exclamations are performance beats** — used freely in the
   frame to work the crowd, sparingly inside the tale where gravity rules.
   The house ≤1-`!` cap is rewritten for this pack: **earned, not rationed to
   death** — up to 2 per string (`taste.mjs` `maxBang`), and never `!!` /
   `!?` / `?!` anywhere. An exclamation that isn't a beat the bard would
   physically perform is hype; cut it.
6. **Epithets invented fresh, never stock.** No rosy-fingered dawn, no
   wine-dark sea, no wily Odysseus — Homer's formulas are on the blocklist
   because this bard coins his own ("a sea the color of a bruise", "the man
   the gods argued about"). One fresh epithet outweighs ten inherited ones.
7. **Frame comedy is wit, never slapstick**, from three engines: the bard's
   vanity and professional economics (wine, figs, payment, rival bards); the
   audience's memory; and the **retelling wink** — jokes about tellings
   varying are the roguelike winking at the player, fully in-fiction, landing
   twice. (The slapstick ban is the FRAME's: the bard performs wit, not
   pratfalls. The tale's own bodily comedy — Elpenor, Irus, the pigs — is
   law 2's business, and it is licensed.)
8. **The heckler ensemble is canon** across all tellings, so gags accumulate
   across runs like the prophecy does: the woman by the woodpile (the
   fact-checker; her grandfather knew a rower), the potter's boy (deadpan
   devastation), the man who wants the horse (running gag), Phemios of Smyrna
   (the unseen rival who "sings flat, but that is between him and whatever god
   he has offended"). Hecklers speak in quotes; their speech is exempt from
   the cliché blocklist the way all quoted mouths are.
   *Cross-reference — the Memory Law* (2026-07-11,
   [`NORTH-STAR.md`](./NORTH-STAR.md), recorded in
   [`adr/0001-motion-law.md`](./adr/0001-motion-law.md)): cross-run memory is
   a personality engine — the hecklers remember your previous tellings and
   say so, the way the prophecy already accumulates. The named watch-out
   binds every callback line: memory can curdle into the game mocking the
   player, and law 2 extends to the teller — the crowd needles the bard and
   each other, **never sneers at the player's play**. Callback copy goes
   through the same verdict loop as all odyssey content.
9. **Violence at the bard's discretion** — offscreen-in-language, never gore:
   "what the Cyclops did then, I will not sing at this fire." The aftermath
   may be exact (the morning count, the unshepherded sheep); the act is not
   narrated.
10. **Curly apostrophes and quotes** (`’ “ ”`), always. Straight quotes fail
    lint. (House rule, every pack.)

**Anti-taste (never do this):** the tasteful murmur (clipped, tidy, joke-free
— the rejected first calibration); hype (`amazing!!`); stage directions for
the reader ("ominously"); explaining the joke or the dread; stock epic filler
(see the blocklist); modern idiom inside the tale ("okay", "basically");
sentimental swelling; and **the museum plaque** — a result that lands on a
detachable aphorism (*"X, friends, is Y"*), named by the 2026-07 review as
this pack's own signature lapse. One earned epigram is a spice; two stacked
are a plaque; a card that ends on the abstraction instead of the man is
reverence doing the AI voice's job. When in doubt, land on something a
body did. If it could be the voiceover of *any* mythology
documentary, it has failed the frame; if it could be *any* fantasy novel's
narration, it has failed the telling.

---

## Cliché blocklist

Two families, one list: **stock Homeric formulas** (this bard invents his own
epithets — law 6) and **epic-narrator filler** (the AI-ism this genre reaches
for). Scanned over narration with quoted speech stripped; a heckler may say
"against all odds" — the bard may not.

Canonical copy lives in [`taste.mjs`](./taste.mjs) (`ODYSSEY_CLICHES`, this
folder) — **keep this list and that array in sync.** Grown as real copy
surfaces new offenders.

```
rosy-fingered dawn           against all odds         the rest is history
wine-dark sea                little did he know       would never be the same
wily odysseus                little did they know     in that moment
much-enduring                the stuff of legend      a tale as old as time
swift-footed                 legends are born         tapestry of
grey-eyed goddess            test of courage          testament to
the face that launched       braved the               the very fabric
epic journey                 stakes were high         nothing could prepare
```

*(The array additionally carries spelling/spacing variants of the formulas —
`rosy fingered dawn`, `wine dark sea`, `much enduring`, `swift footed`,
`gray-eyed goddess` — so an unhyphenated or US-spelled lapse is still caught.
Count a variant and its parent as one entry when syncing.)*

**Show-don't-tell `tells`** (the second blocklist — pointers at content the
line should render, and the stated emotions law 1 bans from narration):

```
grief washed over            felt a surge of          something terrible
a wave of grief              felt a wave of           the wrong thing
filled with dread            his heart sank           said the right thing
filled with sorrow           hearts heavy             what happened next
filled with rage             overcome with            you feel a chill
```

---

## The lint floor

Enforced by [`tools/lint-content.mjs`](../../../tools/lint-content.mjs) over
every authored string, activating the moment the pack registers. Logic and
tests: [`tools/taste-core.mjs`](../../../tools/taste-core.mjs) +
[`test/taste-core.test.mjs`](../../../test/taste-core.test.mjs).

- **Punctuation** (house rule, retuned — law 5): ≤2 `!` per string
  (`taste.mjs` `maxBang: 2`), never `!!`/`!?`/`?!`. The deep's zero-bang law
  is craft discipline the examples model; the cap is the machine floor.
- **Cliché blocklist** (Odyssey): the phrases above, scanned over the
  narrating voice with quoted speech stripped.
- **Tells blocklist** (Odyssey): the show-don't-tell offenders above, same
  scan.
- **Outcome-length cap**: outcomes ≤ 650 characters — the long breath is
  licensed in results (music's cap is 600, LI's 240; the odyssey rolls
  longest by design). Recalibrated from 420 in the slice-4 writing pass: the
  authored sea proved the tighter cap fought law 3's own license. A result
  is still a landing, not a chapter — the cap is where landing ends.
- (Inherited structural checks: curly apostrophes only, no double spaces,
  known tokens.)

The floor is a *floor*, not the ceiling. It catches lapses; it can't make a
line sing. That's what this document and the worked examples are for.

---

## The second screen — word travels (ADR-0014)

No phones at this fire, so the odyssey's second screen reads as the WORD
moving: **the harbor wall** (pilots, traders, the fish stalls — rumor of the
voyage, three ports downwind of the truth), **Olympus** (the powers' dry
minutes — Athena clipped and fond, Hermes wry, Poseidon in weather-caps, the
Fates terse), and **round this fire** (the roster's own ensemble heckling the
telling — the woman by the woodpile counts, the potter's boy deadpans, the
man who wants the horse wants the horse, and Phemios needles from Smyrna).

The register split (mirrored in `taste.mjs` `feeds`): **post bodies are
sincere quoted mouths** — each room's real dialect turned up a notch — so
they carry the quoted-speech cliché/bang exemption but keep the structural
floor (curly apostrophes, ≤300 chars, no copy-pasted posts, ≥90 bodies so
the word keeps traveling). **The chrome** (teasers, headlines, and the
shell-label re-voicing in `Presenter.feedChrome`) is narration and keeps the
house rules. Honesty is law here as everywhere: each room's mood dot reads a
real meter (harbor ⇢ Renown under Poseidon's weather, Olympus ⇢ the
Athena/Poseidon ledger, fire ⇢ Despair), and ambient seas stay silent —
landmarks, temptations, act breaks, and the ending are when word moves.

---

## The feedback loop

Same loop as love-island (grill Q16): batches of authored copy go to the
human for verdicts (`love`/`like`/`dislike`), archived in
[`taste-feedback/`](./taste-feedback/) in the LI JSON shape; recurring
dislikes become blocklist entries here + in `taste.mjs`, and ⭐ exemplars are
promoted into `GUIDING_EXAMPLES.md`. No content ships un-verdicted twice: the
first batch calibrates, later batches spot-check.
