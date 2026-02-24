"use client";

import { useEffect, useRef } from "react";
import { PlantSoundManager } from "@/lib/audio/plant-sound-manager";
import { useGardenStore } from "@/stores/garden-store";
import { selectPanValue } from "@/stores/selectors";
import type { PlantInstance } from "@/types/garden";
import { PlantType } from "@/types/plant";

function averagePanForType(plants: PlantInstance[], type: PlantType): number {
  const ofType = plants.filter((p) => p.plantType === type);
  if (ofType.length === 0) return 0;
  const avgX = ofType.reduce((sum, p) => sum + p.x, 0) / ofType.length;
  return selectPanValue(avgX);
}

export function useAudioSync(isAudioReady: boolean) {
  const managerRef = useRef<PlantSoundManager | null>(null);

  useEffect(() => {
    if (!isAudioReady) return;

    const manager = new PlantSoundManager();
    managerRef.current = manager;

    // Set initial master volume
    const initialVolume = useGardenStore.getState().masterVolume;
    manager.setMasterVolume(initialVolume);

    const unsubscribe = useGardenStore.subscribe((state, prevState) => {
      // Handle master volume changes
      if (state.masterVolume !== prevState.masterVolume) {
        manager.setMasterVolume(state.masterVolume);
      }

      // Diff plants to find additions and removals
      const prevIds = new Set(prevState.plants.map((p) => p.id));
      const currIds = new Set(state.plants.map((p) => p.id));

      // Added plants
      for (const plant of state.plants) {
        if (!prevIds.has(plant.id)) {
          const pan = selectPanValue(plant.x);
          manager.addPlantSound(plant.plantType, pan);
        }
      }

      // Removed plants
      for (const plant of prevState.plants) {
        if (!currIds.has(plant.id)) {
          manager.removePlantSound(plant.plantType);
        }
      }

      // Moved plants — update panning
      for (const type of Object.values(PlantType)) {
        const prevPan = averagePanForType(prevState.plants, type);
        const currPan = averagePanForType(state.plants, type);
        if (prevPan !== currPan) {
          manager.updatePan(type, currPan);
        }
      }

      // Clear all
      if (state.plants.length === 0 && prevState.plants.length > 0) {
        manager.dispose();
      }
    });

    return () => {
      unsubscribe();
      manager.dispose();
      managerRef.current = null;
    };
  }, [isAudioReady]);
}
