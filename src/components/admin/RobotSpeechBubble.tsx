"use client";

import { useEffect, useMemo, useState } from "react";

function pickRandom<T>(arr: T[]): T | null {
  if (!arr.length) return null;
  return arr[Math.floor(Math.random() * arr.length)] ?? null;
}

export function RobotSpeechBubble({
  quotes,
  className,
  signature,
}: {
  quotes: string[];
  className?: string;
  signature?: string;
}) {
  const clean = useMemo(
    () => quotes.map((q) => q.trim()).filter(Boolean).slice(0, 5),
    [quotes]
  );
  const [quote, setQuote] = useState<string>(() => pickRandom(clean) ?? "");

  useEffect(() => {
    setQuote(pickRandom(clean) ?? "");
  }, [clean]);

  useEffect(() => {
    if (clean.length <= 1) return;
    const t = window.setInterval(() => {
      setQuote((prev) => {
        const next = pickRandom(clean) ?? "";
        return next === prev ? (pickRandom(clean) ?? next) : next;
      });
    }, 9000);
    return () => window.clearInterval(t);
  }, [clean]);

  if (!quote) return null;

  return (
    <div className={className}>
      <div className="relative rounded-2xl bg-zinc-800/70 border border-zinc-700 px-4 py-3 text-sm text-zinc-100 leading-relaxed">
        <div className="absolute -left-2 top-5 w-3 h-3 bg-zinc-800/70 border-l border-b border-zinc-700 rotate-45" />
        <span>{quote}</span>
        {signature ? (
          <div className="mt-2 text-xs text-zinc-400">— {signature}</div>
        ) : null}
      </div>
    </div>
  );
}

