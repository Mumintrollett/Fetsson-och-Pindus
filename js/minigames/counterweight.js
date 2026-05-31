// Counterweight minigame — stack four stone blocks in the correct order
// (heaviest at the base, lightest at the crown) to raise the bridge gate.
//
// Riddle: Star(4) > Moon(3) > Sun(2) > Cloud(1)
// Correct placement order: Star → Moon → Sun → Cloud

import { W, H } from '../engine/constants.js';
import { endMinigame } from '../engine/minigame.js';
import { drawRoundRect } from '../render/utils.js';

export const id = 'counterweight';

// Stone definitions — shuffled display order so player can't just click top-to-bottom
const STONE_DEFS = [
  { icon: '☁️', label: 'Cloud', weight: 1, w: 60,  col: '#b0c4de', shadow: '#7090a8' },
  { icon: '⭐', label: 'Star',  weight: 4, w: 140, col: '#e8c040', shadow: '#b09020' },
  { icon: '☀️', label: 'Sun',   weight: 2, w: 88,  col: '#e0a828', shadow: '#b08010' },
  { icon: '🌙', label: 'Moon',  weight: 3, w: 114, col: '#c8d8f0', shadow: '#8898b8' },
];
const STONE_H    = 38;
const LEFT_CX    = 230;  // x-centre of left (source) column
const RIGHT_CX   = 560;  // x-centre of right (pedestal) column
const PEDESTAL_Y = 418;  // y of pedestal top surface
const PANEL      = { x: 80, y: 44, w: 640, h: 412 };

// Mutable state
let sourceStones = [];   // indices into STONE_DEFS still on the left
let stack        = [];   // stone defs placed on pedestal (bottom → top)
let selectedIdx  = null; // index in sourceStones that is selected
let shakeTimer   = 0;    // frames left in wrong-placement shake
let successTimer = 0;    // frames left in success celebration
let done         = false;

// ── Public API ────────────────────────────────────────────────────────────────

export function reset() {
  sourceStones = [0, 1, 2, 3]; // indices into STONE_DEFS (already shuffled above)
  stack        = [];
  selectedIdx  = null;
  shakeTimer   = 0;
  successTimer = 0;
  done         = false;
}

export function update() {
  if (shakeTimer   > 0) shakeTimer--;
  if (successTimer > 0) {
    successTimer--;
    if (successTimer === 0 && done) endMinigame(true);
  }
}

export function handleClick(cx, cy) {
  if (done) return;
  if (shakeTimer > 0) return;

  // Click on left (source) stones
  const srcY0 = _leftTopY();
  for (let i = 0; i < sourceStones.length; i++) {
    const s = STONE_DEFS[sourceStones[i]];
    const y = srcY0 + i * (STONE_H + 8);
    if (cx >= LEFT_CX - s.w / 2 && cx <= LEFT_CX + s.w / 2 &&
        cy >= y                  && cy <= y + STONE_H) {
      selectedIdx = i;
      return;
    }
  }

  // Click on pedestal area (right side) while a stone is selected
  if (selectedIdx !== null &&
      cx >= RIGHT_CX - 80 && cx <= RIGHT_CX + 80 &&
      cy >= PEDESTAL_Y - STONE_H * 5 && cy <= PEDESTAL_Y + 20) {
    _placeStone();
    return;
  }

  // Click elsewhere → deselect
  selectedIdx = null;
}

export function render(ctx) {
  // ── Dark overlay ──────────────────────────────────────────────
  ctx.fillStyle = 'rgba(10,8,20,0.88)';
  ctx.fillRect(0, 0, W, H);

  // ── Panel ─────────────────────────────────────────────────────
  drawRoundRect(ctx, PANEL.x, PANEL.y, PANEL.w, PANEL.h, 14,
    '#2a2040', '#8060c0', 2);

  // Title
  ctx.fillStyle = '#f0d880';
  ctx.font = 'bold 17px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('⚙  Counterweight Gate  ⚙', W / 2, PANEL.y + 28);

  // Riddle plaque
  _drawRiddlePlaque(ctx);

  // Divider
  ctx.strokeStyle = 'rgba(150,120,220,0.35)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(PANEL.x + 20, PANEL.y + 118);
  ctx.lineTo(PANEL.x + PANEL.w - 20, PANEL.y + 118);
  ctx.stroke();

  // Column labels
  ctx.fillStyle = 'rgba(220,200,255,0.6)';
  ctx.font = '11px Georgia, serif';
  ctx.fillText('STONES', LEFT_CX, PANEL.y + 133);
  ctx.fillText('PEDESTAL', RIGHT_CX, PANEL.y + 133);

  // Left column stones
  _drawSourceStones(ctx);

  // Right pedestal & stack
  _drawPedestal(ctx);

  // Success flash
  if (successTimer > 0) {
    const alpha = Math.min(1, successTimer / 40);
    ctx.fillStyle = `rgba(80,220,80,${alpha * 0.35})`;
    ctx.fillRect(PANEL.x, PANEL.y, PANEL.w, PANEL.h);
    ctx.fillStyle = `rgba(80,255,80,${alpha})`;
    ctx.font = 'bold 28px Georgia, serif';
    ctx.fillText('✔  Gate Opening!', W / 2, H / 2);
  }

  ctx.textAlign = 'left';
}

