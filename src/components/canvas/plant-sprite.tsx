"use client";

import type Konva from "konva";
import { useEffect, useRef, useState } from "react";
import { Circle, Ellipse, Group, Image as KonvaImage, Line } from "react-konva";
import { PLANT_ANIMATIONS } from "@/data/plant-animations";
import { PLANT_REGISTRY } from "@/data/plant-registry";
import { loadPlantImage } from "@/lib/plant-image-cache";
import type { PlantInstance } from "@/types/garden";

const SPRITE_WIDTH = 48;
const SPRITE_HEIGHT = 60;
const SHADOW_RADIUS_X = SPRITE_WIDTH / 2 - 4;
const SHADOW_RADIUS_Y = 5;
const SHADOW_OFFSET_Y = SPRITE_HEIGHT / 2 + 2;

function usePlantImage(svgPath: string) {
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadPlantImage(svgPath).then((img) => {
      if (!cancelled) setImage(img);
    });
    return () => {
      cancelled = true;
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
  const animRef = useRef<Konva.Group>(null);
  const [spawnScale, setSpawnScale] = useState(0);
  const phaseRef = useRef(Math.random() * Math.PI * 2);
  const definition = PLANT_REGISTRY[plant.plantType];
  const animConfig = PLANT_ANIMATIONS[plant.plantType];
  const plantImage = usePlantImage(definition.svgPath);

  // Planting bounce animation
  useEffect(() => {
    if (!groupRef.current) return;

    let frame: number;
    const startTime = performance.now();
    const duration = 400;

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out bounce
      const t = 1 - (1 - progress) ** 3;
      const bounceScale = t > 0.8 ? 1 : t * 1.15;
      setSpawnScale(Math.min(bounceScale, 1));

      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  // Idle animation loop (runs independently on the inner group)
  useEffect(() => {
    const animGroup = animRef.current;
    if (!animGroup) return;

    const phase = phaseRef.current;
    let frame: number;

    const animate = (time: number) => {
      let rotation = 0;
      let scaleOffset = 0;
      let floatY = 0;
      let swayX = 0;

      if (animConfig.rotation) {
        rotation =
          animConfig.rotation.amplitude *
          Math.sin((time / animConfig.rotation.period) * Math.PI * 2 + phase);
      }
      if (animConfig.scale) {
        scaleOffset =
          animConfig.scale.amplitude *
          Math.sin((time / animConfig.scale.period) * Math.PI * 2 + phase);
      }
      if (animConfig.float) {
        floatY =
          animConfig.float.amplitude *
          Math.sin((time / animConfig.float.period) * Math.PI * 2 + phase * 1.3);
      }
      if (animConfig.sway) {
        swayX =
          animConfig.sway.amplitude *
          Math.sin((time / animConfig.sway.period) * Math.PI * 2 + phase * 0.7);
      }

      animGroup.rotation(rotation);
      animGroup.scaleX(1 + scaleOffset);
      animGroup.scaleY(1 + scaleOffset);
      animGroup.y(floatY);
      animGroup.x(swayX);

      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [animConfig]);

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
      scaleX={spawnScale}
      scaleY={spawnScale}
      onDragEnd={handleDragEnd}
      onClick={() => onSelect(plant.id)}
      onTap={() => onSelect(plant.id)}
      offsetX={0}
      offsetY={0}
    >
      {/* Ground shadow */}
      <Ellipse
        x={0}
        y={SHADOW_OFFSET_Y}
        radiusX={SHADOW_RADIUS_X}
        radiusY={SHADOW_RADIUS_Y}
        fill="#3a3a2a"
        opacity={0.15}
      />

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
          x={(Math.max(SPRITE_WIDTH, SPRITE_HEIGHT) / 2 + 6) * Math.SQRT1_2}
          y={-(Math.max(SPRITE_WIDTH, SPRITE_HEIGHT) / 2 + 6) * Math.SQRT1_2}
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
          <Circle radius={8} fill="#f19f5d" stroke="white" strokeWidth={1.5} />
          <Line points={[-3, -3, 3, 3]} stroke="white" strokeWidth={1.5} lineCap="round" />
          <Line points={[3, -3, -3, 3]} stroke="white" strokeWidth={1.5} lineCap="round" />
        </Group>
      )}

      {/* Animated plant image */}
      <Group ref={animRef}>
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
    </Group>
  );
}
