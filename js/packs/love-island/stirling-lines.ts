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
  { id: 'ri_coldopen', text: 'The edit just promoted you to the cold open. That’s a corner office, in telly.' },
  { id: 'ri_weddings', text: 'I’ve narrated weddings with less certainty. And I’ve narrated actual weddings.' },
  { id: 'ri_tote', text: 'That’s not a moment, that’s a merch line. Somewhere a tote bag is being designed.' },
  { id: 'ri_runback', text: 'The gallery ran it back, ran it back again, then forgot to do their jobs. Same.' },
  { id: 'ri_university', text: 'You could teach that at a university. A rubbish university, but a university.' },
  { id: 'ri_bankhol', text: 'Give that its own bank holiday. I’ll write to someone important, or my mum.' },
  { id: 'ri_aimfor', text: 'They’ll show that to next year’s lot as the standard. Then quietly lower the standard.' },
  { id: 'ri_layers', text: 'I felt that through the monitor, the desk, and two layers of Scottish cynicism.' },
  { id: 'ri_overtime', text: 'The music department just requested overtime. For YOU. On a weeknight.' },
  { id: 'ri_pubquiz', text: 'That’ll be a pub-quiz answer by autumn. “Which Islander—” yes. That one. You.' },
  { id: 'ri_mosquito', text: 'A move so clean even the mosquitoes applauded, and they’re on nobody’s side.' },
  { id: 'ri_retire', text: 'I’d retire on that, but they’d only replace me with a nicer Scotsman.' },
  { id: 'ri_creak', text: 'The whole nation leaned forward at once. You could hear the sofas creak.' },
  { id: 'ri_offbook', text: 'That wasn’t in the running order. Best things never are. Producers hate it. I love it.' },
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
  { id: 'rb_infull', text: 'Somewhere a producer just whispered “play it in full.” They are not on your side.' },
  { id: 'rb_diagrams', text: 'That’ll get its own chapter in the exit interview. A long one. With diagrams.' },
  { id: 'rb_thismorning', text: 'I’ve seen smoother. On this lawn. This morning. From the wobbly lounger.' },
  { id: 'rb_subjectline', text: 'The group chat has renamed itself. You’re the subject line now, pal.' },
  { id: 'rb_montage', text: 'One for the “where are they now” montage, and it’s only Tuesday.' },
  { id: 'rb_admin', text: 'Not the villain arc. The villain ADMIN. Worse, somehow. So much more paperwork.' },
  { id: 'rb_nohelp', text: 'The edit didn’t even need to help. That’s the part that stings.' },
  { id: 'rb_skydive', text: 'Brave. In the way skydiving is brave, if you skipped the bit about the parachute.' },
  { id: 'rb_seismo', text: 'The nation just did a collective wince you could read on a seismograph.' },
  { id: 'rb_advertscared', text: 'I’d cut to an advert, but the advert’s a bit scared as well.' },
  { id: 'rb_cafe', text: 'That landed like a dropped tray in a quiet café. Everyone looked. Nobody helped.' },
  { id: 'rb_nangram', text: 'Somewhere your nan turned the telly down and texted you a single question mark.' },
  { id: 'rb_warmno', text: 'Mate — no. And I say that with the full warmth of the booth. No.' },
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
      { id: 'tf_duet', text: 'They laughed at the same nothing at the same time. That’s not chemistry, that’s a duet.' },
      { id: 'tf_mortgage', text: 'He’s learned her coffee order AND her nan’s name. In here, that’s a joint mortgage.' },
      { id: 'tf_shy', text: 'The eye contact held so long the camera got shy and looked away first.' },
      { id: 'tf_crisp', text: 'Two people discovering they hate the same crisp flavour. Book the church.' },
      { id: 'tf_threeact', text: 'A beginning, a middle, and a wink. Proper three-act structure, that flirt.' },
    ],
    bad: [
      { id: 'tf_line', text: 'That chat-up line has been to two other villas. It didn’t work there either.' },
      { id: 'tf_road', text: 'Smooth… in the sense of a road, before they finish it.' },
      { id: 'tf_manual', text: 'Flirting is supposed to be jazz. That was a man reading the manual for jazz.' },
      { id: 'tf_lifeguard', text: 'There’s no lifeguard for that kind of drowning, babes.' },
      { id: 'tf_pool', text: 'The pool heard that and did a little splash of sympathy.' },
      { id: 'tf_biceps', text: 'He opened with a fact about his own biceps. The biceps left the conversation first.' },
      { id: 'tf_eco', text: 'That line’s been recycled so often it’s practically eco-friendly.' },
      { id: 'tf_pb', text: 'She said “tell me something real” and he told her his bench PB. Bless him.' },
      { id: 'tf_terms', text: 'Flirting like a man reading the terms and conditions aloud. To a person. On a date.' },
      { id: 'tf_skincare', text: 'The spark was there — then someone described their skincare routine, and it wasn’t.' },
    ],
  },
  drama: {
    incredible: [
      { id: 'td_sponsor', text: 'A row that good deserves its own sponsor.' },
      { id: 'td_lunch', text: 'Casually detonating the lawn before lunch. Scenes.' },
      { id: 'td_interval', text: 'Proper theatre, that. There’ll be an interval and everything.' },
      { id: 'td_landline', text: 'That kicked off so hard my mum texted ME about it. She has a landline.' },
      { id: 'td_schedule', text: 'And THAT is why nothing gets scheduled opposite this show.' },
      { id: 'td_interval2', text: 'A row with three acts and an interval. Somebody get it a producer credit.' },
      { id: 'td_madecoffee', text: 'Kicked off so cleanly the editors just pointed a camera and made a coffee.' },
      { id: 'td_stamina', text: 'Detonated the whole lawn and still made it to breakfast. That’s stamina.' },
      { id: 'td_previously', text: 'The kind of scene that gets its own “previously on.” Twice. Same episode.' },
      { id: 'td_masterclass', text: 'A masterclass. In what, exactly, we may never know. But a masterclass.' },
    ],
    bad: [
      { id: 'td_flyers', text: 'There’s starting drama, and there’s handing out flyers for it.' },
      { id: 'td_nowinner', text: 'That argument had no winner. It barely had participants.' },
      { id: 'td_snacks', text: 'You could see that row coming from the beach. Some of us did. With snacks.' },
      { id: 'td_petrol', text: 'A row that ran out of petrol halfway and had to be pushed home. Sad, really.' },
      { id: 'td_beef', text: 'The beef arrived overcooked and somehow got worse.' },
      { id: 'td_roundtrip', text: 'A row that arrived without a point and left without one. Round trip. No souvenirs.' },
      { id: 'td_absent', text: 'Two sides, and neither was winning. Or, frankly, present.' },
      { id: 'td_wetmatch', text: 'Started a fire with wet matches, then blamed the villa for the smell.' },
      { id: 'td_fruitbowl', text: 'All that noise and the only casualty was a fruit bowl. It deserved better.' },
      { id: 'td_inflate', text: 'You could hear the drama being inflated. Squeak, squeak, pop. Nothing inside.' },
    ],
  },
  challenge: {
    incredible: [
      { id: 'tc_aprons', text: 'A challenge performance so good it’s suspicious. Someone check the aprons.' },
      { id: 'tc_podium', text: 'If snog-adjacent obstacle courses were Olympic — give it time — that’s a podium.' },
      { id: 'tc_props', text: 'Forty quid of props, finally respected. The props department is crying. Good tears.' },
      { id: 'tc_claim', text: 'Won the challenge, won the lawn, won a small legal claim on my heart.' },
      { id: 'tc_frame', text: 'A performance the props department will frame. The props department has feelings now.' },
      { id: 'tc_inflatable', text: 'Won the game AND the moral high ground, on an inflatable. Multi-tasking.' },
      { id: 'tc_foam', text: 'Forty quid of foam, respected at last. The budget wept. Proud tears.' },
      { id: 'tc_theatre', text: 'Turned a snog-relay into actual theatre. The scoreboard didn’t deserve you.' },
    ],
    bad: [
      { id: 'tc_budget', text: 'The challenge budget was forty quid, and it still deserved better than that.' },
      { id: 'tc_safety', text: 'Health and safety signed off on the challenge. They did not sign off on that.' },
      { id: 'tc_clap', text: 'The scoreboard says last. The slow clap says beloved. Take the clap.' },
      { id: 'tc_pie', text: 'Somewhere, a props department weeps into a custard pie.' },
      { id: 'tc_wetter', text: 'The challenge asked one thing. You did a different, wetter thing. Points for commitment.' },
      { id: 'tc_dismount', text: 'Health and safety approved the course. Nobody approved that dismount.' },
      { id: 'tc_alibi', text: 'Came last and blamed the foam. The foam’s been here every season and never lost before.' },
      { id: 'tc_bucket', text: 'Forty quid of props and you found the one way to lose to a bucket.' },
    ],
  },
  strategy: {
    incredible: [
      { id: 'ts_chess', text: 'Chess. On a lawn. In swimwear. Chess.' },
      { id: 'ts_clipboard', text: 'I’m starting to think you’ve done this before. Somebody check their bag for a clipboard.' },
      { id: 'ts_folder', text: 'Cold, clean, documented. The gallery just made you a folder.' },
      { id: 'ts_gcse', text: 'That was so calculated the maths GCSE board wants a word.' },
      { id: 'ts_drawer', text: 'Cold, clean, filed in triplicate. The gallery just gave you your own drawer.' },
      { id: 'ts_behind', text: 'Three moves ahead, pretending to be two behind — and the person two behind hasn’t noticed they’re in a game.' },
      { id: 'ts_harp', text: 'Played the whole lawn like a wee harp and made it look like an accident.' },
      { id: 'ts_chessclock', text: 'A plan with no loose ends. Somewhere a chess clock ticked approvingly.' },
    ],
    bad: [
      { id: 'ts_part', text: 'The plan had one moving part, and it moved the wrong way.' },
      { id: 'ts_step2', text: 'A five-step plan with step two missing. Bold architecture.' },
      { id: 'ts_neck', text: 'Your poker face is lovely. It’s the poker NECK that gave it away.' },
      { id: 'ts_drill', text: 'Scheming with the subtlety of a fire drill.' },
      { id: 'ts_bridge', text: 'A masterplan with the middle missing. Ambitious bridge, no bit over the water.' },
      { id: 'ts_holiday', text: 'You telegraphed that so hard the neighbours got the message. They’re on holiday.' },
      { id: 'ts_followup', text: 'The scheme worked right up until someone asked one follow-up question.' },
      { id: 'ts_snakes', text: 'Playing 4D chess on a board that was, on inspection, snakes and ladders.' },
    ],
  },
  loyal: {
    incredible: [
      { id: 'tl_frame', text: 'Loyal. Actually loyal. On THIS programme. Somebody frame it.' },
      { id: 'tl_postcode', text: 'Loyalty with follow-through. In this postcode, that’s a superpower.' },
      { id: 'tl_frame2', text: 'Faithful, on camera, under offer. Print it and hang it in the Hideaway.' },
      { id: 'tl_nans', text: 'The nation’s nans just nodded as one. That’s the whole vote, that.' },
      { id: 'tl_plaque', text: 'Loyal AND load-bearing. On this show. Get the plaque, I’ll hold your ladder.' },
      { id: 'tl_boring', text: 'Chose the boring right thing at the loud wrong moment. The nans have noted it.' },
      { id: 'tl_underfire', text: 'Faithful under fire, on camera, with a bombshell in the room. Frame it twice.' },
      { id: 'tl_decision', text: 'That’s not a doormat, that’s a decision. Big difference, and you both know it.' },
    ],
    bad: [
      { id: 'tl_admin', text: 'Loyalty’s lovely, but that was loyalty with terrible admin.' },      { id: 'tl_mouth', text: 'The heart was in the right place. The mouth was in a different postcode.' },
      { id: 'tl_fault', text: 'Loyal to a fault. The fault was load-bearing.' },
      { id: 'tl_latetrain', text: 'Loyalty with the timing of a late train. Right destination, wrong platform.' },
      { id: 'tl_villa', text: 'The heart was true. The follow-through went to a different villa.' },
      { id: 'tl_lawyer', text: 'Faithful, technically, in a way that needed a lawyer to explain to the nan at home.' },
    ],
  },
  banter: {
    incredible: [
      { id: 'tb_uncut', text: 'That bit runs uncut tonight. The editors have downed tools out of respect.' },
      { id: 'tb_boom', text: 'Quicker than the boom mic. The sound guy is still turning.' },
      { id: 'tb_export', text: 'That joke will leave this villa and get a job in the wider economy.' },
      { id: 'tb_agent', text: 'That bit’s leaving the villa and getting itself an agent. Rightly.' },
      { id: 'tb_sharp', text: 'Faster than the boom mic and twice as sharp. The sound guy’s still catching up.' },
      { id: 'tb_respect', text: 'A joke so good the editors kept it uncut, out of professional respect.' },
    ],
    bad: [
      { id: 'tb_flat', text: 'The joke arrived, looked around, and left without buying anything.' },
      { id: 'tb_filter', text: 'Silence — and then the pool filter laughed. Rough crowd.' },
      { id: 'tb_second', text: 'Never do the bit a second time. The second time is a hostage situation.' },
      { id: 'tb_fireexit', text: 'The bit walked in, read the room, and quietly left through the fire exit.' },
      { id: 'tb_funeral', text: 'Told it, then explained it. Never explain it. The explaining is the funeral.' },
      { id: 'tb_filter2', text: 'Silence — then the pool filter chuckled, out of pity. Rough gig, comedy.' },
    ],
  },
  camera: {
    incredible: [
      { id: 'tcam_lens', text: 'Found the lens like it owed you money. Star behaviour, that.' },
      { id: 'tcam_bus', text: 'That’s the promo shot. That’s the one on the side of the bus.' },
      { id: 'tcam_thumbs', text: 'Nine million thumbs just paused over nine million phones. That’s the job, babes.' },
      { id: 'tcam_rent', text: 'Found the lens like it owed you rent. That’s the shot on the side of the bus.' },
      { id: 'tcam_scroll', text: 'Nine million thumbs stopped scrolling at once. That’s the whole job, that.' },
      { id: 'tcam_fell', text: 'Played to the camera and the camera fell for it. Star behaviour, no notes.' },
    ],
    bad: [
      { id: 'tcam_blink', text: 'Blinked in the promo take. Immortal, now, the blink.' },
      { id: 'tcam_three', text: 'Playing to camera three. Camera three is off, pal. Has been all week.' },
      { id: 'tcam_smell', text: 'The lens can smell wanting-it. It’s a strong smell. Open a window.' },
      { id: 'tcam_fern', text: 'Played to camera four. Camera four is a plant, pal. Lovely fern, no lens.' },
      { id: 'tcam_aftershave', text: 'The lens can smell wanting-it. That was a full aftershave of wanting-it.' },
      { id: 'tcam_money', text: 'Blinked on the money shot. Immortal now, the blink. Framed, even.' },
    ],
  },
  date: {
    incredible: [
      { id: 'tdate_maths', text: 'They split a dessert without doing the maths on it. That’s trust, that.' },
      { id: 'tdate_quiet', text: 'A comfortable silence, on a first date, on television. Frame it.' },
      { id: 'tdate_spoon', text: 'Shared a dessert and neither did the maths. That’s trust, on a spoon.' },
      { id: 'tdate_extinct', text: 'A silence on a first date that didn’t need saving. Rare. Nearly extinct.' },
    ],
    bad: [
      { id: 'tdate_job', text: 'Forty minutes on his job. There are documentaries about pipe fitting with better pacing.' },
      { id: 'tdate_order', text: 'Ordered for them. ORDERED for them. The nation just did one sharp intake.' },
      { id: 'tdate_cardio', text: 'Forty minutes on his cardio routine. There are documentaries with better pacing.' },
      { id: 'tdate_intake', text: 'Chose the wine by price, loudly. The date heard the number. So did the nation.' },
    ],
  },
  rest: {
    incredible: [
      { id: 'tr_radical', text: 'A nap. A radical act, in here. The booth logs it as content lost and respects it anyway.' },
      { id: 'tr_glow', text: 'Twelve hours of absolutely nothing and they’ve come back luminous. Furious about it, personally.' },
      { id: 'tr_salute', text: 'A nap. On a game show. The booth logs it as content lost and salutes it anyway.' },
      { id: 'tr_glow2', text: 'Did nothing all day and came back glowing. Furious about it, personally.' },
    ],
    bad: [
      { id: 'tr_towel', text: 'A rest day spent watching everyone else’s storyline from a towel. That’s not rest, that’s research with sunburn.' },
      { id: 'tr_pool', text: 'Hiding by the pool works better when the pool isn’t on television.' },
      { id: 'tr_swim', text: 'Hid by the pool from a storyline. The storyline can swim, babes.' },
      { id: 'tr_towel2', text: 'Called it rest. It was research, with sunburn, from a towel. Different thing.' },
    ],
  },
  chat: {
    incredible: [
      { id: 'tch_kettle', text: 'The kettle chats are where this show actually happens. That one moved the Season.' },
      { id: 'tch_care', text: 'A conversation handled with actual care. On this lawn. I’ll allow it — the format won’t miss one.' },
      { id: 'tch_moved', text: 'The kettle chat that moved the whole Season. That’s where this show actually lives.' },
      { id: 'tch_rumour', text: 'Handled with real care, on this lawn, where care is a rumour. I’ll allow it.' },
    ],
    bad: [
      { id: 'tch_weather', text: 'A chat about the weather. In a villa. Where the weather is the same. Every day.' },
      { id: 'tch_scenic', text: 'That conversation needed an exit and took the scenic route.' },
      { id: 'tch_thermostat', text: 'A chat about the weather. Indoors. Where the weather is a thermostat.' },
      { id: 'tch_detour', text: 'That conversation needed an exit and took the scenic route past three other topics.' },
    ],
  },
  code: {
    incredible: [
      { id: 'tco_court', text: 'The code, upheld, in open court. The dressing room will remember this term.' },
      { id: 'tco_bloc', text: 'That’s how blocs form, folks. Quietly. Over towel-folding.' },
      { id: 'tco_court2', text: 'The code, upheld in open court, over towel-folding. That’s how blocs are born.' },
      { id: 'tco_kept', text: 'Kept the promise nobody would’ve caught you breaking. The dressing room noticed.' },
    ],
    bad: [
      { id: 'tco_breach', text: 'A code breach with witnesses. The group chat has already ruled.' },
      { id: 'tco_technically', text: 'Technically within the code. TECHNICALLY is doing a lot of lifting there.' },
      { id: 'tco_audience', text: 'A code breach with a live audience. The group chat has already returned its verdict.' },
      { id: 'tco_kept2', text: 'Technically kept the code. TECHNICALLY doing the heavy lifting there, pal.' },
    ],
  },
  temptation: {
    incredible: [
      { id: 'tt_gym', text: 'Flirted right up to the line, toes ON the line, and home by eleven. Gymnastics.' },
      { id: 'tt_roundtrip', text: 'Head turned, head returned. The round trip is the story, babes.' },
      { id: 'tt_eleven', text: 'Head turned, head returned, home by eleven. The round trip is the whole story.' },
      { id: 'tt_olympic', text: 'Toes right on the line and not a millimetre over. Gymnastics, that. Olympic.' },
    ],
    bad: [
      { id: 'tt_footage', text: 'Nothing happened. The footage of nothing happening is forty minutes long.' },
      { id: 'tt_thursday', text: 'That’ll be a Movie Night clip. They’re all Movie Night clips. Thursday is coming.' },
      { id: 'tt_fortymin', text: '“Nothing happened.” The footage of nothing happening runs forty minutes.' },
      { id: 'tt_looms', text: 'A Movie Night clip in the making. They’re all Movie Night clips. Thursday looms.' },
    ],
  },
};

