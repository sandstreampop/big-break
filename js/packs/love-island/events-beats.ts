// Love Island — the structural beats: everything production forces into the
// Season. Chains (arrival, Casa Amor, the exposed Recoupling and its verdicts,
// the wobbles) plus the scheduled windows (Bombshells, Movie Night, the girls’
// Recoupling, Meet the Parents), the daybed graft beats, and the three Final
// cards. Voice per docs/games/love-island/VOICE.md; whole-scene reference in
// GUIDING_EXAMPLES.md. Tags `text`/`host` drive the presenter’s authority
// styling; `beat:<key>` tags are the producers plugin’s delivery windows.

import type { GameEvent } from '../../types.js';

export const BEAT_EVENTS: GameEvent[] = [

  // ---------- The arrival: first coupling, card one ----------
  {
    id: 'li_arrival', act: 1, chainOnly: true, tags: ['text'],
    art: 'li_arrival',
    context: 'Day 1 · the lawn · “TEXT! I’VE GOT A TEXT!!”',
    prompt: '“Islanders, it’s time to couple up. Step forward for the person you want. #shootyourshot” — Six strangers in swimwear are arranged like a menu. The nation is already deciding what you are. So, in the next thirty seconds, are you.',
    recap: 'Day 1 on the lawn — first pick of who to couple up with.',
    choices: {
      left: {
        label: 'Go with your gut',
        tags: ['flirt', 'date'],
        governingStats: { rizz: 1 },
        outcomes: {
          bad: { text: '“Oh — hi,” says the smile, which was aimed at someone behind you. You couple up anyway, both pretending this is fine, live, forever.', effects: { couple: true, rizz: 2, public: 2 } },
          good: { text: '“Took you long enough,” they murmur as you step forward — not surprised at all. In here, not-surprised is a love language.', effects: { couple: true, rizz: 5, public: 3 } },
          incredible: { text: 'You step forward and two other people visibly deflate. The nation clocks it. Day one, and you’re already a storyline.', effects: { couple: true, rizz: 8, public: 5, followers: 4 } },
        },
      },
      right: {
        label: 'Pick with your head',
        tags: ['strategy'],
        governingStats: { savvy: 1 },
        outcomes: {
          bad: { text: 'You pick the safe option. The safe option immediately describes you to camera as “a slow burner,” which is villa for furniture.', effects: { couple: true, savvy: 2, public: 2 } },
          good: { text: 'You pick the one nobody will fight you for. Boring is underrated. Boring survives week one.', effects: { couple: true, savvy: 5, public: 3 } },
          incredible: { text: 'You read the whole lawn in one pass and pick the exact couple-shaped gap in it. A producer, somewhere, updates a whiteboard.', effects: { couple: true, savvy: 8, public: 4, graft: 3 } },
        },
      },
    },
  },

  // The Bombshell persona's arrival (R8/C3a): unlockable-only, so it never
  // enters seeded sims. Day one is a steal, not a mixer.
  {
    id: 'li_arrival_bomb', act: 1, chainOnly: true, tags: ['text', 'camera'],
    art: 'li_bombshell',
    context: 'Their day 9 · your day 1 · the lawn goes quiet',
    prompt: '“Islanders — say hello to your newest arrival. #latecheckin” You walk in slow, the way the promo taught you. Six settled couples look up, and every single one does the same maths at the same time. You’re not joining this villa. You’re happening to it.',
    recap: 'You arrive on their day 9 — six settled couples, and you’re the new energy.',
    choices: {
      left: {
        label: 'Pick a target tonight',
        tags: ['flirt', 'strategy'],
        governingStats: { rizz: 0.6, savvy: 0.4 },
        outcomes: {
          bad: { text: 'You pull the best-looking one for a chat and their other half joins it, uninvited, with a smile you’ll be seeing again. Coupled by midnight — surveilled by one.', effects: { couple: true, rizz: 2, followers: 3, addFlag: 'li_rival_active', rivalMood: 'fuming' } },
          good: { text: '“Sorry — is this seat taken?” It was. It isn’t now. The villa recalculates over dinner; the nation does it faster.', effects: { couple: true, rizz: 5, followers: 5, public: 3 } },
          incredible: { text: 'One chat. ONE. And the strongest couple on the lawn is suddenly a press release. You didn’t break a rule; you just walked in with better lighting.', effects: { couple: true, rizz: 8, followers: 8, public: 5 } },
        },
      },
      right: {
        label: 'Let them come to you',
        tags: ['camera', 'rest'],
        governingStats: { charisma: 1 },
        outcomes: {
          bad: { text: 'You hold court at the breakfast bar and nobody quite dares. Respect, at a distance, on camera. The distance is the problem.', effects: { charisma: 2, followers: 3, public: 2 } },
          good: { text: 'You unpack, slowly, in full view, and let the villa’s nerves do your grafting. Two of them crack by sundown and bring you juice.', effects: { charisma: 5, followers: 5, public: 3 } },
          incredible: { text: 'By evening there’s a queue — a polite, terrified queue — for “a quick chat.” You’ve been here nine hours and you’re already the storyline.', effects: { charisma: 8, followers: 7, public: 5, graft: 3 } },
        },
      },
    },
  },

  // ---------- Casa Amor (ADR-0002; v4 S2: week 3's end-of-week tentpole —
  // the beat window fires this Text on the week's last slot and the 5-card
  // arc overruns the nominal length, so the week CLOSES on the return) ----------
  {
    id: 'li_casa_text', act: 2, weight: 1, tags: ['beat:casa', 'text', 'casa'],
    art: 'li_casa_text',
    context: 'Dawn · the villa · “I’VE GOT A TEXT!!”',
    prompt: '“Islanders, the villa is splitting. One group will spend the next few days at Casa Amor — with six brand-new arrivals. Pack a bag. #outofsightoutofmind” — Your couple gets ninety seconds to say goodbye. Somebody’s already crying. Nothing has happened yet. Nothing ever needs to.',
    recap: 'The villa splits for Casa Amor — ninety seconds to say goodbye.',
    choices: {
      left: {
        label: 'Say a proper goodbye',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: 'You go for meaningful eye contact and deliver, instead, the face of someone remembering they left straighteners on. It airs.', effects: { chainEventId: 'li_casa_night', loyalty: 2, burnout: 3 } },
          good: { text: '“Don’t do anything I wouldn’t,” you say, and mean it as a joke, and don’t mean it as a joke at all.', effects: { chainEventId: 'li_casa_night', bond: 3, loyalty: 5 } },
          incredible: { text: 'The goodbye is so solid the other couples look away, embarrassed by their own. The nation makes a compilation of it by lunch.', effects: { loyalty: 8, chainEventId: 'li_casa_night', bond: 5, public: 5 } },
        },
      },
      right: {
        label: 'Keep it breezy',
        tags: ['strategy', 'banter'],
        governingStats: { savvy: 0.7, charisma: 0.3 },
        outcomes: {
          bad: { text: '“A wave,” your partner will say, at length, to six new people, for three days. You waved. A wave.', effects: { chainEventId: 'li_casa_night', burnout: 4, savvy: 2 } },
          good: { text: 'No tears, no speeches, one raised eyebrow that says <i>behave</i>. Economical. The edit respects economy.', effects: { chainEventId: 'li_casa_night', savvy: 5, public: 3 } },
          incredible: { text: 'You leave them laughing, which is the only exit that survives a highlights reel. Confidence reads as a plan even when it’s a shrug.', effects: { chainEventId: 'li_casa_night', savvy: 8, public: 5, graft: 3 } },
        },
      },
    },
  },
  {
    id: 'li_casa_night', act: 2, chainOnly: true, tags: ['casa', 'temptation'],
    art: 'li_casa_night',
    context: 'Casa Amor · night 2 · six new faces',
    prompt: 'Six new arrivals, one duvet each, and a partner one postcode and one production decision away. Everything you do here, they’ll find out about. Not tonight. But they will.',
    recap: 'Casa Amor, night two — six new faces and {partner} a postcode away.',
    choices: {
      left: {
        label: 'Stay loyal',
        tags: ['loyal'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: 'You sleep on the daybed to be safe. You wake up stiff, righteous, and quietly furious at no one in particular.', effects: { loyalty: 2, chainEventId: 'li_casa_postcard_loyal', casaLoyaltyDraw: true, bond: 3, burnout: 3, addFlag: 'li_loyal_casa' } },
          good: { text: '“My head’s not been turned, not even a bit,” you tell the new lot, till they give up. One calls you “boring.” You take it as a compliment, because it is one.', effects: { loyalty: 5, chainEventId: 'li_casa_postcard_loyal', casaLoyaltyDraw: true, bond: 5, public: 4, addFlag: 'li_loyal_casa' } },
          incredible: { text: 'You don’t waver, and on camera it reads as strength, not fear. The public falls a little in love with you, which was not the plan, and helps enormously.', effects: { loyalty: 8, chainEventId: 'li_casa_postcard_loyal', casaLoyaltyDraw: true, bond: 6, public: 6, graft: 4, addFlag: 'li_loyal_casa' } },
        },
      },
      right: {
        label: 'Let your head turn',
        tags: ['flirt', 'temptation', 'drama'],
        governingStats: { rizz: 1, savvy: 0.3 },
        outcomes: {
          bad: { text: '“Wow,” you both say, politely, after the kiss. It is fine. It is, in fact, so fine that you immediately understand you’ve made a mistake for nothing.', effects: { rizz: 2, chainEventId: 'li_casa_postcard_stray', casaLoyaltyDraw: true, followers: 3, burnout: 4, addFlag: 'li_casa_kiss' } },
          good: { text: '“I’m not being funny, my head’s proper been turned.” It has. The footage exists. Someone back home is asleep, loyal, and doomed to a slideshow.', effects: { chainEventId: 'li_casa_postcard_stray', casaLoyaltyDraw: true, followers: 5, rizz: 5, addFlag: 'li_casa_kiss' } },
          incredible: { text: 'By midnight you’re the main story in two villas, and you’re only in one of them. The nation cancels its evening plans.', effects: { chainEventId: 'li_casa_postcard_stray', casaLoyaltyDraw: true, followers: 9, public: 4, rizz: 8, addFlag: 'li_casa_kiss' } },
        },
      },
    },
  },
  {
    id: 'li_casa_postcard_loyal', act: 2, chainOnly: true, tags: ['text', 'casa'],
    art: 'li_casa_postcard',
    context: 'Casa Amor · morning · “I’ve got a text! A postcard from the villa…”',
    prompt: 'One photo. Your partner, mid-laugh, somebody’s hand somewhere ambiguous, cropped by a producer who knows exactly what they’re doing. You stayed loyal. This is what you stayed loyal to. Probably. The crop makes it hard to say.',
    recap: 'A cropped postcard lands — {partner} mid-laugh, a hand somewhere.',
    choices: {
      left: {
        label: 'Trust them',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: '“It’s a crop,” you tell the group, with the conviction of someone who has seen crops before. The group nods the way people nod at conspiracy theories.', effects: { loyalty: 2, chainEventId: 'li_casa_return', bond: 2, burnout: 4 } },
          good: { text: '“Anyone want a coffee?” You put the postcard face-down and put the kettle on. It’s the most powerful thing anyone has done in either villa this week.', effects: { loyalty: 5, chainEventId: 'li_casa_return', bond: 4, burnout: -2 } },
          incredible: { text: 'You laugh at it. Actually laugh. The new arrivals quietly cross you off their lists, which is the point.', effects: { loyalty: 8, chainEventId: 'li_casa_return', bond: 5, public: 5, burnout: -3 } },
        },
      },
      right: {
        label: 'Spiral about it',
        tags: ['drama'],
        governingStats: { charisma: 0.6, savvy: 0.4 },
        outcomes: {
          bad: { text: 'You analyse the hand. You bring the postcard to dinner. By sunset you have a theory involving three people who haven’t met.', effects: { charisma: 2, chainEventId: 'li_casa_return', burnout: 6, followers: 2 } },
          good: { text: 'You have one loud, cathartic rant in the Beach Hut and emerge fine. The Hut absorbs. That’s what the Hut is for.', effects: { charisma: 5, chainEventId: 'li_casa_return', followers: 4, burnout: 2 } },
          incredible: { text: 'Your postcard monologue is so quotable the show uses it in the intro for the rest of the Season. Pain, but make it a font.', effects: { charisma: 8, chainEventId: 'li_casa_return', followers: 8, public: 5, burnout: 2 } },
        },
      },
    },
  },
  {
    id: 'li_casa_postcard_stray', act: 2, chainOnly: true, tags: ['text', 'casa'],
    art: 'li_casa_postcard',
    context: 'Casa Amor · morning · “I’ve got a text! The villa got a postcard…”',
    prompt: 'The postcard went the other way too. Somewhere across the island, your partner is holding a photo of your night. You know exactly what the crop shows, because you did it. The only question left is who tells them — you, or Movie Night.',
    recap: 'Your Casa night went home on a postcard — {partner} has seen it.',
    choices: {
      left: {
        label: 'Come clean at the return',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: 'You rehearse the confession on the minibus. It comes out in the wrong order, worst part first. Honest, though. Painfully, structurally honest.', effects: { loyalty: 2, chainEventId: 'li_casa_return', comeClean: true, bond: -5, public: 2, burnout: 3, storyBeat: 'Kissed at Casa — and said it yourself, badly, before any screen could.' } },
          good: { text: '“You deserve to hear it from me.” You rehearse it once and mean it twice. It costs you. It costs you less than a cinema screen would have.', effects: { loyalty: 5, chainEventId: 'li_casa_return', comeClean: true, bond: -4, public: 4, storyBeat: 'Strayed, then told the truth to their face. The tested-and-honest arc.' } },
          incredible: { text: 'You tell the whole truth, unprompted, before anyone can screen anything. The villa is stunned. Honesty this efficient is basically a twist.', effects: { loyalty: 8, chainEventId: 'li_casa_return', comeClean: true, bond: -3, public: 6, graft: 3, storyBeat: 'The unprompted whole truth — a crack owned before it aired.' } },
        },
      },
      right: {
        label: 'Bury it',
        tags: ['strategy'],
        governingStats: { savvy: 1 },
        outcomes: {
          bad: { text: 'You practise your innocent face in a teaspoon. The teaspoon is not convinced. Movie Night exists, and it has your name in the credits.', effects: { chainEventId: 'li_casa_return', burnout: 5, savvy: 2 } },
          good: { text: 'You say nothing, calmly, like a professional. The footage also says nothing. For now. Footage is patient.', effects: { chainEventId: 'li_casa_return', savvy: 5, burnout: 3 } },
          incredible: { text: 'You construct a version of events so watertight you briefly believe it yourself. The producers, reviewing the tape, applaud quietly.', effects: { chainEventId: 'li_casa_return', savvy: 8, followers: 4, burnout: 2 } },
        },
      },
    },
  },
  {
    id: 'li_casa_return', act: 2, chainOnly: true, tags: ['host', 'casa', 'recoupling'],
    art: 'li_casa_return',
    context: 'The firepit · the return · the Host is here in person',
    prompt: '“Islanders. Welcome home. Those of you at Casa Amor had a decision to make — and so did the ones who stayed. Stand by the firepit. Let’s see who did what.” — The gate opens in ten seconds. Whoever you walk in holding hands with is the answer.',
    recap: 'Casa Amor’s over — walk back through the gate and show who you chose.',
    choices: {
      left: {
        label: 'Stand alone, faithful',
        tags: ['loyal', 'recoupling'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: 'You walk in alone, heart first. It’s a forty-metre walk. By metre ten the villa knows. By metre thirty, the nation. The last ten are purely for the drone.', effects: { casaReturn: true, loyalty: 2, burnout: 3 } },
          good: { text: 'You walk in alone and the Host says, “Alone?” and you say, “Yeah. I stayed loyal. I know what I’ve got at home.” The firepit crackles supportively.', effects: { casaReturn: true, loyalty: 5, public: 3 } },
          incredible: { text: 'You walk in alone to an audible “aww” from people who were betting against you an hour ago. The nation adjusts its favourites.', effects: { casaReturn: true, loyalty: 8, public: 6 } },
        },
      },
      right: {
        label: 'Bring someone back',
        tags: ['drama', 'recoupling', 'strategy'],
        governingStats: { savvy: 0.6, rizz: 0.4 },
        outcomes: {
          bad: { text: 'You walk in with someone new and immediately clock, from one face, that you have miscalculated on national television. The someone new clocks it too.', effects: { savvy: 2, switchPartner: true, followers: 4, public: -2, burnout: 5, addFlag: 'li_casa_recouple', removeFlag: 'li_casa_kiss' } },
          good: { text: 'You walk in hand-in-hand with your Casa arrival. Gasps. A dropped drink. It’s a betrayal, a power move, and content — all three at once.', effects: { savvy: 5, switchPartner: true, followers: 7, burnout: 3, addFlag: 'li_casa_recouple', removeFlag: 'li_casa_kiss' } },
          incredible: { text: 'Your entrance restructures three couples and one friendship before you reach the firepit. The episode gets a “PART ONE” title card.', effects: { savvy: 8, switchPartner: true, followers: 11, public: 5, burnout: 3, addFlag: 'li_casa_recouple', removeFlag: 'li_casa_kiss' } },
        },
      },
    },
  },
  {
    id: 'li_casa_held', act: 2, chainOnly: true, tags: ['casa', 'loyal'],
    art: 'li_casa_held',
    context: 'The firepit · the gate opens',
    prompt: 'The gate opens and your partner walks in alone. Alone. Three days, six strangers, one narrow single bed of temptation — and they held. The look you exchange does more for the vote than any speech could.',
    recap: '{partner} walks in alone — three days at Casa and they held.',
    choices: {
      left: {
        label: 'Run to them',
        tags: ['loyal', 'date'],
        governingStats: { loyalty: 0.7, rizz: 0.3 },
        outcomes: {
          bad: { text: 'You run. Sliders were the wrong footwear for running. You arrive at the reunion slightly later than your dignity.', effects: { loyalty: 2, bond: 5, public: 2, burnout: 2 } },
          good: { text: 'The hug lasts long enough that the Host checks a watch. “We held,” you say, into a shoulder. The couples who didn’t look at the floor.', effects: { loyalty: 5, bond: 7, public: 4 } },
          incredible: { text: 'The reunion is so complete the show cuts the ad break early to keep it. What you two have just became the Season’s bar.', effects: { loyalty: 8, bond: 9, public: 6, graft: 3 } },
        },
      },
      right: {
        label: 'Play it cool',
        tags: ['banter', 'strategy'],
        governingStats: { savvy: 0.6, charisma: 0.4 },
        outcomes: {
          bad: { text: '“Alright?” you say, casually, to the person you’ve thought about hourly for three days. They say “alright” back. Two romantics, flattened by cool.', effects: { savvy: 2, bond: 3, burnout: 3 } },
          good: { text: '“Alright?” “Alright.” Hands find hands without looking. The most understated reunion in villa history, and the mics still pick up two heart rates going like castanets.', effects: { savvy: 5, bond: 5, public: 4 } },
          incredible: { text: 'You both underplay it so perfectly the villa assumes you planned it. “Couple goals,” says someone who pied their partner yesterday.', effects: { savvy: 8, bond: 6, public: 6, followers: 4 } },
        },
      },
    },
  },
  {
    id: 'li_casa_betrayed', act: 2, chainOnly: true, tags: ['casa', 'drama'],
    art: 'li_casa_betrayed',
    context: 'The firepit · the gate opens',
    prompt: 'The gate opens and your partner walks in holding somebody else’s hand. You stayed loyal for this. The camera finds your face and stays there, because your face is now the show.',
    recap: 'The gate opens and {partner} walks in holding someone else’s hand.',
    choices: {
      left: {
        label: 'Take it with grace',
        tags: ['loyal', 'camera'],
        governingStats: { loyalty: 0.6, charisma: 0.4 },
        outcomes: {
          bad: { text: 'You manage “I’m happy for you” in the voice of someone reading a hostage statement. The nation’s heart breaks on your behalf anyway.', effects: { loyalty: 2, public: 5, graft: 4, burnout: 5 } },
          good: { text: '“All the best. Genuinely.” You shake the new arrival’s hand and mean at least half of it. Somewhere out there, a betting market moves sharply in your favour.', effects: { loyalty: 5, public: 7, graft: 7, burnout: 4, followers: 3 } },
          incredible: { text: 'Your composure is so gracious it becomes the clip of the Season. Being wronged, it turns out, is prime time — and you just banked it.', effects: { loyalty: 8, public: 10, graft: 8, followers: 6, burnout: 3 } },
        },
      },
      right: {
        label: 'Let them have it',
        tags: ['drama'],
        governingStats: { charisma: 1 },
        outcomes: {
          bad: { text: 'You go for a devastating speech and land on “you’ve got mugs, the pair of you,” which means nothing and trends for a week as a mug meme.', effects: { charisma: 2, followers: 5, public: -2, burnout: 5 } },
          good: { text: '“You could’ve texted.” Four words, ice-flat, at a firepit. The new couple’s honeymoon period dies at the age of forty seconds.', effects: { charisma: 5, followers: 6, public: 3, burnout: 4 } },
          incredible: { text: 'You deliver one perfect, surgical read and walk off before the response. The exit is so clean the show replays it from three angles.', effects: { charisma: 8, followers: 10, public: 5, graft: 5, burnout: 3 } },
        },
      },
    },
  },

  // ---------- Movie Night (the big Reveal — beat window, late Act 2) ----------
  {
    id: 'li_movienight_reveal', act: 2, weight: 1, tags: ['beat:movienight', 'host', 'drama'],
    art: 'li_movienight',
    requires: { anyOf: [
      { flagsAll: ['li_casa_kiss'] },
      { flagsAll: ['li_head_turned'] },
      { flagsAll: ['li_strayed_official'] },
      { partnerKissedIs: true },
    ] },
    context: 'The lawn · a cinema screen that wasn’t there this morning',
    prompt: '“Islanders. Grab a drink. Tonight, you’re watching a film. It’s about all of you.” — The Host has a remote. The screen is enormous. The villa has a cinema now; nobody asked for a cinema. Somewhere on that screen is footage somebody at this firepit has been praying doesn’t exist.',
    recap: 'Movie Night — the villa’s got a cinema and your footage is in the reel.',
    choices: {
      left: {
        label: 'Front it out',
        tags: ['strategy', 'camera'],
        governingStats: { savvy: 1 },
        outcomes: {
          bad: { text: 'You keep your face neutral through the whole reel. Your knee, under the blanket, does not. The knee gets its own close-up.', effects: { savvy: 2, reveal: 'movienight', burnout: 5 } },
          good: { text: 'You watch it like a critic. No gasps, no denials, one measured “well.” Whatever just aired, you’ve already moved past it, publicly.', effects: { reveal: 'movienight', savvy: 5, burnout: 3 } },
          incredible: { text: 'You commentate your own worst clip before anyone else can. Owning it lands better than the footage did. The villa is disarmed; the edit is furious.', effects: { reveal: 'movienight', savvy: 8, public: 5, burnout: 2 } },
        },
      },
      right: {
        label: 'React with your whole chest',
        tags: ['drama'],
        governingStats: { charisma: 1 },
        outcomes: {
          bad: { text: 'You’re out of your seat before the clip ends. The row that follows has structure, movements, an interval. Nobody wins Movie Night.', effects: { charisma: 2, reveal: 'movienight', followers: 4, burnout: 6 } },
          good: { text: '“Pause it. PAUSE IT—” You say the thing everyone at the firepit is thinking, at volume, with the remote still in the Host’s hand. Honest chaos. The good kind.', effects: { charisma: 5, reveal: 'movienight', followers: 6, burnout: 4 } },
          incredible: { text: 'Your reaction shot becomes the Season’s reaction shot. From tonight, every betrayal on this show is measured against your face.', effects: { charisma: 8, reveal: 'movienight', followers: 10, public: 4, burnout: 3 } },
        },
      },
    },
  },
  {
    id: 'li_movienight_clean', act: 2, weight: 1, tags: ['beat:movienight', 'host', 'banter'],
    art: 'li_movienight',
    requires: { flagsNone: ['li_casa_kiss', 'li_head_turned', 'li_strayed_official'], partnerKissedIs: false },
    context: 'The lawn · a cinema screen that wasn’t there this morning',
    prompt: '“Islanders. Grab a drink. Tonight, you’re watching a film. It’s about all of you.” — The reel starts. Clip after clip, it’s everyone else. You check twice. Nothing with your name on it. Movie Night, for once, is a spectator sport.',
    recap: 'Movie Night rolls and none of it’s got your name on it.',
    choices: {
      left: {
        label: 'Hold hands and watch',
        tags: ['loyal', 'date'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: 'You relax so visibly during someone else’s scandal that the camera cuts to you enjoying it. Smugness, it turns out, is also a clip.', effects: { loyalty: 2, bond: 3, public: -1, burnout: 2 } },
          good: { text: '“We’re fine,” you whisper, twice, as two couples detonate in front of you under one blanket. Nothing bonds two people like other people’s footage.', effects: { loyalty: 5, bond: 5, burnout: -2 } },
          incredible: { text: 'The screen goes dark and you two are the only couple still holding hands. The nation notices. The nation keeps receipts.', effects: { loyalty: 8, bond: 7, public: 6, burnout: -3 } },
        },
      },
      right: {
        label: 'Live-commentate',
        tags: ['banter', 'camera'],
        governingStats: { charisma: 1 },
        outcomes: {
          bad: { text: 'Your running commentary lands one joke too close to the wrong couple’s open wound. The blanket you’re offered afterwards is not friendly.', effects: { charisma: 2, followers: 3, public: -2, burnout: 3 } },
          good: { text: 'You narrate the carnage like snooker. Quiet, precise, devastating. Half the firepit is fighting; the other half is trying not to laugh at you.', effects: { followers: 5, charisma: 5 } },
          incredible: { text: 'Your popcorn commentary out-rates the actual scandal. The show cuts to you for reactions it hasn’t aired yet. You are now infrastructure.', effects: { followers: 9, public: 5, charisma: 8 } },
        },
      },
    },
  },

  // ---------- Bombshells ----------
  {
    id: 'li_bomb1', act: 1, weight: 1, tags: ['beat:bomb1', 'text', 'drama'],
    art: 'li_bombshell',
    context: 'Golden hour · “I’VE GOT A TEXT!!”',
    prompt: '“Islanders, please welcome your first bombshell. {bombshell} arrives tonight — and will be taking one of you on a date. #newenergy” — A newcomer walks in like the villa is theirs and everyone else is subletting. Your couple suddenly has an audience.',
    recap: '{bombshell} arrives tonight and is taking one of you on a date.',
    choices: {
      left: {
        label: 'Say hi first',
        tags: ['flirt', 'strategy'],
        governingStats: { rizz: 0.6, savvy: 0.4 },
        outcomes: {
          bad: { text: 'You lead the welcome party a beat too enthusiastically. Your partner watches the greeting the way insurance assessors watch dashcam footage.', effects: { rizz: 2, bond: -2, followers: 3, burnout: 3 } },
          good: { text: 'You get in early, friendly and unbothered. Nothing defuses a bombshell like being treated as a colleague.', effects: { rizz: 2, savvy: 3, public: 3 } },
          incredible: { text: '“Right — who’s with who, and who’s pretending?” Within an hour the bombshell is asking YOU for the lay of the land. New arrivals need allies. You collect them.', effects: { rizz: 4, savvy: 4, public: 5, graft: 4 } },
        },
      },
      right: {
        label: 'Hold your ground',
        tags: ['loyal'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: 'You perform elaborate indifference from the daybed, which reads, on camera, as fear arranged decoratively.', effects: { burnout: 3, loyalty: 2 } },
          good: { text: 'You stay wrapped around {partner} for the entire entrance, like a scarf with a point to make. Some statements don’t need dialogue.', effects: { bond: 4, loyalty: 5 } },
          incredible: { text: 'The bombshell scans the lawn, reaches your couple, and visibly re-plans. Solid reads as solid from across a garden.', effects: { bond: 6, public: 4, loyalty: 8 } },
        },
      },
    },
  },
  {
    id: 'li_bomb2', act: 2, weight: 3, tags: ['beat:bomb2', 'text', 'drama', 'temptation'],
    art: 'li_bombshell',
    requires: { singleIs: false },
    context: 'Afternoon · “I’VE GOT A TEXT!!”',
    prompt: '“Islanders, {bombshell} enters the villa tonight — and gets to steal one Islander for a private date. #spicy” — The new arrival reads the lawn like a wine list. Your partner is on it. So, to be fair, are you.',
    recap: '{bombshell} enters and can steal one for a date — {partner}’s on the list.',
    choices: {
      left: {
        label: 'Make your couple boring',
        tags: ['loyal', 'strategy'],
        governingStats: { loyalty: 0.6, savvy: 0.4 },
        outcomes: {
          bad: { text: 'You spend the evening demonstratively coupled. The bombshell finds the performance “sweet,” which lands like a slap in cashmere.', effects: { loyalty: 2, bond: 2, burnout: 3, addFlag: 'li_rival_active' } },
          good: { text: 'You give the bombshell nothing to work with: no gap, no glance, no in. Predators pick the easy grass. You are not the easy grass.', effects: { loyalty: 3, bond: 4, savvy: 2 } },
          incredible: { text: 'You’re so unbothered the bombshell recruits you as a confidant and targets somebody else’s couple. You now have intel and immunity.', effects: { loyalty: 5, bond: 5, savvy: 3, graft: 4 } },
        },
      },
      right: {
        label: 'Size them up yourself',
        tags: ['flirt', 'temptation'],
        governingStats: { rizz: 1 },
        outcomes: {
          bad: { text: 'You flirt “as a test,” fail your own test, and spend the night explaining the methodology to a partner who has stopped nodding.', effects: { rizz: 2, bond: -3, followers: 3, burnout: 4, addFlag: 'li_head_turned' } },
          good: { text: 'You charm the bombshell into an ally and hand them, with a hostess’s smile, a list of the villa’s available options. Not yours.', effects: { rizz: 5, followers: 4, public: 3 } },
          incredible: { text: '“You’re my type,” the bombshell announces, openly, live. “Flattered. Taken,” you return, just as live. Being wanted and unavailable is the best television there is.', effects: { rizz: 8, public: 6, followers: 6, bond: 2 } },
        },
      },
    },
  },
  {
    id: 'li_bomb2_steal', act: 2, weight: 1, tags: ['beat:bomb2', 'host', 'drama', 'recoupling'],
    art: 'li_bombshell_steal',
    requires: { singleIs: false },
    context: 'The firepit · night · the Host walks in unannounced',
    prompt: '“Islanders. Tonight, our new arrival doesn’t get a date. They get a choice. In sixty seconds, {bombshell} will couple up with one of you — and whoever’s left over is single. Immediately.” — Sixty seconds. Every couple on this lawn is doing the same maths.',
    recap: 'Sixty seconds till {bombshell} couples up — and someone’s left single.',
    choices: {
      left: {
        label: 'Close ranks',
        tags: ['loyal', 'recoupling'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: 'You grip your partner’s hand like a car door in a flood. Fear, the bombshell knows, is just interest wearing a disguise.', effects: { loyalty: 2, stealRoll: true, burnout: 4 } },
          good: { text: 'You stand with your partner and watch the sixty seconds tick. What you’ve built either holds now, or it was never built.', effects: { stealRoll: true, loyalty: 5 } },
          incredible: { text: 'You don’t even stand up. Whatever happens next, the lawn just learned which couple isn’t scared.', effects: { stealRoll: true, loyalty: 8, public: 5 } },
        },
      },
      right: {
        label: 'Work the odds',
        tags: ['strategy', 'recoupling'],
        governingStats: { savvy: 1 },
        outcomes: {
          bad: { text: 'You spend the sixty seconds loudly recommending other couples, which everyone hears, including the other couples.', effects: { savvy: 2, stealRoll: true, public: -2, burnout: 4 } },
          good: { text: 'You angle your couple out of the eyeline, casually, like furniture being rearranged. Sometimes savvy is just geometry.', effects: { stealRoll: true, savvy: 5 } },
          incredible: { text: 'You read the bombshell’s type off their entrance outfit and reposition accordingly. If this works, no one will ever know it was a move.', effects: { stealRoll: true, savvy: 8, graft: 3 } },
        },
      },
    },
  },
  {
    id: 'li_bomb2_single', act: 2, weight: 2, tags: ['beat:bomb2', 'text', 'flirt'],
    art: 'li_bombshell',
    requires: { singleIs: true },
    context: 'Afternoon · “I’VE GOT A TEXT!!”',
    prompt: '“Islanders, {bombshell} enters the villa tonight. #newenergy” — A new arrival, and you’re the only single person at the welcome drinks. The villa watches you approach the situation the way nature documentaries watch anything.',
    recap: '{bombshell} arrives and you’re the only single at the welcome drinks.',
    choices: {
      left: {
        label: 'Shoot your shot',
        tags: ['flirt', 'date'],
        governingStats: { rizz: 1 },
        outcomes: {
          bad: { text: 'You open with your full backstory, including the betrayal. The bombshell’s eyes do the thing eyes do when a lift is taking too long.', effects: { burnout: 4, rizz: 2 } },
          good: { text: '“You’re the only one who hasn’t pitched me yet,” says the bombshell, twenty minutes into the swing seat, no longer scanning the lawn. In here, undivided attention is a proposal.', effects: { couple: true, rizz: 5, public: 3 } },
          incredible: { text: 'By sundown you and the bombshell are the villa’s newest couple, and the people who left you single are recalculating at volume.', effects: { couple: true, rizz: 8, public: 5, followers: 5 } },
        },
      },
      right: {
        label: 'Let them come to you',
        tags: ['strategy', 'rest'],
        governingStats: { savvy: 1 },
        outcomes: {
          bad: { text: 'You play hard-to-get so successfully you are not got. The bombshell couples with someone easier to find.', effects: { burnout: 3, savvy: 2 } },
          good: { text: 'You hold court at the kitchen counter and let gravity work. New arrivals always end up at the kitchen counter.', effects: { savvy: 5, public: 3 } },
          incredible: { text: 'The bombshell crosses the whole lawn to introduce themselves to you, on camera, past four better-lit options. Leverage.', effects: { couple: true, savvy: 8, public: 6 } },
        },
      },
    },
  },

  // ---------- Recoupling 1 (the girls choose — beat window, late Act 2) ----------
  {
    id: 'li_recoup1_choose', act: 2, weight: 1, tags: ['beat:recoup1', 'text', 'recoupling'],
    art: 'li_firepit',
    requires: { genderIs: 'girl', singleIs: false },
    context: 'The firepit · night · “I’VE GOT A TEXT!!”',
    prompt: '“Tonight, there will be a recoupling. The girls will choose. #ladiesfirst” — The power is yours, which sounds better than it feels. Keep what you have, or reset everything for a fresh face — with the whole lawn, and the nation, taking notes.',
    recap: 'Recoupling — the girls choose, and you decide whether to keep {partner}.',
    choices: {
      left: {
        label: 'Stick with {partner}',
        tags: ['loyal', 'recoupling'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: '“I’m coupling up with…” — you get the name right, but your speech includes the word “comfortable” twice. Comfortable, twice, is a warning light.', effects: { loyalty: 2, bond: 2, burnout: 3 } },
          good: { text: '“Him. Every time. I’m loyal, and I know what I want.” You keep the speech short and mean every word. Somewhere at home a mum says “oh, I LIKE her,” and that, statistically, is the vote.', effects: { loyalty: 5, bond: 5, public: 3 } },
          incredible: { text: 'Your speech gets an actual round of applause and one audible sniffle. The couples that were wobbling look suddenly, visibly, worse.', effects: { loyalty: 8, bond: 7, public: 6 } },
        },
      },
      right: {
        label: 'Switch it up',
        tags: ['strategy', 'recoupling', 'drama'],
        governingStats: { savvy: 1 },
        outcomes: {
          bad: { text: 'You switch, and your reasons come out backwards, and your ex’s face does something the cameras will replay all week. New start, old debris.', effects: { savvy: 2, switchPartner: true, followers: 4, public: -2, burnout: 5 } },
          good: { text: '“It wasn’t working. We all knew.” You say the honest thing and pick fresh. The firepit exhales. Bold, clean, survivable.', effects: { savvy: 5, switchPartner: true, followers: 5, burnout: 3 } },
          incredible: { text: 'Your switch is so well-argued the lawn nods along, including, horribly, your ex. A cold move executed warmly is the whole game.', effects: { savvy: 8, switchPartner: true, followers: 8, public: 5, burnout: 2 } },
        },
      },
    },
  },
  {
    id: 'li_recoup1_choose_single', act: 2, weight: 1, tags: ['beat:recoup1', 'text', 'recoupling'],
    art: 'li_firepit',
    requires: { genderIs: 'girl', singleIs: true },
    context: 'The firepit · night · “I’VE GOT A TEXT!!”',
    prompt: '“Tonight, there will be a recoupling. The girls will choose. #ladiesfirst” — You’re single, and you pick first. The boys arrange themselves around the firepit like options. One of them has been practising his surprised face.',
    recap: 'Recoupling and you’re single — the girls pick first, the boys lined up.',
    choices: {
      left: {
        label: 'Pick with your heart',
        tags: ['flirt', 'recoupling'],
        governingStats: { rizz: 1 },
        outcomes: {
          bad: { text: 'You pick the connection you felt on Tuesday. He stands up wearing the smile of someone who felt a different Tuesday.', effects: { couple: true, burnout: 3, rizz: 2 } },
          good: { text: 'You say a name you actually mean, and he crosses the firepit like he’s been waiting for the sentence to end. “Finally,” breathes the lawn.', effects: { couple: true, rizz: 5, public: 3 } },
          incredible: { text: 'Your speech is half a joke and one true sentence — “I fancied you before I had a game plan” — and it lands on the whole lawn at once. New couple; instant favourites.', effects: { couple: true, rizz: 8, public: 6 } },
        },
      },
      right: {
        label: 'Pick for survival',
        tags: ['strategy', 'recoupling'],
        governingStats: { savvy: 1 },
        outcomes: {
          bad: { text: 'You pick the safest boy on the bench, and your speech accidentally includes the word “logistically.” The nation winces as one.', effects: { couple: true, savvy: 2, public: -1, burnout: 3 } },
          good: { text: 'You pick the steady one. Not fireworks — scaffolding. This villa eats fireworks for breakfast.', effects: { couple: true, savvy: 5, public: 3 } },
          incredible: { text: 'You pick the exact boy the vote wanted you to pick, without knowing the vote wanted it. Instinct or algorithm, it plays beautifully.', effects: { couple: true, savvy: 8, public: 6 } },
        },
      },
    },
  },
  {
    id: 'li_recoup1_exposed', act: 2, weight: 1, tags: ['beat:recoup1', 'text', 'recoupling'],
    art: 'li_firepit',
    requires: { genderIs: 'boy', singleIs: false },
    context: 'The firepit · night · “I’VE GOT A TEXT!!”',
    prompt: '“Tonight, there will be a recoupling. The girls will choose. The boy not chosen will be dumped from the Island. #decisiontime” — You don’t pick tonight. You stand there, with everything you’ve built, and find out what it was worth. The fire crackles. It would.',
    recap: 'Recoupling — the girls choose, the unpicked boy goes home. You wait.',
    choices: {
      left: {
        label: 'Trust the graft',
        tags: ['loyal', 'recoupling'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: 'You stand at the firepit doing sums about your own relationship. The maths keeps coming out different depending on which memory you use.', effects: { loyalty: 2, chosenCeremony: true, burnout: 4 } },
          good: { text: 'You catch your partner’s eye across the fire and hold it. Whatever happens in the next minute, you didn’t blink first.', effects: { chosenCeremony: true, loyalty: 5 } },
          incredible: { text: 'You stand there so calmly the other boys start glancing at you for reassurance. You have none to give. You look like you do. That’s leadership.', effects: { chosenCeremony: true, loyalty: 8, public: 4 } },
        },
      },
      right: {
        label: 'Count your votes',
        tags: ['strategy', 'recoupling'],
        governingStats: { savvy: 1 },
        outcomes: {
          bad: { text: 'You run the numbers: who owes you, who likes you, who laughed at the pie thing. The numbers are inconclusive. The fire is very warm.', effects: { savvy: 2, chosenCeremony: true, burnout: 4 } },
          good: { text: 'You’ve been decent to every girl at this firepit for weeks. Tonight that’s not niceness. Tonight that’s a portfolio.', effects: { chosenCeremony: true, savvy: 5 } },
          incredible: { text: 'You know exactly who’s picking whom before a word is said — you can read a firepit like a departures board. The only unknown is your own name.', effects: { chosenCeremony: true, savvy: 8, public: 4 } },
        },
      },
    },
  },
  {
    id: 'li_recoup1_exposed_single', act: 2, weight: 1, tags: ['beat:recoup1', 'text', 'recoupling'],
    art: 'li_firepit',
    requires: { genderIs: 'boy', singleIs: true },
    context: 'The firepit · night · “I’VE GOT A TEXT!!”',
    prompt: '“Tonight, there will be a recoupling. The girls will choose. The boy not chosen will be dumped from the Island. #decisiontime” — You’re single going in. No Connection to protect you tonight — only whatever the last few weeks bought you with the girls, and with the nation.',
    recap: 'Recoupling, and you’re single going in — the girls hold your fate.',
    choices: {
      left: {
        label: 'Trust the friendships',
        tags: ['chat', 'recoupling'],
        governingStats: { loyalty: 0.5, charisma: 0.5 },
        outcomes: {
          bad: { text: 'You review every kitchen-counter heart-to-heart for evidence somebody here would save you. It’s a lot of tea. It might just have been tea.', effects: { loyalty: 2, chosenCeremony: true, burnout: 4 } },
          good: { text: 'You’ve been the villa’s shoulder for weeks. Somewhere around this firepit, that has to be worth one name.', effects: { loyalty: 5, chosenCeremony: true, public: 3 } },
          incredible: { text: 'Three girls glance at you before the choosing starts. Three. You spend the ceremony doing very calm arithmetic.', effects: { loyalty: 8, chosenCeremony: true, public: 5 } },
        },
      },
      right: {
        label: 'Trust the edit',
        tags: ['camera', 'recoupling'],
        governingStats: { charisma: 1 },
        outcomes: {
          bad: { text: 'You give the camera your best profile for the whole ceremony. If you’re going, you’re going in focus.', effects: { charisma: 2, chosenCeremony: true, burnout: 3 } },
          good: { text: 'The nation has watched you be funny, decent, and single for a week. Somewhere on a sofa, someone is willing a girl to say your name.', effects: { charisma: 5, chosenCeremony: true, followers: 2 } },
          incredible: { text: 'You are, objectively, the story tonight — the single boy at the firepit. Stories don’t usually get sent home mid-arc. Usually.', effects: { charisma: 8, chosenCeremony: true, followers: 4, public: 4 } },
        },
      },
    },
  },

  // ---------- Recoupling 2 (the boys choose — chained at the Act 2→3 break) ----------
  {
    id: 'li_recoup2_choose', act: 3, chainOnly: true, tags: ['text', 'recoupling'],
    art: 'li_firepit',
    context: 'Final Week opens · the firepit · “I’VE GOT A TEXT!!”',
    prompt: '“Tonight, there will be a recoupling. The boys will choose. #judgementweek” — Final Week, and the power lands in your hands. No pressure, but whoever you’re holding at the end of tonight is who you’re holding at the Final. In the photos. Forever. Laminated.',
    recap: 'Final Week recoupling — the boys choose who they take to the Final.',
    choices: {
      left: {
        label: 'Stick with {partner}',
        tags: ['loyal', 'recoupling'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: 'You recommit with a speech that peaks at “she’s a great girl,” a phrase last used warmly by a driving instructor. She accepts. The bar was low.', effects: { loyalty: 2, bond: 2, burnout: 3 } },
          good: { text: 'Her name first, the explaining after — the right order. “Good speech,” she says, taking your hand, meaning the order.', effects: { loyalty: 5, bond: 5, public: 3 } },
          incredible: { text: 'Your speech is one sentence long — “I’d still pick her with every camera switched off” — and it detonates quietly. The truest thing said at this firepit all Season. The Final just got a favourite.', effects: { loyalty: 8, bond: 7, public: 6 } },
        },
      },
      right: {
        label: 'Make the late switch',
        tags: ['strategy', 'recoupling', 'drama'],
        governingStats: { savvy: 1 },
        outcomes: {
          bad: { text: 'A Final Week switch with a wobbly rationale: the villa hears “gut feeling,” the nation hears “panic,” your new partner hears both.', effects: { savvy: 2, switchPartner: true, followers: 4, public: -3, burnout: 5 } },
          good: { text: 'You make the coldest move of the Season sound like the most reasonable. Half this game is timing. The other half is delivery.', effects: { savvy: 5, switchPartner: true, followers: 6, burnout: 3 } },
          incredible: { text: 'The switch nobody saw coming, executed so cleanly even your ex applauds. The Final Week board resets around you.', effects: { savvy: 8, switchPartner: true, followers: 9, public: 4, burnout: 3 } },
        },
      },
    },
  },
  {
    // Safety net (R1/A5): with the current beat schedule a single chooser at
    // the Act 2→3 break is unreachable (recoup1 re-couples or dumps first) —
    // kept because producers.onActBreak routes here if content ever changes.
    id: 'li_recoup2_choose_single', act: 3, chainOnly: true, tags: ['text', 'recoupling'],
    art: 'li_firepit',
    context: 'Final Week opens · the firepit · “I’VE GOT A TEXT!!”',
    prompt: '“Tonight, there will be a recoupling. The boys will choose. #judgementweek” — You walk into Final Week single, and you pick first. One good sentence between you and a place at the Final.',
    recap: 'Final Week and you’re single — pick first for a place at the Final.',
    choices: {
      left: {
        label: 'Pick with your heart',
        tags: ['flirt', 'recoupling'],
        governingStats: { rizz: 1 },
        outcomes: {
          bad: { text: 'You pick the connection you’ve been nursing since the challenge. Her face says she remembers the challenge differently.', effects: { couple: true, burnout: 3, rizz: 2 } },
          good: { text: 'You say the name you kept not saying. “Wondered when you’d get there,” she says, standing before the speech is done. Late, but not too late — the best kind of late.', effects: { couple: true, rizz: 5, public: 3 } },
          incredible: { text: 'The pick is so obviously right that the villa collectively mutters “finally.” Finally, at a firepit, is a coronation.', effects: { couple: true, rizz: 8, public: 6 } },
        },
      },
      right: {
        label: 'Pick the strongest hand',
        tags: ['strategy', 'recoupling'],
        governingStats: { savvy: 1 },
        outcomes: {
          bad: { text: 'You pick for the Final, and everyone can tell, including her, including the vote, including you around 3 a.m.', effects: { couple: true, savvy: 2, public: -2, burnout: 3 } },
          good: { text: 'You pick the partnership that works on paper and might, given a quiet week, work off it. Final Week has been built on worse.', effects: { couple: true, savvy: 5, public: 3 } },
          incredible: { text: 'You pick the one person in this villa whose game you actually respect. The nation, which respects respect, moves you both up a tier.', effects: { couple: true, savvy: 8, public: 6 } },
        },
      },
    },
  },
  {
    id: 'li_recoup2_exposed', act: 3, chainOnly: true, tags: ['text', 'recoupling'],
    art: 'li_firepit',
    context: 'Final Week opens · the firepit · “I’VE GOT A TEXT!!”',
    prompt: '“Tonight, there will be a recoupling. The boys will choose. The girl not chosen will be dumped from the Island. #judgementweek” — More girls than places: a maths problem with feelings. No move left tonight. Only what you’ve built — the Connection, or the vote.',
    recap: 'Final Week — the boys choose, the unpicked girl’s dumped. You wait it out.',
    choices: {
      left: {
        label: 'Trust the graft',
        tags: ['loyal', 'recoupling'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: 'You replay every private moment for load-bearing sincerity. The firepit is warm. Your hands are freezing.', effects: { loyalty: 2, chosenCeremony: true, burnout: 4 } },
          good: { text: 'What you two have is real, and real usually stands up at a firepit. Usually. The fire pops. Someone clears their throat.', effects: { chosenCeremony: true, loyalty: 5 } },
          incredible: { text: 'You’re so sure of your couple you spend the ceremony comforting the girl next to you. The nation files that away for the vote.', effects: { chosenCeremony: true, loyalty: 8, public: 5 } },
        },
      },
      right: {
        label: 'Work the room first',
        tags: ['strategy', 'recoupling'],
        governingStats: { savvy: 0.6, charisma: 0.4 },
        outcomes: {
          bad: { text: 'You spent the week being liked by everyone. Tonight you find out whether “liked by everyone” has ever once said a name at a firepit.', effects: { savvy: 2, chosenCeremony: true, burnout: 4 } },
          good: { text: 'You’re not the strongest couple on this lawn — but you might be the one the nation texts about, and the boys can count.', effects: { savvy: 5, chosenCeremony: true, public: 3 } },
          incredible: { text: 'You catch two boys checking your reaction before they’ve chosen. Whatever your couple is worth, your presence is worth more. Tonight that might be enough.', effects: { savvy: 8, chosenCeremony: true, public: 5, followers: 3 } },
        },
      },
    },
  },
  {
    // Safety net (R1/A5): same reasoning as li_recoup2_choose_single, exposed
    // side. Unreachable today by schedule, load-bearing if it ever isn't.
    id: 'li_recoup2_exposed_single', act: 3, chainOnly: true, tags: ['text', 'recoupling'],
    art: 'li_firepit',
    context: 'Final Week opens · the firepit · “I’VE GOT A TEXT!!”',
    prompt: '“Tonight, there will be a recoupling. The boys will choose. The girl not chosen will be dumped from the Island. #judgementweek” — You’re single, in Final Week, at a ceremony where somebody goes home. No partner to protect you. Only the last three weeks, and the nation.',
    recap: 'Single in Final Week — the boys choose, and someone goes home tonight.',
    choices: {
      left: {
        label: 'Stand on what you built',
        tags: ['chat', 'recoupling'],
        governingStats: { loyalty: 0.5, charisma: 0.5 },
        outcomes: {
          bad: { text: 'You inventory your villa friendships at speed. Strong portfolio. Wrong market — friendship has never once been recoupled with.', effects: { loyalty: 2, chosenCeremony: true, burnout: 4 } },
          good: { text: 'Every girl at this firepit has cried on you at least once. If the boys have been paying any attention at all, that counts for something.', effects: { loyalty: 5, chosenCeremony: true, public: 3 } },
          incredible: { text: 'You stand alone with absolute calm, and the calm is the argument: this is not a person whose story ends tonight.', effects: { loyalty: 8, chosenCeremony: true, public: 5 } },
        },
      },
      right: {
        label: 'Trust the nation',
        tags: ['camera', 'recoupling'],
        governingStats: { charisma: 1 },
        outcomes: {
          bad: { text: 'You aim your best face at the nearest camera. The camera, a professional, does not blink. Neither, for one very long minute, do you.', effects: { charisma: 2, chosenCeremony: true, burnout: 3 } },
          good: { text: 'The vote has watched you survive a betrayal and a bombshell in one Season. Sofas across the country are shouting a name. It might be yours.', effects: { charisma: 5, chosenCeremony: true, followers: 2 } },
          incredible: { text: 'You are the single girl at a Final Week firepit — the exact person this show builds finales around. The boys know it too.', effects: { charisma: 8, chosenCeremony: true, followers: 4, public: 4 } },
        },
      },
    },
  },

  // ---------- The gossip cash-out (the climax encounter's third beat) ----------
  // Chained between the last stand and the verdict when you hold the Rival's
  // surfaced, unspent secret (ADR-0007's ceremony sink — coupling routes it).
  {
    id: 'li_recoup_cashout', act: [2, 3], chainOnly: true, tags: ['recoupling', 'drama', 'encounter'],
    art: 'li_firepit',
    context: 'The firepit · a beat before the choosing · what you know, burning',
    prompt: '“Before anyone says a name—” The Host lets the pause stretch. In your pocket: everything you know about {rival}. One sentence, said out loud at this fire, and tonight’s board changes. Said sentences don’t come back, mind. {rival} watches you the way you watch weather.',
    recap: 'A beat before the names — all you know about {rival}, in your pocket.',
    choices: {
      left: {
        label: 'Say it. Out loud.',
        tags: ['drama', 'camera'],
        governingStats: { charisma: 0.6, savvy: 0.4 },
        outcomes: {
          bad: { text: '“Since we’re all being honest tonight—” Your voice shakes on the way in and steadies on the landing. The secret hits the fire and burns blue. {rival}’s face does the whole season in four seconds.', effects: { charisma: 2, playSecret: 'rival', chosenCeremony: true, public: 3, followers: 3, burnout: 3, storyBeat: 'Detonated a secret at the firepit to hold your couple. The nation felt the blast at home.' } },
          good: { text: 'You say it plainly, once, no garnish. The firepit goes so quiet you can hear the ring light. {rival} has no move, because there is no move.', effects: { charisma: 5, playSecret: 'rival', chosenCeremony: true, public: 5, followers: 5, burnout: 2, storyBeat: 'Detonated a secret at the firepit to hold your couple. The nation felt the blast at home.' } },
          incredible: { text: 'One sentence, perfectly weighted, dropped at the exact moment the Host inhales. Production will study the timing for years. {rival} is, officially, done poaching.', effects: { charisma: 8, playSecret: 'rival', chosenCeremony: true, public: 7, followers: 8, burnout: 2, storyBeat: 'Detonated a secret at the firepit to hold your couple. The nation felt the blast at home.' } },
        },
      },
      right: {
        label: 'Keep it in your pocket',
        tags: ['strategy', 'loyal'],
        governingStats: { savvy: 1 },
        outcomes: {
          bad: { text: 'You hold it, and holding it holds you — you spend the ceremony doing sums about mercy. The fire pops. Your pocket weighs a kilo.', effects: { savvy: 2, chosenCeremony: true, burnout: 3 } },
          good: { text: 'Not tonight. Power kept is power compounding, and mercy — visibly chosen — photographs well at a firepit.', effects: { savvy: 5, chosenCeremony: true, public: 2 } },
          incredible: { text: 'You catch {rival}’s eye across the fire and let them watch you decide. They know. You know. The debt is now the leverage.', effects: { savvy: 8, chosenCeremony: true, rivalOpinion: 8 } },
        },
      },
    },
  },

  // ---------- Recoupling verdicts (chained by the Coupling plugin) ----------
  {
    id: 'li_recoup_held', act: [2, 3], chainOnly: true, tags: ['recoupling', 'loyal'],
    art: 'li_firepit',
    context: 'The firepit · the choosing',
    prompt: '“I want to couple up with this person because…” — and it’s your name, first, before the because. The Connection held. Across the fire, somebody who worked the room all week is discovering what rooms are worth.',
    recap: 'Your name, said first, before the because — the Connection held.',
    choices: {
      left: {
        label: 'Cross the fire to them',
        tags: ['loyal', 'date'],
        governingStats: { loyalty: 0.7, rizz: 0.3 },
        outcomes: {
          bad: { text: 'You’re up before your name’s finished, which reads keen. You are keen. The lawn smiles at you being keen. Fine. FINE.', effects: { loyalty: 2, bond: 3, public: 1, burnout: 2 } },
          good: { text: 'You take your place beside them and the firepit does its one good trick: it makes chosen people look lit from inside.', effects: { loyalty: 5, bond: 4, public: 3 } },
          incredible: { text: '“…because of the toast thing. And the accent she does—” The speech about you is so specific the villa learns your couple has a private world. Private worlds win Finals.', effects: { loyalty: 8, bond: 6, public: 5 } },
        },
      },
      right: {
        label: 'Make them work for it',
        tags: ['banter'],
        governingStats: { charisma: 1 },
        outcomes: {
          bad: { text: 'You pause for effect. The pause outlives the effect. Two producers age visibly before you finally stand up.', effects: { charisma: 2, bond: 2, burnout: 2, followers: 2 } },
          good: { text: '“Go on then,” says your one raised eyebrow, and you cross the fire at your own pace. Chosen, and still charging admission.', effects: { charisma: 5, bond: 4, followers: 3 } },
          incredible: { text: 'Your slow walk around the firepit gets its own music cue. Being wanted is good television; knowing it is better.', effects: { charisma: 8, bond: 5, followers: 5, public: 4 } },
        },
      },
    },
  },
  {
    id: 'li_recoup_rescued', act: [2, 3], chainOnly: true, tags: ['recoupling', 'drama'],
    art: 'li_firepit',
    context: 'The firepit · the choosing',
    prompt: 'The names go round the fire and none of them is your partner’s voice saying yours. Then — a beat before the Host moves on — someone else says it. Someone you weren’t building with. The nation’s favourite gets caught, not dropped. New couple. New everything.',
    recap: '{partner}’s voice never said your name — but someone else’s did.',
    choices: {
      left: {
        label: 'Take the hand offered',
        tags: ['strategy', 'recoupling'],
        governingStats: { savvy: 1 },
        outcomes: {
          bad: { text: 'You join your rescuer with a smile that needs two more drafts. Saved, publicly, by someone you now have to learn from scratch.', effects: { savvy: 2, couple: true, partnerMood: 'buzzing', public: 2, burnout: 4, storyBeat: 'Dropped at the fire — and caught. A rupture, survived in public.' } },
          good: { text: 'You cross the fire with your chin up. It’s not the couple you built — it’s the one the room built for you. The vote loves a plot twist.', effects: { savvy: 5, couple: true, partnerMood: 'buzzing', public: 4, followers: 3, storyBeat: 'Dropped at the fire — and caught. A rupture, survived in public.' } },
          incredible: { text: 'Your rescuer’s speech — “I’ve been watching, and I don’t think anyone in here sees it” — lands so well the villa briefly forgets whose ceremony this was.', effects: { savvy: 8, couple: true, partnerMood: 'buzzing', public: 6, followers: 5, storyBeat: 'Dropped at the fire — and caught. A rupture, survived in public.' } },
        },
      },
      right: {
        label: 'Let the old one see your face',
        tags: ['drama'],
        governingStats: { charisma: 1 },
        outcomes: {
          bad: { text: 'You aim a look of pure judgement across the fire and hold it slightly too long. The GIF crops out your new partner entirely.', effects: { charisma: 2, couple: true, partnerMood: 'buzzing', followers: 4, public: -1, burnout: 3, storyBeat: 'Dropped at the fire — and caught. A rupture, survived in public.' } },
          good: { text: 'One glance at the person who didn’t say your name — brief, complete, devastating — and then you take your new seat like a promotion.', effects: { charisma: 5, couple: true, partnerMood: 'buzzing', followers: 5, public: 3, storyBeat: 'Dropped at the fire — and caught. A rupture, survived in public.' } },
          incredible: { text: 'You thank your ex, sincerely, for “making space for something better,” live, at a firepit. The nation gets up and applauds its television.', effects: { charisma: 8, couple: true, partnerMood: 'buzzing', followers: 8, public: 5, storyBeat: 'Dropped at the fire — and caught. A rupture, survived in public.' } },
        },
      },
    },
  },
  {
    id: 'li_recoup_dumped', act: [2, 3], chainOnly: true, tags: ['host', 'recoupling'],
    art: 'li_dumped',
    context: 'The firepit · after the choosing · the Host, gently',
    prompt: '“I’m sorry. You haven’t been chosen — which means, tonight, you’ve been dumped from the Island. Say your goodbyes.” — You already knew. You knew at the second name. The others do the thing where they hold your hand harder to feel better about themselves.',
    recap: 'Not chosen — the Host says goodbye, and you already knew.',
    choices: {
      left: {
        label: 'Leave with grace',
        tags: ['camera', 'loyal'],
        governingStats: { charisma: 0.6, loyalty: 0.4 },
        outcomes: {
          bad: { text: '“No, honestly, I’ve had the best time,” you say, honestly. It’s the honesty that gets the sofa at home. Your season ends here.', effects: { charisma: 2, followers: 4, burnout: -3, addFlag: 'li_dumped_single' } },
          good: { text: 'You hug every single person, twice, and leave the villa better than you found it. She means it, which is the part that gets you.', effects: { charisma: 5, followers: 5, public: 3, burnout: -4, addFlag: 'li_dumped_single' } },
          incredible: { text: 'Your goodbye speech is so gracious the public immediately regrets everything. The clip does numbers you never did in the villa. Some careers start at the exit.', effects: { charisma: 8, followers: 10, public: 5, burnout: -5, addFlag: 'li_dumped_single' } },
        },
      },
      right: {
        label: 'Say the quiet part',
        tags: ['drama'],
        governingStats: { charisma: 1 },
        outcomes: {
          bad: { text: '“Some people in here know exactly what they did.” A sentence that will follow four separate people to the reunion. You leave in a spectacular mood.', effects: { charisma: 2, followers: 6, public: -3, addFlag: 'li_dumped_single' } },
          good: { text: 'You name no names and somehow indict everyone. The taxi door shuts on a villa already arguing about it. Exit: chef’s kiss.', effects: { charisma: 5, followers: 7, public: -2, addFlag: 'li_dumped_single' } },
          incredible: { text: 'Your exit interview detonates three storylines on your way past the pool. Dumped, technically. Main character, permanently.', effects: { charisma: 8, followers: 11, public: -2, addFlag: 'li_dumped_single' } },
        },
      },
    },
  },

  // ---------- Meet the Parents (beat window, Act 3) ----------
  {
    id: 'li_parents', act: 3, weight: 1, tags: ['beat:parents', 'chat', 'loyal'],
    art: 'li_parents',
    requires: { singleIs: false, flagsNone: ['li_revealed', 'li_partner_revealed'] },
    context: 'Final Week · the families arrive',
    prompt: 'Prosecco on the lawn and your partner’s mum walking towards you with the smile of a woman who has watched every episode. The families are the last gate before the Final. They have opinions. They have watched you sleep.',
    recap: 'Final Week — the families are on the lawn and they’ve watched everything.',
    choices: {
      left: {
        label: 'Be exactly yourselves',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: 'You are so yourselves that you have a small domestic about sun-lounger etiquette in front of both mothers. They exchange a look older than the show.', effects: { loyalty: 2, bond: 2, burnout: 3 } },
          good: { text: 'No performance, no rebrand — just the couple they’ve been watching, in person, slightly sunburnt. Her mum squeezes your hand on the way out. That’s the gate, passed.', effects: { loyalty: 5, bond: 6, public: 4 } },
          incredible: { text: 'His dad — a man who has said nine words all Season — pulls you in and says, “Look after him.” The nation hears it through the mic. The Final just tilted.', effects: { bond: 8, public: 6, loyalty: 8 } },
        },
      },
      right: {
        label: 'Charm the whole table',
        tags: ['camera', 'banter'],
        governingStats: { charisma: 1 },
        outcomes: {
          bad: { text: 'You deploy the full charm offensive and her mum, mid-anecdote, asks if you’re “always on.” The table waits, with interest, for your answer.', effects: { charisma: 2, public: 2, burnout: 4 } },
          good: { text: 'You have the dads laughing and the mums topped up inside ten minutes. Charm at a family table is a trade skill, and you came certified.', effects: { charisma: 5, public: 5, followers: 3 } },
          incredible: { text: 'By the end of lunch her mum follows you on everything and calls you “my favourite this year” to a boom mic. The families have voted early.', effects: { public: 7, followers: 6, charisma: 8 } },
        },
      },
    },
  },
  {
    id: 'li_parents_messy', act: 3, weight: 1, tags: ['beat:parents', 'chat', 'drama'],
    art: 'li_parents',
    requires: { singleIs: false, anyOf: [{ flagsAll: ['li_revealed'] }, { flagsAll: ['li_partner_revealed'] }] },
    context: 'Final Week · the families arrive · they’ve seen the footage',
    prompt: 'The families arrive smiling, and the smiles have footnotes. They watched Movie Night from their sofas. Somebody’s mum has the exact clip queued on her phone, and a question she has been rehearsing on the plane.',
    recap: 'The families arrive with footnotes — they watched Movie Night from the sofa.',
    choices: {
      left: {
        label: 'Own all of it',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: 'You own it so thoroughly the table gets a full timeline with corrections. Honesty: excellent. Slideshow energy: unnecessary.', effects: { loyalty: 2, bond: 3, public: 2, burnout: 3 } },
          good: { text: '“You saw what happened. We dealt with it. Here we still are.” Her mum studies you for a long moment, then nods at the here-you-still-are.', effects: { loyalty: 5, bond: 5, public: 4, burnout: -2 } },
          incredible: { text: '“You were going to ask about the film,” you say, kindly, first, and answer it completely. The mum came for an interrogation and stays for the wedding talk.', effects: { loyalty: 8, bond: 7, public: 6, burnout: -3 } },
        },
      },
      right: {
        label: 'Charm your way past it',
        tags: ['camera', 'banter'],
        governingStats: { charisma: 0.7, rizz: 0.3 },
        outcomes: {
          bad: { text: 'You steer every question towards the weather. Her mum, a season-ticket holder in deflection, lets you finish and then plays the clip.', effects: { charisma: 2, bond: -3, public: -2, burnout: 5 } },
          good: { text: 'You charm the table into a truce: nobody mentions the film, everybody has a lovely lunch, one mum keeps a single eyebrow raised for ninety minutes.', effects: { charisma: 5, public: 4, followers: 3, burnout: 2 } },
          incredible: { text: 'You turn the scandal into the table’s best anecdote, at your own expense, perfectly weighted. Even the raised eyebrow comes down. Star quality is star quality.', effects: { public: 6, followers: 6, charisma: 8 } },
        },
      },
    },
  },

  // ---------- The daybed (the Edit / Angles shop — one per act) ----------
  {
    id: 'li_daybed_1', act: 1, shop: true, tags: ['graft', 'camera'],
    art: 'li_daybed',
    context: 'The daybed · afternoon lull',
    prompt: 'Sun’s out. Half the villa is asleep and the other half is deciding your reputation for you. You’ve banked a little goodwill — enough, maybe, to start becoming a <i>thing</i>. Every reality show is really about becoming a thing.',
    recap: 'The daybed lull — enough goodwill banked to start becoming a thing.',
    choices: {
      left: {
        label: 'Invest in the edit',
        tags: ['graft', 'camera'],
        governingStats: { charisma: 0.6, savvy: 0.4 },
        cost: 4,
        outcomes: {
          bad: { text: 'You spend the afternoon workshopping a persona and mostly develop a tan line shaped like doubt. Still — the cameras noticed you trying.', effects: { charisma: 2, grantAngle: 'shelf', burnout: 2 } },
          good: { text: 'A well-placed chat here, a confessional there — by dinner, the villa has started describing you in shorthand. Shorthand is the whole economy.', effects: { charisma: 5, grantAngle: 'shelf', public: 3 } },
          incredible: { text: 'You assemble a reputation in one afternoon the way other people assemble flat-pack: quietly, correctly, with no parts left over.', effects: { charisma: 8, grantAngle: 'shelf', public: 5, followers: 3 } },
        },
      },
      right: {
        label: 'Save your graft',
        tags: ['rest'],
        governingStats: { savvy: 1 },
        outcomes: {
          bad: { text: 'You nap through a small scandal and wake up two storylines behind. The daybed gives, and the daybed takes.', effects: { savvy: 2, burnout: -3, public: -1 } },
          good: { text: 'You bank the goodwill and doze. Sometimes the strongest move on this show is visibly not needing it.', effects: { savvy: 5, burnout: -5, graft: 2 } },
          incredible: { text: 'You sleep like someone with nothing to hide, which — as of today — is somehow your reputation now. Free. FREE.', effects: { savvy: 8, burnout: -6, public: 4 } },
        },
      },
    },
  },
  {
    id: 'li_daybed_2', act: 2, shop: true, tags: ['graft', 'camera'],
    art: 'li_daybed',
    context: 'The daybed · The Turn · reputations hardening',
    prompt: 'Week three. The nation has sorted the villa into characters, and the characters are hardening like cement. If you want a say in what you set as, this is the window. The daybed is where edits are negotiated.',
    recap: 'Week three — the nation’s sorting the villa into characters.',
    choices: {
      left: {
        label: 'Invest in the edit',
        tags: ['graft', 'camera'],
        governingStats: { charisma: 0.6, savvy: 0.4 },
        cost: 6,
        outcomes: {
          bad: { text: 'You push the new angle hard and one Islander says, kindly, “you’ve been different lately.” A rebrand should be seamless. Yours has a visible seam.', effects: { charisma: 2, grantAngle: 'shelf', burnout: 3 } },
          good: { text: 'You put in a shift: the right chat, the right joke, the right shoulder at the right cry. The week’s edit bends your way.', effects: { charisma: 5, grantAngle: 'shelf', public: 3 } },
          incredible: { text: 'You spend one afternoon doing exactly the right things in front of exactly the right lenses. Somewhere in a gallery, an editor renames your folder.', effects: { charisma: 8, grantAngle: 'shelf', public: 5, followers: 4 } },
        },
      },
      right: {
        label: 'Keep your powder dry',
        tags: ['rest', 'strategy'],
        governingStats: { savvy: 1 },
        outcomes: {
          bad: { text: 'You sit out the reputation race for a day and the race, rudely, continues without you.', effects: { savvy: 2, burnout: -3, followers: -1 } },
          good: { text: 'You watch two Islanders exhaust themselves performing and quietly bank your energy for the beats that matter. The Turn rewards patience.', effects: { burnout: -5, savvy: 5 } },
          incredible: { text: 'Your day of doing nothing reads, on camera, as serene confidence. The nation decides you know something. You do: naps.', effects: { burnout: -6, public: 4, savvy: 8 } },
        },
      },
    },
  },
  {
    id: 'li_daybed_3', act: 3, shop: true, tags: ['graft', 'camera'],
    art: 'li_daybed',
    context: 'The daybed · Final Week · last chance to be a thing',
    prompt: 'Final Week. Whatever you are by Friday is what you’ll be at the reunion, on the podcasts, in the headlines under your engagement announcement or your gym launch. One more push, or make peace with the edit you’ve got.',
    recap: 'Final Week on the daybed — one last push at what you’ll be remembered as.',
    choices: {
      left: {
        label: 'One last push',
        tags: ['graft', 'camera'],
        governingStats: { charisma: 0.6, savvy: 0.4 },
        cost: 7,
        outcomes: {
          bad: { text: 'A Final Week rebrand is a risky flight to book. Yours boards late and lands in “trying too hard,” a destination with no connections.', effects: { charisma: 2, grantAngle: 'shelf', burnout: 3, public: -1 } },
          good: { text: 'You sharpen the persona for the run-in: cleaner lines, better timing, one signature move. The finale edit takes the note.', effects: { charisma: 5, grantAngle: 'shelf', public: 3 } },
          incredible: { text: 'You walk into the last weekend as the finished version of yourself — the one the intro sequence will use for years.', effects: { charisma: 8, grantAngle: 'shelf', public: 5, followers: 4 } },
        },
      },
      right: {
        label: 'Ride what you built',
        tags: ['rest', 'loyal'],
        governingStats: { loyalty: 0.5, savvy: 0.5 },
        outcomes: {
          bad: { text: 'You coast the last week and the edit, sensing slack, gives your screen time to a couple having a lovely time on a swan float.', effects: { loyalty: 2, burnout: -3, public: -1 } },
          good: { text: 'No more moves. You spend the graft window on the daybed with your favourite people, and it airs, because peace this late is rare footage.', effects: { loyalty: 5, burnout: -5, bond: 3 } },
          incredible: { text: 'You end the Season exactly as yourself, on a daybed, laughing at nothing. Twelve edits were available. You chose “person.” It plays beautifully.', effects: { loyalty: 8, burnout: -6, bond: 4, public: 4 } },
        },
      },
    },
  },

  // ---------- The wobbles (In-Your-Head coping interstitials) ----------
  {
    id: 'li_wobble_50', act: [1, 2, 3], chainOnly: true, tags: ['rest', 'chat'],
    art: 'li_beachhut',
    context: 'The Beach Hut · door closed',
    prompt: 'It’s all got a bit loud in there — the villa, the vote, the voice doing laps in your head at 4 a.m. The Beach Hut door shuts and, for one camera-shaped moment, it’s just you and the truth.',
    recap: 'Beach Hut, door shut — the 4 a.m. voice finally has you alone.',
    choices: {
      left: {
        label: 'Let it all out',
        tags: ['rest', 'chat'],
        governingStats: { loyalty: 0.5, charisma: 0.5 },
        outcomes: {
          bad: { text: 'You cry in the Hut, properly, snot and all. It helps. It also airs, gently scored with piano, to nine million people.', effects: { loyalty: 2, burnout: -6, followers: 2 } },
          good: { text: '“I just need a minute,” you tell the Hut, and take an hour. One honest wobble, out loud, to a camera that has heard worse. You leave two kilos lighter in the head.', effects: { loyalty: 5, burnout: -8, public: 3 } },
          incredible: { text: 'Your Beach Hut monologue is so raw and so exact that the nation stops scrolling. Being human, it turns out, is your best angle yet.', effects: { loyalty: 8, burnout: -10, public: 5, followers: 4 } },
        },
      },
      right: {
        label: 'Laugh it off',
        tags: ['banter', 'rest'],
        governingStats: { charisma: 1 },
        outcomes: {
          bad: { text: 'You do jokes at the camera until the jokes run out, and then sit in the silence you were joking over. The Hut waits. The Hut always waits.', effects: { charisma: 2, burnout: -3 } },
          good: { text: 'You roast your own week to the Hut camera — the pie, the postcard, the face you made — and walk out lighter. Comedy is load-bearing.', effects: { charisma: 5, burnout: -5, followers: 3 } },
          incredible: { text: 'Your self-roast is so good the edit runs it uncut. You’ve turned your worst week into your best segment, which is alchemy.', effects: { charisma: 8, burnout: -7, followers: 6, public: 4 } },
        },
      },
    },
  },
  {
    id: 'li_wobble_75', act: [2, 3], chainOnly: true, tags: ['rest', 'chat'],
    art: 'li_beachhut',
    context: 'The bedroom · 3 a.m. · everyone asleep but you',
    prompt: 'You’re lying in a room of sleeping people, wide awake, doing the maths on whether you can actually do this. The voice in your head has stopped doing laps and started doing commentary. One more bad day and you’ll walk. You can feel it.',
    recap: '3 a.m. in the bedroom, wide awake, one bad day from walking.',
    choices: {
      left: {
        label: 'Wake your favourite',
        tags: ['chat', 'loyal'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: '“You’re fine, babe,” they slur at 3 a.m., warm, half-asleep, 60% about their own thing. It still counts.', effects: { loyalty: 2, burnout: -8, bond: 2, storyBeat: 'The 3 a.m. maths, done and survived. The nation saw the crack and the staying.' } },
          good: { text: 'Kettle on, blanket out, the whole thing whispered on the kitchen terrace. Some people are load-bearing. You found yours.', effects: { loyalty: 5, burnout: -12, bond: 3, storyBeat: 'The 3 a.m. maths, done and survived. The nation saw the crack and the staying.' } },
          incredible: { text: 'They listen to the entire spiral and then say the one sentence that unhooks it. You go back to bed a different weight.', effects: { loyalty: 8, burnout: -14, bond: 4, public: 4, storyBeat: 'The 3 a.m. maths, done and survived. The nation saw the crack and the staying.' } },
        },
      },
      right: {
        label: 'Take the morning off',
        tags: ['rest'],
        governingStats: { savvy: 1 },
        outcomes: {
          bad: { text: 'You hide by the pool till noon, and it mostly works, except the show frames it as “tension” and now everyone’s asking if you’re okay, which — fair.', effects: { savvy: 2, burnout: -8, public: -1, storyBeat: 'The 3 a.m. maths, done and survived. The nation saw the crack and the staying.' } },
          good: { text: 'Headphones, sun, water, no chat. You give the villa nothing for a morning and the villa, miraculously, survives. So do you.', effects: { savvy: 5, burnout: -11, storyBeat: 'The 3 a.m. maths, done and survived. The nation saw the crack and the staying.' } },
          incredible: { text: 'You take a whole morning for yourself and come back so restored that two people ask what you’ve had done. Rest. You’ve had rest done.', effects: { savvy: 8, burnout: -13, public: 4, storyBeat: 'The 3 a.m. maths, done and survived. The nation saw the crack and the staying.' } },
        },
      },
    },
  },

  {
    // The break (R1/A2): the tier-3 wobble. Fires once, the last
    // exit ramp before Final Week's wall (76+, under the 79 line) — and the one card where a bad
    // choice IS the Walk (tough it out, botch it, and you're done).
    id: 'li_wobble_break', act: [2, 3], chainOnly: true, tags: ['rest', 'chat'],
    art: 'li_beachhut',
    context: 'Dawn · the end of the garden · packing distance from the gate',
    prompt: 'You’re up before the sun, sitting on your suitcase — when did you pack the suitcase? — doing the one sum the villa can’t edit: stay or go. Somewhere above you a camera whirs awake. Whatever you decide, you have to decide it now.',
    recap: 'Dawn on your suitcase — the one sum they can’t edit: stay or go.',
    choices: {
      left: {
        label: 'Tough it out',
        tags: ['strategy'],
        governingStats: { savvy: 0.6, loyalty: 0.4 },
        outcomes: {
          bad: { text: '“I’m fine.” You say it to the mirror, the kettle, the Beach Hut, and none of them believe you. By lunch the villa is one wall of noise, and you’re done — properly done. You ask for the gate before the evening feed.', effects: { burnout: 25 } },
          good: { text: 'You give yourself until the coffee goes cold to feel all of it. Then you unpack the case, put it back on the wardrobe, and go make eggs. Nobody ever knows.', effects: { burnout: -8, savvy: 2, storyBeat: 'Packed the suitcase at dawn — and unpacked it. Chose the villa on the hardest morning.' } },
          incredible: { text: 'You sit with it until the sun is properly up, and something quietly rewires. The villa gets the same person back, minus the noise. That night’s Beach Hut is almost unrecognisable.', effects: { burnout: -12, public: 4, storyBeat: 'Packed the suitcase at dawn — and unpacked it. Chose the villa on the hardest morning.' } },
        },
      },
      right: {
        label: 'Ask for help',
        tags: ['rest', 'chat'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: '“I need a day,” you tell production, and get one — off-camera, a phone call home, a walk outside the walls. The episode barely features you. That was the price. It was cheap.', effects: { burnout: -10, public: -2, followers: -2 } },
          good: { text: '“Talk to someone today,” says the welfare chat, and you do — properly, ugly bits included. You come back lighter. The show, to its credit, doesn’t use a second of it.', effects: { burnout: -14, public: -1 } },
          incredible: { text: 'You say the quiet thing to the right person and the machine, for once, works: a morning off the lawn, your mum’s voice, a plan. You walk back in like the Season just started.', effects: { burnout: -16 } },
        },
      },
    },
  },

  // ---------- The Final (per-Summit climax cards) ----------
  {
    id: 'li_final_winvilla', act: 3, finaleCard: true, pathAffinity: ['winvilla'], tags: ['host', 'camera'],
    art: 'li_final',
    context: 'The Final · the villa in fairy lights · the Host in evening wear',
    prompt: '“Islanders. Tonight, the public decide.” — The lawn has a stage now; the stage has fairy lights; the lights, somehow, have a sponsor. Millions of thumbs hover over two names. One is yours. Make the last look count.',
    recap: 'The Final — millions of thumbs hovering, one last look to the nation.',
    choices: {
      left: {
        label: 'Speak to the nation',
        tags: ['camera'],
        governingStats: { charisma: 1 },
        outcomes: {
          bad: { text: 'Your final speech aims for statesmanlike and arrives at best-man-after-four-proseccos. The nation votes with its heart anyway. Hearts are unpredictable.', effects: { charisma: 2, public: 2, burnout: 3 } },
          good: { text: 'You thank the villa, the nation, and one specific sofa in one specific living room. Direct address, correctly deployed, is a heat-seeking missile.', effects: { charisma: 5, public: 5, followers: 3 } },
          incredible: { text: 'Your last thirty seconds to camera are so clean the live audience makes a sound usually reserved for fireworks. The vote spikes visibly.', effects: { charisma: 8, public: 8, followers: 5 } },
        },
      },
      right: {
        label: 'Let the couple speak',
        tags: ['loyal', 'date'],
        governingStats: { loyalty: 0.6, rizz: 0.4 },
        outcomes: {
          bad: { text: 'Your joint speech has a hand-hold, a laugh, and one visible moment of “you go — no you.” Endearing. Chaotic. Very you two, apparently.', effects: { loyalty: 2, bond: 3, public: 2 } },
          good: { text: 'You let your partner talk and just look at them while they do. The camera holds the look. The look is the campaign.', effects: { loyalty: 5, bond: 5, public: 4 } },
          incredible: { text: 'The two of you finish each other’s speech without planning it, live. The Host mouths “wow” off-mic. That’s the winner’s edit, airing in real time.', effects: { loyalty: 8, bond: 6, public: 7 } },
        },
      },
    },
  },
  {
    id: 'li_final_realthing', act: 3, finaleCard: true, pathAffinity: ['realthing'], tags: ['host', 'loyal'],
    art: 'li_final',
    context: 'The Final · the terrace · one quiet minute before the ceremony',
    prompt: 'In an hour there’ll be a stage, a cheque, and a decision that isn’t yours. But right now it’s just the two of you on the terrace where it started, and one question that is: is this real out there, where the cameras aren’t?',
    recap: 'The Final terrace — one quiet minute, and one question: is this real out there.',
    choices: {
      left: {
        label: 'Say the whole thing',
        tags: ['loyal', 'chat'],
        governingStats: { loyalty: 1 },
        outcomes: {
          bad: { text: 'You say it all — slightly out of order, twice in places, once through a laugh that’s mostly nerves. They kiss you mid-correction. Noted, apparently.', effects: { loyalty: 2, bond: 4, burnout: 2 } },
          good: { text: 'You say the thing you’ve been carrying since Casa, plainly, no hashtag. “Tuesday,” they answer, using your first name. “Come to mine Tuesday.” Tuesdays are real life.', effects: { bond: 6, loyalty: 5 } },
          incredible: { text: 'You say it, and they say it back before you’ve finished, and for one minute the show around you is just weather. The nation watches two people stop performing.', effects: { bond: 9, loyalty: 8, public: 5 } },
        },
      },
      right: {
        label: 'Ask the hard question',
        tags: ['chat', 'strategy'],
        governingStats: { loyalty: 0.6, savvy: 0.4 },
        outcomes: {
          bad: { text: '“What happens out there?” gets an answer with a pause in front of it. The pause is honest. You did ask for honest.', effects: { loyalty: 2, bond: 2, burnout: 4 } },
          good: { text: 'You ask about the flat, the distance, the mates, the Monday version of this. They have answers. Prepared ones. They’ve been thinking about Mondays too.', effects: { loyalty: 3, bond: 5, savvy: 2 } },
          incredible: { text: 'You ask the question the reunion host would ask, and get the answer the reunion audience would scream at. Real, stress-tested, on record.', effects: { loyalty: 6, bond: 7, savvy: 2, public: 5 } },
        },
      },
    },
  },
  {
    id: 'li_final_brand', act: 3, finaleCard: true, pathAffinity: ['brand'], tags: ['host', 'camera'],
    art: 'li_final',
    context: 'The Final · backstage · your phone returned for one supervised hour',
    prompt: 'They hand your phone back for the finale, warm from a producer’s pocket. Four hundred thousand people you’ve never met have opinions, offers, and one very keen energy-drink brand. The villa was the audition. This hour is the career.',
    recap: 'Your phone’s back for an hour — the offers, the press, the career.',
    choices: {
      left: {
        label: 'Post the perfect goodbye',
        tags: ['camera', 'graft'],
        governingStats: { charisma: 0.7, savvy: 0.3 },
        outcomes: {
          bad: { text: 'You draft the farewell post nine times and accidentally publish draft three, the one with the typo and too much heart. It performs… fine. Hearts do fine.', effects: { charisma: 2, followers: 4, burnout: 3 } },
          good: { text: 'One photo, one line, no hashtag desperation. The comments fill with the exact sentence you wanted strangers to type. You’re a brand with taste now.', effects: { charisma: 5, followers: 7, public: 3 } },
          incredible: { text: 'The goodbye post is so precisely judged it gets screenshotted into three group chats a second. The energy-drink offer doubles by midnight.', effects: { charisma: 8, followers: 11, public: 5, graft: 4 } },
        },
      },
      right: {
        label: 'Work the press line',
        tags: ['camera', 'banter'],
        governingStats: { charisma: 1 },
        outcomes: {
          bad: { text: 'You give seven interviews and one of them, fatally, is honest about a castmate. The quote will orbit you for a month. Orbits are also exposure.', effects: { charisma: 2, followers: 5, public: -2, burnout: 3 } },
          good: { text: 'You do the press line like a pro: warm, quotable, nothing actionable. Three journalists write “star quality” independently. That’s the phrase. It’s stuck now.', effects: { followers: 7, charisma: 5 } },
          incredible: { text: 'You coin the Season’s catchphrase live on the press line, on purpose, and watch it leave your mouth and enter the culture. The villa made you; you made it back.', effects: { followers: 12, public: 5, charisma: 8 } },
        },
      },
    },
  },
];
