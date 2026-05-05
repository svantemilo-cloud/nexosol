import { articles } from "@/lib/articles";

/** Fallback när ingest artikel finns eller env saknas. */
export const SITE_DEFAULT_PUBLISHED = "2023-06-01";

export function oldestArticleDate(): string {
  if (articles.length === 0) return SITE_DEFAULT_PUBLISHED;
  return articles.reduce((min, a) => (a.date < min ? a.date : min), articles[0].date);
}

export function newestArticleDate(): string {
  if (articles.length === 0) return SITE_DEFAULT_PUBLISHED;
  return articles.reduce((max, a) => (a.date > max ? a.date : max), articles[0].date);
}

/** Startsidans publiceringsdatum (override med env vid större lanseringar). */
export function sitePublishedDate(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_DATE_PUBLISHED?.trim();
  return raw || SITE_DEFAULT_PUBLISHED;
}

/**
 * Senaste tydliga innehålls‑uppdatering: env → annars nyaste guiden i kunskapsbanken.
 * Sätt `NEXT_PUBLIC_SITE_DATE_MODIFIED` vid landing‑ eller policyändring mellan deploys.
 */
export function siteModifiedDate(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_DATE_MODIFIED?.trim();
  return raw || newestArticleDate();
}

/** OG / meta‑taggar vill ofta ha ISO‑8601 med tid. */
export function toIsoDateTimeUtc(dateYmd: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateYmd)) return `${dateYmd}T12:00:00.000Z`;
  return dateYmd;
}
