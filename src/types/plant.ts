export enum PlantType {
  RainReed = "rain-reed",
  LofiFern = "lofi-fern",
  PulseMoss = "pulse-moss",
  BellFlower = "bell-flower",
  WindWood = "wind-wood",
  HazeLily = "haze-lily",
  RustleIvy = "rustle-ivy",
  TideSeaweed = "tide-seaweed",
  ShimmerSage = "shimmer-sage",
  EchoVine = "echo-vine",
  DriftWillow = "drift-willow",
  HumLotus = "hum-lotus",
  EmberThorn = "ember-thorn",
  CrystalCactus = "crystal-cactus",
  ChirpClover = "chirp-clover",
  TwangBamboo = "twang-bamboo",
  FrostOrchid = "frost-orchid",
  SparkDaisy = "spark-daisy",
  GrooveRoot = "groove-root",
  BubbleKelp = "bubble-kelp",
}

export enum PlantCategory {
  Ambient = "ambient",
  Melodic = "melodic",
  Rhythmic = "rhythmic",
  Pads = "pads",
}

export interface PlantDefinition {
  id: PlantType;
  name: string;
  label: string;
  description: string;
  color: string;
  svgPath: string;
  audioPath: string;
  category: PlantCategory;
}
