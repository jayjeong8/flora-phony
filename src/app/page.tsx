"use client";

import dynamic from "next/dynamic";
import { useCallback, useRef, useState } from "react";
import { AudioGateModal } from "@/components/audio-gate-modal";
import { PlantSprite } from "@/components/canvas/plant-sprite";

const GardenCanvas = dynamic(
  () => import("@/components/canvas/garden-canvas").then((mod) => ({ default: mod.GardenCanvas })),
  { ssr: false },
);

import { ControlPanel } from "@/components/controls/control-panel";
import { SaveButton } from "@/components/controls/save-button";
import { ShareButton } from "@/components/controls/share-button";
import { SnapshotButton } from "@/components/controls/snapshot-button";
import { GardenLayout } from "@/components/layout/garden-layout";
import { AboutModal } from "@/components/modals/about-modal";
import { ClearConfirmModal } from "@/components/modals/clear-confirm-modal";
import { useAudioContext } from "@/hooks/use-audio-context";
import { useAudioSync } from "@/hooks/use-audio-sync";
import { useGardenActions, useGardenPlants, useSelectedPlantId } from "@/hooks/use-garden";
import { useGardenUrl } from "@/hooks/use-garden-url";

export default function Home() {
  const { isAudioReady } = useAudioContext();
  const [aboutOpen, setAboutOpen] = useState(false);
  const [clearConfirmOpen, setClearConfirmOpen] = useState(false);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  // Initialize URL restoration & persistence
  const { isViewingShared, hasUnsavedChanges, hasSaved, saveMyGarden, loadMyGarden } =
    useGardenUrl();

  // Initialize audio sync
  useAudioSync(isAudioReady);

  const plants = useGardenPlants();
  const selectedPlantId = useSelectedPlantId();
  const { removePlant, movePlant, selectPlant, clearAll } = useGardenActions();

  const handlePlantRemove = useCallback(
    (id: string) => {
      removePlant(id);
    },
    [removePlant],
  );

  const handlePlantDragEnd = useCallback(
    (id: string, xPercent: number, yPercent: number) => {
      if (xPercent < 0 || yPercent < 0) {
        removePlant(id);
      } else {
        movePlant(id, xPercent, yPercent);
      }
    },
    [removePlant, movePlant],
  );

  const handlePlantSelect = useCallback(
    (id: string) => {
      selectPlant(selectedPlantId === id ? null : id);
    },
    [selectPlant, selectedPlantId],
  );

  const handleClear = useCallback(() => {
    if (plants.length === 0) return;
    setClearConfirmOpen(true);
  }, [plants.length]);

  const handleClearConfirm = useCallback(() => {
    clearAll();
  }, [clearAll]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if ((e.key === "Delete" || e.key === "Backspace") && selectedPlantId) {
        removePlant(selectedPlantId);
        selectPlant(null);
      }
    },
    [selectedPlantId, removePlant, selectPlant],
  );

  return (
    // biome-ignore lint/a11y/noNoninteractiveTabindex: canvas needs keyboard events
    // biome-ignore lint/a11y/noStaticElementInteractions: keyboard handler for plant deletion
    <div onKeyDown={handleKeyDown} tabIndex={0} className="outline-none">
      <AudioGateModal />

      <GardenLayout
        onAboutClick={() => setAboutOpen(true)}
        onClearClick={handleClear}
        isClearDisabled={plants.length === 0}
        isViewingShared={isViewingShared}
        hasSavedGarden={hasSaved}
        onBackToMyGarden={loadMyGarden}
      >
        <GardenCanvas
          snapshotRef={canvasContainerRef}
          renderPlants={(size) =>
            plants.map((plant) => (
              <PlantSprite
                key={plant.id}
                plant={plant}
                x={(plant.x / 100) * size.width}
                y={(plant.y / 100) * size.height}
                isSelected={selectedPlantId === plant.id}
                onSelect={handlePlantSelect}
                onRemove={handlePlantRemove}
                onDragEnd={handlePlantDragEnd}
                canvasWidth={size.width}
                canvasHeight={size.height}
              />
            ))
          }
        />

        <ControlPanel />

        <div className="fixed right-4 top-32 z-30 flex flex-col gap-1 rounded-xl border border-flora-border bg-white/80 p-2 shadow-md backdrop-blur-md">
          <SaveButton
            hasUnsavedChanges={hasUnsavedChanges}
            isViewingShared={isViewingShared}
            onSave={saveMyGarden}
          />
          <ShareButton />
          <SnapshotButton containerRef={canvasContainerRef} />
        </div>
      </GardenLayout>

      <AboutModal open={aboutOpen} onOpenChange={setAboutOpen} />
      <ClearConfirmModal
        open={clearConfirmOpen}
        onOpenChange={setClearConfirmOpen}
        onConfirm={handleClearConfirm}
      />
    </div>
  );
}
