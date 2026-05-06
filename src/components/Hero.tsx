import { Sun, ShieldCheck, BadgePercent, Timer } from "lucide-react";
import { ResponsivePicture } from "@/components/ResponsivePicture";
import { HERO_PIC_WIDTHS } from "@/lib/image-variants";
import { HeroQuoteCard } from "@/components/HeroQuoteCard";

const bullets: { text: string; Icon: typeof Sun }[] = [
  { text: "Endast trygga installatörer", Icon: ShieldCheck },
  { text: "Kostnadsfri prisförfrågan", Icon: BadgePercent },
  { text: "Spar värdefull tid", Icon: Timer },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden max-md:mt-0 max-md:pt-[max(5.5rem,calc(3.5rem+env(safe-area-inset-top,0px)))] max-md:pb-14 md:-mt-16 md:min-h-screen md:pt-28 md:pb-24">
      {/* AVIF/WebP + srcset för moderna format; PNG som fallback på <img> */}
      <div className="absolute inset-0 z-0 [&_picture]:contents" aria-hidden>
        <ResponsivePicture
          basename="/hero-solar"
          widths={HERO_PIC_WIDTHS}
          sizes="(max-width: 1280px) 100vw, 1280px"
          alt=""
          pngSrc="/hero-solar.png"
          width={1024}
          height={580}
          loading="eager"
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        {/* Gradient från vänster så att text är läsbar */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-surface via-surface/95 to-transparent md:from-surface md:via-surface/80 md:to-transparent"
          aria-hidden
        />
      </div>
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-8 md:gap-10 lg:gap-14 items-center">
          {/* Left: Copy + list, samma bakgrund som resten av sidan */}
          <div className="order-2 md:order-1 bg-surface md:bg-transparent rounded-2xl md:rounded-none md:pr-4 p-5 sm:p-0 max-md:shadow-soft">
            <div className="inline-flex items-center gap-2 rounded-full bg-forest/10 text-forest px-4 py-2 text-sm font-medium mb-5">
              <Sun className="w-4 h-4" />
              Bästa priser 2026
            </div>
            <div id="nx-speakable-hero">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-forest leading-tight mb-4">
                Enklare energi,{" "}
                <span className="bg-forest-light/30 text-forest px-1 rounded">
                  smartare val
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-forest/80 mb-6 max-w-lg">
                Hitta bästa pris och kvalité på solenergiprodukter från lokala
                installatörer.
              </p>
            </div>
            <ul className="space-y-3 text-forest/80 text-lg sm:text-xl mb-8">
              {bullets.map(({ text, Icon }, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-forest/10 flex items-center justify-center">
                    <Icon className="w-3.5 h-3.5 text-forest" strokeWidth={2.25} />
                  </span>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
            <p className="text-base sm:text-lg text-forest/60">
              Urval av våra installatörer – certifierade partners i hela Sverige.
            </p>
          </div>

          {/* Right: widget-bubbla ovanpå bakgrundsbilden – centrerad och något nedåt */}
          <div className="order-1 md:order-2 relative min-h-[300px] md:min-h-[380px] flex items-center justify-center pt-8 md:pt-24">
            <HeroQuoteCard />
          </div>
        </div>
      </div>
    </section>
  );
}
