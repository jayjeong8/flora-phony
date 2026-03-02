import type { PlantInstance } from "@/types/garden";
import { PlantType } from "@/types/plant";

const PLANT_TYPE_TO_ID: Record<PlantType, number> = {
  [PlantType.RainReed]: 0,
  [PlantType.LofiFern]: 1,
  [PlantType.PulseMoss]: 2,
  [PlantType.BellFlower]: 3,
  [PlantType.WindWood]: 4,
  [PlantType.HazeLily]: 5,
  [PlantType.RustleIvy]: 6,
  [PlantType.TideSeaweed]: 7,
  [PlantType.ShimmerSage]: 8,
  [PlantType.EchoVine]: 9,
  [PlantType.DriftWillow]: 10,
  [PlantType.HumLotus]: 11,
  [PlantType.EmberThorn]: 12,
  [PlantType.CrystalCactus]: 13,
  [PlantType.ChirpClover]: 14,
  [PlantType.TwangBamboo]: 15,
  [PlantType.FrostOrchid]: 16,
  [PlantType.SparkDaisy]: 17,
  [PlantType.GrooveRoot]: 18,
  [PlantType.BubbleKelp]: 19,
  [PlantType.SmokyJasmine]: 20,
  [PlantType.StrollMangrove]: 21,
  [PlantType.BrushThistle]: 22,
  [PlantType.CroonMagnolia]: 23,
};

const ID_TO_PLANT_TYPE: Record<number, PlantType> = {
  0: PlantType.RainReed,
  1: PlantType.LofiFern,
  2: PlantType.PulseMoss,
  3: PlantType.BellFlower,
  4: PlantType.WindWood,
  5: PlantType.HazeLily,
  6: PlantType.RustleIvy,
  7: PlantType.TideSeaweed,
  8: PlantType.ShimmerSage,
  9: PlantType.EchoVine,
  10: PlantType.DriftWillow,
  11: PlantType.HumLotus,
  12: PlantType.EmberThorn,
  13: PlantType.CrystalCactus,
  14: PlantType.ChirpClover,
  15: PlantType.TwangBamboo,
  16: PlantType.FrostOrchid,
  17: PlantType.SparkDaisy,
  18: PlantType.GrooveRoot,
  19: PlantType.BubbleKelp,
  20: PlantType.SmokyJasmine,
  21: PlantType.StrollMangrove,
  22: PlantType.BrushThistle,
  23: PlantType.CroonMagnolia,
};

export function serialize(plants: PlantInstance[]): string {
  return plants
    .map((p) => {
      const typeId = PLANT_TYPE_TO_ID[p.plantType];
      const x = Math.round(p.x);
      const y = Math.round(p.y);
      return `${typeId}:${x}:${y}`;
    })
    .join("|");
}

const MAX_ENCODED_LENGTH = 2000;
const MAX_PLANTS = 100;

export function deserialize(encoded: string): PlantInstance[] {
  if (!encoded || encoded.trim() === "" || encoded.length > MAX_ENCODED_LENGTH) return [];

  const plants: PlantInstance[] = [];
  const parts = encoded.split("|");

  for (const part of parts) {
    const segments = part.split(":");
    if (segments.length !== 3) continue;

    const typeId = Number.parseInt(segments[0], 10);
    const x = Number.parseInt(segments[1], 10);
    const y = Number.parseInt(segments[2], 10);

    if (Number.isNaN(typeId) || Number.isNaN(x) || Number.isNaN(y)) continue;

    const plantType = ID_TO_PLANT_TYPE[typeId];
    if (!plantType) continue;

    if (x < 0 || x > 100 || y < 0 || y > 100) continue;

    if (plants.length >= MAX_PLANTS) break;

    plants.push({
      id: `plant-restored-${plants.length}-${Date.now()}`,
      plantType,
      x,
      y,
      createdAt: Date.now(),
    });
  }

  return plants;
}

// --- Compact binary format ---
// Each plant = 3 bytes: [typeId (0-19), x (0-100), y (0-100)]
// Encoded as base64url (no padding, URL-safe)

function uint8ToBase64url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64urlToUint8(str: string): Uint8Array {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4 !== 0) {
    base64 += "=";
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export function serializeCompact(plants: PlantInstance[]): string {
  const capped = plants.slice(0, MAX_PLANTS);
  if (capped.length === 0) return "";
  const bytes = new Uint8Array(capped.length * 3);
  for (let i = 0; i < capped.length; i++) {
    const p = capped[i];
    bytes[i * 3] = PLANT_TYPE_TO_ID[p.plantType];
    bytes[i * 3 + 1] = Math.round(p.x);
    bytes[i * 3 + 2] = Math.round(p.y);
  }
  return uint8ToBase64url(bytes);
}

const MAX_COMPACT_LENGTH = 600;

export function deserializeCompact(encoded: string): PlantInstance[] {
  if (!encoded || encoded.length > MAX_COMPACT_LENGTH) return [];

  let bytes: Uint8Array;
  try {
    bytes = base64urlToUint8(encoded);
  } catch {
    return [];
  }

  if (bytes.length % 3 !== 0) return [];

  const plants: PlantInstance[] = [];
  const count = Math.min(bytes.length / 3, MAX_PLANTS);

  for (let i = 0; i < count; i++) {
    const typeId = bytes[i * 3];
    const x = bytes[i * 3 + 1];
    const y = bytes[i * 3 + 2];

    const plantType = ID_TO_PLANT_TYPE[typeId];
    if (!plantType) continue;
    if (x > 100 || y > 100) continue;

    plants.push({
      id: `plant-restored-${plants.length}-${Date.now()}`,
      plantType,
      x,
      y,
      createdAt: Date.now(),
    });
  }

  return plants;
}
