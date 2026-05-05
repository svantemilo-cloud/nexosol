const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.nexosol.se";

export type BreadcrumbCrumb = {
  /** Visningsnamn i SERP (t.ex. Kunskapsbank). */
  name: string;
  /** Sökväg från webbplatsens rot, t.ex. "/" eller "/artiklar". */
  path: string;
};

function toAbsoluteUrl(path: string): string {
  const origin = siteUrl.replace(/\/$/, "");
  if (!path || path === "/") return `${origin}/`;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${origin}${p}`;
}

/**
 * BreadcrumbList för navigering i sökresultat.
 * @see https://developers.google.com/search/docs/appearance/structured-data/breadcrumb
 */
export function BreadcrumbJsonLd({ items }: { items: BreadcrumbCrumb[] }) {
  if (items.length === 0) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${toAbsoluteUrl(items[items.length - 1]?.path ?? "/")}#breadcrumb`,
    itemListElement: items.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: toAbsoluteUrl(crumb.path),
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
