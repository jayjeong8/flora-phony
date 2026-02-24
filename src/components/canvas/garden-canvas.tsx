"use client";

import type Konva from "konva";
import dynamic from "next/dynamic";
import type React from "react";
import { useCallback, useRef } from "react";
import { useCanvasSize } from "@/hooks/use-canvas-size";
import { useGardenActions, useSelectedPlantType } from "@/hooks/use-garden";

const Stage = dynamic(() => import("react-konva").then((mod) => mod.Stage), { ssr: false });
const Layer = dynamic(() => import("react-konva").then((mod) => mod.Layer), { ssr: false });

interface GardenCanvasProps {
  renderPlants?: (size: { width: number; height: number }) => React.ReactNode;
}

export function GardenCanvas({ renderPlants }: GardenCanvasProps) {
  const { containerRef, size } = useCanvasSize();
  const stageRef = useRef<Konva.Stage>(null);
  const selectedPlantType = useSelectedPlantType();
  const { addPlant, selectPlant } = useGardenActions();

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
    <div ref={containerRef} className="h-full w-full">
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
  );
}

export type { Konva };