// ---------- Beat lines (guaranteed, authored, priority) ----------

// Verdicts — he EXPLAINS the ceremony result (the legibility half of the job).
// Conditions are matched by the selection engine off the ceremony readings.
export const BEAT_VERDICT: Record<string, BarkDef[]> = {
  held: [
    { id: 'vh_lifting', text: 'Held. The Connection did the lifting — all those chats on the wobbly lounger, paying out at last.', priority: 10 },
    { id: 'vh_boring', text: 'Chosen, first, by name. That’s what the boring homework chats buy: ceremony insurance.', priority: 10 },
    { id: 'vh_hydrate', text: 'Safe. The couple carried it. Take the win, say nothing smug, hydrate.', priority: 10 },
    { id: 'vh_nan', text: 'Held. Not a twitch in the choosing. Somewhere, your nan exhales.', priority: 10 },
    { id: 'vh_middle', text: 'Held, comfortably. The couples who do the boring middle bits survive the loud end bits. Write that down, villa.', priority: 10 },
    { id: 'vh_pulse', text: 'Named first, and you felt it before I said it. That’s a Connection with a pulse.', priority: 10 },
    { id: 'vh_rent', text: 'Held, and the boring bits did it — every tea round, every daybed chat, quietly paying rent.', priority: 10 },
    { id: 'vh_wanted', text: 'Chosen, plainly, by the person who wanted to. Rare on this lawn. Take the win.', priority: 10 },
    { id: 'vh_clean', text: 'Held. The vote never had to leave the sofa — the couple carried it clean.', priority: 10 },
    { id: 'vh_water', text: 'Safe, not a wobble in the choosing. Bank it, say nothing clever, get some water in.', priority: 10 },
  ],
  rescued: [
    { id: 'vr_village', text: 'Saved — not by your couple, by the room. The nation raised you like a village.', priority: 10 },
    { id: 'vr_bailout', text: 'That wasn’t romance, that was a bailout. Take it; bailouts spend the same.', priority: 10 },
    { id: 'vr_feeds', text: 'Rescued at the fire. The Connection didn’t show up; your public did. Remember who feeds you.', priority: 10 },
    { id: 'vr_sofas', text: 'The Connection flinched. Nine million sofas didn’t. Send the sofas a card.', priority: 10 },
    { id: 'vr_bailout2', text: 'A public bailout, that. The couple flinched; the nation didn’t. Spend it wisely.', priority: 10 },
    { id: 'vr_strangers', text: 'Rescued at the fire — by strangers, for you. Send the whole country a thank-you card.', priority: 10 },
    { id: 'vr_nightoff', text: 'The Connection had a night off. The nation clocked in for it. Remember who carried you.', priority: 10 },
    { id: 'vr_livingrooms', text: 'Saved by the living rooms, not the couple. Nine million of them outvoted one shaky Connection.', priority: 10 },
  ],
  dumped: [
    { id: 'vd_maths', text: 'No name, no seat, taxi. The maths was the maths: the Connection wasn’t there, and the vote never arrived.', priority: 10 },
    { id: 'vd_legends', text: 'Dumped. Brutal. For what it’s worth, exit interviews are where legends start. Usually. Sometimes.', priority: 10 },
    { id: 'vd_shape', text: 'The firepit went quiet in the wrong shape, and you knew before I did. Head high. The car has snacks.', priority: 10 },
    { id: 'vd_book', text: 'Dumped, by the oldest rule in the book: nobody said the name. The book is rude. It’s also the book.', priority: 10 },
    { id: 'vd_idling', text: 'No name. No chair. The taxi’s been idling since the second ad break, if we’re honest.', priority: 10 },
    { id: 'vd_kindermontage', text: 'Dumped — and the montage they’ll cut of you is kinder than the vote was. Small mercy.', priority: 10 },
    { id: 'vd_twoabsences', text: 'The numbers didn’t show and neither did the Connection. Two absences, one taxi. Head high.', priority: 10 },
    { id: 'vd_gap', text: 'Sent home the quiet way: no villain edit, no send-off row, just a gap where your name went.', priority: 10 },
  ],
  // The cash-out landed and the check passed with the poach defused.
  held_secret: [
    { id: 'vs_lifting', text: 'Held — and let the record show the secret did the heavy lifting. Scandal: also a love language.', priority: 10 },
    { id: 'vs_detonate', text: 'Safe. You didn’t plead your case; you detonated theirs. The firepit approves. Nervously.', priority: 10 },
    { id: 'vs_journalism', text: 'Held — via what I can only describe as investigative journalism with a tan.', priority: 10 },
    { id: 'vs_exactchange', text: 'Held. Let the tape show the secret paid the whole bill, exact change, no tip.', priority: 10 },
    { id: 'vs_fuse', text: 'Safe — you lit the fuse under someone else and warmed your hands on it. Grim. Effective.', priority: 10 },
    { id: 'vs_fifty', text: 'Held, by a revelation you’d been carrying like a fifty-pound note. Spent it perfectly.', priority: 10 },
  ],
};

