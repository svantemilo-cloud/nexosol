"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import type { CookieConsent } from "./cookie-consent";
import { readCookieConsent, writeCookieConsent } from "./cookie-consent";

function nowConsent(partial: Omit<CookieConsent, "decidedAt">): CookieConsent {
  return { ...partial, decidedAt: Date.now() };
}

export function CookieBanner() {
  const [consent, setConsent] = useState<CookieConsent | null>(null);
  const [open, setOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [draft, setDraft] = useState<Pick<CookieConsent, "analytics" | "marketing">>({
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const existing = readCookieConsent();
    setConsent(existing);
    setOpen(!existing);
    if (existing) {
      setDraft({ analytics: existing.analytics, marketing: existing.marketing });
    }
  }, []);

  const acceptAll = () => {
    const next = nowConsent({ necessary: true, analytics: true, marketing: true });
    writeCookieConsent(next);
    setConsent(next);
    setOpen(false);
    setSettingsOpen(false);
  };

  const acceptNecessaryOnly = () => {
    const next = nowConsent({ necessary: true, analytics: false, marketing: false });
    writeCookieConsent(next);
    setConsent(next);
    setOpen(false);
    setSettingsOpen(false);
  };

  const saveSelection = () => {
    const next = nowConsent({ necessary: true, analytics: draft.analytics, marketing: draft.marketing });
    writeCookieConsent(next);
    setConsent(next);
    setOpen(false);
    setSettingsOpen(false);
  };

  const canRender = useMemo(() => open || settingsOpen, [open, settingsOpen]);
  if (!canRender) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        className="absolute inset-0 bg-black/35"
        aria-label="Stäng cookie-dialog"
        onClick={acceptNecessaryOnly}
      />

      <div className="relative w-full max-w-2xl rounded-2xl border border-forest/10 bg-[#fbf4df] shadow-2xl">
        <button
          type="button"
          className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-xl text-forest/70 hover:bg-black/5 hover:text-forest"
          aria-label="Stäng"
          onClick={acceptNecessaryOnly}
        >
          <X className="h-5 w-5" aria-hidden />
        </button>

        {!settingsOpen ? (
          <div className="p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-forest mb-2">
              Välkommen till vår webbplats!
            </h2>
            <p className="text-sm font-semibold text-forest/80 mb-3">Denna sida använder cookies</p>
            <p className="text-sm text-forest/80 leading-relaxed">
              Vi använder cookies för att förbättra din upplevelse på vår webbplats och för att anpassa
              annonser. Genom att välja &quot;Acceptera alla&quot; godkänner du all användning av cookies,
              inklusive för analys och personanpassad annonsering.
            </p>
            <p className="mt-3 text-sm">
              <Link href="/integritetspolicy" className="text-coral underline underline-offset-2 hover:opacity-90">
                Läs mer i vår integritetspolicy
              </Link>
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-start">
              <button
                type="button"
                className="rounded-xl border border-forest/25 bg-white/70 px-5 py-3 text-sm font-semibold text-forest hover:bg-white/90 hover:border-forest/40"
                onClick={() => setSettingsOpen(true)}
              >
                Inställningar
              </button>
              <button
                type="button"
                className="rounded-xl bg-forest px-6 py-3 text-sm font-semibold text-white shadow-soft hover:bg-forest-light active:scale-[0.99] transition-transform"
                onClick={acceptAll}
              >
                Acceptera alla
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-forest mb-2">Cookie-inställningar</h2>
            <p className="text-sm text-forest/80 leading-relaxed mb-5">
              Nödvändiga cookies krävs för att webbplatsen ska fungera. Du kan välja om du vill tillåta
              analys och marknadsföring.
            </p>

            <div className="space-y-3">
              <div className="flex items-start justify-between gap-4 rounded-xl border border-forest/10 bg-white/60 p-4">
                <div>
                  <div className="font-semibold text-forest">Nödvändiga</div>
                  <div className="text-sm text-forest/70">Alltid aktiverade</div>
                </div>
                <span className="text-sm font-semibold text-forest/70">På</span>
              </div>

              <label className="flex items-start justify-between gap-4 rounded-xl border border-forest/10 bg-white/60 p-4 cursor-pointer">
                <div>
                  <div className="font-semibold text-forest">Analys</div>
                  <div className="text-sm text-forest/70">Hjälper oss förstå hur sajten används</div>
                </div>
                <input
                  type="checkbox"
                  className="mt-1 h-5 w-5 accent-forest"
                  checked={draft.analytics}
                  onChange={(e) => setDraft((d) => ({ ...d, analytics: e.target.checked }))}
                />
              </label>

              <label className="flex items-start justify-between gap-4 rounded-xl border border-forest/10 bg-white/60 p-4 cursor-pointer">
                <div>
                  <div className="font-semibold text-forest">Marknadsföring</div>
                  <div className="text-sm text-forest/70">För personanpassade annonser</div>
                </div>
                <input
                  type="checkbox"
                  className="mt-1 h-5 w-5 accent-forest"
                  checked={draft.marketing}
                  onChange={(e) => setDraft((d) => ({ ...d, marketing: e.target.checked }))}
                />
              </label>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                className="rounded-xl border border-forest/25 bg-white/70 px-5 py-3 text-sm font-semibold text-forest hover:bg-white/90 hover:border-forest/40"
                onClick={() => setSettingsOpen(false)}
              >
                Tillbaka
              </button>
              <button
                type="button"
                className="rounded-xl border border-forest/25 bg-white/70 px-5 py-3 text-sm font-semibold text-forest hover:bg-white/90 hover:border-forest/40"
                onClick={acceptNecessaryOnly}
              >
                Endast nödvändiga
              </button>
              <button
                type="button"
                className="rounded-xl bg-forest px-6 py-3 text-sm font-semibold text-white shadow-soft hover:bg-forest-light active:scale-[0.99] transition-transform"
                onClick={saveSelection}
              >
                Spara val
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

