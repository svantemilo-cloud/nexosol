import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { ConditionalHeader } from "@/components/ConditionalHeader";
import { articles } from "@/lib/articles";

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nexosol.se";
const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
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
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Nexosol – Din väg till grön el",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nexosol – Jämför & Spara med grön el",
    description:
      "Få upp till 4 offerter från kvalitetssäkrade installatörer. Helt kostnadsfritt på under 2 minuter.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180" },
      { url: "/icon.svg", sizes: "any", type: "image/svg+xml" },
    ],
  },
  other: {
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
      "@type": "PostalAddress",
      "@id": `${siteUrl}/#postal-address`,
      streetAddress: "Exempelgatan 1",
      addressLocality: "Stockholm",
      postalCode: "111 22",
      addressCountry: "SE",
    },
    {
      "@type": "Place",
      "@id": `${siteUrl}/#place`,
      name: "Nexosol",
      address: { "@id": `${siteUrl}/#postal-address` },
    },
    {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: "Nexosol Kundservice",
      jobTitle: "Kundservice",
      worksFor: { "@id": `${siteUrl}/#organization` },
      email: "kontakt@nexosol.se",
    },
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
      address: { "@id": `${siteUrl}/#postal-address` },
      location: { "@id": `${siteUrl}/#place` },
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
          datePublished: article.date,
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
        {/* Om /_next/static/css inte laddas (blockering, nätverk) – undvik ren Times/UA-stil */}
        <style
          dangerouslySetInnerHTML={{
            __html: `:where(html){font-family:var(--font-sans),ui-sans-serif,system-ui,sans-serif}:where(body){margin:0;background:#f9fafb;color:#065a45}`,
          }}
        />
        {gtmId && (
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`,
            }}
          />
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className="antialiased text-forest min-h-screen font-sans"
        style={{ backgroundColor: "#f9fafb", color: "#065a45" }}
      >
        {gtmId && (
          <noscript>
            <iframe
              title="Google Tag Manager"
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}
        {children}
        <ConditionalHeader />
      </body>
    </html>
  );
}
