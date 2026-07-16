// The Odyssey — the bard's presentation frame (the Presenter): titles, act
// intros, the crossroads copy, endings (the hollow win visible from the first
// success), the landmark set-piece framing, the boon chips, and the Hall's
// three doors. Every string here is held to the taste floor by the
// presenterCopy lint rail (tools/lint-content.mjs).

import type { Pack, RunState } from '../../types.js';
import { bardBeat, cycleHeard } from './bard-chatter.js';
import { odysseyFeel } from './feel.js';
import { odysseySoundscape, resultCue, endingCue, speak } from './soundscape.js';
import { friezeTableau } from './frieze.js';
import { hearthScene, cupLevelFor } from './hearth.js';
import { odysseyTitleScene } from './threshold.js';
import { cyclops, ashBand, hallDoors, fire, coldHearth, ember, cup } from './art/figures.js';
import { lostMan, crewAtLaunch } from './crew.js';
import { reducedMotion } from '../../ui/dom.js';
import { heldTurnings, justLanded, fragmentShelf, TURNING_NAMES } from './shelf.js';
import { godPulse } from './alive.js';
import { ODYSSEY_TROPHIES, ODYSSEY_TROPHY_SPECIALS } from './trophies.js';
import { odysseyRecap, ACT_TEXT } from './recap.js';

// The prophecy meta-arc (slice 6). The Oar Road — the truer ending — is a
// VARIANT of the nostos success (same ending key; the run decides which
// verses it gets), rendered through the presentFinale hook: the shell hands
// the judged run in explicitly and this derives the copy from its arguments
// alone. (Until the 2026-07 review this was a noteFinale side-channel — a
// plugin writing module state for an endings-table getter to read later —
// which leaked across engine instances: judge A, judge B, render A → A got
// B's ending. Pinned by test/odyssey-prophecy.test.mjs now.)
//
// The Oar Road is walked when the whole prophecy was carried (the third
// question pressed THIS run), the sea was kept unprovoked, and the
// homecoming judged a full success. Well under one telling in ten, even
// for the bard who knows all three turnings — the knowing is the easy half.
function oarRoadWalked(s: RunState): boolean {
  return s.ending?.result === 'success'
    && s.flags.includes('ody_oar_road')
    && (s.poseidon || 0) <= 3;
}

const NOSTOS_SUCCESS = {
  title: 'The Bed of Living Oak',
  text: 'So the bow speaks, the hall is washed, and the queen tests him with the bed no man could move — and he answers like a carpenter, which is how she knows her husband. Ships came home. Men came home. That is the ending everyone pays for, friends. And still, some nights, he wakes before first light and goes down to stand on the shingle, and does not go into the water. The sea does not forget. There is a truer ending than this one. I do not have all of it. Yet.',
};

const OAR_ROAD = {
  title: 'The Oar Road',
  text: 'The bow speaks. The hall is washed. And THEN, friends — then, while the island is still learning to believe in him, he takes a well-cut oar from his own ship and walks INLAND, away from everything he crossed the world for, day after climbing day, until a man at a field-edge asks, neighborly, why he carries a winnowing fan on his shoulder. There. There he plants it, and pays the sea its bull, its boar, its ram, and the oldest debt in this telling closes like water behind a keel. He walks home unarmed and unhurried through the middle of his own kingdom. The years after are an ease the songs have no meter for; and death, when it finally thinks of him, comes up from the fields and not the foam — mild as evening, OFF the water, exactly as promised. That is the whole prophecy, friends, sung end to end at one fire. I have waited a long time to finish it. Bank the fire. Some tellings you do not follow with another.',
};