// ── Private helpers ───────────────────────────────────────────────────────────

function _leftTopY() {
  const total = sourceStones.length * (STONE_H + 8) - 8;
  return PANEL.y + 155 + (PANEL.h - 155 - total) / 2;
}

function _stackTopY() {
  return PEDESTAL_Y - stack.length * (STONE_H + 4);
}

function _drawRiddlePlaque(ctx) {
  drawRoundRect(ctx, PANEL.x + 30, PANEL.y + 42, PANEL.w - 60, 68, 8,
    '#1a1030', '#604090', 1.5);
  ctx.fillStyle = '#d0c090';
  ctx.font = 'italic 12px Georgia, serif';
  ctx.textAlign = 'center';
  const lines = [
    'Four stones, four weights.  The star outweighs all.',
    'The moon is second.  The sun is third.  The cloud weighs least.',
    'Build from heavy to light — or all shall fall.',
  ];
  lines.forEach((l, i) => ctx.fillText(l, W / 2, PANEL.y + 60 + i * 16));
}

function _drawSourceStones(ctx) {
  const y0 = _leftTopY();
  for (let i = 0; i < sourceStones.length; i++) {
    const s  = STONE_DEFS[sourceStones[i]];
    let   sx = LEFT_CX;
    const sy = y0 + i * (STONE_H + 8);

    const isSelected = (i === selectedIdx);
    if (isSelected) sx += 8; // nudge right when selected

    _drawStone(ctx, s, sx, sy, isSelected);
  }
}

function _drawPedestal(ctx) {
  // Base
  drawRoundRect(ctx, RIGHT_CX - 70, PEDESTAL_Y, 140, 16, 4,
    '#6a5030', '#4a3010', 2);

  // Stacked stones
  for (let i = 0; i < stack.length; i++) {
    const s  = stack[i];
    const sy = PEDESTAL_Y - (i + 1) * (STONE_H + 4);
    const shakeX = (shakeTimer > 0 && i === stack.length - 1)
      ? Math.sin(shakeTimer * 1.4) * 6 : 0;
    _drawStone(ctx, s, RIGHT_CX + shakeX, sy, false);
  }

  // Hint arrow when stone selected
  if (selectedIdx !== null && stack.length < 4) {
    ctx.strokeStyle = 'rgba(255,220,60,0.8)';
    ctx.lineWidth   = 2;
    ctx.setLineDash([5, 4]);
    ctx.strokeRect(RIGHT_CX - 80, PEDESTAL_Y - STONE_H * 5, 160, STONE_H * 5);
    ctx.setLineDash([]);
    ctx.fillStyle = 'rgba(255,220,60,0.7)';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('▼  click to place', RIGHT_CX, PEDESTAL_Y - STONE_H * 5 - 5);
  }
}

function _drawStone(ctx, s, cx, y, selected) {
  const shade = selected ? '#ffffb0' : s.col;
  drawRoundRect(ctx, cx - s.w / 2, y, s.w, STONE_H, 6, shade, s.shadow, selected ? 2.5 : 1.5);

  // Weight indicator bar
  const barW = (s.weight / 4) * (s.w - 16);
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(cx - s.w / 2 + 8, y + STONE_H - 9, s.w - 16, 5);
  ctx.fillStyle = selected ? '#ffff60' : '#ffffff80';
  ctx.fillRect(cx - s.w / 2 + 8, y + STONE_H - 9, barW, 5);

  // Icon + label
  ctx.font = '16px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(s.icon, cx - 20, y + STONE_H - 10);
  ctx.fillStyle = '#1a1010';
  ctx.font = 'bold 11px Georgia, serif';
  ctx.fillText(s.label, cx + 14, y + STONE_H - 10);
}

function _placeStone() {
  const def = STONE_DEFS[sourceStones[selectedIdx]];
  const expectedWeight = 4 - stack.length; // must place heaviest first

  if (def.weight !== expectedWeight) {
    // Wrong order — shake, reset stack after brief pause
    shakeTimer = 22;
    setTimeout(() => {
      // Return stacked stones to source
      stack.forEach(d => {
        const orig = STONE_DEFS.findIndex(x => x.label === d.label);
        if (!sourceStones.includes(orig)) sourceStones.push(orig);
      });
      sourceStones.sort((a, b) => STONE_DEFS[a].label.localeCompare(STONE_DEFS[b].label));
      stack       = [];
      selectedIdx = null;
    }, 400);
    return;
  }

  // Correct — move from source to stack
  sourceStones.splice(selectedIdx, 1);
  stack.push(def);
  selectedIdx = null;

  if (stack.length === 4) {
    // Puzzle solved
    done         = true;
    successTimer = 90;
  }
}
