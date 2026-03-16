import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { store } from "@/lib/store";

export async function POST(request: NextRequest) {
  const cookie = request.headers.get("cookie");
  const auth = request.headers.get("authorization");
  if (!isAdminAuthenticated(cookie, auth)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const email = body.email?.trim();
    const address = body.address?.trim();
    if (!email || !address) {
      return NextResponse.json(
        { error: "E-post och adress krävs" },
        { status: 400 }
      );
    }
    const customerType = body.customerType === "foretag" ? "foretag" : "privat";
    const submission = store.addManualSubmission({
      firstName: body.firstName?.trim() || undefined,
      lastName: body.lastName?.trim() || undefined,
      email,
      phone: body.phone?.trim() || undefined,
      address,
      customerType,
    });
    const pod = body.pod?.trim();
    if (pod && ["leon", "vincent", "wilmer", "unassigned"].includes(pod)) {
      store.setSubmissionPod(submission.id, pod as "leon" | "vincent" | "wilmer" | "unassigned");
    }
    const out = store.getSubmissions().find((s) => s.id === submission.id) ?? submission;
    return NextResponse.json(out);
  } catch (e) {
    return NextResponse.json({ error: "Ogiltig begäran" }, { status: 400 });
  }
}