export const odysseyPresenter: NonNullable<Pack['presenter']> = {
  aboutLine: 'The Odyssey — the long way home, sung at your fire.',
  // The stroke (I1): water-resistance drag, oar-sweep commit, the arm knock.
  feel: odysseyFeel,
  // The Sound Law: silence is the identity — the lo-fi engine and generic
  // blips are OFF; v0 voices only *the stroke* (the lexicon lands in I6).
  soundscape: odysseySoundscape,
  // The living frieze (I3): the vase-band IS the state display; the numeric
  // rail leaves the screen (world-is-HUD) and the truth sits one tap away
  // in the frieze's inspect panel.
  tableau: friezeTableau,
  diegeticHud: true,
  title: {
    logo: 'THE<br>ODYSSEY',
    taglines: [
      'The itinerary is fixed. The voyage is not.',
      'Every telling is true. That is what a sea story is.',
      'You know where it ends. You do not know how.',
      'The sea does not forget.',
    ],
    glyphs: ['⛵', '🔱', '🦉', '🏺'],
    foot: (meta: any) => {
      if (meta?.odyssey?.oarRoad) return 'The bard has sung the whole prophecy, end to end, at this fire.';
      const n = (meta?.odyssey?.fragments || []).length;
      return n === 0
        ? 'The prophecy has three turnings. The bard has heard none of them. Yet.'
        : `The bard carries ${n} of the prophecy’s three turnings.`;
    },
  },
  actWord: 'ACT',
  actNames: ['', 'The Sack and the Sea', 'Witches and the Dead', 'The Narrow Way'],
  // The banked-bonus mechanic, in the fireside register (the shell's default
  // copy is the music pack's fireworks — wrong fire): a moment sung
  // INCREDIBLY earns the telling a following wind, spent on one stroke.
  // (Copy fits ONE line at the 320px floor beside the longest prompts — the
  // worst-cards guard prices this bar into the card's height budget.)
  encore: {
    ready: '⛵ A following wind — spend it now',
    armed: '⛵ THE WIND TAKEN — this stroke rides it',
  },
  // THE FIRST TELLING (FTUE): the title-screen offer, the HUD strip label
  // while the ramp runs, and the wrap-up. Teach-by-recap: only what the
  // three cards actually taught — the oar, the tell + the band, the two
  // ledgers — then the ONE hook that gives a telling its shape (the two
  // roads), and the prophecy named as the thing that carries between fires.
  tutorial: {
    offer: '▶ Sit — The First Telling',
    skip: 'Skip it — I know how a telling goes',
    replay: '🎓 Hear the first telling again',
    hud: 'THE FIRST TELLING · the fire is new',
    end: {
      verdict: 'THE FIRE TAKES YOU',
      title: 'You Know the Oar Now',
      text: 'Three beats, friend, and you pulled all three — which is the whole trade, learned. Tonight the real telling: twelve ships, three seas, landmarks no telling has ever missed, and a home that must be earned twice. The itinerary is fixed. The voyage is not. Sit anywhere. The seat nearest the fire still rows.',
      lessons: [
        { cls: 'notice-gear', html: '👆 <b>One swipe, one decision.</b> Drag left or right, or tap a button. That’s the whole oar.' },
        { cls: 'notice-gear', html: '⚔️🪢📜 <b>Three ways at any trouble</b> — fight it, trick it, know the rite against it. The coloured shape is the risk: ● safe · ▲ dicey · ■ likely bad · ✦ big upside. A bad card stings; it does not sink the telling.' },
        { cls: 'notice-bad', html: '🏺 <b>The painted band is the voyage</b> — ships, gods, the name. Tap it for plain numbers. 🌫️ <b>Despair</b> ends the telling at the top; 🔱 fill <b>Poseidon</b> to ten and the wave comes.' },
        { cls: 'notice-good', html: '⛵🌟 <b>Two roads at the Crossroads:</b> the Homecoming (hulls kept, the goddess earned) or the Glory (renown, paid for in wrath). And the prophecy has three turnings that carry from fire to fire — some nights you bring one home.' },
      ],
      next: '▶ Begin tonight’s telling',
      lpNote: '+15 Legacy Points — the fire remembers a listener who rowed. Legacy widens what later tellings can hold.',
    },
  },
  // The threshold (I5): the fireside before the telling — the player's first
  // touch kindles the fire; Resume means it still burns from last time.
  titleScene: odysseyTitleScene,
  // The overture texts are single-sourced in recap.ts (ACT_TEXT): the
  // recap's "road ahead" block and these intros describe the same water by
  // construction. Acts 2-3 normally render via the recap takeover; these
  // stay as the fallback (and act 1's opening night always uses its entry).
  actIntro: {
    1: { name: 'The Sack and the Sea', scene: hearthScene({ act: 1 } as RunState), text: ACT_TEXT[1] },
    2: { name: 'Witches and the Dead', scene: hearthScene({ act: 2 } as RunState), text: ACT_TEXT[2] },
    3: { name: 'The Narrow Way', scene: hearthScene({ act: 3 } as RunState), text: ACT_TEXT[3] },
  },
  // The act recap (pass 3): between acts the bard counts the house — the
  // fleet's real count, the name's status, the gods' mood — before naming
  // the road ahead (the fixed overture rides as the recap's last block).
  // Act 1 returns null, so the opening night keeps its fixed intro above.
  recap: odysseyRecap,
  crossroads: {
    head: 'The name in your mouth',
    sub: 'The prow is out of stone-throw, and the bard leans in: does this telling row for home, or for the song? Homecoming counts hulls and keeps the sea unprovoked; glory is bought in deeds and paid for in wrath.',
  },
  // The hollow win — unless tonight's telling walked the whole prophecy.
  // Pure: everything the variant depends on arrives as the argument.
  presentFinale({ run, ending, result }) {
    if (ending === 'nostos' && result === 'success' && oarRoadWalked(run)) return OAR_ROAD;
    return null;
  },
  endings: {
    nostos: {
      success: NOSTOS_SUCCESS,
      partial: {
        title: 'Home, and Unrecognized',
        text: 'He reaches Ithaca — hear me, he does reach it — but thinner than the prophecy promised: hulls short, men short, the goddess looking elsewhere. The dog knows him. The swineherd knows him. The house takes longer, and some of it never quite believes, and at feasts for years there is an empty-chair silence where a name used to sit. A homecoming, friends. Not the homecoming.',
      },
      failure: {
        title: 'The Harbor Light, Seen Once',
        text: 'They saw the home-fires, friends — I will not soften it — saw the smoke of Ithaca rise over the water, close enough to name the hilltops. What happened then belongs to the sea that did it. The telling ends with the light on the water going out, and the long way home becoming, quietly, the way.',
      },
    },
    kleos: {
      success: {
        title: 'The Song That Outlives the Sea',
        text: 'He comes home with less than he sailed with and more than any king alive: the name. Shouted at giants, carved into the war’s ending, carried by every crew that passes a certain cave and rows a little faster. At the feast they ask him to tell it himself, and he stands, and the hall goes quiet the way the sea never did for him. That quiet is the prize, friends. Ask him at the shingle, some mornings, what it cost.',
      },
      partial: {
        title: 'Famous to Strangers',
        text: 'The song arrives home before the man, and does better there than he does. In halls he will never see, his deeds are sung with the details wrong and the name right. On Ithaca, where it matters, they know the name and squint at the face. Glory, friends, is a coin that spends best far from where it was minted.',
      },
      failure: {
        title: 'A Verse in Someone Else’s Song',
        text: 'The deeds were done — some of them, nearly — but a song needs a shape, and the voyage broke apart before it took one. What survives is a verse here, a boast there, a name in a list of captains. The bards of Smyrna sing it flat, friends, and there is no one left with standing to correct them.',
      },
    },
    wrath: {
      title: 'The Sea Takes Its Answer',
      text: 'The name was shouted at the water once too often, friends, and the sea is patient the way stone is patient. Far down, where the light gives up, the debt is called in whole. The fire is low. That is on purpose. We do not sing the last wave. We sing that the gulls were the only mourners, and that they mourned in their fashion — which is to say, they wheeled once, and went to look at other water.',
    },
    lotus: {
      title: 'The Meadow That Won',
      text: 'Then he sat down in the shade, friends, and the trying stopped — and I will not pretend the fire approves, and I will not pretend the meadow is a lie. The flowers are real. The rest is real too: the men eat, and smile, and name no goats, and want nothing, and the ships go grey on a beach no one walks to. It is not a bad ending. That is the terrible thing about it. Somewhere a wife runs a farm alone and does not know she may stop waiting. Pay the bard anyway. The man in the meadow would want — no. He would not care. That is the point of the meadow.',
    },
    circe: {
      title: 'The Guest Who Stayed',
      text: 'In this telling he is there still, friends: a king in a house of soft magic, growing no older, missing a rock in the sea more than he can say and saying it less each year. She is kind to him — hear me, she is KIND to him; that is not the tragedy. The tragedy is smaller and worse: there is a cupboard in that house where his sea-cloak hangs, salt still in the weave, and some evenings he opens the cupboard and stands a while, and shuts it again, and goes back to the warm. The loom sings. The wine goes round. We will leave the lamp in the window, friends, for the versions of him that row past it.',
    },
    calypso: {
      title: 'The Island That Asks Nothing',
      text: 'Then we leave him there — old friends, warm, unwritten. No one who chose the island has ever complained. Or been heard from. Which may be the same thing. The fire is yours a while yet: I will sing the figs, the seven soft veils of distance, the goddess who wanted only that he stop rowing — and if my voice catches once near the end, that is the smoke, and you will not ask. Some tellings end at sea, friends, and some in halls, and some, like this one, in comfort — which the fire has never yet learned to cheer for, and never quite learned to condemn.',
    },
    burnout: {
      title: 'The Beach at the End of Rowing',
      text: 'There is a beach — on Ogygia, on Aeaea, on any of them — where a man can sit down with his back to a rock and stop. Not die. Stop. The tide fills his footprints and he does not make new ones. Some men are not lost at sea, friends. The sea just outlasts them. We leave him there tonight, looking at the water. If you want him to stand up, come back tomorrow, and pay the bard, and we will see what can be done.',
    },
  },
  // The bard's frame chatter: his OWN full-screen beat between cards (the
  // preCardBeat channel), not a box stacked on the choice card. Pool + seeded
  // picker live in bard-chatter.ts; this is a pure read of the dialogue the
  // plugin queued for this deal.
  preCardBeat: bardBeat,
  // ── slice 3: the landmark surfaces ──
  // The boons on the HUD: the carried things (flags → chips → inspect).
  carriedChips(state) {
    const chips: { cls: string; html: string; sheet: any }[] = [];
    const flag = (f: string) => (state.flags || []).includes(f);
    if (flag('ody_named')) chips.push({ cls: 'gear-chip', html: '🗣 The Name, spent', sheet: {
      emoji: '🗣', title: 'The Name, spent',
      lines: ['You shouted it at the sea, whole — father and city and all.', '<b>Renown rose. Poseidon listened.</b> The sea does not forget.'],
    } });
    if (flag('ody_nobody')) chips.push({ cls: 'gear-chip', html: '◌ Nobody', sheet: {
      emoji: '◌', title: 'Nobody',
      lines: ['The name went down with the anchor-stone, where it can never be shouted from.', '<b>The sea was left unprovoked.</b> Glory was left on the water.'],
    } });
    if (flag('ody_fore_bow')) chips.push({ cls: 'gear-chip inst-chip', html: '🏹 The prophet’s word: the bow', sheet: {
      emoji: '🏹', title: 'The prophet’s word: the bow',
      lines: ['“The bow remembers your hands, and their hands it refuses. Wait for the day of the axes. String it slow.”', '<b>The bow door in the Hall pays double.</b>'],
    } });
    if (flag('ody_fore_sea')) chips.push({ cls: 'gear-chip hustle-chip', html: '🌊 The prophet’s word: the sea', sheet: {
      emoji: '🌊', title: 'The prophet’s word: the sea',
      lines: ['“Pour to the god you wronged at every landfall, though your jaw creaks with it.”', '<b>Poseidon eased; Athena’s door in the Hall opens wider.</b>'],
    } });
    return chips;
  },
  // Ceremony, rationed (I7): full-screen treatment belongs to exactly the
  // three landmarks (the Cyclops fills the band; the Underworld drains the
  // screen to ash; the Suitors' doors close behind you) — and the
  // temptations get the INVERTED grammar, the hush: no spectacle, the world
  // softens (mood 'hush' — no haptic, no sting; css/odyssey.css calms the
  // frieze and the doors go gentle). The gold fret is the gods' border
  // (.sp-ody); one full-screen beat per arc (key), the ribbon after.
  setPiece(state, ev) {
    const tags = ev.tags || [];
    if (tags.includes('landmark')) {
      if (ev.id.startsWith('ody_cyclops')) {
        return {
          banner: 'THE CYCLOPS', sub: 'The bard sets down his cup. The fire leans in.',
          cls: 'sp-ody sp-ody-cyclops', key: 'cyclops',
          sceneHtml: `<span class="scene-cyclops">${cyclops()}</span>`,
        };
      }
      if (ev.id === 'ody_underworld' || ev.id === 'ody_tiresias' || ev.id === 'ody_tiresias_oar') {
        return {
          banner: 'THE UNDERWORLD', sub: 'The fire burns low here. That is on purpose.',
          cls: 'sp-ody sp-ody-deep', key: 'underworld',
          sceneHtml: `<span class="scene-ash">${ashBand(96, { stretch: true })}</span>`,
        };
      }
      if (ev.id.startsWith('ody_hall')) {
        return {
          banner: 'THE HALL OF SUITORS', sub: 'One door left — the one with your name on it.',
          cls: 'sp-ody sp-ody-hall', key: 'hall',
          sceneHtml: `<span class="scene-doors">${hallDoors()}</span>`,
        };
      }
      return null;
    }
    if (tags.includes('temptation')) {
      if (ev.id === 'ody_tempt_lotus') {
        return { banner: 'THE MEADOW', sub: 'No one is unkind here. That is the whole of the danger.', cls: 'sp-ody-hush', mood: 'hush', key: 'lotus' };
      }
      if (ev.id === 'ody_tempt_circe') {
        return { banner: 'THE SOFT YEAR', sub: 'The house is warm, the loom sings, and the year does not count itself.', cls: 'sp-ody-hush', mood: 'hush', key: 'circe' };
      }
      if (ev.id === 'ody_tempt_calypso') {
        return { banner: 'THE ISLAND', sub: 'She asks for nothing. The sea asks for everything. Two silences — choose.', cls: 'sp-ody-hush', mood: 'hush', key: 'calypso' };
      }
    }
    return null;
  },
  // The crowd holds its breath (I7): landmark decisions still the whole
  // world — the pack's DOM module reads this class and pauses every
  // vase-frame until the commit; on release the room moves at once.
  cardClass(ev) {
    return (ev.tags || []).includes('landmark') ? 'ody-breath-card' : null;
  },
  // The three-door grammar at maximum stakes: the pre-finale set. Every
  // door is always offered; the prophecy boons make theirs pay better —
  // knowledge-only, exactly as the grill demands.
  finalSet(run) {
    const flags = run.flags || [];
    const bowFore = flags.includes('ody_fore_bow');
    const seaFore = flags.includes('ody_fore_sea');
    const options = [
      {
        title: 'String the bow',
        blurb: bowFore
          ? 'The prophet said it plain: the bow remembers your hands. String it slow.'
          : 'Not one of them can string it. One of you can.',
        stat: 'might', amount: bowFore ? 8 : 4,
        label: bowFore ? '+8 Might · the foretold door' : '+4 Might',
        apply: () => { run.stats.might = Math.min(100, run.stats.might + (bowFore ? 8 : 4)); },
      },
      {
        title: 'The beggar’s patience',
        blurb: 'Hold the disguise one hour longer than a king can bear to. Doors bar quietly. Blades go missing.',
        stat: 'guile', amount: 4, label: '+4 Guile',
        apply: () => { run.stats.guile = Math.min(100, run.stats.guile + 4); },
      },
      {
        title: 'Athena at your shoulder',
        blurb: seaFore
          ? 'You paid the sea its due at every landfall. The goddess noticed the bookkeeping.'
          : 'The owl has watched the whole voyage. Ask, at last, out loud.',
        stat: 'athena', amount: seaFore ? 3 : 2,
        label: seaFore ? '+3 Athena · she tips the scale' : '+2 Athena',
        apply: () => { run.athena = (run.athena || 0) + (seaFore ? 3 : 2); },
      },
    ];
    return {
      head: 'The Hall of Suitors',
      sub: 'The last door of the telling — the bow, the rags, or the goddess. Your path’s gates are judged after.',
      options,
    };
  },
  // ── The prophecy meta-save (slice 6) ──
  // Setup stamps the bard's known fragments onto the fresh run as flags —
  // the ONLY thing that crosses tellings, and it is knowledge, not power:
  // the flags gate the third question; they add no number to anything.
  applySetup(state, _sel, meta, daily) {
    // Never on a daily: the shared telling is the same run for everyone
    // (the musicApplySetup precedent) — a bard's private repertoire must
    // not fork the day's seed at the trench.
    if (daily) return;
    const frags: string[] = meta?.odyssey?.fragments || [];
    for (const f of frags) {
      const flag = `ody_frag_${f}`;
      if (!state.flags.includes(flag)) state.flags.push(flag);
    }
    // The Memory Law (I8): the crowd remembers previous tellings. A
    // snapshot of the telling-ledger rides the fresh run so the hecklers'
    // callback pool (bard-chatter, kind 'memory') can key off it — pure
    // knowledge, no number touched, exactly the prophecy's pattern.
    if (meta?.odyssey?.tellings) {
      state.tellingLedger = {
        ...meta.odyssey.tellings,
        byEnding: { ...(meta.odyssey.tellings.byEnding || {}) }, // never alias the save
        heard: [...(meta.odyssey.heardCallbacks || [])],
      };
    }
  },
  // Run end banks tonight's turning (summarize().fragment) into the pack's
  // namespace on the shell's meta save. Union, never count — knowledge does
  // not stack.
  recordMeta(meta, summary) {
    meta.odyssey = meta.odyssey || {};
    if (summary?.fragment) {
      const frags: string[] = meta.odyssey.fragments || [];
      if (!frags.includes(summary.fragment)) frags.push(summary.fragment);
      meta.odyssey.fragments = frags;
      if (summary.trueVictory) meta.odyssey.oarRoad = true;
    }
    // The telling-ledger (I8): the fire remembers every night — how it
    // ended, the names' habit, the dead. Counts only; the words that spend
    // this knowledge live in bard-chatter's memory pool.
    const t = meta.odyssey.tellings = meta.odyssey.tellings || {
      count: 0, byEnding: {}, named: 0, nobody: 0, crewLostTotal: 0,
    };
    t.count += 1;
    if (summary?.endingKey) {
      t.byEnding[summary.endingKey] = (t.byEnding[summary.endingKey] || 0) + 1;
      t.lastEnding = summary.endingKey;
      t.lastResult = summary.endingResult ?? null;
    }
    if (summary?.named) t.named += 1;
    if (summary?.nobody) t.nobody += 1;
    t.crewLostLast = summary?.crewLost ?? 0;
    t.crewLostTotal += summary?.crewLost ?? 0;
    // No-repeat-until-exhausted for the crowd's callbacks: union what the
    // fire heard tonight, then let the cycle REALLY reset — the heard set is
    // persistent, so when everything the next telling could hear has been
    // heard, keep only tonight's and the gags come back around (without the
    // reset, no-repeat dies quietly after one full cycle).
    const heard = new Set([...(meta.odyssey.heardCallbacks || []), ...(summary?.heardCallbacks || [])]);
    meta.odyssey.heardCallbacks = cycleHeard([...heard], t, summary?.heardCallbacks || []);
  },
  // The lexicon at the result (I6): at most ONE sound-event per landing —
  // the wave, the owl-note, the fragment-chime, or the Hall's bow-string —
  // plus the god-pulse (the heavy slow haptic when a god moves). The
  // mapping is pure (resultCue, unit-tested); the side effects live here,
  // browser-only (results render once; the sims never call presenter hooks).
  resultExtras(result, state) {
    const notices: { cls: string; html: string }[] = [];
    const cue = resultCue(result);
    // Node-safe (test/odyssey-progress-law.test.mjs calls resultExtras
    // directly, with no DOM/meta boot): only touch the browser-only motion
    // pref / haptic when a document actually exists — the same guard
    // alive.ts uses for its own DOM-side checks.
    const inBrowser = typeof document !== 'undefined';
    if (cue) {
      speak(cue as any);
      if ((cue === 'wave' || cue === 'owlNote') && inBrowser) godPulse();
      // The prophecy fragment is the one gold-fret moment of the Underworld
      // (I7) — and per ADR-0002 (replay legibility, slice 2) it is licensed
      // to be LOUD: the turning lands as a categorically distinct shelf
      // component (a filled amphora slot), never a sentence buried in the
      // result prose, plus the god-pulse haptic. Still never the siblings'
      // grammar (no celebrate/cash/spawnConfetti — the guard in
      // test/odyssey-progress-law.test.mjs pins that fence).
      if (cue === 'fragmentChime') {
        const held = heldTurnings(state?.flags || []);
        const landed = justLanded(state?.flags || []);
        if (landed) {
          const shelf = fragmentShelf({ held, justFilled: landed, animate: inBrowser ? !reducedMotion() : true });
          notices.push({
            cls: 'notice-ody-fret ody-fragment-pop',
            html: `<div class="ody-pop-kicker">A TURNING LANDS — <b>${TURNING_NAMES[landed]}</b>, banked. Every fire after this knows it.</div>${shelf}`,
          });
        } else {
          // Defensive: the cue fired without a landed flag on state — never
          // crash the result render over it, just fall back to the old line.
          notices.push({ cls: 'notice-ody-fret', html: '<b>The prophecy turns.</b> What the dead said tonight, every fire after this one will know.' });
        }
        if (inBrowser) godPulse();
      }
    }
    // Names in the sand (I8): dead rowers are never a number. Each loss,
    // the bard names the man once — the same men, in the same order, for
    // this telling's seed (lostMan is pure, so the amphora can find them
    // again). The bench count on the band already emptied with this result.
    const lost = (Array.isArray(result?.deltas) ? result.deltas : [])
      .filter((d: any) => d.key === 'expedition' && d.amount < 0)
      .reduce((n: number, d: any) => n + Math.abs(d.amount), 0);
    if (lost > 0 && state) {
      // Clamp to the roster: a fatal over-kill card can drive expedition
      // below zero, and the dead must never outnumber the men aboard.
      const launch = crewAtLaunch(state.loadout);
      const after = Math.min(launch, Math.max(0, launch - Math.round(state.expedition ?? 0)));
      const first = Math.max(0, after - lost);
      const named: string[] = [];
      for (let k = first; k < after && k - first < 3; k++) {
        const m = lostMan(state.flavorSeed || 1, k);
        named.push(`<b>${m.name}</b>, ${m.detail}`);
      }
      if (named.length) {
        const count = lost === 1 ? 'one short' : lost === 2 ? 'two short' : `${lost} short`;
        notices.push({ cls: 'notice-ody-loss', html: `The count comes up ${count}: ${named.join('; and ')}.` });
      }
    }
    return notices.length ? { notices } : null;
  },
  // Every ending is told at the fire (I7): the hearth scene closes the
  // telling — the cup set down for a banked ending, the ember guttering to
  // a cold hearth when the sea or the despair takes the run — and the
  // lexicon speaks its one word (dawn birds for Ithaca, the gutter for a
  // death; kleos already sang at the Hall; the banked keep their quiet).
  endingExtras(_summary, state) {
    const key = state.ending?.key ?? state.path;
    const result = state.ending?.result ?? null;
    const cue = endingCue(key, result);
    if (cue) speak(cue as any);
    const dead = key === 'wrath' || key === 'burnout' || (key === 'nostos' && result === 'failure');
    const banked = key === 'lotus' || key === 'circe' || key === 'calypso';
    const scene = dead
      ? `<span class="fig fig-ember">${ember()}</span><span class="fig fig-fire">${coldHearth()}</span>`
      : banked
        ? `<span class="fig fig-fire">${fire()}</span><span class="fig fig-cup">${cup('down')}</span>`
        : `<span class="fig fig-fire">${fire()}</span><span class="fig fig-cup">${cup(cupLevelFor(state.act || 3))}</span>`;
    // px-still mirrors the in-game reduced-motion toggle (ADR-0001:
    // first-class under BOTH prefs; CSS media queries can't see this one) —
    // the ember renders already guttered, the fire holds its first frame.
    const still = reducedMotion() ? ' px-still' : '';
    // Replay legibility slice 3 (REPLAY-LEGIBILITY-PLAN.md, ADR-0002): the
    // run-end progress ledger — the shelf with HONEST EMPTY SLOTS, at the
    // exact moment the replay decision is made. Reuses shelf.ts whole (the
    // same helpers slice 2's mid-run pop uses) — STATIC here (animate:
    // false; the mid-run pop already owns the fill motion, Q5a's floor is
    // read, not re-performed). Honest floor, never teased: the copy never
    // promises what lies past the third turning, only that the third is
    // reachable and how.
    const held = heldTurnings(state.flags || []);
    const landed = justLanded(state.flags || []);
    const shelf = fragmentShelf({ held, justFilled: landed, animate: false });
    const lead = landed
      ? `<div class="ody-ledger-lead">You carried home ${TURNING_NAMES[landed]}.</div>`
      : '';
    const countLine = `<div class="ody-ledger-count">${held.count} of 3 turnings held.</div>`;
    const floorText = held.count === 3
      ? 'All three turnings — the prophecy is sung end to end.'
      : held.count === 0
        ? 'Three turnings wait in the dark. You carry none of them yet.'
        : 'The third only reveals itself to a bard who already holds the other two.';
    const floorLine = `<div class="ody-ledger-floor">${floorText}</div>`;
    const ledger = { cls: 'ody-ledger', html: `${lead}${shelf}${countLine}${floorLine}` };
    return { lines: [{ cls: 'ending-scene' + (dead ? ' ending-gutter' : '') + still, html: scene }, ledger], lpNote: '' };
  },
  // The trophy shelf (pass 2 of the player-experience series): the shell's
  // Trophy Room was rendering "0/0 collected" for this pack. Data + ledger
  // predicates live in trophies.ts; invariants in test/odyssey-trophies.
  trophies: ODYSSEY_TROPHIES,
  trophySpecials: ODYSSEY_TROPHY_SPECIALS,
  // The cash-outs are BANKED tellings, not defeats: the verdict ribbon and
  // the history rows say so (told endings, never game-over screens).
  failLabels: {
    wrath: 'The sea answered',
    lotus: 'Banked at the meadow',
    circe: 'Banked at the soft year',
    calypso: 'Banked at the island',
    burnout: 'The rowing ended',
  },
  loadoutPicker: {
    head: 'Where do you sing tonight?',
    sub: 'Four fires want the same story told four ways. The crowd shapes the telling.',
  },
};
