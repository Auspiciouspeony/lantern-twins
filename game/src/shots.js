// The screenshot scenes behind ?shot=start|play|play3|end. Each one plays the
// real rules forward from a fresh world for a fixed setup, so the frame is
// what a real game looks like and the same seed always gives the same frame:
// the cover shows a mid-play hunt with rings on found differences, several
// still unfound and the counter reading what is found.
import { SCREEN_PLAY, SCREEN_LEVEL_DONE, SCREEN_WIN, SCREEN_TITLE } from './world.js';
import { DIFFS } from './scenes.js';
import { LEFT_X, PANEL } from './config.js';

/** Click a difference by id, as a player would, on the left panel. */
function findById(world, id) {
  const d = DIFFS[world.level().scene].find((x) => x.id === id);
  if (!d) return;
  world.clickAt(LEFT_X + d.x, PANEL.top + d.y);
}

/**
 * Set `world` to the named scene and return the screen to draw.
 * start: the title screen over the garden. play: level 2 (market) with 3 of 7
 * found. play3: level 3 (harbor) with 4 of 9 found. end: the win screen.
 */
export function stageShot(name, world) {
  if (name === 'play') {
    world.startLevel(1);
    ['lantern', 'balloon', 'sign'].forEach((id) => findById(world, id));
    world.state.timeLeft = 96;
    world.state.bestCombo = 3;
    return { screen: SCREEN_PLAY };
  }
  if (name === 'play3') {
    world.startLevel(2);
    ['beam', 'fish', 'flag', 'gull'].forEach((id) => findById(world, id));
    world.state.timeLeft = 121;
    world.state.bestCombo = 4;
    return { screen: SCREEN_PLAY };
  }
  if (name === 'end') {
    world.startLevel(2);
    const ids = DIFFS.harbor.map((d) => d.id);
    world.state.found = new Set(ids);
    world.state.foundOrder = ids;
    world.state.score = 2480;
    world.state.bestCombo = 5;
    world.state.totalFound = 21;
    world.state.best = 2480;
    world.state.screen = SCREEN_WIN;
    return { screen: SCREEN_WIN };
  }
  if (name === 'level') {
    world.startLevel(0);
    world.state.timeLeft = 64;
    DIFFS.garden.forEach((d) => findById(world, d.id));
    return { screen: SCREEN_LEVEL_DONE };
  }
  world.toTitle();
  return { screen: SCREEN_TITLE };
}
