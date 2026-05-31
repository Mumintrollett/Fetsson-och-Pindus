import { state } from './state.js';

// ── Public API ────────────────────────────────────────────────

export function showDialogue(lines, onDone) {
  state.dlg.active = true;
  state.dlg.queue  = lines.slice();
  state.dlg.onDone = onDone || null;
  _renderBox();
}

export function advanceDialogue() {
  if (!state.dlg.active) return;
  state.dlg.queue.shift();
  if (state.dlg.queue.length === 0) {
    state.dlg.active = false;
    const cb = state.dlg.onDone;
    state.dlg.onDone = null;
    _hideBox();
    if (cb) cb();
  } else {
    _renderBox();
  }
}

// ── Internal helpers ──────────────────────────────────────────

function _renderBox() {
  const box       = document.getElementById('dialogue-box');
  const speakerEl = document.getElementById('dialogue-speaker');
  const textEl    = document.getElementById('dialogue-text');
  const line = state.dlg.queue[0];
  if (!line) return;
  speakerEl.textContent = line.who;
  textEl.textContent    = line.text;
  box.classList.remove('hidden');
}

function _hideBox() {
  document.getElementById('dialogue-box').classList.add('hidden');
}
