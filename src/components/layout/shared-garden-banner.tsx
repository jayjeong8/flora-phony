"use client";

import { ArrowLeft, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SharedGardenBannerProps {
  hasSavedGarden: boolean;
  onBackToMyGarden: () => void;
}

export function SharedGardenBanner({ hasSavedGarden, onBackToMyGarden }: SharedGardenBannerProps) {
  return (
    <div className="flex items-center justify-between border-b border-flora-green/20 bg-flora-green/8 px-4 py-1.5">
      <div className="flex items-center gap-1.5 text-xs text-flora-green">
        <Eye className="h-3.5 w-3.5" />
        <span>Viewing a shared garden</span>
      </div>
      {hasSavedGarden && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onBackToMyGarden}
          className="h-6 gap-1 px-2 text-xs text-flora-green hover:text-flora-green"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to My Garden
        </Button>
      )}
    </div>
  );
}
