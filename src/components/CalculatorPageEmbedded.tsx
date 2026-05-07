"use client";

import { useMemo, useState, type ReactNode, type CSSProperties } from "react";
import {
  Award,
  BadgePercent,
  Download,
  Mail,
  Receipt,
  Sprout,
  Sun,
  Wallet,
  Zap,
  TrendingUp,
  Share2,
  CarFront,
  Footprints,
  Info,
} from "lucide-react";
import { CalculatorPageLayout } from "@/components/CalculatorPageLayout";
import { useQuoteQuiz } from "@/components/quote-quiz/QuoteQuizProvider";
import { useAddressSuggest } from "@/hooks/use-address-suggest";
import "./calculator-nx.css";

type SolutionKey = "solceller" | "batteri" | "kombination";

type HomeTime = "all" | "part" | "night";
type ResultsTab = "besparing" | "el" | "utslapp" | "system";

/** Solelsnitt mellersta Sverige (ingen regionväljare på sidkalkylatorn). */
const PAGE_SOLAR_MULT = 1.0;

const KWP_STEPS = [
  2, 2.5, 3, 4, 5, 6, 6.6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 17.5, 20, 22.5, 25, 30,
] as const;

const BATTERY_OPTIONS = [
  { key: "none", label: "Inget batteri", afterRot: 0 },
  { key: "5", label: "Ca 5 kWh batteri", afterRot: 28_000 },
  { key: "10", label: "Ca 10 kWh batteri", afterRot: 42_000 },
  { key: "13", label: "Ca 13 kWh batteri", afterRot: 58_000 },
] as const;

const HOME_SAVINGS_MULT: Record<HomeTime, number> = {
  all: 1.14,
  part: 1,
  night: 0.86,
};

const ONSITE_SHARE: Record<HomeTime, number> = {
  all: 0.4,
  part: 0.32,
  night: 0.24,
};

function fmt(n: number): string {
  return Math.round(n).toLocaleString("sv-SE");
}

function fmtMoney(n: number): string {
  return `${fmt(Math.max(0, n))} kr`;
}

