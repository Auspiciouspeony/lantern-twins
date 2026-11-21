// Small shared canvas helpers every scene uses: shapes, gradients and the
// little props (flowers, stars, clouds, lanterns) that fill a scene.
export function circle(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
}

export function ellipse(ctx, x, y, rx, ry) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
}

export function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export function fillCircle(ctx, x, y, r, color) {
  ctx.fillStyle = color;
  circle(ctx, x, y, r);
  ctx.fill();
}

export function fillEllipse(ctx, x, y, rx, ry, color) {
  ctx.fillStyle = color;
  ellipse(ctx, x, y, rx, ry);
  ctx.fill();
}

export function skyGradient(ctx, w, h, top, mid, bottom) {
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, top);
  g.addColorStop(0.55, mid);
  g.addColorStop(1, bottom);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
}

/** A soft four-point star (a sparkle), used for stars, fireflies and glints. */
export function sparkle(ctx, x, y, r, color, alpha = 1) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y - r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.quadraticCurveTo(x, y, x, y + r);
  ctx.quadraticCurveTo(x, y, x - r, y);
  ctx.quadraticCurveTo(x, y, x, y - r);
  ctx.fill();
  ctx.restore();
}

/** A puffy cloud from three circles. */
export function cloud(ctx, x, y, s, color) {
  ctx.fillStyle = color;
  circle(ctx, x, y, 16 * s);
  ctx.fill();
  circle(ctx, x + 18 * s, y + 4 * s, 13 * s);
  ctx.fill();
  circle(ctx, x - 18 * s, y + 5 * s, 12 * s);
  ctx.fill();
  ctx.fillRect(x - 26 * s, y, 52 * s, 12 * s);
}

/** A simple five-petal flower on a stem. */
export function flower(ctx, x, y, s, petal, centre) {
  ctx.strokeStyle = '#2f7d4f';
  ctx.lineWidth = 2 * s;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y + 16 * s);
  ctx.stroke();
  for (let i = 0; i < 5; i += 1) {
    const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
    fillCircle(ctx, x + Math.cos(a) * 6 * s, y + Math.sin(a) * 6 * s, 5 * s, petal);
  }
  fillCircle(ctx, x, y, 4 * s, centre);
}

/** A round-crowned tree with a trunk and fruit dots. */
export function tree(ctx, x, y, s, leaf, trunk, fruit) {
  ctx.fillStyle = trunk;
  ctx.fillRect(x - 5 * s, y - 34 * s, 10 * s, 34 * s);
  fillCircle(ctx, x, y - 52 * s, 30 * s, leaf);
  fillCircle(ctx, x - 22 * s, y - 38 * s, 20 * s, leaf);
  fillCircle(ctx, x + 22 * s, y - 38 * s, 20 * s, leaf);
  if (fruit) {
    fillCircle(ctx, x - 14 * s, y - 46 * s, 4 * s, fruit);
    fillCircle(ctx, x + 10 * s, y - 60 * s, 4 * s, fruit);
    fillCircle(ctx, x + 20 * s, y - 36 * s, 4 * s, fruit);
    fillCircle(ctx, x - 2 * s, y - 34 * s, 4 * s, fruit);
  }
}

/** A paper lantern: glowing body, dark caps, tassel. */
export function lantern(ctx, x, y, s, body, glow) {
  if (glow) {
    ctx.save();
    ctx.globalAlpha = 0.25;
    fillCircle(ctx, x, y, 26 * s, body);
    ctx.restore();
  }
  ctx.fillStyle = '#3a2a1a';
  ctx.fillRect(x - 8 * s, y - 20 * s, 16 * s, 5 * s);
  ctx.fillRect(x - 8 * s, y + 15 * s, 16 * s, 5 * s);
  ctx.fillStyle = body;
  ellipse(ctx, x, y, 15 * s, 18 * s);
  ctx.fill();
  ctx.strokeStyle = 'rgba(58, 42, 26, 0.55)';
  ctx.lineWidth = 1.5 * s;
  for (let i = -1; i <= 1; i += 1) {
    ctx.beginPath();
    ctx.ellipse(x, y, 15 * s, 18 * s, 0, -1.1 + i * 0.35, -0.6 + i * 0.35);
    ctx.stroke();
  }
  ctx.strokeStyle = '#f2c94c';
  ctx.lineWidth = 2 * s;
  ctx.beginPath();
  ctx.moveTo(x, y + 20 * s);
  ctx.lineTo(x, y + 30 * s);
  ctx.stroke();
}

/** A simple gull: two curved wing strokes. */
export function gull(ctx, x, y, s, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2 * s;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - 10 * s, y);
  ctx.quadraticCurveTo(x - 4 * s, y - 6 * s, x, y);
  ctx.quadraticCurveTo(x + 4 * s, y - 6 * s, x + 10 * s, y);
  ctx.stroke();
}

/** A little fish jumping out of the water, arced body + tail. */
export function fish(ctx, x, y, s, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(-0.5);
  ctx.fillStyle = color;
  ellipse(ctx, 0, 0, 14 * s, 6 * s);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-13 * s, 0);
  ctx.lineTo(-21 * s, -7 * s);
  ctx.lineTo(-21 * s, 7 * s);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#14101f';
  fillCircle(ctx, 7 * s, -1 * s, 1.6 * s, '#14101f');
  ctx.restore();
}
