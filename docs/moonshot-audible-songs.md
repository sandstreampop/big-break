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

**Determinism is the whole game.** Same seed → **byte-identical** buffer, every
run, every device, forever (that's what makes persistence in §5 nearly free — you
store a seed, not audio). Rules:
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

The song object lacks the fields the fingerprint needs. **Audit first**
(`js/engine.js` `addSong`/`newRun`, `js/save.js`, `js/discography.js`,
`js/data/meta.js` career history) to see exactly what persists across runs, then:

1. **Stamp the fingerprint onto the song at creation** (pure data on the engine
   side — allowed, it's DOM-free):
   add `genre`, `instrument`, `hook` (the grabbed idea, if any), `verdict` (the
   writing minigame result, if any) to the object built in `addSong`. Default
   them from `state.genre` / `state.instrument` when the caller doesn't pass
   them, so existing call sites keep working.
2. **Derive a stable `seed`** (or compute it lazily in `composer.js` from the
   stamped fields — either is fine as long as it's stable).
3. **Migration-forward:** old saves and `ensureSongs` legacy migration must still
   load. Songs without fingerprint fields fall back to run-level genre/instrument
   or a neutral default recipe — **never crash, never block playback.**
4. **Cross-run catalog (Stage C target):** confirm whether career history already
   stores past songs. If not, persist the minimal per-song fingerprint (it's
   tiny — a seed + a few enums) so past careers are re-renderable. Because render
   is deterministic, **you store metadata, not audio.**

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
A test file (Node-runnable, mirror `tools/simulate.mjs` / the existing test
style). Assert:
- **Determinism:** same seed → byte-identical render (hash the buffer's samples).
- **Non-silent:** every rendered song has RMS above a floor (no accidental
  silence).
- **In-scale:** generated topline notes are members of the genre's scale.
- **Tempo in range:** chosen BPM sits within the recipe's `bpmRange`.
- **Monotonic growth (Stage B):** density/RMS rises with quality tier
  (demo < charting < crowned) for the same seed.
- **Hook fidelity:** the same hook → the same topline; different hooks differ.
- **No `Math.random`/`Date.now` in the render/seed path** (grep-level guard is
  fine).

This proves *not broken* and *not drifting* — the thing most likely to waste the
night.

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
| `js/composer.js` **(new)** | Composer core: seed, PRNG, recipe consumption, `OfflineAudioContext` render → cached `AudioBuffer`, player with shared mute bus. |
| `js/data/genres.js` | Add `sound` recipe to all 9 genres (§6). |
| `js/engine.js` | Stamp `genre`/`instrument`/`hook`/`verdict` on songs in `addSong` (pure data, DOM-free, defaulted so call sites don't break). |
| `js/audio.js` | Expose the mute/enable state + shared gain bus so composer respects Sound/Music toggles; Stage C: let composer feed the soundtrack slot. **Don't rewrite existing SFX/soundtrack.** |
| `js/ui.js` | Songbook → real player (Stage C); wire act-break reveal + finale closer playback. |
| `js/save.js` / `js/discography.js` | Persist per-song fingerprint/seed for cross-run playback (§5); migration-forward. |
| `js/minigames.js` | Confirm the Idea-Grab hook + verdict are surfaced to `addSong` (read-only audit; wire through if not). |
| `sw.js` | Add `composer.js` (and any new module) to the precache list so offline still works. |
| `lab/audio-lab.html` **(new)** | Audition grid (§7 C). Dev-only. |
| `tests/` or `tools/` | Determinism + invariant tests (§7 A); optional analysis harness (§7 B). |
| `README.md` | Add the audible-songs system to the systems list once it ships. |

---

## 9. Open questions to resolve from the codebase (don't ask a human)

- Does career history already persist past-run songs, or only summary stats?
  (Determines how much §5 cross-run storage to add.)
- Is the Idea-Grab hook stored anywhere on the run/song today, or only used to
  derive the title? (Determines whether the hook→melody mapping needs a new
  field.) Check `js/minigames.js` + `addSong` call sites.
- What's the exact Songbook entry point and render path in `js/ui.js` (tap 📈)?
- Is there an existing precache manifest in `sw.js` to register new modules in?
- What test runner/convention exists (if any) — mirror it; else make the tests
  plain `node` scripts like `tools/simulate.mjs`.

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
