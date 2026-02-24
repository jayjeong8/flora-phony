"use client";

import type Konva from "konva";
import { useEffect, useRef, useState } from "react";
import { Circle, Group, Image as KonvaImage, Line } from "react-konva";
import { PLANT_REGISTRY } from "@/data/plant-registry";
import type { PlantInstance } from "@/types/garden";

const SPRITE_WIDTH = 32;
const SPRITE_HEIGHT = 40;

function usePlantImage(svgPath: string) {
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new window.Image();
    img.src = svgPath;
    img.onload = () => setImage(img);
    return () => {
      img.onload = null;
    };
  }, [svgPath]);

  return image;
}

interface PlantSpriteProps {
  plant: PlantInstance;
  x: number;
  y: number;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
  onDragEnd: (id: string, xPercent: number, yPercent: number) => void;
  canvasWidth: number;
  canvasHeight: number;
}

export function PlantSprite({
  plant,
  x,
  y,
  isSelected,
  onSelect,
  onRemove,
  onDragEnd,
  canvasWidth,
  canvasHeight,
}: PlantSpriteProps) {
  const groupRef = useRef<Konva.Group>(null);
  const [scale, setScale] = useState(0);
  const definition = PLANT_REGISTRY[plant.plantType];
  const plantImage = usePlantImage(definition.svgPath);

  // Planting bounce animation
  useEffect(() => {
    if (!groupRef.current) return;

    // Animate scale from 0 to 1 with bounce
    let frame: number;
    const startTime = performance.now();
    const duration = 400;

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out bounce
      const t = 1 - (1 - progress) ** 3;
      const bounceScale = t > 0.8 ? 1 : t * 1.15;
      setScale(Math.min(bounceScale, 1));

      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    const node = e.target;
    const newXPercent = (node.x() / canvasWidth) * 100;
    const newYPercent = (node.y() / canvasHeight) * 100;

    // Check if dragged outside canvas
    if (newXPercent < -5 || newXPercent > 105 || newYPercent < -5 || newYPercent > 105) {
      // Remove plant (dragged outside)
      onDragEnd(plant.id, -1, -1);
      return;
    }

    onDragEnd(
      plant.id,
      Math.max(0, Math.min(100, newXPercent)),
      Math.max(0, Math.min(100, newYPercent)),
    );
  };

  return (
    <Group
      ref={groupRef}
      x={x}
      y={y}
      draggable
      scaleX={scale}
      scaleY={scale}
      onDragEnd={handleDragEnd}
      onClick={() => onSelect(plant.id)}
      onTap={() => onSelect(plant.id)}
      offsetX={0}
      offsetY={0}
    >
      {/* Selection ring */}
      {isSelected && (
        <Circle
          radius={Math.max(SPRITE_WIDTH, SPRITE_HEIGHT) / 2 + 6}
          stroke="#6B8E23"
          strokeWidth={2}
          dash={[4, 4]}
        />
      )}

      {/* Delete button */}
      {isSelected && (
        <Group
          x={SPRITE_WIDTH / 2 + 2}
          y={-(SPRITE_HEIGHT / 2 + 2)}
          onClick={(e) => {
            e.cancelBubble = true;
            onRemove(plant.id);
          }}
          onTap={(e) => {
            e.cancelBubble = true;
            onRemove(plant.id);
          }}
          onMouseDown={(e) => {
            e.cancelBubble = true;
          }}
          onTouchStart={(e) => {
            e.cancelBubble = true;
          }}
        >
          <Circle radius={8} fill="#e74c3c" stroke="white" strokeWidth={1.5} />
          <Line points={[-3, -3, 3, 3]} stroke="white" strokeWidth={1.5} lineCap="round" />
          <Line points={[3, -3, -3, 3]} stroke="white" strokeWidth={1.5} lineCap="round" />
        </Group>
      )}

      {/* Plant SVG image */}
      {plantImage && (
        <KonvaImage
          image={plantImage}
          width={SPRITE_WIDTH}
          height={SPRITE_HEIGHT}
          offsetX={SPRITE_WIDTH / 2}
          offsetY={SPRITE_HEIGHT / 2}
        />
      )}
    </Group>
  );
}
