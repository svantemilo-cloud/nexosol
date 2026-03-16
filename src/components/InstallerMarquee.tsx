"use client";

/**
 * Långsamt scrollande rad med installatörslogotyper.
 * Logotyperna är utklippta från en gemensam bild och ligger i public/installers/.
 */
const LOGOS = [
  { src: "/installers/nordsol.png", alt: "NordSol" },
  { src: "/installers/aura-solar.png", alt: "Aura Solar" },
  { src: "/installers/ljuskraft.png", alt: "LjusKraft" },
  { src: "/installers/helio-install.png", alt: "Helio Install" },
  { src: "/installers/takenergi.png", alt: "TakEnergi" },
  { src: "/installers/nova-panels.png", alt: "Nova Panels" },
  { src: "/installers/green-current.png", alt: "Green Current" },
  { src: "/installers/svenska-solceller.png", alt: "Svenska Solceller" },
];

export function InstallerMarquee() {
  return (
    <section className="py-8 bg-surface border-y border-forest/10">
      <p className="text-center text-sm font-medium text-forest/70 mb-6">
        Våra utvalda installatörer
      </p>
      <div className="overflow-hidden">
        <div className="installer-marquee flex w-max gap-10 px-4 items-stretch">
          {[1, 2].map((copy) => (
            <div key={copy} className="flex items-center gap-10 shrink-0">
              {LOGOS.map((logo) => (
                <div
                  key={`${copy}-${logo.src}`}
                  className="h-16 w-36 sm:h-20 sm:w-44 rounded-xl bg-surface flex items-center justify-center shrink-0 p-2 box-border"
                >
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    className="w-full h-full object-contain"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
