"use client";

import type Konva from "konva";
import type React from "react";
import { useCallback, useRef } from "react";
import { Layer, Stage } from "react-konva";
import { GardenBackground } from "@/components/canvas/garden-background";
import { OnboardingHint } from "@/components/canvas/onboarding-hint";
import { useCanvasSize } from "@/hooks/use-canvas-size";
import { useGardenActions, useSelectedPlantType } from "@/hooks/use-garden";

interface GardenCanvasProps {
  renderPlants?: (size: { width: number; height: number }) => React.ReactNode;
  snapshotRef?: React.RefObject<HTMLDivElement | null>;
}

export function GardenCanvas({ renderPlants, snapshotRef }: GardenCanvasProps) {
  const { containerRef, size } = useCanvasSize();
  const stageRef = useRef<Konva.Stage>(null);
  const selectedPlantType = useSelectedPlantType();
  const { addPlant, selectPlant } = useGardenActions();

  const mergedRef = useCallback(
    (node: HTMLDivElement | null) => {
      (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      if (snapshotRef && "current" in snapshotRef) {
        (snapshotRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }
    },
    [containerRef, snapshotRef],
  );

  const handleStageClick = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
      if (!selectedPlantType) return;

      const stage = e.target.getStage();
      if (!stage) return;

      // Only handle clicks on the stage background (not on plants)
      if (e.target !== stage) return;

      const pos = stage.getPointerPosition();
      if (!pos) return;

      const xPercent = (pos.x / size.width) * 100;
      const yPercent = (pos.y / size.height) * 100;

      addPlant(selectedPlantType, xPercent, yPercent);
      selectPlant(null);
    },
    [selectedPlantType, size.width, size.height, addPlant, selectPlant],
  );

  return (
    <div ref={mergedRef} className="relative h-full w-full bg-flora-bg">
      <GardenBackground />
      <OnboardingHint />
      <div className="absolute inset-0 z-10">
        {size.width > 0 && size.height > 0 && (
          <Stage
            ref={stageRef}
            width={size.width}
            height={size.height}
            onClick={handleStageClick}
            onTap={handleStageClick}
            className={selectedPlantType ? "cursor-crosshair" : "cursor-default"}
          >
            <Layer>{renderPlants?.(size)}</Layer>
          </Stage>
        )}
      </div>
    </div>
  );
}

export type { Konva };
