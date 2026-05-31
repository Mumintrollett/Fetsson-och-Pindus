// Hotspot / puzzle definitions for every scene.
//
// A hotspot describes:
//   id        – unique string identifier used for hover highlighting
//   label     – tooltip text (can be a getter function for dynamic labels)
//   x,y,w,h   – bounding rectangle in canvas pixels
//   walkToX   – x the player walks to before the interaction fires
//   visible() – returns false to suppress the hotspot entirely
//   onInteract() – what happens when the player activates the hotspot
//
// To add a new puzzle or location: add an entry to the relevant scene array.

import { state }        from '../engine/state.js';
import { FLOOR_Y }      from '../engine/constants.js';
import { DLG }          from './dialogue.js';
import { showDialogue } from '../engine/dialogue.js';
import { addItem, removeItem, deselectItem } from '../engine/inventory.js';
import { transitionTo } from '../engine/transitions.js';

// ─────────────────────────────────────────────────────────────
// SCENE: BARN
// ─────────────────────────────────────────────────────────────
const barnHotspots = [
  {
    id: 'hay_bale',
    label: 'Hay Bale',
    x: 40, y: 330, w: 160, h: 80,
    walkToX: 130,
    visible: () => true,
    onInteract() {
      if (!state.flags.stickPickedUp) {
        showDialogue(DLG.hay_bale, () => {
          addItem('stick');
          state.flags.stickPickedUp = true;
        });
      } else {
        showDialogue([{ who: 'Fetsson', text: 'Just a hay bale now. The stick is already in my inventory.' }]);
      }
    },
  },
  {
    id: 'pindus_barn',
    label: 'Pindus',
    x: 270, y: 355, w: 80, h: 60,
    walkToX: 240,
    visible: () => true,
    onInteract() {
      showDialogue(state.flags.stickPickedUp ? DLG.pindus_barn_again : DLG.intro);
    },
  },
  {
    id: 'barn_door_exit',
    label: 'Farm Yard →',
    x: 630, y: 50, w: 170, h: 340,
    walkToX: 620,
    visible: () => true,
    onInteract() {
      transitionTo('farmyard', 120, FLOOR_Y, 1);
    },
  },
];

// ─────────────────────────────────────────────────────────────
// SCENE: FARM YARD
// ─────────────────────────────────────────────────────────────
const farmyardHotspots = [
  {
    id: 'barn_back',
    label: '← Barn',
    x: 30, y: 320, w: 90, h: 120,
    walkToX: 130,
    visible: () => true,
    onInteract() {
      transitionTo('barn', 580, FLOOR_Y, -1);
    },
  },
  {
    id: 'farmhouse_door',
    get label() {
      return state.flags.doorOpen ? 'Farmhouse →' : 'Farmhouse Door (Locked)';
    },
    x: 208, y: 323, w: 56, h: 80,
    walkToX: 236,
    visible: () => true,
    onInteract() {
      if (state.flags.doorOpen) {
        transitionTo('kitchen', 400, FLOOR_Y, 1);
      } else if (state.selectedItem === 'key') {
        showDialogue(DLG.open_door, () => {
          state.flags.doorOpen = true;
          deselectItem();
          removeItem('key');
          setTimeout(() => transitionTo('kitchen', 400, FLOOR_Y, 1), 600);
        });
      } else if (state.flags.keyPickedUp) {
        showDialogue([{ who: 'Fetsson', text: 'I have the key! Let me select it from my inventory and use it on the door.' }]);
      } else {
        const lines = state.flags.farmhouseShown
          ? DLG.farmhouse_locked_again
          : DLG.farmhouse_locked_first;
        state.flags.farmhouseShown = true;
        showDialogue(lines);
      }
    },
  },
  {
    id: 'well',
    label: 'Well',
    x: 454, y: 270, w: 74, h: 120,
    walkToX: 450,
    visible: () => true,
    onInteract() {
      if (state.selectedItem === 'bucket') {
        showDialogue(DLG.fill_bucket, () => {
          removeItem('bucket');
          addItem('waterBucket');
          state.flags.bucketFilled = true;
          deselectItem();
        });
      } else if (state.flags.bucketPickedUp && !state.flags.bucketFilled) {
        showDialogue([{ who: 'Fetsson', text: 'I should select the bucket from my inventory and use it on the well.' }]);
      } else if (state.flags.bucketFilled) {
        showDialogue([{ who: 'Fetsson', text: 'The well is still here, but my bucket is already full.' }]);
      } else {
        showDialogue(DLG.well_no_bucket);
      }
    },
  },
  {
    id: 'bucket_pickup',
    label: 'Bucket',
    x: 474, y: 335, w: 35, h: 35,
    walkToX: 480,
    visible: () => !state.flags.bucketPickedUp,
    onInteract() {
      showDialogue(DLG.pickup_bucket, () => {
        addItem('bucket');
        state.flags.bucketPickedUp = true;
      });
    },
  },
  {
    id: 'scarecrow',
    label: 'Scarecrow',
    x: 578, y: 224, w: 48, h: 140,
    walkToX: 560,
    visible: () => true,
    onInteract() {
      showDialogue(DLG.scarecrow);
    },
  },
  {
    id: 'garden_gate',
    get label() {
      return state.flags.gateOpen ? 'Garden →' : 'Garden Gate (Rusty)';
    },
    x: 720, y: 238, w: 80, h: 185,
    walkToX: 700,
    visible: () => true,
    onInteract() {
      if (state.flags.gateOpen) {
        transitionTo('garden', 80, FLOOR_Y, 1);
      } else if (state.selectedItem === 'waterBucket') {
        showDialogue(DLG.gate_open_water, () => {
          state.flags.gateOpen = true;
          removeItem('waterBucket');
          deselectItem();
        });
      } else if (state.flags.bucketFilled) {
        showDialogue([{ who: 'Fetsson', text: 'I should select the water bucket from my inventory and use it on the gate.' }]);
      } else if (state.flags.bucketPickedUp) {
        showDialogue(DLG.rusty_gate_hint);
      } else {
        showDialogue(DLG.rusty_gate);
      }
    },
  },
];

