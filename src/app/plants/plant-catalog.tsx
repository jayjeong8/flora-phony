"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PLANT_LIST } from "@/data/plant-registry";
import { cn } from "@/lib/utils";
import { PlantCategory, type PlantDefinition } from "@/types/plant";

const CATEGORY_LABELS: Record<string, string> = {
  all: "All",
  [PlantCategory.Ambient]: "Ambient",
  [PlantCategory.Melodic]: "Melodic",
  [PlantCategory.Rhythmic]: "Rhythmic",
  [PlantCategory.Pads]: "Pads",
};

function PlantCard({ plant }: { plant: PlantDefinition }) {
  return (
    <div className="group rounded-2xl border border-flora-border bg-white/80 p-4 shadow-sm backdrop-blur-sm transition-shadow hover:shadow-md">
      <div className="mb-3 flex items-center justify-center">
        <Image
          src={plant.svgPath}
          alt={plant.name}
          width={80}
          height={100}
          className="h-[100px] w-[80px] transition-transform group-hover:scale-105"
        />
      </div>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-display text-sm font-bold text-flora-text">{plant.name}</h3>
          <span className="text-xs text-flora-text-muted">{plant.label}</span>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <span
            className="inline-block h-3 w-3 rounded-full border border-flora-border"
            style={{ backgroundColor: plant.color }}
          />
          <span className="rounded-md bg-flora-bg-subtle px-1.5 py-0.5 text-[10px] font-medium capitalize text-flora-text-muted">
            {plant.category}
          </span>
        </div>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-flora-text-muted">{plant.description}</p>
    </div>
  );
}

export function PlantCatalog() {
  const [activeFilter, setActiveFilter] = useState<string>("all");

  useEffect(() => {
    document.documentElement.style.overflow = "auto";
    document.body.style.overflow = "auto";
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, []);

  const filteredPlants: PlantDefinition[] =
    activeFilter === "all" ? PLANT_LIST : PLANT_LIST.filter((p) => p.category === activeFilter);

  return (
    <div className="min-h-screen bg-flora-bg">
      {/* Header */}
      <header className="border-b border-flora-border bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="font-display text-xl font-bold text-flora-green">
            FloraPhony
          </Link>
          <Link
            href="/"
            className="rounded-lg bg-flora-green px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-flora-green/90"
          >
            Start your garden
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-12 text-center">
        <h1 className="font-display text-3xl font-bold text-flora-green sm:text-4xl">
          The FloraPhony Plant Collection
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-sm text-flora-text-muted sm:text-base">
          20 unique sound plants across 4 categories. Each one generates its own lo-fi sound layer.
        </p>
      </section>

      {/* Category filter */}
      <div className="sticky top-0 z-10 border-b border-flora-border bg-flora-bg/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl gap-2 overflow-x-auto px-6 py-3 scrollbar-hide">
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveFilter(key)}
              className={cn(
                "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                activeFilter === key
                  ? "bg-flora-green text-white"
                  : "bg-white text-flora-text-muted hover:bg-flora-bg-subtle",
              )}
            >
              {label}
              <span className="ml-1.5 text-xs opacity-70">
                {key === "all"
                  ? PLANT_LIST.length
                  : PLANT_LIST.filter((p) => p.category === key).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Plant grid */}
      <div className="mx-auto max-w-5xl px-6 py-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {filteredPlants.map((plant) => (
            <PlantCard key={plant.id} plant={plant} />
          ))}
        </div>
      </div>

      {/* CTA */}
      <section className="border-t border-flora-border py-12 text-center">
        <p className="font-display text-lg font-semibold text-flora-green">
          Ready to grow your soundscape?
        </p>
        <Link
          href="/"
          className="mt-4 inline-block rounded-xl bg-flora-green px-8 py-3 font-medium text-white transition-colors hover:bg-flora-green/90"
        >
          Start your garden &rarr;
        </Link>
      </section>
    </div>
  );
}
