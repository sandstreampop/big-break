# Seam audit — the review's "clever misuse" examples, judged from the code (Pass 4)

The review's P1 list of odyssey-inhabits-music-shapes examples, each decided
per the plan's rubric: *generic channel with a music-flavored name → rename;
generic with a generic name → document the mapping as legitimate; real misfit
→ ticket, don't rebuild.* (The other two examples on the list — the fake
numeric comparison and the finale note/getter — were fixed outright in
Passes 2 and 3.)

## Despair on the burnout channel — **legitimate, documented**

The engine owns exactly one universal fail (`js/engine.ts` `checkFailStates`:
`burnout >= CONFIG.burnoutFail`) and deliberately does not own its display
name: `manifest.statMeta.burnout` is a required entry every pack fills
(validated by `statmeta-missing`, which says "burnout included; rename it
there"). Music calls it *Burnout*, love-island *In Your Head*, the probe
*Strain*, odyssey *Despair*. Odysseus weeping on beaches is canon; a
universal exhaustion channel with a pack-owned name is the mechanism working
exactly as designed — the same class of seam as `actWord` ("ACT"/"WEEK").
**No change.**

## Fires on the loadout concept — **legitimate mechanism; one name renamed**

The run-start choice ("where you sing tonight") maps onto `loadouts`: id,
family, quirk copy, stat `modifiers`, plus a four-line pack plugin for
resource grants and deck leans. Nothing about `Loadout` is music's — the
concept ("the thing you start the run with that shapes it") is genre-neutral,
and the fires exercise it without contortion: no dummy fields, no fictional
values, no workaround shapes. **The mapping is sound; no change.**

What *was* music's: the presenter hook odyssey renders its prophecy boons
through was named **`gearChips`** — a generic channel (persona + carried
things as tappable HUD chips) wearing one genre's word. Renamed to
**`carriedChips`** (`js/types.ts`, `js/ui/hud.ts`, both implementing packs,
the lint harvest). Mechanical; behavior, markup, and goldens identical.

## Residue noted, deliberately not rebuilt now

- **`PerkDef.keepGearOnBad`** (`js/types.ts`) — music's gear-plugin
  vocabulary declared on the shared perk contract instead of merged in by the
  pack. Read through the generic `perkFlag` service, so the runtime is clean;
  the *type* placement is the same class of thing the review flagged.
  Ticketed in the Pass 11 backlog rather than churned here.
- **CSS class names** (`gear-chip` etc.) — presentation internals, not
  authoring surface; packs may emit any class. Not worth a cross-pack CSS
  rename.
- **`Presenter.itemById` / `equipItem` / `RunState.accessories`** — the
  equipment *mechanic's* generic seam (any genre can carry items; odyssey
  simply doesn't opt in). Generic name, generic channel. No change.

## The stance the review asked for (recorded again in Pass 9)

"Zero engine edits" flips from diagnostic to dogma the moment a bad public
seam gets routed around to preserve it. Passes 2 and 3 were deliberate engine
edits for exactly that reason; the bar is *does the change simplify the pack
contract for the fourth game*, not *did the engine stay frozen*.
