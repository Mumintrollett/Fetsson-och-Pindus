// Render: City Gate — stone walls flanking a heavy oak gate.
// The gate has a visible latch bar gap; a sleeping guard occupies
// the booth on the right; a notice board is mounted on the left wall.

import { state }       from '../../engine/state.js';
import { W, H, FLOOR_Y } from '../../engine/constants.js';
import { gradientRect } from '../utils.js';

function _highlight(ctx, active, x, y, w, h) {
  if (!active) return;
  ctx.strokeStyle = 'rgba(255,220,60,0.7)';
  ctx.lineWidth   = 2;
  ctx.setLineDash([6, 4]);
  ctx.strokeRect(x, y, w, h);
  ctx.setLineDash([]);
}

export function drawCitygate(ctx) {
  // ── SKY ─────────────────────────────────────────────────────
  gradientRect(ctx, 0, 0, W, 320, '#7ab8d8', '#b8d4e8');

  // ── COBBLESTONE ROAD ────────────────────────────────────────
  gradientRect(ctx, 0, FLOOR_Y, W, H - FLOOR_Y, '#9a8868', '#7a6848');
  ctx.strokeStyle = '#6a5838'; ctx.lineWidth = 1;
  for (let row = 0; row < 4; row++) {
    const y = FLOOR_Y + 12 + row * 25;
    for (let col = 0; col < 14; col++) {
      const x = (col % 2 === row % 2) ? col * 58 : col * 58 + 29;
      ctx.strokeRect(x, y, 54, 20);
    }
  }

  // ── STONE WALL – LEFT ───────────────────────────────────────
  ctx.fillStyle = '#8a7a6a';
  ctx.fillRect(0, 80, 230, H);
  // Stone courses
  ctx.strokeStyle = '#6a5a4a'; ctx.lineWidth = 1;
  for (let row = 0; row < 18; row++) {
    const y = 80 + row * 24;
    for (let col = 0; col < 5; col++) {
      const offset = (row % 2) * 24;
      ctx.strokeRect(col * 48 + offset - 24, y, 46, 22);
    }
  }
  // Wall top parapet
  ctx.fillStyle = '#7a6a5a';
  for (let i = 0; i < 5; i++) {
    ctx.fillRect(i * 46, 64, 30, 22);
  }

  // ── STONE WALL – RIGHT ──────────────────────────────────────
  ctx.fillStyle = '#8a7a6a';
  ctx.fillRect(570, 80, W - 570, H);
  ctx.strokeStyle = '#6a5a4a'; ctx.lineWidth = 1;
  for (let row = 0; row < 18; row++) {
    const y = 80 + row * 24;
    for (let col = 0; col < 6; col++) {
      const offset = (row % 2) * 24;
      ctx.strokeRect(570 + col * 48 + offset - 24, y, 46, 22);
    }
  }
  ctx.fillStyle = '#7a6a5a';
  for (let i = 0; i < 6; i++) {
    ctx.fillRect(570 + i * 40, 64, 28, 22);
  }

  // ── GATE ARCH ───────────────────────────────────────────────
  // Stone arch frame
  ctx.fillStyle = '#6a5a4a';
  ctx.fillRect(212, 148, 20, 272); // left pillar
  ctx.fillRect(568, 148, 20, 272); // right pillar
  // Arch keystone
  ctx.beginPath();
  ctx.arc(400, 148, 194, Math.PI, 0);
  ctx.fillStyle = '#6a5a4a'; ctx.fill();
  ctx.beginPath();
  ctx.arc(400, 148, 172, Math.PI, 0);
  ctx.fillStyle = '#4a3820'; ctx.fill(); // arch soffit (dark)

  // ── GATE DOORS ──────────────────────────────────────────────
  if (state.flags.citygateOpen) {
    // Doors swung open — pushed back into wall reveals city glimpse
    ctx.fillStyle = '#3a2810';
    ctx.fillRect(220, 148, 70, 252);
    ctx.fillRect(510, 148, 70, 252);
    // City beyond: a bright cobblestone square hint
    gradientRect(ctx, 290, 148, 220, 252, '#c8b888', '#e0d0a0');
    ctx.fillStyle = '#a09060';
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 4; c++) {
        ctx.strokeStyle = '#808050'; ctx.lineWidth = 1;
        ctx.strokeRect(290 + c * 55, 148 + r * 32, 53, 30);
      }
    }
    // Distant buildings
    ctx.fillStyle = '#c8b070';
    ctx.fillRect(310, 148, 40, 80); ctx.fillRect(360, 148, 30, 60);
    ctx.fillRect(420, 148, 50, 90); ctx.fillRect(480, 148, 30, 70);
    ctx.fillStyle = '#b89050';
    ctx.fillRect(310, 128, 40, 24); ctx.fillRect(360, 132, 30, 20);
    ctx.fillRect(420, 122, 50, 30); ctx.fillRect(480, 130, 30, 22);
  } else {
    // Closed gate — heavy weathered oak planks
    ctx.fillStyle = '#5a3818';
    ctx.fillRect(220, 148, 178, 252); // left door
    ctx.fillRect(402, 148, 176, 252); // right door

    // Plank grain
    ctx.strokeStyle = '#4a2808'; ctx.lineWidth = 1;
    for (let p = 0; p < 6; p++) {
      ctx.strokeRect(224 + p * 29, 152, 26, 244);
    }
    for (let p = 0; p < 6; p++) {
      ctx.strokeRect(405 + p * 28, 152, 25, 244);
    }
    // Iron cross-braces
    ctx.strokeStyle = '#282020'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(222, 200); ctx.lineTo(396, 240); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(396, 200); ctx.lineTo(222, 240); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(404, 310); ctx.lineTo(576, 340); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(576, 310); ctx.lineTo(404, 340); ctx.stroke();
    // Iron hinges
    ctx.fillStyle = '#303030';
    [[226, 185, 24, 10], [226, 350, 24, 10],
     [550, 185, 24, 10], [550, 350, 24, 10]].forEach(([x, y, w, h]) => {
       ctx.fillRect(x, y, w, h);
     });
    // Latch gap in the middle — where the stick fits
    ctx.fillStyle = '#1a1008';
    ctx.fillRect(388, 230, 24, 60); // latch gap between doors
    ctx.fillStyle = '#383030';
    ctx.fillRect(390, 235, 20, 4); // visible latch bar end
    ctx.fillRect(390, 278, 20, 4);
  }

  // ── GATE FRAME ──────────────────────────────────────────────
  ctx.strokeStyle = '#2a1808'; ctx.lineWidth = 3;
  ctx.strokeRect(220, 148, 356, 252);

  // ── NOTICE BOARD (left wall) ────────────────────────────────
  ctx.fillStyle = '#7a5020';
  ctx.fillRect(68, 288, 86, 60);
  ctx.fillStyle = '#c8a870';
  ctx.fillRect(72, 292, 78, 52);
  ctx.strokeStyle = '#7a5020'; ctx.lineWidth = 1.5;
  ctx.strokeRect(72, 292, 78, 52);
  // Pinned paper
  ctx.fillStyle = '#f0ead0';
  ctx.fillRect(76, 296, 38, 24); ctx.fillRect(120, 296, 26, 24);
  ctx.fillRect(76, 326, 64, 14);
  // Text scribbles
  ctx.strokeStyle = '#604030'; ctx.lineWidth = 0.8;
  [299, 302, 305, 308].forEach(y => { ctx.beginPath(); ctx.moveTo(79, y); ctx.lineTo(110, y); ctx.stroke(); });
  ctx.fillStyle = '#8a1010'; ctx.font = 'bold 7px sans-serif';
  ctx.fillText('NOTICE', 77, 338);

  _highlight(ctx, state.hovered === 'gate_notice', 60, 288, 86, 60);

  // ── GUARD BOOTH (right wall) ─────────────────────────────────
  ctx.fillStyle = '#6a5838';
  ctx.fillRect(618, 270, 90, 160);
  ctx.fillStyle = '#5a4828';
  ctx.fillRect(618, 260, 90, 18); // roof overhang
  // Booth window
  ctx.fillStyle = '#2a1808';
  ctx.fillRect(630, 290, 40, 40);
  ctx.fillStyle = 'rgba(200,220,240,0.3)';
  ctx.fillRect(632, 292, 36, 36);
  ctx.strokeStyle = '#4a3010'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(650, 292); ctx.lineTo(650, 328); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(632, 310); ctx.lineTo(668, 310); ctx.stroke();
  // Guard slumped at window — hat visible, snoring
  ctx.fillStyle = '#3a2808';
  ctx.beginPath(); ctx.ellipse(650, 293, 20, 8, 0, 0, Math.PI * 2); ctx.fill(); // hat brim
  ctx.fillRect(640, 280, 20, 16); // hat crown
  ctx.fillStyle = '#d4a870'; // face
  ctx.beginPath(); ctx.arc(648, 296, 10, 0, Math.PI * 2); ctx.fill();
  // "Zzz" snoring
  ctx.fillStyle = '#6080a0'; ctx.font = 'bold 9px sans-serif';
  ctx.fillText('zzz', 664, 284);
  // Spear leaning
  ctx.strokeStyle = '#8a6030'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(702, 270); ctx.lineTo(700, 430); ctx.stroke();
  ctx.fillStyle = '#8090a0';
  ctx.beginPath();
  ctx.moveTo(700, 270); ctx.lineTo(694, 284); ctx.lineTo(706, 284);
  ctx.closePath(); ctx.fill();

  _highlight(ctx, state.hovered === 'sleeping_guard', 620, 300, 110, 140);

  // ── RETURN EXIT (left edge) ──────────────────────────────────
  _highlight(ctx, state.hovered === 'citygate_return', 0, 280, 80, 170);

  // ── ENTER CITY HINT ─────────────────────────────────────────
  if (state.flags.citygateOpen) {
    _highlight(ctx, state.hovered === 'citygate_enter', 230, 200, 340, 260);
  } else {
    _highlight(ctx, state.hovered === 'gate_latch_gap', 230, 200, 340, 260);
  }
}