// Other guaranteed beats, keyed by trigger.
export const BEAT_REACT: Record<string, BarkDef[]> = {
  casa_held: [
    { id: 'ch_insurance', text: 'Through Casa with the couple intact. Do you know how rare that is? Insurance doesn’t cover Casa.', priority: 10 },
    { id: 'ch_walked', text: 'They walked back in alone. ALONE. Somebody check the format still works.', priority: 10 },
    { id: 'ch_plaque', text: 'Through Casa, couple intact. Couples that survive Casa get a little plaque in my heart. Metaphorical. Budget.', priority: 10 },
    { id: 'ch_rate', text: 'Back from Casa, couple intact. The survival rate on that? Neither of us wants to know.', priority: 10 },
    { id: 'ch_postcard', text: 'Through Casa unscathed. The postcode tried; the couple held. Frame the postcard, not the fear.', priority: 10 },
    { id: 'ch_suitcase', text: 'Walked back in with the same person. In Casa terms, that’s a small miracle with a suitcase.', priority: 10 },
  ],
  casa_betrayed: [
    { id: 'cb_hand', text: 'They walked in holding a HAND. A whole other hand. I need to sit down, and I narrate sitting down.', priority: 10 },
    { id: 'cb_postcode', text: 'Three days, one postcode apart, and the couple didn’t survive the commute. This programme.', priority: 10 },
    { id: 'cb_comeback', text: 'Betrayed at Casa. The oldest cut on this show, and it’s still sharp. So is the comeback arc — ask the nation.', priority: 10 },
    { id: 'cb_working', text: 'They came home plus one. The maths of Casa is cruel and it always shows its working.', priority: 10 },
    { id: 'cb_lighter', text: 'The suitcase came back heavier and the couple came back lighter. That’s Casa arithmetic.', priority: 10 },
    { id: 'cb_plane', text: 'Walked back in holding a new hand. A whole new hand. The old one is on a plane.', priority: 10 },
  ],
  bombshell: [
    { id: 'bb_sunbed', text: 'A bombshell. Because the villa was one sunbed short of peaceful.', priority: 10 },
    { id: 'bb_deposit', text: 'New arrival, walking in like the deposit’s already paid. Watch your couple. Watch your drink.', priority: 10 },
    { id: 'bb_customs', text: 'A new arrival with a suitcase full of consequences. Customs should have stopped them.', priority: 10 },
    { id: 'bb_golden', text: 'They walked in at golden hour. Scheduled. SCHEDULED. Production has no shame and excellent lighting.', priority: 10 },
    { id: 'bb_comfy', text: 'A bombshell, right as everyone got comfy. Comfort, in this villa, is a producer’s cue.', priority: 10 },
    { id: 'bb_breath', text: 'New arrival, full eye contact, zero remorse. Six couples just held their breath at once.', priority: 10 },
    { id: 'bb_runorder', text: 'They walked in like they’d read the running order. They probably have. Watch your Connection.', priority: 10 },
    { id: 'bb_teatime', text: 'A bombshell at teatime. Six people just remembered, urgently, that they’re coupled up. Lovely. More of that.', priority: 10 },
  ],
  secret: [
    { id: 'sx_interest', text: 'You KNOW things now. Knowledge in this villa compounds like interest. Spend it wisely… or spectacularly.', priority: 10 },
    { id: 'sx_currency', text: 'A secret, in the villa economy, is a fifty-pound note nobody’s broken yet. Careful with your pockets.', priority: 10 },
    { id: 'sx_library', text: 'Another one for the collection. You’re not an Islander any more — you’re a lending library of leverage.', priority: 10 },
    { id: 'sx_loaded', text: 'A secret, freshly acquired. Loaded to carry, louder to drop. Choose the moment, not the mood.', priority: 10 },
    { id: 'sx_runway', text: 'You know a thing they don’t know you know. That’s three moves of runway, right there.', priority: 10 },
    { id: 'sx_ticking', text: 'Filed away, ticking gently. A secret’s only worth what you don’t spend it on. Yet.', priority: 10 },
  ],
  enc_pact: [
    { id: 'ep_trade', text: 'A pact with your rival. A PACT. This series has trade agreements now.', priority: 10 },
    { id: 'ep_lawyers', text: 'Non-aggression, agreed on a terrace, no lawyers present. It’ll hold right up until it doesn’t.', priority: 10 },
    { id: 'ep_un', text: 'A ceasefire in swimwear. The UN could learn from this lawn. The UN could not survive this lawn.', priority: 10 },
    { id: 'ep_policy', text: 'Non-aggression, agreed over a shared lounger. The lawn now has a foreign policy.', priority: 10 },
    { id: 'ep_countdown', text: 'You and the Rival, allies. Briefly. The kind of peace that comes with a countdown built in.', priority: 10 },
    { id: 'ep_terrace', text: 'A truce with the Rival, signed on a terrace, no lawyers, all cameras. It’ll hold till it doesn’t.', priority: 10 },
  ],
  enc_war: [
    { id: 'ew_marsh', text: 'War declared, politely, over marshmallows. This show, honestly.', priority: 10 },
    { id: 'ew_villain', text: 'Every season needs a villain arc. Yours just introduced itself and poured you a drink first.', priority: 10 },
    { id: 'ew_diary', text: 'A feud with a start date. Put it in the diary — the diary is the show.', priority: 10 },
    { id: 'ew_charger', text: 'Battle lines drawn, sweetly, over a borrowed charger. The pettiest wars film the best.', priority: 10 },
    { id: 'ew_nemesis', text: 'You’ve got a nemesis now. A villain makes your edit whether you asked for one or not.', priority: 10 },
    { id: 'ew_kickoff', text: 'A rivalry with an official kickoff. The gallery just cleared a whole episode for it.', priority: 10 },
  ],
  wobble: [
    { id: 'wb_hut', text: 'A wobble. Happens to the best — and the best usually cry in the nice Hut, so you’re on track.', priority: 10 },
    { id: 'wb_human', text: 'The meter’s up because you’re a person, not a format point. Even the format knows that. Occasionally.', priority: 10 },
    { id: 'wb_medicine', text: 'Wobbles pass, babes. Kettle on, mate found, camera ignored. That’s the whole medicine.', priority: 10 },
    { id: 'wb_sleep', text: 'A wobble. The head’s loud tonight. Nobody films their best telly on no sleep — go quiet a minute.', priority: 10 },
    { id: 'wb_overcast', text: 'That meter climbing isn’t weakness, it’s weather. Even the villa gets overcast. Rest under it.', priority: 10 },
    { id: 'wb_ask', text: 'A wobble, no shame in it. The ones who ask for a minute keep going. The tough-it-out lot pack.', priority: 10 },
  ],
  wobble_break: [
    { id: 'wbk_suitcase', text: 'Dawn, a suitcase, and the long stare. I’ve narrated a hundred of these. The ones who ask for help stay. The ones who say “I’m fine” pack.', priority: 10 },
    { id: 'wbk_quiet', text: 'No jokes for a second. That gate is real, and Final Week has no patience for a loud head. Whatever keeps you in the game — do that one.', priority: 10 },
    { id: 'wbk_ladder', text: 'The head’s at the top of the ladder now. This is the one meter that ends the run. Mind it, seriously.', priority: 10 },
    { id: 'wbk_thing', text: 'No bit here, pal. This gate’s the real one. Do the thing that keeps you in — the exact one, right now.', priority: 10 },
  ],
  steal_survived: [
    { id: 'st_held', text: 'Sixty seconds of pure lawn maths, and your couple came out the other side. Exhale.', priority: 10 },
    { id: 'st_audit', text: 'Sixty seconds where every Connection on the lawn got audited — and yours passed. Frame the receipt.', priority: 10 },
    { id: 'st_missed', text: 'A steal came, aimed, and missed. Held, under fire. That’s a real one, that.', priority: 10 },
    { id: 'st_dice', text: 'They rolled the dice at your couple and the dice bounced off. Breathe. You earned that.', priority: 10 },
  ],
  steal_lost: [
    { id: 'st_gone', text: 'Stolen. Live. At a firepit. There are heists with more warning. Deep breath — the game’s not done with you.', priority: 10 },
    { id: 'st_pending', text: 'Partner: stolen. Dignity: pending. The next ceremony is already on the schedule — so is your comeback.', priority: 10 },
    { id: 'st_board', text: 'A steal took your person off the board in sixty seconds flat. Brutal maths. The next ceremony’s yours to answer.', priority: 10 },
    { id: 'st_firstpick', text: 'Gone, live, first pick. There are heists with more warning than that. Deep breath — you’re not done.', priority: 10 },
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
    { id: 'fc_dyn_4', text: 'To the firepit, then, sitting on a secret the size of a recoupling. The pocket is the plot tonight.', priority: 10 },
    { id: 'fc_dyn_5', text: 'A note from the booth: leverage held past its moment stops being leverage and becomes a liability.', priority: 10 },
    { id: 'fc_dyn_6', text: 'Everyone’s counting couples. Nobody’s counting what’s in your pocket. Well — me. I always count.', priority: 10 },
  ],
  bondSafe: [
    { id: 'fb_seatbelt', text: 'Recoupling tonight. That Connection of yours is wearing a seatbelt. Should be fine. Should.' },
    { id: 'fb_wrong', text: 'Forecast: your couple holds. I say that with the confidence of a man who’s been wrong twice this series.' },
    { id: 'fb_armour', text: 'Tonight’s ceremony, and yours is one of the boring couples. Tonight, boring is armour.' },
    { id: 'fb_homework', text: 'Ceremony tonight. You did the chats, you did the tea rounds — the Connection should answer when called. Should.' },
    { id: 'fb_calm', text: 'Tonight’s forecast: settled, with a strong couple front. I hate a quiet night. Thrilled for you, though.' },
    { id: 'fb_armour2', text: 'Ceremony tonight, and yours is the couple that did the homework. Homework, tonight, is armour.' },
    { id: 'fb_wrong2', text: 'Forecast: your Connection holds. I say that as a man who’s been wrong twice this series already.' },
    { id: 'fb_answer', text: 'The chats, the tea rounds, the daybed hours — they should answer when the fire calls. Should.' },
    { id: 'fb_carries', text: 'Tonight’s outlook: your couple carries you. Boring, safe, exactly what wins these nights.' },
    { id: 'fb_seatbelt2', text: 'Recoupling tonight, and your Connection’s wearing a seatbelt. Should be grand. Should.' },
  ],
  publicSafe: [
    { id: 'fp_mug', text: 'The Connection’s wobbling — but the nation’s got your name on a mug. Someone will say it at that fire.' },
    { id: 'fp_sofas', text: 'Between you and me: it’s not your couple saving you tonight. It’s nine million sofas.' },
    { id: 'fp_plan', text: 'Forecast: shaky indoors, popular outdoors. In here, that counts as a plan.' },
    { id: 'fp_postman', text: 'The couple’s wobbly; the country isn’t. Somewhere out there a postman is voting for you on his break.' },
    { id: 'fp_mugs', text: 'Weak Connection, strong fanbase. In ceremony maths, mugs beat hugs. Tonight, anyway.' },
    { id: 'fp_wave', text: 'Shaky indoors, beloved outdoors. In this villa, that counts as a full strategy. Wave at the sofas.' },
    { id: 'fp_ta', text: 'It won’t be the couple saving you tonight, babes. It’ll be nine million living rooms. Say ta.' },
    { id: 'fp_postie', text: 'Your couple’s a question mark; the country isn’t. Somewhere a postie’s voting for you on their break.' },
    { id: 'fp_thick', text: 'Forecast: thin at the firepit, thick on the sofas. The nation carries what the Connection won’t.' },
  ],
  danger: [
    { id: 'fd_look', text: 'Honest forecast? Connection’s shaky, vote’s shaky, and the firepit’s got that look. Big night needed, pal.' },
    { id: 'fd_fence', text: 'Squeaky-bum time. The Connection won’t carry you, and the vote is sitting on the fence it built.' },
    { id: 'fd_taxi', text: 'I’ve seen Islanders survive worse. I’ve also seen the taxi. Big speech, yeah?' },
    { id: 'fd_booth', text: 'I’d spin this if I could, pal. The Connection’s thin, the vote’s thin — the booth recommends a very good speech.' },
    { id: 'fd_weather', text: 'Forecast: exposed, with a chance of taxi. Wear something you can leave in.' },
    { id: 'fd_fence2', text: 'Squeaky-bum time, pal. The Connection won’t carry you and the vote’s sat on the fence it built.' },
    { id: 'fd_taxi2', text: 'I’ve seen Islanders survive worse. I’ve also, more often, seen the taxi. Big speech, yeah?' },
    { id: 'fd_prescribe', text: 'I’d spin this if I could. Connection thin, vote thin — the booth prescribes a very good speech.' },
    { id: 'fd_hungry', text: 'Both meters low and the fire’s hungry. Tonight the maths actually asks a question, pal.' },
  ],
  single: [
    { id: 'fs_maths', text: 'Single, at a ceremony, in the choosing season. The maths is simple and the maths is rude: be picked, or be packed.' },
    { id: 'fs_option', text: 'Single at the choosing. You are, at time of broadcast, an option. Be a compelling one.' },
    { id: 'fs_banked', text: 'No couple to hide in tonight. Just you, the fire, and whatever first impressions you banked. Spend them well.' },
    { id: 'fs_audition', text: 'On your own at the firepit. That’s not over — that’s an audition with a deadline of about now.' },
    { id: 'fs_compelling', text: 'Single at the choosing. You are, at time of broadcast, an option. Be the compelling one.' },
    { id: 'fs_packed', text: 'Single, at a ceremony, in the choosing season. The maths is simple and rude: be picked, or be packed.' },
  ],
};

