# Moonshot: Make the Songs Real (Audible Career)

> **One-line thesis:** *Your career becomes an album you can actually listen to.*
> Every song BIG BREAK already tracks — title, quality, chart life — gets a
> **deterministic, client-side, synthesized sound** that is a fingerprint of the
> night you had. The song layer is already the spine everything else reads
> (charts, rival, minigames, discography, epilogue, share poster). Make it
> *audible* and the whole game coheres around one thing you can hear grow.

This doc is the build order for an autonomous overnight agent. Read it top to
bottom, then work the **Staged Plan** in order. Each stage is independently
shippable — if the night runs out, whatever stage you finished is a real win.

---

## 0.5 Spike results (2026-07-02) — read this first, the risk is already burned down

Two spikes ran before this doc was finalized. **Both de-risk the moonshot; use
their outputs, don't re-discover them.**

**Spike 1 — composition core (PROVEN, runnable):**
`docs/spikes/composer-core.mjs` is a pure-Node reference implementation of the
deterministic composition core. **`node docs/spikes/composer-core.mjs` prints
`9 passed, 0 failed`.** It proves, without Web Audio, that a song's *musical
content* can be derived deterministically from its fingerprint:
- Determinism (same fingerprint → byte-identical event list),
- In-scale topline, tempo within the genre's `bpmRange`,
- **Hook fidelity** — identical hook → identical topline *independent of tier/id*;
  a different hook → a different topline (the core emotional promise, validated),
- Monotonic growth — layers & density rise `demo ≤ charting ≤ crowned`,
- Instrument → distinct timbre tag, and graceful fallback when genre/hook/instrument are missing.

**Lift this file's `xmur3` + `mulberry32` + `composeSong` shape directly into
`js/composer.js`.** It uses the engine's *verbatim* `mulberry32`, so it's already
compatible. What remains for Stage A is the **browser-only** half: feeding this
event list into `OfflineAudioContext` to produce an `AudioBuffer`. The hard,
uncertain algorithmic part is done.

**Spike 2 — codebase audit (facts, not guesses):** the §9 questions below are now
*answered*, and §5/§7/§8 have been rewritten with the exact keys, call sites, and
edits. Highlights: the Idea-Grab hook *is* available at song-write time but is
**not** persisted; cross-run song history does **not** exist yet; the SW has a
real precache list that must be edited.

---

## 0. Why this, and the shape of the ambition

BIG BREAK is already enormous in breadth (40+ systems). This moonshot is **not
more breadth** — it is *depth on the crown jewel* (the songs) that doubles as
*cohesion* (the songs are what every other system already reads). Deepen the
song and you deepen the charts, the rival war, the finale, the discography, the
soundtrack — for free, because they all point at the same catalog.

The player's arc becomes audible: **the game gets louder and more *yours* as the
career grows.** Act 1 is sparse and dry; a late-career run scores itself with
your own certified hits.

---

## 1. HARD CONSTRAINTS (the sacred cows — do not break these)

These are non-negotiable. A change that violates any of them is wrong even if it
"works."

1. **Balance is frozen.** No edits to `js/config.js` roll/tier/LP/pity/encore
   knobs. `node tools/simulate.mjs 4000 narrative` must produce the *same feel*
   after your work as before. **Audio reads outcomes; it never changes them.**
2. **Engine stays DOM-free.** `js/engine.js` must remain importable by Node
   (`tools/simulate.mjs` depends on this). All audio lives UI-side. The engine
   may gain **pure data fields on the song object** (see §5) but **no** Web
   Audio, no DOM, no `window` references.
3. **Offline PWA intact.** No network dependencies, no CDN, **no shipped audio
   files.** Everything is synthesized at runtime via Web Audio. `sw.js` /
   `manifest.webmanifest` install must still work offline. Adding a new JS
   module is fine (register it in the SW precache list if one exists).
4. **Existing SFX + lo-fi soundtrack keep working**, and the new system
   **degrades gracefully** — muted play and weak devices get today's behavior,
   never a crash or jank. Silence is a first-class, fully-playable experience.
5. **Performance budget.** Rendering a song must **never** jank the swipe loop.
   Render off the interaction path and **cache the resulting `AudioBuffer`**.
   Target: a signature motif renders in well under one animation frame's worth
   of perceived stall on a mid-range phone (render async / on a gesture, not
   during a swipe).

Additional fences (do not touch unless a stage explicitly requires it):
- Don't restyle the existing Songbook chrome beyond adding play controls.
- Don't touch the save/backup-code format in a way that breaks existing codes
  (migration-forward only — old saves must still load; see §5).
