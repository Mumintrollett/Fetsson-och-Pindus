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
import { startMinigame } from '../engine/minigame.js';
import * as counterweightMinigame from '../minigames/counterweight.js';
import * as stonepathMinigame     from '../minigames/stonepath.js';
import * as plankMinigame         from '../minigames/planklay.js';

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
    id: 'toolbox',
    label: 'Toolbox',
    x: 535, y: 348, w: 88, h: 56,
    walkToX: 560,
    visible: () => state.flags.appleQuestGiven,
    onInteract() {
      if (state.flags.toolboxOpen) {
        showDialogue([{ who: 'Fetsson', text: 'I already took the hammer and rope.' }]);
      } else if (!state.flags.barnCodeEntered) {
        showDialogue(DLG.toolbox_locked, () => {
          // Prompt player with code via dialogue — correct answer is "7"
          const code = window.prompt('Enter the 3-digit code (hint: Mrs. Hen told you the secret):');
          if (code && code.trim() === '7') {
            state.flags.barnCodeEntered = true;
            state.flags.toolboxOpen = true;
            showDialogue(DLG.toolbox_open, () => {
              addItem('hammer');
              addItem('rope');
            });
          } else {
            showDialogue([{ who: 'Fetsson', text: 'Hmm, that doesn\'t seem right...' }]);
          }
        });
      } else {
        state.flags.toolboxOpen = true;
        showDialogue(DLG.toolbox_open, () => {
          addItem('hammer');
          addItem('rope');
        });
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
    id: 'north_exit',
    label: 'North Path → Bridge',
    x: 355, y: 0, w: 110, h: 205,
    walkToX: 410,
    visible: () => state.flags.appleQuestGiven,
    onInteract() {
      transitionTo('bridge', 120, FLOOR_Y, 1);
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
        showDialogue([{ who: 'Fetsson', text: 'The door is locked. I have a key somewhere…' }]);
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
        showDialogue([{ who: 'Fetsson', text: 'The well water looks cold. And I already have a bucket.' }, { who: 'Pindus', text: 'Mm.' }]);
      } else if (state.flags.bucketFilled) {
        showDialogue([{ who: 'Pindus', text: 'The well looks patient, as wells tend to be.' }]);
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
        showDialogue([{ who: 'Fetsson', text: 'Those hinges have not moved in years.' }, { who: 'Pindus', text: 'Iron\'s greatest weakness tends to be patience and something wet.' }]);
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
    id: 'kitchen_exit',
    label: '← Farm Yard',
    x: 0, y: 250, w: 80, h: 165,
    walkToX: 80,
    visible: () => true,
    onInteract() {
      transitionTo('farmyard', 680, FLOOR_Y, -1);
    },
  },
  {
    id: 'pancakes',
    label: 'Pancakes!',
    x: 320, y: 240, w: 200, h: 60,
    walkToX: 400,
    visible: () => !state.flags.pancakesEaten,
    onInteract() {
      if (state.selectedItem === 'stick') {
        showDialogue(DLG.pancake_push, () => {
          state.flags.pancakesEaten = true;
          deselectItem();
          setTimeout(() => showDialogue(DLG.apple_quest, () => {
            addItem('basket');
            state.flags.appleQuestGiven = true;
          }), 300);
        });
      } else {
        showDialogue([{ who: 'Fetsson', text: 'These apple pancakes are the most delicious thing I have ever eaten. Worth every step!' }]);
      }
    },
  },
  {
    id: 'pancakes_eaten',
    label: 'Empty Plate',
    x: 320, y: 240, w: 200, h: 60,
    walkToX: 400,
    visible: () => state.flags.pancakesEaten,
    onInteract() {
      showDialogue([{ who: 'Fetsson', text: 'All gone — the floor pancakes look sad but they were delicious.' }]);
    },
  },
];

// ─────────────────────────────────────────────────────────────
// SCENE: BRIDGE
// ─────────────────────────────────────────────────────────────
const bridgeHotspots = [
  {
    id: 'bridge_return',
    label: '← Farm Yard',
    x: 0, y: 350, w: 90, h: 90,
    walkToX: 80,
    visible: () => true,
    onInteract() {
      transitionTo('farmyard', 410, FLOOR_Y, 1);
    },
  },
  {
    id: 'woodpile',
    label: 'Woodpile',
    x: 10, y: 342, w: 118, h: 62,
    walkToX: 80,
    visible: () => !state.flags.planksPickedUp,
    onInteract() {
      showDialogue(DLG.bridge_planks_pickup, () => {
        addItem('planks');
        state.flags.planksPickedUp = true;
      });
    },
  },
  // ── Blocking hotspot: gap in broken floor ────────────────────
  // Prevents clicking past the first gap to walk to the far side before repairs
  {
    id: 'bridge_gap_block',
    label: 'Broken Bridge (impassable!)',
    x: 195, y: 375, w: 475, h: 60,
    walkToX: 165,
    visible: () => !state.flags.bridgeFloorFixed,
    onInteract() {
      showDialogue([
        { who: 'Fetsson', text: 'The gaps are too wide — I\'d fall straight into the ravine.' },
        { who: 'Pindus',  text: 'Inadvisable. Even by my standards.' },
      ]);
    },
  },
  {
    id: 'bridge_floor',
    get label() {
      return state.flags.bridgeFloorFixed ? 'Bridge Floor (Fixed)' : 'Broken Bridge Floor';
    },
    x: 130, y: 375, w: 540, h: 45,
    walkToX: 165,
    visible: () => !state.flags.bridgeFloorFixed,
    onInteract() {
      if (!state.flags.planksPickedUp) {
        showDialogue(DLG.bridge_no_tools);
      } else if (!state.inventory.includes('hammer')) {
        showDialogue(DLG.bridge_need_hammer);
      } else {
        // Launch the plank-laying minigame
        showDialogue([
          { who: 'Fetsson', text: 'Three gaps. I have planks of different sizes.' },
          { who: 'Pindus',  text: 'Boards go in holes. This is well within your skill set.' },
        ], () => {
          startMinigame(plankMinigame, () => {
            state.flags.bridgeFloorFixed = true;
            removeItem('planks');
            showDialogue(DLG.bridge_fix_floor);
          });
        });
      }
    },
  },
  {
    id: 'bridge_railing',
    get label() {
      return state.flags.bridgeRailingFixed ? 'Bridge Railing (Secured)' : 'Fraying Rope Railing';
    },
    x: 110, y: 344, w: 560, h: 38,
    walkToX: 160,
    visible: () => state.flags.bridgeFloorFixed && !state.flags.bridgeRailingFixed,
    onInteract() {
      if (state.flags.bridgeRailingFixed) {
        showDialogue([{ who: 'Fetsson', text: 'The railing is already secure.' }]);
      } else if (state.selectedItem === 'rope') {
        showDialogue(DLG.bridge_fix_railing, () => {
          state.flags.bridgeRailingFixed = true;
          deselectItem();
          removeItem('rope');
        });
      } else if (state.inventory.includes('rope')) {
        showDialogue([{ who: 'Fetsson', text: 'That railing is barely a suggestion at this point.' }, { who: 'Pindus', text: 'And I have a suggestion for what to do about it.' }]);
      } else {
        showDialogue(DLG.bridge_need_rope);
      }
    },
  },
  // ── Blocking hotspot: locked gate ───────────────────────────
  {
    id: 'gate_block',
    label: 'Locked Gate',
    x: 350, y: 280, w: 90, h: 140,
    walkToX: 340,
    visible: () => state.flags.bridgeFloorFixed && state.flags.bridgeRailingFixed && !state.flags.bridgeGateOpen,
    onInteract() {
      showDialogue([
        { who: 'Fetsson', text: 'The gate is padlocked. The chain runs up to that mechanism on the cliff.' },
        { who: 'Pindus',  text: 'Chains usually go slack when something heavy descends. That\'s gravity being sociable.' },
      ]);
    },
  },
  {
    id: 'gate_wheel',
    label: 'Counterweight Mechanism',
    x: 178, y: 250, w: 80, h: 160,
    walkToX: 220,
    visible: () => state.flags.bridgeFloorFixed && state.flags.bridgeRailingFixed && !state.flags.bridgeGateOpen,
    onInteract() {
      showDialogue(DLG.bridge_mechanism_hint, () => {
        startMinigame(counterweightMinigame, () => {
          state.flags.bridgeGateOpen = true;
          showDialogue(DLG.bridge_repaired);
        });
      });
    },
  },
  {
    id: 'bridge_cross',
    label: 'Cross the Bridge →',
    x: 670, y: 300, w: 130, h: 140,
    walkToX: 660,
    visible: () => state.flags.bridgeGateOpen,
    onInteract() {
      state.flags.bridgeCrossed = true;
      transitionTo('waterfall', 80, FLOOR_Y, 1);
    },
  },
];

// ─────────────────────────────────────────────────────────────
// SCENE: WATERFALL
// ─────────────────────────────────────────────────────────────
const waterfallHotspots = [
  {
    id: 'waterfallReturn',
    label: '← Bridge',
    x: 0, y: 240, w: 90, h: 220,
    walkToX: 80,
    visible: () => true,
    onInteract() {
      transitionTo('bridge', 700, FLOOR_Y, -1);
    },
  },
  {
    id: 'torchPickup',
    label: 'Unlit Torch',
    x: 490, y: 295, w: 60, h: 80,
    walkToX: 520,
    visible: () => !state.flags.torchPickedUp,
    onInteract() {
      showDialogue(DLG.torch_pickup, () => {
        addItem('torch');
        state.flags.torchPickedUp = true;
      });
    },
  },
  {
    id: 'campfire',
    label: 'Campfire',
    x: 130, y: 358, w: 108, h: 68,
    walkToX: 210,
    visible: () => true,
    onInteract() {
      if (state.selectedItem === 'torch' && !state.flags.torchLit) {
        showDialogue(DLG.campfire_light, () => {
          removeItem('torch');
          addItem('litTorch');
          state.flags.torchLit = true;
          deselectItem();
        });
      } else if (state.flags.torchLit) {
        showDialogue([{ who: 'Fetsson', text: 'The embers are still glowing. I have everything I need from here.' }]);
      } else if (state.flags.torchPickedUp) {
        showDialogue([{ who: 'Fetsson', text: 'The embers are still warm. And I have a torch.' }, { who: 'Pindus', text: 'Mm.' }]);
      } else {
        showDialogue(DLG.campfire_no_torch);
      }
    },
  },
  {
    id: 'caveEntrance',
    label: 'Cave Entrance',
    x: 585, y: 268, w: 150, h: 160,
    walkToX: 620,
    visible: () => true,
    onInteract() {
      if (!state.flags.torchLit) {
        showDialogue(DLG.cave_dark);
      } else if (state.flags.caveCrossed) {
        showDialogue([{ who: 'Pindus', text: 'We already crossed that cave. Lovely acoustics in there, but let\'s not go back.' }]);
      } else {
        showDialogue(DLG.stepping_stone_intro, () => {
          startMinigame(stonepathMinigame, () => {
            state.flags.caveCrossed = true;
            showDialogue(DLG.waterfall_crossed, () => {
              transitionTo('appleorchard', 80, FLOOR_Y, 1);
            });
          });
        });
      }
    },
  },
];

// ─────────────────────────────────────────────────────────────
// SCENE: APPLE ORCHARD
// ─────────────────────────────────────────────────────────────
const appleOrchardHotspots = [
  {
    id: 'orchard_return',
    label: '← Waterfall',
    x: 0, y: 200, w: 60, h: 240,
    walkToX: 80,
    visible: () => !state.flags.applesCollected,
    onInteract() {
      transitionTo('waterfall', 650, FLOOR_Y, -1);
    },
  },
  {
    id: 'apple_tree',
    get label() {
      return state.flags.applesCollected ? 'Apple Tree (Harvested)' : 'Apple Tree';
    },
    x: 180, y: 80, w: 500, h: 330,
    walkToX: 400,
    visible: () => true,
    onInteract() {
      if (state.flags.applesCollected) {
        showDialogue([{ who: 'Fetsson', text: 'The branches are bare now. Time to bring these apples home!' }]);
      } else if (!state.flags.appleQuestGiven) {
        showDialogue([{ who: 'Pindus', text: 'Beautiful apples! But we have no reason to pick them yet.' }]);
      } else if (state.selectedItem === 'basket') {
        showDialogue(DLG.apple_pickup, () => {
          state.flags.applesCollected = true;
          removeItem('basket');
          addItem('apples');
          deselectItem();
          showDialogue(DLG.rush_home);
        });
      } else {
        showDialogue(DLG.apple_pickup_no_basket);
      }
    },
  },
  {
    id: 'orchard_exit_home',
    label: '← Go Home',
    x: 0, y: 200, w: 60, h: 240,
    walkToX: 80,
    visible: () => state.flags.applesCollected,
    onInteract() {
      // Quick path home: waterfall → bridge → farmyard → kitchen
      transitionTo('farmyard', 230, FLOOR_Y, 1);
      setTimeout(() => transitionTo('kitchen', 400, FLOOR_Y, 1), 400);
    },
  },
];

// ─────────────────────────────────────────────────────────────
// Registry — add new scenes here as the game grows
// ─────────────────────────────────────────────────────────────
const SCENE_HOTSPOTS = {
  barn:        barnHotspots,
  farmyard:    farmyardHotspots,
  garden:      gardenHotspots,
  kitchen:     kitchenHotspots,
  bridge:      bridgeHotspots,
  waterfall:   waterfallHotspots,
  appleorchard: appleOrchardHotspots,
};

export function getHotspots() {
  return SCENE_HOTSPOTS[state.scene] || [];
}
