import { storage } from "./storage.js";

let enabled = storage.getSoundEnabled();
let audioContext;

function context() {
  if (!enabled) return null;
  try {
    audioContext ||= new AudioContext();
    if (audioContext.state === "suspended") audioContext.resume();
    return audioContext;
  } catch {
    return null;
  }
}

function tone(frequency, duration, type = "sine", volume = 0.035, slide = 0) {
  const audio = context();
  if (!audio) return;
  const oscillator = audio.createOscillator();
  const gain = audio.createGain();
  const start = audio.currentTime;
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, start);
  if (slide) oscillator.frequency.exponentialRampToValueAtTime(Math.max(20, frequency + slide), start + duration);
  gain.gain.setValueAtTime(volume, start);
  gain.gain.exponentialRampToValueAtTime(.001, start + duration);
  oscillator.connect(gain).connect(audio.destination);
  oscillator.start(start);
  oscillator.stop(start + duration);
}

export const audio = {
  get enabled() {
    return enabled;
  },
  setEnabled(value) {
    enabled = Boolean(value);
    storage.setSoundEnabled(enabled);
    if (enabled) tone(660, .045, "sine", .025);
  },
  menu() { tone(520, .055, "sine", .025, 80); },
  move() { tone(190, .025, "square", .012, 18); },
  score() { tone(760, .09, "sine", .04, 180); },
  hit() { tone(190, .12, "sawtooth", .035, -90); },
  shoot() { tone(280, .04, "square", .018, 210); },
  clear() { tone(520, .12, "triangle", .04, 320); },
  gameOver() { tone(210, .32, "sawtooth", .04, -130); }
};
