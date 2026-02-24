"use client";

import { Volume2, VolumeX } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useMasterVolume } from "@/hooks/use-master-volume";

export function MasterVolumeSlider() {
  const { masterVolume, setMasterVolume } = useMasterVolume();

  return (
    <div className="flex items-center gap-2">
      <VolumeX className="h-4 w-4 text-flora-text-muted" />
      <Slider
        value={[masterVolume * 100]}
        onValueChange={([value]) => setMasterVolume(value / 100)}
        min={0}
        max={100}
        step={1}
        className="w-28"
      />
      <Volume2 className="h-4 w-4 text-flora-text-muted" />
    </div>
  );
}
