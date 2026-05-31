import { W, H }         from '../../engine/constants.js';
import { state }        from '../../engine/state.js';
import { gradientRect } from '../utils.js';
import { drawCloud, drawTree } from '../shared.js';

export function drawGardenScene(ctx) {
  // Sky
  gradientRect(ctx, 0, 0, W, 300, '#5a9ad9', '#87ceeb', true);

  // Clouds
  const drift2 = (state.tick * 0.15) % 900;
  drawCloud(ctx, 150 + drift2,         55, 0.9);
  drawCloud(ctx, 550 + drift2 * 0.5,   75, 1.0);

  // Ground
  gradientRect(ctx, 0, 298, W, H - 298, '#5aac44', '#3a8028', true);

  // Soil beds
  ctx.fillStyle = '#8b5c2a';
  ctx.fillRect(60, 330, 420, 80);
  ctx.fillStyle = '#7a4e22';
  [150, 240, 330].forEach(sx => { ctx.fillRect(sx, 330, 6, 80); });

  // Vegetables
  _drawVeggies(ctx);

  // Garden gnome
  _drawGardenGnome(ctx, 230, 360);

  // Flower bed
  ctx.fillStyle = '#5aac44';
  ctx.fillRect(500, 325, 200, 65);
  [
    { x: 520, y: 345, col: '#ff4444' },
    { x: 550, y: 340, col: '#ff88cc' },
    { x: 580, y: 348, col: '#ffcc00' },
    { x: 610, y: 342, col: '#cc44ff' },
    { x: 640, y: 345, col: '#44aaff' },
    { x: 670, y: 340, col: '#ff6622' },
    { x: 535, y: 360, col: '#ffcc00' },
    { x: 565, y: 358, col: '#ff4444' },
    { x: 595, y: 362, col: '#44ff88' },
    { x: 625, y: 356, col: '#ff88cc' },
    { x: 655, y: 360, col: '#ffcc00' },
  ].forEach(({ x, y, col }) => {
    ctx.strokeStyle = '#3a8028'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x, y + 16); ctx.lineTo(x, y); ctx.stroke();
    ctx.fillStyle = col;
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 3) {
      ctx.beginPath();
      ctx.ellipse(x + Math.cos(a) * 6, y + Math.sin(a) * 6, 5, 4, a, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#ffe060';
    ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fill();
  });

  // Left fence (entry from farm yard)
  ctx.fillStyle = '#c8a060';
  for (let fy = 180; fy < 460; fy += 38) {
    ctx.fillRect(0, fy, 12, 32);
    ctx.fillRect(0, fy - 6, 12, 8);
  }
  ctx.fillStyle = '#c8a060';
  [220, 270, 320, 370].forEach(y => { ctx.fillRect(12, y, 10, 10); });

  // Gate (open, leaning)
  ctx.save();
  ctx.translate(24, 430); ctx.rotate(-1.0);
  ctx.fillStyle = '#a07840';
  ctx.fillRect(-4, -160, 46, 8);
  ctx.fillRect(-4, -100, 46, 8);
  for (let gx = 0; gx < 46; gx += 12) { ctx.fillRect(gx, -165, 8, 160); }
  ctx.restore();

  _highlight(ctx, state.hovered === 'garden_exit', 0,   200, 55,  220);
  _highlight(ctx, state.hovered === 'gnome',       200, 300, 80,  75);
  _highlight(ctx, state.hovered === 'veggies',     60,  325, 420, 90);

  // Right trees
  drawTree(ctx, 740, 240, 1.0);
  drawTree(ctx, 680, 260, 0.7);
}

// ── Private helpers ────────────────────────────────────────────

