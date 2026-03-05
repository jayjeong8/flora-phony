"use client";

import type Konva from "konva";
import { MoreVertical } from "lucide-react";
import type { RefObject } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { LoadButton } from "./load-button";
import { MasterVolumeSlider } from "./master-volume-slider";
import { SaveButton } from "./save-button";
import { ShareButton } from "./share-button";
import { SnapshotButton } from "./snapshot-button";

interface MobileToolsPopoverProps {
  hasUnsavedChanges: boolean;
  isViewingShared: boolean;
  hasSaved: boolean;
  onSave: () => boolean;
  onLoad: () => boolean;
  containerRef: RefObject<HTMLDivElement | null>;
  stageRef: RefObject<Konva.Stage | null>;
}

export function MobileToolsPopover({
  hasUnsavedChanges,
  isViewingShared,
  hasSaved,
  onSave,
  onLoad,
  containerRef,
  stageRef,
}: MobileToolsPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Tools" className="sm:hidden">
          <MoreVertical className="h-5 w-5 text-flora-text-muted" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex w-auto flex-col gap-2">
        <MasterVolumeSlider />
        <div className="border-t border-flora-border" />
        <div className="flex flex-col gap-1">
          <SaveButton
            hasUnsavedChanges={hasUnsavedChanges}
            isViewingShared={isViewingShared}
            onSave={onSave}
          />
          {hasSaved && <LoadButton onLoad={onLoad} />}
        </div>
        <div className="border-t border-flora-border" />
        <div className="flex flex-col gap-1">
          <ShareButton />
          <SnapshotButton containerRef={containerRef} stageRef={stageRef} />
        </div>
      </PopoverContent>
    </Popover>
  );
}
