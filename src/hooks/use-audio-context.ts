"use client";

import { useCallback } from "react";
import { create } from "zustand";
import { audioContextManager } from "@/lib/audio/audio-context";

const useAudioStore = create<{ isAudioReady: boolean }>(() => ({
  isAudioReady: false,
}));

export function useAudioContext() {
  const isAudioReady = useAudioStore((s) => s.isAudioReady);

  const startAudio = useCallback(async () => {
    try {
      await audioContextManager.start();
      useAudioStore.setState({ isAudioReady: true });
    } catch (error) {
      console.error("Failed to start audio context:", error);
    }
  }, []);

  return { isAudioReady, startAudio };
}
