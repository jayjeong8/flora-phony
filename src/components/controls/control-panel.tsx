"use client";

import { MasterVolumeSlider } from "./master-volume-slider";

export function ControlPanel() {
  return (
    <div className="fixed right-4 top-16 z-30 hidden flex-col gap-3 rounded-xl border border-flora-border bg-white/80 p-3 shadow-md backdrop-blur-md sm:flex">
      <MasterVolumeSlider />
    </div>
  );
}
