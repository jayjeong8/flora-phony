"use client";

import { Info, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TopBarProps {
  onAboutClick?: () => void;
  onClearClick?: () => void;
}

export function TopBar({ onAboutClick, onClearClick }: TopBarProps) {
  return (
    <header className="flex items-center justify-between border-b border-flora-border bg-flora-bg px-4 py-3">
      <h1 className="font-display text-xl font-bold text-flora-green">FloraPhony</h1>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={onAboutClick} aria-label="About">
          <Info className="h-5 w-5 text-flora-text-muted" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onClearClick} aria-label="Clear All">
          <Trash2 className="h-5 w-5 text-flora-text-muted" />
        </Button>
      </div>
    </header>
  );
}
