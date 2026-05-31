// Plank-laying minigame — repair the broken bridge floor.
//
// Nine planks of different widths (cm) are on a shelf.
// Three gaps of specific widths are in the bridge deck.
// Select planks one-by-one (click to toggle), then click a gap to fit them.
// The combined width of your selected planks must equal the gap exactly.
// Wrong combination: shake.  All three gaps filled: success.
//
// Unique solution:
//   Gap  36 cm → planks  8 + 12 + 16
//   Gap  54 cm → planks 14 + 18 + 22
//   Gap  72 cm → planks 20 + 24 + 28

import { W, H }         from '../engine/constants.js';
import { endMinigame }  from '../engine/minigame.js';
import { drawRoundRect } from '../render/utils.js';

export const id = 'planklay';

// Gap definitions
const GAP_DEFS = [
  { cx: 240, w: 36  },   // narrow  — leftmost
  { cx: 430, w: 54  },   // medium  — middle
  { cx: 590, w: 72  },   // wide    — right
];

// Nine planks, shuffled display order
const PLANK_DEFS = [
  { w: 20, col: '#d4b060', shadow: '#7a5820' },
  { w: 12, col: '#b88830', shadow: '#604010' },
  { w: 28, col: '#e0c070', shadow: '#906030' },
  { w: 16, col: '#c49840', shadow: '#704820' },
  { w: 22, col: '#d8b458', shadow: '#826030' },
  { w:  8, col: '#a87820', shadow: '#504008' },
  { w: 24, col: '#dcba60', shadow: '#8a6230' },
  { w: 14, col: '#c09038', shadow: '#685018' },
  { w: 18, col: '#caa048', shadow: '#786028' },
];

const PLANK_H      = 22;
const DECK_Y       = 220;   // y of bridge deck surface
const SHELF_Y      = 340;   // y of plank shelf
// Shelf positions: 3 per row, 2 rows (+ last row of 3 below)
const SHELF_CX     = [170, 310, 450, 590, 170, 310, 450, 590, 310];

// ── Mutable state ─────────────────────────────────────────────────────────────
let gaps         = [];
let planks       = [];
let selected     = new Set();  // indices of currently selected planks
let shakeGapIdx  = null;
let shakeTimer   = 0;
let nailTimers   = [];
let successTimer = 0;
let done         = false;

// ── Public API ────────────────────────────────────────────────────────────────

export function reset() {
  gaps         = GAP_DEFS .map(g => ({ ...g, filled: false }));
  planks       = PLANK_DEFS.map(p => ({ ...p, placed: false }));
  selected     = new Set();
  shakeGapIdx  = null;
  shakeTimer   = 0;
  nailTimers   = [0, 0, 0];
  successTimer = 0;
  done         = false;
}

export function update() {
  if (shakeTimer   > 0) shakeTimer--;
  nailTimers = nailTimers.map(t => Math.max(0, t - 1));
  if (successTimer > 0) {
    successTimer--;
    if (successTimer === 0 && done) endMinigame(true);
  }
}

export function handleClick(cx, cy) {
  if (done || shakeTimer > 0) return;

  // ── Click on a gap ────────────────────────────────────────────────────────
  for (let j = 0; j < gaps.length; j++) {
    if (gaps[j].filled) continue;
    const g = gaps[j];
    if (cx >= g.cx - g.w / 2 - 12 && cx <= g.cx + g.w / 2 + 12 &&
        cy >= DECK_Y - 10         && cy <= DECK_Y + 30) {
      _tryFit(j);
      return;
    }
  }

  // ── Click on a shelf plank ────────────────────────────────────────────────
  for (let i = 0; i < planks.length; i++) {
    if (planks[i].placed) continue;
    const sx = SHELF_CX[i];
    const sy = _shelfY(i);
    const p  = planks[i];
    if (cx >= sx - p.w / 2 - 4 && cx <= sx + p.w / 2 + 4 &&
        cy >= sy               && cy <= sy + PLANK_H) {
      if (selected.has(i)) {
        selected.delete(i);
      } else {
        selected.add(i);
      }
      return;
    }
  }

  // Click elsewhere — deselect all
  selected.clear();
}

