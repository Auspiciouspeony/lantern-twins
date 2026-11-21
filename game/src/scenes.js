// The three scenes and their differences. Each scene draws the same picture
// twice: the left panel plain, the right panel with every difference applied.
// A difference is data: an id, a spot to click (panel-local x, y, radius) and
// a short label. The draw code checks `diffs.has(id)` at exactly one place,
// so the two panels stay near-identical except for the listed differences.
import { circle, ellipse, fillCircle, fillEllipse, roundRect, skyGradient, cloud, flower, tree, lantern, gull, fish, sparkle } from './art.js';

export const DIFFS = {
  garden: [
    { id: 'butterfly', x: 408, y: 296, r: 30, label: 'butterfly' },
    { id: 'flower', x: 148, y: 330, r: 22, label: 'flower colour' },
    { id: 'tail', x: 315, y: 355, r: 30, label: 'cat tail' },
    { id: 'mushroom', x: 92, y: 302, r: 24, label: 'mushroom' },
    { id: 'smoke', x: 332, y: 140, r: 28, label: 'chimney smoke' },
  ],
  market: [
    { id: 'lantern', x: 280, y: 82, r: 24, label: 'lantern colour' },
    { id: 'banner', x: 127, y: 309, r: 26, label: 'banner stripe' },
    { id: 'jar', x: 433, y: 242, r: 22, label: 'extra jar' },
    { id: 'balloon', x: 498, y: 108, r: 26, label: 'balloon' },
    { id: 'cat', x: 426, y: 172, r: 26, label: 'roof cat' },
    { id: 'sign', x: 118, y: 202, r: 26, label: 'stall sign' },
    { id: 'bulb', x: 350, y: 79, r: 20, label: 'dark bulb' },
  ],
  harbor: [
    { id: 'beam', x: 220, y: 126, r: 30, label: 'lighthouse beam' },
    { id: 'star', x: 332, y: 58, r: 20, label: 'bright star' },
    { id: 'flag', x: 332, y: 278, r: 22, label: 'boat flag' },
    { id: 'fish', x: 302, y: 328, r: 26, label: 'jumping fish' },
    { id: 'buoy', x: 477, y: 326, r: 24, label: 'buoy' },
    { id: 'window', x: 92, y: 266, r: 22, label: 'lit window' },
    { id: 'gull', x: 400, y: 150, r: 22, label: 'gull' },
    { id: 'crate', x: 191, y: 341, r: 24, label: 'missing crate' },
    { id: 'anchor', x: 128, y: 330, r: 24, label: 'anchor' },
  ],
};

export const SCENE_IDS = ['garden', 'market', 'harbor'];