// Scene-stamp openers for the other watched beats (deal-time, pure).
export const SCENE_STAMP: Record<string, BarkDef[]> = {
  steal: [
    { id: 'ss_division', text: 'Sixty seconds, one choice, and every couple on that lawn doing long division. Good luck.' },
    { id: 'ss_meerkats', text: 'One bombshell, first pick of anyone, and every couple on the lawn sitting up like meerkats.' },
    { id: 'ss_rearrange', text: 'A bombshell with first pick and sixty seconds to rearrange the whole lawn. Hold onto your Connection, folks.' },
    { id: 'ss_stresstest', text: 'A steal on the cards. Sixty seconds where every Connection in the garden gets a live stress test.' },
  ],
  movienight: [
    { id: 'sm_genre', text: 'Movie Night. The villa’s favourite genre: documentary horror.' },
    { id: 'sm_popcorn', text: 'A cinema screen, on a lawn, full of receipts. Somebody pass the popcorn and a lawyer.' },
    { id: 'sm_feature', text: 'No trailers tonight. Straight to the feature. The feature is you.' },
    { id: 'sm_hotseat', text: 'Movie Night, folks. A cinema screen on a lawn, and every seat is a hot one.' },
    { id: 'sm_castplot', text: 'The one screening where the audience is also the cast and also, tragically, the plot.' },
    { id: 'sm_screen', text: 'A big screen, a dark lawn, a folder of receipts. Somebody dim the lights and lawyer up.' },
  ],
  finale: [
    { id: 'sf_thumb', text: 'The Final. Fairy lights, one envelope, and a nation with its thumb hovering. Enjoy the anxiety — you’ve earned it.' },
    { id: 'sf_dress', text: 'The villa, in evening wear. Even the wobbly lounger got polished. It’s the Final, folks.' },
    { id: 'sf_booth', text: 'Last night in the booth for me too. Whatever the envelope says — decent scenes, this Season. Decent scenes.' },
    { id: 'sf_polish', text: 'The Final. Everyone in their good clothes — even the wobbly lounger got a polish. This is it.' },
    { id: 'sf_knows', text: 'Last night, one envelope, a whole country certain it knows your relationship better than you.' },
    { id: 'sf_excuses', text: 'The Final, folks. Whatever’s in that envelope, it has no memory of your excuses. None.' },
  ],
  parents: [
    { id: 'sp_watched', text: 'The families are in. They’ve seen every episode, including the ones you’d rather they hadn’t. Smile.' },
    { id: 'sp_towels', text: 'The families have landed. Beds made, innuendo banned, and somebody has hidden the heart-rate results. Wise.' },
    { id: 'sp_liedetector', text: 'The families are in. Every mum in the building is running a lie detector behind a polite smile.' },
    { id: 'sp_heartrate', text: 'Meet the parents. Somebody has hidden the heart-rate results, and it was, wisely, not you.' },
  ],
};

