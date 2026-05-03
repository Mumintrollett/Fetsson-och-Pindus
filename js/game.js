/* ============================================================
   Fetsson och Pindus – A Cozy Farm Adventure
   A point-and-click game about a pig and his stick-insect friend.
   ============================================================ */
'use strict';

// ─────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────
const W = 800;
const H = 500;
const FLOOR_Y = 400;   // y-coordinate of the ground (character feet)
const WALK_SPEED = 3;  // pixels per tick

// ─────────────────────────────────────────────────────────────
// GLOBAL STATE
// ─────────────────────────────────────────────────────────────
const state = {
  scene: 'title',      // 'title' | 'barn' | 'farmyard' | 'garden' | 'kitchen'
  tick: 0,

  player: {
    x: 200,
    y: FLOOR_Y,
    facing: 1,         // 1 = right, -1 = left
    walking: false,
    targetX: null,
    pendingAction: null,
  },

  pindus: {            // companion – follows loosely
    x: 310,
    y: FLOOR_Y,
    facing: -1,
  },

  inventory: [],       // array of item ids
  selectedItem: null,  // item id or null

  flags: {
    stickPickedUp:  false,
    bucketPickedUp: false,
    bucketFilled:   false,
    gateOpen:       false,
    keyPickedUp:    false,
    doorOpen:       false,
    gameFinished:   false,
  },

  dlg: {               // dialogue state
    active: false,
    queue: [],         // [{who, text}, ...]
    onDone: null,
  },

  hovered: null,       // currently hovered hotspot id
};

// mouse position in canvas space
let mx = 0, my = 0;

// ─────────────────────────────────────────────────────────────
// ITEMS
// ─────────────────────────────────────────────────────────────
const ITEMS = {
  stick:       { id: 'stick',       name: 'Stick',        icon: '🪵' },
  bucket:      { id: 'bucket',      name: 'Bucket',       icon: '🪣' },
  waterBucket: { id: 'waterBucket', name: 'Water',        icon: '💧' },
  key:         { id: 'key',         name: 'Key',          icon: '🗝️'  },
};

// ─────────────────────────────────────────────────────────────
// DIALOGUE DATA
// ─────────────────────────────────────────────────────────────
const DLG = {
  intro: [
    { who: 'Pindus',   text: 'Wakey wakey, Fetsson! The sun is shining and the roosters are crowing!' },
    { who: 'Pindus',   text: "Mrs. Hen promised us her legendary apple pancakes today. I've been up since dawn!" },
    { who: 'Fetsson',  text: "Mmm… pancakes… I'm up, I'm up!" },
    { who: 'Pindus',   text: "Oh — I noticed something sticking out of that hay bale earlier. Worth a look!" },
  ],
  pindus_barn_again: [
    { who: 'Pindus',   text: "Do you think she puts extra honey on the pancakes?" },
    { who: 'Fetsson',  text: "She always does. Let's go already!" },
  ],
  hay_bale: [
    { who: 'Fetsson',  text: "Oh! There's a sturdy stick buried in the hay." },
    { who: 'Fetsson',  text: "I'll take it — you never know when a stick comes in handy." },
  ],
  farmhouse_locked_first: [
    { who: 'Fetsson',  text: "Hmm. The farmhouse door is locked." },
    { who: 'Pindus',   text: "That's odd. Mrs. Hen always keeps a spare key somewhere on the farm." },
    { who: 'Pindus',   text: "We just need to find it!" },
  ],
  farmhouse_locked_again: [
    { who: 'Fetsson',  text: "Still locked. I need to find the spare key first." },
  ],
  scarecrow: [
    { who: 'Scarecrow', text: '… … …' },
    { who: 'Fetsson',   text: 'Did… did the scarecrow just speak?' },
    { who: 'Scarecrow', text: 'CREEAK… The little stone man in the garden… he guards what you seek…' },
    { who: 'Pindus',    text: "It means the garden gnome! The key must be hidden near the garden gnome!" },
    { who: 'Fetsson',   text: "Right. Now if only we could get INTO the garden…" },
  ],
  rusty_gate: [
    { who: 'Fetsson',  text: "This gate is solid rust. It won't budge." },
  ],
  rusty_gate_hint: [
    { who: 'Fetsson',  text: "This gate is really stuck. The hinges are completely seized up." },
    { who: 'Pindus',   text: "Water dissolves rust, you know. Stick-insect science fact!" },
  ],
  gate_open_water: [
    { who: 'Fetsson',  text: "Let me pour this water on the rusty hinges…" },
    { who: 'Fetsson',  text: "There we go! That loosened things up!" },
    { who: 'Pindus',   text: "The garden is open! Excellent stick-insect teamwork." },
  ],
  pickup_bucket: [
    { who: 'Fetsson',  text: "An old wooden bucket by the well. Might be useful." },
  ],
  well_no_bucket: [
    { who: 'Fetsson',  text: "A lovely stone well. The water looks cold and fresh." },
    { who: 'Pindus',   text: "If only we had something to carry it in…" },
  ],
  fill_bucket: [
    { who: 'Fetsson',  text: "I'll fill the bucket with well water." },
    { who: 'Pindus',   text: "Cold and clear! Perfect for dissolving stubborn rust." },
  ],
  gnome_no_stick: [
    { who: 'Fetsson',  text: "I can see something shiny under that gnome, but my hoof can't reach it." },
    { who: 'Pindus',   text: "You need something long and thin. If only you had… a stick!" },
  ],
  gnome_with_stick: [
    { who: 'Fetsson',  text: "Let me use this stick to fish under the gnome…" },
    { who: 'Fetsson',  text: "Got it!" },
    { who: 'Pindus',   text: "It's a key! That must be Mrs. Hen's spare house key!" },
  ],
  veggies: [
    { who: 'Fetsson',  text: "Look at those fat pumpkins! Nearly ready for harvest." },
    { who: 'Pindus',   text: "Mrs. Hen's pumpkin soup is legendary. But first — pancakes!" },
  ],
  open_door: [
    { who: 'Fetsson',  text: "The key fits! The door swings open with a welcoming creak." },
    { who: 'Pindus',   text: "I can smell the pancakes from HERE!" },
  ],
  ending: [
    { who: 'Mrs. Hen', text: "Oh! Fetsson, Pindus! There you are! I was starting to worry." },
    { who: 'Fetsson',  text: "We found your spare key, Mrs. Hen! It was under the garden gnome." },
    { who: 'Mrs. Hen', text: "Oh gracious, I accidentally locked myself out earlier and hid the spare key in a hurry. How forgetful of me!" },
    { who: 'Pindus',   text: "No harm done! And those pancakes smell absolutely DIVINE." },
    { who: 'Mrs. Hen', text: "Sit, sit! Apple pancakes with clover honey — you've earned every last bite!" },
    { who: 'Fetsson',  text: "This is the best morning on the farm ever." },
    { who: 'Pindus',   text: "Agreed. I also found three excellent sticks in the garden on the way, so it's a double win for me." },
    { who: 'Mrs. Hen', text: "…You are a very peculiar stick insect, Pindus." },
    { who: 'Pindus',   text: "Thank you! That's the kindest thing anyone's said to me all week." },
  ],
};

// ─────────────────────────────────────────────────────────────
// DRAWING UTILITIES
// ─────────────────────────────────────────────────────────────
function drawRoundRect(ctx, x, y, w, h, r, fill, stroke, lw) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  if (fill)   { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw || 1; ctx.stroke(); }
}

function gradientRect(ctx, x, y, w, h, col1, col2, vertical) {
  const g = vertical
    ? ctx.createLinearGradient(x, y, x, y + h)
    : ctx.createLinearGradient(x, y, x + w, y);
  g.addColorStop(0, col1);
  g.addColorStop(1, col2);
  ctx.fillStyle = g;
  ctx.fillRect(x, y, w, h);
}

// ─────────────────────────────────────────────────────────────
// DRAW: CLOUDS
// ─────────────────────────────────────────────────────────────
function drawCloud(ctx, cx, cy, scale) {
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  const s = scale || 1;
  ctx.beginPath();
  ctx.arc(cx, cy, 22 * s, 0, Math.PI * 2);
  ctx.arc(cx + 25 * s, cy - 8 * s, 18 * s, 0, Math.PI * 2);
  ctx.arc(cx + 48 * s, cy, 20 * s, 0, Math.PI * 2);
  ctx.arc(cx + 24 * s, cy + 12 * s, 16 * s, 0, Math.PI * 2);
  ctx.fill();
}

