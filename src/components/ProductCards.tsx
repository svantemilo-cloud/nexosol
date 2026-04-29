"use client";

import { motion } from "framer-motion";
import { Sun, Battery, Plug, ArrowRight } from "lucide-react";

const products = [
  {
    title: "Solceller",
    link: "#calculator",
    linkText: "Få offert",
    icon: Sun,
    image: "/products/solceller.png",
  },
  {
    title: "Solcellsbatteri",
    link: "#calculator",
    linkText: "Få offert",
    icon: Battery,
    image: "/products/solcellsbatteri.png",
  },
  {
    title: "Laddbox",
    link: "#calculator",
    linkText: "Få offert",
    icon: Plug,
    image: "/products/laddbox.png",
  },
];

export function ProductCards() {
  return (
    <section
      id="products"
      className="py-12 sm:py-16 px-4 sm:px-6 scroll-mt-[calc(3.5rem+env(safe-area-inset-top,0px))] md:scroll-mt-24"
    >
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl sm:text-3xl font-bold text-forest text-center mb-10"
        >
          Våra produkter
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p, i) => (
            <motion.article
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.08 }}
              className="group relative rounded-2xl overflow-hidden min-h-[320px] sm:min-h-[380px] border border-forest/10 shadow-soft hover:shadow-soft-lg transition-all"
            >
              {/* Bakgrundsbild fyller hela kortet */}
              <div
                className="absolute inset-0 bg-forest/10 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${p.image})`,
                }}
              />
              {/* Mörk overlay så att texten är läsbar */}
              <div className="absolute inset-0 bg-gradient-to-t from-forest/90 via-forest/40 to-forest/10" />
              <div className="absolute inset-0 bg-gradient-to-b from-forest/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <a
                href={p.link}
                className="absolute inset-0 flex flex-col justify-end p-6 text-white"
              >
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-white/90 flex items-center justify-center mb-3 text-forest">
                    <p.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-1 drop-shadow-sm">
                    {p.title}
                  </h3>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-white/90 group-hover:text-white">
                    {p.linkText}
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </a>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
