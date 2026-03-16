"use client";

import { motion } from "framer-motion";
import { PenLine, MailCheck, Scale } from "lucide-react";

const steps = [
  {
    step: 1,
    icon: PenLine,
    title: "Fyll i en förfrågan",
    description:
      "Berätta om dina krav och önskemål – vi matchar dig med de bäst lämpade installatörerna.",
  },
  {
    step: 2,
    icon: MailCheck,
    title: "Få svar från installatörer",
    description:
      "Upp till 4 kvalitetssäkrade installatörer kontaktar dig med skräddarsydda offerter.",
  },
  {
    step: 3,
    icon: Scale,
    title: "Välj ditt erbjudande",
    description:
      "Jämför erbjudandena och välj den bästa lösningen – tryggt och utan förpliktelser.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 px-4 sm:px-6 bg-forest/[0.04] scroll-mt-20">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl sm:text-3xl font-bold text-forest text-center mb-3"
        >
          Så fungerar det
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-forest/80 mb-10 max-w-xl mx-auto"
        >
          Med Nexosol hittar du enkelt bästa priset på solenergi från{" "}
          <strong>pålitliga installatörer</strong>.
        </motion.p>
        <div className="grid sm:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <motion.article
              key={s.step}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.1 }}
              className="rounded-2xl bg-white p-6 shadow-soft border border-forest/5"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="w-10 h-10 rounded-xl bg-forest/10 flex items-center justify-center text-forest">
                  <s.icon className="w-5 h-5" />
                </span>
                <span className="text-sm font-semibold text-forest">
                  Steg {s.step}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-forest mb-2">
                {s.title}
              </h3>
              <p className="text-forest/70 text-sm">{s.description}</p>
            </motion.article>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <a
            href="#calculator"
            className="inline-flex items-center justify-center rounded-2xl bg-forest text-white font-semibold px-8 py-3.5 shadow-soft hover:shadow-soft-lg transition-all hover:bg-forest-light"
          >
            Få prisförslag
          </a>
        </motion.div>
      </div>
    </section>
  );
}
