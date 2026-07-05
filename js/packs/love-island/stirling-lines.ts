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
  { id: 'ri_ratings', text: 'Put THAT in the trailer. Twice.' },
  { id: 'ri_slowmo', text: 'They’ll slow that down and put strings under it. You’ve done a strings moment. On a Tuesday.' },
  { id: 'ri_apology', text: 'I came in today ready to mock. I have nothing. The booth apologises for the interruption to service.' },
  { id: 'ri_agent', text: 'Somewhere out there, an agent just dropped her coffee.' },
  { id: 'ri_nan', text: 'Somewhere a nan just phoned another nan. That’s how you win this show, by the way. Nans.' },
  { id: 'ri_mess', stance: 'mess', text: 'Chaos AND competence? Pick a lane. Actually don’t — the ratings are lovely.' },
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
  { id: 'rb_ad', text: 'We’ll be right back after this break, because I need a minute.' },
  { id: 'rb_signal', text: 'I’d call that a mixed signal, but there was nothing mixed about it. One signal. Wrong one.' },
  { id: 'rb_lounger', text: 'A scene like that, and the wobbly lounger STILL isn’t the most unstable thing on this lawn.' },
  { id: 'rb_hut2', text: 'The Beach Hut has heard worse. The Beach Hut would like it on record: not by much.' },
  { id: 'rb_physio', text: 'You can pull a muscle reaching like that. See the physio.' },
  { id: 'rb_clock', stance: 'clocking', text: 'I see the plan. I saw it. Everyone saw it. Visibility was, in fact, the problem.' },
  { id: 'rb_mess', stance: 'mess', text: 'You’re a walking season arc, you know that? Don’t change. Do change. Don’t.' },
];

