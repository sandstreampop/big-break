# Launch with zero minigames; make minigames a pack capability later

Love Island ships **no minigames** at launch. Every villa choice omits the
`minigame:` field, and the pack proves the engine is genre-neutral without leaning
on the one app-level system that is still music-shaped.

## Why

The minigame registry is **not** a genre-agnostic engine hook. `js/minigames.ts`
is an app-level module that hard-imports `songs.js` (`flagshipSong`, `ctx.run.songs`)
and holds 14 music-themed games; `js/ui.ts` resolves a choice's `minigame` string
against that single global registry. The engine core stays genre-free (the string
is just data on a choice), but the **registry and UI layer are music-coupled**.

The entire point of this Pack is to prove the core carries no music shape.
Minigames are precisely the part of the stack that is *still* music-shaped, so
shipping the second pack **without** them is the cleaner proof — it exercises the
genre-neutral path end-to-end without dragging in the one coupled subsystem.

We rejected two alternatives:

- **Refactor minigames into a capability first** — architecturally correct, but it
  is real shared-code surgery *before* Love Island can have a single game, and it
  is better validated by two packs that both actually want games.
- **Co-locate villa games in the shared `minigames.ts`** — feels cheap, but it
  permanently couples the two packs in one "shared" file and keeps the music
  `songs.js` import there forever.

## The follow-up

"Make minigames a pack capability" is its own later project: a pack provides its own
game registry + `ctx` shape, `ui.ts`/`minigames.ts` become genre-agnostic, and
music's games move behind the music pack. When it lands, the villa's **challenges**
(Heart Rate, Snog Marry Pie, Raunchy Races, the talent show) are the obvious
diegetic homes for villa minigames.
