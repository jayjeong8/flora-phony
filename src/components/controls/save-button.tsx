"use client";

import { Check, Save } from "lucide-react";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";

interface SaveButtonProps {
  hasUnsavedChanges: boolean;
  isViewingShared: boolean;
  onSave: () => void;
}

export function SaveButton({ hasUnsavedChanges, isViewingShared, onSave }: SaveButtonProps) {
  const [saved, setSaved] = useState(false);

  const handleSave = useCallback(() => {
    onSave();
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }, [onSave]);

  const showDot = hasUnsavedChanges || isViewingShared;
  const label = isViewingShared ? "Keep This" : "Save";
  const feedback = isViewingShared ? "Kept!" : "Saved!";

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleSave}
      className="relative justify-start gap-1.5"
    >
      {saved ? (
        <>
          <Check className="h-4 w-4 text-flora-green" />
          <span className="text-xs">{feedback}</span>
        </>
      ) : (
        <>
          <Save className="h-4 w-4" />
          <span className="text-xs">{label}</span>
          {showDot && (
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-flora-terra" />
          )}
        </>
      )}
    </Button>
  );
}