export function render(ctx) {
  // Dark overlay
  ctx.fillStyle = 'rgba(10,8,20,0.88)';
  ctx.fillRect(0, 0, W, H);

  // Panel
  drawRoundRect(ctx, 60, 44, 680, 440, 14, '#1e1810', '#805030', 2);

  // Title
  ctx.fillStyle = '#f0d880';
  ctx.font = 'bold 17px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('🔨  Repair the Bridge Floor  🔨', W / 2, 72);

  // Selection count hint
  const selCount = selected.size;
  ctx.fillStyle = '#a08048';
  ctx.font = 'italic 11px Georgia, serif';
  ctx.fillText(
    selCount === 0
      ? 'Select planks from the shelf, then click a gap to fit them.'
      : `${selCount} plank${selCount > 1 ? 's' : ''} selected — click a gap to try fitting`,
    W / 2, 92);

  // Divider
  ctx.strokeStyle = 'rgba(160,100,40,0.4)';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(80, 102); ctx.lineTo(720, 102); ctx.stroke();

  // Bridge deck illustration
  _drawBridgeSection(ctx);

  // Plank shelf
  _drawShelf(ctx);

  // Success flash
  if (successTimer > 0) {
    const alpha = Math.min(1, successTimer / 40);
    ctx.fillStyle = `rgba(80,200,80,${alpha * 0.35})`;
    ctx.fillRect(60, 44, 680, 440);
    ctx.fillStyle = `rgba(100,255,100,${alpha})`;
    ctx.font = 'bold 26px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('✔  Bridge Floor Repaired!', W / 2, H / 2);
  }

  ctx.textAlign = 'left';
}

// ── Private helpers ───────────────────────────────────────────────────────────

function _shelfY(i) {
  // Two rows: indices 0–3 on first shelf row, 4–8 on second
  return i < 5 ? SHELF_Y : SHELF_Y + PLANK_H + 12;
}

function _tryFit(gapIdx) {
  const g = gaps[gapIdx];
  const sel = [...selected];

  if (sel.length === 0) {
    // Nothing selected — just describe the gap
    shakeGapIdx = gapIdx;
    shakeTimer  = 12;
    return;
  }

  const totalW = sel.reduce((s, i) => s + planks[i].w, 0);

  if (totalW === g.w) {
    // Correct! Fit all selected planks into this gap
    sel.forEach(i => { planks[i].placed = true; });
    gaps[gapIdx].filled = true;
    gaps[gapIdx].filledWith = sel.map(i => planks[i]);
    nailTimers[gapIdx] = 55;
    selected.clear();
    if (gaps.every(g2 => g2.filled)) {
      done         = true;
      successTimer = 90;
    }
  } else {
    // Wrong — shake the gap
    shakeGapIdx = gapIdx;
    shakeTimer  = 22;
    selected.clear();
  }
}

