"use client";

import Image from "next/image";
import { useState } from "react";
import { LAN_PATHS, LAN_CENTERS } from "@/data/sweden-lan-paths";

const LAN_NAMES = Object.keys(LAN_PATHS);

export function SwedenMap() {
  const [selectedLan, setSelectedLan] = useState<string | null>(null);
  const [hoverLan, setHoverLan] = useState<string | null>(null);

  return (
    <section className="py-16 px-4 sm:px-6 bg-surface scroll-mt-24">
      <div className="max-w-2xl mx-auto">
        <h2 id="sweden-map-heading" className="text-2xl font-bold text-forest mb-2">
          Var finns du?
        </h2>
        <p className="text-forest/70 mb-6">
          Klicka på ditt län på kartan så kan vi ge dig relevant information om solceller i ditt område.
        </p>

        <div className="rounded-2xl border border-forest/10 bg-white shadow-soft-lg overflow-hidden [container-type:inline-size]">
          {/* Höjd = min(400px, 3×containerns bredd) samma proportion som viewBox 100×300 för korrekt klickmotiv */}
          <div
            className="relative mx-auto w-full bg-forest/5"
            style={{
              height: "min(400px, calc(100cqw * 300 / 100))",
            }}
            role="group"
            aria-labelledby="sweden-map-heading"
          >
            <Image
              src="/sweden-lan-map.png"
              alt="Karta över Sveriges län"
              fill
              className="object-contain object-center select-none pointer-events-none"
              sizes="(max-width: 672px) calc(100vw - 3rem), 672px"
              loading="lazy"
            />
            <svg
              viewBox="0 0 100 300"
              preserveAspectRatio="xMidYMid meet"
              className="pointer-events-auto absolute inset-0 h-full w-full cursor-pointer"
            >
                {LAN_NAMES.map((lan) => (
                  <path
                  key={lan}
                  d={LAN_PATHS[lan]}
                  fill={
                    selectedLan === lan
                      ? "rgba(6, 90, 69, 0.35)"
                      : hoverLan === lan
                        ? "rgba(6, 90, 69, 0.15)"
                        : "transparent"
                  }
                  stroke="rgba(6, 90, 69, 0.5)"
                  strokeWidth={0.4}
                  className="transition-[fill] duration-150"
                  onMouseEnter={() => setHoverLan(lan)}
                  onMouseLeave={() => setHoverLan(null)}
                  onClick={() => setSelectedLan(selectedLan === lan ? null : lan)}
                  aria-label={`Välj ${lan}`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedLan(selectedLan === lan ? null : lan);
                    }
                  }}
                />
                ))}
                {selectedLan && LAN_CENTERS[selectedLan] && (
                  <g
                    transform={`translate(${LAN_CENTERS[selectedLan][0]}, ${LAN_CENTERS[selectedLan][1]})`}
                    aria-hidden
                  >
                    <circle
                      r={4}
                      fill="var(--forest, #065a45)"
                      stroke="#fff"
                      strokeWidth={1.5}
                    />
                    <circle r={1.2} fill="#fff" />
                  </g>
                )}
              </svg>
          </div>

          {selectedLan && (
            <div className="p-4 border-t border-forest/10 bg-forest/5 text-sm text-forest">
              Du har valt <strong>{selectedLan}</strong>. Vi har installatörer i hela Sverige.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
