// The Odyssey — the bard's presentation frame (the Presenter): titles, act
// intros, the crossroads copy, endings (the hollow win visible from the first
// success), the landmark set-piece framing, the boon chips, and the Hall's
// three doors. Every string here is held to the taste floor by the
// presenterCopy lint rail (tools/lint-content.mjs).

import type { Pack, RunState } from '../../types.js';

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
  actIntro: {
    1: {
      name: 'The Sack and the Sea',
      text: 'Twelve ships out of Troy, friends — riding low, heavy with bronze and with men who had lived, every rower pulling for a wife who had learned to run a farm without him. And listen how the water was, that first week: easy, foam like combed wool, the kind of sea that makes a captain generous at supper. That is the sea’s oldest trick. It shows you your harbour in your mind’s eye. Then it asks your name.',
    },
    2: {
      name: 'Witches and the Dead',
      text: 'Throw on a branch; the tale goes narrow here. The islands stop being places a chart would admit to, and the dangers stop being weather. What is left of the fleet sails into waters where the right word matters more than the strong arm — and where the wrong word is very, very easy to say.',
    },
    3: {
      name: 'The Narrow Way',
      text: 'Now the fire burns low, friends, and I will sing softer, because the last sea is a corridor with teeth on both walls, and beyond it — home, wearing a stranger’s face. Everything he still has fits in one hull. Everything he wants is one island further than the sea would like.',
    },
  },
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
  // Landmark framing: the ceremonial banner above the dealt card. The gold
  // fret is the gods’ border (odyssey.css styles .sp-ody); the deep gets
  // its hush (.sp-ody-deep). One full-screen beat per landmark (key).
  setPiece(state, ev) {
    if (!(ev.tags || []).includes('landmark')) return null;
    if (ev.id.startsWith('ody_cyclops')) {
      return { banner: 'THE CYCLOPS', sub: 'The bard sets down his cup. The fire leans in.', cls: 'sp-ody', key: 'cyclops' };
    }
    if (ev.id === 'ody_underworld' || ev.id === 'ody_tiresias') {
      return { banner: 'THE UNDERWORLD', sub: 'The fire burns low here. That is on purpose.', cls: 'sp-ody sp-ody-deep', key: 'underworld' };
    }
    if (ev.id.startsWith('ody_hall')) {
      return { banner: 'THE HALL OF SUITORS', sub: 'One door left — the one with your name on it.', cls: 'sp-ody', key: 'hall' };
    }
    return null;
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
  },
  // Run end banks tonight's turning (summarize().fragment) into the pack's
  // namespace on the shell's meta save. Union, never count — knowledge does
  // not stack.
  recordMeta(meta, summary) {
    if (!summary?.fragment) return;
    meta.odyssey = meta.odyssey || {};
    const frags: string[] = meta.odyssey.fragments || [];
    if (!frags.includes(summary.fragment)) frags.push(summary.fragment);
    meta.odyssey.fragments = frags;
    if (summary.trueVictory) meta.odyssey.oarRoad = true;
  },
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
