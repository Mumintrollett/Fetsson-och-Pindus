// Counterweight minigame — balance the scale to open the gate.
//
// Eight stone weights sit on a shelf.  Place them on left and right scale pans.
// When the total weight on both pans is equal (and non-zero), the gate opens.
// Click a weight on the shelf → select it.  Click a pan → place it there.
// Click a weight already on a pan → return it to the shelf.
//
// Weights: 3, 5, 6, 7, 8, 9, 11, 13  (total = 62; must balance at 31 per side)
// Many valid splits exist — the player just needs to find any one.

import { W, H }          from '../engine/constants.js';
import { endMinigame }   from '../engine/minigame.js';
import { drawRoundRect } from '../render/utils.js';

export const id = 'counterweight';

// ── Constants ─────────────────────────────────────────────────────────────────

const WEIGHT_VALS = [3, 5, 6, 7, 8, 9, 11, 13];

const BEAM_CX  = W / 2;
const BEAM_Y   = 178;
const ARM_LEN  = 200;
const PAN_W    = 110;
const PAN_H    = 18;
const PAN_CX_L = BEAM_CX - ARM_LEN + 28;
const PAN_CX_R = BEAM_CX + ARM_LEN - 28;

// Shelf — 5 stones on row 1, 3 on row 2
const SHELF_CX = [130, 235, 340, 445, 550, 185, 340, 495];
const SHELF_Y1 = 366;
const SHELF_Y2 = 412;
const STONE_R  = 21;

// ── Mutable state ─────────────────────────────────────────────────────────────
let stones       = [];
let selected     = null;
let tilt         = 0;
let targetTilt   = 0;
let successTimer = 0;
let done         = false;

// ── Public API ────────────────────────────────────────────────────────────────

export function reset() {
  stones = WEIGHT_VALS.map((w, i) => ({
    w,
    pan: null,
    shelfIdx: i,
    col: _stoneColor(w),
  }));
  selected     = null;
  tilt         = 0;
  targetTilt   = 0;
  successTimer = 0;
  done         = false;
}

export function update() {
  tilt += (targetTilt - tilt) * 0.12;
  if (Math.abs(tilt - targetTilt) < 0.0002) tilt = targetTilt;
  if (successTimer > 0) {
    successTimer--;
    if (successTimer === 0 && done) endMinigame(true);
  }
}

export function handleClick(cx, cy) {
  if (done) return;

  // ── Click on a stone already placed on a pan ──────────────────────────────
  for (let i = 0; i < stones.length; i++) {
    const s = stones[i];
    if (!s.pan) continue;
    const { x, y } = _panStonePos(s.pan, stones.indexOf(s));
    if (Math.hypot(cx - x, cy - y) <= STONE_R + 6) {
      s.pan    = null;
      selected = i;
      _computeTilt();
      return;
    }
  }

  // ── Click on a shelf stone ────────────────────────────────────────────────
  for (let i = 0; i < stones.length; i++) {
    const s = stones[i];
    if (s.pan !== null) continue;
    const { x, y } = _shelfPos(s.shelfIdx);
    if (Math.hypot(cx - x, cy - y) <= STONE_R + 6) {
      selected = (selected === i) ? null : i;
      return;
    }
  }

  // ── Click on a pan when stone is selected ─────────────────────────────────
  if (selected !== null) {
    const leftPanY  = _panY('left');
    const rightPanY = _panY('right');

    if (_inPan(cx, cy, PAN_CX_L, leftPanY)) {
      stones[selected].pan = 'left';
      selected = null;
      _computeTilt();
      _checkWin();
      return;
    }
    if (_inPan(cx, cy, PAN_CX_R, rightPanY)) {
      stones[selected].pan = 'right';
      selected = null;
      _computeTilt();
      _checkWin();
      return;
    }
  }

  // Click elsewhere → deselect
  selected = null;
}

