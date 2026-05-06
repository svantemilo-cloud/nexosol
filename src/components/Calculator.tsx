"use client";

import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { ShieldCheck, BadgePercent, Clock, Award, CheckCircle2, Info, Lock } from "lucide-react";
import "./calculator-nx.css";

type RegionKey = "norra" | "mellersta" | "sodra" | "skane";

/** Intresse som styr offertval i CRM */
export type SolutionKey = "solceller" | "batteri" | "kombination";

/** Taktyp frågas inte — vi använder standarduppskattning (motsvarar sadeltak) i beräkning och CRM */
const DEFAULT_ROOF_TYPE_API = "sadeltak";

export const CALCULATOR_TOTAL_STEPS = 6;

export type CalculatorProps = {
  variant?: "page" | "modal";
  onRequestClose?: () => void;
  /** Förifyll steg 1 när quiz öppnas från en produkt-CTA */
  initialSolution?: SolutionKey | null;
};

const SOLUTION_LABELS: Record<SolutionKey, string> = {
  solceller: "Solceller",
  batteri: "Solcellsbatteri",
  kombination: "Solceller och batteri",
};

function solutionToLeadPayload(solution: SolutionKey) {
  switch (solution) {
    case "solceller":
      return {
        includeBattery: false,
        offertChoices: {
          paneler: true,
          batteri: false,
          vaxelriktare: true,
          komplett: false,
        },
      };
    case "batteri":
      return {
        includeBattery: true,
        offertChoices: {
          paneler: false,
          batteri: true,
          vaxelriktare: false,
          komplett: false,
        },
      };
    default:
      return {
        includeBattery: true,
        offertChoices: {
          paneler: true,
          batteri: true,
          vaxelriktare: true,
          komplett: true,
        },
      };
  }
}

const REG_M: Record<RegionKey, number> = {
  norra: 0.85,
  mellersta: 1.0,
  sodra: 1.1,
  skane: 1.2,
};

const REG_NAMES: Record<RegionKey, string> = {
  norra: "Norra Sverige",
  mellersta: "Mellersta Sverige",
  sodra: "Södra Sverige",
  skane: "Skåne / Blekinge",
};

function regionKeyToApi(reg: RegionKey): string {
  if (reg === "norra") return "nord";
  if (reg === "mellersta") return "mitt";
  return "syd";
}

function fmt(n: number): string {
  return Math.round(n).toLocaleString("sv-SE");
}

