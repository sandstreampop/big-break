# NORTH STAR — The Odyssey, alive

Output of a `grilling` interview (2026-07-11) on breathing life, whimsy,
personality, and exceptional micro-interactions into The Odyssey. This is the
**creative vision**; its executable counterpart is
[`NORTH-STAR-PLAN.md`](./NORTH-STAR-PLAN.md). Like `grill.md`, this is a design
record with authority: when implementation is in doubt, this file wins; when
this file is wrong, it gets amended first.

**Relationship to existing law.** `VOICE.md` is untouched and still governs
every string. `STYLE.md` stands — *except* law 8's motion clause ("Motion is
ember-slow; **nothing pulses**"), which this document deliberately renegotiates
(see The Motion Law below; STYLE.md carries a pointer). The taste gates
(`taste.mjs`, verdict loop) still bind all new content. The staff review's
"prove repeated Tellings are fun" gate is answered by this vision's sequencing
stance, not ignored (see Sequencing, bottom).

---

## The game we are trying to make

You are sitting at a fire at night, listening to the best storyteller alive
perform the greatest story ever told — and he is performing it *at you*,
tonight's version, with your name on the choices. The screen is not a phone
app displaying a card game. It is three things and nothing else: **the fire,
the crowd, and the tale.**

Almost nothing on this screen makes a sound. Almost everything on this screen
is still. That is not poverty — it is the instrument. When nothing pulses, the
one thing that moves owns your whole eye; when nothing plays, the one note
that sounds lands like weather. The Odyssey's aliveness is not added on top of
its austerity. It is *purchased with it*.

**In one line: the vase comes alive, the fire remembers, and the sea is
silent.**

What "authored, not generated" means here: every moving thing is a thing in
the story; every sound has exactly one meaning and is never reused; the
audience are four named people with running gags keyed to *your* history; the
gods behave differently from the geography on purpose. Nothing is ambient
decoration. Everything is a decision.

---

## The three renegotiated laws

### 1. The Motion Law — the world moves; the chrome never does

Supersedes STYLE.md law 8's "nothing pulses." Two clauses:

- **Diegetic motion only.** A thing may move on screen if and only if it
  exists in the story: the sea, the fire, the ship, the rowers, the crowd, the
  gods' totems, the ember of the telling. Boxes, rules, type, buttons, panels
  — the chrome — never animate (the one standing exception is law 9's
  reveal-in-speaking-order, which is the bard's breath, not the UI's). Default
  tempo remains ember-slow: 2–3 frame vase-animation cadence, `steps()` not
  easing, nothing smooth. Stillness stays the ground so that every movement
  reads as an event.
- **Earned ceremony.** Screen-scale motion — the whole screen transforming —
  is rationed to a fixed list (below). Ceremony that isn't scarce is
  wallpaper.

### 2. The Sound Law — silence is the identity

The Odyssey is the quiet game, and the audio law mirrors the voice law: the
frame crackles, the deep does not.

- **A sacred-few lexicon.** On the order of a dozen authored sound-events in
  the entire game. One meaning, one sound, never reused. Draft canon (final
  list frozen in implementation, each entry named like a character):
  - *the wave* — Poseidon moves against you
  - *the owl-note* — Athena moves for you
  - *the fragment-chime* — a piece of Tiresias' prophecy is banked
  - *the gutter* — the ember dies with the run (Despair / the sea takes you)
  - *dawn birds* — Ithaca sighted
  - *the bow-string* — plucked once at the finale; in Homer, Odysseus strings
    the great bow like a bard stringing a lyre, and the string "sings like a
    swallow." The game's one musical note, at its climax.
  - *the stroke* — the faint oar-thunk of a committed choice (the only
    frequent one; more feel than sound)
  - a handful more, earned one at a time — never a generic "ui" blip.
- **The fire alone may whisper.** One continuous ambience exists in the whole
  game: a barely-audible hearth crackle at frame beats (title, bard beats, act
  intros, endings told at the fire). The tale is silent; the deep places are
  *dead* silent.
- **Haptics are the percussion.** On phones the silent game has a pulse you
  feel instead of hear: the oar-stroke tick on commit, a heavy slow pulse when
  a god moves, a long low buzz as the deep approaches, the crowd's stir at a
  cliffhanger. Sound stays rare; feel is continuous. (Existing settings
  toggles govern all of it.)
- **No voice-blips.** The bard's speech makes no sound. Rejected explicitly:
  it would erode the identity for a borrowed charm.

### 3. The Memory Law — the fire remembers

Cross-run memory is a *personality engine*, not just prophecy bookkeeping.
The prophecy already proves the pattern (knowledge accumulates across
tellings); the north star extends it to the crowd: the hecklers remember your
previous runs and say so. Whimsy compounds the way the meta-arc does — the
hundredth fire is warmer than the first because the people around it know you.

