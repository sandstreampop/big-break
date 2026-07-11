# The Motion Law: the world moves; the chrome never does

Status: accepted (2026-07-11). Renegotiates STYLE.md law 8's motion clause.
Source of authority: [`NORTH-STAR.md`](../NORTH-STAR.md) ("The three
renegotiated laws"), output of the 2026-07-11 grilling on breathing life into
The Odyssey.

## Context

STYLE.md law 8 said: *"Motion is ember-slow; **nothing pulses.** The deep is
still; the fire flickers, barely."* That clause was written to ban the
siblings' celebration juice — and it worked — but taken literally it also
bans the vision the north star names: a living frieze that IS the run's
readout, a breathing hearth, an ember cursor that stretches under drag. The
Odyssey's aliveness is *purchased with* its stillness ("when nothing pulses,
the one thing that moves owns your whole eye"), so the law needed a sharper
edge, not deletion.

## Decision

Law 8's motion clause is superseded by the **Motion Law**, two clauses:

1. **Diegetic motion only.** A thing may move on screen if and only if it
   exists in the story: the sea, the fire, the ship, the rowers, the crowd,
   the gods' totems, the ember of the telling. Boxes, rules, type, buttons,
   panels — the chrome — never animate. (The one standing exception is law
   9's reveal-in-speaking-order: the bard's breath, not the UI's.) Default
   tempo stays ember-slow: 2–3 frame vase-animation cadence, `steps()` not
   easing, nothing smooth. Stillness stays the ground so every movement
   reads as an event.
2. **Earned ceremony.** Screen-scale motion — the whole screen transforming
   — is rationed to a fixed list: the three landmarks (Cyclops, Underworld,
   Suitors' Hall), every ending (including the ember guttering on death),
   and the prophecy fragment. The gods stay *minor* (totem + one lexicon
   sound). Ceremony that isn't scarce is wallpaper.

## Anti-goals (carried whole from the north star — the fence)

- No confetti with a Greek accent: no particles, screen shake, glow, bounce
  easing, or celebration juice from the siblings' vocabulary. The
  `mood: 'triumph'` confetti path is not the Odyssey's.
- No smooth motion: everything moves in vase-frames (`steps()`), the way
  figures on pottery would.
- No chrome animation: if it isn't in the story, it doesn't move.
- No advisory feedback: the ember, crowd, and fire react to *what happens*,
  never signal *what to choose*.
- Reduced-motion is first-class: every motion system collapses to a still,
  legible state under the OS pref and the in-game toggle. Aliveness is
  never a tax on accessibility.
- Continuous animation is `steps()`-based CSS, paused when the tab is
  hidden, transform/opacity only (battery is a named risk in the plan).

## Sibling laws (recorded here, owned by the north star)

The same interview set two more laws the fabric slices implement:

- **The Sound Law** — silence is the identity: a sacred-few lexicon (~a
  dozen authored sound-events, one meaning one sound, never reused), the
  hearth alone may whisper, haptics are the percussion, no voice-blips, no
  ambient noise floor. Cross-referenced from STYLE.md; the lexicon lands as
  a unit-tested table ("one meaning, one sound").
- **The Memory Law** — the fire remembers: cross-run memory as a
  personality engine (the heckler ensemble recalls previous tellings), the
  prophecy's accumulate-across-tellings pattern extended to the crowd.
  Cross-referenced from VOICE.md law 8 (the canon heckler ensemble); all
  callback copy is bound by the taste gates, and the bard-and-crowd
  never-mock-the-teller rule applies.

## Consequences

- The verifier grades fabric slices *against the anti-goals list*, not just
  for correctness — identity dilution is the plan's first named risk.
- STYLE.md law 8 carries the amended clause + a pointer here; every other
  law of STYLE.md (field, boxes, type, palette, narrator line, ember,
  figures, reading order) stands unchanged.
- When the Motion Law and any older motion comment disagree, this ADR and
  NORTH-STAR.md win; when they are wrong, they get amended first.
