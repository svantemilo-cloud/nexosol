"use client";

import { ChevronRight, PanelTop, Sun, Battery } from "lucide-react";
import type { SolutionKey } from "@/components/Calculator";
import { QuoteQuizLink } from "@/components/quote-quiz/QuoteQuizLink";

const productOptions: {
  solution: SolutionKey;
  label: string;
  icon: typeof PanelTop;
  sub: string;
}[] = [
  {
    solution: "kombination",
    label: "Solceller med batteri",
    icon: PanelTop,
    sub: "Komplett system med energilagring",
  },
  {
    solution: "solceller",
    label: "Endast solcellsanläggning",
    icon: Sun,
    sub: "Solpaneler till ditt hem",
  },
  {
    solution: "batteri",
    label: "Endast solcellsbatteri",
    icon: Battery,
    sub: "Energilagring till befintlig anläggning",
  },
];

export function HeroQuoteCard() {
  return (
    <div className="relative w-full max-w-md mx-auto md:mx-2 my-4 rounded-2xl shadow-soft-lg border border-forest/10 bg-white">
      <div className="p-6 sm:p-8">
        <h2 className="text-xl font-bold text-forest mb-1">
          Vad söker du offert för?
        </h2>
        <p className="text-sm text-forest/70 mb-6">
          Jämför offerter enkelt, kostnadsfritt och bindningsfritt.
        </p>
        <p className="text-sm font-medium text-forest/80 mb-3">
          Vad söker du prisförslag för?
        </p>
        <div className="space-y-3">
          {productOptions.map((opt) => (
            <QuoteQuizLink
              key={opt.label}
              href="#calculator"
              solution={opt.solution}
              className="group flex items-center gap-4 p-4 rounded-xl bg-surface border border-forest/10 hover:border-forest/20 hover:shadow-soft transition-all"
            >
              <span className="flex-shrink-0 w-10 h-10 rounded-lg bg-forest/10 flex items-center justify-center text-forest group-hover:bg-forest/15">
                <opt.icon className="w-5 h-5" />
              </span>
              <span className="flex-1 font-medium text-forest">{opt.label}</span>
              <ChevronRight className="w-5 h-5 text-forest/50 group-hover:text-forest group-hover:translate-x-0.5 transition-all" />
            </QuoteQuizLink>
          ))}
        </div>
        <QuoteQuizLink
          href="#calculator"
          className="mt-6 flex items-center justify-center gap-2 w-full rounded-2xl bg-forest text-white font-semibold py-3.5 shadow-soft hover:shadow-soft-lg transition-all hover:bg-forest-light"
        >
          Jämför offerter nu
          <ChevronRight className="w-5 h-5" />
        </QuoteQuizLink>
      </div>
    </div>
  );
}
