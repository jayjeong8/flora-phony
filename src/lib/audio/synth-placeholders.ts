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

function createHazeLilySynth(): Tone.ToneAudioNode {
  const noise = new Tone.Noise("brown");
  const filter = new Tone.Filter({ frequency: 300, type: "lowpass" });
  const gain = new Tone.Gain(0.06);
  noise.connect(filter);
  filter.connect(gain);
  noise.start();
  return gain;
}

function createRustleIvySynth(): Tone.ToneAudioNode {
  const noise = new Tone.Noise("pink");
  const autoFilter = new Tone.AutoFilter({
    frequency: 0.1,
    baseFrequency: 800,
    octaves: 3,
  }).start();
  const gain = new Tone.Gain(0.05);
  noise.connect(autoFilter);
  autoFilter.connect(gain);
  noise.start();
  return gain;
}

function createTideSeaweedSynth(): Tone.ToneAudioNode {
  const noise = new Tone.Noise("white");
  const autoFilter = new Tone.AutoFilter({
    frequency: 0.04,
    baseFrequency: 200,
    octaves: 4,
    depth: 1,
  }).start();
  const gain = new Tone.Gain(0.04);
  noise.connect(autoFilter);
  autoFilter.connect(gain);
  noise.start();
  return gain;
}

function createShimmerSageSynth(): Tone.ToneAudioNode {
  const synth = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "sine" },
    envelope: { attack: 1, decay: 2, sustain: 0.8, release: 2 },
    volume: -18,
  });
  synth.maxPolyphony = 2;
  const tremolo = new Tone.Tremolo({ frequency: 4, depth: 0.6 }).start();
  const gain = new Tone.Gain(0.4);
  synth.connect(tremolo);
  tremolo.connect(gain);

  const chords = [
    ["E4", "G4"],
    ["G4", "B4"],
    ["E4", "A4"],
  ];
  let chordIndex = 0;

  const loop = new Tone.Loop((time) => {
    synth.triggerAttackRelease(chords[chordIndex % chords.length], "2n", time);
    chordIndex++;
  }, "1m");
  loop.start(0);

  return gain;
}

function createEchoVineSynth(): Tone.ToneAudioNode {
  const synth = new Tone.Synth({
    oscillator: { type: "sine" },
    envelope: { attack: 0.5, decay: 1, sustain: 0.6, release: 2 },
    volume: -18,
  });
  const delay = new Tone.PingPongDelay({ delayTime: "4n", feedback: 0.4, wet: 0.5 });
  const gain = new Tone.Gain(0.35);
  synth.connect(delay);
  delay.connect(gain);

  const notes = ["C3", "E3", "G3", "A3"];
  let noteIndex = 0;

  const loop = new Tone.Loop((time) => {
    synth.triggerAttackRelease(notes[noteIndex % notes.length], "2n", time);
    noteIndex++;
  }, "1m");
  loop.start(0);

  return gain;
}

function createDriftWillowSynth(): Tone.ToneAudioNode {
  const synth = new Tone.PolySynth(Tone.AMSynth, {
    harmonicity: 2,
    envelope: { attack: 1.5, decay: 2, sustain: 0.7, release: 3 },
    volume: -20,
  });
  synth.maxPolyphony = 4;
  const reverb = new Tone.Reverb({ decay: 5, wet: 0.6 });
  const gain = new Tone.Gain(0.35);
  synth.connect(reverb);
  reverb.connect(gain);

  const chords = [
    ["C3", "E3", "G3", "B3"],
    ["F3", "A3", "C4", "E4"],
  ];
  let chordIndex = 0;

  const loop = new Tone.Loop((time) => {
    synth.triggerAttackRelease(chords[chordIndex % chords.length], "1m", time);
    chordIndex++;
  }, "2m");
  loop.start(0);

  return gain;
}

