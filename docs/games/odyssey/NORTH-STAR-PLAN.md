# NORTH-STAR PLAN — executing the alive Odyssey

> **Status (2026-07-11, end of the fabric build).** F0–F2 and I1–I8 are
> implemented, gated, and on `main` — the feel fabric is complete: the law
> amendment (ADR-0001), the six genre-neutral seams, the figure vocabulary,
> the stroke + words-take, the ember, the living frieze + world-is-HUD, the
> horizon, the hearth + kindling threshold, the sound lexicon + whisper +
> haptic grammar, ceremony + the hush, and the telling-ledger with the
> crowd's memory and names in the sand. Every named invariant in §2 landed
> as a test (frieze-never-lies, one-meaning-one-sound, sibling isolation,
> hush-is-not-a-trap, ceremony-advances incl. a forced wrath death,
> kindling-skippable, reduced-motion truth under BOTH prefs).
> **⛩ The playtest gate is now OPEN**: the standing playtest
> (PLAYTEST-KIT.md) must run on this alive build with a human at the fire —
> that verdict cannot be produced by the implementing agent. I9 (the
> amphora), I10 (the Audience meter), and I11 (the Oar Road epilogue)
> remain evidence-gated behind it, per the sequencing stance. Content
> batches (heckler callbacks, crew names, hush/ceremony copy) are
> lint-clean but await their human taste verdicts
> (`taste-feedback/`) — writer ≠ grader binds hardest on writing.

Implementation plan for [`NORTH-STAR.md`](./NORTH-STAR.md) (the creative
vision — read it first; every slice below traces to a named section of it).
Written for a fresh implementing model. Authority order when in doubt:
`NORTH-STAR.md` → `grill.md` → `STYLE.md`/`VOICE.md` → this plan. Repo law
(`/CLAUDE.md`, `docs/WORKING-AGREEMENT.md`) binds everything: small reversible
slices, each green on `main`, writer ≠ grader, verify behaviour on gated
surfaces first, invariants as tests.

