import { PlantType } from "@/types/plant";

export interface PlantAnimationConfig {
  /** Rotation sway in degrees */
  rotation?: { amplitude: number; period: number };
  /** Uniform scale pulse (added to base scale 1.0) */
  scale?: { amplitude: number; period: number };
  /** Vertical float in pixels */
  float?: { amplitude: number; period: number };
  /** Horizontal sway in pixels */
  sway?: { amplitude: number; period: number };
}

export const PLANT_ANIMATIONS: Record<PlantType, PlantAnimationConfig> = {
  // --- Noise / Ambient → gentle continuous sway ---
  [PlantType.RainReed]: {
    rotation: { amplitude: 3, period: 4000 },
    float: { amplitude: 1, period: 6000 },
  },
  [PlantType.HazeLily]: {
    float: { amplitude: 2, period: 6000 },
    rotation: { amplitude: 1.5, period: 8000 },
  },
  [PlantType.RustleIvy]: {
    rotation: { amplitude: 3.5, period: 2500 },
    sway: { amplitude: 1, period: 3000 },
  },
  [PlantType.TideSeaweed]: {
    rotation: { amplitude: 4, period: 5000 },
    sway: { amplitude: 2, period: 6000 },
  },

  // --- Melodic / Pluck → bouncy, rhythmic ---
  [PlantType.LofiFern]: {
    float: { amplitude: 1.5, period: 3000 },
    rotation: { amplitude: 1.5, period: 5000 },
  },
  [PlantType.BellFlower]: {
    rotation: { amplitude: 2, period: 2000 },
    scale: { amplitude: 0.03, period: 3000 },
  },
  [PlantType.ChirpClover]: {
    float: { amplitude: 1.5, period: 1800 },
    rotation: { amplitude: 1, period: 3000 },
  },
  [PlantType.TwangBamboo]: {
    rotation: { amplitude: 3.5, period: 2000 },
    sway: { amplitude: 1, period: 2500 },
  },
  [PlantType.CrystalCactus]: {
    scale: { amplitude: 0.04, period: 1500 },
    rotation: { amplitude: 1, period: 4000 },
  },

  // --- Bass / Rhythmic → pulse / breathe ---
  [PlantType.PulseMoss]: {
    scale: { amplitude: 0.05, period: 1500 },
  },
  [PlantType.GrooveRoot]: {
    scale: { amplitude: 0.04, period: 1200 },
  },

  // --- Pad / Drone → slow, flowing ---
  [PlantType.ShimmerSage]: {
    scale: { amplitude: 0.03, period: 1200 },
    rotation: { amplitude: 1, period: 4000 },
  },
  [PlantType.EchoVine]: {
    rotation: { amplitude: 2.5, period: 3500 },
    float: { amplitude: 1.5, period: 5000 },
  },
  [PlantType.DriftWillow]: {
    float: { amplitude: 3, period: 6000 },
    rotation: { amplitude: 2, period: 8000 },
  },
  [PlantType.HumLotus]: {
    scale: { amplitude: 0.04, period: 4000 },
    float: { amplitude: 1, period: 6000 },
  },
  [PlantType.EmberThorn]: {
    scale: { amplitude: 0.03, period: 2000 },
    rotation: { amplitude: 1, period: 3000 },
  },
  [PlantType.FrostOrchid]: {
    rotation: { amplitude: 1.5, period: 3000 },
    float: { amplitude: 1, period: 5000 },
  },

  // --- Percussive / Special ---
  [PlantType.WindWood]: {
    rotation: { amplitude: 2, period: 2500 },
  },
  [PlantType.SparkDaisy]: {
    rotation: { amplitude: 2, period: 1500 },
    scale: { amplitude: 0.02, period: 2000 },
  },
  [PlantType.BubbleKelp]: {
    rotation: { amplitude: 3, period: 2500 },
    float: { amplitude: 2, period: 3500 },
  },
};
