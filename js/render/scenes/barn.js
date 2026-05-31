import { W }             from '../../engine/constants.js';
import { state }         from '../../engine/state.js';
import { drawRoundRect, gradientRect } from '../utils.js';

export function drawBarnScene(ctx) {
  // Back wall
  gradientRect(ctx, 0, 0, W, 390, '#7a4820', '#5a3010', true);

  // Horizontal plank lines
  ctx.strokeStyle = '#4a2008'; ctx.lineWidth = 1.5;
  for (let y = 30; y < 390; y += 28) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }

  // Vertical support beams
  [140, 320, 480, 660].forEach(bx => {
    gradientRect(ctx, bx - 14, 0, 28, 390, '#8B4513', '#5C2A06', false);
    ctx.strokeStyle = '#3a1a04'; ctx.lineWidth = 1;
    ctx.strokeRect(bx - 14, 0, 28, 390);
  });

  // Horizontal beam
  gradientRect(ctx, 0, 130, W, 20, '#8B4513', '#5C2A06', false);
  ctx.strokeStyle = '#3a1a04'; ctx.lineWidth = 1;
  ctx.strokeRect(0, 130, W, 20);

  // Window (left) with ambient glow
  const winGlow = ctx.createRadialGradient(110, 100, 5, 110, 100, 90);
  winGlow.addColorStop(0, 'rgba(255,230,150,0.4)');
  winGlow.addColorStop(1, 'rgba(255,230,150,0)');
  ctx.fillStyle = winGlow;
  ctx.fillRect(30, 30, 180, 170);
  ctx.fillStyle = '#87ceeb';
  ctx.fillRect(50, 50, 120, 80);
  gradientRect(ctx, 50, 90, 120, 40, 'rgba(255,180,60,0)', 'rgba(255,180,60,0.3)', true);
  ctx.strokeStyle = '#8B4513'; ctx.lineWidth = 5;
  ctx.strokeRect(50, 50, 120, 80);
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(110, 50);  ctx.lineTo(110, 130); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(50,  90);  ctx.lineTo(170, 90);  ctx.stroke();

  // Hanging lantern with animated glow
  ctx.fillStyle = '#c07820';
  ctx.fillRect(396, 60, 8, 20);
  drawRoundRect(ctx, 384, 78, 32, 42, 8, '#d09020', '#a06010', 2);
  const flamePulse = 0.7 + 0.3 * Math.sin(state.tick * 0.08);
  const fg = ctx.createRadialGradient(400, 90, 2, 400, 90, 24 * flamePulse);
  fg.addColorStop(0, 'rgba(255,200,60,0.8)');
  fg.addColorStop(1, 'rgba(255,140,0,0)');
  ctx.fillStyle = fg;
  ctx.fillRect(376, 62, 48, 48);

  // Floor
  gradientRect(ctx, 0, 380, W, 120, '#c8a460', '#a07830', true);
  ctx.strokeStyle = '#8a6020'; ctx.lineWidth = 1;
  for (let i = 0; i < 40; i++) {
    const sx = (i * 54 + 12) % W;
    const sy = 385 + Math.sin(i * 3) * 10;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.bezierCurveTo(sx + 12, sy - 4, sx + 24, sy + 4, sx + 36, sy + 1);
    ctx.stroke();
  }

  // Barn doors (exit to farm yard)
  gradientRect(ctx, 640, 50,  80, 340, '#a05a10', '#7a3a06', true);
  gradientRect(ctx, 720, 50,  80, 340, '#9a5410', '#743606', true);
  ctx.strokeStyle = '#5a2a04'; ctx.lineWidth = 2;
  for (let dy = 50; dy < 390; dy += 36) {
    ctx.beginPath(); ctx.moveTo(640, dy); ctx.lineTo(720, dy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(720, dy); ctx.lineTo(800, dy); ctx.stroke();
  }
  ctx.fillStyle = '#404040';
  ctx.fillRect(636, 100, 10, 20); ctx.fillRect(636, 260, 10, 20);
  ctx.fillRect(716, 100, 10, 20); ctx.fillRect(716, 260, 10, 20);
  const doorLight = ctx.createLinearGradient(718, 0, 722, 0);
  doorLight.addColorStop(0,   'rgba(255,220,120,0)');
  doorLight.addColorStop(0.5, 'rgba(255,220,120,0.7)');
  doorLight.addColorStop(1,   'rgba(255,220,120,0)');
  ctx.fillStyle = doorLight;
  ctx.fillRect(718, 50, 4, 340);

  // Hay bales
  drawHayBale(ctx, 70,  350, !state.flags.stickPickedUp);
  drawHayBale(ctx, 520, 360, false);

  // Toolbox (only relevant after apple quest)
  _drawToolbox(ctx);

  // Hotspot highlights
  _highlight(ctx, state.hovered === 'hay_bale',      40,  330, 160,  80);
  _highlight(ctx, state.hovered === 'toolbox',       535, 348, 88,   56);
  _highlight(ctx, state.hovered === 'barn_door_exit', 630, 50, 170, 340);
}

