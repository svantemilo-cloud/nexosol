"use client";

import { useState } from "react";
import { LAN_PATHS, LAN_CENTERS } from "@/data/sweden-lan-paths";

const LAN_NAMES = Object.keys(LAN_PATHS);

export function SwedenMap() {
  const [selectedLan, setSelectedLan] = useState<string | null>(null);
  const [hoverLan, setHoverLan] = useState<string | null>(null);

  return (
    <section className="py-16 px-4 sm:px-6 bg-surface scroll-mt-24">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-forest mb-2">
          Var finns du?
        </h2>
        <p className="text-forest/70 mb-6">
          Klicka på ditt län på kartan så kan vi ge dig relevant information om solceller i ditt område.
        </p>

        <div className="rounded-2xl border border-forest/10 bg-white shadow-soft-lg overflow-hidden">
          {/* Kartcontainern: fast max-h så den inte kan expandera viewporten */}
          <div className="relative w-full bg-forest/5" style={{ maxHeight: "400px" }}>
            <svg
              viewBox="0 0 100 300"
              preserveAspectRatio="xMidYMid meet"
              className="block w-full h-auto cursor-pointer"
              style={{ maxHeight: "400px", verticalAlign: "top" }}
              aria-label="Karta över Sverige – klicka på ett län"
            >
              <image
                href="/sweden-lan-map.png"
                x="0"
                y="0"
                width="100"
                height="300"
                preserveAspectRatio="xMidYMid meet"
              />
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
