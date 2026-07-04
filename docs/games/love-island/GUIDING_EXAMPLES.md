# GUIDING EXAMPLES — Love Island, worked scenes

Full villa moments rendered end-to-end, so content authors pattern-match against **whole
scenes**, not just isolated lines. Every register from [`VOICE.md`](./VOICE.md) is labelled
where it speaks. These are *reference*, not shipping cards — but they're written to pass the
lint floor (≤1 `!`, no blocklist cliché in narration, outcomes ≤240 chars, curly quotes).

Cards are shown in their engine shape: **Context** (where we are), a **Prompt** (Narrator,
sometimes wrapped in a Text), two **Choices** (villa-copy labels + the stats they lean on),
and each choice's three **outcomes** (bad / good / incredible — Narrator, often with quoted
argot). Effects are sketched in `‹brackets›` to show intent, not final tuning.

Player Islander below is **you** (she/her here for the worked case; format is hetero for
launch — ADR-0003). Named Cast are placeholders.

---

## 1 · First date — *Arrival (Act 1)*

The soft open: establish Rizz, plant the first Bond, meet the Cast.

> **Context:** Day 2 · the terrace
>
> **Text** *(Priya, holding the phone)*: “I’ve got a text!”
> *“[YOU], it’s time for your first date. Two boys are waiting on the terrace. Pick one. #firstlook”*
>
> **Prompt** *(Narrator)*: Two chairs, two drinks the colour of a warning label, and a boy at each. Behind the wall, the nation is deciding whether you have a personality. So, apparently, are you.

**Choice — left · “Keep it light”** ‹Loyalty 1.0, Savvy 0.3 — safe, builds slow Bond›
- **bad** *(Narrator)*: You ask three questions about his job. He answers all three. It is the most anyone has learned about pipe fitting on this network. ‹Bond +1, In Your Head +2›
- **good** *(Narrator)*: Easy, warm, no fireworks. He says, “I could actually talk to you.” In here, that’s a diamond ring. ‹Bond +4, Public +2›
- **incredible** *(Narrator)*: You don’t perform. He notices. “You’re not like I expected,” he says, meaning it. The Bond does the loud part for you. ‹Bond +7, Public +3, Graft +2›

**Choice — right · “Turn it on”** ‹Rizz 1.0 — risky, screen-time, Followers›
- **bad** *(Narrator)*: You open with a line about star signs. He is a Capricorn and, it emerges, a critic. ‹Rizz +2, In Your Head +4›
- **good** *(Narrator)*: You do the airport story. He leans in; the camera leans in with him. ‹Rizz +4, Public +3, Graft +2›
- **incredible** *(Narrator)*: By the second drink he’s forgotten the other girl’s name. So, live on air, has the other girl. ‹Rizz +6, Public +5, Followers +4, Bond +2›

---

## 2 · A challenge — *Arrival→Turn*

Challenges are the villa's game shows: physical, silly, and a licensed excuse for chaos.
A **Text** imposes the beat; the **firepit / lawn** gathers; drama pays Public and Followers.

> **Context:** the lawn · “Snog, Marry, Pie”
>
> **Text** *(the group, reading over a shoulder)*: “I’ve got a text!”
> *“Islanders, today you’ll find out exactly what each other really think. On your marks. #nowhere2hide”*
>
> **Prompt** *(Narrator)*: The rules: snog the one you fancy, marry the one you trust, and put a custard pie in the face of the one you don’t. Everyone is smiling. Nobody is safe. Your partner is watching which door you walk toward.

**Choice — left · “Play it honest”** ‹Loyalty 1.0 — protects Bond›
- **bad** *(Narrator)*: You marry your partner and pie the bombshell. The bombshell laughs. It is not the good kind. ‹Bond +3, addFlag: villa_beef›
- **good** *(Narrator)*: You snog your partner in front of everyone. Petty of you, and it works. ‹Bond +5, Public +3›
- **incredible** *(Narrator)*: You marry your partner and mean it. Someone in the crowd says “aww.” Someone else says nothing, loudly. ‹Bond +7, Public +4, addFlag: exclusive_pressure›

**Choice — right · “Cause a scene”** ‹Charisma 1.0, Rizz 0.3 — drama → Followers, risks Bond›
- **bad** *(Narrator)*: You snog the boy who isn’t yours “for the game.” Your partner accepts this explanation the way one accepts weather. ‹Followers +4, Bond −4, In Your Head +3›
- **good** *(Narrator)*: You pie the loudest girl and snog the bombshell. The group chat, later, will need a whole evening. ‹Followers +6, Public +3, Bond −2›
- **incredible** *(Narrator)*: You turn a party game into a cliffhanger. Three couples now have “a chat” to schedule. You did that. ‹Followers +9, Public +5, Bond −3, Graft +3›

---

## 3 · A graft beat — *the daybed (Edit / Angles)*

