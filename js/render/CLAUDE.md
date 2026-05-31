# js/render — Rendering Guide

All drawing code lives here. No game logic — only Canvas 2D API calls. Engine state is read-only from render code; never write to `state` from render modules.

## Directory structure

```
render/
├── utils.js          — low-level canvas helpers
├── shared.js         — reusable environment elements (clouds, trees)
├── characters.js     — character draw functions (Fetsson, Pindus, Mrs Hen)
└── scenes/           — one file per scene
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

## utils.js

```js
import { gradientRect, drawRoundRect } from './utils.js';

// Filled rect with a vertical linear gradient
gradientRect(ctx, x, y, w, h, topColor, bottomColor);

// Rounded rectangle (fill + optional stroke)
drawRoundRect(ctx, x, y, w, h, radius, fillColor, strokeColor?, lineWidth?);
```

---

## shared.js

```js
import { drawCloud, drawTree } from './shared.js';

drawCloud(ctx, cx, cy, scale?);   // puffy white cloud centred at (cx, cy)
drawTree (ctx, x, groundY);       // deciduous tree, trunk base at (x, groundY)
```

Use these in scene renderers to keep backgrounds consistent.

---

## characters.js

```js
import { drawFetsson, drawPindus, drawMrsHen } from './characters.js';

// Fetsson (protagonist) — drawn bottom-centre at (x, y)
drawFetsson(ctx, x, y, facing, walkFrame);
//   facing:    1 = right, -1 = left
//   walkFrame: 0 = still, 1-3 = walking cycle (floor(tick/8) % 4)

// Pindus (companion dog) — drawn bottom-centre at (x, y)
drawPindus(ctx, x, y, facing);

// Mrs Hen — drawn at (x, y); no facing/walk args
drawMrsHen(ctx, x, y);
```

**To add a new character**: add a `drawMyChar(ctx, x, y, ...)` function in `characters.js`. Call it from `loop.js` render(), keyed by `state.scene` just like `drawMrsHen`.

---

## Scene renderers

Each scene file exports a single `draw<Name>Scene(ctx)` function. It is called every frame from `loop.js`.

### Minimal scene template

```js
import { W, H, FLOOR_Y }    from '../../engine/constants.js';
import { state }             from '../../engine/state.js';
import { gradientRect }      from '../utils.js';
import { drawCloud, drawTree } from '../shared.js';

export function drawMyScene(ctx) {
  // Sky
  gradientRect(ctx, 0, 0, W, 280, '#87ceeb', '#c8e8f8');
  // Ground
  gradientRect(ctx, 0, FLOOR_Y - 14, W, H - FLOOR_Y + 14, '#7aaa50', '#4a7a30');

  // Scene elements (static)
  drawTree(ctx, 150, FLOOR_Y);
  drawCloud(ctx, 200, 80);

  // Conditional elements (state-dependent)
  if (!state.flags.puzzleSolved) {
    // draw locked version
  }
}
```

### Highlight helper pattern (bridge, etc.)

```js
function _highlight(ctx, active, x, y, w, h) {
  if (!active) return;
  ctx.save();
  ctx.strokeStyle = 'rgba(255,220,60,0.85)';
  ctx.lineWidth   = 2;
  ctx.setLineDash([6, 4]);
  ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
  ctx.restore();
}
```

Call `_highlight` near the end of the scene draw function, using the **same x/y/w/h** values as the corresponding hotspot in `js/data/hotspots.js`.

### Registering a new scene

1. Create `js/render/scenes/myscene.js`.
2. Import and add a `case 'myscene':` in `loop.js` render switch.
3. Add hotspots in `js/data/hotspots.js` and register in the `HOTSPOTS` map.
4. Trigger with `transitionTo('myscene', arrivalX, FLOOR_Y, facing)`.

---

## Canvas coordinate conventions

| Symbol | Value | Meaning |
|---|---|---|
| `W` | 800 | Canvas width |
| `H` | 500 | Canvas height |
| `FLOOR_Y` | 400 | Ground-level y (player feet) |

- Characters are drawn **bottom-centre** — the supplied `(x, y)` is the foot position.
- Hotspot rectangles use **top-left + width/height** in canvas pixels.
- Right edge of canvas = 800; bottom = 500.
