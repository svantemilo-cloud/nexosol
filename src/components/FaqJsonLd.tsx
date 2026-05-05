import { faqs } from "@/lib/faqs";
import { siteModifiedDate, sitePublishedDate, toIsoDateTimeUtc } from "@/lib/site-dates";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.nexosol.se";

/**
 * FAQPage (schema.org) för rich results och sök-/AI-snitt.
 * @see https://developers.google.com/search/docs/appearance/structured-data/faqpage
 */
export function FaqJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${siteUrl}/#faq-schema`,
    url: `${siteUrl}/#faq`,
    datePublished: toIsoDateTimeUtc(sitePublishedDate()),
    dateModified: toIsoDateTimeUtc(siteModifiedDate()),
    inLanguage: "sv-SE",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