function _drawBridgeSection(ctx) {
  const deckH = 24;

  // Solid deck background
  ctx.fillStyle = '#c8a060';
  ctx.fillRect(80, DECK_Y, 640, deckH);

  // Plank grain lines
  ctx.strokeStyle = '#7a5020'; ctx.lineWidth = 1;
  for (let x = 80; x < 720; x += 20) {
    ctx.beginPath(); ctx.moveTo(x, DECK_Y); ctx.lineTo(x, DECK_Y + deckH); ctx.stroke();
  }

  // Each gap or filled section
  gaps.forEach((g, i) => {
    const shakeX = (shakeGapIdx === i && shakeTimer > 0)
      ? Math.sin(shakeTimer * 1.5) * 5 : 0;

    if (!g.filled) {
      // Dark hole — show required total width but NOT as "X cm" label
      ctx.fillStyle = '#1a0c04';
      ctx.fillRect(g.cx - g.w / 2 + shakeX, DECK_Y, g.w, deckH);
      ctx.strokeStyle = shakeGapIdx === i ? '#ff4020' : '#3a1808';
      ctx.lineWidth = shakeGapIdx === i ? 2.5 : 1;
      ctx.strokeRect(g.cx - g.w / 2 + shakeX, DECK_Y, g.w, deckH);

      // Small measurement marks on gap edges (ambiguous cues, not explicit)
      ctx.strokeStyle = 'rgba(200,160,60,0.5)'; ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(g.cx - g.w / 2 + shakeX,       DECK_Y - 8);
      ctx.lineTo(g.cx + g.w / 2 + shakeX,       DECK_Y - 8);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(g.cx - g.w / 2 + shakeX, DECK_Y - 12);
      ctx.lineTo(g.cx - g.w / 2 + shakeX, DECK_Y - 4);
      ctx.moveTo(g.cx + g.w / 2 + shakeX, DECK_Y - 12);
      ctx.lineTo(g.cx + g.w / 2 + shakeX, DECK_Y - 4);
      ctx.stroke();
    } else {
      // Filled — draw layered planks
      const pieces = g.filledWith || [];
      let px = g.cx - g.w / 2;
      pieces.forEach(p => {
        ctx.fillStyle = p.col;
        ctx.fillRect(px, DECK_Y, p.w, deckH);
        ctx.strokeStyle = p.shadow; ctx.lineWidth = 1;
        ctx.strokeRect(px, DECK_Y, p.w, deckH);
        px += p.w;
      });

      // Nail animation
      if (nailTimers[i] > 0) {
        const alpha = Math.min(1, nailTimers[i] / 20);
        ctx.fillStyle = `rgba(255,200,60,${alpha})`;
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🔨', g.cx, DECK_Y - 4);
        const bounce = Math.abs(Math.sin(nailTimers[i] * 0.35)) * 4;
        ctx.fillStyle = `rgba(150,150,150,${alpha})`;
        ctx.beginPath(); ctx.arc(g.cx, DECK_Y + 4 + bounce, 3, 0, Math.PI * 2); ctx.fill();
      }
    }
  });

  // Support beams
  ctx.fillStyle = '#7a4810';
  [200, 310, 420, 530, 620].forEach(bx => {
    ctx.fillRect(bx - 6, DECK_Y + deckH, 12, 14);
  });
  ctx.fillStyle = '#5a3010';
  ctx.fillRect(80, DECK_Y + deckH + 14, 640, 8);

  ctx.fillStyle = 'rgba(200,160,80,0.5)';
  ctx.font = 'italic 11px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('Bridge Deck', W / 2, DECK_Y + deckH + 40);
}

function _drawShelf(ctx) {
  const rowY1 = SHELF_Y - 22;
  const rowH  = PLANK_H * 2 + 12 + 26;
  drawRoundRect(ctx, 80, rowY1, 640, rowH + 16, 8, '#2a1a08', '#6a4020', 1.5);

  ctx.fillStyle = '#b09060'; ctx.font = '11px Georgia, serif'; ctx.textAlign = 'center';
  ctx.fillText('Available Planks', W / 2, rowY1 + 14);

  planks.forEach((p, i) => {
    if (p.placed) return;
    const px         = SHELF_CX[i];
    const py         = _shelfY(i);
    const isSelected = selected.has(i);

    drawRoundRect(ctx,
      px - p.w / 2, py, p.w, PLANK_H, 4,
      isSelected ? '#ffe080' : p.col,
      isSelected ? '#c08000' : p.shadow,
      isSelected ? 2.5 : 1.5);

    // Grain lines
    ctx.strokeStyle = isSelected ? 'rgba(160,100,0,0.4)' : 'rgba(80,40,5,0.3)';
    ctx.lineWidth   = 0.7;
    for (let lx = px - p.w / 2 + 8; lx < px + p.w / 2 - 4; lx += 10) {
      ctx.beginPath(); ctx.moveTo(lx, py + 3); ctx.lineTo(lx, py + PLANK_H - 3); ctx.stroke();
    }

    // Width label on plank
    ctx.fillStyle = isSelected ? '#1a0000' : '#1a0c04';
    ctx.font      = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(p.w + ' cm', px, py + PLANK_H / 2 + 3);

    // Selected indicator
    if (isSelected) {
      ctx.fillStyle = 'rgba(255,220,60,0.9)';
      ctx.font = '11px sans-serif';
      ctx.fillText('▲', px, py - 4);
    }
  });
}
