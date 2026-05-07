import { Gallery4 } from "@/components/ui/gallery4";
import { ARTICLE_COVER_IMAGE_URLS } from "@/lib/article-cover-images";
import { getLatestArticles } from "@/lib/articles";

/** Antal poster i kunskapsbankskarusellen — fler bilder väljs cykliskt från ARTICLE_COVER_IMAGE_URLS. */
const CAROUSEL_COUNT = 12;

export function LatestArticles() {
  const latest = getLatestArticles(CAROUSEL_COUNT);

  const items = latest.map((article, index) => ({
    id: article.slug,
    title: article.title,
    description: article.excerpt,
    href: `/artiklar/${article.slug}`,
    image: ARTICLE_COVER_IMAGE_URLS[index % ARTICLE_COVER_IMAGE_URLS.length]!,
  }));

  return (
    <Gallery4
      title="Våra Guider"
      description="Guider om solceller, pris, lönsamhet och underhåll från vår kunskapsbank."
      items={items}
      archiveHref="/artiklar"
      archiveLabel="Gå till våra artiklar"
    />
  );
}