export function render(ctx) {
  ctx.fillStyle = 'rgba(10,8,20,0.88)';
  ctx.fillRect(0, 0, W, H);

  drawRoundRect(ctx, 60, 44, 680, 462, 14, '#1e1810', '#805030', 2);

  ctx.fillStyle = '#f0d880';
  ctx.font = 'bold 17px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('⚖️  Balance the Scale  ⚖️', W / 2, 72);

  ctx.fillStyle = '#a08048';
  ctx.font = 'italic 11px Georgia, serif';
  ctx.fillText(
    selected !== null
      ? `Weight ${stones[selected].w} selected — click a pan`
      : 'Select a weight from the shelf, then click a pan to place it',
    W / 2, 91);

  ctx.strokeStyle = 'rgba(160,100,40,0.4)';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(80, 101); ctx.lineTo(720, 101); ctx.stroke();

  _drawScale(ctx);
  _drawShelf(ctx);

  if (successTimer > 0) {
    const alpha = Math.min(1, successTimer / 40);
    ctx.fillStyle = `rgba(80,200,80,${alpha * 0.35})`;
    ctx.fillRect(60, 44, 680, 462);
    ctx.fillStyle = `rgba(100,255,100,${alpha})`;
    ctx.font = 'bold 26px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('✔  The gate creaks open!', W / 2, H / 2);
  }

  ctx.textAlign = 'left';
}

// ── Private helpers ───────────────────────────────────────────────────────────

function _computeTilt() {
  const lw = _panSum('left');
  const rw = _panSum('right');
  targetTilt = Math.max(-0.28, Math.min(0.28, (lw - rw) * 0.013));
}

function _checkWin() {
  const lw = _panSum('left');
  const rw = _panSum('right');
  if (lw > 0 && rw > 0 && lw === rw) {
    done         = true;
    successTimer = 90;
  }
}

function _panSum(side) {
  return stones.filter(s => s.pan === side).reduce((a, s) => a + s.w, 0);
}

function _panY(side) {
  return side === 'left'
    ? BEAM_Y + Math.sin(-tilt) * ARM_LEN + 18
    : BEAM_Y + Math.sin( tilt) * ARM_LEN + 18;
}

function _inPan(cx, cy, panCX, panY) {
  return cx >= panCX - PAN_W / 2 - 10 && cx <= panCX + PAN_W / 2 + 10 &&
         cy >= panY - 10               && cy <= panY + PAN_H + 24;
}

function _panStonePos(side, stoneIdx) {
  // All pan stones on this side, ordered by stone index for stable layout
  const panList = stones
    .map((s, i) => ({ s, i }))
    .filter(({ s }) => s.pan === side);
  const posInPan = panList.findIndex(({ i }) => i === stoneIdx);
  const count    = panList.length;
  const panCX    = side === 'left' ? PAN_CX_L : PAN_CX_R;
  const panY     = _panY(side);
  const row      = Math.floor(posInPan / 3);
  const col      = posInPan % 3;
  const startX   = panCX - (Math.min(count, 3) - 1) * STONE_R * 1.45 / 2;
  return {
    x: startX + col * STONE_R * 1.45,
    y: panY - STONE_R * (0.65 + row),
  };
}

function _shelfPos(idx) {
  return {
    x: SHELF_CX[idx],
    y: idx < 5 ? SHELF_Y1 : SHELF_Y2,
  };
}

function _stoneColor(w) {
  const t = (w - 3) / 10;
  const r = Math.round(100 + t * 55);
  const g = Math.round(90  + t * 45);
  const b = Math.round(80  + t * 40);
  return `rgb(${r},${g},${b})`;
}

