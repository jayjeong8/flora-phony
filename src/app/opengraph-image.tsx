import { ImageResponse } from "next/og";
import { PLANT_REGISTRY } from "@/data/plant-registry";
import { deserialize } from "@/lib/garden-serializer";

export const runtime = "edge";

export const alt = "FloraPhony — Free Lo-fi Garden Music Generator & Ambient Soundscape Creator";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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
  const plantNames = uniqueTypes.slice(0, 5).map((t) => PLANT_REGISTRY[t]?.name ?? t);

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
          fontSize: 72,
          marginBottom: 16,
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
          marginBottom: 16,
          display: "flex",
        }}
      >
        FloraPhony
      </div>

      {hasGarden ? (
        <>
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
        </>
      ) : (
        <>
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
        </>
      )}

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
