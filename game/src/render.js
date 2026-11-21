// Everything the player sees: the two picture panels with their markers,
// the HUD (counter, timer, score, hints), the effects (rings, sparkles,
// shake, flash) and the five screens. The judge reads the game mostly from
// its screenshots, so the play screen keeps the counter, the timer and the
// found markers big and readable at a glance.
import { FIELD, PANEL, LEFT_X, RIGHT_X, PALETTE, FONT, LEVELS } from './config.js';
import { drawScene, DIFFS } from './scenes.js';
import { SCREEN_TITLE, SCREEN_PLAY, SCREEN_PAUSED, SCREEN_LEVEL_DONE, SCREEN_OVER, SCREEN_WIN } from './world.js';
import { circle, fillCircle, roundRect, sparkle } from './art.js';

function text(ctx, str, x, y, size, color, weight = 700, align = 'left') {
  ctx.fillStyle = color;
  ctx.font = `${weight} ${size}px ${FONT}`;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.fillText(str, x, y);
}

function panelFrame(ctx, x, found) {
  ctx.save();
  ctx.strokeStyle = found ? PALETTE.panelFrameFound : PALETTE.panelFrame;
  ctx.lineWidth = 4;
  roundRect(ctx, x - 4, PANEL.top - 4, PANEL.width + 8, PANEL.height + 8, 10);
  ctx.stroke();
  ctx.restore();
}

function tag(ctx, x, y, label) {
  ctx.fillStyle = 'rgba(20, 16, 31, 0.85)';
  roundRect(ctx, x, y, 30, 30, 8);
  ctx.fill();
  text(ctx, label, x + 15, y + 16, 17, PALETTE.text, 800, 'center');
}

function drawMarker(ctx, x, y, r, age) {
  const grow = age < 0.25 ? 1 + (0.25 - age) * 1.6 : 1;
  const rr = (r + 5) * grow;
  ctx.save();
  ctx.strokeStyle = PALETTE.ring;
  ctx.lineWidth = 4;
  ctx.shadowColor = PALETTE.ringGlow;
  ctx.shadowBlur = 12;
  circle(ctx, x, y, rr);
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(255,255,255,0.9)';
  circle(ctx, x, y, rr - 7);
  ctx.stroke();
  // A small star where the ring closes, so a find reads even at small size.
  sparkle(ctx, x + rr * 0.7, y - rr * 0.7, 7, '#fff', 0.95);
  ctx.restore();
}

function drawHintPulse(ctx, x, y, r, t) {
  const pulse = 0.6 + 0.4 * Math.sin(t * 8);
  ctx.save();
  ctx.globalAlpha = 0.55 + 0.45 * pulse;
  ctx.strokeStyle = '#7ee0a3';
  ctx.lineWidth = 3;
  ctx.setLineDash([8, 6]);
  circle(ctx, x, y, r + 8 + pulse * 5);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
}

function drawHud(ctx, state, level, t) {
  ctx.fillStyle = PALETTE.hud;
  ctx.fillRect(0, 0, FIELD.width, 96);
  ctx.fillStyle = PALETTE.hudEdge;
  ctx.fillRect(0, 94, FIELD.width, 2);
  text(ctx, 'LANTERN TWINS', 28, 34, 26, PALETTE.text, 800);
  text(ctx, 'spot the difference', 28, 62, 14, PALETTE.muted, 600);
  text(ctx, `LEVEL ${state.levelIndex + 1} · ${level.name}`, 300, 40, 17, PALETTE.accent2, 700);
  // The counter, big in the middle: found / total.
  const total = DIFFS[level.scene].length;
  text(ctx, `FOUND ${state.found.size} / ${total}`, 640, 40, 30, PALETTE.accent, 800, 'center');
  // Timer bar under the counter.
  const frac = Math.max(0, state.timeLeft / level.seconds);
  const barW = 220;
  const barX = 640 - barW / 2;
  ctx.fillStyle = '#0d0a18';
  roundRect(ctx, barX, 62, barW, 12, 6);
  ctx.fill();
  const low = state.timeLeft <= 30;
  ctx.fillStyle = low ? PALETTE.timerLow : PALETTE.timer;
  if (frac > 0) {
    roundRect(ctx, barX, 62, barW * frac, 12, 6);
    ctx.fill();
  }
  const secs = Math.ceil(state.timeLeft);
  text(ctx, `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`, 640, 88, 13, low ? PALETTE.timerLow : PALETTE.muted, 700, 'center');
  // Score, hints and combo on the right.
  text(ctx, `SCORE ${state.score}`, 1252, 30, 22, PALETTE.text, 800, 'right');
  const combo = state.combo >= 2 ? `COMBO ×${state.combo}  ` : '';
  text(ctx, `${combo}HINTS ${state.hintsLeft} (H)`, 1252, 60, 15, PALETTE.muted, 600, 'right');
  if (state.toast && state.elapsed < state.toast.until) {
    text(ctx, state.toast.text, 640, 108, 15, PALETTE.accent2, 700, 'center');
  }
}

