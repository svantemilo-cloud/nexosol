"use client";

import { Sun, Check, ChevronRight, PanelTop, Battery } from "lucide-react";

const bullets = [
  "Endast trygga installatörer",
  "Kostnadsfri prisförfrågan",
  "Spar värdefull tid",
];

const productOptions = [
  {
    href: "#calculator",
    label: "Solceller med batteri",
    icon: PanelTop,
    sub: "Komplett system med energilagring",
  },
  {
    href: "#calculator",
    label: "Endast solcellsanläggning",
    icon: Sun,
    sub: "Solpaneler till ditt hem",
  },
  {
    href: "#calculator",
    label: "Endast solcellsbatteri",
    icon: Battery,
    sub: "Energilagring till befintlig anläggning",
  },
];

export function Hero() {
  return (
    <section className="relative min-h-screen pt-24 pb-16 md:pt-28 md:pb-24 overflow-hidden -mt-16">
      {/* Bakgrundsbild täcker hela första sektionen */}
      <div className="absolute inset-0 z-0" aria-hidden>
        <img
          src="/hero-solar.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center"
          fetchPriority="high"
        />
        {/* Gradient från vänster så att text är läsbar */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-surface via-surface/95 to-transparent md:from-surface md:via-surface/80 md:to-transparent"
          aria-hidden
        />
      </div>
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Left: Copy + list, samma bakgrund som resten av sidan */}
          <div className="order-2 md:order-1 bg-surface md:bg-transparent rounded-2xl md:rounded-none md:pr-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-forest/10 text-forest px-4 py-2 text-sm font-medium mb-5">
              <Sun className="w-4 h-4" />
              Bästa priser 2026
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-forest leading-tight mb-4">
              Enklare energi,{" "}
              <span className="bg-forest-light/30 text-forest px-1 rounded">
                smartare val
              </span>
            </h1>
            <p className="text-base sm:text-lg text-forest/80 mb-6 max-w-lg">
              Hitta bästa pris och kvalité på solenergiprodukter från lokala
              installatörer.
            </p>
            <ul className="space-y-3 text-forest/80 text-base sm:text-lg mb-8">
              {bullets.map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-forest/10 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-forest" strokeWidth={2.5} />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-sm text-forest/60">
              Urval av våra installatörer – certifierade partners i hela Sverige.
            </p>
          </div>

          {/* Right: widget-bubbla ovanpå bakgrundsbilden – centrerad och något nedåt */}
          <div className="order-1 md:order-2 relative min-h-[320px] md:min-h-[380px] flex items-center justify-center pt-12 md:pt-24">
            <div className="relative w-full mx-2 md:mx-0 my-4 max-w-md rounded-2xl shadow-soft-lg border border-forest/10 bg-white">
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
                  {productOptions.map((opt, i) => (
                    <a
                      key={i}
                      href={opt.href}
                      className="group flex items-center gap-4 p-4 rounded-xl bg-surface border border-forest/10 hover:border-forest/20 hover:shadow-soft transition-all"
                    >
                      <span className="flex-shrink-0 w-10 h-10 rounded-lg bg-forest/10 flex items-center justify-center text-forest group-hover:bg-forest/15">
                        <opt.icon className="w-5 h-5" />
                      </span>
                      <span className="flex-1 font-medium text-forest">
                        {opt.label}
                      </span>
                      <ChevronRight className="w-5 h-5 text-forest/50 group-hover:text-forest group-hover:translate-x-0.5 transition-all" />
                    </a>
                  ))}
                </div>
                <a
                  href="#calculator"
                  className="mt-6 flex items-center justify-center gap-2 w-full rounded-2xl bg-forest text-white font-semibold py-3.5 shadow-soft hover:shadow-soft-lg transition-all hover:bg-forest-light"
                >
                  Jämför offerter nu
                  <ChevronRight className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
