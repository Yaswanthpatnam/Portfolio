// Browser-native Web Audio API: Ultra-Smooth, Soft Tactile Acoustic Card Slide
// Replaces harsh white noise with a gentle, silky low-pass acoustic whisper
let audioCtx = null;
let soundEnabled = true;

try {
  const saved = localStorage.getItem("portfolio_card_sound");
  if (saved !== null) soundEnabled = saved === "true";
} catch {}

export function playCardDealSound() {
  if (!soundEnabled) return;
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;
    const duration = 0.055; // 55ms micro-tactile duration

    // 1. Soft, low-frequency velvet pink noise buffer (smoother and softer than harsh white noise)
    const bufferSize = Math.floor(audioCtx.sampleRate * duration);
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // Pink noise filter to cut harsh upper frequencies
      b0 = 0.99765 * b0 + white * 0.0990460;
      b1 = 0.96300 * b1 + white * 0.1600000;
      b2 = 0.57000 * b2 + white * 0.2200000;
      data[i] = (b0 + b1 + b2) * 0.15;
    }

    const noiseSource = audioCtx.createBufferSource();
    noiseSource.buffer = buffer;

    // 2. Warm lowpass filter to remove all static/harsh hiss
    const lowpass = audioCtx.createBiquadFilter();
    lowpass.type = "lowpass";
    lowpass.frequency.setValueAtTime(320, now);
    lowpass.frequency.exponentialRampToValueAtTime(120, now + duration);
    lowpass.Q.setValueAtTime(0.5, now); // Zero resonant peak (no ringing)

    // 3. Gentle master gain envelope: soft attack, whisper volume, exponential decay
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.045, now + 0.012); // Whisper-soft 0.045 gain
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    // 4. Subtle warm acoustic body tone (soft sine micro-glide: 130Hz -> 85Hz)
    const osc = audioCtx.createOscillator();
    const oscGain = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(130, now);
    osc.frequency.exponentialRampToValueAtTime(85, now + duration);

    oscGain.gain.setValueAtTime(0.001, now);
    oscGain.gain.linearRampToValueAtTime(0.035, now + 0.01);
    oscGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    // Route connections
    noiseSource.connect(lowpass);
    lowpass.connect(gain);
    gain.connect(audioCtx.destination);

    osc.connect(oscGain);
    oscGain.connect(audioCtx.destination);

    noiseSource.start(now);
    osc.start(now);
    noiseSource.stop(now + duration);
    osc.stop(now + duration);
  } catch {
    // Gracefully handle unsupported or blocked audio
  }
}

export function isSoundEnabled() {
  return soundEnabled;
}

export function setSoundEnabled(enabled) {
  soundEnabled = Boolean(enabled);
  try {
    localStorage.setItem("portfolio_card_sound", String(soundEnabled));
  } catch {}
}
