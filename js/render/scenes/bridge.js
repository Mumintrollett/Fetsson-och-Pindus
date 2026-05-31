// Bridge scene — an old rope bridge spanning a deep ravine.
// State rendered:
//   planksPickedUp      — woodpile disappears
//   bridgeFloorFixed    — plank gaps filled
//   bridgeRailingFixed  — rope railing continuous
//   bridgeGateOpen      — counterweight gate swings open

import { W, H, FLOOR_Y } from '../../engine/constants.js';
import { state }          from '../../engine/state.js';
import { gradientRect, drawRoundRect } from '../utils.js';
import { drawCloud }      from '../shared.js';

export function drawBridgeScene(ctx) {
  // Sky
  gradientRect(ctx, 0, 0, W, 280, '#4a80c8', '#7ab4e8', true);

  // Drifting clouds
  const drift = (state.tick * 0.15) % 900;
  drawCloud(ctx, 80  + drift,       55, 0.9);
  drawCloud(ctx, 420 + drift * 0.6, 38, 0.7);
  drawCloud(ctx, 680 + drift * 0.4, 68, 0.8);

  // Distant forest background
  ctx.fillStyle = '#2a5018';
  ctx.beginPath();
  ctx.moveTo(0, 240);
  for (let x = 0; x <= W; x += 40) {
    const h = 60 + Math.sin(x * 0.05) * 25 + Math.sin(x * 0.13) * 15;
    ctx.lineTo(x, 240 - h);
  }
  ctx.lineTo(W, 240); ctx.closePath(); ctx.fill();

  // Ravine walls (rocky cliffs)
  gradientRect(ctx, 0,   250, 130, 250, '#8b6840', '#5a3a18', true);  // left cliff
  gradientRect(ctx, 670, 250, 130, 250, '#8b6840', '#5a3a18', true);  // right cliff

  // Cliff face texture — horizontal stratification
  ctx.strokeStyle = 'rgba(60,30,10,0.35)';
  ctx.lineWidth = 1;
  [290, 320, 355, 390, 425].forEach(y => {
    ctx.beginPath();
    ctx.moveTo(0,   y); ctx.lineTo(130, y);
    ctx.moveTo(670, y); ctx.lineTo(W,   y);
    ctx.stroke();
  });

  // Ravine bottom (dark rocky gorge with water glint)
  gradientRect(ctx, 130, 250, 540, 250, '#302010', '#180c04', true);
  ctx.fillStyle = 'rgba(30,80,120,0.45)';
  ctx.beginPath();
  ctx.ellipse(400, 470, 180, 20, 0, 0, Math.PI * 2);
  ctx.fill();

  // Bridge pillars
  _drawPillar(ctx, 90,  200, 40, 210);
  _drawPillar(ctx, 670, 200, 40, 210);

  // Bridge deck (planks)
  _drawBridgeDeck(ctx);

  // Rope railing
  _drawRailing(ctx);

  // Counterweight mechanism (left side of bridge — accessible from left cliff)
  _drawCounterweight(ctx);

  // Gate (only when not yet opened)
  if (!state.flags.bridgeGateOpen) _drawGate(ctx);

  // Woodpile (only until planks taken)
  if (!state.flags.planksPickedUp) _drawWoodpile(ctx);

  // Hotspot highlights
  _highlight(ctx, state.hovered === 'bridge_return',
                  0,   350, 90, 90);
  _highlight(ctx, state.hovered === 'woodpile' && !state.flags.planksPickedUp,
                  10,  342, 118, 62);
  _highlight(ctx, state.hovered === 'bridge_floor' && !state.flags.bridgeFloorFixed,
                  130, 378, 540, 36);
  _highlight(ctx, state.hovered === 'bridge_railing'
                  && state.flags.bridgeFloorFixed
                  && !state.flags.bridgeRailingFixed,
                  110, 344, 560, 38);
  _highlight(ctx, state.hovered === 'gate_wheel'
                  && state.flags.bridgeFloorFixed
                  && state.flags.bridgeRailingFixed
                  && !state.flags.bridgeGateOpen,
                  178, 250, 80, 160);
  _highlight(ctx, state.hovered === 'bridge_cross' && state.flags.bridgeGateOpen,
                  670, 300, 130, 140);
}

