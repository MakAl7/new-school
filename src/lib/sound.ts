let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  try {
    if (!ctx) {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function tone(
  c: AudioContext,
  freq: number,
  start: number,
  dur: number,
  type: OscillatorType = "sine",
  vol = 0.16,
) {
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.0001, c.currentTime + start);
  gain.gain.exponentialRampToValueAtTime(vol, c.currentTime + start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + start + dur);
  osc.connect(gain).connect(c.destination);
  osc.start(c.currentTime + start);
  osc.stop(c.currentTime + start + dur + 0.05);
}

export type SoundKind = "ok" | "bad" | "win" | "start";

export function playSound(kind: SoundKind, enabled: boolean) {
  if (!enabled) return;
  const c = getCtx();
  if (!c) return;
  try {
    switch (kind) {
      case "ok":
        tone(c, 660, 0, 0.12);
        tone(c, 880, 0.1, 0.16);
        break;
      case "bad":
        tone(c, 160, 0, 0.2, "sawtooth", 0.12);
        tone(c, 120, 0.12, 0.22, "sawtooth", 0.1);
        break;
      case "win":
        tone(c, 523, 0, 0.14);
        tone(c, 659, 0.12, 0.14);
        tone(c, 784, 0.24, 0.16);
        tone(c, 1047, 0.38, 0.3);
        break;
      case "start":
        tone(c, 440, 0, 0.1);
        tone(c, 587, 0.09, 0.14);
        break;
    }
  } catch {}
}
