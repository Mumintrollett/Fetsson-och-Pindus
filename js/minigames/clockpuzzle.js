// Minigame: Clock Puzzle — Algott's Workshop
//
// Three analog clock faces on a wooden panel overlay.
// Labels: "Opening", "Midday", "Closing"
// The player adjusts each clock hour by clicking the upper half (+1)
// or lower half (-1) of the clock face.
// Solution: [7, 12, 5]
// Wrong answer: beam shakes + clocks reset to [12, 12, 12]
// Correct answer: golden glow flash, then endMinigame(true)
//
// Standard minigame interface: id, reset(), update(), render(ctx), handleClick(x, y)

import { endMinigame } from '../engine/minigame.js';

export const id = 'clockpuzzle';

const SOLUTION = [7, 12, 5];
const LABELS   = ['Opening', 'Midday', 'Closing'];

// Panel geometry
const PANEL_X = 100, PANEL_Y = 80, PANEL_W = 600, PANEL_H = 340;
// Clock centres (relative to canvas)
const CLOCKS = [
  { cx: 240, cy: 250 },
  { cx: 400, cy: 250 },
  { cx: 560, cy: 250 },
];
const CLOCK_R = 70;

let hours      = [12, 12, 12];
let shakeTimer = 0;       // > 0 while shaking after wrong answer
let successTimer = 0;     // > 0 while showing success glow
let solved     = false;

export function reset() {
  hours        = [12, 12, 12];
  shakeTimer   = 0;
  successTimer = 0;
  solved       = false;
}

export function update() {
  if (shakeTimer > 0) {
    shakeTimer--;
    if (shakeTimer === 0) {
      hours = [12, 12, 12];
    }
  }
  if (successTimer > 0) {
    successTimer--;
    if (successTimer === 0) {
      endMinigame(true);
    }
  }
}

export function render(ctx) {
  // Dark overlay
  ctx.fillStyle = 'rgba(0,0,0,0.72)';
  ctx.fillRect(0, 0, 800, 500);

  // Panel shake offset
  const shake = shakeTimer > 0 ? Math.sin(shakeTimer * 1.1) * 6 : 0;

  // Success glow pulse
  if (successTimer > 0) {
    const alpha = (successTimer / 60) * 0.5;
    ctx.fillStyle = `rgba(220,190,40,${alpha})`;
    ctx.fillRect(0, 0, 800, 500);
  }

  // Wooden panel background
  ctx.save();
  ctx.translate(shake, 0);

  ctx.fillStyle = '#7a5020';
  _roundRect(ctx, PANEL_X, PANEL_Y, PANEL_W, PANEL_H, 12);
  ctx.fill();
  ctx.strokeStyle = '#4a2808'; ctx.lineWidth = 3;
  _roundRect(ctx, PANEL_X, PANEL_Y, PANEL_W, PANEL_H, 12);
  ctx.stroke();

  // Inner panel border
  ctx.strokeStyle = '#c8a060'; ctx.lineWidth = 1.5;
  _roundRect(ctx, PANEL_X + 8, PANEL_Y + 8, PANEL_W - 16, PANEL_H - 16, 8);
  ctx.stroke();

  // Panel title
  ctx.fillStyle = '#f4e8c0'; ctx.font = 'bold 14px serif';
  ctx.textAlign = 'center';
  ctx.fillText("Algott's Timekeeper Panel", 400, PANEL_Y + 32);

  // Subtitle hint
  ctx.fillStyle = '#c8b080'; ctx.font = 'italic 10px serif';
  ctx.fillText('Set each dial to the correct hour', 400, PANEL_Y + 50);

  // Draw each clock
  CLOCKS.forEach((c, i) => {
    _drawClock(ctx, c.cx, c.cy, CLOCK_R, hours[i], LABELS[i], i);
  });

  // Confirm button
  const btnX = 334, btnY = PANEL_Y + PANEL_H - 46, btnW = 132, btnH = 32;
  ctx.fillStyle = solved ? '#4a8040' : '#3a5828';
  _roundRect(ctx, btnX, btnY, btnW, btnH, 6);
  ctx.fill();
  ctx.strokeStyle = '#c8a030'; ctx.lineWidth = 1.5;
  _roundRect(ctx, btnX, btnY, btnW, btnH, 6);
  ctx.stroke();
  ctx.fillStyle = '#f0e0a0'; ctx.font = 'bold 12px sans-serif';
  ctx.fillText('Confirm', 400, btnY + 20);

  // Leave button
  const leaveX = 480, leaveY = PANEL_Y + PANEL_H - 46, leaveW = 86, leaveH = 32;
  ctx.fillStyle = '#5a3018';
  _roundRect(ctx, leaveX, leaveY, leaveW, leaveH, 6);
  ctx.fill();
  ctx.strokeStyle = '#8a5020'; ctx.lineWidth = 1.5;
  _roundRect(ctx, leaveX, leaveY, leaveW, leaveH, 6);
  ctx.stroke();
  ctx.fillStyle = '#d4b888'; ctx.font = 'bold 12px sans-serif';
  ctx.fillText('✕ Leave', leaveX + leaveW / 2, leaveY + 20);

  ctx.textAlign = 'left';
  ctx.restore();
}

