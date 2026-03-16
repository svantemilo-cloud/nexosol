import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { store } from "@/lib/store";

export async function GET(request: NextRequest) {
  const cookie = request.headers.get("cookie");
  const auth = request.headers.get("authorization");
  if (!isAdminAuthenticated(cookie, auth)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const partners = store.getPartners();
  return NextResponse.json(partners);
}

export async function POST(request: NextRequest) {
  const cookie = request.headers.get("cookie");
  const auth = request.headers.get("authorization");
  if (!isAdminAuthenticated(cookie, auth)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const partner = store.addPartner({
      companyName: body.companyName?.trim() ?? "",
      email: body.email?.trim() ?? "",
      contactName: body.contactName?.trim() ?? "",
      contactPhone: body.contactPhone?.trim() ?? "",
      logoUrl: body.logoUrl?.trim() || undefined,
      address: body.address?.trim() ?? "",
      avtalDeals: body.avtalDeals?.trim() || undefined,
      dealsPerLeads: body.dealsPerLeads?.trim() || undefined,
      notes: body.notes?.trim() || undefined,
    });
    return NextResponse.json(partner);
  } catch (e) {
    return NextResponse.json({ error: "Ogiltig begäran" }, { status: 400 });
  }
}
