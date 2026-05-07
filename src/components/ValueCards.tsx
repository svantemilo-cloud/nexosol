"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Gift, Clock } from "lucide-react";

const cards = [
  {
    icon: ShieldCheck,
    title: "Kvalitetssäkrade installatörer",
    description: "Certifierade partners med dokumenterad erfarenhet.",
  },
  {
    icon: Gift,
    title: "100% Gratis",
    description: "Ingen kostnad eller köptvång – helt utan förpliktelser.",
  },
  {
    icon: Clock,
    title: "Snabbt svar",
    description: "Offerter inom 48 timmar från våra partners.",
  },
];

export function ValueCards() {
  return (
    <section
      id="om-oss"
      className="relative overflow-hidden py-16 px-4 sm:px-6 scroll-mt-24 bg-[#0b0f0d]"
    >
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-forest/30 blur-3xl" />
        <div className="absolute -bottom-48 right-[-120px] h-[520px] w-[520px] rounded-full bg-emerald-500/20 blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white text-center tracking-tight">
          Varför välja Nexosol?
        </h2>
        <p className="mt-3 text-sm sm:text-base text-white/70 text-center max-w-2xl mx-auto">
          Vi gör det enkelt att jämföra offerter från lokala installatörer — tryggt, snabbt och utan bindning.
        </p>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <motion.article
              key={card.title}
              initial={false}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
              className="group rounded-2xl border border-white/10 bg-white/5 p-8 shadow-[0_10px_30px_rgba(0,0,0,0.25)] backdrop-blur-sm transition-colors hover:bg-white/7"
            >
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-emerald-200">
                <card.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-white">{card.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/70">{card.description}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
