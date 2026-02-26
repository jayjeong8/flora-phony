"use client";

import { ChevronDown } from "lucide-react";
import { useGardenPlants } from "@/hooks/use-garden";

export function OnboardingHint() {
  const plants = useGardenPlants();

  if (plants.length > 0) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center gap-3">
      <div className="rounded-2xl border border-flora-border bg-white/90 px-8 py-6 text-center shadow-lg backdrop-blur-sm">
        <p className="font-display text-lg font-semibold text-flora-green">Your garden is empty</p>
        <p className="mt-2 text-sm text-flora-text-muted">
          Pick a plant from the bar below, then tap anywhere on the canvas to place it.
        </p>
      </div>
      <ChevronDown className="h-6 w-6 animate-bounce text-flora-terra" />
    </div>
  );
}
