import { create } from "zustand";
import type { GardenActions, GardenState, PlantInstance } from "@/types/garden";
import type { PlantType } from "@/types/plant";

const MAX_PLANTS = 100;

let nextId = 1;
function generateId(): string {
  return `plant-${nextId++}-${Date.now()}`;
}

export const useGardenStore = create<GardenState & GardenActions>((set) => ({
  plants: [],
  selectedPlantType: null,
  selectedPlantId: null,
  masterVolume: 0.8,

  addPlant: (plantType: PlantType, x: number, y: number) =>
    set((state) => {
      if (state.plants.length >= MAX_PLANTS) return state;
      const newPlant: PlantInstance = {
        id: generateId(),
        plantType,
        x,
        y,
        createdAt: Date.now(),
      };
      return { plants: [...state.plants, newPlant] };
    }),

  removePlant: (id: string) =>
    set((state) => ({
      plants: state.plants.filter((p) => p.id !== id),
      selectedPlantId: state.selectedPlantId === id ? null : state.selectedPlantId,
    })),

  movePlant: (id: string, x: number, y: number) =>
    set((state) => ({
      plants: state.plants.map((p) => (p.id === id ? { ...p, x, y } : p)),
    })),

  clearAll: () =>
    set({
      plants: [],
      selectedPlantId: null,
    }),

  setSelectedPlantType: (type: PlantType | null) => set({ selectedPlantType: type }),

  selectPlant: (id: string | null) => set({ selectedPlantId: id }),

  setMasterVolume: (volume: number) => set({ masterVolume: Math.max(0, Math.min(1, volume)) }),
}));