// ─────────────────────────────────────────────────────────────
// DRAW: FETSSON (pig)
// cx, cy = centre of body; facing = 1 (right) or -1 (left)
// walkFrame = 0-3 for leg animation
// ─────────────────────────────────────────────────────────────
function drawFetsson(ctx, cx, cy, facing, walkFrame) {
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
    [0, 1, 0, -1],    // frame 0
    [1, 0, -1, 0],    // frame 1
    [0, -1, 0, 1],    // frame 2
    [-1, 0, 1, 0],    // frame 3
  ][walkFrame % 4];

  const legPositions = [[-14, -6], [-6, -6], [6, -6], [14, -6]];
  legPositions.forEach(([lx, lz], i) => {
    const swing = state.player.walking ? legOffsets[i] * 6 : 0;
    ctx.fillStyle = pinkDark;
    drawRoundRect(ctx, lx - 4, 16 + swing, 8, 14, 3, pinkBody, pinkDark, 1);
  });

  // body
  ctx.beginPath();
  ctx.ellipse(0, 4, 26, 18, 0, 0, Math.PI * 2);
  ctx.fillStyle = pinkBody;
  ctx.fill();
  ctx.strokeStyle = pinkDark; ctx.lineWidth = 1.5; ctx.stroke();

  // belly spot
  ctx.beginPath();
  ctx.ellipse(0, 8, 14, 10, 0, 0, Math.PI * 2);
  ctx.fillStyle = pinkLight;
  ctx.fill();

  // tail (curly)
  ctx.beginPath();
  ctx.moveTo(-22, -2);
  ctx.bezierCurveTo(-34, -10, -38, 4, -30, 6);
  ctx.bezierCurveTo(-22, 8, -20, 0, -26, -4);
  ctx.strokeStyle = pinkDark; ctx.lineWidth = 2.5;
  ctx.stroke();

  // neck / head
  ctx.beginPath();
  ctx.ellipse(20, -8, 16, 14, 0.3, 0, Math.PI * 2);
  ctx.fillStyle = pinkBody;
  ctx.fill();
  ctx.strokeStyle = pinkDark; ctx.lineWidth = 1.5; ctx.stroke();

  // ear
  ctx.beginPath();
  ctx.ellipse(18, -20, 6, 9, -0.5, 0, Math.PI * 2);
  ctx.fillStyle = pinkDark; ctx.fill();
  ctx.beginPath();
  ctx.ellipse(18, -20, 3, 5, -0.5, 0, Math.PI * 2);
  ctx.fillStyle = pinkLight; ctx.fill();

  // far ear (partially behind head)
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
  // gleam
  ctx.beginPath();
  ctx.arc(27.8, -11, 0.8, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff'; ctx.fill();

  // snout
  ctx.beginPath();
  ctx.ellipse(32, -5, 7, 5, 0.1, 0, Math.PI * 2);
  ctx.fillStyle = pinkLight; ctx.fill();
  ctx.strokeStyle = pinkDark; ctx.lineWidth = 1; ctx.stroke();
  // nostrils
  ctx.fillStyle = pinkDark;
  ctx.beginPath(); ctx.ellipse(30, -4.5, 1.5, 1, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(34, -4.5, 1.5, 1, 0, 0, Math.PI * 2); ctx.fill();

  ctx.restore();
}

// ─────────────────────────────────────────────────────────────
// DRAW: PINDUS (stick insect)
// ─────────────────────────────────────────────────────────────
function drawPindus(ctx, cx, cy, facing) {
  ctx.save();
  ctx.translate(cx, cy);
  if (facing === -1) ctx.scale(-1, 1);

  const brown     = '#8B6340';
  const darkBrown = '#5C3D1A';
  const leafGreen = '#6B8E23';

  // shadow
  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  ctx.beginPath();
  ctx.ellipse(0, 18, 16, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // legs (3 pairs)
  const legData = [
    { x: -10, angle1: -0.7, angle2: 0.4 },
    { x: 0,   angle1: -0.5, angle2: 0.6 },
    { x:  10, angle1: -0.6, angle2: 0.4 },
  ];
  legData.forEach(({ x, angle1, angle2 }) => {
    // upper leg
    ctx.save();
    ctx.translate(x, 4);
    ctx.rotate(angle1);
    ctx.fillStyle = brown;
    ctx.fillRect(-1.5, 0, 3, 10);
    ctx.restore();
    // lower leg (other side)
    ctx.save();
    ctx.translate(x, 4);
    ctx.rotate(angle2);
    ctx.fillStyle = brown;
    ctx.fillRect(-1.5, 0, 3, 10);
    ctx.restore();
  });

  // body (elongated)
  ctx.save();
  ctx.rotate(-0.08);
  ctx.beginPath();
  ctx.ellipse(0, 2, 7, 20, 0, 0, Math.PI * 2);
  ctx.fillStyle = brown; ctx.fill();
  ctx.strokeStyle = darkBrown; ctx.lineWidth = 1; ctx.stroke();
  // body segments (lines)
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
// DRAW: MRS. HEN (chicken)
// ─────────────────────────────────────────────────────────────
function drawMrsHen(ctx, cx, cy) {
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
  ctx.beginPath();
  ctx.arc(22, -25, 3.5, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff'; ctx.fill();
  ctx.beginPath();
  ctx.arc(23, -25, 2, 0, Math.PI * 2);
  ctx.fillStyle = '#1a0a00'; ctx.fill();
  ctx.beginPath();
  ctx.arc(23.5, -26, 0.8, 0, Math.PI * 2);
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

// ─────────────────────────────────────────────────────────────
// DRAW: TITLE SCREEN
// ─────────────────────────────────────────────────────────────
function drawTitleScreen(ctx) {
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
  drawCloud(ctx, 80, 70, 0.9);
  drawCloud(ctx, 540, 50, 1.1);
  drawCloud(ctx, 680, 90, 0.7);

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

  // Characters on the ground
  drawFetsson(ctx, 290, 390, 1, 0);
  drawPindus(ctx,  400, 390, -1);

  // Title card
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.5)';
  ctx.shadowBlur = 12;
  drawRoundRect(ctx, 100, 50, 600, 180, 14, 'rgba(15,8,2,0.82)', '#c8a030', 3);
  ctx.restore();

  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffe060';
  ctx.font = 'bold 52px Georgia, serif';
  ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 8;
  ctx.fillText('Fetsson och Pindus', W / 2, 130);

  ctx.fillStyle = '#f0d89a';
  ctx.font = 'italic 22px Georgia, serif';
  ctx.shadowBlur = 4;
  ctx.fillText('A Cozy Farm Adventure', W / 2, 168);

  ctx.font = '15px Georgia, serif';
  ctx.fillStyle = '#c8a44a';
  ctx.fillText('Help Fetsson and Pindus find their way to breakfast!', W / 2, 204);

  ctx.shadowBlur = 0;
  ctx.fillStyle = '#ffffff';
  ctx.font = '16px Georgia, serif';
  const blink = Math.floor(state.tick / 30) % 2 === 0;
  if (blink) ctx.fillText('Click anywhere to begin', W / 2, 460);
  ctx.textAlign = 'left';
}

// ─────────────────────────────────────────────────────────────
// DRAW: BARN SCENE
// ─────────────────────────────────────────────────────────────
function drawBarnScene(ctx) {
  // Back wall
  gradientRect(ctx, 0, 0, W, 390, '#7a4820', '#5a3010', true);

  // Wooden planks (horizontal lines)
  ctx.strokeStyle = '#4a2008'; ctx.lineWidth = 1.5;
  for (let y = 30; y < 390; y += 28) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }

  // Vertical support beams
  [140, 320, 480, 660].forEach(bx => {
    gradientRect(ctx, bx - 14, 0, 28, 390, '#8B4513', '#5C2A06', false);
    ctx.strokeStyle = '#3a1a04'; ctx.lineWidth = 1;
    ctx.strokeRect(bx - 14, 0, 28, 390);
  });

  // Horizontal beam
  gradientRect(ctx, 0, 130, W, 20, '#8B4513', '#5C2A06', false);
  ctx.strokeStyle = '#3a1a04'; ctx.lineWidth = 1;
  ctx.strokeRect(0, 130, W, 20);

  // Window (left) with glow
  const winGlow = ctx.createRadialGradient(110, 100, 5, 110, 100, 90);
  winGlow.addColorStop(0, 'rgba(255,230,150,0.4)');
  winGlow.addColorStop(1, 'rgba(255,230,150,0)');
  ctx.fillStyle = winGlow;
  ctx.fillRect(30, 30, 180, 170);

  ctx.fillStyle = '#87ceeb';
  ctx.fillRect(50, 50, 120, 80);
  // sunrise tint in window
  gradientRect(ctx, 50, 90, 120, 40, 'rgba(255,180,60,0)', 'rgba(255,180,60,0.3)', true);
  ctx.strokeStyle = '#8B4513'; ctx.lineWidth = 5;
  ctx.strokeRect(50, 50, 120, 80);
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(110, 50); ctx.lineTo(110, 130); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(50, 90);  ctx.lineTo(170, 90);  ctx.stroke();

  // Hanging lantern
  ctx.fillStyle = '#c07820';
  ctx.fillRect(396, 60, 8, 20);
  drawRoundRect(ctx, 384, 78, 32, 42, 8, '#d09020', '#a06010', 2);
  // flame glow
  const flamePulse = 0.7 + 0.3 * Math.sin(state.tick * 0.08);
  const fg = ctx.createRadialGradient(400, 90, 2, 400, 90, 24 * flamePulse);
  fg.addColorStop(0, 'rgba(255,200,60,0.8)');
  fg.addColorStop(1, 'rgba(255,140,0,0)');
  ctx.fillStyle = fg;
  ctx.fillRect(376, 62, 48, 48);

  // Floor
  gradientRect(ctx, 0, 380, W, 120, '#c8a460', '#a07830', true);
  // Straw texture lines
  ctx.strokeStyle = '#8a6020'; ctx.lineWidth = 1;
  for (let i = 0; i < 40; i++) {
    const sx = (i * 54 + 12) % W;
    const sy = 385 + Math.sin(i * 3) * 10;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.bezierCurveTo(sx + 12, sy - 4, sx + 24, sy + 4, sx + 36, sy + 1);
    ctx.stroke();
  }

  // Barn doors (right) — exit to farm yard
  gradientRect(ctx, 640, 50, 80, 340, '#a05a10', '#7a3a06', true);
  gradientRect(ctx, 720, 50, 80, 340, '#9a5410', '#743606', true);
  // Door planks
  ctx.strokeStyle = '#5a2a04'; ctx.lineWidth = 2;
  for (let dy = 50; dy < 390; dy += 36) {
    ctx.beginPath(); ctx.moveTo(640, dy); ctx.lineTo(720, dy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(720, dy); ctx.lineTo(800, dy); ctx.stroke();
  }
  // Door hinge
  ctx.fillStyle = '#404040';
  ctx.fillRect(636, 100, 10, 20); ctx.fillRect(636, 260, 10, 20);
  ctx.fillRect(716, 100, 10, 20); ctx.fillRect(716, 260, 10, 20);
  // Door gap with light
  const doorLight = ctx.createLinearGradient(718, 0, 722, 0);
  doorLight.addColorStop(0, 'rgba(255,220,120,0)');
  doorLight.addColorStop(0.5, 'rgba(255,220,120,0.7)');
  doorLight.addColorStop(1, 'rgba(255,220,120,0)');
  ctx.fillStyle = doorLight;
  ctx.fillRect(718, 50, 4, 340);

  // Hay bale (left) — interactive
  drawHayBale(ctx, 70, 350, !state.flags.stickPickedUp);

  // Hay bale (right, decorative)
  drawHayBale(ctx, 520, 360, false);

  // Hotspot highlight
  if (state.hovered === 'hay_bale') {
    ctx.strokeStyle = 'rgba(255,220,60,0.7)';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.strokeRect(40, 330, 160, 80);
    ctx.setLineDash([]);
  }
  if (state.hovered === 'barn_door_exit') {
    ctx.strokeStyle = 'rgba(255,220,60,0.7)';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.strokeRect(630, 50, 170, 340);
    ctx.setLineDash([]);
  }
}

function drawHayBale(ctx, x, y, hasStick) {
  // bale body
  drawRoundRect(ctx, x, y, 120, 60, 10, '#d4a430', '#a07820', 2);
  // straw lines
  ctx.strokeStyle = '#c89020'; ctx.lineWidth = 1.5;
  for (let i = 0; i < 7; i++) {
    ctx.beginPath();
    ctx.moveTo(x + 10 + i * 16, y + 5);
    ctx.bezierCurveTo(x + 14 + i * 16, y + 30, x + 8 + i * 16, y + 40, x + 12 + i * 16, y + 55);
    ctx.stroke();
  }
  // rope band
  ctx.strokeStyle = '#8a6010'; ctx.lineWidth = 3;
  ctx.strokeRect(x + 6, y + 6, 108, 48);
  ctx.beginPath();
  ctx.moveTo(x + 60, y + 6); ctx.lineTo(x + 60, y + 54);
  ctx.stroke();

  if (hasStick) {
    // stick sticking out of the hay
    ctx.strokeStyle = '#7a4f10'; ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x + 70, y - 20);
    ctx.lineTo(x + 80, y + 10);
    ctx.stroke();
    ctx.lineCap = 'butt';
  }
}

// ─────────────────────────────────────────────────────────────
// DRAW: FARM YARD SCENE
// ─────────────────────────────────────────────────────────────
function drawFarmYardScene(ctx) {
  // Sky
  gradientRect(ctx, 0, 0, W, 300, '#4a90d9', '#87ceeb', true);

  // Clouds (gently drifting)
  const drift = (state.tick * 0.2) % 900;
  drawCloud(ctx, 60 + drift, 60, 1.0);
  drawCloud(ctx, 360 + drift * 0.6, 40, 0.8);
  drawCloud(ctx, 650 + drift * 0.4, 80, 1.1);

  // Distant hills
  ctx.fillStyle = '#3a8028';
  ctx.beginPath();
  ctx.moveTo(0, 240);
  ctx.bezierCurveTo(120, 185, 260, 215, 420, 195);
  ctx.bezierCurveTo(560, 175, 700, 205, W, 185);
  ctx.lineTo(W, 300); ctx.lineTo(0, 300);
  ctx.closePath(); ctx.fill();

  // Ground
  gradientRect(ctx, 0, 295, W, 205, '#5aac44', '#3a8028', true);

  // Dirt path
  ctx.fillStyle = '#b89050';
  ctx.beginPath();
  ctx.moveTo(350, 500);
  ctx.bezierCurveTo(370, 420, 360, 350, 420, 295);
  ctx.bezierCurveTo(460, 265, 500, 260, 600, 200);
  ctx.lineTo(620, 220);
  ctx.bezierCurveTo(510, 280, 470, 285, 430, 320);
  ctx.bezierCurveTo(380, 370, 390, 440, 380, 500);
  ctx.closePath(); ctx.fill();

  // ── BARN (left background) ──
  ctx.fillStyle = '#c62828';
  ctx.fillRect(0, 230, 140, 200);
  // Barn roof
  ctx.fillStyle = '#8b1c1c';
  ctx.beginPath();
  ctx.moveTo(-10, 232); ctx.lineTo(70, 170); ctx.lineTo(150, 232);
  ctx.closePath(); ctx.fill();
  // Barn door
  ctx.fillStyle = '#7a3a06';
  ctx.fillRect(40, 330, 60, 100);
  ctx.strokeStyle = '#5a2204'; ctx.lineWidth = 2;
  ctx.strokeRect(40, 330, 60, 100);
  ctx.beginPath();
  ctx.moveTo(70, 330); ctx.lineTo(70, 430);
  ctx.moveTo(40, 380); ctx.lineTo(100, 380);
  ctx.stroke();
  // Barn window
  ctx.fillStyle = '#87ceeb';
  ctx.fillRect(80, 255, 40, 30);
  ctx.strokeStyle = '#5a2204'; ctx.lineWidth = 2;
  ctx.strokeRect(80, 255, 40, 30);

  // Barn door highlight
  if (state.hovered === 'barn_back') {
    ctx.strokeStyle = 'rgba(255,220,60,0.7)'; ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.strokeRect(30, 320, 90, 120); ctx.setLineDash([]);
  }

  // ── FARMHOUSE ──
  // Foundation
  ctx.fillStyle = '#8b7050';
  ctx.fillRect(130, 385, 220, 30);
  // Walls
  ctx.fillStyle = '#f5f0e0';
  ctx.fillRect(130, 250, 220, 140);
  // Roof
  ctx.fillStyle = '#c46030';
  ctx.beginPath();
  ctx.moveTo(118, 252); ctx.lineTo(240, 185); ctx.lineTo(362, 252);
  ctx.closePath(); ctx.fill();
  // Chimney
  ctx.fillStyle = '#b87040';
  ctx.fillRect(280, 180, 24, 45);
  // Smoke puffs
  const smokeOff = (state.tick * 0.4) % 40;
  [0, 1, 2].forEach(i => {
    const sz = 8 + i * 4;
    const sy = 175 - i * 20 - smokeOff;
    if (sy > 40) {
      ctx.beginPath();
      ctx.arc(292 + Math.sin(i * 1.5) * 5, sy, sz, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(220,210,200,${0.5 - i * 0.15})`;
      ctx.fill();
    }
  });
  // Farmhouse windows
  ctx.fillStyle = '#87ceeb';
  ctx.fillRect(150, 278, 50, 45);
  ctx.fillRect(278, 278, 50, 45);
  ctx.strokeStyle = '#a87040'; ctx.lineWidth = 3;
  ctx.strokeRect(150, 278, 50, 45);
  ctx.strokeRect(278, 278, 50, 45);
  // Window cross
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(175, 278); ctx.lineTo(175, 323);
  ctx.moveTo(150, 300); ctx.lineTo(200, 300);
  ctx.moveTo(303, 278); ctx.lineTo(303, 323);
  ctx.moveTo(278, 300); ctx.lineTo(328, 300);
  ctx.stroke();
  // Flower boxes
  ctx.fillStyle = '#8b4513';
  ctx.fillRect(148, 322, 54, 12);
  ctx.fillRect(276, 322, 54, 12);
  // Flowers
  ['#ff6060', '#ff90b0', '#ffcc40'].forEach((col, i) => {
    ctx.fillStyle = col;
    ctx.beginPath(); ctx.arc(158 + i * 15, 320, 4, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(286 + i * 15, 320, 4, 0, Math.PI * 2); ctx.fill();
  });
  // Door (farmhouse) — locked
  ctx.fillStyle = '#c8a060';
  ctx.fillRect(210, 325, 50, 75);
  ctx.strokeStyle = '#8b5a20'; ctx.lineWidth = 2;
  ctx.strokeRect(210, 325, 50, 75);
  // Doorknob
  ctx.fillStyle = '#c8c8c8';
  ctx.beginPath(); ctx.arc(252, 365, 4, 0, Math.PI * 2); ctx.fill();
  if (!state.flags.doorOpen) {
    // Lock icon
    ctx.fillStyle = '#808080';
    ctx.fillRect(248, 354, 8, 6);
    ctx.strokeStyle = '#606060'; ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(252, 353, 4, Math.PI, 0);
    ctx.stroke();
  }

  // Farmhouse door highlight
  if (state.hovered === 'farmhouse_door') {
    ctx.strokeStyle = 'rgba(255,220,60,0.7)'; ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.strokeRect(208, 323, 54, 78); ctx.setLineDash([]);
  }

  // ── WELL ──
  // Stone base
  ctx.fillStyle = '#909090';
  ctx.beginPath();
  ctx.ellipse(490, 376, 36, 16, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#606060'; ctx.lineWidth = 2; ctx.stroke();
  ctx.fillStyle = '#a0a0a0';
  ctx.fillRect(454, 330, 72, 46);
  ctx.strokeStyle = '#606060'; ctx.lineWidth = 2;
  ctx.strokeRect(454, 330, 72, 46);
  // Mortar lines
  ctx.strokeStyle = '#808080'; ctx.lineWidth = 1;
  [[454, 346], [454, 360]].forEach(([x, y]) => {
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 72, y); ctx.stroke();
  });
  [472, 490, 508].forEach(x => {
    ctx.beginPath(); ctx.moveTo(x, 330); ctx.lineTo(x, 376); ctx.stroke();
  });
  // A-frame
  ctx.strokeStyle = '#7a4820'; ctx.lineWidth = 5; ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(456, 330); ctx.lineTo(490, 280); ctx.lineTo(524, 330);
  ctx.stroke();
  // Crossbeam
  ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(468, 305); ctx.lineTo(512, 305); ctx.stroke();
  ctx.lineCap = 'butt';
  // Rope and bucket (if not picked up)
  if (!state.flags.bucketPickedUp) {
    ctx.strokeStyle = '#c8a040'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(490, 305); ctx.lineTo(490, 340); ctx.stroke();
    // Bucket
    ctx.fillStyle = '#8b6020';
    ctx.beginPath();
    ctx.moveTo(478, 340); ctx.lineTo(480, 360); ctx.lineTo(500, 360); ctx.lineTo(502, 340);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#5a3a10'; ctx.lineWidth = 1.5; ctx.stroke();
    // Handle
    ctx.beginPath();
    ctx.arc(490, 340, 12, Math.PI, 0);
    ctx.strokeStyle = '#c8a040'; ctx.lineWidth = 2; ctx.stroke();
  }
  // Water in well
  ctx.fillStyle = 'rgba(60,140,200,0.5)';
  ctx.beginPath();
  ctx.ellipse(490, 374, 34, 14, 0, 0, Math.PI * 2);
  ctx.fill();

  // Well highlight
  if (state.hovered === 'well') {
    ctx.strokeStyle = 'rgba(255,220,60,0.7)'; ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.strokeRect(454, 270, 72, 116); ctx.setLineDash([]);
  }

  // ── SCARECROW ──
  // Post
  ctx.strokeStyle = '#8b6020'; ctx.lineWidth = 5; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(600, 360); ctx.lineTo(600, 240); ctx.stroke();
  // Arms
  ctx.beginPath(); ctx.moveTo(560, 280); ctx.lineTo(640, 280); ctx.stroke();
  ctx.lineCap = 'butt';
  // Clothes
  ctx.fillStyle = '#8b6914';
  ctx.fillRect(582, 255, 36, 60);
  ctx.fillRect(562, 278, 76, 12);
  ctx.strokeStyle = '#5a4010'; ctx.lineWidth = 1;
  ctx.strokeRect(582, 255, 36, 60);
  // Patches
  ctx.fillStyle = '#c08030';
  ctx.fillRect(584, 278, 14, 12);
  ctx.fillRect(602, 295, 10, 10);
  // Head
  ctx.beginPath();
  ctx.arc(600, 248, 18, 0, Math.PI * 2);
  ctx.fillStyle = '#d4a830'; ctx.fill();
  ctx.strokeStyle = '#a07820'; ctx.lineWidth = 1; ctx.stroke();
  // Hat
  ctx.fillStyle = '#4a3010';
  ctx.fillRect(584, 226, 32, 6);  // brim
  ctx.fillRect(589, 212, 22, 16); // crown
  // Face
  ctx.fillStyle = '#3a2010';
  ctx.beginPath(); ctx.arc(594, 248, 2.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(606, 248, 2.5, 0, Math.PI * 2); ctx.fill();
  // Stitched mouth
  ctx.strokeStyle = '#3a2010'; ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(594, 254); ctx.lineTo(598, 258); ctx.lineTo(602, 253); ctx.lineTo(606, 257);
  ctx.stroke();
  // Straw sticking out
  ctx.strokeStyle = '#d4a020'; ctx.lineWidth = 2;
  [[562, 284], [638, 284], [580, 315]].forEach(([sx, sy]) => {
    for (let i = -1; i <= 1; i++) {
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(sx + i * 10, sy + 14);
      ctx.stroke();
    }
  });

  // Scarecrow highlight
  if (state.hovered === 'scarecrow') {
    ctx.strokeStyle = 'rgba(255,220,60,0.7)'; ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.strokeRect(578, 224, 44, 140); ctx.setLineDash([]);
  }

  // ── FENCE & GATE (right) ──
  // Fence posts
  for (let fy = 230; fy <= 430; fy += 38) {
    ctx.fillStyle = '#c8a060';
    ctx.fillRect(708, fy, 12, 36);
    ctx.fillStyle = '#a07840';
    ctx.fillRect(712, fy - 6, 4, 8);  // post cap
  }
  // Fence rails
  ctx.fillStyle = '#c8a060';
  ctx.fillRect(720, 260, W - 720, 10);
  ctx.fillRect(720, 310, W - 720, 10);
  ctx.fillRect(720, 360, W - 720, 10);

  // Garden gate
  if (!state.flags.gateOpen) {
    // Gate bars
    ctx.fillStyle = state.hovered === 'garden_gate' ? '#d09050' : '#b88040';
    for (let gx = 724; gx < 800; gx += 14) {
      ctx.fillRect(gx, 240, 8, 180);
    }
    // Horizontal rails
    ctx.fillStyle = '#c8a060';
    ctx.fillRect(722, 250, W - 722, 12);
    ctx.fillRect(722, 310, W - 722, 12);
    ctx.fillRect(722, 370, W - 722, 12);
    // Rust patches
    ctx.fillStyle = 'rgba(160,80,20,0.6)';
    [[730, 260, 16, 8], [748, 380, 14, 6], [760, 305, 18, 7]].forEach(([rx, ry, rw, rh]) => {
      ctx.fillRect(rx, ry, rw, rh);
    });
    // Gate highlight
    if (state.hovered === 'garden_gate') {
      ctx.strokeStyle = 'rgba(255,220,60,0.7)'; ctx.lineWidth = 2;
      ctx.setLineDash([6, 4]);
      ctx.strokeRect(720, 238, W - 720, 185); ctx.setLineDash([]);
    }
  } else {
    // Gate open (leaning against fence)
    ctx.save();
    ctx.translate(724, 420); ctx.rotate(-1.3);
    ctx.fillStyle = '#a07840';
    ctx.fillRect(-8, -160, 8 + 14 * 6, 10);
    ctx.fillRect(-8, -90, 8 + 14 * 6, 10);
    for (let gx = 0; gx < 14 * 6; gx += 14) {
      ctx.fillRect(gx - 4, -165, 8, 160);
    }
    ctx.restore();
    // Arrow pointing to garden opening
    if (state.hovered === 'garden_gate') {
      ctx.strokeStyle = 'rgba(255,220,60,0.7)'; ctx.lineWidth = 2;
      ctx.setLineDash([6, 4]);
      ctx.strokeRect(720, 238, W - 720, 185); ctx.setLineDash([]);
    }
  }

  // Trees
  drawTree(ctx, 390, 260, 0.8);
  drawTree(ctx, 680, 240, 0.7);
}

function drawTree(ctx, x, y, scale) {
  ctx.fillStyle = '#6b4820';
  ctx.fillRect(x - 6 * scale, y, 12 * scale, 50 * scale);
  ctx.fillStyle = '#2d6e22';
  ctx.beginPath();
  ctx.arc(x, y - 12 * scale, 32 * scale, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath();
  ctx.arc(x + 18 * scale, y + 4 * scale, 22 * scale, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath();
  ctx.arc(x - 16 * scale, y + 4 * scale, 22 * scale, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#3a8428';
  ctx.beginPath();
  ctx.arc(x + 6 * scale, y - 20 * scale, 18 * scale, 0, Math.PI * 2); ctx.fill();
}

// ─────────────────────────────────────────────────────────────
// DRAW: GARDEN SCENE
// ─────────────────────────────────────────────────────────────
function drawGardenScene(ctx) {
  // Sky
  gradientRect(ctx, 0, 0, W, 300, '#5a9ad9', '#87ceeb', true);

  // Clouds
  const drift2 = (state.tick * 0.15) % 900;
  drawCloud(ctx, 150 + drift2, 55, 0.9);
  drawCloud(ctx, 550 + drift2 * 0.5, 75, 1.0);

  // Ground
  gradientRect(ctx, 0, 298, W, 202, '#5aac44', '#3a8028', true);

  // Soil paths / garden beds
  ctx.fillStyle = '#8b5c2a';
  ctx.fillRect(60, 330, 420, 80);
  ctx.fillStyle = '#7a4e22';
  // Soil row dividers
  [150, 240, 330].forEach(sx => {
    ctx.fillRect(sx, 330, 6, 80);
  });

  // ── VEGETABLES ──
  drawVeggies(ctx);

  // ── GARDEN GNOME ──
  drawGardenGnome(ctx, 230, 360);

  // ── FLOWER BED ──
  ctx.fillStyle = '#5aac44';
  ctx.fillRect(500, 325, 200, 65);
  [
    { x: 520, y: 345, col: '#ff4444' },
    { x: 550, y: 340, col: '#ff88cc' },
    { x: 580, y: 348, col: '#ffcc00' },
    { x: 610, y: 342, col: '#cc44ff' },
    { x: 640, y: 345, col: '#44aaff' },
    { x: 670, y: 340, col: '#ff6622' },
    { x: 535, y: 360, col: '#ffcc00' },
    { x: 565, y: 358, col: '#ff4444' },
    { x: 595, y: 362, col: '#44ff88' },
    { x: 625, y: 356, col: '#ff88cc' },
    { x: 655, y: 360, col: '#ffcc00' },
  ].forEach(({ x, y, col }) => {
    // stem
    ctx.strokeStyle = '#3a8028'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x, y + 16); ctx.lineTo(x, y); ctx.stroke();
    // petals
    ctx.fillStyle = col;
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 3) {
      ctx.beginPath();
      ctx.ellipse(x + Math.cos(a) * 6, y + Math.sin(a) * 6, 5, 4, a, 0, Math.PI * 2);
      ctx.fill();
    }
    // centre
    ctx.fillStyle = '#ffe060';
    ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fill();
  });

  // ── FENCE ──
  // Left fence with gate back
  ctx.fillStyle = '#c8a060';
  for (let fy = 180; fy < 460; fy += 38) {
    ctx.fillRect(0, fy, 12, 32);
    ctx.fillRect(0, fy - 6, 12, 8);
  }
  ctx.fillRect(12, 220, 10, 10);
  ctx.fillRect(12, 270, 10, 10);
  ctx.fillRect(12, 320, 10, 10);
  ctx.fillRect(12, 370, 10, 10);

  // Gate (open) — left side
  ctx.save();
  ctx.translate(24, 430); ctx.rotate(-1.0);
  ctx.fillStyle = '#a07840';
  ctx.fillRect(-4, -160, 46, 8);
  ctx.fillRect(-4, -100, 46, 8);
  for (let gx = 0; gx < 46; gx += 12) {
    ctx.fillRect(gx, -165, 8, 160);
  }
  ctx.restore();

  // Back gate highlight
  if (state.hovered === 'garden_exit') {
    ctx.strokeStyle = 'rgba(255,220,60,0.7)'; ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.strokeRect(0, 200, 55, 220); ctx.setLineDash([]);
  }

  // Right trees
  drawTree(ctx, 740, 240, 1.0);
  drawTree(ctx, 680, 260, 0.7);

  // Gnome hotspot highlight
  if (state.hovered === 'gnome') {
    ctx.strokeStyle = 'rgba(255,220,60,0.7)'; ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.strokeRect(200, 300, 80, 75); ctx.setLineDash([]);
  }

  // Veggie patch highlight
  if (state.hovered === 'veggies') {
    ctx.strokeStyle = 'rgba(255,220,60,0.7)'; ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.strokeRect(60, 325, 420, 90); ctx.setLineDash([]);
  }
}

function drawVeggies(ctx) {
  // Pumpkins
  [[80, 370], [110, 365], [140, 372]].forEach(([vx, vy]) => {
    ctx.fillStyle = '#ff8c00';
    ctx.beginPath(); ctx.ellipse(vx, vy, 18, 14, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#cc6600'; ctx.lineWidth = 1; ctx.stroke();
    // Ribs
    [-8, 0, 8].forEach(rx => {
      ctx.beginPath();
      ctx.moveTo(vx + rx, vy - 14);
      ctx.bezierCurveTo(vx + rx + 3, vy, vx + rx + 2, vy + 5, vx + rx, vy + 14);
      ctx.strokeStyle = 'rgba(0,0,0,0.15)'; ctx.stroke();
    });
    // Stem
    ctx.strokeStyle = '#5a8020'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(vx, vy - 14); ctx.bezierCurveTo(vx + 4, vy - 22, vx + 2, vy - 26, vx - 2, vy - 24); ctx.stroke();
  });

  // Carrots
  [[175, 355], [195, 360], [215, 358]].forEach(([vx, vy]) => {
    ctx.fillStyle = '#ff6620';
    ctx.beginPath();
    ctx.moveTo(vx - 6, vy - 16);
    ctx.bezierCurveTo(vx - 8, vy + 5, vx + 8, vy + 5, vx + 6, vy - 16);
    ctx.closePath(); ctx.fill();
    // Top greens
    ctx.strokeStyle = '#4a8020'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(vx, vy - 16); ctx.lineTo(vx - 8, vy - 30); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(vx, vy - 16); ctx.lineTo(vx, vy - 32); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(vx, vy - 16); ctx.lineTo(vx + 8, vy - 28); ctx.stroke();
  });

  // Cabbages
  [[255, 368], [285, 362], [315, 370]].forEach(([vx, vy]) => {
    ctx.fillStyle = '#6aaa40';
    ctx.beginPath(); ctx.ellipse(vx, vy, 16, 12, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#4a8a28';
    ctx.beginPath(); ctx.ellipse(vx, vy, 10, 8, 0, 0, Math.PI * 2); ctx.fill();
    // Veins
    ctx.strokeStyle = '#3a7020'; ctx.lineWidth = 1;
    for (let a = 0; a < Math.PI; a += Math.PI / 4) {
      ctx.beginPath();
      ctx.moveTo(vx, vy);
      ctx.lineTo(vx + Math.cos(a) * 14, vy + Math.sin(a) * 10);
      ctx.stroke();
    }
  });
}

function drawGardenGnome(ctx, x, y) {
  // Base / body
  ctx.fillStyle = '#b0b0b0';
  ctx.beginPath();
  ctx.moveTo(x - 18, y + 10);
  ctx.bezierCurveTo(x - 20, y - 10, x - 18, y - 22, x, y - 24);
  ctx.bezierCurveTo(x + 18, y - 22, x + 20, y - 10, x + 18, y + 10);
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#808080'; ctx.lineWidth = 1; ctx.stroke();

  // Belt
  ctx.fillStyle = '#3a2010';
  ctx.fillRect(x - 18, y - 8, 36, 7);
  ctx.fillStyle = '#c8a020';
  ctx.fillRect(x - 4, y - 8, 8, 7);

  // Beard
  ctx.fillStyle = '#f0f0f0';
  ctx.beginPath();
  ctx.moveTo(x - 14, y - 16);
  ctx.bezierCurveTo(x - 18, y + 2, x - 14, y + 12, x, y + 14);
  ctx.bezierCurveTo(x + 14, y + 12, x + 18, y + 2, x + 14, y - 16);
  ctx.closePath(); ctx.fill();

  // Face
  ctx.fillStyle = '#e8c090';
  ctx.beginPath(); ctx.ellipse(x, y - 22, 12, 10, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#c0906060'; ctx.lineWidth = 1; ctx.stroke();
  // Rosy cheeks
  ctx.fillStyle = 'rgba(230,120,100,0.5)';
  ctx.beginPath(); ctx.arc(x - 8, y - 20, 5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x + 8, y - 20, 5, 0, Math.PI * 2); ctx.fill();
  // Eyes
  ctx.fillStyle = '#1a0a00';
  ctx.beginPath(); ctx.arc(x - 5, y - 24, 2, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x + 5, y - 24, 2, 0, Math.PI * 2); ctx.fill();
  // Smile
  ctx.strokeStyle = '#8b4513'; ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(x, y - 18, 5, 0.2, Math.PI - 0.2);
  ctx.stroke();

  // Hat (red pointy)
  ctx.fillStyle = '#c82020';
  ctx.beginPath();
  ctx.moveTo(x - 14, y - 30);
  ctx.lineTo(x + 4, y - 60);
  ctx.lineTo(x + 16, y - 28);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x - 15, y - 32, 32, 8);

  // Key visible under gnome (if not picked up)
  if (!state.flags.keyPickedUp) {
    ctx.fillStyle = '#d4a020';
    ctx.beginPath();
    ctx.arc(x + 22, y + 8, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(x + 27, y + 6, 14, 4);
    ctx.fillRect(x + 36, y + 6, 4, 7);
    ctx.fillRect(x + 32, y + 6, 4, 6);
    ctx.strokeStyle = '#a07010'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(x + 22, y + 8, 6, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeRect(x + 27, y + 6, 14, 4);
  }
}

// ─────────────────────────────────────────────────────────────
// DRAW: KITCHEN SCENE (ending)
// ─────────────────────────────────────────────────────────────
function drawKitchenScene(ctx) {
  // Floor — checkered tiles
  for (let tx = 0; tx < W; tx += 50) {
    for (let ty = 300; ty < H; ty += 50) {
      const even = ((tx + ty) / 50) % 2 < 1;
      ctx.fillStyle = even ? '#e8d8b0' : '#c8b890';
      ctx.fillRect(tx, ty, 50, 50);
    }
  }
  // Wall
  gradientRect(ctx, 0, 0, W, 305, '#f5edd8', '#e8d8b0', true);
  // Ceiling beam
  ctx.fillStyle = '#a07840';
  ctx.fillRect(0, 0, W, 28);
  [100, 250, 400, 550, 700].forEach(bx => {
    ctx.fillStyle = '#8b6020';
    ctx.fillRect(bx, 0, 20, 28);
  });

  // Window (back wall)
  ctx.fillStyle = '#87ceeb';
  ctx.fillRect(580, 60, 160, 120);
  gradientRect(ctx, 580, 140, 160, 40, 'rgba(255,200,80,0)', 'rgba(255,200,80,0.3)', true);
  ctx.strokeStyle = '#a07040'; ctx.lineWidth = 4;
  ctx.strokeRect(580, 60, 160, 120);
  ctx.beginPath();
  ctx.moveTo(660, 60); ctx.lineTo(660, 180);
  ctx.moveTo(580, 120); ctx.lineTo(740, 120);
  ctx.stroke();
  // Curtains
  ctx.fillStyle = 'rgba(220,80,60,0.7)';
  ctx.beginPath();
  ctx.moveTo(580, 60);
  ctx.bezierCurveTo(590, 80, 600, 100, 605, 180);
  ctx.lineTo(580, 180); ctx.closePath(); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(740, 60);
  ctx.bezierCurveTo(730, 80, 720, 100, 715, 180);
  ctx.lineTo(740, 180); ctx.closePath(); ctx.fill();

  // Shelves
  ctx.fillStyle = '#c8a060';
  ctx.fillRect(30, 80, 180, 12);
  ctx.fillRect(30, 150, 180, 12);
  // Shelf items
  ctx.fillStyle = '#cc6030'; ctx.fillRect(40, 64, 24, 16);   // jar
  ctx.fillStyle = '#8a4020'; ctx.fillRect(70, 62, 18, 18);   // pot
  ctx.fillStyle = '#c8a030'; ctx.fillRect(96, 66, 20, 14);   // jar
  ctx.fillStyle = '#4a8030'; ctx.fillRect(122, 60, 16, 20);  // bottle
  ctx.fillStyle = '#cc6030'; ctx.fillRect(40, 134, 24, 16);
  ctx.fillStyle = '#8a4020'; ctx.fillRect(70, 132, 18, 18);
  ctx.fillStyle = '#e0a030'; ctx.fillRect(96, 136, 20, 14);

  // Stove
  ctx.fillStyle = '#303030';
  ctx.fillRect(60, 200, 160, 150);
  ctx.fillStyle = '#202020';
  ctx.fillRect(60, 200, 160, 18);
  // Burner glow
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
  // Pan on stove
  ctx.fillStyle = '#282828';
  ctx.beginPath();
  ctx.ellipse(110, 202, 28, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#c87820';
  ctx.fillRect(80, 195, 12, 8);
  // Pancake in pan
  ctx.fillStyle = '#e8a840';
  ctx.beginPath(); ctx.ellipse(110, 198, 20, 8, 0, 0, Math.PI * 2); ctx.fill();

  // ── TABLE ──
  ctx.fillStyle = '#a07030';
  ctx.fillRect(280, 290, 360, 20); // table top
  // Legs
  ctx.fillStyle = '#8b5c20';
  ctx.fillRect(290, 308, 16, 100);
  ctx.fillRect(614, 308, 16, 100);
  // Table surface items
  // Plate 1 (pancakes!)
  ctx.fillStyle = '#f0ead8';
  ctx.beginPath(); ctx.ellipse(380, 278, 50, 14, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#c8b090'; ctx.lineWidth = 1; ctx.stroke();
  // Pancake stack
  ['#e8a840', '#e09830', '#d88820'].forEach((col, i) => {
    ctx.fillStyle = col;
    ctx.beginPath(); ctx.ellipse(380, 272 - i * 10, 36, 10, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#c07020'; ctx.lineWidth = 0.5; ctx.stroke();
  });
  // Honey drizzle
  ctx.strokeStyle = '#e8a020'; ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(360, 248);
  ctx.bezierCurveTo(365, 254, 375, 260, 385, 256);
  ctx.bezierCurveTo(390, 252, 385, 248, 380, 250);
  ctx.stroke();

  // Honey jar
  ctx.fillStyle = '#e8c020';
  ctx.fillRect(448, 255, 30, 30);
  ctx.fillStyle = '#d4b010';
  ctx.fillRect(448, 252, 30, 7);
  ctx.fillStyle = '#8b6010';
  ctx.fillRect(453, 246, 20, 8);
  // Label
  ctx.fillStyle = '#f8e880';
  ctx.fillRect(451, 259, 24, 18);
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
    // Handle
    ctx.strokeStyle = '#c8b090'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(cx2 + 18, cy2 + 14, 10, -Math.PI / 2, Math.PI / 2); ctx.stroke();
    // Contents
    ctx.fillStyle = '#c07020';
    ctx.fillRect(cx2 - 13, cy2 + 4, 26, 20);
  });

  // Sunlight beam from window
  const sl = ctx.createLinearGradient(580, 0, 400, 350);
  sl.addColorStop(0, 'rgba(255,230,150,0.12)');
  sl.addColorStop(1, 'rgba(255,230,150,0)');
  ctx.fillStyle = sl;
  ctx.beginPath();
  ctx.moveTo(580, 60); ctx.lineTo(740, 60);
  ctx.lineTo(440, 360); ctx.lineTo(340, 360);
  ctx.closePath(); ctx.fill();
}

// ─────────────────────────────────────────────────────────────
// HOTSPOT DEFINITIONS
// ─────────────────────────────────────────────────────────────
function getHotspots() {
  switch (state.scene) {
    case 'barn':
      return [
        {
          id: 'hay_bale',
          label: 'Hay Bale',
          x: 40, y: 330, w: 160, h: 80,
          walkToX: 130,
          visible: () => true,
          onInteract: () => {
            if (!state.flags.stickPickedUp) {
              showDialogue(DLG.hay_bale, () => {
                addItem('stick');
                state.flags.stickPickedUp = true;
              });
            } else {
              showDialogue([{ who: 'Fetsson', text: 'Just a hay bale now. The stick is already in my inventory.' }]);
            }
          },
        },
        {
          id: 'pindus_barn',
          label: 'Pindus',
          x: 270, y: 355, w: 80, h: 60,
          walkToX: 240,
          visible: () => true,
          onInteract: () => {
            if (!state.flags.stickPickedUp) {
              showDialogue(DLG.intro);
            } else {
              showDialogue(DLG.pindus_barn_again);
            }
          },
        },
        {
          id: 'barn_door_exit',
          label: 'Farm Yard →',
          x: 630, y: 50, w: 170, h: 340,
          walkToX: 620,
          visible: () => true,
          onInteract: () => {
            transitionTo('farmyard', 120, FLOOR_Y, 1);
          },
        },
      ];

    case 'farmyard':
      return [
        {
          id: 'barn_back',
          label: '← Barn',
          x: 30, y: 320, w: 90, h: 120,
          walkToX: 130,
          visible: () => true,
          onInteract: () => {
            transitionTo('barn', 580, FLOOR_Y, -1);
          },
        },
        {
          id: 'farmhouse_door',
          label: state.flags.doorOpen ? 'Farmhouse →' : 'Farmhouse Door (Locked)',
          x: 208, y: 323, w: 56, h: 80,
          walkToX: 236,
          visible: () => true,
          onInteract: () => {
            if (state.flags.doorOpen) {
              transitionTo('kitchen', 400, FLOOR_Y, 1);
            } else if (state.selectedItem === 'key') {
              showDialogue(DLG.open_door, () => {
                state.flags.doorOpen = true;
                deselectItem();
                removeItem('key');
                setTimeout(() => transitionTo('kitchen', 400, FLOOR_Y, 1), 600);
              });
            } else if (state.flags.keyPickedUp) {
              showDialogue([
                { who: 'Fetsson', text: "I have the key! Let me select it from my inventory and use it on the door." },
              ]);
            } else {
              const dlg = Object.keys(state.flags).some(k => k === 'farmhouse_shown')
                ? DLG.farmhouse_locked_again
                : DLG.farmhouse_locked_first;
              state.flags.farmhouse_shown = true;
              showDialogue(dlg);
            }
          },
        },
        {
          id: 'well',
          label: 'Well',
          x: 454, y: 270, w: 74, h: 120,
          walkToX: 450,
          visible: () => true,
          onInteract: () => {
            if (state.selectedItem === 'bucket') {
              showDialogue(DLG.fill_bucket, () => {
                removeItem('bucket');
                addItem('waterBucket');
                state.flags.bucketFilled = true;
                deselectItem();
              });
            } else if (state.flags.bucketPickedUp && !state.flags.bucketFilled) {
              showDialogue([{ who: 'Fetsson', text: 'I should select the bucket from my inventory and use it on the well.' }]);
            } else if (state.flags.bucketFilled) {
              showDialogue([{ who: 'Fetsson', text: 'The well is still here, but my bucket is already full.' }]);
            } else {
              showDialogue(DLG.well_no_bucket);
            }
          },
        },
        {
          id: 'bucket_pickup',
          label: 'Bucket',
          x: 474, y: 335, w: 35, h: 35,
          walkToX: 480,
          visible: () => !state.flags.bucketPickedUp,
          onInteract: () => {
            if (!state.flags.bucketPickedUp) {
              showDialogue(DLG.pickup_bucket, () => {
                addItem('bucket');
                state.flags.bucketPickedUp = true;
              });
            }
          },
        },
        {
          id: 'scarecrow',
          label: 'Scarecrow',
          x: 578, y: 224, w: 48, h: 140,
          walkToX: 560,
          visible: () => true,
          onInteract: () => {
            showDialogue(DLG.scarecrow);
          },
        },
        {
          id: 'garden_gate',
          label: state.flags.gateOpen ? 'Garden →' : 'Garden Gate (Rusty)',
          x: 720, y: 238, w: 80, h: 185,
          walkToX: 700,
          visible: () => true,
          onInteract: () => {
            if (state.flags.gateOpen) {
              transitionTo('garden', 80, FLOOR_Y, 1);
            } else if (state.selectedItem === 'waterBucket') {
              showDialogue(DLG.gate_open_water, () => {
                state.flags.gateOpen = true;
                removeItem('waterBucket');
                deselectItem();
              });
            } else if (state.flags.bucketFilled) {
              showDialogue([{ who: 'Fetsson', text: 'I should select the water bucket from my inventory and use it on the gate.' }]);
            } else if (state.flags.bucketPickedUp) {
              showDialogue(DLG.rusty_gate_hint);
            } else {
              showDialogue(DLG.rusty_gate);
            }
          },
        },
      ];

    case 'garden':
      return [
        {
          id: 'garden_exit',
          label: '← Farm Yard',
          x: 0, y: 200, w: 56, h: 220,
          walkToX: 80,
          visible: () => true,
          onInteract: () => {
            transitionTo('farmyard', 680, FLOOR_Y, -1);
          },
        },
        {
          id: 'gnome',
          label: 'Garden Gnome',
          x: 200, y: 295, w: 82, h: 82,
          walkToX: 260,
          visible: () => true,
          onInteract: () => {
            if (!state.flags.keyPickedUp) {
              if (state.selectedItem === 'stick') {
                showDialogue(DLG.gnome_with_stick, () => {
                  addItem('key');
                  state.flags.keyPickedUp = true;
                  deselectItem();
                });
              } else {
                showDialogue(DLG.gnome_no_stick);
              }
            } else {
              showDialogue([{ who: 'Fetsson', text: 'The gnome guards his little corner proudly. The key is already in my pocket.' }]);
            }
          },
        },
        {
          id: 'veggies',
          label: 'Vegetable Patch',
          x: 60, y: 325, w: 420, h: 90,
          walkToX: 250,
          visible: () => true,
          onInteract: () => {
            showDialogue(DLG.veggies);
          },
        },
      ];

    case 'kitchen':
      return [
        {
          id: 'pancakes',
          label: 'Pancakes!',
          x: 320, y: 240, w: 200, h: 60,
          walkToX: 400,
          visible: () => true,
          onInteract: () => {
            showDialogue([{ who: 'Fetsson', text: 'These apple pancakes are the most delicious thing I have ever eaten. Worth every step!' }]);
          },
        },
      ];

    default:
      return [];
  }
}

// ─────────────────────────────────────────────────────────────
// GAME SYSTEMS – DIALOGUE
// ─────────────────────────────────────────────────────────────
function showDialogue(lines, onDone) {
  state.dlg.active = true;
  state.dlg.queue = lines.slice();
  state.dlg.onDone = onDone || null;
  renderDialogueBox();
}

function advanceDialogue() {
  if (!state.dlg.active) return;
  state.dlg.queue.shift();
  if (state.dlg.queue.length === 0) {
    state.dlg.active = false;
    const cb = state.dlg.onDone;
    state.dlg.onDone = null;
    if (cb) cb();
    hideDialogueBox();
  } else {
    renderDialogueBox();
  }
}

function renderDialogueBox() {
  const box = document.getElementById('dialogue-box');
  const speakerEl = document.getElementById('dialogue-speaker');
  const textEl = document.getElementById('dialogue-text');
  const line = state.dlg.queue[0];
  if (!line) return;
  speakerEl.textContent = line.who;
  textEl.textContent = line.text;
  box.classList.remove('hidden');
}

function hideDialogueBox() {
  document.getElementById('dialogue-box').classList.add('hidden');
}

// ─────────────────────────────────────────────────────────────
// GAME SYSTEMS – INVENTORY
// ─────────────────────────────────────────────────────────────
function addItem(id) {
  if (!state.inventory.includes(id)) {
    state.inventory.push(id);
    renderInventory();
  }
}

function removeItem(id) {
  state.inventory = state.inventory.filter(i => i !== id);
  if (state.selectedItem === id) state.selectedItem = null;
  renderInventory();
}

function deselectItem() {
  state.selectedItem = null;
  renderInventory();
}

function renderInventory() {
  const slots = document.getElementById('inventory-slots');
  slots.innerHTML = '';
  state.inventory.forEach(id => {
    const item = ITEMS[id];
    const div = document.createElement('div');
    div.className = 'inv-slot' + (state.selectedItem === id ? ' selected' : '');
    div.title = item.name;
    div.innerHTML = `<span>${item.icon}</span><span class="inv-slot-name">${item.name}</span>`;
    div.addEventListener('click', () => {
      state.selectedItem = state.selectedItem === id ? null : id;
      renderInventory();
    });
    slots.appendChild(div);
  });
}

// ─────────────────────────────────────────────────────────────
// SCENE TRANSITIONS
// ─────────────────────────────────────────────────────────────
function transitionTo(scene, startX, startY, facing) {
  state.scene = scene;
  state.player.x = startX;
  state.player.y = startY;
  state.player.facing = facing;
  state.player.walking = false;
  state.player.targetX = null;
  state.player.pendingAction = null;
  state.hovered = null;
  // Hide stale tooltip immediately on scene change
  const tipEl = document.getElementById('tooltip');
  if (tipEl) tipEl.classList.add('hidden');
  // Position Pindus near player
  state.pindus.x = startX + (facing > 0 ? -70 : 70);
  state.pindus.y = startY;
  state.pindus.facing = facing;

  // Trigger arrival dialogues
  if (scene === 'kitchen' && !state.flags.gameFinished) {
    state.flags.gameFinished = true;
    setTimeout(() => showDialogue(DLG.ending), 600);
  }
}

// ─────────────────────────────────────────────────────────────
// HIT-TEST HELPERS
// ─────────────────────────────────────────────────────────────
function hotspotAt(px, py) {
  const hs = getHotspots();
  for (let i = hs.length - 1; i >= 0; i--) {
    const h = hs[i];
    if (!h.visible()) continue;
    if (px >= h.x && px <= h.x + h.w && py >= h.y && py <= h.y + h.h) {
      return h;
    }
  }
  return null;
}

function isGroundClick(py) {
  return py > 360 && py < H - 68;
}

// ─────────────────────────────────────────────────────────────
// INPUT HANDLING
// ─────────────────────────────────────────────────────────────
function initInput(canvas) {
  canvas.addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect();
    mx = (e.clientX - r.left) * (W / r.width);
    my = (e.clientY - r.top)  * (H / r.height);

    const hs = hotspotAt(mx, my);
    state.hovered = hs ? hs.id : null;

    // Tooltip
    const tip = document.getElementById('tooltip');
    if (hs) {
      tip.textContent = hs.label;
      tip.style.left = Math.min(mx + 12, W - 160) + 'px';
      tip.style.top  = Math.max(my - 28, 4) + 'px';
      tip.classList.remove('hidden');
      canvas.style.cursor = 'pointer';
    } else {
      tip.classList.add('hidden');
      canvas.style.cursor = isGroundClick(my) ? 'crosshair' : 'default';
    }
  });

  canvas.addEventListener('click', e => {
    const r = canvas.getBoundingClientRect();
    const cx2 = (e.clientX - r.left) * (W / r.width);
    const cy2 = (e.clientY - r.top)  * (H / r.height);

    // Title screen
    if (state.scene === 'title') {
      transitionTo('barn', 200, FLOOR_Y, 1);
      setTimeout(() => showDialogue(DLG.intro), 500);
      return;
    }

    // Advance dialogue if active
    if (state.dlg.active) {
      advanceDialogue();
      return;
    }

    // Inventory clicks handled by HTML elements — ignore canvas clicks on inv area
    if (cy2 > H - 68) return;

    const hs = hotspotAt(cx2, cy2);
    if (hs) {
      // Walk to hotspot's walkToX, then interact
      const target = hs.walkToX;
      state.player.facing = target < state.player.x ? -1 : 1;
      state.player.targetX = target;
      state.player.walking = true;
      state.player.pendingAction = hs.onInteract;
    } else if (isGroundClick(cy2)) {
      // Click to walk
      state.player.targetX = cx2;
      state.player.walking = cx2 !== state.player.x;
      state.player.facing = cx2 < state.player.x ? -1 : 1;
      state.player.pendingAction = null;
    }
  });

  // Dialogue box click
  document.getElementById('dialogue-box').addEventListener('click', () => {
    advanceDialogue();
  });
}

// ─────────────────────────────────────────────────────────────
// MAIN LOOP
// ─────────────────────────────────────────────────────────────
function update() {
  state.tick++;

  const p = state.player;
  if (p.walking && p.targetX !== null) {
    const dx = p.targetX - p.x;
    if (Math.abs(dx) <= WALK_SPEED) {
      p.x = p.targetX;
      p.walking = false;
      if (p.pendingAction) {
        const action = p.pendingAction;
        p.pendingAction = null;
        action();
      }
    } else {
      p.x += Math.sign(dx) * WALK_SPEED;
      p.facing = Math.sign(dx);
    }
  }

  // Pindus lazily follows
  const distToPindus = state.player.x - state.pindus.x;
  if (Math.abs(distToPindus) > 70) {
    state.pindus.x += Math.sign(distToPindus) * (WALK_SPEED * 0.7);
    state.pindus.facing = Math.sign(distToPindus);
  }
}

function render(ctx) {
  ctx.clearRect(0, 0, W, H);

  if (state.scene === 'title') {
    drawTitleScreen(ctx);
    return;
  }

  // Draw scene background
  switch (state.scene) {
    case 'barn':      drawBarnScene(ctx);      break;
    case 'farmyard':  drawFarmYardScene(ctx);  break;
    case 'garden':    drawGardenScene(ctx);    break;
    case 'kitchen':   drawKitchenScene(ctx);   break;
  }

  // Walk frame
  const walkFrame = state.player.walking ? Math.floor(state.tick / 8) % 4 : 0;

  // Draw Pindus (behind player if on same side)
  drawPindus(ctx, state.pindus.x, state.pindus.y - 28, state.pindus.facing);

  // Draw Fetsson
  drawFetsson(ctx, state.player.x, state.player.y - 20, state.player.facing, walkFrame);

  // Draw Mrs. Hen in kitchen
  if (state.scene === 'kitchen') {
    drawMrsHen(ctx, 550, 370);
  }

  // Selected item cursor indicator
  if (state.selectedItem && state.hovered) {
    const item = ITEMS[state.selectedItem];
    ctx.font = '20px sans-serif';
    ctx.fillText(item.icon, mx + 8, my - 4);
  }

  // Scene label (subtle)
  const sceneNames = { barn: 'The Barn', farmyard: 'The Farm Yard', garden: 'The Garden', kitchen: "Mrs. Hen's Kitchen" };
  if (sceneNames[state.scene]) {
    ctx.fillStyle = 'rgba(255,230,160,0.55)';
    ctx.font = 'italic 13px Georgia, serif';
    ctx.textAlign = 'right';
    ctx.fillText(sceneNames[state.scene], W - 12, 18);
    ctx.textAlign = 'left';
  }
}

function loop(ctx) {
  update();
  render(ctx);
  requestAnimationFrame(() => loop(ctx));
}

// ─────────────────────────────────────────────────────────────
// INITIALISATION
// ─────────────────────────────────────────────────────────────
window.addEventListener('load', () => {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  initInput(canvas);
  renderInventory();
  loop(ctx);
});
