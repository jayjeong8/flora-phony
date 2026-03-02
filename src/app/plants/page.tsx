import type { Metadata } from "next";
import { PLANT_LIST } from "@/data/plant-registry";
import { PlantCatalog } from "./plant-catalog";

export const dynamic = "force-static";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://flora-phony.vercel.app";

export const metadata: Metadata = {
  title: `Plant Collection — ${PLANT_LIST.length} Unique Lo-fi Sound Plants`,
  description: `Browse all ${PLANT_LIST.length} musical plants in FloraPhony: ambient rain reeds, melodic bell flowers, rhythmic pulse moss, and more. Each plant generates a unique lo-fi sound layer for your garden soundscape.`,
  keywords: [
    "lo-fi sound plants",
    "ambient garden plants",
    "generative music plants",
    "lofi fern sound",
    "bell flower music",
    "crystal cactus sound generator",
    "rain reed ambient",
    "virtual garden sound catalog",
  ],
  alternates: {
    canonical: "/plants",
  },
  openGraph: {
    title: `Plant Collection — ${PLANT_LIST.length} Unique Lo-fi Sound Plants | FloraPhony`,
    description: `Browse all ${PLANT_LIST.length} musical plants in FloraPhony. Each plant generates a unique lo-fi sound layer for your garden soundscape.`,
    url: "/plants",
  },
};

const itemListJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "FloraPhony Sound Plants",
  description: `${PLANT_LIST.length} unique musical plants for lo-fi garden soundscapes`,
  numberOfItems: PLANT_LIST.length,
  itemListElement: PLANT_LIST.map((plant, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: plant.name,
    description: plant.description,
    url: `${siteUrl}/plants`,
  })),
};

export default function PlantsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD requires dangerouslySetInnerHTML
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemListJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <PlantCatalog />
    </>
  );
}
