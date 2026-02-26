"use client";

import { useEffect, useRef } from "react";
import { useGardenStore } from "@/stores/garden-store";
import { selectPanValue } from "@/stores/selectors";
import type { PlantInstance } from "@/types/garden";
import { PlantType } from "@/types/plant";

type PlantSoundManagerType = import("@/lib/audio/plant-sound-manager").PlantSoundManager;

function averagePanForType(plants: PlantInstance[], type: PlantType): number {
  const ofType = plants.filter((p) => p.plantType === type);
  if (ofType.length === 0) return 0;
  const avgX = ofType.reduce((sum, p) => sum + p.x, 0) / ofType.length;
  return selectPanValue(avgX);
}

export function useAudioSync(isAudioReady: boolean) {
  const managerRef = useRef<PlantSoundManagerType | null>(null);

  useEffect(() => {
    if (!isAudioReady) return;

    let cancelled = false;
    let unsubscribe: (() => void) | null = null;

    import("@/lib/audio/plant-sound-manager").then(({ PlantSoundManager }) => {
      if (cancelled) return;

      const manager = new PlantSoundManager();
      managerRef.current = manager;

      const initialState = useGardenStore.getState();
      manager.setMasterVolume(initialState.masterVolume);

      // Play sounds for plants that already exist when audio starts
      for (const plant of initialState.plants) {
        const pan = selectPanValue(plant.x);
        manager.addPlantSound(plant.plantType, pan);
      }

      unsubscribe = useGardenStore.subscribe((state, prevState) => {
        if (state.masterVolume !== prevState.masterVolume) {
          manager.setMasterVolume(state.masterVolume);
        }

        const prevIds = new Set(prevState.plants.map((p) => p.id));
        const currIds = new Set(state.plants.map((p) => p.id));

        for (const plant of state.plants) {
          if (!prevIds.has(plant.id)) {
            const pan = selectPanValue(plant.x);
            manager.addPlantSound(plant.plantType, pan);
          }
        }

        for (const plant of prevState.plants) {
          if (!currIds.has(plant.id)) {
            manager.removePlantSound(plant.plantType);
          }
        }

        for (const type of Object.values(PlantType)) {
          const prevPan = averagePanForType(prevState.plants, type);
          const currPan = averagePanForType(state.plants, type);
          if (prevPan !== currPan) {
            manager.updatePan(type, currPan);
          }
        }

        if (state.plants.length === 0 && prevState.plants.length > 0) {
          manager.dispose();
        }
      });
    });

    return () => {
      cancelled = true;
      unsubscribe?.();
      managerRef.current?.dispose();
      managerRef.current = null;
    };
  }, [isAudioReady]);
}
