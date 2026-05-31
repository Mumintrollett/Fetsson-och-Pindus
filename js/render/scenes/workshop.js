// Render: Workshop — Algott's former clockmaking studio on Gearsmith Street.
// Now occupied by sausage-merchant Torsten, who has hung his wares
// everywhere and left Algott's precision tools to gather dust.
// Left wall: clock shelf with the hidden panel.
// Right wall: three pinned notes encoding the clock-dial solution.
// Back wall: workbench + frosted window.
// Sausages hang from every rafter.

import { state }         from '../../engine/state.js';
import { W, H, FLOOR_Y } from '../../engine/constants.js';
import { gradientRect }  from '../utils.js';

function _highlight(ctx, active, x, y, w, h) {
  if (!active) return;
  ctx.strokeStyle = 'rgba(255,220,60,0.7)';
  ctx.lineWidth   = 2;
  ctx.setLineDash([6, 4]);
  ctx.strokeRect(x, y, w, h);
  ctx.setLineDash([]);
}

export function drawWorkshop(ctx) {
  // ── FLOOR & WALLS ───────────────────────────────────────────
  // Floor
  ctx.fillStyle = '#6a5030';
  ctx.fillRect(0, FLOOR_Y, W, H - FLOOR_Y);
  // Floorboard lines
  ctx.strokeStyle = '#4a3010'; ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, FLOOR_Y); ctx.lineTo(x, H); ctx.stroke(); }
  // Back wall
  gradientRect(ctx, 60, 60, W - 120, FLOOR_Y, '#d4c8a0', '#c4b890');
  // Left wall
  ctx.fillStyle = '#c0b488';
  ctx.fillRect(0, 60, 70, H);
  // Right wall
  ctx.fillStyle = '#c0b488';
  ctx.fillRect(W - 70, 60, 70, H);
  // Ceiling
  ctx.fillStyle = '#a89060';
  ctx.fillRect(0, 0, W, 68);
  // Ceiling beams
  ctx.fillStyle = '#7a5820';
  for (let bx = 60; bx < W; bx += 120) {
    ctx.fillRect(bx, 0, 20, 68);
  }
  // Wainscoting
  ctx.fillStyle = '#8a6030';
  ctx.fillRect(60, FLOOR_Y - 30, W - 120, 30);
  ctx.strokeStyle = '#6a4010'; ctx.lineWidth = 1;
  ctx.strokeRect(60, FLOOR_Y - 30, W - 120, 30);

  // ── SAUSAGES (hanging from all beams) ───────────────────────
  const sausagePositions = [
    80, 110, 200, 240, 350, 390, 510, 550, 640, 680, 740, 760,
  ];
  sausagePositions.forEach(sx => {
    const len = 50 + ((sx * 7) % 40);
    ctx.strokeStyle = '#8a3010'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(sx, 68); ctx.lineTo(sx, 80 + len * 0.3); ctx.stroke();
    // Sausage links
    const links = 2 + (sx % 3);
    for (let i = 0; i < links; i++) {
      const sy = 76 + i * 22;
      ctx.beginPath(); ctx.ellipse(sx, sy + 10, 6, 11, 0.2, 0, Math.PI * 2);
      ctx.fillStyle = `hsl(${10 + (sx % 8)}, 60%, ${35 + (i % 2) * 6}%)`;
      ctx.fill();
      ctx.strokeStyle = '#5a2008'; ctx.lineWidth = 1; ctx.stroke();
    }
  });

  // ── BACK WINDOW ──────────────────────────────────────────────
  ctx.fillStyle = '#2a1808';
  ctx.fillRect(320, 100, 160, 120);
  ctx.fillStyle = 'rgba(200,220,240,0.3)';
  ctx.fillRect(324, 104, 152, 112);
  // Frosted glass — city street hint
  ctx.fillStyle = 'rgba(200,200,180,0.25)';
  ctx.fillRect(324, 104, 152, 112);
  ctx.strokeStyle = '#4a3010'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(400, 104); ctx.lineTo(400, 216); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(324, 160); ctx.lineTo(476, 160); ctx.stroke();
  ctx.strokeStyle = '#2a1808'; ctx.lineWidth = 2;
  ctx.strokeRect(320, 100, 160, 120);
  // Window sill
  ctx.fillStyle = '#8a6030';
  ctx.fillRect(314, 218, 172, 14);

  // ── WORKBENCH ────────────────────────────────────────────────
  ctx.fillStyle = '#7a5820';
  ctx.fillRect(200, 308, 400, 90);
  ctx.fillStyle = '#c8a860';
  ctx.fillRect(196, 304, 408, 18);
  ctx.strokeStyle = '#5a3808'; ctx.lineWidth = 1.5;
  ctx.strokeRect(196, 304, 408, 18);
  // Bench legs
  ctx.fillStyle = '#6a4818';
  ctx.fillRect(210, 394, 20, FLOOR_Y - 394);
  ctx.fillRect(570, 394, 20, FLOOR_Y - 394);
  // Tools on bench
  [
    { x: 220, y: 290, w: 4, h: 18, col: '#b0b0b0' }, // screwdriver
    { x: 240, y: 285, w: 16, h: 14, col: '#a09040' }, // cog
    { x: 270, y: 292, w: 30, h: 8,  col: '#8a6020' }, // ruler
    { x: 560, y: 280, w: 8,  h: 24, col: '#909090' }, // chisel
    { x: 530, y: 288, w: 18, h: 10, col: '#c0a030' }, // spring coil
  ].forEach(t => {
    ctx.fillStyle = t.col; ctx.fillRect(t.x, t.y, t.w, t.h);
  });

  // ── INSCRIPTION ON BENCH EDGE ────────────────────────────────
  if (!state.flags.watchFound) {
    ctx.fillStyle = '#3a2010'; ctx.font = 'italic 9px serif';
    ctx.textAlign = 'center';
    ctx.fillText('"A craftsman knows his hours."', 400, 316);
    ctx.textAlign = 'left';
  }

  // ── LEFT WALL: CLOCK SHELF ───────────────────────────────────
  // Shelf board
  ctx.fillStyle = '#8a6020';
  ctx.fillRect(46, 142, 196, 14);
  ctx.strokeStyle = '#5a3808'; ctx.lineWidth = 1; ctx.strokeRect(46, 142, 196, 14);

  if (state.flags.watchFound) {
    // Panel is open: simple open recess
    ctx.fillStyle = '#1a1008';
    ctx.fillRect(52, 156, 80, 90);
    ctx.fillStyle = '#4a3818'; ctx.font = '8px sans-serif';
    ctx.fillText('(empty)', 68, 206);
  } else {
    // Three clocks on shelf
    const clocks = [
      { cx: 80,  cy: 196, r: 26 },
      { cx: 140, cy: 196, r: 22 },
      { cx: 200, cy: 196, r: 20 },
    ];
    clocks.forEach(c => {
      // Case
      ctx.beginPath(); ctx.arc(c.cx, c.cy, c.r + 4, 0, Math.PI * 2);
      ctx.fillStyle = '#7a5020'; ctx.fill();
      ctx.strokeStyle = '#4a2808'; ctx.lineWidth = 1.5; ctx.stroke();
      // Face
      ctx.beginPath(); ctx.arc(c.cx, c.cy, c.r, 0, Math.PI * 2);
      ctx.fillStyle = '#f4ead4'; ctx.fill();
      ctx.strokeStyle = '#8a6010'; ctx.lineWidth = 1; ctx.stroke();
      // Hour marks
      for (let h = 0; h < 12; h++) {
        const a = (h / 12) * Math.PI * 2 - Math.PI / 2;
        const r1 = c.r - 4, r2 = c.r - 8;
        ctx.beginPath();
        ctx.moveTo(c.cx + Math.cos(a) * r1, c.cy + Math.sin(a) * r1);
        ctx.lineTo(c.cx + Math.cos(a) * r2, c.cy + Math.sin(a) * r2);
        ctx.strokeStyle = '#3a2010'; ctx.lineWidth = 1; ctx.stroke();
      }
      // Hands (stopped — all showing different times but visually distinct)
      ctx.strokeStyle = '#1a1008'; ctx.lineWidth = 1.5; ctx.lineCap = 'round';
      const minuteAngle = -Math.PI / 2; // pointing 12
      ctx.beginPath();
      ctx.moveTo(c.cx, c.cy);
      ctx.lineTo(c.cx + Math.cos(minuteAngle) * (c.r - 6), c.cy + Math.sin(minuteAngle) * (c.r - 6));
      ctx.stroke();
      // Hour hand pointing at different positions per clock
      const hourAngle = -Math.PI / 2 + (clocks.indexOf(c) * 0.8);
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(c.cx, c.cy);
      ctx.lineTo(c.cx + Math.cos(hourAngle) * (c.r - 10), c.cy + Math.sin(hourAngle) * (c.r - 10));
      ctx.stroke();
      ctx.lineCap = 'butt';
    });
    // Hidden panel hint — slight crack visible
    ctx.strokeStyle = '#3a2010'; ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.strokeRect(52, 156, 78, 88);
    ctx.setLineDash([]);
  }

  _highlight(ctx, state.hovered === 'clock_shelf', 50, 142, 192, 160);

  // ── NOTE 1 (left wall, lower) ────────────────────────────────
  if (!state.flags.watchFound) {
    ctx.fillStyle = '#f0e8c8';
    ctx.save(); ctx.translate(66, 256); ctx.rotate(-0.08);
    ctx.fillRect(0, 0, 54, 68);
    ctx.strokeStyle = '#8a6020'; ctx.lineWidth = 1; ctx.strokeRect(0, 0, 54, 68);
    // Pinning tack
    ctx.beginPath(); ctx.arc(27, 4, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#c0c0c0'; ctx.fill();
    // Scribbled lines
    ctx.strokeStyle = '#604030'; ctx.lineWidth = 0.8;
    [14, 22, 30, 38, 46, 54].forEach(y => {
      ctx.beginPath(); ctx.moveTo(4, y); ctx.lineTo(50, y); ctx.stroke();
    });
    // "7" clue — drawn faintly as part of text
    ctx.fillStyle = '#2a1010'; ctx.font = 'bold 18px serif';
    ctx.textAlign = 'center'; ctx.fillText('VII', 27, 42); ctx.textAlign = 'left';
    ctx.restore();
    _highlight(ctx, state.hovered === 'workshop_note1', 60, 250, 66, 76);
  }

  // ── NOTE 2 (workbench inscription handled as hotspot) ────────
  if (!state.flags.watchFound) {
    _highlight(ctx, state.hovered === 'workshop_note2', 250, 302, 300, 22);
  }

  // ── NOTE 3 (right wall) ──────────────────────────────────────
  if (!state.flags.watchFound) {
    ctx.fillStyle = '#f4e8c4';
    ctx.save(); ctx.translate(612, 238); ctx.rotate(0.06);
    ctx.fillRect(0, 0, 96, 80);
    ctx.strokeStyle = '#8a6020'; ctx.lineWidth = 1; ctx.strokeRect(0, 0, 96, 80);
    ctx.beginPath(); ctx.arc(48, 5, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#c0c0c0'; ctx.fill();
    ctx.strokeStyle = '#604030'; ctx.lineWidth = 0.8;
    [14, 20, 26, 32, 38, 44, 50, 56, 62, 68].forEach(y => {
      ctx.beginPath(); ctx.moveTo(4, y); ctx.lineTo(92, y); ctx.stroke();
    });
    // "5" / "V" clue
    ctx.fillStyle = '#2a1010'; ctx.font = 'bold 18px serif';
    ctx.textAlign = 'center'; ctx.fillText('V', 48, 52); ctx.textAlign = 'left';
    ctx.restore();
    _highlight(ctx, state.hovered === 'workshop_note3', 608, 232, 118, 88);
  }

  // ── TORSTEN'S MEMENTOS (lighter post-takeover details) ───────
  // Price chalk board on right wall
  ctx.fillStyle = '#1a2820';
  ctx.fillRect(660, 160, 100, 70);
  ctx.strokeStyle = '#3a4830'; ctx.lineWidth = 1.5; ctx.strokeRect(660, 160, 100, 70);
  ctx.fillStyle = '#c8e0c0'; ctx.font = 'bold 9px sans-serif';
  ctx.fillText('SAUSAGES', 675, 178);
  ctx.fillStyle = '#a0c080'; ctx.font = '8px sans-serif';
  ctx.fillText('Pork  2 öre', 669, 193);
  ctx.fillText('Garlic  3 öre', 669, 205);
  ctx.fillText('Smoked  5 öre', 669, 217);

  // ── EXITS ─────────────────────────────────────────────────────
  // Left: back to marketplace
  _highlight(ctx, state.hovered === 'workshop_return', 0, 280, 80, 170);
  // Right: return to Algott (only after watch found)
  if (state.flags.watchFound) {
    // A glowing exit arrow hint
    ctx.fillStyle = 'rgba(200,180,60,0.15)';
    ctx.fillRect(720, 280, 80, 170);
    _highlight(ctx, state.hovered === 'workshop_exit_return', 720, 280, 80, 170);
  }
}
