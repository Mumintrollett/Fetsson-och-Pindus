// Plank-laying minigame — repair the broken bridge floor.
//
// Three gaps of different widths appear in the bridge deck.
// Three planks (same three widths, shuffled order) wait on a shelf.
// Select a plank, then click the matching gap.  Width must match exactly.
// Wrong width: short shake.  All three placed: success.

import { W, H }         from '../engine/constants.js';
import { endMinigame }  from '../engine/minigame.js';
import { drawRoundRect } from '../render/utils.js';

export const id = 'planklay';

// Gap positions in the bridge floor illustration (cx = centre x, w = width in "cm" units)
const GAP_DEFS = [
  { cx: 240, w: 72  },   // narrow gap — leftmost
  { cx: 430, w: 112 },   // wide gap   — middle
  { cx: 570, w: 90  },   // medium gap — right
];

// Planks presented in scrambled order so the player must match visually
const PLANK_DEFS = [
  { w: 112, col: '#d0a850', shadow: '#7a5820' },  // wide
  { w: 90,  col: '#c89840', shadow: '#704810' },  // medium
  { w: 72,  col: '#b88830', shadow: '#604010' },  // narrow
];

const PLANK_H      = 22;
const DECK_Y       = 242;   // y of bridge deck surface in the minigame illustration
const SHELF_Y      = 356;   // y of plank shelf
const SHELF_STARTS = [160, 370, 560]; // x-centres of planks on the shelf

// ── Mutable state ─────────────────────────────────────────────────────────────
let gaps        = [];
let planks      = [];
let selected    = null;   // index into planks[]
let shakeGapIdx = null;
let shakeTimer  = 0;
let nailTimers  = [];     // per-gap hammer-animation countdown
let successTimer = 0;
let done        = false;

// ── Public API ────────────────────────────────────────────────────────────────

export function reset() {
  gaps        = GAP_DEFS .map(g => ({ ...g, filled: false }));
  planks      = PLANK_DEFS.map(p => ({ ...p, placed: false }));
  selected    = null;
  shakeGapIdx = null;
  shakeTimer  = 0;
  nailTimers  = [0, 0, 0];
  successTimer = 0;
  done        = false;
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

  // ── Click on a plank (shelf area) ─────────────────────────────────────────
  for (let i = 0; i < planks.length; i++) {
    if (planks[i].placed) continue;
    const p  = planks[i];
    const px = SHELF_STARTS[i];
    if (cx >= px - p.w / 2 && cx <= px + p.w / 2 &&
        cy >= SHELF_Y && cy <= SHELF_Y + PLANK_H) {
      selected = i;
      return;
    }
  }

  // ── Click on a gap while a plank is selected ──────────────────────────────
  if (selected !== null) {
    for (let j = 0; j < gaps.length; j++) {
      if (gaps[j].filled) continue;
      const g = gaps[j];
      if (cx >= g.cx - g.w / 2 - 8 && cx <= g.cx + g.w / 2 + 8 &&
          cy >= DECK_Y - 8        && cy <= DECK_Y + 26 + 8) {
        const plank = planks[selected];
        if (plank.w === g.w) {
          // Correct width — snap in and start nail animation
          gaps[j].filled     = true;
          planks[selected].placed = true;
          nailTimers[j] = 50;
          selected = null;
          if (gaps.every(g2 => g2.filled)) {
            done         = true;
            successTimer = 90;
          }
        } else {
          // Wrong width — shake the gap
          shakeGapIdx = j;
          shakeTimer  = 22;
          selected    = null;
        }
        return;
      }
    }
  }

  // Click elsewhere — deselect
  selected = null;
}

export function render(ctx) {
  // Dark overlay
  ctx.fillStyle = 'rgba(10,8,20,0.88)';
  ctx.fillRect(0, 0, W, H);

  // Panel
  drawRoundRect(ctx, 60, 44, 680, 412, 14, '#1e1810', '#805030', 2);

  // Title
  ctx.fillStyle = '#f0d880';
  ctx.font = 'bold 17px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('🔨  Repair the Bridge Floor  🔨', W / 2, 72);

  // Instructions
  ctx.fillStyle = '#c0a060';
  ctx.font = 'italic 12px Georgia, serif';
  ctx.fillText('Select a plank from the shelf, then click the matching gap.', W / 2, 92);
  ctx.fillText('Each plank must fit exactly — the width in cm must match!', W / 2, 106);

  // Divider
  ctx.strokeStyle = 'rgba(160,100,40,0.4)';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(80, 116); ctx.lineTo(720, 116); ctx.stroke();

  // Bridge-floor illustration
  _drawBridgeSection(ctx);

  // Plank shelf
  _drawShelf(ctx);

  // Success flash
  if (successTimer > 0) {
    const alpha = Math.min(1, successTimer / 40);
    ctx.fillStyle = `rgba(80,200,80,${alpha * 0.35})`;
    ctx.fillRect(60, 44, 680, 412);
    ctx.fillStyle = `rgba(100,255,100,${alpha})`;
    ctx.font = 'bold 26px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('✔  Bridge Floor Repaired!', W / 2, H / 2);
  }

  ctx.textAlign = 'left';
}

