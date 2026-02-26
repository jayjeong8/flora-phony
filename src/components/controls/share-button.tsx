"use client";

import { Check, Link2 } from "lucide-react";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { useGardenUrl } from "@/hooks/use-garden-url";

export function ShareButton() {
  const { generateShareUrl } = useGardenUrl();
  const [copied, setCopied] = useState(false);

  const handleShare = useCallback(async () => {
    const url = generateShareUrl();
    const shareData = {
      title: "FloraPhony — My Garden Soundscape",
      text: "I grew a garden that sings. Check out my lo-fi soundscape on FloraPhony!",
      url,
    };

    if (navigator.share && navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Share this URL:", url);
    }
  }, [generateShareUrl]);

  return (
    <Button variant="ghost" size="sm" onClick={handleShare} className="justify-start gap-1.5">
      {copied ? (
        <>
          <Check className="h-4 w-4 text-flora-green" />
          <span className="text-xs">Copied!</span>
        </>
      ) : (
        <>
          <Link2 className="h-4 w-4" />
          <span className="text-xs">Share</span>
        </>
      )}
    </Button>
  );
}
