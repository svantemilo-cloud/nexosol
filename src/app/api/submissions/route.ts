import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  appendLeadToCrmWorkspace,
  isCrmWorkspaceSyncConfigured,
  normalizeOffertChoices,
  type PublicLeadBody,
} from "@/lib/crm-workspace-append";
import { allowSubmissionFromClient } from "@/lib/submission-rate-limit";
import { store } from "@/lib/store";

function clientKey(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

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
    const body = (await request.json()) as PublicLeadBody & {
      fax?: string;
      _nx_hp?: string;
    };

    const hp = typeof body._nx_hp === "string" ? body._nx_hp : body.fax;
    if (typeof hp === "string" && hp.trim() !== "") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const ingress = process.env.CRM_LEADS_INGRESS_SECRET?.trim();
    if (ingress) {
      const h = request.headers.get("x-crm-leads-secret");
      const auth = request.headers.get("authorization");
      const bearer =
        auth?.startsWith("Bearer ") ? auth.slice("Bearer ".length).trim() : null;
      if (h !== ingress && bearer !== ingress) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    if (!allowSubmissionFromClient(clientKey(request))) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const email = body.email?.trim();
    if (!email) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const leadId = randomUUID();
    const createdAt = new Date().toISOString();
    const offertChoices = normalizeOffertChoices(body.offertChoices);

    if (isCrmWorkspaceSyncConfigured()) {
      const crm = await appendLeadToCrmWorkspace(body, leadId, createdAt);
      if (!crm.ok) {
        return NextResponse.json(
          { error: "Kunde inte spara till CRM", detail: crm.message },
          { status: 503 }
        );
      }
    }

    const submission = store.addSubmission({
      source: "calculator",
      firstName: body.firstName,
      lastName: body.lastName,
      email,
      phone: body.phone,
      address: body.address ?? "",
      consumptionKwh: Number(body.consumptionKwh) || 0,
      roofAreaM2: Number(body.roofAreaM2) || 0,
      roofType: body.roofType ?? "",
      region: body.region ?? "",
      includeBattery: Boolean(body.includeBattery),
      offertChoices,
      estimatedProductionKwh: Number(body.estimatedProductionKwh) || 0,
      estimatedRoiYears: Number(body.estimatedRoiYears) || 0,
      customerType: body.customerType === "foretag" ? "foretag" : undefined,
      id: leadId,
      createdAt,
    });
    return NextResponse.json({ ok: true, id: submission.id });
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
}
