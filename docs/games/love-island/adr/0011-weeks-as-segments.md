# The six-week season: weeks as manifest segments (v4 S2)

Session 2 of the v4 build ([`../V4-BUILD-CHARTER.md`](../V4-BUILD-CHARTER.md)),
on Session 1's engine machinery (ADR-0010). The charter's Option C: the villa
becomes **a longer season built from short "weeks"** — quiet daily beats that
end on a tentpole — without the engine learning a single villa word.

*(Numbering note: the charter penciled "ADR-0011" for Session 3's factional
public. Session 2's definition-of-done also requires an ADR, so this document
takes 0011 and Session 3's shift to 0012/0013 — proceed-and-document.)*

## Decision

**The season is SIX WEEKS, declared as manifest `segments` — data, not
engine.** The three show-phases (Arrival / The Turn / Final Week) remain the
macro shape; they live *across* the weeks:

| Week | Name | Phase | Len | Ends on |
|---|---|---|---|---|
| 1 | Arrival | Arrival | 8 | the first **Bombshell** |
| 2 | The Graft | Arrival | 7 · crossroads | the first **Challenge**, then the Crossroads |
| 3 | Casa Amor | The Turn | 5 | the **Casa arc** (see below) |
| 4 | Movie Night | The Turn | 7 | **Movie Night** |
| 5 | The Recoupling | The Turn | 7 | the girls' **Recoupling** + verdict |
| 6 | Final Week | Final Week | 9 | **The Final** (engine-queued climax) |

**Length is a peak budget, not a minute budget** (the theory review's peak-end
rule): six weeks = six manufactured peaks, each at its week's END, with the
Final protected above all (the terminal segment's climax card is queued by the
engine and nothing can displace it). A season now plays **~47 cards** (was
~33); the added runtime is quiet-day texture and bigger tentpole spacing, not
grind.

## How the pieces land (all pack-side; zero engine edits)

- **Phase mapping.** Cards keep authoring against the show-phase (`act:
  1|2|3`, the vocabulary every card file already speaks). `events.ts` remaps
  phase → weeks at pack assembly (`PHASE_WEEKS` in the manifest: 1→[1,2],
  2→[3,4,5], 3→[6]), so `GameEvent.act` is in week space by the time the
  engine and linter read it. `fromAct` fail states moved to week space
  (dumped-by-vote from week 3; the 79-line Final Week wall from week 6).
- **Tentpoles end weeks.** The producers plugin's beat windows (the existing
  delivery-by-force machinery) gain `'end'` / `'end-1'` slots resolved
  against the live `actLength` (so act twists keep the tentpole on the last
  card), and windows **roll forward** one week if a chain interjection (a
  wobble, an encounter chain) eats the last slot — a tentpole is a day late
  at worst, never lost. `events.ts` gives beat cards one week of act slack
  for exactly this.
- **Casa Amor closes week 3 by chain overrun.** `li_casa_text` stopped being
  an act-break chain and became `beat:casa`, fired on week 3's last slot; its
  5-card arc overruns the nominal length (the engine plays a pending chain
  past the segment boundary by design), so the week ends on the return
  verdict. The boys' Recoupling still opens Final Week via `onActBreak`.
- **The first Challenge is a real tentpole.** `li_challenge_heartrate` /
  `li_talent_night` became `beat:challenge1` variants (window: week 2's last
  slot) — one guaranteed per season instead of two maybe-ambients.
- **Per-week feel ladders moved into the producers plugin.** ADR-0010 left
  `jitterByAct` / `actWear` / `shopSlot` as shared tables keyed 1–3; the
  villa's weeks 4–6 sit past them. The plugin now owns the villa's ladders
  via the sanctioned hooks: `modifyJitter` (±15 → ±18 → ±22 across the
  phases), `modifyBurnout` (wear 0/0/1/2/2/3 by week, as a delta on the
  CONFIG contribution), and a `refineDeck` shop slot for weeks 4+ (the
  engine's own mechanism, generalized). One latent scheduling bug fixed on
  the way: a shop-less week's `shopDue` no longer suppresses that week's
  beat window.
- **The shell learned one word.** `Presenter.actWord` ("ACT" default,
  "WEEK" here) — ADR-0010 made the segment *count* data; this makes the
  *word* data too. Music renders byte-identically without declaring it.
- **Weekly recaps.** The clarity layer's "previously, in the villa" now
  fires at every week turn (2–6), each with an honest THIS-WEEK forecast of
  the tentpole the schedule actually delivers (ADR-0008's truthfulness
  contract at campaign level).
- **The daily rhythm** (`events-days.ts`): ten new ambient cards — iced
  coffees, 4 a.m. kitchens, the wobbly lounger, borrowed hoodies — Hillevi's
  garden layer, the texture the longer weeks stretch over.
- **The Connection rename** (charter-locked): display/copy only.
  `RESOURCE_META.bond.name` → "Connection" plus every player-facing string
  (clarity reads, Stirling barks, card copy, help, trophies, gate labels).
  The internal resource id `bond`, every knob (`bondFloor`, `bondGainMult`)
  and verb (`bondReset`) are unchanged.

## Balance (re-tuned for ~47 cards; the deliberate golden re-baseline)

Resources and stats accumulate ~40% higher over the longer season, so the
ceilings rose with them (numbers tuned against `simulate-pack` at 3–4k runs,
calibrated to the v3 baseline distribution):

- **Win gates:** winvilla 79/44 → **106/54** · realthing 78/80 → **90/93** ·
  brand 60/62 → **96/76** (labels synced).
- **Recoupling floors** (coupling plugin): bond 34 → **42**, public 31 →
  **56** — the ceremonies land in weeks 5–6 with much bigger meters; the
  floors keep a recoupling a question, not a formality.
- **Angle compounding:** +2/act → **+1/week** (5 breaks now, was 2).
- Landed distribution (narrative policy, 4k runs): success 38% · partial 30%
  · failure 13% · dumped 14% · walked 4% (v3 baseline: 30/32/16/18/4).
  A longer season lands a touch kinder on finishers — deliberate: peak-end
  says protect the ending, and losing a 25-minute season must stay possible
  but not casual. Reach improved: 118/124 cards seen across 3k seasons,
  under-5% cards down 11 → 3.

## What this deliberately does NOT do

- No factional public, no couple-web — Session 3 (charter).
- No per-segment fields on the shared `SegmentDef` — the feel ladders proved
  expressible through existing plugin hooks, so the engine contract is
  untouched.
- No save migration: a v3 mid-run save resumed under v4 re-reads its act
  number as a week and plays on degraded-but-safe (acts 1–3 are valid weeks;
  beats it already played stay done-flagged). The villa is online-first and
  a season is minutes long; next run is clean.

## Proof

- Music + probe goldens **byte-identical** after regenerating all three
  corpora (the ADR-0010 tripwire, now standing policy). Only
  `tools/golden/love-island.json` moved — re-baselined in its own commit.
- Full gate green: build · lint-content · simulate --check · node --test
  (202/202) · ui-smoke · ui-crowding · ui-mobile-matrix · docs-site build.
- A live headless drive of a full season confirms the rhythm: WEEK n · name
  in the HUD, quiet beats, the tentpole on the week's last card(s), a recap
  at every turn, the Final closing week 6.
- The new writing cleared the Session-2 taste checkpoint (swipe review;
  verdicts in `taste-feedback/`).
