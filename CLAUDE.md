# CLAUDE.md — Agent Guide for Fetsson och Pindus

This file is written for AI coding agents (Claude, Copilot, etc.) working on this repository. It explains the project purpose, architecture, and concrete recipes for the most common expansion tasks.

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
│   └── loop.js       ← update() + render() called via requestAnimationFrame
└── render/
    ├── utils.js      ← gradientRect(), drawRoundRect()
    ├── shared.js     ← drawCloud(), drawTree()  — reused across scenes
    ├── characters.js ← drawFetsson(), drawPindus(), drawMrsHen()
    └── scenes/
        ├── title.js
        ├── barn.js
        ├── farmyard.js
        ├── garden.js
        └── kitchen.js
```

---

## Core data structures

### `state` (`js/engine/state.js`)
The single source of truth. Every module imports and mutates it in place.

| Field | Type | Purpose |
|---|---|---|
| `state.scene` | string | Active scene key (`'title'`, `'barn'`, `'farmyard'`, `'garden'`, `'kitchen'`) |
| `state.tick` | number | Frame counter, incremented each update |
| `state.player` | object | `{x, y, facing, walking, targetX, pendingAction}` |
| `state.pindus` | object | `{x, y, facing}` — companion, follows automatically |
| `state.inventory` | string[] | Array of item ids currently held |
| `state.selectedItem` | string\|null | Item id the player has clicked from the inventory bar |
| `state.flags` | object | Boolean puzzle/story flags (see below) |
| `state.dlg` | object | Dialogue subsystem: `{active, queue, onDone}` |
| `state.hovered` | string\|null | Id of the hotspot currently under the mouse |

**Flags** (all boolean, default `false`):
`stickPickedUp`, `bucketPickedUp`, `bucketFilled`, `gateOpen`, `keyPickedUp`, `doorOpen`, `gameFinished`, `farmhouseShown`

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
