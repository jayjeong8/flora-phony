import type { PlantType } from "./plant";

export interface PlantInstance {
  id: string;
  plantType: PlantType;
  x: number; // 0-100 percent
  y: number; // 0-100 percent
  createdAt: number;
}

export interface GardenState {
  plants: PlantInstance[];
  selectedPlantType: PlantType | null;
  selectedPlantId: string | null;
  masterVolume: number; // 0-1
}

export interface GardenActions {
  addPlant: (plantType: PlantType, x: number, y: number) => void;
  removePlant: (id: string) => void;
  movePlant: (id: string, x: number, y: number) => void;
  clearAll: () => void;
  setSelectedPlantType: (type: PlantType | null) => void;
  selectPlant: (id: string | null) => void;
  setMasterVolume: (volume: number) => void;
}
