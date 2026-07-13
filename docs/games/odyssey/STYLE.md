# STYLE — how The Odyssey looks

Visual law for the Odyssey Pack, set in the grilling interview
([`grill.md`](./grill.md) Q17/Q18 + "Visual law"). The root complaint it
answers: music and love-island look "so damn alike" — the sameness is
*structural* (`css/style.css` hardcodes a cool blue-black nightclub; LI's
whole identity is a 265-line accent-swap overlay). The Odyssey is the pack
that breaks the mold, and the **tokenization pre-slice** is what makes that
possible without touching the siblings.

---

## The direction, in one line

**"Black-figure, bitmap."** Undertale's UI *grammar* fused with Greek vase
*vocabulary*. The screen is the campfire, not a phone app.

## The line we must not cross

We take Undertale's **grammar** — black field, hard-ruled boxes, bitmap
type, flat accents, narration cadence, a meaningful cursor — and **none of
its vocabulary**: no hearts, no FIGHT/ACT/ITEM/MERCY, no SAVE stars, no
character references, no copied assets, ever. Homage reads as taste; cloning
reads as theft.

---

## The laws

1. **Field:** lamp-black, faintly warm — the night around the fire. Never
   pure `#000`; never the siblings' cool blue-black.
2. **Boxes:** everything is a hard-ruled rectangle — **radius 0, no shadows,
   no gradients.** Plain rules for humble boxes; **meander-key friezes** for
   landmarks; a thin **gold fret** for the gods. That substitution — plain
   double-rule → meander — is the whole thesis: same grammar, different
   civilization.
3. **Type: full pixel commitment.** Bitmap fonts throughout, body text
   included — OFL-licensed, self-hosted, tiny. Display face: blocky lapidary
   caps. `big-text` mode is the accessibility escape hatch. *(Named watch-out:
   full-pixel body at 320px is the identity bet most likely to need
   renegotiating; fallback position is pixel display + clean body.)*
