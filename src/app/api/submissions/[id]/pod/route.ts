import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated, isLegacyAdmin } from "@/lib/admin-auth";
import { store } from "@/lib/store";
import type { PodId } from "@/lib/store";

const PODS: PodId[] = ["unassigned", "leon", "vincent", "wilmer"];

export async function PATCH(
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
      { error: "Endast admin kan tilldela leads till användare." },
      { status: 403 }
    );
  }
  const body = await request.json();
  const pod = body.pod;
  if (!pod || !PODS.includes(pod)) {
    return NextResponse.json({ error: "Invalid pod" }, { status: 400 });
  }
  const ok = store.setSubmissionPod(params.id, pod as PodId);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true, pod });
}
