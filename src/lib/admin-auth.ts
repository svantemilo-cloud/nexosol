import { verifyAdminToken, getBearerToken } from "./admin-token";

const ADMIN_COOKIE = "nexosol_admin";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || "nexosol";
}

export function getAdminCookieValue(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;
  const value = cookieHeader
    .split(";")
    .find((c) => c.trim().startsWith(`${ADMIN_COOKIE}=`))
    ?.split("=")[1]
    ?.trim();
  return value ?? null;
}

/** Returns authenticated user id (or "true" for legacy admin) from cookie or Bearer token, or null. */
export function getAdminUserIdFromRequest(
  cookieHeader: string | null,
  authHeader: string | null
): string | null {
  const token = getBearerToken(authHeader);
  if (token) {
    const userId = verifyAdminToken(token);
    if (userId) return userId;
  }
  const value = getAdminCookieValue(cookieHeader);
  if (value === "true" || (value != null && value.length > 0)) return value;
  return null;
}

export function isAdminAuthenticated(cookieHeader: string | null, authHeader?: string | null): boolean {
  const auth = getAdminUserIdFromRequest(cookieHeader, authHeader ?? null);
  return auth != null && auth.length > 0;
}

/** True if the request is from the legacy password-only admin (not a pod user). */
export function isLegacyAdmin(cookieHeader: string | null, authHeader: string | null): boolean {
  const id = getAdminUserIdFromRequest(cookieHeader, authHeader);
  return id === "true" || id === "legacy";
}

export function getAdminSetCookieHeader(): string {
  return `${ADMIN_COOKIE}=true; Path=/; HttpOnly; SameSite=Lax; Max-Age=${COOKIE_MAX_AGE}`;
}

export function getAdminSetCookieHeaderForUser(userId: string): string {
  return `${ADMIN_COOKIE}=${encodeURIComponent(userId)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${COOKIE_MAX_AGE}`;
}

export function getAdminClearCookieHeader(): string {
  return `${ADMIN_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}
