import type { PlantInstance } from "@/types/garden";
import { PlantType } from "@/types/plant";

const STORAGE_KEY = "flora-phony-garden";

const VALID_PLANT_TYPES = new Set<string>(Object.values(PlantType));

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

function validatePersistedState(persisted: unknown): {
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

export function saveToLocalStorage(data: { plants: PlantInstance[]; masterVolume: number }): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // localStorage might be full or unavailable
  }
}

export function loadFromLocalStorage(): { plants?: PlantInstance[]; masterVolume?: number } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    // Support both old format (wrapped in { state: ... }) and new format
    const state = parsed?.state ?? parsed;
    return validatePersistedState(state);
  } catch {
    return {};
  }
}

export function hasSavedGarden(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const loaded = loadFromLocalStorage();
    return (loaded.plants?.length ?? 0) > 0;
  } catch {
    return false;
  }
}
