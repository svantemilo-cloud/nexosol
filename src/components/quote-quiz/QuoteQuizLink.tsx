"use client";

import type { ComponentPropsWithoutRef } from "react";
import type { SolutionKey } from "@/components/Calculator";
import type { QuoteQuizOpenOptions } from "./QuoteQuizProvider";
import { useQuoteQuiz } from "./QuoteQuizProvider";

export type QuoteQuizLinkProps = ComponentPropsWithoutRef<"a"> & {
  solution?: SolutionKey;
};

export function QuoteQuizLink({
  href = "#calculator",
  solution,
  className,
  children,
  onClick,
  ...rest
}: QuoteQuizLinkProps) {
  const { openQuiz } = useQuoteQuiz();

  return (
    <a
      href={href}
      className={className}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        e.preventDefault();
        const opts: QuoteQuizOpenOptions | undefined = solution
          ? { solution }
          : undefined;
        openQuiz(opts);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
