// Love Island game entry (served at /love-island/). The sibling of main.ts:
// installs the shared mobile guards and boots the villa pack against the same
// UI shell.

import { boot } from './ui.js';
import { loveIslandPack } from './packs/love-island/pack.js';
import { installMobileGuards, registerServiceWorker } from './platform.js';

// The ROOT service worker (scope '/'), same instance the music entry
// registers — a villa-first player now gets the offline shell too, instead
// of depending on having visited the music game once. (2026-07 device pass,
// Required #4; this replaced the earlier online-first stance.)
registerServiceWorker('../sw.js');

installMobileGuards();
boot(loveIslandPack);
