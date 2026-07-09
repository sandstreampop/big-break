// BIG BREAK — event deck, wave 3 (the doubling). Same schema as events.js
// (spec §8.1); kept in a second file so the corpus stays navigable. events.js
// imports EVENTS2 and folds it into the live deck; art.js imports ART2 for
// the emoji/scene registry; arcs.js imports NEW_ARCS for the Story Seeds
// registry. Content only — no logic. GENERATED: authored as batch files,
// inlined here. 263 cards, 263 art slots, 13 arcs.

import type { GameEvent } from '../../../types.js';

export const EVENTS2: GameEvent[] = [
  {
    "id": "n1_allages",
    "act": 1,
    "pathAffinity": [],
    "weight": 11,
    "art": "ev_n1_allages",
    "context": "The Elks Hall, 5 p.m. sharp",
    "prompt": "All-ages matinee. Every hand in the room has an X in marker, the merch table is a card table, and the show MUST end by eight because of bingo.",
    "recap": "An all-ages matinee at the Elks Hall, done by eight for bingo.",
    "tags": ["live"],
    "choices": {
      "left": {
        "label": "Play to the kids",
        "minigame": "crowd",
        "governingStats": { "skill": 1, "cred": 0.3 },
        "tags": ["live", "risky"],
        "outcomes": {
          "bad": {
            "text": "You say “how’s everybody doing” to a room legally too young to answer honestly. Someone’s dad claps alone.",
            "effects": { "skill": 2, "burnout": 4 }
          },
          "good": {
            "text": "The front row forms. Fourteen years old, arms crossed, absolutely locked in. That crossed-arms thing is their applause.",
            "effects": { "skill": 4, "cred": 4, "fame": 3 }
          },
          "incredible": {
            "text": "A kid asks you to sign their X. Their marker, their hand, your name. You are somebody’s first show now. Forever.",
            "effects": { "skill": 6, "cred": 6, "fame": 6, "network": 2 }
          }
        }
      },
      "right": {
        "label": "Charm the parents",
        "governingStats": { "network": 1 },
        "tags": ["network", "safe"],
        "outcomes": {
          "bad": {
            "text": "You network with the chaperones. One of them owns a boat, none of them own a venue.",
            "effects": { "network": 2, "burnout": 3 }
          },
          "good": {
            "text": "A mom who books the county fair takes your number. The county fair pays REAL money.",
            "effects": { "network": 5, "money": 25 }
          },
          "incredible": {
            "text": "The Elks themselves adopt you. You now have a hall, a discount, and eleven grandfathers.",
            "effects": { "network": 7, "cred": 3, "money": 40, "fame": 2 }
          }
        }
      }
    }
  },
  {
    "id": "n1_access_tv",
    "act": 1,
    "pathAffinity": [],
    "weight": 10,
    "art": "ev_n1_access_tv",
    "context": "Channel 98, “Community Corner,” 6:15 a.m.",
    "prompt": "Public access television. Your slot is between a zoning update and a segment about a dog who votes. The host, Barb, has done this show for thirty-one years and misses nothing.",
    "recap": "Public access TV, 6:15 a.m., between a zoning update and a voting dog.",
    "tags": ["live", "social"],
    "choices": {
      "left": {
        "label": "Play it earnest",
        "governingStats": { "skill": 1 },
        "tags": ["live", "safe", "mainstream"],
        "outcomes": {
          "bad": {
            "text": "The camera operator falls asleep on the zoom. Your close-up is of your elbow, for two minutes, in standard definition.",
            "effects": { "skill": 2, "fame": 2 }
          },
          "good": {
            "text": "Barb asks a real question and you give a real answer. Eleven people watching, and all eleven feel it.",
            "effects": { "skill": 4, "fame": 4, "cred": 2 }
          },
          "incredible": {
            "text": "Barb, off-air: “I’ve had three guests worth watching. You’re two of them.” You do not ask about the math. You take it.",
            "effects": { "skill": 5, "fame": 7, "cred": 4, "network": 3 }
          }
        }
      },
      "right": {
        "label": "Treat it like an arena",
        "governingStats": { "creativity": 1, "network": 0.3 },
        "tags": ["live", "risky", "fame"],
        "outcomes": {
          "bad": {
            "text": "You kick over a stool for effect. The stool belongs to the dog segment. The dog watches you set it back up.",
            "effects": { "creativity": 2, "cred": -2, "burnout": 4 }
          },
          "good": {
            "text": "You perform to the empty studio like it owes you money. A clip escapes containment and does numbers locally.",
            "effects": { "creativity": 5, "fame": 5, "network": 2 }
          },
          "incredible": {
            "text": "The chyron guy freestyles: “LOCAL MUSICIAN GOES OFF.” Someone rips it, posts it, and the comments are a fan club being born.",
            "effects": { "creativity": 7, "fame": 8, "cred": 3, "network": 3 }
          }
        }
      }
    }
  },
  {
    "id": "n1_group_chat",
    "act": 1,
    "pathAffinity": [],
    "weight": 11,
    "art": "ev_n1_group_chat",
    "context": "Your phone. 214 unread. You were just added.",
    "prompt": "Someone added you to THE group chat — the one where every show in this town is actually born. The last message is a venue, a date, and the word “who?”",
    "recap": "Added to the group chat where every show in town is born.",
    "tags": ["social", "network"],
    "choices": {
      "left": {
        "label": "Lurk and learn",
        "governingStats": { "cred": 1 },
        "tags": ["social", "safe"],
        "outcomes": {
          "bad": {
            "text": "You lurk so hard the chat forgets you exist. Someone asks “who added the ghost?”",
            "effects": { "cred": 2 }
          },
          "good": {
            "text": "Three weeks of silence and you now know who books what, who flakes, and who owns the good PA. Priceless intel.",
            "effects": { "cred": 4, "network": 3 }
          },
          "incredible": {
            "text": "You break your silence exactly once, with exactly the right joke, at exactly the right time. Legend status: quiet but permanent.",
            "effects": { "cred": 7, "network": 4, "fame": 2, "addFlag": "in_the_chat" }
          }
        }
      },
      "right": {
        "label": "Introduce yourself",
        "governingStats": { "network": 1 },
        "tags": ["social", "network", "risky"],
        "outcomes": {
          "bad": {
            "text": "You send a paragraph. With links. The chat responds with one thumbs-up, which in here is a door closing gently.",
            "effects": { "network": 2, "burnout": 3 }
          },
          "good": {
            "text": "“who?” gets answered: someone vouches for you unprompted. In this chat, a vouch is a currency.",
            "effects": { "network": 5, "cred": 3, "addFlag": "in_the_chat" }
          },
          "incredible": {
            "text": "You answer the open date: “I’ll play it.” Booked in four messages. The chat’s founder DMs you: “finally, somebody quick.”",
            "effects": { "network": 7, "cred": 4, "fame": 3, "addFlag": "in_the_chat" }
          }
        }
      }
    }
  },
  {
    "id": "n1_chat_fest",
    "act": [1, 2],
    "pathAffinity": [],
    "weight": 9,
    "art": "ev_n1_chat_fest",
    "context": "The group chat, planning at light speed",
    "prompt": "The chat has decided: YARDFEST. Six bands, one backyard, ten days, zero budget. Jobs are being assigned faster than anyone can decline them.",
    "recap": "The chat decreed YARDFEST: six bands, one backyard, zero budget.",
    "tags": ["live", "social"],
    "requires": { "flagsAll": ["in_the_chat"] },
    "choices": {
      "left": {
        "label": "Volunteer to book it",
        "governingStats": { "network": 1, "cred": 0.3 },
        "tags": ["network", "risky"],
        "outcomes": {
          "bad": {
            "text": "Herding six bands is herding thirty people, two of whom are feuding over a borrowed cymbal from 2019. You age visibly.",
            "effects": { "network": 3, "burnout": 6 }
          },
          "good": {
            "text": "It happens. On time, even. The yard holds, the cops wave, and everyone knows who made it work.",
            "effects": { "network": 5, "cred": 4, "fame": 3 }
          },
          "incredible": {
            "text": "YARDFEST becomes a proper noun. People are already saying “next year.” You are, apparently, a festival now.",
            "effects": { "network": 8, "cred": 6, "fame": 6 }
          }
        }
      },
      "right": {
        "label": "Just play your slot",
        "governingStats": { "skill": 1 },
        "tags": ["live", "safe"],
        "outcomes": {
          "bad": {
            "text": "Your slot is 2 p.m., direct sun, during the potluck rush. You compete with a casserole and lose.",
            "effects": { "skill": 2, "burnout": 3 }
          },
          "good": {
            "text": "Golden hour slot. The yard fills, the dog stops barking, and somebody’s string lights come on during your closer.",
            "effects": { "skill": 4, "cred": 3, "fame": 3 }
          },
          "incredible": {
            "text": "The whole backyard sings a chorus they learned thirty seconds ago. A neighbor complains, then stays for the encore.",
            "effects": { "skill": 6, "cred": 5, "fame": 6, "network": 2 }
          }
        }
      }
    }
  },
  {
    "id": "n1_wrong_cover",
    "act": 1,
    "pathAffinity": [],
    "weight": 10,
    "art": "ev_n1_wrong_cover",
    "context": "Request night. A regular holds up a napkin.",
    "prompt": "The napkin says a classic everyone knows. You learned it years ago from a free tab site, and you are realizing — live, mid-count-in — that your version has a bridge that does not exist.",
    "recap": "A napkin request, and your version has a bridge that doesn’t exist.",
    "tags": ["live"],
    "choices": {
      "left": {
        "label": "Commit to your version",
        "governingStats": { "creativity": 1 },
        "tags": ["live", "risky", "indie"],
        "outcomes": {
          "bad": {
            "text": "The regular mouths the real words at you like a hostage negotiator. Your fake bridge arrives. His face goes on a journey.",
            "effects": { "creativity": 2, "cred": -2, "burnout": 4 }
          },
          "good": {
            "text": "Half the bar assumes it’s a bold rearrangement. The other half assumes they misremembered. Both halves clap.",
            "effects": { "creativity": 5, "cred": 3, "fame": 2 }
          },
          "incredible": {
            "text": "The regular corners you after: “your bridge is better.” He’s been hearing this song for forty years. He would know.",
            "effects": { "creativity": 7, "cred": 6, "fame": 4 }
          }
        }
      },
      "right": {
        "label": "Relearn it live, by ear",
        "governingStats": { "skill": 1 },
        "tags": ["live", "safe", "practice"],
        "outcomes": {
          "bad": {
            "text": "You hunt for the real chords in real time. The song becomes a documentary about searching.",
            "effects": { "skill": 2, "burnout": 4 }
          },
          "good": {
            "text": "You find it by the second verse and land the ending like you knew it all along. Nobody saw the scaffolding.",
            "effects": { "skill": 5, "cred": 3 }
          },
          "incredible": {
            "text": "Ear, hands, done — corrected mid-flight without dropping a beat. A guitarist at the bar quietly puts down his drink to watch your left hand.",
            "effects": { "skill": 7, "cred": 5, "network": 3 }
          }
        }
      }
    }
  },
  {
    "id": "n1_amp_bus",
    "act": 1,
    "pathAffinity": [],
    "weight": 10,
    "art": "ev_n1_amp_bus",
    "context": "The 7:40 crosstown. The amp takes up a seat.",
    "prompt": "The gig is nine stops away and your ride fell through. The driver eyes the amp. House rule, apparently: “If it wears a seatbelt, it rides.”",
    "recap": "The crosstown bus, nine stops to the gig, and an amp needing a seat.",
    "tags": ["live", "work"],
    "choices": {
      "left": {
        "label": "Buckle the amp in",
        "governingStats": { "network": 1 },
        "tags": ["network", "safe"],
        "outcomes": {
          "bad": {
            "text": "Rush hour. You stand for nine stops while your amp sits, belted, comfortable, judged by commuters.",
            "effects": { "network": 2, "burnout": 3 }
          },
          "good": {
            "text": "The driver asks what you play. By stop six the whole front of the bus knows about the show. Two of them come.",
            "effects": { "network": 5, "fame": 3 }
          },
          "incredible": {
            "text": "The driver detours HALF A BLOCK to drop you at the venue door. The bus applauds. Transit law bends for no one, except apparently you.",
            "effects": { "network": 7, "fame": 5, "cred": 4 }
          }
        }
      },
      "right": {
        "label": "Practice quietly en route",
        "governingStats": { "skill": 1, "creativity": 0.3 },
        "tags": ["practice", "risky"],
        "outcomes": {
          "bad": {
            "text": "Unplugged fingerwork over engine noise. A teen films you with the caption “sir this is a bus.” Fair.",
            "effects": { "skill": 2, "fame": 2 }
          },
          "good": {
            "text": "The bus rhythm locks into your song — brakes on the two and four. You arrive warmed up and weirdly inspired.",
            "effects": { "skill": 4, "creativity": 3 }
          },
          "incredible": {
            "text": "Nine stops of silent shredding and you step off with the set memorized cold. The teen’s video does numbers. Caption unchanged.",
            "effects": { "skill": 6, "creativity": 3, "fame": 5 }
          }
        }
      }
    }
  },
  {
    "id": "n1_lesson_flyer",
    "act": 1,
    "pathAffinity": [],
    "weight": 10,
    "art": "ev_n1_lesson_flyer",
    "context": "The library corkboard, next to a missing cat",
    "prompt": "A parent calls the number on a flyer you barely remember posting. Their kid saw you play and “won’t shut up about it.” They want weekly lessons. You have never taught anything except a dog to sit, partially.",
    "recap": "A parent calls the lesson flyer you barely remember posting.",
    "tags": ["work", "practice"],
    "choices": {
      "left": {
        "label": "Take the student",
        "governingStats": { "skill": 1, "network": 0.3 },
        "tags": ["work", "practice", "risky"],
        "outcomes": {
          "bad": {
            "text": "The kid learns fast, asks “why” at everything, and finds a hole in your theory knowledge the size of a garage door. You both take notes.",
            "effects": { "skill": 2, "money": 20, "burnout": 4 }
          },
          "good": {
            "text": "Week four: the kid nails the riff and looks at you like you invented sound. Two more parents call. You are, somehow, a teacher.",
            "effects": { "skill": 4, "money": 40, "network": 3, "grantHustle": "lesson_studio" }
          },
          "incredible": {
            "text": "The kid plays their school talent show and thanks “my teacher” from the stage. You have a waitlist now. A WAITLIST.",
            "effects": { "skill": 6, "money": 60, "network": 4, "cred": 3, "fame": 2, "grantHustle": "lesson_studio" }
          }
        }
      },
      "right": {
        "label": "Refer them onward",
        "governingStats": { "cred": 1 },
        "tags": ["network", "safe"],
        "outcomes": {
          "bad": {
            "text": "You recommend the retired ace above the vape shop. The parent hears “vape shop” and hangs up.",
            "effects": { "cred": 2 }
          },
          "good": {
            "text": "The referral lands. The ace sends a nod back down the mountain: “good instincts, kid.” The scene keeps receipts on generosity.",
            "effects": { "cred": 5, "network": 3 }
          },
          "incredible": {
            "text": "The ace calls YOU. “You send me students, I send you sessions.” An economy of favors, and you are suddenly in it.",
            "effects": { "cred": 6, "network": 6, "money": 30 }
          }
        }
      }
    }
  },
  {
    "id": "n1_corner_notebook",
    "act": 1,
    "pathAffinity": [],
    "weight": 10,
    "art": "ev_n1_corner_notebook",
    "context": "Your notebook. Page 31: “CORNERS, RANKED.”",
    "prompt": "Months of busking produced a document: foot traffic by hour, echo quality, shade windows, which barista brings out mistakes. Word got out. Three buskers want copies. One is offering cash.",
    "recap": "Your ranked atlas of busking corners, and three buskers who want copies.",
    "tags": ["busk", "deal"],
    "choices": {
      "left": {
        "label": "Publish the atlas",
        "governingStats": { "network": 1, "creativity": 0.3 },
        "tags": ["deal", "busk", "risky"],
        "outcomes": {
          "bad": {
            "text": "You sell three copies, and by Friday your own best corner has a line. You have disrupted yourself.",
            "effects": { "network": 2, "money": 25, "burnout": 3 }
          },
          "good": {
            "text": "Photocopied, stapled, $10 each — and buskers start leaving you tips ON the corners you rated. The map becomes the territory.",
            "effects": { "network": 5, "money": 45, "cred": 3, "grantHustle": "corner_atlas" }
          },
          "incredible": {
            "text": "The atlas gets a name, a waiting list, and a quarterly update. Buskers cite page numbers at each other. You built infrastructure.",
            "effects": { "network": 7, "money": 70, "cred": 5, "fame": 3, "grantHustle": "corner_atlas" }
          }
        }
      },
      "right": {
        "label": "Guard the intel",
        "governingStats": { "cred": 1, "skill": 0.3 },
        "tags": ["busk", "safe", "solo"],
        "outcomes": {
          "bad": {
            "text": "You keep the secrets and the corners. The other buskers keep a respectful, slightly cold distance. Lonely at the top of page 31.",
            "effects": { "cred": 2, "money": 20 }
          },
          "good": {
            "text": "The good corners stay quiet and the hauls stay yours. Craft plus logistics: an underrated combination.",
            "effects": { "cred": 3, "money": 55, "skill": 2 }
          },
          "incredible": {
            "text": "You work the ranked corners like a farmer rotating crops. Best month yet, and a regular starts requesting you BY CORNER.",
            "effects": { "cred": 5, "money": 90, "skill": 3, "fame": 2 }
          }
        }
      }
    }
  },
  {
    "id": "n1_gentle_chord",
    "act": 1,
    "pathAffinity": [],
    "weight": 10,
    "art": "ev_n1_gentle_chord",
    "context": "After the quiet set. A person with a laptop lanyard.",
    "prompt": "“That last chord. The soft one, at the end.” The app developer holds their phone like evidence. “People wake up violently. Sirens, beeps, dread. Your chord could fix mornings. I want to license it.”",
    "recap": "An app developer wants to license your soft closing chord for alarms.",
    "tags": ["deal", "tone"],
    "choices": {
      "left": {
        "label": "License the chord",
        "governingStats": { "network": 1, "creativity": 0.3 },
        "tags": ["deal", "risky", "electronic"],
        "outcomes": {
          "bad": {
            "text": "You record forty takes of one chord in their apartment while their roommate microwaves fish. The check is real but small.",
            "effects": { "network": 2, "money": 30, "burnout": 3 }
          },
          "good": {
            "text": "The app ships. Strangers now wake up inside your chord every morning. The royalty is tiny, but it arrives like a sunrise: reliably.",
            "effects": { "network": 4, "money": 50, "fame": 3, "grantHustle": "alarm_app" }
          },
          "incredible": {
            "text": "A review calls it “the first alarm that feels like being forgiven.” Downloads spike. Somewhere, thousands of mornings are yours now.",
            "effects": { "network": 6, "money": 80, "fame": 6, "cred": 3, "grantHustle": "alarm_app" }
          }
        }
      },
      "right": {
        "label": "Keep the chord home",
        "governingStats": { "cred": 1 },
        "tags": ["tone", "safe", "indie"],
        "outcomes": {
          "bad": {
            "text": "You decline on principle. The developer nods, hurt, and licenses a wind chime instead. The wind chime does fine.",
            "effects": { "cred": 2 }
          },
          "good": {
            "text": "“The chord means something WHERE IT IS.” The developer quotes you in a talk about artistic integrity. Odd, but the cred is real.",
            "effects": { "cred": 5, "fame": 2 }
          },
          "incredible": {
            "text": "The refusal becomes scene lore — the musician who would not sell the soft part. People come to the shows just to hear it in context.",
            "effects": { "cred": 7, "fame": 4, "network": 2 }
          }
        }
      }
    }
  },
  {
    "id": "n1_heat_brownout",
    "act": 1,
    "pathAffinity": [],
    "weight": 10,
    "art": "ev_n1_heat_brownout",
    "context": "The venue. 104° outside. One overworked fuse.",
    "prompt": "Heatwave night. The venue’s wiring can run the AC or your amp — not both. The crowd is melting, the promoter is sweating through a second shirt, and somebody has to choose.",
    "recap": "Heatwave night: the wiring runs the AC or your amp, not both.",
    "tags": ["live"],
    "requires": { "weatherIs": "heatwave" },
    "choices": {
      "left": {
        "label": "Unplug. AC on. Go acoustic.",
        "governingStats": { "creativity": 1, "cred": 0.3 },
        "tags": ["live", "safe", "roots"],
        "outcomes": {
          "bad": {
            "text": "Acoustic in a room built for loud. The AC hums in E flat. Your set is now in E flat. All of it.",
            "effects": { "creativity": 2, "burnout": 3 }
          },
          "good": {
            "text": "Cool air, quiet songs, a crowd that stops fanning itself to listen. The heat made everyone honest.",
            "effects": { "creativity": 5, "cred": 4, "fame": 3 }
          },
          "incredible": {
            "text": "The stripped set becomes church. A bartender turns off the ice machine so it can be QUIETER. People talk about this night all summer.",
            "effects": { "creativity": 7, "cred": 6, "fame": 6, "network": 2 }
          }
        }
      },
      "right": {
        "label": "Amp over AC. Full send.",
        "governingStats": { "skill": 1 },
        "tags": ["live", "risky"],
        "outcomes": {
          "bad": {
            "text": "You play loud into a sauna. Three songs in, the fuse makes its own decision. Darkness, heat, and one long feedback whine as a eulogy.",
            "effects": { "skill": 2, "burnout": 6, "fame": 2 }
          },
          "good": {
            "text": "Sweat equity, literally. The crowd that stays becomes a unit — soaked, loud, loyal. Heatwave shows forge alloys.",
            "effects": { "skill": 5, "cred": 4, "fame": 4, "burnout": 4 }
          },
          "incredible": {
            "text": "The hottest show of the year, in every sense. Someone faints, recovers, and refuses to leave. The promoter frames his ruined shirt.",
            "effects": { "skill": 7, "cred": 5, "fame": 7, "network": 3, "burnout": 4 }
          }
        }
      }
    }
  },
  {
    "id": "n1_off_season_pier",
    "act": 1,
    "pathAffinity": [],
    "weight": 10,
    "art": "ev_n1_off_season_pier",
    "context": "A boardwalk bar, boarded neighbors, six regulars",
    "prompt": "Off-season. The tourist town is a ghost of itself — shuttered fudge shops, one open bar, six regulars who live here year-round. The owner shrugs: “Summer people tip. Winter people LISTEN.”",
    "recap": "Off-season ghost town, one open bar, six year-round regulars.",
    "tags": ["live", "rest"],
    "requires": { "weatherIs": "off_season" },
    "choices": {
      "left": {
        "label": "Play for the six",
        "governingStats": { "cred": 1, "skill": 0.3 },
        "tags": ["live", "safe", "roots"],
        "outcomes": {
          "bad": {
            "text": "Six people, zero pretense. When you rush the ending, all six notice. Winter people listen, alright.",
            "effects": { "cred": 2, "money": 20, "burnout": -2 }
          },
          "good": {
            "text": "By the last song they’re requesting by feel — “the sad one again, but slower.” Six people, and the room is somehow full.",
            "effects": { "cred": 5, "money": 35, "burnout": -3, "skill": 2 }
          },
          "incredible": {
            "text": "The owner locks the door at close and says “one more, just for us.” Seven people, one bar, the ocean outside. You will chase this feeling forever.",
            "effects": { "cred": 7, "money": 50, "fame": 2, "burnout": -5, "network": 2 }
          }
        }
      },
      "right": {
        "label": "Workshop the new stuff",
        "governingStats": { "creativity": 1 },
        "tags": ["write", "risky", "indie"],
        "outcomes": {
          "bad": {
            "text": "You test four unfinished songs on six unimpressed lifers. The feedback is silence with eyebrows.",
            "effects": { "creativity": 2, "burnout": 3 }
          },
          "good": {
            "text": "The empty town is a laboratory. You try wild arrangements, and the regulars grade honestly: two keepers, one “needs a bridge.”",
            "effects": { "creativity": 5, "skill": 3 }
          },
          "incredible": {
            "text": "A retired fisherman fixes your second verse with one sentence about tides. You write it on your arm so you cannot lose it.",
            "effects": { "creativity": 8, "cred": 3, "skill": 2 }
          }
        }
      }
    }
  },
  {
    "id": "n1_venue_polaroid",
    "act": 1,
    "pathAffinity": [],
    "weight": 10,
    "art": "ev_n1_venue_polaroid",
    "context": "{venue}, an hour before doors",
    "prompt": "The wall behind the bar at {venue} is polaroids — decades of regulars and lifers, curling at the corners. Tonight the owner is holding the camera and looking at you. “It’s time.”",
    "recap": "The owner’s polaroid wall, camera up, pointed at you.",
    "tags": ["live", "home"],
    "requires": { "venueAny": true },
    "choices": {
      "left": {
        "label": "Pose like you belong",
        "governingStats": { "network": 1, "cred": 0.3 },
        "tags": ["network", "safe", "home"],
        "outcomes": {
          "bad": {
            "text": "You blink. The owner shrugs — “the wall takes what it takes” — and pins up the blink. You are eyelids now, forever, at {venue}.",
            "effects": { "network": 2, "cred": 2 }
          },
          "good": {
            "text": "Click. Pinned between a darts champion and a poet. The owner taps the wall: “that spot has been waiting.”",
            "effects": { "network": 4, "cred": 4, "venueLove": 1 }
          },
          "incredible": {
            "text": "The owner puts you at EYE LEVEL. Regulars notice within the hour. At {venue}, eye level is a knighthood.",
            "effects": { "network": 6, "cred": 6, "fame": 3, "venueLove": 1 }
          }
        }
      },
      "right": {
        "label": "Earn it onstage first",
        "governingStats": { "skill": 1 },
        "tags": ["live", "risky"],
        "outcomes": {
          "bad": {
            "text": "You insist on playing first, then flub the closer. The owner takes the photo anyway, mid-wince. Honest wall, honest photo.",
            "effects": { "skill": 2, "burnout": 3 }
          },
          "good": {
            "text": "You play the set of the month, then turn to the camera still sweating. THAT is the polaroid. It looks like arrival.",
            "effects": { "skill": 5, "cred": 4, "fame": 2, "venueLove": 1 }
          },
          "incredible": {
            "text": "The room is still roaring when the flash goes. The owner writes one word under the photo: “OURS.” You look away so nobody sees your face do the thing.",
            "effects": { "skill": 6, "cred": 6, "fame": 4, "venueLove": 1, "burnout": -2 }
          }
        }
      }
    }
  },
  {
    "id": "n1_estate_sale",
    "act": 1,
    "pathAffinity": [],
    "weight": 9,
    "shop": true,
    "art": "ev_n1_estate_sale",
    "context": "A driveway. Forty years of wedding gigs, priced to move.",
    "prompt": "The bandleader of The Satin Tones is retiring, and his driveway is a museum with price stickers — road-worn gear that has played a thousand first dances. His wife supervises from a lawn chair, adjusting prices with a look.",
    "recap": "A retiring bandleader’s driveway of road-worn wedding gear.",
    "tags": ["shop"],
    "choices": {
      "left": {
        "label": "Buy the workhorse ($55)",
        "governingStats": { "cred": 1, "network": 0.4 },
        "tags": ["shop", "deal"],
        "cost": 55,
        "outcomes": {
          "bad": {
            "text": "It smells like four decades of banquet halls and it will not stop smelling like that. It works perfectly. You work around the smell.",
            "effects": { "money": -55, "grantGear": "random_basic" }
          },
          "good": {
            "text": "“That one did eight hundred weddings,” he says, wiping it down one last time. “Never missed a downbeat.” Neither will you.",
            "effects": { "money": -55, "grantGear": "random_basic", "cred": 3 }
          },
          "incredible": {
            "text": "His wife overrules the sticker — “for a working musician, less.” He salutes you from the garage. The gear hums like it knows.",
            "effects": { "money": -40, "grantGear": "random_basic", "cred": 4, "network": 3 }
          }
        }
      },
      "right": {
        "label": "Trade stories instead",
        "governingStats": { "network": 1 },
        "tags": ["network", "safe"],
        "outcomes": {
          "bad": {
            "text": "Two hours of anecdotes about a hora that went wrong in 1987. You buy nothing and learn one useful thing about tempo and grandmothers.",
            "effects": { "network": 2, "skill": 2 }
          },
          "good": {
            "text": "He gives you the real curriculum: how to read a room, how to rescue a dying dance floor, which songs are load-bearing. Free. Priceless.",
            "effects": { "network": 4, "skill": 4, "cred": 2 }
          },
          "incredible": {
            "text": "At sunset he hands you his booking ledger — forty years of venue contacts, annotated. “Somebody should keep the circuit alive.”",
            "effects": { "network": 8, "cred": 4, "money": 20 }
          }
        }
      }
    }
  },
  {
    "id": "n1_receipt_song",
    "act": 1,
    "pathAffinity": [],
    "weight": 10,
    "art": "ev_n1_receipt_song",
    "context": "Register 2, hour six of eight",
    "prompt": "The melody arrives mid-shift, uninvited and perfect, while you ring up someone’s forty-nine-cent bananas. The only paper within reach is the receipt tape. Your manager is on break for eleven more minutes.",
    "recap": "A perfect melody arrives mid-shift at register 2.",
    "tags": ["write", "work"],
    "choices": {
      "left": {
        "label": "Write it on the tape",
        "minigame": "ideas",
        "governingStats": { "creativity": 1 },
        "tags": ["write", "risky"],
        "outcomes": {
          "bad": {
            "text": "You get four bars down before the line forms. A customer takes your song home stapled to her banana receipt. Gone. Mostly gone.",
            "effects": { "creativity": 2, "burnout": 3 }
          },
          "good": {
            "text": "Eleven minutes, three feet of tape, one whole verse and a chorus. You clock out humming and transcribe it in the parking lot.",
            "effects": { "creativity": 5, "skill": 2, "writeSong": true }
          },
          "incredible": {
            "text": "The melody unspools like it was pre-printed on the roll. A regular reads it upside down and says “that’s going to be something.” She is right.",
            "effects": { "creativity": 7, "cred": 3, "fame": 2, "writeSong": true }
          }
        }
      },
      "right": {
        "label": "Hum it, hold the line",
        "governingStats": { "skill": 1 },
        "tags": ["work", "safe"],
        "outcomes": {
          "bad": {
            "text": "You hum it for two hours to keep it alive. By close it has mutated into a jingle for a store that does not exist.",
            "effects": { "skill": 2, "money": 20 }
          },
          "good": {
            "text": "You guard the melody in your skull through sixty transactions and one price check. It survives. So does your job.",
            "effects": { "skill": 4, "money": 30, "creativity": 2 }
          },
          "incredible": {
            "text": "You hum it so relentlessly a coworker starts harmonizing from aisle five. By close it has a second part it never asked for. Keeper.",
            "effects": { "skill": 5, "creativity": 4, "money": 30, "network": 2 }
          }
        }
      }
    }
  },
  {
    "id": "n1_argument_song",
    "act": 1,
    "pathAffinity": [],
    "weight": 10,
    "art": "ev_n1_argument_song",
    "context": "The couple upstairs, through the ceiling, at volume",
    "prompt": "The couple upstairs argues in what you slowly realize is perfect meter. Call, response, a recurring phrase that lands like a chorus: “you ALWAYS say that.” It is, structurally, a better song than anything you wrote this month.",
    "recap": "The couple upstairs arguing in perfect meter.",
    "tags": ["write", "home"],
    "choices": {
      "left": {
        "label": "Transcribe the cadence",
        "governingStats": { "creativity": 1 },
        "tags": ["write", "risky", "indie"],
        "outcomes": {
          "bad": {
            "text": "You get the rhythm down just as they make up, loudly, which is a different genre. You keep the first half.",
            "effects": { "creativity": 2, "burnout": 3 }
          },
          "good": {
            "text": "You change the names, keep the meter, and build a song on the bones of somebody else’s Tuesday. The chorus hits like a slammed door.",
            "effects": { "creativity": 5, "cred": 2, "writeSong": true }
          },
          "incredible": {
            "text": "The song pours out whole. Months later a stranger will tell you it is “exactly what fighting feels like.” You will thank the ceiling privately.",
            "effects": { "creativity": 8, "cred": 4, "fame": 2, "writeSong": true }
          }
        }
      },
      "right": {
        "label": "Knock and check on them",
        "governingStats": { "network": 1, "cred": 0.3 },
        "tags": ["home", "safe", "family"],
        "outcomes": {
          "bad": {
            "text": "They answer the door mid-sentence, united instantly against you. The argument was apparently load-bearing.",
            "effects": { "network": 2 }
          },
          "good": {
            "text": "They deflate, apologize, and invite you in for tea. Turns out the fight was about a lamp. Most fights are about a lamp.",
            "effects": { "network": 4, "cred": 3, "burnout": -3 }
          },
          "incredible": {
            "text": "The tea becomes a tradition. The couple becomes your fiercest local fans, and their lamp story becomes your best between-song banter.",
            "effects": { "network": 6, "cred": 4, "fame": 2, "burnout": -4 }
          }
        }
      }
    }
  },
  {
    "id": "n1_amp_tech",
    "act": 1,
    "pathAffinity": [],
    "weight": 10,
    "art": "ev_n1_amp_tech",
    "context": "Hums & Buzzes Repair, est. “a while”",
    "prompt": "The tech diagnoses your amp by smell, fixes it in nine minutes, then plugs in a dusty bass “to test the output.” The test riff is disgusting. In the good way. In the best way.",
    "recap": "The repair tech plugs in a dusty bass to test the output.",
    "tags": ["band", "network"],
    "choices": {
      "left": {
        "label": "Jam the test signal",
        "governingStats": { "skill": 1, "network": 0.4 },
        "tags": ["band", "risky"],
        "outcomes": {
          "bad": {
            "text": "You clam the first change and the tech winces like the amp did. “Output’s fine,” they say, unplugging. “Input needs work.”",
            "effects": { "skill": 2, "burnout": 3 }
          },
          "good": {
            "text": "Twenty unplanned minutes. Customers stop browsing to watch. The tech nods at the end, which — per the regulars — has never happened.",
            "effects": { "skill": 4, "network": 4, "cred": 3 }
          },
          "incredible": {
            "text": "The jam locks in so hard the tech flips the sign to CLOSED. “I fix amps because nobody around here could PLAY,” they say. “Rehearsal’s Tuesday.”",
            "effects": { "skill": 6, "network": 5, "cred": 4, "fame": 2, "grantBandmate": "random" }
          }
        }
      },
      "right": {
        "label": "Pay, thank, and go",
        "governingStats": { "cred": 1 },
        "tags": ["safe", "work"],
        "outcomes": {
          "bad": {
            "text": "You pay full price and leave during the riff. On the bus you realize the riff is stuck in your head, rent-free, forever.",
            "effects": { "cred": 2, "money": -30 }
          },
          "good": {
            "text": "You tip what you can and say what the riff deserved. The tech waves it off but writes your name on the GOOD customers list.",
            "effects": { "cred": 4, "network": 3, "money": -25 }
          },
          "incredible": {
            "text": "“Bring it back before it breaks, not after,” the tech says, and knocks the bill down to parts. Your amp will never fear death again.",
            "effects": { "cred": 5, "network": 4, "money": -10 }
          }
        }
      }
    }
  },
  {
    "id": "n1_piano_today",
    "act": 1,
    "pathAffinity": [],
    "weight": 10,
    "art": "ev_n1_piano_today",
    "context": "A porch two streets over. A sign: FREE PIANO.",
    "prompt": "A free upright, tuned and lovely, with one condition taped to the lid: GONE BY SUNDOWN. You own no truck, one dolly with a personality, and three friends of varying reliability.",
    "recap": "A free upright, tuned and lovely, gone by sundown.",
    "tags": ["home", "network"],
    "choices": {
      "left": {
        "label": "Assemble the muscle",
        "governingStats": { "network": 1 },
        "tags": ["network", "risky", "home"],
        "outcomes": {
          "bad": {
            "text": "Four people, one staircase, physics. The piano survives; a door frame and one friendship require repairs. You own a piano and an apology tour.",
            "effects": { "network": 2, "burnout": 6, "cred": 2 }
          },
          "good": {
            "text": "It takes five hours, two pizzas, and a rope you had no right to trust. At sundown, a piano stands in your living room like it grew there.",
            "effects": { "network": 5, "creativity": 3, "cred": 2 }
          },
          "incredible": {
            "text": "The move becomes a block event. Neighbors carry, kids direct traffic, someone brings lemonade. The piano arrives with a fan club attached.",
            "effects": { "network": 7, "creativity": 4, "cred": 3, "fame": 2 }
          }
        }
      },
      "right": {
        "label": "Play it once, walk away",
        "governingStats": { "creativity": 1 },
        "tags": ["solo", "safe", "rest"],
        "outcomes": {
          "bad": {
            "text": "You play it on the porch for an hour and walk home empty-handed, haunted by an instrument. There is a song in this. There had better be.",
            "effects": { "creativity": 2, "burnout": -2 }
          },
          "good": {
            "text": "One golden hour on a stranger’s porch, then goodbye. The melody you found follows you home, which is lighter than a piano.",
            "effects": { "creativity": 5, "burnout": -3 }
          },
          "incredible": {
            "text": "The owner listens from the window, then comes out crying. It was her mother’s. She keeps the piano. You keep an open invitation to play it, always.",
            "effects": { "creativity": 7, "network": 3, "cred": 3, "burnout": -3 }
          }
        }
      }
    }
  },
  {
    "id": "n1_borrowed_rig",
    "act": 1,
    "pathAffinity": [],
    "weight": 10,
    "art": "ev_n1_borrowed_rig",
    "context": "Your rig: five owners, none of them you",
    "prompt": "An audit of your setup: Dee’s amp, Marcus’s pedal, a cable of disputed origin, a stand from a church. Dee wants her amp back Friday. Your show is Friday.",
    "recap": "Your whole rig is borrowed, and Dee wants her amp back Friday.",
    "tags": ["home", "deal"],
    "choices": {
      "left": {
        "label": "Negotiate one more night",
        "governingStats": { "network": 1 },
        "tags": ["network", "risky", "deal"],
        "outcomes": {
          "bad": {
            "text": "Dee says yes with the specific tone that means you owe her a favor of unbounded size, redeemable without warning. The amp is heavy tonight.",
            "effects": { "network": 2, "burnout": 3 }
          },
          "good": {
            "text": "Dee trades one more night for two of your future load-ins. Fair market rate in the borrowed-gear economy. The show goes on, at full volume.",
            "effects": { "network": 4, "cred": 3 }
          },
          "incredible": {
            "text": "Dee comes TO the show to collect the amp — and watches you play through it first. After: “keep it till you can afford your own. It sounds right with you.”",
            "effects": { "network": 6, "cred": 5, "fame": 2 }
          }
        }
      },
      "right": {
        "label": "Play the tiny backup",
        "governingStats": { "creativity": 1, "skill": 0.3 },
        "tags": ["live", "safe", "tone"],
        "outcomes": {
          "bad": {
            "text": "The backup amp is the size of a toaster and has one opinion. The quiet set gets quieter every time the fridge kicks on.",
            "effects": { "creativity": 2, "burnout": 3 }
          },
          "good": {
            "text": "Constraint breeds arrangement. You rebuild the set small and close, and the room leans in to meet it. Returning the amp Friday feels like a molt.",
            "effects": { "creativity": 5, "skill": 3, "cred": 2 }
          },
          "incredible": {
            "text": "The tiny rig forces a sound you would never have chosen — and it is YOURS, the first sound that is. Dee gets her amp back. You keep the discovery.",
            "effects": { "creativity": 7, "skill": 3, "cred": 4 }
          }
        }
      }
    }
  },
  {
    "id": "n1_church_gig",
    "act": 1,
    "pathAffinity": [],
    "weight": 10,
    "art": "ev_n1_church_gig",
    "context": "Pastor Ruth, who heard you through the fence",
    "prompt": "“Contemporary service. Sundays, nine a.m., forty dollars and all the pancakes the deacons can make.” Pastor Ruth heard you practicing through the fence and has already decided you are the answer to a staffing prayer.",
    "recap": "Pastor Ruth’s nine a.m. service: forty dollars and pancakes.",
    "tags": ["work", "live"],
    "choices": {
      "left": {
        "label": "Take the residency",
        "governingStats": { "skill": 1, "network": 0.3 },
        "tags": ["work", "safe", "roots"],
        "outcomes": {
          "bad": {
            "text": "Nine a.m. is a genre of its own. You discover which of your fingers wake up last, in front of a congregation, weekly.",
            "effects": { "skill": 2, "money": 40, "burnout": 4 }
          },
          "good": {
            "text": "Weekly reps in front of forgiving people who sing along on purpose. Your rhythm playing gets bulletproof. The pancakes are, frankly, elite.",
            "effects": {
              "skill": 5,
              "money": 40,
              "network": 2,
              "addPromise": {
                "label": "Play four Sundays running",
                "tags": ["work", "live"],
                "cards": 4,
                "reward": { "money": 60, "network": 3, "cred": 2 },
                "penalty": { "cred": -3 }
              }
            }
          },
          "incredible": {
            "text": "Pastor Ruth lets you sneak an original into the offertory. Nobody notices it is yours. Everybody hums it in the parking lot. Field-tested. Blessed, even.",
            "effects": { "skill": 6, "money": 50, "creativity": 3, "network": 3 }
          }
        }
      },
      "right": {
        "label": "Keep Sundays sacred (for sleep)",
        "governingStats": { "creativity": 1 },
        "tags": ["rest", "safe", "home"],
        "outcomes": {
          "bad": {
            "text": "You decline and then wake up at nine every Sunday anyway, out of guilt. The guilt does not pay forty dollars.",
            "effects": { "creativity": 2 }
          },
          "good": {
            "text": "Protected sleep, protected writing mornings. Sunday becomes the day the good ideas know to visit.",
            "effects": { "creativity": 5, "burnout": -4 }
          },
          "incredible": {
            "text": "Pastor Ruth respects it completely — and hires you for the twice-a-year evening services instead, at triple rate. Boundaries, rewarded. A miracle.",
            "effects": { "creativity": 5, "burnout": -4, "money": 45, "network": 3 }
          }
        }
      }
    }
  },
  {
    "id": "n1_retirement_home",
    "act": 1,
    "pathAffinity": [],
    "weight": 10,
    "art": "ev_n1_retirement_home",
    "context": "Sunset Pines. The activities director has a headset.",
    "prompt": "Two p.m. slot between chair yoga and bingo. The activities director briefs you like a black-ops handler: “Eleanor, front row, sang professionally. She has ended better acts than you. Good luck.”",
    "recap": "Sunset Pines, two p.m., and Eleanor in the front row.",
    "tags": ["live"],
    "choices": {
      "left": {
        "label": "Play the standards",
        "governingStats": { "skill": 1 },
        "tags": ["live", "safe", "mainstream"],
        "outcomes": {
          "bad": {
            "text": "You play a standard 40 bpm too fast. Eleanor holds up one finger, lowers it slowly, and the entire room breathes with her. You obey the finger.",
            "effects": { "skill": 2, "money": 25 }
          },
          "good": {
            "text": "You land the standards where they live. Two residents dance. The director mouths “they NEVER dance” over her headset.",
            "effects": { "skill": 5, "money": 40, "cred": 2 }
          },
          "incredible": {
            "text": "Eleanor stands, uninvited, and takes the second verse. You back her like your life depends on it, because it does. Nobody in that room will forget it. Neither will you.",
            "effects": { "skill": 7, "cred": 5, "money": 40, "network": 2, "fame": 2 }
          }
        }
      },
      "right": {
        "label": "Play the originals for Eleanor",
        "governingStats": { "creativity": 1, "cred": 0.4 },
        "tags": ["live", "risky", "indie"],
        "outcomes": {
          "bad": {
            "text": "Eleanor listens to your saddest original with her eyes closed. Verdict: “The words are ahead of the music, dear.” She is right. It stings for a week.",
            "effects": { "creativity": 2, "burnout": 3 }
          },
          "good": {
            "text": "Eleanor requests the second one AGAIN. “That one is honest,” she rules, and the room defers. Highest court in the land.",
            "effects": { "creativity": 5, "cred": 4, "money": 30 }
          },
          "incredible": {
            "text": "After the set, Eleanor teaches you — in eleven minutes, by the juice station — a thing about phrasing that no lesson ever touched. “Come back Thursday. We’re not done.”",
            "effects": { "creativity": 6, "skill": 4, "cred": 4, "network": 2 }
          }
        }
      }
    }
  },
  {
    "id": "n1_plasma",
    "act": 1,
    "pathAffinity": [],
    "weight": 9,
    "art": "ev_n1_plasma",
    "context": "The plasma center. The TV plays smooth jazz AT you.",
    "prompt": "The studio deposit is $90 and your account is a rounding error. The plasma center pays $45 a visit, plus juice. The intake form asks your occupation. You write “musician” and the clerk nods like a doctor confirming a diagnosis.",
    "recap": "The plasma center pays $45 and the studio deposit is $90.",
    "tags": ["work"],
    "requires": { "moneyMax": 60 },
    "choices": {
      "left": {
        "label": "Donate and daydream",
        "governingStats": { "creativity": 1 },
        "tags": ["work", "safe"],
        "outcomes": {
          "bad": {
            "text": "You feel like a wrung-out towel for two days, and the smooth jazz colonizes your dreams. The $45 is real, at least.",
            "effects": { "creativity": 2, "money": 45, "burnout": 4 }
          },
          "good": {
            "text": "Forty-five minutes of enforced stillness turns out to be where melodies hide. You leave with cash and a chorus.",
            "effects": { "creativity": 5, "money": 45 }
          },
          "incredible": {
            "text": "The nurse recognizes you from a show. She upgrades your juice, and hums YOUR song while checking your vitals. Your song. In the plasma center. That counts.",
            "effects": { "creativity": 5, "money": 45, "fame": 3, "cred": 2 }
          }
        }
      },
      "right": {
        "label": "Busk the sidewalk outside instead",
        "governingStats": { "cred": 1, "skill": 0.3 },
        "tags": ["busk", "risky"],
        "outcomes": {
          "bad": {
            "text": "Your audience is people who just sold plasma. Generous hearts, empty pockets, some literally. You make $9 and one friend.",
            "effects": { "cred": 2, "money": 9, "network": 2 }
          },
          "good": {
            "text": "People walking IN tip better than people walking out — hope money. You clear more than a donation, blood intact.",
            "effects": { "cred": 4, "money": 55, "skill": 2 }
          },
          "incredible": {
            "text": "The center’s manager pays you $40 to play Fridays — “calms the first-timers.” You are now, medically speaking, an anesthetic.",
            "effects": { "cred": 5, "money": 70, "network": 3, "fame": 2 }
          }
        }
      }
    }
  },
  {
    "id": "n1_tent_sale",
    "act": 1,
    "pathAffinity": [],
    "weight": 10,
    "art": "ev_n1_tent_sale",
    "context": "BIG RIG SUNDAY. A tent, a PA, a polo shirt in your size.",
    "prompt": "The car dealership pays $80 for four hours of “upbeat vibes only.” Your bandmate is an inflatable tube man. He never stops dancing. He never gets tired. He is honestly kind of inspiring.",
    "recap": "Dealership tent gig, $80 for four hours of upbeat vibes.",
    "tags": ["work", "live"],
    "choices": {
      "left": {
        "label": "Wear the polo, get paid",
        "governingStats": { "skill": 1 },
        "tags": ["work", "safe", "mainstream"],
        "outcomes": {
          "bad": {
            "text": "Four hours of upbeat into a parking lot. A sales guy requests “something with more BUY energy.” You do not know that key. Nobody does.",
            "effects": { "skill": 2, "money": 80, "burnout": 5 }
          },
          "good": {
            "text": "You treat it like reps: four hours tight, professional, weatherproof. The GM books you for LABOR DAY BLOWOUT on the spot.",
            "effects": { "skill": 4, "money": 80, "network": 3 }
          },
          "incredible": {
            "text": "A family buys a minivan and swears your song sealed it. The salesman splits his commission mood with you: a crisp bonus and a hot dog. Show business.",
            "effects": { "skill": 5, "money": 110, "network": 3, "fame": 2 }
          }
        }
      },
      "right": {
        "label": "Polo, but make it art",
        "governingStats": { "creativity": 1 },
        "tags": ["work", "risky", "indie"],
        "outcomes": {
          "bad": {
            "text": "You improvise a nine-minute piece about the tube man’s inner life. The GM calls it “not BUY energy.” You keep $40 and your dignity, partially.",
            "effects": { "creativity": 3, "money": 40, "burnout": 3 }
          },
          "good": {
            "text": "You sync your set to the tube man’s flailing. Customers film it. The dealership’s page posts it. It is, objectively, art.",
            "effects": { "creativity": 5, "fame": 4, "money": 80 }
          },
          "incredible": {
            "text": "The tube man duet goes locally viral: “this dealership has a better live show than the amphitheater.” The GM prints the comment and frames it. So do you.",
            "effects": { "creativity": 7, "fame": 7, "money": 80, "cred": 2 }
          }
        }
      }
    }
  },
  {
    "id": "n1_unwritten_rules",
    "act": 1,
    "pathAffinity": [],
    "weight": 10,
    "art": "ev_n1_unwritten_rules",
    "context": "A scene elder, waiting by the load-out door",
    "prompt": "You played eleven minutes over your slot. Nobody said anything. Now Vess — who has been in every band this town ever produced — is waiting by the door with the patient face of someone about to explain the constitution.",
    "recap": "Eleven minutes over your slot, and Vess waiting by the door.",
    "tags": ["live", "social"],
    "choices": {
      "left": {
        "label": "Take the whole lecture",
        "governingStats": { "cred": 1 },
        "tags": ["social", "safe"],
        "outcomes": {
          "bad": {
            "text": "The rules take forty minutes and include a genealogy of every band that ever ran long and where they are now. (Nowhere. They are all nowhere.)",
            "effects": { "cred": 2, "burnout": 3 }
          },
          "good": {
            "text": "Vess covers slot times, gear sharing, and why you thank the sound guy BY NAME. You take actual notes. Vess pretends not to be pleased.",
            "effects": { "cred": 5, "network": 3 }
          },
          "incredible": {
            "text": "Somewhere in hour two it stops being a lecture and becomes an inheritance. Vess ends with: “I only explain it to the ones worth keeping.”",
            "effects": { "cred": 7, "network": 5, "skill": 2 }
          }
        }
      },
      "right": {
        "label": "Defend the long song",
        "governingStats": { "creativity": 1 },
        "tags": ["social", "risky", "indie"],
        "outcomes": {
          "bad": {
            "text": "“The song needed eleven more minutes,” you say. “The headliner needed them more,” says Vess, and walks. The scene is chilly for a week.",
            "effects": { "creativity": 2, "cred": -3, "burnout": 3 }
          },
          "good": {
            "text": "You argue your case. Vess argues back. Forty minutes later you have a compromise, a coffee, and a grudging “the song WAS good, that’s the annoying part.”",
            "effects": { "creativity": 4, "cred": 3, "network": 2 }
          },
          "incredible": {
            "text": "Vess listens, then delivers the highest ruling available: “Next time, tell the booker you need a long slot. You’ve earned asking.” A door you did not know existed, now open.",
            "effects": { "creativity": 6, "cred": 5, "network": 4 }
          }
        }
      }
    }
  },
  {
    "id": "n1_copy_shop",
    "act": 1,
    "pathAffinity": [],
    "weight": 10,
    "art": "ev_n1_copy_shop",
    "context": "CopyTown, 1 a.m., self-serve",
    "prompt": "You feed the machine your show flyer. The overnight clerk, Oz, looks at it for three seconds and says “your date is smaller than your fonts are fighting.” Oz is unnervingly correct.",
    "recap": "Oz the overnight clerk, judging your show flyer at CopyTown.",
    "tags": ["social", "work"],
    "choices": {
      "left": {
        "label": "Let Oz redesign it",
        "governingStats": { "network": 1 },
        "tags": ["network", "safe"],
        "outcomes": {
          "bad": {
            "text": "Oz has strong opinions and stronger fonts. The flyer is now beautiful and slightly about Oz. People compliment the flyer. The flyer.",
            "effects": { "network": 2, "money": -10 }
          },
          "good": {
            "text": "Twenty minutes of hovering later: a flyer that could stop a bus. Oz charges you for one copy and prints forty. “Overnight rates.”",
            "effects": { "network": 4, "fame": 3, "cred": 2 }
          },
          "incredible": {
            "text": "Oz, it emerges, designed album covers in a previous life. You leave with forty flyers, a logo, and a standing 1 a.m. design department.",
            "effects": { "network": 6, "fame": 4, "cred": 4 }
          }
        }
      },
      "right": {
        "label": "Defend the Sharpie original",
        "governingStats": { "cred": 1, "creativity": 0.3 },
        "tags": ["indie", "risky"],
        "outcomes": {
          "bad": {
            "text": "“It has raw energy,” you say. “It has a typo,” says Oz. You check. It has a typo. Forty copies of a typo.",
            "effects": { "cred": 2, "money": -10, "burnout": 3 }
          },
          "good": {
            "text": "The hand-drawn mess is unmistakably yours, and around here that reads as a signature. People keep them. Some frame them.",
            "effects": { "cred": 5, "fame": 2 }
          },
          "incredible": {
            "text": "Oz photographs your flyer for a zine about “outsider show art.” Your worst handwriting becomes your first press. Oz asks you to sign one.",
            "effects": { "cred": 6, "fame": 4, "network": 3 }
          }
        }
      }
    }
  },
  {
    "id": "n1_demo_club",
    "act": 1,
    "pathAffinity": [],
    "weight": 10,
    "art": "ev_n1_demo_club",
    "context": "The record store back room, Thursdays, one rule",
    "prompt": "The demo listening club: five people, folding chairs, total honesty, no exceptions. They play submissions anonymously and dissect them like surgeons. Tonight, yours is in the pile.",
    "recap": "The demo listening club plays your track, anonymous and honest.",
    "tags": ["record", "social"],
    "choices": {
      "left": {
        "label": "Submit the safe one",
        "governingStats": { "skill": 1 },
        "tags": ["record", "safe"],
        "outcomes": {
          "bad": {
            "text": "“Competent,” says the club, which in this room is a slur. You sit on your hands and nod like it is not yours. Your hands know.",
            "effects": { "skill": 2, "burnout": 3 }
          },
          "good": {
            "text": "Real notes from real ears: the bridge drags, the hook lands, the outro is a keeper. You leave with a to-do list worth more than a review.",
            "effects": { "skill": 5, "cred": 3 }
          },
          "incredible": {
            "text": "The room goes quiet after, which — per club bylaws — is the highest score. Someone asks to hear it AGAIN. The rule book has no procedure for again.",
            "effects": { "skill": 6, "cred": 6, "network": 3 }
          }
        }
      },
      "right": {
        "label": "Submit the weird one",
        "governingStats": { "creativity": 1 },
        "tags": ["record", "risky", "indie"],
        "outcomes": {
          "bad": {
            "text": "Ninety seconds in, a founding member says “is the tape broken or is this a choice?” It was a choice. You defend it anonymously, in third person, sweating.",
            "effects": { "creativity": 3, "burnout": 4 }
          },
          "good": {
            "text": "The club argues about it for twenty minutes, which is nineteen more than anything else tonight. Argument, here, is affection.",
            "effects": { "creativity": 5, "cred": 4 }
          },
          "incredible": {
            "text": "The store owner unmasks you by ear — “only one person in this town hears like that” — and puts the demo on the STORE STEREO. During business hours. Canonized.",
            "effects": { "creativity": 7, "cred": 6, "fame": 3, "network": 2 }
          }
        }
      }
    }
  },
  {
    "id": "n1_scene_photog",
    "act": 1,
    "pathAffinity": [],
    "weight": 10,
    "art": "ev_n1_scene_photog",
    "context": "Mika, who shoots every show for free",
    "prompt": "Mika has photographed every show in this town for years, unpaid, unfailing. They show you one frame: you, mid-jump, lit like a prophecy. It looks like a career. Mika needs help hanging their first gallery show this weekend.",
    "recap": "Mika’s one perfect frame of you, and a gallery to hang.",
    "tags": ["social", "network"],
    "choices": {
      "left": {
        "label": "Trade labor for the shot",
        "governingStats": { "network": 1, "cred": 0.3 },
        "tags": ["network", "safe"],
        "outcomes": {
          "bad": {
            "text": "You spend Saturday fighting a laser level and drop exactly one frame. Not yours, thankfully. Mika forgives. The wall does not forget.",
            "effects": { "network": 2, "burnout": 3 }
          },
          "good": {
            "text": "Six hours of hanging, leveling, and takeout later, the show is up and the jump photo is yours, full resolution, signed. Fair trade. Great trade.",
            "effects": { "network": 4, "cred": 4, "fame": 2 }
          },
          "incredible": {
            "text": "Opening night: your photo hangs at the center of the show. People ask Mika who you are. Mika says your name like it is already an answer.",
            "effects": { "network": 6, "cred": 5, "fame": 5 }
          }
        }
      },
      "right": {
        "label": "Scrape together print money",
        "governingStats": { "cred": 1 },
        "tags": ["deal", "risky"],
        "outcomes": {
          "bad": {
            "text": "You offer $20. Mika, gently: “It’s not for sale, it’s for TRADE.” You have misread the entire economy. Rookie error, forgiven slowly.",
            "effects": { "cred": 2, "burnout": 3 }
          },
          "good": {
            "text": "Mika takes the $20 as a “materials donation” and prints it big. Artists paying artists — the rarest transaction in the scene, noted by all.",
            "effects": { "cred": 5, "money": -20, "fame": 2 }
          },
          "incredible": {
            "text": "Your crumpled twenty becomes scene legend: the first money Mika ever took. They tape it to the darkroom wall and print you everything. EVERYTHING.",
            "effects": { "cred": 6, "money": -20, "network": 4, "fame": 3 }
          }
        }
      }
    }
  },
  {
    "id": "n1_quiet_night",
    "act": 1,
    "pathAffinity": [],
    "weight": 10,
    "art": "ev_n1_quiet_night",
    "context": "THE QUIET NIGHT. Amps checked at the door, politely.",
    "prompt": "A listening night with one rule: nothing louder than a voice. No amps, no monitors, no hiding. The room is so silent you can hear your own pulse deciding whether to cooperate.",
    "recap": "The Quiet Night: no amps, nothing louder than a voice.",
    "tags": ["live", "tone"],
    "choices": {
      "left": {
        "label": "Strip the songs bare",
        "governingStats": { "skill": 1, "cred": 0.3 },
        "tags": ["live", "safe", "vocal"],
        "outcomes": {
          "bad": {
            "text": "Every fret squeak is now a band member. Your breathing has a solo. The room hears ALL of it, kindly, which is worse.",
            "effects": { "skill": 2, "burnout": 4 }
          },
          "good": {
            "text": "Naked arrangements, nowhere to hide, and the songs hold. You learn which ones were songs and which ones were volume.",
            "effects": { "skill": 5, "cred": 4 }
          },
          "incredible": {
            "text": "A pin literally drops — someone’s badge, back row — and the whole room hears it between your verses and nobody moves. You own silence now.",
            "effects": { "skill": 7, "cred": 6, "fame": 3 }
          }
        }
      },
      "right": {
        "label": "Whisper the loud one",
        "governingStats": { "creativity": 1 },
        "tags": ["live", "risky", "tone"],
        "outcomes": {
          "bad": {
            "text": "Your anthem, whispered, turns out to be a threat. The front row leans back in unison. You finish it anyway, menacingly gentle.",
            "effects": { "creativity": 3, "burnout": 3 }
          },
          "good": {
            "text": "The banger becomes a lullaby with teeth. People who knew the loud version make the face of someone rereading a letter.",
            "effects": { "creativity": 5, "cred": 4, "fame": 2 }
          },
          "incredible": {
            "text": "The whispered version is BETTER. You know it, the room knows it, and the organizer books you for the next three Quiet Nights before you reach the door.",
            "effects": { "creativity": 7, "cred": 5, "network": 3, "fame": 3 }
          }
        }
      }
    }
  },
  {
    "id": "n1_radio_contest",
    "act": 1,
    "pathAffinity": [],
    "weight": 9,
    "art": "ev_n1_radio_contest",
    "context": "K-ROCK’s “Local Legend” line, ringing",
    "prompt": "Caller nine wins a free studio day. You have a phone, your roommate’s phone, and a landline that technically belongs to the apartment. The DJ’s voice is pure chaos: “Lines are OPEN, people.”",
    "recap": "K-ROCK’s caller-nine contest for a free studio day.",
    "tags": ["social"],
    "requires": { "fameMax": 25 },
    "choices": {
      "left": {
        "label": "Mobilize everyone you know",
        "governingStats": { "network": 1 },
        "tags": ["network", "risky", "social"],
        "outcomes": {
          "bad": {
            "text": "Your whole contact list dials at once. Your MOM gets through as caller nine and panics: “I’m calling for my child.” The DJ plays it on air for a week.",
            "effects": { "network": 2, "fame": 3, "burnout": 3 }
          },
          "good": {
            "text": "Fourteen friends, three phones each. Caller nine is your old coworker, who redeems the studio day in your name without being asked. The group chat erupts.",
            "effects": { "network": 5, "cred": 3, "fame": 2 }
          },
          "incredible": {
            "text": "The DJ smells the coordinated assault and finds it delightful: “This kid weaponized an entire zip code.” You win the day AND an on-air interview.",
            "effects": { "network": 7, "fame": 6, "cred": 3 }
          }
        }
      },
      "right": {
        "label": "Keep redialing alone",
        "governingStats": { "skill": 1 },
        "tags": ["solo", "safe"],
        "outcomes": {
          "bad": {
            "text": "Caller six. Caller eight. Caller TEN. You hear caller nine win your studio day with an air-horn noise they make with their mouth.",
            "effects": { "skill": 2, "burnout": 3 }
          },
          "good": {
            "text": "Forty redials of pure stubbornness. Caller nine. You are so shocked you nearly hang up. The DJ: “You sound like you NEED this.” Correct.",
            "effects": { "skill": 3, "fame": 3, "cred": 3 }
          },
          "incredible": {
            "text": "You win, and when the DJ asks what you play, you play it — down the phone, live on air, one take. The request lines light up asking who that was.",
            "effects": { "skill": 5, "fame": 7, "cred": 4, "network": 2 }
          }
        }
      }
    }
  },
  {
    "id": "n1_permit_office",
    "act": 1,
    "pathAffinity": [],
    "weight": 10,
    "art": "ev_n1_permit_office",
    "context": "City Hall, window 4: PERFORMANCE PERMITS (& FISHING)",
    "prompt": "The busking permit costs $30 and, per a bylaw nobody can locate, requires a “demonstration of craft.” The clerk gestures at the marble lobby. The marble lobby has the reverb of a cathedral. Two security guards look up, interested.",
    "recap": "City Hall’s busking permit needs a demonstration of craft.",
    "tags": ["busk", "work"],
    "choices": {
      "left": {
        "label": "Audition for the clerk",
        "governingStats": { "skill": 1 },
        "tags": ["busk", "safe", "live"],
        "outcomes": {
          "bad": {
            "text": "The marble turns your tight little song into soup. The clerk stamps the permit anyway: “That’s the room’s fault, hon.” The guards agree.",
            "effects": { "skill": 2, "money": -30 }
          },
          "good": {
            "text": "That reverb. THAT REVERB. You stretch the ending just to live in it. The clerk stamps the permit with unnecessary flourish. A guard tips you inside city hall.",
            "effects": { "skill": 4, "cred": 3, "money": -20 }
          },
          "incredible": {
            "text": "By the last chorus, three floors of civil servants are leaning over the railings. The clerk waives the fee under “cultural enrichment, misc.” Government works sometimes.",
            "effects": { "skill": 6, "cred": 4, "fame": 4, "network": 2 }
          }
        }
      },
      "right": {
        "label": "Busk unlicensed, stay nimble",
        "governingStats": { "cred": 1, "network": 0.3 },
        "tags": ["busk", "risky"],
        "outcomes": {
          "bad": {
            "text": "You get moved along twice and develop a sixth sense for clipboard-shaped silhouettes. Exhausting. Educational. Nine dollars.",
            "effects": { "cred": 2, "money": 9, "burnout": 4 }
          },
          "good": {
            "text": "The outlaw corners are the good corners. You stay mobile, stay paid, and learn the beat cop’s lunch schedule by heart.",
            "effects": { "cred": 4, "money": 50 }
          },
          "incredible": {
            "text": "The beat cop finally corners you — and requests a song. For his anniversary. You play it. He “forgets” the citation pad exists, permanently.",
            "effects": { "cred": 6, "money": 65, "network": 3, "fame": 2 }
          }
        }
      }
    }
  },
  {
    "id": "n1_house_party",
    "act": 1,
    "pathAffinity": [],
    "weight": 10,
    "art": "ev_n1_house_party",
    "context": "A birthday party. A guitar you did not bring appears.",
    "prompt": "A friend-of-a-friend’s birthday. Someone learns what you do and a guitar materializes from a closet, slightly out of tune, radiating expectation. The room is 60% strangers, 40% cake.",
    "recap": "A birthday party, a borrowed guitar, a room half strangers.",
    "tags": ["live", "social"],
    "choices": {
      "left": {
        "label": "Play the crowd-pleaser",
        "governingStats": { "network": 1, "skill": 0.3 },
        "tags": ["live", "safe", "mainstream"],
        "outcomes": {
          "bad": {
            "text": "Half the room sings along in a different key, with commitment. The birthday girl’s uncle takes over on verse two. It is his party now.",
            "effects": { "network": 2, "burnout": 3 }
          },
          "good": {
            "text": "The singalong lands. Strangers become a choir. Someone asks “do you do EVENTS?” with money in their voice.",
            "effects": { "network": 5, "fame": 2, "money": 20 }
          },
          "incredible": {
            "text": "The kitchen empties into the living room. Phones come out. By midnight you have eleven new followers and two party bookings. The cake was also good.",
            "effects": { "network": 7, "fame": 5, "money": 30 }
          }
        }
      },
      "right": {
        "label": "Premiere the new one",
        "governingStats": { "creativity": 1 },
        "tags": ["risky", "indie", "live"],
        "outcomes": {
          "bad": {
            "text": "You debut an unfinished ballad at a birthday party. The energy leaves the room like air from a punctured float. Someone restarts the playlist mid-bridge.",
            "effects": { "creativity": 2, "burnout": 4 }
          },
          "good": {
            "text": "The room goes quiet in the good way. The birthday girl declares it “her birthday song” forever. Annual royalties: one slice of cake.",
            "effects": { "creativity": 5, "cred": 3, "fame": 2 }
          },
          "incredible": {
            "text": "A stranger in the corner listens with their whole body, then introduces themselves: they book a real room downtown. “Bring THAT song.”",
            "effects": { "creativity": 7, "network": 4, "cred": 3, "fame": 3 }
          }
        }
      }
    }
  },
  {
    "id": "n1_park_circle",
    "act": 1,
    "pathAffinity": [],
    "weight": 10,
    "art": "ev_n1_park_circle",
    "context": "The gazebo, Sunday. Folding chairs in a circle.",
    "prompt": "The old-timers jam every Sunday: fiddle, banjo, a dobro older than the park. They pick fast and nod slow. Without breaking rhythm, the fiddle player tilts her head at the empty chair. Your move.",
    "recap": "The Sunday gazebo jam, and the fiddle player’s nod to the chair.",
    "tags": ["roots", "live"],
    "choices": {
      "left": {
        "label": "Follow their lead",
        "governingStats": { "skill": 1 },
        "tags": ["roots", "safe", "practice"],
        "outcomes": {
          "bad": {
            "text": "They change keys via eyebrow and you miss the memo twice. The banjo player pats your knee: “Everybody drowns their first Sunday.”",
            "effects": { "skill": 2, "burnout": -2 }
          },
          "good": {
            "text": "You shut up and comp for two hours, and somewhere in there your right hand learns something it will never unlearn.",
            "effects": { "skill": 5, "cred": 3, "burnout": -3 }
          },
          "incredible": {
            "text": "The fiddle player passes you the melody without warning — the circle’s highest honor — and you carry it home. Nods all around. SLOW nods.",
            "effects": { "skill": 7, "cred": 5, "network": 3, "burnout": -3 }
          }
        }
      },
      "right": {
        "label": "Offer the circle your song",
        "governingStats": { "creativity": 1, "cred": 0.3 },
        "tags": ["roots", "risky", "write"],
        "outcomes": {
          "bad": {
            "text": "Your chord chart confuses the dobro, and a song that took you months gets politely dismantled in four minutes. “Nice bones,” says the fiddle player. Bones.",
            "effects": { "creativity": 2, "burnout": 3 }
          },
          "good": {
            "text": "They pick up your tune by ear on the second pass and improve it in ways you will be stealing for years. The circle keeps what it likes. It kept yours.",
            "effects": { "creativity": 5, "skill": 3, "cred": 3 }
          },
          "incredible": {
            "text": "Next Sunday, you arrive to hear the circle already playing your song — it entered the repertoire while you slept. That is how standards are born. Yours just was.",
            "effects": { "creativity": 7, "cred": 6, "fame": 3 }
          }
        }
      }
    }
  },
  {
    "id": "n1_car_studio",
    "act": 1,
    "pathAffinity": [],
    "weight": 10,
    "art": "ev_n1_car_studio",
    "context": "Your cousin’s sedan: the best vocal booth in the county",
    "prompt": "Discovery: your cousin’s sedan, parked in the garage with blankets over the windows, is acoustically perfect. Dead quiet, warm, intimate. One catch — the dome light times out, and every take costs phone battery you cannot spare.",
    "recap": "Your cousin’s blanketed sedan, an acoustically perfect booth.",
    "tags": ["record", "home"],
    "choices": {
      "left": {
        "label": "Chase the perfect take",
        "minigame": "take",
        "governingStats": { "skill": 1 },
        "tags": ["record", "risky", "studio"],
        "outcomes": {
          "bad": {
            "text": "Take eleven is THE ONE — and the phone dies on the last chorus. You sit in a dark sedan, in a garage, grieving audio. The blankets absorb the scream. Take twelve exists, at least.",
            "effects": { "skill": 3, "burnout": 5 }
          },
          "good": {
            "text": "Take seven, 4% battery: clean, close, alive. You listen back twice in the dark, grinning at a windshield.",
            "effects": { "skill": 5, "creativity": 2 }
          },
          "incredible": {
            "text": "Take three. TAKE THREE. The vocal sounds expensive — sounds like a ROOM, and the room is a sedan. Engineers will one day ask what booth this was. You will say “a secret.”",
            "effects": { "skill": 7, "creativity": 3, "cred": 3 }
          }
        }
      },
      "right": {
        "label": "Keep take one, flaws included",
        "governingStats": { "creativity": 1, "cred": 0.3 },
        "tags": ["record", "safe", "indie"],
        "outcomes": {
          "bad": {
            "text": "Take one includes the garage door opening and your cousin asking, forever, on the recording, “why are you in my car.” You keep it out of spite.",
            "effects": { "creativity": 2, "burnout": 3 }
          },
          "good": {
            "text": "The crack in the second verse stays. It is the best thing on the take and you know it. First-take honesty: cheaper than reverb, rarer too.",
            "effects": { "creativity": 5, "cred": 3 }
          },
          "incredible": {
            "text": "Take one has a thing no other take will ever have: it does not know it is being listened to. You play it for a friend, who goes quiet and asks who recorded it. “Me. In a car.”",
            "effects": { "creativity": 7, "cred": 5, "fame": 2 }
          }
        }
      }
    }
  },
  {
    "id": "n1_dollar_bin",
    "act": 1,
    "pathAffinity": [],
    "weight": 10,
    "art": "ev_n1_dollar_bin",
    "context": "The dollar bin. A record with no cover, a name in pen.",
    "prompt": "Between water-damaged holiday albums: a private-press record from 1974, no sleeve, one name handwritten on the label. You drop the needle at the listening station and your entire spine pays attention. Nobody has ever heard of this. It sounds like your future.",
    "recap": "A coverless 1974 private-press record from the dollar bin.",
    "tags": ["record", "roots"],
    "choices": {
      "left": {
        "label": "Study it like scripture",
        "governingStats": { "creativity": 1, "skill": 0.4 },
        "tags": ["practice", "safe", "roots"],
        "outcomes": {
          "bad": {
            "text": "You wear out the grooves learning its tricks and spend a week accidentally writing songs that are 90% it. Deprogramming required.",
            "effects": { "creativity": 3, "burnout": 3 }
          },
          "good": {
            "text": "You reverse-engineer the arrangements bar by bar. Whoever this was solved problems you did not know you had. Your sound gets a basement floor built under it.",
            "effects": { "creativity": 5, "skill": 3 }
          },
          "incredible": {
            "text": "The record rewires you. Weeks later, someone hears your set and asks about an influence they cannot place. Nobody can place it. It cost a dollar. It is YOURS.",
            "effects": { "creativity": 8, "skill": 3, "cred": 3 }
          }
        }
      },
      "right": {
        "label": "Track down who made it",
        "governingStats": { "network": 1 },
        "tags": ["network", "risky", "roots"],
        "outcomes": {
          "bad": {
            "text": "The trail runs through two defunct pressing plants and a bowling league newsletter, then goes cold. You are now a private-press detective with no case and a dollar record.",
            "effects": { "network": 2, "burnout": 3 }
          },
          "good": {
            "text": "Found: retired, two towns over, growing tomatoes, astonished anyone listened. You visit. They tell you exactly why they quit, and it is a masterclass in what not to do.",
            "effects": { "network": 5, "cred": 4, "creativity": 2 }
          },
          "incredible": {
            "text": "They still play — into a tape recorder, alone, weekly, for fifty years. They play you the NEW stuff. It is astonishing. You leave with their blessing and a dubbed cassette nobody else on earth has.",
            "effects": { "network": 6, "cred": 6, "creativity": 4 }
          }
        }
      }
    }
  },
  {
    "id": "n1_diner_close",
    "act": 1,
    "pathAffinity": [],
    "weight": 10,
    "art": "ev_n1_diner_close",
    "context": "The Starlite Diner, 1:30 a.m., the scene’s living room",
    "prompt": "Every show in this town ends at the Starlite: pancakes, postmortems, three sceneful booths of opinion. Tonight, for the first time, the big corner booth scoots over and makes a you-shaped space.",
    "recap": "The Starlite at 1:30, and the corner booth making room for you.",
    "tags": ["social", "rest"],
    "choices": {
      "left": {
        "label": "Hold court",
        "governingStats": { "network": 1 },
        "tags": ["social", "risky"],
        "outcomes": {
          "bad": {
            "text": "You tell your best story too early to a booth of better storytellers. A drummer lands the same arc, funnier, in half the time. You study his pacing bitterly, over pancakes.",
            "effects": { "network": 2, "burnout": 3 }
          },
          "good": {
            "text": "You hold the booth for one full story — venue disaster, ninety seconds, sticks the landing. Syrup-sticky applause. You exist here now.",
            "effects": { "network": 5, "cred": 3 }
          },
          "incredible": {
            "text": "Your story becomes THE story — retold at other tables within the week, attributed correctly. At the Starlite, that is a knighthood with hash browns.",
            "effects": { "network": 7, "cred": 5, "fame": 2 }
          }
        }
      },
      "right": {
        "label": "Listen and eat",
        "governingStats": { "cred": 1 },
        "tags": ["social", "safe", "rest"],
        "outcomes": {
          "bad": {
            "text": "You are so quiet the booth forgets you and starts talking about you in third person. Reviews are mixed. The pancakes are not.",
            "effects": { "cred": 2, "burnout": -2 }
          },
          "good": {
            "text": "Two hours of intel: who is booking, who is feuding, which venue’s check bounces. The scene has a syllabus. It is taught here, at night, in syrup.",
            "effects": { "cred": 4, "network": 3, "burnout": -3 }
          },
          "incredible": {
            "text": "At close, the booth’s eldest — a bassist with tenure — slides you the last of the fries: “You listen. Nobody listens.” In this booth, that is a promotion.",
            "effects": { "cred": 6, "network": 4, "burnout": -4 }
          }
        }
      }
    }
  },
  {
    "id": "n1_building_vote",
    "act": 1,
    "pathAffinity": [],
    "weight": 10,
    "art": "ev_n1_building_vote",
    "context": "The lobby noticeboard. AGENDA ITEM 3: “the music”",
    "prompt": "The building meeting will vote on your practice hours. The evidence against you: Tuesdays. The evidence for you: also Tuesdays, according to a surprising faction in 3C who calls it “the free concert.”",
    "recap": "The building meeting will vote on your Tuesday practice hours.",
    "tags": ["home", "social"],
    "choices": {
      "left": {
        "label": "Make your case, calmly",
        "governingStats": { "network": 1 },
        "tags": ["home", "safe", "social"],
        "outcomes": {
          "bad": {
            "text": "You present a schedule with a pie chart. The pie chart gets more debate than you did. Verdict: weekdays before nine, and 5A gets a formal apology for March.",
            "effects": { "network": 2, "burnout": 3 }
          },
          "good": {
            "text": "You propose fixed hours and offer soundproofing you cannot yet afford. The gesture carries the room. Motion passes. Democracy hums along.",
            "effects": { "network": 5, "cred": 3 }
          },
          "incredible": {
            "text": "Faction 3C stages a coordinated defense with TESTIMONY: “that song in February got me through it.” You win expanded hours and the knowledge that walls carry more than sound.",
            "effects": { "network": 6, "cred": 5, "fame": 2, "burnout": -2 }
          }
        }
      },
      "right": {
        "label": "Play the meeting a song",
        "governingStats": { "creativity": 1 },
        "tags": ["home", "risky", "live"],
        "outcomes": {
          "bad": {
            "text": "You perform in a folding-chair semicircle under fluorescent light — the worst venue of your career. The vote splits. Compromise: “weekends, softly.” The word softly is now legislation.",
            "effects": { "creativity": 2, "burnout": 3 }
          },
          "good": {
            "text": "Two minutes, unamplified, in the lobby. The complaint’s author unfolds her arms by the second verse. Motion passes. She requests, quietly, “the Tuesday one.”",
            "effects": { "creativity": 5, "network": 3, "cred": 2 }
          },
          "incredible": {
            "text": "The song ends and the super — twenty years of neutrality — says “I vote we let the kid COOK.” It carries unanimously. Your walls are officially load-bearing culture.",
            "effects": { "creativity": 7, "network": 4, "cred": 4, "fame": 2 }
          }
        }
      }
    }
  },
  {
    "id": "n1_street_piano",
    "act": 1,
    "pathAffinity": [],
    "weight": 10,
    "art": "ev_n1_street_piano",
    "context": "A public piano, painted by third graders",
    "prompt": "“PLAY ME” in six colors of kid handwriting. The piano has weathered two winters and a parade; a third of the keys have opinions and the D above middle C is purely decorative. Lunch crowd inbound.",
    "recap": "The kid-painted street piano, a third of the keys with opinions.",
    "tags": ["busk", "live"],
    "choices": {
      "left": {
        "label": "Compose around the dead keys",
        "governingStats": { "creativity": 1 },
        "tags": ["busk", "risky", "indie"],
        "outcomes": {
          "bad": {
            "text": "You build a piece around the missing D and then reach for it anyway, four times, out of habit. The silence where the note should be becomes a running joke between you and one onlooker.",
            "effects": { "creativity": 3, "money": 15 }
          },
          "good": {
            "text": "The broken keys force strange voicings, and the strange voicings turn out to be a style. A crowd gathers to hear an instrument fail beautifully.",
            "effects": { "creativity": 5, "money": 40, "fame": 2 }
          },
          "incredible": {
            "text": "Someone records “the song written for the broken piano” and tags the city. The parks department reposts it. The piano gets repaired BECAUSE of you — and you almost miss the dead D.",
            "effects": { "creativity": 7, "fame": 6, "money": 55, "cred": 3 }
          }
        }
      },
      "right": {
        "label": "Draw the lunch crowd",
        "governingStats": { "skill": 1, "network": 0.3 },
        "tags": ["busk", "safe", "live"],
        "outcomes": {
          "bad": {
            "text": "You compete with a food truck generator and lose on decibels. Tips: $11 and one perfectly good apple, underhand-tossed with respect.",
            "effects": { "skill": 2, "money": 11 }
          },
          "good": {
            "text": "Twenty minutes of crowd-pleasers, transposed on the fly to dodge the dead keys. Office workers linger past their lunch hours. The tips reflect their guilt.",
            "effects": { "skill": 4, "money": 50, "fame": 2 }
          },
          "incredible": {
            "text": "A double-decker tour bus stops — actually stops, off-itinerary. The guide points at you and says something you cannot hear. Forty tourists later, your case is heavy with international coins.",
            "effects": { "skill": 5, "money": 85, "fame": 5, "network": 2 }
          }
        }
      }
    }
  },
  {
    "id": "n1_weekly_column",
    "act": 1,
    "pathAffinity": [],
    "weight": 10,
    "art": "ev_n1_weekly_column",
    "context": "The free weekly. “Around Town,” sixty words, no photo.",
    "prompt": "The columnist who covers everything from zoning to zucchini contests wants sixty words on “the young music scene.” Sixty words, in the paper everyone reads at the laundromat. She uncaps a pen that has ended aldermen.",
    "recap": "Sixty words on the young scene for the free weekly.",
    "tags": ["social", "fame"],
    "choices": {
      "left": {
        "label": "Give the humble quote",
        "governingStats": { "cred": 1 },
        "tags": ["social", "safe"],
        "outcomes": {
          "bad": {
            "text": "You are so humble you evaporate. The printed quote is mostly about the venue’s new awning. The awning photographs well, to be fair.",
            "effects": { "cred": 2 }
          },
          "good": {
            "text": "You credit the scene, name three other bands, and thank the sound guy in print. Sixty words of pure diplomacy. The scene notices. The sound guy laminates it.",
            "effects": { "cred": 5, "network": 3, "fame": 2 }
          },
          "incredible": {
            "text": "The columnist adds her own line under your quote: “Remember this name.” Sixty words became sixty-three, and the extra three are doing all the work.",
            "effects": { "cred": 6, "fame": 5, "network": 3 }
          }
        }
      },
      "right": {
        "label": "Give her a headline",
        "governingStats": { "creativity": 1, "network": 0.3 },
        "tags": ["social", "risky", "fame"],
        "outcomes": {
          "bad": {
            "text": "Your zinger prints out of context, and for one week the laundromat believes you declared war on the community theater. The community theater responds IN VERSE.",
            "effects": { "creativity": 2, "fame": 3, "cred": -2 }
          },
          "good": {
            "text": "“This town has more songs than parking spaces” makes the pull quote. People repeat it at you for weeks, delighted, as if you did not say it first.",
            "effects": { "creativity": 4, "fame": 5, "cred": 2 }
          },
          "incredible": {
            "text": "The quote gets picked up by the regional paper, then a morning show, credited every time. Sixty words bought you a county’s worth of name recognition.",
            "effects": { "creativity": 5, "fame": 8, "network": 3 }
          }
        }
      }
    }
  },
  {
    "id": "n1_barter_yard",
    "act": 1,
    "pathAffinity": [],
    "weight": 10,
    "art": "ev_n1_barter_yard",
    "context": "Mr. Okafor’s garage: dry, quiet, wired since 1988",
    "prompt": "Your neighbor’s garage is everything your apartment is not: detached, insulated, empty. Mr. Okafor names his price without looking up from his roses: “Leaves now. Gutters in October. We shake on it or we don’t.”",
    "recap": "Mr. Okafor’s garage, offered for leaves now and gutters in October.",
    "tags": ["home", "deal"],
    "choices": {
      "left": {
        "label": "Shake on it",
        "governingStats": { "skill": 1 },
        "tags": ["deal", "safe", "practice"],
        "outcomes": {
          "bad": {
            "text": "The leaves are infinite. The leaves are a lifestyle. You practice with forearms like overcooked noodles, but you practice LOUD, and nobody knocks.",
            "effects": { "skill": 3, "burnout": 4 }
          },
          "good": {
            "text": "Raking by day, full volume by night. The garage takes your worst ideas without complaint, and the roses have never looked better. Everybody wins.",
            "effects": { "skill": 5, "creativity": 2, "burnout": -2 }
          },
          "incredible": {
            "text": "October: gutters done, and Mr. Okafor hands you a key. AN ACTUAL KEY. “You work like you play. Come and go.” You have a space now. A SPACE.",
            "effects": { "skill": 6, "creativity": 3, "network": 3, "cred": 2 }
          }
        }
      },
      "right": {
        "label": "Counter: a driveway concert",
        "governingStats": { "creativity": 1, "network": 0.3 },
        "tags": ["live", "risky", "home"],
        "outcomes": {
          "bad": {
            "text": "Mr. Okafor listens to your counteroffer, says “leaves,” and returns to his roses. Negotiations conclude. The leaves win. The leaves always win.",
            "effects": { "creativity": 2, "burnout": 3 }
          },
          "good": {
            "text": "He accepts: one concert, his guest list. Twelve lawn chairs of neighborhood elders, and you, playing the gentlest set of your life at golden hour. Garage granted.",
            "effects": { "creativity": 5, "network": 4, "cred": 3 }
          },
          "incredible": {
            "text": "The driveway show becomes the block’s event of the year. Mrs. Okafor requests an encore BY NAME — a deep cut. She has been listening through the fence for months. The garage comes with dinner privileges.",
            "effects": { "creativity": 6, "network": 6, "cred": 4, "fame": 2 }
          }
        }
      }
    }
  },
  {
    "id": "n1_earplug_lecture",
    "act": [1, 2],
    "pathAffinity": [],
    "weight": 9,
    "art": "ev_n1_earplug_lecture",
    "context": "The old sound guy, holding two orange foam earplugs",
    "prompt": "He has mixed everyone who ever came through this town, and he has watched you run yourself ragged for weeks. He holds out two foam earplugs like communion. “Sit down. This is the talk. Everybody gets it once.”",
    "recap": "The old sound guy, two foam earplugs out like communion.",
    "tags": ["rest", "social"],
    "requires": { "burnoutMin": 40 },
    "choices": {
      "left": {
        "label": "Sit down. Actually listen.",
        "governingStats": { "cred": 1 },
        "tags": ["rest", "safe"],
        "outcomes": {
          "bad": {
            "text": "The talk covers ears, sleep, and “the kid in ’09 who did not listen.” It runs long. You keep the earplugs and most of the guilt.",
            "effects": { "cred": 2, "burnout": -3 }
          },
          "good": {
            "text": "Ears, pacing, the long game — thirty years of casualties summarized in twenty minutes. You take the nap he prescribes. The nap is a revelation.",
            "effects": { "cred": 4, "burnout": -5, "skill": 2 }
          },
          "incredible": {
            "text": "At the end he tells you about the band he was in, once, and why he is behind the desk now. It is not a sad story the way he tells it. You leave changed, and early, and you SLEEP.",
            "effects": { "cred": 6, "burnout": -6, "network": 3 }
          }
        }
      },
      "right": {
        "label": "Nod, pocket them, gig anyway",
        "governingStats": { "skill": 1 },
        "tags": ["live", "risky", "work"],
        "outcomes": {
          "bad": {
            "text": "You play the gig on fumes and forget a verse of your own song. From the booth, the sound guy turns your vocal up. So you can hear it. The lesson, that is.",
            "effects": { "skill": 2, "burnout": 5 }
          },
          "good": {
            "text": "You gig — but wearing the earplugs, which it turns out he had already cut to fit you. The mix inside your head goes quiet and clear for the first time in weeks.",
            "effects": { "skill": 4, "burnout": -2, "cred": 2 }
          },
          "incredible": {
            "text": "Best set of the month, protected ears, and afterwards he says nothing — just taps his ear, points at you, and nods once. You have been mixed AND blessed.",
            "effects": { "skill": 6, "cred": 4, "burnout": -3 }
          }
        }
      }
    }
  },
  {
    "id": "n1_blues_jam",
    "act": 1,
    "pathAffinity": [],
    "weight": 10,
    "art": "ev_n1_blues_jam",
    "context": "Jam night. The house band tunes without looking at their hands.",
    "prompt": "Thursday jam. The house band has two hundred years of combined mileage and a strict liturgy: you wait, you watch, and if the bandleader nods, you get one song. The nod comes. The key is announced, not negotiated.",
    "recap": "Thursday jam, the bandleader’s nod, one song in a chosen key.",
    "tags": ["blues", "live"],
    "choices": {
      "left": {
        "label": "Take the solo they offer",
        "governingStats": { "skill": 1 },
        "tags": ["blues", "risky", "live"],
        "outcomes": {
          "bad": {
            "text": "You cram nine bars of ideas into a four-bar hole. The bandleader takes the solo back with one raised chin. The chin says everything the room is too kind to.",
            "effects": { "skill": 3, "burnout": 3 }
          },
          "good": {
            "text": "You say something short and true in twelve bars and hand it back clean. The drummer gives you the half-smile. The half-smile is the diploma.",
            "effects": { "skill": 5, "cred": 4 }
          },
          "incredible": {
            "text": "The bandleader loops the form — “take another” — which regulars confirm has happened four times in fifteen years. You are jam-night history now. There will be quizzes.",
            "effects": { "skill": 7, "cred": 6, "network": 3, "fame": 2 }
          }
        }
      },
      "right": {
        "label": "Hold down rhythm all night",
        "governingStats": { "cred": 1, "skill": 0.4 },
        "tags": ["blues", "safe", "band"],
        "outcomes": {
          "bad": {
            "text": "Three hours in the engine room. Nobody notices rhythm until it wavers, and at 11:40, briefly, gently, it wavers. The bass player notices. Only the bass player. Forever the bass player.",
            "effects": { "cred": 2, "skill": 2, "burnout": 3 }
          },
          "good": {
            "text": "You keep the floor steady under eleven soloists of wildly varying judgment. Unsexy, essential, noticed by exactly the right people.",
            "effects": { "cred": 5, "skill": 3, "network": 2 }
          },
          "incredible": {
            "text": "At close the bandleader announces, to the room, “THAT is how you hold a groove,” and buys your drink. Sidemen appear around you like you smell of steady work. You do.",
            "effects": { "cred": 7, "skill": 3, "network": 4 }
          }
        }
      }
    }
  },
  {
    "id": "n1_student_film",
    "act": 1,
    "pathAffinity": [],
    "weight": 10,
    "art": "ev_n1_student_film",
    "context": "A film student named Reza, holding a thumb drive",
    "prompt": "“Eleven minutes. It’s about my grandfather’s hands. The score is the whole movie and I have no money and the deadline is Sunday.” Reza says all of this in one breath, then holds out the drive like a dare.",
    "recap": "Reza’s eleven-minute film about his grandfather’s hands.",
    "tags": ["record", "write"],
    "choices": {
      "left": {
        "label": "Score it properly",
        "governingStats": { "creativity": 1, "skill": 0.4 },
        "tags": ["record", "risky", "studio"],
        "outcomes": {
          "bad": {
            "text": "You rescore the ending four times and sleep nine total hours. The film screens to a classroom of eleven, and the professor’s only note is about the CREDITS FONT. You dream in eleven-minute loops.",
            "effects": { "creativity": 3, "burnout": 6 }
          },
          "good": {
            "text": "You find the grandfather theme on the second night — three notes, patient, worn smooth like the hands. Reza cries at the temp mix. The good kind of deadline.",
            "effects": { "creativity": 5, "skill": 3, "cred": 2 }
          },
          "incredible": {
            "text": "The film wins the student showcase and the jury citation names THE SCORE. Every film kid in the county now has your number. Directors remember composers forever.",
            "effects": { "creativity": 7, "cred": 4, "network": 5, "fame": 3 }
          }
        }
      },
      "right": {
        "label": "One mood, stretched thin",
        "governingStats": { "skill": 1 },
        "tags": ["record", "safe", "work"],
        "outcomes": {
          "bad": {
            "text": "You deliver eleven minutes of tasteful drone by Saturday. It works. It also, per one classmate, “sounds like a refrigerator remembering something.” Reza uses it anyway.",
            "effects": { "skill": 2, "cred": 2 }
          },
          "good": {
            "text": "One theme, three variations, delivered early. Reza recuts a scene to match YOUR timing — the first time anyone has moved their art to fit yours. It will not be the last.",
            "effects": { "skill": 4, "creativity": 3, "cred": 3 }
          },
          "incredible": {
            "text": "Restraint reads as mastery: the sparse score makes the film feel expensive. The professor asks Reza who did the music. Reza, loyally, makes you sound famous. Now you have to become it.",
            "effects": { "skill": 6, "cred": 4, "network": 3, "fame": 2 }
          }
        }
      }
    }
  },
  {
    "id": "n1_own_sale",
    "act": 1,
    "pathAffinity": [],
    "weight": 10,
    "art": "ev_n1_own_sale",
    "context": "Your possessions, on a blanket, in the sun",
    "prompt": "The mixing day costs $100 and the only asset you have is everything you own that does not make sound. The blanket is laid out. The neighborhood circles. A man is already lowballing you on a lamp you loved.",
    "recap": "Everything you own that makes no sound, out on a blanket.",
    "tags": ["home", "deal"],
    "choices": {
      "left": {
        "label": "Sell it all",
        "governingStats": { "cred": 1 },
        "tags": ["deal", "risky"],
        "outcomes": {
          "bad": {
            "text": "Everything goes, including — you realize at 4 p.m., too late, watching a stranger walk away with it — the chair you write in. The mix is funded. Your next three songs are written standing up, resentfully.",
            "effects": { "cred": 2, "money": 70, "burnout": 3 }
          },
          "good": {
            "text": "The blanket empties, the envelope fills. You keep one mug, one blanket, one purpose. Walking to the studio with the cash feels like a music video. You let it.",
            "effects": { "cred": 4, "money": 100, "burnout": -2 }
          },
          "incredible": {
            "text": "A neighbor asks why you are selling everything. You tell her. She rounds up the lamp money to $40 — “I want to say I helped” — and three more people follow suit. The whole blanket becomes a fundraiser.",
            "effects": { "cred": 6, "money": 120, "network": 3, "fame": 2 }
          }
        }
      },
      "right": {
        "label": "Trade, don’t sell",
        "governingStats": { "network": 1 },
        "tags": ["deal", "safe"],
        "outcomes": {
          "bad": {
            "text": "You accept a “vintage” four-track for your bicycle. The four-track eats your first tape like a dog with homework. You now walk everywhere, carrying regret and one working channel.",
            "effects": { "network": 2, "burnout": 3 }
          },
          "good": {
            "text": "The lamp becomes a mic cable, the toaster becomes two hours of a neighbor’s home studio, the bike stays. The barter economy is undefeated when you know your neighbors.",
            "effects": { "network": 5, "cred": 2, "money": 30 }
          },
          "incredible": {
            "text": "Word spreads that you trade fair. By sundown you have assembled — from the neighborhood, from favors, from a retired DJ’s attic — an entire recording day without spending a dollar. The blanket is folded. The legend is not.",
            "effects": { "network": 7, "cred": 4, "money": 40 }
          }
        }
      }
    }
  },
  {
    "id": "n1_last_minute_opener",
    "act": 1,
    "pathAffinity": [],
    "weight": 10,
    "art": "ev_n1_last_minute_opener",
    "context": "A touring band’s van, idling. Their phone, at 2%.",
    "prompt": "A DIY band you have never heard of — four states from home, opener canceled, doors in three hours — got your name from “someone at the diner.” They need a local to open. Or a floor. Ideally both, but they are too polite to say so.",
    "recap": "A stranded touring band needs a local opener in three hours.",
    "tags": ["live", "tour"],
    "choices": {
      "left": {
        "label": "Open the show",
        "governingStats": { "skill": 1, "network": 0.3 },
        "tags": ["live", "risky"],
        "outcomes": {
          "bad": {
            "text": "Three hours of panic, thirty minutes of adrenaline, one broken string, and a crowd that came for the tourers. Their singer still thanks you from the stage, by name, pronounced wrong. Close enough.",
            "effects": { "skill": 3, "burnout": 4, "fame": 2 }
          },
          "good": {
            "text": "You rise to it — tight set, borrowed energy, a room that arrived cold and left knowing your name. The tourers watch from the bar like scouts.",
            "effects": { "skill": 5, "fame": 4, "network": 3 }
          },
          "incredible": {
            "text": "After the show, their booker texts you from the road: they want you opening ALL their shows within a hundred miles, every tour. You have a circuit now. It came in a van.",
            "effects": { "skill": 6, "fame": 6, "network": 5, "cred": 3 }
          }
        }
      },
      "right": {
        "label": "Play host instead",
        "governingStats": { "network": 1, "cred": 0.4 },
        "tags": ["network", "safe", "home"],
        "outcomes": {
          "bad": {
            "text": "Four musicians, your floor, one bathroom. They leave at dawn with your good towel and a note so grateful you cannot even be mad about the towel. You are a little mad about the towel.",
            "effects": { "network": 2, "burnout": 3 }
          },
          "good": {
            "text": "Pasta, floor space, directions to the good breakfast place. In the touring economy, tonight makes you a NODE — your address now travels in vans across four states, marked “safe.”",
            "effects": { "network": 5, "cred": 4 }
          },
          "incredible": {
            "text": "Over 1 a.m. pasta, their singer hears you play in your own kitchen and goes quiet. Six months from now, when they are suddenly enormous, they will tell an interviewer about this kitchen. Interviewers follow up on kitchens.",
            "effects": { "network": 6, "cred": 5, "fame": 4 }
          }
        }
      }
    }
  },
  {
    "id": "n1_soundboard_lesson",
    "act": 1,
    "pathAffinity": [],
    "weight": 10,
    "art": "ev_n1_soundboard_lesson",
    "context": "The sound guy, gesturing at the board like a piano",
    "prompt": "An hour before doors, unprompted: “Come here. If you learn what these knobs do, you’ll stop asking me for ‘more vocal’ like it’s a MOOD.” He pats the stool beside him. This is either detention or an apprenticeship.",
    "recap": "The sound guy, an hour before doors, offering the desk.",
    "tags": ["work", "tone"],
    "choices": {
      "left": {
        "label": "Learn the desk",
        "governingStats": { "skill": 1, "network": 0.3 },
        "tags": ["work", "safe", "tone"],
        "outcomes": {
          "bad": {
            "text": "You learn just enough to be dangerous and spend your own soundcheck asking for “a touch of 3k,” incorrectly. He mutes your channel until you apologize in plain English.",
            "effects": { "skill": 2, "burnout": 3 }
          },
          "good": {
            "text": "One hour and the mixing board stops being a wall of secrets. You will never again describe your monitor mix as “more like soup.” He looks almost proud. Almost.",
            "effects": { "skill": 5, "network": 3, "cred": 2 }
          },
          "incredible": {
            "text": "You have THE EARS, he announces, to nobody, loudly. Sound guys tell each other things: within a month, every desk in town mixes you a little more carefully. It is like being knighted by the electricity itself.",
            "effects": { "skill": 6, "network": 5, "cred": 4 }
          }
        }
      },
      "right": {
        "label": "Bribe him with tacos instead",
        "governingStats": { "network": 1 },
        "tags": ["network", "risky", "social"],
        "outcomes": {
          "bad": {
            "text": "You return with tacos to find soundcheck done without you. Your mix tonight is “fine.” The word fine, from a sound guy, has seventeen meanings and you got the worst one.",
            "effects": { "network": 2, "money": -15, "burnout": 3 }
          },
          "good": {
            "text": "The tacos land. Friendship, it turns out, is a valid audio protocol: your mixes are mysteriously excellent forever after, and you never learn a single knob. Both careers advance.",
            "effects": { "network": 5, "cred": 3, "money": -15 }
          },
          "incredible": {
            "text": "Over tacos he tells you what he ACTUALLY hears in your songs — a ten-minute unsolicited masterclass sharper than any review. Then he mixes your set like a co-producer. The tacos were $9. The notes were priceless.",
            "effects": { "network": 6, "cred": 4, "skill": 3, "money": -9 }
          }
        }
      }
    }
  },
  {
    "id": "n1_lost_pedal",
    "act": 1,
    "pathAffinity": [],
    "weight": 10,
    "art": "ev_n1_lost_pedal",
    "context": "The lost and found box. Something glints.",
    "prompt": "Closing time after your show. In the venue’s lost and found, between a scarf and a retainer: a genuinely nice tuner pedal. The bartender shrugs: “Been there a month. Box rules say it’s anyone’s.” The box has rules now, apparently.",
    "recap": "A nice tuner pedal in the venue’s lost and found.",
    "tags": ["social", "deal"],
    "choices": {
      "left": {
        "label": "Hunt down the owner",
        "governingStats": { "network": 1, "cred": 0.4 },
        "tags": ["network", "safe"],
        "outcomes": {
          "bad": {
            "text": "Three weeks of detective work through the group chat ends at a guy who moved to another state and says, unbelievably, “keep it, I hated that thing.” You cannot even enjoy it now. It radiates his indifference.",
            "effects": { "network": 2, "cred": 2 }
          },
          "good": {
            "text": "Found: a bassist who lost it the night her band broke up. She takes it back like a returned limb, and tells everyone what you did. The scene’s trust network adds a node with your name on it.",
            "effects": { "network": 4, "cred": 5 }
          },
          "incredible": {
            "text": "The bassist turns out to book a venue across town. “You’re the one who returned the pedal.” Your reputation crossed the river before you did — and it is holding a door open.",
            "effects": { "network": 6, "cred": 6, "fame": 2 }
          }
        }
      },
      "right": {
        "label": "Box rules. It’s yours now.",
        "governingStats": { "creativity": 1 },
        "tags": ["deal", "risky"],
        "outcomes": {
          "bad": {
            "text": "Two shows later, a stranger stares at your pedalboard a beat too long. Nothing is said. Nothing needs to be. The pedal tunes perfectly and accuses you nightly.",
            "effects": { "creativity": 2, "cred": -2 }
          },
          "good": {
            "text": "A month is a month and rules are rules. Your tuning is instant and silent now — an upgrade you will never take for granted after years of tuning by hope.",
            "effects": { "creativity": 3, "skill": 3 }
          },
          "incredible": {
            "text": "You leave a note in the box: “Took the tuner. If it was yours, find me — I owe you a show.” Nobody ever claims it, but the note becomes minor bar legend, and the pedal becomes honestly yours by folklore.",
            "effects": { "creativity": 5, "skill": 3, "cred": 3 }
          }
        }
      }
    }
  },
  {
    "id": "n2_college_radio",
    "act": 2,
    "pathAffinity": [],
    "weight": 11,
    "art": "ev_n2_college_radio",
    "context": "KDIV, 3 a.m. graveyard slot",
    "prompt": "The college station wants a live in-studio session. Airtime is 3 a.m., audience is “insomniacs and one professor,” and the intern keeps calling you “the band” regardless of how many of you showed up.",
    "recap": "KDIV wants a live session in the 3 a.m. graveyard slot.",
    "tags": ["record", "indie"],
    "choices": {
      "left": {
        "label": "Play the deep cuts",
        "governingStats": { "creativity": 1, "skill": 0.3 },
        "tags": ["record", "indie", "risky"],
        "outcomes": {
          "bad": {
            "text": "You play the eight-minute one. The professor calls in to disagree with your bridge. On air. At length.",
            "effects": { "creativity": 3, "burnout": 4 }
          },
          "good": {
            "text": "The insomniacs find you. By morning there are four new followers who describe you in paragraphs.",
            "effects": { "creativity": 5, "cred": 4, "fame": 3 }
          },
          "incredible": {
            "text": "The session gets bootlegged, lovingly, by someone who labels it “the good one.” It follows you for years, in a nice way.",
            "effects": { "creativity": 7, "cred": 6, "fame": 6, "network": 3 }
          }
        }
      },
      "right": {
        "label": "Do the interview instead",
        "minigame": "interview",
        "governingStats": { "network": 1 },
        "tags": ["social", "safe"],
        "outcomes": {
          "bad": {
            "text": "You say “it’s hard to describe our sound” and then describe it for six minutes anyway.",
            "effects": { "network": 2, "burnout": 3 }
          },
          "good": {
            "text": "You are, it turns out, good at talking. The interview travels further than the songs did.",
            "effects": { "network": 5, "fame": 4, "cred": 2 }
          },
          "incredible": {
            "text": "A quote you improvise ends up on someone’s tote bag. You are, briefly, a slogan.",
            "effects": { "network": 7, "fame": 6, "cred": 3 }
          }
        }
      }
    }
  },
  {
    "id": "n2_first_tour",
    "act": 2,
    "pathAffinity": [],
    "weight": 12,
    "art": "ev_n2_first_tour",
    "context": "Six cities, one map, zero guarantees",
    "prompt": "Your first real tour: six cities you have never played, booked on optimism and a spreadsheet. The van is packed. Somebody forgot the merch. It was you.",
    "recap": "Your first tour: six cities, and you forgot the merch.",
    "tags": ["tour", "live"],
    "choices": {
      "left": {
        "label": "Route it tight",
        "governingStats": { "skill": 1, "network": 0.3 },
        "tags": ["tour", "safe"],
        "outcomes": {
          "bad": {
            "text": "Tight routing, tighter margins. You make gas money and a memory of a truck stop shower.",
            "effects": { "skill": 3, "burnout": 6, "money": 30 }
          },
          "good": {
            "text": "Every night a few more people. By city four there are regulars who drove in from city three.",
            "effects": { "skill": 5, "network": 5, "fame": 5, "burnout": 5 }
          },
          "incredible": {
            "text": "The tour finds its legs and then finds its wings. You come home changed, broke, and completely sure.",
            "effects": { "skill": 7, "network": 8, "fame": 10, "cred": 4, "burnout": 5 }
          }
        }
      },
      "right": {
        "label": "Chase the one big room",
        "governingStats": { "network": 1, "creativity": 0.3 },
        "tags": ["tour", "risky", "mainstream"],
        "outcomes": {
          "bad": {
            "text": "The big room was a gamble and the gamble was a Tuesday. You play to the sound of your own reverb.",
            "effects": { "network": 2, "fame": 2, "burnout": 8, "money": -40 }
          },
          "good": {
            "text": "The big room half-fills, which for a big room is a triumph. The promoter remembers your name.",
            "effects": { "network": 6, "fame": 8, "money": 120 }
          },
          "incredible": {
            "text": "The big room sells out on word of mouth alone. You headline a city that has never met you.",
            "effects": { "network": 8, "fame": 14, "money": 260, "cred": 4 }
          }
        }
      }
    }
  },
  {
    "id": "n2_karaoke_host",
    "act": 2,
    "pathAffinity": [],
    "weight": 10,
    "art": "ev_n2_karaoke_host",
    "context": "The bar owner, holding a laminated binder",
    "prompt": "“My karaoke guy quit. You’re a musician, you’ve got a mic voice. Thursdays. Cash, plus you keep the room.” The binder is heavy with power.",
    "recap": "The bar owner hands you the karaoke binder for Thursdays.",
    "tags": ["live", "work"],
    "choices": {
      "left": {
        "label": "Host with a whole heart",
        "governingStats": { "network": 1, "creativity": 0.4 },
        "tags": ["live", "social", "safe"],
        "outcomes": {
          "bad": {
            "text": "You key-change a man’s power ballad down to save him. He wanted to fail on his own terms. He tells you so.",
            "effects": { "network": 3, "burnout": 4, "money": 30 }
          },
          "good": {
            "text": "Thursdays become an institution. You know every regular’s song before they pick it.",
            "effects": { "network": 6, "fame": 3, "money": 50, "grantHustle": "karaoke_host" }
          },
          "incredible": {
            "text": "Karaoke Thursdays outdraws half your own shows. You are, on Thursdays, beloved and slightly feared.",
            "effects": { "network": 8, "fame": 5, "cred": 3, "money": 65, "grantHustle": "karaoke_host" }
          }
        }
      },
      "right": {
        "label": "Turn it into a residency",
        "governingStats": { "creativity": 1 },
        "tags": ["live", "risky"],
        "outcomes": {
          "bad": {
            "text": "You try to make karaoke night “a curated experience.” The regulars want their song and their pitcher, not a vision.",
            "effects": { "creativity": 3, "cred": -2, "burnout": 5 }
          },
          "good": {
            "text": "You slip your originals between the standards. Half the room learns your chorus by osmosis.",
            "effects": { "creativity": 5, "fame": 4, "cred": 3 }
          },
          "incredible": {
            "text": "The karaoke night becomes YOUR night, softly, over weeks. Nobody voted. Everybody agreed.",
            "effects": { "creativity": 7, "fame": 6, "network": 4, "cred": 4 }
          }
        }
      }
    }
  },
  {
    "id": "n2_pedal_flipping",
    "act": 2,
    "pathAffinity": [],
    "weight": 10,
    "art": "ev_n2_pedal_flipping",
    "context": "A cardboard box of broken pedals, $5 the lot",
    "prompt": "Somebody’s garage sale has a box of dead effects pedals. You know a cold solder joint when you see one. You also know what “boutique vintage” sells for.",
    "recap": "A garage-sale box of dead pedals, $5 the lot.",
    "tags": ["deal", "work"],
    "choices": {
      "left": {
        "label": "Fix and flip them",
        "governingStats": { "skill": 1, "network": 0.3 },
        "tags": ["deal", "work", "safe"],
        "outcomes": {
          "bad": {
            "text": "You reflow six joints and burn a seventh board to carbon. Net profit: a lesson and a scar.",
            "effects": { "skill": 3, "money": 20, "burnout": 3 }
          },
          "good": {
            "text": "Four pedals revived, four pedals sold, one story about “provenance” you mostly believe.",
            "effects": { "skill": 4, "money": 90, "grantHustle": "pedal_flipping" }
          },
          "incredible": {
            "text": "A collector pays absurd money for a fuzz you fixed with a paperclip. The flip becomes a side business.",
            "effects": { "skill": 5, "money": 180, "network": 3, "grantHustle": "pedal_flipping" }
          }
        }
      },
      "right": {
        "label": "Keep the best one",
        "governingStats": { "creativity": 1 },
        "tags": ["tone", "risky"],
        "outcomes": {
          "bad": {
            "text": "The one you keep is haunted by a hum only your amp can hear. You keep it anyway. It has character.",
            "effects": { "creativity": 3, "burnout": 2 }
          },
          "good": {
            "text": "The revived fuzz becomes your sound. People ask what it is. You say “a garage sale.” They think it’s a brand.",
            "effects": { "creativity": 6, "cred": 3 }
          },
          "incredible": {
            "text": "That five-dollar pedal is on every song you write for the next year. Best money you almost didn’t spend.",
            "effects": { "creativity": 8, "cred": 4, "skill": 3 }
          }
        }
      }
    }
  },
  {
    "id": "n2_hold_music",
    "act": 2,
    "pathAffinity": [],
    "weight": 9,
    "art": "ev_n2_hold_music",
    "context": "Tri-County Savings & Loan, licensing office",
    "prompt": "A regional bank needs new hold music. “Something soothing. Something that says ‘your call is important’ without lying too obviously.” The check is real. The exposure is four hundred callers a day, all annoyed.",
    "recap": "A regional bank needs soothing hold music, real check.",
    "tags": ["deal", "record"],
    "choices": {
      "left": {
        "label": "Write them a real piece",
        "minigame": "take",
        "governingStats": { "creativity": 1, "skill": 0.4 },
        "tags": ["record", "work", "safe"],
        "outcomes": {
          "bad": {
            "text": "You overthink it. The bank finds it “too emotional for a mortgage department.” You dial back the yearning.",
            "effects": { "creativity": 3, "money": 40, "burnout": 3 }
          },
          "good": {
            "text": "Four hundred callers a day hear your étude and hate the wait a little less. Passive income, active shame.",
            "effects": { "creativity": 5, "money": 55, "grantHustle": "hold_music" }
          },
          "incredible": {
            "text": "Someone requests “the hold song” at a real show. It has fans now. It has more fans than you sometimes.",
            "effects": { "creativity": 6, "money": 55, "fame": 4, "grantHustle": "hold_music" }
          }
        }
      },
      "right": {
        "label": "Phone it in for the money",
        "governingStats": { "skill": 1 },
        "tags": ["work", "deal"],
        "outcomes": {
          "bad": {
            "text": "You loop four bland bars. The bank loves it. You have never been so well paid to feel so little.",
            "effects": { "skill": 2, "money": 60, "cred": -2 }
          },
          "good": {
            "text": "Bland, competent, forgettable, cashed. The rent is a genre now.",
            "effects": { "skill": 3, "money": 90 }
          },
          "incredible": {
            "text": "The bank expands the contract to all four branches. Your worst work, your best quarter.",
            "effects": { "skill": 3, "money": 150, "cred": -2 }
          }
        }
      }
    }
  },
  {
    "id": "n2_supper_club",
    "act": 2,
    "pathAffinity": [],
    "weight": 9,
    "art": "ev_n2_supper_club",
    "context": "The Rotisserie Room, white tablecloths",
    "prompt": "A supper club wants standards at dinner volume, four nights, tips folded into the piano lid like secrets. The maître d’ calls you “the entertainment,” which stings and pays.",
    "recap": "The Rotisserie Room wants standards at dinner volume, four nights.",
    "tags": ["live", "work"],
    "choices": {
      "left": {
        "label": "Become the room",
        "governingStats": { "skill": 1, "network": 0.3 },
        "tags": ["live", "safe", "roots"],
        "outcomes": {
          "bad": {
            "text": "You play under the clatter of forks. A man requests a song, then talks through all of it. Both are true.",
            "effects": { "skill": 3, "money": 45, "burnout": 4 }
          },
          "good": {
            "text": "The regulars start requesting your originals “between the Gershwin.” The tips fold thicker.",
            "effects": { "skill": 5, "money": 75, "cred": 3, "grantHustle": "supper_club" }
          },
          "incredible": {
            "text": "A retired producer eats here Thursdays. He leaves a card in the piano lid, under a fifty. It says “call me.”",
            "effects": { "skill": 6, "money": 90, "network": 6, "grantHustle": "supper_club" }
          }
        }
      },
      "right": {
        "label": "Sneak in your own set",
        "governingStats": { "creativity": 1 },
        "tags": ["live", "risky", "indie"],
        "outcomes": {
          "bad": {
            "text": "You play three originals in a row. The maître d’ appears at your shoulder like weather. “The Gershwin,” he says.",
            "effects": { "creativity": 3, "cred": 2, "burnout": 4, "money": 20 }
          },
          "good": {
            "text": "You thread originals so gently nobody notices until a table asks for “that last one, was it Cole Porter?” It was you.",
            "effects": { "creativity": 6, "cred": 4, "money": 50 }
          },
          "incredible": {
            "text": "A whole table falls silent for your song. In a supper club, silence is a standing ovation.",
            "effects": { "creativity": 7, "cred": 5, "fame": 4, "money": 60 }
          }
        }
      }
    }
  },
  {
    "id": "n2_ringtone_shop",
    "act": 2,
    "pathAffinity": [],
    "weight": 9,
    "art": "ev_n2_ringtone_shop",
    "context": "Your DMs, filling up",
    "prompt": "That guy who wanted his riff as a ringtone? He told his friends. Now there are eleven requests, each wanting forty seconds of something in your voice, on their phone, unbearable to everyone around them.",
    "recap": "Eleven people now want their own forty-second ringtone.",
    "tags": ["deal", "social"],
    "choices": {
      "left": {
        "label": "Turn it into a service",
        "governingStats": { "network": 1, "creativity": 0.4 },
        "tags": ["deal", "work", "safe"],
        "outcomes": {
          "bad": {
            "text": "You record forty custom ringtones and lose your mind slightly in the process. Each one is forty seconds of your soul, monetized.",
            "effects": { "network": 3, "money": 50, "burnout": 5 }
          },
          "good": {
            "text": "Word spreads. You have a menu now, and a turnaround time, and a customer who wants his cat’s meow harmonized.",
            "effects": { "network": 5, "money": 70, "grantHustle": "ringtone_shop" }
          },
          "incredible": {
            "text": "A local radio host features “the ringtone guy.” Suddenly everyone’s phone plays a little bit of you.",
            "effects": { "network": 7, "money": 90, "fame": 4, "grantHustle": "ringtone_shop" }
          }
        }
      },
      "right": {
        "label": "Use them as demos",
        "minigame": "ideas",
        "governingStats": { "creativity": 1 },
        "tags": ["write", "risky"],
        "outcomes": {
          "bad": {
            "text": "You treat each request as a writing prompt. Most are garbage. One is not garbage. That is a good ratio, actually.",
            "effects": { "creativity": 4, "burnout": 4 }
          },
          "good": {
            "text": "Three of the ringtones are secretly song hooks. You keep the best one for yourself. The customer never knows.",
            "effects": { "creativity": 6, "cred": 3, "writeSong": true }
          },
          "incredible": {
            "text": "A forty-second commission blooms into your next real song. Commerce and art, briefly indistinguishable.",
            "effects": { "creativity": 8, "cred": 4, "fame": 3, "writeSong": true }
          }
        }
      }
    }
  },
  {
    "id": "n2_opener_slot",
    "act": 2,
    "pathAffinity": [],
    "weight": 11,
    "art": "ev_n2_opener_slot",
    "context": "A touring act, one rung up",
    "prompt": "A band a size bigger than you offers the opening slot. Thirty minutes, an unfamiliar crowd, and the specific terror of playing to people who came to see someone else.",
    "recap": "A bigger band offers thirty minutes to an unfamiliar crowd.",
    "tags": ["live", "network"],
    "choices": {
      "left": {
        "label": "Win the strangers",
        "minigame": "crowd",
        "governingStats": { "skill": 1, "creativity": 0.4 },
        "tags": ["live", "risky"],
        "outcomes": {
          "bad": {
            "text": "You open to a room checking its phones. By your last song, three people are watching. You play to those three like they’re a stadium.",
            "effects": { "skill": 4, "fame": 3, "burnout": 6 }
          },
          "good": {
            "text": "You win a chunk of the room. At merch, people who came for the headliner leave with your record.",
            "effects": { "skill": 5, "fame": 7, "network": 4, "money": 80 }
          },
          "incredible": {
            "text": "The headliner watches from the wings and, after, tells the crowd “remember that name.” They do.",
            "effects": { "skill": 6, "fame": 12, "network": 6, "cred": 4 }
          }
        }
      },
      "right": {
        "label": "Play it safe and short",
        "governingStats": { "skill": 1 },
        "tags": ["live", "safe"],
        "outcomes": {
          "bad": {
            "text": "You play the hits clean and leave nothing behind. Competent. Forgotten by the encore.",
            "effects": { "skill": 3, "fame": 2, "burnout": 3 }
          },
          "good": {
            "text": "Tight, professional, no risks, no regrets. The headliner’s manager notes “reliable,” which is a currency.",
            "effects": { "skill": 4, "network": 5, "fame": 4 }
          },
          "incredible": {
            "text": "Reliable becomes “our regular opener.” You get the whole tour’s worth of slots. Boring built a career.",
            "effects": { "skill": 5, "network": 8, "fame": 6, "money": 120 }
          }
        }
      }
    }
  },
  {
    "id": "n2_van_upgrade",
    "act": 2,
    "pathAffinity": [],
    "weight": 10,
    "shop": true,
    "art": "ev_n2_van_upgrade",
    "context": "Honest Al’s Used Vans & Redemption",
    "prompt": "The current van has opinions and a check-engine light that qualifies as a band member. Al has a “barely pre-owned” fifteen-passenger with a working heater. It costs money you almost have.",
    "recap": "Honest Al’s fifteen-passenger van, with a working heater.",
    "tags": ["deal", "shop"],
    "choices": {
      "left": {
        "label": "Buy the better van",
        "cost": 220,
        "governingStats": { "network": 1 },
        "tags": ["deal", "tour", "safe"],
        "outcomes": {
          "bad": {
            "text": "The heater works. Nothing else you were promised does. Al waves from the lot, already gone in spirit.",
            "effects": { "money": -220, "burnout": -2, "network": 2 }
          },
          "good": {
            "text": "A van that starts every time is a quality-of-life revolution. The band cries a little. From relief.",
            "effects": { "money": -220, "burnout": -6, "network": 3, "grantGear": "random_basic" }
          },
          "incredible": {
            "text": "The new van is a fortress. Tours get longer, breakdowns get rarer, and the old dread quietly retires.",
            "effects": { "money": -220, "burnout": -8, "network": 5, "grantGear": "random_good" }
          }
        }
      },
      "right": {
        "label": "Nurse the old one along",
        "governingStats": { "skill": 1 },
        "tags": ["work", "risky"],
        "outcomes": {
          "bad": {
            "text": "You YouTube a repair at a rest stop. It half-works, which on this van is a full recovery.",
            "effects": { "skill": 3, "burnout": 5, "money": -20 }
          },
          "good": {
            "text": "You keep the beast alive another season and pocket the van money. The check-engine light dims, respectfully.",
            "effects": { "skill": 4, "money": 40, "cred": 2 }
          },
          "incredible": {
            "text": "You become a genuinely competent mechanic out of pure poverty. The van will outlive several of your friendships.",
            "effects": { "skill": 6, "money": 60, "network": 2 }
          }
        }
      }
    }
  },
  {
    "id": "n2_hometown_return",
    "act": 2,
    "pathAffinity": [],
    "weight": 10,
    "art": "ev_n2_hometown_return",
    "context": "The room where you started",
    "prompt": "You come back to play the town that watched you learn. Everyone who ever doubted you and everyone who never did are in the same room, holding the same beer.",
    "recap": "Back to the room where you started, doubters and believers both.",
    "tags": ["live", "home"],
    "choices": {
      "left": {
        "label": "Play for the believers",
        "governingStats": { "skill": 1, "cred": 0.4 },
        "tags": ["live", "home", "safe"],
        "outcomes": {
          "bad": {
            "text": "You get in your own head. Your parents film the whole thing vertically. It is, at least, documented.",
            "effects": { "skill": 3, "fame": 3, "burnout": 4 }
          },
          "good": {
            "text": "The hometown roars. Your old teacher is crying. You are, for one night, exactly who you promised you’d be.",
            "effects": { "skill": 5, "fame": 6, "cred": 4, "network": 3 }
          },
          "incredible": {
            "text": "The whole town sings your chorus back at you. Some of them wrote you off years ago. All of them know the words now.",
            "effects": { "skill": 6, "fame": 10, "cred": 6, "network": 4 }
          }
        }
      },
      "right": {
        "label": "Prove the doubters wrong",
        "governingStats": { "creativity": 1, "cred": 0.3 },
        "tags": ["live", "risky", "fame"],
        "outcomes": {
          "bad": {
            "text": "You play angry, to a specific face in the back. That face left at the second song. You performed a grudge to no one.",
            "effects": { "creativity": 3, "cred": -2, "burnout": 6 }
          },
          "good": {
            "text": "You play the set you couldn’t have written here, and the room understands you left to become this.",
            "effects": { "creativity": 6, "fame": 6, "cred": 4 }
          },
          "incredible": {
            "text": "The doubter finds you after. “I was wrong.” You wanted this for years. It’s smaller and better than you imagined.",
            "effects": { "creativity": 7, "fame": 8, "cred": 6, "network": 3 }
          }
        }
      }
    }
  },
  {
    "id": "n2_first_press",
    "act": 2,
    "pathAffinity": [],
    "weight": 10,
    "art": "ev_n2_first_press",
    "context": "An actual journalist, an actual recorder",
    "prompt": "A real music site wants a real feature. The writer is smart, underpaid, and has clearly listened to everything. The first question is “so, who are you?” and it is not small talk.",
    "recap": "A real music journalist, a recorder, and the question ‘so, who are you?’",
    "tags": ["social", "network"],
    "choices": {
      "left": {
        "label": "Be honest",
        "minigame": "interview",
        "governingStats": { "cred": 1, "creativity": 0.3 },
        "tags": ["social", "risky"],
        "outcomes": {
          "bad": {
            "text": "You overshare about the debt and the doubt. The piece is titled “A Portrait of Struggle,” which sells you as sad.",
            "effects": { "cred": 3, "fame": 3, "burnout": 3 }
          },
          "good": {
            "text": "Honesty reads as depth. The feature makes you sound like someone worth rooting for, because you are.",
            "effects": { "cred": 5, "fame": 6, "network": 3 }
          },
          "incredible": {
            "text": "The piece goes around the scene. People quote your own words back to you. You said something true and it stuck.",
            "effects": { "cred": 7, "fame": 9, "network": 4 }
          }
        }
      },
      "right": {
        "label": "Build the myth",
        "governingStats": { "network": 1, "creativity": 0.4 },
        "tags": ["social", "mainstream", "risky"],
        "outcomes": {
          "bad": {
            "text": "You spin a persona and the writer, who is smart, notices the spin. The piece is polite and quietly unconvinced.",
            "effects": { "network": 2, "fame": 4, "cred": -3 }
          },
          "good": {
            "text": "The myth lands. Mysterious, curated, a little larger than life. Some of it you might even grow into.",
            "effects": { "network": 5, "fame": 8, "cred": 2 }
          },
          "incredible": {
            "text": "The legend writes itself into being. People show up expecting the myth and you, terrifyingly, deliver it.",
            "effects": { "network": 7, "fame": 12, "cred": 3 }
          }
        }
      }
    }
  },
  {
    "id": "n2_sync_ad",
    "act": 2,
    "pathAffinity": [],
    "weight": 9,
    "art": "ev_n2_sync_ad",
    "context": "An ad agency, a very specific brief",
    "prompt": "An agency wants your song in a commercial for a mattress that “disrupts sleep.” The fee would pay your rent for a year. The mattress, they clarify, is fine. The disruption is the good kind.",
    "recap": "An agency wants your song for a mattress that ‘disrupts sleep.’",
    "tags": ["deal", "mainstream"],
    "choices": {
      "left": {
        "label": "Take the check",
        "governingStats": { "network": 1 },
        "tags": ["deal", "mainstream", "safe"],
        "outcomes": {
          "bad": {
            "text": "They cut your song to eight seconds and add a slide-whistle. Your art now sells memory foam. The check clears, though.",
            "effects": { "network": 3, "money": 250, "cred": -4 }
          },
          "good": {
            "text": "The ad runs nationally. Strangers hum your song without knowing your name. That’s a kind of fame that pays.",
            "effects": { "network": 4, "money": 300, "fame": 6 }
          },
          "incredible": {
            "text": "The ad is so good people look up the song. You get the check AND the credit. The mattress, frankly, owes you.",
            "effects": { "network": 5, "money": 350, "fame": 10, "cred": 2 }
          }
        }
      },
      "right": {
        "label": "Hold your song back",
        "governingStats": { "cred": 1 },
        "tags": ["indie", "risky"],
        "outcomes": {
          "bad": {
            "text": "You say no on principle and eat ramen on the principle for a month. The principle is delicious and free.",
            "effects": { "cred": 4, "money": -20, "burnout": 3 }
          },
          "good": {
            "text": "The scene notices you turned down the mattress money. Cred, it turns out, is also a currency, just slower.",
            "effects": { "cred": 7, "network": 3 }
          },
          "incredible": {
            "text": "A better brand hears you said no to the mattress and offers double for a real placement, song intact. Integrity compounded.",
            "effects": { "cred": 8, "money": 200, "fame": 5 }
          }
        }
      }
    }
  },
  {
    "id": "n2_release_single",
    "act": 2,
    "pathAffinity": [],
    "weight": 11,
    "requires": { "demoMin": 1 },
    "art": "ev_n2_release_single",
    "context": "The demo, finished, waiting",
    "prompt": "You have a demo good enough to be a single. The question every artist eventually faces: release it now while you feel it, or polish it until the feeling’s gone.",
    "recap": "A demo good enough to be a single, waiting on your call.",
    "tags": ["record", "write"],
    "choices": {
      "left": {
        "label": "Ship it now",
        "governingStats": { "creativity": 1, "network": 0.3 },
        "tags": ["record", "risky"],
        "outcomes": {
          "bad": {
            "text": "You release into a quiet week. The song deserves more than the eleven plays it gets, but it’s out. It’s real now.",
            "effects": { "creativity": 3, "fame": 3, "releaseDemo": 55 }
          },
          "good": {
            "text": "The single drops and the timing is right. It finds the chart’s lower rungs and starts to climb.",
            "effects": { "creativity": 5, "fame": 6, "cred": 3, "releaseDemo": 62 }
          },
          "incredible": {
            "text": "You caught the wave. The single debuts higher than anything you’ve done. Trusting the feeling paid.",
            "effects": { "creativity": 7, "fame": 10, "cred": 4, "releaseDemo": 70 }
          }
        }
      },
      "right": {
        "label": "Polish it first",
        "minigame": "mixdown",
        "governingStats": { "skill": 1, "creativity": 0.4 },
        "tags": ["studio", "safe"],
        "outcomes": {
          "bad": {
            "text": "You polish the life out of it. It’s pristine and slightly dead, like a museum piece of a song you used to feel.",
            "effects": { "skill": 3, "cred": 2, "polishDemo": 4 }
          },
          "good": {
            "text": "The extra week finds the low end and the truth. It’s better now, and you’ll release it braver.",
            "effects": { "skill": 5, "cred": 4, "polishDemo": 8 }
          },
          "incredible": {
            "text": "You find the version that was hiding inside the demo. When it drops, it will drop as a finished thing.",
            "effects": { "skill": 6, "cred": 5, "creativity": 3, "polishDemo": 10 }
          }
        }
      }
    }
  },
  {
    "id": "n2_push_the_single",
    "act": 2,
    "pathAffinity": [],
    "weight": 10,
    "requires": { "chartingMin": 1 },
    "art": "ev_n2_push_the_single",
    "context": "The song is charting. Now what.",
    "prompt": "Your song, {song}, is on the chart and could climb — or slide. There’s a window to push it, and pushing means favors, posts, and pretending you’re not refreshing the numbers hourly.",
    "recap": "{song} is charting, and the window to push it won’t stay open.",
    "tags": ["social", "deal"],
    "choices": {
      "left": {
        "label": "Pour on the promo",
        "governingStats": { "network": 1 },
        "tags": ["social", "mainstream", "risky"],
        "outcomes": {
          "bad": {
            "text": "You push too hard and the internet smells the effort. The song holds, barely, on your dignity’s dime.",
            "effects": { "network": 3, "burnout": 5, "hypeSong": 18 }
          },
          "good": {
            "text": "Coordinated, relentless, effective. The song climbs a few rungs on sheer will and a favor economy.",
            "effects": { "network": 5, "fame": 5, "hypeSong": 24 }
          },
          "incredible": {
            "text": "The push catches a real wind. {song} climbs past where it had any right to be. Momentum is a drug.",
            "effects": { "network": 6, "fame": 8, "cred": 2, "hypeSong": 30 }
          }
        }
      },
      "right": {
        "label": "Let it breathe",
        "governingStats": { "cred": 1 },
        "tags": ["indie", "safe"],
        "outcomes": {
          "bad": {
            "text": "You let it ride and it rides right off the chart. Purists respect you. The chart does not.",
            "effects": { "cred": 4, "fame": 2 }
          },
          "good": {
            "text": "The song finds its own level, honestly. Slower, realer, and the fans it keeps, it keeps for good.",
            "effects": { "cred": 6, "fame": 4, "network": 2 }
          },
          "incredible": {
            "text": "Word of mouth does what money couldn’t. It climbs on its own legs, and that story becomes part of the song.",
            "effects": { "cred": 7, "fame": 7, "network": 3 }
          }
        }
      }
    }
  },
  {
    "id": "n2_session_call",
    "act": 2,
    "pathAffinity": [],
    "weight": 10,
    "art": "ev_n2_session_call",
    "context": "A studio, someone else’s record",
    "prompt": "A better-known artist needs a player for an afternoon. Union scale, no credit guaranteed, and the strong sense that you’re being auditioned for something bigger without being told what.",
    "recap": "A session for a bigger artist: union scale, no credit, quiet audition.",
    "tags": ["studio", "work"],
    "choices": {
      "left": {
        "label": "Nail the part",
        "minigame": "take",
        "governingStats": { "skill": 1 },
        "tags": ["studio", "safe"],
        "outcomes": {
          "bad": {
            "text": "You get it in eleven takes. The producer says “we’ll fix it,” which is the two worst words in the room.",
            "effects": { "skill": 4, "money": 80, "burnout": 4 }
          },
          "good": {
            "text": "First take, then a better second for insurance. The producer writes your number on the good clipboard.",
            "effects": { "skill": 6, "money": 120, "network": 4 }
          },
          "incredible": {
            "text": "You add a part nobody asked for and everybody keeps. You’re a first call now, in one specific rolodex.",
            "effects": { "skill": 7, "money": 150, "network": 6, "cred": 4 }
          }
        }
      },
      "right": {
        "label": "Make it yours",
        "governingStats": { "creativity": 1, "skill": 0.4 },
        "tags": ["studio", "risky", "tone"],
        "outcomes": {
          "bad": {
            "text": "You reinterpret the part. The artist wanted a session player, not a collaborator. Politely, you are not called back.",
            "effects": { "creativity": 3, "money": 80, "cred": -2 }
          },
          "good": {
            "text": "Your interpretation elevates the song. The artist notices you noticed. That’s the beginning of respect.",
            "effects": { "creativity": 6, "money": 100, "network": 4, "cred": 3 }
          },
          "incredible": {
            "text": "The part you invented becomes the hook of their single. Uncredited, unforgettable, and quietly, professionally legendary.",
            "effects": { "creativity": 8, "money": 140, "network": 5, "cred": 5 }
          }
        }
      }
    }
  },
  {
    "id": "n2_rival_split_bill",
    "act": 2,
    "pathAffinity": [],
    "weight": 10,
    "art": "ev_n2_rival_split_bill",
    "context": "One stage, two names on the poster",
    "prompt": "The promoter bills you and {rival} as “co-headliners,” which means one of you goes on last and both of you know it matters. {rival} — {rivalVibe} — is already in the good dressing room.",
    "recap": "You and {rival} share a poster billed ‘co-headliners.’ One goes on last.",
    "tags": ["live", "rival"],
    "choices": {
      "left": {
        "label": "Fight for the closing slot",
        "governingStats": { "network": 1, "skill": 0.4 },
        "tags": ["live", "risky", "rival"],
        "outcomes": {
          "bad": {
            "text": "You win the slot and the tension. {rival} plays the set of their life out of spite, then leaves before yours.",
            "effects": { "network": 3, "fame": 4, "burnout": 5, "rivalry": 1 }
          },
          "good": {
            "text": "You close, and you earn it. {rival} watches from the wings, arms crossed, taking notes they’ll never admit to.",
            "effects": { "network": 5, "fame": 8, "cred": 3, "rivalry": 1 }
          },
          "incredible": {
            "text": "You close the night so hard the promoter rebooks you both — you headlining, {rival} opening. The order is the message.",
            "effects": { "network": 7, "fame": 12, "cred": 4, "rivalry": 1 }
          }
        }
      },
      "right": {
        "label": "Share the stage, genuinely",
        "governingStats": { "creativity": 1, "network": 0.3 },
        "tags": ["live", "band"],
        "outcomes": {
          "bad": {
            "text": "You propose a joint encore. {rival} agrees, then plays over your solo. The crowd loves it. You do not.",
            "effects": { "creativity": 3, "fame": 5, "rivalry": 1 }
          },
          "good": {
            "text": "The joint encore actually works. Two crowds become one, and the feud cools by one careful degree.",
            "effects": { "creativity": 5, "fame": 6, "network": 4, "rivalry": -1 }
          },
          "incredible": {
            "text": "You and {rival} tear the roof off together. Backstage, grudgingly, a real conversation. The rivalry softens into respect.",
            "effects": { "creativity": 7, "fame": 9, "network": 5, "rivalry": -1 }
          }
        }
      }
    }
  },
  {
    "id": "n2_rival_truce_offer",
    "act": 2,
    "pathAffinity": [],
    "weight": 9,
    "requires": { "rivalryMax": 4 },
    "art": "ev_n2_rival_truce_offer",
    "context": "A text from {rival}, unexpectedly",
    "prompt": "{rival} texts: “this feud is exhausting and neither of us is winning. Beer?” It could be a genuine olive branch. It could be reconnaissance. With {rival}, it’s usually both.",
    "recap": "{rival} texts: ‘this feud is exhausting. Beer?’ Olive branch, or recon.",
    "tags": ["network", "rival"],
    "choices": {
      "left": {
        "label": "Take the beer",
        "governingStats": { "network": 1 },
        "tags": ["network", "safe", "rival"],
        "outcomes": {
          "bad": {
            "text": "The beer is nice. Two weeks later {rival} uses everything you said as a bit in an interview. Cost of peace.",
            "effects": { "network": 3, "cred": 2, "rivalry": -1 }
          },
          "good": {
            "text": "You actually talk. Turns out the feud was mostly the scene’s invention. You leave lighter and less alone.",
            "effects": { "network": 5, "cred": 3, "burnout": -3, "rivalry": -1 }
          },
          "incredible": {
            "text": "The beer becomes a friendship becomes a plan. Two rivals, one idea, and the scene doesn’t know what to do with it.",
            "effects": { "network": 7, "cred": 4, "rivalry": -2 }
          }
        }
      },
      "right": {
        "label": "Keep your edge",
        "governingStats": { "cred": 1 },
        "tags": ["indie", "risky", "rival"],
        "outcomes": {
          "bad": {
            "text": "You decline. {rival} shrugs publicly and paints you as the difficult one. The story travels. You gave it the plot.",
            "effects": { "cred": 2, "fame": 2, "rivalry": 1 }
          },
          "good": {
            "text": "You keep the rivalry sharp on purpose — it makes you both better. You practice harder just to spite them.",
            "effects": { "cred": 5, "skill": 3, "rivalry": 1 }
          },
          "incredible": {
            "text": "The feud becomes fuel. You write your best song aimed squarely at {rival}, who will pretend not to notice it, forever.",
            "effects": { "cred": 6, "creativity": 5, "fame": 4, "rivalry": 1 }
          }
        }
      }
    }
  },
  {
    "id": "n2_weather_dance_craze",
    "act": 2,
    "pathAffinity": [],
    "weight": 9,
    "requires": { "weatherIs": "dance_craze" },
    "art": "ev_n2_weather_dance_craze",
    "context": "Fifteen seconds ruling the earth",
    "prompt": "There’s a dance. It has a hand-thing. Every song that fits it is exploding and every song that doesn’t is invisible. A choreographer offers to build the hand-thing around your chorus.",
    "recap": "A viral dance with a hand-thing, and a choreographer eyeing your chorus.",
    "tags": ["social", "mainstream"],
    "choices": {
      "left": {
        "label": "Build the hand-thing",
        "governingStats": { "network": 1, "creativity": 0.4 },
        "tags": ["social", "mainstream", "risky"],
        "outcomes": {
          "bad": {
            "text": "The dance is fine. The song under it gets buried by the dance. Millions do the move; nobody learns your name.",
            "effects": { "network": 3, "fame": 6, "cred": -3 }
          },
          "good": {
            "text": "The dance and the song rise together. For one glorious week you are a verb people do at weddings.",
            "effects": { "network": 5, "fame": 12, "cred": -2 }
          },
          "incredible": {
            "text": "The move is inseparable from the song, and the song is unmistakably yours. You engineered a moment. It worked.",
            "effects": { "network": 6, "fame": 18, "cred": 2 }
          }
        }
      },
      "right": {
        "label": "Refuse the trend",
        "governingStats": { "cred": 1, "creativity": 0.3 },
        "tags": ["indie", "safe"],
        "outcomes": {
          "bad": {
            "text": "You sit the craze out on principle and watch lesser songs lap you. The principle keeps you warm. Barely.",
            "effects": { "cred": 4, "burnout": 3 }
          },
          "good": {
            "text": "You make the anti-craze song, deliberately un-danceable, and the people tired of the dance find you first.",
            "effects": { "cred": 6, "creativity": 4, "fame": 4 }
          },
          "incredible": {
            "text": "When the craze dies — and it dies fast — your song is still standing. You bet on the long half and won it.",
            "effects": { "cred": 8, "creativity": 5, "fame": 6 }
          }
        }
      }
    }
  },
  {
    "id": "n2_weather_payola",
    "act": 2,
    "pathAffinity": [],
    "weight": 9,
    "requires": { "weatherIs": "payola_probe" },
    "art": "ev_n2_weather_payola",
    "context": "The playlist editor is “on sabbatical”",
    "prompt": "The subpoenas hit the mailroom and suddenly every playlist editor is “taking time.” The gatekeepers vanished overnight and the gates are just… open. Briefly. For anyone honest enough to walk through.",
    "recap": "Subpoenas emptied the mailroom; every playlist gate is briefly open.",
    "tags": ["deal", "social"],
    "choices": {
      "left": {
        "label": "Walk through the open gate",
        "governingStats": { "network": 1, "cred": 0.4 },
        "tags": ["deal", "risky"],
        "outcomes": {
          "bad": {
            "text": "You pitch the leaderless playlists directly. Half bounce, but the half that land, land clean — no favor owed.",
            "effects": { "network": 3, "fame": 4, "cred": 3 }
          },
          "good": {
            "text": "With the pay-to-play crowd sidelined, merit briefly matters. Your song gets added on the strength of the song.",
            "effects": { "network": 5, "fame": 7, "cred": 5 }
          },
          "incredible": {
            "text": "You slot into three big playlists on merit alone, right as everyone’s watching who got in clean. The timing is a halo.",
            "effects": { "network": 6, "fame": 11, "cred": 7 }
          }
        }
      },
      "right": {
        "label": "Stay clear of the mess",
        "governingStats": { "cred": 1 },
        "tags": ["indie", "safe"],
        "outcomes": {
          "bad": {
            "text": "You keep your distance from the whole radioactive business. Safe, invisible, and quietly proud of both.",
            "effects": { "cred": 4, "burnout": 2 }
          },
          "good": {
            "text": "You build the old way — shows, tapes, hands shaken — while the industry cleans its house. Slow bricks, real house.",
            "effects": { "cred": 6, "network": 3, "fame": 3 }
          },
          "incredible": {
            "text": "When the dust settles, you’re the artist with no exposure to the scandal and a fanbase built entirely by hand. Bulletproof.",
            "effects": { "cred": 8, "network": 4, "fame": 5 }
          }
        }
      }
    }
  },
  {
    "id": "n2_merch_math",
    "act": 2,
    "pathAffinity": [],
    "weight": 10,
    "art": "ev_n2_merch_math",
    "context": "A box of shirts, a spreadsheet, a decision",
    "prompt": "Merch is where touring bands actually make money, which nobody tells you until you’re standing behind a folding table at midnight doing arithmetic on shirt margins.",
    "recap": "A box of shirts, a folding table, and midnight math on margins.",
    "tags": ["deal", "work"],
    "choices": {
      "left": {
        "label": "Go big on merch",
        "governingStats": { "network": 1 },
        "tags": ["deal", "work", "risky"],
        "outcomes": {
          "bad": {
            "text": "You order two hundred shirts in a color that photographs as “hospital.” You will be selling these for years.",
            "effects": { "network": 2, "money": -60, "burnout": 4 }
          },
          "good": {
            "text": "Good design, right sizes, fair price. The table becomes the most profitable ten square feet of the tour.",
            "effects": { "network": 4, "money": 140 }
          },
          "incredible": {
            "text": "A fan wears your shirt in a photo that travels. The shirt becomes the ad. The merch sells the merch.",
            "effects": { "network": 5, "money": 220, "fame": 4 }
          }
        }
      },
      "right": {
        "label": "Keep it lean and personal",
        "governingStats": { "creativity": 1 },
        "tags": ["indie", "safe"],
        "outcomes": {
          "bad": {
            "text": "You hand-screen forty shirts and they sell out and you’re out of shirts by the second city. Scarcity, unplanned.",
            "effects": { "creativity": 3, "money": 40, "cred": 2 }
          },
          "good": {
            "text": "Small runs, hand-numbered, a little precious, a lot beloved. The fans who buy them feel chosen.",
            "effects": { "creativity": 5, "money": 80, "cred": 4 }
          },
          "incredible": {
            "text": "Your hand-made merch becomes collectible. People trade your tour shirts like currency. Small was the flex.",
            "effects": { "creativity": 6, "money": 120, "cred": 5, "fame": 3 }
          }
        }
      }
    }
  },
  {
    "id": "n2_producer_offer",
    "act": 2,
    "pathAffinity": [],
    "weight": 10,
    "art": "ev_n2_producer_offer",
    "context": "A producer with a real console",
    "prompt": "A producer with actual credits wants to make your record. The catch: their sound is their sound, and it’s a good sound, and it might swallow yours whole.",
    "recap": "A producer with real credits wants your record — and has their own sound.",
    "tags": ["studio", "deal"],
    "choices": {
      "left": {
        "label": "Trust their vision",
        "governingStats": { "skill": 1, "network": 0.4 },
        "tags": ["studio", "safe", "tone"],
        "outcomes": {
          "bad": {
            "text": "The record sounds expensive and unlike you. It’s the best-produced version of someone you’re not.",
            "effects": { "skill": 4, "cred": -3, "money": -50 }
          },
          "good": {
            "text": "Their polish plus your songs equals the best you’ve sounded. You learn a decade of tricks in three weeks.",
            "effects": { "skill": 6, "cred": 3, "network": 4 }
          },
          "incredible": {
            "text": "The producer pushes you somewhere you couldn’t reach alone, and it’s still unmistakably yours. A real record.",
            "effects": { "skill": 8, "cred": 5, "network": 5, "fame": 4 }
          }
        }
      },
      "right": {
        "label": "Keep creative control",
        "governingStats": { "creativity": 1 },
        "tags": ["studio", "risky", "indie"],
        "outcomes": {
          "bad": {
            "text": "You self-produce out of stubbornness. It sounds like your bedroom, because it is. Charming, or unfinished. Both.",
            "effects": { "creativity": 3, "cred": 3, "burnout": 4 }
          },
          "good": {
            "text": "You keep the reins and the record stays yours, rough edges and all. The rough edges are the point.",
            "effects": { "creativity": 6, "cred": 5, "skill": 2 }
          },
          "incredible": {
            "text": "Your uncompromised record becomes the one people cite as “the real one.” Control was the sound all along.",
            "effects": { "creativity": 8, "cred": 7, "fame": 4 }
          }
        }
      }
    }
  },
  {
    "id": "n2_burnout_wall_early",
    "act": 2,
    "pathAffinity": [],
    "weight": 9,
    "requires": { "burnoutMin": 45 },
    "art": "ev_n2_burnout_wall_early",
    "context": "The van, a gas station, 2 a.m.",
    "prompt": "You catch your reflection in the gas-station glass and don’t entirely recognize the person touring this hard. The tank is full. You are not. There’s a night off available if you take it.",
    "recap": "2 a.m. at a gas station, not recognizing your reflection. A night off is there.",
    "tags": ["rest", "home"],
    "choices": {
      "left": {
        "label": "Take the night off",
        "governingStats": { "cred": 1 },
        "tags": ["rest", "safe"],
        "outcomes": {
          "bad": {
            "text": "You rest and feel guilty the whole time, which is not resting, which is guilt with a pillow.",
            "effects": { "burnout": -8, "cred": 2 }
          },
          "good": {
            "text": "You sleep ten hours and remember why you started. The songs sound different when you’re a person again.",
            "effects": { "burnout": -14, "cred": 3, "creativity": 2 }
          },
          "incredible": {
            "text": "One real day off resets everything. You come back sharper than the grind ever made you. Rest is a technique.",
            "effects": { "burnout": -20, "cred": 4, "skill": 3 }
          }
        }
      },
      "right": {
        "label": "Push through",
        "governingStats": { "skill": 1 },
        "tags": ["work", "risky"],
        "outcomes": {
          "bad": {
            "text": "You push through and leave something behind on that stage that you can’t quite name and won’t get back cheap.",
            "effects": { "skill": 3, "fame": 4, "burnout": 10 }
          },
          "good": {
            "text": "You grind out the extra shows and the money’s real, even if the reflection in the glass keeps its distance.",
            "effects": { "skill": 5, "fame": 5, "money": 100, "burnout": 6 }
          },
          "incredible": {
            "text": "You catch a second wind that feels almost supernatural and play the run of your life. Don’t count on it twice.",
            "effects": { "skill": 7, "fame": 9, "money": 120, "burnout": 5 }
          }
        }
      }
    }
  },
  {
    "id": "n2_write_the_grief",
    "act": 2,
    "pathAffinity": [],
    "weight": 10,
    "art": "ev_n2_write_the_grief",
    "context": "A hard week, a blank page",
    "prompt": "Something in your life broke this week — quietly, the way real things do. The notebook is open. You could write around it, or write straight into it.",
    "recap": "Something broke this week, quietly. The notebook is open.",
    "tags": ["write", "home"],
    "choices": {
      "left": {
        "label": "Write straight into it",
        "minigame": "ideas",
        "governingStats": { "creativity": 1 },
        "tags": ["write", "risky", "indie"],
        "outcomes": {
          "bad": {
            "text": "It’s too soon and too raw and the song is just the wound with a melody. You put it in the drawer for later.",
            "effects": { "creativity": 3, "burnout": 4 }
          },
          "good": {
            "text": "You find the words for the thing you couldn’t say out loud. The song holds it so you don’t have to alone.",
            "effects": { "creativity": 6, "cred": 4, "writeSong": true }
          },
          "incredible": {
            "text": "You write the truest thing you’ve ever written. Someday a stranger will play it on their worst night and not feel alone.",
            "effects": { "creativity": 8, "cred": 6, "fame": 3, "writeSong": true }
          }
        }
      },
      "right": {
        "label": "Write your way out",
        "governingStats": { "creativity": 1, "skill": 0.3 },
        "tags": ["write", "safe"],
        "outcomes": {
          "bad": {
            "text": "You write something bright to escape the dark and it rings a little hollow, like whistling past a room.",
            "effects": { "creativity": 3, "burnout": 2 }
          },
          "good": {
            "text": "You write the hopeful one on purpose, as medicine, and it works — on you first, then on everyone.",
            "effects": { "creativity": 5, "cred": 3, "fame": 3 }
          },
          "incredible": {
            "text": "The bright song you built as armor becomes the one people sing back at you for joy. You made the exit and it worked.",
            "effects": { "creativity": 7, "cred": 4, "fame": 5 }
          }
        }
      }
    }
  },
  {
    "id": "n2_scene_politics",
    "act": 2,
    "pathAffinity": [],
    "weight": 10,
    "art": "ev_n2_scene_politics",
    "context": "A group chat, on fire",
    "prompt": "Two bands you like are feuding and the whole scene is choosing sides in a group chat that will not stop buzzing. Everyone’s waiting to see where you land, which is its own kind of pressure.",
    "recap": "Two bands you like are feuding, and the group chat wants your side.",
    "tags": ["social", "network"],
    "choices": {
      "left": {
        "label": "Broker peace",
        "governingStats": { "network": 1, "cred": 0.3 },
        "tags": ["network", "safe"],
        "outcomes": {
          "bad": {
            "text": "You try to mediate and both sides decide you’re secretly on the other’s. Now it’s a three-way thing. Great.",
            "effects": { "network": 2, "burnout": 4 }
          },
          "good": {
            "text": "You get the two bands in a room and, improbably, it works. The scene owes you a favor it won’t admit to.",
            "effects": { "network": 6, "cred": 4 }
          },
          "incredible": {
            "text": "You broker a truce so cleanly you become the person people bring problems to. Influence, quietly acquired.",
            "effects": { "network": 8, "cred": 5, "fame": 3 }
          }
        }
      },
      "right": {
        "label": "Stay out of it",
        "governingStats": { "cred": 1 },
        "tags": ["indie", "safe"],
        "outcomes": {
          "bad": {
            "text": "Your silence reads as a stance to people determined to read it that way. You said nothing and still got quoted.",
            "effects": { "cred": 2, "burnout": 3 }
          },
          "good": {
            "text": "You keep your head down and your name out of it, and quietly earn a reputation as the one who just makes music.",
            "effects": { "cred": 5, "network": 2 }
          },
          "incredible": {
            "text": "While everyone else torched their week on discourse, you finished a song. The best revenge in this scene is output.",
            "effects": { "cred": 6, "creativity": 4, "fame": 3 }
          }
        }
      }
    }
  },
  {
    "id": "n2_bs_ox_amps",
    "act": 2,
    "pathAffinity": [],
    "weight": 11,
    "requires": { "bandHas": "ox" },
    "art": "ev_bs_ox",
    "context": "Ox, after load-in, quietly",
    "prompt": "Ox carried the entire backline up three flights again, alone, and apologized for taking up the stairwell. Tonight he asks for one thing, so gently you almost miss it: “could we maybe get a hand truck?”",
    "recap": "Ox hauled the whole backline up three flights, then asked for a hand truck.",
    "tags": ["band", "work"],
    "choices": {
      "left": {
        "label": "Buy the hand truck. And notice him.",
        "governingStats": { "network": 1 },
        "tags": ["band", "safe"],
        "outcomes": {
          "bad": {
            "text": "You get the hand truck. Ox is thrilled about the hand truck. You realize you’ve never once asked how he’s doing.",
            "effects": { "network": 3, "burnout": -2 }
          },
          "good": {
            "text": "The hand truck AND a real conversation. Ox, it turns out, writes poetry nobody’s asked to read. You ask.",
            "effects": { "network": 5, "cred": 4, "burnout": -4 }
          },
          "incredible": {
            "text": "You start splitting the load — literally, then in every way. Ox stands a little taller. The whole band does.",
            "effects": { "network": 7, "cred": 5, "burnout": -5 }
          }
        }
      },
      "right": {
        "label": "Let him keep carrying it",
        "governingStats": { "skill": 1 },
        "tags": ["band", "work", "risky"],
        "outcomes": {
          "bad": {
            "text": "You say “next tour.” Ox nods, the way he always does. Something small closes behind his eyes and you saw it.",
            "effects": { "skill": 2, "burnout": 3 }
          },
          "good": {
            "text": "Ox keeps carrying it because Ox always will, but you catch yourself helping now, unprompted. A start.",
            "effects": { "skill": 3, "network": 3 }
          },
          "incredible": {
            "text": "You don’t buy the hand truck, but you never let him load alone again. Ox notices the difference. It matters more.",
            "effects": { "skill": 4, "network": 4, "cred": 3, "burnout": -2 }
          }
        }
      }
    }
  },
  {
    "id": "n2_bs_dot_ledger",
    "act": 2,
    "pathAffinity": [],
    "weight": 11,
    "requires": { "bandHas": "dot" },
    "art": "ev_bs_dot",
    "context": "Dot, with a spreadsheet and a look",
    "prompt": "Dot has been quietly keeping the band’s books, and tonight she sits everyone down with a spreadsheet. “So,” she says, in the voice of someone who found something. “We need to talk about where the merch money goes.”",
    "recap": "Dot sat everyone down with a spreadsheet about the merch money.",
    "tags": ["band", "deal"],
    "choices": {
      "left": {
        "label": "Face the numbers",
        "governingStats": { "network": 1, "cred": 0.3 },
        "tags": ["deal", "safe", "band"],
        "outcomes": {
          "bad": {
            "text": "The numbers are bleak and the meeting is long and someone cries and it’s maybe you. But now you know.",
            "effects": { "network": 3, "money": 40, "burnout": 4 }
          },
          "good": {
            "text": "Dot untangles a year of chaos into a plan. You’re not rich, but you’re no longer bleeding money you can’t see.",
            "effects": { "network": 5, "money": 120, "cred": 3 }
          },
          "incredible": {
            "text": "Dot finds $400 nobody knew you were owed, plus a leak she plugs on the spot. She should run a country. She runs your band.",
            "effects": { "network": 6, "money": 200, "cred": 4 }
          }
        }
      },
      "right": {
        "label": "Trust the vibes",
        "governingStats": { "creativity": 1 },
        "tags": ["indie", "risky", "band"],
        "outcomes": {
          "bad": {
            "text": "You wave the spreadsheet off. Dot files it, dated, for the day you’ll wish you’d listened. That day is coming.",
            "effects": { "creativity": 2, "money": -40, "burnout": 3 }
          },
          "good": {
            "text": "You keep it loose but let Dot handle the bank. Freedom for you, order for the money. A fair trade.",
            "effects": { "creativity": 4, "money": 60, "network": 3 }
          },
          "incredible": {
            "text": "You give Dot full control of the finances and your creative life doubles overnight. Delegation is a superpower.",
            "effects": { "creativity": 6, "money": 100, "network": 4, "cred": 3 }
          }
        }
      }
    }
  },
  {
    "id": "n2_festival_slot",
    "act": 2,
    "pathAffinity": [],
    "weight": 10,
    "art": "ev_n2_festival_slot",
    "context": "A mid-tier festival, a noon slot",
    "prompt": "You get a festival slot: noon, second stage, opposite a beloved act on the main stage. The crowd is whoever wandered over. Your job is to make them glad they did.",
    "recap": "Noon on the second stage, opposite a beloved act on the main one.",
    "tags": ["live", "tour"],
    "choices": {
      "left": {
        "label": "Win the wanderers",
        "minigame": "crowd",
        "governingStats": { "skill": 1, "creativity": 0.3 },
        "tags": ["live", "risky"],
        "outcomes": {
          "bad": {
            "text": "Noon sun, thin crowd, and a sound tech still setting up during your first song. You play through it. It builds character.",
            "effects": { "skill": 4, "fame": 3, "burnout": 5 }
          },
          "good": {
            "text": "The crowd triples by your third song as people follow the sound over. Word travels across a field fast.",
            "effects": { "skill": 5, "fame": 8, "network": 4 }
          },
          "incredible": {
            "text": "You draw people AWAY from the main stage. The festival books you higher next year, on the strength of a noon miracle.",
            "effects": { "skill": 7, "fame": 13, "network": 5, "cred": 3 }
          }
        }
      },
      "right": {
        "label": "Network the field",
        "governingStats": { "network": 1 },
        "tags": ["network", "safe"],
        "outcomes": {
          "bad": {
            "text": "You spend the day handing out cards to people holding beers. Most become recycling. Two become something.",
            "effects": { "network": 4, "burnout": 3 }
          },
          "good": {
            "text": "Backstage is the real festival. You meet three bands and a booker and leave with more contacts than fans.",
            "effects": { "network": 6, "fame": 3 }
          },
          "incredible": {
            "text": "You befriend a headliner at the catering tent. By fall you’re opening their tour. The field was the venue.",
            "effects": { "network": 9, "fame": 6, "cred": 3 }
          }
        }
      }
    }
  },
  {
    "id": "n2_old_friend",
    "act": 2,
    "pathAffinity": [],
    "weight": 9,
    "art": "ev_n2_old_friend",
    "context": "A friend from before, at the merch table",
    "prompt": "A friend from before the music shows up at your merch table. They’re proud of you and a little wounded that you left, and both of those things are in every sentence they say.",
    "recap": "A friend from before turns up at the merch table, proud and a little hurt.",
    "tags": ["home", "network"],
    "choices": {
      "left": {
        "label": "Make real time for them",
        "governingStats": { "cred": 1 },
        "tags": ["home", "safe"],
        "outcomes": {
          "bad": {
            "text": "You skip the afterparty to catch up and the industry people notice you left. The friend, though, needed it. So did you.",
            "effects": { "cred": 4, "burnout": -3, "network": -2 }
          },
          "good": {
            "text": "You blow off the schmoozing and get a real hour with a real friend. It refills a tank the touring emptied.",
            "effects": { "cred": 5, "burnout": -5, "creativity": 2 }
          },
          "incredible": {
            "text": "The friend reminds you who you were before any of this, and you write a song about it that night. Roots, watered.",
            "effects": { "cred": 6, "burnout": -4, "creativity": 4 }
          }
        }
      },
      "right": {
        "label": "Work the room instead",
        "governingStats": { "network": 1 },
        "tags": ["network", "risky"],
        "outcomes": {
          "bad": {
            "text": "You promise the friend “next time” and go network. The friend leaves early. Next time is not guaranteed and you both know it.",
            "effects": { "network": 4, "cred": -3, "burnout": 3 }
          },
          "good": {
            "text": "You make the rounds and land a real contact, but text the friend a long apology from the van. They understand. Mostly.",
            "effects": { "network": 6, "cred": 2 }
          },
          "incredible": {
            "text": "You work the room AND drag the friend into it, and they charm someone who books you a month later. Two worlds, merged.",
            "effects": { "network": 8, "cred": 3, "fame": 3 }
          }
        }
      }
    }
  },
  {
    "id": "n2_radio_promise",
    "act": 2,
    "pathAffinity": [],
    "weight": 9,
    "art": "ev_n2_radio_promise",
    "context": "A community station benefit",
    "prompt": "The little station that played you first is struggling. The DJ who championed you asks, half-joking, if you’d headline a benefit to keep the lights on. Everyone in the room heard the ask.",
    "recap": "The little station that played you first needs a benefit headliner.",
    "tags": ["live", "network"],
    "choices": {
      "left": {
        "label": "Promise the benefit",
        "governingStats": { "cred": 1, "network": 0.3 },
        "tags": ["live", "safe"],
        "outcomes": {
          "bad": {
            "text": "You commit on the spot and immediately realize your calendar is a war crime. You’ll make it work. You have to now.",
            "effects": {
              "cred": 4,
              "burnout": 3,
              "addPromise": {
                "label": "Headline the station benefit",
                "tags": ["live"],
                "cards": 5,
                "reward": { "cred": 8, "fame": 5, "network": 4 },
                "penalty": { "cred": -6, "network": -3 }
              }
            }
          },
          "good": {
            "text": "You say yes and mean it, and the DJ’s whole face changes. Some debts you pay gladly. This is one.",
            "effects": {
              "cred": 5,
              "network": 3,
              "addPromise": {
                "label": "Headline the station benefit",
                "tags": ["live"],
                "cards": 5,
                "reward": { "cred": 8, "fame": 5, "network": 4 },
                "penalty": { "cred": -6, "network": -3 }
              }
            }
          },
          "incredible": {
            "text": "You not only commit, you rope in three bands who owe you. The benefit becomes an event before it’s even booked.",
            "effects": {
              "cred": 7,
              "network": 5,
              "fame": 3,
              "addPromise": {
                "label": "Headline the station benefit",
                "tags": ["live"],
                "cards": 5,
                "reward": { "cred": 8, "fame": 5, "network": 4 },
                "penalty": { "cred": -6, "network": -3 }
              }
            }
          }
        }
      },
      "right": {
        "label": "Give money instead",
        "governingStats": { "network": 1 },
        "tags": ["deal", "safe"],
        "outcomes": {
          "bad": {
            "text": "You write a check to dodge the calendar problem. It helps the station and stings the DJ, who wanted YOU, not your money.",
            "effects": { "network": 2, "money": -80, "cred": -2 }
          },
          "good": {
            "text": "You donate generously and honestly, and the station survives the quarter. Not everything has to be a grand gesture.",
            "effects": { "network": 4, "money": -60, "cred": 3 }
          },
          "incredible": {
            "text": "Your donation inspires a matching drive and the station not only survives but expands. Sometimes the check IS the song.",
            "effects": { "network": 6, "money": -60, "cred": 5, "fame": 3 }
          }
        }
      }
    }
  },
  {
    "id": "n2_gear_theft",
    "act": 2,
    "pathAffinity": [],
    "weight": 9,
    "art": "ev_n2_gear_theft",
    "context": "The van, a broken window, a gap where gear was",
    "prompt": "Someone smashed the van window overnight and took what they could carry. There’s a show tonight. There’s a hole where your rig used to be. The scene, when it hears, tends to close ranks.",
    "recap": "The van window’s smashed, the gear’s gone, and there’s a show tonight.",
    "tags": ["work", "network"],
    "choices": {
      "left": {
        "label": "Ask the scene for help",
        "governingStats": { "network": 1 },
        "tags": ["network", "safe"],
        "outcomes": {
          "bad": {
            "text": "You post about it and get sympathy and one loaner amp that hums. You play the show on borrowed everything and pride.",
            "effects": { "network": 3, "burnout": 5 }
          },
          "good": {
            "text": "The scene shows up. Three bands lend gear, a shop lends a backline, and you play a show built entirely of goodwill.",
            "effects": { "network": 6, "cred": 5, "fame": 3 }
          },
          "incredible": {
            "text": "The theft becomes a rallying cry. A benefit gets thrown for YOU, and you come out with better gear and a deeper scene.",
            "effects": { "network": 8, "cred": 6, "money": 150 }
          }
        }
      },
      "right": {
        "label": "Handle it yourself",
        "governingStats": { "skill": 1 },
        "tags": ["work", "risky"],
        "outcomes": {
          "bad": {
            "text": "You max a card replacing gear before the show. You play great and can’t afford to feel it. The debt watches from the wings.",
            "effects": { "skill": 3, "money": -120, "burnout": 5 }
          },
          "good": {
            "text": "You rebuild the rig lean and smart, and honestly it sounds better stripped down. Loss as an edit.",
            "effects": { "skill": 5, "cred": 3, "money": -80 }
          },
          "incredible": {
            "text": "You rebuild from scratch into exactly the rig you always wanted but never justified. The thief did you a strange favor.",
            "effects": { "skill": 7, "cred": 4, "creativity": 3, "money": -60 }
          }
        }
      }
    }
  },
  {
    "id": "n2_the_algorithm",
    "act": 2,
    "pathAffinity": [],
    "weight": 10,
    "art": "ev_n2_the_algorithm",
    "context": "A dashboard that knows you better than you do",
    "prompt": "The platform’s analytics dashboard tells you exactly which fifteen seconds of which song people replay. It’s not the part you’re proud of. It’s never the part you’re proud of.",
    "recap": "The dashboard knows the exact fifteen seconds people replay.",
    "tags": ["social", "write"],
    "choices": {
      "left": {
        "label": "Feed the machine",
        "governingStats": { "network": 1, "creativity": 0.3 },
        "tags": ["social", "mainstream", "risky"],
        "outcomes": {
          "bad": {
            "text": "You write to the fifteen seconds and the song is all hook and no body, a highlight reel of a song that doesn’t exist.",
            "effects": { "network": 3, "fame": 6, "cred": -4 }
          },
          "good": {
            "text": "You learn what the data’s actually telling you — not what to write, but where you lose people — and you get sharper.",
            "effects": { "network": 5, "fame": 6, "skill": 3 }
          },
          "incredible": {
            "text": "You crack the code without selling your soul: a real song that also happens to be irresistibly clippable. Rare alchemy.",
            "effects": { "network": 6, "fame": 11, "creativity": 3 }
          }
        }
      },
      "right": {
        "label": "Ignore it entirely",
        "governingStats": { "creativity": 1 },
        "tags": ["indie", "safe"],
        "outcomes": {
          "bad": {
            "text": "You close the dashboard and write what you want. It performs like it wants: quietly. You sleep fine, though.",
            "effects": { "creativity": 4, "cred": 3 }
          },
          "good": {
            "text": "Freed from the numbers, you make your weirdest, best work. The people who find it, find all of it.",
            "effects": { "creativity": 6, "cred": 5, "fame": 3 }
          },
          "incredible": {
            "text": "Your data-blind album becomes a cult object precisely because it refused to chase anything. The machine hates that it works.",
            "effects": { "creativity": 8, "cred": 6, "fame": 5 }
          }
        }
      }
    }
  },
  {
    "id": "n2_genre_gatekeep",
    "act": 2,
    "pathAffinity": [],
    "weight": 8,
    "requires": { "genreAny": true },
    "art": "ev_n2_genre_gatekeep",
    "context": "A purist, at the bar, cornering you",
    "prompt": "Someone deep in the {genre} scene informs you, unprompted, that you’re “doing it wrong.” They have a very long definition of the genre and you are apparently outside it.",
    "recap": "A {genre} purist at the bar explains, unprompted, that you’re doing it wrong.",
    "tags": ["social", "indie"],
    "choices": {
      "left": {
        "label": "Defend your take",
        "governingStats": { "cred": 1, "creativity": 0.3 },
        "tags": ["indie", "risky"],
        "outcomes": {
          "bad": {
            "text": "You argue genre theory at a bar and win a fight nobody was scoring. The purist buys their own beer and leaves. Pyrrhic.",
            "effects": { "cred": 3, "burnout": 3 }
          },
          "good": {
            "text": "You make a genuine case for evolving the {genre} sound, and even the purist grudgingly nods. Respect, extracted.",
            "effects": { "cred": 5, "creativity": 3, "network": 2 }
          },
          "incredible": {
            "text": "You articulate your vision so clearly the purist becomes a convert. They now defend YOU to other purists. The bit flips.",
            "effects": { "cred": 7, "creativity": 4, "fame": 3 }
          }
        }
      },
      "right": {
        "label": "Just let them talk",
        "governingStats": { "cred": 1 },
        "tags": ["safe"],
        "outcomes": {
          "bad": {
            "text": "You nod for twenty minutes about “the real” {genre} and lose the evening. Your smile, at least, held.",
            "effects": { "cred": 2, "burnout": 3 }
          },
          "good": {
            "text": "You let the purist lecture and quietly file away two things they said that were actually right. Free notes.",
            "effects": { "cred": 4, "skill": 2 }
          },
          "incredible": {
            "text": "You out-listen them so thoroughly they leave feeling heard and you leave with your whole evening and their best idea.",
            "effects": { "cred": 5, "creativity": 3, "network": 2 }
          }
        }
      }
    }
  },
  {
    "id": "n2_venue_regular",
    "act": 2,
    "pathAffinity": [],
    "weight": 9,
    "requires": { "venueLevelMin": 1, "venueAny": true },
    "art": "ev_n2_venue_regular",
    "context": "{venue}, which knows you now",
    "prompt": "You’ve played {venue} enough that the staff know your order and the sound guy pre-sets your levels. Tonight the owner floats an idea: a monthly residency, your night, your rules.",
    "recap": "{venue} knows your order now, and the owner floats a monthly residency.",
    "tags": ["live", "home"],
    "choices": {
      "left": {
        "label": "Take the residency",
        "governingStats": { "network": 1, "creativity": 0.3 },
        "tags": ["live", "home", "safe"],
        "outcomes": {
          "bad": {
            "text": "A monthly night sounds great until month three, when you’re out of new material and the regulars notice.",
            "effects": { "network": 3, "fame": 3, "burnout": 4 }
          },
          "good": {
            "text": "The residency becomes a laboratory. You test new songs on a room that loves you enough to be honest. {venue} thrives.",
            "effects": { "network": 5, "cred": 4, "fame": 4, "venueLove": 1 }
          },
          "incredible": {
            "text": "Your residency becomes THE night in town. People plan around it. {venue}’s owner names a drink after you.",
            "effects": { "network": 7, "cred": 5, "fame": 6, "venueLove": 1 }
          }
        }
      },
      "right": {
        "label": "Keep {venue} special",
        "governingStats": { "cred": 1 },
        "tags": ["live", "indie"],
        "outcomes": {
          "bad": {
            "text": "You decline to keep it rare, then wonder if you just turned down the one steady thing you had. The doubt lingers.",
            "effects": { "cred": 3, "burnout": 2 }
          },
          "good": {
            "text": "You play {venue} on your own terms — rarely, memorably — and every show there becomes an event by scarcity.",
            "effects": { "cred": 5, "fame": 4, "venueLove": 1 }
          },
          "incredible": {
            "text": "By keeping {venue} special, each return becomes legend. People still talk about the nights you DID play there.",
            "effects": { "cred": 6, "fame": 6, "network": 3, "venueLove": 1 }
          }
        }
      }
    }
  },
  {
    "id": "n2_broke_stretch",
    "act": 2,
    "pathAffinity": [],
    "weight": 9,
    "requires": { "moneyMax": 60 },
    "art": "ev_n2_broke_stretch",
    "context": "The bank app, refreshing to the same number",
    "prompt": "The tour’s momentum is real but the bank account is a rumor. Rent is due, the van needs tires, and there’s a corporate gig offer that pays great and dents your soul slightly.",
    "recap": "Rent’s due, the van needs tires, and a corporate gig pays too well.",
    "tags": ["deal", "work"],
    "choices": {
      "left": {
        "label": "Take the corporate gig",
        "governingStats": { "skill": 1 },
        "tags": ["work", "mainstream", "safe"],
        "outcomes": {
          "bad": {
            "text": "You play a product launch for people on their phones. The check is huge. The dignity is a rounding error. It’s fine. It’s fine.",
            "effects": { "skill": 3, "money": 200, "cred": -4 }
          },
          "good": {
            "text": "The corporate gig is soulless and lucrative and quietly professional. You bank it and buy the tires and breathe.",
            "effects": { "skill": 4, "money": 250, "burnout": 2 }
          },
          "incredible": {
            "text": "A tech exec at the launch turns out to love real music and becomes a genuine patron. The soulless gig grew a soul.",
            "effects": { "skill": 5, "money": 300, "network": 5 }
          }
        }
      },
      "right": {
        "label": "Scrape by on real gigs",
        "governingStats": { "cred": 1, "network": 0.3 },
        "tags": ["live", "risky", "busk"],
        "outcomes": {
          "bad": {
            "text": "You stack three underpaid real shows and just barely make rent. Broke and unbought. It counts for something. Not tires, though.",
            "effects": { "cred": 4, "money": 60, "burnout": 5 }
          },
          "good": {
            "text": "You cobble together honest gigs and, somehow, it works out. Lean, proud, and still entirely yourself.",
            "effects": { "cred": 6, "money": 120, "fame": 3 }
          },
          "incredible": {
            "text": "Refusing the corporate money becomes part of your story, and a fan with means quietly covers your tires. Karma, itemized.",
            "effects": { "cred": 7, "money": 180, "network": 3 }
          }
        }
      }
    }
  },
  {
    "id": "n2_music_video",
    "act": 2,
    "pathAffinity": [],
    "weight": 9,
    "art": "ev_n2_music_video",
    "context": "A film student with a camera and a dream",
    "prompt": "A film student wants to make a music video for you, free, in exchange for “the reel.” Their ideas are either genius or unhinged and it is genuinely impossible to tell which.",
    "recap": "A film student offers a free video for ‘the reel’ — genius or unhinged, unclear.",
    "tags": ["social", "work"],
    "choices": {
      "left": {
        "label": "Trust the vision",
        "governingStats": { "creativity": 1 },
        "tags": ["social", "risky", "indie"],
        "outcomes": {
          "bad": {
            "text": "The video is nine minutes of you underwater holding a lamp. The student calls it “a statement.” The statement is unclear.",
            "effects": { "creativity": 3, "fame": 3, "burnout": 3 }
          },
          "good": {
            "text": "The unhinged idea works. The video is strange and gorgeous and gets shared by people who don’t even like the song.",
            "effects": { "creativity": 6, "fame": 8, "network": 3 }
          },
          "incredible": {
            "text": "The video goes places the song alone never could. The student becomes a real director and takes you up with them.",
            "effects": { "creativity": 7, "fame": 13, "network": 5 }
          }
        }
      },
      "right": {
        "label": "Keep it simple",
        "governingStats": { "skill": 1 },
        "tags": ["safe"],
        "outcomes": {
          "bad": {
            "text": "You insist on a straightforward performance video and it’s exactly as forgettable as “straightforward” promises.",
            "effects": { "skill": 2, "fame": 2 }
          },
          "good": {
            "text": "A clean, well-shot performance video that makes you look like a real band. Sometimes competent is the whole win.",
            "effects": { "skill": 4, "fame": 5, "network": 2 }
          },
          "incredible": {
            "text": "The simple video is so well-executed it becomes the definitive version of the song in people’s heads. Restraint, rewarded.",
            "effects": { "skill": 5, "fame": 8, "cred": 3 }
          }
        }
      }
    }
  },
  {
    "id": "n2_the_ask",
    "act": 2,
    "pathAffinity": [],
    "weight": 9,
    "art": "ev_n2_the_ask",
    "context": "A younger band, wide-eyed, at your show",
    "prompt": "A band a year behind where you are asks you to take them on tour as your opener. You remember being them. You also remember how thin the money already is.",
    "recap": "A band a year behind you asks to open. The money’s already thin.",
    "tags": ["network", "live"],
    "choices": {
      "left": {
        "label": "Bring them along",
        "governingStats": { "network": 1, "cred": 0.3 },
        "tags": ["network", "safe", "band"],
        "outcomes": {
          "bad": {
            "text": "They’re green and the split gets tight, but the shows are warmer for having them. You’re somebody’s big break now.",
            "effects": { "network": 4, "cred": 4, "money": -40 }
          },
          "good": {
            "text": "They’re better than you expected and grateful in a way that reminds you why you do this. The tour lifts everyone.",
            "effects": { "network": 6, "cred": 5, "fame": 3 }
          },
          "incredible": {
            "text": "The young band blows up a year later and never stops crediting you. That loyalty pays dividends for the rest of your career.",
            "effects": { "network": 8, "cred": 6, "fame": 4 }
          }
        }
      },
      "right": {
        "label": "Keep the tour lean",
        "governingStats": { "network": 1 },
        "tags": ["work", "risky"],
        "outcomes": {
          "bad": {
            "text": "You say no to protect the margins. The band’s face falls, and you recognize the exact fall. It sits with you a while.",
            "effects": { "network": 2, "money": 40, "cred": -2 }
          },
          "good": {
            "text": "You decline kindly and connect them to a better-fit tour instead. Not everything is yours to carry. They land fine.",
            "effects": { "network": 4, "cred": 3, "money": 40 }
          },
          "incredible": {
            "text": "You can’t take them but you produce their demo for free one weekend, and it launches them. Mentorship without the tour math.",
            "effects": { "network": 6, "cred": 5, "money": 20 }
          }
        }
      }
    }
  },
  {
    "id": "n2_label_sniff",
    "act": 2,
    "pathAffinity": [],
    "weight": 10,
    "requires": { "fameMin": 30 },
    "art": "ev_n2_label_sniff",
    "context": "An A&R rep, three drinks in, at your show",
    "prompt": "A label A&R is at your show, which is either everything or nothing. They love you tonight. They love four bands a night. The trick is knowing which kind of love this is before you sign anything.",
    "recap": "An A&R rep is at your show, loving you like they love four bands a night.",
    "tags": ["deal", "network"],
    "choices": {
      "left": {
        "label": "Play it cool",
        "governingStats": { "network": 1, "cred": 0.3 },
        "tags": ["deal", "safe"],
        "outcomes": {
          "bad": {
            "text": "You play hard to get and they take you at your word and move on to band three. Cool, it turns out, can be too cool.",
            "effects": { "network": 2, "cred": 3, "burnout": 3 }
          },
          "good": {
            "text": "You stay measured, ask good questions, and leave them wanting more. They text the next morning. That’s the tell.",
            "effects": { "network": 6, "cred": 4, "fame": 4 }
          },
          "incredible": {
            "text": "Your composure reads as leverage you don’t have yet, and the offer that comes is better for it. Never let them see you refresh.",
            "effects": { "network": 8, "cred": 5, "fame": 6 }
          }
        }
      },
      "right": {
        "label": "Show them everything",
        "governingStats": { "creativity": 1, "network": 0.4 },
        "tags": ["deal", "risky", "fame"],
        "outcomes": {
          "bad": {
            "text": "You over-eager the whole pitch and they smell the need. The follow-up never comes. Desperation has a frequency they hear.",
            "effects": { "creativity": 3, "fame": 3, "cred": -2 }
          },
          "good": {
            "text": "You lay out the full vision and it’s genuinely compelling. They leave believing in you, which is the actual product.",
            "effects": { "creativity": 5, "network": 5, "fame": 5 }
          },
          "incredible": {
            "text": "Your all-in pitch is so complete they don’t just want to sign you, they want to build the label’s next year around you.",
            "effects": { "creativity": 7, "network": 8, "fame": 8, "cred": 3 }
          }
        }
      }
    }
  },
  {
    "id": "n2_cover_gone_big",
    "act": 2,
    "pathAffinity": [],
    "weight": 9,
    "art": "ev_n2_cover_gone_big",
    "context": "Your cover, outrunning your originals",
    "prompt": "A cover you posted on a whim is doing better than anything you wrote. It’s a nice problem and a real one: lean into being the cover person, or use the attention to point back home.",
    "recap": "A cover you posted on a whim is outrunning everything you wrote.",
    "tags": ["social", "write"],
    "choices": {
      "left": {
        "label": "Ride the cover",
        "governingStats": { "network": 1 },
        "tags": ["social", "mainstream", "risky"],
        "outcomes": {
          "bad": {
            "text": "You post more covers and the numbers stay up and the originals stay buried. You’re famous for someone else’s song.",
            "effects": { "network": 3, "fame": 8, "cred": -4 }
          },
          "good": {
            "text": "You milk the cover’s reach smartly, slipping originals into every post, and slowly the audience turns toward your stuff.",
            "effects": { "network": 5, "fame": 8, "cred": 2 }
          },
          "incredible": {
            "text": "You do a cover so definitively that the original artist shouts you out, and their whole fanbase discovers you. Jackpot.",
            "effects": { "network": 7, "fame": 14, "cred": 3 }
          }
        }
      },
      "right": {
        "label": "Redirect to your songs",
        "governingStats": { "creativity": 1, "network": 0.3 },
        "tags": ["write", "indie"],
        "outcomes": {
          "bad": {
            "text": "You pivot hard to originals and the cover crowd evaporates. The people who stay are yours, but there are fewer of them.",
            "effects": { "creativity": 4, "cred": 4, "fame": -2 }
          },
          "good": {
            "text": "You use the cover as a doorway and get a real chunk of that audience to walk through it into your actual music.",
            "effects": { "creativity": 6, "cred": 5, "fame": 5 }
          },
          "incredible": {
            "text": "You convert the cover’s virality into genuine fans of YOUR work so smoothly that people forget the cover came first.",
            "effects": { "creativity": 8, "cred": 6, "fame": 8 }
          }
        }
      }
    }
  },
  {
    "id": "n2_bandmate_doubt",
    "act": 2,
    "pathAffinity": [],
    "weight": 9,
    "requires": { "bandMin": 2 },
    "art": "ev_n2_bandmate_doubt",
    "context": "A bandmate, at the diner, serious",
    "prompt": "One of your bandmates has been quiet all tour, and over bad diner coffee it comes out: they’re not sure they can keep doing this. Not the music. The everything-else that comes with the music.",
    "recap": "Over bad diner coffee, a bandmate admits they’re not sure they can go on.",
    "tags": ["band", "home"],
    "choices": {
      "left": {
        "label": "Really listen",
        "governingStats": { "cred": 1 },
        "tags": ["band", "safe"],
        "outcomes": {
          "bad": {
            "text": "You listen and it’s heavier than you were ready for. No solution tonight, just a friend, less alone at a diner. Sometimes that’s the whole job.",
            "effects": { "cred": 4, "burnout": -2 }
          },
          "good": {
            "text": "You hear them out fully and rework the tour to be survivable for everyone. The band gets healthier and, quietly, better.",
            "effects": { "cred": 6, "network": 3, "burnout": -4 }
          },
          "incredible": {
            "text": "The honest conversation rebuilds the band on stronger ground. They stay, and they stay because you made it worth staying.",
            "effects": { "cred": 7, "network": 5, "creativity": 3 }
          }
        }
      },
      "right": {
        "label": "Push for the dream",
        "governingStats": { "network": 1 },
        "tags": ["band", "risky"],
        "outcomes": {
          "bad": {
            "text": "You make the case for pushing on and they nod along and you can tell you didn’t reach them. The distance in the van grows.",
            "effects": { "network": 2, "burnout": 5 }
          },
          "good": {
            "text": "You reignite their belief with a genuinely inspiring pitch about what’s just ahead. They recommit, tentatively, but really.",
            "effects": { "network": 5, "fame": 3, "cred": 2 }
          },
          "incredible": {
            "text": "Your conviction is so real it reminds everyone why they signed up. The band comes out of that diner unbreakable.",
            "effects": { "network": 7, "cred": 4, "fame": 4 }
          }
        }
      }
    }
  },
  {
    "id": "n2_hustle_audit_two",
    "act": 2,
    "pathAffinity": [],
    "weight": 8,
    "requires": { "hustleMin": 2 },
    "art": "ev_n2_hustle_audit_two",
    "context": "Tax season, a shoebox of receipts",
    "prompt": "You have enough side hustles now that tax season is genuinely confusing. An accountant looks at your shoebox of income streams and says, with respect, “you’re a small business having a breakdown.”",
    "recap": "Tax season, a shoebox of receipts, and an accountant’s pity.",
    "tags": ["deal", "work"],
    "choices": {
      "left": {
        "label": "Get organized",
        "governingStats": { "network": 1 },
        "tags": ["deal", "work", "safe"],
        "outcomes": {
          "bad": {
            "text": "You spend a weekend on spreadsheets instead of songs. Boring, necessary, and mildly soul-crushing. But legal now.",
            "effects": { "network": 3, "money": 60, "burnout": 4 }
          },
          "good": {
            "text": "You systematize the hustles and discover you’re making more than you thought. Financial clarity is its own kind of freedom.",
            "effects": { "network": 5, "money": 140 }
          },
          "incredible": {
            "text": "Organized, the hustles compound. You realize you’ve accidentally built something durable underneath the dream. Security.",
            "effects": { "network": 6, "money": 220, "cred": 2 }
          }
        }
      },
      "right": {
        "label": "Keep it chaotic",
        "governingStats": { "creativity": 1 },
        "tags": ["indie", "risky"],
        "outcomes": {
          "bad": {
            "text": "You shove the shoebox back in the closet and vow to deal with it later. Later is coming. Later always comes.",
            "effects": { "creativity": 2, "money": -40, "burnout": 3 }
          },
          "good": {
            "text": "You keep it loose and pour the saved time into actual music. Messy books, full notebook. A defensible trade.",
            "effects": { "creativity": 5, "cred": 3 }
          },
          "incredible": {
            "text": "Your refusal to become an accountant means you write three songs that weekend, and one of them is a keeper.",
            "effects": { "creativity": 7, "cred": 3, "writeSong": true }
          }
        }
      }
    }
  },
  {
    "id": "n2_tighten_the_set",
    "act": 2,
    "pathAffinity": [],
    "weight": 10,
    "art": "ev_n2_tighten_the_set",
    "context": "Rehearsal, the night before a big one",
    "prompt": "A big show tomorrow, and tonight the set is close but not tight. You can drill it until it’s a machine, or leave a little room for the chaos that sometimes becomes magic.",
    "recap": "The night before a big show, the set is close but not yet tight.",
    "tags": ["practice", "live"],
    "choices": {
      "left": {
        "label": "Drill it tight",
        "minigame": "tighten",
        "governingStats": { "skill": 1 },
        "tags": ["practice", "safe"],
        "outcomes": {
          "bad": {
            "text": "You over-rehearse into stiffness. Tomorrow the set is flawless and airless, a beautiful machine with no pulse.",
            "effects": { "skill": 4, "burnout": 5 }
          },
          "good": {
            "text": "Tight but breathing. The transitions snap, the band locks in, and tomorrow you won’t have to think, only feel.",
            "effects": { "skill": 6, "cred": 3, "burnout": 3 }
          },
          "incredible": {
            "text": "You drill it into your bones. Tomorrow your hands are free to fly because they’re not worried about the parts. Mastery.",
            "effects": { "skill": 8, "cred": 4 }
          }
        }
      },
      "right": {
        "label": "Leave room for magic",
        "governingStats": { "creativity": 1, "skill": 0.3 },
        "tags": ["practice", "risky"],
        "outcomes": {
          "bad": {
            "text": "You leave it loose and tomorrow the looseness becomes a train wreck in song four. Chaos is not always magic. Sometimes it’s just chaos.",
            "effects": { "creativity": 3, "burnout": 4 }
          },
          "good": {
            "text": "The room you left fills with a genuine moment tomorrow — an improvised outro the crowd will remember.",
            "effects": { "creativity": 6, "fame": 4, "cred": 3 }
          },
          "incredible": {
            "text": "The space you protected becomes the best five minutes of the show, a jam nobody planned that everybody filmed.",
            "effects": { "creativity": 8, "fame": 6, "cred": 4 }
          }
        }
      }
    }
  },
  {
    "id": "n2_streaming_check",
    "act": 2,
    "pathAffinity": [],
    "weight": 9,
    "art": "ev_n2_streaming_check",
    "context": "The quarterly royalty statement",
    "prompt": "Your first real streaming royalty check arrives. You had a hundred thousand streams. The check is for an amount that would embarrass a vending machine. The math of modern music, in one envelope.",
    "recap": "A hundred thousand streams, and a check that embarrasses a vending machine.",
    "tags": ["deal", "social"],
    "choices": {
      "left": {
        "label": "Make peace with it",
        "governingStats": { "cred": 1 },
        "tags": ["indie", "safe"],
        "outcomes": {
          "bad": {
            "text": "You accept that streaming is a billboard, not an income, and feel briefly hollow about the whole enterprise.",
            "effects": { "cred": 3, "burnout": 3 }
          },
          "good": {
            "text": "You reframe streams as reach and shows as income, and build the tour math around it. Clarity beats bitterness.",
            "effects": { "cred": 5, "network": 3 }
          },
          "incredible": {
            "text": "You publicly, wittily break down the streaming math and it resonates hard. You become a voice on it, which drives people to your shows.",
            "effects": { "cred": 7, "fame": 5, "network": 3 }
          }
        }
      },
      "right": {
        "label": "Rage against it",
        "governingStats": { "creativity": 1, "cred": 0.3 },
        "tags": ["social", "risky", "indie"],
        "outcomes": {
          "bad": {
            "text": "You post a furious thread about the payout model. It’s correct and exhausting and you spend a day arguing with strangers.",
            "effects": { "creativity": 2, "cred": 3, "burnout": 5 }
          },
          "good": {
            "text": "You channel the rage into a song about the whole broken machine, and it hits a nerve with everyone as broke as you.",
            "effects": { "creativity": 6, "cred": 5, "fame": 4 }
          },
          "incredible": {
            "text": "Your protest song becomes an anthem for underpaid artists everywhere. The check was tiny; the statement was enormous.",
            "effects": { "creativity": 8, "cred": 7, "fame": 6 }
          }
        }
      }
    }
  },
  {
    "id": "n2_encore_demand",
    "act": 2,
    "pathAffinity": [],
    "weight": 10,
    "art": "ev_n2_encore_demand",
    "context": "The crowd, not leaving",
    "prompt": "The set’s over, the lights should be up, but the room is stomping for more and you didn’t plan an encore because you didn’t dare assume. You have maybe one more song in the tank and a decision to make.",
    "recap": "The set’s over, the room’s stomping, and you didn’t plan an encore.",
    "tags": ["live", "fame"],
    "choices": {
      "left": {
        "label": "Give them the hit again",
        "governingStats": { "skill": 1 },
        "tags": ["live", "mainstream", "safe"],
        "outcomes": {
          "bad": {
            "text": "You replay the one they know and it’s a little flat the second time, but they scream anyway. Diminishing, but returns.",
            "effects": { "skill": 3, "fame": 4, "burnout": 4 }
          },
          "good": {
            "text": "You bring back the anthem and the whole room sings every word louder than the first time. A perfect exit.",
            "effects": { "skill": 5, "fame": 7, "cred": 3 }
          },
          "incredible": {
            "text": "The reprise becomes a communal thing, phones up, strangers arm in arm. That’s the clip that follows you home.",
            "effects": { "skill": 6, "fame": 11, "cred": 4 }
          }
        }
      },
      "right": {
        "label": "Try the brand-new one",
        "governingStats": { "creativity": 1, "skill": 0.3 },
        "tags": ["live", "risky", "indie"],
        "outcomes": {
          "bad": {
            "text": "You debut the unfinished new one and it wobbles in the second verse. Brave, honest, and slightly a mess. They forgive you.",
            "effects": { "creativity": 3, "cred": 3, "burnout": 4 }
          },
          "good": {
            "text": "You premiere the new song raw and the room leans in, witnessing something first. That intimacy is worth more than polish.",
            "effects": { "creativity": 6, "cred": 5, "fame": 4 }
          },
          "incredible": {
            "text": "The brand-new song, played once, unrecorded, becomes legend — the people there swear it was the best thing you’ve written. They’re right.",
            "effects": { "creativity": 8, "cred": 6, "fame": 6 }
          }
        }
      }
    }
  },
  {
    "id": "n2_documentary_pitch",
    "act": 2,
    "pathAffinity": [],
    "weight": 8,
    "requires": { "fameMin": 40 },
    "art": "ev_n2_documentary_pitch",
    "context": "A filmmaker with a treatment and a hunger",
    "prompt": "A documentary filmmaker wants to follow you for a year. “Warts and all,” they say, which always means mostly warts. It could be a beautiful record of this run, or a camera watching you fail in HD.",
    "recap": "A filmmaker wants to follow you for a year — ‘warts and all.’",
    "tags": ["social", "work"],
    "choices": {
      "left": {
        "label": "Let them film everything",
        "governingStats": { "creativity": 1, "network": 0.3 },
        "tags": ["social", "risky"],
        "outcomes": {
          "bad": {
            "text": "The camera is always there, including for the fight, the breakdown, and the bad show. You’ll see it all again later. Great.",
            "effects": { "creativity": 3, "fame": 5, "burnout": 5 }
          },
          "good": {
            "text": "You forget the camera and just live, and the footage becomes an honest, moving portrait of a band mid-becoming.",
            "effects": { "creativity": 6, "fame": 8, "cred": 4 }
          },
          "incredible": {
            "text": "The doc captures the exact year everything changed, and when it airs, it turns your whole story into legend.",
            "effects": { "creativity": 7, "fame": 14, "cred": 5 }
          }
        }
      },
      "right": {
        "label": "Keep the cameras out",
        "governingStats": { "cred": 1 },
        "tags": ["indie", "safe"],
        "outcomes": {
          "bad": {
            "text": "You decline and the filmmaker makes a doc about someone else who blows up. You watch it and wonder, once, about the road not filmed.",
            "effects": { "cred": 3, "burnout": 2 }
          },
          "good": {
            "text": "You protect the private year and it stays yours, unmediated, unperformed. Some things are better unwatched.",
            "effects": { "cred": 6, "creativity": 3, "burnout": -2 }
          },
          "incredible": {
            "text": "Your refusal to be documented becomes its own mystique. The lack of footage makes people lean in harder. Absence as art.",
            "effects": { "cred": 7, "fame": 5, "creativity": 3 }
          }
        }
      }
    }
  },
  {
    "id": "n2_reissue_offer",
    "act": 2,
    "pathAffinity": [],
    "weight": 9,
    "requires": { "fadedMin": 1 },
    "art": "ev_n2_reissue_offer",
    "context": "A small label, a nostalgic idea",
    "prompt": "An indie label wants to press {fadedSong} — the one that charted and vanished — onto vinyl as a “deluxe reissue.” It’s a little soon to be nostalgic about yourself, but the offer’s real.",
    "recap": "An indie label wants to press {fadedSong} on vinyl as a ‘deluxe reissue.’",
    "tags": ["deal", "record"],
    "choices": {
      "left": {
        "label": "Do the reissue",
        "governingStats": { "network": 1 },
        "tags": ["deal", "record", "safe"],
        "outcomes": {
          "bad": {
            "text": "The vinyl looks gorgeous and sells to the forty people who already loved {fadedSong}. A beautiful object, a tiny audience.",
            "effects": { "network": 3, "money": 60, "cred": 3 }
          },
          "good": {
            "text": "The reissue reintroduces {fadedSong} to people who missed it the first time. A second life, on wax, at your pace.",
            "effects": { "network": 5, "money": 120, "fame": 4, "cred": 3 }
          },
          "incredible": {
            "text": "The deluxe {fadedSong} becomes a collector’s item and quietly outsells the original run tenfold. The song got its due, late but real.",
            "effects": { "network": 6, "money": 200, "fame": 6, "cred": 4 }
          }
        }
      },
      "right": {
        "label": "Look forward instead",
        "governingStats": { "creativity": 1 },
        "tags": ["write", "indie"],
        "outcomes": {
          "bad": {
            "text": "You decline the reissue to focus on the new, then spend a week comparing everything you write to {fadedSong}. Stuck facing forward.",
            "effects": { "creativity": 3, "burnout": 3 }
          },
          "good": {
            "text": "You pass on the past and put the energy into new material, and it’s better for refusing to live in the reissue.",
            "effects": { "creativity": 6, "cred": 4 }
          },
          "incredible": {
            "text": "By refusing to be nostalgic, you write something that makes {fadedSong} look like a warm-up. Forward was the right way to look.",
            "effects": { "creativity": 8, "cred": 5, "fame": 4 }
          }
        }
      }
    }
  },
  {
    "id": "n2_award_nom",
    "act": 2,
    "pathAffinity": [],
    "weight": 8,
    "requires": { "fameMin": 45 },
    "art": "ev_n2_award_nom",
    "context": "An email with the word “nominee” in it",
    "prompt": "A regional music award nominated you. It’s a small award. It’s also the first time an institution has ever said your name in a sentence with “best.” The ceremony is next month, in a hotel ballroom.",
    "recap": "A regional award named you a nominee — first time anyone said ‘best.’",
    "tags": ["fame", "network"],
    "choices": {
      "left": {
        "label": "Show up and play the game",
        "governingStats": { "network": 1 },
        "tags": ["fame", "mainstream", "safe"],
        "outcomes": {
          "bad": {
            "text": "You go, you don’t win, you make small talk under bad chandeliers for three hours. The rubber chicken was the highlight.",
            "effects": { "network": 3, "fame": 3, "burnout": 3 }
          },
          "good": {
            "text": "You work the ballroom, lose gracefully, and leave with two real connections and a nice photo. Losing, done well.",
            "effects": { "network": 6, "fame": 5, "cred": 2 }
          },
          "incredible": {
            "text": "You win the little award and the speech is genuine and short and everyone remembers it. Small trophy, big night.",
            "effects": { "network": 7, "fame": 9, "cred": 4 }
          }
        }
      },
      "right": {
        "label": "Skip it, stay real",
        "governingStats": { "cred": 1 },
        "tags": ["indie", "safe"],
        "outcomes": {
          "bad": {
            "text": "You skip the ceremony to play a tiny real show instead, and win the award anyway, in absentia. Awkward. Also kind of iconic.",
            "effects": { "cred": 4, "fame": 3 }
          },
          "good": {
            "text": "You play a basement show the same night and the contrast becomes your whole brand: the artist who chose the room over the ballroom.",
            "effects": { "cred": 6, "fame": 4, "network": 2 }
          },
          "incredible": {
            "text": "Your no-show becomes a legend of integrity, and the basement gig you played instead is talked about for years. You won the night without attending it.",
            "effects": { "cred": 8, "fame": 6, "network": 3 }
          }
        }
      }
    }
  },
  {
    "id": "n2_late_night_write",
    "act": 2,
    "pathAffinity": [],
    "weight": 9,
    "art": "ev_n2_late_night_write",
    "context": "4 a.m., a melody that won’t leave",
    "prompt": "It’s 4 a.m. and a melody arrived uninvited and complete, the kind that feels less like writing and more like taking dictation. You’re exhausted. The melody does not care.",
    "recap": "4 a.m., and a finished melody arrived uninvited.",
    "tags": ["write", "home"],
    "choices": {
      "left": {
        "label": "Chase it now",
        "minigame": "ideas",
        "governingStats": { "creativity": 1 },
        "tags": ["write", "risky"],
        "outcomes": {
          "bad": {
            "text": "You stay up until dawn and lose the thread anyway, and tomorrow you’re wrecked with nothing to show. The muse is a liar sometimes.",
            "effects": { "creativity": 3, "burnout": 6 }
          },
          "good": {
            "text": "You catch the melody before it evaporates and it’s real, it’s good, it’s yours. Worth the wrecked morning.",
            "effects": { "creativity": 6, "burnout": 4, "writeSong": true }
          },
          "incredible": {
            "text": "You stay up and finish the whole thing in one fevered sitting and it’s the best thing you’ve done. Some nights are gifts.",
            "effects": { "creativity": 8, "cred": 4, "burnout": 3, "writeSong": true }
          }
        }
      },
      "right": {
        "label": "Trust you’ll remember",
        "governingStats": { "skill": 1 },
        "tags": ["rest", "safe"],
        "outcomes": {
          "bad": {
            "text": "You hum it into your phone and go to sleep, and in the morning the voice memo is thirty seconds of you mumbling. It’s gone.",
            "effects": { "skill": 2, "burnout": -3 }
          },
          "good": {
            "text": "You capture just enough on your phone to rebuild it fresh in the morning, rested. The melody survives; so do you.",
            "effects": { "skill": 4, "creativity": 3, "burnout": -2 }
          },
          "incredible": {
            "text": "You sleep, and the melody is STILL there at breakfast, undeniable, which means it was a real one. You finish it clear-headed and it soars.",
            "effects": { "skill": 5, "creativity": 5, "burnout": -3 }
          }
        }
      }
    }
  },
  {
    "id": "n2_two_three_bridge",
    "act": [2, 3],
    "pathAffinity": [],
    "weight": 10,
    "art": "ev_n2_two_three_bridge",
    "context": "A crossroads you didn’t plan for",
    "prompt": "The momentum is undeniable now, and with it comes the offers that force the question you’ve been dodging: what are you actually building toward? Everyone wants to know. Increasingly, so do you.",
    "recap": "The momentum forces the question: what are you building toward?",
    "tags": ["deal", "network"],
    "choices": {
      "left": {
        "label": "Commit to the vision",
        "governingStats": { "creativity": 1, "network": 0.3 },
        "tags": ["deal", "risky"],
        "outcomes": {
          "bad": {
            "text": "You declare a direction and immediately doubt it. Committing to a vision means grieving the other visions. It stings.",
            "effects": { "creativity": 3, "cred": 3, "burnout": 4 }
          },
          "good": {
            "text": "You pick a lane and the clarity is a relief. Suddenly every decision is easier because you know what you’re for.",
            "effects": { "creativity": 6, "cred": 4, "network": 3 }
          },
          "incredible": {
            "text": "You commit fully and the universe seems to reward the certainty — the right people, the right rooms, all at once.",
            "effects": { "creativity": 7, "cred": 5, "network": 5, "fame": 3 }
          }
        }
      },
      "right": {
        "label": "Keep your options open",
        "governingStats": { "network": 1 },
        "tags": ["network", "safe"],
        "outcomes": {
          "bad": {
            "text": "You hedge and stay flexible and end up drifting, a little, between three half-committed futures. Optionality has a cost.",
            "effects": { "network": 3, "burnout": 3 }
          },
          "good": {
            "text": "You stay nimble and it pays — you catch an opportunity a more committed artist would’ve missed. Flexibility, rewarded.",
            "effects": { "network": 6, "fame": 4, "money": 80 }
          },
          "incredible": {
            "text": "Your refusal to be pinned down becomes a strength; you move between worlds freely and each one thinks you’re theirs. Freedom, mastered.",
            "effects": { "network": 8, "fame": 6, "cred": 3 }
          }
        }
      }
    }
  },
  {
    "id": "n3_legacy_act",
    "act": 3,
    "pathAffinity": [],
    "weight": 11,
    "art": "ev_n3_legacy_act",
    "context": "A festival, the “legends” slot",
    "prompt": "The festival slots you in the afternoon “heritage” block, between two acts older than your parents. It’s an honor shaped exactly like being told you’re no longer new.",
    "recap": "The festival files you into the afternoon ‘heritage’ block.",
    "tags": ["live", "fame"],
    "choices": {
      "left": {
        "label": "Own the elder-statesman role",
        "governingStats": { "cred": 1, "skill": 0.4 },
        "tags": ["live", "safe"],
        "outcomes": {
          "bad": {
            "text": "You play the wise-veteran set and it reads as tired. The kids drift to the trap stage. The trap stage is winning.",
            "effects": { "cred": 3, "fame": 4, "burnout": 5 }
          },
          "good": {
            "text": "You wear the legacy well — a masterclass set that reminds everyone why you lasted. Respect, banked.",
            "effects": { "cred": 6, "fame": 8, "skill": 4 }
          },
          "incredible": {
            "text": "You turn the heritage slot into the talk of the festival. Young bands cite you in interviews for years after this set.",
            "effects": { "cred": 8, "fame": 12, "skill": 5, "network": 4 }
          }
        }
      },
      "right": {
        "label": "Prove you’re still dangerous",
        "minigame": "crowd",
        "governingStats": { "creativity": 1, "skill": 0.4 },
        "tags": ["live", "risky", "indie"],
        "outcomes": {
          "bad": {
            "text": "You debut all-new material to prove you’re not a nostalgia act, and the heritage crowd wanted the old songs. Nobody’s happy.",
            "effects": { "creativity": 3, "fame": 3, "burnout": 7 }
          },
          "good": {
            "text": "You play like you have something to prove, because you do, and the afternoon slot becomes the surprise of the day.",
            "effects": { "creativity": 6, "fame": 9, "cred": 5 }
          },
          "incredible": {
            "text": "You out-dangerous every young act on the bill. The “heritage” framing evaporates. You’re just the best set, full stop.",
            "effects": { "creativity": 8, "fame": 14, "cred": 6 }
          }
        }
      }
    }
  },
  {
    "id": "n3_body_keeps_score",
    "act": 3,
    "pathAffinity": [],
    "weight": 10,
    "requires": { "burnoutMin": 60 },
    "art": "ev_n3_body_keeps_score",
    "context": "A doctor’s office, finally",
    "prompt": "The years of it — the vans, the 3 a.m. loads, the ignored aches — arrive all at once. The doctor is kind and specific: “You can keep going like this, but the body is keeping score, and it does not forgive.”",
    "recap": "At the doctor’s, finally: the body has been keeping score.",
    "tags": ["rest", "home"],
    "choices": {
      "left": {
        "label": "Actually take care of yourself",
        "governingStats": { "cred": 1 },
        "tags": ["rest", "safe"],
        "outcomes": {
          "bad": {
            "text": "You rest, badly, checking email the whole time. The guilt is louder than the pain was. But the numbers improve, grudgingly.",
            "effects": { "burnout": -12, "cred": 3 }
          },
          "good": {
            "text": "You build in the boring boundaries — sleep, stretch, no. It’s unglamorous and it saves the whole rest of the run.",
            "effects": { "burnout": -20, "cred": 4, "skill": 3 }
          },
          "incredible": {
            "text": "You overhaul how you do this, entirely, and come out the other side stronger than the grind ever made you. A second wind you earned.",
            "effects": { "burnout": -28, "cred": 5, "skill": 4 }
          }
        }
      },
      "right": {
        "label": "Ignore it, chase the summit",
        "governingStats": { "skill": 1 },
        "tags": ["work", "risky"],
        "outcomes": {
          "bad": {
            "text": "You push through the warning and the body escalates its case. This close to the top, and your own hands are filing complaints.",
            "effects": { "skill": 3, "fame": 5, "burnout": 10 }
          },
          "good": {
            "text": "You gamble your health for the momentum and, this time, the momentum wins. You’ll pay for it later. Later isn’t now.",
            "effects": { "skill": 5, "fame": 8, "money": 100, "burnout": 6 }
          },
          "incredible": {
            "text": "You burn the candle at both ends and somehow catch lightning — the run of your life, powered by borrowed time. Magnificent. Reckless.",
            "effects": { "skill": 7, "fame": 12, "cred": 4, "burnout": 5 }
          }
        }
      }
    }
  },
  {
    "id": "n3_faded_returns",
    "act": 3,
    "pathAffinity": [],
    "weight": 10,
    "requires": { "fadedMin": 1 },
    "art": "ev_n3_faded_returns",
    "context": "A TV show, a needle drop",
    "prompt": "A prestige TV show uses {fadedSong} — your one that charted and vanished — in its emotional season finale. Overnight, a song you’d made peace with losing is everywhere again, attached to a scene you didn’t write.",
    "recap": "A prestige TV finale drops {fadedSong}, and it’s everywhere again.",
    "tags": ["social", "deal"],
    "choices": {
      "left": {
        "label": "Ride the resurrection",
        "governingStats": { "network": 1 },
        "tags": ["social", "mainstream", "risky"],
        "outcomes": {
          "bad": {
            "text": "You lean all the way into the revival and the new fans only want {fadedSong}. You’re a legacy act for a song you barely remember writing.",
            "effects": { "network": 3, "fame": 8, "cred": -3, "money": 120 }
          },
          "good": {
            "text": "{fadedSong} charts again, higher this time, and you use the spotlight to point at your new work. A second life, spent wisely.",
            "effects": { "network": 5, "fame": 10, "cred": 3, "money": 200 }
          },
          "incredible": {
            "text": "The sync makes {fadedSong} bigger than it ever was, and the whole back catalog gets pulled up in its wake. The vanish was just intermission.",
            "effects": { "network": 6, "fame": 16, "cred": 4, "money": 350 }
          }
        }
      },
      "right": {
        "label": "Let it stay a memory",
        "governingStats": { "cred": 1, "creativity": 0.3 },
        "tags": ["indie", "safe"],
        "outcomes": {
          "bad": {
            "text": "You decline to capitalize and the moment passes, and part of you wonders if you just fumbled the last easy win of your career.",
            "effects": { "cred": 4, "burnout": 3 }
          },
          "good": {
            "text": "You let {fadedSong} have its quiet second moment without chasing it, and the dignity of that reads loud. Some things you don’t monetize.",
            "effects": { "cred": 7, "fame": 5, "creativity": 3 }
          },
          "incredible": {
            "text": "By refusing to milk it, you make {fadedSong}’s return feel like grace instead of a cash grab, and people love you more for the restraint.",
            "effects": { "cred": 8, "fame": 8, "creativity": 4 }
          }
        }
      }
    }
  },
  {
    "id": "n3_hometown_institution",
    "act": 3,
    "pathAffinity": [],
    "weight": 10,
    "requires": { "venueLevelMin": 3, "venueAny": true },
    "art": "ev_n3_hometown_institution",
    "context": "{venue}, which is basically yours now",
    "prompt": "{venue} — the room you built up show by show — wants to put your name on something permanent. A plaque, a booth, the whole back wall. The owner asks, a little emotional, what you want it to say.",
    "recap": "{venue} wants your name on something permanent — a plaque, the back wall.",
    "tags": ["home", "live"],
    "choices": {
      "left": {
        "label": "Make it about the room",
        "governingStats": { "cred": 1 },
        "tags": ["home", "safe"],
        "outcomes": {
          "bad": {
            "text": "You get modest about it and the plaque ends up tiny and generic. Humble to a fault, and slightly forgettable.",
            "effects": { "cred": 4, "fame": 3 }
          },
          "good": {
            "text": "You dedicate it to the room and everyone who ever played it, and it becomes a place that launches the NEXT you. Legacy as infrastructure.",
            "effects": { "cred": 7, "fame": 6, "network": 4, "venueLove": 1 }
          },
          "incredible": {
            "text": "You endow a permanent open slot at {venue} for unknowns, funded by you. The room becomes a machine for making the future. That’s the real monument.",
            "effects": { "cred": 9, "fame": 8, "network": 5, "venueLove": 1 }
          }
        }
      },
      "right": {
        "label": "Let them honor you",
        "governingStats": { "network": 1, "cred": 0.3 },
        "tags": ["fame", "mainstream"],
        "outcomes": {
          "bad": {
            "text": "The big plaque with your face on it feels premature and a little strange, like attending your own memorial. But the photos are nice.",
            "effects": { "fame": 5, "cred": 2 }
          },
          "good": {
            "text": "You accept the honor gracefully and the night becomes a genuine celebration. {venue} sells out a tribute show. To you.",
            "effects": { "fame": 9, "cred": 4, "money": 150, "venueLove": 1 }
          },
          "incredible": {
            "text": "The dedication night becomes an event that pulls everyone you ever played with back into the room. A living monument, packed and singing.",
            "effects": { "fame": 13, "cred": 5, "network": 5, "venueLove": 1 }
          }
        }
      }
    }
  },
  {
    "id": "n3_famous_and_broke",
    "act": 3,
    "pathAffinity": [],
    "weight": 10,
    "requires": { "moneyMax": 40 },
    "art": "ev_n3_famous_and_broke",
    "context": "The ATM, declining, while a fan asks for a photo",
    "prompt": "A stranger recognizes you and asks for a photo, thrilled, while the ATM behind you declines your card for the second time. Famous and broke at once — the industry’s specialty. You smile for the photo.",
    "recap": "A fan wants a photo while the ATM declines your card again.",
    "tags": ["deal", "work"],
    "choices": {
      "left": {
        "label": "Cash in the fame, finally",
        "governingStats": { "network": 1 },
        "tags": ["deal", "mainstream", "risky"],
        "outcomes": {
          "bad": {
            "text": "You take a brand deal that clashes with everything you stand for, and the money fixes the account and dings the soul. Rent won.",
            "effects": { "network": 3, "money": 250, "cred": -4 }
          },
          "good": {
            "text": "You finally monetize the reach — a smart endorsement, a merch push — and the gap between famous and solvent closes. About time.",
            "effects": { "network": 5, "money": 300, "fame": 3 }
          },
          "incredible": {
            "text": "You leverage the fame into something durable — equity, not a check — and the money problem doesn’t just resolve, it stops being a problem.",
            "effects": { "network": 6, "money": 450, "cred": 2 }
          }
        }
      },
      "right": {
        "label": "Stay broke and pure",
        "governingStats": { "cred": 1 },
        "tags": ["indie", "safe"],
        "outcomes": {
          "bad": {
            "text": "You refuse the easy money again and the account stays a rumor. The purity is real. So is the anxiety. Both keep you up.",
            "effects": { "cred": 4, "burnout": 4, "money": 30 }
          },
          "good": {
            "text": "You find a way to survive without selling out, on shows and grit, and the story of you doing it becomes part of why people love you.",
            "effects": { "cred": 7, "fame": 4, "money": 80 }
          },
          "incredible": {
            "text": "Your refusal to cash in becomes legendary, and a patron who respects exactly that quietly solves your money problem with no strings. Karma pays late but it pays.",
            "effects": { "cred": 8, "fame": 6, "money": 200 }
          }
        }
      }
    }
  },
  {
    "id": "n3_nemesis_toast",
    "act": 3,
    "pathAffinity": [],
    "weight": 10,
    "requires": { "nemesis": true },
    "art": "ev_n3_nemesis_toast",
    "context": "{rival}, at a podium, glass raised, third career running",
    "prompt": "Third career, same face across the room. At an industry dinner, {rival} — {rivalVibe} — is asked to toast you, and rises with a grin that is sixty percent warmth and forty percent open threat. Everyone leans in.",
    "recap": "At an industry dinner, {rival} rises to toast you, grinning like a threat.",
    "tags": ["fame", "rival"],
    "choices": {
      "left": {
        "label": "Toast them back, harder",
        "governingStats": { "network": 1, "creativity": 0.4 },
        "tags": ["fame", "risky", "rival"],
        "outcomes": {
          "bad": {
            "text": "You return the toast with a zinger that lands a beat too sharp. The room laughs nervously. {rival} smiles. The feud gets a new chapter.",
            "effects": { "network": 3, "fame": 5, "rivalry": 1 }
          },
          "good": {
            "text": "You match {rival} joke for joke and threat for threat, and the whole room realizes it’s watching two legends who made each other. Iconic.",
            "effects": { "network": 5, "fame": 9, "cred": 4, "rivalry": 1 }
          },
          "incredible": {
            "text": "Your counter-toast is so perfect it becomes industry lore. You and {rival} are, forever now, a package deal in the telling. The bit is eternal.",
            "effects": { "network": 7, "fame": 13, "cred": 5, "rivalry": 1 }
          }
        }
      },
      "right": {
        "label": "Disarm them with grace",
        "governingStats": { "cred": 1 },
        "tags": ["network", "safe", "rival"],
        "outcomes": {
          "bad": {
            "text": "You respond with genuine warmth and {rival} looks briefly lost, then recovers with a joke. The feud survives, but you seeded a doubt.",
            "effects": { "cred": 4, "fame": 4, "rivalry": -1 }
          },
          "good": {
            "text": "You publicly credit {rival} for pushing you all these years, and mean it, and the whole decades-long war finally exhales.",
            "effects": { "cred": 6, "fame": 7, "network": 4, "rivalry": -2 }
          },
          "incredible": {
            "text": "Your grace ends the feud in front of everyone. {rival} crosses the room and embraces you, and two careers of rivalry become one great story.",
            "effects": { "cred": 8, "fame": 10, "network": 5, "rivalry": -2 }
          }
        }
      }
    }
  },
  {
    "id": "n3_ghost_sessions",
    "act": 3,
    "pathAffinity": [],
    "weight": 10,
    "art": "ev_n3_ghost_sessions",
    "context": "A locked studio, an NDA, a very famous act",
    "prompt": "Word gets around that you play exactly the part nobody else can nail. Now the calls come with NDAs attached — anonymous session work for artists you cannot name, paying more than your own tours. The catch is the silence.",
    "recap": "Anonymous session work with NDAs attached, paying more than your tours.",
    "tags": ["studio", "work"],
    "choices": {
      "left": {
        "label": "Become the secret weapon",
        "minigame": "take",
        "governingStats": { "skill": 1 },
        "tags": ["studio", "work", "safe"],
        "outcomes": {
          "bad": {
            "text": "You ghost on three records nobody will ever know you touched. The money’s great and the anonymity gnaws. You made history invisibly.",
            "effects": { "skill": 4, "money": 150, "cred": -2, "grantHustle": "ghost_sessions" }
          },
          "good": {
            "text": "You become the first call for the parts that make hits, uncredited but essential. A steady, lucrative, secret excellence.",
            "effects": { "skill": 6, "money": 200, "network": 4, "grantHustle": "ghost_sessions" }
          },
          "incredible": {
            "text": "You’re on so many secret hits you’re basically the industry’s spine. The checks are enormous and the legend, among those who know, is total.",
            "effects": { "skill": 7, "money": 300, "network": 5, "cred": 3, "grantHustle": "ghost_sessions" }
          }
        }
      },
      "right": {
        "label": "Only play what you can sign",
        "governingStats": { "cred": 1, "creativity": 0.3 },
        "tags": ["studio", "risky", "indie"],
        "outcomes": {
          "bad": {
            "text": "You turn down the anonymous money to keep your name on your work, and watch a lesser player take the checks. Principle isn’t liquid.",
            "effects": { "cred": 4, "money": -20, "burnout": 3 }
          },
          "good": {
            "text": "You hold out for credited work and it comes — slower, smaller, but yours in the liner notes. Your name means something because you kept it visible.",
            "effects": { "cred": 6, "network": 4, "money": 100 }
          },
          "incredible": {
            "text": "Your insistence on credit becomes a stance the whole session world rallies behind, and suddenly the anonymous work starts offering credit to keep you. You changed the rules.",
            "effects": { "cred": 8, "network": 6, "money": 150 }
          }
        }
      }
    }
  },
  {
    "id": "n3_sample_packs",
    "act": 3,
    "pathAffinity": [],
    "weight": 9,
    "art": "ev_n3_sample_packs",
    "context": "A folder of field recordings and kitchen sounds",
    "prompt": "You’ve been recording everything for years — the good faucet, the specific rain, that one broken amp. A distributor says producers worldwide would pay for your library of sounds. Your junk drawer is, apparently, an asset.",
    "recap": "A distributor wants your library of field recordings and kitchen sounds.",
    "tags": ["deal", "record"],
    "choices": {
      "left": {
        "label": "Sell the sound library",
        "governingStats": { "creativity": 1, "network": 0.3 },
        "tags": ["deal", "record", "safe"],
        "outcomes": {
          "bad": {
            "text": "You package the sounds and they sell, modestly, to a few hundred producers who’ll never credit the faucet. Passive money, mild dissociation.",
            "effects": { "creativity": 3, "money": 90, "grantHustle": "sample_packs" }
          },
          "good": {
            "text": "Your sample packs become a producer favorite. That specific rain is on records you’ll never hear. Steady royalties from your ears.",
            "effects": { "creativity": 5, "money": 140, "network": 3, "grantHustle": "sample_packs" }
          },
          "incredible": {
            "text": "A chart hit is built entirely from your sounds, and the producer shouts you out. Your junk drawer is now a credit on a #1. The library sells itself.",
            "effects": { "creativity": 6, "money": 220, "fame": 4, "grantHustle": "sample_packs" }
          }
        }
      },
      "right": {
        "label": "Hoard them for your own work",
        "minigame": "mixdown",
        "governingStats": { "creativity": 1 },
        "tags": ["studio", "risky", "tone"],
        "outcomes": {
          "bad": {
            "text": "You keep the sounds private and spend a week building a track from the faucet and the rain. It’s indulgent and only you love it. That’s allowed.",
            "effects": { "creativity": 4, "burnout": 3 }
          },
          "good": {
            "text": "Your secret sound palette becomes your signature — nobody can copy a record made of your specific junk drawer. Sonic fingerprint.",
            "effects": { "creativity": 7, "cred": 4 }
          },
          "incredible": {
            "text": "The album you build from your private library sounds like nothing else alive, precisely because it’s made of your actual life. Unrepeatable.",
            "effects": { "creativity": 9, "cred": 5, "fame": 4 }
          }
        }
      }
    }
  },
  {
    "id": "n3_the_album",
    "act": 3,
    "pathAffinity": [],
    "weight": 10,
    "requires": { "demoMin": 2 },
    "art": "ev_n3_the_album",
    "context": "The vault, full, waiting for a decision",
    "prompt": "You have a vault of finished demos and the industry’s eternal question: dribble them out as singles for maximum chart mileage, or drop the whole thing at once as a real album and dare people to sit with it.",
    "recap": "A vault of finished demos: singles, or the whole album at once.",
    "tags": ["record", "deal"],
    "choices": {
      "left": {
        "label": "Drop the whole album",
        "governingStats": { "creativity": 1, "network": 0.4 },
        "tags": ["record", "risky"],
        "outcomes": {
          "bad": {
            "text": "You release everything at once and it’s a lot; a few songs shine and the rest blur together in the flood. Ambitious, slightly self-buried.",
            "effects": { "creativity": 4, "fame": 6, "albumDrop": 65 }
          },
          "good": {
            "text": "The album lands as a statement. People listen front to back, which nobody does anymore, and that alone makes it an event.",
            "effects": { "creativity": 6, "fame": 10, "cred": 5, "albumDrop": 70 }
          },
          "incredible": {
            "text": "The album drops and the culture stops to receive it. Every track in play at once, a full-length that reminds everyone what albums were for.",
            "effects": { "creativity": 8, "fame": 16, "cred": 6, "albumDrop": 75 }
          }
        }
      },
      "right": {
        "label": "Trickle the singles",
        "governingStats": { "network": 1 },
        "tags": ["deal", "mainstream", "safe"],
        "outcomes": {
          "bad": {
            "text": "You space the singles out for chart math and the momentum dies between drops. Optimized to death, one lonely release at a time.",
            "effects": { "network": 3, "fame": 5, "releaseDemo": 58 }
          },
          "good": {
            "text": "The single-by-single rollout keeps you on the chart for months, each drop a fresh spike. Patience, monetized.",
            "effects": { "network": 6, "fame": 9, "money": 120, "releaseDemo": 65 }
          },
          "incredible": {
            "text": "You play the release game masterfully — each single bigger than the last, building to a fever. By the third drop you own the season.",
            "effects": { "network": 7, "fame": 14, "cred": 3, "releaseDemo": 72 }
          }
        }
      }
    }
  },
  {
    "id": "n3_push_the_hit",
    "act": 3,
    "pathAffinity": [],
    "weight": 10,
    "requires": { "chartingMin": 1 },
    "art": "ev_n3_push_the_hit",
    "context": "{hitSong}, near the top, one push from #1",
    "prompt": "{hitSong} is climbing and there’s a real shot at #1 — the impossible thing, the summit of the summit. It would take everything: every favor, every dollar, every ounce of shame you have left. One push.",
    "recap": "{hitSong} is one push from #1, and it would cost everything.",
    "tags": ["social", "deal"],
    "choices": {
      "left": {
        "label": "Spend it all on the push",
        "governingStats": { "network": 1 },
        "tags": ["social", "mainstream", "risky"],
        "outcomes": {
          "bad": {
            "text": "You empty the tank pushing {hitSong} and it stalls at #2, agonizingly, forever. So close it will haunt the discography. Great song, cruel chart.",
            "effects": { "network": 3, "fame": 6, "money": -100, "hypeSong": 25 }
          },
          "good": {
            "text": "The all-out push works and {hitSong} cracks the top. Not quite #1, but higher than anything you dreamed at the open mic.",
            "effects": { "network": 5, "fame": 9, "cred": 3, "hypeSong": 30 }
          },
          "incredible": {
            "text": "Everything lines up — the push, the timing, the luck — and {hitSong} hits #1. One impossible week where the biggest song in the world is yours.",
            "effects": { "network": 7, "fame": 15, "cred": 5, "hypeSong": 30 }
          }
        }
      },
      "right": {
        "label": "Let the song do its work",
        "governingStats": { "cred": 1 },
        "tags": ["indie", "safe"],
        "outcomes": {
          "bad": {
            "text": "You refuse to game it and {hitSong} peaks where it peaks, honestly, a few rungs short. No regrets, some wistfulness. The song stays clean.",
            "effects": { "cred": 5, "fame": 4 }
          },
          "good": {
            "text": "You let {hitSong} climb on merit, and it climbs further than the cynics guessed. An honest hit ages better than a bought one.",
            "effects": { "cred": 7, "fame": 7, "network": 3 }
          },
          "incredible": {
            "text": "On pure word of mouth {hitSong} climbs and climbs, and the organic story becomes as famous as the song. An unbought #1 is the rarest thing there is.",
            "effects": { "cred": 9, "fame": 12, "network": 4 }
          }
        }
      }
    }
  },
  {
    "id": "n3_write_from_the_top",
    "act": 3,
    "pathAffinity": [],
    "weight": 9,
    "art": "ev_n3_write_from_the_top",
    "context": "A blank page, and everything to lose",
    "prompt": "You’ve made it far enough that writing feels different now — there’s an audience waiting, expectations to meet or defy. The blank page used to be freedom. Now it’s freedom AND a mirror. You sit down anyway.",
    "recap": "The blank page again, but now with an audience waiting.",
    "tags": ["write", "home"],
    "choices": {
      "left": {
        "label": "Write what got you here",
        "governingStats": { "skill": 1, "creativity": 0.4 },
        "tags": ["write", "safe"],
        "outcomes": {
          "bad": {
            "text": "You write to your own formula and it comes out competent and echoey, a cover of yourself. The audience will like it. You’re not sure you do.",
            "effects": { "skill": 3, "cred": 2, "writeSong": true }
          },
          "good": {
            "text": "You lean into your strengths, honed now to a fine point, and write something that sounds effortlessly like you at your best.",
            "effects": { "skill": 5, "cred": 4, "creativity": 3, "writeSong": true }
          },
          "incredible": {
            "text": "Every hour you ever put in shows up in one song — the accumulated craft of a whole career, distilled. It sounds simple. It took years.",
            "effects": { "skill": 7, "cred": 5, "fame": 3, "writeSong": true }
          }
        }
      },
      "right": {
        "label": "Burn the formula down",
        "minigame": "ideas",
        "governingStats": { "creativity": 1 },
        "tags": ["write", "risky", "indie"],
        "outcomes": {
          "bad": {
            "text": "You try to reinvent yourself and the result is a fascinating mess nobody asked for. Brave. Confusing. Possibly ahead of its time. Possibly not.",
            "effects": { "creativity": 4, "cred": 3, "burnout": 4 }
          },
          "good": {
            "text": "You throw out the playbook and find a new room in yourself. The song surprises even you, which hasn’t happened in a while.",
            "effects": { "creativity": 7, "cred": 5, "writeSong": true }
          },
          "incredible": {
            "text": "You reinvent your whole sound in a single fearless song, and it works so completely that it opens a second act to your career. Rebirth by page.",
            "effects": { "creativity": 9, "cred": 6, "fame": 5, "writeSong": true }
          }
        }
      }
    }
  },
  {
    "id": "n3_polish_the_vault",
    "act": 3,
    "pathAffinity": [],
    "weight": 9,
    "requires": { "demoMin": 1 },
    "art": "ev_n3_polish_the_vault",
    "context": "The best unreleased thing you have",
    "prompt": "There’s a demo in the vault you know is special, the kind that only comes once every few years. It’s not ready. It could be, with the kind of obsessive attention you rarely let yourself afford anymore.",
    "recap": "The special demo in the vault that isn’t ready yet.",
    "tags": ["studio", "write"],
    "choices": {
      "left": {
        "label": "Obsess over it",
        "minigame": "mixdown",
        "governingStats": { "skill": 1, "creativity": 0.4 },
        "tags": ["studio", "safe", "tone"],
        "outcomes": {
          "bad": {
            "text": "You polish it for weeks and lose perspective entirely; is it perfect or ruined? You genuinely cannot tell anymore. You set it down, shaking slightly.",
            "effects": { "skill": 3, "burnout": 4, "polishDemo": 5 }
          },
          "good": {
            "text": "The obsession pays. You find the last five percent that separates good from unforgettable, and the demo becomes a real weapon.",
            "effects": { "skill": 6, "cred": 4, "polishDemo": 9 }
          },
          "incredible": {
            "text": "You polish it to a diamond. When it finally comes out, people will assume it was easy. It was the opposite of easy, and worth every hour.",
            "effects": { "skill": 7, "cred": 5, "creativity": 3, "polishDemo": 12 }
          }
        }
      },
      "right": {
        "label": "Leave it rough on purpose",
        "governingStats": { "cred": 1 },
        "tags": ["indie", "risky"],
        "outcomes": {
          "bad": {
            "text": "You leave the rough edges and half of them are charm and half are just rough. The line between raw and unfinished is thinner than you hoped.",
            "effects": { "cred": 3, "creativity": 3 }
          },
          "good": {
            "text": "The roughness is the soul of it, and you’re wise enough now to leave it alone. Not everything wants to be polished into a mirror.",
            "effects": { "cred": 6, "creativity": 4 }
          },
          "incredible": {
            "text": "The unpolished demo, released as-is, becomes beloved precisely for its rawness — the sound of a master confident enough to leave the dust on.",
            "effects": { "cred": 8, "creativity": 5, "fame": 3 }
          }
        }
      }
    }
  },
  {
    "id": "n3_bs_cassette_wall",
    "act": 3,
    "pathAffinity": [],
    "weight": 11,
    "requires": { "bandHas": "cassette" },
    "art": "ev_bs_cassette",
    "context": "Cassette, in front of the wall of flops",
    "prompt": "Cassette’s apartment is a shrine to commercial failures — walls of records that flopped and shouldn’t have. Tonight they pull one down, then point at your own catalog on the shelf below. “Same energy,” they say. “Wanna know why these died?”",
    "recap": "Cassette’s wall of flops, and your catalog on the shelf below.",
    "tags": ["band", "record"],
    "choices": {
      "left": {
        "label": "Learn from the flops",
        "governingStats": { "creativity": 1, "cred": 0.3 },
        "tags": ["record", "safe", "band"],
        "outcomes": {
          "bad": {
            "text": "Cassette lectures for four hours about doomed masterpieces and you leave dizzy, unsure if you learned anything or just got sad about music.",
            "effects": { "creativity": 3, "cred": 3, "burnout": 3 }
          },
          "good": {
            "text": "Cassette shows you the pattern — great records killed by bad timing, bad labels, bad luck — and you finally understand your own near-misses. Clarity.",
            "effects": { "creativity": 6, "cred": 5, "skill": 3 }
          },
          "incredible": {
            "text": "The wall of flops teaches you the one thing school couldn’t: how to protect a good song from the machine. You’ll never lose one the same way again.",
            "effects": { "creativity": 8, "cred": 6, "network": 3 }
          }
        }
      },
      "right": {
        "label": "Reissue one of the lost ones",
        "governingStats": { "network": 1, "creativity": 0.3 },
        "tags": ["deal", "risky", "band"],
        "outcomes": {
          "bad": {
            "text": "You champion one of Cassette’s beloved flops and it flops again. Some records are just cursed. But Cassette weeps with gratitude that someone tried.",
            "effects": { "network": 3, "cred": 4, "money": -40 }
          },
          "good": {
            "text": "You use your platform to reissue a forgotten gem from the wall, and it finds the audience it deserved thirty years too late. Cassette is vindicated.",
            "effects": { "network": 5, "cred": 6, "fame": 4 }
          },
          "incredible": {
            "text": "The lost record you resurrect becomes a genuine phenomenon, and the original artist — alive, astonished — gets their due at last. You turned a flop into justice.",
            "effects": { "network": 7, "cred": 7, "fame": 6 }
          }
        }
      }
    }
  },
  {
    "id": "n3_bs_gus_board",
    "act": 3,
    "pathAffinity": [],
    "weight": 11,
    "requires": { "bandHas": "gus" },
    "art": "ev_bs_gus",
    "context": "Gus, at the board, the biggest night yet",
    "prompt": "Gus mixed every band in town for a decade before joining yours, and tonight — the biggest show of your life — he’s finally at the board for YOU. He cracks his knuckles. “Been waiting my whole career to make this room sound like you deserve.”",
    "recap": "Biggest show of your life, and Gus is finally at the board.",
    "tags": ["band", "tone"],
    "choices": {
      "left": {
        "label": "Trust Gus completely",
        "governingStats": { "skill": 1 },
        "tags": ["live", "safe", "band", "tone"],
        "outcomes": {
          "bad": {
            "text": "You give Gus full control and the mix is flawless, so flawless that a string breaks and Gus catches it before you do. He saves the night from the shadows.",
            "effects": { "skill": 4, "fame": 5, "burnout": 3 }
          },
          "good": {
            "text": "Gus makes the room sound like the record and the record sound like a dream. For once, every note reaches every seat exactly as you meant it.",
            "effects": { "skill": 6, "fame": 8, "cred": 4 }
          },
          "incredible": {
            "text": "Gus mixes the show of a lifetime — the sound so perfect people cry at songs they’ve heard a hundred times. He earned this. So did you.",
            "effects": { "skill": 7, "fame": 12, "cred": 5, "network": 3 }
          }
        }
      },
      "right": {
        "label": "Push Gus somewhere new",
        "governingStats": { "creativity": 1, "skill": 0.3 },
        "tags": ["live", "risky", "tone"],
        "outcomes": {
          "bad": {
            "text": "You ask Gus to try something wild with the mix live and it half-works; the experiment is audible and so is the risk. Gus grins anyway. He loves a swing.",
            "effects": { "creativity": 3, "fame": 4, "burnout": 4 }
          },
          "good": {
            "text": "You and Gus invent a sound on the fly that nobody in the room has heard before. Ten years of his craft, plus one dangerous idea, equals magic.",
            "effects": { "creativity": 7, "fame": 8, "cred": 4 }
          },
          "incredible": {
            "text": "The experimental mix you and Gus pull off becomes the thing people describe for years — “you had to be there.” The board was an instrument and Gus played it.",
            "effects": { "creativity": 9, "fame": 12, "cred": 6 }
          }
        }
      }
    }
  },
  {
    "id": "n3_biopic_offer",
    "act": 3,
    "pathAffinity": [],
    "weight": 9,
    "requires": { "fameMin": 60 },
    "art": "ev_n3_biopic_offer",
    "context": "A producer, a treatment, an actor already attached",
    "prompt": "Someone wants to make a movie about you. There’s a treatment, a name actor circling, and a version of your life on the page that is eighty percent true and one hundred percent flattering. It is deeply strange to read your own myth.",
    "recap": "A biopic treatment, an actor circling, your myth on the page.",
    "tags": ["deal", "fame"],
    "choices": {
      "left": {
        "label": "Let them make the myth",
        "governingStats": { "network": 1 },
        "tags": ["deal", "mainstream", "risky"],
        "outcomes": {
          "bad": {
            "text": "The biopic sands off every interesting edge into a tidy inspirational arc. Millions will “know” a you that never existed. The check is very large.",
            "effects": { "network": 3, "money": 350, "fame": 8, "cred": -4 }
          },
          "good": {
            "text": "The film is flattering but not dishonest, and it introduces your music to a generation that missed it live. Myth as marketing, done well.",
            "effects": { "network": 5, "money": 300, "fame": 12 }
          },
          "incredible": {
            "text": "The biopic is actually good — it captures something true — and it makes you a household name and drives everyone back to the real records. Rare win.",
            "effects": { "network": 6, "money": 400, "fame": 18, "cred": 2 }
          }
        }
      },
      "right": {
        "label": "Insist on the truth",
        "governingStats": { "cred": 1, "creativity": 0.3 },
        "tags": ["indie", "risky"],
        "outcomes": {
          "bad": {
            "text": "You demand a truthful version and the producers walk; “nobody wants the messy one.” The movie dies. Your integrity, expensive as ever, survives.",
            "effects": { "cred": 5, "money": -20, "burnout": 3 }
          },
          "good": {
            "text": "You fight for the honest version and get a smaller, truer film. Critics love it, it makes less money, and you can watch it without wincing. Worth it.",
            "effects": { "cred": 7, "fame": 6, "creativity": 3 }
          },
          "incredible": {
            "text": "Your insistence on truth yields a film so raw and real it becomes a classic — the anti-biopic — and does what the flattering version never could: it lasts.",
            "effects": { "cred": 9, "fame": 10, "creativity": 4 }
          }
        }
      }
    }
  },
  {
    "id": "n3_young_band_furniture",
    "act": 3,
    "pathAffinity": [],
    "weight": 9,
    "art": "ev_n3_young_band_furniture",
    "context": "Backstage, being talked past",
    "prompt": "A hot young band shares the bill and treats you like part of the venue’s decor — polite, dismissive, certain they invented all of this. You recognize the certainty. You wore it once. It looks different from this side.",
    "recap": "A hot young band on the bill treats you like the venue’s decor.",
    "tags": ["live", "network"],
    "choices": {
      "left": {
        "label": "School them on stage",
        "minigame": "crowd",
        "governingStats": { "skill": 1, "cred": 0.4 },
        "tags": ["live", "risky"],
        "outcomes": {
          "bad": {
            "text": "You try to blow the kids off the stage and pull a muscle proving a point nobody was contesting. The young band claps, condescendingly.",
            "effects": { "skill": 3, "fame": 4, "burnout": 6 }
          },
          "good": {
            "text": "You play a set so deep and assured the young band goes quiet and actually watches. Respect, taught the only way that sticks.",
            "effects": { "skill": 6, "fame": 7, "cred": 5 }
          },
          "incredible": {
            "text": "You give a masterclass that the young band will describe, humbled, in interviews for years. They came in cocky and left disciples. Class dismissed.",
            "effects": { "skill": 8, "fame": 11, "cred": 6, "network": 3 }
          }
        }
      },
      "right": {
        "label": "Take them under your wing",
        "governingStats": { "network": 1, "cred": 0.3 },
        "tags": ["network", "safe", "band"],
        "outcomes": {
          "bad": {
            "text": "You offer wisdom and they don’t want it yet, the way you didn’t. You leave a door open they’ll find in a few hard years. That’s the job.",
            "effects": { "network": 3, "cred": 3 }
          },
          "good": {
            "text": "One of the kids actually listens, and you become the mentor you once needed. The scene renews itself through exactly this. Full circle.",
            "effects": { "network": 6, "cred": 5, "fame": 3 }
          },
          "incredible": {
            "text": "You mentor the young band into something great, and they credit you at every turn. Being someone’s foundation turns out to be its own kind of summit.",
            "effects": { "network": 8, "cred": 6, "fame": 5 }
          }
        }
      }
    }
  },
  {
    "id": "n3_coast_temptation",
    "act": 3,
    "pathAffinity": [],
    "weight": 10,
    "art": "ev_n3_coast_temptation",
    "context": "The easy road, clearly marked",
    "prompt": "You could coast now. Play the hits, take the safe bookings, ride the name you built for a comfortable decade. The offer is right there, warm and undemanding. The other road is uphill and unmarked and yours.",
    "recap": "The comfortable road, warm and undemanding, versus the uphill one.",
    "tags": ["deal", "work"],
    "choices": {
      "left": {
        "label": "Take the comfortable road",
        "governingStats": { "network": 1 },
        "tags": ["mainstream", "safe"],
        "outcomes": {
          "bad": {
            "text": "You coast, and it’s comfortable, and something quietly goes out of the music that the crowd can hear even when you can’t. Fine is a kind of ending.",
            "effects": { "network": 3, "money": 200, "cred": -3, "burnout": -4 }
          },
          "good": {
            "text": "You take the steady road and it funds a real life — house, health, peace. Not every ending needs to be a blaze. Some are just warm.",
            "effects": { "network": 5, "money": 300, "burnout": -6 }
          },
          "incredible": {
            "text": "You coast smart, banking security while keeping one hand in the good stuff, and build a sustainable version of the dream that outlasts the flashier ones.",
            "effects": { "network": 6, "money": 350, "cred": 2, "burnout": -5 }
          }
        }
      },
      "right": {
        "label": "Take the uphill road",
        "governingStats": { "creativity": 1, "skill": 0.3 },
        "tags": ["indie", "risky"],
        "outcomes": {
          "bad": {
            "text": "You choose the hard road and it’s hard, and the reward is uncertain, and some nights you envy the coasters. But you’re still climbing. That counts.",
            "effects": { "creativity": 4, "cred": 4, "burnout": 6 }
          },
          "good": {
            "text": "You refuse to coast and it keeps you sharp, hungry, alive in the work. The uphill road is lonelier and the view keeps getting better.",
            "effects": { "creativity": 6, "cred": 6, "skill": 3 }
          },
          "incredible": {
            "text": "You take the hard road and it leads somewhere nobody expected — a late-career peak that redefines what you’re capable of. The climb was the point.",
            "effects": { "creativity": 8, "cred": 7, "fame": 5 }
          }
        }
      }
    }
  },
  {
    "id": "n3_gear_indulgence",
    "act": 3,
    "pathAffinity": [],
    "weight": 10,
    "shop": true,
    "art": "ev_n3_gear_indulgence",
    "context": "The vintage shop you could never afford",
    "prompt": "The high-end vintage shop — the one you used to press your face against — now knows your name. There’s a piece in the window you’ve wanted your entire life. You can, at last, actually afford it. Probably. Mostly.",
    "recap": "The grail in the vintage-shop window you can finally afford.",
    "tags": ["deal", "shop"],
    "choices": {
      "left": {
        "label": "Buy the grail",
        "cost": 300,
        "governingStats": { "creativity": 1 },
        "tags": ["deal", "tone", "safe"],
        "outcomes": {
          "bad": {
            "text": "You buy the dream piece and it’s glorious and you feel briefly, expensively hollow. The thing you wanted for twenty years is just a thing. A beautiful thing.",
            "effects": { "money": -300, "creativity": 3, "cred": 3 }
          },
          "good": {
            "text": "The grail delivers. It reshapes how you play, unlocks tones you’d only imagined. Some purchases are just correct.",
            "effects": { "money": -300, "creativity": 6, "cred": 4, "grantGear": "random_good" }
          },
          "incredible": {
            "text": "The instrument you dreamed of for decades becomes the voice of your late work. Worth every dollar and every year of wanting. The kid at the window would weep.",
            "effects": { "money": -300, "creativity": 8, "cred": 5, "fame": 3, "grantGear": "random_good" }
          }
        }
      },
      "right": {
        "label": "Walk past it, again",
        "governingStats": { "cred": 1 },
        "tags": ["indie", "safe"],
        "outcomes": {
          "bad": {
            "text": "You walk past the grail on principle and spend the walk home arguing with yourself. The principle wins, narrowly, and sulks the whole way.",
            "effects": { "cred": 3, "money": 40 }
          },
          "good": {
            "text": "You leave the fancy piece behind and remember your best work was made on garbage anyway. The tool was never the talent. You save the money.",
            "effects": { "cred": 6, "money": 80, "creativity": 2 }
          },
          "incredible": {
            "text": "You skip the grail and, freed of the fixation, make something transcendent on the beat-up gear you already own. The lesson lands: it was always you.",
            "effects": { "cred": 8, "money": 100, "creativity": 4 }
          }
        }
      }
    }
  },
  {
    "id": "n3_legacy_medley",
    "act": 3,
    "pathAffinity": [],
    "weight": 9,
    "requires": { "songsMin": 3 },
    "art": "ev_n3_legacy_medley",
    "context": "A career’s worth of songs, and forty minutes",
    "prompt": "A retrospective show, and you have to distill years of songs into one set. Every song you cut is a fan’s favorite. Every song you keep is a version of yourself you’re choosing to be, one more night.",
    "recap": "A retrospective set: years of songs down to forty minutes.",
    "tags": ["live", "fame"],
    "choices": {
      "left": {
        "label": "Play the crowd favorites",
        "governingStats": { "skill": 1, "network": 0.3 },
        "tags": ["live", "mainstream", "safe"],
        "outcomes": {
          "bad": {
            "text": "You play the hits and only the hits and it’s a jukebox of yourself, satisfying and slightly sad. The crowd sings along to the museum.",
            "effects": { "skill": 4, "fame": 6, "burnout": 3 }
          },
          "good": {
            "text": "You give the people what they came for, played with real love, and the night is a warm communal celebration of a whole career. Deserved.",
            "effects": { "skill": 5, "fame": 9, "cred": 3 }
          },
          "incredible": {
            "text": "You play the hits like you’re discovering them, and a greatest-hits set becomes a revelation instead of a rerun. The old songs breathe new.",
            "effects": { "skill": 6, "fame": 13, "cred": 4 }
          }
        }
      },
      "right": {
        "label": "Play the songs that matter to you",
        "governingStats": { "creativity": 1, "cred": 0.3 },
        "tags": ["live", "risky", "indie"],
        "outcomes": {
          "bad": {
            "text": "You play the deep cuts you love and the crowd politely waits for the hits that never come. An honest set to a slightly disappointed room.",
            "effects": { "creativity": 4, "cred": 4, "burnout": 4 }
          },
          "good": {
            "text": "You play the songs that made you, hits or not, and the real fans — the ones who know everything — have the night of their lives.",
            "effects": { "creativity": 6, "cred": 6, "fame": 4 }
          },
          "incredible": {
            "text": "Your idiosyncratic setlist reintroduces the crowd to your actual body of work, and by the end they love the deep cuts as much as you do. You changed what your legacy means.",
            "effects": { "creativity": 8, "cred": 7, "fame": 6 }
          }
        }
      }
    }
  },
  {
    "id": "n3_streaming_empire",
    "act": 3,
    "pathAffinity": [],
    "weight": 8,
    "requires": { "hustleMin": 2 },
    "art": "ev_n3_streaming_empire",
    "context": "A dashboard of a dozen income streams",
    "prompt": "The side hustles have quietly compounded into something that looks alarmingly like a small business. An advisor suggests you could formalize it — an LLC, a brand, an empire of little revenue streams. You just wanted to play music.",
    "recap": "The side hustles have compounded into something like a business.",
    "tags": ["deal", "work"],
    "choices": {
      "left": {
        "label": "Build the empire",
        "governingStats": { "network": 1 },
        "tags": ["deal", "work", "risky"],
        "outcomes": {
          "bad": {
            "text": "You incorporate and suddenly you’re in meetings about yourself. The empire runs; you spend less time playing than managing the machine that plays you.",
            "effects": { "network": 4, "money": 250, "burnout": 5, "cred": -2 }
          },
          "good": {
            "text": "You formalize the hustles into a real business that funds the art without swallowing it. Security, structured. The music gets to stay the point.",
            "effects": { "network": 6, "money": 350 }
          },
          "incredible": {
            "text": "You build a durable little empire that pays you to make exactly what you want forever. The freest artists, it turns out, own their own infrastructure.",
            "effects": { "network": 7, "money": 450, "cred": 3, "creativity": 3 }
          }
        }
      },
      "right": {
        "label": "Keep it a side thing",
        "governingStats": { "creativity": 1 },
        "tags": ["indie", "safe"],
        "outcomes": {
          "bad": {
            "text": "You refuse to become a CEO and leave money on the table, and the hustles stay charmingly disorganized. Poorer, freer, mildly chaotic.",
            "effects": { "creativity": 3, "money": 60 }
          },
          "good": {
            "text": "You keep the business small on purpose so the music stays first, and it works — enough income, no empire, all your time still yours.",
            "effects": { "creativity": 6, "cred": 4, "money": 120 }
          },
          "incredible": {
            "text": "By refusing to scale, you protect the exact thing the empire would’ve killed, and make your best late work in the time you didn’t spend in meetings. Wealth is time.",
            "effects": { "creativity": 8, "cred": 5, "money": 100 }
          }
        }
      }
    }
  },
  {
    "id": "n3_fan_generations",
    "act": 3,
    "pathAffinity": [],
    "weight": 9,
    "requires": { "fameMin": 55 },
    "art": "ev_n3_fan_generations",
    "context": "A parent and a kid, both wearing your shirt",
    "prompt": "A parent brings their kid to your show, both in your merch across two decades. The parent found you in college; the kid found you last month. You are now, somehow, a thing that gets handed down. It’s a lot to hold.",
    "recap": "A parent and their kid at your show, both in your merch.",
    "tags": ["live", "family"],
    "choices": {
      "left": {
        "label": "Play for the whole lineage",
        "governingStats": { "cred": 1, "skill": 0.3 },
        "tags": ["live", "family", "safe"],
        "outcomes": {
          "bad": {
            "text": "You try to play to both generations and split the difference into something that reaches neither cleanly. Ambitious, slightly muddled. They still hug you after.",
            "effects": { "cred": 4, "fame": 5, "burnout": 3 }
          },
          "good": {
            "text": "You weave old and new so the parent and the kid each hear their era, and the shared moment between them is the real show. Music as inheritance.",
            "effects": { "cred": 6, "fame": 8, "network": 3 }
          },
          "incredible": {
            "text": "You give a set that means something completely different and completely whole to both generations at once. The parent cries; the kid gets it; you become permanent.",
            "effects": { "cred": 8, "fame": 12, "creativity": 4 }
          }
        }
      },
      "right": {
        "label": "Write the next generation’s song",
        "governingStats": { "creativity": 1 },
        "tags": ["write", "risky"],
        "outcomes": {
          "bad": {
            "text": "You chase the young audience with something new and it strains, a veteran reaching for a youth that isn’t quite yours to claim. Noble, slightly awkward.",
            "effects": { "creativity": 3, "fame": 4, "burnout": 4 }
          },
          "good": {
            "text": "You write something that speaks to the kid without abandoning the parent, and it becomes the bridge song your whole catalog needed.",
            "effects": { "creativity": 6, "cred": 4, "fame": 5, "writeSong": true }
          },
          "incredible": {
            "text": "You write a song that a new generation adopts as its own, not knowing or caring it came from a veteran. You’re handed down again, freshly. Immortality, renewed.",
            "effects": { "creativity": 8, "cred": 5, "fame": 8, "writeSong": true }
          }
        }
      }
    }
  },
  {
    "id": "n3_the_offer_to_quit",
    "act": 3,
    "pathAffinity": [],
    "weight": 9,
    "requires": { "burnoutMin": 50 },
    "art": "ev_n3_the_offer_to_quit",
    "context": "A great job, a clean exit, right now",
    "prompt": "An old friend offers you a real job — good pay, health insurance, a door you could walk through today and never load a van again. It’s not a trap. It’s a genuinely good life, held out with genuine care. You could just… stop.",
    "recap": "An old friend offers a real job — pay, insurance, a clean exit.",
    "tags": ["deal", "home"],
    "choices": {
      "left": {
        "label": "Almost take it — then don’t",
        "governingStats": { "cred": 1 },
        "tags": ["home", "risky"],
        "outcomes": {
          "bad": {
            "text": "You seriously consider it, which shakes something loose, and then say no and spend a week wondering if you’re brave or just stubborn. The van waits.",
            "effects": { "cred": 4, "burnout": 5 }
          },
          "good": {
            "text": "Staring down the exit clarifies everything: you don’t do this because you can’t stop, you do it because you choose it. You choose it again, clear-eyed.",
            "effects": { "cred": 6, "creativity": 4, "burnout": -3 }
          },
          "incredible": {
            "text": "Turning down the safe life re-lights the whole fire. You come back to the music having chosen it freely, and it shows in every note. Recommitment as rebirth.",
            "effects": { "cred": 7, "creativity": 6, "fame": 3, "burnout": -4 }
          }
        }
      },
      "right": {
        "label": "Use it as leverage for balance",
        "governingStats": { "network": 1 },
        "tags": ["deal", "safe"],
        "outcomes": {
          "bad": {
            "text": "You take the friend’s offer part-time to stabilize, and the split life is exhausting in a new way. Solvent, sane-ish, spread thin. It’s a trade.",
            "effects": { "network": 3, "money": 150, "burnout": 3 }
          },
          "good": {
            "text": "You build a hybrid — steady income, part-time music — and for the first time in years the money fear quiets enough to hear the songs again.",
            "effects": { "network": 5, "money": 200, "burnout": -6, "creativity": 3 }
          },
          "incredible": {
            "text": "The security frees you completely. With rent handled, you make the fearless art you never could when the music had to pay the bills. Freedom, financed.",
            "effects": { "network": 6, "money": 250, "creativity": 6, "burnout": -5 }
          }
        }
      }
    }
  },
  {
    "id": "n3_tribute_night",
    "act": 3,
    "pathAffinity": [],
    "weight": 9,
    "art": "ev_n3_tribute_night",
    "context": "A bar advertising “A Tribute To You”",
    "prompt": "You walk past a bar with a sign: a whole night of local bands covering your songs. You weren’t invited; you weren’t supposed to see it. Do you slip in the back and witness your own influence, or protect the mystery?",
    "recap": "A bar sign: a night of local bands covering your songs.",
    "tags": ["live", "social"],
    "choices": {
      "left": {
        "label": "Slip in and watch",
        "governingStats": { "cred": 1 },
        "tags": ["live", "safe"],
        "outcomes": {
          "bad": {
            "text": "You watch from the back as bands mangle your songs with total love, and it’s equal parts flattering and excruciating. You leave before the encore. They meant well.",
            "effects": { "cred": 4, "fame": 3, "burnout": 2 }
          },
          "good": {
            "text": "You witness a room full of people who learned your songs by heart, and it lands as the realest measure of a career: other people carrying it forward.",
            "effects": { "cred": 6, "fame": 5, "network": 3 }
          },
          "incredible": {
            "text": "You’re spotted, pulled on stage for one song with a band of strangers who worship you, and the night becomes an instant legend. Your influence, made flesh.",
            "effects": { "cred": 7, "fame": 10, "network": 4 }
          }
        }
      },
      "right": {
        "label": "Let it be theirs",
        "governingStats": { "creativity": 1 },
        "tags": ["indie", "safe"],
        "outcomes": {
          "bad": {
            "text": "You keep walking and never see it, and wonder later what it was like. The mystery you preserved is also a moment you’ll never get back. Both true.",
            "effects": { "creativity": 3, "cred": 3 }
          },
          "good": {
            "text": "You let the tribute belong to the people throwing it, uncrashed and pure, and there’s a quiet grace in not needing to be at your own party.",
            "effects": { "creativity": 5, "cred": 5 }
          },
          "incredible": {
            "text": "You leave it entirely to them and, hearing about it later, are moved past words that your work took on a life without you in the room. That’s the whole dream, actually.",
            "effects": { "creativity": 7, "cred": 6, "fame": 4 }
          }
        }
      }
    }
  },
  {
    "id": "n3_final_collab",
    "act": 3,
    "pathAffinity": [],
    "weight": 9,
    "requires": { "fameMin": 50 },
    "art": "ev_n3_final_collab",
    "context": "A hero, aging, extends a hand",
    "prompt": "An artist you idolized your whole life — now old, now mortal — reaches out to make one song together while there’s still time. It’s the collaboration your teenage self would not have survived hearing about. The stakes are your whole heart.",
    "recap": "The hero you idolized, now old, wants one song before it’s too late.",
    "tags": ["studio", "write"],
    "choices": {
      "left": {
        "label": "Make the perfect song",
        "minigame": "take",
        "governingStats": { "skill": 1, "creativity": 0.4 },
        "tags": ["studio", "safe"],
        "outcomes": {
          "bad": {
            "text": "You’re so awed you play it safe, and the song is lovely and cautious, a duet where you never quite let yourself be an equal. Still, it exists. That’s the miracle.",
            "effects": { "skill": 4, "cred": 4, "fame": 6 }
          },
          "good": {
            "text": "You meet your hero as a peer at last and the song is everything it should be — two masters, one moment, captured before the window closed.",
            "effects": { "skill": 6, "cred": 6, "fame": 9 }
          },
          "incredible": {
            "text": "The collaboration becomes an instant classic, a passing-of-the-torch the whole world feels. Your hero smiles at you like an equal. Your teenage self ascends.",
            "effects": { "skill": 7, "cred": 7, "fame": 14, "network": 4 }
          }
        }
      },
      "right": {
        "label": "Make the honest song",
        "governingStats": { "creativity": 1, "cred": 0.3 },
        "tags": ["write", "risky", "indie"],
        "outcomes": {
          "bad": {
            "text": "You push for something raw and real and your hero, tired, wanted something gentler. You compromise into a song that’s neither of yours. It aches a little.",
            "effects": { "creativity": 3, "cred": 4, "fame": 5 }
          },
          "good": {
            "text": "You write something true instead of something perfect, and your hero lights up — this is the collaborator they hoped you’d be. Honesty over reverence.",
            "effects": { "creativity": 6, "cred": 6, "fame": 7, "writeSong": true }
          },
          "incredible": {
            "text": "The two of you make something braver than either could alone — a final statement that redefines both your legacies. Your hero says “thank you” and means all of it.",
            "effects": { "creativity": 9, "cred": 7, "fame": 12, "writeSong": true }
          }
        }
      }
    }
  },
  {
    "id": "n3_the_interview_hard",
    "act": 3,
    "pathAffinity": [],
    "weight": 9,
    "art": "ev_n3_the_interview_hard",
    "context": "A journalist, a hard question, a recorder running",
    "prompt": "A serious profile, and the journalist asks the question you’ve dodged your whole career — about the compromise you made early, the one everyone suspects and nobody’s proven. The recorder is running. Honesty has a cost and so does the dodge.",
    "recap": "A profile, a recorder running, the early compromise you’ve dodged.",
    "tags": ["social", "network"],
    "choices": {
      "left": {
        "label": "Tell the truth, finally",
        "minigame": "interview",
        "governingStats": { "cred": 1 },
        "tags": ["social", "risky"],
        "outcomes": {
          "bad": {
            "text": "You come clean and the internet takes the ugly half without the context. For a week you’re the story instead of the music. But the weight is off you.",
            "effects": { "cred": 5, "fame": 3, "burnout": 4 }
          },
          "good": {
            "text": "You tell it straight, context and all, and the honesty reframes the whole compromise as human. People respect the artist who owns their history.",
            "effects": { "cred": 7, "fame": 5, "network": 3 }
          },
          "incredible": {
            "text": "Your candor is so complete and so unashamed it becomes a masterclass in accountability. The thing you feared for years becomes the most respected moment of your career.",
            "effects": { "cred": 9, "fame": 8, "network": 4 }
          }
        }
      },
      "right": {
        "label": "Keep the mystery",
        "governingStats": { "network": 1, "cred": 0.3 },
        "tags": ["mainstream", "safe"],
        "outcomes": {
          "bad": {
            "text": "You deflect smoothly and the question dies, but the journalist noticed the deflection, and the piece has a knowing tone that follows you. Some doors stay ajar.",
            "effects": { "network": 3, "fame": 3, "cred": -2 }
          },
          "good": {
            "text": "You keep the private thing private with grace, redirecting to the work, and the mystery stays intact. Not every story is owed to everyone.",
            "effects": { "network": 5, "cred": 3, "fame": 3 }
          },
          "incredible": {
            "text": "You turn the hard question into a meditation on what artists owe the public, so eloquently that the dodge itself becomes the quotable, admired thing. Masterful.",
            "effects": { "network": 6, "cred": 5, "fame": 5 }
          }
        }
      }
    }
  },
  {
    "id": "n3_off_the_grid_write",
    "act": 3,
    "pathAffinity": [],
    "weight": 9,
    "art": "ev_n3_off_the_grid_write",
    "context": "A cabin, no signal, one guitar",
    "prompt": "You rent a cabin with no signal to write, the way the legends supposedly did. It’s just you, an instrument, and the terrifying quiet where the internet used to be. The songs, if there are songs, will have to come from you alone.",
    "recap": "A cabin with no signal, one guitar, and the terrifying quiet.",
    "tags": ["write", "rest"],
    "choices": {
      "left": {
        "label": "Write in the silence",
        "minigame": "ideas",
        "governingStats": { "creativity": 1 },
        "tags": ["write", "safe", "indie"],
        "outcomes": {
          "bad": {
            "text": "Three days of silence and you mostly discover how loud your own head is. One half-song and a lot of walks. The cabin was maybe the point, not the songs.",
            "effects": { "creativity": 4, "burnout": -4 }
          },
          "good": {
            "text": "Away from the noise, real songs come — slower, deeper, unmistakably yours. The signal you lost was never the one that mattered.",
            "effects": { "creativity": 7, "cred": 4, "burnout": -3, "writeSong": true }
          },
          "incredible": {
            "text": "The silence unlocks a whole record. You come down the mountain with songs that could only have been written where nobody could reach you. The cabin delivered.",
            "effects": { "creativity": 9, "cred": 5, "burnout": -2, "writeSong": true }
          }
        }
      },
      "right": {
        "label": "Just rest, honestly",
        "governingStats": { "cred": 1 },
        "tags": ["rest", "safe"],
        "outcomes": {
          "bad": {
            "text": "You go to write and end up just sleeping, guiltily, for three days. No songs. But you needed the sleep more than the songs, it turns out.",
            "effects": { "cred": 2, "burnout": -10 }
          },
          "good": {
            "text": "You give yourself permission to not produce, and the rest does what no song could — you come back a person again, refilled and quiet.",
            "effects": { "cred": 4, "burnout": -16, "creativity": 2 }
          },
          "incredible": {
            "text": "The pure rest resets you so completely that songs start arriving the day you get home, easy and unforced. Sometimes the fastest way to write is to stop trying.",
            "effects": { "cred": 5, "burnout": -20, "creativity": 4 }
          }
        }
      }
    }
  },
  {
    "id": "n3_scene_elder",
    "act": 3,
    "pathAffinity": [],
    "weight": 9,
    "art": "ev_n3_scene_elder",
    "context": "The scene, asking you to lead",
    "prompt": "The scene that raised you is in trouble — venues closing, rents rising, the ecosystem fraying. People look to you now, the one who made it, to do something. You have the platform. You did not ask for the responsibility.",
    "recap": "The scene that raised you is fraying, and it’s looking to you.",
    "tags": ["network", "home"],
    "choices": {
      "left": {
        "label": "Fight for the scene",
        "governingStats": { "network": 1, "cred": 0.4 },
        "tags": ["network", "risky", "live"],
        "outcomes": {
          "bad": {
            "text": "You throw yourself into saving the scene and it’s a grind of meetings and benefit shows that barely holds the line. Exhausting, thankless, and the right thing.",
            "effects": { "network": 4, "cred": 5, "burnout": 6, "money": -80 }
          },
          "good": {
            "text": "You use your name to rally support and save two venues, and the scene remembers who showed up when it counted. You become an elder in the truest sense.",
            "effects": { "network": 6, "cred": 7, "fame": 4 }
          },
          "incredible": {
            "text": "You lead a movement that doesn’t just save the scene but revitalizes it — new venues, new bands, a whole ecosystem reborn. Your greatest work isn’t a song. It’s this.",
            "effects": { "network": 8, "cred": 9, "fame": 6 }
          }
        }
      },
      "right": {
        "label": "Lead by making great work",
        "governingStats": { "creativity": 1 },
        "tags": ["indie", "safe"],
        "outcomes": {
          "bad": {
            "text": "You decide your job is the music, not the politics, and make a record while the venues close around you. Some will call it selfish. The record is good, though.",
            "effects": { "creativity": 5, "cred": 3, "burnout": 3 }
          },
          "good": {
            "text": "You lead by example — the best work of your life — and inspire a generation to build the scene you didn’t have time to save yourself. Art as leadership.",
            "effects": { "creativity": 7, "cred": 5, "fame": 4 }
          },
          "incredible": {
            "text": "Your late masterpiece becomes a rallying point that does more for the scene than any benefit could — proof that it produces greatness, worth fighting for. You led with the work.",
            "effects": { "creativity": 9, "cred": 6, "fame": 6 }
          }
        }
      }
    }
  },
  {
    "id": "n3_last_van_show",
    "act": 3,
    "pathAffinity": [],
    "weight": 9,
    "art": "ev_n3_last_van_show",
    "context": "The old van, one more time",
    "prompt": "You could fly to the next show like the artist you’ve become, or take the old van one last time down the highway you started on. The band’s split on it. The van, if it has a vote, votes van.",
    "recap": "Fly to the next show, or take the old van one last time.",
    "tags": ["tour", "home"],
    "choices": {
      "left": {
        "label": "Take the van, one more time",
        "governingStats": { "cred": 1 },
        "tags": ["tour", "home", "safe"],
        "outcomes": {
          "bad": {
            "text": "The van breaks down twice and you make the show by minutes, sweaty and swearing and weirdly happy. Nostalgia is expensive and you’d pay it again.",
            "effects": { "cred": 4, "burnout": 5, "money": -40 }
          },
          "good": {
            "text": "The drive is everything you remembered — the bad gas station coffee, the highway hum, the band young again for eight hours. Some roads you take for the road.",
            "effects": { "cred": 6, "burnout": -3, "network": 3 }
          },
          "incredible": {
            "text": "The van ride becomes the trip you’ll talk about forever, the whole career flooding back at eighty miles an hour. You arrive changed, and play the show of a lifetime.",
            "effects": { "cred": 7, "fame": 5, "creativity": 4 }
          }
        }
      },
      "right": {
        "label": "Fly, like you earned",
        "governingStats": { "network": 1 },
        "tags": ["mainstream", "safe"],
        "outcomes": {
          "bad": {
            "text": "You fly, comfortable and rested, and feel a small unexpected grief at what you’ve outgrown. Progress has a cost you didn’t see coming. The show’s great, though.",
            "effects": { "network": 3, "burnout": -4, "fame": 3 }
          },
          "good": {
            "text": "You travel like the professional you became, arrive fresh, and play a clean strong show. You earned the comfort. No apology necessary.",
            "effects": { "network": 5, "burnout": -5, "fame": 4 }
          },
          "incredible": {
            "text": "Flying frees up the energy the van used to eat, and you pour it all into the stage. This is what making it was supposed to buy: the show, undiluted.",
            "effects": { "network": 6, "fame": 8, "cred": 3 }
          }
        }
      }
    }
  },
  {
    "id": "n3_definitive_statement",
    "act": 3,
    "pathAffinity": [],
    "weight": 9,
    "requires": { "fameMin": 45 },
    "art": "ev_n3_definitive_statement",
    "context": "The record you were building toward all along",
    "prompt": "You feel it: the record you’ve been circling your whole career is finally in reach. The definitive statement. It could be the thing they remember you for — or the overreach they whisper about. Only one way to find out.",
    "recap": "The definitive record you’ve circled your whole career, in reach.",
    "tags": ["record", "write"],
    "choices": {
      "left": {
        "label": "Swing for the masterpiece",
        "governingStats": { "creativity": 1, "skill": 0.4 },
        "tags": ["record", "risky", "indie"],
        "outcomes": {
          "bad": {
            "text": "You reach for the masterpiece and grasp something ambitious and flawed, a glorious near-miss that critics will argue about for years. Not the record. A record.",
            "effects": { "creativity": 4, "cred": 5, "burnout": 6 }
          },
          "good": {
            "text": "You make the record you always meant to, and it’s the one. Not perfect, but complete — the full weight of everything you learned, in one place.",
            "effects": { "creativity": 7, "cred": 7, "fame": 6 }
          },
          "incredible": {
            "text": "You make the masterpiece. The definitive statement. The record they’ll play in fifty years to explain what you were. Everything led here, and here delivers.",
            "effects": { "creativity": 9, "cred": 9, "fame": 10 }
          }
        }
      },
      "right": {
        "label": "Make something modest and true",
        "governingStats": { "cred": 1, "creativity": 0.3 },
        "tags": ["write", "safe"],
        "outcomes": {
          "bad": {
            "text": "You aim small to avoid overreaching and the record is nice, safe, forgettable — the masterpiece you didn’t attempt haunting every quiet track.",
            "effects": { "cred": 3, "creativity": 3 }
          },
          "good": {
            "text": "You make a modest, honest record and it ages beautifully precisely because it wasn’t trying to be Important. Small and true outlasts big and bold, sometimes.",
            "effects": { "cred": 6, "creativity": 5, "fame": 3 }
          },
          "incredible": {
            "text": "Your unpretentious record becomes quietly beloved, the one people return to for comfort across decades. You didn’t make a monument. You made a home. That lasts longer.",
            "effects": { "cred": 8, "creativity": 6, "fame": 5 }
          }
        }
      }
    }
  },
  {
    "id": "n3_royalty_windfall",
    "act": 3,
    "pathAffinity": [],
    "weight": 8,
    "requires": { "fadedMin": 1 },
    "art": "ev_n3_royalty_windfall",
    "context": "A surprise check with too many zeros",
    "prompt": "A check arrives from somewhere unexpected — {fadedSong} got licensed for something enormous overseas, or the publishing math finally tipped your way. It’s more money than you’ve seen at once. It feels almost fake.",
    "recap": "A surprise check with too many zeros, from {fadedSong} overseas.",
    "tags": ["deal", "work"],
    "choices": {
      "left": {
        "label": "Invest in the future",
        "governingStats": { "network": 1 },
        "tags": ["deal", "safe"],
        "outcomes": {
          "bad": {
            "text": "You put it all into a studio buildout that costs more than the check by the time it’s done. Money attracts money problems. But you have a studio now.",
            "effects": { "network": 3, "money": 100, "burnout": 3 }
          },
          "good": {
            "text": "You use the windfall to buy time and freedom — a cushion that lets you make the next thing without fear. The smartest thing money buys is options.",
            "effects": { "network": 5, "money": 300, "creativity": 3 }
          },
          "incredible": {
            "text": "You invest the windfall so wisely it becomes the foundation of lasting independence. Never broke again, never beholden again. {fadedSong} bought your freedom, at last.",
            "effects": { "network": 6, "money": 500, "cred": 3 }
          }
        }
      },
      "right": {
        "label": "Give most of it away",
        "governingStats": { "cred": 1 },
        "tags": ["indie", "risky"],
        "outcomes": {
          "bad": {
            "text": "You give big and generously and immediately face the reality that generosity doesn’t pay rent. Warm heart, cold account. You’d do it again, probably.",
            "effects": { "cred": 5, "money": 40, "fame": 3 }
          },
          "good": {
            "text": "You spread the windfall through the scene — venues, young bands, the people who held you up — and the goodwill compounds into something money can’t buy.",
            "effects": { "cred": 7, "network": 5, "fame": 4, "money": 60 }
          },
          "incredible": {
            "text": "Your generosity becomes legend and, karma being occasionally real, comes back tenfold in loyalty, opportunity, and a scene that would go to war for you. You gave it away and got everything.",
            "effects": { "cred": 9, "network": 7, "fame": 6, "money": 100 }
          }
        }
      }
    }
  },
  {
    "id": "n3_two_three_flag",
    "act": [2, 3],
    "pathAffinity": [],
    "weight": 9,
    "art": "ev_n3_two_three_flag",
    "context": "A choice that echoes",
    "prompt": "A booking agent wants an answer today on a career-defining routing decision, and there’s no obviously right answer — just the version of the next year you’re willing to live inside. You realize you’ve been avoiding exactly this call.",
    "recap": "A booking agent wants an answer today on the next year’s routing.",
    "tags": ["deal", "tour"],
    "choices": {
      "left": {
        "label": "Bet on the big rooms",
        "governingStats": { "network": 1 },
        "tags": ["deal", "mainstream", "risky"],
        "outcomes": {
          "bad": {
            "text": "You book the big rooms and some of them stay half-empty, expensive echoes of ambition. Reaching too far, too soon, in front of too few. Painful data.",
            "effects": { "network": 3, "fame": 4, "money": -60, "burnout": 5 }
          },
          "good": {
            "text": "The bigger rooms mostly fill and the career levels up a rung. Bet placed, bet paid. The view from the next tier is worth the vertigo.",
            "effects": { "network": 6, "fame": 8, "money": 150 }
          },
          "incredible": {
            "text": "You bet big and the rooms overflow. The routing you agonized over becomes the year everything scaled. Sometimes the scary call is just the right one, early.",
            "effects": { "network": 7, "fame": 13, "money": 250, "cred": 3 }
          }
        }
      },
      "right": {
        "label": "Stay in the rooms that love you",
        "governingStats": { "cred": 1, "network": 0.3 },
        "tags": ["live", "safe", "indie"],
        "outcomes": {
          "bad": {
            "text": "You play it safe in the mid-size rooms and wonder, later, if you capped your own ceiling out of fear. Comfortable, secure, and privately restless.",
            "effects": { "cred": 4, "money": 80, "burnout": 2 }
          },
          "good": {
            "text": "You keep to the rooms that reliably sell out and love you, and build a rock-solid, sustainable career on a foundation of genuine devotion. Slow and real.",
            "effects": { "cred": 6, "fame": 5, "money": 140 }
          },
          "incredible": {
            "text": "Your loyal mid-size circuit becomes so devoted and so consistent that you out-earn the arena chasers with a fraction of the risk. The tortoise, it turns out, tours smarter.",
            "effects": { "cred": 7, "fame": 7, "money": 220, "network": 3 }
          }
        }
      }
    }
  },
  {
    "id": "n3_greatest_fear",
    "act": 3,
    "pathAffinity": [],
    "weight": 9,
    "requires": { "burnoutMin": 70 },
    "art": "ev_n3_greatest_fear",
    "context": "The mirror, 3 a.m., the summit in sight",
    "prompt": "This close to everything you wanted, and the fear arrives in full: what if you get it and it’s not enough? What if the summit is just another parking lot? The burnout has stripped away every comfortable lie. Only the honest question is left.",
    "recap": "3 a.m., the summit in sight: what if it isn’t enough?",
    "tags": ["rest", "home"],
    "choices": {
      "left": {
        "label": "Sit with the fear",
        "governingStats": { "cred": 1 },
        "tags": ["rest", "safe"],
        "outcomes": {
          "bad": {
            "text": "You sit with it and it doesn’t resolve, exactly, but naming it out loud drains some of its power. You’re still scared. You’re just less alone with it now.",
            "effects": { "cred": 4, "burnout": -8 }
          },
          "good": {
            "text": "You face the fear honestly and come out the other side with a harder, truer answer: the summit was never the point; the climbing was. That reframes everything.",
            "effects": { "cred": 6, "burnout": -14, "creativity": 3 }
          },
          "incredible": {
            "text": "You go all the way into the fear and find, at the bottom of it, the reason you started — pure and stupid and unkillable. You come back lighter than you’ve been in years.",
            "effects": { "cred": 7, "burnout": -20, "creativity": 5 }
          }
        }
      },
      "right": {
        "label": "Outrun it to the finish",
        "governingStats": { "skill": 1 },
        "tags": ["work", "risky"],
        "outcomes": {
          "bad": {
            "text": "You bury the fear in work and it waits, patiently, for a quieter night. The output is real; so is the thing you’re not looking at. It’ll be there later.",
            "effects": { "skill": 4, "fame": 5, "burnout": 8 }
          },
          "good": {
            "text": "You channel the fear into fuel and sprint the last stretch on adrenaline and dread. It works, this once. The reckoning is deferred, not dodged, but the finish is close.",
            "effects": { "skill": 6, "fame": 8, "burnout": 5 }
          },
          "incredible": {
            "text": "You take the fear and forge it into the most driven stretch of your life, arriving at the summit on pure will. You’ll have to face it eventually. But not before you get there.",
            "effects": { "skill": 7, "fame": 11, "cred": 3, "burnout": 4 }
          }
        }
      }
    }
  },
  {
    "id": "n3_comeback_kid",
    "act": 3,
    "pathAffinity": [],
    "weight": 8,
    "requires": { "flagsAll": ["comeback"] },
    "art": "ev_n3_comeback_kid",
    "context": "The second act, being written now",
    "prompt": "Everyone loves a comeback, and you’re living one — the faded name, back in the room, refusing the ending the industry wrote for you. There’s a narrative forming around your return. You get to decide if you fulfill it or defy it.",
    "recap": "You’re living a comeback, and a redemption narrative is forming.",
    "tags": ["fame", "network"],
    "choices": {
      "left": {
        "label": "Complete the redemption arc",
        "governingStats": { "network": 1, "skill": 0.3 },
        "tags": ["fame", "mainstream", "safe"],
        "outcomes": {
          "bad": {
            "text": "You lean into the comeback story and it works, but you feel a little like a character in someone else’s screenplay. Redemption on rails. It sells, though.",
            "effects": { "network": 4, "fame": 8, "cred": 2 }
          },
          "good": {
            "text": "You deliver the comeback everyone wanted, and the sweetness of it is real — the second chance, taken, earned, undeniable. The kid who got written off writes the ending.",
            "effects": { "network": 6, "fame": 10, "cred": 4 }
          },
          "incredible": {
            "text": "Your comeback becomes THE comeback, the one they’ll cite for a generation. The fall made the rise mean something. You didn’t just return — you transcended the whole story.",
            "effects": { "network": 7, "fame": 15, "cred": 5 }
          }
        }
      },
      "right": {
        "label": "Refuse the tidy narrative",
        "governingStats": { "creativity": 1, "cred": 0.3 },
        "tags": ["indie", "risky"],
        "outcomes": {
          "bad": {
            "text": "You reject the redemption framing and confuse everyone who wanted the neat story. Contrarian, principled, and a harder sell. You sleep better, though.",
            "effects": { "creativity": 3, "cred": 5, "burnout": 3 }
          },
          "good": {
            "text": "You refuse to be a comeback and insist on just being an artist, present tense, no arc required. It’s a subtler stance and the right people respect it deeply.",
            "effects": { "creativity": 6, "cred": 6, "fame": 4 }
          },
          "incredible": {
            "text": "By rejecting the comeback narrative entirely, you make something so vital it renders the whole “return” framing obsolete. You’re not back. You never left. And the work proves it.",
            "effects": { "creativity": 8, "cred": 7, "fame": 6 }
          }
        }
      }
    }
  },
  {
    "id": "n3_signature_move",
    "act": 3,
    "pathAffinity": [],
    "weight": 9,
    "art": "ev_n3_signature_move",
    "context": "The thing only you do",
    "prompt": "You have a signature — a move, a sound, a trick that’s become shorthand for you. Audiences wait for it. It’s a gift and a cage. Tonight you can give them the thing they came for, or finally retire it and see who you are without it.",
    "recap": "Your signature move — the thing audiences wait for, gift and cage.",
    "tags": ["live", "creativity"],
    "choices": {
      "left": {
        "label": "Give them the signature",
        "minigame": "crowd",
        "governingStats": { "skill": 1 },
        "tags": ["live", "mainstream", "safe"],
        "outcomes": {
          "bad": {
            "text": "You do the thing and the crowd erupts and you feel, for the first time, like a tribute act to yourself. The cage clicks a little tighter. But they loved it.",
            "effects": { "skill": 4, "fame": 6, "burnout": 3 }
          },
          "good": {
            "text": "You deliver the signature with total command and the room loses its mind. There’s a reason it became your thing. Owning it is its own kind of art.",
            "effects": { "skill": 6, "fame": 9, "cred": 3 }
          },
          "incredible": {
            "text": "You do the signature move better than you ever have, transcending the cliché through sheer mastery. The thing everyone expected becomes the thing nobody will forget.",
            "effects": { "skill": 7, "fame": 13, "cred": 4 }
          }
        }
      },
      "right": {
        "label": "Retire it, tonight",
        "governingStats": { "creativity": 1, "cred": 0.3 },
        "tags": ["live", "risky", "indie"],
        "outcomes": {
          "bad": {
            "text": "You skip the signature and the crowd’s confusion is audible; they came for the one thing and you withheld it. Brave, deflating, and a story they’ll tell as a letdown.",
            "effects": { "creativity": 3, "cred": 4, "burnout": 4 }
          },
          "good": {
            "text": "You retire the signature and play what’s underneath it, and the freedom in your playing is immediately audible. You just got interesting again. To yourself, first.",
            "effects": { "creativity": 7, "cred": 5, "fame": 3 }
          },
          "incredible": {
            "text": "You kill your signature and are reborn on stage as something newer and stranger and more alive. The crowd that came for the old you leaves fans of the next you. Rare courage, rewarded.",
            "effects": { "creativity": 9, "cred": 6, "fame": 6 }
          }
        }
      }
    }
  },
  {
    "id": "n3_the_protege_surpasses",
    "act": 3,
    "pathAffinity": [],
    "weight": 8,
    "requires": { "fameMin": 50 },
    "art": "ev_n3_protege_surpasses",
    "context": "Someone you helped, now bigger than you",
    "prompt": "Someone you mentored, championed, gave an opener slot to years ago, just went supernova. They’re bigger than you now, and gracious about it, and every interview mentions you as “a formative influence.” Past tense. It’s complicated in your chest.",
    "recap": "Someone you mentored just went supernova. Bigger than you now.",
    "tags": ["network", "fame"],
    "choices": {
      "left": {
        "label": "Celebrate them fully",
        "governingStats": { "cred": 1, "network": 0.3 },
        "tags": ["network", "safe"],
        "outcomes": {
          "bad": {
            "text": "You cheer them on publicly and privately wrestle the envy, which is human and ugly and you handle it about eighty percent gracefully. The twenty percent is between you and the mirror.",
            "effects": { "cred": 4, "network": 3, "burnout": 3 }
          },
          "good": {
            "text": "You genuinely celebrate their rise, and the generosity of it deepens the bond — they never forget who was glad, unreservedly, when it wasn’t about you.",
            "effects": { "cred": 6, "network": 5, "fame": 4 }
          },
          "incredible": {
            "text": "Your open-hearted pride becomes a story they tell everywhere, and their whole massive platform turns into a megaphone for you. Generosity, wildly repaid. The protégé lifts the mentor.",
            "effects": { "cred": 7, "network": 7, "fame": 9 }
          }
        }
      },
      "right": {
        "label": "Prove you’ve still got it",
        "governingStats": { "creativity": 1, "skill": 0.3 },
        "tags": ["indie", "risky"],
        "outcomes": {
          "bad": {
            "text": "You set out to prove you’re not a footnote and the effort shows, a veteran straining against “formative influence.” Some of it lands. Some of it just looks tired.",
            "effects": { "creativity": 3, "fame": 4, "burnout": 5 }
          },
          "good": {
            "text": "You answer the “past tense” by making present-tense work so good it reminds everyone the teacher can still school the class. Point made, elegantly.",
            "effects": { "creativity": 6, "cred": 5, "fame": 5 }
          },
          "incredible": {
            "text": "You make something so vital it flips the narrative entirely — suddenly the supernova is citing your NEW work as an influence. You out-evolved your own legend. Nobody saw it coming.",
            "effects": { "creativity": 9, "cred": 6, "fame": 8 }
          }
        }
      }
    }
  },
  {
    "id": "n3_final_lesson",
    "act": 3,
    "pathAffinity": [],
    "weight": 9,
    "art": "ev_n3_final_lesson",
    "context": "A kid at the stage door, wide open",
    "prompt": "A kid waits at the stage door with a beat-up instrument and the exact look you had at their age — all hunger, no map. They ask the question you once asked someone: “How do I do what you did?” You have one honest minute to answer.",
    "recap": "A kid at the stage door: “How do I do what you did?”",
    "tags": ["home", "network"],
    "choices": {
      "left": {
        "label": "Tell them the hard truth",
        "governingStats": { "cred": 1 },
        "tags": ["home", "safe"],
        "outcomes": {
          "bad": {
            "text": "You tell them how hard and unfair it is and watch the light dim slightly. Honest, maybe too honest. You hope the hunger survives the truth. It usually does.",
            "effects": { "cred": 5, "burnout": 2 }
          },
          "good": {
            "text": "You give them the real map — the grind, the luck, the refusal to quit — and the kid nods like they’re receiving scripture. Because they are. You just wrote it.",
            "effects": { "cred": 7, "network": 3, "creativity": 3 }
          },
          "incredible": {
            "text": "You tell the kid the one true thing nobody told you, and years later they’ll credit that stage-door minute as the moment everything started. You just changed a life in sixty seconds.",
            "effects": { "cred": 8, "network": 4, "fame": 4 }
          }
        }
      },
      "right": {
        "label": "Just encourage them",
        "governingStats": { "network": 1 },
        "tags": ["home", "safe"],
        "outcomes": {
          "bad": {
            "text": "You give the warm generic pep talk and the kid deserved more specific than that. Kind, forgettable. You catch yourself and wish you’d said the real thing.",
            "effects": { "network": 3, "cred": 2 }
          },
          "good": {
            "text": "You tell them they’ve got it, that you can see it, and sometimes belief is the only tool a kid can’t buy. You hand them the thing someone once handed you.",
            "effects": { "network": 5, "cred": 4, "fame": 3 }
          },
          "incredible": {
            "text": "Your encouragement is so specific and so real it becomes the thing the kid holds onto through every hard year ahead. You didn’t give advice. You gave permission. That lasts a lifetime.",
            "effects": { "network": 6, "cred": 6, "fame": 4 }
          }
        }
      }
    }
  },
  {
    "id": "n3_genre_pioneer",
    "act": 3,
    "pathAffinity": [],
    "weight": 8,
    "requires": { "genreAny": true },
    "art": "ev_n3_genre_pioneer",
    "context": "The sound you helped invent, everywhere now",
    "prompt": "The {genre} sound you were doing when nobody cared is suddenly everywhere, and a dozen younger acts are getting rich off a wave you helped start. Pioneers rarely profit from their frontiers. You get to decide how to feel about that.",
    "recap": "The {genre} sound you pioneered is everywhere, minting younger acts.",
    "tags": ["social", "creativity"],
    "choices": {
      "left": {
        "label": "Claim your place in the story",
        "governingStats": { "cred": 1, "network": 0.3 },
        "tags": ["social", "risky"],
        "outcomes": {
          "bad": {
            "text": "You assert your role in inventing the sound and it comes off as bitter, an old-timer yelling “I was first.” Half true, half sad. The kids shrug.",
            "effects": { "cred": 3, "fame": 4, "burnout": 3 }
          },
          "good": {
            "text": "You make the case for your place in the {genre} lineage with grace and receipts, and the scene grants you the elder-statesman respect you earned. History, corrected.",
            "effects": { "cred": 6, "fame": 6, "network": 4 }
          },
          "incredible": {
            "text": "You reframe the whole {genre} narrative so completely that you become its acknowledged origin point, and the wave you started finally carries you up with it. Vindication, and a payday.",
            "effects": { "cred": 8, "fame": 10, "network": 5 }
          }
        }
      },
      "right": {
        "label": "Move on to the next frontier",
        "governingStats": { "creativity": 1 },
        "tags": ["indie", "risky"],
        "outcomes": {
          "bad": {
            "text": "You abandon the sound that finally got popular to chase a new one, and it’s a bold move that lands somewhere between visionary and self-sabotage. Time will tell. It always does.",
            "effects": { "creativity": 4, "cred": 4, "burnout": 4 }
          },
          "good": {
            "text": "You leave {genre} to the imitators and invent your next thing, and being a pioneer twice is rarer than any hit. The frontier is the only home you trust.",
            "effects": { "creativity": 7, "cred": 6, "fame": 4 }
          },
          "incredible": {
            "text": "You pioneer a second sound while everyone’s still mining your first, and cement yourself not as a genre but as a permanent source of them. The wave-maker doesn’t ride waves. They make new oceans.",
            "effects": { "creativity": 9, "cred": 7, "fame": 7 }
          }
        }
      }
    }
  },
  {
    "id": "n3_the_reunion_offer",
    "act": 3,
    "pathAffinity": [],
    "weight": 8,
    "requires": { "bandMin": 2 },
    "art": "ev_n3_the_reunion_offer",
    "context": "The old lineup, a lucrative what-if",
    "prompt": "A promoter dangles enormous money for a reunion of your earliest lineup — the people you started with, some of whom you haven’t spoken to in years, some of whom you left on bad terms. The check could fix everything except the reasons you split.",
    "recap": "A promoter dangles huge money to reunite your earliest lineup.",
    "tags": ["deal", "band"],
    "choices": {
      "left": {
        "label": "Take the reunion",
        "governingStats": { "network": 1, "cred": 0.3 },
        "tags": ["deal", "band", "risky"],
        "outcomes": {
          "bad": {
            "text": "The reunion happens and the old tensions resurface within one rehearsal. You play the shows, cash the checks, and remember exactly why you split. Expensive closure.",
            "effects": { "network": 3, "money": 300, "burnout": 6 }
          },
          "good": {
            "text": "The reunion heals more than it reopens. Older now, you all handle the old wounds better, and the shows are genuinely joyful. The money’s nice; the peace is better.",
            "effects": { "network": 5, "money": 250, "cred": 4, "burnout": -2 }
          },
          "incredible": {
            "text": "The reunion becomes a full reconciliation and a triumphant run that reminds everyone why the original magic was magic. Old friends, made whole, playing better than ever. Priceless, plus the check.",
            "effects": { "network": 7, "money": 350, "cred": 5, "fame": 5 }
          }
        }
      },
      "right": {
        "label": "Let the past stay past",
        "governingStats": { "cred": 1 },
        "tags": ["indie", "safe"],
        "outcomes": {
          "bad": {
            "text": "You turn down the reunion money to protect the memory, and spend a while second-guessing whether closure was worth more than the check. The current band respects it, at least.",
            "effects": { "cred": 4, "burnout": 2 }
          },
          "good": {
            "text": "You decline gracefully and keep the original band a perfect, unspoiled memory. Some things are better remembered than revisited. You choose the memory.",
            "effects": { "cred": 6, "network": 3, "creativity": 3 }
          },
          "incredible": {
            "text": "Your refusal to cheapen the past into a nostalgia cash-grab becomes its own kind of statement, and the current band bonds even tighter for it. The road ahead beats the road behind. You keep driving.",
            "effects": { "cred": 8, "network": 4, "creativity": 4 }
          }
        }
      }
    }
  },
  {
    "id": "n3_teaching_offer",
    "act": 3,
    "pathAffinity": [],
    "weight": 8,
    "art": "ev_n3_teaching_offer",
    "context": "A university, a named chair, a steady chair",
    "prompt": "A music school offers you a professorship — a named chair, a steady salary, summers off, and the chance to shape a generation. It’s the security the road never gave you. It’s also, quietly, an ending dressed as a beginning.",
    "recap": "A university offers a named chair — steady salary, summers off.",
    "tags": ["deal", "work"],
    "choices": {
      "left": {
        "label": "Take the chair",
        "governingStats": { "network": 1, "cred": 0.3 },
        "tags": ["deal", "safe", "work"],
        "outcomes": {
          "bad": {
            "text": "You take the professorship and the security is real and so is the small death of watching students do what you’re now mostly talking about. It’s good. It’s just quieter than you.",
            "effects": { "network": 4, "money": 200, "cred": 3, "burnout": -4 }
          },
          "good": {
            "text": "You become the teacher you wish you’d had, and shaping young players turns out to be its own deep creative act. You’re not done making music. You’re making musicians.",
            "effects": { "network": 5, "cred": 6, "creativity": 3, "money": 150 }
          },
          "incredible": {
            "text": "You build a program that becomes legendary, sending brilliant weird artists into the world for decades. Your greatest hits turn out to be people. The chair was a launchpad after all.",
            "effects": { "network": 6, "cred": 8, "fame": 5, "money": 180 }
          }
        }
      },
      "right": {
        "label": "Stay in the field",
        "governingStats": { "creativity": 1, "skill": 0.3 },
        "tags": ["live", "risky", "indie"],
        "outcomes": {
          "bad": {
            "text": "You turn down the security to keep playing, and some nights, loading out at 2 a.m. into the cold, you question the choice. Then you play again, and you don’t. Mostly.",
            "effects": { "creativity": 4, "cred": 4, "burnout": 4 }
          },
          "good": {
            "text": "You choose to stay a working artist over becoming a teacher of them, and the practitioner’s edge stays sharp. You’d rather do it than describe it. You keep doing it.",
            "effects": { "creativity": 6, "cred": 5, "skill": 3 }
          },
          "incredible": {
            "text": "By staying in the field you make late work so alive it teaches more than any classroom could — the ultimate lesson being that you never have to stop. You choose the doing, forever, and the doing rewards you.",
            "effects": { "creativity": 8, "cred": 6, "fame": 5 }
          }
        }
      }
    }
  },
  {
    "id": "n3_one_more_song",
    "act": 3,
    "pathAffinity": [],
    "weight": 9,
    "art": "ev_n3_one_more_song",
    "context": "Late, empty room, one idea left",
    "prompt": "It’s late and the room is empty and there’s one more idea knocking that you could chase or let go. You’ve made it far enough that you don’t have to write anything ever again. Which is exactly why what you do next actually means something.",
    "recap": "Late, the room empty, one more idea knocking to be chased.",
    "tags": ["write", "home"],
    "choices": {
      "left": {
        "label": "Chase the one more song",
        "minigame": "ideas",
        "governingStats": { "creativity": 1 },
        "tags": ["write", "safe"],
        "outcomes": {
          "bad": {
            "text": "You chase it and it slips away, and you sit in the empty room a while with the specific ache of an idea that wouldn’t hold still. Tomorrow, maybe. The knocking will be back.",
            "effects": { "creativity": 4, "burnout": 3 }
          },
          "good": {
            "text": "You catch the last idea of the night and it’s a good one — proof that the well isn’t dry, that you’re still a writer, not just someone who wrote. That matters more than the song.",
            "effects": { "creativity": 7, "cred": 4, "writeSong": true }
          },
          "incredible": {
            "text": "The one more song you didn’t have to write becomes one of the best you ever did, precisely because it came from want, not need. Free of everything, you made something priceless.",
            "effects": { "creativity": 9, "cred": 5, "fame": 4, "writeSong": true }
          }
        }
      },
      "right": {
        "label": "Let it go, and rest",
        "governingStats": { "cred": 1 },
        "tags": ["rest", "safe"],
        "outcomes": {
          "bad": {
            "text": "You let the idea go and go to bed and lie awake anyway, wondering. Rest is a skill you never quite mastered. But the room is quiet and that’s something.",
            "effects": { "cred": 3, "burnout": -6 }
          },
          "good": {
            "text": "You let it go without guilt, trusting there will be more, and the trust itself is a kind of arrival. You don’t have to catch every idea anymore. You caught enough.",
            "effects": { "cred": 5, "burnout": -10, "creativity": 2 }
          },
          "incredible": {
            "text": "You release the idea into the quiet and feel, for the first time, complete — not empty, not finished, just whole. The peace of an artist who has nothing left to prove. That’s the real summit.",
            "effects": { "cred": 7, "burnout": -14, "creativity": 4 }
          }
        }
      }
    }
  },
  {
    "id": "n3_the_encore_of_encores",
    "act": 3,
    "pathAffinity": [],
    "weight": 9,
    "requires": { "fameMin": 40 },
    "art": "ev_n3_the_encore_of_encores",
    "context": "The crowd won’t leave. They never want to.",
    "prompt": "The show should be over. The crowd knows every word to everything and won’t stop, a wall of sound demanding you stay, stay, stay. You’ve got maybe one great encore left in your body tonight. How do you want to end this one?",
    "recap": "The crowd won’t leave, and you’ve one great encore left tonight.",
    "tags": ["live", "fame"],
    "choices": {
      "left": {
        "label": "The huge, cathartic finale",
        "minigame": "crowd",
        "governingStats": { "skill": 1, "creativity": 0.3 },
        "tags": ["live", "mainstream", "risky"],
        "outcomes": {
          "bad": {
            "text": "You go for the massive finale and your voice, this deep into the night, cracks on the big note. The crowd carries it for you, which is somehow better and worse. They’ll remember the crack fondly.",
            "effects": { "skill": 4, "fame": 8, "burnout": 6 }
          },
          "good": {
            "text": "You unleash the full cathartic finale and the room becomes one enormous throat, thousands of voices as your backing choir. The kind of ending that makes people cry in parking lots after.",
            "effects": { "skill": 6, "fame": 12, "cred": 4 }
          },
          "incredible": {
            "text": "You end with a finale so overwhelming it becomes the show people describe for the rest of their lives. Phones down, arms up, everyone present. The peak of what a room can do. You built that.",
            "effects": { "skill": 8, "fame": 18, "cred": 5 }
          }
        }
      },
      "right": {
        "label": "The quiet, devastating close",
        "governingStats": { "creativity": 1, "cred": 0.3 },
        "tags": ["live", "indie", "risky"],
        "outcomes": {
          "bad": {
            "text": "You go quiet to end on intimacy and a chunk of the crowd, keyed up for a banger, talks through it. The people up front get it. The people in back wanted fireworks. You can’t reach everyone.",
            "effects": { "creativity": 3, "cred": 4, "burnout": 3 }
          },
          "good": {
            "text": "You end on one hushed, devastating song and the whole room goes silent to receive it. After the noise, the quiet lands like a held breath. An ending nobody expected and nobody forgets.",
            "effects": { "creativity": 7, "cred": 6, "fame": 5 }
          },
          "incredible": {
            "text": "You close the biggest night of your life with the smallest, truest song, alone, and ten thousand people barely breathe. It’s the bravest possible ending, and it becomes the definition of you. Silence as the final note.",
            "effects": { "creativity": 9, "cred": 7, "fame": 9 }
          }
        }
      }
    }
  },
  {
    "id": "np_ms2_stylist",
    "act": 2,
    "pathAffinity": ["megastar"],
    "weight": 10,
    "art": "ev_np_ms2_stylist",
    "context": "A stylist with a mood board and opinions",
    "prompt": "A stylist wants to “develop your look.” They have a mood board, a budget, and a vision of you that is 20% more famous than you feel. The image, they insist, comes before the fame, not after.",
    "recap": "A stylist with a mood board wants to develop your look.",
    "tags": ["fame", "social"],
    "choices": {
      "left": {
        "label": "Commit to the image",
        "governingStats": { "network": 1, "creativity": 0.3 },
        "tags": ["fame", "mainstream", "risky"],
        "outcomes": {
          "bad": {
            "text": "The new look is striking and not quite you, and you spend the tour feeling like a billboard for a stranger. Photographs great, though.",
            "effects": { "network": 4, "fame": 8, "cred": -4 }
          },
          "good": {
            "text": "The image sharpens into something magnetic. People recognize you across a room now. That’s the job, and the stylist nailed it.",
            "effects": { "network": 6, "fame": 12, "cred": -2 }
          },
          "incredible": {
            "text": "The look becomes iconic — imitated, memed, unmistakable. You didn’t sell out; you built a flag people can see from a distance.",
            "effects": { "network": 8, "fame": 18, "pathProgress": 1 }
          }
        }
      },
      "right": {
        "label": "Stay recognizably you",
        "governingStats": { "cred": 1 },
        "tags": ["indie", "safe"],
        "outcomes": {
          "bad": {
            "text": "You keep the thrift-store fit and the stylist sighs and the cameras find someone shinier to point at. Authentic and slightly invisible.",
            "effects": { "cred": 4, "fame": 3 }
          },
          "good": {
            "text": "You refine your own look instead of adopting theirs, and it reads as confidence. The realness becomes its own brand.",
            "effects": { "cred": 5, "fame": 6, "network": 3 }
          },
          "incredible": {
            "text": "Your refusal to be packaged becomes the package — the anti-image image, so distinctly you that it out-markets any stylist. Fame on your terms.",
            "effects": { "cred": 6, "fame": 12, "network": 4, "pathProgress": 1 }
          }
        }
      }
    }
  },
  {
    "id": "np_ms2_arena_support",
    "act": 2,
    "pathAffinity": ["megastar"],
    "weight": 11,
    "art": "ev_np_ms2_arena_support",
    "context": "An arena tour wants an opener",
    "prompt": "A stadium act offers you the support slot on their arena run — twenty thousand strangers a night who came for someone else. It’s the biggest rooms you’ll ever have played, and none of the crowd is yours. Yet.",
    "recap": "An arena act offers the opener slot — twenty thousand a night.",
    "tags": ["live", "tour"],
    "choices": {
      "left": {
        "label": "Win the arenas",
        "minigame": "crowd",
        "governingStats": { "skill": 1, "creativity": 0.4 },
        "tags": ["live", "risky", "fame"],
        "outcomes": {
          "bad": {
            "text": "Twenty thousand seats, half full during your set, all of them a hundred feet away. You play to the rafters and the rafters stay cool. Humbling at scale.",
            "effects": { "skill": 4, "fame": 6, "burnout": 7 }
          },
          "good": {
            "text": "You learn to play a room the size of a town, and by the third night the crowd arrives early to catch you. The reach is real now.",
            "effects": { "skill": 6, "fame": 14, "network": 5 }
          },
          "incredible": {
            "text": "You conquer the arenas so completely the headliner’s fans start showing up in YOUR shirts. The support act stole the tour. Word travels at stadium volume.",
            "effects": { "skill": 7, "fame": 22, "network": 6, "pathProgress": 1 }
          }
        }
      },
      "right": {
        "label": "Network the whole tour machine",
        "governingStats": { "network": 1 },
        "tags": ["network", "safe"],
        "outcomes": {
          "bad": {
            "text": "You work the crews and handlers and learn how the big machine runs, at the cost of a few good nights’ sleep. Knowledge, extracted from exhaustion.",
            "effects": { "network": 5, "fame": 5, "burnout": 5 }
          },
          "good": {
            "text": "You befriend the tour manager, the FOH engineer, the booking agent — the people who decide who plays arenas. Contacts that outlast the tour.",
            "effects": { "network": 8, "fame": 6, "money": 100 }
          },
          "incredible": {
            "text": "You end the tour with the headliner’s own team quietly offering to work with you next. You didn’t just open the tour; you recruited it.",
            "effects": { "network": 10, "fame": 8, "cred": 3, "pathProgress": 1 }
          }
        }
      }
    }
  },
  {
    "id": "np_ms2_first_viral",
    "act": 2,
    "pathAffinity": ["megastar"],
    "weight": 10,
    "art": "ev_np_ms2_first_viral",
    "context": "A clip, escaping containment",
    "prompt": "A thirty-second clip of you does the thing — it’s everywhere overnight, millions of strangers, most of whom will forget you by lunch. The window is open. It closes fast. What you do in the next 48 hours matters more than the last two years.",
    "recap": "A thirty-second clip of you is suddenly everywhere overnight.",
    "tags": ["social", "fame"],
    "choices": {
      "left": {
        "label": "Feed the moment relentlessly",
        "governingStats": { "network": 1, "creativity": 0.3 },
        "tags": ["social", "mainstream", "risky"],
        "outcomes": {
          "bad": {
            "text": "You post through the window frantically and burn out by day two, and the wave moves on regardless. You got the spike and a headache. Fame is a slot machine.",
            "effects": { "network": 3, "fame": 8, "burnout": 6 }
          },
          "good": {
            "text": "You capitalize hard and smart, converting the drive-by millions into a real bump of actual followers who stick. The window paid.",
            "effects": { "network": 5, "fame": 14, "cred": -2 }
          },
          "incredible": {
            "text": "You ride the viral moment into orbit — the right follow-up at the right hour, and the spike becomes a plateau. Overnight fame, made durable. Rare.",
            "effects": { "network": 7, "fame": 22, "pathProgress": 1 }
          }
        }
      },
      "right": {
        "label": "Point it at something real",
        "governingStats": { "creativity": 1, "network": 0.3 },
        "tags": ["social", "safe"],
        "outcomes": {
          "bad": {
            "text": "You try to redirect the viral crowd to your actual music and most of them bounce; they came for the clip, not the catalog. A few stay. A few is still growth.",
            "effects": { "creativity": 3, "fame": 6, "cred": 2 }
          },
          "good": {
            "text": "You use the moment to showcase the real work, and the fraction that converts are genuine fans, not just numbers. Quality caught in a quantity net.",
            "effects": { "creativity": 5, "fame": 10, "cred": 4 }
          },
          "incredible": {
            "text": "You turn a throwaway viral moment into a doorway to your whole world, and thousands walk through and stay. You caught lightning AND kept it. Textbook.",
            "effects": { "creativity": 6, "fame": 16, "cred": 3, "pathProgress": 1 }
          }
        }
      }
    }
  },
  {
    "id": "np_ms2_brand_deal",
    "act": 2,
    "pathAffinity": ["megastar"],
    "weight": 10,
    "art": "ev_np_ms2_brand_deal",
    "context": "A brand, a big number, a small compromise",
    "prompt": "A major brand wants you as the face of a campaign. The money is life-changing and the association is slightly embarrassing and the reach is enormous. This is the exact fork every famous person faces. Now it’s yours.",
    "recap": "A major brand wants you as the face of a campaign.",
    "tags": ["deal", "mainstream"],
    "choices": {
      "left": {
        "label": "Take the campaign",
        "governingStats": { "network": 1 },
        "tags": ["deal", "mainstream", "risky"],
        "outcomes": {
          "bad": {
            "text": "You’re on billboards for something you’d never buy, and the cred crowd screenshots the ad with a caption you deserve. The check, though, has commas.",
            "effects": { "network": 4, "money": 300, "fame": 8, "cred": -5 }
          },
          "good": {
            "text": "The campaign puts your face everywhere and the fame windfall dwarfs the eye-rolls. Exposure at a scale you couldn’t buy, that someone paid YOU for.",
            "effects": { "network": 5, "money": 350, "fame": 14 }
          },
          "incredible": {
            "text": "The campaign is so ubiquitous you become a household face overnight, and it’s cool enough that even the skeptics fold. Fame and money, both maxed.",
            "effects": { "network": 6, "money": 400, "fame": 20, "pathProgress": 1 }
          }
        }
      },
      "right": {
        "label": "Hold out for the right one",
        "governingStats": { "cred": 1, "network": 0.3 },
        "tags": ["deal", "safe"],
        "outcomes": {
          "bad": {
            "text": "You pass and the right one never quite materializes, and you watch a rival take the check you refused. Principled, poorer, and privately second-guessing.",
            "effects": { "cred": 4, "fame": 3 }
          },
          "good": {
            "text": "You wait and a genuinely cool brand comes calling — one that fits, that adds to your image instead of denting it. Patience, rewarded with alignment.",
            "effects": { "cred": 5, "money": 250, "fame": 10 }
          },
          "incredible": {
            "text": "The brand you held out for makes you a partner, not a billboard — equity, creative control, real money — and it becomes a cornerstone of your empire. The wait built wealth.",
            "effects": { "cred": 6, "money": 350, "fame": 14, "pathProgress": 1 }
          }
        }
      }
    }
  },
  {
    "id": "np_ms2_stan_army",
    "act": 2,
    "pathAffinity": ["megastar"],
    "weight": 10,
    "requires": { "fameMin": 40 },
    "art": "ev_np_ms2_stan_army",
    "context": "A fandom, organizing, slightly feral",
    "prompt": "You’ve got a real fandom now — devoted, organized, and increasingly willing to fight strangers on your behalf. It’s flattering and a little frightening. They love you enough to be a problem. Managing them is a new job you didn’t apply for.",
    "recap": "A real fandom now — devoted, organized, willing to fight for you.",
    "tags": ["social", "fame"],
    "choices": {
      "left": {
        "label": "Mobilize the army",
        "governingStats": { "network": 1 },
        "tags": ["social", "mainstream", "risky"],
        "outcomes": {
          "bad": {
            "text": "You lean into the stans and they get more intense, and one feud they start in your name becomes a headline you have to apologize for. Loyalty is a loaded weapon.",
            "effects": { "network": 4, "fame": 8, "cred": -3 }
          },
          "good": {
            "text": "You direct the fandom’s energy toward good — streams, ticket drives, kindness campaigns — and they become a genuine force multiplier for your career.",
            "effects": { "network": 6, "fame": 12, "cred": 2 }
          },
          "incredible": {
            "text": "Your organized fandom becomes a phenomenon in itself, breaking records and making news, and their devotion catapults you to a fame no marketing could buy.",
            "effects": { "network": 7, "fame": 18, "pathProgress": 1 }
          }
        }
      },
      "right": {
        "label": "Set gentle boundaries",
        "governingStats": { "cred": 1 },
        "tags": ["social", "safe"],
        "outcomes": {
          "bad": {
            "text": "You ask the stans to chill and some take it as betrayal, and a small splinter turns on you loudly. Herding devotion is like herding cats made of fire.",
            "effects": { "cred": 3, "fame": 4, "burnout": 3 }
          },
          "good": {
            "text": "You model kindness and the fandom follows, becoming known as one of the good ones — a community, not a mob. That reputation protects you.",
            "effects": { "cred": 6, "fame": 8, "network": 3 }
          },
          "incredible": {
            "text": "You cultivate a fandom so decent it becomes a case study in doing it right, and the goodwill radiates outward into mainstream love. Fame, humanized.",
            "effects": { "cred": 7, "fame": 14, "network": 4, "pathProgress": 1 }
          }
        }
      }
    }
  },
  {
    "id": "np_ms2_rival_climb",
    "act": 2,
    "pathAffinity": ["megastar"],
    "weight": 9,
    "art": "ev_np_ms2_rival_climb",
    "context": "{rival}, climbing the same ladder",
    "prompt": "{rival} is chasing the same fame you are, and there’s a magazine spread with room for exactly one rising star. The editor loves you both and can only pick one. {rival} — {rivalVibe} — is already emailing the editor daily.",
    "recap": "A magazine spread with room for one rising star. {rival} wants it too.",
    "tags": ["fame", "rival"],
    "choices": {
      "left": {
        "label": "Outwork {rival} for the spot",
        "governingStats": { "network": 1, "creativity": 0.3 },
        "tags": ["fame", "risky", "rival"],
        "outcomes": {
          "bad": {
            "text": "You out-hustle {rival} for the cover and it costs you a week of sleep and a piece of your soul. You got the spread. {rival} got a grudge with a long memory.",
            "effects": { "network": 4, "fame": 8, "burnout": 5, "rivalry": 1 }
          },
          "good": {
            "text": "You win the feature on the strength of a better pitch, and the spread launches you a rung above {rival}, who now studies your every move. Advantage, pressed.",
            "effects": { "network": 5, "fame": 12, "rivalry": 1 }
          },
          "incredible": {
            "text": "You land the cover so decisively the magazine makes you a recurring feature, leaving {rival} in the archive. The gap becomes a gulf. {rival} will never forget this.",
            "effects": { "network": 6, "fame": 18, "cred": 3, "rivalry": 1, "pathProgress": 1 }
          }
        }
      },
      "right": {
        "label": "Suggest they run you both",
        "governingStats": { "cred": 1, "network": 0.3 },
        "tags": ["network", "rival"],
        "outcomes": {
          "bad": {
            "text": "You pitch a joint feature and the editor waters it into a “rising scene” piece where you both get half a page. Noble, diluted. {rival} thanks you, warily.",
            "effects": { "cred": 3, "fame": 5, "rivalry": -1 }
          },
          "good": {
            "text": "The joint feature works — two rivals framed as a movement — and both your stars rise on the shared narrative. A bigger story than either alone.",
            "effects": { "cred": 5, "fame": 10, "network": 3, "rivalry": -1 }
          },
          "incredible": {
            "text": "The two-of-you spread becomes THE story of the year — the scene’s golden rivalry — and lifts you both to a fame neither could reach solo. The feud made you famous together.",
            "effects": { "cred": 6, "fame": 16, "network": 4, "rivalry": -1, "pathProgress": 1 }
          }
        }
      }
    }
  },
  {
    "id": "np_ms2_late_show",
    "act": 2,
    "pathAffinity": ["megastar"],
    "weight": 10,
    "art": "ev_np_ms2_late_show",
    "context": "A late-night TV booking, four minutes",
    "prompt": "A late-night show books you — four minutes, one song, a national audience, and a green room with your name misspelled on the door. It’s the biggest single moment your career has had. There are no second takes on live TV.",
    "recap": "Late-night TV: four minutes, one song, no second takes.",
    "tags": ["live", "fame"],
    "choices": {
      "left": {
        "label": "Play the sure-thing hit",
        "minigame": "prompter",
        "governingStats": { "skill": 1 },
        "tags": ["live", "mainstream", "safe"],
        "outcomes": {
          "bad": {
            "text": "Nerves and a bad monitor mix and your four minutes come out stiff, technically fine and emotionally absent. A missed layup on national TV. It happens. It stings.",
            "effects": { "skill": 4, "fame": 6, "burnout": 5 }
          },
          "good": {
            "text": "You nail the hit clean and warm and the clip does numbers all week. A perfect four-minute advertisement for exactly who you are.",
            "effects": { "skill": 6, "fame": 12, "network": 4 }
          },
          "incredible": {
            "text": "You deliver a definitive performance that becomes the clip — shared, replayed, meme’d lovingly. Four minutes that a career’s worth of shows couldn’t buy.",
            "effects": { "skill": 7, "fame": 20, "cred": 3, "pathProgress": 1 }
          }
        }
      },
      "right": {
        "label": "Debut the risky new one",
        "governingStats": { "creativity": 1, "skill": 0.4 },
        "tags": ["live", "risky", "indie"],
        "outcomes": {
          "bad": {
            "text": "You premiere the unproven song and it doesn’t translate to four minutes and a cold TV crowd. Brave, memorable for the wrong reasons. The band takes the blame graciously.",
            "effects": { "creativity": 3, "fame": 5, "burnout": 6 }
          },
          "good": {
            "text": "The bold new song lands on live TV and marks you as an artist, not just an act. The people who matter noticed you didn’t play it safe.",
            "effects": { "creativity": 6, "fame": 12, "cred": 5 }
          },
          "incredible": {
            "text": "Your daring TV debut becomes a legendary “where were you” moment, the night the whole country met the real you. High wire, no net, perfect landing.",
            "effects": { "creativity": 8, "fame": 20, "cred": 6, "pathProgress": 1 }
          }
        }
      }
    }
  },
  {
    "id": "np_ms2_paparazzi",
    "act": 2,
    "pathAffinity": ["megastar"],
    "weight": 9,
    "requires": { "fameMin": 45 },
    "art": "ev_np_ms2_paparazzi",
    "context": "A camera in a bush, outside your apartment",
    "prompt": "You’re famous enough now that someone’s photographing you buying groceries. The private-life tax of fame has come due, all at once. There’s a photo of you looking tired and it’s somehow news. This is what you wanted, technically.",
    "recap": "Someone’s photographing you buying groceries now.",
    "tags": ["social", "fame"],
    "choices": {
      "left": {
        "label": "Play the fame game",
        "governingStats": { "network": 1 },
        "tags": ["social", "mainstream", "risky"],
        "outcomes": {
          "bad": {
            "text": "You start performing your private life for the cameras and lose track of which parts are real. The fame feeds and the self thins. But the coverage is constant.",
            "effects": { "network": 4, "fame": 10, "cred": -4, "burnout": 4 }
          },
          "good": {
            "text": "You learn to give the cameras enough to stay fed without giving them everything, a careful dance that keeps you famous and mostly sane. Managed exposure.",
            "effects": { "network": 5, "fame": 12, "cred": 2 }
          },
          "incredible": {
            "text": "You master the fame machine — feeding it exactly what serves you and nothing more — and become a case study in staying in control of your own image. The bush loses.",
            "effects": { "network": 6, "fame": 16, "cred": 3, "pathProgress": 1 }
          }
        }
      },
      "right": {
        "label": "Guard your real life",
        "governingStats": { "cred": 1 },
        "tags": ["home", "safe"],
        "outcomes": {
          "bad": {
            "text": "You wall off your private life hard and the tabloids frame the mystery as you being “difficult.” The peace is worth the label, mostly. Mostly.",
            "effects": { "cred": 4, "fame": 4, "burnout": -2 }
          },
          "good": {
            "text": "You keep a genuine private life sacred and it keeps you human, which keeps the music honest. The fans who matter respect the boundary.",
            "effects": { "cred": 6, "fame": 6, "burnout": -3 }
          },
          "incredible": {
            "text": "Your fierce privacy becomes part of your mystique — the famous person nobody really knows — and it makes you MORE compelling, not less. Absence as strategy.",
            "effects": { "cred": 7, "fame": 12, "creativity": 3, "pathProgress": 1 }
          }
        }
      }
    }
  },
  {
    "id": "np_ms2_headline_first",
    "act": 2,
    "pathAffinity": ["megastar"],
    "weight": 10,
    "art": "ev_np_ms2_headline_first",
    "context": "Your name, on top of the poster, first time",
    "prompt": "For the first time, YOU are the headliner — your name biggest, others opening for you. The room is mid-sized and the responsibility is enormous. Every person in there paid to see you specifically. There’s no one bigger to hide behind now.",
    "recap": "First time your name tops the poster; everyone paid for you.",
    "tags": ["live", "fame"],
    "choices": {
      "left": {
        "label": "Rise to the headline",
        "minigame": "crowd",
        "governingStats": { "skill": 1, "creativity": 0.4 },
        "tags": ["live", "risky", "fame"],
        "outcomes": {
          "bad": {
            "text": "The weight of headlining gets in your head and you play tight, a nervous captain on your own maiden voyage. The room’s patient. You’ll get better at carrying it.",
            "effects": { "skill": 4, "fame": 6, "burnout": 5 }
          },
          "good": {
            "text": "You carry the whole night on your own name and prove you belong at the top of the poster. The first of many. It feels exactly as good as you dreamed.",
            "effects": { "skill": 6, "fame": 12, "cred": 4 }
          },
          "incredible": {
            "text": "Your first headline show becomes the stuff of local legend — a debut so commanding the venue books you back at twice the size. A star, self-evidently.",
            "effects": { "skill": 7, "fame": 18, "cred": 5, "pathProgress": 1 }
          }
        }
      },
      "right": {
        "label": "Curate the whole bill",
        "governingStats": { "network": 1, "creativity": 0.3 },
        "tags": ["network", "safe"],
        "outcomes": {
          "bad": {
            "text": "You hand-pick openers who slightly outshine you, generous to a fault, and the crowd remembers the opener. Kind, and a lesson in curation.",
            "effects": { "network": 4, "fame": 5, "cred": 3 }
          },
          "good": {
            "text": "You build a perfect bill that makes the whole night an event, and being the curator marks you as a scene leader, not just a performer. Taste as power.",
            "effects": { "network": 6, "fame": 10, "cred": 4 }
          },
          "incredible": {
            "text": "You curate a lineup so inspired it becomes a recurring showcase with your name on it — a brand, a platform, a launchpad for others. You headlined and built an institution.",
            "effects": { "network": 7, "fame": 14, "cred": 5, "pathProgress": 1 }
          }
        }
      }
    }
  },
  {
    "id": "np_st2_first_call",
    "act": 2,
    "pathAffinity": ["studio"],
    "weight": 11,
    "art": "ev_np_st2_first_call",
    "context": "The phone, ringing at 8 a.m., always for a session",
    "prompt": "You’re getting the calls now — session work, real sessions, real players. There’s a hierarchy in this world: the first-call players get the good dates and the respect. You’re on the list. The question is how high you want to climb it.",
    "recap": "The session calls are coming in — real dates, real players.",
    "tags": ["studio", "work"],
    "choices": {
      "left": {
        "label": "Take every date, build the rep",
        "minigame": "take",
        "governingStats": { "skill": 1 },
        "tags": ["studio", "work", "safe"],
        "outcomes": {
          "bad": {
            "text": "You take everything and spread thin, playing fine on a dozen forgettable records. Working constantly, remembered for none of it. The grind without the glory yet.",
            "effects": { "skill": 4, "money": 120, "burnout": 6 }
          },
          "good": {
            "text": "You say yes to the right dates and your name starts meaning something in the credits. The good producers are learning to call you first.",
            "effects": { "skill": 6, "money": 150, "network": 5 }
          },
          "incredible": {
            "text": "You become the first call for your instrument in the city, the player producers describe by pointing at your chair. The hierarchy has a new top rung and it’s you.",
            "effects": { "skill": 7, "cred": 6, "network": 6, "pathProgress": 1 }
          }
        }
      },
      "right": {
        "label": "Only take dates that teach you",
        "governingStats": { "cred": 1, "skill": 0.4 },
        "tags": ["studio", "risky", "tone"],
        "outcomes": {
          "bad": {
            "text": "You turn down easy money for hard dates and some of them humble you badly, playing with people miles ahead of you. Bruising. Educational. Underpaid.",
            "effects": { "cred": 3, "skill": 4, "money": 40 }
          },
          "good": {
            "text": "You chase the challenging sessions and level up fast, each hard date adding a tool to the kit. Slower money, faster mastery.",
            "effects": { "cred": 5, "skill": 6, "network": 3 }
          },
          "incredible": {
            "text": "By only playing over your head, you become frighteningly good frighteningly fast, and the legends start requesting the player who’s always reaching. Craft compounds.",
            "effects": { "cred": 6, "skill": 8, "network": 4, "pathProgress": 1 }
          }
        }
      }
    }
  },
  {
    "id": "np_st2_tone_quest",
    "act": 2,
    "pathAffinity": ["studio"],
    "weight": 10,
    "art": "ev_np_st2_tone_quest",
    "context": "A producer chasing a sound only you can hear",
    "prompt": "A producer describes the tone they want in pure metaphor — “warmer, but sadder, like a Sunday” — and everyone in the room looks at you. This is the real job of the studio legend: translating feelings into frequencies nobody else can find.",
    "recap": "A producer wants a tone in pure metaphor: “warmer, but sadder.”",
    "tags": ["studio", "tone"],
    "choices": {
      "left": {
        "label": "Chase the exact tone",
        "minigame": "mixdown",
        "governingStats": { "skill": 1, "creativity": 0.4 },
        "tags": ["studio", "tone", "safe"],
        "outcomes": {
          "bad": {
            "text": "You spend four hours chasing “sadder Sunday” and land on merely “fine Tuesday.” The producer settles. You know it’s not it. The clock, cruelly, wins.",
            "effects": { "skill": 4, "cred": 2, "burnout": 4 }
          },
          "good": {
            "text": "You find the tone — the exact warm-sad Sunday — and the whole room exhales. This is the alchemy that makes you irreplaceable. Feelings, dialed in.",
            "effects": { "skill": 6, "cred": 5, "network": 4 }
          },
          "incredible": {
            "text": "You conjure a tone so perfect the producer records it and studies it for years. You didn’t play a part; you invented a color. Legend, by frequency.",
            "effects": { "skill": 7, "cred": 7, "network": 4, "pathProgress": 1 }
          }
        }
      },
      "right": {
        "label": "Give them something better",
        "governingStats": { "creativity": 1, "skill": 0.3 },
        "tags": ["studio", "risky", "tone"],
        "outcomes": {
          "bad": {
            "text": "You offer your own interpretation instead of theirs and the producer wanted a translator, not a co-author. Politely overruled. Your idea was better. It doesn’t matter.",
            "effects": { "creativity": 3, "cred": 2, "burnout": 3 }
          },
          "good": {
            "text": "Your reinterpretation is better than what they asked for and they know it, and the track becomes something neither of you planned. Elevated by your ear.",
            "effects": { "creativity": 6, "cred": 5, "network": 3 }
          },
          "incredible": {
            "text": "You give them a tone they didn’t know to ask for and it defines the whole record, and word gets out: hire this player and get more than you ordered. Priceless reputation.",
            "effects": { "creativity": 8, "cred": 6, "network": 4, "pathProgress": 1 }
          }
        }
      }
    }
  },
  {
    "id": "np_st2_ghost_solo",
    "act": 2,
    "pathAffinity": ["studio"],
    "weight": 10,
    "art": "ev_np_st2_ghost_solo",
    "context": "A famous record, a nameless part",
    "prompt": "A superstar’s record needs the solo of the year and their guy can’t get it. You can. The catch, as always in this world: your name won’t be on it. Play it, and everyone hears you and nobody knows it’s you.",
    "recap": "A superstar’s record, the solo of the year, and no credit.",
    "tags": ["studio", "work"],
    "choices": {
      "left": {
        "label": "Play it, take the money",
        "minigame": "take",
        "governingStats": { "skill": 1 },
        "tags": ["studio", "work", "safe"],
        "outcomes": {
          "bad": {
            "text": "You nail the solo of the year and watch it get credited to a name that isn’t yours. The check is huge; the anonymity is a specific, quiet ache. You knew the deal.",
            "effects": { "skill": 4, "money": 180, "cred": -2 }
          },
          "good": {
            "text": "You play the solo, take the money, and quietly let the right people know it was you. In this world, the whisper network IS the credit. It travels.",
            "effects": { "skill": 6, "money": 200, "network": 5 }
          },
          "incredible": {
            "text": "The solo becomes the talked-about moment on a massive record, and the industry insiders all know exactly whose hands those were. Anonymous to the public, legendary to the players.",
            "effects": { "skill": 7, "money": 220, "cred": 5, "network": 4, "pathProgress": 1 }
          }
        }
      },
      "right": {
        "label": "Negotiate for a credit",
        "governingStats": { "network": 1, "cred": 0.3 },
        "tags": ["deal", "risky"],
        "outcomes": {
          "bad": {
            "text": "You push for a credit and they pull the offer and call someone more agreeable. You kept your principle and lost the solo of the year. It’s quiet in the studio now.",
            "effects": { "network": 2, "cred": 4 }
          },
          "good": {
            "text": "You negotiate a liner-notes credit, small but real, and set a precedent that follows you: this player gets named. Slowly, the whisper becomes a byline.",
            "effects": { "network": 5, "cred": 6, "money": 120 }
          },
          "incredible": {
            "text": "You get the credit AND the money AND the solo of the year with your actual name on it — and become the player who proved the anonymous game could be beaten. A new rung on the ladder.",
            "effects": { "network": 6, "cred": 7, "money": 180, "pathProgress": 1 }
          }
        }
      }
    }
  },
  {
    "id": "np_st2_bandleader",
    "act": 2,
    "pathAffinity": ["studio"],
    "weight": 10,
    "art": "ev_np_st2_bandleader",
    "context": "A session where you’re suddenly in charge",
    "prompt": "The bandleader doesn’t show and the producer looks at you: “You run it.” Suddenly you’re not just playing the parts, you’re calling them — the arrangement, the players, the whole feel. It’s a promotion nobody announced.",
    "recap": "The bandleader’s a no-show, and the producer points at you.",
    "tags": ["studio", "network"],
    "choices": {
      "left": {
        "label": "Take command",
        "governingStats": { "skill": 1, "network": 0.4 },
        "tags": ["studio", "risky", "work"],
        "outcomes": {
          "bad": {
            "text": "You run the session and it’s chaos — you know the notes but not yet the leadership, and the players smell the uncertainty. You get through it. Barely. You learned a lot.",
            "effects": { "skill": 4, "network": 3, "burnout": 5 }
          },
          "good": {
            "text": "You lead the room with quiet authority and the session comes together beautifully. The producer files away that you can run a date, not just play one. Big upgrade.",
            "effects": { "skill": 6, "network": 5, "cred": 4 }
          },
          "incredible": {
            "text": "You run the session so well the producer starts booking you AS the bandleader, the person who assembles and directs. You just leveled up from player to legend. That’s the whole path.",
            "effects": { "skill": 7, "network": 6, "cred": 5, "pathProgress": 1 }
          }
        }
      },
      "right": {
        "label": "Defer to the veterans",
        "governingStats": { "cred": 1, "network": 0.3 },
        "tags": ["studio", "safe"],
        "outcomes": {
          "bad": {
            "text": "You hand the reins to an older player out of respect and the session drifts leaderless. Humble, and a missed chance to show you could’ve carried it.",
            "effects": { "cred": 3, "network": 3 }
          },
          "good": {
            "text": "You lead by consensus, drawing out the veterans’ best while gently steering, and the collaborative session shines. Leadership through respect. They notice.",
            "effects": { "cred": 5, "network": 5, "skill": 3 }
          },
          "incredible": {
            "text": "Your servant-leadership makes the veterans play their best in years, and they leave telling everyone about the young leader who made them better. Reputation, gilded.",
            "effects": { "cred": 6, "network": 6, "skill": 4, "pathProgress": 1 }
          }
        }
      }
    }
  },
  {
    "id": "np_st2_chart_ghost",
    "act": 2,
    "pathAffinity": ["studio"],
    "weight": 9,
    "requires": { "chartingMin": 1 },
    "art": "ev_np_st2_chart_ghost",
    "context": "A hit on the radio, secretly yours",
    "prompt": "A song you played on is climbing the chart, and every time it comes on the radio you feel the specific pride and specific invisibility of the session legend. {song} is out there charting. Your hands are all over it. Your name is nowhere.",
    "recap": "A song you played on is climbing the chart, uncredited.",
    "tags": ["studio", "social"],
    "choices": {
      "left": {
        "label": "Let the work speak",
        "governingStats": { "cred": 1 },
        "tags": ["studio", "safe"],
        "outcomes": {
          "bad": {
            "text": "You stay silent and let the credit float to others, and the pride curdles slightly into “does anyone know.” The work is its own reward. Mostly. On good days.",
            "effects": { "cred": 4, "skill": 3 }
          },
          "good": {
            "text": "You take genuine satisfaction in the secret contribution, and the players who matter know your hands. That circle’s respect is the currency you actually want.",
            "effects": { "cred": 6, "network": 4 }
          },
          "incredible": {
            "text": "Your anonymous work on a hit becomes an open secret among the people who count, and your first-call status hits a new tier. The whisper network crowns you. Quietly. Completely.",
            "effects": { "cred": 7, "network": 5, "skill": 3, "pathProgress": 1 }
          }
        }
      },
      "right": {
        "label": "Quietly claim your part",
        "governingStats": { "network": 1, "cred": 0.3 },
        "tags": ["social", "risky"],
        "outcomes": {
          "bad": {
            "text": "You mention your role and it reads as trying to steal shine from the artist. A little backlash, a little truth, a lesson in how the game is played. You retreat.",
            "effects": { "network": 2, "cred": 3 }
          },
          "good": {
            "text": "You tastefully document your contribution and the right people amplify it, and suddenly “oh, THAT was you?” starts opening doors. Credit, claimed with grace.",
            "effects": { "network": 6, "cred": 4, "fame": 3 }
          },
          "incredible": {
            "text": "Your quiet claim goes over perfectly — humble, verifiable, undeniable — and turns your invisible discography into a visible resume that books you for years. The secret, monetized.",
            "effects": { "network": 7, "cred": 5, "fame": 4, "pathProgress": 1 }
          }
        }
      }
    }
  },
  {
    "id": "np_st2_union",
    "act": 2,
    "pathAffinity": ["studio"],
    "weight": 9,
    "art": "ev_np_st2_union",
    "context": "A picket line, a scab date, a choice",
    "prompt": "The session players’ union is striking for fair rates, and there’s a lucrative non-union date being offered to anyone who’ll cross. It pays double. Crossing would follow you forever in a world that remembers everything. Not crossing costs rent.",
    "recap": "The players’ union is striking; a non-union date pays double.",
    "tags": ["studio", "deal"],
    "choices": {
      "left": {
        "label": "Honor the line",
        "governingStats": { "cred": 1 },
        "tags": ["studio", "safe"],
        "outcomes": {
          "bad": {
            "text": "You turn down the scab date and walk the line and eat the lost income, and the strike drags on longer than anyone hoped. Solidarity is expensive and slow. You hold.",
            "effects": { "cred": 5, "network": 4, "money": -40 }
          },
          "good": {
            "text": "You honor the union and the players remember exactly who stood with them. When the strike ends, the solidarity converts into the deepest kind of professional loyalty.",
            "effects": { "cred": 6, "network": 6 }
          },
          "incredible": {
            "text": "You become a visible leader of the line, and when it’s won you’re the player everyone wants to work with — the one with a spine. Integrity becomes your most bookable asset.",
            "effects": { "cred": 8, "network": 7, "pathProgress": 1 }
          }
        }
      },
      "right": {
        "label": "Take the date, quietly",
        "governingStats": { "skill": 1, "network": 0.3 },
        "tags": ["work", "risky"],
        "outcomes": {
          "bad": {
            "text": "You cross for the money and it’s good money, and word gets out anyway because word always gets out. Some doors close permanently. The rent, at least, is paid.",
            "effects": { "skill": 3, "money": 250, "cred": -6 }
          },
          "good": {
            "text": "You take the date discreetly and the rent gets paid and only a few people ever know. You tell yourself survival isn’t betrayal. Mostly you believe it.",
            "effects": { "skill": 4, "money": 300, "cred": -3 }
          },
          "incredible": {
            "text": "You play the date so well the client keeps you on retainer at premium rates, and the money insulates you from the fallout. A cynical win that funds a decade. History judges; the bank doesn’t.",
            "effects": { "skill": 5, "money": 400, "network": 3 }
          }
        }
      }
    }
  },
  {
    "id": "np_st2_rival_session",
    "act": 2,
    "pathAffinity": ["studio"],
    "weight": 9,
    "art": "ev_np_st2_rival_session",
    "context": "{rival}, booked on the same date",
    "prompt": "The producer double-booked and now you and {rival} are both in the same session, both up for the same featured part. {rival} — {rivalVibe} — is warming up in the corner, loudly, playing the exact passage the producer keeps humming.",
    "recap": "Double-booked with {rival}, both up for the featured part.",
    "tags": ["studio", "rival"],
    "choices": {
      "left": {
        "label": "Out-play {rival}",
        "minigame": "take",
        "governingStats": { "skill": 1 },
        "tags": ["studio", "risky", "rival"],
        "outcomes": {
          "bad": {
            "text": "You try too hard to beat {rival} and overplay, and the producer gives {rival} the part for “serving the song.” Humbled in front of your rival. It burns for weeks.",
            "effects": { "skill": 3, "burnout": 4, "rivalry": 1 }
          },
          "good": {
            "text": "You take the featured part on pure taste and restraint, and {rival} has to sit there and hear you get it right. Sweet, professional victory.",
            "effects": { "skill": 6, "cred": 4, "rivalry": 1 }
          },
          "incredible": {
            "text": "You play the part so definitively the producer books you for the whole album and lets {rival} go home. A total rout, witnessed. {rival} will train for the rematch.",
            "effects": { "skill": 7, "cred": 5, "network": 4, "rivalry": 1, "pathProgress": 1 }
          }
        }
      },
      "right": {
        "label": "Propose you both play",
        "governingStats": { "creativity": 1, "network": 0.3 },
        "tags": ["studio", "rival"],
        "outcomes": {
          "bad": {
            "text": "You suggest a duet part and {rival} steamrolls the arrangement, taking the spotlight you offered to share. Generosity, exploited. You’ll be less generous next time.",
            "effects": { "creativity": 3, "cred": 2, "rivalry": 1 }
          },
          "good": {
            "text": "You and {rival} build an interlocking part greater than either alone, and the producer keeps both. Grudging mutual respect over a shared credit. The feud cools a degree.",
            "effects": { "creativity": 6, "cred": 4, "network": 3, "rivalry": -1 }
          },
          "incredible": {
            "text": "The two of you invent a two-player part so stunning it becomes the record’s signature, and producers start booking you as a duo. Rivals into a brand. {rival} can’t believe it works.",
            "effects": { "creativity": 8, "cred": 5, "network": 4, "rivalry": -1, "pathProgress": 1 }
          }
        }
      }
    }
  },
  {
    "id": "np_st2_masterclass",
    "act": 2,
    "pathAffinity": ["studio"],
    "weight": 9,
    "requires": { "stats": { "skillMin": 55 } },
    "art": "ev_np_st2_masterclass",
    "context": "A room of students, and you at the front",
    "prompt": "A music school asks you to teach a masterclass. It’s recognition that you’ve arrived — you’re someone worth learning from now. It’s also a whole afternoon of explaining things you do by instinct to people who need them made explicit.",
    "recap": "A music school wants you to teach a masterclass.",
    "tags": ["work", "network"],
    "choices": {
      "left": {
        "label": "Teach the technique",
        "governingStats": { "skill": 1 },
        "tags": ["work", "safe"],
        "outcomes": {
          "bad": {
            "text": "You try to teach your instinct as method and realize you don’t fully know how you do it. The students are patient. You leave with new questions about your own playing.",
            "effects": { "skill": 4, "cred": 3, "money": 60 }
          },
          "good": {
            "text": "Breaking down your craft to teach it sharpens your own understanding, and the students leave inspired. Teaching, it turns out, is a form of practice.",
            "effects": { "skill": 6, "cred": 4, "network": 4, "money": 80 }
          },
          "incredible": {
            "text": "Your masterclass becomes legendary among students, passed around as a recording, and a generation of players cite you as the one who cracked it open for them. Legacy, seeded.",
            "effects": { "skill": 7, "cred": 6, "network": 5, "pathProgress": 1 }
          }
        }
      },
      "right": {
        "label": "Teach the philosophy",
        "governingStats": { "cred": 1, "creativity": 0.3 },
        "tags": ["work", "risky"],
        "outcomes": {
          "bad": {
            "text": "You skip the technique for the deeper stuff and half the students wanted scales, not sermons. Some are moved; some are confused. Teaching is a coin flip you don’t control.",
            "effects": { "cred": 4, "creativity": 3, "money": 60 }
          },
          "good": {
            "text": "You teach them how to LISTEN, how to serve a song, the invisible stuff, and the ones who get it will never be the same players. You changed how they hear.",
            "effects": { "cred": 6, "creativity": 4, "network": 4, "money": 70 }
          },
          "incredible": {
            "text": "Your philosophy of playing becomes the thing students quote for decades — a way of thinking about music that outlasts any lick. You didn’t teach a class. You started a lineage.",
            "effects": { "cred": 8, "creativity": 5, "network": 5, "pathProgress": 1 }
          }
        }
      }
    }
  },
  {
    "id": "np_hf2_first_topline",
    "act": 2,
    "pathAffinity": ["hitfactory"],
    "weight": 11,
    "art": "ev_np_hf2_first_topline",
    "context": "A track, a booth, a blank melody to fill",
    "prompt": "A producer hands you an instrumental and a deadline: write the topline, the melody and hook that turns a beat into a song. This is the hit factory’s core skill. There’s a session singer waiting to record whatever you come up with.",
    "recap": "An instrumental, a deadline, and a topline to write.",
    "tags": ["write", "studio"],
    "choices": {
      "left": {
        "label": "Chase the undeniable hook",
        "minigame": "ideas",
        "governingStats": { "creativity": 1, "skill": 0.3 },
        "tags": ["write", "mainstream", "risky"],
        "outcomes": {
          "bad": {
            "text": "You reach for a monster hook and grab something merely catchy, the kind that’s gone by lunch. The producer nods politely. You know it’s not the one. You write it down anyway.",
            "effects": { "creativity": 3, "cred": 2, "writeSong": true }
          },
          "good": {
            "text": "You find a hook that sticks — the producer starts humming it, the singer nails it, and you can feel it has legs. This is the job, and you can do the job.",
            "effects": { "creativity": 6, "cred": 4, "writeSong": true }
          },
          "incredible": {
            "text": "You write a topline so undeniable the whole room knows it’s a hit the second the singer lands it. This is the sound of a hit factory turning on. Yours.",
            "effects": { "creativity": 8, "cred": 5, "fame": 3, "writeSong": true, "pathProgress": 1 }
          }
        }
      },
      "right": {
        "label": "Write something that lasts",
        "governingStats": { "creativity": 1 },
        "tags": ["write", "indie"],
        "outcomes": {
          "bad": {
            "text": "You aim for depth over catchiness and the producer wanted catchy. “Too clever,” they say, which stings because it’s a compliment and a rejection at once.",
            "effects": { "creativity": 4, "cred": 3, "writeSong": true }
          },
          "good": {
            "text": "You write a topline with actual soul, and it turns out soul is also catchy when done right. The producer gets more than they ordered and keeps it.",
            "effects": { "creativity": 6, "cred": 5, "writeSong": true }
          },
          "incredible": {
            "text": "You write a topline that’s both a hit AND a real song, the rarest combination in the building, and the producer realizes they’ve found a writer, not a hook machine. Your phone won’t stop now.",
            "effects": { "creativity": 8, "cred": 6, "fame": 3, "writeSong": true, "pathProgress": 1 }
          }
        }
      }
    }
  },
  {
    "id": "np_hf2_splits_meeting",
    "act": 2,
    "pathAffinity": ["hitfactory"],
    "weight": 10,
    "art": "ev_np_hf2_splits_meeting",
    "context": "Eleven writers, one song, one pie",
    "prompt": "The splits meeting: eleven people in a room deciding who gets what percentage of a song that four of them actually wrote. You’re one of the four. The other seven have lawyers. The pie is only so big and everyone brought a fork.",
    "recap": "Eleven people, one song’s splits, seven of them lawyered up.",
    "tags": ["deal", "write"],
    "choices": {
      "left": {
        "label": "Fight for your share",
        "governingStats": { "network": 1, "cred": 0.3 },
        "tags": ["deal", "risky"],
        "outcomes": {
          "bad": {
            "text": "You fight for your full percentage and win it and make three enemies with lawyers. The money’s fair; the room is now colder. Publishing is a contact sport.",
            "effects": { "network": 3, "money": 150, "cred": -2 }
          },
          "good": {
            "text": "You advocate firmly for your real contribution and land a fair split, and the room respects that you knew your worth and stated it cleanly. Business, done right.",
            "effects": { "network": 5, "money": 200, "cred": 3 }
          },
          "incredible": {
            "text": "You navigate the splits so deftly you get your fair share AND broker peace among the sharks, and everyone leaves wanting you in their next session. The writer who’s also a diplomat.",
            "effects": { "network": 6, "money": 280, "cred": 4, "pathProgress": 1 }
          }
        }
      },
      "right": {
        "label": "Take less, keep the peace",
        "governingStats": { "network": 1 },
        "tags": ["deal", "safe"],
        "outcomes": {
          "bad": {
            "text": "You take a smaller cut to avoid the fight and later realize the sharks read your grace as weakness. Poorer and typecast as the pushover. A costly lesson in kindness.",
            "effects": { "network": 3, "money": 90 }
          },
          "good": {
            "text": "You take a modest split and bank the goodwill, and the goodwill converts into three more sessions from people who love working with you. The long game pays.",
            "effects": { "network": 6, "money": 120, "cred": 2 }
          },
          "incredible": {
            "text": "Your generosity in the splits meeting becomes your reputation — the writer who’s not greedy — and it makes you the most-requested collaborator in the building. Less pie, more pies.",
            "effects": { "network": 8, "money": 150, "cred": 3, "pathProgress": 1 }
          }
        }
      }
    }
  },
  {
    "id": "np_hf2_write_camp",
    "act": 2,
    "pathAffinity": ["hitfactory"],
    "weight": 10,
    "art": "ev_np_hf2_write_camp",
    "context": "A writing camp, a mansion, a deadline",
    "prompt": "A writing camp: a rented mansion, a dozen writers, a superstar arriving Friday to pick the songs. Three days to write something they’ll take. It’s a pressure cooker and a networking event and a marathon, all at once.",
    "recap": "A writing camp: a mansion, a superstar arriving Friday.",
    "tags": ["write", "network"],
    "choices": {
      "left": {
        "label": "Grind out volume",
        "governingStats": { "creativity": 1, "skill": 0.3 },
        "tags": ["write", "work", "risky"],
        "outcomes": {
          "bad": {
            "text": "You write nine songs in three days and they’re all fine and none of them get picked. Volume without a peak. You leave exhausted and empty-handed. But faster now.",
            "effects": { "creativity": 4, "burnout": 6, "writeSong": true }
          },
          "good": {
            "text": "You crank out songs and one of them catches the superstar’s ear. The volume approach works when one lands. And one landed. That’s the whole game.",
            "effects": { "creativity": 6, "network": 4, "writeSong": true }
          },
          "incredible": {
            "text": "You write so much good material that the superstar takes two, and the other writers start asking to be in YOUR room. A hit factory within the hit factory. Yours.",
            "effects": { "creativity": 7, "network": 5, "fame": 3, "writeSong": true, "pathProgress": 1 }
          }
        }
      },
      "right": {
        "label": "Bet everything on one song",
        "minigame": "ideas",
        "governingStats": { "creativity": 1 },
        "tags": ["write", "risky", "indie"],
        "outcomes": {
          "bad": {
            "text": "You pour all three days into one perfect song and the superstar picks someone else’s. All eggs, one basket, no eggs. The song’s a keeper though — for someone.",
            "effects": { "creativity": 5, "burnout": 4, "writeSong": true }
          },
          "good": {
            "text": "Your one perfect song is undeniable and the superstar takes it on the spot. Quality over quantity, vindicated in a rented mansion.",
            "effects": { "creativity": 7, "network": 4, "cred": 3, "writeSong": true }
          },
          "incredible": {
            "text": "Your single song is so good it becomes the superstar’s next single AND the story of the camp, and every writer there now wants to work with the one who bet it all and won.",
            "effects": { "creativity": 9, "network": 5, "fame": 4, "writeSong": true, "pathProgress": 1 }
          }
        }
      }
    }
  },
  {
    "id": "np_hf2_the_placement",
    "act": 2,
    "pathAffinity": ["hitfactory"],
    "weight": 10,
    "requires": { "demoMin": 1 },
    "art": "ev_np_hf2_the_placement",
    "context": "A superstar wants one of your songs",
    "prompt": "A superstar’s people heard one of your demos and want it — for them, as a single, with your name in tiny print. It would be a smash in their voice and a paycheck in your pocket and a song you wrote leaving home forever.",
    "recap": "A superstar wants your demo, with your name in tiny print.",
    "tags": ["deal", "write"],
    "choices": {
      "left": {
        "label": "Give them the song",
        "governingStats": { "network": 1 },
        "tags": ["deal", "mainstream", "safe"],
        "outcomes": {
          "bad": {
            "text": "You hand over your best demo and their version sands off everything you loved about it into a glossy hit. It charts high. It’s not yours anymore. The check helps.",
            "effects": { "network": 4, "money": 250, "releaseDemo": 55, "cred": -2 }
          },
          "good": {
            "text": "The superstar’s version of your song becomes a legit hit, and your name in the credits starts opening every door in the building. Your song, their voice, your career.",
            "effects": { "network": 6, "money": 300, "releaseDemo": 65, "fame": 3 }
          },
          "incredible": {
            "text": "Your song becomes the superstar’s biggest hit, and “written by” becomes the most valuable three words on your resume. You’re the ghost behind the throne now. Exactly the plan.",
            "effects": { "network": 7, "money": 400, "releaseDemo": 72, "fame": 4, "pathProgress": 1 }
          }
        }
      },
      "right": {
        "label": "Keep it for yourself",
        "governingStats": { "creativity": 1, "cred": 0.3 },
        "tags": ["indie", "risky"],
        "outcomes": {
          "bad": {
            "text": "You keep your best song and release it yourself to a fraction of the audience the superstar would’ve reached. Pride intact, ceiling lowered. You’ll always wonder.",
            "effects": { "creativity": 4, "cred": 4, "releaseDemo": 55 }
          },
          "good": {
            "text": "You keep the song and your version, smaller but truer, earns you a devoted core who value that you didn’t sell your best. Ownership as a statement.",
            "effects": { "creativity": 6, "cred": 6, "releaseDemo": 62, "fame": 3 }
          },
          "incredible": {
            "text": "You keep the song and it becomes YOUR hit, proving you don’t need to be anyone’s ghostwriter — you can be the artist. The superstar, in the end, covers YOU. Full reversal.",
            "effects": { "creativity": 8, "cred": 7, "releaseDemo": 70, "fame": 5, "pathProgress": 1 }
          }
        }
      }
    }
  },
  {
    "id": "np_hf2_trend_arb",
    "act": 2,
    "pathAffinity": ["hitfactory"],
    "weight": 9,
    "art": "ev_np_hf2_trend_arb",
    "context": "A sound about to blow up, if you move now",
    "prompt": "You’ve spotted the next sound before it breaks — you can hear it forming in the margins. Write in it now and you’re ahead of the wave; wait and you’re just another follower. Trend arbitrage is a hit factory superpower, and a gamble on your own ears.",
    "recap": "You can hear the next sound forming before it breaks.",
    "tags": ["write", "social"],
    "choices": {
      "left": {
        "label": "Bet on the trend early",
        "minigame": "ideas",
        "governingStats": { "creativity": 1, "network": 0.3 },
        "tags": ["write", "mainstream", "risky"],
        "outcomes": {
          "bad": {
            "text": "You bet on a sound that doesn’t break, and now you’ve got a folder of songs in a genre nobody wanted. Ahead of the curve, or just wrong. The market decides. It said no.",
            "effects": { "creativity": 4, "burnout": 4, "writeSong": true }
          },
          "good": {
            "text": "Your ears were right — the sound breaks and you’re already fluent in it while everyone else scrambles to catch up. First-mover advantage, cashed.",
            "effects": { "creativity": 6, "network": 4, "fame": 3, "writeSong": true }
          },
          "incredible": {
            "text": "You call the trend perfectly and become one of the architects of the new sound, the writer everyone credits when the wave crests. You didn’t follow the future; you wrote it.",
            "effects": { "creativity": 8, "network": 5, "fame": 5, "writeSong": true, "pathProgress": 1 }
          }
        }
      },
      "right": {
        "label": "Write against the trend",
        "governingStats": { "creativity": 1, "cred": 0.3 },
        "tags": ["write", "indie"],
        "outcomes": {
          "bad": {
            "text": "You deliberately write against the coming wave and the market, mid-wave, has no room for a contrarian. Early, or just stubborn. Time will tell. It usually says “too early.”",
            "effects": { "creativity": 4, "cred": 4, "writeSong": true }
          },
          "good": {
            "text": "You write the antidote to the trend and, once everyone’s sick of the wave, your counter-programming is exactly what they crave. Patience, rewarded.",
            "effects": { "creativity": 6, "cred": 5, "fame": 3, "writeSong": true }
          },
          "incredible": {
            "text": "Your anti-trend songs become the reset the whole culture was waiting for, and you’re crowned the writer who ended a played-out sound. Contrarian genius, confirmed.",
            "effects": { "creativity": 8, "cred": 6, "fame": 5, "writeSong": true, "pathProgress": 1 }
          }
        }
      }
    }
  },
  {
    "id": "np_hf2_vault_build",
    "act": 2,
    "pathAffinity": ["hitfactory"],
    "weight": 9,
    "art": "ev_np_hf2_vault_build",
    "context": "A hard drive filling with unreleased gold",
    "prompt": "You’re writing faster than you can place, and the vault is filling with songs — some good, some great, all homeless. A hit factory’s real wealth is its catalog. The question is whether to hoard the gems or flood the market.",
    "recap": "The vault fills with unplaced songs faster than you can place them.",
    "tags": ["write", "deal"],
    "choices": {
      "left": {
        "label": "Hoard the best, place the rest",
        "governingStats": { "creativity": 1, "network": 0.3 },
        "tags": ["write", "safe"],
        "outcomes": {
          "bad": {
            "text": "You sit on your best songs waiting for the perfect placement that never quite comes, and the gems age in the vault. Patience or paralysis? The hard drive doesn’t say.",
            "effects": { "creativity": 4, "polishDemo": 6 }
          },
          "good": {
            "text": "You strategically place the good songs and vault the great ones, building both income and a reserve of undeniable material for when it counts. The catalog compounds.",
            "effects": { "creativity": 6, "network": 4, "money": 100, "polishDemo": 8 }
          },
          "incredible": {
            "text": "Your vault becomes an industry legend — “the folder of unreleased hits” — and its mere existence gives you leverage in every negotiation. Wealth measured in withheld songs.",
            "effects": { "creativity": 7, "network": 5, "money": 150, "pathProgress": 1 }
          }
        }
      },
      "right": {
        "label": "Flood the market",
        "governingStats": { "network": 1 },
        "tags": ["deal", "risky"],
        "outcomes": {
          "bad": {
            "text": "You place everything fast and the market gets diluted with your name, some hits, mostly filler. Ubiquity without prestige. You’re everywhere and worth slightly less for it.",
            "effects": { "network": 4, "money": 180, "cred": -2 }
          },
          "good": {
            "text": "You get your songs into everyone’s hands and volume becomes its own kind of dominance — you’re on so many records you’re unavoidable. The factory hums.",
            "effects": { "network": 6, "money": 250, "fame": 3 }
          },
          "incredible": {
            "text": "You flood the market so effectively that a full third of what’s charting has your fingerprints on it, and you become the invisible engine of the season. Ubiquity as power.",
            "effects": { "network": 7, "money": 350, "fame": 4, "pathProgress": 1 }
          }
        }
      }
    }
  },
  {
    "id": "np_hf2_the_muse",
    "act": 2,
    "pathAffinity": ["hitfactory"],
    "weight": 9,
    "art": "ev_np_hf2_the_muse",
    "context": "A voice that makes everything you write better",
    "prompt": "You find a session singer whose voice turns your decent demos into undeniable ones. Every writer eventually finds their muse — the voice that unlocks their best work. Do you build around them, or keep your options open?",
    "recap": "A session singer whose voice turns your demos undeniable.",
    "tags": ["write", "network"],
    "choices": {
      "left": {
        "label": "Build a partnership",
        "governingStats": { "network": 1, "creativity": 0.4 },
        "tags": ["write", "safe", "band"],
        "outcomes": {
          "bad": {
            "text": "You commit to the singer and they get a solo deal and vanish, taking your best collaborator era with them. You bet on a partnership and it walked. It happens.",
            "effects": { "network": 3, "creativity": 3, "writeSong": true }
          },
          "good": {
            "text": "You and the singer become a genuine writing partnership, and the songs get better and better as you learn each other’s instincts. Two halves of a hit machine.",
            "effects": { "network": 5, "creativity": 5, "writeSong": true }
          },
          "incredible": {
            "text": "Your partnership becomes one of those legendary writer-voice duos whose songs define an era. Together you’re unstoppable; apart you’re just very good. You choose together.",
            "effects": { "network": 6, "creativity": 7, "fame": 4, "writeSong": true, "pathProgress": 1 }
          }
        }
      },
      "right": {
        "label": "Stay a free agent",
        "governingStats": { "creativity": 1 },
        "tags": ["write", "risky"],
        "outcomes": {
          "bad": {
            "text": "You keep your options open and dilute your best work across a dozen voices, none of which fit like the muse did. Freedom, and a nagging what-if. The songs are fine. Just fine.",
            "effects": { "creativity": 4, "network": 3, "writeSong": true }
          },
          "good": {
            "text": "You write for many voices and become a chameleon, able to tailor a song to anyone — a versatility that keeps you booked across the whole industry. Range as an asset.",
            "effects": { "creativity": 6, "network": 5, "writeSong": true }
          },
          "incredible": {
            "text": "Your refusal to be tied to one voice makes you the writer who can conjure a hit for ANYONE, and the whole industry’s roster becomes your palette. Freedom, mastered. The factory has no walls.",
            "effects": { "creativity": 8, "network": 6, "fame": 4, "writeSong": true, "pathProgress": 1 }
          }
        }
      }
    }
  },
  {
    "id": "np_hf2_instant_classic",
    "act": 2,
    "pathAffinity": ["hitfactory"],
    "weight": 8,
    "requires": { "stats": { "creativityMin": 55 } },
    "art": "ev_np_hf2_instant_classic",
    "context": "A song that arrives fully formed",
    "prompt": "Once in a while a song just arrives — whole, perfect, like you’re taking dictation from somewhere better than yourself. You have one of those right now, humming complete in your head. These are the ones careers are built on. Don’t drop it.",
    "recap": "A song arrived whole, complete, humming in your head.",
    "tags": ["write", "studio"],
    "choices": {
      "left": {
        "label": "Cut it fast, keep the magic",
        "minigame": "take",
        "governingStats": { "creativity": 1, "skill": 0.3 },
        "tags": ["write", "risky"],
        "outcomes": {
          "bad": {
            "text": "You rush to capture it and the demo is rough enough that the magic leaks out in the recording. You’ll re-cut it and it’ll never be quite as alive as it was in your head. Close.",
            "effects": { "creativity": 5, "writeSong": true }
          },
          "good": {
            "text": "You catch the song at full strength, and even the rough demo makes people stop and listen. Some songs you don’t write so much as receive. This is one.",
            "effects": { "creativity": 7, "cred": 4, "writeSong": true }
          },
          "incredible": {
            "text": "You capture lightning — a song so complete and so undeniable it becomes an instant classic, the kind other writers study. This is the one. You knew it the second it arrived. You didn’t drop it.",
            "effects": { "creativity": 9, "cred": 5, "fame": 4, "hits": 1, "chartTitle": "The One That Arrived", "pathProgress": 1 }
          }
        }
      },
      "right": {
        "label": "Perfect it before anyone hears",
        "governingStats": { "creativity": 1, "skill": 0.4 },
        "tags": ["studio", "safe", "tone"],
        "outcomes": {
          "bad": {
            "text": "You polish the perfect song and polish out its soul, ending up with something flawless and slightly dead. You had lightning and you framed it under glass. Beautiful. Static.",
            "effects": { "creativity": 4, "skill": 3, "writeSong": true }
          },
          "good": {
            "text": "You take the time to build the perfect song a perfect production, and the result is a genuine masterpiece — the rare case where polish added instead of subtracted.",
            "effects": { "creativity": 7, "skill": 4, "cred": 4, "writeSong": true }
          },
          "incredible": {
            "text": "You give the perfect song the perfect frame and it becomes a defining hit — the one that proves you can execute at the highest level, not just catch a spark. Craft AND magic. Rare air.",
            "effects": { "creativity": 8, "skill": 5, "cred": 5, "hits": 1, "chartTitle": "The One You Perfected", "pathProgress": 1 }
          }
        }
      }
    }
  },
  {
    "id": "np_hf2_rival_writer",
    "act": 2,
    "pathAffinity": ["hitfactory"],
    "weight": 9,
    "art": "ev_np_hf2_rival_writer",
    "context": "{rival}, in the next writing room",
    "prompt": "{rival} is writing for the same artists you are, and word is they landed the cut you were promised. {rivalVibe}, and now they’re in the room next door at the same camp, and you can hear, faintly, that their hook is good. Annoyingly good.",
    "recap": "{rival} landed the cut you were promised, one room over.",
    "tags": ["write", "rival"],
    "choices": {
      "left": {
        "label": "Out-write {rival}",
        "minigame": "ideas",
        "governingStats": { "creativity": 1 },
        "tags": ["write", "risky", "rival"],
        "outcomes": {
          "bad": {
            "text": "You try to out-hook {rival} and force it, and the artist takes {rival}’s song anyway because yours smells like effort. Beaten at your own game, next door. Loud.",
            "effects": { "creativity": 4, "burnout": 4, "rivalry": 1 }
          },
          "good": {
            "text": "You channel the rivalry into your sharpest hook in months and take the cut back. {rival} hears the artist pick yours through the wall. Delicious.",
            "effects": { "creativity": 6, "cred": 4, "writeSong": true, "rivalry": 1 }
          },
          "incredible": {
            "text": "You write circles around {rival} and land three cuts to their zero, and {rival} spends the rest of the camp studying your door. The rivalry made you write your best. It always does.",
            "effects": { "creativity": 8, "cred": 5, "fame": 3, "writeSong": true, "rivalry": 1, "pathProgress": 1 }
          }
        }
      },
      "right": {
        "label": "Write it together",
        "governingStats": { "creativity": 1, "network": 0.3 },
        "tags": ["write", "rival", "band"],
        "outcomes": {
          "bad": {
            "text": "You knock on {rival}’s door and propose a co-write, and {rival} takes your best idea and puts their name first on it. Collaboration, weaponized. You’ll be warier next time.",
            "effects": { "creativity": 3, "network": 3, "rivalry": 1 }
          },
          "good": {
            "text": "You and {rival} combine your hooks into one monster song and split it fairly, and the grudging co-write is the best either of you has done. Rivals make good writing partners, apparently.",
            "effects": { "creativity": 6, "network": 4, "writeSong": true, "rivalry": -1 }
          },
          "incredible": {
            "text": "Your reluctant collaboration with {rival} produces a career-defining hit for you both, and the industry’s two best writers become an unbeatable team. The feud dissolves into a dynasty.",
            "effects": { "creativity": 8, "network": 5, "fame": 4, "writeSong": true, "rivalry": -1, "pathProgress": 1 }
          }
        }
      }
    }
  },
  {
    "id": "np_ms3_world_tour",
    "act": 3,
    "pathAffinity": ["megastar"],
    "weight": 11,
    "art": "ev_np_ms3_world_tour",
    "context": "A map with your name in cities you’ve never seen",
    "prompt": "The world tour: continents, time zones, arenas full of people singing your words back in accents you don’t recognize. It’s the dream, fully realized, and it will take everything you have and possibly a little more than that.",
    "recap": "The world tour: continents, time zones, arenas of strangers.",
    "tags": ["tour", "live"],
    "choices": {
      "left": {
        "label": "Give every city everything",
        "minigame": "crowd",
        "governingStats": { "skill": 1, "creativity": 0.3 },
        "tags": ["live", "risky", "fame"],
        "outcomes": {
          "bad": {
            "text": "You leave it all on every stage and by the third continent you’re running on fumes and adrenaline. The shows are huge; you’re disappearing into them. Glorious, dangerous.",
            "effects": { "skill": 4, "fame": 12, "burnout": 9 }
          },
          "good": {
            "text": "You conquer the world one arena at a time, and the sight of strangers across the planet knowing your songs is the purest thing fame has ever given you. Global, and grateful.",
            "effects": { "skill": 6, "fame": 18, "network": 5, "burnout": 5 }
          },
          "incredible": {
            "text": "The world tour becomes a phenomenon, records broken on every continent, and you return a genuinely global star. The kid at the open mic could never have imagined this. You did it.",
            "effects": { "skill": 7, "fame": 26, "cred": 4, "pathProgress": 1 }
          }
        }
      },
      "right": {
        "label": "Pace it to survive it",
        "governingStats": { "network": 1, "cred": 0.3 },
        "tags": ["tour", "safe"],
        "outcomes": {
          "bad": {
            "text": "You pace yourself carefully and a few critics call the shows “professional,” which is the polite word for “not on fire.” Sustainable, slightly muted. You finish the tour intact, at least.",
            "effects": { "network": 4, "fame": 10, "burnout": 2 }
          },
          "good": {
            "text": "You build a tour you can actually survive — real rest, real boundaries — and the consistency means every show is strong instead of a gamble. The long game, at global scale.",
            "effects": { "network": 6, "fame": 14, "burnout": -2 }
          },
          "incredible": {
            "text": "Your sustainably-run world tour becomes the model everyone copies — huge, humane, and repeatable — and you prove you can be a megastar without burning down. The rare star who lasts.",
            "effects": { "network": 7, "fame": 20, "cred": 4, "pathProgress": 1 }
          }
        }
      }
    }
  },
  {
    "id": "np_ms3_the_persona",
    "act": 3,
    "pathAffinity": ["megastar"],
    "weight": 10,
    "requires": { "fameMin": 70 },
    "art": "ev_np_ms3_the_persona",
    "context": "The mask, and the face underneath it",
    "prompt": "The fame persona you built has calcified — the public you is so big and so specific that the private you barely fits behind it anymore. You catch yourself performing the character even alone. It’s a question every megastar eventually faces: who’s left under there?",
    "recap": "The public persona has calcified; the private you barely fits.",
    "tags": ["fame", "home"],
    "choices": {
      "left": {
        "label": "Become the persona fully",
        "governingStats": { "network": 1 },
        "tags": ["fame", "mainstream", "risky"],
        "outcomes": {
          "bad": {
            "text": "You let the character eat the person and it works for the fame and quietly hollows you out. The megastar thrives; you’re not sure who’s home anymore. The shows are incredible, though.",
            "effects": { "network": 4, "fame": 14, "cred": -4, "burnout": 5 }
          },
          "good": {
            "text": "You fully commit to the larger-than-life persona and, freed from your own smallness, you become a genuinely iconic figure. The mask, worn confidently, becomes a real face.",
            "effects": { "network": 5, "fame": 18, "cred": 2 }
          },
          "incredible": {
            "text": "You inhabit the persona so completely it transcends performance and becomes a kind of mythology — you’re not a person being famous, you’re an icon. Bowie territory. Total transformation.",
            "effects": { "network": 6, "fame": 24, "cred": 3, "pathProgress": 1 }
          }
        }
      },
      "right": {
        "label": "Reclaim the real you",
        "governingStats": { "cred": 1, "creativity": 0.3 },
        "tags": ["home", "risky"],
        "outcomes": {
          "bad": {
            "text": "You try to shed the persona and confuse a public that fell in love with the character, and the fame wobbles as you figure out who you are without it. Honest, destabilizing.",
            "effects": { "cred": 4, "fame": 6, "burnout": 4 }
          },
          "good": {
            "text": "You let the real you show through the fame and it turns out people love the human even more than the icon. Vulnerability at scale becomes your superpower.",
            "effects": { "cred": 6, "fame": 12, "creativity": 4 }
          },
          "incredible": {
            "text": "You dismantle the persona in public and the raw honesty of it becomes the most powerful thing you’ve ever done — fame built on truth instead of performance. The realest megastar there is.",
            "effects": { "cred": 8, "fame": 18, "creativity": 5, "pathProgress": 1 }
          }
        }
      }
    }
  },
  {
    "id": "np_ms3_stadium_anthem",
    "act": 3,
    "pathAffinity": ["megastar"],
    "weight": 10,
    "art": "ev_np_ms3_stadium_anthem",
    "context": "A song that a whole stadium could sing",
    "prompt": "You have a shot at writing the thing every megastar dreams of: an anthem. A song built for a hundred thousand voices, simple and huge and impossible to forget. Anthems are a different craft — bigger, blunter, and much easier to get wrong.",
    "recap": "A shot at the anthem — a song for a hundred thousand voices.",
    "tags": ["write", "live"],
    "choices": {
      "left": {
        "label": "Write the massive anthem",
        "governingStats": { "creativity": 1, "skill": 0.3 },
        "tags": ["write", "mainstream", "risky"],
        "outcomes": {
          "bad": {
            "text": "You reach for anthemic and land on generic — big, empty, a stadium chant with nothing under it. The crowd will sing it and forget it by the parking lot. Loud, hollow.",
            "effects": { "creativity": 3, "fame": 6, "writeSong": true }
          },
          "good": {
            "text": "You write a genuine anthem — huge and simple and somehow still yours — and the first time a crowd sings it back you understand what all of this was for.",
            "effects": { "creativity": 6, "fame": 14, "cred": 3, "writeSong": true }
          },
          "incredible": {
            "text": "You write THE anthem — the one that outlives you, sung at graduations and funerals and sporting events by people who don’t know your name. Immortality in four chords. The dream, achieved.",
            "effects": { "creativity": 8, "fame": 22, "cred": 5, "hits": 1, "chartTitle": "The Anthem", "pathProgress": 1 }
          }
        }
      },
      "right": {
        "label": "Keep the intimacy at scale",
        "governingStats": { "creativity": 1, "cred": 0.3 },
        "tags": ["write", "indie"],
        "outcomes": {
          "bad": {
            "text": "You try to write something intimate that still fills a stadium and it gets lost in the big rooms — too quiet for the scale you’re playing. A beautiful song, wrong venue.",
            "effects": { "creativity": 4, "cred": 4, "writeSong": true }
          },
          "good": {
            "text": "You pull off the hardest trick — a song that feels personal to each of a hundred thousand people at once. Intimacy that scales is the rarest gift. You have it.",
            "effects": { "creativity": 7, "fame": 12, "cred": 5, "writeSong": true }
          },
          "incredible": {
            "text": "You write a song so intimate and so enormous at once that a stadium falls silent to hear it, then weeps to sing it. You proved big doesn’t have to mean shallow. Redefined the form.",
            "effects": { "creativity": 9, "fame": 18, "cred": 6, "writeSong": true, "pathProgress": 1 }
          }
        }
      }
    }
  },
  {
    "id": "np_ms3_award_show",
    "act": 3,
    "pathAffinity": ["megastar"],
    "weight": 10,
    "requires": { "fameMin": 65 },
    "art": "ev_np_ms3_award_show",
    "context": "The big award show, your name a nominee",
    "prompt": "The biggest awards night, and you’re nominated in the categories that matter. Cameras everywhere, the whole industry watching, and a performance slot that could define your year. Win or lose, tonight is a stage the size of the culture.",
    "recap": "The biggest awards night, and you’re nominated where it counts.",
    "tags": ["fame", "live"],
    "choices": {
      "left": {
        "label": "Deliver a showstopper performance",
        "minigame": "prompter",
        "governingStats": { "skill": 1, "creativity": 0.4 },
        "tags": ["live", "mainstream", "risky"],
        "outcomes": {
          "bad": {
            "text": "Your big awards performance is ambitious and slightly over-produced, and the internet clips the one wobble instead of the whole. Live TV is a cruel editor. You survive it.",
            "effects": { "skill": 4, "fame": 10, "burnout": 5 }
          },
          "good": {
            "text": "You deliver a performance people talk about for weeks, win or lose, and cement yourself as one of the artists who show UP when the whole world is watching.",
            "effects": { "skill": 6, "fame": 16, "cred": 4 }
          },
          "incredible": {
            "text": "Your awards performance becomes THE moment of the night — the clip, the meme, the thing that trends for a week — and you walk off having stolen the whole show. Icon status, televised.",
            "effects": { "skill": 7, "fame": 24, "cred": 5, "pathProgress": 1 }
          }
        }
      },
      "right": {
        "label": "Let the win speak, play it cool",
        "governingStats": { "cred": 1, "network": 0.3 },
        "tags": ["fame", "safe"],
        "outcomes": {
          "bad": {
            "text": "You play the reserved elder-statesman and lose the award and the reserved posture reads as sour. A quiet night that photographs as a snub. You’ll get the next one. Probably.",
            "effects": { "cred": 4, "fame": 6 }
          },
          "good": {
            "text": "You keep your composure, give a gracious speech whether you win or not, and the class of it earns a respect that flashier moments can’t. Dignity, on the biggest stage.",
            "effects": { "cred": 6, "fame": 12, "network": 4 }
          },
          "incredible": {
            "text": "You win the big one and give a speech so genuine and so perfectly pitched it becomes the most-shared moment of the night. Grace under the brightest lights. The industry’s new favorite.",
            "effects": { "cred": 7, "fame": 20, "network": 5, "pathProgress": 1 }
          }
        }
      }
    }
  },
  {
    "id": "np_ms3_sell_out_show",
    "act": 3,
    "pathAffinity": ["megastar"],
    "weight": 10,
    "art": "ev_np_ms3_sell_out_show",
    "context": "The biggest room in the world, sold out, tonight",
    "prompt": "The venue you dreamed about as a kid — the legendary one — sold out, tonight, your name on the marquee in letters visible from space. Everyone you ever knew is watching. This is the summit made literal. All you have to do is walk out there.",
    "recap": "The legendary venue, sold out, your name on the marquee.",
    "tags": ["live", "fame"],
    "choices": {
      "left": {
        "label": "Make it the greatest night ever",
        "minigame": "crowd",
        "governingStats": { "skill": 1, "creativity": 0.4 },
        "tags": ["live", "risky", "fame"],
        "outcomes": {
          "bad": {
            "text": "The weight of the moment gets you and you play the biggest show of your life slightly outside your own body, watching yourself do it. Great by any normal measure. Haunted by what it could’ve been.",
            "effects": { "skill": 5, "fame": 12, "burnout": 6 }
          },
          "good": {
            "text": "You rise fully to the biggest night of your career and it’s everything — the room, the roar, the realization that you actually made it here. You’ll remember this until you die.",
            "effects": { "skill": 7, "fame": 20, "cred": 5 }
          },
          "incredible": {
            "text": "You give the show of a generation, the one people will lie about having attended, and the recording becomes a landmark. The summit, and you planted a flag that stays. Total triumph.",
            "effects": { "skill": 8, "fame": 28, "cred": 6, "pathProgress": 1 }
          }
        }
      },
      "right": {
        "label": "Make it about the people who got you here",
        "governingStats": { "cred": 1, "network": 0.3 },
        "tags": ["live", "home"],
        "outcomes": {
          "bad": {
            "text": "You fill the show with tributes and guests and personal moments, and some of the huge crowd wanted the hits, not the yearbook. Heartfelt, a touch self-indulgent. Your people loved it.",
            "effects": { "cred": 5, "fame": 10, "network": 3 }
          },
          "good": {
            "text": "You turn the biggest night into a celebration of everyone who built it with you — the band, the fans, the hometown — and the generosity makes it transcend a mere concert. Communion, at scale.",
            "effects": { "cred": 7, "fame": 16, "network": 5 }
          },
          "incredible": {
            "text": "You make the summit show a love letter to the whole journey, and it becomes legendary not for spectacle but for heart — the megastar who never forgot the open mic. That’s the story that lasts.",
            "effects": { "cred": 8, "fame": 22, "network": 6, "pathProgress": 1 }
          }
        }
      }
    }
  },
  {
    "id": "np_ms3_rival_summit",
    "act": 3,
    "pathAffinity": ["megastar"],
    "weight": 9,
    "art": "ev_np_ms3_rival_summit",
    "context": "{rival}, at the top with you now",
    "prompt": "You and {rival} both made it to the top, against all odds, together. {rivalVibe}, and now you’re both headlining the same mega-festival on the same night, on different stages, at the same time. The promoter did this on purpose. The fans have to choose.",
    "recap": "You and {rival} headlining the same festival, same night.",
    "tags": ["live", "rival"],
    "choices": {
      "left": {
        "label": "Win the head-to-head",
        "minigame": "crowd",
        "governingStats": { "skill": 1, "creativity": 0.3 },
        "tags": ["live", "risky", "rival"],
        "outcomes": {
          "bad": {
            "text": "You throw everything at beating {rival}’s crowd and pull the bigger number, barely, at the cost of a show that was about spite more than music. You won. It felt small. {rival} noticed.",
            "effects": { "skill": 4, "fame": 12, "burnout": 6, "rivalry": 1 }
          },
          "good": {
            "text": "You out-draw {rival} on the strength of the better show, and the head-to-head becomes the story of the festival. You’re the bigger star tonight, and everyone saw it.",
            "effects": { "skill": 6, "fame": 18, "cred": 3, "rivalry": 1 }
          },
          "incredible": {
            "text": "You win the showdown so decisively it becomes music-festival legend, and {rival} — across the field — has to hear your crowd from their own stage. The rivalry’s defining night. Yours.",
            "effects": { "skill": 7, "fame": 26, "cred": 4, "rivalry": 1, "pathProgress": 1 }
          }
        }
      },
      "right": {
        "label": "Turn it into a joint moment",
        "governingStats": { "network": 1, "creativity": 0.3 },
        "tags": ["live", "rival"],
        "outcomes": {
          "bad": {
            "text": "You propose a surprise joint song across the stages and the logistics half-work, a beautiful idea slightly botched by walkie-talkie timing. The intent lands even if the execution wobbles.",
            "effects": { "network": 4, "fame": 12, "rivalry": -1 }
          },
          "good": {
            "text": "You and {rival} pull off a surprise joint finale that shuts down the whole festival, two rivals as one moment, and the internet loses its mind. Bigger together than apart.",
            "effects": { "network": 6, "fame": 20, "cred": 4, "rivalry": -1 }
          },
          "incredible": {
            "text": "The two of you engineer a cross-stage duet that becomes THE festival moment of the decade, and your decades-long rivalry resolves into the culture’s favorite friendship. Legend, shared. Both of you win.",
            "effects": { "network": 7, "fame": 28, "cred": 5, "rivalry": -2, "pathProgress": 1 }
          }
        }
      }
    }
  },
  {
    "id": "np_ms3_legacy_choice",
    "act": 3,
    "pathAffinity": ["megastar"],
    "weight": 9,
    "requires": { "fameMin": 75 },
    "art": "ev_np_ms3_legacy_choice",
    "context": "The top, and the question of what it was for",
    "prompt": "You’re as famous as you ever dreamed, and the strange quiet question arrives: now what is it FOR? You have a platform the size of the sky. You can point it at yourself, or at something bigger than yourself. Megastars are remembered for this choice.",
    "recap": "As famous as you dreamed, and the question of what it’s for.",
    "tags": ["fame", "social"],
    "choices": {
      "left": {
        "label": "Cement the empire",
        "governingStats": { "network": 1 },
        "tags": ["deal", "mainstream", "safe"],
        "outcomes": {
          "bad": {
            "text": "You focus the platform inward — the brand, the empire, the legacy of you — and build something huge and a little lonely at the center. Monumentally famous. Quietly hollow. The empire stands.",
            "effects": { "network": 5, "fame": 14, "money": 300, "cred": -3 }
          },
          "good": {
            "text": "You consolidate your fame into a lasting institution — a label, a brand, a machine that will outlive the moment. Security and legacy, locked in. The empire endures.",
            "effects": { "network": 6, "fame": 16, "money": 350, "pathProgress": 1 }
          },
          "incredible": {
            "text": "You build an empire so complete it becomes generational — the kind of institution that launches other careers for decades. You didn’t just get famous; you built a dynasty. Immortal, incorporated.",
            "effects": { "network": 8, "fame": 20, "money": 450, "cred": 2, "pathProgress": 1 }
          }
        }
      },
      "right": {
        "label": "Point the platform outward",
        "governingStats": { "cred": 1, "creativity": 0.3 },
        "tags": ["social", "risky"],
        "outcomes": {
          "bad": {
            "text": "You use your fame for a cause and take real heat for “getting political,” losing some fans who wanted only the songs. Principled, costly. You’d do it again. You think.",
            "effects": { "cred": 5, "fame": 8, "burnout": 4 }
          },
          "good": {
            "text": "You point your platform at something that matters and move the needle in a way no private citizen could, and the fans who stay respect you more than ever. Fame, finally useful.",
            "effects": { "cred": 7, "fame": 14, "network": 4, "pathProgress": 1 }
          },
          "incredible": {
            "text": "You use your megastardom to change something real in the world, and it becomes the thing you’re proudest of — bigger than any song. The rare famous person who spent the fame well. That’s the legacy.",
            "effects": { "cred": 9, "fame": 18, "network": 5, "pathProgress": 1 }
          }
        }
      }
    }
  },
  {
    "id": "np_st3_first_call_king",
    "act": 3,
    "pathAffinity": ["studio"],
    "weight": 11,
    "art": "ev_np_st3_first_call_king",
    "context": "The phone, ringing before 8 a.m., always for you",
    "prompt": "You’re THE first call now — the player producers describe by pointing at your chair. But there are only so many hours, and the requests have outstripped them. Being the best means constantly disappointing people who want the best. A good problem, mostly.",
    "recap": "You’re THE first call now, with more requests than hours.",
    "tags": ["studio", "work"],
    "choices": {
      "left": {
        "label": "Take only the legendary dates",
        "governingStats": { "cred": 1, "skill": 0.4 },
        "tags": ["studio", "safe", "tone"],
        "outcomes": {
          "bad": {
            "text": "You cherry-pick the prestige dates and the industry grumbles that you’ve gotten “selective,” which is the word for “successful” said bitterly. The dates you take are incredible. The FOMO is real.",
            "effects": { "cred": 5, "skill": 4, "money": 150 }
          },
          "good": {
            "text": "You play only the dates worthy of your time, and every record you touch becomes an event. Scarcity plus excellence equals a mystique money can’t buy. First-call royalty.",
            "effects": { "cred": 7, "skill": 5, "network": 4, "money": 200 }
          },
          "incredible": {
            "text": "You become so selectively legendary that having you on a record is itself a selling point, printed on the sticker. “Featuring” your name moves units. The chair is a throne now.",
            "effects": { "cred": 8, "skill": 6, "network": 5, "money": 250, "pathProgress": 1 }
          }
        }
      },
      "right": {
        "label": "Mentor the next generation",
        "governingStats": { "network": 1, "cred": 0.3 },
        "tags": ["studio", "work", "safe"],
        "outcomes": {
          "bad": {
            "text": "You start sending overflow dates to your protégés and one of them fumbles a big session, and the client blames you for the referral. Mentorship has liability. You keep doing it anyway.",
            "effects": { "network": 4, "cred": 3, "money": 100 }
          },
          "good": {
            "text": "You build a stable of players you trust and become the hub of the whole session world — not just the best hands, but the person who knows all the best hands. Kingmaker.",
            "effects": { "network": 6, "cred": 6, "money": 150 }
          },
          "incredible": {
            "text": "You become the elder who defines an era of players, the teacher every great session musician traces back to. Your legacy isn’t the records; it’s the people who make the records now. Immortal.",
            "effects": { "network": 7, "cred": 8, "skill": 3, "pathProgress": 1 }
          }
        }
      }
    }
  },
  {
    "id": "np_st3_signature_sound",
    "act": 3,
    "pathAffinity": ["studio"],
    "weight": 10,
    "art": "ev_np_st3_signature_sound",
    "context": "A sound so yours that producers name it after you",
    "prompt": "You’ve developed a sound so distinctive that producers request it by your name — “give me that thing you do.” It’s the ultimate studio-legend achievement and a subtle trap: the thing that made you can also cage you into repeating yourself forever.",
    "recap": "Producers request your sound by name — “that thing you do.”",
    "tags": ["studio", "tone"],
    "choices": {
      "left": {
        "label": "Perfect the signature",
        "minigame": "mixdown",
        "governingStats": { "skill": 1 },
        "tags": ["studio", "tone", "safe"],
        "outcomes": {
          "bad": {
            "text": "You lean all the way into your signature sound and become a one-trick specialist, brilliantly, and start turning down anything that doesn’t fit the trick. Famous and narrow. Booked, though.",
            "effects": { "skill": 5, "cred": 4, "money": 150 }
          },
          "good": {
            "text": "You refine your signature to a fine edge and it becomes a genuine standard — the sound a generation of records reaches for. Your fingerprint, on the whole era.",
            "effects": { "skill": 7, "cred": 5, "network": 4, "money": 180 }
          },
          "incredible": {
            "text": "Your signature sound becomes so iconic it enters the vocabulary — engineers teach it, plugins emulate it, and it’s named after you forever. You didn’t play on history; you became a term in it.",
            "effects": { "skill": 8, "cred": 7, "network": 4, "pathProgress": 1 }
          }
        }
      },
      "right": {
        "label": "Reinvent past the signature",
        "governingStats": { "creativity": 1, "skill": 0.4 },
        "tags": ["studio", "risky", "tone"],
        "outcomes": {
          "bad": {
            "text": "You try to evolve past your signature and confuse the producers who booked you for the old thing. “Just do the thing,” they say. You’re fighting your own brand now. It’s lonely at the frontier.",
            "effects": { "creativity": 4, "cred": 4, "burnout": 3 }
          },
          "good": {
            "text": "You develop a second signature sound, proving you’re an artist and not a preset, and the range doubles your value. The master who refuses to repeat himself. Rare and respected.",
            "effects": { "creativity": 7, "cred": 6, "network": 4 }
          },
          "incredible": {
            "text": "You reinvent your sound entirely and it’s as influential as the first, and the industry realizes you’re not a sound — you’re a source of them. Two eras, one legend. Nobody does that. You did.",
            "effects": { "creativity": 9, "cred": 8, "network": 5, "pathProgress": 1 }
          }
        }
      }
    }
  },
  {
    "id": "np_st3_the_masters",
    "act": 3,
    "pathAffinity": ["studio"],
    "weight": 10,
    "requires": { "stats": { "skillMin": 60 } },
    "art": "ev_np_st3_the_masters",
    "context": "A living legend, asking YOU to play on their comeback",
    "prompt": "One of the actual masters — a name in every history book — is making a comeback record and wants you on it. It’s the ultimate validation and the ultimate pressure: playing for someone you studied, who is now studying you back.",
    "recap": "An actual master wants you on their comeback record.",
    "tags": ["studio", "work"],
    "choices": {
      "left": {
        "label": "Serve the master humbly",
        "minigame": "take",
        "governingStats": { "skill": 1, "cred": 0.3 },
        "tags": ["studio", "safe"],
        "outcomes": {
          "bad": {
            "text": "You’re so reverent you play it safe and the master, who wanted a peer, gets a fan. The record’s fine. You wonder for years what would’ve happened if you’d dared. Reverence has a cost.",
            "effects": { "skill": 5, "cred": 5, "network": 3 }
          },
          "good": {
            "text": "You serve the master’s vision perfectly while quietly showing you belong in the room, and they nod the specific nod that means you passed. The history book has a footnote with your name.",
            "effects": { "skill": 6, "cred": 6, "network": 5 }
          },
          "incredible": {
            "text": "You play so beautifully the master tells the press you were the best part of the record, and that one sentence makes your career permanent. Anointed by a legend. It doesn’t get higher than this.",
            "effects": { "skill": 8, "cred": 8, "network": 6, "pathProgress": 1 }
          }
        }
      },
      "right": {
        "label": "Meet them as an equal",
        "governingStats": { "creativity": 1, "skill": 0.4 },
        "tags": ["studio", "risky", "tone"],
        "outcomes": {
          "bad": {
            "text": "You push your own ideas hard and the master, set in their ways, bristles at the young upstart. A tense session and a lukewarm reference. You had opinions; they had the final say. They always do.",
            "effects": { "creativity": 4, "cred": 4, "burnout": 4 }
          },
          "good": {
            "text": "You bring real ideas and the master, delighted to be challenged, elevates the whole record with you. Two artists, one great session. You’re not the fan anymore. You’re the peer.",
            "effects": { "creativity": 7, "cred": 6, "network": 5 }
          },
          "incredible": {
            "text": "You and the master push each other to something neither expected, and the comeback record becomes a classic the two of you made together. You didn’t just meet your hero — you made history with them.",
            "effects": { "creativity": 9, "cred": 8, "network": 6, "pathProgress": 1 }
          }
        }
      }
    }
  },
  {
    "id": "np_st3_own_studio",
    "act": 3,
    "pathAffinity": ["studio"],
    "weight": 10,
    "art": "ev_np_st3_own_studio",
    "context": "An empty room that could become YOUR room",
    "prompt": "You could build your own studio now — a room designed around your ears, where you call every shot and the best players come to you. It’s the studio legend’s castle. It’s also a mortgage, a business, and a bet that people will make the pilgrimage.",
    "recap": "An empty room that could become your own studio.",
    "tags": ["deal", "studio"],
    "choices": {
      "left": {
        "label": "Build the temple",
        "governingStats": { "network": 1, "skill": 0.3 },
        "tags": ["deal", "studio", "risky"],
        "outcomes": {
          "bad": {
            "text": "You sink everything into a dream studio and the bookings come slower than the bills, and for a scary year it’s a very expensive room you sit in alone. The acoustics are perfect. The silence, less so.",
            "effects": { "network": 4, "money": -100, "skill": 3, "burnout": 4 }
          },
          "good": {
            "text": "You build the studio and the players come — your ears, your room, your rules — and it becomes a destination. A castle that pays for itself and makes great records. The dream, bricked.",
            "effects": { "network": 6, "money": 150, "cred": 5 }
          },
          "incredible": {
            "text": "Your studio becomes a legendary room, the place where the era’s best records get made, and its name alone books it years out. You built a temple and the whole industry makes the pilgrimage. Immortal address.",
            "effects": { "network": 8, "money": 350, "cred": 6, "pathProgress": 1 }
          }
        }
      },
      "right": {
        "label": "Stay a free agent, stay light",
        "governingStats": { "skill": 1, "cred": 0.3 },
        "tags": ["studio", "safe"],
        "outcomes": {
          "bad": {
            "text": "You stay unencumbered and watch peers build empires while you carry a gig bag, and some nights the freedom feels like just not having a home. Light, mobile, slightly rootless. It’s a trade.",
            "effects": { "skill": 4, "cred": 4, "money": 80 }
          },
          "good": {
            "text": "You stay a free agent and it keeps you nimble, playing on more records than any studio-owner could, going wherever the best music is. Freedom as a career strategy. It works.",
            "effects": { "skill": 6, "cred": 5, "network": 4, "money": 150 }
          },
          "incredible": {
            "text": "Your refusal to be tied to one room makes you the legend who played everywhere, on everything, the connective tissue of a whole era of records. No castle, but you’re in every kingdom. Ubiquitous immortality.",
            "effects": { "skill": 7, "cred": 7, "network": 5, "pathProgress": 1 }
          }
        }
      }
    }
  },
  {
    "id": "np_st3_credit_finally",
    "act": 3,
    "pathAffinity": ["studio"],
    "weight": 9,
    "requires": { "stats": { "credMin": 55 } },
    "art": "ev_np_st3_credit_finally",
    "context": "A lifetime of anonymous work, and a chance to sign it",
    "prompt": "A documentary about a legendary album wants to finally credit the anonymous players who made it — including you, on the solo everyone knows and nobody knew was yours. After a career in the shadows, someone’s offering to turn on the light.",
    "recap": "A documentary wants to finally credit the anonymous players.",
    "tags": ["social", "studio"],
    "choices": {
      "left": {
        "label": "Step into the light",
        "governingStats": { "cred": 1, "network": 0.3 },
        "tags": ["social", "safe"],
        "outcomes": {
          "bad": {
            "text": "You take the credit and it’s bittersweet — decades late, and some of the people who should’ve shared it are gone. The recognition arrives to a smaller room than it deserved. Still. It arrives.",
            "effects": { "cred": 5, "fame": 4, "network": 3 }
          },
          "good": {
            "text": "You claim your history on camera and a generation finally learns whose hands made the records they love. The anonymous legend gets a face at last. Overdue and sweet.",
            "effects": { "cred": 7, "fame": 6, "network": 4 }
          },
          "incredible": {
            "text": "The documentary makes you a belated icon — the secret genius behind the classics — and your whole invisible discography becomes visible legend overnight. The shadows gave you up. The light suits you.",
            "effects": { "cred": 8, "fame": 10, "network": 5, "pathProgress": 1 }
          }
        }
      },
      "right": {
        "label": "Stay in the shadows, on principle",
        "governingStats": { "cred": 1 },
        "tags": ["studio", "safe"],
        "outcomes": {
          "bad": {
            "text": "You decline the credit to protect the mystery and part of you wonders if you just refused your own vindication out of a habit of hiding. The shadow is comfortable. Maybe too comfortable.",
            "effects": { "cred": 5, "creativity": 3 }
          },
          "good": {
            "text": "You let the work stay anonymous, insisting the song matters more than the name, and the humility of it becomes its own quiet legend among those who know. The purest form of the craft.",
            "effects": { "cred": 7, "creativity": 4, "network": 3 }
          },
          "incredible": {
            "text": "Your refusal of credit — “the music doesn’t need my name on it” — becomes the most respected statement of your career, and paradoxically makes you MORE legendary. The ghost who chose to stay a ghost. Sainthood.",
            "effects": { "cred": 9, "creativity": 5, "fame": 4, "pathProgress": 1 }
          }
        }
      }
    }
  },
  {
    "id": "np_st3_last_session",
    "act": 3,
    "pathAffinity": ["studio"],
    "weight": 9,
    "art": "ev_np_st3_last_session",
    "context": "A session that feels like a culmination",
    "prompt": "A session comes along that feels like everything you’ve learned pointing at one moment — the perfect song, the perfect players, the perfect room. You could play it safe and flawless, or reach for something transcendent and risk the flaw.",
    "recap": "The perfect song, players, and room, all in one session.",
    "tags": ["studio", "tone"],
    "choices": {
      "left": {
        "label": "Play it flawless",
        "minigame": "take",
        "governingStats": { "skill": 1 },
        "tags": ["studio", "safe"],
        "outcomes": {
          "bad": {
            "text": "You play it perfectly and perfectly is, it turns out, a little cold. Technically unimpeachable, emotionally closed. A master phoning in mastery. The producer keeps it. You know.",
            "effects": { "skill": 5, "cred": 4 }
          },
          "good": {
            "text": "You play a flawless take that’s also deeply felt — the rare perfection with a pulse — and everyone in the room knows they just witnessed a master at work. Effortless. Earned.",
            "effects": { "skill": 7, "cred": 6, "network": 3 }
          },
          "incredible": {
            "text": "You play a take so perfect and so alive it becomes the reference other players study to understand what “great” means. A career’s worth of craft in three minutes. The definitive take. Yours.",
            "effects": { "skill": 8, "cred": 7, "network": 4, "pathProgress": 1 }
          }
        }
      },
      "right": {
        "label": "Reach for transcendent",
        "governingStats": { "creativity": 1, "skill": 0.4 },
        "tags": ["studio", "risky", "tone"],
        "outcomes": {
          "bad": {
            "text": "You reach past your own ceiling and grab something ambitious and slightly broken — a beautiful reach that doesn’t quite close. The producer uses a safer take. The reach haunts you, gorgeously.",
            "effects": { "creativity": 5, "cred": 4, "burnout": 4 }
          },
          "good": {
            "text": "You reach and you grasp it — a take that transcends technique into something like prayer, and the room goes silent. This is why you spent a life in these rooms. For this.",
            "effects": { "creativity": 8, "cred": 6, "skill": 4 }
          },
          "incredible": {
            "text": "You reach for transcendent and you TOUCH it — a take so far beyond craft it becomes a small miracle preserved on tape. People will play it in fifty years and not understand how a human did that. You did.",
            "effects": { "creativity": 10, "cred": 8, "skill": 4, "pathProgress": 1 }
          }
        }
      }
    }
  },
  {
    "id": "np_hf3_the_machine",
    "act": 3,
    "pathAffinity": ["hitfactory"],
    "weight": 11,
    "art": "ev_np_hf3_the_machine",
    "context": "A songwriting operation running like a factory",
    "prompt": "You’ve built it — a genuine hit-making operation, writers and producers and a pipeline that turns out chart-toppers with alarming regularity. It’s an achievement and an existential question: are you still an artist, or have you become a machine that makes them?",
    "recap": "You’ve built a hit-making operation that runs like a factory.",
    "tags": ["write", "deal"],
    "choices": {
      "left": {
        "label": "Scale the machine up",
        "governingStats": { "network": 1 },
        "tags": ["deal", "work", "risky"],
        "outcomes": {
          "bad": {
            "text": "You scale the operation into a genuine factory and lose the thread of what you personally make — you’re a CEO who used to write songs. Rich, powerful, and a little lost in the org chart.",
            "effects": { "network": 5, "money": 300, "creativity": -3 }
          },
          "good": {
            "text": "You build a machine that reliably makes hits and still lets you write the ones that matter to you. Empire and artistry, balanced. The factory hums and you still hum with it.",
            "effects": { "network": 6, "money": 350, "creativity": 3, "pathProgress": 1 }
          },
          "incredible": {
            "text": "You build a hit factory so dominant it defines the sound of the era — a third of the chart flows through your building — while somehow keeping your own pen sharp. The mogul who never stopped writing. Total.",
            "effects": { "network": 8, "money": 450, "creativity": 4, "fame": 4, "pathProgress": 1 }
          }
        }
      },
      "right": {
        "label": "Stay the writer, not the boss",
        "governingStats": { "creativity": 1 },
        "tags": ["write", "indie"],
        "outcomes": {
          "bad": {
            "text": "You refuse to scale and stay hands-on-pen, and watch rivals build empires while you write one song at a time. Purer, smaller, and privately proud. The machine you didn’t build haunts you a little.",
            "effects": { "creativity": 5, "cred": 4, "writeSong": true }
          },
          "good": {
            "text": "You keep it small and personal, and your songs stay unmistakably yours in a landscape of committee-written product. The last real writer in a factory town. Respected. Sharp.",
            "effects": { "creativity": 7, "cred": 6, "writeSong": true }
          },
          "incredible": {
            "text": "By refusing to become a machine you stay the writer everyone else’s machine is trying to imitate, and your hits have a soul the factories can’t manufacture. The human in the age of the pipeline. Irreplaceable.",
            "effects": { "creativity": 9, "cred": 7, "fame": 4, "writeSong": true, "pathProgress": 1 }
          }
        }
      }
    }
  },
  {
    "id": "np_hf3_number_one",
    "act": 3,
    "pathAffinity": ["hitfactory"],
    "weight": 10,
    "requires": { "demoMin": 1 },
    "art": "ev_np_hf3_number_one",
    "context": "A song with #1 written all over it",
    "prompt": "You’ve got one in the chamber that feels like a guaranteed #1 — the hook, the timing, the artist all aligned. Hit factories live for this. The only question is whose name goes on it: give it to the superstar for a lock, or bet on a rising act for a bigger legend.",
    "recap": "A guaranteed #1 in the chamber, and whose name goes on it.",
    "tags": ["write", "deal"],
    "choices": {
      "left": {
        "label": "Give it to the sure-thing star",
        "governingStats": { "network": 1 },
        "tags": ["deal", "mainstream", "safe"],
        "outcomes": {
          "bad": {
            "text": "The superstar takes your song to #1 and it’s their triumph, their moment, your tiny credit. A guaranteed smash you watch from the wings. The check is enormous. The glory is theirs.",
            "effects": { "network": 4, "money": 300, "releaseDemo": 68, "cred": -2 }
          },
          "good": {
            "text": "Your song goes to #1 in the superstar’s hands exactly as planned, and “written by you” becomes a stamp of guaranteed quality. The factory’s reputation, cemented in gold.",
            "effects": { "network": 6, "money": 350, "releaseDemo": 72, "fame": 3 }
          },
          "incredible": {
            "text": "Your song becomes the superstar’s biggest hit ever, a cultural monolith, and everyone who matters knows exactly whose pen made it. You’re the hit factory’s hit factory now. Untouchable.",
            "effects": { "network": 7, "money": 450, "releaseDemo": 75, "fame": 5, "hits": 1, "pathProgress": 1 }
          }
        }
      },
      "right": {
        "label": "Bet on the rising act",
        "governingStats": { "creativity": 1, "network": 0.3 },
        "tags": ["deal", "risky"],
        "outcomes": {
          "bad": {
            "text": "You give the sure-thing song to a newcomer who isn’t ready to carry it, and it underperforms in their hands. A #1 song that peaked at #14 because of who sang it. You gambled on a person. The song deserved better.",
            "effects": { "creativity": 4, "releaseDemo": 60, "money": 100 }
          },
          "good": {
            "text": "Your bet pays — the rising act rides your song to their first #1, and their gratitude makes you their forever-writer. You didn’t just make a hit; you made a star who owes you everything.",
            "effects": { "creativity": 6, "releaseDemo": 68, "network": 5, "fame": 4 }
          },
          "incredible": {
            "text": "The newcomer takes your song to #1 and becomes an overnight phenomenon, and you’re crowned the writer who can MAKE a superstar from scratch. The most valuable pen in the industry. Kingmaker confirmed.",
            "effects": { "creativity": 8, "releaseDemo": 74, "network": 6, "fame": 6, "hits": 1, "pathProgress": 1 }
          }
        }
      }
    }
  },
  {
    "id": "np_hf3_the_album_hf",
    "act": 3,
    "pathAffinity": ["hitfactory"],
    "weight": 10,
    "requires": { "demoMin": 2 },
    "art": "ev_np_hf3_the_album_hf",
    "context": "A vault deep enough to be an album",
    "prompt": "You’ve written enough to make a full statement — but a hit factory faces a choice most writers never do: release these as YOUR album and finally step out front, or place them all with other artists and stay the invisible architect. Ego versus empire.",
    "recap": "Enough songs for an album: release your own, or place them all.",
    "tags": ["record", "write"],
    "choices": {
      "left": {
        "label": "Release it as your own album",
        "governingStats": { "creativity": 1, "network": 0.3 },
        "tags": ["record", "risky"],
        "outcomes": {
          "bad": {
            "text": "You step out front with your own album and discover the public loved your songs in OTHER voices — yours is fine, not magic. The architect isn’t the star. A humbling, expensive lesson in staying behind the curtain.",
            "effects": { "creativity": 4, "fame": 6, "albumDrop": 65, "cred": 2 }
          },
          "good": {
            "text": "Your album proves you’re more than a ghostwriter — the songs are undeniable and now they have your name and your voice. The architect steps out and, it turns out, belongs out front too.",
            "effects": { "creativity": 7, "fame": 12, "albumDrop": 70, "cred": 5 }
          },
          "incredible": {
            "text": "Your album becomes a landmark — the hit factory revealed as a genuine artist all along — and it recontextualizes your whole invisible career as the work of a master. The ghost was the genius. Everyone knows now.",
            "effects": { "creativity": 9, "fame": 18, "albumDrop": 75, "cred": 6, "pathProgress": 1 }
          }
        }
      },
      "right": {
        "label": "Place them all, stay the architect",
        "governingStats": { "network": 1 },
        "tags": ["deal", "safe"],
        "outcomes": {
          "bad": {
            "text": "You place all the songs with other artists and they become other people’s triumphs, and you count the checks alone in the building you built. Empire secured, self erased. The trade you keep making. It pays.",
            "effects": { "network": 5, "money": 300, "cred": -2 }
          },
          "good": {
            "text": "You place the whole vault brilliantly and rack up a season’s worth of hits under other names, cementing you as the invisible king of the charts. The architect prefers the blueprint to the spotlight. And thrives.",
            "effects": { "network": 7, "money": 400, "fame": 3, "pathProgress": 1 }
          },
          "incredible": {
            "text": "You place your album’s worth of songs so masterfully that half the year’s biggest hits trace to you, and the industry crowns you the greatest hit factory of the generation. The ghost who wrote the whole era. Legend, uncredited by choice.",
            "effects": { "network": 8, "money": 500, "fame": 5, "pathProgress": 1 }
          }
        }
      }
    }
  },
  {
    "id": "np_hf3_legacy_catalog",
    "act": 3,
    "pathAffinity": ["hitfactory"],
    "weight": 10,
    "art": "ev_np_hf3_legacy_catalog",
    "context": "A publisher, offering a fortune for your songs",
    "prompt": "A major publisher offers a staggering sum to buy your entire catalog — every song you’ve written and every one you ever will. It’s generational money and the total surrender of your life’s work to a spreadsheet. Writers agonize over this exact call.",
    "recap": "A publisher offers a fortune for your entire catalog.",
    "tags": ["deal", "write"],
    "choices": {
      "left": {
        "label": "Sell the catalog",
        "governingStats": { "network": 1 },
        "tags": ["deal", "mainstream", "safe"],
        "outcomes": {
          "bad": {
            "text": "You sell everything and the number is life-changing and the morning after, hearing your own song in a commercial you didn’t approve, you feel the specific grief of having sold your children. Rich. Hollowed.",
            "effects": { "network": 4, "money": 500, "cred": -4 }
          },
          "good": {
            "text": "You sell the catalog for generational wealth and freedom, and reframe it: the songs are out in the world doing their work, and you never have to worry about money again. A clean, enormous exit.",
            "effects": { "network": 5, "money": 600, "burnout": -5 }
          },
          "incredible": {
            "text": "You negotiate a catalog sale so favorable you keep creative approval AND take the fortune, setting a new standard other writers cite for years. You didn’t sell out; you sold SMART. Free and wealthy and still in control.",
            "effects": { "network": 7, "money": 700, "cred": 3, "pathProgress": 1 }
          }
        }
      },
      "right": {
        "label": "Keep every song",
        "governingStats": { "cred": 1, "creativity": 0.3 },
        "tags": ["indie", "risky"],
        "outcomes": {
          "bad": {
            "text": "You keep the catalog and turn down the fortune, and administering your own publishing turns out to be a full-time job you hate. Ownership is a burden as well as a right. You own everything, including the paperwork.",
            "effects": { "cred": 5, "creativity": 3, "money": 60 }
          },
          "good": {
            "text": "You keep your life’s work and control its destiny — no song sold to a cause you hate, no hook in an ad you’d never endorse. The catalog stays yours, and so does the last word. Priceless.",
            "effects": { "cred": 7, "creativity": 4, "money": 150 }
          },
          "incredible": {
            "text": "You keep the catalog and it appreciates into something worth more than the offer, and you become the writer who bet on themselves and won enormously. Ownership as the ultimate power move. The songs, and the future, are yours.",
            "effects": { "cred": 8, "creativity": 5, "money": 300, "fame": 3, "pathProgress": 1 }
          }
        }
      }
    }
  },
  {
    "id": "np_hf3_write_your_own",
    "act": 3,
    "pathAffinity": ["hitfactory"],
    "weight": 9,
    "art": "ev_np_hf3_write_your_own",
    "context": "For once, a song for nobody but you",
    "prompt": "After a career writing for everyone else, you sit down to write one that’s only for you — no artist, no brief, no market. It’s terrifying. Without the target, you’re not sure you remember how to write for the one audience you never served: yourself.",
    "recap": "After writing for everyone else, a song only for you.",
    "tags": ["write", "home"],
    "choices": {
      "left": {
        "label": "Write the most personal thing",
        "minigame": "ideas",
        "governingStats": { "creativity": 1 },
        "tags": ["write", "indie", "risky"],
        "outcomes": {
          "bad": {
            "text": "You reach for pure personal truth and find, unsettlingly, that years of writing to briefs have rusted the muscle. The song is honest and a little clumsy, like handwriting after typing for a decade. Still. It’s yours.",
            "effects": { "creativity": 5, "cred": 3, "writeSong": true }
          },
          "good": {
            "text": "You write the truest thing you’ve made in years — no hook math, no target demo, just you — and it’s a revelation. The writer remembers who they were before the factory. And weeps a little.",
            "effects": { "creativity": 7, "cred": 6, "writeSong": true }
          },
          "incredible": {
            "text": "You write a song of such naked personal power that it becomes the thing you’re proudest of in a career full of hits — the one nobody commissioned, that came from the bottom of you. The factory made hits. This made meaning.",
            "effects": { "creativity": 9, "cred": 7, "fame": 4, "writeSong": true, "pathProgress": 1 }
          }
        }
      },
      "right": {
        "label": "Write your greatest hit yet",
        "governingStats": { "creativity": 1, "network": 0.3 },
        "tags": ["write", "mainstream"],
        "outcomes": {
          "bad": {
            "text": "Freed from the brief, you default to your instincts and write another expert hit — great, undeniable, and exactly like the last twenty. The muscle memory is strong. The freedom, unused.",
            "effects": { "creativity": 5, "fame": 4, "writeSong": true }
          },
          "good": {
            "text": "With no constraints you write the platonic ideal of your own style — the hit that all your other hits were rough drafts of. Freedom sharpened the blade instead of dulling it.",
            "effects": { "creativity": 7, "fame": 6, "cred": 3, "writeSong": true }
          },
          "incredible": {
            "text": "Unleashed, you write the definitive hit of your career — everything you know about what makes a song work, in one perfect artifact. The master, unconstrained, at the peak. This is the one they’ll teach.",
            "effects": { "creativity": 9, "fame": 8, "cred": 4, "writeSong": true, "pathProgress": 1 }
          }
        }
      }
    }
  },
  {
    "id": "np_hf3_the_reveal",
    "act": 3,
    "pathAffinity": ["hitfactory"],
    "weight": 9,
    "requires": { "fameMin": 40 },
    "art": "ev_np_hf3_the_reveal",
    "context": "A chance to finally get public credit",
    "prompt": "A journalist has connected the dots — realized how many of the last few years’ biggest hits trace back to you — and wants to run the story that turns you from invisible architect to public name. The ghost could become famous. Or stay a ghost, powerfully.",
    "recap": "A journalist connected the dots on the hits tracing to you.",
    "tags": ["social", "fame"],
    "choices": {
      "left": {
        "label": "Let them tell the story",
        "governingStats": { "network": 1, "creativity": 0.3 },
        "tags": ["social", "mainstream", "risky"],
        "outcomes": {
          "bad": {
            "text": "The story runs and the artists whose hits you wrote feel exposed, and a couple of relationships cool. The credit is public now, and so is the resentment. You’re famous and slightly radioactive. Trade-offs.",
            "effects": { "network": 3, "fame": 10, "cred": -2 }
          },
          "good": {
            "text": "The reveal makes you a name — the secret genius behind the hits — and the public fascination opens doors that were always closed to the anonymous. The ghost gets a face and a fanbase.",
            "effects": { "network": 5, "fame": 14, "cred": 3 }
          },
          "incredible": {
            "text": "The story becomes a sensation — the invisible architect revealed — and recasts your whole hidden career as a legend. You’re not just a writer now; you’re THE writer, publicly, finally. The ghost ascends.",
            "effects": { "network": 6, "fame": 20, "cred": 4, "pathProgress": 1 }
          }
        }
      },
      "right": {
        "label": "Stay the ghost",
        "governingStats": { "cred": 1 },
        "tags": ["indie", "safe"],
        "outcomes": {
          "bad": {
            "text": "You kill the story to protect the artists and the mystique, and part of you mourns the fame you keep refusing. The ghost stays a ghost by choice. The choice gets a little harder each time.",
            "effects": { "cred": 5, "network": 3 }
          },
          "good": {
            "text": "You stay anonymous on principle — the songs belong to the singers — and the industry’s respect for that discretion makes you the most trusted writer alive. The power of the invisible hand. Immense, and quiet.",
            "effects": { "cred": 7, "network": 5, "money": 100 }
          },
          "incredible": {
            "text": "Your refusal to claim credit becomes legendary in itself — the ghost who could’ve been famous and chose the work — and it makes every artist in the industry want the writer who’ll never steal their shine. Ultimate leverage, invisibly held.",
            "effects": { "cred": 8, "network": 7, "money": 150, "pathProgress": 1 }
          }
        }
      }
    }
  },
  {
    "id": "np_hf3_rival_credit",
    "act": 3,
    "pathAffinity": ["hitfactory"],
    "weight": 9,
    "art": "ev_np_hf3_rival_credit",
    "context": "{rival}, claiming a song you wrote",
    "prompt": "{rival} — {rivalVibe} — is publicly taking credit for a hit you know you wrote, or mostly wrote, in a co-write that’s gotten fuzzy in the retelling. The song is huge. The credit is disputed. And {rival} is telling the story louder than you.",
    "recap": "{rival} is publicly claiming a hit you know you wrote.",
    "tags": ["deal", "rival"],
    "choices": {
      "left": {
        "label": "Fight for the credit",
        "governingStats": { "network": 1, "cred": 0.3 },
        "tags": ["deal", "risky", "rival"],
        "outcomes": {
          "bad": {
            "text": "You go public with the receipts and it becomes an ugly he-said-she-said that makes you both look petty. You win the credit and lose the moral high ground. {rival} plays victim beautifully. The song’s tainted now.",
            "effects": { "network": 3, "cred": 3, "rivalry": 1 }
          },
          "good": {
            "text": "You calmly produce the session files and the truth settles it — the credit comes back to you, and {rival}’s overreach costs them. Receipts beat volume. Vindicated, professionally.",
            "effects": { "network": 5, "cred": 5, "money": 100, "rivalry": 1 }
          },
          "incredible": {
            "text": "You reclaim the credit so cleanly and graciously that {rival} is exposed AND you look magnanimous, and the industry sides with you completely. You won the song, the argument, and the room. {rival} seethes.",
            "effects": { "network": 6, "cred": 6, "money": 150, "fame": 3, "rivalry": 1, "pathProgress": 1 }
          }
        }
      },
      "right": {
        "label": "Let them have it",
        "governingStats": { "creativity": 1, "cred": 0.3 },
        "tags": ["indie", "rival"],
        "outcomes": {
          "bad": {
            "text": "You let {rival} keep the credit to stay above it and quietly resent it for years, and {rival} takes your silence as permission to do it again. Grace, mistaken for weakness. The next one hurts more.",
            "effects": { "creativity": 3, "cred": 3, "rivalry": 1 }
          },
          "good": {
            "text": "You let the disputed credit go and pour the energy into writing the next hit instead, proving the well is bottomless. {rival} got one song; you have a hundred more. The best revenge is output.",
            "effects": { "creativity": 6, "cred": 5, "writeSong": true, "rivalry": -1 }
          },
          "incredible": {
            "text": "You gift {rival} the credit publicly and gracefully, then write three bigger hits that make the disputed one look minor, and the whole industry reads the message: you’re so far ahead you can afford to give songs away. Devastating generosity.",
            "effects": { "creativity": 8, "cred": 7, "fame": 4, "writeSong": true, "rivalry": -1, "pathProgress": 1 }
          }
        }
      }
    }
  },
  {
    "id": "np_hf3_final_hit",
    "act": 3,
    "pathAffinity": ["hitfactory"],
    "weight": 9,
    "requires": { "stats": { "creativityMin": 60 } },
    "art": "ev_np_hf3_final_hit",
    "context": "One more, and it could be the one they remember",
    "prompt": "You’ve written more hits than you can count, and you can feel one more forming — the kind that could be your signature, the song they’ll play to explain what you were. After a whole career of hits for others, this one could be the definitive statement of the hit factory itself.",
    "recap": "One more forming — the song they’ll play to explain you.",
    "tags": ["write", "studio"],
    "choices": {
      "left": {
        "label": "Engineer the perfect hit",
        "minigame": "ideas",
        "governingStats": { "creativity": 1, "skill": 0.4 },
        "tags": ["write", "mainstream", "risky"],
        "outcomes": {
          "bad": {
            "text": "You try to engineer the perfect capstone hit and over-think it into something flawless and forgettable — a hit by every metric except the one that matters. The formula, finally, fails you. Too clever by half.",
            "effects": { "creativity": 5, "fame": 4, "writeSong": true }
          },
          "good": {
            "text": "You write a hit that distills everything you know — the perfect marriage of craft and instinct — and it becomes the song people cite as peak-you. The factory’s masterpiece. Undeniable.",
            "effects": { "creativity": 7, "fame": 8, "cred": 4, "writeSong": true }
          },
          "incredible": {
            "text": "You write the definitive hit — the one that will outlive you, that a hundred future writers will study, the platonic ideal of a pop song. A whole career of learning, in three perfect minutes. This is the one. You knew it would be.",
            "effects": {
              "creativity": 9,
              "fame": 12,
              "cred": 6,
              "hits": 1,
              "chartTitle": "The Signature",
              "writeSong": true,
              "pathProgress": 1
            }
          }
        }
      },
      "right": {
        "label": "Write the honest capstone",
        "governingStats": { "creativity": 1, "cred": 0.3 },
        "tags": ["write", "indie"],
        "outcomes": {
          "bad": {
            "text": "You try to write your honest final statement and it comes out earnest and uncommercial, a beautiful song the charts have no slot for. True to you, invisible to the world. The vault gets a masterpiece nobody hears.",
            "effects": { "creativity": 5, "cred": 5, "writeSong": true }
          },
          "good": {
            "text": "You write a capstone that’s both a hit AND a true statement — the rare song that satisfies the market and your soul at once. The factory, at its peak, making something that means something.",
            "effects": { "creativity": 7, "cred": 6, "fame": 5, "writeSong": true }
          },
          "incredible": {
            "text": "You write a final song so perfectly both commercial and true that it redefines what a hit can be — proof that the factory was always capable of art. The capstone that recontextualizes the whole career. You didn’t make a hit. You made THE point.",
            "effects": {
              "creativity": 9,
              "cred": 7,
              "fame": 7,
              "hits": 1,
              "chartTitle": "The Point",
              "writeSong": true,
              "pathProgress": 1
            }
          }
        }
      }
    }
  },
  {
    "id": "nm_mentor_meet",
    "act": 1,
    "pathAffinity": [],
    "weight": 9,
    "art": "ev_nm_mentor_meet",
    "context": "A washed regional legend, at the bar, unimpressed",
    "prompt": "A local legend — huge here in 1987, invisible everywhere else since — watches your set with his arms crossed, then corners you at the bar. “You’ve got something,” he says, “and you’re wasting most of it. Sit down.”",
    "recap": "A washed regional legend corners you at the bar.",
    "tags": ["network", "home"],
    "choices": {
      "left": {
        "label": "Sit down and take the yelling",
        "governingStats": { "skill": 1 },
        "tags": ["practice", "safe"],
        "outcomes": {
          "bad": {
            "text": "He talks for two hours, half wisdom and half grievance about a label that wronged him in 1989. You take notes on both. The wisdom, at least, is free.",
            "effects": { "skill": 3, "cred": 2, "addFlag": "mentor_met" }
          },
          "good": {
            "text": "He tears your set apart and rebuilds it better in real time, and you realize the arms-crossed thing was him deciding you were worth the trouble.",
            "effects": { "skill": 5, "cred": 3, "addFlag": "mentor_met" }
          },
          "incredible": {
            "text": "He shows you one thing about phrasing that reorganizes everything you thought you knew. You leave changed. He leaves pretending he didn’t care. You both know.",
            "effects": { "skill": 7, "cred": 4, "network": 2, "addFlag": "mentor_met" }
          }
        }
      },
      "right": {
        "label": "Push back — you know things too",
        "governingStats": { "creativity": 1, "cred": 0.3 },
        "tags": ["indie", "risky"],
        "outcomes": {
          "bad": {
            "text": "You argue and he laughs, genuinely delighted, because the last person who pushed back became his favorite. You just failed the test by passing it. He buys you a drink.",
            "effects": { "creativity": 3, "cred": 2, "addFlag": "mentor_met" }
          },
          "good": {
            "text": "You hold your ground on one point and he concedes it, grudgingly, and that concession is the beginning of a real respect between you. Peers, with a forty-year gap.",
            "effects": { "creativity": 5, "cred": 4, "addFlag": "mentor_met" }
          },
          "incredible": {
            "text": "You debate him to a standstill and he grins like a man who’s been lonely for a worthy argument. “Okay,” he says. “Okay. We’re going to be friends, aren’t we.” You are.",
            "effects": { "creativity": 6, "cred": 5, "network": 2, "addFlag": "mentor_met" }
          }
        }
      }
    }
  },
  {
    "id": "nm_mentor_lesson",
    "act": 2,
    "pathAffinity": [],
    "weight": 11,
    "requires": { "flagsAll": ["mentor_met"] },
    "art": "ev_nm_mentor_lesson",
    "context": "The mentor, at his kitchen table, no instrument in sight",
    "prompt": "He calls you over “for a lesson,” but there’s no instrument out — just coffee and a long silence. “The music’s the easy part,” he finally says. “Today I’m teaching you the thing that actually ends careers. Sit.”",
    "recap": "The mentor calls you over — coffee, silence, no instrument.",
    "tags": ["home", "network"],
    "choices": {
      "left": {
        "label": "Listen to the hard-won truth",
        "governingStats": { "cred": 1 },
        "tags": ["home", "safe"],
        "outcomes": {
          "bad": {
            "text": "He tells you about the deal that broke him and the friends he lost being right, and it’s heavy and a little self-pitying and entirely true. You take it home like a weight.",
            "effects": { "cred": 4, "burnout": 3 }
          },
          "good": {
            "text": "He teaches you how to survive the business without becoming it — the exact lesson nobody taught him in time. You’re getting his mistakes for free. That’s the gift.",
            "effects": { "cred": 6, "network": 3, "burnout": -2 }
          },
          "incredible": {
            "text": "He gives you the one rule that would have saved his whole career, and you feel the weight of being trusted with it. “Don’t waste it like I did,” he says. You promise. You mean it.",
            "effects": { "cred": 7, "network": 4, "creativity": 3 }
          }
        }
      },
      "right": {
        "label": "Ask him the questions nobody did",
        "governingStats": { "network": 1, "creativity": 0.3 },
        "tags": ["network", "risky"],
        "outcomes": {
          "bad": {
            "text": "You ask about the fall and he goes quiet and cold, and you realize some doors you don’t knock on. He recovers, eventually. So do you. It’s a little awkward for a week.",
            "effects": { "network": 2, "cred": 3, "burnout": 2 }
          },
          "good": {
            "text": "You ask what he’d do differently and he actually answers, and it turns into the realest conversation either of you has had in years. Two people, one kitchen, all the truth.",
            "effects": { "network": 5, "cred": 4, "creativity": 3 }
          },
          "incredible": {
            "text": "Your questions unlock something he’s never said aloud, and by the end he’s thanking YOU, which neither of you expected. The student taught the teacher one thing back. It lands hard.",
            "effects": { "network": 6, "cred": 5, "creativity": 4 }
          }
        }
      }
    }
  },
  {
    "id": "nm_mentor_favor",
    "act": 2,
    "pathAffinity": [],
    "weight": 11,
    "requires": { "flagsAll": ["mentor_met"] },
    "art": "ev_nm_mentor_favor",
    "context": "The mentor, on the phone, calling in his last chip",
    "prompt": "He calls, uncharacteristically nervous. “I’ve got one favor left with anybody who matters, and it’s been sitting in a drawer for fifteen years. I want to spend it on you.” It’s his last real connection to the industry that forgot him.",
    "recap": "The mentor wants to spend his last industry favor on you.",
    "tags": ["network", "deal"],
    "choices": {
      "left": {
        "label": "Let him spend it on you",
        "governingStats": { "network": 1 },
        "tags": ["network", "deal", "safe"],
        "outcomes": {
          "bad": {
            "text": "He makes the call and the contact half-remembers him and does the bare minimum out of pity. It opens a small door. It costs him more dignity than the door is worth. He says it was worth it. You’re not sure.",
            "effects": { "network": 4, "cred": 3, "burnout": 3 }
          },
          "good": {
            "text": "The favor lands — a real meeting, a real shot — and watching him still have juice after all these years puts the light back in him for a week. Giving it away made him young.",
            "effects": { "network": 7, "cred": 4, "money": 80 }
          },
          "incredible": {
            "text": "The favor opens a door bigger than either of you dreamed, and he weeps a little on the phone, and you understand this was never about the favor. It was about mattering again. He does. He always did.",
            "effects": { "network": 9, "cred": 5, "fame": 3, "money": 120 }
          }
        }
      },
      "right": {
        "label": "Tell him to save it for himself",
        "governingStats": { "cred": 1 },
        "tags": ["home", "risky"],
        "outcomes": {
          "bad": {
            "text": "You tell him to use it on his own comeback and he laughs it off, but you can tell you bruised him — he wanted to give, and you handed it back. Generosity, fumbled. You apologize. He forgives, gruffly.",
            "effects": { "cred": 3, "network": 2, "burnout": 2 }
          },
          "good": {
            "text": "You refuse the favor and instead help HIM use it, and his tiny comeback show sells out on your combined names. The student became the platform. He stands taller.",
            "effects": { "cred": 6, "network": 4, "fame": 3 }
          },
          "incredible": {
            "text": "You turn his last favor into a spotlight on HIM, and the forgotten legend gets one more real moment in the sun — because you refused to take it. He never forgets it. Neither will the scene.",
            "effects": { "cred": 8, "network": 5, "fame": 4 }
          }
        }
      }
    }
  },
  {
    "id": "nm_mentor_last",
    "act": 3,
    "pathAffinity": [],
    "weight": 11,
    "requires": { "flagsAll": ["mentor_met"] },
    "art": "ev_nm_mentor_last",
    "context": "The mentor’s last show, and an empty spot on the bill",
    "prompt": "He’s playing his last show — he’s decided, and he means it this time — and he’s asked you to be on the bill. Not to open. To close. “Send me off,” he says. “Play me out. I want the last thing that room hears to be what I helped make.”",
    "recap": "The mentor’s last show, and he’s asked you to close it.",
    "tags": ["live", "home"],
    "choices": {
      "left": {
        "label": "Close the show for him",
        "minigame": "crowd",
        "governingStats": { "skill": 1, "cred": 0.4 },
        "tags": ["live", "home", "safe"],
        "outcomes": {
          "bad": {
            "text": "You close his last show and get in your own head about honoring him and play it stiff. He hugs you after and says it was perfect. It wasn’t. His kindness is the real lesson tonight.",
            "effects": { "skill": 4, "cred": 5, "burnout": 4 }
          },
          "good": {
            "text": "You send him off with a set that carries everything he taught you, and he watches from the wings with tears he pretends are the fog machine. The lineage, made audible. He’s proud. He says so.",
            "effects": { "skill": 6, "cred": 7, "fame": 4 }
          },
          "incredible": {
            "text": "You play the show of your life as a love letter to him, and the whole room feels the torch pass. He takes a final bow to a standing ovation you engineered. “Now THAT,” he says, “is how you leave.” You gave him the ending he earned.",
            "effects": { "skill": 8, "cred": 9, "fame": 6, "network": 3 }
          }
        }
      },
      "right": {
        "label": "Get him to play one last time with you",
        "governingStats": { "creativity": 1, "network": 0.3 },
        "tags": ["live", "risky"],
        "outcomes": {
          "bad": {
            "text": "You coax him back on stage for a duet and his hands aren’t what they were, and the room is generous about it, and he knows. A bittersweet last note. He’s glad he did it. Mostly.",
            "effects": { "creativity": 4, "cred": 5, "burnout": 3 }
          },
          "good": {
            "text": "You pull him out for one last song together and, for four minutes, 1987 comes back — the fire, the phrasing, the reason he mattered. The room roars. He goes out playing. As he should.",
            "effects": { "creativity": 7, "cred": 7, "fame": 5 }
          },
          "incredible": {
            "text": "Your duet becomes the stuff of local legend — the old lion and the new, one last time — and he plays like the intervening decades never happened. He leaves the stage for good, incandescent, complete. You gave him that. It’s the best thing you’ve done.",
            "effects": { "creativity": 9, "cred": 9, "fame": 7 }
          }
        }
      }
    }
  },
  {
    "id": "nm_copycat_clip",
    "act": [1, 2],
    "pathAffinity": [],
    "weight": 9,
    "art": "ev_nm_copycat_clip",
    "context": "A suburban teenager, covering you, going viral",
    "prompt": "A fifteen-year-old in a bedroom two states away is covering your songs — badly, beautifully, and virally. Their cover of your deepest cut has more views than your original. They clearly worship you. It is deeply strange to be someone’s hero.",
    "recap": "A fifteen-year-old’s viral cover of your deepest cut.",
    "tags": ["social"],
    "choices": {
      "left": {
        "label": "Embrace the kid",
        "governingStats": { "network": 1 },
        "tags": ["social", "safe"],
        "outcomes": {
          "bad": {
            "text": "You comment something nice and the kid completely loses their mind with joy, and now there are forty covers. You’ve created something. You’re not sure what. It has your face on it.",
            "effects": { "network": 3, "fame": 4, "addFlag": "copycat" }
          },
          "good": {
            "text": "You share the kid’s cover and it doubles both your audiences, and the kid’s tearful thank-you video is the purest thing on the internet that week. You made a day. Maybe a life.",
            "effects": { "network": 5, "fame": 6, "cred": 2, "addFlag": "copycat" }
          },
          "incredible": {
            "text": "You lift the kid up publicly and the story — established artist boosts young fan — becomes its own feel-good phenomenon. You didn’t just gain a fan. You became someone’s origin story.",
            "effects": { "network": 6, "fame": 8, "cred": 3, "addFlag": "copycat" }
          }
        }
      },
      "right": {
        "label": "Send a firm little DM",
        "governingStats": { "cred": 1 },
        "tags": ["social", "risky"],
        "outcomes": {
          "bad": {
            "text": "You DM the kid something about “making it your own” and it reads as a cease-and-desist to a fifteen-year-old, who posts it, and now you’re the villain who bullied a child. The internet is unkind. You deserve some of it.",
            "effects": { "cred": -2, "fame": 3, "addFlag": "copycat_feud" }
          },
          "good": {
            "text": "You gently tell the kid to write their own songs instead of copying yours, and it stings them into actually doing it — which is either mentorship or rejection depending on the day.",
            "effects": { "cred": 3, "fame": 3, "addFlag": "copycat_feud" }
          },
          "incredible": {
            "text": "Your tough-love DM lights a fire in the kid, who channels the hurt into a genuinely great original — a diss track, technically, aimed at you, and it’s GOOD. You created a rival by trying to create distance.",
            "effects": { "cred": 4, "fame": 5, "creativity": 2, "addFlag": "copycat_feud" }
          }
        }
      }
    }
  },
  {
    "id": "nm_copycat_duet",
    "act": 2,
    "pathAffinity": [],
    "weight": 11,
    "requires": { "flagsAll": ["copycat"] },
    "art": "ev_nm_copycat_duet",
    "context": "The kid, older now, actually good",
    "prompt": "The kid you boosted is eighteen now and, it turns out, genuinely talented — the imitation burned off and left something real underneath. They ask, terrified, if you’d do a proper duet. The student wants to stand next to the teacher.",
    "recap": "The kid you boosted is eighteen, good, and wants a duet.",
    "tags": ["live", "network"],
    "choices": {
      "left": {
        "label": "Duet as equals",
        "governingStats": { "creativity": 1, "network": 0.3 },
        "tags": ["live", "safe", "band"],
        "outcomes": {
          "bad": {
            "text": "The duet is sweet and slightly lopsided — they’re still finding their feet — but the crowd adores the story of it. The kid floats for a month. You remember floating like that once.",
            "effects": { "creativity": 4, "network": 4, "fame": 3 }
          },
          "good": {
            "text": "The duet works beautifully — their fresh fire, your seasoned control — and for three minutes the generation gap is a superpower instead of a distance. Two artists, one lineage.",
            "effects": { "creativity": 6, "network": 5, "fame": 4 }
          },
          "incredible": {
            "text": "The duet is transcendent, the clip explodes, and it launches the kid’s real career while reminding everyone of yours. You didn’t just boost a fan; you raised a peer. It’s the proudest kind of fame.",
            "effects": { "creativity": 8, "network": 6, "fame": 6 }
          }
        }
      },
      "right": {
        "label": "Let them headline, you support",
        "governingStats": { "cred": 1 },
        "tags": ["live", "risky"],
        "outcomes": {
          "bad": {
            "text": "You insist the kid headline and step back too far, and the kid isn’t quite ready to carry it alone yet. A generous gesture, slightly premature. They’ll get there. You showed them you believed. That stays.",
            "effects": { "cred": 4, "network": 3, "burnout": 3 }
          },
          "good": {
            "text": "You put the kid out front and play sideman for a night, and the reversal — hero backing fan — becomes the most talked-about set of the season. Generosity as spectacle. Both of you win.",
            "effects": { "cred": 6, "network": 4, "fame": 4 }
          },
          "incredible": {
            "text": "You engineer the kid’s breakout and stand in the shadows beaming, and the story of the artist who lifted their own copycat into a star becomes legend. You proved the best thing fame buys is the power to give it away.",
            "effects": { "cred": 8, "network": 5, "fame": 5 }
          }
        }
      }
    }
  },
  {
    "id": "nm_copycat_rise",
    "act": 3,
    "pathAffinity": [],
    "weight": 11,
    "requires": { "anyOf": [{ "flagsAll": ["copycat"] }, { "flagsAll": ["copycat_feud"] }] },
    "art": "ev_nm_copycat_rise",
    "context": "The kid, signed, big now, in a magazine",
    "prompt": "The kid made it — really made it, bigger than you now — and the profile is out. There’s a paragraph about early influences, and there’s your name, in a sentence that’s either a tribute or a footnote depending on how you read it. You read it several times.",
    "recap": "The kid made it bigger than you; your name’s in the profile.",
    "tags": ["social", "fame"],
    "choices": {
      "left": {
        "label": "Be genuinely proud",
        "governingStats": { "cred": 1 },
        "tags": ["social", "safe"],
        "outcomes": {
          "bad": {
            "text": "You post a proud message and mean most of it, and wrestle the small ugly part that wanted to be the one who made it bigger. Human, imperfect, mostly gracious. The kid thanks you warmly.",
            "effects": { "cred": 4, "fame": 4, "burnout": 2 }
          },
          "good": {
            "text": "You celebrate the kid’s rise wholeheartedly, and their public gratitude toward you — “I learned everything watching them” — becomes a beautiful full circle. Being an influence is its own summit.",
            "effects": { "cred": 6, "fame": 6, "network": 4 }
          },
          "incredible": {
            "text": "Your grace about the kid surpassing you becomes part of both your legends — the mentor who was only ever glad — and their platform turns into a megaphone for you. You gave, and it came back tenfold. It always does, eventually.",
            "effects": { "cred": 8, "fame": 9, "network": 5 }
          }
        }
      },
      "right": {
        "label": "Prove you’ve still got the edge",
        "governingStats": { "creativity": 1, "skill": 0.3 },
        "tags": ["indie", "risky"],
        "outcomes": {
          "bad": {
            "text": "You set out to prove the teacher can still school the student and the effort shows, straining against a kid half your age. Some of it lands. Some of it just looks like you needed it to. It stings either way.",
            "effects": { "creativity": 3, "fame": 4, "burnout": 5 }
          },
          "good": {
            "text": "You answer the “influence” framing by making work so vital the kid starts citing your NEW stuff, not just the old. The teacher’s still teaching. The lineage runs both ways now.",
            "effects": { "creativity": 6, "fame": 6, "cred": 4 }
          },
          "incredible": {
            "text": "You make something so undeniable the kid publicly says “I’m still chasing them,” and the whole narrative flips — you’re not their past influence, you’re their current one. Evolved past your own legend. Nobody saw it coming.",
            "effects": { "creativity": 8, "fame": 8, "cred": 5 }
          }
        }
      }
    }
  },
  {
    "id": "nm_copycat_mirror",
    "act": 3,
    "pathAffinity": [],
    "weight": 11,
    "requires": { "flagsAll": ["copycat_feud"] },
    "art": "ev_nm_copycat_mirror",
    "context": "The kid’s diss track, and it’s good",
    "prompt": "The kid you shut down years ago never forgot it, and now they’re big and their new single is, unmistakably, about you — a diss track, sharp and specific and, infuriatingly, excellent. It’s climbing. Everyone’s asking if you’ll respond.",
    "recap": "The kid you shut down is big now, with a diss track about you.",
    "tags": ["social", "rival"],
    "choices": {
      "left": {
        "label": "Answer with your own",
        "minigame": "ideas",
        "governingStats": { "creativity": 1 },
        "tags": ["write", "risky", "rival"],
        "outcomes": {
          "bad": {
            "text": "You fire back a response track and it’s good but reads as an old-timer punching down at someone half your age. You win the bars and lose the optics. The internet keeps the receipts. Both of them.",
            "effects": { "creativity": 4, "fame": 6, "burnout": 4, "rivalry": 1 }
          },
          "good": {
            "text": "Your response is sharp, self-aware, and generous enough to acknowledge you were wrong to shut them down years ago. The beef becomes a genuine hip-hop-history moment. Respect, exchanged in bars.",
            "effects": { "creativity": 6, "fame": 8, "cred": 4, "rivalry": 1 }
          },
          "incredible": {
            "text": "You answer with a track so good and so big-hearted it ends the feud in one verse — owning your mistake, saluting their talent — and the two-song saga becomes a classic. You turned a grudge into art. Both of you immortal now.",
            "effects": { "creativity": 9, "fame": 11, "cred": 6, "rivalry": -1 }
          }
        }
      },
      "right": {
        "label": "Refuse to feed it, reach out privately",
        "governingStats": { "cred": 1 },
        "tags": ["social", "safe", "rival"],
        "outcomes": {
          "bad": {
            "text": "You DM an apology instead of responding publicly and the kid screenshots it as “them running scared.” Grace, weaponized. You did the right thing and it looked like the weak thing. It happens.",
            "effects": { "cred": 3, "fame": 3, "rivalry": 1 }
          },
          "good": {
            "text": "You privately own that the DM years ago was a mistake, and the kid — not expecting sincerity — softens. The public beef quietly dies because you handled it like an adult. Nobody wins a headline; both of you win a night’s sleep.",
            "effects": { "cred": 6, "network": 3, "rivalry": -1 }
          },
          "incredible": {
            "text": "Your private apology moves the kid so much they retract the diss and release a new verse about growth instead, and the whole arc — hero, mistake, feud, reconciliation — becomes the most human story in music that year. You closed the circle you cracked.",
            "effects": { "cred": 8, "fame": 6, "network": 4, "rivalry": -2 }
          }
        }
      }
    }
  },
  {
    "id": "nm_lost_tape",
    "act": 1,
    "pathAffinity": [],
    "weight": 9,
    "art": "ev_nm_lost_tape",
    "context": "A pawn-shop crate, a nameless demo tape",
    "prompt": "Digging through a pawn-shop crate, you find an unlabeled cassette. You play it in the van and it stops you cold — a local band, 1983, no name, no fame, and songs better than most of what charts now. The world forgot something extraordinary.",
    "recap": "A pawn-shop crate, an unlabeled cassette, 1983, no name.",
    "tags": ["record", "roots"],
    "choices": {
      "left": {
        "label": "Become obsessed with it",
        "governingStats": { "creativity": 1 },
        "tags": ["record", "safe"],
        "outcomes": {
          "bad": {
            "text": "You listen to the tape a hundred times and it quietly ruins you for your own writing — how do you compete with a ghost? A beautiful haunting with a downside. But you can’t stop.",
            "effects": { "creativity": 4, "burnout": 3, "addFlag": "lost_tape" }
          },
          "good": {
            "text": "The tape becomes your secret teacher — you study its choices, steal its courage, and your own writing levels up chasing a band that vanished. The dead can mentor too.",
            "effects": { "creativity": 6, "cred": 3, "addFlag": "lost_tape" }
          },
          "incredible": {
            "text": "The tape reorganizes your whole sense of what’s possible, and you vow to find out who made it. A mystery and a mission, dropped into your life by a five-dollar crate. Everything changes from here.",
            "effects": { "creativity": 7, "cred": 4, "addFlag": "lost_tape" }
          }
        }
      },
      "right": {
        "label": "Play it for everyone you know",
        "governingStats": { "network": 1 },
        "tags": ["social", "safe"],
        "outcomes": {
          "bad": {
            "text": "You evangelize the tape to anyone who’ll listen and most people shrug, and you learn that some magic doesn’t translate secondhand. You keep playing it anyway. For the three who get it.",
            "effects": { "network": 3, "cred": 2, "addFlag": "lost_tape" }
          },
          "good": {
            "text": "You share the tape and a small cult forms around it, and the mystery of who made it becomes a scene-wide obsession you started. A ghost, resurrected by word of mouth.",
            "effects": { "network": 5, "cred": 3, "fame": 2, "addFlag": "lost_tape" }
          },
          "incredible": {
            "text": "The tape spreads through the scene like a rumor, and suddenly everyone wants to know who this vanished band was. You’ve accidentally started a movement to resurrect strangers. The hunt is on.",
            "effects": { "network": 6, "cred": 4, "fame": 3, "addFlag": "lost_tape" }
          }
        }
      }
    }
  },
  {
    "id": "nm_tape_hunt",
    "act": 2,
    "pathAffinity": [],
    "weight": 11,
    "requires": { "flagsAll": ["lost_tape"] },
    "art": "ev_nm_tape_hunt",
    "context": "A trail of clues to a vanished band",
    "prompt": "You’ve been chasing the tape’s origins — a scratched-out name, a studio that closed, a phone number that rings a hardware store now. Tonight a lead pans out: one of the band members is alive, in town, and has no idea their tape survived.",
    "recap": "A lead panned out: a bandmate from the tape is alive and in town.",
    "tags": ["network", "home"],
    "choices": {
      "left": {
        "label": "Find them, gently",
        "governingStats": { "network": 1, "cred": 0.3 },
        "tags": ["network", "safe"],
        "outcomes": {
          "bad": {
            "text": "You track them down and they’re guarded, wary of a stranger digging up a painful chapter. You leave your number. They don’t call for weeks. Some ghosts want to stay buried. You wait.",
            "effects": { "network": 3, "cred": 3, "burnout": 2 }
          },
          "good": {
            "text": "You find the bassist, now a schoolteacher, and they’re stunned anyone remembers. The conversation cracks something open — grief and pride and forty years of “what if.” You’re holding history now.",
            "effects": { "network": 5, "cred": 4, "creativity": 3 }
          },
          "incredible": {
            "text": "You find them and they weep, because they’d convinced themselves the music never mattered, and you get to be the person who proves it did. Some searches end in a gift you give someone else. This is one.",
            "effects": { "network": 6, "cred": 5, "creativity": 4 }
          }
        }
      },
      "right": {
        "label": "Track the whole band down",
        "governingStats": { "creativity": 1, "network": 0.4 },
        "tags": ["network", "risky"],
        "outcomes": {
          "bad": {
            "text": "You try to reunite all four and discover two won’t speak to each other over a fight from 1984 that’s somehow still live. The tape reopens old wounds. History is complicated. You stir it anyway.",
            "effects": { "creativity": 3, "network": 3, "burnout": 4 }
          },
          "good": {
            "text": "You find three of the four and the reunion coffee is electric — old friends, old songs, forty years collapsing into an afternoon. You gave them each other back. That’s bigger than any record.",
            "effects": { "creativity": 6, "network": 5, "cred": 4 }
          },
          "incredible": {
            "text": "You reassemble the whole vanished band for the first time since 1983, and watching them fall back into their old harmonies in a kitchen is the most moving thing you’ve ever caused. The tape wasn’t lost. It was waiting for you.",
            "effects": { "creativity": 8, "network": 6, "cred": 5 }
          }
        }
      }
    }
  },
  {
    "id": "nm_tape_release",
    "act": 3,
    "pathAffinity": [],
    "weight": 11,
    "requires": { "flagsAll": ["lost_tape"] },
    "art": "ev_nm_tape_release",
    "context": "The 1983 songs, and a choice about whose name goes on them",
    "prompt": "You can bring the lost songs to the world at last. Reissue the tape under the original band’s name, giving vanished artists their due — or interpolate the best song into your own work, where it’ll reach far more people, under yours. History, or reach.",
    "recap": "The lost 1983 songs, and whose name goes on them.",
    "tags": ["record", "deal"],
    "choices": {
      "left": {
        "label": "Reissue it under their name",
        "governingStats": { "cred": 1 },
        "tags": ["record", "roots", "safe"],
        "outcomes": {
          "bad": {
            "text": "You reissue the tape faithfully and it sells to a devoted few, and the band gets a modest, dignified due. Not the reach it deserved, but the credit it earned. The bassist frames the vinyl. That’s enough.",
            "effects": { "cred": 5, "fame": 3, "money": 40 }
          },
          "good": {
            "text": "The reissue finds its audience and the 1983 band — alive, astonished — gets to feel, at last, that the music mattered. You spent your platform on strangers. It’s the most generous thing an artist can do.",
            "effects": { "cred": 7, "fame": 5, "network": 4, "chartTitle": "The 1983 Song" }
          },
          "incredible": {
            "text": "The reissue becomes a phenomenon, a lost classic restored, and the band gets a triumphant late-life moment they’d given up on. You could have taken the song. You gave them the world instead. That’s who you turned out to be.",
            "effects": { "cred": 9, "fame": 8, "network": 5, "chartTitle": "The 1983 Song" }
          }
        }
      },
      "right": {
        "label": "Interpolate it into your own",
        "governingStats": { "creativity": 1, "network": 0.3 },
        "tags": ["write", "mainstream", "risky"],
        "outcomes": {
          "bad": {
            "text": "You build the lost song’s DNA into your own hit and it charts, but the credit gets fuzzy and the band’s fans call it theft. Reach, at the cost of the moral high ground. You clear the samples. It still feels off.",
            "effects": { "creativity": 4, "fame": 8, "money": 120, "cred": -3 }
          },
          "good": {
            "text": "You interpolate the song, credit the band generously, and split the windfall — and suddenly a 1983 nobody is getting royalty checks from a modern hit. Reach AND fairness, threaded carefully.",
            "effects": { "creativity": 6, "fame": 10, "money": 200, "cred": 2 }
          },
          "incredible": {
            "text": "You turn the lost song into a massive hit that credits and enriches the original band beyond their dreams, giving them both the reach AND the money four decades late. You made the ghost famous and paid it too. Perfect.",
            "effects": { "creativity": 8, "fame": 14, "money": 300, "cred": 3 }
          }
        }
      }
    }
  },
  {
    "id": "nm_tape_owner",
    "act": 3,
    "pathAffinity": [],
    "weight": 11,
    "requires": { "flagsAll": ["lost_tape"] },
    "art": "ev_nm_tape_owner",
    "context": "The songwriter, now a crossing guard, and the radio",
    "prompt": "The person who wrote those 1983 songs works a school crossing now, orange vest, forty years from the last time anyone cared. You arranged for their song to play on the radio at 8:15 a.m., right at their corner. You’re parked across the street to watch.",
    "recap": "The songwriter works a school crossing. Their song hits the radio at 8:15.",
    "tags": ["home", "social"],
    "choices": {
      "left": {
        "label": "Watch from a distance",
        "governingStats": { "cred": 1 },
        "tags": ["home", "safe"],
        "outcomes": {
          "bad": {
            "text": "The song plays and they don’t recognize it at first — it’s been so long — and then they do, and they stand very still holding a stop sign while children swirl around them. You cry in the van. You don’t go over. Some moments aren’t yours to interrupt.",
            "effects": { "cred": 5, "creativity": 3, "burnout": 2 }
          },
          "good": {
            "text": "The song plays and they freeze, then smile, then keep working — but different now, standing taller in the orange vest, a person who once made something that lasted. You gave them that, anonymously. It’s enough to watch.",
            "effects": { "cred": 7, "creativity": 4, "network": 3 }
          },
          "incredible": {
            "text": "The song plays and they conduct it with the stop sign, laughing, tears streaming, and a few parents who’ve heard the reissue start clapping at a crossing at 8:15 a.m. You engineered a miracle on an ordinary corner. You’ll never tell them it was you. You don’t have to.",
            "effects": { "cred": 9, "creativity": 5, "fame": 3 }
          }
        }
      },
      "right": {
        "label": "Cross the street and tell them",
        "governingStats": { "network": 1, "cred": 0.3 },
        "tags": ["home", "risky"],
        "outcomes": {
          "bad": {
            "text": "You introduce yourself and they’re overwhelmed, guarded, unsure what a famous stranger wants from them now. It takes a while to convince them you only want to say thank you. Eventually, they believe you. It’s a strange, real morning.",
            "effects": { "network": 4, "cred": 4, "burnout": 3 }
          },
          "good": {
            "text": "You cross over and tell them everything — the tape, the reissue, the fans — and watch four decades of “it didn’t matter” dissolve in real time. You hand a stranger back their own life’s meaning. They hug you like family.",
            "effects": { "network": 6, "cred": 6, "creativity": 4 }
          },
          "incredible": {
            "text": "You tell them, and they insist on playing you the songs they never recorded, right there, humming at the crossing, and you realize the tape was just the beginning. You’ve found a whole lost catalog and a friend. The best thing you ever dug out of a crate was a person.",
            "effects": { "network": 7, "cred": 8, "creativity": 6 }
          }
        }
      }
    }
  },
  {
    "id": "nm_intern_meet",
    "act": 2,
    "pathAffinity": [],
    "weight": 9,
    "art": "ev_nm_intern_meet",
    "context": "A label intern, whispering, risking their job",
    "prompt": "A label intern corners you after a showcase, glancing over their shoulder. “Nobody upstairs gets what you’re doing, but I do, and I’m going to help even though it’s absolutely not my job.” They have the specific bright-eyed idealism the industry usually kills by year two.",
    "recap": "A label intern corners you after the showcase, ready to help off the books.",
    "tags": ["network", "deal"],
    "choices": {
      "left": {
        "label": "Accept the alliance",
        "governingStats": { "network": 1 },
        "tags": ["network", "safe"],
        "outcomes": {
          "bad": {
            "text": "You take the intern’s help and they overreach immediately, pushing your demo to people above their pay grade and getting a talking-to. Their heart’s enormous; their judgment’s still loading. You steady them.",
            "effects": { "network": 3, "cred": 2, "addFlag": "intern_ally" }
          },
          "good": {
            "text": "The intern becomes a genuine ally on the inside — slipping you intel, championing you in rooms you’ll never see. Every artist needs one true believer with a keycard. You found yours.",
            "effects": { "network": 5, "cred": 3, "addFlag": "intern_ally" }
          },
          "incredible": {
            "text": "The intern’s belief in you is so pure it recharges your own, and their inside advocacy starts moving actual mountains. You gained a friend who’d burn their career for you. Guard that. It’s rare.",
            "effects": { "network": 6, "cred": 4, "fame": 2, "addFlag": "intern_ally" }
          }
        }
      },
      "right": {
        "label": "Protect them from themselves",
        "governingStats": { "cred": 1 },
        "tags": ["home", "safe"],
        "outcomes": {
          "bad": {
            "text": "You tell the intern not to risk their job for you and they’re crushed, hearing it as “you don’t want my help.” You fumbled the kindness. You fix it, eventually, and they help anyway, carefully.",
            "effects": { "cred": 3, "network": 2, "addFlag": "intern_ally" }
          },
          "good": {
            "text": "You gently teach the intern to help you WITHOUT torching their career — playing the long game inside the machine. You’re mentoring them while they champion you. A real two-way alliance.",
            "effects": { "cred": 5, "network": 4, "addFlag": "intern_ally" }
          },
          "incredible": {
            "text": "You look out for the intern like they’re your own, and that care makes them fiercely, permanently loyal — the kind of ally who becomes a power player and never forgets who was decent when they were nobody. You invested in a person. It compounds.",
            "effects": { "cred": 6, "network": 5, "addFlag": "intern_ally" }
          }
        }
      }
    }
  },
  {
    "id": "nm_intern_leak",
    "act": 2,
    "pathAffinity": [],
    "weight": 11,
    "requires": { "flagsAll": ["intern_ally"] },
    "art": "ev_nm_intern_leak",
    "context": "The intern, with a stolen shortlist",
    "prompt": "The intern slides you a folded paper: the label’s confidential A&R shortlist for the next big signing, and your name is on the bubble. “You didn’t get this from me,” they whisper, terrified and thrilled. It’s genuinely valuable and genuinely stolen.",
    "recap": "The intern slides you the confidential A&R shortlist. Your name’s on it.",
    "tags": ["deal", "network"],
    "choices": {
      "left": {
        "label": "Use the intel",
        "governingStats": { "network": 1 },
        "tags": ["deal", "risky"],
        "outcomes": {
          "bad": {
            "text": "You act on the leak and it’s obvious you had inside info, and the intern nearly gets caught in the fallout. The advantage cost more than it gained. You promise never to put them at risk again. You mostly mean it.",
            "effects": { "network": 3, "fame": 3, "burnout": 3 }
          },
          "good": {
            "text": "You use the intel subtly — showing up exactly where the decision-makers will be, seeming to earn it — and jump from the bubble to the top of the list. The intern watches from their desk, glowing.",
            "effects": { "network": 6, "fame": 5, "cred": 2 }
          },
          "incredible": {
            "text": "You leverage the leak so smoothly nobody suspects, and turn a shortlist bubble into a bidding war. The intern realizes they just changed the course of your career from a cubicle. You share the win with them, quietly. They never forget it.",
            "effects": { "network": 8, "fame": 6, "cred": 3 }
          }
        }
      },
      "right": {
        "label": "Refuse it, protect them",
        "governingStats": { "cred": 1 },
        "tags": ["network", "safe"],
        "outcomes": {
          "bad": {
            "text": "You hand the list back and tell them to shred it, and they’re briefly hurt that you won’t use their gift. But you also just taught them that some lines matter more than any leg up. They respect you more, later.",
            "effects": { "cred": 5, "network": 2 }
          },
          "good": {
            "text": "You refuse the stolen intel and earn your spot the honest way, and the intern — watching you win clean — learns the kind of integrity the industry usually beats out of people. You just kept a good person good.",
            "effects": { "cred": 7, "network": 4, "fame": 3 }
          },
          "incredible": {
            "text": "You not only refuse the leak but help the intern out of the ethical hole they dug, and your clean climb — no shortcuts, no risk to your ally — becomes the thing that impresses the label most. Integrity, it turns out, was the shortcut.",
            "effects": { "cred": 8, "network": 5, "fame": 4 }
          }
        }
      }
    }
  },
  {
    "id": "nm_intern_fired",
    "act": 3,
    "pathAffinity": [],
    "weight": 11,
    "requires": { "flagsAll": ["intern_ally"] },
    "art": "ev_nm_intern_fired",
    "context": "The intern, jobless, on your doorstep",
    "prompt": "The intern got fired — for you, ultimately, for one advocacy too many on your behalf. They’re on your doorstep with a box of desk stuff and a brave face that isn’t holding. They bet their career on believing in you. The bet just came due.",
    "recap": "The intern got fired over you, box of desk stuff in hand.",
    "tags": ["home", "network"],
    "choices": {
      "left": {
        "label": "Take them on, for real",
        "governingStats": { "network": 1, "cred": 0.3 },
        "tags": ["deal", "safe"],
        "outcomes": {
          "bad": {
            "text": "You hire the intern onto your own tiny team and can barely afford them, and it’s tight and stressful and the right thing. Loyalty isn’t free. You pay it gladly, mostly, on the good months.",
            "effects": { "network": 4, "money": -80, "cred": 4 }
          },
          "good": {
            "text": "You bring the intern on as your manager and they turn out to be brilliant at it — all that idealism, finally pointed at something that appreciates it. The best hire you never planned to make.",
            "effects": { "network": 7, "cred": 4, "money": 60 }
          },
          "incredible": {
            "text": "You make the intern your right hand and together you build something neither could alone — their inside knowledge, your artistry — and they become the manager other artists envy. You caught someone falling and you both flew.",
            "effects": { "network": 9, "cred": 5, "fame": 3, "money": 100 }
          }
        }
      },
      "right": {
        "label": "Launch them somewhere better",
        "governingStats": { "cred": 1, "network": 0.3 },
        "tags": ["network", "risky"],
        "outcomes": {
          "bad": {
            "text": "You call in favors to place the intern at a better label and it takes months and a lot of your own capital, and they’re grateful but adrift in the gap. Doing right by someone is slow work. You do it anyway.",
            "effects": { "cred": 4, "network": 3, "burnout": 3 }
          },
          "good": {
            "text": "You use your growing pull to land the intern a real job with real power at a place that deserves them, and they never forget who caught them. An ally, promoted, and eternally in your corner.",
            "effects": { "cred": 6, "network": 6, "fame": 3 }
          },
          "incredible": {
            "text": "You launch the intern into a position where THEY become a decision-maker, and years later, from a corner office, they green-light the risky artists everyone else passes on — because someone once did that for you, through them. The good, compounding down the generations.",
            "effects": { "cred": 8, "network": 7, "fame": 4 }
          }
        }
      }
    }
  },
  {
    "id": "nm_intern_desk",
    "act": 3,
    "pathAffinity": [],
    "weight": 11,
    "requires": { "flagsAll": ["intern_ally"] },
    "art": "ev_nm_intern_desk",
    "context": "The intern, behind a big desk now, with power",
    "prompt": "The intern has a corner office now — climbed all the way to the chair where the real decisions get made. They call you in, grinning, and slide a contract across the desk. “Remember when I had to sneak you demos? Now I sign the checks. Let me do this right.”",
    "recap": "The intern runs a corner office now, sliding you a contract.",
    "tags": ["deal", "network"],
    "choices": {
      "left": {
        "label": "Sign with them",
        "governingStats": { "network": 1 },
        "tags": ["deal", "safe"],
        "outcomes": {
          "bad": {
            "text": "You sign and it’s a good deal made by someone who loves you, which turns out to complicate as much as it helps — friendship and business in one contract. It works. It’s occasionally weird. You’d still do it.",
            "effects": { "network": 4, "money": 200, "cred": 2 }
          },
          "good": {
            "text": "You sign with the one executive in the whole industry who actually believes in you, and the deal is everything the sneaking-around days dreamed of. The intern got the power and used it exactly right. On you.",
            "effects": { "network": 6, "money": 300, "fame": 4 }
          },
          "incredible": {
            "text": "You and the intern build a partnership that becomes industry legend — the exec who never forgot and the artist who never left — and together you launch a whole roster of the artists everyone else was too scared to sign. Full circle, and a dynasty.",
            "effects": { "network": 8, "money": 400, "fame": 6, "cred": 3 }
          }
        }
      },
      "right": {
        "label": "Tell them to sign someone who needs it more",
        "governingStats": { "cred": 1 },
        "tags": ["network", "risky"],
        "outcomes": {
          "bad": {
            "text": "You turn down the deal and point them toward a struggling newcomer, and the intern is briefly baffled that you’d refuse them. Then they get it. You’re paying forward the exact thing they did for you. They tear up at the desk.",
            "effects": { "cred": 5, "network": 3 }
          },
          "good": {
            "text": "You tell the intern to spend their power on the next nobody who needs a believer, and together you find that artist and change their life. You closed one circle by opening another. The lineage of belief continues.",
            "effects": { "cred": 7, "network": 5, "fame": 3 }
          },
          "incredible": {
            "text": "You decline the deal so the intern can champion the next you, and you both make it a mission — the exec and the artist, finding and lifting the overlooked, for years. You turned one act of faith into an institution of it. That’s the whole point of making it.",
            "effects": { "cred": 9, "network": 6, "fame": 4 }
          }
        }
      }
    }
  },
  {
    "id": "nm_van_named",
    "act": 1,
    "pathAffinity": [],
    "weight": 9,
    "art": "ev_nm_van_named",
    "context": "The band, in a parking lot, naming the van",
    "prompt": "The van has earned a name. It’s carried you through three tours and two breakdowns and one memorable incident with a raccoon, and tonight the band decides it deserves an identity. Naming it makes it a member. Members you don’t abandon.",
    "recap": "Three tours, two breakdowns, one raccoon. The van has earned a name.",
    "tags": ["band", "tour"],
    "choices": {
      "left": {
        "label": "Name it something grand",
        "governingStats": { "network": 1 },
        "tags": ["band", "safe"],
        "outcomes": {
          "bad": {
            "text": "You christen it something majestic and the van, sensing hubris, breaks down within the week. The name stays. So does the tow bill. You respect it more now, honestly.",
            "effects": { "network": 3, "burnout": 2, "addFlag": "the_van" }
          },
          "good": {
            "text": "The grand name sticks and the van rises to it, becoming a genuine character in the band’s mythology — the fifth member, the one that snores in traffic. Morale, upgraded.",
            "effects": { "network": 5, "cred": 2, "burnout": -2, "addFlag": "the_van" }
          },
          "incredible": {
            "text": "The name becomes legend — fans ask about the van by name, it gets its own merch, it develops a personality none of you can explain. You didn’t name a vehicle. You adopted a family member with a check-engine light.",
            "effects": { "network": 6, "cred": 3, "fame": 2, "addFlag": "the_van" }
          }
        }
      },
      "right": {
        "label": "Name it something ridiculous",
        "governingStats": { "creativity": 1 },
        "tags": ["band", "indie"],
        "outcomes": {
          "bad": {
            "text": "You name it something so dumb the band immediately regrets it, and now you’re legally committed to saying it out loud at gas stations forever. The van seems pleased. It runs a little better, spitefully.",
            "effects": { "creativity": 3, "burnout": 2, "addFlag": "the_van" }
          },
          "good": {
            "text": "The ridiculous name becomes an inside joke that binds the whole band, and saying it out loud never stops being funny. Stupid things, shared, are the strongest glue there is.",
            "effects": { "creativity": 5, "network": 3, "addFlag": "the_van" }
          },
          "incredible": {
            "text": "The absurd name catches on with fans and becomes a whole bit — the van has a fan account, a backstory, a birthday. You built a mythology out of a joke, and the joke holds the band together through everything. Sacred nonsense.",
            "effects": { "creativity": 6, "network": 3, "fame": 2, "addFlag": "the_van" }
          }
        }
      }
    }
  },
  {
    "id": "nm_van_breakdown",
    "act": 2,
    "pathAffinity": [],
    "weight": 11,
    "requires": { "flagsAll": ["the_van"] },
    "art": "ev_nm_van_breakdown",
    "context": "3 a.m., forty miles from anywhere, hazards blinking",
    "prompt": "The van dies at 3 a.m. on an empty highway, forty miles from the next town and eight hours from the show. Hazards blinking, breath fogging, everyone looking at you. This is the test every touring band eventually faces alone in the dark.",
    "recap": "The van dies at 3 a.m., forty miles from anywhere, hazards blinking.",
    "tags": ["tour", "band"],
    "choices": {
      "left": {
        "label": "Fix it yourselves",
        "governingStats": { "skill": 1, "network": 0.3 },
        "tags": ["work", "risky"],
        "outcomes": {
          "bad": {
            "text": "You pop the hood and pretend to understand it and eventually a trucker takes pity and fixes it in ten minutes flat. Humbling. You make the show with your dignity in a duffel bag. The van forgives you.",
            "effects": { "skill": 3, "network": 3, "burnout": 5 }
          },
          "good": {
            "text": "You actually diagnose and fix it with a YouTube video and a coat hanger, and the band’s faith in the van — and in you — deepens. You kept the family member alive in the dark. That bonds people.",
            "effects": { "skill": 6, "network": 4, "burnout": 3 }
          },
          "incredible": {
            "text": "You perform highway surgery so competent the band starts calling you the van-whisperer, and you make the show with time to spare. The 3 a.m. breakdown becomes the story you tell for a decade. The van, saved, runs like it’s grateful.",
            "effects": { "skill": 7, "network": 5, "cred": 3 }
          }
        }
      },
      "right": {
        "label": "Wait it out together",
        "governingStats": { "cred": 1 },
        "tags": ["band", "home", "safe"],
        "outcomes": {
          "bad": {
            "text": "You call a tow and wait three hours in the cold and miss the show, and the missed gig stings — but somewhere in hour two, huddled in a dead van, the band has the realest conversation it’s ever had. Worth the gig? Almost.",
            "effects": { "cred": 4, "network": 3, "burnout": 4 }
          },
          "good": {
            "text": "Stuck in the dark, you pass the guitar around and write half a song by dashboard light, and the breakdown becomes one of the best nights of the tour. The van broke down and the band grew up.",
            "effects": { "cred": 6, "creativity": 4, "network": 3 }
          },
          "incredible": {
            "text": "The forced stillness cracks something open — the band talks all night, resolves old tensions, becomes unbreakable — and by dawn, when the tow arrives, you’re a different, closer band. The van broke down so you wouldn’t. Sacred, in retrospect.",
            "effects": { "cred": 7, "creativity": 5, "network": 4, "burnout": -2 }
          }
        }
      }
    }
  },
  {
    "id": "nm_van_odometer",
    "act": [2, 3],
    "pathAffinity": [],
    "weight": 11,
    "requires": { "flagsAll": ["the_van"] },
    "art": "ev_nm_van_odometer",
    "context": "The odometer, about to roll 300,000",
    "prompt": "The odometer is about to tick over 300,000 miles — mid-drive, on a highway, with the whole band watching the numbers like a countdown. Every one of those miles was a show, a fight, a sunrise, a life. The van is about to hit a milestone no rational vehicle should reach.",
    "recap": "The odometer is about to roll 300,000, mid-drive.",
    "tags": ["tour", "band"],
    "choices": {
      "left": {
        "label": "Pull over and mark it",
        "governingStats": { "cred": 1 },
        "tags": ["band", "home", "safe"],
        "outcomes": {
          "bad": {
            "text": "You pull over to photograph the odometer and someone drops the phone and you miss the exact roll, capturing 300,001. The van seems amused. You keep the blurry photo forever anyway. It’s perfect.",
            "effects": { "cred": 4, "network": 3, "burnout": -2 }
          },
          "good": {
            "text": "You pull onto the shoulder and the whole band cheers as it rolls over, and someone pours out a little coffee for the van like it’s a fallen soldier. Ridiculous. Sincere. The kind of thing that makes a band a family.",
            "effects": { "cred": 6, "network": 4, "burnout": -3 }
          },
          "incredible": {
            "text": "You mark 300,000 with an impromptu roadside ceremony that someone films, and it becomes a beloved bit of your lore — the band that threw a party for a Ford on the interstate. The van gets a plaque. It earned the plaque.",
            "effects": { "cred": 7, "network": 4, "fame": 3 }
          }
        }
      },
      "right": {
        "label": "Let it roll, drive on",
        "governingStats": { "skill": 1 },
        "tags": ["tour", "risky"],
        "outcomes": {
          "bad": {
            "text": "You let the milestone pass without ceremony because there’s a show to make, and later that night you feel oddly guilty, like you skipped a birthday. The van doesn’t hold grudges. You hold enough for both of you.",
            "effects": { "skill": 3, "burnout": 3 }
          },
          "good": {
            "text": "You drive straight through 300,000 without stopping, because the road is the whole point and the van would want to keep moving. It feels right — no monument, just momentum. The van hums on, satisfied.",
            "effects": { "skill": 5, "network": 3, "cred": 2 }
          },
          "incredible": {
            "text": "You honor the milestone by NOT stopping — 300,000 miles and still chasing the next show — and the band realizes that’s the truest tribute: the van doing exactly what it was built for, forever, with you. Onward. Always onward.",
            "effects": { "skill": 6, "network": 4, "cred": 3 }
          }
        }
      }
    }
  },
  {
    "id": "nm_van_museum",
    "act": 3,
    "pathAffinity": [],
    "weight": 11,
    "requires": { "flagsAll": ["the_van"] },
    "art": "ev_nm_van_museum",
    "context": "A collector, offering real money for the van",
    "prompt": "You’re famous enough now that a collector wants to buy the van — as memorabilia, for a music museum, real money, climate-controlled display, a plaque telling its story. It would be preserved forever. It would also never drive again. It’s still running fine, by the way. It always is.",
    "recap": "A collector offers real money for the van, for a museum.",
    "tags": ["deal", "home"],
    "choices": {
      "left": {
        "label": "Let it be enshrined",
        "governingStats": { "network": 1 },
        "tags": ["deal", "safe"],
        "outcomes": {
          "bad": {
            "text": "You sell the van to the museum and the check is big and the goodbye is awful — you cry in the parking lot over a Ford, and so does the drummer, and neither of you is embarrassed. It’ll be safe now. Safe isn’t the same as alive.",
            "effects": { "network": 3, "money": 300, "burnout": 4 }
          },
          "good": {
            "text": "The van gets enshrined with full honors, and thousands of fans get to see the thing that carried you, and you visit it sometimes and put a hand on the hood. It found the retirement it earned. You let it go with grace.",
            "effects": { "network": 5, "money": 350, "fame": 4 }
          },
          "incredible": {
            "text": "The van becomes the museum’s most beloved exhibit — kids climb in it, fans leave notes, its story gets told forever — and you realize you didn’t sell it, you immortalized it. Some family members you honor by letting the world meet them. It lives on, parked, eternal.",
            "effects": { "network": 6, "money": 400, "fame": 6, "cred": 3 }
          }
        }
      },
      "right": {
        "label": "Keep it running, forever",
        "governingStats": { "cred": 1 },
        "tags": ["home", "risky"],
        "outcomes": {
          "bad": {
            "text": "You turn down the money to keep the van alive and it immediately needs a $2,000 transmission, and you pay it, because you don’t put down family for being old. It’s a ruinous, ridiculous, correct decision. The van knows.",
            "effects": { "cred": 5, "money": -100, "burnout": 2 }
          },
          "good": {
            "text": "You refuse to enshrine a thing that still runs, and the van keeps rolling to shows into an age no van should see, and its continued existence becomes its own legend. Some things you don’t preserve. You just keep loving them, in motion.",
            "effects": { "cred": 7, "network": 3, "fame": 3 }
          },
          "incredible": {
            "text": "You keep the van running out of pure loyalty and it becomes a rolling monument — the famous band that never retired their first van — and its refusal to die mirrors yours. It’ll outlive the museum. It’ll outlive all of us. Long may it run.",
            "effects": { "cred": 8, "network": 4, "fame": 5 }
          }
        }
      }
    }
  },
  {
    "id": "nm_first_letter",
    "act": 1,
    "pathAffinity": [],
    "weight": 9,
    "art": "ev_nm_first_letter",
    "context": "A paper letter, from a town you’ve never played",
    "prompt": "An actual paper letter arrives — stamped, handwritten, from a town you’ve never played. A stranger heard your music somehow and needed to tell you what it meant to them, in ink, the slow way. Nobody writes letters anymore. This one did.",
    "recap": "A handwritten letter, from a town you’ve never played.",
    "tags": ["social", "home"],
    "choices": {
      "left": {
        "label": "Write back, by hand",
        "governingStats": { "cred": 1 },
        "tags": ["home", "safe"],
        "outcomes": {
          "bad": {
            "text": "You write back and it takes three drafts because you’re out of practice at sincerity on paper. You mail it and immediately worry it was too much. It wasn’t. It was exactly enough. They frame it.",
            "effects": { "cred": 3, "creativity": 2, "addFlag": "pen_pal" }
          },
          "good": {
            "text": "You write a real letter back and start a correspondence with a stranger who knows your music better than most critics. The slowness of it — weeks between letters — becomes a rare, grounding thing. A pen pal. In this century.",
            "effects": { "cred": 5, "creativity": 3, "addFlag": "pen_pal" }
          },
          "incredible": {
            "text": "Your reply begins one of the most meaningful relationships of your career — a stranger who becomes, letter by letter, a kind of conscience and compass. The slow mail carries something the internet can’t. You’ll write them for years.",
            "effects": { "cred": 6, "creativity": 4, "addFlag": "pen_pal" }
          }
        }
      },
      "right": {
        "label": "Read it before every show",
        "governingStats": { "creativity": 1 },
        "tags": ["home", "safe"],
        "outcomes": {
          "bad": {
            "text": "You keep the letter in your gig bag and reread it on hard nights, and it becomes a slightly worn talisman against the doubt. Some nights it’s the only thing reminding you the music reaches anyone at all. You write back, eventually.",
            "effects": { "creativity": 3, "burnout": -3, "addFlag": "pen_pal" }
          },
          "good": {
            "text": "The letter becomes your pre-show ritual — proof, in ink, that this matters to someone — and you write back to tell them so. The correspondence steadies you through the whole climb. A stranger, anchoring you.",
            "effects": { "creativity": 4, "cred": 3, "burnout": -2, "addFlag": "pen_pal" }
          },
          "incredible": {
            "text": "The letter — and the ones that follow — become the thing you reach for when you forget why you started. A pen pal you’ve never met becomes the truest audience you have. You write back faithfully. It’s the realest thread in a fraying life.",
            "effects": { "creativity": 5, "cred": 4, "burnout": -2, "addFlag": "pen_pal" }
          }
        }
      }
    }
  },
  {
    "id": "nm_letter_two",
    "act": 2,
    "pathAffinity": [],
    "weight": 11,
    "requires": { "flagsAll": ["pen_pal"] },
    "art": "ev_nm_letter_two",
    "context": "The second letter, which knows too much",
    "prompt": "The pen pal’s letters keep coming, and this one stops you cold — they’ve heard something in your music you didn’t know you put there, named a grief you never told anyone, described your own song back to you truer than you understood it. A stranger knows you through the work.",
    "recap": "The pen pal’s new letter names a grief you never told anyone.",
    "tags": ["social", "home"],
    "choices": {
      "left": {
        "label": "Open up completely",
        "governingStats": { "cred": 1 },
        "tags": ["home", "safe"],
        "outcomes": {
          "bad": {
            "text": "You write back your whole raw heart and immediately feel exposed to a person you’ve never met. The vulnerability is real and a little frightening. They receive it with total care. You were right to trust them.",
            "effects": { "cred": 4, "creativity": 3, "burnout": 2 }
          },
          "good": {
            "text": "You match their honesty with your own, and the correspondence becomes the one place you can be completely truthful about the music and the fear underneath it. A stranger becomes the safest room you have.",
            "effects": { "cred": 6, "creativity": 4, "burnout": -3 }
          },
          "incredible": {
            "text": "You write the truest letter of your life, and their reply unlocks a song you couldn’t have written without them — the pen pal becomes, quietly, a collaborator on your inner life. Some of your best work traces to an address you’ve never visited.",
            "effects": { "cred": 7, "creativity": 6, "burnout": -2 }
          }
        }
      },
      "right": {
        "label": "Put what they said into a song",
        "minigame": "ideas",
        "governingStats": { "creativity": 1 },
        "tags": ["write", "risky"],
        "outcomes": {
          "bad": {
            "text": "You try to write the thing they saw in you and it comes out overwrought, trying too hard to earn their insight. You shelve it. But the attempt taught you something about what you’ve been avoiding. That’s a start.",
            "effects": { "creativity": 4, "burnout": 3, "writeSong": true }
          },
          "good": {
            "text": "Their letter unlocks a song you’d been circling for years — they named the door and you finally walked through it. You dedicate it to them, obliquely. They’ll know. They always know.",
            "effects": { "creativity": 7, "cred": 4, "writeSong": true }
          },
          "incredible": {
            "text": "The song their letter unlocked becomes one of your most beloved, and only you and one stranger in a town you’ve never played know where it really came from. The pen pal wrote it as much as you did. That secret is yours to keep. Forever.",
            "effects": { "creativity": 8, "cred": 5, "fame": 3, "writeSong": true }
          }
        }
      }
    }
  },
  {
    "id": "nm_letter_town",
    "act": 3,
    "pathAffinity": [],
    "weight": 11,
    "requires": { "flagsAll": ["pen_pal"] },
    "art": "ev_nm_letter_town",
    "context": "Finally routing through the pen pal’s town",
    "prompt": "After years of letters, the tour finally routes through their town — the one on the return address, the one you’ve pictured a hundred times. You could meet them at last. You could also keep them perfect and unmet, a friendship that lives entirely in ink.",
    "recap": "The tour finally routes through the pen pal’s town.",
    "tags": ["live", "home"],
    "choices": {
      "left": {
        "label": "Finally meet them",
        "governingStats": { "network": 1, "cred": 0.3 },
        "tags": ["home", "risky"],
        "outcomes": {
          "bad": {
            "text": "You meet and it’s awkward in the way real life always is next to the perfect version in your head — you both talk too fast and don’t quite land it. But they’re real now. Flawed and real beats perfect and imagined. Mostly.",
            "effects": { "network": 4, "cred": 4, "burnout": 3 }
          },
          "good": {
            "text": "You meet and it’s instantly, warmly right — the friendship translates perfectly from paper to person, and you spend an hour after the show like old friends who happen to have never met. Some pen pals become just pals.",
            "effects": { "network": 6, "cred": 5, "creativity": 3 }
          },
          "incredible": {
            "text": "You meet and it’s one of the great friendships of your life, made flesh at last, and they bring every letter you ever sent them in a shoebox. You realize you’ve been someone’s treasured correspondent for years. The ink was always leading here. It was worth the wait.",
            "effects": { "network": 7, "cred": 6, "creativity": 4 }
          }
        }
      },
      "right": {
        "label": "Keep it in the letters",
        "governingStats": { "cred": 1 },
        "tags": ["home", "safe"],
        "outcomes": {
          "bad": {
            "text": "You play the town and don’t reach out, keeping the friendship pure and paper-bound, and afterward you’re not sure if you protected something or just chickened out. The next letter doesn’t mention it. Neither do you. It hangs there, gently.",
            "effects": { "cred": 4, "creativity": 3, "burnout": 2 }
          },
          "good": {
            "text": "You decide some friendships are truest at letter-distance, and write them a beautiful note about why you didn’t knock. They understand completely — they’d thought the same. The ink stays sacred. Some things you don’t risk to the real world.",
            "effects": { "cred": 6, "creativity": 4 }
          },
          "incredible": {
            "text": "You honor the friendship by keeping it exactly what it is — words, patience, distance — and your letter about WHY becomes the most beautiful one either of you has written. Not everything needs to become real to be true. You protected the rarest thing you have.",
            "effects": { "cred": 7, "creativity": 5, "network": 3 }
          }
        }
      }
    }
  },
  {
    "id": "nm_letter_last",
    "act": 3,
    "pathAffinity": [],
    "weight": 11,
    "requires": { "flagsAll": ["pen_pal"] },
    "art": "ev_nm_letter_last",
    "context": "The letters stopped. Then one came in a different hand.",
    "prompt": "The letters stopped a while ago, and you told yourself people get busy. Then one arrives in unfamiliar handwriting: the pen pal’s kid. The letters, they explain, were the thing they and their parent did together — every one read aloud, every reply a family event. Their parent is gone. They wanted you to know what it meant.",
    "recap": "A letter in a new hand: the pen pal’s kid. The letters have stopped.",
    "tags": ["home", "social"],
    "choices": {
      "left": {
        "label": "Write the kid back",
        "governingStats": { "cred": 1 },
        "tags": ["home", "safe"],
        "outcomes": {
          "bad": {
            "text": "You write back through tears and can’t find words big enough, so you send the ones you have, which are small and true. The kid writes that it was perfect. You keep their parent’s last letter in your gig bag now. It rides with you.",
            "effects": { "cred": 5, "creativity": 3, "burnout": 3 }
          },
          "good": {
            "text": "You write the kid a real letter about what their parent meant to you across all those years, and you start a new correspondence — the thread continues, one generation over. Some connections don’t end. They inherit.",
            "effects": { "cred": 7, "creativity": 4, "network": 3 }
          },
          "incredible": {
            "text": "You write the kid, and it becomes the beginning of a friendship with a whole new person who grew up hearing your letters read aloud like bedtime stories. The pen pal is gone, but the thing you built together outlives them, in ink, in a kid, in you. It doesn’t end. It just changes hands.",
            "effects": { "cred": 9, "creativity": 5, "network": 4 }
          }
        }
      },
      "right": {
        "label": "Dedicate a song to them, publicly",
        "governingStats": { "creativity": 1, "cred": 0.3 },
        "tags": ["live", "risky"],
        "outcomes": {
          "bad": {
            "text": "You dedicate a song to the pen pal at your next show and can barely get through the dedication, and the crowd doesn’t know the story but they feel the weight. You play it for one person who isn’t there. It’s the hardest song you’ve ever played.",
            "effects": { "creativity": 4, "cred": 4, "fame": 3, "burnout": 4 }
          },
          "good": {
            "text": "You tell the pen pal’s story from the stage — the letters, the family ritual, the loss — and dedicate their favorite song to them, and the whole room grieves a stranger together. You made a private thread into a public grace. They’d have loved it.",
            "effects": { "creativity": 6, "cred": 6, "fame": 5 }
          },
          "incredible": {
            "text": "Your dedication becomes a moment people never forget — the story of the pen pal, told to thousands, their favorite song sung by a crowd who never met them but weep anyway. You gave a stranger’s love an audience of thousands. The letters reached further than either of you dreamed. That’s the whole miracle of it.",
            "effects": { "creativity": 8, "cred": 7, "fame": 7 }
          }
        }
      }
    }
  },
  {
    "id": "nm_critic_pan",
    "act": 1,
    "pathAffinity": [],
    "weight": 9,
    "art": "ev_nm_critic_pan",
    "context": "The alt-weekly, one critic, one brutal review",
    "prompt": "The local alt-weekly’s only critic reviewed your show and it’s a pan — witty, cruel, and upsettingly accurate about the exact weaknesses you were hoping nobody noticed. It’s the first time anyone took you seriously enough to be mean. It stings precisely because it’s not wrong.",
    "recap": "The alt-weekly’s critic panned your show, witty and accurate.",
    "tags": ["social"],
    "choices": {
      "left": {
        "label": "Write back and defend yourself",
        "governingStats": { "cred": 1, "creativity": 0.3 },
        "tags": ["social", "risky"],
        "outcomes": {
          "bad": {
            "text": "You fire off a response and it reads as thin-skinned, and the critic prints it with a devastating one-line reply. You lost the exchange publicly. But you’re on their radar now, which is its own kind of arrival. Cold comfort.",
            "effects": { "cred": 2, "fame": 3, "addFlag": "critic_feud" }
          },
          "good": {
            "text": "Your rebuttal is sharp enough that the critic respects the fight, and a genuine adversarial relationship begins — the kind that sharpens you. A worthy enemy is a gift. An annoying, valuable gift.",
            "effects": { "cred": 4, "fame": 3, "creativity": 2, "addFlag": "critic_feud" }
          },
          "incredible": {
            "text": "Your response is so good the critic prints the whole thing and admits you gave as good as you got, and a legendary local feud is born — the artist and the critic, circling each other for years. You just found your Salieri. Or your Boswell. Time will tell.",
            "effects": { "cred": 5, "fame": 4, "creativity": 3, "addFlag": "critic_feud" }
          }
        }
      },
      "right": {
        "label": "Take the note, quietly",
        "governingStats": { "skill": 1 },
        "tags": ["practice", "safe"],
        "outcomes": {
          "bad": {
            "text": "You swallow the pan and try to fix what they flagged and overcorrect into blandness, chasing one critic’s taste. It takes a while to find your own footing again. The note was right; the cure was worse. Lesson learned, painfully.",
            "effects": { "skill": 3, "cred": 2, "addFlag": "critic_seen" }
          },
          "good": {
            "text": "You take the criticism like a professional, fix the real weaknesses, and get genuinely better because someone was honest enough to be harsh. The best note you ever got came wrapped in an insult. You keep the clipping.",
            "effects": { "skill": 5, "cred": 4, "addFlag": "critic_seen" }
          },
          "incredible": {
            "text": "You absorb the pan so gracefully and improve so visibly that the critic notices, and their next review — grudging, watchful — becomes the beginning of a real respect. You turned an enemy into a witness by simply getting better. The highest revenge.",
            "effects": { "skill": 6, "cred": 5, "creativity": 2, "addFlag": "critic_seen" }
          }
        }
      }
    }
  },
  {
    "id": "nm_critic_reread",
    "act": 2,
    "pathAffinity": [],
    "weight": 11,
    "requires": { "anyOf": [{ "flagsAll": ["critic_seen"] }, { "flagsAll": ["critic_feud"] }] },
    "art": "ev_nm_critic_reread",
    "context": "The old pan, aging into a rave",
    "prompt": "Someone digs up the critic’s old pan of you and posts it next to your latest glowing coverage — the review has aged like milk, and the internet is dunking on the critic who “didn’t get it.” The critic hasn’t acknowledged it. They’re watching, though. Everyone is.",
    "recap": "The critic’s old pan resurfaces, and the internet is dunking on it.",
    "tags": ["social", "network"],
    "choices": {
      "left": {
        "label": "Defend the critic",
        "governingStats": { "cred": 1 },
        "tags": ["social", "safe"],
        "outcomes": {
          "bad": {
            "text": "You publicly defend the critic — “they were right at the time” — and it confuses the fans who wanted blood, and the critic says nothing. Grace into a void. You did the classy thing and got crickets. Sometimes that’s the whole reward.",
            "effects": { "cred": 4, "network": 2 }
          },
          "good": {
            "text": "You defend the critic’s old take as fair for who you were then, and the generosity of it stuns everyone, including the critic, who finally reaches out. You turned a dunk into a détente with one classy post.",
            "effects": { "cred": 6, "network": 4, "fame": 3 }
          },
          "incredible": {
            "text": "Your defense of the critic — “they saw exactly what was wrong, and they helped me fix it” — becomes a viral lesson in grace, and the critic writes a piece about YOU that becomes the definitive one. You made an ally of your harshest reader by refusing to gloat. Masterful.",
            "effects": { "cred": 8, "network": 5, "fame": 4 }
          }
        }
      },
      "right": {
        "label": "Let the internet have its fun",
        "governingStats": { "network": 1 },
        "tags": ["social", "risky"],
        "outcomes": {
          "bad": {
            "text": "You stay quiet and let the pile-on happen, and it feels good for a day and slightly sour after — the critic’s just a person, and the mob is ugly even when it’s on your side. You don’t stop it. You wish you had. A little.",
            "effects": { "network": 3, "fame": 4, "cred": -2 }
          },
          "good": {
            "text": "You let the moment pass without comment, neither fanning nor fighting it, and the restraint reads as confidence. You don’t need to win against an old review. You already did. Silence, well-deployed.",
            "effects": { "network": 4, "fame": 5, "cred": 3 }
          },
          "incredible": {
            "text": "You post one perfect line — “I’d have panned it too” — that ends the pile-on, wins over the critic, and makes you look bigger than the whole thing at once. You turned your own vindication into a moment of grace with a single sentence. The critic frames it.",
            "effects": { "network": 6, "fame": 6, "cred": 5 }
          }
        }
      }
    }
  },
  {
    "id": "nm_critic_book",
    "act": 3,
    "pathAffinity": [],
    "weight": 11,
    "requires": { "anyOf": [{ "flagsAll": ["critic_seen"] }, { "flagsAll": ["critic_feud"] }] },
    "art": "ev_nm_critic_book",
    "context": "The critic’s book, with a chapter on you",
    "prompt": "The critic wrote a book about the scene, the definitive history, and there’s a whole chapter with your name on it. You get an advance copy. The chapter could be a coronation or a hit job or, this being them, both. Your hands are a little unsteady opening it.",
    "recap": "The critic’s scene history has a whole chapter on you.",
    "tags": ["social", "network"],
    "choices": {
      "left": {
        "label": "Trust their telling",
        "governingStats": { "cred": 1 },
        "tags": ["social", "safe"],
        "outcomes": {
          "bad": {
            "text": "The chapter is fair but includes the embarrassing early stuff you’d hoped everyone forgot, and it’s all true, which is worse. Immortalized, warts included. The critic never did let you off easy. You respect it. Grudgingly.",
            "effects": { "cred": 4, "fame": 4 }
          },
          "good": {
            "text": "The chapter is the fullest, truest account of your career anyone’s written — the critic saw the whole arc, flaws and all, and honored it. Being truly SEEN by a worthy witness is its own rare prize. You write to thank them.",
            "effects": { "cred": 6, "fame": 6, "network": 3 }
          },
          "incredible": {
            "text": "The chapter is a masterpiece of criticism — it understands your work better than you do — and it becomes the lens through which history sees you. Your old adversary wrote your legend, honestly, and it’s better than any puff piece could be. The feud made you both immortal.",
            "effects": { "cred": 8, "fame": 8, "network": 4 }
          }
        }
      },
      "right": {
        "label": "Give them the real story",
        "governingStats": { "network": 1, "cred": 0.3 },
        "tags": ["network", "risky"],
        "outcomes": {
          "bad": {
            "text": "You offer the critic the untold behind-the-scenes truth and they use it to complicate the flattering version, making the chapter thornier and realer than you wanted. You asked for honest and got it. Careful what you wish for. It’s a great chapter, though.",
            "effects": { "network": 3, "cred": 4, "burnout": 2 }
          },
          "good": {
            "text": "You sit for real interviews and give the critic the whole story, and the chapter becomes richer for it — a collaboration between the artist and the witness who watched it all. History, co-written with your sharpest reader.",
            "effects": { "network": 5, "cred": 6, "fame": 4 }
          },
          "incredible": {
            "text": "Your candor transforms the chapter into the emotional heart of the whole book, and the critic — moved by your trust after all those years — writes something that redefines you both. The pan-to-partnership arc becomes the book’s best story. Enemies who became each other’s legacy.",
            "effects": { "network": 6, "cred": 8, "fame": 5 }
          }
        }
      }
    }
  },
  {
    "id": "nm_critic_quit",
    "act": 3,
    "pathAffinity": [],
    "weight": 11,
    "requires": { "flagsAll": ["critic_feud"] },
    "art": "ev_nm_critic_quit",
    "context": "The paper folds. The critic’s goodbye column is about you.",
    "prompt": "The alt-weekly is dead — print finally lost — and the critic gets one last column. You expect a career retrospective. Instead, the whole farewell is about you: the artist they panned, feuded with, and, it turns out, watched more closely than anyone. It’s the realest thing they ever wrote.",
    "recap": "The alt-weekly folds. The critic’s farewell column is about you.",
    "tags": ["social", "home"],
    "choices": {
      "left": {
        "label": "Honor them publicly",
        "governingStats": { "cred": 1, "network": 0.3 },
        "tags": ["social", "safe"],
        "outcomes": {
          "bad": {
            "text": "You write a tribute to the critic and it’s heartfelt and a little clumsy, and they send back a two-word text — “not bad” — which from them is a symphony. The feud’s over. You miss it already. You’d never say that out loud.",
            "effects": { "cred": 4, "network": 3, "burnout": 2 }
          },
          "good": {
            "text": "You publicly honor the critic as the person who made you better by refusing to go easy, and the tribute reframes a decade of feuding as the strange friendship it secretly was. Two rivals, one last bow. The scene tears up.",
            "effects": { "cred": 6, "network": 4, "fame": 4 }
          },
          "incredible": {
            "text": "Your tribute to the critic becomes a landmark piece about the vanishing art of real criticism, and it gives your old adversary the send-off print itself couldn’t. You honored the enemy who honored you. The feud ends as the most respectful relationship either of you had. Perfect.",
            "effects": { "cred": 8, "network": 5, "fame": 6 }
          }
        }
      },
      "right": {
        "label": "Offer them a new gig",
        "governingStats": { "network": 1 },
        "tags": ["network", "risky"],
        "outcomes": {
          "bad": {
            "text": "You offer to bankroll the critic’s new venture and they bristle — pride, decades of independence, the discomfort of taking money from a subject. It gets awkward before it gets warm. Eventually they say yes. Eventually. Prickly to the end.",
            "effects": { "network": 3, "cred": 3, "money": -60 }
          },
          "good": {
            "text": "You help the critic launch an independent newsletter, free of the dead paper, and they keep writing sharp and honest — now with you as their unlikely patron. You kept a vital voice alive. They’ll pan you again within a month. Good.",
            "effects": { "network": 5, "cred": 5, "fame": 3 }
          },
          "incredible": {
            "text": "You fund the critic’s independence with no strings, and they build something that outlasts the paper and keeps the whole scene honest for another generation — and yes, they keep reviewing you, brutally, gratefully. You saved the voice that made you. The feud’s final form is loyalty. It’s the best thing you did with the money.",
            "effects": { "network": 6, "cred": 7, "fame": 5, "money": -40 }
          }
        }
      }
    }
  },
  {
    "id": "nm_jingle_gig",
    "act": 1,
    "pathAffinity": [],
    "weight": 9,
    "art": "ev_nm_jingle_gig",
    "context": "A waterpark, a pseudonym, a paycheck",
    "prompt": "Splashtown Waterpark needs a jingle and can pay real money, and you can write it under a fake name so nobody in the scene ever knows you sold thirty seconds of your soul for the rent. It’s beneath you. The rent is also beneath you, and due Friday.",
    "recap": "Splashtown Waterpark needs a jingle. The rent is due Friday.",
    "tags": ["deal", "work"],
    "choices": {
      "left": {
        "label": "Write it under a fake name",
        "governingStats": { "creativity": 1 },
        "tags": ["work", "safe"],
        "outcomes": {
          "bad": {
            "text": "You write “Splashtown, Where Summer Lives!” under the name “Chip Waverly” and it’s catchy in a way that haunts you at 3 a.m. The check clears. Chip Waverly, sadly, is now your most commercially successful project.",
            "effects": { "creativity": 3, "money": 100, "addFlag": "jingle_ghost" }
          },
          "good": {
            "text": "The jingle is genuinely, professionally great — you can’t help it — and Splashtown is thrilled and “Chip Waverly” gets paid handsomely. Ghost money for ghost work. Nobody in the scene will ever know. Probably.",
            "effects": { "creativity": 4, "money": 130, "addFlag": "jingle_ghost" }
          },
          "incredible": {
            "text": "You write a jingle so absurdly good it’s basically a pop song about a waterpark, and Splashtown pays a premium and Chip Waverly is, briefly, the most talented songwriter in the tri-county. Your secret shame is also your best-selling work. The irony will compound.",
            "effects": { "creativity": 5, "money": 150, "addFlag": "jingle_ghost" }
          }
        }
      },
      "right": {
        "label": "Make it secretly artful",
        "minigame": "ideas",
        "governingStats": { "creativity": 1, "skill": 0.3 },
        "tags": ["write", "risky"],
        "outcomes": {
          "bad": {
            "text": "You try to sneak real artistry into a waterpark jingle and Splashtown says “less feelings, more slides.” You compromise. The final version is still secretly a little sad. Nobody at the waterpark will notice. You will.",
            "effects": { "creativity": 4, "money": 90, "addFlag": "jingle_ghost" }
          },
          "good": {
            "text": "You smuggle a genuinely beautiful melody into the jingle, and it works on two levels — a kids’ ad and, if you listen, something real. Chip Waverly, secret artist. The waterpark got more than it paid for.",
            "effects": { "creativity": 6, "money": 110, "addFlag": "jingle_ghost" }
          },
          "incredible": {
            "text": "You write a jingle so quietly gorgeous that parents find themselves moved by an ad for water slides, and you realize you can’t turn off the art even when you try. Chip Waverly made something real by accident. It’ll come back around. Everything does.",
            "effects": { "creativity": 7, "money": 120, "cred": 2, "addFlag": "jingle_ghost" }
          }
        }
      }
    }
  },
  {
    "id": "nm_jingle_spreads",
    "act": 2,
    "pathAffinity": [],
    "weight": 11,
    "requires": { "flagsAll": ["jingle_ghost"] },
    "art": "ev_nm_jingle_spreads",
    "context": "Kids singing your jingle at your own show",
    "prompt": "The Splashtown jingle is regionally enormous now — kids sing it on playgrounds, it’s a local earworm, and tonight, horrifyingly, someone in YOUR crowd shouts a request for “the waterpark song” because word has leaked that Chip Waverly is you.",
    "recap": "A fan shouts for “the waterpark song.” Word’s out that Chip Waverly is you.",
    "tags": ["live", "social"],
    "choices": {
      "left": {
        "label": "Own it, play the jingle",
        "governingStats": { "creativity": 1, "network": 0.3 },
        "tags": ["live", "mainstream", "risky"],
        "outcomes": {
          "bad": {
            "text": "You play the waterpark jingle at your show as a bit, and the crowd goes nuts, and afterward you’re not sure if you’re in on the joke or the joke. It’s a fine line. You’re standing right on it, playing a jingle about slides.",
            "effects": { "creativity": 3, "fame": 6, "cred": -2 }
          },
          "good": {
            "text": "You embrace the jingle with total showmanship, and the self-aware joy of it wins the room completely — the artist who can laugh at their own sellout. Chip Waverly gets an encore. It’s weirdly one of your best nights.",
            "effects": { "creativity": 5, "fame": 8, "cred": 2 }
          },
          "incredible": {
            "text": "You turn the jingle into a triumphant, tongue-in-cheek anthem and it becomes a beloved staple of your live show — the secret shame reborn as pure joy. Owning it completely makes it cool. Chip Waverly is a legend now. You contain multitudes, including a waterpark.",
            "effects": { "creativity": 6, "fame": 11, "cred": 3 }
          }
        }
      },
      "right": {
        "label": "Refuse and redirect",
        "governingStats": { "cred": 1 },
        "tags": ["indie", "safe"],
        "outcomes": {
          "bad": {
            "text": "You refuse to play the jingle and it reads as precious, like you’re too good for the thing half the crowd loves. The moment sours slightly. You protected your art and mildly insulted your audience. A wash.",
            "effects": { "cred": 3, "fame": 3, "burnout": 2 }
          },
          "good": {
            "text": "You decline gracefully — “that’s Chip’s song, this is mine” — and pivot into a real one that lands harder for the contrast. You kept the line between commerce and art clean. The crowd respects the distinction.",
            "effects": { "cred": 5, "fame": 4, "creativity": 3 }
          },
          "incredible": {
            "text": "You refuse the jingle so charmingly, then play something so good it obliterates the request, that the crowd forgets they ever wanted the waterpark song. You reminded everyone why you’re more than Chip Waverly. The redirect becomes the highlight. Masterclass in owning the room.",
            "effects": { "cred": 7, "fame": 6, "creativity": 4 }
          }
        }
      }
    }
  },
  {
    "id": "nm_jingle_remix",
    "act": 3,
    "pathAffinity": [],
    "weight": 11,
    "requires": { "flagsAll": ["jingle_ghost"] },
    "art": "ev_nm_jingle_remix",
    "context": "A famous DJ flips the waterpark jingle",
    "prompt": "A famous DJ found the Splashtown jingle, thought it was hilarious and secretly great, and flipped it into a club track that’s actually charting. Now there’s a decision: claim it as yours and cash in, or let Chip Waverly keep the credit and stay a mystery.",
    "recap": "A famous DJ flipped the Splashtown jingle into a charting club track.",
    "tags": ["deal", "social"],
    "choices": {
      "left": {
        "label": "Claim it, cash in",
        "governingStats": { "network": 1 },
        "tags": ["deal", "mainstream", "risky"],
        "outcomes": {
          "bad": {
            "text": "You reveal you’re Chip Waverly and the story is fun for a week and then people mostly remember you as “the waterpark guy,” which is not the legacy you were building. The money’s good. The framing is a cage. Oops.",
            "effects": { "network": 4, "money": 200, "fame": 6, "cred": -3 }
          },
          "good": {
            "text": "You claim the jingle at the perfect moment, and the reveal — serious artist wrote the beloved silly thing — becomes a delightful story that humanizes you and pays handsomely. Chip Waverly, unmasked to applause.",
            "effects": { "network": 5, "money": 250, "fame": 8 }
          },
          "incredible": {
            "text": "You reveal yourself as Chip Waverly with such perfect comic timing that it becomes a legendary moment, the DJ collab goes stratospheric, and you prove you can win at both art AND commerce AND comedy. The waterpark jingle becomes a jewel in your crown. Nobody plays the game like you.",
            "effects": { "network": 6, "money": 350, "fame": 12, "cred": 2 }
          }
        }
      },
      "right": {
        "label": "Let Chip Waverly stay a legend",
        "governingStats": { "cred": 1, "creativity": 0.3 },
        "tags": ["indie", "safe"],
        "outcomes": {
          "bad": {
            "text": "You keep the secret and watch the DJ and “Chip Waverly” get all the credit for your melody, and there’s a specific ache in anonymous success. You chose mystery over money. Some nights you question it. The melody was yours. Nobody knows.",
            "effects": { "cred": 5, "creativity": 3 }
          },
          "good": {
            "text": "You let Chip Waverly remain a beautiful mystery, and the myth of the unknown genius behind the jingle becomes its own fun scene legend — one you get to secretly author. Anonymity as a long joke only you’re fully in on.",
            "effects": { "cred": 7, "creativity": 4, "fame": 3 }
          },
          "incredible": {
            "text": "You keep the secret so perfectly that “Who is Chip Waverly?” becomes a genuine cultural mystery, articles written, theories spun — and you get to walk through it all knowing. The best secret you’ll ever keep. Chip Waverly is immortal precisely because he doesn’t exist. And you made him.",
            "effects": { "cred": 8, "creativity": 5, "fame": 4 }
          }
        }
      }
    }
  },
  {
    "id": "nm_jingle_waterpark",
    "act": 3,
    "pathAffinity": [],
    "weight": 11,
    "requires": { "flagsAll": ["jingle_ghost"] },
    "art": "ev_nm_jingle_waterpark",
    "context": "Splashtown’s 25th anniversary, and they want both of you",
    "prompt": "Splashtown is turning 25 and wants to book you for the celebration — you, the famous artist, AND Chip Waverly, whom they still think might be a different person. The park that paid your rent when nobody knew your name wants to honor its anniversary with its most famous alumnus. It’s absurd. It’s also, somehow, moving.",
    "recap": "Splashtown turns 25 and wants you and Chip Waverly both.",
    "tags": ["live", "home"],
    "choices": {
      "left": {
        "label": "Play it straight, honor the park",
        "governingStats": { "cred": 1, "network": 0.3 },
        "tags": ["live", "home", "safe"],
        "outcomes": {
          "bad": {
            "text": "You play the anniversary sincerely and it’s surreal — a serious artist performing a waterpark jingle for families on inner tubes — but the manager who hired Chip Waverly cries, remembering when you were nobody. That part’s real. That part gets you.",
            "effects": { "cred": 5, "fame": 4, "money": 100, "burnout": 2 }
          },
          "good": {
            "text": "You honor Splashtown with genuine warmth, revealing you were Chip all along to the manager who took a chance on an unknown, and the full-circle of it — from rent money to homecoming — lands like a small perfect movie. Gratitude, paid back with interest.",
            "effects": { "cred": 7, "fame": 6, "money": 150 }
          },
          "incredible": {
            "text": "You turn the Splashtown anniversary into a genuinely beautiful homecoming — the artist honoring the humble gig that kept them alive — and the story of loyalty to a waterpark becomes the most charming thing about you. You never forgot who paid the rent first. That’s the whole measure of a person. The park names a slide after you.",
            "effects": { "cred": 9, "fame": 8, "money": 180 }
          }
        }
      },
      "right": {
        "label": "Make it a joyful spectacle",
        "minigame": "crowd",
        "governingStats": { "creativity": 1, "network": 0.3 },
        "tags": ["live", "mainstream", "risky"],
        "outcomes": {
          "bad": {
            "text": "You go all-out spectacle — pyro, the jingle as an EDM banger, water cannons — and it’s chaotic and half the families are confused and the kids absolutely lose their minds. A beautiful disaster. Splashtown will talk about it for another 25 years.",
            "effects": { "creativity": 4, "fame": 8, "money": 100, "burnout": 4 }
          },
          "good": {
            "text": "You turn the anniversary into a wild, joyful celebration that treats a waterpark jingle with the full production of a stadium anthem, and the pure absurd commitment of it makes it transcendent. Nobody has ever loved a waterpark this hard on purpose.",
            "effects": { "creativity": 6, "fame": 11, "money": 150, "cred": 2 }
          },
          "incredible": {
            "text": "You make the Splashtown 25th the most gloriously unhinged, joyful show of your career — jingle as anthem, families weeping with laughter, the whole thing filmed and beloved — and it becomes a legendary reminder that joy is never beneath you. Chip Waverly’s finest hour is your finest hour. The circle closes in a splash zone.",
            "effects": { "creativity": 8, "fame": 14, "money": 200, "cred": 3 }
          }
        }
      }
    }
  },
  {
    "id": "nm_ghost_note",
    "act": 1,
    "pathAffinity": [],
    "weight": 9,
    "art": "ev_nm_ghost_note",
    "context": "A setlist suggestion nobody wrote",
    "prompt": "Every venue has a ghost story, and yours starts small: a setlist appears in the green room with an unfamiliar song order and one addition in handwriting nobody recognizes. The sound guy swears he didn’t. Probably a draft. Probably.",
    "recap": "A setlist in the green room, one song added in a hand nobody knows.",
    "tags": ["live", "home"],
    "choices": {
      "left": {
        "label": "Play the ghost’s order",
        "governingStats": { "creativity": 1 },
        "tags": ["live", "risky"],
        "outcomes": {
          "bad": {
            "text": "You play the mysterious setlist and it’s a weird order that mostly works, except the ghost’s suggested song, which you don’t know, so you skip it. The green room is cold that night. Colder than the AC explains. You note it.",
            "effects": { "creativity": 3, "burnout": 2, "addFlag": "venue_ghost" }
          },
          "good": {
            "text": "You play the ghost’s order and it flows better than yours would have — whoever, whatever left it has taste. You start leaving the green room a little tidier, just in case. The suggestions keep coming.",
            "effects": { "creativity": 5, "cred": 2, "addFlag": "venue_ghost" }
          },
          "incredible": {
            "text": "The ghost’s setlist makes for the best show you’ve played in that room, and you feel, distinctly, like you’re collaborating with something that’s been waiting a long time for a band worth helping. You say “thanks” to the empty green room. It feels heard.",
            "effects": { "creativity": 6, "cred": 3, "fame": 2, "addFlag": "venue_ghost" }
          }
        }
      },
      "right": {
        "label": "Investigate the mystery",
        "governingStats": { "network": 1 },
        "tags": ["home", "safe"],
        "outcomes": {
          "bad": {
            "text": "You ask around and get seven contradictory ghost stories and one very nervous bartender who changes the subject fast. You learn nothing except that the room has a history nobody fully tells. The setlist appears again next week.",
            "effects": { "network": 3, "cred": 2, "addFlag": "venue_ghost" }
          },
          "good": {
            "text": "You dig into the venue’s history and find a musician who played there for decades and died mid-residency, and something in you decides to take the setlists as a torch passed rather than a haunting. You keep it deadpan. But you keep it.",
            "effects": { "network": 4, "cred": 3, "creativity": 2, "addFlag": "venue_ghost" }
          },
          "incredible": {
            "text": "Your investigation turns up a beautiful, sad story about the room and the player who never left it, and you decide — without saying so out loud — to honor whatever this is. The setlists become a secret you protect. Some mysteries you don’t solve. You steward.",
            "effects": { "network": 5, "cred": 4, "creativity": 3, "addFlag": "venue_ghost" }
          }
        }
      }
    }
  },
  {
    "id": "nm_ghost_request",
    "act": 2,
    "pathAffinity": [],
    "weight": 11,
    "requires": { "flagsAll": ["venue_ghost"] },
    "art": "ev_nm_ghost_request",
    "context": "The suggestions get specific. And good.",
    "prompt": "The green-room notes have gotten specific — a chord substitution here, a key change there, a lyric tweak that’s unmistakably better than yours. Whoever or whatever is leaving them has genuine ears. Tonight’s note just says: “the bridge wants to be quieter. trust me.”",
    "recap": "The green-room notes are getting good. Tonight: “the bridge wants to be quieter.”",
    "tags": ["write", "home"],
    "choices": {
      "left": {
        "label": "Trust the ghost’s ear",
        "minigame": "ideas",
        "governingStats": { "creativity": 1 },
        "tags": ["write", "risky"],
        "outcomes": {
          "bad": {
            "text": "You take the ghost’s note and quiet the bridge and it’s better, undeniably, which is unsettling because you didn’t think of it and someone (something?) did. You thank the empty room. The next note says “told you.” You laugh alone, nervously.",
            "effects": { "creativity": 5, "burnout": 2, "writeSong": true }
          },
          "good": {
            "text": "You follow the ghost’s suggestions and the song transforms into the best thing you’ve written, and you’ve stopped questioning where the help comes from. Some collaborators you don’t need to see. You just need to listen.",
            "effects": { "creativity": 7, "cred": 3, "writeSong": true }
          },
          "incredible": {
            "text": "You and the ghost — you’ve stopped pretending it’s drafts — write something transcendent together, and you realize you’re carrying forward the unfinished work of whoever loved this room before you. The song is a duet across the veil. You keep the secret. You keep the room. It keeps you.",
            "effects": { "creativity": 9, "cred": 4, "fame": 3, "writeSong": true }
          }
        }
      },
      "right": {
        "label": "Follow your own instinct instead",
        "governingStats": { "creativity": 1, "skill": 0.3 },
        "tags": ["write", "safe"],
        "outcomes": {
          "bad": {
            "text": "You ignore the ghost’s note to prove you don’t need it, and your version is fine, and the green room is very cold that night, and you feel oddly like you disappointed a teacher. Pride is a lonely bridge. You play it your way anyway.",
            "effects": { "creativity": 4, "burnout": 3, "writeSong": true }
          },
          "good": {
            "text": "You respectfully take the ghost’s note as one option and find your own third way, and it works — a collaboration where you finally push back. The next note says nothing. The one after says “better.” You’ve earned a peer, not a teacher.",
            "effects": { "creativity": 6, "cred": 4, "writeSong": true }
          },
          "incredible": {
            "text": "You honor the ghost by arguing with it — trying its idea, rejecting it, finding something the two of you never would have alone — and the song becomes a genuine dialogue across time. The best collaborators disagree. Even the dead ones. Especially them.",
            "effects": { "creativity": 8, "cred": 5, "fame": 3, "writeSong": true }
          }
        }
      }
    }
  },
  {
    "id": "nm_ghost_encore",
    "act": 3,
    "pathAffinity": [],
    "weight": 11,
    "requires": { "flagsAll": ["venue_ghost"] },
    "art": "ev_nm_ghost_encore",
    "context": "The biggest show yet, and four bars nobody cued",
    "prompt": "The biggest show of your career, in the room where it all started, and during the encore the PA plays four bars of something — a melody you’ve never recorded, in a voice you’ve never heard — that nobody in the booth cued. The whole band freezes. The crowd thinks it’s part of the show.",
    "recap": "Mid-encore, the PA plays four bars nobody in the booth cued.",
    "tags": ["live", "home"],
    "choices": {
      "left": {
        "label": "Play along with it",
        "minigame": "crowd",
        "governingStats": { "skill": 1, "creativity": 0.4 },
        "tags": ["live", "risky"],
        "outcomes": {
          "bad": {
            "text": "You try to follow the phantom melody and it slips away before you catch it, leaving you improvising over silence while the crowd cheers, none the wiser. You lost the ghost’s last gift by a half-second. It doesn’t come back that night. You’ll wonder forever.",
            "effects": { "skill": 4, "fame": 6, "burnout": 3 }
          },
          "good": {
            "text": "You catch the four bars and build the encore around them, and for a few minutes you’re playing a duet with a voice that isn’t there, in the room that made you, and it’s the most alive you’ve ever felt on stage. The crowd will never know. You’ll never forget.",
            "effects": { "skill": 6, "fame": 8, "cred": 4 }
          },
          "incredible": {
            "text": "You and the ghost play the encore of a lifetime together — its melody, your band, one impossible song — and the recording captures four bars nobody can explain. It becomes a legend, a genuine mystery, the night the room itself sang. You finished someone’s unfinished business, live, in front of everyone. It was always leading here.",
            "effects": { "skill": 8, "fame": 12, "cred": 6 }
          }
        }
      },
      "right": {
        "label": "Stop and just listen",
        "governingStats": { "cred": 1 },
        "tags": ["live", "home", "safe"],
        "outcomes": {
          "bad": {
            "text": "You stop the band and let the four bars play into a silent room, and the crowd goes quiet not knowing why, and it’s beautiful and strange and over too soon. Some of the audience felt something they couldn’t name. So did you. The green room is warm after. For once.",
            "effects": { "cred": 5, "fame": 5, "burnout": 2 }
          },
          "good": {
            "text": "You hush the whole room to let the phantom melody breathe, and thousands of people share a moment of inexplicable reverence for something none of them can see. You gave the ghost the stage. It’s the most generous thing you’ve ever done for a collaborator. Even one you never met.",
            "effects": { "cred": 7, "fame": 7, "creativity": 4 }
          },
          "incredible": {
            "text": "You silence the biggest crowd of your life to honor four bars from beyond, and the collective held breath of thousands becomes the defining moment of your career — the night you let the room’s ghost take a bow. Nobody understood it. Everybody felt it. You closed a circle older than you. The realest encore there is.",
            "effects": { "cred": 9, "fame": 10, "creativity": 5 }
          }
        }
      }
    }
  },
  {
    "id": "nm_ghost_settled",
    "act": 3,
    "pathAffinity": [],
    "weight": 11,
    "requires": { "flagsAll": ["venue_ghost"] },
    "art": "ev_nm_ghost_settled",
    "context": "The ghost’s own song, finally played",
    "prompt": "You’ve pieced it together over the years — the fragments in the green room, the phantom melody, the story of the player who never left — into a whole song. THEIR song, the one they never finished. Tonight, in their room, you could finally play it start to finish. The green room, you notice, is very still.",
    "recap": "You’ve pieced together the ghost’s own unfinished song.",
    "tags": ["live", "home"],
    "choices": {
      "left": {
        "label": "Play their song, and let them go",
        "governingStats": { "cred": 1, "creativity": 0.3 },
        "tags": ["live", "home", "safe"],
        "outcomes": {
          "bad": {
            "text": "You play the ghost’s finished song and it’s beautiful and the room feels different after — lighter, emptier, done. You gave them their ending and they took it, and now the green room is just a green room. You mourn a collaborator you never saw. You did right by them.",
            "effects": { "cred": 6, "creativity": 4, "burnout": 3 }
          },
          "good": {
            "text": "You play their song to a full room and something releases — a warmth, a completion, a goodbye — and you understand you were only ever a steward, finishing what love left undone. The notes stop coming after that night. You miss them. You’re glad. Both, forever.",
            "effects": { "cred": 8, "creativity": 5, "fame": 4 }
          },
          "incredible": {
            "text": "You play the ghost’s song and it’s the most moving thing that room has ever held — a stranger’s unfinished love, completed decades late, in front of a crowd that weeps without knowing why — and afterward the room is at peace, and so are you. You gave a ghost their ending. Some songs you write. This one you set free. It’s the truest thing you ever did with a stage.",
            "effects": { "cred": 10, "creativity": 6, "fame": 5 }
          }
        }
      },
      "right": {
        "label": "Keep it going, together",
        "governingStats": { "creativity": 1 },
        "tags": ["home", "risky"],
        "outcomes": {
          "bad": {
            "text": "You decide not to “finish” the song — to keep the collaboration open, the room alive — and part of you wonders if you’re helping the ghost or just not ready to lose them. The notes keep coming. So does the cold. You chose company over closure. You think it was right.",
            "effects": { "creativity": 4, "cred": 3, "burnout": 2 }
          },
          "good": {
            "text": "You keep the ghost’s song as a living, evolving thing you play differently every night — never finished, always theirs and yours — and the room stays warm and haunted and yours. Some collaborations you don’t end. You just keep making. Together. Across everything.",
            "effects": { "creativity": 7, "cred": 5, "fame": 3 }
          },
          "incredible": {
            "text": "You turn the ghost’s song into an eternal work-in-progress, a duet with the room itself that you’ll play until you’re a green-room note for the next band, and you realize you’re not ending their story — you’re joining it. Someday you’ll leave setlists too. The room keeps everyone who loved it. You’re home. You always were.",
            "effects": { "creativity": 9, "cred": 6, "fame": 4 }
          }
        }
      }
    }
  },
  {
    "id": "nm_dog_adopt",
    "act": [1, 2],
    "pathAffinity": [],
    "weight": 9,
    "art": "ev_nm_dog_adopt",
    "context": "A dog, outside the venue, choosing you",
    "prompt": "A dog is waiting by the van after the show — no collar, no owner, and a look of having made a decision. It watches you load out, walks to the passenger door, and sits. It has, apparently, joined the band. It has opinions about the setlist already, you can tell.",
    "recap": "A dog waits by the van after the show, and sits at the passenger door.",
    "tags": ["tour", "home"],
    "choices": {
      "left": {
        "label": "Adopt the dog",
        "governingStats": { "network": 1 },
        "tags": ["band", "safe"],
        "outcomes": {
          "bad": {
            "text": "You take the dog and it immediately eats a microphone windscreen and howls through soundcheck, and you love it instantly and completely and stupidly. The band has a mascot now. The mascot has a rider. It’s worth it. Probably.",
            "effects": { "network": 3, "burnout": -2, "addFlag": "tour_dog" }
          },
          "good": {
            "text": "The dog becomes the heart of the tour — greeting fans, sleeping through load-in, judging your worst songs by leaving the room — and morale doubles. Every band needs one creature with no stake in the industry. Yours has four legs.",
            "effects": { "network": 5, "burnout": -3, "cred": 2, "addFlag": "tour_dog" }
          },
          "incredible": {
            "text": "The dog turns out to be the best thing that ever happened to the band — a furry morale engine, a reason to be gentle with each other, a constant reminder that some joy has nothing to do with the numbers. You didn’t adopt a dog. You adopted a philosophy. It’s a very good philosophy.",
            "effects": { "network": 6, "burnout": -4, "cred": 3, "addFlag": "tour_dog" }
          }
        }
      },
      "right": {
        "label": "Find its owner first",
        "governingStats": { "cred": 1 },
        "tags": ["home", "safe"],
        "outcomes": {
          "bad": {
            "text": "You do the responsible thing and search for an owner and find none, and the dog watches you try to give it away with an expression of profound betrayal until you stop. Fine. FINE. It’s in the band. It knew before you did.",
            "effects": { "cred": 3, "burnout": -2, "addFlag": "tour_dog" }
          },
          "good": {
            "text": "You post flyers and wait the responsible week and, no owner found, adopt it properly — vet, tags, the works — and the dog rewards your conscientiousness with total, drooling loyalty. You did it right. The dog did it righter.",
            "effects": { "cred": 5, "network": 3, "burnout": -2, "addFlag": "tour_dog" }
          },
          "incredible": {
            "text": "Your search for the owner turns up a whole story — the dog wandered from a shelter that flooded — and adopting it becomes a small local news feel-good piece. The rescue dog rescues the band right back. You did everything right and got a legend for it. Good dog. Best dog.",
            "effects": { "cred": 6, "network": 4, "burnout": -3, "addFlag": "tour_dog" }
          }
        }
      }
    }
  },
  {
    "id": "nm_dog_mascot",
    "act": 2,
    "pathAffinity": [],
    "weight": 11,
    "requires": { "flagsAll": ["tour_dog"] },
    "art": "ev_nm_dog_mascot",
    "context": "The dog is on the merch. The dog outsells you.",
    "prompt": "You put the dog on a t-shirt as a joke and it’s outselling every other piece of merch you have, by a lot. Fans come to shows with signs for the dog. Someone made a fan account for the dog with more followers than yours. The dog remains completely unbothered by fame.",
    "recap": "The dog on a t-shirt outsells all your other merch.",
    "tags": ["deal", "social"],
    "choices": {
      "left": {
        "label": "Lean into the dog economy",
        "governingStats": { "network": 1 },
        "tags": ["deal", "mainstream", "risky"],
        "outcomes": {
          "bad": {
            "text": "You go all-in on dog merch and it prints money and you have a small existential crisis about being upstaged by an animal that can’t hear the songs. The dog does not share your crisis. The dog is thriving. The dog is right.",
            "effects": { "network": 4, "money": 200, "cred": -2 }
          },
          "good": {
            "text": "You build a whole delightful brand around the dog and it funds the tour and charms the world, and you make peace with being the dog’s opening act. Ego is expensive; the dog is free. The dog wins. Everyone wins.",
            "effects": { "network": 6, "money": 250, "fame": 4 }
          },
          "incredible": {
            "text": "The dog becomes a genuine phenomenon — press, plushies, a following that dwarfs yours — and instead of resenting it you realize it’s bringing thousands of new people to the music. The dog is the best marketing you never planned. You are, proudly, the dog’s band now.",
            "effects": { "network": 7, "money": 350, "fame": 6 }
          }
        }
      },
      "right": {
        "label": "Keep the dog off the market",
        "governingStats": { "cred": 1 },
        "tags": ["indie", "safe"],
        "outcomes": {
          "bad": {
            "text": "You pull the dog merch to protect the dog’s dignity, which the dog does not have and does not want, and disappoint fans who genuinely loved it. Principled, and a little silly. The dog would have signed off on the money. The dog cannot sign.",
            "effects": { "cred": 3, "burnout": 2 }
          },
          "good": {
            "text": "You keep the dog out of the commerce and it stays a pure, unmonetized joy — a band member, not a product — and the restraint earns a quiet respect. Some things you don’t sell. Even the profitable ones. Especially the good ones.",
            "effects": { "cred": 6, "network": 2, "burnout": -2 }
          },
          "incredible": {
            "text": "Your refusal to commodify the dog becomes its own beloved story — the band that wouldn’t sell out their dog — and paradoxically makes everyone love the dog (and you) MORE. Integrity, four-legged. The dog stays priceless precisely because you never named a price. Good dog. Good call.",
            "effects": { "cred": 8, "network": 3, "fame": 3 }
          }
        }
      }
    }
  },
  {
    "id": "nm_dog_cover",
    "act": 3,
    "pathAffinity": [],
    "weight": 11,
    "requires": { "flagsAll": ["tour_dog"] },
    "art": "ev_nm_dog_cover",
    "context": "The album cover question, answering itself",
    "prompt": "It’s time to shoot the album cover for the biggest record of your career, and everyone in the room keeps glancing at the dog asleep in the corner. Nobody wants to say it. The dog, sensing the moment, opens one eye. The label wants your face. Your heart wants the dog.",
    "recap": "Album-cover day, and everyone keeps glancing at the dog.",
    "tags": ["deal", "record"],
    "choices": {
      "left": {
        "label": "Put the dog on the cover",
        "governingStats": { "creativity": 1, "network": 0.3 },
        "tags": ["record", "risky"],
        "outcomes": {
          "bad": {
            "text": "You put the dog on the cover of your big album and the label panics about “brand confusion,” and half the reviews are just about the dog. The music gets slightly lost behind the good boy. Worth it? The dog thinks so. The dog is on an album cover.",
            "effects": { "creativity": 4, "fame": 6, "cred": 2 }
          },
          "good": {
            "text": "The dog on the cover becomes iconic — warm, funny, unmistakably yours — and it makes the album feel like exactly what it is: made by people (and a dog) who love each other. The best album covers tell you who made them. Yours has a tail.",
            "effects": { "creativity": 6, "fame": 8, "cred": 4 }
          },
          "incredible": {
            "text": "The dog cover becomes one of the most beloved album images in years — a symbol of joy and loyalty and not taking the industry too seriously — and it defines the record’s whole warm-hearted legend. You put your best friend on your best work. Everyone understood. The dog is immortal now. As it should be.",
            "effects": { "creativity": 8, "fame": 11, "cred": 5 }
          }
        }
      },
      "right": {
        "label": "Keep the dog off it, this once",
        "governingStats": { "cred": 1 },
        "tags": ["record", "safe"],
        "outcomes": {
          "bad": {
            "text": "You keep the cover serious and the dog off it, and it’s the right professional call and it feels a little cold, and the dog seems to understand and forgives you instantly because it’s a dog. The album looks great. It’s missing something. Someone.",
            "effects": { "cred": 4, "fame": 4 }
          },
          "good": {
            "text": "You make a striking, serious cover but sneak the dog into the liner notes — a paw print, a thank-you — and the balance of ambition and heart is exactly right. The dog is honored without stealing the show. Everyone gets their due, including the good boy.",
            "effects": { "cred": 6, "fame": 5, "creativity": 3 }
          },
          "incredible": {
            "text": "You keep the cover iconic and yours, but the dog appears in every photo inside, and the restraint makes the album feel like a real artistic statement AND a love letter to your life. You didn’t need the dog on the cover; the dog is in every note. The best kind of having it both ways.",
            "effects": { "cred": 7, "fame": 7, "creativity": 4 }
          }
        }
      }
    }
  },
  {
    "id": "nm_dog_vet",
    "act": [2, 3],
    "pathAffinity": [],
    "weight": 11,
    "requires": { "flagsAll": ["tour_dog"] },
    "art": "ev_nm_dog_vet",
    "context": "The vet bill vs. the gear fund",
    "prompt": "The dog is sick — nothing tragic, but a real bill, the kind that would clean out the money you’d earmarked for the gear upgrade that could level up your whole sound. It’s the coldest arithmetic there is: your career, or your dog’s comfort. The dog puts its head on your knee.",
    "recap": "The dog’s vet bill would clean out the gear-upgrade fund.",
    "tags": ["deal", "home"],
    "choices": {
      "left": {
        "label": "Spend it on the dog",
        "governingStats": { "cred": 1 },
        "tags": ["home", "safe"],
        "outcomes": {
          "bad": {
            "text": "You empty the gear fund on the vet and the dog recovers fully and you play the next tour on the same tired rig, and every time it fails you look at the dog and don’t regret it. Not even once. The dog is fine. That’s the whole gear upgrade you needed.",
            "effects": { "cred": 5, "money": -150, "burnout": 2 }
          },
          "good": {
            "text": "You spend it all on the dog without hesitating, and the dog bounces back, and the choice clarifies something: you’re in this for a life, not just a career. The gear can wait. The dog can’t. You chose right and you know it.",
            "effects": { "cred": 7, "money": -120, "burnout": -2 }
          },
          "incredible": {
            "text": "You spend the gear money on the dog, and when fans hear why the tour got postponed — “our dog needed us” — they rally, a fundraiser covers it twice over, and you get the dog AND the gear AND a lesson in what people actually love about you. Loyalty, rewarded by loyalty. Good dog. Good people. Good life.",
            "effects": { "cred": 8, "money": 60, "fame": 4, "network": 3 }
          }
        }
      },
      "right": {
        "label": "Find a way to do both",
        "governingStats": { "network": 1, "skill": 0.3 },
        "tags": ["work", "risky"],
        "outcomes": {
          "bad": {
            "text": "You take a grind of extra gigs to cover both the vet and the gear, and the dog gets healthy while you get exhausted, and the burnout is real but so is the dog’s wagging tail at every homecoming. You made it work by working yourself ragged. The dog thinks you’re a hero. It’s not entirely wrong.",
            "effects": { "network": 3, "money": -40, "burnout": 6 }
          },
          "good": {
            "text": "You hustle up the money for both — extra sessions, a smart payment plan, a fan who’s a vet tech and helps for free tickets — and pull off caring for the dog without sacrificing the sound. Resourcefulness born of love. The dog and the gear both thrive.",
            "effects": { "network": 5, "money": -20, "cred": 3 }
          },
          "incredible": {
            "text": "You find a way to save the dog AND upgrade the gear through sheer hustle and a community that shows up when they hear the dog’s in trouble, and it becomes proof that the life you built has a safety net made of love. Everyone who helped becomes part of the dog’s legend. You never had to choose. You just had to ask. Good dog. Great people.",
            "effects": { "network": 6, "money": 40, "cred": 4, "fame": 3 }
          }
        }
      }
    }
  },
  {
    "id": "nm_sibling_call",
    "act": 1,
    "pathAffinity": [],
    "weight": 9,
    "art": "ev_nm_sibling_call",
    "context": "Your sibling, who chose the sensible life, calling",
    "prompt": "Your sibling — the one who chose the stable job and the mortgage and the quiet judgment of your choices — calls out of nowhere. “So,” they say, awkward, “the kid started playing. Your instrument. Won’t put it down. And I, uh. I didn’t know who else to call.” It’s an olive branch shaped like a phone call.",
    "recap": "Your sensible sibling calls: the kid picked up your instrument.",
    "tags": ["home", "family"],
    "choices": {
      "left": {
        "label": "Lean in warmly",
        "governingStats": { "cred": 1 },
        "tags": ["home", "family", "safe"],
        "outcomes": {
          "bad": {
            "text": "You get overeager and start planning the kid’s whole musical future, and your sibling pulls back — they wanted connection, not a recruitment. You dialed it too high. But the door’s open now, a crack. You’ll be gentler next time.",
            "effects": { "cred": 3, "burnout": 2, "addFlag": "sibling_bridge" }
          },
          "good": {
            "text": "You respond with real warmth and no agenda, just gladness, and something that’s been frozen between you and your sibling for years starts, quietly, to thaw. The kid’s little hands on your instrument are the bridge you both needed.",
            "effects": { "cred": 5, "network": 2, "burnout": -2, "addFlag": "sibling_bridge" }
          },
          "incredible": {
            "text": "You meet your sibling’s tentative reach with total open-hearted joy, and the call turns into the realest conversation you’ve had in a decade — not about music, about everything. The kid’s new hobby healed something neither of you could name. Family, finding its way back.",
            "effects": { "cred": 6, "network": 3, "burnout": -3, "addFlag": "sibling_bridge" }
          }
        }
      },
      "right": {
        "label": "Keep a careful distance",
        "governingStats": { "cred": 1 },
        "tags": ["home", "risky"],
        "outcomes": {
          "bad": {
            "text": "You keep it cordial and guarded, old wounds still tender, and your sibling hears the wall in your voice and retreats behind their own. The kid keeps playing. You keep not talking. The distance holds, familiar and sad. You tell yourself it’s fine.",
            "effects": { "cred": 3, "burnout": 3, "addFlag": "sibling_rift" }
          },
          "good": {
            "text": "You stay measured — you’re glad about the kid but you’re not ready to pretend the years didn’t happen — and your sibling, surprisingly, respects the honesty. It’s not a reconciliation. It’s the first honest thing between you in a while. It’s something.",
            "effects": { "cred": 5, "network": 2, "addFlag": "sibling_rift" }
          },
          "incredible": {
            "text": "You hold your boundary with such clear-eyed grace — loving the kid, honoring the history, refusing to fake a closeness you haven’t rebuilt — that your sibling is moved to actually apologize for the old stuff. Distance, held honestly, turns out to be its own kind of bridge. A start you didn’t expect.",
            "effects": { "cred": 6, "network": 3, "addFlag": "sibling_rift" }
          }
        }
      }
    }
  },
  {
    "id": "nm_sibling_recital",
    "act": 2,
    "pathAffinity": [],
    "weight": 11,
    "requires": { "anyOf": [{ "flagsAll": ["sibling_bridge"] }, { "flagsAll": ["sibling_rift"] }] },
    "art": "ev_nm_sibling_recital",
    "context": "The kid’s first recital vs. a real gig, same night",
    "prompt": "The kid’s first recital is the same night as a gig that actually matters for your career. Your sibling didn’t ask you to come — would never ask — but the kid mentioned, shyly, that they’re playing a song they learned by watching your videos. Both things are at 7 p.m. Two hours apart, ninety minutes of driving between them.",
    "recap": "The kid’s first recital and a career-making gig, same night.",
    "tags": ["home", "family"],
    "choices": {
      "left": {
        "label": "Make the recital, somehow",
        "governingStats": { "cred": 1, "skill": 0.3 },
        "tags": ["home", "family", "risky"],
        "outcomes": {
          "bad": {
            "text": "You skip the important gig to make the recital and the kid is thrilled and your career takes a small real hit and your manager is furious. The kid played your song, badly, perfectly. You’d make the same call again. The manager will get over it. The kid never forgets it.",
            "effects": { "cred": 5, "network": -3, "burnout": 3 }
          },
          "good": {
            "text": "You pull off both — play the gig early, break every speed limit, slide into the recital during the kid’s song — and the look on their face when they spot you in the back doorway is worth more than the gig ever could be. You showed up. That’s the whole job of family.",
            "effects": { "cred": 7, "network": 2, "fame": 3 }
          },
          "incredible": {
            "text": "You make it to the recital and, after, the kid pulls you up to play their song WITH them, and a room full of parents watches a real musician treat a seven-year-old like a peer. Your sibling cries. The rift, or the bridge, resolves into something whole. You chose family and family chose you back. Best gig you never played.",
            "effects": { "cred": 9, "network": 3, "fame": 4, "burnout": -2 }
          }
        }
      },
      "right": {
        "label": "Play the gig, call after",
        "governingStats": { "network": 1 },
        "tags": ["live", "safe"],
        "outcomes": {
          "bad": {
            "text": "You play the important gig and call after the recital, and the kid’s already asleep and your sibling’s voice is flat with a disappointment they’re too proud to name. You made the professional choice. It was correct. It doesn’t feel correct. It rarely does.",
            "effects": { "network": 4, "fame": 4, "burnout": 3 }
          },
          "good": {
            "text": "You play the gig, then video-call the moment the recital ends, and the kid replays their whole song for you over the phone, beaming. Not the same as being there. But you were THERE, in the way you could be. Your sibling notices you called first thing. It counts.",
            "effects": { "network": 5, "fame": 5, "cred": 3 }
          },
          "incredible": {
            "text": "You crush the career gig AND arrange for the recital to be livestreamed to your phone, watching from the wings, then surprise the kid with a video message that their whole class sees the next day. You couldn’t be in two places, so you built a third. The kid becomes the coolest in school. Your sibling realizes you never stopped caring. Distance, engineered into closeness.",
            "effects": { "network": 6, "fame": 6, "cred": 4 }
          }
        }
      }
    }
  },
  {
    "id": "nm_sibling_verse",
    "act": 3,
    "pathAffinity": [],
    "weight": 11,
    "requires": { "flagsAll": ["sibling_bridge"] },
    "art": "ev_nm_sibling_verse",
    "context": "Writing the kid into a song",
    "prompt": "The bridge with your sibling held, and grew, and now the kid is genuinely good and genuinely family. You’re writing your biggest song yet, and there’s a space in it that the kid — their story, their fearless little hands on your instrument — fits perfectly. You could put them in it. Forever.",
    "recap": "There’s a space in your biggest song where the kid fits perfectly.",
    "tags": ["write", "family"],
    "choices": {
      "left": {
        "label": "Write them into the song",
        "minigame": "ideas",
        "governingStats": { "creativity": 1, "cred": 0.3 },
        "tags": ["write", "family", "safe"],
        "outcomes": {
          "bad": {
            "text": "You write the kid into the song and get self-conscious about it being too sentimental, and pull back until it’s more subtle than it should be. It’s in there, quietly. Someday you’ll tell them which part is theirs. For now it’s a secret gift. That’s okay too.",
            "effects": { "creativity": 5, "cred": 3, "writeSong": true }
          },
          "good": {
            "text": "You write the kid into the song openly and it becomes the warmest, most alive thing on the record — the sound of a family healed, pressed into three minutes. When the kid figures out it’s about them, they’ll understand everything. So will your sibling.",
            "effects": { "creativity": 7, "cred": 5, "writeSong": true }
          },
          "incredible": {
            "text": "You write the kid into the song so beautifully it becomes the emotional center of your best work, and when it comes out, your sibling calls sobbing, and the kid plays it at their next recital knowing exactly what it means. You turned a decade of distance into a verse that will outlive all of you. Family, made permanent, made music. The realest thing you’ll ever write.",
            "effects": { "creativity": 9, "cred": 6, "fame": 4, "writeSong": true }
          }
        }
      },
      "right": {
        "label": "Give the song TO the kid instead",
        "governingStats": { "cred": 1, "creativity": 0.3 },
        "tags": ["home", "family", "risky"],
        "outcomes": {
          "bad": {
            "text": "You decide to give the kid the song outright — to learn, to own, to grow into — and your manager despairs at the “wasted” hit, and you don’t care, mostly. The kid has a song now. A real one. Yours. Theirs. The best inheritance you could think of.",
            "effects": { "cred": 5, "creativity": 3, "writeSong": true }
          },
          "good": {
            "text": "You gift the kid the song to make their own someday, and the gesture — a real artist handing a real song to a child — moves your sibling more than any reconciliation speech could. You gave the kid a future you once had to fight for. The bridge is now a foundation.",
            "effects": { "cred": 7, "creativity": 4, "network": 3, "writeSong": true }
          },
          "incredible": {
            "text": "You give the kid the song AND the encouragement to make it theirs, and years later they release their version and credit you, and the lineage — your instrument, your sibling’s child, your song — becomes a story people tell about how music runs in families. You didn’t just heal a rift. You planted a whole next generation. The song was only the seed. Everything grows from here.",
            "effects": { "cred": 9, "creativity": 5, "fame": 5, "writeSong": true }
          }
        }
      }
    }
  },
  {
    "id": "nm_sibling_thaw",
    "act": 3,
    "pathAffinity": [],
    "weight": 11,
    "requires": { "flagsAll": ["sibling_rift"] },
    "art": "ev_nm_sibling_thaw",
    "context": "Your sibling, alone, at the back of a show",
    "prompt": "The rift never fully healed — too many years, too much unsaid — but tonight, at your biggest hometown show, you spot them: your sibling, alone, at the very back, no kid, no reason to be there except that they came. They didn’t tell you. They’re half-hidden, like they’re not sure they’re allowed.",
    "recap": "At your hometown show, your sibling stands alone at the very back.",
    "tags": ["live", "family"],
    "choices": {
      "left": {
        "label": "Acknowledge them from the stage",
        "governingStats": { "cred": 1 },
        "tags": ["live", "family", "risky"],
        "outcomes": {
          "bad": {
            "text": "You call them out from the stage in front of everyone and they freeze, mortified, not ready to be seen — and they slip out before the encore. You reached too publicly for a private thing. But they came. They CAME. You hold onto that. You text them after. You wait.",
            "effects": { "cred": 4, "fame": 5, "burnout": 3 }
          },
          "good": {
            "text": "You catch their eye and just nod — no announcement, no spotlight, just I see you, thank you for coming — and they nod back, and something twelve years frozen shifts a degree toward spring. After the show they’re waiting by the van. It’s a start. A real one.",
            "effects": { "cred": 6, "fame": 4, "burnout": -2 }
          },
          "incredible": {
            "text": "You dedicate a song to “someone who came a long way tonight, in every sense,” looking right at them, and they understand, and they stay, and after the show you talk for three hours in an empty parking lot like the years never happened. The rift doesn’t heal all at once. But it heals. You gave it a stage and it finally spoke. Family, thawed, at last.",
            "effects": { "cred": 8, "fame": 6, "network": 3, "burnout": -3 }
          }
        }
      },
      "right": {
        "label": "Find them after, privately",
        "governingStats": { "network": 1, "cred": 0.3 },
        "tags": ["home", "family", "safe"],
        "outcomes": {
          "bad": {
            "text": "You look for them after the show and they’ve already gone, leaving only a text: “you were good. really good.” Four words, twelve years, one crack of light. You call. It goes to voicemail. You leave a long one. The thaw is slow. But it started. They came.",
            "effects": { "network": 3, "cred": 4, "burnout": 3 }
          },
          "good": {
            "text": "You find them after and skip the small talk and just hug them, hard, in the loading dock, and neither of you says much because you don’t have to. They came. You saw them. The rest is time, and time, finally, feels like it’s on your side. The bridge builds itself from here.",
            "effects": { "network": 4, "cred": 6, "burnout": -2 }
          },
          "incredible": {
            "text": "You find them after and they finally say the thing — the apology, the pride, the “I was scared for you and I called it judgment” — and you say yours, and in a concrete loading dock at midnight a decade of silence ends. The kid was always the bridge; tonight your sibling walked all the way across it alone. You have your family back. It’s the only encore that ever mattered.",
            "effects": { "network": 5, "cred": 8, "fame": 3, "burnout": -4 }
          }
        }
      }
    }
  },
  {
    "id": "nm_open_tab",
    "act": 1,
    "pathAffinity": [],
    "weight": 9,
    "art": "ev_nm_open_tab",
    "context": "The bartender, sliding you a drink you can’t pay for",
    "prompt": "Your first real venue, and you’re broke after a show that barely drew. The bartender — grizzled, kind, has seen a thousand of you — slides you a drink and waves off your empty wallet. “Start a tab,” they say. “Pay me when you’re somebody.” It’s a bet on you from someone with no reason to make it.",
    "recap": "The bartender waves off your empty wallet: “Pay me when you’re somebody.”",
    "tags": ["home", "network"],
    "choices": {
      "left": {
        "label": "Take the tab, make a vow",
        "governingStats": { "cred": 1 },
        "tags": ["home", "safe"],
        "outcomes": {
          "bad": {
            "text": "You take the drink and promise to pay it back tenfold and immediately feel the weight of a debt that isn’t really about money. The bartender just nods, having heard the vow a thousand times, mostly from people who never came back. You will. You swear it.",
            "effects": { "cred": 3, "burnout": 2, "addFlag": "open_tab" }
          },
          "good": {
            "text": "You take the tab and mean the promise, and the bartender’s small bet on you becomes a quiet fuel — someone believed when there was no evidence. Every time you play that room, the tab grows, and so does the resolve to pay it right.",
            "effects": { "cred": 5, "network": 3, "addFlag": "open_tab" }
          },
          "incredible": {
            "text": "You take the drink and the bartender tells you their own story — the band they were in, the tab someone once ran for them — and you realize you’ve joined a lineage of belief that runs through this bar like a current. You’re not just in debt. You’re in a tradition. You’ll honor it. All of it.",
            "effects": { "cred": 6, "network": 4, "addFlag": "open_tab" }
          }
        }
      },
      "right": {
        "label": "Insist on working it off",
        "governingStats": { "network": 1 },
        "tags": ["work", "safe"],
        "outcomes": {
          "bad": {
            "text": "You insist on washing glasses to cover the drink and the bartender lets you, amused, and you spend two hours on dishes to avoid a two-dollar debt. Pride is expensive and slow. But the bartender remembers the kid who wouldn’t take charity. That sticks.",
            "effects": { "network": 3, "money": 10, "addFlag": "open_tab" }
          },
          "good": {
            "text": "You work off the tab and then some, playing free sets on slow nights to fill the room, and the bartender realizes they bet on the right one. The tab becomes a partnership — you build their crowd, they build your confidence. Fair trade.",
            "effects": { "network": 5, "cred": 3, "addFlag": "open_tab" }
          },
          "incredible": {
            "text": "You turn the tab into a standing arrangement — you play their dead nights, they feed a starving artist — and it becomes the kind of scrappy mutual loyalty that whole music scenes are secretly built on. You didn’t take a handout. You started a friendship with a handshake and a dish towel. It’ll matter more than you know.",
            "effects": { "network": 6, "cred": 4, "addFlag": "open_tab" }
          }
        }
      }
    }
  },
  {
    "id": "nm_tab_called",
    "act": 2,
    "pathAffinity": [],
    "weight": 11,
    "requires": { "flagsAll": ["open_tab"] },
    "art": "ev_nm_tab_called",
    "context": "The bar is dying. The tab comes due.",
    "prompt": "The bar that ran your tab is dying — rent hike, changing neighborhood, the usual slow murder of good rooms. The bartender hasn’t asked for anything, would never, but you know the tab is still open, and you know a benefit show could save the place. The ask hangs in the air, unasked.",
    "recap": "The bar that ran your tab is dying. Your tab is still open.",
    "tags": ["live", "home"],
    "choices": {
      "left": {
        "label": "Throw the benefit show",
        "governingStats": { "network": 1, "cred": 0.3 },
        "tags": ["live", "home", "safe"],
        "outcomes": {
          "bad": {
            "text": "You commit to a benefit before you check your calendar, which is a disaster, and now you have to make it work through sheer will. The bartender protests that you don’t owe them this. You do, though. Not money. This. You’ll make it happen.",
            "effects": {
              "cred": 4,
              "network": 3,
              "burnout": 3,
              "addPromise": {
                "label": "Play the bar’s benefit",
                "tags": ["live"],
                "cards": 4,
                "reward": { "cred": 8, "fame": 5, "network": 4 },
                "penalty": { "cred": -6, "network": -3 }
              }
            }
          },
          "good": {
            "text": "You announce a benefit show and the response is immediate — the whole scene has a tab at this bar, emotionally — and suddenly saving the room becomes a movement. You just have to show up and play the debt off. All of it. Gladly.",
            "effects": {
              "cred": 6,
              "network": 4,
              "fame": 3,
              "addPromise": {
                "label": "Play the bar’s benefit",
                "tags": ["live"],
                "cards": 4,
                "reward": { "cred": 8, "fame": 5, "network": 4 },
                "penalty": { "cred": -6, "network": -3 }
              }
            }
          },
          "incredible": {
            "text": "You commit to headlining a benefit and rope in every act that ever ran a tab there, and the show becomes the event of the year before it’s even happened — a whole scene paying back one bartender’s decades of belief. You just have to deliver. You will. This is what making it was FOR.",
            "effects": {
              "cred": 8,
              "network": 5,
              "fame": 4,
              "addPromise": {
                "label": "Play the bar’s benefit",
                "tags": ["live"],
                "cards": 4,
                "reward": { "cred": 8, "fame": 5, "network": 4 },
                "penalty": { "cred": -6, "network": -3 }
              }
            }
          }
        }
      },
      "right": {
        "label": "Just pay the tab, hugely",
        "governingStats": { "cred": 1 },
        "tags": ["deal", "home", "risky"],
        "outcomes": {
          "bad": {
            "text": "You write a check big enough to clear the tab a thousand times over and the bartender refuses it, offended — “I didn’t bet on you for a payout.” You misread the whole thing. It was never about money. You put the check away, ashamed, and ask what they actually need.",
            "effects": { "cred": 3, "money": -100, "burnout": 3 }
          },
          "good": {
            "text": "You pay the tab and quietly cover a few months of the bar’s rent, and the bartender lets you, this once, because it keeps the doors open — but insists you understand it was never a loan. It was faith. You get it now. You pay it as faith, not debt.",
            "effects": { "cred": 6, "money": -120, "network": 3 }
          },
          "incredible": {
            "text": "You clear the tab and become a silent investor in the bar, keeping the room alive without taking it over, and the bartender — proud, stubborn, moved — makes you a permanent partner in the place that made you. You didn’t pay a debt. You bought a piece of your own origin, and kept it beating for the next broke kid. Full circle, secured.",
            "effects": { "cred": 8, "money": -100, "network": 5, "fame": 3 }
          }
        }
      }
    }
  },
  {
    "id": "nm_tab_wall",
    "act": 3,
    "pathAffinity": [],
    "weight": 11,
    "requires": { "flagsAll": ["open_tab"] },
    "art": "ev_nm_tab_wall",
    "context": "Your unpaid tab, framed on the wall",
    "prompt": "You walk into the old bar — saved, still standing — and stop cold: your original unpaid tab, the scrap of paper with your name and a two-dollar drink, is framed on the wall like a relic. The bartender grins. “Best investment I ever made. Left it open on purpose. Some tabs you don’t close.”",
    "recap": "Your unpaid two-dollar tab, framed on the bar wall like a relic.",
    "tags": ["home", "social"],
    "choices": {
      "left": {
        "label": "Leave it open, add to the legend",
        "governingStats": { "cred": 1 },
        "tags": ["home", "safe"],
        "outcomes": {
          "bad": {
            "text": "You leave the tab framed and unpaid and order another drink to add to it, and it’s a lovely bit until you realize the bartender is getting old and the bar won’t run forever. Some legends have expiration dates. You order a round for the house and try not to think about it.",
            "effects": { "cred": 5, "fame": 3, "burnout": 2 }
          },
          "good": {
            "text": "You embrace the framed tab as the beautiful thing it is — a monument to belief — and start a tradition of buying every struggling musician in the place their first drink, on your eternal tab. The bartender’s bet becomes a whole economy of faith. You keep it running.",
            "effects": { "cred": 7, "network": 4, "fame": 3 }
          },
          "incredible": {
            "text": "You turn your framed tab into an institution — a fund, in your name, that runs a tab for every broke musician who plays the room, forever — and the bartender weeps at the plaque next to it. Your two-dollar debt becomes a machine for making the next you. The tab stays open on purpose, for everyone, always. The best kind of never paying up.",
            "effects": { "cred": 9, "network": 5, "fame": 5 }
          }
        }
      },
      "right": {
        "label": "Finally pay it, with a story",
        "governingStats": { "network": 1, "cred": 0.3 },
        "tags": ["home", "social", "risky"],
        "outcomes": {
          "bad": {
            "text": "You insist on paying the framed tab and the bartender reluctantly takes the two dollars, and you both feel a little strange about ending a beautiful thing over principle. It’s paid now. It’s also over. You’re not sure it was the right call. The frame comes down. The wall looks empty.",
            "effects": { "network": 3, "cred": 4, "money": -10 }
          },
          "good": {
            "text": "You pay the tab in front of a full bar, telling the whole story of the night a stranger bet on a nobody, and the room erupts — a public thank-you decades in the making. The bartender keeps the frame up anyway, now with “PAID” and the date. Both truths, on the wall. Perfect.",
            "effects": { "network": 5, "cred": 6, "fame": 4 }
          },
          "incredible": {
            "text": "You pay the tab as a surprise at the bartender’s retirement party, telling the story to a room full of everyone the bar ever saved, and it becomes the emotional peak of the whole neighborhood’s history. The framed scrap — paid at last, decades late, in front of everyone who mattered — becomes the bar’s sacred object. You closed the tab and opened a legend. Some debts, paid right, become gifts to everyone.",
            "effects": { "network": 6, "cred": 8, "fame": 6 }
          }
        }
      }
    }
  },
  {
    "id": "nm_tab_pour",
    "act": 3,
    "pathAffinity": [],
    "weight": 11,
    "requires": { "flagsAll": ["open_tab"] },
    "art": "ev_nm_tab_pour",
    "context": "The bartender retires. Last pour, on the house.",
    "prompt": "The bartender is finally retiring, and on their last night behind the bar they pour you a drink — on the house, one last time — and slide it over with the same grin from all those years ago. “First one was on me, so’s the last,” they say. “One request. Play me something. Whatever you want. Just play.”",
    "recap": "The bartender retires, pours you one last drink, and asks for a song.",
    "tags": ["live", "home"],
    "choices": {
      "left": {
        "label": "Play the song from the beginning",
        "governingStats": { "skill": 1, "cred": 0.3 },
        "tags": ["live", "home", "safe"],
        "outcomes": {
          "bad": {
            "text": "You play the first song you ever played in that room, back when you were nobody, and your voice cracks on the chorus and you have to stop and start again. The bartender doesn’t mind. Neither does anyone. It’s the most human three minutes the bar has ever held. You barely finish. It’s perfect anyway.",
            "effects": { "skill": 4, "cred": 5, "burnout": 3 }
          },
          "good": {
            "text": "You play the song from your first night there, all these years later, to the person who bet on you before it was any good — and the whole bar, packed for the retirement, goes silent to witness a circle closing. You started here. You brought it all the way back. The bartender mouths the words.",
            "effects": { "skill": 6, "cred": 7, "fame": 3 }
          },
          "incredible": {
            "text": "You play the first song you ever played in that room, transformed by everything you’ve become, and it lands like a benediction — the nobody the bartender believed in, returned in full, honoring the bet with the only currency that ever mattered. The bartender cries. The whole bar cries. You cry. You play the last note of an era and it hangs there, perfect, forever. Some tabs you pay in song. This was always the price. It was always worth it.",
            "effects": { "skill": 8, "cred": 9, "fame": 5 }
          }
        }
      },
      "right": {
        "label": "Play something brand new, just for them",
        "minigame": "ideas",
        "governingStats": { "creativity": 1, "cred": 0.3 },
        "tags": ["live", "home", "risky"],
        "outcomes": {
          "bad": {
            "text": "You try to improvise a song for the bartender on the spot and it’s rough and half-formed and honest, and they love it more than anything polished could be because you made it right there, for them, out of nothing. It’s not good. It’s true. That’s better. The bartender keeps the napkin you scribbled it on.",
            "effects": { "creativity": 4, "cred": 5, "burnout": 3, "writeSong": true }
          },
          "good": {
            "text": "You play a brand-new song written for the bartender — about belief, about tabs, about the people who keep the doors open for dreamers — and it becomes an instant local legend, the song about the room, played in the room, on the last night. You gave them something that will outlive the bar itself.",
            "effects": { "creativity": 7, "cred": 6, "fame": 4, "writeSong": true }
          },
          "incredible": {
            "text": "You debut a song written in secret for exactly this night — the bartender’s whole life, the decades of belief, the lineage of tabs — and it’s so perfect and so complete that the room understands they’re witnessing the bartender’s eulogy sung while they’re still alive to hear it. The bartender holds your hand through the last verse. You immortalized the person who made you. It becomes the most beloved song you ever wrote. The first pour bought all of this. You paid it back a thousandfold, in the only language that lasts. Last call, forever.",
            "effects": { "creativity": 9, "cred": 8, "fame": 6, "writeSong": true }
          }
        }
      }
    }
  },
  {
    "id": "nfp_eclipse",
    "act": [1, 2, 3],
    "pathAffinity": [],
    "weight": 10,
    "flashpoint": true,
    "art": "ev_nfp_eclipse",
    "context": "The Eclipse Festival. Totality at 2:14 p.m. Your set: 1:45.",
    "prompt": "The festival scheduled you against the moon. At 2:14 the sky goes out for three minutes and forty-one seconds, and every astronomer on site agrees: nobody will be looking at you. The stage manager shrugs. “Play through it or plan around it. The moon doesn’t do soundcheck.”",
    "recap": "Your festival set at 1:45, and totality goes dark at 2:14.",
    "tags": ["live", "risky"],
    "choices": {
      "left": {
        "label": "Build the set around the dark",
        "governingStats": { "creativity": 1, "skill": 0.4 },
        "tags": ["live", "risky", "indie"],
        "outcomes": {
          "bad": {
            "text": "Clouds. Wall-to-wall, industrial-grade clouds. Totality arrives as a mild dimming, like a fridge bulb dying, and your carefully architected crescendo lands on a field of people staring at where a miracle should be. Someone claps for the clouds.",
            "effects": { "creativity": 3, "burnout": 8, "fame": 2 }
          },
          "good": {
            "text": "The sky cooperates. You hit the quiet part as the light drains, and for three minutes a whole field breathes in 6/8. When the sun comes back the crowd looks at you like you scheduled it. You do not correct them.",
            "effects": { "creativity": 8, "fame": 9, "cred": 6, "money": 120 }
          },
          "incredible": {
            "text": "The last chord of the new one rings out at the exact second the diamond ring flares — a coincidence so perfect that four different videos of it sync to the frame. Astronomers share it. ASTRONOMERS. The song now legally belongs to the sky, and everyone wants it.",
            "effects": { "creativity": 12, "fame": 20, "cred": 8, "money": 250, "writeSong": true }
          }
        }
      },
      "right": {
        "label": "Stop playing. Watch it with them.",
        "governingStats": { "cred": 1 },
        "tags": ["live", "safe", "rest"],
        "outcomes": {
          "bad": {
            "text": "You call the pause a beat too early and stand in gathering gloom for four silent minutes holding your instrument like an umbrella. The crowd is moved by the sky and mildly confused by you. A vendor sells out of moon pies.",
            "effects": { "cred": 2, "burnout": 5, "creativity": 2 }
          },
          "good": {
            "text": "You put the instrument down and lie back on the stage with everyone else. Ten thousand people and you, all briefly the same size. Afterward the set hits different — you and the crowd just went through something.",
            "effects": { "cred": 7, "creativity": 6, "burnout": -5, "fame": 5 }
          },
          "incredible": {
            "text": "In the dark, unplanned, the whole field starts humming your opener — softly, together, to the eclipse. You didn’t play a note. The moment gets written up as “the set that knew when to stop,” which is the best review a set can get.",
            "effects": { "cred": 12, "fame": 14, "creativity": 8, "burnout": -6, "money": 150 }
          }
        }
      }
    }
  },
  {
    "id": "nfp_gorefeast",
    "act": [2, 3],
    "pathAffinity": [],
    "weight": 10,
    "flashpoint": true,
    "art": "ev_nfp_gorefeast",
    "context": "BLOODMOOT FESTIVAL. The poster says GOREFEAST. You are not Gorefeast.",
    "prompt": "The booking email said “Gorefest, right?” and you said yes, because a festival is a festival. It is now clear that the metal festival expected Gorefeast — nine albums, corpse paint, a song called “Marrow Silo” — and got you. The tent holds two thousand people warming up a pit. Your entire catalog is in a major key.",
    "recap": "A metal festival booked Gorefeast and got you. Two thousand wait.",
    "tags": ["live", "risky"],
    "choices": {
      "left": {
        "label": "BECOME Gorefeast for forty minutes",
        "governingStats": { "skill": 1, "creativity": 0.5 },
        "tags": ["live", "risky", "band"],
        "minigame": "crowd",
        "outcomes": {
          "bad": {
            "text": "Your ballad, detuned and screamed, is identified as an impostor by song two. The pit stops moshing to WATCH you, which is worse. You are escorted off with what the security guard calls “respect for the attempt.” The attempt trends locally.",
            "effects": { "skill": 3, "burnout": 10, "fame": 4, "cred": -4 }
          },
          "good": {
            "text": "Triple the distortion, halve the tempo, scream every lyric like it owes you money — and it WORKS. The pit opens for your saddest song. A man in corpse paint weeps openly, which in here counts as five stars.",
            "effects": { "skill": 7, "fame": 10, "cred": 6, "money": 180 }
          },
          "incredible": {
            "text": "The crowd figures it out mid-set — and decides they don’t care. Two thousand metalheads perform, by consensus, the gentlest wall of death ever recorded, in waltz time, to your love song. Actual Gorefeast posts the video with the caption “we’ve been outfeasted.” New fans. Terrifying, devoted new fans.",
            "effects": { "skill": 10, "fame": 18, "cred": 12, "money": 300, "network": 5 }
          }
        }
      },
      "right": {
        "label": "Come clean to the pit",
        "governingStats": { "cred": 1 },
        "tags": ["live", "safe", "social"],
        "outcomes": {
          "bad": {
            "text": "“I am not Gorefeast” gets the biggest cheer of your night, downhill from there. You play three songs to a politely dispersing tent and get paid in festival vouchers. The vouchers do not cover the drive.",
            "effects": { "cred": 3, "money": -60, "burnout": 8 }
          },
          "good": {
            "text": "You open with the truth and a compromise: “I’ll play mine, you scream along wherever feels right.” They take the deal seriously. Your bridge now has a canonical growl arrangement, and the promoter pays full fee out of embarrassment.",
            "effects": { "cred": 8, "fame": 6, "money": 200, "network": 4 }
          },
          "incredible": {
            "text": "Halfway through your honest little set, Gorefeast themselves arrive — wrong festival, same booker — and instead of taking the stage they join yours. “Marrow Silo (Unplugged)” featuring you is bootlegged forty ways before midnight. The booker faints. Both bands agree never to correct the lineup poster.",
            "effects": { "cred": 12, "fame": 16, "network": 10, "money": 250 }
          }
        }
      }
    }
  },
  {
    "id": "nfp_anthem",
    "act": [2, 3],
    "pathAffinity": [],
    "weight": 10,
    "flashpoint": true,
    "art": "ev_nfp_anthem",
    "context": "The stadium tunnel. A man in a team polo with a stopwatch.",
    "prompt": "The local team wants a seventh-inning song. “Forty seconds. Team name early and often. Thirty thousand people will sing it drunk for the next fifty years or never again — no middle.” The current anthem is an organ riff from 1974 and its composer’s grandchildren still get checks.",
    "recap": "The team wants a seventh-inning song. Forty seconds, name early and often.",
    "tags": ["write", "deal"],
    "choices": {
      "left": {
        "label": "Write the shameless chant",
        "governingStats": { "creativity": 1, "network": 0.3 },
        "tags": ["write", "mainstream", "safe"],
        "minigame": "ideas",
        "outcomes": {
          "bad": {
            "text": "Your chant tests badly with the focus group, which is nine season-ticket holders and a parrot the owner trusts. The parrot is indifferent. They keep the organ riff. You keep the kill fee and a new respect for the parrot.",
            "effects": { "creativity": 2, "money": 80, "burnout": 6 }
          },
          "good": {
            "text": "Three chords, the team name eleven times, a keychange for the fireworks. The stadium learns it in one inning. You have written something objectively dumb and undeniably immortal, and the check clears in both categories.",
            "effects": { "creativity": 6, "money": 350, "fame": 10 }
          },
          "incredible": {
            "text": "It DETONATES. By August the chant has escaped the stadium — weddings, graduations, one (1) senate campaign you did not authorize. Thirty thousand strangers scream your dumbest, truest forty seconds every home game, forever. The organ riff’s grandchildren send a wreath.",
            "effects": { "creativity": 8, "money": 500, "fame": 20, "chartTitle": "Top of the Seventh" }
          }
        }
      },
      "right": {
        "label": "Sneak in a real song",
        "governingStats": { "creativity": 1, "cred": 0.4 },
        "tags": ["write", "indie", "risky"],
        "outcomes": {
          "bad": {
            "text": "Your subtle, aching meditation on hope disguised as a sports chant confuses forty thousand people at once — a personal record. The team quietly reverts to the organ. A local critic calls it “the bravest flop in franchise history,” which goes on the shelf next to no money.",
            "effects": { "creativity": 3, "cred": 4, "burnout": 8, "money": -40 }
          },
          "good": {
            "text": "You smuggle an actual melody past the polo man, and it holds. The crowd sings the hook without being told to. Sports radio calls it “weirdly moving.” Your name is now said in bars that have never once played your genre.",
            "effects": { "creativity": 7, "fame": 12, "cred": 6, "money": 250 }
          },
          "incredible": {
            "text": "The team goes on a run, and superstition does the rest: your song is now LUCKY, which outranks good. The stadium sings the sad verse — the one you were sure they’d cut — in full voice, seventh inning, October. You wrote a real song and hid it inside a chant, and the whole city found it.",
            "effects": { "creativity": 12, "fame": 16, "cred": 10, "money": 400 }
          }
        }
      }
    }
  },
  {
    "id": "nfp_wax",
    "act": [2, 3],
    "pathAffinity": [],
    "weight": 10,
    "flashpoint": true,
    "art": "ev_nfp_wax",
    "context": "The Hall of Notable Figures (regional). A velvet rope. A shape.",
    "prompt": "The wax museum made a you. The unveiling is tonight and you’re contractually “encouraged” to attend. You have seen a preview photo. It is… close. The eyes are yours. The smile belongs to a realtor. It is holding your instrument almost correctly, the way a crab might.",
    "recap": "The wax museum made a you. The eyes are right; the smile is a realtor’s.",
    "tags": ["fame", "social"],
    "choices": {
      "left": {
        "label": "Embrace the wax you",
        "governingStats": { "network": 1, "creativity": 0.3 },
        "tags": ["social", "mainstream", "safe"],
        "outcomes": {
          "bad": {
            "text": "You pose beside it gamely, and every photo from the night has the same problem: the wax one looks more relaxed. A local paper runs the picture with the caption swapped. Nobody catches it for nine days. You get free museum admission for life, for whatever that’s worth.",
            "effects": { "fame": 4, "cred": -3, "burnout": 6, "network": 2 }
          },
          "good": {
            "text": "You lean in — matching outfit, matching realtor smile, dead still on the plinth until a tourist screams. The clip does numbers. The museum reports record attendance and sends you a fruit basket addressed to “both of you.”",
            "effects": { "fame": 12, "network": 5, "money": 150, "creativity": 4 }
          },
          "incredible": {
            "text": "You perform an entire acoustic set standing next to yourself, trading verses with the statue via hidden speaker, and the internet loses its mind deciding which one is real. “WAX SET” becomes shorthand for committing to the bit. The museum offers a residency. The statue, they inform you gravely, has fans now.",
            "effects": { "fame": 20, "creativity": 10, "money": 300, "network": 8 }
          }
        }
      },
      "right": {
        "label": "Demand corrections",
        "governingStats": { "cred": 1 },
        "tags": ["social", "risky", "indie"],
        "outcomes": {
          "bad": {
            "text": "Your notes — eleven items, two about the hands — leak. The story becomes “musician feuds with own statue,” and the statue, having no publicist, wins. The realtor smile follows you into your dreams, where it apologizes to clients you can’t see.",
            "effects": { "fame": 5, "cred": -6, "burnout": 10 }
          },
          "good": {
            "text": "You sit with the sculptor for an afternoon and talk about your face like it’s a mix — brighter here, less compression there. The corrected version is startling. People stand in front of it quietly, the way you always hoped they’d stand in front of the records.",
            "effects": { "cred": 9, "creativity": 6, "fame": 8, "burnout": -4 }
          },
          "incredible": {
            "text": "The sculptor, it turns out, is a genius who’d been rushed. Given time, she produces something the local art critics call “the truest portrait in the building, including the paintings.” The unveiling of the REDONE you outdraws the original event, and the story — artist demands honesty, gets it — becomes part of your legend.",
            "effects": { "cred": 14, "fame": 15, "creativity": 8, "network": 6, "money": 100 }
          }
        }
      }
    }
  },
  {
    "id": "nfp_broadcast",
    "act": [2, 3],
    "pathAffinity": [],
    "weight": 10,
    "flashpoint": true,
    "art": "ev_nfp_broadcast",
    "context": "Live radio session, take four. Then: the tone.",
    "prompt": "Mid-take, every speaker in the station erupts: THIS IS A TEST OF THE EMERGENCY BROADCAST SYSTEM. The tone holds a perfect concert A under your whole second verse, then stops. The engineer goes pale: takes one through three are gone — a tape machine older than everyone present ate them. The only surviving take is the one with the government singing harmony.",
    "recap": "Mid-take, the emergency tone holds a concert A under your whole verse.",
    "tags": ["studio", "record"],
    "choices": {
      "left": {
        "label": "Release the tone take",
        "governingStats": { "creativity": 1, "cred": 0.4 },
        "tags": ["record", "risky", "indie"],
        "outcomes": {
          "bad": {
            "text": "Listeners keep reporting the song to the platform as an actual emergency. It gets pulled twice, reinstated once, and permanently flagged “may cause alarm,” which is the most accurate genre tag you’ve ever received. The engineer frames the incident report.",
            "effects": { "creativity": 4, "fame": 3, "burnout": 8, "money": -50 }
          },
          "good": {
            "text": "The tone sits under the verse like it was scored. Reviewers assume it’s a synth and praise your “institutional dread.” You never correct them. The take becomes the version — nobody who hears it wants the clean one.",
            "effects": { "creativity": 9, "cred": 8, "fame": 8, "money": 150 }
          },
          "incredible": {
            "text": "An archivist identifies the exact tone generator — decommissioned, one of a kind, apparently beloved — and the story eats the internet: THE LAST BROADCAST OF UNIT 7 IS ON THIS SONG. The agency itself replies “we do not endorse this banger,” which endorses the banger. The take charts on pure myth.",
            "effects": { "creativity": 12, "fame": 18, "cred": 10, "money": 400 }
          }
        }
      },
      "right": {
        "label": "Re-record it clean",
        "governingStats": { "skill": 1 },
        "tags": ["studio", "safe", "practice"],
        "outcomes": {
          "bad": {
            "text": "Takes five through nineteen are technically fine and spiritually vacant. Everyone in the booth knows the tone take was better and everyone in the booth is too tired to say it. You go home with a clean, correct recording of a song that used to be alive.",
            "effects": { "skill": 3, "burnout": 9, "creativity": 2 }
          },
          "good": {
            "text": "You chase the ghost of take four for two hours and then stop chasing and just play. Take twenty-two is its own animal — leaner, angrier, no help from the government. The engineer keeps the tone take “for the archive,” with a look that says the archive is his car.",
            "effects": { "skill": 7, "creativity": 6, "cred": 5, "money": 100 }
          },
          "incredible": {
            "text": "Take twenty-three is the one — and the station, charmed by the whole saga, airs both versions back to back as “A Song, Interrupted.” The segment syndicates nationally. You become the artist who beat their own act of god, and the clean take carries the story everywhere it goes.",
            "effects": { "skill": 10, "creativity": 8, "fame": 14, "cred": 8, "money": 250 }
          }
        }
      }
    }
  },
  {
    "id": "nfp_yacht",
    "act": [2, 3],
    "pathAffinity": [],
    "weight": 10,
    "flashpoint": true,
    "art": "ev_nfp_yacht",
    "context": "A wedding planner with a briefcase and a nondisclosure agreement",
    "prompt": "A billionaire’s child is getting married on a yacht in water too expensive to name. The fee has a comma where you’ve never had a comma. The terms: phones confiscated, no photos, no setlist approval, and your name appears nowhere, ever — legally, you were never aboard. “Think of it,” the planner says, “as the best show nobody will believe you played.”",
    "recap": "A yacht wedding, a fee with a new comma, and your name nowhere, ever.",
    "tags": ["deal", "live"],
    "choices": {
      "left": {
        "label": "Sign it. Vanish for a night.",
        "governingStats": { "network": 1, "skill": 0.4 },
        "tags": ["deal", "safe", "live"],
        "outcomes": {
          "bad": {
            "text": "The groom’s college band “sits in” for most of your set. You spend four hours as a very well-paid human music stand while a man named Tripp fights the key of G. The check clears. The memory also clears, mostly, eventually.",
            "effects": { "money": 300, "burnout": 10, "cred": -5, "skill": 2 }
          },
          "good": {
            "text": "You play the strangest, freest set of your life to people so rich they’ve forgotten how to be impressed — and then, around midnight, they remember. A woman who owns an island requests a deep cut. Nobody will ever know how good you were tonight, except you, which turns out to be worth something.",
            "effects": { "money": 450, "network": 6, "skill": 6, "burnout": 4 }
          },
          "incredible": {
            "text": "At 2 a.m. the bride’s grandfather — a name from the spines of half your record collection, presumed retired, presumed mythical — borrows a guitar and plays with you until sunrise. No phones. No proof. Just you, a legend, and the Atlantic. He leaves you his number on a cocktail napkin you will laminate.",
            "effects": { "money": 500, "network": 12, "skill": 10, "creativity": 8, "cred": 6 }
          }
        }
      },
      "right": {
        "label": "Counter: half the fee, keep the story",
        "governingStats": { "cred": 1 },
        "tags": ["deal", "risky", "social"],
        "outcomes": {
          "bad": {
            "text": "The planner closes the briefcase with the sound of a door sealing on a vault. They hire someone else — someone, you later learn through gritted teeth, whose career the wedding quietly made. You kept your principles and a normal weekend. Principles do not pay for strings.",
            "effects": { "cred": 3, "burnout": 8, "money": -80 }
          },
          "good": {
            "text": "To your shock, they take the deal — apparently nobody has ever countered before, and the billionaire finds it “refreshing.” Half the fee is still the best check of your year, and the story — the yacht, the napkins, the dolphin incident — becomes your best interview answer for a decade.",
            "effects": { "money": 250, "fame": 10, "cred": 8, "network": 5 }
          },
          "incredible": {
            "text": "The counter charms the family so thoroughly they tear up the NDA at the reception. Photos surface of you mid-song on a boat that costs more than a stadium, and the caption war alone triples your following. The billionaire’s office calls in spring: they fund things. Would you like to be a thing.",
            "effects": { "money": 350, "fame": 20, "cred": 10, "network": 10 }
          }
        }
      }
    }
  },
  {
    "id": "nfp_sinkhole",
    "act": [2, 3],
    "pathAffinity": [],
    "weight": 10,
    "flashpoint": true,
    "art": "ev_nfp_sinkhole",
    "context": "Load-in, 4 p.m. The street in front of the venue: gone.",
    "prompt": "A sinkhole opens in front of the venue with a sound like the earth clearing its throat. Thirty feet across, geologically smug, and — per the fire marshal — “stable-ish.” The show is in five hours. The promoter, a visionary under pressure, has already changed the marquee: TONIGHT — THE SINKHOLE SHOW.",
    "recap": "A thirty-foot sinkhole out front, five hours to showtime.",
    "tags": ["live", "risky"],
    "choices": {
      "left": {
        "label": "Play the rim of the void",
        "governingStats": { "creativity": 1, "network": 0.4 },
        "tags": ["live", "risky", "fame"],
        "outcomes": {
          "bad": {
            "text": "The hole widens a foot mid-set, calmly, like it’s stretching. Evacuation is orderly; the PA’s descent is not. National news runs eight seconds of your bridge under the chyron LOCAL HOLE GROWS. Technically your biggest broadcast.",
            "effects": { "money": -200, "fame": 6, "burnout": 10, "cred": 3 }
          },
          "good": {
            "text": "You play facing the hole, crowd curved around it like an amphitheater the city built by accident. Every kick drum hit comes back up out of the earth a half-second late — the sinkhole is, acoustically, the best member of the band. The fire marshal nods along, which is the review that matters.",
            "effects": { "fame": 12, "cred": 8, "creativity": 8, "money": 200 }
          },
          "incredible": {
            "text": "THE SINKHOLE SHOW enters legend before the encore ends. Drone footage of a crowd ringed around a glowing municipal void, singing your chorus into it, becomes the image of the year. The city — the actual city — licenses the photo for tourism. Geologists cite the attendance. You will never play a normal room again without someone yelling “play the hole.”",
            "effects": { "fame": 20, "cred": 12, "creativity": 10, "money": 450, "network": 6 }
          }
        }
      },
      "right": {
        "label": "Cancel. Help with the barricades.",
        "governingStats": { "cred": 1 },
        "tags": ["safe", "social", "work"],
        "outcomes": {
          "bad": {
            "text": "You spend the night hauling sawhorses while the promoter, undeterred, books a jam band to play the hole. They’re terrible. The hole deserved better. You are on precisely zero of the news footage and all of the invoice for the deposit.",
            "effects": { "money": -100, "cred": 4, "burnout": 8 }
          },
          "good": {
            "text": "You barricade, you direct traffic, you bring coffee to the surveyors. At midnight the venue owner unlocks the room and you play an unannounced set for the whole cleanup crew — hi-vis vests swaying in the dark. Word gets around. Word always gets around.",
            "effects": { "cred": 10, "network": 6, "fame": 6, "burnout": -4 }
          },
          "incredible": {
            "text": "The city engineer you spent all night handing wrenches to turns out to run the summer concert series. “You’re the only act I’ve met who shows up for the boring part.” She books you for the plaza reopening — headline slot, city budget, and a plaque near the filled hole that does not mention the jam band.",
            "effects": { "cred": 14, "network": 10, "fame": 12, "money": 350, "burnout": -4 }
          }
        }
      }
    }
  },
  {
    "id": "nfp_parade",
    "act": [2, 3],
    "pathAffinity": [],
    "weight": 10,
    "flashpoint": true,
    "art": "ev_nfp_parade",
    "context": "A float shaped like a giant vinyl record. A live mic. Main Street.",
    "prompt": "Your hometown made you grand marshal. The float is moving at four miles an hour past every person who ever knew you — your dentist, your algebra teacher, the guy who fired you from the movie theater, three exes spaced with cruel evenness along the route. The mic is live. The whole town is listening. The float cannot be stopped.",
    "recap": "Grand marshal on a vinyl-record float, past everyone who knew you.",
    "tags": ["live", "family"],
    "choices": {
      "left": {
        "label": "Play the song about this town",
        "governingStats": { "creativity": 1, "cred": 0.4 },
        "tags": ["live", "risky", "roots"],
        "outcomes": {
          "bad": {
            "text": "The town recognizes itself in verse two — specifically, the unflattering part about the water tower — and the applause develops a temperature. Your algebra teacher mouths “disappointing” with the exact face from the quadratics unit. The movie theater guy alone loves it.",
            "effects": { "creativity": 4, "cred": 3, "fame": 4, "burnout": 10 }
          },
          "good": {
            "text": "You play it straight through, four miles an hour, and watch the song land block by block — the diner crowd, the church crowd, your old paper route. By the hardware store, people are singing the chorus back at a moving float. The dentist weeps. You needed the dentist to weep.",
            "effects": { "creativity": 8, "cred": 10, "fame": 10, "burnout": -4 }
          },
          "incredible": {
            "text": "At the final turn your first music teacher is waiting on the courthouse steps with the middle school band, who have secretly learned the horn part. The whole square sings the bridge. The town renames the practice rooms after you — the actual rooms where you were told to keep it down. Nobody keeps it down.",
            "effects": { "creativity": 12, "cred": 14, "fame": 18, "network": 6, "burnout": -6 }
          }
        }
      },
      "right": {
        "label": "Keep it light. Wave. Play the hits.",
        "governingStats": { "skill": 1 },
        "tags": ["live", "safe", "mainstream"],
        "outcomes": {
          "bad": {
            "text": "Between songs, the live mic catches your private aside about the mayor’s “parade voice.” The mayor has a microphone too, and a sense of humor, and now you are in a roast battle at four miles an hour with an elected official who is winning. The town takes his side. It’s his parade voice.",
            "effects": { "skill": 2, "fame": 5, "cred": -4, "burnout": 8 }
          },
          "good": {
            "text": "You give them the hits, the wave, the pointing-at-people-you-recognize bit — flawless hometown-kid execution. Three exes nod with varying complexity. The local paper runs THE KID’S ALRIGHT above a photo where you look genuinely happy, because you were.",
            "effects": { "skill": 6, "fame": 10, "cred": 5, "money": 100, "burnout": -4 }
          },
          "incredible": {
            "text": "Halfway down Main the crowd stops waiting for songs and starts requesting them — deep cuts, B-sides, the one you wrote at sixteen that eleven people should know. The whole town has been listening this entire time. You play requests off a parade float for an hour past the route’s end. The float driver, on his own authority, does a second lap.",
            "effects": { "skill": 8, "fame": 16, "cred": 10, "money": 200, "burnout": -6 }
          }
        }
      }
    }
  },
  {
    "id": "nfp_terminal",
    "act": [1, 2, 3],
    "pathAffinity": [],
    "weight": 10,
    "flashpoint": true,
    "art": "ev_nfp_terminal",
    "context": "Gate B12. Delay: 9 hours. New estimate: also 9 hours.",
    "prompt": "The board says DELAYED in a font that has given up. Nine hours, gate B12, and fate has stacked the room: you with your instrument, and — sprawled across four gates like a shipwreck — an entire touring orchestra, sixty strong, missing the same connection. Their concertmaster catches you looking at your case. She raises an eyebrow that contains a whole contract.",
    "recap": "Gate B12, a nine-hour delay, and a stranded sixty-piece orchestra.",
    "tags": ["live", "social"],
    "choices": {
      "left": {
        "label": "Raise the orchestra",
        "governingStats": { "network": 1, "creativity": 0.5 },
        "tags": ["live", "risky", "band"],
        "outcomes": {
          "bad": {
            "text": "Sixty musicians, zero sheet music, one gate agent losing a fight with a headset. The arrangement collapses at the key change into what a bystander’s video titles “airport noise (why).” Security is polite. The cellos, packing up, say “good instincts” in the tone people use for dogs.",
            "effects": { "network": 3, "burnout": 9, "fame": 3, "creativity": 2 }
          },
          "good": {
            "text": "The concertmaster sketches parts on napkins and boarding passes, and by hour three, gate B12 has strings. Your song, orchestrated by the stranded, rolls down the terminal like weather. Delayed passengers drift over from gates away, following the sound to something worth missing a flight for.",
            "effects": { "network": 8, "creativity": 8, "fame": 10, "cred": 6 }
          },
          "incredible": {
            "text": "Hour five: full arrangement. Hour six: the airline surrenders and pages it as an event. Someone films the whole thing from the moving walkway in one unbroken shot — you and sixty stranded strangers turning a delay into the best venue in the city — and it becomes THE video, the one strangers will describe to you at shows for years. The orchestra’s label calls before you land.",
            "effects": { "network": 12, "creativity": 10, "fame": 20, "cred": 8, "money": 300 }
          }
        }
      },
      "right": {
        "label": "Play small for gate B12",
        "governingStats": { "skill": 1, "cred": 0.3 },
        "tags": ["live", "safe", "solo"],
        "outcomes": {
          "bad": {
            "text": "You get four songs deep before a man on a conference call asks you, without muting, to “take the concert somewhere else, some of us are working.” The gate takes his side, sleepily. You play one more out of principle, quieter, which defeats the principle.",
            "effects": { "skill": 2, "cred": 2, "burnout": 6 }
          },
          "good": {
            "text": "You play soft and low for your corner of the wreckage — the toddler finally sleeps, the crying woman by the window stops crying, the gate agent mouths thank you. The orchestra listens with their eyes closed, professionally. It’s the smallest room you’ve played in years and one of the best.",
            "effects": { "skill": 6, "cred": 8, "burnout": -6, "network": 4 }
          },
          "incredible": {
            "text": "One by one, without a word, the orchestra unpacks — a viola joins the third song, then a clarinet, then quietly everyone, sixty players folding themselves around your smallest tunes at whisper volume. Nobody films it. Everyone at gate B12 agrees, forever, that you had to be there. The concertmaster hands you her card: “We land somewhere eventually. So should you.”",
            "effects": { "skill": 10, "cred": 12, "creativity": 8, "network": 10, "burnout": -6 }
          }
        }
      }
    }
  },
  {
    "id": "nfp_lookalike",
    "act": [2, 3],
    "pathAffinity": [],
    "weight": 10,
    "flashpoint": true,
    "art": "ev_nfp_lookalike",
    "context": "The bar’s chalkboard: your name, listed twice, 9 and 11",
    "prompt": "For two towns and eight months, someone has been gigging AS you — your name, your setlist, your stage banter down to the pause. Tonight, through a booking accident with the shape of destiny, you are both on the bill at the same bar. They’re at the counter. They have your haircut. They are, you notice with genuine outrage, tuning your way.",
    "recap": "Someone’s been gigging as you — now you’re both on the bill.",
    "tags": ["live", "rival"],
    "choices": {
      "left": {
        "label": "Duel them onstage",
        "governingStats": { "skill": 1, "creativity": 0.3 },
        "tags": ["live", "risky", "fame"],
        "outcomes": {
          "bad": {
            "text": "The crowd cannot tell you apart, and — a knife you did not see coming — splits down the middle on WHO DID THE SONGS BETTER. You win the duel on points and lose the night to a bar-wide argument about which one was the real one. The impostor slips out during your encore. Your encore. Theirs. Yours.",
            "effects": { "skill": 3, "fame": 5, "burnout": 10, "cred": -3 }
          },
          "good": {
            "text": "You trade songs like punches — yours, then theirs-which-are-yours — and the room figures it out in real time, which is the best theater the bar has ever hosted. You take the crown on the deep cut they never learned. They take a bow, own it, and buy the whole room a round of apology.",
            "effects": { "skill": 8, "fame": 12, "cred": 8, "money": 150 }
          },
          "incredible": {
            "text": "THE DOUBLE SHOW becomes instant local scripture: two identical acts, one truth, a bar full of jurors. For the finale you play in unison — the impostor knows your catalog note-perfect, better than your band ever has — and the crowd, weeping, votes with its feet by carrying you BOTH out. The story goes national. Ticket sales do not distinguish between myth and fraud, and right now you are both.",
            "effects": { "skill": 10, "fame": 20, "cred": 10, "money": 350, "network": 6 }
          }
        }
      },
      "right": {
        "label": "Hire them",
        "governingStats": { "network": 1 },
        "tags": ["deal", "risky", "social"],
        "outcomes": {
          "bad": {
            "text": "Your new “official double” takes the arrangement seriously for exactly one month, then books a festival as you, headlines it as you, and does the press as you — glowing press, which is the insult inside the injury. The lawyer you consult opens with “so this is a new one.”",
            "effects": { "network": 2, "money": -150, "burnout": 10, "fame": 4 }
          },
          "good": {
            "text": "You put them on payroll: the far towns, the doubles, the gigs that were killing you. They’re disciplined, grateful, and unsettlingly good at being you — better rested, mostly. Your coverage doubles. Occasionally a review of a show you never played says you seemed “renewed.” You were. You were at home.",
            "effects": { "network": 8, "money": 250, "fame": 8, "burnout": -6 }
          },
          "incredible": {
            "text": "It becomes the arrangement of legend: you send the double to everything you hate — early flights, brand brunches, a ribbon-cutting — while you write. Then, when the internet finally cracks the case, the reveal is so beloved it becomes bigger than either career: THE ARTIST AND THE UNDERSTUDY, joint interview, joint tour, two yous per night, tickets instantly gone. Your double negotiates their own rider. You raise their pay. They earned it. You’re pretty sure you did.",
            "effects": { "network": 12, "fame": 18, "money": 400, "creativity": 8, "cred": 6 }
          }
        }
      }
    }
  },
  {
    "id": "nw_first_dance",
    "act": 1,
    "pathAffinity": [],
    "weight": 9,
    "pack": "pack_wedding",
    "art": "ev_nw_first_dance",
    "context": "A café booth. A couple. A shoebox of ticket stubs.",
    "prompt": "They want an original for their first dance and they’ve brought evidence: ticket stubs, the receipt from the night they met, a voicemail he never deleted. Budget: $150 and veto power. “It just has to sound like us,” she says, as if that were a key.",
    "recap": "A couple wants a first-dance original. Budget: $150 and veto power.",
    "tags": ["write", "deal"],
    "choices": {
      "left": {
        "label": "Write them from scratch",
        "governingStats": { "creativity": 1 },
        "tags": ["write", "safe", "home"],
        "outcomes": {
          "bad": {
            "text": "Draft three finally passes veto, minus the good line — “too sad,” he says, correctly identifying the only true thing in it. You play it at the reception and it works fine, which is the worst thing music can do. The $150 arrives with a thank-you card that also works fine.",
            "effects": { "creativity": 2, "money": 100, "burnout": 5 }
          },
          "good": {
            "text": "You steal the melody from the rhythm of the voicemail — the way he says her name twice — and don’t tell them. At the reception she stops mid-dance: “Why does this feel familiar?” Exactly. The whole tent asks who wrote it.",
            "effects": { "creativity": 6, "money": 150, "network": 3, "fame": 2 }
          },
          "incredible": {
            "text": "The song outgrows the wedding: guests demand recordings, a bridesmaid posts the dance, and by Monday four more couples want commissions at double the rate. You have accidentally founded a cottage industry with a waiting list. The couple’s dog is named after your working title.",
            "effects": { "creativity": 8, "money": 220, "network": 5, "fame": 4 }
          }
        }
      },
      "right": {
        "label": "Retool one you already have",
        "governingStats": { "skill": 1, "network": 0.3 },
        "tags": ["write", "risky", "work"],
        "outcomes": {
          "bad": {
            "text": "Mid-first-dance, a groomsman who follows your stuff mouths along with every word of “their” song. The bride notices. The look she gives you over the groom’s shoulder will appear in your dreams during load-ins for a year. Partial payment, full lesson.",
            "effects": { "skill": 2, "money": 60, "burnout": 6, "cred": -2 }
          },
          "good": {
            "text": "New bridge, their names in verse two, key up a step for hope — twenty minutes of surgery and the old song fits them like tailoring. Nobody knows. The song didn’t either; it thinks it was always about them now. Full fee, and you’re home by ten.",
            "effects": { "skill": 5, "money": 150, "creativity": 3 }
          },
          "incredible": {
            "text": "The retooled version is BETTER — the wedding edit fixes the chorus you’d fought for years. You quietly re-record it your way, and both versions thrive: theirs in a tent, yours in your set, nobody the wiser but the song. The couple tips $60 for “capturing them so fast.” So fast. So very fast.",
            "effects": { "skill": 7, "creativity": 6, "money": 210, "cred": 3 }
          }
        }
      }
    }
  },
  {
    "id": "nw_uncle_bill",
    "act": [1, 2],
    "pathAffinity": [],
    "weight": 9,
    "pack": "pack_wedding",
    "art": "ev_nw_uncle_bill",
    "context": "An uncle. A hundred-dollar bill, folded lengthwise like a tiny canoe.",
    "prompt": "He materializes at the lip of the stage holding the hundred like a fishing lure. The request: a song he cannot name, from “the summer of ’88, maybe ’89,” which goes — and here he hums four notes that describe at least two hundred songs and one national anthem. “You know the one,” he says. He believes this completely.",
    "recap": "An uncle waves a hundred for a song he can only hum.",
    "tags": ["live", "social"],
    "choices": {
      "left": {
        "label": "Fake it from the hum",
        "governingStats": { "skill": 1, "creativity": 0.4 },
        "tags": ["live", "risky"],
        "outcomes": {
          "bad": {
            "text": "You build a confident, wrong song out of his four notes. He listens with narrowing eyes, pockets the canoe, and says “that’s not it, but you tried,” which stings more than booing. He tips you $20 for effort. The band calls you Summer of ’88 for a month.",
            "effects": { "skill": 2, "money": 20, "burnout": 5 }
          },
          "good": {
            "text": "Your third guess detonates something behind his eyes — THE ONE. He commandeers the dance floor, executes a move last performed in ’89, and lands it. The hundred is yours. So, apparently, is his loyalty: he requests you by name at the next three family weddings.",
            "effects": { "skill": 5, "money": 130, "network": 4 }
          },
          "incredible": {
            "text": "It’s not a real song. You realize mid-fake that you’re IMPROVISING his memory — so you commit, and build the whole thing live: verse, chorus, his sister’s name in the bridge on a gamble. Direct hit. He weeps into his lapels, presses the hundred plus its brother into your hand, and says “nobody’s played that in thirty years.” Nobody had ever played it.",
            "effects": { "skill": 7, "creativity": 7, "money": 200, "fame": 3 }
          }
        }
      },
      "right": {
        "label": "Negotiate him to a song you know",
        "governingStats": { "network": 1 },
        "tags": ["social", "safe", "live"],
        "outcomes": {
          "bad": {
            "text": "The negotiation lasts eleven minutes, spans three decades of music history, and ends in a compromise neither of you wants. He dances to it anyway, out of politeness, at half power. Half the hundred appears in the tip jar. You both know.",
            "effects": { "network": 2, "money": 50, "burnout": 4 }
          },
          "good": {
            "text": "You steer him from the phantom song to its cousin — same summer, same feeling, actual existence. Two bars in, he points at you like you’ve returned his wallet. The floor fills. The hundred lands in the jar flat and proud, unfolded, which from this man is a standing ovation.",
            "effects": { "network": 5, "money": 120, "cred": 2, "fame": 2 }
          },
          "incredible": {
            "text": "Your substitute song ignites the whole reception’s memory at once — suddenly every guest over fifty has a request from the same two years, and the hundred turns out to be the first bill of an avalanche. You play ’88 to ’89 for an hour. The uncle acts as your promoter, security, and hype man. Final take: the best wedding money of your year.",
            "effects": { "network": 7, "money": 240, "fame": 4, "burnout": 3 }
          }
        }
      }
    }
  },
  {
    "id": "nw_cousins",
    "act": 2,
    "pathAffinity": [],
    "weight": 9,
    "pack": "pack_wedding",
    "art": "ev_nw_cousins",
    "context": "A double reception. One tent divider. Through it: a saxophone, confident.",
    "prompt": "Two receptions, one huge tent, a canvas divider doing the work of a national border. On the other side: The Cousins — matching burgundy suits, four generations of wedding-band royalty, a horn section with a pension plan. Their bandleader pokes his head around the divider: “Volume situation. We can do this civilized, or we can do this GOOD.”",
    "recap": "A tent divider away: The Cousins, a wedding band with a horn section.",
    "tags": ["live", "band"],
    "choices": {
      "left": {
        "label": "Do this GOOD (volume war)",
        "governingStats": { "skill": 1, "creativity": 0.3 },
        "tags": ["live", "risky", "band"],
        "outcomes": {
          "bad": {
            "text": "You bring your best and The Cousins bring 1978 — a wall of horns, four-part harmony, a grandmother on tambourine who has buried better bands than yours. Both dance floors migrate to their side. Their bandleader sends over a plate of cake, which is somehow the most devastating move available to him.",
            "effects": { "skill": 3, "burnout": 6, "money": 70, "cred": -2 }
          },
          "good": {
            "text": "You trade haymakers through canvas for two hours — their horns, your hooks — and both dance floors stay full and FERAL, each side convinced they got the better wedding. At night’s end the divider comes down for one shared song. Both couples tip both bands. Diplomatic history.",
            "effects": { "skill": 6, "money": 160, "fame": 4, "network": 4 }
          },
          "incredible": {
            "text": "Somewhere around hour two the war becomes a set: call-and-response through the divider, horn answers to your choruses, two drummers locked without eye contact. Someone pulls the canvas, the receptions merge into one two-hundred-person floor, and The Cousins’ patriarch anoints you at full mic: “Kid’s got it.” In wedding-circuit terms this is a knighthood. Referrals for a year.",
            "effects": { "skill": 8, "money": 250, "network": 7, "fame": 6, "cred": 3 }
          }
        }
      },
      "right": {
        "label": "Propose an alliance",
        "governingStats": { "network": 1 },
        "tags": ["social", "safe", "deal"],
        "outcomes": {
          "bad": {
            "text": "The Cousins accept the alliance and then absorb you — suddenly you’re their auxiliary rhythm section, taking charts from a man named Uncle Bobby who counts in by nodding. It’s their show. Your own couple keeps squinting at the stage trying to find the band they hired. Paid in full, dissolved in full.",
            "effects": { "network": 3, "money": 90, "burnout": 5, "skill": 2 }
          },
          "good": {
            "text": "You split the night into shifts: they take the dinner sets, you take the dance floor, both bands sitting in on the big numbers. Their sax player teaches you the Wedding Nod — the tiny cue for “the couple’s about to cry, go soft NOW.” Trade secrets. Actual trade secrets.",
            "effects": { "network": 6, "money": 150, "skill": 4 }
          },
          "incredible": {
            "text": "The alliance outlives the tent: The Cousins book forty weddings a season and turn down half, and starting now the overflow has your number on it. “You didn’t try to beat us,” the patriarch says, tapping his temple, “that’s a Cousins move.” Steady money, wedding-circuit protection, and a standing invitation to sit in on horns night.",
            "effects": { "network": 9, "money": 200, "cred": 3, "fame": 3 }
          }
        }
      }
    }
  },
  {
    "id": "nw_divorce_party",
    "act": [2, 3],
    "pathAffinity": [],
    "weight": 9,
    "pack": "pack_wedding",
    "art": "ev_nw_divorce_party",
    "context": "Same ballroom. Same disco ball. A banner: FREE AT LAST (glitter)",
    "prompt": "Seven years ago you played this exact ballroom for this exact woman’s wedding. Tonight she’s booked you for the divorce party — same venue, same playlist, “but,” she specifies over the phone with terrifying calm, “new energy.” Her deposit arrived instantly. The first request on the sheet is the first-dance song, annotated: FASTER.",
    "recap": "Same ballroom you played her wedding — now the divorce party.",
    "tags": ["live", "social"],
    "choices": {
      "left": {
        "label": "Play the old playlist, weaponized",
        "governingStats": { "skill": 1, "creativity": 0.4 },
        "tags": ["live", "risky"],
        "outcomes": {
          "bad": {
            "text": "The double-time first-dance song lands wrong — half the room is liberated, half remembers the original too well, and one aunt leaves loudly through the wrong door. The guest of honor keeps dancing alone, sustained by pure conviction. She tips you anyway: “Not your fault. That song was always his.”",
            "effects": { "skill": 2, "money": 80, "burnout": 6 }
          },
          "good": {
            "text": "You play the wedding set at divorce tempo — every ballad up-shifted, every key brightened, the first-dance song reborn as a stomper — and the room DETONATES. She dances it solo in the center of a clapping circle, seven years of energy discharging safely into a rented floor. “Better than the wedding,” she yells. Everyone agrees. Everyone was at both.",
            "effects": { "skill": 6, "money": 180, "fame": 4, "creativity": 4 }
          },
          "incredible": {
            "text": "The reworked first-dance song becomes an event: guests film the transformation — same room, same band, same song, new woman — and the side-by-side edit travels far beyond the ballroom. By month’s end you’re fielding calls for divorce parties in three states at rates weddings would blush at. “New energy” goes on your invoice as a service tier.",
            "effects": { "skill": 8, "creativity": 7, "money": 250, "fame": 6, "network": 4 }
          }
        }
      },
      "right": {
        "label": "Curate the liberation setlist",
        "governingStats": { "creativity": 1 },
        "tags": ["live", "safe", "write"],
        "minigame": "setlist",
        "outcomes": {
          "bad": {
            "text": "Your artful arc — mourning into rage into joy — is interrupted at song two by the guest of honor commandeering the mic: “Skip to the rage.” You skip to the rage. The rest of your curation dies in the folder. The rage portion, to be fair, is a triumph.",
            "effects": { "creativity": 2, "money": 90, "burnout": 5 }
          },
          "good": {
            "text": "You build the night like a story — the sad ones early while the room fills, the reclamation anthem timed to the cake (shaped like a signed document), the closer chosen from her old request sheet, the one HE always vetoed. When it hits, she points at you across the room: you kept the receipts. Best tip of the season.",
            "effects": { "creativity": 6, "money": 170, "network": 3, "cred": 2 }
          },
          "incredible": {
            "text": "The setlist is so precisely engineered that the party achieves what she calls, misty and triumphant at 1 a.m., “closure with a beat.” Her lawyer — her LAWYER — books you for another client’s party on the spot, and floats a retainer. There is, it turns out, an entire economy of endings, and you are now its house band.",
            "effects": { "creativity": 8, "money": 240, "network": 6, "fame": 4, "burnout": -3 }
          }
        }
      }
    }
  },
  {
    "id": "nw_officiant",
    "act": 3,
    "pathAffinity": [],
    "weight": 9,
    "pack": "pack_wedding",
    "art": "ev_nw_officiant",
    "context": "A garden aisle, seated guests, no officiant. All eyes rotate to you.",
    "prompt": "The couple booked you as the surprise — the famous-ish musician at cousin Dana’s wedding. Then the officiant’s car dies two counties away, and it surfaces that you are technically ordained from a website, years ago, as a bit. The wedding planner grips your arm with the strength of the truly desperate: “You talk for a living. TALK.”",
    "recap": "The officiant’s stranded, and you’re technically ordained online.",
    "tags": ["live", "social"],
    "choices": {
      "left": {
        "label": "Officiate AND play",
        "governingStats": { "creativity": 1, "network": 0.3 },
        "tags": ["live", "risky", "vocal"],
        "outcomes": {
          "bad": {
            "text": "You are magnificent for eleven minutes and then blank on the groom’s name at the single most load-bearing moment of the ceremony. “Do you… you, sir…” The video exists. The marriage also exists — the county clerk confirms your paperwork was, miraculously, fine — but the toast writes itself and it’s about you.",
            "effects": { "creativity": 3, "money": 120, "burnout": 8, "fame": 3 }
          },
          "good": {
            "text": "You marry them like it’s a set: vows as verses, a key change where the kiss goes, the processional played by you sixty seconds after pronouncing you-may. The planner cries into her clipboard. Double fee — musician rate plus a clergy rate she invents on the spot and rounds up.",
            "effects": { "creativity": 7, "money": 220, "fame": 5, "network": 4 }
          },
          "incredible": {
            "text": "Mid-ceremony, on instinct, you sing the vows back to them — their own words, melodized in real time — and the garden comes apart. The clip escapes the wedding within hours: THE OFFICIANT IS THE BAND. Booking inquiries now arrive with a checkbox for “ceremony package.” You were ordained as a joke. The joke has a waiting list.",
            "effects": { "creativity": 10, "money": 250, "fame": 10, "network": 6 }
          }
        }
      },
      "right": {
        "label": "Stall with music, hunt an officiant",
        "governingStats": { "network": 1, "skill": 0.3 },
        "tags": ["live", "safe", "work"],
        "outcomes": {
          "bad": {
            "text": "Ninety minutes of ambient stalling. You play everything you know slowly while the planner cold-calls clergy like a bond trader. The eventual officiant — somebody’s neighbor, licensed, furious — performs the fastest wedding in county history. Guests remember mostly you, vamping, sweating, nodding reassuringly at strangers.",
            "effects": { "skill": 3, "money": 90, "burnout": 7 }
          },
          "good": {
            "text": "You turn the delay into an unplugged garden set and buy the planner a golden hour — enough to helicopter in (metaphorically; by rideshare) a retired judge from the guest list’s plus-ones. Ceremony saved, set legendary, and the couple’s album now includes forty minutes labeled THE WAIT (FEAT. YOU).",
            "effects": { "network": 5, "skill": 5, "money": 160, "cred": 3 }
          },
          "incredible": {
            "text": "During your stall set, a guest quietly stands: an actual minister, the groom’s childhood pastor, who “didn’t want to impose.” He officiates; you underscore the entire ceremony live like a film. The combination — his gravity, your score — is so devastating that three engaged guests book the two of you as a PACKAGE before the cake. The pastor splits fees fairly. The pastor has done this before.",
            "effects": { "network": 8, "money": 230, "fame": 6, "cred": 4, "burnout": -3 }
          }
        }
      }
    }
  },
  {
    "id": "ncr_buffet",
    "act": [2, 3],
    "pathAffinity": [],
    "weight": 9,
    "pack": "pack_cruise",
    "art": "ev_ncr_buffet",
    "context": "The Neptune Lounge, which is also, structurally, the buffet",
    "prompt": "Your “stage” shares a wall with the omelet station and the acoustics of a sneeze guard. The room’s natural soundscape: tongs, ice machine, the soft-serve unit’s low B-flat drone, a man announcing shrimp. The cruise director beams: “Two sets a night. The dinner crowd is very honest.”",
    "recap": "The Neptune Lounge shares a wall with the omelet station.",
    "tags": ["live", "work"],
    "choices": {
      "left": {
        "label": "Fight the room",
        "governingStats": { "skill": 1 },
        "tags": ["live", "risky", "practice"],
        "outcomes": {
          "bad": {
            "text": "You rearrange the monitors nightly, feud with the ice machine, and lose a week of your life to the tongs. The dinner crowd, very honest, keeps eating. On night six the soft-serve machine is serviced and comes back droning a NEW note, out of your key, on purpose, you are certain.",
            "effects": { "skill": 3, "burnout": 8, "money": 60 }
          },
          "good": {
            "text": "Night by night you carve a mix out of hostile territory — angles, baffles, a truce with the omelet chef about flip timing. By week two there’s a beat of actual silence after your closer. In the buffet, silence is a standing ovation with the lights on.",
            "effects": { "skill": 7, "money": 130, "cred": 4 }
          },
          "incredible": {
            "text": "You defeat the room so thoroughly that the ship’s engineer comes to study your monitor placement “for the manual.” Passengers start booking dinner around your sets; the maître d’ reports a waitlist. A waitlist. For the buffet. Corporate sends a commendation and, more importantly, moves you to the good lounge.",
            "effects": { "skill": 10, "money": 200, "cred": 6, "fame": 5, "network": 4 }
          }
        }
      },
      "right": {
        "label": "Write FOR the room",
        "governingStats": { "creativity": 1 },
        "tags": ["write", "indie", "safe"],
        "outcomes": {
          "bad": {
            "text": "Your suite composed in B-flat around the soft-serve drone is, by any objective measure, interesting. The dinner crowd files a comment card that says “music weird.” Another says “weird music.” The cruise director suggests, gently, “maybe some songs they know?” The drone, at least, respects you now.",
            "effects": { "creativity": 4, "burnout": 5, "money": 60 }
          },
          "good": {
            "text": "You tune the set to the room — the ice machine becomes a shaker, the tongs a hi-hat, the B-flat drone your pedal tone — and the buffet stops fighting you because you stopped fighting it. Diners start noticing they’re nodding. “Whatever you changed,” says the shrimp announcer, “keep it.”",
            "effects": { "creativity": 8, "money": 140, "cred": 5, "skill": 3 }
          },
          "incredible": {
            "text": "The buffet suite becomes a cult object: a food blogger aboard writes “Dinner Music, Reconsidered,” the piece travels, and suddenly critics on land are discussing your “site-specific composition practice.” The cruise line, smelling prestige, commissions a piece for the atrium. You are now, professionally, the person who made a buffet sing.",
            "effects": { "creativity": 12, "money": 220, "cred": 8, "fame": 6 }
          }
        }
      }
    }
  },
  {
    "id": "ncr_captain",
    "act": [2, 3],
    "pathAffinity": [],
    "weight": 9,
    "pack": "pack_cruise",
    "art": "ev_ncr_captain",
    "context": "The bridge. The captain, holding your album like a summons.",
    "prompt": "Every night at eight the captain addresses the ship, and every night he ends with a song request for the lounge act. Tonight he summons you to the bridge, taps your album, and makes it known — with the gravity of a man legally empowered to perform marriages and burials — that tomorrow he would like to SING one. With you. Over the all-ship PA.",
    "recap": "The captain summons you to the bridge and wants to sing.",
    "tags": ["live", "social"],
    "choices": {
      "left": {
        "label": "Let the captain sing",
        "governingStats": { "network": 1 },
        "tags": ["social", "risky", "vocal"],
        "outcomes": {
          "bad": {
            "text": "The captain’s baritone is a proud, unseaworthy vessel. He sails it directly into your bridge — the musical one — and sinks. Three thousand passengers hear it. He emerges beaming: “We’ll do another tomorrow.” You are now, per maritime tradition apparently, a duo.",
            "effects": { "network": 3, "burnout": 7, "money": 80, "fame": 2 }
          },
          "good": {
            "text": "You transpose down a fourth, coach him through the verse at dawn, and at eight p.m. the captain sings your song to his ship — rough, sincere, weirdly moving over the deck speakers at sea. Passengers request “the captain’s song” all week. He grants you dinner at his table, which aboard this vessel is a peerage.",
            "effects": { "network": 7, "money": 150, "fame": 6, "cred": 3 }
          },
          "incredible": {
            "text": "The duet becomes ship legend and the captain, in gratitude, does something no bonus could: he unlocks a storage hold and shows you the gear a lounge legend abandoned aboard in 1977 — flight-cased, mint, mythical. “The ship keeps what the sea sends,” he says, incorrectly but generously. “It’s yours.” Passengers cheer you both at the midnight buffet.",
            "effects": { "network": 10, "money": 180, "fame": 8, "grantGear": "random_good" }
          }
        }
      },
      "right": {
        "label": "Steer him into a duet on your terms",
        "governingStats": { "skill": 1, "creativity": 0.3 },
        "tags": ["live", "safe", "vocal"],
        "outcomes": {
          "bad": {
            "text": "Your careful arrangement — captain on two lines only, both spoken — reads to him as mutiny. He performs his two lines with the wounded dignity of a demoted admiral, then reassigns your set time to opposite the ice-carving demonstration. The ice guy is very popular. You know what you did.",
            "effects": { "skill": 3, "burnout": 6, "money": 70 }
          },
          "good": {
            "text": "You build him a part he cannot sink: call-and-response, his lines mostly nautical commands, which he delivers with devastating natural authority. The crowd goes overboard (figuratively; announced twice). The captain, triumphant, extends your contract on the spot at a rate he invents with captain’s privilege.",
            "effects": { "skill": 6, "money": 190, "network": 5, "fame": 4 }
          },
          "incredible": {
            "text": "The arrangement is so good it escapes the ship: a passenger’s video of the captain barking “ALL AHEAD FULL” in perfect rhythm inside your chorus becomes the cruise line’s most-shared post ever. Corporate wants it as an ad. The captain wants writing credit. You negotiate both from a deck chair, at sea, unreachable, at your leisure.",
            "effects": { "skill": 8, "creativity": 6, "money": 250, "fame": 10, "network": 6 }
          }
        }
      }
    }
  },
  {
    "id": "ncr_storm_deck",
    "act": [2, 3],
    "pathAffinity": [],
    "weight": 9,
    "pack": "pack_cruise",
    "art": "ev_ncr_storm_deck",
    "context": "Deck 11. Weather advisory. Nine passengers who did not get the memo, or got it and came anyway.",
    "prompt": "The deck party is canceled — forty-knot gusts, horizontal drizzle, the ocean in a mood. But nine passengers are already up there, gripping the rail, and something in how they’re standing tells you the truth: it’s the grief cruise crowd. The widower from deck 4. The sisters scattering their mother Tuesday. They didn’t come for a party. They came because the cabin was too quiet.",
    "recap": "Deck 11 in a storm, nine passengers from the grief cruise waiting.",
    "tags": ["live", "family"],
    "choices": {
      "left": {
        "label": "Play the storm set",
        "governingStats": { "cred": 1, "creativity": 0.4 },
        "tags": ["live", "risky", "solo"],
        "outcomes": {
          "bad": {
            "text": "The wind eats every third word and eventually takes a cymbal over the rail like a tithe. Security shuts it down four songs in, citing “everything.” But the widower shakes your hand with both of his before you’re herded inside, and holds on one beat longer than politeness. Worth the cymbal. Not the write-up.",
            "effects": { "cred": 5, "burnout": 8, "money": -60, "creativity": 3 }
          },
          "good": {
            "text": "You play small and low into the weather, nine people in a half-circle blocking the wind for you and each other. No mics, no set list, songs about staying and leaving. The sisters request nothing; they just stand closer. Afterward nobody claps. Everybody nods. It’s the right review.",
            "effects": { "cred": 9, "creativity": 7, "burnout": 4, "fame": 3 }
          },
          "incredible": {
            "text": "Mid-set the storm briefly opens — an unearned, cinematic seam of moonlight on black water — and you play into it while nine strangers hold the rail and cry salt into salt. Ship folklore is born by breakfast. For the rest of the cruise, people you’ve never met touch your shoulder in hallways. The widower mails you a letter months later: he plays music in the kitchen again. That one goes in the box you keep forever.",
            "effects": { "cred": 14, "creativity": 10, "fame": 6, "network": 4, "burnout": -4 }
          }
        }
      },
      "right": {
        "label": "Move everyone to the library",
        "governingStats": { "network": 1 },
        "tags": ["live", "safe", "home"],
        "outcomes": {
          "bad": {
            "text": "The library is warm, dry, and haunted by a bridge tournament that will not yield territory. You play whisper-volume in the atlas corner while a man declares “two no trump” over your best song. The nine appreciate it. The bridge players file a noise complaint. About an acoustic guitar. In a library. At sea.",
            "effects": { "network": 3, "burnout": 5, "money": 60 }
          },
          "good": {
            "text": "Armchairs in a circle, rain on the portholes, tea from the night steward who refuses payment. You play two hours of quiet songs while the storm audits the windows. The sisters tell you about their mother between numbers, and the songs after that are for her, and everyone knows it without it being said.",
            "effects": { "network": 6, "cred": 7, "burnout": -5, "money": 90 }
          },
          "incredible": {
            "text": "The library set becomes a nightly institution — passengers start calling it Quiet Hour, the steward reserves your chair, and word reaches exactly the right person: a grief counselor aboard who consults for the cruise line. She wants Quiet Hour on every ship in the fleet, designed by you, licensed from you. The contract that follows is the gentlest money you will ever make.",
            "effects": { "network": 10, "cred": 8, "money": 230, "fame": 5, "burnout": -5 }
          }
        }
      }
    }
  },
  {
    "id": "ncr_talent_show",
    "act": [2, 3],
    "pathAffinity": [],
    "weight": 9,
    "pack": "pack_cruise",
    "art": "ev_ncr_talent_show",
    "context": "The Poseidon Theater. Judges’ table. A scorecard and a complimentary lanyard.",
    "prompt": "You’re judging the passenger talent show between a juggler, a comedy hypnotist, and the cruise director’s niece (interpretive dance, heavily favored, related to management). Then contestant eight: a silver-haired retiree in orthopedic sneakers plugs in a road-worn guitar and, without preamble, SHREDS — real, vicious, dust-blowing-off-of-it shredding. The theater loses its mind. The cruise director’s smile does not reach his eyes.",
    "recap": "Judging the talent show, and contestant eight plugs in a road case.",
    "tags": ["social", "live"],
    "choices": {
      "left": {
        "label": "Score it honest. Crown the retiree.",
        "governingStats": { "cred": 1 },
        "tags": ["social", "risky"],
        "outcomes": {
          "bad": {
            "text": "You crown the retiree and the cruise director enters a cold war: your set times migrate to nap hours, your drink tickets expire mysteriously, the spotlight operator develops a tremor only during your shows. The retiree finds you at the rail and says “worth it.” The retiree is not the one playing the 3 p.m. slot.",
            "effects": { "cred": 6, "burnout": 7, "money": -40 }
          },
          "good": {
            "text": "Justice lands to a standing ovation the niece’s routine did not risk. The retiree — Arlene, retired dental hygienist, forty years of woodshedding in a spare room — takes the trophy like she’s been ready since 1985. She has. The passengers adore you for it, and passengers write comment cards corporate actually reads.",
            "effects": { "cred": 8, "fame": 5, "network": 5, "money": 100 }
          },
          "incredible": {
            "text": "Over sea days it comes out: Arlene played sessions in the seventies — uncredited, on records you OWN — then walked away when the credits kept walking away from her. You spend the rest of the cruise trading licks with a ghost from your own liner notes. She shows you the trick that fixed your weakest transition forever, and makes you promise one thing: “Take the credit. Every time.”",
            "effects": { "cred": 10, "skill": 9, "network": 8, "fame": 4, "burnout": -4 }
          }
        }
      },
      "right": {
        "label": "Split the crown, keep the peace",
        "governingStats": { "network": 1 },
        "tags": ["social", "safe", "deal"],
        "outcomes": {
          "bad": {
            "text": "The tie satisfies no one: the theater boos the diplomacy, the niece knows, the cruise director’s gratitude has the warmth of a service elevator, and Arlene congratulates her co-champion with a graciousness that makes it worse. A teenager in row three films your face during the announcement. The caption is unkind and accurate.",
            "effects": { "network": 3, "cred": -4, "burnout": 6, "money": 80 }
          },
          "good": {
            "text": "You engineer a shared crown with separate honors — Arlene takes “Musicianship,” the niece takes “Artistry,” everyone takes photos. The cruise director owes you visibly, which on a ship is currency: prime set times, the good cabin, an open tab at the juice bar. Arlene winks at you at breakfast. She’s played politics before too.",
            "effects": { "network": 7, "money": 150, "fame": 3, "burnout": -3 }
          },
          "incredible": {
            "text": "Your diplomatic masterstroke — a finale where Arlene shreds UNDER the niece’s dance, an act you invent at the judges’ table in real time — brings the house down twice and gets both families crying for different reasons. Corporate hears about the judge who turned a scandal into a showstopper, and the entertainment director title they float is salaried, seasonal, and negotiable from land.",
            "effects": { "network": 10, "money": 200, "fame": 6, "creativity": 5, "cred": 3 }
          }
        }
      }
    }
  },
  {
    "id": "ncr_intl_waters",
    "act": [2, 3],
    "pathAffinity": [],
    "weight": 9,
    "pack": "pack_cruise",
    "art": "ev_ncr_intl_waters",
    "context": "Twelve nautical miles out. The ship photographer’s cabin studio. A flag app, consulted.",
    "prompt": "The ship’s photographer moonlights as an engineer and has built a shockingly good rig in his cabin. His pitch, delivered at whisper volume: “We’re in international waters. No publishing law applies out here.” This is not really how any of that works, and you both know it, and the rig is warm, and the sea is flat, and you have a song that’s been circling the boat for days.",
    "recap": "The ship photographer’s cabin studio, twelve miles out. “No law here.”",
    "tags": ["studio", "record"],
    "choices": {
      "left": {
        "label": "Track the new one at sea",
        "governingStats": { "creativity": 1, "skill": 0.4 },
        "tags": ["studio", "write", "safe"],
        "minigame": "take",
        "outcomes": {
          "bad": {
            "text": "The take is gorgeous until the ship’s stabilizers kick on and gift your quietest verse a low-frequency shudder no plugin can evict. The photographer calls it “the ocean’s part.” You keep a rough of the wreck anyway — under the shudder, the song is THERE, and the song is what you came for.",
            "effects": { "creativity": 4, "burnout": 4, "skill": 2, "writeSong": true }
          },
          "good": {
            "text": "Something about recording in a place that belongs to no country unlocks the take: the song arrives whole, salt in its lungs, engine hum sitting under it like a drone you’d have paid for. The photographer refuses money and requests one print credit: “Recorded at sea.” Granted. Forever.",
            "effects": { "creativity": 9, "skill": 4, "cred": 5, "writeSong": true }
          },
          "incredible": {
            "text": "The take of your life, twelve miles from any law that was never going to notice you anyway. When it surfaces on land, the origin story does half the promotion by itself — RECORDED IN A CABIN, AT NIGHT, IN NO NATION — and an engineer-lore blog canonizes the photographer, who becomes your engineer for life over his employer’s objections. The sea, as promised, keeps what it’s sent.",
            "effects": { "creativity": 12, "skill": 6, "fame": 8, "cred": 8, "money": 150, "writeSong": true }
          }
        }
      },
      "right": {
        "label": "Cut the lawless covers EP",
        "governingStats": { "skill": 1, "network": 0.3 },
        "tags": ["record", "risky", "deal"],
        "outcomes": {
          "bad": {
            "text": "The “no law out here” theory survives exactly nine days on land before a politely apocalyptic email arrives from a publisher’s enforcement bot. The EP comes down; the takedown notice, framed by the photographer, stays up in his cabin. You made $210 in nine days and a very educational memory.",
            "effects": { "skill": 3, "money": -80, "burnout": 7, "cred": 2 }
          },
          "good": {
            "text": "You cut eight covers in two nights, loose and salty, and sell them at the merch table as A PIRATE RECORDING (ALLEGEDLY) — a title that does more work than any marketing you’ve ever paid for. Passengers buy them as souvenirs. Lawyers, if any hear it, are charmed into silence. Nine days of cash, zero consequences, one legend.",
            "effects": { "skill": 6, "money": 190, "fame": 4, "network": 3 }
          },
          "incredible": {
            "text": "One cover — your dead-slow, half-time gutting of a beloved standard — leaks off the boat and detonates: the original’s SONGWRITER hears it, loves it, and blesses it publicly, which converts your legal problem into a co-sign. The blessed version goes up everywhere, laws intact, story attached. “Recorded beyond jurisdiction, released by permission” is, everyone agrees, the coolest possible fine print.",
            "effects": { "skill": 9, "fame": 12, "cred": 8, "money": 250, "network": 6 }
          }
        }
      }
    }
  },
  {
    "id": "nr_split_bill",
    "act": [1, 2],
    "pathAffinity": [],
    "weight": 10,
    "art": "ev_nr_split_bill",
    "context": "A promoter, avoiding eye contact. A poster with two names in the same font size.",
    "prompt": "The promoter double-booked the night and has rebranded the accident as a “CO-HEADLINE EVENT”: you and {rival}, one stage, one green room, one deli tray with a single sad sandwich already missing. {rival} arrives, reads the poster, reads the room, and sets their case down on exactly half of the couch.",
    "recap": "One stage double-booked, rebranded a “co-headline event” with {rival}.",
    "tags": ["live", "rival"],
    "choices": {
      "left": {
        "label": "Split everything fairly",
        "governingStats": { "network": 1 },
        "tags": ["rival", "social", "safe"],
        "outcomes": {
          "bad": {
            "text": "The peace holds right up until the encore, which the crowd demands from BOTH of you, and which neither of you prepared for because you were busy being adults about the deli tray. The joint encore is a polite trainwreck in two keys. You split the blame fairly too.",
            "effects": { "network": 3, "burnout": 5, "money": 60, "rivalry": 1 }
          },
          "good": {
            "text": "You alternate sets, share the good monitor, and split the door to the dollar. Backstage, on neutral couch territory, you compare promoter horror stories for an hour and laugh more than either of you will admit later. The feud isn’t over. But it took the night off.",
            "effects": { "network": 6, "money": 110, "cred": 4, "rivalry": -1 }
          },
          "incredible": {
            "text": "The night ends with an unplanned two-song collision — their closer into yours, no rehearsal, pure listening — that outdraws both catalogs. The crowd chants both names in alternation like a tennis match. You and {rival} agree, in the alley after, to never speak of how well that went. The scene speaks of nothing else.",
            "effects": { "network": 8, "fame": 9, "cred": 6, "money": 150, "rivalry": -1 }
          }
        }
      },
      "right": {
        "label": "Make it a competition",
        "governingStats": { "skill": 1, "creativity": 0.3 },
        "tags": ["rival", "risky", "live"],
        "outcomes": {
          "bad": {
            "text": "You play the set of your month; {rival} plays the set of their year. The crowd’s verdict is unspoken but unanimous, and involves them buying {rival}’s merch in a line that bends past your table. {rival} sends you a bottle of decent whiskey with a note: “Good pressure.” The whiskey helps. The note doesn’t.",
            "effects": { "skill": 4, "burnout": 7, "money": 40, "rivalry": 1 }
          },
          "good": {
            "text": "The unofficial contest lifts both sets into rare air — you close with the risky one and STICK it, and the room splits down the middle in the best way: everyone leaves arguing, which means everyone leaves talking. The promoter, a man who fell into a gold mine, books the “rematch” before load-out.",
            "effects": { "skill": 7, "fame": 8, "money": 120, "cred": 4, "rivalry": 1 }
          },
          "incredible": {
            "text": "You win the room outright — not on flash, on the quiet one, pin-drop, phones DOWN — and even {rival}’s own crowd knows it. {rival} finds you at load-out and says the worst thing a rival can say: “That was better than mine tonight,” which is somehow a declaration of war and the highest compliment of your career in one sentence. The rematch sells out in a day.",
            "effects": { "skill": 10, "fame": 12, "cred": 8, "money": 180, "rivalry": 1 }
          }
        }
      }
    }
  },
  {
    "id": "nr_understudy",
    "act": [2, 3],
    "pathAffinity": [],
    "weight": 10,
    "art": "ev_nr_understudy",
    "context": "A venue calendar screenshot, sent by three people at once",
    "requires": { "rivalIs": "understudy" },
    "prompt": "The Understudy has announced a show for next week performing — per the flyer, in your exact setlist font — songs from YOUR unreleased set. The set you’ve played for no one. The set that exists in your notebook, your practice room, and the ears of maybe five trusted people. The Understudy learned your act by watching. Apparently they’ve been watching somewhere very, very close.",
    "recap": "The Understudy announces a show of your unreleased set.",
    "tags": ["rival", "social"],
    "choices": {
      "left": {
        "label": "Hunt the mole",
        "governingStats": { "network": 1 },
        "tags": ["rival", "risky", "social"],
        "outcomes": {
          "bad": {
            "text": "Five trusted people, five interrogations, zero moles — turns out the practice room shares a heating duct with a storage unit, and The Understudy simply rented it. Your investigation, meanwhile, has insulted everyone you trust. The apology tour costs more than the leak did.",
            "effects": { "network": -4, "burnout": 9, "creativity": 2, "rivalry": 1 }
          },
          "good": {
            "text": "You trace it in three days: the open mic where you tested one song, ONCE — The Understudy was in the back, hood up, phone out, the whole time. You show up to their show and sit front row, arms crossed. They play everything a half-step wrong and sweat through the encore. Word circulates: the copy degrades. See the original.",
            "effects": { "network": 6, "cred": 7, "fame": 5, "rivalry": 1 }
          },
          "incredible": {
            "text": "The hunt turns up something better than a mole: The Understudy’s own rough recordings of your songs, posted early to build hype — timestamped BEFORE your notebook dates could prove authorship, except your five trusted people are five sworn witnesses with receipts. The scene watches the whole theft collapse in public. Your unreleased set now has the best promotion in music: everyone knows it was worth stealing.",
            "effects": { "network": 8, "cred": 10, "fame": 12, "rivalry": 2 }
          }
        }
      },
      "right": {
        "label": "Shrug. Let them cover the old you.",
        "governingStats": { "creativity": 1 },
        "tags": ["rival", "write", "safe"],
        "outcomes": {
          "bad": {
            "text": "Rising above it reads, to the scene, as conceding it. The Understudy’s show sells out; their version of your best unreleased chorus becomes the version people hum. You now face the singular horror of being asked whether YOU will cover THEM. You write angrily. It doesn’t rhyme yet.",
            "effects": { "creativity": 4, "burnout": 8, "fame": 2, "rivalry": 1 }
          },
          "good": {
            "text": "You skip the drama and spend the week writing the NEXT set — the one nobody can have seen, built in a borrowed room with the blinds down. The Understudy performs your past to a decent crowd; you quietly outgrow it in real time. When the two sets eventually meet in public, only one of them is alive.",
            "effects": { "creativity": 9, "cred": 6, "burnout": -4, "rivalry": 0 }
          },
          "incredible": {
            "text": "The shrug becomes doctrine: “They can have the setlist. They can’t have the next one.” The quote travels, the new material arrives white-hot, and The Understudy — locked forever one set behind, a tribute act to a moving target — becomes your unpaid advance team. Their crowd shows up at your next gig to hear where the songs COME from. You play none of the stolen set. Nobody misses it.",
            "effects": { "creativity": 12, "cred": 9, "fame": 8, "burnout": -4, "rivalry": 1 }
          }
        }
      }
    }
  },
  {
    "id": "nr_kudzu",
    "act": [2, 3],
    "pathAffinity": [],
    "weight": 10,
    "art": "ev_nr_kudzu",
    "context": "A tagged post: “new flip 🌿” — and, underneath, your own hands",
    "requires": { "rivalIs": "kudzu" },
    "prompt": "DJ Kudzu has released a remix of your soundcheck — the aimless noodling you played to test the monitors, secretly recorded from the floor, chopped over a beat, and titled like it was a collaboration. It is, and this is the infuriating part, GOOD. It’s charting-adjacent. Playlists have found it. Your name is in the credits as “source (organic).”",
    "recap": "DJ Kudzu chopped your soundcheck into a charting remix.",
    "tags": ["rival", "record"],
    "choices": {
      "left": {
        "label": "Claim the credit, lawyered",
        "governingStats": { "network": 1 },
        "tags": ["rival", "deal", "safe"],
        "outcomes": {
          "bad": {
            "text": "The legal letter works: proper credit, back royalties, a formal apology drafted by someone billing hourly. It also freezes the track’s momentum solid — playlists drop it during the dispute, and the internet’s sympathy drifts to Kudzu, who posts the letter with the caption “the ORGANIC has representation now.” You won. It has the texture of losing.",
            "effects": { "network": 3, "money": 120, "fame": -3, "burnout": 6, "rivalry": 1 }
          },
          "good": {
            "text": "Your lawyer-adjacent friend drafts something firm but civilized, and Kudzu — who has clearly done this before — folds instantly into a proper split: your name up front, royalties flowing, the track relisted as a true collab. The charting-adjacent thing becomes charting-actual with both fanbases pushing it. You still can’t remember playing the melody. It pays you monthly now.",
            "effects": { "network": 6, "money": 200, "fame": 8, "cred": 4 }
          },
          "incredible": {
            "text": "The negotiation lands you something better than back pay: a proper session, contracted, daylight, both names even. And the wild part — with actual intent behind it, the two of you are better than the bootleg. The follow-up single eclipses the stolen one, the stolen one becomes “the demo,” and the whole saga reads, in retrospect, like a heist that turned into a marriage. Kudzu still records your soundchecks. It’s in the contract now. So is your cut.",
            "effects": { "network": 9, "money": 280, "fame": 12, "cred": 6, "rivalry": -1 }
          }
        }
      },
      "right": {
        "label": "Steal it back louder",
        "governingStats": { "creativity": 1, "skill": 0.3 },
        "tags": ["rival", "risky", "record"],
        "outcomes": {
          "bad": {
            "text": "Your counter-flip — a remix of their remix of your noodling — is conceptually devastating and musically fine. The internet, which cares about one of those things, keeps streaming the original theft. Somewhere in the recursion the melody stops belonging to anyone, which the forum kids call “the kudzu effect,” which means Kudzu wins the taxonomy too.",
            "effects": { "creativity": 4, "burnout": 7, "fame": 3, "rivalry": 1 }
          },
          "good": {
            "text": "You take the noodle back to the woodshed and return with the FULL SONG the noodling was always trying to be — verse, chorus, the works — released with the caption “heard someone found my rough draft.” The scene eats it alive. Both tracks feed each other up the charts, and the beef becomes the best A&R either of you has ever had.",
            "effects": { "creativity": 9, "fame": 10, "cred": 6, "money": 130, "rivalry": 1 }
          },
          "incredible": {
            "text": "Your reclamation is so decisive — the finished song swallowing the remix whole, THEIR drop appearing in YOUR bridge for one bar like a trophy on a wall — that Kudzu concedes in public: “ok that’s how you flip a flip. taught by the source 🌿.” The exchange enters scene folklore as The Reclaiming. Both tracks chart. Yours charts higher. The soundboard guy who let Kudzu record from the floor would like everyone to stop asking about it.",
            "effects": { "creativity": 12, "fame": 14, "cred": 9, "money": 180, "rivalry": 1 }
          }
        }
      }
    }
  },
  {
    "id": "nr_cold_open",
    "act": [2, 3],
    "pathAffinity": [],
    "weight": 10,
    "art": "ev_nr_cold_open",
    "context": "{rival}, in your doorway, holding demos and visible nerves",
    "requires": { "rivalryMax": 2 },
    "prompt": "The feud cooled a while ago; what’s left is something neither of you has named. Now {rival} is at your door with a hard drive and a speech they’ve clearly rehearsed in the car: they want YOU to produce their record. “You’re the only one who hates my bad habits as much as I do,” they say. “That’s producing, right?” It is. That’s exactly what it is.",
    "recap": "{rival} at your door with a hard drive, asking you to produce.",
    "tags": ["rival", "studio"],
    "choices": {
      "left": {
        "label": "Produce their record",
        "governingStats": { "skill": 1, "network": 0.4 },
        "tags": ["rival", "studio", "risky"],
        "outcomes": {
          "bad": {
            "text": "Week two, the old friction finds the studio door: you push, they plant, and one long Tuesday ends with the two of you arguing about a hi-hat with a heat that has nothing to do with the hi-hat. The record survives; the sessions end formal. It’s good. It could have been the other thing.",
            "effects": { "skill": 4, "money": 100, "burnout": 8, "rivalry": 1 }
          },
          "good": {
            "text": "It works the way it was always going to work: you know exactly where they flinch, and they trust you enough to be told. The record is the best thing they’ve made, and everyone who hears it can tell someone finally got them to stop doing the thing. In the credits: your name, and under it, in small type they insisted on, “finally.”",
            "effects": { "skill": 7, "network": 6, "money": 180, "cred": 6, "rivalry": -1 }
          },
          "incredible": {
            "text": "The sessions turn into the thing musicians chase whole careers: total candor, zero politics, two people who spent years studying each other’s weaknesses now aiming all of it at the songs. The record lands as a critical event, and the story under the story — RIVALS, RECONCILED, IN THE CREDITS — carries it further. At the release show {rival} thanks you from stage, voice cracking on your name. The feud is over. Something rarer is running in its place.",
            "effects": { "skill": 10, "network": 9, "money": 250, "cred": 10, "fame": 6, "rivalry": -1 }
          }
        }
      },
      "right": {
        "label": "Decline. Protect your own season.",
        "governingStats": { "creativity": 1 },
        "tags": ["rival", "solo", "safe"],
        "outcomes": {
          "bad": {
            "text": "You say no gently and mean it kindly, and watch it land like neither. {rival} nods too many times, takes the hard drive back, and produces the record with someone who lets them keep every bad habit. It does fine. The doorway conversation replays at odd hours. You got your season. It cost a door.",
            "effects": { "creativity": 4, "burnout": 6, "rivalry": 1 }
          },
          "good": {
            "text": "You decline the chair but not the record: you take the drive for one weekend and return it with nine pages of notes — every flinch flagged, every fix sketched, the produce-by-mail version of a decade of paying attention. {rival} follows every note. The thank-you in the liner notes is one line long and says more than the speech did. Your own season, meanwhile, stays yours.",
            "effects": { "creativity": 8, "network": 4, "cred": 5, "burnout": -4, "rivalry": -1 }
          },
          "incredible": {
            "text": "Your no comes with a counteroffer neither of you saw coming until you said it: “Not your producer. Your B-side.” One split single — one song each, same theme, released together — small enough to protect your season, sharp enough to mean something. It outsells both your last releases combined. The sleeve shows two chairs, back to back. The scene finally has its answer about you two, and the answer is a record.",
            "effects": { "creativity": 11, "fame": 9, "cred": 8, "money": 150, "rivalry": -1 }
          }
        }
      }
    }
  },
  {
    "id": "nr_hot_ten",
    "act": 3,
    "pathAffinity": [],
    "weight": 10,
    "art": "ev_nr_hot_ten",
    "context": "A release calendar. Two names. One Friday. Zero coincidence.",
    "requires": { "rivalryMin": 7, "chartingMin": 1, "songsMin": 1 },
    "prompt": "{rival} has moved their album to YOUR release week — confirmed by their own label’s newsletter, which uses the word “showdown” twice and a boxing glove emoji once. “{song}” versus their lead single, same Friday, same chart, on purpose. Your phone is a casino floor. The scene has already printed unofficial fight posters. Somebody is taking actual bets.",
    "recap": "{rival} moved their album to your release week. On purpose.",
    "tags": ["rival", "fame"],
    "choices": {
      "left": {
        "label": "Go to war. Full campaign.",
        "governingStats": { "network": 1, "creativity": 0.3 },
        "tags": ["rival", "risky", "mainstream"],
        "outcomes": {
          "bad": {
            "text": "You empty the war chest — ads, premieres, a launch event with a regrettable ice sculpture — and Friday comes back split: they take the chart by a nose, you take the reviews by a mile, and the accountants take everything else. The fight posters sell better than either record. Neither label mentions the boxing glove again.",
            "effects": { "money": -200, "fame": 8, "burnout": 10, "cred": 3, "rivalry": 1 }
          },
          "good": {
            "text": "You fight it properly — targeted push, the good remix held back for week two like ammunition, a midnight livestream that out-draws their launch party. “{song}” edges them by Sunday and holds. The scene calls the whole week THE FRIDAY WAR and prints commemorative shirts with both names, which both camps buy, which everyone pretends not to find funny.",
            "effects": { "money": 150, "fame": 14, "cred": 6, "hypeSong": 25, "rivalry": 1 }
          },
          "incredible": {
            "text": "The war goes so public it stops being yours: morning shows pick it up, neutral fans pick sides recreationally, and Friday detonates into the biggest week either of you has ever had — with “{song}” on top, undisputed, by a margin nobody can spin. {rival} concedes with a single posted photo: white flag, drawn on a setlist, in your font. Frame it. You’ve earned one trophy in this feud nobody can argue with.",
            "effects": { "money": 300, "fame": 18, "cred": 8, "hypeSong": 30, "hits": 1, "rivalry": 1 }
          }
        }
      },
      "right": {
        "label": "Stay above it. Let the song fight.",
        "governingStats": { "cred": 1 },
        "tags": ["rival", "safe", "indie"],
        "outcomes": {
          "bad": {
            "text": "Dignity, it turns out, does not chart. {rival}’s machine rolls through the week unopposed while you post nothing and say less, and the narrative calcifies: they won, you hid. The song deserved a cornerman. You watch the numbers from a quiet room, above it, alone with the exact size of the high road.",
            "effects": { "cred": 4, "fame": -4, "burnout": 8, "rivalry": 1 }
          },
          "good": {
            "text": "You do exactly one thing all week: play the song, live, beautifully, and let the clip speak. Against {rival}’s full-scale campaign it holds — a close Friday, a split decision — and something better accrues underneath: while their push looks like marketing, yours looks like music. The bets pay out ambiguously. The song comes out bigger than the fight.",
            "effects": { "cred": 10, "fame": 8, "money": 100, "rivalry": 0 }
          },
          "incredible": {
            "text": "Your silence becomes the story. While {rival} shadowboxes an opponent who won’t enter the ring, you play a single unannounced show — no press, one camera, “{song}” last — and the footage quietly eats their entire campaign. The chart splits the week; the culture doesn’t. “One of them released an album,” writes the critic everyone reads. “The other one released a moment.” {rival}, to their credit, reposts it. War over. Nobody surrendered. You just won.",
            "effects": { "cred": 14, "fame": 12, "money": 150, "burnout": -4, "rivalry": -1 }
          }
        }
      }
    }
  },
  {
    "id": "nr_nemesis_toast",
    "act": 3,
    "pathAffinity": [],
    "weight": 10,
    "art": "ev_nr_nemesis_toast",
    "context": "An industry dinner in your honor. {rival} stands. Taps the glass. Smiles.",
    "requires": { "nemesis": true },
    "prompt": "Three careers, same face across the room. Tonight the industry is toasting YOU, and the organizers — historians of nothing — have invited {rival} to speak. They rise, {rivalVibe} to the last thread, and deliver a toast that is 60% threat by volume: “To the only one who ever made me better… by making everything harder. May the last act be worthy of the first.” Every eye in the room swings to you. Your glass is already in your hand.",
    "recap": "The industry toasts you, and {rival} takes the mic to speak.",
    "tags": ["rival", "fame"],
    "choices": {
      "left": {
        "label": "Toast back. Match the threat exactly.",
        "governingStats": { "creativity": 1, "cred": 0.4 },
        "tags": ["rival", "risky", "social"],
        "outcomes": {
          "bad": {
            "text": "Your counter-toast lands one degree too hot — the line about their second album gets a gasp where you’d budgeted a laugh — and the room’s temperature drops into contract-negotiation range. {rival} inclines their glass a precise centimeter, filing everything. The trade papers call the evening “bracing.” Your publicist calls it other things.",
            "effects": { "creativity": 4, "cred": 3, "fame": 5, "burnout": 9, "rivalry": 1 }
          },
          "good": {
            "text": "You return fire in kind — sixty percent threat, forty percent tribute, every line reverse-engineered from three careers of scar tissue — and the room realizes it’s watching the rarest act in the industry: two people who understand each other completely and forgive it in public. The dual toast gets written up as performance art. Neither of you confirms or denies.",
            "effects": { "creativity": 8, "cred": 8, "fame": 10, "network": 5, "rivalry": 1 }
          },
          "incredible": {
            "text": "Your toast is so exactly calibrated — their own words from the first career, quoted back with the ending they never saw coming — that {rival} breaks composure for the first time in three acts: a real laugh, ugly and involuntary, in front of the entire industry. The two toasts circulate as a single clip titled THE LAST GREAT FEUD. Offers arrive for a joint tour, a documentary, a duel album. You and {rival} decline everything, together, in one co-signed sentence. The mystery is worth more.",
            "effects": { "creativity": 12, "cred": 10, "fame": 16, "network": 8, "rivalry": 1 }
          }
        }
      },
      "right": {
        "label": "Cross the room. Embrace them.",
        "governingStats": { "network": 1 },
        "tags": ["rival", "safe", "social"],
        "outcomes": {
          "bad": {
            "text": "You go in for history; they receive it like a subpoena. The embrace lasts four seconds, three of them rigid, while the room applauds a reconciliation neither party is having. “Sixty percent,” they murmur into your shoulder, “was generous.” The photos look wonderful. The photos are lying.",
            "effects": { "network": 3, "fame": 6, "burnout": 7, "rivalry": 1 }
          },
          "good": {
            "text": "The hug detonates the room — three careers of feud collapsing into eight seconds of something unarguable. Cameras everywhere; neither of you performs for them, which is how everyone knows it’s real. Back at the table {rival} mutters, “this changes nothing,” and refills your glass without being asked, which changes everything.",
            "effects": { "network": 7, "fame": 10, "cred": 6, "burnout": -4, "rivalry": -1 }
          },
          "incredible": {
            "text": "Mid-embrace, quietly, under the applause, {rival} says the thing three careers were built on top of: “I never wanted to beat you. I wanted to keep up.” You answer honestly. Nobody else ever learns what was said — the clip is just two old enemies holding on a beat too long — and the not-knowing makes it the most discussed moment of the industry year. The feud ends tonight, officially, in front of everyone. What replaces it has no name yet. It plays better than the feud ever did.",
            "effects": { "network": 10, "fame": 14, "cred": 10, "burnout": -6, "rivalry": -2 }
          }
        }
      }
    }
  },
  {
    "id": "ng_bandcamp_friday",
    "act": [1, 2],
    "pathAffinity": [],
    "weight": 11,
    "art": "ev_ng_bandcamp_friday",
    "context": "The one day the platform waives its cut",
    "prompt": "It’s the platform’s no-fee day — the one Friday a month it waives its cut and fans go out of their way to buy direct. Everyone in the scene drops something. The window is 24 hours and the goodwill is real but finite.",
    "recap": "The platform’s no-fee Friday. A 24-hour window.",
    "tags": ["record", "social"],
    "choices": {
      "left": {
        "label": "Drop something for it",
        "governingStats": { "creativity": 1, "network": 0.3 },
        "tags": ["record", "safe"],
        "outcomes": {
          "bad": {
            "text": "You rush out a B-side to catch the day and it feels thrown-together, because it was. A few loyalists buy it out of love. The love is the sale.",
            "effects": { "creativity": 3, "money": 40, "fame": 2 }
          },
          "good": {
            "text": "You drop a proper little release and the no-fee day means the money lands in YOUR pocket for once. Direct-to-fan is a rare, honest transaction.",
            "effects": { "creativity": 5, "money": 100, "network": 3 }
          },
          "incredible": {
            "text": "Your no-fee-day drop becomes the thing everyone shares, and the direct sales — no middleman, all yours — fund the next two months in a single Friday.",
            "effects": { "creativity": 6, "money": 180, "fame": 4, "network": 3 }
          }
        }
      },
      "right": {
        "label": "Signal-boost the whole scene instead",
        "governingStats": { "network": 1 },
        "tags": ["social", "network"],
        "outcomes": {
          "bad": {
            "text": "You spend the day promoting everyone else’s drops and forget to push your own, generous to the point of invisibility. The scene loves you. Your rent does not.",
            "effects": { "network": 4, "cred": 3 }
          },
          "good": {
            "text": "You become the day’s hub — boosting dozens of releases — and the scene remembers who lifted them when it mattered. Goodwill is a slow, compounding currency.",
            "effects": { "network": 6, "cred": 4, "fame": 2 }
          },
          "incredible": {
            "text": "Your scene-wide boosting turns the no-fee day into a genuine community event, and being its ringleader makes you the beating heart of the whole local economy. Influence, earned by generosity.",
            "effects": { "network": 8, "cred": 5, "fame": 3 }
          }
        }
      }
    }
  },
  {
    "id": "ng_open_mic_host",
    "act": 1,
    "pathAffinity": [],
    "weight": 10,
    "art": "ev_ng_open_mic_host",
    "context": "The open mic you came up through needs a host",
    "prompt": "The open mic that gave you your first stage lost its host, and they’re asking you to run it — the sign-up sheet, the encouragement, the gentle management of the guy who always plays too long. It pays nothing and matters enormously.",
    "recap": "The open mic that gave you your start lost its host.",
    "tags": ["live", "home"],
    "choices": {
      "left": {
        "label": "Host it with heart",
        "governingStats": { "network": 1, "cred": 0.3 },
        "tags": ["live", "home", "safe"],
        "outcomes": {
          "bad": {
            "text": "You host and it’s a lot of unpaid emotional labor and one open-mic regular treats you like their personal manager. But a nervous kid plays their first song because you made the room safe. Worth it.",
            "effects": { "network": 3, "cred": 4, "burnout": 3 }
          },
          "good": {
            "text": "You become the host who makes everyone braver, and the open mic thrives under you — a launching pad you’re proud to run. You’re the reason someone else’s story starts.",
            "effects": { "network": 5, "cred": 5, "fame": 2 }
          },
          "incredible": {
            "text": "Your open mic becomes legendary — the room where the scene’s next generation is born — and being its host makes you a genuine pillar. You gave back the exact thing that made you. That’s a legacy.",
            "effects": { "network": 7, "cred": 6, "fame": 3 }
          }
        }
      },
      "right": {
        "label": "Play it, don’t run it",
        "governingStats": { "skill": 1 },
        "tags": ["live", "practice"],
        "outcomes": {
          "bad": {
            "text": "You keep showing up as a player, not a host, and it’s freeing but the open mic wobbles without leadership. You protected your time and the room paid a little for it.",
            "effects": { "skill": 4, "creativity": 2 }
          },
          "good": {
            "text": "You stay a regular and use the low-stakes stage to test new material every week, and the workshop-in-public sharpens you fast. The open mic as a laboratory.",
            "effects": { "skill": 6, "creativity": 3, "cred": 2 }
          },
          "incredible": {
            "text": "You treat the open mic as your proving ground and debut songs there that later become staples, and the room gets to say it heard them first. The humblest stage, the realest lab.",
            "effects": { "skill": 7, "creativity": 4, "fame": 2 }
          }
        }
      }
    }
  },
  {
    "id": "ng_gear_swap",
    "act": 2,
    "pathAffinity": [],
    "weight": 10,
    "art": "ev_ng_gear_swap",
    "context": "A parking-lot gear swap meet",
    "prompt": "A gear swap meet in a parking lot — tables of cables, amps, and instruments with stories. Someone’s selling exactly the thing your sound has been missing, and someone else wants exactly the thing gathering dust in your van. Deals are made on vibes.",
    "recap": "A parking-lot gear swap, deals made on vibes.",
    "tags": ["deal", "tone"],
    "choices": {
      "left": {
        "label": "Trade up your sound",
        "governingStats": { "creativity": 1, "network": 0.3 },
        "tags": ["deal", "tone", "risky"],
        "outcomes": {
          "bad": {
            "text": "You trade for a “vintage” piece that turns out to be broken in a way the seller definitely knew about. You learn the swap meet’s first rule too late. It has character, at least. Loud character.",
            "effects": { "creativity": 3, "money": -20 }
          },
          "good": {
            "text": "You make a shrewd trade and walk away with a piece that genuinely upgrades your sound, given up by someone who didn’t know what they had. The swap meet rewards the patient ear.",
            "effects": { "creativity": 6, "cred": 3, "money": 20 }
          },
          "incredible": {
            "text": "You spot a legendary piece mislabeled and misprice, trade almost nothing for it, and walk away with the cornerstone of your next record. The best gear stories start in a parking lot.",
            "effects": { "creativity": 8, "cred": 4, "money": 60 }
          }
        }
      },
      "right": {
        "label": "Flip your dead weight",
        "governingStats": { "network": 1 },
        "tags": ["deal", "work"],
        "outcomes": {
          "bad": {
            "text": "You sell off the gear you never use and immediately need one piece back the following week. The circle of gear is cruel and eternal. You made a little cash, though.",
            "effects": { "network": 3, "money": 60 }
          },
          "good": {
            "text": "You clear out the van’s dead weight for real money and good karma, and the lighter load makes touring easier. Less gear, more room, same sound. A clean trade.",
            "effects": { "network": 4, "money": 120, "burnout": -2 }
          },
          "incredible": {
            "text": "You turn your junk into someone else’s treasure and pocket a surprising windfall, and one buyer becomes a genuine connection. The best flips make money AND friends. You made both.",
            "effects": { "network": 6, "money": 180, "cred": 2 }
          }
        }
      }
    }
  },
  {
    "id": "ng_house_concert",
    "act": [1, 2],
    "pathAffinity": [],
    "weight": 10,
    "art": "ev_ng_house_concert",
    "context": "A living room, forty folding chairs, total silence",
    "prompt": "A fan offers to host a house concert — their living room, forty invited guests, a hat passed at the end, and the specific terrifying intimacy of playing to people close enough to see your hands shake. No stage to hide behind here.",
    "recap": "A living room, forty folding chairs, no stage to hide behind.",
    "tags": ["live", "home"],
    "choices": {
      "left": {
        "label": "Lean into the intimacy",
        "governingStats": { "creativity": 1, "cred": 0.3 },
        "tags": ["live", "home", "safe"],
        "outcomes": {
          "bad": {
            "text": "The room is SO quiet that you overthink every note, and the intimacy tips into pressure. You play well but stiffly. The host feeds you afterward, which helps more than the fee.",
            "effects": { "creativity": 3, "cred": 3, "money": 40 }
          },
          "good": {
            "text": "You strip the songs bare for forty people and the closeness becomes electric — the kind of show where everyone remembers where they were sitting. Intimacy, weaponized into magic.",
            "effects": { "creativity": 6, "cred": 4, "money": 90, "fame": 2 }
          },
          "incredible": {
            "text": "The house concert becomes a night those forty people describe for years, and word of the magic spreads until house concerts become a beloved part of your legend. Small rooms, enormous echoes.",
            "effects": { "creativity": 7, "cred": 5, "money": 140, "fame": 3 }
          }
        }
      },
      "right": {
        "label": "Turn it into a real listening event",
        "governingStats": { "skill": 1, "network": 0.3 },
        "tags": ["live", "safe"],
        "outcomes": {
          "bad": {
            "text": "You over-produce the living room — mics, monitors, a set list on the coffee table — and it loses the casual charm the host wanted. Competent, slightly corporate, in a living room. Odd.",
            "effects": { "skill": 3, "money": 50, "burnout": 2 }
          },
          "good": {
            "text": "You treat the forty guests to a genuinely polished performance and it feels like a private concert by a real artist, which it is. They tip generously and tell everyone.",
            "effects": { "skill": 5, "money": 110, "network": 4 }
          },
          "incredible": {
            "text": "You turn a living room into a genuine event that has the guests believing they witnessed something rare, and several become lifelong superfans who follow you everywhere. Forty converts, made in one night.",
            "effects": { "skill": 6, "money": 160, "network": 5, "fame": 3 }
          }
        }
      }
    }
  },
  {
    "id": "ng_local_news",
    "act": 2,
    "pathAffinity": [],
    "weight": 9,
    "art": "ev_ng_local_news",
    "context": "The morning news, a fluff segment, 6:40 a.m.",
    "prompt": "The local morning news wants you for a 6:40 a.m. “community spotlight” segment between the weather and a story about a raccoon. The anchors are relentlessly upbeat and have not listened to your music. Four hundred thousand groggy locals are watching.",
    "recap": "A 6:40 a.m. news spot, between the weather and a raccoon.",
    "tags": ["social", "live"],
    "choices": {
      "left": {
        "label": "Charm the morning crowd",
        "governingStats": { "network": 1, "creativity": 0.3 },
        "tags": ["social", "mainstream", "safe"],
        "outcomes": {
          "bad": {
            "text": "You play at 6:40 a.m. to two anchors who talk over your outro to tease the raccoon story. Your song is now associated with a raccoon in four hundred thousand minds. Exposure is exposure.",
            "effects": { "network": 3, "fame": 4 }
          },
          "good": {
            "text": "You win over the morning crowd with warmth and a song that works even half-awake, and the segment drives a genuine bump in local support. Grandmothers know your name now.",
            "effects": { "network": 5, "fame": 6, "cred": 2 }
          },
          "incredible": {
            "text": "Your morning-news charm becomes a beloved local clip, the anchors adore you, and you get invited back monthly as the “house musician.” You conquered 6:40 a.m., which nobody conquers.",
            "effects": { "network": 6, "fame": 9, "cred": 3 }
          }
        }
      },
      "right": {
        "label": "Play something unexpectedly real",
        "governingStats": { "creativity": 1 },
        "tags": ["indie", "risky"],
        "outcomes": {
          "bad": {
            "text": "You play something genuine and a little heavy for a morning-news slot, and the tonal whiplash after the traffic report is severe. A few viewers feel something. Most reach for coffee.",
            "effects": { "creativity": 4, "cred": 3, "fame": 2 }
          },
          "good": {
            "text": "You sneak a real, affecting song into the fluff slot and a surprising number of groggy strangers are moved before 7 a.m. The contrast makes it land harder. Art, ambushing the morning.",
            "effects": { "creativity": 6, "cred": 4, "fame": 4 }
          },
          "incredible": {
            "text": "Your unexpectedly beautiful morning performance becomes a viral “I did not expect to cry before work” moment, and the segment reaches far past the local market. You made four hundred thousand people feel something at dawn.",
            "effects": { "creativity": 7, "cred": 5, "fame": 8 }
          }
        }
      }
    }
  },
  {
    "id": "ng_setlist_gamble",
    "act": [2, 3],
    "pathAffinity": [],
    "weight": 10,
    "art": "ev_ng_setlist_gamble",
    "context": "The setlist, ten minutes to doors",
    "prompt": "Ten minutes to doors and the setlist is still a question: play the crowd-pleasers you know land, or open with the deep cut you’ve been dying to try live. The crowd tonight is a wildcard — a mix of diehards and first-timers who wandered in.",
    "recap": "Ten minutes to doors, the setlist still a question.",
    "tags": ["live", "practice"],
    "choices": {
      "left": {
        "label": "Open with the deep cut",
        "minigame": "setlist",
        "governingStats": { "creativity": 1, "skill": 0.4 },
        "tags": ["live", "risky", "indie"],
        "outcomes": {
          "bad": {
            "text": "You open with the obscure one and the first-timers check their phones through it, and you spend the rest of the set clawing the room back. Bold, costly, survivable. The diehards, at least, lost their minds.",
            "effects": { "creativity": 4, "fame": 3, "burnout": 4 }
          },
          "good": {
            "text": "The deep-cut opener signals “this is a real show, not a jukebox,” and the risk announces you as an artist. The room leans in, curious and won. Confidence, rewarded.",
            "effects": { "creativity": 6, "cred": 4, "fame": 4 }
          },
          "incredible": {
            "text": "The deep cut detonates as an opener — the diehards scream, the first-timers convert on the spot — and the gamble becomes the show everyone talks about. You bet on the brave choice and the room bet back.",
            "effects": { "creativity": 8, "cred": 5, "fame": 6 }
          }
        }
      },
      "right": {
        "label": "Play the sure-fire set",
        "governingStats": { "skill": 1 },
        "tags": ["live", "mainstream", "safe"],
        "outcomes": {
          "bad": {
            "text": "You play the reliable crowd-pleasers and it’s a solid, safe, slightly forgettable set. Nobody complains. Nobody’s changed. A professional night, on autopilot.",
            "effects": { "skill": 4, "fame": 4, "money": 20 }
          },
          "good": {
            "text": "The sure-fire set does exactly what it should — a tight, joyful, everyone-happy night — and the first-timers leave as fans. Sometimes giving people what they want IS the art.",
            "effects": { "skill": 5, "fame": 6, "network": 3 }
          },
          "incredible": {
            "text": "You play the crowd-pleasers so perfectly that even the diehards rediscover why they love them, and the whole room becomes one voice. A greatest-hits set, delivered like it’s the first time. Mastery.",
            "effects": { "skill": 7, "fame": 9, "cred": 3 }
          }
        }
      }
    }
  },
  {
    "id": "ng_collab_dm",
    "act": [2, 3],
    "pathAffinity": [],
    "weight": 9,
    "art": "ev_ng_collab_dm",
    "context": "A DM from an artist in a totally different genre",
    "prompt": "An artist from a completely different corner of music — someone whose world barely overlaps yours — slides into your DMs with a collab idea that’s either brilliant or a disaster. The genres shouldn’t mix. That’s exactly why it might be great.",
    "recap": "A DM from an artist whose genre shouldn’t mix with yours.",
    "tags": ["network", "write"],
    "choices": {
      "left": {
        "label": "Take the weird swing",
        "minigame": "ideas",
        "governingStats": { "creativity": 1, "network": 0.3 },
        "tags": ["write", "risky"],
        "outcomes": {
          "bad": {
            "text": "The genre-clash collab is a fascinating mess that neither fanbase quite knows what to do with. Ahead of its time, or just off. You’re proud of the swing regardless. The DM friendship survives.",
            "effects": { "creativity": 4, "network": 3, "burnout": 3 }
          },
          "good": {
            "text": "The unlikely pairing produces something genuinely fresh, and both fanbases meet in the middle for a song that couldn’t have existed inside either genre. Cross-pollination, working.",
            "effects": { "creativity": 6, "network": 5, "fame": 4 }
          },
          "incredible": {
            "text": "The genre-bending collab becomes a phenomenon precisely because it shouldn’t work, and it introduces you to a whole new audience while inventing a little sound of its own. The weird swing connected.",
            "effects": { "creativity": 8, "network": 6, "fame": 7 }
          }
        }
      },
      "right": {
        "label": "Suggest a smaller experiment first",
        "governingStats": { "network": 1 },
        "tags": ["network", "safe"],
        "outcomes": {
          "bad": {
            "text": "You propose a cautious test-run and the momentum fizzles — the other artist wanted a bold swing, not a committee. The collab quietly doesn’t happen. You stayed friends, at least, and safe.",
            "effects": { "network": 3, "cred": 2 }
          },
          "good": {
            "text": "You start small — one track, low stakes — and the careful approach lets a real creative rapport build, so the eventual collab is better for the patience. Trust, then risk.",
            "effects": { "network": 5, "creativity": 3, "fame": 3 }
          },
          "incredible": {
            "text": "The small experiment goes so well it blossoms into a genuine ongoing partnership across genres, the kind that produces a whole beloved body of unexpected work. You built something lasting by starting careful.",
            "effects": { "network": 7, "creativity": 5, "fame": 5 }
          }
        }
      }
    }
  },
  {
    "id": "ng_the_quiet_win",
    "act": [2, 3],
    "pathAffinity": [],
    "weight": 9,
    "art": "ev_ng_the_quiet_win",
    "context": "A small, private moment of arrival",
    "prompt": "No crowd, no chart, no camera — just a quiet moment when you realize you can do the thing you couldn’t a year ago. The progress that no one claps for. You’re alone with an instrument and, for once, the doubt is silent. What do you do with the quiet?",
    "recap": "Alone with an instrument, the doubt finally quiet.",
    "tags": ["home", "practice"],
    "choices": {
      "left": {
        "label": "Sit with the progress",
        "governingStats": { "cred": 1 },
        "tags": ["rest", "home", "safe"],
        "outcomes": {
          "bad": {
            "text": "You try to just enjoy the moment and the doubt sneaks back in within minutes, whispering that it’s not enough yet. But for those few minutes, you knew. That knowing stays, somewhere.",
            "effects": { "cred": 3, "burnout": -4 }
          },
          "good": {
            "text": "You let yourself feel the quiet win fully — the un-clapped, un-charted proof that you’re getting better — and it refuels you deeper than any applause could. Private progress is the realest kind.",
            "effects": { "cred": 5, "burnout": -6, "creativity": 2 }
          },
          "incredible": {
            "text": "You sit with the arrival and something settles in you for good: a quiet, unshakable confidence that no chart position can give or take away. You stopped needing the outside to tell you. That changes everything.",
            "effects": { "cred": 7, "burnout": -8, "creativity": 3 }
          }
        }
      },
      "right": {
        "label": "Immediately chase the next thing",
        "governingStats": { "skill": 1, "creativity": 0.3 },
        "tags": ["practice", "write"],
        "outcomes": {
          "bad": {
            "text": "You use the breakthrough as a springboard and overreach into something you’re not ready for yet, and stumble. But you stumbled forward, which is the only direction that counts. You’ll get it next week.",
            "effects": { "skill": 4, "creativity": 3, "burnout": 4 }
          },
          "good": {
            "text": "You channel the momentum straight into new work and the breakthrough compounds — one unlocked skill opening the door to three more. Progress feeding progress. The hot streak of craft.",
            "effects": { "skill": 6, "creativity": 4, "cred": 2 }
          },
          "incredible": {
            "text": "You ride the breakthrough into a genuine creative surge, the kind where everything you touch works, and you build more in a week than the previous three months. The quiet win becomes a loud one. You earned the fire.",
            "effects": { "skill": 7, "creativity": 6, "fame": 2 }
          }
        }
      }
    }
  }
];

export const ART2 = {
  "ev_n1_allages": { "e": "✖️", "s": "stage" },
  "ev_n1_access_tv": { "e": "📺", "s": "studio" },
  "ev_n1_group_chat": { "e": "💬", "s": "phone" },
  "ev_n1_chat_fest": { "e": "🎪", "s": "festival" },
  "ev_n1_wrong_cover": { "e": "🎼", "s": "stage" },
  "ev_n1_amp_bus": { "e": "🚌", "s": "street" },
  "ev_n1_lesson_flyer": { "e": "🧒", "s": "home" },
  "ev_n1_corner_notebook": { "e": "🗺️", "s": "street" },
  "ev_n1_gentle_chord": { "e": "⏰", "s": "stage" },
  "ev_n1_heat_brownout": { "e": "🥵", "s": "crisis" },
  "ev_n1_off_season_pier": { "e": "🌊", "s": "stage" },
  "ev_n1_venue_polaroid": { "e": "📸", "s": "stage" },
  "ev_n1_estate_sale": { "e": "🏷️", "s": "shop" },
  "ev_n1_receipt_song": { "e": "🧾", "s": "office" },
  "ev_n1_argument_song": { "e": "🗯️", "s": "home" },
  "ev_n1_amp_tech": { "e": "🔧", "s": "shop" },
  "ev_n1_piano_today": { "e": "🎹", "s": "street" },
  "ev_n1_borrowed_rig": { "e": "🔌", "s": "home" },
  "ev_n1_church_gig": { "e": "⛪", "s": "stage" },
  "ev_n1_retirement_home": { "e": "🌅", "s": "stage" },
  "ev_n1_plasma": { "e": "💉", "s": "office" },
  "ev_n1_tent_sale": { "e": "🎈", "s": "street" },
  "ev_n1_unwritten_rules": { "e": "📜", "s": "street" },
  "ev_n1_copy_shop": { "e": "🖨️", "s": "shop" },
  "ev_n1_demo_club": { "e": "💿", "s": "shop" },
  "ev_n1_scene_photog": { "e": "📷", "s": "street" },
  "ev_n1_quiet_night": { "e": "🤫", "s": "stage" },
  "ev_n1_radio_contest": { "e": "📻", "s": "phone" },
  "ev_n1_permit_office": { "e": "🪪", "s": "office" },
  "ev_n1_house_party": { "e": "🎂", "s": "home" },
  "ev_n1_park_circle": { "e": "🪕", "s": "street" },
  "ev_n1_car_studio": { "e": "🚗", "s": "studio" },
  "ev_n1_dollar_bin": { "e": "🪙", "s": "shop" },
  "ev_n1_diner_close": { "e": "🥞", "s": "home" },
  "ev_n1_building_vote": { "e": "🗳️", "s": "home" },
  "ev_n1_street_piano": { "e": "🌈", "s": "street" },
  "ev_n1_weekly_column": { "e": "🗞️", "s": "phone" },
  "ev_n1_barter_yard": { "e": "🍂", "s": "home" },
  "ev_n1_earplug_lecture": { "e": "🦻", "s": "stage" },
  "ev_n1_blues_jam": { "e": "🎷", "s": "stage" },
  "ev_n1_student_film": { "e": "🎬", "s": "studio" },
  "ev_n1_own_sale": { "e": "🧺", "s": "street" },
  "ev_n1_last_minute_opener": { "e": "🚐", "s": "crisis" },
  "ev_n1_soundboard_lesson": { "e": "🎚️", "s": "stage" },
  "ev_n1_lost_pedal": { "e": "🎛️", "s": "stage" },
  "ev_n2_college_radio": { "e": "📻", "s": "studio" },
  "ev_n2_first_tour": { "e": "🚐", "s": "street" },
  "ev_n2_karaoke_host": { "e": "🎤", "s": "stage" },
  "ev_n2_pedal_flipping": { "e": "🔁", "s": "shop" },
  "ev_n2_hold_music": { "e": "☎️", "s": "office" },
  "ev_n2_supper_club": { "e": "🍷", "s": "stage" },
  "ev_n2_ringtone_shop": { "e": "📳", "s": "phone" },
  "ev_n2_opener_slot": { "e": "🎟️", "s": "stage" },
  "ev_n2_van_upgrade": { "e": "🚐", "s": "shop" },
  "ev_n2_hometown_return": { "e": "🏠", "s": "stage" },
  "ev_n2_first_press": { "e": "🗞️", "s": "phone" },
  "ev_n2_sync_ad": { "e": "🛏️", "s": "office" },
  "ev_n2_release_single": { "e": "💿", "s": "studio" },
  "ev_n2_push_the_single": { "e": "📈", "s": "phone" },
  "ev_n2_session_call": { "e": "🎧", "s": "studio" },
  "ev_n2_rival_split_bill": { "e": "⚔️", "s": "stage" },
  "ev_n2_rival_truce_offer": { "e": "🍺", "s": "street" },
  "ev_n2_weather_dance_craze": { "e": "🕺", "s": "phone" },
  "ev_n2_weather_payola": { "e": "🕵️", "s": "office" },
  "ev_n2_merch_math": { "e": "👕", "s": "shop" },
  "ev_n2_producer_offer": { "e": "🎛️", "s": "studio" },
  "ev_n2_burnout_wall_early": { "e": "⛽", "s": "crisis" },
  "ev_n2_write_the_grief": { "e": "🕯️", "s": "home" },
  "ev_n2_scene_politics": { "e": "💬", "s": "phone" },
  "ev_bs_ox": { "e": "🐂", "s": "street" },
  "ev_bs_dot": { "e": "🧮", "s": "office" },
  "ev_n2_festival_slot": { "e": "🎪", "s": "festival" },
  "ev_n2_old_friend": { "e": "☎️", "s": "stage" },
  "ev_n2_radio_promise": { "e": "📻", "s": "studio" },
  "ev_n2_gear_theft": { "e": "🪟", "s": "street" },
  "ev_n2_the_algorithm": { "e": "📊", "s": "phone" },
  "ev_n2_genre_gatekeep": { "e": "🧵", "s": "stage" },
  "ev_n2_venue_regular": { "e": "📌", "s": "stage" },
  "ev_n2_broke_stretch": { "e": "💸", "s": "office" },
  "ev_n2_music_video": { "e": "🎬", "s": "festival" },
  "ev_n2_the_ask": { "e": "🤝", "s": "stage" },
  "ev_n2_label_sniff": { "e": "🕴️", "s": "stage" },
  "ev_n2_cover_gone_big": { "e": "🎶", "s": "phone" },
  "ev_n2_bandmate_doubt": { "e": "🍳", "s": "home" },
  "ev_n2_hustle_audit_two": { "e": "🧾", "s": "office" },
  "ev_n2_tighten_the_set": { "e": "🎚️", "s": "home" },
  "ev_n2_streaming_check": { "e": "📉", "s": "office" },
  "ev_n2_encore_demand": { "e": "👏", "s": "arena" },
  "ev_n2_documentary_pitch": { "e": "🎥", "s": "street" },
  "ev_n2_reissue_offer": { "e": "💽", "s": "shop" },
  "ev_n2_award_nom": { "e": "🏅", "s": "office" },
  "ev_n2_late_night_write": { "e": "🌙", "s": "home" },
  "ev_n2_two_three_bridge": { "e": "🔀", "s": "office" },
  "ev_n3_legacy_act": { "e": "🏛️", "s": "festival" },
  "ev_n3_body_keeps_score": { "e": "🩺", "s": "crisis" },
  "ev_n3_faded_returns": { "e": "📺", "s": "phone" },
  "ev_n3_hometown_institution": { "e": "🏛️", "s": "stage" },
  "ev_n3_famous_and_broke": { "e": "🏧", "s": "street" },
  "ev_n3_nemesis_toast": { "e": "🥂", "s": "office" },
  "ev_n3_ghost_sessions": { "e": "🕶️", "s": "studio" },
  "ev_n3_sample_packs": { "e": "📦", "s": "studio" },
  "ev_n3_the_album": { "e": "📀", "s": "studio" },
  "ev_n3_push_the_hit": { "e": "📈", "s": "phone" },
  "ev_n3_write_from_the_top": { "e": "✍️", "s": "home" },
  "ev_n3_polish_the_vault": { "e": "💎", "s": "studio" },
  "ev_bs_cassette": { "e": "📼", "s": "home" },
  "ev_bs_gus": { "e": "🎚️", "s": "stage" },
  "ev_n3_biopic_offer": { "e": "🎞️", "s": "office" },
  "ev_n3_young_band_furniture": { "e": "🪑", "s": "stage" },
  "ev_n3_coast_temptation": { "e": "🛋️", "s": "office" },
  "ev_n3_gear_indulgence": { "e": "🎸", "s": "shop" },
  "ev_n3_legacy_medley": { "e": "🎼", "s": "arena" },
  "ev_n3_streaming_empire": { "e": "🏢", "s": "office" },
  "ev_n3_fan_generations": { "e": "👨‍👧", "s": "stage" },
  "ev_n3_the_offer_to_quit": { "e": "🚪", "s": "home" },
  "ev_n3_tribute_night": { "e": "🎭", "s": "stage" },
  "ev_n3_final_collab": { "e": "🤝", "s": "studio" },
  "ev_n3_the_interview_hard": { "e": "🎙️", "s": "phone" },
  "ev_n3_off_the_grid_write": { "e": "🏕️", "s": "home" },
  "ev_n3_scene_elder": { "e": "🏛️", "s": "street" },
  "ev_n3_last_van_show": { "e": "🚐", "s": "street" },
  "ev_n3_definitive_statement": { "e": "📀", "s": "studio" },
  "ev_n3_royalty_windfall": { "e": "💰", "s": "office" },
  "ev_n3_two_three_flag": { "e": "🗺️", "s": "office" },
  "ev_n3_greatest_fear": { "e": "🪞", "s": "crisis" },
  "ev_n3_comeback_kid": { "e": "🦅", "s": "stage" },
  "ev_n3_signature_move": { "e": "✨", "s": "stage" },
  "ev_n3_protege_surpasses": { "e": "🚀", "s": "phone" },
  "ev_n3_final_lesson": { "e": "🚪", "s": "street" },
  "ev_n3_genre_pioneer": { "e": "🌊", "s": "phone" },
  "ev_n3_the_reunion_offer": { "e": "🎸", "s": "office" },
  "ev_n3_teaching_offer": { "e": "🎓", "s": "office" },
  "ev_n3_one_more_song": { "e": "🌙", "s": "home" },
  "ev_n3_the_encore_of_encores": { "e": "🎆", "s": "arena" },
  "ev_np_ms2_stylist": { "e": "💄", "s": "office" },
  "ev_np_ms2_arena_support": { "e": "🎟️", "s": "arena" },
  "ev_np_ms2_first_viral": { "e": "📈", "s": "phone" },
  "ev_np_ms2_brand_deal": { "e": "🪧", "s": "office" },
  "ev_np_ms2_stan_army": { "e": "🪧", "s": "phone" },
  "ev_np_ms2_rival_climb": { "e": "📰", "s": "office" },
  "ev_np_ms2_late_show": { "e": "🌙", "s": "stage" },
  "ev_np_ms2_paparazzi": { "e": "📸", "s": "street" },
  "ev_np_ms2_headline_first": { "e": "🎤", "s": "stage" },
  "ev_np_st2_first_call": { "e": "📞", "s": "studio" },
  "ev_np_st2_tone_quest": { "e": "🎚️", "s": "studio" },
  "ev_np_st2_ghost_solo": { "e": "🎸", "s": "studio" },
  "ev_np_st2_bandleader": { "e": "🎼", "s": "studio" },
  "ev_np_st2_chart_ghost": { "e": "📻", "s": "studio" },
  "ev_np_st2_union": { "e": "🤝", "s": "office" },
  "ev_np_st2_rival_session": { "e": "⚔️", "s": "studio" },
  "ev_np_st2_masterclass": { "e": "📖", "s": "office" },
  "ev_np_hf2_first_topline": { "e": "✍️", "s": "studio" },
  "ev_np_hf2_splits_meeting": { "e": "🥧", "s": "office" },
  "ev_np_hf2_write_camp": { "e": "🏰", "s": "studio" },
  "ev_np_hf2_the_placement": { "e": "📇", "s": "office" },
  "ev_np_hf2_trend_arb": { "e": "📊", "s": "phone" },
  "ev_np_hf2_vault_build": { "e": "🗄️", "s": "studio" },
  "ev_np_hf2_the_muse": { "e": "🎙️", "s": "studio" },
  "ev_np_hf2_instant_classic": { "e": "⚡", "s": "studio" },
  "ev_np_hf2_rival_writer": { "e": "⚔️", "s": "studio" },
  "ev_np_ms3_world_tour": { "e": "✈️", "s": "arena" },
  "ev_np_ms3_the_persona": { "e": "🪞", "s": "home" },
  "ev_np_ms3_stadium_anthem": { "e": "🎆", "s": "arena" },
  "ev_np_ms3_award_show": { "e": "🏆", "s": "arena" },
  "ev_np_ms3_sell_out_show": { "e": "🌟", "s": "arena" },
  "ev_np_ms3_rival_summit": { "e": "🥊", "s": "festival" },
  "ev_np_ms3_legacy_choice": { "e": "🌍", "s": "office" },
  "ev_np_st3_first_call_king": { "e": "📞", "s": "studio" },
  "ev_np_st3_signature_sound": { "e": "🎛️", "s": "studio" },
  "ev_np_st3_the_masters": { "e": "👑", "s": "studio" },
  "ev_np_st3_own_studio": { "e": "🏛️", "s": "studio" },
  "ev_np_st3_credit_finally": { "e": "🎬", "s": "office" },
  "ev_np_st3_last_session": { "e": "🎚️", "s": "studio" },
  "ev_np_hf3_the_machine": { "e": "⚙️", "s": "office" },
  "ev_np_hf3_number_one": { "e": "🥇", "s": "studio" },
  "ev_np_hf3_the_album_hf": { "e": "📀", "s": "studio" },
  "ev_np_hf3_legacy_catalog": { "e": "🗃️", "s": "office" },
  "ev_np_hf3_write_your_own": { "e": "✍️", "s": "home" },
  "ev_np_hf3_the_reveal": { "e": "🗞️", "s": "phone" },
  "ev_np_hf3_rival_credit": { "e": "⚔️", "s": "office" },
  "ev_np_hf3_final_hit": { "e": "⭐", "s": "studio" },
  "ev_nm_mentor_meet": { "e": "🎓", "s": "home" },
  "ev_nm_mentor_lesson": { "e": "☕", "s": "home" },
  "ev_nm_mentor_favor": { "e": "📞", "s": "office" },
  "ev_nm_mentor_last": { "e": "🎤", "s": "stage" },
  "ev_nm_copycat_clip": { "e": "🪞", "s": "phone" },
  "ev_nm_copycat_duet": { "e": "🎤", "s": "stage" },
  "ev_nm_copycat_rise": { "e": "📰", "s": "phone" },
  "ev_nm_copycat_mirror": { "e": "🎧", "s": "phone" },
  "ev_nm_lost_tape": { "e": "📼", "s": "shop" },
  "ev_nm_tape_hunt": { "e": "🔍", "s": "street" },
  "ev_nm_tape_release": { "e": "💿", "s": "studio" },
  "ev_nm_tape_owner": { "e": "🚸", "s": "street" },
  "ev_nm_intern_meet": { "e": "📎", "s": "office" },
  "ev_nm_intern_leak": { "e": "📄", "s": "office" },
  "ev_nm_intern_fired": { "e": "📦", "s": "home" },
  "ev_nm_intern_desk": { "e": "🗂️", "s": "office" },
  "ev_nm_van_named": { "e": "🚐", "s": "street" },
  "ev_nm_van_breakdown": { "e": "🔧", "s": "street" },
  "ev_nm_van_odometer": { "e": "🔢", "s": "street" },
  "ev_nm_van_museum": { "e": "🏛️", "s": "shop" },
  "ev_nm_first_letter": { "e": "✉️", "s": "home" },
  "ev_nm_letter_two": { "e": "💌", "s": "home" },
  "ev_nm_letter_town": { "e": "🗺️", "s": "stage" },
  "ev_nm_letter_last": { "e": "🕊️", "s": "home" },
  "ev_nm_critic_pan": { "e": "🗞️", "s": "phone" },
  "ev_nm_critic_reread": { "e": "📱", "s": "phone" },
  "ev_nm_critic_book": { "e": "📕", "s": "office" },
  "ev_nm_critic_quit": { "e": "🖋️", "s": "office" },
  "ev_nm_jingle_gig": { "e": "🎢", "s": "office" },
  "ev_nm_jingle_spreads": { "e": "🧒", "s": "stage" },
  "ev_nm_jingle_remix": { "e": "🎧", "s": "phone" },
  "ev_nm_jingle_waterpark": { "e": "🎡", "s": "festival" },
  "ev_nm_ghost_note": { "e": "👻", "s": "home" },
  "ev_nm_ghost_request": { "e": "🕯️", "s": "home" },
  "ev_nm_ghost_encore": { "e": "🔊", "s": "stage" },
  "ev_nm_ghost_settled": { "e": "🌙", "s": "stage" },
  "ev_nm_dog_adopt": { "e": "🐕", "s": "street" },
  "ev_nm_dog_mascot": { "e": "👕", "s": "shop" },
  "ev_nm_dog_cover": { "e": "📀", "s": "studio" },
  "ev_nm_dog_vet": { "e": "🐾", "s": "home" },
  "ev_nm_sibling_call": { "e": "📱", "s": "home" },
  "ev_nm_sibling_recital": { "e": "🎻", "s": "home" },
  "ev_nm_sibling_verse": { "e": "✍️", "s": "home" },
  "ev_nm_sibling_thaw": { "e": "🫂", "s": "stage" },
  "ev_nm_open_tab": { "e": "🍺", "s": "stage" },
  "ev_nm_tab_called": { "e": "🪧", "s": "stage" },
  "ev_nm_tab_wall": { "e": "🖼️", "s": "shop" },
  "ev_nm_tab_pour": { "e": "🥃", "s": "stage" },
  "ev_nfp_eclipse": { "e": "🌑", "s": "festival" },
  "ev_nfp_gorefeast": { "e": "🤘", "s": "festival" },
  "ev_nfp_anthem": { "e": "⚾", "s": "arena" },
  "ev_nfp_wax": { "e": "🗿", "s": "shop" },
  "ev_nfp_broadcast": { "e": "📻", "s": "studio" },
  "ev_nfp_yacht": { "e": "🛥️", "s": "stage" },
  "ev_nfp_sinkhole": { "e": "🕳️", "s": "crisis" },
  "ev_nfp_parade": { "e": "🎈", "s": "street" },
  "ev_nfp_terminal": { "e": "🛫", "s": "street" },
  "ev_nfp_lookalike": { "e": "👯", "s": "stage" },
  "ev_nw_first_dance": { "e": "💍", "s": "home" },
  "ev_nw_uncle_bill": { "e": "💵", "s": "stage" },
  "ev_nw_cousins": { "e": "🎺", "s": "festival" },
  "ev_nw_divorce_party": { "e": "🥂", "s": "stage" },
  "ev_nw_officiant": { "e": "📖", "s": "stage" },
  "ev_ncr_buffet": { "e": "🍳", "s": "stage" },
  "ev_ncr_captain": { "e": "🧭", "s": "stage" },
  "ev_ncr_storm_deck": { "e": "🌊", "s": "crisis" },
  "ev_ncr_talent_show": { "e": "🏆", "s": "stage" },
  "ev_ncr_intl_waters": { "e": "🌐", "s": "studio" },
  "ev_nr_split_bill": { "e": "🚪", "s": "stage" },
  "ev_nr_understudy": { "e": "🕵️", "s": "phone" },
  "ev_nr_kudzu": { "e": "🌿", "s": "phone" },
  "ev_nr_cold_open": { "e": "☕", "s": "studio" },
  "ev_nr_hot_ten": { "e": "📊", "s": "phone" },
  "ev_nr_nemesis_toast": { "e": "🥃", "s": "office" },
  "ev_ng_bandcamp_friday": { "e": "💿", "s": "phone" },
  "ev_ng_open_mic_host": { "e": "🎤", "s": "stage" },
  "ev_ng_gear_swap": { "e": "🔌", "s": "shop" },
  "ev_ng_house_concert": { "e": "🪑", "s": "home" },
  "ev_ng_local_news": { "e": "📺", "s": "studio" },
  "ev_ng_setlist_gamble": { "e": "📝", "s": "stage" },
  "ev_ng_collab_dm": { "e": "📲", "s": "studio" },
  "ev_ng_the_quiet_win": { "e": "🌅", "s": "home" }
};

export const NEW_ARCS = [
  {
    "id": "mentor",
    "name": "The Mentor",
    "setup": ["nm_mentor_meet"],
    "lit": { "flagsAll": ["mentor_met"] },
    "payoffs": ["nm_mentor_lesson", "nm_mentor_favor", "nm_mentor_last"]
  },
  {
    "id": "copycat",
    "name": "The Copycat",
    "setup": ["nm_copycat_clip"],
    "lit": { "anyOf": [{ "flagsAll": ["copycat"] }, { "flagsAll": ["copycat_feud"] }] },
    "payoffs": ["nm_copycat_duet", "nm_copycat_rise", "nm_copycat_mirror"]
  },
  {
    "id": "lost_tape",
    "name": "The Lost Tape",
    "setup": ["nm_lost_tape"],
    "lit": { "flagsAll": ["lost_tape"] },
    "payoffs": ["nm_tape_hunt", "nm_tape_release", "nm_tape_owner"]
  },
  {
    "id": "intern",
    "name": "The Intern",
    "setup": ["nm_intern_meet"],
    "lit": { "flagsAll": ["intern_ally"] },
    "payoffs": ["nm_intern_leak", "nm_intern_fired", "nm_intern_desk"]
  },
  {
    "id": "van_saga",
    "name": "The Van",
    "setup": ["nm_van_named"],
    "lit": { "flagsAll": ["the_van"] },
    "payoffs": ["nm_van_breakdown", "nm_van_odometer", "nm_van_museum"]
  },
  {
    "id": "pen_pal",
    "name": "The Pen Pal",
    "setup": ["nm_first_letter"],
    "lit": { "flagsAll": ["pen_pal"] },
    "payoffs": ["nm_letter_two", "nm_letter_town", "nm_letter_last"]
  },
  {
    "id": "critic",
    "name": "The Critic",
    "setup": ["nm_critic_pan"],
    "lit": { "anyOf": [{ "flagsAll": ["critic_seen"] }, { "flagsAll": ["critic_feud"] }] },
    "payoffs": ["nm_critic_reread", "nm_critic_book", "nm_critic_quit"]
  },
  {
    "id": "jingle_curse",
    "name": "The Jingle",
    "setup": ["nm_jingle_gig"],
    "lit": { "flagsAll": ["jingle_ghost"] },
    "payoffs": ["nm_jingle_spreads", "nm_jingle_remix", "nm_jingle_waterpark"]
  },
  {
    "id": "resident_ghost",
    "name": "The Resident Ghost",
    "setup": ["nm_ghost_note"],
    "lit": { "flagsAll": ["venue_ghost"] },
    "payoffs": ["nm_ghost_request", "nm_ghost_encore", "nm_ghost_settled"]
  },
  {
    "id": "tour_dog",
    "name": "The Tour Dog",
    "setup": ["nm_dog_adopt"],
    "lit": { "flagsAll": ["tour_dog"] },
    "payoffs": ["nm_dog_mascot", "nm_dog_cover", "nm_dog_vet"]
  },
  {
    "id": "sibling",
    "name": "The Sibling",
    "setup": ["nm_sibling_call"],
    "lit": { "anyOf": [{ "flagsAll": ["sibling_bridge"] }, { "flagsAll": ["sibling_rift"] }] },
    "payoffs": ["nm_sibling_recital", "nm_sibling_verse", "nm_sibling_thaw"]
  },
  {
    "id": "open_tab",
    "name": "The Open Tab",
    "setup": ["nm_open_tab"],
    "lit": { "flagsAll": ["open_tab"] },
    "payoffs": ["nm_tab_called", "nm_tab_wall", "nm_tab_pour"]
  },
  {
    "id": "the_chat",
    "name": "The Group Chat",
    "setup": ["n1_group_chat"],
    "lit": { "flagsAll": ["in_the_chat"] },
    "payoffs": ["n1_chat_fest"]
  }
];
