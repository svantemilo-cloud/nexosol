"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator as CalcIcon, ChevronRight, ChevronLeft } from "lucide-react";

const ROOF_TYPES = [
  { value: "platt", label: "Platt tak" },
  { value: "sadeltak", label: "Sadeltak" },
  { value: "pulpet", label: "Pulpet tak" },
];

const REGIONS = [
  { value: "syd", label: "Södra Sverige" },
  { value: "mitt", label: "Mellersta Sverige" },
  { value: "nord", label: "Norra Sverige" },
];

const OFFERT_OPTIONS = [
  { id: "paneler", label: "Solpaneler" },
  { id: "batteri", label: "Batteri" },
  { id: "vaxelriktare", label: "Växelriktare" },
  { id: "komplett", label: "Komplett system" },
];

const EL_PRICE_KR = 2; // kr/kWh, förenklat

// Production ≈ roof area (m²) × 155 kWh/m²/year (simplified)
function estimatedProduction(m2: number): number {
  return Math.round(m2 * 155);
}

// Årlig besparing (kr) vid egen produktion
function estimatedYearlySavings(m2: number): number {
  return estimatedProduction(m2) * EL_PRICE_KR;
}

// Simple ROI: assume system cost, production, el ~2 kr/kWh
function estimatedROIYears(m2: number, includeBattery: boolean): number {
  const prod = m2 * 155;
  const systemCost = 80000 + m2 * 8000 + (includeBattery ? 80000 : 0);
  const yearlySavings = prod * EL_PRICE_KR;
  if (yearlySavings <= 0) return 0;
  return Math.round((systemCost / yearlySavings) * 10) / 10;
}

