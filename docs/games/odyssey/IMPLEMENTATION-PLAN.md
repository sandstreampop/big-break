# The Odyssey — implementation record (v1)

The slice plan from [`grill.md`](./grill.md) ("v1 slices"), as built. Each
slice landed green (full gate suite + the pack's own tests) with a
fresh-context adversarial review between passes, per the working agreement.

| # | Slice | State | The short of it |
|---|---|---|---|
| 1 | Design record + taste layer | ✅ | `CONTEXT.md` · `VOICE.md` · `taste.mjs` (cliché + tells blocklists, `maxBang 2`) · `GUIDING_EXAMPLES.md` (batch zero of the verdict loop) · `STYLE.md`. Genre-neutral `maxBang` knob added to `tools/taste-core.mjs`. |
| 2a | CSS tokenization pre-slice | ✅ | `css/style.css` fully tokenized (97 tokens), music pixel-identical by construction — proven by `tools/css-identity.mjs` (2742/2742 resolved declarations). |
| 2b | Green skeleton | ✅ | Real taxonomy (Might/Guile/Lore · Expedition/Athena/Poseidon/Renown · Despair · Nostos/Kleos · four Fires · both fail states), stub deck, golden pinned, band 35–50 declared and held, `css/odyssey.css` black-figure theme. |
| 3 | The three landmarks | ✅ | Cyclops (→ the name-brag → the Crossroads), Underworld (Tiresias, one question), Suitors' Hall (per-path finaleCards + the finalSet three doors). `odyssey_itinerary` beat plugin; first boons as knowledge flags; `test/odyssey-landmarks.test.mjs`; the presenterCopy lint rail. |
| 4 | The sea | ✅ | 54 authored cards across three act files, bespoke outcomes over one shared budget table (`events.ts`); fire deck-weights; outcome cap recalibrated 420→650 (doc + data in sync). |
| 5 | Temptations | ✅ | Lotus / Circe / Calypso as gated mid-act beats; banking is a forceTier'd choice → flag → declared fail-state rule → told ending + `failLabels`. Never a game-over screen. |
| 6 | The prophecy | ✅ | Fragments persist via `recordMeta`/`applySetup` (knowledge-only, union never count); the third question (`ody_tiresias_oar`) exists only for the bard carrying both others; the Oar Road renders as the nostos-success finale variant (all fragments + the oar carried + Poseidon ≤ 3); `test/odyssey-prophecy.test.mjs` bounds true victory <10% post-unlock. |
| — | Theme completion | ✅ | OFL bitmap faces self-hosted (`assets/fonts/`): Pixelify Sans body via `--font-body`, Press Start 2P display caps; logo sized for 320px; the music art system's generated scenes opted out (v1 ships no key art). |

## Standing debts (post-v1 backlog, grill order)

- **Human taste verdicts.** `GUIDING_EXAMPLES.md` is batch zero and the whole
  deck is machine-gated but **un-verdicted** — the LI-style loop
  (`taste-feedback/`) needs Viktor's pass before the voice is considered
  calibrated.
- Audience meter + bard interruptions (the deferred Q3 mechanic).
- Key art with its own identity (black-figure pixel silhouettes; never the LI
  pipeline look). The ember cursor (STYLE.md law 6) is part of this pass.
- Playable Oar Road epilogue (true victory is a finale variant in v1).
- "Spoils of Troy" trading, if its absence is felt.
- Daily/comeback modes tuning (the shell's Daily works; unreviewed for feel).
- The heckler ensemble has canon seeds but no in-game surface yet beyond the
  bard's asides — candidates: overlay notes, act recaps.

### Added by the 2026-07 staff-review action plan (Pass 11 — tickets, not builds)

- **P-B half 2 — landmark variants where entropy is worst** *(evidence-gated:
  built only if the playtest verdict sheet promotes it).* The measured gaps
  (`SIM-FINDINGS.md`): Circe, Calypso, and the Underworld's within-state
  reading are single-presentation (H = 0); the Cyclops shows its alternate
  face in 1 run of 6. New variants must be driven by state the player
  *caused* (their Fire, a prior sea event, fragments held), not a random
  roll — and each addition raises the floors in
  `test/odyssey-entropy.test.mjs` in the same commit.
- **P-C — the bard's-note (shelf-ready sketch, NOT built).** The cheapest
  instance of "failures that reveal useful knowledge": a run-ending mistake
  writes ONE bard's-note into the existing meta machinery
  (`meta.odyssey.notes: string[]`, union-not-count, exactly like
  `fragments`), and `applySetup` stamps it as a flag that changes ONE line
  next run — e.g. dying to the wrath after shouting the name unlocks the
  bard opening Act I with "This time, friends, I will try to keep his mouth
  shut." Knowledge, not power; reuses recordMeta/applySetup wholesale; no
  engine edit. Build the day the playtest says replay motivation collapses,
  and not before.
- **Lotus offer-rate tuning.** The "weak offer" fires in < 1% of runs
  (burnout ≥ 18 is almost never true by Act I slot 4 — `SIM-FINDINGS.md`).
  Either the threshold drops, the window widens, or the design accepts the
  meadow as near-mythical — a taste call to make WITH the playtest data,
  not from the sim alone.
- **Kleos as ratification.** Committed in ~20% of runs and 93.8% successful
  once committed — closer to an end-of-run check than a strategy. If the
  playtest confirms nobody *plans* toward Kleos, the lever is early-renown
  visibility (making the gate feel reachable at the crossroads), not gate
  numbers.

## Watch-outs carried from the grill, and where they landed

- *Full-pixel body at 320px* — shipped; mobile-matrix green; big-text mode is
  the escape hatch; fallback (pixel display + clean body) documented in
  `STYLE.md` if real phones disagree. Known wart: Pixelify Sans' bold capital
  C closes its aperture at small sizes ("Cut" can skim as "Out") — watch it
  in real play; the fallback position covers it. Ligatures are disabled
  page-wide (the subset's fi/fl glyphs render corrupt). **Second wart, found
  by the 2026-07 device pass and empirically misread by its own author: the
  digit '2' closes its loop at delta-chip size and reads as '8' ('-2 Might'
  read as '-8 Might'); '5' reads as 'S'
  (`device-pass/digit-glyphs.png`). Numbers are gameplay-critical — the
  candidate fix is the clean body face or tabular numerals for CHIP NUMERALS
  ONLY, a visual-identity call for the human (STYLE.md law owner), ticketed
  with the key-art pass.**
- *Epic breath on a phone card* — prompts stayed middle-length; the long
  breath lives in results (cap 650) and intros; crowding/matrix green.
- *Two paths* — replay variety rides builds/boons/fires; judge with
  `node tools/simulate-pack.mjs odyssey 3000 narrative` and real play.
- *Cash-out resentment* — every stop is a told ending with real closing copy
  and a "Banked at…" ribbon; watch player reaction.
- *Balance numbers and the subtitle wording are placeholders* until play and
  the verdict loop prove them.
