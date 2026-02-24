"use client";

import { useCallback, useEffect, useRef } from "react";
import { deserialize, serialize } from "@/lib/garden-serializer";
import { useGardenStore } from "@/stores/garden-store";

export function useGardenUrl() {
  const hasRestored = useRef(false);

  useEffect(() => {
    if (hasRestored.current) return;
    hasRestored.current = true;

    const params = new URLSearchParams(window.location.search);
    const gardenParam = params.get("garden");
    if (gardenParam) {
      const plants = deserialize(gardenParam);
      if (plants.length > 0) {
        const store = useGardenStore.getState();
        store.clearAll();
        for (const plant of plants) {
          store.addPlant(plant.plantType, plant.x, plant.y);
        }
      }
      window.history.replaceState({}, "", window.location.pathname);
    } else {
      useGardenStore.persist.rehydrate();
    }
  }, []);

  const generateShareUrl = useCallback((): string => {
    const plants = useGardenStore.getState().plants;
    const encoded = serialize(plants);
    const url = new URL(window.location.origin + window.location.pathname);
    if (encoded) {
      url.searchParams.set("garden", encoded);
    }
    return url.toString();
  }, []);

  return { generateShareUrl };
}
