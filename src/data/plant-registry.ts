import type { PlantDefinition } from "@/types/plant";
import { PlantType } from "@/types/plant";

export const PLANT_REGISTRY: Record<PlantType, PlantDefinition> = {
  [PlantType.RainReed]: {
    id: PlantType.RainReed,
    name: "Rain Reed",
    label: "Rain",
    description: "Gentle rain-like white noise for calm and stability",
    color: "#7BA7BC",
    svgPath: "/plants/rain-reed.svg",
    audioPath: "/audio/rain-reed.ogg",
  },
  [PlantType.LofiFern]: {
    id: PlantType.LofiFern,
    name: "Lofi Fern",
    label: "Piano",
    description: "Dreamy lo-fi electric piano chord progressions",
    color: "#6B8E23",
    svgPath: "/plants/lofi-fern.svg",
    audioPath: "/audio/lofi-fern.ogg",
  },
  [PlantType.PulseMoss]: {
    id: PlantType.PulseMoss,
    name: "Pulse Moss",
    label: "Bass",
    description: "Deep heartbeat-like synthesizer bass pulses",
    color: "#4A7C59",
    svgPath: "/plants/pulse-moss.svg",
    audioPath: "/audio/pulse-moss.ogg",
  },
  [PlantType.BellFlower]: {
    id: PlantType.BellFlower,
    name: "Bell Flower",
    label: "Bell",
    description: "Crystal-clear high-pitched bell melodies",
    color: "#C9A0DC",
    svgPath: "/plants/bell-flower.svg",
    audioPath: "/audio/bell-flower.ogg",
  },
  [PlantType.WindWood]: {
    id: PlantType.WindWood,
    name: "Wind Wood",
    label: "Wood",
    description: "Organic wood percussion clicks and knocks",
    color: "#8B6914",
    svgPath: "/plants/wind-wood.svg",
    audioPath: "/audio/wind-wood.ogg",
  },
};

export const PLANT_LIST = Object.values(PLANT_REGISTRY);