function _drawClock(ctx, cx, cy, r, hour, label, _idx) {
  // Case
  ctx.beginPath(); ctx.arc(cx, cy, r + 8, 0, Math.PI * 2);
  ctx.fillStyle = '#5a3810'; ctx.fill();
  ctx.strokeStyle = '#2a1808'; ctx.lineWidth = 2; ctx.stroke();

  // Face
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = '#f8f0d8'; ctx.fill();
  ctx.strokeStyle = '#8a6010'; ctx.lineWidth = 1.5; ctx.stroke();

  // Hour marks & numerals
  for (let h = 1; h <= 12; h++) {
    const a = (h / 12) * Math.PI * 2 - Math.PI / 2;
    const tx = cx + Math.cos(a) * (r - 10);
    const ty = cy + Math.sin(a) * (r - 10);
    ctx.fillStyle = '#3a2010'; ctx.font = `bold ${r > 55 ? 9 : 7}px sans-serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(String(h), tx, ty);
  }
  ctx.textBaseline = 'alphabetic';

  // Hour hand
  const ha = ((hour % 12) / 12) * Math.PI * 2 - Math.PI / 2;
  ctx.strokeStyle = '#1a1008'; ctx.lineWidth = 4; ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + Math.cos(ha) * (r - 18), cy + Math.sin(ha) * (r - 18));
  ctx.stroke();

  // Minute hand (always at 12 — clocks are frozen)
  ctx.strokeStyle = '#3a2010'; ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx, cy - r + 8);
  ctx.stroke();
  ctx.lineCap = 'butt';

  // Centre pin
  ctx.beginPath(); ctx.arc(cx, cy, 4, 0, Math.PI * 2);
  ctx.fillStyle = '#8a6010'; ctx.fill();

  // ▲/▼ arrows outside the clock
  ctx.fillStyle = '#c8a030'; ctx.font = 'bold 14px sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('▲', cx, cy - r - 16);
  ctx.fillText('▼', cx, cy + r + 16);

  // Label below
  ctx.fillStyle = '#f4e8c0'; ctx.font = 'bold 11px serif';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(label, cx, cy + r + 36);

  // Current hour readout (small, inside clock at bottom)
  ctx.fillStyle = '#3a2010'; ctx.font = '10px sans-serif';
  ctx.fillText(String(hour), cx, cy + r - 8);

  ctx.textAlign = 'left';
}

function _roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

export function handleClick(x, y) {
  if (shakeTimer > 0 || successTimer > 0) return;

  // Leave button
  const leaveX = 480, leaveY = PANEL_Y + PANEL_H - 46, leaveW = 86, leaveH = 32;
  if (x >= leaveX && x <= leaveX + leaveW && y >= leaveY && y <= leaveY + leaveH) {
    endMinigame(false);
    return;
  }

  // Confirm button
  const btnX = 334, btnY = PANEL_Y + PANEL_H - 46, btnW = 132, btnH = 32;
  if (x >= btnX && x <= btnX + btnW && y >= btnY && y <= btnY + btnH) {
    if (hours[0] === SOLUTION[0] && hours[1] === SOLUTION[1] && hours[2] === SOLUTION[2]) {
      solved = true;
      successTimer = 70;
    } else {
      shakeTimer = 30;
    }
    return;
  }

  // Clock interactions — ▲ zone (above clock) or ▼ zone (below clock)
  CLOCKS.forEach((c, i) => {
    const upY   = c.cy - CLOCK_R - 26;
    const downY = c.cy + CLOCK_R + 6;
    const arrowW = 24, arrowH = 20;

    if (x >= c.cx - arrowW && x <= c.cx + arrowW) {
      if (y >= upY && y <= upY + arrowH) {
        hours[i] = (hours[i] % 12) + 1;
        return;
      }
      if (y >= downY && y <= downY + arrowH) {
        hours[i] = hours[i] === 1 ? 12 : hours[i] - 1;
        return;
      }
    }

    // Also allow clicking directly on the upper/lower half of the clock face
    const dx = x - c.cx, dy = y - c.cy;
    if (dx * dx + dy * dy <= CLOCK_R * CLOCK_R) {
      if (dy < 0) {
        hours[i] = (hours[i] % 12) + 1;
      } else {
        hours[i] = hours[i] === 1 ? 12 : hours[i] - 1;
      }
    }
  });
}
