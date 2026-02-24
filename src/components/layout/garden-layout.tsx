"use client";

import type { ReactNode } from "react";
import { SeedBar } from "./seed-bar";
import { TopBar } from "./top-bar";

interface GardenLayoutProps {
  children: ReactNode;
  onAboutClick?: () => void;
  onClearClick?: () => void;
}

export function GardenLayout({ children, onAboutClick, onClearClick }: GardenLayoutProps) {
  return (
    <div className="flex h-svh flex-col overflow-hidden bg-flora-bg">
      <TopBar onAboutClick={onAboutClick} onClearClick={onClearClick} />
      <main className="relative flex-1 overflow-hidden">{children}</main>
      <SeedBar />
    </div>
  );
}
