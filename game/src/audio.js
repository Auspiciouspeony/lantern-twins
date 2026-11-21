// All sound is synthesized with WebAudio: no audio files, no network.
// A tiny helper plays short oscillator blips; the game composes its chimes
// from it. Muting persists in localStorage.
import { MUTE_KEY } from './config.js';

export function createAudio() {
  let ctx = null;
  let muted = false;
  try {
    muted = window.localStorage.getItem(MUTE_KEY) === '1';
  } catch {
    muted = false;
  }

  function ensure() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function tone(freq, at, dur, type, vol) {
    if (muted) return;
    const ac = ensure();
    if (!ac) return;
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, ac.currentTime + at);
    gain.gain.linearRampToValueAtTime(vol, ac.currentTime + at + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + at + dur);
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start(ac.currentTime + at);
    osc.stop(ac.currentTime + at + dur + 0.05);
  }

  return {
    get muted() {
      return muted;
    },
    toggleMute() {
      muted = !muted;
      try {
        window.localStorage.setItem(MUTE_KEY, muted ? '1' : '0');
      } catch {
        // Storage can be off: the mute then lasts this visit only.
      }
      return muted;
    },
    unlock() {
      ensure();
    },
    /** Two bright notes: the satisfying mark on a find. */
    find() {
      tone(880, 0, 0.14, 'sine', 0.22);
      tone(1318, 0.08, 0.22, 'sine', 0.2);
    },
    /** A dull thud for a wrong click. */
    miss() {
      tone(140, 0, 0.16, 'triangle', 0.2);
      tone(90, 0.02, 0.18, 'triangle', 0.16);
    },
    /** A soft blip when a hint is spent. */
    hint() {
      tone(660, 0, 0.1, 'sine', 0.14);
      tone(990, 0.07, 0.14, 'sine', 0.12);
    },
    /** A rising arpeggio when a level is cleared. */
    levelClear() {
      [523, 659, 784, 1046].forEach((f, i) => tone(f, i * 0.09, 0.22, 'sine', 0.2));
    },
    /** A short fanfare for finishing all three scenes. */
    win() {
      [523, 659, 784, 1046, 784, 1046, 1318].forEach((f, i) => tone(f, i * 0.11, 0.26, 'triangle', 0.18));
    },
    /** A low two-note sigh when time runs out. */
    timeUp() {
      tone(392, 0, 0.3, 'sine', 0.18);
      tone(311, 0.22, 0.45, 'sine', 0.16);
    },
    click() {
      tone(520, 0, 0.06, 'sine', 0.1);
    },
  };
}
