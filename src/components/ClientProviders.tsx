"use client";

import type { ReactNode } from "react";
import { QuoteQuizProvider } from "@/components/quote-quiz/QuoteQuizProvider";
import { CookieBanner } from "@/components/cookies/CookieBanner";
import { GtmClient } from "@/components/cookies/GtmClient";

export function ClientProviders({
  children,
  gtmId,
}: {
  children: ReactNode;
  gtmId?: string;
}) {
  return (
    <QuoteQuizProvider>
      <GtmClient gtmId={gtmId} />
      {children}
      <CookieBanner />
    </QuoteQuizProvider>
  );
}
