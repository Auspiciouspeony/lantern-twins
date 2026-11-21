// The game state: screens, levels, finds, timer, hints, score and combo.
// Pure rules, no drawing: the renderer paints whatever this holds. A click
// is checked against the level's differences in panel-local coordinates;
// a hit marks the spot on both panels, a miss costs time and breaks the
// combo. Every number the HUD shows comes from here.
import { LEVELS, HINTS_PER_LEVEL, HINT_PULSE_SECONDS, SCORING, PANEL, LEFT_X, RIGHT_X } from './config.js';
import { DIFFS } from './scenes.js';

export const SCREEN_TITLE = 'title';
export const SCREEN_PLAY = 'play';
export const SCREEN_PAUSED = 'paused';
export const SCREEN_LEVEL_DONE = 'level-done';
export const SCREEN_OVER = 'over';
export const SCREEN_WIN = 'win';

export const EVENT_NONE = 0;
export const EVENT_FIND = 1;
export const EVENT_MISS = 2;
export const EVENT_HINT = 4;
export const EVENT_LEVEL_CLEAR = 8;
export const EVENT_TIME_UP = 16;

function allDiffIds(sceneId) {
  return DIFFS[sceneId].map((d) => d.id);
}

export function createWorld(random) {
  const state = {
    screen: SCREEN_TITLE,
    levelIndex: 0,
    found: new Set(),
    foundOrder: [],
    score: 0,
    combo: 0,
    bestCombo: 0,
    timeLeft: LEVELS[0].seconds,
    hintsLeft: HINTS_PER_LEVEL,
    strikes: 0,
    hintPulse: null, // {id, until} while a hint ring is pulsing
    rings: [], // {x, y, born, panel} expanding rings on finds
    sparks: [], // {x, y, vx, vy, born, color} burst particles
    shake: 0, // seconds of screen shake left after a miss
    flash: 0, // seconds of red edge flash left after a miss
    best: 0,
    levelScore: 0,
    levelFinds: 0,
    totalFound: 0,
    elapsed: 0,
    toast: null, // {text, until} small message line
    foundLabel: '',
  };

  function level() {
    return LEVELS[state.levelIndex];
  }

  function diffsOf(sceneId) {
    return DIFFS[sceneId];
  }

  function startLevel(index) {
    state.levelIndex = index;
    state.found = new Set();
    state.foundOrder = [];
    state.timeLeft = level().seconds;
    state.hintsLeft = HINTS_PER_LEVEL;
    state.strikes = 0;
    state.hintPulse = null;
    state.rings = [];
    state.sparks = [];
    state.levelScore = 0;
    state.levelFinds = 0;
    state.screen = SCREEN_PLAY;
  }

  function startGame() {
    state.score = 0;
    state.combo = 0;
    state.bestCombo = 0;
    state.totalFound = 0;
    state.elapsed = 0;
    startLevel(0);
  }

  /** Which panel (if any) a logical point falls in, and its panel-local spot. */
  function panelAt(x, y) {
    if (y < PANEL.top || y > PANEL.top + PANEL.height) return null;
    if (x >= LEFT_X && x <= LEFT_X + PANEL.width) return { side: 'left', x: x - LEFT_X, y: y - PANEL.top };
    if (x >= RIGHT_X && x <= RIGHT_X + PANEL.width) return { side: 'right', x: x - RIGHT_X, y: y - PANEL.top };
    return null;
  }

  function burst(x, y, color) {
    for (let i = 0; i < 14; i += 1) {
      const a = random() * Math.PI * 2;
      const speed = 40 + random() * 90;
      state.sparks.push({ x, y, vx: Math.cos(a) * speed, vy: Math.sin(a) * speed - 30, born: state.elapsed, color });
    }
  }

  function clickAt(x, y) {
    if (state.screen !== SCREEN_PLAY) return EVENT_NONE;
    const spot = panelAt(x, y);
    if (!spot) return EVENT_NONE;
    const diffs = diffsOf(level().scene);
    for (const d of diffs) {
      if (state.found.has(d.id)) continue;
      const dx = spot.x - d.x;
      const dy = spot.y - d.y;
      if (dx * dx + dy * dy <= d.r * d.r) {
        state.found.add(d.id);
        state.foundOrder.push(d.id);
        state.levelFinds += 1;
        state.totalFound += 1;
        state.combo += 1;
        if (state.combo > state.bestCombo) state.bestCombo = state.combo;
        const gained = SCORING.find + SCORING.comboStep * (state.combo - 1);
        state.score += gained;
        state.levelScore += gained;
        state.strikes = 0;
        state.foundLabel = d.label;
        state.toast = { text: `Found: ${d.label}!  +${gained}`, until: state.elapsed + 1.6 };
        const absX = spot.side === 'left' ? LEFT_X + d.x : RIGHT_X + d.x;
        const absY = PANEL.top + d.y;
        state.rings.push({ x: absX, y: absY, born: state.elapsed, side: spot.side });
        burst(absX, absY, '#ffd94d');
        burst(spot.side === 'left' ? RIGHT_X + d.x : LEFT_X + d.x, absY, '#7ee0a3');
        if (state.found.size === diffs.length) {
          const bonus = Math.round(state.timeLeft) * SCORING.timeBonusPerSecond;
          state.score += bonus;
          state.levelScore += bonus;
          state.screen = SCREEN_LEVEL_DONE;
          return EVENT_LEVEL_CLEAR;
        }
        return EVENT_FIND;
      }
    }
    // No difference there: a miss costs time and breaks the combo.
    state.timeLeft = Math.max(0, state.timeLeft - SCORING.wrongTimePenalty);
    state.combo = 0;
    state.strikes += 1;
    state.shake = 0.25;
    state.flash = 0.4;
    state.toast = { text: `Not a difference  −${SCORING.wrongTimePenalty}s`, until: state.elapsed + 1.2 };
    return EVENT_MISS;
  }

  function useHint() {
    if (state.screen !== SCREEN_PLAY) return EVENT_NONE;
    if (state.hintsLeft <= 0) {
      state.toast = { text: 'No hints left', until: state.elapsed + 1.2 };
      return EVENT_NONE;
    }
    const remaining = diffsOf(level().scene).filter((d) => !state.found.has(d.id));
    if (remaining.length === 0) return EVENT_NONE;
    const pick = remaining[Math.floor(random() * remaining.length)];
    state.hintsLeft -= 1;
    state.score = Math.max(0, state.score - SCORING.hintCost);
    state.hintPulse = { id: pick.id, until: state.elapsed + HINT_PULSE_SECONDS };
    state.toast = { text: `Hint: look near the ${pick.label}  −${SCORING.hintCost}`, until: state.elapsed + 1.6 };
    return EVENT_HINT;
  }

  function step(dt) {
    state.elapsed += dt;
    if (state.screen !== SCREEN_PLAY) return EVENT_NONE;
    state.timeLeft -= dt;
    if (state.shake > 0) state.shake = Math.max(0, state.shake - dt);
    if (state.flash > 0) state.flash = Math.max(0, state.flash - dt);
    if (state.hintPulse && state.elapsed > state.hintPulse.until) state.hintPulse = null;
    state.sparks = state.sparks.filter((s) => state.elapsed - s.born < 0.9);
    if (state.timeLeft <= 0) {
      state.timeLeft = 0;
      state.screen = SCREEN_OVER;
      return EVENT_TIME_UP;
    }
    return EVENT_NONE;
  }

  function nextLevel() {
    if (state.levelIndex + 1 >= LEVELS.length) {
      state.screen = SCREEN_WIN;
      return;
    }
    startLevel(state.levelIndex + 1);
  }

  function retryLevel() {
    startLevel(state.levelIndex);
  }

  function toTitle() {
    state.screen = SCREEN_TITLE;
    state.found = new Set();
    state.foundOrder = [];
    state.rings = [];
    state.sparks = [];
    state.hintPulse = null;
  }

  return {
    state,
    level,
    diffsOf,
    allDiffIds,
    startGame,
    startLevel,
    clickAt,
    useHint,
    step,
    nextLevel,
    retryLevel,
    toTitle,
    panelAt,
  };
}
