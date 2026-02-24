"use client";

import { useAudioContext } from "@/hooks/use-audio-context";

export function AudioGateModal() {
  const { isAudioReady, startAudio } = useAudioContext();

  if (isAudioReady) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-flora-bg/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-6 rounded-2xl border border-flora-border bg-white p-10 shadow-lg">
        <div className="font-display text-3xl font-semibold text-flora-green">FloraPhony</div>
        <p className="max-w-xs text-center text-flora-text-muted">
          Plants don&apos;t just grow. They sing.
          <br />
          Click below to enter your garden.
        </p>
        <button
          type="button"
          onClick={startAudio}
          className="rounded-full bg-flora-terra px-8 py-3 font-display text-lg font-semibold text-white transition-colors hover:bg-flora-terra/90"
        >
          Enter the Harmony
        </button>
      </div>
    </div>
  );
}