function isValidEmail(raw: string): boolean {
  const s = raw.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

function isValidPhone(raw: string): boolean {
  const digits = raw.replace(/[^\d]/g, "");
  return digits.length >= 7;
}

function isValidFullName(raw: string): boolean {
  const s = raw.trim().replace(/\s+/g, " ");
  // tillåt enkla namn men kräver minst 2 tecken totalt
  return s.length >= 2;
}

const TOTAL_STEPS = CALCULATOR_TOTAL_STEPS;

/** Steg där besparingar/priser visas tydligt (när lead är skickad) */
const AMOUNTS_VISIBLE_FROM_STEP = 99;

const INSTALLER_SEARCH_MS = 3400;
const INSTALLER_FOUND_AT_MS = 1700;

export function Calculator({
  variant = "page",
  onRequestClose,
  initialSolution = null,
}: CalculatorProps) {
  const [currentStep, setCurrentStep] = useState(() => (initialSolution ? 2 : 1));
  const [solutionInterest, setSolutionInterest] = useState<SolutionKey | null>(
    initialSolution ?? null,
  );
  const [addressError, setAddressError] = useState(false);
  const [consumption, setConsumption] = useState(10000);
  const [roofArea, setRoofArea] = useState(50);
  const [region, setRegion] = useState<RegionKey>("mellersta");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [addressSuggestions, setAddressSuggestions] = useState<string[]>([]);
  const [addressSuggestOpen, setAddressSuggestOpen] = useState(false);
  const [addressSuggestLoading, setAddressSuggestLoading] = useState(false);
  // När användaren väljer ett förslag vill vi inte auto-öppna listan igen direkt via fetch-effekten.
  const [addressSuggestLocked, setAddressSuggestLocked] = useState(false);
  const [installerFound, setInstallerFound] = useState(false);
  const [emailError, setEmailError] = useState(false);
  /** Honeypot — ska lämnas tom (undvik namn som "fax" pga webbläsarens autofill). */
  const [nxHp, setNxHp] = useState("");

  const [showSuccess, setShowSuccess] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "sending" | "error">("idle");
  const [submitErrorDetail, setSubmitErrorDetail] = useState<string | null>(null);

  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

  const calc = useMemo(() => {
    const c = consumption;
    const r = roofArea;
    const kwp = Math.min(r * 0.15, c / 900);
    const prod = kwp * 950 * (REG_M[region] ?? 1);
    const savings = Math.round((prod * 1.5) / 500) * 500;
    const installAfterROT = Math.round((kwp * 15000 * 0.7) / 5000) * 5000;
    const panels = Math.round(kwp / 0.4);
    const cov = Math.min(Math.round((prod / c) * 100), 100);
    const payback = savings > 0 ? installAfterROT / savings : 0;
    const profit25 = savings * 25 - installAfterROT;
    const co2 = Number((prod * 0.0004).toFixed(1));
    return {
      c,
      r,
      kwp,
      prod,
      savings,
      installAfterROT,
      panels,
      cov,
      payback,
      profit25,
      co2,
    };
  }, [consumption, roofArea, region]);

  const amountsRevealed =
    showSuccess || (!showSuccess && currentStep >= AMOUNTS_VISIBLE_FROM_STEP);

  useEffect(() => {
    if (currentStep !== 3) return;
    setInstallerFound(false);
    const tFound = window.setTimeout(() => {
      setInstallerFound(true);
    }, INSTALLER_FOUND_AT_MS);
    const tNext = window.setTimeout(() => {
      setCurrentStep(4);
    }, INSTALLER_SEARCH_MS);
    return () => {
      window.clearTimeout(tFound);
      window.clearTimeout(tNext);
    };
  }, [currentStep]);

  useEffect(() => {
    if (currentStep !== 2) return;
    const q = address.trim();
    if (q.length < 3) {
      setAddressSuggestions([]);
      setAddressSuggestLoading(false);
      return;
    }
    let cancelled = false;
    setAddressSuggestLoading(true);
    const t = window.setTimeout(() => {
      fetch(`/api/address-suggest?q=${encodeURIComponent(q)}`)
        .then((r) => r.json() as Promise<{ suggestions?: { label?: string }[] }>)
        .then((json) => {
          if (cancelled) return;
          const s = (json.suggestions ?? [])
            .map((x) => (typeof x.label === "string" ? x.label : ""))
            .filter(Boolean)
            .slice(0, 6);
          setAddressSuggestions(s);
          if (!addressSuggestLocked) setAddressSuggestOpen(true);
        })
        .catch(() => {
          if (cancelled) return;
          setAddressSuggestions([]);
        })
        .finally(() => {
          if (cancelled) return;
          setAddressSuggestLoading(false);
        });
    }, 180);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
  }, [address, currentStep, addressSuggestLocked]);

  const navigate = useCallback((dir: number) => {
    setCurrentStep((s) => Math.max(1, Math.min(TOTAL_STEPS, s + dir)));
  }, []);

  const goBack = useCallback(() => {
    if (currentStep === 4) {
      setCurrentStep(2);
      return;
    }
    navigate(-1);
  }, [currentStep, navigate]);

  const tryGoNext = useCallback(() => {
    const nameOk =
      isValidFullName(fullName) || (firstName.trim().length >= 2 && lastName.trim().length >= 2);

    if (currentStep === 1) {
      if (!solutionInterest) return;
    }
    if (currentStep === 2) {
      const a = address.trim();
      if (a.length < 4) {
        setAddressError(true);
        return;
      }
      setAddressError(false);
    }
    if (currentStep === 3) {
      return;
    }
    if (currentStep === 4) {
      if (!nameOk) return;
    }
    if (currentStep === 5) {
      const em = email.trim();
      if (!isValidEmail(em)) {
        setEmailError(true);
        emailRef.current?.focus();
        return;
      }
      setEmailError(false);
    }
    if (currentStep === 6) {
      if (!isValidPhone(phone)) {
        phoneRef.current?.focus();
        return;
      }
    }
    navigate(1);
  }, [currentStep, solutionInterest, address, email, phone, fullName, firstName, lastName, navigate]);

  const submitLead = useCallback(async () => {
    const em = email.trim();
    const addr = address.trim();
    if (addr.length < 4) {
      setAddressError(true);
      setCurrentStep(2);
      return;
    }
    setAddressError(false);
    if (!em || !isValidEmail(em)) {
      setEmailError(true);
      setCurrentStep(5);
      emailRef.current?.focus();
      return;
    }
    setEmailError(false);
    setSubmitStatus("sending");
    setSubmitErrorDetail(null);

    const resolvedName = fullName.trim();
    const resolvedFirst =
      firstName.trim() ||
      (resolvedName ? resolvedName.split(/\s+/).slice(0, 1).join(" ") : "");
    const resolvedLast =
      lastName.trim() ||
      (resolvedName ? resolvedName.split(/\s+/).slice(1).join(" ") : "");

    const sol = solutionInterest ?? "solceller";
    const leadOpts = solutionToLeadPayload(sol);
    const payload = {
      firstName: resolvedFirst || undefined,
      lastName: resolvedLast || undefined,
      email: em,
      phone: phone.trim() || undefined,
      address: addr,
      consumptionKwh: calc.c,
      roofAreaM2: calc.r,
      roofType: DEFAULT_ROOF_TYPE_API,
      region: regionKeyToApi(region),
      includeBattery: leadOpts.includeBattery,
      offertChoices: leadOpts.offertChoices,
      estimatedProductionKwh: Math.round(calc.prod),
      estimatedRoiYears: Number(calc.payback.toFixed(1)),
      requestedSolution: sol,
      _nx_hp: nxHp,
    };

    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        let detail = "";
        try {
          const errJson = (await res.json()) as { error?: string; detail?: string };
          detail = [errJson.detail, errJson.error].filter(Boolean).join(" — ");
        } catch {
          detail = res.statusText || String(res.status);
        }
        setSubmitErrorDetail(detail || `HTTP ${res.status}`);
        throw new Error("submit failed");
      }

      const webhook = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;
      if (webhook) {
        fetch(webhook, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload, source: "nexosol-calculator" }),
        }).catch(() => {});
      }

      setShowSuccess(true);
      setSubmitStatus("idle");
    } catch {
      setSubmitStatus("error");
    }
  }, [calc, firstName, lastName, fullName, email, phone, address, region, nxHp, solutionInterest]);

  const stepLabels = [
    "Steg 1 av 6 — Vilken lösning intresserar dig?",
    "Steg 2 av 6 — Din adress",
    "Steg 3 av 6 — Vi letar installatörer",
    "Steg 4 av 6 — Ditt namn",
    "Steg 5 av 6 — E-post",
    "Steg 6 av 6 — Telefon",
  ];

  const progressPct = showSuccess
    ? 100
    : Math.round((currentStep / TOTAL_STEPS) * 100);

  const rootClass =
    variant === "modal"
      ? "nx-calculator-root nx-calculator--modal py-4 px-2 sm:px-3 bg-transparent"
      : "nx-calculator-root py-10 px-4 sm:px-6 scroll-mt-24 bg-[#f4f6f4]";

  const Root = variant === "page" ? "section" : "div";

  return (
    <Root {...(variant === "page" ? { id: "calculator" } : {})} className={rootClass}>
      <div className="nx-wrap">
        {variant === "page" ? (
          <div className="nx-logo">
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
        ) : null}

        <div className="nx-card">
          {variant === "modal" ? (
            <div
              className="nx-quiz-progress"
              role="progressbar"
              aria-valuenow={progressPct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Framsteg ${progressPct} procent`}
            >
              <div
                className="nx-quiz-progress-fill"
                style={{
                  width: `${progressPct}%`,
                  minWidth: progressPct > 0 ? "2.25rem" : undefined,
                }}
              >
                <span className="nx-quiz-progress-label">{progressPct}%</span>
              </div>
            </div>
          ) : null}
          <div className="nx-card-header">
            <h2 className="nx-card-title">Vad kostar solceller för dig?</h2>
            <div className="nx-card-sub">
              Jämför offerter enkelt, kostnadsfritt och bindningsfritt.
            </div>
          </div>
          <div className="nx-savings-bar">
            <div className={amountsRevealed ? undefined : "nx-amount-blur"}>
              <div className="nx-savings-label">Uppskattad besparing per år</div>
              <div className="nx-savings-amount">{fmt(calc.savings)} kr</div>
            </div>
            <div className={amountsRevealed ? undefined : "nx-amount-blur"}>
              <div className="nx-savings-badge">
                +{fmt(calc.savings * 25)} kr / 25 år
              </div>
            </div>
          </div>

          {!showSuccess && (
            <>
              <div className="nx-body" id="mainBody">
                <div
                  className={`nx-steps${variant === "modal" ? " nx-steps--modal-hide" : ""}`}
                >
                  {Array.from({ length: TOTAL_STEPS }, (_, idx) => idx + 1).map((i) => (
                    <div
                      key={i}
                      className={`nx-step-pip ${i < currentStep ? "done" : ""} ${i === currentStep ? "active" : ""}`}
                    />
                  ))}
                </div>
                <div className="nx-step-label">{stepLabels[currentStep - 1]}</div>

                <div className={`nx-step ${currentStep === 1 ? "active" : ""}`}>
                  <h3 className="nx-step-heading">Välj det du vill ha offert på</h3>
                  <p className="nx-card-sub text-left mb-4 !text-[13px] !leading-snug">
                    Du kan ändra dig senare — vi matchar dig med rätt installatörer.
                  </p>
                  {(
                    [
                      {
                        key: "solceller" as const,
                        icon: "☀️",
                        label: "Solceller",
                        sub: "Paneler på taket – producera egen el",
                      },
                      {
                        key: "batteri" as const,
                        icon: "🔋",
                        label: "Solcellsbatteri",
                        sub: "Lagra el – passar dig som redan har solceller eller vill komplettera",
                      },
                      {
                        key: "kombination" as const,
                        icon: "⚡",
                        label: "Solceller och batteri",
                        sub: "Komplett system med paneler och lagring",
                      },
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.key}
                      type="button"
                      className={`nx-option-row ${solutionInterest === opt.key ? "selected" : ""}`}
                      onClick={() => setSolutionInterest(opt.key)}
                    >
                      <div className="nx-option-left">
                        <div className="nx-option-icon">{opt.icon}</div>
                        <div>
                          <div className="nx-option-label">{opt.label}</div>
                          <div className="nx-option-sub">{opt.sub}</div>
                        </div>
                      </div>
                      <span className="nx-option-arrow">›</span>
                    </button>
                  ))}
                </div>

                <div className={`nx-step ${currentStep === 2 ? "active" : ""}`}>
                  <h3 className="nx-step-heading">Var ska installationen ske?</h3>
                  <p className="nx-card-sub text-left mb-4 !text-[13px] !leading-snug">
                    Ange adress så kan lokala installatörer ge relevant offert.
                  </p>
                  <div className="nx-form-group">
                    <label className="nx-form-label" htmlFor="nx-address">
                      Adress (gata, postnummer och ort)
                    </label>
                    <input
                      id="nx-address"
                      className={`nx-input ${addressError ? "nx-input-error" : ""}`}
                      type="text"
                      autoComplete="street-address"
                      placeholder="Exempelgatan 12, 123 45 Stad"
                      value={address}
                      onChange={(e) => {
                        setAddressSuggestLocked(false);
                        setAddress(e.target.value);
                        setAddressError(false);
                      }}
                      onFocus={() => {
                        if (!addressSuggestLocked && addressSuggestions.length > 0) setAddressSuggestOpen(true);
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
                              setAddressSuggestLocked(true);
                              setAddress(s);
                              setAddressSuggestOpen(false);
                              setAddressSuggestions([]);
                            }}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    ) : null}
                    {addressSuggestLoading ? (
                      <p className="text-xs text-forest/70 mt-1.5">Söker adresser…</p>
                    ) : null}
                    {addressError ? (
                      <p className="text-xs text-red-600 mt-1.5">
                        Fyll i en fullständig adress för att gå vidare.
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className={`nx-step ${currentStep === 3 ? "active" : ""}`}>
                  <div className="nx-installer-search" aria-live="polite">
                    {installerFound ? (
                      <CheckCircle2 className="nx-installer-search-check" aria-hidden />
                    ) : (
                      <div className="nx-installer-search-spinner" aria-hidden />
                    )}
                    <h3 className="nx-installer-search-title">
                      {installerFound
                        ? "4+ installatörer hittade i ditt närområde"
                        : "Letar installatörer nära dig…"}
                    </h3>
                    {!installerFound ? (
                      <p className="nx-installer-search-sub">
                        Vi matchar din adress med kvalitetssäkrade partners i området.
                      </p>
                    ) : null}
                    {!installerFound ? (
                      <>
                        <div className="nx-installer-cards-blur" aria-hidden>
                          <div className="nx-installer-card-fake" />
                          <div className="nx-installer-card-fake" />
                          <div className="nx-installer-card-fake" />
                          <div className="nx-installer-card-fake" />
                        </div>
                        <p className="nx-installer-search-hint nx-amount-blur">
                          Förhandsmatchning · uppskattat antal installatörer i din zon
                        </p>
                      </>
                    ) : null}
                  </div>
                </div>

                <div className={`nx-step ${currentStep === 7 ? "active" : ""}`}>
                  <h3 className="nx-step-heading">Ungefär hur mycket el förbrukar du?</h3>
                  <p className="nx-card-sub text-left mb-4 !text-[13px] !leading-snug">
                    Dra reglagen — du kan ändra senare. Takytan hjälper oss uppskatta hur stor anläggning som får plats.
                  </p>
                  <div className="nx-slider-group">
                    <div className="nx-slider-row">
                      <label htmlFor="nx-consumption" className="nx-slider-name">
                        Årsförbrukning
                      </label>
                      <span className="nx-slider-val">{fmt(consumption)} kWh</span>
                    </div>
                    <input
                      id="nx-consumption"
                      type="range"
                      className="nx-range"
                      min={2000}
                      max={30000}
                      step={500}
                      value={consumption}
                      onChange={(e) => setConsumption(Number(e.target.value))}
                    />
                  </div>
                  <div className="nx-slider-group">
                    <div className="nx-slider-row">
                      <label htmlFor="nx-roof-area" className="nx-slider-name">
                        Tillgänglig takyta för paneler
                      </label>
                      <span className="nx-slider-val">{roofArea} m²</span>
                    </div>
                    <input
                      id="nx-roof-area"
                      type="range"
                      className="nx-range"
                      min={20}
                      max={200}
                      step={5}
                      value={roofArea}
                      onChange={(e) => setRoofArea(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className={`nx-step ${currentStep === 8 ? "active" : ""}`}>
                  <h3 className="nx-step-heading">Välj din region</h3>
                  {(
                    [
                      { key: "norra" as const, icon: "🌲", label: "Norra Sverige", sub: "800–900 kWh/kWp" },
                      { key: "mellersta" as const, icon: "🏔️", label: "Mellersta Sverige", sub: "900–1000 kWh/kWp" },
                      { key: "sodra" as const, icon: "🌻", label: "Södra Sverige", sub: "1000–1100 kWh/kWp" },
                      { key: "skane" as const, icon: "☀️", label: "Skåne / Blekinge", sub: "1100–1200 kWh/kWp" },
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.key}
                      type="button"
                      className={`nx-option-row ${region === opt.key ? "selected" : ""}`}
                      onClick={() => setRegion(opt.key)}
                    >
                      <div className="nx-option-left">
                        <div className="nx-option-icon">{opt.icon}</div>
                        <div>
                          <div className="nx-option-label">{opt.label}</div>
                          <div className="nx-option-sub">{opt.sub}</div>
                        </div>
                      </div>
                      <span className="nx-option-arrow">›</span>
                    </button>
                  ))}
                  <div className={`nx-stats${!amountsRevealed ? " nx-amount-blur" : ""}`}>
                    <div className="nx-stat">
                      <div className="nx-stat-val">{calc.kwp.toFixed(1)} kW</div>
                      <div className="nx-stat-label">Systemstorlek</div>
                    </div>
                    <div className="nx-stat">
                      <div className="nx-stat-val">{calc.panels} st</div>
                      <div className="nx-stat-label">Solpaneler</div>
                    </div>
                    <div className="nx-stat">
                      <div className="nx-stat-val">{calc.cov}%</div>
                      <div className="nx-stat-label">Egenanvändning</div>
                    </div>
                  </div>
                </div>

                {/* Offert-steget är borttaget: efter telefon är du klar och vi skickar direkt. */}
                <div className={`nx-step ${currentStep === 4 ? "active" : ""}`}>
                  <div className="nx-found-wrap">
                    <div className="nx-found-title">Vi har hittat flera topprankade installatörer i ditt område</div>
                    <div className="nx-found-check" aria-hidden>
                      <CheckCircle2 className="nx-found-check-icon" />
                    </div>
                    <div className="nx-found-cards" aria-hidden>
                      <div className="nx-installer-card-fake" />
                      <div className="nx-installer-card-fake" />
                      <div className="nx-installer-card-fake" />
                      <div className="nx-installer-card-fake" />
                    </div>
                  </div>

                  <h3 className="nx-step-heading">Vad är ditt för- och efternamn?</h3>
                  <div className="nx-form-group">
                    <label className="nx-form-label" htmlFor="nx-fullname">
                      För- och efternamn
                    </label>
                    <input
                      id="nx-fullname"
                      className="nx-input"
                      type="text"
                      autoComplete="name"
                      placeholder="För- och efternamn"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        // håll gamla fält i sync för admin/CRM, men låt submitLead avgöra slutgiltigt
                        const raw = e.target.value.trim();
                        const parts = raw ? raw.split(/\s+/) : [];
                        setFirstName(parts.slice(0, 1).join(" "));
                        setLastName(parts.slice(1).join(" "));
                      }}
                    />
                    <p className="nx-helptext">
                      Vi behöver ditt namn för att veta vem i hushållet som vill jämföra offerterna.
                    </p>
                  </div>
                </div>

                <div className={`nx-step ${currentStep === 5 ? "active" : ""}`}>
                  <div className="nx-step-title">E-postadress</div>
                  <div className="nx-step-row">
                    <div className="nx-step-question">Var vill du få dina offerter skickade?</div>
                    <span className="nx-step-info" aria-hidden>
                      <Info className="nx-step-info-icon" />
                    </span>
                  </div>
                  <div className="nx-form-group">
                    <input
                      ref={emailRef}
                      id="nx-email"
                      className={`nx-input ${emailError ? "nx-input-error" : ""}`}
                      type="email"
                      autoComplete="email"
                      placeholder="din@email.se"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setEmailError(false);
                      }}
                    />
                    <p className="nx-helptext">
                      Vi delar aldrig din e-post med fler än de installatörer du matchas med.
                    </p>
                    {emailError ? <p className="text-xs text-red-600 mt-1.5">Ange en giltig e-postadress.</p> : null}
                  </div>
                </div>

                <div className={`nx-step ${currentStep === 6 ? "active" : ""}`}>
                  <div className="nx-step-title">En sista sak innan du får dina prispressade offerter!</div>
                  <div className="nx-step-row">
                    <div className="nx-step-question">Vad är ditt telefonnummer?</div>
                    <span className="nx-step-info" aria-hidden>
                      <Info className="nx-step-info-icon" />
                    </span>
                  </div>
                  <div className="nx-form-group">
                    <input
                      ref={phoneRef}
                      id="nx-phone"
                      className="nx-input"
                      type="tel"
                      autoComplete="tel"
                      placeholder="073 123 45 67"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                    <p className="nx-helptext">
                      Telefonnummer behövs så installatörerna kan nå dig för offerering och eventuell
                      uppgiftsinhämtning.
                    </p>
                  </div>

                  <div className="nx-privacy">
                    <div>
                      <div className="nx-privacy-title">Vi värnar om din integritet</div>
                      <div className="nx-privacy-sub">
                        Genom att gå vidare godkänner du våra användar- och integritetsvillkor.
                      </div>
                    </div>
                    <div className="nx-privacy-badge" aria-hidden>
                      <Lock className="nx-privacy-badge-icon" />
                      Tryggt och säkert
                    </div>
                  </div>

                  <div className="nx-honeypot">
                    <label htmlFor="nx-hp" className="nx-honeypot-label">
                      Lämna detta fält tomt
                    </label>
                    <input
                      id="nx-hp"
                      tabIndex={-1}
                      autoComplete="new-password"
                      value={nxHp}
                      onChange={(e) => setNxHp(e.target.value)}
                    />
                  </div>

                  {submitStatus === "error" ? (
                    <p className="text-sm text-red-600 mb-2">
                      Något gick fel. Försök igen.
                      {submitErrorDetail ? (
                        <span className="block mt-1 text-xs opacity-90 break-words">
                          {submitErrorDetail}
                        </span>
                      ) : null}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="nx-footer" id="calcFooter">
                <button
                  type="button"
                  className="nx-nav-btn"
                  onClick={goBack}
                  disabled={currentStep === 1}
                >
                  ← Tillbaka
                </button>
                <span className="nx-footer-note">
                  {currentStep === 3
                    ? installerFound
                      ? "4+ installatörer hittade i ditt närområde"
                      : "Letar installatörer nära dig…"
                    : currentStep < TOTAL_STEPS
                      ? "Gratis · Ingen bindning"
                      : "🔒 Dina uppgifter är säkra"}
                </span>
                {currentStep !== 3 && currentStep <= TOTAL_STEPS ? (
                  <button
                    type="button"
                    className="nx-nav-btn primary"
                    onClick={currentStep === TOTAL_STEPS ? submitLead : tryGoNext}
                    disabled={
                      (currentStep === 1 && !solutionInterest) ||
                      (currentStep === 4 &&
                        !(isValidFullName(fullName) || (firstName.trim().length >= 2 && lastName.trim().length >= 2))) ||
                      (currentStep === 5 && !isValidEmail(email.trim())) ||
                      (currentStep === TOTAL_STEPS && (!isValidPhone(phone) || submitStatus === "sending"))
                    }
                  >
                    {currentStep === TOTAL_STEPS
                      ? submitStatus === "sending"
                        ? "Skickar…"
                        : "Få kostnadsfria offerter →"
                      : "Nästa →"}
                  </button>
                ) : null}
              </div>
            </>
          )}

          <div className={`success-screen ${showSuccess ? "visible" : ""}`} id="successScreen">
            <div className="success-icon">🎉</div>
            <h3 className="success-title">Din offert är upplåst!</h3>
            <div className="success-sub">
              Vi skickar din fullständiga offert till <strong>{email.trim()}</strong> inom 24 timmar.
              Certifierade installatörer nära dig kontaktar dig med konkreta priser.
            </div>
            <div className="success-summary">
              <h3 className="offert-summary-title" style={{ marginBottom: 10 }}>
                Din offert
              </h3>
              <div className="success-row">
                <span>Besparing per år</span>
                <span className="success-row-val">{fmt(calc.savings)} kr/år</span>
              </div>
              <div className="success-row">
                <span>Systemkostnad efter ROT</span>
                <span className="success-row-val">{fmt(calc.installAfterROT)} kr</span>
              </div>
              <div className="success-row">
                <span>Återbetalningstid</span>
                <span className="success-row-val">{calc.payback.toFixed(1)} år</span>
              </div>
              <div className="success-row">
                <span>Vinst över 25 år</span>
                <span className="success-row-val">{fmt(calc.profit25)} kr</span>
              </div>
            </div>
            <div className="success-next">
              Nästa steg: Kolla din e-post · Jämför offerter · Välj installatör
            </div>
            {variant === "modal" && onRequestClose ? (
              <button
                type="button"
                className="nx-modal-done-btn"
                onClick={onRequestClose}
              >
                Stäng
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </Root>
  );
}
