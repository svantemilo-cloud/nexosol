import Link from "next/link";
import { getLatestArticles } from "@/lib/articles";
import { ArrowRight, BookOpen } from "lucide-react";

export function LatestArticles() {
  const latest = getLatestArticles(3);

  return (
    <section className="py-16 sm:py-20 bg-surface">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-forest">
              Senaste från kunskapsbanken
            </h2>
            <p className="mt-2 text-forest/70">
              Guider om solceller, pris, lönsamhet och underhåll.
            </p>
          </div>
          <Link
            href="/artiklar"
            className="inline-flex items-center gap-2 text-forest font-semibold hover:text-forest-light transition-colors shrink-0"
          >
            <BookOpen className="w-5 h-5" aria-hidden />
            Visa alla artiklar
          </Link>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latest.map((article) => (
            <li key={article.slug}>
              <Link
                href={`/artiklar/${article.slug}`}
                className="block h-full rounded-2xl border border-forest/10 bg-white p-6 shadow-soft hover:shadow-soft-lg hover:border-forest/20 transition-all group"
              >
                <span className="text-sm font-medium text-forest-light">
                  {article.category}
                </span>
                <h3 className="mt-2 text-lg font-semibold text-forest line-clamp-2 group-hover:text-forest-light transition-colors">
                  {article.title}
                </h3>
                <p className="mt-2 text-sm text-forest/70 line-clamp-2">
                  {article.excerpt}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-forest font-medium text-sm group-hover:gap-2 transition-all">
                  Läs mer
                  <ArrowRight className="w-4 h-4" aria-hidden />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
