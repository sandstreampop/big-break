// The Edit — Love Island's gear reskin (grill.md: reuses music's gear almost
// exactly). An Angle is one reputation trait you're becoming known for: a
// slot-limited, tag-matched roll modifier bought with Graft at the daybed.
// Buying when full swaps and discards (the UI's chooser); `loseOnBad` means a
// fragile Angle gets EXPOSED — it falls off on a botched flagship moment.
// No upkeep (dropped deliberately, per the design record).
//
// Shape mirrors music's accessories where the engine/UI reads it generically:
// { id, name, art, flavor, blurb, modifier, appliesTo, loseOnBad?,
//   compatibility: { universal: true } } — universal, so every Angle is live
// for every Type (the UI's dormant-gear check never benches one).

export interface Angle {
  id: string;
  name: string;
  art: string;
  flavor: string;
  blurb: string;
  modifier: number;
  appliesTo: string[];
  loseOnBad?: boolean;
  compatibility: { universal: true };
}

export const ANGLES: Angle[] = [
  {
    id: 'angle_loyal', name: 'The Loyal One', art: 'li_angle_loyal',
    flavor: 'You’d never play a game. You say so, twice a day, to camera.',
    blurb: '+8 on loyal and chat choices.',
    modifier: 8, appliesTo: ['loyal', 'chat'],
    compatibility: { universal: true },
  },
  {
    id: 'angle_villain', name: 'The Villain', art: 'li_angle_villain',
    flavor: 'Somebody has to say it. You’ve decided it’s you.',
    blurb: '+10 on drama choices — but one botched scene and you’re exposed.',
    modifier: 10, appliesTo: ['drama'], loseOnBad: true,
    compatibility: { universal: true },
  },
  {
    id: 'angle_comedy', name: 'Comedy Gold', art: 'li_angle_comedy',
    flavor: 'Not the best-looking. The most quotable. It’s a longer game.',
    blurb: '+8 on challenge and banter choices.',
    modifier: 8, appliesTo: ['challenge', 'banter'],
    compatibility: { universal: true },
  },
  {
    id: 'angle_type', name: 'Everyone’s Type', art: 'li_angle_type',
    flavor: 'Three Islanders have called you “dangerous.” They meant it nicely.',
    blurb: '+8 on flirt and date choices.',
    modifier: 8, appliesTo: ['flirt', 'date'],
    compatibility: { universal: true },
  },
  {
    id: 'angle_camera', name: 'Camera-Ready', art: 'li_angle_camera',
    flavor: 'You know where the lens is. The lens knows where you are. It’s mutual.',
    blurb: '+8 on camera and graft choices.',
    modifier: 8, appliesTo: ['camera', 'graft'],
    compatibility: { universal: true },
  },
  {
    id: 'angle_strategist', name: 'The Strategist', art: 'li_angle_strategist',
    flavor: 'You have a spreadsheet. It is emotional. It is also a spreadsheet.',
    blurb: '+8 on strategy and recoupling choices.',
    modifier: 8, appliesTo: ['strategy', 'recoupling'],
    compatibility: { universal: true },
  },
];

export function angleById(id: string | null | undefined): Angle | null {
  return ANGLES.find((a) => a.id === id) || null;
}
