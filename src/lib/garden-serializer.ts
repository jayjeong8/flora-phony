import type { PlantInstance } from "@/types/garden";
import { PlantType } from "@/types/plant";

const PLANT_TYPE_TO_ID: Record<PlantType, number> = {
  [PlantType.RainReed]: 0,
  [PlantType.LofiFern]: 1,
  [PlantType.PulseMoss]: 2,
  [PlantType.BellFlower]: 3,
  [PlantType.WindWood]: 4,
  [PlantType.HazeLily]: 5,
  [PlantType.RustleIvy]: 6,
  [PlantType.TideSeaweed]: 7,
  [PlantType.ShimmerSage]: 8,
  [PlantType.EchoVine]: 9,
  [PlantType.DriftWillow]: 10,
  [PlantType.HumLotus]: 11,
  [PlantType.EmberThorn]: 12,
  [PlantType.CrystalCactus]: 13,
  [PlantType.ChirpClover]: 14,
  [PlantType.TwangBamboo]: 15,
  [PlantType.FrostOrchid]: 16,
  [PlantType.SparkDaisy]: 17,
  [PlantType.GrooveRoot]: 18,
  [PlantType.BubbleKelp]: 19,
};

const ID_TO_PLANT_TYPE: Record<number, PlantType> = {
  0: PlantType.RainReed,
  1: PlantType.LofiFern,
  2: PlantType.PulseMoss,
  3: PlantType.BellFlower,
  4: PlantType.WindWood,
  5: PlantType.HazeLily,
  6: PlantType.RustleIvy,
  7: PlantType.TideSeaweed,
  8: PlantType.ShimmerSage,
  9: PlantType.EchoVine,
  10: PlantType.DriftWillow,
  11: PlantType.HumLotus,
  12: PlantType.EmberThorn,
  13: PlantType.CrystalCactus,
  14: PlantType.ChirpClover,
  15: PlantType.TwangBamboo,
  16: PlantType.FrostOrchid,
  17: PlantType.SparkDaisy,
  18: PlantType.GrooveRoot,
  19: PlantType.BubbleKelp,
};

export function serialize(plants: PlantInstance[]): string {
  return plants
    .map((p) => {
      const typeId = PLANT_TYPE_TO_ID[p.plantType];
      const x = Math.round(p.x);
      const y = Math.round(p.y);
      return `${typeId}:${x}:${y}`;
    })
    .join("|");
}

export function deserialize(encoded: string): PlantInstance[] {
  if (!encoded || encoded.trim() === "") return [];

  const plants: PlantInstance[] = [];
  const parts = encoded.split("|");

  for (const part of parts) {
    const segments = part.split(":");
    if (segments.length !== 3) continue;

    const typeId = Number.parseInt(segments[0], 10);
    const x = Number.parseInt(segments[1], 10);
    const y = Number.parseInt(segments[2], 10);

    if (Number.isNaN(typeId) || Number.isNaN(x) || Number.isNaN(y)) continue;

    const plantType = ID_TO_PLANT_TYPE[typeId];
    if (!plantType) continue;

    if (x < 0 || x > 100 || y < 0 || y > 100) continue;

    if (plants.length >= 20) break;

    plants.push({
      id: `plant-restored-${plants.length}-${Date.now()}`,
      plantType,
      x,
      y,
      createdAt: Date.now(),
    });
  }

  return plants;
}
