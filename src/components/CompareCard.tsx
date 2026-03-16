import Link from "next/link";
import Image from "next/image";

/**
 * Stor CTA-kort med gradientbakgrund, rubrik med accentfärg,
 * underrubrik, knapp och bild – "Jämför 4 offerter på 60 sekunder".
 */
export function CompareCard() {
  return (
    <section className="px-3 sm:px-4 md:px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <div
          className="overflow-hidden rounded-[2rem] flex flex-col md:flex-row min-h-[340px] md:min-h-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 80% at 50% 50%, #ffffff 0%, #fff5f2 40%, #ffebe5 100%)",
          }}
        >
          {/* Vänster kolumn: text + knapp */}
          <div className="flex-1 flex flex-col justify-center p-8 sm:p-10 md:p-12 md:max-w-[60%]">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-forest leading-tight mb-4">
              Jämför{" "}
              <span className="text-coral">4 offerter</span>{" "}
              på 60 sekunder
            </h2>
            <p className="text-base sm:text-lg text-forest/70 mb-8 max-w-lg">
              Fyll i dina uppgifter en gång — vi matchar dig med lokala
              installatörer som tävlar om ditt projekt.
            </p>
            <Link
              href="#calculator"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-coral text-white font-semibold text-lg px-8 py-4 w-full sm:w-auto hover:opacity-95 transition-opacity"
            >
              Starta jämförelsen →
            </Link>
          </div>

          {/* Höger kolumn: bild i rundad container */}
          <div className="relative w-full md:w-[40%] min-h-[280px] md:min-h-[360px] flex-shrink-0">
            <div className="absolute inset-4 md:inset-6 rounded-2xl overflow-hidden shadow-soft-lg">
              <Image
                src="/compare-hero.png"
                alt="Installatör och kund i samtal framför hus med solceller på taket"
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 40vw"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
