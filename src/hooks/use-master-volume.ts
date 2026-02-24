"use client";

import { useGardenStore } from "@/stores/garden-store";

export function useMasterVolume() {
  const masterVolume = useGardenStore((state) => state.masterVolume);
  const setMasterVolume = useGardenStore((state) => state.setMasterVolume);
  return { masterVolume, setMasterVolume };
}
