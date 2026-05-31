import { W, H }        from '../../engine/constants.js';
import { state }        from '../../engine/state.js';
import { gradientRect } from '../utils.js';

export function drawKitchenScene(ctx) {
  // Checkered floor
  for (let tx = 0; tx < W; tx += 50) {
    for (let ty = 300; ty < H; ty += 50) {
      ctx.fillStyle = ((tx + ty) / 50) % 2 < 1 ? '#e8d8b0' : '#c8b890';
      ctx.fillRect(tx, ty, 50, 50);
    }
  }
  // Wall
  gradientRect(ctx, 0, 0, W, 305, '#f5edd8', '#e8d8b0', true);
  // Ceiling beam
  ctx.fillStyle = '#a07840'; ctx.fillRect(0, 0, W, 28);
  [100, 250, 400, 550, 700].forEach(bx => {
    ctx.fillStyle = '#8b6020'; ctx.fillRect(bx, 0, 20, 28);
  });

  // Window
  ctx.fillStyle = '#87ceeb'; ctx.fillRect(580, 60, 160, 120);
  gradientRect(ctx, 580, 140, 160, 40, 'rgba(255,200,80,0)', 'rgba(255,200,80,0.3)', true);
  ctx.strokeStyle = '#a07040'; ctx.lineWidth = 4;
  ctx.strokeRect(580, 60, 160, 120);
  ctx.beginPath();
  ctx.moveTo(660,  60); ctx.lineTo(660, 180);
  ctx.moveTo(580, 120); ctx.lineTo(740, 120);
  ctx.stroke();
  // Curtains
  ctx.fillStyle = 'rgba(220,80,60,0.7)';
  ctx.beginPath();
  ctx.moveTo(580,  60);
  ctx.bezierCurveTo(590,  80, 600, 100, 605, 180);
  ctx.lineTo(580, 180); ctx.closePath(); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(740,  60);
  ctx.bezierCurveTo(730,  80, 720, 100, 715, 180);
  ctx.lineTo(740, 180); ctx.closePath(); ctx.fill();

  // Shelves
  ctx.fillStyle = '#c8a060';
  ctx.fillRect(30,  80, 180, 12);
  ctx.fillRect(30, 150, 180, 12);
  ctx.fillStyle = '#cc6030'; ctx.fillRect( 40,  64, 24, 16);
  ctx.fillStyle = '#8a4020'; ctx.fillRect( 70,  62, 18, 18);
  ctx.fillStyle = '#c8a030'; ctx.fillRect( 96,  66, 20, 14);
  ctx.fillStyle = '#4a8030'; ctx.fillRect(122,  60, 16, 20);
  ctx.fillStyle = '#cc6030'; ctx.fillRect( 40, 134, 24, 16);
  ctx.fillStyle = '#8a4020'; ctx.fillRect( 70, 132, 18, 18);
  ctx.fillStyle = '#e0a030'; ctx.fillRect( 96, 136, 20, 14);

  // Stove
  ctx.fillStyle = '#303030'; ctx.fillRect(60, 200, 160, 150);
  ctx.fillStyle = '#202020'; ctx.fillRect(60, 200, 160,  18);
  [110, 160].forEach(bx => {
    const pulse = 0.7 + 0.3 * Math.sin(state.tick * 0.08);
    const fg2 = ctx.createRadialGradient(bx, 216, 0, bx, 216, 22 * pulse);
    fg2.addColorStop(0, 'rgba(255,160,0,0.9)');
    fg2.addColorStop(1, 'rgba(255,80,0,0)');
    ctx.fillStyle = fg2;
    ctx.beginPath(); ctx.arc(bx, 216, 22, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath(); ctx.arc(bx, 216, 14, 0, Math.PI * 2); ctx.fill();
  });
  ctx.fillStyle = '#282828';
  ctx.beginPath(); ctx.ellipse(110, 202, 28, 10, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#c87820'; ctx.fillRect(80, 195, 12, 8);
  ctx.fillStyle = '#e8a840';
  ctx.beginPath(); ctx.ellipse(110, 198, 20, 8, 0, 0, Math.PI * 2); ctx.fill();

  // Table
  ctx.fillStyle = '#a07030'; ctx.fillRect(280, 290, 360, 20);
  ctx.fillStyle = '#8b5c20';
  ctx.fillRect(290, 308, 16, 100); ctx.fillRect(614, 308, 16, 100);

  // Pancake plate
  ctx.fillStyle = '#f0ead8';
  ctx.beginPath(); ctx.ellipse(380, 278, 50, 14, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#c8b090'; ctx.lineWidth = 1; ctx.stroke();
  ['#e8a840', '#e09830', '#d88820'].forEach((col, i) => {
    ctx.fillStyle = col;
    ctx.beginPath(); ctx.ellipse(380, 272 - i * 10, 36, 10, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#c07020'; ctx.lineWidth = 0.5; ctx.stroke();
  });
  ctx.strokeStyle = '#e8a020'; ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(360, 248);
  ctx.bezierCurveTo(365, 254, 375, 260, 385, 256);
  ctx.bezierCurveTo(390, 252, 385, 248, 380, 250);
  ctx.stroke();

  // Honey jar
  ctx.fillStyle = '#e8c020'; ctx.fillRect(448, 255, 30, 30);
  ctx.fillStyle = '#d4b010'; ctx.fillRect(448, 252, 30,  7);
  ctx.fillStyle = '#8b6010'; ctx.fillRect(453, 246, 20,  8);
  ctx.fillStyle = '#f8e880'; ctx.fillRect(451, 259, 24, 18);
  ctx.fillStyle = '#c09020'; ctx.font = '8px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('HONEY', 463, 271);
  ctx.textAlign = 'left';

  // Cups
  [[310, 265], [540, 265]].forEach(([cx2, cy2]) => {
    ctx.fillStyle = '#f0ead8';
    ctx.beginPath();
    ctx.moveTo(cx2 - 14, cy2);
    ctx.lineTo(cx2 - 18, cy2 + 28);
    ctx.lineTo(cx2 + 18, cy2 + 28);
    ctx.lineTo(cx2 + 14, cy2);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#c8b090'; ctx.lineWidth = 1; ctx.stroke();
    ctx.beginPath(); ctx.arc(cx2 + 18, cy2 + 14, 10, -Math.PI / 2, Math.PI / 2);
    ctx.strokeStyle = '#c8b090'; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = '#c07020'; ctx.fillRect(cx2 - 13, cy2 + 4, 26, 20);
  });

  // Sunlight beam
  const sl = ctx.createLinearGradient(580, 0, 400, 350);
  sl.addColorStop(0, 'rgba(255,230,150,0.12)');
  sl.addColorStop(1, 'rgba(255,230,150,0)');
  ctx.fillStyle = sl;
  ctx.beginPath();
  ctx.moveTo(580,  60); ctx.lineTo(740,  60);
  ctx.lineTo(440, 360); ctx.lineTo(340, 360);
  ctx.closePath(); ctx.fill();
}