**Read before writing code:** `NORTH-STAR.md` · `grill.md` · `STYLE.md` ·
`VOICE.md` + `GUIDING_EXAMPLES.md` + `taste.mjs` · `js/types.ts` (`Presenter`,
`Pack`, `RunState`) · `js/ui/card.ts` (the turn loop) · `js/ui/dom.ts` (overlay
law) · `js/audio.ts` · `js/packs/odyssey/*` ·
`docs/games/love-island/adr/0009` (screen tiers) ·
`docs/INCIDENTS.md` (#1 is the overlay law written in blood).

---

## 0 · Architectural stance

**Clean generic engine, specific implementation** (the repo's spine). The
fabric rides *existing* Presenter seams wherever one fits; a new seam is added
only where none exists, and every new seam is genre-neutral, feature-detected,
and invisible to packs that don't implement it. Music and Love Island must be
pixel- and behaviour-identical after every slice (goldens + UI suites are the
proof; a computed-style spot-diff on music is cheap insurance during the seam
slices).

| Vision system | Seam | Status |
|---|---|---|
| Hearth scenes (bard beats, act intros) | `Presenter.preCardBeat` (`js/types.ts:652`) + `recap` + `actIntro` | exists — render richer content into it |
| Ceremony (landmarks, endings, fragment) | `Presenter.setPiece` (`js/types.ts:767`) + endings pipeline | exists — needs a full-screen ceremony *kind* and new moods (below) |
| The hush (temptations) | `setPiece` mood vocabulary | **extend**: add `'hush'` alongside `'triumph'`/`'blow'` — content-free cue, shell plays it generically (softened world, haptics stop). Genre-neutral by construction |
| The frieze | none fits (`stage` at `js/types.ts:712` is portrait-shaped) | **new seam**: `Presenter.tableau?: (state, ev) => { html: string; cls?: string; inspect?: InfoBlock[] } \| null` — a persistent pack-rendered strip between HUD and card; shell owns placement, tap-to-inspect panel, and the crowding contract |
| World-is-HUD | `Presenter.compactHud` (`js/types.ts:825`) precedent | **new flag**: `Presenter.diegeticHud?: boolean` — suppresses the numeric rail when a `tableau` is present; shell keeps rendering the rail for all other packs |
| Sound lexicon + hearth whisper + haptic grammar | `js/audio.ts` is shared and hardcodes music's `MOODS` | **new seam**: `Presenter.soundscape?: { event(name: string): void; ambience?(scene: string): void; haptic?(name: string): number[] \| null }` — feature-detected in the shell's existing call sites (`sfx.*`, `ambient()`, `music.setMood()`); when present, the lo-fi engine stays off for that pack. All synthesis stays WebAudio, no asset files |
| The stroke / words-take | `js/ui/card.ts` drag + commit path (`attachDrag`, `finishSwipe`) | **extend generically**: a per-pack feel profile (drag resistance curve, commit animation class, arm haptic) read off the presenter or theme class — the sibling packs keep today's values as defaults |
| The ember cursor | STYLE.md law 6 — tokens exist (`css/odyssey.css:105`), no implementation | **new, pack-scoped**: odyssey theme + a small pack-side module; no shell change beyond a mount point |
| The threshold (kindling) | `Presenter.title` (`js/types.ts:525`) | **extend**: optional `titleScene` hook for a pack-rendered title stage behind the menu; menu structure and routing stay shell-owned |
| The amphora | `Presenter.shareImage` (`js/types.ts:615`) + `recordMeta` + trophies | exists — composition work is pack-side |
| Crowd memory (callbacks) | pack meta-save (prophecy precedent, `js/packs/odyssey/prophecy.ts`) | exists — extend the odyssey meta-save with a telling-ledger |

**Hard rules carried from incidents:** never open an overlay from an overlay on
`#overlay` (ceremony screens that appear over results must use the top layer or
be sequenced beats, per ADR-0009 "a sequence, not a stack"); every new
interactive control gets driven on every gated surface in `test/ui/smoke.mjs`
and the run must still reach a terminal state; layout never hangs off `:has()`.

**Golden safety:** this plan is presentation-first — no engine edits, no RNG
consumption changes, no card/effect changes. New *strings* (heckler callbacks,
rower names, bard patter) go through the taste gate and may re-baseline the
odyssey golden **deliberately** (`tools/gen-golden`-family) — never as a
side-effect. Sim behaviour (`simulate-pack odyssey --check` band) must not
move.

**Phone law:** the frieze + HUD together respect the crowding contract
(`test/ui/crowding.mjs`; ADR-0009's ≤~190px HUD+stage budget applies to the
tableau slot). 320px first; `test/ui/mobile-matrix.mjs` green every slice.
Continuous animation is `steps()`-based CSS, paused when the tab is hidden,
and collapses to a static (but still truthful) frieze under reduced motion.

---

## 1 · Foundations vs. interactions

**Foundational (F-track)** — mechanisms other slices stand on:

- **F0 — Law amendment.** Amend `STYLE.md` law 8 to the Motion Law (diegetic
  motion + earned ceremony, superseding "nothing pulses"), with a short ADR
  under `docs/games/odyssey/adr/0001-motion-law.md` recording the
  renegotiation and the anti-goals. Add the Sound Law and Memory Law as
  STYLE/VOICE cross-references. Docs-only.
- **F1 — The seams.** `tableau` + `diegeticHud` + `soundscape` + the `'hush'`
  mood + the feel profile + `titleScene`, all feature-detected, all
  genre-neutral, landed **empty** (no odyssey use yet). Proof: siblings
  pixel-identical; goldens untouched; a probe-pack invariant that a pack
  without the hooks behaves exactly as today (`test/invariants.test.mjs`).
- **F2 — The figure vocabulary.** The black-figure pixel sprite set as chunky
  inline SVGs (`image-rendering: pixelated`), authored as data under
  `js/packs/odyssey/art/`: ship hull, oar bench + rowers (drawn as removable
  units), sea strips (calm → oxblood-rough, meander-derived), island masses,
  the Cyclops, ash-Underworld band, the fire (3–4 frames), seated crowd
  figures (woman + spindle, boy, horse-man), owl, trident, cup, oar, gulls,
  stars. Two–three frames each, `steps()` timing. This is an *asset* slice —
  reviewable in a gallery page before anything moves.

**Interaction slices (I-track)** — each one small, green, and independently
shippable, in execution order:

| # | Slice | Vision section | Depends on |
|---|---|---|---|
| I1 | **The stroke + the words take** — water-resistance drag curve, oar-stroke commit (sweep, not fly-off), stroke haptic + faint stroke sound, chosen-line-gold / unchosen-ash on release | The stroke | F1 (feel profile, soundscape) |
| I2 | **The ember** — pixel-flame cursor/selection marker; *ember under tension* (stretches with drag, snaps on release); dims with Despair | Micro-moments · world-is-HUD | F2 |
| I3 | **The frieze v1** — static-but-truthful band: ship, rower count = Expedition, sea state = Poseidon, owl = Athena, stern figures = Renown, notch advance per stroke; tap → hard-ruled inspect panel with legible numbers; `diegeticHud` on | The living frieze · world-is-HUD | F1, F2, I1 |
| I4 | **The horizon** — looming keyed off `itinerary.ts` (landmark distance is known): island growth 2–3 cards out, ash-drain toward the Underworld, gulls near Ithaca | The horizon law | I3 |
| I5 | **The hearth v1 + the threshold** — fire sprite + seated figures behind bard beats/act intros; kindling title (touch lights the fire, ~1s, same-tap skip; Resume = already lit); *wine cup as the clock* | The living hearth · threshold · micro-moments | F1 (titleScene), F2 |
| I6 | **The sound of silence** — the lexicon v1 (wave, owl-note, fragment-chime, gutter, stroke), hearth whisper at frame beats only, haptic grammar (god-pulse, deep-buzz, crowd-stir); lo-fi engine off for odyssey | The sound law | F1 (soundscape) |
| I7 | **Ceremony** — full-screen landmark treatments (Cyclops fills the band; Underworld drains the screen; Suitors' doors), ending ceremonies (ember gutters on death; bow-string at the finale; dawn birds at Ithaca), the prophecy gold-fret moment; **the hush** on Lotus/Circe/Calypso; *the crowd holds its breath* during landmark decisions | Ceremony, rationed · micro-moments | I3–I6 |
| I8 | **The fire remembers** — telling-ledger in the odyssey meta-save (landmark outcomes, deaths, cash-outs, endings, run count); heckler callback pools keyed to it (taste-gated content, LI bark-engine precedent: seeded, no-repeat-until-exhausted, capped); *names in the sand* (rower-loss names spoken once, recorded) | The memory law · micro-moments | I5, taste gate |
| — | **⛩ PLAYTEST GATE** — run `PLAYTEST-KIT.md` on the alive build; verdicts recorded; design record amended if the voyage itself fails | Sequencing stance | I1–I8 |
| I9 | **The amphora** (moonshot; evidence-gated) — run-log → vase-band composer (reuses F2 vocabulary + I8's ledger), fired-clay presentation on the ending screen, `shareImage`, trophy room as the shelf of vases | The amphora | Playtest ✓ |
| I10 | **The audience as a system** (evidence-gated) — the deferred Audience meter: crowd engagement visible and mechanical; grill.md Q3's hook, designed against the playtest's findings | The living hearth | Playtest ✓ |
| I11 | **The playable Oar Road** (horizon tier, preserved not promised) — the epilogue act, frieze emptying of water and rowers | Moonshot footnote | I9/I10 era |

Rationale for the order: I1/I2 make the *heartbeat* right first (touched 28×
a run — highest feel-leverage per line of code); I3 unlocks the readout that
I4/I7 build on; the hearth (I5) lands before sound (I6) so the whisper has a
fire to belong to; ceremony (I7) needs every prior channel; memory (I8) is
content-heavy and benefits from the verdict loop running in parallel from I5
on. Fabric complete → playtest → moonshot.

## 2 · Per-slice contract (Definition of Done)

Every slice, per the working agreement:

1. `npm run build` → `node tools/validate-packs.mjs && node
   tools/lint-content.mjs && node tools/simulate.mjs --check && node --test &&
   node test/ui/smoke.mjs && node test/ui/crowding.mjs && node
   test/ui/mobile-matrix.mjs` — all green *and named* in the hand-off.
2. **New invariants land as tests, not comments.** This plan's named ones:
   - *The frieze never lies*: a smoke assertion diffs frieze-rendered counts
     (rowers, sea step, owl presence) against `RunState` after seeded
     mutations, on the live card **and** on result overlays.
   - *One meaning, one sound*: a unit test over the lexicon table — no event
     name maps to a reused synth recipe; no lexicon call site outside its
     meaning.
   - *Sibling isolation*: probe/music/LI behave identically with the new
     seams undefined (invariants suite) + goldens byte-identical.
   - *The hush is not a trap*: smoke drives a temptation card through the
     hush and asserts the run still reaches a terminal state (both accept
     and refuse arms).
   - *Ceremony advances*: every full-screen ceremony (all three landmarks,
     each ending kind, the fragment) is driven in smoke and the run reaches
     an ending — gated surfaces first (INCIDENT #1's law).
   - *Kindling is skippable*: smoke taps through the threshold twice (let it
     play / skip it) and reaches the deal.
   - *Reduced-motion truth*: with reduced motion forced, the frieze still
     renders correct static state and the run completes.
3. Fresh-context review (`verifier` agent or `/code-review`) between passes —
   adversarial review after **every** pass is odyssey law (grill.md Q16).
4. Hand-off in the three-line format (`verified ✓ / not verified ⚠ /
   watch-out`).

## 3 · Risks and watch-outs (named bets)

- **Identity dilution** — the fabric is many moving systems on a game whose
  identity is stillness. The Motion Law's anti-goals (no smoothness, no chrome
  motion, no advisory feedback) are the fence; the verifier should grade
  slices *against the anti-goals list*, not just for correctness.
- **320px arithmetic** — frieze + card + prompt is the crowding bet. The
  frieze must have a defined yield order under ADR-0009 pressure (it thins to
  a single-row strip before the prompt ever clips). If it can't hold at
  320px, that's an ADR-visible renegotiation, not a quiet shrink.
- **Battery/perf** — continuous `steps()` animation is cheap but not free;
  pause off-visibility, budget repaints (transform/opacity only), test on the
  device-pass checklist (`DEVICE-PASS.md` — still unrun on real hardware, and
  this plan raises the stakes on it).
- **The pixel-digit wart** — mitigated (inspect panel renders numbers large),
  not fixed; the key-art/font ticket stands.
- **Heckler memory tone** — cross-run callbacks can curdle into the game
  mocking the player. VOICE.md law holds: the bard (and his crowd) never mock
  the tale — and never the *teller*. Verdict-loop these lines like all
  odyssey content.
- **The playtest may say no** — the sequencing stance is a bet (NORTH-STAR.md
  names it). If repeated Tellings still don't land after I1–I8, stop; the
  moonshot does not proceed on a failed foundation.

## 4 · What this plan does NOT change

No engine (`js/engine.ts`) edits anticipated; if one becomes genuinely
necessary it follows the stop-and-discuss law. No balance, deck, gate, or RNG
changes. No changes to music or love-island behaviour or appearance. No new
asset pipeline (all sound stays synthesized; all figures are committed SVG).
No web fonts, no CDNs, no raw `<img>` (raster portraits remain out of scope —
the figure vocabulary is SVG, not the LI pipeline).
