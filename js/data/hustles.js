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
];

export function hustleById(id) {
  return HUSTLES.find((h) => h.id === id) || null;
}
