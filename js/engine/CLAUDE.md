# js/engine — Engine Module Guide

This directory contains the core runtime engine. Every module is a pure ES module (no build step). Import with explicit `.js` extensions.

## Module overview

| File | Exports | Purpose |
|---|---|---|
| `constants.js` | `W`, `H`, `FLOOR_Y`, `WALK_SPEED` | Canvas dimensions + tuning knobs |
| `state.js` | `state`, `mouse` | Single mutable game state object; `mouse` is cursor tracking |
| `dialogue.js` | `showDialogue(lines, cb?)` | Queued speech-box system |
| `inventory.js` | `addItem`, `removeItem`, `deselectItem`, `renderInventory` | Item bar management |
| `transitions.js` | `transitionTo(scene, x, y, facing?)` | Scene switch + arrival dialogue |
| `input.js` | `initInput(canvas)` | Wires mouse listeners; minigame-aware |
| `loop.js` | `update()`, `render(ctx)`, `loop(ctx)` | Main game loop |
| `minigame.js` | `startMinigame(mod, onDone)`, `endMinigame(success)`, `isMinigameActive()`, `updateMinigame()`, `renderMinigame(ctx)` | Suspends normal play; routes all input to active minigame |

---

## state object shape

```js
state = {
  scene:        'title',       // current scene key
  tick:         0,             // incremented every frame
  player:       { x, y, facing, walking, targetX, pendingAction },
  pindus:       { x, y, facing },
  dialogue:     { active, lines[], index, onDone },
  inventory:    [],            // array of item-id strings  e.g. ['stick', 'bucket']
  selectedItem: null,          // currently held/selected item id or null
  hovered:      null,          // hotspot id under the cursor, or null
  flags: {
    // Tutorial arc
    stickFound, bucketFilled, gateOpen, houseDoorOpen, gnomeKeyFound,
    // Kitchen / apple-quest arc
    pancakeEaten, appleQuestGiven, appleQuestDone,
    // Barn
    barnCodeEntered, toolboxOpen,
    // Bridge
    planksPickedUp, bridgeFloorFixed, bridgeRailingFixed, bridgeGateOpen, bridgeCrossed,
    // Waterfall / cave
    torchPickedUp, torchLit, caveCrossed,
    // Apple orchard
    applesHarvested,
  }
}
```

> **Rule:** Never add naked globals for game state. Every new flag goes into `state.flags`.

---

## Core engine rules

### Dialogue
```js
// Import from this file only:
import { showDialogue } from './dialogue.js';

showDialogue([
  { who: 'Fetsson', text: 'Hello.' },
  { who: 'Pindus',  text: 'Indeed.' },
], () => { /* optional callback fired after last line */ });

// Or pass a key from js/data/dialogue.js:
import { DLG } from '../data/dialogue.js';
showDialogue(DLG.barn_intro);
```
Click anywhere advances the queue; the callback fires after the final line.

### Inventory
```js
import { addItem, removeItem, deselectItem } from './inventory.js';
addItem('bucket');      // adds to state.inventory + renders slot
removeItem('rope');     // removes from state.inventory; deselects if selected
deselectItem();         // clears state.selectedItem
```

### Transitions
```js
import { transitionTo } from './transitions.js';
transitionTo('garden', 120, FLOOR_Y, 1);
// args: sceneKey, arrivalX, arrivalY, facing (1=right, -1=left)
```
`transitionTo` clears `state.hovered` (prevents stale tooltips), clears any pending action, and triggers the arrival dialogue for that scene on first visit.

### Minigames
```js
import { startMinigame }  from './minigame.js';
import * as myMinigame    from '../minigames/myminigame.js';

startMinigame(myMinigame, () => {
  // onDone — called after endMinigame(true) inside the minigame
  state.flags.somePuzzleSolved = true;
});
```
See `js/minigames/CLAUDE.md` for the module interface spec.

---

## loop.js update() — movement clamping

After the standard walk-step code, scene-specific movement clamps are applied. Currently bridge has two clamps:

```js
if (state.scene === 'bridge') {
  if (!state.flags.bridgeFloorFixed && p.x > 185) { ... clamp ... }
  else if (!state.flags.bridgeGateOpen && p.x > 640) { ... clamp ... }
}
```

**To add a new clamp for another scene**, add a similar `if (state.scene === 'yourscene')` block immediately after the bridge block.

---

## Adding a new flag

1. Add it to the `flags` object in `state.js` with a default `false`.
2. Read/write it as `state.flags.myNewFlag` everywhere.
3. Document it in the table above (in this file) and in the root `CLAUDE.md`.
