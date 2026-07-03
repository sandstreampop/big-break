// BIG BREAK — event deck, wave 3 (the doubling). Same schema as events.js
// (spec §8.1); kept in a second file so the corpus stays navigable. events.js
// imports EVENTS2 and folds it into the live deck; art.js imports ART2 for
// the emoji/scene registry; arcs.js imports NEW_ARCS for the Story Seeds
// registry. Content only — no logic. GENERATED: authored as batch files,
// inlined here. 119 cards, 119 art slots, 0 arcs.

export const EVENTS2 = [
  {
    "id": "n1_allages",
    "act": 1,
    "pathAffinity": [],
    "weight": 11,
    "art": "ev_n1_allages",
    "context": "The Elks Hall, 5 p.m. sharp",
    "prompt": "All-ages matinee. Every hand in the room has an X in marker, the merch table is a card table, and the show MUST end by eight because of bingo.",
    "tags": [
      "live"
    ],
    "choices": {
      "left": {
        "label": "Play to the kids",
        "minigame": "crowd",
        "governingStats": {
          "skill": 1,
          "cred": 0.3
        },
        "tags": [
          "live",
          "risky"
        ],
        "outcomes": {
          "bad": {
            "text": "You say “how’s everybody doing” to a room legally too young to answer honestly. Someone’s dad claps alone.",
            "effects": {
              "skill": 2,
              "burnout": 4
            }
          },
          "good": {
            "text": "The front row forms. Fourteen years old, arms crossed, absolutely locked in. That crossed-arms thing is their applause.",
            "effects": {
              "skill": 4,
              "cred": 4,
              "fame": 3
            }
          },
          "incredible": {
            "text": "A kid asks you to sign their X. Their marker, their hand, your name. You are somebody’s first show now. Forever.",
            "effects": {
              "skill": 6,
              "cred": 6,
              "fame": 6,
              "network": 2
            }
          }
        }
      },
      "right": {
        "label": "Charm the parents",
        "governingStats": {
          "network": 1
        },
        "tags": [
          "network",
          "safe"
        ],
        "outcomes": {
          "bad": {
            "text": "You network with the chaperones. One of them owns a boat, none of them own a venue.",
            "effects": {
              "network": 2,
              "burnout": 3
            }
          },
          "good": {
            "text": "A mom who books the county fair takes your number. The county fair pays REAL money.",
            "effects": {
              "network": 5,
              "money": 25
            }
          },
          "incredible": {
            "text": "The Elks themselves adopt you. You now have a hall, a discount, and eleven grandfathers.",
            "effects": {
              "network": 7,
              "cred": 3,
              "money": 40,
              "fame": 2
            }
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
    "tags": [
      "live",
      "social"
    ],
    "choices": {
      "left": {
        "label": "Play it earnest",
        "governingStats": {
          "skill": 1
        },
        "tags": [
          "live",
          "safe",
          "mainstream"
        ],
        "outcomes": {
          "bad": {
            "text": "The camera operator falls asleep on the zoom. Your close-up is of your elbow, for two minutes, in standard definition.",
            "effects": {
              "skill": 2,
              "fame": 2
            }
          },
          "good": {
            "text": "Barb asks a real question and you give a real answer. Eleven people watching, and all eleven feel it.",
            "effects": {
              "skill": 4,
              "fame": 4,
              "cred": 2
            }
          },
          "incredible": {
            "text": "Barb, off-air: “I’ve had three guests worth watching. You’re two of them.” You do not ask about the math. You take it.",
            "effects": {
              "skill": 5,
              "fame": 7,
              "cred": 4,
              "network": 3
            }
          }
        }
      },
      "right": {
        "label": "Treat it like an arena",
        "governingStats": {
          "creativity": 1,
          "network": 0.3
        },
        "tags": [
          "live",
          "risky",
          "fame"
        ],
        "outcomes": {
          "bad": {
            "text": "You kick over a stool for effect. The stool belongs to the dog segment. The dog watches you set it back up.",
            "effects": {
              "creativity": 2,
              "cred": -2,
              "burnout": 4
            }
          },
          "good": {
            "text": "You perform to the empty studio like it owes you money. A clip escapes containment and does numbers locally.",
            "effects": {
              "creativity": 5,
              "fame": 5,
              "network": 2
            }
          },
          "incredible": {
            "text": "The chyron guy freestyles: “LOCAL MUSICIAN GOES OFF.” Someone rips it, posts it, and the comments are a fan club being born.",
            "effects": {
              "creativity": 7,
              "fame": 8,
              "cred": 3,
              "network": 3
            }
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
    "tags": [
      "social",
      "network"
    ],
    "choices": {
      "left": {
        "label": "Lurk and learn",
        "governingStats": {
          "cred": 1
        },
        "tags": [
          "social",
          "safe"
        ],
        "outcomes": {
          "bad": {
            "text": "You lurk so hard the chat forgets you exist. Someone asks “who added the ghost?”",
            "effects": {
              "cred": 2
            }
          },
          "good": {
            "text": "Three weeks of silence and you now know who books what, who flakes, and who owns the good PA. Priceless intel.",
            "effects": {
              "cred": 4,
              "network": 3
            }
          },
          "incredible": {
            "text": "You break your silence exactly once, with exactly the right joke, at exactly the right time. Legend status: quiet but permanent.",
            "effects": {
              "cred": 7,
              "network": 4,
              "fame": 2,
              "addFlag": "in_the_chat"
            }
          }
        }
      },
      "right": {
        "label": "Introduce yourself",
        "governingStats": {
          "network": 1
        },
        "tags": [
          "social",
          "network",
          "risky"
        ],
        "outcomes": {
          "bad": {
            "text": "You send a paragraph. With links. The chat responds with one thumbs-up, which in here is a door closing gently.",
            "effects": {
              "network": 2,
              "burnout": 3
            }
          },
          "good": {
            "text": "“who?” gets answered: someone vouches for you unprompted. In this chat, a vouch is a currency.",
            "effects": {
              "network": 5,
              "cred": 3,
              "addFlag": "in_the_chat"
            }
          },
          "incredible": {
            "text": "You answer the open date: “I’ll play it.” Booked in four messages. The chat’s founder DMs you: “finally, somebody quick.”",
            "effects": {
              "network": 7,
              "cred": 4,
              "fame": 3,
              "addFlag": "in_the_chat"
            }
          }
        }
      }
    }
  },
  {
    "id": "n1_chat_fest",
    "act": 1,
    "pathAffinity": [],
    "weight": 9,
    "art": "ev_n1_chat_fest",
    "context": "The group chat, planning at light speed",
    "prompt": "The chat has decided: YARDFEST. Six bands, one backyard, ten days, zero budget. Jobs are being assigned faster than anyone can decline them.",
    "tags": [
      "live",
      "social"
    ],
    "requires": {
      "flagsAll": [
        "in_the_chat"
      ]
    },
    "choices": {
      "left": {
        "label": "Volunteer to book it",
        "governingStats": {
          "network": 1,
          "cred": 0.3
        },
        "tags": [
          "network",
          "risky"
        ],
        "outcomes": {
          "bad": {
            "text": "Herding six bands is herding thirty people, two of whom are feuding over a borrowed cymbal from 2019. You age visibly.",
            "effects": {
              "network": 3,
              "burnout": 6
            }
          },
          "good": {
            "text": "It happens. On time, even. The yard holds, the cops wave, and everyone knows who made it work.",
            "effects": {
              "network": 5,
              "cred": 4,
              "fame": 3
            }
          },
          "incredible": {
            "text": "YARDFEST becomes a proper noun. People are already saying “next year.” You are, apparently, a festival now.",
            "effects": {
              "network": 8,
              "cred": 6,
              "fame": 6
            }
          }
        }
      },
      "right": {
        "label": "Just play your slot",
        "governingStats": {
          "skill": 1
        },
        "tags": [
          "live",
          "safe"
        ],
        "outcomes": {
          "bad": {
            "text": "Your slot is 2 p.m., direct sun, during the potluck rush. You compete with a casserole and lose.",
            "effects": {
              "skill": 2,
              "burnout": 3
            }
          },
          "good": {
            "text": "Golden hour slot. The yard fills, the dog stops barking, and somebody’s string lights come on during your closer.",
            "effects": {
              "skill": 4,
              "cred": 3,
              "fame": 3
            }
          },
          "incredible": {
            "text": "The whole backyard sings a chorus they learned thirty seconds ago. A neighbor complains, then stays for the encore.",
            "effects": {
              "skill": 6,
              "cred": 5,
              "fame": 6,
              "network": 2
            }
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
    "tags": [
      "live"
    ],
    "choices": {
      "left": {
        "label": "Commit to your version",
        "governingStats": {
          "creativity": 1
        },
        "tags": [
          "live",
          "risky",
          "indie"
        ],
        "outcomes": {
          "bad": {
            "text": "The regular mouths the real words at you like a hostage negotiator. Your fake bridge arrives. His face goes on a journey.",
            "effects": {
              "creativity": 2,
              "cred": -2,
              "burnout": 4
            }
          },
          "good": {
            "text": "Half the bar assumes it’s a bold rearrangement. The other half assumes they misremembered. Both halves clap.",
            "effects": {
              "creativity": 5,
              "cred": 3,
              "fame": 2
            }
          },
          "incredible": {
            "text": "The regular corners you after: “your bridge is better.” He’s been hearing this song for forty years. He would know.",
            "effects": {
              "creativity": 7,
              "cred": 6,
              "fame": 4
            }
          }
        }
      },
      "right": {
        "label": "Relearn it live, by ear",
        "governingStats": {
          "skill": 1
        },
        "tags": [
          "live",
          "safe",
          "practice"
        ],
        "outcomes": {
          "bad": {
            "text": "You hunt for the real chords in real time. The song becomes a documentary about searching.",
            "effects": {
              "skill": 2,
              "burnout": 4
            }
          },
          "good": {
            "text": "You find it by the second verse and land the ending like you knew it all along. Nobody saw the scaffolding.",
            "effects": {
              "skill": 5,
              "cred": 3
            }
          },
          "incredible": {
            "text": "Ear, hands, done — corrected mid-flight without dropping a beat. A guitarist at the bar quietly puts down his drink to watch your left hand.",
            "effects": {
              "skill": 7,
              "cred": 5,
              "network": 3
            }
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
    "tags": [
      "live",
      "work"
    ],
    "choices": {
      "left": {
        "label": "Buckle the amp in",
        "governingStats": {
          "network": 1
        },
        "tags": [
          "network",
          "safe"
        ],
        "outcomes": {
          "bad": {
            "text": "Rush hour. You stand for nine stops while your amp sits, belted, comfortable, judged by commuters.",
            "effects": {
              "network": 2,
              "burnout": 3
            }
          },
          "good": {
            "text": "The driver asks what you play. By stop six the whole front of the bus knows about the show. Two of them come.",
            "effects": {
              "network": 5,
              "fame": 3
            }
          },
          "incredible": {
            "text": "The driver detours HALF A BLOCK to drop you at the venue door. The bus applauds. Transit law bends for no one, except apparently you.",
            "effects": {
              "network": 7,
              "fame": 5,
              "cred": 4
            }
          }
        }
      },
      "right": {
        "label": "Practice quietly en route",
        "governingStats": {
          "skill": 1,
          "creativity": 0.3
        },
        "tags": [
          "practice",
          "risky"
        ],
        "outcomes": {
          "bad": {
            "text": "Unplugged fingerwork over engine noise. A teen films you with the caption “sir this is a bus.” Fair.",
            "effects": {
              "skill": 2,
              "fame": 2
            }
          },
          "good": {
            "text": "The bus rhythm locks into your song — brakes on the two and four. You arrive warmed up and weirdly inspired.",
            "effects": {
              "skill": 4,
              "creativity": 3
            }
          },
          "incredible": {
            "text": "Nine stops of silent shredding and you step off with the set memorized cold. The teen’s video does numbers. Caption unchanged.",
            "effects": {
              "skill": 6,
              "creativity": 3,
              "fame": 5
            }
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
    "tags": [
      "work",
      "practice"
    ],
    "choices": {
      "left": {
        "label": "Take the student",
        "governingStats": {
          "skill": 1,
          "network": 0.3
        },
        "tags": [
          "work",
          "practice",
          "risky"
        ],
        "outcomes": {
          "bad": {
            "text": "The kid learns fast, asks “why” at everything, and finds a hole in your theory knowledge the size of a garage door. You both take notes.",
            "effects": {
              "skill": 2,
              "money": 20,
              "burnout": 4
            }
          },
          "good": {
            "text": "Week four: the kid nails the riff and looks at you like you invented sound. Two more parents call. You are, somehow, a teacher.",
            "effects": {
              "skill": 4,
              "money": 40,
              "network": 3,
              "grantHustle": "lesson_studio"
            }
          },
          "incredible": {
            "text": "The kid plays their school talent show and thanks “my teacher” from the stage. You have a waitlist now. A WAITLIST.",
            "effects": {
              "skill": 6,
              "money": 60,
              "network": 4,
              "cred": 3,
              "fame": 2,
              "grantHustle": "lesson_studio"
            }
          }
        }
      },
      "right": {
        "label": "Refer them onward",
        "governingStats": {
          "cred": 1
        },
        "tags": [
          "network",
          "safe"
        ],
        "outcomes": {
          "bad": {
            "text": "You recommend the retired ace above the vape shop. The parent hears “vape shop” and hangs up.",
            "effects": {
              "cred": 2
            }
          },
          "good": {
            "text": "The referral lands. The ace sends a nod back down the mountain: “good instincts, kid.” The scene keeps receipts on generosity.",
            "effects": {
              "cred": 5,
              "network": 3
            }
          },
          "incredible": {
            "text": "The ace calls YOU. “You send me students, I send you sessions.” An economy of favors, and you are suddenly in it.",
            "effects": {
              "cred": 6,
              "network": 6,
              "money": 30
            }
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
    "tags": [
      "busk",
      "deal"
    ],
    "choices": {
      "left": {
        "label": "Publish the atlas",
        "governingStats": {
          "network": 1,
          "creativity": 0.3
        },
        "tags": [
          "deal",
          "busk",
          "risky"
        ],
        "outcomes": {
          "bad": {
            "text": "You sell three copies, and by Friday your own best corner has a line. You have disrupted yourself.",
            "effects": {
              "network": 2,
              "money": 25,
              "burnout": 3
            }
          },
          "good": {
            "text": "Photocopied, stapled, $10 each — and buskers start leaving you tips ON the corners you rated. The map becomes the territory.",
            "effects": {
              "network": 5,
              "money": 45,
              "cred": 3,
              "grantHustle": "corner_atlas"
            }
          },
          "incredible": {
            "text": "The atlas gets a name, a waiting list, and a quarterly update. Buskers cite page numbers at each other. You built infrastructure.",
            "effects": {
              "network": 7,
              "money": 70,
              "cred": 5,
              "fame": 3,
              "grantHustle": "corner_atlas"
            }
          }
        }
      },
      "right": {
        "label": "Guard the intel",
        "governingStats": {
          "cred": 1,
          "skill": 0.3
        },
        "tags": [
          "busk",
          "safe",
          "solo"
        ],
        "outcomes": {
          "bad": {
            "text": "You keep the secrets and the corners. The other buskers keep a respectful, slightly cold distance. Lonely at the top of page 31.",
            "effects": {
              "cred": 2,
              "money": 20
            }
          },
          "good": {
            "text": "The good corners stay quiet and the hauls stay yours. Craft plus logistics: an underrated combination.",
            "effects": {
              "cred": 3,
              "money": 55,
              "skill": 2
            }
          },
          "incredible": {
            "text": "You work the ranked corners like a farmer rotating crops. Best month yet, and a regular starts requesting you BY CORNER.",
            "effects": {
              "cred": 5,
              "money": 90,
              "skill": 3,
              "fame": 2
            }
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
    "tags": [
      "deal",
      "tone"
    ],
    "choices": {
      "left": {
        "label": "License the chord",
        "governingStats": {
          "network": 1,
          "creativity": 0.3
        },
        "tags": [
          "deal",
          "risky",
          "electronic"
        ],
        "outcomes": {
          "bad": {
            "text": "You record forty takes of one chord in their apartment while their roommate microwaves fish. The check is real but small.",
            "effects": {
              "network": 2,
              "money": 30,
              "burnout": 3
            }
          },
          "good": {
            "text": "The app ships. Strangers now wake up inside your chord every morning. The royalty is tiny, but it arrives like a sunrise: reliably.",
            "effects": {
              "network": 4,
              "money": 50,
              "fame": 3,
              "grantHustle": "alarm_app"
            }
          },
          "incredible": {
            "text": "A review calls it “the first alarm that feels like being forgiven.” Downloads spike. Somewhere, thousands of mornings are yours now.",
            "effects": {
              "network": 6,
              "money": 80,
              "fame": 6,
              "cred": 3,
              "grantHustle": "alarm_app"
            }
          }
        }
      },
      "right": {
        "label": "Keep the chord home",
        "governingStats": {
          "cred": 1
        },
        "tags": [
          "tone",
          "safe",
          "indie"
        ],
        "outcomes": {
          "bad": {
            "text": "You decline on principle. The developer nods, hurt, and licenses a wind chime instead. The wind chime does fine.",
            "effects": {
              "cred": 2
            }
          },
          "good": {
            "text": "“The chord means something WHERE IT IS.” The developer quotes you in a talk about artistic integrity. Odd, but the cred is real.",
            "effects": {
              "cred": 5,
              "fame": 2
            }
          },
          "incredible": {
            "text": "The refusal becomes scene lore — the musician who would not sell the soft part. People come to the shows just to hear it in context.",
            "effects": {
              "cred": 7,
              "fame": 4,
              "network": 2
            }
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
    "tags": [
      "live"
    ],
    "requires": {
      "weatherIs": "heatwave"
    },
    "choices": {
      "left": {
        "label": "Unplug. AC on. Go acoustic.",
        "governingStats": {
          "creativity": 1,
          "cred": 0.3
        },
        "tags": [
          "live",
          "safe",
          "roots"
        ],
        "outcomes": {
          "bad": {
            "text": "Acoustic in a room built for loud. The AC hums in E flat. Your set is now in E flat. All of it.",
            "effects": {
              "creativity": 2,
              "burnout": 3
            }
          },
          "good": {
            "text": "Cool air, quiet songs, a crowd that stops fanning itself to listen. The heat made everyone honest.",
            "effects": {
              "creativity": 5,
              "cred": 4,
              "fame": 3
            }
          },
          "incredible": {
            "text": "The stripped set becomes church. A bartender turns off the ice machine so it can be QUIETER. People talk about this night all summer.",
            "effects": {
              "creativity": 7,
              "cred": 6,
              "fame": 6,
              "network": 2
            }
          }
        }
      },
      "right": {
        "label": "Amp over AC. Full send.",
        "governingStats": {
          "skill": 1
        },
        "tags": [
          "live",
          "risky"
        ],
        "outcomes": {
          "bad": {
            "text": "You play loud into a sauna. Three songs in, the fuse makes its own decision. Darkness, heat, and one long feedback whine as a eulogy.",
            "effects": {
              "skill": 2,
              "burnout": 6,
              "fame": 2
            }
          },
          "good": {
            "text": "Sweat equity, literally. The crowd that stays becomes a unit — soaked, loud, loyal. Heatwave shows forge alloys.",
            "effects": {
              "skill": 5,
              "cred": 4,
              "fame": 4,
              "burnout": 4
            }
          },
          "incredible": {
            "text": "The hottest show of the year, in every sense. Someone faints, recovers, and refuses to leave. The promoter frames his ruined shirt.",
            "effects": {
              "skill": 7,
              "cred": 5,
              "fame": 7,
              "network": 3,
              "burnout": 4
            }
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
    "tags": [
      "live",
      "rest"
    ],
    "requires": {
      "weatherIs": "off_season"
    },
    "choices": {
      "left": {
        "label": "Play for the six",
        "governingStats": {
          "cred": 1,
          "skill": 0.3
        },
        "tags": [
          "live",
          "safe",
          "roots"
        ],
        "outcomes": {
          "bad": {
            "text": "Six people, zero pretense. When you rush the ending, all six notice. Winter people listen, alright.",
            "effects": {
              "cred": 2,
              "money": 20,
              "burnout": -2
            }
          },
          "good": {
            "text": "By the last song they’re requesting by feel — “the sad one again, but slower.” Six people, and the room is somehow full.",
            "effects": {
              "cred": 5,
              "money": 35,
              "burnout": -3,
              "skill": 2
            }
          },
          "incredible": {
            "text": "The owner locks the door at close and says “one more, just for us.” Seven people, one bar, the ocean outside. You will chase this feeling forever.",
            "effects": {
              "cred": 7,
              "money": 50,
              "fame": 2,
              "burnout": -5,
              "network": 2
            }
          }
        }
      },
      "right": {
        "label": "Workshop the new stuff",
        "governingStats": {
          "creativity": 1
        },
        "tags": [
          "write",
          "risky",
          "indie"
        ],
        "outcomes": {
          "bad": {
            "text": "You test four unfinished songs on six unimpressed lifers. The feedback is silence with eyebrows.",
            "effects": {
              "creativity": 2,
              "burnout": 3
            }
          },
          "good": {
            "text": "The empty town is a laboratory. You try wild arrangements, and the regulars grade honestly: two keepers, one “needs a bridge.”",
            "effects": {
              "creativity": 5,
              "skill": 3
            }
          },
          "incredible": {
            "text": "A retired fisherman fixes your second verse with one sentence about tides. You write it on your arm so you cannot lose it.",
            "effects": {
              "creativity": 8,
              "cred": 3,
              "skill": 2
            }
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
    "tags": [
      "live",
      "home"
    ],
    "requires": {
      "venueAny": true
    },
    "choices": {
      "left": {
        "label": "Pose like you belong",
        "governingStats": {
          "network": 1,
          "cred": 0.3
        },
        "tags": [
          "network",
          "safe",
          "home"
        ],
        "outcomes": {
          "bad": {
            "text": "You blink. The owner shrugs — “the wall takes what it takes” — and pins up the blink. You are eyelids now, forever, at {venue}.",
            "effects": {
              "network": 2,
              "cred": 2
            }
          },
          "good": {
            "text": "Click. Pinned between a darts champion and a poet. The owner taps the wall: “that spot has been waiting.”",
            "effects": {
              "network": 4,
              "cred": 4,
              "venueLove": 1
            }
          },
          "incredible": {
            "text": "The owner puts you at EYE LEVEL. Regulars notice within the hour. At {venue}, eye level is a knighthood.",
            "effects": {
              "network": 6,
              "cred": 6,
              "fame": 3,
              "venueLove": 1
            }
          }
        }
      },
      "right": {
        "label": "Earn it onstage first",
        "governingStats": {
          "skill": 1
        },
        "tags": [
          "live",
          "risky"
        ],
        "outcomes": {
          "bad": {
            "text": "You insist on playing first, then flub the closer. The owner takes the photo anyway, mid-wince. Honest wall, honest photo.",
            "effects": {
              "skill": 2,
              "burnout": 3
            }
          },
          "good": {
            "text": "You play the set of the month, then turn to the camera still sweating. THAT is the polaroid. It looks like arrival.",
            "effects": {
              "skill": 5,
              "cred": 4,
              "fame": 2,
              "venueLove": 1
            }
          },
          "incredible": {
            "text": "The room is still roaring when the flash goes. The owner writes one word under the photo: “OURS.” You look away so nobody sees your face do the thing.",
            "effects": {
              "skill": 6,
              "cred": 6,
              "fame": 4,
              "venueLove": 1,
              "burnout": -2
            }
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
    "tags": [
      "shop"
    ],
    "choices": {
      "left": {
        "label": "Buy the workhorse ($55)",
        "governingStats": {
          "cred": 1,
          "network": 0.4
        },
        "tags": [
          "shop",
          "deal"
        ],
        "cost": 55,
        "outcomes": {
          "bad": {
            "text": "It smells like four decades of banquet halls and it will not stop smelling like that. It works perfectly. You work around the smell.",
            "effects": {
              "money": -55,
              "grantGear": "random_basic"
            }
          },
          "good": {
            "text": "“That one did eight hundred weddings,” he says, wiping it down one last time. “Never missed a downbeat.” Neither will you.",
            "effects": {
              "money": -55,
              "grantGear": "random_basic",
              "cred": 3
            }
          },
          "incredible": {
            "text": "His wife overrules the sticker — “for a working musician, less.” He salutes you from the garage. The gear hums like it knows.",
            "effects": {
              "money": -40,
              "grantGear": "random_basic",
              "cred": 4,
              "network": 3
            }
          }
        }
      },
      "right": {
        "label": "Trade stories instead",
        "governingStats": {
          "network": 1
        },
        "tags": [
          "network",
          "safe"
        ],
        "outcomes": {
          "bad": {
            "text": "Two hours of anecdotes about a hora that went wrong in 1987. You buy nothing and learn one useful thing about tempo and grandmothers.",
            "effects": {
              "network": 2,
              "skill": 2
            }
          },
          "good": {
            "text": "He gives you the real curriculum: how to read a room, how to rescue a dying dance floor, which songs are load-bearing. Free. Priceless.",
            "effects": {
              "network": 4,
              "skill": 4,
              "cred": 2
            }
          },
          "incredible": {
            "text": "At sunset he hands you his booking ledger — forty years of venue contacts, annotated. “Somebody should keep the circuit alive.”",
            "effects": {
              "network": 8,
              "cred": 4,
              "money": 20
            }
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
    "tags": [
      "write",
      "work"
    ],
    "choices": {
      "left": {
        "label": "Write it on the tape",
        "minigame": "ideas",
        "governingStats": {
          "creativity": 1
        },
        "tags": [
          "write",
          "risky"
        ],
        "outcomes": {
          "bad": {
            "text": "You get four bars down before the line forms. A customer takes your song home stapled to her banana receipt. Gone. Mostly gone.",
            "effects": {
              "creativity": 2,
              "burnout": 3
            }
          },
          "good": {
            "text": "Eleven minutes, three feet of tape, one whole verse and a chorus. You clock out humming and transcribe it in the parking lot.",
            "effects": {
              "creativity": 5,
              "skill": 2,
              "writeSong": true
            }
          },
          "incredible": {
            "text": "The melody unspools like it was pre-printed on the roll. A regular reads it upside down and says “that’s going to be something.” She is right.",
            "effects": {
              "creativity": 7,
              "cred": 3,
              "fame": 2,
              "writeSong": true
            }
          }
        }
      },
      "right": {
        "label": "Hum it, hold the line",
        "governingStats": {
          "skill": 1
        },
        "tags": [
          "work",
          "safe"
        ],
        "outcomes": {
          "bad": {
            "text": "You hum it for two hours to keep it alive. By close it has mutated into a jingle for a store that does not exist.",
            "effects": {
              "skill": 2,
              "money": 20
            }
          },
          "good": {
            "text": "You guard the melody in your skull through sixty transactions and one price check. It survives. So does your job.",
            "effects": {
              "skill": 4,
              "money": 30,
              "creativity": 2
            }
          },
          "incredible": {
            "text": "You hum it so relentlessly a coworker starts harmonizing from aisle five. By close it has a second part it never asked for. Keeper.",
            "effects": {
              "skill": 5,
              "creativity": 4,
              "money": 30,
              "network": 2
            }
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
    "tags": [
      "write",
      "home"
    ],
    "choices": {
      "left": {
        "label": "Transcribe the cadence",
        "governingStats": {
          "creativity": 1
        },
        "tags": [
          "write",
          "risky",
          "indie"
        ],
        "outcomes": {
          "bad": {
            "text": "You get the rhythm down just as they make up, loudly, which is a different genre. You keep the first half.",
            "effects": {
              "creativity": 2,
              "burnout": 3
            }
          },
          "good": {
            "text": "You change the names, keep the meter, and build a song on the bones of somebody else’s Tuesday. The chorus hits like a slammed door.",
            "effects": {
              "creativity": 5,
              "cred": 2,
              "writeSong": true
            }
          },
          "incredible": {
            "text": "The song pours out whole. Months later a stranger will tell you it is “exactly what fighting feels like.” You will thank the ceiling privately.",
            "effects": {
              "creativity": 8,
              "cred": 4,
              "fame": 2,
              "writeSong": true
            }
          }
        }
      },
      "right": {
        "label": "Knock and check on them",
        "governingStats": {
          "network": 1,
          "cred": 0.3
        },
        "tags": [
          "home",
          "safe",
          "family"
        ],
        "outcomes": {
          "bad": {
            "text": "They answer the door mid-sentence, united instantly against you. The argument was apparently load-bearing.",
            "effects": {
              "network": 2
            }
          },
          "good": {
            "text": "They deflate, apologize, and invite you in for tea. Turns out the fight was about a lamp. Most fights are about a lamp.",
            "effects": {
              "network": 4,
              "cred": 3,
              "burnout": -3
            }
          },
          "incredible": {
            "text": "The tea becomes a tradition. The couple becomes your fiercest local fans, and their lamp story becomes your best between-song banter.",
            "effects": {
              "network": 6,
              "cred": 4,
              "fame": 2,
              "burnout": -4
            }
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
    "tags": [
      "band",
      "network"
    ],
    "choices": {
      "left": {
        "label": "Jam the test signal",
        "governingStats": {
          "skill": 1,
          "network": 0.4
        },
        "tags": [
          "band",
          "risky"
        ],
        "outcomes": {
          "bad": {
            "text": "You clam the first change and the tech winces like the amp did. “Output’s fine,” they say, unplugging. “Input needs work.”",
            "effects": {
              "skill": 2,
              "burnout": 3
            }
          },
          "good": {
            "text": "Twenty unplanned minutes. Customers stop browsing to watch. The tech nods at the end, which — per the regulars — has never happened.",
            "effects": {
              "skill": 4,
              "network": 4,
              "cred": 3
            }
          },
          "incredible": {
            "text": "The jam locks in so hard the tech flips the sign to CLOSED. “I fix amps because nobody around here could PLAY,” they say. “Rehearsal’s Tuesday.”",
            "effects": {
              "skill": 6,
              "network": 5,
              "cred": 4,
              "fame": 2,
              "grantBandmate": "random"
            }
          }
        }
      },
      "right": {
        "label": "Pay, thank, and go",
        "governingStats": {
          "cred": 1
        },
        "tags": [
          "safe",
          "work"
        ],
        "outcomes": {
          "bad": {
            "text": "You pay full price and leave during the riff. On the bus you realize the riff is stuck in your head, rent-free, forever.",
            "effects": {
              "cred": 2,
              "money": -30
            }
          },
          "good": {
            "text": "You tip what you can and say what the riff deserved. The tech waves it off but writes your name on the GOOD customers list.",
            "effects": {
              "cred": 4,
              "network": 3,
              "money": -25
            }
          },
          "incredible": {
            "text": "“Bring it back before it breaks, not after,” the tech says, and knocks the bill down to parts. Your amp will never fear death again.",
            "effects": {
              "cred": 5,
              "network": 4,
              "money": -10
            }
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
    "tags": [
      "home",
      "network"
    ],
    "choices": {
      "left": {
        "label": "Assemble the muscle",
        "governingStats": {
          "network": 1
        },
        "tags": [
          "network",
          "risky",
          "home"
        ],
        "outcomes": {
          "bad": {
            "text": "Four people, one staircase, physics. The piano survives; a door frame and one friendship require repairs. You own a piano and an apology tour.",
            "effects": {
              "network": 2,
              "burnout": 6,
              "cred": 2
            }
          },
          "good": {
            "text": "It takes five hours, two pizzas, and a rope you had no right to trust. At sundown, a piano stands in your living room like it grew there.",
            "effects": {
              "network": 5,
              "creativity": 3,
              "cred": 2
            }
          },
          "incredible": {
            "text": "The move becomes a block event. Neighbors carry, kids direct traffic, someone brings lemonade. The piano arrives with a fan club attached.",
            "effects": {
              "network": 7,
              "creativity": 4,
              "cred": 3,
              "fame": 2
            }
          }
        }
      },
      "right": {
        "label": "Play it once, walk away",
        "governingStats": {
          "creativity": 1
        },
        "tags": [
          "solo",
          "safe",
          "rest"
        ],
        "outcomes": {
          "bad": {
            "text": "You play it on the porch for an hour and walk home empty-handed, haunted by an instrument. There is a song in this. There had better be.",
            "effects": {
              "creativity": 2,
              "burnout": -2
            }
          },
          "good": {
            "text": "One golden hour on a stranger’s porch, then goodbye. The melody you found follows you home, which is lighter than a piano.",
            "effects": {
              "creativity": 5,
              "burnout": -3
            }
          },
          "incredible": {
            "text": "The owner listens from the window, then comes out crying. It was her mother’s. She keeps the piano. You keep an open invitation to play it, always.",
            "effects": {
              "creativity": 7,
              "network": 3,
              "cred": 3,
              "burnout": -3
            }
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
    "tags": [
      "home",
      "deal"
    ],
    "choices": {
      "left": {
        "label": "Negotiate one more night",
        "governingStats": {
          "network": 1
        },
        "tags": [
          "network",
          "risky",
          "deal"
        ],
        "outcomes": {
          "bad": {
            "text": "Dee says yes with the specific tone that means you owe her a favor of unbounded size, redeemable without warning. The amp is heavy tonight.",
            "effects": {
              "network": 2,
              "burnout": 3
            }
          },
          "good": {
            "text": "Dee trades one more night for two of your future load-ins. Fair market rate in the borrowed-gear economy. The show goes on, at full volume.",
            "effects": {
              "network": 4,
              "cred": 3
            }
          },
          "incredible": {
            "text": "Dee comes TO the show to collect the amp — and watches you play through it first. After: “keep it till you can afford your own. It sounds right with you.”",
            "effects": {
              "network": 6,
              "cred": 5,
              "fame": 2
            }
          }
        }
      },
      "right": {
        "label": "Play the tiny backup",
        "governingStats": {
          "creativity": 1,
          "skill": 0.3
        },
        "tags": [
          "live",
          "safe",
          "tone"
        ],
        "outcomes": {
          "bad": {
            "text": "The backup amp is the size of a toaster and has one opinion. The quiet set gets quieter every time the fridge kicks on.",
            "effects": {
              "creativity": 2,
              "burnout": 3
            }
          },
          "good": {
            "text": "Constraint breeds arrangement. You rebuild the set small and close, and the room leans in to meet it. Returning the amp Friday feels like a molt.",
            "effects": {
              "creativity": 5,
              "skill": 3,
              "cred": 2
            }
          },
          "incredible": {
            "text": "The tiny rig forces a sound you would never have chosen — and it is YOURS, the first sound that is. Dee gets her amp back. You keep the discovery.",
            "effects": {
              "creativity": 7,
              "skill": 3,
              "cred": 4
            }
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
    "tags": [
      "work",
      "live"
    ],
    "choices": {
      "left": {
        "label": "Take the residency",
        "governingStats": {
          "skill": 1,
          "network": 0.3
        },
        "tags": [
          "work",
          "safe",
          "roots"
        ],
        "outcomes": {
          "bad": {
            "text": "Nine a.m. is a genre of its own. You discover which of your fingers wake up last, in front of a congregation, weekly.",
            "effects": {
              "skill": 2,
              "money": 40,
              "burnout": 4
            }
          },
          "good": {
            "text": "Weekly reps in front of forgiving people who sing along on purpose. Your rhythm playing gets bulletproof. The pancakes are, frankly, elite.",
            "effects": {
              "skill": 5,
              "money": 40,
              "network": 2,
              "addPromise": {
                "label": "Play four Sundays running",
                "tags": [
                  "work",
                  "live"
                ],
                "cards": 4,
                "reward": {
                  "money": 60,
                  "network": 3,
                  "cred": 2
                },
                "penalty": {
                  "cred": -3
                }
              }
            }
          },
          "incredible": {
            "text": "Pastor Ruth lets you sneak an original into the offertory. Nobody notices it is yours. Everybody hums it in the parking lot. Field-tested. Blessed, even.",
            "effects": {
              "skill": 6,
              "money": 50,
              "creativity": 3,
              "network": 3
            }
          }
        }
      },
      "right": {
        "label": "Keep Sundays sacred (for sleep)",
        "governingStats": {
          "creativity": 1
        },
        "tags": [
          "rest",
          "safe",
          "home"
        ],
        "outcomes": {
          "bad": {
            "text": "You decline and then wake up at nine every Sunday anyway, out of guilt. The guilt does not pay forty dollars.",
            "effects": {
              "creativity": 2
            }
          },
          "good": {
            "text": "Protected sleep, protected writing mornings. Sunday becomes the day the good ideas know to visit.",
            "effects": {
              "creativity": 5,
              "burnout": -4
            }
          },
          "incredible": {
            "text": "Pastor Ruth respects it completely — and hires you for the twice-a-year evening services instead, at triple rate. Boundaries, rewarded. A miracle.",
            "effects": {
              "creativity": 5,
              "burnout": -4,
              "money": 45,
              "network": 3
            }
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
    "tags": [
      "live"
    ],
    "choices": {
      "left": {
        "label": "Play the standards",
        "governingStats": {
          "skill": 1
        },
        "tags": [
          "live",
          "safe",
          "mainstream"
        ],
        "outcomes": {
          "bad": {
            "text": "You play a standard 40 bpm too fast. Eleanor holds up one finger, lowers it slowly, and the entire room breathes with her. You obey the finger.",
            "effects": {
              "skill": 2,
              "money": 25
            }
          },
          "good": {
            "text": "You land the standards where they live. Two residents dance. The director mouths “they NEVER dance” over her headset.",
            "effects": {
              "skill": 5,
              "money": 40,
              "cred": 2
            }
          },
          "incredible": {
            "text": "Eleanor stands, uninvited, and takes the second verse. You back her like your life depends on it, because it does. Nobody in that room will forget it. Neither will you.",
            "effects": {
              "skill": 7,
              "cred": 5,
              "money": 40,
              "network": 2,
              "fame": 2
            }
          }
        }
      },
      "right": {
        "label": "Play the originals for Eleanor",
        "governingStats": {
          "creativity": 1,
          "cred": 0.4
        },
        "tags": [
          "live",
          "risky",
          "indie"
        ],
        "outcomes": {
          "bad": {
            "text": "Eleanor listens to your saddest original with her eyes closed. Verdict: “The words are ahead of the music, dear.” She is right. It stings for a week.",
            "effects": {
              "creativity": 2,
              "burnout": 3
            }
          },
          "good": {
            "text": "Eleanor requests the second one AGAIN. “That one is honest,” she rules, and the room defers. Highest court in the land.",
            "effects": {
              "creativity": 5,
              "cred": 4,
              "money": 30
            }
          },
          "incredible": {
            "text": "After the set, Eleanor teaches you — in eleven minutes, by the juice station — a thing about phrasing that no lesson ever touched. “Come back Thursday. We’re not done.”",
            "effects": {
              "creativity": 6,
              "skill": 4,
              "cred": 4,
              "network": 2
            }
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
    "tags": [
      "work"
    ],
    "requires": {
      "moneyMax": 60
    },
    "choices": {
      "left": {
        "label": "Donate and daydream",
        "governingStats": {
          "creativity": 1
        },
        "tags": [
          "work",
          "safe"
        ],
        "outcomes": {
          "bad": {
            "text": "You feel like a wrung-out towel for two days, and the smooth jazz colonizes your dreams. The $45 is real, at least.",
            "effects": {
              "creativity": 2,
              "money": 45,
              "burnout": 4
            }
          },
          "good": {
            "text": "Forty-five minutes of enforced stillness turns out to be where melodies hide. You leave with cash and a chorus.",
            "effects": {
              "creativity": 5,
              "money": 45
            }
          },
          "incredible": {
            "text": "The nurse recognizes you from a show. She upgrades your juice, and hums YOUR song while checking your vitals. Your song. In the plasma center. That counts.",
            "effects": {
              "creativity": 5,
              "money": 45,
              "fame": 3,
              "cred": 2
            }
          }
        }
      },
      "right": {
        "label": "Busk the sidewalk outside instead",
        "governingStats": {
          "cred": 1,
          "skill": 0.3
        },
        "tags": [
          "busk",
          "risky"
        ],
        "outcomes": {
          "bad": {
            "text": "Your audience is people who just sold plasma. Generous hearts, empty pockets, some literally. You make $9 and one friend.",
            "effects": {
              "cred": 2,
              "money": 9,
              "network": 2
            }
          },
          "good": {
            "text": "People walking IN tip better than people walking out — hope money. You clear more than a donation, blood intact.",
            "effects": {
              "cred": 4,
              "money": 55,
              "skill": 2
            }
          },
          "incredible": {
            "text": "The center’s manager pays you $40 to play Fridays — “calms the first-timers.” You are now, medically speaking, an anesthetic.",
            "effects": {
              "cred": 5,
              "money": 70,
              "network": 3,
              "fame": 2
            }
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
    "tags": [
      "work",
      "live"
    ],
    "choices": {
      "left": {
        "label": "Wear the polo, get paid",
        "governingStats": {
          "skill": 1
        },
        "tags": [
          "work",
          "safe",
          "mainstream"
        ],
        "outcomes": {
          "bad": {
            "text": "Four hours of upbeat into a parking lot. A sales guy requests “something with more BUY energy.” You do not know that key. Nobody does.",
            "effects": {
              "skill": 2,
              "money": 80,
              "burnout": 5
            }
          },
          "good": {
            "text": "You treat it like reps: four hours tight, professional, weatherproof. The GM books you for LABOR DAY BLOWOUT on the spot.",
            "effects": {
              "skill": 4,
              "money": 80,
              "network": 3
            }
          },
          "incredible": {
            "text": "A family buys a minivan and swears your song sealed it. The salesman splits his commission mood with you: a crisp bonus and a hot dog. Show business.",
            "effects": {
              "skill": 5,
              "money": 110,
              "network": 3,
              "fame": 2
            }
          }
        }
      },
      "right": {
        "label": "Polo, but make it art",
        "governingStats": {
          "creativity": 1
        },
        "tags": [
          "work",
          "risky",
          "indie"
        ],
        "outcomes": {
          "bad": {
            "text": "You improvise a nine-minute piece about the tube man’s inner life. The GM calls it “not BUY energy.” You keep $40 and your dignity, partially.",
            "effects": {
              "creativity": 3,
              "money": 40,
              "burnout": 3
            }
          },
          "good": {
            "text": "You sync your set to the tube man’s flailing. Customers film it. The dealership’s page posts it. It is, objectively, art.",
            "effects": {
              "creativity": 5,
              "fame": 4,
              "money": 80
            }
          },
          "incredible": {
            "text": "The tube man duet goes locally viral: “this dealership has a better live show than the amphitheater.” The GM prints the comment and frames it. So do you.",
            "effects": {
              "creativity": 7,
              "fame": 7,
              "money": 80,
              "cred": 2
            }
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
    "tags": [
      "live",
      "social"
    ],
    "choices": {
      "left": {
        "label": "Take the whole lecture",
        "governingStats": {
          "cred": 1
        },
        "tags": [
          "social",
          "safe"
        ],
        "outcomes": {
          "bad": {
            "text": "The rules take forty minutes and include a genealogy of every band that ever ran long and where they are now. (Nowhere. They are all nowhere.)",
            "effects": {
              "cred": 2,
              "burnout": 3
            }
          },
          "good": {
            "text": "Vess covers slot times, gear sharing, and why you thank the sound guy BY NAME. You take actual notes. Vess pretends not to be pleased.",
            "effects": {
              "cred": 5,
              "network": 3
            }
          },
          "incredible": {
            "text": "Somewhere in hour two it stops being a lecture and becomes an inheritance. Vess ends with: “I only explain it to the ones worth keeping.”",
            "effects": {
              "cred": 7,
              "network": 5,
              "skill": 2
            }
          }
        }
      },
      "right": {
        "label": "Defend the long song",
        "governingStats": {
          "creativity": 1
        },
        "tags": [
          "social",
          "risky",
          "indie"
        ],
        "outcomes": {
          "bad": {
            "text": "“The song needed eleven more minutes,” you say. “The headliner needed them more,” says Vess, and walks. The scene is chilly for a week.",
            "effects": {
              "creativity": 2,
              "cred": -3,
              "burnout": 3
            }
          },
          "good": {
            "text": "You argue your case. Vess argues back. Forty minutes later you have a compromise, a coffee, and a grudging “the song WAS good, that’s the annoying part.”",
            "effects": {
              "creativity": 4,
              "cred": 3,
              "network": 2
            }
          },
          "incredible": {
            "text": "Vess listens, then delivers the highest ruling available: “Next time, tell the booker you need a long slot. You’ve earned asking.” A door you did not know existed, now open.",
            "effects": {
              "creativity": 6,
              "cred": 5,
              "network": 4
            }
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
    "tags": [
      "social",
      "work"
    ],
    "choices": {
      "left": {
        "label": "Let Oz redesign it",
        "governingStats": {
          "network": 1
        },
        "tags": [
          "network",
          "safe"
        ],
        "outcomes": {
          "bad": {
            "text": "Oz has strong opinions and stronger fonts. The flyer is now beautiful and slightly about Oz. People compliment the flyer. The flyer.",
            "effects": {
              "network": 2,
              "money": -10
            }
          },
          "good": {
            "text": "Twenty minutes of hovering later: a flyer that could stop a bus. Oz charges you for one copy and prints forty. “Overnight rates.”",
            "effects": {
              "network": 4,
              "fame": 3,
              "cred": 2
            }
          },
          "incredible": {
            "text": "Oz, it emerges, designed album covers in a previous life. You leave with forty flyers, a logo, and a standing 1 a.m. design department.",
            "effects": {
              "network": 6,
              "fame": 4,
              "cred": 4
            }
          }
        }
      },
      "right": {
        "label": "Defend the Sharpie original",
        "governingStats": {
          "cred": 1,
          "creativity": 0.3
        },
        "tags": [
          "indie",
          "risky"
        ],
        "outcomes": {
          "bad": {
            "text": "“It has raw energy,” you say. “It has a typo,” says Oz. You check. It has a typo. Forty copies of a typo.",
            "effects": {
              "cred": 2,
              "money": -10,
              "burnout": 3
            }
          },
          "good": {
            "text": "The hand-drawn mess is unmistakably yours, and around here that reads as a signature. People keep them. Some frame them.",
            "effects": {
              "cred": 5,
              "fame": 2
            }
          },
          "incredible": {
            "text": "Oz photographs your flyer for a zine about “outsider show art.” Your worst handwriting becomes your first press. Oz asks you to sign one.",
            "effects": {
              "cred": 6,
              "fame": 4,
              "network": 3
            }
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
    "tags": [
      "record",
      "social"
    ],
    "choices": {
      "left": {
        "label": "Submit the safe one",
        "governingStats": {
          "skill": 1
        },
        "tags": [
          "record",
          "safe"
        ],
        "outcomes": {
          "bad": {
            "text": "“Competent,” says the club, which in this room is a slur. You sit on your hands and nod like it is not yours. Your hands know.",
            "effects": {
              "skill": 2,
              "burnout": 3
            }
          },
          "good": {
            "text": "Real notes from real ears: the bridge drags, the hook lands, the outro is a keeper. You leave with a to-do list worth more than a review.",
            "effects": {
              "skill": 5,
              "cred": 3
            }
          },
          "incredible": {
            "text": "The room goes quiet after, which — per club bylaws — is the highest score. Someone asks to hear it AGAIN. The rule book has no procedure for again.",
            "effects": {
              "skill": 6,
              "cred": 6,
              "network": 3
            }
          }
        }
      },
      "right": {
        "label": "Submit the weird one",
        "governingStats": {
          "creativity": 1
        },
        "tags": [
          "record",
          "risky",
          "indie"
        ],
        "outcomes": {
          "bad": {
            "text": "Ninety seconds in, a founding member says “is the tape broken or is this a choice?” It was a choice. You defend it anonymously, in third person, sweating.",
            "effects": {
              "creativity": 3,
              "burnout": 4
            }
          },
          "good": {
            "text": "The club argues about it for twenty minutes, which is nineteen more than anything else tonight. Argument, here, is affection.",
            "effects": {
              "creativity": 5,
              "cred": 4
            }
          },
          "incredible": {
            "text": "The store owner unmasks you by ear — “only one person in this town hears like that” — and puts the demo on the STORE STEREO. During business hours. Canonized.",
            "effects": {
              "creativity": 7,
              "cred": 6,
              "fame": 3,
              "network": 2
            }
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
    "tags": [
      "social",
      "network"
    ],
    "choices": {
      "left": {
        "label": "Trade labor for the shot",
        "governingStats": {
          "network": 1,
          "cred": 0.3
        },
        "tags": [
          "network",
          "safe"
        ],
        "outcomes": {
          "bad": {
            "text": "You spend Saturday fighting a laser level and drop exactly one frame. Not yours, thankfully. Mika forgives. The wall does not forget.",
            "effects": {
              "network": 2,
              "burnout": 3
            }
          },
          "good": {
            "text": "Six hours of hanging, leveling, and takeout later, the show is up and the jump photo is yours, full resolution, signed. Fair trade. Great trade.",
            "effects": {
              "network": 4,
              "cred": 4,
              "fame": 2
            }
          },
          "incredible": {
            "text": "Opening night: your photo hangs at the center of the show. People ask Mika who you are. Mika says your name like it is already an answer.",
            "effects": {
              "network": 6,
              "cred": 5,
              "fame": 5
            }
          }
        }
      },
      "right": {
        "label": "Scrape together print money",
        "governingStats": {
          "cred": 1
        },
        "tags": [
          "deal",
          "risky"
        ],
        "outcomes": {
          "bad": {
            "text": "You offer $20. Mika, gently: “It’s not for sale, it’s for TRADE.” You have misread the entire economy. Rookie error, forgiven slowly.",
            "effects": {
              "cred": 2,
              "burnout": 3
            }
          },
          "good": {
            "text": "Mika takes the $20 as a “materials donation” and prints it big. Artists paying artists — the rarest transaction in the scene, noted by all.",
            "effects": {
              "cred": 5,
              "money": -20,
              "fame": 2
            }
          },
          "incredible": {
            "text": "Your crumpled twenty becomes scene legend: the first money Mika ever took. They tape it to the darkroom wall and print you everything. EVERYTHING.",
            "effects": {
              "cred": 6,
              "money": -20,
              "network": 4,
              "fame": 3
            }
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
    "tags": [
      "live",
      "tone"
    ],
    "choices": {
      "left": {
        "label": "Strip the songs bare",
        "governingStats": {
          "skill": 1,
          "cred": 0.3
        },
        "tags": [
          "live",
          "safe",
          "vocal"
        ],
        "outcomes": {
          "bad": {
            "text": "Every fret squeak is now a band member. Your breathing has a solo. The room hears ALL of it, kindly, which is worse.",
            "effects": {
              "skill": 2,
              "burnout": 4
            }
          },
          "good": {
            "text": "Naked arrangements, nowhere to hide, and the songs hold. You learn which ones were songs and which ones were volume.",
            "effects": {
              "skill": 5,
              "cred": 4
            }
          },
          "incredible": {
            "text": "A pin literally drops — someone’s badge, back row — and the whole room hears it between your verses and nobody moves. You own silence now.",
            "effects": {
              "skill": 7,
              "cred": 6,
              "fame": 3
            }
          }
        }
      },
      "right": {
        "label": "Whisper the loud one",
        "governingStats": {
          "creativity": 1
        },
        "tags": [
          "live",
          "risky",
          "tone"
        ],
        "outcomes": {
          "bad": {
            "text": "Your anthem, whispered, turns out to be a threat. The front row leans back in unison. You finish it anyway, menacingly gentle.",
            "effects": {
              "creativity": 3,
              "burnout": 3
            }
          },
          "good": {
            "text": "The banger becomes a lullaby with teeth. People who knew the loud version make the face of someone rereading a letter.",
            "effects": {
              "creativity": 5,
              "cred": 4,
              "fame": 2
            }
          },
          "incredible": {
            "text": "The whispered version is BETTER. You know it, the room knows it, and the organizer books you for the next three Quiet Nights before you reach the door.",
            "effects": {
              "creativity": 7,
              "cred": 5,
              "network": 3,
              "fame": 3
            }
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
    "tags": [
      "social"
    ],
    "requires": {
      "fameMax": 25
    },
    "choices": {
      "left": {
        "label": "Mobilize everyone you know",
        "governingStats": {
          "network": 1
        },
        "tags": [
          "network",
          "risky",
          "social"
        ],
        "outcomes": {
          "bad": {
            "text": "Your whole contact list dials at once. Your MOM gets through as caller nine and panics: “I’m calling for my child.” The DJ plays it on air for a week.",
            "effects": {
              "network": 2,
              "fame": 3,
              "burnout": 3
            }
          },
          "good": {
            "text": "Fourteen friends, three phones each. Caller nine is your old coworker, who redeems the studio day in your name without being asked. The group chat erupts.",
            "effects": {
              "network": 5,
              "cred": 3,
              "fame": 2
            }
          },
          "incredible": {
            "text": "The DJ smells the coordinated assault and finds it delightful: “This kid weaponized an entire zip code.” You win the day AND an on-air interview.",
            "effects": {
              "network": 7,
              "fame": 6,
              "cred": 3
            }
          }
        }
      },
      "right": {
        "label": "Keep redialing alone",
        "governingStats": {
          "skill": 1
        },
        "tags": [
          "solo",
          "safe"
        ],
        "outcomes": {
          "bad": {
            "text": "Caller six. Caller eight. Caller TEN. You hear caller nine win your studio day with an air-horn noise they make with their mouth.",
            "effects": {
              "skill": 2,
              "burnout": 3
            }
          },
          "good": {
            "text": "Forty redials of pure stubbornness. Caller nine. You are so shocked you nearly hang up. The DJ: “You sound like you NEED this.” Correct.",
            "effects": {
              "skill": 3,
              "fame": 3,
              "cred": 3
            }
          },
          "incredible": {
            "text": "You win, and when the DJ asks what you play, you play it — down the phone, live on air, one take. The request lines light up asking who that was.",
            "effects": {
              "skill": 5,
              "fame": 7,
              "cred": 4,
              "network": 2
            }
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
    "tags": [
      "busk",
      "work"
    ],
    "choices": {
      "left": {
        "label": "Audition for the clerk",
        "governingStats": {
          "skill": 1
        },
        "tags": [
          "busk",
          "safe",
          "live"
        ],
        "outcomes": {
          "bad": {
            "text": "The marble turns your tight little song into soup. The clerk stamps the permit anyway: “That’s the room’s fault, hon.” The guards agree.",
            "effects": {
              "skill": 2,
              "money": -30
            }
          },
          "good": {
            "text": "That reverb. THAT REVERB. You stretch the ending just to live in it. The clerk stamps the permit with unnecessary flourish. A guard tips you inside city hall.",
            "effects": {
              "skill": 4,
              "cred": 3,
              "money": -20
            }
          },
          "incredible": {
            "text": "By the last chorus, three floors of civil servants are leaning over the railings. The clerk waives the fee under “cultural enrichment, misc.” Government works sometimes.",
            "effects": {
              "skill": 6,
              "cred": 4,
              "fame": 4,
              "network": 2
            }
          }
        }
      },
      "right": {
        "label": "Busk unlicensed, stay nimble",
        "governingStats": {
          "cred": 1,
          "network": 0.3
        },
        "tags": [
          "busk",
          "risky"
        ],
        "outcomes": {
          "bad": {
            "text": "You get moved along twice and develop a sixth sense for clipboard-shaped silhouettes. Exhausting. Educational. Nine dollars.",
            "effects": {
              "cred": 2,
              "money": 9,
              "burnout": 4
            }
          },
          "good": {
            "text": "The outlaw corners are the good corners. You stay mobile, stay paid, and learn the beat cop’s lunch schedule by heart.",
            "effects": {
              "cred": 4,
              "money": 50
            }
          },
          "incredible": {
            "text": "The beat cop finally corners you — and requests a song. For his anniversary. You play it. He “forgets” the citation pad exists, permanently.",
            "effects": {
              "cred": 6,
              "money": 65,
              "network": 3,
              "fame": 2
            }
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
    "tags": [
      "live",
      "social"
    ],
    "choices": {
      "left": {
        "label": "Play the crowd-pleaser",
        "governingStats": {
          "network": 1,
          "skill": 0.3
        },
        "tags": [
          "live",
          "safe",
          "mainstream"
        ],
        "outcomes": {
          "bad": {
            "text": "Half the room sings along in a different key, with commitment. The birthday girl’s uncle takes over on verse two. It is his party now.",
            "effects": {
              "network": 2,
              "burnout": 3
            }
          },
          "good": {
            "text": "The singalong lands. Strangers become a choir. Someone asks “do you do EVENTS?” with money in their voice.",
            "effects": {
              "network": 5,
              "fame": 2,
              "money": 20
            }
          },
          "incredible": {
            "text": "The kitchen empties into the living room. Phones come out. By midnight you have eleven new followers and two party bookings. The cake was also good.",
            "effects": {
              "network": 7,
              "fame": 5,
              "money": 30
            }
          }
        }
      },
      "right": {
        "label": "Premiere the new one",
        "governingStats": {
          "creativity": 1
        },
        "tags": [
          "risky",
          "indie",
          "live"
        ],
        "outcomes": {
          "bad": {
            "text": "You debut an unfinished ballad at a birthday party. The energy leaves the room like air from a punctured float. Someone restarts the playlist mid-bridge.",
            "effects": {
              "creativity": 2,
              "burnout": 4
            }
          },
          "good": {
            "text": "The room goes quiet in the good way. The birthday girl declares it “her birthday song” forever. Annual royalties: one slice of cake.",
            "effects": {
              "creativity": 5,
              "cred": 3,
              "fame": 2
            }
          },
          "incredible": {
            "text": "A stranger in the corner listens with their whole body, then introduces themselves: they book a real room downtown. “Bring THAT song.”",
            "effects": {
              "creativity": 7,
              "network": 4,
              "cred": 3,
              "fame": 3
            }
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
    "tags": [
      "roots",
      "live"
    ],
    "choices": {
      "left": {
        "label": "Follow their lead",
        "governingStats": {
          "skill": 1
        },
        "tags": [
          "roots",
          "safe",
          "practice"
        ],
        "outcomes": {
          "bad": {
            "text": "They change keys via eyebrow and you miss the memo twice. The banjo player pats your knee: “Everybody drowns their first Sunday.”",
            "effects": {
              "skill": 2,
              "burnout": -2
            }
          },
          "good": {
            "text": "You shut up and comp for two hours, and somewhere in there your right hand learns something it will never unlearn.",
            "effects": {
              "skill": 5,
              "cred": 3,
              "burnout": -3
            }
          },
          "incredible": {
            "text": "The fiddle player passes you the melody without warning — the circle’s highest honor — and you carry it home. Nods all around. SLOW nods.",
            "effects": {
              "skill": 7,
              "cred": 5,
              "network": 3,
              "burnout": -3
            }
          }
        }
      },
      "right": {
        "label": "Offer the circle your song",
        "governingStats": {
          "creativity": 1,
          "cred": 0.3
        },
        "tags": [
          "roots",
          "risky",
          "write"
        ],
        "outcomes": {
          "bad": {
            "text": "Your chord chart confuses the dobro, and a song that took you months gets politely dismantled in four minutes. “Nice bones,” says the fiddle player. Bones.",
            "effects": {
              "creativity": 2,
              "burnout": 3
            }
          },
          "good": {
            "text": "They pick up your tune by ear on the second pass and improve it in ways you will be stealing for years. The circle keeps what it likes. It kept yours.",
            "effects": {
              "creativity": 5,
              "skill": 3,
              "cred": 3
            }
          },
          "incredible": {
            "text": "Next Sunday, you arrive to hear the circle already playing your song — it entered the repertoire while you slept. That is how standards are born. Yours just was.",
            "effects": {
              "creativity": 7,
              "cred": 6,
              "fame": 3
            }
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
    "tags": [
      "record",
      "home"
    ],
    "choices": {
      "left": {
        "label": "Chase the perfect take",
        "minigame": "take",
        "governingStats": {
          "skill": 1
        },
        "tags": [
          "record",
          "risky",
          "studio"
        ],
        "outcomes": {
          "bad": {
            "text": "Take eleven is THE ONE — and the phone dies on the last chorus. You sit in a dark sedan, in a garage, grieving audio. The blankets absorb the scream. Take twelve exists, at least.",
            "effects": {
              "skill": 3,
              "burnout": 5
            }
          },
          "good": {
            "text": "Take seven, 4% battery: clean, close, alive. You listen back twice in the dark, grinning at a windshield.",
            "effects": {
              "skill": 5,
              "creativity": 2
            }
          },
          "incredible": {
            "text": "Take three. TAKE THREE. The vocal sounds expensive — sounds like a ROOM, and the room is a sedan. Engineers will one day ask what booth this was. You will say “a secret.”",
            "effects": {
              "skill": 7,
              "creativity": 3,
              "cred": 3
            }
          }
        }
      },
      "right": {
        "label": "Keep take one, flaws included",
        "governingStats": {
          "creativity": 1,
          "cred": 0.3
        },
        "tags": [
          "record",
          "safe",
          "indie"
        ],
        "outcomes": {
          "bad": {
            "text": "Take one includes the garage door opening and your cousin asking, forever, on the recording, “why are you in my car.” You keep it out of spite.",
            "effects": {
              "creativity": 2,
              "burnout": 3
            }
          },
          "good": {
            "text": "The crack in the second verse stays. It is the best thing on the take and you know it. First-take honesty: cheaper than reverb, rarer too.",
            "effects": {
              "creativity": 5,
              "cred": 3
            }
          },
          "incredible": {
            "text": "Take one has a thing no other take will ever have: it does not know it is being listened to. You play it for a friend, who goes quiet and asks who recorded it. “Me. In a car.”",
            "effects": {
              "creativity": 7,
              "cred": 5,
              "fame": 2
            }
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
    "tags": [
      "record",
      "roots"
    ],
    "choices": {
      "left": {
        "label": "Study it like scripture",
        "governingStats": {
          "creativity": 1,
          "skill": 0.4
        },
        "tags": [
          "practice",
          "safe",
          "roots"
        ],
        "outcomes": {
          "bad": {
            "text": "You wear out the grooves learning its tricks and spend a week accidentally writing songs that are 90% it. Deprogramming required.",
            "effects": {
              "creativity": 3,
              "burnout": 3
            }
          },
          "good": {
            "text": "You reverse-engineer the arrangements bar by bar. Whoever this was solved problems you did not know you had. Your sound gets a basement floor built under it.",
            "effects": {
              "creativity": 5,
              "skill": 3
            }
          },
          "incredible": {
            "text": "The record rewires you. Weeks later, someone hears your set and asks about an influence they cannot place. Nobody can place it. It cost a dollar. It is YOURS.",
            "effects": {
              "creativity": 8,
              "skill": 3,
              "cred": 3
            }
          }
        }
      },
      "right": {
        "label": "Track down who made it",
        "governingStats": {
          "network": 1
        },
        "tags": [
          "network",
          "risky",
          "roots"
        ],
        "outcomes": {
          "bad": {
            "text": "The trail runs through two defunct pressing plants and a bowling league newsletter, then goes cold. You are now a private-press detective with no case and a dollar record.",
            "effects": {
              "network": 2,
              "burnout": 3
            }
          },
          "good": {
            "text": "Found: retired, two towns over, growing tomatoes, astonished anyone listened. You visit. They tell you exactly why they quit, and it is a masterclass in what not to do.",
            "effects": {
              "network": 5,
              "cred": 4,
              "creativity": 2
            }
          },
          "incredible": {
            "text": "They still play — into a tape recorder, alone, weekly, for fifty years. They play you the NEW stuff. It is astonishing. You leave with their blessing and a dubbed cassette nobody else on earth has.",
            "effects": {
              "network": 6,
              "cred": 6,
              "creativity": 4
            }
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
    "tags": [
      "social",
      "rest"
    ],
    "choices": {
      "left": {
        "label": "Hold court",
        "governingStats": {
          "network": 1
        },
        "tags": [
          "social",
          "risky"
        ],
        "outcomes": {
          "bad": {
            "text": "You tell your best story too early to a booth of better storytellers. A drummer lands the same arc, funnier, in half the time. You study his pacing bitterly, over pancakes.",
            "effects": {
              "network": 2,
              "burnout": 3
            }
          },
          "good": {
            "text": "You hold the booth for one full story — venue disaster, ninety seconds, sticks the landing. Syrup-sticky applause. You exist here now.",
            "effects": {
              "network": 5,
              "cred": 3
            }
          },
          "incredible": {
            "text": "Your story becomes THE story — retold at other tables within the week, attributed correctly. At the Starlite, that is a knighthood with hash browns.",
            "effects": {
              "network": 7,
              "cred": 5,
              "fame": 2
            }
          }
        }
      },
      "right": {
        "label": "Listen and eat",
        "governingStats": {
          "cred": 1
        },
        "tags": [
          "social",
          "safe",
          "rest"
        ],
        "outcomes": {
          "bad": {
            "text": "You are so quiet the booth forgets you and starts talking about you in third person. Reviews are mixed. The pancakes are not.",
            "effects": {
              "cred": 2,
              "burnout": -2
            }
          },
          "good": {
            "text": "Two hours of intel: who is booking, who is feuding, which venue’s check bounces. The scene has a syllabus. It is taught here, at night, in syrup.",
            "effects": {
              "cred": 4,
              "network": 3,
              "burnout": -3
            }
          },
          "incredible": {
            "text": "At close, the booth’s eldest — a bassist with tenure — slides you the last of the fries: “You listen. Nobody listens.” In this booth, that is a promotion.",
            "effects": {
              "cred": 6,
              "network": 4,
              "burnout": -4
            }
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
    "tags": [
      "home",
      "social"
    ],
    "choices": {
      "left": {
        "label": "Make your case, calmly",
        "governingStats": {
          "network": 1
        },
        "tags": [
          "home",
          "safe",
          "social"
        ],
        "outcomes": {
          "bad": {
            "text": "You present a schedule with a pie chart. The pie chart gets more debate than you did. Verdict: weekdays before nine, and 5A gets a formal apology for March.",
            "effects": {
              "network": 2,
              "burnout": 3
            }
          },
          "good": {
            "text": "You propose fixed hours and offer soundproofing you cannot yet afford. The gesture carries the room. Motion passes. Democracy hums along.",
            "effects": {
              "network": 5,
              "cred": 3
            }
          },
          "incredible": {
            "text": "Faction 3C stages a coordinated defense with TESTIMONY: “that song in February got me through it.” You win expanded hours and the knowledge that walls carry more than sound.",
            "effects": {
              "network": 6,
              "cred": 5,
              "fame": 2,
              "burnout": -2
            }
          }
        }
      },
      "right": {
        "label": "Play the meeting a song",
        "governingStats": {
          "creativity": 1
        },
        "tags": [
          "home",
          "risky",
          "live"
        ],
        "outcomes": {
          "bad": {
            "text": "You perform in a folding-chair semicircle under fluorescent light — the worst venue of your career. The vote splits. Compromise: “weekends, softly.” The word softly is now legislation.",
            "effects": {
              "creativity": 2,
              "burnout": 3
            }
          },
          "good": {
            "text": "Two minutes, unamplified, in the lobby. The complaint’s author unfolds her arms by the second verse. Motion passes. She requests, quietly, “the Tuesday one.”",
            "effects": {
              "creativity": 5,
              "network": 3,
              "cred": 2
            }
          },
          "incredible": {
            "text": "The song ends and the super — twenty years of neutrality — says “I vote we let the kid COOK.” It carries unanimously. Your walls are officially load-bearing culture.",
            "effects": {
              "creativity": 7,
              "network": 4,
              "cred": 4,
              "fame": 2
            }
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
    "tags": [
      "busk",
      "live"
    ],
    "choices": {
      "left": {
        "label": "Compose around the dead keys",
        "governingStats": {
          "creativity": 1
        },
        "tags": [
          "busk",
          "risky",
          "indie"
        ],
        "outcomes": {
          "bad": {
            "text": "You build a piece around the missing D and then reach for it anyway, four times, out of habit. The silence where the note should be becomes a running joke between you and one onlooker.",
            "effects": {
              "creativity": 3,
              "money": 15
            }
          },
          "good": {
            "text": "The broken keys force strange voicings, and the strange voicings turn out to be a style. A crowd gathers to hear an instrument fail beautifully.",
            "effects": {
              "creativity": 5,
              "money": 40,
              "fame": 2
            }
          },
          "incredible": {
            "text": "Someone records “the song written for the broken piano” and tags the city. The parks department reposts it. The piano gets repaired BECAUSE of you — and you almost miss the dead D.",
            "effects": {
              "creativity": 7,
              "fame": 6,
              "money": 55,
              "cred": 3
            }
          }
        }
      },
      "right": {
        "label": "Draw the lunch crowd",
        "governingStats": {
          "skill": 1,
          "network": 0.3
        },
        "tags": [
          "busk",
          "safe",
          "live"
        ],
        "outcomes": {
          "bad": {
            "text": "You compete with a food truck generator and lose on decibels. Tips: $11 and one perfectly good apple, underhand-tossed with respect.",
            "effects": {
              "skill": 2,
              "money": 11
            }
          },
          "good": {
            "text": "Twenty minutes of crowd-pleasers, transposed on the fly to dodge the dead keys. Office workers linger past their lunch hours. The tips reflect their guilt.",
            "effects": {
              "skill": 4,
              "money": 50,
              "fame": 2
            }
          },
          "incredible": {
            "text": "A double-decker tour bus stops — actually stops, off-itinerary. The guide points at you and says something you cannot hear. Forty tourists later, your case is heavy with international coins.",
            "effects": {
              "skill": 5,
              "money": 85,
              "fame": 5,
              "network": 2
            }
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
    "tags": [
      "social",
      "fame"
    ],
    "choices": {
      "left": {
        "label": "Give the humble quote",
        "governingStats": {
          "cred": 1
        },
        "tags": [
          "social",
          "safe"
        ],
        "outcomes": {
          "bad": {
            "text": "You are so humble you evaporate. The printed quote is mostly about the venue’s new awning. The awning photographs well, to be fair.",
            "effects": {
              "cred": 2
            }
          },
          "good": {
            "text": "You credit the scene, name three other bands, and thank the sound guy in print. Sixty words of pure diplomacy. The scene notices. The sound guy laminates it.",
            "effects": {
              "cred": 5,
              "network": 3,
              "fame": 2
            }
          },
          "incredible": {
            "text": "The columnist adds her own line under your quote: “Remember this name.” Sixty words became sixty-three, and the extra three are doing all the work.",
            "effects": {
              "cred": 6,
              "fame": 5,
              "network": 3
            }
          }
        }
      },
      "right": {
        "label": "Give her a headline",
        "governingStats": {
          "creativity": 1,
          "network": 0.3
        },
        "tags": [
          "social",
          "risky",
          "fame"
        ],
        "outcomes": {
          "bad": {
            "text": "Your zinger prints out of context, and for one week the laundromat believes you declared war on the community theater. The community theater responds IN VERSE.",
            "effects": {
              "creativity": 2,
              "fame": 3,
              "cred": -2
            }
          },
          "good": {
            "text": "“This town has more songs than parking spaces” makes the pull quote. People repeat it at you for weeks, delighted, as if you did not say it first.",
            "effects": {
              "creativity": 4,
              "fame": 5,
              "cred": 2
            }
          },
          "incredible": {
            "text": "The quote gets picked up by the regional paper, then a morning show, credited every time. Sixty words bought you a county’s worth of name recognition.",
            "effects": {
              "creativity": 5,
              "fame": 8,
              "network": 3
            }
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
    "tags": [
      "home",
      "deal"
    ],
    "choices": {
      "left": {
        "label": "Shake on it",
        "governingStats": {
          "skill": 1
        },
        "tags": [
          "deal",
          "safe",
          "practice"
        ],
        "outcomes": {
          "bad": {
            "text": "The leaves are infinite. The leaves are a lifestyle. You practice with forearms like overcooked noodles, but you practice LOUD, and nobody knocks.",
            "effects": {
              "skill": 3,
              "burnout": 4
            }
          },
          "good": {
            "text": "Raking by day, full volume by night. The garage takes your worst ideas without complaint, and the roses have never looked better. Everybody wins.",
            "effects": {
              "skill": 5,
              "creativity": 2,
              "burnout": -2
            }
          },
          "incredible": {
            "text": "October: gutters done, and Mr. Okafor hands you a key. AN ACTUAL KEY. “You work like you play. Come and go.” You have a space now. A SPACE.",
            "effects": {
              "skill": 6,
              "creativity": 3,
              "network": 3,
              "cred": 2
            }
          }
        }
      },
      "right": {
        "label": "Counter: a driveway concert",
        "governingStats": {
          "creativity": 1,
          "network": 0.3
        },
        "tags": [
          "live",
          "risky",
          "home"
        ],
        "outcomes": {
          "bad": {
            "text": "Mr. Okafor listens to your counteroffer, says “leaves,” and returns to his roses. Negotiations conclude. The leaves win. The leaves always win.",
            "effects": {
              "creativity": 2,
              "burnout": 3
            }
          },
          "good": {
            "text": "He accepts: one concert, his guest list. Twelve lawn chairs of neighborhood elders, and you, playing the gentlest set of your life at golden hour. Garage granted.",
            "effects": {
              "creativity": 5,
              "network": 4,
              "cred": 3
            }
          },
          "incredible": {
            "text": "The driveway show becomes the block’s event of the year. Mrs. Okafor requests an encore BY NAME — a deep cut. She has been listening through the fence for months. The garage comes with dinner privileges.",
            "effects": {
              "creativity": 6,
              "network": 6,
              "cred": 4,
              "fame": 2
            }
          }
        }
      }
    }
  },
  {
    "id": "n1_earplug_lecture",
    "act": 1,
    "pathAffinity": [],
    "weight": 9,
    "art": "ev_n1_earplug_lecture",
    "context": "The old sound guy, holding two orange foam earplugs",
    "prompt": "He has mixed everyone who ever came through this town, and he has watched you run yourself ragged for weeks. He holds out two foam earplugs like communion. “Sit down. This is the talk. Everybody gets it once.”",
    "tags": [
      "rest",
      "social"
    ],
    "requires": {
      "burnoutMin": 40
    },
    "choices": {
      "left": {
        "label": "Sit down. Actually listen.",
        "governingStats": {
          "cred": 1
        },
        "tags": [
          "rest",
          "safe"
        ],
        "outcomes": {
          "bad": {
            "text": "The talk covers ears, sleep, and “the kid in ’09 who did not listen.” It runs long. You keep the earplugs and most of the guilt.",
            "effects": {
              "cred": 2,
              "burnout": -3
            }
          },
          "good": {
            "text": "Ears, pacing, the long game — thirty years of casualties summarized in twenty minutes. You take the nap he prescribes. The nap is a revelation.",
            "effects": {
              "cred": 4,
              "burnout": -5,
              "skill": 2
            }
          },
          "incredible": {
            "text": "At the end he tells you about the band he was in, once, and why he is behind the desk now. It is not a sad story the way he tells it. You leave changed, and early, and you SLEEP.",
            "effects": {
              "cred": 6,
              "burnout": -6,
              "network": 3
            }
          }
        }
      },
      "right": {
        "label": "Nod, pocket them, gig anyway",
        "governingStats": {
          "skill": 1
        },
        "tags": [
          "live",
          "risky",
          "work"
        ],
        "outcomes": {
          "bad": {
            "text": "You play the gig on fumes and forget a verse of your own song. From the booth, the sound guy turns your vocal up. So you can hear it. The lesson, that is.",
            "effects": {
              "skill": 2,
              "burnout": 5
            }
          },
          "good": {
            "text": "You gig — but wearing the earplugs, which it turns out he had already cut to fit you. The mix inside your head goes quiet and clear for the first time in weeks.",
            "effects": {
              "skill": 4,
              "burnout": -2,
              "cred": 2
            }
          },
          "incredible": {
            "text": "Best set of the month, protected ears, and afterwards he says nothing — just taps his ear, points at you, and nods once. You have been mixed AND blessed.",
            "effects": {
              "skill": 6,
              "cred": 4,
              "burnout": -3
            }
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
    "tags": [
      "blues",
      "live"
    ],
    "choices": {
      "left": {
        "label": "Take the solo they offer",
        "governingStats": {
          "skill": 1
        },
        "tags": [
          "blues",
          "risky",
          "live"
        ],
        "outcomes": {
          "bad": {
            "text": "You cram nine bars of ideas into a four-bar hole. The bandleader takes the solo back with one raised chin. The chin says everything the room is too kind to.",
            "effects": {
              "skill": 3,
              "burnout": 3
            }
          },
          "good": {
            "text": "You say something short and true in twelve bars and hand it back clean. The drummer gives you the half-smile. The half-smile is the diploma.",
            "effects": {
              "skill": 5,
              "cred": 4
            }
          },
          "incredible": {
            "text": "The bandleader loops the form — “take another” — which regulars confirm has happened four times in fifteen years. You are jam-night history now. There will be quizzes.",
            "effects": {
              "skill": 7,
              "cred": 6,
              "network": 3,
              "fame": 2
            }
          }
        }
      },
      "right": {
        "label": "Hold down rhythm all night",
        "governingStats": {
          "cred": 1,
          "skill": 0.4
        },
        "tags": [
          "blues",
          "safe",
          "band"
        ],
        "outcomes": {
          "bad": {
            "text": "Three hours in the engine room. Nobody notices rhythm until it wavers, and at 11:40, briefly, gently, it wavers. The bass player notices. Only the bass player. Forever the bass player.",
            "effects": {
              "cred": 2,
              "skill": 2,
              "burnout": 3
            }
          },
          "good": {
            "text": "You keep the floor steady under eleven soloists of wildly varying judgment. Unsexy, essential, noticed by exactly the right people.",
            "effects": {
              "cred": 5,
              "skill": 3,
              "network": 2
            }
          },
          "incredible": {
            "text": "At close the bandleader announces, to the room, “THAT is how you hold a groove,” and buys your drink. Sidemen appear around you like you smell of steady work. You do.",
            "effects": {
              "cred": 7,
              "skill": 3,
              "network": 4
            }
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
    "tags": [
      "record",
      "write"
    ],
    "choices": {
      "left": {
        "label": "Score it properly",
        "governingStats": {
          "creativity": 1,
          "skill": 0.4
        },
        "tags": [
          "record",
          "risky",
          "studio"
        ],
        "outcomes": {
          "bad": {
            "text": "You rescore the ending four times and sleep nine total hours. The film screens to a classroom of eleven, and the professor’s only note is about the CREDITS FONT. You dream in eleven-minute loops.",
            "effects": {
              "creativity": 3,
              "burnout": 6
            }
          },
          "good": {
            "text": "You find the grandfather theme on the second night — three notes, patient, worn smooth like the hands. Reza cries at the temp mix. The good kind of deadline.",
            "effects": {
              "creativity": 5,
              "skill": 3,
              "cred": 2
            }
          },
          "incredible": {
            "text": "The film wins the student showcase and the jury citation names THE SCORE. Every film kid in the county now has your number. Directors remember composers forever.",
            "effects": {
              "creativity": 7,
              "cred": 4,
              "network": 5,
              "fame": 3
            }
          }
        }
      },
      "right": {
        "label": "One mood, stretched thin",
        "governingStats": {
          "skill": 1
        },
        "tags": [
          "record",
          "safe",
          "work"
        ],
        "outcomes": {
          "bad": {
            "text": "You deliver eleven minutes of tasteful drone by Saturday. It works. It also, per one classmate, “sounds like a refrigerator remembering something.” Reza uses it anyway.",
            "effects": {
              "skill": 2,
              "cred": 2
            }
          },
          "good": {
            "text": "One theme, three variations, delivered early. Reza recuts a scene to match YOUR timing — the first time anyone has moved their art to fit yours. It will not be the last.",
            "effects": {
              "skill": 4,
              "creativity": 3,
              "cred": 3
            }
          },
          "incredible": {
            "text": "Restraint reads as mastery: the sparse score makes the film feel expensive. The professor asks Reza who did the music. Reza, loyally, makes you sound famous. Now you have to become it.",
            "effects": {
              "skill": 6,
              "cred": 4,
              "network": 3,
              "fame": 2
            }
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
    "tags": [
      "home",
      "deal"
    ],
    "choices": {
      "left": {
        "label": "Sell it all",
        "governingStats": {
          "cred": 1
        },
        "tags": [
          "deal",
          "risky"
        ],
        "outcomes": {
          "bad": {
            "text": "Everything goes, including — you realize at 4 p.m., too late, watching a stranger walk away with it — the chair you write in. The mix is funded. Your next three songs are written standing up, resentfully.",
            "effects": {
              "cred": 2,
              "money": 70,
              "burnout": 3
            }
          },
          "good": {
            "text": "The blanket empties, the envelope fills. You keep one mug, one blanket, one purpose. Walking to the studio with the cash feels like a music video. You let it.",
            "effects": {
              "cred": 4,
              "money": 100,
              "burnout": -2
            }
          },
          "incredible": {
            "text": "A neighbor asks why you are selling everything. You tell her. She rounds up the lamp money to $40 — “I want to say I helped” — and three more people follow suit. The whole blanket becomes a fundraiser.",
            "effects": {
              "cred": 6,
              "money": 120,
              "network": 3,
              "fame": 2
            }
          }
        }
      },
      "right": {
        "label": "Trade, don’t sell",
        "governingStats": {
          "network": 1
        },
        "tags": [
          "deal",
          "safe"
        ],
        "outcomes": {
          "bad": {
            "text": "You accept a “vintage” four-track for your bicycle. The four-track eats your first tape like a dog with homework. You now walk everywhere, carrying regret and one working channel.",
            "effects": {
              "network": 2,
              "burnout": 3
            }
          },
          "good": {
            "text": "The lamp becomes a mic cable, the toaster becomes two hours of a neighbor’s home studio, the bike stays. The barter economy is undefeated when you know your neighbors.",
            "effects": {
              "network": 5,
              "cred": 2,
              "money": 30
            }
          },
          "incredible": {
            "text": "Word spreads that you trade fair. By sundown you have assembled — from the neighborhood, from favors, from a retired DJ’s attic — an entire recording day without spending a dollar. The blanket is folded. The legend is not.",
            "effects": {
              "network": 7,
              "cred": 4,
              "money": 40
            }
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
    "tags": [
      "live",
      "tour"
    ],
    "choices": {
      "left": {
        "label": "Open the show",
        "governingStats": {
          "skill": 1,
          "network": 0.3
        },
        "tags": [
          "live",
          "risky"
        ],
        "outcomes": {
          "bad": {
            "text": "Three hours of panic, thirty minutes of adrenaline, one broken string, and a crowd that came for the tourers. Their singer still thanks you from the stage, by name, pronounced wrong. Close enough.",
            "effects": {
              "skill": 3,
              "burnout": 4,
              "fame": 2
            }
          },
          "good": {
            "text": "You rise to it — tight set, borrowed energy, a room that arrived cold and left knowing your name. The tourers watch from the bar like scouts.",
            "effects": {
              "skill": 5,
              "fame": 4,
              "network": 3
            }
          },
          "incredible": {
            "text": "After the show, their booker texts you from the road: they want you opening ALL their shows within a hundred miles, every tour. You have a circuit now. It came in a van.",
            "effects": {
              "skill": 6,
              "fame": 6,
              "network": 5,
              "cred": 3
            }
          }
        }
      },
      "right": {
        "label": "Play host instead",
        "governingStats": {
          "network": 1,
          "cred": 0.4
        },
        "tags": [
          "network",
          "safe",
          "home"
        ],
        "outcomes": {
          "bad": {
            "text": "Four musicians, your floor, one bathroom. They leave at dawn with your good towel and a note so grateful you cannot even be mad about the towel. You are a little mad about the towel.",
            "effects": {
              "network": 2,
              "burnout": 3
            }
          },
          "good": {
            "text": "Pasta, floor space, directions to the good breakfast place. In the touring economy, tonight makes you a NODE — your address now travels in vans across four states, marked “safe.”",
            "effects": {
              "network": 5,
              "cred": 4
            }
          },
          "incredible": {
            "text": "Over 1 a.m. pasta, their singer hears you play in your own kitchen and goes quiet. Six months from now, when they are suddenly enormous, they will tell an interviewer about this kitchen. Interviewers follow up on kitchens.",
            "effects": {
              "network": 6,
              "cred": 5,
              "fame": 4
            }
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
    "tags": [
      "work",
      "tone"
    ],
    "choices": {
      "left": {
        "label": "Learn the desk",
        "governingStats": {
          "skill": 1,
          "network": 0.3
        },
        "tags": [
          "work",
          "safe",
          "tone"
        ],
        "outcomes": {
          "bad": {
            "text": "You learn just enough to be dangerous and spend your own soundcheck asking for “a touch of 3k,” incorrectly. He mutes your channel until you apologize in plain English.",
            "effects": {
              "skill": 2,
              "burnout": 3
            }
          },
          "good": {
            "text": "One hour and the mixing board stops being a wall of secrets. You will never again describe your monitor mix as “more like soup.” He looks almost proud. Almost.",
            "effects": {
              "skill": 5,
              "network": 3,
              "cred": 2
            }
          },
          "incredible": {
            "text": "You have THE EARS, he announces, to nobody, loudly. Sound guys tell each other things: within a month, every desk in town mixes you a little more carefully. It is like being knighted by the electricity itself.",
            "effects": {
              "skill": 6,
              "network": 5,
              "cred": 4
            }
          }
        }
      },
      "right": {
        "label": "Bribe him with tacos instead",
        "governingStats": {
          "network": 1
        },
        "tags": [
          "network",
          "risky",
          "social"
        ],
        "outcomes": {
          "bad": {
            "text": "You return with tacos to find soundcheck done without you. Your mix tonight is “fine.” The word fine, from a sound guy, has seventeen meanings and you got the worst one.",
            "effects": {
              "network": 2,
              "money": -15,
              "burnout": 3
            }
          },
          "good": {
            "text": "The tacos land. Friendship, it turns out, is a valid audio protocol: your mixes are mysteriously excellent forever after, and you never learn a single knob. Both careers advance.",
            "effects": {
              "network": 5,
              "cred": 3,
              "money": -15
            }
          },
          "incredible": {
            "text": "Over tacos he tells you what he ACTUALLY hears in your songs — a ten-minute unsolicited masterclass sharper than any review. Then he mixes your set like a co-producer. The tacos were $9. The notes were priceless.",
            "effects": {
              "network": 6,
              "cred": 4,
              "skill": 3,
              "money": -9
            }
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
    "tags": [
      "social",
      "deal"
    ],
    "choices": {
      "left": {
        "label": "Hunt down the owner",
        "governingStats": {
          "network": 1,
          "cred": 0.4
        },
        "tags": [
          "network",
          "safe"
        ],
        "outcomes": {
          "bad": {
            "text": "Three weeks of detective work through the group chat ends at a guy who moved to another state and says, unbelievably, “keep it, I hated that thing.” You cannot even enjoy it now. It radiates his indifference.",
            "effects": {
              "network": 2,
              "cred": 2
            }
          },
          "good": {
            "text": "Found: a bassist who lost it the night her band broke up. She takes it back like a returned limb, and tells everyone what you did. The scene’s trust network adds a node with your name on it.",
            "effects": {
              "network": 4,
              "cred": 5
            }
          },
          "incredible": {
            "text": "The bassist turns out to book a venue across town. “You’re the one who returned the pedal.” Your reputation crossed the river before you did — and it is holding a door open.",
            "effects": {
              "network": 6,
              "cred": 6,
              "fame": 2
            }
          }
        }
      },
      "right": {
        "label": "Box rules. It’s yours now.",
        "governingStats": {
          "creativity": 1
        },
        "tags": [
          "deal",
          "risky"
        ],
        "outcomes": {
          "bad": {
            "text": "Two shows later, a stranger stares at your pedalboard a beat too long. Nothing is said. Nothing needs to be. The pedal tunes perfectly and accuses you nightly.",
            "effects": {
              "creativity": 2,
              "cred": -2
            }
          },
          "good": {
            "text": "A month is a month and rules are rules. Your tuning is instant and silent now — an upgrade you will never take for granted after years of tuning by hope.",
            "effects": {
              "creativity": 3,
              "skill": 3
            }
          },
          "incredible": {
            "text": "You leave a note in the box: “Took the tuner. If it was yours, find me — I owe you a show.” Nobody ever claims it, but the note becomes minor bar legend, and the pedal becomes honestly yours by folklore.",
            "effects": {
              "creativity": 5,
              "skill": 3,
              "cred": 3
            }
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
    "tags": [
      "record",
      "indie"
    ],
    "choices": {
      "left": {
        "label": "Play the deep cuts",
        "governingStats": {
          "creativity": 1,
          "skill": 0.3
        },
        "tags": [
          "record",
          "indie",
          "risky"
        ],
        "outcomes": {
          "bad": {
            "text": "You play the eight-minute one. The professor calls in to disagree with your bridge. On air. At length.",
            "effects": {
              "creativity": 3,
              "burnout": 4
            }
          },
          "good": {
            "text": "The insomniacs find you. By morning there are four new followers who describe you in paragraphs.",
            "effects": {
              "creativity": 5,
              "cred": 4,
              "fame": 3
            }
          },
          "incredible": {
            "text": "The session gets bootlegged, lovingly, by someone who labels it “the good one.” It follows you for years, in a nice way.",
            "effects": {
              "creativity": 7,
              "cred": 6,
              "fame": 6,
              "network": 3
            }
          }
        }
      },
      "right": {
        "label": "Do the interview instead",
        "minigame": "interview",
        "governingStats": {
          "network": 1
        },
        "tags": [
          "social",
          "safe"
        ],
        "outcomes": {
          "bad": {
            "text": "You say “it’s hard to describe our sound” and then describe it for six minutes anyway.",
            "effects": {
              "network": 2,
              "burnout": 3
            }
          },
          "good": {
            "text": "You are, it turns out, good at talking. The interview travels further than the songs did.",
            "effects": {
              "network": 5,
              "fame": 4,
              "cred": 2
            }
          },
          "incredible": {
            "text": "A quote you improvise ends up on someone’s tote bag. You are, briefly, a slogan.",
            "effects": {
              "network": 7,
              "fame": 6,
              "cred": 3
            }
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
    "tags": [
      "tour",
      "live"
    ],
    "choices": {
      "left": {
        "label": "Route it tight",
        "governingStats": {
          "skill": 1,
          "network": 0.3
        },
        "tags": [
          "tour",
          "safe"
        ],
        "outcomes": {
          "bad": {
            "text": "Tight routing, tighter margins. You make gas money and a memory of a truck stop shower.",
            "effects": {
              "skill": 3,
              "burnout": 6,
              "money": 30
            }
          },
          "good": {
            "text": "Every night a few more people. By city four there are regulars who drove in from city three.",
            "effects": {
              "skill": 5,
              "network": 5,
              "fame": 5,
              "burnout": 5
            }
          },
          "incredible": {
            "text": "The tour finds its legs and then finds its wings. You come home changed, broke, and completely sure.",
            "effects": {
              "skill": 7,
              "network": 8,
              "fame": 10,
              "cred": 4,
              "burnout": 5
            }
          }
        }
      },
      "right": {
        "label": "Chase the one big room",
        "governingStats": {
          "network": 1,
          "creativity": 0.3
        },
        "tags": [
          "tour",
          "risky",
          "mainstream"
        ],
        "outcomes": {
          "bad": {
            "text": "The big room was a gamble and the gamble was a Tuesday. You play to the sound of your own reverb.",
            "effects": {
              "network": 2,
              "fame": 2,
              "burnout": 8,
              "money": -40
            }
          },
          "good": {
            "text": "The big room half-fills, which for a big room is a triumph. The promoter remembers your name.",
            "effects": {
              "network": 6,
              "fame": 8,
              "money": 120
            }
          },
          "incredible": {
            "text": "The big room sells out on word of mouth alone. You headline a city that has never met you.",
            "effects": {
              "network": 8,
              "fame": 14,
              "money": 260,
              "cred": 4
            }
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
    "tags": [
      "live",
      "work"
    ],
    "choices": {
      "left": {
        "label": "Host with a whole heart",
        "governingStats": {
          "network": 1,
          "creativity": 0.4
        },
        "tags": [
          "live",
          "social",
          "safe"
        ],
        "outcomes": {
          "bad": {
            "text": "You key-change a man’s power ballad down to save him. He wanted to fail on his own terms. He tells you so.",
            "effects": {
              "network": 3,
              "burnout": 4,
              "money": 30
            }
          },
          "good": {
            "text": "Thursdays become an institution. You know every regular’s song before they pick it.",
            "effects": {
              "network": 6,
              "fame": 3,
              "money": 50,
              "grantHustle": "karaoke_host"
            }
          },
          "incredible": {
            "text": "Karaoke Thursdays outdraws half your own shows. You are, on Thursdays, beloved and slightly feared.",
            "effects": {
              "network": 8,
              "fame": 5,
              "cred": 3,
              "money": 65,
              "grantHustle": "karaoke_host"
            }
          }
        }
      },
      "right": {
        "label": "Turn it into a residency",
        "governingStats": {
          "creativity": 1
        },
        "tags": [
          "live",
          "risky"
        ],
        "outcomes": {
          "bad": {
            "text": "You try to make karaoke night “a curated experience.” The regulars want their song and their pitcher, not a vision.",
            "effects": {
              "creativity": 3,
              "cred": -2,
              "burnout": 5
            }
          },
          "good": {
            "text": "You slip your originals between the standards. Half the room learns your chorus by osmosis.",
            "effects": {
              "creativity": 5,
              "fame": 4,
              "cred": 3
            }
          },
          "incredible": {
            "text": "The karaoke night becomes YOUR night, softly, over weeks. Nobody voted. Everybody agreed.",
            "effects": {
              "creativity": 7,
              "fame": 6,
              "network": 4,
              "cred": 4
            }
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
    "tags": [
      "deal",
      "work"
    ],
    "choices": {
      "left": {
        "label": "Fix and flip them",
        "governingStats": {
          "skill": 1,
          "network": 0.3
        },
        "tags": [
          "deal",
          "work",
          "safe"
        ],
        "outcomes": {
          "bad": {
            "text": "You reflow six joints and burn a seventh board to carbon. Net profit: a lesson and a scar.",
            "effects": {
              "skill": 3,
              "money": 20,
              "burnout": 3
            }
          },
          "good": {
            "text": "Four pedals revived, four pedals sold, one story about “provenance” you mostly believe.",
            "effects": {
              "skill": 4,
              "money": 90,
              "grantHustle": "pedal_flipping"
            }
          },
          "incredible": {
            "text": "A collector pays absurd money for a fuzz you fixed with a paperclip. The flip becomes a side business.",
            "effects": {
              "skill": 5,
              "money": 180,
              "network": 3,
              "grantHustle": "pedal_flipping"
            }
          }
        }
      },
      "right": {
        "label": "Keep the best one",
        "governingStats": {
          "creativity": 1
        },
        "tags": [
          "tone",
          "risky"
        ],
        "outcomes": {
          "bad": {
            "text": "The one you keep is haunted by a hum only your amp can hear. You keep it anyway. It has character.",
            "effects": {
              "creativity": 3,
              "burnout": 2
            }
          },
          "good": {
            "text": "The revived fuzz becomes your sound. People ask what it is. You say “a garage sale.” They think it’s a brand.",
            "effects": {
              "creativity": 6,
              "cred": 3,
              "tone": 0
            }
          },
          "incredible": {
            "text": "That five-dollar pedal is on every song you write for the next year. Best money you almost didn’t spend.",
            "effects": {
              "creativity": 8,
              "cred": 4,
              "skill": 3
            }
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
    "tags": [
      "deal",
      "record"
    ],
    "choices": {
      "left": {
        "label": "Write them a real piece",
        "minigame": "take",
        "governingStats": {
          "creativity": 1,
          "skill": 0.4
        },
        "tags": [
          "record",
          "work",
          "safe"
        ],
        "outcomes": {
          "bad": {
            "text": "You overthink it. The bank finds it “too emotional for a mortgage department.” You dial back the yearning.",
            "effects": {
              "creativity": 3,
              "money": 40,
              "burnout": 3
            }
          },
          "good": {
            "text": "Four hundred callers a day hear your étude and hate the wait a little less. Passive income, active shame.",
            "effects": {
              "creativity": 5,
              "money": 55,
              "grantHustle": "hold_music"
            }
          },
          "incredible": {
            "text": "Someone requests “the hold song” at a real show. It has fans now. It has more fans than you sometimes.",
            "effects": {
              "creativity": 6,
              "money": 55,
              "fame": 4,
              "grantHustle": "hold_music"
            }
          }
        }
      },
      "right": {
        "label": "Phone it in for the money",
        "governingStats": {
          "skill": 1
        },
        "tags": [
          "work",
          "deal"
        ],
        "outcomes": {
          "bad": {
            "text": "You loop four bland bars. The bank loves it. You have never been so well paid to feel so little.",
            "effects": {
              "skill": 2,
              "money": 60,
              "cred": -2
            }
          },
          "good": {
            "text": "Bland, competent, forgettable, cashed. The rent is a genre now.",
            "effects": {
              "skill": 3,
              "money": 90
            }
          },
          "incredible": {
            "text": "The bank expands the contract to all four branches. Your worst work, your best quarter.",
            "effects": {
              "skill": 3,
              "money": 150,
              "cred": -2
            }
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
    "tags": [
      "live",
      "work"
    ],
    "choices": {
      "left": {
        "label": "Become the room",
        "governingStats": {
          "skill": 1,
          "network": 0.3
        },
        "tags": [
          "live",
          "safe",
          "roots"
        ],
        "outcomes": {
          "bad": {
            "text": "You play under the clatter of forks. A man requests a song, then talks through all of it. Both are true.",
            "effects": {
              "skill": 3,
              "money": 45,
              "burnout": 4
            }
          },
          "good": {
            "text": "The regulars start requesting your originals “between the Gershwin.” The tips fold thicker.",
            "effects": {
              "skill": 5,
              "money": 75,
              "cred": 3,
              "grantHustle": "supper_club"
            }
          },
          "incredible": {
            "text": "A retired producer eats here Thursdays. He leaves a card in the piano lid, under a fifty. It says “call me.”",
            "effects": {
              "skill": 6,
              "money": 90,
              "network": 6,
              "grantHustle": "supper_club"
            }
          }
        }
      },
      "right": {
        "label": "Sneak in your own set",
        "governingStats": {
          "creativity": 1
        },
        "tags": [
          "live",
          "risky",
          "indie"
        ],
        "outcomes": {
          "bad": {
            "text": "You play three originals in a row. The maître d’ appears at your shoulder like weather. “The Gershwin,” he says.",
            "effects": {
              "creativity": 3,
              "cred": 2,
              "burnout": 4,
              "money": 20
            }
          },
          "good": {
            "text": "You thread originals so gently nobody notices until a table asks for “that last one, was it Cole Porter?” It was you.",
            "effects": {
              "creativity": 6,
              "cred": 4,
              "money": 50
            }
          },
          "incredible": {
            "text": "A whole table falls silent for your song. In a supper club, silence is a standing ovation.",
            "effects": {
              "creativity": 7,
              "cred": 5,
              "fame": 4,
              "money": 60
            }
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
    "tags": [
      "deal",
      "social"
    ],
    "choices": {
      "left": {
        "label": "Turn it into a service",
        "governingStats": {
          "network": 1,
          "creativity": 0.4
        },
        "tags": [
          "deal",
          "work",
          "safe"
        ],
        "outcomes": {
          "bad": {
            "text": "You record forty custom ringtones and lose your mind slightly in the process. Each one is forty seconds of your soul, monetized.",
            "effects": {
              "network": 3,
              "money": 50,
              "burnout": 5
            }
          },
          "good": {
            "text": "Word spreads. You have a menu now, and a turnaround time, and a customer who wants his cat’s meow harmonized.",
            "effects": {
              "network": 5,
              "money": 70,
              "grantHustle": "ringtone_shop"
            }
          },
          "incredible": {
            "text": "A local radio host features “the ringtone guy.” Suddenly everyone’s phone plays a little bit of you.",
            "effects": {
              "network": 7,
              "money": 90,
              "fame": 4,
              "grantHustle": "ringtone_shop"
            }
          }
        }
      },
      "right": {
        "label": "Use them as demos",
        "minigame": "ideas",
        "governingStats": {
          "creativity": 1
        },
        "tags": [
          "write",
          "risky"
        ],
        "outcomes": {
          "bad": {
            "text": "You treat each request as a writing prompt. Most are garbage. One is not garbage. That is a good ratio, actually.",
            "effects": {
              "creativity": 4,
              "burnout": 4
            }
          },
          "good": {
            "text": "Three of the ringtones are secretly song hooks. You keep the best one for yourself. The customer never knows.",
            "effects": {
              "creativity": 6,
              "cred": 3,
              "writeSong": true
            }
          },
          "incredible": {
            "text": "A forty-second commission blooms into your next real song. Commerce and art, briefly indistinguishable.",
            "effects": {
              "creativity": 8,
              "cred": 4,
              "fame": 3,
              "writeSong": true
            }
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
    "tags": [
      "live",
      "network"
    ],
    "choices": {
      "left": {
        "label": "Win the strangers",
        "minigame": "crowd",
        "governingStats": {
          "skill": 1,
          "creativity": 0.4
        },
        "tags": [
          "live",
          "risky"
        ],
        "outcomes": {
          "bad": {
            "text": "You open to a room checking its phones. By your last song, three people are watching. You play to those three like they’re a stadium.",
            "effects": {
              "skill": 4,
              "fame": 3,
              "burnout": 6
            }
          },
          "good": {
            "text": "You win a chunk of the room. At merch, people who came for the headliner leave with your record.",
            "effects": {
              "skill": 5,
              "fame": 7,
              "network": 4,
              "money": 80
            }
          },
          "incredible": {
            "text": "The headliner watches from the wings and, after, tells the crowd “remember that name.” They do.",
            "effects": {
              "skill": 6,
              "fame": 12,
              "network": 6,
              "cred": 4
            }
          }
        }
      },
      "right": {
        "label": "Play it safe and short",
        "governingStats": {
          "skill": 1
        },
        "tags": [
          "live",
          "safe"
        ],
        "outcomes": {
          "bad": {
            "text": "You play the hits clean and leave nothing behind. Competent. Forgotten by the encore.",
            "effects": {
              "skill": 3,
              "fame": 2,
              "burnout": 3
            }
          },
          "good": {
            "text": "Tight, professional, no risks, no regrets. The headliner’s manager notes “reliable,” which is a currency.",
            "effects": {
              "skill": 4,
              "network": 5,
              "fame": 4
            }
          },
          "incredible": {
            "text": "Reliable becomes “our regular opener.” You get the whole tour’s worth of slots. Boring built a career.",
            "effects": {
              "skill": 5,
              "network": 8,
              "fame": 6,
              "money": 120
            }
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
    "tags": [
      "deal",
      "shop"
    ],
    "choices": {
      "left": {
        "label": "Buy the better van",
        "cost": 220,
        "governingStats": {
          "network": 1
        },
        "tags": [
          "deal",
          "tour",
          "safe"
        ],
        "outcomes": {
          "bad": {
            "text": "The heater works. Nothing else you were promised does. Al waves from the lot, already gone in spirit.",
            "effects": {
              "money": -220,
              "burnout": -2,
              "network": 2
            }
          },
          "good": {
            "text": "A van that starts every time is a quality-of-life revolution. The band cries a little. From relief.",
            "effects": {
              "money": -220,
              "burnout": -6,
              "network": 3,
              "grantGear": "random_basic"
            }
          },
          "incredible": {
            "text": "The new van is a fortress. Tours get longer, breakdowns get rarer, and the old dread quietly retires.",
            "effects": {
              "money": -220,
              "burnout": -8,
              "network": 5,
              "grantGear": "random_good"
            }
          }
        }
      },
      "right": {
        "label": "Nurse the old one along",
        "governingStats": {
          "skill": 1
        },
        "tags": [
          "work",
          "risky"
        ],
        "outcomes": {
          "bad": {
            "text": "You YouTube a repair at a rest stop. It half-works, which on this van is a full recovery.",
            "effects": {
              "skill": 3,
              "burnout": 5,
              "money": -20
            }
          },
          "good": {
            "text": "You keep the beast alive another season and pocket the van money. The check-engine light dims, respectfully.",
            "effects": {
              "skill": 4,
              "money": 40,
              "cred": 2
            }
          },
          "incredible": {
            "text": "You become a genuinely competent mechanic out of pure poverty. The van will outlive several of your friendships.",
            "effects": {
              "skill": 6,
              "money": 60,
              "network": 2
            }
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
    "tags": [
      "live",
      "home"
    ],
    "choices": {
      "left": {
        "label": "Play for the believers",
        "governingStats": {
          "skill": 1,
          "cred": 0.4
        },
        "tags": [
          "live",
          "home",
          "safe"
        ],
        "outcomes": {
          "bad": {
            "text": "You get in your own head. Your parents film the whole thing vertically. It is, at least, documented.",
            "effects": {
              "skill": 3,
              "fame": 3,
              "burnout": 4
            }
          },
          "good": {
            "text": "The hometown roars. Your old teacher is crying. You are, for one night, exactly who you promised you’d be.",
            "effects": {
              "skill": 5,
              "fame": 6,
              "cred": 4,
              "network": 3
            }
          },
          "incredible": {
            "text": "The whole town sings your chorus back at you. Some of them wrote you off years ago. All of them know the words now.",
            "effects": {
              "skill": 6,
              "fame": 10,
              "cred": 6,
              "network": 4
            }
          }
        }
      },
      "right": {
        "label": "Prove the doubters wrong",
        "governingStats": {
          "creativity": 1,
          "cred": 0.3
        },
        "tags": [
          "live",
          "risky",
          "fame"
        ],
        "outcomes": {
          "bad": {
            "text": "You play angry, to a specific face in the back. That face left at the second song. You performed a grudge to no one.",
            "effects": {
              "creativity": 3,
              "cred": -2,
              "burnout": 6
            }
          },
          "good": {
            "text": "You play the set you couldn’t have written here, and the room understands you left to become this.",
            "effects": {
              "creativity": 6,
              "fame": 6,
              "cred": 4
            }
          },
          "incredible": {
            "text": "The doubter finds you after. “I was wrong.” You wanted this for years. It’s smaller and better than you imagined.",
            "effects": {
              "creativity": 7,
              "fame": 8,
              "cred": 6,
              "network": 3
            }
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
    "tags": [
      "social",
      "network"
    ],
    "choices": {
      "left": {
        "label": "Be honest",
        "minigame": "interview",
        "governingStats": {
          "cred": 1,
          "creativity": 0.3
        },
        "tags": [
          "social",
          "risky"
        ],
        "outcomes": {
          "bad": {
            "text": "You overshare about the debt and the doubt. The piece is titled “A Portrait of Struggle,” which sells you as sad.",
            "effects": {
              "cred": 3,
              "fame": 3,
              "burnout": 3
            }
          },
          "good": {
            "text": "Honesty reads as depth. The feature makes you sound like someone worth rooting for, because you are.",
            "effects": {
              "cred": 5,
              "fame": 6,
              "network": 3
            }
          },
          "incredible": {
            "text": "The piece goes around the scene. People quote your own words back to you. You said something true and it stuck.",
            "effects": {
              "cred": 7,
              "fame": 9,
              "network": 4
            }
          }
        }
      },
      "right": {
        "label": "Build the myth",
        "governingStats": {
          "network": 1,
          "creativity": 0.4
        },
        "tags": [
          "social",
          "mainstream",
          "risky"
        ],
        "outcomes": {
          "bad": {
            "text": "You spin a persona and the writer, who is smart, notices the spin. The piece is polite and quietly unconvinced.",
            "effects": {
              "network": 2,
              "fame": 4,
              "cred": -3
            }
          },
          "good": {
            "text": "The myth lands. Mysterious, curated, a little larger than life. Some of it you might even grow into.",
            "effects": {
              "network": 5,
              "fame": 8,
              "cred": 2
            }
          },
          "incredible": {
            "text": "The legend writes itself into being. People show up expecting the myth and you, terrifyingly, deliver it.",
            "effects": {
              "network": 7,
              "fame": 12,
              "cred": 3
            }
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
    "tags": [
      "deal",
      "mainstream"
    ],
    "choices": {
      "left": {
        "label": "Take the check",
        "governingStats": {
          "network": 1
        },
        "tags": [
          "deal",
          "mainstream",
          "safe"
        ],
        "outcomes": {
          "bad": {
            "text": "They cut your song to eight seconds and add a slide-whistle. Your art now sells memory foam. The check clears, though.",
            "effects": {
              "network": 3,
              "money": 250,
              "cred": -4
            }
          },
          "good": {
            "text": "The ad runs nationally. Strangers hum your song without knowing your name. That’s a kind of fame that pays.",
            "effects": {
              "network": 4,
              "money": 300,
              "fame": 6
            }
          },
          "incredible": {
            "text": "The ad is so good people look up the song. You get the check AND the credit. The mattress, frankly, owes you.",
            "effects": {
              "network": 5,
              "money": 350,
              "fame": 10,
              "cred": 2
            }
          }
        }
      },
      "right": {
        "label": "Hold your song back",
        "governingStats": {
          "cred": 1
        },
        "tags": [
          "indie",
          "risky"
        ],
        "outcomes": {
          "bad": {
            "text": "You say no on principle and eat ramen on the principle for a month. The principle is delicious and free.",
            "effects": {
              "cred": 4,
              "money": -20,
              "burnout": 3
            }
          },
          "good": {
            "text": "The scene notices you turned down the mattress money. Cred, it turns out, is also a currency, just slower.",
            "effects": {
              "cred": 7,
              "network": 3
            }
          },
          "incredible": {
            "text": "A better brand hears you said no to the mattress and offers double for a real placement, song intact. Integrity compounded.",
            "effects": {
              "cred": 8,
              "money": 200,
              "fame": 5
            }
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
    "requires": {
      "demoMin": 1
    },
    "art": "ev_n2_release_single",
    "context": "The demo, finished, waiting",
    "prompt": "You have a demo good enough to be a single. The question every artist eventually faces: release it now while you feel it, or polish it until the feeling’s gone.",
    "tags": [
      "record",
      "write"
    ],
    "choices": {
      "left": {
        "label": "Ship it now",
        "governingStats": {
          "creativity": 1,
          "network": 0.3
        },
        "tags": [
          "record",
          "risky"
        ],
        "outcomes": {
          "bad": {
            "text": "You release into a quiet week. The song deserves more than the eleven plays it gets, but it’s out. It’s real now.",
            "effects": {
              "creativity": 3,
              "fame": 3,
              "releaseDemo": 55
            }
          },
          "good": {
            "text": "The single drops and the timing is right. It finds the chart’s lower rungs and starts to climb.",
            "effects": {
              "creativity": 5,
              "fame": 6,
              "cred": 3,
              "releaseDemo": 62
            }
          },
          "incredible": {
            "text": "You caught the wave. The single debuts higher than anything you’ve done. Trusting the feeling paid.",
            "effects": {
              "creativity": 7,
              "fame": 10,
              "cred": 4,
              "releaseDemo": 70
            }
          }
        }
      },
      "right": {
        "label": "Polish it first",
        "minigame": "mixdown",
        "governingStats": {
          "skill": 1,
          "creativity": 0.4
        },
        "tags": [
          "studio",
          "safe"
        ],
        "outcomes": {
          "bad": {
            "text": "You polish the life out of it. It’s pristine and slightly dead, like a museum piece of a song you used to feel.",
            "effects": {
              "skill": 3,
              "cred": 2,
              "polishDemo": 4
            }
          },
          "good": {
            "text": "The extra week finds the low end and the truth. It’s better now, and you’ll release it braver.",
            "effects": {
              "skill": 5,
              "cred": 4,
              "polishDemo": 8
            }
          },
          "incredible": {
            "text": "You find the version that was hiding inside the demo. When it drops, it will drop as a finished thing.",
            "effects": {
              "skill": 6,
              "cred": 5,
              "creativity": 3,
              "polishDemo": 10
            }
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
    "requires": {
      "chartingMin": 1
    },
    "art": "ev_n2_push_the_single",
    "context": "The song is charting. Now what.",
    "prompt": "Your song, {song}, is on the chart and could climb — or slide. There’s a window to push it, and pushing means favors, posts, and pretending you’re not refreshing the numbers hourly.",
    "tags": [
      "social",
      "deal"
    ],
    "choices": {
      "left": {
        "label": "Pour on the promo",
        "governingStats": {
          "network": 1
        },
        "tags": [
          "social",
          "mainstream",
          "risky"
        ],
        "outcomes": {
          "bad": {
            "text": "You push too hard and the internet smells the effort. The song holds, barely, on your dignity’s dime.",
            "effects": {
              "network": 3,
              "burnout": 5,
              "hypeSong": 18
            }
          },
          "good": {
            "text": "Coordinated, relentless, effective. The song climbs a few rungs on sheer will and a favor economy.",
            "effects": {
              "network": 5,
              "fame": 5,
              "hypeSong": 24
            }
          },
          "incredible": {
            "text": "The push catches a real wind. {song} climbs past where it had any right to be. Momentum is a drug.",
            "effects": {
              "network": 6,
              "fame": 8,
              "cred": 2,
              "hypeSong": 30
            }
          }
        }
      },
      "right": {
        "label": "Let it breathe",
        "governingStats": {
          "cred": 1
        },
        "tags": [
          "indie",
          "safe"
        ],
        "outcomes": {
          "bad": {
            "text": "You let it ride and it rides right off the chart. Purists respect you. The chart does not.",
            "effects": {
              "cred": 4,
              "fame": 2
            }
          },
          "good": {
            "text": "The song finds its own level, honestly. Slower, realer, and the fans it keeps, it keeps for good.",
            "effects": {
              "cred": 6,
              "fame": 4,
              "network": 2
            }
          },
          "incredible": {
            "text": "Word of mouth does what money couldn’t. It climbs on its own legs, and that story becomes part of the song.",
            "effects": {
              "cred": 7,
              "fame": 7,
              "network": 3
            }
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
    "tags": [
      "studio",
      "work"
    ],
    "choices": {
      "left": {
        "label": "Nail the part",
        "minigame": "take",
        "governingStats": {
          "skill": 1
        },
        "tags": [
          "studio",
          "safe"
        ],
        "outcomes": {
          "bad": {
            "text": "You get it in eleven takes. The producer says “we’ll fix it,” which is the two worst words in the room.",
            "effects": {
              "skill": 4,
              "money": 80,
              "burnout": 4
            }
          },
          "good": {
            "text": "First take, then a better second for insurance. The producer writes your number on the good clipboard.",
            "effects": {
              "skill": 6,
              "money": 120,
              "network": 4
            }
          },
          "incredible": {
            "text": "You add a part nobody asked for and everybody keeps. You’re a first call now, in one specific rolodex.",
            "effects": {
              "skill": 7,
              "money": 150,
              "network": 6,
              "cred": 4
            }
          }
        }
      },
      "right": {
        "label": "Make it yours",
        "governingStats": {
          "creativity": 1,
          "skill": 0.4
        },
        "tags": [
          "studio",
          "risky",
          "tone"
        ],
        "outcomes": {
          "bad": {
            "text": "You reinterpret the part. The artist wanted a session player, not a collaborator. Politely, you are not called back.",
            "effects": {
              "creativity": 3,
              "money": 80,
              "cred": -2
            }
          },
          "good": {
            "text": "Your interpretation elevates the song. The artist notices you noticed. That’s the beginning of respect.",
            "effects": {
              "creativity": 6,
              "money": 100,
              "network": 4,
              "cred": 3
            }
          },
          "incredible": {
            "text": "The part you invented becomes the hook of their single. Uncredited, unforgettable, and quietly, professionally legendary.",
            "effects": {
              "creativity": 8,
              "money": 140,
              "network": 5,
              "cred": 5
            }
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
    "tags": [
      "live",
      "rival"
    ],
    "choices": {
      "left": {
        "label": "Fight for the closing slot",
        "governingStats": {
          "network": 1,
          "skill": 0.4
        },
        "tags": [
          "live",
          "risky",
          "rival"
        ],
        "outcomes": {
          "bad": {
            "text": "You win the slot and the tension. {rival} plays the set of their life out of spite, then leaves before yours.",
            "effects": {
              "network": 3,
              "fame": 4,
              "burnout": 5,
              "rivalry": 1
            }
          },
          "good": {
            "text": "You close, and you earn it. {rival} watches from the wings, arms crossed, taking notes they’ll never admit to.",
            "effects": {
              "network": 5,
              "fame": 8,
              "cred": 3,
              "rivalry": 1
            }
          },
          "incredible": {
            "text": "You close the night so hard the promoter rebooks you both — you headlining, {rival} opening. The order is the message.",
            "effects": {
              "network": 7,
              "fame": 12,
              "cred": 4,
              "rivalry": 1
            }
          }
        }
      },
      "right": {
        "label": "Share the stage, genuinely",
        "governingStats": {
          "creativity": 1,
          "network": 0.3
        },
        "tags": [
          "live",
          "band"
        ],
        "outcomes": {
          "bad": {
            "text": "You propose a joint encore. {rival} agrees, then plays over your solo. The crowd loves it. You do not.",
            "effects": {
              "creativity": 3,
              "fame": 5,
              "rivalry": 1
            }
          },
          "good": {
            "text": "The joint encore actually works. Two crowds become one, and the feud cools by one careful degree.",
            "effects": {
              "creativity": 5,
              "fame": 6,
              "network": 4,
              "rivalry": -1
            }
          },
          "incredible": {
            "text": "You and {rival} tear the roof off together. Backstage, grudgingly, a real conversation. The rivalry softens into respect.",
            "effects": {
              "creativity": 7,
              "fame": 9,
              "network": 5,
              "rivalry": -1
            }
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
    "requires": {
      "rivalryMax": 4
    },
    "art": "ev_n2_rival_truce_offer",
    "context": "A text from {rival}, unexpectedly",
    "prompt": "{rival} texts: “this feud is exhausting and neither of us is winning. Beer?” It could be a genuine olive branch. It could be reconnaissance. With {rival}, it’s usually both.",
    "tags": [
      "network",
      "rival"
    ],
    "choices": {
      "left": {
        "label": "Take the beer",
        "governingStats": {
          "network": 1
        },
        "tags": [
          "network",
          "safe",
          "rival"
        ],
        "outcomes": {
          "bad": {
            "text": "The beer is nice. Two weeks later {rival} uses everything you said as a bit in an interview. Cost of peace.",
            "effects": {
              "network": 3,
              "cred": 2,
              "rivalry": -1
            }
          },
          "good": {
            "text": "You actually talk. Turns out the feud was mostly the scene’s invention. You leave lighter and less alone.",
            "effects": {
              "network": 5,
              "cred": 3,
              "burnout": -3,
              "rivalry": -1
            }
          },
          "incredible": {
            "text": "The beer becomes a friendship becomes a plan. Two rivals, one idea, and the scene doesn’t know what to do with it.",
            "effects": {
              "network": 7,
              "cred": 4,
              "rivalry": -2
            }
          }
        }
      },
      "right": {
        "label": "Keep your edge",
        "governingStats": {
          "cred": 1
        },
        "tags": [
          "indie",
          "risky",
          "rival"
        ],
        "outcomes": {
          "bad": {
            "text": "You decline. {rival} shrugs publicly and paints you as the difficult one. The story travels. You gave it the plot.",
            "effects": {
              "cred": 2,
              "fame": 2,
              "rivalry": 1
            }
          },
          "good": {
            "text": "You keep the rivalry sharp on purpose — it makes you both better. You practice harder just to spite them.",
            "effects": {
              "cred": 5,
              "skill": 3,
              "rivalry": 1
            }
          },
          "incredible": {
            "text": "The feud becomes fuel. You write your best song aimed squarely at {rival}, who will pretend not to notice it, forever.",
            "effects": {
              "cred": 6,
              "creativity": 5,
              "fame": 4,
              "rivalry": 1
            }
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
    "requires": {
      "weatherIs": "dance_craze"
    },
    "art": "ev_n2_weather_dance_craze",
    "context": "Fifteen seconds ruling the earth",
    "prompt": "There’s a dance. It has a hand-thing. Every song that fits it is exploding and every song that doesn’t is invisible. A choreographer offers to build the hand-thing around your chorus.",
    "tags": [
      "social",
      "mainstream"
    ],
    "choices": {
      "left": {
        "label": "Build the hand-thing",
        "governingStats": {
          "network": 1,
          "creativity": 0.4
        },
        "tags": [
          "social",
          "mainstream",
          "risky"
        ],
        "outcomes": {
          "bad": {
            "text": "The dance is fine. The song under it gets buried by the dance. Millions do the move; nobody learns your name.",
            "effects": {
              "network": 3,
              "fame": 6,
              "cred": -3
            }
          },
          "good": {
            "text": "The dance and the song rise together. For one glorious week you are a verb people do at weddings.",
            "effects": {
              "network": 5,
              "fame": 12,
              "cred": -2
            }
          },
          "incredible": {
            "text": "The move is inseparable from the song, and the song is unmistakably yours. You engineered a moment. It worked.",
            "effects": {
              "network": 6,
              "fame": 18,
              "cred": 2
            }
          }
        }
      },
      "right": {
        "label": "Refuse the trend",
        "governingStats": {
          "cred": 1,
          "creativity": 0.3
        },
        "tags": [
          "indie",
          "safe"
        ],
        "outcomes": {
          "bad": {
            "text": "You sit the craze out on principle and watch lesser songs lap you. The principle keeps you warm. Barely.",
            "effects": {
              "cred": 4,
              "burnout": 3
            }
          },
          "good": {
            "text": "You make the anti-craze song, deliberately un-danceable, and the people tired of the dance find you first.",
            "effects": {
              "cred": 6,
              "creativity": 4,
              "fame": 4
            }
          },
          "incredible": {
            "text": "When the craze dies — and it dies fast — your song is still standing. You bet on the long half and won it.",
            "effects": {
              "cred": 8,
              "creativity": 5,
              "fame": 6
            }
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
    "requires": {
      "weatherIs": "payola_probe"
    },
    "art": "ev_n2_weather_payola",
    "context": "The playlist editor is “on sabbatical”",
    "prompt": "The subpoenas hit the mailroom and suddenly every playlist editor is “taking time.” The gatekeepers vanished overnight and the gates are just… open. Briefly. For anyone honest enough to walk through.",
    "tags": [
      "deal",
      "social"
    ],
    "choices": {
      "left": {
        "label": "Walk through the open gate",
        "governingStats": {
          "network": 1,
          "cred": 0.4
        },
        "tags": [
          "deal",
          "risky"
        ],
        "outcomes": {
          "bad": {
            "text": "You pitch the leaderless playlists directly. Half bounce, but the half that land, land clean — no favor owed.",
            "effects": {
              "network": 3,
              "fame": 4,
              "cred": 3
            }
          },
          "good": {
            "text": "With the pay-to-play crowd sidelined, merit briefly matters. Your song gets added on the strength of the song.",
            "effects": {
              "network": 5,
              "fame": 7,
              "cred": 5
            }
          },
          "incredible": {
            "text": "You slot into three big playlists on merit alone, right as everyone’s watching who got in clean. The timing is a halo.",
            "effects": {
              "network": 6,
              "fame": 11,
              "cred": 7
            }
          }
        }
      },
      "right": {
        "label": "Stay clear of the mess",
        "governingStats": {
          "cred": 1
        },
        "tags": [
          "indie",
          "safe"
        ],
        "outcomes": {
          "bad": {
            "text": "You keep your distance from the whole radioactive business. Safe, invisible, and quietly proud of both.",
            "effects": {
              "cred": 4,
              "burnout": 2
            }
          },
          "good": {
            "text": "You build the old way — shows, tapes, hands shaken — while the industry cleans its house. Slow bricks, real house.",
            "effects": {
              "cred": 6,
              "network": 3,
              "fame": 3
            }
          },
          "incredible": {
            "text": "When the dust settles, you’re the artist with no exposure to the scandal and a fanbase built entirely by hand. Bulletproof.",
            "effects": {
              "cred": 8,
              "network": 4,
              "fame": 5
            }
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
    "tags": [
      "deal",
      "work"
    ],
    "choices": {
      "left": {
        "label": "Go big on merch",
        "governingStats": {
          "network": 1
        },
        "tags": [
          "deal",
          "work",
          "risky"
        ],
        "outcomes": {
          "bad": {
            "text": "You order two hundred shirts in a color that photographs as “hospital.” You will be selling these for years.",
            "effects": {
              "network": 2,
              "money": -60,
              "burnout": 4
            }
          },
          "good": {
            "text": "Good design, right sizes, fair price. The table becomes the most profitable ten square feet of the tour.",
            "effects": {
              "network": 4,
              "money": 140
            }
          },
          "incredible": {
            "text": "A fan wears your shirt in a photo that travels. The shirt becomes the ad. The merch sells the merch.",
            "effects": {
              "network": 5,
              "money": 220,
              "fame": 4
            }
          }
        }
      },
      "right": {
        "label": "Keep it lean and personal",
        "governingStats": {
          "creativity": 1
        },
        "tags": [
          "indie",
          "safe"
        ],
        "outcomes": {
          "bad": {
            "text": "You hand-screen forty shirts and they sell out and you’re out of shirts by the second city. Scarcity, unplanned.",
            "effects": {
              "creativity": 3,
              "money": 40,
              "cred": 2
            }
          },
          "good": {
            "text": "Small runs, hand-numbered, a little precious, a lot beloved. The fans who buy them feel chosen.",
            "effects": {
              "creativity": 5,
              "money": 80,
              "cred": 4
            }
          },
          "incredible": {
            "text": "Your hand-made merch becomes collectible. People trade your tour shirts like currency. Small was the flex.",
            "effects": {
              "creativity": 6,
              "money": 120,
              "cred": 5,
              "fame": 3
            }
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
    "tags": [
      "studio",
      "deal"
    ],
    "choices": {
      "left": {
        "label": "Trust their vision",
        "governingStats": {
          "skill": 1,
          "network": 0.4
        },
        "tags": [
          "studio",
          "safe",
          "tone"
        ],
        "outcomes": {
          "bad": {
            "text": "The record sounds expensive and unlike you. It’s the best-produced version of someone you’re not.",
            "effects": {
              "skill": 4,
              "cred": -3,
              "money": -50
            }
          },
          "good": {
            "text": "Their polish plus your songs equals the best you’ve sounded. You learn a decade of tricks in three weeks.",
            "effects": {
              "skill": 6,
              "cred": 3,
              "network": 4
            }
          },
          "incredible": {
            "text": "The producer pushes you somewhere you couldn’t reach alone, and it’s still unmistakably yours. A real record.",
            "effects": {
              "skill": 8,
              "cred": 5,
              "network": 5,
              "fame": 4
            }
          }
        }
      },
      "right": {
        "label": "Keep creative control",
        "governingStats": {
          "creativity": 1
        },
        "tags": [
          "studio",
          "risky",
          "indie"
        ],
        "outcomes": {
          "bad": {
            "text": "You self-produce out of stubbornness. It sounds like your bedroom, because it is. Charming, or unfinished. Both.",
            "effects": {
              "creativity": 3,
              "cred": 3,
              "burnout": 4
            }
          },
          "good": {
            "text": "You keep the reins and the record stays yours, rough edges and all. The rough edges are the point.",
            "effects": {
              "creativity": 6,
              "cred": 5,
              "skill": 2
            }
          },
          "incredible": {
            "text": "Your uncompromised record becomes the one people cite as “the real one.” Control was the sound all along.",
            "effects": {
              "creativity": 8,
              "cred": 7,
              "fame": 4
            }
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
    "requires": {
      "burnoutMin": 45
    },
    "art": "ev_n2_burnout_wall_early",
    "context": "The van, a gas station, 2 a.m.",
    "prompt": "You catch your reflection in the gas-station glass and don’t entirely recognize the person touring this hard. The tank is full. You are not. There’s a night off available if you take it.",
    "tags": [
      "rest",
      "home"
    ],
    "choices": {
      "left": {
        "label": "Take the night off",
        "governingStats": {
          "cred": 1
        },
        "tags": [
          "rest",
          "safe"
        ],
        "outcomes": {
          "bad": {
            "text": "You rest and feel guilty the whole time, which is not resting, which is guilt with a pillow.",
            "effects": {
              "burnout": -8,
              "cred": 2
            }
          },
          "good": {
            "text": "You sleep ten hours and remember why you started. The songs sound different when you’re a person again.",
            "effects": {
              "burnout": -14,
              "cred": 3,
              "creativity": 2
            }
          },
          "incredible": {
            "text": "One real day off resets everything. You come back sharper than the grind ever made you. Rest is a technique.",
            "effects": {
              "burnout": -20,
              "cred": 4,
              "skill": 3
            }
          }
        }
      },
      "right": {
        "label": "Push through",
        "governingStats": {
          "skill": 1
        },
        "tags": [
          "work",
          "risky"
        ],
        "outcomes": {
          "bad": {
            "text": "You push through and leave something behind on that stage that you can’t quite name and won’t get back cheap.",
            "effects": {
              "skill": 3,
              "fame": 4,
              "burnout": 10
            }
          },
          "good": {
            "text": "You grind out the extra shows and the money’s real, even if the reflection in the glass keeps its distance.",
            "effects": {
              "skill": 5,
              "fame": 5,
              "money": 100,
              "burnout": 6
            }
          },
          "incredible": {
            "text": "You catch a second wind that feels almost supernatural and play the run of your life. Don’t count on it twice.",
            "effects": {
              "skill": 7,
              "fame": 9,
              "money": 120,
              "burnout": 5
            }
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
    "tags": [
      "write",
      "home"
    ],
    "choices": {
      "left": {
        "label": "Write straight into it",
        "minigame": "ideas",
        "governingStats": {
          "creativity": 1
        },
        "tags": [
          "write",
          "risky",
          "indie"
        ],
        "outcomes": {
          "bad": {
            "text": "It’s too soon and too raw and the song is just the wound with a melody. You put it in the drawer for later.",
            "effects": {
              "creativity": 3,
              "burnout": 4
            }
          },
          "good": {
            "text": "You find the words for the thing you couldn’t say out loud. The song holds it so you don’t have to alone.",
            "effects": {
              "creativity": 6,
              "cred": 4,
              "writeSong": true
            }
          },
          "incredible": {
            "text": "You write the truest thing you’ve ever written. Someday a stranger will play it on their worst night and not feel alone.",
            "effects": {
              "creativity": 8,
              "cred": 6,
              "fame": 3,
              "writeSong": true
            }
          }
        }
      },
      "right": {
        "label": "Write your way out",
        "governingStats": {
          "creativity": 1,
          "skill": 0.3
        },
        "tags": [
          "write",
          "safe"
        ],
        "outcomes": {
          "bad": {
            "text": "You write something bright to escape the dark and it rings a little hollow, like whistling past a room.",
            "effects": {
              "creativity": 3,
              "burnout": 2
            }
          },
          "good": {
            "text": "You write the hopeful one on purpose, as medicine, and it works — on you first, then on everyone.",
            "effects": {
              "creativity": 5,
              "cred": 3,
              "fame": 3
            }
          },
          "incredible": {
            "text": "The bright song you built as armor becomes the one people sing back at you for joy. You made the exit and it worked.",
            "effects": {
              "creativity": 7,
              "cred": 4,
              "fame": 5
            }
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
    "tags": [
      "social",
      "network"
    ],
    "choices": {
      "left": {
        "label": "Broker peace",
        "governingStats": {
          "network": 1,
          "cred": 0.3
        },
        "tags": [
          "network",
          "safe"
        ],
        "outcomes": {
          "bad": {
            "text": "You try to mediate and both sides decide you’re secretly on the other’s. Now it’s a three-way thing. Great.",
            "effects": {
              "network": 2,
              "burnout": 4
            }
          },
          "good": {
            "text": "You get the two bands in a room and, improbably, it works. The scene owes you a favor it won’t admit to.",
            "effects": {
              "network": 6,
              "cred": 4
            }
          },
          "incredible": {
            "text": "You broker a truce so cleanly you become the person people bring problems to. Influence, quietly acquired.",
            "effects": {
              "network": 8,
              "cred": 5,
              "fame": 3
            }
          }
        }
      },
      "right": {
        "label": "Stay out of it",
        "governingStats": {
          "cred": 1
        },
        "tags": [
          "indie",
          "safe"
        ],
        "outcomes": {
          "bad": {
            "text": "Your silence reads as a stance to people determined to read it that way. You said nothing and still got quoted.",
            "effects": {
              "cred": 2,
              "burnout": 3
            }
          },
          "good": {
            "text": "You keep your head down and your name out of it, and quietly earn a reputation as the one who just makes music.",
            "effects": {
              "cred": 5,
              "network": 2
            }
          },
          "incredible": {
            "text": "While everyone else torched their week on discourse, you finished a song. The best revenge in this scene is output.",
            "effects": {
              "cred": 6,
              "creativity": 4,
              "fame": 3
            }
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
    "requires": {
      "bandHas": "ox"
    },
    "art": "ev_bs_ox",
    "context": "Ox, after load-in, quietly",
    "prompt": "Ox carried the entire backline up three flights again, alone, and apologized for taking up the stairwell. Tonight he asks for one thing, so gently you almost miss it: “could we maybe get a hand truck?”",
    "tags": [
      "band",
      "work"
    ],
    "choices": {
      "left": {
        "label": "Buy the hand truck. And notice him.",
        "governingStats": {
          "network": 1
        },
        "tags": [
          "band",
          "safe"
        ],
        "outcomes": {
          "bad": {
            "text": "You get the hand truck. Ox is thrilled about the hand truck. You realize you’ve never once asked how he’s doing.",
            "effects": {
              "network": 3,
              "burnout": -2
            }
          },
          "good": {
            "text": "The hand truck AND a real conversation. Ox, it turns out, writes poetry nobody’s asked to read. You ask.",
            "effects": {
              "network": 5,
              "cred": 4,
              "burnout": -4
            }
          },
          "incredible": {
            "text": "You start splitting the load — literally, then in every way. Ox stands a little taller. The whole band does.",
            "effects": {
              "network": 7,
              "cred": 5,
              "burnout": -5
            }
          }
        }
      },
      "right": {
        "label": "Let him keep carrying it",
        "governingStats": {
          "skill": 1
        },
        "tags": [
          "band",
          "work",
          "risky"
        ],
        "outcomes": {
          "bad": {
            "text": "You say “next tour.” Ox nods, the way he always does. Something small closes behind his eyes and you saw it.",
            "effects": {
              "skill": 2,
              "burnout": 3
            }
          },
          "good": {
            "text": "Ox keeps carrying it because Ox always will, but you catch yourself helping now, unprompted. A start.",
            "effects": {
              "skill": 3,
              "network": 3
            }
          },
          "incredible": {
            "text": "You don’t buy the hand truck, but you never let him load alone again. Ox notices the difference. It matters more.",
            "effects": {
              "skill": 4,
              "network": 4,
              "cred": 3,
              "burnout": -2
            }
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
    "requires": {
      "bandHas": "dot"
    },
    "art": "ev_bs_dot",
    "context": "Dot, with a spreadsheet and a look",
    "prompt": "Dot has been quietly keeping the band’s books, and tonight she sits everyone down with a spreadsheet. “So,” she says, in the voice of someone who found something. “We need to talk about where the merch money goes.”",
    "tags": [
      "band",
      "deal"
    ],
    "choices": {
      "left": {
        "label": "Face the numbers",
        "governingStats": {
          "network": 1,
          "cred": 0.3
        },
        "tags": [
          "deal",
          "safe",
          "band"
        ],
        "outcomes": {
          "bad": {
            "text": "The numbers are bleak and the meeting is long and someone cries and it’s maybe you. But now you know.",
            "effects": {
              "network": 3,
              "money": 40,
              "burnout": 4
            }
          },
          "good": {
            "text": "Dot untangles a year of chaos into a plan. You’re not rich, but you’re no longer bleeding money you can’t see.",
            "effects": {
              "network": 5,
              "money": 120,
              "cred": 3
            }
          },
          "incredible": {
            "text": "Dot finds $400 nobody knew you were owed, plus a leak she plugs on the spot. She should run a country. She runs your band.",
            "effects": {
              "network": 6,
              "money": 200,
              "cred": 4
            }
          }
        }
      },
      "right": {
        "label": "Trust the vibes",
        "governingStats": {
          "creativity": 1
        },
        "tags": [
          "indie",
          "risky",
          "band"
        ],
        "outcomes": {
          "bad": {
            "text": "You wave the spreadsheet off. Dot files it, dated, for the day you’ll wish you’d listened. That day is coming.",
            "effects": {
              "creativity": 2,
              "money": -40,
              "burnout": 3
            }
          },
          "good": {
            "text": "You keep it loose but let Dot handle the bank. Freedom for you, order for the money. A fair trade.",
            "effects": {
              "creativity": 4,
              "money": 60,
              "network": 3
            }
          },
          "incredible": {
            "text": "You give Dot full control of the finances and your creative life doubles overnight. Delegation is a superpower.",
            "effects": {
              "creativity": 6,
              "money": 100,
              "network": 4,
              "cred": 3
            }
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
    "tags": [
      "live",
      "tour"
    ],
    "choices": {
      "left": {
        "label": "Win the wanderers",
        "minigame": "crowd",
        "governingStats": {
          "skill": 1,
          "creativity": 0.3
        },
        "tags": [
          "live",
          "risky"
        ],
        "outcomes": {
          "bad": {
            "text": "Noon sun, thin crowd, and a sound tech still setting up during your first song. You play through it. It builds character.",
            "effects": {
              "skill": 4,
              "fame": 3,
              "burnout": 5
            }
          },
          "good": {
            "text": "The crowd triples by your third song as people follow the sound over. Word travels across a field fast.",
            "effects": {
              "skill": 5,
              "fame": 8,
              "network": 4
            }
          },
          "incredible": {
            "text": "You draw people AWAY from the main stage. The festival books you higher next year, on the strength of a noon miracle.",
            "effects": {
              "skill": 7,
              "fame": 13,
              "network": 5,
              "cred": 3
            }
          }
        }
      },
      "right": {
        "label": "Network the field",
        "governingStats": {
          "network": 1
        },
        "tags": [
          "network",
          "safe"
        ],
        "outcomes": {
          "bad": {
            "text": "You spend the day handing out cards to people holding beers. Most become recycling. Two become something.",
            "effects": {
              "network": 4,
              "burnout": 3
            }
          },
          "good": {
            "text": "Backstage is the real festival. You meet three bands and a booker and leave with more contacts than fans.",
            "effects": {
              "network": 6,
              "fame": 3
            }
          },
          "incredible": {
            "text": "You befriend a headliner at the catering tent. By fall you’re opening their tour. The field was the venue.",
            "effects": {
              "network": 9,
              "fame": 6,
              "cred": 3
            }
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
    "tags": [
      "home",
      "network"
    ],
    "choices": {
      "left": {
        "label": "Make real time for them",
        "governingStats": {
          "cred": 1
        },
        "tags": [
          "home",
          "safe"
        ],
        "outcomes": {
          "bad": {
            "text": "You skip the afterparty to catch up and the industry people notice you left. The friend, though, needed it. So did you.",
            "effects": {
              "cred": 4,
              "burnout": -3,
              "network": -2
            }
          },
          "good": {
            "text": "You blow off the schmoozing and get a real hour with a real friend. It refills a tank the touring emptied.",
            "effects": {
              "cred": 5,
              "burnout": -5,
              "creativity": 2
            }
          },
          "incredible": {
            "text": "The friend reminds you who you were before any of this, and you write a song about it that night. Roots, watered.",
            "effects": {
              "cred": 6,
              "burnout": -4,
              "creativity": 4
            }
          }
        }
      },
      "right": {
        "label": "Work the room instead",
        "governingStats": {
          "network": 1
        },
        "tags": [
          "network",
          "risky"
        ],
        "outcomes": {
          "bad": {
            "text": "You promise the friend “next time” and go network. The friend leaves early. Next time is not guaranteed and you both know it.",
            "effects": {
              "network": 4,
              "cred": -3,
              "burnout": 3
            }
          },
          "good": {
            "text": "You make the rounds and land a real contact, but text the friend a long apology from the van. They understand. Mostly.",
            "effects": {
              "network": 6,
              "cred": 2
            }
          },
          "incredible": {
            "text": "You work the room AND drag the friend into it, and they charm someone who books you a month later. Two worlds, merged.",
            "effects": {
              "network": 8,
              "cred": 3,
              "fame": 3
            }
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
    "tags": [
      "live",
      "network"
    ],
    "choices": {
      "left": {
        "label": "Promise the benefit",
        "governingStats": {
          "cred": 1,
          "network": 0.3
        },
        "tags": [
          "live",
          "safe"
        ],
        "outcomes": {
          "bad": {
            "text": "You commit on the spot and immediately realize your calendar is a war crime. You’ll make it work. You have to now.",
            "effects": {
              "cred": 4,
              "burnout": 3,
              "addPromise": {
                "label": "Headline the station benefit",
                "tags": [
                  "live"
                ],
                "cards": 5,
                "reward": {
                  "cred": 8,
                  "fame": 5,
                  "network": 4
                },
                "penalty": {
                  "cred": -6,
                  "network": -3
                }
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
                "tags": [
                  "live"
                ],
                "cards": 5,
                "reward": {
                  "cred": 8,
                  "fame": 5,
                  "network": 4
                },
                "penalty": {
                  "cred": -6,
                  "network": -3
                }
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
                "tags": [
                  "live"
                ],
                "cards": 5,
                "reward": {
                  "cred": 8,
                  "fame": 5,
                  "network": 4
                },
                "penalty": {
                  "cred": -6,
                  "network": -3
                }
              }
            }
          }
        }
      },
      "right": {
        "label": "Give money instead",
        "governingStats": {
          "network": 1
        },
        "tags": [
          "deal",
          "safe"
        ],
        "outcomes": {
          "bad": {
            "text": "You write a check to dodge the calendar problem. It helps the station and stings the DJ, who wanted YOU, not your money.",
            "effects": {
              "network": 2,
              "money": -80,
              "cred": -2
            }
          },
          "good": {
            "text": "You donate generously and honestly, and the station survives the quarter. Not everything has to be a grand gesture.",
            "effects": {
              "network": 4,
              "money": -60,
              "cred": 3
            }
          },
          "incredible": {
            "text": "Your donation inspires a matching drive and the station not only survives but expands. Sometimes the check IS the song.",
            "effects": {
              "network": 6,
              "money": -60,
              "cred": 5,
              "fame": 3
            }
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
    "tags": [
      "work",
      "network"
    ],
    "choices": {
      "left": {
        "label": "Ask the scene for help",
        "governingStats": {
          "network": 1
        },
        "tags": [
          "network",
          "safe"
        ],
        "outcomes": {
          "bad": {
            "text": "You post about it and get sympathy and one loaner amp that hums. You play the show on borrowed everything and pride.",
            "effects": {
              "network": 3,
              "burnout": 5
            }
          },
          "good": {
            "text": "The scene shows up. Three bands lend gear, a shop lends a backline, and you play a show built entirely of goodwill.",
            "effects": {
              "network": 6,
              "cred": 5,
              "fame": 3
            }
          },
          "incredible": {
            "text": "The theft becomes a rallying cry. A benefit gets thrown for YOU, and you come out with better gear and a deeper scene.",
            "effects": {
              "network": 8,
              "cred": 6,
              "money": 150
            }
          }
        }
      },
      "right": {
        "label": "Handle it yourself",
        "governingStats": {
          "skill": 1
        },
        "tags": [
          "work",
          "risky"
        ],
        "outcomes": {
          "bad": {
            "text": "You max a card replacing gear before the show. You play great and can’t afford to feel it. The debt watches from the wings.",
            "effects": {
              "skill": 3,
              "money": -120,
              "burnout": 5
            }
          },
          "good": {
            "text": "You rebuild the rig lean and smart, and honestly it sounds better stripped down. Loss as an edit.",
            "effects": {
              "skill": 5,
              "cred": 3,
              "money": -80
            }
          },
          "incredible": {
            "text": "You rebuild from scratch into exactly the rig you always wanted but never justified. The thief did you a strange favor.",
            "effects": {
              "skill": 7,
              "cred": 4,
              "creativity": 3,
              "money": -60
            }
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
    "tags": [
      "social",
      "write"
    ],
    "choices": {
      "left": {
        "label": "Feed the machine",
        "governingStats": {
          "network": 1,
          "creativity": 0.3
        },
        "tags": [
          "social",
          "mainstream",
          "risky"
        ],
        "outcomes": {
          "bad": {
            "text": "You write to the fifteen seconds and the song is all hook and no body, a highlight reel of a song that doesn’t exist.",
            "effects": {
              "network": 3,
              "fame": 6,
              "cred": -4
            }
          },
          "good": {
            "text": "You learn what the data’s actually telling you — not what to write, but where you lose people — and you get sharper.",
            "effects": {
              "network": 5,
              "fame": 6,
              "skill": 3
            }
          },
          "incredible": {
            "text": "You crack the code without selling your soul: a real song that also happens to be irresistibly clippable. Rare alchemy.",
            "effects": {
              "network": 6,
              "fame": 11,
              "creativity": 3
            }
          }
        }
      },
      "right": {
        "label": "Ignore it entirely",
        "governingStats": {
          "creativity": 1
        },
        "tags": [
          "indie",
          "safe"
        ],
        "outcomes": {
          "bad": {
            "text": "You close the dashboard and write what you want. It performs like it wants: quietly. You sleep fine, though.",
            "effects": {
              "creativity": 4,
              "cred": 3
            }
          },
          "good": {
            "text": "Freed from the numbers, you make your weirdest, best work. The people who find it, find all of it.",
            "effects": {
              "creativity": 6,
              "cred": 5,
              "fame": 3
            }
          },
          "incredible": {
            "text": "Your data-blind album becomes a cult object precisely because it refused to chase anything. The machine hates that it works.",
            "effects": {
              "creativity": 8,
              "cred": 6,
              "fame": 5
            }
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
    "requires": {
      "genreAny": true
    },
    "art": "ev_n2_genre_gatekeep",
    "context": "A purist, at the bar, cornering you",
    "prompt": "Someone deep in the {genre} scene informs you, unprompted, that you’re “doing it wrong.” They have a very long definition of the genre and you are apparently outside it.",
    "tags": [
      "social",
      "indie"
    ],
    "choices": {
      "left": {
        "label": "Defend your take",
        "governingStats": {
          "cred": 1,
          "creativity": 0.3
        },
        "tags": [
          "indie",
          "risky"
        ],
        "outcomes": {
          "bad": {
            "text": "You argue genre theory at a bar and win a fight nobody was scoring. The purist buys their own beer and leaves. Pyrrhic.",
            "effects": {
              "cred": 3,
              "burnout": 3
            }
          },
          "good": {
            "text": "You make a genuine case for evolving the {genre} sound, and even the purist grudgingly nods. Respect, extracted.",
            "effects": {
              "cred": 5,
              "creativity": 3,
              "network": 2
            }
          },
          "incredible": {
            "text": "You articulate your vision so clearly the purist becomes a convert. They now defend YOU to other purists. The bit flips.",
            "effects": {
              "cred": 7,
              "creativity": 4,
              "fame": 3
            }
          }
        }
      },
      "right": {
        "label": "Just let them talk",
        "governingStats": {
          "cred": 1
        },
        "tags": [
          "safe"
        ],
        "outcomes": {
          "bad": {
            "text": "You nod for twenty minutes about “the real” {genre} and lose the evening. Your smile, at least, held.",
            "effects": {
              "cred": 2,
              "burnout": 3
            }
          },
          "good": {
            "text": "You let the purist lecture and quietly file away two things they said that were actually right. Free notes.",
            "effects": {
              "cred": 4,
              "skill": 2
            }
          },
          "incredible": {
            "text": "You out-listen them so thoroughly they leave feeling heard and you leave with your whole evening and their best idea.",
            "effects": {
              "cred": 5,
              "creativity": 3,
              "network": 2
            }
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
    "requires": {
      "venueLevelMin": 1,
      "venueAny": true
    },
    "art": "ev_n2_venue_regular",
    "context": "{venue}, which knows you now",
    "prompt": "You’ve played {venue} enough that the staff know your order and the sound guy pre-sets your levels. Tonight the owner floats an idea: a monthly residency, your night, your rules.",
    "tags": [
      "live",
      "home"
    ],
    "choices": {
      "left": {
        "label": "Take the residency",
        "governingStats": {
          "network": 1,
          "creativity": 0.3
        },
        "tags": [
          "live",
          "home",
          "safe"
        ],
        "outcomes": {
          "bad": {
            "text": "A monthly night sounds great until month three, when you’re out of new material and the regulars notice.",
            "effects": {
              "network": 3,
              "fame": 3,
              "burnout": 4
            }
          },
          "good": {
            "text": "The residency becomes a laboratory. You test new songs on a room that loves you enough to be honest. {venue} thrives.",
            "effects": {
              "network": 5,
              "cred": 4,
              "fame": 4,
              "venueLove": 1
            }
          },
          "incredible": {
            "text": "Your residency becomes THE night in town. People plan around it. {venue}’s owner names a drink after you.",
            "effects": {
              "network": 7,
              "cred": 5,
              "fame": 6,
              "venueLove": 1
            }
          }
        }
      },
      "right": {
        "label": "Keep {venue} special",
        "governingStats": {
          "cred": 1
        },
        "tags": [
          "live",
          "indie"
        ],
        "outcomes": {
          "bad": {
            "text": "You decline to keep it rare, then wonder if you just turned down the one steady thing you had. The doubt lingers.",
            "effects": {
              "cred": 3,
              "burnout": 2
            }
          },
          "good": {
            "text": "You play {venue} on your own terms — rarely, memorably — and every show there becomes an event by scarcity.",
            "effects": {
              "cred": 5,
              "fame": 4,
              "venueLove": 1
            }
          },
          "incredible": {
            "text": "By keeping {venue} special, each return becomes legend. People still talk about the nights you DID play there.",
            "effects": {
              "cred": 6,
              "fame": 6,
              "network": 3,
              "venueLove": 1
            }
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
    "requires": {
      "moneyMax": 60
    },
    "art": "ev_n2_broke_stretch",
    "context": "The bank app, refreshing to the same number",
    "prompt": "The tour’s momentum is real but the bank account is a rumor. Rent is due, the van needs tires, and there’s a corporate gig offer that pays great and dents your soul slightly.",
    "tags": [
      "deal",
      "work"
    ],
    "choices": {
      "left": {
        "label": "Take the corporate gig",
        "governingStats": {
          "skill": 1
        },
        "tags": [
          "work",
          "mainstream",
          "safe"
        ],
        "outcomes": {
          "bad": {
            "text": "You play a product launch for people on their phones. The check is huge. The dignity is a rounding error. It’s fine. It’s fine.",
            "effects": {
              "skill": 3,
              "money": 200,
              "cred": -4
            }
          },
          "good": {
            "text": "The corporate gig is soulless and lucrative and quietly professional. You bank it and buy the tires and breathe.",
            "effects": {
              "skill": 4,
              "money": 250,
              "burnout": 2
            }
          },
          "incredible": {
            "text": "A tech exec at the launch turns out to love real music and becomes a genuine patron. The soulless gig grew a soul.",
            "effects": {
              "skill": 5,
              "money": 300,
              "network": 5
            }
          }
        }
      },
      "right": {
        "label": "Scrape by on real gigs",
        "governingStats": {
          "cred": 1,
          "network": 0.3
        },
        "tags": [
          "live",
          "risky",
          "busk"
        ],
        "outcomes": {
          "bad": {
            "text": "You stack three underpaid real shows and just barely make rent. Broke and unbought. It counts for something. Not tires, though.",
            "effects": {
              "cred": 4,
              "money": 60,
              "burnout": 5
            }
          },
          "good": {
            "text": "You cobble together honest gigs and, somehow, it works out. Lean, proud, and still entirely yourself.",
            "effects": {
              "cred": 6,
              "money": 120,
              "fame": 3
            }
          },
          "incredible": {
            "text": "Refusing the corporate money becomes part of your story, and a fan with means quietly covers your tires. Karma, itemized.",
            "effects": {
              "cred": 7,
              "money": 180,
              "network": 3
            }
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
    "tags": [
      "social",
      "work"
    ],
    "choices": {
      "left": {
        "label": "Trust the vision",
        "governingStats": {
          "creativity": 1
        },
        "tags": [
          "social",
          "risky",
          "indie"
        ],
        "outcomes": {
          "bad": {
            "text": "The video is nine minutes of you underwater holding a lamp. The student calls it “a statement.” The statement is unclear.",
            "effects": {
              "creativity": 3,
              "fame": 3,
              "burnout": 3
            }
          },
          "good": {
            "text": "The unhinged idea works. The video is strange and gorgeous and gets shared by people who don’t even like the song.",
            "effects": {
              "creativity": 6,
              "fame": 8,
              "network": 3
            }
          },
          "incredible": {
            "text": "The video goes places the song alone never could. The student becomes a real director and takes you up with them.",
            "effects": {
              "creativity": 7,
              "fame": 13,
              "network": 5
            }
          }
        }
      },
      "right": {
        "label": "Keep it simple",
        "governingStats": {
          "skill": 1
        },
        "tags": [
          "safe"
        ],
        "outcomes": {
          "bad": {
            "text": "You insist on a straightforward performance video and it’s exactly as forgettable as “straightforward” promises.",
            "effects": {
              "skill": 2,
              "fame": 2
            }
          },
          "good": {
            "text": "A clean, well-shot performance video that makes you look like a real band. Sometimes competent is the whole win.",
            "effects": {
              "skill": 4,
              "fame": 5,
              "network": 2
            }
          },
          "incredible": {
            "text": "The simple video is so well-executed it becomes the definitive version of the song in people’s heads. Restraint, rewarded.",
            "effects": {
              "skill": 5,
              "fame": 8,
              "cred": 3
            }
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
    "tags": [
      "network",
      "live"
    ],
    "choices": {
      "left": {
        "label": "Bring them along",
        "governingStats": {
          "network": 1,
          "cred": 0.3
        },
        "tags": [
          "network",
          "safe",
          "band"
        ],
        "outcomes": {
          "bad": {
            "text": "They’re green and the split gets tight, but the shows are warmer for having them. You’re somebody’s big break now.",
            "effects": {
              "network": 4,
              "cred": 4,
              "money": -40
            }
          },
          "good": {
            "text": "They’re better than you expected and grateful in a way that reminds you why you do this. The tour lifts everyone.",
            "effects": {
              "network": 6,
              "cred": 5,
              "fame": 3
            }
          },
          "incredible": {
            "text": "The young band blows up a year later and never stops crediting you. That loyalty pays dividends for the rest of your career.",
            "effects": {
              "network": 8,
              "cred": 6,
              "fame": 4
            }
          }
        }
      },
      "right": {
        "label": "Keep the tour lean",
        "governingStats": {
          "network": 1
        },
        "tags": [
          "work",
          "risky"
        ],
        "outcomes": {
          "bad": {
            "text": "You say no to protect the margins. The band’s face falls, and you recognize the exact fall. It sits with you a while.",
            "effects": {
              "network": 2,
              "money": 40,
              "cred": -2
            }
          },
          "good": {
            "text": "You decline kindly and connect them to a better-fit tour instead. Not everything is yours to carry. They land fine.",
            "effects": {
              "network": 4,
              "cred": 3,
              "money": 40
            }
          },
          "incredible": {
            "text": "You can’t take them but you produce their demo for free one weekend, and it launches them. Mentorship without the tour math.",
            "effects": {
              "network": 6,
              "cred": 5,
              "money": 20
            }
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
    "requires": {
      "fameMin": 30
    },
    "art": "ev_n2_label_sniff",
    "context": "An A&R rep, three drinks in, at your show",
    "prompt": "A label A&R is at your show, which is either everything or nothing. They love you tonight. They love four bands a night. The trick is knowing which kind of love this is before you sign anything.",
    "tags": [
      "deal",
      "network"
    ],
    "choices": {
      "left": {
        "label": "Play it cool",
        "governingStats": {
          "network": 1,
          "cred": 0.3
        },
        "tags": [
          "deal",
          "safe"
        ],
        "outcomes": {
          "bad": {
            "text": "You play hard to get and they take you at your word and move on to band three. Cool, it turns out, can be too cool.",
            "effects": {
              "network": 2,
              "cred": 3,
              "burnout": 3
            }
          },
          "good": {
            "text": "You stay measured, ask good questions, and leave them wanting more. They text the next morning. That’s the tell.",
            "effects": {
              "network": 6,
              "cred": 4,
              "fame": 4
            }
          },
          "incredible": {
            "text": "Your composure reads as leverage you don’t have yet, and the offer that comes is better for it. Never let them see you refresh.",
            "effects": {
              "network": 8,
              "cred": 5,
              "fame": 6
            }
          }
        }
      },
      "right": {
        "label": "Show them everything",
        "governingStats": {
          "creativity": 1,
          "network": 0.4
        },
        "tags": [
          "deal",
          "risky",
          "fame"
        ],
        "outcomes": {
          "bad": {
            "text": "You over-eager the whole pitch and they smell the need. The follow-up never comes. Desperation has a frequency they hear.",
            "effects": {
              "creativity": 3,
              "fame": 3,
              "cred": -2
            }
          },
          "good": {
            "text": "You lay out the full vision and it’s genuinely compelling. They leave believing in you, which is the actual product.",
            "effects": {
              "creativity": 5,
              "network": 5,
              "fame": 5
            }
          },
          "incredible": {
            "text": "Your all-in pitch is so complete they don’t just want to sign you, they want to build the label’s next year around you.",
            "effects": {
              "creativity": 7,
              "network": 8,
              "fame": 8,
              "cred": 3
            }
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
    "tags": [
      "social",
      "write"
    ],
    "choices": {
      "left": {
        "label": "Ride the cover",
        "governingStats": {
          "network": 1
        },
        "tags": [
          "social",
          "mainstream",
          "risky"
        ],
        "outcomes": {
          "bad": {
            "text": "You post more covers and the numbers stay up and the originals stay buried. You’re famous for someone else’s song.",
            "effects": {
              "network": 3,
              "fame": 8,
              "cred": -4
            }
          },
          "good": {
            "text": "You milk the cover’s reach smartly, slipping originals into every post, and slowly the audience turns toward your stuff.",
            "effects": {
              "network": 5,
              "fame": 8,
              "cred": 2
            }
          },
          "incredible": {
            "text": "You do a cover so definitively that the original artist shouts you out, and their whole fanbase discovers you. Jackpot.",
            "effects": {
              "network": 7,
              "fame": 14,
              "cred": 3
            }
          }
        }
      },
      "right": {
        "label": "Redirect to your songs",
        "governingStats": {
          "creativity": 1,
          "network": 0.3
        },
        "tags": [
          "write",
          "indie"
        ],
        "outcomes": {
          "bad": {
            "text": "You pivot hard to originals and the cover crowd evaporates. The people who stay are yours, but there are fewer of them.",
            "effects": {
              "creativity": 4,
              "cred": 4,
              "fame": -2
            }
          },
          "good": {
            "text": "You use the cover as a doorway and get a real chunk of that audience to walk through it into your actual music.",
            "effects": {
              "creativity": 6,
              "cred": 5,
              "fame": 5
            }
          },
          "incredible": {
            "text": "You convert the cover’s virality into genuine fans of YOUR work so smoothly that people forget the cover came first.",
            "effects": {
              "creativity": 8,
              "cred": 6,
              "fame": 8
            }
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
    "requires": {
      "bandMin": 2
    },
    "art": "ev_n2_bandmate_doubt",
    "context": "A bandmate, at the diner, serious",
    "prompt": "One of your bandmates has been quiet all tour, and over bad diner coffee it comes out: they’re not sure they can keep doing this. Not the music. The everything-else that comes with the music.",
    "tags": [
      "band",
      "home"
    ],
    "choices": {
      "left": {
        "label": "Really listen",
        "governingStats": {
          "cred": 1
        },
        "tags": [
          "band",
          "safe"
        ],
        "outcomes": {
          "bad": {
            "text": "You listen and it’s heavier than you were ready for. No solution tonight, just a friend, less alone at a diner. Sometimes that’s the whole job.",
            "effects": {
              "cred": 4,
              "burnout": -2
            }
          },
          "good": {
            "text": "You hear them out fully and rework the tour to be survivable for everyone. The band gets healthier and, quietly, better.",
            "effects": {
              "cred": 6,
              "network": 3,
              "burnout": -4
            }
          },
          "incredible": {
            "text": "The honest conversation rebuilds the band on stronger ground. They stay, and they stay because you made it worth staying.",
            "effects": {
              "cred": 7,
              "network": 5,
              "creativity": 3
            }
          }
        }
      },
      "right": {
        "label": "Push for the dream",
        "governingStats": {
          "network": 1
        },
        "tags": [
          "band",
          "risky"
        ],
        "outcomes": {
          "bad": {
            "text": "You make the case for pushing on and they nod along and you can tell you didn’t reach them. The distance in the van grows.",
            "effects": {
              "network": 2,
              "burnout": 5
            }
          },
          "good": {
            "text": "You reignite their belief with a genuinely inspiring pitch about what’s just ahead. They recommit, tentatively, but really.",
            "effects": {
              "network": 5,
              "fame": 3,
              "cred": 2
            }
          },
          "incredible": {
            "text": "Your conviction is so real it reminds everyone why they signed up. The band comes out of that diner unbreakable.",
            "effects": {
              "network": 7,
              "cred": 4,
              "fame": 4
            }
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
    "requires": {
      "hustleMin": 2
    },
    "art": "ev_n2_hustle_audit_two",
    "context": "Tax season, a shoebox of receipts",
    "prompt": "You have enough side hustles now that tax season is genuinely confusing. An accountant looks at your shoebox of income streams and says, with respect, “you’re a small business having a breakdown.”",
    "tags": [
      "deal",
      "work"
    ],
    "choices": {
      "left": {
        "label": "Get organized",
        "governingStats": {
          "network": 1
        },
        "tags": [
          "deal",
          "work",
          "safe"
        ],
        "outcomes": {
          "bad": {
            "text": "You spend a weekend on spreadsheets instead of songs. Boring, necessary, and mildly soul-crushing. But legal now.",
            "effects": {
              "network": 3,
              "money": 60,
              "burnout": 4
            }
          },
          "good": {
            "text": "You systematize the hustles and discover you’re making more than you thought. Financial clarity is its own kind of freedom.",
            "effects": {
              "network": 5,
              "money": 140
            }
          },
          "incredible": {
            "text": "Organized, the hustles compound. You realize you’ve accidentally built something durable underneath the dream. Security.",
            "effects": {
              "network": 6,
              "money": 220,
              "cred": 2
            }
          }
        }
      },
      "right": {
        "label": "Keep it chaotic",
        "governingStats": {
          "creativity": 1
        },
        "tags": [
          "indie",
          "risky"
        ],
        "outcomes": {
          "bad": {
            "text": "You shove the shoebox back in the closet and vow to deal with it later. Later is coming. Later always comes.",
            "effects": {
              "creativity": 2,
              "money": -40,
              "burnout": 3
            }
          },
          "good": {
            "text": "You keep it loose and pour the saved time into actual music. Messy books, full notebook. A defensible trade.",
            "effects": {
              "creativity": 5,
              "cred": 3
            }
          },
          "incredible": {
            "text": "Your refusal to become an accountant means you write three songs that weekend, and one of them is a keeper.",
            "effects": {
              "creativity": 7,
              "cred": 3,
              "writeSong": true
            }
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
    "tags": [
      "practice",
      "live"
    ],
    "choices": {
      "left": {
        "label": "Drill it tight",
        "minigame": "tighten",
        "governingStats": {
          "skill": 1
        },
        "tags": [
          "practice",
          "safe"
        ],
        "outcomes": {
          "bad": {
            "text": "You over-rehearse into stiffness. Tomorrow the set is flawless and airless, a beautiful machine with no pulse.",
            "effects": {
              "skill": 4,
              "burnout": 5
            }
          },
          "good": {
            "text": "Tight but breathing. The transitions snap, the band locks in, and tomorrow you won’t have to think, only feel.",
            "effects": {
              "skill": 6,
              "cred": 3,
              "burnout": 3
            }
          },
          "incredible": {
            "text": "You drill it into your bones. Tomorrow your hands are free to fly because they’re not worried about the parts. Mastery.",
            "effects": {
              "skill": 8,
              "cred": 4
            }
          }
        }
      },
      "right": {
        "label": "Leave room for magic",
        "governingStats": {
          "creativity": 1,
          "skill": 0.3
        },
        "tags": [
          "practice",
          "risky"
        ],
        "outcomes": {
          "bad": {
            "text": "You leave it loose and tomorrow the looseness becomes a train wreck in song four. Chaos is not always magic. Sometimes it’s just chaos.",
            "effects": {
              "creativity": 3,
              "burnout": 4
            }
          },
          "good": {
            "text": "The room you left fills with a genuine moment tomorrow — an improvised outro the crowd will remember.",
            "effects": {
              "creativity": 6,
              "fame": 4,
              "cred": 3
            }
          },
          "incredible": {
            "text": "The space you protected becomes the best five minutes of the show, a jam nobody planned that everybody filmed.",
            "effects": {
              "creativity": 8,
              "fame": 6,
              "cred": 4
            }
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
    "tags": [
      "deal",
      "social"
    ],
    "choices": {
      "left": {
        "label": "Make peace with it",
        "governingStats": {
          "cred": 1
        },
        "tags": [
          "indie",
          "safe"
        ],
        "outcomes": {
          "bad": {
            "text": "You accept that streaming is a billboard, not an income, and feel briefly hollow about the whole enterprise.",
            "effects": {
              "cred": 3,
              "burnout": 3
            }
          },
          "good": {
            "text": "You reframe streams as reach and shows as income, and build the tour math around it. Clarity beats bitterness.",
            "effects": {
              "cred": 5,
              "network": 3
            }
          },
          "incredible": {
            "text": "You publicly, wittily break down the streaming math and it resonates hard. You become a voice on it, which drives people to your shows.",
            "effects": {
              "cred": 7,
              "fame": 5,
              "network": 3
            }
          }
        }
      },
      "right": {
        "label": "Rage against it",
        "governingStats": {
          "creativity": 1,
          "cred": 0.3
        },
        "tags": [
          "social",
          "risky",
          "indie"
        ],
        "outcomes": {
          "bad": {
            "text": "You post a furious thread about the payout model. It’s correct and exhausting and you spend a day arguing with strangers.",
            "effects": {
              "creativity": 2,
              "cred": 3,
              "burnout": 5
            }
          },
          "good": {
            "text": "You channel the rage into a song about the whole broken machine, and it hits a nerve with everyone as broke as you.",
            "effects": {
              "creativity": 6,
              "cred": 5,
              "fame": 4
            }
          },
          "incredible": {
            "text": "Your protest song becomes an anthem for underpaid artists everywhere. The check was tiny; the statement was enormous.",
            "effects": {
              "creativity": 8,
              "cred": 7,
              "fame": 6
            }
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
    "tags": [
      "live",
      "fame"
    ],
    "choices": {
      "left": {
        "label": "Give them the hit again",
        "governingStats": {
          "skill": 1
        },
        "tags": [
          "live",
          "mainstream",
          "safe"
        ],
        "outcomes": {
          "bad": {
            "text": "You replay the one they know and it’s a little flat the second time, but they scream anyway. Diminishing, but returns.",
            "effects": {
              "skill": 3,
              "fame": 4,
              "burnout": 4
            }
          },
          "good": {
            "text": "You bring back the anthem and the whole room sings every word louder than the first time. A perfect exit.",
            "effects": {
              "skill": 5,
              "fame": 7,
              "cred": 3
            }
          },
          "incredible": {
            "text": "The reprise becomes a communal thing, phones up, strangers arm in arm. That’s the clip that follows you home.",
            "effects": {
              "skill": 6,
              "fame": 11,
              "cred": 4
            }
          }
        }
      },
      "right": {
        "label": "Try the brand-new one",
        "governingStats": {
          "creativity": 1,
          "skill": 0.3
        },
        "tags": [
          "live",
          "risky",
          "indie"
        ],
        "outcomes": {
          "bad": {
            "text": "You debut the unfinished new one and it wobbles in the second verse. Brave, honest, and slightly a mess. They forgive you.",
            "effects": {
              "creativity": 3,
              "cred": 3,
              "burnout": 4
            }
          },
          "good": {
            "text": "You premiere the new song raw and the room leans in, witnessing something first. That intimacy is worth more than polish.",
            "effects": {
              "creativity": 6,
              "cred": 5,
              "fame": 4
            }
          },
          "incredible": {
            "text": "The brand-new song, played once, unrecorded, becomes legend — the people there swear it was the best thing you’ve written. They’re right.",
            "effects": {
              "creativity": 8,
              "cred": 6,
              "fame": 6
            }
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
    "requires": {
      "fameMin": 40
    },
    "art": "ev_n2_documentary_pitch",
    "context": "A filmmaker with a treatment and a hunger",
    "prompt": "A documentary filmmaker wants to follow you for a year. “Warts and all,” they say, which always means mostly warts. It could be a beautiful record of this run, or a camera watching you fail in HD.",
    "tags": [
      "social",
      "work"
    ],
    "choices": {
      "left": {
        "label": "Let them film everything",
        "governingStats": {
          "creativity": 1,
          "network": 0.3
        },
        "tags": [
          "social",
          "risky"
        ],
        "outcomes": {
          "bad": {
            "text": "The camera is always there, including for the fight, the breakdown, and the bad show. You’ll see it all again later. Great.",
            "effects": {
              "creativity": 3,
              "fame": 5,
              "burnout": 5
            }
          },
          "good": {
            "text": "You forget the camera and just live, and the footage becomes an honest, moving portrait of a band mid-becoming.",
            "effects": {
              "creativity": 6,
              "fame": 8,
              "cred": 4
            }
          },
          "incredible": {
            "text": "The doc captures the exact year everything changed, and when it airs, it turns your whole story into legend.",
            "effects": {
              "creativity": 7,
              "fame": 14,
              "cred": 5
            }
          }
        }
      },
      "right": {
        "label": "Keep the cameras out",
        "governingStats": {
          "cred": 1
        },
        "tags": [
          "indie",
          "safe"
        ],
        "outcomes": {
          "bad": {
            "text": "You decline and the filmmaker makes a doc about someone else who blows up. You watch it and wonder, once, about the road not filmed.",
            "effects": {
              "cred": 3,
              "burnout": 2
            }
          },
          "good": {
            "text": "You protect the private year and it stays yours, unmediated, unperformed. Some things are better unwatched.",
            "effects": {
              "cred": 6,
              "creativity": 3,
              "burnout": -2
            }
          },
          "incredible": {
            "text": "Your refusal to be documented becomes its own mystique. The lack of footage makes people lean in harder. Absence as art.",
            "effects": {
              "cred": 7,
              "fame": 5,
              "creativity": 3
            }
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
    "requires": {
      "fadedMin": 1
    },
    "art": "ev_n2_reissue_offer",
    "context": "A small label, a nostalgic idea",
    "prompt": "An indie label wants to press {fadedSong} — the one that charted and vanished — onto vinyl as a “deluxe reissue.” It’s a little soon to be nostalgic about yourself, but the offer’s real.",
    "tags": [
      "deal",
      "record"
    ],
    "choices": {
      "left": {
        "label": "Do the reissue",
        "governingStats": {
          "network": 1
        },
        "tags": [
          "deal",
          "record",
          "safe"
        ],
        "outcomes": {
          "bad": {
            "text": "The vinyl looks gorgeous and sells to the forty people who already loved {fadedSong}. A beautiful object, a tiny audience.",
            "effects": {
              "network": 3,
              "money": 60,
              "cred": 3
            }
          },
          "good": {
            "text": "The reissue reintroduces {fadedSong} to people who missed it the first time. A second life, on wax, at your pace.",
            "effects": {
              "network": 5,
              "money": 120,
              "fame": 4,
              "cred": 3
            }
          },
          "incredible": {
            "text": "The deluxe {fadedSong} becomes a collector’s item and quietly outsells the original run tenfold. The song got its due, late but real.",
            "effects": {
              "network": 6,
              "money": 200,
              "fame": 6,
              "cred": 4
            }
          }
        }
      },
      "right": {
        "label": "Look forward instead",
        "governingStats": {
          "creativity": 1
        },
        "tags": [
          "write",
          "indie"
        ],
        "outcomes": {
          "bad": {
            "text": "You decline the reissue to focus on the new, then spend a week comparing everything you write to {fadedSong}. Stuck facing forward.",
            "effects": {
              "creativity": 3,
              "burnout": 3
            }
          },
          "good": {
            "text": "You pass on the past and put the energy into new material, and it’s better for refusing to live in the reissue.",
            "effects": {
              "creativity": 6,
              "cred": 4
            }
          },
          "incredible": {
            "text": "By refusing to be nostalgic, you write something that makes {fadedSong} look like a warm-up. Forward was the right way to look.",
            "effects": {
              "creativity": 8,
              "cred": 5,
              "fame": 4
            }
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
    "requires": {
      "fameMin": 45
    },
    "art": "ev_n2_award_nom",
    "context": "An email with the word “nominee” in it",
    "prompt": "A regional music award nominated you. It’s a small award. It’s also the first time an institution has ever said your name in a sentence with “best.” The ceremony is next month, in a hotel ballroom.",
    "tags": [
      "fame",
      "network"
    ],
    "choices": {
      "left": {
        "label": "Show up and play the game",
        "governingStats": {
          "network": 1
        },
        "tags": [
          "fame",
          "mainstream",
          "safe"
        ],
        "outcomes": {
          "bad": {
            "text": "You go, you don’t win, you make small talk under bad chandeliers for three hours. The rubber chicken was the highlight.",
            "effects": {
              "network": 3,
              "fame": 3,
              "burnout": 3
            }
          },
          "good": {
            "text": "You work the ballroom, lose gracefully, and leave with two real connections and a nice photo. Losing, done well.",
            "effects": {
              "network": 6,
              "fame": 5,
              "cred": 2
            }
          },
          "incredible": {
            "text": "You win the little award and the speech is genuine and short and everyone remembers it. Small trophy, big night.",
            "effects": {
              "network": 7,
              "fame": 9,
              "cred": 4
            }
          }
        }
      },
      "right": {
        "label": "Skip it, stay real",
        "governingStats": {
          "cred": 1
        },
        "tags": [
          "indie",
          "safe"
        ],
        "outcomes": {
          "bad": {
            "text": "You skip the ceremony to play a tiny real show instead, and win the award anyway, in absentia. Awkward. Also kind of iconic.",
            "effects": {
              "cred": 4,
              "fame": 3
            }
          },
          "good": {
            "text": "You play a basement show the same night and the contrast becomes your whole brand: the artist who chose the room over the ballroom.",
            "effects": {
              "cred": 6,
              "fame": 4,
              "network": 2
            }
          },
          "incredible": {
            "text": "Your no-show becomes a legend of integrity, and the basement gig you played instead is talked about for years. You won the night without attending it.",
            "effects": {
              "cred": 8,
              "fame": 6,
              "network": 3
            }
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
    "tags": [
      "write",
      "home"
    ],
    "choices": {
      "left": {
        "label": "Chase it now",
        "minigame": "ideas",
        "governingStats": {
          "creativity": 1
        },
        "tags": [
          "write",
          "risky"
        ],
        "outcomes": {
          "bad": {
            "text": "You stay up until dawn and lose the thread anyway, and tomorrow you’re wrecked with nothing to show. The muse is a liar sometimes.",
            "effects": {
              "creativity": 3,
              "burnout": 6
            }
          },
          "good": {
            "text": "You catch the melody before it evaporates and it’s real, it’s good, it’s yours. Worth the wrecked morning.",
            "effects": {
              "creativity": 6,
              "burnout": 4,
              "writeSong": true
            }
          },
          "incredible": {
            "text": "You stay up and finish the whole thing in one fevered sitting and it’s the best thing you’ve done. Some nights are gifts.",
            "effects": {
              "creativity": 8,
              "cred": 4,
              "burnout": 3,
              "writeSong": true
            }
          }
        }
      },
      "right": {
        "label": "Trust you’ll remember",
        "governingStats": {
          "skill": 1
        },
        "tags": [
          "rest",
          "safe"
        ],
        "outcomes": {
          "bad": {
            "text": "You hum it into your phone and go to sleep, and in the morning the voice memo is thirty seconds of you mumbling. It’s gone.",
            "effects": {
              "skill": 2,
              "burnout": -3
            }
          },
          "good": {
            "text": "You capture just enough on your phone to rebuild it fresh in the morning, rested. The melody survives; so do you.",
            "effects": {
              "skill": 4,
              "creativity": 3,
              "burnout": -2
            }
          },
          "incredible": {
            "text": "You sleep, and the melody is STILL there at breakfast, undeniable, which means it was a real one. You finish it clear-headed and it soars.",
            "effects": {
              "skill": 5,
              "creativity": 5,
              "burnout": -3
            }
          }
        }
      }
    }
  },
  {
    "id": "n2_two_three_bridge",
    "act": [
      2,
      3
    ],
    "pathAffinity": [],
    "weight": 10,
    "art": "ev_n2_two_three_bridge",
    "context": "A crossroads you didn’t plan for",
    "prompt": "The momentum is undeniable now, and with it comes the offers that force the question you’ve been dodging: what are you actually building toward? Everyone wants to know. Increasingly, so do you.",
    "tags": [
      "deal",
      "network"
    ],
    "choices": {
      "left": {
        "label": "Commit to the vision",
        "governingStats": {
          "creativity": 1,
          "network": 0.3
        },
        "tags": [
          "deal",
          "risky"
        ],
        "outcomes": {
          "bad": {
            "text": "You declare a direction and immediately doubt it. Committing to a vision means grieving the other visions. It stings.",
            "effects": {
              "creativity": 3,
              "cred": 3,
              "burnout": 4
            }
          },
          "good": {
            "text": "You pick a lane and the clarity is a relief. Suddenly every decision is easier because you know what you’re for.",
            "effects": {
              "creativity": 6,
              "cred": 4,
              "network": 3
            }
          },
          "incredible": {
            "text": "You commit fully and the universe seems to reward the certainty — the right people, the right rooms, all at once.",
            "effects": {
              "creativity": 7,
              "cred": 5,
              "network": 5,
              "fame": 3
            }
          }
        }
      },
      "right": {
        "label": "Keep your options open",
        "governingStats": {
          "network": 1
        },
        "tags": [
          "network",
          "safe"
        ],
        "outcomes": {
          "bad": {
            "text": "You hedge and stay flexible and end up drifting, a little, between three half-committed futures. Optionality has a cost.",
            "effects": {
              "network": 3,
              "burnout": 3
            }
          },
          "good": {
            "text": "You stay nimble and it pays — you catch an opportunity a more committed artist would’ve missed. Flexibility, rewarded.",
            "effects": {
              "network": 6,
              "fame": 4,
              "money": 80
            }
          },
          "incredible": {
            "text": "Your refusal to be pinned down becomes a strength; you move between worlds freely and each one thinks you’re theirs. Freedom, mastered.",
            "effects": {
              "network": 8,
              "fame": 6,
              "cred": 3
            }
          }
        }
      }
    }
  },
  {
    "id": "nfp_eclipse",
    "act": [
      1,
      2,
      3
    ],
    "pathAffinity": [],
    "weight": 10,
    "flashpoint": true,
    "art": "ev_nfp_eclipse",
    "context": "The Eclipse Festival. Totality at 2:14 p.m. Your set: 1:45.",
    "prompt": "The festival scheduled you against the moon. At 2:14 the sky goes out for three minutes and forty-one seconds, and every astronomer on site agrees: nobody will be looking at you. The stage manager shrugs. “Play through it or plan around it. The moon doesn’t do soundcheck.”",
    "tags": [
      "live",
      "risky"
    ],
    "choices": {
      "left": {
        "label": "Build the set around the dark",
        "governingStats": {
          "creativity": 1,
          "skill": 0.4
        },
        "tags": [
          "live",
          "risky",
          "indie"
        ],
        "outcomes": {
          "bad": {
            "text": "Clouds. Wall-to-wall, industrial-grade clouds. Totality arrives as a mild dimming, like a fridge bulb dying, and your carefully architected crescendo lands on a field of people staring at where a miracle should be. Someone claps for the clouds.",
            "effects": {
              "creativity": 3,
              "burnout": 8,
              "fame": 2
            }
          },
          "good": {
            "text": "The sky cooperates. You hit the quiet part as the light drains, and for three minutes a whole field breathes in 6/8. When the sun comes back the crowd looks at you like you scheduled it. You do not correct them.",
            "effects": {
              "creativity": 8,
              "fame": 9,
              "cred": 6,
              "money": 120
            }
          },
          "incredible": {
            "text": "The last chord of the new one rings out at the exact second the diamond ring flares — a coincidence so perfect that four different videos of it sync to the frame. Astronomers share it. ASTRONOMERS. The song now legally belongs to the sky, and everyone wants it.",
            "effects": {
              "creativity": 12,
              "fame": 20,
              "cred": 8,
              "money": 250,
              "writeSong": true
            }
          }
        }
      },
      "right": {
        "label": "Stop playing. Watch it with them.",
        "governingStats": {
          "cred": 1
        },
        "tags": [
          "live",
          "safe",
          "rest"
        ],
        "outcomes": {
          "bad": {
            "text": "You call the pause a beat too early and stand in gathering gloom for four silent minutes holding your instrument like an umbrella. The crowd is moved by the sky and mildly confused by you. A vendor sells out of moon pies.",
            "effects": {
              "cred": 2,
              "burnout": 5,
              "creativity": 2
            }
          },
          "good": {
            "text": "You put the instrument down and lie back on the stage with everyone else. Ten thousand people and you, all briefly the same size. Afterward the set hits different — you and the crowd just went through something.",
            "effects": {
              "cred": 7,
              "creativity": 6,
              "burnout": -5,
              "fame": 5
            }
          },
          "incredible": {
            "text": "In the dark, unplanned, the whole field starts humming your opener — softly, together, to the eclipse. You didn’t play a note. The moment gets written up as “the set that knew when to stop,” which is the best review a set can get.",
            "effects": {
              "cred": 12,
              "fame": 14,
              "creativity": 8,
              "burnout": -6,
              "money": 150
            }
          }
        }
      }
    }
  },
  {
    "id": "nfp_gorefeast",
    "act": [
      2,
      3
    ],
    "pathAffinity": [],
    "weight": 10,
    "flashpoint": true,
    "art": "ev_nfp_gorefeast",
    "context": "BLOODMOOT FESTIVAL. The poster says GOREFEAST. You are not Gorefeast.",
    "prompt": "The booking email said “Gorefest, right?” and you said yes, because a festival is a festival. It is now clear that the metal festival expected Gorefeast — nine albums, corpse paint, a song called “Marrow Silo” — and got you. The tent holds two thousand people warming up a pit. Your entire catalog is in a major key.",
    "tags": [
      "live",
      "risky"
    ],
    "choices": {
      "left": {
        "label": "BECOME Gorefeast for forty minutes",
        "governingStats": {
          "skill": 1,
          "creativity": 0.5
        },
        "tags": [
          "live",
          "risky",
          "band"
        ],
        "minigame": "crowd",
        "outcomes": {
          "bad": {
            "text": "Your ballad, detuned and screamed, is identified as an impostor by song two. The pit stops moshing to WATCH you, which is worse. You are escorted off with what the security guard calls “respect for the attempt.” The attempt trends locally.",
            "effects": {
              "skill": 3,
              "burnout": 10,
              "fame": 4,
              "cred": -4
            }
          },
          "good": {
            "text": "Triple the distortion, halve the tempo, scream every lyric like it owes you money — and it WORKS. The pit opens for your saddest song. A man in corpse paint weeps openly, which in here counts as five stars.",
            "effects": {
              "skill": 7,
              "fame": 10,
              "cred": 6,
              "money": 180
            }
          },
          "incredible": {
            "text": "The crowd figures it out mid-set — and decides they don’t care. Two thousand metalheads perform, by consensus, the gentlest wall of death ever recorded, in waltz time, to your love song. Actual Gorefeast posts the video with the caption “we’ve been outfeasted.” New fans. Terrifying, devoted new fans.",
            "effects": {
              "skill": 10,
              "fame": 18,
              "cred": 12,
              "money": 300,
              "network": 5
            }
          }
        }
      },
      "right": {
        "label": "Come clean to the pit",
        "governingStats": {
          "cred": 1
        },
        "tags": [
          "live",
          "safe",
          "social"
        ],
        "outcomes": {
          "bad": {
            "text": "“I am not Gorefeast” gets the biggest cheer of your night, downhill from there. You play three songs to a politely dispersing tent and get paid in festival vouchers. The vouchers do not cover the drive.",
            "effects": {
              "cred": 3,
              "money": -60,
              "burnout": 8
            }
          },
          "good": {
            "text": "You open with the truth and a compromise: “I’ll play mine, you scream along wherever feels right.” They take the deal seriously. Your bridge now has a canonical growl arrangement, and the promoter pays full fee out of embarrassment.",
            "effects": {
              "cred": 8,
              "fame": 6,
              "money": 200,
              "network": 4
            }
          },
          "incredible": {
            "text": "Halfway through your honest little set, Gorefeast themselves arrive — wrong festival, same booker — and instead of taking the stage they join yours. “Marrow Silo (Unplugged)” featuring you is bootlegged forty ways before midnight. The booker faints. Both bands agree never to correct the lineup poster.",
            "effects": {
              "cred": 12,
              "fame": 16,
              "network": 10,
              "money": 250
            }
          }
        }
      }
    }
  },
  {
    "id": "nfp_anthem",
    "act": [
      2,
      3
    ],
    "pathAffinity": [],
    "weight": 10,
    "flashpoint": true,
    "art": "ev_nfp_anthem",
    "context": "The stadium tunnel. A man in a team polo with a stopwatch.",
    "prompt": "The local team wants a seventh-inning song. “Forty seconds. Team name early and often. Thirty thousand people will sing it drunk for the next fifty years or never again — no middle.” The current anthem is an organ riff from 1974 and its composer’s grandchildren still get checks.",
    "tags": [
      "write",
      "deal"
    ],
    "choices": {
      "left": {
        "label": "Write the shameless chant",
        "governingStats": {
          "creativity": 1,
          "network": 0.3
        },
        "tags": [
          "write",
          "mainstream",
          "safe"
        ],
        "minigame": "ideas",
        "outcomes": {
          "bad": {
            "text": "Your chant tests badly with the focus group, which is nine season-ticket holders and a parrot the owner trusts. The parrot is indifferent. They keep the organ riff. You keep the kill fee and a new respect for the parrot.",
            "effects": {
              "creativity": 2,
              "money": 80,
              "burnout": 6
            }
          },
          "good": {
            "text": "Three chords, the team name eleven times, a keychange for the fireworks. The stadium learns it in one inning. You have written something objectively dumb and undeniably immortal, and the check clears in both categories.",
            "effects": {
              "creativity": 6,
              "money": 350,
              "fame": 10
            }
          },
          "incredible": {
            "text": "It DETONATES. By August the chant has escaped the stadium — weddings, graduations, one (1) senate campaign you did not authorize. Thirty thousand strangers scream your dumbest, truest forty seconds every home game, forever. The organ riff’s grandchildren send a wreath.",
            "effects": {
              "creativity": 8,
              "money": 500,
              "fame": 20,
              "chartTitle": "Top of the Seventh"
            }
          }
        }
      },
      "right": {
        "label": "Sneak in a real song",
        "governingStats": {
          "creativity": 1,
          "cred": 0.4
        },
        "tags": [
          "write",
          "indie",
          "risky"
        ],
        "outcomes": {
          "bad": {
            "text": "Your subtle, aching meditation on hope disguised as a sports chant confuses forty thousand people at once — a personal record. The team quietly reverts to the organ. A local critic calls it “the bravest flop in franchise history,” which goes on the shelf next to no money.",
            "effects": {
              "creativity": 3,
              "cred": 4,
              "burnout": 8,
              "money": -40
            }
          },
          "good": {
            "text": "You smuggle an actual melody past the polo man, and it holds. The crowd sings the hook without being told to. Sports radio calls it “weirdly moving.” Your name is now said in bars that have never once played your genre.",
            "effects": {
              "creativity": 7,
              "fame": 12,
              "cred": 6,
              "money": 250
            }
          },
          "incredible": {
            "text": "The team goes on a run, and superstition does the rest: your song is now LUCKY, which outranks good. The stadium sings the sad verse — the one you were sure they’d cut — in full voice, seventh inning, October. You wrote a real song and hid it inside a chant, and the whole city found it.",
            "effects": {
              "creativity": 12,
              "fame": 16,
              "cred": 10,
              "money": 400
            }
          }
        }
      }
    }
  },
  {
    "id": "nfp_wax",
    "act": [
      2,
      3
    ],
    "pathAffinity": [],
    "weight": 10,
    "flashpoint": true,
    "art": "ev_nfp_wax",
    "context": "The Hall of Notable Figures (regional). A velvet rope. A shape.",
    "prompt": "The wax museum made a you. The unveiling is tonight and you’re contractually “encouraged” to attend. You have seen a preview photo. It is… close. The eyes are yours. The smile belongs to a realtor. It is holding your instrument almost correctly, the way a crab might.",
    "tags": [
      "fame",
      "social"
    ],
    "choices": {
      "left": {
        "label": "Embrace the wax you",
        "governingStats": {
          "network": 1,
          "creativity": 0.3
        },
        "tags": [
          "social",
          "mainstream",
          "safe"
        ],
        "outcomes": {
          "bad": {
            "text": "You pose beside it gamely, and every photo from the night has the same problem: the wax one looks more relaxed. A local paper runs the picture with the caption swapped. Nobody catches it for nine days. You get free museum admission for life, for whatever that’s worth.",
            "effects": {
              "fame": 4,
              "cred": -3,
              "burnout": 6,
              "network": 2
            }
          },
          "good": {
            "text": "You lean in — matching outfit, matching realtor smile, dead still on the plinth until a tourist screams. The clip does numbers. The museum reports record attendance and sends you a fruit basket addressed to “both of you.”",
            "effects": {
              "fame": 12,
              "network": 5,
              "money": 150,
              "creativity": 4
            }
          },
          "incredible": {
            "text": "You perform an entire acoustic set standing next to yourself, trading verses with the statue via hidden speaker, and the internet loses its mind deciding which one is real. “WAX SET” becomes shorthand for committing to the bit. The museum offers a residency. The statue, they inform you gravely, has fans now.",
            "effects": {
              "fame": 20,
              "creativity": 10,
              "money": 300,
              "network": 8
            }
          }
        }
      },
      "right": {
        "label": "Demand corrections",
        "governingStats": {
          "cred": 1
        },
        "tags": [
          "social",
          "risky",
          "indie"
        ],
        "outcomes": {
          "bad": {
            "text": "Your notes — eleven items, two about the hands — leak. The story becomes “musician feuds with own statue,” and the statue, having no publicist, wins. The realtor smile follows you into your dreams, where it apologizes to clients you can’t see.",
            "effects": {
              "fame": 5,
              "cred": -6,
              "burnout": 10
            }
          },
          "good": {
            "text": "You sit with the sculptor for an afternoon and talk about your face like it’s a mix — brighter here, less compression there. The corrected version is startling. People stand in front of it quietly, the way you always hoped they’d stand in front of the records.",
            "effects": {
              "cred": 9,
              "creativity": 6,
              "fame": 8,
              "burnout": -4
            }
          },
          "incredible": {
            "text": "The sculptor, it turns out, is a genius who’d been rushed. Given time, she produces something the local art critics call “the truest portrait in the building, including the paintings.” The unveiling of the REDONE you outdraws the original event, and the story — artist demands honesty, gets it — becomes part of your legend.",
            "effects": {
              "cred": 14,
              "fame": 15,
              "creativity": 8,
              "network": 6,
              "money": 100
            }
          }
        }
      }
    }
  },
  {
    "id": "nfp_broadcast",
    "act": [
      2,
      3
    ],
    "pathAffinity": [],
    "weight": 10,
    "flashpoint": true,
    "art": "ev_nfp_broadcast",
    "context": "Live radio session, take four. Then: the tone.",
    "prompt": "Mid-take, every speaker in the station erupts: THIS IS A TEST OF THE EMERGENCY BROADCAST SYSTEM. The tone holds a perfect concert A under your whole second verse, then stops. The engineer goes pale: takes one through three are gone — a tape machine older than everyone present ate them. The only surviving take is the one with the government singing harmony.",
    "tags": [
      "studio",
      "record"
    ],
    "choices": {
      "left": {
        "label": "Release the tone take",
        "governingStats": {
          "creativity": 1,
          "cred": 0.4
        },
        "tags": [
          "record",
          "risky",
          "indie"
        ],
        "outcomes": {
          "bad": {
            "text": "Listeners keep reporting the song to the platform as an actual emergency. It gets pulled twice, reinstated once, and permanently flagged “may cause alarm,” which is the most accurate genre tag you’ve ever received. The engineer frames the incident report.",
            "effects": {
              "creativity": 4,
              "fame": 3,
              "burnout": 8,
              "money": -50
            }
          },
          "good": {
            "text": "The tone sits under the verse like it was scored. Reviewers assume it’s a synth and praise your “institutional dread.” You never correct them. The take becomes the version — nobody who hears it wants the clean one.",
            "effects": {
              "creativity": 9,
              "cred": 8,
              "fame": 8,
              "money": 150
            }
          },
          "incredible": {
            "text": "An archivist identifies the exact tone generator — decommissioned, one of a kind, apparently beloved — and the story eats the internet: THE LAST BROADCAST OF UNIT 7 IS ON THIS SONG. The agency itself replies “we do not endorse this banger,” which endorses the banger. The take charts on pure myth.",
            "effects": {
              "creativity": 12,
              "fame": 18,
              "cred": 10,
              "money": 400
            }
          }
        }
      },
      "right": {
        "label": "Re-record it clean",
        "governingStats": {
          "skill": 1
        },
        "tags": [
          "studio",
          "safe",
          "practice"
        ],
        "outcomes": {
          "bad": {
            "text": "Takes five through nineteen are technically fine and spiritually vacant. Everyone in the booth knows the tone take was better and everyone in the booth is too tired to say it. You go home with a clean, correct recording of a song that used to be alive.",
            "effects": {
              "skill": 3,
              "burnout": 9,
              "creativity": 2
            }
          },
          "good": {
            "text": "You chase the ghost of take four for two hours and then stop chasing and just play. Take twenty-two is its own animal — leaner, angrier, no help from the government. The engineer keeps the tone take “for the archive,” with a look that says the archive is his car.",
            "effects": {
              "skill": 7,
              "creativity": 6,
              "cred": 5,
              "money": 100
            }
          },
          "incredible": {
            "text": "Take twenty-three is the one — and the station, charmed by the whole saga, airs both versions back to back as “A Song, Interrupted.” The segment syndicates nationally. You become the artist who beat their own act of god, and the clean take carries the story everywhere it goes.",
            "effects": {
              "skill": 10,
              "creativity": 8,
              "fame": 14,
              "cred": 8,
              "money": 250
            }
          }
        }
      }
    }
  },
  {
    "id": "nfp_yacht",
    "act": [
      2,
      3
    ],
    "pathAffinity": [],
    "weight": 10,
    "flashpoint": true,
    "art": "ev_nfp_yacht",
    "context": "A wedding planner with a briefcase and a nondisclosure agreement",
    "prompt": "A billionaire’s child is getting married on a yacht in water too expensive to name. The fee has a comma where you’ve never had a comma. The terms: phones confiscated, no photos, no setlist approval, and your name appears nowhere, ever — legally, you were never aboard. “Think of it,” the planner says, “as the best show nobody will believe you played.”",
    "tags": [
      "deal",
      "live"
    ],
    "choices": {
      "left": {
        "label": "Sign it. Vanish for a night.",
        "governingStats": {
          "network": 1,
          "skill": 0.4
        },
        "tags": [
          "deal",
          "safe",
          "live"
        ],
        "outcomes": {
          "bad": {
            "text": "The groom’s college band “sits in” for most of your set. You spend four hours as a very well-paid human music stand while a man named Tripp fights the key of G. The check clears. The memory also clears, mostly, eventually.",
            "effects": {
              "money": 300,
              "burnout": 10,
              "cred": -5,
              "skill": 2
            }
          },
          "good": {
            "text": "You play the strangest, freest set of your life to people so rich they’ve forgotten how to be impressed — and then, around midnight, they remember. A woman who owns an island requests a deep cut. Nobody will ever know how good you were tonight, except you, which turns out to be worth something.",
            "effects": {
              "money": 450,
              "network": 6,
              "skill": 6,
              "burnout": 4
            }
          },
          "incredible": {
            "text": "At 2 a.m. the bride’s grandfather — a name from the spines of half your record collection, presumed retired, presumed mythical — borrows a guitar and plays with you until sunrise. No phones. No proof. Just you, a legend, and the Atlantic. He leaves you his number on a cocktail napkin you will laminate.",
            "effects": {
              "money": 500,
              "network": 12,
              "skill": 10,
              "creativity": 8,
              "cred": 6
            }
          }
        }
      },
      "right": {
        "label": "Counter: half the fee, keep the story",
        "governingStats": {
          "cred": 1
        },
        "tags": [
          "deal",
          "risky",
          "social"
        ],
        "outcomes": {
          "bad": {
            "text": "The planner closes the briefcase with the sound of a door sealing on a vault. They hire someone else — someone, you later learn through gritted teeth, whose career the wedding quietly made. You kept your principles and a normal weekend. Principles do not pay for strings.",
            "effects": {
              "cred": 3,
              "burnout": 8,
              "money": -80
            }
          },
          "good": {
            "text": "To your shock, they take the deal — apparently nobody has ever countered before, and the billionaire finds it “refreshing.” Half the fee is still the best check of your year, and the story — the yacht, the napkins, the dolphin incident — becomes your best interview answer for a decade.",
            "effects": {
              "money": 250,
              "fame": 10,
              "cred": 8,
              "network": 5
            }
          },
          "incredible": {
            "text": "The counter charms the family so thoroughly they tear up the NDA at the reception. Photos surface of you mid-song on a boat that costs more than a stadium, and the caption war alone triples your following. The billionaire’s office calls in spring: they fund things. Would you like to be a thing.",
            "effects": {
              "money": 350,
              "fame": 20,
              "cred": 10,
              "network": 10
            }
          }
        }
      }
    }
  },
  {
    "id": "nfp_sinkhole",
    "act": [
      2,
      3
    ],
    "pathAffinity": [],
    "weight": 10,
    "flashpoint": true,
    "art": "ev_nfp_sinkhole",
    "context": "Load-in, 4 p.m. The street in front of the venue: gone.",
    "prompt": "A sinkhole opens in front of the venue with a sound like the earth clearing its throat. Thirty feet across, geologically smug, and — per the fire marshal — “stable-ish.” The show is in five hours. The promoter, a visionary under pressure, has already changed the marquee: TONIGHT — THE SINKHOLE SHOW.",
    "tags": [
      "live",
      "risky"
    ],
    "choices": {
      "left": {
        "label": "Play the rim of the void",
        "governingStats": {
          "creativity": 1,
          "network": 0.4
        },
        "tags": [
          "live",
          "risky",
          "fame"
        ],
        "outcomes": {
          "bad": {
            "text": "The hole widens a foot mid-set, calmly, like it’s stretching. Evacuation is orderly; the PA’s descent is not. National news runs eight seconds of your bridge under the chyron LOCAL HOLE GROWS. Technically your biggest broadcast.",
            "effects": {
              "money": -200,
              "fame": 6,
              "burnout": 10,
              "cred": 3
            }
          },
          "good": {
            "text": "You play facing the hole, crowd curved around it like an amphitheater the city built by accident. Every kick drum hit comes back up out of the earth a half-second late — the sinkhole is, acoustically, the best member of the band. The fire marshal nods along, which is the review that matters.",
            "effects": {
              "fame": 12,
              "cred": 8,
              "creativity": 8,
              "money": 200
            }
          },
          "incredible": {
            "text": "THE SINKHOLE SHOW enters legend before the encore ends. Drone footage of a crowd ringed around a glowing municipal void, singing your chorus into it, becomes the image of the year. The city — the actual city — licenses the photo for tourism. Geologists cite the attendance. You will never play a normal room again without someone yelling “play the hole.”",
            "effects": {
              "fame": 20,
              "cred": 12,
              "creativity": 10,
              "money": 450,
              "network": 6
            }
          }
        }
      },
      "right": {
        "label": "Cancel. Help with the barricades.",
        "governingStats": {
          "cred": 1
        },
        "tags": [
          "safe",
          "social",
          "work"
        ],
        "outcomes": {
          "bad": {
            "text": "You spend the night hauling sawhorses while the promoter, undeterred, books a jam band to play the hole. They’re terrible. The hole deserved better. You are on precisely zero of the news footage and all of the invoice for the deposit.",
            "effects": {
              "money": -100,
              "cred": 4,
              "burnout": 8
            }
          },
          "good": {
            "text": "You barricade, you direct traffic, you bring coffee to the surveyors. At midnight the venue owner unlocks the room and you play an unannounced set for the whole cleanup crew — hi-vis vests swaying in the dark. Word gets around. Word always gets around.",
            "effects": {
              "cred": 10,
              "network": 6,
              "fame": 6,
              "burnout": -4
            }
          },
          "incredible": {
            "text": "The city engineer you spent all night handing wrenches to turns out to run the summer concert series. “You’re the only act I’ve met who shows up for the boring part.” She books you for the plaza reopening — headline slot, city budget, and a plaque near the filled hole that does not mention the jam band.",
            "effects": {
              "cred": 14,
              "network": 10,
              "fame": 12,
              "money": 350,
              "burnout": -4
            }
          }
        }
      }
    }
  },
  {
    "id": "nfp_parade",
    "act": [
      2,
      3
    ],
    "pathAffinity": [],
    "weight": 10,
    "flashpoint": true,
    "art": "ev_nfp_parade",
    "context": "A float shaped like a giant vinyl record. A live mic. Main Street.",
    "prompt": "Your hometown made you grand marshal. The float is moving at four miles an hour past every person who ever knew you — your dentist, your algebra teacher, the guy who fired you from the movie theater, three exes spaced with cruel evenness along the route. The mic is live. The whole town is listening. The float cannot be stopped.",
    "tags": [
      "live",
      "family"
    ],
    "choices": {
      "left": {
        "label": "Play the song about this town",
        "governingStats": {
          "creativity": 1,
          "cred": 0.4
        },
        "tags": [
          "live",
          "risky",
          "roots"
        ],
        "outcomes": {
          "bad": {
            "text": "The town recognizes itself in verse two — specifically, the unflattering part about the water tower — and the applause develops a temperature. Your algebra teacher mouths “disappointing” with the exact face from the quadratics unit. The movie theater guy alone loves it.",
            "effects": {
              "creativity": 4,
              "cred": 3,
              "fame": 4,
              "burnout": 10
            }
          },
          "good": {
            "text": "You play it straight through, four miles an hour, and watch the song land block by block — the diner crowd, the church crowd, your old paper route. By the hardware store, people are singing the chorus back at a moving float. The dentist weeps. You needed the dentist to weep.",
            "effects": {
              "creativity": 8,
              "cred": 10,
              "fame": 10,
              "burnout": -4
            }
          },
          "incredible": {
            "text": "At the final turn your first music teacher is waiting on the courthouse steps with the middle school band, who have secretly learned the horn part. The whole square sings the bridge. The town renames the practice rooms after you — the actual rooms where you were told to keep it down. Nobody keeps it down.",
            "effects": {
              "creativity": 12,
              "cred": 14,
              "fame": 18,
              "network": 6,
              "burnout": -6
            }
          }
        }
      },
      "right": {
        "label": "Keep it light. Wave. Play the hits.",
        "governingStats": {
          "skill": 1
        },
        "tags": [
          "live",
          "safe",
          "mainstream"
        ],
        "outcomes": {
          "bad": {
            "text": "Between songs, the live mic catches your private aside about the mayor’s “parade voice.” The mayor has a microphone too, and a sense of humor, and now you are in a roast battle at four miles an hour with an elected official who is winning. The town takes his side. It’s his parade voice.",
            "effects": {
              "skill": 2,
              "fame": 5,
              "cred": -4,
              "burnout": 8
            }
          },
          "good": {
            "text": "You give them the hits, the wave, the pointing-at-people-you-recognize bit — flawless hometown-kid execution. Three exes nod with varying complexity. The local paper runs THE KID’S ALRIGHT above a photo where you look genuinely happy, because you were.",
            "effects": {
              "skill": 6,
              "fame": 10,
              "cred": 5,
              "money": 100,
              "burnout": -4
            }
          },
          "incredible": {
            "text": "Halfway down Main the crowd stops waiting for songs and starts requesting them — deep cuts, B-sides, the one you wrote at sixteen that eleven people should know. The whole town has been listening this entire time. You play requests off a parade float for an hour past the route’s end. The float driver, on his own authority, does a second lap.",
            "effects": {
              "skill": 8,
              "fame": 16,
              "cred": 10,
              "money": 200,
              "burnout": -6
            }
          }
        }
      }
    }
  },
  {
    "id": "nfp_terminal",
    "act": [
      1,
      2,
      3
    ],
    "pathAffinity": [],
    "weight": 10,
    "flashpoint": true,
    "art": "ev_nfp_terminal",
    "context": "Gate B12. Delay: 9 hours. New estimate: also 9 hours.",
    "prompt": "The board says DELAYED in a font that has given up. Nine hours, gate B12, and fate has stacked the room: you with your instrument, and — sprawled across four gates like a shipwreck — an entire touring orchestra, sixty strong, missing the same connection. Their concertmaster catches you looking at your case. She raises an eyebrow that contains a whole contract.",
    "tags": [
      "live",
      "social"
    ],
    "choices": {
      "left": {
        "label": "Raise the orchestra",
        "governingStats": {
          "network": 1,
          "creativity": 0.5
        },
        "tags": [
          "live",
          "risky",
          "band"
        ],
        "outcomes": {
          "bad": {
            "text": "Sixty musicians, zero sheet music, one gate agent losing a fight with a headset. The arrangement collapses at the key change into what a bystander’s video titles “airport noise (why).” Security is polite. The cellos, packing up, say “good instincts” in the tone people use for dogs.",
            "effects": {
              "network": 3,
              "burnout": 9,
              "fame": 3,
              "creativity": 2
            }
          },
          "good": {
            "text": "The concertmaster sketches parts on napkins and boarding passes, and by hour three, gate B12 has strings. Your song, orchestrated by the stranded, rolls down the terminal like weather. Delayed passengers drift over from gates away, following the sound to something worth missing a flight for.",
            "effects": {
              "network": 8,
              "creativity": 8,
              "fame": 10,
              "cred": 6
            }
          },
          "incredible": {
            "text": "Hour five: full arrangement. Hour six: the airline surrenders and pages it as an event. Someone films the whole thing from the moving walkway in one unbroken shot — you and sixty stranded strangers turning a delay into the best venue in the city — and it becomes THE video, the one strangers will describe to you at shows for years. The orchestra’s label calls before you land.",
            "effects": {
              "network": 12,
              "creativity": 10,
              "fame": 20,
              "cred": 8,
              "money": 300
            }
          }
        }
      },
      "right": {
        "label": "Play small for gate B12",
        "governingStats": {
          "skill": 1,
          "cred": 0.3
        },
        "tags": [
          "live",
          "safe",
          "solo"
        ],
        "outcomes": {
          "bad": {
            "text": "You get four songs deep before a man on a conference call asks you, without muting, to “take the concert somewhere else, some of us are working.” The gate takes his side, sleepily. You play one more out of principle, quieter, which defeats the principle.",
            "effects": {
              "skill": 2,
              "cred": 2,
              "burnout": 6
            }
          },
          "good": {
            "text": "You play soft and low for your corner of the wreckage — the toddler finally sleeps, the crying woman by the window stops crying, the gate agent mouths thank you. The orchestra listens with their eyes closed, professionally. It’s the smallest room you’ve played in years and one of the best.",
            "effects": {
              "skill": 6,
              "cred": 8,
              "burnout": -6,
              "network": 4
            }
          },
          "incredible": {
            "text": "One by one, without a word, the orchestra unpacks — a viola joins the third song, then a clarinet, then quietly everyone, sixty players folding themselves around your smallest tunes at whisper volume. Nobody films it. Everyone at gate B12 agrees, forever, that you had to be there. The concertmaster hands you her card: “We land somewhere eventually. So should you.”",
            "effects": {
              "skill": 10,
              "cred": 12,
              "creativity": 8,
              "network": 10,
              "burnout": -6
            }
          }
        }
      }
    }
  },
  {
    "id": "nfp_lookalike",
    "act": [
      2,
      3
    ],
    "pathAffinity": [],
    "weight": 10,
    "flashpoint": true,
    "art": "ev_nfp_lookalike",
    "context": "The bar’s chalkboard: your name, listed twice, 9 and 11",
    "prompt": "For two towns and eight months, someone has been gigging AS you — your name, your setlist, your stage banter down to the pause. Tonight, through a booking accident with the shape of destiny, you are both on the bill at the same bar. They’re at the counter. They have your haircut. They are, you notice with genuine outrage, tuning your way.",
    "tags": [
      "live",
      "rival"
    ],
    "choices": {
      "left": {
        "label": "Duel them onstage",
        "governingStats": {
          "skill": 1,
          "creativity": 0.3
        },
        "tags": [
          "live",
          "risky",
          "fame"
        ],
        "outcomes": {
          "bad": {
            "text": "The crowd cannot tell you apart, and — a knife you did not see coming — splits down the middle on WHO DID THE SONGS BETTER. You win the duel on points and lose the night to a bar-wide argument about which one was the real one. The impostor slips out during your encore. Your encore. Theirs. Yours.",
            "effects": {
              "skill": 3,
              "fame": 5,
              "burnout": 10,
              "cred": -3
            }
          },
          "good": {
            "text": "You trade songs like punches — yours, then theirs-which-are-yours — and the room figures it out in real time, which is the best theater the bar has ever hosted. You take the crown on the deep cut they never learned. They take a bow, own it, and buy the whole room a round of apology.",
            "effects": {
              "skill": 8,
              "fame": 12,
              "cred": 8,
              "money": 150
            }
          },
          "incredible": {
            "text": "THE DOUBLE SHOW becomes instant local scripture: two identical acts, one truth, a bar full of jurors. For the finale you play in unison — the impostor knows your catalog note-perfect, better than your band ever has — and the crowd, weeping, votes with its feet by carrying you BOTH out. The story goes national. Ticket sales do not distinguish between myth and fraud, and right now you are both.",
            "effects": {
              "skill": 10,
              "fame": 20,
              "cred": 10,
              "money": 350,
              "network": 6
            }
          }
        }
      },
      "right": {
        "label": "Hire them",
        "governingStats": {
          "network": 1
        },
        "tags": [
          "deal",
          "risky",
          "social"
        ],
        "outcomes": {
          "bad": {
            "text": "Your new “official double” takes the arrangement seriously for exactly one month, then books a festival as you, headlines it as you, and does the press as you — glowing press, which is the insult inside the injury. The lawyer you consult opens with “so this is a new one.”",
            "effects": {
              "network": 2,
              "money": -150,
              "burnout": 10,
              "fame": 4
            }
          },
          "good": {
            "text": "You put them on payroll: the far towns, the doubles, the gigs that were killing you. They’re disciplined, grateful, and unsettlingly good at being you — better rested, mostly. Your coverage doubles. Occasionally a review of a show you never played says you seemed “renewed.” You were. You were at home.",
            "effects": {
              "network": 8,
              "money": 250,
              "fame": 8,
              "burnout": -6
            }
          },
          "incredible": {
            "text": "It becomes the arrangement of legend: you send the double to everything you hate — early flights, brand brunches, a ribbon-cutting — while you write. Then, when the internet finally cracks the case, the reveal is so beloved it becomes bigger than either career: THE ARTIST AND THE UNDERSTUDY, joint interview, joint tour, two yous per night, tickets instantly gone. Your double negotiates their own rider. You raise their pay. They earned it. You’re pretty sure you did.",
            "effects": {
              "network": 12,
              "fame": 18,
              "money": 400,
              "creativity": 8,
              "cred": 6
            }
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
    "tags": [
      "write",
      "deal"
    ],
    "choices": {
      "left": {
        "label": "Write them from scratch",
        "governingStats": {
          "creativity": 1
        },
        "tags": [
          "write",
          "safe",
          "home"
        ],
        "outcomes": {
          "bad": {
            "text": "Draft three finally passes veto, minus the good line — “too sad,” he says, correctly identifying the only true thing in it. You play it at the reception and it works fine, which is the worst thing music can do. The $150 arrives with a thank-you card that also works fine.",
            "effects": {
              "creativity": 2,
              "money": 100,
              "burnout": 5
            }
          },
          "good": {
            "text": "You steal the melody from the rhythm of the voicemail — the way he says her name twice — and don’t tell them. At the reception she stops mid-dance: “Why does this feel familiar?” Exactly. The whole tent asks who wrote it.",
            "effects": {
              "creativity": 6,
              "money": 150,
              "network": 3,
              "fame": 2
            }
          },
          "incredible": {
            "text": "The song outgrows the wedding: guests demand recordings, a bridesmaid posts the dance, and by Monday four more couples want commissions at double the rate. You have accidentally founded a cottage industry with a waiting list. The couple’s dog is named after your working title.",
            "effects": {
              "creativity": 8,
              "money": 220,
              "network": 5,
              "fame": 4
            }
          }
        }
      },
      "right": {
        "label": "Retool one you already have",
        "governingStats": {
          "skill": 1,
          "network": 0.3
        },
        "tags": [
          "write",
          "risky",
          "work"
        ],
        "outcomes": {
          "bad": {
            "text": "Mid-first-dance, a groomsman who follows your stuff mouths along with every word of “their” song. The bride notices. The look she gives you over the groom’s shoulder will appear in your dreams during load-ins for a year. Partial payment, full lesson.",
            "effects": {
              "skill": 2,
              "money": 60,
              "burnout": 6,
              "cred": -2
            }
          },
          "good": {
            "text": "New bridge, their names in verse two, key up a step for hope — twenty minutes of surgery and the old song fits them like tailoring. Nobody knows. The song didn’t either; it thinks it was always about them now. Full fee, and you’re home by ten.",
            "effects": {
              "skill": 5,
              "money": 150,
              "creativity": 3
            }
          },
          "incredible": {
            "text": "The retooled version is BETTER — the wedding edit fixes the chorus you’d fought for years. You quietly re-record it your way, and both versions thrive: theirs in a tent, yours in your set, nobody the wiser but the song. The couple tips $60 for “capturing them so fast.” So fast. So very fast.",
            "effects": {
              "skill": 7,
              "creativity": 6,
              "money": 210,
              "cred": 3
            }
          }
        }
      }
    }
  },
  {
    "id": "nw_uncle_bill",
    "act": [
      1,
      2
    ],
    "pathAffinity": [],
    "weight": 9,
    "pack": "pack_wedding",
    "art": "ev_nw_uncle_bill",
    "context": "An uncle. A hundred-dollar bill, folded lengthwise like a tiny canoe.",
    "prompt": "He materializes at the lip of the stage holding the hundred like a fishing lure. The request: a song he cannot name, from “the summer of ’88, maybe ’89,” which goes — and here he hums four notes that describe at least two hundred songs and one national anthem. “You know the one,” he says. He believes this completely.",
    "tags": [
      "live",
      "social"
    ],
    "choices": {
      "left": {
        "label": "Fake it from the hum",
        "governingStats": {
          "skill": 1,
          "creativity": 0.4
        },
        "tags": [
          "live",
          "risky"
        ],
        "outcomes": {
          "bad": {
            "text": "You build a confident, wrong song out of his four notes. He listens with narrowing eyes, pockets the canoe, and says “that’s not it, but you tried,” which stings more than booing. He tips you $20 for effort. The band calls you Summer of ’88 for a month.",
            "effects": {
              "skill": 2,
              "money": 20,
              "burnout": 5
            }
          },
          "good": {
            "text": "Your third guess detonates something behind his eyes — THE ONE. He commandeers the dance floor, executes a move last performed in ’89, and lands it. The hundred is yours. So, apparently, is his loyalty: he requests you by name at the next three family weddings.",
            "effects": {
              "skill": 5,
              "money": 130,
              "network": 4
            }
          },
          "incredible": {
            "text": "It’s not a real song. You realize mid-fake that you’re IMPROVISING his memory — so you commit, and build the whole thing live: verse, chorus, his sister’s name in the bridge on a gamble. Direct hit. He weeps into his lapels, presses the hundred plus its brother into your hand, and says “nobody’s played that in thirty years.” Nobody had ever played it.",
            "effects": {
              "skill": 7,
              "creativity": 7,
              "money": 200,
              "fame": 3
            }
          }
        }
      },
      "right": {
        "label": "Negotiate him to a song you know",
        "governingStats": {
          "network": 1
        },
        "tags": [
          "social",
          "safe",
          "live"
        ],
        "outcomes": {
          "bad": {
            "text": "The negotiation lasts eleven minutes, spans three decades of music history, and ends in a compromise neither of you wants. He dances to it anyway, out of politeness, at half power. Half the hundred appears in the tip jar. You both know.",
            "effects": {
              "network": 2,
              "money": 50,
              "burnout": 4
            }
          },
          "good": {
            "text": "You steer him from the phantom song to its cousin — same summer, same feeling, actual existence. Two bars in, he points at you like you’ve returned his wallet. The floor fills. The hundred lands in the jar flat and proud, unfolded, which from this man is a standing ovation.",
            "effects": {
              "network": 5,
              "money": 120,
              "cred": 2,
              "fame": 2
            }
          },
          "incredible": {
            "text": "Your substitute song ignites the whole reception’s memory at once — suddenly every guest over fifty has a request from the same two years, and the hundred turns out to be the first bill of an avalanche. You play ’88 to ’89 for an hour. The uncle acts as your promoter, security, and hype man. Final take: the best wedding money of your year.",
            "effects": {
              "network": 7,
              "money": 240,
              "fame": 4,
              "burnout": 3
            }
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
    "tags": [
      "live",
      "band"
    ],
    "choices": {
      "left": {
        "label": "Do this GOOD (volume war)",
        "governingStats": {
          "skill": 1,
          "creativity": 0.3
        },
        "tags": [
          "live",
          "risky",
          "band"
        ],
        "outcomes": {
          "bad": {
            "text": "You bring your best and The Cousins bring 1978 — a wall of horns, four-part harmony, a grandmother on tambourine who has buried better bands than yours. Both dance floors migrate to their side. Their bandleader sends over a plate of cake, which is somehow the most devastating move available to him.",
            "effects": {
              "skill": 3,
              "burnout": 6,
              "money": 70,
              "cred": -2
            }
          },
          "good": {
            "text": "You trade haymakers through canvas for two hours — their horns, your hooks — and both dance floors stay full and FERAL, each side convinced they got the better wedding. At night’s end the divider comes down for one shared song. Both couples tip both bands. Diplomatic history.",
            "effects": {
              "skill": 6,
              "money": 160,
              "fame": 4,
              "network": 4
            }
          },
          "incredible": {
            "text": "Somewhere around hour two the war becomes a set: call-and-response through the divider, horn answers to your choruses, two drummers locked without eye contact. Someone pulls the canvas, the receptions merge into one two-hundred-person floor, and The Cousins’ patriarch anoints you at full mic: “Kid’s got it.” In wedding-circuit terms this is a knighthood. Referrals for a year.",
            "effects": {
              "skill": 8,
              "money": 250,
              "network": 7,
              "fame": 6,
              "cred": 3
            }
          }
        }
      },
      "right": {
        "label": "Propose an alliance",
        "governingStats": {
          "network": 1
        },
        "tags": [
          "social",
          "safe",
          "deal"
        ],
        "outcomes": {
          "bad": {
            "text": "The Cousins accept the alliance and then absorb you — suddenly you’re their auxiliary rhythm section, taking charts from a man named Uncle Bobby who counts in by nodding. It’s their show. Your own couple keeps squinting at the stage trying to find the band they hired. Paid in full, dissolved in full.",
            "effects": {
              "network": 3,
              "money": 90,
              "burnout": 5,
              "skill": 2
            }
          },
          "good": {
            "text": "You split the night into shifts: they take the dinner sets, you take the dance floor, both bands sitting in on the big numbers. Their sax player teaches you the Wedding Nod — the tiny cue for “the couple’s about to cry, go soft NOW.” Trade secrets. Actual trade secrets.",
            "effects": {
              "network": 6,
              "money": 150,
              "skill": 4
            }
          },
          "incredible": {
            "text": "The alliance outlives the tent: The Cousins book forty weddings a season and turn down half, and starting now the overflow has your number on it. “You didn’t try to beat us,” the patriarch says, tapping his temple, “that’s a Cousins move.” Steady money, wedding-circuit protection, and a standing invitation to sit in on horns night.",
            "effects": {
              "network": 9,
              "money": 200,
              "cred": 3,
              "fame": 3
            }
          }
        }
      }
    }
  },
  {
    "id": "nw_divorce_party",
    "act": [
      2,
      3
    ],
    "pathAffinity": [],
    "weight": 9,
    "pack": "pack_wedding",
    "art": "ev_nw_divorce_party",
    "context": "Same ballroom. Same disco ball. A banner: FREE AT LAST (glitter)",
    "prompt": "Seven years ago you played this exact ballroom for this exact woman’s wedding. Tonight she’s booked you for the divorce party — same venue, same playlist, “but,” she specifies over the phone with terrifying calm, “new energy.” Her deposit arrived instantly. The first request on the sheet is the first-dance song, annotated: FASTER.",
    "tags": [
      "live",
      "social"
    ],
    "choices": {
      "left": {
        "label": "Play the old playlist, weaponized",
        "governingStats": {
          "skill": 1,
          "creativity": 0.4
        },
        "tags": [
          "live",
          "risky"
        ],
        "outcomes": {
          "bad": {
            "text": "The double-time first-dance song lands wrong — half the room is liberated, half remembers the original too well, and one aunt leaves loudly through the wrong door. The guest of honor keeps dancing alone, sustained by pure conviction. She tips you anyway: “Not your fault. That song was always his.”",
            "effects": {
              "skill": 2,
              "money": 80,
              "burnout": 6
            }
          },
          "good": {
            "text": "You play the wedding set at divorce tempo — every ballad up-shifted, every key brightened, the first-dance song reborn as a stomper — and the room DETONATES. She dances it solo in the center of a clapping circle, seven years of energy discharging safely into a rented floor. “Better than the wedding,” she yells. Everyone agrees. Everyone was at both.",
            "effects": {
              "skill": 6,
              "money": 180,
              "fame": 4,
              "creativity": 4
            }
          },
          "incredible": {
            "text": "The reworked first-dance song becomes an event: guests film the transformation — same room, same band, same song, new woman — and the side-by-side edit travels far beyond the ballroom. By month’s end you’re fielding calls for divorce parties in three states at rates weddings would blush at. “New energy” goes on your invoice as a service tier.",
            "effects": {
              "skill": 8,
              "creativity": 7,
              "money": 250,
              "fame": 6,
              "network": 4
            }
          }
        }
      },
      "right": {
        "label": "Curate the liberation setlist",
        "governingStats": {
          "creativity": 1
        },
        "tags": [
          "live",
          "safe",
          "write"
        ],
        "minigame": "setlist",
        "outcomes": {
          "bad": {
            "text": "Your artful arc — mourning into rage into joy — is interrupted at song two by the guest of honor commandeering the mic: “Skip to the rage.” You skip to the rage. The rest of your curation dies in the folder. The rage portion, to be fair, is a triumph.",
            "effects": {
              "creativity": 2,
              "money": 90,
              "burnout": 5
            }
          },
          "good": {
            "text": "You build the night like a story — the sad ones early while the room fills, the reclamation anthem timed to the cake (shaped like a signed document), the closer chosen from her old request sheet, the one HE always vetoed. When it hits, she points at you across the room: you kept the receipts. Best tip of the season.",
            "effects": {
              "creativity": 6,
              "money": 170,
              "network": 3,
              "cred": 2
            }
          },
          "incredible": {
            "text": "The setlist is so precisely engineered that the party achieves what she calls, misty and triumphant at 1 a.m., “closure with a beat.” Her lawyer — her LAWYER — books you for another client’s party on the spot, and floats a retainer. There is, it turns out, an entire economy of endings, and you are now its house band.",
            "effects": {
              "creativity": 8,
              "money": 240,
              "network": 6,
              "fame": 4,
              "burnout": -3
            }
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
    "tags": [
      "live",
      "social"
    ],
    "choices": {
      "left": {
        "label": "Officiate AND play",
        "governingStats": {
          "creativity": 1,
          "network": 0.3
        },
        "tags": [
          "live",
          "risky",
          "vocal"
        ],
        "outcomes": {
          "bad": {
            "text": "You are magnificent for eleven minutes and then blank on the groom’s name at the single most load-bearing moment of the ceremony. “Do you… you, sir…” The video exists. The marriage also exists — the county clerk confirms your paperwork was, miraculously, fine — but the toast writes itself and it’s about you.",
            "effects": {
              "creativity": 3,
              "money": 120,
              "burnout": 8,
              "fame": 3
            }
          },
          "good": {
            "text": "You marry them like it’s a set: vows as verses, a key change where the kiss goes, the processional played by you sixty seconds after pronouncing you-may. The planner cries into her clipboard. Double fee — musician rate plus a clergy rate she invents on the spot and rounds up.",
            "effects": {
              "creativity": 7,
              "money": 220,
              "fame": 5,
              "network": 4
            }
          },
          "incredible": {
            "text": "Mid-ceremony, on instinct, you sing the vows back to them — their own words, melodized in real time — and the garden comes apart. The clip escapes the wedding within hours: THE OFFICIANT IS THE BAND. Booking inquiries now arrive with a checkbox for “ceremony package.” You were ordained as a joke. The joke has a waiting list.",
            "effects": {
              "creativity": 10,
              "money": 250,
              "fame": 10,
              "network": 6
            }
          }
        }
      },
      "right": {
        "label": "Stall with music, hunt an officiant",
        "governingStats": {
          "network": 1,
          "skill": 0.3
        },
        "tags": [
          "live",
          "safe",
          "work"
        ],
        "outcomes": {
          "bad": {
            "text": "Ninety minutes of ambient stalling. You play everything you know slowly while the planner cold-calls clergy like a bond trader. The eventual officiant — somebody’s neighbor, licensed, furious — performs the fastest wedding in county history. Guests remember mostly you, vamping, sweating, nodding reassuringly at strangers.",
            "effects": {
              "skill": 3,
              "money": 90,
              "burnout": 7
            }
          },
          "good": {
            "text": "You turn the delay into an unplugged garden set and buy the planner a golden hour — enough to helicopter in (metaphorically; by rideshare) a retired judge from the guest list’s plus-ones. Ceremony saved, set legendary, and the couple’s album now includes forty minutes labeled THE WAIT (FEAT. YOU).",
            "effects": {
              "network": 5,
              "skill": 5,
              "money": 160,
              "cred": 3
            }
          },
          "incredible": {
            "text": "During your stall set, a guest quietly stands: an actual minister, the groom’s childhood pastor, who “didn’t want to impose.” He officiates; you underscore the entire ceremony live like a film. The combination — his gravity, your score — is so devastating that three engaged guests book the two of you as a PACKAGE before the cake. The pastor splits fees fairly. The pastor has done this before.",
            "effects": {
              "network": 8,
              "money": 230,
              "fame": 6,
              "cred": 4,
              "burnout": -3
            }
          }
        }
      }
    }
  },
  {
    "id": "ncr_buffet",
    "act": [
      2,
      3
    ],
    "pathAffinity": [],
    "weight": 9,
    "pack": "pack_cruise",
    "art": "ev_ncr_buffet",
    "context": "The Neptune Lounge, which is also, structurally, the buffet",
    "prompt": "Your “stage” shares a wall with the omelet station and the acoustics of a sneeze guard. The room’s natural soundscape: tongs, ice machine, the soft-serve unit’s low B-flat drone, a man announcing shrimp. The cruise director beams: “Two sets a night. The dinner crowd is very honest.”",
    "tags": [
      "live",
      "work"
    ],
    "choices": {
      "left": {
        "label": "Fight the room",
        "governingStats": {
          "skill": 1
        },
        "tags": [
          "live",
          "risky",
          "practice"
        ],
        "outcomes": {
          "bad": {
            "text": "You rearrange the monitors nightly, feud with the ice machine, and lose a week of your life to the tongs. The dinner crowd, very honest, keeps eating. On night six the soft-serve machine is serviced and comes back droning a NEW note, out of your key, on purpose, you are certain.",
            "effects": {
              "skill": 3,
              "burnout": 8,
              "money": 60
            }
          },
          "good": {
            "text": "Night by night you carve a mix out of hostile territory — angles, baffles, a truce with the omelet chef about flip timing. By week two there’s a beat of actual silence after your closer. In the buffet, silence is a standing ovation with the lights on.",
            "effects": {
              "skill": 7,
              "money": 130,
              "cred": 4
            }
          },
          "incredible": {
            "text": "You defeat the room so thoroughly that the ship’s engineer comes to study your monitor placement “for the manual.” Passengers start booking dinner around your sets; the maître d’ reports a waitlist. A waitlist. For the buffet. Corporate sends a commendation and, more importantly, moves you to the good lounge.",
            "effects": {
              "skill": 10,
              "money": 200,
              "cred": 6,
              "fame": 5,
              "network": 4
            }
          }
        }
      },
      "right": {
        "label": "Write FOR the room",
        "governingStats": {
          "creativity": 1
        },
        "tags": [
          "write",
          "indie",
          "safe"
        ],
        "outcomes": {
          "bad": {
            "text": "Your suite composed in B-flat around the soft-serve drone is, by any objective measure, interesting. The dinner crowd files a comment card that says “music weird.” Another says “weird music.” The cruise director suggests, gently, “maybe some songs they know?” The drone, at least, respects you now.",
            "effects": {
              "creativity": 4,
              "burnout": 5,
              "money": 60
            }
          },
          "good": {
            "text": "You tune the set to the room — the ice machine becomes a shaker, the tongs a hi-hat, the B-flat drone your pedal tone — and the buffet stops fighting you because you stopped fighting it. Diners start noticing they’re nodding. “Whatever you changed,” says the shrimp announcer, “keep it.”",
            "effects": {
              "creativity": 8,
              "money": 140,
              "cred": 5,
              "skill": 3
            }
          },
          "incredible": {
            "text": "The buffet suite becomes a cult object: a food blogger aboard writes “Dinner Music, Reconsidered,” the piece travels, and suddenly critics on land are discussing your “site-specific composition practice.” The cruise line, smelling prestige, commissions a piece for the atrium. You are now, professionally, the person who made a buffet sing.",
            "effects": {
              "creativity": 12,
              "money": 220,
              "cred": 8,
              "fame": 6
            }
          }
        }
      }
    }
  },
  {
    "id": "ncr_captain",
    "act": [
      2,
      3
    ],
    "pathAffinity": [],
    "weight": 9,
    "pack": "pack_cruise",
    "art": "ev_ncr_captain",
    "context": "The bridge. The captain, holding your album like a summons.",
    "prompt": "Every night at eight the captain addresses the ship, and every night he ends with a song request for the lounge act. Tonight he summons you to the bridge, taps your album, and makes it known — with the gravity of a man legally empowered to perform marriages and burials — that tomorrow he would like to SING one. With you. Over the all-ship PA.",
    "tags": [
      "live",
      "social"
    ],
    "choices": {
      "left": {
        "label": "Let the captain sing",
        "governingStats": {
          "network": 1
        },
        "tags": [
          "social",
          "risky",
          "vocal"
        ],
        "outcomes": {
          "bad": {
            "text": "The captain’s baritone is a proud, unseaworthy vessel. He sails it directly into your bridge — the musical one — and sinks. Three thousand passengers hear it. He emerges beaming: “We’ll do another tomorrow.” You are now, per maritime tradition apparently, a duo.",
            "effects": {
              "network": 3,
              "burnout": 7,
              "money": 80,
              "fame": 2
            }
          },
          "good": {
            "text": "You transpose down a fourth, coach him through the verse at dawn, and at eight p.m. the captain sings your song to his ship — rough, sincere, weirdly moving over the deck speakers at sea. Passengers request “the captain’s song” all week. He grants you dinner at his table, which aboard this vessel is a peerage.",
            "effects": {
              "network": 7,
              "money": 150,
              "fame": 6,
              "cred": 3
            }
          },
          "incredible": {
            "text": "The duet becomes ship legend and the captain, in gratitude, does something no bonus could: he unlocks a storage hold and shows you the gear a lounge legend abandoned aboard in 1977 — flight-cased, mint, mythical. “The ship keeps what the sea sends,” he says, incorrectly but generously. “It’s yours.” Passengers cheer you both at the midnight buffet.",
            "effects": {
              "network": 10,
              "money": 180,
              "fame": 8,
              "grantGear": "random_good"
            }
          }
        }
      },
      "right": {
        "label": "Steer him into a duet on your terms",
        "governingStats": {
          "skill": 1,
          "creativity": 0.3
        },
        "tags": [
          "live",
          "safe",
          "vocal"
        ],
        "outcomes": {
          "bad": {
            "text": "Your careful arrangement — captain on two lines only, both spoken — reads to him as mutiny. He performs his two lines with the wounded dignity of a demoted admiral, then reassigns your set time to opposite the ice-carving demonstration. The ice guy is very popular. You know what you did.",
            "effects": {
              "skill": 3,
              "burnout": 6,
              "money": 70
            }
          },
          "good": {
            "text": "You build him a part he cannot sink: call-and-response, his lines mostly nautical commands, which he delivers with devastating natural authority. The crowd goes overboard (figuratively; announced twice). The captain, triumphant, extends your contract on the spot at a rate he invents with captain’s privilege.",
            "effects": {
              "skill": 6,
              "money": 190,
              "network": 5,
              "fame": 4
            }
          },
          "incredible": {
            "text": "The arrangement is so good it escapes the ship: a passenger’s video of the captain barking “ALL AHEAD FULL” in perfect rhythm inside your chorus becomes the cruise line’s most-shared post ever. Corporate wants it as an ad. The captain wants writing credit. You negotiate both from a deck chair, at sea, unreachable, at your leisure.",
            "effects": {
              "skill": 8,
              "creativity": 6,
              "money": 250,
              "fame": 10,
              "network": 6
            }
          }
        }
      }
    }
  },
  {
    "id": "ncr_storm_deck",
    "act": [
      2,
      3
    ],
    "pathAffinity": [],
    "weight": 9,
    "pack": "pack_cruise",
    "art": "ev_ncr_storm_deck",
    "context": "Deck 11. Weather advisory. Nine passengers who did not get the memo, or got it and came anyway.",
    "prompt": "The deck party is canceled — forty-knot gusts, horizontal drizzle, the ocean in a mood. But nine passengers are already up there, gripping the rail, and something in how they’re standing tells you the truth: it’s the grief cruise crowd. The widower from deck 4. The sisters scattering their mother Tuesday. They didn’t come for a party. They came because the cabin was too quiet.",
    "tags": [
      "live",
      "family"
    ],
    "choices": {
      "left": {
        "label": "Play the storm set",
        "governingStats": {
          "cred": 1,
          "creativity": 0.4
        },
        "tags": [
          "live",
          "risky",
          "solo"
        ],
        "outcomes": {
          "bad": {
            "text": "The wind eats every third word and eventually takes a cymbal over the rail like a tithe. Security shuts it down four songs in, citing “everything.” But the widower shakes your hand with both of his before you’re herded inside, and holds on one beat longer than politeness. Worth the cymbal. Not the write-up.",
            "effects": {
              "cred": 5,
              "burnout": 8,
              "money": -60,
              "creativity": 3
            }
          },
          "good": {
            "text": "You play small and low into the weather, nine people in a half-circle blocking the wind for you and each other. No mics, no set list, songs about staying and leaving. The sisters request nothing; they just stand closer. Afterward nobody claps. Everybody nods. It’s the right review.",
            "effects": {
              "cred": 9,
              "creativity": 7,
              "burnout": 4,
              "fame": 3
            }
          },
          "incredible": {
            "text": "Mid-set the storm briefly opens — an unearned, cinematic seam of moonlight on black water — and you play into it while nine strangers hold the rail and cry salt into salt. Ship folklore is born by breakfast. For the rest of the cruise, people you’ve never met touch your shoulder in hallways. The widower mails you a letter months later: he plays music in the kitchen again. That one goes in the box you keep forever.",
            "effects": {
              "cred": 14,
              "creativity": 10,
              "fame": 6,
              "network": 4,
              "burnout": -4
            }
          }
        }
      },
      "right": {
        "label": "Move everyone to the library",
        "governingStats": {
          "network": 1
        },
        "tags": [
          "live",
          "safe",
          "home"
        ],
        "outcomes": {
          "bad": {
            "text": "The library is warm, dry, and haunted by a bridge tournament that will not yield territory. You play whisper-volume in the atlas corner while a man declares “two no trump” over your best song. The nine appreciate it. The bridge players file a noise complaint. About an acoustic guitar. In a library. At sea.",
            "effects": {
              "network": 3,
              "burnout": 5,
              "money": 60
            }
          },
          "good": {
            "text": "Armchairs in a circle, rain on the portholes, tea from the night steward who refuses payment. You play two hours of quiet songs while the storm audits the windows. The sisters tell you about their mother between numbers, and the songs after that are for her, and everyone knows it without it being said.",
            "effects": {
              "network": 6,
              "cred": 7,
              "burnout": -5,
              "money": 90
            }
          },
          "incredible": {
            "text": "The library set becomes a nightly institution — passengers start calling it Quiet Hour, the steward reserves your chair, and word reaches exactly the right person: a grief counselor aboard who consults for the cruise line. She wants Quiet Hour on every ship in the fleet, designed by you, licensed from you. The contract that follows is the gentlest money you will ever make.",
            "effects": {
              "network": 10,
              "cred": 8,
              "money": 230,
              "fame": 5,
              "burnout": -5
            }
          }
        }
      }
    }
  },
  {
    "id": "ncr_talent_show",
    "act": [
      2,
      3
    ],
    "pathAffinity": [],
    "weight": 9,
    "pack": "pack_cruise",
    "art": "ev_ncr_talent_show",
    "context": "The Poseidon Theater. Judges’ table. A scorecard and a complimentary lanyard.",
    "prompt": "You’re judging the passenger talent show between a juggler, a comedy hypnotist, and the cruise director’s niece (interpretive dance, heavily favored, related to management). Then contestant eight: a silver-haired retiree in orthopedic sneakers plugs in a road-worn guitar and, without preamble, SHREDS — real, vicious, dust-blowing-off-of-it shredding. The theater loses its mind. The cruise director’s smile does not reach his eyes.",
    "tags": [
      "social",
      "live"
    ],
    "choices": {
      "left": {
        "label": "Score it honest. Crown the retiree.",
        "governingStats": {
          "cred": 1
        },
        "tags": [
          "social",
          "risky"
        ],
        "outcomes": {
          "bad": {
            "text": "You crown the retiree and the cruise director enters a cold war: your set times migrate to nap hours, your drink tickets expire mysteriously, the spotlight operator develops a tremor only during your shows. The retiree finds you at the rail and says “worth it.” The retiree is not the one playing the 3 p.m. slot.",
            "effects": {
              "cred": 6,
              "burnout": 7,
              "money": -40
            }
          },
          "good": {
            "text": "Justice lands to a standing ovation the niece’s routine did not risk. The retiree — Arlene, retired dental hygienist, forty years of woodshedding in a spare room — takes the trophy like she’s been ready since 1985. She has. The passengers adore you for it, and passengers write comment cards corporate actually reads.",
            "effects": {
              "cred": 8,
              "fame": 5,
              "network": 5,
              "money": 100
            }
          },
          "incredible": {
            "text": "Over sea days it comes out: Arlene played sessions in the seventies — uncredited, on records you OWN — then walked away when the credits kept walking away from her. You spend the rest of the cruise trading licks with a ghost from your own liner notes. She shows you the trick that fixed your weakest transition forever, and makes you promise one thing: “Take the credit. Every time.”",
            "effects": {
              "cred": 10,
              "skill": 9,
              "network": 8,
              "fame": 4,
              "burnout": -4
            }
          }
        }
      },
      "right": {
        "label": "Split the crown, keep the peace",
        "governingStats": {
          "network": 1
        },
        "tags": [
          "social",
          "safe",
          "deal"
        ],
        "outcomes": {
          "bad": {
            "text": "The tie satisfies no one: the theater boos the diplomacy, the niece knows, the cruise director’s gratitude has the warmth of a service elevator, and Arlene congratulates her co-champion with a graciousness that makes it worse. A teenager in row three films your face during the announcement. The caption is unkind and accurate.",
            "effects": {
              "network": 3,
              "cred": -4,
              "burnout": 6,
              "money": 80
            }
          },
          "good": {
            "text": "You engineer a shared crown with separate honors — Arlene takes “Musicianship,” the niece takes “Artistry,” everyone takes photos. The cruise director owes you visibly, which on a ship is currency: prime set times, the good cabin, an open tab at the juice bar. Arlene winks at you at breakfast. She’s played politics before too.",
            "effects": {
              "network": 7,
              "money": 150,
              "fame": 3,
              "burnout": -3
            }
          },
          "incredible": {
            "text": "Your diplomatic masterstroke — a finale where Arlene shreds UNDER the niece’s dance, an act you invent at the judges’ table in real time — brings the house down twice and gets both families crying for different reasons. Corporate hears about the judge who turned a scandal into a showstopper, and the entertainment director title they float is salaried, seasonal, and negotiable from land.",
            "effects": {
              "network": 10,
              "money": 200,
              "fame": 6,
              "creativity": 5,
              "cred": 3
            }
          }
        }
      }
    }
  },
  {
    "id": "ncr_intl_waters",
    "act": [
      2,
      3
    ],
    "pathAffinity": [],
    "weight": 9,
    "pack": "pack_cruise",
    "art": "ev_ncr_intl_waters",
    "context": "Twelve nautical miles out. The ship photographer’s cabin studio. A flag app, consulted.",
    "prompt": "The ship’s photographer moonlights as an engineer and has built a shockingly good rig in his cabin. His pitch, delivered at whisper volume: “We’re in international waters. No publishing law applies out here.” This is not really how any of that works, and you both know it, and the rig is warm, and the sea is flat, and you have a song that’s been circling the boat for days.",
    "tags": [
      "studio",
      "record"
    ],
    "choices": {
      "left": {
        "label": "Track the new one at sea",
        "governingStats": {
          "creativity": 1,
          "skill": 0.4
        },
        "tags": [
          "studio",
          "write",
          "safe"
        ],
        "minigame": "take",
        "outcomes": {
          "bad": {
            "text": "The take is gorgeous until the ship’s stabilizers kick on and gift your quietest verse a low-frequency shudder no plugin can evict. The photographer calls it “the ocean’s part.” You keep a rough of the wreck anyway — under the shudder, the song is THERE, and the song is what you came for.",
            "effects": {
              "creativity": 4,
              "burnout": 4,
              "skill": 2,
              "writeSong": true
            }
          },
          "good": {
            "text": "Something about recording in a place that belongs to no country unlocks the take: the song arrives whole, salt in its lungs, engine hum sitting under it like a drone you’d have paid for. The photographer refuses money and requests one print credit: “Recorded at sea.” Granted. Forever.",
            "effects": {
              "creativity": 9,
              "skill": 4,
              "cred": 5,
              "writeSong": true
            }
          },
          "incredible": {
            "text": "The take of your life, twelve miles from any law that was never going to notice you anyway. When it surfaces on land, the origin story does half the promotion by itself — RECORDED IN A CABIN, AT NIGHT, IN NO NATION — and an engineer-lore blog canonizes the photographer, who becomes your engineer for life over his employer’s objections. The sea, as promised, keeps what it’s sent.",
            "effects": {
              "creativity": 12,
              "skill": 6,
              "fame": 8,
              "cred": 8,
              "money": 150,
              "writeSong": true
            }
          }
        }
      },
      "right": {
        "label": "Cut the lawless covers EP",
        "governingStats": {
          "skill": 1,
          "network": 0.3
        },
        "tags": [
          "record",
          "risky",
          "deal"
        ],
        "outcomes": {
          "bad": {
            "text": "The “no law out here” theory survives exactly nine days on land before a politely apocalyptic email arrives from a publisher’s enforcement bot. The EP comes down; the takedown notice, framed by the photographer, stays up in his cabin. You made $210 in nine days and a very educational memory.",
            "effects": {
              "skill": 3,
              "money": -80,
              "burnout": 7,
              "cred": 2
            }
          },
          "good": {
            "text": "You cut eight covers in two nights, loose and salty, and sell them at the merch table as A PIRATE RECORDING (ALLEGEDLY) — a title that does more work than any marketing you’ve ever paid for. Passengers buy them as souvenirs. Lawyers, if any hear it, are charmed into silence. Nine days of cash, zero consequences, one legend.",
            "effects": {
              "skill": 6,
              "money": 190,
              "fame": 4,
              "network": 3
            }
          },
          "incredible": {
            "text": "One cover — your dead-slow, half-time gutting of a beloved standard — leaks off the boat and detonates: the original’s SONGWRITER hears it, loves it, and blesses it publicly, which converts your legal problem into a co-sign. The blessed version goes up everywhere, laws intact, story attached. “Recorded beyond jurisdiction, released by permission” is, everyone agrees, the coolest possible fine print.",
            "effects": {
              "skill": 9,
              "fame": 12,
              "cred": 8,
              "money": 250,
              "network": 6
            }
          }
        }
      }
    }
  },
  {
    "id": "nr_split_bill",
    "act": [
      1,
      2
    ],
    "pathAffinity": [],
    "weight": 10,
    "art": "ev_nr_split_bill",
    "context": "A promoter, avoiding eye contact. A poster with two names in the same font size.",
    "prompt": "The promoter double-booked the night and has rebranded the accident as a “CO-HEADLINE EVENT”: you and {rival}, one stage, one green room, one deli tray with a single sad sandwich already missing. {rival} arrives, reads the poster, reads the room, and sets their case down on exactly half of the couch.",
    "tags": [
      "live",
      "rival"
    ],
    "choices": {
      "left": {
        "label": "Split everything fairly",
        "governingStats": {
          "network": 1
        },
        "tags": [
          "rival",
          "social",
          "safe"
        ],
        "outcomes": {
          "bad": {
            "text": "The peace holds right up until the encore, which the crowd demands from BOTH of you, and which neither of you prepared for because you were busy being adults about the deli tray. The joint encore is a polite trainwreck in two keys. You split the blame fairly too.",
            "effects": {
              "network": 3,
              "burnout": 5,
              "money": 60,
              "rivalry": 1
            }
          },
          "good": {
            "text": "You alternate sets, share the good monitor, and split the door to the dollar. Backstage, on neutral couch territory, you compare promoter horror stories for an hour and laugh more than either of you will admit later. The feud isn’t over. But it took the night off.",
            "effects": {
              "network": 6,
              "money": 110,
              "cred": 4,
              "rivalry": -1
            }
          },
          "incredible": {
            "text": "The night ends with an unplanned two-song collision — their closer into yours, no rehearsal, pure listening — that outdraws both catalogs. The crowd chants both names in alternation like a tennis match. You and {rival} agree, in the alley after, to never speak of how well that went. The scene speaks of nothing else.",
            "effects": {
              "network": 8,
              "fame": 9,
              "cred": 6,
              "money": 150,
              "rivalry": -1
            }
          }
        }
      },
      "right": {
        "label": "Make it a competition",
        "governingStats": {
          "skill": 1,
          "creativity": 0.3
        },
        "tags": [
          "rival",
          "risky",
          "live"
        ],
        "outcomes": {
          "bad": {
            "text": "You play the set of your month; {rival} plays the set of their year. The crowd’s verdict is unspoken but unanimous, and involves them buying {rival}’s merch in a line that bends past your table. {rival} sends you a bottle of decent whiskey with a note: “Good pressure.” The whiskey helps. The note doesn’t.",
            "effects": {
              "skill": 4,
              "burnout": 7,
              "money": 40,
              "rivalry": 1
            }
          },
          "good": {
            "text": "The unofficial contest lifts both sets into rare air — you close with the risky one and STICK it, and the room splits down the middle in the best way: everyone leaves arguing, which means everyone leaves talking. The promoter, a man who fell into a gold mine, books the “rematch” before load-out.",
            "effects": {
              "skill": 7,
              "fame": 8,
              "money": 120,
              "cred": 4,
              "rivalry": 1
            }
          },
          "incredible": {
            "text": "You win the room outright — not on flash, on the quiet one, pin-drop, phones DOWN — and even {rival}’s own crowd knows it. {rival} finds you at load-out and says the worst thing a rival can say: “That was better than mine tonight,” which is somehow a declaration of war and the highest compliment of your career in one sentence. The rematch sells out in a day.",
            "effects": {
              "skill": 10,
              "fame": 12,
              "cred": 8,
              "money": 180,
              "rivalry": 1
            }
          }
        }
      }
    }
  },
  {
    "id": "nr_understudy",
    "act": [
      2,
      3
    ],
    "pathAffinity": [],
    "weight": 10,
    "art": "ev_nr_understudy",
    "context": "A venue calendar screenshot, sent by three people at once",
    "requires": {
      "rivalIs": "understudy"
    },
    "prompt": "The Understudy has announced a show for next week performing — per the flyer, in your exact setlist font — songs from YOUR unreleased set. The set you’ve played for no one. The set that exists in your notebook, your practice room, and the ears of maybe five trusted people. The Understudy learned your act by watching. Apparently they’ve been watching somewhere very, very close.",
    "tags": [
      "rival",
      "social"
    ],
    "choices": {
      "left": {
        "label": "Hunt the mole",
        "governingStats": {
          "network": 1
        },
        "tags": [
          "rival",
          "risky",
          "social"
        ],
        "outcomes": {
          "bad": {
            "text": "Five trusted people, five interrogations, zero moles — turns out the practice room shares a heating duct with a storage unit, and The Understudy simply rented it. Your investigation, meanwhile, has insulted everyone you trust. The apology tour costs more than the leak did.",
            "effects": {
              "network": -4,
              "burnout": 9,
              "creativity": 2,
              "rivalry": 1
            }
          },
          "good": {
            "text": "You trace it in three days: the open mic where you tested one song, ONCE — The Understudy was in the back, hood up, phone out, the whole time. You show up to their show and sit front row, arms crossed. They play everything a half-step wrong and sweat through the encore. Word circulates: the copy degrades. See the original.",
            "effects": {
              "network": 6,
              "cred": 7,
              "fame": 5,
              "rivalry": 1
            }
          },
          "incredible": {
            "text": "The hunt turns up something better than a mole: The Understudy’s own rough recordings of your songs, posted early to build hype — timestamped BEFORE your notebook dates could prove authorship, except your five trusted people are five sworn witnesses with receipts. The scene watches the whole theft collapse in public. Your unreleased set now has the best promotion in music: everyone knows it was worth stealing.",
            "effects": {
              "network": 8,
              "cred": 10,
              "fame": 12,
              "rivalry": 2
            }
          }
        }
      },
      "right": {
        "label": "Shrug. Let them cover the old you.",
        "governingStats": {
          "creativity": 1
        },
        "tags": [
          "rival",
          "write",
          "safe"
        ],
        "outcomes": {
          "bad": {
            "text": "Rising above it reads, to the scene, as conceding it. The Understudy’s show sells out; their version of your best unreleased chorus becomes the version people hum. You now face the singular horror of being asked whether YOU will cover THEM. You write angrily. It doesn’t rhyme yet.",
            "effects": {
              "creativity": 4,
              "burnout": 8,
              "fame": 2,
              "rivalry": 1
            }
          },
          "good": {
            "text": "You skip the drama and spend the week writing the NEXT set — the one nobody can have seen, built in a borrowed room with the blinds down. The Understudy performs your past to a decent crowd; you quietly outgrow it in real time. When the two sets eventually meet in public, only one of them is alive.",
            "effects": {
              "creativity": 9,
              "cred": 6,
              "burnout": -4,
              "rivalry": 0
            }
          },
          "incredible": {
            "text": "The shrug becomes doctrine: “They can have the setlist. They can’t have the next one.” The quote travels, the new material arrives white-hot, and The Understudy — locked forever one set behind, a tribute act to a moving target — becomes your unpaid advance team. Their crowd shows up at your next gig to hear where the songs COME from. You play none of the stolen set. Nobody misses it.",
            "effects": {
              "creativity": 12,
              "cred": 9,
              "fame": 8,
              "burnout": -4,
              "rivalry": 1
            }
          }
        }
      }
    }
  },
  {
    "id": "nr_kudzu",
    "act": [
      2,
      3
    ],
    "pathAffinity": [],
    "weight": 10,
    "art": "ev_nr_kudzu",
    "context": "A tagged post: “new flip 🌿” — and, underneath, your own hands",
    "requires": {
      "rivalIs": "kudzu"
    },
    "prompt": "DJ Kudzu has released a remix of your soundcheck — the aimless noodling you played to test the monitors, secretly recorded from the floor, chopped over a beat, and titled like it was a collaboration. It is, and this is the infuriating part, GOOD. It’s charting-adjacent. Playlists have found it. Your name is in the credits as “source (organic).”",
    "tags": [
      "rival",
      "record"
    ],
    "choices": {
      "left": {
        "label": "Claim the credit, lawyered",
        "governingStats": {
          "network": 1
        },
        "tags": [
          "rival",
          "deal",
          "safe"
        ],
        "outcomes": {
          "bad": {
            "text": "The legal letter works: proper credit, back royalties, a formal apology drafted by someone billing hourly. It also freezes the track’s momentum solid — playlists drop it during the dispute, and the internet’s sympathy drifts to Kudzu, who posts the letter with the caption “the ORGANIC has representation now.” You won. It has the texture of losing.",
            "effects": {
              "network": 3,
              "money": 120,
              "fame": -3,
              "burnout": 6,
              "rivalry": 1
            }
          },
          "good": {
            "text": "Your lawyer-adjacent friend drafts something firm but civilized, and Kudzu — who has clearly done this before — folds instantly into a proper split: your name up front, royalties flowing, the track relisted as a true collab. The charting-adjacent thing becomes charting-actual with both fanbases pushing it. You still can’t remember playing the melody. It pays you monthly now.",
            "effects": {
              "network": 6,
              "money": 200,
              "fame": 8,
              "cred": 4
            }
          },
          "incredible": {
            "text": "The negotiation lands you something better than back pay: a proper session, contracted, daylight, both names even. And the wild part — with actual intent behind it, the two of you are better than the bootleg. The follow-up single eclipses the stolen one, the stolen one becomes “the demo,” and the whole saga reads, in retrospect, like a heist that turned into a marriage. Kudzu still records your soundchecks. It’s in the contract now. So is your cut.",
            "effects": {
              "network": 9,
              "money": 280,
              "fame": 12,
              "cred": 6,
              "rivalry": -1
            }
          }
        }
      },
      "right": {
        "label": "Steal it back louder",
        "governingStats": {
          "creativity": 1,
          "skill": 0.3
        },
        "tags": [
          "rival",
          "risky",
          "record"
        ],
        "outcomes": {
          "bad": {
            "text": "Your counter-flip — a remix of their remix of your noodling — is conceptually devastating and musically fine. The internet, which cares about one of those things, keeps streaming the original theft. Somewhere in the recursion the melody stops belonging to anyone, which the forum kids call “the kudzu effect,” which means Kudzu wins the taxonomy too.",
            "effects": {
              "creativity": 4,
              "burnout": 7,
              "fame": 3,
              "rivalry": 1
            }
          },
          "good": {
            "text": "You take the noodle back to the woodshed and return with the FULL SONG the noodling was always trying to be — verse, chorus, the works — released with the caption “heard someone found my rough draft.” The scene eats it alive. Both tracks feed each other up the charts, and the beef becomes the best A&R either of you has ever had.",
            "effects": {
              "creativity": 9,
              "fame": 10,
              "cred": 6,
              "money": 130,
              "rivalry": 1
            }
          },
          "incredible": {
            "text": "Your reclamation is so decisive — the finished song swallowing the remix whole, THEIR drop appearing in YOUR bridge for one bar like a trophy on a wall — that Kudzu concedes in public: “ok that’s how you flip a flip. taught by the source 🌿.” The exchange enters scene folklore as The Reclaiming. Both tracks chart. Yours charts higher. The soundboard guy who let Kudzu record from the floor would like everyone to stop asking about it.",
            "effects": {
              "creativity": 12,
              "fame": 14,
              "cred": 9,
              "money": 180,
              "rivalry": 1
            }
          }
        }
      }
    }
  },
  {
    "id": "nr_cold_open",
    "act": [
      2,
      3
    ],
    "pathAffinity": [],
    "weight": 10,
    "art": "ev_nr_cold_open",
    "context": "{rival}, in your doorway, holding demos and visible nerves",
    "requires": {
      "rivalryMax": 2
    },
    "prompt": "The feud cooled a while ago; what’s left is something neither of you has named. Now {rival} is at your door with a hard drive and a speech they’ve clearly rehearsed in the car: they want YOU to produce their record. “You’re the only one who hates my bad habits as much as I do,” they say. “That’s producing, right?” It is. That’s exactly what it is.",
    "tags": [
      "rival",
      "studio"
    ],
    "choices": {
      "left": {
        "label": "Produce their record",
        "governingStats": {
          "skill": 1,
          "network": 0.4
        },
        "tags": [
          "rival",
          "studio",
          "risky"
        ],
        "outcomes": {
          "bad": {
            "text": "Week two, the old friction finds the studio door: you push, they plant, and one long Tuesday ends with the two of you arguing about a hi-hat with a heat that has nothing to do with the hi-hat. The record survives; the sessions end formal. It’s good. It could have been the other thing.",
            "effects": {
              "skill": 4,
              "money": 100,
              "burnout": 8,
              "rivalry": 1
            }
          },
          "good": {
            "text": "It works the way it was always going to work: you know exactly where they flinch, and they trust you enough to be told. The record is the best thing they’ve made, and everyone who hears it can tell someone finally got them to stop doing the thing. In the credits: your name, and under it, in small type they insisted on, “finally.”",
            "effects": {
              "skill": 7,
              "network": 6,
              "money": 180,
              "cred": 6,
              "rivalry": -1
            }
          },
          "incredible": {
            "text": "The sessions turn into the thing musicians chase whole careers: total candor, zero politics, two people who spent years studying each other’s weaknesses now aiming all of it at the songs. The record lands as a critical event, and the story under the story — RIVALS, RECONCILED, IN THE CREDITS — carries it further. At the release show {rival} thanks you from stage, voice cracking on your name. The feud is over. Something rarer is running in its place.",
            "effects": {
              "skill": 10,
              "network": 9,
              "money": 250,
              "cred": 10,
              "fame": 6,
              "rivalry": -1
            }
          }
        }
      },
      "right": {
        "label": "Decline. Protect your own season.",
        "governingStats": {
          "creativity": 1
        },
        "tags": [
          "rival",
          "solo",
          "safe"
        ],
        "outcomes": {
          "bad": {
            "text": "You say no gently and mean it kindly, and watch it land like neither. {rival} nods too many times, takes the hard drive back, and produces the record with someone who lets them keep every bad habit. It does fine. The doorway conversation replays at odd hours. You got your season. It cost a door.",
            "effects": {
              "creativity": 4,
              "burnout": 6,
              "rivalry": 1
            }
          },
          "good": {
            "text": "You decline the chair but not the record: you take the drive for one weekend and return it with nine pages of notes — every flinch flagged, every fix sketched, the produce-by-mail version of a decade of paying attention. {rival} follows every note. The thank-you in the liner notes is one line long and says more than the speech did. Your own season, meanwhile, stays yours.",
            "effects": {
              "creativity": 8,
              "network": 4,
              "cred": 5,
              "burnout": -4,
              "rivalry": -1
            }
          },
          "incredible": {
            "text": "Your no comes with a counteroffer neither of you saw coming until you said it: “Not your producer. Your B-side.” One split single — one song each, same theme, released together — small enough to protect your season, sharp enough to mean something. It outsells both your last releases combined. The sleeve shows two chairs, back to back. The scene finally has its answer about you two, and the answer is a record.",
            "effects": {
              "creativity": 11,
              "fame": 9,
              "cred": 8,
              "money": 150,
              "rivalry": -1
            }
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
    "requires": {
      "rivalryMin": 7,
      "chartingMin": 1,
      "songsMin": 1
    },
    "prompt": "{rival} has moved their album to YOUR release week — confirmed by their own label’s newsletter, which uses the word “showdown” twice and a boxing glove emoji once. “{song}” versus their lead single, same Friday, same chart, on purpose. Your phone is a casino floor. The scene has already printed unofficial fight posters. Somebody is taking actual bets.",
    "tags": [
      "rival",
      "fame"
    ],
    "choices": {
      "left": {
        "label": "Go to war. Full campaign.",
        "governingStats": {
          "network": 1,
          "creativity": 0.3
        },
        "tags": [
          "rival",
          "risky",
          "mainstream"
        ],
        "outcomes": {
          "bad": {
            "text": "You empty the war chest — ads, premieres, a launch event with a regrettable ice sculpture — and Friday comes back split: they take the chart by a nose, you take the reviews by a mile, and the accountants take everything else. The fight posters sell better than either record. Neither label mentions the boxing glove again.",
            "effects": {
              "money": -200,
              "fame": 8,
              "burnout": 10,
              "cred": 3,
              "rivalry": 1
            }
          },
          "good": {
            "text": "You fight it properly — targeted push, the good remix held back for week two like ammunition, a midnight livestream that out-draws their launch party. “{song}” edges them by Sunday and holds. The scene calls the whole week THE FRIDAY WAR and prints commemorative shirts with both names, which both camps buy, which everyone pretends not to find funny.",
            "effects": {
              "money": 150,
              "fame": 14,
              "cred": 6,
              "hypeSong": 25,
              "rivalry": 1
            }
          },
          "incredible": {
            "text": "The war goes so public it stops being yours: morning shows pick it up, neutral fans pick sides recreationally, and Friday detonates into the biggest week either of you has ever had — with “{song}” on top, undisputed, by a margin nobody can spin. {rival} concedes with a single posted photo: white flag, drawn on a setlist, in your font. Frame it. You’ve earned one trophy in this feud nobody can argue with.",
            "effects": {
              "money": 300,
              "fame": 18,
              "cred": 8,
              "hypeSong": 30,
              "hits": 1,
              "rivalry": 1
            }
          }
        }
      },
      "right": {
        "label": "Stay above it. Let the song fight.",
        "governingStats": {
          "cred": 1
        },
        "tags": [
          "rival",
          "safe",
          "indie"
        ],
        "outcomes": {
          "bad": {
            "text": "Dignity, it turns out, does not chart. {rival}’s machine rolls through the week unopposed while you post nothing and say less, and the narrative calcifies: they won, you hid. The song deserved a cornerman. You watch the numbers from a quiet room, above it, alone with the exact size of the high road.",
            "effects": {
              "cred": 4,
              "fame": -4,
              "burnout": 8,
              "rivalry": 1
            }
          },
          "good": {
            "text": "You do exactly one thing all week: play the song, live, beautifully, and let the clip speak. Against {rival}’s full-scale campaign it holds — a close Friday, a split decision — and something better accrues underneath: while their push looks like marketing, yours looks like music. The bets pay out ambiguously. The song comes out bigger than the fight.",
            "effects": {
              "cred": 10,
              "fame": 8,
              "money": 100,
              "rivalry": 0
            }
          },
          "incredible": {
            "text": "Your silence becomes the story. While {rival} shadowboxes an opponent who won’t enter the ring, you play a single unannounced show — no press, one camera, “{song}” last — and the footage quietly eats their entire campaign. The chart splits the week; the culture doesn’t. “One of them released an album,” writes the critic everyone reads. “The other one released a moment.” {rival}, to their credit, reposts it. War over. Nobody surrendered. You just won.",
            "effects": {
              "cred": 14,
              "fame": 12,
              "money": 150,
              "burnout": -4,
              "rivalry": -1
            }
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
    "requires": {
      "nemesis": true
    },
    "prompt": "Three careers, same face across the room. Tonight the industry is toasting YOU, and the organizers — historians of nothing — have invited {rival} to speak. They rise, {rivalVibe} to the last thread, and deliver a toast that is 60% threat by volume: “To the only one who ever made me better… by making everything harder. May the last act be worthy of the first.” Every eye in the room swings to you. Your glass is already in your hand.",
    "tags": [
      "rival",
      "fame"
    ],
    "choices": {
      "left": {
        "label": "Toast back. Match the threat exactly.",
        "governingStats": {
          "creativity": 1,
          "cred": 0.4
        },
        "tags": [
          "rival",
          "risky",
          "social"
        ],
        "outcomes": {
          "bad": {
            "text": "Your counter-toast lands one degree too hot — the line about their second album gets a gasp where you’d budgeted a laugh — and the room’s temperature drops into contract-negotiation range. {rival} inclines their glass a precise centimeter, filing everything. The trade papers call the evening “bracing.” Your publicist calls it other things.",
            "effects": {
              "creativity": 4,
              "cred": 3,
              "fame": 5,
              "burnout": 9,
              "rivalry": 1
            }
          },
          "good": {
            "text": "You return fire in kind — sixty percent threat, forty percent tribute, every line reverse-engineered from three careers of scar tissue — and the room realizes it’s watching the rarest act in the industry: two people who understand each other completely and forgive it in public. The dual toast gets written up as performance art. Neither of you confirms or denies.",
            "effects": {
              "creativity": 8,
              "cred": 8,
              "fame": 10,
              "network": 5,
              "rivalry": 1
            }
          },
          "incredible": {
            "text": "Your toast is so exactly calibrated — their own words from the first career, quoted back with the ending they never saw coming — that {rival} breaks composure for the first time in three acts: a real laugh, ugly and involuntary, in front of the entire industry. The two toasts circulate as a single clip titled THE LAST GREAT FEUD. Offers arrive for a joint tour, a documentary, a duel album. You and {rival} decline everything, together, in one co-signed sentence. The mystery is worth more.",
            "effects": {
              "creativity": 12,
              "cred": 10,
              "fame": 16,
              "network": 8,
              "rivalry": 1
            }
          }
        }
      },
      "right": {
        "label": "Cross the room. Embrace them.",
        "governingStats": {
          "network": 1
        },
        "tags": [
          "rival",
          "safe",
          "social"
        ],
        "outcomes": {
          "bad": {
            "text": "You go in for history; they receive it like a subpoena. The embrace lasts four seconds, three of them rigid, while the room applauds a reconciliation neither party is having. “Sixty percent,” they murmur into your shoulder, “was generous.” The photos look wonderful. The photos are lying.",
            "effects": {
              "network": 3,
              "fame": 6,
              "burnout": 7,
              "rivalry": 1
            }
          },
          "good": {
            "text": "The hug detonates the room — three careers of feud collapsing into eight seconds of something unarguable. Cameras everywhere; neither of you performs for them, which is how everyone knows it’s real. Back at the table {rival} mutters, “this changes nothing,” and refills your glass without being asked, which changes everything.",
            "effects": {
              "network": 7,
              "fame": 10,
              "cred": 6,
              "burnout": -4,
              "rivalry": -1
            }
          },
          "incredible": {
            "text": "Mid-embrace, quietly, under the applause, {rival} says the thing three careers were built on top of: “I never wanted to beat you. I wanted to keep up.” You answer honestly. Nobody else ever learns what was said — the clip is just two old enemies holding on a beat too long — and the not-knowing makes it the most discussed moment of the industry year. The feud ends tonight, officially, in front of everyone. What replaces it has no name yet. It plays better than the feud ever did.",
            "effects": {
              "network": 10,
              "fame": 14,
              "cred": 10,
              "burnout": -6,
              "rivalry": -2
            }
          }
        }
      }
    }
  }
];

export const ART2 = {
  "ev_n1_allages": {
    "e": "✖️",
    "s": "stage"
  },
  "ev_n1_access_tv": {
    "e": "📺",
    "s": "studio"
  },
  "ev_n1_group_chat": {
    "e": "💬",
    "s": "phone"
  },
  "ev_n1_chat_fest": {
    "e": "🎪",
    "s": "festival"
  },
  "ev_n1_wrong_cover": {
    "e": "🎼",
    "s": "stage"
  },
  "ev_n1_amp_bus": {
    "e": "🚌",
    "s": "street"
  },
  "ev_n1_lesson_flyer": {
    "e": "🧒",
    "s": "home"
  },
  "ev_n1_corner_notebook": {
    "e": "🗺️",
    "s": "street"
  },
  "ev_n1_gentle_chord": {
    "e": "⏰",
    "s": "stage"
  },
  "ev_n1_heat_brownout": {
    "e": "🥵",
    "s": "crisis"
  },
  "ev_n1_off_season_pier": {
    "e": "🌊",
    "s": "stage"
  },
  "ev_n1_venue_polaroid": {
    "e": "📸",
    "s": "stage"
  },
  "ev_n1_estate_sale": {
    "e": "🏷️",
    "s": "shop"
  },
  "ev_n1_receipt_song": {
    "e": "🧾",
    "s": "office"
  },
  "ev_n1_argument_song": {
    "e": "🗯️",
    "s": "home"
  },
  "ev_n1_amp_tech": {
    "e": "🔧",
    "s": "shop"
  },
  "ev_n1_piano_today": {
    "e": "🎹",
    "s": "street"
  },
  "ev_n1_borrowed_rig": {
    "e": "🔌",
    "s": "home"
  },
  "ev_n1_church_gig": {
    "e": "⛪",
    "s": "stage"
  },
  "ev_n1_retirement_home": {
    "e": "🌅",
    "s": "stage"
  },
  "ev_n1_plasma": {
    "e": "💉",
    "s": "office"
  },
  "ev_n1_tent_sale": {
    "e": "🎈",
    "s": "street"
  },
  "ev_n1_unwritten_rules": {
    "e": "📜",
    "s": "street"
  },
  "ev_n1_copy_shop": {
    "e": "🖨️",
    "s": "shop"
  },
  "ev_n1_demo_club": {
    "e": "💿",
    "s": "shop"
  },
  "ev_n1_scene_photog": {
    "e": "📷",
    "s": "street"
  },
  "ev_n1_quiet_night": {
    "e": "🤫",
    "s": "stage"
  },
  "ev_n1_radio_contest": {
    "e": "📻",
    "s": "phone"
  },
  "ev_n1_permit_office": {
    "e": "🪪",
    "s": "office"
  },
  "ev_n1_house_party": {
    "e": "🎂",
    "s": "home"
  },
  "ev_n1_park_circle": {
    "e": "🪕",
    "s": "street"
  },
  "ev_n1_car_studio": {
    "e": "🚗",
    "s": "studio"
  },
  "ev_n1_dollar_bin": {
    "e": "🪙",
    "s": "shop"
  },
  "ev_n1_diner_close": {
    "e": "🥞",
    "s": "home"
  },
  "ev_n1_building_vote": {
    "e": "🗳️",
    "s": "home"
  },
  "ev_n1_street_piano": {
    "e": "🌈",
    "s": "street"
  },
  "ev_n1_weekly_column": {
    "e": "🗞️",
    "s": "phone"
  },
  "ev_n1_barter_yard": {
    "e": "🍂",
    "s": "home"
  },
  "ev_n1_earplug_lecture": {
    "e": "🦻",
    "s": "stage"
  },
  "ev_n1_blues_jam": {
    "e": "🎷",
    "s": "stage"
  },
  "ev_n1_student_film": {
    "e": "🎬",
    "s": "studio"
  },
  "ev_n1_own_sale": {
    "e": "🧺",
    "s": "street"
  },
  "ev_n1_last_minute_opener": {
    "e": "🚐",
    "s": "crisis"
  },
  "ev_n1_soundboard_lesson": {
    "e": "🎚️",
    "s": "stage"
  },
  "ev_n1_lost_pedal": {
    "e": "🎛️",
    "s": "stage"
  },
  "ev_n2_college_radio": {
    "e": "📻",
    "s": "studio"
  },
  "ev_n2_first_tour": {
    "e": "🚐",
    "s": "street"
  },
  "ev_n2_karaoke_host": {
    "e": "🎤",
    "s": "stage"
  },
  "ev_n2_pedal_flipping": {
    "e": "🔁",
    "s": "shop"
  },
  "ev_n2_hold_music": {
    "e": "☎️",
    "s": "office"
  },
  "ev_n2_supper_club": {
    "e": "🍷",
    "s": "stage"
  },
  "ev_n2_ringtone_shop": {
    "e": "📳",
    "s": "phone"
  },
  "ev_n2_opener_slot": {
    "e": "🎟️",
    "s": "stage"
  },
  "ev_n2_van_upgrade": {
    "e": "🚐",
    "s": "shop"
  },
  "ev_n2_hometown_return": {
    "e": "🏠",
    "s": "stage"
  },
  "ev_n2_first_press": {
    "e": "🗞️",
    "s": "phone"
  },
  "ev_n2_sync_ad": {
    "e": "🛏️",
    "s": "office"
  },
  "ev_n2_release_single": {
    "e": "💿",
    "s": "studio"
  },
  "ev_n2_push_the_single": {
    "e": "📈",
    "s": "phone"
  },
  "ev_n2_session_call": {
    "e": "🎧",
    "s": "studio"
  },
  "ev_n2_rival_split_bill": {
    "e": "⚔️",
    "s": "stage"
  },
  "ev_n2_rival_truce_offer": {
    "e": "🍺",
    "s": "street"
  },
  "ev_n2_weather_dance_craze": {
    "e": "🕺",
    "s": "phone"
  },
  "ev_n2_weather_payola": {
    "e": "🕵️",
    "s": "office"
  },
  "ev_n2_merch_math": {
    "e": "👕",
    "s": "shop"
  },
  "ev_n2_producer_offer": {
    "e": "🎛️",
    "s": "studio"
  },
  "ev_n2_burnout_wall_early": {
    "e": "⛽",
    "s": "crisis"
  },
  "ev_n2_write_the_grief": {
    "e": "🕯️",
    "s": "home"
  },
  "ev_n2_scene_politics": {
    "e": "💬",
    "s": "phone"
  },
  "ev_bs_ox": {
    "e": "🐂",
    "s": "street"
  },
  "ev_bs_dot": {
    "e": "🧮",
    "s": "office"
  },
  "ev_n2_festival_slot": {
    "e": "🎪",
    "s": "festival"
  },
  "ev_n2_old_friend": {
    "e": "☎️",
    "s": "stage"
  },
  "ev_n2_radio_promise": {
    "e": "📻",
    "s": "studio"
  },
  "ev_n2_gear_theft": {
    "e": "🪟",
    "s": "street"
  },
  "ev_n2_the_algorithm": {
    "e": "📊",
    "s": "phone"
  },
  "ev_n2_genre_gatekeep": {
    "e": "🧵",
    "s": "stage"
  },
  "ev_n2_venue_regular": {
    "e": "📌",
    "s": "stage"
  },
  "ev_n2_broke_stretch": {
    "e": "💸",
    "s": "office"
  },
  "ev_n2_music_video": {
    "e": "🎬",
    "s": "festival"
  },
  "ev_n2_the_ask": {
    "e": "🤝",
    "s": "stage"
  },
  "ev_n2_label_sniff": {
    "e": "🕴️",
    "s": "stage"
  },
  "ev_n2_cover_gone_big": {
    "e": "🎶",
    "s": "phone"
  },
  "ev_n2_bandmate_doubt": {
    "e": "🍳",
    "s": "home"
  },
  "ev_n2_hustle_audit_two": {
    "e": "🧾",
    "s": "office"
  },
  "ev_n2_tighten_the_set": {
    "e": "🎚️",
    "s": "home"
  },
  "ev_n2_streaming_check": {
    "e": "📉",
    "s": "office"
  },
  "ev_n2_encore_demand": {
    "e": "👏",
    "s": "arena"
  },
  "ev_n2_documentary_pitch": {
    "e": "🎥",
    "s": "street"
  },
  "ev_n2_reissue_offer": {
    "e": "💽",
    "s": "shop"
  },
  "ev_n2_award_nom": {
    "e": "🏅",
    "s": "office"
  },
  "ev_n2_late_night_write": {
    "e": "🌙",
    "s": "home"
  },
  "ev_n2_two_three_bridge": {
    "e": "🔀",
    "s": "office"
  },
  "ev_nfp_eclipse": {
    "e": "🌑",
    "s": "festival"
  },
  "ev_nfp_gorefeast": {
    "e": "🤘",
    "s": "festival"
  },
  "ev_nfp_anthem": {
    "e": "⚾",
    "s": "arena"
  },
  "ev_nfp_wax": {
    "e": "🗿",
    "s": "shop"
  },
  "ev_nfp_broadcast": {
    "e": "📻",
    "s": "studio"
  },
  "ev_nfp_yacht": {
    "e": "🛥️",
    "s": "stage"
  },
  "ev_nfp_sinkhole": {
    "e": "🕳️",
    "s": "crisis"
  },
  "ev_nfp_parade": {
    "e": "🎈",
    "s": "street"
  },
  "ev_nfp_terminal": {
    "e": "🛫",
    "s": "street"
  },
  "ev_nfp_lookalike": {
    "e": "👯",
    "s": "stage"
  },
  "ev_nw_first_dance": {
    "e": "💍",
    "s": "home"
  },
  "ev_nw_uncle_bill": {
    "e": "💵",
    "s": "stage"
  },
  "ev_nw_cousins": {
    "e": "🎺",
    "s": "festival"
  },
  "ev_nw_divorce_party": {
    "e": "🥂",
    "s": "stage"
  },
  "ev_nw_officiant": {
    "e": "📖",
    "s": "stage"
  },
  "ev_ncr_buffet": {
    "e": "🍳",
    "s": "stage"
  },
  "ev_ncr_captain": {
    "e": "🧭",
    "s": "stage"
  },
  "ev_ncr_storm_deck": {
    "e": "🌊",
    "s": "crisis"
  },
  "ev_ncr_talent_show": {
    "e": "🏆",
    "s": "stage"
  },
  "ev_ncr_intl_waters": {
    "e": "🌐",
    "s": "studio"
  },
  "ev_nr_split_bill": {
    "e": "🚪",
    "s": "stage"
  },
  "ev_nr_understudy": {
    "e": "🕵️",
    "s": "phone"
  },
  "ev_nr_kudzu": {
    "e": "🌿",
    "s": "phone"
  },
  "ev_nr_cold_open": {
    "e": "☕",
    "s": "studio"
  },
  "ev_nr_hot_ten": {
    "e": "📊",
    "s": "phone"
  },
  "ev_nr_nemesis_toast": {
    "e": "🥃",
    "s": "office"
  }
};

export const NEW_ARCS = [];
