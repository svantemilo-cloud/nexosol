import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getArticleBySlug,
  getAllSlugs,
  type Article,
} from "@/lib/articles";
import { ArticleBody } from "@/components/ArticleBody";
import { Sun, ArrowLeft, Calendar } from "lucide-react";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nexosol.se";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: "Artikel hittades inte" };

  const url = `${siteUrl}/artiklar/${article.slug}`;
  return {
    title: article.title,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      url,
      type: "article",
      publishedTime: article.date,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
    },
    alternates: { canonical: `/artiklar/${article.slug}` },
  };
}

function ArticleJsonLd({ article }: { article: Article }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    author: {
      "@type": "Organization",
      name: "Nexosol",
      url: siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "Nexosol",
      url: siteUrl,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/artiklar/${article.slug}`,
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  return (
    <>
      <ArticleJsonLd article={article} />
      <main className="min-h-screen bg-surface">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-24 pb-16">
          <Link
            href="/artiklar"
            className="inline-flex items-center gap-2 text-forest/70 hover:text-forest text-sm font-medium mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden />
            Tillbaka till kunskapsbanken
          </Link>

          <header className="mb-10">
            <span className="text-sm font-medium text-forest-light">
              {article.category}
            </span>
            <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-forest">
              {article.title}
            </h1>
            <time
              dateTime={article.date}
              className="mt-4 inline-flex items-center gap-2 text-forest/60 text-sm"
              suppressHydrationWarning
            >
              <Calendar className="w-4 h-4" aria-hidden />
              {new Date(article.date).toLocaleDateString("sv-SE", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </header>

          <ArticleBody blocks={article.body} />

          <div className="mt-14 pt-10 border-t border-forest/10">
            <p className="text-forest font-medium mb-2">
              Vill du få offerter på solceller?
            </p>
            <p className="text-forest/70 text-sm mb-4">
              Använd vår kalkylator och få upp till 4 offerter från
              kvalitetssäkrade installatörer – kostnadsfritt och bindningsfritt.
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
    </>
  );
}