function createHumLotusSynth(): Tone.ToneAudioNode {
  const synth = new Tone.AMSynth({
    harmonicity: 1.5,
    envelope: { attack: 2, decay: 3, sustain: 0.8, release: 4 },
    volume: -20,
  });
  const reverb = new Tone.Reverb({ decay: 8, wet: 0.7 });
  const gain = new Tone.Gain(0.3);
  synth.connect(reverb);
  reverb.connect(gain);

  const notes = ["G3", "C4"];
  let noteIndex = 0;

  const loop = new Tone.Loop((time) => {
    synth.triggerAttackRelease(notes[noteIndex % notes.length], "2m", time);
    noteIndex++;
  }, "2m");
  loop.start(0);

  return gain;
}

function createEmberThornSynth(): Tone.ToneAudioNode {
  const synth = new Tone.Synth({
    oscillator: { type: "sawtooth" },
    envelope: { attack: 2, decay: 4, sustain: 0.9, release: 3 },
    volume: -22,
  });
  const distortion = new Tone.Distortion({ distortion: 0.3, wet: 0.4 });
  const filter = new Tone.Filter({ frequency: 400, type: "lowpass" });
  const gain = new Tone.Gain(0.25);
  synth.connect(distortion);
  distortion.connect(filter);
  filter.connect(gain);

  const loop = new Tone.Loop((time) => {
    synth.triggerAttackRelease("C2", "2m", time);
  }, "2m");
  loop.start(0);

  return gain;
}

function createCrystalCactusSynth(): Tone.ToneAudioNode {
  const synth = new Tone.FMSynth({
    harmonicity: 6,
    modulationIndex: 3,
    envelope: { attack: 0.01, decay: 0.8, sustain: 0, release: 0.5 },
    volume: -18,
  });
  const reverb = new Tone.Reverb({ decay: 3, wet: 0.4 });
  const gain = new Tone.Gain(0.4);
  synth.connect(reverb);
  reverb.connect(gain);

  const notes = ["C5", "E5", "G5", "A5", "G5", "E5"];
  let noteIndex = 0;

  const loop = new Tone.Loop((time) => {
    synth.triggerAttackRelease(notes[noteIndex % notes.length], "8n", time);
    noteIndex++;
  }, "4n");
  loop.start(0);

  return gain;
}

function createChirpCloverSynth(): Tone.ToneAudioNode {
  const synth = new Tone.PluckSynth({
    attackNoise: 1,
    dampening: 4000,
    resonance: 0.9,
    volume: -12,
  });
  const gain = new Tone.Gain(0.4);
  synth.connect(gain);

  const notes = ["E5", "G5", "A5", "C6", "D6"];
  let noteIndex = 0;

  const loop = new Tone.Loop((time) => {
    synth.triggerAttackRelease(notes[noteIndex % notes.length], "8n", time);
    noteIndex++;
  }, "4n.");
  loop.start(0);

  return gain;
}

function createTwangBambooSynth(): Tone.ToneAudioNode {
  const synth = new Tone.PluckSynth({
    attackNoise: 2,
    dampening: 3000,
    resonance: 0.85,
    volume: -10,
  });
  const gain = new Tone.Gain(0.35);
  synth.connect(gain);

  const notes = ["C4", "D4", "E4", "G4", "A4"];
  let noteIndex = 0;
  const pattern = [1, 0, 1, 1, 0, 1, 0, 1];
  let step = 0;

  const loop = new Tone.Loop((time) => {
    if (pattern[step % pattern.length]) {
      synth.triggerAttackRelease(notes[noteIndex % notes.length], "8n", time);
      noteIndex++;
    }
    step++;
  }, "8n");
  loop.start(0);

  return gain;
}

function createFrostOrchidSynth(): Tone.ToneAudioNode {
  const synth = new Tone.Synth({
    oscillator: { type: "sine" },
    envelope: { attack: 0.01, decay: 1.5, sustain: 0, release: 2 },
    volume: -20,
  });
  const delay = new Tone.FeedbackDelay({ delayTime: "8n.", feedback: 0.3, wet: 0.4 });
  const reverb = new Tone.Reverb({ decay: 5, wet: 0.5 });
  const gain = new Tone.Gain(0.35);
  synth.connect(delay);
  delay.connect(reverb);
  reverb.connect(gain);

  const notes = ["C6", "E6", "G6", "B5", "G5", "E6"];
  let noteIndex = 0;

  const loop = new Tone.Loop((time) => {
    synth.triggerAttackRelease(notes[noteIndex % notes.length], "8n", time);
    noteIndex++;
  }, "2n");
  loop.start(0);

  return gain;
}

