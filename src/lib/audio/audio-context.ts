import * as Tone from "tone";

/**
 * Get the real native AudioContext, bypassing Tone.js and
 * standardized-audio-context wrappers. This is critical because:
 * - standardized-audio-context may not expose the "interrupted" state
 * - Tone.start() only checks for "suspended", missing iOS "interrupted"
 * - The native resume() handles all non-running states
 */
function getNativeContext(): AudioContext {
  const raw = Tone.getContext().rawContext;

  // standardized-audio-context stores the native context in _nativeContext
  // or _nativeAudioContext. We need the real native one to handle iOS
  // "interrupted" state which the wrapper may not expose.
  const rawRecord = raw as unknown as Record<string, unknown>;
  const native = rawRecord._nativeAudioContext ?? rawRecord._nativeContext;
  if (native instanceof AudioContext) return native;

  // rawContext might already be the native AudioContext
  if (raw instanceof AudioContext) return raw;

  // Fallback
  return raw as unknown as AudioContext;
}

class AudioContextManager {
  private static instance: AudioContextManager | null = null;
  private _isReady = false;
  private _needsGestureResume = false;
  private limiter: Tone.Limiter | null = null;
  private masterVolume: Tone.Volume | null = null;
  private stateChangeHandler: (() => void) | null = null;

  private constructor() {}

  private ensureTransportRunning(): void {
    if (Tone.getTransport().state !== "started") {
      Tone.getTransport().start();
    }
  }

  static getInstance(): AudioContextManager {
    if (!AudioContextManager.instance) {
      AudioContextManager.instance = new AudioContextManager();
    }
    return AudioContextManager.instance;
  }

  async start(): Promise<void> {
    if (this._isReady) return;

    await Tone.start();

    this.limiter = new Tone.Limiter(-1).toDestination();
    this.masterVolume = new Tone.Volume(0).connect(this.limiter);

    Tone.getTransport().bpm.value = 80;
    Tone.getTransport().start();

    // Safety net: auto-recover when browser/OS transitions context
    // back to "running" (e.g. after a phone call ends).
    const ctx = getNativeContext();
    this.stateChangeHandler = () => {
      if (!this._isReady) return;
      if (ctx.state === "running") {
        Tone.Destination.mute = false;
        this.ensureTransportRunning();
      }
    };
    ctx.addEventListener("statechange", this.stateChangeHandler);

    this._isReady = true;
  }

  suspend(): void {
    if (!this._isReady) return;
    Tone.Destination.mute = true;
    // When the page goes hidden on iOS the AudioContext will be
    // interrupted.  We flag that the next user gesture must run
    // the full unlock sequence regardless of what ctx.state reports.
    this._needsGestureResume = true;
  }

  resume(): void {
    if (!this._isReady) return;
    Tone.Destination.mute = false;

    // iOS "interrupted" 상태는 user gesture 내에서만 resume 가능.
    // 여기서 ctx.resume()을 호출하면 state만 "running"으로 바뀌고
    // 하드웨어는 활성화되지 않아 handleUserGesture()가 무력화됨.
    // "suspended" (데스크톱 탭 전환)는 gesture 없이 resume 가능.
    const ctx = getNativeContext();
    if (ctx.state === "suspended") {
      ctx.resume();
    }
    this.ensureTransportRunning();
  }

  /**
   * Must be called from a real user-gesture event handler (touchstart/click).
   *
   * On iOS, after backgrounding, the AudioContext enters "interrupted" state
   * and can ONLY be resumed within a user gesture. We also play a silent
   * buffer — the classic iOS audio unlock trick that forces the OS to
   * reactivate the audio hardware.
   */
  handleUserGesture(): void {
    if (!this._isReady) return;

    const ctx = getNativeContext();

    // On iOS, after backgrounding, ctx.state may already report "running"
    // even though the audio hardware is still inactive.  We use the
    // _needsGestureResume flag (set in suspend()) so that the first user
    // gesture after returning from background always runs the full unlock
    // sequence.
    if (ctx.state === "running" && !this._needsGestureResume) return;

    this._needsGestureResume = false;

    // 1) Play a silent buffer — the definitive way to unlock audio on
    //    iOS Safari within a user gesture context.
    try {
      const buffer = ctx.createBuffer(1, 1, ctx.sampleRate);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start(0);
    } catch (_) {
      // Ignore — best effort
    }

    // 2) Resume the native AudioContext AND Tone.js context.
    //    Both are needed: native resume unlocks the hardware,
    //    Tone.start() syncs Tone.js internal state.
    ctx.resume();
    Tone.start();

    // 3) Ensure Tone.js output and transport are running
    Tone.Destination.mute = false;
    this.ensureTransportRunning();
  }

  get isReady(): boolean {
    return this._isReady;
  }

  getMasterOutput(): Tone.Volume {
    if (!this.masterVolume) {
      throw new Error("AudioContextManager not started. Call start() first.");
    }
    return this.masterVolume;
  }

  setMasterVolume(value: number): void {
    if (this.masterVolume) {
      const clamped = Math.max(0, Math.min(1, value));
      const db = clamped <= 0 ? -Infinity : 20 * Math.log10(clamped);
      this.masterVolume.volume.rampTo(db, 0.1);
    }
  }

  dispose(): void {
    if (this._isReady) {
      Tone.getTransport().stop();
      if (this.stateChangeHandler) {
        getNativeContext().removeEventListener("statechange", this.stateChangeHandler);
        this.stateChangeHandler = null;
      }
    }
    this.masterVolume?.dispose();
    this.limiter?.dispose();
    this.masterVolume = null;
    this.limiter = null;
    this._isReady = false;
    AudioContextManager.instance = null;
  }
}

export const audioContextManager = AudioContextManager.getInstance();
