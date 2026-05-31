// Apple Orchard scene — open sunlit meadow with apple trees.
// State rendered:
//   applesCollected — apple clusters on trees gone; basket visible on ground

import { W, H, FLOOR_Y } from '../../engine/constants.js';
import { state }          from '../../engine/state.js';
import { gradientRect }   from '../utils.js';
import { drawCloud, drawTree } from '../shared.js';

export function drawAppleOrchardScene(ctx) {
  // Sky
  gradientRect(ctx, 0, 0, W, 290, '#60a8e0', '#a8d4f8', true);

  // Drifting clouds
  const drift = (state.tick * 0.18) % 900;
  drawCloud(ctx,  50 + drift,       40, 1.1);
  drawCloud(ctx, 340 + drift * 0.7, 55, 0.8);
  drawCloud(ctx, 640 + drift * 0.5, 34, 0.9);

  // Distant hills
  ctx.fillStyle = '#3a8828';
  ctx.beginPath();
  ctx.moveTo(0, 240);
  ctx.bezierCurveTo(100, 195, 240, 220, 380, 200);
  ctx.bezierCurveTo(520, 180, 660, 215, W, 198);
  ctx.lineTo(W, 290); ctx.lineTo(0, 290); ctx.closePath(); ctx.fill();

  // Ground — lush green meadow
  gradientRect(ctx, 0, 284, W, 216, '#5ab840', '#3a9020', true);

  // Long grass patches
  ctx.strokeStyle = '#2a7818'; ctx.lineWidth = 1.5; ctx.lineCap = 'round';
  for (let gx = 0; gx < W; gx += 18) {
    const sway = Math.sin(state.tick * 0.025 + gx * 0.08) * 4;
    const base = 340 + Math.sin(gx * 0.06) * 20;
    ctx.strokeStyle = gx % 36 < 18 ? '#2a8020' : '#38a028';
    ctx.beginPath();
    ctx.moveTo(gx, base);
    ctx.quadraticCurveTo(gx + sway, base - 14, gx + sway * 1.3, base - 22);
    ctx.stroke();
  }
  ctx.lineCap = 'butt';

  // Wildflowers
  const flowerCols = ['#ff6080', '#ffe040', '#e040ff', '#60d0ff'];
  for (let fi = 0; fi < 30; fi++) {
    const fx = (fi * 97 + 40) % W;
    const fy = 330 + (fi * 53) % 60;
    ctx.fillStyle = flowerCols[fi % flowerCols.length];
    ctx.beginPath(); ctx.arc(fx, fy, 3, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#2a8020';
    ctx.fillRect(fx - 1, fy, 2, 8);
  }

  // Apple trees (with apples while not yet collected)
  _drawAppleTree(ctx, 100,  295, 1.0, !state.flags.applesCollected);
  _drawAppleTree(ctx, 280,  280, 0.9, !state.flags.applesCollected);
  _drawAppleTree(ctx, 500,  285, 1.05, !state.flags.applesCollected);
  _drawAppleTree(ctx, 680,  278, 0.85, !state.flags.applesCollected);

  // Stone wall / hedge on right (back towards waterfall)
  ctx.fillStyle = '#8a7a6a';
  ctx.fillRect(0, 290, 80, 210);
  ctx.strokeStyle = '#6a5a4a'; ctx.lineWidth = 1;
  for (let sy = 300; sy < 500; sy += 22) {
    ctx.beginPath(); ctx.moveTo(0, sy); ctx.lineTo(80, sy); ctx.stroke();
  }
  ctx.fillStyle = '#6a8a4a';
  ctx.fillRect(0, 280, 80, 16);

  // Sunlight beam
  const sl = ctx.createLinearGradient(0, 0, 300, 400);
  sl.addColorStop(0, 'rgba(255,240,160,0.10)');
  sl.addColorStop(1, 'rgba(255,240,160,0)');
  ctx.fillStyle = sl;
  ctx.beginPath();
  ctx.moveTo(50, 0); ctx.lineTo(250, 0); ctx.lineTo(450, 400); ctx.lineTo(200, 400);
  ctx.closePath(); ctx.fill();

  // Apple pile on ground (after collecting)
  if (state.flags.applesCollected) {
    _drawApplePile(ctx, 380, 385);
  }

  // Hotspot highlights
  _highlight(ctx, state.hovered === 'orchardReturn',      0,   240,  80, 220);
  _highlight(ctx, state.hovered === 'appleTree'
                  && !state.flags.applesCollected,        80,  200, 640, 220);
}

// ── Private helpers ────────────────────────────────────────────────────────────

function _drawAppleTree(ctx, x, y, scale, hasApples) {
  // Trunk
  ctx.fillStyle = '#6b4820';
  ctx.fillRect(x - 7 * scale, y, 14 * scale, 55 * scale);

  // Foliage layers
  ctx.fillStyle = '#2d6e22';
  ctx.beginPath();
  ctx.arc(x,              y - 12 * scale, 34 * scale, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath();
  ctx.arc(x + 20 * scale, y +  6 * scale, 24 * scale, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath();
  ctx.arc(x - 18 * scale, y +  6 * scale, 24 * scale, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#3a8428';
  ctx.beginPath();
  ctx.arc(x + 8 * scale,  y - 22 * scale, 20 * scale, 0, Math.PI * 2); ctx.fill();

  if (hasApples) {
    // Red apple clusters
    const positions = [
      [x - 20 * scale, y - 10 * scale],
      [x + 14 * scale, y -  5 * scale],
      [x + 22 * scale, y +  8 * scale],
      [x -  8 * scale, y +  4 * scale],
      [x +  4 * scale, y - 18 * scale],
    ];
    positions.forEach(([ax, ay]) => {
      ctx.fillStyle = '#cc2020';
      ctx.beginPath(); ctx.arc(ax, ay, 5 * scale, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ff4040';
      ctx.beginPath(); ctx.arc(ax - 1 * scale, ay - 1 * scale, 2 * scale, 0, Math.PI * 2); ctx.fill();
      // Stem
      ctx.strokeStyle = '#4a2808'; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(ax, ay - 5 * scale); ctx.lineTo(ax + 2, ay - 9 * scale); ctx.stroke();
    });
  }
}

function _drawApplePile(ctx, cx, cy) {
  // A few apples on ground to show they've been picked up
  const positions = [[-12, 0], [0, -4], [12, 2], [-6, 6], [8, -8]];
  positions.forEach(([dx, dy]) => {
    ctx.fillStyle = '#cc2020';
    ctx.beginPath(); ctx.arc(cx + dx, cy + dy, 6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ff4040';
    ctx.beginPath(); ctx.arc(cx + dx - 1, cy + dy - 1, 2, 0, Math.PI * 2); ctx.fill();
  });
}

function _highlight(ctx, active, x, y, w, h) {
  if (!active) return;
  ctx.strokeStyle = 'rgba(255,220,60,0.7)';
  ctx.lineWidth   = 2;
  ctx.setLineDash([6, 4]);
  ctx.strokeRect(x, y, w, h);
  ctx.setLineDash([]);
}
