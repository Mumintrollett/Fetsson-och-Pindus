// Bridge scene — an old rope bridge spanning a deep ravine.
// State rendered:
//   bridgePlanksGot     — woodpile disappears
//   bridgeFloorFixed    — plank gaps filled
//   bridgeRailingFixed  — rope railing continuous
//   bridgeRepaired      — gate swings open

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

  // Counterweight mechanism (always visible on right cliff)
  _drawCounterweight(ctx);

  // Gate (only when not yet repaired)
  if (!state.flags.bridgeRepaired) _drawGate(ctx);

  // Woodpile (only until planks taken)
  if (!state.flags.bridgePlanksGot) _drawWoodpile(ctx);

  // Hotspot highlights
  _highlight(ctx, state.hovered === 'bridgeReturn',   0,   200, 120, 250);
  _highlight(ctx, state.hovered === 'woodpile' && !state.flags.bridgePlanksGot,
                                                      18,  370, 105, 42);
  _highlight(ctx, state.hovered === 'brokenFloor'
                  && !state.flags.bridgeFloorFixed,   130, 365, 540, 50);
  _highlight(ctx, state.hovered === 'brokenRailing'
                  && state.flags.bridgeFloorFixed
                  && !state.flags.bridgeRailingFixed, 130, 320, 540, 48);
  _highlight(ctx, state.hovered === 'gateWheel'
                  && state.flags.bridgeRailingFixed
                  && !state.flags.bridgeRepaired,     638, 248, 88, 132);
  _highlight(ctx, state.hovered === 'bridgeCross'
                  && state.flags.bridgeRepaired,      670, 200, 130, 250);
}

// ── Private helpers ───────────────────────────────────────────────────────────

function _drawPillar(ctx, x, y, w, h) {
  // Stone pillar
  gradientRect(ctx, x, y, w, h, '#a09080', '#707060', false);
  ctx.strokeStyle = '#504840'; ctx.lineWidth = 1.5;
  ctx.strokeRect(x, y, w, h);
  // Stone block lines
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
    // Full continuous deck
    ctx.fillStyle = plankColor;
    ctx.fillRect(130, y, 540, 26);
    // Plank lines
    ctx.strokeStyle = '#7a5020'; ctx.lineWidth = 1;
    for (let px = 130; px < 670; px += 22) {
      ctx.beginPath(); ctx.moveTo(px, y); ctx.lineTo(px, y + 26); ctx.stroke();
    }
  } else {
    // Broken deck — sections with visible gaps
    const sections = [[130, 200], [220, 350], [380, 500], [530, 670]];
    sections.forEach(([sx, ex]) => {
      ctx.fillStyle = plankColor;
      ctx.fillRect(sx, y, ex - sx, 26);
      ctx.strokeStyle = '#7a5020'; ctx.lineWidth = 1;
      for (let px = sx; px < ex; px += 22) {
        ctx.beginPath(); ctx.moveTo(px, y); ctx.lineTo(px, y + 26); ctx.stroke();
      }
    });
    // Gap markers
    ctx.strokeStyle = '#3a1800'; ctx.lineWidth = 1.5; ctx.setLineDash([4, 4]);
    [[200, 220], [350, 380], [500, 530]].forEach(([gx1, gx2]) => {
      ctx.beginPath(); ctx.moveTo(gx1, y); ctx.lineTo(gx1, y + 26); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(gx2, y); ctx.lineTo(gx2, y + 26); ctx.stroke();
    });
    ctx.setLineDash([]);
  }

  // Cross-beam supports
  ctx.fillStyle = '#7a4810';
  [200, 310, 420, 530].forEach(bx => ctx.fillRect(bx - 6, y + 26, 12, 16));
}

