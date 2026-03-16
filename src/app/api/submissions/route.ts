import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { store } from "@/lib/store";

export async function GET(request: NextRequest) {
  const cookie = request.headers.get("cookie");
  const auth = request.headers.get("authorization");
  if (!isAdminAuthenticated(cookie, auth)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let submissions = store.getSubmissions();
  if (submissions.length === 0) {
    store.addTestLead();
    submissions = store.getSubmissions();
  }
  return NextResponse.json(submissions);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const submission = store.addSubmission({
      source: "calculator",
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email ?? "",
      phone: body.phone,
      address: body.address ?? "",
      consumptionKwh: Number(body.consumptionKwh) || 0,
      roofAreaM2: Number(body.roofAreaM2) || 0,
      roofType: body.roofType ?? "",
      region: body.region ?? "",
      includeBattery: Boolean(body.includeBattery),
      offertChoices: body.offertChoices ?? {},
      estimatedProductionKwh: Number(body.estimatedProductionKwh) || 0,
      estimatedRoiYears: Number(body.estimatedRoiYears) || 0,
    });
    return NextResponse.json({ ok: true, id: submission.id });
  } catch (e) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
}