// ---------- The tutor pool (R2: Stirling teaches the villa) ----------
// First-season-only deal-time lines (state.firstRun — stamped by the shell on
// a player's first real run, never set in sims/goldens). One teach per format
// beat, diegetic: he onboards you the way the voiceover onboards new viewers.
// The three lineup lines are per-outlook so the honest-forecast contract
// (ADR-0008) holds even while he's teaching.
export const TUTOR: Record<string, BarkDef[]> = {
  arrival: [{ id: 'tu_arrival', text: 'New to the villa? Three rules: couple up, stay coupled, and never trust a quiet producer. The nation’s watching from sofa one — and the nation gets a vote. Several, actually.', priority: 10 },
    { id: 'tu_arrival2', text: 'First day, is it? The nation votes, the couples shift, and nothing’s ever quite settled. Graft in, keep your head, and give sofa one a little wave.', priority: 10 }],
  daybed: [{ id: 'tu_daybed', text: 'The daybed shelf, for the newcomers: Graft in, reputation out. An Angle is who the edit says you are — and the edit is rarely wrong and never kind.', priority: 10 },
    { id: 'tu_daybed2', text: 'Daybed basics, new lot: Graft buys your reputation, the Edit picks your Angle, and the Angle sticks whether it’s fair or not. Usually not.', priority: 10 }],
  wobble: [{ id: 'tu_wobble', text: 'See the spiral up top, babes? That’s your head. Top it out and you walk — no envelope, no slow-mo montage. Rest is a move. The pros nap.', priority: 10 },
    { id: 'tu_wobble2', text: 'That meter up top is your head, babes. Max it out and you walk — no envelope, no slow-mo. So nap without the guilt: the pros treat a lie-in as tactics.', priority: 10 }],
  temptation: [{ id: 'tu_tempt', text: 'A word for the new viewers: a head-turn dents the Connection, it doesn’t break the couple. Officially. The duvets keep their own records.', priority: 10 },
    { id: 'tu_tempt2', text: 'For the new lot: temptation isn’t the enemy, the LYING about it is. A head-turn you own costs pennies; a secret one costs you Movie Night. It always surfaces at Movie Night.', priority: 10 }],
  lineup_bondSafe: [{ id: 'tu_line_bond', text: 'Recoupling rules, quickly: the Connection keeps you, or the nation does. Tonight your Connection’s doing the heavy lifting — as it should.', priority: 10 },
    { id: 'tu_line_bond2', text: 'Recoupling maths, newcomers: two safety nets — the couple and the country. Tonight the couple’s holding you. Sit back; that’s the homework paying out.', priority: 10 }],
  lineup_publicSafe: [{ id: 'tu_line_public', text: 'Recoupling rules, quickly: Connection or nation, either keeps you in. Tonight, babes, it’s the nation carrying you. Wave.', priority: 10 },
    { id: 'tu_line_public2', text: 'Recoupling maths, newcomers: the couple keeps you or the country does. Tonight your couple’s wobbling and nine million strangers aren’t. Odd feeling. Wave anyway.', priority: 10 }],
  lineup_danger: [{ id: 'tu_line_danger', text: 'Recoupling rules, quickly: the Connection holds you or the nation saves you. Tonight neither is promising. I’d stand near the fire — it’s warmer.', priority: 10 },
    { id: 'tu_line_danger2', text: 'Recoupling maths, newcomers: couple or country, you need one to show up. Tonight both are quiet. This is the bit where a very good speech earns its keep.', priority: 10 }],
  bombshell: [{ id: 'tu_bomb', text: 'First bombshell of your Season. They look like a person; they function as a countdown. It goes off at the next recoupling.', priority: 10 },
    { id: 'tu_bomb2', text: 'A word on bombshells, new viewers: they look like a person and work like a countdown. It goes off at the next recoupling. Every time.', priority: 10 }],
  casa: [{ id: 'tu_casa', text: 'Casa Amor, for the uninitiated: the villa splits, loyalty gets audited, and everything comes home on a postcard. Pack honesty. Or don’t — it’s telly either way.', priority: 10 },
    { id: 'tu_casa2', text: 'Casa Amor, newcomers: the villa splits, the loyalty gets audited, and it all comes home on a postcard. Pack honesty — or don’t. Telly either way.', priority: 10 }],
  movienight: [{ id: 'tu_movie', text: 'Movie Night, new viewers: everything anyone did, in HD, with sound. Footage outranks feelings. Enjoy.', priority: 10 },
    { id: 'tu_movie2', text: 'Movie Night, for the uninitiated: everything anyone did, in HD, with sound, to a room of exes. Footage outranks feelings. Enjoy.', priority: 10 }],
  gossip: [{ id: 'tu_gossip', text: 'Intel, babes: gather it in the quiet chats, hold three pieces at most, and spend it at a ceremony — that’s where words become results.', priority: 10 },
    { id: 'tu_gossip2', text: 'Intel, babes: gather it in the quiet chats, carry a few pieces, spend it at a ceremony. That’s where a whisper turns into a result.', priority: 10 }],
  exclusive: [{ id: 'tu_excl', text: 'Going exclusive: the Connection locks in higher, the temptations back off, and the drop — should it come — doubles. This show is a mortgage with cameras.', priority: 10 },
    { id: 'tu_excl2', text: 'Going exclusive, new lot: the Connection locks in higher, temptations ease off, and the drop — if it lands — hits double. A mortgage with cameras.', priority: 10 }],
  finale: [{ id: 'tu_final', text: 'The Final. Your declared Intention gets judged, the vote peaks, and the envelope has no memory of your excuses. Good luck, babes. Genuinely.', priority: 10 },
    { id: 'tu_final2', text: 'The Final, newcomers: your declared Intention gets judged, the vote peaks, the envelope forgets nothing. Good luck. Genuinely, this time.', priority: 10 }],
};