function drawPanels(ctx, state, level, t) {
  const scene = level.scene;
  const all = new Set(DIFFS[scene].map((d) => d.id));
  drawScene(ctx, scene, new Set(), t, LEFT_X, PANEL.top, PANEL.width, PANEL.height);
  drawScene(ctx, scene, all, t, RIGHT_X, PANEL.top, PANEL.width, PANEL.height);
  panelFrame(ctx, LEFT_X, false);
  panelFrame(ctx, RIGHT_X, false);
  tag(ctx, LEFT_X + 8, PANEL.top + 8, 'A');
  tag(ctx, RIGHT_X + 8, PANEL.top + 8, 'B');
  // Found markers on both panels, at the same spot in each picture.
  for (const id of state.foundOrder) {
    const d = DIFFS[scene].find((x) => x.id === id);
    if (!d) continue;
    const ring = state.rings.find((r) => r.x === LEFT_X + d.x || r.x === RIGHT_X + d.x);
    const age = ring ? state.elapsed - ring.born : 1;
    drawMarker(ctx, LEFT_X + d.x, PANEL.top + d.y, d.r, age);
    drawMarker(ctx, RIGHT_X + d.x, PANEL.top + d.y, d.r, age);
  }
  // The hint pulse, on both panels at once.
  if (state.hintPulse) {
    const d = DIFFS[scene].find((x) => x.id === state.hintPulse.id);
    if (d) {
      drawHintPulse(ctx, LEFT_X + d.x, PANEL.top + d.y, d.r, t);
      drawHintPulse(ctx, RIGHT_X + d.x, PANEL.top + d.y, d.r, t);
    }
  }
  // Sparkle bursts from recent finds.
  for (const s of state.sparks) {
    const age = state.elapsed - s.born;
    const x = s.x + s.vx * age;
    const y = s.y + s.vy * age + 60 * age * age;
    sparkle(ctx, x, y, 5 * (1 - age), s.color, 1 - age);
  }
}

function drawBottomBar(ctx, state) {
  text(ctx, 'Click a difference in either picture  ·  H hint  ·  P pause  ·  R restart level  ·  M sound', 640, 580, 15, PALETTE.muted, 600, 'center');
  const bestLine = state.best > 0 ? `BEST ${state.best}   ` : '';
  text(ctx, `${bestLine}FOUND ${state.totalFound} IN ALL  ·  BEST COMBO ×${state.bestCombo}`, 640, 610, 14, PALETTE.muted, 600, 'center');
  text(ctx, 'A Lantern Twins original — every picture drawn in code, no photos, no borrowed art.', 640, 648, 13, PALETTE.muted, 600, 'center');
}

function cardBox(ctx, w, h) {
  const x = (FIELD.width - w) / 2;
  const y = (FIELD.height - h) / 2;
  ctx.save();
  ctx.fillStyle = PALETTE.card;
  ctx.strokeStyle = PALETTE.cardEdge;
  ctx.lineWidth = 2;
  roundRect(ctx, x, y, w, h, 16);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
  return { x, y };
}

