import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://flora-phony.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/", "/_next/"] },
      {
        userAgent: [
          "ChatGPT-User",
          "GPTBot",
          "Google-Extended",
          "Claude-Web",
          "Applebot-Extended",
          "PerplexityBot",
          "Bytespider",
          "CCBot",
          "anthropic-ai",
          "cohere-ai",
        ],
        allow: ["/", "/llms.txt", "/llms-full.txt"],
        disallow: ["/api/", "/_next/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
