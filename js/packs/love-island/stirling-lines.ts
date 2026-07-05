// Stirling — the voiceover's line buckets (ADR-0008). Pure data: every line
// obeys VOICE.md register 1 (the Narrator — a stand-up doing bits over the
// footage, punchline not murmur, ≤1 “!”, spent on mock outrage only). The
// selection engine that consumes these lives in plugins/stirling.ts; the
// deal-time forecast lines are read by the presenter's overlay channel.
//
// Two families, per the ADR:
//   · BEAT lines — authored, guaranteed at key beats (forecast, verdict,
//     bombshell, Casa, the encounter moment). High priority.
//   · REACTION pools — templated, keyed to tier and tags, opportunistic and
//     rate-limited so he lands rather than nags.
// A line may carry a `stance` — the light player-stance colouring (rooting /
// clocking / mess); stanced lines only fire when the derived stance matches.

export interface BarkDef {
  id: string;
  text: string;                 // may use the pack's {tokens}
  priority?: number;            // higher pool wins among eligible (default 0)
  stance?: 'rooting' | 'clocking' | 'mess';
}

// ---------- Reaction pools (opportunistic, tier × tags) ----------

export const REACT_INCREDIBLE: BarkDef[] = [
  { id: 'ri_titles', text: 'Oh, that’s going in the opening titles. That’s going in MY opening titles.' },
  { id: 'ri_gallery', text: 'Somewhere in the gallery, a producer just kissed a monitor.' },
  { id: 'ri_topfive', text: 'Ten years narrating this programme and that’s a top-five move. Don’t tell the other four.' },
  { id: 'ri_hummus', text: 'The villa will be talking about that for days. The villa talks about hummus for days — but still.' },
  { id: 'ri_othershow', text: 'That went so well I checked we hadn’t cut to a different show.' },
  { id: 'ri_textbook', text: 'Textbook. Which textbook, no idea. A banned one.' },
  { id: 'ri_root', stance: 'rooting', text: 'Go on, that’s my Islander. I’m allowed favourites; sue the booth.' },
  { id: 'ri_clock', stance: 'clocking', text: 'Clocked, logged, and honestly? Respect. The booth sees the game, and the booth approves.' },
];

export const REACT_BAD: BarkDef[] = [
  { id: 'rb_mate', text: 'Mate. MATE.' },
  { id: 'rb_seenall', text: 'I’ve seen it all on this show. I hadn’t seen that. I’ve now seen it all again.' },
  { id: 'rb_seminar', text: 'Somewhere, a media-training seminar just added a slide.' },
  { id: 'rb_national', text: 'Good news: it’s only telly. Bad news: it’s only NATIONAL telly.' },
  { id: 'rb_recap', text: 'That’s the kind of moment the recap voice slows down for. Hello.' },
  { id: 'rb_bold', text: 'Bold. Not good — bold.' },
  { id: 'rb_mess', stance: 'mess', text: 'You’re a walking season arc, you know that? Don’t change. Do change. Don’t.' },
];

