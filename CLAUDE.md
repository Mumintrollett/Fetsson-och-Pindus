# CLAUDE.md — Agent Guide for Fetsson och Pindus

This file is written for AI coding agents (Claude, Copilot, etc.) working on this repository. It explains the project purpose, architecture, and concrete recipes for the most common expansion tasks.

**Component-level guides** (more detail on specific subsystems):
- `js/engine/CLAUDE.md` — engine module APIs, state object shape, movement clamping
- `js/data/CLAUDE.md` — item/dialogue/hotspot schemas, puzzle conventions
- `js/render/CLAUDE.md` — drawing functions, scene renderer interface, coordinate conventions
- `js/minigames/CLAUDE.md` — minigame module interface, design conventions, recipe

---

## What this project is

**Fetsson och Pindus** is a browser-based, point-and-click farm adventure game.  
Stack: pure vanilla JS (ES modules) + HTML5 Canvas + CSS. No build step, no bundler, no dependencies — open `index.html` directly in a browser.

Main characters: **Fetsson** (a pig) and **Pindus** (a stick insect companion). The player clicks to move Fetsson, interacts with hotspots, collects inventory items and solves puzzles to reach Mrs. Hen's kitchen for pancakes.

---

## Repository layout

```
index.html            ← single HTML shell; loads js/main.js as a module
css/style.css         ← dark-wood UI theme (inventory bar, dialogue box)
js/
├── main.js           ← entry point: wires canvas, input, inventory, game loop
├── data/
│   ├── items.js      ← ITEMS registry  — add new items here
│   ├── dialogue.js   ← DLG registry    — all story text goes here
│   └── hotspots.js   ← per-scene hotspot arrays + all puzzle/interaction logic
├── engine/
│   ├── constants.js  ← W, H, FLOOR_Y, WALK_SPEED
│   ├── state.js      ← single mutable `state` object (scene, player, flags, dlg…)
│   ├── dialogue.js   ← showDialogue(), advanceDialogue()
│   ├── inventory.js  ← addItem(), removeItem(), deselectItem(), renderInventory()
│   ├── transitions.js← transitionTo(scene, startX, startY, facing)
│   ├── input.js      ← mousemove + click handlers, hotspot hit-testing
│   ├── loop.js       ← update() + render() called via requestAnimationFrame
│   └── minigame.js   ← minigame manager (startMinigame, endMinigame, etc.)
├── minigames/
│   ├── counterweight.js ← stone-stacking puzzle (Bridge)
│   ├── stonepath.js     ← stepping-stone cave puzzle (Waterfall)
│   └── planklay.js      ← plank width-matching puzzle (Bridge floor)
└── render/
    ├── utils.js      ← gradientRect(), drawRoundRect()
    ├── shared.js     ← drawCloud(), drawTree()  — reused across scenes
    ├── characters.js ← drawFetsson(), drawPindus(), drawMrsHen()
    └── scenes/
        ├── title.js
        ├── barn.js
        ├── farmyard.js
        ├── garden.js
        ├── kitchen.js
        ├── bridge.js
        ├── waterfall.js
        └── appleorchard.js
```

---

## Core data structures

### `state` (`js/engine/state.js`)
The single source of truth. Every module imports and mutates it in place.

| Field | Type | Purpose |
|---|---|---|
| `state.scene` | string | Active scene key (`'title'`, `'barn'`, `'farmyard'`, `'garden'`, `'kitchen'`, `'bridge'`, `'waterfall'`, `'appleorchard'`) |
| `state.tick` | number | Frame counter, incremented each update |
| `state.player` | object | `{x, y, facing, walking, targetX, pendingAction}` |
| `state.pindus` | object | `{x, y, facing}` — companion, follows automatically |
| `state.inventory` | string[] | Array of item ids currently held |
| `state.selectedItem` | string\|null | Item id the player has clicked from the inventory bar |
| `state.flags` | object | Boolean puzzle/story flags (see below) |
| `state.dlg` | object | Dialogue subsystem: `{active, queue, onDone}` |
| `state.hovered` | string\|null | Id of the hotspot currently under the mouse |

| `state.minigame` | object | `{active, id}` — managed by `js/engine/minigame.js` |