---

## The systems of the vision

### The threshold — kindling the fire

The title screen is the fireside *before* the telling: near-dark, a cold
hearth, seated silhouettes waiting, stars over the sea. The player's first
touch **kindles the fire** — the screen warms, the crowd stirs, the
hearth-whisper fades in, and the menu appears as the bard's opening patter
("Sit. Tonight: the long way home."). *Resume* means the fire is still burning
from last time. Ritual, not friction: the kindling takes about a second, and
the same tap skips it. The game's one continuous ambience begins with an act
the player performs.

### The living hearth

Frame beats (bard beats, act intros, endings, the threshold) become a
**scene**, not a text box: a breathing chunky-pixel fire, and the canon
heckler ensemble as visible, persistent black-figure silhouettes — the woman
by the woodpile with her spindle, the potter's boy, the man who wants the
horse, an empty place where Phemios of Smyrna pointedly isn't. Figures shift
when they speak; the crowd leans in at cliffhangers.

The crowd is **reactive and long-memoried**: heckles key to tonight's choices
(the potter's boy pipes up when your telling hands him a deadpan) and to
*previous tellings* ("Last night the Cyclops had one eye. Tonight also one
eye. Progress."). The mechanical Audience meter (grill.md Q3's deferred hook)
remains in the north star but stays sequenced behind the playtest gate — the
crowd is a *presence* first, a system second.

### The living frieze + the totems

During the voyage, a horizontal **vase-band** runs across the screen — the
figured rim of an amphora — where black-figure pixel silhouettes *enact* the
tale. It is not decoration; it is a **readout of state**:

- Your **Expedition are the rowers.** Lose crew, and a rower is gone from the
  bench — the dwindling is visible, cumulative, and personal.
- **Poseidon's wrath is the sea** — flat meander-waves at peace, rising rough
  and oxblood-dark as his anger climbs.
- **Athena is the owl** — present above the mast when she is with you, absent
  when she is not.
- **Renown trails the ship** — deeds of legend accrete as small figures at the
  stern, your story literally following you.
- **Despair is the ember** — the soul-cursor dims as despair rises.
- The **ship advances one notch per choice** — ~28 strokes cross the band from
  Troy to Ithaca. The frieze is the run's progress bar without ever being a
  progress bar.

**Totems** punctuate over the band: the trident rises when Poseidon moves, the
owl crosses when Athena does — minor ceremony, one totem + one lexicon sound.

### The world is the HUD

The frieze + hearth + ember **replace** the numeric chip rail as the primary
state display. Numeric truth never lies more than one tap away: tap the frieze
and a hard-ruled panel states the numbers plainly, at a size where the pixel
face is actually legible (this retires the standing digit-legibility wart by
demoting digits to inspection size). Deltas land as changes *in the world*
first — a rower gone, the sea up a step — numbers second. Choice gates (the
three-door grammar) keep their explicit requirements; the inspect panel is
where thresholds are checked.

### The stroke, and the words that take

The core gesture — performed ~28 times a run, the game's heartbeat — becomes
the Odyssey's own:

- **The oar-stroke.** Drag carries water-resistance; release is one stroke —
  the haptic tick lands, the card *sweeps* in the stroke's direction (not a
  playing-card fly-off), and the ship on the frieze advances its notch. Every
  choice literally rows the voyage forward.
- **The words take.** On release, the chosen line brightens to gold and the
  unchosen fades to ash before the next beat — the bard committing tonight's
  telling to memory.

### Ceremony, rationed — and the hush

Full screen-scale ceremony belongs to exactly these moments, each distinct
in kind:

- **The three landmarks** — the Cyclops fills the band; the Underworld drains
  the screen to ash; the Suitors' Hall closes its doors behind you.
- **Every ending** — including death: the ember gutters out, the screen goes
  to the cold hearth. The finale gets the bow-string.
- **The prophecy fragment** — the one gold-fret moment of the Underworld.

The gods stay *minor* (totem + sound) — several times a run must not compete
with once a run.

A narrow further exception (2026-07-13 — see
[`adr/0002-progress-registers.md`](./adr/0002-progress-registers.md)), scoped
to cross-run persistent progress only, adds two more surfaces to this fixed
list:

- **The fragment banked** — the mid-run result overlay where a prophecy
  turning lands must register as a distinct, loud, non-prose beat in the
  Odyssey's own idiom (fired clay / gold-fret / the amphora shelf), not a
  sentence of result prose.
- **The run-end progress ledger** — the surface, at the exact moment the
  replay decision is made, showing the ladder's honest floor (`2 of 3 · one
  turning remains`).

Loud ≠ off-genre, and this license never reaches the siblings' confetti path
(`spawnConfetti`, `sfx.win()`, `mood: 'triumph'`, `resultExtras.celebrate`/
`cash`) — see ADR-0002 for the fence and its executable guard.

**Temptations get the inverted grammar: the hush.** Lotus, Circe, Calypso are
not spectacle — the world *softens*: the sea calms regardless of Poseidon, the
frieze warms, the haptics stop, even the hearth-whisper thins. Seduction as
anti-ceremony. The most dangerous moments in the game are the gentlest ones —
and the player learns to fear comfort.

### The horizon law — geography looms, divinity strikes

Everything ceremonial is visible before it arrives: the Cyclops's island grows
on the frieze's right edge two–three cards early; the band drains toward ash
as the Underworld nears; gulls appear near Ithaca; the hush precedes the
temptation. Players learn to *read the horizon* — dread and hope become
skills, and veteran anticipation is the replay texture. The gods are the
deliberate exception: Athena and Poseidon strike unannounced. **Geography is
fate; divinity is surprise.** That asymmetry is authored personality.

### The four canon micro-moments

1. **The crowd holds its breath.** During landmark decisions the hearth
   figures freeze mid-gesture — the spindle stops — until you commit; on
   release the room moves at once. Tension as stillness, payoff as breath.
2. **Names in the sand.** Dead rowers are never a number: each loss, the bard
   names the man once ("Eurylochos's cousin, who owed him money"). The rower
   vanishes from the bench *and* a name is spoken. The amphora records them.
3. **The wine cup is the clock.** The bard's cup, visible at hearth beats,
   empties across the night — Act I full, Act III dregs — and he drinks at act
   breaks. On a Calypso cash-out he simply sets it down.
4. **The ember under tension.** During a drag the ember-cursor stretches and
   streams like a flame in wind, proportional to drag distance — never toward
   the "right" answer, purely mirroring the player's own hesitation — and
   snaps upright on release with the stroke.

### The moonshot — the amphora: your run, fired in clay

At the end of every telling, the run is rendered as **one continuous
black-figure vase-band**: your actual voyage — your scars, your dead rowers by
name, your temptation, your ending — composed from the same frieze vocabulary
and presented as a fired amphora you can save and share. The frieze grammar
pays twice: the living readout during the run *becomes the record of it*
after. Every player's vase is different. The trophy room becomes a **shelf of
vases**. The shareable artifact *is* the game's identity.

(The other summit ideas are preserved, not scoped away: the fully performed
telling — Audience meter, coins, a bard-career meta, Phemios finally heard —
and the playable Oar Road epilogue, the frieze emptying of water and rowers
card by card until a stranger calls the oar a winnowing fan. They rank behind
the amphora and are sequenced in the plan's later tiers.)

---

## What players should notice, anticipate, remember, talk about

- **Notice:** the screen never lies — every rower is real, the sea *is*
  Poseidon's mood, the fire *is* the game's warmth toward you.
- **Anticipate:** the horizon. The island growing. The band draining. The
  terrible gentleness of a calm sea. And on the second run: knowing.
- **Remember:** the ember guttering out the first time they die; the room
  holding its breath at the Cyclops's cave; the bow-string; a rower's name.
- **Talk about:** the amphora ("this is my run — look, that's where I lost
  six men to Scylla"), and the woman by the woodpile remembering last night's
  telling.

## What this is NOT — anti-goals

- **No confetti with a Greek accent.** No particles, screen shake, glow,
  bounce easing, or celebration juice from the siblings' vocabulary. The
  `mood: 'triumph'` confetti path is *not* the Odyssey's.
- **No ambient noise floor.** No wind loops, no gull loops, no score. Silence
  is not a missing feature.
- **No smooth motion.** Everything moves in vase-frames (`steps()`), the way
  figures on pottery would. Smoothness reads as another game.
- **No chrome animation.** If it isn't in the story, it doesn't move.
- **No advisory feedback.** The ember, crowd, and fire react to *what
  happens*, never signal *what to choose*.
- **No Undertale vocabulary.** The grammar homage stands; hearts, named
  mechanics, and assets remain forbidden (STYLE.md's line).
- **Reduced-motion is first-class.** Every motion system collapses to a still,
  legible state under the OS pref and the in-game toggle; haptics and sound
  have their existing toggles. Aliveness is never a tax on accessibility.

## Sequencing stance (the playtest bet)

Playtesting the current text-only v1 would measure the wrong game: the feel
fabric — frieze, hearth, stroke, silence, ceremony — is precisely what makes
repeated Tellings enjoyable. So the fabric is built *first*, and the standing
playtest (PLAYTEST-KIT.md) runs on the alive version. Only frame *mechanics*
(the Audience meter) and the amphora moonshot remain evidence-gated behind
that playtest. This is a bet, named as one: if the playtest says the voyage
itself is unfun, the fabric will not save it, and the design record reopens.

*Execution: see [`NORTH-STAR-PLAN.md`](./NORTH-STAR-PLAN.md).*