// Tag-keyed flavour pools — the writers' room mining the moment's genre.
export const REACT_TAGGED: Record<string, { incredible: BarkDef[]; bad: BarkDef[] }> = {
  flirt: {
    incredible: [
      { id: 'tf_air', text: 'Two hours of eye contact and a shared opinion about airports. In here, that’s at least an engagement.' },
      { id: 'tf_licence', text: 'Chemistry like that needs a licence. And a chaperone. And an ad break.' },
      { id: 'tf_drone', text: 'The drone has gone in for a closer look. The DRONE is invested.' },
    ],
    bad: [
      { id: 'tf_line', text: 'That chat-up line has been to two other villas. It didn’t work there either.' },
      { id: 'tf_road', text: 'Smooth… in the sense of a road, before they finish it.' },
      { id: 'tf_pool', text: 'The pool heard that and did a little splash of sympathy.' },
    ],
  },
  drama: {
    incredible: [
      { id: 'td_sponsor', text: 'A row that good deserves its own sponsor.' },
      { id: 'td_lunch', text: 'Casually detonating the lawn before lunch. Scenes.' },
      { id: 'td_schedule', text: 'And THAT is why nothing gets scheduled opposite this show.' },
    ],
    bad: [
      { id: 'td_flyers', text: 'There’s starting drama, and there’s handing out flyers for it.' },
      { id: 'td_nowinner', text: 'That argument had no winner. It barely had participants.' },
      { id: 'td_beef', text: 'The beef arrived overcooked and somehow got worse.' },
    ],
  },
  challenge: {
    incredible: [
      { id: 'tc_aprons', text: 'A challenge performance so good it’s suspicious. Someone check the aprons.' },
      { id: 'tc_claim', text: 'Won the challenge, won the lawn, won a small legal claim on my heart.' },
    ],
    bad: [
      { id: 'tc_budget', text: 'The challenge budget was forty quid, and it still deserved better than that.' },
      { id: 'tc_pie', text: 'Somewhere, a props department weeps into a custard pie.' },
    ],
  },
  strategy: {
    incredible: [
      { id: 'ts_chess', text: 'Chess. On a lawn. In swimwear. Chess.' },
      { id: 'ts_gcse', text: 'That was so calculated the maths GCSE board wants a word.' },
    ],
    bad: [
      { id: 'ts_part', text: 'The plan had one moving part, and it moved the wrong way.' },
      { id: 'ts_drill', text: 'Scheming with the subtlety of a fire drill.' },
    ],
  },
  loyal: {
    incredible: [
      { id: 'tl_frame', text: 'Loyal. Actually loyal. On THIS programme. Somebody frame it.' },
      { id: 'tl_nans', text: 'The nation’s nans just nodded as one. That’s the whole vote, that.' },
    ],
    bad: [
      { id: 'tl_admin', text: 'Loyalty’s lovely, but that was loyalty with terrible admin.' },
    ],
  },
};

// ---------- Beat lines (guaranteed, authored, priority) ----------

// Verdicts — he EXPLAINS the ceremony result (the legibility half of the job).
// Conditions are matched by the selection engine off the ceremony readings.
export const BEAT_VERDICT: Record<string, BarkDef[]> = {
  held: [
    { id: 'vh_lifting', text: 'Held. The Bond did the lifting — all those chats on the wobbly lounger, paying out at last.', priority: 10 },
    { id: 'vh_boring', text: 'Chosen, first, by name. That’s what the boring homework chats buy: ceremony insurance.', priority: 10 },
    { id: 'vh_hydrate', text: 'Safe. The couple carried it. Take the win, say nothing smug, hydrate.', priority: 10 },
  ],
  rescued: [
    { id: 'vr_village', text: 'Saved — not by your couple, by the room. The nation raised you like a village.', priority: 10 },
    { id: 'vr_bailout', text: 'That wasn’t romance, that was a bailout. Take it; bailouts spend the same.', priority: 10 },
    { id: 'vr_feeds', text: 'Rescued at the fire. The Bond didn’t show up; your public did. Remember who feeds you.', priority: 10 },
  ],
  dumped: [
    { id: 'vd_maths', text: 'No name, no seat, taxi. The maths was the maths: the Bond wasn’t there, and the vote never arrived.', priority: 10 },
    { id: 'vd_legends', text: 'Dumped. Brutal. For what it’s worth, exit interviews are where legends start. Usually. Sometimes.', priority: 10 },
  ],
  // The cash-out landed and the check passed with the poach defused.
  held_secret: [
    { id: 'vs_lifting', text: 'Held — and let the record show the secret did the heavy lifting. Scandal: also a love language.', priority: 10 },
    { id: 'vs_detonate', text: 'Safe. You didn’t plead your case; you detonated theirs. The firepit approves. Nervously.', priority: 10 },
  ],
};

