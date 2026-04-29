"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Hur många solpaneler behöver jag?",
    answer:
      "Antalet beror på din årsförbrukning och takyta. Med vår kalkylator kan du få en uppskattning. Vanligtvis räcker 10–20 paneler för en villa med normal förbrukning.",
  },
  {
    question: "Vad kostar solceller 2025/2026?",
    answer:
      "Priserna varierar med systemstorlek och installatör. Ett typiskt system för villa ligger ofta mellan 80 000–200 000 kr inklusive installation. Få exakta offerter genom Nexosol.",
  },
  {
    question: "Behöver jag batteri?",
    answer:
      "Batteri är valfritt. Det ger större självförsörjning och möjlighet att använda solen på kvällen. Vår kalkylator visar ROI med och utan batteri så du kan jämföra.",
  },
  {
    question: "Hur länge håller ett solcellssystem?",
    answer:
      "Kvalitativa paneler har ofta 25 års garanti och kan producera bra i 30+ år. Växelriktare byts vanligtvis efter cirka 10–15 år.",
  },
];

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-16 px-4 sm:px-6 scroll-mt-24">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-forest mb-8 text-center">
          Vanliga frågor
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              layout
              className="rounded-2xl bg-white border border-forest/10 shadow-soft overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left font-medium text-forest hover:bg-forest/5 transition-colors"
              >
                {faq.question}
                <motion.span
                  animate={{ rotate: openIndex === i ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-5 h-5 text-forest/70" />
                </motion.span>
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-forest/80">{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
