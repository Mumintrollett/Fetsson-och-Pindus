import { W, H, FLOOR_Y } from './constants.js';
import { state, mouse }  from './state.js';
import { advanceDialogue } from './dialogue.js';
import { getHotspots }     from '../data/hotspots.js';
import { transitionTo }    from './transitions.js';
import { showDialogue }    from './dialogue.js';
import { DLG }             from '../data/dialogue.js';
import { isMinigameActive, handleMinigameClick } from './minigame.js';

export function initInput(canvas) {
  canvas.addEventListener('mousemove', e => {
    const r  = canvas.getBoundingClientRect();
    mouse.x  = (e.clientX - r.left) * (W / r.width);
    mouse.y  = (e.clientY - r.top)  * (H / r.height);

    // No hotspot highlighting during a minigame
    if (isMinigameActive()) {
      state.hovered = null;
      canvas.style.cursor = 'default';
      return;
    }

    const hs = _hotspotAt(mouse.x, mouse.y);
    state.hovered = hs ? hs.id : null;

    const tip = document.getElementById('tooltip');
    if (hs) {
      tip.textContent  = hs.label;
      tip.style.left   = Math.min(mouse.x + 12, W - 160) + 'px';
      tip.style.top    = Math.max(mouse.y - 28,  4) + 'px';
      tip.classList.remove('hidden');
      canvas.style.cursor = 'pointer';
    } else {
      tip.classList.add('hidden');
      canvas.style.cursor = _isGroundClick(mouse.y) ? 'crosshair' : 'default';
    }
  });

  canvas.addEventListener('click', e => {
    const r   = canvas.getBoundingClientRect();
    const cx2 = (e.clientX - r.left) * (W / r.width);
    const cy2 = (e.clientY - r.top)  * (H / r.height);

    // Route all clicks to active minigame
    if (isMinigameActive()) {
      handleMinigameClick(cx2, cy2);
      return;
    }

    // Title screen
    if (state.scene === 'title') {
      transitionTo('barn', 200, FLOOR_Y, 1);
      setTimeout(() => showDialogue(DLG.intro), 500);
      return;
    }

    // Advance dialogue
    if (state.dlg.active) { advanceDialogue(); return; }

    // Ignore clicks on inventory area
    if (cy2 > H - 68) return;

    const hs = _hotspotAt(cx2, cy2);
    if (hs) {
      const target = hs.walkToX;
      state.player.facing       = target < state.player.x ? -1 : 1;
      state.player.targetX      = target;
      state.player.walking      = true;
      state.player.pendingAction = hs.onInteract.bind(hs);
    } else if (_isGroundClick(cy2)) {
      state.player.targetX      = cx2;
      state.player.walking      = cx2 !== state.player.x;
      state.player.facing       = cx2 < state.player.x ? -1 : 1;
      state.player.pendingAction = null;
    }
  });

  document.getElementById('dialogue-box').addEventListener('click', () => {
    advanceDialogue();
  });
}

// ── Internal helpers ──────────────────────────────────────────

function _hotspotAt(px, py) {
  const hs = getHotspots();
  for (let i = hs.length - 1; i >= 0; i--) {
    const h = hs[i];
    if (!h.visible()) continue;
    if (px >= h.x && px <= h.x + h.w && py >= h.y && py <= h.y + h.h) return h;
  }
  return null;
}

function _isGroundClick(py) {
  return py > 360 && py < H - 68;
}
