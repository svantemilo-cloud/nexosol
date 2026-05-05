import type { MetadataRoute } from "next";
import { articles } from "@/lib/articles";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.nexosol.se";

export default function sitemap(): MetadataRoute.Sitemap {
  const latestArticleDate =
    articles.length > 0
      ? articles.reduce((latest, a) => (a.date > latest ? a.date : latest), articles[0].date)
      : new Date().toISOString().slice(0, 10);

  const articleEntries: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${siteUrl}/artiklar/${article.slug}`,
    lastModified: new Date(article.date),
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/artiklar`,
      lastModified: new Date(latestArticleDate),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...articleEntries,
  ];
}
