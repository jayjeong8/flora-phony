import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { JsonLd } from "./json-ld";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://flora-phony.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "FloraPhony — Free Lo-fi Garden Music Generator & Ambient Soundscape Creator",
    template: "%s | FloraPhony",
  },
  description:
    "Plant musical flowers, mix ambient layers, and grow your own lo-fi soundscape — all in your browser. 20 unique sound plants, drag-and-drop garden, no sign-up needed. Try FloraPhony free.",
  keywords: [
    "lo-fi music generator",
    "ambient soundscape creator",
    "virtual garden music app",
    "generative music browser app",
    "free focus music maker online",
    "lo-fi beats",
    "ambient music",
    "focus music",
    "study music",
    "relaxation soundscape",
    "drag and drop music maker",
    "browser music creator",
    "generative music",
    "virtual garden",
    "sound plants",
  ],
  authors: [{ name: "FloraPhony" }],
  creator: "FloraPhony",
  publisher: "FloraPhony",
  category: "Music",
  alternates: {
    canonical: "/",
    languages: { "en-US": "/" },
  },
  openGraph: {
    title: "FloraPhony — Free Lo-fi Garden Music Generator & Ambient Soundscape Creator",
    description:
      "Plant musical flowers, mix ambient layers, and grow your own lo-fi soundscape — all in your browser. 20 unique sound plants, drag-and-drop garden, no sign-up needed. Try FloraPhony free.",
    type: "website",
    siteName: "FloraPhony",
    locale: "en_US",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "FloraPhony — Free Lo-fi Garden Music Generator & Ambient Soundscape Creator",
    description:
      "Plant musical flowers, mix ambient layers, and grow your own lo-fi soundscape — all in your browser. 20 unique sound plants, drag-and-drop garden, no sign-up needed. Try FloraPhony free.",
    creator: "@floraphony",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600&family=Quicksand:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <JsonLd />
      </head>
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
