// Mystery game entry (served at /mystery/). Same UI, same engine, different
// pack. Ships from the same build as the music game. No service worker yet —
// the mystery game is a beta path, online-first.

import { boot } from './ui.js';
import { mysteryPack } from './packs/mystery.js';
import { installMobileGuards } from './platform.js';

installMobileGuards();
boot(mysteryPack);
