"use client";

import type { ReactNode } from "react";
import { QuoteQuizProvider } from "@/components/quote-quiz/QuoteQuizProvider";
import { CookieBanner } from "@/components/cookies/CookieBanner";

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <QuoteQuizProvider>
      {children}
      <CookieBanner />
    </QuoteQuizProvider>
  );
}
