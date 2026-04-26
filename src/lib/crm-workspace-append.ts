import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export type PublicLeadBody = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  consumptionKwh?: unknown;
  roofAreaM2?: unknown;
  roofType?: string;
  region?: string;
  includeBattery?: unknown;
  offertChoices?: unknown;
  estimatedProductionKwh?: unknown;
  estimatedRoiYears?: unknown;
  customerType?: string;
};

function targetUserId(): string | null {
  const a = process.env.CRM_LEADS_TARGET_USER_ID?.trim();
  const b = process.env.NEXOADMIN_CRM_USER_ID?.trim();
  return a || b || null;
}

function supabaseUrl(): string | null {
  return (
    process.env.SUPABASE_URL?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ||
    null
  );
}

export function isCrmWorkspaceSyncConfigured(): boolean {
  return Boolean(
    supabaseUrl() &&
      process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() &&
      targetUserId()
  );
}

function serviceClient(): SupabaseClient | null {
  const url = supabaseUrl();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function normalizeOffertChoices(raw: unknown): Record<string, boolean> {
  if (!raw || typeof raw !== "object") return {};
  const out: Record<string, boolean> = {};
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    out[k] = Boolean(v);
  }
  return out;
}

export function buildCrmWorkspaceSubmission(
  body: PublicLeadBody,
  id: string,
  createdAt: string
): Record<string, unknown> {
  const customerType = body.customerType === "foretag" ? "foretag" : "privat";
  return {
    id,
    createdAt,
    source: process.env.CRM_LEAD_SOURCE?.trim() || "website",
    customerType,
    firstName: String(body.firstName ?? ""),
    lastName: String(body.lastName ?? ""),
    email: String(body.email ?? ""),
    phone: String(body.phone ?? ""),
    address: String(body.address ?? ""),
    consumptionKwh: Number(body.consumptionKwh) || 0,
    roofAreaM2: Number(body.roofAreaM2) || 0,
    roofType: String(body.roofType ?? ""),
    region: String(body.region ?? ""),
    includeBattery: Boolean(body.includeBattery),
    offertChoices: normalizeOffertChoices(body.offertChoices),
    estimatedProductionKwh: Number(body.estimatedProductionKwh) || 0,
    estimatedRoiYears: Number(body.estimatedRoiYears) || 0,
    stage: "leads",
    pod: "unassigned",
  };
}

export async function appendLeadToCrmWorkspace(
  body: PublicLeadBody,
  leadId: string,
  createdAt: string
): Promise<{ ok: true } | { ok: false; message: string }> {
  try {
    if (!isCrmWorkspaceSyncConfigured()) {
      return { ok: false, message: "CRM workspace sync is not configured" };
    }
    const userId = targetUserId()!;
    const supabase = serviceClient()!;
    const newItem = buildCrmWorkspaceSubmission(body, leadId, createdAt);

    const { data: row, error: readError } = await supabase
      .from("crm_user_workspace")
      .select("submissions")
      .eq("user_id", userId)
      .maybeSingle();

    if (readError) {
      return { ok: false, message: readError.message };
    }

    if (!row) {
      const { error: insertError } = await supabase
        .from("crm_user_workspace")
        .insert({ user_id: userId, submissions: [newItem] });

      if (insertError) {
        return {
          ok: false,
          message: `Ingen workspace-rad fanns och insert misslyckades: ${insertError.message}. Logga in i Nexoadmin med det kontot en gång, eller lägg till saknade kolumner (NOT NULL) i tabellen.`,
        };
      }
      return { ok: true };
    }

    const raw = row.submissions as unknown;
    const submissions = Array.isArray(raw) ? [...raw] : [];
    const next = [...submissions, newItem];

    const { data: updatedRows, error: writeError } = await supabase
      .from("crm_user_workspace")
      .update({ submissions: next })
      .eq("user_id", userId)
      .select("user_id");

    if (writeError) {
      return { ok: false, message: writeError.message };
    }
    if (!updatedRows?.length) {
      return {
        ok: false,
        message:
          "Uppdateringen träffade ingen rad i crm_user_workspace (kolla att CRM_LEADS_TARGET_USER_ID stämmer med auth.users och att tabellen är public för service role).",
      };
    }
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, message: `Nätverk eller oväntat fel mot Supabase: ${msg}` };
  }
}
