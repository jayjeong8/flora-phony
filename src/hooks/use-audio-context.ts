"use client";

import { useCallback, useState } from "react";
import { audioContextManager } from "@/lib/audio/audio-context";

export function useAudioContext() {
  const [isAudioReady, setIsAudioReady] = useState(false);

  const startAudio = useCallback(async () => {
    try {
      await audioContextManager.start();
      setIsAudioReady(true);
    } catch (error) {
      console.error("Failed to start audio context:", error);
    }
  }, []);

  return { isAudioReady, startAudio };
}
