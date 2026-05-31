// Stepping-stone minigame — cross the underground stream by decoding
// the carved symbols above each column and stepping on the safe stone.
//
// Symbol → safe row mapping (0=top, 1=mid, 2=bottom):
//   Arch  (col 0) → row 1  (middle)
//   Peak  (col 1) → row 0  (top)
//   Bowl  (col 2) → row 2  (bottom)
//   Diamond (col 3) → row 1 (middle)

import { W, H } from '../engine/constants.js';
import { endMinigame } from '../engine/minigame.js';
import { drawRoundRect } from '../render/utils.js';

export const id = 'stonepath';

const COLS       = 4;
const ROWS       = 3;
const COL_X      = [190, 310, 430, 550];   // column x-centres
const ROW_Y      = [230, 310, 390];         // row y-centres
const STONE_W    = 88;
const STONE_H    = 38;
const SAFE_ROW   = [1, 0, 2, 1];           // safe row for each column
const LEFT_BANK_X  = 70;
const RIGHT_BANK_X = 680;
const PLAYER_Y   = 308;                    // feet y on stones / banks

// Symbol names for hint text
const SYM_NAME = ['Arch', 'Peak', 'Bowl', 'Diamond'];

let playerCol   = -1;   // -1 = left bank, 0-3 = on column, 4 = right bank
let shakeTimer  = 0;
let splashCol   = -1;
let splashRow   = -1;
let resetOnShakeEnd = false;  // reset playerCol to -1 when shake finishes
let successTimer = 0;
let done        = false;
let tick        = 0;    // local animation tick

// ── Public API ────────────────────────────────────────────────────────────────

export function reset() {
  playerCol        = -1;
  shakeTimer       = 0;
  splashCol        = -1;
  splashRow        = -1;
  resetOnShakeEnd  = false;
  successTimer     = 0;
  done             = false;
  tick             = 0;
}

export function update() {
  tick++;
  if (shakeTimer > 0) {
    shakeTimer--;
    if (shakeTimer === 0) {
      splashCol = -1;
      splashRow = -1;
      if (resetOnShakeEnd) {
        playerCol       = -1;
        resetOnShakeEnd = false;
      }
    }
  }
  if (successTimer > 0) {
    successTimer--;
    if (successTimer === 0 && done) endMinigame(true);
  }
}

export function handleClick(cx, cy) {
  if (done) return;

  // ── Exit button (top-right) ───────────────────────────────────────────────
  if (cx >= W - 90 && cx <= W - 12 && cy >= 8 && cy <= 36) {
    endMinigame(false);
    return;
  }

  if (shakeTimer > 0) return;

  const nextCol = playerCol + 1;
  if (nextCol > 3) return; // already on last stone, wait for success

  // Check if click hits any stone in the next column
  for (let row = 0; row < ROWS; row++) {
    const sx = COL_X[nextCol];
    const sy = ROW_Y[row];
    if (cx >= sx - STONE_W / 2 && cx <= sx + STONE_W / 2 &&
        cy >= sy - STONE_H / 2 && cy <= sy + STONE_H / 2) {
      _stepOn(nextCol, row);
      return;
    }
  }
}