function _drawRailing(ctx) {
  const ropeCols = state.flags.bridgeRailingFixed
    ? ['#b89050', '#a07840']
    : ['rgba(100,70,30,0.6)', 'rgba(80,50,20,0.5)'];

  // Upper rope
  ctx.strokeStyle = ropeCols[0]; ctx.lineWidth = 3; ctx.lineCap = 'round';
  if (!state.flags.bridgeRailingFixed) {
    // Broken — draw in two sections with sag
    ctx.beginPath();
    ctx.moveTo(110, 355); ctx.quadraticCurveTo(220, 375, 310, 365); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(490, 360); ctx.quadraticCurveTo(600, 370, 690, 355); ctx.stroke();
    // Frayed ends
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

  // Vertical rope strands
  ctx.strokeStyle = ropeCols[1]; ctx.lineWidth = 1.5;
  const y0 = FLOOR_Y - 14;
  for (let rx = 150; rx <= 650; rx += 40) {
    ctx.beginPath(); ctx.moveTo(rx, 356); ctx.lineTo(rx, y0); ctx.stroke();
  }
}

function _drawGate(ctx) {
  // Heavy wooden gate blocking center of bridge
  const gx = 360;
  const gy = 290;
  const hover = state.hovered === 'gateWheel';
  gradientRect(ctx, gx, gy, 80, 120, '#6a4818', '#4a2808', true);
  ctx.strokeStyle = '#3a1808'; ctx.lineWidth = 2;
  ctx.strokeRect(gx, gy, 80, 120);
  // Crossbars
  ctx.strokeStyle = '#4a2808'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(gx, gy + 40); ctx.lineTo(gx + 80, gy + 40); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(gx, gy + 80); ctx.lineTo(gx + 80, gy + 80); ctx.stroke();
  // Metal studs
  ctx.fillStyle = '#808080';
  [[gx + 12, gy + 20], [gx + 68, gy + 20], [gx + 12, gy + 100], [gx + 68, gy + 100]]
    .forEach(([sx, sy]) => {
      ctx.beginPath(); ctx.arc(sx, sy, 4, 0, Math.PI * 2); ctx.fill();
    });
  // Chain
  ctx.strokeStyle = hover ? '#d0b040' : '#909090'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(gx + 80, gy + 60); ctx.lineTo(gx + 130, gy + 40); ctx.stroke();
}

function _drawCounterweight(ctx) {
  const mx = 668;  // x of mechanism
  const repaired = state.flags.bridgeRepaired;

  // Frame
  ctx.fillStyle = '#5a4020';
  ctx.fillRect(mx - 8, 200, 16, 200);
  ctx.fillRect(mx - 30, 200, 60, 16);

  // Gear wheel
  const gx = mx;
  const gy = 230;
  ctx.fillStyle = '#808080';
  ctx.beginPath(); ctx.arc(gx, gy, 24, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#505050'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(gx, gy, 24, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = '#606060';
  ctx.beginPath(); ctx.arc(gx, gy, 8, 0, Math.PI * 2); ctx.fill();
  // Gear teeth
  ctx.fillStyle = '#707070';
  for (let t = 0; t < 8; t++) {
    const a = (t / 8) * Math.PI * 2;
    const tx2 = gx + Math.cos(a) * 26;
    const ty2 = gy + Math.sin(a) * 26;
    ctx.beginPath(); ctx.arc(tx2, ty2, 4, 0, Math.PI * 2); ctx.fill();
  }

  // Rope from gear
  ctx.strokeStyle = '#b89050'; ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(gx, gy + 24);
  ctx.lineTo(gx, repaired ? gy + 60 : gy + 130);
  ctx.stroke();

  // Counterweight block
  const wyOff = repaired ? 75 : 145;
  drawRoundRect(ctx, gx - 20, gy + wyOff, 40, 36, 4, '#606060', '#404040', 2);
  ctx.fillStyle = '#808080';
  ctx.font = '10px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('⚖', gx, gy + wyOff + 22);
  ctx.textAlign = 'left';
}

function _drawWoodpile(ctx) {
  // Stack of spare planks on left cliff
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
