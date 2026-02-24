import type * as Tone from "tone";

export interface SynthNode {
  output: Tone.ToneAudioNode;
  dispose: () => void;
}

export interface AudioAsset {
  mode: "synth" | "sample";
  sampleUrl?: string;
  createNode: () => SynthNode;
}
