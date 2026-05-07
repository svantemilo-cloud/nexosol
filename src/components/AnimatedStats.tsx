"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const stats = [
  { value: 50000, suffix: " st", label: "förmedlade solcellsofferter", duration: 1.2 },
  { value: 50, suffix: " +", label: "verifierade installatörer", duration: 1.8 },
  { value: 5, suffix: " år", label: "i branschen", duration: 2.5 },
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
    <span className="inline-flex items-baseline tabular-nums text-forest" suppressHydrationWarning>
      <span>{displayValue.toLocaleString("sv-SE").replace(/\s/g, "\u00A0")}</span>
      <span>{suffix}</span>
    </span>
  );
}

export function AnimatedStats() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.25 });

  return (
    <section
      ref={sectionRef}
      className="bg-white py-14 px-4 sm:px-6 sm:py-20 lg:py-24"
      aria-labelledby="animated-stats-heading"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-12 lg:gap-14 xl:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45 }}
          className="order-1 lg:order-none lg:col-span-5"
        >
          <div className="relative aspect-square w-full max-w-md overflow-hidden rounded-[1.25rem] shadow-[0_12px_40px_rgba(0,0,0,0.08)] sm:rounded-[1.35rem] lg:max-w-none">
            <img
              src="/marketing/stats-couple-home.png"
              alt="Glad man och kvinna framför bostad"
              width={800}
              height={800}
              loading="lazy"
              decoding="async"
              className="stats-visual-cover h-full w-full object-cover object-center"
            />
          </div>
        </motion.div>

        <div className="order-2 flex flex-col justify-center lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-left"
          >
            <h2
              id="animated-stats-heading"
              className="text-balance text-2xl font-bold leading-tight tracking-tight text-forest sm:text-3xl lg:text-[2rem] xl:text-[2.125rem]"
            >
              Lönsammare investeringar i solenergi
            </h2>
            <p className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-forest/72 sm:text-lg">
              Nexosol hjälper husägare att enkelt investera i lönsamma och problemfria
              solcellsanläggningar.
            </p>
          </motion.div>

          <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-6 lg:mt-12 lg:gap-8">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.08 }}
                className="text-left"
              >
                <div className="text-3xl font-bold tracking-tight text-forest sm:text-4xl">
                  <AnimatedNumber
                    value={s.value}
                    suffix={s.suffix}
                    duration={s.duration}
                    start={inView}
                  />
                </div>
                <div
                  className="mt-3 h-0.5 w-12 rounded-full bg-forest/35"
                  aria-hidden
                />
                <p className="mt-3 text-sm leading-snug text-forest/70">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