// ── Private helpers ───────────────────────────────────────────────────────────

function _drawPillar(ctx, x, y, w, h) {
  gradientRect(ctx, x, y, w, h, '#a09080', '#707060', false);
  ctx.strokeStyle = '#504840'; ctx.lineWidth = 1.5;
  ctx.strokeRect(x, y, w, h);
  ctx.strokeStyle = 'rgba(60,50,40,0.4)'; ctx.lineWidth = 1;
  for (let by = y + 28; by < y + h; by += 28) {
    ctx.beginPath(); ctx.moveTo(x, by); ctx.lineTo(x + w, by); ctx.stroke();
  }
  [x + w / 3, x + 2 * w / 3].forEach(bx => {
    ctx.beginPath(); ctx.moveTo(bx, y); ctx.lineTo(bx, y + h); ctx.stroke();
  });
}

function _drawBridgeDeck(ctx) {
  const y = FLOOR_Y - 14;
  const plankColor = state.flags.bridgeFloorFixed ? '#c8a060' : '#a07840';

  if (state.flags.bridgeFloorFixed) {
    ctx.fillStyle = plankColor;
    ctx.fillRect(130, y, 540, 26);
    ctx.strokeStyle = '#7a5020'; ctx.lineWidth = 1;
    for (let px = 130; px < 670; px += 22) {
      ctx.beginPath(); ctx.moveTo(px, y); ctx.lineTo(px, y + 26); ctx.stroke();
    }
  } else {
    const sections = [[130, 200], [220, 350], [380, 500], [530, 670]];
    sections.forEach(([sx, ex]) => {
      ctx.fillStyle = plankColor;
      ctx.fillRect(sx, y, ex - sx, 26);
      ctx.strokeStyle = '#7a5020'; ctx.lineWidth = 1;
      for (let px = sx; px < ex; px += 22) {
        ctx.beginPath(); ctx.moveTo(px, y); ctx.lineTo(px, y + 26); ctx.stroke();
      }
    });
    ctx.strokeStyle = '#3a1800'; ctx.lineWidth = 1.5; ctx.setLineDash([4, 4]);
    [[200, 220], [350, 380], [500, 530]].forEach(([gx1, gx2]) => {
      ctx.beginPath(); ctx.moveTo(gx1, y); ctx.lineTo(gx1, y + 26); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(gx2, y); ctx.lineTo(gx2, y + 26); ctx.stroke();
    });
    ctx.setLineDash([]);
  }

  ctx.fillStyle = '#7a4810';
  [200, 310, 420, 530].forEach(bx => ctx.fillRect(bx - 6, y + 26, 12, 16));
}

function _drawRailing(ctx) {
  const ropeCols = state.flags.bridgeRailingFixed
    ? ['#b89050', '#a07840']
    : ['rgba(100,70,30,0.6)', 'rgba(80,50,20,0.5)'];

  ctx.strokeStyle = ropeCols[0]; ctx.lineWidth = 3; ctx.lineCap = 'round';
  if (!state.flags.bridgeRailingFixed) {
    ctx.beginPath();
    ctx.moveTo(110, 355); ctx.quadraticCurveTo(220, 375, 310, 365); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(490, 360); ctx.quadraticCurveTo(600, 370, 690, 355); ctx.stroke();
    ctx.lineWidth = 1.5;
    [310, 490].forEach(rx => {
      for (let fi = 0; fi < 4; fi++) {
        ctx.strokeStyle = '#8a6030';
        ctx.beginPath();
        ctx.moveTo(rx, 365);
        ctx.lineTo(rx + (fi - 1.5) * 8, 370 + fi * 4);
        ctx.stroke();
      }
    });
  } else {
    ctx.beginPath();
    ctx.moveTo(110, 355); ctx.quadraticCurveTo(400, 375, 690, 355); ctx.stroke();
  }
  ctx.lineCap = 'butt';

  ctx.strokeStyle = ropeCols[1]; ctx.lineWidth = 1.5;
  const y0 = FLOOR_Y - 14;
  for (let rx = 150; rx <= 650; rx += 40) {
    ctx.beginPath(); ctx.moveTo(rx, 356); ctx.lineTo(rx, y0); ctx.stroke();
  }
}

