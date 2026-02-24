export enum PlantType {
  RainReed = "rain-reed",
  LofiFern = "lofi-fern",
  PulseMoss = "pulse-moss",
  BellFlower = "bell-flower",
  WindWood = "wind-wood",
}

export interface PlantDefinition {
  id: PlantType;
  name: string;
  label: string;
  description: string;
  color: string;
  svgPath: string;
  audioPath: string;
}
