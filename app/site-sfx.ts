"use client";

export type SiteSfx = "click" | "open" | "close" | "secret" | "cat" | "complete";

const STORAGE_KEY = "affan-portfolio-sfx";
let audioContext: AudioContext | null = null;
let enabledPreference: boolean | null = null;

function readEnabledPreference() {
  if (enabledPreference !== null) return enabledPreference;
  try {
    enabledPreference = window.localStorage.getItem(STORAGE_KEY) !== "off";
  } catch {
    enabledPreference = true;
  }
  return enabledPreference;
}

export function getSiteSfxEnabled() {
  if (typeof window === "undefined") return true;
  return readEnabledPreference();
}

export function setSiteSfxEnabled(enabled: boolean) {
  enabledPreference = enabled;
  try {
    window.localStorage.setItem(STORAGE_KEY, enabled ? "on" : "off");
  } catch {
    // Sound preference remains available for the current page.
  }
}

function getAudioContext() {
  if (audioContext) return audioContext;
  audioContext = new AudioContext();
  return audioContext;
}

export function playSiteSfx(effect: SiteSfx) {
  if (typeof window === "undefined" || !readEnabledPreference()) return;

  try {
    const context = getAudioContext();
    if (context.state === "suspended") void context.resume();
    const start = context.currentTime + 0.008;
    const master = context.createGain();
    master.gain.setValueAtTime(0.12, start);
    master.connect(context.destination);

    const tone = (
      offset: number,
      duration: number,
      fromFrequency: number,
      toFrequency: number,
      volume: number,
      type: OscillatorType = "sine",
    ) => {
      const oscillator = context.createOscillator();
      const envelope = context.createGain();
      const toneStart = start + offset;
      const toneEnd = toneStart + duration;
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(fromFrequency, toneStart);
      oscillator.frequency.exponentialRampToValueAtTime(Math.max(1, toFrequency), toneEnd);
      envelope.gain.setValueAtTime(0.0001, toneStart);
      envelope.gain.exponentialRampToValueAtTime(volume, toneStart + Math.min(0.012, duration * 0.25));
      envelope.gain.exponentialRampToValueAtTime(0.0001, toneEnd);
      oscillator.connect(envelope);
      envelope.connect(master);
      oscillator.start(toneStart);
      oscillator.stop(toneEnd + 0.01);
    };

    if (effect === "click") {
      tone(0, 0.055, 760, 520, 0.34, "triangle");
    } else if (effect === "open") {
      tone(0, 0.12, 360, 520, 0.28, "sine");
      tone(0.07, 0.16, 590, 780, 0.22, "triangle");
    } else if (effect === "close") {
      tone(0, 0.13, 520, 280, 0.25, "triangle");
    } else if (effect === "secret") {
      tone(0, 0.18, 420, 880, 0.25, "sine");
      tone(0.08, 0.22, 620, 1240, 0.18, "triangle");
      tone(0.18, 0.2, 940, 1480, 0.13, "sine");
    } else if (effect === "cat") {
      tone(0, 0.2, 190, 150, 0.28, "sine");
      tone(0.16, 0.24, 160, 210, 0.2, "sine");
    } else if (effect === "complete") {
      tone(0, 0.22, 523.25, 523.25, 0.22, "triangle");
      tone(0.16, 0.24, 659.25, 659.25, 0.2, "triangle");
      tone(0.33, 0.32, 783.99, 1046.5, 0.18, "sine");
    }

    window.setTimeout(() => {
      master.disconnect();
    }, 900);
  } catch {
    // The room remains fully usable when a browser blocks or lacks Web Audio.
  }
}
