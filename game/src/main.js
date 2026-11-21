// Boot and the one loop: input is read every frame, the world advances in
// fixed 1/60 s steps, and the renderer paints what is there. The game moves
// between six screens: title, play, paused, level-done, game over and win.
// A click on a panel is a guess; a click elsewhere is a confirm on the
// title and end screens. Sounds unlock on the first interaction.
//
// ?seed=N fixes the random stream. ?shot=start|play|play3|level|end (with
// &seed=N) stages that scene instead of running the loop, paints it twice
// and sets window.__shotReady for a screenshot.
import { BEST_KEY, STEP } from './config.js';
import { createRandom } from './random.js';
import { createWorld, EVENT_FIND, EVENT_MISS, EVENT_HINT, EVENT_LEVEL_CLEAR, EVENT_TIME_UP, SCREEN_TITLE, SCREEN_PLAY, SCREEN_PAUSED, SCREEN_LEVEL_DONE, SCREEN_OVER, SCREEN_WIN } from './world.js';
import { ACTION_CONFIRM, ACTION_PAUSE, ACTION_HINT, ACTION_RESTART, ACTION_MUTE, createInput } from './input.js';
import { createRenderer } from './render.js';
import { createAudio } from './audio.js';
import { stageShot } from './shots.js';

const MAX_FRAME = 0.25;

const params = new URLSearchParams(window.location.search);
const shot = params.get('shot');
const seedParam = Number.parseInt(params.get('seed') ?? '', 10);
const seed = Number.isInteger(seedParam) ? seedParam : Math.floor(Math.random() * 4294967296);

const canvas = document.getElementById('game');
const status = document.getElementById('status');
const world = createWorld(createRandom(seed));
const audio = createAudio();
const renderer = createRenderer(canvas);

function readBest() {
  try {
    return Number.parseInt(window.localStorage.getItem(BEST_KEY) ?? '0', 10) || 0;
  } catch {
    return 0;
  }
}

function saveBest(value) {
  try {
    window.localStorage.setItem(BEST_KEY, String(value));
  } catch {
    // Storage can be off (private windows): the best score then lasts this visit only.
  }
}

function runShot(name) {
  const scene = stageShot(name, world);
  world.state.best = Math.max(world.state.best, readBest());
  let painted = 0;
  function paint() {
    renderer.draw(world, 1.5);
    painted += 1;
    if (painted < 2) requestAnimationFrame(paint);
    else window.__shotReady = true;
  }
  requestAnimationFrame(paint);
  void scene;
}

function runGame() {
  const input = createInput(canvas, (x, y) => renderer.toLogical(x, y));
  world.state.best = readBest();
  let accumulator = 0;
  let last = performance.now();

  function announce(message) {
    status.textContent = message;
  }

  function startGame() {
    audio.unlock();
    audio.click();
    world.startGame();
    announce(`Playing ${world.level().name}. Find ${world.level().differences} differences.`);
  }

  function toTitle() {
    world.toTitle();
    announce('Lantern Twins. Press Space or click to play.');
  }

  function finishRun() {
    if (world.state.score > world.state.best) {
      world.state.best = world.state.score;
      saveBest(world.state.best);
    }
  }

  function handleActions() {
    const actions = input.takeActions();
    if (actions & ACTION_MUTE) {
      const muted = audio.toggleMute();
      announce(muted ? 'Sound off.' : 'Sound on.');
    }
    if (actions & ACTION_RESTART && (world.state.screen === SCREEN_PLAY || world.state.screen === SCREEN_PAUSED || world.state.screen === SCREEN_OVER)) {
      audio.click();
      world.retryLevel();
      announce(`Playing ${world.level().name} again.`);
      return;
    }
    if (actions & ACTION_HINT && world.state.screen === SCREEN_PLAY) {
      const event = world.useHint();
      if (event === EVENT_HINT) audio.hint();
      return;
    }
    if (actions & ACTION_PAUSE && world.state.screen === SCREEN_PLAY) {
      world.state.screen = SCREEN_PAUSED;
      announce('Paused.');
      return;
    }
    if (actions & (ACTION_PAUSE | ACTION_CONFIRM) && world.state.screen === SCREEN_PAUSED) {
      world.state.screen = SCREEN_PLAY;
      announce('Playing.');
      return;
    }
    if (actions & ACTION_CONFIRM) {
      if (world.state.screen === SCREEN_TITLE) startGame();
      else if (world.state.screen === SCREEN_LEVEL_DONE) {
        audio.click();
        world.nextLevel();
        if (world.state.screen === SCREEN_PLAY) announce(`Playing ${world.level().name}.`);
      } else if (world.state.screen === SCREEN_OVER) toTitle();
      else if (world.state.screen === SCREEN_WIN) {
        finishRun();
        startGame();
      }
    }
    const levelKey = input.takeLevelKey();
    if (levelKey >= 1 && levelKey <= 3 && (world.state.screen === SCREEN_TITLE || world.state.screen === SCREEN_LEVEL_DONE)) {
      audio.click();
      world.startLevel(levelKey - 1);
      announce(`Playing ${world.level().name}.`);
    }
  }

  function handleClicks() {
    for (const click of input.takeClicks()) {
      if (world.state.screen !== SCREEN_PLAY) continue;
      audio.unlock();
      const event = world.clickAt(click.x, click.y);
      if (event === EVENT_FIND) {
        audio.find();
        announce(`Found: ${world.state.foundLabel}. ${world.state.found.size} of ${world.level().differences}.`);
      } else if (event === EVENT_MISS) {
        audio.miss();
        announce(`Not a difference. ${Math.ceil(world.state.timeLeft)} seconds left.`);
      } else if (event === EVENT_LEVEL_CLEAR) {
        audio.levelClear();
        world.state.screen = SCREEN_LEVEL_DONE;
        announce(`Level clear! Score ${world.state.score}.`);
      }
    }
  }

  function frame(now) {
    requestAnimationFrame(frame);
    accumulator += Math.min((now - last) / 1000, MAX_FRAME);
    last = now;
    handleActions();
    handleClicks();
    while (accumulator >= STEP && world.state.screen === SCREEN_PLAY) {
      const event = world.step(STEP);
      accumulator -= STEP;
      if (event === EVENT_TIME_UP) {
        audio.timeUp();
        world.state.screen = SCREEN_OVER;
        finishRun();
        announce(`Time's up. Score ${world.state.score}.`);
      }
    }
    if (world.state.screen === SCREEN_WIN) finishRun();
    renderer.draw(world, now / 1000);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && world.state.screen === SCREEN_PLAY) {
      world.state.screen = SCREEN_PAUSED;
      announce('Paused.');
    }
  });

  announce('Lantern Twins. Press Space or click to play.');
  requestAnimationFrame(frame);
}

if (shot) runShot(shot);
else runGame();
