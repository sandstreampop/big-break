// Love Island — the card-cast strip (presenter.cardCast): the people THIS
// scene is about, shown as portrait chips on the dealt card, during the
// decision — not just on the result beat after it. The villa is a show about
// faces; a card that names {partner}, drags in {rival}, or watches Marco and
// Sophia go up in flames should show those faces while you're deciding, so the
// choice is made looking someone in the eye.
//
// WHO a card features is read from the card's OWN content wherever possible,
// not a hand-kept per-event table: the role tokens the copy already uses
// ({partner}, {rival}, {ex}, {mate}, {bombshell}) name the live seats, and a
// `web:<thread>` tag names that thread's fixed NPC couple (plugins/coupleweb.ts).
// So the strip stays in sync with the writing by construction — add a token,
// get a face. The one hand-authored layer is the structural set-pieces
// (ceremonies, Casa, Movie Night, the Parents, the Final): the copy frames them
// around your couple without ever needing the {partner} token, so they're cast
// by tag/id here — mirroring exactly the scenes villaSetPiece already frames.
// Genuine ensemble/nation/solo cards (a villa-wide prank, a producer's Beach Hut
// question, the 4 a.m. spiral) feature no one in particular and stay faceless
// on purpose — the whole point is "where it makes sense".
//
// Pure function of run state (flavorSeed-seeded flavour draws, never the play
// RNG): re-reads identically on resume, DOM-free, zero golden impact.

import { castById } from './cast.js';
import type { CastMember } from './cast.js';
import { characterRead, MOODS } from './plugins/characters.js';
import type { CharRole } from './plugins/characters.js';
import { THREADS } from './plugins/coupleweb.js';
import { portraitSrc } from './portraits.js';
import { mateFor, bombshellFor, exFor } from './roles.js';
import type { RunState, GameEvent } from '../../types.js';

export interface CastChip {
  name: string; face: string; moodFace?: string | null;
  sub?: string | null; cls?: string; portraitSrc?: string;
}

// The text a player actually reads BEFORE swiping — the scene label, the
// prompt (and its nemesis variant), and the two choice buttons. Outcome copy is
// deliberately excluded: a {rival} that only appears in one branch's result
// isn't in the scene you're looking at. This is the signal for "who's here".
function visibleText(ev: GameEvent): string {
  const parts: (string | undefined)[] = [ev.context, ev.prompt, ev.promptAlt];
  for (const side of ['left', 'right'] as const) {
    const ch = ev.choices?.[side];
    if (ch?.label) parts.push(ch.label);
  }
  return parts.filter(Boolean).join(' ');
}

// A chip for one of the live character seats (partner/rival/bombshell): a real
// portrait when one is wired, the mood face badge + ring tint, and a scene-role
// sub-label (yielding to the mood label when a mood is running). Null when the
// seat is empty.
function seatChip(state: RunState, role: CharRole, sub: string): CastChip | null {
  const c = characterRead(state, role);
  if (!c) return null;
  return {
    name: c.cast.name, face: c.face, moodFace: c.moodFace, portraitSrc: c.portraitSrc,
    sub: c.mood ? MOODS[c.mood].label : sub,
    cls: 'cast-' + (c.mood || 'level'),
  };
}

// A chip for a plain cast member (a web-thread NPC, a flavour Ex/Bestie) — no
// tracked mood, so the neutral ring and the given sub-label.
function castChip(cast: CastMember | null, sub?: string | null): CastChip | null {
  if (!cast) return null;
  return { name: cast.name, face: cast.face, portraitSrc: portraitSrc(cast.id), sub: sub ?? null, cls: 'cast-level' };
}

// The maximum chips a card shows — a phone's card has room for a couple of
// faces above the prompt without crowding it (held to the crowding/mobile
// matrix). The couple-web triangle can name three NPCs; the cap keeps the
// billing to the ones the beat leads with.
const CAP = 3;

// Set-pieces that name specific people in prose rather than a token or a web:
// tag. Kept deliberately tiny — the couple-web callbacks that reference a
// resolved thread by its principals' names. Returns cast ids in billing order.
const SCENE_CAST: Record<string, string[]> = {
  // "Dev and Tash now make tea for the WHOLE villa…" — the slow-burn, canonised.
  li_web_cb_together: ['dev', 'tash'],
};

