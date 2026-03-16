"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const stats = [
  { value: 50000, suffix: "st", label: "förmedlade solcellsofferter", duration: 1.2 },
  { value: 50, suffix: "+", label: "verifierade installatörer", duration: 1.8 },
  { value: 5, suffix: "år", label: "i branschen", duration: 2.5 },
];

function AnimatedNumber({
  value,
  suffix,
  duration,
  start,
}: {
  value: number;
  suffix: string;
  duration: number;
  start: boolean;
}) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    let rafId: number;

    const tick = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const elapsed = (timestamp - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      setDisplayValue(Math.round(progress * value));
      if (progress < 1) rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [start, value, duration]);

  return (
    <span className="inline-flex items-baseline" suppressHydrationWarning>
      <span>{displayValue.toLocaleString("sv-SE")}</span>
      <span className="ml-0.5">{suffix}</span>
    </span>
  );
}

export function AnimatedStats() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.3 });

  return (
    <section ref={sectionRef} className="py-16 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-forest mb-3">
            Lönsammare investeringar i solenergi
          </h2>
          <p className="text-forest/80 mb-10 max-w-xl mx-auto">
            Nexosol hjälper husägare att investera i lönsamma och problemfria
            solcellsanläggningar.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl sm:text-4xl font-bold text-forest mb-1">
                <AnimatedNumber
                  value={s.value}
                  suffix={s.suffix}
                  duration={s.duration}
                  start={inView}
                />
              </div>
              <div
                className="h-1 w-12 mx-auto rounded-full mb-3"
                style={{ backgroundColor: "rgba(6, 78, 59, 0.2)" }}
              />
              <p className="text-sm text-forest/70">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
