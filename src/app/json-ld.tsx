const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://flora-phony.vercel.app";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "FloraPhony",
      url: siteUrl,
      description:
        "Plant musical flowers, mix ambient layers, and grow your own lo-fi soundscape — all in your browser. 20 unique sound plants, drag-and-drop garden, no sign-up needed. Try FloraPhony free.",
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
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Is FloraPhony free?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, FloraPhony is completely free. No sign-up, no download, no hidden costs. Open your browser and start planting sounds immediately.",
          },
        },
        {
          "@type": "Question",
          name: "Does FloraPhony work on mobile?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "FloraPhony works on mobile browsers but is designed desktop-first for the best drag-and-drop experience. We recommend using a desktop or laptop browser for full enjoyment.",
          },
        },
        {
          "@type": "Question",
          name: "Can I share my garden with friends?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Absolutely! Click the Share button to copy a unique URL that captures your entire garden layout and soundscape. Anyone who opens the link hears exactly what you built — no account needed.",
          },
        },
        {
          "@type": "Question",
          name: "What makes FloraPhony different from lo-fi YouTube streams?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Unlike passive lo-fi streams, FloraPhony lets you compose your own soundscape by dragging and dropping 20 unique musical plants onto a canvas. Every garden is unique, generative, and shareable via a single URL.",
          },
        },
      ],
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
