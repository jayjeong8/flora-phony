import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createDebouncedStorage, validatePersistedState } from "@/lib/garden-persistence";
import type { GardenActions, GardenState, PlantInstance } from "@/types/garden";
import type { PlantType } from "@/types/plant";

type PersistedGardenState = Pick<GardenState, "plants" | "masterVolume">;

const MAX_PLANTS = 100;

function clampCoord(v: number): number {
  return Math.max(0, Math.min(100, v));
}

let nextId = 1;
function generateId(): string {
  return `plant-${nextId++}-${Date.now()}`;
}

export const useGardenStore = create<GardenState & GardenActions>()(
  persist(
    (set) => ({
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
            x: clampCoord(x),
            y: clampCoord(y),
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
          plants: state.plants.map((p) =>
            p.id === id ? { ...p, x: clampCoord(x), y: clampCoord(y) } : p,
          ),
        })),

      clearAll: () =>
        set({
          plants: [],
          selectedPlantId: null,
        }),

      setSelectedPlantType: (type: PlantType | null) => set({ selectedPlantType: type }),

      selectPlant: (id: string | null) => set({ selectedPlantId: id }),

      setMasterVolume: (volume: number) => set({ masterVolume: Math.max(0, Math.min(1, volume)) }),
    }),
    {
      name: "flora-phony-garden",
      storage: createDebouncedStorage(),
      partialize: (state): PersistedGardenState => ({
        plants: state.plants,
        masterVolume: state.masterVolume,
      }),
      version: 1,
      skipHydration: true,
      merge: (persisted, current) => ({
        ...current,
        ...validatePersistedState(persisted),
      }),
    },
  ),
);
