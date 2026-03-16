import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { store } from "@/lib/store";

export async function GET(request: NextRequest) {
  const cookie = request.headers.get("cookie");
  const auth = request.headers.get("authorization");
  if (!isAdminAuthenticated(cookie, auth)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const visits = store.getVisits();
  return NextResponse.json(visits);
}

export async function POST(request: NextRequest) {
  const url = request.nextUrl;
  const path = url.searchParams.get("path") ?? undefined;
  const userAgent = request.headers.get("user-agent") ?? undefined;
  store.addVisit({ path, userAgent });
  return NextResponse.json({ ok: true });
}
