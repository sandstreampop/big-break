// Music's art registry: the slot -> { emoji badge, scene id } table the
// generated-scene painter reads. Moved out of js/art.ts (registered via
// presenter.art at boot, the same seam love-island uses) so the shared art
// engine holds only the generic SVG scene painters — no music slot ids.
//
// EMOJI (slot -> badge) and SCENE (slot -> scene id) are kept as the two
// source tables they were authored as; MUSIC_ART is their union in the
// { e, s } shape registerArt() consumes. Wave-3 slots self-register from ART2.

import { ART2 } from '../data/events2.js';

const EMOJI = {
  // act-1 expansion + new arcs + weather + extras (More P5)
  ev_laundromat: '🧺', ev_camcorder: '📹', ev_heirloom: '🪕',
  ev_bandcamp: '💳', ev_ringtone: '📞', ev_bistro: '🥘', ev_neighbor_kid: '🎸',
  ev_band_photo: '📸', ev_rehearsal_share: '🤘', ev_family_show: '👩‍👩‍👧',
  ev_string_break: '🪗', ev_merch_box: '👕', ev_setlist_panic: '🧶',
  ev_prodigy_viral: '📈', ev_prodigy_stage: '🎤',
  ev_heirloom_call: '☎️', ev_heirloom_stage: '✨', ev_heirloom_glass: '🪟',
  ev_w_tent: '⛺', ev_w_lathe: '💿', ev_w_check: '🧾', ev_w_merger: '🏷️',
  ev_w_flood: '🌊', ev_w_zine: '📰', ev_w_moon: '🌕', ev_w_grant: '🏛️',
  ev_w_basement: '🕯️', ev_w_reunion: '📼', ev_w_badge: '🤖', ev_w_judge: '☕',
  ev_soundcheck_feud: '🎚️', ev_green_legend: '🧀', ev_radio_zoo: '📢',
  ev_support_pick: '🎫', ev_setlist_leak: '🕵️', ev_encore_debt: '👏',
  ev_tribute: '🎭', ev_van_dies: '🛕',
  // flashpoints (Rush U2)
  ev_fp_seance: '🕯️', ev_fp_prince: '👑', ev_fp_blackout: '🔦', ev_fp_capsule: '📼',
  ev_fp_slot: '🌩️', ev_fp_masked: '🎭', ev_fp_suit: '⚖️', ev_fp_cruise: '🛳️',
  ev_fp_glitch: '💸', ev_fp_billboard: '🏙️',
  ev_open_mic: '🎤', ev_roommate: '🛏️', ev_wedding: '💒', ev_craigslist: '📰',
  ev_phone_demo: '📱', ev_busk: '🎩', ev_pawn_shop: '🏷️', ev_clips: '🎞️',
  ev_battle: '🏆', ev_lessons: '📖', ev_dayjob: '🥤', ev_house_show: '🏚️',
  ev_gear_shop: '🎛️', ev_manager: '🕴️', ev_playlist: '📃', ev_band_drama: '💥',
  ev_sync: '🥣', ev_tour: '🚐', ev_energy: '⚡', ev_rest: '🌿', ev_loop_show: '🔁',
  ev_debt: '📋', ev_showcase: '🏢', ev_trend: '📈', ev_trend2: '🧴',
  ev_reality: '📺', ev_image: '🕶️', ev_opener: '🎟️', ev_session: '⏰',
  ev_jingle: '🛏️', ev_click: '🎚️', ev_union: '🤝', ev_producer: '🎧',
  ev_camp: '🏰', ev_topline: '🎹', ev_ghost: '👻', ev_splits: '🥧',
  ev_leak: '💧', ev_hero: '🦸', ev_press: '🗞️', ev_crash: '🚨',
  ev_docu: '🎥', ev_friend: '☎️', ev_last_shop: '🏛️', ev_hometown: '🏠',
  ev_biopic: '🎞️', ev_arena: '🏟️', ev_awards: '🏅', ev_scandal: '📰',
  ev_stadium: '🌃', ev_legend: '👑', ev_tv_band: '🌙', ev_one_take: '📼',
  ev_masterclass: '🧑‍🏫', ev_summer: '🏖️', ev_exec: '🗂️', ev_machine: '⚙️',
  ev_secret: '🤫', ev_mudfest: '🌧️', ev_lineup: '🥒', ev_secret_set: '⛺',
  ev_clash: '⚔️', ev_rival_intro: '😤', ev_rival_collab: '🤝', ev_rival_leap: '🛥️',
  ev_rival_showdown: '🥊', ev_rival_super: '📋',
  ev_coping_wall: '🧱', ev_coping_floor: '🫠', ev_oracle: '🔮', ev_stans: '🪧',
  ev_feature: '💅', ev_junket: '🎙️', ev_quote: '👕', ev_ghost_solo: '🎸',
  ev_gearlord: '🏛️', ev_pit: '🎭', ev_ai_demo: '🤖', ev_vault: '🗝️',
  ev_forecast: '🌊', ev_worldtour: '✈️', ev_persona: '🪞', ev_supersession: '🌙',
  ev_credits: '📇', ev_loyalty: '🤙', ev_diane: '👑', ev_prodigy: '☄️',
  ev_fan_gift: '🎁', ev_pawn_upgrade: '🔄', ev_voice_coach: '👁️',
  ev_fragment: '🚪', ev_song_grows: '🌱', ev_song_finale: '🎆', ev_song_regret: '📺',
  ev_purists: '🧵', ev_genre_face: '🗞️', ev_audit: '🧾', ev_profile: '💼',
  ev_karaoke: '🎤', ev_music_store: '🎸', ev_radio: '📻', ev_subway: '🚇', ev_noise_cop: '🚔',
  ev_first_bandmate: '🤝', ev_auditions: '📋', ev_stranded: '⛽', ev_ultimatum: '🥁',
  ev_last_meeting: '🖊️', ev_last_call: '📞', ev_last_credits: '🪑',
  ev_cb_remembered: '🛒', ev_cb_fest: '⏪', ev_cb_exec: '🎫', ev_cb_poster: '🖼️', ev_cb_band: '🥛',
  ev_sm_meet: '☕', ev_sm_birthday: '🎂', ev_sm_question: '🫖',
  ev_db_wire: '🐔', ev_db_tuesday: '⚓', ev_db_jukebox: '🎶', ev_db_inspector: '🧊', ev_db_lastcall: '📼',
  ev_bs_van: '🚐', ev_bs_merch: '👕', ev_bs_pearl: '🫧',
  ev_bs_parade: '🎺', ev_bs_archive: '🎞️', ev_bs_clause: '⚖️',
  ev_wt_offer: '🗺️', ev_wt_tokyo: '🗼', ev_wt_berlin: '🌫️', ev_wt_sp: '🌧️',
  ev_cl_dm: '📲', ev_cl_session: '🎙️', ev_cl_reprise: '🤝', ev_cl_regret: '🧾',
  ev_tut_loadin: '🚪', ev_tut_sound: '🎚️', ev_tut_setlist: '📝', ev_tut_heckler: '🗣️',
  ev_tut_green: '🛋️', ev_tut_opener: '🎤', ev_tut_encore: '🎇', ev_tut_tipjar: '🫙', ev_tut_set: '🌟',
  ev_afterparty: '🥂', ev_gala: '🍾', ev_woodshed: '🚜',
  ev_docu_pitch: '🎬', ev_docu_moment: '🎥', ev_docu_premiere: '🍿', ev_checkhell: '🔊', ev_merchline: '🧾', ev_goldhands: '🫳', ev_musicvideo: '🌊', ev_masters: '🗃️', ev_blooper: '📯', ev_shed: '🛖', ev_shed_night: '🌙', ev_shed_album: '📀', ev_shed_doc: '🎦', ev_shed_someone: '🕯️', ev_bloom_fest: '🎪', ev_shed_collab: '🚗', ev_bloom_amp: '🔌', ev_coverband: '🌺', ev_flyerwar: '📎', ev_opendeck: '🎧', ev_practicewall: '🧱', ev_bloom_big: '🌸', ev_summit: '🥐', ev_tv_scout: '📺', ev_tv_taping: '🛋️', ev_truce: '☕', ev_diss: '🎤', ev_venue_trouble: '📌', ev_loadout: '⏱️', ev_camp48: '⏳', ev_placement: '🥗', ev_heir: '💇', ev_dc_offer: '📇', ev_dc_blizzard: '❄️', ev_dc_birthday: '🎂', ev_dc_last: '🏛️',
  // Wave 3 instruments & gear
  instrument_spoons: '🥄', instrument_recorder: '🪈', instrument_stylophone: '🖊️',
  instrument_washtub: '🪣', instrument_accordion: '🪗', instrument_banjo: '🪕',
  instrument_sax: '🎷', instrument_talkbox: '💬', instrument_harp: '🦢',
  instrument_808: '👻', instrument_susan: '🎻', instrument_bagpipes: '📯',
  instrument_steelpan: '🛢️', instrument_mellotron: '🎞️', instrument_autoharp: '🌷',
  instrument_laptop: '💻',
  gear_gafftape: '🗜️', gear_earplugs: '🙉', gear_qr: '🔳', gear_metronome: '⏲️',
  gear_cape: '🦇', gear_wireless: '📡', gear_ricecooker: '🍚', gear_contactmic: '🧲',
  gear_thermos: '☕', gear_presspass: '🪪', gear_unioncard: '⚒️', gear_mascot: '🦝',
  gear_demotrunk: '💽', gear_socks: '🧦', gear_tuner: '🟢', gear_shoebox: '👟',
  gear_suitcase: '🧳', gear_greenkit: '🧃', gear_projector: '📽️', gear_fakemanager: '🕴️',
  gear_flightcase: '🧰', gear_homebooth: '🧥', gear_monitor: '👂',
  instrument_modular: '🎛️', instrument_triangle: '🔺', instrument_hurdy: '⚙️', gear_cowbell: '🔔',
  instrument_kazoo: '🎺', instrument_melodica: '🎹', instrument_buckets: '🥁',
  instrument_cigarbox: '🎸', instrument_glock: '🔔', instrument_theremin: '👋',
  instrument_electric: '🎸', instrument_sampler: '🎛️', instrument_voice: '🗣️',
  instrument_workhorse: '🎸', instrument_omnichord: '🌅', instrument_washboard: '🧺',
  gear_amp: '🔊', gear_loop: '🔁', gear_pedalboard: '🎚️', gear_pick: '🪙',
  gear_inears: '🎧', gear_mic: '🎙️', gear_energy: '⚡', gear_manager: '💳',
  gear_van: '🚐', gear_ringlight: '💡', gear_rolodex: '📇',
  gear_8track: '📼', gear_cannon: '🎯', gear_recorder: '🎙️',
  gear_fan: '🌬️', gear_humidifier: '💨', gear_binder: '📒', gear_bunk: '🛏️', gear_fog: '🌫️', gear_cable: '🔌',
  end_megastar_win: '🌟', end_megastar_partial: '🚌', end_megastar_fail: '📉',
  end_studio_win: '📞', end_studio_partial: '🥈', end_studio_fail: '🙏',
  end_hitfactory_win: '🏭', end_hitfactory_partial: '📀', end_hitfactory_fail: '🗄️',
  end_burnout: '💼', end_cancelled: '🚫', end_debt: '📋',
};

