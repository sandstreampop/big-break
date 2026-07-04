# Coupling dynamics: how Recoupling, Casa Amor, Temptation, and the Reveal move Bond

Building on ADR-0001 (single Partner, one Bond value, no portfolio), this pins how
that value actually moves — the run-state-shaping mechanics of the Coupling
subsystem. All of it is plugin-owned; the engine names no coupling concept.

## Recoupling survival

A Recoupling is a survival check owned by the Coupling plugin, resolved as
`Bond ≥ bondFloor` **OR** `Public ≥ publicFloor` — a strong connection holds your
Partner, **or** public favour keeps you in. Fail **both** → you are left single →
`Dumped`. We chose **OR** (either saves you), not **AND** (both required), because
AND makes elimination punishingly swingy and collapses the two intended
playstyles into one; OR lets a Loyalty player survive on Bond and a Savvy/Public
player survive on favour.

Who is exposed is set by the **alternating-chooser rule** (see ADR-0003): you only
face this check at Recouplings where the *other* gender chooses. When *your* gender
chooses you have agency (keep or switch) and no Dumped risk.

## Bond on a switch, and the Rival

A **voluntary switch** of Partner **resets Bond to a base** (you are starting over) —
not a partial transfer. A base reset keeps run-state a single clean number and
matches the show's "starting fresh." The **Rival** applies a **Bond penalty at the
Recoupling check** (they are actively poaching your Partner), so a neglected Bond
plus weak Public is what actually gets you dumped.

## Casa Amor

Casa Amor is a **guaranteed-survivable** bounded forced chain (engine
`pendingChainId`) at the Act 1→2 break — it is *not* a Dumped gate. It is a values
test that reshapes your coupling and resources, culminating in a "do you recouple?"
fork:

- **Stay faithful** → Bond preserved and boosted; Loyalty-leaning; feeds *The Real
  Thing*. Opportunity cost: you forgo the Followers/drama spike.
- **Bring someone back** → forced Partner switch → Bond resets to base; big
  **Followers + drama** payout (Savvy/Charisma); costs In-Your-Head; your ex
  re-enters as a potential Rival.

**The regular gut-punch.** Independent of your own choice, you can return to find
your **Partner recoupled with someone else** — an external event that resets *your*
Bond. This fires **regularly**, not rarely: staying faithful is genuinely risky. To
keep that from turning the Loyalty path into a trap, the **loyal-but-betrayed**
outcome pays out **Public + sympathy, a softened In-Your-Head hit, and a Graft
windfall** (a betrayal is prime screen-time → capital for your Edit) — enough to
buy a new Angle and re-slot toward Win the Villa or rebuild. It is tuned to stay
**strictly worse than a Bond that held** (ordering: faithful-and-it-held >
betrayed-but-loyal > strayed-yourself), so players never farm betrayal on purpose.

## Temptation

Everyday Temptation cards are **Bond-only** — no mid-act Partner switches. Resist
(small Bond + Loyalty, In-Your-Head relief, forgo Followers) vs let your head turn
(Followers + drama, Bond *damage* — a hit, not a reset — In-Your-Head rise, feeds
Rival/recoupling threat). Every real Partner change is anchored to a named beat
(Recoupling, Casa Amor, or an immediate-recouple Bombshell), never a Temptation.

## The Bombshell exception

Bombshells normally only **seed pressure** (a flag opening Temptations / activating
the Rival penalty) that matures at the next scheduled Recoupling. **One exception:**
a rare, special **immediate-recouple Bombshell** (Act 2 territory) can steal your
Partner → reset your Bond → strand you single on the spot. It does **not** itself
fire `Dumped` — being stranded drops you into the next Recoupling's `Bond OR Public`
check — and the odds your specific couple is hit scale **inversely with Bond +
Public** (a solid, well-loved couple usually resists).

## The Reveal

Hidden behaviour is a latent-flag exposure system the Coupling plugin owns.
Loyalty/betrayal flags accumulate (`strayed_casa`, `secret_graft`, `head_turned`;
plus the plugin tracks the **Partner's** hidden loyalty state, seeded during Casa
Amor). Scheduled **Reveal Text beats** — the Casa Amor **postcard** (a misleading
teaser) and **Movie Night** (full exposure) — read those flags and apply
retroactive Bond damage / Public / Followers / In-Your-Head deltas. **Dramatic
irony is the point:** you know your own dirt but your Partner's stays concealed
until the Reveal. **Come-clean** beats let you trade a smaller certain Bond hit now
to defuse a bigger exposure later. The Casa gut-punch is simply the first Reveal;
Movie Night is the bigger later one.

## Exclusivity

"Making it official" is a Bond-threshold choice beat. Going official locks in and
boosts Bond, drops Temptation vulnerability, and makes your Partner far more likely
to re-pick you at "chosen" Recouplings (lower Dumped risk) — a strong *Real Thing*
signal. It is **reversible-but-costly**: you can still stray while official, but
straying-while-official is a far heavier betrayal flag (worse Reveal fallout).
The costs that make it a real decision: you forgo the Followers of playing the
field, and you **raise the fall-height** (a later betrayal/steal detonates harder,
though with larger Public sympathy).

## Why this is hard to reverse

Every mechanic here writes or reads the coupling run-state (Bond, Partner identity,
the Partner's hidden loyalty state, betrayal flags) and frames large swaths of the
deck (Temptation, Casa, Reveal, Recoupling copy). Changing the survival rule, the
switch semantics, or the latent-flag model later is a schema-and-content rework, so
they are pinned here deliberately.
