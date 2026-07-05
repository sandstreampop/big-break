# For Viktor — the five human calls, staged (v3, 2026-07-05)

Everything below is **prepared, not decided** (ROADMAP §5). Each item is
ready to execute the moment you pick; none blocks anything else that
shipped in v3.

---

## 1 · The name (F1/R10 — blocks the public push, nothing else)

Soft-rename candidates that read as the format without the ITV mark. All
format beats (recoupling, bombshell, the text ritual) are unprotectable
convention; "Casa Amor" is the one in-game name worth swapping at rename
time. Screens already say **THE VILLA**, so option 1 is a zero-cost default.

| candidate | for | against |
|---|---|---|
| **The Villa** | already the on-screen logo/share head; generic term, weak mark risk | hard to search; several villa-adjacent games exist |
| **Grafted** | villa argot, one word, distinctive; describes the whole game | argot may not read in the US market |
| **Text From the Villa** | ownable, names the signature ritual | long; abbreviates awkwardly |
| **Second Wave** | clean, dramatic, already a beat name in-game | ambiguous out of context (pandemic-y) |
| **The Wobbly Lounger** | pure comedy, zero collision risk, extremely merchable | undersells the romance half |

Execution when you pick: title/manifest strings, `og:` copy, URL alias +
redirect, keep pack id internal — one staged PR (~an afternoon). A formal
trademark/collision search is the one step that should be human-verified.

## 2 · Art direction (E1/R12)

The portrait system is emoji-faces × six mood rings; verdicts resolve on
tints plus (since v3) confetti/shake. Three pipeline options, cost-ordered:

1. **Stay emoji, add composition** — verdict reaction "crops" built from
   the existing faces at larger scale with pose-ish framing (CSS only, no
   assets). Cheapest; I can ship it without you.
2. **Generated SVG portraits** — extend `art.ts`'s procedural scenes to
   faces (deterministic per cast id, mood-parameterised). One style
   decision from you, then autonomous.
3. **Commissioned sprite set** — 16 cast × 6 moods + held/rescued/dumped
   reaction crops (~50 slots the art map already reserves). Real budget,
   real pipeline decision; the screenshot moment the market sweep wanted.

## 3 · Taste spot-verdicts (I3 — the calibration control rod)

v3 added ~230 authored strings (Stirling 95→190, tutorial, Partner-shape
openers, the Bestie arc, memory entries, the Clarity Layer's reads/recaps/
stakes). ~10% sample below — mark ✓/✗/rewrite; verdicts feed the next
calibration pass. All pass the machine floor already; this is the
**judgment** layer.

- [ ] Stirling/bad: “We’ll be right back after this break, because I need a minute.”
- [ ] Stirling/bad: “You can pull a muscle reaching like that. See the physio.”
- [ ] Stirling/incredible: “Somewhere a nan just phoned another nan. That’s how you win this show, by the way. Nans.”
- [ ] Stirling/banter-bad: “Never do the bit a second time. The second time is a hostage situation.”
- [ ] Stirling/camera-bad: “Playing to camera three. Camera three is off, pal. Has been all week.”
- [ ] Stirling/date-bad: “Ordered for them. ORDERED for them. The nation just did one sharp intake.”
- [ ] Stirling/temptation-bad: “Nothing happened. The footage of nothing happening is forty minutes long.”
- [ ] Stirling/verdict-dumped: “The firepit went quiet in the wrong shape, and you knew before I did. Head high. The car has snacks.”
- [ ] Stirling/forecast-danger: “Forecast: exposed, with a chance of taxi. Wear something you can leave in.”
- [ ] Stirling/memory: “Back for more? The villa kept your water bottle. That’s not sweet, by the way — that’s evidence retention.”
- [ ] Stirling/tutor: “They look like a person; they function as a countdown. It goes off at the next recoupling.”
- [ ] Tutorial/coach-free bad tier: “Tyler gives a nine-minute toast with three separate references to his gym.”
- [ ] Shape/sweetheart prompt: “I like you. Properly. That’s it. That’s the announcement.”
- [ ] Shape/game-player incredible: “‘Huh,’ they say — the exact sound of a spreadsheet catching feelings.”
- [ ] Shape/slow-burner good: “Somewhere in minute forty {partner}’s shoulder arrives against yours. Enormous, by their scale.”
- [ ] Bestie prompt: “Everyone in here is performing except possibly you. Don’t make me regret this tub.”
- [ ] Bestie incredible: “By 2 a.m. you have what nobody else in here has: a witness.”
- [ ] Memory/partner prompt: “Take two. Same swing, same us. Are we smarter now, or just tanner?”
- [ ] Clarity/bond read: “💘 The Bond craters. The duvet has a border now.”
- [ ] Clarity/tier crossing: “You’re basically strangers again.”
- [ ] Clarity/recap threat: “And you’re carrying a loud head into a week that eats loud heads — get it quiet or you’ll walk.”
- [ ] Clarity/Movie Night stake: “🎬 Your reel is clean. That has never once stopped Movie Night.”
- [ ] Daily end note: “…same bombshells, same secrets, same wobbly lounger.”
- [ ] Redemption card: “You’re the one from — the season with the — you CRIED at the—”

## 4 · Playtesters (the SE cluster is your network by construction)

Ready to paste anywhere:

> **Reigns, but you’re in the villa — and every choice is free.**
> One Season ≈ 5 minutes, on your phone, no install, no account:
> https://sandstreampop.github.io/big-break/love-island/
> New: a daily villa (same season for everyone — compare notes), and the
> game finally *shows* you what’s happening. Tell me where you got lost.

What the instruments now measure per new player (R3): first-swipe rate,
first-Season completion, which card ended run #1, whether they met
Stirling's tutor, later-day return, share-card sends. §7's scoreboard
fills itself from the nightly pull once traffic arrives.

## 5 · The queer-formats grill (R14 — a design-values session, not a backlog item)

Prep for the session, when you want it:

- **What ADR-0003 pinned:** hetero launch format; gender is mechanical
  (couple pool, Casa split, alternating chooser). Explicitly a deferral,
  not a position.
- **The mechanical surface** (small): `cast.ts couplePool /
  sameGenderPool`, the gendered chooser in `producers.ts` act breaks, the
  Casa split framing. A preference-driven pool + chooser rule is a
  medium-sized plugin change; v3 added nothing that widens it (shapes and
  the Bestie are orientation-agnostic by construction).
- **The content surface** (the real cost): dialogue assumptions in ~30
  cards ("the boys choose"), Casa framing, Cast composition math, and the
  recap's chooser reads.
- **Questions the grill must answer:** one fluid format or selectable
  formats? Does the Bestie stay same-gender when the couple pool isn't?
  What does the alternating-chooser rule become — and does its risk rhythm
  (the thing ADR-0003 exists to protect) survive the change?
- **Market note from the sweep:** the single most-asked-for feature in the
  genre's own audience discourse; Netflix's Secrets leads with it.
