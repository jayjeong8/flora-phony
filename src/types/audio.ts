import type * as Tone from "tone";

export interface AudioAsset {
  mode: "synth" | "sample";
  sampleUrl?: string;
  createNode: () => Tone.ToneAudioNode;
}
