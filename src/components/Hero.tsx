"use client";

import { ResponsivePicture } from "@/components/ResponsivePicture";
import { HERO_PIC_WIDTHS } from "@/lib/image-variants";
import { useQuoteQuiz } from "@/components/quote-quiz/QuoteQuizProvider";
import { useAddressSuggest } from "@/hooks/use-address-suggest";
import { useState } from "react";

export function Hero() {
  const { openQuiz } = useQuoteQuiz();
  const [addrInput, setAddrInput] = useState("");
  const {
    suggestions,
    open: suggestOpen,
    setOpen: setSuggestOpen,
    loading: suggestLoading,
    locked: suggestLocked,
    pickSuggestion: finalizeSuggestPick,
    unlock: unlockSuggest,
  } = useAddressSuggest(addrInput);

  function submitAddress(e: React.FormEvent) {
    e.preventDefault();
    const a = addrInput.trim();
    openQuiz(a.length >= 4 ? { initialAddress: a } : undefined);
  }

  return (
    <section
      className="relative isolate -mt-14 flex min-h-[calc(100dvh+env(safe-area-inset-bottom,0px))] flex-col overflow-x-clip md:-mt-16"
      aria-labelledby="hero-heading"
    >
      <div
        className="absolute inset-0 z-0 min-h-[calc(100dvh+env(safe-area-inset-bottom,0px))]"
        aria-hidden
      >
        <div className="relative size-full [&_picture]:contents">
          <ResponsivePicture
            basename="/hero-solar"
            widths={HERO_PIC_WIDTHS}
            sizes="100vw"
            alt=""
            pngSrc="/hero-solar.png"
            width={1024}
            height={585}
            loading="eager"
            fetchPriority="high"
            className="hero-fullbleed absolute inset-0 size-full origin-center scale-[1.02] object-cover object-[48%_42%] sm:scale-[1.025] lg:scale-[1.018] lg:object-[50%_40%] xl:object-[52%_38%]"
          />
        </div>
        {/* Diskret läsbarhetsgradient: tätare till vänster så huset syns till höger */}
        <div
          className="absolute inset-0 z-[1] bg-gradient-to-b from-black/25 via-black/15 to-black/55 md:bg-[linear-gradient(105deg,rgba(10,30,28,0.88)_0%,rgba(10,30,28,0.55)_38%,rgba(10,30,28,0.18)_58%,rgba(10,30,28,0.05)_100%)]"
          aria-hidden
        />
        <div
          className="absolute inset-0 z-[1] bg-gradient-to-t from-black/45 via-transparent to-black/25 md:hidden"
          aria-hidden
        />
      </div>

      <div
        className="relative z-10 mx-auto grid min-h-0 w-full max-w-[1600px] flex-1 grid-cols-1 px-5 pt-[max(5.25rem,calc(3.5rem+env(safe-area-inset-top)))] sm:px-8 md:px-10 md:pt-[max(5.5rem,calc(4rem+env(safe-area-inset-top)))] lg:grid-cols-12 lg:gap-8 lg:px-12 lg:pt-[max(5.75rem,calc(4.25rem+env(safe-area-inset-top)))] xl:px-16 2xl:px-20"
        id="nav-scroll-trigger"
      >
        {/* Vänster kolumn ~40–50 %: rubrik, lead, sökfält */}
        <div className="flex flex-col justify-end pb-12 sm:pb-16 lg:col-span-6 lg:justify-center lg:pb-20 lg:pt-8 xl:col-span-5">
          <div id="nx-speakable-hero" className="max-w-xl">
            <h1
              id="hero-heading"
              className="text-balance text-[1.75rem] font-bold leading-[1.15] tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)] sm:text-4xl md:text-[2.35rem] md:leading-tight lg:text-[2.6rem] xl:text-[2.75rem]"
            >
              Solceller: en smart investering
            </h1>
            <p className="mt-4 max-w-[26rem] text-pretty text-[0.9375rem] font-normal leading-relaxed text-white/95 drop-shadow-[0_1px_4px_rgba(0,0,0,0.35)] sm:text-base md:mt-5 md:text-lg md:leading-relaxed">
              Skriv in din adress och få en offert direkt – därefter kontaktar en
              av våra experter dig för att berätta mer.
            </p>
          </div>

          <form
            className="relative mt-7 w-full max-w-md md:mt-9 md:max-w-lg"
            onSubmit={submitAddress}
            data-testid="hero-address-form"
          >
            <label htmlFor="hero-address" className="sr-only">
              Ange din adress
            </label>
            <input
              id="hero-address"
              name="address"
              type="search"
              role="combobox"
              autoComplete="street-address"
              aria-autocomplete="list"
              aria-expanded={suggestOpen && suggestions.length > 0}
              aria-controls={
                suggestOpen && suggestions.length > 0 ? "hero-address-suggestions" : undefined
              }
              placeholder="Ange din adress"
              value={addrInput}
              onChange={(e) => {
                unlockSuggest();
                setAddrInput(e.target.value);
              }}
              onFocus={() => {
                if (!suggestLocked && suggestions.length > 0) setSuggestOpen(true);
              }}
              onBlur={() => {
                window.setTimeout(() => setSuggestOpen(false), 120);
              }}
              className="w-full appearance-none rounded-full border-0 bg-white py-[0.95rem] pl-5 pr-[3.35rem] text-[0.9375rem] text-forest shadow-[0_2px_12px_rgba(0,0,0,0.2)] outline-none ring-2 ring-transparent transition-shadow placeholder:text-forest/40 focus:bg-white focus:shadow-[0_4px_20px_rgba(0,0,0,0.18)] focus:ring-forest/40 sm:py-4 sm:pl-6 sm:pr-14 sm:text-lg"
            />
            {suggestOpen && suggestions.length > 0 ? (
              <ul
                id="hero-address-suggestions"
                role="listbox"
                aria-label="Adressförslag från din sökning"
                className="absolute left-0 right-0 top-[calc(100%+0.375rem)] z-[60] max-h-[min(16rem,42dvh)] overflow-y-auto rounded-2xl border border-black/12 bg-white py-1.5 shadow-[0_8px_28px_rgba(0,0,0,0.16)] ring-1 ring-black/[0.04]"
              >
                {suggestions.map((line) => (
                  <li key={line} role="none">
                    <button
                      type="button"
                      role="option"
                      className="w-full px-4 py-2.5 text-left text-[0.9375rem] leading-snug text-forest transition-colors hover:bg-forest/10 focus:bg-forest/15 focus:outline-none sm:text-base"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        setAddrInput(line);
                        finalizeSuggestPick();
                      }}
                    >
                      {line}
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
            {suggestLoading ? (
              <p className="mt-2 text-xs font-medium text-white/80 drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]">
                Söker adresser…
              </p>
            ) : null}
            <button
              type="submit"
              aria-label="Fortsätt med adressen"
              className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-forest text-white shadow-md transition hover:bg-forest-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:right-2.5 sm:h-11 sm:w-11"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                fill="none"
                viewBox="0 0 14 11"
                aria-hidden
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M1.667 5.667h10.667m0 0-4 4m4-4-4-4"
                />
              </svg>
            </button>
          </form>
        </div>

        {/* Höger halva: fri yta så huset i bilden får spelrum (dold cell på mobil) */}
        <div
          className="pointer-events-none hidden min-h-0 lg:col-span-6 lg:block xl:col-span-7"
          aria-hidden
        />
      </div>
    </section>
  );
}
