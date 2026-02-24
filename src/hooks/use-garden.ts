"use client";

import { useGardenStore } from "@/stores/garden-store";
import { selectPlantCountByType } from "@/stores/selectors";
import { PlantType } from "@/types/plant";

export function useGardenPlants() {
  return useGardenStore((state) => state.plants);
}

export function useSelectedPlantType() {
  return useGardenStore((state) => state.selectedPlantType);
}

export function useSetSelectedPlantType() {
  return useGardenStore((state) => state.setSelectedPlantType);
}

export function useSelectedPlantId() {
  return useGardenStore((state) => state.selectedPlantId);
}

export function usePlantCounts(): Record<PlantType, number> {
  const plants = useGardenStore((state) => state.plants);
  return {
    [PlantType.RainReed]: selectPlantCountByType(plants, PlantType.RainReed),
    [PlantType.LofiFern]: selectPlantCountByType(plants, PlantType.LofiFern),
    [PlantType.PulseMoss]: selectPlantCountByType(plants, PlantType.PulseMoss),
    [PlantType.BellFlower]: selectPlantCountByType(plants, PlantType.BellFlower),
    [PlantType.WindWood]: selectPlantCountByType(plants, PlantType.WindWood),
  };
}

export function useGardenActions() {
  return {
    addPlant: useGardenStore((state) => state.addPlant),
    removePlant: useGardenStore((state) => state.removePlant),
    movePlant: useGardenStore((state) => state.movePlant),
    clearAll: useGardenStore((state) => state.clearAll),
    selectPlant: useGardenStore((state) => state.selectPlant),
    setMasterVolume: useGardenStore((state) => state.setMasterVolume),
  };
}
