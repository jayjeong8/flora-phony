import * as Tone from "tone";
import type { AudioAsset, SynthNode } from "@/types/audio";
import { PlantType } from "@/types/plant";

function createRainReedSynth(): SynthNode {
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
  return {
    output: gain,
    dispose: () => {
      noise.stop();
      noise.dispose();
      filter.dispose();
      gain.dispose();
    },
  };
}

function createLofiFernSynth(): SynthNode {
  const synth = new Tone.PolySynth(Tone.FMSynth, {
    harmonicity: 2,
    modulationIndex: 1.5,
    envelope: { attack: 0.3, decay: 0.8, sustain: 0.4, release: 1.5 },
    volume: -12,
  });
  synth.maxPolyphony = 8;
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
    synth.releaseAll(time);
    const chord = chords[Math.floor(Math.random() * chords.length)];
    synth.triggerAttackRelease(chord, "2n", time);
  }, "1m");
  loop.start(0);

  return {
    output: gain,
    dispose: () => {
      loop.stop();
      loop.dispose();
      synth.releaseAll();
      synth.dispose();
      reverb.dispose();
      gain.dispose();
    },
  };
}

function createPulseMossSynth(): SynthNode {
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

  return {
    output: gain,
    dispose: () => {
      loop.stop();
      loop.dispose();
      synth.dispose();
      gain.dispose();
    },
  };
}

function createBellFlowerSynth(): SynthNode {
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

  return {
    output: gain,
    dispose: () => {
      loop.stop();
      loop.dispose();
      synth.dispose();
      reverb.dispose();
      gain.dispose();
    },
  };
}

function createWindWoodSynth(): SynthNode {
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

  return {
    output: gain,
    dispose: () => {
      loop.stop();
      loop.dispose();
      membrane.dispose();
      gain.dispose();
    },
  };
}

function createHazeLilySynth(): SynthNode {
  const noise = new Tone.Noise("brown");
  const filter = new Tone.Filter({ frequency: 300, type: "lowpass" });
  const gain = new Tone.Gain(0.06);
  noise.connect(filter);
  filter.connect(gain);
  noise.start();
  return {
    output: gain,
    dispose: () => {
      noise.stop();
      noise.dispose();
      filter.dispose();
      gain.dispose();
    },
  };
}

function createRustleIvySynth(): SynthNode {
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
  return {
    output: gain,
    dispose: () => {
      noise.stop();
      noise.dispose();
      autoFilter.dispose();
      gain.dispose();
    },
  };
}

function createTideSeaweedSynth(): SynthNode {
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
  return {
    output: gain,
    dispose: () => {
      noise.stop();
      noise.dispose();
      autoFilter.dispose();
      gain.dispose();
    },
  };
}

function createShimmerSageSynth(): SynthNode {
  const synth = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "sine" },
    envelope: { attack: 1, decay: 2, sustain: 0.8, release: 2 },
    volume: -18,
  });
  synth.maxPolyphony = 4;
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
    synth.releaseAll(time);
    synth.triggerAttackRelease(chords[chordIndex % chords.length], "2n", time);
    chordIndex++;
  }, "1m");
  loop.start(0);

  return {
    output: gain,
    dispose: () => {
      loop.stop();
      loop.dispose();
      synth.releaseAll();
      synth.dispose();
      tremolo.dispose();
      gain.dispose();
    },
  };
}

function createEchoVineSynth(): SynthNode {
  const synth = new Tone.Synth({
    oscillator: { type: "sine" },
    envelope: { attack: 0.5, decay: 1, sustain: 0.6, release: 2 },
    volume: -18,
  });
  const delay = new Tone.PingPongDelay({
    delayTime: "4n",
    feedback: 0.4,
    wet: 0.5,
  });
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

  return {
    output: gain,
    dispose: () => {
      loop.stop();
      loop.dispose();
      synth.dispose();
      delay.dispose();
      gain.dispose();
    },
  };
}

function createDriftWillowSynth(): SynthNode {
  const synth = new Tone.PolySynth(Tone.AMSynth, {
    harmonicity: 2,
    envelope: { attack: 1.5, decay: 2, sustain: 0.7, release: 3 },
    volume: -20,
  });
  synth.maxPolyphony = 8;
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
    synth.releaseAll(time);
    synth.triggerAttackRelease(chords[chordIndex % chords.length], "1m", time);
    chordIndex++;
  }, "2m");
  loop.start(0);

  return {
    output: gain,
    dispose: () => {
      loop.stop();
      loop.dispose();
      synth.releaseAll();
      synth.dispose();
      reverb.dispose();
      gain.dispose();
    },
  };
}

function createHumLotusSynth(): SynthNode {
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

  return {
    output: gain,
    dispose: () => {
      loop.stop();
      loop.dispose();
      synth.dispose();
      reverb.dispose();
      gain.dispose();
    },
  };
}

function createEmberThornSynth(): SynthNode {
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

  return {
    output: gain,
    dispose: () => {
      loop.stop();
      loop.dispose();
      synth.dispose();
      distortion.dispose();
      filter.dispose();
      gain.dispose();
    },
  };
}