// ---------------------------------------------------------------- garden
function drawGarden(ctx, w, h, diffs, t) {
  skyGradient(ctx, w, h, '#7ec8f2', '#bfe6f7', '#e8f7d8');
  // Sun with a smile.
  fillCircle(ctx, 82, 72, 34, '#ffd94d');
  ctx.strokeStyle = '#f2b705';
  ctx.lineWidth = 4;
  for (let i = 0; i < 8; i += 1) {
    const a = (i / 8) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(82 + Math.cos(a) * 42, 72 + Math.sin(a) * 42);
    ctx.lineTo(82 + Math.cos(a) * 52, 72 + Math.sin(a) * 52);
    ctx.stroke();
  }
  ctx.fillStyle = '#7a5a12';
  fillCircle(ctx, 72, 66, 3, '#7a5a12');
  fillCircle(ctx, 92, 66, 3, '#7a5a12');
  ctx.strokeStyle = '#7a5a12';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(82, 74, 10, 0.15 * Math.PI, 0.85 * Math.PI);
  ctx.stroke();
  cloud(ctx, 300, 66, 1, 'rgba(255,255,255,0.9)');
  cloud(ctx, 470, 44, 0.8, 'rgba(255,255,255,0.85)');
  // Distant hills and grass.
  ctx.fillStyle = '#8fce7e';
  ctx.beginPath();
  ctx.moveTo(0, 250);
  ctx.quadraticCurveTo(140, 200, 300, 248);
  ctx.quadraticCurveTo(430, 285, 560, 240);
  ctx.lineTo(560, 420);
  ctx.lineTo(0, 420);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#6fbf5e';
  ctx.fillRect(0, 300, w, 120);
  // Stone path to the cottage door.
  ctx.fillStyle = '#d9c9a3';
  ctx.beginPath();
  ctx.moveTo(238, 420);
  ctx.lineTo(262, 340);
  ctx.lineTo(298, 340);
  ctx.lineTo(322, 420);
  ctx.closePath();
  ctx.fill();
  // Cottage.
  ctx.fillStyle = '#f7e8c8';
  ctx.fillRect(196, 218, 148, 122);
  ctx.fillStyle = '#c65b4e';
  ctx.beginPath();
  ctx.moveTo(184, 220);
  ctx.lineTo(270, 158);
  ctx.lineTo(356, 220);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#8a6d4b';
  ctx.fillRect(318, 178, 18, 44);
  if (!diffs.has('smoke')) {
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    circle(ctx, 330, 158, 10);
    ctx.fill();
    circle(ctx, 338, 142, 13);
    ctx.fill();
    circle(ctx, 330, 124, 9);
    ctx.fill();
  }
  // Door and windows.
  ctx.fillStyle = '#7a4a2b';
  roundRect(ctx, 256, 282, 28, 58, 4);
  ctx.fill();
  fillCircle(ctx, 278, 312, 3, '#f2c94c');
  ctx.fillStyle = '#9fd8ef';
  ctx.fillRect(210, 238, 26, 26);
  ctx.fillRect(304, 238, 26, 26);
  ctx.strokeStyle = '#7a4a2b';
  ctx.lineWidth = 2;
  ctx.strokeRect(210, 238, 26, 26);
  ctx.strokeRect(304, 238, 26, 26);
  // Fence.
  ctx.fillStyle = '#b08d5f';
  for (let x = 20; x < 180; x += 26) ctx.fillRect(x, 316, 8, 34);
  ctx.fillRect(16, 322, 168, 5);
  ctx.fillRect(16, 338, 168, 5);
  // Tree with apples.
  tree(ctx, 470, 330, 1.15, '#4da34d', '#7a4a2b', '#e5534b');
  // Pond with a fish.
  ctx.fillStyle = '#5fb7e8';
  ellipse(ctx, 452, 388, 62, 18);
  ctx.fill();
  ctx.fillStyle = '#ff9f43';
  ellipse(ctx, 446, 388, 10, 4);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(436, 388);
  ctx.lineTo(430, 383);
  ctx.lineTo(430, 393);
  ctx.closePath();
  ctx.fill();
  // Flower beds.
  flower(ctx, 60, 372, 1, '#e5534b', '#f2c94c');
  flower(ctx, 96, 382, 1, '#ff9f43', '#7a4a2b');
  flower(ctx, 148, 330, 1, diffs.has('flower') ? '#4f7de0' : '#e5534b', '#f2c94c');
  flower(ctx, 180, 378, 1, '#e5534b', '#f2c94c');
  flower(ctx, 396, 384, 1, '#c65bd6', '#f2c94c');
  // Mushroom by the fence (difference: only in the right panel).
  if (diffs.has('mushroom')) {
    ctx.fillStyle = '#f7f3e8';
    ctx.fillRect(86, 296, 8, 12);
    ctx.fillStyle = '#e5534b';
    ctx.beginPath();
    ctx.arc(90, 296, 12, Math.PI, 0);
    ctx.fill();
    fillCircle(ctx, 86, 290, 2, '#fff');
    fillCircle(ctx, 94, 293, 2, '#fff');
  }
  // Butterfly (difference: only in the right panel).
  if (diffs.has('butterfly')) {
    const flap = Math.sin(t * 6) * 0.35;
    ctx.save();
    ctx.translate(408, 296);
    ctx.fillStyle = '#c65bd6';
    ctx.beginPath();
    ctx.ellipse(-7, -4, 9, 6, -0.5 - flap, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(7, -4, 9, 6, 0.5 + flap, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#3a2a1a';
    ctx.fillRect(-1.5, -6, 3, 12);
    ctx.restore();
  }
  // Cat sitting by the cottage: tail up, or curled around its paws.
  ctx.fillStyle = '#f2a541';
  ellipse(ctx, 322, 352, 20, 15);
  ctx.fill();
  fillCircle(ctx, 330, 330, 12, '#f2a541');
  ctx.beginPath();
  ctx.moveTo(320, 322);
  ctx.lineTo(317, 310);
  ctx.lineTo(324, 320);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(336, 320);
  ctx.lineTo(340, 309);
  ctx.lineTo(342, 321);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#f2a541';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  if (diffs.has('tail')) {
    ctx.moveTo(304, 356);
    ctx.quadraticCurveTo(288, 360, 292, 344);
  } else {
    ctx.moveTo(304, 356);
    ctx.quadraticCurveTo(318, 368, 340, 362);
  }
  ctx.stroke();
  // Fireflies drifting over the grass.
  for (let i = 0; i < 5; i += 1) {
    const fx = 120 + i * 90 + Math.sin(t * 0.7 + i * 2) * 12;
    const fy = 300 + ((i * 37) % 60) + Math.cos(t * 0.9 + i) * 6;
    sparkle(ctx, fx, fy, 4, '#ffe98a', 0.5 + 0.4 * Math.sin(t * 2 + i * 1.7));
  }
}

// ---------------------------------------------------------------- market
function drawMarket(ctx, w, h, diffs, t) {
  skyGradient(ctx, w, h, '#2b1d4e', '#7a3b6e', '#e8825a');
  // Low sun and early stars.
  fillCircle(ctx, 492, 330, 26, '#ffb347');
  sparkle(ctx, 60, 40, 5, '#fff', 0.9);
  sparkle(ctx, 150, 26, 4, '#fff', 0.7);
  sparkle(ctx, 250, 48, 4, '#fff', 0.8);
  sparkle(ctx, 420, 30, 5, '#fff', 0.9);
  // Rooftops behind the stalls, with lit windows so they read as houses.
  ctx.fillStyle = '#241640';
  ctx.beginPath();
  ctx.moveTo(0, 210);
  ctx.lineTo(90, 150);
  ctx.lineTo(180, 210);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(380, 210);
  ctx.lineTo(470, 140);
  ctx.lineTo(560, 210);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#ffd94d';
  ctx.fillRect(82, 180, 14, 16);
  ctx.fillRect(462, 168, 14, 16);
  // Cobbles.
  ctx.fillStyle = '#4a3a63';
  ctx.fillRect(0, 330, w, 90);
  ctx.strokeStyle = 'rgba(0,0,0,0.25)';
  ctx.lineWidth = 2;
  for (let y = 350; y < 420; y += 22) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
  // Stall awnings.
  function awning(x, y, aw, c1, c2) {
    for (let i = 0; i < 6; i += 1) {
      ctx.fillStyle = i % 2 ? c1 : c2;
      ctx.fillRect(x + (i * aw) / 6, y, aw / 6, 26);
    }
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.fillRect(x, y + 22, aw, 4);
  }
  // Left stall.
  ctx.fillStyle = '#8a5a2b';
  ctx.fillRect(52, 210, 150, 120);
  ctx.fillStyle = '#f7e8c8';
  ctx.fillRect(60, 218, 134, 104);
  awning(48, 196, 158, '#e5534b', '#f7f3e8');
  // Stall sign: round in one panel, square in the other.
  ctx.fillStyle = '#2b1d4e';
  if (diffs.has('sign')) ctx.fillRect(100, 184, 36, 36);
  else {
    circle(ctx, 118, 202, 18);
    ctx.fill();
  }
  ctx.fillStyle = '#f2c94c';
  ctx.font = 'bold 15px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('TEA', 118, 207);
  // Jars on the left stall.
  const jarColors = ['#7ee0a3', '#e5534b', '#4f7de0'];
  jarColors.forEach((c, i) => {
    ctx.fillStyle = c;
    roundRect(ctx, 72 + i * 38, 262, 26, 34, 6);
    ctx.fill();
    ctx.fillStyle = '#3a2a1a';
    ctx.fillRect(78 + i * 38, 256, 14, 6);
  });
  // Banner under the left stall (stripe difference).
  ctx.fillStyle = '#f2c94c';
  ctx.fillRect(60, 300, 134, 18);
  if (!diffs.has('banner')) {
    ctx.fillStyle = '#e5534b';
    ctx.fillRect(60, 306, 134, 6);
  }
  // Right stall.
  ctx.fillStyle = '#8a5a2b';
  ctx.fillRect(360, 210, 150, 120);
  ctx.fillStyle = '#f7e8c8';
  ctx.fillRect(368, 218, 134, 104);
  awning(356, 196, 158, '#4f7de0', '#f7f3e8');
  // Crates with fruit.
  ctx.fillStyle = '#a8763e';
  ctx.fillRect(372, 262, 56, 40);
  ctx.fillRect(436, 262, 56, 40);
  ctx.strokeStyle = '#7a4a2b';
  ctx.lineWidth = 2;
  ctx.strokeRect(372, 262, 56, 40);
  ctx.strokeRect(436, 262, 56, 40);
  fillCircle(ctx, 386, 258, 7, '#e5534b');
  fillCircle(ctx, 402, 256, 7, '#ff9f43');
  fillCircle(ctx, 418, 258, 7, '#e5534b');
  fillCircle(ctx, 450, 258, 7, '#7ee0a3');
  fillCircle(ctx, 466, 256, 7, '#e5534b');
  fillCircle(ctx, 480, 258, 7, '#ff9f43');
  // Extra jar on the crates (difference: only in the right panel).
  if (diffs.has('jar')) {
    ctx.fillStyle = '#c65bd6';
    roundRect(ctx, 420, 226, 26, 32, 6);
    ctx.fill();
    ctx.fillStyle = '#3a2a1a';
    ctx.fillRect(426, 220, 14, 6);
  }
  // Cat on the right stall roof (difference: only in the right panel).
  if (diffs.has('cat')) {
    ctx.fillStyle = '#2b2b33';
    ellipse(ctx, 424, 178, 18, 10);
    ctx.fill();
    fillCircle(ctx, 438, 166, 9, '#2b2b33');
    ctx.beginPath();
    ctx.moveTo(432, 160);
    ctx.lineTo(430, 150);
    ctx.lineTo(436, 159);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#2b2b33';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(408, 182);
    ctx.quadraticCurveTo(398, 176, 402, 166);
    ctx.stroke();
  }
  // String of lanterns across the top.
  ctx.strokeStyle = '#3a2a1a';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 40);
  ctx.quadraticCurveTo(280, 86, 560, 40);
  ctx.stroke();
  const lanternXs = [70, 140, 210, 280, 350, 420, 490];
  const lanternCols = ['#e5534b', '#f2c94c', '#e5534b', '#e5534b', '#f2c94c', '#e5534b', '#f2c94c'];
  lanternXs.forEach((x, i) => {
    const y = 40 + Math.sin((x / 560) * Math.PI) * 34;
    const col = i === 3 && diffs.has('lantern') ? '#f2c94c' : lanternCols[i];
    const sway = Math.sin(t * 1.2 + i) * 2;
    lantern(ctx, x + sway, y + 8, 0.9, col, true);
    // One bulb dark in the right panel.
    if (i === 4 && diffs.has('bulb')) {
      ctx.fillStyle = '#241640';
      ellipse(ctx, x + sway, y + 8, 15, 18);
      ctx.fill();
    }
  });
  // Balloon (difference: only in the right panel).
  if (diffs.has('balloon')) {
    ctx.strokeStyle = 'rgba(247,243,232,0.8)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(498, 128);
    ctx.quadraticCurveTo(506, 170, 496, 200);
    ctx.stroke();
    ctx.fillStyle = '#4f7de0';
    ellipse(ctx, 498, 108, 16, 20);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ellipse(ctx, 492, 100, 5, 8);
    ctx.fill();
  }
  // A fruit basket and a crate stack fill the cobbles between the stalls.
  ctx.fillStyle = '#8a5a2b';
  ctx.beginPath();
  ctx.moveTo(232, 368);
  ctx.lineTo(282, 368);
  ctx.lineTo(276, 392);
  ctx.lineTo(238, 392);
  ctx.closePath();
  ctx.fill();
  fillCircle(ctx, 244, 364, 7, '#e5534b');
  fillCircle(ctx, 258, 362, 7, '#ff9f43');
  fillCircle(ctx, 272, 364, 7, '#7ee0a3');
  ctx.fillStyle = '#a8763e';
  ctx.fillRect(516, 352, 30, 26);
  ctx.fillRect(522, 326, 30, 26);
  ctx.strokeStyle = '#7a4a2b';
  ctx.lineWidth = 2;
  ctx.strokeRect(516, 352, 30, 26);
  ctx.strokeRect(522, 326, 30, 26);
  // Paper scraps, a coin and fallen leaves on the cobbles.
  ctx.fillStyle = '#f7f3e8';
  ctx.fillRect(310, 366, 14, 8);
  ctx.fillRect(300, 392, 12, 8);
  fillCircle(ctx, 268, 402, 6, '#f2c94c');
  ctx.fillStyle = '#c65bd6';
  ellipse(ctx, 340, 386, 7, 3);
  ctx.fill();
  ctx.fillStyle = '#7ee0a3';
  ellipse(ctx, 200, 398, 7, 3);
  ctx.fill();
  ctx.fillStyle = '#ff9f43';
  ellipse(ctx, 470, 396, 7, 3);
  ctx.fill();
}

