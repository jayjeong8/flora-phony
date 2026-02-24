import * as Tone from "tone";
import type { AudioAsset } from "@/types/audio";
import { PlantType } from "@/types/plant";

function createRainReedSynth(): Tone.ToneAudioNode {
  const noise = new Tone.Noise("white");
  const filter = new Tone.AutoFilter({
    frequency: 0.2,
    baseFrequency: 400,
    octaves: 2,
  }).start();
  const gain = new Tone.Gain(0.05);
  noise.connect(filter);
  filter.connect(gain);
  noise.start();
  return gain;
}

function createLofiFernSynth(): Tone.ToneAudioNode {
  const synth = new Tone.PolySynth(Tone.FMSynth, {
    harmonicity: 2,
    modulationIndex: 1.5,
    envelope: { attack: 0.3, decay: 0.8, sustain: 0.4, release: 1.5 },
    volume: -12,
  });
  synth.maxPolyphony = 4;
  const reverb = new Tone.Reverb({ decay: 3, wet: 0.5 });
  const gain = new Tone.Gain(0.5);
  synth.connect(reverb);
  reverb.connect(gain);

  const chords = [
    ["C4", "E4", "G4"],
    ["A3", "C4", "E4"],
    ["F3", "A3", "C4"],
    ["G3", "B3", "D4"],
  ];

  const loop = new Tone.Loop((time) => {
    const chord = chords[Math.floor(Math.random() * chords.length)];
    synth.triggerAttackRelease(chord, "2n", time);
  }, "1m");
  loop.start(0);

  return gain;
}

function createPulseMossSynth(): Tone.ToneAudioNode {
  const synth = new Tone.Synth({
    oscillator: { type: "sine" },
    envelope: { attack: 0.1, decay: 0.6, sustain: 0.3, release: 0.8 },
    volume: -8,
  });
  const gain = new Tone.Gain(0.35);
  synth.connect(gain);

  const notes = ["C2", "C2", "E2", "G2"];
  let noteIndex = 0;

  const loop = new Tone.Loop((time) => {
    synth.triggerAttackRelease(notes[noteIndex % notes.length], "4n", time);
    noteIndex++;
  }, "2n");
  loop.start(0);

  return gain;
}

function createBellFlowerSynth(): Tone.ToneAudioNode {
  const synth = new Tone.Synth({
    oscillator: { type: "triangle" },
    envelope: { attack: 0.01, decay: 1.5, sustain: 0, release: 1 },
    volume: -15,
  });
  const reverb = new Tone.Reverb({ decay: 4, wet: 0.6 });
  const gain = new Tone.Gain(0.5);
  synth.connect(reverb);
  reverb.connect(gain);

  const notes = ["E5", "G5", "C6", "B5", "A5", "G5", "E5", "D5"];
  let noteIndex = 0;

  const loop = new Tone.Loop((time) => {
    synth.triggerAttackRelease(notes[noteIndex % notes.length], "8n", time);
    noteIndex++;
  }, "4n");
  loop.start(0);

  return gain;
}

function createWindWoodSynth(): Tone.ToneAudioNode {
  const membrane = new Tone.MembraneSynth({
    pitchDecay: 0.01,
    octaves: 4,
    envelope: { attack: 0.001, decay: 0.2, sustain: 0, release: 0.1 },
    volume: -10,
  });
  const gain = new Tone.Gain(0.35);
  membrane.connect(gain);

  const pattern = [1, 0, 1, 0, 0, 1, 0, 1];
  let step = 0;

  const loop = new Tone.Loop((time) => {
    if (pattern[step % pattern.length]) {
      membrane.triggerAttackRelease("C3", "16n", time);
    }
    step++;
  }, "8n");
  loop.start(0);

  return gain;
}

export const SYNTH_PLACEHOLDERS: Record<PlantType, AudioAsset> = {
  [PlantType.RainReed]: {
    mode: "synth",
    createNode: createRainReedSynth,
  },
  [PlantType.LofiFern]: {
    mode: "synth",
    createNode: createLofiFernSynth,
  },
  [PlantType.PulseMoss]: {
    mode: "synth",
    createNode: createPulseMossSynth,
  },
  [PlantType.BellFlower]: {
    mode: "synth",
    createNode: createBellFlowerSynth,
  },
  [PlantType.WindWood]: {
    mode: "synth",
    createNode: createWindWoodSynth,
  },
};