// ---------- The memory pool (R9/C4a: the villa remembers) ----------
// Meta-keyed arrival lines for returning players (run.history — the shell's
// memory ledger; never set in sims, so seeded goldens never see these).
// Routed by last Season's ending; `many` outranks once you're a regular.
export const MEMORY: Record<string, BarkDef[]> = {
  dumped: [
    { id: 'mem_dumped', text: 'Back again? Last time we did this, you left in a car with your name trending. New summer, same firepit. Go on then.', priority: 10 },
    { id: 'mem_dumped2', text: 'The villa never forgets a dumping. The villa also never learns — which, returning champion of getting up again, works in your favour.', priority: 10 },
    { id: 'mem_dumped3', text: 'You’re back. Last exit was a taxi and a trend. The villa forgot nothing, which is rude, and useful. Go on.', priority: 10 },
    { id: 'mem_dumped4', text: 'Round two after a dumping. The nation loves a comeback more than it loved the crime. Use that, pal.', priority: 10 },
  ],
  burnout: [
    { id: 'mem_walked', text: 'Last visit ended with a suitcase and your own decision — the rare dignified exit. Good to have you back. Watch the meter this time, babes.', priority: 10 },
    { id: 'mem_walked2', text: 'You walked yourself out last summer, head high, no drama. Respect. Watch that meter this time, babes.', priority: 10 },
  ],
  success: [
    { id: 'mem_won', text: 'A champion returns. The nation remembers the envelope. The villa remembers everything else.', priority: 10 },
    { id: 'mem_won2', text: 'The winner’s back. Odd choice — you had the money and the sofa. Still. Good to have you. Prove it twice.', priority: 10 },
  ],
  any: [
    { id: 'mem_back', text: 'Back for more? The villa kept your water bottle. That’s not sweet, by the way — that’s evidence retention.', priority: 10 },
    { id: 'mem_hottub', text: 'Round two. The nation remembers the hot-tub incident even if you’ve chosen not to. Fresh start, though. Officially.', priority: 10 },
    { id: 'mem_worst', text: 'Round two, and the villa remembers your worst night better than your best. Reintroduce yourself, then.', priority: 10 },
    { id: 'mem_lounger', text: 'You again. The lawn hasn’t changed, the lounger still wobbles, and neither has learned a thing. Perfect.', priority: 10 },
  ],
  many: [
    { id: 'mem_staff', text: 'Season five-plus, is it? At this point you’re not a contestant, you’re staff. Grab a lanyard, show the new ones where the Hut is.', priority: 10 },
    { id: 'mem_pension', text: 'How many summers is this now? At this point the villa should be paying your pension. Welcome home, veteran.', priority: 10 },
  ],
};
