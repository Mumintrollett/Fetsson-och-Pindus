import { drawRoundRect } from './utils.js';

// ─────────────────────────────────────────────────────────────
// Fetsson (pig)
// cx, cy = body centre; facing = 1 (right) / -1 (left); walkFrame 0-3
// ─────────────────────────────────────────────────────────────
export function drawFetsson(ctx, cx, cy, facing, walkFrame) {
  ctx.save();
  ctx.translate(cx, cy);
  if (facing === -1) ctx.scale(-1, 1);

  const pinkBody  = '#f4a0b0';
  const pinkDark  = '#e07090';
  const pinkLight = '#ffd0db';
  const eyeWhite  = '#ffffff';
  const black     = '#1a0a0a';

  // shadow
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  ctx.beginPath();
  ctx.ellipse(0, 26, 28, 7, 0, 0, Math.PI * 2);
  ctx.fill();

  // legs (animated)
  const legOffsets = [
    [ 0,  1,  0, -1],
    [ 1,  0, -1,  0],
    [ 0, -1,  0,  1],
    [-1,  0,  1,  0],
  ][walkFrame % 4];

  const isWalking = walkFrame !== 0;
  [[-14, -6], [-6, -6], [6, -6], [14, -6]].forEach(([lx], i) => {
    const swing = isWalking ? legOffsets[i] * 6 : 0;
    drawRoundRect(ctx, lx - 4, 16 + swing, 8, 14, 3, pinkBody, pinkDark, 1);
  });

  // body
  ctx.beginPath();
  ctx.ellipse(0, 4, 26, 18, 0, 0, Math.PI * 2);
  ctx.fillStyle = pinkBody;
  ctx.fill();
  ctx.strokeStyle = pinkDark; ctx.lineWidth = 1.5; ctx.stroke();

  // belly
  ctx.beginPath();
  ctx.ellipse(0, 8, 14, 10, 0, 0, Math.PI * 2);
  ctx.fillStyle = pinkLight;
  ctx.fill();

  // curly tail
  ctx.beginPath();
  ctx.moveTo(-22, -2);
  ctx.bezierCurveTo(-34, -10, -38, 4, -30,  6);
  ctx.bezierCurveTo(-22,   8, -20, 0, -26, -4);
  ctx.strokeStyle = pinkDark; ctx.lineWidth = 2.5;
  ctx.stroke();

  // head
  ctx.beginPath();
  ctx.ellipse(20, -8, 16, 14, 0.3, 0, Math.PI * 2);
  ctx.fillStyle = pinkBody;
  ctx.fill();
  ctx.strokeStyle = pinkDark; ctx.lineWidth = 1.5; ctx.stroke();

  // near ear
  ctx.beginPath();
  ctx.ellipse(18, -20, 6, 9, -0.5, 0, Math.PI * 2);
  ctx.fillStyle = pinkDark; ctx.fill();
  ctx.beginPath();
  ctx.ellipse(18, -20, 3, 5, -0.5, 0, Math.PI * 2);
  ctx.fillStyle = pinkLight; ctx.fill();

  // far ear
  ctx.beginPath();
  ctx.ellipse(28, -18, 5, 8, 0.4, 0, Math.PI * 2);
  ctx.fillStyle = pinkDark; ctx.fill();

  // eye
  ctx.beginPath();
  ctx.arc(26, -10, 4, 0, Math.PI * 2);
  ctx.fillStyle = eyeWhite; ctx.fill();
  ctx.beginPath();
  ctx.arc(27, -10, 2.2, 0, Math.PI * 2);
  ctx.fillStyle = black; ctx.fill();
  ctx.beginPath();
  ctx.arc(27.8, -11, 0.8, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff'; ctx.fill();

  // snout
  ctx.beginPath();
  ctx.ellipse(32, -5, 7, 5, 0.1, 0, Math.PI * 2);
  ctx.fillStyle = pinkLight; ctx.fill();
  ctx.strokeStyle = pinkDark; ctx.lineWidth = 1; ctx.stroke();
  ctx.fillStyle = pinkDark;
  ctx.beginPath(); ctx.ellipse(30, -4.5, 1.5, 1, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(34, -4.5, 1.5, 1, 0, 0, Math.PI * 2); ctx.fill();

  ctx.restore();
}

// ─────────────────────────────────────────────────────────────
// Pindus (stick insect)
// ─────────────────────────────────────────────────────────────
export function drawPindus(ctx, cx, cy, facing) {
  ctx.save();
  ctx.translate(cx, cy);
  if (facing === -1) ctx.scale(-1, 1);

  const brown     = '#8B6340';
  const darkBrown = '#5C3D1A';

  // shadow
  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  ctx.beginPath();
  ctx.ellipse(0, 18, 16, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // legs (3 pairs)
  [
    { x: -10, a1: -0.7, a2:  0.4 },
    { x:   0, a1: -0.5, a2:  0.6 },
    { x:  10, a1: -0.6, a2:  0.4 },
  ].forEach(({ x, a1, a2 }) => {
    ctx.save(); ctx.translate(x, 4);
    ctx.rotate(a1);
    ctx.fillStyle = brown; ctx.fillRect(-1.5, 0, 3, 10);
    ctx.restore();
    ctx.save(); ctx.translate(x, 4);
    ctx.rotate(a2);
    ctx.fillStyle = brown; ctx.fillRect(-1.5, 0, 3, 10);
    ctx.restore();
  });

  // body
  ctx.save();
  ctx.rotate(-0.08);
  ctx.beginPath();
  ctx.ellipse(0, 2, 7, 20, 0, 0, Math.PI * 2);
  ctx.fillStyle = brown; ctx.fill();
  ctx.strokeStyle = darkBrown; ctx.lineWidth = 1; ctx.stroke();
  [-12, -4, 4, 12].forEach(sy => {
    ctx.beginPath();
    ctx.moveTo(-6, sy); ctx.lineTo(6, sy);
    ctx.strokeStyle = darkBrown; ctx.lineWidth = 0.8; ctx.stroke();
  });
  ctx.restore();

  // head
  ctx.beginPath();
  ctx.ellipse(2, -20, 5, 7, 0.15, 0, Math.PI * 2);
  ctx.fillStyle = brown; ctx.fill();
  ctx.strokeStyle = darkBrown; ctx.lineWidth = 1; ctx.stroke();

  // antennae
  ctx.beginPath();
  ctx.moveTo(2, -26);
  ctx.bezierCurveTo(-4, -38, -10, -36, -12, -28);
  ctx.strokeStyle = darkBrown; ctx.lineWidth = 1.2; ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(4, -26);
  ctx.bezierCurveTo(10, -38, 16, -34, 14, -26);
  ctx.strokeStyle = darkBrown; ctx.lineWidth = 1.2; ctx.stroke();

  // eyes
  ctx.beginPath(); ctx.arc(0, -21, 2.5, 0, Math.PI * 2);
  ctx.fillStyle = '#200a00'; ctx.fill();
  ctx.beginPath(); ctx.arc(1, -21.5, 0.9, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff'; ctx.fill();
  ctx.beginPath(); ctx.arc(4, -21, 2.5, 0, Math.PI * 2);
  ctx.fillStyle = '#200a00'; ctx.fill();
  ctx.beginPath(); ctx.arc(5, -21.5, 0.9, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff'; ctx.fill();

  ctx.restore();
}

// ─────────────────────────────────────────────────────────────
// Mrs. Hen (chicken)
// ─────────────────────────────────────────────────────────────
export function drawMrsHen(ctx, cx, cy) {
  ctx.save();
  ctx.translate(cx, cy);

  // body
  ctx.beginPath();
  ctx.ellipse(0, 0, 22, 18, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#f5f0e0'; ctx.fill();
  ctx.strokeStyle = '#c8b890'; ctx.lineWidth = 1; ctx.stroke();

  // wing
  ctx.beginPath();
  ctx.ellipse(-8, 2, 14, 10, 0.4, 0, Math.PI * 2);
  ctx.fillStyle = '#e8e0c8'; ctx.fill();

  // tail feathers
  [0.5, 0.1, -0.3].forEach(a => {
    ctx.save(); ctx.rotate(a + 0.8);
    ctx.beginPath();
    ctx.ellipse(-16, 0, 5, 12, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#c8b060'; ctx.fill();
    ctx.restore();
  });

  // neck
  ctx.beginPath();
  ctx.ellipse(12, -14, 8, 12, 0.2, 0, Math.PI * 2);
  ctx.fillStyle = '#f5f0e0'; ctx.fill();

  // head
  ctx.beginPath();
  ctx.arc(18, -24, 12, 0, Math.PI * 2);
  ctx.fillStyle = '#f5f0e0'; ctx.fill();
  ctx.strokeStyle = '#c8b890'; ctx.lineWidth = 1; ctx.stroke();

  // comb
  [16, 19, 22].forEach(x => {
    ctx.beginPath();
    ctx.ellipse(x, -34, 3, 5, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#cc2020'; ctx.fill();
  });

  // wattle
  ctx.beginPath();
  ctx.ellipse(22, -18, 4, 6, 0.2, 0, Math.PI * 2);
  ctx.fillStyle = '#cc2020'; ctx.fill();

  // eye
  ctx.beginPath(); ctx.arc(22, -25, 3.5, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff'; ctx.fill();
  ctx.beginPath(); ctx.arc(23, -25, 2, 0, Math.PI * 2);
  ctx.fillStyle = '#1a0a00'; ctx.fill();
  ctx.beginPath(); ctx.arc(23.5, -26, 0.8, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff'; ctx.fill();

  // beak
  ctx.beginPath();
  ctx.moveTo(28, -23); ctx.lineTo(34, -22); ctx.lineTo(28, -20);
  ctx.closePath();
  ctx.fillStyle = '#e0a020'; ctx.fill();

  // feet
  ctx.strokeStyle = '#d4a020'; ctx.lineWidth = 2;
  [[-8, 18], [6, 18]].forEach(([fx, fy]) => {
    ctx.beginPath(); ctx.moveTo(fx, fy); ctx.lineTo(fx - 2, fy + 10); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(fx, fy); ctx.lineTo(fx + 6, fy + 10); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(fx, fy); ctx.lineTo(fx + 10, fy + 8); ctx.stroke();
  });

  ctx.restore();
}
