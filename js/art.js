// Placeholder art system (spec §11). Every card/instrument/accessory names
// an art slot; ASSETS maps slot -> file path once real art exists. A null
// path renders a labeled placeholder frame (deterministic color + emoji),
// so an illustrator can swap art in with zero code changes.
// The illustrator-facing manifest with dimensions lives in assets/assets.json.

import { ASSET_MANIFEST } from './data/assets.js';

const EMOJI = {
  instrument: '🎼', gear: '🧰', end: '🎬',
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
  ev_clash: '⚔️',
  instrument_kazoo: '🎺', instrument_melodica: '🎹', instrument_buckets: '🥁',
  instrument_cigarbox: '🎸', instrument_glock: '🔔', instrument_theremin: '👋',
  instrument_electric: '🎸', instrument_sampler: '🎛️', instrument_voice: '🗣️',
  gear_amp: '🔊', gear_loop: '🔁', gear_pedalboard: '🎚️', gear_pick: '🪙',
  gear_inears: '🎧', gear_mic: '🎙️', gear_energy: '⚡', gear_manager: '💳',
  gear_van: '🚐', gear_ringlight: '💡', gear_rolodex: '📇',
  end_megastar_win: '🌟', end_megastar_partial: '🚌', end_megastar_fail: '📉',
  end_studio_win: '📞', end_studio_partial: '🥈', end_studio_fail: '🙏',
  end_hitfactory_win: '🏭', end_hitfactory_partial: '📀', end_hitfactory_fail: '🗄️',
  end_burnout: '💼', end_cancelled: '🚫', end_debt: '📋',
};

function hueFor(slot) {
  let h = 0;
  for (let i = 0; i < slot.length; i++) h = (h * 31 + slot.charCodeAt(i)) % 360;
  return h;
}

function emojiFor(slot) {
  if (EMOJI[slot]) return EMOJI[slot];
  if (slot.startsWith('instrument_')) return EMOJI.instrument;
  if (slot.startsWith('gear_')) return EMOJI.gear;
  if (slot.startsWith('end_')) return EMOJI.end;
  return '🎵';
}

// Returns an element for the art slot (img if a real asset exists,
// otherwise a stylized placeholder frame).
export function artFor(slot, className = 'art') {
  const path = ASSET_MANIFEST[slot]?.path;
  if (path) {
    const img = document.createElement('img');
    img.src = path;
    img.alt = '';
    img.className = className;
    img.draggable = false;
    return img;
  }
  const div = document.createElement('div');
  div.className = className + ' art-placeholder';
  const h = hueFor(slot);
  div.style.background =
    `linear-gradient(145deg, hsl(${h} 45% 24%), hsl(${(h + 40) % 360} 55% 14%))`;
  div.innerHTML = `<span class="art-emoji">${emojiFor(slot)}</span>` +
    `<span class="art-slot-id">${slot}</span>`;
  return div;
}
