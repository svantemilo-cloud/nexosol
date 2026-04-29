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
    <section id="om-oss" className="py-16 px-4 sm:px-6 scroll-mt-24">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <motion.article
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="rounded-2xl bg-white p-8 shadow-soft hover:shadow-soft-lg transition-shadow border border-forest/5"
            >
              <div className="w-12 h-12 rounded-xl bg-forest/10 flex items-center justify-center mb-4">
                <card.icon className="w-6 h-6 text-forest" />
              </div>
              <h3 className="text-xl font-semibold text-forest mb-2">
                {card.title}
              </h3>
              <p className="text-forest/70">{card.description}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
