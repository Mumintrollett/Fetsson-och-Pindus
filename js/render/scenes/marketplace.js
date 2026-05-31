// Render: Marketplace — cobblestone square in Varnholm city centre.
// Birger's clock-parts stall is on the right; a brass-detailed
// fountain stands centre-left; workshops and merchant stalls fill
// the background; Gearsmith Street leads off to the right when
// Birger has pointed the way.

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

export function drawMarketplace(ctx) {
  // ── SKY ─────────────────────────────────────────────────────
  gradientRect(ctx, 0, 0, W, 200, '#7ab8d8', '#b0cce0');

  // ── CITY BUILDINGS (background) ─────────────────────────────
  const buildings = [
    { x:  0,   y: 80, w: 120, h: 140, roof: '#8a2020', wall: '#c8b88a' },
    { x: 100,  y: 60, w:  80, h: 160, roof: '#1a3a60', wall: '#b8a870' },
    { x: 170,  y: 90, w: 140, h: 130, roof: '#5a3010', wall: '#d4c090' },
    { x: 440,  y: 50, w:  90, h: 170, roof: '#2a4a20', wall: '#c0b080' },
    { x: 520,  y: 80, w: 130, h: 140, roof: '#8a3030', wall: '#d0c090' },
    { x: 640,  y: 60, w: 160, h: 160, roof: '#1a3a60', wall: '#c8b880' },
  ];
  buildings.forEach(b => {
    ctx.fillStyle = b.wall;
    ctx.fillRect(b.x, b.y, b.w, b.h);
    // Simple gabled roof
    ctx.fillStyle = b.roof;
    ctx.beginPath();
    ctx.moveTo(b.x - 6, b.y);
    ctx.lineTo(b.x + b.w / 2, b.y - 30);
    ctx.lineTo(b.x + b.w + 6, b.y);
    ctx.closePath(); ctx.fill();
    // Windows
    ctx.fillStyle = 'rgba(200,220,240,0.5)';
    for (let wx = b.x + 12; wx < b.x + b.w - 12; wx += 28) {
      ctx.fillRect(wx, b.y + 20, 18, 24);
      ctx.strokeStyle = '#7a6030'; ctx.lineWidth = 1;
      ctx.strokeRect(wx, b.y + 20, 18, 24);
    }
  });

  // ── COBBLESTONE GROUND ──────────────────────────────────────
  gradientRect(ctx, 0, FLOOR_Y, W, H - FLOOR_Y, '#9a8868', '#7a6848');
  ctx.strokeStyle = '#6a5838'; ctx.lineWidth = 1;
  for (let row = 0; row < 5; row++) {
    const y = FLOOR_Y + 5 + row * 21;
    for (let col = 0; col < 15; col++) {
      const off = (row % 2) * 29;
      ctx.strokeRect(col * 58 + off - 29, y, 56, 19);
    }
  }

  // ── BACKGROUND STALL ROW ────────────────────────────────────
  const bgStalls = [
    { x: 20,  color: '#8b5020', awning: '#a03030' },
    { x: 160, color: '#7a5030', awning: '#20608a' },
    { x: 290, color: '#8a5030', awning: '#306020' },
  ];
  bgStalls.forEach(s => {
    ctx.fillStyle = s.color;
    ctx.fillRect(s.x, 230, 120, 140);
    // Awning
    ctx.fillStyle = s.awning;
    ctx.beginPath();
    ctx.moveTo(s.x - 6, 230);
    ctx.lineTo(s.x + 60, 206);
    ctx.lineTo(s.x + 126, 230);
    ctx.closePath(); ctx.fill();
    // Counter
    ctx.fillStyle = '#c8a860';
    ctx.fillRect(s.x, 295, 120, 14);
    // Generic goods
    ctx.fillStyle = '#4a8040';
    ctx.beginPath(); ctx.arc(s.x + 30, 282, 8, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(s.x + 55, 278, 6, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(s.x + 78, 284, 9, 0, Math.PI * 2); ctx.fill();
  });

  // ── FOUNTAIN ─────────────────────────────────────────────────
  // Basin
  ctx.fillStyle = '#8a8070';
  ctx.beginPath(); ctx.ellipse(340, 400, 70, 20, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#a09080';
  ctx.beginPath(); ctx.ellipse(340, 396, 66, 17, 0, 0, Math.PI * 2); ctx.fill();
  // Water
  ctx.fillStyle = 'rgba(60,120,200,0.5)';
  ctx.beginPath(); ctx.ellipse(340, 393, 56, 13, 0, 0, Math.PI * 2); ctx.fill();
  // Pedestal
  ctx.fillStyle = '#7a706a';
  ctx.fillRect(326, 320, 28, 78);
  // Decorative clock face on pedestal
  ctx.beginPath(); ctx.arc(340, 330, 18, 0, Math.PI * 2);
  ctx.fillStyle = '#c8b870'; ctx.fill();
  ctx.strokeStyle = '#7a6020'; ctx.lineWidth = 2; ctx.stroke();
  ctx.strokeStyle = '#3a2808'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(340, 330); ctx.lineTo(340, 318); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(340, 330); ctx.lineTo(350, 330); ctx.stroke();
  // Water jet
  ctx.strokeStyle = 'rgba(100,160,220,0.7)'; ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(340, 316);
  ctx.quadraticCurveTo(360, 296, 376, 320);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(340, 316);
  ctx.quadraticCurveTo(320, 296, 304, 320);
  ctx.stroke();
  // Ripple circles
  ctx.strokeStyle = 'rgba(100,160,220,0.4)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.ellipse(340, 390, 20, 6, 0, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(340, 390, 38, 10, 0, 0, Math.PI * 2); ctx.stroke();

  _highlight(ctx, state.hovered === 'fountain', 330, 290, 140, 140);

  // ── BIRGER'S STALL ───────────────────────────────────────────
  ctx.fillStyle = '#6a4020';
  ctx.fillRect(530, 240, 230, 210);
  // Roof
  ctx.fillStyle = '#3a2010';
  ctx.fillRect(522, 224, 246, 24);
  ctx.fillRect(518, 214, 254, 18);
  // Awning stripes (dark green / cream)
  for (let i = 0; i < 8; i++) {
    ctx.fillStyle = i % 2 === 0 ? '#2a5020' : '#c8c0a0';
    ctx.beginPath();
    ctx.moveTo(520 + i * 32, 212);
    ctx.lineTo(524 + i * 32, 240);
    ctx.lineTo(556 + i * 32, 240);
    ctx.lineTo(552 + i * 32, 212);
    ctx.closePath(); ctx.fill();
  }
  // Counter
  ctx.fillStyle = '#d4b880';
  ctx.fillRect(530, 310, 230, 18);
  ctx.strokeStyle = '#8a6020'; ctx.lineWidth = 1.5;
  ctx.strokeRect(530, 310, 230, 18);
  // Clock parts on display
  const parts = [
    { x: 548, y: 280, r: 18 },  // gear disc
    { x: 596, y: 276, r: 14 },
    { x: 636, y: 282, r: 16 },
    { x: 680, y: 278, r: 12 },
    { x: 718, y: 280, r: 15 },
  ];
  parts.forEach(p => {
    ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = '#b09030'; ctx.fill();
    ctx.strokeStyle = '#7a6010'; ctx.lineWidth = 1.5; ctx.stroke();
    // Gear teeth (simplified)
    const teeth = 8;
    for (let t = 0; t < teeth; t++) {
      const angle = (t / teeth) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(p.x + Math.cos(angle) * p.r, p.y + Math.sin(angle) * p.r);
      ctx.lineTo(p.x + Math.cos(angle) * (p.r + 4), p.y + Math.sin(angle) * (p.r + 4));
      ctx.strokeStyle = '#b09030'; ctx.lineWidth = 3; ctx.stroke();
    }
    // Hole
    ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#3a2808'; ctx.fill();
  });
  // Birger — a short, round-shouldered figure behind the counter
  ctx.fillStyle = '#6a4820'; // vest
  ctx.fillRect(624, 256, 38, 56);
  ctx.fillStyle = '#d4a870'; // face
  ctx.beginPath(); ctx.arc(643, 252, 14, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#3a2010'; // hair / hat
  ctx.fillRect(629, 238, 28, 16);
  ctx.beginPath(); ctx.ellipse(643, 240, 18, 6, 0, 0, Math.PI * 2); ctx.fill();
  // Eyes + brows
  ctx.fillStyle = '#2a1808';
  ctx.beginPath(); ctx.arc(637, 251, 2, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(649, 251, 2, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#2a1808'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(634, 246); ctx.lineTo(640, 248); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(652, 248); ctx.lineTo(646, 246); ctx.stroke();
  // Sign above stall
  ctx.fillStyle = '#c8a060';
  ctx.fillRect(564, 196, 130, 20);
  ctx.strokeStyle = '#6a4010'; ctx.lineWidth = 1;
  ctx.strokeRect(564, 196, 130, 20);
  ctx.fillStyle = '#2a1808'; ctx.font = 'bold 9px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText("Birger's Clockworks", 629, 210);
  ctx.textAlign = 'left';

  _highlight(ctx, state.hovered === 'birger_stall', 530, 260, 220, 190);

  // ── GEARSMITH STREET EXIT (visible after Birger talks) ───────
  if (state.flags.birgerInfoGiven) {
    // Street mouth on the right
    ctx.fillStyle = '#b08860';
    ctx.fillRect(720, 240, 80, FLOOR_Y - 240);
    // Paving
    ctx.strokeStyle = '#907050'; ctx.lineWidth = 1;
    for (let row = 0; row < 5; row++) {
      ctx.strokeRect(724, 244 + row * 32, 74, 30);
    }
    // Distant building hinting at the workshop
    ctx.fillStyle = '#c4b070';
    ctx.fillRect(728, 160, 68, 84);
    ctx.fillStyle = '#8a5020';
    ctx.beginPath();
    ctx.moveTo(722, 160); ctx.lineTo(762, 134); ctx.lineTo(802, 160);
    ctx.closePath(); ctx.fill();
    // Street sign
    ctx.fillStyle = '#a07030'; ctx.fillRect(736, 230, 6, 16);
    ctx.fillStyle = '#c8a860'; ctx.fillRect(726, 222, 56, 12);
    ctx.strokeStyle = '#7a5010'; ctx.lineWidth = 1;
    ctx.strokeRect(726, 222, 56, 12);
    ctx.fillStyle = '#2a1808'; ctx.font = 'bold 7px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Gearsmith St.', 754, 232);
    ctx.textAlign = 'left';
    _highlight(ctx, state.hovered === 'workshop_path', 720, 250, 80, 200);
  }

  // ── RETURN EXIT ──────────────────────────────────────────────
  _highlight(ctx, state.hovered === 'marketplace_return', 0, 280, 80, 170);
}
