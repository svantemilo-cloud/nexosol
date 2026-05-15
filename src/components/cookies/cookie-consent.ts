export type CookieConsent = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  decidedAt: number;
};

const STORAGE_KEY = "nx_cookie_consent_v1";

export function readCookieConsent(): CookieConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CookieConsent>;
    if (parsed.necessary !== true) return null;
    if (typeof parsed.analytics !== "boolean") return null;
    if (typeof parsed.marketing !== "boolean") return null;
    if (typeof parsed.decidedAt !== "number") return null;
    return parsed as CookieConsent;
  } catch {
    return null;
  }
}

export function writeCookieConsent(consent: CookieConsent) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
  } catch {}

  // Minimal cookie for server-side visibility if needed later.
  try {
    const value = consent.analytics || consent.marketing ? "all" : "necessary";
    const maxAge = 60 * 60 * 24 * 365; // 1 year
    document.cookie = `${STORAGE_KEY}=${value}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
  } catch {}
}