// Tag-keyed flavour pools — the writers' room mining the moment's genre.
export const REACT_TAGGED: Record<string, { incredible: BarkDef[]; bad: BarkDef[] }> = {
  flirt: {
    incredible: [
      { id: 'tf_air', text: 'Two hours of eye contact and a shared opinion about airports. In here, that’s at least an engagement.' },
      { id: 'tf_licence', text: 'Chemistry like that needs a licence. And a chaperone. And an ad break.' },
      { id: 'tf_weather', text: 'The temperature on that terrace just did something the weather can’t explain.' },
      { id: 'tf_names', text: 'They’ve started saying each other’s names at the START of sentences. That’s basically a deposit on a flat.' },
      { id: 'tf_drone', text: 'The drone has gone in for a closer look. The DRONE is invested.' },
    ],
    bad: [
      { id: 'tf_line', text: 'That chat-up line has been to two other villas. It didn’t work there either.' },
      { id: 'tf_road', text: 'Smooth… in the sense of a road, before they finish it.' },
      { id: 'tf_manual', text: 'Flirting is supposed to be jazz. That was a man reading the manual for jazz.' },
      { id: 'tf_lifeguard', text: 'There’s no lifeguard for that kind of drowning, babes.' },
      { id: 'tf_pool', text: 'The pool heard that and did a little splash of sympathy.' },
    ],
  },
  drama: {
    incredible: [
      { id: 'td_sponsor', text: 'A row that good deserves its own sponsor.' },
      { id: 'td_lunch', text: 'Casually detonating the lawn before lunch. Scenes.' },
      { id: 'td_interval', text: 'Proper theatre, that. There’ll be an interval and everything.' },
      { id: 'td_landline', text: 'That kicked off so hard my mum texted ME about it. She has a landline.' },
      { id: 'td_schedule', text: 'And THAT is why nothing gets scheduled opposite this show.' },
    ],
    bad: [
      { id: 'td_flyers', text: 'There’s starting drama, and there’s handing out flyers for it.' },
      { id: 'td_nowinner', text: 'That argument had no winner. It barely had participants.' },
      { id: 'td_snacks', text: 'You could see that row coming from the beach. Some of us did. With snacks.' },
      { id: 'td_petrol', text: 'A row that ran out of petrol halfway and had to be pushed home. Sad, really.' },
      { id: 'td_beef', text: 'The beef arrived overcooked and somehow got worse.' },
    ],
  },
  challenge: {
    incredible: [
      { id: 'tc_aprons', text: 'A challenge performance so good it’s suspicious. Someone check the aprons.' },
      { id: 'tc_podium', text: 'If snog-adjacent obstacle courses were Olympic — give it time — that’s a podium.' },
      { id: 'tc_props', text: 'Forty quid of props, finally respected. The props department is crying. Good tears.' },
      { id: 'tc_claim', text: 'Won the challenge, won the lawn, won a small legal claim on my heart.' },
    ],
    bad: [
      { id: 'tc_budget', text: 'The challenge budget was forty quid, and it still deserved better than that.' },
      { id: 'tc_safety', text: 'Health and safety signed off on the challenge. They did not sign off on that.' },
      { id: 'tc_clap', text: 'The scoreboard says last. The slow clap says beloved. Take the clap.' },
      { id: 'tc_pie', text: 'Somewhere, a props department weeps into a custard pie.' },
    ],
  },
  strategy: {
    incredible: [
      { id: 'ts_chess', text: 'Chess. On a lawn. In swimwear. Chess.' },
      { id: 'ts_clipboard', text: 'I’m starting to think you’ve done this before. Somebody check their bag for a clipboard.' },
      { id: 'ts_folder', text: 'Cold, clean, documented. The gallery just made you a folder.' },
      { id: 'ts_gcse', text: 'That was so calculated the maths GCSE board wants a word.' },
    ],
    bad: [
      { id: 'ts_part', text: 'The plan had one moving part, and it moved the wrong way.' },
      { id: 'ts_step2', text: 'A five-step plan with step two missing. Bold architecture.' },
      { id: 'ts_neck', text: 'Your poker face is lovely. It’s the poker NECK that gave it away.' },
      { id: 'ts_drill', text: 'Scheming with the subtlety of a fire drill.' },
    ],
  },
  loyal: {
    incredible: [
      { id: 'tl_frame', text: 'Loyal. Actually loyal. On THIS programme. Somebody frame it.' },
      { id: 'tl_postcode', text: 'Loyalty with follow-through. In this postcode, that’s a superpower.' },
      { id: 'tl_frame2', text: 'Faithful, on camera, under offer. Print it and hang it in the Hideaway.' },
      { id: 'tl_nans', text: 'The nation’s nans just nodded as one. That’s the whole vote, that.' },
    ],
    bad: [
      { id: 'tl_admin', text: 'Loyalty’s lovely, but that was loyalty with terrible admin.' },      { id: 'tl_mouth', text: 'The heart was in the right place. The mouth was in a different postcode.' },
      { id: 'tl_fault', text: 'Loyal to a fault. The fault was load-bearing.' },

    ],
  },
  banter: {
    incredible: [
      { id: 'tb_uncut', text: 'That bit runs uncut tonight. The editors have downed tools out of respect.' },
      { id: 'tb_boom', text: 'Quicker than the boom mic. The sound guy is still turning.' },
      { id: 'tb_export', text: 'That joke will leave this villa and get a job in the wider economy.' },
    ],
    bad: [
      { id: 'tb_flat', text: 'The joke arrived, looked around, and left without buying anything.' },
      { id: 'tb_filter', text: 'Silence — and then the pool filter laughed. Rough crowd.' },
      { id: 'tb_second', text: 'Never do the bit a second time. The second time is a hostage situation.' },
    ],
  },
  camera: {
    incredible: [
      { id: 'tcam_lens', text: 'Found the lens like it owed you money. Star behaviour, that.' },
      { id: 'tcam_bus', text: 'That’s the promo shot. That’s the one on the side of the bus.' },
      { id: 'tcam_thumbs', text: 'Nine million thumbs just paused over nine million phones. That’s the job, babes.' },
    ],
    bad: [
      { id: 'tcam_blink', text: 'Blinked in the promo take. Immortal, now, the blink.' },
      { id: 'tcam_three', text: 'Playing to camera three. Camera three is off, pal. Has been all week.' },
      { id: 'tcam_smell', text: 'The lens can smell wanting-it. It’s a strong smell. Open a window.' },
    ],
  },
  date: {
    incredible: [
      { id: 'tdate_maths', text: 'They split a dessert without doing the maths on it. That’s trust, that.' },
      { id: 'tdate_quiet', text: 'A comfortable silence, on a first date, on television. Frame it.' },
    ],
    bad: [
      { id: 'tdate_job', text: 'Forty minutes on his job. There are documentaries about pipe fitting with better pacing.' },
      { id: 'tdate_order', text: 'Ordered for them. ORDERED for them. The nation just did one sharp intake.' },
    ],
  },
  rest: {
    incredible: [
      { id: 'tr_radical', text: 'A nap. A radical act, in here. The booth logs it as content lost and respects it anyway.' },
      { id: 'tr_glow', text: 'Twelve hours of absolutely nothing and they’ve come back luminous. Furious about it, personally.' },
    ],
    bad: [
      { id: 'tr_towel', text: 'A rest day spent watching everyone else’s storyline from a towel. That’s not rest, that’s research with sunburn.' },
      { id: 'tr_pool', text: 'Hiding by the pool works better when the pool isn’t on television.' },
    ],
  },
  chat: {
    incredible: [
      { id: 'tch_kettle', text: 'The kettle chats are where this show actually happens. That one moved the Season.' },
      { id: 'tch_care', text: 'A conversation handled with actual care. On this lawn. I’ll allow it — the format won’t miss one.' },
    ],
    bad: [
      { id: 'tch_weather', text: 'A chat about the weather. In a villa. Where the weather is the same. Every day.' },
      { id: 'tch_scenic', text: 'That conversation needed an exit and took the scenic route.' },
    ],
  },
  code: {
    incredible: [
      { id: 'tco_court', text: 'The code, upheld, in open court. The dressing room will remember this term.' },
      { id: 'tco_bloc', text: 'That’s how blocs form, folks. Quietly. Over towel-folding.' },
    ],
    bad: [
      { id: 'tco_breach', text: 'A code breach with witnesses. The group chat has already ruled.' },
      { id: 'tco_technically', text: 'Technically within the code. TECHNICALLY is doing a lot of lifting there.' },
    ],
  },
  temptation: {
    incredible: [
      { id: 'tt_gym', text: 'Flirted right up to the line, toes ON the line, and home by eleven. Gymnastics.' },
      { id: 'tt_roundtrip', text: 'Head turned, head returned. The round trip is the story, babes.' },
    ],
    bad: [
      { id: 'tt_footage', text: 'Nothing happened. The footage of nothing happening is forty minutes long.' },
      { id: 'tt_thursday', text: 'That’ll be a Movie Night clip. They’re all Movie Night clips. Thursday is coming.' },
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
    { id: 'vh_nan', text: 'Held. Not a twitch in the choosing. Somewhere, your nan exhales.', priority: 10 },
    { id: 'vh_middle', text: 'Held, comfortably. The couples who do the boring middle bits survive the loud end bits. Write that down, villa.', priority: 10 },
  ],
  rescued: [
    { id: 'vr_village', text: 'Saved — not by your couple, by the room. The nation raised you like a village.', priority: 10 },
    { id: 'vr_bailout', text: 'That wasn’t romance, that was a bailout. Take it; bailouts spend the same.', priority: 10 },
    { id: 'vr_feeds', text: 'Rescued at the fire. The Bond didn’t show up; your public did. Remember who feeds you.', priority: 10 },
    { id: 'vr_sofas', text: 'The Bond flinched. Nine million sofas didn’t. Send the sofas a card.', priority: 10 },
  ],
  dumped: [
    { id: 'vd_maths', text: 'No name, no seat, taxi. The maths was the maths: the Bond wasn’t there, and the vote never arrived.', priority: 10 },
    { id: 'vd_legends', text: 'Dumped. Brutal. For what it’s worth, exit interviews are where legends start. Usually. Sometimes.', priority: 10 },
    { id: 'vd_shape', text: 'The firepit went quiet in the wrong shape, and you knew before I did. Head high. The car has snacks.', priority: 10 },
    { id: 'vd_book', text: 'Dumped, by the oldest rule in the book: nobody said the name. The book is rude. It’s also the book.', priority: 10 },
  ],
  // The cash-out landed and the check passed with the poach defused.
  held_secret: [
    { id: 'vs_lifting', text: 'Held — and let the record show the secret did the heavy lifting. Scandal: also a love language.', priority: 10 },
    { id: 'vs_detonate', text: 'Safe. You didn’t plead your case; you detonated theirs. The firepit approves. Nervously.', priority: 10 },
    { id: 'vs_journalism', text: 'Held — via what I can only describe as investigative journalism with a tan.', priority: 10 },
  ],
};

// Other guaranteed beats, keyed by trigger.
export const BEAT_REACT: Record<string, BarkDef[]> = {
  casa_held: [
    { id: 'ch_insurance', text: 'Through Casa with the couple intact. Do you know how rare that is? Insurance doesn’t cover Casa.', priority: 10 },
    { id: 'ch_walked', text: 'They walked back in alone. ALONE. Somebody check the format still works.', priority: 10 },
    { id: 'ch_plaque', text: 'Through Casa, couple intact. Couples that survive Casa get a little plaque in my heart. Metaphorical. Budget.', priority: 10 },
  ],
  casa_betrayed: [
    { id: 'cb_hand', text: 'They walked in holding a HAND. A whole other hand. I need to sit down, and I narrate sitting down.', priority: 10 },
    { id: 'cb_postcode', text: 'Three days, one postcode apart, and the couple didn’t survive the commute. This programme.', priority: 10 },
    { id: 'cb_comeback', text: 'Betrayed at Casa. The oldest cut on this show, and it’s still sharp. So is the comeback arc — ask the nation.', priority: 10 },
  ],
  bombshell: [
    { id: 'bb_sunbed', text: 'A bombshell. Because the villa was one sunbed short of peaceful.', priority: 10 },
    { id: 'bb_deposit', text: 'New arrival, walking in like the deposit’s already paid. Watch your couple. Watch your drink.', priority: 10 },
    { id: 'bb_customs', text: 'A new arrival with a suitcase full of consequences. Customs should have stopped them.', priority: 10 },
    { id: 'bb_golden', text: 'They walked in at golden hour. Scheduled. SCHEDULED. Production has no shame and excellent lighting.', priority: 10 },
  ],
  secret: [
    { id: 'sx_interest', text: 'You KNOW things now. Knowledge in this villa compounds like interest. Spend it wisely… or spectacularly.', priority: 10 },
    { id: 'sx_currency', text: 'A secret, in the villa economy, is a fifty-pound note nobody’s broken yet. Careful with your pockets.', priority: 10 },
    { id: 'sx_library', text: 'Another one for the collection. You’re not an Islander any more — you’re a lending library of leverage.', priority: 10 },
  ],
  enc_pact: [
    { id: 'ep_trade', text: 'A pact with your rival. A PACT. This series has trade agreements now.', priority: 10 },
    { id: 'ep_lawyers', text: 'Non-aggression, agreed on a terrace, no lawyers present. It’ll hold right up until it doesn’t.', priority: 10 },
    { id: 'ep_un', text: 'A ceasefire in swimwear. The UN could learn from this lawn. The UN could not survive this lawn.', priority: 10 },
  ],
  enc_war: [
    { id: 'ew_marsh', text: 'War declared, politely, over marshmallows. This show, honestly.', priority: 10 },
    { id: 'ew_villain', text: 'Every season needs a villain arc. Yours just introduced itself and poured you a drink first.', priority: 10 },
    { id: 'ew_diary', text: 'A feud with a start date. Put it in the diary — the diary is the show.', priority: 10 },
  ],
  wobble: [
    { id: 'wb_hut', text: 'A wobble. Happens to the best — and the best usually cry in the nice Hut, so you’re on track.', priority: 10 },
    { id: 'wb_human', text: 'The meter’s up because you’re a person, not a format point. Even the format knows that. Occasionally.', priority: 10 },
    { id: 'wb_medicine', text: 'Wobbles pass, babes. Kettle on, mate found, camera ignored. That’s the whole medicine.', priority: 10 },
  ],
  wobble_break: [
    { id: 'wbk_suitcase', text: 'Dawn, a suitcase, and the long stare. I’ve narrated a hundred of these. The ones who ask for help stay. The ones who say “I’m fine” pack.', priority: 10 },
    { id: 'wbk_quiet', text: 'No jokes for a second. That gate is real, and Final Week has no patience for a loud head. Whatever keeps you in the game — do that one.', priority: 10 },
  ],
  steal_survived: [
    { id: 'st_held', text: 'Sixty seconds of pure lawn maths, and your couple came out the other side. Exhale.', priority: 10 },
    { id: 'st_audit', text: 'Sixty seconds where every Bond on the lawn got audited — and yours passed. Frame the receipt.', priority: 10 },
  ],
  steal_lost: [
    { id: 'st_gone', text: 'Stolen. Live. At a firepit. There are heists with more warning. Deep breath — the game’s not done with you.', priority: 10 },
    { id: 'st_pending', text: 'Partner: stolen. Dignity: pending. The next ceremony is already on the schedule — so is your comeback.', priority: 10 },
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
    { id: 'fc_dyn_3', text: 'Everyone’s watching the couples. Nobody’s watching the pocket with the secret in it. Well — I am.', priority: 10 },
  ],
  bondSafe: [
    { id: 'fb_seatbelt', text: 'Recoupling tonight. That Bond of yours is wearing a seatbelt. Should be fine. Should.' },
    { id: 'fb_wrong', text: 'Forecast: your couple holds. I say that with the confidence of a man who’s been wrong twice this series.' },
    { id: 'fb_armour', text: 'Tonight’s ceremony, and yours is one of the boring couples. Tonight, boring is armour.' },
    { id: 'fb_homework', text: 'Ceremony tonight. You did the chats, you did the tea rounds — the Bond should answer when called. Should.' },
    { id: 'fb_calm', text: 'Tonight’s forecast: settled, with a strong couple front. I hate a quiet night. Thrilled for you, though.' },
  ],
  publicSafe: [
    { id: 'fp_mug', text: 'The Bond’s wobbling — but the nation’s got your name on a mug. Someone will say it at that fire.' },
    { id: 'fp_sofas', text: 'Between you and me: it’s not your couple saving you tonight. It’s nine million sofas.' },
    { id: 'fp_plan', text: 'Forecast: shaky indoors, popular outdoors. In here, that counts as a plan.' },
    { id: 'fp_postman', text: 'The couple’s wobbly; the country isn’t. Somewhere out there a postman is voting for you on his break.' },
    { id: 'fp_mugs', text: 'Weak Bond, strong fanbase. In ceremony maths, mugs beat hugs. Tonight, anyway.' },
  ],
  danger: [
    { id: 'fd_look', text: 'Honest forecast? Bond’s shaky, vote’s shaky, and the firepit’s got that look. Big night needed, pal.' },
    { id: 'fd_fence', text: 'Squeaky-bum time. The Bond won’t carry you, and the vote is sitting on the fence it built.' },
    { id: 'fd_taxi', text: 'I’ve seen Islanders survive worse. I’ve also seen the taxi. Big speech, yeah?' },
    { id: 'fd_booth', text: 'I’d spin this if I could, pal. The Bond’s thin, the vote’s thin — the booth recommends a very good speech.' },
    { id: 'fd_weather', text: 'Forecast: exposed, with a chance of taxi. Wear something you can leave in.' },
  ],
  single: [
    { id: 'fs_maths', text: 'Single, at a ceremony, in the choosing season. The maths is simple and the maths is rude: be picked, or be packed.' },
    { id: 'fs_option', text: 'Single at the choosing. You are, at time of broadcast, an option. Be a compelling one.' },
    { id: 'fs_banked', text: 'No couple to hide in tonight. Just you, the fire, and whatever first impressions you banked. Spend them well.' },
  ],
};

// Scene-stamp openers for the other watched beats (deal-time, pure).
export const SCENE_STAMP: Record<string, BarkDef[]> = {
  steal: [
    { id: 'ss_division', text: 'Sixty seconds, one choice, and every couple on that lawn doing long division. Good luck.' },
    { id: 'ss_meerkats', text: 'One bombshell, first pick of anyone, and every couple on the lawn sitting up like meerkats.' },
  ],
  movienight: [
    { id: 'sm_genre', text: 'Movie Night. The villa’s favourite genre: documentary horror.' },
    { id: 'sm_popcorn', text: 'A cinema screen, on a lawn, full of receipts. Somebody pass the popcorn and a lawyer.' },
    { id: 'sm_feature', text: 'No trailers tonight. Straight to the feature. The feature is you.' },
  ],
  finale: [
    { id: 'sf_thumb', text: 'The Final. Fairy lights, one envelope, and a nation with its thumb hovering. Enjoy the anxiety — you’ve earned it.' },
    { id: 'sf_dress', text: 'The villa, in evening wear. Even the wobbly lounger got polished. It’s the Final, folks.' },
    { id: 'sf_booth', text: 'Last night in the booth for me too. Whatever the envelope says — decent scenes, this Season. Decent scenes.' },
  ],
  parents: [
    { id: 'sp_watched', text: 'The families are in. They’ve seen every episode, including the ones you’d rather they hadn’t. Smile.' },
    { id: 'sp_towels', text: 'The families have landed. Beds made, innuendo banned, and somebody has hidden the heart-rate results. Wise.' },
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

// ---------- The memory pool (R9/C4a: the villa remembers) ----------
// Meta-keyed arrival lines for returning players (run.history — the shell's
// memory ledger; never set in sims, so seeded goldens never see these).
// Routed by last Season's ending; `many` outranks once you're a regular.
export const MEMORY: Record<string, BarkDef[]> = {
  dumped: [
    { id: 'mem_dumped', text: 'Back again? Last time we did this, you left in a car with your name trending. New summer, same firepit. Go on then.', priority: 10 },
    { id: 'mem_dumped2', text: 'The villa never forgets a dumping. The villa also never learns — which, returning champion of getting up again, works in your favour.', priority: 10 },
  ],
  burnout: [
    { id: 'mem_walked', text: 'Last visit ended with a suitcase and your own decision — the rare dignified exit. Good to have you back. Watch the meter this time, babes.', priority: 10 },
  ],
  success: [
    { id: 'mem_won', text: 'A champion returns. The nation remembers the envelope. The villa remembers everything else.', priority: 10 },
  ],
  any: [
    { id: 'mem_back', text: 'Back for more? The villa kept your water bottle. That’s not sweet, by the way — that’s evidence retention.', priority: 10 },
    { id: 'mem_hottub', text: 'Round two. The nation remembers the hot-tub incident even if you’ve chosen not to. Fresh start, though. Officially.', priority: 10 },
  ],
  many: [
    { id: 'mem_staff', text: 'Season five-plus, is it? At this point you’re not a contestant, you’re staff. Grab a lanyard, show the new ones where the Hut is.', priority: 10 },
  ],
};