// Which composed scene each event/ending slot uses
const SCENE = {
  // act-1 expansion + new arcs + weather + extras (More P5)
  ev_laundromat: 'home', ev_camcorder: 'street', ev_heirloom: 'home',
  ev_bandcamp: 'phone', ev_ringtone: 'street', ev_bistro: 'stage', ev_neighbor_kid: 'home',
  ev_band_photo: 'street', ev_rehearsal_share: 'home', ev_family_show: 'stage',
  ev_string_break: 'stage', ev_merch_box: 'home', ev_setlist_panic: 'home',
  ev_prodigy_viral: 'phone', ev_prodigy_stage: 'festival',
  ev_heirloom_call: 'phone', ev_heirloom_stage: 'arena', ev_heirloom_glass: 'street',
  ev_w_tent: 'festival', ev_w_lathe: 'studio', ev_w_check: 'office', ev_w_merger: 'office',
  ev_w_flood: 'crisis', ev_w_zine: 'shop', ev_w_moon: 'festival', ev_w_grant: 'office',
  ev_w_basement: 'stage', ev_w_reunion: 'stage', ev_w_badge: 'phone', ev_w_judge: 'shop',
  ev_soundcheck_feud: 'stage', ev_green_legend: 'home', ev_radio_zoo: 'studio',
  ev_support_pick: 'phone', ev_setlist_leak: 'phone', ev_encore_debt: 'arena',
  ev_tribute: 'stage', ev_van_dies: 'street',
  // flashpoints (Rush U2)
  ev_fp_seance: 'home', ev_fp_prince: 'phone', ev_fp_blackout: 'arena',
  ev_fp_capsule: 'phone', ev_fp_slot: 'festival', ev_fp_masked: 'studio',
  ev_fp_suit: 'office', ev_fp_cruise: 'street', ev_fp_glitch: 'phone',
  ev_fp_billboard: 'street',
  // stages & venues
  ev_open_mic: 'stage', ev_wedding: 'stage', ev_battle: 'stage', ev_house_show: 'stage',
  ev_loop_show: 'stage', ev_showcase: 'stage', ev_opener: 'stage', ev_arena: 'arena',
  ev_awards: 'arena', ev_stadium: 'arena', ev_tv_band: 'stage', ev_mudfest: 'festival',
  ev_secret_set: 'festival', ev_clash: 'festival', ev_hometown: 'stage',
  ev_rival_intro: 'stage', ev_rival_showdown: 'arena', ev_hero: 'stage',
  ev_oracle: 'phone', ev_stans: 'phone', ev_feature: 'office', ev_junket: 'phone',
  ev_quote: 'street', ev_ghost_solo: 'studio', ev_gearlord: 'studio', ev_pit: 'stage',
  ev_ai_demo: 'office', ev_vault: 'office', ev_forecast: 'office',
  ev_worldtour: 'arena', ev_persona: 'home', ev_supersession: 'studio',
  ev_fan_gift: 'stage', ev_pawn_upgrade: 'shop', ev_voice_coach: 'home',
  ev_fragment: 'home', ev_song_grows: 'stage', ev_song_finale: 'arena', ev_song_regret: 'phone',
  ev_purists: 'phone', ev_genre_face: 'phone', ev_audit: 'office', ev_profile: 'office',
  ev_karaoke: 'stage', ev_music_store: 'shop', ev_radio: 'studio', ev_subway: 'street', ev_noise_cop: 'home',
  ev_first_bandmate: 'stage', ev_auditions: 'home', ev_stranded: 'street', ev_ultimatum: 'home',
  ev_last_meeting: 'office', ev_last_call: 'studio', ev_last_credits: 'office',
  ev_cb_remembered: 'street', ev_cb_fest: 'festival', ev_cb_exec: 'office', ev_cb_poster: 'stage', ev_cb_band: 'shop',
  ev_sm_meet: 'stage', ev_sm_birthday: 'home', ev_sm_question: 'home',
  ev_db_wire: 'stage', ev_db_tuesday: 'stage', ev_db_jukebox: 'shop', ev_db_inspector: 'street', ev_db_lastcall: 'home',
  ev_bs_van: 'street', ev_bs_merch: 'shop', ev_bs_pearl: 'home',
  ev_bs_parade: 'street', ev_bs_archive: 'studio', ev_bs_clause: 'office',
  ev_wt_offer: 'office', ev_wt_tokyo: 'arena', ev_wt_berlin: 'festival', ev_wt_sp: 'arena',
  ev_cl_dm: 'phone', ev_cl_session: 'studio', ev_cl_reprise: 'stage', ev_cl_regret: 'shop',
  ev_tut_loadin: 'street', ev_tut_sound: 'stage', ev_tut_setlist: 'home', ev_tut_heckler: 'stage',
  ev_tut_green: 'home', ev_tut_opener: 'stage', ev_tut_encore: 'stage', ev_tut_tipjar: 'shop', ev_tut_set: 'stage',
  ev_afterparty: 'home', ev_gala: 'office', ev_woodshed: 'home',
  ev_docu_pitch: 'street', ev_docu_moment: 'stage', ev_docu_premiere: 'arena', ev_checkhell: 'stage', ev_merchline: 'shop', ev_goldhands: 'street', ev_musicvideo: 'festival', ev_masters: 'office', ev_blooper: 'phone', ev_shed: 'home', ev_shed_night: 'studio', ev_shed_album: 'studio', ev_shed_doc: 'studio', ev_shed_someone: 'home', ev_bloom_fest: 'festival', ev_shed_collab: 'home', ev_bloom_amp: 'stage', ev_coverband: 'stage', ev_flyerwar: 'street', ev_opendeck: 'stage', ev_practicewall: 'home', ev_bloom_big: 'arena', ev_summit: 'shop', ev_tv_scout: 'stage', ev_tv_taping: 'arena', ev_truce: 'street', ev_diss: 'phone', ev_venue_trouble: 'stage', ev_loadout: 'street', ev_camp48: 'studio', ev_placement: 'office', ev_heir: 'studio', ev_dc_offer: 'office', ev_dc_blizzard: 'street', ev_dc_birthday: 'home', ev_dc_last: 'stage',
  ev_credits: 'office', ev_loyalty: 'studio', ev_diane: 'arena', ev_prodigy: 'studio',
  // studios
  ev_phone_demo: 'studio', ev_session: 'studio', ev_jingle: 'studio', ev_click: 'studio',
  ev_producer: 'studio', ev_camp: 'studio', ev_topline: 'studio', ev_one_take: 'studio',
  ev_legend: 'studio', ev_secret: 'studio', ev_rival_super: 'studio', ev_band_drama: 'studio',
  // phone / social
  ev_clips: 'phone', ev_trend: 'phone', ev_trend2: 'phone', ev_playlist: 'phone',
  ev_reality: 'phone', ev_scandal: 'phone', ev_leak: 'phone', ev_press: 'phone',
  ev_lineup: 'phone', ev_rival_leap: 'phone', ev_docu: 'phone', ev_craigslist: 'phone',
  // deals & offices
  ev_manager: 'office', ev_union: 'office', ev_splits: 'office', ev_sync: 'office',
  ev_exec: 'office', ev_ghost: 'office', ev_debt: 'office', ev_energy: 'office',
  ev_biopic: 'office', ev_masterclass: 'office', ev_image: 'office', ev_rival_collab: 'office',
  ev_summer: 'office', ev_machine: 'office',
  // street & travel
  ev_busk: 'street', ev_tour: 'street', ev_dayjob: 'street',
  // home & rest
  ev_roommate: 'home', ev_rest: 'home', ev_crash: 'crisis', ev_friend: 'home',
  ev_lessons: 'home', ev_coping_wall: 'crisis', ev_coping_floor: 'home',
  // shops
  ev_pawn_shop: 'shop', ev_gear_shop: 'shop', ev_last_shop: 'shop',
  // endings
  end_megastar_win: 'arena', end_megastar_partial: 'street', end_megastar_fail: 'stage',
  end_studio_win: 'studio', end_studio_partial: 'studio', end_studio_fail: 'studio',
  end_hitfactory_win: 'studio', end_hitfactory_partial: 'office', end_hitfactory_fail: 'office',
  end_burnout: 'office', end_cancelled: 'crisis', end_debt: 'crisis',
};

// Wave-3 slots register alongside their cards (events2.js) so the two files
// can't drift: one entry feeds both the emoji badge and the scene painter.
for (const [slot, v] of Object.entries(ART2)) {
  if (!(slot in EMOJI)) EMOJI[slot] = (v as any).e;
  if (!(slot in SCENE)) SCENE[slot] = (v as any).s;
}

export const MUSIC_ART: Record<string, { e: string; s: string }> = {};
for (const k of new Set([...Object.keys(EMOJI), ...Object.keys(SCENE)])) {
  MUSIC_ART[k] = { e: (EMOJI as any)[k], s: (SCENE as any)[k] };
}
