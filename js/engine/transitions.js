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
}
