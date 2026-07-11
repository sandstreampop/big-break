// The Odyssey — names in the sand (I8; NORTH-STAR micro-moment 2). Dead
// rowers are never a number: each loss, the bard names the man once, and
// the bench he rowed from stays empty. The naming is PURE — the k-th man
// lost in a telling with a given flavor seed is always the same man — so
// the amphora (I9) can re-derive the dead without a ledger.
//
// The names are the tale's register: plain men, specific work, Homer's own
// small comedy licensed (the drunk on the roof is canon). Never gore, never
// a stated feeling — a detail a body left behind.

export interface LostMan { name: string; detail: string; }

// The pool. Order matters only as a base rotation; the flavor seed turns it.
export const CREW: LostMan[] = [
  { name: 'Antiphos', detail: 'who rowed with his tongue out when the water fought' },
  { name: 'Eurylochos’s cousin', detail: 'who owed him money' },
  { name: 'Polites', detail: 'who sang the stroke-count when the fog came down' },
  { name: 'old Perimedes', detail: 'who lashed the jars without being told' },
  { name: 'Stichios', detail: 'who could splice a line in the dark' },
  { name: 'the boy from Same', detail: 'who lied about his age to board' },
  { name: 'Thoon', detail: 'who kept figs in his cloak for the bad watches' },
  { name: 'Mastor’s son', detail: 'who never once lost at knucklebones' },
  { name: 'Alkandros', detail: 'who mended sails with a net-maker’s knots' },
  { name: 'the twins’ eldest', detail: 'who took both their watches the night they were sick' },
  { name: 'Grinos', detail: 'who swore he could smell land two days out' },
  { name: 'Medon the wide', detail: 'who filled a bench and a half and pulled like three' },
  { name: 'Eurybates', detail: 'who taught the young ones the beach games of Ithaca' },
  { name: 'the priest’s nephew', detail: 'who poured first to the gods even on short water' },
  { name: 'Kaletor', detail: 'who whittled little horses for his daughters' },
  { name: 'Noemon', detail: 'who talked to the mast and swore it listened' },
  { name: 'the smith from Doulikhion', detail: 'who could straighten a bent spearhead over a beach fire' },
  { name: 'Phronios', detail: 'who remembered every man’s home port when they forgot it themselves' },
];

// The k-th man lost this telling (0-indexed), turned by the flavor seed so
// different tellings mourn in a different order — but THIS telling's k-th
// loss is always the same man, on the result and later on the vase.
export function lostMan(flavorSeed: number, k: number): LostMan {
  const turn = Math.abs(Math.trunc(flavorSeed || 1)) % CREW.length;
  return CREW[(turn + k) % CREW.length];
}

// How many men the telling started with (the fisherman's hearth lays on two
// more) — the count the losses are measured against.
export function crewAtLaunch(loadout: string | undefined): number {
  return 12 + (loadout === 'fishermans_hearth' ? 2 : 0);
}
