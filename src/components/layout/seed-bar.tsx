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
    <div className="fixed bottom-4 left-1/2 z-40 flex max-w-3xl -translate-x-1/2 gap-2 overflow-x-auto rounded-2xl border border-flora-border bg-white/80 px-4 py-2.5 shadow-lg backdrop-blur-md scrollbar-hide">
      {PLANT_LIST.map((plant) => (
        <button
          key={plant.id}
          type="button"
          onClick={() => handleSelect(plant.id)}
          className={cn(
            "flex shrink-0 flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 transition-all",
            selectedPlantType === plant.id
              ? "bg-flora-green/10 ring-2 ring-flora-green"
              : "hover:bg-flora-bg-subtle",
          )}
          title={plant.name}
        >
          <Image
            src={plant.svgPath}
            alt={plant.name}
            width={42}
            height={52}
            className="h-[52px] w-[42px]"
          />
          <span className="text-[10px] font-medium text-flora-text-muted">{plant.label}</span>
        </button>
      ))}
    </div>
  );
}
