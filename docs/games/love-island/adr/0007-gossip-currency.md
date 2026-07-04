# Gossip as a held currency (v2)

The playtest asked for "the gossip" to be first-class and for **MOMENTS**. Gossip
is the connective tissue that makes the small cast interact: a held resource you
**gather** and **deploy**, driving the emergent drama that scripted cards can't.
Pack-owned; it is *not* the engine's scalar cost-resource.

## The model

Gossip is an **inventory of discrete intel items** — a character's feeling, mood,
or a surfaced secret (ADR-0006) — held on run-state. This is distinct from **Graft**
(the manifest `costResource`, a scalar): gossip is typed, itemised, and spent by
*choice*, not deducted by *price*. It lives in a dedicated pack plugin.

- **Gather** in two channels: inside **encounters** (a beat reveals intel) and in
  the **Beach Hut confessional** — a recurring encounter that both feeds gossip in
  *and* lets the villa hear a **distorted version** back out (the confessional cuts
  both ways, which is the thematic point).
- **Deploy**: a choice/beat where held gossip is spent — *tell your partner*,
  *drop it to the Rival*, or *keep it*. Deploying shifts a target's **opinion or
  mood** or **flips a secret flag**, and **cascades** along the small
  Partner ↔ You ↔ Rival network.
- **Cash out at ceremonies**: the recoupling encounter (ADR-0006 climax) is the
  natural **sink** — deploying a Rival's secret at the line-up swings the
  `Bond OR Public` survival check. That closes the loop: intel gathered across an
  act pays off at its climax.

## Why a small network

The research on gossip mechanics (Sol Trader / social-sim propagation, see
[`../V2-RESEARCH.md`](../V2-RESEARCH.md)) shows information-as-currency creates
emergent drama — but a large network makes cascades illegible. Restricting
propagation to **Partner / You / Rival (+ active bombshell)** keeps the
consequence of a deployment readable, which serves the same legibility goal as the
rest of v2.

## Why pin it now (not defer to prose)

Gossip was the one system we considered holding loose until the vertical slice
proved the encounter loop. We pin it because it is the **connective tissue** the
"MOMENTS" goal depends on, and the **ceremony sink** (ADR-0006) references it — the
two decisions interlock, so recording gossip's shape now keeps the ceremony design
coherent. Implementation still lands *after* the slice (see the plan): the slice
proves one encounter without the economy; gossip is a Phase-2 layer.

## Why this is hard to reverse

It adds an **inventory to run-state** and a **deploy verb** to the choice grammar,
and the goldens will read it. Changing the item model or the propagation network
later is a schema-and-content rework.
