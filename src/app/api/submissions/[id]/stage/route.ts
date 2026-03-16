import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { store } from "@/lib/store";
import type { PipelineStage } from "@/lib/store";

const STAGES: PipelineStage[] = [
  "leads",
  "ring_senare",
  "booked_meeting",
  "specialmarkerad",
  "nej_tack",
];

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
  const stage = body.stage;
  if (!stage || !STAGES.includes(stage)) {
    return NextResponse.json({ error: "Invalid stage" }, { status: 400 });
  }
  const ok = store.setSubmissionStage(params.id, stage as PipelineStage);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true, stage });
}
