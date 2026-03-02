import type { Metadata } from "next";
import HomeClient from "./home-client";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://flora-phony.vercel.app";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ garden?: string }>;
}): Promise<Metadata> {
  const params = await searchParams;
  const gardenParam = params.garden;

  if (!gardenParam) return {};

  const ogImageUrl = `${siteUrl}/opengraph-image?garden=${encodeURIComponent(gardenParam)}`;

  return {
    title: "Listen to this garden",
    description:
      "Someone shared a musical garden with you. Click to listen to their lo-fi soundscape on FloraPhony.",
    openGraph: {
      title: "Listen to this garden | FloraPhony",
      description:
        "Someone shared a musical garden with you. Click to listen to their lo-fi soundscape on FloraPhony.",
      images: [{ url: ogImageUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Listen to this garden | FloraPhony",
      description:
        "Someone shared a musical garden with you. Click to listen to their lo-fi soundscape on FloraPhony.",
      images: [ogImageUrl],
    },
  };
}

export default function Home() {
  return <HomeClient />;
}