export function Calculator() {
  const [step, setStep] = useState(1);
  const [consumption, setConsumption] = useState(10000);
  const [roofArea, setRoofArea] = useState(50);
  const [roofType, setRoofType] = useState("sadeltak");
  const [region, setRegion] = useState("mitt");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [includeBattery, setIncludeBattery] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [offertChoices, setOffertChoices] = useState<Record<string, boolean>>({
    paneler: true,
    batteri: false,
    vaxelriktare: true,
    komplett: false,
  });

  const canProceedToResults = email.trim().length > 0 && address.trim().length > 0;

  const production = useMemo(() => estimatedProduction(roofArea), [roofArea]);
  const roiYears = useMemo(
    () => estimatedROIYears(roofArea, includeBattery),
    [roofArea, includeBattery]
  );
  const yearlySavingsKr = useMemo(
    () => estimatedYearlySavings(roofArea),
    [roofArea]
  );

  const toggleOffert = (id: string) => {
    setOffertChoices((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubmitOffert = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus("sending");
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName.trim() || undefined,
          lastName: lastName.trim() || undefined,
          email,
          address,
          phone: phone || undefined,
          consumptionKwh: consumption,
          roofAreaM2: roofArea,
          roofType,
          region,
          includeBattery,
          offertChoices,
          estimatedProductionKwh: production,
          estimatedRoiYears: roiYears,
        }),
      });
      if (!res.ok) throw new Error("Kunde inte skicka");
      setSubmitStatus("ok");
    } catch {
      setSubmitStatus("error");
    }
  };

  return (
    <section id="calculator" className="py-10 px-4 sm:px-6 scroll-mt-20 bg-surface">
      <div className="max-w-3xl mx-auto">
        <div className="rounded-2xl bg-white shadow-soft-lg border border-forest/10 overflow-hidden">
          {/* Mörkgrön header med ikon och titel */}
          <div className="bg-forest text-white px-5 py-3 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 rounded-t-2xl">
            <div className="flex items-center gap-3">
              <CalcIcon className="w-7 h-7 shrink-0" aria-hidden />
              <h2 className="text-lg font-bold">Nexosol-kalkylatorn</h2>
            </div>
            <p className="text-white/90 text-sm sm:ml-0">Få en snabb uppskattning – bara några fält</p>
          </div>

          <div className="p-5 bg-white">
            {/* Progress bar: visuell stegindikator */}
            <div className="mb-5">
              <div className="flex gap-1.5 mb-1.5">
                {[1, 2, 3].map((s) => {
                  const canGoToStep = s === 1 || (s === 2 && canProceedToResults) || s === 3;
                  return (
                    <button
                      key={s}
                      onClick={() => canGoToStep && setStep(s)}
                      disabled={!canGoToStep}
                      className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${
                        step === s
                          ? "bg-forest text-white"
                          : canGoToStep
                            ? "bg-forest/10 text-forest hover:bg-forest/15"
                            : "bg-forest/5 text-forest/50 cursor-not-allowed"
                      }`}
                    >
                      Steg {s}
                    </button>
                  );
                })}
              </div>
              <div className="h-1 rounded-full bg-forest/10 overflow-hidden">
                <motion.div
                  className="h-full bg-forest rounded-full"
                  initial={false}
                  animate={{ width: `${(step / 3) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {/* Realtids-teaser: lockar till att fylla i */}
                  <div className="rounded-xl bg-forest/5 border border-forest/10 px-3 py-2.5 text-center">
                    <p className="text-xs text-forest/60">Ungefärlig årlig besparing med solceller</p>
                    <p className="text-base font-semibold text-forest/80 tabular-nums" suppressHydrationWarning>
                      ca {yearlySavingsKr.toLocaleString("sv-SE")} kr/år
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-forest mb-1.5">
                      Årsförbrukning (kWh)
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min={0}
                        max={30000}
                        step={500}
                        value={consumption}
                        onChange={(e) =>
                          setConsumption(Number(e.target.value))
                        }
                        className="flex-1 calculator-slider"
                        aria-label="Årsförbrukning i kilowattimmar"
                      />
                      <span className="text-forest font-semibold w-20 text-right tabular-nums text-sm" suppressHydrationWarning>
                        {consumption.toLocaleString("sv-SE")}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-forest mb-1.5">
                      Takyta (m²)
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min={0}
                        max={200}
                        step={5}
                        value={roofArea}
                        onChange={(e) => setRoofArea(Number(e.target.value))}
                        className="flex-1 calculator-slider"
                        aria-label="Takyta i kvadratmeter"
                      />
                      <span className="text-forest font-semibold w-14 text-right tabular-nums">
                        {roofArea}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-forest mb-1.5">
                      Taktyp
                    </label>
                    <select
                      value={roofType}
                      onChange={(e) => setRoofType(e.target.value)}
                      className="w-full rounded-lg border border-forest/20 bg-surface px-3 py-2.5 text-forest text-sm"
                    >
                      {ROOF_TYPES.map((r) => (
                        <option key={r.value} value={r.value}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-forest mb-1.5">
                      Region
                    </label>
                    <select
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      className="w-full rounded-lg border border-forest/20 bg-surface px-3 py-2.5 text-forest text-sm"
                    >
                      {REGIONS.map((r) => (
                        <option key={r.value} value={r.value}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-forest mb-1.5">
                        Förnamn
                      </label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Förnamn"
                        className="w-full rounded-lg border border-forest/20 bg-surface px-3 py-2.5 text-forest text-sm placeholder:text-forest/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-forest mb-1.5">
                        Efternamn
                      </label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Efternamn"
                        className="w-full rounded-lg border border-forest/20 bg-surface px-3 py-2.5 text-forest text-sm placeholder:text-forest/50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-forest mb-1.5">
                      E-post <span className="text-forest/60 font-normal">(krävs)</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="din@epost.se"
                      className="w-full rounded-lg border border-forest/20 bg-surface px-3 py-2.5 text-forest text-sm placeholder:text-forest/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-forest mb-1.5">
                      Telefon <span className="text-forest/60 font-normal">(valfritt)</span>
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="07X XXX XX XX"
                      className="w-full rounded-lg border border-forest/20 bg-surface px-3 py-2.5 text-forest text-sm placeholder:text-forest/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-forest mb-1.5">
                      Adress <span className="text-forest/60 font-normal">(krävs)</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Gatuadress, postnummer och ort"
                      className="w-full rounded-lg border border-forest/20 bg-surface px-3 py-2.5 text-forest text-sm placeholder:text-forest/50"
                    />
                  </div>
                  {!canProceedToResults && (
                    <p className="text-xs text-forest/60">
                      Fyll i e-post och adress så visar vi din beräknade besparing.
                    </p>
                  )}
                  <button
                    onClick={() => canProceedToResults && setStep(2)}
                    disabled={!canProceedToResults}
                    className={`w-full rounded-xl font-semibold py-3 flex items-center justify-center gap-2 text-sm ${
                      canProceedToResults
                        ? "bg-forest text-white hover:bg-forest-light"
                        : "bg-forest/20 text-forest/50 cursor-not-allowed"
                    }`}
                  >
                    Nästa – Se besparing
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="rounded-xl bg-forest/5 p-3 space-y-1">
                    <p className="text-xs text-forest/70">Beräknad årsproduktion</p>
                    <p className="text-xl font-bold text-forest" suppressHydrationWarning>
                      {production.toLocaleString("sv-SE")} kWh/år
                    </p>
                  </div>
                  <div className="rounded-xl bg-forest/5 p-3 space-y-1">
                    <p className="text-xs text-forest/70">ROI (återbetalningstid)</p>
                    <p className="text-xl font-bold text-forest">
                      ca {roiYears} år
                    </p>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl border border-forest/10">
                    <span className="font-medium text-forest">
                      Inkludera batteri
                    </span>
                    <button
                      role="switch"
                      aria-checked={includeBattery}
                      onClick={() => setIncludeBattery(!includeBattery)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        includeBattery ? "bg-forest" : "bg-forest/20"
                      }`}
                    >
                      <motion.span
                        className="absolute top-1 w-4 h-4 rounded-full bg-white shadow"
                        animate={{ x: includeBattery ? 26 : 4 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setStep(1)}
                      className="flex-1 rounded-xl border border-forest/20 text-forest font-medium py-2.5 flex items-center justify-center gap-1.5 text-sm"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Tillbaka
                    </button>
                    <button
                      onClick={() => setStep(3)}
                      className="flex-1 rounded-xl bg-forest text-white font-semibold py-2.5 flex items-center justify-center gap-1.5 text-sm hover:bg-forest-light"
                    >
                      Få offert
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <p className="text-sm text-forest/80">
                    Välj vad du vill ha offert på:
                  </p>
                  <div className="space-y-2">
                    {OFFERT_OPTIONS.map((opt) => (
                      <label
                        key={opt.id}
                        className="flex items-center gap-3 p-3 rounded-lg border border-forest/10 cursor-pointer hover:bg-forest/5 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={offertChoices[opt.id] ?? false}
                          onChange={() => toggleOffert(opt.id)}
                          className="w-4 h-4 rounded border-forest/30 text-forest"
                        />
                        <span className="font-medium text-forest text-sm">
                          {opt.label}
                        </span>
                      </label>
                    ))}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-forest mb-1.5">E-post</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="din@epost.se"
                      className="w-full rounded-lg border border-forest/20 bg-surface px-3 py-2.5 text-forest text-sm placeholder:text-forest/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-forest mb-1.5">Adress</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Gatuadress, postnummer och ort"
                      className="w-full rounded-lg border border-forest/20 bg-surface px-3 py-2.5 text-forest text-sm placeholder:text-forest/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-forest mb-1.5">Telefon (valfritt)</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="07X XXX XX XX"
                      className="w-full rounded-lg border border-forest/20 bg-surface px-3 py-2.5 text-forest text-sm placeholder:text-forest/50"
                    />
                  </div>
                  {submitStatus === "ok" && (
                    <p className="text-sm text-forest font-medium">Tack! Vi återkommer med offerter.</p>
                  )}
                  {submitStatus === "error" && (
                    <p className="text-sm text-red-600">Något gick fel. Försök igen.</p>
                  )}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="flex-1 rounded-xl border border-forest/20 text-forest font-medium py-2.5 flex items-center justify-center gap-1.5 text-sm"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Tillbaka
                    </button>
                    <button
                      type="submit"
                      disabled={submitStatus === "sending"}
                      className="flex-1 rounded-xl bg-forest text-white font-semibold py-2.5 text-sm hover:bg-forest-light disabled:opacity-70"
                      onClick={handleSubmitOffert}
                    >
                      {submitStatus === "sending" ? "Skickar…" : "Skicka – Få offerter"}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
