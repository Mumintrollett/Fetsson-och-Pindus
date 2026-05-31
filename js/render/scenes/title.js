import { W, H }          from '../../engine/constants.js';
import { state }          from '../../engine/state.js';
import { drawRoundRect, gradientRect } from '../utils.js';
import { drawCloud }      from '../shared.js';
import { drawFetsson, drawPindus } from '../characters.js';

export function drawTitleScreen(ctx) {
  // Sky
  gradientRect(ctx, 0, 0, W, H, '#4a90d9', '#87ceeb', true);

  // Rolling hills
  ctx.fillStyle = '#4a9a38';
  ctx.beginPath();
  ctx.moveTo(0, 300);
  ctx.bezierCurveTo(100, 240, 200, 280, 350, 260);
  ctx.bezierCurveTo(500, 240, 620, 280, 800, 240);
  ctx.lineTo(800, 500); ctx.lineTo(0, 500);
  ctx.closePath(); ctx.fill();

  // Grass
  ctx.fillStyle = '#5aac44';
  ctx.fillRect(0, 350, W, 150);

  // Clouds
  drawCloud(ctx,  80,  70, 0.9);
  drawCloud(ctx, 540,  50, 1.1);
  drawCloud(ctx, 680,  90, 0.7);

  // Barn silhouette
  ctx.fillStyle = '#9e1a1a';
  ctx.fillRect(580, 230, 170, 140);
  ctx.fillStyle = '#7a1010';
  ctx.beginPath();
  ctx.moveTo(570, 232); ctx.lineTo(660, 170); ctx.lineTo(760, 232);
  ctx.closePath(); ctx.fill();

  // Farmhouse silhouette
  ctx.fillStyle = '#e8e4d0';
  ctx.fillRect(60, 250, 160, 120);
  ctx.fillStyle = '#c46030';
  ctx.beginPath();
  ctx.moveTo(50, 252); ctx.lineTo(140, 195); ctx.lineTo(230, 252);
  ctx.closePath(); ctx.fill();

  // Tree
  ctx.fillStyle = '#3a6e24';
  ctx.beginPath(); ctx.arc(430, 240, 40, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(460, 250, 32, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#5c4020';
  ctx.fillRect(440, 280, 12, 40);

  // Characters
  drawFetsson(ctx, 290, 390, 1,  0);
  drawPindus (ctx, 400, 390, -1);

  // Title card
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 12;
  drawRoundRect(ctx, 100, 50, 600, 180, 14, 'rgba(15,8,2,0.82)', '#c8a030', 3);
  ctx.restore();

  ctx.textAlign    = 'center';
  ctx.fillStyle    = '#ffe060';
  ctx.font         = 'bold 52px Georgia, serif';
  ctx.shadowColor  = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 8;
  ctx.fillText('Fetsson och Pindus', W / 2, 130);

  ctx.fillStyle    = '#f0d89a';
  ctx.font         = 'italic 22px Georgia, serif';
  ctx.shadowBlur   = 4;
  ctx.fillText('A Cozy Farm Adventure', W / 2, 168);

  ctx.font         = '15px Georgia, serif';
  ctx.fillStyle    = '#c8a44a';
  ctx.fillText('Help Fetsson and Pindus find their way to breakfast!', W / 2, 204);

  ctx.shadowBlur   = 0;
  ctx.fillStyle    = '#ffffff';
  ctx.font         = '16px Georgia, serif';
  if (Math.floor(state.tick / 30) % 2 === 0) {
    ctx.fillText('Click anywhere to begin', W / 2, 460);
  }
  ctx.textAlign = 'left';
}
