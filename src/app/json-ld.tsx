const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://flora-phony.vercel.app";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "FloraPhony",
      url: siteUrl,
      description:
        "Plants don't just grow. They sing. Craft your own Lo-fi garden and let nature play your mood.",
      applicationCategory: "MultimediaApplication",
      operatingSystem: "Any",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      featureList: [
        "Virtual garden builder",
        "Generative lo-fi music",
        "Ambient soundscapes",
        "Browser-based music creation",
      ],
    },
    {
      "@type": "WebSite",
      name: "FloraPhony",
      url: siteUrl,
      potentialAction: {
        "@type": "SearchAction",
        target: `${siteUrl}/?garden={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export function JsonLd() {
  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD requires dangerouslySetInnerHTML
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
      }}
    />
  );
}
