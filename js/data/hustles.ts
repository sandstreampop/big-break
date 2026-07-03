// Side hustles: persistent income sources granted by specific outcomes
// (effect key: grantHustle). Each pays out at every subsequent act start —
// and once more at the finale — so early windfalls compound.

export const HUSTLES = [
  { id: 'residency', name: 'Monthly Residency', icon: '🗓️', moneyPerAct: 60,
    blurb: 'The venue owner liked that you didn’t enter the rigged contest.' },
  { id: 'sleep_podcast', name: 'Sleep-Podcast Royalties', icon: '😴', moneyPerAct: 45,
    blurb: 'Thousands of strangers dream to your drone. They pay by the snore.' },
  { id: 'compost_corner', name: 'The Compost Corner', icon: '🥬', moneyPerAct: 30,
    blurb: 'Your corner. Your regulars. Your economy. Slight smell.' },
  { id: 'merch_line', name: 'Haunted Mall Merch', icon: '👕', moneyPerAct: 80,
    blurb: 'You are a phrase people wear.' },
  { id: 'jingle_residuals', name: 'Tri-County Jingle Residuals', icon: '🛏️', moneyPerAct: 55,
    blurb: 'Children sing it. The checks arrive quarterly, which here means per act.' },
  { id: 'hook_licenses', name: 'Hook Licensing', icon: '🗝️', moneyPerAct: 70,
    blurb: 'The vault appreciates in mystery. Publishers bid on rumors.' },
  { id: 'masterclass_income', name: 'Masterclass Passive Income', icon: '🧑‍🏫', moneyPerAct: 90,
    blurb: '“Unlock your flow-state.” You said it once. Ironically.' },
  { id: 'shed_rental', name: 'Shed Hours', icon: '🛖', moneyPerAct: 65,
    blurb: 'The scene’s favorite cheap room. “Recorded at The Shed” is a badge now.' },
  { id: 'wedding_circuit', name: 'The Wedding Circuit', icon: '💒', moneyPerAct: 75,
    blurb: 'One grandmother’s booking became a referral network. You know every venue’s power situation by heart.' },
  { id: 'sync_royalties', name: 'Sync Royalties', icon: '📺', moneyPerAct: 85,
    blurb: 'Your faded single sells yogurt now. The song died on the chart and got a better job.' },

  // Wave 2: ten more ways the music pays for the music.
  { id: 'lesson_studio', name: 'Tiny Prodigies LLC', icon: '🧒', moneyPerAct: 50,
    blurb: 'Six students, five recorders, one future. The parents pay a semester in advance.' },
  { id: 'corner_atlas', name: 'The Busker Atlas', icon: '🗺️', moneyPerAct: 40,
    blurb: 'You sold laminated maps of the good corners. The bagpiper bought two.' },
  { id: 'ringtone_shop', name: 'Custom Ringtones', icon: '📳', moneyPerAct: 55,
    blurb: 'Forty bucks a pop to make a stranger’s phone unbearable in their voice of choice. Yours.' },
  { id: 'karaoke_host', name: 'Karaoke Tuesdays', icon: '🎙️', moneyPerAct: 65,
    blurb: 'You host, you judge, you key-change for the weak. Beloved. Feared. Tipped.' },
  { id: 'pedal_flipping', name: 'Pedal Flipping', icon: '🔁', moneyPerAct: 70,
    blurb: 'Buy broken, solder, sell “vintage.” The margin is the mythology.' },
  { id: 'hold_music', name: 'Hold Music (Regional Bank)', icon: '☎️', moneyPerAct: 60,
    blurb: 'Four hundred people a day hear your étude and hate it. Royalties don’t care.' },
  { id: 'ghost_sessions', name: 'Ghost Sessions', icon: '🕶️', moneyPerAct: 85,
    blurb: 'You play on tracks by artists you legally cannot name. The NDA has a groove to it.' },
  { id: 'alarm_app', name: 'Wake-Up App Placement', icon: '⏰', moneyPerAct: 45,
    blurb: 'Ten thousand strangers wake to your gentlest chord. Nine thousand snooze it. Money either way.' },
  { id: 'supper_club', name: 'Supper Club Sundays', icon: '🍷', moneyPerAct: 75,
    blurb: 'Standards at dinner volume for people who call you “the entertainment.” The tips are folded like secrets.' },
  { id: 'sample_packs', name: 'Sample Pack Sales', icon: '📦', moneyPerAct: 80,
    blurb: 'Producers worldwide buy your kitchen sounds. The faucet gets a writing credit.' },
];

export function hustleById(id) {
  return HUSTLES.find((h) => h.id === id) || null;
}
