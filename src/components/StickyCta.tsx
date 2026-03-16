"use client";

import Link from "next/link";
import { Sun } from "lucide-react";

export function StickyCta() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-md border-b border-forest/10 shadow-soft">
      <div className="w-full max-w-7xl mx-auto pl-4 sm:pl-6 pr-4 sm:pr-6 flex items-center h-16 gap-8">
        <Link
          href="/"
          className="font-bold text-forest text-xl sm:text-2xl flex items-center gap-2 shrink-0 hover:text-forest-light transition-colors cursor-pointer mr-4 sm:mr-8"
        >
          <Sun className="w-7 h-7 sm:w-8 sm:h-8 text-forest" />
          Nexosol
        </Link>

        <nav className="flex-1 flex items-center justify-between min-w-0 gap-2 sm:gap-4">
          <Link
            href="/#products"
            className="font-medium text-forest hover:text-coral transition-colors py-2.5 px-2 sm:px-3 -mx-2 sm:-mx-3 rounded-xl hover:bg-forest/5 cursor-pointer text-sm sm:text-base"
          >
            Lösningar
          </Link>
          <Link
            href="/#om-oss"
            className="font-medium text-forest hover:text-coral transition-colors py-2.5 px-2 sm:px-3 -mx-2 sm:-mx-3 rounded-xl hover:bg-forest/5 cursor-pointer text-sm sm:text-base"
          >
            Om oss
          </Link>
          <Link
            href="/artiklar"
            className="font-medium text-forest hover:text-coral transition-colors py-2.5 px-2 sm:px-3 -mx-2 sm:-mx-3 rounded-xl hover:bg-forest/5 cursor-pointer text-sm sm:text-base"
          >
            Kunskapsbank
          </Link>
          <Link
            href="/#calculator"
            className="font-medium text-forest hover:text-coral transition-colors py-2.5 px-2 sm:px-3 -mx-2 sm:-mx-3 rounded-xl hover:bg-forest/5 cursor-pointer text-sm sm:text-base"
          >
            Kalkylator
          </Link>
          <Link
            href="#calculator"
            className="rounded-2xl bg-forest text-white font-semibold px-5 py-2.5 shadow-soft hover:shadow-soft-lg transition-shadow hover:bg-forest-light cursor-pointer"
          >
            Få gratis offert
          </Link>
        </nav>
      </div>
    </header>
  );
}
