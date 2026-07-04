// Love Island game entry (served at /love-island/). The sibling of main.ts:
// installs the shared mobile guards and boots the villa pack against the same
// UI shell. No service worker here — the music PWA owns the root scope, and
// the villa ships online-first for now.

import { boot } from './ui.js';
import { loveIslandPack } from './packs/love-island/pack.js';
import { installMobileGuards } from './platform.js';

installMobileGuards();
boot(loveIslandPack);