export function CalculatorPageEmbedded() {
  const { openQuiz } = useQuoteQuiz();

  const [address, setAddress] = useState("");
  const [billQuarter, setBillQuarter] = useState(5000);
  const [homeTime, setHomeTime] = useState<HomeTime>("part");
  const [kwpIdx, setKwpIdx] = useState(() => {
    const i = KWP_STEPS.indexOf(6.6);
    return i >= 0 ? i : 5;
  });
  const [batteryKey, setBatteryKey] = useState<(typeof BATTERY_OPTIONS)[number]["key"]>("none");
  const [resultsTab, setResultsTab] = useState<ResultsTab>("besparing");

  const {
    suggestions: addressSuggestions,
    open: addressSuggestOpen,
    setOpen: setAddressSuggestOpen,
    loading: addressSuggestLoading,
    locked: addressSuggestLocked,
    pickSuggestion: finalizeAddressPick,
    unlock: unlockAddressSuggest,
  } = useAddressSuggest(address, true);

  const kwp = KWP_STEPS[Math.max(0, Math.min(kwpIdx, KWP_STEPS.length - 1))] ?? 6.6;
  const batteryAfterRot =
    BATTERY_OPTIONS.find((b) => b.key === batteryKey)?.afterRot ?? 0;

  const pageCalc = useMemo(() => {
    const annualSpend = billQuarter * 4;
    const pricePerKwh = 2.05;
    const c = Math.max(1800, Math.round(annualSpend / pricePerKwh));

    const prod = kwp * 950 * PAGE_SOLAR_MULT;
    const directUseKwh = Math.min(c, prod * ONSITE_SHARE[homeTime]);
    const exportKwh = Math.max(0, prod - directUseKwh);

    const retail = 2.0;
    const feedIn = 0.42;
    const savings = Math.round((directUseKwh * retail + exportKwh * feedIn) / 500) * 500;
    const savingsAdjusted =
      Math.round((savings * HOME_SAVINGS_MULT[homeTime]) / 500) * 500;

    const panelInstall =
      Math.round((kwp * 15000 * 0.7) / 5000) * 5000;
    const installAfterROT = panelInstall + batteryAfterRot;

    const payback = savingsAdjusted > 0 ? installAfterROT / savingsAdjusted : 0;
    const profit25 = savingsAdjusted * 25 - installAfterROT;

    const cov = Math.min(100, Math.round((directUseKwh / c) * 100));
    const co2 = Number((prod * 0.0004).toFixed(1));

    const impliedRoofM2 = Math.max(25, Math.ceil(kwp / 0.15));
    const panelCount = Math.round(kwp / 0.4);

    const newAnnualSpend = Math.max(0, annualSpend - savingsAdjusted);
    const newQuarter = newAnnualSpend / 4;
    const seasonal = {
      summer: newQuarter * 0.88,
      autumn: newQuarter * 0.96,
      winter: newQuarter * 1.12,
      spring: newQuarter * 1.04,
    };

    const co2Life = co2 * 25;
    const treesApprox = co2 > 0 ? Math.max(1, Math.round((co2 * 1000) / 22)) : 0;
    const carsApprox = co2 > 0 ? Math.max(0, Math.round((co2 * 1000) / 2100)) : 0;
    const footprintPeople = co2 > 0 ? Number((co2 / 2.5).toFixed(1)) : 0;

    return {
      c,
      prod,
      savings: savingsAdjusted,
      installAfterROT,
      panels: panelCount,
      cov,
      payback,
      profit25,
      co2,
      co2Life,
      r: impliedRoofM2,
      kwp,
      exportKwh,
      directUseKwh,
      annualSpend,
      newQuarter,
      seasonal,
      treesApprox,
      carsApprox,
      footprintPeople,
      panelAreaM2: Math.round(panelCount * 2.05),
    };
  }, [billQuarter, homeTime, kwp, batteryAfterRot]);

  const installGrossBeforeRotEst =
    pageCalc.installAfterROT > 0 ? Math.round(pageCalc.installAfterROT / 0.7) : 0;
  const rotRebateDisplay = Math.max(0, installGrossBeforeRotEst - pageCalc.installAfterROT);
  const roiReturnPct =
    pageCalc.installAfterROT > 0
      ? (pageCalc.profit25 / pageCalc.installAfterROT) * 100
      : 0;

  const refIconCell = (node: ReactNode) => (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e4ebe2] text-[#394d42] [&>svg]:h-[18px] [&>svg]:w-[18px]">
      {node}
    </span>
  );

  const secondaryActions = (
    <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4">
      <button
        type="button"
        disabled
        className="flex min-h-[44px] cursor-not-allowed items-center justify-center gap-2 rounded-full border border-[#315a43] px-6 py-2.5 text-[15px] text-[#315a43] opacity-45"
        title="Kommer snart"
      >
        <Download className="h-[15px] w-[15px] shrink-0" aria-hidden />
        Ladda ner resultat
      </button>
      <button
        type="button"
        disabled
        className="flex min-h-[44px] cursor-not-allowed items-center justify-center gap-2 rounded-full border border-[#315a43] px-6 py-2.5 text-[15px] text-[#315a43] opacity-45"
        title="Kommer snart"
      >
        <Mail className="h-[15px] w-[15px] shrink-0" aria-hidden />
        Mejla resultat
      </button>
    </div>
  );

  const openOffertQuiz = () => {
    const trimmed = address.trim();
    const initialAddress = trimmed.length >= 4 ? trimmed : undefined;
    const solution: SolutionKey = batteryKey !== "none" ? "kombination" : "solceller";
    openQuiz({ solution, initialAddress });
  };

  const calculatorBrandLogo = (
    <div className="nx-logo mb-4 text-[#305a42] lg:mb-5">
      <svg className="nx-logo-sun" viewBox="0 0 28 28" fill="none" aria-hidden>
        <circle cx="14" cy="14" r="5" fill="currentColor" />
        <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="14" y1="2" x2="14" y2="5" />
          <line x1="14" y1="23" x2="14" y2="26" />
          <line x1="2" y1="14" x2="5" y2="14" />
          <line x1="23" y1="14" x2="26" y2="14" />
          <line x1="5.5" y1="5.5" x2="7.6" y2="7.6" />
          <line x1="20.4" y1="20.4" x2="22.5" y2="22.5" />
          <line x1="22.5" y1="5.5" x2="20.4" y2="7.6" />
          <line x1="7.6" y1="20.4" x2="5.5" y2="22.5" />
        </g>
      </svg>
      <span className="nx-logo-text">Nexosol</span>
    </div>
  );

  const rangeStyle = { accentColor: "#394d42" } as CSSProperties;

  const resultsAside = (
    <div className="relative mx-auto flex h-full min-h-0 w-full max-w-[820px] flex-1 flex-col">
      <div className="relative isolate flex h-full min-h-0 flex-1 flex-col bg-[#fcfcfc] px-5 pb-6 sm:px-8 sm:pb-7">
        <header className="shrink-0 border-b border-[#e1e1e1] px-1 pb-3 pt-1 lg:px-0">
          <h3 className="text-center text-[1.1rem] font-bold leading-tight tracking-tight text-[#305a42] lg:text-left lg:text-[1.25rem]">
            Dina resultat
          </h3>
        </header>

        <div className="mt-2 flex min-h-0 flex-1 flex-col">
        <div
          className="mb-4 flex rounded-[999px] bg-[#f8f6f3] p-1.5 sm:p-2"
          role="tablist"
          aria-label="Resultatvyer"
        >
          {(
            [
              ["besparing", "Besparing"],
              ["el", "Elräkning"],
              ["utslapp", "Utsläpp"],
              ["system", "System"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={resultsTab === id}
              className={`min-h-[40px] flex-1 rounded-full px-1.5 py-1.5 text-center text-[12px] font-medium leading-tight transition-colors sm:min-h-[44px] sm:px-2 sm:py-2 sm:text-[13px] md:text-[14px] ${resultsTab === id ? "bg-[#394d42] text-white" : "text-[#315a43] hover:bg-white/60"}`}
              onClick={() => setResultsTab(id)}
            >
              {label}
            </button>
          ))}
        </div>

        {resultsTab === "besparing" ? (
          <>
            <div className="mb-1 flex flex-wrap justify-center border-b border-[#e1e1e1]">
              <div className="min-w-[46%] flex-1 border-r border-[#e1e1e1] px-3 py-3 text-center sm:px-6">
                <div className="text-[13px] text-[#394d42]">Besparing år 1</div>
                <div
                  className={`mt-2 text-[1.75rem] font-bold leading-none text-[#305a42] sm:text-[2.15rem]`}
                >
                  {fmtMoney(pageCalc.savings)}
                </div>
              </div>
              <div className="min-w-[46%] flex-1 px-3 py-3 text-center sm:px-6">
                <div className="text-[13px] text-[#394d42]">Återbetalning</div>
                <div
                  className={`mt-2 text-[1.75rem] font-bold leading-none text-[#305a42] sm:text-[2.15rem]`}
                >
                  {pageCalc.payback.toFixed(1)} år
                </div>
              </div>
            </div>
            <ul className="mb-2 text-[15px] text-[#1e221d]">
              <li className="flex items-center gap-3 border-b border-[#e1e1e1] py-2.5">
                {refIconCell(<Wallet className="shrink-0" />)}
                <span className="min-w-0 flex-1">Besparing på 25 år</span>
                <span className={`shrink-0 pl-3 text-right font-semibold text-[#305a42]`}>
                  {fmtMoney(Math.max(pageCalc.profit25, 0))}
                </span>
              </li>
              <li className="flex items-center gap-3 border-b border-[#e1e1e1] py-2.5">
                {refIconCell(<BadgePercent className="shrink-0" />)}
                <span className="min-w-0 flex-1">Grönt avdrag / ROT (indikativt)</span>
                <span className={`shrink-0 pl-3 text-right font-semibold text-[#305a42]`}>
                  {fmtMoney(rotRebateDisplay)}
                </span>
              </li>
              <li className="flex items-center gap-3 border-b border-[#e1e1e1] py-2.5">
                {refIconCell(<Receipt className="shrink-0" />)}
                <span className="min-w-0 flex-1">Totalt du betalar (inkl. avdrag)</span>
                <span className={`shrink-0 pl-3 text-right font-semibold text-[#305a42]`}>
                  {fmtMoney(pageCalc.installAfterROT)}
                </span>
              </li>
              <li className="flex items-center gap-3 border-b border-[#e1e1e1] py-2.5">
                {refIconCell(<TrendingUp className="shrink-0" />)}
                <span className="min-w-0 flex-1">Avkastning (25 år)</span>
                <span className={`shrink-0 pl-3 text-right font-semibold text-[#305a42]`}>
                  {roiReturnPct.toFixed(1)} %
                </span>
              </li>
            </ul>
          </>
        ) : null}

        {resultsTab === "el" ? (
          <>
            <div className="mb-1 flex flex-wrap justify-center border-b border-[#e1e1e1]">
              <div className="min-w-[46%] flex-1 border-r border-[#e1e1e1] px-3 py-3 text-center sm:px-6">
                <div className="text-[13px] text-[#394d42]">Ny snittfaktura (kvartal)</div>
                <div
                  className={`mt-2 text-[1.55rem] font-bold leading-none text-[#305a42] sm:text-[1.85rem]`}
                >
                  {fmtMoney(pageCalc.newQuarter)}
                </div>
              </div>
              <div className="min-w-[46%] flex-1 px-3 py-3 text-center sm:px-6">
                <div className="text-[13px] text-[#394d42]">Uppskattad årsförbrukning</div>
                <div
                  className={`mt-2 text-[1.55rem] font-bold leading-none text-[#305a42] sm:text-[1.85rem]`}
                >
                  {fmt(pageCalc.c)} kWh
                </div>
              </div>
            </div>
            <ul className="mb-2 text-[15px] text-[#1e221d]">
              <li className="flex items-center gap-3 border-b border-[#e1e1e1] py-2.5">
                {refIconCell(<Sun className="shrink-0" />)}
                <span className="min-w-0 flex-1">Sommar (ca kvartal)</span>
                <span className={`shrink-0 pl-3 text-right font-semibold text-[#305a42]`}>
                  {fmtMoney(pageCalc.seasonal.summer)}
                </span>
              </li>
              <li className="flex items-center gap-3 border-b border-[#e1e1e1] py-2.5">
                {refIconCell(<Zap className="shrink-0" />)}
                <span className="min-w-0 flex-1">Höst (ca kvartal)</span>
                <span className={`shrink-0 pl-3 text-right font-semibold text-[#305a42]`}>
                  {fmtMoney(pageCalc.seasonal.autumn)}
                </span>
              </li>
              <li className="flex items-center gap-3 border-b border-[#e1e1e1] py-2.5">
                {refIconCell(<Zap className="shrink-0" />)}
                <span className="min-w-0 flex-1">Vinter (ca kvartal)</span>
                <span className={`shrink-0 pl-3 text-right font-semibold text-[#305a42]`}>
                  {fmtMoney(pageCalc.seasonal.winter)}
                </span>
              </li>
              <li className="flex items-center gap-3 border-b border-[#e1e1e1] py-2.5">
                {refIconCell(<Sun className="shrink-0" />)}
                <span className="min-w-0 flex-1">Vår (ca kvartal)</span>
                <span className={`shrink-0 pl-3 text-right font-semibold text-[#305a42]`}>
                  {fmtMoney(pageCalc.seasonal.spring)}
                </span>
              </li>
            </ul>
            <p className="text-[12px] leading-relaxed text-[#394d42]/75">
              Säsongsrader är förenklad fördelning av samma snitt — inte exakta elområdespriser.
            </p>
          </>
        ) : null}

        {resultsTab === "utslapp" ? (
          <>
            <div className="mb-1 flex flex-wrap justify-center border-b border-[#e1e1e1]">
              <div className="min-w-[100%] px-3 py-3 text-center sm:px-6">
                <div className="text-[13px] text-[#394d42]">Undvikit CO₂ (ca 25 år)</div>
                <div
                  className={`mt-2 text-[1.65rem] font-bold leading-none text-[#305a42] sm:text-[1.95rem]`}
                >
                  {pageCalc.co2Life.toFixed(1)} ton
                </div>
              </div>
            </div>
            <p className="mb-3 text-[13px] font-medium text-[#394d42]">Motsvarar ungefär</p>
            <ul className="mb-2 text-[15px] text-[#1e221d]">
              <li className="flex items-center gap-3 border-b border-[#e1e1e1] py-2.5">
                {refIconCell(<Sprout className="shrink-0" />)}
                <span className="min-w-0 flex-1">Träd (jämförelse, 1 års klimatnytta)</span>
                <span className={`shrink-0 pl-3 text-right font-semibold text-[#305a42]`}>
                  {fmt(pageCalc.treesApprox)}
                </span>
              </li>
              <li className="flex items-center gap-3 border-b border-[#e1e1e1] py-2.5">
                {refIconCell(<CarFront className="shrink-0" />)}
                <span className="min-w-0 flex-1">Bilar “av vägen” (indikativt / år)</span>
                <span className={`shrink-0 pl-3 text-right font-semibold text-[#305a42]`}>
                  {pageCalc.carsApprox}
                </span>
              </li>
              <li className="flex items-center gap-3 border-b border-[#e1e1e1] py-2.5">
                {refIconCell(<Footprints className="shrink-0" />)}
                <span className="min-w-0 flex-1">Motsvarande personers koldioxid (1 år)</span>
                <span className={`shrink-0 pl-3 text-right font-semibold text-[#305a42]`}>
                  {pageCalc.footprintPeople}
                </span>
              </li>
            </ul>
          </>
        ) : null}

        {resultsTab === "system" ? (
          <>
            <div className="mb-1 flex flex-wrap justify-center border-b border-[#e1e1e1]">
              <div className="min-w-[46%] flex-1 border-r border-[#e1e1e1] px-3 py-3 text-center sm:px-6">
                <div className="text-[13px] text-[#394d42]">Systemstorlek</div>
                <div
                  className={`mt-2 text-[1.75rem] font-bold leading-none text-[#305a42] sm:text-[2rem]`}
                >
                  {pageCalc.kwp.toFixed(1)} kW
                </div>
              </div>
              <div className="min-w-[46%] flex-1 px-3 py-3 text-center sm:px-6">
                <div className="text-[13px] text-[#394d42]">Antal paneler</div>
                <div
                  className={`mt-2 text-[1.75rem] font-bold leading-none text-[#305a42] sm:text-[2rem]`}
                >
                  {pageCalc.panels} st
                </div>
              </div>
            </div>
            <ul className="mb-2 text-[15px] text-[#1e221d]">
              <li className="flex items-center gap-3 border-b border-[#e1e1e1] py-2.5">
                {refIconCell(<Sun className="shrink-0" />)}
                <span className="min-w-0 flex-1">Produktion per dag (snitt)</span>
                <span className={`shrink-0 pl-3 text-right font-semibold text-[#305a42]`}>
                  {(pageCalc.prod / 365).toFixed(1)} kWh
                </span>
              </li>
              <li className="flex items-center gap-3 border-b border-[#e1e1e1] py-2.5">
                {refIconCell(<Award className="shrink-0" />)}
                <span className="min-w-0 flex-1">Panelarea (ca)</span>
                <span className={`shrink-0 pl-3 text-right font-semibold text-[#305a42]`}>
                  {pageCalc.panelAreaM2} m²
                </span>
              </li>
              <li className="flex items-center gap-3 border-b border-[#e1e1e1] py-2.5">
                {refIconCell(<Share2 className="shrink-0" />)}
                <span className="min-w-0 flex-1">Till nätet / år (indikativt)</span>
                <span className={`shrink-0 pl-3 text-right font-semibold text-[#305a42]`}>
                  {fmt(Math.round(pageCalc.exportKwh))} kWh
                </span>
              </li>
            </ul>
          </>
        ) : null}

        <p className="mt-auto pt-4 text-[11px] leading-relaxed text-[#394d42]/65">
          *Indikativa siffror för vägledning — inte bindande offerter. ROT/grönt avdrag är förenklat
          (ca 30 % på arbetsdel i vår modell).
        </p>

        <button
          type="button"
          className="mt-4 w-full min-h-[48px] rounded-full border-2 border-[#9fda47] bg-[#9fda47] px-8 py-3 text-[16px] font-medium text-[#394d42] transition hover:border-[#315a43]"
          onClick={openOffertQuiz}
        >
          Få gratis offerter för detta system
        </button>
        {secondaryActions}
        </div>
      </div>
    </div>
  );

  const homeOptions: { id: HomeTime; label: string }[] = [
    { id: "all", label: "Hela dagen" },
    { id: "part", label: "Dagtid" },
    { id: "night", label: "Kväll/natt" },
  ];

  return (
    <section
      id="calculator"
      className="nx-calculator-root nx-calculator-page-ref scroll-mt-24 bg-[#e4ebe2] py-10 px-4 sm:px-6"
    >
      <CalculatorPageLayout
        brand={calculatorBrandLogo}
        eyebrow={
          <p className="mb-4 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-[#305a42]/55 lg:mb-5 lg:text-left">
            Solcellskalkylator
          </p>
        }
        leftColumn={
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden pb-3 lg:pb-2">
            <header className="shrink-0 border-b border-[#e1e1e1] px-1 pb-3 pt-1 lg:px-0">
              <h2 className="text-[1.1rem] font-bold leading-tight tracking-tight text-[#305a42] lg:text-[1.25rem]">
                Räkna på din solcellsbesparing
              </h2>
              <p className="mt-1 max-w-[42ch] text-[12px] leading-snug text-[#394d42]">
                Justerar du värdena uppdateras resultaten direkt — offert via vår korta guide.
              </p>
            </header>

            <div className="nx-body mt-2 space-y-2 !px-0 pb-1 sm:space-y-3">
              <div>
                <h3 className="mb-2 text-[14px] font-bold text-[#305a43]">
                  <span className="text-[#9fda47]">1.</span> Hushållet
                </h3>
                <div className="relative mb-3">
                  <label className="mb-1 block text-[12px] text-[#1e221d]" htmlFor="nx-page-address">
                    Din adress
                  </label>
                  <input
                    id="nx-page-address"
                    className="h-9 w-full rounded-none border border-[#c6c6c6] bg-white px-3 text-[14px] text-[#1e221d] outline-none focus:border-2 focus:border-[#315a43]"
                    type="text"
                    autoComplete="street-address"
                    placeholder="Exempelgatan 12, 123 45 Stad"
                    value={address}
                    onChange={(e) => {
                      unlockAddressSuggest();
                      setAddress(e.target.value);
                    }}
                    onFocus={() => {
                      if (!addressSuggestLocked && addressSuggestions.length > 0) {
                        setAddressSuggestOpen(true);
                      }
                    }}
                    onBlur={() => {
                      window.setTimeout(() => setAddressSuggestOpen(false), 120);
                    }}
                  />
                  {addressSuggestOpen && addressSuggestions.length > 0 ? (
                    <div className="nx-suggest" role="listbox" aria-label="Adressförslag">
                      {addressSuggestions.map((s) => (
                        <button
                          key={s}
                          type="button"
                          className="nx-suggest-item"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            setAddress(s);
                            finalizeAddressPick();
                          }}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  ) : null}
                  {addressSuggestLoading ? (
                    <p className="mt-1.5 text-[12px] text-[#394d42]/80">Söker adresser…</p>
                  ) : null}
                </div>

                <div className="mb-1 flex items-center justify-between gap-2">
                  <label className="text-[12px] text-[#1e221d]" htmlFor="nx-bill-slider">
                    Genomsnittlig elräkning per kvartal
                  </label>
                  <span
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#d6e1d4] text-[10px] text-[#394d42]"
                    title="Uppskatta din faktiska kvartalsfaktura före solceller."
                  >
                    <Info className="h-3.5 w-3.5" aria-hidden />
                  </span>
                </div>
                <div className="mb-0.5 text-center text-[15px] font-semibold text-[#394d42]">
                  {fmt(billQuarter)} kr
                </div>
                <input
                  id="nx-bill-slider"
                  type="range"
                  min={500}
                  max={20000}
                  step={100}
                  value={billQuarter}
                  onChange={(e) => setBillQuarter(Number(e.target.value))}
                  className="h-2 w-full cursor-pointer"
                  style={rangeStyle}
                  aria-valuetext={`${fmt(billQuarter)} kronor per kvartal`}
                />
                <div className="mt-1 flex justify-between text-[11px] text-[#7b7b7b]">
                  <span>500 kr</span>
                  <span>20 000 kr</span>
                </div>

                <p className="mt-2 mb-1 text-[12px] text-[#1e221d]">
                  När använder du mest el hemma?
                </p>
                <div className="flex flex-col gap-1 sm:grid sm:grid-cols-3 sm:gap-1.5">
                  {homeOptions.map((opt) => (
                    <label
                      key={opt.id}
                      className={`flex cursor-pointer items-center justify-between border px-2 py-1.5 transition-colors sm:flex-col sm:justify-center sm:gap-0.5 sm:px-1.5 sm:py-2 ${homeTime === opt.id ? "border-[#e1e1e1] bg-[#e4ebe2]" : "border-[#e1e1e1] bg-white hover:bg-[#f8f6f3]"}`}
                    >
                      <input
                        type="radio"
                        name="nx-home-time"
                        className="sr-only"
                        checked={homeTime === opt.id}
                        onChange={() => setHomeTime(opt.id)}
                      />
                      <span className="text-[12px] text-[#1e221d] sm:text-center sm:text-[11px] sm:leading-tight">
                        {opt.label}
                      </span>
                      <span
                        className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border sm:mt-0.5 ${homeTime === opt.id ? "border-[#9fda47] bg-[#9fda47]" : "border-[#7b7b7b] bg-transparent"}`}
                        aria-hidden
                      >
                        {homeTime === opt.id ? <span className="text-[8px] text-[#394d42]">✓</span> : null}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-2 text-[14px] font-bold text-[#305a43]">
                  <span className="text-[#9fda47]">2.</span> Ditt system
                </h3>
                <div className="mb-1 flex items-center justify-between">
                  <label className="text-[12px] text-[#1e221d]" htmlFor="nx-kwp-slider">
                    Välj systemstorlek
                  </label>
                  <span
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#d6e1d4] text-[#394d42]"
                    title="Osäker? Börja gärna kring 6,6 kW."
                  >
                    <Info className="h-3.5 w-3.5" aria-hidden />
                  </span>
                </div>
                <div className="mb-0.5 text-center text-[15px] font-semibold text-[#394d42]">
                  {kwp} kW
                </div>
                <input
                  id="nx-kwp-slider"
                  type="range"
                  min={0}
                  max={KWP_STEPS.length - 1}
                  step={1}
                  value={kwpIdx}
                  onChange={(e) => setKwpIdx(Number(e.target.value))}
                  className="h-2 w-full cursor-pointer"
                  style={rangeStyle}
                  aria-valuetext={`${kwp} kilowatt`}
                />

                <div className="mt-2">
                  <label className="mb-1 block text-[12px] text-[#1e221d]" htmlFor="nx-battery">
                    Vill du ha batteri?
                  </label>
                  <select
                    id="nx-battery"
                    value={batteryKey}
                    onChange={(e) =>
                      setBatteryKey(e.target.value as (typeof BATTERY_OPTIONS)[number]["key"])
                    }
                    className="h-9 w-full appearance-none rounded-none border border-[#c6c6c6] bg-white bg-[length:12px] bg-[right_12px_center] bg-no-repeat px-3 pr-9 text-[14px] text-[#1e221d] outline-none focus:border-2 focus:border-[#315a43]"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath fill='%23315a43' d='M1 1l5 5 5-5'/%3E%3C/svg%3E")`,
                    }}
                  >
                    {BATTERY_OPTIONS.map((b) => (
                      <option key={b.key} value={b.key}>
                        {b.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="button"
                onClick={openOffertQuiz}
                className="mt-2 w-full min-h-[48px] rounded-full border-2 border-[#9fda47] bg-[#9fda47] px-8 py-3 text-[16px] font-medium text-[#394d42] transition hover:border-[#315a43] lg:hidden"
              >
                Fortsätt till kostnadsfri offert
              </button>
            </div>
          </div>
        }
        aside={resultsAside}
      />
    </section>
  );
}