// The couple-centric scenes whose copy frames your Partner on screen WITHOUT
// ever needing the {partner} token — so they'd read faceless otherwise. Chosen
// by hand against the actual copy (not a broad prefix): the couple-knowledge
// quizzes, the Hideaway, going exclusive, the firepit promise, and the three
// token-less Final host cards. Ambient/ensemble cards (the daybed reputation
// beats, a villa row, the group's last supper) are deliberately NOT here — they
// feature the villa, not your couple.
const PARTNER_SCENES = new Set([
  'li_hideaway_key', 'li_exclusive', 'li_public_promise',
  'li_challenge_couples', 'li_compatibility_quiz',
  'li_final_winvilla', 'li_final_realthing', 'li_final_brand',
]);

// The structural set-pieces the copy stages around your couple without a token.
// Mirrors villaSetPiece / liveRoles (clarity.ts): a recoupling frames the couple
// with the Rival circling; Casa's beats are about the Partner left behind (bar
// the night of new faces — that's the temptation/bombshell seat); Movie Night,
// the Parents, and PARTNER_SCENES put your Partner on screen. Returns ordered
// intents; empty for ensemble cards.
type Intent = { seat: CharRole } | { bombshellTeaser: true };
function structuralIntents(state: RunState, ev: GameEvent): Intent[] {
  const id = ev.id || '';
  const tags: string[] = ev.tags || [];
  const out: Intent[] = [];
  const partner = (): void => { if (state.partner) out.push({ seat: 'partner' }); };
  const rival = (): void => { if (state.rival && (state.flags || []).includes('li_rival_active')) out.push({ seat: 'rival' }); };

  if (tags.includes('recoupling')) { partner(); rival(); return out; }
  if (tags.includes('casa')) { tags.includes('temptation') ? out.push({ bombshellTeaser: true }) : partner(); return out; }
  if (id.startsWith('li_movienight') || id.startsWith('li_parents') || PARTNER_SCENES.has(id)) partner();
  return out;
}

export function villaCardCast(state: RunState, ev: GameEvent): CastChip[] | null {
  if (state.tutorial) return null;
  const text = visibleText(ev);
  const has = (tok: string): boolean => text.includes(tok);
  const tags: string[] = ev.tags || [];

  const chips: CastChip[] = [];
  const seen = new Set<string>();
  const push = (castId: string | null | undefined, chip: CastChip | null): void => {
    if (!chip || !castId || seen.has(castId) || chips.length >= CAP) return;
    seen.add(castId);
    chips.push(chip);
  };
  // A bombshell chip, seated (mood-aware) or a pre-arrival flavour teaser; never
  // when the bombshell IS your partner (no separate face to show).
  const pushBombshell = (sub: string): void => {
    const b = bombshellFor(state);
    if (b && b.id !== state.partner) {
      push(b.id, state.bombshellId === b.id ? seatChip(state, 'bombshell', sub) : castChip(b, sub));
    }
  };

  // 1. A web-thread card is ABOUT its fixed NPC couple — bill them first.
  const webTag = tags.find((t) => t.startsWith('web:'));
  if (webTag) {
    const def = THREADS.find((t) => t.id === webTag.slice(4));
    for (const cid of def?.cast || []) push(cid, castChip(castById(cid)));
  }

  // 2. Prose-named people (couple-web callbacks) the copy states outright.
  for (const cid of SCENE_CAST[ev.id || ''] || []) push(cid, castChip(castById(cid)));

  // 3. Structural set-pieces (ceremonies/Casa/Movie Night/Parents/Final): the
  //    couple the copy frames without a token.
  for (const intent of structuralIntents(state, ev)) {
    if ('bombshellTeaser' in intent) pushBombshell('a new face');
    else if (intent.seat === 'partner') push(state.partner, seatChip(state, 'partner', 'your partner'));
    else if (intent.seat === 'rival') push(state.rival, seatChip(state, 'rival', 'the rival'));
  }

  // 4. The live seats and light roles the copy NAMES in a token, in billing
  //    order. Seats read through characterRead so a real portrait + mood win.
  if (has('{partner}')) push(state.partner, seatChip(state, 'partner', 'your partner'));
  if (has('{rival}')) push(state.rival, seatChip(state, 'rival', 'the rival'));
  if (has('{bombshell}')) pushBombshell('the bombshell');
  if (has('{ex}')) push(exFor(state)?.id, castChip(exFor(state), 'your ex'));
  if (has('{mate}')) {
    const m = mateFor(state);
    push(m?.id, castChip(m, state.bestie ? 'your ride-or-die' : 'your mate'));
  }

  return chips.length ? chips : null;
}
