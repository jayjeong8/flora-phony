import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FloraPhony — Your Garden, Your Soundscape",
    short_name: "FloraPhony",
    description:
      "Plants don't just grow. They sing. Craft your own Lo-fi garden and let nature play your mood.",
    start_url: "/",
    display: "standalone",
    background_color: "#F9F7F2",
    theme_color: "#6B8E23",
    categories: ["music", "entertainment", "lifestyle"],
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
