import { ResponsivePicture } from "@/components/ResponsivePicture";
import { QuoteQuizLink } from "@/components/quote-quiz/QuoteQuizLink";
import { COMPARE_PIC_WIDTHS } from "@/lib/image-variants";

/**
 * Stor CTA-kort med gradientbakgrund, rubrik med accentfärg,
 * underrubrik, knapp och bild – "Jämför 4 offerter på 60 sekunder".
 */
export function CompareCard() {
  return (
    <section id="compare" className="px-3 sm:px-4 md:px-6 py-10 sm:py-12 scroll-mt-24">
      <div className="max-w-6xl mx-auto">
        <div
          className="overflow-hidden rounded-[2rem] flex flex-col md:flex-row min-h-[340px] md:min-h-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 80% at 50% 50%, #ffffff 0%, #fff5f2 40%, #ffebe5 100%)",
          }}
        >
          {/* Bild till vänster (desktop); under texten på mobil */}
          <div className="relative order-2 min-h-[280px] w-full shrink-0 md:order-1 md:min-h-[360px] md:w-[40%]">
            <div className="absolute inset-4 rounded-2xl shadow-soft-lg md:inset-6 [&_picture]:contents overflow-hidden">
              <ResponsivePicture
                basename="/compare-hero"
                widths={COMPARE_PIC_WIDTHS}
                sizes="(max-width: 768px) 100vw, 40vw"
                alt="Installatör och kund i samtal framför hus med solceller på taket"
                pngSrc="/compare-hero.png"
                width={1024}
                height={682}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover object-center"
              />
            </div>
          </div>

          {/* Text + knapp till höger (desktop); över bilden på mobil */}
          <div className="order-1 flex flex-1 flex-col justify-center p-6 sm:p-10 md:order-2 md:max-w-[60%] md:p-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-forest leading-tight mb-4">
              Jämför{" "}
              <span className="font-semibold text-forest-light">4 offerter</span>{" "}
              på 60 sekunder
            </h2>
            <p className="text-base sm:text-lg text-forest/70 mb-8 max-w-lg">
              Fyll i dina uppgifter en gång — vi matchar dig med lokala
              installatörer som tävlar om ditt projekt.
            </p>
            <QuoteQuizLink
              href="#calculator"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-forest text-white font-semibold text-lg px-8 py-4 w-full sm:w-auto shadow-soft hover:bg-forest-light hover:shadow-soft-lg transition-shadow"
            >
              Starta jämförelsen →
            </QuoteQuizLink>
          </div>
        </div>
      </div>
    </section>
  );
}
