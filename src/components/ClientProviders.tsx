"use client";

import type { ReactNode } from "react";
import { QuoteQuizProvider } from "@/components/quote-quiz/QuoteQuizProvider";

export function ClientProviders({ children }: { children: ReactNode }) {
  return <QuoteQuizProvider>{children}</QuoteQuizProvider>;
}
