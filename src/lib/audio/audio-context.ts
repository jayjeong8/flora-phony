import * as Tone from "tone";

class AudioContextManager {
  private static instance: AudioContextManager | null = null;
  private _isReady = false;
  private limiter: Tone.Limiter | null = null;
  private masterVolume: Tone.Volume | null = null;

  private constructor() {}

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

    this._isReady = true;
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
      const db = value <= 0 ? -Infinity : 20 * Math.log10(value);
      this.masterVolume.volume.rampTo(db, 0.1);
    }
  }

  dispose(): void {
    Tone.getTransport().stop();
    this.masterVolume?.dispose();
    this.limiter?.dispose();
    this.masterVolume = null;
    this.limiter = null;
    this._isReady = false;
    AudioContextManager.instance = null;
  }
}

export const audioContextManager = AudioContextManager.getInstance();
