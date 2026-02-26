import { ImageResponse } from "next/og";
import { PLANT_REGISTRY } from "@/data/plant-registry";
import { deserialize } from "@/lib/garden-serializer";
import type { PlantType } from "@/types/plant";

export const runtime = "edge";

export const alt = "FloraPhony — Free Lo-fi Garden Music Generator & Ambient Soundscape Creator";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://flora-phony.vercel.app";

async function fetchPlantSvgDataUris(types: PlantType[]): Promise<(string | null)[]> {
  return Promise.all(
    types.map(async (type) => {
      const def = PLANT_REGISTRY[type];
      if (!def) return null;
      try {
        const res = await fetch(new URL(def.svgPath, siteUrl));
        if (!res.ok) return null;
        const text = await res.text();
        return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(text)}`;
      } catch {
        return null;
      }
    }),
  );
}

export default async function OgImage({
  searchParams,
}: {
  searchParams: Promise<{ garden?: string }>;
}) {
  const params = await searchParams;
  const gardenParam = params.garden;
  const plants = gardenParam ? deserialize(gardenParam) : [];
  const hasGarden = plants.length > 0;

  const uniqueTypes = [...new Set(plants.map((p) => p.plantType))];
  const displayTypes = uniqueTypes.slice(0, 8);
  const plantNames = uniqueTypes.slice(0, 5).map((t) => PLANT_REGISTRY[t]?.name ?? t);

  const svgDataUris = hasGarden ? await fetchPlantSvgDataUris(displayTypes) : [];

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F9F7F2",
        fontFamily: "sans-serif",
      }}
    >
      {/* Decorative top bar */}
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

      {/* Leaf icon */}
      <div
        style={{
          fontSize: 64,
          marginBottom: 12,
          display: "flex",
        }}
      >
        🌿
      </div>

      {/* Title */}
      <div
        style={{
          fontSize: 56,
          fontWeight: 700,
          color: "#6B8E23",
          marginBottom: 12,
          display: "flex",
        }}
      >
        FloraPhony
      </div>

      {hasGarden ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: 28,
              color: "#D4A373",
              fontWeight: 500,
              display: "flex",
            }}
          >
            A garden with {plants.length} plant{plants.length !== 1 ? "s" : ""}
          </div>

          {/* Plant SVG preview row */}
          {svgDataUris.filter(Boolean).length > 0 && (
            <div
              style={{
                display: "flex",
                gap: 20,
                marginTop: 24,
                alignItems: "flex-end",
              }}
            >
              {svgDataUris.map(
                (uri, i) =>
                  uri && (
                    // biome-ignore lint/performance/noImgElement: Satori/ImageResponse requires native <img>, not Next.js Image
                    <img
                      key={displayTypes[i]}
                      src={uri}
                      width={60}
                      height={75}
                      alt=""
                      style={{ objectFit: "contain" }}
                    />
                  ),
              )}
            </div>
          )}

          <div
            style={{
              fontSize: 20,
              color: "#8B7355",
              marginTop: 16,
              display: "flex",
              gap: 8,
            }}
          >
            {plantNames.join(" · ")}
            {uniqueTypes.length > 5 ? ` +${uniqueTypes.length - 5} more` : ""}
          </div>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Tagline */}
          <div
            style={{
              fontSize: 28,
              color: "#D4A373",
              fontWeight: 500,
              display: "flex",
            }}
          >
            Plants don&apos;t just grow. They sing.
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: 20,
              color: "#8B7355",
              marginTop: 20,
              display: "flex",
            }}
          >
            Free Lo-fi Garden Music Generator
          </div>
        </div>
      )}

      {/* Ground stripe */}
      <div
        style={{
          position: "absolute",
          bottom: 6,
          left: 0,
          right: 0,
          height: 40,
          background: "linear-gradient(to top, rgba(212,163,115,0.15), transparent)",
          display: "flex",
        }}
      />

      {/* Decorative bottom bar */}
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
    </div>,
    { ...size },
  );
}
