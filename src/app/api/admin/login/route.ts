import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import {
  getAdminPassword,
  getAdminSetCookieHeader,
  getAdminSetCookieHeaderForUser,
} from "@/lib/admin-auth";
import { createAdminToken } from "@/lib/admin-token";
import { store } from "@/lib/store";

function hashPassword(password: string): string {
  return createHash("sha256").update(password, "utf8").digest("hex");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password, usernameOrEmail } = body;
    const legacyPassword = getAdminPassword();

    // "admin" eller tomt användarfält = enkel admin-inloggning med bara lösenord
    const isLegacyLogin =
      (usernameOrEmail == null || String(usernameOrEmail).trim() === "" || String(usernameOrEmail).trim().toLowerCase() === "admin") &&
      password != null;
    if (isLegacyLogin && password === legacyPassword) {
      const token = createAdminToken("legacy");
      const res = NextResponse.json({ ok: true, token });
      res.headers.set("Set-Cookie", getAdminSetCookieHeader());
      return res;
    }
    if (isLegacyLogin) {
      return NextResponse.json({ ok: false, error: "Fel lösenord" }, { status: 401 });
    }

    if (usernameOrEmail != null && String(usernameOrEmail).trim() !== "" && password != null) {
      const user = store.findAdminUserByLogin(String(usernameOrEmail).trim());
      if (user && user.passwordHash === hashPassword(password)) {
        const token = createAdminToken(user.id);
        const res = NextResponse.json({ ok: true, token });
        res.headers.set("Set-Cookie", getAdminSetCookieHeaderForUser(user.id));
        return res;
      }
      return NextResponse.json(
        { ok: false, error: "Fel användarnamn/e-post eller lösenord" },
        { status: 401 }
      );
    }

    return NextResponse.json({ ok: false, error: "Ange lösenord" }, { status: 400 });
  } catch {
    return NextResponse.json({ ok: false, error: "Ogiltig begäran" }, { status: 400 });
  }
}
