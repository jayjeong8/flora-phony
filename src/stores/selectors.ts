import type { PlantInstance } from "@/types/garden";
import type { PlantType } from "@/types/plant";

export function selectPlantCountByType(plants: PlantInstance[], type: PlantType): number {
  return plants.filter((p) => p.plantType === type).length;
}

export function selectPanValue(x: number): number {
  // x is 0-100 percent, convert to -1 (left) to +1 (right)
  return (x / 100) * 2 - 1;
}

export function selectVolumeForType(count: number): number {
  if (count <= 0) return 0;
  // Log scale: baseVolume * log2(count + 1) / log2(6)
  const baseVolume = 0.7;
  return baseVolume * (Math.log2(count + 1) / Math.log2(6));
}
