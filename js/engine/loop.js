import { W, H, WALK_SPEED } from './constants.js';
import { state, mouse }     from './state.js';
import { ITEMS }            from '../data/items.js';

import { drawTitleScreen }     from '../render/scenes/title.js';
import { drawBarnScene }       from '../render/scenes/barn.js';
import { drawFarmYardScene }   from '../render/scenes/farmyard.js';
import { drawGardenScene }     from '../render/scenes/garden.js';
import { drawKitchenScene }    from '../render/scenes/kitchen.js';
import { drawBridgeScene }     from '../render/scenes/bridge.js';
import { drawWaterfallScene }  from '../render/scenes/waterfall.js';
import { drawAppleOrchardScene } from '../render/scenes/appleorchard.js';
import { drawCitygate }        from '../render/scenes/citygate.js';
import { drawMarketplace }     from '../render/scenes/marketplace.js';
import { drawWorkshop }        from '../render/scenes/workshop.js';
import { drawFetsson, drawPindus, drawMrsHen } from '../render/characters.js';

import { isMinigameActive, updateMinigame, renderMinigame } from './minigame.js';

const SCENE_NAMES = {
  barn:        'The Barn',
  farmyard:    'The Farm Yard',
  garden:      'The Garden',
  kitchen:     "Mrs. Hen's Kitchen",
  bridge:      'The Old Bridge',
  waterfall:   'Mossfall Grotto',
  appleorchard: 'The Apple Orchard',
  citygate:    'Varnholm City Gate',
  marketplace: 'The Market Square',
  workshop:    "Algott's Workshop",
};

export function update() {
  state.tick++;

  // Minigame takes full control while active
  if (isMinigameActive()) {
    updateMinigame();
    return;
  }

  // Move player toward targetX
  const p = state.player;
  if (p.walking && p.targetX !== null) {
    const dx = p.targetX - p.x;
    if (Math.abs(dx) <= WALK_SPEED) {
      p.x       = p.targetX;
      p.walking = false;
      if (p.pendingAction) {
        const action     = p.pendingAction;
        p.pendingAction  = null;
        action();
      }
    } else {
      p.x      += Math.sign(dx) * WALK_SPEED;
      p.facing  = Math.sign(dx);
    }
  }

  // Bridge movement clamping — prevent walking across broken/locked sections
  if (state.scene === 'bridge') {
    const p2 = state.player;
    if (!state.flags.bridgeFloorFixed && p2.x > 185) {
      // First gap starts ~x:200; clamp before it
      p2.x             = 185;
      p2.walking       = false;
      p2.pendingAction = null;
    } else if (!state.flags.bridgeGateOpen && p2.x > 640) {
      // Gate is at x:360; right cliff beyond gate is inaccessible
      p2.x             = 640;
      p2.walking       = false;
      p2.pendingAction = null;
    }
  }

  // Pindus lazily follows
  const dist = state.player.x - state.pindus.x;
  if (Math.abs(dist) > 70) {
    state.pindus.x      += Math.sign(dist) * (WALK_SPEED * 0.7);
    state.pindus.facing  = Math.sign(dist);
  }
}

export function render(ctx) {
  ctx.clearRect(0, 0, W, H);

  if (state.scene === 'title') {
    drawTitleScreen(ctx);
    return;
  }

  // Background
  switch (state.scene) {
    case 'barn':         drawBarnScene(ctx);          break;
    case 'farmyard':     drawFarmYardScene(ctx);       break;
    case 'garden':       drawGardenScene(ctx);         break;
    case 'kitchen':      drawKitchenScene(ctx);        break;
    case 'bridge':       drawBridgeScene(ctx);         break;
    case 'waterfall':    drawWaterfallScene(ctx);      break;
    case 'appleorchard': drawAppleOrchardScene(ctx);   break;
    case 'citygate':     drawCitygate(ctx);            break;
    case 'marketplace':  drawMarketplace(ctx);         break;
    case 'workshop':     drawWorkshop(ctx);            break;
  }

  // Walk animation frame (0 when standing still)
  const walkFrame = state.player.walking ? Math.floor(state.tick / 8) % 4 : 0;

  drawPindus (ctx, state.pindus.x,  state.pindus.y  - 28, state.pindus.facing);
  drawFetsson(ctx, state.player.x,  state.player.y  - 20, state.player.facing, walkFrame);

  if (state.scene === 'kitchen') drawMrsHen(ctx, 550, 370);

  // Minigame overlay (drawn on top of everything)
  if (isMinigameActive()) {
    renderMinigame(ctx);
  }

  // Cursor item icon when hovering a hotspot with a selected item
  if (state.selectedItem && state.hovered) {
    const item = ITEMS[state.selectedItem];
    ctx.font = '20px sans-serif';
    ctx.fillText(item.icon, mouse.x + 8, mouse.y - 4);
  }

  // Scene label (top-right, subtle)
  const label = SCENE_NAMES[state.scene];
  if (label) {
    ctx.fillStyle = 'rgba(255,230,160,0.55)';
    ctx.font      = 'italic 13px Georgia, serif';
    ctx.textAlign = 'right';
    ctx.fillText(label, W - 12, 18);
    ctx.textAlign = 'left';
  }
}

export function loop(ctx) {
  update();
  render(ctx);
  requestAnimationFrame(() => loop(ctx));
}