- Don't touch the share-poster image pipeline (audio export is an explicit
  STRETCH only, §4 Stage C).

---

## 2. What already exists (your foundation — reuse it)

`js/audio.js` (248 lines) is **most of the composer skeleton already**:
- `midi(n)` → frequency helper.
- Chord voicings (`CH`), `padChord()`, `bassNote()`, `hat()`, seeded-ahead
  scheduler with 0.4s lookahead (`music._schedule`).
- **`music.stress` (0..1) already drags tempo and closes the filter** — this is
  the burnout coupling you'll reuse for the "written while burnt out" fingerprint.
- Per-act + per-path moods (`MOODS`) — this is what Stage C's soundtrack
  replacement plugs into.
- `sfx.*` result stingers and `ambient()` scene textures — leave these alone;
  the song composer is a **separate module**, not a rewrite of this file.

`js/data/genres.js` — each genre already has `id`, `name`, `icon`, tag `bonuses`,
and `titleWords`. **You will add a `sound` recipe field here** (§6). 9 genres
today (6 base + 3 wave-2).

**Song object** (`js/engine.js`, `addSong`, ~line 198):
```js
{ id, title, quality, hype, status, origin, act, pos, prevPos, peak, weeks, crowned }
```
Note what's **missing**: no `genre`, no `instrument`, no `hook`, no `verdict`.
Genre + instrument live on the run `state`. Closing this gap is §5.

Other relevant files: `js/ui.js` (2197 lines — Songbook lives here, tap 📈),
`js/discography.js` (per-song career writeup — reads `state.songs`),
`js/save.js` (career persistence + backup codes), `js/minigames.js` (Idea Grab
hook capture + verdicts), `tools/simulate.mjs` (Node harness pattern to copy for
the audio analysis harness).

---

## 3. Architecture: the composer core

Build a **new module** `js/composer.js` (UI-side, may use Web Audio). Shape:

```
songToSeed(song, run)  ──► a stable integer/string seed  (PURE, deterministic)
seed ──► mulberry32/xmur3 PRNG                            (local, seeded RNG)
recipe = SOUND_RECIPES[song.genre] (+ instrument timbre + fingerprint mods)
render(recipe, prng, quality, fingerprint) ──► AudioBuffer  (offline render)
cache[seed] = AudioBuffer                                 (memoized)
player.play(song) ──► plays cached buffer through a shared gain/mute bus
```

**Determinism is the whole game — but be precise about two layers of it** (Spike 1
settled this):
- **Composition determinism (guaranteed, cross-device, forever):** the *event
  list* — notes, bpm, layers, density — is a pure function of the fingerprint via
  a seeded PRNG. This is what makes persistence in §5 nearly free: **you store a
  seed/fingerprint, not audio.** Spike 1 proves this.
- **Render determinism (browser-dependent — do NOT over-promise):** the PCM that
  `OfflineAudioContext` produces from that event list is deterministic *enough to
  cache within a session/device*, but is **not** guaranteed byte-identical across
  browser engines (float rounding in the audio graph). So: memoize the buffer by
  seed at runtime; **never** persist or hash rendered PCM as a cross-device
  identity. Determinism tests hash the **composition**, not the audio (see §7 A).

Rules:
- **No `Math.random()` in the render path.** Use a seeded PRNG (e.g. `mulberry32`
  seeded from `xmur3(seedString)`). Note: `audio.js`'s `ensureNoise()` uses
  `Math.random()` for hi-hat noise — that's fine for the live *soundtrack*, but
  the **song composer's noise/percussion must be seeded** so renders reproduce.
- Prefer **`OfflineAudioContext`** to render a song to an `AudioBuffer` up front
  (deterministic, cacheable, analyzable in Node-ish harness), then play the
  buffer via a `BufferSource`. Real-time scheduling (like the current
  soundtrack) is acceptable for Stage C soundtrack use, but the *catalog player*
  should play rendered buffers.
- The seed must derive **only** from stable song facts (id + genre + instrument +
  hook + quality tier + verdict + origin), never from wall-clock or live RNG
  state. `Date.now()`/`Math.random()` are forbidden in seed derivation.

---

## 4. STAGED PLAN (build in this order — each stage ships on its own)

### Stage A — Signature motif (the "not broken, and it's *mine*" win) ⭐ MUST-SHIP
An 8–16 second deterministic hook per song: melody + chord bed + drum feel,
seeded by **genre + instrument + the Idea-Grab hook**.
- **Genre** picks the recipe (scale, tempo, drum pattern, timbres — §6).
- **Instrument** sets the lead/topline timbre (kazoo *sounds like* kazoo; Loop
  Station = looped texture).
