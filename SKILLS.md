# SKILLS.md — Expanding Fetsson och Pindus

This file maps the skills needed to work on each part of the game. Use it to figure out which files to touch and which APIs to learn for any given task.

---

## 1. Drawing scenes and props — `js/render/scenes/`

**Skill: HTML5 Canvas 2D API**

Every scene is drawn imperatively in a `draw*Scene(ctx)` function. The canvas is 800 × 500 px.

Key methods used:
| Method | Used for |
|---|---|
| `ctx.fillRect` / `ctx.strokeRect` | Solid rectangles (ground, walls, sky) |
| `ctx.fillStyle` / `ctx.strokeStyle` | Colours and gradients |
| `ctx.createLinearGradient` | Sky, wall and floor gradients |
| `ctx.arc` / `ctx.beginPath` / `ctx.fill` | Circles (sun, moon, wheels, barrels) |
| `ctx.ellipse` | Oval shapes (bales, lanterns) |
| `ctx.moveTo` / `ctx.lineTo` / `ctx.bezierCurveTo` | Irregular outlines |
| `ctx.drawImage` | Sprite sheets (if added in future) |
| `ctx.font` / `ctx.fillText` | In-canvas text labels |
| `ctx.save` / `ctx.restore` | Isolate transform/style changes |
| `ctx.translate` / `ctx.scale` | Flip or reposition sub-drawings |

Utility helpers available in `js/render/utils.js`:
- `gradientRect(ctx, x, y, w, h, stops)` — fills a rect with a vertical linear gradient
- `drawRoundRect(ctx, x, y, w, h, r, fill, stroke)` — fills/strokes a rounded rectangle

Shared props in `js/render/shared.js`:
- `drawCloud(ctx, x, y, scale)` — fluffy cloud
- `drawTree(ctx, x, y)` — simple deciduous tree

**When to use**: creating a new map, adding new background props, animating environment effects (e.g. flickering lantern uses `state.tick`).

---

## 2. Drawing characters — `js/render/characters.js`

**Skill: Canvas 2D API + sprite-style coordinate math**

Characters are drawn as collections of shapes (no image files). The `facing` parameter (`1` = right, `-1` = left) is handled with `ctx.scale(-1, 1)` around the character's centre. Walk frames are passed in as `walkFrame` (0–3).

Existing characters: `drawFetsson`, `drawPindus`, `drawMrsHen`.

To add a new character:
1. Add a `draw*` function to `characters.js` following the same signature pattern.
2. Call it from `js/engine/loop.js`'s `render()`, gated on `state.scene` if it only appears in one scene.

**When to use**: adding NPCs, enemies, or alternative player characters.

---

## 3. Game state and flags — `js/engine/state.js`

**Skill: JavaScript object mutation; understanding shared mutable state**

The `state` object is imported by every module that needs to read or write game data. Never reassign the object itself — only mutate its properties.

To track a new puzzle condition, add a boolean to `state.flags`:
```js
flags: {
  // …existing flags…
  shoveLBorrowed: false,
}
```

For more complex state (e.g. numeric counters, arrays of visited rooms), add a new top-level property to `state`.

**When to use**: new puzzles, multi-stage quests, per-scene visited flags, NPC relationship counters.

---

## 4. Hotspots and puzzles — `js/data/hotspots.js`

**Skill: JavaScript objects with methods; understanding the hotspot contract**

Each hotspot is a plain object with:
- Rectangular bounds (`x, y, w, h`) used for hit-testing
- `walkToX` — where the player walks before `onInteract` fires
- `visible()` — function returning a boolean; hide the hotspot when its item has been taken
- `onInteract()` — the puzzle/interaction logic; called with `this` = hotspot

Inside `onInteract`, compose logic using:
- `state.selectedItem` — check what item the player is using
- `state.flags.*` — check puzzle conditions
- `showDialogue(lines, callback)` — show speech, run callback when done
- `addItem(id)` / `removeItem(id)` / `deselectItem()` — modify inventory
- `transitionTo(scene, x, y, facing)` — move to another map

**When to use**: adding any interactive object — pickups, doors, NPCs, puzzles, exits.

---

## 5. Items — `js/data/items.js`

**Skill: Simple data entry**

Each item is `{ id, name, icon }`. The inventory bar renders them automatically from `state.inventory`.

**When to use**: any time a new collectible or usable object is introduced.

---

## 6. Dialogue — `js/data/dialogue.js`

**Skill: Simple data entry; understanding the dialogue queue**

`DLG` is a plain object. Each key maps to an array of `{ who, text }` lines. The dialogue engine in `js/engine/dialogue.js` feeds lines one at a time into the DOM `#dialogue-box`. The player clicks to advance.

`showDialogue(lines, onDone)`:
- `lines` — array from `DLG` or an inline array
- `onDone` — optional callback called after the last line is dismissed

**When to use**: story beats, NPC conversations, item inspection text, puzzle feedback.

---

## 7. Scene transitions — `js/engine/transitions.js`

**Skill: Understanding `transitionTo`**

`transitionTo(scene, startX, startY, facing)`:
- Sets `state.scene`, repositions player and Pindus, clears tooltip and pending actions.
- Triggers arrival dialogues automatically for `'kitchen'`, `'bridge'`, `'waterfall'`, and `'appleorchard'`.

