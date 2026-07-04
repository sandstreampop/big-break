# Love Island (working title) — a Pack for the Big Break engine

A reality-dating-show game built as a second genre `Pack` on the genre-neutral
career-climb engine. The player steers one contestant through one season in the
villa, making the show's binary choices, and tries to reach one of several ways
to "win" the season before the Final.

## Language

**Season**:
One playthrough — the engine's *run*. Spans the show's arc across three acts:
**Arrival** (act 1 — enter, first coupling, establish your Type & Angles),
**The Turn** (act 2 — Bombshells, drama, Casa Amor, biting recouplings), and
**Final Week** (act 3 — meet-the-families, final dates, the public-vote surge,
then the Final where Summit gates are checked).
_Avoid_: run, game, playthrough

**The Final**:
The finale — the last night, where the public vote peaks (Public is the
momentum clutch) and each Summit's win gate is evaluated.
_Avoid_: finale, ending, the last episode

**Casa Amor**:
The marquee mid-Season set-piece: a bounded forced chain at the Act 1→2 break
where the villa splits, your couple is separated, and you face a concentrated
loyalty gauntlet — stay faithful (Loyalty → The Real Thing) or bring someone
back (Savvy/drama → Followers) — resolved by a "do you recouple?" beat. A
first-class citizen of the game, not ambient cards.
_Avoid_: the other villa, temptation week

**Islander**:
Any contestant in the villa — the player's or an NPC. The player steers one
Islander for the whole Season (chosen via a loadout/persona; see Type).
_Avoid_: contestant, player, character

**Cast**:
The named roster of NPC Islanders (roughly 5–8), each embodying a recognizable
Love Island Type. Your Partner is drawn from the Cast; Bombshells join it;
recouplings pick from it.
_Avoid_: roster, NPCs, other islanders

**Type**:
The recognizable Love Island stereotype an Islander embodies, signalled by their
name (the loyal girl-next-door, the savage game-player, the golden-retriever
boy, the villain). The shared archetype vocabulary: NPC Cast members ARE Types,
and the player's selectable personas (the engine's *loadouts*) are playable
Types.
_Avoid_: archetype, stereotype, class

**Rival**:
The Cast member who recurs as your antagonist — trying to steal your Partner or
out-shine you. The engine's *rival subsystem*, reskinned.
_Avoid_: nemesis, enemy

## Playable Types

