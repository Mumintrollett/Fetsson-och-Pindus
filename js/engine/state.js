import { FLOOR_Y } from './constants.js';

// Central mutable game state.  All modules import this object and mutate it
// in place so changes are immediately visible everywhere.
export const state = {
  scene: 'title',   // 'title' | 'barn' | 'farmyard' | 'garden' | 'kitchen'
  tick: 0,

  player: {
    x: 200,
    y: FLOOR_Y,
    facing: 1,          // 1 = right, -1 = left
    walking: false,
    targetX: null,
    pendingAction: null,
  },

  pindus: {             // companion – follows loosely
    x: 310,
    y: FLOOR_Y,
    facing: -1,
  },

  inventory: [],        // array of item ids
  selectedItem: null,   // item id or null

  flags: {
    stickPickedUp:    false,
    bucketPickedUp:   false,
    bucketFilled:     false,
    gateOpen:         false,
    keyPickedUp:      false,
    doorOpen:         false,
    gameFinished:     false,
    farmhouseShown:   false,
  },

  dlg: {                // dialogue subsystem state
    active: false,
    queue: [],          // [{who, text}, …]
    onDone: null,
  },

  hovered: null,        // currently hovered hotspot id
};

// Live mouse position in canvas-space pixels.
export const mouse = { x: 0, y: 0 };
