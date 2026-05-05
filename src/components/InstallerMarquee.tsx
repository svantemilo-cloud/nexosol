"use client";

import { ResponsivePicture } from "@/components/ResponsivePicture";
import { INSTALLER_LOGO_WIDTHS } from "@/lib/image-variants";

/**
 * Långsamt scrollande rad med installatörslogotyper.
 * Logotyperna är utklippta från en gemensam bild och ligger i public/installers/.
 */
/** Källfiler i public/installers/ är 256×279 px (utom ev. legacy). */
const LOGO_SIZE = { width: 256, height: 279 } as const;

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
                  className="flex h-16 w-36 sm:h-20 sm:w-44 shrink-0 items-center justify-center rounded-xl bg-surface p-2 box-border [&_picture]:contents"
                >
                  <ResponsivePicture
                    basename={logo.src.replace(/\.png$/i, "")}
                    widths={INSTALLER_LOGO_WIDTHS}
                    sizes="(max-width: 640px) 144px, 176px"
                    alt={logo.alt}
                    pngSrc={logo.src}
                    width={LOGO_SIZE.width}
                    height={LOGO_SIZE.height}
                    loading="lazy"
                    className="max-h-full max-w-full object-contain object-center"
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
