import * as Tone from "tone";
import { AUDIO_REGISTRY } from "@/data/audio-registry";
import { selectVolumeForType } from "@/stores/selectors";
import type { PlantType } from "@/types/plant";
import { audioContextManager } from "./audio-context";

interface PlantAudioNode {
  source: Tone.ToneAudioNode;
  panner: Tone.Panner;
  gain: Tone.Gain;
}

export class PlantSoundManager {
  private nodes: Map<PlantType, PlantAudioNode> = new Map();
  private counts: Map<PlantType, number> = new Map();

  addPlantSound(type: PlantType, panValue: number): void {
    const currentCount = this.counts.get(type) ?? 0;
    const newCount = currentCount + 1;
    this.counts.set(type, newCount);

    if (currentCount === 0) {
      this.createAndStartNode(type, panValue);
    }

    this.updateVolume(type, newCount);
  }

  removePlantSound(type: PlantType): void {
    const currentCount = this.counts.get(type) ?? 0;
    if (currentCount <= 0) return;

    const newCount = currentCount - 1;
    this.counts.set(type, newCount);

    if (newCount === 0) {
      this.fadeOutAndStop(type);
    } else {
      this.updateVolume(type, newCount);
    }
  }

  updatePan(type: PlantType, panValue: number): void {
    const node = this.nodes.get(type);
    if (!node) return;
    node.panner.pan.rampTo(panValue, 0.3);
  }

  updateVolume(type: PlantType, count: number): void {
    const node = this.nodes.get(type);
    if (!node) return;

    const volume = selectVolumeForType(count);
    node.gain.gain.rampTo(volume, 0.2);
  }

  setMasterVolume(value: number): void {
    audioContextManager.setMasterVolume(value);
  }

  dispose(): void {
    for (const [type] of this.nodes) {
      this.disposeNode(type);
    }
    this.nodes.clear();
    this.counts.clear();
  }

  private createAndStartNode(type: PlantType, panValue: number): void {
    const asset = AUDIO_REGISTRY[type];
    const masterOutput = audioContextManager.getMasterOutput();

    const panner = new Tone.Panner(panValue);
    const gain = new Tone.Gain(0);

    const source = asset.createNode();
    source.connect(panner);
    panner.connect(gain);
    gain.connect(masterOutput);

    this.nodes.set(type, { source, panner, gain });
  }

  private fadeOutAndStop(type: PlantType): void {
    const node = this.nodes.get(type);
    if (!node) return;

    node.gain.gain.rampTo(0, 0.5);

    setTimeout(() => {
      this.disposeNode(type);
    }, 600);
  }

  private disposeNode(type: PlantType): void {
    const node = this.nodes.get(type);
    if (!node) return;

    node.source.dispose();
    node.panner.dispose();
    node.gain.dispose();
    this.nodes.delete(type);
  }
}