// Other guaranteed beats, keyed by trigger.
export const BEAT_REACT: Record<string, BarkDef[]> = {
  casa_held: [
    { id: 'ch_insurance', text: 'Through Casa with the couple intact. Do you know how rare that is? Insurance doesn’t cover Casa.', priority: 10 },
    { id: 'ch_walked', text: 'They walked back in alone. ALONE. Somebody check the format still works.', priority: 10 },
  ],
  casa_betrayed: [
    { id: 'cb_hand', text: 'They walked in holding a HAND. A whole other hand. I need to sit down, and I narrate sitting down.', priority: 10 },
    { id: 'cb_postcode', text: 'Three days, one postcode apart, and the couple didn’t survive the commute. This programme.', priority: 10 },
  ],
  bombshell: [
    { id: 'bb_sunbed', text: 'A bombshell. Because the villa was one sunbed short of peaceful.', priority: 10 },
    { id: 'bb_deposit', text: 'New arrival, walking in like the deposit’s already paid. Watch your couple. Watch your drink.', priority: 10 },
  ],
  secret: [
    { id: 'sx_interest', text: 'You KNOW things now. Knowledge in this villa compounds like interest. Spend it wisely… or spectacularly.', priority: 10 },
    { id: 'sx_currency', text: 'A secret, in the villa economy, is a fifty-pound note nobody’s broken yet. Careful with your pockets.', priority: 10 },
  ],
  enc_pact: [
    { id: 'ep_trade', text: 'A pact with your rival. A PACT. This series has trade agreements now.', priority: 10 },
    { id: 'ep_lawyers', text: 'Non-aggression, agreed on a terrace, no lawyers present. It’ll hold right up until it doesn’t.', priority: 10 },
  ],
  enc_war: [
    { id: 'ew_marsh', text: 'War declared, politely, over marshmallows. This show, honestly.', priority: 10 },
    { id: 'ew_villain', text: 'Every season needs a villain arc. Yours just introduced itself and poured you a drink first.', priority: 10 },
  ],
  wobble: [
    { id: 'wb_hut', text: 'A wobble. Happens to the best — and the best usually cry in the nice Hut, so you’re on track.', priority: 10 },
  ],
  wobble_break: [
    { id: 'wbk_suitcase', text: 'Dawn, a suitcase, and the long stare. I’ve narrated a hundred of these. The ones who ask for help stay. The ones who say “I’m fine” pack.', priority: 10 },
    { id: 'wbk_quiet', text: 'No jokes for a second. That gate is real, and Final Week has no patience for a loud head. Whatever keeps you in the game — do that one.', priority: 10 },
  ],
  steal_survived: [
    { id: 'st_held', text: 'Sixty seconds of pure lawn maths, and your couple came out the other side. Exhale.', priority: 10 },
  ],
  steal_lost: [
    { id: 'st_gone', text: 'Stolen. Live. At a firepit. There are heists with more warning. Deep breath — the game’s not done with you.', priority: 10 },
  ],
};

// ---------- Deal-time forecast lines (pure, presenter-read) ----------
// The ceremony line-up (ADR-0008's truthfulness constraint): these speak the
// real `Bond ≥ floor OR Public ≥ floor` outlook — comedy in the delivery,
// never in the odds. Families are picked by the coupling plugin's outlook.

export const FORECAST: Record<string, BarkDef[]> = {
  // The held-card telegraph (R4): the lineup where you're carrying the
  // Rival's live secret — the cash-out is one beat away and he knows it.
  dynamite: [
    { id: 'fc_dyn_1', text: 'Our Islander walks to the firepit sitting on dynamite, folks. Whether it goes off before the names are read — that’s tonight’s episode.', priority: 10 },
    { id: 'fc_dyn_2', text: 'A note from the booth: a secret is only currency while it’s unspent. The firepit takes exact change.', priority: 10 },
  ],
  bondSafe: [
    { id: 'fb_seatbelt', text: 'Recoupling tonight. That Bond of yours is wearing a seatbelt. Should be fine. Should.' },
    { id: 'fb_wrong', text: 'Forecast: your couple holds. I say that with the confidence of a man who’s been wrong twice this series.' },
    { id: 'fb_armour', text: 'Tonight’s ceremony, and yours is one of the boring couples. Tonight, boring is armour.' },
  ],
  publicSafe: [
    { id: 'fp_mug', text: 'The Bond’s wobbling — but the nation’s got your name on a mug. Someone will say it at that fire.' },
    { id: 'fp_sofas', text: 'Between you and me: it’s not your couple saving you tonight. It’s nine million sofas.' },
    { id: 'fp_plan', text: 'Forecast: shaky indoors, popular outdoors. In here, that counts as a plan.' },
  ],
  danger: [
    { id: 'fd_look', text: 'Honest forecast? Bond’s shaky, vote’s shaky, and the firepit’s got that look. Big night needed, pal.' },
    { id: 'fd_fence', text: 'Squeaky-bum time. The Bond won’t carry you, and the vote is sitting on the fence it built.' },
    { id: 'fd_taxi', text: 'I’ve seen Islanders survive worse. I’ve also seen the taxi. Big speech, yeah?' },
  ],
  single: [
    { id: 'fs_maths', text: 'Single, at a ceremony, in the choosing season. The maths is simple and the maths is rude: be picked, or be packed.' },
  ],
};