The four personas you can start a Season as (the engine's *loadouts*). Each is a
Type with a starting stat lean and a signature quirk; each leans toward a Summit
without being locked to it. More can ship as unlocks later (e.g. The Bombshell).

**The Golden Retriever**:
Sweet, loyal, heart on sleeve. +Loyalty, −Savvy. Genuine/loyal moments hit
harder and build Bond faster. Leans → The Real Thing.

**The Game-Player**:
Here to win, reads the room. +Savvy, −Loyalty. Better on strategic/recoupling
choices and shrugs off drama (less In Your Head). Leans → survival & Win the
Villa.

**The Influencer**:
Here for the 'gram, camera-aware. +Charisma, −Loyalty. Dramatic/charismatic
moments throw off bonus Followers. Leans → The Brand.

**The Heartthrob**:
Pure Rizz, everyone fancies them. +Rizz, −composure. Flirt/pull choices hit
harder, but they're a head-turn magnet (a Rival guns for them). Leans → coupling
& Win the Villa.

**Villa moment**:
A single card the player is dealt: a date, a challenge, a recoupling, a text.
The engine's *GameEvent*.
_Avoid_: card, event, situation

**Summit**:
A distinct way to win the Season, with its own win gate checked at the Final.
The engine's *path*. There are three, pulling in different directions:
_Avoid_: path, ending, goal

**Win the Villa**:
The Summit where the public crowns you and your partner the winning couple
(the £50k). The public-vote summit.

**The Real Thing**:
The Summit where you leave in a genuine, lasting couple — love over game.
The authenticity/loyalty summit; winning the prize is not required.

**The Brand**:
The Summit where you convert villa notoriety into a post-show empire (a
following), win or lose, hero or villain. The clout summit.

## Stats

The four core attributes that govern a Villa moment's choices and feed the
Summit gates. Split into two tension-axes: romance (Rizz vs. Loyalty) and
profile (Savvy vs. Charisma).

**Rizz**:
One-on-one romantic pull — the charm to flirt, pull, and hold a partner.
_Avoid_: charm, game (as flirtation), attraction

**Loyalty**:
Sincerity and depth of a connection — being genuine. The anti-game stat.
_Avoid_: authenticity, heart, honesty

**Savvy**:
Villa game-sense: reading the room, strategy, surviving recouplings and votes.
_Avoid_: strategy, game, cunning

**Charisma**:
Broad on-camera magnetism that turns villa moments into screen-time.
_Avoid_: presence, likability, star quality

**In Your Head**:
The emotional-toll meter — spiralling, overthinking, villa anxiety. The engine's
*burnout* slot, reskinned. Rises from drama, betrayal, and grafting too hard;
maxing it ends the Season as a tearful voluntary exit ("you walk").
_Avoid_: burnout, stress, meltdown

## Resources

Accumulating quantities that carry the Summit gates. The engine's *resources*.

**Public**:
Your share of the public's favour / vote. Anchors the *Win the Villa* gate and
doubles as the finale momentum clutch (the late-season vote surge).
_Avoid_: votes, popularity, fame

**Followers**:
Post-show clout. Anchors *The Brand*. Drama and screen-time feed Followers
rather than being a resource of their own.
_Avoid_: clout, fans, social

**Bond**:
The strength of your strongest connection. Anchors *The Real Thing*. Not a flat
resource — owned and moved by the Coupling subsystem (see below), the way
music's charts subsystem owns "hits".
_Avoid_: connection, chemistry, love

## Fail states

Ways a Season ends badly before or at the Final. The engine's *fail states*.

**Walk**:
The emotional, self-inflicted exit — In Your Head maxes out and you leave in
tears. The engine's universal burnout fail, reskinned.
_Avoid_: quit, breakdown

**Dumped**:
The external elimination, live from Act 2 onward (Act 1 is a grace period).
Triggered by either the public dropping you (Public craters) or being single at
a Recoupling (nobody picks you). Whether it's the public or the villa, you go
home.
_Avoid_: eliminated, voted off, sent home

## Subsystems

Optional pack-owned mechanics (the engine's *plugins*).

**Coupling**:
The subsystem modelling who the Islander is partnered with and how strong that
tie is. The Islander is coupled with exactly ONE partner at a time; Bond is that
couple's strength. Owns the Bond value and drives recouplings.
_Avoid_: relationship, partnership

**Partner**:
The single Islander you are currently coupled with. Bond measures this couple's
strength. You have one at a time until a Recoupling changes it.
_Avoid_: match, other half, love interest

**Recoupling**:
The beat where couples re-form — you may keep your Partner or switch. Lands on
act breaks. Can transfer or reset Bond.
_Avoid_: reshuffle, swap

**Bombshell**:
A new Islander arriving mid-Season, forced into the deck at a scheduled slot
(reusing the engine's forced-category mechanic). A source of Temptation and
recoupling threat.
_Avoid_: new arrival, newbie

**Temptation**:
A card that tests an existing couple — your head can turn toward someone new
without you leaving your current couple. The "juggling" flavour, modelled as
events rather than a second Bond ledger.
_Avoid_: head turn (as a mechanic name), affair

**Graft**:
The currency — social/romantic capital banked from good villa moments (being
fancied, winning a challenge, landing a chat) and spent to invest in your Edit.
The engine's cost resource, reskinned; no money, no shop.
_Avoid_: money, currency, effort points

**Edit**:
Your slot-limited set of Angles — the persistent-modifier layer you invest Graft
into (the engine's *gear*). The "shop" is not a shop: it's the recurring daybed
graft beat that offers a shelf of Angles to pick one.
_Avoid_: gear, loadout, build

**Angle**:
One reputation trait you're becoming known for (*The Loyal One*, *Comedy Gold*,
*The Villain*, *Everyone's Type*). A persistent, tag-matched modifier that boosts
matching villa moments and leans you toward a Summit. The engine's *accessory*.
_Avoid_: trait, perk, item
