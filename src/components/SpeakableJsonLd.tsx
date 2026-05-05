const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.nexosol.se";

/** Kort passages lämpade för uppläsning (TTS); pekar på konkret markup via CSS-selektorer. */
const SPEAKABLE_SELECTORS = ["#nx-speakable-hero", "#nx-speakable-process"] as const;

/**
 * Speakable (schema.org på WebPage) – markerar avsnitt som passar för röstsök / TTS.
 * @see https://developers.google.com/search/docs/appearance/structured-data/speakable
 * @see https://schema.org/speakable
 */
export function SpeakableJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    url: siteUrl,
    name: "Nexosol – Jämför & Spara med grön el",
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [...SPEAKABLE_SELECTORS],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