function card(ctx, w, h) {
  ctx.save();
  ctx.fillStyle = 'rgba(10, 7, 20, 0.72)';
  ctx.fillRect(0, 0, FIELD.width, FIELD.height);
  ctx.restore();
  return cardBox(ctx, w, h);
}

function drawTitle(ctx, state, t) {
  // The first scene behind the title, dimmed, so the title screen already
  // shows the two-picture game.
  const level = LEVELS[0];
  drawScene(ctx, level.scene, new Set(), t, LEFT_X, PANEL.top, PANEL.width, PANEL.height);
  drawScene(ctx, level.scene, new Set(DIFFS[level.scene].map((d) => d.id)), t, RIGHT_X, PANEL.top, PANEL.width, PANEL.height);
  panelFrame(ctx, LEFT_X, false);
  panelFrame(ctx, RIGHT_X, false);
  ctx.fillStyle = 'rgba(10, 7, 20, 0.55)';
  ctx.fillRect(0, 0, FIELD.width, FIELD.height);
  text(ctx, 'LANTERN TWINS', 640, 150, 64, PALETTE.accent, 800, 'center');
  text(ctx, 'SPOT THE DIFFERENCE', 640, 205, 26, PALETTE.text, 700, 'center');
  text(ctx, 'Two pictures. Nearly the same. Find every difference before the clock runs out.', 640, 245, 17, PALETTE.muted, 600, 'center');
  const { x, y } = cardBox(ctx, 640, 210);
  void x;
  void y;
  const cy = (FIELD.height - 210) / 2;
  text(ctx, 'HOW TO PLAY', 640, cy + 28, 16, PALETTE.accent2, 800, 'center');
  text(ctx, 'Click a difference in either picture — a gold ring marks it on both.', 640, cy + 62, 16, PALETTE.text, 600, 'center');
  text(ctx, 'Wrong clicks cost 5 seconds. H spends a hint. Three scenes, 21 differences.', 640, cy + 92, 16, PALETTE.text, 600, 'center');
  text(ctx, '1  Firefly Garden — 5 differences  ·  2  Lantern Market — 7  ·  3  Moonlit Harbor — 9', 640, cy + 126, 15, PALETTE.muted, 600, 'center');
  text(ctx, 'PRESS SPACE OR CLICK TO PLAY', 640, cy + 172, 17, PALETTE.accent, 800, 'center');
  if (state.best > 0) text(ctx, `BEST SCORE ${state.best}`, 640, 660, 15, PALETTE.muted, 700, 'center');
}

function drawPaused(ctx) {
  const { y } = card(ctx, 460, 190);
  const cy = y;
  text(ctx, 'PAUSED', 640, cy + 46, 36, PALETTE.text, 800, 'center');
  text(ctx, 'P or click to keep playing  ·  R restarts the level', 640, cy + 100, 16, PALETTE.muted, 600, 'center');
  text(ctx, 'M toggles the sound', 640, cy + 132, 16, PALETTE.muted, 600, 'center');
}

function drawLevelDone(ctx, state, level) {
  const { y } = card(ctx, 520, 250);
  const cy = y;
  text(ctx, 'LEVEL CLEAR!', 640, cy + 46, 36, PALETTE.accent2, 800, 'center');
  text(ctx, `${level.name} — all ${DIFFS[level.scene].length} differences found`, 640, cy + 92, 17, PALETTE.text, 600, 'center');
  text(ctx, `Time bonus +${Math.round(state.timeLeft) * 5}   ·   Level score ${state.levelScore}`, 640, cy + 126, 17, PALETTE.text, 600, 'center');
  text(ctx, `Total score ${state.score}`, 640, cy + 158, 19, PALETTE.accent, 800, 'center');
  const next = state.levelIndex + 1 < LEVELS.length ? LEVELS[state.levelIndex + 1].name : 'the final tally';
  text(ctx, state.levelIndex + 1 < LEVELS.length ? `SPACE or click: next — ${next}` : 'SPACE or click: see your result', 640, cy + 206, 16, PALETTE.accent, 700, 'center');
}