// ── Private helpers ───────────────────────────────────────────────────────────

function _drawBridgeSection(ctx) {
  const deckH  = 24;

  // Solid deck planks on both sides (background)
  ctx.fillStyle = '#c8a060';
  ctx.fillRect(80, DECK_Y, 640, deckH);

  // Plank grain lines on the solid deck
  ctx.strokeStyle = '#7a5020';
  ctx.lineWidth = 1;
  for (let x = 80; x < 720; x += 22) {
    ctx.beginPath(); ctx.moveTo(x, DECK_Y); ctx.lineTo(x, DECK_Y + deckH); ctx.stroke();
  }

  // Draw each gap or filled plank
  gaps.forEach((g, i) => {
    const shakeX = (shakeGapIdx === i && shakeTimer > 0)
      ? Math.sin(shakeTimer * 1.5) * 5 : 0;

    if (!g.filled) {
      // Dark gap in the deck
      ctx.fillStyle = '#1a0c04';
      ctx.fillRect(g.cx - g.w / 2 + shakeX, DECK_Y, g.w, deckH);
      ctx.strokeStyle = shakeGapIdx === i ? '#ff4020' : '#3a1808';
      ctx.lineWidth = shakeGapIdx === i ? 2 : 1;
      ctx.strokeRect(g.cx - g.w / 2 + shakeX, DECK_Y, g.w, deckH);

      // Width label above gap
      ctx.fillStyle = '#e0b060';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(g.w + ' cm', g.cx + shakeX, DECK_Y - 5);
    } else {
      // Filled — draw placed plank
      const plankDef = PLANK_DEFS.find(p => p.w === g.w);
      ctx.fillStyle = plankDef ? plankDef.col : '#c8a060';
      ctx.fillRect(g.cx - g.w / 2, DECK_Y, g.w, deckH);
      ctx.strokeStyle = plankDef ? plankDef.shadow : '#7a5020';
      ctx.lineWidth = 1;
      ctx.strokeRect(g.cx - g.w / 2, DECK_Y, g.w, deckH);

      // Hammer animation
      if (nailTimers[i] > 0) {
        const alpha = Math.min(1, nailTimers[i] / 20);
        ctx.fillStyle = `rgba(255,200,60,${alpha})`;
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🔨', g.cx, DECK_Y - 4);
        // Bouncing nail-head
        const bounce = Math.abs(Math.sin(nailTimers[i] * 0.35)) * 4;
        ctx.fillStyle = `rgba(150,150,150,${alpha})`;
        ctx.beginPath(); ctx.arc(g.cx, DECK_Y + 4 + bounce, 3, 0, Math.PI * 2); ctx.fill();
      }
    }
  });

  // Support beams below deck
  ctx.fillStyle = '#7a4810';
  [200, 310, 420, 530, 620].forEach(bx => {
    ctx.fillRect(bx - 6, DECK_Y + deckH, 12, 14);
  });

  // Bottom beam (ravine edge)
  ctx.fillStyle = '#5a3010';
  ctx.fillRect(80, DECK_Y + deckH + 14, 640, 8);

  // Labels
  ctx.fillStyle = 'rgba(200,160,80,0.6)';
  ctx.font = 'italic 11px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('Bridge Deck', W / 2, DECK_Y + deckH + 38);
}

function _drawShelf(ctx) {
  // Shelf background
  drawRoundRect(ctx, 80, SHELF_Y - 22, 640, 58, 8, '#2a1a08', '#6a4020', 1.5);

  ctx.fillStyle = '#b09060';
  ctx.font = '11px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('Available Planks', W / 2, SHELF_Y - 8);

  planks.forEach((p, i) => {
    if (p.placed) return;
    const px         = SHELF_STARTS[i];
    const isSelected = (i === selected);
    const py         = SHELF_Y + (isSelected ? -5 : 0);

    drawRoundRect(ctx,
      px - p.w / 2, py, p.w, PLANK_H, 4,
      isSelected ? '#ffe080' : p.col,
      isSelected ? '#c08000' : p.shadow,
      isSelected ? 2.5 : 1.5);

    // Grain lines
    ctx.strokeStyle = isSelected ? 'rgba(160,100,0,0.4)' : 'rgba(80,40,5,0.3)';
    ctx.lineWidth   = 0.7;
    for (let lx = px - p.w / 2 + 10; lx < px + p.w / 2 - 5; lx += 12) {
      ctx.beginPath(); ctx.moveTo(lx, py + 3); ctx.lineTo(lx, py + PLANK_H - 3); ctx.stroke();
    }

    // Width label on plank
    ctx.fillStyle = isSelected ? '#1a0000' : '#1a0c04';
    ctx.font      = 'bold 10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(p.w + ' cm', px, py + PLANK_H / 2 + 4);

    // Selection arrow hint
    if (isSelected) {
      ctx.fillStyle = 'rgba(255,220,60,0.9)';
      ctx.font = '11px sans-serif';
      ctx.fillText('▲ click a gap', px, py - 8);
    }
  });
}
