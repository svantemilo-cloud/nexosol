"use client";

import { ImageComparison } from "@/components/ui/image-comparison-slider";

const BEFORE_SRC = "/comparison/house-before-no-panels.png";
const AFTER_SRC = "/comparison/house-after-with-panels.png";

/**
 * Tvåspalts‑layout: copy vänster, före/efter‑slider som fyller avrundad yta höger (“bubblan”).
 */
export function SolarHouseComparison() {
  return (
    <section
      className="border-y border-forest/10 bg-white py-14 sm:py-20 lg:py-24"
      aria-labelledby="solar-comparison-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:items-center lg:gap-14 xl:gap-16">
          <div className="max-w-lg lg:max-w-none lg:justify-self-start">
            <p className="text-xl font-semibold leading-tight text-forest-light sm:text-2xl">
              Så enkelt är det.
            </p>
            <h2
              id="solar-comparison-heading"
              className="mt-5 text-balance font-bold leading-[1.12] tracking-tight text-forest sm:text-4xl xl:text-[2.65rem]"
            >
              <span className="block">
                Begär offert{" "}
                <span className="whitespace-nowrap">snabbt och enkelt</span>
              </span>
              <span className="mt-3 block text-[1.35rem] sm:mt-4 sm:text-3xl xl:text-[2.125rem]">
                Få bästa lösningen för dig
              </span>
            </h2>
            <p className="mt-6 text-pretty leading-relaxed text-forest/72 sm:text-lg">
              Dra reglaget i bildrutan bredvid —{" "}
              <span className="font-medium text-forest/85">med paneler till vänster</span>,
              utan till höger, för samma hus på taket.
            </p>
            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm font-medium text-forest/68">
              <span className="flex items-center gap-2">
                <span className="inline-block size-2.5 rounded-full bg-forest" aria-hidden />
                Med solceller
              </span>
              <span className="flex items-center gap-2">
                <span className="inline-block size-2.5 rounded-full bg-forest/35" aria-hidden />
                Utan solceller
              </span>
            </div>
          </div>

          {/* Bubbla — neutral bakgrund / avrunding; sliderfyllning */}
          <div className="relative w-full lg:justify-self-end">
            <div
              className="relative flex aspect-[4/3] w-full min-h-[200px] overflow-hidden rounded-[1.625rem] border border-neutral-200/95 bg-neutral-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] sm:rounded-[2rem] lg:aspect-[16/11] lg:max-h-[min(560px,72vh)]"
            >
              <ImageComparison
                beforeImage={BEFORE_SRC}
                afterImage={AFTER_SRC}
                altBefore="Samma hus med obestruket tak utan solpaneler"
                altAfter="Samma hus med solceller installerade på taket"
                afterOnLeft
                className="min-h-0 flex-1 rounded-none border-0 shadow-none"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
