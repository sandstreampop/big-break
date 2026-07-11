// The Odyssey — game entry (served at /odyssey/). createGame validates the
// pack, builds the screen scaffold on the bare page, installs the mobile
// guards, and boots the shell — there is no per-game UI code to maintain.
import { createGame } from './api.js';
import { odysseyPack } from './packs/odyssey/pack.js';
import { initOdysseyEmber } from './packs/odyssey/ember.js';
import { initOdysseyAlive } from './packs/odyssey/alive.js';
import { registerServiceWorker } from './platform.js';

// The ROOT service worker (the music PWA's, scope '/'): registering it from
// here too means a player who lands on /odyssey/ first still gets the
// offline shell — its fetch handler caches whatever this page loads. Found
// by the 2026-07 review's device pass (Required #4): the README promised
// offline for all three games, but only the music entry ever registered.
registerServiceWorker('../sw.js');

createGame({ pack: odysseyPack }).start();
// The ember (I2): the soul-cursor under the card — pack-side module, its own
// listeners, mounted after the scaffold exists. The shell knows nothing.
initOdysseyEmber();
// The whisper + the ambient haptic grammar (I6): hearth crackle at frame
// beats, the deep-buzz as the band drains, the crowd's stir at a landmark.
initOdysseyAlive();