function _drawScale(ctx) {
  const lw = _panSum('left');
  const rw = _panSum('right');

  // Pivot post
  ctx.fillStyle = '#7a5020';
  ctx.fillRect(BEAM_CX - 7, BEAM_Y, 14, 70);
  ctx.fillStyle = '#b08040';
  ctx.beginPath(); ctx.arc(BEAM_CX, BEAM_Y, 9, 0, Math.PI * 2); ctx.fill();

  // Tilted beam
  ctx.save();
  ctx.translate(BEAM_CX, BEAM_Y);
  ctx.rotate(tilt);

  ctx.fillStyle = '#5a3010';
  ctx.fillRect(-ARM_LEN, -5, ARM_LEN * 2, 10);
  ctx.strokeStyle = '#3a1a08'; ctx.lineWidth = 1.5;
  ctx.strokeRect(-ARM_LEN, -5, ARM_LEN * 2, 10);

  // Chains
  ctx.strokeStyle = '#909090'; ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-ARM_LEN + 28, 4); ctx.lineTo(-ARM_LEN + 28, 26);
  ctx.moveTo( ARM_LEN - 28, 4); ctx.lineTo( ARM_LEN - 28, 26);
  ctx.stroke();

  // Pans
  const balanced = lw > 0 && lw === rw;
  [[-ARM_LEN + 28, lw], [ARM_LEN - 28, rw]].forEach(([ax, panW]) => {
    ctx.fillStyle = balanced ? 'rgba(100,220,100,0.4)' : 'rgba(90,60,20,0.45)';
    ctx.strokeStyle = balanced ? '#60cc60' : '#8a6030';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.ellipse(ax, 26 + PAN_H / 2, PAN_W / 2, PAN_H / 2, 0, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();
  });

  ctx.restore();

  // Weight totals (drawn in screen space so they don't rotate)
  const balanced2 = lw > 0 && lw === rw;
  ctx.fillStyle = balanced2 ? '#80ff80' : 'rgba(200,180,120,0.85)';
  ctx.font = 'bold 13px Georgia, serif';
  ctx.textAlign = 'center';
  const leftPanY  = _panY('left');
  const rightPanY = _panY('right');
  ctx.fillText(`${lw} kg`, PAN_CX_L, leftPanY  + PAN_H + 18);
  ctx.fillText(`${rw} kg`, PAN_CX_R, rightPanY + PAN_H + 18);

  // Stones on pans
  for (let i = 0; i < stones.length; i++) {
    if (!stones[i].pan) continue;
    const { x, y } = _panStonePos(stones[i].pan, i);
    _drawStone(ctx, x, y, stones[i], i === selected);
  }
}

function _drawShelf(ctx) {
  const shelfTop = SHELF_Y1 - STONE_R - 8;
  const shelfBot = SHELF_Y2 + STONE_R + 8;
  drawRoundRect(ctx, 80, shelfTop, 640, shelfBot - shelfTop, 8, '#2a1a08', '#6a4020', 1.5);
  ctx.fillStyle = '#b09060'; ctx.font = '11px Georgia, serif'; ctx.textAlign = 'center';
  ctx.fillText('Available Weights', W / 2, shelfTop + 14);

  stones.forEach((s, i) => {
    if (s.pan !== null) return;
    const { x, y } = _shelfPos(s.shelfIdx);
    _drawStone(ctx, x, y, s, i === selected);
  });
}

function _drawStone(ctx, x, y, stone, isSelected) {
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.beginPath(); ctx.ellipse(x, y + STONE_R + 1, STONE_R * 0.75, 3.5, 0, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle   = isSelected ? '#ffe080' : stone.col;
  ctx.strokeStyle = isSelected ? '#c08000' : '#2a1a08';
  ctx.lineWidth   = isSelected ? 2.5 : 1.5;
  ctx.beginPath(); ctx.arc(x, y, STONE_R, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

  ctx.fillStyle = 'rgba(255,255,255,0.14)';
  ctx.beginPath(); ctx.ellipse(x - 5, y - 6, 7, 4, -0.5, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = isSelected ? '#1a0000' : '#f0e0c0';
  ctx.font      = 'bold 11px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(stone.w, x, y + 4);
}