- **Hook → topline melody** — *the non-negotiable emotional core.* The melody is
  deterministically derived from the hook the player grabbed at 3 a.m. **The
  thing you caught in the minigame is the thing you hear.** (Derive a note
  sequence from the hook string/id via the seeded PRNG constrained to the
  genre's scale.)
- Two songs never sound identical; genre caricature is audible (Yacht Metal is
  absurd; Doom Jazz is a dirge).
- **Definition of done:** every song in a run can be played back as a distinct
  motif; determinism tests pass (§7 A); the audition lab (§7 C) renders the
  genre × instrument grid.

### Stage B — Full arrangement that grows with the career
Extend the motif into a 30–90s arrangement with structure (intro/verse/chorus)
whose **density and polish rise with quality/hype/verdict**.
- **Quality tier** → arrangement density + mix polish. A `demo` is thin and dry;
  a certified `crowned` HIT is full, layered, loud, "mixed."
- **Minigame verdict** (BOTCHED→GOLDEN) → timing tightness; a flub can be left in
  on a botch, GOLDEN is locked-in.
- Songs are **re-renderable as they level up** (demo → charting → crowned):
  same seed + higher tier = a bigger version of the same song. This is the
  audible growth arc.
- **Definition of done:** playing a demo then its crowned version is recognizably
  the *same song, bigger*; RMS/density rises monotonically with tier (§7 A).

### Stage C — Listenable catalog + your songs as the soundtrack
- **Songbook (📈) becomes a real player:** play/pause, a queue, scrub through your
  discography like an album.
- **Music scores the peaks:** the act-break chart reveal plays your newest/best
  track; the finale plays your **Final Set closer**.
- **Per-act soundtrack replacement:** as the catalog fills, the generic lo-fi
  `MOODS` soundtrack is gradually replaced by *your own songs*. Early acts stay
  sparse; late-career runs score themselves. Fall back to `MOODS` when the
  catalog is thin or muted.
- **Persistent discography playback (§5):** every song you *ever* wrote is
  re-renderable from its seed — browse past careers, hit play, hear the kazoo
  demo from that disastrous run three weeks ago.
- **Definition of done:** the Songbook plays the full catalog; act-break/finale
  moments are scored by real songs; the per-act soundtrack blends to your
  catalog and degrades cleanly to `MOODS`.

### STRETCH (only if A+B+C land with time to spare)
- Favorite/pin tracks → a lifetime "greatest hits."
- Exportable/playable audio snippet on the share poster / Daily Grind.
  ⚠️ Browser support for audio export (WAV encode + share sheet) is spiky — mark
  clearly optional, never block A–C on it, don't touch the existing PNG pipeline.

---

## 5. Persistence spec (close the fingerprint gap)

The song object lacks the fields the fingerprint needs. **The audit is done —
here are the facts (Spike 2):**

- **Two localStorage keys** (`js/save.js`): `bigbreak_meta_v1` (LP, unlocks,
  trophies, settings, `runHistory`) and `bigbreak_run_v1` (the live run, saved
  every swipe, cleared on end). Backup codes = `BB1.` + base64 of `{meta, run}`,
  so any field you add to meta/run rides along automatically (keep additions
  small — the code is user-copied text).
- **`meta.runHistory`** (`js/ui.js:1650`, capped at 10) is the "last 10 careers."
  Each record = `{date, instrument, path, result, endingKey, fame, daily}` —
  **no songs.** This is the exact gap Stage C's persistent catalog must fill.
- **The Idea-Grab hook IS available at write time but is NOT stored.** In
  `js/minigames.js:336` the game resolves `{ hooks: kept }`; in `js/engine.js`
  (`effects.writeSong`, ~line 857–872) `const grabbedHooks = mg?.hooks || []` and
  `mg?.label` (BOTCHED/SCRAPPY/SOLID/GOLDEN) are both in scope — used to pick the
  title and tilt quality, then **discarded.** Capturing them onto the song is a
  one-line change at that call site.
- **Five `addSong` call sites** (`engine.js` lines 152, 777, 806, 871, 1072).
  Only 871 (`writeSong`) has a real hook+verdict; the others are demos/releases.
  So new song fields **must be optional with defaults.**

Then:

1. **Stamp the fingerprint onto the song at creation** (pure data, DOM-free):
   add `genre`, `instrument`, `hook`, `verdict` to the object in `addSong`
   (~engine.js:200). Default `genre`/`instrument` from `state.genre` /
   `state.instrument`; `hook`/`verdict` default `null`. Pass `hook`/`verdict`
   through from the `writeSong` site (871) where `grabbedHooks`/`mg.label` live.
2. **Seed:** don't store a seed field — derive it lazily in `composer.js` from the
   stamped fields (Spike 1's `xmur3([id, genre, instrument, hook, status])`). One
   less thing to persist/migrate.
3. **Migration-forward:** old saves + the `ensureSongs` legacy migration
   (engine.js:167) must still load. Missing fingerprint fields → fall back to
   run-level genre/instrument or the neutral `DEFAULT_RECIPE` — **never crash,
   never block playback.** (Spike 1's test 7 proves the fallback path composes.)
4. **Cross-run catalog (Stage C target):** `runHistory` records currently drop
   songs. Add a compact `songs` array (title + the few fingerprint enums, per
   record) so past careers are re-renderable. Because composition is
   deterministic, **you store metadata, not audio** — a handful of strings per song.

Keep the `chartTitles` legacy list in sync as `addSong` already does.

---

## 6. Genre sound recipes (data-driven, on `js/data/genres.js`)

Add a `sound` field to each genre. Shared engine in `composer.js` **consumes**
the recipe; adding a genre stays **data, not code** (matches how the whole
content layer works). Suggested schema (tune freely):

```js
sound: {
  scale: 'minorPentatonic',        // named scale the engine knows
  root: 'A',                       // tonal center (or let seed pick within a set)
  bpmRange: [60, 76],              // seed picks within range
  drum: 'dirge',                   // named pattern: 'four', 'trap', 'brush', 'blast', 'none'...
  lead: 'sax',                     // signature timbre (overridden by instrument for the topline)
  bed: 'detunedUpright',           // chord-bed voice
  parody: 0.8,                     // 0..1 how hard to commit to the joke
  tropes: ['keyChangeFinale', 'chuggingRiff'],  // optional arrangement gags
}
```

Recipes may range from a light parameter nudge to full parody. Commit to the
bit: **Yacht Metal** = chugging power chords under smooth-jazz sax; **Doom Jazz**
= dirge-slow brushed drums + detuned upright bass; **Hyperpop** = pitched-up
saccharine + distortion; **Gothgrass** = a banjo that knows why, etc. Author all
9 genres' recipes; a missing recipe falls back to a neutral default so the game
never breaks.

**The satire is the point.** A texture-only engine would leave the best joke on
the table.

---

## 7. Validation — how a *deaf* agent proves the music is good

You cannot hear your output. Correctness must be **checkable without ears.**
Priority order: **A → C → B.**

### A. Deterministic self-tests + musical invariants ⭐ MUST-LAND (the safety net)
**Spike 1 already wrote and passed 8 of these** in `docs/spikes/composer-core.mjs`
(`9 passed, 0 failed`). Promote them to the real test as `js/composer.js` lands.
Assert (hash the **composition/event list**, *not* rendered PCM — see §3):
- **Determinism:** same fingerprint → byte-identical event list. ✅ proven
- **In-scale:** topline notes belong to the genre scale. ✅ proven
- **Tempo in range:** chosen BPM sits within the recipe's `bpmRange`. ✅ proven
- **Hook fidelity:** same hook → same topline (independent of tier/id); different
  hook → different topline. ✅ proven
- **Monotonic growth:** layers & density rise `demo ≤ charting ≤ crowned`. ✅ proven
- **Instrument → distinct timbre.** ✅ proven
- **Fallback robustness:** missing genre/hook/instrument still composes. ✅ proven
- **Non-silent (NEW, browser-side):** once real rendering exists, assert every
  rendered `AudioBuffer` has RMS above a floor (no accidental silence). This is
  the one invariant Spike 1 couldn't cover in Node.
- **No `Math.random`/`Date.now` in the render/seed path** (grep-level guard).

This proves *not broken* and *not drifting* — the thing most likely to waste the
night — and most of it is already green.

### C. Human audition lab (highest human value) ⭐ BUILD THIS
A **dev-only page** (e.g. `lab/audio-lab.html` or a `?lab=audio` mode) with a
grid of **genre × quality × instrument**, each with a play button, a seed input,
and the fingerprint shown. So the owner can audition the whole space in five
minutes the next morning and tune recipes. **This turns the morning into a
tasting menu instead of a debugging session.** Don't ship it in the PWA nav; keep
it dev-only.

### B. Offline-render analysis harness (STRETCH)
A Node script (like `simulate.mjs`) that renders songs to buffers and runs signal
analysis — spectral/FFT sanity, loudness per tier, silence detection — for
numeric evidence the audio matches intent. Higher build cost; do it only if A+C
land with time.

---

## 8. File-by-file work plan (suggested)

| File | Change |
|---|---|
| `js/composer.js` **(new)** | Composer core — **start by lifting `docs/spikes/composer-core.mjs`** (`xmur3` + `mulberry32` + `SOUND_RECIPES` + `hookToMelody` + `arrange` + `composeSong`), then add the browser-only `OfflineAudioContext` render → cached `AudioBuffer` + a player on a shared mute bus. |
| `js/data/genres.js` | Add a `sound` recipe to all 9 genres (§6). Spike 1 has 5 example recipes to extend. |
| `js/engine.js` | Stamp `genre`/`instrument`/`hook`/`verdict` on songs in `addSong` (~line 200), defaulted so the other 4 call sites don't break; pass `hook`/`verdict` through from the `writeSong` site (~871, where `grabbedHooks`/`mg.label` already exist). Pure data, DOM-free. |
| `js/audio.js` | Expose mute/enable state + a shared gain bus so composer respects the Sound/Music toggles; Stage C: let composer feed the soundtrack slot (the `MOODS` scheduler). **Don't rewrite existing SFX/soundtrack.** |
| `js/ui.js` | Songbook player at **`ui.js:948`** (add play controls to `.songbook-row`); entry is the `📈` button at `ui.js:428`. Wire act-break reveal + finale closer playback (Stage C). |
| `js/save.js` / `js/ui.js` (`runHistory` writer ~1650) | Add a compact `songs` array to each `runHistory` record for cross-run playback (§5.4); migration-forward — old records without it are fine. |
| `js/minigames.js` | Hook + verdict already surface as `{hooks}` / `mg.label` — no change needed unless a non-`writeSong` path should also carry a hook. |
| `sw.js` | Add `'js/composer.js'` to the `CORE` array and bump `CACHE` `'bigbreak-v19'` → `'bigbreak-v20'`, or offline installs won't fetch it. |
| `lab/audio-lab.html` **(new)** | Audition grid (§7 C). Dev-only — not in PWA nav or `sw.js` CORE. |
| `docs/spikes/composer-core.mjs` → real test | Promote the passing spike into the committed invariant test (§7 A); keep it `node`-runnable. |
| `README.md` | Add the audible-songs system to the systems list once it ships. |

---

## 9. Codebase questions — ANSWERED by the audit (Spike 2)

- **Does career history persist past-run songs?** No. `meta.runHistory`
  (`ui.js:1650`, last 10) stores `{date, instrument, path, result, endingKey,
  fame, daily}` only. Stage C must add a compact per-record `songs` array (§5).
- **Is the Idea-Grab hook stored?** No — but it's *available*. `minigames.js:336`
  resolves `{hooks: kept}`; `engine.js` ~857–872 reads `grabbedHooks`/`mg.label`
  to name the song, then discards them. Stamp them onto the song (§5.1).
- **Songbook entry point?** The `📈` button (`ui.js:428`) opens the songbook
  renderer at **`ui.js:948`** (`♪ YOUR SONGBOOK`), which maps `state.songs` to
  `.songbook-row` elements. Add play controls here for Stage C.
- **SW precache?** Yes — `sw.js` has `CACHE = 'bigbreak-v19'` and a `CORE` array
  listing every JS module. **Add `js/composer.js` to `CORE` and bump `CACHE` to
  `bigbreak-v20`** or offline installs won't fetch the new module.
- **Test convention?** No formal runner. Mirror `tools/simulate.mjs` — plain
  `node` ESM scripts that print pass/fail and `process.exit(1)` on failure.
  Spike 1 (`docs/spikes/composer-core.mjs`) already follows this shape; extend it.
- **PRNG to reuse?** `mulberry32` is **exported** from `engine.js:43` (DOM-free,
  already imported by `discography.js`). Add `xmur3` (string→seed) alongside it;
  Spike 1 has a working copy.

## 10. Definition of done (the morning deliverable)

1. **Stage A shipped and demonstrably deterministic** (tests green). At minimum,
   the game can play a distinct, genre-and-instrument-and-hook fingerprinted
   motif for every song. This alone is the wow.
2. **The audition lab exists** so the owner can hear the whole space and tune.
3. Stages B and C landed as far as the night allowed, each behind clean
   fallbacks (muted / thin-catalog / weak-device paths never break).
4. **All five hard constraints (§1) hold.** `simulate.mjs 4000 narrative` feel
   unchanged; engine still Node-importable; offline install still works;
   existing SFX/soundtrack intact.
5. A short note in the PR/commit describing what shipped, what's stubbed, and
   which recipes still need the owner's ear.

**North star:** the owner opens the Songbook tomorrow, hits play on a run from
last week, and *hears it.* Everything else serves that moment.
