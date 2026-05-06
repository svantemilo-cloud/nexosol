import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { ClientProviders } from "@/components/ClientProviders";
import { ConditionalHeader } from "@/components/ConditionalHeader";
import { articles } from "@/lib/articles";
import {
  newestArticleDate,
  oldestArticleDate,
  siteModifiedDate,
  sitePublishedDate,
  toIsoDateTimeUtc,
} from "@/lib/site-dates";
import { hreflangLanguages } from "@/lib/hreflang";

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  preload: false,
  adjustFontFallback: true,
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.nexosol.se";
const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

const homePublishedIso = toIsoDateTimeUtc(sitePublishedDate());
const homeModifiedIso = toIsoDateTimeUtc(siteModifiedDate());
const kbOldestIso = toIsoDateTimeUtc(oldestArticleDate());
const kbNewestIso = toIsoDateTimeUtc(newestArticleDate());

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#065a45",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Nexosol – Jämför & Spara med grön el",
    template: "%s | Nexosol",
  },
  description:
    "Få upp till 4 offerter från kvalitetssäkrade installatörer. Helt kostnadsfritt på under 2 minuter. Din väg till grön el.",
  keywords: [
    "solceller",
    "solcellsofferter",
    "jämför offerter",
    "grön el",
    "solpaneler",
    "solcellsinstallatör",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "/",
    languages: hreflangLanguages("/"),
  },
  openGraph: {
    type: "website",
    locale: "sv_SE",
    alternateLocale: ["sv_SE"],
    url: siteUrl,
    siteName: "Nexosol",
    title: "Nexosol – Jämför & Spara med grön el",
    description:
      "Få upp till 4 offerter från kvalitetssäkrade installatörer. Helt kostnadsfritt på under 2 minuter.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nexosol – Jämför & Spara med grön el",
    description:
      "Få upp till 4 offerter från kvalitetssäkrade installatörer. Helt kostnadsfritt på under 2 minuter.",
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  },
  other: {
    "article:published_time": homePublishedIso,
    "article:modified_time": homeModifiedIso,
    "og:updated_time": homeModifiedIso,
    "format-detection": "telephone=no",
    "apple-mobile-web-app-title": "Nexosol",
    "apple-mobile-web-app-capable": "yes",
    "mobile-web-app-capable": "yes",
    "content-language": "sv",
  },
  verification: {
    // Uncomment and set when you have them:
    // google: "your-google-verification",
    // yandex: "your-yandex-verification",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "Nexosol",
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/icon.svg`,
      },
      description:
        "Nexosol hjälper dig jämföra och spara med grön el – få upp till 4 offerter från kvalitetssäkrade solcellsinstallatörer.",
      areaServed: { "@type": "Country", name: "Sweden" },
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        email: "kontakt@nexosol.se",
        availableLanguage: "Swedish",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Nexosol",
      description:
        "Jämför & Spara med Nexosol – Din väg till grön el. Få upp till 4 offerter från kvalitetssäkrade installatörer.",
      datePublished: homePublishedIso,
      dateModified: homeModifiedIso,
      publisher: { "@id": `${siteUrl}/#organization` },
      inLanguage: "sv-SE",
      hasPart: [
        { "@id": `${siteUrl}/#kunskapsbank` },
        { "@id": `${siteUrl}/#artiklar-lista` },
      ],
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${siteUrl}/artiklar?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "WebPage",
      "@id": `${siteUrl}/#webpage`,
      url: siteUrl,
      name: "Nexosol – Jämför & Spara med grön el",
      datePublished: homePublishedIso,
      dateModified: homeModifiedIso,
      isPartOf: { "@id": `${siteUrl}/#website` },
      about: { "@id": `${siteUrl}/#organization` },
      inLanguage: "sv-SE",
    },
    {
      "@type": "WebPage",
      "@id": `${siteUrl}/#kunskapsbank`,
      url: `${siteUrl}/artiklar`,
      name: "Kunskapsbank – Guider om solceller och solel",
      description:
        "Guider om solceller: pris, storlek, lönsamhet, underhåll och tak. Nexosols kunskapsbank.",
      datePublished: kbOldestIso,
      dateModified: kbNewestIso,
      isPartOf: { "@id": `${siteUrl}/#website` },
      about: { "@id": `${siteUrl}/#organization` },
      inLanguage: "sv-SE",
    },
    {
      "@type": "ItemList",
      "@id": `${siteUrl}/#artiklar-lista`,
      name: "Nexosols artiklar om solceller",
      description: "Guider och artiklar om solceller, solel och solcellsanläggningar.",
      numberOfItems: articles.length,
      itemListElement: articles.map((article, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Article",
          "@id": `${siteUrl}/artiklar/${article.slug}#article`,
          url: `${siteUrl}/artiklar/${article.slug}`,
          name: article.title,
          description: article.description,
          datePublished: toIsoDateTimeUtc(article.date),
          dateModified: toIsoDateTimeUtc(article.dateModified ?? article.date),
        },
      })),
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv" className={`scroll-smooth ${montserrat.variable}`}>
      <head>
        {/* Kritisk minimal CSS innan Tailwind-bundlen; mobil-/SEO-media queries ligger i globals.css */}
        <style
          dangerouslySetInnerHTML={{
            __html: `:where(html){font-family:var(--font-sans),ui-sans-serif,system-ui,sans-serif}:where(body){margin:0;background:#f9fafb;color:#065a45}`,
          }}
        />
      </head>
      <body
        className="antialiased text-forest min-h-screen font-sans"
        style={{ backgroundColor: "#f9fafb", color: "#065a45" }}
      >
        <ClientProviders gtmId={gtmId}>
          {children}
          <ConditionalHeader />
        </ClientProviders>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