export function drawHayBale(ctx, x, y, hasStick) {
  drawRoundRect(ctx, x, y, 120, 60, 10, '#d4a430', '#a07820', 2);
  ctx.strokeStyle = '#c89020'; ctx.lineWidth = 1.5;
  for (let i = 0; i < 7; i++) {
    ctx.beginPath();
    ctx.moveTo(x + 10 + i * 16, y + 5);
    ctx.bezierCurveTo(x + 14 + i * 16, y + 30, x + 8 + i * 16, y + 40, x + 12 + i * 16, y + 55);
    ctx.stroke();
  }
  ctx.strokeStyle = '#8a6010'; ctx.lineWidth = 3;
  ctx.strokeRect(x + 6, y + 6, 108, 48);
  ctx.beginPath();
  ctx.moveTo(x + 60, y + 6); ctx.lineTo(x + 60, y + 54);
  ctx.stroke();
  if (hasStick) {
    ctx.strokeStyle = '#7a4f10'; ctx.lineWidth = 4; ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x + 70, y - 20); ctx.lineTo(x + 80, y + 10);
    ctx.stroke();
    ctx.lineCap = 'butt';
  }
}

function _drawToolbox(ctx) {
  const tx = 537;
  const ty = 350;
  const open = state.flags.toolboxOpen;
  // Chest body
  ctx.fillStyle = '#7a4820';
  ctx.fillRect(tx, ty + 8, 84, 46);
  ctx.strokeStyle = '#4a2808'; ctx.lineWidth = 1.5;
  ctx.strokeRect(tx, ty + 8, 84, 46);
  // Metal corners
  ctx.fillStyle = '#909090';
  [[tx, ty + 8], [tx + 76, ty + 8], [tx, ty + 46], [tx + 76, ty + 46]]
    .forEach(([cx2, cy2]) => ctx.fillRect(cx2, cy2, 8, 8));
  // Lid
  if (!open) {
    ctx.fillStyle = '#8b5420';
    ctx.fillRect(tx, ty, 84, 14);
    ctx.strokeStyle = '#4a2808'; ctx.lineWidth = 1.5;
    ctx.strokeRect(tx, ty, 84, 14);
    // Lock
    ctx.fillStyle = '#c0a020';
    ctx.beginPath(); ctx.arc(tx + 42, ty + 7, 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#806010';
    ctx.fillRect(tx + 38, ty + 7, 8, 6);
  } else {
    // Open lid tilted back
    ctx.save();
    ctx.translate(tx + 42, ty + 8);
    ctx.rotate(-0.8);
    ctx.fillStyle = '#8b5420';
    ctx.fillRect(-42, -14, 84, 14);
    ctx.strokeStyle = '#4a2808'; ctx.lineWidth = 1.5;
    ctx.strokeRect(-42, -14, 84, 14);
    ctx.restore();
    // Interior
    ctx.fillStyle = '#2a1808';
    ctx.fillRect(tx + 2, ty + 10, 80, 42);
  }
}

function _highlight(ctx, active, x, y, w, h) {
  if (!active) return;
  ctx.strokeStyle = 'rgba(255,220,60,0.7)';
  ctx.lineWidth   = 2;
  ctx.setLineDash([6, 4]);
  ctx.strokeRect(x, y, w, h);
  ctx.setLineDash([]);
}