function _drawGate(ctx) {
  // Heavy wooden gate sits across the bridge mid-span
  const gx = 360;
  const gy = 290;
  gradientRect(ctx, gx, gy, 80, 120, '#6a4818', '#4a2808', true);
  ctx.strokeStyle = '#3a1808'; ctx.lineWidth = 2;
  ctx.strokeRect(gx, gy, 80, 120);
  ctx.strokeStyle = '#4a2808'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(gx, gy + 40); ctx.lineTo(gx + 80, gy + 40); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(gx, gy + 80); ctx.lineTo(gx + 80, gy + 80); ctx.stroke();
  ctx.fillStyle = '#808080';
  [[gx + 12, gy + 20], [gx + 68, gy + 20], [gx + 12, gy + 100], [gx + 68, gy + 100]]
    .forEach(([sx, sy]) => {
      ctx.beginPath(); ctx.arc(sx, sy, 4, 0, Math.PI * 2); ctx.fill();
    });
  // Chain from gate to left-side mechanism
  ctx.strokeStyle = '#909090'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(gx, gy + 60); ctx.lineTo(258, 310); ctx.stroke();
  // Chain links detail
  ctx.strokeStyle = '#707070'; ctx.lineWidth = 1.5;
  for (let t = 0; t < 1; t += 0.12) {
    const cx2 = gx + (258 - gx) * t;
    const cy2 = (gy + 60) + (310 - (gy + 60)) * t;
    ctx.beginPath(); ctx.arc(cx2, cy2, 3, 0, Math.PI * 2); ctx.stroke();
  }
}

function _drawCounterweight(ctx) {
  // Mechanism is on the LEFT half of the bridge, accessible without crossing the gate
  const mx = 218;
  const opened = state.flags.bridgeGateOpen;

  // Wooden A-frame mount bolted to bridge railing post
  ctx.fillStyle = '#5a4020';
  ctx.fillRect(mx - 8, 250, 16, 160);   // vertical post
  ctx.fillRect(mx - 30, 250, 60, 14);   // top beam

  // Gear wheel
  const gx = mx;
  const gy = 280;
  ctx.fillStyle = '#808080';
  ctx.beginPath(); ctx.arc(gx, gy, 22, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#505050'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(gx, gy, 22, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = '#606060';
  ctx.beginPath(); ctx.arc(gx, gy, 7, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#707070';
  for (let t = 0; t < 8; t++) {
    const a = (t / 8) * Math.PI * 2;
    ctx.beginPath(); ctx.arc(gx + Math.cos(a) * 24, gy + Math.sin(a) * 24, 4, 0, Math.PI * 2); ctx.fill();
  }

  // Rope from gear to counterweight block
  ctx.strokeStyle = '#b89050'; ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(gx, gy + 22);
  ctx.lineTo(gx, opened ? gy + 55 : gy + 120);
  ctx.stroke();

  // Counterweight block
  const wyOff = opened ? 70 : 135;
  drawRoundRect(ctx, gx - 18, gy + wyOff, 36, 32, 4, '#606060', '#404040', 2);
  ctx.fillStyle = '#808080';
  ctx.font = '10px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('⚖', gx, gy + wyOff + 20);
  ctx.textAlign = 'left';

  // Label
  ctx.fillStyle = 'rgba(200,160,80,0.7)';
  ctx.font = 'italic 10px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('Counterweight', mx, 248);
  ctx.textAlign = 'left';
}

function _drawWoodpile(ctx) {
  const wx = 18;
  const wy = 372;
  for (let i = 0; i < 4; i++) {
    ctx.fillStyle = i % 2 === 0 ? '#c8a060' : '#b89050';
    ctx.fillRect(wx, wy - i * 10, 100, 8);
    ctx.strokeStyle = '#7a5020'; ctx.lineWidth = 0.5;
    ctx.strokeRect(wx, wy - i * 10, 100, 8);
  }
}

function _highlight(ctx, active, x, y, w, h) {
  if (!active) return;
  ctx.strokeStyle = 'rgba(255,220,60,0.7)';
  ctx.lineWidth   = 2;
  ctx.setLineDash([6, 4]);
  ctx.strokeRect(x, y, w, h);
  ctx.setLineDash([]);
}