**Flags** (all boolean, default `false`):

*Original arc:*
`stickPickedUp`, `bucketPickedUp`, `bucketFilled`, `gateOpen`, `keyPickedUp`, `doorOpen`, `gameFinished`, `farmhouseShown`

*Apple-quest arc:*
`pancakesEaten`, `appleQuestGiven`, `toolboxOpen`, `barnCodeEntered`,
`planksPickedUp`, `bridgeVisited`, `bridgeFloorFixed`, `bridgeRailingFixed`, `bridgeGateOpen`, `bridgeCrossed`,
`torchPickedUp`, `torchLit`, `waterfallVisited`, `caveCrossed`,
`orchardVisited`, `applesCollected`, `gameComplete`

### Item definition (`js/data/items.js`)
```js
{ id: 'key', name: 'Key', icon: '🗝️' }
```

### Hotspot definition (`js/data/hotspots.js`)
```js
{
  id: 'hay_bale',          // unique string
  label: 'Hay Bale',       // tooltip text; can be a getter for dynamic labels
  x: 40, y: 330,           // top-left canvas position
  w: 160, h: 80,           // size
  walkToX: 130,            // player walks to this x before onInteract fires
  visible: () => true,     // return false to hide this hotspot
  onInteract() { … }       // called when player arrives and clicks
}
```

---

## How to add new content

### Add a new item
Edit `js/data/items.js` — append one entry to `ITEMS`:
```js
export const ITEMS = {
  // …existing items…
  shovel: { id: 'shovel', name: 'Shovel', icon: '🪻' },
};
```
Then call `addItem('shovel')` from any hotspot's `onInteract`. The inventory bar picks it up automatically.

### Add new dialogue
Edit `js/data/dialogue.js` — append a key to `DLG`:
```js
export const DLG = {
  // …existing lines…
  found_shovel: [
    { who: 'Fetsson', text: 'A shovel! This could come in handy.' },
  ],
};
```
Then call `showDialogue(DLG.found_shovel)` from a hotspot or anywhere you import `showDialogue`.  
Optional completion callback: `showDialogue(DLG.found_shovel, () => { /* runs after last line */ })`.

### Add a new scene (map)

1. **Create the renderer** — `js/render/scenes/mymap.js`:
```js
import { W, H } from '../../engine/constants.js';

export function drawMyMapScene(ctx) {
  // Draw background, props, etc. using Canvas 2D API.
  // W = 800, H = 500. Characters are drawn on top by loop.js.
}
```

2. **Register the renderer** in `js/engine/loop.js`:
```js
import { drawMyMapScene } from '../render/scenes/mymap.js';
// …
case 'mymap': drawMyMapScene(ctx); break;
```
Also add a display name to `SCENE_NAMES` in the same file:
```js
const SCENE_NAMES = { …, mymap: 'The New Place' };
```

3. **Add hotspots** — append a `const mymapHotspots = [ … ]` block and register it in the `SCENE_HOTSPOTS` map at the bottom of `js/data/hotspots.js`:
```js
const SCENE_HOTSPOTS = { …, mymap: mymapHotspots };
```

4. **Add a transition** — from another scene's hotspot, call:
```js
transitionTo('mymap', startX, FLOOR_Y, facing);
```

### Add a puzzle

Puzzles live entirely inside `onInteract` functions in `js/data/hotspots.js`. The pattern is:

```js
onInteract() {
  if (state.selectedItem === 'shovel') {
    showDialogue(DLG.dig_hole, () => {
      state.flags.holeDug = true;
      removeItem('shovel');
      deselectItem();
    });
  } else {
    showDialogue(DLG.dirt_mound);   // hint dialogue
  }
}
```

Add the corresponding flag to `state.flags` in `js/engine/state.js`.

### Add a new character

Add a `drawMyCharacter(ctx, x, y)` function to `js/render/characters.js`.  
Call it from `js/engine/loop.js`'s `render()` function, conditioned on the scene if necessary:
```js
if (state.scene === 'mymap') drawMyCharacter(ctx, 400, state.player.y - 20);
```

---

## Engine rules

