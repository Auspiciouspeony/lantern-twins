// Every tuning number, colour and level definition in one place.
// The playfield is a fixed 1280x720 logical area; the renderer scales it to
// the window, so no rule below depends on the screen size.
export const FIELD = { width: 1280, height: 720 };

// One picture panel, in logical coordinates, inside the playfield.
export const PANEL = { width: 560, height: 420, gap: 24, top: 118 };
export const LEFT_X = (FIELD.width - PANEL.width * 2 - PANEL.gap) / 2;
export const RIGHT_X = LEFT_X + PANEL.width + PANEL.gap;

export const STEP = 1 / 60;

export const SCORING = {
  find: 100,
  comboStep: 25,
  hintCost: 50,
  wrongTimePenalty: 5,
  timeBonusPerSecond: 5,
};

export const LEVELS = [
  { name: 'Firefly Garden', scene: 'garden', differences: 5, seconds: 120, blurb: 'A sunny garden. 5 differences hide here.' },
  { name: 'Lantern Market', scene: 'market', differences: 7, seconds: 150, blurb: 'A lantern-lit market at dusk. 7 differences hide here.' },
  { name: 'Moonlit Harbor', scene: 'harbor', differences: 9, seconds: 180, blurb: 'A quiet harbor under the moon. 9 differences hide here.' },
];

export const HINTS_PER_LEVEL = 3;
export const HINT_PULSE_SECONDS = 2.5;

export const PALETTE = {
  backdrop: '#14101f',
  panelFrame: '#3a2f5b',
  panelFrameFound: '#f2c94c',
  hud: '#1d1730',
  hudEdge: '#3a2f5b',
  text: '#f5efe0',
  muted: '#b9aecf',
  accent: '#f2c94c',
  accent2: '#7ee0a3',
  danger: '#ff6b6b',
  timer: '#7ee0a3',
  timerLow: '#ff6b6b',
  ring: '#ffd94d',
  ringGlow: 'rgba(255, 217, 77, 0.35)',
  card: '#221b38',
  cardEdge: '#574a86',
};

export const FONT = 'system-ui, -apple-system, "Segoe UI", sans-serif';

export const BEST_KEY = 'lantern-twins.best';
export const MUTE_KEY = 'lantern-twins.muted';
