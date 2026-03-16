import { createHmac, timingSafeEqual } from "crypto";

const TOKEN_SECRET = process.env.ADMIN_JWT_SECRET || process.env.ADMIN_PASSWORD || "nexosol";
const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export function createAdminToken(userId: string): string {
  const payload = JSON.stringify({
    id: userId,
    exp: Date.now() + TOKEN_TTL_MS,
  });
  const payloadB64 = Buffer.from(payload, "utf8").toString("base64url");
  const sig = createHmac("sha256", TOKEN_SECRET).update(payloadB64).digest("base64url");
  return `${payloadB64}.${sig}`;
}

export function verifyAdminToken(token: string): string | null {
  try {
    const [payloadB64, sig] = token.split(".");
    if (!payloadB64 || !sig) return null;
    const expected = createHmac("sha256", TOKEN_SECRET).update(payloadB64).digest("base64url");
    if (!timingSafeEqual(Buffer.from(sig, "base64url"), Buffer.from(expected, "base64url"))) return null;
    const payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf8"));
    if (payload.exp && payload.exp < Date.now()) return null;
    return typeof payload.id === "string" ? payload.id : null;
  } catch {
    return null;
  }
}

export function getBearerToken(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  return authHeader.slice(7).trim() || null;
}