4. **Palette:** bone-white rules and text on black; **terracotta** panels
   and figures; **gold** as selection/emphasis (Undertale's yellow, aged);
   **wine-dark oxblood** only when the sea itself speaks. Flat fills only.
5. **The narrator line:** the bard speaks in asterisk-cadence boxes —
   `* The sheep came out of the cave unshepherded.`
6. **The ember:** the soul-cursor — a small pixel flame as cursor/selection
   marker, the fire of the telling following your finger. When a run dies,
   the ember gutters.
7. **Figures:** flat black-figure pixel silhouettes (ship, oar, owl, trident,
   one-eyed giant) as chunky SVGs, `image-rendering: pixelated`. No portraits
   in v1 — key art needs its own identity, not the LI pipeline's aesthetics.
8. **Authority = band, not neon — and the Motion Law.** No glow shadows, no
   gradient-clipped logo text (the siblings' two loudest tics, banned here).
   Motion (amended 2026-07-11, superseding "nothing pulses" — see
   [`adr/0001-motion-law.md`](./adr/0001-motion-law.md) and
   [`NORTH-STAR.md`](./NORTH-STAR.md)): **diegetic motion only** — a thing
   may move if and only if it exists in the story (the sea, the fire, the
   ship, the rowers, the crowd, the totems, the ember); the chrome — boxes,
   rules, type, buttons, panels — never animates (law 9's
   reveal-in-speaking-order is the one standing exception). Tempo stays
   ember-slow: vase-frame `steps()`, never easing, nothing smooth. And
   **earned ceremony**: screen-scale motion is rationed to the fixed list
   (the three landmarks, every ending, the prophecy fragment); the gods stay
   minor. Stillness stays the ground; the deep is still; the fire flickers,
   barely. A further, narrow exception (amended 2026-07-13 — see
   [`adr/0002-progress-registers.md`](./adr/0002-progress-registers.md)):
   cross-run persistent progress (the fragment banked, the run-end ladder)
   is licensed to register as a distinct, loud, non-prose beat in the
   pack's own idiom — never the siblings' confetti.
9. **Reading order is designed, not hoped for.** The eye enters a screen at
   the biggest, highest-contrast block — not at the top (Itti–Koch saliency;
   NN/g eyetracking: hierarchy overrides the F-pattern). So on any screen
   whose text only lands read in sequence (a heckle sets up the bard's
   reply; a setup line precedes a payoff), salience must not invert the
   sequence. Three rules, in order of force:
   - **Sequence by onset where order is load-bearing.** New-object onset
     captures attention involuntarily (Yantis & Jonides) — reveal the lines
     in speaking order, fireside-slow (opacity only, ~1.5s between onsets,
     nothing moves), and let a tap jump to the next line so the impatient
     read at their own speed; only a fully revealed panel dismisses on tap.
     Reduced motion (OS or in-game toggle) collapses to everything-at-once
     and leans on the next rule.
   - **Setup text is content, never chrome.** Text that must be read stays
     within one type-scale step of the body voice (≥0.9×) and in the
     secondary band, not the dim band (≥7:1 on the field here — `--dim` at
     ~5.5:1 is for true metadata only). Styling that says "caption/flavor"
     trains the reader to skip it (banner blindness generalizes).
   - **A speaker cue is `who:` above the line — never `— who`.** Every
     convention meaning "this person speaks what follows" (screenplay cue,
     play script, chat, VN name tag) is a plain name label; a dash-prefixed
     name is the epigraph convention and attributes the quote *above* it —
     exactly backwards.
   One boundary (INCIDENTS.md #6): the reveal is the SCRIPT's job — the
   stylesheet may hide a line only under the shell's `pending` mark, and the
   scriptless default is visible, so a mixed-deploy client gets the whole
   panel at once instead of a blank fire.
   Executable: the bard-beat check in `test/ui/smoke.mjs` pins all of it
   (size ratio, contrast floor, paced reveal in speaking order with the
   tap-jump, cue shape, the SKEW-LAW probe, and that the beat still
   advances to a live card).

**Cross-reference — the Sound Law** (set alongside the Motion Law,
2026-07-11; canonical text in [`NORTH-STAR.md`](./NORTH-STAR.md), recorded in
[`adr/0001-motion-law.md`](./adr/0001-motion-law.md)): silence is the
identity. A sacred-few lexicon of authored sound-events (one meaning, one
sound, never reused — enforced as a unit test, not a comment); the hearth
alone may whisper; haptics are the percussion; no voice-blips, no ambient
noise floor, no score. The frame crackles, the deep does not — the audio law
mirrors the voice law.

---

## Palette tokens (working values — tune by eyeball pass, then freeze)

| Token | Role | Working value |
|---|---|---|
| lamp-black | the field | `#161210` (warm, not blue) |
| bone | rules, body text | `#e8e0cd` |
| terracotta | panels, figures | `#c96f4a` |
| terracotta-deep | panel fills | `#7a3d28` |
| gold | selection, the gods, emphasis | `#d9a441` |
| oxblood | the sea speaking, danger | `#722f37` |
| ash | dimmed text | `#8f8577` |

Flat fills only. Any gradient, glow, or translucency is a lapse.

---

## Mechanism (how this ships without touching the siblings)

- **Prerequisite pre-slice: tokenize `css/style.css`** — every surface /
  border / shadow / radius / type value behind CSS custom properties, with
  music's current look **pixel-identical as the default values**. This is a
  genre-neutral mechanism change (allowed under the repo spine); it makes a
  pack skin a real theme instead of an accent swap. Guarded by
  smoke/crowding/mobile-matrix plus a computed-style diff (no visual
  regression harness exists — the pixel-identity check is ours to run) and an
  eyeball pass.
- **The theme is `css/odyssey.css`**, loaded after `style.css` on
  `odyssey.html` only — the LI overlay pattern, but overriding *tokens*
  (`--radius-*: 0`, `--shadow-*: none`, the palette, the fonts) instead of
  restating rules.
- **Fonts** are net-new infrastructure: OFL bitmap faces self-hosted under
  `assets/fonts/`, declared `@font-face` in `odyssey.css`, tiny subsets.
  No CDN, ever (Pages CSP + the repo's self-contained rule).
- **Layout never hangs off `:has()`** (mobile-matrix legacy pass); JS that
  inserts a piece toggles a real class. Stylesheet URLs are version-stamped
  by the build automatically.

## Phone law

320px is the floor and the contract (`test/ui/mobile-matrix.mjs`). The long
breath lives in narration boxes and results; prompts and labels stay
middle-length. If pixel body text and 320px cannot both hold, the fallback
position (law 3) triggers — renegotiate the bet in an ADR, don't quietly
shrink the type below legibility.