// Scene-stamp openers for the other watched beats (deal-time, pure).
export const SCENE_STAMP: Record<string, BarkDef[]> = {
  steal: [
    { id: 'ss_division', text: 'Sixty seconds, one choice, and every couple on that lawn doing long division. Good luck.' },
  ],
  movienight: [
    { id: 'sm_genre', text: 'Movie Night. The villa’s favourite genre: documentary horror.' },
    { id: 'sm_popcorn', text: 'A cinema screen, on a lawn, full of receipts. Somebody pass the popcorn and a lawyer.' },
  ],
  finale: [
    { id: 'sf_thumb', text: 'The Final. Fairy lights, one envelope, and a nation with its thumb hovering. Enjoy the anxiety — you’ve earned it.' },
  ],
  parents: [
    { id: 'sp_watched', text: 'The families are in. They’ve seen every episode, including the ones you’d rather they hadn’t. Smile.' },
  ],
};

// ---------- The tutor pool (R2: Stirling teaches the villa) ----------
// First-season-only deal-time lines (state.firstRun — stamped by the shell on
// a player's first real run, never set in sims/goldens). One teach per format
// beat, diegetic: he onboards you the way the voiceover onboards new viewers.
// The three lineup lines are per-outlook so the honest-forecast contract
// (ADR-0008) holds even while he's teaching.
export const TUTOR: Record<string, BarkDef[]> = {
  arrival: [{ id: 'tu_arrival', text: 'New to the villa? Three rules: couple up, stay coupled, and never trust a quiet producer. The nation’s watching from sofa one — and the nation gets a vote. Several, actually.', priority: 10 }],
  daybed: [{ id: 'tu_daybed', text: 'The daybed shelf, for the newcomers: Graft in, reputation out. An Angle is who the edit says you are — and the edit is rarely wrong and never kind.', priority: 10 }],
  wobble: [{ id: 'tu_wobble', text: 'See the spiral up top, babes? That’s your head. Top it out and you walk — no envelope, no slow-mo montage. Rest is a move. The pros nap.', priority: 10 }],
  temptation: [{ id: 'tu_tempt', text: 'A word for the new viewers: a head-turn dents the Bond, it doesn’t break the couple. Officially. The duvets keep their own records.', priority: 10 }],
  lineup_bondSafe: [{ id: 'tu_line_bond', text: 'Recoupling rules, quickly: the Bond keeps you, or the nation does. Tonight your Bond’s doing the heavy lifting — as it should.', priority: 10 }],
  lineup_publicSafe: [{ id: 'tu_line_public', text: 'Recoupling rules, quickly: Bond or nation, either keeps you in. Tonight, babes, it’s the nation carrying you. Wave.', priority: 10 }],
  lineup_danger: [{ id: 'tu_line_danger', text: 'Recoupling rules, quickly: the Bond holds you or the nation saves you. Tonight neither is promising. I’d stand near the fire — it’s warmer.', priority: 10 }],
  bombshell: [{ id: 'tu_bomb', text: 'First bombshell of your Season. They look like a person; they function as a countdown. It goes off at the next recoupling.', priority: 10 }],
  casa: [{ id: 'tu_casa', text: 'Casa Amor, for the uninitiated: the villa splits, loyalty gets audited, and everything comes home on a postcard. Pack honesty. Or don’t — it’s telly either way.', priority: 10 }],
  movienight: [{ id: 'tu_movie', text: 'Movie Night, new viewers: everything anyone did, in HD, with sound. Footage outranks feelings. Enjoy.', priority: 10 }],
  gossip: [{ id: 'tu_gossip', text: 'Intel, babes: gather it in the quiet chats, hold three pieces at most, and spend it at a ceremony — that’s where words become results.', priority: 10 }],
  exclusive: [{ id: 'tu_excl', text: 'Going exclusive: the Bond locks in higher, the temptations back off, and the drop — should it come — doubles. This show is a mortgage with cameras.', priority: 10 }],
  finale: [{ id: 'tu_final', text: 'The Final. Your declared Intention gets judged, the vote peaks, and the envelope has no memory of your excuses. Good luck, babes. Genuinely.', priority: 10 }],
};
