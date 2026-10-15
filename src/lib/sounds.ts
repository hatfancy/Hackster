/**
 * Sound engine for HACK//BREAK.
 * Generates sounds procedurally using the Web Audio API.
 * No external audio files required.
 */

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
}

function playTone(
  frequency: number,
  duration: number,
  type: OscillatorType = 'sine',
  gainVal = 0.15,
  delay = 0
) {
  const ctx = getCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = type;
  osc.frequency.setValueAtTime(frequency, ctx.currentTime + delay);
  gain.gain.setValueAtTime(gainVal, ctx.currentTime + delay);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);
  osc.start(ctx.currentTime + delay);
  osc.stop(ctx.currentTime + delay + duration);
}

export const sounds = {
  success: () => {
    playTone(523, 0.15, 'sine', 0.2);
    playTone(659, 0.15, 'sine', 0.2, 0.15);
    playTone(784, 0.3, 'sine', 0.2, 0.3);
  },
  failure: () => {
    playTone(220, 0.3, 'sawtooth', 0.15);
    playTone(180, 0.4, 'sawtooth', 0.15, 0.3);
  },
  hint: () => {
    playTone(440, 0.1, 'sine', 0.12);
    playTone(330, 0.15, 'sine', 0.12, 0.12);
  },
  wrongAnswer: () => {
    playTone(200, 0.2, 'square', 0.1);
  },
  levelComplete: () => {
    [523, 659, 784, 1047].forEach((f, i) => {
      playTone(f, 0.2, 'sine', 0.18, i * 0.12);
    });
  },
  victory: () => {
    const melody = [523, 659, 784, 659, 784, 1047, 784, 1047, 1319];
    melody.forEach((f, i) => {
      playTone(f, 0.3, 'sine', 0.15, i * 0.15);
    });
  },
  rankUp: () => {
    [392, 523, 659, 784].forEach((f, i) => {
      playTone(f, 0.25, 'triangle', 0.18, i * 0.1);
    });
  },
  click: () => {
    playTone(800, 0.05, 'square', 0.08);
  },
  timerWarning: () => {
    playTone(880, 0.1, 'sine', 0.1);
  },
  keyPress: () => {
    playTone(1200, 0.03, 'square', 0.05);
  },
};

export type SoundKey = keyof typeof sounds;

let muted = false;

export function setMuted(value: boolean) {
  muted = value;
}

export function playSound(key: SoundKey) {
  if (muted) return;
  try {
    sounds[key]();
  } catch (e) {
    // Web Audio API may not be available
  }
}