To trigger scene-specific arrival dialogue for a new map, add a condition in `transitionTo`:
```js
if (scene === 'mymap' && !state.flags.mymapVisited) {
  state.flags.mymapVisited = true;
  setTimeout(() => showDialogue(DLG.mymap_arrival), 600);
}
```

**When to use**: any time a map exit hotspot needs to move the player to a new scene.

---

## 8. UI and CSS — `css/style.css` + `index.html`

**Skill: CSS; DOM manipulation**

The HTML shell provides three overlay elements rendered on top of the canvas:
- `#inventory-bar` — `#inventory-slots` is populated by `js/engine/inventory.js`
- `#dialogue-box` — shown/hidden by `js/engine/dialogue.js`; contains `#dialogue-speaker`, `#dialogue-text`, `#dialogue-hint`
- `#tooltip` — positioned and shown/hidden by `js/engine/input.js`

The CSS uses a dark-wood palette with warm amber text. The `#dialogue-hint` text uses a CSS blink animation (`@keyframes blink`).

**When to use**: restyling the UI, adding new HUD elements (e.g. a map button, a save/load menu), adjusting the canvas size (also update `W`/`H` in `js/engine/constants.js`).

---

## 9. Game loop — `js/engine/loop.js`

**Skill: `requestAnimationFrame` game loop pattern**

`loop(ctx)` calls `update()` then `render(ctx)` and reschedules itself. `update()` advances `state.tick`, moves the player toward `targetX`, and moves Pindus. `render(ctx)` calls scene + character draw functions.

**When to use**: adding per-frame update logic (physics, enemy movement, timer countdowns), new always-drawn HUD overlays.

---

## 10. Input handling — `js/engine/input.js`

**Skill: DOM events; Canvas coordinate mapping**

Mouse coordinates are scaled from CSS pixels to canvas pixels:
```js
mouse.x = (e.clientX - r.left) * (W / r.width);
```

Click priority:
1. Active minigame — route to `handleMinigameClick`, nothing else fires
2. Title screen — any click starts the game
3. Active dialogue — any click advances it
4. Inventory area (y > H−68) — ignored for world clicks
5. Hotspot — walk to `walkToX`, then fire `onInteract`
6. Ground (y between 360 and H−68) — walk to click position

**When to use**: adding keyboard shortcuts, right-click context menus, drag-and-drop inventory, touch support.

---

## Quick-reference: which file to edit for common tasks

| Task | File(s) |
|---|---|
| New item to pick up | `js/data/items.js`, `js/data/hotspots.js` |
| New line of dialogue | `js/data/dialogue.js` |
| New puzzle interaction | `js/data/hotspots.js`, `js/engine/state.js` (new flag) |
| New scene/map | `js/render/scenes/<name>.js`, `js/engine/loop.js`, `js/data/hotspots.js` |
| New character drawing | `js/render/characters.js`, `js/engine/loop.js` |
| Arrival dialogue for a scene | `js/engine/transitions.js` |
| Change canvas size | `js/engine/constants.js` (`W`, `H`) |
| New HUD element | `index.html`, `css/style.css`, optionally `js/engine/loop.js` |
| New per-frame behaviour | `js/engine/loop.js` (`update()`) |
| New input gesture | `js/engine/input.js` |
| New minigame | `js/minigames/<name>.js`, launch via `startMinigame()` in a hotspot |

---

## 11. Minigames — `js/engine/minigame.js` + `js/minigames/`

**Skill: Canvas 2D API; JavaScript state machines**

Minigames are full-screen interactive puzzles launched from a hotspot. While active they suspend normal player movement and route all clicks through `handleMinigameClick`.

### Existing minigames
| File | Scene | Puzzle |
|---|---|---|
| `js/minigames/counterweight.js` | Bridge | Stack 4 stone weights heaviest → lightest (star 4 > moon 3 > sun 2 > cloud 1). Wrong order = shake + reset. |
| `js/minigames/stonepath.js` | Waterfall/cave | Step across 4 columns of 3 stones. Each column has a carved symbol (Arch=mid, Peak=top, Bowl=bot, Diamond=mid). Wrong step = splash + reset. |
| `js/minigames/planklay.js` | Bridge floor | Match 3 planks (by width label in cm) to 3 gaps in the bridge deck. Click plank → select; click matching gap → snap. Wrong width = shake. All placed = success. |

> **See also**: `js/minigames/CLAUDE.md` for the full module interface spec and design conventions.

### Creating a new minigame
1. Create `js/minigames/myminigame.js`:
```js
import { endMinigame } from '../engine/minigame.js';

export const id = 'myminigame';

let _solved = false;

export function reset() { _solved = false; }

export function update() {
  if (_solved) endMinigame(true);
}

export function handleClick(x, y) {
  // process player input; set _solved = true when complete
}

export function render(ctx) {
  // draw full-screen overlay (800×500)
  // typically: dim background, draw puzzle elements, draw instructions
}
```

2. Launch it from a hotspot in `js/data/hotspots.js`:
```js
import { startMinigame } from '../engine/minigame.js';
import * as myMinigame from '../minigames/myminigame.js';

// inside onInteract():
startMinigame(myMinigame, () => {
  state.flags.myPuzzleSolved = true;
});
```

**When to use**: multi-step interactive puzzles that need their own input loop (stacking, pattern matching, timing challenges, etc.).
