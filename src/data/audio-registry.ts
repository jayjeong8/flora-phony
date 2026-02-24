import { SYNTH_PLACEHOLDERS } from "@/lib/audio/synth-placeholders";
import type { AudioAsset } from "@/types/audio";
import { PlantType } from "@/types/plant";

// Audio registry: maps plant types to audio assets.
// Currently uses synth placeholders. To switch to samples:
// 1. Change mode to 'sample'
// 2. Set sampleUrl to the audio file path (e.g., '/audio/rain-reed.ogg')
export const AUDIO_REGISTRY: Record<PlantType, AudioAsset> = {
  [PlantType.RainReed]: SYNTH_PLACEHOLDERS[PlantType.RainReed],
  [PlantType.LofiFern]: SYNTH_PLACEHOLDERS[PlantType.LofiFern],
  [PlantType.PulseMoss]: SYNTH_PLACEHOLDERS[PlantType.PulseMoss],
  [PlantType.BellFlower]: SYNTH_PLACEHOLDERS[PlantType.BellFlower],
  [PlantType.WindWood]: SYNTH_PLACEHOLDERS[PlantType.WindWood],
};
