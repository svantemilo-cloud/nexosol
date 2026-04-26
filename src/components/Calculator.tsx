"use client";

import { useMemo, useState, useCallback, useRef } from "react";
import "./calculator-nx.css";

type RoofKey = "sadel" | "platt" | "pulpet" | "mansard";
type RegionKey = "norra" | "mellersta" | "sodra" | "skane";

const ROOF_M: Record<RoofKey, number> = {
  sadel: 1.0,
  platt: 0.95,
  pulpet: 0.92,
  mansard: 0.88,
};

const REG_M: Record<RegionKey, number> = {
  norra: 0.85,
  mellersta: 1.0,
  sodra: 1.1,
  skane: 1.2,
};

const ROOF_NAMES: Record<RoofKey, string> = {
  sadel: "Sadeltak",
  platt: "Platt tak",
  pulpet: "Pulpettak",
  mansard: "Mansardtak",
};

const REG_NAMES: Record<RegionKey, string> = {
  norra: "Norra Sverige",
  mellersta: "Mellersta Sverige",
  sodra: "Södra Sverige",
  skane: "Skåne / Blekinge",
};

function roofKeyToApi(roof: RoofKey): string {
  if (roof === "sadel") return "sadeltak";
  if (roof === "platt") return "platt";
  if (roof === "pulpet") return "pulpet";
  return "sadeltak";
}

function regionKeyToApi(reg: RegionKey): string {
  if (reg === "norra") return "nord";
  if (reg === "mellersta") return "mitt";
  return "syd";
}

function fmt(n: number): string {
  return Math.round(n).toLocaleString("sv-SE");
}

