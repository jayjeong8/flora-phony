import { createJSONStorage, type PersistStorage, type StateStorage } from "zustand/middleware";
import type { PlantInstance } from "@/types/garden";
import { PlantType } from "@/types/plant";

const DEBOUNCE_MS = 500;

const VALID_PLANT_TYPES = new Set<string>(Object.values(PlantType));

export function createDebouncedStorage<S>(): PersistStorage<S> | undefined {
  let timer: ReturnType<typeof setTimeout> | null = null;

  const rawStorage: StateStorage = {
    getItem(name: string): string | null {
      return localStorage.getItem(name);
    },
    setItem(name: string, value: string): void {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        localStorage.setItem(name, value);
      }, DEBOUNCE_MS);
    },
    removeItem(name: string): void {
      if (timer) clearTimeout(timer);
      localStorage.removeItem(name);
    },
  };

  return createJSONStorage<S>(() => rawStorage);
}

function isValidPlant(p: unknown): p is PlantInstance {
  if (typeof p !== "object" || p === null) return false;
  const obj = p as Record<string, unknown>;
  return (
    typeof obj.id === "string" &&
    typeof obj.plantType === "string" &&
    VALID_PLANT_TYPES.has(obj.plantType) &&
    typeof obj.x === "number" &&
    obj.x >= 0 &&
    obj.x <= 100 &&
    typeof obj.y === "number" &&
    obj.y >= 0 &&
    obj.y <= 100 &&
    typeof obj.createdAt === "number"
  );
}

export function validatePersistedState(persisted: unknown): {
  plants?: PlantInstance[];
  masterVolume?: number;
} {
  if (typeof persisted !== "object" || persisted === null) return {};

  const obj = persisted as Record<string, unknown>;
  const result: { plants?: PlantInstance[]; masterVolume?: number } = {};

  if (Array.isArray(obj.plants)) {
    result.plants = obj.plants.filter(isValidPlant);
  }

  if (typeof obj.masterVolume === "number" && obj.masterVolume >= 0 && obj.masterVolume <= 1) {
    result.masterVolume = obj.masterVolume;
  }

  return result;
}
