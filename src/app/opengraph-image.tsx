import { ImageResponse } from "next/og";
import { PLANT_REGISTRY } from "@/data/plant-registry";
import { deserialize } from "@/lib/garden-serializer";
import { PlantType } from "@/types/plant";

export const runtime = "edge";

export const alt = "FloraPhony — Plant a garden, grow a soundscape";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://flora-phony.vercel.app";

const SAMPLE_PLANTS: { type: PlantType; x: number; y: number }[] = [
  { type: PlantType.LofiFern, x: 12, y: 50 },
  { type: PlantType.BellFlower, x: 30, y: 38 },
  { type: PlantType.RainReed, x: 48, y: 55 },
  { type: PlantType.HumLotus, x: 68, y: 42 },
  { type: PlantType.ShimmerSage, x: 22, y: 70 },
  { type: PlantType.SparkDaisy, x: 58, y: 68 },
  { type: PlantType.EchoVine, x: 82, y: 52 },
  { type: PlantType.CrystalCactus, x: 42, y: 35 },
  { type: PlantType.FrostOrchid, x: 75, y: 65 },
  { type: PlantType.EmberThorn, x: 90, y: 40 },
];

async function fetchPlantSvgDataUris(types: PlantType[]): Promise<Map<PlantType, string>> {
  const entries = await Promise.all(
    types.map(async (type) => {
      const def = PLANT_REGISTRY[type];
      if (!def) return null;
      try {
        const res = await fetch(new URL(def.svgPath, siteUrl));
        if (!res.ok) return null;
        const text = await res.text();
        const uri = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(text)}`;
        return [type, uri] as const;
      } catch {
        return null;
      }
    }),
  );
  return new Map(entries.filter((e): e is [PlantType, string] => e !== null));
}

// Canvas area within the 1200x630 image
const CANVAS = { top: 90, bottom: 580, left: 60, right: 1140 };
const PLANT_SIZE = 70;

export default async function OgImage({
  searchParams,
}: {
  searchParams: Promise<{ garden?: string }>;
}) {
  const params = await searchParams;
  const gardenParam = params.garden;
  const plants = gardenParam ? deserialize(gardenParam) : [];
  const hasGarden = plants.length > 0;

  const displayPlants = hasGarden
    ? plants.slice(0, 20).map((p) => ({ type: p.plantType, x: p.x, y: p.y }))
    : SAMPLE_PLANTS;

  const uniqueTypes = [...new Set(displayPlants.map((p) => p.type))];
  const svgMap = await fetchPlantSvgDataUris(uniqueTypes);

  const subtitle = hasGarden
    ? `A garden with ${plants.length} plant${plants.length !== 1 ? "s" : ""}`
    : "Plant a garden, grow a soundscape";

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        backgroundColor: "#F9F7F2",
        fontFamily: "sans-serif",
      }}
    >
      {/* Background gradient */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "linear-gradient(to bottom, #F9F7F2 0%, #F3EDE4 55%, #EDE4D4 100%)",
          display: "flex",
        }}
      />

      {/* Green wash areas */}
      <div
        style={{
          position: "absolute",
          top: 200,
          left: 80,
          width: 400,
          height: 300,
          borderRadius: "50%",
          background: "rgba(107,142,35,0.06)",
          display: "flex",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 180,
          right: 120,
          width: 350,
          height: 280,
          borderRadius: "50%",
          background: "rgba(107,142,35,0.05)",
          display: "flex",
        }}
      />

      {/* Ground gradient */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 160,
          background:
            "linear-gradient(to top, rgba(107,142,35,0.10) 0%, rgba(107,142,35,0.04) 50%, transparent 100%)",
          display: "flex",
        }}
      />

      {/* Soil line */}
      <div
        style={{
          position: "absolute",
          bottom: 50,
          left: 60,
          right: 60,
          height: 2,
          background:
            "linear-gradient(to right, transparent, rgba(212,163,115,0.25) 15%, rgba(212,163,115,0.3) 50%, rgba(212,163,115,0.25) 85%, transparent)",
          display: "flex",
        }}
      />

      {/* Plants positioned on canvas */}
      {displayPlants.map((plant, i) => {
        const uri = svgMap.get(plant.type);
        if (!uri) return null;
        const px = CANVAS.left + (plant.x / 100) * (CANVAS.right - CANVAS.left) - PLANT_SIZE / 2;
        const py = CANVAS.top + (plant.y / 100) * (CANVAS.bottom - CANVAS.top) - PLANT_SIZE;
        return (
          // biome-ignore lint/performance/noImgElement: Satori requires native <img>
          <img
            key={`${plant.type}-${i}`}
            src={uri}
            width={PLANT_SIZE}
            height={PLANT_SIZE}
            alt=""
            style={{
              position: "absolute",
              left: px,
              top: py,
              objectFit: "contain",
            }}
          />
        );
      })}

      {/* Top bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 6,
          backgroundColor: "#6B8E23",
          display: "flex",
        }}
      />

      {/* Header: logo left, subtitle right */}
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 48,
          right: 48,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontSize: 36, display: "flex" }}>🌿</div>
          <div
            style={{
              fontSize: 36,
              fontWeight: 700,
              color: "#6B8E23",
              display: "flex",
            }}
          >
            FloraPhony
          </div>
        </div>
        <div
          style={{
            fontSize: 22,
            color: "#D4A373",
            fontWeight: 500,
            display: "flex",
          }}
        >
          {subtitle}
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 6,
          backgroundColor: "#D4A373",
          display: "flex",
        }}
      />

      {/* Bottom URL */}
      <div
        style={{
          position: "absolute",
          bottom: 16,
          right: 48,
          fontSize: 16,
          color: "#B8A692",
          display: "flex",
        }}
      >
        flora-phony.vercel.app
      </div>
    </div>,
    { ...size },
  );
}
