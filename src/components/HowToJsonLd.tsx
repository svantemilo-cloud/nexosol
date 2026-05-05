import {
  howItWorksHeading,
  howItWorksLead,
  howItWorksSteps,
} from "@/lib/how-it-works";
import { siteModifiedDate, sitePublishedDate, toIsoDateTimeUtc } from "@/lib/site-dates";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.nexosol.se";

/**
 * HowTo (schema.org) för rich results när innehållet är steg-för-steg.
 * @see https://developers.google.com/search/docs/appearance/structured-data/how-to
 */
export function HowToJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "@id": `${siteUrl}/#howto-nexosol`,
    name: `${howItWorksHeading} med Nexosol`,
    description: `${howItWorksLead}.`,
    datePublished: toIsoDateTimeUtc(sitePublishedDate()),
    dateModified: toIsoDateTimeUtc(siteModifiedDate()),
    inLanguage: "sv-SE",
    url: `${siteUrl}/#how-it-works`,
    step: howItWorksSteps.map((s) => ({
      "@type": "HowToStep",
      position: s.step,
      name: s.title,
      text: s.description,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
