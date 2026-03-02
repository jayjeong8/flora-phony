"use client";

import { toPng } from "html-to-image";
import type Konva from "konva";
import { Camera } from "lucide-react";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";

interface SnapshotButtonProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  stageRef: React.RefObject<Konva.Stage | null>;
}

export function SnapshotButton({ containerRef, stageRef }: SnapshotButtonProps) {
  const handleSnapshot = useCallback(async () => {
    const container = containerRef.current;
    if (!container) return;

    const stage = stageRef.current;
    const pixelRatio = 2;

    // 1. Capture the background (DOM elements), excluding the Konva stage canvas
    const bgDataUrl = await toPng(container, {
      pixelRatio,
      backgroundColor: "#f9f7f2",
      skipFonts: true,
      filter: (node) => {
        if (node instanceof HTMLLinkElement && node.href?.includes("fonts.googleapis.com")) {
          return false;
        }
        if (node instanceof HTMLElement && node.classList.contains("garden-bg-noise")) {
          return false;
        }
        // Skip the Konva stage canvas so we can composite it separately
        if (node instanceof HTMLCanvasElement) {
          return false;
        }
        return true;
      },
    });

    // 2. Capture the Konva stage (plants) using its native export
    let stageDataUrl: string | null = null;
    if (stage) {
      stageDataUrl = stage.toDataURL({ pixelRatio });
    }

    // 3. Composite both layers onto an offscreen canvas
    const width = container.offsetWidth * pixelRatio;
    const height = container.offsetHeight * pixelRatio;

    const offscreen = document.createElement("canvas");
    offscreen.width = width;
    offscreen.height = height;
    const ctx = offscreen.getContext("2d");
    if (!ctx) return;

    const drawImage = (src: string) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0, width, height);
          resolve();
        };
        img.onerror = () => resolve();
        img.src = src;
      });

    // Draw background first, then plants on top
    await drawImage(bgDataUrl);
    if (stageDataUrl) {
      await drawImage(stageDataUrl);
    }

    const finalDataUrl = offscreen.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `flora-phony-garden-${Date.now()}.png`;
    link.href = finalDataUrl;
    link.click();
  }, [containerRef, stageRef]);

  return (
    <Button variant="ghost" size="sm" onClick={handleSnapshot} className="justify-start gap-1.5">
      <Camera className="h-4 w-4" />
      <span className="text-xs">Snapshot</span>
    </Button>
  );
}
