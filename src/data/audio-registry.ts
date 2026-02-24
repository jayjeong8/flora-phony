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
  [PlantType.HazeLily]: SYNTH_PLACEHOLDERS[PlantType.HazeLily],
  [PlantType.RustleIvy]: SYNTH_PLACEHOLDERS[PlantType.RustleIvy],
  [PlantType.TideSeaweed]: SYNTH_PLACEHOLDERS[PlantType.TideSeaweed],
  [PlantType.ShimmerSage]: SYNTH_PLACEHOLDERS[PlantType.ShimmerSage],
  [PlantType.EchoVine]: SYNTH_PLACEHOLDERS[PlantType.EchoVine],
  [PlantType.DriftWillow]: SYNTH_PLACEHOLDERS[PlantType.DriftWillow],
  [PlantType.HumLotus]: SYNTH_PLACEHOLDERS[PlantType.HumLotus],
  [PlantType.EmberThorn]: SYNTH_PLACEHOLDERS[PlantType.EmberThorn],
  [PlantType.CrystalCactus]: SYNTH_PLACEHOLDERS[PlantType.CrystalCactus],
  [PlantType.ChirpClover]: SYNTH_PLACEHOLDERS[PlantType.ChirpClover],
  [PlantType.TwangBamboo]: SYNTH_PLACEHOLDERS[PlantType.TwangBamboo],
  [PlantType.FrostOrchid]: SYNTH_PLACEHOLDERS[PlantType.FrostOrchid],
  [PlantType.SparkDaisy]: SYNTH_PLACEHOLDERS[PlantType.SparkDaisy],
  [PlantType.GrooveRoot]: SYNTH_PLACEHOLDERS[PlantType.GrooveRoot],
  [PlantType.BubbleKelp]: SYNTH_PLACEHOLDERS[PlantType.BubbleKelp],
};