The "shop" that isn't a shop: you spend **Graft** to invest in your **Edit** — pick one
**Angle** off the shelf (the reputation you're building). Slot-limited; a full Edit
**swaps and discards** the old Angle. On a botched flagship moment a fragile Angle gets
**exposed** (falls off). This beat is the diegetic version of "who are you on this show."

> **Context:** the daybed · afternoon lull
>
> **Prompt** *(Narrator)*: Sun’s out. Half the villa is asleep and the other half is deciding your reputation for you. You’ve banked enough goodwill to become a *thing*. Every reality show is really about becoming a thing.

**Choice — left · “Lean into the loyal edit”** ‹cost: Graft 6 — Angle: *The Loyal One*›
- **bad** *(Narrator)*: You tell the girls you’d “never play a game.” Two of them exchange a look older than the villa. ‹−Graft, Angle: The Loyal One, addFlag: watched›
- **good** *(Narrator)*: You back your friend in the row and mean it. The edit writes itself: you’re the one people trust. ‹−Graft, Angle: The Loyal One, Public +3›
- **incredible** *(Narrator)*: You defuse a fight without picking a side, and somehow everyone thanks you. Casting a spin-off would be premature. Barely. ‹−Graft, Angle: The Loyal One, Public +4, Bond +2›

**Choice — right · “Become the villain”** ‹cost: Graft 6 — Angle: *The Villain*, loseOnBad›
- **bad** *(Narrator)*: You go for the one-liner. It lands on the wrong person and the room turns. The Angle doesn’t stick; you just look mean. ‹−Graft, no Angle, Public −2, In Your Head +3›
- **good** *(Narrator)*: One perfect, quotable read at the firepit. You are now Someone With An Opinion. Followers arrive to watch. ‹−Graft, Angle: The Villain, Followers +5›
- **incredible** *(Narrator)*: You say the thing everyone was thinking and no one dared. The clip will outlive the season. ‹−Graft, Angle: The Villain, Followers +9, Public +2›

---

## 4 · A recoupling — *act break, the alternating chooser*

The ceremony. Couples re-form, and **who chooses alternates** (ADR-0003). When *your*
gender chooses, you keep or switch (a switch **resets Bond**); when the *other* gender
chooses, **you're exposed** and survive only on `Bond ≥ floor OR Public ≥ floor`. A big
recoupling escalates from Text to the **Host in person**. This one: the boys choose, and
you're single going in.

> **Context:** the firepit · night · a recoupling
>
> **Text** *(everyone, at once)*: “I’ve got a text!”
> *“Tonight, there will be a recoupling. The boys will choose. The girl not chosen will be dumped from the Island. #decisiontime”*
>
> **Host** *(arriving — the room goes quiet)*: “Boys. You’ve had time to think. One by one, you’ll tell me who you want to couple up with — and why.”
>
> **Prompt** *(Narrator)*: There are four boys and five girls, which is a maths problem with feelings. You have no partner to protect you tonight, only whatever the last three weeks bought you. The firepit has never felt so wide.

**Choice — left · “Trust the graft”** ‹resolves on Bond — leans Loyalty›
- **bad** *(Narrator)*: The boy you’ve been building with hesitates, then says a different name. The Bond wasn’t enough, and Bond was all you brought. ‹single → check Public floor›
- **good** *(Narrator)*: Kai steps forward. “I want to keep getting to know…” — and it’s you. The Bond held. ‹stay coupled, Bond +2›
- **incredible** *(Narrator)*: Two boys say your name. The Host lets the silence sit, then, gently: “Well. Someone’s had a good week.” ‹stay coupled, Public +4, Bond +2›

**Choice — right · “Work the room first”** ‹resolves on Public — leans Charisma/Savvy›
- **bad** *(Narrator)*: You spent the week being liked by everyone and chosen by no one. The nation adored you. The boys forgot you. ‹single → check Bond floor›
- **good** *(Narrator)*: You’re not the strongest couple, but you’re the one people vote for, and the boys can count. You’re safe. ‹stay coupled, Public +3›
- **incredible** *(Narrator)*: A boy switches partners *to* you, live, on the strength of your edit alone. His old couple’s Bond just became your problem. ‹switch → Bond resets to base, Public +5, addFlag: villa_beef›

---

## 5 · Casa Amor betrayal + The Reveal — *the Turn (Act 2 centrepiece)*

The marquee set-piece. The villa splits; your couple is separated; you face a loyalty
gauntlet. **You know your own dirt** — your Partner's stays hidden until **The Reveal**
(dramatic irony). The Reveal lands twice: the **postcard** (a misleading teaser) and
**Movie Night** (the full footage). A **come-clean** beat trades a bigger exposure for a
smaller, certain hit. This example: you strayed; you don't yet know if he did.

> **Context:** Casa Amor · night 3 · the other villa
>
> **Prompt** *(Narrator)*: Six new boys, one duvet each, and a partner forty minutes and one postcode away. Everything you do here, he’ll find out about. Not tonight. But he will.

**Choice — left · “Stay loyal”** ‹Loyalty 1.0 — the faithful line›
- **bad** *(Narrator)*: You sleep on the daybed to be safe. You wake up stiff, righteous, and quietly furious at no one in particular. ‹Bond +3, In Your Head +3›
- **good** *(Narrator)*: You talk about him to the new boys until they give up. One calls you “boring.” You take it as a compliment. ‹Bond +5, Public +3, addFlag: loyal_at_casa›
- **incredible** *(Narrator)*: You don’t waver, and it reads on camera as strength, not fear. The public falls a little in love with you. ‹Bond +7, Public +5, Graft +3, addFlag: loyal_at_casa›

**Choice — right · “Let your head turn”** ‹Rizz 1.0, Savvy 0.3 — Temptation, sets a latent flag›
- **bad** *(Narrator)*: You kiss the bombshell. It is fine. It is, in fact, so fine that you immediately understand you’ve made a mistake for nothing. ‹Followers +3, addFlag: casa_kiss, Bond −2 (latent)›
- **good** *(Islander, in the moment)*: “I’m not being funny, my head’s proper been turned.” *(Narrator)*: It has. The footage exists. He is asleep, loyal, and doomed to a slideshow. ‹Followers +6, addFlag: casa_kiss›
- **incredible** *(Narrator)*: You bring the bombshell back to the main villa. It’s a power move, a betrayal, and content — all three at once. ‹Followers +9, addFlag: casa_recouple, Bond reset pending Reveal›

### The postcard *(the teaser — production-cut, misleading on purpose)*

> **Text** *(to the main villa)*: “I’ve got a text! A postcard from Casa Amor…”
> **Prompt** *(Narrator)*: One photo. You, mid-laugh, a boy’s hand somewhere ambiguous, cropped by a producer who knows exactly what they’re doing. Your partner sees the worst reading first. Whether it’s the *true* reading, he won’t know until Movie Night.

**If you strayed → come clean, or let it ride:**

**Choice — left · “Come clean at the firepit”** ‹trade a big Reveal for a smaller certain hit›
- **good** *(Islander, to him)*: “Before you see anything — I need to be honest. My head was turned. I’m telling you because you deserve to hear it from me.” *(Narrator)*: It costs you. It costs you less than Movie Night would have. ‹Bond −4, Public +3, clears casa_kiss detonation›

**Choice — right · “Say nothing”** ‹gamble on his footage being worse than yours›
- **bad** *(Narrator)*: You hold his hand at breakfast with the confidence of someone who has not yet seen the edit. Movie Night is Thursday. ‹addFlag: reveal_pending›

### Movie Night *(The Reveal — full footage, both ways)*

> **Host** *(arriving, remote in hand)*: “Islanders. Grab a drink. Tonight, you’re watching a film. It’s about all of you.”
> **Prompt** *(Narrator)*: The screen lights up. Your Casa kiss plays to the whole villa in HD, with sound. And then — because you never knew his dirt — the reel keeps going, and it’s *him*, at Casa, doing exactly what you did. Two betrayals, one sofa. Nobody wins Movie Night. ‹detonate casa_kiss; reveal partner_strayed; Bond → floor; Public ±per edit; In Your Head +6›

---

## 6 · A dumping — *live, Act 2+*

The external exit (**Dumped**, ADR/CONTEXT): the public craters, or you're single at a
chooser-recoupling. Delivered by the **Host**, in person, plainly. We do not soften it into
mush and we do not gloat. One clean beat of warmth, then the door.

> **Context:** the firepit · a live dumping
>
> **Text**: “I’ve got a text! The public have been voting…”
> **Host** *(the villa gathered, no music)*: “Islanders. The public have voted for their favourite couples. The couple with the fewest votes will leave tonight. I can now reveal… the couple that is safe is everyone but one.”
>
> **Prompt** *(Narrator)*: You already know. You knew at “fewest votes.” The others are doing the thing where they hold your hand harder to feel better about themselves.

**Choice — left · “Leave with grace”** ‹In Your Head −, Followers +, a clean edit on the way out›
- **good** *(Islander, standing)*: “No, honestly — I’ve had the best time. I met my best mates in here.” *(Narrator)*: She means it, which is the part that gets you. ‹Followers +5, In Your Head −4 → run ends: Dumped›
- **incredible** *(Narrator)*: You give a goodbye speech so gracious the public immediately regrets voting. The clip does numbers you never did in the villa. ‹Followers +9 → run ends: Dumped (fan favourite)›

**Choice — right · “Say the quiet part”** ‹drama → Followers, torches goodwill›
- **bad** *(Islander)*: “Some people in here know exactly what they did.” *(Narrator)*: A sentence that will follow four separate people to the reunion. ‹Followers +7, Public −3 → run ends: Dumped›

---

## Micro-register cheat sheet

Fast reference while writing. Full rules in [`VOICE.md`](./VOICE.md).

| Register | Speaks to | Feels like | `!`? |
|---|---|---|---|
| **Narrator** | the audience | dry weather report on a heart attack | never |
| **Host** | the Islanders, by name | poise + lethal timing | rarely, measured |
| **Text** | the villa (from above) | an instruction with a hashtag | the one on “I’ve got a text!” |
| **Islander-argot** | each other | sincere, self-serious, unknowingly funny | for real excitement |
| **Villa-copy** | the player | a verb you commit to | never |

**The two-mouths rule, one more time:** the Islander may say “at the end of the day, it is
what it is.” The Narrator may never. Sincerity lives in quotes; dryness lives outside them.
