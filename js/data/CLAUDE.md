# js/data — Game Content Guide

This directory holds **all game content** — items, story text, and interactive hotspots. Engine code lives in `js/engine/`; drawing code lives in `js/render/`. Keep content here and logic separation clean.

## Files

| File | Exports | Purpose |
|---|---|---|
| `items.js` | `ITEMS` | Registry of every collectable/usable item |
| `dialogue.js` | `DLG` | All story text, keyed by dialogue ID |
| `hotspots.js` | per-scene arrays + `HOTSPOTS` map | Interactive areas per scene + all puzzle logic |

---

## items.js — adding an item

Each entry in `ITEMS` is:
```js
myitem: {
  id:    'myitem',
  name:  'Display Name',
  icon:  '🪣',          // emoji shown in inventory bar
}
```

**Usage pattern**: hotspot logic calls `addItem('myitem')` / `removeItem('myitem')` / checks `state.inventory.includes('myitem')`.

---

## dialogue.js — adding dialogue

`DLG` is a plain object; each key maps to an array of line objects:

```js
export const DLG = {
  my_dialogue: [
    { who: 'Fetsson', text: 'Hello there.' },
    { who: 'Pindus',  text: 'Indeed.'      },
  ],
};
```

- `who` is the speaker name shown in the speech box header.
- Use `showDialogue(DLG.my_dialogue, optionalCallback)` from `js/engine/dialogue.js`.
- Prefer long, multi-line arrays over concatenated strings; the engine paginates them automatically.

---

## hotspots.js — structure

Each scene has its own array of hotspot objects, e.g. `barnHotspots`, `bridgeHotspots`. All arrays are combined into the exported `HOTSPOTS` map:

```js
export const HOTSPOTS = {
  barn:         barnHotspots,
  farmyard:     farmYardHotspots,
  garden:       gardenHotspots,
  kitchen:      kitchenHotspots,
  bridge:       bridgeHotspots,
  waterfall:    waterfallHotspots,
  appleorchard: appleOrchardHotspots,
};
```

### Hotspot object shape

```js
{
  id:        'unique_snake_case_id',
  label:     'Tooltip text',       // can be a getter for dynamic text
  x, y,                            // top-left of hit-rect (canvas px)
  w, h,                            // width / height of hit-rect
  walkToX:   120,                  // player walks here before interacting
  visible:   () => boolean,        // shown/active only when true
  onInteract() { /* puzzle logic */ },
}
```

### Hit-testing order

`_hotspotAt(cx, cy)` iterates the array **from last to first** (reverse), so entries at the end of the array take priority over earlier entries. Place blocking/overlay hotspots **after** the interactable ones they cover.

### Puzzle logic conventions

```js
// Typical pattern inside onInteract():
if (state.selectedItem === 'bucket') {
  showDialogue(DLG.well_fill, () => {
    state.flags.bucketFilled = true;
    removeItem('bucket');
    addItem('water_bucket');
    deselectItem();
  });
} else {
  showDialogue(DLG.well_hint);
}
```

- Always check `state.selectedItem` before `state.inventory.includes(...)`.
- Always call `deselectItem()` after consuming a selected item.
- Always call `removeItem()` for items that are used up.

### Launching a minigame from a hotspot

```js
import { startMinigame } from '../engine/minigame.js';
import * as myMinigame   from '../minigames/myminigame.js';

onInteract() {
  startMinigame(myMinigame, () => {
    state.flags.puzzleSolved = true;
    showDialogue(DLG.puzzle_done);
  });
}
```

### Adding a new scene's hotspots

1. Create `const mySceneHotspots = [ ... ]` in `hotspots.js`.
2. Add `myscene: mySceneHotspots` to the `HOTSPOTS` export.
3. The `input.js` engine automatically picks up the new scene's hotspots — no other wiring needed.

### Movement blocking via hotspots

To prevent the player walking into an area, add a hotspot with:
- `visible: () => !state.flags.puzzleSolved` (only active while blocked)
- `walkToX` set to the boundary x (so the player stops here)
- `onInteract` showing a dialogue explaining why they can't pass

Also add a movement clamp in `js/engine/loop.js` for hard physical blocking (see `js/engine/CLAUDE.md`).
