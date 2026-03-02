# FloraPhony

**Grow a garden that sings.**

Plant sounds, not seeds — a lo-fi ambient music garden you can grow right in your browser.

[Try it now](https://flora-phony.vercel.app) · [한국어](./README.ko.md)

![FloraPhony Preview](docs/images/preview.png)

[Preview my garden](https://flora-phony.vercel.app/?g=BBJKBAdPBBpLBCVKBC5OBDhJBENNBExIBFNPBFlHBF5QEQc_ERUjETAQEUUYEVQoEWE_DRE2DSMhDT8iASgcATAiATkcAxIMAw5BEFIMEFU7Ag5VAhc6AiA7EkE7Ekw7ElNXEx8hEyUXEzkVE0IcCxwtCyg3CzY5C0YxC04nDBcUDAsQDAUsDEsUDFoSDF0z)

---

## What is FloraPhony?

FloraPhony is a browser-based interactive music garden where you drag and drop musical plants onto a canvas to create your own lo-fi ambient soundscape. Each plant produces a unique synthesized sound, and together they blend into a living, breathing garden of music.

No sign-up. No download. Just open, plant, and listen.

## Features

- **20 Unique Sound Plants** — Choose from 4 categories: Ambient, Melodic, Rhythmic, and Pads. Each plant has its own distinct synthesized voice.
- **Drag & Drop Composition** — Place plants anywhere on the canvas. Arranging your garden is the act of composing.
- **Real-time Audio Synthesis** — All sounds are generated in real time using Tone.js. No loops, no samples — every moment is unique.
- **URL Sharing** — Your entire garden is encoded in the URL. Copy and share it with anyone — they'll hear exactly what you built.
- **Save & Load** — Save your garden snapshots and revisit them anytime.
- **Zero Friction** — No accounts, no installations. Works on any modern browser.

## Sound Plants

| Category | Plants |
|----------|--------|
| **Ambient** | Rain Reed, Haze Lily, Rustle Ivy, Tide Seaweed, Shimmer Sage |
| **Melodic** | Lofi Fern, Bell Flower, Crystal Cactus, Chirp Clover, Twang Bamboo, Frost Orchid |
| **Rhythmic** | Pulse Moss, Wind Wood, Groove Root, Spark Daisy, Bubble Kelp |
| **Pads** | Echo Vine, Drift Willow, Hum Lotus, Ember Thorn |

## Tech Stack

Next.js 16 · React 19 · Konva.js · Tone.js · Zustand · Tailwind CSS

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## License

- Source code is licensed under the [MIT License](./LICENSE).
- Creative assets (`public/plants/`), sound design parameters (`src/lib/audio/synth-placeholders.ts`), and plant definitions (`src/data/plant-registry.ts`) are licensed under [CC BY-NC-SA 4.0](./LICENSE-ASSETS).
