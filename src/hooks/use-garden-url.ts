"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { hasSavedGarden, loadFromLocalStorage, saveToLocalStorage } from "@/lib/garden-persistence";
import { deserialize, deserializeCompact, serialize, serializeCompact } from "@/lib/garden-serializer";
import { useGardenStore } from "@/stores/garden-store";

function syncUrlToState(plants: { plantType: string; x: number; y: number }[]) {
  const encoded = serializeCompact(plants as Parameters<typeof serializeCompact>[0]);
  const url = new URL(window.location.href);
  url.searchParams.delete("garden");
  if (encoded) {
    url.searchParams.set("g", encoded);
  } else {
    url.searchParams.delete("g");
  }
  window.history.replaceState({}, "", url.toString());
}

export function useGardenUrl() {
  const hasRestored = useRef(false);
  const savedHashRef = useRef<string>("");
  const [isViewingShared, setIsViewingShared] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);

  // 1. Initial restoration: URL-first, localStorage as fallback
  useEffect(() => {
    if (hasRestored.current) return;
    hasRestored.current = true;

    const params = new URLSearchParams(window.location.search);
    const compactParam = params.get("g");
    const legacyParam = params.get("garden");

    if (compactParam || legacyParam) {
      const plants = compactParam
        ? deserializeCompact(compactParam)
        : deserialize(legacyParam!);
      if (plants.length > 0) {
        const store = useGardenStore.getState();
        store.clearAll();
        for (const plant of plants) {
          store.addPlant(plant.plantType, plant.x, plant.y);
        }
        setIsViewingShared(true);
      }
    } else {
      const saved = loadFromLocalStorage();
      if (saved.plants && saved.plants.length > 0) {
        const store = useGardenStore.getState();
        for (const plant of saved.plants) {
          store.addPlant(plant.plantType, plant.x, plant.y);
        }
      }
      if (saved.masterVolume !== undefined) {
        useGardenStore.getState().setMasterVolume(saved.masterVolume);
      }
      savedHashRef.current = serialize(useGardenStore.getState().plants);
    }

    setHasSaved(hasSavedGarden());
  }, []);

  // 2. Track unsaved changes by comparing serialized plant state
  useEffect(() => {
    const unsubscribe = useGardenStore.subscribe((state, prevState) => {
      if (state.plants === prevState.plants) return;
      const currentHash = serialize(state.plants);
      setHasUnsavedChanges(currentHash !== savedHashRef.current);
    });
    return unsubscribe;
  }, []);

  // 3. Real-time URL sync: update URL whenever plants change
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const unsubscribe = useGardenStore.subscribe((state, prevState) => {
      if (state.plants === prevState.plants) return;
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => syncUrlToState(state.plants), 300);
    });

    syncUrlToState(useGardenStore.getState().plants);

    return () => {
      clearTimeout(timeoutId);
      unsubscribe();
    };
  }, []);

  const generateShareUrl = useCallback((): string => {
    const plants = useGardenStore.getState().plants;
    const encoded = serializeCompact(plants);
    const url = new URL(window.location.origin + window.location.pathname);
    if (encoded) {
      url.searchParams.set("g", encoded);
    }
    return url.toString();
  }, []);

  const saveMyGarden = useCallback(() => {
    const { plants, masterVolume } = useGardenStore.getState();
    saveToLocalStorage({ plants, masterVolume });
    savedHashRef.current = serialize(plants);
    setHasUnsavedChanges(false);
    setIsViewingShared(false);
    setHasSaved(true);
  }, []);

  const loadMyGarden = useCallback(() => {
    const saved = loadFromLocalStorage();
    const store = useGardenStore.getState();
    store.clearAll();
    if (saved.plants) {
      for (const plant of saved.plants) {
        store.addPlant(plant.plantType, plant.x, plant.y);
      }
    }
    if (saved.masterVolume !== undefined) {
      store.setMasterVolume(saved.masterVolume);
    }
    savedHashRef.current = serialize(useGardenStore.getState().plants);
    setIsViewingShared(false);
    setHasUnsavedChanges(false);
  }, []);

  return {
    generateShareUrl,
    isViewingShared,
    hasUnsavedChanges,
    hasSaved,
    saveMyGarden,
    loadMyGarden,
  };
}
