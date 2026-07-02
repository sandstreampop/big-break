// Art system (spec §11). Real assets registered in js/data/assets.js always
// win; otherwise each slot renders a generated SVG scene — a composed
// illustration picked by slot id, tinted deterministically, with the slot's
// emoji as a small corner badge. The slot id lives in a title attribute for
// the illustrator's reference.

import { ASSET_MANIFEST } from './data/assets.js';

const EMOJI = {
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
  instrument_modular: '🎛️',
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

// Which composed scene each event/ending slot uses
const SCENE = {
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

function hueFor(slot) {
  let h = 0;
  for (let i = 0; i < slot.length; i++) h = (h * 31 + slot.charCodeAt(i)) % 360;
  return h;
}

function emojiFor(slot) {
  if (EMOJI[slot]) return EMOJI[slot];
  if (slot.startsWith('instrument_')) return '🎼';
  if (slot.startsWith('gear_')) return '🧰';
  if (slot.startsWith('end_')) return '🎬';
  return '🎵';
}

// ---------- SVG scene painters (viewBox 320x200) ----------
// All scenes share a moody two-stop background and flat silhouette shapes.

function crowd(y, n, r, fill) {
  let s = '';
  for (let i = 0; i < n; i++) {
    const x = 8 + (i * 312) / n + ((i * 37) % 11) - 5;
    const yy = y + ((i * 23) % 9);
    s += `<circle cx="${x}" cy="${yy}" r="${r + ((i * 13) % 3)}" fill="${fill}"/>`;
  }
  return s;
}

const SCENES = {
  stage: (h) => `
    <polygon points="70,0 20,200 150,200" fill="hsla(${h},70%,80%,.10)"/>
    <polygon points="250,0 170,200 300,200" fill="hsla(${(h + 40) % 360},70%,80%,.13)"/>
    <rect x="0" y="168" width="320" height="32" fill="hsla(0,0%,0%,.35)"/>
    <line x1="160" y1="70" x2="160" y2="168" stroke="hsla(0,0%,95%,.55)" stroke-width="3"/>
    <circle cx="160" cy="64" r="9" fill="hsla(0,0%,95%,.75)"/>
    <line x1="146" y1="168" x2="174" y2="168" stroke="hsla(0,0%,95%,.55)" stroke-width="4"/>
    ${crowd(186, 16, 6, `hsla(${h},30%,8%,.9)`)}
    <circle cx="60" cy="30" r="2" fill="hsla(${h},90%,80%,.7)"/>
    <circle cx="284" cy="44" r="2.5" fill="hsla(${(h + 60) % 360},90%,80%,.6)"/>
    <circle cx="230" cy="18" r="1.8" fill="hsla(${(h + 120) % 360},90%,85%,.7)"/>`,
  arena: (h) => `
    ${crowd(40, 26, 3, `hsla(${h},60%,75%,.35)`)}
    ${crowd(60, 22, 3.5, `hsla(${h},60%,70%,.3)`)}
    ${crowd(82, 18, 4, `hsla(${h},50%,65%,.25)`)}
    <polygon points="40,0 0,140 90,140" fill="hsla(${h},80%,85%,.12)"/>
    <polygon points="160,0 120,150 200,150" fill="hsla(${(h + 30) % 360},80%,85%,.15)"/>
    <polygon points="280,0 230,140 320,140" fill="hsla(${(h + 60) % 360},80%,85%,.12)"/>
    <rect x="0" y="150" width="320" height="50" fill="hsla(0,0%,0%,.4)"/>
    <circle cx="160" cy="130" r="10" fill="hsla(0,0%,95%,.8)"/>
    <rect x="156" y="138" width="8" height="24" rx="3" fill="hsla(0,0%,95%,.6)"/>
    ${crowd(178, 20, 6, `hsla(${h},30%,6%,.95)`)}`,
  festival: (h) => `
    <polygon points="60,120 110,60 160,120" fill="hsla(${h},45%,55%,.5)"/>
    <polygon points="150,130 210,55 270,130" fill="hsla(${(h + 30) % 360},45%,45%,.55)"/>
    <line x1="110" y1="60" x2="110" y2="120" stroke="hsla(0,0%,0%,.25)" stroke-width="2"/>
    <circle cx="52" cy="30" r="14" fill="hsla(${(h + 180) % 360},80%,80%,.5)"/>
    <rect x="0" y="150" width="320" height="50" fill="hsla(${h},25%,12%,.8)"/>
    <path d="M0,160 Q60,148 120,158 T240,156 T320,160 V200 H0 Z" fill="hsla(${h},35%,18%,.9)"/>
    ${crowd(178, 18, 5.5, `hsla(${h},30%,7%,.9)`)}
    <line x1="20" y1="12" x2="300" y2="26" stroke="hsla(0,0%,90%,.18)" stroke-width="2"/>
    <circle cx="90" cy="15" r="3" fill="hsla(${h},90%,75%,.8)"/>
    <circle cx="170" cy="20" r="3" fill="hsla(${(h + 90) % 360},90%,75%,.8)"/>
    <circle cx="250" cy="24" r="3" fill="hsla(${(h + 180) % 360},90%,75%,.8)"/>`,
  studio: (h) => `
    <rect x="24" y="22" width="272" height="70" rx="8" fill="hsla(${h},35%,30%,.45)"/>
    <polyline points="40,57 70,45 95,68 120,38 150,62 180,48 210,70 240,42 268,57"
      fill="none" stroke="hsla(${(h + 40) % 360},85%,72%,.85)" stroke-width="3" stroke-linecap="round"/>
    <rect x="0" y="120" width="320" height="80" fill="hsla(0,0%,0%,.35)"/>
    <rect x="16" y="128" width="288" height="58" rx="8" fill="hsla(${h},25%,20%,.9)"/>
    ${[0, 1, 2, 3, 4, 5, 6, 7].map((i) =>
      `<circle cx="${44 + i * 34}" cy="146" r="6" fill="hsla(${(h + i * 22) % 360},60%,60%,.8)"/>` +
      `<rect x="${40 + i * 34}" y="160" width="8" height="18" rx="3" fill="hsla(0,0%,85%,.5)"/>`
    ).join('')}
    <circle cx="292" cy="34" r="5" fill="hsla(0,90%,60%,.9)"/>`,
  phone: (h) => `
    <rect x="108" y="18" width="104" height="176" rx="16" fill="hsla(0,0%,5%,.7)"/>
    <rect x="116" y="30" width="88" height="152" rx="8" fill="hsla(${h},45%,35%,.7)"/>
    <rect x="124" y="42" width="72" height="10" rx="5" fill="hsla(0,0%,95%,.35)"/>
    <rect x="124" y="60" width="52" height="8" rx="4" fill="hsla(0,0%,95%,.22)"/>
    <rect x="124" y="110" width="72" height="34" rx="6" fill="hsla(${(h + 40) % 360},60%,55%,.5)"/>
    <path d="M60,150 c-8,-10 8,-22 12,-8 c4,-14 20,-2 12,8 l-12,12 Z" fill="hsla(340,85%,65%,.85)"/>
    <path d="M244,110 c-6,-8 6,-17 9,-6 c3,-11 15,-2 9,6 l-9,9 Z" fill="hsla(340,85%,70%,.7)"/>
    <path d="M256,60 c-5,-6 5,-13 7,-5 c2,-8 12,-1 7,5 l-7,7 Z" fill="hsla(340,85%,75%,.55)"/>
    <circle cx="70" cy="60" r="10" fill="hsla(${(h + 180) % 360},70%,70%,.5)"/>
    <text x="70" y="65" font-size="12" text-anchor="middle" fill="hsla(0,0%,10%,.8)">+1</text>`,
  office: (h) => `
    <rect x="0" y="0" width="320" height="14" fill="hsla(${h},20%,60%,.15)"/>
    <rect x="0" y="22" width="320" height="14" fill="hsla(${h},20%,60%,.12)"/>
    <rect x="0" y="44" width="320" height="14" fill="hsla(${h},20%,60%,.09)"/>
    <rect x="0" y="140" width="320" height="60" fill="hsla(${h},25%,18%,.85)"/>
    <rect x="60" y="92" width="110" height="72" rx="4" fill="hsla(0,0%,96%,.85)" transform="rotate(-3 115 128)"/>
    ${[0, 1, 2, 3].map((i) => `<rect x="72" y="${104 + i * 13}" width="${84 - i * 12}" height="5" rx="2.5" fill="hsla(${h},15%,45%,.5)" transform="rotate(-3 115 128)"/>`).join('')}
    <line x1="210" y1="150" x2="248" y2="112" stroke="hsla(${(h + 40) % 360},70%,65%,.9)" stroke-width="5" stroke-linecap="round"/>
    <circle cx="272" cy="128" r="14" fill="hsla(${h},40%,35%,.8)"/>
    <rect x="264" y="112" width="16" height="6" rx="3" fill="hsla(${h},40%,45%,.8)"/>
    <path d="M286,124 q10,4 0,10" fill="none" stroke="hsla(0,0%,90%,.4)" stroke-width="2"/>`,
  street: (h) => `
    ${[0, 1, 2, 3, 4].map((i) => {
      const x = i * 68 - 10, w = 52 + ((i * 17) % 20), ht = 70 + ((i * 43) % 60);
      let win = '';
      for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) {
        if ((i + r + c) % 3 !== 0) win += `<rect x="${x + 8 + c * 14}" y="${150 - ht + 10 + r * 16}" width="7" height="9" fill="hsla(45,90%,70%,.55)"/>`;
      }
      return `<rect x="${x}" y="${150 - ht}" width="${w}" height="${ht}" fill="hsla(${h},22%,${16 + i * 3}%,.95)"/>` + win;
    }).join('')}
    <rect x="0" y="150" width="320" height="50" fill="hsla(${h},15%,10%,.95)"/>
    <line x1="0" y1="170" x2="320" y2="170" stroke="hsla(0,0%,90%,.12)" stroke-width="2" stroke-dasharray="14 10"/>
    <line x1="262" y1="70" x2="262" y2="150" stroke="hsla(0,0%,80%,.5)" stroke-width="3"/>
    <circle cx="262" cy="66" r="6" fill="hsla(45,95%,75%,.9)"/>
    <polygon points="262,70 244,150 280,150" fill="hsla(45,95%,75%,.12)"/>`,
  home: (h) => `
    <rect x="36" y="24" width="120" height="96" rx="6" fill="hsla(${(h + 200) % 360},45%,28%,.7)"/>
    <line x1="96" y1="24" x2="96" y2="120" stroke="hsla(0,0%,0%,.3)" stroke-width="3"/>
    <line x1="36" y1="72" x2="156" y2="72" stroke="hsla(0,0%,0%,.3)" stroke-width="3"/>
    <circle cx="128" cy="52" r="13" fill="hsla(52,90%,88%,.85)"/>
    <circle cx="123" cy="48" r="12" fill="hsla(${(h + 200) % 360},45%,28%,1)"/>
    <rect x="0" y="152" width="320" height="48" fill="hsla(${h},20%,14%,.9)"/>
    <rect x="196" y="120" width="100" height="34" rx="8" fill="hsla(${h},35%,32%,.85)"/>
    <rect x="204" y="108" width="26" height="18" rx="6" fill="hsla(0,0%,92%,.7)"/>
    <text x="262" y="96" font-size="18" fill="hsla(0,0%,90%,.45)" font-family="serif" font-style="italic">z</text>
    <text x="274" y="82" font-size="14" fill="hsla(0,0%,90%,.35)" font-family="serif" font-style="italic">z</text>
    <rect x="60" y="132" width="10" height="20" fill="hsla(${(h + 100) % 360},50%,40%,.8)"/>
    <circle cx="65" cy="126" r="9" fill="hsla(${(h + 100) % 360},55%,45%,.9)"/>`,
  shop: (h) => `
    ${[0, 1, 2].map((r) => `<rect x="16" y="${44 + r * 48}" width="288" height="5" rx="2.5" fill="hsla(${h},25%,45%,.6)"/>`).join('')}
    ${[0, 1, 2].map((r) => [0, 1, 2, 3, 4].map((c) => {
      const w = 30 + ((r * 5 + c * 7) % 18);
      return `<rect x="${26 + c * 56}" y="${20 + r * 48}" width="${w}" height="22" rx="4"
        fill="hsla(${(h + r * 40 + c * 25) % 360},45%,${34 + ((r + c) % 3) * 8}%,.85)"/>`;
    }).join('')).join('')}
    <rect x="0" y="168" width="320" height="32" fill="hsla(${h},20%,12%,.9)"/>
    <ellipse cx="252" cy="120" rx="16" ry="20" fill="hsla(${(h + 60) % 360},55%,45%,.9)"/>
    <rect x="248" y="82" width="8" height="26" rx="3" fill="hsla(${(h + 60) % 360},45%,35%,.9)"/>
    <rect x="60" y="150" width="26" height="14" rx="3" fill="hsla(48,85%,70%,.85)"/>
    <text x="73" y="161" font-size="10" text-anchor="middle" fill="hsla(0,0%,10%,.8)">$</text>`,
  crisis: (h) => `
    ${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
      const a = (i * Math.PI) / 4;
      const x = 160 + Math.cos(a) * 340, y = 100 + Math.sin(a) * 340;
      return `<polygon points="160,100 ${x - 30},${y} ${x + 30},${y}" fill="hsla(${(h + i * 8) % 360},70%,55%,.07)"/>`;
    }).join('')}
    <circle cx="160" cy="100" r="44" fill="hsla(${h},60%,45%,.25)"/>
    <circle cx="160" cy="100" r="30" fill="hsla(${h},70%,50%,.3)"/>
    <rect x="152" y="76" width="16" height="32" rx="7" fill="hsla(0,0%,95%,.85)"/>
    <circle cx="160" cy="122" r="7" fill="hsla(0,0%,95%,.85)"/>`,
};

function sceneFor(slot) {
  if (SCENE[slot]) return SCENE[slot];
  if (slot.startsWith('instrument_') || slot.startsWith('gear_')) return 'pedestal';
  return 'stage';
}

function svgFor(slot, wide) {
  const h = hueFor(slot);
  const scene = sceneFor(slot);
  const bg = `<defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="hsl(${h} 42% 22%)"/>
    <stop offset="1" stop-color="hsl(${(h + 45) % 360} 50% 12%)"/>
  </linearGradient></defs>
  <rect width="320" height="200" fill="url(#bg)"/>`;
  let body;
  if (scene === 'pedestal') {
    body = `
      <circle cx="160" cy="86" r="52" fill="hsla(${h},70%,70%,.14)"/>
      <circle cx="160" cy="86" r="34" fill="hsla(${h},70%,75%,.12)"/>
      <rect x="110" y="130" width="100" height="14" rx="7" fill="hsla(0,0%,0%,.35)"/>
      <text x="160" y="104" font-size="52" text-anchor="middle">${emojiFor(slot)}</text>`;
    return `<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">${bg}${body}</svg>`;
  }
  body = SCENES[scene](h);
  const badge = `
    <circle cx="292" cy="176" r="17" fill="hsla(0,0%,0%,.45)"/>
    <text x="292" y="183" font-size="19" text-anchor="middle">${emojiFor(slot)}</text>`;
  return `<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">${bg}${body}${badge}</svg>`;
}

// Returns an element for the art slot (img if a real asset exists,
// otherwise a generated SVG scene).
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
  div.className = className + ' art-scene';
  div.title = slot; // illustrator reference
  div.innerHTML = svgFor(slot);
  return div;
}
