// The Odyssey — game entry (served at /odyssey/). createGame validates the
// pack, builds the screen scaffold on the bare page, installs the mobile
// guards, and boots the shell — there is no per-game UI code to maintain.
import { createGame } from './api.js';
import { odysseyPack } from './packs/odyssey.js';

createGame({ pack: odysseyPack }).start();