export function render(ctx) {
  // ── Cave background ───────────────────────────────────────────
  ctx.fillStyle = '#0d0a14';
  ctx.fillRect(0, 0, W, H);

  // Torchlight glow around player
  const px = _playerX();
  const glow = ctx.createRadialGradient(px, PLAYER_Y - 30, 5, px, PLAYER_Y - 30, 220);
  glow.addColorStop(0, 'rgba(255,150,30,0.32)');
  glow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  // Dim ambient glow on symbols from a distant torch
  const ambientGlow = ctx.createRadialGradient(W / 2, 50, 10, W / 2, 50, 260);
  ambientGlow.addColorStop(0, 'rgba(80,60,180,0.18)');
  ambientGlow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = ambientGlow;
  ctx.fillRect(0, 0, W, H);

  // Cave roof (stalactites)
  ctx.fillStyle = '#1a1428';
  ctx.fillRect(0, 0, W, 130);
  _drawStalactites(ctx);

  // Left bank
  ctx.fillStyle = '#241c34';
  ctx.fillRect(0, 140, 120, H - 140);
  // Right bank (exit)
  ctx.fillStyle = '#241c34';
  ctx.fillRect(630, 140, 170, H - 140);

  // Glowing cave exit (right)
  const exitGlow = ctx.createRadialGradient(750, 310, 5, 750, 310, 80);
  exitGlow.addColorStop(0, 'rgba(60,200,120,0.35)');
  exitGlow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = exitGlow;
  ctx.fillRect(630, 240, 170, 150);
  drawRoundRect(ctx, 640, 255, 80, 110, 8, null, '#40c070', 2);
  ctx.fillStyle = 'rgba(60,220,100,0.7)';
  ctx.font = '11px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('EXIT', 680, 318);

  // Underground stream (water)
  ctx.fillStyle = '#0a1a30';
  ctx.fillRect(120, 415, 510, 85);
  // Ripples
  ctx.strokeStyle = 'rgba(40,120,200,0.35)';
  ctx.lineWidth   = 1.5;
  for (let i = 0; i < 8; i++) {
    const rx = 140 + i * 64 + ((tick * 0.5 + i * 7) % 64);
    const ry = 430 + Math.sin(tick * 0.04 + i) * 5;
    ctx.beginPath();
    ctx.moveTo(rx,      ry);
    ctx.bezierCurveTo(rx + 12, ry - 6, rx + 24, ry + 4, rx + 36, ry);
    ctx.stroke();
  }

  // Symbol carvings on ceiling above columns
  _drawSymbols(ctx);

  // Stepping stones
  for (let col = 0; col < COLS; col++) {
    for (let row = 0; row < ROWS; row++) {
      _drawStone(ctx, col, row);
    }
  }

  // Splash effect — only render once the ripple radius is positive
  if (splashCol >= 0) {
    const sx  = COL_X[splashCol];
    const sy  = ROW_Y[splashRow];
    const age = 22 - shakeTimer;
    const r   = age * 7;
    if (r > 0) {
      ctx.strokeStyle = `rgba(60,160,255,${Math.max(0, 0.8 - age * 0.04)})`;
      ctx.lineWidth   = 2.5;
      ctx.beginPath();
      ctx.arc(sx, sy + 20, r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = `rgba(120,200,255,${Math.max(0, 0.6 - age * 0.03)})`;
      ctx.beginPath();
      ctx.arc(sx, sy + 20, r * 0.5, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  // Player icon (small silhouette with torch)
  _drawPlayer(ctx, px, PLAYER_Y);

  // Hint text (top bar)
  ctx.fillStyle = 'rgba(10,8,20,0.72)';
  ctx.fillRect(PANEL_X(), 8, W - 2 * PANEL_X() - 84, 30);
  ctx.fillStyle = 'rgba(200,180,255,0.9)';
  ctx.font = '11px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText(
    'Carved symbols mark each column — read them carefully before you step',
    (PANEL_X() + W - PANEL_X() - 84) / 2, 27
  );

  // Exit button (top-right)
  ctx.fillStyle = 'rgba(80,20,10,0.85)';
  drawRoundRect(ctx, W - 88, 8, 76, 28, 6, 'rgba(80,20,10,0.85)', '#b05030', 1.5);
  ctx.fillStyle = '#ffb080';
  ctx.font      = 'bold 11px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('✕  Leave', W - 50, 26);

  // Success flash
  if (successTimer > 0) {
    const alpha = Math.min(1, successTimer / 40);
    ctx.fillStyle = `rgba(40,200,80,${alpha * 0.4})`;
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = `rgba(80,255,120,${alpha})`;
    ctx.font = 'bold 28px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('✔  You made it across!', W / 2, H / 2);
  }

  ctx.textAlign = 'left';
}

// ── Private helpers ───────────────────────────────────────────────────────────

function PANEL_X() { return 30; }

function _playerX() {
  if (playerCol === -1)  return LEFT_BANK_X;
  if (playerCol === COLS) return RIGHT_BANK_X;
  return COL_X[playerCol];
}

function _stepOn(col, row) {
  if (row === SAFE_ROW[col]) {
    // Safe!
    playerCol = col;
    if (playerCol === COLS - 1) {
      // Reached last column safely — walk to right bank
      done         = true;
      successTimer = 90;
    }
  } else {
    // Fell in!
    splashCol       = col;
    splashRow       = row;
    shakeTimer      = 40;
    resetOnShakeEnd = true;
  }
}

function _drawStone(ctx, col, row) {
  const cx = COL_X[col];
  const cy = ROW_Y[row];

  const onThisStone = (playerCol === col); // player is on this column (any row)
  const isSafe      = (row === SAFE_ROW[col]);
  const nextCol     = playerCol + 1;
  const isReachable = (col === nextCol);

  // Splash stone briefly shows blue tint
  const splashing = (splashCol === col && splashRow === row);

  let fill   = splashing ? '#1060c0' : '#3a3058';
  let stroke = splashing ? '#60b0ff' : (isReachable ? 'rgba(255,220,60,0.5)' : '#504870');
  let lw     = isReachable ? 1.8 : 1;

  drawRoundRect(ctx, cx - STONE_W / 2, cy - STONE_H / 2, STONE_W, STONE_H, 8,
    fill, stroke, lw);

  // Subtle moss texture
  ctx.fillStyle = 'rgba(60,120,60,0.18)';
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.arc(cx - 20 + i * 20, cy + 4, 4 + i, 0, Math.PI * 2);
    ctx.fill();
  }
}

function _drawPlayer(ctx, px, py) {
  // Body
  ctx.fillStyle = '#e8d090';
  ctx.beginPath();
  ctx.ellipse(px, py - 18, 8, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  // Torch glow
  const tg = ctx.createRadialGradient(px + 12, py - 28, 2, px + 12, py - 28, 22);
  tg.addColorStop(0, 'rgba(255,160,30,0.8)');
  tg.addColorStop(1, 'rgba(255,80,0,0)');
  ctx.fillStyle = tg;
  ctx.beginPath();
  ctx.arc(px + 12, py - 28, 22, 0, Math.PI * 2);
  ctx.fill();
  // Torch stick
  ctx.strokeStyle = '#a07030';
  ctx.lineWidth   = 2.5;
  ctx.beginPath();
  ctx.moveTo(px + 8, py - 10);
  ctx.lineTo(px + 14, py - 32);
  ctx.stroke();
  // Flame
  ctx.fillStyle = '#ffb020';
  ctx.beginPath();
  ctx.ellipse(px + 14, py - 34, 4, 6, -0.3, 0, Math.PI * 2);
  ctx.fill();
}

function _drawSymbols(ctx) {
  const symY = 100; // y of symbol centre
  COL_X.forEach((cx, col) => {
    // Stone carving background
    drawRoundRect(ctx, cx - 28, symY - 26, 56, 46, 6, '#1e1630', '#6050a0', 1.2);
    ctx.strokeStyle = '#a090d0';
    ctx.lineWidth   = 2;

    switch (col) {
      case 0: // Arch (Ω)
        ctx.beginPath();
        ctx.arc(cx, symY - 4, 14, Math.PI, 0);
        ctx.lineTo(cx + 14, symY + 12);
        ctx.moveTo(cx - 14, symY + 12);
        ctx.lineTo(cx - 14, symY - 4);
        ctx.stroke();
        break;
      case 1: // Peak (mountain)
        ctx.beginPath();
        ctx.moveTo(cx,      symY - 18);
        ctx.lineTo(cx + 16, symY + 12);
        ctx.lineTo(cx - 16, symY + 12);
        ctx.closePath();
        ctx.stroke();
        break;
      case 2: // Bowl (U)
        ctx.beginPath();
        ctx.arc(cx, symY - 4, 14, 0, Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx - 14, symY - 4);
        ctx.lineTo(cx - 14, symY - 16);
        ctx.moveTo(cx + 14, symY - 4);
        ctx.lineTo(cx + 14, symY - 16);
        ctx.stroke();
        break;
      case 3: // Diamond (◇)
        ctx.beginPath();
        ctx.moveTo(cx,      symY - 18);
        ctx.lineTo(cx + 14, symY - 4);
        ctx.lineTo(cx,      symY + 10);
        ctx.lineTo(cx - 14, symY - 4);
        ctx.closePath();
        ctx.stroke();
        break;
    }

    // Symbol name only — no hint text
    ctx.fillStyle = 'rgba(180,160,240,0.7)';
    ctx.font      = '9px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText(SYM_NAME[col], cx, symY + 28);
  });
}

function _drawStalactites(ctx) {
  ctx.fillStyle = '#150e22';
  const tips = [50, 130, 210, 280, 350, 410, 480, 560, 630, 710, 770];
  tips.forEach((tx, i) => {
    const h = 30 + (i % 3) * 18;
    ctx.beginPath();
    ctx.moveTo(tx - 10, 0);
    ctx.lineTo(tx + 10, 0);
    ctx.lineTo(tx + 2,  h);
    ctx.lineTo(tx - 2,  h);
    ctx.closePath();
    ctx.fill();
  });
}
