import { W }          from '../../engine/constants.js';
import { state }       from '../../engine/state.js';
import { gradientRect } from '../utils.js';
import { drawCloud, drawTree } from '../shared.js';

export function drawFarmYardScene(ctx) {
  // Sky
  gradientRect(ctx, 0, 0, W, 300, '#4a90d9', '#87ceeb', true);

  // Drifting clouds
  const drift = (state.tick * 0.2) % 900;
  drawCloud(ctx,  60 + drift,         60, 1.0);
  drawCloud(ctx, 360 + drift * 0.6,   40, 0.8);
  drawCloud(ctx, 650 + drift * 0.4,   80, 1.1);

  // Distant hills
  ctx.fillStyle = '#3a8028';
  ctx.beginPath();
  ctx.moveTo(0, 240);
  ctx.bezierCurveTo(120, 185, 260, 215, 420, 195);
  ctx.bezierCurveTo(560, 175, 700, 205, W, 185);
  ctx.lineTo(W, 300); ctx.lineTo(0, 300);
  ctx.closePath(); ctx.fill();

  // Ground
  gradientRect(ctx, 0, 295, W, 205, '#5aac44', '#3a8028', true);

  // Dirt path
  ctx.fillStyle = '#b89050';
  ctx.beginPath();
  ctx.moveTo(350, 500);
  ctx.bezierCurveTo(370, 420, 360, 350, 420, 295);
  ctx.bezierCurveTo(460, 265, 500, 260, 600, 200);
  ctx.lineTo(620, 220);
  ctx.bezierCurveTo(510, 280, 470, 285, 430, 320);
  ctx.bezierCurveTo(380, 370, 390, 440, 380, 500);
  ctx.closePath(); ctx.fill();

  // ── BARN (background left) ──────────────────────────────────
  ctx.fillStyle = '#c62828';
  ctx.fillRect(0, 230, 140, 200);
  ctx.fillStyle = '#8b1c1c';
  ctx.beginPath();
  ctx.moveTo(-10, 232); ctx.lineTo(70, 170); ctx.lineTo(150, 232);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#7a3a06';
  ctx.fillRect(40, 330, 60, 100);
  ctx.strokeStyle = '#5a2204'; ctx.lineWidth = 2;
  ctx.strokeRect(40, 330, 60, 100);
  ctx.beginPath();
  ctx.moveTo(70, 330); ctx.lineTo(70, 430);
  ctx.moveTo(40, 380); ctx.lineTo(100, 380);
  ctx.stroke();
  ctx.fillStyle = '#87ceeb';
  ctx.fillRect(80, 255, 40, 30);
  ctx.strokeStyle = '#5a2204'; ctx.lineWidth = 2;
  ctx.strokeRect(80, 255, 40, 30);

  _highlight(ctx, state.hovered === 'barn_back', 30, 320, 90, 120);

  // ── FARMHOUSE ───────────────────────────────────────────────
  ctx.fillStyle = '#8b7050';
  ctx.fillRect(130, 385, 220, 30);         // foundation
  ctx.fillStyle = '#f5f0e0';
  ctx.fillRect(130, 250, 220, 140);        // walls
  ctx.fillStyle = '#c46030';
  ctx.beginPath();
  ctx.moveTo(118, 252); ctx.lineTo(240, 185); ctx.lineTo(362, 252);
  ctx.closePath(); ctx.fill();             // roof
  ctx.fillStyle = '#b87040';
  ctx.fillRect(280, 180, 24, 45);          // chimney

  // Smoke
  const smokeOff = (state.tick * 0.4) % 40;
  [0, 1, 2].forEach(i => {
    const sz = 8 + i * 4;
    const sy = 175 - i * 20 - smokeOff;
    if (sy > 40) {
      ctx.beginPath();
      ctx.arc(292 + Math.sin(i * 1.5) * 5, sy, sz, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(220,210,200,${0.5 - i * 0.15})`;
      ctx.fill();
    }
  });

  // Windows
  ctx.fillStyle = '#87ceeb';
  ctx.fillRect(150, 278, 50, 45); ctx.fillRect(278, 278, 50, 45);
  ctx.strokeStyle = '#a87040'; ctx.lineWidth = 3;
  ctx.strokeRect(150, 278, 50, 45); ctx.strokeRect(278, 278, 50, 45);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(175, 278); ctx.lineTo(175, 323);
  ctx.moveTo(150, 300); ctx.lineTo(200, 300);
  ctx.moveTo(303, 278); ctx.lineTo(303, 323);
  ctx.moveTo(278, 300); ctx.lineTo(328, 300);
  ctx.stroke();
  // Flower boxes
  ctx.fillStyle = '#8b4513';
  ctx.fillRect(148, 322, 54, 12); ctx.fillRect(276, 322, 54, 12);
  ['#ff6060', '#ff90b0', '#ffcc40'].forEach((col, i) => {
    ctx.fillStyle = col;
    ctx.beginPath(); ctx.arc(158 + i * 15, 320, 4, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(286 + i * 15, 320, 4, 0, Math.PI * 2); ctx.fill();
  });

  // Door
  ctx.fillStyle = '#c8a060';
  ctx.fillRect(210, 325, 50, 75);
  ctx.strokeStyle = '#8b5a20'; ctx.lineWidth = 2;
  ctx.strokeRect(210, 325, 50, 75);
  ctx.fillStyle = '#c8c8c8';
  ctx.beginPath(); ctx.arc(252, 365, 4, 0, Math.PI * 2); ctx.fill();
  if (!state.flags.doorOpen) {
    ctx.fillStyle = '#808080';
    ctx.fillRect(248, 354, 8, 6);
    ctx.strokeStyle = '#606060'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(252, 353, 4, Math.PI, 0); ctx.stroke();
  }

  _highlight(ctx, state.hovered === 'farmhouse_door', 208, 323, 54, 78);

  // ── WELL ────────────────────────────────────────────────────
  ctx.fillStyle = '#909090';
  ctx.beginPath(); ctx.ellipse(490, 376, 36, 16, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#606060'; ctx.lineWidth = 2; ctx.stroke();
  ctx.fillStyle = '#a0a0a0';
  ctx.fillRect(454, 330, 72, 46);
  ctx.strokeStyle = '#606060'; ctx.lineWidth = 2;
  ctx.strokeRect(454, 330, 72, 46);
  ctx.strokeStyle = '#808080'; ctx.lineWidth = 1;
  [[454, 346], [454, 360]].forEach(([x, y]) => {
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 72, y); ctx.stroke();
  });
  [472, 490, 508].forEach(x => {
    ctx.beginPath(); ctx.moveTo(x, 330); ctx.lineTo(x, 376); ctx.stroke();
  });
  ctx.strokeStyle = '#7a4820'; ctx.lineWidth = 5; ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(456, 330); ctx.lineTo(490, 280); ctx.lineTo(524, 330);
  ctx.stroke();
  ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(468, 305); ctx.lineTo(512, 305); ctx.stroke();
  ctx.lineCap = 'butt';
  if (!state.flags.bucketPickedUp) {
    ctx.strokeStyle = '#c8a040'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(490, 305); ctx.lineTo(490, 340); ctx.stroke();
    ctx.fillStyle = '#8b6020';
    ctx.beginPath();
    ctx.moveTo(478, 340); ctx.lineTo(480, 360); ctx.lineTo(500, 360); ctx.lineTo(502, 340);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#5a3a10'; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.beginPath(); ctx.arc(490, 340, 12, Math.PI, 0);
    ctx.strokeStyle = '#c8a040'; ctx.lineWidth = 2; ctx.stroke();
  }
  ctx.fillStyle = 'rgba(60,140,200,0.5)';
  ctx.beginPath(); ctx.ellipse(490, 374, 34, 14, 0, 0, Math.PI * 2); ctx.fill();

  _highlight(ctx, state.hovered === 'well',          454, 270,  72, 116);
  _highlight(ctx, state.hovered === 'bucket_pickup', 474, 335,  35,  35);

  // ── SCARECROW ───────────────────────────────────────────────
  ctx.strokeStyle = '#8b6020'; ctx.lineWidth = 5; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(600, 360); ctx.lineTo(600, 240); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(560, 280); ctx.lineTo(640, 280); ctx.stroke();
  ctx.lineCap = 'butt';
  ctx.fillStyle = '#8b6914';
  ctx.fillRect(582, 255, 36, 60); ctx.fillRect(562, 278, 76, 12);
  ctx.strokeStyle = '#5a4010'; ctx.lineWidth = 1;
  ctx.strokeRect(582, 255, 36, 60);
  ctx.fillStyle = '#c08030';
  ctx.fillRect(584, 278, 14, 12); ctx.fillRect(602, 295, 10, 10);
  ctx.beginPath(); ctx.arc(600, 248, 18, 0, Math.PI * 2);
  ctx.fillStyle = '#d4a830'; ctx.fill();
  ctx.strokeStyle = '#a07820'; ctx.lineWidth = 1; ctx.stroke();
  ctx.fillStyle = '#4a3010';
  ctx.fillRect(584, 226, 32, 6); ctx.fillRect(589, 212, 22, 16);
  ctx.fillStyle = '#3a2010';
  ctx.beginPath(); ctx.arc(594, 248, 2.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(606, 248, 2.5, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#3a2010'; ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(594, 254); ctx.lineTo(598, 258); ctx.lineTo(602, 253); ctx.lineTo(606, 257);
  ctx.stroke();
  ctx.strokeStyle = '#d4a020'; ctx.lineWidth = 2;
  [[562, 284], [638, 284], [580, 315]].forEach(([sx, sy]) => {
    for (let i = -1; i <= 1; i++) {
      ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx + i * 10, sy + 14); ctx.stroke();
    }
  });

  _highlight(ctx, state.hovered === 'scarecrow', 578, 224, 44, 140);

  // ── FENCE & GATE ────────────────────────────────────────────
  for (let fy = 230; fy <= 430; fy += 38) {
    ctx.fillStyle = '#c8a060'; ctx.fillRect(708, fy, 12, 36);
    ctx.fillStyle = '#a07840'; ctx.fillRect(712, fy - 6, 4, 8);
  }
  ctx.fillStyle = '#c8a060';
  ctx.fillRect(720, 260, W - 720, 10);
  ctx.fillRect(720, 310, W - 720, 10);
  ctx.fillRect(720, 360, W - 720, 10);

  if (!state.flags.gateOpen) {
    ctx.fillStyle = state.hovered === 'garden_gate' ? '#d09050' : '#b88040';
    for (let gx = 724; gx < 800; gx += 14) { ctx.fillRect(gx, 240, 8, 180); }
    ctx.fillStyle = '#c8a060';
    ctx.fillRect(722, 250, W - 722, 12);
    ctx.fillRect(722, 310, W - 722, 12);
    ctx.fillRect(722, 370, W - 722, 12);
    ctx.fillStyle = 'rgba(160,80,20,0.6)';
    [[730, 260, 16, 8], [748, 380, 14, 6], [760, 305, 18, 7]].forEach(([rx, ry, rw, rh]) => {
      ctx.fillRect(rx, ry, rw, rh);
    });
  } else {
    ctx.save();
    ctx.translate(724, 420); ctx.rotate(-1.3);
    ctx.fillStyle = '#a07840';
    ctx.fillRect(-8, -160, 8 + 14 * 6, 10);
    ctx.fillRect(-8,  -90, 8 + 14 * 6, 10);
    for (let gx = 0; gx < 14 * 6; gx += 14) { ctx.fillRect(gx - 4, -165, 8, 160); }
    ctx.restore();
  }

  _highlight(ctx, state.hovered === 'garden_gate', 720, 238, W - 720, 185);

  // Trees
  drawTree(ctx, 390, 260, 0.8);
  drawTree(ctx, 680, 240, 0.7);
}

function _highlight(ctx, active, x, y, w, h) {
  if (!active) return;
  ctx.strokeStyle = 'rgba(255,220,60,0.7)';
  ctx.lineWidth   = 2;
  ctx.setLineDash([6, 4]);
  ctx.strokeRect(x, y, w, h);
  ctx.setLineDash([]);
}
