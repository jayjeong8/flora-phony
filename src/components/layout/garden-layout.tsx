"use client";

import type { ReactNode } from "react";
import { SeedBar } from "./seed-bar";
import { TopBar } from "./top-bar";

interface GardenLayoutProps {
  children: ReactNode;
  onAboutClick?: () => void;
  onClearClick?: () => void;
  isClearDisabled?: boolean;
}

export function GardenLayout({ children, onAboutClick, onClearClick, isClearDisabled }: GardenLayoutProps) {
  return (
    <div className="flex h-svh flex-col overflow-hidden bg-flora-bg">
      <TopBar onAboutClick={onAboutClick} onClearClick={onClearClick} isClearDisabled={isClearDisabled} />
      <main className="relative flex-1 overflow-hidden">{children}</main>
      <SeedBar />
    </div>
  );
}