function createCrystalCactusSynth(): SynthNode {
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

  return {
    output: gain,
    dispose: () => {
      loop.stop();
      loop.dispose();
      synth.dispose();
      reverb.dispose();
      gain.dispose();
    },
  };
}

function createChirpCloverSynth(): SynthNode {
  const synth = new Tone.FMSynth({
    harmonicity: 8,
    modulationIndex: 2,
    envelope: { attack: 0.001, decay: 0.3, sustain: 0, release: 0.3 },
    modulation: { type: "square" },
    modulationEnvelope: { attack: 0.001, decay: 0.2, sustain: 0, release: 0.2 },
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

  return {
    output: gain,
    dispose: () => {
      loop.stop();
      loop.dispose();
      synth.dispose();
      gain.dispose();
    },
  };
}

function createTwangBambooSynth(): SynthNode {
  const synth = new Tone.FMSynth({
    harmonicity: 4,
    modulationIndex: 3,
    envelope: { attack: 0.001, decay: 0.4, sustain: 0, release: 0.3 },
    modulation: { type: "triangle" },
    modulationEnvelope: { attack: 0.001, decay: 0.3, sustain: 0, release: 0.3 },
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

  return {
    output: gain,
    dispose: () => {
      loop.stop();
      loop.dispose();
      synth.dispose();
      gain.dispose();
    },
  };
}

function createFrostOrchidSynth(): SynthNode {
  const synth = new Tone.Synth({
    oscillator: { type: "sine" },
    envelope: { attack: 0.01, decay: 1.5, sustain: 0, release: 2 },
    volume: -20,
  });
  const delay = new Tone.FeedbackDelay({
    delayTime: "8n.",
    feedback: 0.3,
    wet: 0.4,
  });
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

  return {
    output: gain,
    dispose: () => {
      loop.stop();
      loop.dispose();
      synth.dispose();
      delay.dispose();
      reverb.dispose();
      gain.dispose();
    },
  };
}

function createSparkDaisySynth(): SynthNode {
  const synth = new Tone.MetalSynth({
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

  return {
    output: gain,
    dispose: () => {
      loop.stop();
      loop.dispose();
      synth.dispose();
      gain.dispose();
    },
  };
}

function createGrooveRootSynth(): SynthNode {
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

  return {
    output: gain,
    dispose: () => {
      loop.stop();
      loop.dispose();
      synth.dispose();
      filter.dispose();
      gain.dispose();
    },
  };
}

function createBubbleKelpSynth(): SynthNode {
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

  return {
    output: gain,
    dispose: () => {
      loop.stop();
      loop.dispose();
      synth.dispose();
      gain.dispose();
    },
  };
}

function createSmokyJasmineSynth(): SynthNode {
  const synth = new Tone.PolySynth(Tone.FMSynth, {
    harmonicity: 3,
    modulationIndex: 0.8,
    envelope: { attack: 0.08, decay: 1.2, sustain: 0.3, release: 2 },
    volume: -12,
  });
  synth.maxPolyphony = 8;
  const filter = new Tone.Filter({ frequency: 2800, type: "lowpass" });
  const chorus = new Tone.Chorus({ frequency: 0.8, depth: 0.4, wet: 0.3 }).start();
  const reverb = new Tone.Reverb({ decay: 3.5, wet: 0.35 });
  const gain = new Tone.Gain(0.35);
  synth.connect(filter);
  filter.connect(chorus);
  chorus.connect(reverb);
  reverb.connect(gain);

  const chords: string[][] = [
    ["E3", "A3", "C4", "F4"],
    ["F3", "A3", "B3", "E4"],
    ["E3", "G3", "B3", "D4"],
    ["E3", "A3", "C4", "Eb4"],
  ];
  let chordIndex = 0;

  const loop = new Tone.Loop((time) => {
    synth.releaseAll(time);
    const chord = chords[chordIndex % chords.length];
    chord.forEach((note, i) => {
      synth.triggerAttackRelease(note, "2n", time + i * 0.015);
    });
    chordIndex++;
  }, "1m");
  loop.start(0);

  return {
    output: gain,
    dispose: () => {
      loop.stop();
      loop.dispose();
      synth.releaseAll();
      synth.dispose();
      filter.dispose();
      chorus.dispose();
      reverb.dispose();
      gain.dispose();
    },
  };
}

function createStrollMangroveSynth(): SynthNode {
  const synth = new Tone.Synth({
    oscillator: { type: "triangle" },
    envelope: { attack: 0.02, decay: 0.5, sustain: 0.2, release: 0.4 },
    volume: -10,
  });
  const filter = new Tone.Filter({ frequency: 600, type: "lowpass", rolloff: -24 });
  const reverb = new Tone.Reverb({ decay: 1.5, wet: 0.15 });
  const gain = new Tone.Gain(0.35);
  synth.connect(filter);
  filter.connect(reverb);
  reverb.connect(gain);

  const walkingLine = [
    "D2", "F2", "A2", "Db2",
    "G2", "B2", "D3", "Ab2",
    "C2", "E2", "G2", "B1",
    "F2", "A2", "C3", "Eb2",
  ];
  let noteIndex = 0;

  const loop = new Tone.Loop((time) => {
    const note = walkingLine[noteIndex % walkingLine.length];
    const swing = noteIndex % 2 === 1 ? 0.04 : 0;
    synth.triggerAttackRelease(note, "8n", time + swing);
    noteIndex++;
  }, "4n");
  loop.start(0);

  return {
    output: gain,
    dispose: () => {
      loop.stop();
      loop.dispose();
      synth.dispose();
      filter.dispose();
      reverb.dispose();
      gain.dispose();
    },
  };
}

function createBrushThistleSynth(): SynthNode {
  const brushNoise = new Tone.Noise("pink");
  const brushFilter = new Tone.AutoFilter({
    frequency: "2n",
    baseFrequency: 600,
    octaves: 3,
  }).start();
  const brushGain = new Tone.Gain(0.12);
  brushNoise.connect(brushFilter);
  brushFilter.connect(brushGain);
  brushNoise.start();

  const ride = new Tone.MetalSynth({
    envelope: { attack: 0.001, decay: 0.3, release: 0.15 },
    harmonicity: 5.1,
    resonance: 4500,
    octaves: 0.5,
    volume: -22,
  });
  const rideHpf = new Tone.Filter({ frequency: 8000, type: "highpass" });
  const rideGain = new Tone.Gain(0.22);
  ride.connect(rideHpf);
  rideHpf.connect(rideGain);

  const ghost = new Tone.NoiseSynth({
    noise: { type: "white" },
    envelope: { attack: 0.001, decay: 0.08, sustain: 0, release: 0.05 },
    volume: -14,
  });
  const ghostGain = new Tone.Gain(0.16);
  ghost.connect(ghostGain);

  const reverb = new Tone.Reverb({ decay: 2, wet: 0.25 });
  const masterGain = new Tone.Gain(0.35);
  brushGain.connect(reverb);
  rideGain.connect(reverb);
  ghostGain.connect(reverb);
  reverb.connect(masterGain);

  let step = 0;
  const loop = new Tone.Loop((time) => {
    const beat = step % 8;
    if (beat === 2 || beat === 6) {
      ride.triggerAttackRelease("16n", time);
    }
    if (beat % 2 === 1 && Math.random() < 0.25) {
      ghost.triggerAttackRelease("32n", time);
    }
    step++;
  }, "8n");
  loop.start(0);

  return {
    output: masterGain,
    dispose: () => {
      loop.stop();
      loop.dispose();
      brushNoise.stop();
      brushNoise.dispose();
      brushFilter.dispose();
      brushGain.dispose();
      ride.dispose();
      rideHpf.dispose();
      rideGain.dispose();
      ghost.dispose();
      ghostGain.dispose();
      reverb.dispose();
      masterGain.dispose();
    },
  };
}

function createCroonMagnoliaSynth(): SynthNode {
  const synth = new Tone.Synth({
    oscillator: { type: "sawtooth" },
    envelope: { attack: 0.15, decay: 0.6, sustain: 0.4, release: 1.2 },
    volume: -18,
  });
  const muteFilter = new Tone.Filter({ frequency: 1200, type: "lowpass", Q: 2 });
  const vibrato = new Tone.Vibrato({ frequency: 5, depth: 0.15 });
  const delay = new Tone.FeedbackDelay({ delayTime: "8n.", feedback: 0.2, wet: 0.25 });
  const reverb = new Tone.Reverb({ decay: 3, wet: 0.3 });
  const gain = new Tone.Gain(0.35);
  synth.connect(muteFilter);
  muteFilter.connect(vibrato);
  vibrato.connect(delay);
  delay.connect(reverb);
  reverb.connect(gain);

  const melody: (string | null)[] = [
    "D4", "F4", "A4", null,
    "B3", "D4", "F4", "Ab4",
    "G4", "E4", "Eb4", "C4",
    "A3", "C4", "E4", null,
  ];
  let noteIndex = 0;

  const loop = new Tone.Loop((time) => {
    const note = melody[noteIndex % melody.length];
    if (note) {
      synth.triggerAttackRelease(note, "4n", time);
    }
    noteIndex++;
  }, "4n");
  loop.start(0);

  return {
    output: gain,
    dispose: () => {
      loop.stop();
      loop.dispose();
      synth.dispose();
      muteFilter.dispose();
      vibrato.dispose();
      delay.dispose();
      reverb.dispose();
      gain.dispose();
    },
  };
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
  [PlantType.SmokyJasmine]: {
    mode: "synth",
    createNode: createSmokyJasmineSynth,
  },
  [PlantType.StrollMangrove]: {
    mode: "synth",
    createNode: createStrollMangroveSynth,
  },
  [PlantType.BrushThistle]: {
    mode: "synth",
    createNode: createBrushThistleSynth,
  },
  [PlantType.CroonMagnolia]: {
    mode: "synth",
    createNode: createCroonMagnoliaSynth,
  },
};
