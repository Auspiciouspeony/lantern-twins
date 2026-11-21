// Keyboard and pointer input. Held keys are read every frame; one-shot
// presses (confirm, pause, hint, restart, mute, level keys) are queued as bit
// flags and taken once by the loop, so a press between two frames is never
// lost and never counted twice. Pointer clicks arrive with logical
// coordinates, scaled from the canvas by the renderer.
export const ACTION_CONFIRM = 1;
export const ACTION_PAUSE = 2;
export const ACTION_HINT = 4;
export const ACTION_RESTART = 8;
export const ACTION_MUTE = 16;

const CONFIRM = new Set(['Space', 'Enter']);
const PAUSE = new Set(['KeyP', 'Escape']);
const HINT = new Set(['KeyH']);
const RESTART = new Set(['KeyR']);
const MUTE = new Set(['KeyM']);

export function createInput(canvas, toLogical) {
  let actions = 0;
  let clicks = [];
  let levelKey = 0;

  window.addEventListener('keydown', (event) => {
    if (CONFIRM.has(event.code)) {
      if (!event.repeat) actions |= ACTION_CONFIRM;
    } else if (PAUSE.has(event.code)) {
      if (!event.repeat) actions |= ACTION_PAUSE;
    } else if (HINT.has(event.code)) {
      if (!event.repeat) actions |= ACTION_HINT;
    } else if (RESTART.has(event.code)) {
      if (!event.repeat) actions |= ACTION_RESTART;
    } else if (MUTE.has(event.code)) {
      if (!event.repeat) actions |= ACTION_MUTE;
    } else if (event.code === 'Digit1' || event.code === 'Digit2' || event.code === 'Digit3') {
      if (!event.repeat) levelKey = Number(event.code.slice(-1));
    } else {
      return;
    }
    event.preventDefault();
  });

  canvas.addEventListener('pointerdown', (event) => {
    const logical = toLogical(event.clientX, event.clientY);
    clicks.push(logical);
    // A click is also a confirm on the title / end screens.
    actions |= ACTION_CONFIRM;
  });

  return {
    takeActions() {
      const taken = actions;
      actions = 0;
      return taken;
    },
    takeClicks() {
      const taken = clicks;
      clicks = [];
      return taken;
    },
    takeLevelKey() {
      const taken = levelKey;
      levelKey = 0;
      return taken;
    },
  };
}
