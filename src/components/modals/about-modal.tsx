"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AboutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AboutModal({ open, onOpenChange }: AboutModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-flora-green">FloraPhony</DialogTitle>
          <DialogDescription>Plants don&apos;t just grow. They sing.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 text-sm text-flora-text-muted">
          <p>
            Drag, drop, and listen. Every sprout adds a beat, every leaf adds a melody. Build a
            living orchestra in your browser.
          </p>
          <p>
            No green thumb required. Just a soul that needs a break. Create a unique ambient mix by
            simply planting a virtual garden.
          </p>
          <div className="space-y-1 pt-2">
            <p className="font-medium text-flora-text">How to use:</p>
            <ul className="list-inside list-disc space-y-1">
              <li>Select a plant from the bottom seed bar</li>
              <li>Click on the canvas to plant it</li>
              <li>Drag plants to change their stereo position</li>
              <li>Drag plants outside the canvas to remove them</li>
            </ul>
          </div>
          <div className="space-y-1 pt-2">
            <p className="font-medium text-flora-text">Saving &amp; sharing:</p>
            <ul className="list-inside list-disc space-y-1">
              <li>
                <span className="font-medium">Save</span> keeps your garden in this browser for your
                next visit
              </li>
              <li>
                <span className="font-medium">Copy Link</span> copies the current URL &mdash; you
                can share it without saving
              </li>
              <li>Shared links open without overwriting your saved garden</li>
              <li>
                Click <span className="font-medium">Keep This</span> on a shared garden to make it
                yours
              </li>
            </ul>
          </div>
          <p className="pt-4 text-center text-xs text-flora-text-muted/50">
            &copy; 2026 FloraPhony
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
