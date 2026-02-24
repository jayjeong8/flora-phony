import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FloraPhony — Your Garden, Your Soundscape",
  description:
    "Plants don't just grow. They sing. Craft your own Lo-fi garden and let nature play your mood.",
  keywords: ["lo-fi", "ambient", "garden", "soundscape", "music", "relaxation"],
  openGraph: {
    title: "FloraPhony — Your Garden, Your Soundscape",
    description:
      "Plants don't just grow. They sing. Craft your own Lo-fi garden and let nature play your mood.",
    type: "website",
    siteName: "FloraPhony",
  },
  twitter: {
    card: "summary_large_image",
    title: "FloraPhony — Your Garden, Your Soundscape",
    description:
      "Plants don't just grow. They sing. Craft your own Lo-fi garden and let nature play your mood.",
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
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
