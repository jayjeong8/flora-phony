"use client";

import type Konva from "konva";
import { Camera } from "lucide-react";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";

interface SnapshotButtonProps {
  stageRef: React.RefObject<Konva.Stage | null>;
}

export function SnapshotButton({ stageRef }: SnapshotButtonProps) {
  const handleSnapshot = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const dataUrl = stage.toDataURL({ pixelRatio: 2 });
    const link = document.createElement("a");
    link.download = `flora-phony-garden-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  }, [stageRef]);

  return (
    <Button variant="ghost" size="sm" onClick={handleSnapshot} className="gap-1.5">
      <Camera className="h-4 w-4" />
      <span className="text-xs">Snapshot</span>
    </Button>
  );
}
