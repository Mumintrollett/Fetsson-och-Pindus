# js/minigames — Minigame Guide

Each minigame is a **self-contained ES module** that plugs into the minigame manager (`js/engine/minigame.js`). Normal gameplay is suspended while a minigame is active; all mouse input is routed here.

## Existing minigames

| File | id | Scene | Puzzle |
|---|---|---|---|
| `counterweight.js` | `counterweight` | Bridge | Balance scale: place 8 stone weights (3,5,6,7,8,9,11,13) on two pans until both sides weigh 31 |
| `stonepath.js` | `stonepath` | Waterfall / Cave | Read carved symbols above columns to find safe row; one wrong step resets |
| `planklay.js` | `planklay` | Bridge floor | Select groups of smaller planks that sum to each gap's total width (9 planks, 3 gaps, unique solution) |
| `clockpuzzle.js` | `clockpuzzle` | Workshop | Set three analog clock dials to the correct hours [7, 12, 5]; clues spread across three notes in the workshop |

---

## Module interface (required exports)

Every minigame module **must** export these five names:

```js
export const id = 'my_minigame';  // unique string, used for debugging

export function reset() {
  // Called by startMinigame() before the minigame starts.
  // Initialise all module-level mutable state here.
}

export function update() {
  // Called every frame while the minigame is active (replaces normal update).
  // Advance timers, animations, etc.
  // Do NOT call endMinigame() from here directly; use successTimer pattern instead.
}

export function handleClick(canvasX, canvasY) {
  // Called on every mouse click while the minigame is active.
  // Process player input and call endMinigame(true) on success.
}

export function render(ctx) {
  // Called every frame while the minigame is active (on top of everything).
  // Draw the full minigame UI. Start with a dark overlay to dim the scene.
}
```

### Ending a minigame

```js
import { endMinigame } from '../engine/minigame.js';

// Inside handleClick or a success timer expiry inside update():
endMinigame(true);   // success — fires the onDone callback from startMinigame()
endMinigame(false);  // failure / cancel — no callback (not yet used)
```

**Do not** call `endMinigame` from `render()`.

---

## Launching a minigame

From a hotspot `onInteract` (in `js/data/hotspots.js`):

```js
import { startMinigame } from '../engine/minigame.js';
import * as myMinigame   from '../minigames/myminigame.js';

onInteract() {
  startMinigame(myMinigame, () => {
    // This runs after endMinigame(true):
    state.flags.myPuzzleSolved = true;
    showDialogue(DLG.puzzle_complete);
  });
}
```

---

## Recipe: adding a new minigame

1. Create `js/minigames/myminigame.js` exporting the five required functions above.
2. In `js/data/hotspots.js`:
   - Add `import * as myMinigame from '../minigames/myminigame.js';` at the top.
   - Call `startMinigame(myMinigame, onDone)` in the relevant hotspot's `onInteract`.
3. Add a row to the table at the top of this file.
4. Add a row to the minigame table in the root `CLAUDE.md`.

---

## Design conventions

- **Dark overlay first** — `render()` should start with a semi-transparent `fillRect` over the full canvas so the scene beneath is clearly dimmed.
- **Panel** — draw a rounded rect panel for the minigame UI on top of the overlay.
- **Shake on wrong** — use a shake counter (`shakeTimer > 0 ? Math.sin(t*1.5)*5 : 0`) for visual error feedback, never a hard reset without animation.
- **Success timer** — on all-correct, set `successTimer = 80` and show a flash; call `endMinigame(true)` only after the timer expires (inside `update()`), so the player sees the "success" state.
- **Width/height** — design for 800×500 (W × H from `js/engine/constants.js`).
- **No imports of scene renderers** — minigames are independent; import only from `js/engine/` and `js/render/utils.js`.
