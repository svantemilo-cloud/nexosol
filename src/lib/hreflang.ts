import type { Metadata } from "next";

const DEFAULT_SITE = "https://www.nexosol.se";

function siteOrigin(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE;
  try {
    return new URL(raw).origin;
  } catch {
    return new URL(DEFAULT_SITE).origin;
  }
}

/**
 * Ensäspråkig sajt (svenska, Sverige): självrefererande hreflang som sökmotorer
 * och SEO-verktyg kan läsa. Vid riktiga språkversioner: utöka med fler nycklar.
 */
export function hreflangLanguages(
  pathname: string,
): NonNullable<Metadata["alternates"]>["languages"] {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const absolute = new URL(path, `${siteOrigin()}/`).href;
  return {
    "sv-SE": absolute,
    "x-default": absolute,
  };
}