- **No build step.** All files are native ES modules loaded by the browser. `import` paths must include the `.js` extension.
- **Single mutable state.** Never create a second copy of `state`. Import and mutate the same object everywhere.
- **Character drawing is always done by `loop.js`.** Scene renderers draw only backgrounds and props; `drawFetsson` / `drawPindus` are called by `loop.js` on every frame.
- **`transitionTo` clears tooltip and resets player/Pindus position.** Always use it instead of setting `state.scene` directly.
- **`FLOOR_Y` (400)** is the y-coordinate where character feet touch the ground. Pass `FLOOR_Y` for `y` in `transitionTo` calls and initial positions.
- **`state.tick`** increments once per frame (~60/s). Use `Math.floor(state.tick / N) % M` for N-frame step animations.

---

## Common patterns

**Dynamic tooltip label** (changes based on state):
```js
get label() { return state.flags.doorOpen ? 'Enter' : 'Door (Locked)'; }
```

**One-time pickup hotspot** (disappears after use):
```js
visible: () => !state.flags.myItemPickedUp,
```

**Arrival dialogue on scene entry**: call `showDialogue` inside a `setTimeout` in `transitionTo`, or trigger it from a hotspot's `onInteract`.

**Wait for dialogue to finish before doing something**:
```js
showDialogue(DLG.some_lines, () => {
  // This runs after the player clicks through the last line.
  transitionTo('nextscene', 100, FLOOR_Y, 1);
});
```

---

## Minigame system

Minigames are self-contained interactive puzzles that temporarily take over the screen.

### Files
| File | Role |
|---|---|
| `js/engine/minigame.js` | Manager: `startMinigame(module, onDone)`, `endMinigame(success)`, `isMinigameActive()`, `updateMinigame()`, `renderMinigame(ctx)`, `handleMinigameClick(x, y)` |
| `js/minigames/counterweight.js` | Counterweight stone-stacking puzzle (Bridge scene) |
| `js/minigames/stonepath.js` | Cave stepping-stone puzzle (Waterfall scene) |
| `js/minigames/planklay.js` | Plank width-matching puzzle (Bridge floor repair) |

### Each minigame module must export
```js
export const id = 'myminigame';
export function reset() { /* initialise state */ }
export function update() { /* per-frame logic, call endMinigame(true) on completion */ }
export function handleClick(x, y) { /* process click */ }
export function render(ctx) { /* draw the full-screen overlay */ }
```

### Starting a minigame from a hotspot
```js
import { startMinigame } from '../engine/minigame.js';
import * as myMinigame from '../minigames/myminigame.js';

// Inside onInteract():
startMinigame(myMinigame, () => {
  // Runs after endMinigame(true) is called inside the minigame
  state.flags.puzzleSolved = true;
});
```

### Engine contract
- While `state.minigame.active` is `true`, `loop.js` calls `updateMinigame()` instead of the normal player-movement update, and renders the minigame overlay on top of the scene.
- `input.js` routes all clicks to `handleMinigameClick()` when a minigame is active.
- Call `endMinigame(true)` on success to fire `onDone` and return to normal play.
- Call `endMinigame(false)` to cancel without reward (e.g., player skips).

---

## Game arc (current)

```
Title → Barn → Farm Yard → Garden → Kitchen
                                   ↓ (pancake push + apple quest)
                     Farm Yard → Bridge → Waterfall → Apple Orchard
                                                      ↓ (apples collected)
                                               Farm Yard → Kitchen (game complete)
```

**Puzzles in order of difficulty:**
1. Hay bale (trivial pick-up)
2. Rusty gate — bucket → well → water on gate
3. Hidden key — stick on garden gnome
4. Bridge floor — **Plank Minigame**: pick up planks from woodpile + get hammer from barn toolbox (code = 7); match 3 planks by width label to 3 gaps in the deck
5. Bridge railing — rope (barn toolbox) + select from inventory → use on railing
6. Counterweight gate — stack 4 stones heaviest-to-lightest (star 4 > moon 3 > sun 2 > cloud 1)
7. Cave stepping stones — read symbol above each column; Arch=mid, Peak=top, Bowl=bottom, Diamond=mid
8. Apple harvest — select basket, use on trees
