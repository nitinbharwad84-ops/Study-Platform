import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { requirePermission, authErrorResponse } from "@/lib/auth/session";
import { logAuditEvent } from "@/lib/admin/audit";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/providers
 */
export async function GET(req: NextRequest) {
  try {
    await requirePermission("can_manage_providers", req);

    const supabaseAdmin = createServerClient();

    const { data: configs, error } = await supabaseAdmin
      .from("provider_configs")
      .select("*")
      .order("provider_name", { ascending: true });

    if (error) {
      return NextResponse.json({ error: "Failed to fetch provider configs." }, { status: 500 });
    }

    return NextResponse.json({ configs });
  } catch (error: unknown) {
    return authErrorResponse(error as Error);
  }
}

/**
 * POST /api/admin/providers
 * Upsert provider configuration.
 */
export async function POST(req: NextRequest) {
  try {
    const admin = await requirePermission("can_manage_providers", req);
    const { provider_name, model_name, is_active, api_key, subjects } = await req.json();

    if (!provider_name) {
      return NextResponse.json({ error: "Provider name is required." }, { status: 400 });
    }

    const supabaseAdmin = createServerClient();

    const payload: Record<string, unknown> = {
      provider_name,
      updated_at: new Date().toISOString(),
    };
    if (model_name) payload.model_name = model_name;
    if (is_active !== undefined) payload.is_active = is_active;
    if (api_key) payload.api_key = api_key;
    if (subjects) payload.subjects = subjects;

    const { data: config, error } = await supabaseAdmin
      .from("provider_configs")
      .upsert(payload, { onConflict: "provider_name" })
      .select()
      .single();

    if (error) {
      console.error("[POST /api/admin/providers] Upsert error:", error);
      return NextResponse.json({ error: "Failed to update provider config." }, { status: 500 });
    }

    // Log the event
    await logAuditEvent({
      actorId: admin.id,
      actorEmail: admin.email,
      action: "Update AI Provider",
      entityType: "AIProvider",
      entityId: provider_name,
      details: { model_name, is_active, has_api_key: !!api_key },
      severity: "info",
    });

    return NextResponse.json({ config });
  } catch (error: unknown) {
    return authErrorResponse(error as Error);
  }
}
