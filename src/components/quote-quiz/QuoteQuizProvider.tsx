"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Calculator, type SolutionKey } from "@/components/Calculator";

export type QuoteQuizOpenOptions = {
  solution?: SolutionKey;
};

type QuoteQuizContextValue = {
  openQuiz: (opts?: QuoteQuizOpenOptions) => void;
  closeQuiz: () => void;
};

const QuoteQuizContext = createContext<QuoteQuizContextValue | null>(null);

export function useQuoteQuiz(): QuoteQuizContextValue {
  const ctx = useContext(QuoteQuizContext);
  if (!ctx) {
    throw new Error("useQuoteQuiz must be used within QuoteQuizProvider");
  }
  return ctx;
}

function QuoteQuizModal({
  openOptions,
  onClose,
}: {
  openOptions: QuoteQuizOpenOptions | undefined;
  onClose: () => void;
}) {
  const titleId = useId();

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end justify-center sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
        aria-label="Stäng formulär"
        onClick={onClose}
      />
      <div className="relative z-10 flex max-h-[min(92dvh,920px)] w-full max-w-[640px] flex-col overflow-hidden rounded-t-3xl border border-forest/10 bg-[#f4f6f4] shadow-2xl sm:rounded-3xl md:max-w-[860px]">
        <div className="flex shrink-0 items-center justify-between border-b border-forest/10 bg-white/95 px-4 py-3 backdrop-blur-sm">
          <span id={titleId} className="text-lg font-bold text-forest">
            Nexosol
          </span>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-forest/70 transition-colors hover:bg-forest/10 hover:text-forest"
            aria-label="Stäng"
            onClick={onClose}
          >
            <span className="text-2xl leading-none" aria-hidden>
              ×
            </span>
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <Calculator
            variant="modal"
            initialSolution={openOptions?.solution}
            onRequestClose={onClose}
          />
        </div>
      </div>
    </div>
  );
}

export function QuoteQuizProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [openOptions, setOpenOptions] = useState<QuoteQuizOpenOptions | undefined>();

  const openQuiz = useCallback((opts?: QuoteQuizOpenOptions) => {
    setOpenOptions(opts);
    setOpen(true);
  }, []);

  const closeQuiz = useCallback(() => {
    setOpen(false);
    setOpenOptions(undefined);
  }, []);

  const value = useMemo(
    () => ({ openQuiz, closeQuiz }),
    [openQuiz, closeQuiz],
  );

  return (
    <QuoteQuizContext.Provider value={value}>
      {children}
      {open ? (
        <QuoteQuizModal openOptions={openOptions} onClose={closeQuiz} />
      ) : null}
    </QuoteQuizContext.Provider>
  );
}
