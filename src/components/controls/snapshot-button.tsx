"use client";

import { toPng } from "html-to-image";
import { Camera } from "lucide-react";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";

interface SnapshotButtonProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export function SnapshotButton({ containerRef }: SnapshotButtonProps) {
  const handleSnapshot = useCallback(async () => {
    const container = containerRef.current;
    if (!container) return;

    const dataUrl = await toPng(container, {
      pixelRatio: 2,
      backgroundColor: "#f9f7f2",
      skipFonts: true,
      filter: (node) => {
        if (node instanceof HTMLLinkElement && node.href?.includes("fonts.googleapis.com")) {
          return false;
        }
        if (node instanceof HTMLElement && node.classList.contains("garden-bg-noise")) {
          return false;
        }
        return true;
      },
    });
    const link = document.createElement("a");
    link.download = `flora-phony-garden-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  }, [containerRef]);

  return (
    <Button variant="ghost" size="sm" onClick={handleSnapshot} className="gap-1.5">
      <Camera className="h-4 w-4" />
      <span className="text-xs">Snapshot</span>
    </Button>
  );
}