// ---------------------------------------------------------------- harbor
function drawHarbor(ctx, w, h, diffs, t) {
  skyGradient(ctx, w, h, '#0d1230', '#1d2a5e', '#3a4a7a');
  // Stars, one bright (difference).
  const stars = [[40, 50], [120, 30], [200, 70], [260, 34], [420, 44], [480, 80], [520, 30], [90, 110], [300, 120]];
  stars.forEach(([x, y], i) => sparkle(ctx, x, y, 3 + (i % 2), '#fff', 0.5 + 0.4 * Math.sin(t + i)));
  if (!diffs.has('star')) sparkle(ctx, 332, 58, 7, '#ffe98a', 1);
  // Moon with craters.
  fillCircle(ctx, 470, 74, 32, '#f5efe0');
  fillCircle(ctx, 458, 66, 6, '#d9cfae');
  fillCircle(ctx, 482, 84, 8, '#d9cfae');
  fillCircle(ctx, 472, 58, 4, '#d9cfae');
  // Gull (difference: only in the right panel).
  if (diffs.has('gull')) gull(ctx, 400, 150, 1, '#dfe6ff');
  gull(ctx, 180, 60, 0.9, '#b9c4e8');
  // Lighthouse.
  ctx.fillStyle = '#f7f3e8';
  ctx.beginPath();
  ctx.moveTo(96, 260);
  ctx.lineTo(112, 130);
  ctx.lineTo(140, 130);
  ctx.lineTo(156, 260);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#e5534b';
  ctx.fillRect(104, 218, 44, 18);
  ctx.fillRect(110, 168, 32, 18);
  ctx.fillStyle = '#2b1d4e';
  ctx.fillRect(108, 118, 36, 16);
  ctx.fillStyle = '#ffd94d';
  ctx.fillRect(114, 122, 24, 8);
  // Beam (difference: on in the left panel, off in the right).
  if (!diffs.has('beam')) {
    ctx.save();
    ctx.globalAlpha = 0.22;
    ctx.fillStyle = '#ffe98a';
    ctx.beginPath();
    ctx.moveTo(144, 126);
    ctx.lineTo(300, 84);
    ctx.lineTo(300, 168);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
  // Harbor house with a window (lit in one panel, dark in the other).
  ctx.fillStyle = '#3a2f5b';
  ctx.fillRect(52, 240, 76, 60);
  ctx.fillStyle = '#241640';
  ctx.beginPath();
  ctx.moveTo(44, 242);
  ctx.lineTo(90, 208);
  ctx.lineTo(136, 242);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = diffs.has('window') ? '#2b1d4e' : '#ffd94d';
  ctx.fillRect(82, 256, 20, 20);
  ctx.strokeStyle = '#241640';
  ctx.lineWidth = 2;
  ctx.strokeRect(82, 256, 20, 20);
  // Sea.
  ctx.fillStyle = '#16324f';
  ctx.fillRect(0, 300, w, 120);
  ctx.strokeStyle = 'rgba(126, 224, 163, 0.35)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 4; i += 1) {
    const y = 322 + i * 24;
    ctx.beginPath();
    for (let x = 0; x <= w; x += 20) ctx.lineTo(x, y + Math.sin(x * 0.05 + t * 1.4 + i * 2) * 3);
    ctx.stroke();
  }
  // Moon reflection.
  ctx.save();
  ctx.globalAlpha = 0.3;
  ctx.fillStyle = '#f5efe0';
  for (let i = 0; i < 5; i += 1) ctx.fillRect(448 + ((i % 2) * 14), 306 + i * 20, 26 - i * 3, 4);
  ctx.restore();
  // Boats.
  function boat(x, y, s, hull, sail, flagColor) {
    ctx.fillStyle = hull;
    ctx.beginPath();
    ctx.moveTo(x - 34 * s, y);
    ctx.lineTo(x + 34 * s, y);
    ctx.lineTo(x + 24 * s, y + 14 * s);
    ctx.lineTo(x - 24 * s, y + 14 * s);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#5a3a1a';
    ctx.fillRect(x - 2 * s, y - 44 * s, 4 * s, 44 * s);
    ctx.fillStyle = sail;
    ctx.beginPath();
    ctx.moveTo(x + 2 * s, y - 42 * s);
    ctx.lineTo(x + 2 * s, y - 6 * s);
    ctx.lineTo(x + 30 * s, y - 6 * s);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = flagColor;
    ctx.beginPath();
    ctx.moveTo(x - 2 * s, y - 44 * s);
    ctx.lineTo(x - 16 * s, y - 38 * s);
    ctx.lineTo(x - 2 * s, y - 32 * s);
    ctx.closePath();
    ctx.fill();
  }
  boat(340, 316, 1, '#8a5a2b', '#f7f3e8', diffs.has('flag') ? '#f2c94c' : '#e5534b');
  boat(220, 344, 0.7, '#6b4a2f', '#dfe6ff', '#7ee0a3');
  // Jumping fish (difference: only in the right panel).
  if (diffs.has('fish')) {
    fish(ctx, 302, 328, 1, '#ff9f43');
    ctx.strokeStyle = 'rgba(255,255,255,0.6)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(302, 344, 12, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();
  }
  // Buoy (difference: only in the right panel).
  if (diffs.has('buoy')) {
    ctx.fillStyle = '#e5534b';
    ctx.beginPath();
    ctx.moveTo(472, 318);
    ctx.lineTo(482, 318);
    ctx.lineTo(486, 334);
    ctx.lineTo(468, 334);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#f7f3e8';
    ctx.fillRect(468, 324, 18, 5);
    ctx.fillStyle = '#e5534b';
    fillCircle(ctx, 477, 312, 4, '#e5534b');
  }
  // Dock with crates, one crate missing in the right panel.
  ctx.fillStyle = '#6b4a2f';
  ctx.fillRect(120, 356, 180, 14);
  ctx.fillStyle = '#8a5a2b';
  for (let x = 126; x < 296; x += 18) ctx.fillRect(x, 356, 6, 14);
  ctx.fillStyle = '#a8763e';
  ctx.fillRect(140, 326, 30, 30);
  ctx.strokeStyle = '#7a4a2b';
  ctx.lineWidth = 2;
  ctx.strokeRect(140, 326, 30, 30);
  if (!diffs.has('crate')) {
    ctx.fillStyle = '#a8763e';
    ctx.fillRect(176, 326, 30, 30);
    ctx.strokeRect(176, 326, 30, 30);
  }
  // Anchor leaning on the dock (difference: only in the right panel).
  if (diffs.has('anchor')) {
    ctx.strokeStyle = '#3a3a44';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(128, 340, 10, 0.3, Math.PI - 0.3);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(128, 330);
    ctx.lineTo(128, 312);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(118, 316);
    ctx.lineTo(138, 316);
    ctx.stroke();
    fillCircle(ctx, 128, 310, 3, '#3a3a44');
  }
}

const DRAW = { garden: drawGarden, market: drawMarket, harbor: drawHarbor };

/** Draw one scene into the panel at (x, y) sized w x h, with `diffs` applied. */
export function drawScene(ctx, sceneId, diffs, t, x, y, w, h) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  ctx.translate(x, y);
  DRAW[sceneId](ctx, w, h, diffs, t);
  ctx.restore();
}