export function Calculator() {
  const [currentStep, setCurrentStep] = useState(1);
  const [consumption, setConsumption] = useState(10000);
  const [roofArea, setRoofArea] = useState(50);
  const [roofType, setRoofType] = useState<RoofKey>("sadel");
  const [region, setRegion] = useState<RegionKey>("mellersta");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [emailError, setEmailError] = useState(false);
  /** Honeypot — ska lämnas tom (undvik namn som "fax" pga webbläsarens autofill). */
  const [nxHp, setNxHp] = useState("");

  const [showSuccess, setShowSuccess] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "sending" | "error">("idle");
  const [submitErrorDetail, setSubmitErrorDetail] = useState<string | null>(null);

  const emailRef = useRef<HTMLInputElement>(null);

  const calc = useMemo(() => {
    const c = consumption;
    const r = roofArea;
    const kwp = Math.min(r * 0.15, c / 900);
    const prod = kwp * 950 * (ROOF_M[roofType] ?? 1) * (REG_M[region] ?? 1);
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
  }, [consumption, roofArea, roofType, region]);

  const navigate = useCallback((dir: number) => {
    setCurrentStep((s) => Math.max(1, Math.min(3, s + dir)));
  }, []);

  const focusEmail = useCallback(() => {
    emailRef.current?.focus();
    emailRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  const submitLead = useCallback(async () => {
    const em = email.trim();
    if (!em) {
      setEmailError(true);
      emailRef.current?.focus();
      return;
    }
    setEmailError(false);
    setSubmitStatus("sending");
    setSubmitErrorDetail(null);

    const payload = {
      firstName: firstName.trim() || undefined,
      lastName: lastName.trim() || undefined,
      email: em,
      phone: phone.trim() || undefined,
      address: address.trim() || "",
      consumptionKwh: calc.c,
      roofAreaM2: calc.r,
      roofType: roofKeyToApi(roofType),
      region: regionKeyToApi(region),
      includeBattery: false,
      offertChoices: {
        paneler: true,
        batteri: false,
        vaxelriktare: true,
        komplett: false,
      },
      estimatedProductionKwh: Math.round(calc.prod),
      estimatedRoiYears: Number(calc.payback.toFixed(1)),
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
  }, [calc, firstName, lastName, email, phone, address, roofType, region, nxHp]);

  const stepLabels = [
    "Steg 1 av 3 — Din förbrukning",
    "Steg 2 av 3 — Din plats & system",
    "Steg 3 av 3 — Din gratis offert",
  ];

  return (
    <section id="calculator" className="nx-calculator-root py-10 px-4 sm:px-6 scroll-mt-20 bg-[#f4f6f4]">
      <div className="nx-wrap">
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

        <div className="nx-card">
          <div className="nx-card-header">
            <div className="nx-card-title">Vad kostar solceller för dig?</div>
            <div className="nx-card-sub">
              Jämför offerter enkelt, kostnadsfritt och bindningsfritt.
            </div>
          </div>
          <div className="nx-savings-bar">
            <div>
              <div className="nx-savings-label">Uppskattad besparing per år</div>
              <div className="nx-savings-amount">{fmt(calc.savings)} kr</div>
            </div>
            <div className="nx-savings-badge">
              +{fmt(calc.savings * 25)} kr / 25 år
            </div>
          </div>

          {!showSuccess && (
            <>
              <div className="nx-body" id="mainBody">
                <div className="nx-steps">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`nx-step-pip ${i < currentStep ? "done" : ""} ${i === currentStep ? "active" : ""}`}
                    />
                  ))}
                </div>
                <div className="nx-step-label">{stepLabels[currentStep - 1]}</div>

                <div className={`nx-step ${currentStep === 1 ? "active" : ""}`}>
                  <div className="nx-slider-group">
                    <div className="nx-slider-row">
                      <span className="nx-slider-name">Årsförbrukning</span>
                      <span className="nx-slider-val">{fmt(consumption)} kWh</span>
                    </div>
                    <input
                      type="range"
                      className="nx-range"
                      min={2000}
                      max={30000}
                      step={500}
                      value={consumption}
                      onChange={(e) => setConsumption(Number(e.target.value))}
                      aria-label="Årsförbrukning"
                    />
                  </div>
                  <div className="nx-slider-group">
                    <div className="nx-slider-row">
                      <span className="nx-slider-name">Takyta</span>
                      <span className="nx-slider-val">{roofArea} m²</span>
                    </div>
                    <input
                      type="range"
                      className="nx-range"
                      min={20}
                      max={200}
                      step={5}
                      value={roofArea}
                      onChange={(e) => setRoofArea(Number(e.target.value))}
                      aria-label="Takyta"
                    />
                  </div>
                  <div className="nx-step-heading">Taktyp</div>
                  {(
                    [
                      { key: "sadel" as const, icon: "🏠", label: "Sadeltak", sub: "Bäst soleffekt" },
                      { key: "platt" as const, icon: "▬", label: "Platt tak", sub: "Flexibel vinkel" },
                      { key: "pulpet" as const, icon: "📐", label: "Pulpettak", sub: "God effekt" },
                      { key: "mansard" as const, icon: "🏰", label: "Mansardtak", sub: "Anpassad lösning" },
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.key}
                      type="button"
                      className={`nx-option-row ${roofType === opt.key ? "selected" : ""}`}
                      onClick={() => setRoofType(opt.key)}
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
                  <div className="nx-step-heading">Välj din region</div>
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
                  <div className="nx-stats">
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

                <div className={`nx-step ${currentStep === 3 ? "active" : ""}`}>
                  <div className="offert-hero">
                    <div className="offert-hero-tag">✦ Din personliga offert</div>
                    <div className="offert-hero-amount">{fmt(calc.savings)} kr</div>
                    <div className="offert-hero-label">
                      beräknad besparing per år — baserat på dina uppgifter
                    </div>
                    <div className="offert-hero-rows">
                      <div className="offert-mini">
                        <div className="offert-mini-val">{fmt(calc.installAfterROT)} kr</div>
                        <div className="offert-mini-label">Systemkostnad efter ROT</div>
                      </div>
                      <div className="offert-mini">
                        <div className="offert-mini-val">{calc.payback.toFixed(1)} år</div>
                        <div className="offert-mini-label">Återbetalningstid</div>
                      </div>
                      <div className="offert-mini">
                        <div className="offert-mini-val">{fmt(calc.profit25)} kr</div>
                        <div className="offert-mini-label">Vinst över 25 år</div>
                      </div>
                      <div className="offert-mini">
                        <div className="offert-mini-val">{calc.co2} ton</div>
                        <div className="offert-mini-label">CO₂-besparing/år</div>
                      </div>
                    </div>
                  </div>

                  <div className="offert-locked-wrapper" role="button" tabIndex={0} onClick={focusEmail} onKeyDown={(e) => e.key === "Enter" && focusEmail()}>
                    <div className="offert-locked-content">
                      <div className="offert-summary-title">Din offert</div>
                      <div className="offert-line">
                        <span>Förbrukning</span>
                        <span className="offert-line-val">{fmt(calc.c)} kWh/år</span>
                      </div>
                      <div className="offert-line">
                        <span>Takyta</span>
                        <span className="offert-line-val">{calc.r} m²</span>
                      </div>
                      <div className="offert-line">
                        <span>Taktyp</span>
                        <span className="offert-line-val">{ROOF_NAMES[roofType]}</span>
                      </div>
                      <div className="offert-line">
                        <span>Region</span>
                        <span className="offert-line-val">{REG_NAMES[region]}</span>
                      </div>
                      <div className="offert-line">
                        <span>Systemstorlek</span>
                        <span className="offert-line-val">{calc.kwp.toFixed(1)} kWp</span>
                      </div>
                      <div className="offert-line">
                        <span>Antal paneler</span>
                        <span className="offert-line-val">{calc.panels} st</span>
                      </div>
                      <div className="offert-line">
                        <span>Installationspris</span>
                        <span className="offert-line-val">{fmt(calc.installAfterROT)} kr</span>
                      </div>
                      <div className="offert-line">
                        <span>Återbetalningstid</span>
                        <span className="offert-line-val">{calc.payback.toFixed(1)} år</span>
                      </div>
                    </div>
                    <div className="offert-lock-overlay">
                      <div className="lock-icon">🔒</div>
                      <div className="lock-label">Fyll i din e-post för att låsa upp</div>
                      <div className="lock-sub">Din fullständiga offert väntar på dig — gratis</div>
                    </div>
                  </div>

                  <div className="urgency-strip">
                    ⚡ Just nu matchar 3 installatörer nära dig — lås din offert idag.
                  </div>

                  <div className="trust-row">
                    <div className="trust-item">
                      <span className="trust-check">✓</span> Kostnadsfritt
                    </div>
                    <div className="trust-item">
                      <span className="trust-check">✓</span> Ingen bindning
                    </div>
                    <div className="trust-item">
                      <span className="trust-check">✓</span> Svar inom 24h
                    </div>
                    <div className="trust-item">
                      <span className="trust-check">✓</span> Certifierade installatörer
                    </div>
                  </div>

                  <div className="form-section-label">Vart ska vi skicka din offert?</div>
                  <div className="nx-form-row">
                    <div className="nx-form-group">
                      <label className="nx-form-label" htmlFor="nx-fname">
                        Förnamn
                      </label>
                      <input
                        id="nx-fname"
                        className="nx-input"
                        type="text"
                        placeholder="Anna"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </div>
                    <div className="nx-form-group">
                      <label className="nx-form-label" htmlFor="nx-lname">
                        Efternamn
                      </label>
                      <input
                        id="nx-lname"
                        className="nx-input"
                        type="text"
                        placeholder="Svensson"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="nx-form-group">
                    <label className="nx-form-label" htmlFor="nx-email">
                      E-post (krävs)
                    </label>
                    <input
                      ref={emailRef}
                      id="nx-email"
                      className={`nx-input ${emailError ? "nx-input-error" : ""}`}
                      type="email"
                      placeholder="anna@exempel.se"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setEmailError(false);
                      }}
                    />
                  </div>
                  <div className="nx-form-group">
                    <label className="nx-form-label" htmlFor="nx-phone">
                      Telefon (valfritt)
                    </label>
                    <input
                      id="nx-phone"
                      className="nx-input"
                      type="tel"
                      placeholder="070 XXX XX XX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div className="nx-form-group">
                    <label className="nx-form-label" htmlFor="nx-address">
                      Adress (valfritt)
                    </label>
                    <input
                      id="nx-address"
                      className="nx-input"
                      type="text"
                      placeholder="Gatuadress, postnummer och ort"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>

                  <div className="nx-honeypot" aria-hidden="true">
                    <input
                      id="nx-hp"
                      tabIndex={-1}
                      autoComplete="new-password"
                      value={nxHp}
                      onChange={(e) => setNxHp(e.target.value)}
                    />
                  </div>

                  {submitStatus === "error" && (
                    <p className="text-sm text-red-600 mb-2">
                      Något gick fel. Försök igen.
                      {submitErrorDetail ? (
                        <span className="block mt-1 text-xs opacity-90 break-words">
                          {submitErrorDetail}
                        </span>
                      ) : null}
                    </p>
                  )}
                  <button
                    type="button"
                    className="nx-cta"
                    onClick={submitLead}
                    disabled={submitStatus === "sending"}
                  >
                    {submitStatus === "sending" ? "Skickar…" : "Lås upp min offert — helt gratis ›"}
                  </button>
                  <div className="nx-cta-note">
                    🔒 Vi delar aldrig dina uppgifter med tredje part.
                  </div>
                </div>
              </div>

              <div className="nx-footer" id="calcFooter">
                <button
                  type="button"
                  className="nx-nav-btn"
                  onClick={() => navigate(-1)}
                  disabled={currentStep === 1}
                >
                  ← Tillbaka
                </button>
                <span className="nx-footer-note">
                  {currentStep < 3
                    ? "Gratis · Ingen bindning · 60 sekunder"
                    : "🔒 Dina uppgifter är säkra"}
                </span>
                {currentStep < 3 && (
                  <button type="button" className="nx-nav-btn primary" onClick={() => navigate(1)}>
                    Nästa →
                  </button>
                )}
              </div>
            </>
          )}

          <div className={`success-screen ${showSuccess ? "visible" : ""}`} id="successScreen">
            <div className="success-icon">🎉</div>
            <div className="success-title">Din offert är upplåst!</div>
            <div className="success-sub">
              Vi skickar din fullständiga offert till <strong>{email.trim()}</strong> inom 24 timmar.
              Certifierade installatörer nära dig kontaktar dig med konkreta priser.
            </div>
            <div className="success-summary">
              <div className="offert-summary-title" style={{ marginBottom: 10 }}>
                Din offert
              </div>
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
          </div>
        </div>
      </div>
    </section>
  );
}
