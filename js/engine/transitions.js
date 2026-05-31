import { state }        from './state.js';
import { FLOOR_Y }      from './constants.js';
import { showDialogue } from './dialogue.js';
import { DLG }          from '../data/dialogue.js';

export function transitionTo(scene, startX, startY, facing) {
  state.scene = scene;
  state.player.x          = startX;
  state.player.y          = startY;
  state.player.facing     = facing;
  state.player.walking    = false;
  state.player.targetX    = null;
  state.player.pendingAction = null;
  state.hovered           = null;

  // Hide any stale tooltip immediately
  const tipEl = document.getElementById('tooltip');
  if (tipEl) tipEl.classList.add('hidden');

  // Position Pindus near the player
  state.pindus.x      = startX + (facing > 0 ? -70 : 70);
  state.pindus.y      = startY;
  state.pindus.facing = facing;

  // Arrival dialogues
  if (scene === 'kitchen' && !state.flags.gameFinished) {
    state.flags.gameFinished = true;
    setTimeout(() => showDialogue(DLG.ending), 600);
  }

  if (scene === 'kitchen' && state.flags.applesCollected && !state.flags.gameComplete) {
    state.flags.gameComplete = true;
    setTimeout(() => showDialogue(DLG.game_complete), 600);
  }

  if (scene === 'bridge' && !state.flags.bridgeVisited) {
    state.flags.bridgeVisited = true;
    setTimeout(() => showDialogue(DLG.bridge_intro), 600);
  }

  if (scene === 'waterfall' && !state.flags.waterfallVisited) {
    state.flags.waterfallVisited = true;
    setTimeout(() => showDialogue(DLG.waterfall_intro), 600);
  }

  if (scene === 'appleorchard' && !state.flags.orchardVisited) {
    state.flags.orchardVisited = true;
    setTimeout(() => showDialogue(DLG.orchard_intro), 600);
  }
}
