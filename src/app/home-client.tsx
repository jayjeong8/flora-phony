"use client";

import type Konva from "konva";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { AudioGateModal } from "@/components/audio-gate-modal";
import { PlantSprite } from "@/components/canvas/plant-sprite";

const GardenCanvas = dynamic(
  () => import("@/components/canvas/garden-canvas").then((mod) => ({ default: mod.GardenCanvas })),
  { ssr: false },
);

import { ControlPanel } from "@/components/controls/control-panel";
import { LoadButton } from "@/components/controls/load-button";
import { MobileToolsPopover } from "@/components/controls/mobile-tools-popover";
import { SaveButton } from "@/components/controls/save-button";
import { ShareButton } from "@/components/controls/share-button";
import { SnapshotButton } from "@/components/controls/snapshot-button";
import { GardenLayout } from "@/components/layout/garden-layout";
import { AboutModal } from "@/components/modals/about-modal";
import { ClearConfirmModal } from "@/components/modals/clear-confirm-modal";
import { ConfirmModal } from "@/components/modals/confirm-modal";
import { useAudioContext } from "@/hooks/use-audio-context";
import { useAudioSync } from "@/hooks/use-audio-sync";
import { audioContextManager } from "@/lib/audio/audio-context";
import { useGardenActions, useGardenPlants, useSelectedPlantId } from "@/hooks/use-garden";
import { useGardenUrl } from "@/hooks/use-garden-url";

export default function HomeClient() {
  const { isAudioReady } = useAudioContext();
  const [aboutOpen, setAboutOpen] = useState(false);
  const [clearConfirmOpen, setClearConfirmOpen] = useState(false);
  const [saveConfirmOpen, setSaveConfirmOpen] = useState(false);
  const [loadConfirmOpen, setLoadConfirmOpen] = useState(false);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);

  // Initialize URL restoration & persistence
  const { isViewingShared, hasUnsavedChanges, hasSaved, saveMyGarden, loadMyGarden } =
    useGardenUrl();

  // Mute audio when page is hidden (tab switch / app background),
  // unmute + resume AudioContext when visible again.
  useEffect(() => {
    if (!isAudioReady) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        audioContextManager.resume();
      } else {
        audioContextManager.suspend();
      }
    };

    // iOS requires a real user gesture to resume an "interrupted"
    // AudioContext after backgrounding. We listen on touchstart,
    // touchend, and click to cover all browsers.
    const handleGesture = () => audioContextManager.handleUserGesture();

    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("touchstart", handleGesture, true);
    document.addEventListener("touchend", handleGesture, true);
    document.addEventListener("click", handleGesture, true);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("touchstart", handleGesture, true);
      document.removeEventListener("touchend", handleGesture, true);
      document.removeEventListener("click", handleGesture, true);
    };
  }, [isAudioReady]);

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

  const handleSaveClick = useCallback((): boolean => {
    if (hasSaved) {
      setSaveConfirmOpen(true);
      return false;
    }
    saveMyGarden();
    return true;
  }, [hasSaved, saveMyGarden]);

  const handleSaveConfirm = useCallback(() => {
    saveMyGarden();
  }, [saveMyGarden]);

  const handleLoadClick = useCallback((): boolean => {
    if (hasUnsavedChanges || isViewingShared) {
      setLoadConfirmOpen(true);
      return false;
    }
    loadMyGarden();
    return true;
  }, [hasUnsavedChanges, isViewingShared, loadMyGarden]);

  const handleLoadConfirm = useCallback(() => {
    loadMyGarden();
  }, [loadMyGarden]);

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
        mobileActions={
          <MobileToolsPopover
            hasUnsavedChanges={hasUnsavedChanges}
            isViewingShared={isViewingShared}
            hasSaved={hasSaved}
            onSave={handleSaveClick}
            onLoad={handleLoadClick}
            containerRef={canvasContainerRef}
            stageRef={stageRef}
          />
        }
      >
        <GardenCanvas
          snapshotRef={canvasContainerRef}
          stageRef={stageRef}
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

        <div className="fixed right-4 top-32 z-30 hidden flex-col gap-1 rounded-xl border border-flora-border bg-white/80 p-2 shadow-md backdrop-blur-md sm:flex">
          <SaveButton
            hasUnsavedChanges={hasUnsavedChanges}
            isViewingShared={isViewingShared}
            onSave={handleSaveClick}
          />
          {hasSaved && <LoadButton onLoad={handleLoadClick} />}
          <div className="mx-1 border-t border-flora-border" />
          <ShareButton />
          <SnapshotButton containerRef={canvasContainerRef} stageRef={stageRef} />
        </div>
      </GardenLayout>

      <AboutModal open={aboutOpen} onOpenChange={setAboutOpen} />
      <ClearConfirmModal
        open={clearConfirmOpen}
        onOpenChange={setClearConfirmOpen}
        onConfirm={handleClearConfirm}
      />
      <ConfirmModal
        open={saveConfirmOpen}
        onOpenChange={setSaveConfirmOpen}
        onConfirm={handleSaveConfirm}
        title="Overwrite Saved Garden"
        description="Your previously saved garden will be replaced with the current one."
        confirmLabel="Save"
      />
      <ConfirmModal
        open={loadConfirmOpen}
        onOpenChange={setLoadConfirmOpen}
        onConfirm={handleLoadConfirm}
        title="Load Saved Garden"
        description="Your current unsaved garden will be lost. Load your previously saved garden?"
        confirmLabel="Load"
      />
    </div>
  );
}
