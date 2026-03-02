"use client";

import { Check, FolderOpen } from "lucide-react";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";

interface LoadButtonProps {
  onLoad: () => boolean;
}

export function LoadButton({ onLoad }: LoadButtonProps) {
  const [loaded, setLoaded] = useState(false);

  const handleLoad = useCallback(() => {
    const didLoad = onLoad();
    if (didLoad) {
      setLoaded(true);
      setTimeout(() => setLoaded(false), 1500);
    }
  }, [onLoad]);

  return (
    <Button variant="ghost" size="sm" onClick={handleLoad} className="justify-start gap-1.5">
      {loaded ? (
        <>
          <Check className="h-4 w-4 text-flora-green" />
          <span className="text-xs">Loaded!</span>
        </>
      ) : (
        <>
          <FolderOpen className="h-4 w-4" />
          <span className="text-xs">Load</span>
        </>
      )}
    </Button>
  );
}