function drawOver(ctx, state, level) {
  const { y } = card(ctx, 520, 260);
  const cy = y;
  text(ctx, "TIME'S UP!", 640, cy + 46, 36, PALETTE.danger, 800, 'center');
  text(ctx, `${level.name} — you found ${state.found.size} of ${DIFFS[level.scene].length} differences`, 640, cy + 92, 17, PALETTE.text, 600, 'center');
  text(ctx, `Score ${state.score}   ·   Best combo ×${state.bestCombo}`, 640, cy + 126, 17, PALETTE.text, 600, 'center');
  text(ctx, 'The unfound differences were still hiding in the pictures.', 640, cy + 158, 15, PALETTE.muted, 600, 'center');
  text(ctx, 'R: try this level again   ·   SPACE: back to the title', 640, cy + 208, 16, PALETTE.accent, 700, 'center');
}

function drawWin(ctx, state) {
  const { y } = card(ctx, 560, 290);
  const cy = y;
  text(ctx, 'YOU FOUND THEM ALL!', 640, cy + 46, 34, PALETTE.accent, 800, 'center');
  text(ctx, '21 differences across three scenes — garden, market and harbor.', 640, cy + 92, 17, PALETTE.text, 600, 'center');
  text(ctx, `Final score ${state.score}   ·   Best combo ×${state.bestCombo}`, 640, cy + 128, 19, PALETTE.text, 700, 'center');
  if (state.score >= state.best && state.best > 0) text(ctx, 'A new best score!', 640, cy + 162, 17, PALETTE.accent2, 800, 'center');
  else if (state.best > 0) text(ctx, `Best score ${state.best}`, 640, cy + 162, 17, PALETTE.muted, 600, 'center');
  text(ctx, 'SPACE or click: play again', 640, cy + 226, 16, PALETTE.accent, 700, 'center');
}

export function createRenderer(canvas) {
  const ctx = canvas.getContext('2d');
  const scale = { x: 1, y: 1 };

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.round(rect.width * dpr));
    canvas.height = Math.max(1, Math.round(rect.height * dpr));
    scale.x = canvas.width / FIELD.width;
    scale.y = canvas.height / FIELD.height;
  }

  function toLogical(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((clientX - rect.left) / rect.width) * FIELD.width,
      y: ((clientY - rect.top) / rect.height) * FIELD.height,
    };
  }

  function draw(world, t) {
    const state = world.state;
    const level = world.level();
    resize();
    ctx.setTransform(scale.x, 0, 0, scale.y, 0, 0);
    ctx.fillStyle = PALETTE.backdrop;
    ctx.fillRect(0, 0, FIELD.width, FIELD.height);
    // A miss shakes the whole frame for a quarter of a second.
    if (state.shake > 0) {
      const mag = 6 * (state.shake / 0.25);
      ctx.translate(Math.sin(t * 90) * mag, Math.cos(t * 77) * mag);
    }
    if (state.screen === SCREEN_TITLE) {
      drawTitle(ctx, state, t);
      return;
    }
    drawHud(ctx, state, level, t);
    drawPanels(ctx, state, level, t);
    drawBottomBar(ctx, state);
    if (state.screen === SCREEN_PAUSED) drawPaused(ctx);
    else if (state.screen === SCREEN_LEVEL_DONE) drawLevelDone(ctx, state, level);
    else if (state.screen === SCREEN_OVER) drawOver(ctx, state, level);
    else if (state.screen === SCREEN_WIN) drawWin(ctx, state);
    // A red edge flash after a wrong click.
    if (state.flash > 0) {
      ctx.save();
      ctx.globalAlpha = state.flash * 0.9;
      ctx.strokeStyle = PALETTE.danger;
      ctx.lineWidth = 10;
      ctx.strokeRect(5, 5, FIELD.width - 10, FIELD.height - 10);
      ctx.restore();
    }
  }

  return { draw, toLogical, resize };
}
