'use client';

/**
 * Synthesized ambience for the path — no audio files.
 *
 * - **Wind**: a looping brown-noise bed through a slowly-modulated low-pass,
 *   with gentle gusts (an LFO swelling the gain) so it "sighs" rather than
 *   hisses. Fades in/out on toggle.
 * - **Footfall**: a short, soft, high-passed noise puff (think foot on grass) —
 *   deliberately no low sine "thud", which read as knocking on a box.
 *
 * OFF by default; only starts from a user gesture (the toggle), per autoplay
 * policy. Module-level singleton so the toggle and the path share one instance.
 */
type Listener = (enabled: boolean) => void;

class SoundEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private enabled = false;
  private listeners = new Set<Listener>();
  private lastStep = 0;

  private noiseBuf: AudioBuffer | null = null;
  private windSource: AudioBufferSourceNode | null = null;
  private windFade: GainNode | null = null;
  private windLfos: OscillatorNode[] = [];
  private windStopTimer: ReturnType<typeof setTimeout> | null = null;

  isEnabled() {
    return this.enabled;
  }

  subscribe(l: Listener) {
    this.listeners.add(l);
    l(this.enabled);
    return () => {
      this.listeners.delete(l);
    };
  }

  private emit() {
    this.listeners.forEach((l) => l(this.enabled));
  }

  private ensureContext() {
    if (this.ctx || typeof window === 'undefined') return;
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    this.ctx = new AC();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.9;
    this.master.connect(this.ctx.destination);
  }

  /** Lazily build a few seconds of brown noise (windier than white noise). */
  private brownNoise() {
    if (this.noiseBuf || !this.ctx) return this.noiseBuf;
    const ctx = this.ctx;
    const len = Math.floor(ctx.sampleRate * 4);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      d[i] = Math.max(-1, Math.min(1, last * 3.2));
    }
    this.noiseBuf = buf;
    return buf;
  }

  /** Toggle from a user gesture. Returns the new state. */
  async toggle() {
    this.enabled = !this.enabled;
    if (this.enabled) {
      this.ensureContext();
      if (this.ctx?.state === 'suspended') {
        try {
          await this.ctx.resume();
        } catch {
          /* ignore */
        }
      }
      this.startWind();
      this.step(0.6); // soft confirmation footfall
    } else {
      this.stopWind();
    }
    this.emit();
    return this.enabled;
  }

  private startWind() {
    if (!this.ctx || !this.master) return;
    const ctx = this.ctx;
    const t = ctx.currentTime;

    if (this.windStopTimer) {
      clearTimeout(this.windStopTimer);
      this.windStopTimer = null;
    }
    // already running (or mid fade-out) → just swell back in
    if (this.windSource && this.windFade) {
      this.windFade.gain.cancelScheduledValues(t);
      this.windFade.gain.setValueAtTime(this.windFade.gain.value, t);
      this.windFade.gain.linearRampToValueAtTime(0.6, t + 1.6);
      return;
    }

    const buf = this.brownNoise();
    if (!buf) return;

    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;

    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 480;
    lp.Q.value = 0.6;

    const modGain = ctx.createGain(); // gusts ride on this
    modGain.gain.value = 0.55;
    const fade = ctx.createGain(); // enable/disable envelope
    fade.gain.value = 0.0001;

    src.connect(lp);
    lp.connect(modGain);
    modGain.connect(fade);
    fade.connect(this.master);

    // gusts: a slow LFO swelling the level so the wind breathes/sighs
    const gustLfo = ctx.createOscillator();
    gustLfo.type = 'sine';
    gustLfo.frequency.value = 0.07;
    const gustDepth = ctx.createGain();
    gustDepth.gain.value = 0.35;
    gustLfo.connect(gustDepth);
    gustDepth.connect(modGain.gain);

    // tonal drift: a slower LFO sweeping the low-pass cutoff
    const freqLfo = ctx.createOscillator();
    freqLfo.type = 'sine';
    freqLfo.frequency.value = 0.045;
    const freqDepth = ctx.createGain();
    freqDepth.gain.value = 220;
    freqLfo.connect(freqDepth);
    freqDepth.connect(lp.frequency);

    src.start();
    gustLfo.start();
    freqLfo.start();
    fade.gain.linearRampToValueAtTime(0.6, t + 1.8); // gentle fade-in

    this.windSource = src;
    this.windFade = fade;
    this.windLfos = [gustLfo, freqLfo];
  }

  private stopWind() {
    if (!this.ctx || !this.windSource || !this.windFade) return;
    const ctx = this.ctx;
    const t = ctx.currentTime;
    this.windFade.gain.cancelScheduledValues(t);
    this.windFade.gain.setValueAtTime(this.windFade.gain.value, t);
    this.windFade.gain.linearRampToValueAtTime(0.0001, t + 1.1);

    const src = this.windSource;
    const lfos = this.windLfos;
    this.windStopTimer = setTimeout(() => {
      try {
        src.stop();
      } catch {
        /* ignore */
      }
      lfos.forEach((o) => {
        try {
          o.stop();
        } catch {
          /* ignore */
        }
      });
      this.windSource = null;
      this.windFade = null;
      this.windLfos = [];
    }, 1300);
  }

  /** A soft footfall — short, airy, no boxy resonance. No-op when muted. */
  step(gainScale = 1) {
    if (!this.enabled || !this.ctx || !this.master) return;
    const now = performance.now();
    if (now - this.lastStep < 120) return; // footfall rhythm, not a burst
    this.lastStep = now;

    const ctx = this.ctx;
    const t = ctx.currentTime;
    const rnd = (a: number, b: number) => a + Math.random() * (b - a);

    const dur = rnd(0.05, 0.085);
    const frames = Math.ceil(ctx.sampleRate * dur);
    const buf = ctx.createBuffer(1, frames, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < frames; i++) {
      const env = Math.pow(1 - i / frames, 2.6);
      d[i] = (Math.random() * 2 - 1) * env;
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;

    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 700; // strip the boxy low end
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = rnd(2600, 4200);
    const g = ctx.createGain();
    g.gain.value = 0.05 * gainScale;

    src.connect(hp);
    hp.connect(lp);
    lp.connect(g);
    g.connect(this.master);
    src.start(t);
  }
}

export const footsteps = new SoundEngine();