function createSparkDaisySynth(): Tone.ToneAudioNode {
  const synth = new Tone.MetalSynth({
    frequency: 300,
    envelope: { attack: 0.001, decay: 0.4, release: 0.2 },
    harmonicity: 5.1,
    modulationIndex: 16,
    resonance: 3000,
    octaves: 1,
    volume: -22,
  });
  const gain = new Tone.Gain(0.3);
  synth.connect(gain);

  const pattern = [1, 0, 0, 1, 0, 0, 0, 1];
  let step = 0;

  const loop = new Tone.Loop((time) => {
    if (pattern[step % pattern.length]) {
      synth.triggerAttackRelease("16n", time);
    }
    step++;
  }, "4n");
  loop.start(0);

  return gain;
}

function createGrooveRootSynth(): Tone.ToneAudioNode {
  const synth = new Tone.MembraneSynth({
    pitchDecay: 0.05,
    octaves: 6,
    envelope: { attack: 0.001, decay: 0.4, sustain: 0, release: 0.3 },
    volume: -10,
  });
  const filter = new Tone.Filter({ frequency: 100, type: "lowpass" });
  const gain = new Tone.Gain(0.35);
  synth.connect(filter);
  filter.connect(gain);

  const pattern = [1, 0, 0, 0, 1, 0, 0, 0];
  let step = 0;

  const loop = new Tone.Loop((time) => {
    if (pattern[step % pattern.length]) {
      synth.triggerAttackRelease("C1", "8n", time);
    }
    step++;
  }, "8n");
  loop.start(0);

  return gain;
}

function createBubbleKelpSynth(): Tone.ToneAudioNode {
  const synth = new Tone.Synth({
    oscillator: { type: "sine" },
    envelope: { attack: 0.005, decay: 0.15, sustain: 0, release: 0.1 },
    volume: -15,
  });
  const gain = new Tone.Gain(0.35);
  synth.connect(gain);

  const notes = ["C5", "E5", "G5", "C6"];

  const loop = new Tone.Loop((time) => {
    if (Math.random() < 0.4) {
      const note = notes[Math.floor(Math.random() * notes.length)];
      synth.triggerAttackRelease(note, "32n", time);
    }
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
  [PlantType.HazeLily]: {
    mode: "synth",
    createNode: createHazeLilySynth,
  },
  [PlantType.RustleIvy]: {
    mode: "synth",
    createNode: createRustleIvySynth,
  },
  [PlantType.TideSeaweed]: {
    mode: "synth",
    createNode: createTideSeaweedSynth,
  },
  [PlantType.ShimmerSage]: {
    mode: "synth",
    createNode: createShimmerSageSynth,
  },
  [PlantType.EchoVine]: {
    mode: "synth",
    createNode: createEchoVineSynth,
  },
  [PlantType.DriftWillow]: {
    mode: "synth",
    createNode: createDriftWillowSynth,
  },
  [PlantType.HumLotus]: {
    mode: "synth",
    createNode: createHumLotusSynth,
  },
  [PlantType.EmberThorn]: {
    mode: "synth",
    createNode: createEmberThornSynth,
  },
  [PlantType.CrystalCactus]: {
    mode: "synth",
    createNode: createCrystalCactusSynth,
  },
  [PlantType.ChirpClover]: {
    mode: "synth",
    createNode: createChirpCloverSynth,
  },
  [PlantType.TwangBamboo]: {
    mode: "synth",
    createNode: createTwangBambooSynth,
  },
  [PlantType.FrostOrchid]: {
    mode: "synth",
    createNode: createFrostOrchidSynth,
  },
  [PlantType.SparkDaisy]: {
    mode: "synth",
    createNode: createSparkDaisySynth,
  },
  [PlantType.GrooveRoot]: {
    mode: "synth",
    createNode: createGrooveRootSynth,
  },
  [PlantType.BubbleKelp]: {
    mode: "synth",
    createNode: createBubbleKelpSynth,
  },
};
