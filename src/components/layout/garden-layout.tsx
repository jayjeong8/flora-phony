"use client";

import type { ReactNode } from "react";
import { SeedBar } from "./seed-bar";
import { SharedGardenBanner } from "./shared-garden-banner";
import { TopBar } from "./top-bar";

interface GardenLayoutProps {
  children: ReactNode;
  onAboutClick?: () => void;
  onClearClick?: () => void;
  isClearDisabled?: boolean;
  isViewingShared?: boolean;
  hasSavedGarden?: boolean;
  onBackToMyGarden?: () => void;
  mobileActions?: ReactNode;
}

export function GardenLayout({
  children,
  onAboutClick,
  onClearClick,
  isClearDisabled,
  isViewingShared,
  hasSavedGarden,
  onBackToMyGarden,
  mobileActions,
}: GardenLayoutProps) {
  return (
    <div className="flex h-svh flex-col overflow-hidden bg-flora-bg">
      <TopBar
        onAboutClick={onAboutClick}
        onClearClick={onClearClick}
        isClearDisabled={isClearDisabled}
        mobileActions={mobileActions}
      />
      {isViewingShared && (
        <SharedGardenBanner
          hasSavedGarden={hasSavedGarden ?? false}
          onBackToMyGarden={() => onBackToMyGarden?.()}
        />
      )}
      <main className="relative flex-1 overflow-hidden">{children}</main>
      <SeedBar />
    </div>
  );
}
