"use client";

import Image from "next/image";
import { Fragment } from "react";
import { PLANT_CATEGORIES } from "@/data/plant-registry";
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
    <div className="fixed bottom-4 left-1/2 z-40 max-w-4xl -translate-x-1/2 rounded-2xl border border-flora-border bg-white/80 shadow-lg backdrop-blur-md">
      <div className="flex gap-1.5 overflow-x-auto overscroll-x-contain py-2.5 scrollbar-hide before:shrink-0 before:w-2 before:content-[''] after:shrink-0 after:w-2 after:content-['']">
        {PLANT_CATEGORIES.map((group, groupIndex) => (
          <Fragment key={group.category}>
            {groupIndex > 0 && (
              <div className="flex shrink-0 items-center px-0.5">
                <div className="h-10 w-px bg-flora-border" />
              </div>
            )}
            <div className="flex shrink-0 flex-col items-center justify-center px-1">
              <span className="text-[9px] font-semibold uppercase tracking-wider text-flora-text-muted/60">
                {group.label}
              </span>
            </div>
            {group.plants.map((plant) => (
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
          </Fragment>
        ))}
      </div>
    </div>
  );
}
