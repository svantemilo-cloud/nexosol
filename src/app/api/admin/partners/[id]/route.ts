import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { store } from "@/lib/store";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const cookie = request.headers.get("cookie");
  const auth = request.headers.get("authorization");
  if (!isAdminAuthenticated(cookie, auth)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const ok = store.updatePartner(params.id, {
      companyName: body.companyName?.trim(),
      email: body.email?.trim(),
      contactName: body.contactName?.trim(),
      contactPhone: body.contactPhone?.trim(),
      logoUrl: body.logoUrl?.trim() || undefined,
      address: body.address?.trim(),
      avtalDeals: body.avtalDeals?.trim() || undefined,
      dealsPerLeads: body.dealsPerLeads?.trim() || undefined,
      notes: body.notes?.trim() || undefined,
    });
    if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(store.getPartners().find((p) => p.id === params.id));
  } catch (e) {
    return NextResponse.json({ error: "Ogiltig begäran" }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const cookie = request.headers.get("cookie");
  const auth = request.headers.get("authorization");
  if (!isAdminAuthenticated(cookie, auth)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const ok = store.deletePartner(params.id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