function _drawVeggies(ctx) {
  // Pumpkins
  [[80, 370], [110, 365], [140, 372]].forEach(([vx, vy]) => {
    ctx.fillStyle = '#ff8c00';
    ctx.beginPath(); ctx.ellipse(vx, vy, 18, 14, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#cc6600'; ctx.lineWidth = 1; ctx.stroke();
    [-8, 0, 8].forEach(rx => {
      ctx.beginPath();
      ctx.moveTo(vx + rx, vy - 14);
      ctx.bezierCurveTo(vx + rx + 3, vy, vx + rx + 2, vy + 5, vx + rx, vy + 14);
      ctx.strokeStyle = 'rgba(0,0,0,0.15)'; ctx.stroke();
    });
    ctx.strokeStyle = '#5a8020'; ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(vx, vy - 14);
    ctx.bezierCurveTo(vx + 4, vy - 22, vx + 2, vy - 26, vx - 2, vy - 24);
    ctx.stroke();
  });

  // Carrots
  [[175, 355], [195, 360], [215, 358]].forEach(([vx, vy]) => {
    ctx.fillStyle = '#ff6620';
    ctx.beginPath();
    ctx.moveTo(vx - 6, vy - 16);
    ctx.bezierCurveTo(vx - 8, vy + 5, vx + 8, vy + 5, vx + 6, vy - 16);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#4a8020'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(vx, vy - 16); ctx.lineTo(vx - 8, vy - 30); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(vx, vy - 16); ctx.lineTo(vx,     vy - 32); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(vx, vy - 16); ctx.lineTo(vx + 8, vy - 28); ctx.stroke();
  });

  // Cabbages
  [[255, 368], [285, 362], [315, 370]].forEach(([vx, vy]) => {
    ctx.fillStyle = '#6aaa40';
    ctx.beginPath(); ctx.ellipse(vx, vy, 16, 12, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#4a8a28';
    ctx.beginPath(); ctx.ellipse(vx, vy, 10, 8, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#3a7020'; ctx.lineWidth = 1;
    for (let a = 0; a < Math.PI; a += Math.PI / 4) {
      ctx.beginPath();
      ctx.moveTo(vx, vy);
      ctx.lineTo(vx + Math.cos(a) * 14, vy + Math.sin(a) * 10);
      ctx.stroke();
    }
  });
}

function _drawGardenGnome(ctx, x, y) {
  // Body
  ctx.fillStyle = '#b0b0b0';
  ctx.beginPath();
  ctx.moveTo(x - 18, y + 10);
  ctx.bezierCurveTo(x - 20, y - 10, x - 18, y - 22, x, y - 24);
  ctx.bezierCurveTo(x + 18, y - 22, x + 20, y - 10, x + 18, y + 10);
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#808080'; ctx.lineWidth = 1; ctx.stroke();

  // Belt
  ctx.fillStyle = '#3a2010'; ctx.fillRect(x - 18, y - 8, 36, 7);
  ctx.fillStyle = '#c8a020'; ctx.fillRect(x - 4, y - 8, 8, 7);

  // Beard
  ctx.fillStyle = '#f0f0f0';
  ctx.beginPath();
  ctx.moveTo(x - 14, y - 16);
  ctx.bezierCurveTo(x - 18, y +  2, x - 14, y + 12, x,     y + 14);
  ctx.bezierCurveTo(x + 14, y + 12, x + 18, y +  2, x + 14, y - 16);
  ctx.closePath(); ctx.fill();

  // Face
  ctx.fillStyle = '#e8c090';
  ctx.beginPath(); ctx.ellipse(x, y - 22, 12, 10, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = 'rgba(192,144,96,0.38)'; ctx.lineWidth = 1; ctx.stroke();
  ctx.fillStyle = 'rgba(230,120,100,0.5)';
  ctx.beginPath(); ctx.arc(x - 8, y - 20, 5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x + 8, y - 20, 5, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#1a0a00';
  ctx.beginPath(); ctx.arc(x - 5, y - 24, 2, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x + 5, y - 24, 2, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#8b4513'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(x, y - 18, 5, 0.2, Math.PI - 0.2); ctx.stroke();

  // Hat (red pointy)
  ctx.fillStyle = '#c82020';
  ctx.beginPath();
  ctx.moveTo(x - 14, y - 30);
  ctx.lineTo(x +  4, y - 60);
  ctx.lineTo(x + 16, y - 28);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#ffffff'; ctx.fillRect(x - 15, y - 32, 32, 8);

  // Key visible under gnome
  if (!state.flags.keyPickedUp) {
    ctx.fillStyle = '#d4a020';
    ctx.beginPath(); ctx.arc(x + 22, y + 8, 6, 0, Math.PI * 2); ctx.fill();
    ctx.fillRect(x + 27, y + 6, 14, 4);
    ctx.fillRect(x + 36, y + 6,  4, 7);
    ctx.fillRect(x + 32, y + 6,  4, 6);
    ctx.strokeStyle = '#a07010'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(x + 22, y + 8, 6, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeRect(x + 27, y + 6, 14, 4);
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
