"use client";

import Image from "next/image";
import { PLANT_LIST } from "@/data/plant-registry";
import { useSelectedPlantType, useSetSelectedPlantType } from "@/hooks/use-garden";
import { cn } from "@/lib/utils";
import type { PlantType } from "@/types/plant";

export function SeedBar() {
  const selectedPlantType = useSelectedPlantType();
  const setSelectedPlantType = useSetSelectedPlantType();

  const handleSelect = (type: PlantType) => {
    setSelectedPlantType(selectedPlantType === type ? null : type);
  };

  return (
    <div className="fixed bottom-4 left-1/2 z-40 flex -translate-x-1/2 gap-3 rounded-full border border-flora-border bg-white/80 px-6 py-3 shadow-lg backdrop-blur-md">
      {PLANT_LIST.map((plant) => (
        <button
          key={plant.id}
          type="button"
          onClick={() => handleSelect(plant.id)}
          className={cn(
            "flex flex-col items-center gap-1 rounded-xl px-3 py-2 transition-all",
            selectedPlantType === plant.id
              ? "bg-flora-green/10 ring-2 ring-flora-green"
              : "hover:bg-flora-bg-subtle",
          )}
          title={plant.name}
        >
          <Image src={plant.svgPath} alt={plant.name} width={32} height={40} className="h-10 w-8" />
          <span className="text-xs font-medium text-flora-text-muted">{plant.label}</span>
        </button>
      ))}
    </div>
  );
}
