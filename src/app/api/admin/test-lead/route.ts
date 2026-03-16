import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { store } from "@/lib/store";

export async function POST(request: NextRequest) {
  const cookie = request.headers.get("cookie");
  const auth = request.headers.get("authorization");
  if (!isAdminAuthenticated(cookie, auth)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const submission = store.addTestLead();
  return NextResponse.json(submission);
}
