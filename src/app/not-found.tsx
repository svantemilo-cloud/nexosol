import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sidan hittades inte",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="min-h-screen bg-surface flex flex-col items-center justify-center px-4 pb-24 pt-28">
      <p className="text-sm font-medium text-forest-light uppercase tracking-wide">
        Fel 404
      </p>
      <h1 className="mt-3 text-3xl sm:text-4xl font-bold text-forest text-center">
        Sidan finns inte
      </h1>
      <p className="mt-4 text-forest/75 text-center max-w-md">
        Adressen kan vara felstavad eller sidan är borttagen. Gå tillbaka till startsidan eller
        kunskapsbanken.
      </p>
      <div className="mt-10 flex flex-wrap gap-3 justify-center">
        <Link
          href="/"
          className="inline-flex rounded-2xl bg-forest px-6 py-2.5 font-semibold text-white shadow-soft hover:bg-forest-light transition-colors"
        >
          Till startsidan
        </Link>
        <Link
          href="/artiklar"
          className="inline-flex rounded-2xl border border-forest/20 bg-white px-6 py-2.5 font-semibold text-forest shadow-soft hover:border-forest/30 transition-colors"
        >
          Kunskapsbank
        </Link>
      </div>
    </main>
  );
}
