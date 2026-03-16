"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const INFO_LINKS = [
  { href: "/artiklar", label: "Kunskapsbank" },
  { href: "/artiklar", label: "Pris & ekonomi" },
  { href: "/#calculator", label: "Kalkylator" },
  { href: "/#how-it-works", label: "Så fungerar det" },
];

const LAGAR_LINKS = [
  {
    href: "/artiklar",
    label: "60-öresregeln",
    description: "Vad gäller för 60-öre och elcertifikat när du säljer solel?",
  },
  {
    href: "/artiklar",
    label: "Bidrag och stöd",
    description: "ROT-avdrag, elcertifikat och andra stöd för solceller.",
  },
  {
    href: "/artiklar",
    label: "Bygglov och regler",
    description: "När behöver du bygglov för solceller på taket?",
  },
];

const FAQ_LINKS = [
  { href: "/#faq", label: "Vanliga frågor om offerter" },
  { href: "/artiklar/ar-solceller-lonsamt", label: "Är solceller lönsamt?" },
  { href: "/artiklar/vad-kostar-solceller", label: "Vad kostar solceller?" },
  { href: "/artiklar/hur-mycket-solceller-behover-jag", label: "Hur mycket behöver jag?" },
];

export function MegaMenu() {
  return (
    <motion.div
        id="mega-menu"
        role="dialog"
        aria-label="Meny: Lär dig mer"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="absolute left-0 right-0 top-full pt-1 bg-white rounded-b-2xl border-x border-b border-gray-200/80 w-full"
        style={{ boxShadow: "0 12px 48px rgba(0,0,0,0.1), 0 4px 16px rgba(0,0,0,0.06)" }}
      >
        <div className="max-w-7xl mx-auto px-8 sm:px-12 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-14">
            {/* Kolumn 1: Information */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">
                Information
              </h3>
              <ul className="space-y-0.5">
                {INFO_LINKS.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-gray-900 hover:text-coral transition-colors cursor-pointer block py-2.5 px-3 -mx-3 rounded-lg hover:bg-gray-50"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Kolumn 2: Lagar och regler */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">
                Lagar och regler
              </h3>
              <ul className="space-y-3">
                {LAGAR_LINKS.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="group block py-2.5 px-3 -mx-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <span className="text-gray-900 font-medium group-hover:text-coral transition-colors">
                        {item.label}
                      </span>
                      <p className="text-sm text-gray-600 mt-0.5 cursor-default">
                        {item.description}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Kolumn 3: Vanliga frågor */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">
                Vanliga frågor
              </h3>
              <ul className="space-y-0.5">
                {FAQ_LINKS.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-gray-900 hover:text-coral transition-colors cursor-pointer block py-2.5 px-3 -mx-3 rounded-lg hover:bg-gray-50"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Kolumn 4: CTA */}
            <div className="sm:col-span-2 lg:col-span-1 lg:flex lg:flex-col">
              <div className="bg-coral/5 rounded-xl p-5 border border-coral/10">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
                  Få ytterligare kunskap?
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Guider om solceller, pris, lönsamhet och underhåll.
                </p>
                <Link
                  href="/artiklar"
                  className="inline-flex items-center justify-center rounded-xl bg-coral text-white font-semibold px-5 py-3 hover:opacity-95 active:scale-[0.98] transition-all cursor-pointer text-sm w-full"
                >
                  Besök kunskapsbanken
                </Link>
              </div>
            </div>
        </div>
      </div>
    </motion.div>
  );
}
