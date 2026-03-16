import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated, isLegacyAdmin } from "@/lib/admin-auth";
import { store } from "@/lib/store";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const cookie = request.headers.get("cookie");
  const auth = request.headers.get("authorization");
  if (!isAdminAuthenticated(cookie, auth)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isLegacyAdmin(cookie, auth)) {
    return NextResponse.json(
      { error: "Endast admin kan ta bort användare." },
      { status: 403 }
    );
  }
  const ok = store.deleteAdminUser(params.id);
  if (!ok) return NextResponse.json({ error: "Användaren hittades inte" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
