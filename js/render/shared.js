// Reusable background shapes drawn in multiple scenes.

export function drawCloud(ctx, cx, cy, scale) {
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  const s = scale || 1;
  ctx.beginPath();
  ctx.arc(cx,          cy,          22 * s, 0, Math.PI * 2);
  ctx.arc(cx + 25 * s, cy -  8 * s, 18 * s, 0, Math.PI * 2);
  ctx.arc(cx + 48 * s, cy,          20 * s, 0, Math.PI * 2);
  ctx.arc(cx + 24 * s, cy + 12 * s, 16 * s, 0, Math.PI * 2);
  ctx.fill();
}

export function drawTree(ctx, x, y, scale) {
  ctx.fillStyle = '#6b4820';
  ctx.fillRect(x - 6 * scale, y, 12 * scale, 50 * scale);
  ctx.fillStyle = '#2d6e22';
  ctx.beginPath();
  ctx.arc(x,           y - 12 * scale,  32 * scale, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath();
  ctx.arc(x + 18 * scale, y +  4 * scale, 22 * scale, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath();
  ctx.arc(x - 16 * scale, y +  4 * scale, 22 * scale, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#3a8428';
  ctx.beginPath();
  ctx.arc(x +  6 * scale, y - 20 * scale, 18 * scale, 0, Math.PI * 2); ctx.fill();
}
