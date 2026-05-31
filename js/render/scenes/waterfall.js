// Waterfall / Mossfall Grotto scene.
// State rendered:
//   torchFound    — torch bracket becomes empty
//   torchLit      — campfire brighter, no need to return
//   waterfallCrossed — cave crossing done; right-exit hotspot visible

import { W, H, FLOOR_Y } from '../../engine/constants.js';
import { state }          from '../../engine/state.js';
import { gradientRect, drawRoundRect } from '../utils.js';
import { drawCloud, drawTree } from '../shared.js';

export function drawWaterfallScene(ctx) {
  // Sky
  gradientRect(ctx, 0, 0, W, 290, '#3a78c0', '#78b8e0', true);

  // Clouds
  const drift = (state.tick * 0.12) % 900;
  drawCloud(ctx, 60  + drift,       50, 0.85);
  drawCloud(ctx, 400 + drift * 0.5, 35, 0.7);

  // Distant mountains
  ctx.fillStyle = '#3a6020';
  ctx.beginPath();
  ctx.moveTo(0, 230);
  ctx.bezierCurveTo(80, 170, 180, 200, 280, 175);
  ctx.bezierCurveTo(380, 150, 440, 185, 560, 168);
  ctx.bezierCurveTo(650, 155, 720, 180, W, 160);
  ctx.lineTo(W, 290); ctx.lineTo(0, 290);
  ctx.closePath(); ctx.fill();

  // Ground
  gradientRect(ctx, 0, 283, W, 217, '#4a9830', '#2a7018', true);

  // Cliff face (right side, where waterfall comes from)
  gradientRect(ctx, 540, 0, 260, 395, '#806858', '#5a4030', true);
  ctx.strokeStyle = 'rgba(40,20,10,0.3)'; ctx.lineWidth = 1;
  [60, 110, 165, 225, 285].forEach(y => {
    ctx.beginPath(); ctx.moveTo(540, y); ctx.lineTo(W, y); ctx.stroke();
  });

  // Cave entrance arch (dark opening behind the waterfall)
  ctx.fillStyle = '#0d0814';
  ctx.beginPath();
  ctx.arc(660, 340, 72, Math.PI, 0);
  ctx.lineTo(730, 420); ctx.lineTo(590, 420);
  ctx.closePath(); ctx.fill();
  // Cave arch border
  ctx.strokeStyle = '#504040'; ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(660, 340, 72, Math.PI, 0);
  ctx.lineTo(730, 420); ctx.moveTo(590, 420); ctx.lineTo(590, 340);
  ctx.stroke();

  // Waterfall
  _drawWaterfall(ctx);

  // Waterfall pool at base
  gradientRect(ctx, 560, 405, 240, 45, 'rgba(40,120,200,0.6)', 'rgba(20,80,160,0.4)', true);
  ctx.strokeStyle = 'rgba(60,160,220,0.5)'; ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.ellipse(680, 415, 80, 12, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Water ripples in pool
  ctx.strokeStyle = 'rgba(80,180,240,0.3)'; ctx.lineWidth = 1;
  const rOff = (state.tick * 0.4) % 30;
  for (let ri = 0; ri < 3; ri++) {
    const rr = 20 + ri * 22 + rOff;
    ctx.beginPath();
    ctx.ellipse(680, 425, rr, rr * 0.3, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Left forest
  drawTree(ctx, 60,  290, 0.9);
  drawTree(ctx, 160, 285, 0.75);
  drawTree(ctx, 260, 280, 0.85);

  // Dirt path
  ctx.fillStyle = '#b89050';
  ctx.beginPath();
  ctx.moveTo(0, 500); ctx.lineTo(0, 400);
  ctx.bezierCurveTo(40, 395, 100, 400, 150, 410);
  ctx.bezierCurveTo(250, 425, 350, 420, 420, 415);
  ctx.lineTo(440, 500);
  ctx.closePath(); ctx.fill();

  // Campfire
  _drawCampfire(ctx);

  // Torch bracket on cliff wall
  if (!state.flags.torchPickedUp) _drawTorchBracket(ctx, false);

  // Cave entrance label + pindus hint arrow
  ctx.fillStyle = 'rgba(200,180,255,0.8)';
  ctx.font      = '10px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('Cave Entrance', 660, 408);
  ctx.textAlign = 'left';

  // Hotspot highlights
  _highlight(ctx, state.hovered === 'waterfallReturn',  0,   240, 90,  220);
  _highlight(ctx, state.hovered === 'torchPickup'
                  && !state.flags.torchPickedUp,        490, 295, 60,  80);
  _highlight(ctx, state.hovered === 'campfire',         130, 358, 108, 68);
  _highlight(ctx, state.hovered === 'caveEntrance',     585, 268, 150, 160);
}

// ── Private helpers ────────────────────────────────────────────────────────────

function _drawWaterfall(ctx) {
  const flowOff = (state.tick * 2) % 60;
  ctx.fillStyle = 'rgba(150,210,255,0.55)';
  ctx.fillRect(620, 0, 80, 410);

  // Animated flow lines
  ctx.strokeStyle = 'rgba(180,230,255,0.5)'; ctx.lineWidth = 2;
  for (let i = 0; i < 5; i++) {
    const fx = 628 + i * 14;
    const fy = (flowOff * 3 + i * 22) % 420;
    ctx.beginPath();
    ctx.moveTo(fx, fy);
    ctx.bezierCurveTo(fx - 3, fy + 40, fx + 3, fy + 80, fx, fy + 120);
    ctx.stroke();
  }

  // Mist at base
  const mist = ctx.createRadialGradient(660, 415, 5, 660, 415, 80);
  mist.addColorStop(0, 'rgba(200,230,255,0.45)');
  mist.addColorStop(1, 'rgba(200,230,255,0)');
  ctx.fillStyle = mist;
  ctx.fillRect(570, 380, 180, 80);
}

function _drawCampfire(ctx) {
  const cx = 188;
  const cy = 400;
  // Stone ring
  ctx.fillStyle = '#808080';
  for (let si = 0; si < 8; si++) {
    const a = (si / 8) * Math.PI * 2;
    ctx.beginPath();
    ctx.ellipse(cx + Math.cos(a) * 18, cy + 4 + Math.sin(a) * 8, 7, 5, a, 0, Math.PI * 2);
    ctx.fill();
  }
  // Embers / ash
  ctx.fillStyle = '#404040';
  ctx.beginPath(); ctx.ellipse(cx, cy + 2, 14, 7, 0, 0, Math.PI * 2); ctx.fill();

  if (state.flags.torchLit) {
    // Still-warm glow (embers after lighting torch)
    const e = ctx.createRadialGradient(cx, cy, 2, cx, cy, 18);
    e.addColorStop(0, 'rgba(255,100,20,0.7)');
    e.addColorStop(1, 'rgba(255,60,0,0)');
    ctx.fillStyle = e;
    ctx.beginPath(); ctx.arc(cx, cy, 18, 0, Math.PI * 2); ctx.fill();
  } else {
    // Active fire
    const pulse = 0.75 + 0.25 * Math.sin(state.tick * 0.1);
    [
      ['rgba(255,60,0,0.7)',  16],
      ['rgba(255,140,0,0.6)', 11],
      ['rgba(255,220,0,0.5)',  6],
    ].forEach(([col, r]) => {
      const fg = ctx.createRadialGradient(cx, cy - 4, 1, cx, cy - 4, r * pulse);
      fg.addColorStop(0, col);
      fg.addColorStop(1, 'rgba(255,0,0,0)');
      ctx.fillStyle = fg;
      ctx.beginPath(); ctx.arc(cx, cy - 4, r * pulse, 0, Math.PI * 2); ctx.fill();
    });
  }
}

function _drawTorchBracket(ctx) {
  const tx = 504;
  const ty = 300;
  // Wall bracket
  ctx.fillStyle = '#707070';
  ctx.fillRect(tx - 2, ty, 6, 30);
  ctx.fillRect(tx - 8, ty + 28, 16, 6);
  // Unlit torch
  ctx.strokeStyle = '#8b5e20'; ctx.lineWidth = 4; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(tx + 2, ty + 8); ctx.lineTo(tx + 2, ty + 68); ctx.stroke();
  ctx.lineCap = 'butt';
  // Torch head
  drawRoundRect(ctx, tx - 5, ty + 4, 14, 18, 4, '#5a3010', '#3a1808', 1.5);
  ctx.fillStyle = '#303030'; // unlit — dark top
  ctx.beginPath(); ctx.ellipse(tx + 2, ty + 5, 5, 3, 0, 0, Math.PI * 2); ctx.fill();
}

function _highlight(ctx, active, x, y, w, h) {
  if (!active) return;
  ctx.strokeStyle = 'rgba(255,220,60,0.7)';
  ctx.lineWidth   = 2;
  ctx.setLineDash([6, 4]);
  ctx.strokeRect(x, y, w, h);
  ctx.setLineDash([]);
}
