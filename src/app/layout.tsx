import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { JsonLd } from "./json-ld";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://flora-phony.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "FloraPhony — Your Garden, Your Soundscape",
    template: "%s | FloraPhony",
  },
  description:
    "Plants don't just grow. They sing. Craft your own Lo-fi garden and let nature play your mood.",
  keywords: [
    "lo-fi music",
    "ambient music creator",
    "virtual garden",
    "generative music",
    "focus music",
    "browser music",
    "zen",
    "meditation",
    "soundscape",
    "relaxation",
    "lo-fi",
    "ambient",
    "garden",
    "music",
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
    title: "FloraPhony — Your Garden, Your Soundscape",
    description:
      "Plants don't just grow. They sing. Craft your own Lo-fi garden and let nature play your mood.",
    type: "website",
    siteName: "FloraPhony",
    locale: "en_US",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "FloraPhony — Your Garden, Your Soundscape",
    description:
      "Plants don't just grow. They sing. Craft your own Lo-fi garden and let nature play your mood.",
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
