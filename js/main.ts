// Music game entry (the flagship, served at the site root). Installs the
// shared mobile guards, registers the offline service worker, and boots the
// music pack. A second game would add its own thin entry alongside this one,
// so both ship from one build.

import { boot } from './ui.js';
import { musicPack } from './packs/music.js';
import { installMobileGuards, registerServiceWorker } from './platform.js';

installMobileGuards();
registerServiceWorker('./sw.js');
boot(musicPack);