// ─────────────────────────────────────────────────────────────
// SCENE: GARDEN
// ─────────────────────────────────────────────────────────────
const gardenHotspots = [
  {
    id: 'garden_exit',
    label: '← Farm Yard',
    x: 0, y: 200, w: 56, h: 220,
    walkToX: 80,
    visible: () => true,
    onInteract() {
      transitionTo('farmyard', 680, FLOOR_Y, -1);
    },
  },
  {
    id: 'gnome',
    label: 'Garden Gnome',
    x: 200, y: 295, w: 82, h: 82,
    walkToX: 260,
    visible: () => true,
    onInteract() {
      if (!state.flags.keyPickedUp) {
        if (state.selectedItem === 'stick') {
          showDialogue(DLG.gnome_with_stick, () => {
            addItem('key');
            state.flags.keyPickedUp = true;
            deselectItem();
          });
        } else {
          showDialogue(DLG.gnome_no_stick);
        }
      } else {
        showDialogue([{ who: 'Fetsson', text: 'The gnome guards his little corner proudly. The key is already in my pocket.' }]);
      }
    },
  },
  {
    id: 'veggies',
    label: 'Vegetable Patch',
    x: 60, y: 325, w: 420, h: 90,
    walkToX: 250,
    visible: () => true,
    onInteract() {
      showDialogue(DLG.veggies);
    },
  },
];

// ─────────────────────────────────────────────────────────────
// SCENE: KITCHEN
// ─────────────────────────────────────────────────────────────
const kitchenHotspots = [
  {
    id: 'pancakes',
    label: 'Pancakes!',
    x: 320, y: 240, w: 200, h: 60,
    walkToX: 400,
    visible: () => true,
    onInteract() {
      showDialogue([{ who: 'Fetsson', text: 'These apple pancakes are the most delicious thing I have ever eaten. Worth every step!' }]);
    },
  },
];

// ─────────────────────────────────────────────────────────────
// Registry — add new scenes here as the game grows
// ─────────────────────────────────────────────────────────────
const SCENE_HOTSPOTS = {
  barn:     barnHotspots,
  farmyard: farmyardHotspots,
  garden:   gardenHotspots,
  kitchen:  kitchenHotspots,
};

export function getHotspots() {
  return SCENE_HOTSPOTS[state.scene] || [];
}
