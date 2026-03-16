import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { store } from "@/lib/store";

const VALID_STATUSES = ["ej_svar", "nej_tack", "bokat_mote", "ring_senare", "specialmarkerad"] as const;

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const cookie = request.headers.get("cookie");
  const auth = request.headers.get("authorization");
  if (!isAdminAuthenticated(cookie, auth)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const callStatus = body.callStatus;
  if (!VALID_STATUSES.includes(callStatus)) {
    return NextResponse.json({ error: "Invalid callStatus" }, { status: 400 });
  }
  const ok = store.setSubmissionCallStatus(params.id, callStatus);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true, callStatus });
}
