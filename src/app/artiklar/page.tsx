import type { Metadata } from "next";
import Link from "next/link";
import { articles } from "@/lib/articles";
import { Sun, ArrowRight, Calendar } from "lucide-react";

export const metadata: Metadata = {
  title: "Kunskapsbank – Guider om solceller och solel",
  description:
    "Läs guider om solcellspriser, lönsamhet, underhåll och vilka tak som passar. Nexosols kunskapsbank hjälper dig ta rätt beslut om solceller.",
  openGraph: {
    title: "Kunskapsbank – Guider om solceller | Nexosol",
    description:
      "Guider om solceller: pris, storlek, lönsamhet, underhåll och tak. Läs och jämför sedan offerter från kvalitetssäkrade installatörer.",
    url: "/artiklar",
  },
};

function matchSearch(article: (typeof articles)[0], q: string) {
  const term = q.toLowerCase().trim();
  if (!term) return true;
  return (
    article.title.toLowerCase().includes(term) ||
    article.excerpt.toLowerCase().includes(term) ||
    article.category.toLowerCase().includes(term)
  );
}

export default function ArtiklarPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const sorted = [...articles].sort((a, b) => b.date.localeCompare(a.date));
  const q = searchParams?.q ?? "";
  const list = q.trim() ? sorted.filter((a) => matchSearch(a, q)) : sorted;

  return (
    <main className="min-h-screen bg-surface">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-forest mb-3">
            Kunskapsbank
          </h1>
          <p className="text-forest/80 text-lg">
            Guider och artiklar om solceller, solel och vad du behöver veta innan
            du sätter upp en anläggning. Läs – och jämför sedan offerter via
            Nexosol.
          </p>
        </div>

        <ul className="space-y-6">
          {list.map((article) => (
            <li key={article.slug}>
              <Link
                href={`/artiklar/${article.slug}`}
                className="block rounded-2xl border border-forest/10 bg-white p-6 shadow-soft hover:shadow-soft-lg hover:border-forest/20 transition-all group"
              >
                <span className="text-sm font-medium text-forest-light">
                  {article.category}
                </span>
                <h2 className="mt-2 text-xl font-semibold text-forest group-hover:text-forest-light transition-colors">
                  {article.title}
                </h2>
                <p className="mt-2 text-forest/70 line-clamp-2">
                  {article.excerpt}
                </p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm text-forest/60" suppressHydrationWarning>
                  <Calendar className="w-4 h-4" aria-hidden />
                  {new Date(article.date).toLocaleDateString("sv-SE", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <span className="mt-2 inline-flex items-center gap-1 text-forest font-medium text-sm group-hover:gap-2 transition-all">
                  Läs artikel
                  <ArrowRight className="w-4 h-4" aria-hidden />
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-14 p-6 rounded-2xl bg-forest/5 border border-forest/10">
          <p className="text-forest font-medium mb-2">
            Redo att jämföra offerter på solceller?
          </p>
          <p className="text-forest/70 text-sm mb-4">
            Få upp till 4 offerter från kvalitetssäkrade installatörer – kostnadsfritt
            och bindningsfritt.
          </p>
          <a
            href="/#calculator"
            className="inline-flex items-center gap-2 rounded-2xl bg-forest text-white font-semibold px-5 py-2.5 shadow-soft hover:bg-forest-light transition-colors"
          >
            <Sun className="w-5 h-5" aria-hidden />
            Gå till kalkylatorn
          </a>
        </div>
      </div>
    </main>
  );
}
