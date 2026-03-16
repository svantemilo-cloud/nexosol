import { NextResponse } from "next/server";
import { getAdminClearCookieHeader } from "@/lib/admin-auth";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.headers.set("Set-Cookie", getAdminClearCookieHeader());
  return res;
}
