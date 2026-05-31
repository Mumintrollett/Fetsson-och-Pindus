// Minigame manager.
//
// A minigame module must export:
//   id           – unique string identifier
//   reset()      – (re)initialise internal state
//   update()     – called every frame while active (can be omitted)
//   render(ctx)  – draw the full-screen overlay
//   handleClick(x, y) – process a canvas click
//
// To start a minigame:
//   import { startMinigame } from '../engine/minigame.js';
//   import * as myGame from '../minigames/mygame.js';
//   startMinigame(myGame, successBool => { /* handle result */ });

import { state } from './state.js';

let _module = null;
let _onDone = null;

export function startMinigame(module, onDone) {
  _module              = module;
  _onDone              = onDone || null;
  state.minigame.active = true;
  state.minigame.id     = module.id;
  module.reset();
}

export function endMinigame(success) {
  state.minigame.active = false;
  state.minigame.id     = null;
  const cb = _onDone;
  _module  = null;
  _onDone  = null;
  if (cb) cb(success);
}

export function isMinigameActive() {
  return state.minigame.active;
}

export function updateMinigame() {
  if (_module && _module.update) _module.update();
}

export function renderMinigame(ctx) {
  if (_module && _module.render) _module.render(ctx);
}

export function handleMinigameClick(x, y) {
  if (_module && _module.handleClick) _module.handleClick(x, y);
}
